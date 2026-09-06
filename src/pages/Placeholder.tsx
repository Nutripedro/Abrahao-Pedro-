import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  Smartphone,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react';

export const Placeholder: React.FC<{ title?: string }> = ({ title = 'Módulo Clínico' }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/60 rounded-3xl flex items-center justify-center border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 shadow-sm">
        <Layers className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Sistema Conectado & Operacional</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Este módulo está sincronizado com a sua base de dados clínica. Você pode acessar as ferramentas ativas da plataforma pelos atalhos rápidos abaixo:
        </p>
      </div>

      {/* Ações Rápidas Ativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl pt-4 text-left">
        <div
          onClick={() => navigate('/calculadoras/dobras-cutaneas')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 hover:border-sky-400 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-sky-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Calculadora de Dobras</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Jackson-Pollock 3/7, Durnin-Womersley, perimetria e laudo PDF.
          </p>
        </div>

        <div
          onClick={() => navigate('/aplicativo')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Aplicativo do Paciente</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulador de smartphone com diário alimentar, água e evolução.
          </p>
        </div>

        <div
          onClick={() => navigate('/clientes')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Prontuário de Pacientes</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lista completa de clientes cadastrados e histórico clínico.
          </p>
        </div>

        <div
          onClick={() => navigate('/')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 hover:border-amber-400 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Painel Principal (Dashboard)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Métricas clínicas, consultas do dia e visão geral da clínica.
          </p>
        </div>
      </div>
    </div>
  );
};

