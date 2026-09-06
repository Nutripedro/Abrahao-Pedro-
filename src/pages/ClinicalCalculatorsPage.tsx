import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Calculator,
  Flame,
  Activity,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react';

export const ClinicalCalculatorsPage: React.FC<{ initialTab?: 'tmb' | 'imc' | 'macros' }> = ({
  initialTab = 'tmb'
}) => {
  const navigate = useNavigate();
  const [activeCalc, setActiveCalc] = useState<'tmb' | 'imc' | 'macros'>(initialTab);

  // TMB & GET Inputs
  const [sexo, setSexo] = useState<'M' | 'F'>('F');
  const [idade, setIdade] = useState<number>(28);
  const [peso, setPeso] = useState<number>(62.8);
  const [altura, setAltura] = useState<number>(165);
  const [formula, setFormula] = useState<'mifflin' | 'harris'>('mifflin');
  const [fatorAtividade, setFatorAtividade] = useState<number>(1.55); // moderado
  const [objetivo, setObjetivo] = useState<'manutencao' | 'emagrecimento' | 'hipertrofia'>('emagrecimento');

  // Calculations
  // Mifflin-St Jeor
  // Homens: 10 * peso + 6.25 * altura - 5 * idade + 5
  // Mulheres: 10 * peso + 6.25 * altura - 5 * idade - 161
  let tmbMifflin = 10 * peso + 6.25 * altura - 5 * idade + (sexo === 'M' ? 5 : -161);

  // Harris-Benedict (1984)
  // Homens: 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
  // Mulheres: 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade)
  let tmbHarris =
    sexo === 'M'
      ? 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade
      : 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * idade;

  const tmb = Math.round(formula === 'mifflin' ? tmbMifflin : tmbHarris);
  const get = Math.round(tmb * fatorAtividade);

  let caloriasAlvo = get;
  if (objetivo === 'emagrecimento') caloriasAlvo = Math.round(get - 400);
  if (objetivo === 'hipertrofia') caloriasAlvo = Math.round(get + 350);

  // IMC
  const alturaM = altura / 100;
  const imc = Number((peso / (alturaM * alturaM)).toFixed(2));
  let imcClassificacao = 'Eutrofia (Normal)';
  let imcCor = 'text-emerald-500';
  if (imc < 18.5) {
    imcClassificacao = 'Baixo Peso';
    imcCor = 'text-amber-500';
  } else if (imc >= 25 && imc < 30) {
    imcClassificacao = 'Sobrepeso';
    imcCor = 'text-amber-500';
  } else if (imc >= 30) {
    imcClassificacao = 'Obesidade';
    imcCor = 'text-rose-500';
  }

  // Peso Ideal (Devine)
  // Homens: 50 + 2.3 * (alturaPol - 60)
  // Mulheres: 45.5 + 2.3 * (alturaPol - 60)
  const alturaPol = altura / 2.54;
  const pesoIdealDevine = Math.round(
    sexo === 'M'
      ? 50 + 2.3 * (alturaPol - 60)
      : 45.5 + 2.3 * (alturaPol - 60)
  );

  // Macros (para caloriasAlvo)
  // Proteína: 2.0 g/kg
  const protG = Math.round(peso * 2.0);
  const protKcal = protG * 4;
  // Gordura: 0.8 g/kg
  const gordG = Math.round(peso * 0.8);
  const gordKcal = gordG * 9;
  // Carbo: restante
  const carboKcal = Math.max(0, caloriasAlvo - protKcal - gordKcal);
  const carboG = Math.round(carboKcal / 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Calculadoras Clínicas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Metabolismo & Nutrição
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cálculo de Taxa Metabólica Basal, Gasto Energético Total, IMC e Distribuição de Macros.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/calculadoras/dobras-cutaneas')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-105"
        >
          <Scale className="w-4 h-4" />
          <span>Calculadora de Dobras Cutâneas</span>
        </button>
      </div>

      {/* 2. Seleção de Abas */}
      <div className="flex flex-wrap sm:flex-nowrap border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCalc('tmb')}
          className={`min-h-[44px] px-2 pb-2 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeCalc === 'tmb'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>TMB & Gasto Energético (GET)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCalc('imc')}
          className={`min-h-[44px] px-2 pb-2 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeCalc === 'imc'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>IMC & Peso Ideal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCalc('macros')}
          className={`min-h-[44px] px-2 pb-2 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeCalc === 'macros'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Distribuição de Macronutrientes</span>
        </button>
      </div>

      {/* 3. Painel de Entradas Compartilhado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Entradas (5 colunas) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Dados do Paciente</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Sexo Biológico
              </label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as 'M' | 'F')}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Idade (anos)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Estatura (cm)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Fórmula de TMB
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value as 'mifflin' | 'harris')}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="mifflin">Mifflin-St Jeor (Padrão Ouro Atual)</option>
              <option value="harris">Harris-Benedict (Revisada 1984)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Nível de Atividade Física (NAF)
            </label>
            <select
              value={fatorAtividade}
              onChange={(e) => setFatorAtividade(Number(e.target.value))}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="1.2">Sedentário (pouco ou nenhum exercício) • 1.20</option>
              <option value="1.375">Leve (exercício 1 a 3 dias/sem) • 1.375</option>
              <option value="1.55">Moderado (exercício 3 a 5 dias/sem) • 1.55</option>
              <option value="1.725">Intenso (exercício 6 a 7 dias/sem) • 1.725</option>
              <option value="1.9">Extremo / Atleta de Alta Performance • 1.90</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Objetivo Nutricional
            </label>
            <select
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value as any)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="emagrecimento">Emagrecimento (Déficit Calórico ~400 kcal)</option>
              <option value="manutencao">Manutenção do Peso Atual</option>
              <option value="hipertrofia">Ganho de Massa Muscular (+350 kcal)</option>
            </select>
          </div>
        </div>

        {/* Resultados Calculados (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">TMB (Basal)</span>
              <span className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">{tmb}</span>
              <span className="text-xs text-slate-400 block mt-0.5">kcal / dia</span>
            </div>

            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">GET (Gasto Total)</span>
              <span className="text-2xl font-bold font-mono text-amber-500">{get}</span>
              <span className="text-xs text-slate-400 block mt-0.5">kcal / dia</span>
            </div>

            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Prescrição Alvo</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{caloriasAlvo}</span>
              <span className="text-xs text-slate-400 block mt-0.5">kcal / dia</span>
            </div>
          </div>

          {/* Card Detalhado de Macronutrientes */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Distribuição Sugerida de Macronutrientes</span>
              <span className="text-xs font-mono text-slate-400">{caloriasAlvo} kcal total</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Proteínas (2.0g/kg)</span>
                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">{protG} g</span>
                <span className="text-[11px] text-emerald-600/80 block mt-0.5">{protKcal} kcal ({Math.round((protKcal / caloriasAlvo) * 100)}%)</span>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300 block">Carboidratos</span>
                <span className="text-xl font-bold font-mono text-sky-700 dark:text-sky-400">{carboG} g</span>
                <span className="text-[11px] text-sky-600/80 block mt-0.5">{carboKcal} kcal ({Math.round((carboKcal / caloriasAlvo) * 100)}%)</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Lipídios (0.8g/kg)</span>
                <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400">{gordG} g</span>
                <span className="text-[11px] text-amber-600/80 block mt-0.5">{gordKcal} kcal ({Math.round((gordKcal / caloriasAlvo) * 100)}%)</span>
              </div>
            </div>
          </div>

          {/* Card IMC e Peso Ideal */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Índice de Massa Corporal (IMC) & Peso Ideal</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  IMC: {imc} kg/m²
                </p>
                <p className={`text-xs font-bold ${imcCor} mt-0.5`}>Classificação OMS: {imcClassificacao}</p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-6">
                <p className="text-xs text-slate-400">Peso Teórico de Referência (Devine):</p>
                <p className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400">{pesoIdealDevine} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
