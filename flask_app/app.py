from io import BytesIO
from pathlib import Path
from textwrap import wrap

from flask import Flask, jsonify, render_template, request, send_file
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
LETTERHEAD_PATH = BASE_DIR / "static" / "letterhead.jpg"
PAGE_WIDTH, PAGE_HEIGHT = A4


def px_to_pt(value):
    return float(value) * 0.75


def safe_text(value):
    return str(value or "").replace("\r\n", "\n").replace("\r", "\n").strip()


def draw_wrapped_line(pdf, text, x, y, width, font_name, font_size, line_gap):
    chars_per_line = max(28, int(width / (font_size * 0.52)))
    lines = []
    for raw_line in safe_text(text).split("\n"):
        if raw_line.strip():
            lines.extend(wrap(raw_line.strip(), width=chars_per_line))
        else:
            lines.append("")

    pdf.setFont(font_name, font_size)
    for line in lines:
        pdf.drawString(x, y, line)
        y -= line_gap
    return y


def draw_body(pdf, text, x, y, width, font_size, line_gap):
    pdf.setFont("Helvetica", font_size)
    paragraphs = safe_text(text).split("\n\n")
    chars_per_line = max(35, int(width / (font_size * 0.49)))

    for paragraph_index, paragraph in enumerate(paragraphs):
        if not paragraph.strip():
            continue
        for line in wrap(" ".join(paragraph.split()), width=chars_per_line):
            pdf.drawString(x, y, line)
            y -= line_gap
        if paragraph_index < len(paragraphs) - 1:
            y -= line_gap * 0.9
    return y


def draw_letter_page(pdf, data):
    pdf.drawImage(str(LETTERHEAD_PATH), 0, 0, width=PAGE_WIDTH, height=PAGE_HEIGHT)

    method = data.get("method", "method1")
    offset = px_to_pt(data.get("offset", 0))
    x = px_to_pt(70)
    content_width = PAGE_WIDTH - px_to_pt(140)
    y = PAGE_HEIGHT - px_to_pt(224) - offset

    title = safe_text(data.get("title"))
    pdf.setFillColorRGB(0.05, 0.1, 0.22)
    pdf.setFont("Helvetica-Bold", 14.25)
    pdf.drawCentredString(PAGE_WIDTH / 2, y, title)
    y -= px_to_pt(29)

    if method == "method1":
        y = draw_wrapped_line(pdf, data.get("from"), x, y, content_width, "Helvetica", 10.5, 12.2)
        y -= px_to_pt(9)
        y = draw_wrapped_line(pdf, data.get("to"), x, y, content_width, "Helvetica", 10.5, 12.2)
        y -= px_to_pt(10)
        y = draw_wrapped_line(pdf, data.get("subject"), x, y, content_width, "Helvetica-Bold", 10.5, 12.2)
        y -= px_to_pt(14)
        draw_body(pdf, data.get("body"), x, y, content_width, 10.5, 12.2)
    else:
        dear = safe_text(data.get("dear"))
        if dear and not dear.lower().startswith("dear "):
            dear = f"Dear {dear},"
        y = draw_wrapped_line(pdf, dear, x, y, content_width, "Helvetica-Bold", 10.5, 12.2)
        y -= px_to_pt(14)
        draw_body(pdf, data.get("body"), x, y, content_width, 10.5, 12.2)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/download-pdf", methods=["POST"])
def download_pdf():
    data = request.get_json(silent=True) or {}
    page_count = max(1, min(int(data.get("pageCount", 1) or 1), 20))

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)

    draw_letter_page(pdf, data)
    pdf.showPage()

    for _ in range(page_count - 1):
        pdf.drawImage(str(LETTERHEAD_PATH), 0, 0, width=PAGE_WIDTH, height=PAGE_HEIGHT)
        pdf.showPage()

    pdf.save()
    buffer.seek(0)

    filename = safe_text(data.get("title")).lower().replace(" ", "_") or "letter"
    return send_file(
        buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"{filename}.pdf",
    )


@app.route("/health")
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
