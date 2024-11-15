import datetime as dt
import json
from pathlib import Path
from anvil.server import connect, disconnect, get_app_origin


TARGET = "source_code/app/src/meta/app_origins.js"

def main():
    """Writes 'src/meta/app_origin.js' to react app."""
    # Get development app origin
    connect(
        (json.loads((Path.cwd() / "uplink_keys.json").read_text(encoding="utf-8")))[
            "development"
        ]["client"]
    )
    development = get_app_origin()
    disconnect()
    # Get production app origin
    connect(
        (json.loads((Path.cwd() / "uplink_keys.json").read_text(encoding="utf-8")))[
            "production"
        ]["client"]
    )
    production = get_app_origin()
    disconnect()
    # Create content for js file
    timestamp_line = f"/*Auto-generated: {dt.datetime.now():%Y-%m-%d %H:%M:%S}*/\n"
    js = f'export default {{ development: "{development}", production: "{production}"  }};\n'
    content = f"{timestamp_line}{js}"
    # Write to js file
    file = Path.cwd() / TARGET
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")
    print(f"'{TARGET}' created.")


if __name__ == "__main__":
    main()
