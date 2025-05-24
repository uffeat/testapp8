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
    NOTE The keysword 'template' in the YAML block of md files is 
    automatically removed from 'meta' and used to instruct build
    process. This enables a flat YAML block structure."""

    """Clear DST."""
    if DST.exists():
        for item in DST.iterdir():
            if item.is_dir():
                shutil.rmtree(item)
            else:
                item.unlink()

    """Prepare SRC files for processing.
    NOTE `glob("**/*.md")`includes sub-dirs, 
    ... but we use a flat structure!
    """

item = {
    'content': None,
    'meta': {}
}


for path in SRC.glob("*.md"):
    ...

    """Frontmatter-parse, add path and file creation."""
    data = [
        {
            "entry": Frontmatter.read_file(path),
            "name": path.stem,
            # Capture file-creation timestamp
            "created": f"{dt.datetime.fromtimestamp(path.stat().st_mtime):%Y-%m-%d %H:%M}",
        }
        for path in paths
    ]

    """Reorganize item and create html."""
    for item in data:
        # Extract 'meta' from entry
        item["meta"] = item['entry']["attributes"]
        # Use file-creation timestamp as 'meta.created', if not declared
        if not item["meta"].get("created"):
            item["meta"]["created"] = item["created"]
        # Purge file-creation timestamp
        item.pop("created")
        # Create content from markdown
        item["content"] = markdown.render(item['entry']["body"])
        # Purge entry
        item.pop("entry")
        # Use any template
        if item["meta"].get("template"):
            item["content"] = Template(
                (TEMPLATES / item["meta"]["template"]).read_text(encoding="utf-8")
            ).render(content=item["content"], **item["meta"])
        # Purge any template
        item["meta"].pop("template", None)
        # Minify
        item["content"] = minify(item["content"])
        

    """Sort according to 'created'."""
    data.sort(key=lambda item: dt.datetime.fromisoformat(item['meta']['created']))

    ##
    """Update DST."""
    for index, item in enumerate(data):
        #item.pop("stem")
        path: Path = (DST / f'{index}').with_suffix(".json")
        path.parent.mkdir(parents=True, exist_ok=True)

        path.write_text(
            json.dumps({"meta": item["meta"], "content": item["content"]}),
            encoding="utf-8",
        )

    print('count:', index + 1)
    

   

    ##print("data: ", data)  ##


if __name__ == "__main__":
    main()
