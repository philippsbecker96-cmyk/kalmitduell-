/* ================= Südpfalz-Klassiker: andere Radfahrer =================
   Rennradgruppe (entgegen, Zweierreihe, der Erste grüßt) · Vereinstreff (entgegen, alle im gleichen Trikot) · Zeitfahrerin (entgegen, Aero) ·
   Pendler mit Packtaschen und Rentnerpaar auf E-Bikes (vor dir, zum Überholen; am nächsten Anstieg schnappt dich einer der beiden mit getuntem Motor) ·
   Familie mit Kind und Anhänger auf dem Radweg (hält an seinem Ende an) · Berg-Rivale am Anstieg nach Leinsweiler (hängt sich an dich, geht vorbei, gibt Windschatten, lässt erst abreißen, wenn du über 110 % FTP trittst).
   Plätze pro Runde gewürfelt aus den Abschnitten `radler` in suedpfalzDef (strecke.js), jedes Mal neu bei einem neuen Rennen. Bei Regen nur Pendler und Rivale.
   Jeder Rechner hat seine eigenen Radler (online nicht abgeglichen), Windschatten vom Rivalen nur für den eigenen Fahrer.
   buildRadler aus build3D · poseRadler aus draw (rennen.js) · radlerSpur aus lanes (rennen.js: links überholen, rechts Platz für Entgegenkommende) · radlerWind aus simStep */
const RL_ARTEN={ // n Fahrer · Art der Bewegung · Watt · kg · CdA-Faktor · Abschnitt in R.def.radler
  gruppe:{n:5, typ:'gegen', P:210, kg:72, cw:.9, ab:'gegen'}, verein:{n:6, typ:'gegen', P:190, kg:75, cw:.9, ab:'gegen'}, zeit:{n:1, typ:'gegen', P:230, kg:60, cw:.72, ab:'gegen'},
  pendler:{n:1, typ:'vorn', P:140, kg:80, cw:1.25, ab:'vorn'}, rentner:{n:2, typ:'vorn', P:330, kg:85, cw:1.3, ab:'rentner'}, familie:{n:3, typ:'weg', ab:'radweg'}, rivale:{n:1, typ:'rivale', kg:70, cw:1, ab:'berg'}};
const RL_SICHT=700, RL_LOS=720, RL_NAH=300; // tauchen 720 m vor dir auf, sichtbar ab 700 m (klein und im Dunst) · Pedale und Arme erst ab 300 m
const rlSm=v=>{ v=Math.min(1,Math.max(0,v)); return v*v*(3-2*v); };

// Tempo bei P Watt und g % Steigung (Gleichgewicht aus Hangabtrieb, Rollwiderstand und Luft), per Halbierung
function rlV(P,kg,g,cw){ const M=kg+BIKE_KG, th=Math.atan(g/100), a=M*G*(Math.sin(th)+CRR*Math.cos(th)), c=.5*RHO*cdaOf(kg)*cw; let lo=0,hi=25;
  for(let i=0;i<22;i++){ const m=(lo+hi)/2; if(m*(a+c*m*m)<P) lo=m; else hi=m; } return lo; }

// ---- Aufbau (aus build3D) ----
function rlLook(o){ return Object.assign({},LOOK_DEF.gegner,{ui:'#888',bag:'keine',zigzag:false,cap:false,glasses:'nase'},o); }
function rlFahrer(L,s){ const r=makeRider('gegner',rlLook(L),false); r.tag.visible=false; r.g.visible=false; if(s) r.g.scale.multiplyScalar(s); world.add(r.g); r.crank=Math.random()*6; return r; }
function buildRadler(){ const M=c=>new THREE.MeshLambertMaterial({color:c}), q=rng(2024), F={};
  const bunt=['#c92a2a','#1971c2','#f08c00','#2b8a3e','#5f3dc4','#e64980','#0b7285','#212529'], helm=['#f8f9fa','#212529','#e03131','#1c7ed6'], pk=a=>a[Math.floor(q()*a.length)];
  F.gruppe=[...Array(5)].map(()=>{ const j=pk(bunt); return rlFahrer({jersey:j, sleeve:q()<.5?j:pk(bunt), hem:q()<.5, helmet:pk(helm), frame:pk(['#e9ecef','#212529','#c92a2a','#1864ab']), socks:q()<.5?'#f4f4ef':'#1b1b1d', build:q()}); });
  F.verein=[...Array(6)].map((_,i)=>rlFahrer({jersey:'#1d5fa8', sleeve:'#f2c230', hem:true, helmet:'#f8f9fa', frame:'#f1f3f5', accent:'#f2c230', tape:'#1d5fa8', socks:'#f4f4ef', shoes:'#f1f1ec', build:(i*.37)%1}));
  F.zeit=[rlFahrer({jersey:'#d6336c', sleeve:'#d6336c', pants:'#d6336c', longSleeve:true, helmet:'#d6336c', frame:'#212529', socks:'#f4f4ef', build:.15})];
  F.pendler=[rlFahrer({jersey:'#3d6b4f', sleeve:'#3d6b4f', longSleeve:true, pants:'#3b3f45', helmet:'#212529', frame:'#868e96', socks:'#3b3f45', shoes:'#5c4033', build:.6})];
  F.rentner=[rlFahrer({jersey:'#c9b48a', sleeve:'#c9b48a', longSleeve:true, pants:'#4a4a50', helmet:'#f8f9fa', frame:'#e9ecef', socks:'#4a4a50', shoes:'#6b5844', build:.8}),
    rlFahrer({jersey:'#a5d8ff', sleeve:'#a5d8ff', longSleeve:true, pants:'#4a4a50', helmet:'#f8f9fa', frame:'#e9ecef', socks:'#4a4a50', shoes:'#6b5844', build:.3})];
  F.familie=[rlFahrer({jersey:'#e8590c', sleeve:'#e8590c', helmet:'#495057', frame:'#343a40', pants:'#3b5bdb', build:.7}), rlFahrer({jersey:'#fcc419', sleeve:'#fcc419', helmet:'#e64980', frame:'#74c0fc', pants:'#e64980', build:.2},.62),
    rlFahrer({jersey:'#5c7cfa', sleeve:'#5c7cfa', helmet:'#f8f9fa', frame:'#f1f3f5', pants:'#343a40', build:.25})];
  F.rivale=[rlFahrer({jersey:'#82c91e', sleeve:'#1b1b1d', hem:true, helmet:'#1b1b1d', frame:'#82c91e', accent:'#1b1b1d', tape:'#82c91e', socks:'#82c91e', shoes:'#1b1b1d', glasses:'helm', build:.1})];
  const box=(r,w,h,d,c,x,y,z,rz=0)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c)); b.position.set(x,y,z); b.rotation.z=rz; r.body.add(b); return b; };
  for(const r of F.rentner) box(r,.3,.09,.09,'#2b2d31',.22,.52,0,.78); // Akku am Unterrohr
  for(const z of [-.17,.17]) box(F.pendler[0],.32,.3,.12,'#2f3a2f',-.5,.6,z); box(F.pendler[0],.4,.02,.3,'#555',-.48,.76,0); // Packtaschen am Gepäckträger
  { const s=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.03,20),M('#1b1b1d')); s.rotation.x=Math.PI/2; s.position.set(-.52,.34,0); F.zeit[0].body.add(s); F.zeit[0].ae=1; } // Scheibenrad, Aero-Haltung
  { const m=F.familie[2], A=new THREE.Group(); A.position.set(-1.3,0,0); m.tilt.add(A); // Kinderanhänger: rote Wanne, Stoffdach, zwei Räder, Deichsel, Kind mit Mütze
    const wa=new THREE.Mesh(new THREE.BoxGeometry(.75,.42,.62),M('#e03131')); wa.position.y=.45; A.add(wa); const da=new THREE.Mesh(new THREE.BoxGeometry(.6,.3,.6),M('#ffd43b')); da.position.set(-.05,.8,0); A.add(da);
    const ki=new THREE.Mesh(new THREE.SphereGeometry(.11,10,8),M('#efc9a6')); ki.position.set(.2,.78,0); A.add(ki); const mu=new THREE.Mesh(new THREE.SphereGeometry(.115,10,8,0,Math.PI*2,0,Math.PI/2),M('#4dabf7')); mu.position.set(.2,.8,0); A.add(mu);
    for(const z of [-.36,.36]){ const w=new THREE.Mesh(new THREE.TorusGeometry(.2,.03,6,16),M('#151515')); w.position.set(0,.2,z); A.add(w); }
    const de=cyl(.02,M('#adb5bd')); place(de,[.37,.3,.15],[.78,.34,.04]); A.add(de); }
  anim.radler={F, ev:[], lap:-1, dl:0, seed:0}; }

// ---- Plätze pro Runde würfeln: jede Art einmal, mindestens 400 m Abstand zueinander ----
function rlPlan(A,lap){ const D=R.def.radler, q=rng(A.seed*31+lap*977+7), base=lap*R.len, belegt=[];
  const lang=K=>(D[K.ab]||[]).reduce((s,[a,b])=>s+b-a,0); // enge Bereiche (Rivale, Familie, Rentner) zuerst, damit sie immer Platz finden
  for(const [art,K] of Object.entries(RL_ARTEN).sort((x,y)=>lang(x[1])-lang(y[1]))){ if(race.rain&&art!=='pendler'&&art!=='rivale') continue; const S=D[K.ab]; if(!S||!S.length) continue;
    const L=lang(K); let p=null;
    for(let v=0;v<20&&p==null;v++){ let x=q()*L; for(const [a,b] of S){ if(x<=b-a){ x+=a; break; } x-=b-a; } if(belegt.every(y=>Math.abs(y-x)>400)) p=x; }
    if(p==null) continue; belegt.push(p);
    A.ev.push({art, K, P:base+p, base, an:false, aus:false, f:A.F[art].map((r,i)=>({r, i, d:0, v:0, u:0, w:q()*6}))}); } }

// ---- Bewegung (aus draw) ----
function poseRadler(dt){ const A=anim.radler; if(!A) return; const run=race.state==='run', lap=R.loop?Math.floor(me.d/R.len):0;
  if(!run){ for(const k in A.F) for(const r of A.F[k]) r.g.visible=false; A.ev=[]; A.lap=-1; return; }
  if(me.d<A.dl-30||A.lap<0){ A.ev=[]; A.seed=Math.floor(Math.random()*1e6); A.lap=-1; } // neues Rennen: neu würfeln
  if(lap!==A.lap){ A.lap=lap; rlPlan(A,lap); } A.dl=me.d;
  const lauf=race.paused?0:dt*simSpeed(), dich=riders3d[myKey], hw=d=>roadW(R,d)/2;
  for(const k in A.F) for(const r of A.F[k]) r.g.visible=false;
  for(const E of A.ev){ if(E.aus) continue; const K=E.K;
    if(!E.an){ if(me.d<E.P-RL_LOS) continue; E.an=true; rlStart(E,hw); }
    if(K.typ==='rivale') rlRivale(E,lauf,dich,hw); else rlFahren(E,lauf,hw);
    let nah=false; for(const f of E.f){ const g=f.d-me.d; if(Math.abs(g)<RL_SICHT){ nah=true; rlSetze(f,E,g,lauf); } }
    if(!nah&&E.f.every(f=>f.d<me.d)||E.f.every(f=>f.d-me.d>RL_LOS+100)) E.aus=true; }
  A.ev=A.ev.filter(E=>!E.aus); }

function rlStart(E,hw){ const art=E.art, P=E.P;
  E.f.forEach((f,i)=>{ if(E.K.typ==='gegen'){ const row=Math.floor(i/2), r=hw(P)-.55; f.d=P+row*2.3+(i%2)*.4; f.u=art==='zeit'?-r:-(r-(i%2)*.7); f.v=0; } // entgegen: auf ihrer rechten = deiner linken Seite, Zweierreihe
    else if(E.K.typ==='weg'){ f.d=P-[0,2.4,5.6][i]; f.u=hw(P)+3.6; f.v=1.5; const q=P-E.base; E.ende=E.base+(R.def.radweg.find(([a,b])=>q>=a&&q<b)||[0,q+300])[1]-8; } // Familie hintereinander auf dem Radweg: Vater, Kind, Mutter mit Anhänger
    else { f.d=P-(art==='rentner'?i*.3:0); f.u=hw(P)-.55-(art==='rentner'?i*.7:0); f.v=4; } });
  if(art==='rentner') E.paar=true; if(art==='rivale') Object.assign(E,{ph:'warten', t:0}); }

// Tempo aus Watt und Steigung, gegen die Fahrtrichtung mit umgekehrter Steigung · Rentner fahren zusammen, bis du sie erreichst; danach fährt einer mit vollem Motor (25 km/h) weiter und holt dich am Berg
function rlFahren(E,lauf,hw){ const K=E.K;
  if(E.art==='rentner'&&E.paar&&me.d>E.f[0].d-4) E.paar=false;
  for(const f of E.f){ let vt;
    if(K.typ==='gegen') vt=rlV(K.P,K.kg,-gradeAt(f.d),K.cw);
    else if(K.typ==='weg') vt=f.d>E.ende-[0,2.4,5.6][f.i]?0:3.6; // am Ende des Radwegs halten sie an
    else if(E.art==='rentner'){ const g=gradeAt(f.d), berg=!f.i&&g>1.5; vt=E.paar?Math.min(5.6,rlV(250,K.kg,g,K.cw)):Math.min(f.i?5.6:berg?7.8:6.94,rlV(f.i?220:berg?520:K.P,K.kg,g,K.cw)); } // getuntes E-Bike: am Berg bis 28 km/h
    else vt=rlV(K.P,K.kg,gradeAt(f.d),K.cw);
    if(K.typ!=='gegen'&&f.d-me.d>250) vt=Math.min(vt,1.5); // in der Ferne nur rollen, damit sie noch da sind, wenn du kommst
    f.v+=(vt-f.v)*Math.min(1,lauf*.8); f.d+=(K.typ==='gegen'?-1:1)*f.v*lauf;
    if(K.typ==='vorn'){ const ut=hw(f.d)-.55-(E.art==='rentner'&&E.paar?f.i*.7:0); f.u+=(ut-f.u)*Math.min(1,lauf); } } }

// Berg-Rivale: wartet (rollt langsam), hängt sich an dein Hinterrad (dran), geht links vorbei und fährt vor dir (vorn, Windschatten), lässt sich wieder zurückfallen (zurueck) …
// Höchstens 110 % deiner FTP (auf sein Gewicht umgerechnet, am Hinterrad mit 30 % Windschatten) – wer mehr tritt, hängt ihn ab (weg). Oben angekommen richtet er sich auf (oben).
function rlRivale(E,lauf,dich,hw){ const f=E.f[0], K=E.K, g=f.d-me.d, ende=E.base+R.def.radler.bergEnde, ftp=+(($('ftp')||{}).value)||250, cap=1.1*ftp/weight()*K.kg, rechts=hw(f.d)-.6;
  E.t+=lauf; let gz=null, ut=rechts;
  if(E.ph==='warten'){ if(g<-1){ E.ph='dran'; E.t=0; E.dauer=10+Math.random()*8; } }
  else if(E.ph!=='weg'&&E.ph!=='oben'){
    if(f.d>=ende){ E.ph='oben'; } else if(g<-28){ E.ph='weg'; }
    else if(E.ph==='dran'){ gz=-2.4; ut=dich.lane; if(E.t>E.dauer){ E.ph='vorn'; E.t=0; E.dauer=15+Math.random()*10; E.uV=dich.lane-1.1; E.vorbei=true; } }
    else if(E.ph==='vorn'){ gz=3; if(g>3.5) E.vorbei=false; ut=E.vorbei?E.uV:clampN(E.uV+1.1,-rechts,rechts); if(E.t>E.dauer){ E.ph='zurueck'; E.t=0; } } // links vorbei auf fester Spur, dann vor dir einscheren
    else if(E.ph==='zurueck'){ gz=-2.4; if(g<-1.6){ E.ph='dran'; E.t=0; E.dauer=8+Math.random()*8; } } }
  const vmax=rlV(cap,K.kg,gradeAt(f.d),K.cw*(g<0&&g>-10?.7:1));
  const vt=gz==null?(E.ph==='warten'?(g>250?.8:2.8):4):Math.max(0,Math.min(vmax,me.v+clampN((gz-g)*.5,-2,2)));
  f.v+=(vt-f.v)*Math.min(1,lauf*1.5); f.d+=f.v*lauf; f.u+=(ut-f.u)*Math.min(1,lauf*1.5); }

// Figur auf die Straße (bzw. den Radweg) setzen, Pedale nach Tempo, der Erste der Gruppe grüßt mit der linken Hand
function rlSetze(f,E,g,lauf){ const r=f.r, gegen=E.K.typ==='gegen', weg=E.K.typ==='weg', d=f.d, hd=headingAt(R,d), [x,z]=posAt(R,d), w=Math.sin(performance.now()/1000*1.3+f.w);
  const u=f.u+w*(weg&&f.i===1?.12:.04), px=x-Math.sin(hd)*u, pz=z+Math.cos(hd)*u, y=weg?terrainAt(px,pz)+.12:roadY(d)+.12; // Überhöhung in deiner Nähe rechnet der Shader selbst drauf (kxSetup)
  r.g.visible=true; r.g.position.set(px,y,pz); r.g.rotation.set(0,-hd+(gegen?Math.PI:0),0);
  r.tilt.rotation.set(weg&&f.i===1?w*.06:0,0,Math.atan((gegen?-1:1)*gradeAt(d)/100));
  r.crank+=Math.min(95,f.v*(weg&&f.i===1?26:14))/60*Math.PI*2*lauf; radRoll(r,gegen?-d:d); // entgegen: Figur gedreht
  if(Math.abs(g)>RL_NAH) return; const gruss=gegen&&f.i===0&&E.art!=='zeit'&&g>2&&g<32, A=r.arms[0], h=A.h; if(gruss) A.h=[.48,1.82,-.34];
  poseRider(r,r.crank); A.h=h; }

// ---- Spur der echten Fahrer (aus lanes): an Langsameren links vorbei, für Entgegenkommende rechts bleiben, dem Rivalen ins Hinterrad ----
function radlerSpur(d,t){ const A=anim.radler; if(!A||race.state!=='run') return t;
  for(const E of A.ev){ if(!E.an||E.aus||E.K.typ==='weg') continue;
    for(const f of E.f){ const g=f.d-d;
      if(E.K.typ==='gegen'){ const w=rlSm((g+6)/4)*rlSm((45-g)/10); if(w>0) t+=(Math.max(t,f.u+.95)-t)*w; }
      else if(E.K.typ==='rivale'){ if(E.ph==='vorn'&&!E.vorbei&&race.draft&&g>2.6&&g<10) t+=(f.u-t)*rlSm((g-2.6)/1.5); }
      else { const w=rlSm((g+5)/3)*rlSm((16-g)/5); if(w>0) t+=(Math.min(t,f.u-1.15)-t)*w; } } }
  return t; }

// ---- Windschatten vom Rivalen für den eigenen Fahrer (aus simStep) ----
function radlerWind(d){ const A=anim.radler; if(!A) return 0; const E=A.ev.find(E=>E.art==='rivale'&&E.an&&!E.aus); if(!E) return 0; const f=E.f[0], dich=riders3d[myKey];
  return dich&&Math.abs(f.u-dich.lane)<.8?draftOf(f.d-d):0; }
