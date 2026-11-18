# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
aca = open(os.path.join(BASE,"academics.html"),'rb').read().decode('utf-8', errors='replace')
out=[]
lines=aca.split("\n")
out.append("=== academics.html 330-400 ===")
for i in range(329, min(400,len(lines))):
    out.append("%4d| %s" % (i+1, lines[i]))
out.append("\n=== admin.css full ===")
out.append(open(os.path.join(BASE,"admin website","admin.css"),'rb').read().decode('utf-8', errors='replace'))
open(BASE+r"\_dumpN.txt","w",encoding="utf-8").write("\n".join(out))
print("ok")