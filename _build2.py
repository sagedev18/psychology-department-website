import re

BASE = '.'
html_path = BASE + '/course-descriptions.html'
desc_path = BASE + '/_new100.txt'
acad_path = BASE + '/academics.html'

# 1. Fix mojibake
content = open(html_path, 'rb').read()
content = content.replace(b'\xc3\xaf\xc2\xbf\xc2\xbd', b'\xc2\xb7')
open(html_path, 'wb').write(content)
print('mojibake fixed')

# 2. Parse supplied descriptions
text = open(desc_path, encoding='utf-8').read()
sections = re.split(r'\n=== ', text)
descs = {}
for sec in sections:
    m = re.match(r'(ESUT-PSY \d+) \| (.+?) \| \((.+)\)\s*$', sec, re.M)
    if not m:
        continue
    code, title, meta = m.group(1), m.group(2), m.group(3)
    descs[code] = (title, meta, sec[m.end():])

def _ul(items):
    return '<ul>' + ''.join('<li>' + x.strip() + '</li>' for x in items if x.strip()) + '</ul>'

def parse_section(body):
    h4_parts = []
    ul_parts = []
    current_h4 = None
    current_items = []
    intro_done = False
    for raw in body.split('\n'):
        line = raw.rstrip()
        stripped = line.strip()
        if stripped.startswith('<') and stripped.endswith('>'):
            if current_h4 == 'Learning Outcomes':
                h4_parts.append('<h4>On completion of the course, the students should be able to:</h4>')
                ul_parts.append(_ul(current_items))
            elif current_h4 == 'Objectives':
                if current_items:
                    ul_parts.append(_ul(current_items))
            elif current_h4 is not None and current_h4 != 'Course Contents':
                h4_parts.append('<h4>' + current_h4 + '</h4>')
                if current_items:
                    ul_parts.append(_ul(current_items))
            current_items = []
            tag = stripped
            if tag == '<Senate-approved relevance>':
                current_h4 = 'Senate-approved relevance'
            elif tag == '<Overview>':
                current_h4 = 'Overview'
            elif tag == '<Objectives>':
                current_h4 = 'Objectives'
                intro_done = False
            elif tag == '<Learning Outcomes>':
                current_h4 = 'Learning Outcomes'
                intro_done = False
            elif tag == '<Course Contents>':
                current_h4 = 'Course Contents'
                intro_done = False
            continue
        line = line.strip()
        if not line:
            continue
        if re.match(r'^[\d]+\.', line) or line.startswith('- '):
            current_items.append(line.lstrip('- ').strip())
        elif current_h4 == 'Overview':
            h4_parts.append('<p>' + line + '</p>')
        elif current_h4 == 'Senate-approved relevance':
            h4_parts.append('<p>' + line + '</p>')
        elif current_h4 == 'Course Contents':
            h4_parts.append('<p>' + line + '</p>')
        elif current_h4 == 'Objectives':
            if not intro_done:
                h4_parts.append('<p>The objectives of this course are to:</p>')
                intro_done = True
        elif current_h4 == 'Learning Outcomes':
# 3. Meta mappings
SEM = {'ESUT-PSY107':'First','ESUT-PSY109':'First','ESUT-PSY 111':'First',
       'ESUT-PSY106':'First','ESUT-PSY108':'Second','ESUT-PSY 110':'Second',
       'ESUT-PSY 112':'Second','ESUT-PSY 114':'Second','ESUT-PSY 113':'First'}
STAT = {'ESUT-PSY107':'Elective','ESUT-PSY109':'Core','ESUT-PSY 111':'Elective',
        'ESUT-PSY106':'Core','ESUT-PSY108':'Core','ESUT-PSY 110':'Elective',
        'ESUT-PSY 112':'Core','ESUT-PSY 114':'Core','ESUT-PSY 113':'Elective'}
SEQ = {'ESUT-PSY107':'5','ESUT-PSY109':'6','ESUT-PSY 111':'7','ESUT-PSY106':'13',
       'ESUT-PSY107':'14','ESUT-PSY108':'15','ESUT-PSY 110':'16','ESUT-PSY 112':'17',
       'ESUT-PSY 114':'17','ESUT-PSY 113':'8'}

def article_html(code, title, body_html):
    sem = SEM[code]
    st = STAT[code]
    meta = 'Level 100 \u00b7 ' + sem + ' Semester \u00b7 2 Units \u00b7 ' + st + ' \u00b7 LH= 30'
    return ('<article class="course-description-item" id="course-' + code.replace(' ', '-') + '">\n'
            '    <div class="description-header">\n'
            '        <span class="course-sequence">' + SEQ[code] + '</span>\n'
            '        <span class="course-code">' + code + '</span>\n'
            '        <span class="course-title">' + title + '</span>\n'
            '        <span class="course-meta">' + meta + '</span>\n'
            '    </div>\n'
            '    <div class="description-body">\n' + body_html + '\n'
            '    </div>\n'
            '</article>\n')

# 4. Prepare and update
prepared = {}
for code, (title, meta, body) in descs.items():
    if code not in prepared:
        prepared[code] = (title, body, parse_section(body))

def replace_placeholder(code, body_html):
    global content
    pat = re.compile(r'<article class="course-description-item" id="course-' + re.escape(code.replace(' ', '-')) + '">.*?</div>\s*</div>', re.S)
    m = pat.search(content)
    if not m:
        print('WARNING: article not found for', code)
        return
    new_article = article_html(code, prepared[code][0], body_html)
    content = content[:m.start()] + new_article + content[m.end():]
    print('updated placeholder:', code)

replace_placeholder('ESUT-PSY107', prepared['ESUT-PSY107'][2])
replace_placeholder('ESUT-PSY109', prepared['ESUT-PSY109'][2])
replace_placeholder('ESUT-PSY 111', prepared['ESUT-PSY 111'][2])

# 5. Insert new articles
def insert_before_anchor(anchor_marker):
    global content
    idx = content.find(anchor_marker)
    if idx < 0:
        print('WARNING: anchor not found')
        return
    new_article = article_html('ESUT-PSY 110', prepared['ESUT-PSY 110'][0], prepared['ESUT-PSY 110'][2])
    content = content[:idx] + new_article + content[idx:]
    print('inserted: ESUT-PSY 110')

insert_before_anchor('<article class="course-description-item" id="course-ESUT-PSY-114">')
insert_before_anchor('<article class="course-description-item" id="course-ESUT-PSY-114">')
insert_before_anchor('<article class="course-description-item" id="course-AIPSY-101">')

# 6. GSD 421 meta fix
content = content.replace('<span class="course-meta">Level 400 \u00b7 First Semester \u00b7 1 Unit</span>',
                          '<span class="course-meta">Level 400 \u00b7 First Semester \u00b7 2 Units</span>')

# 7. Sync Academics.html
acad = open(acad_path, encoding='utf-8').read()
acad = acad.replace('<td>ESUT-PSY 111</td><td>Psychology of Mental Health and Wellbeing</td>',
                    '<td>ESUT-PSY 113</td><td>Psychology of Mental Health and Wellbeing</td>')
open(acad_path, 'w', encoding='utf-8').write(acad)
print('academics 111->113 done')

open(html_path, 'wb').write(content)
print('DONE')

            if not intro_done:
                h4_parts.append('<p>On completion of the course, the students should be able to:</p>')
                intro_done = True
    if current_h4 == 'Learning Outcomes':
        h4_parts.append('<h4>On completion of the course, the students should be able to:</h4>')
        ul_parts.append(_ul(current_items))
    elif current_h4 == 'Objectives':
        if current_items:
            ul_parts.append(_ul(current_items))
    elif current_h4 is not None and current_h4 != 'Course Contents':
        h4_parts.append('<h4>' + current_h4 + '</h4>')
        if current_items:
            ul_parts.append(_ul(current_items))
    return ''.join(h4_parts) + ''.join(ul_parts)
