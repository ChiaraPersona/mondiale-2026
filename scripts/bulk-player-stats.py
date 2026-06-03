import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(".tmp-pydeps").resolve()))

from curl_cffi import requests


ROOT = Path(__file__).resolve().parents[1]
STATS_PATH = ROOT / "stats.json"
DATA_PATH = ROOT / "data" / "stats.json"
JS_PATH = ROOT / "js" / "stats.js"

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "referer": "https://www.diretta.it/",
    "x-fsign": "SW9D1eZo",
}


def load_stats():
    with STATS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_stats(data):
    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    STATS_PATH.write_text(serialized + "\n", encoding="utf-8")
    DATA_PATH.write_text(serialized + "\n", encoding="utf-8")
    JS_PATH.write_text("const playerStats = " + serialized + ";\n", encoding="utf-8")


def extract_last_matches(html):
    marker = '"lastMatchesData":'
    start = html.find(marker)
    if start < 0:
        return []
    idx = start + len(marker)
    while idx < len(html) and html[idx].isspace():
        idx += 1
    if idx >= len(html) or html[idx] != "{":
        return []
    depth = 0
    in_string = False
    escape = False
    end = idx
    for pos in range(idx, len(html)):
        ch = html[pos]
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = pos + 1
                break
    try:
        payload = json.loads(html[idx:end])
    except Exception:
        return []
    return payload.get("matches") or []


def match_from_feed_line(line):
    parts = line.split("¬")
    item = {}
    for part in parts:
        if "÷" in part:
            key, value = part.split("÷", 1)
            item[key] = value
    if "AA" not in item:
        return None
    return {
        "eventId": item.get("AA"),
        "timestamp": int(item["AD"]) if item.get("AD", "").isdigit() else None,
        "home": item.get("AE", ""),
        "away": item.get("AF", ""),
        "homeScore": int(item["AG"]) if item.get("AG", "").isdigit() else None,
        "awayScore": int(item["AH"]) if item.get("AH", "").isdigit() else None,
        "competition": item.get("ZA", "").split(": ", 1)[-1],
    }


def more_matches(session, player_id, page):
    url = f"https://local-it.flashscore.ninja/4/x/feed/plm_{player_id}_{page}"
    response = session.get(url, headers=HEADERS, timeout=25)
    if response.status_code != 200:
        return []
    try:
        payload = response.json()
    except Exception:
        return [m for m in (match_from_feed_line(line) for line in response.text.split("~")) if m]
    return payload.get("lastMatches") or []


def normalize_number(value):
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return value
    text = str(value).strip().replace(",", ".")
    if text in {"-", ""}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def stat_value(stats, wanted_type):
    for raw in (stats or {}).values():
        if not isinstance(raw, dict):
            continue
        if raw.get("type") == wanted_type:
            return normalize_number(str(raw.get("value", "")).replace("'", ""))
    return None


def parse_match_row(match):
    stats = match.get("stats") or {}
    minutes = stat_value(stats, "minutes-played")
    if not minutes:
        return None
    rating = stat_value(stats, "rating")
    home_score = match.get("homeScore")
    away_score = match.get("awayScore")
    return {
        "date": match.get("date") or match.get("eventStartTime"),
        "competition": match.get("competitionName") or match.get("tournamentTitle") or match.get("competition") or "",
        "homeTeam": match.get("homeParticipantName") or match.get("home") or "",
        "awayTeam": match.get("awayParticipantName") or match.get("away") or "",
        "homeScore": home_score,
        "awayScore": away_score,
        "score": f"{home_score}-{away_score}" if home_score is not None and away_score is not None else "",
        "minutes": int(minutes),
        "rating": normalize_number(match.get("rating")) if rating is None else rating,
        "goals": int(stat_value(stats, "goal") or 0),
        "assists": int(stat_value(stats, "assist") or 0),
        "yellowCards": int(stat_value(stats, "yellow-card") or 0),
        "redCards": int(stat_value(stats, "red-card") or 0),
    }


def profile_recent15(record):
    player_id = record.get("direttaPlayerId")
    if not player_id:
        return None

    session = requests.Session(impersonate="chrome120")
    matches = []
    page = 1
    while len(matches) < 30 and page <= 5:
        extra = more_matches(session, player_id, page)
        if not extra:
            break
        matches.extend(extra)
        page += 1
        time.sleep(0.08)

    sample = []
    for match in matches:
        parsed = parse_match_row(match)
        if parsed:
            sample.append(parsed)
        if len(sample) >= 15:
            break

    if not sample:
        return None

    appearances = len(sample)
    minutes = sum(m["minutes"] for m in sample)
    goals = sum(m["goals"] for m in sample)
    assists = sum(m["assists"] for m in sample)
    yellow = sum(m["yellowCards"] for m in sample)
    red = sum(m["redCards"] for m in sample)
    ratings = [m["rating"] for m in sample if m["rating"] is not None]

    result = {
        "appearances": appearances,
        "minutes": minutes,
        "goals": goals,
        "assists": assists,
        "yellowCards": yellow,
        "redCards": red,
        "matchesSample": appearances,
        "averageRating": f"{sum(ratings) / len(ratings):.2f}" if ratings else "",
        "sample": sample,
    }
    return result


def main():
    data = load_stats()
    targets = [(key, record) for key, record in data.items() if not record.get("recent15") and record.get("direttaPlayerUrl")]
    print(f"Diretta targets: {len(targets)}")
    done = 0
    failed = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(profile_recent15, record): key for key, record in targets}
        for future in as_completed(futures):
            key = futures[future]
            try:
                result = future.result()
            except Exception as exc:
                result = None
                failed.append((key, str(exc)))
            if result:
                data[key]["recent15"] = result
                sources = data[key].setdefault("sources", [])
                if "https://www.diretta.it/" not in sources:
                    sources.append("https://www.diretta.it/")
                done += 1
            elif key not in [item[0] for item in failed]:
                failed.append((key, "no recent data"))
            if (done + len(failed)) % 50 == 0:
                print(f"Processed {done + len(failed)}/{len(targets)} - updated {done}")

    save_stats(data)
    print(json.dumps({"updated": done, "failed": len(failed), "failedSample": failed[:20]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
