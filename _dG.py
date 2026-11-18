# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
def rd(fn): return open(os.path.join(BASE,fn),'rb').read().decode('utf-8', errors='replace')
out=[]
for fn in ["staff.html","about.html","responsive.css"]:
    out.append("@@@@@@@@ %s @@@@@@@@" % fn)
    out.append(rd(fn))
open(os.path.join(BASE,"_dumpH.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")