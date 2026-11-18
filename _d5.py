# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"

def read_any(fn):
    for enc in ['utf-8','utf-8-sig','utf-16','latin-1','cp1252']:
        try:
            return open(os.path.join(BASE,fn),'r',encoding=enc).read()
        except Exception: continue
    return ""

out = []
b = read_any("check_400level.txt")
out.append("backup len=%d" % len(b))
arts = re.findall(r'<article class="course-description-item".*?</article>', b, re.S)
out.append("articles in backup: %d" % len(arts))
codes = []
for a in arts:
    c = re.search(r'<span class="course-code">([^<]+)</span>', a)
    codes.append(c.group(1).strip() if c else "?")
out.append(str(codes))

want = ["ESUT-PSY106","ESUT-PSY107","ESUT-PSY108","ESUT-PSY109","ESUT-PSY 110","ESUT-PSY 111",
        "ESUT-PSY 112","ESUT-PSY 113","ESUT-PSY 114"]
for a in arts:
    c = re.search(r'<span class="course-code">([^<]+)</span>', a)
    if c and c.group(1).strip() in want:
        out.append("===== %s =====\n%s" % (c.group(1).strip(), a))
open(os.path.join(BASE,"_dump5.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")