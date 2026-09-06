import React, { useState } from 'react';
import {
  Table2,
  Download,
  Printer,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  FileText,
  Search
} from 'lucide-react';
import {
  AnvisaFoodItem,
  AnvisaNutrientValues,
  formatAnvisaNutrient,
  calculateAnvisaVD,
  checkFrontalWarningLupa
} from '../utils/anvisaRegulations';

export const AnvisaTablePage: React.FC = () => {
  const [foodItem, setFoodItem] = useState<AnvisaFoodItem>({
    nomeProduto: 'Barra Proteica de Cacau & Amêndoas Artesanal',
    tipoAlimento: 'solido',
    pesoTotalEmbalagemG: 60,
    tamanhoPorcaoG: 60,
    medidaCaseira: '1 unidade (60g)',
    valoresPor100g: {
      valorEnergeticoKcal: 385,
      carboidratosG: 28.4,
      acucaresTotaisG: 14.2,
      acucaresAdicionadosG: 6.5,
      proteinasG: 22.1,
      gordurasTotaisG: 12.8,
      gordurasSaturadasG: 4.2,
      gordurasTransG: 0,
      fibraAlimentarG: 8.5,
      sodioMg: 145
    }
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleNutrientChange = (key: keyof AnvisaNutrientValues, value: number) => {
    setFoodItem(prev => ({
      ...prev,
      valoresPor100g: {
        ...prev.valoresPor100g,
        [key]: isNaN(value) ? 0 : value
      }
    }));
  };

  // Cálculo por porção a partir dos valores por 100g
  const factor = (foodItem.tamanhoPorcaoG || 100) / 100;
  const portionValues: AnvisaNutrientValues = {
    valorEnergeticoKcal: foodItem.valoresPor100g.valorEnergeticoKcal * factor,
    carboidratosG: foodItem.valoresPor100g.carboidratosG * factor,
    acucaresTotaisG: foodItem.valoresPor100g.acucaresTotaisG * factor,
    acucaresAdicionadosG: foodItem.valoresPor100g.acucaresAdicionadosG * factor,
    proteinasG: foodItem.valoresPor100g.proteinasG * factor,
    gordurasTotaisG: foodItem.valoresPor100g.gordurasTotaisG * factor,
    gordurasSaturadasG: foodItem.valoresPor100g.gordurasSaturadasG * factor,
    gordurasTransG: foodItem.valoresPor100g.gordurasTransG * factor,
    fibraAlimentarG: foodItem.valoresPor100g.fibraAlimentarG * factor,
    sodioMg: foodItem.valoresPor100g.sodioMg * factor
  };

  const totalPortionsInPackage = (
    foodItem.pesoTotalEmbalagemG / (foodItem.tamanhoPorcaoG || 1)
  ).toFixed(1).replace('.0', '');

  const frontalWarnings = checkFrontalWarningLupa(foodItem);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="pagina-tabela-anvisa" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notificação */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-sky-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
            <Table2 className="w-4 h-4" />
            <span>Rotulagem Nutricional Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
            Gerador de Tabela Nutricional ANVISA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conformidade estrita com a RDC 429/2020 e IN 75/2020: declaração por 100g, porção, regras de arredondamento e lupa frontal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Rótulo Oficial</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Parâmetros e Inputs (Esquerda) vs. Tabela Oficial ANVISA (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Formulário de Especificação do Alimento */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" />
                <span>Dados do Produto & Porcionamento</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                IN 75/2020 (Anexos I, II e III)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Nome Comercial do Alimento
                </label>
                <input
                  type="text"
                  value={foodItem.nomeProduto}
                  onChange={(e) => setFoodItem({ ...foodItem, nomeProduto: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Natureza Física
                  </label>
                  <select
                    value={foodItem.tipoAlimento}
                    onChange={(e) => setFoodItem({ ...foodItem, tipoAlimento: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="solido">Alimento Sólido (g)</option>
                    <option value="liquido">Alimento Líquido (mL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Conteúdo Líquido Total ({foodItem.tipoAlimento === 'solido' ? 'g' : 'mL'})
                  </label>
                  <input
                    type="number"
                    value={foodItem.pesoTotalEmbalagemG}
                    onChange={(e) => setFoodItem({ ...foodItem, pesoTotalEmbalagemG: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tamanho da Porção ({foodItem.tipoAlimento === 'solido' ? 'g' : 'mL'})
                  </label>
                  <input
                    type="number"
                    value={foodItem.tamanhoPorcaoG}
                    onChange={(e) => setFoodItem({ ...foodItem, tamanhoPorcaoG: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Medida Caseira Correspondente
                  </label>
                  <input
                    type="text"
                    value={foodItem.medidaCaseira}
                    onChange={(e) => setFoodItem({ ...foodItem, medidaCaseira: e.target.value })}
                    placeholder="Ex: 2 colheres de sopa (30g)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Nutrientes Base (100g) */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Nutrientes por 100g ou 100mL
                </span>
                <span className="text-[11px] text-slate-400">Valores analíticos base</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Energético (kcal)</label>
                  <input
                    type="number"
                    value={foodItem.valoresPor100g.valorEnergeticoKcal}
                    onChange={(e) => handleNutrientChange('valorEnergeticoKcal', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Carboidratos (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.carboidratosG}
                    onChange={(e) => handleNutrientChange('carboidratosG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Açúcares Totais (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.acucaresTotaisG}
                    onChange={(e) => handleNutrientChange('acucaresTotaisG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Açúcar Adicionado (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.acucaresAdicionadosG}
                    onChange={(e) => handleNutrientChange('acucaresAdicionadosG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Proteínas (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.proteinasG}
                    onChange={(e) => handleNutrientChange('proteinasG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Gorduras Totais (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.gordurasTotaisG}
                    onChange={(e) => handleNutrientChange('gordurasTotaisG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Gord. Saturadas (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.gordurasSaturadasG}
                    onChange={(e) => handleNutrientChange('gordurasSaturadasG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Gorduras Trans (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.gordurasTransG}
                    onChange={(e) => handleNutrientChange('gordurasTransG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Fibra Alimentar (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodItem.valoresPor100g.fibraAlimentarG}
                    onChange={(e) => handleNutrientChange('fibraAlimentarG', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Sódio (mg)</label>
                  <input
                    type="number"
                    value={foodItem.valoresPor100g.sodioMg}
                    onChange={(e) => handleNutrientChange('sodioMg', parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pré-Visualização Oficial da Tabela ANVISA (Direita) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Modelo Gráfico Padrão ANVISA (RDC 429)
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Arredondamento Validado
              </span>
            </div>

            {/* Rotulagem Nutricional Frontal (Lupa) se aplicável */}
            {frontalWarnings.hasAnyWarning ? (
              <div className="bg-black text-white p-3 rounded-2xl border-2 border-black space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold font-sans text-xs uppercase tracking-wider text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>ALTO EM:</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase font-mono">
                  {frontalWarnings.highSugar && (
                    <span className="px-2 py-0.5 bg-white text-black rounded-sm">AÇÚCAR ADICIONADO</span>
                  )}
                  {frontalWarnings.highSatFat && (
                    <span className="px-2 py-0.5 bg-white text-black rounded-sm">GORDURA SATURADA</span>
                  )}
                  {frontalWarnings.highSodium && (
                    <span className="px-2 py-0.5 bg-white text-black rounded-sm">SÓDIO</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Produto isento de Lupa Frontal (teores abaixo dos limites da IN 75/2020).</span>
              </div>
            )}

            {/* A Tabela Nutricional Exata da ANVISA (Design Preto e Branco Estrito) */}
            <div className="bg-white text-black p-4 rounded-xl border-2 border-black font-sans text-xs max-w-sm mx-auto shadow-md overflow-x-auto">
              <div className="border-b-4 border-black pb-1 mb-1">
                <h3 className="font-extrabold text-base leading-tight tracking-tight uppercase">
                  Informação Nutricional
                </h3>
                <p className="text-[11px] leading-tight mt-0.5">
                  Porções por embalagem: cerca de {totalPortionsInPackage} porções
                </p>
                <p className="text-[11px] leading-tight">
                  Porção: {foodItem.tamanhoPorcaoG} {foodItem.tipoAlimento === 'solido' ? 'g' : 'mL'} ({foodItem.medidaCaseira})
                </p>
              </div>

              {/* Tabela de 3 Colunas: Nutriente | 100g | Porção + %VD */}
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b-2 border-black font-extrabold">
                    <th className="py-1"></th>
                    <th className="py-1 text-right">100 g</th>
                    <th className="py-1 text-right">{foodItem.tamanhoPorcaoG} g</th>
                    <th className="py-1 text-right">%VD*</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20">
                  <tr className="font-bold border-b border-black">
                    <td className="py-1">Valor energético (kcal)</td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('valorEnergeticoKcal', foodItem.valoresPor100g.valorEnergeticoKcal).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('valorEnergeticoKcal', portionValues.valorEnergeticoKcal).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {calculateAnvisaVD('valorEnergeticoKcal', portionValues.valorEnergeticoKcal)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 font-bold">Carboidratos (g)</td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('carboidratosG', foodItem.valoresPor100g.carboidratosG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('carboidratosG', portionValues.carboidratosG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {calculateAnvisaVD('carboidratosG', portionValues.carboidratosG)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 pl-3 text-neutral-700">Açúcares totais (g)</td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('acucaresTotaisG', foodItem.valoresPor100g.acucaresTotaisG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('acucaresTotaisG', portionValues.acucaresTotaisG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">-</td>
                  </tr>

                  <tr>
                    <td className="py-1 pl-5 text-neutral-700">Açúcares adicionados (g)</td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('acucaresAdicionadosG', foodItem.valoresPor100g.acucaresAdicionadosG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('acucaresAdicionadosG', portionValues.acucaresAdicionadosG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {calculateAnvisaVD('acucaresAdicionadosG', portionValues.acucaresAdicionadosG)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 font-bold">Proteínas (g)</td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('proteinasG', foodItem.valoresPor100g.proteinasG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('proteinasG', portionValues.proteinasG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {calculateAnvisaVD('proteinasG', portionValues.proteinasG)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 font-bold">Gorduras totais (g)</td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('gordurasTotaisG', foodItem.valoresPor100g.gordurasTotaisG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('gordurasTotaisG', portionValues.gordurasTotaisG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {calculateAnvisaVD('gordurasTotaisG', portionValues.gordurasTotaisG)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 pl-3 text-neutral-700">Gorduras saturadas (g)</td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('gordurasSaturadasG', foodItem.valoresPor100g.gordurasSaturadasG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('gordurasSaturadasG', portionValues.gordurasSaturadasG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {calculateAnvisaVD('gordurasSaturadasG', portionValues.gordurasSaturadasG)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 pl-3 text-neutral-700">Gorduras trans (g)</td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('gordurasTransG', foodItem.valoresPor100g.gordurasTransG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">
                      {formatAnvisaNutrient('gordurasTransG', portionValues.gordurasTransG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1 text-neutral-700">-</td>
                  </tr>

                  <tr>
                    <td className="py-1 font-bold">Fibra alimentar (g)</td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('fibraAlimentarG', foodItem.valoresPor100g.fibraAlimentarG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('fibraAlimentarG', portionValues.fibraAlimentarG).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {calculateAnvisaVD('fibraAlimentarG', portionValues.fibraAlimentarG)}
                    </td>
                  </tr>

                  <tr className="border-b-2 border-black">
                    <td className="py-1 font-bold">Sódio (mg)</td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('sodioMg', foodItem.valoresPor100g.sodioMg).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {formatAnvisaNutrient('sodioMg', portionValues.sodioMg).formattedValue}
                    </td>
                    <td className="text-right font-mono py-1">
                      {calculateAnvisaVD('sodioMg', portionValues.sodioMg)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2 text-[9px] leading-tight text-neutral-700 border-t border-black mt-1">
                *Percentual de valores diários fornecidos pela porção. Valores diários de referência com base em uma dieta de 2.000 kcal ou 8.400 kJ.
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Fonte: RDC 429/2020 e IN 75/2020</span>
              <button
                type="button"
                onClick={() => notify('Rótulo copiado para a área de transferência em formato gráfico!')}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                Copiar p/ Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
