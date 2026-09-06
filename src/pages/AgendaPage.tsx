import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  User,
  Filter
} from 'lucide-react';

interface Appointment {
  id: string;
  paciente: string;
  data: string;
  horario: string;
  tipo: string;
  status: 'Confirmado' | 'Pendente' | 'Concluído';
  observacao: string;
}

const INITIAL_SCHEDULE: Appointment[] = [
  {
    id: 'a-1',
    paciente: 'Mariana Lima Santos',
    data: '2026-09-04',
    horario: '08:30',
    tipo: 'Retorno & Dobras Cutâneas',
    status: 'Confirmado',
    observacao: 'Foco em redução de gordura abdominal'
  },
  {
    id: 'a-2',
    paciente: 'Carlos Eduardo Mendes',
    data: '2026-09-04',
    horario: '10:00',
    tipo: 'Primeira Consulta & Antropometria',
    status: 'Confirmado',
    observacao: 'Avaliação clínica completa'
  },
  {
    id: 'a-3',
    paciente: 'Beatriz Vasconcelos',
    data: '2026-09-04',
    horario: '11:30',
    tipo: 'Revisão do Plano Alimentar',
    status: 'Confirmado',
    observacao: 'Ajuste de calorias e macros'
  },
  {
    id: 'a-4',
    paciente: 'Lucas Gabriel Silveira',
    data: '2026-09-04',
    horario: '14:00',
    tipo: 'Antropometria de Atleta',
    status: 'Pendente',
    observacao: 'Protocolo Jackson-Pollock 7 dobras'
  },
  {
    id: 'a-5',
    paciente: 'Juliana Costa e Silva',
    data: '2026-09-04',
    horario: '15:30',
    tipo: 'Retorno Mensal',
    status: 'Confirmado',
    observacao: 'Acompanhamento do app do paciente'
  }
];

export const AgendaPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_SCHEDULE);
  const [selectedDate, setSelectedDate] = useState('2026-09-04');

  const toggleStatus = (id: string) => {
    setAppointments(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus: Appointment['status'] =
            item.status === 'Pendente'
              ? 'Confirmado'
              : item.status === 'Confirmado'
              ? 'Concluído'
              : 'Pendente';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Agenda de Atendimentos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Hoje: {appointments.length} Consultas
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerenciamento de horários, confirmações e início imediato de avaliação física.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/calculadoras/dobras-cutaneas')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-105"
          >
            <Calculator className="w-4 h-4" />
            <span>Iniciar Antropometria</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Controle de Datas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
              Sexta-feira, 04 de Setembro de 2026
            </span>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4 Confirmadas
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="flex items-center gap-1 text-amber-500 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> 1 Pendente
          </span>
        </div>
      </div>

      {/* 3. Lista de Consultas da Data */}
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-300 dark:hover:border-sky-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/60 font-mono text-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mx-auto mb-0.5" />
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300">{apt.horario}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {apt.paciente}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {apt.tipo} • <span className="italic">{apt.observacao}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                type="button"
                onClick={() => toggleStatus(apt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  apt.status === 'Confirmado'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                    : apt.status === 'Pendente'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
                title="Clique para alternar status"
              >
                {apt.status}
              </button>

              <button
                type="button"
                onClick={() => navigate('/calculadoras/dobras-cutaneas')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Atender</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
