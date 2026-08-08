import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportLetterToPdf(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Letter document element not found');
  }

  // Hide UI overlays if any during capture
  const canvas = await html2canvas(element, {
    scale: 2.5, // Crisp 300dpi-equivalent resolution
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 794, // Standard A4 pixel width at 96dpi (210mm)
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // Initialize A4 portrait PDF in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
}
