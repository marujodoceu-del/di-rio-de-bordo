import React from 'react';
import { X, Printer, FileText, CheckCircle2, AlertCircle, Sparkles, FileDown } from 'lucide-react';

interface PrintTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintNow: () => void;
}

export const PrintTipsModal: React.FC<PrintTipsModalProps> = ({
  isOpen,
  onClose,
  onPrintNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 text-slate-100 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-200 font-serif">
                Guia de Impressão & Exportação PDF (Copyart / Gráfica)
              </h3>
              <p className="text-xs text-slate-400">
                Como gerar seu livro com precisão de alinhamento e qualidade profissional.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs leading-relaxed text-slate-300">
          {/* Box 1: Browser Print Dialog Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Configurações na Janela de Impressão (Ctrl + P / Cmd + P):
            </h4>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Destino:</strong> Selecione &ldquo;Salvar como PDF&rdquo; (para enviar à gráfica) ou sua impressora direta.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tamanho do Papel:</strong> Selecione <strong>A5</strong> (148 x 210 mm) ou <strong>A4</strong> conforme configurado.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Margens:</strong> Defina como <strong>&ldquo;Nenhuma&rdquo; (None)</strong> ou &ldquo;Padrão&rdquo; para manter o enquadramento exato.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Gráficos de Segundo Plano:</strong> <strong className="text-amber-300">OBRIGATÓRIO MARCAR</strong> para imprimir os fundos estelares, degradês e bordas.
                </span>
              </li>
            </ul>
          </div>

          {/* Box 2: Printing options (Color vs Monochrome) */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              As Duas Opções Criadas para Seus Coachees:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/20">
                <span className="font-bold text-amber-300 block mb-1">🌌 Colorida & Vibrante</span>
                <span>Fundo noturno cósmico, dourado estelar, nebulosa e alta riqueza sensorial para impressão gráfica de luxo.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                <span className="font-bold text-white block mb-1">📜 P&B Gravura Científica</span>
                <span>Minimalismo monocromático clássico de astrolábios e constelações. Econômico e elegante em impressora laser P&B.</span>
              </div>
            </div>
          </div>

          {/* Box 3: Graphic shop / Copyart specs */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Instruções para passar ao balconista da Copyart:
            </h4>
            <p>
              &bull; <strong>Papel do Miolo:</strong> Offset ou Sulfite 90g/m² a 120g/m² (evita que a caneta tinteiro ou esferográfica transpasse a folha ao escrever).
            </p>
            <p>
              &bull; <strong>Capa:</strong> Papel Couchê 250g a 300g com laminação fosca (ou Capa Dura para versão premium).
            </p>
            <p>
              &bull; <strong>Encadernação:</strong> Wire-O (espiral metálico duplo) preto ou bronze para abrir 360° com conforto para escrita na cama antes de dormir.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrintNow();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-lg shadow-amber-500/20"
          >
            <FileDown className="w-4 h-4" />
            Exportar Arquivo PDF / Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};
