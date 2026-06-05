import importlib.util
import json
import re
import sys
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STATS_PATH = ROOT / "stats.json"
JS_PATH = ROOT / "js" / "stats.js"
BULK_PATH = ROOT / "scripts" / "bulk-player-stats.py"


def load_bulk_module():
    spec = importlib.util.spec_from_file_location("bulk_player_stats", BULK_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def fold(value):
    return re.sub(r"\s+", " ", str(value or "").lower()).strip()


def flex(value):
    text = unicodedata.normalize("NFD", str(value or ""))
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_rows():
    text = (ROOT / "js" / "data.js").read_text(encoding="utf-8-sig")
    start = text.find("const rows = ")
    if start < 0:
        return []
    start = text.find("[", start)
    end = text.find("];", start)
    return json.loads(text[start:end + 1])


def save_stats(data):
    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    bundled = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    STATS_PATH.write_text(serialized + "\n", encoding="utf-8")
    JS_PATH.write_text("const playerStats=" + bundled + ";\n", encoding="utf-8")


def main():
    bulk = load_bulk_module()
    data = json.loads(STATS_PATH.read_text(encoding="utf-8"))
    rows = load_rows()
    stats_index = {}
    for key in data:
        team, player = key.split("::", 1)
        stats_index[f"{flex(team)}::{flex(player)}"] = key
    goalkeeper_keys = []
    for row in rows:
        if row.get("role") != "Portieri":
            continue
        direct_key = f"{fold(row.get('team'))}::{fold(row.get('player'))}"
        key = direct_key if direct_key in data else stats_index.get(f"{flex(row.get('team'))}::{flex(row.get('player'))}")
        if key:
            goalkeeper_keys.append(key)
    targets = [(key, data[key]) for key in sorted(set(goalkeeper_keys)) if data[key].get("direttaPlayerId")]
    updated = 0
    failed = []

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(bulk.profile_recent15, record): key for key, record in targets}
        for future in as_completed(futures):
            key = futures[future]
            try:
                result = future.result()
            except Exception as exc:
                failed.append((key, str(exc)))
                continue
            if result:
                previous = data[key].get("recent15") or {}
                if previous.get("advanced"):
                    result["advanced"] = previous["advanced"]
                result["scope"] = previous.get("scope") or "Club + nazionale"
                data[key]["recent15"] = result
                updated += 1
            else:
                failed.append((key, "no recent data"))

    save_stats(data)
    print(json.dumps({"targets": len(targets), "updated": updated, "failed": len(failed), "failedSample": failed[:30]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
