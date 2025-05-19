"""
20250518
"""
import datetime as dt


def create_timestamp() -> str:
    """Returns timestamp."""
    return f"{dt.datetime.now():%Y-%m-%d %H:%M:%S}"
