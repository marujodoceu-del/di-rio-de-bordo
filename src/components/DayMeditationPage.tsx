import React from 'react';
import { CoachProfile, ThemeMode } from '../types';
import { EXACT_MEDITATION_TEXT } from '../data/diarioContent';
import { Moon, Sparkles, Feather } from 'lucide-react';

interface DayMeditationPageProps {
  dayNumber: number;
  theme: ThemeMode;
  profile: CoachProfile;
  pageNumber: number;
}

export const DayMeditationPage: React.FC<DayMeditationPageProps> = ({
  dayNumber,
  theme,
  profile,
  pageNumber,
}) => {
  const isVibrant = theme === 'vibrant';

  return (
    <div
      id={`page-meditation-${dayNumber}`}
      className={`book-page relative overflow-hidden flex flex-col justify-between p-6 sm:p-7 transition-colors duration-300 ${
        isVibrant
          ? 'bg-slate-950 text-slate-100 border border-amber-500/20'
          : 'bg-white text-neutral-900 border border-neutral-300'
      } ${profile.includeSpiralMargin ? 'pl-14 sm:pl-16' : ''}`}
      style={{
        aspectRatio: '148 / 210',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header: Meditação do Perdão */}
      <div className={`relative z-10 border-b pb-2 ${
        isVibrant ? 'border-amber-400/30' : 'border-neutral-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md border ${
              isVibrant ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' : 'border-neutral-800 bg-neutral-100 text-neutral-900'
            }`}>
              <Feather className="w-4 h-4" />
            </div>
            <h2
              className={`text-sm sm:text-base font-bold font-serif uppercase tracking-widest ${
                isVibrant ? 'text-amber-300' : 'text-neutral-950'
              }`}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              MEDITAÇÃO DO PERDÃO
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-70">
            <Moon className="w-3 h-3 text-amber-400" />
            <span>Dia {dayNumber} • Desconexão & Paz</span>
          </div>
        </div>
      </div>

      {/* Meditation Items 1, 2, 3 */}
      <div className="relative z-10 space-y-3 text-[11px] sm:text-[11.5px] leading-relaxed text-justify">
        {/* Item 1 */}
        <div className="space-y-1">
          <p>
            {EXACT_MEDITATION_TEXT.item1}{' '}
            <span className={`inline-block border-b font-semibold px-2 min-w-[140px] text-center ${
              isVibrant ? 'border-amber-400/50 text-amber-200' : 'border-neutral-700 text-neutral-900'
            }`}>
              {profile.coacheeName || "(escreva seu nome)"}
            </span>
          </p>
        </div>

        {/* Item 2 */}
        <div className="space-y-1">
          <p>
            {EXACT_MEDITATION_TEXT.item2}{' '}
            <span className={`inline-block border-b font-semibold px-2 min-w-[140px] text-center ${
              isVibrant ? 'border-amber-400/50 text-amber-200' : 'border-neutral-700 text-neutral-900'
            }`}>
              {profile.coacheeName || "(escreva seu nome)"}
            </span>
          </p>
        </div>

        {/* Item 3 */}
        <div className="space-y-1">
          <p>
            {EXACT_MEDITATION_TEXT.item3}{' '}
            <span className={`inline-block border-b font-semibold px-2 min-w-[140px] text-center ${
              isVibrant ? 'border-amber-400/50 text-amber-200' : 'border-neutral-700 text-neutral-900'
            }`}>
              {profile.coacheeName || "(escreva seu nome)"}
            </span>
          </p>
        </div>

        {/* Section 5: Conclusão / Aprendizados */}
        <div className="space-y-1.5 pt-1">
          <p className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {EXACT_MEDITATION_TEXT.section5}
          </p>
          <p className="font-semibold text-[11px] leading-snug">
            {EXACT_MEDITATION_TEXT.question5_1}
          </p>
          <div className="space-y-1.5 pt-1">
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
          </div>
        </div>
      </div>

      {/* Nighttime Coaching Conclusion Box (Justified, exact text from original PDF) */}
      <div
        className={`relative z-10 p-3 rounded-xl border text-[10px] leading-relaxed text-justify ${
          isVibrant
            ? 'bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-amber-400/30 text-slate-200 shadow-inner'
            : 'bg-neutral-50 border-neutral-300 text-neutral-800'
        }`}
      >
        <p className="mb-2 italic">
          {EXACT_MEDITATION_TEXT.closingBullet1}
        </p>
        <p className="mb-2 italic">
          {EXACT_MEDITATION_TEXT.closingBullet2}
        </p>

        <div className="text-center pt-1 border-t border-current/20">
          <span
            className={`text-xs font-bold tracking-widest font-serif uppercase ${
              isVibrant ? 'text-amber-300' : 'text-neutral-900'
            }`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            BOA NOITE... DURMA EM PAZ!
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className={`relative z-10 flex items-center justify-between pt-1 border-t text-[10px] opacity-60 ${
        isVibrant ? 'border-slate-800 text-slate-400' : 'border-neutral-200 text-neutral-600'
      }`}>
        <span>Diário de Bordo — 21 Dias • Página {pageNumber}</span>
        <span className="text-[9px] font-mono">Frequência Alfa • Sono Restaurador</span>
      </div>
    </div>
  );
};
