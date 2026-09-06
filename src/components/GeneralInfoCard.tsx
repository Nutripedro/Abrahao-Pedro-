import React from 'react';
import { User, Scale, Ruler, Calendar, Activity, Info } from 'lucide-react';
import { ActivityLevel, Gender, PatientInfo } from '../types';

interface GeneralInfoCardProps {
  patient: PatientInfo;
  onChange: (updates: Partial<PatientInfo>) => void;
  imc: number;
  imcClassificacao: string;
}

export const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({
  patient,
  onChange,
  imc,
  imcClassificacao,
}) => {
  // Helpers for age from birth date if changed
  const handleBirthDateChange = (val: string) => {
    onChange({ dataNascimento: val });
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age > 0 && age < 120) {
        onChange({ idade: age, dataNascimento: val });
      }
    }
  };

  const getImcBadgeColor = (classificacao: string) => {
    switch (classificacao) {
      case 'Eutrofia':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Baixo peso':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Sobrepeso':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div id="card-informacoes-gerais" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 transition-all">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shadow-2xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-sans">
              Informações Gerais do Avaliado
            </h2>
            <span className="text-xs text-slate-500">Dados Antropométricos Básicos</span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          Paciente
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nome do Paciente */}
        <div className="sm:col-span-2">
          <label htmlFor="input-nome-paciente" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nome Completo do Cliente / Paciente <span className="text-rose-500">*</span>
          </label>
          <input
            id="input-nome-paciente"
            type="text"
            value={patient.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            placeholder="Ex: João da Silva Santos"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Sexo Biológico */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Sexo Biológico <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-sexo-masculino"
              type="button"
              onClick={() => onChange({ sexo: 'masculino' })}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                patient.sexo === 'masculino'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Masculino</span>
            </button>
            <button
              id="btn-sexo-feminino"
              type="button"
              onClick={() => onChange({ sexo: 'feminino' })}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                patient.sexo === 'feminino'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Feminino</span>
            </button>
          </div>
        </div>

        {/* Idade */}
        <div>
          <label htmlFor="input-idade" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Idade (anos) <span className="text-rose-500">*</span>
          </label>
          <input
            id="input-idade"
            type="number"
            min={10}
            max={100}
            value={patient.idade || ''}
            onChange={(e) => onChange({ idade: Number(e.target.value) || 0 })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 font-mono"
          />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label htmlFor="input-data-nascimento" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Data de Nascimento
          </label>
          <div className="relative">
            <input
              id="input-data-nascimento"
              type="date"
              value={patient.dataNascimento || ''}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Peso Atual (kg) */}
        <div>
          <label htmlFor="input-peso-atual" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Peso Atual (kg) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="input-peso-atual"
              type="number"
              step="0.1"
              min={25}
              max={300}
              value={patient.peso || ''}
              onChange={(e) => onChange({ peso: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 72.5"
              className="w-full pl-3.5 pr-9 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 font-mono"
            />
            <span className="absolute right-3.5 top-3 text-xs font-medium text-slate-500 pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Altura (cm) */}
        <div>
          <label htmlFor="input-altura" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Altura (cm) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="input-altura"
              type="number"
              step="0.5"
              min={100}
              max={250}
              value={patient.altura || ''}
              onChange={(e) => onChange({ altura: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 175"
              className="w-full pl-3.5 pr-9 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 font-mono"
            />
            <span className="absolute right-3.5 top-3 text-xs font-medium text-slate-500 pointer-events-none">
              cm
            </span>
          </div>
        </div>

        {/* Nível de Atividade Física */}
        <div>
          <label htmlFor="select-nivel-atividade" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nível de Atividade Física
          </label>
          <select
            id="select-nivel-atividade"
            value={patient.nivelAtividade}
            onChange={(e) => onChange({ nivelAtividade: e.target.value as ActivityLevel })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
          >
            <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
            <option value="leve">Leve (exercício 1-3 dias/sem)</option>
            <option value="moderado">Moderado (exercício 3-5 dias/sem)</option>
            <option value="intenso">Intenso (exercício 6-7 dias/sem)</option>
            <option value="atleta">Atleta de Alto Rendimento</option>
          </select>
        </div>

        {/* Avaliador / Profissional */}
        <div>
          <label htmlFor="input-avaliador" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Profissional Avaliador(a) / CRN
          </label>
          <input
            id="input-avaliador"
            type="text"
            value={patient.avaliador}
            onChange={(e) => onChange({ avaliador: e.target.value })}
            placeholder="Ex: Nutricionista João Silva - CRN 12345"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Data da Avaliação */}
        <div>
          <label htmlFor="input-data-avaliacao" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Data da Consulta / Avaliação
          </label>
          <input
            id="input-data-avaliacao"
            type="date"
            value={patient.dataAvaliacao}
            onChange={(e) => onChange({ dataAvaliacao: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 font-mono"
          />
        </div>
      </div>

      {/* Bento Inner Box: Cálculo Automático do IMC */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-100 text-sky-800 rounded-xl flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-600 block">Cálculo Automático de IMC:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {imc > 0 ? `${imc.toFixed(2)} kg/m²` : '—'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                (Peso / Altura²)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Classificação:</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getImcBadgeColor(imcClassificacao)}`}>
            {imcClassificacao}
          </span>
        </div>
      </div>
    </div>
  );
};
