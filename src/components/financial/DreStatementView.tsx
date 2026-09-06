import React, { useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Share2,
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  FinancialTransaction,
  generateDreStructure,
  formatCurrencyBRL
} from '../../data/financialData';

interface DreStatementViewProps {
  transactions: FinancialTransaction[];
  periodLabel?: string;
}

export const DreStatementView: React.FC<DreStatementViewProps> = ({
  transactions,
  periodLabel = 'Competência Setembro / 2026'
}) => {
  const dreItems = useMemo(() => {
    return generateDreStructure(transactions);
  }, [transactions]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Codigo;Descricao;Valor_BRL;Percentual_Receita_Bruta\n';
    dreItems.forEach(item => {
      csvContent += `"${item.code}";"${item.name}";"${item.value.toFixed(2)}";"${item.percentage.toFixed(1)}%"\n`;
      if (item.children) {
        item.children.forEach(child => {
          csvContent += `"${child.code}";"${child.name}";"${child.value.toFixed(2)}";"${child.percentage.toFixed(1)}%"\n`;
        });
      }
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DRE_Gerencial_Clinica_Vitall_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Cabeçalho do DRE */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-white">
              Demonstrativo de Resultados do Exercício (DRE Gerencial Clínico)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {periodLabel} • Regime de Competência & Caixa Integrados com cálculo de EBITDA e Margens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exportar CSV / Excel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            Imprimir DRE
          </button>
        </div>
      </div>

      {/* Tabela Estruturada do DRE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-5 w-20">Código</th>
                <th className="py-3 px-5">Estrutura Contábil / Linha do Demonstrativo</th>
                <th className="py-3 px-5 text-right w-44">Valor Realizado (R$)</th>
                <th className="py-3 px-5 text-right w-28">Análise Vertical (% Rec. Bruta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dreItems.map((item) => {
                const isHeader = item.type === 'header';
                const isResult = item.type === 'result';
                const isDeductionOrCost = item.type === 'deduction' || item.type === 'cost' || item.type === 'expense';

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`transition-colors ${
                        isResult
                          ? 'bg-emerald-950/40 font-black text-emerald-300'
                          : isHeader
                          ? 'bg-slate-950/60 font-bold text-white'
                          : 'hover:bg-slate-800/40 text-slate-200'
                      }`}
                    >
                      <td className="py-3 px-5 text-slate-400 font-semibold">{item.code}</td>
                      <td className="py-3 px-5">
                        <span className={`tracking-wide ${isResult || isHeader ? 'text-white uppercase font-extrabold' : 'text-slate-300'}`}>
                          {item.name}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-black text-sm">
                        <span className={isDeductionOrCost ? 'text-rose-400' : isResult ? 'text-emerald-400 text-base' : 'text-white'}>
                          {isDeductionOrCost ? '-' : ''} {formatCurrencyBRL(item.value)}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-bold text-slate-300">
                        {item.percentage.toFixed(1)}%
                      </td>
                    </tr>

                    {/* Linhas Filhas / Subcontas */}
                    {item.children &&
                      item.children.map((child) => (
                        <tr key={child.id} className="hover:bg-slate-800/30 text-slate-400 text-[11px]">
                          <td className="py-2.5 px-5 text-slate-500 pl-8">{child.code}</td>
                          <td className="py-2.5 px-5 pl-10 text-slate-300">
                            • {child.name}
                          </td>
                          <td className="py-2.5 px-5 text-right font-mono text-slate-300">
                            {formatCurrencyBRL(child.value)}
                          </td>
                          <td className="py-2.5 px-5 text-right font-mono text-slate-400">
                            {child.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota de Auditoria e Conformidade Contábil */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Nota Fiscal & Contábil:</strong> Este demonstrativo segue as diretrizes do Conselho Federal de Nutrição (CFN) e da Receita Federal do Brasil (Carnê-Leão e Simples Nacional). Os tributos diretos foram estimados com base na faixa inicial do Anexo III do Simples Nacional (6,0%) e as taxas de cartão/gateway estimadas na média consolidada de 3,2%.
        </p>
      </div>
    </div>
  );
};
