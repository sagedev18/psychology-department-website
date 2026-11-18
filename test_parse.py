import re

BASE = '.'
desc_path = BASE + '/_new100.txt'

text = open(desc_path, encoding='utf-8').read()
sections = re.split(r'\n=== ', text)
descs = {}
for sec in sections:
    m = re.match(r'(ESUT-PSY \d+) \| (.+?) \| \((.+)\)\s*$', sec, re.M)
    if not m:
        continue
    code, title, meta = m.group(1), m.group(2), m.group(3)
    body = sec[m.end():]
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

# Test on 110
title, meta, body = descs['ESUT-PSY 110']
html_body = parse_section(body)
print('TITLE:', title)
print('META:', meta)
print('---HTML BODY---')
print(html_body)
