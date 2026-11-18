# -*- coding: utf-8 -*-
import re, os, json
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
raw = open(os.path.join(BASE,"course-descriptions.html"),'rb').read()
print("BOM?", raw[:3])
cd = raw.decode('utf-8', errors='replace')
out=[]
for aid in ["course-ESUT-PSY107","course-ESUT-PSY106","course-AIPSY-101","course-ESUT-PSY-111","course-ESUT-PSY-110"]:
    m = re.search(r'<article class="course-description-item" id="%s">(.*?)</article>' % re.escape(aid), cd, re.S)
    if m:
        out.append("@@%s@@\n%s" % (aid, repr(m.group(1)[:900])))
# count U+FFFD
out.append("FFFD count: %d" % cd.count('\ufffd'))
for i,l in enumerate(cd.split('\n'),1):
    if '\ufffd' in l:
        out.append("FFFD line %d: %s" % (i, repr(l[:200])))
open(os.path.join(BASE,"_dumpF.txt"),"w",encoding="utf-8").write("\n".join(out))

# academics all rows with level/sem context
aca = open(os.path.join(BASE,"academics.html"),'rb').read().decode('utf-8', errors='replace')
lvl=None; sem=None
lines=[]
for i,l in enumerate(aca.split('\n'),1):
    m=re.search(r'curriculum-level" id="level-(\d+)"',l)
    if m: lvl=m.group(1)
    m=re.search(r'<h3>(\w+ Semester)</h3>',l)
    if m: sem=m.group(1)
    m=re.match(r'\s*<tr><td>([^<]+)</td><td>([^<]+)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td></tr>',l)
    if m:
        lines.append("%d|%s|%s|%s|%s|%s|%s|%s|%s" % (i,lvl,sem,m.group(1),m.group(2),m.group(3),m.group(4),m.group(5),m.group(6)))
    m2=re.search(r'Total (\d+)',l)
    if m2: lines.append("%d|%s|%s|TOTAL|%s" % (i,lvl,sem,m2.group(1)))
open(os.path.join(BASE,"_dumpG.txt"),"w",encoding="utf-8").write("\n".join(lines))
print("ok")