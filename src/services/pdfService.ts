import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads the Europass CV DOM element as a high-definition A4 PDF
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
  const filename = `CV_Europass_${safeName}.pdf`;

  try {
    // Scroll element into view and ensure images are loaded
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crisp high-density print
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Subsequent pages if CV overflows A4
    while (heightLeft > 5) {
      position = position - pdfHeight;
      pdf.addPage('a4', 'portrait');
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF with jsPDF/html2canvas:', error);
    // Fallback to browser native print dialog
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
