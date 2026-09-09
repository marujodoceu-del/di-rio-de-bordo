import React from 'react';
import { CoachProfile, ThemeMode } from '../types';
import { Orbit, Sparkles, Award, Compass, CheckCircle } from 'lucide-react';

interface ClosingPageProps {
  theme: ThemeMode;
  profile: CoachProfile;
  pageNumber: number;
}

export const ClosingPage: React.FC<ClosingPageProps> = ({ theme, profile, pageNumber }) => {
  const isVibrant = theme === 'vibrant';

  return (
    <div
      id="page-closing"
      className={`book-page relative overflow-hidden flex flex-col justify-between p-8 sm:p-10 transition-colors duration-300 ${
        isVibrant
          ? 'bg-slate-950 text-slate-100 border border-amber-500/20'
          : 'bg-white text-neutral-900 border border-neutral-300'
      } ${profile.includeSpiralMargin ? 'pl-14 sm:pl-16' : ''}`}
      style={{
        aspectRatio: '148 / 210',
        boxSizing: 'border-box',
      }}
    >
      {/* Subtle Geometry frame */}
      <div className={`absolute inset-6 border border-dashed rounded-xl pointer-events-none opacity-40 ${
        isVibrant ? 'border-amber-400/40' : 'border-neutral-400'
      }`} />

      {/* Top Header */}
      <div className="relative z-10 text-center pt-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-widest font-mono uppercase border ${
          isVibrant ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'bg-neutral-100 border-neutral-300 text-neutral-800'
        }`}>
          <Award className="w-3.5 h-3.5" />
          <span>Conclusão da Jornada de 21 Dias</span>
        </div>
      </div>

      {/* Center Main Box: Exact PDF Quote */}
      <div className="relative z-10 my-auto py-6 max-w-md mx-auto text-center space-y-5">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full border ${
            isVibrant ? 'bg-slate-900 border-amber-400/40 text-amber-300 shadow-lg shadow-amber-500/10' : 'bg-neutral-100 border-neutral-800 text-neutral-900'
          }`}>
            <Orbit className="w-10 h-10 animate-spin" style={{ animationDuration: '40s' }} />
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border text-sm sm:text-base font-serif italic leading-relaxed text-center ${
            isVibrant
              ? 'bg-slate-900/90 border-amber-400/40 text-amber-100 shadow-xl'
              : 'bg-neutral-50 border-neutral-400 text-neutral-900 shadow-sm'
          }`}
        >
          &ldquo;Assim que você concluir a vivência e o preenchimento destes 21 dias com foco e consistência, conversaremos sobre a expansão do processo!&rdquo;
        </div>

        {/* Scientific / Cosmological Celebration */}
        <div className="space-y-1.5 text-xs opacity-90">
          <p className="font-semibold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Você completou uma translação de 21 ciclos de consciência.
          </p>
          <p className="text-[11px] leading-relaxed italic opacity-80 max-w-xs mx-auto">
            Assim como a matéria que se reorganiza sob novas leis de gravidade, você calibrou sua mente, seus atos e sua trajetória.
          </p>
        </div>

        {/* Signatures & Accreditation */}
        <div className="pt-6 grid grid-cols-2 gap-6 text-[11px]">
          <div className="flex flex-col items-center">
            <div className={`w-full border-b pb-1 mb-1 text-center font-serif ${
              isVibrant ? 'border-slate-700 text-amber-200' : 'border-neutral-400 text-neutral-900'
            }`}>
              {profile.coacheeName || "_________________________"}
            </div>
            <span className="opacity-70 text-[10px] uppercase tracking-wider">Praticante (Coachee)</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`w-full border-b pb-1 mb-1 text-center font-serif font-bold ${
              isVibrant ? 'border-slate-700 text-amber-300' : 'border-neutral-400 text-neutral-900'
            }`}>
              {profile.name || "Prof. & Mentor"}
            </div>
            <span className="opacity-70 text-[10px] uppercase tracking-wider">
              {profile.credentials || "Astrônomo • Físico • Palestrante"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`relative z-10 flex items-center justify-between pt-2 border-t text-[10px] opacity-60 ${
        isVibrant ? 'border-slate-800 text-slate-400' : 'border-neutral-200 text-neutral-600'
      }`}>
        <span>Diário de Bordo — 21 Dias • Página {pageNumber}</span>
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3" />
          Rumo à Expansão Cósmica
        </span>
      </div>
    </div>
  );
};
