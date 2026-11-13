import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../..');

export function resolvePdfLocalPath(pdfPath: string): string | null {
  if (!pdfPath) return null;

  const cleanPath = pdfPath.replace(/अनुसूची-१\.pdf$/, 'अनसुूची-१.pdf');
  const normalizedDoubleSpace = pdfPath.replace(/^(pdfs\/१२\.[^/]+\/१२\.५\.)\s+/, '$1  ');
  const folder12To5Fallback = pdfPath.includes('१२.८.')
    ? 'pdfs/५. निर्देशिका/५.२. जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१/जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१.pdf'
    : '';

  const candidates = [
    path.resolve(PROJECT_ROOT, 'public', pdfPath),
    path.resolve(PROJECT_ROOT, 'public/pdfs', pdfPath.replace(/^pdfs\//, '')),
    path.resolve(process.cwd(), 'public', pdfPath),
    path.resolve(process.cwd(), 'public/pdfs', pdfPath.replace(/^pdfs\//, '')),
    path.resolve(process.cwd(), 'public', cleanPath),
    path.resolve(process.cwd(), 'public', normalizedDoubleSpace),
    ...(folder12To5Fallback ? [path.resolve(process.cwd(), 'public', folder12To5Fallback)] : []),
  ];

  for (const localFile of candidates) {
    if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
      return localFile;
    }
  }
  return null;
}

export async function resolvePdfBuffer(
  pdfPath: string
): Promise<{ buffer: Buffer; localPath?: string; source: 'local' | 'github' }> {
  const localPath = resolvePdfLocalPath(pdfPath);
  if (localPath) {
    return {
      buffer: fs.readFileSync(localPath),
      localPath,
      source: 'local',
    };
  }

  const cleanPath = pdfPath.replace(/अनुसूची-१\.pdf$/, 'अनसुूची-१.pdf');
  const upstreamPath = cleanPath.replace(
    /^pdfs\/१\.\s*संबिधान र मुलुकी संहिता\//,
    'pdfs/१. नेपालको संबिधान र मुलुकी ऐन/'
  );
  const encodedPath = upstreamPath
    .split('/')
    .map(s => encodeURIComponent(s))
    .join('/');
  const rawUrl = `https://raw.githubusercontent.com/barshapbp2026/any-pdf-/main/${encodedPath}`;
  const response = await fetch(rawUrl);
  if (!response.ok) {
    throw new Error(`PDF फाइल फेला परेन (${response.status}): ${pdfPath}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    source: 'github',
  };
}
