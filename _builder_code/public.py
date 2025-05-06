"""
20250506
"""

import datetime as dt
import json
from pathlib import Path

SOURCE = Path.cwd() / "app_code/public"
NAME = "__paths__.json"


def main():
    """Creates or updates file registries for '/public'."""
    timestamp = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S}"

    paths = [
        f"/{file.relative_to(SOURCE).as_posix()}"
        for file in SOURCE.rglob("*.*")
        if file.name != NAME
    ]
    content = json.dumps(paths)

    file = Path.cwd() / "app_code/public/__paths__.json"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")

    file = Path.cwd() / "app_code/src/rollovite/tools/public/__paths__.js"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(f"/* Auto-generated: {timestamp} */\n\nexport default {content};", encoding="utf-8")


if __name__ == "__main__":
    main()
