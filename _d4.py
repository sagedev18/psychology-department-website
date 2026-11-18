# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
out = []
for f in ["check_400level.txt","test.txt","ai101_content.txt","README.md","ADMIN_GUIDE.md"]:
    p = os.path.join(BASE,f)
    if not os.path.exists(p): continue
    t = open(p, encoding="utf-8", errors="replace").read()
    out.append("===== %s (%d chars) =====" % (f, len(t)))
    out.append(t[:1500])
    out.append("...")
out.append("===== generate_descriptions.py head =====")
t = open(os.path.join(BASE,"generate_descriptions.py"), encoding="utf-8", errors="replace").read()
out.append(t[:3000])
out.append("===== rebuild_descriptions.py head =====")
t = open(os.path.join(BASE,"rebuild_descriptions.py"), encoding="utf-8", errors="replace").read()
out.append(t[:3000])
open(os.path.join(BASE,"_dump4.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")