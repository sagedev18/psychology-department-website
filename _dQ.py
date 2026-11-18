# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
out=[]
for fn in ["style.css","responsive.css","admin website/admin.css"]:
    css = open(os.path.join(BASE,fn),'rb').read().decode('utf-8', errors='replace')
    out.append("@@@@@@ %s @@@@@@" % fn)
    # normalize whitespace inside rules
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        sel = ' '.join(m.group(1).split())
        body = ' '.join(m.group(2).split())
        if 'border-radius' in body or re.search(r'search|achievement|stat', sel, re.I):
            out.append("%s { %s }" % (sel, body))
open(BASE+r"\_css2.txt","w",encoding="utf-8").write("\n".join(out))
print(len(out))