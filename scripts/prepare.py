import csv, json, hashlib, itertools, collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'data/original/FAOSTAT Data Nov 16 2026(1).csv'
raw=p.read_bytes()
with p.open(encoding='utf-8-sig',newline='') as f:
 reader=csv.DictReader(f); columns=reader.fieldnames; rows=list(reader)
key=lambda r: tuple(r[c] for c in ['Domain Code','Area Code (M49)','Food Group Code','Indicator Code','Year','Element Code','Unit'])
counts=collections.Counter(map(key,rows))
duplicates=[list(k) for k,n in counts.items() if n>1]
assert not duplicates, 'Duplicate observation keys: investigate rather than aggregate'
normalized=[]
for r in rows:
 v=None if not r['Value'].strip() else float(r['Value'])
 normalized.append(dict(country=r['Area'],countryCode=r['Area Code (M49)'],indicator=r['Indicator'],indicatorCode=r['Indicator Code'],year=int(r['Year']),unit=r['Unit'],value=v,flag=r['Flag'],flagDescription=r['Flag Description'],source=r))
countries=sorted(set(r['Area'] for r in rows)); indicators=sorted(set(r['Indicator'] for r in rows)); years=sorted(set(int(r['Year']) for r in rows))
missing=[dict(country=c,indicator=i,year=y) for c,i,y in itertools.product(countries,indicators,years) if not any(r['country']==c and r['indicator']==i and r['year']==y for r in normalized)]
audit=dict(filename=p.name,sha256=hashlib.sha256(raw).hexdigest(),rows=len(rows),columns=columns,countries=countries,indicators=indicators,years=years,duplicates=duplicates,missingCombinations=missing,missingValues=sum(r['value'] is None for r in normalized),zeroValues=sum(r['value']==0 for r in normalized),flags=dict(collections.Counter(r['Flag']+' — '+r['Flag Description'] for r in rows)),domain=sorted(set(r['Domain'] for r in rows)),foodGroups=sorted(set(r['Food Group'] for r in rows)),definitions='CSV supplies indicator labels, unit strings and flag descriptions. External unit meanings and methodology references are recorded separately in data/methodology.json; export-specific revisions and analytical details remain to verify.')
(ROOT/'data/observations.json').write_text(json.dumps(normalized,ensure_ascii=False,indent=2)+'\n')
(ROOT/'data/audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:audit[k] for k in ['rows','missingValues','zeroValues','duplicates','missingCombinations','sha256']},indent=2))
