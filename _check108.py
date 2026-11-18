with open('c:/Users/muna/OneDrive/Dokumenty/esut website/course-descriptions.html.bak4', encoding='utf-8') as f:
    content = f.read()
import re
codes = re.findall(r'id="course-([^"]+)"', content)
psy_codes = [c for c in sorted(set(codes)) if 'PSY' in c.upper()]
for c in psy_codes:
    count = content.count('id="course-' + c + '"')
    print(f'{c}: {count}')

# Also check for ESUT-PSY 108 specifically
print()
print('ESUT-PSY 108 in bak4:', 'ESUT-PSY 108' in content or 'ESUT-PSY108' in content)
print('ESUT-PSY 108 in current:', 'ESUT-PSY 108' in open('c:/Users/muna/OneDrive/Dokumenty/esut website/course-descriptions.html', encoding='utf-8').read() or 'ESUT-PSY108' in open('c:/Users/muna/OneDrive/Dokumenty/esut website/course-descriptions.html', encoding='utf-8').read())