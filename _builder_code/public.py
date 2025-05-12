"""
20250512
"""

import datetime as dt
import json
from pathlib import Path

ROOT = Path.cwd() / "app_code"
SOURCE = ROOT / "public"
MANIFEST = "__manifest__"



def main():
    """Creates or updates manifest for '/public'."""
    timestamp = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S}"

    paths = [
        f"/{file.relative_to(SOURCE).as_posix()}"
        for file in SOURCE.rglob("*.*")
        if not (file.stem.startswith('__') and file.stem.endswith('__'))
    ]
    content = json.dumps(paths)

    file = SOURCE / f"{MANIFEST}.json"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")

    file = ROOT / "src/rollovite/tools/public" / f"{MANIFEST}.js"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(
        f"/* Auto-generated: {timestamp} */\n\nexport default Object.freeze(new Set({content}));",
        encoding="utf-8",
    )

    print(f"Created manifest with {len(paths)} paths.")


if __name__ == "__main__":
    main()
