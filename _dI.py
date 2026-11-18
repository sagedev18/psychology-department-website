# -*- coding: utf-8 -*-
import os, re
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
K = os.path.join(BASE, ".kombai", "tmp")
out=[]
targets = ["Sexual Deviance","Adolescence and Reproductive","Peace and Conflict Management",
           "Mental Health and Well","Social Judgment"]
hits={}
for root, dirs, files in os.walk(K):
    for f in files:
        p=os.path.join(root,f)
        try:
            if os.path.getsize(p) > 30_000_000: continue
            raw=open(p,'rb').read()
        except Exception: continue
        s=None
        for enc in ('utf-8','utf-16','latin-1'):
            try: s=raw.decode(enc); break
            except Exception: pass
        if s is None: continue
        h=[t for t in targets if t.lower() in s.lower()]
        if h:
            hits[p]=h
            out.append("%s -> %s (%d)" % (os.path.relpath(p,BASE), h, len(raw)))
open(os.path.join(BASE,"_dumpI.txt"),"w",encoding="utf-8").write("\n".join(out))
print(len(hits))