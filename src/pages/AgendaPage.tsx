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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [patientName, setPatientName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-09-04');
  const [appointmentTime, setAppointmentTime] = useState('14:30');
  const [appointmentType, setAppointmentType] = useState('Primeira Consulta & Antropometria');
  const [appointmentNotes, setAppointmentNotes] = useState('');

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

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newAppt: Appointment = {
      id: `a-${Date.now()}`,
      paciente: patientName.trim(),
      data: appointmentDate,
      horario: appointmentTime,
      tipo: appointmentType,
      status: 'Confirmado',
      observacao: appointmentNotes.trim() || 'Consulta agendada',
    };

    setAppointments(prev => [newAppt, ...prev]);
    setIsModalOpen(false);
    setPatientName('');
    setAppointmentNotes('');
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.paciente.toLowerCase().includes(searchFilter.toLowerCase()) ||
    apt.tipo.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Agenda de Atendimentos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              {filteredAppointments.length} Consultas
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerenciamento de horários, confirmações e início imediato de avaliação física.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/calculadoras/dobras-cutaneas')}
            className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Antropometria</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Controle de Datas e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 text-center">
              Sexta-feira, 04 de Setembro de 2026
            </span>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar paciente na agenda..."
              className="w-full sm:w-64 min-h-[44px] px-3.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />{' '}
            {appointments.filter(a => a.status === 'Confirmado').length} Confirmadas
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
            <AlertCircle className="w-4 h-4" />{' '}
            {appointments.filter(a => a.status === 'Pendente').length} Pendentes
          </span>
        </div>
      </div>

      {/* 3. Lista de Consultas da Data */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nenhuma consulta encontrada com esse filtro.
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-300 dark:hover:border-sky-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/60 font-mono text-center shrink-0">
                  <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400 mx-auto mb-0.5" />
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

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => toggleStatus(apt.id)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
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
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Atender</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Mobile-First: Novo Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-5 sm:p-6 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Novo Agendamento Clínico
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Defina paciente, horário e objetivo da consulta.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome do Paciente *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ex.: Mariana Silva"
                  className="w-full min-h-[44px] px-3.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Data da Consulta
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Atendimento
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Primeira Consulta & Antropometria">Primeira Consulta & Antropometria</option>
                  <option value="Retorno & Dobras Cutâneas">Retorno & Dobras Cutâneas</option>
                  <option value="Revisão do Plano Alimentar">Revisão do Plano Alimentar</option>
                  <option value="Antropometria de Atleta">Antropometria de Atleta</option>
                  <option value="Consulta de Bioimpedância">Consulta de Bioimpedância</option>
                  <option value="Retorno Rápido">Retorno Rápido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Observações Clínicas / Foco
                </label>
                <textarea
                  rows={2}
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Ex.: Paciente retornando após 30 dias de bulking limpo."
                  className="w-full min-h-[44px] p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Agendar Consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
