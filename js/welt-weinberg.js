/* ================= Südpfalz-Klassiker: Weinstände, Weinbergtraktor, Weinlese =================
   Weinstand am Ortsrand von Leinsweiler und Ranschbach (`weinberg.stand` in suedpfalzDef): Ausschank mit Tafel, Bierzeltgarnituren, Sonnenschirme, Fässer als Stehtische,
   Lichterkette (leuchtet abends über hausLicht), Gäste mit Dubbegläsern, Bedienung mit Tablett; wenn du kommst, heben sie die Gläser. Nicht bei Regen.
   Weinbergtraktor (Schmalspur, weißes Kabinendach) mit Anhänger voller Bütten und Trauben: überholt dich auf dem Betonplattenweg von hinten (Startpunkt pro Runde gewürfelt
   aus `weinberg.traktor`), staubt, Trauben hüpfen über die Plattenfugen, biegt danach in einen Wirtschaftsweg ab; fährst du ihm davon, gibt er auf.
   Weinlese (nur im Herbst, nicht bei Regen) an den Wirtschaftswegen `weinberg.lese` (Gebüsch am Straßenrand dort ausgedünnt): Leser gebückt in den Rebgassen mit Eimern, Buttenträger mit Kiepe, Traktor mit Bütten auf dem Weg.
   prepWeinberg aus prepSuedpfalz · buildWeinberg aus build3D · poseWeinberg aus draw (rennen.js) · weinSpur aus lanes (rennen.js: rechts Platz für den Traktor) */
const WB_FUGE=6; // Plattenlänge des Betonwegs in m

// ---- Plätze (aus prepSuedpfalz): Weinstände freiräumen, Wirtschaftswege für die Weinlese wählen ----
function prepWeinberg(r){ const D=r.def.weinberg, S=r.S, q=rng(77), W=r.wb={stand:[], lese:[]};
  const fr=(d,sd,o)=>{ const [px,py]=posAt(r,d), h=headingAt(r,d), nx=-Math.sin(h), ny=Math.cos(h), rw=roadW(r,d)/2; return {x:px+nx*sd*(rw+o), y:py+ny*sd*(rw+o), h, d, side:sd, nx, ny}; };
  const frei=(x,y,rad)=>{ for(const k of ['vine','vpost','tree','bush','weg','grass','post','konif','rock']) S[k]=S[k].filter(o=>Math.hypot(o.x-x,o.y-y)>rad); };
  for(const [d,sd,art,n] of D.stand){ const p=Object.assign(fr(d,sd,2),{art,n}), m=fr(d,sd,8); frei(m.x,m.y,10.5); W.stand.push(p); }
  for(const [d,sd] of D.lese){ const w=r.wege.reduce((b,w)=>Math.abs(w-d)<Math.abs(b-d)?w:b,-1e9), p=Object.assign(fr(Math.abs(w-d)<60?w:d,sd,0),{seed:Math.floor(q()*1e6)}); W.lese.push(p); // am nächsten Wirtschaftsweg
    const ca=Math.cos(p.h), sa=Math.sin(p.h); S.bush=S.bush.filter(o=>{ const dx=o.x-p.x, dy=o.y-p.y, al=dx*ca+dy*sa, c=(dx*p.nx+dy*p.ny)*sd; return !(Math.abs(al)<35&&c>-1&&c<7)||q()<.25; }); } } // Gebüsch am Straßenrand ausdünnen, damit man die Leser sieht

// ---- Leute in Alltagskleidung: Beine mit Knie (sitzen, gehen), Oberkörper ab der Hüfte (bücken), Arme an den Schultern, Kopf; blickt nach lokal +z ----
function wbLeut(o,M){ const G=new THREE.Group(), haut=M(o.haut||'#e8c09a'), hemd=M(o.hemd), hose=M(o.hose||'#3b4252'), B=(w,h,d,m,x,y,z,par)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); par.add(b); return b; };
  const beine=[]; for(const x of [-.1,.1]){ const L=new THREE.Group(); L.position.set(x,.88,0); G.add(L); B(.13,.46,.14,hose,0,-.23,0,L); const K=new THREE.Group(); K.position.y=-.46; L.add(K); B(.12,.42,.12,hose,0,-.21,0,K); B(.12,.08,.25,M(o.schuh||'#2b2b2b'),0,-.44,.05,K); beine.push({L,K}); }
  const O=new THREE.Group(); O.position.y=.88; G.add(O); const t=new THREE.Mesh(new THREE.CylinderGeometry(.17,.19,.62,9),hemd); t.position.y=.31; O.add(t);
  if(o.schuerze){ const s=new THREE.Mesh(new THREE.BoxGeometry(.3,.6,.04),M(o.schuerze)); s.position.set(0,.05,.19); O.add(s); }
  const arme=[]; for(const x of [-.24,.24]){ const A=new THREE.Group(); A.position.set(x,.56,0); O.add(A); const c=new THREE.Mesh(new THREE.CylinderGeometry(.05,.045,.56,6),o.kurz?haut:hemd); c.position.y=-.28; A.add(c);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.05,6,5),haut); hd.position.y=-.58; A.add(hd); A.rotation.z=x<0?-.1:.1; arme.push(A); }
  const kopf=new THREE.Group(); kopf.position.y=.68; O.add(kopf); const k=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),haut); k.position.y=.1; kopf.add(k);
  if(o.kappe){ const c=new THREE.Mesh(new THREE.SphereGeometry(.13,10,6,0,Math.PI*2,0,Math.PI/2),M(o.kappe)); c.position.y=.13; kopf.add(c); B(.16,.02,.12,M(o.kappe),0,.14,.12,kopf); }
  else if(o.hut){ const r=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.02,14),M(o.hut)); r.position.y=.19; kopf.add(r); const c=new THREE.Mesh(new THREE.CylinderGeometry(.12,.13,.12,12),M(o.hut)); c.position.y=.25; kopf.add(c); }
  else { const h=new THREE.Mesh(new THREE.SphereGeometry(.127,10,8,0,Math.PI*2,0,Math.PI*(o.lang?.62:.5)),M(o.haar||'#5a4030')); h.position.set(0,.11,-.01); h.rotation.x=-.2; kopf.add(h); }
  if(o.s) G.scale.setScalar(o.s); return {G,O,beine,arme,kopf}; }
const wbSitz=P=>{ for(const b of P.beine){ b.L.rotation.x=-Math.PI/2; b.K.rotation.x=Math.PI/2; } }; // Hüfte 0,42 m tiefer: G.y = Sitzhöhe − 0,36
function wbGlas(A,M){ const g=new THREE.Mesh(new THREE.CylinderGeometry(.04,.034,.11,8),M('#e9f0d8')); g.position.set(0,-.62,.04); A.add(g); const w=new THREE.Mesh(new THREE.CylinderGeometry(.036,.031,.06,8),M('#e8d27a')); w.position.set(0,-.64,.04); A.add(w); return g; } // Dubbeglas mit Weißweinschorle

// ---- Traktor (Schmalspur) mit Anhänger: blickt nach lokal +z, Anhänger als eigene Gruppe ----
function wbTraktor(farbe,M){ const T=new THREE.Group(), c=M(farbe), sw=M('#1c1c1c'), weiss=M('#f1f3f5'), grau=M('#9aa0a6'), B=(w,h,d,m,x,y,z,par=T)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); par.add(b); return b; };
  const rad=(r,b,x,y,z,par)=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(r,r,b,14),sw); w.rotation.z=Math.PI/2; w.position.set(x,y,z); par.add(w); const f=new THREE.Mesh(new THREE.CylinderGeometry(r*.55,r*.55,b+.02,10),grau); f.rotation.z=Math.PI/2; f.position.set(x,y,z); par.add(f); };
  for(const s of [-1,1]){ rad(.6,.3,s*.6,.6,-.55,T); rad(.38,.22,s*.52,.38,1.05,T); B(.34,.06,1.05,c,s*.6,1.24,-.55); }
  B(.62,.62,1.5,c,0,.92,.72); B(.6,.4,.05,sw,0,.95,1.48); B(.7,.3,1.1,sw,0,.55,0); // Haube, Kühlergrill, Rahmen
  for(const [x,z] of [[-.55,-.95],[.55,-.95],[-.55,.2],[.55,.2]]) B(.06,1.3,.06,sw,x,1.65,z); B(1.25,.08,1.35,weiss,0,2.32,-.38); B(1.1,.05,1.15,c,0,1.0,-.38); // Kabine: Holme, weißes Dach, Boden
  const glas=new THREE.MeshLambertMaterial({color:'#bcd4dc',transparent:true,opacity:.28}); B(1.08,1.1,.02,glas,0,1.6,.2); // Frontscheibe
  const au=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.8,6),sw); au.position.set(.24,1.6,.95); T.add(au);
  const F=wbLeut({hemd:'#3d5a80',hose:'#2d3a4a',kappe:'#2f6b3a'},M); wbSitz(F); F.G.position.set(0,.95,-.45); F.arme.forEach(A=>A.rotation.x=-1.1); T.add(F.G); // Fahrer am Lenkrad
  const A=new THREE.Group(); B(.06,.06,1.1,sw,0,.6,1.75,A); B(1.5,.12,2.8,M('#6b5a48'),0,.78,0,A); for(const s of [-1,1]){ B(.05,.4,2.8,M('#8a7a62'),s*.73,1.02,0,A); rad(.32,.2,s*.66,.32,-.2,A); } B(1.5,.4,.05,M('#8a7a62'),0,1.02,-1.38,A);
  const tr=new THREE.Group(); A.add(tr); const bu=M('#2f8a3c'), ro=M('#5b2a5e'), gr=M('#9bb542');
  for(const z of [-.9,0,.9]){ const b=new THREE.Mesh(new THREE.CylinderGeometry(.6,.5,.62,12),bu); b.position.set(0,1.15,z); A.add(b);
    for(let i=0;i<7;i++){ const a=i/7*6.28, s=new THREE.Mesh(new THREE.SphereGeometry(.17,6,5),(z+i)%2?ro:gr); s.position.set(Math.cos(a)*.3,1.46+(i%3)*.05,z+Math.sin(a)*.3); tr.add(s); } }
  return {T, A, tr, F}; }

// ---- Aufbau (aus build3D) ----
function buildWeinberg(){ const W=R.wb; if(!W) return; const M=c=>lam(c), A=anim.wb={stand:[], lese:[], trak:null}, q=rng(515);
  const KL=['#c92a2a','#1971c2','#f8f9fa','#2b8a3e','#e8590c','#495057','#ae3ec9','#f2c94c','#74c0fc','#8d6e63'], HA=['#3b2a20','#7a5230','#d9b26a','#1e1e1e','#9c9c9c','#b5523b'], pk=a=>a[Math.floor(q()*a.length)];
  for(const p of W.stand){ const G=new THREE.Group(), sx=p.side*p.nx, sz=p.side*p.ny, cx=p.side*Math.cos(p.h), cz=p.side*Math.sin(p.h); G.position.set(p.x,bodenY(p.x,p.y),p.y); G.rotation.y=Math.atan2(sx,sz); world.add(G);
    const wy=(lx,lz)=>bodenY(p.x+cx*lx+sx*lz,p.y+cz*lx+sz*lz)-G.position.y, B=(w,h,d,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,wy(x,z)+y,z); G.add(b); return b; };
    const holz=M('#8a5a35'), hell=M('#c9a46a'), dunkel=M('#4a3426'), S={G, p, gaeste:[], dienst:null, t:q()*9};
    // Ausschank: Holzbude mit Theke, Pultdach und Tafel
    B(3.6,2.3,2,holz,0,1.15,10); B(3.6,1.05,.5,hell,0,.52,8.75); B(3.9,.06,.5,dunkel,0,1.08,8.75); const d=B(4,.08,2.9,M('#7a2e22'),0,2.45,9.6); d.rotation.x=-.12;
    const tafel=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.62),new THREE.MeshLambertMaterial({map:canvasTex(320,76,g=>{ g.fillStyle='#2f4a32'; g.fillRect(0,0,320,76); g.strokeStyle='#e2c46a'; g.lineWidth=3; g.strokeRect(4,4,312,68); g.fillStyle='#f3ecdc'; g.textAlign='center'; g.textBaseline='middle';
      if(p.art===2){ g.font='bold 30px Georgia, serif'; g.fillText('Straußwirtschaft',160,28); g.font='italic 21px Georgia, serif'; g.fillText('geöffnet · Weingut '+p.n,160,56); } else { g.font='bold 32px Georgia, serif'; g.fillText('Weinausschank',160,28); g.font='italic 21px Georgia, serif'; g.fillText('Weingut '+p.n,160,56); } })}));
    tafel.position.set(0,wy(0,8.98)+2.05,8.98); tafel.rotation.y=Math.PI; G.add(tafel);
    for(const x of [-.9,-.3,.4,1]){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.32,8),M(x<0?'#2c5a2a':'#e9e1c0')); f.position.set(x,wy(x,10)+1.3,9.05); G.add(f); } // Flaschen im Regal
    for(const x of [-2.6,2.6]){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.42,.38,1.05,12),M('#7a4e2c')); f.position.set(x,wy(x,7.6)+.52,7.6); G.add(f); for(const y of [.2,.85]){ const r=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.05,12),M('#3a3a3a')); r.position.set(x,wy(x,7.6)+y,7.6); G.add(r); } } // Fässer als Stehtische
    { const st=B(.06,2.6,.06,dunkel,-5.2,1.3,.6), bs=new THREE.Mesh(new THREE.ConeGeometry(.35,.9,8),M('#b08a3a')); bs.position.set(-5.2,wy(-5.2,.6)+2.4,.85); bs.rotation.x=Math.PI/2+.3; G.add(bs); } // Strauß (Besen) am Pfahl: hier wird ausgeschenkt
    // Bierzeltgarnituren mit Gläsern und Flaschen, zwei Sonnenschirme
    const tische=[[-3,3.2],[1.6,3.2],[-3,5.8],[1.6,5.8]];
    for(const [x,z] of tische){ B(2.2,.05,.55,hell,x,.76,z); for(const s of [-.85,.85]){ B(.05,.74,.45,dunkel,x+s,.37,z); for(const b of [-.55,.55]) B(.05,.43,.22,dunkel,x+s,.21,z+b); } for(const b of [-.55,.55]) B(2.2,.04,.25,hell,x,.45,z+b);
      for(let i=0;i<3;i++){ const g=new THREE.Mesh(new THREE.CylinderGeometry(.04,.034,.11,8),M('#e9f0d8')); g.position.set(x-.8+q()*1.6,wy(x,z)+.84,z+(q()-.5)*.3); G.add(g); }
      if(q()<.7){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.04,.045,.3,8),M('#2c5a2a')); f.position.set(x+(q()-.5)*1.2,wy(x,z)+.93,z); G.add(f); } }
    for(const [x,z,c] of [[-.7,4.5,'#c92a2a'],[3.9,4.5,'#f1f3f5']]){ B(.05,2.4,.05,M('#ddd'),x,1.2,z); const s=new THREE.Mesh(new THREE.ConeGeometry(1.7,.5,10),M(c)); s.position.set(x,wy(x,z)+2.45,z); G.add(s); }
    // Lichterkette von der Bude über die Tische zum Strauß, leuchtet abends
    const lm=hMat('wbLicht',()=>{ const m=lam('#efe3b0'); HAUS_GLOW.push({m,c:0xffc864}); return m; }), kette=[[-1.8,2.3,8.9],[-5.2,2.5,.6],[5.2,2.2,.6],[1.8,2.3,8.9]];
    for(let k=0;k<3;k++){ const [a,b]=[kette[k],kette[k+1]]; for(let i=1;i<12;i++){ const t=i/12, l=new THREE.Mesh(new THREE.SphereGeometry(.05,6,4),lm), x=a[0]+(b[0]-a[0])*t, z=a[2]+(b[2]-a[2])*t; l.position.set(x,wy(x,z)+a[1]+(b[1]-a[1])*t-Math.sin(t*Math.PI)*.35,z); G.add(l); } }
    // Gäste: auf den Bänken (Rücken zur Straße drehen sich zu dir), an den Fässern stehend; Bedienung mit Schürze und Tablett
    for(const [x,z] of tische) for(const b of [-.55,.55]) for(const o of [-.65,.1,.8]){ if(q()<.42) continue; const P=wbLeut({hemd:pk(KL),hose:pk(['#3b4252','#5c4a3a','#2d3a4a','#c9b48a']),haar:pk(HA),lang:q()<.45,kurz:q()<.5,hut:q()<.1?'#d6bf72':null},M);
      wbSitz(P); P.G.position.set(x+o,wy(x+o,z+b)+.11,z+b*1.1); P.G.rotation.y=b<0?0:Math.PI; G.add(P.G); P.G.userData.ohneBoden=true; P.glas=wbGlas(P.arme[1],M); P.arme[1].rotation.x=-.9; P.ruecken=b<0; P.ph=q()*6; S.gaeste.push(P); }
    for(const [x,z] of [[-2.6,7.6],[2.6,7.6]]) for(const a of [-.7,.7]){ if(q()<.3) continue; const P=wbLeut({hemd:pk(KL),hose:pk(['#3b4252','#2d3a4a']),haar:pk(HA),lang:q()<.4,kurz:q()<.5},M);
      P.G.position.set(x+a,wy(x+a,z-.6),z-.6); P.G.rotation.y=a<0?.6:-.6; G.add(P.G); P.glas=wbGlas(P.arme[1],M); P.arme[1].rotation.x=-1.2; P.steht=true; P.ph=q()*6; S.gaeste.push(P); }
    { const P=wbLeut({hemd:'#f8f9fa',hose:'#212529',haar:'#3b2a20',lang:true,schuerze:'#2f4a32'},M); G.add(P.G); P.arme[0].rotation.x=-1.4; const tb=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.02,12),M('#c0c0c0')); tb.position.set(0,-.58,.12); P.arme[0].add(tb);
      for(let i=0;i<3;i++){ const g=new THREE.Mesh(new THREE.CylinderGeometry(.035,.03,.1,7),M('#e8d27a')); g.position.set(-.08+i*.08,-.52,.12); P.arme[0].add(g); } S.dienst=P; }
    S.wy=wy; A.stand.push(S); }
  // Traktor auf dem Betonplattenweg
  { const K=wbTraktor('#3c7d3a',M); world.add(K.T); world.add(K.A); K.T.rotation.order=K.A.rotation.order='YXZ'; K.T.visible=K.A.visible=false; A.trak=Object.assign(K,{ph:'aus', lap:-1}); }
  // Weinlese: nur im Herbst
  if(race.season==='herbst') for(const p of W.lese){ const q2=rng(p.seed), L={p, leser:[], traeger:null, G:new THREE.Group()}, rd=[Math.cos(p.h),Math.sin(p.h)], rw=roadW(R,p.d)/2; world.add(L.G);
    const K=wbTraktor(q2()<.5?'#b8322a':'#3c7d3a',M), wx=p.x+p.nx*p.side*5, wz=p.y+p.ny*p.side*5, ry=Math.atan2(p.nx*p.side,p.ny*p.side); // auf dem Weg, Front vom Wingert weg zur Straße
    K.T.position.set(wx+p.nx*p.side*1.6,bodenY(wx+p.nx*p.side*1.6,wz+p.ny*p.side*1.6),wz+p.ny*p.side*1.6); K.T.rotation.y=ry+Math.PI; K.F.G.visible=false; L.G.add(K.T);
    K.A.position.set(wx+p.nx*p.side*5.4,bodenY(wx+p.nx*p.side*5.4,wz+p.ny*p.side*5.4),wz+p.ny*p.side*5.4); K.A.rotation.y=ry+Math.PI; L.G.add(K.A);
    const vines=R.S.vine.filter(v=>{ const dx=v.x-p.x, dz=v.y-p.y, a=dx*rd[0]+dz*rd[1], c=(dx*p.nx+dz*p.ny)*p.side; return Math.abs(a)>2.8&&Math.abs(a)<16&&c>rw+5&&c<rw+30; });
    for(let i=0;i<6&&vines.length;i++){ const v=vines.splice(Math.floor(q2()*vines.length),1)[0], dx=v.x-p.x, dz=v.y-p.y, sg=Math.sign(dx*rd[0]+dz*rd[1]), x=v.x+rd[0]*sg*1.2, z=v.y+rd[1]*sg*1.2;
      const P=wbLeut({hemd:pk(['#c92a2a','#495057','#1971c2','#f2c94c','#2b8a3e','#8d6e63']),hose:pk(['#3b4252','#2d3a4a','#5c4a3a']),kappe:q2()<.4?pk(['#f8f9fa','#c92a2a','#1c1c1c']):null,hut:q2()<.2?'#d6bf72':null,haar:pk(HA)},M);
      P.G.position.set(x,bodenY(x,z),z); P.G.rotation.y=Math.atan2(-rd[0]*sg,-rd[1]*sg)+(q2()-.5)*.5; P.O.rotation.x=.8; L.G.add(P.G); P.ph=q2()*6;
      const e=new THREE.Mesh(new THREE.CylinderGeometry(.16,.13,.28,10),M(pk(['#f2c230','#c92a2a','#1c1c1c']))); e.position.set(x+(q2()-.5)*.5,bodenY(x,z)+.14,z+(q2()-.5)*.5); L.G.add(e); L.leser.push(P); }
    { const P=wbLeut({hemd:'#495057',hose:'#2d3a4a',kappe:'#2f6b3a'},M), ki=new THREE.Mesh(new THREE.CylinderGeometry(.28,.2,.62,10),M('#2f8a3c')); ki.position.set(0,.34,-.3); P.O.add(ki);
      for(let i=0;i<5;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(.1,6,5),M(i%2?'#5b2a5e':'#9bb542')); s.position.set(Math.cos(i*1.3)*.13,.66,-.3+Math.sin(i*1.3)*.13); P.O.add(s); }
      P.arme.forEach(A=>A.rotation.x=-.5); L.G.add(P.G); L.traeger=P; } // Buttenträger: Kiepe mit Trauben auf dem Rücken, geht auf dem Weg zum Anhänger und zurück
    L.rw=rw; A.lese.push(L); } }

// ---- Bewegung (aus draw) ----
function poseWeinberg(dt){ const A=anim.wb; if(!A) return; const t=performance.now()/1000, cp=camera.position, run=race.state==='run', lauf=run&&!race.paused?dt*simSpeed():0;
  for(const S of A.stand){ const p=S.p, nah=Math.hypot(cp.x-p.x,cp.z-p.y)<450; S.G.visible=nah&&!race.rain; if(!S.G.visible) continue;
    const g=p.d-(R.loop?((me.d%R.len)+R.len)%R.len:me.d), prost=run&&g>-12&&g<45; S.t+=dt;
    for(const P of S.gaeste){ const ph=t*1.3+P.ph, a=P.arme[1];
      if(prost){ a.rotation.x+=(-2.5+Math.sin(t*5+P.ph)*.25-a.rotation.x)*Math.min(1,dt*5); if(P.ruecken) P.O.rotation.y+=(2.2-P.O.rotation.y)*Math.min(1,dt*3); P.kopf.rotation.y=P.ruecken?.5:0; } // Gläser hoch, zu dir gedreht
      else { a.rotation.x+=((P.steht?-1.2:-.9)+(Math.sin(ph*.7)>.85?-.7:0)-a.rotation.x)*Math.min(1,dt*3); P.O.rotation.y+=(0-P.O.rotation.y)*Math.min(1,dt*2); P.kopf.rotation.y=Math.sin(ph*.4)*.5; P.arme[0].rotation.x=Math.sin(ph*.9)>.6?-.6:0; } } // trinken, reden
    { const P=S.dienst, u=(Math.sin(S.t*.25)+1)/2, x=-4+u*7, z=4.5, v=Math.cos(S.t*.25); P.G.position.set(x,S.wy(x,z),z); P.G.rotation.y=v>0?Math.PI/2:-Math.PI/2; // Bedienung läuft zwischen den Tischen hin und her
      const sw=Math.sin(S.t*5)*.45; P.beine[0].L.rotation.x=sw; P.beine[1].L.rotation.x=-sw; P.arme[1].rotation.x=prost?-2.6+Math.sin(t*8)*.3:sw*.5; } } // winkt dir
  poseTraktor(dt,lauf,t);
  for(const L of A.lese){ const nah=Math.hypot(cp.x-L.p.x,cp.z-L.p.y)<500; L.G.visible=nah&&!race.rain; if(!L.G.visible) continue;
    for(const P of L.leser){ const s=Math.sin(t*2.2+P.ph); P.O.rotation.x=.8+s*.08; P.arme[1].rotation.x=-.9+Math.sin(t*6+P.ph)*.25; P.arme[0].rotation.x=-.6+s*.1; } // Trauben schneiden
    { const P=L.traeger, p=L.p, per=36, u=(t%per)/per, k=u<.5?u*2:2-u*2, o=L.rw+28-k*19, x=p.x+p.nx*p.side*o+Math.cos(p.h)*1.4, z=p.y+p.ny*p.side*o+Math.sin(p.h)*1.4; // auf dem Weg hin und her
      P.G.position.set(x,bodenY(x,z),z); P.G.rotation.y=Math.atan2(p.nx*p.side,p.ny*p.side)+(u<.5?Math.PI:0); const sw=Math.sin(t*5.5)*.4; P.beine[0].L.rotation.x=sw; P.beine[1].L.rotation.x=-sw; } } }

// Traktor: wartet, bis du am gewürfelten Punkt bist, startet 80 m hinter dir (außer Sicht), überholt links, schert ein, biegt am nächsten Wirtschaftsweg ab
function poseTraktor(dt,lauf,t){ const K=anim.wb.trak, D=R.def.weinberg, run=race.state==='run', lap=R.loop?Math.floor(me.d/R.len):0, base=lap*R.len;
  if(!run){ K.T.visible=K.A.visible=false; K.ph='aus'; K.lap=-1; return; }
  if(lap!==K.lap){ const [a,b]=D.traktor[0]; K.lap=lap; K.trig=base+a+Math.random()*(b-a); K.ph='warten'; }
  if(K.ph==='warten'&&me.d>K.trig){ K.ph='fahrt'; K.d=me.d-80; K.v=me.v; K.fuge=Math.floor(K.d/WB_FUGE); K.wack=0; K.ab=null; }
  if(K.ph==='warten'||K.ph==='aus'){ K.T.visible=K.A.visible=false; return; }
  const hw=roadW(R,K.d)/2, g=K.d-me.d; let vt;
  if(K.ph==='fahrt'){ vt=g<14?clampN(me.v+2.5,6,11.1):9.2; if(g<-150||g>700){ K.ph='aus'; return; } // zu schnell für ihn / weit weg
    K.u=g<14?-(hw-.85):-(hw-.85)*clampN(1-(g-14)/12,0,1); // links vorbei, dann zur Mitte
    if(g>40&&!K.ab){ // Abbiegen am nächsten Wirtschaftsweg ohne Lese-Wagen
      const w=R.wege.find(w=>w>((K.d%R.len)+R.len)%R.len+40&&zoneAt(R,w)==='reben'&&!R.wb.lese.some(p=>Math.abs(p.d-w)<10)); if(w!=null) K.ab={w:w+(K.d-((K.d%R.len)+R.len)%R.len), s:Math.random()<.5?-1:1, o:0}; }
    if(K.ab&&K.d>=K.ab.w) K.ph='ab'; }
  else vt=4;
  K.v+=(vt-K.v)*Math.min(1,lauf*.9);
  const plat=(G,d,u,o,h0)=>{ const hd=headingAt(R,d), [x,z]=posAt(R,d), nx=-Math.sin(hd), nz=Math.cos(hd); let px=x+nx*u, pz=z+nz*u, h=hd, y=roadY(d)+.12, gr=gradeAt(d);
    if(o!=null){ px=x+nx*K.ab.s*o; pz=z+nz*K.ab.s*o; h=hd+K.ab.s*Math.PI/2*clampN(o/5,0,1); y=bodenY(px,pz); gr=0; } // auf dem Wirtschaftsweg quer zur Straße
    G.position.set(px,y,pz); G.rotation.set(-Math.atan(gr/100),Math.PI/2-h,0); return [px,pz,h]; };
  if(K.ph==='fahrt'){ K.d+=K.v*lauf; plat(K.T,K.d,K.u); const [ax,az,h]=plat(K.A,K.d-3.4,K.u); K.staub=[ax,az,h]; }
  else { K.ab.o+=K.v*lauf; const o=K.ab.o, s=o-3.4; plat(K.T,K.ab.w,0,o); const [ax,az,h]=s<0?plat(K.A,K.ab.w+s,0):plat(K.A,K.ab.w,0,s); K.staub=[ax,az,h]; if(o>70){ K.ph='aus'; return; } } // Anhänger folgt auf derselben Bahn
  K.T.visible=K.A.visible=true;
  const f=Math.floor(K.d/WB_FUGE); if(K.ph==='fahrt'&&f!==K.fuge){ K.fuge=f; K.wack=1; } K.wack=Math.max(0,K.wack-lauf*4); // über die Plattenfugen: Anhänger und Trauben hüpfen
  K.tr.position.y=Math.abs(Math.sin(t*30))*.05*K.wack; K.A.rotation.z=Math.sin(t*25)*.015*K.wack; K.T.position.y+=Math.sin(t*18)*.01;
  if(lauf>0&&!race.rain&&Math.hypot(K.T.position.x-camera.position.x,K.T.position.z-camera.position.z)<200){ const [x,z,h]=K.staub, cx=Math.cos(h), cz=Math.sin(h); // Staub hinterm Anhänger
    for(let n=rate(parts.dust,'trak',K.v*4,dt);n>0;n--){ const s=(Math.random()-.5)*1.6; partSpawn(parts.dust,x-cx*1.5-cz*s,K.A.position.y+.2,z-cz*1.5+cx*s,-cx*K.v*.15-cz*s,.3+Math.random()*.5,-cz*K.v*.15+cx*s,1.8,'#c2b08f'); } } }

// ---- Spur der echten Fahrer (aus lanes): rechts Platz machen, solange der Traktor vorbeizieht ----
function weinSpur(d,t){ const K=anim.wb&&anim.wb.trak; if(!K||K.ph!=='fahrt'||race.state!=='run') return t; const g=K.d-d, w=rlSm((g+16)/6)*rlSm((14-g)/5); return w>0?t+(Math.max(t,roadW(R,d)/2-.7)-t)*w:t; }
