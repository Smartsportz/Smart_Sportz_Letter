import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Letter Generation Endpoint
  app.post('/api/generate-letter', async (req, res) => {
    try {
      const { method, prompt, tone = 'Professional', sender = '', recipient = '', subject = '' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt description is required.' });
      }

      const ai = getGenAI();

      let systemPrompt = '';
      if (method === 'from_to_sub_body') {
        systemPrompt = `You are a professional corporate communication expert.
Write a formal company letter based on the user's request.
Target Method: From-To-Sub-Body format.
Instructions:
- Title: A short uppercase title like "APPOINTMENT LETTER", "OFFER OF EMPLOYMENT", "OFFICIAL MEMO", "INTERNSHIP COMPLETION LETTER", etc.
- From: Sender details (e.g. "The Management,\\nSmartSportz.in,\\nBangalore, India").
- To: Recipient details (e.g. "To,\\nMr. John Doe,\\nSenior Analyst").
- Subject: Concise subject line beginning with "SUB: ".
- Body: 2 to 4 clean, well-formatted paragraphs. Keep standard company letter tone without markdown syntax (no asterisks, bold stars, or hash tags). Each paragraph separated by clear line breaks.

Respond strictly in JSON format:
{
  "title": "LETTER TITLE",
  "from": "Sender Name/Company/Address",
  "to": "Recipient Name/Address",
  "subject": "SUB: Subject description",
  "body": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3"
}`;
      } else {
        systemPrompt = `You are a professional corporate communication expert.
Write a formal company letter based on the user's request.
Target Method: Dear-Body format.
Instructions:
- Title: A short letter title like "LETTER OF APPRECIATION", "ANNOUNCEMENT", "RECOMMENDATION LETTER", etc.
- Dear: Salutation string like "Dear John Doe," or "Dear Valued Partner,"
- Body: 2 to 4 clean, well-formatted paragraphs without markdown symbols (no asterisks or hash tags). Each paragraph separated by double line breaks.

Respond strictly in JSON format:
{
  "title": "LETTER TITLE",
  "dear": "Dear <Name>,",
  "body": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3"
}`;
      }

      const userMessage = `User request: "${prompt}".
Tone: ${tone}.
${sender ? `Sender info: ${sender}` : ''}
${recipient ? `Recipient info: ${recipient}` : ''}
${subject ? `Subject info: ${subject}` : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${systemPrompt}\n\n${userMessage}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      const resultData = JSON.parse(responseText);

      return res.json({ success: true, data: resultData });
    } catch (error: any) {
      console.error('Error generating letter with Gemini:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate letter content.',
      });
    }
  });

  // Template Presets Endpoint
  app.get('/api/templates', (_req, res) => {
    res.json({
      templates: [
        {
          id: 'smartsportz_default',
          name: 'SMARTSPORTZ.IN Letterhead',
          tagline: 'PLAY · COMPETE · INSPIRE · SUCCEED',
          companyName: 'SMARTSPORTZ.IN',
          website: 'www.smartsportz.in',
          email: 'info@smartsportz.in',
          signatoryTitle: 'FOUNDER',
          signatoryCompany: 'SMARTSPORTZ.IN',
          primaryColor: '#0a1931',
          accentColor: '#f5a623',
          hasGeometricHeader: true,
          hasWatermark: true,
        },
        {
          id: 'corporate_navy',
          name: 'Corporate Navy Executive',
          tagline: 'EXCELLENCE IN INNOVATION',
          companyName: 'NEXUS GLOBAL ENTERPRISES',
          website: 'www.nexusglobal.com',
          email: 'contact@nexusglobal.com',
          signatoryTitle: 'MANAGING DIRECTOR',
          signatoryCompany: 'NEXUS GLOBAL ENTERPRISES',
          primaryColor: '#1e293b',
          accentColor: '#3b82f6',
          hasGeometricHeader: false,
          hasWatermark: false,
        },
        {
          id: 'modern_gold',
          name: 'Golden Luxury Crest',
          tagline: 'PRECISION & DISTINCTION',
          companyName: 'AURUM HOLDINGS INC.',
          website: 'www.aurumholdings.org',
          email: 'admin@aurumholdings.org',
          signatoryTitle: 'CHIEF EXECUTIVE OFFICER',
          signatoryCompany: 'AURUM HOLDINGS INC.',
          primaryColor: '#0f172a',
          accentColor: '#d97706',
          hasGeometricHeader: true,
          hasWatermark: true,
        },
      ],
    });
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
