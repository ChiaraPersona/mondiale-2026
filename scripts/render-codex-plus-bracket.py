import json
import math
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "codex-plus-bracket.json"
OUTPUT_PATH = ROOT / "exports" / "tabellone-codex-plus.png"

W, H = 3200, 1960
CARD_W, CARD_H = 300, 86
GREEN = (0, 208, 132)
GOLD = (245, 200, 75)
INK = (245, 248, 252)
MUTED = (156, 166, 178)
PANEL = (14, 18, 25)
PANEL_2 = (20, 26, 34)
LINE = (77, 97, 116)


def font(size, bold=False):
    names = ["arialbd.ttf" if bold else "arial.ttf", "segoeuib.ttf" if bold else "segoeui.ttf"]
    for name in names:
        path = Path("C:/Windows/Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F_TITLE = font(58, True)
F_SUB = font(24, False)
F_HEAD = font(24, True)
F_TEAM = font(22, True)
F_SMALL = font(16, False)
F_TINY = font(13, False)
F_SCORE = font(25, True)
F_CENTER = font(36, True)


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def fit_text(draw, text, fnt, max_width):
    text = str(text)
    if text_size(draw, text, fnt)[0] <= max_width:
        return text
    ellipsis = "..."
    while text and text_size(draw, text + ellipsis, fnt)[0] > max_width:
        text = text[:-1]
    return text + ellipsis


def draw_gradient_background(draw):
    for y in range(H):
        t = y / H
        r = int(3 + 7 * t)
        g = int(5 + 10 * t)
        b = int(9 + 13 * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    for radius, alpha, color, cx, cy in [
        (680, 72, GOLD, W // 2, 980),
        (520, 58, GREEN, W // 2, 1040),
        (420, 36, (91, 127, 255), 520, 420),
        (420, 34, (91, 127, 255), W - 520, 420),
    ]:
        for i in range(radius, 0, -16):
            a = int(alpha * (i / radius) ** 2)
            fill = tuple(int(c * a / 255) for c in color)
            draw.ellipse((cx - i, cy - i, cx + i, cy + i), outline=fill, width=2)


def rounded_box(draw, box, fill, outline=(255, 255, 255, 28), width=1, radius=18):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def blend(a, b, t):
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))


def team_row(draw, x, y, w, h, team, goals, plus, winner=False):
    bg = blend(PANEL_2, GREEN, 0.24) if winner else (18, 22, 30)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=9, fill=bg)
    draw.text((x + 10, y + 8), fit_text(draw, team, F_TEAM, w - 72), font=F_TEAM, fill=INK)
    score_w = 42
    draw.rounded_rectangle((x + w - score_w - 7, y + 7, x + w - 7, y + h - 7), radius=8, fill=GOLD if winner else (42, 48, 58))
    sw, sh = text_size(draw, str(goals), F_SCORE)
    draw.text((x + w - score_w - 7 + (score_w - sw) / 2, y + (h - sh) / 2 - 1), str(goals), font=F_SCORE, fill=(6, 16, 22) if winner else INK)


def draw_match(draw, match, x, y, compact=False):
    box = (x, y, x + CARD_W, y + CARD_H)
    rounded_box(draw, box, PANEL, outline=(255, 255, 255, 36), radius=16)
    row_h = 31
    team_row(draw, x + 8, y + 12, CARD_W - 16, row_h, match["teamA"], match["goalsA"], match["codexPlusA"], match["winner"] == match["teamA"])
    team_row(draw, x + 8, y + 46, CARD_W - 16, row_h, match["teamB"], match["goalsB"], match["codexPlusB"], match["winner"] == match["teamB"])


def center_of(pos):
    x, y = pos
    return x + CARD_W / 2, y + CARD_H / 2


def draw_connector(draw, a, b, side="left"):
    ax, ay = a
    bx, by = b
    if side == "left":
        start = (ax + CARD_W, ay + CARD_H / 2)
        end = (bx, by + CARD_H / 2)
    else:
        start = (ax, ay + CARD_H / 2)
        end = (bx + CARD_W, by + CARD_H / 2)
    mid_x = (start[0] + end[0]) / 2
    points = [start, (mid_x, start[1]), (mid_x, end[1]), end]
    draw.line(points, fill=LINE, width=3, joint="curve")
    draw.line(points, fill=(0, 208, 132), width=1, joint="curve")


def place_round(count, top=292, bottom=1660):
    if count == 1:
        return [(top + bottom - CARD_H) / 2]
    centers = [top + CARD_H / 2 + i * ((bottom - top) / (count - 1)) for i in range(count)]
    return [c - CARD_H / 2 for c in centers]


def draw_round_title(draw, label, x, y, w=CARD_W):
    draw.text((x, y), label.upper(), font=F_SMALL, fill=GOLD)
    draw.line((x, y + 24, x + w, y + 24), fill=(245, 200, 75, 90), width=2)


def render(data, out_path):
    img = Image.new("RGB", (W, H), (4, 7, 11))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_gradient_background(draw)

    draw.text((W / 2, 62), "TABELLONE FINALE MONDIALE 2026", anchor="ma", font=F_TITLE, fill=INK)

    x_left = {"r32": 80, "r16": 430, "qf": 760, "sf": 1060}
    x_right = {"sf": 1840, "qf": 2140, "r16": 2470, "r32": 2820}
    y_rounds = {
        "r32": place_round(8),
        "r16": place_round(4, 380, 1570),
        "qf": place_round(2, 560, 1390),
        "sf": place_round(1, 760, 1180),
    }

    for label, key in [("Sedicesimi", "r32"), ("Ottavi", "r16"), ("Quarti", "qf"), ("Semi", "sf")]:
        draw_round_title(draw, label, x_left[key], 238)
    for label, key in [("Semi", "sf"), ("Quarti", "qf"), ("Ottavi", "r16"), ("Sedicesimi", "r32")]:
        draw_round_title(draw, label, x_right[key], 238)

    positions = {"left": {}, "right": {}}
    for side in ["left", "right"]:
        for key, matches in data[side].items():
            positions[side][key] = []
            for match, y in zip(matches, y_rounds[key]):
                x = x_left[key] if side == "left" else x_right[key]
                positions[side][key].append((x, y))
                draw_match(draw, match, x, y)

    for side in ["left", "right"]:
        conn_side = "left" if side == "left" else "right"
        for i in range(4):
            draw_connector(draw, positions[side]["r32"][i * 2], positions[side]["r16"][i], conn_side)
            draw_connector(draw, positions[side]["r32"][i * 2 + 1], positions[side]["r16"][i], conn_side)
        for i in range(2):
            draw_connector(draw, positions[side]["r16"][i * 2], positions[side]["qf"][i], conn_side)
            draw_connector(draw, positions[side]["r16"][i * 2 + 1], positions[side]["qf"][i], conn_side)
        draw_connector(draw, positions[side]["qf"][0], positions[side]["sf"][0], conn_side)
        draw_connector(draw, positions[side]["qf"][1], positions[side]["sf"][0], conn_side)

    center_x = 1375
    center_w = 450
    center_mid = center_x + center_w / 2
    rounded_box(draw, (center_x, 515, center_x + center_w, 1355), (8, 11, 16), outline=(245, 200, 75, 92), width=2, radius=28)
    draw.text((center_mid, 555), "CAMPIONE", anchor="ma", font=F_HEAD, fill=GOLD)
    draw.text((center_mid, 610), data["champion"].upper(), anchor="ma", font=F_CENTER, fill=INK)
    draw.rounded_rectangle((center_mid - 100, 665, center_mid + 100, 810), radius=34, fill=(245, 200, 75, 235))
    draw.text((center_mid, 690), "26", anchor="ma", font=font(74, True), fill=(6, 16, 22))
    draw.text((center_mid, 770), "WORLD CUP", anchor="ma", font=F_SMALL, fill=(6, 16, 22))
    draw.text((center_mid, 865), "FINALE", anchor="ma", font=F_SMALL, fill=GOLD)
    final_box = (center_mid - CARD_W / 2, 900, center_mid + CARD_W / 2, 986)
    draw_match(draw, data["final"], final_box[0], final_box[1])
    draw.text((center_mid, 1024), "TERZO POSTO", anchor="ma", font=F_SMALL, fill=MUTED)
    draw_match(draw, data["bronze"], center_mid - CARD_W / 2, 1058)

    draw_connector(draw, positions["left"]["sf"][0], (center_mid - CARD_W / 2, 900), "left")
    draw_connector(draw, positions["right"]["sf"][0], (center_mid - CARD_W / 2, 900), "right")

    consensus_x, consensus_y = center_x + 55, 1168
    draw.text((center_mid, consensus_y), "CONSENSO ESTERNO", anchor="ma", font=F_SMALL, fill=GOLD)
    for i, row in enumerate(data["consensus"]):
        y = consensus_y + 32 + i * 24
        draw.text((consensus_x, y), f"{i + 1}. {row['team']}", font=F_SMALL, fill=INK if i < 3 else MUTED)

    footer = "Generato dal sito Mondiale 2026 · Tabellone finale Codex+ · dati aggiornabili da pronostico-codex.js"

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG", optimize=True)


if __name__ == "__main__":
    data_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DATA_PATH
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else OUTPUT_PATH
    with open(data_path, "r", encoding="utf8") as handle:
        render(json.load(handle), out_path)
    print(out_path)
