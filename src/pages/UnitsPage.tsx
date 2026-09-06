import React, { useState, useMemo } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Plus,
  Stethoscope,
  Activity,
  Sliders,
  AlertTriangle,
  FileCheck2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  Search,
  Check,
  Calendar,
  Layers,
  Scale,
  Settings,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Lock,
  ArrowRight,
  Package,
  FileText,
  RotateCcw
} from 'lucide-react';
import {
  useClinic,
  CLINIC_FEATURES_CATALOG,
  ClinicFeatureMeta
} from '../contexts/ClinicContext';
import {
  ClinicUnit,
  ConsultingRoom,
  ClinicalEquipment,
  ClinicFeaturesState
} from '../types/clinic';
import clsx from 'clsx';

// Audio feedback helper via Web Audio API
const playActivationChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    
    // Primary chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.40); // C6
    
    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.7);
  } catch {
    // Graceful fallback for muted or restricted audio
  }
};

export const UnitsPage: React.FC = () => {
  const {
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
  } = useClinic();

  // Active view tab inside the Units console
  const [activeTab, setActiveTab] = useState<
    'visao_geral' | 'consultorios' | 'equipamentos' | 'sanitario_rt' | 'equipe' | 'insumos'
  >('visao_geral');

  // Filter & search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<ClinicUnit | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);
  const [isNewEquipmentModalOpen, setIsNewEquipmentModalOpen] = useState(false);
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
  const [selectedEquipForCalibration, setSelectedEquipForCalibration] = useState<ClinicalEquipment | null>(null);

  // Form states
  const [calibrationCertForm, setCalibrationCertForm] = useState({
    certificateNumber: '',
    nextDate: ''
  });

  const [newRoomForm, setNewRoomForm] = useState<Omit<ConsultingRoom, 'id'>>({
    name: '',
    code: '',
    type: 'antropometria_bioimpedancia',
    capacity: 2,
    status: 'disponivel',
    equipmentIds: [],
    floor: '1º Andar'
  });

  const [newEquipForm, setNewEquipForm] = useState<Omit<ClinicalEquipment, 'id'>>({
    name: '',
    category: 'bioimpedancia',
    brandModel: '',
    serialNumber: '',
    anvisaRegistration: '',
    lastCalibrationDate: new Date().toISOString().split('T')[0],
    nextCalibrationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    calibrationCertificateNumber: '',
    status: 'calibrado'
  });

  const [unitForm, setUnitForm] = useState({
    name: '',
    corporateName: '',
    cnpj: '',
    cnes: '',
    type: 'filial' as 'matriz' | 'filial' | 'avancada',
    status: 'ativa' as 'ativa' | 'manutencao' | 'planejamento',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '',
    phone: '',
    whatsapp: '',
    email: '',
    weekdays: '08:00 às 19:00',
    saturday: '08:00 às 13:00',
    sunday: 'Fechado',
    rtName: '',
    rtCouncil: 'CRN' as 'CRN' | 'CRM' | 'CRF',
    rtCouncilNumber: '',
    rtCouncilState: 'SP',
    rtRoleTitle: 'Responsável Técnico(a)',
    rtEmail: '',
    rtPhone: '',
    rtCpf: '',
    visaNumber: '',
    visaIssuingBody: 'COVISA - Vigilância Sanitária Municipal',
    visaIssueDate: '2024-01-15',
    visaExpiryDate: '2027-01-15',
    visaProcessNumber: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Master Activation Handler
  const handleActivateAll = () => {
    playActivationChime();
    activateAllUnitsFeatures();
    showToast('Todas as 10 funções clínicas e operacionais foram ativadas para todas as unidades!');
  };

  const handleActivateUnit = (unitId: string, unitName: string) => {
    playActivationChime();
    activateAllFeaturesForUnit(unitId);
    showToast(`Todas as 10 funções ativadas com sucesso para: ${unitName}`);
  };

  // Filtered units
  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      const matchQuery =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.cnpj.includes(searchTerm) ||
        u.cnes.includes(searchTerm) ||
        u.technicalManager.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchQuery;
    });
  }, [units, searchTerm]);

  // Total stats across all units
  const aggregateStats = useMemo(() => {
    const totalRooms = units.reduce((acc, u) => acc + u.consultingRooms.length, 0);
    const totalOccupied = units.reduce(
      (acc, u) => acc + u.consultingRooms.filter(r => r.status === 'em_consulta').length,
      0
    );
    const totalEquipment = units.reduce((acc, u) => acc + u.equipment.length, 0);
    const totalConsultations = units.reduce((acc, u) => acc + u.stats.monthlyConsultations, 0);
    const totalActivePatients = units.reduce((acc, u) => acc + u.stats.activePatients, 0);
    return { totalRooms, totalOccupied, totalEquipment, totalConsultations, totalActivePatients };
  }, [units]);

  // Open Edit Modal
  const handleOpenEdit = (unit: ClinicUnit) => {
    setSelectedUnitForDetail(unit);
    setUnitForm({
      name: unit.name,
      corporateName: unit.corporateName,
      cnpj: unit.cnpj,
      cnes: unit.cnes,
      type: unit.type,
      status: unit.status,
      street: unit.address.street,
      number: unit.address.number,
      complement: unit.address.complement || '',
      neighborhood: unit.address.neighborhood,
      city: unit.address.city,
      state: unit.address.state,
      zipCode: unit.address.zipCode,
      phone: unit.contact.phone,
      whatsapp: unit.contact.whatsapp,
      email: unit.contact.email,
      weekdays: unit.operatingHours.weekdays,
      saturday: unit.operatingHours.saturday,
      sunday: unit.operatingHours.sunday,
      rtName: unit.technicalManager.name,
      rtCouncil: unit.technicalManager.council,
      rtCouncilNumber: unit.technicalManager.councilNumber,
      rtCouncilState: unit.technicalManager.councilState,
      rtRoleTitle: unit.technicalManager.roleTitle,
      rtEmail: unit.technicalManager.email,
      rtPhone: unit.technicalManager.phone,
      rtCpf: unit.technicalManager.documentCpf,
      visaNumber: unit.sanitaryLicense.number,
      visaIssuingBody: unit.sanitaryLicense.issuingBody,
      visaIssueDate: unit.sanitaryLicense.issueDate,
      visaExpiryDate: unit.sanitaryLicense.expiryDate,
      visaProcessNumber: unit.sanitaryLicense.processNumber
    });
    setIsEditUnitModalOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnitForDetail) {
      // Editing
      const updated: ClinicUnit = {
        ...selectedUnitForDetail,
        name: unitForm.name,
        corporateName: unitForm.corporateName,
        cnpj: unitForm.cnpj,
        cnes: unitForm.cnes,
        type: unitForm.type,
        status: unitForm.status,
        address: {
          street: unitForm.street,
          number: unitForm.number,
          complement: unitForm.complement,
          neighborhood: unitForm.neighborhood,
          city: unitForm.city,
          state: unitForm.state,
          zipCode: unitForm.zipCode
        },
        contact: {
          phone: unitForm.phone,
          whatsapp: unitForm.whatsapp,
          email: unitForm.email
        },
        operatingHours: {
          weekdays: unitForm.weekdays,
          saturday: unitForm.saturday,
          sunday: unitForm.sunday
        },
        technicalManager: {
          name: unitForm.rtName,
          council: unitForm.rtCouncil,
          councilNumber: unitForm.rtCouncilNumber,
          councilState: unitForm.rtCouncilState,
          roleTitle: unitForm.rtRoleTitle,
          email: unitForm.rtEmail,
          phone: unitForm.rtPhone,
          documentCpf: unitForm.rtCpf
        },
        sanitaryLicense: {
          number: unitForm.visaNumber,
          issuingBody: unitForm.visaIssuingBody,
          issueDate: unitForm.visaIssueDate,
          expiryDate: unitForm.visaExpiryDate,
          status: 'regular',
          processNumber: unitForm.visaProcessNumber
        }
      };
      updateUnit(updated);
      setIsEditUnitModalOpen(false);
      showToast('Dados da unidade clínica atualizados com sucesso!');
    } else {
      // Adding new unit
      addUnit({
        name: unitForm.name,
        corporateName: unitForm.corporateName || unitForm.name,
        cnpj: unitForm.cnpj,
        cnes: unitForm.cnes,
        type: unitForm.type,
        status: unitForm.status,
        address: {
          street: unitForm.street,
          number: unitForm.number,
          complement: unitForm.complement,
          neighborhood: unitForm.neighborhood,
          city: unitForm.city,
          state: unitForm.state,
          zipCode: unitForm.zipCode
        },
        contact: {
          phone: unitForm.phone,
          whatsapp: unitForm.whatsapp,
          email: unitForm.email
        },
        operatingHours: {
          weekdays: unitForm.weekdays,
          saturday: unitForm.saturday,
          sunday: unitForm.sunday
        },
        technicalManager: {
          name: unitForm.rtName,
          council: unitForm.rtCouncil,
          councilNumber: unitForm.rtCouncilNumber,
          councilState: unitForm.rtCouncilState,
          roleTitle: unitForm.rtRoleTitle,
          email: unitForm.rtEmail,
          phone: unitForm.rtPhone,
          documentCpf: unitForm.rtCpf
        },
        sanitaryLicense: {
          number: unitForm.visaNumber,
          issuingBody: unitForm.visaIssuingBody,
          issueDate: unitForm.visaIssueDate,
          expiryDate: unitForm.visaExpiryDate,
          status: 'regular',
          processNumber: unitForm.visaProcessNumber
        },
        consultingRooms: [
          {
            id: `room-${Date.now()}-1`,
            name: 'Consultório 1 • Antropometria & Bioimpedância',
            code: 'SL-01',
            type: 'antropometria_bioimpedancia',
            capacity: 2,
            status: 'disponivel',
            equipmentIds: [],
            floor: '1º Andar'
          }
        ],
        equipment: [],
        teamAllocations: [],
        inventory: []
      });
      setIsNewUnitModalOpen(false);
      showToast('Nova unidade clínica cadastrada e vinculada à rede com 10/10 funções!');
    }
  };

  const handleOpenAddUnit = () => {
    setSelectedUnitForDetail(null);
    setUnitForm({
      name: '',
      corporateName: 'Instituto de Nutrição Avançada & Saúde Integrada Ltda',
      cnpj: '',
      cnes: '',
      type: 'filial',
      status: 'ativa',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '',
      phone: '',
      whatsapp: '',
      email: '',
      weekdays: '08:00 às 19:00',
      saturday: '08:00 às 13:00',
      sunday: 'Fechado',
      rtName: 'Dra. Vanessa Rios',
      rtCouncil: 'CRN',
      rtCouncilNumber: '14285',
      rtCouncilState: 'SP',
      rtRoleTitle: 'Responsável Técnica Titular (CRN-3)',
      rtEmail: 'vanessa.rios@nutriclinica.com.br',
      rtPhone: '(11) 98765-4321',
      rtCpf: '***.482.918-**',
      visaNumber: 'VISA-SP 2024/NOVA',
      visaIssuingBody: 'COVISA - Vigilância Sanitária Municipal',
      visaIssueDate: '2024-03-01',
      visaExpiryDate: '2027-03-01',
      visaProcessNumber: '6018.2024/NOVA-UNID'
    });
    setIsNewUnitModalOpen(true);
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomForm.name || !newRoomForm.code) return;
    addConsultingRoom(activeUnit.id, newRoomForm);
    setIsNewRoomModalOpen(false);
    setNewRoomForm({
      name: '',
      code: '',
      type: 'antropometria_bioimpedancia',
      capacity: 2,
      status: 'disponivel',
      equipmentIds: [],
      floor: '1º Andar'
    });
    showToast('Novo consultório adicionado com sucesso à unidade!');
  };

  const handleAddEquipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipForm.name || !newEquipForm.brandModel) return;
    addEquipment(activeUnit.id, newEquipForm);
    setIsNewEquipmentModalOpen(false);
    setNewEquipForm({
      name: '',
      category: 'bioimpedancia',
      brandModel: '',
      serialNumber: '',
      anvisaRegistration: '',
      lastCalibrationDate: new Date().toISOString().split('T')[0],
      nextCalibrationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      calibrationCertificateNumber: '',
      status: 'calibrado'
    });
    showToast('Equipamento clínico cadastrado no inventário metrológico da unidade!');
  };

  const handleOpenCalibration = (equip: ClinicalEquipment) => {
    setSelectedEquipForCalibration(equip);
    setCalibrationCertForm({
      certificateNumber: `CAL-IPEM-${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
      nextDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setIsCalibrationModalOpen(true);
  };

  const handleSaveCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipForCalibration) return;
    registerCalibration(
      activeUnit.id,
      selectedEquipForCalibration.id,
      calibrationCertForm.certificateNumber,
      calibrationCertForm.nextDate
    );
    setIsCalibrationModalOpen(false);
    showToast('Calibração metrológica registrada com validade de 12 meses!');
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-3 sm:px-6">
      {/* ========================================================================= */}
      {/* TOAST FEEDBACK NOTIFICATION                                               */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-2xl shadow-xl border border-stone-700 dark:border-stone-300 text-xs font-medium animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER: CLINICAL TITLE & MASTER "ATIVAR TODAS AS FUNÇÕES" BUTTON          */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Gestão Multi-Unidades & Filiais
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                LGPD Art. 5º & RDC ANVISA
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                10/10 Funções Ativas
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-serif">
              Unidades & Clínicas
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
              Controle operacional e sanitário completo da rede clínica. Gestão de consultórios, alvarás de Vigilância Sanitária (VISA),
              responsabilidade técnica (CRN/CRM), rastreabilidade metrológica de bioimpedâncias e isolamento seguro de prontuários.
            </p>
          </div>

          {/* Master Action & New Unit */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-cadastrar-nova-unidade"
              type="button"
              onClick={handleOpenAddUnit}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer border border-stone-300 dark:border-stone-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Unidade</span>
            </button>

            <button
              id="btn-ativar-todas-funcoes-unidades"
              type="button"
              onClick={handleActivateAll}
              className={clsx(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                allUnitsFeaturesActive
                  ? "bg-emerald-700 text-white hover:bg-emerald-800 ring-2 ring-emerald-600/30"
                  : "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:opacity-90"
              )}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>ATIVAR TODAS AS FUNÇÕES</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/20">
                10/10
              </span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Unidades Ativas</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{units.length}</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">100% integradas</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Salas & Consultórios</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{aggregateStats.totalRooms}</span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">({aggregateStats.totalOccupied} em uso)</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Instrumentos Aferidos</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{aggregateStats.totalEquipment}</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">IPEM/INMETRO</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Atendimentos / Mês</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{aggregateStats.totalConsultations}</span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">consultas</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Pacientes na Rede</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{aggregateStats.totalActivePatients}</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">prontuários</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE CLINIC UNIT SELECTOR & WORKSPACE INDICATOR                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Unidade em Operação Atual:
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                {activeUnit.type === 'matriz' ? 'Sede Matriz' : 'Filial Regional'}
              </span>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {activeUnit.name} • CNPJ: <span className="font-mono">{activeUnit.cnpj}</span> • CNES: <span className="font-mono">{activeUnit.cnes}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Alternar unidade de atendimento:</span>
          <select
            value={activeUnitId}
            onChange={(e) => {
              setActiveUnitId(e.target.value);
              showToast(`Unidade alterada para: ${units.find(u => u.id === e.target.value)?.name}`);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.address.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NAVIGATION TABS                                                           */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1 border-b border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar pb-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('visao_geral')}
          className={clsx(
            "px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2",
            activeTab === 'visao_geral'
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Visão Geral & Filiais</span>
          <span className="px-1.5 py-0.2 rounded-md bg-stone-700 dark:bg-stone-300 text-[10px] font-mono">
            {units.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consultorios')}
          className={clsx(
            "px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2",
            activeTab === 'consultorios'
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
          )}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Consultórios ({activeUnit.consultingRooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('equipamentos')}
          className={clsx(
            "px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2",
            activeTab === 'equipamentos'
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
          )}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Equipamentos & Calibração ({activeUnit.equipment.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sanitario_rt')}
          className={clsx(
            "px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2",
            activeTab === 'sanitario_rt'
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
          )}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>VISA, Alvará & RT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('equipe')}
          className={clsx(
            "px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2",
            activeTab === 'equipe'
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
          )}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Equipe & Escala ({activeUnit.teamAllocations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insumos')}
          className={clsx(
            "px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2",
            activeTab === 'insumos'
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
          )}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Insumos & Amostras ({activeUnit.inventory.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VISÃO GERAL & FILIAIS + 10 FUNÇÕES DA CENTRAL                      */}
      {/* ========================================================================= */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-6">
          {/* Quick Search & Count */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por unidade, cidade, CNPJ ou RT..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
              Mostrando {filteredUnits.length} de {units.length} unidades cadastradas
            </p>
          </div>

          {/* Cards of Units */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {filteredUnits.map((unit) => {
              const isSelected = unit.id === activeUnitId;
              return (
                <div
                  key={unit.id}
                  className={clsx(
                    "rounded-3xl p-5 border transition-all flex flex-col justify-between relative",
                    isSelected
                      ? "bg-white dark:bg-stone-900 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                      : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs"
                  )}
                >
                  <div className="space-y-3">
                    {/* Header of Unit Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              unit.type === 'matriz'
                                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                                : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                            )}
                          >
                            {unit.type === 'matriz' ? 'Sede Matriz' : 'Filial'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            10/10 Funções Ativas
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 dark:text-stone-50 mt-1">
                          {unit.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                          CNPJ: {unit.cnpj} • CNES: {unit.cnes}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(unit)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Editar Informações da Unidade"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Technical Responsibility & Sanitary Status */}
                    <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">Responsável Técnico(a):</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {unit.technicalManager.council} {unit.technicalManager.councilNumber}/{unit.technicalManager.councilState}
                        </span>
                      </div>
                      <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                        {unit.technicalManager.name}
                      </p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                        <span className="text-stone-500 dark:text-stone-400">Alvará Sanitário (VISA):</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Regular até {unit.sanitaryLicense.expiryDate.split('-').reverse().join('/')}
                        </span>
                      </div>
                    </div>

                    {/* Address & Contacts */}
                    <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          {unit.address.street}, {unit.address.number} {unit.address.complement && `• ${unit.address.complement}`} — {unit.address.neighborhood}, {unit.address.city}/{unit.address.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-mono text-[11px]">{unit.contact.phone} / {unit.contact.whatsapp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="text-[11px]">{unit.operatingHours.weekdays} (Sáb: {unit.operatingHours.saturday})</span>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 dark:border-stone-800 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Consultórios</span>
                        <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                          {unit.consultingRooms.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Equipamentos</span>
                        <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                          {unit.equipment.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Ocupação</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {unit.stats.roomOccupancyRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveUnitId(unit.id);
                        showToast(`Unidade de trabalho alternada para: ${unit.name}`);
                      }}
                      className={clsx(
                        "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer",
                        isSelected
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 cursor-default"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                      )}
                    >
                      {isSelected ? '✓ Unidade Selecionada' : 'Selecionar Esta Unidade'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleActivateUnit(unit.id, unit.name)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-800 transition-colors"
                      title="Forçar Reativação Completa das 10 Funções"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* THE 10 CLINICAL & OPERATIONAL FEATURES CATALOG & TOGGLES                   */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Central de Ativação • 10 Funções da Unidade ({activeUnit.name})
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {Object.values(activeUnit.features).filter(Boolean).length}/10 Ativas
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Cada módulo abaixo opera de forma integrada para garantir segurança clínica, compliance regulatório e agilidade no atendimento.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleActivateUnit(activeUnit.id, activeUnit.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Ativar Todas nesta Unidade</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {CLINIC_FEATURES_CATALOG.map((feat) => {
                const isActive = activeUnit.features[feat.key];
                return (
                  <div
                    key={feat.key}
                    className={clsx(
                      "p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3",
                      isActive
                        ? "bg-stone-50/80 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/80"
                        : "bg-stone-100/60 dark:bg-stone-900/60 border-stone-200/60 dark:border-stone-800 opacity-60"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {feat.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                        {feat.shortDesc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        toggleUnitFeature(activeUnit.id, feat.key);
                        showToast(`Função "${feat.title}" alternada.`);
                      }}
                      className={clsx(
                        "px-3 py-1 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer",
                        isActive
                          ? "bg-emerald-700 text-white hover:bg-emerald-800"
                          : "bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-400"
                      )}
                    >
                      {isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONSULTÓRIOS & SALAS DE ATENDIMENTO                                 */}
      {/* ========================================================================= */}
      {activeTab === 'consultorios' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                Consultórios Físicos • {activeUnit.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Controle de ocupação em tempo real, capacidade de atendimento e equipamentos alocados em cada sala.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewRoomModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Consultório</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeUnit.consultingRooms.map((room) => {
              return (
                <div
                  key={room.id}
                  className="rounded-3xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-mono font-bold text-xs text-stone-800 dark:text-stone-200">
                          {room.code}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                          {room.floor}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                        {room.name}
                      </h3>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={clsx(
                        "px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1",
                        room.status === 'disponivel' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                        room.status === 'em_consulta' && "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
                        room.status === 'higienizacao' && "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300"
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {room.status === 'disponivel' && 'Disponível'}
                      {room.status === 'em_consulta' && 'Em Consulta'}
                      {room.status === 'higienizacao' && 'Higienização'}
                    </span>
                  </div>

                  {/* Room Details & Occupant info */}
                  {room.status === 'em_consulta' && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1">
                      <div className="flex items-center justify-between text-amber-900 dark:text-amber-200">
                        <span className="font-semibold">Profissional em Atendimento:</span>
                        <span>{room.currentProfessionalName || 'Dra. Vanessa Rios'}</span>
                      </div>
                      {room.currentPatientName && (
                        <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 pt-1 border-t border-amber-200/50">
                          <span>Paciente Atual:</span>
                          <span className="font-bold">{room.currentPatientName}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Equipment in this room */}
                  <div className="text-xs space-y-1.5">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      Equipamentos alocados nesta sala:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {room.equipmentIds.length > 0 ? (
                        room.equipmentIds.map((eqId) => {
                          const eq = activeUnit.equipment.find(e => e.id === eqId);
                          return (
                            <span
                              key={eqId}
                              className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium"
                            >
                              {eq ? eq.name : eqId}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Nenhum equipamento fixo alocado</span>
                      )}
                    </div>
                  </div>

                  {/* Change Status Quick Buttons */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500">Alternar estado:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          toggleRoomStatus(activeUnit.id, room.id, 'disponivel');
                          showToast(`${room.code} marcado como Disponível.`);
                        }}
                        className={clsx(
                          "px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer",
                          room.status === 'disponivel'
                            ? "bg-emerald-700 text-white"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                        )}
                      >
                        Livre
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleRoomStatus(activeUnit.id, room.id, 'em_consulta');
                          showToast(`${room.code} marcado Em Consulta.`);
                        }}
                        className={clsx(
                          "px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer",
                          room.status === 'em_consulta'
                            ? "bg-amber-700 text-white"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                        )}
                      >
                        Em Consulta
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleRoomStatus(activeUnit.id, room.id, 'higienizacao');
                          showToast(`${room.code} marcado em Higienização.`);
                        }}
                        className={clsx(
                          "px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer",
                          room.status === 'higienizacao'
                            ? "bg-stone-700 text-white"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                        )}
                      >
                        Higienização
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EQUIPAMENTOS & CALIBRAÇÃO METROLÓGICA (IPEM/INMETRO)                */}
      {/* ========================================================================= */}
      {activeTab === 'equipamentos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                Inventário Clínico & Rastreabilidade Metrológica • {activeUnit.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Certificação de balanças, bioimpedâncias e adipômetros conforme normas ABNT/INMETRO e exigências de fiscalização do CRN.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewEquipmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Equipamento</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/70 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Equipamento / Modelo</th>
                    <th className="py-3 px-4">Nº Série & ANVISA</th>
                    <th className="py-3 px-4">Última Aferição</th>
                    <th className="py-3 px-4">Próxima Calibração</th>
                    <th className="py-3 px-4">Certificado</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {activeUnit.equipment.map((eq) => {
                    return (
                      <tr key={eq.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold">
                          <div>
                            <span className="text-stone-900 dark:text-stone-100 block">{eq.name}</span>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">
                              {eq.brandModel}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div>Série: {eq.serialNumber}</div>
                          <div className="text-stone-500">ANVISA: {eq.anvisaRegistration}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          {eq.lastCalibrationDate.split('-').reverse().join('/')}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-stone-900 dark:text-stone-100">
                          {eq.nextCalibrationDate.split('-').reverse().join('/')}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                          {eq.calibrationCertificateNumber || 'N/D'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ✓ Calibrado
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenCalibration(eq)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <FileCheck2 className="w-3 h-3 text-emerald-600" />
                            <span>Renovar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VISA, ALVARÁ SANITÁRIO & RESPONSABILIDADE TÉCNICA (RT)             */}
      {/* ========================================================================= */}
      {activeTab === 'sanitario_rt' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                  Conformidade Sanitária (VISA) & Registro no CNES
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Unidade: {activeUnit.name} • {activeUnit.address.city}/{activeUnit.address.state}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Situação Sanitária Regular
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sanitary License Box */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    Alvará de Vigilância Sanitária Municipal
                  </h3>
                </div>

                <div className="text-xs space-y-2 text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Número do Alvará:</span>
                    <span className="font-mono font-bold">{activeUnit.sanitaryLicense.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Órgão Emissor:</span>
                    <span className="font-medium">{activeUnit.sanitaryLicense.issuingBody}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Número do Processo:</span>
                    <span className="font-mono">{activeUnit.sanitaryLicense.processNumber}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500">Data de Emissão:</span>
                    <span className="font-mono">{activeUnit.sanitaryLicense.issueDate.split('-').reverse().join('/')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Validade do Alvará:</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {activeUnit.sanitaryLicense.expiryDate.split('-').reverse().join('/')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Responsibility Box */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    Responsável Técnico(a) Titular (RT)
                  </h3>
                </div>

                <div className="text-xs space-y-2 text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Profissional Titular:</span>
                    <span className="font-bold">{activeUnit.technicalManager.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Registro Profissional:</span>
                    <span className="font-mono font-bold">
                      {activeUnit.technicalManager.council} {activeUnit.technicalManager.councilNumber}/{activeUnit.technicalManager.councilState}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Cargo / Alçada:</span>
                    <span>{activeUnit.technicalManager.roleTitle}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500">E-mail Institucional:</span>
                    <span className="font-mono">{activeUnit.technicalManager.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">CPF Minimizado:</span>
                    <span className="font-mono">{activeUnit.technicalManager.documentCpf}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory Notice LGPD & ANVISA */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Segurança da Informação e Segregação de Prontuários (Art. 5º da LGPD)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800/90 dark:text-emerald-300/90">
                Cada unidade clínica possui chaves de criptografia e isolamento de banco de dados segregadas. Os registros de anamnese,
                bioimpedância e plano alimentar só podem ser acessados por profissionais credenciados nesta filial, ou mediante termo de consentimento
                expresso assinado pelo paciente para compartilhamento inter-filiais.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EQUIPE VINCULADA & ESCALA SEMANAL                                   */}
      {/* ========================================================================= */}
      {activeTab === 'equipe' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                Equipe & Escala de Atendimento • {activeUnit.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Profissionais de saúde com dias de consultório e alocação de salas reservadas nesta filial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeUnit.teamAllocations.map((alloc) => {
              return (
                <div
                  key={alloc.professionalId}
                  className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {alloc.council}
                    </span>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      {alloc.name}
                    </h3>
                    <p className="text-xs text-stone-500">{alloc.role}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Consultório Fixo:</span>
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{alloc.assignedRoomCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Horário:</span>
                      <span className="font-mono">{alloc.consultationHours}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-stone-500 font-medium">Dias de Atendimento na Unidade:</span>
                    <div className="flex items-center gap-1">
                      {(['seg', 'ter', 'qua', 'qui', 'sex', 'sab'] as const).map((day) => {
                        const isScheduled = alloc.daysOfWeek.includes(day);
                        return (
                          <span
                            key={day}
                            className={clsx(
                              "w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center uppercase",
                              isScheduled
                                ? "bg-emerald-700 text-white"
                                : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                            )}
                          >
                            {day.slice(0, 1)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: INSUMOS & AMOSTRAS DE SUPLEMENTOS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'insumos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                Almoxarifado & Amostras de Suplementos • {activeUnit.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Controle de estoque local de materiais descartáveis, fitas e sachês de degustação para pacientes.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item / Insumo Clínico</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Lote / Validade</th>
                  <th className="py-3 px-4 text-right">Estoque Atual</th>
                  <th className="py-3 px-4 text-right">Mínimo</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                {activeUnit.inventory.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-stone-100">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-stone-500">
                        {item.category.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>Lote: {item.batchNumber}</div>
                        {item.expiryDate && (
                          <div className="text-stone-500">Val: {item.expiryDate.split('-').reverse().join('/')}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-stone-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            Reabastecer
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ✓ Regular
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CADASTRAR OU EDITAR UNIDADE CLÍNICA                                 */}
      {/* ========================================================================= */}
      {(isNewUnitModalOpen || isEditUnitModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                {isEditUnitModalOpen ? 'Editar Unidade Clínica' : 'Cadastrar Nova Unidade / Filial'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsNewUnitModalOpen(false);
                  setIsEditUnitModalOpen(false);
                }}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Nome Fantasia da Unidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={unitForm.name}
                    onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                    placeholder="Ex: NutriClínica Moema • Filial"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    value={unitForm.corporateName}
                    onChange={(e) => setUnitForm({ ...unitForm, corporateName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    CNPJ da Unidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={unitForm.cnpj}
                    onChange={(e) => setUnitForm({ ...unitForm, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Código CNES Oficial *
                  </label>
                  <input
                    type="text"
                    required
                    value={unitForm.cnes}
                    onChange={(e) => setUnitForm({ ...unitForm, cnes: e.target.value })}
                    placeholder="7 dígitos (ex: 7184920)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Tipo de Estabelecimento
                  </label>
                  <select
                    value={unitForm.type}
                    onChange={(e) => setUnitForm({ ...unitForm, type: e.target.value as 'matriz' | 'filial' | 'avancada' })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  >
                    <option value="matriz">Sede Matriz</option>
                    <option value="filial">Filial Ambulatorial</option>
                    <option value="avancada">Unidade Avançada / Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={unitForm.phone}
                    onChange={(e) => setUnitForm({ ...unitForm, phone: e.target.value })}
                    placeholder="(11) 3000-0000"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <span className="font-bold text-xs uppercase tracking-wider text-stone-500 block mb-2">
                  Endereço do Estabelecimento
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Logradouro (Rua, Av.)"
                      value={unitForm.street}
                      onChange={(e) => setUnitForm({ ...unitForm, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Número e Sala"
                      value={unitForm.number}
                      onChange={(e) => setUnitForm({ ...unitForm, number: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={unitForm.neighborhood}
                      onChange={(e) => setUnitForm({ ...unitForm, neighborhood: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={unitForm.city}
                      onChange={(e) => setUnitForm({ ...unitForm, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CEP"
                      value={unitForm.zipCode}
                      onChange={(e) => setUnitForm({ ...unitForm, zipCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>

              {/* RT & VISA */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <span className="font-bold text-xs uppercase tracking-wider text-stone-500 block mb-2">
                  Responsabilidade Técnica (RT) & Vigilância Sanitária
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nome do(a) RT Titular"
                      value={unitForm.rtName}
                      onChange={(e) => setUnitForm({ ...unitForm, rtName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Registro (ex: CRN-3 14285)"
                      value={unitForm.rtCouncilNumber}
                      onChange={(e) => setUnitForm({ ...unitForm, rtCouncilNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Número do Alvará Sanitário (VISA)"
                      value={unitForm.visaNumber}
                      onChange={(e) => setUnitForm({ ...unitForm, visaNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={unitForm.visaExpiryDate}
                      onChange={(e) => setUnitForm({ ...unitForm, visaExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewUnitModalOpen(false);
                    setIsEditUnitModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all"
                >
                  {isEditUnitModalOpen ? 'Salvar Alterações' : 'Cadastrar Unidade com 10/10 Funções'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADICIONAR CONSULTÓRIO                                              */}
      {/* ========================================================================= */}
      {isNewRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                Adicionar Consultório • {activeUnit.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewRoomModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Nome do Consultório *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultório 5 • Bioimpedância & Performance"
                  value={newRoomForm.name}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Código da Sala *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: SL-105"
                    value={newRoomForm.code}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Andar / Localização
                  </label>
                  <input
                    type="text"
                    value={newRoomForm.floor}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Finalidade Clínica Principal
                </label>
                <select
                  value={newRoomForm.type}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, type: e.target.value as ConsultingRoom['type'] })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                >
                  <option value="antropometria_bioimpedancia">Antropometria & Bioimpedância</option>
                  <option value="nutricao_clinica">Nutrição Clínica & Funcional</option>
                  <option value="nutricao_esportiva">Nutrologia & Medicina do Esporte</option>
                  <option value="retorno_rapido">Cabine de Teleconsulta / Retorno Rápido</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRoomModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all"
                >
                  Criar Consultório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CADASTRAR EQUIPAMENTO                                              */}
      {/* ========================================================================= */}
      {isNewEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                Cadastrar Equipamento • {activeUnit.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewEquipmentModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEquipSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Nome do Instrumento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Adipômetro Científico Harpenden"
                  value={newEquipForm.name}
                  onChange={(e) => setNewEquipForm({ ...newEquipForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Categoria
                  </label>
                  <select
                    value={newEquipForm.category}
                    onChange={(e) => setNewEquipForm({ ...newEquipForm, category: e.target.value as ClinicalEquipment['category'] })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  >
                    <option value="bioimpedancia">Bioimpedância</option>
                    <option value="adipometro">Adipômetro / Plicômetro</option>
                    <option value="estadiometro">Estadiômetro</option>
                    <option value="balanca">Balança Antropométrica</option>
                    <option value="fita_metrica">Fita Antropométrica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Marca e Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: InBody 770 / Baty"
                    value={newEquipForm.brandModel}
                    onChange={(e) => setNewEquipForm({ ...newEquipForm, brandModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Número de Série
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: SN-2024-991"
                    value={newEquipForm.serialNumber}
                    onChange={(e) => setNewEquipForm({ ...newEquipForm, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                    Registro ANVISA
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 80287040008"
                    value={newEquipForm.anvisaRegistration}
                    onChange={(e) => setNewEquipForm({ ...newEquipForm, anvisaRegistration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Nº do Certificado de Calibração IPEM/INMETRO
                </label>
                <input
                  type="text"
                  placeholder="Ex: CAL-IPEM-2024/99142"
                  value={newEquipForm.calibrationCertificateNumber}
                  onChange={(e) => setNewEquipForm({ ...newEquipForm, calibrationCertificateNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewEquipmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR NOVA CALIBRAÇÃO METROLÓGICA                              */}
      {/* ========================================================================= */}
      {isCalibrationModalOpen && selectedEquipForCalibration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                Registrar Calibração Metrológica
              </h3>
              <button
                type="button"
                onClick={() => setIsCalibrationModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 text-xs">
              <span className="text-stone-500 block">Instrumento:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {selectedEquipForCalibration.name} ({selectedEquipForCalibration.brandModel})
              </span>
              <span className="text-[11px] font-mono text-stone-500 block">
                Série: {selectedEquipForCalibration.serialNumber}
              </span>
            </div>

            <form onSubmit={handleSaveCalibration} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Número do Laudo / Certificado de Calibração *
                </label>
                <input
                  type="text"
                  required
                  value={calibrationCertForm.certificateNumber}
                  onChange={(e) => setCalibrationCertForm({ ...calibrationCertForm, certificateNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Nova Data de Vencimento (12 Meses) *
                </label>
                <input
                  type="date"
                  required
                  value={calibrationCertForm.nextDate}
                  onChange={(e) => setCalibrationCertForm({ ...calibrationCertForm, nextDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCalibrationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all"
                >
                  Confirmar e Emitir Selo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
