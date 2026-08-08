from io import BytesIO
from pathlib import Path
import re
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


LEFT_MARGIN = px_to_pt(70)
RIGHT_MARGIN = px_to_pt(70)
CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
FIRST_PAGE_START_Y = PAGE_HEIGHT - px_to_pt(224)
CONTINUATION_START_Y = PAGE_HEIGHT - px_to_pt(250)
FOOTER_SAFE_Y = px_to_pt(165)
FONT_SIZE = 10.5
LINE_GAP = 12.2


def safe_text(value):
    return str(value or "").replace("\r\n", "\n").replace("\r", "\n").strip()


def safe_filename(value):
    cleaned = re.sub(r"[^a-z0-9]+", "_", safe_text(value).lower()).strip("_")
    return cleaned or "letter"


class LetterPaginator:
    def __init__(self, pdf, offset=0):
        self.pdf = pdf
        self.offset = px_to_pt(offset)
        self.y = FIRST_PAGE_START_Y - self.offset
        self.page_count = 0
        self._start_page(self.y)

    def _draw_background(self):
        self.pdf.drawImage(str(LETTERHEAD_PATH), 0, 0, width=PAGE_WIDTH, height=PAGE_HEIGHT)

    def _start_page(self, start_y):
        if self.page_count:
            self.pdf.showPage()
        self._draw_background()
        self.y = start_y
        self.page_count += 1

    def _new_content_page(self):
        self._start_page(CONTINUATION_START_Y - self.offset)

    def _ensure_space(self, needed_height):
        if self.y - needed_height < FOOTER_SAFE_Y:
            self._new_content_page()

    def gap(self, amount):
        self._ensure_space(amount)
        self.y -= amount

    def centered_title(self, title):
        self._ensure_space(px_to_pt(29))
        self.pdf.setFillColorRGB(0.05, 0.1, 0.22)
        self.pdf.setFont("Helvetica-Bold", 14.25)
        self.pdf.drawCentredString(PAGE_WIDTH / 2, self.y, safe_text(title))
        self.y -= px_to_pt(29)

    def lines(self, text, font_name="Helvetica", font_size=FONT_SIZE, line_gap=LINE_GAP, width_factor=0.52):
        chars_per_line = max(28, int(CONTENT_WIDTH / (font_size * width_factor)))
        wrapped_lines = []
        for raw_line in safe_text(text).split("\n"):
            if raw_line.strip():
                wrapped_lines.extend(wrap(raw_line.strip(), width=chars_per_line))
            else:
                wrapped_lines.append("")

        self.pdf.setFillColorRGB(0.05, 0.1, 0.22)
        self.pdf.setFont(font_name, font_size)
        for line in wrapped_lines:
            self._ensure_space(line_gap)
            if line:
                self.pdf.drawString(LEFT_MARGIN, self.y, line)
            self.y -= line_gap

    def body(self, text):
        paragraphs = re.split(r"\n\s*\n", safe_text(text))
        chars_per_line = max(35, int(CONTENT_WIDTH / (FONT_SIZE * 0.49)))

        self.pdf.setFillColorRGB(0.05, 0.1, 0.22)
        self.pdf.setFont("Helvetica", FONT_SIZE)
        for paragraph_index, paragraph in enumerate(paragraphs):
            paragraph = " ".join(paragraph.split())
            if not paragraph:
                continue
            for line in wrap(paragraph, width=chars_per_line):
                self._ensure_space(LINE_GAP)
                self.pdf.drawString(LEFT_MARGIN, self.y, line)
                self.y -= LINE_GAP
            if paragraph_index < len(paragraphs) - 1:
                self.gap(LINE_GAP * 0.9)

    def add_blank_page(self):
        self._start_page(CONTINUATION_START_Y - self.offset)


def draw_letter_pages(pdf, data):
    paginator = LetterPaginator(pdf, data.get("offset", 0))
    method = data.get("method", "method1")

    title = safe_text(data.get("title"))
    paginator.centered_title(title)

    if method == "method1":
        paginator.lines(data.get("from"))
        paginator.gap(px_to_pt(9))
        paginator.lines(data.get("to"))
        paginator.gap(px_to_pt(10))
        paginator.lines(data.get("subject"), font_name="Helvetica-Bold")
        paginator.gap(px_to_pt(14))
        paginator.body(data.get("body"))
    else:
        dear = safe_text(data.get("dear"))
        if dear and not dear.lower().startswith("dear "):
            dear = f"Dear {dear},"
        paginator.lines(dear, font_name="Helvetica-Bold")
        paginator.gap(px_to_pt(14))
        paginator.body(data.get("body"))

    return paginator


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/download-pdf", methods=["POST"])
def download_pdf():
    data = request.get_json(silent=True) or {}
    requested_page_count = max(1, min(int(data.get("pageCount", 1) or 1), 20))

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)

    paginator = draw_letter_pages(pdf, data)
    for _ in range(requested_page_count - 1):
        paginator.add_blank_page()

    pdf.save()
    buffer.seek(0)

    filename = safe_filename(data.get("title"))
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
