import json, io

with open('_new100.json', encoding='utf-8') as f:
    d = json.load(f)

out = io.open('_outAE.txt', 'w', encoding='utf-8')
out.write('TYPE: %s\n' % type(d).__name__)
if isinstance(d, dict):
    out.write('KEYS: %s\n' % list(d.keys()))
    for k, v in d.items():
        out.write('\n===== %s =====\n' % k)
        if isinstance(v, dict):
            for kk, vv in v.items():
                out.write('KEY %r -> %s len=%s\n' % (kk, type(vv).__name__, (len(vv) if hasattr(vv, '__len__') else '')))
                if isinstance(vv, list):
                    for i, item in enumerate(vv):
                        out.write('   [%d] %s\n' % (i, repr(item)[:1200]))
                else:
                    out.write('   %s\n' % repr(vv)[:3000])
        else:
            out.write(repr(v)[:3000])
out.close()
print('done')
