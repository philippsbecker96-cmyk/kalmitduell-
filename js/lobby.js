/* ================= Lobby ================= */
function profileCanvas(cv2, segs){
  const g=cv2.getContext('2d'), w=cv2.width, h=cv2.height; g.clearRect(0,0,w,h);
  const L=segs.reduce((a,s)=>a+s.len,0); let e=0, max=1; segs.forEach(s=>{ e+=s.len*s.g/100; max=Math.max(max,e); });
  let d=0; e=0; segs.forEach(s=>{ const e1=e+s.len*s.g/100, xa=d/L*w, xb=(d+s.len)/L*w+.6;
    g.fillStyle=gradeColor(s.g); g.beginPath(); g.moveTo(xa,h); g.lineTo(xa,h-2-e/max*(h-6)); g.lineTo(xb,h-2-e1/max*(h-6)); g.lineTo(xb,h); g.fill(); d+=s.len; e=e1; });
}
function ovalCanvas(cv2){ const g=cv2.getContext('2d'), w=cv2.width, h=cv2.height; g.clearRect(0,0,w,h);
  const rr=h*0.38, cx=w/2, cy=h/2, L=rr*2.3; g.lineWidth=13; g.strokeStyle='#c2553c'; g.beginPath(); g.moveTo(cx-L/2,cy-rr); g.lineTo(cx+L/2,cy-rr); g.arc(cx+L/2,cy,rr,-Math.PI/2,Math.PI/2); g.lineTo(cx-L/2,cy+rr); g.arc(cx-L/2,cy,rr,Math.PI/2,Math.PI*1.5); g.stroke();
  g.fillStyle='#4f933a'; g.fillRect(cx-L/2-rr*0.55,cy-rr*0.62,L+rr*1.1,rr*1.24); g.strokeStyle='#fff'; g.lineWidth=1.5; g.strokeRect(cx-L/2-rr*0.55,cy-rr*0.62,L+rr*1.1,rr*1.24); g.beginPath(); g.moveTo(cx,cy-rr*.62); g.lineTo(cx,cy+rr*.62); g.stroke(); }
function spaceCanvas(cv2, def){ // Höhenprofil der Space-Strecke in Bahnfarben
  const g=cv2.getContext('2d'), w=cv2.width, h=cv2.height; g.clearRect(0,0,w,h); g.fillStyle='#070915'; g.fillRect(0,0,w,h);
  const S=def.segs.filter(s=>s.p>=0), L=S.reduce((a,s)=>a+s.len,0)||1; let e=0, lo=0, hi=0; S.forEach(s=>{ e+=s.len*s.g/100; lo=Math.min(lo,e); hi=Math.max(hi,e); });
  const sp=Math.max(1,hi-lo), Y=v=>h-4-(v-lo)/sp*(h-12); g.fillStyle='rgba(255,255,255,.8)'; for(let i=0;i<40;i++) g.fillRect((i*73)%w,(i*37)%h,1,1);
  let d=0; e=0; S.forEach(s=>{ const e1=e+s.len*s.g/100, xa=d/L*w, xb=(d+s.len)/L*w+.6; g.fillStyle=SPACE_COL(s.p); g.beginPath(); g.moveTo(xa,h); g.lineTo(xa,Y(e)); g.lineTo(xb,Y(e1)); g.lineTo(xb,h); g.fill(); d+=s.len; e=e1; });
}
function renderRouteList(){
  if(race.mode==='train' && race.role!=='guest'){ GEN_IDS.forEach(id=>genEntry(id)); if(GEN_IDS.includes(routeId)){ const e=genEntry(routeId); if(R && R.def!==e.def){ setRoute(e.def); sendRoute(); return; } } } // Workout geändert → Strecke neu
  if(race.kamp){ const e=kampRoute(); if(routeId!==e.id||!R||R.def!==e.def){ routeId=e.id; setRoute(e.def); return; } } // Kampagne: Strecke passt zu Mission, Stufe, FTP und Gewicht
  const box=$('routeList'), guest=race.role==='guest', list=race.kamp?[kampRoute()]:race.mode==='train'?ROUTES.filter(r=>guest?r.id==='host':r.id!=='host'&&!r.noTrain):ROUTES.filter(r=>r.mode===race.mode);
  box.innerHTML=list.map(r=>{ const L=r.def.segs.reduce((a,s)=>a+s.len,0), hm=r.def.segs.reduce((a,s)=>a+Math.max(0,s.len*s.g/100),0);
    const info=r.def.island?`${de(r.def.goal/1000,1)} km · Sand und Wasser in den harten Abschnitten · danach endlos ums Atoll (5 km)`:r.def.space?`${de((L-r.def.ring)/1000,1)} km · ${Math.round(hm)} Hm · danach endlos in der Umlaufbahn`:r.def.stadium?Math.round(L)+' m pro Runde':r.def.loop?de(L/1000,1)+' km pro Runde · '+Math.round(hm)+' Hm':de(L/1000,1)+' km · '+Math.round(hm)+' Hm';
    return `<button class="route${r.id===routeId?' sel':''}" data-id="${r.id}" ${guest?'disabled':''}><canvas width="300" height="92"></canvas><div><b>${esc(r.title)}</b><span>${esc(r.sub)} · ${info}</span></div></button>`; }).join('')
    + (race.mode==='train'?'':`<div class="route soon"><div class="ph">folgt</div><div><b>${list.length?'Weitere Strecken':'Noch keine Strecke'}</b><span>${MODES[race.mode].soon}</span></div></div>`);
  box.querySelectorAll('button.route').forEach(b=>{ const r=ROUTES.find(x=>x.id===b.dataset.id); r.def.stadium?ovalCanvas(b.querySelector('canvas')):r.def.space?spaceCanvas(b.querySelector('canvas'), r.def):r.def.island?islandCanvas(b.querySelector('canvas'), r.def):profileCanvas(b.querySelector('canvas'), r.def.segs);
    b.onclick=()=>{ if(routeId===r.id) return; routeId=r.id; setRoute(r.def); sendRoute(); }; });
  const ok=list.some(r=>r.id===routeId) && R && R.def===list.find(r=>r.id===routeId).def;
  $('todBox').style.display=ok&&!R.space?'':'none'; $('todNight').style.display=ok&&R.stadium?'':'none'; $('rainOn').closest('.opt').style.display=ok?'':'none'; $('seaBox').style.display=ok&&!R.stadium&&!R.island&&!R.def.burg?'':'none'; document.querySelectorAll('.sea').forEach(b=>b.disabled=race.role==='guest'); // draußen nur Tag/Abend
  if(ok&&!R.stadium&&race.tod==='nacht'){ race.tod='abend'; document.querySelectorAll('.tod').forEach(b=>b.classList.toggle('sel',b.dataset.tod==='abend')); } document.querySelectorAll('.tod').forEach(b=>b.disabled=race.role==='guest'); $('rainOn').disabled=race.role==='guest';
  if(race.kamp){ const T=woTotal(), on=!!(conn&&conn.open); if(race.tod!=='abend'){ race.tod='abend'; document.querySelectorAll('.tod').forEach(b=>b.classList.toggle('sel',b.dataset.tod==='abend')); applyEnv(); } $('todBox').style.display='none'; /* Kampagne: immer Abenddämmerung */ $('routeSub').textContent=ok?`Mission ${race.kamp.nr}: ${race.kamp.titel} · ${KST.stufe==='hart'?'Hart':'Leicht'} · Workout ${fmtT(T)} · Trainer hält die Watt (ERG) · ${R.def.planbar?`${R.name} · ${de(R.len/1000,1)} km, aus deinem Workout berechnet`:`Platzhalter-Strecke ${R.name} in Dauerschleife`}`:'';
    $('lapsInfo').textContent=''; $('btnStart').disabled=!ok||on||!KST.stand||!!race.kamp.bald||T<10;
    $('startHint').textContent=on?'Die Kampagne gibt es nur allein – nicht online.':!KST.stand?'Wähle zuerst, ob du Bauer oder Bäuerin bist.':'Die Tafeln laufen schon im Einfahren – einfach locker treten.'; return; }
  if(race.mode==='train'){ const T=woTotal(); $('routeSub').textContent = ok ? R.space?`Space-Strecke aus dem Workout · Steigung je nach Intensität · Schub ab 80 % FTP · Workout ${fmtT(T)} · Trainer hält die Watt (ERG)`:R.island?`Insel-Strecke aus dem Workout · Untergrund je nach Intensität · Workout ${fmtT(T)} · Trainer hält die Watt (ERG)`:`${R.name} in Dauerschleife · Workout ${fmtT(T)} · Trainer hält die Watt (ERG)` : 'Strecke wählen';
    $('lapsInfo').textContent=''; $('btnStart').disabled = race.role==='guest' || !ok || T<10;
    if(race.role!=='guest') $('startHint').textContent = T<10 ? 'Das Workout ist noch leer.' : 'Wer das Training erstellt, startet für beide.'; return; }
  $('routeSub').textContent = ok ? (R.loop?`${R.name} · ${R.stadium?Math.round(R.len)+' m pro Runde · flach mit Steilkurven':de(R.len/1000,1)+' km pro Runde · '+Math.round(R.gain)+' Höhenmeter'}${race.tod==='nacht'?' · Abendspiel mit Flutlicht':race.tod==='abend'?' · Abenddämmerung':''}${race.rain?' · Regen':''}${race.season==='herbst'&&!R.stadium?' · Herbst':''} · gewertet in Watt pro Kilo`:`${R.name} · ${de(R.len/1000,1)} km · ${Math.round(R.gain)} Höhenmeter${race.tod!=='tag'?' · Sonnenuntergang':''}${race.rain?' · Regen':''}${R.def.burg&&race.tod==='tag'?' · Morgennebel':''}${race.season==='herbst'&&!R.island&&!R.def.burg?' · Herbst':''} · gewertet in Watt pro Kilo`) : MODES[race.mode].soon;
  $('lapsInfo').textContent = race.mode==='loop' && ok ? `${race.laps} × ${Math.round(R.len)} m = ${de(R.len*race.laps/1000,1)} km` : '';
  $('btnStart').disabled = race.role==='guest' || !ok;
  if(race.role!=='guest') $('startHint').textContent = ok ? 'Wer das Rennen erstellt, startet für beide.' : 'Für diesen Modus gibt es noch keine Strecke.';
}
function openMode(m){
  const kp=m==='kamp'; $('modeTitle').textContent=MODES[m].title; if(kp) m='train'; race.kamp=kp?kampMission():null; $('kampBlock').style.display=kp?'':'none'; if(kp) kampUi(); $('windLvl').closest('.block').style.display=kp?'none':''; // Kampagne = Training mit fester Mission, ohne Wind und Windschatten
  race.mode=m; $('lapsBox').style.display=m==='loop'?'flex':'none'; $('lapsV').textContent=race.laps;
  const tr=m==='train'; $('woBlock').style.display=tr?'':'none'; $('ergRow').style.display=tr?'':'none'; $('botRow').style.display=tr?'none':''; $('botStyleRow').style.display=tr?'none':'';
  $('oppTitle').textContent=tr?'Mitfahrer':'Gegner'; $('btnStart').textContent=kp?'Mission starten':tr?'Training starten':'Rennen starten'; if(tr) renderWo();
  const first=kp?null:ROUTES.find(r=>r.mode===m); // Kampagne: Strecke setzt renderRouteList if(first && routeId!==first.id && race.role!=='guest'){ routeId=first.id; setRoute(first.def); }
  $('modeScreen').style.display='none'; $('cfgScreen').style.display=''; renderRouteList(); sendCfg();
}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{ if(b.dataset.m==='kamp'&&!kampOffen()&&!kampCode()) return; openMode(b.dataset.m); }); // Kampagne nur mit Code (kampagne.js)
// Zurück zur Modus-Auswahl (oben und unten); als Gast verlässt man damit den Raum
$('btnBack').onclick=$('btnBack2').onclick=()=>{ if(race.role==='guest'){ quitToLobby(); return; } $('cfgScreen').style.display='none'; $('modeScreen').style.display=''; scrollTo(0,0); };
const setLaps=n=>{ race.laps=Math.max(1,Math.min(30,n)); $('lapsV').textContent=race.laps; renderRouteList(); sendCfg(); };
$('lapMinus').onclick=()=>setLaps(race.laps-1); $('lapPlus').onclick=()=>setLaps(race.laps+1);
$('draftOn').onchange=()=>{ race.draft=$('draftOn').checked; draftLabel(); sendCfg(); };
function draftLabel(){ $('draftLbl').textContent=$('draftOn').checked?'An – dicht hinter dem Gegner brauchst du weniger Watt':'Aus – jeder fährt im Wind'; }
function renderRiderCards(){ document.querySelectorAll('.rcard').forEach(c=>{ const R2=RIDERS[c.dataset.k]; c.querySelector('b').textContent=R2.name; c.querySelector('span').textContent=R2.desc; });
  document.querySelectorAll('.redit').forEach(b=>b.disabled=!!remoteLooks[b.dataset.k]); fillBotSelect(); }
function fillBotSelect(){ const sl=$('botRider'); if(botKey===myKey) botKey=RKEYS.find(k=>k!==myKey);
  sl.innerHTML=RKEYS.filter(k=>k!==myKey).map(k=>`<option value="${k}"${k===botKey?' selected':''}>als ${esc(RIDERS[k].name)}</option>`).join(''); }
function selectRider(k){
  myKey=k; document.querySelectorAll('.rcard').forEach(c=>{ c.classList.toggle('sel',c.dataset.k===k); });
  fillBotSelect(); if(!(conn&&conn.open)) oppKey=botKey; opp.name=RIDERS[oppKey].name;
  if(race.role==='host') sendCfg(); if(race.role==='guest') send({t:'hello',rider:myKey,look:LOOKS[myKey]});
  if(world&&R&&R.def&&R.def.ma&&KST.stand==='baeuerin') rebuildRiders(); // Kampagne: Rock und Kopftuch wandern zum neu gewählten Fahrer
}
document.querySelectorAll('.rcard').forEach(c=>c.onclick=()=>{ if(c.classList.contains('taken')) return; selectRider(c.dataset.k); });
$('botRider').onchange=()=>{ botKey=$('botRider').value; if(!(conn&&conn.open)){ oppKey=botKey; opp.name=RIDERS[oppKey].name; } };
/* ---------- Fahrer-Editor ---------- */
const ED={key:null,look:null,r:null};
const ED_FIELDS=[['name','Name','text'],['ui','Kennfarbe (Schild, Karte)','color'],['build','Körperbau: klein/breit ↔ groß/schlank','range'],
  ['helmet','Helm','color'],['jersey','Trikot / Jacke','color'],['sleeve','Ärmel','color'],['zigzag','Zickzack auf den Ärmeln','check'],['longSleeve','Lange Ärmel','check'],['hem','Farbiger Trikotsaum (Ärmelfarbe)','check'],
  ['pants','Hose','color'],['socks','Socken','color'],['shoes','Schuhe','color'],['frame','Rahmen','color'],['accent','Akzent am Rad','color'],['tape','Lenkerband','color'],
  ['glasses','Brille','sel',[['helm','steckt im Helm'],['nase','auf der Nase'],['keine','keine']]],['cap','Weiße Kappe unter dem Helm','check'],['bag','Satteltasche','sel',[['gross','groß'],['klein','klein'],['keine','keine']]]];
function edPreview(){ if(ED.r) prev.sc.remove(ED.r.g); ED.r=makeRider(ED.key,ED.look); ED.r.tag.visible=false; ED.r.g.visible=false; prev.sc.add(ED.r.g); }
function edForm(){ $('edForm').innerHTML=ED_FIELDS.map(([f,lab,typ,opts])=>{ const v=ED.look[f];
    const inp=typ==='text'?`<input type="text" data-f="${f}" maxlength="16" value="${esc(v)}">`:typ==='color'?`<input type="color" data-f="${f}" value="${v}">`:
      typ==='range'?`<input type="range" data-f="${f}" min="0" max="100" value="${Math.round(v*100)}">`:typ==='check'?`<input type="checkbox" data-f="${f}"${v?' checked':''}>`:
      `<select data-f="${f}">${opts.map(([o,t])=>`<option value="${o}"${o===v?' selected':''}>${t}</option>`).join('')}</select>`;
    return `<label class="ef${typ==='text'||typ==='range'?' wide':''}"><span>${lab}</span>${inp}</label>`; }).join(''); }
function openEditor(k){ ED.key=k; ED.look={...LOOKS[k]}; $('edTitle').textContent=`${RIDERS[k].name} bearbeiten`; edForm(); edPreview(); $('editor').style.display='flex'; }
function closeEditor(){ $('editor').style.display='none'; if(ED.r) prev.sc.remove(ED.r.g); ED.r=null; ED.key=null; }
$('edForm').addEventListener('input',e=>{ const f=e.target.dataset.f; if(!f) return; const el=e.target;
  ED.look[f]=el.type==='checkbox'?el.checked:el.type==='range'?el.value/100:el.value; edPreview(); });
document.querySelectorAll('.redit').forEach(b=>b.onclick=()=>{ if(!b.disabled) openEditor(b.dataset.k); });
$('edCancel').onclick=closeEditor;
$('edReset').onclick=()=>{ ED.look={...LOOK_DEF[ED.key]}; edForm(); edPreview(); };
$('edSave').onclick=()=>{ const k=ED.key; if(!String(ED.look.name||'').trim()) ED.look.name=LOOK_DEF[k].name; LOOKS[k]={...ED.look}; saveLooks(); closeEditor(); rebuildRiders(); opp.name=RIDERS[oppKey].name;
  if(k===myKey){ if(race.role==='host') sendCfg(); if(race.role==='guest') send({t:'hello',rider:myKey,look:LOOKS[myKey]}); } };
function setTod(tod,tell=true){ race.tod=['tag','abend','nacht'].includes(tod)?tod:'tag'; document.querySelectorAll('.tod').forEach(b=>b.classList.toggle('sel',b.dataset.tod===race.tod)); applyEnv(); renderRouteList(); if(tell) sendCfg(); }
// Jahreszeit (Kalmit, Südpfalz): Farben werden beim Aufbau gesetzt – beim Wechsel wird die Welt neu gebaut
function setSeason(s,tell=true){ s=s==='herbst'?'herbst':'sommer'; document.querySelectorAll('.sea').forEach(b=>b.classList.toggle('sel',b.dataset.sea===s)); if(s!==race.season){ race.season=s; if(R&&!R.stadium&&!R.space&&!R.island){ camS.init=false; build3D(); applyEnv(); } renderRouteList(); } if(tell) sendCfg(); }
document.querySelectorAll('.sea').forEach(b=>b.onclick=()=>{ if(race.role!=='guest') setSeason(b.dataset.sea); });
function setRain(on,tell=true){ race.rain=!!on; $('rainOn').checked=race.rain; applyEnv(); renderRouteList(); if(tell) sendCfg(); }
document.querySelectorAll('.tod').forEach(b=>b.onclick=()=>{ if(race.role!=='guest') setTod(b.dataset.tod); }); $('rainOn').onchange=()=>{ if(race.role!=='guest') setRain($('rainOn').checked); };
$('windLvl').onchange=()=>{ race.wind=+$('windLvl').value; sendCfg(); };
function sendCfg(){ if(race.role==='host') send({t:'cfg',rider:myKey,season:race.season,draft:$('draftOn').checked,wind:+$('windLvl').value,mode:race.mode,laps:race.laps,tod:race.tod,rain:race.rain,look:LOOKS[myKey],wo:race.mode==='train'?WO:null}); }

/* Lobby-Hintergrund: Pfälzer Weinberge im Herbst, dahinter der Pfälzerwald */
function lobbyBackdrop(){
  const rnd=rng(7), r=()=>rnd(); let s='<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>'+
    '<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9fbf"/><stop offset=".55" stop-color="#c9d6df"/><stop offset="1" stop-color="#eef0ea"/></linearGradient>'+
    '<radialGradient id="sun" cx="0.2" cy="0.18" r="0.45"><stop offset="0" stop-color="#fff8e6" stop-opacity=".95"/><stop offset="1" stop-color="#fff8e6" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="cl"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".6" stop-color="#e6e9ee" stop-opacity=".75"/><stop offset="1" stop-color="#cdd3dc" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="cd"><stop offset="0" stop-color="#6d7584" stop-opacity=".75"/><stop offset="1" stop-color="#6d7584" stop-opacity="0"/></radialGradient>'+
    '<linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3cf4a"/><stop offset="1" stop-color="#c9921e"/></linearGradient></defs>'+
    '<rect width="1600" height="900" fill="url(#sk)"/><rect width="1600" height="900" fill="url(#sun)"/>';
  for(let i=0;i<40;i++){ const x=r()*1700-50, y=60+r()*300, rx=80+r()*170, ry=30+r()*55; s+=`<ellipse cx="${x}" cy="${y+ry*.4}" rx="${rx*1.1}" ry="${ry*.8}" fill="url(#cd)"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#cl)"/>`; }
  const ridge=(base,amp,col,seed)=>{ let p=`M0 900 L0 ${base}`; for(let x=0;x<=1600;x+=40){ const y=base-amp*(Math.sin(x/170+seed)*.5+Math.sin(x/63+seed*2)*.25+Math.sin(x/360+seed*.7)*.6); p+=` L${x} ${y.toFixed(1)}`; } return `<path d="${p} L1600 900 Z" fill="${col}"/>`; };
  s+=ridge(470,80,'#5d6e78',1.3)+ridge(505,95,'#3c5246',4.1)+ridge(540,60,'#2f4636',2.2);
  // Felder-Flickenteppich in Perspektive
  const pal=['#d9b443','#c99a2a','#e5c75a','#a3ab4a','#7f9a3f','#b8862e','#9c5a2a','#e2cf6e','#6f8a3a'];
  for(let row=0, y=545; row<9; row++){ const hgt=10+row*7; let x=-40; while(x<1640){ const w=60+r()*140+row*30; s+=`<path d="M${x} ${y} L${x+w} ${y} L${x+w+row*6} ${y+hgt} L${x-row*6} ${y+hgt} Z" fill="${pal[Math.floor(r()*pal.length)]}"/>`;
      if(r()<.5) for(let k=1;k<5;k++) s+=`<line x1="${x+w*k/5}" y1="${y}" x2="${x+w*k/5+(k-2.5)*row}" y2="${y+hgt}" stroke="rgba(70,60,20,.25)" stroke-width="1.5"/>`; x+=w; } y+=hgt; }
  for(let i=0;i<34;i++){ const x=r()*1600, y=548+r()*80, rr=6+r()*14; s+=`<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr*.8}" fill="${r()<.5?'#3f5a2c':'#566e35'}"/>`; }
  // Rebzeilen im Vordergrund, goldgelb, Richtung Fluchtpunkt
  s+='<rect x="0" y="690" width="1600" height="210" fill="#596b2c"/>';
  const vx=820, vy=600;
  for(let i=-16;i<=16;i++){ const bx=vx+i*130; const pts=[]; for(let t=.18;t<=1.05;t+=.035){ const x=vx+(bx-vx)*t, y=vy+(1000-vy)*t; if(y<690) continue; pts.push([x,y,t]); }
    pts.forEach(([x,y,t])=>{ const rr=7+t*30; s+=`<ellipse cx="${(x+(r()-.5)*rr*.6).toFixed(1)}" cy="${(y-rr*.55).toFixed(1)}" rx="${(rr*1.15).toFixed(1)}" ry="${(rr*.75).toFixed(1)}" fill="${['url(#vg)','#e9b93a','#d9a427','#f2d35e','#b98a2a'][Math.floor(r()*5)]}"/>`; if(r()<.25) s+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y-rr*1.6}" stroke="#4a4d50" stroke-width="${1+t*3}"/>`; }); }
  s+='</svg>'; $('backdrop').innerHTML=s;
}

