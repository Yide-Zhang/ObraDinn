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
