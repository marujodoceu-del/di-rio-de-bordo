import React from 'react';
import { getEvolutionStageForDay } from '../tokens';
import { Atom, Zap, Orbit, Compass, Sparkles, CheckCircle2, Lock, Clock } from 'lucide-react';

interface EvolutionBadgeProps {
  day: number;
  variant?: 'stage' | 'status';
  isCompleted?: boolean;
  isLocked?: boolean;
  className?: string;
}

export const EvolutionBadge: React.FC<EvolutionBadgeProps> = ({
  day,
  variant = 'stage',
  isCompleted = false,
  isLocked = false,
  className = '',
}) => {
  const stage = getEvolutionStageForDay(day);

  if (variant === 'status') {
    if (isCompleted) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Concluído</span>
        </span>
      );
    }
    if (isLocked) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-slate-900/80 text-slate-500 border border-white/[0.05] whitespace-nowrap ${className}`}
        >
          <Lock className="w-3 h-3 text-slate-600" />
          <span>Bloqueado</span>
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-[#F5C563]/10 text-[#F5C563] border border-[#F5C563]/30 whitespace-nowrap ${className}`}
      >
        <Clock className="w-3 h-3 text-[#F5C563]" />
        <span>Em Andamento</span>
      </span>
    );
  }

  // Estágio Cósmico
  const icon = {
    atomo: <Atom className="w-3 h-3 text-[#F5C563]" />,
    particulas: <Zap className="w-3 h-3 text-sky-400" />,
    constelacoes: <Orbit className="w-3 h-3 text-indigo-400" />,
    galaxias: <Compass className="w-3 h-3 text-purple-400" />,
    infinito: <Sparkles className="w-3 h-3 text-[#F5C563]" />,
  }[stage.id];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-[#0E131F] border ${stage.badgeBorder} text-slate-200 whitespace-nowrap shadow-sm ${className}`}
    >
      {icon}
      <span className="text-white font-semibold">{stage.name}</span>
      <span className="text-white/40">•</span>
      <span className="text-[9px] text-white/60">Dia {day}/21</span>
    </span>
  );
};
