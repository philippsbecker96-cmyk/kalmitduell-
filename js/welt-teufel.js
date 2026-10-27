/* ================= Teufelstisch (Kampagne, Mission 2) – der Teufel =================
   ≈ 18 m, mittelalterlich: Bocksbeine mit Fell und Hufen, sehnige dunkelrote Haut, Krallenhände, Widderhörner, glühende Augen, Hakennase, Ziegenbart, Fangzähne,
   angelegte Fledermausflügel, Schwanz mit Pfeilspitze, zerlumpter Kapuzenumhang mit verkohltem Saum, Gürtel mit Schädeln und Ketten, rostiger Dreizack (≈ 17 m).
   Sitzt auf einem Felsstuhl hinter dem Tisch und isst Pfälzer Dreierlei (links die Gabel, rechts hält er den Dreizack), du schleichst geduckt am rechten Wegrand vorbei (ttGeduckt),
   mit Beginn von „Ertappt“ entdeckt er dich (kurz bevor du auf seiner Höhe bist), steigt auf den Stuhl, springt auf den Weg
   und verfolgt dich zu Fuß (Gummiband-Abstand hinter dir, beim Dreizack dicht dran und pieksend). Nach Flucht 1 bleibt er hinter der Gabelung stehen und stapft quer
   durch den Wald zurück an den Tisch, nach Flucht 2 bleibt er an der Gabelung und tobt. Ablauf aus dem Workout (teufelSkript), Rückblicke der Kamera: teufelKamera */

const TEUFEL={k:10.5, hoch:2.5, abst:16, nah:9, schritt:12, geh:3.5}; // k: Maßstab (Figur 1,75 → ≈ 18 m) · hoch: Sitz so viele m unter der Tischplatte · abst/nah: Abstand hinter dir in der Flucht / beim Dreizack · schritt: m je Doppelschritt · geh: m/s zurück zum Tisch
// Haltungen: b Beine [Hüfte, Knie, Fessel] (links, rechts) · l Oberkörper vor · k Kopf [nicken, drehen] · a Arme [vor, nach innen, Ellbogen] (links Gabel, rechts Dreizack) · j Kiefer
const TF_SITZ={b:[[-1.2,1.6,-.6],[-1.2,1.6,-.6]], l:.25, k:[.25,0], a:[[-.25,.2,-1.2],[-.35,-.15,-1.25]], j:.05};
const TF_STEH={b:[[-.35,.9,-.75],[-.35,.9,-.75]], l:.05, k:[.15,0], a:[[.1,.15,-.5],[-.5,-.15,-1.1]], j:.1};
const TF_WUT={b:[[-.45,1,-.75],[-.25,.8,-.75]], l:-.08, k:[.2,0], a:[[-1.4,.1,-.8],[-2.6,-.25,1]], j:.38}; // Gabel-Faust vor, Dreizack hoch über dem Kopf, brüllt
const TF_SPRUNG={b:[[-1.3,1.9,-.5],[-.6,1.2,-.7]], l:.35, k:[-.1,0], a:[[-1.8,-.2,-.6],[-.5,-.15,-1.1]], j:.35};
const tfMix=(a,b,w)=>Array.isArray(a)?a.map((v,i)=>tfMix(v,b[i],w)):a+(b-a)*w;
const tfMixP=(a,b,w)=>({b:tfMix(a.b,b.b,w), l:tfMix(a.l,b.l,w), k:tfMix(a.k,b.k,w), a:tfMix(a.a,b.a,w), j:tfMix(a.j,b.j,w)});
const tfWinkel=(a,b,w)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*w;
// Laufen: Phase phi, m 0 (stehen) … 1 (rennen), stoss 0…1 Dreizack nach vorn unten
function tfLauf(phi,m,stoss){ const s=Math.sin(phi), c=Math.cos(phi), bein=k=>{ const sk=k?-s:s, ck=k?-c:c; return [-.35+.6*m*sk, .9+.6*m*Math.max(0,-ck), -.75-.2*m*sk]; };
  return {b:[bein(0),bein(1)], l:.05+.25*m, k:[-.1*m,0], a:[[-.55*m*s,.1,-.6-.3*m], tfMix([-.5+.1*m*s,-.15,-1.1],[-.15,-.1,.5],stoss)], j:.12+.15*m}; }
// Essen im Sitzen (7 s): Gabel zum Teller, zum Mund, kauen
function tfEssen(t){ const u=(t%7)/7, R0=[-.25,.2,-1.2], RE=[-.2,.25,-1], MU=[-.5,.4,-2.4], F=[[0,R0,.25],[.18,RE,.4],[.28,RE,.4],[.45,MU,.1],[.55,MU,.1],[.75,R0,.25],[1,R0,.25]];
  let i=1; while(u>F[i][0]) i++; const [u0,a0,k0]=F[i-1], [u1,a1,k1]=F[i], w=bSm((u-u0)/(u1-u0));
  return {...TF_SITZ, a:[tfMix(a0,a1,w),TF_SITZ.a[1]], k:[k0+(k1-k0)*w,0], j:u>.4&&u<.55?.3:u>=.55?.12+.1*Math.sin(t*9):.05}; }
function tfPose(D,P){ D.beine.forEach((B,i)=>{ const [a,b,c]=P.b[i]; B.h.rotation.x=a; B.kn.rotation.x=b; B.fe.rotation.x=c; }); D.O.rotation.x=P.l; D.kopf.rotation.x=P.k[0]; D.kopf.rotation.y=P.k[1];
  D.arme.forEach((A,i)=>{ const [u,z,e]=P.a[i]; A.sh.rotation.x=u; A.sh.rotation.z=(i?1:-1)*z; A.el.rotation.x=e; }); D.kiefer.rotation.x=P.j; }

// ---- Aufbau (aus buildTeufelstisch, nach dem Tisch) ----
function buildTeufel(){ const A=anim.tt, Z=TEUFEL, K=Z.k, q=rng(666), M=c=>lam(c), B=c=>new THREE.MeshBasicMaterial({color:c}), FT=felsTex();
  const haut=M('#7a1c16'), haut2=M('#5a130f'), fell=M('#3a261a'), fell2=M('#281a12'), huf=M('#16110d'), horn=M('#b9a27a'), umh=new THREE.MeshLambertMaterial({color:'#16130f',side:THREE.DoubleSide}), saum=M('#3b2a1c');
  const glut=B('#d2561e'), knochen=M('#e2d8bc'), kette=M('#4a4744'), rost=M('#7d4526'), rost2=M('#5e3420'), schaft=M('#3e2c1e'), flughaut=new THREE.MeshLambertMaterial({color:'#4a100c',side:THREE.DoubleSide}), schwarz=B('#140e0a');
  const add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, piv=(P,x,y,z)=>{ const g=new THREE.Group(); g.position.set(x,y,z); P.add(g); return g; };
  const zyl=(P,r0,r1,h,m,x,y,z,n=8)=>add(P,new THREE.CylinderGeometry(r0,r1,h,n),m,x,y,z), kegel=(P,r,h,m,x,y,z,n=6)=>add(P,new THREE.ConeGeometry(r,h,n),m,x,y,z);
  const kug=(P,r,m,x,y,z,sx=1,sy=1,sz=1)=>{ const o=add(P,new THREE.SphereGeometry(r,10,8),m,x,y,z); o.scale.set(sx,sy,sz); return o; };
  const knoch=(P,ax,ay,bx,by,r,m)=>{ const l=Math.hypot(bx-ax,by-ay), b=zyl(P,r*.7,r,l,m,(ax+bx)/2,(ay+by)/2,0,4); b.rotation.z=-Math.atan2(bx-ax,by-ay); }; // Stab von a nach b (in der xy-Ebene)
  const G=new THREE.Group(); G.scale.setScalar(K); G.userData.ohneBoden=true; world.add(G); const augM=B('#ffc21a'), D=A.teufel={G, augM, d:0, v:0, phi:0, ry:0};
  // Bocksbeine: Oberschenkel mit Zottelfell, Unterschenkel nach hinten, Fessel mit gespaltenem Huf
  D.beine=[1,-1].map(s=>{ const h=piv(G,s*.09,.93,0); zyl(h,.085,.06,.4,fell,0,-.2,0); kug(h,.1,fell2,0,-.03,0,1,1.1,1);
    const kn=piv(h,0,-.4,0); zyl(kn,.055,.035,.33,fell,0,-.165,0); kegel(kn,.04,.12,fell2,0,-.06,-.05).rotation.x=-2.2;
    const fe=piv(kn,0,-.33,0); zyl(fe,.03,.026,.25,haut2,0,-.125,0); kug(fe,.035,fell2,0,0,0); for(const x of [-.018,.018]) add(fe,new THREE.BoxGeometry(.03,.04,.06),huf,x,-.26,.012);
    return {h,kn,fe}; });
  // Oberkörper: sehnig, Brust- und Bauchmuskeln, Gürtel mit Schädeln und Ketten
  const O=D.O=piv(G,0,.93,0);
  kug(O,.15,fell2,0,0,0,1.05,.7,.85); zyl(O,.15,.13,.26,haut,0,.15,0,10); kug(O,.2,haut,0,.36,0,1.05,.85,.68);
  for(const x of [-.07,.07]) kug(O,.07,haut2,x,.38,.075,1,.8,.5); for(let i=0;i<3;i++) for(const x of [-.035,.035]) kug(O,.03,haut2,x,.08+i*.065,.115,1,.8,.45);
  for(const x of [-.2,.2]) kug(O,.075,haut,x,.45,0); zyl(O,.05,.06,.1,haut,0,.53,0);
  { const gu=add(O,new THREE.TorusGeometry(.155,.018,5,16),M('#2a1c14'),0,.02,0); gu.rotation.x=Math.PI/2; gu.scale.y=.8; }
  for(const a of [-.9,0,.9,2.4,-2.4]){ const S=piv(O,Math.sin(a)*.16,-.01,Math.cos(a)*.13); S.rotation.y=a; kug(S,.035,knochen,0,0,0,1,1.05,.95); for(const e of [-.012,.012]) kug(S,.009,schwarz,e,.004,.03); add(S,new THREE.BoxGeometry(.035,.015,.02),knochen,0,-.03,.012); }
  for(let i=0;i<12;i++){ const a=-1.3+i*.12+(i>5?.1:0); kug(O,.009,kette,Math.sin(a)*.17,-.05-.035*Math.sin(Math.PI*(i%6)/5),Math.cos(a)*.14); } // Kette in zwei Bögen
  // Kapuzenumhang hinten (Schultern bis Knie), zerfledderter, verkohlter Saum mit Glutpunkten
  add(O,new THREE.CylinderGeometry(.23,.34,.95,14,1,true,Math.PI*.55,Math.PI*.9),umh,0,.05,-.02);
  for(let i=0;i<16;i++){ const a=Math.PI*(.57+.86*i/15), c=kegel(O,.03,.08+q()*.07,i%3?saum:umh,Math.sin(a)*.34,-.45-.02*q(),Math.cos(a)*.34,4); c.rotation.x=Math.PI; if(i%4===1) kug(O,.012,glut,Math.sin(a)*.345,-.43,Math.cos(a)*.345); }
  // Arme mit Krallenhänden: links die Gabel, rechts der Dreizack (Schaft quer durch die Faust)
  D.arme=[1,-1].map(s=>{ const sh=piv(O,s*.24,.46,0); zyl(sh,.052,.042,.3,haut,0,-.15,0); kug(sh,.045,haut2,s*.012,-.12,.02,1,1.4,1);
    const el=piv(sh,0,-.3,0); zyl(el,.042,.03,.28,haut,0,-.14,0); const ha=piv(el,0,-.28,0); add(ha,new THREE.BoxGeometry(.06,.07,.045),haut2,0,-.035,0);
    for(let i=0;i<4;i++) kegel(ha,.01,.07,huf,-.022+i*.015,-.09,.014,4).rotation.x=Math.PI+.35; kegel(ha,.01,.05,huf,-s*.035,-.04,.02,4).rotation.z=-s*2.2;
    return {sh,el,ha}; });
  { const g=piv(D.arme[0].ha,0,-.03,.01); zyl(g,.008,.008,.17,kette,0,-.1,0,5); add(g,new THREE.BoxGeometry(.045,.012,.008),kette,0,-.19,0); for(const x of [-.018,-.006,.006,.018]) add(g,new THREE.BoxGeometry(.004,.06,.006),kette,x,-.225,0); } // Gabel (≈ 2,7 m)
  { const dz=piv(D.arme[1].ha,0,-.04,0); zyl(dz,.014,.016,1.4,schaft,0,0,.25,6).rotation.x=Math.PI/2; add(dz,new THREE.BoxGeometry(.21,.026,.03),rost,0,0,.96); // Schaft, Querstück
    for(const x of [-.095,0,.095]){ const l=x?.18:.22; zyl(dz,.011,.013,l,x?rost:rost2,x,0,.96+l/2,5).rotation.x=Math.PI/2; kegel(dz,.016,.06,rost2,x,0,.96+l+.03,4).rotation.x=Math.PI/2; kegel(dz,.012,.04,rost,x+(x>=0?.012:-.012),0,.96+l-.03,4).rotation.set(-Math.PI/2,0,x>=0?-.5:.5); } } // drei Zinken mit Widerhaken
  // Kopf: Schädel, Stirnwülste, glühende Augen, Hakennase, spitze Ohren, Widderhörner, Kiefer mit Ziegenbart, Fangzähne, Kapuze im Nacken
  const ko=D.kopf=piv(O,0,.57,0); kug(ko,.095,haut,0,.1,0,1,1.12,1.05); add(ko,new THREE.BoxGeometry(.17,.03,.05),haut2,0,.135,.075).rotation.x=-.3;
  for(const x of [-.038,.038]) kug(ko,.017,augM,x,.115,.088,1.2,.7,.6);
  kegel(ko,.022,.09,haut2,0,.075,.118,5).rotation.x=2.1;
  for(const s of [1,-1]){ kegel(ko,.025,.08,haut,s*.1,.12,-.01,4).rotation.z=-s*1.2; const h=add(ko,new THREE.TorusGeometry(.06,.022,6,12,Math.PI*1.55),horn,s*.095,.12,-.02); h.rotation.set(0,-Math.PI/2,.4*Math.PI); }
  const ki=D.kiefer=piv(ko,0,.06,.03); add(ki,new THREE.BoxGeometry(.1,.03,.075),haut2,0,-.015,.04); kegel(ki,.03,.13,fell2,0,-.09,.065,5).rotation.x=Math.PI-.25;
  for(const x of [-.025,.025]) kegel(ko,.008,.035,M('#efe6cc'),x,.05,.106,4).rotation.x=Math.PI;
  add(ko,new THREE.SphereGeometry(.13,12,9,0,Math.PI*2,0,Math.PI*.62),umh,0,.11,-.04).rotation.x=-.75;
  // Fledermausflügel, angelegt (aufgespannt: rotation.y klein, scale.x 1 – für Runde 2)
  { const fs=new THREE.Shape(); fs.moveTo(0,0); fs.lineTo(.12,.32); fs.lineTo(.62,.2); fs.quadraticCurveTo(.5,.05,.46,-.08); fs.quadraticCurveTo(.36,-.04,.3,-.22); fs.quadraticCurveTo(.2,-.12,.12,-.32); fs.quadraticCurveTo(.06,-.14,0,-.1);
    const fg=new THREE.ShapeGeometry(fs);
    D.fluegel=[1,-1].map(s=>{ const p=piv(O,s*.08,.42,-.14), w=new THREE.Mesh(fg,flughaut); w.scale.x=s; p.add(w); knoch(p,0,0,s*.12,.32,.012,haut2); for(const [x,y] of [[.62,.2],[.46,-.08],[.3,-.22],[.12,-.32]]) knoch(p,s*.12,.32,s*x,y,.008,haut2);
      p.rotation.set(-.15,s*1.25,0); p.scale.x=.5; return p; }); }
  // Schwanz mit Pfeilspitze, hängt nach hinten unten
  { let sp=piv(O,0,-.02,-.14); sp.rotation.x=-2.3; D.schwanz=[]; for(let i=0;i<8;i++){ zyl(sp,.018-i*.0015,.02-i*.0015,.11,haut,0,.055,0,5); D.schwanz.push(sp); const n=piv(sp,0,.11,0); n.rotation.x=.2; sp=n; } kegel(sp,.05,.1,haut2,0,.04,0,4).scale.z=.3; }

  // Felsstuhl hinter dem Tisch: Sitz so hoch, dass die Tischplatte vor der Brust liegt, davor eine Felsstufe für die Hufe
  const Tg=A.tisch; Tg.updateMatrixWorld(true); const sp=Tg.localToWorld(new THREE.Vector3(.9,0,-4.8)), top=Tg.localToWorld(new THREE.Vector3(.9,9.7,0)).y, ry=Tg.rotation.y, sy=top-Z.hoch, gy=bodenY(sp.x,sp.z);
  const S=D.sitz={x:sp.x, z:sp.z, y:sy, ry, gy}, fels=new THREE.MeshLambertMaterial({map:FT}), rot=new THREE.MeshLambertMaterial({map:FT,color:'#f2a48a'}), stein=(x,z)=>{ const g=new THREE.Group(); g.position.set(x,bodenY(x,z)-1,z); g.rotation.y=ry; g.userData.ohneBoden=true; world.add(g); return g; };
  { const g=stein(S.x,S.z), hh=sy-g.position.y; let y=0, j=0; while(y<hh-.01){ const lh=Math.min(hh-y,1.2+q()*1.4), rr=(2.7+q()*.4)*(1-.12*y/hh), c=zyl(g,rr*(.92+q()*.1),rr,lh,j%3?fels:rot,(q()-.5)*.3,y+lh/2,(q()-.5)*.3,9); c.rotation.y=q()*6; c.scale.z=.85; y+=lh; j++; } }
  G.position.set(S.x,sy-.86*K,S.z); G.rotation.y=D.ry=ry; tfPose(D,TF_SITZ); G.updateMatrixWorld(true);
  { const H=D.beine.map(b=>b.fe.localToWorld(new THREE.Vector3(0,-.28,0))), fx=(H[0].x+H[1].x)/2, fz=(H[0].z+H[1].z)/2, hy=Math.min(H[0].y,H[1].y), g=stein(fx,fz), hh=hy-g.position.y; // Felsstufe unter den Hufen
    if(hh>.5) for(let y=0,j=0; y<hh-.01; j++){ const lh=Math.min(hh-y,1+q()*1.2), b=add(g,new THREE.BoxGeometry(4.6+q()*.8,lh,2.8+q()*.5),j%2?rot:fels,(q()-.5)*.3,y+lh/2,(q()-.5)*.3); b.rotation.y=(q()-.5)*.15; y+=lh; } }
  tfTischEssen(A.platte,q); }

// Pfälzer Dreierlei auf der Tischplatte (lokal in A.platte, Oberkante y ≈ 3.1), vor dem Teufel (−z): Teller mit Bratwurst, Leberknödel, Saumagen, Kartoffelbrei, Sauerkraut, Soße, Kirschtomate; Messer daneben, Dubbeglas wie ein Fass
function tfTischEssen(P,q){ const M=c=>lam(c), add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, piv=(P,x,y,z)=>{ const g=new THREE.Group(); g.position.set(x,y,z); P.add(g); return g; };
  const zyl=(P,r0,r1,h,m,x,y,z,n=16)=>add(P,new THREE.CylinderGeometry(r0,r1,h,n),m,x,y,z), kug=(P,r,m,x,y,z,sx=1,sy=1,sz=1)=>{ const o=add(P,new THREE.SphereGeometry(r,12,9),m,x,y,z); o.scale.set(sx,sy,sz); return o; };
  const T=piv(P,0,3.1,-1.95); zyl(T,1.05,.95,.06,M('#f2efe8'),0,.03,0,24); zyl(T,.8,.8,.065,M('#e6e2d8'),0,.035,0,24); zyl(T,.55,.55,.012,M('#6a3a1e'),.05,.07,-.05,20); // Teller mit Rand, Soße
  kug(T,.36,M('#efe2b8'),.32,.1,.3,1,.5,1); // Kartoffelbrei
  for(let i=0;i<9;i++) add(T,new THREE.BoxGeometry(.32,.025,.04),M(i%2?'#d9cf8c':'#cfc27a'),-.4+(q()-.5)*.25,.1+i*.012,.32+(q()-.5)*.25).rotation.y=q()*3; // Sauerkraut
  add(T,new THREE.TorusGeometry(.42,.075,8,18,Math.PI*.95),M('#94562e'),-.15,.11,-.25).rotation.x=Math.PI/2; // Bratwurst im Bogen
  { const s=piv(T,.3,.2,-.45); s.rotation.x=-1.1; zyl(s,.3,.3,.14,M('#6e3f26'),0,0,0,18); zyl(s,.27,.27,.145,M('#b97e66'),0,0,0,18); for(let i=0;i<9;i++){ const a=q()*6.3, o=q()*.22; add(s,new THREE.BoxGeometry(.05,.15,.05),M(i%3?'#e8d8c0':'#d86a2a'),Math.cos(a)*o,0,Math.sin(a)*o); } } // Saumagenscheibe: Kruste, Füllung mit Speck und Möhren
  kug(T,.2,M('#5e4030'),.62,.24,-.05); for(let i=0;i<6;i++) kug(T,.03,M('#3e7a2a'),.62+(q()-.5)*.2,.42,-.05+(q()-.5)*.2); // Leberknödel mit Petersilie
  kug(T,.08,M('#d8241c'),-.62,.13,-.5); // Kirschtomate
  add(P,new THREE.BoxGeometry(.07,.02,1),new THREE.MeshPhongMaterial({color:'#b8bcc0',shininess:80}),-1.35,3.11,-2.15); add(P,new THREE.BoxGeometry(.11,.08,.42),M('#4a3222'),-1.35,3.14,-1.45); // Messer
  { const D=piv(P,-2.2,3.1,-1.7), glas=new THREE.MeshPhongMaterial({color:'#e6efe2',transparent:true,opacity:.3,shininess:90,specular:0xffffff,depthWrite:false,side:THREE.DoubleSide}), delle=new THREE.MeshPhongMaterial({color:'#ffffff',transparent:true,opacity:.45,shininess:90,depthWrite:false});
    zyl(D,.4,.4,.85,new THREE.MeshLambertMaterial({color:'#e9d27a',transparent:true,opacity:.8}),0,.45,0); // Weißweinschorle
    add(D,new THREE.CylinderGeometry(.47,.4,1.15,18,1,true),glas,0,.575,0); zyl(D,.4,.4,.05,glas,0,.025,0); // Glas, leicht konisch
    for(let r=0;r<5;r++) for(let i=0;i<10;i++){ const a=(i+r%2*.5)/10*Math.PI*2, y=.2+r*.19, rr=.405+.07*y/1.15, d=kug(D,.07,delle,Math.sin(a)*rr,y,Math.cos(a)*rr,1,1,.35); d.rotation.y=a; } // Dellen in Reihen
    for(let i=0;i<10;i++) kug(D,.015,M('#fffbe8'),(q()-.5)*.5,.15+q()*.7,(q()-.5)*.5); } } // Bläschen

// Ablauf aus dem Workout: zwei Runden {tT am Tisch, tE Ende der Flucht, dB Meter des Tischs}, Dreizack-Abschnitte, Rückblicke der Kamera [Beginn, Dauer]
function teufelSkript(){ const S=race.woSegs||[], f=l=>S.find(s=>s.label===l), T=R.tt, e1=f('Ertappt'), a1=f('Abgeschüttelt'), e2=f('Wieder am Tisch'), z=f('Schlusssprint'), tt=TEUFEL_T.tisch;
  if(!e1||!a1||!e2||!z) return null;
  const K={r:[{tT:e1.t0+tt, tE:a1.t0, dB:T.tisch}, {tT:e2.t0+tt, tE:z.t0, dB:T.tisch+T.L}], dz:S.filter(s=>s.label==='Dreizack').map(s=>[s.t0,s.dur]), kam:[]};
  for(const r of K.r){ K.kam.push([r.tT+1.2,4.5]); for(let t=r.tT+40;t<r.tE-12;t+=45) if(!K.dz.some(([a,d])=>t+5>a&&t<a+d+2)) K.kam.push([t,3.5]); } // Sprung auf den Weg, dann alle 45 s ein Blick zurück
  for(const [a] of K.dz) K.kam.push([a+.8,3.2]); return K; } // beim Dreizack

// ---- Bewegung (jeden Frame, aus poseTeufelstisch) ----
function poseTeufel(dt){ const D=anim.tt&&anim.tt.teufel; if(!D) return; const run=race.state==='run', rt=run?race.t:0, t=performance.now()/1000, lauf=run&&!race.paused?dt*simSpeed():0, Z=TEUFEL, S=D.sitz;
  if(run&&D.skS!==race.woSegs){ D.sk=teufelSkript(); D.skS=race.woSegs; } const K=run?D.sk:null, ich=riders3d[myKey], rp=ich?ich.g.position:null;
  const sitzP=[S.x,S.y-.86*Z.k,S.z], oben=[S.x,S.y,S.z], zuMir=(x,z,v)=>rp?Math.atan2(rp.x-x,rp.z-z):v, kopfZu=(x,z,ry)=>clampN(Math.atan2(Math.sin(zuMir(x,z,ry)-ry),Math.cos(zuMir(x,z,ry)-ry)),-1.1,1.1);
  const amWeg=d=>{ const p=wegPos(d,-.4); return [p.x,bodenY(p.x,p.z),p.z]; };
  let i=0, rr=null, x=0, ph='sitz'; const e=TEUFEL_T.tisch; // entdeckt dich mit Beginn von „Ertappt“ (e s vor dem Tisch)
  if(K){ i=rt<K.r[1].tT-15?0:1; rr=K.r[i]; x=rt-rr.tT;
    ph=x<-e?'sitz':x<1-e?'merkt':x<3-e?'auf':x<1?'oben':x<3.5?'sprung':rt<rr.tE?'jagd':i?'tobt':'zurueck'; }
  if(i===1&&ph==='sitz') D.heim=null;
  let P, pos=sitzP, ry=S.ry, wut=ph!=='sitz'&&ph!=='zurueck';
  if(ph==='sitz') P=tfEssen(t);
  else if(ph==='merkt'){ const w=bSm((x+e)/.5); P=tfMixP(tfEssen(t),{...TF_SITZ,k:[0,kopfZu(S.x,S.z,S.ry)],j:.2},w); } // hält inne und schaut dich an
  else if(ph==='auf'){ const w=bSm((x+e-1)/2); P=tfMixP({...TF_SITZ,k:[0,kopfZu(S.x,S.z,S.ry)]},TF_STEH,w); pos=tfMix(sitzP,oben,w); ry=D.ry=tfWinkel(S.ry,zuMir(S.x,S.z,S.ry),w*.5); } // steigt auf den Felsstuhl
  else if(ph==='oben'){ D.ry=tfWinkel(D.ry,zuMir(S.x,S.z,D.ry),Math.min(1,dt*3)); ry=D.ry; pos=oben; const w=bSm((x+e-3)/1.2), W={...TF_WUT,a:[TF_WUT.a[0].map((v,k)=>k?v:v+.2*Math.sin(x*7)),TF_WUT.a[1].map((v,k)=>k?v:v+.25*Math.sin(x*6))],j:.3+.12*Math.sin(x*11)}; P=tfMixP(TF_STEH,W,w); } // tobt oben, dreht sich nach dir
  else if(ph==='sprung'){ const w=(x-1)/2.5, e=amWeg(rr.dB+4), hd=headingAt(R,rr.dB+4); pos=tfMix(oben,e,bSm(w)); pos[1]+=7*Math.sin(Math.PI*w); ry=tfWinkel(D.ry,Math.PI/2-hd,bSm(w));
    P=w<.7?tfMixP(TF_WUT,TF_SPRUNG,bSm(w/.3)):tfMixP(TF_SPRUNG,tfLauf(0,1,0),bSm((w-.7)/.3)); D.jagd=-1; }
  else if(ph==='jagd'){ if(D.jagd!==i){ D.jagd=i; D.d=rr.dB+4; D.v=7; } if(me.d-D.d>150||D.d>me.d) D.d=me.d-Z.abst; // nach einem Sprung im Testmodus: gleich hinter dir
    const dz=K.dz.find(([a,d])=>rt>a-2&&rt<a+d+2), nw=dz?bSm((rt-dz[0]+1.5)/1.5)*bSm((dz[0]+dz[1]+1.5-rt)/1.5):0, g=Z.abst+3*Math.sin(rt*.35), gap=g+(Z.nah-g)*nw;
    D.v=clampN(me.v+((me.d-gap)-D.d)*.6,0,me.v+5); D.d+=D.v*lauf; D.phi+=D.v/Z.schritt*2*Math.PI*lauf;
    let st=0; if(dz&&nw>.5){ const c=((rt-dz[0])%2.2)/2.2; st=c<.15?bSm(c/.15):c<.35?1:1-bSm((c-.35)/.5); } // Dreizack-Piekser
    const m=Math.min(1,D.v/4); P=tfLauf(D.phi,m,st); pos=amWeg(D.d); pos[1]+=.025*Z.k*m*Math.abs(Math.cos(D.phi)); ry=D.ry=Math.PI/2-headingAt(R,D.d); D.halt=null; }
  else { // nach der Flucht: bremst ab und bleibt stehen – nach Flucht 1 stapft er zurück an den Tisch und setzt sich, nach Flucht 2 tobt er an der Gabelung
    if(D.halt==null){ D.halt=rt; if(D.jagd!==i||me.d-D.d>150){ D.d=(i?R.tt.gabel+R.tt.L:R.tt.gabel)-10; D.v=0; } } const y=rt-rr.tE;
    if(y<6||ph==='tobt'){ D.v=Math.max(0,D.v-6*lauf); D.d+=D.v*lauf; D.phi+=D.v/Z.schritt*2*Math.PI*lauf; pos=amWeg(D.d); D.ry=ry=tfWinkel(D.ry,ph==='tobt'?zuMir(pos[0],pos[2],D.ry):Math.PI/2-headingAt(R,D.d),Math.min(1,dt*(ph==='tobt'?2:.5)));
      const m=Math.min(1,D.v/4), wt=ph==='tobt'?bSm((y-1.5)/1.5):0, W={...TF_WUT,a:[TF_WUT.a[0].map((v,k)=>k?v:v+.25*Math.sin(y*7)),TF_WUT.a[1].map((v,k)=>k?v:v+.3*Math.sin(y*5))],j:.3+.12*Math.sin(y*11)};
      P=tfMixP(tfLauf(D.phi,m,0),W,wt); if(ph!=='tobt') P.k=[0,.9*Math.sin(y*1.3)]; D.heim=null; } // schaut sich um: wo seid ihr hin?
    else { if(!D.heim){ const a=amWeg(D.d), zx=S.x+Math.cos(S.ry)*6, zz=S.z-Math.sin(S.ry)*6; D.heim={a, z:[zx,bodenY(zx,zz),zz], t0:rr.tE+6, T:Math.max(4,Math.hypot(zx-a[0],zz-a[2])/Z.geh)}; } // quer durch den Wald zurück, neben den Felsstuhl
      const H=D.heim, u=Math.max(0,(rt-H.t0)/H.T); wut=false;
      if(u<1){ const p=tfMix(H.a,H.z,u); p[1]=bodenY(p[0],p[2]); pos=p; ry=D.ry=Math.atan2(H.z[0]-H.a[0],H.z[2]-H.a[2]); D.phi+=Z.geh/(Z.schritt*.6)*2*Math.PI*lauf; P=tfLauf(D.phi,.45,0); P.k=[.15,0]; }
      else { const w=bSm((rt-H.t0-H.T)/1.8); pos=tfMix(H.z,sitzP,w); pos[1]+=4*Math.sin(Math.PI*w); ry=tfWinkel(D.ry,S.ry,w); P=w<1?tfMixP(TF_STEH,TF_SITZ,w):tfEssen(t); } } } // hüpft auf den Stuhl und isst weiter
  tfPose(D,P); D.G.position.set(...pos); D.G.rotation.y=ry; D.schwanz.forEach((s,k)=>s.rotation.z=.12*Math.sin(t*1.8+k*.7));
  D.augM.color.set(wut?'#fff27a':'#ffc21a'); } // Augen glühen heller, wenn er dich entdeckt hat

// ---- Anschleichen (vom Nutzer gewünscht): geduckt in Aero-Haltung am äußersten rechten Wegrand, halb in den Büschen – bis der Teufel dich entdeckt (Beginn von „Ertappt“) ----
function ttGeduckt(){ if(!R||!R.tt||race.state!=='run') return 0; const S=race.woSegs||[], a=S.find(s=>s.label==='Anschleichen'), e=S.find(s=>s.label==='Ertappt'); if(!a||!e) return 0; const rt=race.t;
  return bSm((rt-a.t0)/3)*(1-bSm((rt-e.t0)/1.5)); } // 0 … 1, Haltung in rideState (figuren.js)
function ttSpur(d,t){ const w=ttGeduckt(); return w?t+(roadW(R,d)/2+.15-t)*w:t; } // Spur (aus rennen.js)

// ---- Kamera (aus rennen.js): Blick zurück auf den Teufel – beim Sprung auf den Weg, alle 45 s in der Flucht, beim Dreizack ----
function teufelKamera(dt){ const D=anim.tt&&anim.tt.teufel, ich=riders3d[myKey]; if(!D||!D.sk||race.state!=='run'||!ich) return; const rt=race.t, k=D.sk.kam.find(([a,T])=>rt>=a&&rt<a+T); if(!k) return;
  const [a,T]=k, w=bSm((rt-a)/.6)*bSm((a+T-rt)/.7), rp=ich.g.position, bc=D.G.position, hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), sx=bc.x-rp.x, sz=bc.z-rp.z, sl=Math.hypot(sx,sz)||1;
  const pos=new THREE.Vector3(rp.x+fx*5-sx/sl*2.5, rp.y+2.4, rp.z+fz*5-sz/sl*2.5), look=new THREE.Vector3(bc.x, bc.y+.85*TEUFEL.k, bc.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz);
  camera.position.lerp(pos,w); camera.lookAt(now.lerp(look,w)); } // wie rueckblick (welt-unterwegs.js), Zeit aus dem Workout
