import React from 'react';
import { ThemeMode, ViewMode, CoachProfile } from '../types';
import {
  Palette,
  Printer,
  FileDown,
  SlidersHorizontal,
  BookOpen,
  LayoutGrid,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Orbit,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ControlToolbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  currentDay: number; // 0 = Capa, -1 = Instruções, 1..21 = Dias, 22 = Conclusão
  onSelectDay: (day: number) => void;
  profile: CoachProfile;
  onOpenCustomizer: () => void;
  onOpenPrintTips: () => void;
  onPrint: () => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  theme,
  onToggleTheme,
  viewMode,
  onChangeViewMode,
  currentDay,
  onSelectDay,
  profile,
  onOpenCustomizer,
  onOpenPrintTips,
  onPrint,
}) => {
  const isVibrant = theme === 'vibrant';

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400/20 to-cyan-500/20 border border-amber-400/40 text-amber-300">
              <Orbit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm tracking-wide text-amber-200">
                  Método Atômico • Diário 21 Dias
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {profile.name || "Maru Coach"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                <span>Coachee:</span>
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="font-medium text-amber-300 hover:text-amber-200 underline decoration-dotted flex items-center gap-1 cursor-pointer"
                >
                  {profile.coacheeName || 'Clique para definir'}
                  {profile.coacheeProfession && (
                    <span className="text-[9.5px] text-slate-400 no-underline font-normal">
                      • {profile.coacheeProfession.split('/')[0].trim()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Theme switcher on mobile */}
          <div className="flex items-center md:hidden gap-1.5">
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                isVibrant
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                  : 'bg-neutral-800 border-neutral-600 text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{isVibrant ? 'Colorido' : 'P&B'}</span>
            </button>
          </div>
        </div>

        {/* Center: Day Navigator & View Mode Controls */}
        <div className="flex items-center flex-wrap justify-center gap-2 w-full md:w-auto">
          {/* Day Navigation */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => onSelectDay(Math.max(-1, currentDay - 1))}
              disabled={currentDay <= -1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={currentDay}
              onChange={(e) => onSelectDay(Number(e.target.value))}
              className="bg-transparent text-xs font-medium px-2 py-0.5 text-amber-200 focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900 text-slate-200">Capa Principal</option>
              <option value={-1} className="bg-slate-900 text-slate-200">Instruções & Ritual Noturno</option>
              {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day} className="bg-slate-900 text-slate-200">
                  Dia {day} (Perguntas & Meditação)
                </option>
              ))}
              <option value={22} className="bg-slate-900 text-slate-200">Página 45 (Conclusão & Expansão)</option>
            </select>

            <button
              onClick={() => onSelectDay(Math.min(22, currentDay + 1))}
              disabled={currentDay >= 22}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition"
              title="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Modes */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => onChangeViewMode('all')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition ${
                viewMode === 'all'
                  ? 'bg-amber-400/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualizar todas as 45 páginas para conferência e impressão"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Todas (Impressão)</span>
            </button>

            <button
              onClick={() => onChangeViewMode('spread')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition ${
                viewMode === 'spread'
                  ? 'bg-amber-400/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualizar em páginas duplas (Livro aberto)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Livro Aberto</span>
            </button>

            <button
              onClick={() => onChangeViewMode('single')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition ${
                viewMode === 'single'
                  ? 'bg-amber-400/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualizar página individual com foco"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Página Única</span>
            </button>
          </div>
        </div>

        {/* Right: Actions (Theme Toggle, Customize, Guide, Print) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Desktop Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isVibrant
                ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border-amber-400/40 text-amber-300 hover:border-amber-400'
                : 'bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700'
            }`}
            title="Alternar entre versão Colorida Vibrante e Preto e Branco Gravura"
          >
            <Palette className="w-4 h-4" />
            <span>{isVibrant ? '🌌 Colorida & Vibrante' : '📜 P&B Gravura Científica'}</span>
          </button>

          {/* Personalizar Coachee & Estilos */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-xs font-semibold text-amber-200 hover:text-white transition shadow-xs"
            title="Personalizar dados do mentor, coachee, profissão e modelos de capa"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Personalizar Coachee & Capas</span>
          </button>

          {/* Guia de Impressão */}
          <button
            onClick={onOpenPrintTips}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
            title="Dicas de Impressão para Gráfica / Copyart"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Print / Save PDF Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
            title="Exportar arquivo PDF para salvar no computador ou imprimir"
          >
            <FileDown className="w-4 h-4" />
            <span>Exportar PDF / Imprimir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
