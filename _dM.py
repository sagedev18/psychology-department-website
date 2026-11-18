# -*- coding: utf-8 -*-
import re
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
d = open(BASE+r"\_docx.txt", encoding="utf-8").read()
lines = [l.strip() for l in d.split("\n")]
out=[]
for i,l in enumerate(lines):
    if re.search(r'ESUT-PSY\s*1(06|07|08|09|10|11|12|13|14)\b', l) or re.search(r'^(ESUT-PSY)\s*\d{3}\s*$', l):
        out.append("%5d| %s" % (i, l[:200]))
open(BASE+r"\_dumpL.txt","w",encoding="utf-8").write("\n".join(out))
print(len(out))