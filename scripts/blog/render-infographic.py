#!/usr/bin/env python3
"""
Greenstone Wellness — branded infographic renderer (no external image credits).
Renders on-brand PNG infographics for blog posts using matplotlib + Pillow only.

Usage:
    python3 render-infographic.py spec.json out.png
  or pipe a JSON spec on stdin:
    cat spec.json | python3 render-infographic.py - out.png

Brand palette (from greenstonewellness.store theme):
    obsidian #0D1117 (bg) · obsidian-mid #161C26 · obsidian-light #1E2738
    emerald  #1A9E6E (primary) · blue #4F8FFF · aqua #00C8FF (accents)
    cream    #E8E0D4 (text) · muted #8A9BB0 · white #FFFFFF

Spec types:
  "bars"    : single-metric horizontal bars
              {label, value, highlight?} per item; "unit" optional
  "grouped" : multiple metrics per category
              "categories": [...], "series": [{"name","values","highlight"?}]
  "matrix"  : comparison table image
              "columns": [...], "rows": [[...]], "highlight_row": int (0-based)

Common keys: title, subtitle (optional), source (optional footer)
Output: 1376x768 PNG (16:9), matches Higgsfield hero/body dimensions.
"""
import sys, json
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

# ---- brand ----
BG       = "#0D1117"
PANEL    = "#161C26"
PANEL2   = "#1E2738"
EMERALD  = "#1A9E6E"
BLUE     = "#4F8FFF"
AQUA     = "#00C8FF"
CREAM    = "#E8E0D4"
MUTED    = "#8A9BB0"
WHITE    = "#FFFFFF"
GRID     = "#222C3A"

W, H, DPI = 1376, 768, 100

def _font():
    for cand in ("DejaVu Sans", "Arial", "Helvetica"):
        try:
            font_manager.findfont(cand, fallback_to_default=False)
            return cand
        except Exception:
            continue
    return "DejaVu Sans"
FONT = _font()
plt.rcParams.update({"font.family": FONT, "figure.dpi": DPI})

def _frame(fig):
    """Title/subtitle/footer chrome shared by all infographic types."""
    s = fig._spec
    # title
    fig.text(0.055, 0.90, s["title"], color=CREAM, fontsize=27, fontweight="bold", va="top")
    y = 0.845
    if s.get("subtitle"):
        fig.text(0.055, 0.845, s["subtitle"], color=MUTED, fontsize=14.5, va="top")
        y = 0.815
    # emerald accent rule
    fig.lines.append(plt.Line2D([0.055, 0.135], [y-0.01, y-0.01],
                     color=EMERALD, lw=3, transform=fig.transFigure))
    # footer wordmark
    fig.text(0.055, 0.055, "● GREENSTONE WELLNESS", color=EMERALD, fontsize=11,
             fontweight="bold", va="center", alpha=0.95)
    if s.get("source"):
        fig.text(0.945, 0.055, s["source"], color=MUTED, fontsize=9.5, va="center", ha="right")

def render_bars(s):
    fig = plt.figure(figsize=(W/DPI, H/DPI)); fig.patch.set_facecolor(BG); fig._spec = s
    ax = fig.add_axes([0.30, 0.16, 0.63, 0.56]); ax.set_facecolor(BG)
    items = s["bars"]; unit = s.get("unit", "")
    labels = [b["label"] for b in items]
    vals   = [b["value"] for b in items]
    colors = [AQUA if b.get("highlight") else EMERALD for b in items]
    ypos = range(len(items))[::-1]
    ax.barh(list(ypos), vals, color=colors, height=0.62, zorder=3)
    for yp, v, b in zip(ypos, vals, items):
        ax.text(v + max(vals)*0.015, yp, f"{v}{unit}", va="center", ha="left",
                color=WHITE if b.get("highlight") else CREAM, fontsize=14, fontweight="bold")
    ax.set_yticks(list(ypos)); ax.set_yticklabels(labels, color=CREAM, fontsize=13)
    ax.set_xlim(0, max(vals)*1.18)
    ax.tick_params(axis="x", colors=MUTED, labelsize=11)
    for sp in ax.spines.values(): sp.set_visible(False)
    ax.xaxis.grid(True, color=GRID, lw=1, zorder=0); ax.set_axisbelow(True)
    _frame(fig); return fig

def render_grouped(s):
    fig = plt.figure(figsize=(W/DPI, H/DPI)); fig.patch.set_facecolor(BG); fig._spec = s
    ax = fig.add_axes([0.07, 0.18, 0.88, 0.52]); ax.set_facecolor(BG)
    cats = s["categories"]; series = s["series"]; unit = s.get("unit", "")
    n = len(series); group_w = 0.8; bw = group_w / n
    palette = [EMERALD, BLUE, AQUA, "#7C5CFF", "#E8A33D"]
    import numpy as np
    x = np.arange(len(cats))
    for i, ser in enumerate(series):
        off = (i - (n-1)/2) * bw
        col = AQUA if ser.get("highlight") else palette[i % len(palette)]
        bars = ax.bar(x + off, ser["values"], width=bw*0.92, color=col, zorder=3, label=ser["name"])
        for rect, v in zip(bars, ser["values"]):
            ax.text(rect.get_x()+rect.get_width()/2, v + max(max(s2["values"]) for s2 in series)*0.02,
                    f"{v}{unit}", ha="center", va="bottom", color=CREAM, fontsize=10)
    ax.set_xticks(x); ax.set_xticklabels(cats, color=CREAM, fontsize=12.5)
    ax.tick_params(axis="y", colors=MUTED, labelsize=10)
    for sp in ax.spines.values(): sp.set_visible(False)
    ax.yaxis.grid(True, color=GRID, lw=1, zorder=0); ax.set_axisbelow(True)
    leg = ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.16), ncol=len(series),
                    frameon=False, fontsize=12, labelcolor=CREAM)
    _frame(fig); return fig

def render_matrix(s):
    fig = plt.figure(figsize=(W/DPI, H/DPI)); fig.patch.set_facecolor(BG); fig._spec = s
    ax = fig.add_axes([0.05, 0.14, 0.90, 0.58]); ax.axis("off")
    cols = s["columns"]; rows = s["rows"]; hl = s.get("highlight_row", len(rows)-1)
    ncol = len(cols); nrow = len(rows)
    cw = [1.0/ncol]*ncol
    x0 = 0.0; ytop = 1.0; rh = 1.0/(nrow+1)
    # header
    for c, label in enumerate(cols):
        xc = sum(cw[:c])
        ax.add_patch(plt.Rectangle((xc, ytop-rh), cw[c], rh, color="#1B2C49", ec=BG, lw=2))
        ax.text(xc+0.012, ytop-rh/2, label, color=BLUE, fontsize=12.5, fontweight="bold",
                va="center", ha="left")
    # rows
    for r, row in enumerate(rows):
        y = ytop - rh*(r+2)
        feat = (r == hl)
        bgc = "#11212E" if feat else (PANEL if r % 2 == 0 else "#121823")
        for c, cell in enumerate(row):
            xc = sum(cw[:c])
            ax.add_patch(plt.Rectangle((xc, y), cw[c], rh, color=bgc, ec=BG, lw=2))
            if feat and c == 0:
                ax.add_patch(plt.Rectangle((xc, y), 0.006, rh, color=AQUA, ec=AQUA))
            color = AQUA if (feat and c == 0) else (CREAM if c == 0 else "#C8D4E0")
            fw = "bold" if (c == 0) else "normal"
            ax.text(xc+0.012, y+rh/2, str(cell), color=color, fontsize=11.5,
                    fontweight=fw, va="center", ha="left")
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    _frame(fig); return fig

RENDERERS = {"bars": render_bars, "grouped": render_grouped, "matrix": render_matrix}

def main():
    if len(sys.argv) < 3:
        print("usage: render-infographic.py <spec.json|-> <out.png>", file=sys.stderr); sys.exit(2)
    spec_arg, out = sys.argv[1], sys.argv[2]
    raw = sys.stdin.read() if spec_arg == "-" else open(spec_arg).read()
    spec = json.loads(raw)
    fig = RENDERERS[spec["type"]](spec)
    fig.savefig(out, facecolor=BG, dpi=DPI)
    print(f"wrote {out}")

if __name__ == "__main__":
    main()
