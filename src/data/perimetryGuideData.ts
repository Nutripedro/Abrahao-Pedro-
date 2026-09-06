import { PerimetryValues } from '../types';

export interface PerimetryGuideDefinition {
  key: keyof PerimetryValues;
  label: string;
  shortName: string;
  anatomicalLandmarks: string;
  technique: string;
  bodyPosition: string;
  clinicalRelevance: string;
  standardReference: string;
  tapePlane: 'horizontal' | 'perpendicular';
  category: 'tronco' | 'membros_superiores' | 'membros_inferiores';
  // SVG coordinates on a normalized 240x460 body silhouette (cx, cy)
  svgMarker: {
    y: number; // Vertical position of the measuring tape
    xStart: number;
    xEnd: number;
    side?: 'direito' | 'esquerdo' | 'ambos' | 'centro';
    labelY?: number;
  };
}

export const PERIMETRY_GUIDE_DEFINITIONS: Record<keyof PerimetryValues, PerimetryGuideDefinition> = {
  ombro: {
    key: 'ombro',
    label: 'Circunferência do Ombro (Deltoide)',
    shortName: 'Ombro',
    category: 'tronco',
    standardReference: 'ISAK / Lohman (Anthropometric Standardization Reference Manual)',
    tapePlane: 'horizontal',
    anatomicalLandmarks: 'Contorno horizontal máximo ao nível da maior proeminência dos músculos deltoides, logo abaixo dos acrômios escapulares.',
    technique: 'A fita métrica flexível e inextensível deve ser posicionada no plano horizontal, circundando ambos os ombros na altura da saliência máxima do deltoide, sem comprimir os tecidos moles subjacentes.',
    bodyPosition: 'Paciente em ortostatismo (em pé), postura ereta natural, pés unidos, braços relaxados e estendidos ao longo do corpo. A medição é realizada ao final de uma expiração normal.',
    clinicalRelevance: 'Avalia a amplitude da cintura escapular, desenvolvimento muscular dos deltoides e relação cintura-ombro em atletas.',
    svgMarker: {
      y: 92,
      xStart: 62,
      xEnd: 178,
      side: 'ambos'
    }
  },
  torax: {
    key: 'torax',
    label: 'Circunferência do Tórax (Peitoral)',
    shortName: 'Tórax',
    category: 'tronco',
    standardReference: 'ISAK / OMS / Lohman',
    tapePlane: 'horizontal',
    anatomicalLandmarks: 'No nível mesoesternal (4ª articulação condroesternal). Em homens, coincide aproximadamente com a linha dos mamilos. Em mulheres, posiciona-se no nível mesoesternal logo acima do tecido mamário ou na dobra submamária.',
    technique: 'Solicita-se ao paciente afastar levemente os braços para a passagem posterior da fita. A fita deve manter-se perfeitamente no plano horizontal nas vistas anterior, lateral e posterior. Fazer a leitura no final de uma expiração basal corrente.',
    bodyPosition: 'Em pé, postura ereta com braços relaxados ao longo do tronco após a passagem da fita métrica.',
    clinicalRelevance: 'Indicador do perímetro torácico, desenvolvimento peitoral/dorsal e expansibilidade da caixa torácica.',
    svgMarker: {
      y: 122,
      xStart: 80,
      xEnd: 160,
      side: 'centro'
    }
  },
  cintura: {
    key: 'cintura',
    label: 'Circunferência da Cintura (Menor Curvatura)',
    shortName: 'Cintura',
    category: 'tronco',
    standardReference: 'Protocolo ISAK / OMS / Bray & Gray (Padrão Ouro para RCQ)',
    tapePlane: 'horizontal',
    anatomicalLandmarks: 'Ponto de menor circunferência do tronco, situado no plano horizontal entre a margem inferior da última costela palpável (10ª costela) e a crista ilíaca.',
    technique: 'Caso o estreitamento natural da cintura não seja visualmente evidente (como em obesidade), mede-se no ponto médio exato entre a última costela e a crista ilíaca. O avaliador fica de frente ou de perfil. A fita não deve deprimir a pele. Fazer a leitura no final de uma expiração normal (volume corrente).',
    bodyPosition: 'Paciente em pé, calcanhares juntos, peso distribuído nos dois membros inferiores, braços ligeiramente cruzados sobre o peito para facilitar a visualização do tronco. Abdômen em repouso (não contrair nem murchar a barriga).',
    clinicalRelevance: 'Principal indicador de adiposidade visceral e componente do índice RCQ. Valores elevados correlacionam-se fortemente com resistência à insulina, síndrome metabólica e risco cardiovascular aumentado.',
    svgMarker: {
      y: 166,
      xStart: 90,
      xEnd: 150,
      side: 'centro'
    }
  },
  abdomen: {
    key: 'abdomen',
    label: 'Circunferência Abdominal (Cicatriz Umbilical)',
    shortName: 'Abdômen',
    category: 'tronco',
    standardReference: 'NCEP-ATP III / Diretriz Brasileira de Síndrome Metabólica',
    tapePlane: 'horizontal',
    anatomicalLandmarks: 'Plano horizontal passando exatamente sobre o ponto central da cicatriz umbilical (nível aproximado das vértebras L4-L5).',
    technique: 'A fita métrica é aplicada no plano estritamente horizontal contornando todo o tronco sobre a cicatriz umbilical. Certifique-se de que a fita na região lombar posterior não está inclinada. Leitura realizada no final da expiração espontânea.',
    bodyPosition: 'Em pé, braços ao lado do corpo ou repousando nos ombros, respiração espontânea, musculatura abdominal em repouso.',
    clinicalRelevance: 'Monitoramento da gordura abdominal periumbilical e circunferência de cintura segundo critérios NCEP-ATP III (> 102 cm para homens, > 88 cm para mulheres = risco substancialmente elevado).',
    svgMarker: {
      y: 184,
      xStart: 88,
      xEnd: 152,
      side: 'centro'
    }
  },
  quadril: {
    key: 'quadril',
    label: 'Circunferência do Quadril (Maior Perímetro Glúteo)',
    shortName: 'Quadril',
    category: 'tronco',
    standardReference: 'ISAK / OMS / Callaway et al.',
    tapePlane: 'horizontal',
    anatomicalLandmarks: 'Plano horizontal sobre o nível de maior protuberância posterior dos músculos glúteos e anterior sobre a sínfise púbica.',
    technique: 'O avaliador posiciona-se lateralmente ao paciente em nível visual adequado para identificar o ponto mais saliente dos glúteos. A fita contorna o quadril em plano perfeitamente horizontal, sem compressão dos glúteos.',
    bodyPosition: 'Paciente em pé com os pés juntos (calcanhares e artelhos tocando-se), peso corporal equilibrado igualmente em ambas as pernas, roupas leves e ajustadas ao corpo para evitar superestimação.',
    clinicalRelevance: 'Denominador do cálculo da Relação Cintura-Quadril (RCQ). Avalia adiposidade ginoide e trofismo da musculatura glútea.',
    svgMarker: {
      y: 218,
      xStart: 82,
      xEnd: 158,
      side: 'centro'
    }
  },
  bracoDireito: {
    key: 'bracoDireito',
    label: 'Circunferência do Braço Direito (Relaxado)',
    shortName: 'Braço D (Relaxado)',
    category: 'membros_superiores',
    standardReference: 'ISAK / Frisancho (Padrão de Reserva Muscular)',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Ponto médio entre o acrômio da escápula (borda lateral superior) e o olécrano da ulna (ponta do cotovelo).',
    technique: 'Com o cotovelo flexionado a 90 graus, mede-se a distância entre o acrômio e o olécrano e marca-se o ponto médio. Em seguida, estende-se o braço. A fita métrica é aplicada no ponto médio marcado, perpendicular ao eixo longitudinal do úmero.',
    bodyPosition: 'Braço estendido e relaxado ao lado do corpo, palma da mão voltada medialmente em direção à coxa (posição anatômica neutra).',
    clinicalRelevance: 'Utilizado em conjunto com a dobra tricipital para calcular a Área Muscular do Braço (AMB) e Circunferência Muscular do Braço (CMB), medindo reserva proteico-calórica e sarcopenia.',
    svgMarker: {
      y: 148,
      xStart: 50,
      xEnd: 74,
      side: 'direito'
    }
  },
  bracoEsquerdo: {
    key: 'bracoEsquerdo',
    label: 'Circunferência do Braço Esquerdo (Relaxado)',
    shortName: 'Braço E (Relaxado)',
    category: 'membros_superiores',
    standardReference: 'ISAK / Lohman',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Ponto médio entre o acrômio e o olécrano no membro superior esquerdo.',
    technique: 'Mesma metodologia de demarcação do ponto médio acrômio-olecraniano aplicada ao braço esquerdo. Fita sem compressão tecidual.',
    bodyPosition: 'Braço esquerdo solto e relaxado ao lado do corpo, palma para a coxa.',
    clinicalRelevance: 'Comparação bilateral de simetria com o braço dominante (direito). Diferenças superiores a 1-1,5 cm indicam assimetria funcional ou hipertrofia unilateral.',
    svgMarker: {
      y: 148,
      xStart: 166,
      xEnd: 190,
      side: 'esquerdo'
    }
  },
  antebracoDireito: {
    key: 'antebracoDireito',
    label: 'Circunferência do Antebraço Direito',
    shortName: 'Antebraço D',
    category: 'membros_superiores',
    standardReference: 'ISAK / Lohman',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Maior circunferência do antebraço, localizada aproximadamente 2 a 3 cm distalmente aos epicôndilos do úmero.',
    technique: 'A fita métrica é deslocada ao longo do terço proximal do antebraço até identificar a circunferência transversal máxima. O avaliador certifica-se de que a musculatura extensora e flexora não está contraída.',
    bodyPosition: 'Braço ligeiramente afastado do tronco, antebraço supinado ou em posição neutra, punho relaxado e dedos estendidos em repouso.',
    clinicalRelevance: 'Avalia trofismo dos músculos do antebraço, proporção segmentar dos membros superiores e força de preensão manual indireta.',
    svgMarker: {
      y: 188,
      xStart: 42,
      xEnd: 62,
      side: 'direito'
    }
  },
  antebracoEsquerdo: {
    key: 'antebracoEsquerdo',
    label: 'Circunferência do Antebraço Esquerdo',
    shortName: 'Antebraço E',
    category: 'membros_superiores',
    standardReference: 'ISAK / Lohman',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Maior circunferência do antebraço esquerdo, 2 a 3 cm distal aos epicôndilos.',
    technique: 'Leitura da maior circunferência transversal do antebraço esquerdo com o membro descontraído.',
    bodyPosition: 'Membro esquerdo ligeiramente afastado, musculatura descontraída.',
    clinicalRelevance: 'Avaliação de dominância e simetria muscular de membros superiores.',
    svgMarker: {
      y: 188,
      xStart: 178,
      xEnd: 198,
      side: 'esquerdo'
    }
  },
  coxaDireita: {
    key: 'coxaDireita',
    label: 'Circunferência da Coxa Direita (Medial)',
    shortName: 'Coxa D (Medial)',
    category: 'membros_inferiores',
    standardReference: 'ISAK / Lohman (Anthropometric Standardization Reference Manual)',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Ponto médio exato entre o ponto inguinal (prega entre a pelve e a coxa anterior) e a borda superior da patela.',
    technique: 'Com o paciente em pé e joelho em leve flexão, mede-se a distância do sulco inguinal até o ápice da patela. Marca-se o ponto médio. A fita é posicionada perpendicularmente ao eixo longitudinal do fêmur no ponto demarcado.',
    bodyPosition: 'Paciente em pé, peso transferido principalmente para o membro inferior esquerdo. O membro direito permanece apoiado no solo, com o joelho ligeiramente flexionado e musculatura do quadríceps totalmente relaxada.',
    clinicalRelevance: 'Avaliação do trofismo dos extensores do joelho (quadríceps femoral) e isquiotibiais. Fundamental no acompanhamento de hipertrofia, emagrecimento e sarcopenia em membros inferiores.',
    svgMarker: {
      y: 282,
      xStart: 88,
      xEnd: 118,
      side: 'direito'
    }
  },
  coxaEsquerda: {
    key: 'coxaEsquerda',
    label: 'Circunferência da Coxa Esquerda (Medial)',
    shortName: 'Coxa E (Medial)',
    category: 'membros_inferiores',
    standardReference: 'ISAK / Lohman',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Ponto médio entre a prega inguinal e a borda superior da patela esquerda.',
    technique: 'Mesma padronização da coxa direita aplicada ao membro contralateral. Ponto médio da coxa medido com fita perpendicular ao fêmur.',
    bodyPosition: 'Paciente em pé, peso corporal descarregado no membro direito. Coxa esquerda relaxada com joelho destravado.',
    clinicalRelevance: 'Comparação de simetria de membros inferiores, crucial para atletas, pós-operatórios e reabilitação de ligamentos.',
    svgMarker: {
      y: 282,
      xStart: 122,
      xEnd: 152,
      side: 'esquerdo'
    }
  },
  panturrilhaDireita: {
    key: 'panturrilhaDireita',
    label: 'Circunferência da Panturrilha Direita (Máxima)',
    shortName: 'Panturrilha D',
    category: 'membros_inferiores',
    standardReference: 'ISAK / EWGSOP (European Working Group on Sarcopenia in Older People)',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Plano horizontal sobre a maior circunferência da perna (panturrilha), na proeminência dos ventres musculares dos gastrocnêmios.',
    technique: 'O avaliador ajoelha-se ou senta-se ao lado do paciente. A fita é posicionada no plano horizontal perpendicular à tíbia e deslocada para cima e para baixo até registrar a maior leitura milimétrica possível.',
    bodyPosition: 'Paciente em pé, peso corporal distribuído igualmente entre os dois pés, afastados cerca de 20 cm (largura dos ombros). Músculos da panturrilha descontraídos (não ficar na ponta dos pés).',
    clinicalRelevance: 'Padrão ouro clínico para triagem de perda de massa muscular e sarcopenia em idosos (ponto de corte de risco: < 31 cm segundo EWGSOP e OMS). Também monitora hipertrofia do tríceps sural.',
    svgMarker: {
      y: 368,
      xStart: 92,
      xEnd: 116,
      side: 'direito'
    }
  },
  panturrilhaEsquerda: {
    key: 'panturrilhaEsquerda',
    label: 'Circunferência da Panturrilha Esquerda (Máxima)',
    shortName: 'Panturrilha E',
    category: 'membros_inferiores',
    standardReference: 'ISAK / EWGSOP',
    tapePlane: 'perpendicular',
    anatomicalLandmarks: 'Maior circunferência da perna esquerda no plano horizontal dos gastrocnêmios.',
    technique: 'Medição da maior leitura transversal na perna esquerda com a fita perpendicular à tíbia e peso distribuído uniformemente.',
    bodyPosition: 'Paciente em pé, apoio bípede simétrico, musculatura relaxada.',
    clinicalRelevance: 'Verificação de simetria bilateral de perna e diagnóstico de perda muscular localizada.',
    svgMarker: {
      y: 368,
      xStart: 124,
      xEnd: 148,
      side: 'esquerdo'
    }
  }
};
