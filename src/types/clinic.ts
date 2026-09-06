export interface SanitaryLicense {
  number: string;
  issuingBody: string; // ex: Vigilância Sanitária Municipal (COVISA-SP)
  issueDate: string;
  expiryDate: string;
  status: 'regular' | 'renovacao' | 'vencido';
  processNumber: string;
}

export interface TechnicalManager {
  name: string;
  council: 'CRN' | 'CRM' | 'CRF';
  councilNumber: string;
  councilState: string;
  roleTitle: string;
  email: string;
  phone: string;
  documentCpf: string;
}

export interface ConsultingRoom {
  id: string;
  name: string;
  code: string;
  type: 'antropometria_bioimpedancia' | 'nutricao_clinica' | 'nutricao_esportiva' | 'procedimentos' | 'retorno_rapido';
  capacity: number;
  status: 'disponivel' | 'em_consulta' | 'higienizacao';
  currentProfessionalName?: string;
  currentPatientName?: string;
  equipmentIds: string[];
  floor: string;
}

export interface ClinicalEquipment {
  id: string;
  name: string;
  category: 'bioimpedancia' | 'adipometro' | 'estadiometro' | 'balanca' | 'fita_metrica' | 'paquimetro';
  brandModel: string;
  serialNumber: string;
  anvisaRegistration: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibrationCertificateNumber: string;
  status: 'calibrado' | 'alerta' | 'vencido';
  assignedRoomId?: string;
}

export interface UnitProfessionalAllocation {
  professionalId: string;
  name: string;
  role: string;
  council: string;
  daysOfWeek: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab')[];
  assignedRoomCode: string;
  consultationHours: string;
}

export interface UnitInventoryItem {
  id: string;
  name: string;
  category: 'antropometria' | 'higienizacao' | 'amostras_suplementos' | 'escritorio';
  currentStock: number;
  minStock: number;
  unit: string;
  batchNumber: string;
  expiryDate?: string;
}

export interface ClinicFeaturesState {
  multiUnitSync: boolean;               // 1. Sincronização e redundância em nuvem
  roomScheduling: boolean;              // 2. Gestão e alocação dinâmica de consultórios
  sanitaryComplianceAlerts: boolean;    // 3. Monitoramento de alvará e vigilância sanitária
  equipmentCalibrationTracker: boolean; // 4. Rastreabilidade metrológica e calibração INMETRO/IPEM
  localInventoryControl: boolean;       // 5. Almoxarifado de insumos e amostras de suplementos
  auditLogsLgpd: boolean;               // 6. Isolamento e trilha de auditoria multitenant LGPD
  teleconsultationKiosk: boolean;       // 7. Quiosque de teleconsulta e recepção digital
  receptionWhatsappBot: boolean;        // 8. Integração de recepção e WhatsApp oficial da unidade
  integratedBillingByUnit: boolean;     // 9. Rateio e faturamento individualizado por filial
  interClinicPatientTransfer: boolean;  // 10. Transferência e compartilhamento consentido de prontuários
}

export interface ClinicUnit {
  id: string;
  name: string; // Nome Fantasia
  corporateName: string; // Razão Social
  cnpj: string;
  cnes: string; // Cadastro Nacional de Estabelecimentos de Saúde
  type: 'matriz' | 'filial' | 'avancada';
  status: 'ativa' | 'manutencao' | 'planejamento';
  
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  contact: {
    phone: string;
    whatsapp: string;
    email: string;
  };

  operatingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };

  technicalManager: TechnicalManager;
  deputyTechnicalManager?: TechnicalManager;
  sanitaryLicense: SanitaryLicense;

  consultingRooms: ConsultingRoom[];
  equipment: ClinicalEquipment[];
  teamAllocations: UnitProfessionalAllocation[];
  inventory: UnitInventoryItem[];

  stats: {
    monthlyConsultations: number;
    activePatients: number;
    roomOccupancyRate: number; // 0 a 100
    punctualityRate: number;    // 0 a 100
  };

  features: ClinicFeaturesState;
  allFeaturesActive: boolean;
}
