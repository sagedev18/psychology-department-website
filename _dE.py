# -*- coding: utf-8 -*-
import os, re
ROOT = r"c:\Users\muna\OneDrive\Dokumenty"
titles = ["Sexual Deviance","Adolescence and Reproductive","Peace and Conflict","Mental Health and Well",
          "Social Judgment","African Belief System","Psychology of Harmony","Suicide Markers","Information and Communication Psychology"]
out=[]
for root, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ('.git','node_modules','AppData','.kombai')]
    for f in files:
        p = os.path.join(root,f)
        try:
            if os.path.getsize(p) > 20_000_000: continue
            raw = open(p,'rb').read()
        except Exception: continue
        s=None
        for enc in ('utf-8','utf-16','latin-1'):
            try: s = raw.decode(enc); break
            except Exception: pass
        if s is None: continue
        hits = [t for t in titles if t.lower() in s.lower()]
        if hits:
            out.append("%s -> %s" % (os.path.relpath(p,ROOT), hits))
        elif f.lower().endswith(('.docx','.doc','.pdf')):
            out.append("BINARY %s (%d)" % (os.path.relpath(p,ROOT), len(raw)))
open(r"c:\Users\muna\OneDrive\Dokumenty\esut website\_dE.txt","w",encoding="utf-8").write("\n".join(out))
print(len(out))