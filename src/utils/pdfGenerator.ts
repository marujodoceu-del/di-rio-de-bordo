import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';

export interface PdfGenerationProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
  statusText: string;
}

export type ProgressCallback = (progress: PdfGenerationProgress) => void;

/**
 * Captures an HTML element into a JPEG data URL using native SVG foreignObject,
 * supporting modern CSS color spaces like oklch, lab, and color-mix.
 * Configured with skipFonts and fontEmbedCSS to avoid CORS stylesheet errors,
 * and robust image error handling to avoid {"isTrusted": true} rejections.
 */
async function captureElementToJpeg(el: HTMLElement): Promise<string> {
  const primaryOptions = {
    quality: 0.92,
    pixelRatio: 1.6,
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS: '',
    onImageErrorHandler: (err: any) => {
      console.warn('Image capture handled fallback:', err);
      return '';
    },
    style: {
      margin: '0',
      opacity: '1',
      transform: 'none',
    },
  };

  try {
    return await toJpeg(el, primaryOptions);
  } catch (err: any) {
    console.warn('Tentativa primária de captura falhou, aplicando modo de compatibilidade:', err);
    try {
      return await toJpeg(el, {
        ...primaryOptions,
        quality: 0.85,
        pixelRatio: 1.2,
      });
    } catch (fallbackErr: any) {
      const msg = fallbackErr instanceof Error
        ? fallbackErr.message
        : typeof fallbackErr === 'object' && fallbackErr && 'isTrusted' in fallbackErr
          ? 'Falha ao processar recursos gráficos na camada SVG/Canvas'
          : String(fallbackErr);
      throw new Error(`Erro ao renderizar página: ${msg}`);
    }
  }
}

/**
 * Generates an A5 PDF from an array of HTMLElement nodes and triggers download.
 * Completely immune to "unsupported color function oklch" errors.
 */
export async function generatePdfFromElements(
  elements: HTMLElement[],
  filename: string = 'Diario_de_Bordo_Cosmico_21_Dias.pdf',
  onProgress?: ProgressCallback
): Promise<void> {
  const total = elements.length;
  if (total === 0) {
    throw new Error('Nenhum elemento fornecido para gerar o PDF.');
  }

  // Create jsPDF instance for A5 portrait (148 x 210 mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
    compress: true,
  });

  const a5Width = 148;
  const a5Height = 210;

  for (let i = 0; i < total; i++) {
    const el = elements[i];
    const pageNum = i + 1;

    if (onProgress) {
      onProgress({
        currentPage: pageNum,
        totalPages: total,
        percentage: Math.round(((pageNum - 0.7) / total) * 100),
        statusText: `Capturando página ${pageNum} de ${total}...`,
      });
    }

    // Capture DOM element using html-to-image (native browser engine, supports oklch)
    const imgData = await captureElementToJpeg(el);

    if (i > 0) {
      pdf.addPage('a5', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, a5Width, a5Height, undefined, 'FAST');

    if (onProgress) {
      onProgress({
        currentPage: pageNum,
        totalPages: total,
        percentage: Math.round((pageNum / total) * 100),
        statusText: `Página ${pageNum} adicionada ao documento.`,
      });
    }

    // Yield control to UI thread to keep animations and progress responsive
    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  if (onProgress) {
    onProgress({
      currentPage: total,
      totalPages: total,
      percentage: 100,
      statusText: 'Empacotando e baixando arquivo PDF...',
    });
  }

  // Save the PDF file to user's downloads folder
  pdf.save(filename);
}

/**
 * Generates and downloads a complete, standalone HTML document
 * containing all print styles and HTML nodes for 300 DPI vector printing.
 */
export function downloadStandalonePrintHtml(
  contentHtml: string,
  theme: 'vibrant' | 'monochrome',
  filename: string = 'Diario_de_Bordo_Cosmico_Grafica.html'
): void {
  const isVibrant = theme === 'vibrant';
  const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Diário de Bordo Cósmico — 21 Dias (Para Impressão & Gráfica)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: ${isVibrant ? '#030712' : '#f5f5f5'};
      color: ${isVibrant ? '#f8fafc' : '#171717'};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .book-page {
      width: 148mm;
      height: 210mm;
      margin: 10mm auto;
      padding: 16mm 14mm 14mm 14mm;
      background: ${isVibrant ? '#020617' : '#ffffff'};
      color: ${isVibrant ? '#f8fafc' : '#171717'};
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      page-break-after: always;
      break-after: page;
    }
    @media print {
      @page { size: A5 portrait; margin: 0; }
      body { background: transparent; }
      .book-page { margin: 0; box-shadow: none; width: 148mm; height: 210mm; }
      #page-instructions { padding: 10mm 12mm 8mm 12mm !important; }
    }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
