export interface SyntheticPatientProfile {
  id: string;
  nome: string;
  nomeOfuscado: string;
  cpfOfuscado: string;
  telefoneOfuscado: string;
  emailOfuscado: string;
  idade: number;
  sexo: 'M' | 'F';
  peso: number;
  altura: number;
  percentualGordura: number;
  massaMagraKg: number;
  massaGordaKg: number;
  imc: number;
  classificacaoImc: string;
  tmbKcal: number;
  getKcal: number;
  metaClinica: string;
  focoPedagogico: string;
  categoriaClinica: 'esportiva' | 'metabolica' | 'saude_mulher' | 'emagrecimento' | 'bariatrica' | 'longevidade';
  avatar: string;
  ultimaConsulta: string;
  status: 'Ativo' | 'Em Acompanhamento' | 'Alta';
  historicoConsultasCount: number;
  
  // Antropometria sintética
  dobras: {
    peitoral: number;
    axilarMedia: number;
    triceps: number;
    subescapular: number;
    abdomen: number;
    supraIliaca: number;
    coxa: number;
    biceps: number;
    panturrilhaMedial: number;
  };
  
  perimetria: {
    ombro: number;
    torax: number;
    cintura: number;
    abdomen: number;
    quadril: number;
    bracoDireito: number;
    bracoEsquerdo: number;
    coxaDireita: number;
    coxaEsquerda: number;
    panturrilhaDireita: number;
    panturrilhaEsquerda: number;
  };

  // Suplementos prescritos
  suplementosSugeridos: {
    nome: number | string;
    substancia: string;
    dosagem: string;
    horario: string;
    motivoClinico: string;
    categoriaDose: 'nutricionista' | 'medico';
  }[];

  // Exames laboratoriais sintéticos
  examesLaboratoriais: {
    nome: string;
    valor: number;
    unidade: string;
    referencia: string;
    status: 'normal' | 'atencao' | 'critico';
    interpretacaoClinica: string;
  }[];

  anamneseResumo: string;
}

export type TrainingLevel = 'iniciante' | 'intermediario' | 'avancado';

export interface TrainingGuideTopic {
  id: string;
  titulo: string;
  subtitulo: string;
  modulo: 'geral' | 'antropometria' | 'calculadoras' | 'anvisa' | 'suplementos' | 'exames' | 'crm' | 'app';
  resumo: string;
  passos: string[];
  dicaClinica: string;
  rotaSugerida: string;
  casoIdRecomendado: string;
}
