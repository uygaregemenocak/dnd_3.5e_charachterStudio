from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Iterable, List

import requests
from bs4 import BeautifulSoup

from scrapers.src.models.schemas import ClassLevel, ClassSchema, ClassProgression, SaveProgression, SpellcastingInfo, SpellcastingType


class D20SRDScraper:
    BASE_URL = "https://www.d20srd.org"

    def scrape_class(self, class_name: str) -> ClassSchema:
        url = f"{self.BASE_URL}/srd/classes/{class_name}.htm"
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        hit_die_text = soup.find(text="Hit Die:")
        hit_die = self._parse_hit_die(hit_die_text)

        progression_table = soup.find("table", class_="table")
        levels = self._parse_progression_table(progression_table)

        progression = ClassProgression(
            bab=SaveProgression.poor,
            saves={"fortitude": SaveProgression.poor, "reflex": SaveProgression.poor, "will": SaveProgression.good},
            levels=levels,
        )

        spellcasting = SpellcastingInfo(
            type=SpellcastingType.prepared,
            ability="intelligence",
            spell_list=class_name.lower(),
            spellbook_required=True,
            cantrips_known="all",
        )

        return ClassSchema(
            id=class_name.lower(),
            name=class_name.title(),
            type="base",
            source="d20SRD",
            hit_die=hit_die,
            skill_points_per_level=2,
            class_skills=["spellcraft", "knowledge_arcana"],
            progression=progression,
            spellcasting=spellcasting,
        )

    @staticmethod
    def _parse_hit_die(node) -> int:
        if not node:
            raise ValueError("Hit Die node not found")
        text = node.find_next().text.strip()
        return int(text.strip("d"))

    @staticmethod
    def _parse_progression_table(table) -> List[ClassLevel]:
        if table is None:
            return []
        rows = table.find_all("tr")[1:]
        levels = []
        for row in rows:
            cols = row.find_all("td")
            if len(cols) < 5:
                continue
            levels.append(
                ClassLevel(
                    level=int(cols[0].text.strip()),
                    bab=float(cols[1].text.strip()),
                    fort=int(cols[2].text.replace("+", "").strip()),
                    ref=int(cols[3].text.replace("+", "").strip()),
                    will=int(cols[4].text.replace("+", "").strip()),
                    spells_per_day=None,
                    features=[],
                )
            )
        return levels

    def persist_class(self, schema: ClassSchema, output_dir: Path) -> Path:
        output_dir.mkdir(parents=True, exist_ok=True)
        target = output_dir / f"{schema.id}.json"
        target.write_text(json.dumps(schema.dict(), indent=2))
        return target


def run_example():
    scraper = D20SRDScraper()
    schema = scraper.scrape_class("wizard")
    scraper.persist_class(schema, Path("scrapers/output/data/classes"))


if __name__ == "__main__":
    run_example()
