# add admin note in README
p=r"C:/Users/muna/OneDrive/Dokumenty/esut website/README.md"
with open(p,'r',encoding='utf-8') as f:
    s=f.read()
note='\n## Admin\nSee ADMIN_GUIDE.md for details on setting up a separate admin dashboard.\n'
if 'ADMIN_GUIDE' not in s:
    s+=note
with open(p,'w',encoding='utf-8') as f:
    f.write(s)
print('ok')
