"""
pip install PyGithub
20250505
"""

import datetime as dt
import json
from pathlib import Path
from github import Github, Auth


def get_token():
    """Return GitHun token. Raises exception, if token expired."""
    secrets: dict = json.loads(
        (Path.cwd() / "secrets.json").read_text(encoding="utf-8")
    )
    expiry = secrets.get("github.token-expiry")
    if expiry:
        expiry = dt.datetime.strptime(expiry, "%Y%m%d").date()
        if expiry < dt.datetime.today().date():
            raise ValueError("Token expired.")
    return secrets.get("github.token")


REPO = "uffeat/testapp8"

# PR details
base = "production"
head = "development"
title = "development to production"
body = "Ready for production."


def main():
    """Merges development into production via a PR
    (in accordance with branch rules)."""
    # Get access to repo
    auth = Auth.Token(get_token())
    g = Github(auth=auth)
    repo = g.get_repo(REPO)
    # Create PR
    pr = repo.create_pull(title=title, body=body, head=head, base=base)
    print(f"Created PR #{pr.number}: {pr.title}")
    # Merge PR
    pr.merge(merge_method="merge")
    print(f"PR #{pr.number} merged successfully.")


if __name__ == "__main__":
    main()
