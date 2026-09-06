import React from 'react';
import { SkinfoldKey } from '../types';

interface SkinfoldPinchDiagramProps {
  foldKey: SkinfoldKey;
  orientation: 'vertical' | 'diagonal' | 'horizontal';
  foldName: string;
}

export const SkinfoldPinchDiagram: React.FC<SkinfoldPinchDiagramProps> = ({
  foldKey,
  orientation,
  foldName,
}) => {
  // Configuração visual do ângulo da dobra
  const rotationDegrees = orientation === 'diagonal' ? -45 : orientation === 'horizontal' ? -90 : 0;

  return (
    <div className="relative w-full bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800 overflow-hidden shadow-inner">
      {/* Header do Diagrama */}
      <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider text-slate-300">
            Diagrama Vetorial de Pinçamento
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700 text-[10px] font-bold">
          Eixo: {orientation === 'diagonal' ? '45° Oblíquo' : orientation === 'horizontal' ? '0° Horizontal' : '90° Vertical'}
        </span>
      </div>

      {/* SVG Canvas da Técnica de Pinçamento */}
      <div className="flex items-center justify-center py-2">
        <svg
          viewBox="0 0 320 210"
          className="w-full max-w-[320px] h-auto select-none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Gradientes e Filtros para profundidade médica */}
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>

            <linearGradient id="fatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            <linearGradient id="caliperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Plano de Fundo Anatômico: Parede Muscular profunda (NÃO PINÇADA) */}
          <g transform="translate(0, 155)">
            <rect x="20" y="10" width="280" height="35" rx="6" fill="url(#muscleGrad)" opacity="0.85" />
            <text x="30" y="32" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
              MÚSCULO & FÁSCIA (DEVE PERMANECER RELAXADO)
            </text>
          </g>

          {/* Grupo da Prega Cutânea Tracionada com Rotação de Orientação */}
          <g transform={`rotate(${rotationDegrees}, 160, 110)`}>
            {/* Camada Adiposa Subcutânea Levantada (Amarela) */}
            <path
              d="M 60 165 C 100 165, 120 40, 160 35 C 200 40, 220 165, 260 165 Z"
              fill="url(#fatGrad)"
              opacity="0.9"
            />

            {/* Camada de Pele Externa (Derme/Epiderme Rosa) */}
            <path
              d="M 50 165 C 95 165, 115 35, 160 30 C 205 35, 225 165, 270 165"
              fill="none"
              stroke="#fb7185"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Dedo Polegar (Esquerda) tracionando */}
            <g transform="translate(75, 45)">
              <rect x="0" y="0" width="38" height="22" rx="10" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              <text x="5" y="15" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                POLEGAR
              </text>
              <path d="M 38 11 L 46 11" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </g>

            {/* Dedo Indicador (Direita) tracionando */}
            <g transform="translate(205, 45)">
              <rect x="0" y="0" width="46" height="22" rx="10" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              <text x="4" y="15" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                INDICADOR
              </text>
              <path d="M 0 11 L -8 11" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </g>

            {/* Hastes do Plicômetro (Adipômetro) aplicando pressão 1cm abaixo */}
            <g transform="translate(90, 95)">
              {/* Haste Esquerda do Caliper */}
              <path
                d="M -35 15 L 20 15 L 25 10"
                fill="none"
                stroke="url(#caliperGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="25" cy="10" r="3.5" fill="#38bdf8" />

              {/* Haste Direita do Caliper */}
              <path
                d="M 175 15 L 120 15 L 115 10"
                fill="none"
                stroke="url(#caliperGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="115" cy="10" r="3.5" fill="#38bdf8" />

              {/* Zona de Contato e Medição */}
              <line x1="28" y1="10" x2="112" y2="10" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>

            {/* Indicador da Distância de 1.0 cm (Regra de Ouro ISAK) */}
            <g transform="translate(160, 58)">
              {/* Linha vertical de cota */}
              <line x1="0" y1="5" x2="0" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="-5" y1="5" x2="5" y2="5" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="-5" y1="40" x2="5" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="8" y="14" width="46" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="13" y="27" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                1,0 cm
              </text>
            </g>
          </g>

          {/* Ponto Anatômico Marcado a Lápis Dermográfico */}
          <g transform="translate(160, 110)">
            <circle cx="0" cy="0" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="8" y="4" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace">
              Ponto Marcado
            </text>
          </g>

          {/* Legenda dos 2 Segundos */}
          <g transform="translate(20, 25)">
            <rect x="0" y="0" width="85" height="20" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <text x="6" y="14" fill="#e2e8f0" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              ⏱ Leitura: 2 seg
            </text>
          </g>
        </svg>
      </div>

      {/* Legenda de Cores das Camadas Anatômicas */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-pink-400"></span>
          <span>Derme / Pele</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400"></span>
          <span>Tecido Adiposo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
          <span>Músculo Profundo</span>
        </div>
      </div>
    </div>
  );
};
