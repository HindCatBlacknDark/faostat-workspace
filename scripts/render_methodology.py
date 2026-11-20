"""Embed methodology at authoring time so readable content never relies on a fetch."""
import json,re,hashlib
from html import escape
from pathlib import Path
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'data/methodology.json').read_text())
sources={s['id']:s for s in m['sources']}
def link(s): return f'<a href="{escape(s["url"],quote=True)}">{escape(s["title"])}</a>'
content={'methodologyScope':escape(m['scope']),'indicatorGuide':''.join('<article><h3>'+escape(i['label'])+'</h3><p>'+escape(i['unit']+' = '+i['unitMeaning'])+'</p><p>'+escape(i['explanation'])+'</p><p>Sources: '+'. '.join(link(sources[id]) for id in i['sourceIds'])+'</p></article>' for i in m['indicators']), 'unresolved':''.join('<li>'+escape(t)+'</li>' for t in m['unresolved']), 'reviewDate':escape('Reviewed '+m['reviewedOn']+'. External references were checked separately from the CSV.'), 'methodSources':''.join('<li>'+link(s)+'<p>'+escape(s['supports']+' '+s['verification'])+'</p></li>' for s in m['sources'])}
for id in ['methodSummary','collectionSummary','coverageSummary','supplementalSummary','contactSummary','foodGroupSummary','flagSummary']: content[id]=escape(m[id])
p=root/'index.html';html=p.read_text()
for id,body in content.items():
 pattern=r'(<(p|div|ul|ol)\b[^>]*\bid="'+id+r'"[^>]*>).*?(</\2>)'
 html,n=re.subn(pattern,lambda match:match[1]+body+match[3],html,flags=re.S)
 assert n==1,id
model_version=hashlib.sha256((root/'model.js').read_bytes()).hexdigest()[:12]
app=root/'app.js'
app.write_text(re.sub(r"from './model\.js(?:\?[^']*)?'",f"from './model.js?v={model_version}'",app.read_text()))
version=hashlib.sha256(app.read_bytes()).hexdigest()[:12]
style_version=hashlib.sha256((root/'style.css').read_bytes()).hexdigest()[:12]
html=re.sub(r'href="style\.css(?:\?[^\"]*)?"',f'href="style.css?v={style_version}"',html)
html=re.sub(r'src="app\.js(?:\?[^\"]*)?"',f'src="app.js?v={version}"',html)
p.write_text(html)
print('Embedded methodology content; refreshed script version.')
