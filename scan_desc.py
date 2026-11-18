import re
BASE = 'c:/Users/muna/OneDrive/Dokumenty/esut website'
content = open(BASE + '/course-descriptions.html', encoding='utf-8', errors='replace').read()
articles = re.split(r'(?=<article class="course-description-item")', content)
print('total articles:', len(articles))
for i, art in enumerate(articles):
    code = re.search(r'course-code[^>]*>([^<]*)<', art)
    seq = re.search(r'course-sequence[^>]*>([^<]*)<', art)
    idm = re.search(r'id="course-([^"]+)"', art)
    body = re.search(r'<div class="description-body">(.*?)</div>', art, re.S)
    ph = 'No course description' in body.group(1) if body else True
    print(i, '|', idm.group(1) if idm else '?', '|', code.group(1) if code else '?', '|', seq.group(1) if seq else '?', '|', ph)
