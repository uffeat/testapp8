"""
pip install Jinja2
server/ssg.py
20250521
"""

import json
from jinja2 import Template
from minify_html import minify
from tools.clear import clear
from tools.connect import connect
from tools.endpoint import endpoint
from tools.write import write

PUBLIC = "public"
DIR = "rollossg"


def main():
    """Spins up a local Anvil server that serves 'ssg' endpoint."""

    clear(f"{PUBLIC}/{DIR}")

    keep_connection = connect()

    @endpoint
    def ssg(data: dict, submission: int = None) -> dict:
        """Writes ssg files and manifest to disc."""

        ##print("data: ", data)

       

        """TODO
        Sortable results
        """

        template = Template(data.pop('template'))

        content: dict = data['content']
        for path, detail in content.items():
            html = detail['html']
            headline = detail['meta']['headline']
            result = template.render(headline=headline, html=html)
            result = minify(result)

            print("result: ", result)

            write(f"{PUBLIC}/{DIR}/{path}", result)

            
        write(f"{PUBLIC}/{DIR}/__manifest__.json", json.dumps([f"/{DIR}{path}" for path in content.keys()]),)
        return dict(ok=True)

    keep_connection()


if __name__ == "__main__":
    main()
