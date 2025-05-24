"""
rollopress/main.py
20250524
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


SRC = Path.cwd() / "rollopress/src"
TEMPLATES = Path.cwd() / "rollopress/templates"


class RolloPress:
    @classmethod
    def config(cls, dst: Path = None) -> "RolloPress":
        """Configues dst."""
        if dst is None:
            dst = Path.cwd() / "rollopress/dst"
        cls.dst = dst

        return cls

    def __init__(self):
        """Generates SDG files and a manifest.json file.
        NOTE
        Output files are integer-named corresponding to their sort order with
        respect to md-file creation time. This reduces the need for elaborate
        manifest files.
        Any 'template' declaration in the YAML block of md files is
        automatically removed from the meta data and used to instruct build
        process. This enables a flat YAML block structure.
        If the YAML block declares a template, the md-generated html if interpolated
        into the template along with meta data."""
        self.clear()
        data = []

        for path in SRC.glob("*.md"):
            """NOTE 
                `glob("**/*.md")`  
            combined with 
                `path.relative_to(SRC).with_suffix(".template").as_posix()`
            could handle nested structures, but we intentionally go for flat!"""
            # 
            meta, content = self.parse(path)
            data.append(dict(meta=meta, content=content, name=path.stem))

        data.sort(key=lambda item: dt.datetime.fromisoformat(item["meta"]["created"]))

        for index, item in enumerate(data):
            self.save(
                f"{index}.json",
                json.dumps({"meta": item["meta"], "content": item["content"]}),
            )

        self.save(".manifest/index.json", json.dumps({"count": index + 1}))

    @staticmethod
    def clear() -> None:
        """Clears dst."""
        if RolloPress.dst.exists():
            for item in RolloPress.dst.iterdir():
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()

    @staticmethod
    def parse(path: Path) -> tuple[dict, str]:
        """Returns meta data and html content.
        NOTE Relies on native exceptions, if invalid template."""
        entry: dict = Frontmatter.read_file(path)
        meta: dict = entry["attributes"]
        # If meta data does not declare 'created', use file creation timestamp.
        meta["created"] = (
            meta.get("created")
            or f"{dt.datetime.fromtimestamp(path.stat().st_mtime):%Y-%m-%d %H:%M}"
        )

        content = markdown.render(entry["body"])
        # If template declared in md file, interpolate md-created and meta
        # data into template
        template = meta.pop("template", None)
        if template:
            content = Template(
                (TEMPLATES / template).read_text(encoding="utf-8")
            ).render(content=content, **meta)
        content = minify(content)
        return meta, content

    @staticmethod
    def save(name: str, text: str) -> None:
        """Saves file to dst."""
        path: Path = RolloPress.dst / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            text,
            encoding="utf-8",
        )


if __name__ == "__main__":
    # NOTE Only dst should be considered configurable; can be set here.
    RolloPress.config()()
