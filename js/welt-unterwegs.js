/* ================= Unterwegs auf der Berwartstein-Strecke: Pferdekarren mit Mehlsäcken, Fußgänger am Wegrand, Betrunkener vor dem Wald =================
   prepUnterwegs aus prepBurg (Plätze freiräumen) · buildUnterwegs(K) aus buildBurg (K = dessen Baukasten) · poseUnterwegs aus poseBurg · unterwegsKamera aus burgKamera · burgSpur aus rennen.js (Fahrer überholen den Karren links) */
const KARREN={d0:1040, d1:1760, v:2.4, los:100}; // wartet hinter der Holzbrücke, fährt los, sobald ein Fahrer 100 m davor ist, zieht mit 2,4 m/s (knapp 9 km/h) Richtung Burg, hält vor den Wegelagerern
const BETR={d:1285, T:5, blase:6.5}; // Betrunkener 35 m vor dem Waldrand · Rückblick der Kamera (s) · Sprechblase (s)
const SPRUECHE=['Wanst und Waden, nix im Schädel! Elender Tunichtgut!','Komm her, du Feigling … hick … ich hau dich vom Holzgaul!','Hick … du hast mein Bier verkippt, du beräderter Schweinehund!'];
// Fußgänger [von m, bis m, Seite, Art, Richtung]: gehen am Wegrand, am Ende ihres Stücks kehren sie um
const GEHER=[[400,600,-1,'magd',1],[620,800,1,'bauer',-1],[1080,1240,-1,'haendler',1],[1360,1520,1,'moench',-1],[2030,2230,-1,'kind',1],[2600,2800,1,'magd',-1],[3480,3680,-1,'bauer',1],[3980,4180,1,'haendler',-1],[4360,4540,-1,'moench',1]];
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
    U.betr={O,m,krug,sp,tex:SPRUECHE.map(z=>blaseTex(z)),u:0,ry:0,hit:null,kamT:null,blT:0,last:{}}; krugInHand(U.betr); }
  sicher('Leute am Wegesrand',()=>buildLeute(K)); }
function krugInHand(B){ B.m.arme[1].add(B.krug); B.krug.position.set(0,-.66,.06); B.krug.rotation.set(0,0,0); B.krug.children[1].visible=true; }

// ---- Bewegung (aus poseBurg) ----
function poseUnterwegs(t,dt,cp){ const U=anim.burg.unterwegs; if(!U) return; const lauf=race.state==='run'&&!race.paused&&!race.frozen?dt*simSpeed():0; // Rennzeit: steht in der Pause, schneller im Testmodus
  // Pferdekarren: wartet bis ein Fahrer naht, dann im Schritt Richtung Burg; Räder drehen, Pferd geht, Kutscher wiegt sich
  { const K=U.karren, vorne=Math.max(me.d,opp.active?opp.d:-1e9);
    if(vorne<KARREN.d0-200){ K.d=KARREN.d0; K.fahrt=false; } else if(!K.fahrt&&vorne>KARREN.d0-KARREN.los) K.fahrt=true;
    const v=K.fahrt&&K.d<KARREN.d1?KARREN.v:0, s=v*lauf; K.d+=s; K.amp+=((v>0&&lauf>0?1:0)-K.amp)*Math.min(1,dt*3); K.ph+=s*2.4;
    const u=roadW(R,K.d)/2-.25, P=wegPos(K.d,u); K.W.position.set(P.x,bodenY(P.x,P.z),P.z); K.W.rotation.set(0,-P.h,Math.atan(gradeAt(K.d)/100));
    for(const r of K.raeder) r.rotation.z-=s/.55; const a=K.amp, sn=Math.sin(K.ph);
    K.p.beine.forEach((b,i)=>b.rotation.z=.38*a*(i===0||i===3?sn:-sn)); K.p.hals.rotation.z=.06*a*Math.sin(K.ph*2)+.02*Math.sin(t*1.1); K.p.pf.position.y=.04*a*Math.abs(Math.sin(K.ph));
    K.ku.G.rotation.z=.05*a*Math.sin(K.ph*2+.6); K.ku.kopf.rotation.y=.25*Math.sin(t*.4); }
  // Fußgänger: hin und her am Wegrand, Beine und Arme schwingen; manche drehen den Kopf zu dir
  for(const G of U.geher){ G.d+=G.dir*G.v*dt; if(G.d>G.b){ G.d=G.b; G.dir=-1; } if(G.d<G.a){ G.d=G.a; G.dir=1; } G.ph+=dt*G.v*4.8;
    const P=wegPos(G.d,G.s*(roadW(R,G.d)/2+.9)), y=bodenY(P.x,P.z), ry=Math.atan2(Math.cos(P.h)*G.dir,Math.sin(P.h)*G.dir), sn=Math.sin(G.ph), m=G.m;
    m.G.position.set(P.x,y+.03*Math.abs(Math.cos(G.ph)),P.z); m.G.rotation.y=ry; m.beine[0].rotation.x=.45*sn; m.beine[1].rotation.x=-.45*sn;
    if(G.schwing[0]) m.arme[0].rotation.x=-.35*sn; if(G.schwing[1]) m.arme[1].rotation.x=.35*sn;
    if(G.schau){ const e=Math.hypot(cp.x-P.x,cp.z-P.z), w=bSm((16-e)/6), dw=((Math.atan2(cp.x-P.x,cp.z-P.z)-ry+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; m.kopf.rotation.y=Math.max(-1.1,Math.min(1.1,dw))*w; }
    if(G.gans){ const Q=wegPos(G.d+G.dir*.9,G.s*(roadW(R,G.d)/2+.45)); G.gans.T.position.set(Q.x,bodenY(Q.x,Q.z),Q.z); G.gans.T.rotation.set(0,ry,.15*Math.sin(G.ph*1.5)); G.gans.kopf.position.z=.29+.05*Math.sin(G.ph*3); } }
  sicher('Betrunkener',()=>poseBetr(t,dt,cp)); sicher('Gänse',()=>poseGaense(t,dt,cp)); sicher('Wäscherinnen',()=>poseWasch(t,dt,cp)); sicher('Badehaus',()=>poseBad(t,dt,cp)); sicher('Minnesänger',()=>poseSaenger(t,cp)); sicher('Bettler',()=>poseBettler(t,dt,cp)); sicher('Warnende Bauern',()=>poseWarn(t,dt,cp)); }

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
  const P=wegPos(D+a,B.u), y=bodenY(P.x,P.z); B.O.position.set(P.x,y,P.z); B.O.rotation.y=B.ry;
  B.blT=Math.max(0,B.blT-dt); const S=B.sp; S.visible=B.blT>0; if(S.visible){ const gr=B.kamT!=null?2:1.6; S.scale.set(5.2*gr,1.6*gr,1); S.position.set(P.x,y+1.3+.8*gr+visOff(P.x,P.z),P.z); } } // Unterkante über dem Kopf des Sitzenden

// Kamera (aus burgKamera): Blick zurück wie bei den Wegelagerern – auf den Betrunkenen nach dem Rempler (mit kurzem Wackeln), auf den schimpfenden Bettler
function unterwegsKamera(dt){ const U=anim.burg.unterwegs; if(!U) return;
  if(U.betr&&U.betr.kamT!=null) rueckblick(dt,U.betr,BETR.T,U.betr.O.position,.8,true); else if(U.bettler&&U.bettler.kamT!=null) rueckblick(dt,U.bettler,BETTLER.T,U.bettler.m.G.position,.7,false); }
function rueckblick(dt,Z,T,bc,hy,wack){ const ich=riders3d[myKey]; if(!ich){ Z.kamT=null; return; } Z.kamT+=dt; if(Z.kamT>T){ Z.kamT=null; return; }
  const w=bSm(Z.kamT/.6)*bSm((T-Z.kamT)/.7), rp=ich.g.position, hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), sx=bc.x-rp.x, sz=bc.z-rp.z, sl=Math.hypot(sx,sz)||1;
  const pos=new THREE.Vector3(rp.x+fx*5-sx/sl*2.5, rp.y+2.4, rp.z+fz*5-sz/sl*2.5), look=new THREE.Vector3(bc.x, bc.y+hy, bc.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz);
  camera.position.lerp(pos,w); camera.lookAt(now.lerp(look,w));
  const s=wack?.25*Math.max(0,1-Z.kamT/.5):0; if(s>0){ camera.position.x+=(Math.random()-.5)*s; camera.position.y+=(Math.random()-.5)*s; camera.rotateZ((Math.random()-.5)*s*.3); } } // Rempler: Kamera wackelt kurz

// Spur (aus rennen.js): neben dem Karren weichen die Fahrer nach links aus, am Bettler etwas zur Mitte
function burgSpur(d,t){ const K=anim.burg&&anim.burg.unterwegs&&anim.burg.unterwegs.karren; if(!K) return t; const g=d-K.d, w=bSm((g+16)/7)*bSm((9-g)/4), b=d-BETTLER.d, wb=bSm((b+14)/6)*bSm((5-b)/3); if(wb>0) t+=(BETTLER.s*Math.min(BETTLER.s*t,.9)-t)*wb; return w>0?t+(Math.min(t,.4)-t)*w:t; } // und am Bettler vorbei

/* ================= Leute am Wegesrand: Gänseherde, Wäscherinnen am Bach, Badehaus mit zwei Dirnen, Minnesänger auf der Bühne, Bettler vor der Burg ================= */
const GAENSE={d:450, n:7}; // Herde quert die Wiese hinter dem Ortsende, eine Gans verfolgt dich
const WASCH={d:1025}; // Wäscherinnen am Ufer kurz hinter der Holzbrücke
const BAD={d:2450}; // Badehaus im ruhigen Waldstück, innen in der Kurve
const SAENGER={d:3550, s:1}; // Minnesänger auf einer Holzbühne rechts am Weg
const BETTLER={d:5000, s:1, T:4.5}; // Bettler rechts auf dem Pflaster vor der Zugbrücke · Rückblick der Kamera (s)
const WARN={d:1690, s:1}; // Bauer und Bäuerin kommen dir 220 m vor den Wegelagerern entgegen und warnen
const LIEDER=[['Oh Ritter mit den Hühnerwaden …','… Beine dünn wie Seidenfaden!'],['Dein Holzgaul knarrt, dein Kopf ist rot …','… vor Berwartstein bist du schon tot!']]; // eines pro Rennen, zwei Zeilen im Wechsel
// Notenschlüssel links und zwei Achtelnoten rechts auf der Sprechblase des Minnesängers
const notenDeko=g=>{ g.save(); g.strokeStyle=g.fillStyle='#3b2412'; g.lineWidth=5; g.lineCap='round'; g.beginPath(); g.moveTo(54,108); g.bezierCurveTo(40,104,42,88,58,88); g.bezierCurveTo(78,88,80,120,58,124);
  g.bezierCurveTo(30,128,26,98,46,80); g.bezierCurveTo(62,64,74,44,66,28); g.bezierCurveTo(60,16,48,30,52,50); g.lineTo(60,150); g.bezierCurveTo(62,166,40,168,42,154); g.stroke(); g.beginPath(); g.arc(45,153,5,0,7); g.fill(); // Violinschlüssel
  for(const [x,y] of [[440,112],[474,102]]){ g.beginPath(); g.ellipse(x,y,10,7,-.4,0,7); g.fill(); g.fillRect(x+7,y-52,4,52); } g.beginPath(); g.moveTo(447,60); g.lineTo(485,50); g.lineTo(485,60); g.lineTo(447,70); g.fill(); g.restore(); }; // Achtelnoten mit Balken
const meNah=(d,a,b)=>me.d>d-a&&me.d<d+b;
// ---- Vorbereitung (aus prepBurg): Plätze freiräumen ----
function prepUnterwegs(r,fr,rw,frei){ const U=r.unterw={}, pt=(d,s,u)=>{ const f=fr(d), o=rw(d)+u; return [f.px+f.nx*s*o, f.py+f.ny*s*o]; };
  { const d=BAD.d, s=Math.sign(angDiff(headingAt(r,d+20),headingAt(r,d-20)))||1; U.bad={d,s}; frei.push([...pt(d,s,8),8]); for(const da of [-5,0,5]) frei.push([...pt(d+da,s,3),3.2]);
    for(let da=-40; da<=-6; da+=4) for(const u of [2,6,10]) frei.push([...pt(d+da,s,u),3.5]); } // davor (aus Fahrtrichtung) keine Bäume, damit man das Haus früh sieht
  frei.push([...pt(SAENGER.d,SAENGER.s,3),4]); frei.push([...pt(BETTLER.d,BETTLER.s,1.2),2.5]);
  { const o=bachOff(WASCH.d), s=Math.sign(o)||1; U.wasch={d:WASCH.d,s,u:Math.abs(o)-2.8}; frei.push([...pt(WASCH.d,s,Math.abs(o)-rw(WASCH.d)-5),5]); } // u: Ufer zur Straße hin, ab Straßenmitte
  for(const s of [-1,1]) for(const da of [-8,0,8]) frei.push([...pt(GAENSE.d+da,s,4),4.5]); }

// ---- Aufbau (aus buildUnterwegs) ----
function buildLeute(K){ const {mensch,HUT,box,M,holz,holzD,bretter,dach,sand,A}=K, U=A.unterwegs, Ru=R.unterw, O0={x:0,y:0,z:0};
  const at=(d,s,u)=>{ const f=wegPos(d,s*(roadW(R,d)/2+u)); return {x:f.x, y:bodenY(f.x,f.z), z:f.z, h:f.h}; }, strasse=d=>{ const f=wegPos(d,0); return {x:f.x,z:f.z}; }; // u: Meter neben dem Straßenrand
  const grp=(p,s)=>{ const G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=Math.atan2(-Math.sin(p.h)*-s, Math.cos(p.h)*-s); world.add(G); return G; }; // lokal: +z zur Straße
  const dbl=c=>new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide});
  const blase=(txt,x,y,z,w=6.2)=>{ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex(txt),transparent:true,depthWrite:false})); sp.scale.set(w,w*.31,1); sp.position.set(x,y,z); sp.visible=false; world.add(sp); return sp; };
  const ringel=(a,b)=>{ const t=canvasTex(8,64,g=>{ for(let y=0;y<64;y+=16){ g.fillStyle=a; g.fillRect(0,y,8,8); g.fillStyle=b; g.fillRect(0,y+8,8,8); } }); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(1,3); return new THREE.MeshLambertMaterial({map:t}); };
  const strumpf=(m,mat)=>{ for(const b of m.beine) b.children[0].material=mat; };
  const augen=k=>[-.045,.045].map(x=>{ const e=new THREE.Mesh(new THREE.SphereGeometry(.018,6,5),M('#1a1a1a')); e.position.set(x,.12,.105); k.add(e); return e; });
  const zopf=c=>k=>{ const h=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8,0,Math.PI*2,0,Math.PI*.6),M(c)); h.position.set(0,.11,-.01); h.rotation.x=-.2; k.add(h);
    for(let i=0;i<6;i++){ const z=new THREE.Mesh(new THREE.SphereGeometry(.045-.004*i,6,5),M(c)); z.position.set(0,.06-.075*i,-.13-.012*i); k.add(z); } }; // Zopf den Rücken hinunter
  const sitzen=(m,h)=>{ m.G.position.y+=h-.76; // h: Hüfthöhe über dem Standpunkt
    for(const b of m.beine) b.rotation.x=-1.45; };
  const dampfT=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,.8)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
  const dampf=(x,y,z,n,c='#f2f2f0')=>Array.from({length:n},(_,i)=>{ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:dampfT,color:c,transparent:true,depthWrite:false,opacity:0})); world.add(sp); return {sp,x,y,z,ph:i/n}; });
  // Gans mit Flügeln (lokal +z nach vorn)
  const gans=()=>{ const T=new THREE.Group(); world.add(T); const w=M('#f2efe6'), o=M('#e88a2a'); const k1=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),w); k1.scale.set(.9,.85,1.4); k1.position.y=.26; T.add(k1);
    const hals=new THREE.Group(); hals.position.set(0,.3,.2); T.add(hals); const hs=cyl(.045,w); place(hs,[0,0,0],[0,.3,.08]); hals.add(hs);
    const kopf=new THREE.Group(); kopf.position.set(0,.32,.09); hals.add(kopf); kopf.add(new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),w)); box(kopf,.04,.035,.12,o,0,-.01,.09);
    const fl=[-1,1].map(s=>{ const f=new THREE.Group(); f.position.set(s*.16,.32,0); T.add(f); const b=box(f,.3,.03,.36,w,s*.15,0,-.02); b.rotation.z=s*.1; return f; });
    for(const x of [-.06,.06]) box(T,.02,.14,.02,o,x,.07,0); return {T,hals,kopf,fl}; };

  // ---------- Gänseherde mit Gänsemagd: quert langsam die Wiese, flieht vor Fahrern an den Rand, eine Gans verfolgt dich ----------
  { const q=rng(31), G=U.gaense={L:[], d:GAENSE.d, jagd:null};
    for(let i=0;i<GAENSE.n;i++){ const g=gans(); G.L.push({...g, du:(q()-.5)*3, dd:(q()-.5)*7, u:0, ph:q()*6}); }
    const mp=at(GAENSE.d-5,-1,2.5), m=mensch(mp,strasse(GAENSE.d),'#7a5a8a','#3a2a1c',zopf('#c9a04a'),{lang:1}); const st=cyl(.025,holz); place(st,[0,-.62,0],[0,.6,.35]); m.arme[1].add(st); m.arme[1].rotation.x=-.6;
    G.magd=m; }

  // ---------- Wäscherinnen am Bach: eine kniet am Waschbrett, die andere schlägt ein nasses Tuch aus; kommst du vorbei, spritzt es bis aufs Bild ----------
  { const W=Ru.wasch, rw=roadW(R,W.d)/2, pk=at(W.d+1,W.s,W.u-rw), ps=at(W.d-1.5,W.s,W.u-rw-2), bl=strasse(W.d);
    const kn=mensch(pk,{x:pk.x+(bl.x-pk.x)*-1,z:pk.z+(bl.z-pk.z)*-1},'#6b7a4a','#3a2a1c',HUT.tuch,{lang:1}); kn.G.position.y-=.42; kn.G.rotation.x=.35; for(const b of kn.beine) b.rotation.x=1.3; // kniet, Blick aufs Wasser
    const wb=box(kn.G,.45,.6,.04,holz,0,.55,.45); wb.rotation.x=-.5; // Waschbrett
    const ko=new THREE.Mesh(new THREE.CylinderGeometry(.35,.28,.35,10,1,true),dbl('#a8844a')); const kp=at(W.d+2.6,W.s,W.u-rw-.6); ko.position.set(kp.x,kp.y+.17,kp.z); world.add(ko); // Wäschekorb
    for(const [dx,dz,c] of [[0,0,'#f2ece0'],[.12,.08,'#c9d6e0'],[-.1,.1,'#e8d8b0']]){ const w=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),M(c)); w.scale.set(1,.5,1); w.position.set(kp.x+dx,kp.y+.36,kp.z+dz); world.add(w); }
    const sw=mensch(ps,bl,'#8a3b2e','#3a2a1c',HUT.tuch,{lang:1}), tu=new THREE.Mesh(new THREE.PlaneGeometry(.5,.8),dbl('#f2ece0')); tu.position.set(0,-.95,0); sw.arme[1].add(tu); // nasses Tuch in der Hand
    U.wasch={kn,sw,tu,d:W.d,s:W.s,sp:blase('Hihi – verzeiht, edler Herr!',ps.x,ps.y+2.9,ps.z),spT:0,nass:false,schlag:0}; }

  // ---------- Badehaus im Wald: Badstube mit Schild, Bader im dampfenden Zuber, zwei Dirnen am Weg heben die Röcke und flirten ----------
  { const B=Ru.bad, s=B.s, hp=at(B.d,s,8), H=grp(hp,s);
    box(H,4.2,5,3.2,sand,0,-1.2,0); box(H,4.2,2.6,3.2,bretter,0,2.6,0); const rf=new THREE.Mesh(dachGeo(4.2,3.2,5,4,1.6),[dach,bretter]); rf.position.y=3.9; H.add(rf); // Sockel bis unters Gelände
    box(H,.9,1.9,.05,holzD,-.9,2.25,1.62); box(H,.7,.6,.05,M('#2b2420'),1.1,2.9,1.62); box(H,.4,1.2,.4,sand,1.3,5.2,-.6); // Tür, Fenster, Kamin
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.5),new THREE.MeshLambertMaterial({map:frakturTex(256,80,g=>{ g.fillStyle='#e9dcbc'; g.fillRect(0,0,256,80); g.strokeStyle='#5a3a26'; g.lineWidth=6; g.strokeRect(3,3,250,74); g.fillStyle='#5a2a1a'; g.font='46px '+FRAKTUR; g.textAlign='center'; g.textBaseline='middle'; g.fillText('Badstube',128,44); })}));
    sg.position.set(-.3,3.6,1.64); H.add(sg); H.updateMatrixWorld(); const kw=H.localToWorld(new THREE.Vector3(1.3,6,-.6));
    const zp=at(B.d+4,s,4), Z=grp(zp,s); const zu=new THREE.Mesh(new THREE.CylinderGeometry(.85,.75,.85,16,1,true),dbl('#6b4a32')); zu.position.y=.42; Z.add(zu); for(const y of [.15,.7]){ const r=new THREE.Mesh(new THREE.TorusGeometry(.82,.03,4,16),M('#2e2c2a')); r.rotation.x=Math.PI/2; r.position.y=y; Z.add(r); }
    const wa=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.04,16),new THREE.MeshPhongMaterial({color:'#8fb0b4',shininess:80})); wa.position.y=.7; Z.add(wa);
    const ba=mensch(O0,{x:0,z:1},'#e8c09a','#e8c09a',k=>{ const b=new THREE.Mesh(new THREE.SphereGeometry(.06,6,5),M('#5a3a24')); b.scale.set(1.6,.6,.8); b.position.set(0,.02,.1); k.add(b); }); Z.add(ba.G); ba.G.position.y=-.55; // Bader mit Schnauzer, sitzt bis zur Brust im Wasser
    const bu=box(ba.arme[1],.08,.06,.2,M('#a8844a'),0,-.62,.08); ba.arme[1].rotation.set(-2.4,0,.6);
    const dirne=(p,ober,rock,haar,o)=>{ const m=mensch(p,strasse(B.d),ober,'#fff',zopf(haar),{aermel:o.aermel||ober}); strumpf(m,ringel(o.s1,o.s2)); const au=augen(m.kopf);
      if(o.mieder){ const md=new THREE.Mesh(new THREE.CylinderGeometry(.2,.21,.32,10),M('#1e1e20')); md.position.y=1.02; m.G.add(md); }
      if(o.schulter) for(const x of [-.17,.17]){ const sh=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),M('#e8c09a')); sh.position.set(x,1.4,0); m.G.add(sh); } // schulterfrei
      const ur=new THREE.Mesh(new THREE.CylinderGeometry(.2,.33,.44,12,1,true),dbl('#f4f0e6')); ur.position.y=.63; m.G.add(ur); // Unterrock bis knapp unters Knie
      const hi=new THREE.Mesh(new THREE.CylinderGeometry(.21,.43,.8,12,1,true,Math.PI/2,Math.PI),dbl(rock)); hi.position.y=.46; m.G.add(hi);
      const vo=new THREE.Group(); vo.position.y=.86; m.G.add(vo); const vr=new THREE.Mesh(new THREE.CylinderGeometry(.21,.43,.8,12,1,true,-Math.PI/2,Math.PI),dbl(rock)); vr.position.y=-.4; vo.add(vr); // vordere Rockhälfte hebt sich
      return {m,vo,au}; };
    const d1=dirne(at(B.d-1.4,s,1.1),'#c0302a','#b02a26','#e0c070',{s1:'#c0302a',s2:'#f2ece0',schulter:1}), d2=dirne(at(B.d+.4,s,1.3),'#f4f0e6','#d8662a','#9a4a22',{s1:'#2a2a2c',s2:'#f2ece0',mieder:1});
    U.bad={d:B.d,D:[d1,d2],ba,dampf:[...dampf(zp.x,zp.y+.9,zp.z,6),...dampf(kw.x,kw.y,kw.z,5,'#c9c4bc')],sp:blase('Na edler Ritter, warum so eilig … Nimm doch ein Bad mit uns, Hübscher!',(d1.m.G.position.x+d2.m.G.position.x)/2,hp.y+2.9,(d1.m.G.position.z+d2.m.G.position.z)/2,7),k:0}; }

  // ---------- Minnesänger auf einer 1,5 m hohen Holzbühne mit Treppe und Wimpelkette: Barett mit Feder, geringelte Beinlinge, Puffärmel, Laute; singt dir ein Spottlied ----------
  { const S=SAENGER, p=at(S.d,S.s,3), BH=1.5, H=grp(p,S.s); // Bühne 2,2 × 1,6 m, 1,5 m hoch; lokal +z zur Straße
    box(H,2.2,.12,1.6,bretter,0,BH-.06,0); for(const [x,z] of [[-1,-.7],[1,-.7],[-1,.7],[1,.7]]) box(H,.14,BH+1,.14,holzD,x,(BH-1)/2,z); // Boden, Pfosten bis ins Gelände
    box(H,2.2,BH+.6,.04,bretter,0,(BH-.6)/2,.82); for(const x of [-1.12,1.12]) box(H,.04,BH+.6,1.6,bretter,x,(BH-.6)/2,0); // Bretterverkleidung vorn und an den Seiten
    for(let i=0;i<5;i++) box(H,.8,.08,.32,holz,.55,BH-.3*(i+1),-.95-.3*i); // Treppe hinten
    for(const x of [.15,.95]){ const g=cyl(.025,holzD); place(g,[x,BH+.9,-.8],[x,.9,-2.3]); H.add(g); for(const [z,y] of [[-.8,BH],[-2.3,0]]) box(H,.05,.9,.05,holzD,x,y+.45,z); } // Geländer
    for(const x of [-1,1]) box(H,.08,2,.08,holzD,x,BH+1,-.7); // Pfosten für die Wimpelkette
    const F=['#c62f24','#e2b33a','#1f4e8c','#2f6b3a']; let v=null; for(let i=0;i<=10;i++){ const x=-1+i*.2, y=BH+1.95-.35*Math.sin(Math.PI*i/10), pt=[x,y,-.7]; if(v){ const sl=cyl(.01,M('#3a2a1c')); place(sl,v,pt); H.add(sl); }
      if(i<10){ const w=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,3),dbl(F[i%4])); w.rotation.x=Math.PI; w.position.set(x+.1,y-.14,-.7); H.add(w); } v=pt; } // Wimpelkette hängt durch
    const m=mensch(O0,{x:0,z:1},'#2a2a30','#c0302a',k=>{ const b=new THREE.Mesh(new THREE.CylinderGeometry(.24,.22,.07,14),M('#8a1f2a')); b.position.set(.03,.21,-.02); b.rotation.z=-.15; k.add(b);
      const bk=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8,0,Math.PI*2,0,Math.PI/2),M('#8a1f2a')); bk.position.set(.03,.22,-.02); k.add(bk);
      for(const [y,rz,l] of [[.38,-.9,.42],[.55,-1.4,.3]]){ const f=box(k,.05,l,.015,M('#3a7ad8'),-.18,y,-.05); f.rotation.z=rz; } },{aermel:'#efe8d6'}); H.add(m.G); m.G.position.set(-.2,BH,.1); // Barett mit blauer Feder, steht vorn auf der Bühne
    strumpf(m,ringel('#c0302a','#1e1e20')); for(const x of [-.25,.25]){ const pu=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),M('#efe8d6')); pu.position.set(x,1.32,0); m.G.add(pu); } // Puffärmel
    const L=new THREE.Group(); L.position.set(-.02,1.02,.26); L.rotation.set(.15,0,.95); m.G.add(L); const kb=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),M('#b8682a')); kb.scale.set(.2,.26,.09); L.add(kb); // Laute: bauchiger Körper,
    const ro=new THREE.Mesh(new THREE.CircleGeometry(.06,12),M('#3a2414')); ro.position.set(0,.03,.091); L.add(ro); box(L,.07,.48,.03,M('#6b3a1a'),0,.48,.03); const kk=box(L,.08,.16,.03,M('#6b3a1a'),0,.76,-.03); kk.rotation.x=-.9; // Schallloch, Hals, abgeknickter Wirbelkasten
    m.arme[0].rotation.set(-1.3,0,.55); m.arme[1].rotation.set(-.85,0,-.35);
    const noten=[0,1,2].map(i=>{ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(64,64,g=>{ g.fillStyle='#2a1a10'; g.font='52px Georgia, serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(i%2?'♫':'♪',32,34); }),transparent:true,depthWrite:false,opacity:0})); sp.scale.set(.45,.45,1); world.add(sp); return {sp,ph:i/3}; });
    H.updateMatrixWorld(); const tex=LIEDER.map(l=>l.map(z=>blaseTex(z,notenDeko))), sp=blase('',p.x,p.y+BH+3.1,p.z,7.5);
    U.saenger={m,d:S.d,noten,P:m.G.getWorldPosition(new THREE.Vector3()),sp,tex}; }

  // ---------- Bettler vor der Burg: sitzt auf dem Pflaster am Rand, schaut den Kommenden entgegen, hält den Hut hin; wer vorbeifährt, ist ein Geizhals ----------
  { const S=BETTLER, p=at(S.d,S.s,-.3); p.y=bodenY(p.x,p.z); const m=mensch(p,strasse(S.d-6),'#6b5a44','#4a3a2a',HUT.kapuze,{aermel:'#5a4a36'}); sitzen(m,.16);
    for(const [x,y,c] of [[.12,1.1,'#8a6a44'],[-.1,.7,'#4e3e2e']]) box(m.G,.12,.12,.02,M(c),x,y,.2); // Flicken
    const hu=new THREE.Group(); hu.position.set(0,-.66,.12); m.arme[1].add(hu); const kr=new THREE.Mesh(new THREE.CylinderGeometry(.13,.11,.12,10,1,true),dbl('#3a2e24')); kr.position.y=.04; hu.add(kr); const rd=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.015,12),M('#3a2e24')); rd.position.y=-.02; hu.add(rd); // Hut umgedreht
    const kru=cyl(.03,holz); place(kru,[p.x+.4,p.y,p.z],[p.x+.5,p.y+1.2,p.z+.3]); world.add(kru); // Krücke
    U.bettler={m,d:S.d,sp:blase('Ein Almosen, edler Herr!',p.x,p.y+2.6,p.z),bitte:null,geiz:blaseTex('Geizhals! Möge dir die Kette reißen!'),geizT:0,last:-1e9}; }
  // ---------- Warnende Bauern vor den Wegelagerern: kommen hastig bergab, schauen sich um; vor dir bleiben sie stehen, er zeigt den Berg hinauf, sie schlägt die Hände vors Gesicht ----------
  { const bu=mensch(O0,{x:0,z:1},'#8a6a44','#5b4a36',HUT.stroh), bb=new THREE.Group(); bb.position.set(0,-.62,.05); bu.arme[1].add(bb); const sk=cyl(.025,holz); place(sk,[0,0,0],[0,.9,-.5]); bb.add(sk); // Bündel am Stecken über der Schulter
    const bd=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6),M('#c9b28a')); bd.position.set(0,.95,-.6); bb.add(bd); bu.arme[1].rotation.x=-2.6;
    const ba=mensch(O0,{x:0,z:1},'#3f6b4a','#3a2a1c',HUT.tuch,{lang:1}), ko=new THREE.Mesh(new THREE.CylinderGeometry(.16,.12,.2,10,1,true),dbl('#a8844a')); ko.position.set(0,-.66,.14); ba.arme[0].add(ko);
    U.warn={L:[{m:bu,dd:0,u:.6},{m:ba,dd:1.3,u:1.4}],d:WARN.d,ph:0,sp:blase('Habt Acht, Fremder! Hinter der Kehre treiben finstere Gestalten ihr Unwesen!',0,0,0,7.5),rufT:0}; } }

// ---- Bewegung (aus poseUnterwegs) ----
// Gänseherde: quert langsam die Wiese hin und her, flieht vor Fahrern an den Rand; fährst du durch, rennt dir eine flatternd und zischend hinterher
function poseGaense(t,dt,cp){ const G=anim.burg.unterwegs.gaense, D=G.d, w2=roadW(R,D)/2, uc=(w2+4)*Math.sin(t*.12), J=G.jagd;
  const flucht=[me.d,...(opp.active?[opp.d]:[])].some(d=>d>D-35&&d<D+6);
  if(me.d<D-200){ G.fertig=false; if(J){ J.g.u=uc+J.g.du; G.jagd=null; } }
  if(!G.fertig&&!G.jagd&&(G.last??-1e9)<D-2&&me.d>=D-2&&me.v>1){ G.fertig=true; const L=(riders3d[myKey]||{}).lane||0, g=G.L.slice().sort((a,b)=>Math.abs(a.u-L)-Math.abs(b.u-L))[0]; G.jagd={g,d:D+g.dd,u:g.u,t:0}; }
  G.last=me.d;
  for(const g of G.L){ if(J&&J.g===g) continue;
    const u=flucht?(g.u>=0?1:-1)*(w2+2.2+Math.abs(g.du)*.6):uc+g.du, du=u-g.u, k=Math.min(1,dt*(flucht?2.5:.8)), vel=Math.abs(du)*k/Math.max(dt,1e-3); g.u+=du*k; g.ph+=dt*(2+vel*6);
    const P=wegPos(D+g.dd,g.u), dir=Math.sign(du)||1; g.T.position.set(P.x,bodenY(P.x,P.z),P.z); g.T.rotation.set(0,Math.atan2(-Math.sin(P.h)*dir,Math.cos(P.h)*dir),.12*Math.sin(g.ph*2)*Math.min(1,vel*2+.3));
    g.hals.rotation.x=flucht?.2:.9*Math.max(0,Math.sin(t*.8+g.ph))**6; for(const [i,f] of g.fl.entries()) f.rotation.z=flucht?(i?1:-1)*(.5+.5*Math.sin(t*18+g.ph)):0; } // picken, auf der Flucht flattern
  G.magd.arme[1].rotation.x=-.6-.3*Math.max(0,Math.sin(t*1.3))**4; // Gänsemagd treibt mit dem Stecken
  if(!J) return;
  const g=J.g, hin=J.t<6; J.t+=dt; let ry;
  if(hin){ const L=(riders3d[myKey]||{}).lane||0; J.u+=(L-J.u)*Math.min(1,dt*2); J.d=Math.min(J.d+Math.min(8,Math.max(0,me.v*.93))*dt, me.d-1.5); ry=0; } // hinter dir her, fällt langsam zurück
  else { const ziel=uc+g.du; J.d=Math.max(D+g.dd,J.d-1.4*dt); J.u+=(ziel-J.u)*Math.min(1,dt); ry=Math.PI; if(J.d<=D+g.dd+.05){ g.u=J.u; G.jagd=null; } } // watschelt zurück zur Herde
  const P=wegPos(J.d,J.u), y=bodenY(P.x,P.z); g.ph+=dt*(hin?16:5);
  g.T.position.set(P.x,y,P.z); g.T.rotation.set(0,Math.atan2(Math.cos(P.h),Math.sin(P.h))+ry,.15*Math.sin(g.ph));
  g.hals.rotation.x=hin?1.1:.1; for(const [i,f] of g.fl.entries()) f.rotation.z=hin?(i?1:-1)*(.6+.6*Math.sin(t*20)):0; } // Hals lang vorgestreckt, Flügel schlagen

// Wäscherinnen: eine schrubbt, die andere schlägt das Tuch aus; fährst du vorbei, holt sie weit aus und es spritzt bis aufs Bild
function poseWasch(t,dt,cp){ const W=anim.burg.unterwegs.wasch, k=W.kn, s=W.sw; if(Math.hypot(cp.x-s.G.position.x,cp.z-s.G.position.z)>200) return;
  k.arme[0].rotation.x=k.arme[1].rotation.x=-1.1-.25*Math.sin(t*6); k.kopf.rotation.z=.1*Math.sin(t*1.2);
  if(me.d<W.d-60) W.nass=false;
  if(!W.nass&&me.d>W.d-14&&me.d<W.d+8){ // schon 14 m vorher, solange sie noch vorn im Bild ist W.nass=true; W.schlag=1; W.spT=3.5; tropfen(); const h=new THREE.Vector3(); W.tu.getWorldPosition(h); const st=wegPos(W.d,0), dx=st.x-h.x, dz=st.z-h.z, l=Math.hypot(dx,dz)||1;
    for(let i=0;i<60;i++){ const v=5+Math.random()*4; partSpawn(parts.spray,h.x,h.y+.3,h.z,dx/l*v+(Math.random()-.5)*2,2+Math.random()*2.5,dz/l*v+(Math.random()-.5)*2,1,Math.random()<.5?'#dfe9ee':'#c4d3dc'); } }
  W.schlag=Math.max(0,W.schlag-dt*1.6); s.arme[1].rotation.x=W.schlag>0?-2.9+2.4*bSm(1-W.schlag):-.6-.9*Math.max(0,Math.sin(t*1.4))**3; W.tu.rotation.y=.3*Math.sin(t*3);
  W.spT=Math.max(0,W.spT-dt); W.sp.visible=W.spT>0; }
// Tropfen auf dem Bild (Wäscherinnen): ein paar Wassertropfen, die langsam ausblenden
function tropfen(){ let el=document.getElementById('tropfen'); if(!el){ el=document.createElement('div'); el.id='tropfen'; document.body.appendChild(el); }
  el.innerHTML=''; for(let i=0;i<16;i++){ const d=document.createElement('i'), s=14+Math.random()*46; Object.assign(d.style,{left:Math.random()*95+'%',top:Math.random()*85+'%',width:s+'px',height:s*(1+Math.random()*.3)+'px'}); el.appendChild(d); }
  el.classList.add('zeig'); clearTimeout(tropfen.t); tropfen.t=setTimeout(()=>el.classList.remove('zeig'),1400); }

// Badehaus: Dirnen wiegen sich, heben beim Vorbeifahren die Röcke, Kusshand und Zwinkern; Bader schrubbt sich, Dampf steigt aus Zuber und Kamin
function poseBad(t,dt,cp){ const B=anim.burg.unterwegs.bad, P0=B.D[0].m.G.position; if(Math.hypot(cp.x-P0.x,cp.z-P0.z)>220) return;
  const nah=meNah(B.d,30,6); B.k=Math.min(1,Math.max(0,B.k+(nah?dt*1.5:-dt))); const k=bSm(B.k); B.sp.visible=meNah(B.d,38,4);
  B.D.forEach((D,i)=>{ const m=D.m; m.G.rotation.z=.07*Math.sin(t*2.2+i*1.5); m.kopf.rotation.z=(.08+.15*k)*(i?-1:1); D.vo.rotation.x=-k*(.95+.12*Math.sin(t*3+i*2));
    const zw=Math.sin(t*(i?2.2:.9)+i)>(i&&k>.3?.6:.97); D.au[1].scale.y=zw?.15:1; // zwinkert (die zweite oft, wenn du nahst)
    if(i===0){ const c=(t/1.6)%1, ku=c<.4?1:Math.max(0,1-(c-.4)*4); m.arme[1].rotation.set(-(1.6+1.0*ku)*k-.1,0,.12+.5*ku*k); m.arme[0].rotation.set(-.5*k,0,-.12-.2*k); } // Kusshand, andere Hand rafft den Rock
    else for(const [j,a] of m.arme.entries()) a.rotation.set(-.55*k,0,(j?1:-1)*(.12+.15*k)); });
  B.ba.arme[1].rotation.z=.6+.35*Math.sin(t*5); B.ba.kopf.rotation.z=.12*Math.sin(t*1.7);
  for(const S of B.dampf){ const f=(t*.3+S.ph)%1; S.sp.position.set(S.x+Math.sin(t+S.ph*9)*.3,S.y+f*2.5+visOff(S.x,S.z),S.z); S.sp.scale.setScalar(.6+f*2); S.sp.material.opacity=.45*Math.min(1,f*5)*(1-f); } }

// Minnesänger: zupft die Laute, wiegt sich, tippt mit dem Fuß, Noten steigen auf; im Vorbeifahren eines der zwei Lieder (pro Rennen gelost, online bei beiden gleich)
function poseSaenger(t,cp){ const S=anim.burg.unterwegs.saenger, P=S.P; if(Math.hypot(cp.x-P.x,cp.z-P.z)>220) return;
  S.m.arme[1].rotation.x=-.85+.12*Math.sin(t*14); S.m.kopf.rotation.z=.15*Math.sin(t*2.4); S.m.G.rotation.z=.05*Math.sin(t*2.4); S.m.beine[1].rotation.x=-.18*Math.max(0,Math.sin(t*7.5));
  S.noten.forEach(N=>{ const f=(t*.4+N.ph)%1; N.sp.position.set(P.x+Math.sin(f*6+N.ph*9)*.4,P.y+2.1+f*1.8+visOff(P.x,P.z),P.z); N.sp.material.opacity=Math.min(1,f*4)*(1-f); });
  const sing=meNah(S.d,110,10); S.sp.visible=sing; if(sing) S.sp.material.map=S.tex[Math.floor(Math.abs(race.windDir||0)*1e4)%2][Math.floor(t/2.6)%2]; } // singt schon von weitem, die Zeilen wechseln ohnehin

// Bettler: hält den Hut hin und bittet; bist du vorbei, schimpft er dir „Geizhals!“ hinterher und schüttelt die Faust
function poseBettler(t,dt,cp){ const B=anim.burg.unterwegs.bettler, m=B.m; if(Math.hypot(cp.x-m.G.position.x,cp.z-m.G.position.z)>150) return; B.bitte??=B.sp.material.map;
  if(me.d<B.d-60){ B.geizT=0; B.kamT=null; } if(B.last<B.d+1&&me.d>=B.d+1&&me.d-B.last<20){ B.geizT=BETTLER.T; B.kamT=0; } // vorbei: schimpft, die Kamera schaut zurück B.last=me.d; B.geizT=Math.max(0,B.geizT-dt);
  const bitte=meNah(B.d,35,1), geiz=B.geizT>0; B.sp.visible=bitte||geiz; B.sp.material.map=geiz?B.geiz:B.bitte; const gr=B.kamT!=null?1.4:1; B.sp.scale.set(6.2*gr,1.92*gr,1); // beim Rückblick größer
  m.arme[1].rotation.x=bitte?-1.25+.12*Math.sin(t*4):-.5; m.arme[0].rotation.x=geiz?-2.5+.35*Math.sin(t*13):-.3;
  const P=m.G.position, dw=angDiff(Math.atan2(cp.x-P.x,cp.z-P.z),m.G.rotation.y); m.kopf.rotation.y=Math.max(-1,Math.min(1,dw))*bSm((30-Math.hypot(cp.x-P.x,cp.z-P.z))/10); }

// Warnende Bauern: gehen dir entgegen, sobald du nahst; ab 35 m bleiben sie stehen und warnen, nach dem Vorbeifahren gehen sie weiter bergab; ein neues Rennen setzt sie zurück
function poseWarn(t,dt,cp){ const W=anim.burg.unterwegs.warn, s=WARN.s; if(me.d<WARN.d-300){ W.d=WARN.d; W.rufT=0; }
  const gap=W.d-me.d, steh=gap<35&&gap>-3, geh=!steh&&gap<160; if(steh) W.rufT=3; else W.rufT=Math.max(0,W.rufT-dt);
  const v=geh&&!race.paused?1.5:0; W.d-=v*dt; W.ph+=v*dt*4.8; const h=headingAt(R,W.d), ab=Math.atan2(-Math.cos(h),-Math.sin(h)), quer=Math.atan2(Math.sin(h)*s,-Math.cos(h)*s); // ab: bergab, quer: zur Straße
  W.L.forEach((L,i)=>{ const m=L.m, P=wegPos(W.d+L.dd,s*(roadW(R,W.d)/2+L.u)), sn=Math.sin(W.ph+i*1.3); m.G.position.set(P.x,bodenY(P.x,P.z)+(v?.03*Math.abs(Math.cos(W.ph+i*1.3)):0),P.z);
    m.G.rotation.y=steh?quer:ab; m.beine[0].rotation.x=v?.45*sn:0; m.beine[1].rotation.x=v?-.45*sn:0;
    if(steh){ m.kopf.rotation.set(0,-.5*s,0); if(i===0) m.arme[0].rotation.set(0,0,-1.45*s+.1*Math.sin(t*6)); else { m.arme[1].rotation.set(-2.6,0,-.35); m.arme[0].rotation.set(-2.6,0,.35); m.kopf.rotation.z=.15*Math.sin(t*5); } } // zeigt den Berg hinauf · Hände vors Gesicht
    else { m.kopf.rotation.set(0,Math.max(0,Math.sin(t*.9+i*2))**8*2.4*(i?1:-1),0); if(i===0) m.arme[0].rotation.set(-.35*sn,0,-.12); else { m.arme[1].rotation.set(.35*sn,0,.12); m.arme[0].rotation.set(-.45,0,-.12); } } }); // schauen sich beim Gehen um
  const S=W.sp; S.visible=W.rufT>0; if(S.visible){ const P=W.L[0].m.G.position; S.position.set(P.x,P.y+3+visOff(P.x,P.z),P.z); } }
