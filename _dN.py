# -*- coding: utf-8 -*-
import re
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
d = open(BASE+r"\_docx.txt", encoding="utf-8").read()
lines = d.split("\n")
out=[]
for a,b in [(1040,1300)]:
    for i in range(a, min(b, len(lines))):
        out.append("%5d| %s" % (i, lines[i].strip()))
open(BASE+r"\_docx_100.txt","w",encoding="utf-8").write("\n".join(out))
print(len(out))