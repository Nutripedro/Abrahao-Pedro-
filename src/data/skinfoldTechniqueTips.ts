import { SkinfoldKey } from '../types';
import caliperArmImg from '../assets/images/caliper_pinch_technique_1788534465103.jpg';
import trunkPinchImg from '../assets/images/trunk_pinch_technique_1788534480083.jpg';
import legPinchImg from '../assets/images/leg_pinch_technique_1788534491653.jpg';

export interface SkinfoldTechniqueData {
  key: SkinfoldKey;
  number: number;
  name: string;
  shortName: string;
  regionalGroup: 'Membro Superior' | 'Tronco' | 'Membro Inferior';
  orientationType: 'vertical' | 'diagonal' | 'horizontal';
  orientationAngle: string;
  anatomicalLandmark: string;
  patientStance: string;
  pinchingMethod: string;
  caliperApplication: string;
  timingRule: string;
  commonErrors: string[];
  clinicalNotes: string;
  imageSrc: string;
  imageAlt: string;
  isakRule: string;
}

export const SKINFOLD_TECHNIQUE_TIPS: Record<SkinfoldKey, SkinfoldTechniqueData> = {
  triceps: {
    key: 'triceps',
    number: 3,
    name: 'Dobra Tricipital (Tríceps)',
    shortName: 'Tríceps',
    regionalGroup: 'Membro Superior',
    orientationType: 'vertical',
    orientationAngle: 'Vertical (90° em relação ao eixo do braço)',
    anatomicalLandmark: 'Ponto médio na face posterior do braço direito, entre a borda súpero-lateral do acrômio da escápula e a ponta do olécrano da ulna.',
    patientStance: 'Paciente ereto, braço direito completamente relaxado e solto ao lado do tronco, palma voltada para a coxa (posição neutra).',
    pinchingMethod: 'Com a mão esquerda, segure a dobra dupla de pele e tecido subcutâneo com o polegar e o indicador 1 cm acima da linha de marcação, paralela ao eixo longitudinal do braço.',
    caliperApplication: 'Posicione as hastes do adipômetro exatamente sobre o ponto demarcado, perpendicular à dobra (1 cm abaixo dos dedos examinadores).',
    timingRule: 'Aguarde exatamente 2 segundos após a soltura completa do gatilho para ler o mostrador, permitindo estabilização da compressibilidade sem deformação tecidual.',
    commonErrors: [
      'Braço com cotovelo flexionado ou bíceps/tríceps contraídos.',
      'Pinçamento oblíquo em vez de puramente vertical.',
      'Pinçar a fáscia do músculo tríceps junto com o panículo adiposo.',
      'Leitura tardia (> 3 segundos) causando desidratação tecidual e subestimação.',
    ],
    clinicalNotes: 'A dobra mais sensível e reprodutível para monitoramento de perda de gordura em membros superiores e no protocolo Jackson & Pollock.',
    imageSrc: caliperArmImg,
    imageAlt: 'Ilustração clínica de pinçamento correto da dobra cutânea tricipital com adipômetro',
    isakRule: 'ISAK Nível 1 — Distância do acrômio ao olécrano aferida com braço flexionado a 90°, mas dobra medida com braço totalmente estendido e relaxado.',
  },

  biceps: {
    key: 'biceps',
    number: 8,
    name: 'Dobra Bicipital (Bíceps)',
    shortName: 'Bíceps',
    regionalGroup: 'Membro Superior',
    orientationType: 'vertical',
    orientationAngle: 'Vertical (90° no eixo anterior do braço)',
    anatomicalLandmark: 'Face anterior do braço direito, sobre o ventre do músculo bíceps braquial, no mesmo nível horizontal da marca da dobra tricipital.',
    patientStance: 'Em pé, braço estendido ao lado do tronco, antebraço levemente supinado com a palma da mão voltada para a frente.',
    pinchingMethod: 'Pinçar uma dobra vertical no centro da face anterior do braço, destacando o tecido celular subcutâneo do músculo bíceps subjacente.',
    caliperApplication: 'Aplicar as mandíbulas do plicômetro 1 cm distal aos dedos que sustentam a prega, com ângulo perpendicular.',
    timingRule: 'Leitura após 2 segundos de compressão das molas calibradas (pressão constante de 10 g/mm²).',
    commonErrors: [
      'Tensão involuntária do músculo bíceps braquial.',
      'Medir em altura diferente da marcação tricipital.',
      'Girar internamente o braço durante a preensão.',
    ],
    clinicalNotes: 'Indispensável no protocolo de Durnin & Womersley (1974) para estimativa de densidade corporal.',
    imageSrc: caliperArmImg,
    imageAlt: 'Diagrama clínico do pinçamento da dobra bicipital com polegar e indicador',
    isakRule: 'ISAK Nível 1 — Marcação feita projetando o nível da fita tricipital para a face anterior.',
  },

  subescapular: {
    key: 'subescapular',
    number: 4,
    name: 'Dobra Subescapular',
    shortName: 'Subescapular',
    regionalGroup: 'Tronco',
    orientationType: 'diagonal',
    orientationAngle: 'Diagonal / Oblíqua (~45° ínfero-lateral)',
    anatomicalLandmark: '1 a 2 cm imediatamente abaixo e lateralmente ao ângulo inferior da escápula direita.',
    patientStance: 'Paciente ereto com postura anatômica neutra, ambos os braços soltos e ombros relaxados.',
    pinchingMethod: 'Pinçar a prega cutânea em ângulo de 45°, seguindo as linhas naturais de tensão e clivagem da pele (linhas de Langer), direcionando-se para o cotovelo direito.',
    caliperApplication: 'Hastes posicionadas a 1 cm distal da preensão digital, com o adipômetro perpendicular ao plano da dobra oblíqua.',
    timingRule: 'Leitura precisa em 2 segundos.',
    commonErrors: [
      'Manter o braço do paciente fletido nas costas durante a medida (altera a espessura da dobra).',
      'Pinçamento estritamente vertical ou horizontal ao invés de diagonal.',
      'Palpar a escápula sem relaxar a musculatura dorsal antes da marcação.',
    ],
    clinicalNotes: 'Excelente marcador de acúmulo de gordura no tronco superior e forte correlação com risco metabólico cardiovascular.',
    imageSrc: trunkPinchImg,
    imageAlt: 'Ilustração médica da técnica de dobra subescapular a 45 graus no tronco posterior',
    isakRule: 'ISAK Nível 1 — Linha oblíqua traçada a 45 graus para baixo e para fora a partir do ângulo inferior da escápula.',
  },

  peitoral: {
    key: 'peitoral',
    number: 1,
    name: 'Dobra Peitoral (Torácica)',
    shortName: 'Peitoral',
    regionalGroup: 'Tronco',
    orientationType: 'diagonal',
    orientationAngle: 'Diagonal (~45° acompanhando a borda do peitoral maior)',
    anatomicalLandmark: 'Homens: ponto médio entre a linha axilar anterior e o mamilo. Mulheres: 1/3 da distância entre a linha axilar anterior e o mamilo (terço proximal).',
    patientStance: 'Paciente em pé, tórax relaxado em expiração normal, peso distribuído em ambos os pés.',
    pinchingMethod: 'Destacar a dobra na diagonal seguindo a linha natural de inserção do músculo peitoral maior em direção ao mamilo.',
    caliperApplication: 'As hastes do plicômetro devem ser inseridas 1 cm abaixo dos dedos, perpendiculares à dobra.',
    timingRule: 'Aferir a leitura com 2 segundos de estabilização do manômetro.',
    commonErrors: [
      'Não respeitar a diferença de 1/3 para mulheres versus 1/2 para homens.',
      'Paciente em inspiração forçada (tensão peitoral excessiva).',
      'Pinçamento horizontal inadequado.',
    ],
    clinicalNotes: 'Componente chave nos protocolos Jackson & Pollock de 3 e 7 dobras para indivíduos masculinos e atletas.',
    imageSrc: trunkPinchImg,
    imageAlt: 'Técnica de medição de dobra peitoral no tórax',
    isakRule: 'ISAK Nível 1 & 2 — Marcação sobre a linha imaginária entre a prega axilar anterior e o ponto mamilovertebral.',
  },

  axilarMedia: {
    key: 'axilarMedia',
    number: 2,
    name: 'Dobra Axilar Média',
    shortName: 'Axilar Média',
    regionalGroup: 'Tronco',
    orientationType: 'horizontal',
    orientationAngle: 'Horizontal (ou levemente inclinada seguindo o gradil costal)',
    anatomicalLandmark: 'Intersecção da linha axilar média na altura da junção xifoesternal (nível do apêndice xifoide do esterno).',
    patientStance: 'Em pé, com o braço direito abduzido a 90° ou apoiado sobre o ombro esquerdo (ou no ombro do avaliador).',
    pinchingMethod: 'Pinçar horizontalmente sobre o gradil costal, tomando cuidado para elevar apenas a pele e gordura subcutânea das costelas.',
    caliperApplication: 'Plicômetro inserido 1 cm à frente ou abaixo dos dedos, perpendicularmente ao eixo da dobra.',
    timingRule: 'Leitura em 2 segundos.',
    commonErrors: [
      'Confundir a linha axilar média com a linha axilar anterior.',
      'Paciente inclinando o tronco para o lado oposto para facilitar a pegada.',
      'Pinçamento desconfortável sobre os arcos costais sem destacar a dobra.',
    ],
    clinicalNotes: 'Permite avaliar a espessura adiposa na parede torácica lateral.',
    imageSrc: trunkPinchImg,
    imageAlt: 'Pinçamento da dobra axilar média na linha do apêndice xifoide',
    isakRule: 'ISAK Nível 2 — Linha vertical média axilar cruzada na altura horizontal do apêndice xifoide.',
  },

  supraIliaca: {
    key: 'supraIliaca',
    number: 6,
    name: 'Dobra Supra-ilíaca',
    shortName: 'Supra-ilíaca',
    regionalGroup: 'Tronco',
    orientationType: 'diagonal',
    orientationAngle: 'Diagonal / Oblíqua (~45° ínfero-anterior)',
    anatomicalLandmark: 'Imediatamente acima da crista ilíaca, no ponto em que ela cruza a linha axilar anterior.',
    patientStance: 'Em pé, ereto, pés juntos, braço direito dobrado sobre o peito para liberar o flanco ilíaco.',
    pinchingMethod: 'Palpar a borda óssea superior da crista ilíaca com a mão livre. Pinçar a prega diagonalmente para baixo e para a frente seguindo o contorno da bacia.',
    caliperApplication: 'Hastes posicionadas 1 cm medial/inferior aos dedos, perpendiculares à dobra destacada.',
    timingRule: 'Aguardar 2 segundos para o ponteiro estabilizar.',
    commonErrors: [
      'Medir muito posteriormente (na região dos flancos/lombar).',
      'Pinçar horizontalmente ao invés de acompanhar a curva da crista ilíaca.',
      'Apertar contra o osso sem tracionar a camada subcutânea.',
    ],
    clinicalNotes: 'Ponto crítico na avaliação de gordura androide e resistência à insulina.',
    imageSrc: trunkPinchImg,
    imageAlt: 'Ilustração do pinçamento da dobra supra-ilíaca acima da crista ilíaca',
    isakRule: 'ISAK Nível 1 (Crista Ilíaca / Supraespinal) — Pinçamento no bordo superior da crista ilíaca na linha axilar.',
  },

  abdomen: {
    key: 'abdomen',
    number: 5,
    name: 'Dobra Abdominal',
    shortName: 'Abdômen',
    regionalGroup: 'Tronco',
    orientationType: 'vertical',
    orientationAngle: 'Vertical (90° paralela ao eixo corporal)',
    anatomicalLandmark: 'Exatamente 2 cm à direita da borda externa da cicatriz umbilical.',
    patientStance: 'Paciente ereto com postura natural, braços ao lado do corpo, respiração espontânea e abdômen não contraído.',
    pinchingMethod: 'Mão esquerda pinça verticalmente a dobra 1 cm acima da marca. Afaste delicadamente o panículo da parede muscular abdominal.',
    caliperApplication: 'Plicômetro aplicado na marca de 2 cm, perpendicular à dobra vertical.',
    timingRule: 'Registro com 2 segundos.',
    commonErrors: [
      'Paciente prendendo a respiração (Valsalva) ou contraindo o músculo reto abdominal.',
      'Medir muito perto ou muito longe da cicatriz umbilical (usar régua de 2 cm).',
      'Pinçamento horizontal quando o protocolo exige vertical.',
    ],
    clinicalNotes: 'Fundamental em todos os protocolos Jackson & Pollock; indicador direto de adiposidade abdominal e risco cardiometabólico.',
    imageSrc: trunkPinchImg,
    imageAlt: 'Técnica correta de pinçamento vertical da dobra abdominal a 2cm do umbigo',
    isakRule: 'ISAK Nível 1 — Ponto 5 cm à direita no padrão australiano ISAK, ou 2 cm à direita no protocolo padrão Jackson-Pollock.',
  },

  coxa: {
    key: 'coxa',
    number: 7,
    name: 'Dobra da Coxa Medial / Anterior',
    shortName: 'Coxa',
    regionalGroup: 'Membro Inferior',
    orientationType: 'vertical',
    orientationAngle: 'Vertical (longitudinal sobre o reto femoral)',
    anatomicalLandmark: 'Face anterior da coxa, sobre o músculo reto femoral, no ponto médio entre a prega inguinal e a borda proximal (superior) da patela.',
    patientStance: 'Paciente em pé com todo o peso na perna esquerda. Perna direita livre, pé apoiado no chão sem peso e joelho ligeiramente flexionado para relaxamento total do quadríceps.',
    pinchingMethod: 'Pinçar firmemente com polegar e indicador da mão esquerda. Caso a fáscia seja rígida, o paciente pode ajudar elevando suavemente a pele da parte inferior da coxa.',
    caliperApplication: 'Plicômetro posicionado verticalmente a 1 cm distal dos dedos.',
    timingRule: 'Leitura após 2 segundos de estabilização.',
    commonErrors: [
      'Paciente contraindo o quadríceps para manter o equilíbrio (deve relaxar totalmente).',
      'Marcação fora do ponto médio exato (medir com fita métrica inextensível).',
      'Pinçar a fáscia muscular causando dor e valor hiperestimado.',
    ],
    clinicalNotes: 'Representa a gordura de membros inferiores nos protocolos de 3 e 7 dobras.',
    imageSrc: legPinchImg,
    imageAlt: 'Técnica de medição de dobra da coxa com quadríceps relaxado',
    isakRule: 'ISAK Nível 1 — Ponto médio medido entre o ligamento inguinal e a borda superior da patela.',
  },

  panturrilhaMedial: {
    key: 'panturrilhaMedial',
    number: 9,
    name: 'Dobra da Panturrilha Medial',
    shortName: 'Panturrilha',
    regionalGroup: 'Membro Inferior',
    orientationType: 'vertical',
    orientationAngle: 'Vertical (na face interna da perna)',
    anatomicalLandmark: 'Face medial (interna) da perna direita, exatamente no nível da circunferência máxima da panturrilha.',
    patientStance: 'Paciente sentado na ponta da maca com os joelhos a 90° e pés no chão, ou em pé com o pé direito apoiado em banco de 40 cm.',
    pinchingMethod: 'Pinçar a dobra verticalmente na face medial com a mão esquerda, destacando do ventre muscular do gastrocnêmio.',
    caliperApplication: 'Hastes do adipômetro aplicadas horizontalmente a 1 cm abaixo dos dedos, perpendiculares à dobra.',
    timingRule: '2 segundos de estabilização.',
    commonErrors: [
      'Medir com o paciente descarregando peso na perna avaliada.',
      'Localização fora do ponto de perímetro máximo.',
      'Pinçamento posterior ao invés de medial.',
    ],
    clinicalNotes: 'Utilizada no protocolo Slaughter (crianças e adolescentes) e no somatótipo de Heath-Carter para endomorfia.',
    imageSrc: legPinchImg,
    imageAlt: 'Ilustração do pinçamento vertical da dobra da panturrilha medial com pé apoiado',
    isakRule: 'ISAK Nível 1 — Circunferência máxima identificada previamente com fita métrica.',
  },
};
