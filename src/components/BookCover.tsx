import React from 'react';
import { CoachProfile, ThemeMode, CoverArtStyle } from '../types';
import {
  Sparkles,
  Compass,
  Orbit,
  Moon,
  Atom,
  Brain,
  Target,
  Flower2,
  Mountain,
  Flame,
  Wheat,
  Feather,
  CheckCircle2,
} from 'lucide-react';
import {
  METODO_ATOMICO_COVER_DATA_URL,
  COACHEE_BAKER_COVER_DATA_URL,
  VIBRANT_COVER_DATA_URL,
  BW_COVER_DATA_URL,
} from '../assets/images/coverImages';
import { PALETTE_DEFINITIONS, COACHEE_PRESETS } from '../data/coacheePresets';

interface BookCoverProps {
  theme: ThemeMode;
  profile: CoachProfile;
  pageNumber?: number;
}

export const BookCover: React.FC<BookCoverProps> = ({ theme, profile }) => {
  const isVibrant = theme === 'vibrant';
  const coverStyle: CoverArtStyle = profile.coverArtStyle || 'metodo-atomico';
  const palette = PALETTE_DEFINITIONS[profile.accentPalette || 'cosmic-amber'];
  const preset = profile.coacheeProfessionPreset ? COACHEE_PRESETS[profile.coacheeProfessionPreset] : null;

  // Determine which background image asset to use
  let coverImageSrc = METODO_ATOMICO_COVER_DATA_URL; // Default: Método Atômico from user image
  if (coverStyle === 'custom-upload' && profile.customCoverDataUrl) {
    coverImageSrc = profile.customCoverDataUrl;
  } else if (coverStyle === 'coachee-archetype') {
    coverImageSrc = COACHEE_BAKER_COVER_DATA_URL;
  } else if (coverStyle === 'cosmic-vibrant') {
    coverImageSrc = VIBRANT_COVER_DATA_URL;
  } else if (coverStyle === 'celestial-bw') {
    coverImageSrc = BW_COVER_DATA_URL;
  } else if (!isVibrant) {
    // If global theme is monochrome and no specific style forced, fallback to BW
    coverImageSrc = BW_COVER_DATA_URL;
  }

  const isMetodoAtomico = coverStyle === 'metodo-atomico' || coverStyle === 'coachee-archetype' || !coverStyle;

  return (
    <div
      id="page-cover"
      className={`book-page relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-colors duration-300 ${
        isVibrant
          ? 'bg-slate-950 text-amber-100 border border-amber-500/30'
          : 'bg-white text-neutral-900 border border-neutral-300'
      } ${profile.includeSpiralMargin ? 'pl-14 sm:pl-16' : ''}`}
      style={{
        aspectRatio: '148 / 210', // Standard A5 ratio
        boxSizing: 'border-box',
      }}
    >
      {/* Background Graphic Asset (Artistic Canvas) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={coverImageSrc}
          alt="Capa Diário de Bordo Método Atômico"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Subtle readable overlay */}
        {isVibrant ? (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-slate-950/90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95" />
        )}
      </div>

      {/* Outer Border Geometry */}
      <div
        className={`absolute inset-3 sm:inset-5 border pointer-events-none z-0 rounded-lg transition-colors ${
          isVibrant ? 'border-amber-400/30' : 'border-neutral-700/50'
        }`}
      >
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-current" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-current" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-current" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-current" />
      </div>

      {/* TOP HEADER: CIÊNCIA • ESPIRITUALIDADE • DISCIPLINA • AÇÃO • PROPÓSITO */}
      <div className="relative z-10 text-center pt-1">
        <div
          className={`inline-flex items-center justify-center flex-wrap gap-1.5 px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-mono mb-2 ${
            isVibrant
              ? 'bg-slate-950/80 text-amber-200 border border-amber-400/40 shadow-sm shadow-black/60'
              : 'bg-neutral-100 text-neutral-800 border border-neutral-400'
          }`}
        >
          <span>CIÊNCIA</span>
          <span className="opacity-40">•</span>
          <span>ESPIRITUALIDADE</span>
          <span className="opacity-40">•</span>
          <span>DISCIPLINA</span>
          <span className="opacity-40">•</span>
          <span>AÇÃO</span>
          <span className="opacity-40">•</span>
          <span>PROPÓSITO</span>
        </div>

        {/* Top Right Inspiring Quote Ribbon */}
        <div className="flex justify-end pr-2">
          <div className={`text-right max-w-[200px] text-[8.5px] sm:text-[9.5px] leading-tight italic font-serif ${
            isVibrant ? 'text-amber-200/90' : 'text-neutral-700'
          }`}>
            <p className="font-semibold">&ldquo;Do átomo ao infinito e além...&rdquo;</p>
            <p className="opacity-75 uppercase tracking-wider text-[7.5px] font-sans not-italic mt-0.5">
              A mesma inteligência que criou o universo habita em você.
            </p>
          </div>
        </div>
      </div>

      {/* CENTER: TITLES & METHOD AESTHETICS */}
      <div className="relative z-10 text-center my-auto py-2">
        {/* Diário de Bordo - 21 Dias Header */}
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
          <span className={`text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] font-semibold ${
            isVibrant ? 'text-amber-300' : 'text-neutral-800'
          }`}>
            DIÁRIO DE BORDO — 21 DIAS
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
        </div>

        {/* Main Title: MÉTODO ATÔMICO */}
        <h1
          className={`text-3xl sm:text-5xl font-black tracking-wider uppercase drop-shadow-md leading-none ${
            isVibrant
              ? 'text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-500'
              : 'text-neutral-950 font-black'
          }`}
          style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
        >
          {profile.title && profile.title.toUpperCase().includes('MÉTODO')
            ? profile.title
            : 'MÉTODO ATÔMICO'}
        </h1>

        {/* Subtitle: PEQUENAS ESCOLHAS GRANDES TRANSFORMAÇÕES */}
        <p
          className={`text-[9.5px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase mt-2 ${
            isVibrant ? 'text-amber-100/90' : 'text-neutral-800'
          }`}
        >
          Pequenas Escolhas • Grandes Transformações
        </p>

        {/* 5 Core Pillars: CORPO | MENTE | ESPÍRITO | HÁBITOS | RESULTADOS */}
        <div className={`mt-3 py-1.5 px-3 rounded-lg mx-auto max-w-sm flex items-center justify-between border ${
          isVibrant
            ? 'bg-slate-950/70 border-amber-400/30 text-amber-200'
            : 'bg-neutral-100 border-neutral-300 text-neutral-800'
        }`}>
          <div className="flex flex-col items-center gap-0.5">
            <Atom className="w-3 h-3 text-amber-400" />
            <span className="text-[7.5px] font-mono uppercase tracking-wider">Corpo</span>
          </div>
          <span className="opacity-30">|</span>
          <div className="flex flex-col items-center gap-0.5">
            <Brain className="w-3 h-3 text-amber-400" />
            <span className="text-[7.5px] font-mono uppercase tracking-wider">Mente</span>
          </div>
          <span className="opacity-30">|</span>
          <div className="flex flex-col items-center gap-0.5">
            <Flower2 className="w-3 h-3 text-amber-400" />
            <span className="text-[7.5px] font-mono uppercase tracking-wider">Espírito</span>
          </div>
          <span className="opacity-30">|</span>
          <div className="flex flex-col items-center gap-0.5">
            <Mountain className="w-3 h-3 text-amber-400" />
            <span className="text-[7.5px] font-mono uppercase tracking-wider">Hábitos</span>
          </div>
          <span className="opacity-30">|</span>
          <div className="flex flex-col items-center gap-0.5">
            <Target className="w-3 h-3 text-amber-400" />
            <span className="text-[7.5px] font-mono uppercase tracking-wider">Resultados</span>
          </div>
        </div>

        {/* Coachee Persona Specific Metaphor or Dedication */}
        {profile.coacheeMetaphor ? (
          <div className={`mt-2.5 p-2 rounded border mx-auto max-w-sm text-left ${
            isVibrant ? 'bg-amber-950/30 border-amber-500/30 text-amber-100' : 'bg-neutral-50 border-neutral-300 text-neutral-800'
          }`}>
            <div className="flex items-center gap-1.5 mb-1 text-[8px] font-mono uppercase tracking-wider text-amber-300">
              {profile.coacheeProfessionPreset === 'padeiro' && <Wheat className="w-3 h-3 text-amber-400" />}
              <span>Metáfora do Mentor para o Praticante:</span>
            </div>
            <p className="text-[9.5px] italic leading-relaxed font-serif">
              &ldquo;{profile.coacheeMetaphor}&rdquo;
            </p>
          </div>
        ) : profile.customDedication ? (
          <p className={`mt-2.5 text-[9.5px] sm:text-[10.5px] italic font-serif max-w-sm mx-auto leading-relaxed ${
            isVibrant ? 'text-amber-200/80' : 'text-neutral-700'
          }`}>
            &ldquo;{profile.customDedication}&rdquo;
          </p>
        ) : null}
      </div>

      {/* BOTTOM SECTION: Coachee Identification & Coach Credential Badges */}
      <div className="relative z-10 space-y-2">
        {/* Coachee Identification Box */}
        <div
          className={`rounded-xl p-3 border backdrop-blur-xs text-xs ${
            isVibrant
              ? 'bg-slate-950/85 border-amber-400/40 text-slate-200 shadow-md shadow-black/50'
              : 'bg-neutral-50 border-neutral-300 text-neutral-800'
          }`}
        >
          <div className="space-y-1.5">
            {/* Coachee Name and Profession */}
            <div className={`border-b pb-1.5 ${isVibrant ? 'border-slate-800' : 'border-neutral-200'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] opacity-80 shrink-0 whitespace-nowrap min-w-[145px]">
                  Praticante (Coachee):
                </span>
                <div className="flex-1 text-right min-w-[120px]">
                  {profile.coacheeName ? (
                    <span
                      className={`font-serif font-bold text-sm sm:text-base truncate block ${
                        isVibrant ? 'text-amber-300' : 'text-neutral-900'
                      }`}
                    >
                      {profile.coacheeName}
                    </span>
                  ) : (
                    <div
                      className={`w-full border-b border-dashed mt-2 h-2 ${
                        isVibrant ? 'border-amber-400/50' : 'border-neutral-400'
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Optional Coachee Profession / Archetype display */}
              {(profile.coacheeProfession || (preset && preset.title)) && (
                <div className="flex items-center justify-between gap-2 mt-1 text-[9.5px]">
                  <span className="opacity-70 uppercase tracking-wider text-[8.5px]">Ofício / Vocação:</span>
                  <span className="font-semibold text-amber-200 truncate flex items-center gap-1">
                    {profile.coacheeProfessionPreset === 'padeiro' && <Wheat className="w-2.5 h-2.5 text-amber-400" />}
                    {profile.coacheeProfession || preset?.title}
                  </span>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 pt-0.5 text-[10px]">
              <div className="flex flex-col">
                <span className="opacity-70 uppercase tracking-wider text-[8.5px]">Início da Jornada:</span>
                <span className="font-mono border-b border-dotted pb-0.5 text-[10px]">
                  {profile.startDate || '____ / ____ / ________'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="opacity-70 uppercase tracking-wider text-[8.5px]">Consolidação:</span>
                <span className="font-mono border-b border-dotted pb-0.5 text-[10px]">
                  {profile.endDate || '____ / ____ / ________'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Slogans & Coach Signature */}
        <div className="flex items-end justify-between gap-3 pt-1">
          {/* Left: MAIS CONSCIÊNCIA. MAIS VIDA. MAIS VOCÊ. */}
          <div className="border-l-2 border-amber-400 pl-2">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight text-amber-300">
              Mais Consciência.
            </p>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight text-amber-200">
              Mais Vida.
            </p>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight text-yellow-400">
              Mais Você.
            </p>
          </div>

          {/* Right: Maru Coach / Adilson branding */}
          <div className="text-right">
            <span
              className="text-lg sm:text-xl font-serif font-bold text-amber-300 italic block leading-none"
              style={{ fontFamily: "'Brush Script MT', 'Playfair Display', cursive" }}
            >
              {profile.name || 'Maru Coach'}
            </span>
            <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400 block mt-0.5">
              {profile.credentials || 'Física & Astronomia • Desenvolvimento Humano'}
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.2em] font-mono text-amber-400/80 block">
              Mentoria Cósmica
            </span>
          </div>
        </div>

        {/* Bottom Footer: A JORNADA MAIS IMPORTANTE É A QUE TE LEVA DE VOLTA A SI. */}
        <div className="text-center pt-1 border-t border-current/20">
          <p className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.25em] font-serif font-medium opacity-80">
            A jornada mais importante é a que te leva de volta a si.
          </p>
        </div>
      </div>
    </div>
  );
};
