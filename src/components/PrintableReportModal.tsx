import React from 'react';
import {
  Printer,
  X,
  FileDown,
  Activity,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Scale,
  Award,
  Ruler,
  Flame,
  Droplets,
  HeartPulse,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CalculationResult,
  EvaluationRecord,
  PatientInfo,
  PerimetryValues,
  SkinfoldKey,
  SkinfoldValues,
} from '../types';
import { SKINFOLD_DEFINITIONS } from '../data/protocolData';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInfo;
  results: CalculationResult;
  skinfolds: SkinfoldValues;
  perimetry: PerimetryValues;
  protocolName: string;
  allEvaluations: EvaluationRecord[];
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  results,
  skinfolds,
  perimetry,
  protocolName,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const fatPct = results.percentualGordura;
  const leanPct = Number((100 - fatPct).toFixed(1));

  // Physical Activity Level Multipliers for Total Daily Energy Expenditure (GET)
  const getActivityFactor = (level?: string) => {
    switch (level) {
      case 'sedentario':
        return { factor: 1.2, label: 'Sedentário (pouco ou nenhum exercício)' };
      case 'leve':
        return { factor: 1.375, label: 'Leve (exercício leve 1-3 dias/sem)' };
      case 'moderado':
        return { factor: 1.55, label: 'Moderado (treino moderado 3-5 dias/sem)' };
      case 'intenso':
        return { factor: 1.725, label: 'Intenso (treino pesado 6-7 dias/sem)' };
      case 'atleta':
        return { factor: 1.9, label: 'Atleta / Treino duplo (alta demanda)' };
      default:
        return { factor: 1.2, label: 'Sedentário' };
    }
  };

  const activityInfo = getActivityFactor(patient.nivelAtividade);
  const tmbKcal = Math.round(results.tmb);
  const getKcal = Math.round(results.tmb * activityInfo.factor);
  const waterIntakeMl = Math.round(patient.peso * 35);
  const waterIntakeL = (waterIntakeMl / 1000).toFixed(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:bg-white print:backdrop-blur-none"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none animate-in fade-in zoom-in-95">
        
        {/* Modal Top Actions Toolbar (Hidden in Print View) */}
        <div className="px-4 sm:px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600/30 border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-xs shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans leading-tight">
                  Laudo Antropométrico & Relatório (PDF)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Visualização formatada para impressão A4 e entrega ao paciente
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="sm:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 shrink-0"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              id="btn-imprimir-relatorio-modal"
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-full shadow-sm transition-all cursor-pointer active:scale-95"
              title="Abre a caixa de impressão. Escolha 'Salvar como PDF' para exportar o arquivo."
            >
              <Printer className="w-4 h-4" />
              <span>Gerar Relatório PDF / Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="hidden sm:flex w-11 h-11 min-w-[44px] min-h-[44px] rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 shrink-0"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div
          id="printable-report"
          className="p-6 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible text-slate-800 space-y-6 bg-white"
        >
          {/* 1. Header do Laudo Clínico */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 avoid-break">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="report-header-badge px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-sans font-bold tracking-widest uppercase">
                  LAUDO CLÍNICO NUTRICIONAL
                </span>
                <span className="text-xs font-bold font-mono text-sky-800">
                  {protocolName}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
                Relatório de Composição Corporal & Gasto Energético
              </h1>
              <p className="text-xs text-slate-500">
                Avaliação antropométrica computada via adipometria clínica e equações preditivas validadas.
              </p>
            </div>

            <div className="text-right text-xs space-y-1 sm:self-center font-mono shrink-0">
              <div className="text-slate-500">Data da Consulta:</div>
              <div className="font-bold text-slate-900 text-sm">
                {patient.dataAvaliacao
                  ? new Date(patient.dataAvaliacao + 'T00:00:00').toLocaleDateString('pt-BR')
                  : new Date().toLocaleDateString('pt-BR')}
              </div>
              <div className="text-slate-700 text-[11px] font-sans font-semibold">
                {patient.avaliador || 'Nutricionista Responsável'}
              </div>
            </div>
          </div>

          {/* 2. Dados de Identificação do Paciente */}
          <div className="report-metric-card bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-700" />
              <span>1. Identificação do Paciente & Dados Clínicos</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Nome do Paciente:</span>
                <strong className="text-slate-900 text-sm font-semibold block truncate">
                  {patient.nome || 'Não informado'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sexo / Idade:</span>
                <strong className="text-slate-900">
                  {patient.sexo === 'masculino' ? 'Masculino' : 'Feminino'}, {patient.idade} anos
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Peso / Estatura:</span>
                <strong className="text-slate-900 font-mono">
                  {patient.peso.toFixed(1)} kg | {patient.altura.toFixed(1)} cm
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">IMC / Classificação OMS:</span>
                <strong className="text-slate-900 font-mono">
                  {results.imc.toFixed(2)} kg/m² ({results.imcClassificacao})
                </strong>
              </div>
            </div>
          </div>

          {/* 3. Composição Corporal & Fracionamento Tecidual */}
          <div className="avoid-break space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-sky-700" />
              <span>2. Fracionamento da Composição Corporal</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 report-header-badge">
                <span className="text-[10px] uppercase font-mono text-sky-300 block font-bold">
                  % Gordura Corporal
                </span>
                <div className="text-2xl font-bold font-mono mt-1">
                  {results.percentualGordura.toFixed(1)}%
                </div>
                <span className="text-[10px] text-sky-200 block truncate mt-1">
                  {results.gorduraClassificacao}
                </span>
              </div>

              <div className="report-metric-card p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold">
                  Massa Gorda (Adiposa)
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {results.massaGordaKg.toFixed(1)} kg
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {results.percentualGordura.toFixed(1)}% do peso corporal
                </span>
              </div>

              <div className="report-metric-card p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold">
                  Massa Livre de Gordura (Magra)
                </span>
                <div className="text-xl font-bold font-mono text-sky-800 mt-1">
                  {results.massaLivreGorduraKg.toFixed(1)} kg
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {leanPct.toFixed(1)}% muscular/esquelética
                </span>
              </div>

              <div className="report-metric-card p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold">
                  Densidade Corporal & Soma
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {results.densidadeCorporal.toFixed(5)}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Soma das dobras: {results.somaDobras.toFixed(1)} mm
                </span>
              </div>
            </div>

            {/* Barra Horizontal Visual de Distribuição */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1.5 font-sans">
                <span>Distribuição Percentual de Tecidos</span>
                <span>Peso Total: <strong>{patient.peso.toFixed(1)} kg</strong></span>
              </div>
              <div className="w-full h-6 bg-slate-200 rounded-xl overflow-hidden flex font-mono text-[11px] font-bold text-white shadow-inner">
                <div
                  style={{ width: `${leanPct}%` }}
                  className="bg-sky-700 h-full flex items-center justify-center truncate px-2"
                >
                  Massa Magra: {results.massaLivreGorduraKg.toFixed(1)} kg ({leanPct}%)
                </div>
                <div
                  style={{ width: `${fatPct}%` }}
                  className="bg-amber-500 h-full flex items-center justify-center text-slate-900 truncate px-2"
                >
                  Gordura: {results.massaGordaKg.toFixed(1)} kg ({fatPct}%)
                </div>
              </div>
            </div>
          </div>

          {/* 4. Taxa Metabólica Basal (TMB) & Gasto Energético Total (GET) */}
          <div className="report-metric-card bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Taxa Metabólica Basal (TMB) & Gasto Energético</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans font-normal lowercase">
                Harris-Benedict Revisada (Roza & Shizgal, 1984)
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {/* TMB */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold">
                  Taxa Metabólica Basal (TMB)
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {tmbKcal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-500">kcal/dia</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Energia necessária em repouso absoluto
                </span>
              </div>

              {/* GET / VET */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-sky-700 block font-bold">
                  Gasto Energético Estimado (GET)
                </span>
                <div className="text-2xl font-bold font-mono text-sky-900 mt-1">
                  {getKcal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-500">kcal/dia</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Fator {activityInfo.factor}x • {activityInfo.label}
                </span>
              </div>

              {/* Hidratação */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-500" />
                  Meta Hídrica Diária
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {waterIntakeL} <span className="text-xs font-normal text-slate-500">litros/dia</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Base recomendada: 35 ml/kg de peso corporal
                </span>
              </div>
            </div>

            {/* Faixas de Balanço Calórico Estratégico */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-xl">
                <span className="font-bold text-amber-900 block font-sans">Emagrecimento / Déficit:</span>
                <span className="text-amber-800 font-bold text-xs">{Math.round(getKcal - 400)} kcal</span>
                <span className="text-slate-500 block text-[10px] font-sans">Déficit calórico de -400 kcal</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl">
                <span className="font-bold text-emerald-900 block font-sans">Manutenção Energética:</span>
                <span className="text-emerald-800 font-bold text-xs">{getKcal} kcal</span>
                <span className="text-slate-500 block text-[10px] font-sans">Equilíbrio de peso atual</span>
              </div>
              <div className="bg-sky-50/70 border border-sky-200 p-2.5 rounded-xl">
                <span className="font-bold text-sky-900 block font-sans">Hipertrofia / Superávit:</span>
                <span className="text-sky-800 font-bold text-xs">{Math.round(getKcal + 350)} kcal</span>
                <span className="text-slate-500 block text-[10px] font-sans">Superávit limpo de +350 kcal</span>
              </div>
            </div>
          </div>

          {/* 5. Tabela de Dobras Cutâneas & Perimetria Lado a Lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 avoid-break">
            {/* Dobras */}
            <div className="report-metric-card border border-slate-200/90 rounded-2xl p-5 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-sky-700" />
                <span>4. Dobras Cutâneas Aferidas (mm)</span>
              </h4>
              <table className="w-full text-xs divide-y divide-slate-200 font-mono">
                <thead>
                  <tr className="text-slate-500 text-[10px]">
                    <th className="text-left py-1.5 font-semibold">Ponto Anatômico</th>
                    <th className="text-right py-1.5 font-semibold">Medida (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.dobrasUtilizadas.map((key) => {
                    const def = SKINFOLD_DEFINITIONS[key];
                    const val = skinfolds[key];
                    return (
                      <tr key={key}>
                        <td className="py-1.5 text-slate-800 font-sans font-medium">{def?.name || key}</td>
                        <td className="py-1.5 text-right font-bold text-slate-900">
                          {val != null ? `${Number(val).toFixed(1)} mm` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold bg-slate-50/80">
                    <td className="py-2 text-slate-900 font-sans">SOMATÓRIO TOTAL</td>
                    <td className="py-2 text-right text-slate-900 font-mono">
                      {results.somaDobras.toFixed(1)} mm
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Perimetria & RCQ */}
            <div className="report-metric-card border border-slate-200/90 rounded-2xl p-5 bg-white flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-sky-700" />
                  <span>5. Perimetria & Circunferências (cm)</span>
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-mono">
                  {perimetry.cintura && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Cintura:</span>
                      <strong className="text-slate-900">{perimetry.cintura} cm</strong>
                    </div>
                  )}
                  {perimetry.quadril && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Quadril:</span>
                      <strong className="text-slate-900">{perimetry.quadril} cm</strong>
                    </div>
                  )}
                  {perimetry.torax && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Tórax:</span>
                      <strong className="text-slate-900">{perimetry.torax} cm</strong>
                    </div>
                  )}
                  {perimetry.abdomen && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Abdômen:</span>
                      <strong className="text-slate-900">{perimetry.abdomen} cm</strong>
                    </div>
                  )}
                  {perimetry.bracoDireito && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Braço D:</span>
                      <strong className="text-slate-900">{perimetry.bracoDireito} cm</strong>
                    </div>
                  )}
                  {perimetry.coxaDireita && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Coxa D:</span>
                      <strong className="text-slate-900">{perimetry.coxaDireita} cm</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Relação Cintura / Quadril Box */}
              {results.rcq && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 font-sans">Relação Cintura/Quadril (RCQ):</span>
                    <strong className="font-mono text-sky-800 text-sm">{results.rcq.toFixed(3)}</strong>
                  </div>
                  <span className="text-[11px] text-slate-600 block">
                    Classificação de Risco Cardiovascular: <strong className="text-slate-900">{results.rcqClassificacao}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 6. Resumo Clínico & Conduta Nutricional */}
          <div className="report-metric-card border border-slate-200/90 rounded-2xl p-5 bg-white avoid-break">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>6. Resumo Clínico & Orientações Nutricionais ao Paciente</span>
            </h4>
            <div className="text-xs text-slate-800 leading-relaxed min-h-[70px] whitespace-pre-wrap bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
              {patient.observacoes ||
                'Paciente avaliado segundo protocolo antropométrico padronizado. Recomenda-se plano alimentar balanceado focado na preservação e ganho de massa magra, controle do balanço calórico diário de acordo com o GET calculado e acompanhamento da evolução em reavaliação programada em 45 a 60 dias.'}
            </div>
          </div>

          {/* 7. Metodologia Científica & Fórmulas */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 font-mono space-y-1 avoid-break">
            <div>
              <strong>Equação de Densidade Corporal:</strong> {results.equacaoNome} — {results.equacaoFormula}
            </div>
            <div>
              <strong>Conversão DC → %G:</strong> {results.conversaoFormula}
            </div>
          </div>

          {/* 8. Assinatura Profissional & Conformidade LGPD */}
          <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-end justify-between gap-6 avoid-break">
            <div className="text-[10px] text-slate-500 max-w-sm leading-tight">
              <strong>Declaração de Conformidade LGPD:</strong> Dados antropométricos e de saúde tratados sob consentimento estrito para planejamento alimentar e acompanhamento clínico (Art. 7º e 11 da Lei 13.709/2018).
            </div>

            <div className="text-center w-64">
              <div className="border-b border-slate-400 pb-1 mb-1"></div>
              <strong className="text-xs font-bold text-slate-900 block">
                {patient.avaliador || 'Nutricionista Responsável'}
              </strong>
              <span className="text-[11px] text-slate-600">Assinatura & Carimbo Profissional (CRN)</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Print Button Footer (Hidden in Print View) */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden shrink-0">
          <span className="text-xs text-slate-500 text-center sm:text-left">
            Dica: Ao abrir a janela do navegador, selecione <strong>&quot;Salvar como PDF&quot;</strong> para exportar o arquivo pronto para envio via WhatsApp ou E-mail.
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-full cursor-pointer transition-colors active:scale-95 text-center flex items-center justify-center"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-full shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Gerar Relatório PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
