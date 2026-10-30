/* ================= Teufelstisch (Kampagne, Mission 2) – Schlussszene am Lagerplatz =================
   Die letzten TT_LAGER.halt s des Workouts steht man am Lager (R.def.halte, man tritt weiter): Friedel kniet an der Feuerstelle, schlägt Funken, pustet, das Feuer brennt (anim.tt.feuer.an),
   setzt sich auf den Stamm, zieht die letzte Bratwurst aus der Hosentasche (die einzige, die Hunde und Teufel überlebt hat) und brät sie am Stecken überm Feuer. Du sitzt auf dem anderen Stamm.
   Blick übers Feuer auf den Jungfernsprung im Sonnenuntergang, „Gemütlicher Tag, hab ich doch gsagt“, Ausblick auf Mission 3: der Dämonenjunge lugt hinter der Höhlenecke vor und flitzt auf die Kiefer (dmLager in welt-teufelstisch-daemon.js), es dämmert (TT_LAGER.dunkel); die letzten TT_LAGER.ab s blendet das Bild ab (bleibt schwarz bis zum Ergebnis).
   Fahrerfiguren und Friedel auf dem Rad sind solange ausgeblendet, die Holzräder lehnen an der Höhle. Sprüche in TT_LAGER_TXT (Platzhalter). Kamera: ttLagerKamera aus rennen.js */

const TT_LAGER={halt:50, ab:2.5, dunkel:[25,45,.4], funken:[3.5,8], zund:8, auf:[10.5,12.5], tasche:13.5, hoch:[14.5,17], spiess:17.5}; // alles vor der Ende-Tafel (letzte 25 s) – keine Blasen darunter (vom Nutzer) // s Halt am Ende (gerade Zahl wie das Raster von kampPlan) · s Abblende · Dämmerung [von, bis s, so viel dunkler] · Szenenzeit (s ab Halt): Funken schlagen, Feuer brennt, aufstehen und hinsetzen, Wurst aus der Tasche, hochhalten, am Stecken
// Sprüche [Szenenzeit, Dauer, Text] – alle von Friedel · PLATZHALTER, Texte schreibt der Nutzer
const TT_LAGER_TXT=[[13.5,4.5,'Gugg mol, ennie hennse ma gelosst, die Drecksköter.'],[18.5,5.5,'Unn segsch – war doch e gudi Abkerzung vorhin …']]; // nur zwei Sprüche, das Feuer kommentiert er nicht (vom Nutzer)
const ttLagerZeit=()=>{ const T=R&&R.tt; return T&&T.tL!=null&&race.state==='run'?race.t-T.tL:-1; }; // Szenenzeit, vor der Szene negativ

// ---- Aufbau (aus buildTeufelstisch, nach dem Lagerplatz) ----
function buildTtLager(A){ const T=R.tt, Lg=T.lager; if(!Lg||!Lg.sitz||Lg.sitz.length<2) return; const M=c=>lam(c), V=(x,z,y=0)=>new THREE.Vector3(x,y,z);
  const fp=V(Lg.x,Lg.y,bodenY(Lg.x,Lg.y)), [qx,qz]=posAt(R,T.ziel), W=V(qx-Lg.x,qz-Lg.y).normalize(), D=V(T.dahn.x-Lg.x,T.dahn.y-Lg.y).normalize(); // Feuerstelle, Richtung zum Weg und zu den Dahner Felsen
  const [sA,sB]=Lg.sitz.map(([x,z])=>V(x,z,bodenY(x,z))), zu=p=>Math.atan2(Lg.x-p.x,Lg.y-p.z), kn=fp.clone().add(V(sB.x-fp.x,sB.z-fp.z).normalize().multiplyScalar(1.25)); kn.y=bodenY(kn.x,kn.z); // du auf Stamm A, Friedel auf B · kniet vorher an der Feuerstelle
  const sitz=(m,p)=>{ m.G.rotation.order='YXZ'; m.G.position.set(p.x,p.y-.19,p.z); m.G.rotation.y=zu(p); m.beine.forEach(b=>b.rotation.x=-1.5); m.arme.forEach(a=>a.rotation.x=-.5); m.G.userData.ohneBoden=true; world.add(m.G); m.G.visible=false; return m; }; // auf dem Stamm (oben ≈ .56 m), Blick zum Feuer – sitzt absichtlich über dem Boden
  const ichJ=lookOf(myKey).jersey, ich={bauer:sitz(trMensch({kittel:ichJ,aermel:'#ece3cf',hose:'#3b342e',haar:'#6b4a2e'}),sA), baeuerin:sitz(trMensch({lang:ichJ,kittel:ichJ,aermel:'#ece3cf',tuch:'#e6dcc4'}),sA)};
  const fr=sitz(trMensch({kittel:'#5d7a3a',aermel:'#ece3cf',hose:'#3b342e',haar:'#b8452a'}),sB); fr.G.userData.ohneBoden=true; // kniet zeitweise, die Schienbeine liegen fast auf
  for(let i=0;i<12;i++){ const a=-1.3+i/11*2.6, l=.2+((i*37)%7)*.03, st=new THREE.Mesh(new THREE.BoxGeometry(.035,l,.05),M(i%2?'#b8452a':'#9c3a22')); st.position.set(Math.sin(a)*.13,.08-l/2,-Math.cos(a)*.13); st.rotation.set(-Math.cos(a)*.25,0,Math.sin(a)*.25); fr.kopf.add(st); } // rote Zotteln
  // Bratwurst (wird über dem Feuer braun) und Stecken in Friedels rechter Hand
  const wm=lam('#c98a5a'), wurst=new THREE.Group(); { const k=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.2,8),wm); wurst.add(k); for(const s of [-1,1]){ const e=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),wm); e.position.y=s*.1; wurst.add(e); } } wurst.visible=false;
  const stecken=new THREE.Group(); stecken.position.set(0,-.62,.02); stecken.rotation.x=-.35; fr.arme[1].add(stecken); { const s=new THREE.Mesh(new THREE.CylinderGeometry(.012,.016,1.7,5),M('#6b4a2e')); s.position.y=-.85; stecken.add(s); } stecken.visible=false;
  // Funken beim Feuerschlagen
  const fm=new THREE.MeshBasicMaterial({color:'#ffd27a',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}), funken=[]; for(let i=0;i<8;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(.025,5,4),fm); s.visible=false; world.add(s); funken.push(s); }
  // Holzräder lehnen außen an der Höhlenwand (Höhle: Lage hx/hy, Drehung ry, Seitenwand bis lokal x −4,7)
  const raeder=[-1,1.1].map(z=>{ const x=-5.1, c=Math.cos(Lg.ry), s=Math.sin(Lg.ry), wx=Lg.hx+x*c+z*s, wz=Lg.hy-x*s+z*c, g=new THREE.Group(), b=new THREE.Group(); g.add(b); holzRad(b,M);
    g.rotation.order='YXZ'; g.rotation.y=Lg.ry+Math.PI/2; g.rotation.x=.15; g.position.set(wx,bodenY(wx,wz),wz); world.add(g); g.visible=false; return g; });
  const blase=triBlase(); blase.visible=false;
  A.lager={an:false, fp, W, D, sA, sB, kn, ich, friedel:fr, wurst, wm, stecken, funken, raeder, blase}; }

// ---- Bewegung (jeden Frame, aus poseTeufelstisch) ----
function poseTtLager(dt){ const A=anim.tt, S=A&&A.lager; if(!S) return; const lt=ttLagerZeit(), an=lt>=0, Z=TT_LAGER, t=performance.now()/1000, F=S.friedel, ich=riders3d[myKey];
  if(A.feuer) A.feuer.an=an?bSm((lt-Z.zund)/3):0; // Feuer wächst nach dem Anzünden, bleibt bis zum Ende
  const cv=renderer.domElement, ab=an?clampN((lt-(Z.halt-Z.ab))/Z.ab,0,1):0, fl=ab>0?`brightness(${(1-ab).toFixed(3)})`:''; if(cv.style.filter!==fl) cv.style.filter=fl; // letzte s: Bild blendet ab, bleibt schwarz bis zum Ergebnis
  if(an&&!race.rain){ const [d0,d1,dm]=Z.dunkel, d=dm*bSm((lt-d0)/(d1-d0)); sun.intensity*=1-d; hemi.intensity*=1-.8*d; scene.background.multiplyScalar(1-d); scene.fog.color.copy(scene.background); sky.material.color.multiplyScalar(1-.8*d); if(A.feuer) A.feuer.fli.distance=14+20*d; } // es dämmert (ttLicht setzt das Licht jeden Frame neu), das Feuer leuchtet weiter
  if(an!==S.an){ S.an=an; if(ich) ich.g.visible=!an; if(A.friedel) A.friedel.r.g.visible=!an; F.G.visible=an; S.raeder.forEach(g=>g.visible=an); } // in der Szene sitzt ihr am Feuer, die Räder lehnen an der Höhle
  const meinK=KST.stand==='baeuerin'?'baeuerin':'bauer'; for(const k of ['bauer','baeuerin']) S.ich[k].G.visible=an&&k===meinK;
  if(!an){ S.blase.visible=false; S.wurst.visible=S.stecken.visible=false; S.funken.forEach(s=>s.visible=false); return; }
  const k8=Math.min(1,dt*8), dreh=(o,ax,w,k=k8)=>o.rotation[ax]+=(w-o.rotation[ax])*k, blick=(m,x,z)=>{ const w=clampN(angDiff(Math.atan2(x-m.G.position.x,z-m.G.position.z),m.G.rotation.y),-1.1,1.1); dreh(m.kopf,'y',w,Math.min(1,dt*3)); };
  const spr=TT_LAGER_TXT.find(([a,d])=>lt>=a&&lt<a+d);
  // Friedel: kniet an der Feuerstelle, schichtet Holz, schlägt Funken, pustet – steht auf, setzt sich auf den Stamm, Wurst aus der Hosentasche, hochhalten, am Stecken überm Feuer
  const [a0,a1]=Z.auf, u=bSm((lt-a0)/(a1-a0)), p=S.kn.clone().lerp(S.sB,u), hb=Math.sin(Math.PI*u)*.6; F.G.position.set(p.x,p.y-.5+.31*u+hb,p.z); // kniend Hüfte tief, sitzend auf dem Stamm
  F.beine.forEach(b=>b.rotation.x=1.3+(-1.5-1.3)*u); let ax0=-.9, ax1=-.9, az0=-.12, az1=.12, kipp=.25, kx=.3;
  if(lt<Z.funken[0]){ ax0=-1.1+.2*Math.sin(t*3); ax1=-1.1+.2*Math.cos(t*3); } // Holz zurechtlegen
  else if(lt<Z.zund){ ax0=-.85; ax1=-.85+.35*Math.max(0,Math.sin(t*14)); } // Feuerstein und Stahl
  else if(lt<a0){ kipp=.6; kx=.5; ax0=ax1=-.6; } // pustet in die Glut
  if(lt>=a0){ kipp=.25*(1-u)+.05; kx=0; ax0=ax1=-.5; }
  if(lt>=a1){ const T0=Z.tasche, [h0,h1]=Z.hoch; if(lt<T0+1){ ax0=.15; az0=-.3; } else if(lt<h0){ ax0=-.6; az0=-.15; } else if(lt<h1){ ax0=-2.5+.1*Math.sin(t*4); kx=-.4; } else if(lt<Z.spiess){ ax0=-1.2; ax1=-1; } else { ax0=-.6; ax1=-1.25+.04*Math.sin(t*1.7); } }
  dreh(F.G,'x',kipp,Math.min(1,dt*4)); dreh(F.arme[0],'x',ax0); dreh(F.arme[1],'x',ax1); dreh(F.arme[0],'z',az0); dreh(F.arme[1],'z',az1); dreh(F.kopf,'x',kx,Math.min(1,dt*4));
  if(spr&&lt>=Z.spiess){ const w=spr[0]>=Z.spiess?[S.sA.x,S.sA.z]:[S.fp.x,S.fp.z]; blick(F,...w); F.kopf.rotation.x+=.06*Math.sin(t*9); } else blick(F,S.fp.x,S.fp.z); // zu dir, wenn er dich anspricht
  // Wurst: in der linken Hand, dann am Stecken überm Feuer, wird langsam braun und dreht sich
  const inH=lt>=Z.tasche+.6&&lt<Z.spiess; S.wurst.visible=inH||lt>=Z.spiess; S.stecken.visible=lt>=Z.spiess-1;
  if(inH&&S.wurst.parent!==F.arme[0]){ F.arme[0].add(S.wurst); S.wurst.position.set(0,-.66,.04); S.wurst.rotation.set(0,0,Math.PI/2); }
  if(lt>=Z.spiess&&S.wurst.parent!==S.stecken){ S.stecken.add(S.wurst); S.wurst.position.set(0,-1.62,0); S.wurst.rotation.set(0,0,0); }
  if(lt>=Z.spiess){ S.wurst.rotation.y=t*.8; S.wm.color.set('#c98a5a').lerp(new THREE.Color('#6e3818'),clampN((lt-Z.spiess)/20,0,1)); } else S.wm.color.set('#c98a5a');
  // Funken beim Schlagen
  const fu=lt>=Z.funken[0]&&lt<Z.zund; S.funken.forEach((s,i)=>{ s.visible=fu&&Math.random()<.35; if(s.visible) s.position.set(S.fp.x+(Math.random()-.5)*.5,S.fp.y+.2+Math.random()*.4,S.fp.z+(Math.random()-.5)*.5); });
  // du: schaust zu Friedel, beim Blick auf den Jungfernsprung in die Ferne, lachst bei „gemütlicher Tag“
  const I=S.ich[meinK]; if(lt>=25) blick(I,S.fp.x+S.D.x*50,S.fp.z+S.D.z*50); else blick(I,F.G.position.x,F.G.position.z);
  I.G.position.y=S.sA.y-.19+(lt>=20.5&&lt<22.5?.025*Math.abs(Math.sin(t*14)):0); dreh(I.arme[0],'x',-.55); dreh(I.arme[1],'x',lt>=22.5&&lt<24?-1.6:-.55); // lacht, winkt ab
  // Sprechblase über Friedel, sonst unten im Bild
  const txt=spr?kText(spr[2]):null, el=document.getElementById('triSag'), hp=F.kopf.getWorldPosition(new THREE.Vector3()); hp.y+=.45; let im=false;
  if(txt){ triSag('friedel',txt); const q=hp.clone().project(camera); im=q.z<1&&Math.abs(q.x)<.9&&Math.abs(q.y)<.9; }
  S.blase.visible=!!txt&&im&&ab<.5; if(S.blase.visible){ triBlaseText(S.blase,txt); triBlaseUeber(S.blase,hp,null); }
  if(el&&txt&&!im&&ab<.5){ el.textContent='Friedel: '+txt; el.classList.add('zeig'); } }

// ---- Kamera (aus draw): Totale vom Weg, nah ans Feuer, über deine Schulter auf Friedel, übers Feuer auf den Jungfernsprung, ihr vor der Höhle, Zoom auf den Dämonenjungen an der Ecke, hinterher auf die Kiefer ----
function ttLagerKamera(){ const k=ttLagerKam(ttLagerZeit()); if(k){ camera.position.copy(k[0]); camera.lookAt(k[1]); } }
function ttLagerKam(lt){ // [Kameraort, Blickpunkt] zur Szenenzeit – auch für dmLager (läuft vor dem Setzen der Kamera)
  const A=anim.tt, S=A&&A.lager; if(!S||lt<0) return null; const {fp,W,D,sA,sB,kn}=S, up=new THREE.Vector3(0,1,0);
  const Q=(b,w,d,h)=>b.clone().addScaledVector(W,w).addScaledVector(D,d).addScaledVector(up,h), weg=(a,b,m,h)=>a.clone().add(a.clone().sub(b).setY(0).normalize().multiplyScalar(m)).addScaledVector(up,h);
  const DL=A.daemon&&A.daemon.lager, dk=DL&&DL.kopf, u=dk&&Q(fp,0,-4.5,1.1).sub(dk).setY(0).normalize(), vor=(m,h)=>dk.clone().addScaledVector(u,m).addScaledVector(up,h), bl=()=>DL.blick.clone(); // Dämonenjunge: Kopfhöhe an der Höhlenecke, Blick wie übers Feuer · bl: sein Kopf jetzt (dmLager)
  const sch=a=>{ const v=a.clone().sub(sB).setY(0).normalize().multiplyScalar(.7); return v.add(sA.clone().sub(fp).setY(0).normalize().multiplyScalar(.5)).add(sA).addScaledVector(up,1.55); }; // über deine Schulter
  const K=[[0,Q(fp,9,-5,3.4),Q(fp,0,0,.8),Q(fp,7.5,-4,2.8),Q(fp,0,0,.8)], // Totale vom Weg: Lager, Höhle, ihr zwei
    [3,weg(fp,kn,2.2,1),kn.clone().lerp(fp,.4).addScaledVector(up,.5),weg(fp,kn,1.8,.9),kn.clone().lerp(fp,.5).addScaledVector(up,.45)], // nah am Feuer: Friedel schlägt Funken, pustet
    [12,sch(sA),sB.clone().addScaledVector(up,1),sch(sA).lerp(sB,.12),sB.clone().addScaledVector(up,1)], // über deine Schulter auf Friedel mit der Wurst
    [25,Q(fp,0,-4.5,1.1),Q(fp,0,60,5),Q(fp,0,-3.8,1),Q(fp,0,60,5)], // übers Feuer auf den Jungfernsprung im Sonnenuntergang
    ...(dk?[[33,Q(fp,9,-1.5,1.4),fp.clone().lerp(dk,.45),Q(fp,8.5,.5,1.7),fp.clone().lerp(dk,.5)], // ihr am Feuer vor der Höhle, an der Ecke lugt der Dämonenjunge vor (dmLager)
      [42,Q(fp,8.5,.5,1.7),fp.clone().lerp(dk,.5),vor(1.2,.1),bl()], // Zoom auf sein Gesicht hinter der Ecke
      [DM_LAGER.flitz,vor(1.2,.1),bl(),DL.kam.clone(),bl()]] // er flitzt auf die Kiefer, Kamera zur Seite und hinauf hinterher, Bild aus
    :[[42,Q(fp,6,-3,2.2),Q(fp,0,0,.6),Q(fp,14,-8,8),Q(fp,0,10,2)]])]; // ohne Dämon: langsam zurück und hinauf
  let i=0; while(i<K.length-1&&lt>=K[i+1][0]) i++; const [a,p0,l0,p1,l1]=K[i], b=i<K.length-1?K[i+1][0]:TT_LAGER.halt, w=bSm(Math.min(1,(lt-a)/(b-a)));
  return [p0.lerp(p1,w),l0.lerp(l1,w)]; }
