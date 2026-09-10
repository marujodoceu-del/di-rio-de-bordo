import React from 'react';
import { CoachProfile, ThemeMode, CosmicDayQuote } from '../types';
import { Orbit, Sparkles } from 'lucide-react';

interface DayQuestionsPageProps {
  dayNumber: number;
  hasSpecialIdeaQuestion?: boolean;
  theme: ThemeMode;
  profile: CoachProfile;
  pageNumber: number;
  cosmicQuote: CosmicDayQuote;
}

export const DayQuestionsPage: React.FC<DayQuestionsPageProps> = ({
  dayNumber,
  hasSpecialIdeaQuestion = false,
  theme,
  profile,
  pageNumber,
  cosmicQuote,
}) => {
  const isVibrant = theme === 'vibrant';

  return (
    <div
      id={`page-day-${dayNumber}`}
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
      {/* Header Banner */}
      <div className="relative z-10">
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-lg border font-serif tracking-wider ${
            isVibrant
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-amber-400/40 text-amber-300 shadow-sm'
              : 'bg-neutral-900 border-neutral-800 text-white'
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold uppercase">
              DIA {dayNumber} — DIÁRIO DE BORDO
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase opacity-80">
            <span>{cosmicQuote.concept}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Questions Body: STRICT ORIGINAL CONTENT */}
      <div className="relative z-10 my-auto py-1.5 space-y-2.5 text-[11px] sm:text-[11.5px] leading-tight text-justify">
        
        {/* Pergunta 1 */}
        <div className="space-y-1">
          <p className="font-semibold">
            1. Por que valeu a pena viver o dia de hoje?
          </p>
          <div className="space-y-1.5 pt-0.5">
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
          </div>
        </div>

        {/* Pergunta 1.1 (Exclusiva do DIA 1 conforme PDF original) */}
        {hasSpecialIdeaQuestion && (
          <div className="space-y-1">
            <p className="font-semibold leading-snug">
              1.1. Que ideia você pode ter hoje para contribuir para a construção de um mundo melhor de se viver no tempo presente? Como você pode colocar isso em prática?
            </p>
            <div className="space-y-1.5 pt-0.5">
              <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
              <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
            </div>
          </div>
        )}

        {/* Pergunta 2 */}
        <div className="space-y-1">
          <p className="font-semibold leading-snug">
            2. Se você pudesse voltar no tempo e tivesse o poder de modificar algum acontecimento no dia de hoje, o que você faria de diferente?
          </p>
          <div className="space-y-1.5 pt-0.5">
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
          </div>
        </div>

        {/* Pergunta 3: Seis Ações */}
        <div className="space-y-1">
          <p className="font-semibold">
            3. Seis ações que você se compromete a realizar no dia de amanhã:
          </p>
          <div className="grid grid-cols-1 gap-1 pt-0.5">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <span className={`font-mono font-bold text-[10px] w-3 shrink-0 ${isVibrant ? 'text-amber-400' : 'text-neutral-900'}`}>
                  {num}.
                </span>
                <div className={`border-b flex-1 h-3.5 ${isVibrant ? 'border-slate-700/80' : 'border-neutral-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Pergunta 3.1: Escala 0-10 */}
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <p className="font-semibold leading-snug flex-1">
              3.1. O quanto você acredita que estas ações contribuirão para um dia produtivo amanhã? Justifique.
            </p>
            {/* Visual scale indicators */}
            <div className={`flex items-center gap-1 self-start sm:self-center px-1.5 py-0.5 rounded border text-[9px] font-mono shrink-0 ${
              isVibrant ? 'bg-slate-900/90 border-slate-700 text-amber-300' : 'bg-neutral-100 border-neutral-300 text-neutral-800'
            }`}>
              <span className="opacity-70">Nota:</span>
              {[0, 2, 4, 6, 8, 10].map(val => (
                <span key={val} className="w-3.5 h-3.5 rounded-full border flex items-center justify-center border-current/30 text-[8px]">
                  {val}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 pt-0.5">
            <div className={`border-b h-4 w-full ${isVibrant ? 'border-slate-700/70' : 'border-neutral-300'}`} />
          </div>
        </div>

        {/* Pergunta 4: Gratidão / Bênçãos Diárias */}
        <div className="space-y-1">
          <p className="font-semibold leading-snug">
            4. GRATIDÃO: Agradeça três acontecimentos, emoções ou fatos positivos, sentimentos ou conquistas do dia de hoje. Podemos nomear essa ação como suas &ldquo;bênçãos diárias&rdquo;.
          </p>
          <div className="space-y-1 pt-0.5">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <span className={`font-mono font-bold text-[10px] w-3 shrink-0 ${isVibrant ? 'text-amber-400' : 'text-neutral-900'}`}>
                  {num}.
                </span>
                <div className={`border-b flex-1 h-3.5 ${isVibrant ? 'border-slate-700/80' : 'border-neutral-300'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cosmic Reflection of the Day (Havendo espaço: frases de incentivo e reflexões científicas) */}
      <div
        className={`relative z-10 p-2.5 rounded-lg border text-[10px] leading-relaxed transition-all ${
          isVibrant
            ? 'bg-slate-900/90 border-amber-500/30 text-slate-200'
            : 'bg-neutral-50 border-neutral-300 text-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className={`font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 ${
            isVibrant ? 'text-amber-300' : 'text-neutral-900'
          }`}>
            <Sparkles className="w-2.5 h-2.5" />
            Reflexão Cósmica do Dia • {cosmicQuote.author}
          </span>
          <span className="text-[9px] font-mono opacity-60">
            {profile.name || "Dr. Astrônomo & Físico"}
          </span>
        </div>
        <p className="italic font-serif">
          &ldquo;{cosmicQuote.quote}&rdquo;
        </p>
        <p className={`mt-1 text-[9.5px] border-t pt-1 ${
          isVibrant ? 'border-slate-800 text-cyan-200/90' : 'border-neutral-200 text-neutral-600'
        }`}>
          ✨ <strong>Antes de dormir:</strong> {cosmicQuote.nightReflection}
        </p>
      </div>

      {/* Footer (Conforme PDF: Diário de Bordo — 21 Dias • Página X) */}
      <div className={`relative z-10 flex items-center justify-between pt-1.5 border-t text-[10px] opacity-60 ${
        isVibrant ? 'border-slate-800 text-slate-400' : 'border-neutral-200 text-neutral-600'
      }`}>
        <span>Diário de Bordo — 21 Dias • Página {pageNumber}</span>
        <span className="text-[9px] font-mono">Ritual Noturno • Preparação para o Amanhã</span>
      </div>
    </div>
  );
};
