import React from 'react';

export type CosmicButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type CosmicButtonSize = 'sm' | 'md' | 'lg';

interface CosmicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CosmicButtonVariant;
  size?: CosmicButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * CosmicButton
 * Botões do Design System:
 * - Proporção de padding 2:1 (horizontal : vertical)
 * - Cores de contraste refinadas
 * - Textos nunca quebram (white-space: nowrap)
 * - Estado desabilitado discreto e consistente
 */
export const CosmicButton: React.FC<CosmicButtonProps> = ({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[34px]',
    md: 'px-4 py-2 text-xs sm:text-sm rounded-xl gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-sm font-semibold rounded-xl gap-2.5 min-h-[46px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#F5C563] via-[#F8D485] to-[#E2A73E] text-[#05070B] font-bold hover:brightness-105 shadow-[0_4px_16px_rgba(245,197,99,0.22)] active:scale-[0.98]',
    secondary:
      'bg-[#0E1422] hover:bg-[#141B2D] border border-white/[0.10] hover:border-white/[0.20] text-slate-200 font-medium active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-[#F5C563]/10 border border-[#F5C563]/40 hover:border-[#F5C563] text-[#F5C563] font-medium active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white font-medium active:scale-[0.98]',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-medium active:scale-[0.98]',
  }[variant];

  const disabledClasses =
    disabled || loading
      ? 'opacity-40 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer transition-all duration-200';

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-sans tracking-wide whitespace-nowrap select-none ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
