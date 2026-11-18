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
for a in arts:
    c = re.search(r'<span class="course-code">([^<]+)</span>', a)
    if not c: continue
    code = c.group(1).strip()
    if code in ["ESUT-PSY 106","ESUT-PSY 107","ESUT-PSY 108","ESUT-PSY 109"]:
        fn = "_bk_" + code.replace(" ","_") + ".html"
        open(os.path.join(BASE,fn),'w',encoding='utf-8').write(a)
        print(fn, len(a))
