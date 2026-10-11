import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads the Europass CV DOM element as a high-definition A4 PDF
 * Guaranteed exact A4 page slicing with zero empty trailing pages.
 */
export async function generateAndDownloadPdf(
  elementId: string,
  candidateName: string = 'Curriculum_Europass'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  // Sanitize filename
  const safeName = candidateName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `CV_Europass_${safeName || 'Curriculum'}.pdf`;

  try {
    // High-resolution capture at 2x scale
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Exact A4 height in canvas pixels (A4 aspect ratio: 297 / 210 = 1.4142857)
    const a4Ratio = pdfHeight / pdfWidth;
    const pageCanvasHeight = Math.round(canvas.width * a4Ratio);

    // Calculate total pages:
    // Only add subsequent pages if content overflows the first page by more than 40 canvas pixels
    const totalPages = Math.max(1, Math.ceil((canvas.height - 40) / pageCanvasHeight));

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Create an exact A4 page canvas slice to avoid any overflow or trailing blanks
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const ctx = pageCanvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const sourceY = page * pageCanvasHeight;
        const sourceHeight = Math.min(canvas.height - sourceY, pageCanvasHeight);

        if (sourceHeight > 0) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF with jsPDF/html2canvas:', error);
    window.print();
    return false;
  }
}

/**
 * Native print dialog (vector high definition)
 */
export function triggerNativePrint(): void {
  window.print();
}

/**
 * Share CV or trigger native mobile action
 */
export async function shareCvDocument(candidateName: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `CV Europass - ${candidateName}`,
        text: `Currículum Vitae Europass en formato A4 creado con IA.`,
        url: window.location.href,
      });
      return true;
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.warn('Share error:', e);
      }
    }
  }
  return false;
}
