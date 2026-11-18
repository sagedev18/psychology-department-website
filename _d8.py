# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
def read_any(fn):
    for enc in ['utf-8','utf-8-sig','utf-16','latin-1','cp1252']:
        try: return open(os.path.join(BASE,fn),'r',encoding=enc).read()
        except Exception: continue
    return ""
out = []
idx = read_any("index.html")
out.append("===== index.html: search + achievements regions =====")
for m in re.finditer(r'<section class="search-section".*?</section>|<div class="achievements-grid">.*?</div>\s*</div>', idx, re.S):
    out.append(m.group(0))
out.append("===== index.html lines containing search/achievement =====")
for i,l in enumerate(idx.split("\n"),1):
    if re.search(r'search|achievement|stat', l, re.I):
        out.append("%4d| %s" % (i,l))

out.append("\n===== style.css selectors of interest =====")
css = read_any("style.css")
for m in re.finditer(r'([^\n{}]*\b(search-section|search-box|search-input|search-results|search-result-item|achievement|home-search|stat)\b[^\n{}]*)\{[^}]*\}', css):
    out.append(m.group(1).strip()+" { ... }")

out.append("\n===== style.css all selectors =====")
for m in re.finditer(r'^\s*([.#][A-Za-z0-9_\-\. >,:]*)\s*\{', css, re.M):
    out.append(m.group(1).strip())

open(os.path.join(BASE,"_dump8.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")