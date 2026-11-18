# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
css = open(os.path.join(BASE,"style.css"),'rb').read().decode('utf-8', errors='replace')
out=[]
for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
    sel = ' '.join(m.group(1).split())
    body = ' '.join(m.group(2).split())
    if 'border-radius' in body:
        out.append("%s { %s }" % (sel, body))
open(BASE+r"\_css3.txt","w",encoding="utf-8").write("\n".join(out))
print(len(out))