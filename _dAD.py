import io, re

raw = open('course-descriptions.html', 'rb').read()
out = io.open('_outAG.txt', 'w', encoding='utf-8')
out.write('BYTES: %d\n' % len(raw))
try:
    txt = raw.decode('utf-8')
    out.write('DECODE utf-8: OK\n')
except UnicodeDecodeError as e:
    out.write('DECODE utf-8 FAIL: %s\n' % e)
    txt = raw.decode('utf-8', errors='replace')
    for i, line in enumerate(txt.splitlines(), 1):
        if '\ufffd' in line:
            out.write('REPL line %d: %s\n' % (i, line[:400]))
lines = txt.splitlines()
out.write('LINES: %d\n' % len(lines))
for i, line in enumerate(lines, 1):
    if 'course-description-item' in line:
        out.write('ARTICLE line %d: %s\n' % (i, line.strip()))
# find ESUT-PSY blocks fully
for m in re.finditer(r'<article class="course-description-item" id="course-(ESUT-PSY[^"]*)".*?</article>', txt, re.S):
    out.write('\n#### %s\n%s\n' % (m.group(1), m.group(0)))
out.close()
print('ok')
