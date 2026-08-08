import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Download } from 'lucide-react';

interface FlaskExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlaskExporterModal: React.FC<FlaskExporterModalProps> = ({ isOpen, onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'app.py' | 'templates/index.html' | 'static/style.css' | 'static/script.js' | 'requirements.txt' | 'README.md'>('app.py');

  if (!isOpen) return null;

  const flaskFiles: Record<string, string> = {
    'app.py': `from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-letter', methods=['POST'])
def generate_letter():
    data = request.json or {}
    method = data.get('method', 'from_to_sub_body')
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return jsonify({'error': 'GEMINI_API_KEY not configured in environment'}), 500

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        if method == 'from_to_sub_body':
            system_instruction = (
                "Write a formal company letter in Method 1 format (From-To-Sub-Body). "
                "Return JSON with keys: 'title', 'from', 'to', 'subject', 'body'."
            )
        else:
            system_instruction = (
                "Write a formal company letter in Method 2 format (Dear-Body). "
                "Return JSON with keys: 'title', 'dear', 'body'."
            )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"{system_instruction}\\n\\nUser Prompt: {prompt}",
            config={'response_mime_type': 'application/json'}
        )

        import json
        result = json.loads(response.text)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`,

    'templates/index.html': `<!-- flask_app/templates/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SMARTSPORTZ.IN - Company Letter Generator</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Controls & Method 1 / Method 2 Tabs -->
        <div class="sidebar">
            <h2>SMARTSPORTZ.IN</h2>
            <div class="method-tabs">
                <button class="tab-btn active" onclick="switchMethod('from_to_sub_body')">Method 1: From-To-Sub-Body</button>
                <button class="tab-btn" onclick="switchMethod('dear_body')">Method 2: Dear-Body</button>
            </div>
            <!-- Dynamic Form Inputs -->
        </div>

        <!-- Live A4 Preview Page -->
        <div class="preview-area">
            <div id="letter-page" class="a4-page">
                <!-- Header with geometric accents, logo, subject, body, signature, and footer -->
            </div>
        </div>
    </div>
    <script src="{{ url_for('static', filename='script.js') }}"></script>
</body>
</html>`,

    'static/style.css': `/* flask_app/static/style.css */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0f172a; color: #f8fafc; font-family: system-ui; }
.app-container { display: flex; height: 100vh; }
.sidebar { width: 400px; background: #1e293b; padding: 20px; overflow-y: auto; }
.a4-page { width: 210mm; min-height: 297mm; background: #fff; color: #0f172a; position: relative; padding: 30mm 20mm; }
/* Geometric header & footer corner accents matching SMARTSPORTZ format */`,

    'static/script.js': `// flask_app/static/script.js
function switchMethod(m) {
    // Toggles between Method 1 (From-To-Sub-Body) and Method 2 (Dear-Body)
}
function downloadPDF() {
    const el = document.getElementById('letter-page');
    html2pdf().from(el).save('smartsportz_letter.pdf');
}`,

    'requirements.txt': `Flask>=3.0.0
google-genai>=0.1.1
python-dotenv>=1.0.0
requests>=2.31.0`,

    'README.md': `# SMARTSPORTZ.IN Flask Letter Generator
1. cd flask_app
2. pip install -r requirements.txt
3. python app.py
4. Open http://localhost:5000`
  };

  const copyToClipboard = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative text-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100">Python Flask Codebase</h3>
            <p className="text-xs text-slate-400">
              Complete standalone Python backend program located in the <span className="text-emerald-400 font-mono">/flask_app</span> directory
            </p>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
          {(Object.keys(flaskFiles) as Array<keyof typeof flaskFiles>).map((fileKey) => (
            <button
              key={fileKey}
              onClick={() => setActiveTab(fileKey)}
              className={`text-xs px-3 py-1.5 rounded-t-lg font-mono transition-all flex items-center gap-1.5 ${
                activeTab === fileKey
                  ? 'bg-slate-800 text-emerald-400 font-bold border-t border-x border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{fileKey}</span>
            </button>
          ))}
        </div>

        {/* Code View */}
        <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 max-h-80 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed">
          <button
            onClick={() => copyToClipboard(activeTab, flaskFiles[activeTab])}
            className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1 transition-all"
          >
            {copiedFile === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
          <pre>{flaskFiles[activeTab]}</pre>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <p>
            To run Flask locally: <code className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded">cd flask_app &amp;&amp; pip install -r requirements.txt &amp;&amp; python app.py</code>
          </p>
        </div>
      </div>
    </div>
  );
};
