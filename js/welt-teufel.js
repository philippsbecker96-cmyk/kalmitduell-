/* ================= Teufelstisch (Kampagne, Mission 2) – der Teufel =================
   ≈ 22 m, mittelalterlich: Bocksbeine mit Fell und Hufen, sehnige dunkelrote Haut, Krallenhände, große Teufelshörner, glühende Augen, Hakennase, Ziegenbart, Fangzähne,
   angelegte Fledermausflügel, Schwanz mit Pfeilspitze, zerlumpter Kapuzenumhang mit verkohltem Saum, Gürtel mit Schädeln und Ketten, rostiger Dreizack (≈ 17 m).
   Sitzt auf einem Felsstuhl hinter dem Tisch und isst Pfälzer Dreierlei (links die Gabel, rechts hält er den Dreizack), du schleichst geduckt am rechten Wegrand vorbei (ttGeduckt),
   mit Beginn von „Ertappt“ entdeckt er dich (kurz bevor du auf seiner Höhe bist), steigt auf den Stuhl, springt auf den Weg
   und verfolgt dich zu Fuß (Gummiband-Abstand hinter dir, beim Dreizack dicht dran und pieksend). Nach Flucht 1 stolpert er über das Steintor hinter der Gabelung (tfSteintor, TF_STURZ),
   flucht dort und stapft quer durch den Wald zurück an den Tisch – kommt an, wenn du aus der letzten Kurve kommst (TF_R2), steigt auf den Stuhl, ext seinen Schoppen (tfExen, tfGlas),
   reißt die Platte heraus und springt wieder auf den Weg. Im Schlusssprint fällt er zurück und steht außer Atem da, Hände auf den Knien, Rauch aus den Ohren, Schweißtropfen, plumpst dann auf den Hintern (TF_ABH, TF_PUST, TF_PLUMPS, tfSchweiss); Kamera zoomt heran.
   In Dreizack 1 und 2 sticht er zuerst Friedel in den Hintern (TT_PIEK, ttPiekF). Besteckwürfe in Flucht 1 (Gabel, Messer), Runde 2 wütend (Flügel offen, Augen heller, Rauch,
   haut auf den Tisch), reißt die Tischplatte heraus, trägt sie über dem Kopf und wirft sie im Tischwurf neben den Weg (tfWuerfe, tfWurf, tfPlatte, tfGroll). Ablauf aus dem Workout (teufelSkript), Rückblicke der Kamera: teufelKamera */

const TEUFEL={k:12.5, hoch:2.5, abst:16, nah:9, schritt:12, geh:3.5}; // k: Maßstab (Figur 1,75 → ≈ 22 m, vom Nutzer gewünscht: größer) · hoch: Sitz so viele m unter der Tischplatte · abst/nah: Abstand hinter dir in der Flucht / beim Dreizack · schritt: m je Doppelschritt · geh: m/s zurück zum Tisch
// Haltungen: b Beine [Hüfte, Knie, Fessel] (links, rechts) · l Oberkörper vor · k Kopf [nicken, drehen] · a Arme [vor, nach innen, Ellbogen] (links Gabel, rechts Dreizack) · j Kiefer
const TF_SITZ={b:[[-1.2,1.6,-.6],[-1.2,1.6,-.6]], l:.25, k:[.25,0], a:[[-.25,.2,-1.2],[-.35,-.15,-1.25]], j:.05};
const TF_STEH={b:[[-.35,.9,-.75],[-.35,.9,-.75]], l:.05, k:[.15,0], a:[[.1,.15,-.5],[-.5,-.15,-1.1]], j:.1};
const TF_WUT={b:[[-.45,1,-.75],[-.25,.8,-.75]], l:-.08, k:[.2,0], a:[[-1.4,.1,-.8],[-2.6,-.25,1]], j:.38}; // Gabel-Faust vor, Dreizack hoch über dem Kopf, bruellt
const TF_LIEG={b:[[-.1,.2,-.1],[-.15,.3,-.1]], l:0, k:[-.6,0], a:[[-2.8,-.5,-.2],[-2.8,-.5,-.2]], j:.3}; // der Länge nach hingefallen, Arme nach vorn
const TT_TOR={nach:45, h:5, breit:1.3}; // Steintor nach Flucht 1 (vom Nutzer): so viele m hinter der Gabelung auf dem rechten Abzweig (nur in Runde 1), Durchfahrtshöhe, Pfeiler so weit neben dem Weg
const TF_STURZ={fall:1.8, liegen:6.5, auf:2.2, pitch:1.5, lift:.104}; // Teufel stolpert über das Tor: Fallen, Liegenbleiben, Aufrappeln (s) · liegt so weit vornüber, so hoch (× Größe) über dem Weg, damit er flach aufliegt
const TT_TOR_BAEUME=[[9,1,13],[13,-1,15],[18,1,12],[22,-1,14],[27,1,13]]; // Kiefern, die der stürzende Teufel umreißt: [m nach dem Tor, Seite (+1 = rechts), Höhe]
const TT_PIEK={stich:5.6, abst:14, zurueck:4.5}; // Friedel wird in Dreizack 1 und 2 gepiekst: s nach Beginn · Abstand des Teufels hinter dir · so viele m fällt Friedel hinter dich zurück
const TF_PUST={b:[[-.65,1.15,-.8],[-.65,1.15,-.8]], l:.8, k:[-.55,0], a:[[-1,.05,-.25],[-1,.05,-.25]], j:.35}; // außer Atem: vornübergebeugt, Hände auf den Knien, schaut hoch, Maul offen
const TF_R2={an:1.2, blick:.7, steig:1.4, exD:2.6, weg:.8, rip:.3, bruell:1.6}; // Runde 2 (vom Nutzer): am Felsstuhl so viele s, nachdem du an der Kreuzung bist (man sieht die letzten Schritte) · dann nacheinander (s): sieht dich, steigt auf den Stuhl, ext den Schoppen, wirft das Glas weg, reißt die Platte heraus, bruellt – springt frühestens 1 s, nachdem du am Tisch bist
const TF_ABH={zurueck:8, brems:2.4, kam:[-2,15], plumps:[3.4,.45], sehen:1.5}; // Schlusssprint (vom Nutzer): so viele s vor dem Ende fällt er zurück, bremst mit m/s² · Blick zurück [s zum Ende, Dauer] (vom Nutzer: länger, näher) · plumpst so viele s nach dem Stehenbleiben auf den Hintern, Dauer · Zoom: so viel × Größe im Bild
const TF_PLUMPS={b:[[-1.45,.35,-.3],[-1.4,.3,-.35]], l:.3, k:[.35,0], a:[[-.35,.3,-.6],[-.4,-.3,-.6]], j:.45, tief:.8}; // völlig fertig auf dem Hintern: Beine nach vorn, Arme auf den Knien, Kopf hängt · tief: Körper so viel (× Größe) tiefer
const tfTobe=y=>({...TF_WUT, a:[TF_WUT.a[0].map((v,k)=>k?v:v+.22*Math.sin(y*7)),TF_WUT.a[1].map((v,k)=>k?v:v+.28*Math.sin(y*5.5))], j:.3+.12*Math.sin(y*11)}); // schüttelt Faust und Dreizack, bruellt
const tfHeimZiel=S=>{ const x=S.x+Math.cos(S.ry)*6, z=S.z-Math.sin(S.ry)*6; return [x,bodenY(x,z),z]; }; // neben dem Felsstuhl
const TF_MERK={vor:4.5, frier:.35, blick:[.35,.6], teller:1.1, zu:1.25, schreck:1.5, hop:.6, ende:2.9, auf:4.4, hoch:2.6}; // Ertappt (vom Nutzer): Friedel verrät euch so viele s vorher · dann (s nach Beginn von „Ertappt“) erstarrt er mit der Gabel vor dem Maul, Doppelblick (kurz rüber, zurück auf den Teller, ruckartig zu dir), schreckt auf (hüpft so viele m hoch), setzt sich wieder, steigt auf den Stuhl
const TF_SCHRECK={b:[[-1.55,1.1,-.25],[-1.45,1.25,-.3]], l:-.28, k:[-.3,0], a:[[-2.3,-.95,-.25],[-2.1,-.9,-.3]], j:.45}; // Cartoon-Schreck: Arme hochgerissen und gespreizt, Beine hoch, lehnt sich zurück, Maul weit auf
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
  const hornA=M('#5a1a14'), hornB=M('#1e0f0b'), glut=B('#d2561e'), knochen=M('#e2d8bc'), kette=M('#4a4744'), rost=M('#7d4526'), rost2=M('#5e3420'), schaft=M('#3e2c1e'), flughaut=new THREE.MeshLambertMaterial({color:'#4a100c',side:THREE.DoubleSide}), schwarz=B('#140e0a');
  const add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, piv=(P,x,y,z)=>{ const g=new THREE.Group(); g.position.set(x,y,z); P.add(g); return g; };
  const zyl=(P,r0,r1,h,m,x,y,z,n=8)=>add(P,new THREE.CylinderGeometry(r0,r1,h,n),m,x,y,z), kegel=(P,r,h,m,x,y,z,n=6)=>add(P,new THREE.ConeGeometry(r,h,n),m,x,y,z);
  const kug=(P,r,m,x,y,z,sx=1,sy=1,sz=1)=>{ const o=add(P,new THREE.SphereGeometry(r,10,8),m,x,y,z); o.scale.set(sx,sy,sz); return o; };
  const knoch=(P,ax,ay,bx,by,r,m)=>{ const l=Math.hypot(bx-ax,by-ay), b=zyl(P,r*.7,r,l,m,(ax+bx)/2,(ay+by)/2,0,4); b.rotation.z=-Math.atan2(bx-ax,by-ay); }; // Stab von a nach b (in der xy-Ebene)
  const G=new THREE.Group(); G.scale.setScalar(K); G.rotation.order='YXZ'; G.userData.ohneBoden=true; world.add(G); const augM=B('#ffc21a'), D=A.teufel={G, augM, d:0, v:0, phi:0, ry:0};
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
  { const g=D.gabel=piv(D.arme[0].ha,0,-.03,.01); zyl(g,.008,.008,.17,kette,0,-.1,0,5); add(g,new THREE.BoxGeometry(.045,.012,.008),kette,0,-.19,0); for(const x of [-.018,-.006,.006,.018]) add(g,new THREE.BoxGeometry(.004,.06,.006),kette,x,-.225,0);
    const w=D.gabelWurst=kug(g,.022,M('#94562e'),0,-.235,0,3,1,1); w.visible=false;
    const m=D.messer=piv(D.arme[0].ha,0,-.03,.01); add(m,new THREE.BoxGeometry(.016,.09,.03),M('#4a3222'),0,-.05,0); add(m,new THREE.BoxGeometry(.006,.17,.028),new THREE.MeshPhongMaterial({color:'#b8bcc0',shininess:80}),0,-.18,.004); m.visible=false; } // Gabel (≈ 3 m), beim Essen mit aufgespießter Bratwurst · Messer vom Tisch (nimmt er beim Aufstehen mit, für den zweiten Besteckwurf)
  { const dz=D.dz=piv(D.arme[1].ha,0,-.04,0); D.dz0=dz.position.clone(); zyl(dz,.014,.016,1.4,schaft,0,0,.25,6).rotation.x=Math.PI/2; add(dz,new THREE.BoxGeometry(.21,.026,.03),rost,0,0,.96); // Schaft, Querstück
    for(const x of [-.095,0,.095]){ const l=x?.18:.22; zyl(dz,.011,.013,l,x?rost:rost2,x,0,.96+l/2,5).rotation.x=Math.PI/2; kegel(dz,.016,.06,rost2,x,0,.96+l+.03,4).rotation.x=Math.PI/2; kegel(dz,.012,.04,rost,x+(x>=0?.012:-.012),0,.96+l-.03,4).rotation.set(-Math.PI/2,0,x>=0?-.5:.5); } } // drei Zinken mit Widerhaken
  // Kopf: Schädel, Stirnwülste, glühende Augen, Hakennase, spitze Ohren, große Teufelshörner, Kiefer mit Ziegenbart, Fangzähne, Kapuze im Nacken
  const ko=D.kopf=piv(O,0,.57,0); kug(ko,.095,haut,0,.1,0,1,1.12,1.05); add(ko,new THREE.BoxGeometry(.17,.03,.05),haut2,0,.135,.075).rotation.x=-.3;
  D.augen=[-.038,.038].map(x=>kug(ko,.017,augM,x,.115,.088,1.2,.7,.6));
  kegel(ko,.022,.09,haut2,0,.075,.118,5).rotation.x=2.1;
  for(const s of [1,-1]){ kegel(ko,.025,.08,haut,s*.1,.12,-.01,4).rotation.z=-s*1.2; // spitze Ohren
    let h=piv(ko,s*.05,.17,.05); h.rotation.set(-.2,0,-s*.75); for(let j=0;j<5;j++){ const r0=.034-j*.006; zyl(h,r0*.82,r0,.062,j<3?hornA:hornB,0,.031,0,8); const n=piv(h,0,.062,0); n.rotation.set(-.08,0,s*.32); h=n; } kegel(h,.009,.05,hornB,0,.025,0,6); } // klassische Teufelshörner (vom Nutzer gewünscht): aus der Stirn nach außen, dann nach oben und innen gebogen
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
  tfTischEssen(A.platte,q); tfSteintor(q,fels,rot);
  const wo=(o,seite,lang)=>({o,h:o.parent,L:{p:o.position.clone(),q:o.quaternion.clone(),s:o.scale.clone()},st:'hand',seite,lang}); // Wurfgeschosse: Halter und Lage in der Hand merken
  D.gabelW=wo(D.gabel,1,.25); D.messerW=wo(D.messer,-1,.27); D.platteW={st:'tisch',L:{p:A.platte.position.clone(),q:A.platte.quaternion.clone(),s:A.platte.scale.clone()}};
  const st=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(196,150,110,.9)'); gr.addColorStop(1,'rgba(196,150,110,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
  D.rauch=[]; for(let i=0;i<10;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:st,color:'#3a3634',transparent:true,depthWrite:false,opacity:0})); s.visible=false; world.add(s); D.rauch.push(s); } // Rauch aus den Nüstern und zwischen den Hörnern (Runde 2)
  D.puffSp=[]; for(let i=0;i<30;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:st,transparent:true,depthWrite:false,opacity:0})); s.visible=false; world.add(s); D.puffSp.push(s); } D.puffs=[]; // Staub bei Einschlägen
  D.staub=[]; for(let i=0;i<22;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:st,transparent:true,depthWrite:false,opacity:0})); s.visible=false; world.add(s); D.staub.push(s); } // Staubwolke beim Sturz
  tfComicBau(D); }

// Steintor auf dem rechten Abzweig hinter der Gabelung (wie das Felsentor des Bogenschützen auf Berwartstein): zwei Pfeiler aus Buntsandstein-Schichten, Deckplatten, Kiefer obendrauf
function tfSteintor(q,fels,rot){ const To=R.tt.tor, d=To.d, p=wegPos(d,0), h=headingAt(R,d), rw=roadW(R,d)/2, y0=roadY(d), G=new THREE.Group(), Z=TT_TOR, xo=rw+Z.breit; G.position.set(p.x,y0,p.z); G.rotation.y=Math.PI/2-h; G.userData.ohneBoden=true; world.add(G);
  const add=(w,hh,dd,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,dd),m); b.position.set(x,y,z); G.add(b); return b; };
  for(const s of [-1,1]){ const wp=wegPos(d,-s*xo); let y=bodenY(wp.x,wp.z)-y0-1, j=0; while(y<Z.h-.01){ const lh=Math.min(Z.h-y,.8+q()*.9); add(2.2+q()*.5,lh,2.8+q()*.4,j%2?rot:fels,s*xo+(q()-.5)*.2,y+lh/2,(q()-.5)*.2).rotation.y=(q()-.5)*.12; y+=lh; j++; } } // Pfeiler (lokal +x = links)
  const L=2*xo+2.6; add(L,1,3.2,rot,0,Z.h+.5,0); add(L-.8,.7,2.8,fels,.2,Z.h+1.35,.1).rotation.z=.02; add(L-2.4,.35,2.2,rot,-.3,Z.h+1.88,0); To.top=y0+Z.h+2.05; // Deckplatten
  tfTorBaeume(q);
  { const n=lam('#36552d'), k=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,2.6,5),lam('#8f5136')); k.position.set(xo*.6,Z.h+3.3,.2); k.rotation.z=.25; G.add(k); for(const [x,y,s] of [[0,1.4,1.1],[.5,.9,.8],[-.4,1.1,.7]]){ const c=new THREE.Mesh(new THREE.IcosahedronGeometry(s,0),n); c.position.set(xo*.6+.35+x,Z.h+3.3+y,.2); c.scale.set(1.4,.55,1.1); G.add(c); } } } // Krüppelkiefer

// Kiefern hinter dem Tor am Wegrand: Drehpunkt am Stammfuß, kippen nach außen, wenn der Teufel hinschlägt (tfBaeumeUm)
function tfTorBaeume(q){ const To=R.tt.tor, st=lam('#5e4130'), nd=[lam('#2f4a2a'),lam('#3a5530')]; To.baeume=TT_TOR_BAEUME.map(([dd,sd,h],j)=>{ const d=To.d+dd, p=wegPos(d,sd*(roadW(R,d)/2+2.2+q()*.8)), hd=headingAt(R,d), G=new THREE.Group(); G.rotation.order='YXZ'; G.rotation.y=Math.atan2(-sd*Math.sin(hd),sd*Math.cos(hd)); G.position.set(p.x,bodenY(p.x,p.z)-.3,p.z); G.userData.ohneBoden=true;
    const s=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,h,7),st); s.position.y=h/2; G.add(s); for(let k=0;k<4;k++){ const c=new THREE.Mesh(new THREE.IcosahedronGeometry(2.2-k*.3,0),nd[k%2]); c.position.set((q()-.5)*1.2,h*.62+k*h*.11,(q()-.5)*1.2); c.scale.set(1.3,.6,1.2); G.add(c); } world.add(G); return {G,j}; }); } // Stamm, Kronenbüschel
function tfBaeumeUm(D,rt,run){ const B=R.tt.tor.baeume; if(!B) return; if(!run||D.umT!=null&&rt<D.umT) D.umT=null; if(D.trip!=null&&D.umT==null) D.umT=D.trip; const F=TF_STURZ;
  B.forEach(b=>{ const y=D.umT==null?-1:rt-(D.umT+F.fall*.8+b.j*.09); b.G.rotation.x=y<0?0:1.35*Math.min(1,Math.pow(y/1.1,2))+(y>1.1?.04*Math.sin((y-1.1)*12)*Math.exp(-(y-1.1)*5):0); }); } // fällt immer schneller, wippt beim Aufschlag, bleibt liegen
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
  anim.tt.tischMesser=[add(P,new THREE.BoxGeometry(.07,.02,1),new THREE.MeshPhongMaterial({color:'#b8bcc0',shininess:80}),-1.35,3.11,-2.15), add(P,new THREE.BoxGeometry(.11,.08,.42),M('#4a3222'),-1.35,3.14,-1.45)]; // Messer
  { const D=piv(P,-2.7,3.1,-1.4), glas=new THREE.MeshPhongMaterial({color:'#e6efe2',transparent:true,opacity:.3,shininess:90,specular:0xffffff,depthWrite:false,side:THREE.DoubleSide}), delle=new THREE.MeshPhongMaterial({color:'#ffffff',transparent:true,opacity:.45,shininess:90,depthWrite:false});
    D.scale.setScalar(1.8); const wein=zyl(D,.4,.4,.85,new THREE.MeshLambertMaterial({color:'#e9d27a',transparent:true,opacity:.8}),0,.45,0); anim.tt.glas={G:D, wein, par:P, L:{p:D.position.clone(),q:D.quaternion.clone(),s:D.scale.clone()}, st:'tisch'}; // Weißweinschorle (vom Nutzer: groß, damit man ihn von unten sieht; in Runde 2 ext er ihn)
    add(D,new THREE.CylinderGeometry(.47,.4,1.15,18,1,true),glas,0,.575,0); zyl(D,.4,.4,.05,glas,0,.025,0); // Glas, leicht konisch
    for(let r=0;r<5;r++) for(let i=0;i<10;i++){ const a=(i+r%2*.5)/10*Math.PI*2, y=.2+r*.19, rr=.405+.07*y/1.15, d=kug(D,.07,delle,Math.sin(a)*rr,y,Math.cos(a)*rr,1,1,.35); d.rotation.y=a; } // Dellen in Reihen
    for(let i=0;i<10;i++) kug(D,.015,M('#fffbe8'),(q()-.5)*.5,.15+q()*.7,(q()-.5)*.5); } } // Bläschen

// Ablauf aus dem Workout: zwei Runden {tT am Tisch, tE Ende der Flucht, dB Meter des Tischs}, Dreizack-Abschnitte, Rückblicke der Kamera [Beginn, Dauer]
function teufelSkript(){ const S=race.woSegs||[], f=l=>S.find(s=>s.label===l), T=R.tt, e1=f('Ertappt'), a1=f('Abgeschüttelt'), e2=f('Wieder am Tisch'), z=f('Schlusssprint'), tt=TEUFEL_T.tisch;
  if(!e1||!a1||!e2||!z) return null;
  const Z2=TF_R2, t2=e2.t0+tt, zE=z.t0+z.dur, tA=T.tKr!=null?T.tKr+Z2.an:t2-10, tSt=tA+Z2.blick, ex=tSt+Z2.steig, rip=ex+Z2.exD+Z2.weg+Z2.rip, tS=Math.max(t2+1,rip+Z2.bruell); // Runde 2: tA wieder am Felsstuhl, tSt steigt auf, ex ext, rip Platte, tS Sprung
  const K={r:[{tT:e1.t0+tt, tS:e1.t0+tt+1, tE:a1.t0, dB:T.tisch}, {tT:t2, tA, tSt, tS, tE:zE-TF_ABH.zurueck, dB:T.tisch+T.L}], dz:S.filter(s=>s.label==='Dreizack').map(s=>[s.t0,s.dur]), kam:[]};
  for(const r of K.r){ K.kam.push([r.tS+.2,4.5]); for(let t=r.tT+40;t<Math.min(r.tE,r.tA?z.t0:1e9)-12;t+=45) if(!K.dz.some(([a,d])=>t+5>a&&t<a+d+2)) K.kam.push([t,3.5]); } // Sprung auf den Weg, dann alle 45 s ein Blick zurück
  for(const [a] of K.dz) K.kam.push([a+.8,3.2]); // beim Dreizack
  const bw=S.filter(s=>s.label==='Besteckwurf'); K.bw=bw.length?[bw[0].t0]:[]; for(const t0 of K.bw) K.kam.unshift([t0-.6,1.6]); const tw=f('Tischwurf'); K.tw=tw?tw.t0:null; if(K.tw!=null) K.kam.unshift([K.tw-.4,2]); // Besteckwurf in Flucht 1: nur die Gabel (vom Nutzer: ein Besteckwurf reicht), Blick zurück beim Ausholen, dann sieht man sie vor sich stecken · Tischwurf in Flucht 2 (kurzer Blick zurück beim Ausholen)
  K.kam=K.kam.filter(([a,T])=>T!==3.5||![...K.bw,K.tw].some(w=>w!=null&&a>w-5&&a<w+7)); // keine 45-s-Rückblicke um die Würfe – dann sieht man Gabel und Platte vor sich
  K.kam.push([zE+TF_ABH.kam[0],TF_ABH.kam[1]]); // Schlusssprint: Blick zurück auf den abgehängten Teufel
  K.rip=rip; K.ex=ex; return K; } // Runde 2: ext den Schoppen, dann reißt er die Tischplatte heraus

// ---- Bewegung (jeden Frame, aus poseTeufelstisch) ----
function poseTeufel(dt){ const D=anim.tt&&anim.tt.teufel; if(!D) return; const run=race.state==='run', rt=run?race.t:0, t=performance.now()/1000, lauf=run&&!race.paused?dt*simSpeed():0, Z=TEUFEL, S=D.sitz;
  if(run&&D.skS!==race.woSegs){ D.sk=teufelSkript(); D.skS=race.woSegs; } const K=run?D.sk:null, ich=riders3d[myKey], rp=ich?ich.g.position:null;
  const sitzP=[S.x,S.y-.86*Z.k,S.z], oben=[S.x,S.y,S.z], zuMir=(x,z,v)=>rp?Math.atan2(rp.x-x,rp.z-z):v, kopfZu=(x,z,ry)=>clampN(Math.atan2(Math.sin(zuMir(x,z,ry)-ry),Math.cos(zuMir(x,z,ry)-ry)),-1.1,1.1);
  const amWeg=d=>{ const p=wegPos(d,-.4); return [p.x,bodenY(p.x,p.z),p.z]; };
  let i=0, rr=null, x=0, ph='sitz'; const e=TEUFEL_T.tisch; // entdeckt dich mit Beginn von „Ertappt“ (e s vor dem Tisch)
  if(K){ i=rt<K.r[1].tA?0:1; rr=K.r[i]; x=rt-rr.tT; const Z2=TF_R2;
    ph=i?(rt<rr.tSt?'da':rt<K.ex?'steigt':rt<rr.tS?'oben':rt<rr.tS+2.5?'sprung':rt<rr.tE?'jagd':'abh'):(x<-e?'sitz':x<TF_MERK.ende-e?'merkt':x<TF_MERK.auf-e?'auf':x<1?'oben':x<3.5?'sprung':rt<rr.tE?'jagd':'zurueck'); } // Runde 2: kommt gerade zurück, sieht dich, steigt auf den Stuhl
  if(ph!=='merkt') D.schreck=null; D.schreckW=0; let P, pos=sitzP, ry=S.ry, wut=ph!=='sitz'&&ph!=='zurueck'; const zorn=!!K&&(i===1||ph==='zurueck'&&D.trip!=null), sitzt=zorn?tfGroll(t):tfEssen(t); // Runde 2: wütend (Flügel offen, Augen heller, Rauch), isst nicht mehr, haut mit der Faust auf den Tisch
  if(ph==='sitz') P=sitzt;
  else if(ph==='merkt'){ const y=x+e, M=TF_MERK, kz=kopfZu(S.x,S.z,S.ry), kk=y<M.blick[0]?0:y<M.blick[1]?kz*.6*bSm((y-M.blick[0])/.12):y<M.teller?kz*.6*(1-bSm((y-M.blick[1])/.15)):kz*bSm((y-M.zu)/.1), s=y-M.schreck; D.schreck=y; // Doppelblick: kurz rüber, zurück auf den Teller, ruckartig zu dir
    P=tfMixP(sitzt,{...TF_SITZ, a:[[-.45,.38,-2.15],TF_SITZ.a[1]], k:[y>=M.blick[1]&&y<M.teller?.35:.05,kk], j:.3},bSm(y/M.frier)); // erstarrt mit der Gabel vor dem offenen Maul
    if(s>=0){ const zit=.07*Math.sin(t*41), SR={...TF_SCHRECK,k:[TF_SCHRECK.k[0]+zit,kz]}; P=s<M.hop?tfMixP(P,SR,bSm(s/.1)):tfMixP(SR,{...TF_SITZ,k:[0,kz]},bSm((s-M.hop)/(M.ende-M.schreck-M.hop))); // schreckt auf, zittert, setzt sich wieder
      pos=[...sitzP]; pos[1]+=M.hoch*Math.max(0,Math.sin(Math.PI*Math.min(1,s/M.hop))); D.schreckW=1-bSm((s-M.hop)/.8); } }
  else if(ph==='auf'){ const w=bSm((x+e-TF_MERK.ende)/(TF_MERK.auf-TF_MERK.ende)); P=tfMixP({...TF_SITZ,k:[0,kopfZu(S.x,S.z,S.ry)]},TF_STEH,w); pos=tfMix(sitzP,oben,w); ry=D.ry=tfWinkel(S.ry,zuMir(S.x,S.z,S.ry),w*.5); } // steigt auf den Felsstuhl
  else if(ph==='da'){ pos=tfHeimZiel(S); D.ry=ry=tfWinkel(D.ry,zuMir(pos[0],pos[2],D.ry),Math.min(1,dt*2.5)); const y=rt-rr.tA; P=tfMixP(tfLauf(D.phi,.45*(1-bSm(y/.6)),0),{...TF_STEH,k:[.1,0],j:.15+.1*Math.sin(t*6)},bSm(y/.8)); } // Runde 2: gerade angekommen, sieht dich, schnaubt
  else if(ph==='steigt'){ const w=bSm((rt-rr.tSt)/TF_R2.steig); pos=tfMix(tfHeimZiel(S),oben,w); pos[1]+=3*Math.sin(Math.PI*w); D.ry=ry=tfWinkel(D.ry,zuMir(S.x,S.z,D.ry),Math.min(1,dt*3)); P=tfMixP(TF_STEH,TF_STEH,0); } // springt auf den Felsstuhl
  else if(ph==='oben'){ D.ry=tfWinkel(D.ry,zuMir(S.x,S.z,D.ry),Math.min(1,dt*3)); ry=D.ry; pos=oben; const w=i?bSm((rt-K.ex-TF_R2.exD)/1):bSm((x+e-TF_MERK.auf)/1); P=tfMixP(TF_STEH,tfTobe(x),w); if(i) tfExen(P,rt-K.ex); } // tobt oben, dreht sich nach dir · Runde 2: erst den Schoppen exen
  else if(ph==='sprung'){ const w=(rt-rr.tS)/2.5, e=amWeg(rr.dB+4), hd=headingAt(R,rr.dB+4); pos=tfMix(oben,e,bSm(w)); pos[1]+=7*Math.sin(Math.PI*w); ry=tfWinkel(D.ry,Math.PI/2-hd,bSm(w));
    P=w<.7?tfMixP(TF_WUT,TF_SPRUNG,bSm(w/.3)):tfMixP(TF_SPRUNG,tfLauf(0,1,0),bSm((w-.7)/.3)); D.jagd=-1; }
  const jag=gap=>{ D.v=clampN(me.v+((me.d-gap)-D.d)*.6,0,me.v+5); D.d+=D.v*lauf; D.phi+=D.v/Z.schritt*2*Math.PI*lauf; const m=Math.min(1,D.v/4); pos=amWeg(D.d); pos[1]+=.025*Z.k*m*Math.abs(Math.cos(D.phi)); ry=D.ry=Math.PI/2-headingAt(R,D.d); return m; };
  const heim=t0=>{ if(!D.heim){ const a=amWeg(D.d), z=tfHeimZiel(S), tA=K.r[1].tA; let T=Math.hypot(z[0]-a[0],z[2]-a[2])/Z.geh; if(tA-t0<T) T=Math.max(4,tA-t0); D.heim={a, z, t0:Math.max(t0,tA-T), T}; } // quer durch den Wald zurück, neben den Felsstuhl – kommt an, wenn du aus der letzten Kurve kommst
    const H=D.heim, u=(rt-H.t0)/H.T; wut=false;
    if(u<0){ pos=H.a; ry=D.ry=tfWinkel(D.ry,zuMir(pos[0],pos[2],D.ry),Math.min(1,dt*2)); P=tfMixP(TF_STEH,tfTobe(rt),bSm(Math.sin(rt*.5)*2)); wut=true; } // steht erst noch fluchend am Steintor
    else if(u<1){ const p=tfMix(H.a,H.z,u); p[1]=bodenY(p[0],p[2]); pos=p; ry=D.ry=Math.atan2(H.z[0]-H.a[0],H.z[2]-H.a[2]); D.phi+=Z.geh/(Z.schritt*.6)*2*Math.PI*lauf; P=tfLauf(D.phi,.45,0); P.k=[.15,0]; }
    else { pos=H.z; P=tfMixP(TF_STEH,TF_STEH,0); } }; // angekommen (dann beginnt Runde 2)
  let pitch=0, pf=null; D.dzL=0; D.pust=0; D.sitz=0;
  if(ph==='jagd'){ if(D.jagd!==i){ D.jagd=i; D.d=rr.dB+4; D.v=7; } if(me.d-D.d>150||D.d>me.d) D.d=me.d-Z.abst; // nach einem Sprung im Testmodus: gleich hinter dir
    pf=ttPiekF(rt,8); const dz=K.dz.find(([a,d])=>rt>a-2&&rt<a+d+2), nw=dz?bSm((rt-dz[0]+1.5)/1.5)*bSm((dz[0]+dz[1]+1.5-rt)/1.5):0, g=Z.abst+3*Math.sin(rt*.35);
    const m=jag(pf?TT_PIEK.abst:g+(Z.nah-g)*nw); let st=0; if(dz&&nw>.5&&!pf){ const c=((rt-dz[0])%2.2)/2.2; st=c<.15?bSm(c/.15):c<.35?1:1-bSm((c-.35)/.5); } // Dreizack-Piekser – in Dreizack 1 und 2 zuerst auf Friedel
    P=tfLauf(D.phi,m,st); D.halt=null; D.trip=null; D.heim=null; }
  else if(ph==='zurueck'){ // nach Flucht 1: rennt dir auf den rechten Abzweig nach, stolpert über das Steintor, fällt der Länge nach hin, rappelt sich auf und stapft zurück an den Tisch
    const To=R.tt.tor, F=TF_STURZ, dU=To.d+8; if(D.halt==null){ D.halt=rt; D.trip=null; D.heim=null; if(D.jagd!==i||me.d-D.d>150){ D.d=Math.min(me.d-Z.abst,To.d-3); D.v=0; } }
    if(D.trip==null&&rt-rr.tE>25) D.trip=rt-F.fall-F.liegen-F.auf; // Sprung im Testmodus: schon vorbei
    if(D.trip==null){ const m=jag(Z.abst); if(D.d>=To.d-3){ D.d=To.d-3; D.trip=rt; } P=tfLauf(D.phi,m,0); }
    else { const y=rt-D.trip, p0=amWeg(To.d-3), pT=(()=>{ const q=wegPos(To.d+.3,-.4); return [q.x,To.top,q.z]; })(), pL=amWeg(To.d+3), PL=F.pitch, hd=Math.PI/2-headingAt(R,To.d); pL[1]+=F.lift*Z.k;
      ry=D.ry=hd;
      if(y<F.fall){ const w=y/F.fall, a=bSm(Math.min(1,w/.45)); pos=w<.45?tfMix(p0,pT,a):tfMix(pT,pL,bSm((w-.45)/.55)); if(w<.45) pos[1]+=1.2*Math.sin(Math.PI*a); pitch=PL*Math.pow(w,2.2); P=tfMixP(tfLauf(D.phi,1,0),TF_LIEG,bSm(w/.8)); D.staubT=null; D.dzL=bSm(w); } // Füße bleiben am Tor hängen, kippt wie ein gefällter Baum der Länge nach auf den Weg
      else if(y<F.fall+F.liegen){ const z=y-F.fall; if(D.staubT==null){ D.staubT=rt; const q=wegPos(To.d+3+1.6*Z.k,-.4); D.staubP=[pL[0],pL[1]-F.lift*Z.k,pL[2]]; D.staubB=[q.x,bodenY(q.x,q.z),q.z]; }
        pos=pL; pos[1]+=.5*Math.abs(Math.sin(z*8))*Math.exp(-z*5); pitch=PL; P={...TF_LIEG,k:[-.6,z>2?.35*Math.sin(z*2.2):0]}; D.dzL=1; } // schlägt auf, federt nach, liegt, schüttelt den Kopf
      else if(y<F.fall+F.liegen+F.auf){ const w=bSm((y-F.fall-F.liegen)/F.auf); pos=tfMix(pL,amWeg(dU),w); pitch=PL*(1-w); P=tfMixP(TF_LIEG,TF_STEH,w); D.dzL=1-w; }
      else { D.d=dU; heim(D.trip+F.fall+F.liegen+F.auf); } } }
  else if(ph==='abh'){ const y=rt-rr.tE; if(D.jagd!==i||me.d-D.d>400){ D.d=me.d-(y>3?70:Z.abst); D.v=y>3?0:me.v; D.abhT=y>3?rt-9:null; } D.jagd=i; // Schlusssprint: kommt nicht mehr mit, wird langsamer und bleibt außer Atem stehen
    D.v=Math.max(0,D.v-TF_ABH.brems*lauf); D.d+=D.v*lauf; D.phi+=D.v/Z.schritt*2*Math.PI*lauf; pos=amWeg(D.d); if(D.v>.3) D.ry=Math.PI/2-headingAt(R,D.d); const m=Math.min(1,D.v/4), w=1-bSm((D.v-.5)/3), b=Math.sin(t*3);
    if(w>.95&&D.abhT==null) D.abhT=rt; const z=D.abhT==null?0:rt-D.abhT, [p0,pd]=TF_ABH.plumps, u=bSm((z-p0)/pd), PS=TF_PLUMPS, kipp=Math.max(0,Math.sin(z*.9)); ry=D.ry+.07*Math.sin(t*1.3)*w*(1-u); // schwankt, solange er steht
    const steh={...TF_PUST, l:TF_PUST.l+.12*b, k:[TF_PUST.k[0]+.12*b,0], a:TF_PUST.a.map(A=>[A[0]+.08*b,A[1],A[2]]), j:.32+.18*b}, sitz={...PS, l:PS.l+.1*b, k:[PS.k[0]-.75*kipp+.06*b,.15*Math.sin(t*.6)], a:PS.a.map(A=>[A[0]+.1*b,A[1],A[2]]), j:PS.j-.1+.2*Math.abs(b)}; // tief und langsam schnaufen, sitzend legt er immer wieder den Kopf in den Nacken und japst
    P=tfMixP(tfLauf(D.phi,m,0),tfMixP(steh,sitz,u),w); const zb=z-p0-pd; pos[1]-=(.055*w*(1-u)+PS.tief*u)*Z.k-(zb>0?.06*Z.k*Math.exp(-zb*6)*Math.abs(Math.sin(zb*14)):0); D.pust=w; D.sitz=u; } // Hände auf den Knien, dann plumpst er auf den Hintern und federt nach
  const wa=pf?bSm((pf.y-4.4)/.4)*(1-bSm((pf.y-6.6)/.4)):0; if(wa>0) P.a[1]=tfMix(P.a[1],[-.7,-.05,-.2],wa); // Arm zum Stich auf Friedel
  const aus=(t0,rel)=>{ const y=rt-t0; return K&&y>-.1&&y<rel-t0+.5?(y<rel-t0?bSm(y/(rel-t0-.15)):1-bSm((y-(rel-t0))/.5)):0; }, wurfArm=(t0,rel)=>{ const y=rt-t0, r=rel-t0; return y<r-.15?[-3,-.1,-.6]:[-1.3,.1,-.2]; }; // Ausholen und Werfen mit links
  if(K) for(const t0 of K.bw){ const w=aus(t0,t0+1.15); if(w>0) P.a[0]=tfMix(P.a[0],wurfArm(t0,t0+1.15),w); }
  const pl=D.platteW, tr=K&&pl&&rt>=K.rip&&(K.tw==null||rt<K.tw+1.3); if(tr){ const w=bSm((rt-K.rip)/1.2), y=K.tw!=null?rt-K.tw:-9, wb=y>-.1?bSm(y/1.1):0; P.a[0]=tfMix(P.a[0],tfMix([-2.9,-.15,-.25],[-3.4,-.15,-.7],wb),w); } // Tischplatte über dem Kopf, zum Wurf weiter nach hinten
  tfPose(D,P); D.G.position.set(...pos); D.G.rotation.y=ry; D.G.rotation.x=pitch; const sw=D.schreckW; D.schwanz.forEach((s,k)=>{ s.rotation.z=.12*Math.sin(t*1.8+k*.7)*(1-sw)+.06*sw*Math.sin(t*47+k); s.rotation.x=k?.2*(1-sw):-2.3+1*sw; }); // beim Schreck steht der Schwanz kerzengerade
  D.flW=(D.flW||0)+((zorn?1:0)-(D.flW||0))*Math.min(1,dt*2); D.fluegel.forEach((f,k)=>{ const s=k?-1:1, w=D.flW; f.rotation.set(-.15+.3*w,s*(1.25-1.05*w),s*w*(.15+.1*Math.sin(t*3.2))); f.scale.x=.5+.5*w; }); // Flügel spreizen sich, schlagen leicht
  D.augM.color.set(zorn||sw>.3?'#fffbe6':wut?'#fff27a':'#ffc21a'); { const f=zorn?1.35:1+.7*sw; D.augen.forEach(a=>a.scale.set(1.2*f,.7*f,.6*f)); }
  tfWuerfe(D,K,rt,run,zorn,ph,t); tfGlas(D,K,rt); tfComic(D,rt,t); if(D.schreck==null&&D.pust>.5) tfSchweiss(D,t);
  // Stich auf Friedel: Dreizack zielt auf seinen Hintern, gleitet in der Faust nach vorn bis knapp hinein
  const Fr=anim.tt.friedel, dz=D.dz; dz.position.copy(D.dz0); dz.quaternion.set(0,0,0,1); if(D.dzL>0) dz.rotation.x=1.5*D.dzL; // liegt beim Sturz flach neben ihm
 
  if(wa>0&&Fr){ D.G.updateMatrixWorld(true); const tg=Fr.r.g.position.clone(); tg.y+=1.05; dz.lookAt(tg); const q1=dz.quaternion.clone(); dz.quaternion.set(0,0,0,1).slerp(q1,wa); dz.updateMatrixWorld(true);
    const hp=new THREE.Vector3(); dz.getWorldPosition(hp); const y=pf.y, S2=TT_PIEK.stich, th=y<5?-.3:y<S2?-.3+.35*bSm((y-5)/(S2-5)):.05-.35*bSm((y-S2-.2)/.6);
    dz.position.add(new THREE.Vector3(0,0,1).applyQuaternion(dz.quaternion).multiplyScalar((hp.distanceTo(tg)/Z.k-1.21+th)*wa)); }
  // Staubwolke beim Sturz
  // Rauch in Runde 2: steigt aus Nüstern und zwischen den Hörnern auf, im Schlusssprint aus den Ohren
  { const kp=D.kopf.getWorldPosition(new THREE.Vector3()), ohr=D.pust>.3, r=D.G.rotation.y; D.rauch.forEach((s,k)=>{ s.visible=zorn; if(!zorn) return; const a=((t*(ohr?1.1:.6)+k/D.rauch.length)%1), sd=k%2?1:-1;
    if(ohr){ const o=D.kopf.localToWorld(new THREE.Vector3(sd*.11,.12,-.01)), a2=((t*1.4+k/D.rauch.length)%1); s.position.set(o.x+Math.cos(r)*sd*a2*3.5,o.y+a2*7,o.z-Math.sin(r)*sd*a2*3.5); s.scale.setScalar(1.5+a2*6); s.material.opacity=.85*Math.sin(Math.PI*a2); return; } // außer Atem: dicke Rauchwolken aus den Ohren
    s.position.set(kp.x+sd*.6+Math.sin(k*2.1+t)*.8*a, kp.y+1.2+a*7*Z.k/12.5, kp.z+Math.cos(k*1.7)*.6*a); s.scale.setScalar(1.2+a*4); s.material.opacity=.55*Math.sin(Math.PI*a); }); }
  tfPuffTick(D,rt,run);
  { const a=D.staubT!=null&&run?rt-D.staubT:9, A=D.staubP, B=D.staubB||A, n=D.staub.length; D.staub.forEach((s,k)=>{ s.visible=a<3.2; if(!s.visible) return; const f=k/(n-1), sd=k%2?1:-1, r=1.5+a*5*(.6+.4*(k%3)/2), x=A[0]+(B[0]-A[0])*f, z=A[2]+(B[2]-A[2])*f, hd=headingAt(R,R.tt.tor.d); // Staubwalze den ganzen Körper entlang
    s.position.set(x-Math.sin(hd)*sd*r,A[1]+(B[1]-A[1])*f+.8+a*2+k%3*.6,z+Math.cos(hd)*sd*r); s.scale.setScalar(4+a*7); s.material.opacity=.8*(1-a/3.2); }); }
  tfBaeumeUm(D,rt,run); }
// ---- Cartoon-Schreck beim Ertappen (vom Nutzer): rotes Ausrufezeichen über dem Kopf, Schreckstriche rund um den Kopf, Schweißtropfen, die Wurst fliegt von der Gabel ----
function tfComicBau(D){ const sp=(tex,w,h)=>{ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,fog:false})); s.scale.set(w,h,1); s.visible=false; s.userData.ohneBoden=true; world.add(s); return s; };
  const aus=canvasTex(64,128,g=>{ g.font='bold 118px Georgia,serif'; g.textAlign='center'; g.textBaseline='middle'; g.lineWidth=9; g.strokeStyle='#1a1008'; g.strokeText('!',32,66); g.fillStyle='#e8281a'; g.fillText('!',32,66); });
  const str=canvasTex(256,256,g=>{ g.strokeStyle='#1a1410'; g.lineCap='round'; for(let i=0;i<12;i++){ const a=i/12*Math.PI*2+(i%2)*.12, r0=i%2?86:80, r1=i%2?108:120; g.lineWidth=i%2?6:9; g.beginPath(); g.moveTo(128+Math.cos(a)*r0,128+Math.sin(a)*r0); g.lineTo(128+Math.cos(a)*r1,128+Math.sin(a)*r1); g.stroke(); } }); // kurze Striche im Kreis, abwechselnd dick und dünn
  const tr=canvasTex(32,48,g=>{ g.beginPath(); g.moveTo(16,3); g.quadraticCurveTo(29,28,26,34); g.arc(16,34,10,0,Math.PI); g.quadraticCurveTo(3,28,16,3); g.fillStyle='#9ad4f4'; g.fill(); g.lineWidth=2.5; g.strokeStyle='#1a3a5a'; g.stroke(); g.fillStyle='#ffffff'; g.fillRect(19,28,3,6); });
  D.comic={aus:sp(aus,1.8,3.6), str:sp(str,7,7), tr:[0,1,2].map(()=>sp(tr,.7,1.05)), wurst:new THREE.Mesh(new THREE.SphereGeometry(.022*TEUFEL.k,10,8),lam('#94562e'))}; D.comic.wurst.scale.set(3,1,1); D.comic.wurst.visible=false; D.comic.wurst.userData.ohneBoden=true; world.add(D.comic.wurst); }
// Schweißtropfen außer Atem (Schlusssprint): perlen vom Kopf und fallen, Sprites vom Cartoon-Schreck
function tfSchweiss(D,t){ const C=D.comic; if(!C) return; const kp=D.kopf.getWorldPosition(new THREE.Vector3()), k=TEUFEL.k, r=D.G.rotation.y;
  C.tr.forEach((sp,i)=>{ const f=(t*.7+i/3)%1, sd=i===1?0:i?1:-1, o=.13*k+.6*f; sp.visible=true; sp.material.opacity=1-f*f; sp.position.set(kp.x+Math.cos(r)*sd*o,kp.y+.1*k-5*f*f,kp.z-Math.sin(r)*sd*o); }); }
function tfComic(D,rt,t){ const C=D.comic; if(!C) return; const M=TF_MERK, y=D.schreck, V=THREE.Vector3; C.aus.visible=C.str.visible=false; C.tr.forEach(s=>s.visible=false); if(y==null){ C.wurst.visible=false; C.wP=null; return; }
  const kp=D.kopf.getWorldPosition(new V()), k=TEUFEL.k, s=y-M.schreck;
  if(y>=M.zu&&y<M.schreck+1.7){ const a=y-M.zu, pop=a<.18?.4+.9*a/.18:1+.12*Math.exp(-(a-.18)*6)*Math.sin((a-.18)*30); C.aus.visible=true; C.aus.scale.set(1.8*pop,3.6*pop,1); C.aus.position.set(kp.x,kp.y+.36*k+.8*Math.sin(Math.min(1,a/.18)*Math.PI/2),kp.z); } // ploppt über dem Kopf auf
  if(s>=0&&s<1.1){ const z=1+.1*Math.sin(t*46); C.str.visible=true; C.str.scale.set(7*z,7*z,1); C.str.material.rotation=Math.floor(t*14)*.4; C.str.position.set(kp.x,kp.y+.08*k,kp.z); } // Schreckstriche zittern um den Kopf
  if(s>=0&&s<1.3) C.tr.forEach((sp,i)=>{ const a=(i-1)*.9+(i===1?0:.3), f=s/1.3; sp.visible=true; sp.material.opacity=1-f*f; sp.position.set(kp.x+Math.sin(D.G.rotation.y+Math.PI/2+a)*(.12*k+2.5*f),kp.y+.12*k+2.2*f-3*f*f,kp.z+Math.cos(D.G.rotation.y+Math.PI/2+a)*(.12*k+2.5*f)); }); // Schweißtropfen spritzen vom Kopf
  if(s<0){ C.wP=null; C.wurst.visible=false; return; } if(!C.wP){ C.wP=D.gabelWurst.getWorldPosition(new V()); } const w=Math.min(s,1.25); C.wurst.visible=s<1.25; C.wurst.position.set(C.wP.x+w*1.2,C.wP.y+11*w-9*w*w,C.wP.z); C.wurst.rotation.set(w*9,w*4,0); } // Wurst fliegt von der Gabel hoch und fällt zurück auf den Teller

// Runde 2 auf dem Felsstuhl: greift den Schoppen, setzt an, kippt ihn in einem Zug hoch (Kopf in den Nacken), wirft das leere Glas über die Schulter
function tfExen(P,y){ const Z=TF_R2; if(y<0||y>Z.exD+Z.weg) return; const GR=[-1.3,.1,-.4], MU=[-.7,.45,-2.2], HO=[-1.3,.45,-2.3], WU=[-2.9,.4,-.5];
  P.a[0]=y<.5?tfMix(P.a[0],GR,bSm(y/.5)):y<1?tfMix(GR,MU,bSm((y-.5)/.5)):y<Z.exD?tfMix(MU,HO,bSm((y-1)/(Z.exD-1))):tfMix(HO,WU,bSm((y-Z.exD)/(Z.weg*.5)));
  const k=bSm((y-.8)/.6)*(1-bSm((y-Z.exD)/.3)); P.k=[P.k[0]-.6*k,P.k[1]*(1-k)]; P.l-=.15*k; if(y>.9&&y<Z.exD) P.j=.22; }
function tfGlas(D,K,rt){ const Gl=anim.tt.glas; if(!Gl) return; const o=Gl.G, V=THREE.Vector3, Z=TF_R2, y=rt-(K&&K.ex!=null?K.ex:1e9);
  if(y<0){ if(Gl.st!=='tisch'){ Gl.par.add(o); o.position.copy(Gl.L.p); o.quaternion.copy(Gl.L.q); o.scale.copy(Gl.L.s); o.visible=true; Gl.st='tisch'; } Gl.wein.scale.y=1; Gl.wein.position.y=.45; return; }
  if(Gl.st==='tisch'){ if(y>Z.exD+Z.weg+1){ o.visible=false; Gl.st='weg'; return; } Gl.a=o.getWorldPosition(new V()); world.attach(o); Gl.st='hand'; Gl.h=1.15*o.scale.y; } // Sprung im Testmodus: schon weg
  if(Gl.st==='hand'){ D.G.updateMatrixWorld(true); const hp=D.arme[0].ha.getWorldPosition(new V()), kp=D.kopf.getWorldPosition(new V()), up=new V(0,1,0), ax=up.clone().lerp(kp.sub(hp).normalize(),bSm(y/.9)*.6).normalize(), ki=bSm((y-.9)/(Z.exD-1.1));
    ax.y-=1.3*ki; ax.normalize(); o.quaternion.setFromUnitVectors(up,ax); const p=hp.clone().addScaledVector(ax,-Gl.h*.45); o.position.copy(y<.5?Gl.a.clone().lerp(p,bSm(y/.5)):p); // greift das Glas vom Tisch, setzt an, kippt es hoch über den Mund
    const f=1-.95*bSm((y-1)/(Z.exD-1.2)); Gl.wein.scale.y=f; Gl.wein.position.y=.025+.425*f; // wird leer
    if(y>=Z.exD+Z.weg*.4){ const r=D.G.rotation.y, bx=o.position.x-Math.sin(r)*14+Math.cos(r)*10, bz=o.position.z-Math.cos(r)*14-Math.sin(r)*10; Gl.b=new V(bx,bodenY(bx,bz)+.4,bz); Gl.a=o.position.clone(); Gl.t=rt; Gl.st='flug'; } return; } // über die linke Schulter nach hinten in den Wald
  if(Gl.st==='flug'){ const w=Math.min(1,(rt-Gl.t)/1.3); o.position.copy(Gl.a).lerp(Gl.b,w); o.position.y+=8*4*w*(1-w); o.rotation.set(w*7,0,w*3); if(w>=1){ Gl.st='liegt'; o.rotation.set(Math.PI/2,0,.4); tfPuff(D,rt,Gl.b,.6); } } }
// Runde 2 am Tisch: isst nicht mehr, haut mit der Faust auf den Tisch, mahlt mit dem Kiefer, schaut sich um
function tfGroll(t){ const h=Math.pow(Math.max(0,Math.sin(t*4.5)),6); return {...TF_SITZ, a:[[-1.3+.6*h,.15,-1.2+.6*h],TF_SITZ.a[1]], k:[.05,.35*Math.sin(t*.7)], j:.12+.08*Math.sin(t*13)}; }
// Würfe: Gabel (Besteckwurf 1) und Messer (Besteckwurf 2) fliegen im Bogen und stecken knapp neben dir im Weg, die Tischplatte (Runde 2) reißt er heraus, trägt sie über dem Kopf und wirft sie links neben den Weg
function tfWuerfe(D,K,rt,run,zorn,ph,t){ tfWurf(D,D.gabelW,K?K.bw[0]:null,rt,true); tfPlatte(D,K,rt); // Messer bleibt auf dem Tisch (fliegt in Runde 2 mit der Platte)
  const u=(t%7)/7; D.gabelWurst.visible=!zorn&&D.gabelW.st==='hand'&&(ph==='sitz'&&u>.27&&u<.5||D.schreck!=null&&D.schreck<TF_MERK.schreck); } // beim Ertappen bleibt die Wurst vor dem Maul stehen // spießt eine Bratwurst auf und isst sie
function tfWurf(D,W,t0,rt,zeig){ const rel=t0==null?1e9:t0+1.15, T=2.1, o=W.o, V=THREE.Vector3;
  if(rt<rel){ W.dWeg=null; if(W.st!=='hand'){ W.h.add(o); o.position.copy(W.L.p); o.quaternion.copy(W.L.q); o.scale.copy(W.L.s); W.st='hand'; } o.visible=zeig; return; }
  if(W.st==='hand'){ if(rt>rel+.5){ o.visible=false; W.st='weg'; W.dWeg=null; return; } // Sprung im Testmodus: nicht mehr da
    world.attach(o); o.visible=true; const d=me.d+me.v*T+40, q=wegPos(d,0); W.dWeg=d; W.a=o.position.clone(); W.b=new V(q.x,bodenY(q.x,q.z),q.z); W.st='flug'; } // fliegt über dich hinweg, steckt 40 m vor dir mitten im Weg (vom Nutzer gewünscht)
  if(W.st!=='flug') return; const w=Math.min(1,(rt-rel)/T), H=9, v=W.b.clone().sub(W.a).add(new V(0,H*4*(1-2*w),0)).normalize(), tip=W.a.clone().lerp(W.b,w); tip.y+=H*4*w*(1-w);
  o.quaternion.setFromUnitVectors(new V(0,-1,0),v); o.position.copy(tip).addScaledVector(v,-(W.lang*TEUFEL.k-(w>=1?.6:0))); // Spitze voraus, steckt .6 m im Boden
  if(w>=1){ W.st='liegt'; tfPuff(D,rt,W.b,1); } }
function tfPlatte(D,K,rt){ const A=anim.tt, P=A.platte, W=D.platteW, V=THREE.Vector3, rip=K?K.rip:1e9, rel=K&&K.tw!=null?K.tw+1.3:1e9, T=1.8;
  if(rt<rip){ if(W.st!=='tisch'){ A.tisch.add(P); P.position.copy(W.L.p); P.quaternion.copy(W.L.q); P.scale.copy(W.L.s); W.st='tisch'; } return; }
  if(rt<rel){ if(W.st!=='traegt'){ if(W.st==='tisch'){ A.tisch.updateMatrixWorld(true); W.a=P.getWorldPosition(new V()); W.qa=P.getWorldQuaternion(new THREE.Quaternion()); } world.attach(P); W.st='traegt'; } // reißt sie vom Tisch
    const hp=D.arme[0].ha.getWorldPosition(new V()); hp.y+=.04*TEUFEL.k; const w=bSm((rt-rip)/1.5), qy=new THREE.Quaternion().setFromAxisAngle(new V(0,1,0),D.G.rotation.y);
    P.position.copy(W.a).lerp(hp,w); P.position.y+=3*Math.sin(Math.PI*w); P.quaternion.copy(W.qa).slerp(qy,w); return; } // hebt sie über den Kopf und trägt sie
  if(W.st==='tisch'||W.st==='traegt'){ world.attach(P); W.a=P.position.clone(); W.ry=D.G.rotation.y; const d=me.d+me.v*T+18, q=wegPos(d,-(roadW(R,d)/2+11)); W.b=new V(q.x,bodenY(q.x,q.z)-1.2,q.z); W.st=rt>rel+.5?'land':'flug'; }
  if(W.st==='flug'){ const w=(rt-rel)/T; if(w>=1) W.st='land'; else { P.position.copy(W.a).lerp(W.b,w); P.position.y+=12*4*w*(1-w); P.quaternion.setFromEuler(new THREE.Euler(w*1.5,W.ry+w*4,0,'YXZ')); } } // überschlägt sich im Flug
  if(W.st==='land'){ P.position.copy(W.b); P.quaternion.setFromEuler(new THREE.Euler(.35,W.ry+4,.1,'YXZ')); tfPuff(D,rt,W.b,3); W.st='liegt'; } } // schlägt schräg im Wald ein
// Staubwolke bei Einschlägen (bis zu drei gleichzeitig)
function tfPuff(D,rt,p,g){ if(race.state!=='run') return; D.puffs.push({t:rt,p:p.clone(),g}); if(D.puffs.length>3) D.puffs.shift(); }
function tfPuffTick(D,rt,run){ D.puffSp.forEach((s,i)=>{ const ev=D.puffs[D.puffs.length-1-Math.floor(i/10)], a=ev&&run?rt-ev.t:9; s.visible=a>=0&&a<2.2; if(!s.visible) return; const k=i%10, an=k/10*Math.PI*2, g=ev.g, r=(1+a*3)*g;
  s.position.set(ev.p.x+Math.cos(an)*r,ev.p.y+.5*g+a*1.2*g+k%3*.3*g,ev.p.z+Math.sin(an)*r); s.scale.setScalar((1.5+a*3)*g); s.material.opacity=.7*(1-a/2.2); }); }
// Dreizack 1 und 2: Friedel wird gepiekst – {k, y: s seit Beginn} oder null (bis T s danach)
function ttPiekF(rt,T){ const D=anim.tt&&anim.tt.teufel, K=D&&D.sk; if(!K||race.state!=='run') return null; for(let k=0;k<2&&k<K.dz.length;k++){ const y=rt-K.dz[k][0]; if(y>=0&&y<T) return {k,y}; } return null; } // Augen glühen heller, wenn er dich entdeckt hat

// ---- Anschleichen (vom Nutzer gewünscht): geduckt in Aero-Haltung am äußersten rechten Wegrand, halb in den Büschen – bis der Teufel dich entdeckt (Beginn von „Ertappt“) ----
const TT_DUCK=75; // s vor „Ertappt“ duckt man sich (vom Nutzer gewünscht: erst ein paar hundert Meter vor dem Tisch)
function ttGeduckt(){ if(!R||!R.tt||race.state!=='run') return 0; const S=race.woSegs||[], a=S.find(s=>s.label==='Anschleichen'), e=S.find(s=>s.label==='Ertappt'); if(!a||!e) return 0; const rt=race.t;
  return bSm((rt-Math.max(a.t0,e.t0-TT_DUCK))/3)*(1-bSm((rt-e.t0)/1.5)); } // 0 … 1, Haltung in rideState (figuren.js)
function ttSpur(d,t){ const w=Math.max(ttGeduckt(),ttAusweich(d)), wi=ttWind(d); let u=w?t+(roadW(R,d)/2+(ttGeduckt()>ttAusweich(d)?.15:-.4)-t)*w:t; if(wi) u+=(wi.s*(roadW(R,d)/2-.45)-u)*wi.w*TT_LICHTUNG.wind; return u; } // Spur (aus rennen.js) · auf Lichtungen drückt der Wind dich (und Friedel neben dir) an den Rand
// Ausweichen 0 … 1 (du nach rechts, Friedel nach links): an der Gabel im Weg, wenn der Ritter überholt
function ttAusweich(d){ const A=anim.tt; if(!A||race.state!=='run') return 0; let w=0; const G=A.teufel&&A.teufel.gabelW; if(G&&G.dWeg!=null&&G.st==='liegt'){ const g=G.dWeg-d; w=Math.max(w,bSm((25-g)/8)*bSm((g+4)/3)); }
  const Ri=A.ritter; if(Ri&&Ri.G.visible){ const g=Ri.d-d; w=Math.max(w,bSm((g+22)/6)*bSm((8-g)/5)); } return w; }

// ---- Kamera (aus rennen.js): Blick zurück auf den Teufel – beim Sprung auf den Weg, alle 45 s in der Flucht, beim Dreizack ----
function teufelKamera(dt){ const D=anim.tt&&anim.tt.teufel, ich=riders3d[myKey]; if(!D||!D.sk||race.state!=='run'||!ich) return; const rt=race.t, tr=D.trip!=null&&rt>=D.trip-.2&&rt<D.trip+6.3?[D.trip-.2,6.5]:null, k=tr||D.sk.kam.find(([a,T])=>rt>=a&&rt<a+T); if(!k) return; // Sturz am Steintor: Blick zurück
  const [a,T]=k, ab=!tr&&k===D.sk.kam[D.sk.kam.length-1], w=bSm((rt-a)/.6)*bSm((a+T-rt)/.7), rp=ich.g.position, bc=tr?D.kopf.getWorldPosition(new THREE.Vector3()).setY(D.G.position.y-.6*TEUFEL.k):D.G.position, hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), sx=bc.x-rp.x, sz=bc.z-rp.z, sl=Math.hypot(sx,sz)||1;
  const pos=new THREE.Vector3(rp.x+fx*5-sx/sl*2.5, rp.y+(ab?4.2:2.4), rp.z+fz*5-sz/sl*2.5), look=new THREE.Vector3(bc.x, bc.y+(ab?.85-.4*(D.sitz||0):.85)*TEUFEL.k, bc.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz);
  camera.position.lerp(pos,w); camera.lookAt(now.lerp(look,w));
  if(ab){ const fz2=2*Math.atan(TF_ABH.sehen*TEUFEL.k/2/Math.max(1,camera.position.distanceTo(look)))*180/Math.PI; camera.fov+=(Math.min(camera.fov,Math.max(6,fz2))-camera.fov)*w; camera.updateProjectionMatrix(); } } // abgehängt: Kamera höher (dein Fahrer nicht im Bild), zoomt heran, er bleibt gleich groß im Bild (wie mondKamera) // wie rueckblick (welt-unterwegs.js), Zeit aus dem Workout
