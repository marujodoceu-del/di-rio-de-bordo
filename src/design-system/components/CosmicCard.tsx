import React from 'react';

export type CosmicCardVariant = 'default' | 'interactive' | 'accent' | 'elevated' | 'locked';

interface CosmicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CosmicCardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

/**
 * CosmicCard
 * Card minimalista e refinado do Método Atômico:
 * - Fundo escuro profundo mate / void surface
 * - Borda hairline de precisão geométrica (border-white/[0.06])
 * - Raio matemático de borda (rounded-2xl: 20px externo)
 * - Zero sombras volumosas neon
 */
export const CosmicCard: React.FC<CosmicCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  const variantClasses = {
    default:
      'bg-[#0B0F19]/90 border border-white/[0.07] text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
    interactive:
      'bg-[#0B0F19]/90 hover:bg-[#0E1422] border border-white/[0.08] hover:border-[#F5C563]/35 text-slate-100 cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]',
    accent:
      'bg-gradient-to-br from-[#0F1424] to-[#080B12] border border-[#F5C563]/25 text-slate-100 shadow-[0_6px_30px_rgba(245,197,99,0.05)]',
    elevated:
      'bg-[#121826]/95 border border-white/[0.10] text-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md',
    locked:
      'bg-[#07090F]/70 border border-white/[0.03] text-slate-500 opacity-75 cursor-not-allowed select-none',
  }[variant];

  return (
    <div
      className={`rounded-2xl relative overflow-hidden transition-all duration-200 ${variantClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
