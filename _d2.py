# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
cd = open(os.path.join(BASE,"course-descriptions.html"), encoding="utf-8", errors="replace").read()
out = []

def art(aid):
    m = re.search(r'<article class="course-description-item" id="%s">.*?</article>' % re.escape(aid), cd, re.S)
    return m.group(0) if m else "NOT FOUND %s" % aid

# a filled ESUT-PSY article (pattern to copy)
for a in ["course-ESUT-PSY-211", "course-ESUT-PSY-312", "course-ESUT-PSY-113"]:
    out.append("===== %s =====\n%s" % (a, art(a)))

# level section wrappers
for lev in ["100", "200", "300", "400"]:
    m = re.search(r'(<section class="level-section"[^>]*>\s*<h2[^>]*>.*?</h2>)', cd, re.S)
out.append("===== level section heads =====")
for m in re.finditer(r'<(section|div) class="level-section[^"]*".*?>(.{0,400})', cd, re.S):
    out.append(repr(m.group(0)[:400]))

# the top of the file (search bar area) up to first article
i = cd.find('<article')
out.append("===== TOP =====\n" + cd[:i])
# end of file after last article
j = cd.rfind('</article>')
out.append("===== BOTTOM =====\n" + cd[j:])

open(os.path.join(BASE,"_dump2.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")