# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
css = open(os.path.join(BASE,"style.css"),'rb').read().decode('utf-8', errors='replace')
out=[]
# print all rules with their full body, but only those matching interest
interest = re.compile(r'search|achievement|gallery|content-card|quick-link|announcement-card|programme-card|hero|modal|form-input|btn-full|footer|nav-link|table|description-header|course-|level-|admin-card|feature-icon|page-title|breadcrumb', re.I)
for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
    sel = m.group(1).strip()
    if sel.startswith('/*') or len(sel)>400: continue
    if interest.search(sel):
        out.append("%s {\n%s\n}" % (sel, m.group(2).strip()))
open(os.path.join(BASE,"_css1.txt"),"w",encoding="utf-8").write("\n".join(out))
print(len(out))