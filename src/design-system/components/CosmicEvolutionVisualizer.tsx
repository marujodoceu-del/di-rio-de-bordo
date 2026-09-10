import React from 'react';
import { getEvolutionStageForDay, EvolutionStage } from '../tokens';

interface CosmicEvolutionVisualizerProps {
  day: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CosmicEvolutionVisualizer: React.FC<CosmicEvolutionVisualizerProps> = ({
  day,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const stage = getEvolutionStageForDay(day);

  const dimension = size === 'sm' ? 44 : size === 'lg' ? 96 : 64;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Visual SVG Engine */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-[#080B12] border border-white/[0.08] overflow-hidden"
        style={{ width: dimension, height: dimension }}
      >
        {/* Very subtle ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-40 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${stage.glowColor} 0%, transparent 70%)`,
          }}
        />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-2 relative z-10 transition-all duration-700"
        >
          <defs>
            <radialGradient id="atomicGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5C563" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#F5C563" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F5C563" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C563" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 1. ÁTOMO: Órbitas concentradas e núcleo quântico */}
          {stage.id === 'atomo' && (
            <g className="origin-center animate-[spin_32s_linear_infinite]">
              {/* Núcleo */}
              <circle cx="50" cy="50" r="4.5" fill="#F5C563" />
              <circle cx="50" cy="50" r="8" fill="url(#atomicGlow)" />
              {/* Órbitas elípticas finas */}
              <ellipse
                cx="50"
                cy="50"
                rx="28"
                ry="11"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="1"
                transform="rotate(0 50 50)"
              />
              <ellipse
                cx="50"
                cy="50"
                rx="28"
                ry="11"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="1"
                transform="rotate(60 50 50)"
              />
              <ellipse
                cx="50"
                cy="50"
                rx="28"
                ry="11"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="1"
                transform="rotate(120 50 50)"
              />
              {/* Partículas nos eixos orbitais */}
              <circle cx="78" cy="50" r="1.8" fill="#FFFFFF" />
              <circle cx="36" cy="26" r="1.8" fill="#F5C563" />
              <circle cx="64" cy="74" r="1.8" fill="#38BDF8" />
            </g>
          )}

          {/* 2. PARTÍCULAS: Vibração quântica & expansão sináptica */}
          {stage.id === 'particulas' && (
            <g className="origin-center animate-[spin_40s_linear_infinite]">
              <circle cx="50" cy="50" r="3.5" fill="#38BDF8" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.5" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="#F5C563" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.4" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              {/* Nós de energia em ressonância */}
              <circle cx="50" cy="24" r="2" fill="#38BDF8" />
              <circle cx="74" cy="38" r="2" fill="#F5C563" />
              <circle cx="68" cy="68" r="2.2" fill="#FFFFFF" />
              <circle cx="32" cy="72" r="1.8" fill="#38BDF8" />
              <circle cx="24" cy="42" r="2" fill="#F5C563" />
              {/* Linhas de emissão discreta */}
              <line x1="50" y1="50" x2="74" y2="38" stroke="#38BDF8" strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="50" x2="32" y2="72" stroke="#F5C563" strokeWidth="0.5" opacity="0.3" />
            </g>
          )}

          {/* 3. CONSTELAÇÕES: Geometria de conexões estelares */}
          {stage.id === 'constelacoes' && (
            <g className="origin-center">
              {/* Linhas de conexão geométrica */}
              <polygon
                points="50,18 78,34 68,72 32,72 22,34"
                fill="none"
                stroke="#818CF8"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <line x1="50" y1="18" x2="68" y2="72" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
              <line x1="50" y1="18" x2="32" y2="72" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
              <line x1="22" y1="34" x2="78" y2="34" stroke="rgba(245,197,99,0.3)" strokeWidth="0.6" />
              {/* Vértices estelares */}
              <circle cx="50" cy="18" r="3" fill="#F5C563" />
              <circle cx="78" cy="34" r="2.5" fill="#FFFFFF" />
              <circle cx="68" cy="72" r="2.5" fill="#818CF8" />
              <circle cx="32" cy="72" r="2.5" fill="#818CF8" />
              <circle cx="22" cy="34" r="2.5" fill="#FFFFFF" />
              <circle cx="50" cy="46" r="2" fill="#F5C563" />
            </g>
          )}

          {/* 4. GALÁXIAS: Espirais logarítmicas e atração gravitacional */}
          {stage.id === 'galaxias' && (
            <g className="origin-center animate-[spin_55s_linear_infinite]">
              {/* Núcleo galáctico */}
              <circle cx="50" cy="50" r="5" fill="#FCE2A6" />
              <circle cx="50" cy="50" r="12" fill="url(#atomicGlow)" opacity="0.6" />
              {/* Braços em espiral logarítmica */}
              <path
                d="M 50,50 Q 65,35 80,48 T 72,78 T 35,80 T 20,45 T 45,20"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 50,50 Q 35,65 20,52 T 28,22 T 65,20 T 80,55 T 55,80"
                fill="none"
                stroke="#C084FC"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Aglomerados de estrelas nos braços */}
              <circle cx="72" cy="78" r="2" fill="#FFFFFF" />
              <circle cx="20" cy="45" r="1.8" fill="#F5C563" />
              <circle cx="28" cy="22" r="2" fill="#818CF8" />
              <circle cx="80" cy="55" r="1.6" fill="#FFFFFF" />
            </g>
          )}

          {/* 5. O INFINITO: Lemniscata harmônica e horizonte cósmico */}
          {stage.id === 'infinito' && (
            <g className="origin-center">
              {/* Lemniscata (símbolo do infinito com proporção dourada) */}
              <path
                d="M 50,50 C 35,32 18,32 18,50 C 18,68 35,68 50,50 C 65,32 82,32 82,50 C 82,68 65,68 50,50 Z"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Anel exterior do horizonte */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(245,197,99,0.25)"
                strokeWidth="0.8"
                strokeDasharray="2 4"
              />
              {/* Focos da lemniscata */}
              <circle cx="28" cy="50" r="3" fill="#F5C563" />
              <circle cx="72" cy="50" r="3" fill="#F5C563" />
              <circle cx="50" cy="50" r="2" fill="#FFFFFF" />
            </g>
          )}
        </svg>
      </div>

      {/* Label descritivo opcional */}
      {showLabel && (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5C563] font-bold">
              FASE {stage.id === 'atomo' ? 'I' : stage.id === 'particulas' ? 'II' : stage.id === 'constelacoes' ? 'III' : stage.id === 'galaxias' ? 'IV' : 'V'}
            </span>
            <span className="text-[10px] text-white/40 font-mono">•</span>
            <span className="text-[10px] text-white/60 font-mono">
              Dia {day} de 21
            </span>
          </div>
          <p
            className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {stage.name}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans line-clamp-1">
            {stage.subtitle}
          </p>
        </div>
      )}
    </div>
  );
};
