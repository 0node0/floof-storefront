#!/usr/bin/env python3
"""Trim transparent reads sticker design PNGs for product cards (no matte fill)."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "collections" / "reads" / "sticker-art"

# Full-size RGBA design exports (900px wide). Override with argv paths.
DEFAULT_SOURCES: dict[str, Path] = {
    "dog-ear-club.png": Path("art-dog-ear-club.png"),
    "i-prefer-hardcover.png": Path("art-i-prefer-hardcover.png"),
}


def trim_sticker(src: Path, pad: int = 4) -> Image.Image:
    im = Image.open(src).convert("RGBA")
    data = np.array(im)
    rgb = data[:, :, :3]
    dark = (rgb[:, :, 0] < 45) & (rgb[:, :, 1] < 45) & (rgb[:, :, 2] < 45)
    data[dark, 3] = 0
    im = Image.fromarray(data)
    bbox = im.getbbox()
    if not bbox:
        raise ValueError(f"No opaque pixels in {src}")
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width, right + pad)
    bottom = min(im.height, bottom + pad)
    return im.crop((left, top, right, bottom))


def main() -> None:
    design_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/cursor/stores/self")
    OUT.mkdir(parents=True, exist_ok=True)
    for out_name, rel in DEFAULT_SOURCES.items():
        src = design_dir / rel
        if not src.is_file():
            print(f"Skip {out_name}: missing {src}", file=sys.stderr)
            continue
        trimmed = trim_sticker(src)
        dest = OUT / out_name
        trimmed.save(dest, optimize=True)
        print(f"Wrote {dest} ({trimmed.size[0]}×{trimmed.size[1]})")


if __name__ == "__main__":
    main()
