# -*- coding: utf-8 -*-
import io, os, re, json
from collections import Counter

B = r'c:\Users\muna\OneDrive\Dokumenty\esut website'
out = []
def p(s): out.append(s)

p('### DOCX-related source files present')
for n in sorted(os.listdir(B)):
    if n.startswith('_docx') or n.startswith('_new100'):
        p('  %s  %d bytes' % (n, os.path.getsize(os.path.join(B, n))))

t = io.open(os.path.join(B, 'course-descriptions.html'), encoding='utf-8').read()
arts = re.findall(r'<article class="course-description-item" id="([^"]+)">(.*?)</article>', t, re.S)
p('')
p('### HTML articles: %d' % len(arts))
html_ids = []
for aid, body in arts:
    code = re.search(r'<span class="course-code">([^<]*)</span>', body)
    ttl  = re.search(r'<span class="course-title">([^<]*)</span>', body)
    meta = re.search(r'<span class="course-meta">([^<]*)</span>', body)
    seq  = re.search(r'<span class="course-sequence">([^<]*)</span>', body)
    placeholder = 'No course description for this course.' in body
    html_ids.append(aid)
    p('  id=%-26s seq=%-3s code=%-20s title=%-58s placeholder=%s' % (
        aid, seq.group(1) if seq else '?', code.group(1) if code else '?',
        (ttl.group(1)[:56] if ttl else '?'), placeholder))
    p('        meta=%s' % (ascii(meta.group(1)) if meta else '?'))

p('')
p('### academics.html course rows')
ac = io.open(os.path.join(B, 'academics.html'), encoding='utf-8').read()
rows = re.findall(r'<tr><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td></tr>', ac)
acad = [r for r in rows if r[0].strip() and not r[0].strip().startswith('Total')]
for r in acad:
    p('  %-18s %-60s units=%s type=%s lh=%s ph=%s' % (r[0].strip(), r[1].strip()[:58], r[2], r[3], r[4], r[5]))
p('  TOTAL %d' % len(acad))

def norm(code):
    c = code.strip().upper()
    c = re.sub(r'\s*-\s*', '-', c)
    c = re.sub(r'\s+', ' ', c)
    return c

p('')
p('### DOCX-derived courses (from _docx_100.txt)')
d = io.open(os.path.join(B, '_docx_100.txt'), encoding='utf-8').read()
lines = [re.sub(r'^\s*\d+\|\s?', '', l).rstrip() for l in d.split('\n')]
HEAD = re.compile(r'^(ESUT-PSY[\s-]*\d{3})\s+(.*?)\s*\(([^)]*)\)\s*$')
docx = []
for l in lines:
    m = HEAD.match(l.strip())
    if m:
        docx.append((m.group(1), m.group(2), m.group(3)))
for c in docx:
    p('  %-18s %-56s (%s)' % (c[0], c[1][:54], c[2]))
p('  TOTAL %d' % len(docx))

p('')
p('### CROSS COMPARISON')
acad_norm = {}
for r in acad:
    acad_norm[norm(r[0].strip())] = r[0].strip()
html_by_code = {}
for aid, body in arts:
    m = re.search(r'<span class="course-code">([^<]*)</span>', body)
    html_by_code[norm(m.group(1))] = aid

p('')
p('-- academic codes with NO html article --')
for n, orig in acad_norm.items():
    if n not in html_by_code:
        p('   %-20s (suggested id course-%s)' % (orig, orig.replace(' ', '-')))
p('')
p('-- html articles with NO academic row --')
for n, aid in html_by_code.items():
    if n not in acad_norm:
        p('   %-22s id=%s' % (n, aid))
p('')
p('-- docx courses vs html/academics (normalized code) --')
for c, ttl, meta in docx:
    n = norm(c)
    p('   %-18s %-50s html=%-26s acad=%s' % (c, ttl[:48], html_by_code.get(n, '*** MISSING ***'), acad_norm.get(n, '*** MISSING ***')))
p('')
p('-- id uniqueness --')
dup = [k for k, v in Counter(html_ids).items() if v > 1]
p('   duplicate ids: %s' % (dup or 'none'))
p('   total ids=%d unique=%d' % (len(html_ids), len(set(html_ids))))

io.open(os.path.join(B, '_audit3.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('ok', len(out))
