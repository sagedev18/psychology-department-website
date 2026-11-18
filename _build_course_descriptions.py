import re

BASE = '.'

# 1. Fix mojibake in course-descriptions.html
content = open(BASE + '/course-descriptions.html', 'rb').read()
content = content.replace(b'\xc3\xaf\xc2\xbf\xc2\xbd', b'\xc2\xb7')
open(BASE + '/course-descriptions.html', 'wb').write(content)
print('mojibake fixed')

# 2. Parse supplied descriptions from _new100.txt
text = open(BASE + '/_new100.txt', encoding='utf-8').read()
sections = re.split(r'\n=== ', text)
descs = {}
for sec in sections:
    m = re.match(r'(ESUT-PSY \d+) \| (.+?) \| \((.+)\)\s*$', sec, re.M)
    if m:
        code, title, meta, body = m.group(1), m.group(2), m.group(3), sec[m.end():]
        code = code.replace(' ', '')  # normalize 'ESUT-PSY 107' -> 'ESUT-PSY107'
        descs[code] = (title, meta, body)

def _ul(items):
    return '<ul>' + ''.join('<li>' + x.strip() + '</li>' for x in items if x.strip()) + '</ul>'

def parse_section(body):
    h4_parts = []
    ul_parts = []
    current_h4 = None
    current_items = []
    intro_done = False
    for raw in body.split('\n'):
        s = raw.strip()
        if s.startswith('<') and s.endswith('>'):
            # flush previous block
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
            intro_done = False
            # start new block
            tag = s
            if tag == '<Senate-approved relevance>':
                current_h4 = 'Senate-approved relevance'
            elif tag == '<Overview>':
                current_h4 = 'Overview'
            elif tag == '<Objectives>':
                current_h4 = 'Objectives'
            elif tag == '<Learning Outcomes>':
                current_h4 = 'Learning Outcomes'
            elif tag == '<Course Contents>':
                current_h4 = 'Course Contents'
            continue
        s = s.strip()
        if not s:
            continue
        if re.match(r'^[\d]+\.', s) or s.startswith('- '):
            current_items.append(s.lstrip('- ').strip())
        elif current_h4 == 'Overview':
            h4_parts.append('<p>' + s + '</p>')
        elif current_h4 == 'Senate-approved relevance':
            h4_parts.append('<p>' + s + '</p>')
        elif current_h4 == 'Course Contents':
            h4_parts.append('<p>' + s + '</p>')
        elif current_h4 == 'Objectives':
            if not intro_done:
                h4_parts.append('<p>The objectives of this course are to:</p>')
                intro_done = True
        elif current_h4 == 'Learning Outcomes':
            if not intro_done:
                h4_parts.append('<p>On completion of the course, the students should be able to:</p>')
                intro_done = True
    # flush trailing block
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

# 3. Meta mappings
SEM = {
    'ESUT-PSY107': 'First', 'ESUT-PSY109': 'First', 'ESUT-PSY111': 'First',
    'ESUT-PSY106': 'First', 'ESUT-PSY108': 'Second', 'ESUT-PSY110': 'Second',
    'ESUT-PSY112': 'Second', 'ESUT-PSY114': 'Second', 'ESUT-PSY113': 'First'}
STAT = {
    'ESUT-PSY107': 'Elective', 'ESUT-PSY109': 'Core', 'ESUT-PSY111': 'Elective',
    'ESUT-PSY106': 'Core', 'ESUT-PSY108': 'Core', 'ESUT-PSY110': 'Elective',
    'ESUT-PSY112': 'Core', 'ESUT-PSY114': 'Core', 'ESUT-PSY113': 'Elective'}
SEQ = {
    'ESUT-PSY107': '5', 'ESUT-PSY109': '6', 'ESUT-PSY111': '7',
    'ESUT-PSY106': '13', 'ESUT-PSY108': '15', 'ESUT-PSY110': '16',
    'ESUT-PSY112': '17', 'ESUT-PSY114': '18', 'ESUT-PSY113': '8'}

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

# 4. Prepare parsed descriptions
prepared = {}
for code, (title, meta, body) in descs.items():
    if code not in prepared:
        prepared[code] = (title, meta, parse_section(body))

# 5. Replace placeholders for existing ESUT-PSY 107 / 109 / 111
content = open(BASE + '/course-descriptions.html', 'rb').read().decode('utf-8')

def replace_placeholder(code, body_html):
    global content
    # Try multiple id formats (site has inconsistent dash usage)
    id_variants = [code.replace(' ', '-')]
    if '-' not in code.split('-')[-1]:
        # code like ESUT-PSY111 -> also try ESUT-PSY-111
        parts = code.rsplit('-', 1)  # but ESUT-PSY111 has no dash before 111...
        # Try inserting dash before trailing digits
        import re as _re
        m = _re.match(r'(.+?)(\d+)$', code)
        if m:
            id_variants.append(m.group(1) + '-' + m.group(2))
    found = False
    for id_var in id_variants:
        pat = re.compile(
            r'<article class="course-description-item" id="course-' +
            re.escape(id_var) + r'">.*?</article>', re.S)
        m = pat.search(content)
        if m:
            new_article = article_html(code, prepared[code][0], body_html)
            content = content[:m.start()] + new_article + content[m.end():]
            print('updated placeholder:', code)
            found = True
            break
    if not found:
        print('WARNING: article not found for', code)

replace_placeholder('ESUT-PSY107', prepared['ESUT-PSY107'][2])
replace_placeholder('ESUT-PSY109', prepared['ESUT-PSY109'][2])
replace_placeholder('ESUT-PSY111', prepared['ESUT-PSY111'][2])

# 6. Insert new articles (110, 112, 113)
def insert_before_anchor(anchor_marker, new_article):
    global content
    idx = content.find(anchor_marker)
    if idx < 0:
        print('WARNING: anchor not found:', anchor_marker)
        return
    content = content[:idx] + new_article + content[idx:]
    print('inserted before:', anchor_marker[:50])

insert_before_anchor('<article class="course-description-item" id="course-ESUT-PSY-114">',
                     article_html('ESUT-PSY110', prepared['ESUT-PSY110'][0], prepared['ESUT-PSY110'][2]))
insert_before_anchor('<article class="course-description-item" id="course-ESUT-PSY-114">',
                     article_html('ESUT-PSY112', prepared['ESUT-PSY112'][0], prepared['ESUT-PSY112'][2]))
insert_before_anchor('<article class="course-description-item" id="course-AIPSY-101">',
                     article_html('ESUT-PSY113', prepared['ESUT-PSY113'][0], prepared['ESUT-PSY113'][2]))

# 7. GSD 421 meta fix: 1 Unit → 2 Units
content = content.replace(
    '<span class="course-meta">Level 400 \u00b7 First Semester \u00b7 1 Unit</span>',
    '<span class="course-meta">Level 400 \u00b7 First Semester \u00b7 2 Units</span>')
print('GSD 421 meta fixed')

# 8. Sync academics.html: ESUT-PSY 111 → ESUT-PSY 113
acad_path = BASE + '/academics.html'
acad = open(acad_path, encoding='utf-8').read()
acad = acad.replace(
    '<td>ESUT-PSY 111</td><td>Psychology of Mental Health and Wellbeing</td>',
    '<td>ESUT-PSY 113</td><td>Psychology of Mental Health and Wellbeing</td>')
open(acad_path, 'w', encoding='utf-8').write(acad)
print('academics 111->113 sync done')

# 9. Write course-descriptions.html
open(BASE + '/course-descriptions.html', 'w', encoding='utf-8').write(content)
print('DONE - course-descriptions.html and academics.html updated')
