# -*- coding: utf-8 -*-
import re, json
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
d = open(BASE+r"\_docx.txt", encoding="utf-8").read()
lines = [l.strip() for l in d.split("\n")]
out=[]
for a,b,label in [(1078,1105,"107"),(1245,1277,"113"),(1211,1245,"112"),(1105,1129,"108")]:
    out.append("########## %s (%d-%d)" % (label,a,b))
    for i in range(a,b):
        out.append("%5d| %s" % (i, lines[i][:400]))
open(BASE+r"\_dumpM.txt","w",encoding="utf-8").write("\n".join(out))
print("ok")