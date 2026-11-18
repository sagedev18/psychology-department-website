# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
def read_any(fn):
    for enc in ['utf-8','utf-8-sig','utf-16','latin-1','cp1252']:
        try: return open(os.path.join(BASE,fn),'r',encoding=enc).read()
        except Exception: continue
    return ""
b = read_any("check_400level.txt")
arts = re.findall(r'<article class="course-description-item".*?</article>', b, re.S)
out=[]
for a in arts:
    c = re.search(r'<span class="course-code">([^<]+)</span>', a)
    if c and c.group(1).strip() in ["ESUT-PSY 106","ESUT-PSY 107","ESUT-PSY 108","ESUT-PSY 109"]:
        out.append("@@@ARTICLE@@@"+a+"@@@END@@@")
aca = read_any("academics.html").split("\n")
# semester headings with line numbers
out.append("@@@SEMESTERS@@@")
for i,l in enumerate(aca,1):
    if re.search(r'<h3>|curriculum-level|level-header|semester-block', l):
        out.append("%4d| %s" % (i, l.strip()))
open(os.path.join(BASE,"_src106.txt"),"w",encoding="utf-8").write("\n".join(out))
print(len("\n".join(out)))