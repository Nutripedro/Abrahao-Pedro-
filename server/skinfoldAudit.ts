export interface AuditPatient {
  sexo: 'masculino' | 'feminino';
  idade: number;
  peso: number;
  altura: number;
  nivelAtividade?: string;
}

export interface ConsistencyIssue {
  skinfoldKey?: string;
  skinfoldName: string;
  severity: 'alta' | 'moderada' | 'leve';
  title: string;
  description: string;
  clinicalReason: string;
  suggestedAction: string;
}

export interface ConsistencyAnalysisResult {
  status: 'consistente' | 'atencao' | 'inconsistente';
  overallScore: number;
  headline: string;
  summary: string;
  issues: ConsistencyIssue[];
  recommendations: string[];
  anatomicRatios?: {
    tricepsSubescapularRatio?: number;
    bicepsTricepsRatio?: number;
    abdomenSuprailiacaRatio?: number;
  };
  analyzedAt: string;
}

export function generateDeterministicAudit(
  patient: AuditPatient,
  skinfolds: Record<string, number | null | undefined>
): ConsistencyAnalysisResult {
  const issues: ConsistencyIssue[] = [];
  const recommendations: string[] = [];

  const triceps = skinfolds.triceps ? Number(skinfolds.triceps) : null;
  const subescapular = skinfolds.subescapular ? Number(skinfolds.subescapular) : null;
  const biceps = skinfolds.biceps ? Number(skinfolds.biceps) : null;
  const abdomen = skinfolds.abdomen ? Number(skinfolds.abdomen) : null;
  const supraIliaca = skinfolds.supraIliaca ? Number(skinfolds.supraIliaca) : null;
  const coxa = skinfolds.coxa ? Number(skinfolds.coxa) : null;
  const panturrilha = skinfolds.panturrilhaMedial ? Number(skinfolds.panturrilhaMedial) : null;

  let tricepsSubescapularRatio: number | undefined;
  let bicepsTricepsRatio: number | undefined;
  let abdomenSuprailiacaRatio: number | undefined;

  // 1. Relação Tríceps vs Subescapular (Índice de Distribuição Adiposa Tronco/Membro)
  if (triceps !== null && subescapular !== null && subescapular > 0) {
    tricepsSubescapularRatio = Number((triceps / subescapular).toFixed(2));

    if (patient.sexo === 'masculino') {
      // Homens acumulam proporcionalmente mais gordura troncular (subescapular)
      if (tricepsSubescapularRatio > 1.8) {
        issues.push({
          skinfoldKey: 'triceps',
          skinfoldName: 'Tríceps vs Subescapular',
          severity: 'alta',
          title: 'Dobra Tricipital Desproporcionalmente Maior que Subescapular',
          description: `A dobra tricipital (${triceps.toFixed(1)} mm) está ${tricepsSubescapularRatio}x maior que a subescapular (${subescapular.toFixed(1)} mm).`,
          clinicalReason: 'Em indivíduos do sexo masculino, o acúmulo de gordura subcutânea no tronco (subescapular) costuma ser igual ou superior à adiposidade periférica no braço (relação T/S esperada entre 0.7 e 1.3). Uma relação > 1.8 sugere pinçamento indevido de fáscia ou ventre muscular do tríceps braquial, ou ponto de aferição demasiadamente distal.',
          suggestedAction: 'Verifique se o braço do paciente estava totalmente solto e relaxado ao lado do corpo. Repita o pinçamento 1 cm acima da marcação mesobraquial, assegurando destacar apenas a dupla camada de pele e tecido adiposo.'
        });
      } else if (tricepsSubescapularRatio < 0.4) {
        issues.push({
          skinfoldKey: 'subescapular',
          skinfoldName: 'Subescapular vs Tríceps',
          severity: 'moderada',
          title: 'Dobra Subescapular Desproporcionalmente Elevada',
          description: `A dobra subescapular (${subescapular.toFixed(1)} mm) está mais que o dobro da tricipital (${triceps.toFixed(1)} mm).`,
          clinicalReason: 'Embora o padrão andróide priorize gordura no tronco, diferenças extremas (relação T/S < 0.4) podem indicar pinçamento oblíquo excessivamente profundo englobando a musculatura romboide ou grande dorsal.',
          suggestedAction: 'Confirme o ângulo de 45° inferolateral abaixo do ângulo inferior da escápula e peça ao paciente para manter os ombros em posição neutra e relaxada.'
        });
      }
    } else {
      // Mulheres acumulam proporcionalmente mais gordura periférica (tríceps)
      if (tricepsSubescapularRatio > 2.6) {
        issues.push({
          skinfoldKey: 'triceps',
          skinfoldName: 'Tríceps vs Subescapular',
          severity: 'alta',
          title: 'Discrepância Elevada entre Tríceps e Subescapular',
          description: `A dobra tricipital (${triceps.toFixed(1)} mm) é ${tricepsSubescapularRatio}x superior à subescapular (${subescapular.toFixed(1)} mm).`,
          clinicalReason: 'Mulheres jovens apresentam razão T/S fisiologicamente maior (1.1 a 1.6), porém uma razão superior a 2.5 sugere possível erro de tração muscular ou dobra subescapular subestimada.',
          suggestedAction: 'Reaferir a dobra tricipital na face posterior do braço e a subescapular no ângulo inferior da escápula.'
        });
      } else if (tricepsSubescapularRatio < 0.6) {
        issues.push({
          skinfoldKey: 'subescapular',
          skinfoldName: 'Subescapular vs Tríceps',
          severity: 'moderada',
          title: 'Subescapular Desproporcionalmente Superior em Perfil Feminino',
          description: `Subescapular (${subescapular.toFixed(1)} mm) ultrapassa substancialmente o tríceps (${triceps.toFixed(1)} mm).`,
          clinicalReason: 'Padrão incomum para mulheres jovens (T/S < 0.6), salvo em casos de lipodistrofia troncular ou obesidade andróide acentuada.',
          suggestedAction: 'Confirmar se não houve confusão na anotação ou inversão dos campos durante a digitação.'
        });
      }
    }
  }

  // 2. Relação Bíceps vs Tríceps (Região Braquial)
  if (biceps !== null && triceps !== null && triceps > 0) {
    bicepsTricepsRatio = Number((biceps / triceps).toFixed(2));
    if (biceps >= triceps) {
      issues.push({
        skinfoldKey: 'biceps',
        skinfoldName: 'Bíceps vs Tríceps',
        severity: 'alta',
        title: 'Dobra Bicipital Igual ou Superior à Tricipital',
        description: `Bíceps (${biceps.toFixed(1)} mm) está maior ou igual ao Tríceps (${triceps.toFixed(1)} mm) [Razão: ${bicepsTricepsRatio}].`,
        clinicalReason: 'Anatomicamente, a dobra tricipital é entre 1.5x e 3.0x mais espessa que a bicipital na vasta maioria da população saudável. Quando o bíceps se iguala ou supera o tríceps, quase invariavelmente ocorreu inversão de anotação ou pinçamento do ventre muscular do bíceps braquial.',
        suggestedAction: 'Inspecione a face anterior do braço com a palma supinada e garanta que o pinçamento é paralelo ao eixo longitudinal do braço no ponto médio.'
      });
    }
  }

  // 3. Relação Troncular: Abdômen vs Supra-ilíaca
  if (abdomen !== null && supraIliaca !== null && supraIliaca > 0) {
    abdomenSuprailiacaRatio = Number((abdomen / supraIliaca).toFixed(2));
    if (abdomenSuprailiacaRatio > 3.2) {
      issues.push({
        skinfoldKey: 'abdomen',
        skinfoldName: 'Abdômen vs Supra-ilíaca',
        severity: 'moderada',
        title: 'Assimetria Acentuada entre Abdômen e Supra-ilíaca',
        description: `Dobra abdominal (${abdomen.toFixed(1)} mm) está ${abdomenSuprailiacaRatio}x maior que a supra-ilíaca (${supraIliaca.toFixed(1)} mm).`,
        clinicalReason: 'Ambas as dobras refletem adiposidade troncular. Discrepâncias superiores a 3x ocorrem quase exclusivamente em lipoaspirações prévias ou erros de localização (ex: aferir supra-ilíaca muito superior sobre a crista).',
        suggestedAction: 'Confirme a linha axilar anterior e a inclinação oblíqua de 45° para a supra-ilíaca, e a distância de 2 cm lateral à cicatriz umbilical para o abdômen.'
      });
    } else if (abdomenSuprailiacaRatio < 0.35 && abdomen > 0) {
      issues.push({
        skinfoldKey: 'supraIliaca',
        skinfoldName: 'Supra-ilíaca vs Abdômen',
        severity: 'moderada',
        title: 'Supra-ilíaca Muito Superior ao Abdômen',
        description: `Supra-ilíaca (${supraIliaca.toFixed(1)} mm) é quase o triplo do abdômen (${abdomen.toFixed(1)} mm).`,
        clinicalReason: 'Comum quando há erro na dobra do abdômen (pinçada muito superficialmente ou paciente contraindo a parede abdominal).',
        suggestedAction: 'Solicite ao paciente que respire normalmente e relaxe a musculatura reto-abdominal durante o pinçamento.'
      });
    }
  }

  // 4. Membros Inferiores: Coxa vs Panturrilha
  if (coxa !== null && panturrilha !== null && coxa > 0) {
    const panturrilhaCoxaRatio = panturrilha / coxa;
    if (panturrilhaCoxaRatio > 1.35) {
      issues.push({
        skinfoldKey: 'panturrilhaMedial',
        skinfoldName: 'Panturrilha Medial vs Coxa',
        severity: 'moderada',
        title: 'Dobra da Panturrilha Medial Superior à Coxa',
        description: `Panturrilha (${panturrilha.toFixed(1)} mm) está superior à coxa (${coxa.toFixed(1)} mm).`,
        clinicalReason: 'A dobra da coxa medial quase invariavelmente excede a da panturrilha medial. Esse padrão pode indicar pinçamento com o membro inferior suportando peso (musculatura contraída) ou edema localizado.',
        suggestedAction: 'Confirme se o peso do corpo estava descarregado na perna contralateral (joelho flexionado a 90° e sem carga).'
      });
    }
  }

  // 5. Valores Extremos e Outliers Isolados
  const entries = Object.entries(skinfolds).filter(([_, v]) => v !== null && v !== undefined && Number(v) > 0);
  for (const [k, v] of entries) {
    const num = Number(v);
    if (num < 2.5) {
      issues.push({
        skinfoldKey: k,
        skinfoldName: k,
        severity: 'alta',
        title: `Valor Extremamente Baixo na Dobra (${k}: ${num} mm)`,
        description: `A medida de ${num} mm é inferior ao limite biológico de dupla camada de derme para grande parte dos indivíduos.`,
        clinicalReason: 'Uma dobra cutânea é composta por duas espessuras de pele e a gordura subcutânea entre elas. Valores < 2.5 mm geralmente refletem leitura incorreta ou compressão excessiva.',
        suggestedAction: 'Aguarde exatamente 2 segundos após a liberação das garras do adipômetro antes de efetuar a leitura no mostrador.'
      });
    } else if (num > 50) {
      issues.push({
        skinfoldKey: k,
        skinfoldName: k,
        severity: 'moderada',
        title: `Espessura Elevada na Dobra (${k}: ${num} mm)`,
        description: `Medida de ${num} mm aproxima-se da abertura máxima dos adipômetros convencionais.`,
        clinicalReason: 'Em dobras muito volumosas, a compressão do adipômetro pode subestimar o valor ou dificultar o descolamento da fáscia muscular subjacente.',
        suggestedAction: 'Utilize as duas mãos se necessário para destacar o panículo e garantir que o tecido muscular não seja pinçado.'
      });
    }
  }

  // Recomendações padronizadas
  recommendations.push('Aferir cada dobra 2 a 3 vezes em circuito não consecutivo, utilizando a mediana ou média se a variação for ≤ 10%.');
  recommendations.push('Manter o adipômetro perpendicular ao eixo longitudinal da dobra e efetuar a leitura rigorosamente aos 2 segundos.');
  if (issues.length > 0) {
    recommendations.push('Conferir prioritariamente as dobras sinalizadas em alerta antes de fechar o plano dietético do paciente.');
  }

  // Cálculo do Score de Coerência
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'alta') score -= 25;
    else if (issue.severity === 'moderada') score -= 15;
    else score -= 8;
  }
  score = Math.max(20, Math.min(100, score));

  let status: 'consistente' | 'atencao' | 'inconsistente' = 'consistente';
  let headline = 'Dobras Cutâneas Clinicamente Coerentes';
  let summary = 'A distribuição anatômica das dobras avaliadas é harmoniosa e compatível com as proporções antropométricas esperadas para o sexo e idade do paciente.';

  if (score < 60 || issues.some(i => i.severity === 'alta')) {
    status = 'inconsistente';
    headline = 'Possível Inconsistência Antropométrica Detectada';
    summary = 'Foram identificadas desproporções anatômicas significativas entre sítios correlatos (ex: tríceps vs subescapular ou bíceps). Recomenda-se realizar conferência presencial antes de utilizar os cálculos para prescrição.';
  } else if (score < 85 || issues.length > 0) {
    status = 'atencao';
    headline = 'Atenção a Padrões Anatômicos Específicos';
    summary = 'As medidas apresentam leve assimetria regional. Embora possa refletir variação biológica individual (ex: distribuição andróide/ginóide), recomenda-se rápida conferência técnica.';
  }

  return {
    status,
    overallScore: score,
    headline,
    summary,
    issues,
    recommendations,
    anatomicRatios: {
      tricepsSubescapularRatio,
      bicepsTricepsRatio,
      abdomenSuprailiacaRatio,
    },
    analyzedAt: new Date().toISOString(),
  };
}
