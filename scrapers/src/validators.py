from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, List, Tuple

from scrapers.src.models.schemas import ClassSchema, FeatSchema, SpellSchema


def discover_json_files(base_dir: Path, subdir: str) -> Iterable[Path]:
    path = base_dir / subdir
    if not path.exists():
        return []
    return path.glob("*.json")


def validate_file(path: Path, schema_class: type) -> Tuple[Path, bool, str]:
    try:
        raw = json.loads(path.read_text())
        schema_class(**raw)
        return path, True, ""
    except Exception as exc:  # pylint: disable=broad-except
        return path, False, str(exc)


def run_validation() -> int:
    base = Path(__file__).resolve().parents[2] / "output" / "data"
    validators = [
        ("classes", ClassSchema),
        ("feats", FeatSchema),
        ("spells", SpellSchema),
    ]
    failures: List[Tuple[Path, str]] = []

    for subdir, schema in validators:
        for file_path in discover_json_files(base, subdir):
            path, ok, error = validate_file(file_path, schema)
            if not ok:
                failures.append((path, error))

    if failures:
        for path, error in failures:
            print(f"❌ {path}: {error}")
        return 1

    print(f"✅ Validated all static data ({len(validators)} categories)")
    return 0


if __name__ == "__main__":
    raise SystemExit(run_validation())
