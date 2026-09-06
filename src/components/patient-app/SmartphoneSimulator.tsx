import React, { useState } from 'react';
import {
  Calendar,
  Utensils,
  Pill,
  FileSpreadsheet,
  TrendingUp,
  MessageSquare,
  ShoppingCart,
  Droplet,
  Check,
  Bell,
  Send,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Info,
  Clock,
  Play,
  Pause,
  UploadCloud,
  FileCheck,
  Plus,
  RefreshCw,
  Camera
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { usePatientApp } from '../../contexts/PatientAppContext';

export type PhoneTab = 'hoje' | 'cardapio' | 'suplementos' | 'exames' | 'evolucao' | 'chat' | 'compras';

interface SmartphoneSimulatorProps {
  pushNotification: { title: string; body: string } | null;
  onClearPush: () => void;
}

export const SmartphoneSimulator: React.FC<SmartphoneSimulatorProps> = ({
  pushNotification,
  onClearPush
}) => {
  const { features } = usePatientApp();
  const [activeTab, setActiveTab] = useState<PhoneTab>('hoje');

  // Interactive Water State
  const [waterDrunkMl, setWaterDrunkMl] = useState<number>(1750);
  const waterGoalMl = 2500; // 35ml/kg * 71.4kg = ~2500ml

  // Meals checklist
  const [mealsChecked, setMealsChecked] = useState<Record<string, boolean>>({
    cafe: true,
    colacao: true,
    almoco: true,
    lanche: false,
    jantar: false,
    ceia: false,
  });

  // Supplements taken checklist
  const [supplementsTaken, setSupplementsTaken] = useState<Record<string, boolean>>({
    creatina: true,
    omega3: true,
    coq10: false,
    magnesio: false
  });

  // Chat State
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'patient' | 'nutri'; text: string; time: string }>>([
    {
      id: 'm1',
      sender: 'nutri',
      text: 'Olá, Mariana! Seu plano alimentar atualizado e a requisição de exames bioquímicos já estão disponíveis aqui no app.',
      time: '08:15'
    },
    {
      id: 'm2',
      sender: 'patient',
      text: 'Bom dia, Dra. Vanessa! Já vi aqui. Para o exame de sangue, são 12 horas de jejum?',
      time: '08:42'
    },
    {
      id: 'm3',
      sender: 'nutri',
      text: 'Exato! Como incluímos o perfil lipídico completo, são 12h de jejum. Pode beber água à vontade!',
      time: '08:45'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Exam result uploaded simulation
  const [examUploaded, setExamUploaded] = useState(false);

  // Metric selector for evolution
  const [evolutionMetric, setEvolutionMetric] = useState<'gordura' | 'peso' | 'massaMagra'>('gordura');

  // Grocery list checked items
  const [groceryChecked, setGroceryChecked] = useState<Record<string, boolean>>({
    g1: true,
    g2: true,
    g3: false,
    g4: false,
    g5: true,
    g6: false,
  });

  // Food substitution modal inside phone
  const [showSubstitutions, setShowSubstitutions] = useState(false);

  // Helper functions
  const handleAddWater = (amount: number) => {
    setWaterDrunkMl(prev => Math.min(4000, Math.max(0, prev + amount)));
  };

  const handleToggleMeal = (id: string) => {
    setMealsChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSupplement = (id: string) => {
    setSupplementsTaken(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleGrocery = (id: string) => {
    setGroceryChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: `msg-${Date.now()}`, sender: 'patient' as const, text: newMessage.trim(), time: nowStr };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Contextual simulated response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'nutri',
          text: 'Perfeito! Registrei aqui no seu prontuário. Mantenha o foco na hidratação e nos horários dos suplementos!',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  // Evolution chart data
  const chartData = [
    { data: '01/06', gordura: 23.4, peso: 78.5, massaMagra: 60.1 },
    { data: '22/06', gordura: 22.5, peso: 77.2, massaMagra: 59.8 },
    { data: '15/07', gordura: 21.8, peso: 76.0, massaMagra: 60.4 },
    { data: '05/08', gordura: 21.0, peso: 74.8, massaMagra: 60.9 },
    { data: '28/08', gordura: 20.2, peso: 73.9, massaMagra: 61.2 },
  ];

  return (
    <div className="w-[350px] h-[720px] bg-stone-950 rounded-[48px] p-3 shadow-2xl border-[6px] border-stone-800 relative flex flex-col overflow-hidden select-none font-sans">
      {/* Top Island / Camera notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-950 rounded-full z-50 flex items-center justify-center border border-stone-900 shadow-inner">
        <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 mr-3" />
        <div className="w-2 h-2 rounded-full bg-emerald-950" />
      </div>

      {/* Screen Frame */}
      <div className="w-full h-full bg-stone-900 rounded-[38px] overflow-hidden flex flex-col relative text-stone-100">
        {/* Push notification banner overlay inside phone */}
        {pushNotification && (
          <div 
            onClick={onClearPush}
            className="absolute top-3 left-3 right-3 z-50 bg-stone-800/95 backdrop-blur-md border border-stone-700/80 p-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-200 text-xs cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold mb-0.5">
              <span className="flex items-center gap-1.5">
                <Bell className="w-3 h-3" />
                {pushNotification.title}
              </span>
              <span className="text-stone-400 font-mono">agora</span>
            </div>
            <p className="text-[11px] text-stone-200 leading-snug">{pushNotification.body}</p>
          </div>
        )}

        {/* Status Bar */}
        <div className="h-10 pt-2 px-5 flex items-center justify-between text-[11px] text-stone-400 font-mono shrink-0">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold">5G</span>
            <div className="w-5 h-2.5 border border-stone-500 rounded-sm p-0.5 flex items-center">
              <div className="w-3.5 h-full bg-emerald-500 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Patient Profile Bar */}
        <div className="px-4 py-2 border-b border-stone-800/80 flex items-center justify-between shrink-0 bg-stone-900/90 backdrop-blur-xs">
          <div>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
              Plano Clínico Ativo
            </span>
            <p className="text-xs font-bold text-stone-100">Mariana Lima Santos</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-stone-400">CRN-3 14285</span>
          </div>
        </div>

        {/* Dynamic Nav Pill Filter at top of phone */}
        <div className="px-3 py-1.5 border-b border-stone-800/50 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 bg-stone-950/40 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('hoje')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'hoje' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cardapio')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'cardapio' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Cardápio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suplementos')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'suplementos' ? 'bg-stone-800 text-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Suplementos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exames')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'exames' ? 'bg-stone-800 text-violet-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Exames
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evolucao')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'evolucao' ? 'bg-stone-800 text-sky-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Evolução
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compras')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'compras' ? 'bg-stone-800 text-teal-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Compras
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-2 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              activeTab === 'chat' ? 'bg-stone-800 text-sky-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Chat
          </button>
        </div>

        {/* Phone Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs scrollbar-none">
          {/* TAB 1: HOJE */}
          {activeTab === 'hoje' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {/* Card Meta de Água */}
              {features.waterTracker ? (
                <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-sky-400" /> Meta de Hidratação
                    </span>
                    <span className="font-mono text-[11px] font-bold text-stone-100">
                      {waterDrunkMl} / {waterGoalMl} ml
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (waterDrunkMl / waterGoalMl) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {Math.round((waterDrunkMl / waterGoalMl) * 100)}% concluído
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddWater(150)}
                        className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-mono font-semibold border border-sky-500/30 cursor-pointer"
                      >
                        +150ml
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddWater(250)}
                        className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-mono font-semibold border border-sky-500/30 cursor-pointer"
                      >
                        +250ml
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddWater(500)}
                        className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-mono font-semibold border border-sky-500/30 cursor-pointer"
                      >
                        +500ml
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-stone-800/40 border border-stone-800 text-[11px] text-stone-500 italic text-center">
                  Rastreador de água pausado na Central de Ativação
                </div>
              )}

              {/* Checklist de Suplementos do Dia */}
              {features.supplementRoutine && (
                <div className="bg-stone-800/60 p-3 rounded-2xl border border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-amber-400" /> Suplementação de Hoje
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {Object.values(supplementsTaken).filter(Boolean).length}/4 tomados
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div
                      onClick={() => handleToggleSupplement('creatina')}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        supplementsTaken.creatina
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[11px]">Creatina Monohidratada 5g</p>
                        <p className="text-[10px] text-stone-400">Pós-treino imediato com água</p>
                      </div>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        supplementsTaken.creatina ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {supplementsTaken.creatina && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>

                    <div
                      onClick={() => handleToggleSupplement('omega3')}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        supplementsTaken.omega3
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[11px]">Ômega-3 TG 1000mg (EPA/DHA)</p>
                        <p className="text-[10px] text-stone-400">Junto ao almoço (absorção lipídica)</p>
                      </div>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        supplementsTaken.omega3 ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {supplementsTaken.omega3 && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>

                    <div
                      onClick={() => handleToggleSupplement('magnesio')}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        supplementsTaken.magnesio
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[11px]">Magnésio Bisglicinato 300mg</p>
                        <p className="text-[10px] text-stone-400">30 min antes de dormir</p>
                      </div>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        supplementsTaken.magnesio ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {supplementsTaken.magnesio && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Refeições do Dia */}
              {features.foodDiary && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-emerald-400" /> Diário de Refeições
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {Object.values(mealsChecked).filter(Boolean).length}/6 feitas
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div
                      onClick={() => handleToggleMeal('cafe')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        mealsChecked.cafe ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-300' : 'bg-stone-900/70 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[11px]">07:30 • Café da Manhã</p>
                        <p className="text-[10px] text-stone-400">2 ovos mexidos + 1 fatia pão fermentação natural + café puro</p>
                      </div>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        mealsChecked.cafe ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {mealsChecked.cafe && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>

                    <div
                      onClick={() => handleToggleMeal('almoco')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        mealsChecked.almoco ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-300' : 'bg-stone-900/70 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[11px]">12:30 • Almoço Principal</p>
                        <p className="text-[10px] text-stone-400">120g Frango grelhado + 100g arroz integral + vegetais variados</p>
                      </div>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        mealsChecked.almoco ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {mealsChecked.almoco && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>

                    <div
                      onClick={() => handleToggleMeal('lanche')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        mealsChecked.lanche ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-300' : 'bg-stone-900/70 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[11px]">16:00 • Lanche da Tarde</p>
                        <p className="text-[10px] text-stone-400">1 iogurte proteico natural + 15g mix de castanhas</p>
                      </div>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        mealsChecked.lanche ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {mealsChecked.lanche && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lembrete de Exame Pendente */}
              {features.examPanel && (
                <div className="p-3 rounded-2xl bg-violet-950/40 border border-violet-800/60 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-violet-300 flex items-center gap-1">
                      <FileSpreadsheet className="w-3 h-3" /> Exame Requisitado
                    </span>
                    <p className="text-[11px] font-semibold text-stone-200">Painel Metabólico & Lipídico</p>
                    <p className="text-[10px] text-stone-400">Jejum exigido: 12 horas</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('exames')}
                    className="px-2 py-1.5 rounded-lg bg-violet-600 text-white text-[10px] font-semibold cursor-pointer shrink-0"
                  >
                    Ver Preparo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CARDÁPIO */}
          {activeTab === 'cardapio' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-100">Metas Nutricionais Diárias</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">1.850 kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 block text-[9px]">Proteína</span>
                    <span className="font-mono font-bold text-emerald-400">125g</span>
                  </div>
                  <div className="bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 block text-[9px]">Carboidrato</span>
                    <span className="font-mono font-bold text-sky-400">160g</span>
                  </div>
                  <div className="bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 block text-[9px]">Lipídios</span>
                    <span className="font-mono font-bold text-amber-400">45g</span>
                  </div>
                </div>
              </div>

              {/* Botão de Substituições Permitidas */}
              {features.mealPlanSubstitutions && (
                <button
                  type="button"
                  onClick={() => setShowSubstitutions(!showSubstitutions)}
                  className="w-full py-2 px-3 rounded-xl bg-teal-950/60 border border-teal-800/60 text-teal-300 text-[11px] font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Lista de Equivalentes & Substituições
                  </span>
                  <span className="text-[10px] font-mono text-teal-400">
                    {showSubstitutions ? 'Ocultar' : 'Ver tabela'}
                  </span>
                </button>
              )}

              {showSubstitutions && (
                <div className="p-3 rounded-xl bg-stone-900 border border-teal-800/40 text-[10px] space-y-2 text-stone-300">
                  <p className="font-bold text-teal-300">Exemplos de Trocas Equivalentes:</p>
                  <ul className="space-y-1 list-disc list-inside text-stone-400">
                    <li><strong className="text-stone-200">100g Arroz</strong> = 140g Mandioca = 150g Batata doce</li>
                    <li><strong className="text-stone-200">120g Frango</strong> = 140g Tilápia = 2 Ovos + 30g Queijo</li>
                    <li><strong className="text-stone-200">1 Maçã</strong> = 1 Pêra = 120g Melancia</li>
                  </ul>
                </div>
              )}

              {/* Refeições Estruturadas */}
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-stone-800/50 border border-stone-700/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-stone-200">07:30 • Café da Manhã</span>
                    <span className="text-[10px] font-mono text-stone-400">320 kcal</span>
                  </div>
                  <p className="text-[10px] text-stone-300">2 ovos inteiros mexidos em fogo brando com azeite extravirgem (5ml) + 1 fatia (50g) pão de fermentação natural + café filtrado sem açúcar.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-800/50 border border-stone-700/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-stone-200">12:30 • Almoço Principal</span>
                    <span className="text-[10px] font-mono text-stone-400">540 kcal</span>
                  </div>
                  <p className="text-[10px] text-stone-300">120g Peito de frango grelhado + 100g Arroz integral cozido + 60g Feijão carioca em concha + Salada livre de folhas verde-escuras à vontade.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-800/50 border border-stone-700/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-stone-200">20:00 • Jantar Leve</span>
                    <span className="text-[10px] font-mono text-stone-400">410 kcal</span>
                  </div>
                  <p className="text-[10px] text-stone-300">140g Filé de peixe (Tilápia ou Saint Peter) assado com ervas finas + 150g Abobrinha e cenoura salteadas com azeite de oliva.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUPLEMENTOS */}
          {activeTab === 'suplementos' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-amber-400" /> Prescrição Ativa
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200">
                    Alçada Nutricionista
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Emitido por Dra. Vanessa Rios (CRN-3 14285) • Validade 60 dias
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[11px] text-stone-100">1. Creatina Monohidratada Pura</h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">5g / dia</span>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    Forma: Monohidratada Micronizada Creapure. Tomar 1 dose (5g) diluída em 200ml de água no pós-treino imediato.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-700/60 text-[10px]">
                    <span className="text-stone-400">Horário: Pós-treino</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Tomado hoje
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[11px] text-stone-100">2. Ômega-3 TG Concentrado</h4>
                    <span className="text-[10px] font-mono font-bold text-amber-400">1.000mg</span>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    Relação EPA 400mg / DHA 300mg. Tomar 2 cápsulas junto à refeição do almoço para otimizar a absorção micelar.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-700/60 text-[10px]">
                    <span className="text-stone-400">Horário: 12:30 Almoço</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Tomado hoje
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[11px] text-stone-100">3. Magnésio Bisglicinato (Quelato)</h4>
                    <span className="text-[10px] font-mono font-bold text-sky-400">300mg</span>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    Quelato ligado à glicina. Tomar 1 cápsula 30 minutos antes de deitar para suporte ao relaxamento muscular e sono profundo.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-700/60 text-[10px]">
                    <span className="text-stone-400">Horário: 22:00 Noite</span>
                    <button
                      type="button"
                      onClick={() => handleToggleSupplement('magnesio')}
                      className="px-2 py-0.5 rounded bg-stone-700 text-stone-200 text-[10px] hover:bg-stone-600 cursor-pointer"
                    >
                      {supplementsTaken.magnesio ? '✓ Marcado' : 'Marcar agora'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXAMES */}
          {activeTab === 'exames' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-violet-950/30 border border-violet-800/60 space-y-1">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-violet-400" /> Requisição Laboratorial
                </span>
                <p className="text-[10px] text-stone-300">
                  Emitida para acompanhamento de homeostase glicêmica e risco cardiovascular.
                </p>
              </div>

              {/* Card de Preparo Obrigatório */}
              <div className="p-3 rounded-xl bg-stone-800/90 border border-stone-700 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Instruções de Preparo Clínico:
                </span>
                <ul className="text-[10px] text-stone-400 space-y-1 list-disc list-inside">
                  <li><strong>Jejum estrito de 12 horas</strong> (água liberada sem restrições)</li>
                  <li>Evitar bebidas alcoólicas nas 72 horas prévias</li>
                  <li>Não realizar treinos vigorosos 24 horas antes da coleta</li>
                </ul>
              </div>

              {/* Exames Solicitados */}
              <div className="space-y-1.5 text-[10px]">
                <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <span className="font-semibold text-stone-200">Glicemia de Jejum</span>
                  <span className="text-stone-400 font-mono">Ref: 70 a 99 mg/dL</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <span className="font-semibold text-stone-200">Insulina Basal & HOMA-IR</span>
                  <span className="text-stone-400 font-mono">Ref: &lt; 8 µUI/mL</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <span className="font-semibold text-stone-200">Lipidograma Completo (HDL/LDL/TG)</span>
                  <span className="text-stone-400 font-mono">Ref: TG &lt; 150 mg/dL</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <span className="font-semibold text-stone-200">25-OH Vitamina D</span>
                  <span className="text-stone-400 font-mono">Ref: &gt; 30 ng/mL</span>
                </div>
              </div>

              {/* Botão de Envio de Laudo */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setExamUploaded(!examUploaded)}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[11px] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {examUploaded ? '✓ Laudo Laboratorial Anexado' : 'Anexar Laudo PDF do Laboratório'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: EVOLUÇÃO */}
          {activeTab === 'evolucao' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-100">Recomposição Corporal</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                    -3.2% Gordura
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Protocolo Jackson-Pollock 7 dobras cutâneas & Bioimpedância
                </p>

                {/* Metric Selector Pills */}
                <div className="flex gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setEvolutionMetric('gordura')}
                    className={`flex-1 py-1 rounded-lg text-[9px] font-mono font-semibold cursor-pointer ${
                      evolutionMetric === 'gordura' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    % Gordura
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvolutionMetric('peso')}
                    className={`flex-1 py-1 rounded-lg text-[9px] font-mono font-semibold cursor-pointer ${
                      evolutionMetric === 'peso' ? 'bg-sky-500 text-stone-950' : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    Peso (kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvolutionMetric('massaMagra')}
                    className={`flex-1 py-1 rounded-lg text-[9px] font-mono font-semibold cursor-pointer ${
                      evolutionMetric === 'massaMagra' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    Massa Magra
                  </button>
                </div>
              </div>

              {/* Mini Gráfico Recharts */}
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="data" stroke="#78716c" tick={{ fontSize: 9, fill: '#a8a29e' }} />
                    <YAxis
                      stroke="#78716c"
                      domain={
                        evolutionMetric === 'gordura' ? [19, 25] : evolutionMetric === 'peso' ? [72, 80] : [58, 63]
                      }
                      tick={{ fontSize: 9, fill: '#a8a29e' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-stone-950 p-2 rounded-lg border border-stone-800 text-[10px] font-mono">
                              <p className="font-bold text-white">{item.data}</p>
                              {evolutionMetric === 'gordura' && <p className="text-amber-400">{item.gordura}% Gordura</p>}
                              {evolutionMetric === 'peso' && <p className="text-sky-400">{item.peso} kg</p>}
                              {evolutionMetric === 'massaMagra' && <p className="text-emerald-400">{item.massaMagra} kg Massa Magra</p>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={evolutionMetric}
                      stroke={evolutionMetric === 'gordura' ? '#f59e0b' : evolutionMetric === 'peso' ? '#0284c7' : '#10b981'}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: evolutionMetric === 'gordura' ? '#f59e0b' : evolutionMetric === 'peso' ? '#0284c7' : '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-stone-800/70 border border-stone-700/60">
                  <span className="text-stone-400 block text-[9px]">Peso Atual</span>
                  <strong className="text-xs font-mono text-stone-100">73.9 kg</strong>
                </div>
                <div className="p-2 rounded-xl bg-stone-800/70 border border-stone-700/60">
                  <span className="text-stone-400 block text-[9px]">% Gordura</span>
                  <strong className="text-xs font-mono text-amber-400">20.2%</strong>
                </div>
                <div className="p-2 rounded-xl bg-stone-800/70 border border-stone-700/60">
                  <span className="text-stone-400 block text-[9px]">Massa Magra</span>
                  <strong className="text-xs font-mono text-emerald-400">61.2 kg</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMPRAS */}
          {activeTab === 'compras' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-teal-950/30 border border-teal-800/60 space-y-1">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-teal-400" /> Lista Inteligente de Compras
                </span>
                <p className="text-[10px] text-stone-300">
                  Ingredientes calculados para 7 dias de adesão estrita ao plano alimentar.
                </p>
              </div>

              {/* Setor: Carnes & Proteínas */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Açougue & Ovos</p>
                <div
                  onClick={() => handleToggleGrocery('g1')}
                  className="p-2 rounded-xl bg-stone-800/70 border border-stone-700 flex items-center justify-between cursor-pointer text-[11px]"
                >
                  <span className={groceryChecked.g1 ? 'line-through text-stone-500' : 'text-stone-200'}>
                    Peito de Frango (1.2 kg em bifes)
                  </span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${groceryChecked.g1 ? 'bg-teal-500 text-stone-950 border-teal-400' : 'border-stone-600'}`}>
                    {groceryChecked.g1 && <Check className="w-2.5 h-2.5 stroke-3" />}
                  </div>
                </div>

                <div
                  onClick={() => handleToggleGrocery('g2')}
                  className="p-2 rounded-xl bg-stone-800/70 border border-stone-700 flex items-center justify-between cursor-pointer text-[11px]"
                >
                  <span className={groceryChecked.g2 ? 'line-through text-stone-500' : 'text-stone-200'}>
                    Ovos Caipiras (Cartela com 30 un.)
                  </span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${groceryChecked.g2 ? 'bg-teal-500 text-stone-950 border-teal-400' : 'border-stone-600'}`}>
                    {groceryChecked.g2 && <Check className="w-2.5 h-2.5 stroke-3" />}
                  </div>
                </div>
              </div>

              {/* Setor: Hortifrúti */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Hortifrúti & Feira</p>
                <div
                  onClick={() => handleToggleGrocery('g3')}
                  className="p-2 rounded-xl bg-stone-800/70 border border-stone-700 flex items-center justify-between cursor-pointer text-[11px]"
                >
                  <span className={groceryChecked.g3 ? 'line-through text-stone-500' : 'text-stone-200'}>
                    Abobrinha italiana & Cenouras (800g)
                  </span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${groceryChecked.g3 ? 'bg-teal-500 text-stone-950 border-teal-400' : 'border-stone-600'}`}>
                    {groceryChecked.g3 && <Check className="w-2.5 h-2.5 stroke-3" />}
                  </div>
                </div>

                <div
                  onClick={() => handleToggleGrocery('g4')}
                  className="p-2 rounded-xl bg-stone-800/70 border border-stone-700 flex items-center justify-between cursor-pointer text-[11px]"
                >
                  <span className={groceryChecked.g4 ? 'line-through text-stone-500' : 'text-stone-200'}>
                    Mix de Folhas (Rúcula + Espinafre)
                  </span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${groceryChecked.g4 ? 'bg-teal-500 text-stone-950 border-teal-400' : 'border-stone-600'}`}>
                    {groceryChecked.g4 && <Check className="w-2.5 h-2.5 stroke-3" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CHAT */}
          {activeTab === 'chat' && (
            <div className="h-[430px] flex flex-col justify-between animate-in fade-in duration-150">
              <div className="space-y-2.5 overflow-y-auto pr-1">
                {/* Áudio Gravado da Nutricionista */}
                <div className="p-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Áudio da Dra. Vanessa
                    </span>
                    <span className="text-[9px] font-mono text-stone-400">0:42</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-7 h-7 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>
                    <div className="flex-1 h-1.5 bg-stone-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-emerald-400 rounded-full ${isPlayingAudio ? 'w-3/4 transition-all duration-3000' : 'w-1/4'}`} />
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-2.5 rounded-2xl max-w-[85%] text-[11px] leading-relaxed ${
                        m.sender === 'patient'
                          ? 'bg-sky-600 text-white rounded-br-xs'
                          : 'bg-stone-800 text-stone-200 border border-stone-700 rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-stone-500 mt-0.5 px-1 font-mono">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-2 flex gap-1.5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escrever para a nutricionista..."
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-[11px] focus:outline-hidden focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Tab Bar inside Phone */}
        <div className="h-14 bg-stone-950 border-t border-stone-800 px-3 flex items-center justify-around shrink-0 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('hoje')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'hoje' ? 'text-emerald-400 font-bold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Hoje</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cardapio')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'cardapio' ? 'text-emerald-400 font-bold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Cardápio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suplementos')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'suplementos' ? 'text-amber-400 font-bold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Suplementos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evolucao')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'evolucao' ? 'text-sky-400 font-bold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Evolução</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'chat' ? 'text-sky-400 font-bold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
