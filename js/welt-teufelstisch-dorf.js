/* ================= Teufelstisch (Kampagne, Mission 2) – Dorf und Wiesen im Kaltenbacher Tal (vom Nutzer: Weg vom Wirtshaus bis zur Hundejagd interessanter, niemand sagt etwas) =================
   Elwetritsche sitzt oben auf dem Kirchturm, fliegt im Bogen über dich und Friedel hinweg und landet in einer Baumkrone rechts am Weg; die Kamera fliegt mit (TT_ELW, ttElwKamera aus rennen.js).
   Hühner picken vor dem letzten Haus auf dem Weg und flattern zur Seite, wenn du kommst; Misthaufen und Handkarren daneben (TT_HUHN, hofKasten aus welt-dorf.js).
   Sühnekreuz rechts am Ortsausgang (TT_KREUZ) · Schäfer mit kleiner Herde, Hütehund und Schäferkarren links hinter dem Bach · Angler am Bach zieht einen Fisch heraus, wenn du vorbeikommst (TT_WIESE).
   Plätze ttDorfPrep (aus prepTeufelstisch) → R.tt.dorfL · buildTtDorf aus buildTeufelstisch · poseTtDorf aus poseTeufelstisch */

const TT_ELW={vor:15, flug:3.6, sitz:2.6, gr:1.6, baum:[40,13,2.6], ueber:3.4, nah:6}; // Abflug, wenn du so viele m vor der Kirche bist · s Flug · s Blick auf die Landung · Größe · Landebaum [m nach der Kirche, m neben dem rechten Wegrand, Kronenradius] · m über dem Weg, wo sie über euch fliegt · Kamera am Ende so viele m vor der Landestelle
const TT_HUHN={d:62, n:6, flucht:14, v:4.2}; // m nach der Kirche (vor dem letzten Haus) · Anzahl · flattern los, wenn du so nah bist · m/s
const TT_KREUZ={d:95}; // m nach der Kirche, rechts am Ortsausgang
const TT_WIESE={von:110, bis:50, schaefer:.2, angler:.75, sicht:320, biss:22}; // Schäfer und Angler zwischen Ortsausgang (m nach der Kirche) und Badestelle (bis so viele m davor), bei diesem Anteil · sichtbar so viele m davor · Fisch beißt, wenn du so nah bist

// ---- Vorbereitung (aus prepTeufelstisch): Landebaum mit zwei Nachbarn, Plätze frei von Erlen und Büschen ----
function ttDorfPrep(T,at,rw,frei,S){ const K=T.kirche; if(!K) return; const L=T.dorfL={};
  { const [bd,bu,bs]=TT_ELW.baum; [[0,0,bs],[-5,6,bs*.85],[7,4,bs*.75]].forEach(([dd,uu,s],i)=>{ const d=K.d+bd+dd, [x,y]=at(d,rw(d)+bu+uu); S.tree.push({x,y,s,c:.2+i*.3,pine:false,ht:9}); if(!i) L.baum={d,x,y,s}; }); }
  { const d=K.d+TT_HUHN.d; L.huhn={d}; for(const [dd,uu] of [[-4,4.5],[-8,3.6]]) frei.push([...at(d+dd,rw(d+dd)+uu),2.6]); } // Misthaufen, Handkarren
  { const d=K.d+TT_KREUZ.d; L.kreuz={d,u:rw(d)+2}; frei.push([...at(d,rw(d)+2),1.6]); }
  const W=TT_WIESE, a=K.d+W.von, b=Math.max(a+60,(T.bad?T.bad.d:a+400)-W.bis);
  { const d=a+(b-a)*W.schaefer; L.schaf={d}; for(let dd=-12;dd<=14;dd+=6.5) frei.push([...at(d+dd,-(rw(d+dd)+15)),8]); } // Herde links hinter dem Bach
  { const d=a+(b-a)*W.angler, u=ttBachU(d,rw(d))-1.9; L.angler={d,u}; frei.push([...at(d,u),3.5]); } } // am anderen Ufer, schaut zum Weg

// ---- Aufbau (aus buildTeufelstisch) ----
function buildTtDorf(A){ const T=R.tt, L=T.dorfL, K=T.kirche; if(!L||!K) return; const D={tiere:[],dampf:[]}, q=rng(515), M=c=>lam(c), holz=M('#6b4a32'), holzD=M('#4e3626'), V=THREE.Vector3;
  const box=(P,w,h,d,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); P.add(b); return b; };
  const kug=(P,m,x,y,z,sx,sy=sx,sz=sx)=>{ const o=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),m); o.position.set(x,y,z); o.scale.set(sx,sy,sz); P.add(o); return o; };
  const stab=(P,m,a,b,r)=>{ const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,1,6),m); ttStrich(o,new V(...a),new V(...b)); P.add(o); return o; };
  const grp=(d,u,ry=0)=>{ const p=wegPos(d,u), G=new THREE.Group(); G.position.set(p.x,bodenY(p.x,p.z),p.z); G.rotation.y=ry; G.userData.ohneBoden=true; world.add(G); return G; };
  const hut=(m,mat)=>{ kug(m.kopf,mat,0,.2,0,.25,.025,.25); kug(m.kopf,mat,0,.25,0,.13,.08,.13); };
  const HK=hofKasten({box,M,holz,holzD,bretter:triBretter(),q,D}), B=A.dorfL={};

  // Elwetritsche oben am Spitzhelm vor dem Kreuz (Kirche in welt-teufelstisch.js: Turm lokal z 4.3, Helm bis 21.75)
  { const [px,pz]=posAt(R,K.d), ry=Math.atan2(px-K.x,pz-K.y), lz=4.55, st=new V(K.x+lz*Math.sin(ry),bodenY(K.x,K.y)+21.25,K.y+lz*Math.cos(ry));
    const Bm=L.baum, kr=terrainAt(Bm.x,Bm.y)+Bm.s*1.1+1.4, r=wegPos(Bm.d,0), nl=Math.hypot(r.x-Bm.x,r.z-Bm.y)||1, n=new V((r.x-Bm.x)/nl,0,(r.z-Bm.y)/nl);
    const ziel=new V(Bm.x,kr+Bm.s*1.15*.78,Bm.y).addScaledVector(n,Bm.s*.55); // oben in der Krone, zum Weg hin (Laubbaum wie in welt-kalmit.js)
    const E=elwetritscheModell(); E.G.scale.setScalar(TT_ELW.gr); E.G.position.copy(st); E.G.rotation.y=ry; E.G.userData.ohneBoden=true; world.add(E.G); B.elw={E,st,ziel,n,ry,t0:null}; }

  // Hühner auf dem Weg, Misthaufen und Handkarren rechts vor dem Haus
  { const H=L.huhn, rw=roadW(R,H.d)/2; { const Gm=grp(H.d-4,rw+4.5,q()*6); Gm.scale.setScalar(.6); HK.misthaufen(Gm); } HK.handkarren(grp(H.d-8,rw+3.6),0,0,-wegPos(H.d,0).h+.5);
    B.huehner=[]; for(let i=0;i<TT_HUHN.n;i++){ const c=['#c9733a','#f2ece0','#9a5a2a','#2e2a24'][i%4], Tn=HK.huhn(world,0,0,0,0,c), k=D.tiere[D.tiere.length-1].k; Tn.scale.setScalar(1.3); Tn.userData.ohneBoden=true;
      const fl=[-1,1].map(s=>HK.kugel(Tn,.09,c,-.02,.2,s*.11,1.4,.45,.35)); B.huehner.push({T:Tn,k,fl,d0:H.d+(q()-.5)*7,u0:(q()-.5)*rw*1.6,d1:H.d+2+q()*6,u1:rw+2.4+q()*2.4,ph:q()*6,ry0:q()*6}); }
    B.huhn={d:H.d,t0:null}; ttHuhnStart(B); }

  // Sühnekreuz: alter Sandstein, leicht schief, Moos oben, Gras und ein paar Blumen am Fuß
  { const Kr=L.kreuz, G=grp(Kr.d,Kr.u,Math.PI-wegPos(Kr.d,Kr.u).h), I=new THREE.Group(), st=M('#a89a82'), moos=M('#5a7a3a'); G.add(I); I.rotation.set(-.05,0,.08);
    box(I,.3,1.15,.2,st,0,.47,0); box(I,.8,.26,.2,st,0,.74,0); kug(I,moos,-.3,.88,0,.12,.03,.1); kug(I,moos,.05,1.05,.02,.1,.03,.09); kug(I,moos,0,.02,0,.24,.08,.18);
    for(let i=0;i<7;i++){ const a=q()*6.28, o=.3+q()*.25; kug(G,M(['#e8e0f0','#f2d040','#9a6ad0'][i%3]),Math.cos(a)*o,.12,Math.sin(a)*o,.04); } B.kreuz=G; }

  // Schäfer mit Stab und Filzhut, kleine Herde, Hütehund liegt daneben, Schäferkarren (wie in Mission 1, welt-trifels-wiesen.js)
  { const Sf=L.schaf, rw=roadW(R,Sf.d)/2, h=wegPos(Sf.d,0).h, wolle=M('#e6dfcf'), schwarz=M('#2a2420'), beinG=new THREE.CylinderGeometry(.04,.04,.4,5), G=new THREE.Group(); world.add(G); G.userData.ohneBoden=true;
    const schaf=lamm=>{ const S=new THREE.Group(); kug(S,wolle,0,.5,0,.5,.32,.28); for(const [x,z] of [[.3,.15],[.3,-.15],[-.3,.15],[-.3,-.15]]){ const b=new THREE.Mesh(beinG,schwarz); b.position.set(x,.2,z); S.add(b); }
      const k=new THREE.Group(); k.position.set(.45,.6,0); S.add(k); kug(k,schwarz,.15,-.04,0,.16,.11,.1); kug(k,wolle,.04,.05,0,.13,.1,.12); for(const z of [-1,1]) kug(k,schwarz,.08,.04,z*.13,.06,.03,.12); kug(S,wolle,-.5,.55,0,.09);
      if(lamm) S.scale.setScalar(.6); return {S,k}; };
    B.schafe=[[-8,11],[-3,13.5],[2,10.5],[6,14],[-5,17],[10,12,1],[1,16.5]].map(([dd,uu,lamm])=>{ const p=wegPos(Sf.d+dd,-(rw+uu)), {S,k}=schaf(lamm); S.position.set(p.x,bodenY(p.x,p.z),p.z); S.rotation.y=q()*6.28; G.add(S); return {S,k,ph:q()*6}; });
    { const p=wegPos(Sf.d+9,-(rw+21)), Kn=new THREE.Group(); Kn.rotation.y=-h; G.add(Kn); const plane=new THREE.CylinderGeometry(.74,.74,2.7,10,1,true,0,Math.PI); plane.rotateZ(Math.PI/2); // Schäferkarren längs zum Weg
      Kn.position.set(p.x,Math.max(...[-.78,.78].map(z=>bodenY(p.x-Math.sin(h)*z,p.z+Math.cos(h)*z))),p.z); box(Kn,2.6,1,1.4,M('#7a5a3a'),0,1.15,0); const pm=new THREE.Mesh(plane,new THREE.MeshLambertMaterial({color:'#d8ccb0',side:THREE.DoubleSide})); pm.position.y=1.62; Kn.add(pm);
      box(Kn,.5,.8,.04,M('#1e1610'),.6,1.15,.71); for(const z of [-.78,.78]){ const r2=new THREE.Mesh(new THREE.TorusGeometry(.55,.05,5,16),holzD); r2.position.set(0,.6,z); Kn.add(r2); for(let k=0;k<3;k++) box(Kn,.04,1.05,.04,holz,0,.6,z).rotation.z=k*Math.PI/3; }
      stab(Kn,holz,[1.3,.75,.3],[2.9,.06,.15],.04); stab(Kn,holz,[1.3,.75,-.3],[2.9,.06,-.15],.04); stab(Kn,M('#3a3634'),[-.6,2.1,.3],[-.6,2.6,.3],.05); } // Deichsel liegt auf dem Boden, Ofenrohr
    { const p=wegPos(Sf.d-1,-(rw+8.5)), m=trMensch({kittel:'#5a4a3a',hose:'#3a3020',mantel:'#4a4034',haar:'#9a948a',bart:'#9a948a'}); hut(m,M('#3a3028')); m.arme[0].rotation.x=-.35;
      const st=new THREE.Group(); st.position.y=-.62; m.arme[0].add(st); stab(st,holz,[0,-.85,.12],[0,1.05,.12],.025); const kr=new THREE.Mesh(new THREE.TorusGeometry(.11,.022,4,10,Math.PI),holz); kr.position.set(0,1.05,.23); kr.rotation.y=Math.PI/2; st.add(kr);
      m.G.position.set(p.x,bodenY(p.x,p.z),p.z); m.G.rotation.y=-h; G.add(m.G); B.schaefer=m; } // schaut zum Weg
    { const p=wegPos(Sf.d+.4,-(rw+8)), fh=M('#24201c'), Hd=new THREE.Group(); Hd.position.set(p.x,bodenY(p.x,p.z),p.z); Hd.rotation.y=-h-Math.PI/2; G.add(Hd); // Hund liegt, Kopf zum Weg
      kug(Hd,fh,0,.15,0,.36,.13,.14); kug(Hd,M('#efe8dc'),.26,.17,0,.1,.1,.09); const kp=new THREE.Group(); kp.position.set(.36,.26,0); Hd.add(kp); kug(kp,fh,0,0,0,.1,.09,.085); kug(kp,fh,.11,-.03,0,.08,.05,.05); for(const z of [-1,1]) box(kp,.04,.08,.03,fh,-.02,.09,z*.06);
      for(const z of [-1,1]) kug(Hd,fh,.3,.04,z*.07,.14,.04,.04); const sw=new THREE.Group(); sw.position.set(-.34,.16,0); Hd.add(sw); stab(sw,fh,[0,0,0],[-.3,.02,0],.025); B.hund={kp,sw}; } // Vorderpfoten, Schwanz
    B.schaf={G,d:Sf.d}; }

  // Angler auf einem Stein am anderen Ufer, Rute über den Bach; beim Vorbeifahren zieht er einen Fisch heraus
  { const An=L.angler, p=wegPos(An.d,An.u), G=grp(An.d,An.u,-p.h), stein=new THREE.Mesh(new THREE.DodecahedronGeometry(.42,0),M('#9a948a')); stein.scale.y=.7; stein.position.y=.18; G.add(stein);
    const m=trMensch({kittel:'#6a5a3a',hose:'#3a3020',haar:'#6a4a2a'}); hut(m,M('#d8c070')); m.beine[0].rotation.x=m.beine[1].rotation.x=-1.4; m.arme[0].rotation.x=m.arme[1].rotation.x=-1; m.G.position.y=-.05; G.add(m.G); // sitzt wie in Mission 1 (Sitzfläche .5 über m.G)
    const ru=new THREE.Group(); ru.position.set(0,.91,.35); G.add(ru); stab(ru,holz,[0,0,0],[0,1.3,2.1],.014);
    const schnur=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,4),M('#d8d4c8')); schnur.userData.ohneBoden=true; world.add(schnur);
    const fisch=new THREE.Group(), fm=new THREE.MeshLambertMaterial({color:'#9aaab0',emissive:'#1a2226'}); kug(fisch,fm,0,-.16,0,.06,.17,.035); const sf=new THREE.Mesh(new THREE.ConeGeometry(.07,.12,4),fm); sf.position.y=-.36; sf.rotation.x=Math.PI; sf.scale.z=.3; fisch.add(sf); // Forelle, Kopf oben am Haken
    fisch.visible=false; fisch.userData.ohneBoden=true; world.add(fisch); B.angler={G,m,ru,schnur,fisch,d:An.d,t0:null}; } }

// Zylinder (Höhe 1, entlang y) von a nach b strecken
function ttStrich(o,a,b){ const dir=b.clone().sub(a), l=dir.length()||1e-4; o.position.copy(a).add(b).multiplyScalar(.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.multiplyScalar(1/l)); o.scale.y=l; }
function ttHuhnStart(B){ B.huehner.forEach(e=>{ e.d=e.d0; e.u=e.u0; e.ry=e.ry0; }); }

// ---- Bewegung (aus poseTeufelstisch) ----
function poseTtDorf(dt){ const A=anim.tt, B=A&&A.dorfL; if(!B) return; const t=performance.now()/1000, run=race.state==='run', lauf=run&&!race.paused?dt*simSpeed():0;
  ttElw(B,t); ttHuehner(B,t,run,lauf); ttWiese(B,t,run); }

// Elwetritsche: schaut sich oben auf dem Turm um, fliegt los, wenn du TT_ELW.vor m vor der Kirche bist, Bogen über euch (Mitte über deinem Kopf) bis in die Krone, dort schüttelt sie sich und schaut zum Weg
function ttElw(B,t){ const El=B.elw, Z=TT_ELW, K=R.tt.kirche; if(!El) return; const E=El.E; const g=me.d-(K.d-Z.vor), rt=race.t;
  E.G.visible=Math.abs(me.d-K.d)<500;
  if(race.state!=='run'||g<-30) El.t0=null; else if(El.t0==null&&g>=0){ El.t0=g<15?rt:-1e9; const v=Math.max(4,me.v||0), p=wegPos(me.d+v*Z.flug/2,-.6), M=new THREE.Vector3(p.x,bodenY(p.x,p.z)+1.8+Z.ueber,p.z); El.c=M.multiplyScalar(2).addScaledVector(El.st,-.5).addScaledVector(El.ziel,-.5); } // Kontrollpunkt: Bogenmitte genau über euch (nach Sprüngen im Testmodus gleich in der Krone)
  const y=El.t0==null?-1:rt-El.t0;
  if(y<0){ E.G.position.copy(El.st); E.G.rotation.set(0,El.ry+.5*Math.sin(t*.6),0); E.K.rotation.x=0; E.kopf.rotation.y=.6*Math.sin(t*1.3); E.fluegel.forEach((w,j)=>w.rotation.z=(j?-1:1)*.05); E.beine.forEach(b=>b.rotation.x=0); return; }
  if(y<Z.flug){ const u=y/Z.flug, a=(1-u)*(1-u), b=2*u*(1-u), c=u*u, P=new THREE.Vector3().addScaledVector(El.st,a).addScaledVector(El.c,b).addScaledVector(El.ziel,c);
    const dx=2*(1-u)*(El.c.x-El.st.x)+2*u*(El.ziel.x-El.c.x), dy=2*(1-u)*(El.c.y-El.st.y)+2*u*(El.ziel.y-El.c.y), dz=2*(1-u)*(El.c.z-El.st.z)+2*u*(El.ziel.z-El.c.z);
    E.G.position.copy(P); E.G.rotation.set(0,Math.atan2(dx,dz),0); E.K.rotation.x=clampN(Math.atan2(-dy,Math.hypot(dx,dz))*.7,-.6,.6); E.kopf.rotation.y=0;
    E.fluegel.forEach((w,j)=>w.rotation.z=(j?-1:1)*(.6+.7*Math.sin(t*30))); E.beine.forEach(b=>b.rotation.x=.9); return; } // Flügel schlagen wild, Beine angezogen
  const s=y-Z.flug; E.G.position.copy(El.ziel); E.G.position.y+=.25*Math.max(0,Math.sin(s*9))*Math.exp(-s*3); E.G.rotation.set(0,Math.atan2(El.n.x,El.n.z)+.3*Math.sin(t*.5),0); E.K.rotation.x=0; E.beine.forEach(b=>b.rotation.x=0);
  E.fluegel.forEach((w,j)=>w.rotation.z=(j?-1:1)*(s<.8?.4*Math.sin(t*25)*(1-s/.8):.05)); E.kopf.rotation.y=s>.6&&s<1.6?.5*Math.sin(s*12):.4*Math.sin(t*.9); } // landet, schüttelt sich, schaut sich um

// Kamera (aus rennen.js): erst tief hinter euch, Blick auf die Elwetritsche, die über eure Köpfe fliegt, dann über eure Köpfe hinweg zur Baumkrone, ein paar Sekunden auf die Landung
function ttElwKamera(){ const A=anim.tt, B=A&&A.dorfL, El=B&&B.elw, ich=riders3d[myKey]; if(!El||El.t0==null||race.state!=='run'||!ich) return; const Z=TT_ELW, y=race.t-El.t0, T2=Z.flug+Z.sitz; if(y<0||y>T2) return;
  const V=THREE.Vector3, ip=ich.g.position, hd=headingAt(R,me.d), f=new V(Math.cos(hd),0,Math.sin(hd)), r=new V(-f.z,0,f.x), w=bSm(y/.8)*bSm((T2-y)/.8), m=Z.flug*.6;
  const c0=ip.clone().addScaledVector(f,-5).addScaledVector(r,-.4).add(new V(0,1.6,0)), c1=ip.clone().addScaledVector(f,-1).addScaledVector(r,-.4).add(new V(0,3.8,0)), c2=El.ziel.clone().addScaledVector(El.n,Z.nah).add(new V(0,-1,0));
  const pos=y<m?c0.lerp(c1,bSm(y/m)):c1.lerp(c2,bSm((y-m)/(Z.flug-m+.8))), look=El.E.G.position.clone().add(new V(0,.8,0));
  if(!El.lk||y<.05) El.lk=look.clone(); else El.lk.lerp(look,.25); camera.position.lerp(pos,w); camera.lookAt(new V(camS.lx,camS.ly,camS.lz).lerp(El.lk,w)); }

// Hühner: picken auf dem Weg, flattern zur Seite, wenn du kommst, und picken dort weiter
function ttHuehner(B,t,run,lauf){ const H=B.huhn, Z=TT_HUHN, nah=me.d>H.d-260&&me.d<H.d+50; B.huehner.forEach(e=>e.T.visible=nah); if(!nah){ if(H.t0!=null){ H.t0=null; ttHuhnStart(B); } return; }
  if(H.t0==null&&run&&me.d>H.d-Z.flucht){ H.t0=t; if(me.d>H.d+10) B.huehner.forEach(e=>{ e.d=e.d1; e.u=e.u1; }); } // nach Sprüngen im Testmodus gleich am Rand
  B.huehner.forEach((e,i)=>{ const dd=e.d1-e.d, du=e.u1-e.u, l=Math.hypot(dd,du), lauft=H.t0!=null&&l>.05&&t-H.t0>i*.12;
    if(lauft){ const s=Math.min(l,lauf*Z.v); e.d+=dd/l*s; e.u+=du/l*s; const a=wegPos(e.d,e.u), b=wegPos(e.d+dd,e.u+du); e.ry=Math.atan2(-(b.z-a.z),b.x-a.x); }
    const p=wegPos(e.d,e.u); e.T.position.set(p.x,bodenY(p.x,p.z)+(lauft?.3*Math.abs(Math.sin(t*14+i)):0),p.z); e.T.rotation.y=e.ry+(lauft?0:.3*Math.sin(t*.4+e.ph));
    e.k.rotation.z=lauft?.3:-.9*Math.max(0,Math.sin((t+e.ph)*3))**4; e.fl.forEach((w,j)=>w.rotation.x=(j?-1:1)*(lauft?.7+.6*Math.sin(t*35+i):0)); }); }

// Schäfer schaut dir nach, Schafe grasen und heben ab und zu den Kopf, Hund wedelt · Angler: Fisch beißt, wenn du nah bist, er reißt die Rute hoch, der Fisch zappelt
function ttWiese(B,t,run){ const W=TT_WIESE, S=B.schaf, ich=riders3d[myKey], ip=ich&&ich.g.position, sv=me.d>S.d-W.sicht&&me.d<S.d+60; S.G.visible=sv;
  if(sv){ for(const s of B.schafe){ const g=Math.sin(t*.35+s.ph)>-.4; s.k.rotation.z+=((g?-1.1+.08*Math.sin(t*3+s.ph):-.1)-s.k.rotation.z)*.05; }
    B.hund.sw.rotation.y=.6*Math.sin(t*8); B.hund.kp.rotation.z=.1*Math.sin(t*.7);
    if(ip){ const m=B.schaefer, lp=m.G.worldToLocal(ip.clone()); m.kopf.rotation.y+=(clampN(Math.atan2(lp.x,lp.z),-1.1,1.1)-m.kopf.rotation.y)*.06; m.arme[1].rotation.x=-.1+.05*Math.sin(t*.7); } }
  const An=B.angler, av=me.d>An.d-W.sicht&&me.d<An.d+60; An.G.visible=An.schnur.visible=av; An.fisch.visible=false; if(!av){ An.t0=null; return; }
  if(An.t0==null&&run&&me.d>An.d-W.biss) An.t0=me.d>An.d+20?t-10:t; const y=An.t0==null?-1:t-An.t0, c=y<0?0:bSm(y/.5), V=THREE.Vector3; // nach Sprüngen im Testmodus schon oben
  An.ru.rotation.x=y<0?.02*Math.sin(t*.8)+(Math.sin(t*.5)>.96?.08*Math.sin(t*30):0):-.9*c; An.m.arme[0].rotation.x=An.m.arme[1].rotation.x=-1-.5*c; An.m.kopf.rotation.x=.15-.45*c; // zuckt ab und zu, dann hoch damit
  An.G.updateMatrixWorld(true); const tip=An.ru.localToWorld(new V(0,1.3,2.1)), wa=An.G.localToWorld(new V(0,0,1.9)); wa.y=bodenY(wa.x,wa.z)+.09;
  const ende=c<.2?wa:tip.clone().add(new V(.12*Math.sin(t*4),-.55,.12*Math.cos(t*3.3))); ttStrich(An.schnur,tip,ende);
  if(c>=.2){ An.fisch.visible=true; An.fisch.position.copy(ende); An.fisch.rotation.set(.3*Math.sin(t*17),t*2,.5*Math.sin(t*23)); } } // zappelt
