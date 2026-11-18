# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
cd = open(os.path.join(BASE,"course-descriptions.html"),'rb').read().decode('utf-8', errors='replace')
out=[]
out.append("=== articles in order: id | seq | code ===")
for m in re.finditer(r'<article class="course-description-item" id="([^"]+)">\s*<div class="description-header">\s*<span class="course-sequence">([^<]+)</span>\s*<span class="course-code">([^<]+)</span>', cd):
    out.append("%-30s %-4s %s" % (m.group(1), m.group(2), m.group(3)))
out.append("\n=== GSD full articles ===")
for m in re.finditer(r'<article class="course-description-item" id="course-GSD-\d+">.*?</article>', cd, re.S):
    out.append(m.group(0))
out.append("\n=== '1 Unit' / '1 unit' occurrences in cd ===")
for i,l in enumerate(cd.split("\n"),1):
    if re.search(r'\b1\s*[Uu]nit', l): out.append("%4d| %s" % (i, l.strip()[:300]))
out.append("\n=== exact placeholder article markup (ESUT-PSY107) ===")
m = re.search(r'<article class="course-description-item" id="course-ESUT-PSY107">.*?</article>', cd, re.S)
out.append(repr(m.group(0)))
open(os.path.join(BASE,"_dumpJ.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")