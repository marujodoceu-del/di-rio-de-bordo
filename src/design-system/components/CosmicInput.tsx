import React from 'react';

interface CosmicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  actionRight?: React.ReactNode;
}

export const CosmicInput: React.FC<CosmicInputProps> = ({
  label,
  hint,
  error,
  actionRight,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 font-sans tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          disabled={disabled}
          className={`w-full bg-[#070A11] border ${
            error
              ? 'border-red-500/60 focus:border-red-400'
              : 'border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30'
          } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all duration-200 font-sans ${
            disabled ? 'opacity-50 cursor-not-allowed bg-[#05070B]' : ''
          } ${actionRight ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {actionRight && (
          <div className="absolute right-2 flex items-center">{actionRight}</div>
        )}
      </div>
      {hint && !error && <p className="text-[10px] text-slate-500">{hint}</p>}
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
};

interface CosmicTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  actionCorner?: React.ReactNode;
}

export const CosmicTextarea: React.FC<CosmicTextareaProps> = ({
  label,
  hint,
  error,
  actionCorner,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-300 font-sans tracking-wide">
            {label}
          </label>
        )}
        {actionCorner && <div>{actionCorner}</div>}
      </div>
      <textarea
        disabled={disabled}
        className={`w-full bg-[#070A11] border ${
          error
            ? 'border-red-500/60 focus:border-red-400'
            : 'border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30'
        } rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all duration-200 font-sans resize-y leading-relaxed ${
          disabled ? 'opacity-50 cursor-not-allowed bg-[#05070B]' : ''
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-[10px] text-slate-500">{hint}</p>}
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
};
