# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
titles = ["Sexual Deviance","Adolescence and Reproductive","Peace and Conflict","Mental Health and Well",
          "Social Judgment","African Belief System","Psychology of Harmony","Suicide Markers","Information and Communication Psychology"]
found = {}
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ('.git',)]
    for f in files:
        p = os.path.join(root,f)
        try:
            if os.path.getsize(p) > 8_000_000: continue
            t = open(p,'rb').read()
        except Exception: continue
        for enc in ('utf-8','utf-16','latin-1'):
            try:
                s = t.decode(enc); break
            except Exception: s = None
        if s is None: continue
        for ti in titles:
            if ti.lower() in s.lower():
                found.setdefault(os.path.relpath(p,BASE), set()).add(ti)
for k,v in sorted(found.items()):
    print(k, "->", sorted(v))
print("---- total files:", len(found))