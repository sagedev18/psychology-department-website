import json, io, sys
sys.stdout.reconfigure(encoding='utf-8')
d = json.load(open('_new100.json', encoding='utf-8'))
print(type(d))
if isinstance(d, dict):
    print('KEYS', list(d.keys()))
    for k, v in d.items():
        print('==', k, type(v))
        print(json.dumps(v, ensure_ascii=False, indent=1)[:1500])
        break
else:
    print(json.dumps(d[0], ensure_ascii=False, indent=1)[:2000])
    print('LEN', len(d))
