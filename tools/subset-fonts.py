"""Regenerate the subsetted webfonts from the original font files.

The originals live in assets/original_fonts/ and are intentionally not committed
(see .gitignore); put them back before running this script.

Usage:
    python tools/subset-fonts.py

Requires: fonttools, brotli  (pip install fonttools brotli)
"""

import pathlib
import subprocess
import sys

from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets" / "original_fonts"
OUT_DIR = ROOT / "assets" / "fonts"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Every character the site can render: markup plus the strings in the data/render script.
SOURCES = [ROOT / "index.html", ROOT / "script.js"]
chars = set()
for path in SOURCES:
    chars |= set(path.read_text(encoding="utf-8"))

# Safety net so ordinary typed text, numbers and punctuation never fall back.
chars |= {chr(code) for code in range(0x20, 0x7F)}
chars |= set("　、。〈〉《》「」『』【】〔〕・ー—…‘’“”·×°±！？：；，．（）")
chars -= {"\r", "\n", "\t"}

char_file = OUT_DIR / "_subset-chars.txt"
char_file.write_text("".join(sorted(chars)), encoding="utf-8")
print(f"unique characters: {len(chars)}")

JOBS = [
    ("SOURCEHANSERIFSC-SEMIBOLD.OTF", "source-han-serif-sc-400.woff2"),
    ("SourceHanSerifSC-Heavy.otf", "source-han-serif-sc-900.woff2"),
    ("IMFeENrm28P.ttf", "im-fell-english-400.woff2"),
]

for src_name, out_name in JOBS:
    src = SRC_DIR / src_name
    if not src.exists():
        raise SystemExit(f"missing source font: {src}")
    out = OUT_DIR / out_name
    cmd = [
        sys.executable,
        "-m",
        "fontTools.subset",
        str(src),
        f"--text-file={char_file}",
        f"--output-file={out}",
        "--flavor=woff2",
        "--layout-features=*",
        "--no-hinting",
        "--desubroutinize",
        "--name-IDs=1,2,3,4,6",
        "--drop-tables+=DSIG",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout[-3000:])
        print(result.stderr[-3000:])
        raise SystemExit(1)
    before = src.stat().st_size / 1024
    after = out.stat().st_size / 1024
    print(f"{src_name} -> {out_name}: {before:,.0f} KB -> {after:,.1f} KB")

# Fail loudly instead of shipping a subset that renders some text in a fallback font.
# IM Fell only carries the Latin text, so it is checked against the Latin subset only.
latin = {char for char in chars if ord(char) <= 0x2E80}
checks = [
    ("source-han-serif-sc-400.woff2", chars),
    ("source-han-serif-sc-900.woff2", chars),
    ("im-fell-english-400.woff2", latin),
]

failures = []
for name, required in checks:
    font = TTFont(OUT_DIR / name)
    covered = set()
    for table in font["cmap"].tables:
        covered |= set(table.cmap.keys())
    font.close()
    missing = {char for char in required if ord(char) not in covered}
    print(f"{name}: {len(covered)} glyphs, {len(required)} required, missing {len(missing)}")
    if missing:
        failures.append((name, missing))

if failures:
    for name, missing in failures:
        print(f"  {name} MISSING: {''.join(sorted(missing))}")
    raise SystemExit("subset coverage check FAILED")

print("subset coverage check passed")
