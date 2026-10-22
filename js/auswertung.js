/* ---------- Testmodus: Tempo im Spiel ×1 / ×5 / ×15 / ×30 ---------- */
race.speed=1;
$('testOn').onchange=()=>{ race.test=$('testOn').checked; };
document.querySelectorAll('#speedBox button').forEach(b=>b.onclick=()=>{ race.speed=+b.dataset.s; document.querySelectorAll('#speedBox button').forEach(x=>x.classList.toggle('sel',x===b)); b.blur(); });

// Sprung im Training (Testmodus): Workout-Zeit als min:s oder Minuten eingeben, Enter – auf geplanten Strecken (Kampagne, Space, Insel) springt auch der Fahrer an den Meter dieser Zeit
$('sprungT').onkeydown=e=>{ e.stopPropagation(); if(e.key!=='Enter') return; const v=e.target.value.trim(), m=v.match(/^(\d+(?:[.,]\d+)?)(?::(\d{1,2}))?$/); e.target.blur();
  if(!m||race.state!=='run'||race.mode!=='train'||me.done) return; const t=Math.min((race.woT||0)-1, m[2]!=null?parseInt(m[1])*60+ +m[2]:parseFloat(m[1].replace(',','.'))*60); // „7:25“ = min:s, „7“ oder „7,5“ = Minuten
  race.t=Math.max(0,t); race.sprung=true; if(R.def.planbar||R.ring) me.d=planD(race.t); camS.init=false;
  const F=anim.tri&&anim.tri.friedel; if(F) F.d=me.d-1.3; flash('Gesprungen auf '+Math.floor(race.t/60)+':'+String(Math.floor(race.t%60)).padStart(2,'0')); };
/* ---------- Fotofinish: beide innerhalb einer Sekunde im Ziel ---------- */
const fmtMs=s=>{ const m=Math.floor(s/60), x=s-m*60; return `${m}:${x.toFixed(3).padStart(6,'0').replace('.',',')}`; };
function finishCheck(){
  if(!(me.done && opp.active && opp.done) || race.photoShown) return false;
  if(Math.abs(me.time-opp.time)>=1) return false;
  race.photoShown=true; race.photoPending=true; flash('📸 Fotofinish!'); setTimeout(showPhoto,1500); return true;
}
function closePhoto(){ $('photo').style.display='none'; race.photoPending=false; showResult(); }
function showPhoto(){
  if(race.state==='setup') return;
  const L=raceLen(), FW=0.86; // Vorderreifen liegt 0,86 m vor dem Fahrer-Bezugspunkt
  const A={r:riders3d[myKey], name:RIDERS[myKey].name, dot:RIDERS[myKey].dot, t:me.time, v:Math.max(me.vf||me.v||8,1), crank:me.crank};
  const B={r:riders3d[oppKey], name:opp.name, dot:RIDERS[oppKey].dot, t:opp.time, v:Math.max(opp.vf||opp.v||A.v,1), crank:opp.crank};
  const [first,second]=A.t<=B.t?[A,B]:[B,A];
  first.d=L; second.d=L-second.v*(second.t-first.t); // Stand in dem Moment, in dem der Erste die Linie berührt
  const lp=(d,u)=>{ if(R.stadium){ const p=trackPt(d,u); return new THREE.Vector3(p[0],p[1]+0.03,p[2]); }
    const hd=headingAt(R,d), [x,z]=posAt(R,d); return new THREE.Vector3(x-Math.sin(hd)*u, roadY(d)+0.12, z+Math.cos(hd)*u); };
  for(const x of [A,B]){ if(x.r.lane==null) x.r.lane=0; putRider(x.r,x.d,x.crank); x.r.tag.visible=false; }
  const uM=(A.r.lane+B.r.lane)/2, F=lp(L+FW,uM), side=lp(L+FW,uM+1).sub(F).setY(0).normalize();
  // Bildausschnitt: Seitenansicht, so dass beide Fahrer drin sind
  const W=1200, H=800, S=2, front=L+FW+0.9, back=second.d-FW-0.9, Hm=Math.max((front-back)/1.5, 2.4), fov=22;
  const C=lp((front+back)/2,uM).add(new THREE.Vector3(0,Hm*0.36,0)), dist=Hm/2/Math.tan(fov/2*Math.PI/180);
  const cam=new THREE.PerspectiveCamera(fov,W/H,0.1,4000); cam.position.copy(C).addScaledVector(side,-dist); cam.lookAt(C); cam.updateMatrixWorld();
  const xf=(lp(L+FW,first.r.lane).add(new THREE.Vector3(0,.34,0)).project(cam).x+1)/2*W; // Linie genau an der Reifenspitze des Siegers
  const rt=new THREE.WebGLRenderTarget(W*S,H*S), col=new Uint8Array(H*S*4), buf=new Uint8Array(W*S*H*S*4);
  const vis=world.children.map(o=>o.visible), bg=scene.background, cc=renderer.getClearColor(new THREE.Color()), ca=renderer.getClearAlpha();
  sky.position.copy(cam.position); renderer.setRenderTarget(rt);
  // 1) ohne Fahrer: die Pixelspalte genau auf der Ziellinie = Hintergrund der Zielkamera (Streifen)
  A.r.g.visible=B.r.g.visible=false; renderer.render(scene,cam);
  renderer.readRenderTargetPixels(rt,Math.round(xf*S),0,1,H*S,col);
  // 2) nur die Fahrer, durchsichtiger Hintergrund
  world.children.forEach(o=>o.visible=(o===A.r.g||o===B.r.g)); A.r.g.visible=B.r.g.visible=true; sky.visible=false; scene.background=null;
  renderer.setClearColor(0x000000,0); renderer.render(scene,cam); renderer.readRenderTargetPixels(rt,0,0,W*S,H*S,buf);
  world.children.forEach((o,i)=>o.visible=vis[i]); sky.visible=true; scene.background=bg; renderer.setClearColor(cc,ca); renderer.setRenderTarget(null); rt.dispose();
  // Zusammensetzen
  const cv2=$('photoCv'), g=cv2.getContext('2d');
  for(let y=0;y<H;y++){ let r=0,gg=0,b=0; for(let k=0;k<S;k++){ const i=((H-1-y)*S+k)*4; r+=col[i]; gg+=col[i+1]; b+=col[i+2]; }
    const n=1+(Math.random()-.5)*.06; g.fillStyle=`rgb(${Math.min(255,r/S*n)|0},${Math.min(255,gg/S*n)|0},${Math.min(255,b/S*n)|0})`; g.fillRect(0,y,W,1); }
  for(let x=0;x<W;x+=2){ g.fillStyle=`rgba(${Math.random()<.5?'255,255,255':'0,0,0'},${(Math.random()*.035).toFixed(3)})`; g.fillRect(x,0,1,H); }
  const tc=document.createElement('canvas'); tc.width=W*S; tc.height=H*S; const tg=tc.getContext('2d'), id=tg.createImageData(W*S,H*S);
  for(let y=0;y<H*S;y++) id.data.set(buf.subarray((H*S-1-y)*W*S*4,(H*S-y)*W*S*4),y*W*S*4);
  tg.putImageData(id,0,0); g.imageSmoothingQuality='high'; g.drawImage(tc,0,0,W,H);
  g.fillStyle='#e3262b'; g.fillRect(Math.round(xf)-1,0,2,H);
  g.fillStyle='rgba(30,32,36,.82)'; g.fillRect(0,0,W,34); g.font='600 17px Barlow, sans-serif'; g.fillStyle='#e8ecef'; g.textAlign='left';
  g.fillText(`Zielkamera · ${R.name}${R.loop?' · '+race.laps+' Runden':''}`,12,23); g.textAlign='right'; g.fillText(fmtMs(first.t),W-12,23);
  const diff=second.t-first.t;
  $('photoTxt').innerHTML=`<div style="font-size:24px;font-weight:700">🏆 ${esc(first.name)} gewinnt – ${de(diff,3)} s Vorsprung</div>
    <table>${[first,second].map((x,i)=>`<tr><td><i style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${x.dot};margin-right:8px"></i>${esc(x.name)}</td><td class="r num">${fmtMs(x.t)}</td><td class="r num">${i?'+'+de(diff,3)+' s':''}</td></tr>`).join('')}</table>`;
  $('photo').style.display='flex';
}
// Bergwertung (gepunktetes Trikot) und Ortsschilder (grünes Trikot): je Fahrer gewonnene von allen Wertungen
const trikotSvg=typ=>{ const P='M8 1L3 3L0 9L4 11L5 8L5 23L21 23L21 8L22 11L26 9L23 3L18 1Q13 5 8 1Z';
  return `<svg width="26" height="24" viewBox="-1 -1 28 26" style="vertical-align:-6px;margin-right:6px">${typ==='berg'?`<defs><pattern id="tpkt" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="#d62828"/></pattern></defs><path d="${P}" fill="#fff"/><path d="${P}" fill="url(#tpkt)" stroke="#222"/>`:`<path d="${P}" fill="#2f9e44" stroke="#222"/>`}</svg>`; };
function wertHtml(){ const W=race.wert||[]; if(!W.length) return ''; const T=['berg','ort'].filter(t=>wertStand(t).n), S={}, J={}; T.forEach(t=>{ S[t]=wertStand(t); J[t]=trikotOf(t); });
  const nm={berg:'Bergwertung',ort:'Ortsschilder'}, cell=(t,k)=>`<td class="r num">${J[t]===k?trikotSvg(t):''}${S[t][k]} / ${S[t].n}</td>`;
  const det=W.length<=8?`<div class="sub" style="margin-top:6px;font-size:14px">${W.map(w=>`${w.typ==='berg'?'⛰️':'🪧'} ${esc(w.name)}: ${w.win?esc(w.win==='me'?RIDERS[myKey].name:opp.name):'offen'}`).join(' · ')}</div>`:'';
  return `<table style="margin-top:14px"><tr><td></td>${T.map(t=>`<td class="r"><b>${nm[t]}</b></td>`).join('')}</tr>${[['me',RIDERS[myKey].name],['opp',opp.name]].map(([k,n])=>`<tr><td>${esc(n)}</td>${T.map(t=>cell(t,k)).join('')}</tr>`).join('')}</table>${det}`; }
function showResult(){
  if(race.state==='setup') return;
  if(race.photoPending) return; // erst das Fotofinish
  race.resultShown=true;
  const avg=me.time?me.wkgSum/me.time:0, myName=RIDERS[myKey].name; let verdict=R.loop?'Alle Runden geschafft – stark gefahren!':R.kalmit?'Allein am Berg – stark gefahren!':'Ziel erreicht – stark gefahren!';
  if(opp.active){ verdict = opp.done ? (me.time<opp.time?(R.kalmit?`🏆 ${myName} holt den KOM!`:`🏆 ${myName} gewinnt!`):`${esc(opp.name)} war schneller.`) : (R.kalmit?`🏆 ${myName} ist zuerst oben!`:`🏆 ${myName} gewinnt!`); }
  const ft=race.photoShown?fmtMs:fmtT, rows=[[ myName, ft(me.time), de(avg,2)+' W/kg' ]];
  if(opp.active) rows.push([opp.name, opp.done?ft(opp.time):'noch unterwegs', opp.done&&opp.avg?de(opp.avg,2)+' W/kg':'']);
  rows.sort((a,b)=>(a[1]==='noch unterwegs')-(b[1]==='noch unterwegs'));
  $('resultCard').innerHTML=`<h1 style="font-size:46px">${verdict}</h1><div class="sub">${esc(R.name)} · ${R.loop?race.laps+' Runden · ':''}${de(raceLen()/1000,1)} km${R.stadium?'':' · '+Math.round(R.gain*(R.loop?race.laps:1))+' Hm'}</div>
    <table>${rows.map(r=>`<tr><td>${esc(r[0])}</td><td class="r num" style="font-size:22px">${r[1]}</td><td class="r">${r[2]}</td></tr>`).join('')}</table>
    ${wertHtml()}
    ${statsHtml()}
    <div class="rowb" style="margin-top:18px"><button class="go" onclick="quitToLobby()">Neues Rennen</button>${tcxBtnHtml()}<button onclick="$('result').style.display='none'">Schließen</button></div>`;
  $('result').style.display='flex';
}

/* ================= Aufzeichnung, Auswertung und TCX-Export =================
   Jede Sekunde ein Messpunkt: Zeit, Distanz, Geschwindigkeit, Watt (Mittel der Sekunde), Puls, Trittfrequenz, Höhe (nur Kalmit).
   Runden in der TCX: Training = jeder Abschnitt, Rundstrecke = jede Runde, Anstieg = eine Runde.
   Keine GPS-Daten – sonst würde Strava die Fahrt in echte Segmente einsortieren. */
const BEST_DUR=[[60,'1 min'],[300,'5 min'],[480,'8 min'],[900,'15 min'],[1200,'20 min'],[1800,'30 min'],[2700,'45 min'],[3600,'60 min']];
const rec={s:[],laps:[],start:null,savedN:0};
function recReset(){ Object.assign(rec,{s:[],laps:[],start:null,savedN:0,sec:0,accE:0,accT:0,hrS:0,hrT:0,cadS:0,cadT:0,maxP:0,maxV:0,lapKey:null,
  mode:race.mode,route:R.name,laps0:race.laps,kg:weight(),ftp:ftp(),sim:live.src==='sim'}); tcxBtns(); }
function recStep(dt,P){
  if(me.done&&!me.free) return; if(!rec.start) rec.start=new Date();
  rec.accE+=P*dt; rec.accT+=dt; rec.maxP=Math.max(rec.maxP,P); rec.maxV=Math.max(rec.maxV,me.v);
  if(live.hr){ rec.hrS+=live.hr*dt; rec.hrT+=dt; } if(live.src!=='sim'&&live.cadence!=null){ rec.cadS+=live.cadence*dt; rec.cadT+=dt; }
  let key, name;
  if(race.mode==='train'){ if(me.done){ key='free'; name='Ausrollen'; } else { const sg=woSeg(race.t); key=race.woSegs.indexOf(sg); name=sg?sg.label:'Abschnitt'; } }
  else if(R.loop){ key=Math.floor(me.d/R.len); name='Runde '+(key+1); } else { key=0; name=R.name; }
  if(key!==rec.lapKey){ rec.lapKey=key; rec.laps.push({i0:rec.s.length,name}); }
  if(race.t>=rec.sec+1){ rec.sec=Math.floor(race.t);
    rec.s.push({t:rec.sec, p:rec.accT?rec.accE/rec.accT:P, hr:rec.hrT>.3?Math.round(rec.hrS/rec.hrT):null, cad:rec.cadT>.3?Math.round(rec.cadS/rec.cadT):null,
      d:race.mode==='train'?me.dist:me.d, v:me.v, alt:R.gpx?elevAt(me.d):null});
    rec.accE=rec.accT=rec.hrS=rec.hrT=rec.cadS=rec.cadT=0;
    if(rec.s.length===5||rec.s.length-rec.savedN===30) tcxBtns(); }
}
function bestAvg(P,D){ if(P.length<D) return null; let s=0; for(let i=0;i<D;i++) s+=P[i]; let b=s; for(let i=D;i<P.length;i++){ s+=P[i]-P[i-D]; if(s>b) b=s; } return b/D; }
function recStats(S=rec.s, d0=0){
  const n=S.length; if(n<1) return null; const P=S.map(x=>x.p), sum=P.reduce((a,b)=>a+b,0), avg=sum/n;
  // Normalized Power: gleitender 30-s-Schnitt, hoch 4, gemittelt, vierte Wurzel
  let np=avg; if(n>=30){ let w=0, acc=0; for(let i=0;i<n;i++){ w+=P[i]; if(i>=30) w-=P[i-30]; if(i>=29) acc+=Math.pow(w/30,4); } np=Math.pow(acc/(n-29),.25); }
  const hrs=S.filter(x=>x.hr), cads=S.filter(x=>x.cad>0); let gain=0; for(let i=1;i<n;i++) if(S[i].alt!=null&&S[i-1].alt!=null&&S[i].alt>S[i-1].alt) gain+=S[i].alt-S[i-1].alt;
  const f=rec.ftp||ftp(), IF=np/f;
  return {n, dist:Math.max(0,S[n-1].d-d0), avg, max:Math.max(...P), np, IF, tss:n*np*IF/(f*3600)*100, vi:avg?np/avg:1, kj:sum/1000,
    hrAvg:hrs.length?hrs.reduce((a,x)=>a+x.hr,0)/hrs.length:null, hrMax:hrs.length?Math.max(...hrs.map(x=>x.hr)):null,
    cad:cads.length?cads.reduce((a,x)=>a+x.cad,0)/cads.length:null, vMax:Math.max(...S.map(x=>x.v)), gain, best:BEST_DUR.map(([D,l])=>({l,w:bestAvg(P,D)}))}; }
// Große Übersicht für den Ergebnisbildschirm
function statsHtml(){
  const st=recStats(); if(!st||st.n<5) return '';
  const kg=rec.kg||weight(), max=Math.max(st.max,rec.maxP||0), vmax=Math.max(st.vMax,rec.maxV||0)*3.6;
  const tile=(k,v,u='')=>`<div class="st"><div class="k">${k}</div><div class="v num">${v}<small>${u}</small></div></div>`;
  const tiles=[tile('Dauer',fmtT(st.n)), tile('Distanz',de(st.dist/1000,2),' km'), tile('Ø Geschwindigkeit',de(st.dist/st.n*3.6,1),' km/h'), tile('Max. Geschwindigkeit',de(vmax,1),' km/h'),
    tile('Ø Watt',Math.round(st.avg),' W'), tile('Ø W/kg',de(st.avg/kg,2)), tile('Höchste Watt',Math.round(max),' W'), tile('Normalized Power',Math.round(st.np),' W'),
    tile('Ø Puls',st.hrAvg?Math.round(st.hrAvg):'–',st.hrAvg?' bpm':''), tile('Max. Puls',st.hrMax||'–',st.hrMax?' bpm':''),
    tile('Ø Trittfrequenz',st.cad?Math.round(st.cad):'–',st.cad?' U/min':''), tile('Arbeit',Math.round(st.kj),' kJ'),
    tile('Intensität (IF)',de(st.IF,2)), tile('TSS',Math.round(st.tss)), tile('Variabilität (VI)',de(st.vi,2)), tile('Höhenmeter',st.gain>1?Math.round(st.gain):'–',st.gain>1?' m':'')];
  const best=`<table class="bests"><tr><td class="small">Bestleistung</td>${st.best.map(b=>`<td class="r small">${b.l}</td>`).join('')}</tr>
    <tr><td>Watt</td>${st.best.map(b=>`<td class="r num">${b.w?Math.round(b.w):'–'}</td>`).join('')}</tr>
    <tr><td>W/kg</td>${st.best.map(b=>`<td class="r num">${b.w?de(b.w/kg,2):'–'}</td>`).join('')}</tr></table>`;
  return `<div class="stats">${tiles.join('')}</div>${best}<div class="small">IF und TSS mit FTP ${rec.ftp||ftp()} W · Gewicht ${kg} kg${rec.sim?' · gefahren mit dem Simulationsregler':''}</div>`;
}
const xesc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function rideNote(st){
  const parts=['Kalmit-Duell', (MODES[rec.mode]||{}).title||rec.mode, rec.route+(rec.mode==='loop'?` (${rec.laps0} Runden)`:'')];
  if(rec.mode==='train') parts.push(race.woKind==='ramp'?'FTP-Rampentest':race.woKind==='t20'?'20-Minuten-Test':'Workout');
  else if(opp.active){ const place=me.done&&(!opp.done||me.time<opp.time)?1:me.done?2:null; parts.push(`gegen ${opp.name}${opp.bot?' (Bot)':''}`+(place?` · Platz ${place}`:'')); }
  if(me.ftpRes) parts.push(`neue FTP ${me.ftpRes} W`);
  return parts.join(' · ')+`\nØ ${Math.round(st.avg)} W · NP ${Math.round(st.np)} W · IF ${de(st.IF,2)} · TSS ${Math.round(st.tss)} · ${Math.round(st.kj)} kJ`
    +(st.best.some(b=>b.w)?'\nBestleistungen: '+st.best.filter(b=>b.w).map(b=>`${b.l} ${Math.round(b.w)} W`).join(' · '):'');
}
function tcxXml(){
  const S=rec.s, t0=rec.start?rec.start.getTime():Date.now()-S.length*1000, iso=ms=>new Date(ms).toISOString().replace(/\.\d{3}Z$/,'Z'), st=recStats(), f1=x=>x.toFixed(1);
  const laps=rec.laps.filter((l,i)=>l.i0<S.length&&(rec.laps[i+1]?rec.laps[i+1].i0:S.length)>l.i0);
  const lapXml=laps.map((l,i)=>{ const i1=i+1<laps.length?laps[i+1].i0:S.length, L=S.slice(l.i0,i1), dPrev=l.i0?S[l.i0-1].d:0, q=recStats(L,dPrev), dist=q.dist;
    const tps=L.map(x=>`          <Trackpoint>
            <Time>${iso(t0+x.t*1000)}</Time>${x.alt!=null?`
            <AltitudeMeters>${f1(x.alt)}</AltitudeMeters>`:''}
            <DistanceMeters>${f1(x.d)}</DistanceMeters>${x.hr?`
            <HeartRateBpm><Value>${x.hr}</Value></HeartRateBpm>`:''}${x.cad!=null?`
            <Cadence>${Math.min(254,x.cad)}</Cadence>`:''}
            <Extensions><ns3:TPX><ns3:Speed>${x.v.toFixed(2)}</ns3:Speed><ns3:Watts>${Math.round(x.p)}</ns3:Watts></ns3:TPX></Extensions>
          </Trackpoint>`).join('\n');
    return `      <Lap StartTime="${iso(t0+(L[0].t-1)*1000)}">
        <TotalTimeSeconds>${L.length}</TotalTimeSeconds>
        <DistanceMeters>${f1(dist)}</DistanceMeters>
        <MaximumSpeed>${q.vMax.toFixed(2)}</MaximumSpeed>
        <Calories>${Math.round(q.kj)}</Calories>${q.hrAvg?`
        <AverageHeartRateBpm><Value>${Math.round(q.hrAvg)}</Value></AverageHeartRateBpm>
        <MaximumHeartRateBpm><Value>${q.hrMax}</Value></MaximumHeartRateBpm>`:''}
        <Intensity>Active</Intensity>${q.cad?`
        <Cadence>${Math.round(q.cad)}</Cadence>`:''}
        <TriggerMethod>Manual</TriggerMethod>
        <Track>
${tps}
        </Track>
        <Notes>${xesc(l.name)}</Notes>
        <Extensions><ns3:LX><ns3:AvgSpeed>${(dist/L.length).toFixed(2)}</ns3:AvgSpeed><ns3:AvgWatts>${Math.round(q.avg)}</ns3:AvgWatts><ns3:MaxWatts>${Math.round(q.max)}</ns3:MaxWatts></ns3:LX></Extensions>
      </Lap>`; }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2" xmlns:ns3="http://www.garmin.com/xmlschemas/ActivityExtension/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Activities>
    <Activity Sport="Biking">
      <Id>${iso(t0)}</Id>
${lapXml}
      <Notes>${xesc(rideNote(st))}</Notes>
    </Activity>
  </Activities>
</TrainingCenterDatabase>
`; }
function tcxName(){ const d=rec.start||new Date(), z=x=>String(x).padStart(2,'0');
  return `kalmit-duell_${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}_${(rec.route||'fahrt').toLowerCase().replace(/[^a-z0-9äöüß]+/g,'-')}.tcx`; }
function downloadTcx(){
  if(rec.s.length<5) return; const name=tcxName();
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([tcxXml()],{type:'application/vnd.garmin.tcx+xml'})); a.download=name; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },2000); rec.savedN=rec.s.length; tcxBtns(); flash('TCX gespeichert: '+name); }
const tcxUnsaved=()=>rec.s.length-rec.savedN>=30; // mehr als 30 s nicht gespeichert
const tcxLabel=()=>rec.savedN>0&&!tcxUnsaved()?'✓ TCX gespeichert':'⬇ TCX für Strava';
const tcxBtnHtml=()=>rec.s.length>=5?`<button class="tcxBtn">${tcxLabel()}</button>`:'';
function tcxBtns(){ const has=rec.s.length>=5;
  document.querySelectorAll('.tcxBtn').forEach(b=>{ b.style.display=has?'':'none'; b.textContent=tcxLabel(); });
  const L=$('lastRide'); if(L) L.style.display=race.state==='setup'&&has&&tcxUnsaved()?'flex':'none'; }
document.addEventListener('click',e=>{ if(e.target.closest('.tcxBtn')) downloadTcx(); });
addEventListener('beforeunload',e=>{ if(tcxUnsaved()){ e.preventDefault(); e.returnValue=''; } }); // Rückfrage, solange die Fahrt nicht gespeichert ist

