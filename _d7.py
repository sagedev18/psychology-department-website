# -*- coding: utf-8 -*-
import os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
t = open(os.path.join(BASE,"app.js"), encoding="utf-8", errors="replace").read().split("\n")
out = []
for i,l in enumerate(t[60:190], start=61):
    out.append("%4d| %s" % (i, l))
open(os.path.join(BASE,"_dump7.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")