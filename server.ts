import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeLegalHeadersWithGemini } from './src/services/geminiHeaderService.ts';
import { summarizePdfWithGemini, GeminiServiceError } from './src/services/geminiPdfSummaryService.ts';
import { summarizeDafasBatchWithGemini } from './src/services/geminiDafaSummaryService.ts';
import { resolvePdfBuffer, resolvePdfLocalPath } from './src/services/pdfResolver.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '2mb' }));

// 1. Gemini Legal Header Analyzer Endpoint
app.post('/api/gemini/analyze-headers', async (req, res) => {
  try {
    const { pdfPath, pageNumber, snippetText } = req.body;
    const analysis = await analyzeLegalHeadersWithGemini(
      pdfPath || '',
      pageNumber ? parseInt(String(pageNumber), 10) : undefined,
      snippetText || ''
    );
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(analysis);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 2. Gemini AI PDF Summary Endpoint
app.post('/api/gemini/summarize-pdf', async (req, res) => {
  try {
    const { pdfPath, mode, language, startPage, endPage, customQuestion } = req.body || {};
    const summary = await summarizePdfWithGemini({
      pdfPath: String(pdfPath || ''),
      mode,
      language,
      startPage: startPage ? parseInt(String(startPage), 10) : undefined,
      endPage: endPage ? parseInt(String(endPage), 10) : undefined,
      customQuestion: customQuestion ? String(customQuestion) : undefined,
    });
    res.json({ success: true, summary });
  } catch (err: any) {
    const status = err instanceof GeminiServiceError ? err.status : 500;
    res.status(status).json({
      success: false,
      error: err?.message || 'PDF सारांश तयार गर्न असफल भयो।',
    });
  }
});

// 3. Gemini AI Batch Dafa Summary Endpoint
app.post('/api/gemini/summarize-dafas', async (req, res) => {
  try {
    const { pdfPath, items } = req.body || {};
    const results = await summarizeDafasBatchWithGemini(String(pdfPath || ''), items || []);
    res.json({ success: true, results });
  } catch (err: any) {
    const status = err instanceof GeminiServiceError ? err.status : 500;
    res.status(status).json({
      success: false,
      error: err?.message || 'दफा सारांश तयार गर्न असफल भयो।',
    });
  }
});

// 3. PDF Streaming Proxy Endpoint
app.get('/api/pdf-proxy', async (req, res) => {
  try {
    const pdfPath = req.query.path as string;
    if (!pdfPath) {
      return res.status(400).send('Missing PDF path parameter');
    }

    const localFile = resolvePdfLocalPath(pdfPath);
    if (localFile) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(localFile);
    }

    const { buffer } = await resolvePdfBuffer(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);
  } catch (err: any) {
    return res.status(500).send(err.message || 'Internal error streaming PDF');
  }
});

// Ensure unmatched /api/* routes never fall back to HTML
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint फेला परेन।' });
});

// Ensure Express middleware errors (e.g., invalid JSON body) return JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api')) {
    return res.status(err?.status || 500).json({
      success: false,
      error: err?.message || 'आन्तरिक सर्भर त्रुटि भयो।',
    });
  }
  return next(err);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
