import re
BASE = '.'
content = open(BASE + '/course-descriptions.html', encoding='utf-8', errors='replace').read()
articles = re.split(r'(?=<article class=[^ >]*)', content)
print('total articles:', len(articles))
for i, art in enumerate(articles):
    code = re.search(r'course-code[^>]*>([^<]*)<', art)
    seq = re.search(r'course-sequence[^>]*>([^<]*)<', art)
    title = re.search(r'course-title[^>]*>([^<]*)<', art)
    meta = re.search(r'course-meta[^>]*>([^<]*)<', art)
    idm = re.search(r'<article[^>]*>', art)
    ph = art.count('No course description') > 0
    print(i, '::', idm.group(0) if idm else '?', '::', code.group(1) if code else '?', '::', title.group(1) if title else '?', '::', meta.group(1) if meta else '?', '::', ph)
