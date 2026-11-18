# -*- coding: utf-8 -*-
import os, re, zipfile
SRC = r"c:\Users\muna\OneDrive\Dokumenty\DEPT PROGRAM WITH AI COURSES.docx"
z = zipfile.ZipFile(SRC)
xml = z.read('word/document.xml').decode('utf-8','replace')
# paragraphs
xml = xml.replace('</w:p>', '\n')
xml = re.sub(r'<w:tab[^>]*/>', '\t', xml)
xml = re.sub(r'<w:br[^>]*/>', '\n', xml)
txt = re.sub(r'<[^>]+>', '', xml)
import html
txt = html.unescape(txt)
open(r"c:\Users\muna\OneDrive\Dokumenty\esut website\_docx.txt","w",encoding="utf-8").write(txt)
print(len(txt))
print(txt[:1500])