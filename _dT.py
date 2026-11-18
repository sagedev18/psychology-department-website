# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
d = open(BASE+r"\_docx.txt", encoding="utf-8").read()
lines = [l.strip() for l in d.split("\n")]
out=[]
# find all full-description blocks: header + "Senate-approved relevance" right after
for i,l in enumerate(lines):
    m = re.match(r'^([A-Z]{2,8}[- ]?[A-Z]{0,8}\s*\d{3})\s+(.+?)\s*\(([^)]*)\)\s*$', l)
    if m and i+2 < len(lines) and lines[i+2].lower().startswith('senate-approved relevance'):
        out.append("%5d| %-22s | %-70s | %s" % (i, m.group(1), m.group(2)[:70], m.group(3)))
out.append("\n\n===== all 'Senate-approved relevance' lines =====")
for i,l in enumerate(lines):
    if l.lower().startswith('senate-approved relevance'):
        out.append("%5d| prev: %s" % (i, lines[i-2][:120] if i>=2 else ''))
out.append("\n===== level markers =====")
for i,l in enumerate(lines):
    if re.match(r'^\d{3}\s*Level\s*$', l): out.append("%5d| %s" % (i,l))
open(BASE+r"\_dumpQ.txt","w",encoding="utf-8").write("\n".join(out))
print("done")