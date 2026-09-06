import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { generateDeterministicAudit, AuditPatient } from "./server/skinfoldAudit";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é um assistente especialista em nutrição clínica. Seu papel é gerar um resumo curto e profissional das observações clínicas e conduta nutricional baseando-se nos dados antropométricos fornecidos, visando ajudar um nutricionista em sua prescrição dietética. Resuma a composição corporal, TMB, IMC e sugira a conduta.",
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  // Análise de Consistência e Coerência Clínica de Dobras Cutâneas (IA)
  app.post("/api/analyze-skinfold-consistency", async (req, res) => {
    try {
      const { patient, skinfolds } = req.body;
      if (!patient || !skinfolds) {
        return res.status(400).json({ error: "Dados do paciente e dobras cutâneas são obrigatórios." });
      }

      const filledFolds = Object.entries(skinfolds).filter(
        ([_, val]) => val !== null && val !== undefined && !isNaN(Number(val)) && Number(val) > 0
      );

      if (filledFolds.length < 2) {
        return res.status(400).json({ error: "Insira ao menos 2 dobras cutâneas para análise de consistência clínica." });
      }

      const auditPatient: AuditPatient = {
        sexo: patient.sexo === 'feminino' ? 'feminino' : 'masculino',
        idade: Number(patient.idade) || 30,
        peso: Number(patient.peso) || 70,
        altura: Number(patient.altura) || 170,
        nivelAtividade: patient.nivelAtividade || 'moderado',
      };

      const prompt = `Analise a consistência clínica e coerência anatômica das seguintes dobras cutâneas aferidas em consulta nutricional:
Perfil do Paciente (Anonimizado - LGPD):
- Sexo: ${auditPatient.sexo}
- Idade: ${auditPatient.idade} anos
- Peso: ${auditPatient.peso} kg
- Altura: ${auditPatient.altura} cm
- Nível de Atividade: ${auditPatient.nivelAtividade}

Dobras cutâneas inseridas (em milímetros mm):
${filledFolds.map(([k, v]) => `- ${k}: ${Number(v).toFixed(1)} mm`).join('\n')}

Regras Clínicas e Antropométricas ISAK / Jackson-Pollock a verificar:
1. Relação Tríceps vs Subescapular:
   - Em homens, a dobra subescapular é normalmente igual ou superior ao tríceps (razão Tríceps/Subescapular ~ 0.7 a 1.3). Uma razão > 1.8x sugere forte suspeita de pinçamento de ventre muscular do tríceps ou erro de ponto.
   - Em mulheres jovens, o tríceps é habitualmente maior (razão ~ 1.1 a 1.6), mas se for > 2.5x a subescapular sem lipodistrofia relatada, sugere erro de pinçamento ou dobra subescapular subestimada.
2. Relação Bíceps vs Tríceps:
   - O tríceps é normalmente 1.5x a 3.0x maior que o bíceps. Se bíceps >= tríceps, quase certamente houve inversão de anotação ou pinçamento muscular bicipital.
3. Relação Troncular (Abdômen vs Supra-ilíaca):
   - Devem manter proporcionalidade. Razões superiores a 3.2x demandam conferência técnica.
4. Membros Inferiores (Coxa vs Panturrilha Medial):
   - A coxa medial habitualmente excede a panturrilha medial.
5. Limites Biológicos e Erros de Pinçamento:
   - Medidas < 2.5 mm (improváveis, exceto pele única ou extrema desidratação).
   - Medidas > 50 mm (risco de englobar fáscia muscular ou ultrapassar escala precisa do adipômetro).

Determine o status ("consistente", "atencao" ou "inconsistente"), um overallScore de 0 a 100, um headline curto, um resumo clínico conciso (summary), a lista detalhada de inconsistências (issues) se houver, com explicação fisiológica (clinicalReason) e conduta sugerida de conferência (suggestedAction), além de recomendações práticas.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction: "Você é um auditor sênior de antropometria e cineantropometria clínica padrão ISAK. Seu papel é identificar com rigor clínico se os valores de dobras cutâneas inseridos possuem coerência anatômica ou se indicam provável erro técnico de pinçamento, confusão de sítio ou digitação incorreta, orientando o nutricionista a conferir os dados necessários.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                status: {
                  type: Type.STRING,
                  description: "Status geral: 'consistente', 'atencao' ou 'inconsistente'",
                },
                overallScore: {
                  type: Type.NUMBER,
                  description: "Pontuação de coerência anatômica de 0 a 100",
                },
                headline: {
                  type: Type.STRING,
                  description: "Título curto do resultado da auditoria",
                },
                summary: {
                  type: Type.STRING,
                  description: "Parágrafo com a síntese da avaliação de consistência",
                },
                issues: {
                  type: Type.ARRAY,
                  description: "Lista de inconsistências ou pontos de atenção detectados",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skinfoldKey: { type: Type.STRING },
                      skinfoldName: { type: Type.STRING },
                      severity: { type: Type.STRING, description: "'alta', 'moderada' ou 'leve'" },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      clinicalReason: { type: Type.STRING },
                      suggestedAction: { type: Type.STRING },
                    },
                    required: ["skinfoldName", "severity", "title", "description", "clinicalReason", "suggestedAction"],
                  },
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Recomendações técnicas para a conferência",
                },
                anatomicRatios: {
                  type: Type.OBJECT,
                  properties: {
                    tricepsSubescapularRatio: { type: Type.NUMBER },
                    bicepsTricepsRatio: { type: Type.NUMBER },
                    abdomenSuprailiacaRatio: { type: Type.NUMBER },
                  },
                },
              },
              required: ["status", "overallScore", "headline", "summary", "issues", "recommendations"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          parsed.analyzedAt = new Date().toISOString();
          return res.json(parsed);
        }
      } catch (aiErr) {
        console.warn("Aviso: Gemini API retornou erro ou limite temporário. Aplicando auditoria algorítmica clínica de contingência:", aiErr);
      }

      // Contingência determinística padrão ISAK
      const fallbackResult = generateDeterministicAudit(auditPatient, skinfolds);
      return res.json(fallbackResult);
    } catch (error) {
      console.error("Erro ao analisar consistência das dobras:", error);
      res.status(500).json({ error: "Falha interna ao analisar consistência clínica das dobras." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
