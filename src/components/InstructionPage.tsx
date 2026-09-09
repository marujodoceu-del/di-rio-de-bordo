import React from 'react';
import { CoachProfile, ThemeMode } from '../types';
import { INSTRUCTIONS_DATA } from '../data/instructionsData';
import { Moon, Sun, Brain, Sparkles, CheckCircle2, Compass } from 'lucide-react';

interface InstructionPageProps {
  theme: ThemeMode;
  profile: CoachProfile;
  pageNumber: number;
}

export const InstructionPage: React.FC<InstructionPageProps> = ({ theme, profile, pageNumber }) => {
  const isVibrant = theme === 'vibrant';

  return (
    <div
      id="page-instructions"
      className={`book-page relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 transition-colors duration-300 ${
        isVibrant
          ? 'bg-slate-950 text-slate-100 border border-amber-500/20'
          : 'bg-white text-neutral-900 border border-neutral-300'
      } ${profile.includeSpiralMargin ? 'pl-11 sm:pl-12' : ''}`}
      style={{
        aspectRatio: '148 / 210',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div className={`relative z-10 border-b pb-2 ${
        isVibrant ? 'border-amber-400/30' : 'border-neutral-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md border ${
              isVibrant ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' : 'border-neutral-800 bg-neutral-100 text-neutral-900'
            }`}>
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest font-mono opacity-70 block">
                Guia Oficial do Praticante
              </span>
              <h2
                className={`text-base sm:text-lg font-bold font-serif uppercase tracking-wide leading-tight ${
                  isVibrant ? 'text-amber-300' : 'text-neutral-950'
                }`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Como Fazer seu Diário de Bordo
              </h2>
            </div>
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            isVibrant ? 'border-cyan-400/40 bg-cyan-950/40 text-cyan-300' : 'border-neutral-400 bg-neutral-100 text-neutral-800'
          }`}>
            <Moon className="w-3 h-3 text-amber-400" />
            <span>Ritual Noturno</span>
          </div>
        </div>
        <p className="text-[10px] mt-1 opacity-75 leading-tight italic">
          &ldquo;O universo opera por ciclos regulares de recolhimento e expansão. A noite é o seu laboratório interior; o dia é o seu campo de realização.&rdquo;
        </p>
      </div>

      {/* Main Instructions Blocks (3 Steps) */}
      <div className="relative z-10 py-1.5 space-y-2">
        {INSTRUCTIONS_DATA.map((step) => (
          <div
            key={step.number}
            className={`p-2.5 rounded-lg border transition-all ${
              isVibrant
                ? 'bg-slate-900/70 border-slate-800/90'
                : 'bg-neutral-50/90 border-neutral-200'
            }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold font-mono ${
                  isVibrant ? 'bg-amber-400 text-slate-950' : 'bg-neutral-900 text-white'
                }`}>
                  {step.number}
                </span>
                <h3 className={`text-xs font-semibold tracking-tight leading-none ${
                  isVibrant ? 'text-amber-200' : 'text-neutral-950'
                }`}>
                  {step.title}
                </h3>
              </div>
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                isVibrant ? 'bg-slate-800 text-amber-300/90' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {step.timeframe}
              </span>
            </div>

            {/* Scientific Explanation Pill */}
            <div className={`px-2 py-1 rounded mb-1.5 text-[9.5px] leading-snug flex items-start gap-1.5 ${
              isVibrant ? 'bg-indigo-950/40 text-indigo-200/90 border border-indigo-500/20' : 'bg-neutral-100 text-neutral-700 border border-neutral-250'
            }`}>
              <Brain className="w-3 h-3 shrink-0 mt-0.5 text-cyan-400" />
              <span>{step.scientificContext}</span>
            </div>

            {/* How-to Bullet Points */}
            <ul className="space-y-0.5 text-[9.5px] sm:text-[10px] leading-tight opacity-90 pl-0.5">
              {step.howTo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <CheckCircle2 className={`w-2.5 h-2.5 shrink-0 mt-0.5 ${
                    isVibrant ? 'text-amber-400' : 'text-neutral-700'
                  }`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Practical tip */}
            <div className={`mt-1 pt-0.5 border-t text-[9px] italic flex items-center gap-1 ${
              isVibrant ? 'border-slate-800/80 text-amber-300/80' : 'border-neutral-200 text-neutral-600'
            }`}>
              <Sparkles className="w-2.5 h-2.5 shrink-0 text-amber-400" />
              <span>{step.tips}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Golden Rule Banner */}
      <div className={`relative z-10 p-2 rounded-md border text-[10px] leading-tight flex items-center justify-between ${
        isVibrant ? 'bg-amber-500/10 border-amber-400/30 text-amber-100' : 'bg-neutral-100 border-neutral-300 text-neutral-900'
      }`}>
        <div className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <p>
            <strong>Regra de Ouro:</strong> Preencha sem autojulgamento. Cada noite encerra um ciclo cósmico; cada alvorada abre um novo horizonte de realizações.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={`relative z-10 flex items-center justify-between pt-1.5 border-t text-[9.5px] opacity-60 ${
        isVibrant ? 'border-slate-800 text-slate-400' : 'border-neutral-200 text-neutral-600'
      }`}>
        <span>Diário de Bordo — 21 Dias • Instruções Metodológicas</span>
        <span>Página {pageNumber}</span>
      </div>
    </div>
  );
};
