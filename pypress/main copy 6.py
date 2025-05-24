"""
pypress/main.py
20250522
"""

import datetime as dt
import json
from pathlib import Path
import shutil
from frontmatter import Frontmatter
from jinja2 import Template
from markdown_it import MarkdownIt
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_emoji import emoji_plugin
from minify_html import minify

markdown = MarkdownIt().use(footnote_plugin).use(emoji_plugin).enable("table")

DST = Path.cwd() / "pypress/dst"
SRC = Path.cwd() / "pypress/src"
TEMPLATES = Path.cwd() / "pypress/templates"


def main() -> None:
    """Creates ...
    NOTE The keysword 'template' in YAML block of md
    files is automatically removed from 'meta' and used to instruct build
    process. This enables a flat YAML block structure."""

    """Clear DST."""
    if DST.exists():
        for item in DST.iterdir():
            if item.is_dir():
                shutil.rmtree(item)
            else:
                item.unlink()

    """Prepare SRC files for processing.
    NOTE
      paths = [path for path in SRC.glob("**/*.md")]
    """
    paths = [path for path in SRC.glob("*.md")]

    """Frontmatter-parse, add path and file creation."""
    data = [
        {
            "entry": Frontmatter.read_file(path),
            "stem": path.stem,
            "created": f"{dt.datetime.fromtimestamp(path.stat().st_mtime):%Y-%m-%d %H:%M}",
        }
        for path in paths
    ]

    """Extract any 'template' from meta and sanitize frontmatter."""
    data = [
        {
            "template": item["entry"]["attributes"].get("template"),
            "meta": {
                key: value
                for key, value in item["entry"]["attributes"].items()
                if key != "format" and key != "nest" and key != "template"
            },
            "content": markdown.render(item["entry"]["body"]),
            **{key: value for key, value in item.items() if key != "entry"},
        }
        for item in data
    ]

    """Use file-creation timestamp, if not explicitly declared."""
    data = [
        {
            "meta": {
                "created": item["meta"].get("created", item["created"]),
                **{
                    key: value
                    for key, value in item["meta"].items()
                    if key != "created"
                },
            },
            **{key: value for key, value in item.items() if key != "created"},
        }
        for item in data
    ]

    """Use and purge any template and minify.
    NOTE Rely on native error, if invalid template."""
    data = [
        {
            "content": minify(
                Template(
                    (TEMPLATES / item["template"]).read_text(encoding="utf-8")
                ).render(content=item["content"], **item["meta"])
                if item.get("template")
                else item["content"]
            ),
            **{
                key: value
                for key, value in item.items()
                if key != "content" and key != "template"
            },
        }
        for item in data
    ]

    """Sort according to 'created'."""
    ##data = data.sort(key=lambda item: dt.datetime.fromisoformat(item['meta']['created']))

    ##
    """Update DST.
    for item in data:
        path: Path = (DST / item.pop("stem")).with_suffix(".json")
        path.parent.mkdir(parents=True, exist_ok=True)

        path.write_text(
            json.dumps({"meta": item["meta"], "content": item["content"]}),
            encoding="utf-8",
        )
    """

    """
    Shape:

    """
    shape = []

    print("data: ", data)  ##


if __name__ == "__main__":
    main()
