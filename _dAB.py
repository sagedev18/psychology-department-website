import json, re, io

root = r'c:\Users\muna\OneDrive\Dokumenty\esut website'
html = open(root + r'\course-descriptions.html', encoding='utf-8').read()
data = json.load(open(root + r'\_new100.json', encoding='utf-8'))

out = io.open(root + r'\_outAC.txt', 'w', encoding='utf-8')

out.write('=== JSON structure ===\n')
for k, v in data.items():
    out.write('KEY %r title=%r meta=%r\n' % (k, v.get('title'), v.get('meta')))
    for sec in v.get('sections', []):
        out.write('   SEC %r  (%d paragraphs)\n' % (sec[0], len(sec[1])))
    out.write('   other keys: %r\n' % [x for x in v.keys() if x not in ('title', 'meta', 'sections')])

out.write('\n=== existing articles in course-descriptions.html ===\n')
for m in re.finditer(r'<article class="course-description-item"[^>]*>.*?</article>', html, re.S):
    blk = m.group(0)
    code = re.search(r'class="course-code">(.*?)</span>', blk, re.S)
    out.write('---- line %d  code=%r  id=%r\n' % (html[:m.start()].count('\n') + 1,
        code.group(1).strip() if code else None,
        re.search(r'id="([^"]*)"', blk).group(1) if 'id="' in blk else None))
    out.write(blk + '\n\n')

out.close()
print('ok')
