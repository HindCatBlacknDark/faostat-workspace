import {compare,csv,countryMatches,yearlyGrid} from './model.js?v=c0481b5f3cde';
const $=id=>document.getElementById(id), fmt=v=>v===null?'Missing':Number(v.toFixed(2)).toLocaleString('en');
const colors=['#236b55','#b15a30','#406ca3','#9862a0','#807124','#a43e59'];
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
let rows,audit,methodology;
const selectedCountries=new Set(["Algeria","Kenya","South Africa"]);
function methodologyText(){return `Methodology reviewed: ${methodology.reviewedOn}\n${methodology.scope}\n${methodology.indicators.map(i=>`${i.label} (${i.code}): ${i.unit} = ${i.unitMeaning}. ${i.explanation}`).join("\n")}\n${methodology.methodSummary}\n${methodology.collectionSummary}\n${methodology.coverageSummary}\n${methodology.supplementalSummary}\n${methodology.contactSummary}\n${methodology.flagSummary}\nStill to verify:\n${methodology.unresolved.join("\n")}\nSources:\n${methodology.sources.map(s=>`${s.title}: ${s.url} — ${s.supports} ${s.verification}`).join("\n")}`;}
function renderMethodology(){
 for(const id of ["indicatorGuide","unresolved","methodSources"])$(id).replaceChildren();
 $("methodologyScope").textContent=methodology.scope;
 for(const i of methodology.indicators){const card=el("article");card.append(el("h3",i.label),el("p",`${i.unit} = ${i.unitMeaning}`),el("p",i.explanation)); const refs=el("p");refs.append("Sources: ");for(const id of i.sourceIds){const source=methodology.sources.find(s=>s.id===id),a=el("a",source.title);a.href=source.url;refs.append(a,". ");}card.append(refs);$("indicatorGuide").append(card);}
 for(const id of ["methodSummary","collectionSummary","coverageSummary","supplementalSummary","contactSummary","foodGroupSummary","flagSummary"])$(id).textContent=methodology[id];
 for(const text of methodology.unresolved)$("unresolved").append(el("li",text));
 $("reviewDate").textContent=`Reviewed ${methodology.reviewedOn}. External references were checked separately from the CSV.`;
 for(const source of methodology.sources){const item=el("li"),a=el("a",source.title);a.href=source.url;item.append(a,el("p",`${source.supports} ${source.verification}`));$("methodSources").append(item);}
}

function saveFile(name,text,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=el('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function selection(){return {countries:audit.countries.filter(c=>selectedCountries.has(c)),start:+$('start').value,end:+$('end').value};}
function filtered(){const s=selection();return rows.filter(r=>s.countries.includes(r.country)&&r.year>=s.start&&r.year<=s.end);}
function evidence(){const s=selection();return s.countries.flatMap(c=>audit.indicators.map(i=>{const d=compare(rows,c,i,s.start,s.end),a=rows.find(r=>r.country===c&&r.indicator===i&&r.year===s.start),b=rows.find(r=>r.country===c&&r.indicator===i&&r.year===s.end);return `${c} — ${i}: ${s.start}: ${fmt(a?.value??null)}; ${s.end}: ${fmt(b?.value??null)} ${a?.unit??b?.unit??''}; change ${fmt(d.absolute)}; ${fmt(d.percent)}%. Flags: ${a?.flag??'missing'} / ${b?.flag??'missing'} (E = Estimated value).`;})).join('\n');}
function svgNode(tag,attrs,text){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;}
function renderCountryPicker(){
 const matches=audit.countries.filter(c=>countryMatches(c,$('countrySearch').value));
 $('countries').replaceChildren();
 for(const country of matches){const label=el('label'),input=el('input');input.type='checkbox';input.dataset.country=country;input.checked=selectedCountries.has(country);input.disabled=selectedCountries.size>=6&&!input.checked;
 input.onchange=()=>{if(input.checked)selectedCountries.add(country);else selectedCountries.delete(country);renderCountryPicker();render();[...$('countries').querySelectorAll('input')].find(input=>input.dataset.country===country)?.focus();};label.append(input,el('span',country));$('countries').append(label);}
 $('countryCount').textContent=`${matches.length} countries match · ${selectedCountries.size} of 6 selected`;
 if(!matches.length)$('countries').append(el('p','No countries match. Try a different spelling.'));
 $('selectedCountries').replaceChildren();
 for(const country of audit.countries.filter(c=>selectedCountries.has(c))){const button=el('button',`${country} ×`);button.type='button';button.setAttribute('aria-label',`Remove ${country}`);button.onclick=()=>{selectedCountries.delete(country);renderCountryPicker();render();};$('selectedCountries').append(button);}
 $('clearCountries').disabled=selectedCountries.size===0;
}
function renderYearly(s){
 const grid=yearlyGrid(rows,s.countries,audit.indicators,s.start,s.end);
 $('yearlyValues').replaceChildren();
 for(const row of grid){const tr=el('tr'),heading=el('th',row.country);heading.scope='row';tr.append(heading);
 [row.indicator,String(row.year),row.value===null?'Missing':row.sourceValue,row.unit,row.flag?`${row.flag} — ${row.flagDescription}`:'Not supplied',row.status].forEach(value=>tr.append(el('td',value)));$('yearlyValues').append(tr);}
 $('yearlySummary').textContent=`${grid.length} country–indicator–year entries · ${grid.filter(r=>r.status==='Available').length} available values`;
}
function renderChart(indicator,s){
 const data=filtered().filter(r=>r.indicator===indicator),unit=[...new Set(data.map(r=>r.unit))].join(', '),card=el('article');card.className='chart';card.append(el('h3',`${indicator} · ${unit}`));
 const hint=el('p','Hover, focus or tap a point for its exact value and flag. Press Escape to dismiss.');hint.className='muted';card.append(hint);
 const viewport=el('div');viewport.className='chart-scroll';viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label',`${indicator} chart; scroll horizontally on narrow screens`);
 const svg=svgNode('svg',{viewBox:'0 0 720 245',role:'group','aria-label':`${indicator} by year, ${unit}. Interactive points; the yearly values table provides the same observations.`});
 const tip=el('div');tip.className='point-detail';tip.id=`detail-${indicator.replaceAll(' ','-')}`;tip.setAttribute('role','status');tip.textContent='Point details will appear here.';
 let pinned=null;const describe=r=>`${r.country} · ${r.year} · ${r.indicator}: ${r.value} ${r.unit} · Flag ${r.flag} — ${r.flagDescription}`;
 const show=r=>{tip.textContent=describe(r);};const reset=()=>{pinned=null;tip.textContent='Point details will appear here.';};
 card.addEventListener('keydown',event=>{if(event.key==='Escape')reset();});
 const max=Math.max(1,...data.filter(r=>r.value!==null).map(r=>r.value))*1.12,x=year=>64+(year-s.start)/(s.end-s.start)*620,y=value=>195-value/max*165;
 for(let n=0;n<=4;n++){const v=max*n/4;svg.append(svgNode('line',{x1:64,y1:y(v),x2:684,y2:y(v),stroke:'#dce2d5'}),svgNode('text',{x:56,y:y(v)+4,'text-anchor':'end','font-size':11,fill:'#52665c'},fmt(v)));}
 for(let year=s.start;year<=s.end;year++)svg.append(svgNode('text',{x:x(year),y:222,'text-anchor':'middle','font-size':12,fill:'#52665c'},year));
 const legend=el('div');legend.className='legend';
 s.countries.forEach((country,index)=>{let previous=null;
 for(let year=s.start;year<=s.end;year++){const matches=data.filter(r=>r.country===country&&r.year===year),r=matches.length===1?matches[0]:null;if(!r||r.value===null){previous=null;continue;}
 if(previous)svg.append(svgNode('line',{x1:x(previous.year),y1:y(previous.value),x2:x(year),y2:y(r.value),stroke:colors[index],'stroke-width':2,'stroke-dasharray':index%2?'6 3':'none','pointer-events':'none'}));
 const point=svgNode('g',{tabindex:0,role:'button','aria-label':describe(r),'aria-describedby':tip.id,class:'chart-point'}),target=svgNode('circle',{cx:x(year),cy:y(r.value),r:13,fill:'transparent'}),dot=svgNode('circle',{cx:x(year),cy:y(r.value),r:4,fill:colors[index],'pointer-events':'none'});
 point.append(target,dot);point.onpointerenter=()=>show(r);point.onpointerleave=()=>{if(pinned)show(pinned);};point.onfocus=()=>show(r);point.onclick=()=>{pinned=r;show(r);};point.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pinned=r;show(r);}};svg.append(point);previous=r;}
 const label=el('span',country);label.style.borderColor=colors[index];legend.append(label);
 const a=rows.find(r=>r.country===country&&r.indicator===indicator&&r.year===s.start),b=rows.find(r=>r.country===country&&r.indicator===indicator&&r.year===s.end),d=compare(rows,country,indicator,s.start,s.end),tr=el('tr'),heading=el('th',`${country} / ${indicator} (${unit})`);heading.scope='row';tr.append(heading);
 [`${s.start}: ${fmt(a?.value??null)}`,`${s.end}: ${fmt(b?.value??null)}`,fmt(d.absolute),d.percent===null?'Undefined / missing':fmt(d.percent)+'%'].forEach(t=>tr.append(el('td',t)));$('comparison').append(tr);
 });viewport.append(svg);card.append(viewport,legend,tip);$('charts').append(card);
}
function render(){
 const s=selection(),valid=s.countries.length>0&&s.countries.length<=6&&s.start<s.end;
 $('selectionMessage').textContent=valid?'':'Choose 1–6 countries and an end year after the start year.';
 for(const id of ['export','insert','download'])$(id).disabled=!valid;
 for(const id of ['charts','comparison','yearlyValues'])$(id).replaceChildren();$('yearlySummary').textContent='';$('exportStatus').textContent='';if(!valid)return;
 for(const indicator of audit.indicators)renderChart(indicator,s);renderYearly(s);
}
for(const button of document.querySelectorAll('[data-tab]'))button.onclick=()=>{for(const b of document.querySelectorAll('[data-tab]')){const active=b===button;b.setAttribute('aria-selected',String(active));$(b.dataset.tab).hidden=!active;}};
const fields=['claim','evidence','limits','question'];for(const id of fields){try{$(id).value=localStorage.getItem('fieldnotes-'+id)||'';}catch{}$(id).oninput=()=>{try{localStorage.setItem('fieldnotes-'+id,$(id).value);$('draftStatus').textContent='Draft saved in this browser.';}catch{$('draftStatus').textContent='Browser storage unavailable. Download your draft to save it.';}};}
try{const responses=await Promise.all(['data/observations.json','data/audit.json','data/methodology.json'].map(p=>fetch(p,{cache:"no-store"})));if(responses.some(r=>!r.ok))throw Error('Source data could not be loaded');[rows,audit,methodology]=await Promise.all(responses.map(r=>r.json()));renderMethodology();$('countrySearch').oninput=renderCountryPicker;$('clearCountries').onclick=()=>{selectedCountries.clear();renderCountryPicker();render();};renderCountryPicker();for(const id of ['start','end'])for(const year of audit.years){const o=el('option',year);o.value=year;$(id).append(o);}$('start').value=2019;$('end').value=2023;for(const id of ['start','end'])$(id).onchange=render;$('status').textContent=`${audit.rows} observations · ${audit.countries.length} countries · 2019–2023 · Cereals and their products`;$('audit').textContent=`Original file: ${audit.filename}\nSHA-256: ${audit.sha256}\nColumns: ${audit.columns.join(', ')}\nCountries (${audit.countries.length}): ${audit.countries.join(', ')}\nDuplicate observation keys: ${audit.duplicates.length}\nMissing values: ${audit.missingValues}\nMissing combinations within observed coverage: ${audit.missingCombinations.length}\nZero values: ${audit.zeroValues}\nFlags: ${JSON.stringify(audit.flags)}\nNotes: all blank.\n${audit.definitions}`;
$('export').onclick=()=>{saveFile('faostat-selected-observations.csv',csv(filtered().map(r=>r.source),audit.columns),'text/csv;charset=utf-8');$('exportStatus').textContent=`CSV download requested: ${filtered().length} original observations.`;};$('insert').onclick=()=>{$('evidence').value=evidence();$('evidence').oninput();};$('download').onclick=()=>{const s=selection();saveFile('faostat-explanation.md',`# My FAOSTAT interpretation\n\n${fields.map(id=>`## ${id}\n${$(id).value}`).join('\n\n')}\n\n## Current selection evidence\n${evidence()}\n\n## Provenance\nSource: ${audit.filename}\nSHA-256: ${audit.sha256}\nCountries: ${s.countries.join(', ')}\nYears: ${s.start}–${s.end}\nFood group: Cereals and their products\nDomain: ${audit.domain.join(', ')}\nTransformations: endpoint difference and percent change; no aggregation or imputation.\nAll observations E — Estimated value.\n${methodologyText()}\nAvailability is not measured consumption; national averages hide inequalities; cereals alone do not establish diet quality or share of total energy; changes do not establish causes.\n`,'text/markdown;charset=utf-8');};render();}catch(error){$('status').textContent=`Unable to load data: ${error.message}. Launch using the local server in README.md.`;}
