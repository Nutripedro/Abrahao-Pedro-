import React, { useEffect } from 'react';
import {
  Palette,
  Check,
  X,
  Sparkles,
  Layers,
  Sliders,
  ShieldCheck,
  Eye,
  Info,
  ArrowRight,
  Sun,
  LayoutTemplate
} from 'lucide-react';
import { useTheme, PALETTE_OPTIONS, LightPaletteId } from '../../contexts/ThemeContext';
import clsx from 'clsx';

export const PaletteSelectorModal: React.FC = () => {
  const {
    palette,
    setPalette,
    isPaletteModalOpen,
    setPaletteModalOpen,
    theme,
    setTheme
  } = useTheme();

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPaletteModalOpen) {
        setPaletteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteModalOpen, setPaletteModalOpen]);

  if (!isPaletteModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-palette-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modal-palette-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Paletas de Cores do Consultório
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono">
                  Tema Claro Clínico
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecione a identidade visual de tonalidade clara calibrada para ergonomia visual e alto padrão no atendimento.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPaletteModalOpen(false)}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Active Mode Notice */}
          {theme === 'dark' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  O sistema está atualmente em <strong>Modo Noturno</strong>. Ao escolher qualquer paleta clara, o modo diurno será ativado automaticamente.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shrink-0 cursor-pointer shadow-2xs"
              >
                Ativar Modo Claro
              </button>
            </div>
          )}

          {/* 3 Main Palette Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {PALETTE_OPTIONS.map((pal) => {
              const isSelected = palette === pal.id;

              return (
                <div
                  key={pal.id}
                  onClick={() => setPalette(pal.id)}
                  className={clsx(
                    "relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between group text-left",
                    isSelected
                      ? "border-emerald-600 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
                  )}
                  style={{
                    backgroundColor: pal.colors.background
                  }}
                >
                  {/* Top Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xl">{pal.icon}</span>
                      <span
                        className={clsx(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors",
                          isSelected
                            ? "bg-emerald-700 text-white"
                            : "bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        Opção {pal.optionNumber}
                      </span>
                    </div>

                    <h3
                      className="text-base font-bold tracking-tight mb-0.5"
                      style={{ color: pal.colors.textPrimary }}
                    >
                      {pal.name}
                    </h3>
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: pal.colors.accent }}
                    >
                      {pal.subtitle}
                    </p>

                    <p
                      className="text-xs leading-relaxed mb-4 line-clamp-3"
                      style={{ color: pal.colors.textSecondary }}
                    >
                      {pal.focus}
                    </p>
                  </div>

                  <div>
                    {/* Target Audience Pill */}
                    <div
                      className="p-2.5 rounded-xl text-[11px] leading-relaxed mb-4 border"
                      style={{
                        backgroundColor: pal.colors.card,
                        borderColor: pal.colors.border,
                        color: pal.colors.textPrimary
                      }}
                    >
                      <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5" style={{ color: pal.colors.accent }}>
                        Perfil Recomendado:
                      </span>
                      {pal.targetNiche}
                    </div>

                    {/* Color Swatches Grid */}
                    <div className="space-y-1.5 pt-3 border-t" style={{ borderColor: pal.colors.border }}>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Fundo Principal:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.colors.background }} />
                          <span className="font-mono font-bold text-[10px] text-slate-700">{pal.colors.background}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Cards / Containers:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.colors.card }} />
                          <span className="font-mono font-bold text-[10px] text-slate-700">{pal.colors.card}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Cor de Destaque:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.colors.accent }} />
                          <span className="font-mono font-bold text-[10px] text-slate-700">{pal.colors.accent}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Texto Principal:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.colors.textPrimary }} />
                          <span className="font-mono font-bold text-[10px] text-slate-700">{pal.colors.textPrimary}</span>
                        </div>
                      </div>

                      {pal.colors.secondaryElement && (
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 truncate max-w-[120px]">Elemento Secundário:</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] font-bold border"
                              style={{
                                backgroundColor: pal.colors.secondaryElement.bg,
                                color: pal.colors.secondaryElement.text,
                                borderColor: pal.colors.border
                              }}
                            >
                              {pal.colors.secondaryElement.text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Select Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPalette(pal.id);
                      }}
                      className={clsx(
                        "mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs",
                        isSelected
                          ? "text-white shadow-sm"
                          : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300"
                      )}
                      style={{
                        backgroundColor: isSelected ? pal.colors.accent : undefined
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Paleta Ativa no Sistema</span>
                        </>
                      ) : (
                        <span>Aplicar Opção {pal.optionNumber}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Simulation / Preview of Diet & Clinical Elements */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Pré-visualização Interativa em Tempo Real
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                Visualizando elementos sob a paleta ativa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Sample Diet Meal Card */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                    Café da Manhã (07:30)
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    420 kcal
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  • 2 Ovos mexidos com azeite de oliva extra virgem
                  <br />• 1 Fatia de pão 100% integral com sementes
                </p>
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Proteína: 24g</span>
                  <span>Carbo: 28g</span>
                  <span>Lipídios: 14g</span>
                </div>
              </div>

              {/* Sample Anthropometry Metric Card */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Taxa Metabólica Basal (TMB)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                    1.785
                  </span>
                  <span className="text-xs text-slate-500 font-mono">kcal/dia</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Equação Cunningham 1980
                  </span>
                </div>
              </div>

              {/* Sample Actions & Secondary Badges */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Elementos Secundários & Ações
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="palette-secondary-highlight px-2 py-0.5 rounded-md text-[10px] font-bold border">
                      Jejum 14h
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Gordura: 14.8%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="palette-accent-btn w-full py-2 px-3 rounded-xl font-bold text-xs text-white shadow-2xs transition-transform active:scale-[0.98] cursor-pointer"
                >
                  Salvar Prescrição & Plano
                </button>
              </div>
            </div>
          </div>

          {/* Guidelines Section: 🧱 Estrutura Visual do Tema Claro */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                🧱 Diretrizes de Interface do Tema Claro (Padrão Moderno)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Bordas
                </span>
                <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                  1px solid suave
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tons como #E2E8F0, #EAEFEA ou #EAE4DC para separar dados sem poluir visualmente a tela.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Sombras (Shadows)
                </span>
                <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                  0 4px 6px -1px (5%)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sombras muito sutis que fazem os blocos de dieta parecerem "flutuar" levemente sobre o fundo.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Tipografia
                </span>
                <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                  Plus Jakarta Sans
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sem serifa geométrica limpa que assegura leitura imediata de números, frações e gramaturas.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Raio da Borda
                </span>
                <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                  12px a 16px
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Curvas arredondadas suaves em cards e botões gerando acolhimento, leveza e sofisticação clínica.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Dica: Você também pode alternar entre paletas a qualquer momento pelo topo da tela.
          </div>
          <button
            type="button"
            onClick={() => setPaletteModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs ml-auto"
          >
            Concluir & Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
