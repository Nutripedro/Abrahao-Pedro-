import { SyntheticPatientProfile, TrainingGuideTopic } from '../types/training';

export const SYNTHETIC_PATIENTS: SyntheticPatientProfile[] = [
  {
    id: 'syn-1',
    nome: 'Mariana Lima Santos',
    nomeOfuscado: 'Mariana L. S.',
    cpfOfuscado: '***.***.482-19',
    telefoneOfuscado: '(11) 98***-**41',
    emailOfuscado: 'm***s@demo.clinica.com',
    idade: 28,
    sexo: 'F',
    peso: 62.8,
    altura: 165,
    percentualGordura: 20.4,
    massaMagraKg: 50.0,
    massaGordaKg: 12.8,
    imc: 23.1,
    classificacaoImc: 'Eutrofia (Peso Adequado)',
    tmbKcal: 1420,
    getKcal: 2130,
    metaClinica: 'Recomposição Corporal & Ganho de Massa Magra (Crossfit/Treino de Força)',
    focoPedagogico: 'Aprender validação de dobras bilaterais ISAK, cálculo de GET com Katch-McArdle e prescrição de creatina + beta-alanina.',
    categoriaClinica: 'esportiva',
    avatar: 'M',
    ultimaConsulta: '2026-08-28',
    status: 'Ativo',
    historicoConsultasCount: 4,
    dobras: {
      peitoral: 11.5,
      axilarMedia: 13.0,
      triceps: 15.5,
      subescapular: 14.2,
      abdomen: 18.0,
      supraIliaca: 16.0,
      coxa: 22.5,
      biceps: 9.0,
      panturrilhaMedial: 14.0
    },
    perimetria: {
      ombro: 102.0,
      torax: 88.0,
      cintura: 69.5,
      abdomen: 76.0,
      quadril: 98.5,
      bracoDireito: 28.5,
      bracoEsquerdo: 28.3,
      coxaDireita: 56.0,
      coxaEsquerda: 55.8,
      panturrilhaDireita: 36.0,
      panturrilhaEsquerda: 36.0
    },
    suplementosSugeridos: [
      {
        nome: 1,
        substancia: 'Creatina Monohidratada (Creapure®)',
        dosagem: '5g ao dia',
        horario: 'Pós-treino ou junto à principal refeição com carboidratos',
        motivoClinico: 'Aumento dos estoques intramusculares de fosfocreatina e potência anaeróbia',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 2,
        substancia: 'Beta-Alanina',
        dosagem: '3.2g ao dia (fracionada em 2 doses de 1.6g)',
        horario: 'Café da manhã e pré-treino (para mitigar parestesia)',
        motivoClinico: 'Tamponamento intracelular de íons H+ (aumento de carnosina muscular)',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 3,
        substancia: 'Whey Protein Isolado 90%',
        dosagem: '30g dissolvido em 200ml de água',
        horario: 'Lanche da tarde ou pós-treino imediato',
        motivoClinico: 'Atingimento da meta diária de 2.0g/kg de proteína de alto valor biológico',
        categoriaDose: 'nutricionista'
      }
    ],
    examesLaboratoriais: [
      {
        nome: 'Creatina Fosfoquinase (CPK Total)',
        valor: 245,
        unidade: 'U/L',
        referencia: '26 a 192 U/L',
        status: 'atencao',
        interpretacaoClinica: 'Elevação fisiológica esperada decorrente de microlesões do treinamento de força intenso (Crossfit).'
      },
      {
        nome: 'Ferritina Sérica',
        valor: 48,
        unidade: 'ng/mL',
        referencia: '13 a 150 ng/mL',
        status: 'normal',
        interpretacaoClinica: 'Reserva de ferro adequada para praticante de atividade física.'
      },
      {
        nome: 'Vitamina D (25-OH-Vitamina D)',
        valor: 42.5,
        unidade: 'ng/mL',
        referencia: '30 a 60 ng/mL',
        status: 'normal',
        interpretacaoClinica: 'Nível sérico ótimo para saúde óssea e função neuromuscular.'
      }
    ],
    anamneseResumo: 'Pratica Crossfit 5x/semana e musculação complementar. Dieta hiperproteica com 2.1g/kg de proteína. Boa recuperação muscular e sono regular de 7h30 por noite.'
  },
  {
    id: 'syn-2',
    nome: 'Carlos Eduardo Mendes',
    nomeOfuscado: 'Carlos E. M.',
    cpfOfuscado: '***.***.914-72',
    telefoneOfuscado: '(11) 97***-**10',
    emailOfuscado: 'c***s@demo.clinica.com',
    idade: 35,
    sexo: 'M',
    peso: 88.5,
    altura: 178,
    percentualGordura: 27.8,
    massaMagraKg: 63.9,
    massaGordaKg: 24.6,
    imc: 27.9,
    classificacaoImc: 'Sobrepeso / Risco Cardiometabólico',
    tmbKcal: 1790,
    getKcal: 2320,
    metaClinica: 'Controle de Dislipidemia, Redução de Gordura Visceral e HOMA-IR',
    focoPedagogico: 'Aprender cálculo de TMB Mifflin-St Jeor com restrição calórica moderada (-500 kcal), interpretação de perfil lipídico e prescrição de Ômega-3 EPA/DHA.',
    categoriaClinica: 'metabolica',
    avatar: 'C',
    ultimaConsulta: '2026-08-15',
    status: 'Ativo',
    historicoConsultasCount: 2,
    dobras: {
      peitoral: 24.0,
      axilarMedia: 28.5,
      triceps: 22.0,
      subescapular: 29.0,
      abdomen: 34.0,
      supraIliaca: 30.5,
      coxa: 28.0,
      biceps: 16.0,
      panturrilhaMedial: 20.0
    },
    perimetria: {
      ombro: 114.0,
      torax: 104.0,
      cintura: 94.0,
      abdomen: 101.5,
      quadril: 108.0,
      bracoDireito: 34.5,
      bracoEsquerdo: 34.2,
      coxaDireita: 61.0,
      coxaEsquerda: 60.8,
      panturrilhaDireita: 40.0,
      panturrilhaEsquerda: 40.0
    },
    suplementosSugeridos: [
      {
        nome: 1,
        substancia: 'Ômega-3 TG (Alta concentração EPA 840mg / DHA 560mg)',
        dosagem: '2 cápsulas ao dia (2000mg total)',
        horario: 'Junto ao almoço',
        motivoClinico: 'Redução de triglicerídeos séricos e modulação anti-inflamatória endotelial',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 2,
        substancia: 'Coenzima Q10 (Ubiquinona)',
        dosagem: '100mg ao dia',
        horario: 'Junto à principal refeição lipídica',
        motivoClinico: 'Otimização bioenergética mitocondrial e proteção antioxidante',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 3,
        substancia: 'Picolinato de Cromo',
        dosagem: '200mcg ao dia',
        horario: '30 minutos antes do almoço',
        motivoClinico: 'Potencialização da ação da insulina nos receptores GLUT-4',
        categoriaDose: 'nutricionista'
      }
    ],
    examesLaboratoriais: [
      {
        nome: 'Triglicerídeos em Jejum',
        valor: 218,
        unidade: 'mg/dL',
        referencia: '< 150 mg/dL',
        status: 'critico',
        interpretacaoClinica: 'Hipertrigliceridemia moderada. Indicação para restrição de carboidratos refinados e frutose líquida.'
      },
      {
        nome: 'Índice HOMA-IR (Glicemia x Insulina)',
        valor: 3.4,
        unidade: 'índice',
        referencia: '< 2.7',
        status: 'atencao',
        interpretacaoClinica: 'Presença de resistência periférica à insulina.'
      },
      {
        nome: 'Colesterol Não-HDL',
        valor: 168,
        unidade: 'mg/dL',
        referencia: '< 130 mg/dL',
        status: 'atencao',
        interpretacaoClinica: 'Aumento de partículas aterogênicas circulantes.'
      }
    ],
    anamneseResumo: 'Rotina corporativa estressante, trabalho sentado 9h/dia. Refeições irregulares com alta ingestão de ultraprocessados no período noturno. Iniciou caminhadas 3x/semana recentemente.'
  },
  {
    id: 'syn-3',
    nome: 'Beatriz Vasconcelos',
    nomeOfuscado: 'Beatriz V.',
    cpfOfuscado: '***.***.331-50',
    telefoneOfuscado: '(11) 96***-**09',
    emailOfuscado: 'b***z@demo.clinica.com',
    idade: 31,
    sexo: 'F',
    peso: 58.2,
    altura: 162,
    percentualGordura: 24.5,
    massaMagraKg: 43.9,
    massaGordaKg: 14.3,
    imc: 22.2,
    classificacaoImc: 'Eutrofia com Adiposidade Central',
    tmbKcal: 1340,
    getKcal: 1850,
    metaClinica: 'Manejo Nutricional de SOP (Síndrome dos Ovários Policísticos) & Sensibilidade à Insulina',
    focoPedagogico: 'Aprender prescrição estruturada de Mio-Inositol e N-Acetilcisteína (NAC) para fertilidade e saúde ovariana.',
    categoriaClinica: 'saude_mulher',
    avatar: 'B',
    ultimaConsulta: '2026-07-20',
    status: 'Em Acompanhamento',
    historicoConsultasCount: 3,
    dobras: {
      peitoral: 14.0,
      axilarMedia: 16.0,
      triceps: 19.0,
      subescapular: 18.0,
      abdomen: 24.5,
      supraIliaca: 21.0,
      coxa: 26.0,
      biceps: 12.0,
      panturrilhaMedial: 17.5
    },
    perimetria: {
      ombro: 97.0,
      torax: 84.0,
      cintura: 72.0,
      abdomen: 81.0,
      quadril: 97.0,
      bracoDireito: 26.5,
      bracoEsquerdo: 26.3,
      coxaDireita: 54.0,
      coxaEsquerda: 53.8,
      panturrilhaDireita: 34.5,
      panturrilhaEsquerda: 34.5
    },
    suplementosSugeridos: [
      {
        nome: 1,
        substancia: 'Mio-Inositol + D-Chiro-Inositol (Proporção 40:1)',
        dosagem: '2000mg Mio-Inositol + 50mg D-Chiro-Inositol',
        horario: 'Em jejum pela manhã diluído em água',
        motivoClinico: 'Sensibilização dos receptores de insulina e modulação folicular ovariana',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 2,
        substancia: 'N-Acetilcisteína (NAC)',
        dosagem: '600mg ao dia',
        horario: 'Antes de dormir',
        motivoClinico: 'Precursor de glutationa, redução do estresse oxidativo e auxílio na ovulação',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 3,
        substancia: 'Zinco Quelato (Bisglicinato)',
        dosagem: '20mg ao dia',
        horario: 'Após o jantar',
        motivoClinico: 'Inibição da 5-alfa-redutase para controle de acne e hiperandrogenismo',
        categoriaDose: 'nutricionista'
      }
    ],
    examesLaboratoriais: [
      {
        nome: 'Relação LH / FSH',
        valor: 2.3,
        unidade: 'relação',
        referencia: '< 1.5',
        status: 'atencao',
        interpretacaoClinica: 'Razão LH/FSH invertida, característica comum no fenótipo de SOP.'
      },
      {
        nome: 'Testosterona Total',
        valor: 64,
        unidade: 'ng/dL',
        referencia: '15 a 45 ng/dL',
        status: 'atencao',
        interpretacaoClinica: 'Hiperandrogenismo discreto. Requer foco em índice glicêmico baixo.'
      },
      {
        nome: 'Glicemia de Jejum',
        valor: 89,
        unidade: 'mg/dL',
        referencia: '70 a 99 mg/dL',
        status: 'normal',
        interpretacaoClinica: 'Glicemia normal, porém insulina basal em nível limítrofe (14.2 uUI/mL).'
      }
    ],
    anamneseResumo: 'Ciclos menstruais irregulares (38-45 dias), queixas de queda capilar e acne espalhadas na região mandibular. Respondeu bem à redução de carboidratos refinados.'
  },
  {
    id: 'syn-4',
    nome: 'Lucas Gabriel Silveira',
    nomeOfuscado: 'Lucas G. S.',
    cpfOfuscado: '***.***.755-63',
    telefoneOfuscado: '(11) 95***-**98',
    emailOfuscado: 'l***s@demo.clinica.com',
    idade: 24,
    sexo: 'M',
    peso: 76.4,
    altura: 181,
    percentualGordura: 11.8,
    massaMagraKg: 67.4,
    massaGordaKg: 9.0,
    imc: 23.3,
    classificacaoImc: 'Atlético / Baixa Adiposidade',
    tmbKcal: 1860,
    getKcal: 2850,
    metaClinica: 'Desempenho em Meia Maratona (21km) & Manutenção de Massa Muscular',
    focoPedagogico: 'Aprender periodização de carboidratos (intra-treino), reposição hidroeletrolítica e tabela nutricional de géis de carboidrato.',
    categoriaClinica: 'esportiva',
    avatar: 'L',
    ultimaConsulta: '2026-08-10',
    status: 'Ativo',
    historicoConsultasCount: 5,
    dobras: {
      peitoral: 7.0,
      axilarMedia: 8.5,
      triceps: 8.0,
      subescapular: 9.5,
      abdomen: 11.0,
      supraIliaca: 9.0,
      coxa: 12.0,
      biceps: 5.0,
      panturrilhaMedial: 7.5
    },
    perimetria: {
      ombro: 112.0,
      torax: 97.0,
      cintura: 76.0,
      abdomen: 79.0,
      quadril: 94.0,
      bracoDireito: 32.0,
      bracoEsquerdo: 32.0,
      coxaDireita: 55.0,
      coxaEsquerda: 55.0,
      panturrilhaDireita: 37.5,
      panturrilhaEsquerda: 37.5
    },
    suplementosSugeridos: [
      {
        nome: 1,
        substancia: 'Eletrólitos em Pó (Sódio 400mg, Potássio 150mg, Magnésio 60mg)',
        dosagem: '1 sachê dissolvido em 500ml de água',
        horario: 'A cada 45min de corrida contínua',
        motivoClinico: 'Prevenção de hiponatremia dilucional e manutenção da osmolaridade plasmática',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 2,
        substancia: 'Cafeína Anidra',
        dosagem: '200mg (aprox. 3mg/kg)',
        horario: '40 minutos antes dos treinos de tiro e longões',
        motivoClinico: 'Redução da percepção subjetiva de esforço (RPE) e estímulo do SNC',
        categoriaDose: 'nutricionista'
      }
    ],
    examesLaboratoriais: [
      {
        nome: 'Hemoglobina',
        valor: 15.6,
        unidade: 'g/dL',
        referencia: '13.5 a 17.5 g/dL',
        status: 'normal',
        interpretacaoClinica: 'Capacidade de transporte de oxigênio excelente.'
      },
      {
        nome: 'Ureia Sérica',
        valor: 44,
        unidade: 'mg/dL',
        referencia: '15 a 45 mg/dL',
        status: 'normal',
        interpretacaoClinica: 'Turnover proteico e hidratação dentro dos parâmetros ótimos.'
      }
    ],
    anamneseResumo: 'Volume de treino: 45km semanais de corrida + 2 sessões de fortalecimento. Sem histórico de lesões osteomusculares recentes.'
  },
  {
    id: 'syn-5',
    nome: 'Juliana Costa e Silva',
    nomeOfuscado: 'Juliana C. S.',
    cpfOfuscado: '***.***.118-94',
    telefoneOfuscado: '(11) 94***-**87',
    emailOfuscado: 'j***a@demo.clinica.com',
    idade: 44,
    sexo: 'F',
    peso: 71.0,
    altura: 168,
    percentualGordura: 31.4,
    massaMagraKg: 48.7,
    massaGordaKg: 22.3,
    imc: 25.2,
    classificacaoImc: 'Sobrepeso Leve / Perimenopausa',
    tmbKcal: 1390,
    getKcal: 1940,
    metaClinica: 'Preservação de Densidade Mineral Óssea & Controle de Fogachos e Sono',
    focoPedagogico: 'Aprender dosagem sinérgica de Cálcio Citrato Malato + K2 Menaquinona-7 + Magnésio e interpretação de TSH.',
    categoriaClinica: 'longevidade',
    avatar: 'J',
    ultimaConsulta: '2026-08-01',
    status: 'Ativo',
    historicoConsultasCount: 1,
    dobras: {
      peitoral: 18.0,
      axilarMedia: 22.0,
      triceps: 25.0,
      subescapular: 24.0,
      abdomen: 30.0,
      supraIliaca: 27.0,
      coxa: 32.0,
      biceps: 16.0,
      panturrilhaMedial: 21.0
    },
    perimetria: {
      ombro: 104.0,
      torax: 92.0,
      cintura: 79.0,
      abdomen: 88.0,
      quadril: 104.0,
      bracoDireito: 29.5,
      bracoEsquerdo: 29.2,
      coxaDireita: 58.0,
      coxaEsquerda: 57.8,
      panturrilhaDireita: 36.5,
      panturrilhaEsquerda: 36.5
    },
    suplementosSugeridos: [
      {
        nome: 1,
        substancia: 'Cálcio Citrato Malato + Vitamina K2 (MK-7) + Vitamina D3',
        dosagem: 'Cálcio 300mg + K2 100mcg + D3 2000UI',
        horario: 'Junto ao almoço',
        motivoClinico: 'Fixação óssea direcionada do cálcio (osteocalcina ativada) prevenindo calcificação arterial',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 2,
        substancia: 'Magnésio Bisglicinato (Quelato)',
        dosagem: '250mg de magnésio elementar',
        horario: '30 minutos antes de dormir',
        motivoClinico: 'Relaxamento muscular, melhora da arquitetura do sono e ativação de GABA',
        categoriaDose: 'nutricionista'
      }
    ],
    examesLaboratoriais: [
      {
        nome: 'TSH Ultra Sensível',
        valor: 3.8,
        unidade: 'uUI/mL',
        referencia: '0.4 a 4.5 uUI/mL',
        status: 'normal',
        interpretacaoClinica: 'Função tireoidiana preservada, porém recomendável monitorar anticorpos anti-TPO.'
      },
      {
        nome: 'Vitamina D (25-OH)',
        valor: 26.0,
        unidade: 'ng/mL',
        referencia: '> 30.0 ng/mL para saúde óssea',
        status: 'atencao',
        interpretacaoClinica: 'Hipovitaminose D leve com indicação formal de reposição.'
      }
    ],
    anamneseResumo: 'Início de sintomas de climatério (ondas de calor ocasionais, insônia terminal). Deseja emagrecimento saudável sem perda de massa magra.'
  },
  {
    id: 'syn-6',
    nome: 'Rodrigo Fagundes Alencar',
    nomeOfuscado: 'Rodrigo F. A.',
    cpfOfuscado: '***.***.629-01',
    telefoneOfuscado: '(11) 93***-**55',
    emailOfuscado: 'r***s@demo.clinica.com',
    idade: 48,
    sexo: 'M',
    peso: 92.0,
    altura: 175,
    percentualGordura: 26.0,
    massaMagraKg: 68.1,
    massaGordaKg: 23.9,
    imc: 30.0,
    classificacaoImc: 'Pós-Bariátrico (Bypass em Y de Roux - 18 meses)',
    tmbKcal: 1710,
    getKcal: 2200,
    metaClinica: 'Prevenção de Carências de Micronutrientes (B12, Ferro, Zinco) & Aporte Proteico',
    focoPedagogico: 'Aprender prescrição sublingual de Vitamina B12 Metilcobalamina e monitoramento de curva de absorção de ferro.',
    categoriaClinica: 'bariatrica',
    avatar: 'R',
    ultimaConsulta: '2026-08-20',
    status: 'Ativo',
    historicoConsultasCount: 6,
    dobras: {
      peitoral: 19.0,
      axilarMedia: 22.0,
      triceps: 18.5,
      subescapular: 21.0,
      abdomen: 27.0,
      supraIliaca: 23.0,
      coxa: 24.0,
      biceps: 13.0,
      panturrilhaMedial: 17.0
    },
    perimetria: {
      ombro: 110.0,
      torax: 101.0,
      cintura: 89.0,
      abdomen: 94.0,
      quadril: 102.0,
      bracoDireito: 33.0,
      bracoEsquerdo: 32.8,
      coxaDireita: 57.0,
      coxaEsquerda: 56.8,
      panturrilhaDireita: 38.0,
      panturrilhaEsquerda: 38.0
    },
    suplementosSugeridos: [
      {
        nome: 1,
        substancia: 'Metilcobalamina (Vitamina B12 Ativa Sublingual)',
        dosagem: '1000mcg ao dia',
        horario: 'Sublingual pela manhã',
        motivoClinico: 'Absorção independente do fator intrínseco gástrico ausente no Bypass gástrico',
        categoriaDose: 'nutricionista'
      },
      {
        nome: 2,
        substancia: 'Ferro Quelato (Bisglicinato Ferroso) + Vitamina C',
        dosagem: 'Ferro 30mg + Vit C 200mg',
        horario: '2 horas longe de refeições com cálcio e café/chás',
        motivoClinico: 'Prevenção de anemia ferropriva comum por bypass duodenal',
        categoriaDose: 'nutricionista'
      }
    ],
    examesLaboratoriais: [
      {
        nome: 'Vitamina B12 Sérica',
        valor: 540,
        unidade: 'pg/mL',
        referencia: '200 a 900 pg/mL',
        status: 'normal',
        interpretacaoClinica: 'Nível sérico normal mantido sob reposição sublingual contínua.'
      },
      {
        nome: 'Ácido Fólico (Folato Sérico)',
        valor: 14.2,
        unidade: 'ng/mL',
        referencia: '> 4.0 ng/mL',
        status: 'normal',
        interpretacaoClinica: 'Nível adequado sem necessidade de dose de ataque.'
      }
    ],
    anamneseResumo: 'Cirurgia bariátrica realizada há 18 meses com perda ponderal de 42kg. Apresenta boa tolerância alimentar com fracionamento em 6 refeições diárias.'
  }
];

export const TRAINING_GUIDE_TOPICS: TrainingGuideTopic[] = [
  {
    id: 'guia-antropometria',
    titulo: '1. Antropometria & Dobras ISAK',
    subtitulo: 'Validação Fisiológica e Dobras Bilaterais',
    modulo: 'antropometria',
    resumo: 'Aprenda a registrar as 9 dobras cutâneas anatômicas com checagem de limites biológicos em tempo real.',
    passos: [
      'Selecione um paciente de teste ou carregue o caso da Mariana Lima (Atleta).',
      'Experimente digitar uma dobra com valor discrepante (ex: tricipital 65mm) para testar o alerta tátil/visual.',
      'Alterne entre os protocolos Jackson & Pollock (3 ou 7 dobras), Petroski, Durnin & Womersley ou Faulkner.',
      'Veja o cálculo automático de Densidade Corporal (Siri/Brozek), Massa Magra vs. Massa Gorda e Gráfico de Evolução.'
    ],
    dicaClinica: 'O sistema bloqueia equações inadequadas e avisa se o protocolo exige dobras que não foram medidas.',
    rotaSugerida: '/calculadoras/dobras-cutaneas',
    casoIdRecomendado: 'syn-1'
  },
  {
    id: 'guia-anvisa',
    titulo: '2. Tabela Nutricional ANVISA',
    subtitulo: 'RDC 429/2020 e IN 75/2020 com Lupa Frontal',
    modulo: 'anvisa',
    resumo: 'Gere tabelas oficiais para rótulos alimentares com arredondamentos legais exatos por 100g e por porção.',
    passos: [
      'Acesse a tela do Gerador de Tabela ANVISA.',
      'Insira os dados da receita (ex: Barra Proteica ou Granola Caseira) por 100g e tamanho da porção comercial.',
      'Observe os alertas automáticos da Rotulagem Nutricional Frontal (FOPL) para Açúcar Adicionado, Gordura Saturada e Sódio.',
      'Exporte em formato de tabela horizontal, linear ou agregada com conformidade RDC 429.'
    ],
    dicaClinica: 'A IN 75/2020 exige que açúcares adicionados e totais sejam declarados separadamente.',
    rotaSugerida: '/nutricao/tabela-anvisa',
    casoIdRecomendado: 'syn-4'
  },
  {
    id: 'guia-suplementos',
    titulo: '3. Receituário de Suplementos',
    subtitulo: 'Segregação de Doses Nutri vs. Médico',
    modulo: 'suplementos',
    resumo: 'Prescreva fitoterápicos, vitaminas e aminoácidos com verificação de limites legais do CFN.',
    passos: [
      'Acesse o módulo de Receituário Inteligente de Suplementos.',
      'Busque por substâncias como Mio-Inositol, Creatina, Ômega-3 ou N-Acetilcisteína.',
      'Observe a indicação explícita de dose nutricional vs dose médica de prescrição restrita.',
      'Gere o receituário formatado com posologia, horários e justificativa terapêutica.'
    ],
    dicaClinica: 'Conforme a Resolução CFN nº 656/2020, o nutricionista pode prescrever fitoterápicos e suplementos dentro das dosagens seguras estabelecidas.',
    rotaSugerida: '/nutricao/suplementos',
    casoIdRecomendado: 'syn-3'
  },
  {
    id: 'guia-exames',
    titulo: '4. Requisição de Exames',
    subtitulo: 'Painéis Laboratoriais por Especialidade',
    modulo: 'exames',
    resumo: 'Selecione exames bioquímicos agrupados por painéis clínicos (Glicêmico, Lipídico, Hormonal, Hepático e Mineral).',
    passos: [
      'Acesse a Requisição Inteligente de Exames.',
      'Selecione um painel clínico pronto (ex: Painel Metabólico de Carlos Eduardo ou Painel Hormonal de Beatriz).',
      'Edite as justificativas clínicas obrigatórias para autorização por convênios e laboratórios.',
      'Gere o PDF padrão do laudo com assinatura digital do profissional.'
    ],
    dicaClinica: 'A Lei Federal nº 8.234/1991 (Art. 4º, VIII) garante ao nutricionista a solicitação de exames laboratoriais necessários ao acompanhamento dietoterápico.',
    rotaSugerida: '/clinico/exames',
    casoIdRecomendado: 'syn-2'
  },
  {
    id: 'guia-crm',
    titulo: '5. CRM & Marketing Ético',
    subtitulo: 'Automações WhatsApp e Retenção',
    modulo: 'crm',
    resumo: 'Explore o funil de pacientes e teste as 10 automações de comunicação ética (CFN Res. 599).',
    passos: [
      'Acesse o CRM Clínico e visualize o funil Kanban com pacientes fictícios.',
      'Simule o envio de um lembrete de consulta de 24h ou 2h via WhatsApp.',
      'Verifique a lista de recuperação de pacientes inativos há mais de 45 dias.',
      'Analise a distribuição de notas da pesquisa NPS.'
    ],
    dicaClinica: 'Mensagens pré-configuradas respeitam o sigilo e não expõem diagnósticos em canais abertos.',
    rotaSugerida: '/crm',
    casoIdRecomendado: 'syn-1'
  }
];
