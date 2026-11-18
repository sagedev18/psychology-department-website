# -*- coding: utf-8 -*-
import os, re, zipfile
ROOTS = [r"c:\Users\muna\OneDrive", r"c:\Users\muna\Documents", r"c:\Users\muna\Downloads", r"c:\Users\muna\Desktop"]
targets = ["sexual deviance","adolescence and reproductive","peace and conflict management",
           "mental health and well","social judgment"]
out=[]
seen=set()
for ROOT in ROOTS:
    for root, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d.lower() not in ('.git','node_modules','appdata','.kombai','.cache','site-packages')]
        for f in files:
            p=os.path.join(root,f)
            low=f.lower()
            try: sz=os.path.getsize(p)
            except Exception: continue
            if sz > 30_000_000: continue
            if low.endswith(('.docx','.xlsx','.pptx')):
                try:
                    z=zipfile.ZipFile(p)
                    txt=""
                    for n in z.namelist():
                        if n.endswith('.xml') and ('document' in n or 'sharedStrings' in n or 'slide' in n):
                            txt += z.read(n).decode('utf-8','replace')
                except Exception: continue
                h=[t for t in targets if t in txt.lower()]
                if h:
                    out.append("DOCX %s -> %s" % (p,h))
                continue
            if low.endswith(('.doc','.rtf')):
                raw=open(p,'rb').read()
                h=[t for t in targets if t in raw.decode('latin-1','replace').lower()]
                if h: out.append("DOC %s -> %s" % (p,h))
                continue
            if low.endswith(('.txt','.md','.html','.htm','.rtf','.csv')):
                raw=open(p,'rb').read()
                s=None
                for enc in ('utf-8','utf-16','latin-1'):
                    try: s=raw.decode(enc); break
                    except Exception: pass
                if s is None: continue
                h=[t for t in targets if t in s.lower()]
                if h and 'esut website' not in p:
                    out.append("%s -> %s" % (p,h))
open(r"c:\Users\muna\OneDrive\Dokumenty\esut website\_dumpK.txt","w",encoding="utf-8").write("\n".join(out))
print("found", len(out))