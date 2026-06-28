import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "codex-plus-bracket.json"
BRACKET = ROOT / "exports" / "tabellone-codex-plus.png"
OUTPUT = ROOT / "output" / "pdf" / "pronostico-codex-mondiale-2026.pdf"

PAGE = landscape(A3)
W, H = PAGE
NAVY = colors.HexColor("#07101c")
PANEL = colors.HexColor("#101b2a")
PANEL_2 = colors.HexColor("#162538")
WHITE = colors.HexColor("#f4f8fc")
MUTED = colors.HexColor("#9eacbc")
GREEN = colors.HexColor("#00d084")
GOLD = colors.HexColor("#f5c84b")
BLUE = colors.HexColor("#6cb7ff")


def background(pdf):
    pdf.setFillColor(NAVY)
    pdf.rect(0, 0, W, H, fill=1, stroke=0)


def footer(pdf, page_num):
    pdf.setStrokeColor(colors.HexColor("#26394e"))
    pdf.line(34, 25, W - 34, 25)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 8)
    pdf.drawString(34, 13, "Pronostico Codex - proiezione editoriale indicativa")
    pdf.drawRightString(W - 34, 13, f"Pagina {page_num}")


def fit_text(pdf, text, max_width, size=15, minimum=9, bold=True):
    font = "Helvetica-Bold" if bold else "Helvetica"
    current = size
    while current > minimum and pdf.stringWidth(text, font, current) > max_width:
        current -= 0.5
    pdf.setFont(font, current)
    return current


def draw_match(pdf, match, x, y, width, height=54):
    pdf.setFillColor(PANEL_2)
    pdf.roundRect(x, y - height, width, height, 8, fill=1, stroke=0)
    pdf.setFillColor(GOLD)
    pdf.roundRect(x + 8, y - height + 10, 34, 34, 7, fill=1, stroke=0)
    pdf.setFillColor(NAVY)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawCentredString(x + 25, y - height + 22, str(match.get("number", "")))

    team_a = str(match.get("teamA", "Da definire"))
    team_b = str(match.get("teamB", "Da definire"))
    score = f'{match.get("goalsA", "-")}-{match.get("goalsB", "-")}'
    content_x = x + 54
    score_w = 50
    team_w = (width - 68 - score_w) / 2

    pdf.setFillColor(WHITE)
    fit_text(pdf, team_a, team_w - 12, 13)
    pdf.drawRightString(content_x + team_w - 8, y - 31, team_a)
    pdf.setFillColor(GOLD)
    pdf.roundRect(content_x + team_w, y - 42, score_w, 30, 6, fill=1, stroke=0)
    pdf.setFillColor(NAVY)
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawCentredString(content_x + team_w + score_w / 2, y - 32, score)
    pdf.setFillColor(WHITE)
    fit_text(pdf, team_b, team_w - 12, 13)
    pdf.drawString(content_x + team_w + score_w + 8, y - 31, team_b)

    note = str(match.get("note", "") or "")
    if note:
        pdf.setFillColor(BLUE)
        fit_text(pdf, note, width - 70, 7.5, 6.5, False)
        pdf.drawString(content_x, y - 49, note)


def title_page(pdf, data, page_num):
    background(pdf)
    pdf.setFillColor(GREEN)
    pdf.roundRect(50, H - 92, 120, 28, 8, fill=1, stroke=0)
    pdf.setFillColor(NAVY)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawCentredString(110, H - 82, "MONDIALE 2026")
    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 34)
    pdf.drawString(50, H - 145, "Pronostico Codex")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 13)
    pdf.drawString(50, H - 170, "Tabellone completo e proiezioni editoriali sincronizzate con le Letture")

    final = data["final"]
    box_y = H - 355
    pdf.setFillColor(PANEL)
    pdf.roundRect(50, box_y, W - 100, 140, 16, fill=1, stroke=0)
    pdf.setFillColor(GOLD)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(75, box_y + 106, "FINALE PREVISTA")
    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 27)
    pdf.drawCentredString(W / 2, box_y + 69, f'{final["teamA"]}  {final["goalsA"]}-{final["goalsB"]}  {final["teamB"]}')
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 17)
    pdf.drawCentredString(W / 2, box_y + 35, f'Campione previsto: {data["champion"]}')

    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, box_y - 52, "Metodo")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, box_y - 74, data.get("formula", ""))
    pdf.drawString(50, box_y - 94, "I risultati editoriali delle Letture prevalgono sulla simulazione automatica quando disponibili.")
    footer(pdf, page_num)
    pdf.showPage()


def bracket_page(pdf, page_num):
    background(pdf)
    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(34, H - 36, "Tabellone completo")
    image = ImageReader(str(BRACKET))
    iw, ih = image.getSize()
    available_w = W - 60
    available_h = H - 78
    scale = min(available_w / iw, available_h / ih)
    draw_w, draw_h = iw * scale, ih * scale
    pdf.drawImage(image, (W - draw_w) / 2, 34 + (available_h - draw_h) / 2,
                  width=draw_w, height=draw_h, preserveAspectRatio=True, mask="auto")
    footer(pdf, page_num)
    pdf.showPage()


def round_page(pdf, title, matches, page_num):
    background(pdf)
    pdf.setFillColor(BLUE)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(40, H - 38, "PRONOSTICI ELIMINAZIONE DIRETTA")
    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawString(40, H - 67, title)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawRightString(W - 40, H - 60, f"{len(matches)} partite")

    y = H - 92
    card_h = 54
    gap = 9
    for match in matches:
        if y - card_h < 40:
            footer(pdf, page_num)
            pdf.showPage()
            page_num += 1
            background(pdf)
            y = H - 48
        draw_match(pdf, match, 40, y, W - 80, card_h)
        y -= card_h + gap
    footer(pdf, page_num)
    pdf.showPage()
    return page_num


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))
    rounds = {
        "Sedicesimi di finale": data["left"]["r32"] + data["right"]["r32"],
        "Ottavi di finale": data["left"]["r16"] + data["right"]["r16"],
        "Quarti di finale": data["left"]["qf"] + data["right"]["qf"],
        "Semifinali": data["left"]["sf"] + data["right"]["sf"],
        "Finali": [data["bronze"], data["final"]],
    }
    pdf = canvas.Canvas(str(OUTPUT), pagesize=PAGE, pageCompression=1)
    pdf.setTitle("Pronostico Codex Mondiale 2026")
    page = 1
    title_page(pdf, data, page)
    page += 1
    bracket_page(pdf, page)
    page += 1
    for title, matches in rounds.items():
        page = round_page(pdf, title, [m for m in matches if m], page) + 1
    pdf.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
