/* ================= Kampagne Mission 1: Leben am Wirtshaus und unterwegs (Trifels) =================
   Baulücken am Wirtshaus mit Misthaufen, Schweinekoben, Hühnerstall, Strohhaufen (Hof-Baukasten aus welt-dorf.js), Gänseherde quert in der Wirtshaus-Szene die Gasse,
   Fuhrwerk auf der Abfahrt (Bauer rauscht von hinten heran, plaudert über den Fußball in Lautre, fährt davon), Gegenverkehr zwischen Wirtshaus und Jagd 1 (Magd, Bauer, Heuwagen, Mönch), Reh mit zwei Kitzen nach Jagd 1, Wildschwein quert nach Jagd 4 von rechts nach links und läuft vor dir her (Friedel: TRI_TXT.sau), drei Elwetritsche auf dem Weg im Ausfahren (sehen dich, rennen wild im Kreis durcheinander, hauen ab).
   prepTrifelsLeben aus prepTrifels · buildTrifelsLeben aus buildTrifels · poseTrifelsLeben aus poseTrifels · triGegenSpur aus triSpur (Heuwagen und Fuhrwerk: rechts Platz machen) */
const TRI_LUECKEN=[[-1,-21,'mist'],[1,-29,'koben'],[1,11,'stall'],[-1,9,'gaense'],[-1,36,'stroh']]; // [Seite, Meter ab Wirtshaus, Szene]: das Haus dort fällt weg
const TRI_GEGEN_ART=['magd','bauer','wagen','moench'], TRI_GEGEN_V={wagen:2, sonst:1.3}; // Gegenverkehr in der Reihenfolge von TRIFELS_T.gegen, m/s
const TRI_FUHR={vor:7, ab:40, weg:10}, TRI_FUHR_TXT=[[0,3,'Un wie?'],[3.5,10,"Hoschs gheert? In Lautre treden se jetz all wie verrickt gege so'n Ledderball … Fußball nenne se des."],
  [10.5,17,'Ke Ahnung, was des schun wia sei soll, awwer wennd mich frogsch, henn die Leit heitzudach eh all en Sprung.'],[17.5,23.5,'Ä Stadion wolle se uffem Betzeberch defor sogar baue. Ä Stadion! Gläbsch des?'],
  [26.5,32,'Oich gsprächich bischd jo nid grad … Kriegsch die Zäh nid ausenanner, [Großer|Großi]?'],[32.5,39.5,'Alla hopp, ich muss weida, in deim Schneggetempo brauch ich jo bis iwwermoie, bis ich dehääm bin.']]; // Fuhrwerk, s ab Sprechbeginn: vor = rauscht heran, ab = winkt ab und fährt davon, weg = bis verschwunden · Blasen [von, bis, Text], vor dem letzten Satz eine Pause
const triFuhrT=()=>{ const S=race.woSegs||[], tW=S[0]?S[0].t0+S[0].dur:480, Z=TRIFELS_T; return (Z.rauf+Z.hof/2+Z.audienz+tW-Z.szene)/2; }; // Workout-Zeit: Mitte der Abfahrt zwischen Burgherr und Wirtshaus
const TRI_GANS={da:10, n:6, von:3, bis:17};
const TRI_SAU={rein:3, raus:12, ab:4, ende:17}, TRI_TRITSCH={sieht:28, nah:8, schreck:.5, wirr:3.2, ende:8}; // Wildschwein, s ab Auftauchen: bis rein auf den Weg, ab raus nach links (dauert ab), ende verschwunden // Elwetritsche: sehen dich auf sieht m, weichen nie näher als nah m zurück, s ab Schreck: hochspringen, bis wirr im Kreis durcheinander, dann ab ins Gebüsch, ende verschwunden // Gänse queren 10 m hinter dem Wirtshaus, Szene-Sekunde 3 bis 17 (von der rechten in die linke Lücke)

// ---- Vorbereitung: Häuser für die Lücken herausnehmen, Wege für Reh und Wildschwein frei von Bäumen ----
function prepTrifelsLeben(r){ const T=r.tri, S=r.S, O=r.def.orte, kf=r.kf, dw=T.wirtD; T.luecken=[];
  T.gegen=(O.gegen||[]).map(([t,d])=>[t,d*kf]); T.reh=O.reh!=null?O.reh*kf:null; T.sau=O.sau!=null?O.sau*kf:null; T.tritsch=O.tritsch!=null?O.tritsch*kf:null;
  for(const [s,da,art] of TRI_LUECKEN){ const h=S.house.filter(h=>h.side===s&&h!==T.wirt&&h.su==null).sort((a,b)=>Math.abs(a.d-dw-da)-Math.abs(b.d-dw-da))[0]; if(!h||Math.abs(h.d-dw-da)>9) continue;
    S.house.splice(S.house.indexOf(h),1); T.luecken.push({x:h.x, y:h.y, h:h.h, side:s, d:h.d, w:h.w, dep:h.dep, art});
    const imHof=o=>o.side===s&&Math.abs(o.d-h.d)<h.w/2+1.5; S.tor=S.tor.filter(o=>!imHof(o)); S.ranke=S.ranke.filter(o=>!imHof(o));
    for(const k of ['tree','bush','konif','grass','rock']) S[k]=S[k].filter(o=>Math.hypot(o.x-h.x,o.y-h.y)>Math.max(h.w,h.dep)/2+1.5); }
  const frei=[], weg=(d,u,m)=>{ const [px,py]=posAt(r,d), h=headingAt(r,d); frei.push([px-Math.sin(h)*u, py+Math.cos(h)*u, m]); };
  if(T.reh!=null) for(let u=-20;u<=16;u+=3) weg(T.reh,u,4); // Reh quert von rechts nach links
  if(T.sau!=null){ for(let d=T.sau-16;d<=T.sau;d+=4) for(const u of [4,7,10]) weg(d,u,2.5); for(let d=T.sau+70;d<=T.sau+130;d+=4) for(const u of [-4,-7,-10]) weg(d,u,2.5); } // rechts herein, links hinaus // Wildschwein läuft rechts am Rand mit, dreht ab
  if(T.tritsch!=null) for(let d=T.tritsch-5;d<=T.tritsch+60;d+=4) for(const u of [-5,-8,-11,-14,6,9,12]) weg(d,u,2.5); // Elwetritsche: links und rechts ins Gebüsch
  for(const k of ['tree','bush','rock']) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m)); }

// Vierbeiner mit beweglichen Beinen (Reh, Kitz, Wildschwein), lokal +x nach vorn, Hufe auf y=0
function triTier(o){ const G=new THREE.Group(), K=new THREE.Group(), m=o.em?new THREE.MeshLambertMaterial({color:o.c,emissive:o.em}):lam(o.c), H=o.H, L=o.L; G.add(K);
  const rumpf=new THREE.Mesh(new THREE.SphereGeometry(1,12,9),m); rumpf.scale.set(L/2,o.dick,o.breit); rumpf.position.y=H; K.add(rumpf);
  const beine=[[1,1],[1,-1],[-1,1],[-1,-1]].map(([x,z])=>{ const b=new THREE.Group(); b.position.set(x*L*.3,H,z*o.breit*.55); K.add(b); const l=new THREE.Mesh(new THREE.CylinderGeometry(o.bein,o.bein*.7,H,6),m); l.position.y=-H/2; b.add(l);
    const hf=new THREE.Mesh(new THREE.BoxGeometry(o.bein*2,o.bein*1.6,o.bein*2),lam('#1c1814')); hf.position.y=-H+o.bein*.8; b.add(hf); return b; });
  const kopf=new THREE.Group(); kopf.position.set(L*.46,H+o.hals,0); K.add(kopf); return {G,K,m,beine,kopf}; }
function triReh(kitz){ const c=kitz?'#a8703e':'#9a6438', T=triTier({c,em:'#2a1a0c',L:1.1,H:.62,dick:.27,breit:.2,bein:.035,hals:.42}), s=new THREE.MeshLambertMaterial({color:'#f2ece0',emissive:'#6a665e'}); // Fell glimmt leicht, Spiegel und Tupfen hell (in der Dämmerung gut zu sehen)
  const hs=new THREE.Mesh(new THREE.CylinderGeometry(.07,.11,.5,6),T.m); place(hs,[.42,.66,0],[.56,1.04,0]); T.K.add(hs);
  const k=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),T.m); k.scale.set(1.5,1,.9); k.position.set(.08,0,0); T.kopf.add(k); const na=new THREE.Mesh(new THREE.SphereGeometry(.035,5,4),lam('#1a1a1a')); na.position.set(.22,-.02,0); T.kopf.add(na);
  for(const z of [-.06,.06]){ const au=new THREE.Mesh(new THREE.SphereGeometry(.018,5,4),new THREE.MeshBasicMaterial({color:'#e8c070'})); au.position.set(.12,.04,z); T.kopf.add(au); } // Augen
  for(const z of [-.06,.06]){ const oh=new THREE.Mesh(new THREE.ConeGeometry(.04,.16,5),T.m); oh.position.set(-.02,.12,z); oh.rotation.x=z*4; T.kopf.add(oh); }
  const sp=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),s); sp.position.set(-.55,.7,0); T.K.add(sp); // Spiegel
  if(kitz) for(let i=0;i<10;i++){ const p=new THREE.Mesh(new THREE.SphereGeometry(.025,4,3),s); p.position.set(-.35+(i%5)*.17,.88,(i<5?-1:1)*(.08+(i%2)*.04)); T.K.add(p); } // Tupfen
  if(kitz) T.G.scale.setScalar(.58); return T; }
function triSau(){ const T=triTier({c:'#5a4a3c',em:'#2a2016',L:1.2,H:.46,dick:.3,breit:.25,bein:.05,hals:.1}), dk=new THREE.MeshLambertMaterial({color:'#3a2e24',emissive:'#1a140e'}); // glimmt leicht, damit man es in der Dämmerung sieht
  const nk=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),T.m); nk.scale.set(1,1.15,.9); nk.position.set(.3,.55,0); T.K.add(nk); // hoher Nacken
  for(let i=0;i<7;i++){ const b=new THREE.Mesh(new THREE.BoxGeometry(.1,.12,.04),dk); b.position.set(.45-i*.15,.82-Math.abs(i-1.5)*.02,0); T.K.add(b); } // Borstenkamm
  const k=new THREE.Mesh(new THREE.ConeGeometry(.2,.55,7),T.m); k.rotation.z=-Math.PI/2-.35; k.position.set(.2,-.08,0); T.kopf.add(k); const rs=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.04,8),lam('#4a3a32')); rs.rotation.z=Math.PI/2; rs.position.set(.47,-.18,0); T.kopf.add(rs);
  for(const z of [-.06,.06]){ const h=new THREE.Mesh(new THREE.ConeGeometry(.018,.12,4),lam('#efe8d6')); h.position.set(.38,-.14,z*1.3); h.rotation.z=-.5; T.kopf.add(h); const oh=new THREE.Mesh(new THREE.ConeGeometry(.05,.13,4),dk); oh.position.set(-.05,.13,z*1.6); T.kopf.add(oh); }
  for(const z of [-.07,.07]){ const au=new THREE.Mesh(new THREE.SphereGeometry(.028,6,4),new THREE.MeshBasicMaterial({color:'#ffc860'})); au.position.set(.1,.05,z); T.kopf.add(au); } // Augen spiegeln das Laternenlicht
  const sw=new THREE.Mesh(new THREE.CylinderGeometry(.015,.01,.25,4),dk); place(sw,[-.6,.5,0],[-.72,.32,0]); T.K.add(sw); T.G.scale.setScalar(1.25); return T; }

// ---- Aufbau ----
function buildTrifelsLeben(T){ const A=anim.tri, q=rng(905), M=c=>lam(c), holz=M('#6b4a32'), holzD=M('#4e3626'), dachM=M('#7a5a3a'), D={tiere:[], katzen:[], dampf:[]};
  const box=(P,w,h,d,m,x,y,z)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); o.position.set(x,y,z); P.add(o); return o; };
  const bretter=hMat('bretter',()=>new THREE.MeshLambertMaterial({map:canvasTex(64,64,g=>{ for(let x=0;x<64;x+=8){ const v=.8+Math.random()*.3; g.fillStyle=`rgb(${118*v|0},${84*v|0},${54*v|0})`; g.fillRect(x,0,8,64); g.fillStyle='rgba(30,18,10,.55)'; g.fillRect(x+7,0,1,64); } })}));
  const K=hofKasten({box,M,holz,holzD,bretter,q,D}), L=A.leben={D, gaense:[], gegen:[], reh:null, sau:null};
  // Pferdewagen mit Kutscher (Heuwagen, Fuhrwerk), lokal +z nach vorn; Räder drehbar
  const wagen=(G,fell,o)=>{ const P=trPferd({fell}); P.G.position.z=2.3; G.add(P.G); box(G,1.5,.1,2.8,bretter,0,1,-.6); for(const x of [-.72,.72]) box(G,.06,.45,2.8,bretter,x,1.25,-.6);
    const raeder=[[-.85,.3],[.85,.3],[-.85,-1.5],[.85,-1.5]].map(([x,z])=>{ const W=new THREE.Group(); W.position.set(x,.53,z); G.add(W); const r2=new THREE.Mesh(new THREE.TorusGeometry(.48,.05,5,16),holzD); r2.rotation.y=Math.PI/2; W.add(r2); for(let k=0;k<4;k++){ const sp=box(W,.03,.9,.03,holz,0,0,0); sp.rotation.x=k*Math.PI/4; } return W; });
    for(const x of [-.4,.4]){ const de=cyl(.04,holz); place(de,[x,1,.75],[x*.6,1.3,1.9]); G.add(de); } // Deichsel
    const m=trMensch(o); m.G.position.set(0,.55,.55); m.beine[0].rotation.x=m.beine[1].rotation.x=-1.4; m.arme[0].rotation.x=m.arme[1].rotation.x=-.9; G.add(m.G); return {pferd:P,raeder,m}; };
  // Baulücken: lokal +z zur Gasse, Ursprung in der Mitte des alten Hauses
  for(const l of T.luecken){ const G=new THREE.Group(); G.position.set(l.x,bodenY(l.x,l.y),l.y); G.rotation.y=Math.atan2(l.side*Math.sin(l.h),-l.side*Math.cos(l.h)); world.add(G); const bz=-l.dep/2+1.6;
    if(l.art==='mist'){ const m=new THREE.Group(); m.position.z=-.6; G.add(m); K.misthaufen(m); K.eimer(G,2.2,0,1.6); K.korb(G,-2.4,0,1.8,'#9a5a2a'); }
    else if(l.art==='koben'){ const m=new THREE.Group(); m.position.z=-.4; G.add(m); K.koben(m); }
    else if(l.art==='stall'){ for(const [x,z] of [[-.9,-.55],[.9,-.55],[-.9,.55],[.9,.55]]) box(G,.1,.65,.1,holzD,x,.33,bz+z); box(G,2,1.1,1.3,bretter,0,1.2,bz); // Hühnerstall auf Stelzen
      for(const s of [-1,1]){ const d2=box(G,2.3,.06,.85,dachM,0,1.95,bz+s*.33); d2.rotation.x=s*.55; } box(G,.4,.45,.02,M('#1e1610'),.4,.95,bz+.66); // Dach, Schlupfloch
      const rp=box(G,.35,.03,1.3,bretter,.4,.4,bz+1.2); rp.rotation.x=.55; for(let i=0;i<4;i++) box(G,.35,.03,.03,holzD,.4,.12+i*.18,bz+1.68-i*.3); // Hühnerleiter mit Sprossen
      K.huhn(G,.4,.62,bz+.95,1.6,'#f2ece0'); K.huhn(G,-.6,0,bz+1.6,.4,'#9a5a2a'); K.huhn(G,1.3,0,bz+2,2.8,'#c9733a'); K.huhn(G,-1.5,0,bz+2.6,-1,'#2e2a24');
      box(G,1.2,.15,.3,holzD,-1,.08,bz+2.4); K.strohhaufen(G,-2.6,0,bz+.4,.7); }
    else if(l.art==='gaense'){ box(G,1.6,.3,.5,holzD,-1.5,.15,-.5); const wa=new THREE.Mesh(new THREE.BoxGeometry(1.45,.02,.36),K.wasser); wa.position.set(-1.5,.28,-.5); G.add(wa); K.eimer(G,-.3,0,-.4); K.strohhaufen(G,2.4,0,-1.8,.6); } // Wassertrog
    else if(l.art==='stroh'){ K.strohhaufen(G,-1.6,0,-1.2,1.2); K.handkarren(G,1.4,.4,.5); K.fass(G,2.6,0,-1.5); K.korb(G,.3,0,1.4,'#e0b33c'); }
    G.updateMatrixWorld(true); const wp=new THREE.Vector3(); for(const o of G.children){ o.getWorldPosition(wp); o.position.y+=bodenY(wp.x,wp.z)-G.position.y; } } // jedes Teil auf den Boden (die Lücken liegen am Hang)
  // Fässer und Körbe an der Ecke des Wirtshauses
  if(T.wirt){ const H=T.wirt, dd=H.d+H.w/2+.9, uF=A.uF??roadW(R,dd)/2, G=new THREE.Group(), p=wegPos(dd,uF+.5); G.position.set(p.x,bodenY(p.x,p.z),p.z); G.rotation.y=-p.h; world.add(G);
    K.fass(G,0,0,0); K.fass(G,.62,0,.1,.9); K.fass(G,.3,.68,.05,.8); K.korb(G,-.6,0,.2,'#7a9a3a'); }
  // Gänseherde mit Magd (wartet in der rechten Lücke, quert in der Szene, grast dann links)
  { const W=world; for(let i=0;i<TRI_GANS.n;i++){ const g=K.gans(W,0,0,i===2?'#9a9a8a':'#f2ece0'); L.gaense.push({...g, dd:(q()-.5)*3.2, lag:i*.7+q()*.4, uu:(q()-.5)*1.2, ph:q()*6}); }
    const m=trMensch({lang:'#7a5a8a',haar:'#c9a04a'}), st=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1.6,4),holz); st.position.set(0,-.62,.5); st.rotation.x=1.1; m.arme[1].add(st); m.arme[1].rotation.x=-.5; world.add(m.G); L.magd=m; }
  // Gegenverkehr: Magd mit Korb, Bauer mit Sense, Heuwagen mit Kutscher, Mönch mit Stab
  T.gegen.forEach(([t,d],i)=>{ const art=TRI_GEGEN_ART[i]||'bauer', G=new THREE.Group(); G.visible=false; world.add(G); const E={G,t,d,art,v:TRI_GEGEN_V[art]||TRI_GEGEN_V.sonst,ph:q()*6};
    if(art==='wagen'){ const W=wagen(G,'#6b4a2e',{kittel:'#6b5a3a',hose:'#3a3020',haar:'#5a4232',bart:'#5a4232'}); E.pferd=W.pferd; E.m=W.m;
      for(const [x,y,z,sx,sy,sz] of [[0,1.55,-.9,.7,.45,1.2],[-.1,1.95,-.5,.5,.35,.8],[.2,1.85,-1.4,.45,.3,.6]]) K.kugel(G,1,K.stroh,x,y,z,sx,sy,sz); } // Heu
    else { const o=art==='magd'?{lang:'#3f6b4a',haar:'#8a5a32'}:art==='moench'?{lang:'#5a4632',haar:'#8a6a4a'}:{kittel:'#8a3b2e',hose:'#3a3020',haar:'#4a3222',bart:'#4a3222'}, m=trMensch(o); G.add(m.G); E.m=m;
      if(art==='magd'){ const kb=new THREE.Group(); kb.position.set(0,-.55,.15); m.arme[0].add(kb); K.korb(kb,0,-.15,0,'#c94a2a'); m.arme[0].rotation.x=-.5; }
      if(art==='bauer'){ const se=new THREE.Group(); se.position.set(0,-.6,0); m.arme[0].add(se); const st=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1.7,4),holz); st.position.y=.6; se.add(st); const bl=box(se,.04,.06,.8,M('#8a8d93'),0,1.42,-.38); bl.rotation.x=.3; m.arme[0].rotation.x=-2.6; } // Sense über der Schulter
      if(art==='moench'){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.8,4),holz); st.position.set(0,-.62,0); m.arme[0].add(st); m.arme[0].rotation.x=-.4; const tk=new THREE.Mesh(new THREE.SphereGeometry(.125,8,6),lam('#e3b48e')); tk.position.y=.16; m.kopf.add(tk); } } // Tonsur
    L.gegen.push(E); });
  // Fuhrwerk auf der Abfahrt: Fässer, Körbe mit Rüben und Kohl, ein Lederball; Kutscher mit Peitsche
  { const G=new THREE.Group(); G.visible=false; world.add(G); const W=wagen(G,'#3a2a22',{kittel:'#4a5a3a',hose:'#3a3020',haar:'#8a7a68',bart:'#8a7a68'});
    K.fass(G,-.35,1.05,-1.5,.8); K.fass(G,.35,1.05,-1.6,.8); K.korb(G,.35,1.05,-.4,'#c9733a'); K.korb(G,-.35,1.05,-.5,'#7a9a3a');
    const ball=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),M('#8a5a32')); ball.position.set(.3,1.17,-.95); G.add(ball); const na=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,4,14),M('#3a2416')); na.position.copy(ball.position); na.rotation.y=.6; G.add(na); // Ledderball mit Naht
    const pe=new THREE.Mesh(new THREE.CylinderGeometry(.012,.02,1.4,4),holzD); pe.position.set(0,-1.05,.35); pe.rotation.x=.45; W.m.arme[1].add(pe); // Peitsche
    L.fuhre={G,...W,blase:triBlase(),ph:0,off:-99,dAlt:null}; }
  // Reh mit zwei Kitzen, Wildschwein
  if(T.reh!=null){ L.reh={tiere:[triReh(false),triReh(true),triReh(true)], s:-1, fertig:false}; L.reh.tiere.forEach(r=>{ r.G.visible=false; world.add(r.G); }); }
  if(T.sau!=null){ const S=triSau(); S.G.visible=false; world.add(S.G); L.sau={S, s:-1, fertig:false, d:0, u:0}; }
  // Drei Elwetritsche: Fell glimmt leicht, Augen leuchten im Laternenlicht
  if(T.tritsch!=null) L.tritsch={s:-1, fertig:false, c:T.tritsch, tiere:[1.15,1,.9].map(g=>{ const E=elwetritscheModell(); E.G.traverse(o=>{ if(!o.material||!o.material.color) return; const c=o.material.color;
    o.material=c.getHexString()==='f6f4ee'?new THREE.MeshBasicMaterial({color:'#fff4d0'}):new THREE.MeshLambertMaterial({color:c,emissive:c.clone().multiplyScalar(.25)}); });
    E.G.scale.setScalar(1.2*g); E.G.visible=false; world.add(E.G); return {...E, ph:q()*6, pd:null, rot:0}; })}; }

// ---- Ausweichen: dem Heuwagen und dem Fuhrwerk rechts Platz machen (Friedel fährt links neben dir mit) ----
function triGegenSpur(d,t){ const L=anim.tri&&anim.tri.leben; if(!L) return t; const W=L.gegen.find(E=>E.art==='wagen'&&E.G.visible), F=L.fuhre; let rechts=0;
  if(W){ const g=W.dNow-d; rechts=bSm((50-g)/12)*bSm((g+9)/4); } if(F&&F.G.visible) rechts=Math.max(rechts,bSm((F.off+30)/8)*bSm((30-F.off)/8)); return t+(roadW(R,d)/2-.5-t)*rechts; }

// ---- Bewegung (aus poseTrifels) ----
function poseTrifelsLeben(dt,t,rt){ const A=anim.tri, L=A.leben, T=R.tri; if(!L) return; const run=race.state==='run', lauf=run&&!race.paused?dt*simSpeed():0, dw=T.wirtD, ZS=A.sk&&run?rt-A.sk.tS:-1;
  const nah=Math.abs(me.d-dw)<260; L.magd.G.visible=nah; for(const g of L.gaense) g.T.visible=nah; // sonst stehen sie unplatziert am Start (0,0,0)
  if(nah){ hofKastenPose(L.D,t);
    // Gänse: Szene-Sekunde von..bis queren sie von rechts nach links, die Magd treibt
    const rw=roadW(R,dw)/2, u0=rw+5, u1=-(rw+6), k=(ZS-TRI_GANS.von)/(TRI_GANS.bis-TRI_GANS.von), nachher=run&&rt>=(A.sk?A.sk.tW:1e9);
    for(const g of L.gaense){ const kk=nachher?1:clampN(k-g.lag/14,0,1), geht=kk>0&&kk<1, d=dw+TRI_GANS.da+g.dd, u=u0+(u1-u0)*kk+g.uu, p=wegPos(d,u);
      g.T.position.set(p.x,bodenY(p.x,p.z),p.z); g.T.rotation.y=geht?Math.PI/2-p.h:Math.PI/2-p.h+Math.sin(t*.3+g.ph)*1.4; g.T.rotation.z=geht?.08*Math.sin(t*8+g.ph):0;
      g.k.rotation.z=geht?.1*Math.sin(t*6+g.ph):-.4*Math.max(0,Math.sin(t*2+g.ph*3))**3; } // laufen watschelnd, sonst picken
    { const m=L.magd, kk=nachher?1:clampN(k-.25,0,1.1), geht=kk>0&&kk<1.1, d=dw+TRI_GANS.da, u=Math.max(u1+1.5,u0+2+(u1-u0)*kk), p=wegPos(d,u); m.G.position.set(p.x,bodenY(p.x,p.z),p.z); m.G.rotation.y=Math.PI-p.h;
      const s=geht?Math.sin(t*6):0; m.beine[0].rotation.x=.5*s; m.beine[1].rotation.x=-.5*s; m.arme[1].rotation.x=-.5-(geht?.4*Math.max(0,Math.sin(t*3)):0); } } // schwingt den Stecken
  // Gegenverkehr: kommt dir auf dem Weg entgegen (zu Fuß links neben dem Weg, der Wagen in der linken Hälfte)
  for(const E of L.gegen){ const d=E.d+E.v*(E.t-rt), vis=run&&Math.abs(d-me.d)<160&&d>me.d-25; E.G.visible=vis; E.dNow=d; if(!vis) continue;
    const rw=roadW(R,d)/2, u=E.art==='wagen'?-(rw-1.15):-(rw+.7), p=wegPos(d,u); E.G.position.set(p.x,bodenY(p.x,p.z),p.z); E.G.rotation.set(Math.atan(gradeAt(d)/100),-p.h-Math.PI/2,0,'YXZ');
    E.ph+=lauf*E.v*2.6; const s=Math.sin(E.ph), g=d-me.d;
    if(E.pferd){ E.pferd.beine.forEach((b,i)=>b.rotation.x=.35*(i===0||i===3?s:-s)); E.pferd.hals.rotation.x=.06*Math.sin(E.ph*2); E.m.arme[1].rotation.x=g<14&&g>-3?-2.5+.3*Math.sin(t*9):-.9; } // Kutscher grüßt
    else { E.m.beine[0].rotation.x=.45*s; E.m.beine[1].rotation.x=-.45*s; E.m.G.position.y=.03*Math.abs(Math.sin(E.ph));
      const gruss=g<12&&g>-2, a=E.m.arme[1]; a.rotation.x+=((gruss?-2.5+.3*Math.sin(t*9):-.45*s)-a.rotation.x)*Math.min(1,dt*6); E.m.kopf.rotation.y=gruss?-.5:0; } }
  // Fuhrwerk: rauscht auf der Abfahrt von hinten heran, fährt links neben dir her, der Bauer redet auf dich ein, winkt ab, knallt mit der Peitsche und fährt davon
  { const F=L.fuhre, Z=TRI_FUHR, s=rt-triFuhrT(), vis=!!F&&run&&s>-Z.vor&&s<Z.ab+Z.weg; if(F){ F.G.visible=vis; F.blase.visible=false; if(!vis) F.dAlt=null; }
    if(vis){ const off=-32*(1-bSm((s+Z.vor)/Z.vor))+1.4*Math.max(0,s-Z.ab)**2, d=me.d+off+.9, rw=roadW(R,d)/2, p=wegPos(d,-(rw-1.15)), v=F.dAlt!=null&&dt>0?Math.max(0,(d-F.dAlt)/dt):0; F.off=off; F.dAlt=d;
      F.ph+=dt*v*.9; const sp=v>.5?Math.min(.7,.2+v*.04):0; F.G.position.set(p.x,bodenY(p.x,p.z)+(v>6?.04*Math.abs(Math.sin(F.ph*2)):0),p.z); F.G.rotation.set(-Math.atan(gradeAt(d)/100),Math.PI/2-p.h,0,'YXZ'); // galoppiert, Wagen holpert
      F.pferd.beine.forEach((b,i)=>b.rotation.x=sp*Math.sin(F.ph+(i<2?0:1.6)+(i%2)*.4)); F.pferd.hals.rotation.x=.1*sp*Math.sin(F.ph*2); for(const r of F.raeder) r.rotation.x+=dt*v/.48;
      const m=F.m, z=TRI_FUHR_TXT.find(([a,b])=>s>=a&&s<b), k=Math.min(1,dt*6); m.kopf.rotation.y+=((s>-1&&s<Z.ab+1.5?-1:0)-m.kopf.rotation.y)*Math.min(1,dt*4); // schaut zu dir (rechts)
      m.arme[0].rotation.x+=((z?-1.3+.35*Math.sin(t*5):s>=Z.ab-.5&&s<Z.ab+1.2?-1.6+.8*Math.sin(t*9):-.9)-m.arme[0].rotation.x)*k; // erzählt mit der Hand, winkt ab
      m.arme[1].rotation.x+=((s>=Z.ab+.8?-2.7+.6*Math.sin(t*14):-.9)-m.arme[1].rotation.x)*k; // Peitsche
      if(z){ F.blase.visible=true; triBlaseText(F.blase,kText(z[2])); const kp=m.kopf.getWorldPosition(new THREE.Vector3()); kp.y+=.9; triBlaseUeber(F.blase,kp,riders3d[myKey]&&riders3d[myKey].g); } } }
  // Reh mit Kitzen: steht am Waldrand rechts, quert vor dir den Weg, wenn du auf 45 m herankommst
  if(L.reh&&!L.reh.fertig){ const Rh=L.reh, d0=T.reh, rw=roadW(R,d0)/2, nah=me.d>d0-150&&me.d<d0+30;
    if(Rh.s<0&&me.d>d0-45) Rh.s=me.d<d0+5?0:99; if(Rh.s>=0) Rh.s+=lauf; if(Rh.s>9||!nah&&Rh.s>=0){ Rh.fertig=true; Rh.tiere.forEach(r=>r.G.visible=false); }
    else Rh.tiere.forEach((r,i)=>{ const tau=Rh.s-i*.7, sp=tau>0, u=sp?rw+9-5.2*tau:rw+9+i*1.4, d=d0+[0,-1.6,1.2][i]+(sp?0:i*.4); r.G.visible=nah&&u>-(rw+16); if(!r.G.visible) return;
      const p=wegPos(d,u), w=sp?Math.abs(Math.sin(tau*5.5)):0; r.G.position.set(p.x,bodenY(p.x,p.z)+w*.45,p.z); r.G.rotation.y=sp?Math.PI/2-p.h:Math.PI/2-p.h+.6;
      r.beine.forEach((b,j)=>b.rotation.z=sp?(j<2?1:-1)*.7*Math.sin(tau*11):0); r.K.rotation.z=sp?.15*Math.sin(tau*11):0; r.kopf.rotation.z=sp?0:.15*Math.sin(t*.8+i); }); }
  // Wildschwein: kommt schräg von rechts aus dem Wald, läuft vor dir auf den Weg, rennt ein Stück vor dir her und biegt dann nach links in den Wald ab (TRI_SAU)
  if(L.sau&&!L.sau.fertig){ const W=L.sau, S=W.S, d0=T.sau, Z=TRI_SAU;
    if(W.s<0&&me.d>d0-22){ if(me.d<d0+10){ W.s=0; W.pd=null; } else W.fertig=true; }
    if(W.s>=0){ W.s+=lauf; const s=W.s, rw=roadW(R,me.d)/2, rein=bSm(s/Z.rein), raus=bSm((s-Z.raus)/Z.ab), gap=13-6*rein+8*raus, d=me.d+gap;
      const u1=rw+6+(.35*Math.sin(s*.8)-rw-6)*rein, u=u1+(-(rw+10)-u1)*raus; // rechts im Wald → Wegmitte (leicht pendelnd) → links hinaus
      if(s>Z.ende){ W.fertig=true; S.G.visible=false; } else { const p=wegPos(d,u); S.G.visible=true; S.G.position.set(p.x,bodenY(p.x,p.z)+.06*Math.abs(Math.sin(s*9)),p.z);
        if(W.pd!=null&&lauf>0){ const dd=d-W.pd, du=u-W.pu; if(Math.hypot(dd,du)>.01) W.rot=Math.atan2(du,Math.max(.01,dd)); } W.pd=d; W.pu=u; S.G.rotation.y=-p.h-(W.rot||0); // schaut in Laufrichtung
        S.beine.forEach((b,j)=>b.rotation.z=(j%2?1:-1)*(j<2?1:-1)*.6*Math.sin(s*14)); S.kopf.rotation.z=.1*Math.sin(s*7); } } }
  // Drei Elwetritsche im Ausfahren: stehen pickend auf dem Weg, sehen dich, springen hoch, rennen wild im Kreis durcheinander und hauen ab (zwei links ins Gebüsch, eine streckt die Zunge raus, rennt vor dir her und biegt rechts ab)
  if(L.tritsch&&!L.tritsch.fertig){ const E=L.tritsch, d0=T.tritsch, Z=TRI_TRITSCH, O=[[0,-.6],[1.4,.9],[-1.1,1.3]], RK=[1.3,1.7,1.1], WK=[4.2,-3.6,5]; // Abstände [d, u] · Kreise: Radius, Drehung rad/s (± = Richtung)
    if(E.s<0&&me.d>d0-Z.sieht){ if(me.d<d0+5) E.s=0; else E.fertig=true; } if(E.s>=0){ E.s+=lauf; E.c=Math.max(E.c,me.d+Z.nah); } const s=E.s, an=s>=0;
    if(E.fertig||s>Z.ende||me.d<d0-150){ for(const e of E.tiere) e.G.visible=false; if(s>Z.ende) E.fertig=true; }
    else { const rw=roadW(R,d0)/2;
      E.tiere.forEach((e,i)=>{ let dd=O[i][0], uu=O[i][1], y=0; const lauft=an&&s>=Z.schreck, f=Math.max(0,s-Z.wirr);
        if(an){ const a=WK[i]*Math.max(0,Math.min(s,Z.wirr)-Z.schreck); dd+=RK[i]*Math.sin(a); uu+=(i===1?-1:1)*RK[i]*(1-Math.cos(a)); // im Kreis
          if(s<Z.schreck) y=.4*Math.sin(Math.PI*s/Z.schreck); if(i===2&&s>1.8&&s<2.4) y=.7*Math.sin(Math.PI*(s-1.8)/.6); // Schreck, eine flattert hoch
          if(i===0) uu-=6*f; else if(i===1){ uu-=5*f; dd+=3*f; } else { dd+=9*Math.min(f,2); uu+=6*Math.max(0,f-2); } // Flucht
          if(Math.abs(uu)>rw+12){ e.G.visible=false; return; } } // im Gebüsch verschwunden
        const d=E.c+dd, p=wegPos(d,uu); e.G.visible=true; e.G.position.set(p.x,bodenY(p.x,p.z)+y+(lauft?.05*Math.abs(Math.sin(t*16+e.ph)):0),p.z);
        if(an&&e.pd!=null&&lauf>0){ const dD=d-e.pd, dU=uu-e.pu; if(Math.hypot(dD,dU)>.005) e.rot=Math.atan2(dU,dD); } e.pd=d; e.pu=uu;
        e.G.rotation.y=-p.h-(!an?e.ph+.3*Math.sin(t*.4+e.ph):s<Z.schreck?Math.PI:e.rot)+Math.PI/2; // Modell blickt nach +z · beim Schreck zu dir
        e.beine.forEach((b,j)=>b.rotation.x=lauft?(j?1:-1)*.9*Math.sin(t*20+e.ph):0); e.K.rotation.z=lauft?.15*Math.sin(t*20+e.ph):0;
        e.fluegel.forEach((w,j)=>w.rotation.z=(j?-1:1)*(an&&s<Z.wirr+1?.5+.5*Math.sin(t*28+e.ph):0));
        e.kopf.rotation.x=!an?.7*Math.max(0,Math.sin(t*1.7+e.ph*2))**3:-.25; e.augen.forEach(a=>a.scale.y=an?1.5:1); e.zunge.visible=i===2&&f>0; }); } } }

// ---- Geräusche (kampagne/sounds/effekte/, über <audio>, da file://): Schleifen werden leiser, je weiter die Kamera weg ist; Einzeltöne einmal je Ereignis (A.ton) ----
const TRI_TON='kampagne/sounds/effekte/', TRI_TON_VOL={wagen:.5,hufe:.7,kettenhemd:.3,wiehern:.7,sturz:.9,glocken:.6,peitsche:.8,wirtshaus:.6,grillen:.35,fluegel:.7,elwetritsch_schrei:.8,gackern:.6,schwein:.8,rascheln_gebuesch:.7};
const triLoops={}; let triTonVor=null;
function triEins(n,v=1,rate=1){ if(v<.02) return; try{ const a=new Audio(TRI_TON+n+'.mp3'); a.volume=clampN(v*TRI_TON_VOL[n],0,1); a.preservesPitch=false; a.playbackRate=rate; a.play().catch(()=>{}); }catch(e){} }
function triLoop(k,n,ziel,dt){ let L=triLoops[k]; if(!L){ if(ziel<=0) return; const a=new Audio(TRI_TON+n+'.mp3'); a.loop=true; a.volume=0; L=triLoops[k]={a,n,v:0}; }
  L.v+=(ziel-L.v)*Math.min(1,dt*3); if(ziel<=0&&L.v<.01){ L.v=0; if(!L.a.paused) L.a.pause(); return; } L.a.volume=clampN(L.v*TRI_TON_VOL[n],0,1); if(L.a.paused) L.a.play().catch(()=>{}); }
function triTonAus(){ for(const k in triLoops){ triLoops[k].v=0; triLoops[k].a.pause(); } }
const triFern=(p,max)=>p?clampN(1-camera.position.distanceTo(p)/max,0,1)**1.5:0; // 1 an der Kamera, 0 ab max m
function triTon(dt,t,rt){ const A=anim.tri, T=R.tri, L=A.leben, K=A.sk, run=race.state==='run', an=(run||race.state==='count')&&!race.paused;
  if(!triTonVor){ triTonVor=Object.keys(TRI_TON_VOL).map(n=>Object.assign(new Audio(TRI_TON+n+'.mp3'),{preload:'auto'})); } // vorladen, damit der erste Ton nicht hängt
  if(race.state==='count'||!A.ton) A.ton={}; const O=A.ton, einmal=(k,b)=>b&&!O[k]&&(O[k]=1); // Einzeltöne: neues Rennen = alles zurück
  const P=A.tonP||(A.tonP={}), fahrt=(k,G)=>{ const p=G.position, a=P[k], v=a&&dt>0?p.distanceTo(a)/dt:0; P[k]=p.clone(); return G.visible&&v>.3&&v<40; }; // bewegt sich das Ding gerade?
  // Goldkarren (Kamerafahrt beim Countdown, später den Burgweg hinauf)
  const C=A.karren; triLoop('karren','wagen',an&&C&&fahrt('k',C.K)?triFern(C.K.position,45):0,dt);
  // Löwenherz' Gefolge: Hufe und Kettenhemden, solange sie reiten; Wiehern, wenn sie herankommen, und nach deinem Sturz; Richard schwingt sich in der Kamerafahrt aufs Pferd
  let rf=0; if(an&&A.reiter.length&&fahrt('r',A.reiter[0].p.G)) for(const r of A.reiter) if(r.p.G.visible) rf=Math.max(rf,triFern(r.p.G.position,60));
  triLoop('hufe','hufe',rf,dt); triLoop('kette','kettenhemd',rf,dt);
  if(einmal('aufs',A.kt>=8.4&&A.kt<10)) triEins('wiehern',.6*Math.max(.3,triFern(A.koenig&&A.koenig.p.G.position,60)));
  if(einmal('herbei',run&&A.d0!=null&&A.d0-me.d<35&&A.d0-me.d>0)) triEins('wiehern');
  if(einmal('sturz',A.sturzS>=.45)) triEins('sturz'); if(einmal('sturzW',A.sturzS>=1.6)) triEins('wiehern',.8,.95);
  // Audienz: „Gott mit Euch!“ – Glocken aus der Ferne
  if(einmal('glocken',A.aud&&rt-TRI_AUD[0]>=31)) triEins('glocken');
  // Fuhrwerk auf der Abfahrt: Hufe und Wagen, Peitsche, wenn er davonfährt · Heuwagen im Gegenverkehr
  if(L){ const F=L.fuhre, f=an&&F&&fahrt('f',F.G)?triFern(F.G.position,50):0; triLoop('fhufe','hufe',f,dt); triLoop('fwagen','wagen',f,dt);
    if(einmal('peitsche',F&&F.G.visible&&rt-triFuhrT()>=TRI_FUHR.ab+.8)) triEins('peitsche',Math.max(.3,triFern(F.G.position,60)));
    const W=L.gegen.find(E=>E.art==='wagen'), w=an&&W&&W.G.visible?triFern(W.G.position,50):0; triLoop('ghufe','hufe',.7*w,dt); triLoop('gwagen','wagen',w,dt); }
  // Wirtshaus „Zack Zack“: Stimmen aus der Stube, Hühner im Stall gackern ab und zu
  const dw=T.wirtD, pw=wegPos(dw,0), pS=wegPos(dw+11,0), W3=new THREE.Vector3(pw.x,roadY(dw)+1.5,pw.z), S3=new THREE.Vector3(pS.x,roadY(dw+11)+.5,pS.z);
  triLoop('wirt','wirtshaus',an?triFern(W3,80):0,dt);
  if(an&&triFern(S3,35)>0&&t>(O.huhn||0)){ if(O.huhn) triEins('gackern',.6*triFern(S3,35),.9+Math.random()*.3); O.huhn=t+3+Math.random()*5; }
  // Dämmerung: Grillen ab dem Ende der Wirtshaus-Szene, werden über 40 s lauter
  triLoop('grillen','grillen',an&&run&&K?clampN((rt-K.tW-10)/40,0,1):0,dt);
  // Elwetritsche-Jagden: Flattern beim Auftauchen und beim Haken, Schrei beim ersten Zunge-Rausstrecken (ab Jagd 2) und beim Sprung in den Sack, danach zappelt sie im Sack
  if(run&&K){ const k=K.J.findIndex(j=>rt>=j.t0&&rt<j.t0+j.dur+1), j=K.J[k];
    if(j){ const tau=rt-j.t0, letzt=k===K.J.length-1; if(einmal('auf'+k,tau>=0&&tau<3)) triEins('fluegel');
      if(einmal('zunge'+k,k>0&&tau>=5.5&&tau<24)) triEins('elwetritsch_schrei',.7,1.15);
      if(einmal('haken'+k,!letzt&&tau>=25)) triEins('fluegel',.8); if(einmal('busch'+k,!letzt&&tau>=26.5)) triEins('rascheln_gebuesch'); if(einmal('sack',letzt&&tau>=25.4)) triEins('elwetritsch_schrei'); }
    const tF=K.J.length?K.J[K.J.length-1].t0+25.6:1e9, x=rt-tF-4, n=Math.floor(x/13), lok=x-n*13-n*5%4, Fr=A.friedel&&A.friedel.r.g;
    if(x>0&&lok>0&&lok<.3&&O.zappel!==n){ O.zappel=n; if(Fr&&Fr.visible) triEins('elwetritsch_schrei',.45*triFern(Fr.position,40),.85+Math.random()*.3); } }
  // Drei Elwetritsche im Ausfahren: Schreck mit Gackern und Flattern, wildes Gegacker beim Durcheinanderrennen, Schrei, als eine die Zunge rausstreckt
  const E=L&&L.tritsch; if(E&&E.s>=0&&!E.fertig){ const s=E.s, Z=TRI_TRITSCH; if(einmal('tschreck',true)){ triEins('gackern',1,1.2); triEins('fluegel',.8); }
    if(an&&s>Z.schreck&&s<Z.wirr+1&&t>(O.tgack||0)){ triEins('gackern',.7,.95+Math.random()*.45); O.tgack=t+.3+Math.random()*.35; }
    if(einmal('thoch',s>=1.8)) triEins('fluegel',.7,1.1); if(einmal('tzunge',s>=Z.wirr+.1)) triEins('elwetritsch_schrei',.8,1.2); if(einmal('tbusch',s>=Z.wirr+.9)) triEins('rascheln_gebuesch',.8); }
  // Reh mit Kitzen springt über den Weg ins Gebüsch · Wildschwein: Rascheln, wenn es aus dem Wald bricht, grunzt beim Rennen vor dir her, Rascheln, wenn es links abtaucht
  const Rh=L&&L.reh; if(Rh&&Rh.s>=0&&Rh.s<9){ if(einmal('reh',true)) triEins('rascheln_gebuesch',.8); if(einmal('rehweg',Rh.s>=3.5)) triEins('rascheln_gebuesch',.6,1.1); }
  const Sw=L&&L.sau; if(Sw&&Sw.s>=0&&!Sw.fertig){ const s=Sw.s, Z=TRI_SAU; if(einmal('saurein',true)) triEins('rascheln_gebuesch');
    if(an&&s>1&&s<Z.raus+Z.ab&&t>(O.grunz||0)){ triEins('schwein',.9,.9+Math.random()*.2); O.grunz=t+1.6+Math.random()*1.8; } if(einmal('saurraus',s>=Z.raus+Z.ab*.6)) triEins('rascheln_gebuesch'); } }
