# -*- coding: utf-8 -*-
"""Diagnose: article inventory + placeholder map + JSON schema + encoding."""
import json, re, io, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"

raw = open(os.path.join(BASE, "course-descriptions.html"), "rb").read()
txt = raw.decode("utf-8")   # will raise if invalid
out = io.open(os.path.join(BASE, "_outAH.txt"), "w", encoding="utf-8")
out.write("UTF8 decode OK, bytes=%d chars=%d\n" % (len(raw), len(txt)))
out.write("BOM: %r\n" % raw[:3])
out.write("U+FFFD count: %d\n" % txt.count("\ufffd"))
for i, line in enumerate(txt.splitlines(), 1):
    if "\ufffd" in line:
        out.write("FFFD line %d: %s\n" % (i, line.strip()[:200]))

# article inventory
arts = []
for m in re.finditer(r'<article class="course-description-item" id="([^"]+)">(.*?)</article>', txt, re.S):
    aid, body = m.group(1), m.group(2)
    code = re.search(r'<span class="course-code">(.*?)</span>', body, re.S)
    title = re.search(r'<span class="course-title">(.*?)</span>', body, re.S)
    meta = re.search(r'<span class="course-meta">(.*?)</span>', body, re.S)
    seq = re.search(r'<span class="course-sequence">(.*?)</span>', body, re.S)
    arts.append(dict(id=aid, seq=seq.group(1).strip() if seq else "",
                     code=code.group(1).strip() if code else "",
                     title=title.group(1).strip() if title else "",
                     meta=meta.group(1).strip() if meta else "",
                     ph="No course description" in body))
out.write("\n=== ARTICLES (%d) ===\n" % len(arts))
for a in arts:
    out.write("%-24s seq=%-3s %-16s PH=%-5s %s | %s\n" % (a["id"], a["seq"], a["code"], a["ph"], a["title"][:50], a["meta"][:70]))
phs = [a for a in arts if a["ph"]]
out.write("\nPLACEHOLDERS (%d): %s\n" % (len(phs), [a["id"] for a in phs]))

# JSON
data = json.load(open(os.path.join(BASE, "_new100.json"), encoding="utf-8"))
out.write("\n=== JSON ===\ntype=%s keys=%s\n" % (type(data).__name__, list(data.keys())))
for k, v in data.items():
    out.write("\n-- %s : keys=%s\n" % (k, list(v.keys())))
    out.write("   title=%r\n   meta=%r\n" % (v.get("title"), v.get("meta")))
    for s in v.get("sections", []):
        out.write("   SECTION %r items=%d\n" % (s[0], len(s[1])))
        for it in s[1]:
            out.write("       %r\n" % it[:160])
out.close()
print("ok")
