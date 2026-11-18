# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
d = open(BASE+r"\_docx.txt", encoding="utf-8").read()
lines = [l.strip() for l in d.split("\n")]
out=[]
sar=[i for i,l in enumerate(lines) if l.lower().startswith('senate-approved relevance')]
for i in sar:
    # walk back to find the header line
    h=None
    for j in range(i, max(0,i-6), -1):
        if lines[j] and re.match(r'^[A-Z]', lines[j]) and not lines[j].lower().startswith('senate'):
            h=(j, lines[j]); break
    out.append("### SAR at %d -> header %s" % (i, h))
open(BASE+r"\_dumpR.txt","w",encoding="utf-8").write("\n".join(out))
print("done")