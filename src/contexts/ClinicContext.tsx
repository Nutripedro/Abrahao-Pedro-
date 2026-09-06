import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClinicUnit,
  ClinicFeaturesState,
  ConsultingRoom,
  ClinicalEquipment,
  UnitInventoryItem
} from '../types/clinic';

export interface ClinicFeatureMeta {
  key: keyof ClinicFeaturesState;
  title: string;
  category: 'operacional' | 'regulatorio' | 'clinico' | 'seguranca';
  shortDesc: string;
  badge: string;
}

export const CLINIC_FEATURES_CATALOG: ClinicFeatureMeta[] = [
  {
    key: 'multiUnitSync',
    title: 'Sincronização em Nuvem Inter-Filiais',
    category: 'operacional',
    shortDesc: 'Replicação em tempo real de agendas, cadastros e parâmetros entre todas as filiais.',
    badge: 'Multi-Tenant'
  },
  {
    key: 'roomScheduling',
    title: 'Gestão Dinâmica de Consultórios & Salas',
    category: 'operacional',
    shortDesc: 'Controle de ocupação (Livre, Em Consulta, Higienização) e rodízio de salas físicas.',
    badge: 'Tempo Real'
  },
  {
    key: 'sanitaryComplianceAlerts',
    title: 'Vigilância Sanitária (VISA) & CNES',
    category: 'regulatorio',
    shortDesc: 'Rastreamento de validade do Alvará Sanitário, Licença Municipal e cadastro CNES ativo.',
    badge: 'Compliance'
  },
  {
    key: 'equipmentCalibrationTracker',
    title: 'Rastreabilidade Metrológica INMETRO/IPEM',
    category: 'clinico',
    shortDesc: 'Controle de certificados e vencimento de calibração de bioimpedâncias e adipômetros.',
    badge: 'ISO & IPEM'
  },
  {
    key: 'localInventoryControl',
    title: 'Almoxarifado & Amostras de Suplementos',
    category: 'clinico',
    shortDesc: 'Estoque local de fitas antropométricas, lençóis descartáveis e sachês de degustação.',
    badge: 'Estoque'
  },
  {
    key: 'auditLogsLgpd',
    title: 'Isolamento de Dados & Trilha LGPD',
    category: 'seguranca',
    shortDesc: 'Segregação de prontuários por unidade e log inviolável de acesso por recepcionistas.',
    badge: 'Art. 5º LGPD'
  },
  {
    key: 'teleconsultationKiosk',
    title: 'Cabine de Teleconsulta & Recepção Digital',
    category: 'operacional',
    shortDesc: 'Terminal para check-in automático do paciente e atendimentos híbridos/online na filial.',
    badge: 'Híbrido'
  },
  {
    key: 'receptionWhatsappBot',
    title: 'Canal Oficial WhatsApp da Recepção',
    category: 'operacional',
    shortDesc: 'Envio de lembretes de consulta, instruções de preparo em jejum e localização da unidade.',
    badge: 'WhatsApp API'
  },
  {
    key: 'integratedBillingByUnit',
    title: 'Centro de Custos & Faturamento por Filial',
    category: 'seguranca',
    shortDesc: 'Demonstrativo financeiro, emissão de NFSe por CNPJ municipal e repasses médicos.',
    badge: 'Financeiro'
  },
  {
    key: 'interClinicPatientTransfer',
    title: 'Compartilhamento Consentido de Prontuários',
    category: 'regulatorio',
    shortDesc: 'Transferência de histórico alimentar e antropometria entre unidades com anuência do paciente.',
    badge: 'Interoperável'
  }
];

const ALL_FEATURES_ACTIVE_STATE: ClinicFeaturesState = {
  multiUnitSync: true,
  roomScheduling: true,
  sanitaryComplianceAlerts: true,
  equipmentCalibrationTracker: true,
  localInventoryControl: true,
  auditLogsLgpd: true,
  teleconsultationKiosk: true,
  receptionWhatsappBot: true,
  integratedBillingByUnit: true,
  interClinicPatientTransfer: true,
};

const DEFAULT_UNITS: ClinicUnit[] = [
  {
    id: 'unit-sp-paulista',
    name: 'Instituto Paulista • Matriz',
    corporateName: 'Instituto de Nutrição Avançada & Saúde Integrada Ltda',
    cnpj: '34.819.420/0001-92',
    cnes: '7184920',
    type: 'matriz',
    status: 'ativa',
    address: {
      street: 'Avenida Paulista',
      number: '1842',
      complement: 'Conjuntos 141 e 142 - 14º Andar',
      neighborhood: 'Bela Vista / Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-200'
    },
    contact: {
      phone: '(11) 3284-9000',
      whatsapp: '(11) 98765-4321',
      email: 'paulista@nutriclinica.com.br'
    },
    operatingHours: {
      weekdays: '07:00 às 20:30',
      saturday: '08:00 às 14:00',
      sunday: 'Fechado'
    },
    technicalManager: {
      name: 'Dra. Vanessa Rios',
      council: 'CRN',
      councilNumber: '14285',
      councilState: 'SP',
      roleTitle: 'Responsável Técnica Titular (CRN-3)',
      email: 'vanessa.rios@nutriclinica.com.br',
      phone: '(11) 98765-4321',
      documentCpf: '***.482.918-**'
    },
    deputyTechnicalManager: {
      name: 'Dra. Mariana Takahashi',
      council: 'CRN',
      councilNumber: '28410',
      councilState: 'SP',
      roleTitle: 'RT Substituta / Suplente',
      email: 'mariana.takahashi@nutriclinica.com.br',
      phone: '(11) 96543-2109',
      documentCpf: '***.729.188-**'
    },
    sanitaryLicense: {
      number: 'VISA-SP 2024/09482-A',
      issuingBody: 'COVISA - Coordenação de Vigilância em Saúde PMSP',
      issueDate: '2024-02-15',
      expiryDate: '2027-02-15',
      status: 'regular',
      processNumber: '6018.2024/0014829-1'
    },
    consultingRooms: [
      {
        id: 'room-p1',
        name: 'Consultório 1 • Bioimpedância & Antropometria Master',
        code: 'SL-101',
        type: 'antropometria_bioimpedancia',
        capacity: 3,
        status: 'em_consulta',
        currentProfessionalName: 'Dra. Vanessa Rios (CRN-3 14285)',
        currentPatientName: 'Mariana Lima Santos',
        equipmentIds: ['eq-inbody-770', 'eq-harpenden-01', 'eq-seca-213'],
        floor: '14º Andar'
      },
      {
        id: 'room-p2',
        name: 'Consultório 2 • Nutrologia & Medicina Esportiva',
        code: 'SL-102',
        type: 'nutricao_esportiva',
        capacity: 3,
        status: 'disponivel',
        currentProfessionalName: 'Dr. Carlos Eduardo Mendes (CRM-SP 198420)',
        equipmentIds: ['eq-lange-01', 'eq-balanca-welmy'],
        floor: '14º Andar'
      },
      {
        id: 'room-p3',
        name: 'Consultório 3 • Nutrição Clínica Funcional & SOP',
        code: 'SL-103',
        type: 'nutricao_clinica',
        capacity: 2,
        status: 'disponivel',
        currentProfessionalName: 'Dra. Mariana Takahashi (CRN-3 28410)',
        equipmentIds: ['eq-tanita-mc780', 'eq-cescorf-top'],
        floor: '14º Andar'
      },
      {
        id: 'room-p4',
        name: 'Consultório 4 • Cineantropometria ISAK & Fisiologia',
        code: 'SL-104',
        type: 'antropometria_bioimpedancia',
        capacity: 2,
        status: 'higienizacao',
        equipmentIds: ['eq-cescorf-inova', 'eq-paquimetro-mitutoyo'],
        floor: '14º Andar'
      }
    ],
    equipment: [
      {
        id: 'eq-inbody-770',
        name: 'Bioimpedância Médica Tetrapolar Multifrequencial',
        category: 'bioimpedancia',
        brandModel: 'InBody 770 Platinum Edition',
        serialNumber: 'IB770-BR-2023-8491',
        anvisaRegistration: '80287040008',
        lastCalibrationDate: '2024-05-10',
        nextCalibrationDate: '2025-05-10',
        calibrationCertificateNumber: 'CAL-IPEM-2024/99142',
        status: 'calibrado',
        assignedRoomId: 'room-p1'
      },
      {
        id: 'eq-harpenden-01',
        name: 'Adipômetro Científico Harpenden Original',
        category: 'adipometro',
        brandModel: 'Baty International / Harpenden 0.2mm',
        serialNumber: 'HRP-94218-GB',
        anvisaRegistration: '10359820014',
        lastCalibrationDate: '2024-06-18',
        nextCalibrationDate: '2025-06-18',
        calibrationCertificateNumber: 'MET-LAB-2024/8841',
        status: 'calibrado',
        assignedRoomId: 'room-p1'
      },
      {
        id: 'eq-tanita-mc780',
        name: 'Analisador Segmentar Multi-frequência',
        category: 'bioimpedancia',
        brandModel: 'Tanita MC-780 Professional',
        serialNumber: 'TAN-MC780-8402',
        anvisaRegistration: '80287040012',
        lastCalibrationDate: '2024-04-12',
        nextCalibrationDate: '2025-04-12',
        calibrationCertificateNumber: 'CERT-METR-4421',
        status: 'calibrado',
        assignedRoomId: 'room-p3'
      },
      {
        id: 'eq-seca-213',
        name: 'Estadiômetro Portátil de Precisão Milimétrica',
        category: 'estadiometro',
        brandModel: 'Seca 213 Mobile Precision',
        serialNumber: 'SECA-213-9941',
        anvisaRegistration: 'Isento (Mecânico de Precisão)',
        lastCalibrationDate: '2024-01-20',
        nextCalibrationDate: '2025-01-20',
        calibrationCertificateNumber: 'AFER-SECA-2024',
        status: 'calibrado',
        assignedRoomId: 'room-p1'
      }
    ],
    teamAllocations: [
      {
        professionalId: 'prof-1',
        name: 'Dra. Vanessa Rios',
        role: 'Nutricionista Responsável Técnica',
        council: 'CRN-3 14285',
        daysOfWeek: ['seg', 'ter', 'qua', 'qui'],
        assignedRoomCode: 'SL-101',
        consultationHours: '08:00 às 18:00'
      },
      {
        professionalId: 'prof-2',
        name: 'Dr. Carlos Eduardo Mendes',
        role: 'Médico Nutrólogo & Esporte',
        council: 'CRM-SP 198420',
        daysOfWeek: ['ter', 'qui', 'sex'],
        assignedRoomCode: 'SL-102',
        consultationHours: '09:00 às 19:00'
      },
      {
        professionalId: 'prof-3',
        name: 'Dra. Mariana Takahashi',
        role: 'Nutricionista Clínica',
        council: 'CRN-3 28410',
        daysOfWeek: ['seg', 'qua', 'sex', 'sab'],
        assignedRoomCode: 'SL-103',
        consultationHours: '08:30 às 17:30'
      }
    ],
    inventory: [
      {
        id: 'inv-1',
        name: 'Lençol Descartável em Rolo Hospitalar (70cm x 50m)',
        category: 'higienizacao',
        currentStock: 18,
        minStock: 5,
        unit: 'rolos',
        batchNumber: 'LT-2024/08'
      },
      {
        id: 'inv-2',
        name: 'Fita Antropométrica de Aço Inox Retrátil Cescorf',
        category: 'antropometria',
        currentStock: 6,
        minStock: 2,
        unit: 'unidades',
        batchNumber: 'CES-FT-88'
      },
      {
        id: 'inv-3',
        name: 'Álcool Isopropílico 70% Spray para Eletrodos',
        category: 'higienizacao',
        currentStock: 12,
        minStock: 4,
        unit: 'frascos 500ml',
        batchNumber: 'LT-ALC-774'
      },
      {
        id: 'inv-4',
        name: 'Sachês de Creatina Creapure 5g (Amostra Grátis)',
        category: 'amostras_suplementos',
        currentStock: 95,
        minStock: 30,
        unit: 'sachês',
        batchNumber: 'CREA-2024-B9',
        expiryDate: '2026-11-30'
      }
    ],
    stats: {
      monthlyConsultations: 342,
      activePatients: 840,
      roomOccupancyRate: 88,
      punctualityRate: 97
    },
    features: ALL_FEATURES_ACTIVE_STATE,
    allFeaturesActive: true
  },
  {
    id: 'unit-sp-farialima',
    name: 'NutriClínica Jardins & Faria Lima • Filial',
    corporateName: 'Instituto de Nutrição Avançada & Saúde Integrada Ltda',
    cnpj: '34.819.420/0002-73',
    cnes: '8392014',
    type: 'filial',
    status: 'ativa',
    address: {
      street: 'Avenida Brigadeiro Faria Lima',
      number: '2601',
      complement: 'Salas 804 e 805 - Edifício Corporate Tower',
      neighborhood: 'Itaim Bibi / Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01452-000'
    },
    contact: {
      phone: '(11) 3045-8800',
      whatsapp: '(11) 97654-3210',
      email: 'farialima@nutriclinica.com.br'
    },
    operatingHours: {
      weekdays: '07:30 às 21:00',
      saturday: '08:00 às 15:00',
      sunday: 'Fechado'
    },
    technicalManager: {
      name: 'Dra. Mariana Takahashi',
      council: 'CRN',
      councilNumber: '28410',
      councilState: 'SP',
      roleTitle: 'Responsável Técnica Local (CRN-3)',
      email: 'mariana.takahashi@nutriclinica.com.br',
      phone: '(11) 96543-2109',
      documentCpf: '***.729.188-**'
    },
    sanitaryLicense: {
      number: 'VISA-SP 2024/11840-F',
      issuingBody: 'COVISA - Vigilância Sanitária Itaim/Pinheiros',
      issueDate: '2024-03-01',
      expiryDate: '2027-03-01',
      status: 'regular',
      processNumber: '6018.2024/0029410-2'
    },
    consultingRooms: [
      {
        id: 'room-fl1',
        name: 'Consultório 1 • Alta Performance & Bioimpedância',
        code: 'FL-801',
        type: 'antropometria_bioimpedancia',
        capacity: 3,
        status: 'disponivel',
        equipmentIds: ['eq-inbody-270-fl'],
        floor: '8º Andar'
      },
      {
        id: 'room-fl2',
        name: 'Consultório 2 • Longevidade & Emagrecimento',
        code: 'FL-802',
        type: 'nutricao_clinica',
        capacity: 2,
        status: 'em_consulta',
        currentProfessionalName: 'Prof. Lucas Alencar (CREF-SP 084192-G)',
        equipmentIds: ['eq-cescorf-fl'],
        floor: '8º Andar'
      },
      {
        id: 'room-fl3',
        name: 'Consultório 3 • Cabine de Teleconsulta Premium',
        code: 'FL-803',
        type: 'retorno_rapido',
        capacity: 2,
        status: 'disponivel',
        equipmentIds: [],
        floor: '8º Andar'
      }
    ],
    equipment: [
      {
        id: 'eq-inbody-270-fl',
        name: 'Bioimpedância Médica Segmentar Portátil InBody 270',
        category: 'bioimpedancia',
        brandModel: 'InBody 270 Medical',
        serialNumber: 'IB270-FL-9912',
        anvisaRegistration: '80287040008',
        lastCalibrationDate: '2024-07-02',
        nextCalibrationDate: '2025-07-02',
        calibrationCertificateNumber: 'CAL-FL-2024-77',
        status: 'calibrado',
        assignedRoomId: 'room-fl1'
      },
      {
        id: 'eq-cescorf-fl',
        name: 'Adipômetro Clínico Tradicional Cescorf',
        category: 'adipometro',
        brandModel: 'Cescorf Clinical 0.1mm',
        serialNumber: 'CES-9812-SP',
        anvisaRegistration: '10359820014',
        lastCalibrationDate: '2024-05-20',
        nextCalibrationDate: '2025-05-20',
        calibrationCertificateNumber: 'IPEM-CES-991',
        status: 'calibrado',
        assignedRoomId: 'room-fl2'
      }
    ],
    teamAllocations: [
      {
        professionalId: 'prof-3',
        name: 'Dra. Mariana Takahashi',
        role: 'Nutricionista Clínica',
        council: 'CRN-3 28410',
        daysOfWeek: ['ter', 'qui'],
        assignedRoomCode: 'FL-801',
        consultationHours: '09:00 às 18:00'
      },
      {
        professionalId: 'prof-4',
        name: 'Prof. Lucas Alencar',
        role: 'Cineantropometrista ISAK II',
        council: 'CREF-SP 084192-G',
        daysOfWeek: ['seg', 'qua', 'sex'],
        assignedRoomCode: 'FL-802',
        consultationHours: '08:00 às 17:00'
      }
    ],
    inventory: [
      {
        id: 'inv-fl1',
        name: 'Lençol Descartável em Rolo (70cm x 50m)',
        category: 'higienizacao',
        currentStock: 12,
        minStock: 4,
        unit: 'rolos',
        batchNumber: 'LT-2024/09'
      },
      {
        id: 'inv-fl2',
        name: 'Sachês de Whey Protein Isolado 30g (Degustação)',
        category: 'amostras_suplementos',
        currentStock: 60,
        minStock: 25,
        unit: 'sachês',
        batchNumber: 'WH-ISO-442'
      }
    ],
    stats: {
      monthlyConsultations: 215,
      activePatients: 520,
      roomOccupancyRate: 82,
      punctualityRate: 98
    },
    features: ALL_FEATURES_ACTIVE_STATE,
    allFeaturesActive: true
  },
  {
    id: 'unit-sp-campinas',
    name: 'NutriClínica Cambuí • Campinas',
    corporateName: 'Instituto de Nutrição Avançada & Saúde Integrada Ltda',
    cnpj: '34.819.420/0003-54',
    cnes: '9482103',
    type: 'filial',
    status: 'ativa',
    address: {
      street: 'Rua Coronel Quirino',
      number: '1490',
      complement: 'Casa 02 - Villa Cambuí Corporate',
      neighborhood: 'Cambuí',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13025-002'
    },
    contact: {
      phone: '(19) 3251-4000',
      whatsapp: '(19) 99876-5432',
      email: 'campinas@nutriclinica.com.br'
    },
    operatingHours: {
      weekdays: '08:00 às 19:00',
      saturday: '08:00 às 13:00',
      sunday: 'Fechado'
    },
    technicalManager: {
      name: 'Dr. Carlos Eduardo Mendes',
      council: 'CRM',
      councilNumber: '198420',
      councilState: 'SP',
      roleTitle: 'Responsável Técnico Regional (CRM-SP)',
      email: 'carlos.mendes@nutriclinica.com.br',
      phone: '(11) 97654-3210',
      documentCpf: '***.319.482-**'
    },
    sanitaryLicense: {
      number: 'VISA-CAMP 2024/04819',
      issuingBody: 'DEVISA - Departamento de Vigilância Sanitária Campinas',
      issueDate: '2024-01-10',
      expiryDate: '2027-01-10',
      status: 'regular',
      processNumber: 'PMC.2024.0048192'
    },
    consultingRooms: [
      {
        id: 'room-cp1',
        name: 'Consultório 1 • Avaliação Metabólica & Antropometria',
        code: 'CB-101',
        type: 'antropometria_bioimpedancia',
        capacity: 3,
        status: 'disponivel',
        equipmentIds: ['eq-tanita-cp'],
        floor: 'Térreo'
      },
      {
        id: 'room-cp2',
        name: 'Consultório 2 • Nutrição Clínica & Saúde Digestiva',
        code: 'CB-102',
        type: 'nutricao_clinica',
        capacity: 2,
        status: 'disponivel',
        equipmentIds: [],
        floor: 'Térreo'
      }
    ],
    equipment: [
      {
        id: 'eq-tanita-cp',
        name: 'Balança de Bioimpedância Octapolar Tanita',
        category: 'bioimpedancia',
        brandModel: 'Tanita MC-580',
        serialNumber: 'TAN-CP-5801',
        anvisaRegistration: '80287040012',
        lastCalibrationDate: '2024-03-15',
        nextCalibrationDate: '2025-03-15',
        calibrationCertificateNumber: 'CERT-CP-2024-91',
        status: 'calibrado',
        assignedRoomId: 'room-cp1'
      }
    ],
    teamAllocations: [
      {
        professionalId: 'prof-2',
        name: 'Dr. Carlos Eduardo Mendes',
        role: 'Médico Nutrólogo',
        council: 'CRM-SP 198420',
        daysOfWeek: ['qua', 'sex'],
        assignedRoomCode: 'CB-101',
        consultationHours: '09:00 às 18:00'
      }
    ],
    inventory: [
      {
        id: 'inv-cp1',
        name: 'Eletrodos Descartáveis para Bioimpedância',
        category: 'antropometria',
        currentStock: 45,
        minStock: 20,
        unit: 'pares',
        batchNumber: 'ELE-2024-CP'
      }
    ],
    stats: {
      monthlyConsultations: 180,
      activePatients: 410,
      roomOccupancyRate: 75,
      punctualityRate: 96
    },
    features: ALL_FEATURES_ACTIVE_STATE,
    allFeaturesActive: true
  }
];

interface ClinicContextType {
  units: ClinicUnit[];
  activeUnit: ClinicUnit;
  activeUnitId: string;
  setActiveUnitId: (id: string) => void;
  allUnitsFeaturesActive: boolean;
  activateAllUnitsFeatures: () => void;
  toggleUnitFeature: (unitId: string, featureKey: keyof ClinicFeaturesState) => void;
  activateAllFeaturesForUnit: (unitId: string) => void;
  addUnit: (unitData: Omit<ClinicUnit, 'id' | 'stats' | 'features' | 'allFeaturesActive'>) => void;
  updateUnit: (unit: ClinicUnit) => void;
  deleteUnit: (unitId: string) => void;
  toggleRoomStatus: (unitId: string, roomId: string, newStatus: ConsultingRoom['status']) => void;
  addConsultingRoom: (unitId: string, room: Omit<ConsultingRoom, 'id'>) => void;
  addEquipment: (unitId: string, equip: Omit<ClinicalEquipment, 'id'>) => void;
  registerCalibration: (unitId: string, equipId: string, certificate: string, nextDate: string) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<ClinicUnit[]>(() => {
    const saved = localStorage.getItem('nutri_saas_clinic_units');
    return saved ? JSON.parse(saved) : DEFAULT_UNITS;
  });

  const [activeUnitId, setActiveUnitId] = useState<string>(() => {
    const saved = localStorage.getItem('nutri_saas_active_unit_id');
    return saved || 'unit-sp-paulista';
  });

  const [allUnitsFeaturesActive, setAllUnitsFeaturesActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutri_saas_all_units_features_active');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('nutri_saas_clinic_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('nutri_saas_active_unit_id', activeUnitId);
  }, [activeUnitId]);

  useEffect(() => {
    localStorage.setItem('nutri_saas_all_units_features_active', JSON.stringify(allUnitsFeaturesActive));
  }, [allUnitsFeaturesActive]);

  const activeUnit = units.find(u => u.id === activeUnitId) || units[0];

  // Ativação Master para TODAS as unidades e todos os módulos
  const activateAllUnitsFeatures = () => {
    setAllUnitsFeaturesActive(true);
    setUnits(prev =>
      prev.map(unit => ({
        ...unit,
        allFeaturesActive: true,
        features: { ...ALL_FEATURES_ACTIVE_STATE }
      }))
    );
  };

  const activateAllFeaturesForUnit = (unitId: string) => {
    setUnits(prev =>
      prev.map(unit => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          allFeaturesActive: true,
          features: { ...ALL_FEATURES_ACTIVE_STATE }
        };
      })
    );
  };

  const toggleUnitFeature = (unitId: string, featureKey: keyof ClinicFeaturesState) => {
    setUnits(prev =>
      prev.map(unit => {
        if (unit.id !== unitId) return unit;
        const newFeatures = {
          ...unit.features,
          [featureKey]: !unit.features[featureKey]
        };
        const allActive = Object.values(newFeatures).every(Boolean);
        return {
          ...unit,
          features: newFeatures,
          allFeaturesActive: allActive
        };
      })
    );
  };

  const addUnit = (unitData: Omit<ClinicUnit, 'id' | 'stats' | 'features' | 'allFeaturesActive'>) => {
    const newUnit: ClinicUnit = {
      ...unitData,
      id: `unit-${Date.now()}`,
      stats: {
        monthlyConsultations: 0,
        activePatients: 0,
        roomOccupancyRate: 0,
        punctualityRate: 100
      },
      features: { ...ALL_FEATURES_ACTIVE_STATE },
      allFeaturesActive: true
    };
    setUnits(prev => [...prev, newUnit]);
  };

  const updateUnit = (updated: ClinicUnit) => {
    setUnits(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  const deleteUnit = (unitId: string) => {
    if (units.length <= 1) return; // Não permite excluir última unidade
    setUnits(prev => prev.filter(u => u.id !== unitId));
    if (activeUnitId === unitId) {
      const remaining = units.filter(u => u.id !== unitId);
      setActiveUnitId(remaining[0].id);
    }
  };

  const toggleRoomStatus = (unitId: string, roomId: string, newStatus: ConsultingRoom['status']) => {
    setUnits(prev =>
      prev.map(unit => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          consultingRooms: unit.consultingRooms.map(room => {
            if (room.id !== roomId) return room;
            return {
              ...room,
              status: newStatus,
              currentPatientName: newStatus === 'disponivel' || newStatus === 'higienizacao' ? undefined : room.currentPatientName
            };
          })
        };
      })
    );
  };

  const addConsultingRoom = (unitId: string, room: Omit<ConsultingRoom, 'id'>) => {
    setUnits(prev =>
      prev.map(unit => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          consultingRooms: [
            ...unit.consultingRooms,
            { ...room, id: `room-${Date.now()}` }
          ]
        };
      })
    );
  };

  const addEquipment = (unitId: string, equip: Omit<ClinicalEquipment, 'id'>) => {
    setUnits(prev =>
      prev.map(unit => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          equipment: [
            ...unit.equipment,
            { ...equip, id: `equip-${Date.now()}` }
          ]
        };
      })
    );
  };

  const registerCalibration = (
    unitId: string,
    equipId: string,
    certificate: string,
    nextDate: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setUnits(prev =>
      prev.map(unit => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          equipment: unit.equipment.map(eq => {
            if (eq.id !== equipId) return eq;
            return {
              ...eq,
              lastCalibrationDate: today,
              nextCalibrationDate: nextDate,
              calibrationCertificateNumber: certificate,
              status: 'calibrado'
            };
          })
        };
      })
    );
  };

  return (
    <ClinicContext.Provider
      value={{
        units,
        activeUnit,
        activeUnitId,
        setActiveUnitId,
        allUnitsFeaturesActive,
        activateAllUnitsFeatures,
        toggleUnitFeature,
        activateAllFeaturesForUnit,
        addUnit,
        updateUnit,
        deleteUnit,
        toggleRoomStatus,
        addConsultingRoom,
        addEquipment,
        registerCalibration
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
