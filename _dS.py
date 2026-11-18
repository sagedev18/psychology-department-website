# -*- coding: utf-8 -*-
import re, os, json
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
cd = open(os.path.join(BASE,"course-descriptions.html"),'rb').read().decode('utf-8', errors='replace')
aca = open(os.path.join(BASE,"academics.html"),'rb').read().decode('utf-8', errors='replace')

out=[]
# articles in cd
arts = {}
order=[]
for m in re.finditer(r'<article class="course-description-item" id="([^"]+)">(.*?)</article>', cd, re.S):
    aid=m.group(1); body=m.group(2)
    code = re.search(r'<span class="course-code">([^<]*)</span>', body)
    title= re.search(r'<span class="course-title">([^<]*)</span>', body)
    meta = re.search(r'<span class="course-meta">([^<]*)</span>', body)
    placeholder = 'No course description for this course' in body
    arts[aid]={'code':code.group(1) if code else None,'title':title.group(1) if title else None,
               'meta':meta.group(1) if meta else None,'placeholder':placeholder}
    order.append(aid)
out.append("cd articles: %d" % len(order))
out.append("\nPLACEHOLDERS in cd:")
for a,v in arts.items():
    if v['placeholder']: out.append("  %-24s %-16s %s" % (a, v['code'], v['title']))

# academics rows
lvl=None; sem=None; arows=[]
for l in aca.split("\n"):
    m=re.search(r'curriculum-level" id="level-(\d+)"',l)
    if m: lvl=m.group(1)
    m=re.search(r'<h3>(\w+ Semester)</h3>',l)
    if m: sem=m.group(1)
    m=re.match(r'\s*<tr><td>([^<]+)</td><td>([^<]+)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td></tr>',l)
    if m: arows.append((lvl,sem,m.group(1),m.group(2),m.group(3),m.group(4),m.group(5),m.group(6)))
out.append("\nacademics rows: %d" % len(arows))
acodes={}
for r in arows: acodes.setdefault(r[3],[]).append(r[1:])
out.append("\nDUPLICATE codes in academics:")
for c,v in acodes.items():
    if len(v)>1: out.append("  %s -> %s" % (c,v))
out.append("\nacademics codes NOT in cd (by normalised code):")
def norm(s): return re.sub(r'[^A-Z0-9]','',s.upper())
cdcodes = {}
for a,v in arts.items():
    if v['code']: cdcodes[norm(v['code'])]=a
for c,v in acodes.items():
    n=norm(c)
    if n not in cdcodes:
        out.append("  %-22s %s" % (c, v))
out.append("\ncd codes NOT in academics:")
acn={norm(c) for c in acodes}
for a,v in arts.items():
    if v['code'] and norm(v['code']) not in acn:
        out.append("  %-24s %-16s %s" % (a, v['code'], v['title']))
open(BASE+r"\_dumpP.txt","w",encoding="utf-8").write("\n".join(out))
print("done")