"""Transform studio/scripts/seed/seed.ndjson into an import-ready seed.import.ndjson.

Fixes 5 schema-vs-seed mismatches (seed file itself is never modified):
  1. course.modules[]: _type "module" -> "courseModule"
  2. lesson: key "thumbnail" -> "poster"
  3. lesson: key "duration" -> "durationSeconds"
  4. instructor.expertise: [...] array -> "A · B · C" string
  5. lesson.resources[].type: "link" -> "docs"

Deterministic: same input bytes -> same output bytes. Preserves _ids, _keys,
slugs, refs, and Portable Text blocks.
"""
import json
import sys
from pathlib import Path

SRC = Path(__file__).with_name("seed.ndjson")
DST = Path(__file__).with_name("seed.import.ndjson")

EXPECTED_COUNTS = {"category": 6, "instructor": 5, "lesson": 120, "course": 10}


def transform(doc: dict) -> dict:
    t = doc.get("_type")
    if t == "course":
        for mod in doc.get("modules", []):
            if mod.get("_type") == "module":
                mod["_type"] = "courseModule"
    elif t == "lesson":
        if "thumbnail" in doc and "poster" not in doc:
            doc["poster"] = doc.pop("thumbnail")
        if "duration" in doc and "durationSeconds" not in doc:
            doc["durationSeconds"] = doc.pop("duration")
        for res in doc.get("resources", []):
            if res.get("type") == "link":
                res["type"] = "docs"
    elif t == "instructor":
        exp = doc.get("expertise")
        if isinstance(exp, list):
            doc["expertise"] = " · ".join(str(x) for x in exp)
    return doc


def main() -> None:
    with open(SRC, encoding="utf-8") as f:
        lines = [line for line in f if line.strip()]
    assert len(lines) == 141, f"expected 141 docs, got {len(lines)}"

    out_lines = []
    counts: dict[str, int] = {}
    for line in lines:
        doc = json.loads(line)
        doc = transform(doc)
        counts[doc.get("_type", "?")] = counts.get(doc.get("_type", "?"), 0) + 1
        out_lines.append(json.dumps(doc, ensure_ascii=False))

    assert counts == EXPECTED_COUNTS, f"count mismatch: {counts}"

    # No leftovers of the old shapes.
    blob = "\n".join(out_lines)
    assert '"_type": "module"' not in blob, "leftover module _type"
    assert '"thumbnail"' not in blob, "leftover thumbnail key"
    assert '"duration":' not in blob, "leftover duration key"
    assert '"type": "link"' not in blob, "leftover link resource type"
    assert '"expertise": [' not in blob, "leftover expertise array"

    with open(DST, "w", encoding="utf-8") as f:
        f.write("\n".join(out_lines) + "\n")

    print(f"in:  {len(lines)} docs")
    print(f"out: {len(out_lines)} docs -> {DST.name}")
    for k in sorted(counts):
        print(f"  {k}: {counts[k]}")
    print("leftover checks: OK")


if __name__ == "__main__":
    sys.exit(main())
