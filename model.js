export function compare(rows,country,indicator,start,end){
 const candidates=y=>rows.filter(r=>r.country===country&&r.indicator===indicator&&r.year===y);
 const a=candidates(start),b=candidates(end);
 if(a.length!==1||b.length!==1||a[0].value===null||b[0].value===null)return {absolute:null,percent:null,reason:'Missing or ambiguous endpoint'};
 if(a[0].unit!==b[0].unit)return {absolute:null,percent:null,reason:'Units differ'};
 const absolute=b[0].value-a[0].value;
 return {absolute,percent:a[0].value===0?null:absolute/a[0].value*100,reason:a[0].value===0?'Percentage undefined: starting value is zero':null};
}
export function csv(rows,columns){const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';return columns.map(cell).join(',')+'\r\n'+rows.map(r=>columns.map(c=>cell(r[c])).join(',')).join('\r\n')+'\r\n';}

export function countryMatches(country,query){
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
 return normalize(country).includes(normalize(query.trim()));
}
export function yearlyGrid(rows,countries,indicators,start,end){
 return countries.flatMap(country=>indicators.flatMap(indicator=>Array.from({length:end-start+1},(_,i)=>{
  const year=start+i,matches=rows.filter(r=>r.country===country&&r.indicator===indicator&&r.year===year);
  const row=matches.length===1?matches[0]:null;
  return {country,indicator,year,unit:row?.unit??rows.find(r=>r.indicator===indicator)?.unit??'Unknown',value:row?.value??null,sourceValue:row?.source?.Value??(row?.value===null?'':String(row?.value??'')),flag:row?.flag??'',flagDescription:row?.flagDescription??'',status:matches.length>1?'Ambiguous observation':!row?'Observation absent':row.value===null?'Value missing':'Available'};
 })));
}
