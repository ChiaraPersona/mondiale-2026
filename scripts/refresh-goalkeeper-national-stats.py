import importlib.util
import json
import re
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STATS_PATH = ROOT / "stats.json"
DATA_PATH = ROOT / "data" / "stats.json"
JS_PATH = ROOT / "js" / "stats.js"
BULK_PATH = ROOT / "scripts" / "bulk-player-stats.py"

ALIASES = {
    "Algeria": ["algeria", "algerien"],
    "Arabia Saudita": ["arabia saudita", "saudi arabia", "saudi-arabien"],
    "Argentina": ["argentina", "argentinien"],
    "Australia": ["australia", "australien"],
    "Austria": ["austria", "osterreich", "österreich"],
    "Belgio": ["belgio", "belgium", "belgien"],
    "Bosnia ed Erzegovina": ["bosnia ed erzegovina", "bosnia & herzegovina", "bosnien und herzegowina"],
    "Brasile": ["brasile", "brazil", "brasilien"],
    "Canada": ["canada", "kanada"],
    "Capo Verde": ["capo verde", "cape verde", "kap verde"],
    "Colombia": ["colombia", "kolumbien"],
    "Corea del Sud": ["corea del sud", "south korea", "sudkorea", "südkorea"],
    "Costa d'Avorio": ["costa d avorio", "ivory coast", "elfenbeinkuste", "elfenbeinküste"],
    "Croazia": ["croazia", "croatia", "kroatien"],
    "Curacao": ["curacao", "curaçao"],
    "Ecuador": ["ecuador"],
    "Egitto": ["egitto", "egypt", "agypten", "ägypten"],
    "Francia": ["francia", "france", "frankreich"],
    "Germania": ["germania", "germany", "deutschland"],
    "Ghana": ["ghana"],
    "Giappone": ["giappone", "japan"],
    "Giordania": ["giordania", "jordan", "jordanien"],
    "Haiti": ["haiti"],
    "Inghilterra": ["inghilterra", "england"],
    "Iran": ["iran"],
    "Iraq": ["iraq"],
    "Marocco": ["marocco", "morocco", "marokko"],
    "Messico": ["messico", "mexico", "mexiko"],
    "Norvegia": ["norvegia", "norway", "norwegen"],
    "Nuova Zelanda": ["nuova zelanda", "new zealand", "neuseeland"],
    "Olanda": ["olanda", "netherlands", "niederlande"],
    "Panama": ["panama"],
    "Paraguay": ["paraguay"],
    "Portogallo": ["portogallo", "portugal"],
    "Qatar": ["qatar", "katar"],
    "RD Congo": ["rd congo", "dr congo", "dr kongo", "democratic republic of congo"],
    "Repubblica Ceca": ["repubblica ceca", "czech republic", "tschechien"],
    "Scozia": ["scozia", "scotland", "schottland"],
    "Senegal": ["senegal"],
    "Spagna": ["spagna", "spain", "spanien"],
    "Stati Uniti": ["stati uniti", "usa", "united states", "vereinigte staaten"],
    "Sudafrica": ["sudafrica", "south africa", "sudafrika", "südafrika"],
    "Svezia": ["svezia", "sweden", "schweden"],
    "Svizzera": ["svizzera", "switzerland", "schweiz"],
    "Tunisia": ["tunisia", "tunesien"],
    "Turchia": ["turchia", "turkey", "turkei", "türkei"],
    "Uruguay": ["uruguay"],
    "Uzbekistan": ["uzbekistan", "usbekistan"],
}


def load_bulk_module():
    spec = importlib.util.spec_from_file_location("bulk_player_stats", BULK_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def fold(value):
    text = unicodedata.normalize("NFD", str(value or ""))
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_rows():
    text = (ROOT / "js" / "data.js").read_text(encoding="utf-8-sig")
    start = text.find("const rows = ")
    start = text.find("[", start)
    end = text.find("];", start)
    return json.loads(text[start:end + 1])


def stats_index(data):
    index = {}
    for key in data:
        team, player = key.split("::", 1)
        index[f"{fold(team)}::{fold(player)}"] = key
    return index


def row_key(row, index, data):
    direct = f"{str(row.get('team') or '').lower()}::{str(row.get('player') or '').lower()}"
    if direct in data:
        return direct
    return index.get(f"{fold(row.get('team'))}::{fold(row.get('player'))}")


def side_for(team, match):
    aliases = [fold(item) for item in ALIASES.get(team, [team])]
    home = fold(match.get("homeTeam") or match.get("home") or "")
    away = fold(match.get("awayTeam") or match.get("away") or "")
    if any(alias and (alias in home or home in alias) for alias in aliases):
        return "home"
    if any(alias and (alias in away or away in alias) for alias in aliases):
        return "away"
    return ""


def conceded_for(team, match):
    side = side_for(team, match)
    home_score = match.get("homeScore")
    away_score = match.get("awayScore")
    if side == "home" and away_score is not None:
        return away_score
    if side == "away" and home_score is not None:
        return home_score
    return None


def national_profile(bulk, row, record, max_pages=7):
    player_id = record.get("direttaPlayerId")
    if not player_id:
        return None
    session = bulk.requests.Session(impersonate="chrome120")
    sample = []
    for page in range(1, max_pages + 1):
        for raw in bulk.more_matches(session, player_id, page):
            parsed = bulk.parse_match_row(raw)
            if not parsed:
                continue
            conceded = conceded_for(row["team"], parsed)
            if conceded is None:
                continue
            parsed["goalsConceded"] = conceded
            sample.append(parsed)
            if len(sample) >= 15:
                break
        if len(sample) >= 15:
            break
    if not sample:
        return None
    ratings = [item["rating"] for item in sample if item.get("rating") is not None]
    goals_conceded = sum(item["goalsConceded"] for item in sample)
    return {
        "scope": "Ultime 15 partite in nazionale",
        "appearances": len(sample),
        "goalsConceded": goals_conceded,
        "goalsConcededPerGame": f"{goals_conceded / len(sample):.2f}",
        "averageRating": f"{sum(ratings) / len(ratings):.2f}" if ratings else "",
        "sample": sample,
    }


def save_stats(data):
    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    STATS_PATH.write_text(serialized + "\n", encoding="utf-8")
    DATA_PATH.write_text(serialized + "\n", encoding="utf-8")
    JS_PATH.write_text("const playerStats = " + serialized + ";\n", encoding="utf-8")


def main():
    bulk = load_bulk_module()
    data = json.loads(STATS_PATH.read_text(encoding="utf-8"))
    rows = load_rows()
    index = stats_index(data)
    targets = []
    for row in rows:
        if row.get("role") != "Portieri":
            continue
        key = row_key(row, index, data)
        if key and data[key].get("direttaPlayerId"):
            targets.append((key, row, data[key]))

    updated = 0
    failed = []
    changed = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(national_profile, bulk, row, record): (key, row) for key, row, record in targets}
        for future in as_completed(futures):
            key, row = futures[future]
            try:
                profile = future.result()
            except Exception as exc:
                failed.append((key, str(exc)))
                continue
            if not profile:
                failed.append((key, "no national sample"))
                continue
            previous = data[key].get("recent15", {}).get("nationalGoalkeeper", {})
            data[key].setdefault("recent15", {})["nationalGoalkeeper"] = profile
            updated += 1
            if previous.get("goalsConcededPerGame") != profile.get("goalsConcededPerGame"):
                changed.append({
                    "team": row.get("team"),
                    "player": row.get("player"),
                    "general": data[key].get("recent15", {}).get("goalsConcededPerGame", ""),
                    "national": profile.get("goalsConcededPerGame", ""),
                    "nationalMatches": profile.get("appearances"),
                })

    save_stats(data)
    print(json.dumps({
        "targets": len(targets),
        "updated": updated,
        "failed": len(failed),
        "changedSample": changed[:50],
        "failedSample": failed[:20],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
