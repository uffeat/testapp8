"""
pypress/main.py
20250522
"""

import datetime as dt
from pathlib import Path
from frontmatter import Frontmatter
from jinja2 import Template
from markdown_it import MarkdownIt
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_emoji import emoji_plugin
from minify_html import minify

markdown = MarkdownIt().use(footnote_plugin).use(emoji_plugin).enable("table")


SRC = Path.cwd() / "pypress/src"
TEMPLATES = Path.cwd() / "pypress/templates"


def main() -> None:
    """Creates ..."""
    paths = [path for path in SRC.glob("**/*.md")]
    

    data = [
        {
            "entry": Frontmatter.read_file(path),
            "path": path.relative_to(SRC).with_suffix(".template").as_posix(),
            "created": f"{dt.datetime.fromtimestamp(path.stat().st_mtime):%Y-%m-%d %H:%M}",
        }
        for path in paths
    ]

    data = [
        {
            "template": item["entry"]["attributes"].get("template"),
            "meta": {
                key: value
                for key, value in item["entry"]["attributes"].items()
                if key != "template"
            },
            "content": minify(markdown.render(item["entry"]["body"])),
            **{key: value for key, value in item.items() if key != "entry"},
        }
        for item in data
    ]

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

    data = [
        {
            "content": (
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

    ##

    """
    Shape:

    """
    shape = []

    print("data: ", data)  ##


if __name__ == "__main__":
    main()
