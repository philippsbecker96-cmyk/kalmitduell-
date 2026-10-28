/* ================= Teufelstisch (Kampagne, Mission 2) – Anfangsszene im Gasthaus „Zum Teufelstisch“ =================
   Beim Countdown und in den ersten TT_GAST.halt s steht man (R.def.halte, man tritt schon), die Kamera ist drinnen: eigener Innenraum in eigener Szene TT_INNEN mit eigenem Licht
   (kein Sonnenlicht, kein Nebel), gezeichnet statt der Welt, solange A.innen.an (rennen.js). Holzraum mit Tresen, Regalen, Fässern, Kamin, Treppe, drei Tischen, Wagenrad-Leuchter,
   Deko: ausgestopfte Elwetritsche (Bezug zu Mission 1), ausgestopfter Fuchs, Geweihe. Du und Friedel sitzt am Tisch, Friedel hat Kopfweh, der Wirt kommt an den Tisch,
   rät euch, unten durchs Tal zu fahren statt am Teufelstisch vorbei, Friedel winkt ab und raunt dir zu (vom Nutzer: kurz halten). Dann Schnitt auf die Tür von außen (der Wirt winkt), ihr fahrt vom Hof, Kamera fliegt zu dir. Sprüche in TT_GAST_TXT (Platzhalter). */

const TT_GAST={halt:26, raus:6, flug:3}; // s nach dem Start drinnen (gerade Zahl wie das Raster von kampPlan) · s Blick auf die Tür von außen · s Flug zu dir – danach die Story-Tafel (kampagne.js)
const TT_INNEN=new THREE.Scene(); // eigener Innenraum, liegt nicht in der Welt
// Sprüche [Szenenzeit kt, Dauer, Sprecher, Text] – kt: 0–5 Countdown, danach 5 + Workout-Zeit · PLATZHALTER, Texte schreibt der Nutzer
const TT_GAST_TXT=[[11.5,5.5,'wirt','[PLATZHALTER] Wenn ihr Richtung Dahn wollt, dann fahrt unne durchs Tal, Richtung Jungfernsprung.'],
  [17.3,5,'wirt','[PLATZHALTER] Am Teufelstisch wollt ihr net vorbei – glaabt mer’s.'],[22.5,3.5,'friedel','[PLATZHALTER] Jo jo, mache mer schunn so.'],
  [26.3,4.2,'friedel','[PLATZHALTER] (leise zu dir) Jo – was der wieder meent …']];
// Kamera drinnen: [ab kt, Position und Blick am Anfang, Position und Blick am Ende der Einstellung] – harter Schnitt zwischen den Einstellungen, dazwischen langsame Fahrt
const TT_GAST_KAM=[[0,[2,2.4,3.85],[-1,1.25,-1.6],[1.8,2.3,3.6],[-1,1.25,-1.5]], // Totale von vorn, erhöht: unten du, rechts Friedel, darüber frei der Wirt hinter dem Tresen mit der Elwetritsche, rechts der Kamin
  [7,[2.4,1.7,2.9],[-1.2,1.15,-1.2],[2.2,1.65,2.7],[-.8,1.15,-.6]], // der Wirt kommt vom Tresen an euren Tisch (links vom Unterzug, sonst hängt der Balken im Bild)
  [11.5,[2.9,1.6,1.25],[0,1.45,.95],[2.4,1.6,1.2],[0,1.5,.95]], // längs über den Tisch auf den Wirt, langsam heran, während er warnt
  [22.5,[1.3,1.7,3],[.8,1.3,.5],[1.2,1.65,2.8],[.9,1.3,.5]]]; // hinter dir: Friedel rechts, der Wirt links ganz im Bild – winkt ab, Wirt geht, Friedel raunt dir zu
const ttInnenAn=()=>!!(anim.tt&&anim.tt.innen&&anim.tt.innen.an);
const ttAnzeigenAus=()=>{ const N=anim.tt&&anim.tt.innen; return !!N&&(race.state==='count'||race.state==='run')&&N.kt<5+TT_GAST.halt+TT_GAST.raus+TT_GAST.flug; }; // Anzeigen (Watt, Intervall, Karte, Profil) erst nach Gasthaus, Tür und Flug zu dir (vom Nutzer) – blenden mit der Tafel ein

// ---- Aufbau (aus buildTeufelstisch) ----
function buildTtGast(A){ const I=TT_INNEN; I.traverse(o=>{ o.geometry&&o.geometry.dispose(); for(const m of [].concat(o.material||[])){ m.map&&m.map.dispose(); m.dispose(); } }); while(I.children.length) I.remove(I.children[0]);
  const M=c=>lam(c), add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, box=(P,w,h,d,m,x,y,z)=>add(P,new THREE.BoxGeometry(w,h,d),m,x,y,z), cyl=(P,r0,r1,h,m,x,y,z,n=10)=>add(P,new THREE.CylinderGeometry(r0,r1,h,n),m,x,y,z);
  const wrap=(t,rx,ry)=>{ t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry); return t; }, q=rng(4711);
  const holz=M('#5a3e28'), holzD=M('#3e2a1c'), holzH=M('#8a6440'), eisen=M('#2e2c2a'), kerze=M('#efe6cf'), flamme=new THREE.MeshBasicMaterial({color:'#ffd27a'});
  // Boden aus Dielen, Wände unten getäfelt, oben Putz mit Fachwerk, Decke mit Balken (Raum 10 × 8 m, 3,1 m hoch)
  const dielen=canvasTex(256,256,(g,w,h)=>{ for(let i=0;i<8;i++){ const c=90+q()*30|0; g.fillStyle=`rgb(${c},${c*.68|0},${c*.42|0})`; g.fillRect(0,i*32,w,32); g.fillStyle='rgba(30,18,10,.8)'; g.fillRect(0,i*32,w,2); g.fillRect((q()*w)|0,i*32,2,32);
    for(let k=0;k<6;k++){ g.fillStyle=`rgba(40,24,12,${.1+q()*.15})`; g.fillRect(0,i*32+4+q()*24,w,1); } } });
  const wandTex=canvasTex(512,160,(g,w,h)=>{ const tf=h*.34; g.fillStyle='#d6c29c'; g.fillRect(0,0,w,h); for(let i=0;i<400;i++){ g.fillStyle=`rgba(${q()<.5?120:255},${q()<.5?96:240},70,.08)`; g.fillRect(q()*w,q()*h,3+q()*6,2+q()*4); }
    for(let x=0;x<w;x+=12){ g.fillStyle=(x/12)%2?'#5e4029':'#553a25'; g.fillRect(x,h-tf,12,tf); g.fillStyle='rgba(20,12,6,.7)'; g.fillRect(x,h-tf,1,tf); } // Täfelung
    g.fillStyle='#3a271a'; g.fillRect(0,0,w,9); g.fillRect(0,h-tf-7,w,8); for(let x=0;x<=w;x+=w/5){ g.fillRect(x-5,0,10,h-tf); } // Balken: oben, Brüstung, Ständer
    g.lineWidth=8; g.strokeStyle='#3a271a'; for(let i=0;i<5;i++) if(i%2===0){ const x0=i*w/5; g.beginPath(); g.moveTo(x0+4,h-tf-6); g.lineTo(x0+w/5-4,8); g.stroke(); } }); // Streben
  const wand=new THREE.MeshLambertMaterial({map:wandTex}), boden=new THREE.MeshLambertMaterial({map:wrap(dielen,3,2.4)});
  { const f=add(I,new THREE.PlaneGeometry(10,8),boden,0,0,0); f.rotation.x=-Math.PI/2; const d=add(I,new THREE.PlaneGeometry(10,8),M('#3a2a1c'),0,3.1,0); d.rotation.x=Math.PI/2;
    for(const [x,z,ry,l] of [[0,-4,0,10],[0,4,Math.PI,10],[-5,0,Math.PI/2,8],[5,0,-Math.PI/2,8]]){ const p=add(I,new THREE.PlaneGeometry(l,3.1),wand,x,1.55,z); p.rotation.y=ry; }
    for(const z of [-3,-1.5,0,1.5,3]) box(I,10,.2,.24,holzD,0,3,z); box(I,.26,.24,8,holzD,-1.3,2.78,0); box(I,.26,.24,8,holzD,3,2.78,0); // Deckenbalken, Unterzüge auf den Stützen
    for(const [x,z] of [[-1.3,-.5],[3,-.6]]){ box(I,.22,2.7,.22,holzD,x,1.35,z); for(const s of [-1,1]){ const k=box(I,.12,.7,.12,holzD,x,2.45,z+s*.3); k.rotation.x=s*.7; } } } // Stützen mit Kopfbändern
  // Tresen hinten links, Regale mit Krügen und Flaschen, zwei liegende Fässer mit Zapfhahn
  box(I,3.8,1.0,.7,holz,-2.7,.5,-2.55); box(I,4,.07,.85,holzH,-2.7,1.04,-2.55); for(let i=0;i<9;i++) box(I,.04,.9,.02,holzD,-4.5+i*.45,.5,-2.19);
  for(const y of [1.55,2.05]){ box(I,3.6,.05,.32,holzH,-2.8,y,-3.82); for(let i=0;i<8;i++){ const x=-4.4+i*.42; if(y>2&&Math.abs(x+2.7)<.4) continue; if(i%3===2){ const f=cyl(I,.05,.055,.24,M(q()<.5?'#2f5a34':'#4a3a22'),x,y+.15,-3.8); cyl(f,.018,.025,.1,f.material,0,.16,0); }
    else { const k=cyl(I,.07,.06,.17,M(i%2?'#8a6a44':'#a08060'),x,y+.11,-3.8); const h=add(k,new THREE.TorusGeometry(.05,.012,5,10,Math.PI),k.material,.07,0,0); h.rotation.z=-Math.PI/2; } } }
  for(const x of [-4.2,-3.3]){ const f=cyl(I,.32,.32,.7,M('#6b4a32'),x,.5,-3.55,14); f.rotation.x=Math.PI/2; for(const z of [-.24,.24]){ const r=add(f,new THREE.TorusGeometry(.33,.02,5,16),eisen,0,z,0); r.rotation.x=Math.PI/2; } cyl(f,.025,.025,.12,M('#b08a3a'),0,.4,-.15,6).rotation.x=.4; box(I,.85,.18,.6,holzD,x,.09,-3.55); }
  // ausgestopfte Elwetritsche auf dem oberen Regal (Flügel gespreizt, Zunge raus) – ihre Augen zucken am Ende der Szene
  const elw=elwetritscheModell(); elw.G.scale.setScalar(.6); elw.G.position.set(-2.7,2.13,-3.78); elw.fluegel.forEach((w,i)=>w.rotation.z=(i?-1:1)*.9); elw.zunge.visible=true; I.add(elw.G); box(I,.42,.08,.3,holzD,-2.7,2.1,-3.78);
  // ausgestopfter Fuchs auf dem Tresenende (sitzt, Maul offen) und Geweihe an den Wänden
  { const F=ttFuchs(); F.position.set(-1.15,1.08,-2.5); F.rotation.y=.5; I.add(F); }
  for(const [x,y,z,ry,s] of [[3.2,2.5,-3.97,0,1.25],[4.97,2.3,.3,-Math.PI/2,1],[-4.97,2.35,-1.4,Math.PI/2,.9],[1,2.45,-3.97,0,.8]]){ const G=ttGeweih(s); G.position.set(x,y,z); G.rotation.y=ry; I.add(G); }
  // Kamin hinten rechts mit Feuer, Rauchfang, Sims, Brennholz
  const stein=new THREE.MeshLambertMaterial({map:canvasTex(256,128,(g,w,h)=>{ g.fillStyle='#4a4038'; g.fillRect(0,0,w,h); for(let y=0;y<h;y+=21) for(let x=-(y/21%2)*20;x<w;x+=40){ const c=110+q()*40|0; g.fillStyle=`rgb(${c},${c*.88|0},${c*.76|0})`; g.fillRect(x+2,y+2,36+q()*4,17); } })});
  box(I,.45,1.5,.9,stein,2.35,.75,-3.55); box(I,.45,1.5,.9,stein,4.05,.75,-3.55); box(I,2.15,.5,.9,stein,3.2,1.25,-3.55); box(I,1.3,1,.1,M('#151110'),3.2,.5,-3.95); box(I,1.4,.12,.9,stein,3.2,.06,-3.55);
  box(I,1.8,1.6,.7,wand,3.2,2.3,-3.65); box(I,2.5,.12,.32,holzD,3.2,1.56,-3.1); cyl(I,.06,.05,.15,M('#8a6a44'),2.5,1.69,-3.1); cyl(I,.03,.03,.16,kerze,3.9,1.7,-3.1); add(I,new THREE.SphereGeometry(.025,6,4),flamme,3.9,1.8,-3.1);
  for(const [x,r] of [[-.25,.25],[.2,-.3],[0,.05]]){ const s=cyl(I,.07,.07,.7,M('#5a3a22'),3.2+x,.18,-3.5,7); s.rotation.set(Math.PI/2,0,r); }
  const fm=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}), fl=[[0,.32,.5,'#ff7a1a'],[-.18,.22,.38,'#ffa83a'],[.17,.2,.34,'#ff8a2a'],[.02,.16,.3,'#ffe08a']].map(([x,r,h,c])=>add(I,new THREE.ConeGeometry(r*.5,h,7),fm(c),3.2+x,.25+h/2,-3.45));
  for(let i=0;i<12;i++){ const s=cyl(I,.06,.06,.5,M(i%2?'#6b4a32':'#5a3e28'),4.55,.07+Math.floor(i/4)*.12,-3.6+(i%4)*.13,7); s.rotation.z=Math.PI/2; }
  // Treppe nach oben an der linken Wand mit Geländer, Tür vorne, Fenster rechts (Mittag: hell)
  for(let i=0;i<10;i++) box(I,1,.3*(i+1),.3,i%2?holz:holzD,-4.5,.15*(i+1),3.45-i*.3); for(let i=0;i<4;i++) box(I,.06,1,.06,holzD,-3.98,.3*(i*3+1)+.5,3.45-i*.9);
  cyl(I,.03,.03,3.8,holzH,-3.98,2.6,2.1,6).rotation.x=-Math.PI/4; // Handlauf
  box(I,1.1,2.1,.08,holzD,-2.4,1.05,3.96); box(I,1.3,.14,.12,holzD,-2.4,2.15,3.94); cyl(I,.04,.04,.03,eisen,-2.0,1.05,3.9,8).rotation.x=Math.PI/2;
  const glas=new THREE.MeshBasicMaterial({color:'#f2eedc'}); for(const z of [1.9,-1]){ add(I,new THREE.PlaneGeometry(1,1.1),glas,4.97,1.75,z).rotation.y=-Math.PI/2; box(I,.12,.08,1.2,holzD,4.92,1.16,z); box(I,.1,1.25,.08,holzD,4.94,1.75,z-.55); box(I,.1,1.25,.08,holzD,4.94,1.75,z+.55); box(I,.1,.08,1.1,holzD,4.94,2.34,z);
    box(I,.04,1.1,.03,eisen,4.95,1.75,z); for(const y of [1.48,1.75,2.02]) box(I,.04,.03,1,eisen,4.95,y,z); }
  // Tische mit Bänken: eurer in der Mitte, einer links mit einem schlafenden Gast, einer am Fenster
  const tisch=(x,z,l,ry)=>{ const G=new THREE.Group(); G.position.set(x,0,z); G.rotation.y=ry; I.add(G); box(G,l,.07,.85,holzH,0,.76,0); for(const sx of [-1,1]) for(const sz of [-1,1]) box(G,.08,.73,.08,holz,sx*(l/2-.15),.37,sz*.33); box(G,l-.3,.05,.05,holz,0,.15,0);
    for(const sz of [-1,1]){ box(G,l,.06,.3,holzH,0,.45,sz*.72); for(const sx of [-1,1]) box(G,.06,.42,.24,holz,sx*(l/2-.2),.21,sz*.72); } cyl(G,.03,.035,.12,kerze,-l/2+.3,.85,0,8); add(G,new THREE.SphereGeometry(.02,6,4),flamme,-l/2+.3,.93,0); return G; };
  tisch(1.2,1.2,2,0); tisch(-2.3,1.7,1.8,0); const t3=tisch(3.9,2.4,1.6,Math.PI/2); for(const z of [-.2,.25]) cyl(t3,.06,.055,.15,M('#8a6a44'),z,.87,.15);
  // Wagenrad-Leuchter über eurem Tisch, Laterne über dem Tresen
  { const L=new THREE.Group(); L.position.set(1.2,2.45,1.2); I.add(L); add(L,new THREE.TorusGeometry(.55,.04,6,24),holzD,0,0,0).rotation.x=Math.PI/2; cyl(L,.08,.08,.1,holzD,0,0,0);
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2, s=box(L,.55,.03,.03,holzD,Math.cos(a)*.27,0,Math.sin(a)*.27); s.rotation.y=-a; cyl(L,.025,.025,.14,kerze,Math.cos(a)*.55,.1,Math.sin(a)*.55,6); add(L,new THREE.SphereGeometry(.022,6,4),flamme,Math.cos(a)*.55,.19,Math.sin(a)*.55); }
    for(let i=0;i<3;i++){ const a=i/3*Math.PI*2, k=cyl(L,.008,.008,.75,eisen,Math.cos(a)*.27,.36,Math.sin(a)*.27,4); k.rotation.z=Math.cos(a)*.35; k.rotation.x=-Math.sin(a)*.35; } }
  box(I,.2,.26,.2,M('#ffcf7a'),-2.7,2.45,-2.5); cyl(I,.008,.008,.5,eisen,-2.7,2.83,-2.5,4);
  // Licht: Feuer, Leuchter, Laterne, Fenster (Mittagssonne), warmes Grundlicht
  I.add(new THREE.HemisphereLight(0xffe2b8,0x2a1e14,.55)); const feuer=new THREE.PointLight(0xff8a3a,2.2,9,2); feuer.position.set(3.2,.7,-2.9); I.add(feuer);
  { const l=new THREE.PointLight(0xffc070,1.4,10,2); l.position.set(1.2,2.25,1.2); I.add(l); const t=new THREE.PointLight(0xffb060,1,7,2); t.position.set(-2.7,2.2,-2.3); I.add(t); const s=new THREE.DirectionalLight(0xfff0d8,.45); s.position.set(8,5,1); I.add(s); }
  // Figuren: Friedel und du am Tisch, Wirt hinter dem Tresen, schlafender Gast; Schoppen (Dubbeglas) in der Hand des Wirts, auf dem Tisch, in Friedels Hand
  const sitz=(m,x,z,ry)=>{ m.G.position.set(x,-.3,z); m.G.rotation.y=ry; m.beine.forEach(b=>b.rotation.x=-1.5); m.arme.forEach(a=>a.rotation.x=-.95); I.add(m.G); return m; };
  const fr=sitz(trMensch({kittel:'#5d7a3a',aermel:'#ece3cf',hose:'#3b342e',haar:'#b8452a'}),1.55,.48,0); for(let i=0;i<12;i++){ const a=-1.3+i/11*2.6, l=.2+((i*37)%7)*.03, st=box(fr.kopf,.035,l,.05,M(i%2?'#b8452a':'#9c3a22'),Math.sin(a)*.13,.08-l/2,-Math.cos(a)*.13); st.rotation.set(-Math.cos(a)*.25,0,Math.sin(a)*.25); } // rote Zotteln
  const ichJ=lookOf(myKey).jersey, ich={bauer:sitz(trMensch({kittel:ichJ,aermel:'#ece3cf',hose:'#3b342e',haar:'#6b4a2e'}),.85,1.92,Math.PI), baeuerin:sitz(trMensch({lang:ichJ,kittel:ichJ,aermel:'#ece3cf',tuch:'#e6dcc4'}),.85,1.92,Math.PI)};
  const wirt=trMensch({kittel:'#6b4a2e',aermel:'#ece3cf',hose:'#3a3020',haar:'#8a8a86',bart:'#8a8a86'}); box(wirt.G,.36,.7,.04,M('#e8e0d0'),0,.95,.25); I.add(wirt.G);
  const gast=sitz(trMensch({kittel:'#6a5a4a',hose:'#3a3020',haar:'#5a4a3a',bart:'#5a4a3a'}),-2,.98,0); gast.G.rotation.x=1; gast.G.position.set(-2,.07,.31); gast.kopf.rotation.set(.2,.5,0); gast.arme.forEach((a,i)=>{ a.rotation.x=-2.6; a.rotation.z=i?-.35:.35; }); // um die Hüfte nach vorn gekippt, Kopf auf den Armen cyl(I,.07,.06,.17,M('#8a6a44'),-1.6,.87,1.55);
  const zzz=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(128,64,g=>{ g.fillStyle='#f2ead8'; g.font='bold 40px Georgia'; g.fillText('z',8,56); g.font='bold 30px Georgia'; g.fillText('z',48,36); g.font='bold 22px Georgia'; g.fillText('z',84,20); }),transparent:true,depthWrite:false})); zzz.scale.set(.4,.2,1); I.add(zzz);
  const schoppen=()=>{ const G=new THREE.Group(); add(G,new THREE.CylinderGeometry(.048,.042,.15,12),new THREE.MeshPhongMaterial({color:'#f4f8f0',transparent:true,opacity:.35,shininess:90,depthWrite:false}),0,0,0);
    const w=add(G,new THREE.CylinderGeometry(.043,.04,.12,12),new THREE.MeshLambertMaterial({color:'#e6c45a',transparent:true,opacity:.85}),0,-.012,0); G.userData.wein=w; return G; };
  const gH=schoppen(); gH.position.set(0,-.66,.04); wirt.arme[1].add(gH); const gT=schoppen(); gT.position.set(1.5,.87,.86); I.add(gT); const gF=schoppen(); gF.position.set(0,-.66,.04); gF.rotation.x=1.4; fr.arme[1].add(gF);
  { const g=schoppen(); g.position.set(.8,.87,1.55); I.add(g); } // dein Schoppen
  const blase={friedel:triBlase(), wirt:triBlase()}; for(const b of Object.values(blase)){ world.remove(b); I.add(b); } // Sprechblasen im Innenraum
  A.innen={an:false, kt:0, friedel:fr, ich, wirt, gast, zzz, gH, gT, gF, blase, feuer, fl, elw}; }

// ausgestopfter Fuchs auf einem Brett: sitzt, Maul offen, buschiger Schwanz um die Pfoten (lokal +z nach vorn)
function ttFuchs(){ const G=new THREE.Group(), M=c=>lam(c), rot=M('#c8692a'), weiss=M('#efe6d6'), dunkel=M('#2a1e16'), add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; };
  add(G,new THREE.BoxGeometry(.5,.05,.36),M('#5a3e28'),0,.025,0);
  const r=add(G,new THREE.SphereGeometry(.13,10,8),rot,0,.27,-.02); r.scale.set(1,1.5,1.1); r.rotation.x=-.25; const b=add(G,new THREE.SphereGeometry(.08,8,6),weiss,0,.31,.08); b.scale.set(1,1.5,.8);
  for(const s of [-1,1]){ add(G,new THREE.SphereGeometry(.08,8,6),rot,s*.09,.13,-.05); const v=add(G,new THREE.CylinderGeometry(.02,.018,.24,6),rot,s*.05,.17,.08); add(v,new THREE.SphereGeometry(.024,6,4),dunkel,0,-.12,.01); }
  const K=new THREE.Group(); K.position.set(0,.52,.05); K.rotation.x=.15; G.add(K); const k=add(K,new THREE.SphereGeometry(.085,10,8),rot,0,0,0); k.scale.set(1.15,.95,1);
  const sn=add(K,new THREE.ConeGeometry(.045,.14,8),rot,0,-.025,.12); sn.rotation.x=Math.PI/2; add(K,new THREE.SphereGeometry(.016,6,4),dunkel,0,-.025,.19); const uk=add(K,new THREE.BoxGeometry(.05,.015,.09),weiss,0,-.07,.1); uk.rotation.x=.35; add(K,new THREE.BoxGeometry(.035,.01,.06),M('#a8343a'),0,-.06,.1).rotation.x=.25; // Schnauze, Nase, offener Unterkiefer, Zunge
  for(const s of [-1,1]){ add(K,new THREE.SphereGeometry(.018,6,4),dunkel,s*.04,.02,.07); const o=add(K,new THREE.ConeGeometry(.035,.1,4),rot,s*.05,.1,-.01); o.rotation.z=-s*.25; add(o,new THREE.ConeGeometry(.014,.035,4),dunkel,0,.035,0); add(K,new THREE.SphereGeometry(.04,6,4),weiss,s*.06,-.04,.04); }
  const sw=add(G,new THREE.SphereGeometry(.08,8,6),rot,.13,.08,.06); sw.scale.set(1,1,3.2); sw.rotation.y=.9; add(sw,new THREE.SphereGeometry(.06,8,6),weiss,0,0,.85).scale.set(1,1,.35); // Schwanz mit weißer Spitze
  return G; }
// Geweih auf einem Holzschild mit Schädel (lokal +z vom Wandbrett weg), s: Größe
function ttGeweih(s){ const G=new THREE.Group(), M=c=>lam(c), stange=M('#8a6a48'), spitze=M('#e8dcc0'), add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; };
  const sch=add(G,new THREE.CylinderGeometry(.16,.13,.04,7),M('#5a3a22'),0,0,.02); sch.rotation.x=Math.PI/2; const sd=add(G,new THREE.BoxGeometry(.1,.2,.08),M('#efe8da'),0,-.02,.08); sd.rotation.x=-.2;
  for(const sg of [-1,1]){ let P=new THREE.Group(); P.position.set(sg*.05,.08,.09); P.rotation.set(-.35,0,-sg*.55); G.add(P);
    for(const [l,kr] of [[.22,.3],[.2,.22],[.18,.2],[.14,0]]){ const c=add(P,new THREE.CylinderGeometry(.012,.02,l,6),stange,0,l/2,0); const e=new THREE.Group(); e.position.y=l; e.rotation.z=sg*kr; P.add(e);
      const n=add(e,new THREE.CylinderGeometry(.008,.014,.12,5),stange,0,.04,.04); n.rotation.x=1.1; add(n,new THREE.SphereGeometry(.009,5,4),spitze,0,.06,0); P=e; } add(P,new THREE.SphereGeometry(.012,5,4),spitze,0,0,0); }
  G.scale.setScalar(s); return G; }

// ---- Bewegung (jeden Frame, aus poseTeufelstisch) ----
function poseTtGast(dt){ const A=anim.tt, N=A&&A.innen; if(!N) return; const st=race.state, t=performance.now()/1000;
  if(st==='count'){ if(N.kst!=='count') N.kt=0; N.kt=Math.min(5,N.kt+dt); } else N.kt=st==='run'?5+race.t:0; N.kst=st; const kt=N.kt, ende=5+TT_GAST.halt;
  N.an=(st==='count'||st==='run')&&kt<ende; ttGastWirtWinkt(A,kt,ende); if(!N.an){ for(const b of Object.values(N.blase)) b.visible=false; return; }
  const sm=(a,b)=>bSm((kt-a)/(b-a)), F=N.friedel, W=N.wirt, f=F.arme[1], fk=F.kopf;
  // du: Bauer oder Bäuerin, schaust zum, der gerade spricht
  for(const k of ['bauer','baeuerin']) N.ich[k].G.visible=k===(KST.stand==='baeuerin'?'baeuerin':'bauer'); const ich=N.ich[KST.stand==='baeuerin'?'baeuerin':'bauer'];
  const spr=TT_GAST_TXT.find(([a,d])=>kt>=a&&kt<a+d), zuW=spr&&spr[2]==='wirt'; ich.kopf.rotation.y+=((zuW?.72:-.45)-ich.kopf.rotation.y)*Math.min(1,dt*3);
  // Friedel: Kopfweh (Hand am Kopf), hört dem Wirt zu, winkt ab, beugt sich zu dir und grinst
  let fx=-.95, fz=.12, kx=.05, ky=0;
  if(kt<11.5){ fx=-2.7; fz=-.45; kx=.25+.05*Math.sin(t*1.3); ky=.08*Math.sin(t*.9); } else if(kt<22.5) ky=-.9;
  else if(kt<26){ fx=-1.7; fz=-.2+.5*Math.sin(t*9); ky=-.9+.3*Math.sin(t*7); } else { fx=-1.3; ky=-.45; kx=.15; }
  f.rotation.x+=(fx-f.rotation.x)*Math.min(1,dt*8); f.rotation.z+=(fz-f.rotation.z)*Math.min(1,dt*8); fk.rotation.x+=(kx-fk.rotation.x)*Math.min(1,dt*8); fk.rotation.y+=(ky-fk.rotation.y)*Math.min(1,dt*5);
  F.G.position.y=-.3; F.G.rotation.z+=((kt>=26.3?-.08:0)-F.G.rotation.z)*Math.min(1,dt*4); // zu dir hingeneigt
  // Schoppen: nur Friedels Glas auf dem Tisch (kein Konterschoppen mehr)
  N.gH.visible=false; N.gF.visible=false; N.gT.visible=true;
  // Wirt: poliert hinter dem Tresen einen Krug, kommt an den Tisch, rät zum Talweg, warnt mit erhobenem Finger, Hände in die Hüften, geht kopfschüttelnd zurück
  const P=[[-2.4,-3.35],[-.3,-3],[0,.95]], L1=Math.hypot(P[1][0]-P[0][0],P[1][1]-P[0][1]), L2=Math.hypot(P[2][0]-P[1][0],P[2][1]-P[1][1]), hin=kt>7&&kt<11.5, zur=kt>25.5&&kt<30, geht=hin||zur, w=sm(7,11.5)*(1-sm(25.5,30))*(L1+L2);
  const [a,b,u]=w<L1?[P[0],P[1],w/L1]:[P[1],P[2],(w-L1)/L2]; W.G.position.set(a[0]+(b[0]-a[0])*u,0,a[1]+(b[1]-a[1])*u); const ry=kt<7?0:hin?Math.atan2(b[0]-a[0],b[1]-a[1]):zur?Math.atan2(a[0]-b[0],a[1]-b[1]):kt>=30?0:Math.PI/2; W.G.rotation.y+=angDiff(ry,W.G.rotation.y)*Math.min(1,dt*6);
  const ph=t*7; W.beine[0].rotation.x=geht?.45*Math.sin(ph):0; W.beine[1].rotation.x=geht?-.45*Math.sin(ph):0;
  let w0=-1.1+.15*Math.sin(t*4), w1=-1.1+.15*Math.cos(t*4), z0=-.12, z1=.12, wx=0, wk=0;
  if(geht){ w0=-.35*Math.sin(ph); w1=.35*Math.sin(ph); } else if(kt>=11.5&&kt<17.3){ w0=0; w1=-1+.25*Math.sin(t*4); } else if(kt>=17.3&&kt<22.5){ w0=0; w1=-2.7; z1=-.15+.08*Math.sin(t*6); wx=.12*sm(17.3,18.3); wk=.15*Math.sin(t*3); } else if(kt>=22.5&&kt<25.5){ w0=w1=-.3; z0=-.7; z1=.7; wk=.25*Math.sin(t*2.2); }
  W.arme[0].rotation.x+=(w0-W.arme[0].rotation.x)*Math.min(1,dt*8); W.arme[1].rotation.x+=(w1-W.arme[1].rotation.x)*Math.min(1,dt*8); W.arme[0].rotation.z+=(z0-W.arme[0].rotation.z)*Math.min(1,dt*6); W.arme[1].rotation.z+=(z1-W.arme[1].rotation.z)*Math.min(1,dt*6);
  W.G.rotation.x+=(wx-W.G.rotation.x)*Math.min(1,dt*4); W.kopf.rotation.y=kt>=11.5&&kt<25.5?.3+wk:zur?.35*Math.sin(t*6):0; W.kopf.rotation.x=kt<7||kt>=30?.35:0; // schüttelt beim Gehen den Kopf
  // schlafender Gast schnarcht, Feuer und Kerzen flackern
  { const z=(t%3)/3; N.zzz.position.set(-1.9+.15*z,1.2+.35*z,1.7); N.zzz.material.opacity=Math.sin(Math.PI*z); }
  const fk2=.8+.2*Math.sin(t*11)+.1*Math.sin(t*23+1); N.feuer.intensity=2.2*fk2; N.fl.forEach((m,i)=>m.scale.set(1,fk2+.15*Math.sin(t*(13+i*3)+i),1));
  // Sprechblasen über Friedel und dem Wirt
  for(const [wer,m] of [['friedel',F],['wirt',W]]){ const B=N.blase[wer], s=TT_GAST_TXT.find(([a,d,w2])=>w2===wer&&kt>=a&&kt<a+d), txt=s?kText(s[3]):null; B.visible=!!txt;
    if(txt){ triSag(wer,txt); triBlaseText(B,txt); const p=m.kopf.getWorldPosition(new THREE.Vector3()); p.y+=.4; triBlaseUeber(B,p,null); } } }
// Wirt vor der Tür (Außenwelt): winkt euch beim Losfahren nach
function ttGastWirtWinkt(A,kt,ende){ const W=A.gast&&A.gast.wirt; if(!W) return; if(!A.gast.vor){ const p=A.gast.wp0.clone().lerp(A.gast.wp,1.7); p.y=bodenY(p.x,p.z); W.G.position.copy(p); A.gast.vor=1; } /* vor die Tür, nicht in der Laibung (vom Nutzer) */ const an=kt>=ende-1&&kt<ende+TT_GAST.raus+TT_GAST.flug+3, a=W.arme[0];
  a.rotation.x=an?-2.6:0; a.rotation.z=an?-.3+.35*Math.sin(performance.now()/1000*8):-.12; }

// ---- Kamera (aus draw): drinnen die Einstellungen aus TT_GAST_KAM, dann die Tür von außen, dann Flug zu dir ----
function ttGastKamera(){ const A=anim.tt, N=A&&A.innen; if(!N||!(race.state==='count'||race.state==='run')) return; const kt=N.kt, ende=5+TT_GAST.halt, V=(a)=>new THREE.Vector3(...a);
  if(N.an){ let i=0; while(i<TT_GAST_KAM.length-1&&kt>=TT_GAST_KAM[i+1][0]) i++; const [a,p0,l0,p1,l1]=TT_GAST_KAM[i], b=i<TT_GAST_KAM.length-1?TT_GAST_KAM[i+1][0]:ende, w=bSm((kt-a)/(b-a));
    camera.position.copy(V(p0).lerp(V(p1),w)); camera.lookAt(V(l0).lerp(V(l1),w)); return; }
  const s=kt-ende, G=R.tt.gast, ich=riders3d[myKey]; if(s<0||s>=TT_GAST.raus+TT_GAST.flug||!G||!A.gast) return;
  const c=wegPos(G.d-5,-(roadW(R,G.d)/2+3.5)), pos=new THREE.Vector3(c.x,bodenY(c.x,c.z)+1.7,c.z), tuer=A.gast.wirt.G.position.clone(); tuer.y+=1.3; // links vom Weg, Blick über den Weg auf die Tür
  const fahrer=ich?ich.g.position.clone():tuer.clone(); if(ich&&A.friedel) fahrer.lerp(A.friedel.r.g.position,.5); fahrer.y+=1.1;
  const look=tuer.lerp(fahrer,bSm((s-1.5)/2.5)), f=bSm((s-TT_GAST.raus)/TT_GAST.flug); if(f>0){ pos.lerp(camera.position,f).y+=3*Math.sin(Math.PI*f); look.lerp(new THREE.Vector3(camS.lx,camS.ly,camS.lz),f); }
  camera.position.copy(pos); camera.lookAt(look); }
