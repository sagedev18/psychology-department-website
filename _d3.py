# -*- coding: utf-8 -*-
import re, os
BASE = r"c:\Users\muna\OneDrive\Dokumenty\esut website"
out = []

cd = open(os.path.join(BASE,"course-descriptions.html"), encoding="utf-8", errors="replace").read()
# list ALL articles: id, code, title, meta, placeholder?
for m in re.finditer(r'<article class="course-description-item" id="([^"]+)">(.*?)</article>', cd, re.S):
    aid, body = m.group(1), m.group(2)
    code = re.search(r'<span class="course-code">(.*?)</span>', body, re.S)
    title = re.search(r'<span class="course-title">(.*?)</span>', body, re.S)
    meta = re.search(r'<span class="course-meta">(.*?)</span>', body, re.S)
    seq = re.search(r'<span class="course-sequence">(.*?)</span>', body, re.S)
    ph = "PLACEHOLDER" if "No course description" in body else "ok"
    out.append("%-28s seq=%-4s %-16s %-55s %-42s %s" % (
        aid, seq.group(1) if seq else "?",
        code.group(1).strip() if code else "?",
        (title.group(1).strip()[:53] if title else "?"),
        (meta.group(1).strip()[:40] if meta else "?"), ph))

out.append("\n\n===== search for source text of missing descriptions in repo =====")
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ('.kombai','node_modules','.git')]
    for f in files:
        if f.lower().endswith(('.txt','.md','.py','.docx','.json')):
            p = os.path.join(root,f)
            try:
                t = open(p, encoding="utf-8", errors="replace").read()
            except Exception:
                continue
            hits = [k for k in ["Psychology of African Belief System","Psychology of Harmony","Psychology of Sexual Deviance","Psychology of Adolescence and Reproductive","Psychology of Peace and Conflict","Psychology of Mental Health and Well","Social Judgment and Decision","Suicide Markers","Information and Communication Psychology"] if k.lower() in t.lower()]
            if hits:
                out.append("%s -> %s" % (os.path.relpath(p,BASE), hits))

open(os.path.join(BASE,"_dump3.txt"),"w",encoding="utf-8").write("\n".join(out))
print("ok")