import re
with open('c:/Users/muna/OneDrive/Dokumenty/esut website/_new100.txt', encoding='utf-8') as f:
    text = f.read()
m = re.search(r'=== ESUT-PSY 112 \| .+?\n(.*?)(?=\n=== |\Z)', text, re.S)
if m:
    print(m.group(1))
else:
    print("NOT FOUND")