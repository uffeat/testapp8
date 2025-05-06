"""
20250506
"""

import json
from pathlib import Path

SOURCE = Path.cwd() / "app_code/public"


def main():
    """Creates or updates '/public/__meta__/paths.json' with paths for all 
    files in '/public'."""
    paths = [file.relative_to(SOURCE).as_posix() for file in SOURCE.rglob("*.*")]
    content = json.dumps(paths)

    file = SOURCE / f"__meta__/paths.json"
    file.parent.mkdir(parents=True, exist_ok=True)

    file.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
