# SMARTSPORTZ.IN Company Letter Generator (Flask Backend)

A complete Python Flask web application for creating and downloading professional company letterhead documents matching the **SMARTSPORTZ.IN** format.

## Features
1. **Method 1 (From - To - Sub - Body)**: Formal structured corporate letter layout with sender, recipient, subject line, and body paragraphs.
2. **Method 2 (Dear - Body)**: Direct salutation letter layout with custom letter title, recipient salutation, and body content.
3. **Live A4 Preview**: Side-by-side live rendering with geometric navy & gold corner headers, footer contact links, and watermark.
4. **Instant PDF Download**: High quality client-side PDF export using `html2pdf.js`.
5. **Gemini AI Drafting (Optional)**: Connect your `GEMINI_API_KEY` in `.env` to generate letters automatically using Gemini AI.

## Quick Start Instructions

1. Navigate to the `flask_app` folder:
   ```bash
   cd flask_app
   ```

2. Create a virtual environment & install requirements:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up environment variables (optional for AI generation):
   Create a `.env` file inside `flask_app/`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. Run the Flask Server:
   ```bash
   python app.py
   ```

5. Open your browser at `http://localhost:5000` to create, preview, and download letters in PDF format!
