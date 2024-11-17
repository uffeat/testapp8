"""

"""

import datetime as dt
import json
from pathlib import Path
import shutil
from bs4 import BeautifulSoup as bs

timestamp = f"Auto-generated: {dt.datetime.now():%Y-%m-%d %H:%M:%S}"

SOURCE = Path.cwd() / "source_code/src"
TARGET = Path.cwd() / "react_code/app/src/built"


def delete_directory(path: Path) -> None:
    """Deletes all directories and files in a given directory."""
    if path is SOURCE:
        raise ValueError("src should not be deleted.")

    if path.exists() and path.is_dir():
        for item in path.iterdir():
            if item.is_dir():
                # Delete the directory and all its contents
                shutil.rmtree(item)
            else:
                # Deletes the file
                item.unlink()

    print(f"Deleted content of '{path.relative_to(Path.cwd())}'")


def read_from_source(file: Path) -> tuple[str, str]:
    """Returns src-relative files name and file content from src asset file."""
    name = f"{file.relative_to(SOURCE).as_posix()}"
    content = file.read_text(encoding="utf-8")
    return name, content


def write_to_target(name: str, content: str) -> None:
    content = f"/* {timestamp} */\n{content}"
    file = TARGET / name
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")
    print(f"'{name}' created.")


def create_js(path: str, soup: bs) -> str:
    """Returns js extracted from htmlx."""
    template_element = soup.select_one("template[asset]")
    if not template_element:
        raise ValueError("'template' element with 'asset' attribute not found.")
    template_html = template_element.decode_contents()
    content = bs(template_html, "html.parser")
    # Get and check script elememnts
    scripts = content.select("script[main]")
    if len(scripts) > 1:
        raise ValueError(
            "'asset' template element can contain max one main script element."
        )
    # Get template elements
    templates = content.select("template[name]")
    # Get style elements
    styles = content.select("style[name]")
    # Init js text
    js = ""
    # Add html vars
    if templates:
        for element in templates:
            name = element.attrs["name"]
            html = json.dumps(element.decode_contents().strip())
            js = f"const {name} = {html};\n{js}"
    # Add css vars
    if styles:
        for element in styles:
            name = element.attrs["name"]
            css = json.dumps(element.decode_contents().strip())
            js = (
                f"const {name} = new CSSStyleSheet();\n{name}.replaceSync({css});\n{js}"
            )
    # Add text from main script element
    if scripts:
        js = f"{js}\n{scripts[0].decode_contents()}"
    # Add __path__
    path = f"{path[:-len('.html')]}.js"
    js = f'const __path__ = "{path}";\n{js}'

    return js


def transpile():
    """Creates built assets."""

    delete_directory(TARGET)

    build_count = 0

    # Traverse asset src files
    for file in SOURCE.rglob("*.*"):

        name, content = read_from_source(file)

        # Ignore development files
        if " " in name:
            continue

        # Ignore test files
        if ".test." in name or "/test/" in name:
            continue
        if name.startswith("test/"):
            continue

        # Ignore local-only files
        if ".local." in name or "/local/" in name:
            continue
        if name.startswith("local/"):
            continue

        
        name_built = f"{name[:-len('.html')]}.js"

        soup = bs(content, "html.parser")
        js = create_js(name, soup)

        write_to_target(name_built, js)
        build_count += 1

    print(f"Assets build: {build_count}.")


if __name__ == "__main__":
    transpile()
