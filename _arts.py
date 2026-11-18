import io, re, sys

t = io.open('course-descriptions.html', encoding='utf-8').read()
out = io.open('_art.txt', 'w', encoding='utf-8')

blocks = re.findall(r'<article class="course-description-item"[^>]*id="([^"]+)"[^>]*>(.*?)</article>', t, re.S)
out.write("TOTAL ARTICLES: %d\n" % len(blocks))
for aid, b in blocks:
    seq = re.search(r'course-sequence">([^<]*)<', b)
    code = re.search(r'course-code">([^<]*)<', b)
    title = re.search(r'course-title">([^<]*)<', b)
    meta = re.search(r'course-meta">([^<]*)<', b)
    body = re.search(r'<div class="description-body">(.*?)</div>\s*$', b, re.S)
    blen = len(body.group(1)) if body else 0
    hs = re.findall(r'<h4>([^<]*)</h4>', b)
    out.write("ID=%s | SEQ=%s | CODE=%s | TITLE=%s | META=%s | BODYLEN=%d\n" % (
        aid, seq.group(1) if seq else '', code.group(1) if code else '',
        title.group(1) if title else '', meta.group(1) if meta else '', blen))
    out.write("    H4: %s\n" % " | ".join(hs))
out.close()
print("ok")
