import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import quote

sys.path.insert(0, str(Path(".tmp-pydeps").resolve()))

from curl_cffi import requests


ROOT = Path(__file__).resolve().parents[1]
STATS_PATH = ROOT / "stats.json"
DATA_PATH = ROOT / "data" / "stats.json"
JS_PATH = ROOT / "js" / "stats.js"

COUNTRIES = {
    "Corea del Sud": "South Korea",
    "Messico": "Mexico",
    "Repubblica Ceca": "Czech Republic",
    "Sudafrica": "South Africa",
    "Bosnia ed Erzegovina": "Bosnia & Herzegovina",
    "Canada": "Canada",
    "Qatar": "Qatar",
    "Svizzera": "Switzerland",
    "Haiti": "Haiti",
    "Marocco": "Morocco",
    "Scozia": "Scotland",
    "Australia": "Australia",
    "Paraguay": "Paraguay",
    "Stati Uniti": "USA",
    "Turchia": "Turkey",
    "Costa d'Avorio": "Ivory Coast",
    "Curacao": "Curacao",
    "Ecuador": "Ecuador",
    "Giappone": "Japan",
    "Svezia": "Sweden",
    "Tunisia": "Tunisia",
    "Egitto": "Egypt",
    "Iran": "Iran",
    "Nuova Zelanda": "New Zealand",
    "Arabia Saudita": "Saudi Arabia",
    "Capo Verde": "Cape Verde",
    "Uruguay": "Uruguay",
    "Iraq": "Iraq",
    "Norvegia": "Norway",
    "Senegal": "Senegal",
    "Algeria": "Algeria",
    "Austria": "Austria",
    "Giordania": "Jordan",
    "Uzbekistan": "Uzbekistan",
    "Ghana": "Ghana",
    "Colombia": "Colombia",
    "RD Congo": "DR Congo",
    "Croazia": "Croatia",
    "Panama": "Panama",
}

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "referer": "https://www.diretta.it/",
}


def fold(value):
    text = str(value or "").lower()
    text = re.sub(r"[^\w\s-]", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()


def tokens(value):
    return [token for token in re.split(r"[\s-]+", fold(value)) if len(token) > 1]


def load_stats():
    with STATS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_stats(data):
    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    STATS_PATH.write_text(serialized + "\n", encoding="utf-8")
    DATA_PATH.write_text(serialized + "\n", encoding="utf-8")
    JS_PATH.write_text("const playerStats = " + serialized + ";\n", encoding="utf-8")


def parse_jsonp(text):
    start = text.find("(")
    end = text.rfind(")")
    if start < 0 or end < start:
        return {}
    return json.loads(text[start + 1:end])


def search_player(session, name):
    url = f"https://s.flashscore.com/search/?q={quote(name)}&l=1&s=1&f=1;1&pid=2&sid=1"
    response = session.get(url, headers=HEADERS, timeout=25)
    if response.status_code != 200:
        return []
    return parse_jsonp(response.text).get("results") or []


def score_candidate(record, candidate):
    if candidate.get("type") != "participants" or candidate.get("participant_type_id") != 2:
        return -100
    player_tokens = set(tokens(record.get("player")))
    title_tokens = set(tokens(candidate.get("title", "").split("(", 1)[0]))
    score = len(player_tokens & title_tokens) * 10
    if player_tokens and player_tokens <= title_tokens:
        score += 20
    wanted_country = COUNTRIES.get(record.get("team"))
    country = candidate.get("country_name") or ""
    if wanted_country and fold(wanted_country) == fold(country):
        score += 12
    club = record.get("club")
    if club and fold(club) in fold(candidate.get("title", "")):
        score += 4
    return score


def main():
    data = load_stats()
    targets = [(key, record) for key, record in data.items() if not record.get("direttaPlayerId")]
    session = requests.Session(impersonate="chrome120")
    linked = []
    skipped = []
    for index, (key, record) in enumerate(targets, start=1):
        results = search_player(session, record.get("player", ""))
        ranked = sorted(results, key=lambda item: score_candidate(record, item), reverse=True)
        best = ranked[0] if ranked else None
        if best and score_candidate(record, best) >= 20:
            record["direttaPlayerId"] = best["id"]
            record["direttaPlayerUrl"] = f"https://www.diretta.it/giocatore/{best.get('url', 'profilo')}/{best['id']}/"
            linked.append((key, best.get("title"), best.get("country_name")))
        else:
            skipped.append((key, best.get("title") if best else "no result", score_candidate(record, best) if best else 0))
        if index % 25 == 0:
            print(f"Searched {index}/{len(targets)} - linked {len(linked)}")
        time.sleep(0.06)
    save_stats(data)
    print(json.dumps({"linked": len(linked), "skipped": len(skipped), "linkedSample": linked[:20], "skippedSample": skipped[:30]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
