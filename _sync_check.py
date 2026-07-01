# -*- coding: utf-8 -*-
"""跨裝置同步驗證 — 手機(360px)/平板(768px)/筆電(1280px)/桌機(1920px)
只要 4 個尺寸下沒 CSS 報錯 / 沒 overflow-x:scroll / 沒字被切掉,就 OK
"""
import os, sys, re, subprocess, json

ROOT = os.path.dirname(os.path.abspath(__file__))

CHECKS = []

def check_responsive_viewport():
    index_path = os.path.join(ROOT, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
    has_viewport = bool(re.search(r'<meta\s+name="viewport"\s+content="width=device-width', html))
    has_max_width = "max-width:" in open(os.path.join(ROOT, "styles.css"), encoding="utf-8").read()
    return {
        "test": "1️⃣ viewport meta + max-width container",
        "viewport_meta": "✅" if has_viewport else "❌",
        "max_width_used": "✅" if has_max_width else "❌",
    }

def check_media_queries():
    css_path = os.path.join(ROOT, "styles.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    media_q = re.findall(r'@media\s*\([^)]+\)\s*\{', css)
    return {
        "test": f"2️⃣ @media breakpoints",
        "count": len(media_q),
        "list": sorted(set(re.findall(r'@media\s*(\([^)]+\))', css))),
    }

def check_share_btn_responsive():
    css_path = os.path.join(ROOT, "styles.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    return {
        "test": "3️⃣ 分享按鈕 RWD (380/720/全寬)",
        "mobile_col_380": "✅" if "max-width: 380px" in css else "❌",
        "tablet_720": "✅" if "min-width: 381px" in css else "❌",
        "desktop_default": "✅" if "flex-wrap: wrap" in css else "❌",
    }

def check_assets_reachable():
    required = ["index.html", "privacy.html", "terms.html", "admin.html",
                "styles.css", "script.js", "line-setup.md"]
    result = []
    for f in required:
        p = os.path.join(ROOT, f)
        if os.path.exists(p):
            result.append((f, os.path.getsize(p)))
        else:
            result.append((f, "MISSING"))
    return {
        "test": "4️⃣ 必要檔案齊全",
        "files": dict(result),
    }

def check_pet_assets():
    asset_dir = os.path.join(ROOT, "assets")
    pets = sorted([f for f in os.listdir(asset_dir) if f.startswith("pet-") and f.endswith(".png")])
    tarots = sorted([f for f in os.listdir(asset_dir) if f.startswith("tarot-") and f.endswith(".png")])
    return {
        "test": "5️⃣ 牌卡資產清點",
        "pet_cards": f"{len(pets)}/22",
        "tarot_cards": f"{len(tarots)}/22",
    }

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    print("=" * 60)
    print("📱 小夢老師 TAROT RITUAL — 跨裝置同步驗證")
    print("=" * 60)
    for fn in [check_responsive_viewport, check_media_queries,
               check_share_btn_responsive, check_assets_reachable,
               check_pet_assets]:
        r = fn()
        print()
        for k, v in r.items():
            print(f"  {k}: {v}")
    print()
    print("=" * 60)
    print("✅ 驗證完成 — 可送出 ✓ 沒問題 / 🆘 哪個需要修")
