from io import BytesIO
from html.parser import HTMLParser
from pathlib import Path
import re
from textwrap import wrap

from flask import Flask, jsonify, render_template, request, send_file
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
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


def font_name_for(run):
    if run.get("bold") and run.get("italic"):
        return "Helvetica-BoldOblique"
    if run.get("bold"):
        return "Helvetica-Bold"
    if run.get("italic"):
        return "Helvetica-Oblique"
    return "Helvetica"


class RichTextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.blocks = []
        self.current = []
        self.bold = 0
        self.italic = 0
        self.underline = 0
        self.align_stack = ["left"]

    def _current_align(self):
        return self.align_stack[-1]

    def _finish_block(self):
        if any(run["text"].strip() for run in self.current):
            self.blocks.append({"align": self._current_align(), "runs": self.current})
        self.current = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        style = attrs.get("style", "").lower()

        if tag in {"p", "div"}:
            self._finish_block()
            align = self._current_align()
            attr_align = attrs.get("align", "").lower()
            if attr_align in {"left", "center", "right"}:
                align = attr_align
            elif "text-align" in style:
                if "center" in style:
                    align = "center"
                elif "right" in style:
                    align = "right"
                else:
                    align = "left"
            self.align_stack.append(align)
        elif tag == "br":
            self._finish_block()
        elif tag in {"b", "strong"}:
            self.bold += 1
        elif tag in {"i", "em"}:
            self.italic += 1
        elif tag == "u":
            self.underline += 1

    def handle_endtag(self, tag):
        if tag in {"p", "div"}:
            self._finish_block()
            if len(self.align_stack) > 1:
                self.align_stack.pop()
        elif tag in {"b", "strong"}:
            self.bold = max(0, self.bold - 1)
        elif tag in {"i", "em"}:
            self.italic = max(0, self.italic - 1)
        elif tag == "u":
            self.underline = max(0, self.underline - 1)

    def handle_data(self, data):
        if data:
            self.current.append({
                "text": data,
                "bold": self.bold > 0,
                "italic": self.italic > 0,
                "underline": self.underline > 0,
            })

    def close(self):
        super().close()
        self._finish_block()
        return self.blocks


def parse_rich_text(html):
    parser = RichTextParser()
    parser.feed(str(html or ""))
    blocks = parser.close()
    if blocks:
        return blocks
    text = safe_text(html)
    return [{"align": "left", "runs": [{"text": paragraph, "bold": False, "italic": False, "underline": False}]} for paragraph in re.split(r"\n\s*\n", text) if paragraph.strip()]


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

    def _tokenize_runs(self, runs):
        tokens = []
        for run in runs:
            parts = re.split(r"(\s+)", run["text"])
            for part in parts:
                if not part:
                    continue
                text = " " if part.isspace() else part
                if text == " " and (not tokens or tokens[-1]["text"] == " "):
                    continue
                token = dict(run)
                token["text"] = text
                tokens.append(token)
        while tokens and tokens[0]["text"] == " ":
            tokens.pop(0)
        while tokens and tokens[-1]["text"] == " ":
            tokens.pop()
        return tokens

    def _token_width(self, token):
        return stringWidth(token["text"], font_name_for(token), FONT_SIZE)

    def _draw_rich_line(self, tokens, align):
        line_width = sum(self._token_width(token) for token in tokens)
        if align == "right":
            x = LEFT_MARGIN + CONTENT_WIDTH - line_width
        elif align == "center":
            x = LEFT_MARGIN + (CONTENT_WIDTH - line_width) / 2
        else:
            x = LEFT_MARGIN

        self._ensure_space(LINE_GAP)
        for token in tokens:
            font_name = font_name_for(token)
            self.pdf.setFont(font_name, FONT_SIZE)
            self.pdf.drawString(x, self.y, token["text"])
            width = self._token_width(token)
            if token.get("underline") and token["text"].strip():
                self.pdf.line(x, self.y - 1.5, x + width, self.y - 1.5)
            x += width
        self.y -= LINE_GAP

    def rich_body(self, html):
        self.pdf.setFillColorRGB(0.05, 0.1, 0.22)
        blocks = parse_rich_text(html)
        for block_index, block in enumerate(blocks):
            tokens = self._tokenize_runs(block["runs"])
            if not tokens:
                continue

            line = []
            line_width = 0
            for token in tokens:
                token_width = self._token_width(token)
                if line and line_width + token_width > CONTENT_WIDTH:
                    while line and line[-1]["text"] == " ":
                        line.pop()
                    self._draw_rich_line(line, block.get("align", "left"))
                    line = []
                    line_width = 0
                    if token["text"] == " ":
                        continue
                line.append(token)
                line_width += token_width
            if line:
                while line and line[-1]["text"] == " ":
                    line.pop()
                self._draw_rich_line(line, block.get("align", "left"))

            if block_index < len(blocks) - 1:
                self.gap(LINE_GAP * 0.9)

    def closing(self, text):
        closing = safe_text(text)
        if not closing:
            return
        self.gap(px_to_pt(18))
        for line in closing.split("\n"):
            self._ensure_space(LINE_GAP)
            self.pdf.setFillColorRGB(0.05, 0.1, 0.22)
            self.pdf.setFont("Helvetica", FONT_SIZE)
            width = stringWidth(line, "Helvetica", FONT_SIZE)
            self.pdf.drawString(LEFT_MARGIN + CONTENT_WIDTH - width, self.y, line)
            self.y -= LINE_GAP

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
        paginator.rich_body(data.get("bodyHtml") or data.get("body"))
    else:
        dear = safe_text(data.get("dear"))
        if dear and not dear.lower().startswith("dear "):
            dear = f"Dear {dear},"
        paginator.lines(dear, font_name="Helvetica-Bold")
        paginator.gap(px_to_pt(14))
        paginator.rich_body(data.get("bodyHtml") or data.get("body"))

    paginator.closing(data.get("closing"))

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
