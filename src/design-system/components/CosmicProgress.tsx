import React from 'react';

interface CosmicProgressProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

/**
 * CosmicProgress
 * Barra de progresso com gradiente estelar suave (Ouro Estelar ao Violeta Cósmico)
 * com animação lenta e discreta.
 */
export const CosmicProgress: React.FC<CosmicProgressProps> = ({
  value,
  label,
  sublabel,
  size = 'md',
  showPercentage = true,
  className = '',
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="font-medium text-slate-300 font-sans">{label}</span>
          )}
          {showPercentage && (
            <span className="font-mono text-[11px] text-[#F5C563] font-bold">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full bg-[#080B12] border border-white/[0.06] rounded-full overflow-hidden p-[2px] ${heightClass}`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#F5C563] via-[#FCE2A6] to-[#818CF8]"
          style={{ width: `${clamped}%` }}
        />
      </div>

      {sublabel && (
        <p className="text-[10px] text-slate-500 font-mono">{sublabel}</p>
      )}
    </div>
  );
};
