/* ================= Unterwegs auf der Berwartstein-Strecke: Pferdekarren mit Mehlsäcken, Fußgänger am Wegrand, Betrunkener vor dem Wald =================
   buildUnterwegs(K) aus buildBurg (K = dessen Baukasten) · poseUnterwegs aus poseBurg · unterwegsKamera aus burgKamera · burgSpur aus rennen.js (Fahrer überholen den Karren links) */
const KARREN={d0:1040, d1:1760, v:2.4, los:100}; // wartet hinter der Holzbrücke, fährt los, sobald ein Fahrer 100 m davor ist, zieht mit 2,4 m/s (knapp 9 km/h) Richtung Burg, hält vor den Wegelagerern
const BETR={d:1285, T:5, blase:6.5}; // Betrunkener 35 m vor dem Waldrand · Rückblick der Kamera (s) · Sprechblase (s)
const SPRUECHE=['Wanst und Waden, nix im Schädel! Elender Tunichtgut!','Komm her, du Feigling … hick … ich hau dich vom Holzgaul!','Hick … du hast mein Bier verkippt, du beräderter Schweinehund!'];
// Fußgänger [von m, bis m, Seite, Art, Richtung]: gehen am Wegrand, am Ende ihres Stücks kehren sie um
const GEHER=[[400,600,-1,'magd',1],[620,800,1,'bauer',-1],[1080,1240,-1,'haendler',1],[1430,1640,1,'moench',-1],[2030,2230,-1,'kind',1],[2600,2800,1,'magd',-1],[3480,3680,-1,'bauer',1],[3980,4180,1,'haendler',-1],[4360,4540,-1,'moench',1]];
const echteFahrer=()=>opp.active&&!opp.bot?[{o:me,k:myKey,id:'me'},{o:opp,k:oppKey,id:'opp'}]:[{o:me,k:myKey,id:'me'}]; // nur Menschen, keine Bots
const wegPos=(d,u)=>{ const [x,z]=posAt(R,d), h=headingAt(R,d); return {x:x-Math.sin(h)*u, z:z+Math.cos(h)*u, h}; }; // u: Meter neben der Straßenmitte (positiv = rechts)

// ---- Aufbau (aus buildBurg) ----
function buildUnterwegs(K){ const {mensch,HUT,box,M,holz,holzD,bretter,A}=K, U=A.unterwegs={geher:[]}, q=rng(808), O0={x:0,y:0,z:0};
  const fell=M('#6e4a2c'), mahne=M('#2e2018'), dk=M('#4e3423'), korbM=M('#a8844a');
  // Pferd (lokal +x nach vorn): Beine pendeln in Schulter und Hüfte, Hals nickt
  const pferd=P=>{ const pf=new THREE.Group(); P.add(pf); const rumpf=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),fell); rumpf.scale.set(1.05,.42,.36); rumpf.position.y=1.32; pf.add(rumpf);
    const beine=[[.72,.17],[.72,-.17],[-.72,.17],[-.72,-.17]].map(([x,z])=>{ const b=new THREE.Group(); b.position.set(x,1.2,z); pf.add(b); const l=cyl(.075,fell,.06); place(l,[0,0,0],[0,-1.12,0]); b.add(l); box(b,.13,.09,.13,M('#222'),0,-1.15,0); return b; });
    const hals=new THREE.Group(); hals.position.set(.85,1.45,0); pf.add(hals); const hs=cyl(.17,fell,.13); place(hs,[0,0,0],[.45,.6,0]); hals.add(hs); const mh=box(hals,.08,.75,.05,mahne,.17,.35,0); mh.rotation.z=.65;
    const kp=box(hals,.62,.24,.22,fell,.67,.45,0); kp.rotation.z=-.95; box(hals,.18,.16,.2,M('#5a3a24'),.87,.13,0);
    for(const zz of [-.07,.07]){ const o=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,5),fell); o.position.set(.45,.75,zz); hals.add(o); }
    const sw=cyl(.06,mahne,.03); place(sw,[-1.05,1.45,0],[-1.25,.75,0]); pf.add(sw);
    const kum=new THREE.Mesh(new THREE.TorusGeometry(.2,.06,6,12),dk); kum.position.set(.95,1.55,0); kum.rotation.y=Math.PI/2; kum.rotation.x=.6; pf.add(kum); // Kummet
    return {pf,beine,hals}; };

  // ---------- Pferdekarren mit Mehlsäcken: Kutscher auf dem Bock, zieht am rechten Rand Richtung Burg ----------
  { const W=new THREE.Group(); world.add(W); const p=pferd(W); p.pf.position.x=2.3;
    box(W,2.9,.12,1.5,bretter,-.2,.95,0); for(const zz of [-.72,.72]) box(W,2.9,.35,.06,bretter,-.2,1.17,zz); box(W,.06,.35,1.5,bretter,-1.62,1.17,0);
    const raeder=[-.84,.84].map(zz=>{ const rad=new THREE.Group(); rad.position.set(-.3,.55,zz); W.add(rad); rad.add(new THREE.Mesh(new THREE.TorusGeometry(.52,.05,5,18),dk));
      for(let i=0;i<8;i++){ const a=i/8*Math.PI*2, sp=box(rad,.04,.5,.04,holz,Math.cos(a)*.25,Math.sin(a)*.25,0); sp.rotation.z=a-Math.PI/2; } return rad; });
    for(const zz of [-.55,.55]){ const d2=cyl(.04,holz); place(d2,[1.1,1,zz],[2.95,1.3,zz*.65]); W.add(d2); } // Deichselarme
    box(W,.35,.1,1.3,holzD,.95,1.38,0); box(W,.08,.45,1.3,holzD,.78,1.6,0); // Kutschbock mit Lehne
    // Mehlsäcke: unten sechs, oben zwei, oben zugebunden
    const sackM=M('#e6dcc4'), band=M('#8a6a44');
    for(const [x,y,z,r] of [[-1.25,1.22,-.36,.1],[-1.25,1.22,.36,-.1],[-.6,1.22,-.36,.2],[-.6,1.22,.36,0],[.05,1.22,-.36,-.15],[.05,1.22,.36,.1],[-.95,1.6,0,.3],[-.25,1.6,0,-.2]]){
      const s=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),sackM); s.scale.set(.33,.21,.3); s.position.set(x,y,z); s.rotation.y=r; W.add(s);
      const zb=new THREE.Mesh(new THREE.CylinderGeometry(.05,.08,.12,6),sackM); zb.rotation.z=Math.PI/2; zb.position.set(x+.36,y+.03,z); W.add(zb); const bd=new THREE.Mesh(new THREE.TorusGeometry(.05,.015,4,8),band); bd.rotation.y=Math.PI/2; bd.position.set(x+.38,y+.03,z); W.add(bd); }
    const ku=mensch(O0,{x:1,z:0},'#6b5a3a','#3a3020',HUT.stroh); W.add(ku.G); ku.G.position.set(.95,.67,0); ku.G.rotation.y=Math.PI/2; // sitzt auf dem Bock und blickt nach vorn
    for(const b of ku.beine) b.rotation.x=-1.45; for(const a of ku.arme) a.rotation.x=-.9;
    for(const zz of [-.14,.14]){ const z2=cyl(.012,M('#3a2a1c')); place(z2,[1.55,1.4,zz],[3.75,1.95,zz*.6]); W.add(z2); } // Zügel
    U.karren={W,p,raeder,ku,d:KARREN.d0,fahrt:false,ph:0,amp:0}; }

  // ---------- Fußgänger: Magd mit Korb, Bauer mit Sense, Händler mit Kiepe, Mönch, Kind mit Gans ----------
  for(const [a,b,s,art,dir] of GEHER){ const bl={x:0,z:1};
    const m=art==='moench'?mensch(O0,bl,'#5a4128','#3a2a1c',HUT.kapuze,{lang:1,guertel:'#e8e0cc'}):art==='magd'?mensch(O0,bl,['#3f6b4a','#8a3b2e'][a%2],'#3a2a1c',HUT.tuch,{lang:1})
      :art==='haendler'?mensch(O0,bl,'#6b5a8a','#3a3020',k=>{ const r=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.02,12),M('#3a2e24')); r.position.y=.17; k.add(r); const c=new THREE.Mesh(new THREE.ConeGeometry(.14,.24,10),M('#3a2e24')); c.position.y=.29; k.add(c); })
      :art==='kind'?mensch(O0,bl,'#8a3b2e','#4a3a2a',k=>{ const h=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8,0,Math.PI*2,0,Math.PI*.55),M('#7a4a22')); h.position.set(0,.11,-.01); k.add(h); }) // Kind: Haarschopf
      :mensch(O0,bl,'#8a6a44','#5b4a36',HUT.stroh);
    const G={m,a,b,s,dir,d:a+(b-a)*q(),v:1.1+q()*.35,ph:q()*6,schwing:[true,true],schau:a%3!==2};
    if(art==='magd'){ const k=new THREE.Mesh(new THREE.CylinderGeometry(.16,.12,.2,10,1,true),new THREE.MeshLambertMaterial({color:'#a8844a',side:THREE.DoubleSide})); k.position.set(0,-.66,.14); m.arme[0].add(k);
      for(const [x,z,c] of [[-.05,.1,'#c94a2a'],[.05,.17,'#e0b33c'],[0,.12,'#7a9a3a']]){ const o=new THREE.Mesh(new THREE.SphereGeometry(.055,6,5),M(c)); o.position.set(x,-.58,z); m.arme[0].add(o); }
      m.arme[0].rotation.x=-.45; G.schwing[0]=false; } // Korb mit Äpfeln und Rüben am angewinkelten Arm
    if(art==='bauer'){ const st=cyl(.025,holz); place(st,[.24,.95,.22],[.3,2.15,-.55]); m.G.add(st); const kl=box(m.G,.03,.07,.85,M('#b8bcc0'),.3,2.1,-.15); kl.rotation.x=.45; // Sense über der Schulter, Blatt nach vorn
      m.arme[1].rotation.x=-.75; G.schwing[1]=false; }
    if(art==='haendler'){ const ki=new THREE.Mesh(new THREE.CylinderGeometry(.24,.17,.7,10),korbM); ki.position.set(0,1.25,-.3); m.G.add(ki); // Kiepe auf dem Rücken, oben Tuchballen und Töpfe
      for(const [x,c] of [[-.08,'#b03a2e'],[.1,'#2f5a8a']]){ const t=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.3,8),M(c)); t.rotation.z=Math.PI/2; t.position.set(x,1.65,-.3); m.G.add(t); }
      const tp=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),M('#9a5a2a')); tp.position.set(0,1.7,-.18); m.G.add(tp); }
    if(art==='moench'){ for(const r of m.arme){ r.rotation.x=-.7; r.rotation.z*=-2.5; } G.schwing=[false,false]; } // Hände gefaltet vor dem Bauch
    if(art==='kind'){ m.G.scale.setScalar(.62); const T=new THREE.Group(); world.add(T); const w=M('#f2efe6'), o=M('#e88a2a'); // Gans läuft vorneweg
      const k1=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),w); k1.scale.set(.9,.85,1.4); k1.position.y=.26; T.add(k1); const h=cyl(.045,w); place(h,[0,.3,.2],[0,.6,.28]); T.add(h);
      const kopf=new THREE.Group(); kopf.position.set(0,.62,.29); T.add(kopf); kopf.add(new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),w)); box(kopf,.04,.035,.12,o,0,-.01,.09); for(const x of [-.06,.06]) box(T,.02,.14,.02,o,x,.07,0);
      G.gans={T,kopf}; }
    U.geher.push(G); }

  // ---------- Betrunkener vor dem Wald: dicker Bauch, rote Nase, verrutschte Zipfelmütze, Hemd halb aus der Hose, Bierkrug ----------
  { const O=new THREE.Group(); world.add(O); const hemd='#d8cfb8';
    const m=mensch(O0,{x:0,z:1},hemd,'#4a3a2a',k=>{ const mz=new THREE.Mesh(new THREE.ConeGeometry(.14,.42,10),M('#7a1f1f')); mz.position.set(.08,.24,0); mz.rotation.z=-.6; k.add(mz);
      const n=new THREE.Mesh(new THREE.SphereGeometry(.038,6,5),M('#d8443a')); n.position.set(0,.09,.12); k.add(n); for(const x of [-.06,.06]){ const b=new THREE.Mesh(new THREE.SphereGeometry(.03,5,4),M('#e07a6a')); b.position.set(x,.07,.1); k.add(b); } }); O.add(m.G); // rote Nase und Backen
    const bauch=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),M(hemd)); bauch.scale.set(1.05,1,1.1); bauch.position.set(0,.9,.08); m.G.add(bauch);
    const zipf=box(m.G,.17,.2,.03,M('#e8e0cc'),.13,.68,.27); zipf.rotation.set(.25,0,.25); // Hemdzipfel hängt über den Gürtel
    const krug=new THREE.Group(); m.arme[1].add(krug); const kc=new THREE.Mesh(new THREE.CylinderGeometry(.065,.075,.18,10),M('#8a6a44')); krug.add(kc);
    const sch=new THREE.Mesh(new THREE.CylinderGeometry(.068,.068,.035,10),M('#f4f0e4')); sch.position.y=.1; krug.add(sch); const hk=new THREE.Mesh(new THREE.TorusGeometry(.05,.013,4,8),M('#6b4a32')); hk.position.x=.08; krug.add(hk);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:null,transparent:true,depthWrite:false})); sp.visible=false; world.add(sp);
    U.betr={O,m,krug,sp,tex:SPRUECHE.map(blaseTex),u:0,ry:0,hit:null,kamT:null,blT:0,last:{}}; krugInHand(U.betr); }
}
function krugInHand(B){ B.m.arme[1].add(B.krug); B.krug.position.set(0,-.66,.06); B.krug.rotation.set(0,0,0); B.krug.children[1].visible=true; }

// ---- Bewegung (aus poseBurg) ----
function poseUnterwegs(t,dt,cp){ const U=anim.burg.unterwegs; if(!U) return; const lauf=race.state==='run'&&!race.paused&&!race.frozen?dt*simSpeed():0; // Rennzeit: steht in der Pause, schneller im Testmodus
  // Pferdekarren: wartet bis ein Fahrer naht, dann im Schritt Richtung Burg; Räder drehen, Pferd geht, Kutscher wiegt sich
  { const K=U.karren, vorne=Math.max(me.d,opp.active?opp.d:-1e9);
    if(vorne<KARREN.d0-200){ K.d=KARREN.d0; K.fahrt=false; } else if(!K.fahrt&&vorne>KARREN.d0-KARREN.los) K.fahrt=true;
    const v=K.fahrt&&K.d<KARREN.d1?KARREN.v:0, s=v*lauf; K.d+=s; K.amp+=((v>0&&lauf>0?1:0)-K.amp)*Math.min(1,dt*3); K.ph+=s*2.4;
    const u=roadW(R,K.d)/2-.25, P=wegPos(K.d,u); K.W.position.set(P.x,roadY(K.d)+.02,P.z); K.W.rotation.set(0,-P.h,Math.atan(gradeAt(K.d)/100));
    for(const r of K.raeder) r.rotation.z-=s/.55; const a=K.amp, sn=Math.sin(K.ph);
    K.p.beine.forEach((b,i)=>b.rotation.z=.38*a*(i===0||i===3?sn:-sn)); K.p.hals.rotation.z=.06*a*Math.sin(K.ph*2)+.02*Math.sin(t*1.1); K.p.pf.position.y=.04*a*Math.abs(Math.sin(K.ph));
    K.ku.G.rotation.z=.05*a*Math.sin(K.ph*2+.6); K.ku.kopf.rotation.y=.25*Math.sin(t*.4); }
  // Fußgänger: hin und her am Wegrand, Beine und Arme schwingen; manche drehen den Kopf zu dir
  for(const G of U.geher){ G.d+=G.dir*G.v*dt; if(G.d>G.b){ G.d=G.b; G.dir=-1; } if(G.d<G.a){ G.d=G.a; G.dir=1; } G.ph+=dt*G.v*4.8;
    const P=wegPos(G.d,G.s*(roadW(R,G.d)/2+.9)), y=terrainAt(P.x,P.z), ry=Math.atan2(Math.cos(P.h)*G.dir,Math.sin(P.h)*G.dir), sn=Math.sin(G.ph), m=G.m;
    m.G.position.set(P.x,y+.03*Math.abs(Math.cos(G.ph)),P.z); m.G.rotation.y=ry; m.beine[0].rotation.x=.45*sn; m.beine[1].rotation.x=-.45*sn;
    if(G.schwing[0]) m.arme[0].rotation.x=-.35*sn; if(G.schwing[1]) m.arme[1].rotation.x=.35*sn;
    if(G.schau){ const e=Math.hypot(cp.x-P.x,cp.z-P.z), w=bSm((16-e)/6), dw=((Math.atan2(cp.x-P.x,cp.z-P.z)-ry+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; m.kopf.rotation.y=Math.max(-1.1,Math.min(1.1,dw))*w; }
    if(G.gans){ const Q=wegPos(G.d+G.dir*.9,G.s*(roadW(R,G.d)/2+.45)); G.gans.T.position.set(Q.x,terrainAt(Q.x,Q.z),Q.z); G.gans.T.rotation.set(0,ry,.15*Math.sin(G.ph*1.5)); G.gans.kopf.position.z=.29+.05*Math.sin(G.ph*3); } }
  poseBetr(t,dt,cp); }

// Betrunkener: torkelt über die Straße und nimmt einen Schluck; kommt der erste echte Fahrer, wankt er in dessen Spur, wird umgerempelt, landet am Rand auf dem Hosenboden und schimpft
function poseBetr(t,dt,cp){ const B=anim.burg.unterwegs.betr, D=BETR.d, w2=roadW(R,D)/2, F=echteFahrer(), m=B.m, h=headingAt(R,D);
  if(F.every(f=>f.o.d<D-150)&&B.hit){ B.hit=null; B.kamT=null; B.blT=0; krugInHand(B); m.G.position.y=0; m.G.rotation.set(0,0,0); } // neues Rennen: steht wieder
  if(!B.hit){ for(const f of F){ const l=B.last[f.id]??-1e9; if(l<D&&f.o.d>=D&&f.o.d-l<20){ // umgerempelt
      const i=Math.floor(Math.abs(race.windDir||0)*1000)%3; B.sp.material.map=B.tex[i]; B.sp.material.needsUpdate=true; B.blT=BETR.blase; // Spruch zufällig, aber online bei beiden gleich (Windrichtung kommt vom Ersteller)
      B.hit={t:0,u0:B.u,s:B.u>=((riders3d[f.k]||{}).lane||0)?1:-1}; if(f.id==='me') B.kamT=0;
      const kp=new THREE.Vector3(); B.krug.getWorldPosition(kp); for(let n=0;n<40;n++) partSpawn(parts.spray,kp.x,kp.y,kp.z,(Math.random()-.5)*3,1+Math.random()*2.2,(Math.random()-.5)*3,.8,Math.random()<.7?'#e8b84a':'#f4f0e4'); // Bier spritzt
      B.O.add(B.krug); B.krug.position.set(.5,.07,.35); B.krug.rotation.set(0,.6,Math.PI/2); B.krug.children[1].visible=false; break; } } } // Krug liegt leer daneben
  for(const f of F) B.last[f.id]=f.o.d;
  let a=0;
  if(!B.hit){ // torkeln: quer über die Straße, schwanken, ab und zu ein Schluck
    let u=(w2-.4)*Math.sin(t*.32)+.25*Math.sin(t*1.9), wl=0, L=0; a=.8*Math.sin(t*.45);
    const vor=F.filter(f=>f.o.d<D).sort((x,y)=>y.o.d-x.o.d)[0]; if(vor){ wl=bSm((24-(D-vor.o.d))/12); L=(riders3d[vor.k]||{}).lane||0; u+=(L-u)*wl; a*=1-wl; } // wankt in die Spur des Ersten
    if(opp.active&&opp.bot){ const g=opp.d-D, k=bSm((g+7)/3)*bSm((4-g)/2), bl=(riders3d[oppKey]||{}).lane||0; if(k>0) u+=(Math.max(-w2-.3,Math.min(w2+.3,bl+1.5*(u>=bl?1:-1)))-u)*k; } // Bots weicht er aus
    { const g=anim.burg.unterwegs.karren.d-D, k=bSm((g+8)/2)*bSm((5-g)/2); if(k>0) u+=(Math.min(u,w2-1.9)-u)*k; } // dem Karren geht er aus dem Weg
    const du=u-B.u; B.u+=du*Math.min(1,dt*3);
    const quer=Math.atan2(-Math.sin(h)*Math.sign(du||1),Math.cos(h)*Math.sign(du||1)), zuDir=Math.atan2(-Math.cos(h),-Math.sin(h)), zr=wl>.5?zuDir:quer, dr=((zr-B.ry+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; B.ry+=dr*Math.min(1,dt*2);
    const sl=Math.max(0,Math.sin(t*.7))**6; m.G.rotation.set(.08*Math.sin(t*1.3),0,.2*Math.sin(t*2.1)); m.kopf.rotation.set(-.35*sl,0,.2*Math.sin(t*1.7));
    m.beine[0].rotation.x=.35*Math.sin(t*4.5); m.beine[1].rotation.x=-.35*Math.sin(t*4.5); m.arme[1].rotation.x=-.5-1.9*sl; m.arme[0].rotation.x=-.2; m.arme[0].rotation.z=-.5-.3*Math.sin(t*2.1); }
  else { const H=B.hit; H.t+=dt; const k=bSm(H.t/.55), rand=H.s>0?w2+1.3:-(w2+.5); B.u=H.u0+(rand-H.u0)*bSm(H.t/.5); // fällt rücklings und sitzt dann
    m.G.position.y=-.6*k; m.G.rotation.set(-1.1*Math.sin(Math.PI*Math.min(1,H.t/.55))-.25*k,0,0); for(const b of m.beine) b.rotation.x=-1.45*k;
    const schimpf=B.blT>0||Math.hypot(cp.x-B.O.position.x,cp.z-B.O.position.z)<22; m.arme[0].rotation.x=schimpf?-2.5+.35*Math.sin(t*13):-.4; m.arme[0].rotation.z=-.2; m.arme[1].rotation.x=-.3; m.arme[1].rotation.z=.5; // schüttelt die Faust
    m.kopf.rotation.set(schimpf?-.15:.1,0,.15*Math.sin(t*1.5));
    if(H.t>.6){ const vw=Math.atan2(Math.cos(h),Math.sin(h)), dr=((vw-B.ry+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; B.ry+=dr*Math.min(1,dt*2.5); } } // dreht sich im Sitzen dem Fahrer hinterher
  const P=wegPos(D+a,B.u), y=Math.abs(B.u)<w2?roadY(D+a)+.02:terrainAt(P.x,P.z); B.O.position.set(P.x,y,P.z); B.O.rotation.y=B.ry;
  B.blT=Math.max(0,B.blT-dt); const S=B.sp; S.visible=B.blT>0; if(S.visible){ const gr=B.kamT!=null?2:1.6; S.scale.set(5.2*gr,1.6*gr,1); S.position.set(P.x,y+1.3+.8*gr+visOff(P.x,P.z),P.z); } } // Unterkante über dem Kopf des Sitzenden

// Kamera (aus burgKamera): nach dem Rempler kurzes Wackeln, dann Blick zurück auf den Betrunkenen wie bei den Wegelagerern
function unterwegsKamera(dt){ const U=anim.burg.unterwegs, B=U&&U.betr, ich=riders3d[myKey]; if(!B||B.kamT==null||!ich) return; B.kamT+=dt; const T=BETR.T; if(B.kamT>T){ B.kamT=null; return; }
  const w=bSm(B.kamT/.6)*bSm((T-B.kamT)/.7), rp=ich.g.position, bc=B.O.position, hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), sx=bc.x-rp.x, sz=bc.z-rp.z, sl=Math.hypot(sx,sz)||1;
  const pos=new THREE.Vector3(rp.x+fx*5-sx/sl*2.5, rp.y+2.4, rp.z+fz*5-sz/sl*2.5), look=new THREE.Vector3(bc.x, bc.y+.8, bc.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz);
  camera.position.lerp(pos,w); camera.lookAt(now.lerp(look,w));
  const s=.25*Math.max(0,1-B.kamT/.5); if(s>0){ camera.position.x+=(Math.random()-.5)*s; camera.position.y+=(Math.random()-.5)*s; camera.rotateZ((Math.random()-.5)*s*.3); } } // Rempler: Kamera wackelt kurz

// Spur (aus rennen.js): neben dem Karren weichen die Fahrer nach links aus
function burgSpur(d,t){ const K=anim.burg&&anim.burg.unterwegs&&anim.burg.unterwegs.karren; if(!K) return t; const g=d-K.d, w=bSm((g+16)/7)*bSm((9-g)/4); return w>0?t+(Math.min(t,.4)-t)*w:t; }
