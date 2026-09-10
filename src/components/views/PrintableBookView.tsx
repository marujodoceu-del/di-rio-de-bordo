import React, { useState, useRef } from 'react';
import { ThemeMode, ViewMode, CoachProfile } from '../../types';
import { COSMIC_DAY_QUOTES } from '../../data/cosmicQuotes';
import { DAYS_ARRAY } from '../../data/diarioContent';
import { BookCover } from '../BookCover';
import { InstructionPage } from '../InstructionPage';
import { DayQuestionsPage } from '../DayQuestionsPage';
import { DayMeditationPage } from '../DayMeditationPage';
import { ClosingPage } from '../ClosingPage';
import { ControlToolbar } from '../ControlToolbar';
import { CustomizationModal } from '../CustomizationModal';
import { PrintTipsModal } from '../PrintTipsModal';
import { ExportPdfModal } from '../ExportPdfModal';
import {
  generatePdfFromElements,
  downloadStandalonePrintHtml,
  PdfGenerationProgress,
} from '../../utils/pdfGenerator';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Printer,
  FileDown,
  Layers,
  Palette,
  Info,
} from 'lucide-react';

export const PrintableBookView: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('vibrant');
  const [viewMode, setViewMode] = useState<ViewMode>('spread');
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isPrintTipsOpen, setIsPrintTipsOpen] = useState(false);
  const [isExportPdfModalOpen, setIsExportPdfModalOpen] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<PdfGenerationProgress | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfVaultRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<CoachProfile>({
    name: 'Maru Coach',
    title: 'MÉTODO ATÔMICO',
    credentials: 'Física & Astronomia • Desenvolvimento Humano',
    coacheeName: '',
    startDate: '',
    endDate: '',
    customDedication: 'A mesma inteligência cósmica que criou o universo habita em você. Do átomo ao infinito e além.',
    includeSpiralMargin: true,
    paperSize: 'A5',
    coacheeProfession: 'Padeiro Artesanal',
    coacheeProfessionPreset: 'padeiro',
    coacheeInterests: 'Panificação artesanal, fermentação lenta (levain), aromas de trigo e calor do forno',
    coacheeMetaphor: 'Assim como o pão nobre precisa do tempo sagrado de fermentação e do calor exato do forno para crescer e nutrir, a sua vida floresce quando você respeita o processo diário e alimenta seus hábitos com constância.',
    accentPalette: 'bakery-gold',
    coverArtStyle: 'metodo-atomico',
  });

  const handleOpenExportModal = () => {
    setIsExportPdfModalOpen(true);
  };

  const handleNativePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    if (!pdfVaultRef.current) return;
    const coacheeSlug = profile.coacheeName
      ? `_${profile.coacheeName.trim().replace(/\s+/g, '_')}`
      : '';
    downloadStandalonePrintHtml(
      pdfVaultRef.current.innerHTML,
      theme,
      `Diario_de_Bordo_Cosmico${coacheeSlug}_Grafica_300DPI.html`
    );
  };

  const handleGeneratePdf = async (scope: 'full' | 'current-day' | 'sample-week') => {
    if (!pdfVaultRef.current) {
      throw new Error('Container de PDF não encontrado.');
    }

    setIsGeneratingPdf(true);
    setPdfProgress({
      currentPage: 0,
      totalPages: scope === 'full' ? 45 : scope === 'sample-week' ? 16 : 2,
      percentage: 5,
      statusText: 'Iniciando captura em alta resolução...',
    });

    try {
      let targetElements: HTMLElement[] = [];

      if (scope === 'full') {
        targetElements = Array.from(
          pdfVaultRef.current.querySelectorAll<HTMLElement>('.book-page')
        );
      } else if (scope === 'current-day') {
        if (currentDay === 0) {
          const el = pdfVaultRef.current.querySelector<HTMLElement>('#page-cover');
          if (el) targetElements.push(el);
        } else if (currentDay === -1) {
          const el = pdfVaultRef.current.querySelector<HTMLElement>('#page-instructions');
          if (el) targetElements.push(el);
        } else if (currentDay === 22) {
          const el = pdfVaultRef.current.querySelector<HTMLElement>('#page-closing');
          if (el) targetElements.push(el);
        } else {
          const qEl = pdfVaultRef.current.querySelector<HTMLElement>(`#page-day-${currentDay}`);
          const mEl = pdfVaultRef.current.querySelector<HTMLElement>(`#page-meditation-${currentDay}`);
          if (qEl) targetElements.push(qEl);
          if (mEl) targetElements.push(mEl);
        }
      } else if (scope === 'sample-week') {
        const cover = pdfVaultRef.current.querySelector<HTMLElement>('#page-cover');
        const inst = pdfVaultRef.current.querySelector<HTMLElement>('#page-instructions');
        if (cover) targetElements.push(cover);
        if (inst) targetElements.push(inst);
        for (let d = 1; d <= 7; d++) {
          const qEl = pdfVaultRef.current.querySelector<HTMLElement>(`#page-day-${d}`);
          const mEl = pdfVaultRef.current.querySelector<HTMLElement>(`#page-meditation-${d}`);
          if (qEl) targetElements.push(qEl);
          if (mEl) targetElements.push(mEl);
        }
      }

      if (targetElements.length === 0) {
        throw new Error('Nenhuma página encontrada para gerar o PDF.');
      }

      const coacheeSlug = profile.coacheeName
        ? `_${profile.coacheeName.trim().replace(/\s+/g, '_')}`
        : '';
      const scopeLabel =
        scope === 'current-day'
          ? `Dia_${currentDay >= 1 && currentDay <= 21 ? currentDay : 'Atual'}`
          : scope === 'sample-week'
          ? 'Semana_1'
          : 'Livro_Completo_45_Paginas';

      const filename = `Diario_de_Bordo_Cosmico${coacheeSlug}_${scopeLabel}.pdf`;

      await generatePdfFromElements(targetElements, filename, (prog) => {
        setPdfProgress(prog);
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isVibrant = theme === 'vibrant';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col ${
        isVibrant ? 'bg-slate-950 text-slate-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Interactive Top Control Bar */}
      <ControlToolbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'vibrant' ? 'monochrome' : 'vibrant')}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
        profile={profile}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenPrintTips={() => setIsPrintTipsOpen(true)}
        onPrint={handleOpenExportModal}
      />

      {/* Screen Notice Bar */}
      <div className="no-print bg-[#070A11]/90 border-b border-white/[0.08] px-4 py-2.5 text-center text-xs flex items-center justify-center gap-2 text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-[#F5C563] shrink-0" />
        <span>
          <strong>Personalizar Diário para Imprimir:</strong> Use as abas para alternar entre a versão{' '}
          <strong className="text-[#F5C563]">Colorida Cósmica</strong> e a versão{' '}
          <strong className="text-white">P&B Gravura Científica</strong>. Ao imprimir, todas as 45 páginas saem com diagramação exata em A5.
        </span>
      </div>

      {/* Main Reading & Book Area */}
      <main className="flex-1 py-6 px-3 sm:px-6 flex flex-col items-center justify-center">
        {/* Screen Display Mode: SPREAD (LIVRO ABERTO - DUAS PÁGINAS LADO A LADO) */}
        {viewMode === 'spread' && (
          <div className="no-print w-full max-w-5xl flex flex-col items-center">
            {/* Book Spine Simulation & Pages */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
              {currentDay === 0 && (
                <div className="w-full max-w-[420px]">
                  <BookCover theme={theme} profile={profile} />
                </div>
              )}

              {currentDay === -1 && (
                <div className="w-full max-w-[420px]">
                  <InstructionPage theme={theme} profile={profile} pageNumber={2} />
                </div>
              )}

              {currentDay >= 1 && currentDay <= 21 && (
                <>
                  {/* Left Page: Reflection Questions */}
                  <div className="w-full max-w-[420px] shadow-2xl">
                    <DayQuestionsPage
                      dayNumber={currentDay}
                      hasSpecialIdeaQuestion={currentDay === 1}
                      theme={theme}
                      profile={profile}
                      pageNumber={currentDay * 2 + 1}
                      cosmicQuote={COSMIC_DAY_QUOTES[currentDay - 1]}
                    />
                  </div>

                  {/* Right Page: Forgiveness Meditation */}
                  <div className="w-full max-w-[420px] shadow-2xl">
                    <DayMeditationPage
                      dayNumber={currentDay}
                      theme={theme}
                      profile={profile}
                      pageNumber={currentDay * 2 + 2}
                    />
                  </div>
                </>
              )}

              {currentDay === 22 && (
                <div className="w-full max-w-[420px]">
                  <ClosingPage theme={theme} profile={profile} pageNumber={45} />
                </div>
              )}
            </div>

            {/* Quick Page Navigation Footer */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentDay((prev) => Math.max(-1, prev - 1))}
                disabled={currentDay <= -1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#070A11] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0E131F] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="text-xs font-mono text-slate-400 px-3 bg-[#070A11]/60 py-1.5 rounded-lg border border-white/[0.04]">
                {currentDay === 0
                  ? 'Capa Principal'
                  : currentDay === -1
                  ? 'Instruções & Métricas'
                  : currentDay === 22
                  ? 'Contra-Capa / Conclusão'
                  : `Dia ${currentDay} de 21 (Páginas ${currentDay * 2 + 1} e ${currentDay * 2 + 2})`}
              </span>

              <button
                onClick={() => setCurrentDay((prev) => Math.min(22, prev + 1))}
                disabled={currentDay >= 22}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#070A11] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0E131F] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen Display Mode: SINGLE PAGE */}
        {viewMode === 'single' && (
          <div className="no-print w-full max-w-md flex flex-col items-center">
            {currentDay === 0 && <BookCover theme={theme} profile={profile} />}
            {currentDay === -1 && <InstructionPage theme={theme} profile={profile} pageNumber={2} />}
            {currentDay >= 1 && currentDay <= 21 && (
              <div className="w-full space-y-6">
                <DayQuestionsPage
                  dayNumber={currentDay}
                  hasSpecialIdeaQuestion={currentDay === 1}
                  theme={theme}
                  profile={profile}
                  pageNumber={currentDay * 2 + 1}
                  cosmicQuote={COSMIC_DAY_QUOTES[currentDay - 1]}
                />
                <DayMeditationPage
                  dayNumber={currentDay}
                  theme={theme}
                  profile={profile}
                  pageNumber={currentDay * 2 + 2}
                />
              </div>
            )}
            {currentDay === 22 && <ClosingPage theme={theme} profile={profile} pageNumber={45} />}
          </div>
        )}

        {/* Screen Display Mode: ALL 45 PAGES (Scroll Contínuo) */}
        {viewMode === 'all' && (
          <div className="no-print w-full max-w-2xl space-y-8 flex flex-col items-center">
            <BookCover theme={theme} profile={profile} />
            <InstructionPage theme={theme} profile={profile} pageNumber={2} />
            {DAYS_ARRAY.map((item, idx) => (
              <React.Fragment key={`all-mode-${item.dayNumber}`}>
                <DayQuestionsPage
                  dayNumber={item.dayNumber}
                  hasSpecialIdeaQuestion={item.hasSpecialIdeaQuestion}
                  theme={theme}
                  profile={profile}
                  pageNumber={item.dayNumber * 2 + 1}
                  cosmicQuote={COSMIC_DAY_QUOTES[idx]}
                />
                <DayMeditationPage
                  dayNumber={item.dayNumber}
                  theme={theme}
                  profile={profile}
                  pageNumber={item.dayNumber * 2 + 2}
                />
              </React.Fragment>
            ))}
            <ClosingPage theme={theme} profile={profile} pageNumber={45} />
          </div>
        )}

        {/* NATIVE PRINT CONTAINER (Acionado por window.print()) */}
        <div className="print-container hidden">
          <BookCover theme={theme} profile={profile} />
          <InstructionPage theme={theme} profile={profile} pageNumber={2} />
          {DAYS_ARRAY.map((item, idx) => (
            <React.Fragment key={`print-mode-${item.dayNumber}`}>
              <DayQuestionsPage
                dayNumber={item.dayNumber}
                hasSpecialIdeaQuestion={item.hasSpecialIdeaQuestion}
                theme={theme}
                profile={profile}
                pageNumber={item.dayNumber * 2 + 1}
                cosmicQuote={COSMIC_DAY_QUOTES[idx]}
              />
              <DayMeditationPage
                dayNumber={item.dayNumber}
                theme={theme}
                profile={profile}
                pageNumber={item.dayNumber * 2 + 2}
              />
            </React.Fragment>
          ))}
          <ClosingPage theme={theme} profile={profile} pageNumber={45} />
        </div>

        {/* Dedicated High-Fidelity Rendering Vault for PDF Generation (Always DOM-mounted, off-screen) */}
        <div
          ref={pdfVaultRef}
          id="pdf-render-vault"
          style={{
            position: 'fixed',
            left: '-1000vw',
            top: 0,
            width: '148mm',
            zIndex: -9999,
            opacity: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {/* Cover (Page 1 - Not numbered) */}
          <BookCover theme={theme} profile={profile} />

          {/* Page 2: Instructions */}
          <InstructionPage theme={theme} profile={profile} pageNumber={2} />

          {/* Days 1 to 21 */}
          {DAYS_ARRAY.map((item, idx) => (
            <React.Fragment key={`pdf-vault-${item.dayNumber}`}>
              <DayQuestionsPage
                dayNumber={item.dayNumber}
                hasSpecialIdeaQuestion={item.hasSpecialIdeaQuestion}
                theme={theme}
                profile={profile}
                pageNumber={item.dayNumber * 2 + 1}
                cosmicQuote={COSMIC_DAY_QUOTES[idx]}
              />
              <DayMeditationPage
                dayNumber={item.dayNumber}
                theme={theme}
                profile={profile}
                pageNumber={item.dayNumber * 2 + 2}
              />
            </React.Fragment>
          ))}

          {/* Page 45: Closing */}
          <ClosingPage theme={theme} profile={profile} pageNumber={45} />
        </div>
      </main>

      {/* Floating Action Bar for Quick Printing on Screen */}
      <div className="no-print fixed bottom-16 md:bottom-4 right-4 z-30 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md border border-amber-500/40 p-2 rounded-2xl shadow-2xl">
        <button
          onClick={() => setTheme(theme === 'vibrant' ? 'monochrome' : 'vibrant')}
          className={`p-2.5 rounded-xl border transition ${
            isVibrant
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
              : 'bg-neutral-800 border-neutral-600 text-white'
          }`}
          title="Trocar tema de impressão (Colorido Cósmico ou P&B Gravura)"
        >
          <Palette className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition"
          title="Personalizar Nome e Dados"
        >
          <Layers className="w-5 h-5 text-amber-400" />
        </button>

        <button
          onClick={handleOpenExportModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition active:scale-95"
          title="Exportar e baixar arquivo PDF no computador"
        >
          <FileDown className="w-4 h-4" />
          <span>Exportar PDF / Baixar</span>
        </button>
      </div>

      {/* Modals */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        profile={profile}
        onSave={setProfile}
      />

      <PrintTipsModal
        isOpen={isPrintTipsOpen}
        onClose={() => setIsPrintTipsOpen(false)}
        onPrintNow={handleOpenExportModal}
      />

      <ExportPdfModal
        isOpen={isExportPdfModalOpen}
        onClose={() => setIsExportPdfModalOpen(false)}
        theme={theme}
        profile={profile}
        currentDay={currentDay}
        onGeneratePdf={handleGeneratePdf}
        onDownloadHtml={handleDownloadHtml}
        onNativePrint={handleNativePrint}
        progress={pdfProgress}
        isGenerating={isGeneratingPdf}
      />
    </div>
  );
};
