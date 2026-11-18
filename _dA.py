# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
def read_any(fn):
    for enc in ['utf-8','utf-8-sig','utf-16','latin-1','cp1252']:
        try: return open(os.path.join(BASE,fn),'r',encoding=enc).read()
        except Exception: continue
    return ""
out=[]
aca = read_any("academics.html").split("\n")
out.append("===== academics.html 100-level semester 2 rows (115-135) =====")
for i,l in enumerate(aca[114:135], start=115):
    out.append("%4d| %s" % (i,l))
out.append("===== GSD rows all =====")
for i,l in enumerate(aca,1):
    if "GSD" in l: out.append("%4d| %s" % (i,l))
out.append("===== 'Total' rows =====")
for i,l in enumerate(aca,1):
    if "Total" in l: out.append("%4d| %s" % (i,l))

cd = read_any("course-descriptions.html")
out.append("\n===== course-descriptions.html GSD headers =====")
for m in re.finditer(r'<article class="course-description-item" id="(course-GSD-\d+)">(.*?)<div class="description-body">', cd, re.S):
    body=m.group(2)
    meta=re.search(r'<span class="course-meta">(.*?)</span>',body,re.S)
    out.append("%s META=%s" % (m.group(1), meta.group(1).strip() if meta else "?"))
for m in re.finditer(r'<article class="course-description-item" id="(course-GSD-\d+)">.*?<tr><td>Units and Contact</td><td>(.*?)</td>', cd, re.S):
    out.append("%s UNITSROW=%s" % (m.group(1), m.group(2).strip()))
open(os.path.join(BASE,"_dumpA.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")