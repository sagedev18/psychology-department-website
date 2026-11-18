import io, re, json

html = io.open('course-descriptions.html', encoding='utf-8').read()
data = json.load(io.open('_new100.json', encoding='utf-8'))

arts = re.findall(r'<article class="course-description-item" id="([^"]+)">(.*?)</article>', html, re.S)
info = {}
for aid, body in arts:
    def g(p):
        m = re.search(p, body)
        return m.group(1).strip() if m else ''
    txt = re.sub(r'<[^>]+>', ' ', body)
    txt = re.sub(r'\s+', ' ', txt).strip()
    info[aid] = dict(seq=g(r'course-sequence">([^<]*)'), code=g(r'course-code">([^<]*)'),
                     title=g(r'course-title">([^<]*)'), meta=g(r'course-meta">([^<]*)'),
                     h4=re.findall(r'<h4>(.*?)</h4>', body, re.S),
                     ph='No course description' in body, len=len(txt),
                     line=html[:html.index('<article class="course-description-item" id="%s">' % aid)].count('\n') + 1)

def norm(c):
    return re.sub(r'[^A-Z0-9]', '', c.upper())

bymap = {}
for aid, d in info.items():
    bymap.setdefault(norm(d['code']), []).append(aid)

out = []
out.append('== MAPPING (JSON key -> html article) ==')
for k, v in data.items():
    cands = bymap.get(norm(k), [])
    out.append('%-16s title=%s' % (k, v.get('title')))
    out.append('                 meta=%s' % v.get('meta'))
    out.append('                 -> %s' % (cands,))
    for c in cands:
        d = info[c]
        out.append('      %-22s line=%-5s seq=%-4s codeText=%r titleMatch=%s metaMatch=%s ph=%s h4=%s' % (
            c, d['line'], d['seq'], d['code'], d['title'].strip() == v.get('title', '').strip(),
            d['meta'].strip() == v.get('meta', '').strip(), d['ph'], d['h4']))
    secs = [(s[0], len(s[1])) for s in v['sections']]
    allp = [p for s in v['sections'] for p in s[1]]
    out.append('      JSON sections=%s paragraphs=%d chars=%d' % (secs, len(allp), sum(len(p) for p in allp)))
    for s in v['sections']:
        for p in s[1]:
            if not p.strip() or len(p) < 3:
                out.append('      !! odd paragraph in %s: %r' % (s[0], p))

out.append('')
out.append('== HTML PSY articles with NO json match ==')
jn = {norm(k) for k in data}
for aid, d in info.items():
    if 'PSY' in aid and norm(d['code']) not in jn:
        out.append('%s code=%r title=%r line=%d' % (aid, d['code'], d['title'], d['line']))

out.append('')
out.append('== JSON keys with NO html article ==')
for k in data:
    if norm(k) not in bymap:
        out.append(k)

io.open('_audit2.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('ok')
