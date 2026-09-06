import { SoapFullData } from '../contexts/ClinicalFocusContext';

export interface ClinicalSoapTemplate {
  id: string;
  name: string;
  tag: 'Primeira Consulta' | 'Retorno / Follow-up' | 'Esportiva' | 'Gastrointestinal' | 'Saúde da Mulher' | 'Metabólico';
  description: string;
  targetObjective: string;
  color: string; // Tailwind color theme
  iconName: 'UserCheck' | 'RotateCw' | 'Flame' | 'ShieldCheck' | 'Heart' | 'Activity';
  badge: string;
  soap: SoapFullData;
}

export const CLINICAL_SOAP_TEMPLATES: ClinicalSoapTemplate[] = [
  {
    id: 'tpl-primeira-consulta',
    name: 'Primeira Consulta (Anamnese Global & Emagrecimento)',
    tag: 'Primeira Consulta',
    description: 'Estrutura completa para primeiro atendimento: histórico alimentar, queixas de saciedade, antropometria inicial e plano hipocalórico equilibrado.',
    targetObjective: 'Emagrecimento sustentável com reeducação alimentar e preservação de massa magra',
    color: 'emerald',
    iconName: 'UserCheck',
    badge: 'Anamnese Completa',
    soap: {
      s: `QUEIXA PRINCIPAL:
Dificuldade de perda de peso nos últimos 12 meses, episódios de fome vespertina/noturna e sensação de fadiga às 16h.

HISTÓRICO CLÍNICO & FAMILIAR:
Nega diabetes, hipertensão ou dislipidemias diagnosticadas. Mãe hipertensa, pai com histórico de dislipidemia.

ROTINA & HÁBITOS DE VIDA:
• Trabalho em escritório (sedentário, 8h sentada).
• Sono: 6h30 por noite, acorda sentindo-se cansada.
• Ingestão Hídrica: ~1.2L de água/dia (meta de aumento gradual para 2.5L).
• Funcionamento Intestinal: Evacuação a cada 2 dias (fezes ressecadas tipo Bristol 2).
• Preferências: Frutas cítricas, ovos, arroz, queijos. Aversões: Fígado, berinjela e coentro.`,
      o: {
        weight: 70.5,
        height: 1.65,
        bmi: 25.9,
        bloodPressure: '120/80',
        waist: 79.0,
        abdomen: 86.5,
        hip: 104.0,
        rcq: 0.76,
        bodyFatPercent: 28.5,
        muscleMass: 26.2,
        skinfoldTriceps: 19.0,
        skinfoldSubscapular: 17.5,
        skinfoldSuprailiac: 21.0,
        skinfoldAbdominal: 24.0,
        notes: 'Circunferências aferidas no final da expiração normal. Avaliação de dobras cutâneas com plicômetro científico Cescorf.'
      },
      a: {
        diagnosis: 'Sobrepeso leve (IMC 25.9 kg/m²) com adiposidade de distribuição ginoide/abdominal moderada. Padrão alimentar com baixa densidade de fibras (<15g/dia) e ingestão hídrica subótima.',
        bristolType: 2,
        msqScore: 38,
        digestiveSymptoms: ['Constipação funcional', 'Fadiga vespertina', 'Distensão abdominal leve'],
        clinicalNotes: 'Paciente motivada para adesão. Escore MSQ moderado reflete privação crônica de sono e baixa hidratação.'
      },
      p: {
        caloriesTarget: 1650,
        proteinGrams: 105, // 1.5g/kg
        carbsGrams: 175,
        fatGrams: 55,
        smartGoals: [
          'Atingir ingestão hídrica de 2.5 litros de água/dia (com garrafa marcada)',
          'Consumir pelo menos 2 porções de frutas com casca/bagaço e salada verde no almoço e jantar',
          'Caminhada diária de 30 minutos ou 8.000 passos monitorados'
        ],
        supplements: [
          {
            name: 'Magnésio Inositol Quelato',
            dosage: '300mg de Magnésio elementar + 2000mg Inositol',
            timing: '40 minutos antes de dormir, diluído em 100ml de água morna',
            route: 'Via Oral'
          },
          {
            name: 'Semente de Psyllium em Pó (Plantago ovata)',
            dosage: '5g ao dia',
            timing: 'Pela manhã com 300ml de água',
            route: 'Via Oral'
          },
          {
            name: 'Creatina Monohidratada 100% Creapure®',
            dosage: '5g ao dia',
            timing: 'Junto com a principal refeição',
            route: 'Via Oral'
          }
        ],
        followupDays: 30,
        dietaryGuidelines: 'Priorizar alimentos in natura e minimamente processados. Evitar bebidas adoçadas e frituras em imersão. Mastigação consciente (mínimo de 20 minutos por refeição).'
      },
      r24h: [
        { meal: 'Café da Manhã', time: '07:30', items: '1 xícara de café c/ leite e 1 colher de açúcar + 1 pão francês com margarina' },
        { meal: 'Almoço', time: '12:30', items: '4 colheres sopa arroz branco + 1 concha de feijão + 1 filé de frango frito + Pouca salada de alface e tomate' },
        { meal: 'Lanche da Tarde', time: '16:00', items: 'Café puro + 3 biscoitos recheados ou 1 fatia de bolo simples' },
        { meal: 'Jantar', time: '20:30', items: '2 fatias de pizza de muçarela ou 1 misto quente com refrigerante zero' }
      ]
    }
  },
  {
    id: 'tpl-retorno-followup',
    name: 'Consulta de Retorno & Follow-up (Evolução 30 Dias)',
    tag: 'Retorno / Follow-up',
    description: 'Focada em reavaliação de adesão, comparativo de medidas antropométricas, ajuste de déficit e avanço das metas SMART.',
    targetObjective: 'Manutenção da queima de gordura e consolidação dos novos hábitos alimentares',
    color: 'teal',
    iconName: 'RotateCw',
    badge: 'Reavaliação 30d',
    soap: {
      s: `EVOLUÇÃO DOS SINTOMAS & ADESÃO:
Paciente relata excelente adaptação ao plano (adesão auto-avaliada em ~85%). 
• Refere melhora nítida na disposição matinal e cessação das quedas de energia no período da tarde.
• Hidratação regularizada para 2.4L/dia.
• Funcionamento intestinal normalizado (evacuações diárias sem esforço, Bristol 4).
• Finais de semana com 1 refeição livre planejada sem sensação de culpa ou compulsão.`,
      o: {
        weight: 68.2, // Redução de 2.3kg
        height: 1.65,
        bmi: 25.0,
        bloodPressure: '118/76',
        waist: 76.0, // -3cm
        abdomen: 83.0, // -3.5cm
        hip: 102.0, // -2cm
        rcq: 0.74,
        bodyFatPercent: 26.8,
        muscleMass: 26.5, // Preservação de massa magra
        skinfoldTriceps: 17.0,
        skinfoldSubscapular: 15.5,
        skinfoldSuprailiac: 18.5,
        skinfoldAbdominal: 21.0,
        notes: 'Evolução antropométrica excelente: perda de 2.3 kg corporais totais com redução simultânea de perímetros de cintura (-3cm) e abdômen (-3.5cm).'
      },
      a: {
        diagnosis: 'Evolução clínica altamente positiva com resposta metabólica favorável e recomposição corporal ativa. Resolução da constipação funcional e regularização da escala de Bristol (Tipo 4).',
        bristolType: 4,
        msqScore: 18,
        digestiveSymptoms: ['Nenhum sintoma digestivo relevante relatado'],
        clinicalNotes: 'Adesão consistente ao plano prescrito e à suplementação de magnésio. Sono relatado com sensação de descanso.'
      },
      p: {
        caloriesTarget: 1550,
        proteinGrams: 110,
        carbsGrams: 160,
        fatGrams: 50,
        smartGoals: [
          'Iniciar musculação/treinamento resistido 3x na semana',
          'Manter consumo diário de 25g a 30g de fibras alimentares',
          'Experimentar 2 receitas novas com fontes vegetais de proteína'
        ],
        supplements: [
          {
            name: 'Creatina Monohidratada 100% Creapure®',
            dosage: '5g ao dia',
            timing: 'Pós-treino ou no almoço',
            route: 'Via Oral'
          },
          {
            name: 'Ômega 3 TG 1000mg (Alta Concentração EPA 400mg / DHA 300mg)',
            dosage: '2 cápsulas ao dia',
            timing: 'Junto com o almoço',
            route: 'Via Oral'
          },
          {
            name: 'Magnésio Quelato',
            dosage: '250mg ao dia',
            timing: 'Antes de dormir',
            route: 'Via Oral'
          }
        ],
        followupDays: 35,
        dietaryGuidelines: 'Fase 2 do plano: Ajuste de densidade energética com aumento do aporte proteico no lanche da tarde. Manter estratégias de saciedade com vegetais folhosos e sementes.'
      },
      r24h: [
        { meal: 'Café da Manhã', time: '07:30', items: '2 ovos mexidos com azeite + 1 fatia pão 100% integral + 1 fatia de mamão com semente de chia + Café puro sem açúcar' },
        { meal: 'Almoço', time: '12:30', items: '100g arroz integral + 1 concha média de feijão + 130g peito de frango grelhado + Salada mista colorida com azeite extravirgem' },
        { meal: 'Lanche da Tarde', time: '16:30', items: '1 dose de Whey Protein Isolado batido com 150ml água e 1 maçã picada + 15g mix de castanhas' },
        { meal: 'Jantar', time: '20:00', items: 'Omelete de 2 ovos com espinafre e tomate + 80g batata doce assada + Chá de camomila' }
      ]
    }
  },
  {
    id: 'tpl-nutricao-esportiva',
    name: 'Nutrição Esportiva & Hipertrofia (Alta Performance)',
    tag: 'Esportiva',
    description: 'Protocolo hiperproteico e hiperglicídico estruturado para praticantes de musculação e esportes de força visando ganho de massa livre de gordura.',
    targetObjective: 'Hipertrofia muscular com controle de adiposidade e otimização de rendimento nos treinos',
    color: 'amber',
    iconName: 'Flame',
    badge: 'Hipertrofia & Força',
    soap: {
      s: `ROTINA DE TREINOS & OBJETIVO:
Praticante de musculação 5x por semana (divisão ABCDE) com foco em hipertrofia de membros inferiores e dorsais.
• Relata fadiga muscular ao final de treinos longos (>60 min) e dificuldade em atingir meta calórica sem sensação de peso estomacal.
• Horário de treino: 06h30 em jejum (necessidade de pré-treino de rápida absorção).
• Não faz uso de esteroides anabolizantes.`,
      o: {
        weight: 76.0,
        height: 1.78,
        bmi: 24.0,
        bloodPressure: '115/75',
        waist: 77.0,
        abdomen: 80.5,
        hip: 98.0,
        rcq: 0.78,
        bodyFatPercent: 14.2,
        muscleMass: 38.5,
        skinfoldTriceps: 8.5,
        skinfoldSubscapular: 10.0,
        skinfoldSuprailiac: 9.5,
        skinfoldAbdominal: 11.0,
        notes: 'Excelente densidade muscular. Dobras cutâneas baixas e simétricas.'
      },
      a: {
        diagnosis: 'Eutrofia com excelente proporção de massa livre de gordura (38.5kg) e percentual de gordura controlado (14.2%). Demanda energética aumentada por alto volume de treino resistido.',
        bristolType: 4,
        msqScore: 12,
        digestiveSymptoms: ['Plenitude pós-prandial ao ingerir grandes volumes sólidos'],
        clinicalNotes: 'Estratégia focada em densidade calórica com carboidratos líquidos/semissólidos para facilitar digestão peri-treino.'
      },
      p: {
        caloriesTarget: 2850,
        proteinGrams: 165, // 2.1g/kg
        carbsGrams: 390, // ~5.1g/kg
        fatGrams: 70,
        smartGoals: [
          'Consumir carboidrato de rápida digestão 30 min antes do treino matinal',
          'Distribuir o aporte proteico em 4 refeições com no mínimo 35g de proteína em cada',
          'Ingestão hídrica de 45ml/kg (total de 3.5L/dia)'
        ],
        supplements: [
          {
            name: 'Creatina Monohidratada 100% Creapure®',
            dosage: '5g ao dia',
            timing: 'Imediatamente após o treino',
            route: 'Via Oral'
          },
          {
            name: 'Whey Protein Isolado / 100% Concentrado',
            dosage: '30g de proteína por dose',
            timing: 'Pós-treino imediato ou no lanche da tarde',
            route: 'Via Oral'
          },
          {
            name: 'Beta-Alanina',
            dosage: '4g fracionados em 2 doses de 2g',
            timing: 'Manhã e tarde (para evitar parestesia aguda)',
            route: 'Via Oral'
          }
        ],
        followupDays: 45,
        dietaryGuidelines: 'Timing nutricional rigoroso: pré-treino com carboidrato simples e proteína de rápida absorção. Hidratação isotônica durante treinos intensos em dias quentes.'
      },
      r24h: [
        { meal: 'Pré-Treino (06:00)', time: '06:00', items: '1 banana amassada com 30g aveia em flocos e 1 colher mel + 1 dose café expresso' },
        { meal: 'Pós-Treino / Café (08:00)', time: '08:00', items: '3 ovos mexidos + 2 fatias pão artesanal + 1 copo 250ml suco de uva integral + 1 dose Whey' },
        { meal: 'Almoço (12:30)', time: '12:30', items: '200g arroz branco + 100g feijão + 160g patinho moído grelhado + Legumes cozidos no vapor' },
        { meal: 'Lanche Tarde (16:30)', time: '16:30', items: 'Iogurte natural integral 170g + 30g Whey Protein + 40g granola sem açúcar + 1 fruta' },
        { meal: 'Jantar (20:30)', time: '20:30', items: '220g mandioca cozida + 150g sobrecoxa de frango assada sem pele + Salada verde com azeite' }
      ]
    }
  },
  {
    id: 'tpl-saude-gastrointestinal',
    name: 'Saúde Gastrointestinal & Protocolo FODMAP / 5R',
    tag: 'Gastrointestinal',
    description: 'Estrutura voltada para queixas digestivas, disbiose, distensão abdominal pós-prandial e sensibilidades alimentares não-celíacas.',
    targetObjective: 'Recuperação da integridade da barreira intestinal e alívio de sintomas dispépticos',
    color: 'sky',
    iconName: 'ShieldCheck',
    badge: 'Protocolo Gut Health',
    soap: {
      s: `QUEIXAS GASTROINTESTINAIS DETALHADAS:
Paciente relata distensão abdominal progressiva ao longo do dia, sensação de "estômago estufado" após almoço, flatulência frequente e alternância do hábito intestinal (fezes ora diarreicas Bristol 6, ora endurecidas Bristol 2).
• Piora clara com derivados de leite, feijões, alho/cebola em excesso e pães convencionais.
• Nega sangue nas fezes ou perda de peso involuntária.`,
      o: {
        weight: 64.0,
        height: 1.68,
        bmi: 22.7,
        bloodPressure: '110/70',
        waist: 72.0,
        abdomen: 82.0, // Abdômen distendido comparado à cintura (+10cm)
        hip: 99.0,
        rcq: 0.72,
        bodyFatPercent: 23.5,
        muscleMass: 24.8,
        skinfoldTriceps: 14.0,
        skinfoldSubscapular: 13.0,
        skinfoldSuprailiac: 15.0,
        skinfoldAbdominal: 18.0,
        notes: 'Diferencial acentuado entre perímetro de cintura (72cm) e abdômen inferior (82cm) compatível com meteorismo/distensão funcional.'
      },
      a: {
        diagnosis: 'Quadro clínico compatível com Síndrome do Intestino Irritável (SII) subtipo misto e disbiose fermentativa proximal. Escore MSQ alto (64 pts) com predomínio de sintomas no trato digestório.',
        bristolType: 6,
        msqScore: 64,
        digestiveSymptoms: ['Distensão abdominal pós-prandial', 'Meteorismo/Flatulência', 'Sensibilidade alimentar a FODMAPs', 'Plenitude gástrica precoce'],
        clinicalNotes: 'Indicação clara de protocolo de eliminação temporária Low-FODMAP (Fase 1 por 4 semanas) + suporte de barreira intestinal.'
      },
      p: {
        caloriesTarget: 1750,
        proteinGrams: 100,
        carbsGrams: 200,
        fatGrams: 60,
        smartGoals: [
          'Eliminar fontes de alto FODMAP por 28 dias conforme tabela orientada',
          'Mastigar cada garfada no mínimo 25 vezes e não ingerir líquidos durante as refeições principais',
          'Manter diário de sintomas digestivos registrando reações a cada refeição'
        ],
        supplements: [
          {
            name: 'L-Glutamina 100% Pura',
            dosage: '5g ao dia',
            timing: 'Em jejum pela manhã diluído em 150ml de água em temperatura ambiente',
            route: 'Via Oral'
          },
          {
            name: 'Complexo de Enzimas Digestivas (Amilase, Protease, Lipase, Lactase, Bromelina)',
            dosage: '1 cápsula gastro-resistente',
            timing: 'Imediatamente antes do almoço e jantar',
            route: 'Via Oral'
          },
          {
            name: 'Goma Acácia Purificada (Fibras Prebióticas Solúveis FODMAP-Friendly)',
            dosage: '5g ao dia',
            timing: 'No meio da tarde em água ou suco de maracujá',
            route: 'Via Oral'
          }
        ],
        followupDays: 28,
        dietaryGuidelines: 'Fase 1 Low-FODMAP: Substituir alho/cebola por azeite aromatizado com ervas. Preferir arroz, batata inglesa, cenoura, abobrinha, carnes magras e frutas baixas em frutose (morango, maracujá, kiwi).'
      },
      r24h: [
        { meal: 'Café da Manhã', time: '08:00', items: 'Ovos mexidos com azeite + tapioca com queijo sem lactose + 1 kiwi + Chá de hortelã' },
        { meal: 'Almoço', time: '12:30', items: 'Arroz branco + Filé de peixe grelhado com azeite de ervas + Cenoura e abobrinha refogadas no azeite + Salada de rúcula' },
        { meal: 'Lanche da Tarde', time: '16:00', items: 'Shake de Proteína de Arroz/Ervilha com leite de amêndoas e morangos frescos' },
        { meal: 'Jantar', time: '19:30', items: 'Sopa de abóbora kabocha com gengibre e cubos de frango desfiado' }
      ]
    }
  },
  {
    id: 'tpl-saude-mulher-sop',
    name: 'Saúde da Mulher & Modulação Hormonal / SOP',
    tag: 'Saúde da Mulher',
    description: 'Protocolo anti-inflamatório com foco em sensibilidade à insulina, controle de compulsão por doces na fase lútea e saúde ovariana.',
    targetObjective: 'Modulação metabólica, redução da resistência insulínica e alívio de sintomas de SOP/TPM',
    color: 'rose',
    iconName: 'Heart',
    badge: 'Saúde Feminina & SOP',
    soap: {
      s: `ANAMNESE GINECOLÓGICA & METABÓLICA:
Diagnóstico prévio de Síndrome dos Ovários Policísticos (SOP).
• Ciclos menstruais irregulares (35 a 55 dias), acne na região mandibular e episódios frequentes de compulsão por doces/carboidratos simples no período pré-menstrual.
• Sensação de inchaço e retenção hídrica marcante no final da tarde.
• Dificuldade crônica para perder peso mesmo em déficit alimentar percebido.`,
      o: {
        weight: 73.0,
        height: 1.63,
        bmi: 27.5,
        bloodPressure: '122/82',
        waist: 84.0,
        abdomen: 92.0,
        hip: 108.0,
        rcq: 0.77,
        bodyFatPercent: 32.0,
        muscleMass: 24.5,
        skinfoldTriceps: 22.0,
        skinfoldSubscapular: 20.0,
        skinfoldSuprailiac: 25.0,
        skinfoldAbdominal: 28.0,
        notes: 'Presença de acantose nigricans leve na região cervical posterior, sugerindo resistência insulínica periférica.'
      },
      a: {
        diagnosis: 'Sobrepeso grau I com adiposidade androide/visceral associada a quadro clínico de resistência insulínica e SOP. Padrão inflamatório crônico de baixo grau e alta suscetibilidade a oscilações glicêmicas.',
        bristolType: 3,
        msqScore: 46,
        digestiveSymptoms: ['Compulsão por carboidratos refinados', 'Retenção hídrica cíclica', 'Acne inflamatória'],
        clinicalNotes: 'Indicação de dieta com carga glicêmica controlada, rica em fitoquímicos e ácidos graxos mono/poli-insaturados.'
      },
      p: {
        caloriesTarget: 1600,
        proteinGrams: 105,
        carbsGrams: 150, // Dieta low/moderate carb de baixo índice glicêmico
        fatGrams: 65, // Enfoque em gorduras boas anti-inflamatórias (azeite, abacate, sementes)
        smartGoals: [
          'Nunca consumir carboidratos isolados (sempre combinar com proteína, fibra ou gordura boa)',
          'Substituir sobremesas açucaradas por cacau 70%+ ou frutas com canela',
          'Treinamento resistido (musculação) no mínimo 3x/semana para captação de glicose via GLUT-4'
        ],
        supplements: [
          {
            name: 'Mio-Inositol + D-Chiro-Inositol (Proporção Fisiológica 40:1)',
            dosage: '2000mg Mio-Inositol + 50mg D-Chiro-Inositol',
            timing: 'Pela manhã com água',
            route: 'Via Oral'
          },
          {
            name: 'Picolinato de Cromo',
            dosage: '250mcg ao dia',
            timing: 'Junto ao almoço',
            route: 'Via Oral'
          },
          {
            name: 'Coenzima Q10 (Ubiquinona) + Vitamina E',
            dosage: '100mg + 200 UI',
            timing: 'Com a principal refeição rica em gorduras',
            route: 'Via Oral'
          },
          {
            name: 'Ômega 3 TG Concentrado (EPA 500mg / DHA 400mg)',
            dosage: '2 cápsulas ao dia',
            timing: 'Junto com o almoço',
            route: 'Via Oral'
          }
        ],
        followupDays: 30,
        dietaryGuidelines: 'Foco em alimentos anti-inflamatórios: canela, gengibre, cúrcuma, chá verde, sementes de abóbora e linhaça (protocolo de sementes). Redução estrita de carboidratos de alta carga glicêmica.'
      },
      r24h: [
        { meal: 'Café da Manhã', time: '08:00', items: 'Ovos mexidos com cúrcuma + 1/2 abacate com chia e canela + Café puro' },
        { meal: 'Almoço', time: '12:30', items: 'Filé de salmão ou peito de frango + Brócolis e couve-flor ao vapor com azeite extravirgem + 3 colheres de quinoa' },
        { meal: 'Lanche da Tarde', time: '16:30', items: 'Iogurte proteico sem açúcar com sementes de abóbora e 1 colher de farelo de aveia' },
        { meal: 'Jantar', time: '20:00', items: 'Salada mediterrânea com folhas escuras, atum em azeite, pepino, tomate cereja e azeite' }
      ]
    }
  },
  {
    id: 'tpl-longevidade-metabolica',
    name: 'Saúde Metabólica & Prevenção Cardiovascular (Check-up)',
    tag: 'Metabólico',
    description: 'Protocolo de perfil cardioprotetor e metabólico focado em controle glicêmico, perfil lipídico e redução de risco aterosclerótico.',
    targetObjective: 'Otimização dos biomarcadores lipídicos, glicêmicos e redução do estresse oxidativo',
    color: 'purple',
    iconName: 'Activity',
    badge: 'Cardioprotetor & Longevidade',
    soap: {
      s: `RASTREAMENTO DE RISCO CARDIOVASCULAR & METABÓLICO:
Exames laboratoriais recentes revelam elevação de triglicerídeos (210 mg/dL), LDL-c limítrofe (145 mg/dL) e glicemia de jejum de 104 mg/dL (pré-diabetes).
• Queixa de cansaço após almoço e histórico de esteatose hepática grau 1 no ultrassom abdominal.
• Estilo de vida com estresse elevado e sono não restaurador.`,
      o: {
        weight: 82.5,
        height: 1.74,
        bmi: 27.2,
        bloodPressure: '130/85',
        waist: 94.0,
        abdomen: 98.0,
        hip: 104.0,
        rcq: 0.90,
        bodyFatPercent: 26.0,
        muscleMass: 32.0,
        skinfoldTriceps: 16.0,
        skinfoldSubscapular: 22.0,
        skinfoldSuprailiac: 24.0,
        skinfoldAbdominal: 27.0,
        notes: 'Adiposidade de padrão predominantemente visceral (cintura >90cm em homens/mulheres) associada a esteatose hepática.'
      },
      a: {
        diagnosis: 'Sobrepeso com obesidade abdominal e síndrome metabólica inicial (dislipidemia mista + glicemia de jejum alterada + esteatose hepática leve). Alto potencial de reversão através de intervenção nutricional direcionada.',
        bristolType: 3,
        msqScore: 32,
        digestiveSymptoms: ['Sonolência pós-prandial', 'Fadiga ao acordar'],
        clinicalNotes: 'Indicação de padrão alimentar Mediterrâneo rico em azeite extravirgem, oleaginosas, peixes gordos e fibras viscosas.'
      },
      p: {
        caloriesTarget: 1800,
        proteinGrams: 120,
        carbsGrams: 180,
        fatGrams: 65,
        smartGoals: [
          'Consumir 2 colheres de sopa de azeite de oliva extravirgem cru diariamente',
          'Eliminar totalmente o consumo de refrigerantes, sucos de caixinha e álcool nos dias de semana',
          'Praticar 150 minutos semanais de atividade física aeróbica moderada'
        ],
        supplements: [
          {
            name: 'Berberina Fitossomal / Cloridrato de Berberina',
            dosage: '500mg duas vezes ao dia',
            timing: '15 minutos antes do almoço e do jantar',
            route: 'Via Oral'
          },
          {
            name: 'Ômega 3 TG Concentrado (Alta Pureza EPA 700mg / DHA 500mg)',
            dosage: '2 cápsulas ao dia',
            timing: 'Junto com o almoço',
            route: 'Via Oral'
          },
          {
            name: 'Extrato de Alcachofra (Cynara scolymus) + Silimarina',
            dosage: '200mg + 150mg',
            timing: 'Pela manhã com água',
            route: 'Via Oral'
          }
        ],
        followupDays: 30,
        dietaryGuidelines: 'Padrão Mediterrâneo estrito: substituir carnes processadas por peixes e aves. Aumentar fitoesteróis e fibras solúveis (aveia, maçã, sementes de chia e linhaça).'
      },
      r24h: [
        { meal: 'Café da Manhã', time: '07:30', items: 'Mingau de aveia com água e canela + 1 dose Whey Protein + 1 colher de semente de linhaça moída' },
        { meal: 'Almoço', time: '12:30', items: 'Prato abundante de salada de folhas amargas e tomate com 1 colher de sopa de azeite + 150g peito de frango grelhado + 3 colheres de arroz integral e feijão' },
        { meal: 'Lanche da Tarde', time: '16:30', items: '1 punhado (30g) de nozes e castanhas do Pará + 1 maçã com casca' },
        { meal: 'Jantar', time: '20:00', items: 'Filé de sardinha fresca ou atum grelhado com legumes assados (abobrinha, berinjela e tomate com orégano e azeite)' }
      ]
    }
  }
];
