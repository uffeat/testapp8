"""
20250515
"""

import datetime as dt
import json
from pathlib import Path

ROOT = Path.cwd() / "client"
SOURCE = ROOT / "public"


timestamp = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S}"


def write(path: str, content: str) -> None:
    """."""
    file = ROOT / path
    #
    if not (file.stem.startswith("__") and file.stem.endswith("__")):
        raise ValueError(f"Invalid file name: {file.name}")

    if file.suffix == ".js":
        content = f"/* Auto-generated: {timestamp} */\n\n{content}"
    #
    file.parent.mkdir(parents=True, exist_ok=True)
    #
    file.write_text(content, encoding="utf-8")


def main():
    """Creates or updates manifest for '/public'."""
    #
    paths = [
        f"/{file.relative_to(SOURCE).as_posix()}"
        for file in SOURCE.rglob("*.*")
        if not (file.stem.startswith("__") and file.stem.endswith("__"))
    ]
    content = json.dumps(paths)

    write("public/__manifest__.json", content)
    

    message = f"Created manifest with {len(paths)} paths."
    print(message)
    return message


if __name__ == "__main__":
    main()
