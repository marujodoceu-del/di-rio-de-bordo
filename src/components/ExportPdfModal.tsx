import React, { useState } from 'react';
import { ThemeMode, CoachProfile } from '../types';
import { PdfGenerationProgress } from '../utils/pdfGenerator';
import {
  FileDown,
  Printer,
  CheckCircle2,
  Sparkles,
  Loader2,
  X,
  Layers,
  FileCode,
  Calendar,
  BookOpen,
  ExternalLink,
  Info,
} from 'lucide-react';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  profile: CoachProfile;
  currentDay: number;
  onGeneratePdf: (scope: 'full' | 'current-day' | 'sample-week') => Promise<void>;
  onDownloadHtml: () => void;
  onNativePrint: () => void;
  progress: PdfGenerationProgress | null;
  isGenerating: boolean;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  theme,
  profile,
  currentDay,
  onGeneratePdf,
  onDownloadHtml,
  onNativePrint,
  progress,
  isGenerating,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<'full' | 'current-day' | 'sample-week'>('full');

  if (!isOpen) return null;

  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleStartPdfDownload = async () => {
    setDownloadSuccess(false);
    setErrorMessage(null);
    try {
      await onGeneratePdf(selectedScope);
      setDownloadSuccess(true);
    } catch (err: any) {
      console.error('Erro ao gerar PDF:', err);
      const friendlyMessage =
        err?.message ||
        (err && typeof err === 'object' && 'isTrusted' in err
          ? 'Falha momentânea ao processar recursos visuais. Tente novamente ou use a opção de baixar em HTML.'
          : String(err));
      setErrorMessage(friendlyMessage || 'Ocorreu um erro ao compilar o PDF. Tente baixar em HTML ou em nova aba.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 text-slate-100 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-amber-200 font-serif">
                Exportar & Baixar Arquivo PDF
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Gere o arquivo <span className="text-amber-300 font-mono font-semibold">.pdf</span> real direto no seu computador.
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-slate-300 flex-1">
          {/* Why it didn't print notice */}
          {isIframe && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5">
                  Por que nenhum arquivo saía antes?
                </strong>
                O navegador restringe a janela nativa de impressão dentro da visualização em tela dividida. 
                Ao clicar em <strong className="text-white">Baixar Arquivo PDF (.pdf)</strong> abaixo, o sistema compila e salva o arquivo diretamente na sua pasta de <strong>Downloads</strong>!
              </div>
            </div>
          )}

          {/* Scope Selector */}
          {!isGenerating && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block">
                Escolha o que deseja exportar:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Full Book */}
                <button
                  type="button"
                  onClick={() => setSelectedScope('full')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition ${
                    selectedScope === 'full'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-100 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-current/30 text-amber-300">
                      45 pág.
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Livro Completo</span>
                    <span className="text-[10px] text-slate-400">Capa + 21 Dias + Fim</span>
                  </div>
                </button>

                {/* Current Day */}
                <button
                  type="button"
                  onClick={() => setSelectedScope('current-day')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition ${
                    selectedScope === 'current-day'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-100 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Calendar className="w-4 h-4 text-cyan-300" />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-current/30 text-cyan-300">
                      2 pág.
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">
                      {currentDay >= 1 && currentDay <= 21 ? `Dia ${currentDay}` : 'Página Atual'}
                    </span>
                    <span className="text-[10px] text-slate-400">Super Rápido (~2s)</span>
                  </div>
                </button>

                {/* Sample Week */}
                <button
                  type="button"
                  onClick={() => setSelectedScope('sample-week')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition ${
                    selectedScope === 'sample-week'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-100 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Layers className="w-4 h-4 text-emerald-300" />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-current/30 text-emerald-300">
                      16 pág.
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Semana 1</span>
                    <span className="text-[10px] text-slate-400">Capa + Dias 1 a 7</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Generation Progress Bar */}
          {isGenerating && progress && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-300 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  {progress.statusText}
                </span>
                <span className="font-mono text-amber-300 font-bold">{progress.percentage}%</span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-full rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 italic text-center">
                Renderizando em alta fidelidade no formato A5 ({progress.currentPage} de {progress.totalPages} páginas)... Por favor, aguarde o download iniciar automaticamente.
              </p>
            </div>
          )}

          {/* Success message */}
          {downloadSuccess && !isGenerating && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-emerald-300 block font-semibold">
                  Arquivo PDF baixado com sucesso!
                </strong>
                O arquivo <span className="font-mono underline font-medium">Diario_de_Bordo_Cosmico_21_Dias.pdf</span> foi salvo na sua pasta de Downloads.
              </div>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs">
              <strong>Erro:</strong> {errorMessage}
            </div>
          )}

          {/* Additional Options */}
          {!isGenerating && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Outras Formas de Imprimir & Enviar:
              </span>

              {/* Standalone HTML */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Baixar Arquivo HTML para Gráfica (Instantâneo)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Gera um arquivo offline completo com todas as 45 páginas prontas para impressão direta em 300 DPI sem esperar renderização.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onDownloadHtml}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 shrink-0 transition hover:border-cyan-500/40"
                >
                  Baixar HTML
                </button>
              </div>

              {/* Open in New Tab */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Abrir em Nova Aba do Navegador</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Abre fora do visualizador para que o comando de impressão do navegador (Ctrl + P) funcione nativamente sem restrições.
                  </p>
                </div>
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-300 shrink-0 transition hover:border-emerald-500/40 flex items-center gap-1"
                >
                  <span>Abrir Aba</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
          <button
            type="button"
            onClick={onNativePrint}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-30"
            title="Tentar acionar a janela de impressão do navegador"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Janela de Impressão</span>
            <span className="sm:hidden">Imprimir</span>
          </button>

          <div className="flex items-center gap-2">
            {!isGenerating && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Fechar
              </button>
            )}

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleStartPdfDownload}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Baixar Arquivo PDF (.pdf)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
