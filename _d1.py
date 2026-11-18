# -*- coding: utf-8 -*-
import re, io, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
out = []

def add(f, s):
    out.append("===== %s =====\n%s" % (f, s))

# academics.html : lines mentioning ESUT-PSY / GSD in course rows
aca = open(os.path.join(BASE,"academics.html"), encoding="utf-8", errors="replace").read()
lines = aca.split("\n")
add("academics.html ESUT-PSY/GSD lines", "\n".join(
    "%d: %s" % (i+1, l.strip()) for i,l in enumerate(lines)
    if re.search(r"ESUT-PSY|GSD\s*\d|AIPSY", l)))

# course-descriptions.html : description-header blocks for the 8 missing + GSD + 113
cd = open(os.path.join(BASE,"course-descriptions.html"), encoding="utf-8", errors="replace").read()
clines = cd.split("\n")
targets = ["ESUT-PSY106","ESUT-PSY107","ESUT-PSY108","ESUT-PSY109","ESUT-PSY110",
           "ESUT-PSY111","ESUT-PSY112","ESUT-PSY114","GSD 121","GSD 221","GSD 321","GSD 421"]
idxs = [i for i,l in enumerate(clines) if any(t in l for t in targets)]
add("course-descriptions.html header contexts", "\n\n".join(
    "\n".join("%d: %s" % (j+1, clines[j]) for j in range(max(0,i-6), min(len(clines), i+8)))
    for i in idxs))

# how do the ESUT-PSY placeholder articles look in full
m = re.search(r'<article class="course-description-item" id="course-ESUT-PSY106">.*?</article>', cd, re.S)
add("ESUT-PSY106 full article", m.group(0) if m else "NOT FOUND")
m = re.search(r'<article class="course-description-item" id="course-GSD-121">.*?</article>', cd, re.S)
add("GSD-121 full article", (m.group(0)[:4000] if m else "NOT FOUND"))

open(os.path.join(BASE,"_dump.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok", len("\n".join(out)))