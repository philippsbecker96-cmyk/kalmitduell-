/* ---------- Becker & Dengel als 3D-Figuren ---------- */
const riders3d={becker:null,dengel:null,custom:null};
const mittelalter=()=>!!(R&&R.def&&R.def.burg); // Burg Berwartstein: Holzrad und Mittelalter-Kleidung für alle (Lobby-Vorschau bleibt modern)
function buildRiders(){ const ma=mittelalter(); RKEYS.forEach(k=>{ riders3d[k]=makeRider(k,undefined,ma); world.add(riders3d[k].g); }); riders3d.devil=makeDevil(ma); riders3d.devil.g.visible=false; world.add(riders3d.devil.g); }
function rebuildRiders(){ refreshRiders(); // nach einer Änderung am Aussehen: Fahrer in Welt und Lobby-Vorschau neu bauen
  if(world) RKEYS.forEach(k=>{ const o=riders3d[k]; if(o) world.remove(o.g); const r=makeRider(k,undefined,mittelalter()); riders3d[k]=r; world.add(r.g); if(anim.stadium) addFloodShadows(r);
    if(R&&!R.space&&!R.island) r.g.traverse(m=>{ if(m.isMesh){ m.receiveShadow=true; m.castShadow=!(m.geometry&&m.geometry.type==='PlaneGeometry')&&!m.material.transparent; } }); });
  RKEYS.forEach(k=>{ prev.sc.remove(prev.rs[k].g); const r=makeRider(k); r.tag.visible=false; prev.rs[k]=r; prev.sc.add(r.g); });
  renderRiderCards(); }
const UNIT_Y=new THREE.Vector3(0,1,0);
function cyl(r,mat,r2){ return new THREE.Mesh(new THREE.CylinderGeometry(r,r2??r,1,8),mat); }
function place(m,a,b){ const va=new THREE.Vector3(...a), vb=new THREE.Vector3(...b), dir=vb.clone().sub(va), L=dir.length();
  m.position.copy(va).add(vb).multiplyScalar(.5); m.scale.set(m.scale.x,L,m.scale.z); m.quaternion.setFromUnitVectors(UNIT_Y, dir.normalize()); }
// Holzrad (Draisine mit Pedalen): Speichenräder mit Eisenreif, Längsbalken, Holzgabeln mit Eisenbeschlägen, T-Lenker, Ledersattel, Holzkurbeln – gleiche Maße wie das Rennrad, damit Haltung und Treten passen
function holzRad(body,M){ const holz=M('#7a5234'), dunkel=M('#4e3423'), eisen=M('#2e2c2a'), leder=M('#5a2e1c');
  const balken=(a,b,w=.06,d=.055,m=holz)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,1,d),m); place(o,a,b); body.add(o); return o; };
  for(const x of [-.52,.52]){ const fe=new THREE.Mesh(new THREE.TorusGeometry(.315,.03,6,24),dunkel); fe.position.set(x,.34,0); body.add(fe);
    const rf=new THREE.Mesh(new THREE.TorusGeometry(.345,.014,4,24),eisen); rf.position.set(x,.34,0); body.add(rf);
    for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; balken([x+Math.cos(a)*.04,.34+Math.sin(a)*.04,0],[x+Math.cos(a)*.3,.34+Math.sin(a)*.3,0],.018,.018); }
    const nb=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.12,8),holz); nb.rotation.x=Math.PI/2; nb.position.set(x,.34,0); body.add(nb);
    for(const z of [-.06,.06]){ const bs=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,.012),eisen); bs.position.set(x,.34,z); body.add(bs); } }
  balken([-.66,.72,0],[.46,.77,0],.08,.07); // Längsbalken
  for(const z of [-.055,.055]){ balken([-.42,.73,z],[-.52,.34,z],.035,.03); balken([-.64,.72,z],[-.52,.34,z],.035,.03); balken([.36,.76,z],[.52,.34,z],.035,.03); balken([.5,.79,z],[.52,.34,z],.035,.03); } // Gabeln als Dreiecke
  balken([-.04,.74,0],[0,.3,0],.05,.05); balken([0,.3,0],[-.5,.36,0],.03,.03,dunkel); // Tretlager-Stütze, Strebe nach hinten
  balken([-.16,.75,0],[-.16,.86,0],.05,.05); const sa=new THREE.Mesh(new THREE.BoxGeometry(.3,.06,.15),leder); sa.position.set(-.16,.9,0); body.add(sa);
  balken([.44,.76,0],[.47,.92,0],.045,.045); const bar=cyl(.022,holz); place(bar,[.47,.92,-.22],[.47,.92,.22]); body.add(bar);
  for(const z of [-.2,.2]){ const gr=cyl(.028,dunkel); place(gr,[.47,.92,z-.05],[.47,.92,z+.05]); body.add(gr); }
  const crank=new THREE.Group(); crank.position.set(0,.3,0); body.add(crank); // Holzkurbeln, Pedal 0 zeigt bei Kurbelwinkel 0 nach vorn
  const sch=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.03,10),dunkel); sch.rotation.x=Math.PI/2; crank.add(sch);
  for(const s of [1,-1]){ const k=new THREE.Mesh(new THREE.BoxGeometry(.19,.035,.03),holz); k.position.set(s*.085,0,-s*.08); crank.add(k);
    const pd=new THREE.Mesh(new THREE.BoxGeometry(.07,.025,.1),eisen); pd.position.set(s*.17,0,-s*.13); crank.add(pd); } // Pedal 0 gehört zum linken Bein (z = -0,11)
  return crank; }
function makeRider(key,Lo,ma){
  const L=Lo||lookOf(key), S=Lo?specOf(key,Lo):RIDERS[key];
  const g=new THREE.Group(), tilt=new THREE.Group(), body=new THREE.Group(); g.add(tilt); tilt.add(body); tilt.scale.setScalar(1);
  const M=c=>new THREE.MeshLambertMaterial({color:c});
  const black=M('#1b1b1d'), skin=M('#efc9a6'), tire=M('#151515'), white=M('#f4f4ef'), pantsM=M(ma?'#3b342e':L.pants), leinen=M('#ece3cf'), stiefel=M('#4a3222');
  const kit=[]; const kitMat=(c,map)=>{ const m=new THREE.MeshLambertMaterial({color:c,map:map||null}); kit.push({m,c:new THREE.Color(c),map:map||null}); return m; };

  // --- Rad ---
  let crank; if(ma) crank=holzRad(body,M); else { const frameC=L.frame, accent=L.accent;
  for(const x of [-.52,.52]){ const w=new THREE.Mesh(new THREE.TorusGeometry(.34,.03,6,24), tire); w.position.set(x,.34,0); body.add(w);
    if(L.tanwall){ const tw=new THREE.Mesh(new THREE.TorusGeometry(.31,.012,4,24), M('#c8a46e')); tw.position.set(x,.34,.012); body.add(tw); }
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.29,.018,4,24), M(L.tanwall?'#3a3d42':'#1d1d1f')); rim.position.set(x,.34,0); body.add(rim);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.1,6), M('#777')); hub.rotation.x=Math.PI/2; hub.position.set(x,.34,0); body.add(hub); }
  const F={rh:[-.52,.34,0], bb:[0,.3,0], seat:[-.16,.86,0], ht:[.42,.84,0], ht2:[.45,.74,0], fh:[.52,.34,0]};
  const tubes=[['rh','bb',frameC],['bb','seat',L.accentOn==='seat'?accent:frameC],['seat','rh',frameC],['seat','ht',frameC],['ht2','bb',frameC],['ht','fh',L.accentOn==='fork'?accent:frameC]];
  for(const [a,b,c] of tubes){ const t=cyl(.028,M(c)); place(t,F[a],F[b]); body.add(t); }
  const stem=cyl(.022,black); place(stem,[.42,.84,0],[.47,.92,0]); body.add(stem);
  const bar=cyl(.022,M(L.tape)); place(bar,[.47,.92,-.2],[.47,.92,.2]); body.add(bar);
  for(const z of [-.2,.2]){ const drop=cyl(.02,M(L.tape)); place(drop,[.47,.92,z],[.55,.84,z]); body.add(drop); }
  const saddle=new THREE.Mesh(new THREE.BoxGeometry(.26,.04,.09), black); saddle.position.set(-.16,.9,0); body.add(saddle);
  const bottle=cyl(.038,M(L.bottle||accent)); place(bottle,[.06,.46,0],[.2,.64,0]); body.add(bottle);
  if(L.bag!=='keine'){ const big=L.bag==='gross'; // Satteltasche: groß und schwarz oder klein und hell
    const bag=new THREE.Mesh(new THREE.CylinderGeometry(big?.12:.07, big?.07:.05, big?.55:.28, 10), M(big?'#1e1f22':'#d6d6d0'));
    bag.rotation.z=Math.PI/2+0.25; bag.position.set(big?-.47:-.34, big?.84:.82, 0); body.add(bag); }
  crank=new THREE.Group(); crank.position.set(0,.3,0); body.add(crank);
  const cr=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.02,12), M('#444')); cr.rotation.x=Math.PI/2; cr.position.z=.06; crank.add(cr); }

  // --- Fahrer ---
  const hip=[-.13,.99,0], sh=[.25,1.36,0], i0=body.children.length, arms=[];
  const torso=new THREE.Mesh(new THREE.CylinderGeometry(S.torsoR*.92,S.torsoR,1,10), kitMat(L.jersey)); torso.scale.z=S.torsoZ; place(torso,hip,sh); body.add(torso);
  if(L.hem){ const hem=new THREE.Mesh(new THREE.CylinderGeometry(S.torsoR+.008,S.torsoR+.008,1,10), kitMat(L.sleeve)); hem.scale.z=S.torsoZ; place(hem,hip,[hip[0]+.04,hip[1]+.06,0]); body.add(hem); }
  const pants=new THREE.Mesh(new THREE.SphereGeometry(S.torsoR*1.05,10,8), pantsM); pants.scale.set(1.15,.8,S.torsoZ*1.05); pants.position.set(hip[0],hip[1],0); body.add(pants);
  // Regenbogenstreifen (Weltmeister) – nur in diesem Modus sichtbar
  const rainbow=new THREE.Group(); body.add(rainbow); rainbow.visible=false;
  ['#1e5bc6','#d62828','#111111','#f4c300','#1f9d55'].forEach((c,i)=>{ const t0=.42+i*.055, a=[hip[0]+(sh[0]-hip[0])*t0, hip[1]+(sh[1]-hip[1])*t0, 0], t1=t0+.05, b=[hip[0]+(sh[0]-hip[0])*t1, hip[1]+(sh[1]-hip[1])*t1, 0];
    const s=new THREE.Mesh(new THREE.CylinderGeometry(S.torsoR+.012,S.torsoR+.012,1,10), M(c)); s.scale.z=S.torsoZ; place(s,a,b); rainbow.add(s); });
  if(ma){ // Wams: helle Knopfleiste vorn (Brust zeigt nach vorn unten), Schulterwülste in der Zweitfarbe mit Streifen, Ledergürtel
    const ax=[sh[0]-hip[0],sh[1]-hip[1]], al=Math.hypot(...ax), nx=ax[1]/al, ny=-ax[0]/al, kn=M('#e6d6a8');
    for(let i=1;i<=4;i++){ const t=i/5.2, b=new THREE.Mesh(new THREE.SphereGeometry(.018,6,5),kn); b.position.set(hip[0]+ax[0]*t+nx*S.torsoR*.97, hip[1]+ax[1]*t+ny*S.torsoR*.97, 0); body.add(b); }
    for(const z of [-S.zS,S.zS]){ const w=new THREE.Mesh(new THREE.SphereGeometry(.075,10,8),kitMat(L.sleeve)); w.scale.set(1.15,.85,1); w.position.set(sh[0]-.03,sh[1]-.01,z*.95); body.add(w);
      const st=new THREE.Mesh(new THREE.TorusGeometry(.068,.012,4,14),kitMat(L.jersey)); st.position.copy(w.position); st.rotation.y=Math.PI/2; body.add(st); }
    const gu=new THREE.Mesh(new THREE.CylinderGeometry(S.torsoR+.012,S.torsoR+.012,1,10),M('#5a3a22')); gu.scale.z=S.torsoZ; place(gu,[hip[0]+ax[0]*.12,hip[1]+ax[1]*.12,0],[hip[0]+ax[0]*.18,hip[1]+ax[1]*.18,0]); body.add(gu); }
  // Arme: Ärmel (optional mit Zickzack), kurze Ärmel mit nackten Unterarmen oder lange Ärmel
  const zl=new THREE.Color(L.sleeve).lerp(new THREE.Color('#ffffff'),.55).getStyle();
  const zig=L.zigzag?canvasTex(64,64,g=>{ g.fillStyle=L.sleeve; g.fillRect(0,0,64,64); g.strokeStyle=zl; g.lineWidth=3; for(let y=8;y<64;y+=16){ g.beginPath(); for(let x=0;x<=64;x+=8) g.lineTo(x,y+((x/8)%2?5:-5)); g.stroke(); } }):null;
  const sleeveM=ma?leinen:kitMat(L.zigzag?'#ffffff':L.sleeve, zig), foreM=ma?leinen:L.longSleeve?sleeveM:skin; // Mittelalter: weite Leinenärmel
  const zS=S.zS;
  for(const z of [-zS,zS]){ const el=[.36,1.12,z*1.05], hand=[.5,.9,z>0?.2:-.2], shp=[sh[0]-.02,sh[1]-.02,z*.9];
    const ua=cyl(S.armR*(ma?1.45:1.25),sleeveM,S.armR*(ma?1.35:1.1)); place(ua,shp,el); body.add(ua);
    const fa=cyl(S.armR*(ma?1.35:1),foreM,S.armR*(ma?1.25:.85)); place(fa,el,hand); body.add(fa);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(S.armR*1.05,6,5), skin); hd.position.set(...hand); body.add(hd); arms.push(armOf(ua,fa,hd,hip,shp,el,hand)); }
  // Kopf, Helm, Brille, Kappe
  const ih=body.children.length, neck=cyl(.05,skin); place(neck,[sh[0]+.02,sh[1]+.02,0],[.36,1.47,0]); body.add(neck);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10), skin); head.scale.set(1.05,1.1,.95); head.position.set(.4,1.53,0); body.add(head);
  if(ma){ // Bundhaube aus braunem Filz: eng anliegend, Ohrenklappen, Bänder unters Kinn
    const hb=new THREE.Mesh(new THREE.SphereGeometry(.132,14,10,0,Math.PI*2,0,Math.PI*.58), M('#6b4a2e')); hb.scale.set(1.08,1.1,1); hb.position.set(.39,1.535,0); hb.rotation.z=.35; body.add(hb);
    for(const z of [-.112,.112]){ const ok=new THREE.Mesh(new THREE.SphereGeometry(.06,8,6), M('#6b4a2e')); ok.scale.set(1,1.15,.45); ok.position.set(.37,1.49,z); body.add(ok);
      const bd=cyl(.007,M('#4a3220')); place(bd,[.38,1.44,z*.95],[.45,1.41,z*.55]); body.add(bd); } }
  else { const helm=new THREE.Mesh(new THREE.SphereGeometry(.15,14,10,0,Math.PI*2,0,Math.PI/2), M(L.helmet)); helm.scale.set(1.18,1,1); helm.position.set(.39,1.56,0); helm.rotation.z=-.28; body.add(helm);
  const ventC=new THREE.Color(L.helmet).multiplyScalar(lum(L.helmet)>.3?.85:.45).getStyle();
  for(let i=-1;i<=1;i++){ const vent=new THREE.Mesh(new THREE.BoxGeometry(.13,.012,.018), M(ventC)); vent.position.set(.38,1.705,i*.05); vent.rotation.z=-.25; body.add(vent); }
  if(L.glasses==='helm'){ // Brille steckt oben im Helm
    const gl=new THREE.Mesh(new THREE.BoxGeometry(.06,.035,.22), M('#7a3d86')); gl.position.set(.5,1.66,0); gl.rotation.z=-.55; body.add(gl);
    const glf=new THREE.Mesh(new THREE.BoxGeometry(.012,.04,.24), M('#f4f4ef')); glf.position.set(.47,1.655,0); glf.rotation.z=-.55; body.add(glf); }
  else if(L.glasses==='nase'){ const gl=new THREE.Mesh(new THREE.BoxGeometry(.03,.05,.21), new THREE.MeshLambertMaterial({color:'#9b5fe0', emissive:'#2a1050'})); gl.position.set(.51,1.53,0); body.add(gl); }
  if(L.cap){ // weiße Radkappe unter dem Helm
    const band=new THREE.Mesh(new THREE.CylinderGeometry(.128,.128,.045,14), white); band.position.set(.4,1.555,0); band.rotation.z=-.22; body.add(band);
    const brim=new THREE.Mesh(new THREE.BoxGeometry(.12,.014,.16), white); brim.position.set(.55,1.6,0); brim.rotation.z=.18; body.add(brim); } }
  // Beine: Hose, Socken, Schuhe
  const sockC=L.socks, shoeC=L.shoes, il=body.children.length;
  const legs=[]; for(const z of [-.11,.11]){ const th=cyl(S.legR,pantsM,S.legR*.85), shn=cyl(S.legR*.72,ma?pantsM:skin,S.legR*.6), sk=cyl(S.legR*(ma?.74:.66),ma?stiefel:M(sockC),S.legR*.6), // Mittelalter: lange Hose, Lederstiefel
      sho=new THREE.Mesh(new THREE.BoxGeometry(.22,.075,.085), ma?stiefel:M(shoeC)); body.add(th,shn,sk,sho); legs.push({th,sh:shn,sk,sho,z}); }

  // Schnecke
  const snail=new THREE.Group(); tilt.add(snail); snail.visible=false;
  const slime=M('#c8b46a');
  const foot=new THREE.Mesh(new THREE.SphereGeometry(1,14,10), slime); foot.scale.set(.9,.16,.3); foot.position.set(.05,.16,0); snail.add(foot);
  const neckS=new THREE.Mesh(new THREE.SphereGeometry(1,12,10), slime); neckS.scale.set(.2,.3,.2); neckS.position.set(.72,.38,0); snail.add(neckS);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(.48,16,12), M(S.ui)); shell.position.set(-.1,.68,0); shell.scale.set(1,1,.8); snail.add(shell);
  for(const [r,t] of [[.34,.06],[.2,.05]]){ const sp=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,24), M(lum(S.ui)>.3?'#5b3a24':'#f1f1ec'));
    for(const zz of [-.39,.39]){ const c=sp.clone(); c.position.set(-.1,.68,zz); snail.add(c); } }
  for(const z of [-.08,.08]){ const st=cyl(.025,slime); place(st,[.78,.55,z],[.88,.95,z*2.2]); snail.add(st);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.06,8,6), black); eye.position.set(.88,.97,z*2.2); snail.add(eye); }
  const sHelm=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8,0,Math.PI*2,0,Math.PI/2), M(L.helmet)); sHelm.position.set(.74,.62,0); snail.add(sHelm);

  // Rakete
  const rocket=new THREE.Group(); tilt.add(rocket); rocket.visible=false;
  const hull=M('#eef0f2'), acc=M(S.ui);
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,1.7,16), hull); tube.rotation.z=-Math.PI/2; rocket.add(tube);
  const nose=new THREE.Mesh(new THREE.ConeGeometry(.3,.6,16), acc); nose.rotation.z=-Math.PI/2; nose.position.x=1.15; rocket.add(nose);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(.305,.305,.18,16), acc); band.rotation.z=-Math.PI/2; band.position.x=.3; rocket.add(band);
  const win=new THREE.Mesh(new THREE.SphereGeometry(.11,10,8), M('#7fc8f8')); win.position.set(.45,.25,0); rocket.add(win);
  for(let i=0;i<3;i++){ const fin=new THREE.Mesh(new THREE.BoxGeometry(.5,.04,.38), acc); const a=i*Math.PI*2/3;
    fin.position.set(-.7,Math.cos(a)*.38,Math.sin(a)*.38); fin.rotation.x=a; rocket.add(fin); }
  const flame=new THREE.Mesh(new THREE.ConeGeometry(.24,1,12), new THREE.MeshBasicMaterial({color:'#ff9a2e', transparent:true, opacity:.9}));
  flame.rotation.z=Math.PI/2; flame.position.x=-1.35; rocket.add(flame);
  const flame2=new THREE.Mesh(new THREE.ConeGeometry(.13,.6,10), new THREE.MeshBasicMaterial({color:'#fff3a0'})); flame2.rotation.z=Math.PI/2; flame2.position.x=-1.15; rocket.add(flame2);

  g.scale.setScalar(S.scale);
  const tag=nameSprite(S.name,S.ui); tag.scale.set(1.9,.475,1); g.add(tag); tag.position.set(0,2.3,laneKey(key)==='becker'?.55:-.55);
  const r={key,g,tilt,body,snail,rocket,rainbow,flame,flame2,kit,legs,hip,tag,crankG:crank,form:'rider',pop:1,wS:0,spec:S};
  rigUpper(r,body.children.slice(i0,ih),body.children.slice(ih,il),[.36,1.47,0],arms); poseRider(r,0); return r;
}
/* ---------- Teufel-Bot: kleiner, süßer Teufel auf dem Rad (eigene Figur) ---------- */
function makeDevil(ma){
  const g=new THREE.Group(), tilt=new THREE.Group(), body=new THREE.Group(); g.add(tilt); tilt.add(body);
  const M=c=>new THREE.MeshLambertMaterial({color:c}), B=c=>new THREE.MeshBasicMaterial({color:c});
  const skin=M('#e23a2c'), skinD=M('#b8241c'), horn=M('#7a1712'), jers=M('#9e0f17'), black=M('#1b1b1d'), tire=M('#151515'), white=B('#ffffff');
  // --- Rad: schwarz mit roten Akzenten (Burg: Holzrad) ---
  let crank; if(ma) crank=holzRad(body,M); else {
  for(const x of [-.52,.52]){ const w=new THREE.Mesh(new THREE.TorusGeometry(.34,.03,6,24), tire); w.position.set(x,.34,0); body.add(w);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.29,.018,4,24), M('#c81e1e')); rim.position.set(x,.34,0); body.add(rim);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.1,6), M('#777')); hub.rotation.x=Math.PI/2; hub.position.set(x,.34,0); body.add(hub); }
  const F={rh:[-.52,.34,0], bb:[0,.3,0], seat:[-.16,.86,0], ht:[.42,.84,0], ht2:[.45,.74,0], fh:[.52,.34,0]};
  for(const [a,b,c] of [['rh','bb','#1b1b1d'],['bb','seat','#1b1b1d'],['seat','rh','#1b1b1d'],['seat','ht','#1b1b1d'],['ht2','bb','#1b1b1d'],['ht','fh','#c81e1e']]){ const t=cyl(.028,M(c)); place(t,F[a],F[b]); body.add(t); }
  const stem=cyl(.022,black); place(stem,[.42,.84,0],[.47,.92,0]); body.add(stem);
  const bar=cyl(.022,horn); place(bar,[.47,.92,-.2],[.47,.92,.2]); body.add(bar);
  for(const z of [-.2,.2]){ const drop=cyl(.02,horn); place(drop,[.47,.92,z],[.55,.84,z]); body.add(drop); }
  const saddle=new THREE.Mesh(new THREE.BoxGeometry(.26,.04,.09), black); saddle.position.set(-.16,.9,0); body.add(saddle);
  crank=new THREE.Group(); crank.position.set(0,.3,0); body.add(crank);
  const cr=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.02,12), M('#444')); cr.rotation.x=Math.PI/2; cr.position.z=.06; crank.add(cr); }
  // --- Körper: kleiner, runder Bauch im roten Trikot ---
  const hip=[-.13,.99,0], sh=[.16,1.3,0], i0=body.children.length, arms=[];
  const torso=new THREE.Mesh(new THREE.SphereGeometry(.2,16,12), jers); torso.position.set((hip[0]+sh[0])/2,(hip[1]+sh[1])/2,0); torso.scale.set(.85,1.25,.9); torso.rotation.z=-Math.atan2(sh[0]-hip[0],sh[1]-hip[1]); body.add(torso);
  const belly=new THREE.Mesh(new THREE.SphereGeometry(.19,16,12), jers); belly.position.set(.0,1.1,0); body.add(belly);
  const stripe=new THREE.Mesh(new THREE.TorusGeometry(.19,.018,6,24), black); stripe.position.set(.0,1.1,0); stripe.rotation.y=Math.PI/2; stripe.rotation.x=.55; body.add(stripe);
  const pants=new THREE.Mesh(new THREE.SphereGeometry(.17,12,10), black); pants.scale.set(1.15,.75,1); pants.position.set(hip[0],hip[1],0); body.add(pants);
  // Arme zum Lenker
  for(const z of [-.13,.13]){ const shp=[sh[0]-.02,sh[1]-.04,z*1.1], el=[.33,1.1,z*1.35], hand=[.5,.92,z>0?.2:-.2];
    const ua=cyl(.055,jers,.05); place(ua,shp,el); body.add(ua); const fa=cyl(.045,skin,.04); place(fa,el,hand); body.add(fa);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6), skin); hd.position.set(...hand); body.add(hd); arms.push(armOf(ua,fa,hd,hip,shp,el,hand)); }
  // --- Großer runder Kopf ---
  const ih=body.children.length, hc=[.3,1.63,0], R0=.27;
  const head=new THREE.Mesh(new THREE.SphereGeometry(R0,24,18), skin); head.position.set(...hc); head.scale.set(1,.96,1.02); body.add(head);
  const fw=(dy,dz)=>{ const v=new THREE.Vector3(Math.cos(dy)*Math.cos(dz),Math.sin(dy),Math.sin(dz)*Math.cos(dy)); return v; }; // Richtung auf der Kopfoberfläche (vorne = +x)
  const onHead=(el,az,r=R0)=>{ const v=fw(el,az).multiplyScalar(r); return [hc[0]+v.x,hc[1]+v.y,hc[2]+v.z]; };
  // große Augen: weiß, dunkle Pupille, zwei Glanzpunkte
  for(const s of [-1,1]){ const p=onHead(.12,s*.36,R0-.01), eye=new THREE.Group(); eye.position.set(...p); eye.lookAt(new THREE.Vector3(...p).add(fw(.12,s*.36))); body.add(eye);
    const wh=new THREE.Mesh(new THREE.SphereGeometry(.085,16,12), white); wh.scale.set(.82,1.12,.35); eye.add(wh);
    const pu=new THREE.Mesh(new THREE.SphereGeometry(.062,16,12), B('#22140f')); pu.scale.set(.82,1.05,.3); pu.position.z=.022; eye.add(pu);
    const gl=new THREE.Mesh(new THREE.SphereGeometry(.019,8,6), white); gl.position.set(s*-.018,.03,.04); eye.add(gl);
    const gl2=new THREE.Mesh(new THREE.SphereGeometry(.009,8,6), white); gl2.position.set(s*.016,-.024,.04); eye.add(gl2);
    const brow=new THREE.Mesh(new THREE.TorusGeometry(.055,.008,4,12,Math.PI*.7), B('#5a0d0a')); brow.position.set(...onHead(.38,s*.36,R0+.003)); brow.lookAt(new THREE.Vector3(...brow.position.toArray()).add(fw(.38,s*.36))); brow.rotateZ(Math.PI*.15); body.add(brow);
    // rosa Bäckchen
    const ck=new THREE.Mesh(new THREE.CircleGeometry(.045,16), new THREE.MeshBasicMaterial({color:'#ff7f8a',transparent:true,opacity:.75})); const cp=onHead(-.08,s*.62,R0+.004); ck.position.set(...cp); ck.lookAt(new THREE.Vector3(...cp).add(fw(-.08,s*.62))); body.add(ck); }
  // Näschen und Lächeln
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.026,10,8), skinD); nose.position.set(...onHead(-.04,0,R0+.012)); body.add(nose);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.07,.011,6,20,Math.PI*.85), B('#4a0b08')); const sp=onHead(-.2,0,R0+.002); smile.position.set(...sp); smile.lookAt(new THREE.Vector3(...sp).add(fw(-.2,0))); smile.rotateZ(Math.PI+Math.PI*.075); body.add(smile);
  // spitze Ohren
  for(const s of [-1,1]){ const e=new THREE.Mesh(new THREE.ConeGeometry(.065,.17,10), skin); e.scale.set(1,1,.45); e.position.set(hc[0]-.03,hc[1]+.05,s*(R0+.03)); e.rotation.set(s*1.05,0,.3); body.add(e);
    const ei=new THREE.Mesh(new THREE.ConeGeometry(.038,.11,8), skinD); ei.scale.set(1,1,.4); ei.position.set(hc[0]-.012,hc[1]+.05,s*(R0+.035)); ei.rotation.set(s*1.05,0,.3); body.add(ei); }
  // kleine Hörner, leicht gebogen
  for(const s of [-1,1]){ const hb=new THREE.Group(); hb.position.set(...onHead(.95,s*.55,R0-.02)); hb.rotation.set(s*-.45,0,-.25); body.add(hb);
    const h1=new THREE.Mesh(new THREE.CylinderGeometry(.032,.045,.07,10), horn); h1.position.y=.03; hb.add(h1);
    const h2=new THREE.Mesh(new THREE.ConeGeometry(.032,.09,10), horn); h2.position.set(0,.105,s*.012); h2.rotation.x=s*.35; hb.add(h2); }
  // --- Beine (für die Tretbewegung) ---
  const il=body.children.length, legs=[]; for(const z of [-.1,.1]){ const th=cyl(.07,black,.06), shn=cyl(.05,skin,.045), sk=cyl(.046,skin,.044), sho=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8), skinD); sho.scale.set(1.5,.7,1); body.add(th,shn,sk,sho); legs.push({th,sh:shn,sk,sho,z}); }
  // --- Schwanz mit Pfeilspitze (wackelt im Fahrtwind) ---
  const tail=new THREE.Group(); tail.position.set(-.32,1.0,0); body.add(tail); const segs=[]; let par=tail;
  for(let i=0;i<9;i++){ const sg=new THREE.Group(); sg.position.x=i?-.075:0; par.add(sg); const c=cyl(.024-i*.0012,skin); c.rotation.z=Math.PI/2; c.position.x=-.0375; c.scale.y=.082; sg.add(c); segs.push(sg); par=sg; }
  const tip=new THREE.Group(); tip.position.x=-.08; par.add(tip);
  const ar=new THREE.Shape(); ar.moveTo(0,0); ar.lineTo(-.06,.07); ar.lineTo(-.15,0); ar.lineTo(-.06,-.07); ar.lineTo(0,0);
  const arm=new THREE.Mesh(new THREE.ExtrudeGeometry(ar,{depth:.025,bevelEnabled:false}), skinD); arm.position.set(.03,0,-.0125); tip.add(arm);
  // --- Dreizack in der rechten Hand ---
  const tri=new THREE.Group(); tri.position.set(.5,.92,.2); tri.rotation.set(0,0,-.5); body.add(tri); const fork=M('#6e1410'), gold=M('#d9a62b');
  const shaft=cyl(.016,fork); place(shaft,[0,-.35,0],[0,.95,0]); tri.add(shaft);
  const cross=cyl(.016,fork); place(cross,[0,.95,-.11],[0,.95,.11]); tri.add(cross);
  for(const z of [-.11,0,.11]){ const p=cyl(.014,fork); place(p,[0,.95,z],[0,z?1.13:1.17,z]); tri.add(p); const pt=new THREE.Mesh(new THREE.ConeGeometry(.035,.08,4), fork); pt.position.set(0,(z?1.13:1.17)+.04,z); tri.add(pt); }
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.024,.008,6,12), gold); ring.rotation.x=Math.PI/2; ring.position.y=.9; tri.add(ring);
  g.scale.setScalar(.92);
  const tag=nameSprite('Teufel','#c81e1e'); tag.scale.set(1.9,.475,1); g.add(tag); tag.position.set(0,2.3,0);
  const none=new THREE.Group(); none.visible=false; tilt.add(none);
  const r={key:'devil',g,tilt,body,snail:none,rocket:none,rainbow:none,flame:none,flame2:none,kit:[],legs,hip,tag,crankG:crank,form:'rider',pop:1,wS:0,spec:{name:'Teufel',ui:'#c81e1e',dot:'#c81e1e'},tail:segs,tailTip:tip};
  rigUpper(r,body.children.slice(i0,ih),body.children.slice(ih,il),[.2,1.4,0],arms); poseRider(r,0); return r;
}
function animTail(r,t){ r.tail.forEach((s,i)=>{ s.rotation.z=(i<2?.2:-.3)+Math.sin(t*7-i*.7)*.09*(i/8+.3); s.rotation.y=Math.sin(t*5.3-i*.6)*.12*(i/8+.2); }); }
/* Verwandlung je nach W/kg – mit etwas Puffer, damit nichts flackert */
const FORM_TXT={snail:'🐌 Schneckenmodus – unter 2 W/kg', rider:'Normaler Fahrer', wm:'🌈 Weltmeister-Modus – über 4 W/kg!', rocket:'🚀 RAKETE – über 7 W/kg!!'};
function nextForm(f,w){
  if(!race.forms) return 'rider';
  if(w>7 || (f==='rocket'&&w>6.8)) return 'rocket';
  if(w>4 || (f==='wm'&&w>3.85)) return 'wm';
  if(w<2 || (f==='snail'&&w<2.15)) return 'snail';
  return 'rider';
}
const WHITE=new THREE.Color('#f7f7f2');
function updateForm(r,w,dt,isMe,frozen){
  r.wS += (w-r.wS)*Math.min(1,dt/1.5);
  const f = r.key==='devil' ? 'rider' : frozen ? r.form : nextForm(r.form, r.wS); // der Teufel verwandelt sich nie
  if(f!==r.form){ r.form=f; r.pop=0; if(isMe && race.state==='run' && !race.frozen) flash(FORM_TXT[f]); }
  r.body.visible = f==='rider'||f==='wm'; r.snail.visible = f==='snail'; r.rocket.visible = f==='rocket';
  r.rainbow.visible = f==='wm';
  r.kit.forEach(k=>{ const wm=f==='wm'; k.m.color.copy(wm?WHITE:k.c); if((wm?null:k.map)!==k.m.map){ k.m.map=wm?null:k.map; k.m.needsUpdate=true; } });
  r.pop=Math.min(1,r.pop+dt*3); const p=r.pop<1? 1+Math.sin(r.pop*Math.PI)*.45 : 1; r.tilt.scale.setScalar(p);
  if(f==='rocket'){ const t=performance.now()/1000; r.rocket.position.y=1.0+Math.sin(t*3)*.12; r.flame.scale.set(1,.8+Math.random()*.5,1); r.flame2.scale.set(1,.8+Math.random()*.4,1); }
}
/* Oberkörper (Drehpunkt Hüfte) und Kopf (Drehpunkt Hals) als eigene Gruppen – für Wiegetritt und Aero-Haltung; die Arme greifen per IK zum Lenker */
const armOf=(ua,fa,hd,hip,shp,el,hand)=>({ua,fa,hd,s:[shp[0]-hip[0],shp[1]-hip[1],shp[2]],h:hand,ez:el[2],l1:Math.hypot(el[0]-shp[0],el[1]-shp[1]),l2:Math.hypot(hand[0]-el[0],hand[1]-el[1])});
function rigUpper(r,ms,heads,neck,arms){ const H=new THREE.Vector3(...r.hip), N=new THREE.Vector3(...neck), up=new THREE.Group(), hg=new THREE.Group(), skip=new Set(arms.flatMap(A=>[A.ua,A.fa,A.hd]));
  up.position.copy(H); r.body.add(up); hg.position.copy(N).sub(H); up.add(hg);
  for(const m of ms) if(!skip.has(m)){ m.position.sub(H); up.add(m); } for(const m of heads){ m.position.sub(N); hg.add(m); } Object.assign(r,{up,headG:hg,arms,neckL:[N.x-H.x,N.y-H.y]}); }
function poseArms(r,ae){ const U=r.up, c=Math.cos(U.rotation.z), s=Math.sin(U.rotation.z), cr=Math.cos(U.rotation.x), sr=Math.sin(U.rotation.x);
  for(const A of r.arms){ const py=A.s[0]*s+A.s[1]*c, sx=U.position.x+A.s[0]*c-A.s[1]*s, sy=U.position.y+py*cr-A.s[2]*sr, sz=U.position.z+py*sr+A.s[2]*cr, hx=A.h[0]+.04*ae, hy=A.h[1]-.07*ae; // Aero: Hände unten am Lenker
    const dx=hx-sx, dy=hy-sy, D0=Math.hypot(dx,dy), D=Math.min(A.l1+A.l2-.002,D0), ux=dx/D0, uy=dy/D0, a=(A.l1*A.l1-A.l2*A.l2+D*D)/(2*D), b=Math.sqrt(Math.max(0,A.l1*A.l1-a*a));
    const E=[sx+ux*a+uy*b, sy+uy*a-ux*b, A.ez*(1+b*1.5)*(1-.35*ae)+(sz-A.s[2])*.5], Hd=[sx+ux*D, sy+uy*D, A.h[2]]; // Ellbogen knickt nach unten hinten und außen
    place(A.ua,[sx,sy,sz],E); place(A.fa,E,Hd); A.hd.position.set(...Hd); } }
function poseRider(r,crank){
  const st=r.st||0, ae=r.ae||0, hx=r.hip[0]+.18*st-.04*ae, hy=r.hip[1]+.12*st, l=.44+.06*st; // Wiegetritt: Hüfte deutlich vor und über den Sattel, Beine gestreckt · Aero: Rücken fast waagerecht, Hüfte etwas zurück
  // Wiegetritt: Rad und Beine pendeln unter dem ruhigen Oberkörper, ±7° (ab 90 U/min weniger, bis ±4°); der Oberkörper wird genau gegen das Pendeln verschoben und neigt sich kaum dagegen
  const cad=r.rs?r.rs.cad:0, th=Math.sin(crank)*(r.sw||0)*clampN(.12-Math.max(0,cad-90)*.0025,.07,.12), zc=-hy*Math.tan(th);
  r.body.rotation.x=th; r.up.position.set(hx,hy,zc); r.up.rotation.set(-th*1.2,0,-.2*st-.6*ae); poseArms(r,ae);
  r.headG.rotation.z=-.05*st+.45*ae; r.headG.position.set(r.neckL[0]-.03*ae,r.neckL[1]-.05*ae,0); // Aero: Kopf tief zwischen den Schultern, Blick nach vorn
  r.crankG.rotation.z=-crank;
  r.legs.forEach((L,i)=>{ const pa=-crank+(i?Math.PI:0), px=Math.cos(pa)*.17, py=.3+Math.sin(pa)*.17;
    const dx=px-hx, dy=py-hy, D=Math.min(2*l-.02,Math.hypot(dx,dy)), hh=Math.sqrt(Math.max(0,l*l-D*D/4));
    const mx=hx+dx/2, my=hy+dy/2, ux=dx/Math.hypot(dx,dy), uy=dy/Math.hypot(dx,dy), kx=mx-uy*hh, ky=my+ux*hh, kz=L.z*(1-.3*ae)+zc*.5; // Aero: Knie eng am Rahmen
    place(L.th,[hx,hy,L.z+zc],[kx,ky,kz]); place(L.sh,[kx,ky,kz],[px,py,L.z]);
    place(L.sk,[kx+(px-kx)*.5,ky+(py-ky)*.5,(kz+L.z)/2],[px,py+.02,L.z]); L.sho.position.set(px+.03,py-.02,L.z*1.25); });
  if(r.tail) animTail(r,performance.now()/1000);
}
const ownLane=k=>{ const q=laneKey(k); return R.stadium?(q==='becker'?1.3:2.7):RIDERS[q].side; };
function putRider(r,d,crank){
  const hd=headingAt(R,d), u=r.lane, rk=r.form==='rocket'?0.12:0;
  if(R.stadium){ const p=trackPt(d,u); r.g.position.set(p[0],p[1]+0.03,p[2]); r.g.rotation.set(0,-hd,0); r.tilt.rotation.set(-R.outSign*bankAt(d),0,rk); }
  else if(KX.on){ const [x,z]=posAt(R,d), px=x-Math.sin(hd)*u, pz=z+Math.cos(hd)*u; r.g.position.set(px, roadY(d)+visOff(px,pz)+0.12, pz); r.g.rotation.set(0,-hd,0); r.tilt.rotation.set(r.lean||0,0,Math.atan((visRoadY(d+1.5)-visRoadY(d-1.5))/3)+rk); }
  else { const [x,z]=posAt(R,d); r.g.position.set(x-Math.sin(hd)*u, roadY(d)+0.12, z+Math.cos(hd)*u); r.g.rotation.set(0,-hd,0); r.tilt.rotation.set(r.lean||0,0,Math.atan((R.island?0:R.space&&d>=0&&d<=R.len?segOf(d).vg:gradeAt(d))/100)+rk); } r.tag.position.y = r.form==='rocket'?2.5:r.form==='snail'?1.6:2.3; poseRider(r,crank);
}
function smoothHeading(d){ let sx=0,sz=0; for(let k=-4;k<=4;k++){ const h=headingAt(R,d+k*3); sx+=Math.cos(h); sz+=Math.sin(h); } return Math.atan2(sz,sx); }
// Krümmung (rad/m, positiv = Kurve zur Spur +u) · Kurvenlage atan(v²·κ/g), höchstens 40°
const curv=d=>{ const a=smoothHeading(d+6), b=smoothHeading(d-6); return Math.atan2(Math.sin(a-b),Math.cos(a-b))/12; };
function leanStep(r,d,v,dt){ const t=R.stadium||camOverride?0:clampN(Math.atan(v*v*curv(d)/G),-.7,.7); r.lean=r.lean==null||dt>.09?t:r.lean+(t-r.lean)*Math.min(1,dt*4); }
/* Fahrweise der Figur: Trittfrequenz, Wiegetritt (Anstieg und Sprint) und Aero-Haltung (Abfahrt, kommt aus der Physik: o.aero) */
function rideState(r,o,P,ftpW,dt,cadReal,standRemote){ if(!r) return; const S=r.rs||(r.rs={st:0,ae:0,cad:0,up:false,t:0,sp:false,spT:0,lock:false,stand:false}), g=R.stadium?0:gradeAt(o.d), v=o.v;
  // Sprint: ab 1,6 × FTP aus dem Sattel, unter 1,2 × FTP (frühestens nach 2 s) oder spätestens nach 20 s wieder sitzen
  if(S.sp){ S.spT+=dt; if((P<1.2*ftpW&&S.spT>2)||S.spT>20){ S.sp=false; S.lock=S.spT>20; } } else if(P>1.6*ftpW&&!S.lock){ S.sp=true; S.spT=0; }
  if(S.lock&&P<1.2*ftpW) S.lock=false; // nach 20 s erst wieder nach einer Pause aufstehen
  // Anstieg: ab 10 % im Wechsel (etwa 8 s stehen, 25 s sitzen), ab 14 % oder unter 12 km/h fast immer
  const steep=g>=14||v<3.3; S.t-=dt; if(S.t<=0){ S.up=!S.up; S.t=S.up?(steep?30+Math.random()*10:6+Math.random()*4):(steep?4+Math.random()*3:20+Math.random()*10); }
  S.stand=!o.aero&&P>=15&&(standRemote!=null?!!standRemote:S.sp||(g>=10&&S.up));
  S.st+=((S.stand?1:0)-S.st)*Math.min(1,dt*4); S.ae+=((o.aero?1:0)-S.ae)*Math.min(1,dt*2.5); S.sw=(S.sw||0)+((S.stand?1:0)-(S.sw||0))*Math.min(1,dt*1.2); r.st=S.st; r.ae=S.ae; r.sw=S.sw; // Pendeln setzt langsam ein und klingt langsam ab
  // Trittfrequenz: echte vom Sensor, sonst geschätzt; unter 15 W stehen die Kurbeln, die Pedale bleiben waagerecht stehen
  const est=P<15||v<.3?0:S.sp?105:S.stand?66:clampN(88-Math.max(0,g-3)*2.5,70,90);
  S.cad+=((cadReal??est)-S.cad)*Math.min(1,dt*2);
  if(S.cad>8) o.crank+=S.cad/60*2*Math.PI*dt; else { const h=Math.round(o.crank/Math.PI)*Math.PI; o.crank+=(h-o.crank)*Math.min(1,dt*3); } }

/* ---------- Lobby: Vorschau der beiden Avatare ---------- */
const prev=(()=>{ const c=document.createElement('canvas'); c.width=400; c.height=380;
  const rr=new THREE.WebGLRenderer({canvas:c, antialias:true, alpha:true}); rr.setPixelRatio(1); rr.setSize(400,380,false);
  const sc=new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff,0x556655,.9)); const l=new THREE.DirectionalLight(0xffffff,.7); l.position.set(2,3,2); sc.add(l);
  const cam=new THREE.PerspectiveCamera(32,400/380,.1,50);
  const ground=new THREE.Mesh(new THREE.CircleGeometry(1.4,32), new THREE.MeshLambertMaterial({color:'#5a5d60'})); ground.rotation.x=-Math.PI/2; sc.add(ground);
  const rs={}; RKEYS.forEach(k=>{ rs[k]=makeRider(k); rs[k].tag.visible=false; sc.add(rs[k].g); });
  return {c,rr,sc,cam,rs,crank:0}; })();
function drawPreviews(dt){
  prev.crank+=dt*5; const t=performance.now()/1000;
  document.querySelectorAll('.rcard').forEach(card=>{ const k=card.dataset.k, cv2=card.querySelector('canvas');
    for(const kk in prev.rs) prev.rs[kk].g.visible = kk===k;
    const r=prev.rs[k]; poseRider(r,prev.crank); r.g.position.set(0,0,0); r.g.rotation.y=-0.65+Math.sin(t*.5)*.35;
    prev.cam.position.set(1.7,1.35,2.75); prev.cam.lookAt(0,1.0,0); prev.rr.render(prev.sc,prev.cam);
    if(ED.r) ED.r.g.visible=false;
    const g2=cv2.getContext('2d'); g2.clearRect(0,0,cv2.width,cv2.height); g2.drawImage(prev.c,0,0,cv2.width,cv2.height); });
  if(ED.r){ for(const kk in prev.rs) prev.rs[kk].g.visible=false; const r=ED.r; r.g.visible=true; poseRider(r,prev.crank); r.g.rotation.y=-0.65+Math.sin(t*.5)*.35; // Editor-Vorschau
    prev.cam.position.set(1.7,1.35,2.75); prev.cam.lookAt(0,1.0,0); prev.rr.render(prev.sc,prev.cam); const c2=$('edCv'), g3=c2.getContext('2d'); g3.clearRect(0,0,c2.width,c2.height); g3.drawImage(prev.c,0,0,c2.width,c2.height); r.g.visible=false; }
}

