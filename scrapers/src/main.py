from pathlib import Path

from scrapers.src.scrapers.d20srd import D20SRDScraper


def main() -> None:
    scraper = D20SRDScraper()
    output_base = Path(__file__).resolve().parents[1] / "output" / "data" / "classes"
    schema = scraper.scrape_class("wizard")
    scraper.persist_class(schema, output_base)


if __name__ == "__main__":
    main()
