/**
 * Triggers download of the sample report PDF.
 * In prototype: fetches from /sample-report.pdf (public folder), or uses a fallback blob.
 * Later: replace with /api/download-report/<chatId>.
 */
export async function downloadReportPdf(_chatId: string | null): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  const filename = `ProtoCol_Report_${date}.pdf`;

  try {
    const res = await fetch('/sample-report.pdf');
    if (res.ok) {
      const blob = await res.blob();
      triggerDownload(blob, filename);
      return;
    }
  } catch {
    // ignore
  }
  // Fallback: minimal PDF-like blob so download always works
  const minimalPdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
206
%%EOF`;
  const blob = new Blob([minimalPdf], { type: 'application/pdf' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
