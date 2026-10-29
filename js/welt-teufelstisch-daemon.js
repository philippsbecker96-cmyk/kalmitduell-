/* ================= Teufelstisch (Kampagne, Mission 2) – der Dämonenjunge in den Teufelsjagden =================
   Vom Nutzer: ein uralter Dämon im Körper eines Jungen aus alter Zeit – grauschwarze Jacke mit Goldknöpfen, breiter weißer Kragen, kurze Hosen, Kniestrümpfe, Schnallenschuhe;
   blaue Augen, bei Wut rot mit Schlitzpupillen (dmAugen). Huscht auf allen vieren, klettert wie eine Spinne. Ob er zum Teufel gehört, bleibt offen. Kein Ton, kein Text.
   Flucht 1 (unheimlich, feste Auftritte DM_J1): guckt hinter einem Baum vor, flitzt vor euch über den Weg, sitzt reglos auf einem Felsen und dreht nur den Kopf mit.
   Flucht 2 (Slapstick, feste Reihenfolge DM_J2 nach den drei Stücken „Flucht 2“): Zickzack, Baum-Teleport, Baumspinne (stürzt sich vom Ast auf dich, steckt kopfüber im Boden, zappelt, kippt um),
   neben dir gegen den Baum · Hochrad (DM_RAD, 40 s hinter euch, zieht neben dich und Friedel, Sturz über den Lenker), Stein mit Rückwärtssalto, Friedels Wurstladung ·
   im „Dreizack“ Rollschuh-Lasso (DM_LASSO: Schlinge um deinen Sattel, du gehst dafür aus dem Sattel: dmStehen → rideState, er hängt wie ein Wasserskifahrer hinter dir, schwingt weiter aus und duckt sich,
   je mehr du über dem Soll trittst) · hinterher mit Bauchklatscher, „Halt!“ mitten auf dem Weg (ihr weicht rechts und links aus: dmHaltW → ttSpur und Friedels Spur, er wirbelt wie ein Kreisel).
   Dazwischen kurze Huscher am Rand (DM.husch). Auftritte starten nicht während der Rückblicke des Teufels (teufelSkript → kam), das Lasso schon. Eigene Bäume und Felsen (dmBaum, dmFels) nur während eines Auftritts sichtbar.
   buildDaemon aus buildTeufelstisch · poseDaemon aus poseTeufelstisch (über sicher) */

const DM_J1=[['guck',.15],['quer',.48],['fels',.8]]; // Flucht 1: Auftritt, Anteil der Flucht
const DM_J2=[[0,[['zick',0],['tele',.22],['spinne',.45],['neben',.72]]],[1,[['hochrad',.12],['stein',.7],['friedel',.84]]],[2,[['hinter',.08],['halt',.45]]]]; // Flucht 2 (vom Nutzer: fest): [Stück „Flucht 2“ (0 … 2), [Auftritt, Anteil des Stücks]] – dazu das Lasso im „Dreizack“
const DM={j1:[6,6], j2:[4,3], husch:[5,10], max:{x:30, hochrad:60, lasso:50, halt:35}}; // Flucht 1/2: so viele s nach dem Sprung des Teufels los, so viele s vor dem Ende (Flucht 2: vor dem Schlusssprint) Schluss · Huscher alle so viele s (zufällig) · ein Auftritt höchstens so viele s
const DM_RAD={r:.38, kurbel:.07, dauer:40, neben:[13,26]}; // Hochrad: Radius Vorderrad, Kurbellänge · fährt so viele s mit · zieht ab diesen s kurz neben dich, dann neben Friedel
const DM_LASSO={vor:7, seil:4}; // Rollschuh-Lasso: kommt so viele s vor dem „Dreizack“ · Seillänge (m)
// Haltungen: y Hüfthöhe · l Rumpf vor · lz Rumpf seitlich · k Kopf [nicken, drehen, neigen] · a Arme [vor, seitlich] · b Beine [Hüfte, Knie] · sp Beine gespreizt
const DM_STEH={y:.52, l:0, k:[0,0], a:[[0,-.08],[0,.08]], b:[[0,0],[0,0]]};
const DM_SITZ={y:.5, l:-.05, k:[.1,0], a:[[-.55,-.1],[-.55,.1]], b:[[-1.5,1.5],[-1.5,1.5]]};
const DM_LAUER={y:.26, l:1.15, k:[-1.05,0], a:[[-1.25,-.25],[-1.25,.25]], b:[[-1.9,2.5],[-1.9,2.5]], sp:.35}; // geduckt auf allen vieren, sprungbereit
const DM_HECHT={y:.15, l:1.5, k:[-1.25,0], a:[[-3,-.25],[-3,.25]], b:[[1.35,.15],[1.35,.15]], sp:.2}; // lang gestreckt, Arme voraus – auch der Bauchklatscher
const DM_PLATT={y:.52, l:-.1, k:[-.1,0], a:[[-2.7,-.7],[-2.7,.7]], b:[[0,0],[0,0]], sp:.25}; // klebt am Baumstamm
const DM_DUSEL={y:.13, l:-.25, k:[.2,0], a:[[.15,-.5],[.15,.5]], b:[[-1.5,.1],[-1.5,.1]], sp:.3}; // sitzt benommen auf dem Boden
const DM_HANG={y:.22, l:0, k:[0,0], a:[[-3.1,-.15],[-3.1,.15]], b:[[-1.2,2.4],[-1.2,2.4]]}; // kopfüber am Ast (Figur um 180° gedreht), Kniekehlen über dem Ast
const DM_RADP={y:.9, l:.3, k:[-.25,0], a:[[-.8,-.18],[-.8,.18]], b:[[-1,1],[-1,1]]}; // auf dem Hochrad (Beine: dmBeinIK zu den Pedalen)
const DM_SKI={y:.55, l:-.35, k:[.3,0], a:[[-1.25,-.1],[-1.25,.1]], b:[[-.35,.6],[-.1,.35]]}, DM_SKI_TIEF={y:.41, l:-.15, k:[.15,0], a:[[-1.45,-.1],[-1.45,.1]], b:[[-1.1,1.6],[-.95,1.45]]}; // am Seil wie ein Wasserskifahrer, aufrecht / tief geduckt
const dmKrabbel=(phi,m)=>{ const s=Math.sin(phi)*m, c=Math.max(0,Math.cos(phi))*m; return {y:.3+.03*Math.abs(s), l:1.25, k:[-1.15,0], a:[[-1.3+.55*s,-.3],[-1.3-.55*s,.3]], b:[[-1.7-.6*s,2.2-.4*c],[-1.7+.6*s,2.2-.4*Math.max(0,-Math.cos(phi))*m]], sp:.45}; }; // insektenhaft gespreizt

// ---- Aufbau (aus buildTeufelstisch) ----
function buildDaemon(A){ const M=c=>lam(c), G=new THREE.Group(), H=new THREE.Group(), T=new THREE.Group(), K=new THREE.Group(), V=THREE;
  const box=(P,w,h,d,m,x,y,z)=>{ const b=new V.Mesh(new V.BoxGeometry(w,h,d),m); b.position.set(x,y,z); P.add(b); return b; }, kug=(P,r,m,x,y,z)=>{ const b=new V.Mesh(new V.SphereGeometry(r,10,8),m); b.position.set(x,y,z); P.add(b); return b; };
  const jacke=M('#2f2d30'), hose=M('#3b393c'), weiss=M('#f2efe8'), gold=M('#d9ab2e'), haut=M('#ecdccf'), schuh=M('#141212'), haar=M('#2b1d14'), dunkel=M('#3a2a24');
  G.rotation.order='YXZ'; G.add(H); H.add(T); G.userData.ohneBoden=true; G.visible=false; world.add(G);
  const zyl=(P,r1,r2,h,m,y)=>{ const c=new V.Mesh(new V.CylinderGeometry(r1,r2,h,10),m); c.position.y=y; P.add(c); return c; };
  const beine=[]; for(const x of [-.062,.062]){ const b=new V.Group(); b.position.x=x; H.add(b); zyl(b,.052,.058,.22,hose,-.1); const kn=new V.Group(); kn.position.y=-.24; b.add(kn);
    zyl(kn,.036,.03,.24,weiss,-.12); const sh=kug(kn,.045,schuh,0,-.26,.03); sh.scale.set(.95,.7,1.8); box(kn,.035,.025,.01,gold,0,-.25,.105); beine.push({b,kn}); } // Kniestrümpfe, Schnallenschuhe (rund wie bei Fahrer und Friedel)
  const ja=new V.Mesh(new V.CylinderGeometry(.1,.118,.42,14),jacke); ja.position.y=.2; T.add(ja); const sch=new V.Mesh(new V.SphereGeometry(.1,14,8,0,Math.PI*2,0,Math.PI/2),jacke); sch.scale.y=.45; sch.position.y=.41; T.add(sch); // runde Schultern
  for(let i=0;i<4;i++){ const y=.06+i*.085; kug(T,.015,gold,0,y,.121-.018*y/.42); } // Goldknöpfe
  const kr=new V.Mesh(new V.CylinderGeometry(.15,.11,.035,14),weiss); kr.position.y=.43; T.add(kr); for(const s of [-1,1]){ const l=box(T,.08,.065,.012,weiss,s*.042,.4,.105); l.rotation.set(-.35,0,s*.5); } // breiter weißer Kragen
  const hals=new V.Mesh(new V.CylinderGeometry(.045,.05,.07,8),haut); hals.position.y=.44; T.add(hals);
  K.position.y=.47; T.add(K); const kopf=kug(K,.115,haut,0,.11,0); kopf.scale.y=1.08;
  const hr=new V.Mesh(new V.SphereGeometry(.123,12,8,0,Math.PI*2,0,Math.PI*.5),haar); hr.position.set(0,.13,-.012); K.add(hr); const st=box(K,.17,.035,.045,haar,.02,.185,.085); st.rotation.z=.15; // Scheitel, Pony
  const irisM=new V.MeshBasicMaterial({color:'#2e7bff'}), schwarz=new V.MeshBasicMaterial({color:'#050505'}), pup=[], brau=[];
  for(const x of [-.042,.042]){ const w=kug(K,.024,weiss,x,.115,.106); w.scale.z=.5; const ir=new V.Mesh(new V.CircleGeometry(.016,12),irisM); ir.position.set(x,.115,.119); K.add(ir);
    const p=new V.Mesh(new V.CircleGeometry(.008,10),schwarz); p.position.set(x,.115,.1205); K.add(p); pup.push(p); const b=box(K,.045,.01,.01,haar,x,.15,.112); brau.push(b); }
  const mund=box(K,.045,.008,.01,dunkel,0,.055,.104), zahn=box(K,.07,.014,.006,weiss,0,.055,.103); zahn.visible=false;
  const arme=[]; for(const x of [-.14,.14]){ const a=new V.Group(); a.position.set(x,.37,0); T.add(a); kug(a,.042,jacke,0,0,0); const c=new V.Mesh(new V.CylinderGeometry(.037,.033,.3,10),jacke); c.position.y=-.15; a.add(c);
    const m=new V.Mesh(new V.CylinderGeometry(.036,.036,.03,10),weiss); m.position.y=-.3; a.add(m); kug(a,.034,haut,0,-.34,0); arme.push(a); }
  const rollen=beine.map(B=>{ const S=new V.Group(); S.position.y=-.3; B.kn.add(S); box(S,.07,.018,.19,M('#6b4a2a'),0,0,.03); for(const zz of [-.04,.1]) for(const xx of [-.035,.035]){ const w=new V.Mesh(new V.CylinderGeometry(.022,.022,.018,8),M('#2a2a2a')); w.rotation.z=Math.PI/2; w.position.set(xx,-.025,zz); S.add(w); } S.visible=false; return S; }); // alte Rollschuhe (Holz, vier Rollen)
  const seilM=M('#b89a6a'), seil=new V.Mesh(new V.CylinderGeometry(.01,.01,1,5),seilM), schlinge=new V.Mesh(new V.TorusGeometry(.28,.012,5,20),seilM), stein=new V.Mesh(new V.DodecahedronGeometry(.18,0),new V.MeshLambertMaterial({map:felsTex()}));
  for(const o of [seil,schlinge,stein]){ o.visible=false; o.userData.ohneBoden=true; world.add(o); }
  // Requisiten: Bäume (Baum 0 mit Ast für die Baumspinne), Fels, Sternchen, Staub
  const stamm=M('#5e4130'), nadel=[M('#2f4a2a'),M('#3a5530')], baeume=[0,1,2].map(k=>{ const B=new V.Group(); B.userData.ohneBoden=true; B.visible=false; world.add(B);
    const s=new V.Mesh(new V.CylinderGeometry(.3,.42,11,8),stamm); s.position.y=5.5; B.add(s); for(let j=0;j<3;j++){ const c=new V.Mesh(new V.ConeGeometry(2.3-.55*j,3.2,8),nadel[j%2]); c.position.y=7.6+j*1.7; B.add(c); }
    const ast=new V.Group(); ast.position.y=3.4; B.add(ast); const ac=new V.Mesh(new V.CylinderGeometry(.09,.13,1,6),stamm); ac.rotation.z=-Math.PI/2; ac.position.x=.5; ast.add(ac); ast.visible=false; B.userData.ast=ast; return B; });
  const fels=new V.Mesh(new V.DodecahedronGeometry(.75,0),new V.MeshLambertMaterial({map:felsTex()})); fels.scale.set(1.15,.65,.95); fels.userData.ohneBoden=true; fels.visible=false; world.add(fels);
  const sp=(tex,s)=>{ const o=new V.Sprite(new V.SpriteMaterial({map:tex,transparent:true,depthWrite:false})); o.scale.set(s,s,1); o.visible=false; o.userData.ohneBoden=true; world.add(o); return o; };
  const sTex=canvasTex(64,64,g=>{ g.fillStyle='#ffe14a'; g.strokeStyle='#8a6a00'; g.lineWidth=3; g.beginPath(); for(let i=0;i<10;i++){ const r=i%2?12:29, a=i*Math.PI/5-Math.PI/2; g.lineTo(32+r*Math.cos(a),32+r*Math.sin(a)); } g.closePath(); g.fill(); g.stroke(); });
  const dTex=canvasTex(64,64,g=>{ const r=g.createRadialGradient(32,32,2,32,32,30); r.addColorStop(0,'rgba(150,125,95,.85)'); r.addColorStop(1,'rgba(150,125,95,0)'); g.fillStyle=r; g.fillRect(0,0,64,64); });
  A.daemon={G,H,T,K,arme,beine,pup,brau,mund,zahn,irisM,baeume,fels,rollen,seil,schlinge,stein,rad:dmRadBau(V,M), sterne:[0,1,2].map(()=>sp(sTex,.16)), staub:[...Array(8)].map(()=>sp(dTex,1)), puff:[], phi:0, wut:0, grins:0, akt:null}; }

// ---- Hilfen ----
function dmPose(D,P){ D.H.position.y=P.y; D.T.rotation.set(P.l,0,P.lz||0); D.K.rotation.set(P.k[0],P.k[1],P.k[2]||0); D.arme.forEach((a,i)=>a.rotation.set(P.a[i][0],0,P.a[i][1]));
  D.beine.forEach((B,i)=>{ B.b.rotation.set(P.b[i][0],0,P.sp?(i?P.sp:-P.sp):0); B.kn.rotation.x=P.b[i][1]; }); }
const dmMix=(a,b,w)=>{ const m=(x,y)=>(x||0)+((y||0)-(x||0))*w; return {y:m(a.y,b.y), l:m(a.l,b.l), lz:m(a.lz,b.lz), sp:m(a.sp,b.sp), k:[0,1,2].map(i=>m(a.k[i],b.k[i])), a:tfMix(a.a,b.a,w), b:tfMix(a.b,b.b,w)}; };
const dmGrund=(d,u)=>{ const p=wegPos(d,u); return [p.x,bodenY(p.x,p.z),p.z]; };
const dmVor=d=>Math.PI/2-headingAt(R,d); // Blick in Fahrtrichtung
const dmRechts=d=>{ const h=headingAt(R,d); return [-Math.sin(h),Math.cos(h)]; }; // Einheitsvektor nach rechts (x, z)
const dmRw=d=>roadW(R,d)/2;
function dmMeinU(){ const ich=riders3d[myKey]; if(!ich) return 0; const p=ich.g.position, c=wegPos(me.d,0); return (p.x-c.x)*-Math.sin(c.h)+(p.z-c.z)*Math.cos(c.h); } // deine Spur (m rechts der Mitte)
function dmKopfZu(D,max){ const ich=riders3d[myKey]; if(!ich) return 0; D.G.updateMatrixWorld(true); const k=D.K.getWorldPosition(new THREE.Vector3()), p=ich.g.position, w=Math.atan2(p.x-k.x,p.z-k.z)-D.G.rotation.y; return clampN(Math.atan2(Math.sin(w),Math.cos(w)),-max,max); }
function dmBaum(D,k,d,u,ast){ const B=D.baeume[k], g=dmGrund(d,u), [rx,rz]=dmRechts(d), s=u<0?1:-1; B.position.set(g[0],g[1]-.2,g[2]); B.rotation.y=Math.atan2(-s*rz,s*rx); B.visible=true; // Ast zeigt zum Weg
  const A=B.userData.ast; A.visible=ast>0; if(ast>0) A.scale.x=ast; return {x:g[0],y:g[1],z:g[2],dx:s*rx,dz:s*rz}; }
function dmFels(D,d,u){ const g=dmGrund(d,u); D.fels.position.set(g[0],g[1]-.15,g[2]); D.fels.visible=true; return g[1]+.34; } // Sitzhöhe
function dmRadBau(V,M){ const G=new V.Group(), Z=DM_RAD, sw=M('#232325'), ch=M('#a8aaae'), le=M('#4a2c18'); G.rotation.order='YXZ'; G.visible=false; G.userData.ohneBoden=true; world.add(G); // Hochrad (Bild vom Nutzer)
  const stab=(a,b,r,m)=>{ const p=new V.Vector3(...a), d=new V.Vector3(...b).sub(p), o=new V.Mesh(new V.CylinderGeometry(r,r,d.length(),6),m); o.position.copy(p).addScaledVector(d,.5); o.quaternion.setFromUnitVectors(new V.Vector3(0,1,0),d.normalize()); G.add(o); return o; };
  const rad=(r,n,y,z)=>{ const W=new V.Group(), I=new V.Group(); W.position.set(0,y,z); I.rotation.y=Math.PI/2; W.add(I); G.add(W); I.add(new V.Mesh(new V.TorusGeometry(r,r>.2?.02:.013,6,28),sw));
    for(let i=0;i<n;i++){ const s=new V.Mesh(new V.CylinderGeometry(.004,.004,2*r,3),ch); s.rotation.z=i*Math.PI/n; I.add(s); } const nb=new V.Mesh(new V.CylinderGeometry(.03,.03,.1,8),ch); nb.rotation.x=Math.PI/2; I.add(nb); return W; };
  const vorn=rad(Z.r,16,Z.r,0), hinten=rad(.11,8,.11,-.74);
  for(const s of [-1,1]){ const k=new V.Mesh(new V.BoxGeometry(.015,Z.kurbel,.02),ch); k.position.set(s*.07,s*Z.kurbel/2,0); vorn.add(k); const p=new V.Mesh(new V.BoxGeometry(.06,.015,.035),sw); p.position.set(s*.1,s*Z.kurbel,0); vorn.add(p); } // Tretkurbeln an der Vorderradnabe
  for(const s of [-1,1]) stab([s*.05,Z.r,0],[0,.86,-.02],.014,sw); stab([0,.86,-.02],[0,.93,.05],.017,sw); stab([-.2,.93,.06],[.2,.93,.06],.011,ch); for(const s of [-1,1]) stab([s*.24,.93,.06],[s*.19,.93,.06],.02,le); // Gabel, Vorbau, Lenker, Griffe
  G.add(new V.Mesh(new V.TubeGeometry(new V.CatmullRomCurve3([[0,.86,-.03],[0,.82,-.27],[0,.62,-.5],[0,.35,-.67],[0,.11,-.74]].map(p=>new V.Vector3(...p))),24,.02,6),sw)); // geschwungener Rahmen
  const sa=new V.Mesh(new V.BoxGeometry(.09,.035,.17),le); sa.position.set(0,.875,-.11); G.add(sa); return {G,vorn,hinten}; }
function dmBeinIK(B,dy,dz){ const L1=.24, L2=.29, l=Math.min(Math.hypot(dy,dz),L1+L2-.002), th=Math.atan2(dz,dy), al=Math.acos(clampN((L1*L1+l*l-L2*L2)/(2*L1*l),-1,1)), kn=Math.acos(clampN((L1*L1+L2*L2-l*l)/(2*L1*L2),-1,1));
  B.b.rotation.x=-(th+al); B.kn.rotation.x=Math.PI-kn; } // Fuß zum Punkt dy unter, dz vor der Hüfte (Knie nach vorn)
function dmRadStell(D,d,u,roll,pitch,phi){ const g=dmGrund(d,u), Rd=D.rad, ry=dmVor(d), Z=DM_RAD; Rd.G.visible=true; Rd.G.position.set(...g); Rd.G.rotation.set(pitch,ry,roll); D.G.position.set(...g); D.G.rotation.set(pitch,ry,roll);
  Rd.vorn.rotation.x=phi; Rd.hinten.rotation.x=phi*Z.r/.11; dmPose(D,DM_RADP); D.H.position.z=-.11; D.beine.forEach((B,i)=>{ const c=(i?-1:1)*Z.kurbel; dmBeinIK(B,DM_RADP.y-(Z.r-c*Math.cos(phi)),-c*Math.sin(phi)+.11); }); } // tritt die Pedale an der Nabe
function dmSeil(o,p,q){ const d=q.clone().sub(p), l=d.length(); o.position.copy(p).addScaledVector(d,.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); o.scale.set(1,l,1); o.visible=true; }
function dmHand(D,i){ D.G.updateMatrixWorld(true); return D.arme[i].localToWorld(new THREE.Vector3(0,-.34,0)); }
function dmSattel(){ const ich=riders3d[myKey], h=headingAt(R,me.d); if(!ich) return null; const p=ich.g.position; return new THREE.Vector3(p.x-Math.cos(h)*.3,p.y+.93,p.z-Math.sin(h)*.3); } // dein Sattel (Weltpunkt)
const dmLane=()=>{ const ich=riders3d[myKey]; return ich&&ich.lane!=null?ich.lane:dmMeinU(); }, dmFrLane=()=>{ const F=anim.tt.friedel; return F&&F.r.lane!=null?F.r.lane:dmLane()-1.25; };
function dmPuff(D,x,y,z){ D.puff.push({t:performance.now()/1000,x,y,z}); if(D.puff.length>2) D.puff.shift(); }
function dmHinter(D,B,w,lehn){ const G=D.G, f=dmRechts(B.d), fx=f[1], fz=-f[0]; // hinter dem Stamm versteckt (vom Fahrer aus), lehnt sich um w zur Wegseite heraus
  G.position.set(B.x+fx*.5+B.dx*.18*w,bodenY(B.x+fx*.5,B.z+fz*.5),B.z+fz*.5+B.dz*.18*w); G.rotation.set(0,dmVor(B.d)+Math.PI,0); const lx=Math.cos(G.rotation.y)*B.dx-Math.sin(G.rotation.y)*B.dz; // Wegseite in Körperkoordinaten
  dmPose(D,{...DM_STEH, lz:-Math.sign(lx)*lehn*w, k:[.05,0,-Math.sign(lx)*.25*w], a:[[-.4*w,-.1],[-.4*w,.1]]}); D.K.rotation.y=dmKopfZu(D,1.4)*w; }

// ---- Auftritte: f(D,a,y) mit y = s seit Beginn, setzt a.ende ----
const DM_AKT={
  // Flucht 1: guckt hinter einem Baum vor, zieht den Kopf zurück, ist weg
  guck(D,a){ if(!a.B){ a.d0=me.d+80; a.s=Math.random()<.5?1:-1; a.B={...dmBaum(D,0,a.d0,a.s*(dmRw(a.d0)+4),0),d:a.d0}; } dmBaum(D,0,a.d0,a.s*(dmRw(a.d0)+4),0);
    const dd=a.d0-me.d, w=bSm((48-dd)/4)*bSm((dd-17)/1.2); D.G.visible=dd<50&&dd>16; if(D.G.visible) dmHinter(D,a.B,w,.45); if(dd<-15) a.ende=1; },
  // Flucht 1: flitzt 40 m vor euch auf allen vieren über den Weg
  quer(D,a,y,rt){ if(a.d0==null){ a.d0=me.d+65; a.s=Math.random()<.5?1:-1; } const dd=a.d0-me.d, b=dmRw(a.d0)+5; if(a.t0==null&&dd<=42) a.t0=rt; if(a.t0==null){ if(dd<0) a.ende=1; return; }
    const p=(rt-a.t0)*11/(2*b); if(p>=1){ a.ende=1; return; } const g=dmGrund(a.d0,a.s*(-b+2*b*p)), [rx,rz]=dmRechts(a.d0); D.G.visible=true; D.G.position.set(...g); D.G.rotation.set(0,Math.atan2(a.s*rx,a.s*rz),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=11; },
  // Flucht 1: sitzt reglos auf einem Felsen, nur der Kopf dreht sich mit (weiter, als ein Mensch kann) – im Vorbeifahren werden die Augen kurz rot
  fels(D,a){ if(a.d0==null){ a.d0=me.d+90; a.s=Math.random()<.5?1:-1; } const u=a.s*(dmRw(a.d0)+2), h=dmFels(D,a.d0,u), g=dmGrund(a.d0,u), [rx,rz]=dmRechts(a.d0), dd=a.d0-me.d;
    D.G.visible=true; D.G.position.set(...g); D.G.rotation.set(0,Math.atan2(-a.s*rx,-a.s*rz),0); dmPose(D,{...DM_SITZ,y:h-g[1]+.05}); a.kw=(a.kw||0)+(dmKopfZu(D,2.4)-(a.kw||0))*.08; D.K.rotation.y=a.kw; D.wutZ=bSm((5-Math.abs(dd))/2);
    if(dd<-40) a.ende=1; },
  // Flucht 2: Zickzack vor euch über den Weg
  zick(D,a,y,rt){ if(a.d0==null){ a.d0=me.d+50; a.s=Math.random()<.5?1:-1; a.t0=rt; } const T=.7, k=Math.floor((rt-a.t0)/T), w=(rt-a.t0)/T-k; if(k>=4){ a.ende=1; return; }
    const pt=j=>{ const d=a.d0+7*j; return [d,(j%2?1:-1)*a.s*(dmRw(d)+3)]; }, [d1,u1]=pt(k), [d2,u2]=pt(k+1), g=dmGrund(d1+(d2-d1)*w,u1+(u2-u1)*w), g1=dmGrund(d1,u1), g2=dmGrund(d2,u2);
    D.G.visible=true; D.G.position.set(...g); D.G.rotation.set(0,Math.atan2(g2[0]-g1[0],g2[2]-g1[2]),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=13; D.grinsZ=1; D.wutZ=.6; if(w<.08&&!a['p'+k]){ a['p'+k]=1; dmPuff(D,...g1); } },
  // Flucht 2: klettert wie eine Spinne den Stamm hoch, krabbelt über den Ast, hängt kopfüber über dem Wegrand, stürzt sich auf dich – landet hinter dir auf dem Kopf, steckt, zappelt, kippt um wie ein Brett
  spinne(D,a,y,rt){ if(a.d0==null){ a.d0=me.d+70; a.s=Math.random()<.5?1:-1; } const rw=dmRw(a.d0), L=2.6, B=dmBaum(D,0,a.d0,a.s*(rw+2.2),L), dd=a.d0-me.d, G=D.G;
    if(a.t0==null&&dd<=55) a.t0=rt; if(a.t0==null){ if(dd<0) a.ende=1; return; } const z=rt-a.t0; G.visible=true; D.grinsZ=1; D.wutZ=1;
    if(z<1.1){ const h=3.05*bSm(z/1.1); G.position.set(B.x+B.dx*.42,B.y+h,B.z+B.dz*.42); G.rotation.set(-Math.PI/2,Math.atan2(-B.dx,-B.dz),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=9; return; }
    if(z<1.9){ const f=L*(z-1.1)/.8; G.position.set(B.x+B.dx*f,B.y+3.32,B.z+B.dz*f); G.rotation.set(0,Math.atan2(B.dx,B.dz),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=8; return; }
    const hp=[B.x+B.dx*L,B.y+3.1,B.z+B.dz*L], ry=dmVor(a.d0), KH=1.18; if(a.tD==null&&dd<-.3){ a.tD=rt; a.dL=me.d+me.v*.55-1; a.uL=dmLane(); } // KH: Füße so hoch über dem Boden, wenn er auf dem Kopf steckt
    if(a.tD==null){ const gr=bSm((12-dd)/6); G.position.set(...hp); G.rotation.set(Math.PI,ry,.06*Math.sin(rt*2)+.12*gr*Math.sin(rt*7)); dmPose(D,{...DM_HANG,a:[[-3.1+1.2*gr,-.15-.3*gr],[-3.1+1.2*gr,.15+.3*gr]],k:[-.2,0,.2*Math.sin(rt*1.5)]}); if(dd<-40) a.ende=1; return; } // pendelt, streckt die Arme nach dir
    const z2=rt-a.tD, gL=dmGrund(a.dL,a.uL), f=dmRechts(a.dL), fx=f[1], fz=-f[0], AU={...DM_STEH,a:[[-3.1,-.12],[-3.1,.12]]};
    if(z2<.55){ const w=z2/.55; G.position.set(hp[0]+(gL[0]-hp[0])*w,hp[1]+(gL[1]+KH-hp[1])*w+.3*Math.sin(Math.PI*w),hp[2]+(gL[2]-hp[2])*w); G.rotation.set(Math.PI-.6*Math.sin(Math.PI*w),ry+Math.PI*bSm(w),0); dmPose(D,AU); return; } // stürzt sich mit ausgestreckten Armen auf dich
    if(!a.puff){ a.puff=1; dmPuff(D,...gL); } D.grinsZ=0;
    if(z2<1.65){ G.position.set(gL[0],gL[1]+KH,gL[2]); G.rotation.set(Math.PI,ry+Math.PI,0); const k=Math.sin(rt*22), k2=Math.sin(rt*19); dmPose(D,{...DM_STEH,a:[[-1.6,-1.2+.3*k2],[-1.6,1.2-.3*k2]],b:[[.6*k,.5+.5*k2],[-.6*k,.5-.5*k2]],sp:.2}); return; } // steckt kopfüber im Boden, zappelt mit den Beinen
    const al=z2<2.15?Math.PI/2*((z2-1.65)/.5)**2:Math.PI/2; if(al>=Math.PI/2&&!a.puff2){ a.puff2=1; dmPuff(D,gL[0]-fx*KH,gL[1],gL[2]-fz*KH); } // kippt um wie ein Brett
    G.position.set(gL[0]-KH*Math.sin(al)*fx,gL[1]+KH*Math.cos(al)+.12*Math.sin(al),gL[2]-KH*Math.sin(al)*fz); G.rotation.set(Math.PI+al,ry+Math.PI,0); dmPose(D,z2<2.15?AU:{...DM_STEH,a:[[-3.1,-.4],[-3.1,.4]],b:[[.15*Math.sin(rt*9),0],[0,0]],k:[0,0,.3*Math.sin(rt*4)]}); D.sternZ=z2>2.15; D.wutZ=0;
    if(z2>6.5||me.d-a.dL>45) a.ende=1; },
  // Flucht 2: kommt seitlich aus dem Wald, rennt hinter dir her, holt auf, hechtet – und landet mit dem Bauch auf dem Weg, rutscht, sieht Sternchen
  hinter(D,a,y,rt){ const G=D.G; if(a.t0==null){ a.t0=rt; a.u0=dmRw(me.d)+3; } const z=rt-a.t0; G.visible=true; D.grinsZ=1;
    if(z<5){ const rel=-10+7.5*bSm(z/5), u=a.u0+(dmMeinU()-a.u0)*bSm(z/2.5), d=me.d+rel; G.position.set(...dmGrund(d,u)); G.rotation.set(0,dmVor(d),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=me.v/.9+3; D.wutZ=bSm((z-2)/1.5); a.dS=d; a.uS=u; return; }
    D.wutZ=1; if(a.dL==null){ a.dL=Math.min(a.dS+3.2,me.d+me.v*.6-1.3); a.tL=rt; } const w=(rt-a.tL)/.6;
    if(w<1){ const d=a.dS+(a.dL-a.dS)*w, g=dmGrund(d,a.uS); g[1]+=.9*Math.sin(Math.PI*w); G.position.set(...g); G.rotation.set(0,dmVor(d),0); dmPose(D,dmMix(DM_LAUER,DM_HECHT,bSm(w/.4))); return; }
    const r=rt-a.tL-.6, sl=Math.min(1,r/1.2), d=a.dL+2.2*(1-(1-sl)*(1-sl)); if(!a.puff){ a.puff=1; dmPuff(D,...dmGrund(a.dL,a.uS)); } G.position.set(...dmGrund(d,a.uS)); G.rotation.set(0,dmVor(d),0); // Bauchklatscher, rutscht aus
    const fl=sl<1?.4*Math.sin(r*18):0; if(r<2.6){ dmPose(D,{...DM_HECHT,a:[[-3+fl,-.25-fl],[-3-fl,.25+fl]],k:[r>1.4?-.6:-1.25,0,0]}); D.sternZ=r>1.2; } else { dmPose(D,dmMix(DM_HECHT,{...DM_DUSEL,k:[.2,0,.3*Math.sin(rt*4)]},bSm((r-2.6)/.5))); D.sternZ=true; D.grinsZ=0; D.wutZ=0; }
    if(r>5.5||me.d-d>70) a.ende=1; },
  // Flucht 2: rennt rechts neben dir her, grinst dich an – und knallt gegen einen Baum, rutscht den Stamm hinunter
  neben(D,a,y,rt,dt){ const G=D.G; if(a.d==null){ a.d=me.d+.3; a.dT=me.d+Math.max(12,me.v*4.5); a.u=dmRw(a.dT)+1.3; } const B=dmBaum(D,0,a.dT,a.u,0); G.visible=true;
    if(a.tS==null){ a.d=Math.min(Math.max(a.d+3*dt*simSpeed(),me.d+.3),a.dT-.45); if(a.d>=a.dT-.45) a.tS=rt; G.position.set(...dmGrund(a.d,a.u)); G.rotation.set(0,dmVor(a.d),0); dmPose(D,dmKrabbel(D.phi,1)); D.K.rotation.y=-1.1; D.dPhi=me.v/.9+2; D.grinsZ=1; D.wutZ=1; return; }
    const z=rt-a.tS, g=dmGrund(a.dT-.45,a.u), ry=dmVor(a.dT); if(!a.puff){ a.puff=1; dmPuff(D,B.x,B.y+.7,B.z); }
    if(z<.7){ G.position.set(...g); G.position.y+=.25; G.rotation.set(0,ry,0); dmPose(D,DM_PLATT); D.T.scale.z=.6; D.grinsZ=0; } // platt am Stamm
    else if(z<1.5){ const w=bSm((z-.7)/.8); G.position.set(...g); G.position.y+=.25*(1-w); G.rotation.set(0,ry+Math.PI*bSm((w-.6)/.4),0); dmPose(D,dmMix(DM_PLATT,DM_DUSEL,w)); } // rutscht hinunter, plumpst auf den Hintern
    else { G.position.set(...g); G.rotation.set(0,ry+Math.PI,0); dmPose(D,{...DM_DUSEL,k:[.2,0,.3*Math.sin(rt*4)]}); D.sternZ=true; }
    if(me.d-a.dT>45||z>7) a.ende=1; },
  // Flucht 2: sitzt grinsend auf einem Stein, legt den Kopf ganz schief, macht im Vorbeifahren einen Rückwärtssalto in den Wald
  stein(D,a,y,rt){ if(a.d0==null){ a.d0=me.d+75; a.s=Math.random()<.5?1:-1; } const u=a.s*(dmRw(a.d0)+1.8), h=dmFels(D,a.d0,u), g=dmGrund(a.d0,u), [rx,rz]=dmRechts(a.d0), dd=a.d0-me.d, G=D.G, ry=Math.atan2(-a.s*rx,-a.s*rz);
    G.visible=true; D.grinsZ=1; const sch=bSm((22-dd)/8); D.wutZ=sch; if(a.tF==null&&dd<-2) a.tF=rt; const f=a.tF==null?0:(rt-a.tF)/.8; if(f>=1){ a.ende=1; return; }
    if(f>0){ G.position.set(g[0]+a.s*rx*1.6*f,(h-.25)*(1-f)+g[1]*f+.9*Math.sin(Math.PI*f),g[2]+a.s*rz*1.6*f); G.rotation.set(-2*Math.PI*f,ry,0); dmPose(D,{...DM_LAUER,y:.3}); return; } // Rückwärtssalto vom Weg weg
    G.position.set(...g); G.rotation.set(0,ry,0); dmPose(D,{...DM_SITZ,y:h-g[1]+.05}); D.K.rotation.y=dmKopfZu(D,1.6); D.K.rotation.z=-1.4*sch; }, // legt den Kopf ganz schief
  // Flucht 2: guckt links hinter einem Baum vor, gleich darauf rechts hinter einem anderen – immer schneller hin und her
  tele(D,a,y,rt){ if(a.d0==null){ a.d0=me.d+65; a.s=Math.random()<.5?1:-1; } const rw=dmRw(a.d0), dd=a.d0-me.d, Bs=[{...dmBaum(D,0,a.d0,a.s*(rw+3.5),0),d:a.d0},{...dmBaum(D,1,a.d0+4,-a.s*(rw+3.5),0),d:a.d0+4}];
    if(a.t0==null&&dd<=55) a.t0=rt; if(dd<-20) a.ende=1; if(a.t0==null) return; const P=[[0,1.1],[1.35,2.3],[2.55,3.3],[3.5,4.1],[4.25,4.75],[4.9,5.35],[5.5,6]], z=rt-a.t0, i=P.findIndex(([p,q])=>z>=p&&z<q);
    D.grinsZ=1; D.wutZ=.7; if(i<0) return; const [p,q]=P[i], w=bSm((z-p)/.15)*bSm((q-z)/.15); D.G.visible=true; dmHinter(D,Bs[i%2],w,.55); },
  // Flucht 2: lauert links am Weg, springt Friedel auf die Wurstladung, reitet mit, wird abgeworfen, purzelt auf den Weg
  friedel(D,a,y,rt){ const Fr=anim.tt.friedel, G=D.G; if(!Fr||!Fr.r.g.visible){ a.ende=1; return; } const fp=Fr.r.g.position, fd=Fr.d||me.d, f0=wegPos(fd,0), f1=wegPos(fd+1,0), fx=f1.x-f0.x, fz=f1.z-f0.z, n=Math.hypot(fx,fz)||1;
    const rack=[fp.x-fx/n*.75,fp.y+1.05,fp.z-fz/n*.75]; if(a.d0==null){ a.d0=me.d+30; a.u=-(dmRw(a.d0)+1.2); } G.visible=true; D.grinsZ=1; D.wutZ=1;
    if(a.tJ==null){ const g=dmGrund(a.d0,a.u); G.position.set(...g); G.rotation.set(0,Math.atan2(fp.x-g[0],fp.z-g[2]),0); dmPose(D,{...DM_LAUER,y:.26+.02*Math.sin(rt*9)}); if(fd>=a.d0-3.5) { a.tJ=rt; a.pJ=g; } if(fd>a.d0+5) a.ende=1; return; }
    const z=rt-a.tJ, ry=Math.atan2(fx,fz);
    if(z<.45){ const w=z/.45; G.position.set(a.pJ[0]+(rack[0]-a.pJ[0])*w,a.pJ[1]+(rack[1]-a.pJ[1])*w+.8*Math.sin(Math.PI*w),a.pJ[2]+(rack[2]-a.pJ[2])*w); G.rotation.set(0,ry,0); dmPose(D,DM_HECHT); D.H.position.y=.4; return; }
    if(z<3){ G.position.set(rack[0],rack[1]+.04*Math.abs(Math.sin(rt*14)),rack[2]); G.rotation.set(0,ry,0); dmPose(D,{...DM_SITZ,y:.12,a:[[-2.6+.5*Math.sin(rt*12),-.4],[-.7,.2]],k:[.1,.4*Math.sin(rt*5),0]}); a.pF=[...rack]; a.dF=fd; return; } // reitet mit, winkt wild
    const w=(z-3)/.8, gL=dmGrund(a.dF-2.5,-(dmRw(a.dF)-.6)); if(!a.puffF&&w>=1){ a.puffF=1; dmPuff(D,...gL); }
    if(w<1){ G.position.set(a.pF[0]+(gL[0]-a.pF[0])*w,a.pF[1]+(gL[1]-a.pF[1])*w+1.2*Math.sin(Math.PI*w),a.pF[2]+(gL[2]-a.pF[2])*w); G.rotation.set(-2.5*Math.PI*w,ry,0); dmPose(D,{...DM_SITZ,y:.3,a:[[-2.8,-.8],[-2.8,.8]]}); D.grinsZ=0; return; } // abgeworfen, überschlägt sich
    G.position.set(...gL); G.rotation.set(0,ry+Math.PI,0); dmPose(D,{...DM_DUSEL,k:[.2,0,.3*Math.sin(rt*4)]}); D.sternZ=true; D.grinsZ=0; D.wutZ=0; if(z>7.5||me.d-a.dF>60) a.ende=1; },
  // Flucht 2: kommt auf einem Hochrad von hinten, fährt 40 s hinter euch her, zieht kurz neben dich und neben Friedel – bleibt an einem Stein hängen, fliegt über den Lenker ins Gebüsch, das Rad rollt allein weiter und kippt um
  hochrad(D,a,y,rt,dt){ const G=D.G, Z=DM_RAD, z=rt-a.rt0, mu=dmLane(), fu=dmFrLane(); D.grinsZ=1; D.wutZ=.8;
    if(z<Z.dauer){ const ein=bSm(z/5), n1=bSm((z-Z.neben[0])/2)*bSm((Z.neben[0]+5-z)/2), n2=bSm((z-Z.neben[1])/2)*bSm((Z.neben[1]+5-z)/2), rand=dmRw(me.d)+2.5; // kommt von hinten aus dem Wald
      let rel=-25+(-4.2+.5*Math.sin(z*.8)+25)*ein, u=rand+((mu+fu)/2+.3*Math.sin(z*.9)-rand)*ein; rel+=(.3-rel)*Math.max(n1,n2); u+=(mu+1.1-u)*n1+(fu-1.1-u)*n2; // mittig hinter euch, eiert
      a.d=me.d+rel; a.u=u; a.phi=(a.phi||0)+me.v*dt/Z.r; G.visible=true; dmRadStell(D,a.d,u,.07*Math.sin(z*2.3),0,a.phi); if(n1+n2>.3) D.K.rotation.y=dmKopfZu(D,1.3); return; }
    if(a.tC==null){ a.tC=rt; a.dC=a.d; a.uC=a.u; a.vC=me.v; } const s=rt-a.tC, rw=dmRw(a.dC); D.stein.visible=true; { const g=dmGrund(a.dC+.45,a.uC); D.stein.position.set(g[0],g[1]+.05,g[2]); }
    const dB=a.dC+Math.min(1.8,a.vC*.3)*(s<.35?s/.35:1)+3*(1-Math.exp(-Math.max(0,s-.35)*1.3)), pit=s<.35?.95*bSm(s/.35):s<.8?.95*(1-bSm((s-.35)/.45)):0, kipp=1.45*bSm((s-1.6)/.5); // Rad: überschlägt sich halb, rollt weiter, kippt um
    a.phi+=dt*Math.max(0,(a.vC||0)*Math.exp(-s*1.3))/Z.r; { const g=dmGrund(dB,a.uC), Rd=D.rad; Rd.G.visible=true; Rd.G.position.set(...g); Rd.G.rotation.set(pit,dmVor(dB),kipp); Rd.vorn.rotation.x=a.phi; Rd.hinten.rotation.x=a.phi*Z.r/.11; }
    if(s<.9){ const w=s/.9, p0=dmGrund(a.dC,a.uC), gL=dmGrund(a.dC+4.5,rw+2.8); G.visible=true; G.position.set(p0[0]+(gL[0]-p0[0])*w,p0[1]+(gL[1]-.4-p0[1])*w+1.7*Math.sin(Math.PI*w),p0[2]+(gL[2]-p0[2])*w); G.rotation.set(2.4*Math.PI*w,dmVor(a.dC),0);
      dmPose(D,{...DM_SITZ,y:.9,a:[[-2.8,-.8],[-2.8,.8]],b:[[-1.5+.6*Math.sin(rt*20),1.2],[-1.5-.6*Math.sin(rt*20),1.2]]}); D.grinsZ=0; D.wutZ=0; return; } // fliegt über den Lenker, strampelt in der Luft
    if(!a.puff){ a.puff=1; dmPuff(D,...dmGrund(a.dC+4.5,rw+2.8)); } if(s>6||me.d-a.dC>60) a.ende=1; },
  // Flucht 2: steht mitten auf dem Weg, Arme nach vorn: Halt! – du weichst rechts aus, Friedel links (dmHaltW), der Luftzug wirbelt ihn wie einen Kreisel, er torkelt und plumpst hin
  halt(D,a,y,rt){ const G=D.G; if(a.d0==null) a.d0=me.d+110; const dd=a.d0-me.d, g=dmGrund(a.d0,0), ry=dmVor(a.d0)+Math.PI; G.visible=true; if(a.tW==null&&dd<=.3) a.tW=rt;
    if(a.tW==null){ const st=Math.max(0,Math.sin(rt*4.5))**3; G.position.set(...g); G.rotation.set(0,ry,0); dmPose(D,{...DM_STEH,a:[[-1.55,-.15],[-1.55,.15]],b:[[0,0],[-.6*st,.9*st]],k:[.05,0,.12*Math.sin(rt*3)],lz:.04*Math.sin(rt*4.5)}); D.wutZ=1; if(dd<-20) a.ende=1; return; } // stampft mit dem Fuß
    const s=rt-a.tW, th=24/.75*(1-Math.exp(-.75*s)), [rx,rz]=dmRechts(a.d0); D.wutZ=0; G.position.set(...g);
    if(s<3.4){ const o=bSm(s/.3); G.rotation.set(0,ry+th,.08); dmPose(D,{...DM_STEH,a:[[-.1,-1.5*o],[-.1,1.5*o]],k:[-.1,0,.3],lz:.1}); } // wirbelt wie ein Kreisel, die Arme fliegen nach außen
    else if(s<4.8){ const q=s-3.4, x=.35*Math.sin(q*4); G.position.x+=rx*x; G.position.z+=rz*x; G.rotation.set(0,ry+th+.5*Math.sin(q*3),.25*Math.sin(q*5)); dmPose(D,{...DM_STEH,a:[[-.3,-.8],[-.3,.8]],b:[[.3*Math.sin(q*6),.2],[-.3*Math.sin(q*6),.2]],k:[.2,0,.4*Math.sin(q*4)]}); D.sternZ=true; } // torkelt
    else { const w=bSm((s-4.8)/.35); G.rotation.set(0,ry+th,0); dmPose(D,dmMix(DM_STEH,{...DM_DUSEL,k:[.2,0,.3*Math.sin(rt*4)]},w)); D.sternZ=true; if(w>=1&&!a.puff){ a.puff=1; dmPuff(D,...g); } } // plumpst auf den Hintern
    if(me.d-a.d0>60||s>10) a.ende=1; },
  // Flucht 2, „Dreizack“: rollt auf Rollschuhen heran, schwingt das Lasso, wirft es um deinen Sattel, sobald du aufstehst, hängt sich dran – am Ende rutscht die Schlinge ab, er rollt ins Gebüsch
  lasso(D,a,y,rt,dt){ const G=D.G, P=D.plan, t1=P.dz2[0], t2=t1+P.dz2[1], mu=dmLane(), sat=dmSattel(), V3=THREE.Vector3; if(!sat){ a.ende=1; return; } G.visible=true; D.rollen.forEach(o=>o.visible=true); D.grinsZ=1; D.wutZ=1;
    const stell=(d,u,ry,roll)=>{ G.position.set(...dmGrund(d,u)); G.rotation.set(0,ry,roll||0); };
    if(rt<t1+.6){ const z=rt-a.rt0, w=bSm(z/5), rand=dmRw(me.d)+5, d=me.d-14+9*w+.7*bSm((rt-t1)/.6), u=rand+(mu+.9-rand)*w, ps=Math.sin(rt*5); a.d=d; a.u=u; stell(d,u,dmVor(d)); // kommt rechts aus dem Wald gerollt
      dmPose(D,{...DM_SKI,l:.15,k:[-.1,0],b:[[-.35+.3*ps,.6],[-.1-.3*ps,.35]],a:[[-.4*ps,-.1],[-2.9,.3]]}); const h=dmHand(D,1), o=D.schlinge;
      if(rt<t1){ o.position.set(h.x+.15*Math.cos(rt*9),h.y+.12,h.z+.15*Math.sin(rt*9)); o.rotation.set(Math.PI/2,0,0); o.scale.setScalar(1); o.visible=true; dmSeil(D.seil,h,o.position.clone()); return; } // Schlinge kreist über dem Kopf
      const w2=(rt-t1)/.6, p0=new V3(h.x,h.y+.12,h.z); o.position.lerpVectors(p0,sat,w2); o.position.y+=.6*Math.sin(Math.PI*w2); o.scale.setScalar(1-.55*w2); o.visible=true; dmSeil(D.seil,h,o.position.clone()); return; } // Wurf auf den Sattel
    const o=D.schlinge;
    if(rt<t2){ const s=rt-t1-.6, tg=me.tgt||0, ov=tg>0?clampN((curPower()/tg-1)/.2,-1,1):0; a.ov=(a.ov||0)+(ov-(a.ov||0))*Math.min(1,dt*1.5); const c=Math.max(0,a.ov), amp=.9+c; // je mehr über dem Soll, desto wilder
      a.ph=(a.ph||0)+dt*(1.2+.8*c); const du=amp*Math.sin(a.ph), rw=dmRw(me.d), u=clampN(mu+du,-rw-.3,rw+.3), d=me.d-Math.sqrt(Math.max(1,DM_LASSO.seil**2-du*du))-.3, g=dmGrund(d,u), ruck=s<.6?Math.sin(Math.PI*s/.6):0; a.d=d; a.u=u;
      G.position.set(...g); G.position.y+=.25*ruck; G.rotation.set(0,Math.atan2(sat.x-g[0],sat.z-g[2]),-.22*Math.cos(a.ph)*amp/1.5+(a.ov<0?.25*Math.sin(rt*3)*-a.ov:0)); // legt sich in den Schwung, unter dem Soll trudelt er
      const P2=dmMix(DM_SKI,DM_SKI_TIEF,c); if(ruck>0) P2.a=[[-2.2+.8*Math.sin(rt*25),-.5],[-2.2-.8*Math.sin(rt*25),.5]]; dmPose(D,P2); const h=dmHand(D,0).add(dmHand(D,1)).multiplyScalar(.5);
      o.position.copy(sat); o.rotation.set(Math.PI/2,0,0); o.scale.setScalar(.45); o.visible=true; dmSeil(D.seil,h,sat); return; } // Schlinge um den Sattel, Seil straff
    if(a.vR==null){ a.vR=me.v; a.dR=a.d; a.uR=a.u; } a.vR=Math.max(0,a.vR-1.6*dt); a.dR+=a.vR*dt; a.uR+=1.3*dt; const rw=dmRw(a.dR); stell(a.dR,a.uR,dmVor(a.dR)+.5,.2*Math.sin(rt*6)); // rollt ungebremst schräg ins Gebüsch, rudert mit den Armen
    dmPose(D,{...DM_SKI,a:[[-rt*14,-.3],[-rt*14+Math.PI,.3]],k:[.3,0,.2*Math.sin(rt*5)]}); D.grinsZ=0; if(a.uR>=rw+2.6){ dmPuff(D,...dmGrund(a.dR,a.uR)); a.ende=1; } if(rt>t2+6) a.ende=1; },
  // kurze Huscher am Rand zwischen den Auftritten in Flucht 2: flitzt zwischen den Bäumen, Kopf ploppt hinter einem Stein hoch, krabbelt einen Stamm hoch
  husch(D,a,y,rt){ const G=D.G; if(a.typ==null){ a.typ=['wald','stein','stamm'][Math.random()*3|0]; a.s=Math.random()<.5?1:-1; a.d0=me.d+(a.typ==='wald'?22:40); a.t0=rt; } const z=rt-a.t0, rw=dmRw(a.d0); D.grinsZ=.6; D.wutZ=.5;
    if(a.typ==='wald'){ const T=1.6; if(z>=T){ a.ende=1; return; } const d=a.d0+16*z/T, g=dmGrund(d,a.s*(rw+6)); G.visible=true; G.position.set(...g); G.rotation.set(0,dmVor(d),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=13; return; }
    if(a.typ==='stein'){ if(z>1.9){ a.ende=1; return; } const u=a.s*(rw+2.5); dmFels(D,a.d0,u); const g=dmGrund(a.d0,u+a.s*.7), [rx,rz]=dmRechts(a.d0), w=bSm(z/.25)*bSm((1.7-z)/.25); G.visible=true; G.position.set(g[0],g[1]-1.25+.45+.45*w,g[2]);
      G.rotation.set(0,Math.atan2(-a.s*rx,-a.s*rz),0); dmPose(D,DM_STEH); D.K.rotation.y=dmKopfZu(D,1.2); return; }
    const B=dmBaum(D,2,a.d0,a.s*(rw+4),0), h=7*bSm(z/1.4); if(z>1.6){ a.ende=1; return; } G.visible=h<6.3; G.position.set(B.x+B.dx*.42,B.y+h,B.z+B.dz*.42); G.rotation.set(-Math.PI/2,Math.atan2(-B.dx,-B.dz),0); dmPose(D,dmKrabbel(D.phi,1)); D.dPhi=10; } };
// Halt!-Szene: 0 … 1, wie weit du nach rechts und Friedel nach links ausweichen (ttSpur in welt-teufel.js, Friedels Spur in welt-teufelstisch-leben.js)
function dmHaltW(){ const D=anim.tt&&anim.tt.daemon, a=D&&D.akt; if(!a||a.art!=='halt'||a.d0==null||race.state!=='run') return 0; const dd=a.d0-me.d; return bSm((40-dd)/12)*bSm((dd+5)/4); }
// Rollschuh-Lasso: im „Dreizack“ von Flucht 2 gehst du aus dem Sattel (rideState in figuren.js)
function dmStehen(){ const D=R&&R.tt&&anim.tt&&anim.tt.daemon, P=D&&D.plan; return !!(P&&P.dz2&&race.state==='run'&&race.t>=P.dz2[0]&&race.t<P.dz2[0]+P.dz2[1]); }

// ---- Ablauf (aus teufelSkript) ----
function dmPlan(K){ const S=race.woSegs||[], z=S.find(s=>s.label==='Schlusssprint'), r0=K.r[0], r1=K.r[1], a0=r0.tS+DM.j1[0], e0=r0.tE-DM.j1[1], a1=r1.tS+DM.j2[0], f2=S.filter(s=>s.label==='Flucht 2'), dz2=K.dz[1]||null;
  const fest=DM_J1.map(([art,f])=>({art,t:a0+(e0-a0)*f})); for(const [i,L] of DM_J2){ const s=f2[i]; if(!s) continue; const p=Math.max(s.t0,a1), q=s.t0+s.dur-3; for(const [art,f] of L) fest.push({art,t:p+(q-p)*f}); }
  if(dz2) fest.push({art:'lasso',t:dz2[0]-DM_LASSO.vor,vor:true}); fest.sort((x,y)=>x.t-y.t); return {fest, dz2, a1, e1:(z?z.t0:r1.tE)-DM.j2[1], husch:0}; }
const dmFrei=(K,rt,s)=>!K.kam.some(([a,T])=>rt+s>a-.5&&rt<a+T+.5); // kein Rückblick in den nächsten s Sekunden

// ---- Bewegung (aus poseTeufelstisch) ----
function poseDaemon(dt){ const A=anim.tt, D=A&&A.daemon; if(!D) return; const run=race.state==='run', rt=race.t, K=A.teufel&&A.teufel.sk;
  D.G.visible=false; D.baeume.forEach(B=>B.visible=false); D.fels.visible=false; D.T.scale.z=1; D.H.position.z=0; D.rollen.forEach(o=>o.visible=false); D.seil.visible=D.schlinge.visible=D.stein.visible=D.rad.G.visible=false; D.grinsZ=0; D.wutZ=0; D.sternZ=false; D.dPhi=0;
  if(!run||!K){ D.akt=null; D.plan=null; dmFx(D,dt); return; }
  if(D.planK!==K){ D.planK=K; D.plan=dmPlan(K); D.akt=null; } const P=D.plan;
  if(D.akt&&(D.akt.ende||rt<D.akt.rt0-.5||rt>D.akt.rt0+(DM.max[D.akt.art]||DM.max.x)||Math.abs(me.d-D.akt.dA)>400)){ D.akt=null; P.husch=Math.max(P.husch,rt+3); } // Sprung im Testmodus: Auftritt abbrechen
  for(const j of P.fest) if(rt<j.t) j.da=false; const j=P.fest.find(j=>!j.da&&rt>=j.t&&rt<j.t+30&&(j.vor||!D.akt&&dmFrei(K,rt,8))); // feste Auftritte der Reihe nach, das Lasso drängt sich vor
  if(j){ j.da=true; D.akt={art:j.art, rt0:rt, dA:me.d}; }
  else if(!D.akt&&rt>=P.a1&&rt<P.e1&&rt>=P.husch&&dmFrei(K,rt,3)&&!P.fest.some(j=>!j.da&&j.t<rt+5&&rt<j.t+30)){ D.akt={art:'husch', rt0:rt, dA:me.d}; P.husch=rt+DM.husch[0]+Math.random()*(DM.husch[1]-DM.husch[0]); } // kurze Huscher dazwischen
  if(D.akt) DM_AKT[D.akt.art](D,D.akt,rt-D.akt.rt0,rt,race.paused?0:dt); if(D.akt&&D.akt.ende) D.G.visible=false;
  if(!race.paused) D.phi+=D.dPhi*dt*simSpeed()*2*Math.PI/1.6; dmFx(D,dt); }
// Augen (blau → rot mit Schlitzpupille), Grinsen, Sternchen, Staubwolken
function dmFx(D,dt){ const k=Math.min(1,dt*6); D.wut+=(D.wutZ-D.wut)*k; D.grins+=(D.grinsZ-D.grins)*k; const w=D.wut, t=performance.now()/1000;
  D.irisM.color.setRGB(.18+.7*w,.48-.43*w,1-.9*w); D.pup.forEach(p=>p.scale.set(1-.65*w,1+.9*w,1)); D.brau.forEach((b,i)=>b.rotation.z=(i?-1:1)*.45*w);
  D.mund.scale.x=1+1.3*D.grins; D.zahn.visible=D.grins>.5;
  const st=D.sternZ&&D.G.visible; let kp=null; if(st){ D.G.updateMatrixWorld(true); kp=D.K.localToWorld(new THREE.Vector3(0,.25,0)); }
  D.sterne.forEach((s,i)=>{ s.visible=st; if(st){ const a=t*4+i*2.1; s.position.set(kp.x+Math.cos(a)*.22,kp.y+.04*Math.sin(a*2),kp.z+Math.sin(a)*.22); } });
  D.staub.forEach((s,i)=>{ const P=D.puff[D.puff.length-1-(i>>2)], y=P?t-P.t:9; s.visible=y<1.1; if(!s.visible) return; const a=(i%4)*Math.PI/2+.4; s.position.set(P.x+Math.cos(a)*(.3+y*1.2),P.y+.3+y*.5,P.z+Math.sin(a)*(.3+y*1.2)); s.scale.setScalar(.6+y*1.6); s.material.opacity=.8*(1-y/1.1); }); }
