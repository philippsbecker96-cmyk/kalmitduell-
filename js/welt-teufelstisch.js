/* ================= Teufelstisch (Kampagne, Mission 2) – Welt =================
   Strecke und Meter: teufelstischDef in strecke.js (R.def.orte → R.tt). Vorlagen: kampagne/vorlagen/Teufelstisch/, Plan: KAMPAGNE.md
   Kaltenbacher Tal (Gasthaus „Zum Teufelstisch“ am Start, Kirche, ein paar Häuser, Bach mit Erlen) → Pfälzerwald (Buchen mit Kiefern, oben lichter mit Kiefern und Heide),
   Buntsandsteinfelsen am Anstieg (Felstürme, Überhang mit Bank, Tischfelsen wie die Teufelsschmiede), Steinmännchen vor der Kreuzung,
   Teufelstisch (≈ 9 m) links am Weg, Handschuhkopf in der Mitte der 180°-Kurve, Wegweiser an der Gabelung */

const TT_DAHN={vor:1000, seite:380, breit:40}; // Dahner Felsen mit dem Jungfernsprung: so viele m voraus hinter dem Workout-Ende, so weit links (Seite des Lagerplatzes) – ≈ 1 km entfernt auf dem Horizont (nach Skizze des Nutzers) · breit: halbe Breite der Sichtschneise
const TT_SICHT={vor:400, breit:9}; // vor dem Tisch: keine Bäume zwischen Weg (die letzten 400 m) und Teufel, halbe Breite der Schneise
const TT_ABZW={n:28, dreh:.012, w:2.2, frei:[4.5,8], schild:34}; // Abzweigung „sicher rechts“ am Beginn der letzten Kurve vor Runde 2: Waldweg geradeaus (Stücke à 4 m, Drehung je Stück nach links), der Weg zum Tisch biegt rechts ab · halbe Breite · frei von Bäumen: m neben dem Weg, am Eingang (vom Nutzer: größer, sichtbarer) · Wegweiser im Zwickel so viele m nach der Ecke
const TT_LICHTUNG={bei:[.16,.3,.45,.58,.72,.86], lang:70, wind:.9}; // Lichtungen in der Schleife: Mitte bei so viel der Schleifenlänge (zu nah an Tisch, Gabelung oder Abzweigung: fällt weg), m lang · Wind drückt die Fahrer so weit an den Rand (0 … 1)
const TT_HUEGEL={r:20, h:4.5}; // Felshügel unter dem Teufelstisch: Radius, Höhe über dem Gelände (Tisch steht 13 m neben der Wegmitte)
// ---- Vorbereitung (beim Streckenbau): Plätze für Gasthaus, Kirche, Häuser, Felsen; dichter Wald, Bach, Heide ----
function prepTeufelstisch(r){ const O=r.def.orte, kf=r.kf, S=r.S, q=rng(66), at=(d,u)=>{ const [x,y]=posAt(r,d), h=headingAt(r,d); return [x-Math.sin(h)*u, y+Math.cos(h)*u]; }, rw=d=>roadW(r,d)/2; // u: m neben der Wegmitte (positiv = rechts)
  const T=r.tt={kreuz:O.kreuz*kf, tisch:O.tisch*kf, gabel:O.gabel*kf, L:O.L*kf, raus:O.raus*kf, ziel:O.ziel*kf, ecke:O.ecke*kf, tEcke:O.tEcke, tKr:O.tKr, tL:O.tL, kopf:O.kopf, an:O.anstieg.map(d=>d*kf), felsen:[], haeuser:[], heide:[], bach:[]};
  const nah=ttWegNah(r), frei=[];
  T.tischPos=at(T.tisch,-(rw(T.tisch)+13)); frei.push([...T.tischPos,TT_HUEGEL.r+2]); frei.push([...T.kopf,18]); // Teufelstisch links am Weg · Handschuhkopf
  const a=at(T.gabel+16,0), b=at(T.raus+16,0); T.schild=[(a[0]+b[0])/2,(a[1]+b[1])/2]; frei.push([...T.schild,3]); // Wegweiser im Zwickel zwischen den Abzweigen
  T.hundePl=TT_HUND_PL.map(([dd,uu])=>{ const d=T.an[0]+dd, [x,y]=at(d,rw(d)+uu); frei.push([x,y,1.4]); return {d,u:rw(d)+uu}; }); // Hunde sitzen rechts im Gebüsch, wo man mit Beginn des Anstiegs vorbeikommt (welt-teufelstisch-leben.js)
  { const d=T.idyll=O.idyll*kf, h=headingAt(r,d), [sx,sy]=at(d,rw(d)), P=[[sx,sy]]; let a=h+TT_IDYLL.winkel; for(let k=1;k<=TT_IDYLL.n;k++){ a-=TT_IDYLL.kurve; const [px,py]=P[k-1]; P.push([px+Math.cos(a)*4,py+Math.sin(a)*4]); } T.seitenweg=P; // Idylle vor dem Ducken (welt-teufelstisch-leben.js): Seitenweg nach rechts Richtung Jungfernsprung
    for(const [x,y] of P) frei.push([x,y,3.2]); const [wx,wy]=at(d-3,rw(d)+1.4); T.idyllSchild=[wx,wy]; frei.push([wx,wy,1.5]); 
    const [x0,y0]=P[0], [x1,y1]=P[P.length-1], ab=Math.atan2(y1-y0,x1-x0)+TT_BOGEN.dreh; T.bogenPos=[x0+Math.cos(ab)*TT_BOGEN.weit,y0+Math.sin(ab)*TT_BOGEN.weit]; { const bx=T.bogenPos[0]-wx, by=T.bogenPos[1]-wy, bl=Math.hypot(bx,by); T.bogenSicht=[wx,wy,wx+bx/bl*TT_IDYLL.schneise,wy+by/bl*TT_IDYLL.schneise]; const Z=TT_TAL, a0=Math.atan2(by,bx), pol=(o,w)=>[wx+Math.cos(a0+w)*o,wy+Math.sin(a0+w)*o]; T.talSicht={x:wx,y:wy,a0}; T.bogenPos=pol(TT_BOGEN.weit,Z.bogen); // Fernblick ins Tal (TT_TAL): See, Dorf, Regenbogen dahinter
      { const [x,y]=pol(...Z.see.at); T.see={x,y,rx:Z.see.rx,rz:Z.see.rz,ry:a0+Z.see.at[1]+Math.PI/2}; frei.push([x,y,Z.see.rx+15]); }
      { const [x,y]=pol(...Z.dorf.at), H=[]; for(let i=0;i<Z.dorf.n*8&&H.length<Z.dorf.n;i++){ const a=q()*6.28, o=18+Math.sqrt(q())*(Z.dorf.r-18), hx=x+Math.cos(a)*o, hy=y+Math.sin(a)*o; if(nah(hx,hy,35)||H.some(h=>Math.hypot(h.x-hx,h.y-hy)<15)) continue; H.push({x:hx,y:hy,c:q()}); } T.dorf={x,y,haeuser:H}; frei.push([x,y,Z.dorf.r+12]); } } // Regenbogen weit hinten rechts am Horizont, Schneise dahin vom Wegweiser aus (dort steht die Kamera), wird nach hinten breiter
    const amPfad=(x,y,m)=>P.some((p,i)=>i&&ttSegAbst(x,y,P[i-1],p)<m), a1=Math.atan2(y1-y0,x1-x0); // dichter Wald im Zwickel zwischen Weg zum Teufelstisch und dem Seitenweg (verdeckt auch den Blick auf Dahn)
    for(let i=0;i<TT_IDYLL.wald;i++){ const o=6+Math.sqrt(q())*TT_IDYLL.tief, w=h+.04+q()*(a1-h-.04), x=x0+Math.cos(w)*o, y=y0+Math.sin(w)*o, rad=2+q()*2.5, busch=q()<.4;
      if(nah(x,y,(busch?1.5:rad)+3)||amPfad(x,y,(busch?1.2:rad)+1.2)) continue; if(busch) S.bush.push({x,y,s:.7+q()*.9,c:q()}); else S.tree.push({x,y,s:rad,c:q(),pine:q()<.4,ht:10+q()*7}); } }
  { const d=T.ecke, h=headingAt(r,d), [sx,sy]=posAt(r,d), P=[[sx,sy]]; let a=h; for(let k=1;k<=TT_ABZW.n;k++){ a-=TT_ABZW.dreh; const [px,py]=P[k-1]; P.push([px+Math.cos(a)*4,py+Math.sin(a)*4]); } T.abzweig=P; // Abzweigung „sicher rechts“ (vom Nutzer): Waldweg geradeaus, der Weg zum Tisch biegt rechts ab
    P.slice(2).forEach(([x,y],k)=>frei.push([x,y,k<5?TT_ABZW.frei[1]:TT_ABZW.frei[0]])); const k=Math.round(TT_ABZW.schild/4), [ax,ay]=at(d+TT_ABZW.schild,0); T.abzSchild=[(ax+P[k][0])/2,(ay+P[k][1])/2]; frei.push([...T.abzSchild,1.5]); } // Schneise, am Eingang breiter · Wegweiser zwischen den Wegen
  T.lichtung=[]; { const s0=T.tisch-T.kreuz, sG=T.gabel-T.kreuz, sE=T.ecke-T.kreuz; let k=0; for(const f of TT_LICHTUNG.bei){ const s=f*T.L; if(s<s0+60||s>sG-60&&s<sG+110||Math.abs(s-sE)<60) continue; // Lichtungen in der Schleife (vom Nutzer: dort bläst der Wind die Fahrer an den Rand), nicht am Tisch, an der Gabelung (Steintor) und an der Abzweigung
    const d0=T.kreuz+s-TT_LICHTUNG.lang/2, d1=d0+TT_LICHTUNG.lang; T.lichtung.push({d0,d1,s:k++%2?-1:1}); for(let d=d0-15;d<=d1+15;d+=8) for(const u of [-1,1]) for(const o of [9,24,40]) frei.push([...at(d,u*(rw(d)+o)),o<10?7:13]);
      for(let d=d0;d<d1;d+=1.5){ const sd=q()<.5?-1:1, [x,y]=at(d,sd*(rw(d)+1.2+q()*30)); if(!nah(x,y,2.2)) T.heide.push({x,y,s:.6+q()*.8,c:q(),r:q()*6}); } } } // keine Bäume, viel Heide
  T.tor={d:T.gabel+TT_TOR.nach}; for(const s of [-1,1]) frei.push([...at(T.tor.d,s*(rw(T.tor.d)+TT_TOR.breit)),4]); for(const [dd,sd] of TT_TOR_BAEUME) frei.push([...at(T.tor.d+dd,sd*(rw(T.tor.d+dd)+2.6)),3.5]); // Steintor auf dem rechten Abzweig, Platz für die Kiefern, die der Teufel umreißt (welt-teufel.js)
  { const zd=14, [px,py]=posAt(r,zd), h=headingAt(r,zd), o=rw(zd)+7; T.gast={d:zd, x:px-Math.sin(h)*o, y:py+Math.cos(h)*o, h, o}; frei.push([T.gast.x,T.gast.y,13]); } // Gasthaus rechts am Start
  // Kaltenbacher Tal: Kirche links hinter dem Bach, ein paar Häuser drumherum
  { const d=T.an[0]*.45, [x,y]=at(d,-(rw(d)+27)); T.kirche={d,x,y}; frei.push([x,y,16]);
    for(const [dd,u] of [[-38,-1],[-14,1],[22,1],[46,-1],[64,1]]){ const e=d+dd, [hx,hy]=at(e,u*(rw(e)+(u<0?30:9))); if(!nah(hx,hy,8)){ T.haeuser.push({x:hx,y:hy,d:e,c:q()}); frei.push([hx,hy,9]); } } }
  // Bach links neben dem Weg durch die Wiese, Erlen am Ufer
  for(let d=0; d<T.an[0]*.7; d+=6){ const u=-(rw(d)+11+3.5*Math.sin(d/55)); T.bach.push(at(d,u)); if(d%30<6&&q()<.7){ const [x,y]=at(d,u+(q()<.5?-3.5:3.5)); if(!nah(x,y,4)) S.tree.push({x,y,s:1.6+q()*1.2,c:q(),pine:false,ht:8+q()*4}); } }
  // Felstürme im Wald (Anstieg und Plateau), Überhang mit Bank, Tischfelsen, Steinmännchen
  for(let d=T.an[0]+160; d<T.raus+400; d+=150+q()*120){ if(imDoppel(r,d)) continue; const s=q()<.5?-1:1, u=s*(rw(d)+12+q()*22), [x,y]=at(d,u), rr=2.4+q()*2.2;
    if(nah(x,y,rr+6)||Math.hypot(x-T.kopf[0],y-T.kopf[1])<40||Math.hypot(x-T.tischPos[0],y-T.tischPos[1])<30) continue; T.felsen.push({x,y,r:rr,hg:6+q()*9,sd:q()*1e6|0}); frei.push([x,y,rr+3]); }
  { const d=(T.an[0]+T.an[1])/2; T.ueber={d, s:1}; for(let e=d-10;e<=d+10;e+=4) frei.push([...at(e,rw(e)+6),5]); } // Felsüberhang rechts mit Bank (Vorlage 17b3630ec91)
  { const d=T.an[1]-110, [x,y]=at(d,-(rw(d)+9)); T.schmiede={x,y,d}; frei.push([x,y,8]); } // Tischfelsen wie die Teufelsschmiede (Vorbote)
  { const d=T.kreuz-70, [x,y]=at(d,rw(d)+3); T.maennchen={x,y,d}; frei.push([x,y,3]); } // Steinmännchen rechts am Weg (Vorlage 174cb5ba20f)
  // Heide auf dem Plateau und in der Schleife (lichter Kiefernwald)
  for(let d=T.an[1]; d<T.raus+300; d+=3){ if(imDoppel(r,d)||q()<.45) continue; const s=q()<.5?-1:1, [x,y]=at(d,s*(rw(d)+1.6+q()*9)); if(!nah(x,y,2.4)) T.heide.push({x,y,s:.6+q()*.7,c:q(),r:q()*6}); }
  { const he=headingAt(r,T.ziel), s=Math.cos(he)>=0?1:-1, d=Math.min(T.ziel+TT_DAHN.vor,r.len-1), ex=T.ziel+TT_DAHN.vor-d, h=headingAt(r,d), [x0,y0]=at(d,-s*TT_DAHN.seite), x=x0+Math.cos(h)*ex, y=y0+Math.sin(h)*ex, [px,py]=posAt(r,T.ziel-150);
    T.dahn={x,y,ry:Math.atan2(px-x,py-y)}; frei.push([x,y,140]); // voraus links hinter dem Streckenende, Front zum Weg
    T.blick=[posAt(r,T.ziel-600),posAt(r,T.ziel-150)]; // Sichtschneise zu den Felsen (beim Heranfahren): Gelände sinkt, keine Bäume – die Bäume am Lager bleiben
    // Lagerplatz am Ende (vom Nutzer gewünscht), gegenüber den Felsen: Feuerstelle, Sandsteinhöhle für zwei, Sitzstämme, Brennholz, mehr Bäume rundherum
    const e=T.ziel, [cx,cy]=at(e,-s*(rw(e)+9)), [hx,hy]=at(e+3,-s*(rw(e)+17)), [qx,qy]=posAt(r,e+3); T.lager={x:cx,y:cy,hx,hy,ry:Math.atan2(qx-hx,qy-hy)}; frei.push([cx,cy,8],[hx,hy,7]); // Höhle schaut zum Weg
    for(let i=0;i<60;i++){ const a=(q()-.5)*Math.PI*1.7, o=11+q()*40, dd=e+Math.sin(a)*o, [tx,ty]=at(dd,-s*(rw(dd)+6+Math.cos(a)*o*.9+4)); if(!nah(tx,ty,4)&&Math.hypot(tx-hx,ty-hy)>8) S.tree.push({x:tx,y:ty,s:2+q()*2.5,c:q(),pine:q()<.6,ht:10+q()*7}); }
    for(let i=0;i<30;i++){ const dd=e+(q()-.5)*55, [bx,by]=at(dd,-s*(rw(dd)+4+q()*14)); if(!nah(bx,by,2)&&Math.hypot(bx-cx,by-cy)>6&&Math.hypot(bx-hx,by-hy)>6) S.bush.push({x:bx,y:by,s:.6+q()*.8,c:q()}); } }
  kampWald(r,S,q,d=>d<T.an[0]?.3:d<T.an[1]?.45:.75); // dichter Pfälzerwald: unten Buchen, oben Kiefern
  const imBlick=(x,y)=>T.blick.some(p=>ttSegAbst(x,y,p,[T.dahn.x,T.dahn.y])<TT_DAHN.breit)||ttSegAbst(x,y,[T.lager.x,T.lager.y],[T.dahn.x,T.dahn.y])<10; // auch vom Lagerfeuer aus frei (Kamera der Schlussszene)
  const tb=[]; for(let d=T.tisch-TT_SICHT.vor; d<T.tisch-12; d+=20) tb.push(posAt(r,d)); const zumTisch=(x,y)=>tb.some(p=>ttSegAbst(x,y,p,T.tischPos)<TT_SICHT.breit); const B=T.bogenSicht, zumBogen=(x,y)=>{ if(!B) return false; const dx=B[2]-B[0], dy=B[3]-B[1], t=Math.max(0,Math.min(1,((x-B[0])*dx+(y-B[1])*dy)/(dx*dx+dy*dy))); return Math.hypot(x-B[0]-dx*t,y-B[1]-dy*t)<TT_IDYLL.breit+t*TT_IDYLL.weit; }; // Sicht auf den Teufel beim Heranfahren (vom Nutzer gewünscht)
  for(const k of ['tree','rock','bush','block','konif','grass']) if(S[k]) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m)&&!(k!=='grass'&&imBlick(o.x,o.y))&&!((k==='tree'||k==='konif'||k==='block')&&zumTisch(o.x,o.y))&&!((k==='tree'||k==='konif')&&zumBogen(o.x,o.y))); }
const ttSegAbst=(x,y,[ax,ay],[bx,by])=>{ const dx=bx-ax, dy=by-ay, t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy))); return Math.hypot(x-ax-dx*t,y-ay-dy*t); }; // Abstand zur Strecke a–b
// Abstand zum Weg (alle Wegpunkte, Gitter 8 m): nah(x,y,m) = näher als m
function ttWegNah(r){ const C=8, gr=new Map(), key=(x,y)=>Math.floor(x/C)+','+Math.floor(y/C); for(let i=0;i<r.xs.length;i+=2){ const k=key(r.xs[i],r.ys[i]); (gr.get(k)||gr.set(k,[]).get(k)).push(i); }
  return (x,y,m)=>{ const cx=Math.floor(x/C), cy=Math.floor(y/C), w=Math.ceil(m/C); for(let a=-w;a<=w;a++) for(let b=-w;b<=w;b++){ const l=gr.get((cx+a)+','+(cy+b)); if(l) for(const i of l) if(Math.hypot(r.xs[i]-x,r.ys[i]-y)<m) return true; } return false; }; }

// ---- Aufbau (aus build3D) ----
// Schotterweg vor dem Tisch und auf der ganzen Schleife (Belag „schotter“): flache, runde Kiesel in Grau und Beige, dichter am Rand, wenige in der Mitte (vom Nutzer: nicht spitz, normaler Schotter)
function ttWaldweg(){ const Z=(R.belag||[]).find(b=>b[0]==='schotter'); if(!Z) return; const e=Math.min(Z[2],R.tt.kreuz+R.tt.L), q=rng(77), N=Math.round((e-Z[1])*2.2), g=new THREE.DodecahedronGeometry(.5,0), m=new THREE.InstancedMesh(g,lam('#ffffff'),N), o=new THREE.Object3D(), C=new THREE.Color(); // Runde 2 liegt schon in der Welt
  for(let i=0;i<N;i++){ const d=Z[1]+q()*(e-Z[1]), rw=roadW(R,d)/2, rand=q()<.6, u=rand?(q()<.5?-1:1)*(rw-.2+q()*.8):(q()-.5)*rw*1.6, p=wegPos(d,u), s=rand?.08+q()*.16:.05+q()*.08;
    o.position.set(p.x,bodenY(p.x,p.z)+s*.08,p.z); o.rotation.set((q()-.5)*.3,q()*6,(q()-.5)*.3); o.scale.set(s*(1+q()*.6),s*(.35+q()*.25),s*(.8+q()*.4)); o.updateMatrix(); m.setMatrixAt(i,o.matrix); m.setColorAt(i,C.set(['#a39e94','#8c8780','#b5ab98','#7a756e','#c2b8a4'][Math.floor(q()*5)])); }
  m.userData.ohneBoden=true; world.add(m); } // flach, halb im Boden (gewollt)
function buildTeufelstisch(){ ttWaldweg(); const T=R.tt, q=rng(612), A=anim.tt={}, FT=felsTex(), M=(c,map)=>new THREE.MeshLambertMaterial(map?{map,color:c}:{color:c});
  const fels=M('#ffffff',FT), rot=M('#f2a48a',FT), grau=M('#c9bcb2',FT), hell=M('#f6efe4',FT), moos=M('#7d8a52'), holz=lam('#6b4a32'), nadel=lam('#36552d'), nadel2=lam('#2e4a27'), stamm=lam('#8f5136');
  const add=(P,m,x,y,z)=>{ m.position.set(x,y,z); P.add(m); return m; }, grp=(x,y,z)=>{ const G=new THREE.Group(); G.position.set(x,y,z); G.userData.ohneBoden=true; world.add(G); return G; };
  const cyl=(P,r0,r1,h,m,x,y,z,n=8)=>add(P,new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,n),m),x,y,z), brocken=(P,s,m,x,y,z)=>{ const b=add(P,new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),m),x,y,z); b.rotation.set(q(),q()*6,q()); b.scale.y=.55+q()*.25; return b; };
  const kiefer=(P,x,y,z,s)=>{ const st=cyl(P,.1*s,.18*s,3.2*s,stamm,x,y+1.6*s,z,5); st.rotation.z=(q()-.5)*.5; // Krüppelkiefer
    for(const [dx,dy,k] of [[0,3.3,1.25],[.5,2.6,.9],[-.45,2.9,.8]]){ const c=add(P,new THREE.Mesh(new THREE.IcosahedronGeometry(k*s,0),q()<.5?nadel:nadel2),x+dx*s,y+dy*s,z); c.scale.set(1.4,.55,1.1); } };
  // Felsturm aus Schichten (Buntsandstein), band: helle Bänder wie am Handschuhkopf
  const turm=(x,z,r0,hg,sd,band)=>{ const qa=rng(sd), G=grp(x,bodenY(x,z)-1.5,z); let y=0, j=0, rr=r0;
    while(y<hg){ const lh=1.1+qa()*1.8, k=y/hg; rr=r0*(1.1-.3*k)*(.85+.3*qa()); const hb=band&&j%4===3, c=cyl(G,rr*(.9+qa()*.2)*(hb?1.06:1),rr,lh,hb?hell:j%3?fels:rot,(qa()-.5)*.5,y+lh/2,(qa()-.5)*.5,7);
      c.rotation.y=qa()*6; c.scale.z=.72+qa()*.3; y+=lh; j++; }
    kiefer(G,rr*.2,y,0,.9+qa()*.5); for(let i=0;i<4;i++) brocken(G,.8+qa()*1.4,fels,Math.cos(i*1.7)*(r0+1),.6,Math.sin(i*1.7)*(r0+1)); return G; };

  // Teufelstisch (≈ 9 m, nach den Fotos): Säule aus drei roten, gerillten Strängen mit Spalt, kissenförmige Platte (oben grau, unten rötlich) weit überstehend, Kiefer obendrauf
  { const [tx,tz]=T.tischPos, ty=bodenY(tx,tz)-.5, G=A.tisch=grp(tx,ty,tz), [px,pz]=posAt(R,T.tisch); G.rotation.y=Math.atan2(px-tx,pz-tz); G.scale.setScalar(1.6); // +z zum Weg · 1,6 × ≈ 14 m auf dem Hügel (vom Nutzer gewünscht: größer)
    for(const [sx,sz,r0] of [[-.7,.1,1.05],[.65,.35,.95],[.05,-.75,.85]]){ let y=0; while(y<6.1){ const lh=Math.min(6.1-y,.7+q()*.9), k=y/6.1, rr=r0*(1-.28*Math.sin(Math.PI*k))*(.9+q()*.2); // Taille in der Mitte, Schichten als Rillen
      const c=cyl(G,rr*(.92+q()*.12),rr,lh,q()<.7?rot:fels,sx+(q()-.5)*.12,y+lh/2,sz+(q()-.5)*.12,7); c.rotation.y=q()*6; y+=lh; } }
    cyl(G,2.9,2.1,.9,rot,.4,6.2,0,10).scale.set(1.15,1,.9); // Unterseite der Platte, rötlich
    const P=A.platte=new THREE.Group(); P.position.set(.9,6.6,0); G.add(P); // Platte überhängend (zum Weg hin rechts)
    cyl(P,4.3,3.4,1.5,M('#d9a08a',FT),0,.75,0,12).scale.set(1.25,1,.85); cyl(P,4.5,4.4,1.1,grau,.1,2.0,0,12).scale.set(1.22,1,.82); cyl(P,4.1,4.5,.55,grau,.05,2.82,.05,12).scale.set(1.18,1,.8); // Kissen in Schichten
    kiefer(P,-1.6,3.05,.6,1.1); // einzelne Kiefer oben auf der Platte (fliegt in Runde 2 mit)
    for(let i=0;i<7;i++){ const a=i*.9+q(), o=2.6+q()*2.4; brocken(G,1+q()*1.5,i%2?rot:fels,Math.cos(a)*o,.5,Math.sin(a)*o-(Math.sin(a)>0?1.5:0)); } // abgerundete Blöcke am Fuß (nicht auf den Weg)
    ttFleck(tx,tz,12,'#b8775a'); for(let i=0;i<10;i++){ const a=i*.63+q()*.3, o=9+q()*7, bx=tx+Math.cos(a)*o, bz=tz+Math.sin(a)*o; if(Math.hypot(bx-px,bz-pz)>roadW(R,T.tisch)/2+4) brocken(grp(bx,bodenY(bx,bz)-.3,bz),1+q()*1.8,i%2?rot:fels,0,0,0); } } // roter Sandgrus, Felsbrocken am Hügel

  // Handschuhkopf: hoher roter Felsturm mit hellen Bändern und Kiefer obendrauf, in der Mitte der 180°-Kurve
  { const [kx,kz]=T.kopf; turm(kx,kz,5.8,21,4711,true); turm(kx+7,kz-3,3,8,815,true); for(let i=0;i<8;i++){ const a=i*.8; brocken(grp(kx+Math.cos(a)*9,bodenY(kx+Math.cos(a)*9,kz+Math.sin(a)*9),kz+Math.sin(a)*9),1.2+q()*1.8,fels,0,0,0); } }
  // Felstürme im Wald
  for(const F of T.felsen) turm(F.x,F.y,F.r,F.hg,F.sd,F.hg>11);
  // Felsüberhang mit Bank am Anstieg: Schichten nach oben weiter überhängend
  { const U=T.ueber, rw=d=>roadW(R,d)/2, FB=[];
    for(let d=U.d-9; d<=U.d+9; d+=4.5){ const [px,pz]=posAt(R,d), h=headingAt(R,d), nx=-Math.sin(h)*U.s, nz=Math.cos(h)*U.s, base=Math.min(roadY(d),bodenY(px+nx*(rw(d)+6),pz+nz*(rw(d)+6)))-1.2;
      let y=0, j=0; while(y<6.5){ const lh=1.2+q()*1.1, dep=4.6+(j%2?-.8:.3)+q()*.5, o=rw(d)+3.3+dep/2-Math.min(2.4,j*.42); FB.push([px+nx*o,base+y+lh/2,pz+nz*o,5+q(),lh,dep,-h+(q()-.5)*.1,j%3===1]); y+=lh; j++; } }
    for(const [x,y,z,w,hh,dd,ry,r2] of FB){ const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,dd),r2?rot:fels); b.position.set(x,y,z); b.rotation.y=ry; b.userData.ohneBoden=true; world.add(b); }
    const [px,pz]=posAt(R,U.d), h=headingAt(R,U.d), o=rw(U.d)+1.5, bx=px-Math.sin(h)*U.s*o, bz=pz+Math.cos(h)*U.s*o, by=bodenY(bx,bz), B=grp(bx,by,bz); B.rotation.y=-h; // Holzbank unter dem Überhang
    add(B,new THREE.Mesh(new THREE.BoxGeometry(1.8,.08,.4),holz),0,.45,0); for(const s of [-.75,.75]) add(B,new THREE.Mesh(new THREE.BoxGeometry(.1,.45,.36),holz),s,.22,0); }
  // Tischfelsen am Anstieg (wie die Teufelsschmiede): kurze Stützen, breite moosige Platte
  { const S=T.schmiede, G=grp(S.x,bodenY(S.x,S.y)-.3,S.y); G.rotation.y=q()*6;
    for(const [x,z,r0] of [[-2.4,0,1.3],[0,.3,1.5],[2.5,-.1,1.2]]) cyl(G,r0,r0*1.15,2.2,rot,x,1.1,z,7).scale.z=.8;
    cyl(G,3.2,2.9,1.3,fels,0,2.8,0,9).scale.set(1.6,1,.85); cyl(G,3.1,3.2,.25,moos,0,3.52,0,9).scale.set(1.55,1,.82); }
  // Steinmännchen: kleine Türmchen aus flachen Sandsteinen
  { const S=T.maennchen; for(let k=0;k<5;k++){ const x=S.x+(q()-.5)*2.6, z=S.y+(q()-.5)*2.6, G=grp(x,bodenY(x,z),z); let y=0; const n=3+q()*5|0;
    for(let i=0;i<n;i++){ const s=.28-i*.025+q()*.06, st=add(G,new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),i%2?rot:fels),(q()-.5)*.05,y+s*.35,(q()-.5)*.05); st.scale.y=.5; y+=s*.7; } } }
  // Heide (lila) auf dem Plateau
  if(T.heide.length){ const im=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.5,0),lam('#ffffff'),T.heide.length), m4=new THREE.Matrix4(), qu=new THREE.Quaternion(), up=new THREE.Vector3(0,1,0), c=new THREE.Color();
    T.heide.forEach((o,i)=>{ qu.setFromAxisAngle(up,o.r); m4.compose(new THREE.Vector3(o.x,bodenY(o.x,o.y)+o.s*.12,o.y),qu,new THREE.Vector3(o.s*1.5,o.s*.5,o.s*1.3)); im.setMatrixAt(i,m4); im.setColorAt(i,c.set(o.c<.55?'#8a6a9e':o.c<.85?'#a283ad':'#8c7a58')); });
    im.instanceMatrix.needsUpdate=true; im.instanceColor.needsUpdate=true; world.add(im); }
  // Wegweiser an der Gabelung: rechts „Teufelstisch“, links „Dahn“
  { const [sx,sz]=T.schild, sy=bodenY(sx,sz); add(world,new THREE.Mesh(new THREE.BoxGeometry(.18,2.9,.18),holz),sx,sy+1.25,sz).userData.ohneBoden=true;
    for(const [d,k,txt] of [[T.gabel+30,0,'Teufelstisch'],[T.raus+30,1,'Dahn']]){ const g=new THREE.BoxGeometry(1.5,.34,.06); g.translate(.75,0,0); const [px,pz]=posAt(R,d);
      const tx=frakturTex(256,58,c=>{ c.fillStyle='#6b4a32'; c.fillRect(0,0,256,58); c.fillStyle='#efe2c0'; c.textAlign='center'; c.textBaseline='middle'; c.font='38px '+FRAKTUR; c.fillText(txt,128,31,236); }), tm=new THREE.MeshLambertMaterial({map:tx});
      add(world,new THREE.Mesh(g,[holz,holz,holz,holz,tm,tm]),sx,sy+2.35-k*.45,sz).rotation.y=-Math.atan2(pz-sz,px-sx); } }
  // Kaltenbacher Tal: Gasthaus am Start (wie am Ende von Mission 1), Kirche mit Turm, Häuser, Bach
  buildGasthaus(T,A); for(const m of A.gast.mats) m.emissive.setScalar(.12); // mittags: Fenster kaum hell
  { const K=T.kirche, [px,pz]=posAt(R,K.d), ry=Math.atan2(px-K.x,pz-K.y), G=grp(K.x,bodenY(K.x,K.y),K.y); G.rotation.y=ry; const sand=new THREE.MeshLambertMaterial({map:burgQuader()}), schiefer=lam('#5a5f68');
    const S=haus({w:7.5,dep:13,hgt:6.5,qu:true,shut:0,roof:'#8e4a32'}); S.position.z=-4; G.add(S); // Schiff, Giebel zum Weg
    const tu=add(G,new THREE.Mesh(new THREE.BoxGeometry(4.4,15,4.4),sand),0,7.5-1,4.3); add(G,new THREE.Mesh(new THREE.BoxGeometry(4.5,1,4.5),sand),0,13.8,4.3); // Turm vorn
    for(const [x,z] of [[0,2.2],[0,-2.2],[2.2,0],[-2.2,0]]) add(tu,new THREE.Mesh(new THREE.BoxGeometry(x?.1:1,1.6,x?1:.1),lam('#1e1a18')),x*1.01,4.6,z*1.01); // Schallöffnungen
    const sp=add(G,new THREE.Mesh(new THREE.ConeGeometry(3.4,7.5,4),schiefer),0,18,4.3); sp.rotation.y=Math.PI/4; add(G,new THREE.Mesh(new THREE.BoxGeometry(.08,1.4,.08),lam('#c9a43a')),0,22.3,4.3); } // Spitzhelm mit Kreuz
  for(const Hs of T.haeuser){ const H=haus({w:7+Hs.c*2.5,dep:7+Hs.c,hgt:4.4+Hs.c,fw:Hs.c<.7,wall:0,shut:0,roof:Hs.c<.6?'#9e3a28':'#a8925c',kam:Hs.c}), [px,pz]=posAt(R,Hs.d);
    H.position.set(Hs.x,Math.max(...[[-4,-4],[4,-4],[-4,4],[4,4]].map(([a,b])=>bodenY(Hs.x+a,Hs.y+b))),Hs.y); H.rotation.y=Math.atan2(px-Hs.x,pz-Hs.y); H.userData.ohneBoden=true; world.add(H); }
  // Ausblick beim Ausfahren: Dahner Felsen mit dem Jungfernsprung (Vorlage kampagne/vorlagen/Jungfernsprung/): links der glatte, steile Sprungfelsen, rechts Felstürme mit Kiefern, Wald am Fuß, Dahn davor
  { const D=T.dahn, G=grp(D.x,Math.max(bodenY(D.x,D.y)-4,roadY(T.ziel)-12),D.y), FT2=felsTex(); FT2.repeat.set(3,9); const wand=new THREE.MeshLambertMaterial({map:FT2}), wand2=new THREE.MeshLambertMaterial({map:FT2,color:'#e2b4a0'}), kluft=lam('#5a3328'), wald=lam('#3d6234'), wald2=lam('#2f5129');
    G.rotation.y=D.ry; add(G,new THREE.Mesh(new THREE.BoxGeometry(150,60,40),wand2),10,-30,-4); // +z zum Weg · Felssockel bis ins Tal: Wand ragt ≈ 50 m über die Weghöhe (auf dem Horizont)
    for(const [w,hh,dd,x,y] of [[26,14,18,-34,7],[24,14,17,-34.5,21],[22,14,16,-35,35],[19,12,14,-35.5,48],[15,7,11,-36,57.5]]) add(G,new THREE.Mesh(new THREE.BoxGeometry(w,hh,dd),wand),x,y,0); // Sprungfelsen ≈ 60 m, glatte Front
    for(const x of [-41,-33,-27]) add(G,new THREE.Mesh(new THREE.BoxGeometry(.8,46,.6),kluft),x,30,8.6); // senkrechte Klüfte
    add(G,new THREE.Mesh(new THREE.BoxGeometry(80,26,22),wand2),18,13,-8); // Felsrücken nach rechts
    [[-14,40,7],[0,46,8.5],[14,38,7],[28,44,8],[42,34,6.5],[56,30,6]].forEach(([x,hh,r0],i)=>{ let y=0; while(y<hh){ const lh=4+q()*4, c=add(G,new THREE.Mesh(new THREE.CylinderGeometry(r0*(.85+q()*.2),r0,lh,7),i%2?wand:wand2),x+(q()-.5)*1.5,y+lh/2,-4+(q()-.5)*3); c.scale.z=.75; y+=lh; } kiefer(G,x,y,-4,2.4); });
    kiefer(G,-34,61,0,2.6); kiefer(G,-38,61,2,2); // Kiefern auf dem Sprungfelsen
    for(let i=0;i<46;i++){ const x=-60+q()*125, k=add(G,new THREE.Mesh(new THREE.IcosahedronGeometry(6+q()*6,0),q()<.5?wald:wald2),x,6+q()*12,10+q()*14); k.scale.set(1.2,.9+q()*.6,1); } // Wald am Fuß, wächst die Wand hinauf
    for(let i=0;i<9;i++){ const x=-55+i*13+(q()-.5)*4, z=45+q()*30, Hs=haus({w:7+q()*2,dep:7,hgt:4.5,fw:q()<.6,wall:0,shut:0,roof:q()<.7?'#a8442c':'#8e4a32',kam:q()}); G.updateMatrixWorld(true); const v=new THREE.Vector3(x,0,z).applyMatrix4(G.matrixWorld); Hs.position.set(v.x,bodenY(v.x,v.z),v.z); Hs.rotation.y=G.rotation.y+(q()-.5)*.4; Hs.userData.ohneBoden=true; world.add(Hs); } } // Dahn: Häuser mit roten Dächern, jedes auf dem Boden
  // Lagerplatz: Sandsteinhöhle (Öffnung zum Weg, innen dunkel, zwei Strohlager), Feuerstelle mit Steinring und kleinem Feuer, zwei Sitzstämme, Brennholz
  { const Lg=T.lager, G=grp(Lg.hx,bodenY(Lg.hx,Lg.hy)-.25,Lg.hy); G.rotation.y=Lg.ry; const dunkel=lam('#1c1410'), stroh=lam('#c9b06a');
    const bl=(w,hh,d,m,x,y,z,ry=0)=>{ const b=add(G,new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m),x,y,z); b.rotation.y=ry; return b; };
    bl(9,3.4,2.2,fels,0,1.7,-2.6); bl(2.6,2.8,5,rot,-3.4,1.4,0,.08); bl(2.4,2.9,5,fels,3.5,1.45,0,-.06); // Rückwand, Seitenwände
    bl(10,1.2,7,rot,0,3.3,.3,.03); bl(8.4,1,5.6,fels,.3,4.3,-.2,-.05); bl(6,.7,4,grau,-.2,5.05,-.4); cyl(G,3.2,3.4,.3,moos,-.1,5.5,-.4,8).scale.set(1.2,1,.8); // Deckplatten, oben moosig
    bl(4.2,2.5,.2,dunkel,0,1.3,-1.4); bl(4.2,.1,3.4,lam('#5a3f2c'),0,.06,.2); // dunkle Höhle innen, Boden
    for(const x of [-1.05,1.05]) bl(1.5,.25,2.4,stroh,x,.18,-.2,(q()-.5)*.2); // zwei Strohlager
    kiefer(G,-2.5,5.6,-1,1.2); for(let i=0;i<5;i++) brocken(G,.7+q()*.9,i%2?rot:fels,(q()-.5)*11,.3,-4+q()*2);
    const F=grp(Lg.x,bodenY(Lg.x,Lg.y),Lg.y); for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; brocken(F,.25+q()*.1,i%2?grau:fels,Math.cos(a)*.95,.12,Math.sin(a)*.95); } // Feuerstelle
    for(let i=0;i<4;i++){ const sc=cyl(F,.07,.08,1.2,stamm,0,.35,0,5); sc.rotation.set(.9,i*Math.PI/2,0); }
    const fl=add(F,new THREE.Mesh(new THREE.ConeGeometry(.35,.9,6),new THREE.MeshBasicMaterial({color:'#ffb040',transparent:true,opacity:.85})),0,.6,0), fl2=add(F,new THREE.Mesh(new THREE.ConeGeometry(.2,.6,6),new THREE.MeshBasicMaterial({color:'#fff0a0'})),0,.5,0);
    const fli=new THREE.PointLight(0xff9a40,1.2,14,2); fli.position.set(0,1,0); F.add(fli); A.feuer={fl,fl2,fli,an:0}; fl.visible=fl2.visible=false; fli.intensity=0; // noch aus: Friedel zündet es in der Schlussszene an (an=1)
    const [px,pz]=posAt(R,T.ziel); Lg.sitz=[]; for(const [a,o] of [[.9,2.6],[-.9,2.6]]){ const ry=Math.atan2(px-Lg.x,pz-Lg.y)+a, sx=Lg.x+Math.sin(ry)*o, sz=Lg.y+Math.cos(ry)*o, S2=grp(sx,bodenY(sx,sz),sz); Lg.sitz.push([sx,sz]); S2.rotation.y=ry+Math.PI/2; cyl(S2,.28,.3,2.2,stamm,0,.28,0,8).rotation.z=Math.PI/2; } // Sitzstämme
    { const bx=Lg.hx+(Lg.x-Lg.hx)*.35+2.8, bz=Lg.hy+(Lg.y-Lg.hy)*.35, B=grp(bx,bodenY(bx,bz),bz); B.rotation.y=Lg.ry; for(let r2=0;r2<3;r2++) for(let c=0;c<4-r2;c++) cyl(B,.12,.12,1.4,stamm,(c-(3-r2)/2)*.26,.12+r2*.22,0,6).rotation.x=Math.PI/2; } } // Brennholz
  buildTeufel(); buildTeufelstischLeben(); sicher('Gasthaus-Bau',()=>buildTtGast(A)); sicher('Lager-Bau',()=>buildTtLager(A)); sicher('Fuhrwerk-Bau',()=>buildTtFuhre(A)); // der Teufel am Tisch (welt-teufel.js) · Friedel mit der Wurstladung, Fernbild des Tischs (welt-teufelstisch-leben.js) · Anfangsszene im Gasthaus (welt-teufelstisch-gasthaus.js) · Schlussszene am Lager (welt-teufelstisch-lager.js)
  if(T.bach.length>1){ const P=T.bach, n=P.length, pos=new Float32Array(n*6), id=[]; // Bach: Wasserband knapp über dem Boden
    for(let i=0;i<n;i++){ const a=P[Math.max(0,i-1)], b=P[Math.min(n-1,i+1)], dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz)||1, nx=-dz/l*1.2, nz=dx/l*1.2, [x,z]=P[i];
      pos.set([x+nx,bodenY(x+nx,z+nz)+.09,z+nz, x-nx,bodenY(x-nx,z-nz)+.09,z-nz],i*6); if(i<n-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setIndex(id); g.computeVertexNormals();
    const w=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:'#5d8aa6',side:THREE.DoubleSide,emissive:'#1d3a4a'})); w.userData.ohneBoden=true; world.add(w); } }

// Bodenfleck (z. B. Sandgrus): Scheibe, jeder Punkt auf dem Boden
function ttFleck(x,z,r,col){ const g=new THREE.CircleGeometry(r,24); g.rotateX(-Math.PI/2); const p=g.attributes.position;
  for(let i=0;i<p.count;i++){ const px=x+p.getX(i), pz=z+p.getZ(i), f=i?.75+.25*Math.sin(i*2.3):1; p.setXYZ(i,(px-x)*f+x,bodenY((px-x)*f+x,(pz-z)*f+z)+.07,(pz-z)*f+z); }
  g.computeVertexNormals(); const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:col,polygonOffset:true,polygonOffsetFactor:-2})); m.userData.ohneBoden=true; world.add(m); return m; }

// ---- Gelände (aus build3D, vor dem Gelände-Mesh): Felshügel unter dem Teufelstisch, damit er über den Weg hinausragt (Wegrand bleibt eben) ----
function teufelstischGelaende(h,src,dist){ const T=R.tt, H=TT_HUEGEL, n=TER.nx, res=TER.res, [tx,tz]=T.tischPos;
  for(let j=0;j<TER.nz;j++) for(let i=0;i<n;i++){ const x=i*res+TER.x0, z=j*res+TER.z0, rr=Math.hypot(x-tx,z-tz); if(rr>=H.r) continue; const k=j*n+i, w=1-rr/H.r, kk=w*w*(3-2*w), rand=Math.min(1,Math.max(0,(dist[k]-4)/6));
    h[k]+=H.h*kk*rand; }
  // Blick auf die Dahner Felsen: Gelände zwischen Weg und Felsen fällt zum Tal (≈ 30 m), vorher lag ein Hügel davor · Lagerplatz eben auf Weghöhe
  const D=[T.dahn.x,T.dahn.y], yE=roadY(T.ziel)-.45, L=T.lager;
  for(let j=0;j<TER.nz;j++) for(let i=0;i<n;i++){ const x=i*res+TER.x0, z=j*res+TER.z0, k=j*n+i; if(dist[k]<12) continue;
    let w=0, tgt=1e9; for(const p of T.blick){ const a=ttSegAbst(x,z,p,D), dx=D[0]-p[0], dz=D[1]-p[1], t=Math.max(0,Math.min(1,((x-p[0])*dx+(z-p[1])*dz)/(dx*dx+dz*dz))); w=Math.max(w,1-bSm((a-TT_DAHN.breit-20)/60)); tgt=Math.min(tgt,yE-1-30*bSm(t*1.3)); }
    if(w>0&&h[k]>tgt) h[k]+=(tgt-h[k])*w*Math.min(1,(dist[k]-12)/12);
    const rl=Math.hypot(x-L.x,z-L.y); if(rl<16) h[k]+=(yE-h[k])*(1-bSm((rl-9)/7)); }
  // Idylle: rechts der Abzweigung fällt das Gelände zum Hang ab (der Seitenweg zum Jungfernsprung führt hinunter)
  if(T.seitenweg){ const Z=TT_IDYLL.hang, [sx,sz]=posAt(R,T.idyll), hd=headingAt(R,T.idyll), c=Math.cos(hd), sn=Math.sin(hd), y0=roadY(T.idyll)-.45;
    for(let j=0;j<TER.nz;j++) for(let i=0;i<n;i++){ const x=i*res+TER.x0, z=j*res+TER.z0, k=j*n+i; if(dist[k]<6) continue; const a=(x-sx)*c+(z-sz)*sn, b=-(x-sx)*sn+(z-sz)*c; if(b<4) continue;
      const w=(1-bSm((Math.abs(a-Z.mitte)-Z.lang)/Z.rand))*bSm((b-4)/10)*Math.min(1,(dist[k]-6)/12), tgt=y0-Math.min(Z.tief,(b-4)*Z.steil); if(w>0&&h[k]>tgt) h[k]+=(tgt-h[k])*w; }
    // Fernblick vor dem Wegweiser: der Bergrücken in Blickrichtung fällt zum Talboden ab, See als Mulde, Dorf eben (TT_TAL)
    const Z2=TT_TAL, [wx,wz]=T.idyllSchild, a0=T.talSicht.a0, fy=T.talY=y0-Z2.tief, Se=T.see, Df=T.dorf, sc=Math.cos(Se.ry), ss=Math.sin(Se.ry);
    for(let j=0;j<TER.nz;j++) for(let i=0;i<n;i++){ const x=i*res+TER.x0, z=j*res+TER.z0, k=j*n+i; if(dist[k]<6) continue; const r=Math.hypot(x-wx,z-wz), sw=r<120?Math.min(1,(dist[k]-6)/14):bSm((dist[k]-25)/90); // weiter weg sanft zur Strecke hin (Schleife und Weg nach Dahn bleiben auf ihrer Höhe)
      if(r>=10&&r<=Z2.bis+Z2.rand){ const da=Math.atan2(Math.sin(Math.atan2(z-wz,x-wx)-a0),Math.cos(Math.atan2(z-wz,x-wx)-a0)), w=(1-bSm((-da-Z2.links)/Z2.wRand))*(1-bSm((da-Z2.rechts)/Z2.wRand))*(1-bSm((r-Z2.bis)/Z2.rand))*sw, tgt=y0-Z2.tief*bSm((r-10)/Z2.lang);
        if(w>0&&h[k]>tgt) h[k]+=(tgt-h[k])*w; }
      if(dist[k]<20) continue; const ff=Math.min(1,(dist[k]-20)/20), ex=x-Se.x, ez=z-Se.y, e=Math.hypot((ex*sc+ez*ss)/Se.rx,(-ex*ss+ez*sc)/Se.rz);
      if(e<1.7) h[k]+=(fy-4*(1-bSm((e-.5)/.6))-h[k])*(1-bSm((e-1)/.7))*ff; // See: flache Mulde, Ufer auf dem Talboden
      const rd=Math.hypot(x-Df.x,z-Df.y); if(rd<Z2.dorf.r+70) h[k]+=(fy+2-h[k])*(1-bSm((rd-Z2.dorf.r)/70))*ff; } } }
// ---- Bewegung (jeden Frame, aus rennen.js) ----
function poseTeufelstisch(dt){ const A=anim.tt; if(!A) return; ttLicht(race.state==='run'?race.t:0); poseTeufel(dt); poseTeufelstischLeben(dt); sicher('Gasthaus-Szene',()=>poseTtGast(dt)); sicher('Lager-Szene',()=>poseTtLager(dt)); sicher('Fuhrwerk',()=>poseTtFuhre(dt));
  const F=A.feuer; if(F){ const g=Math.min(1,F.an||0); F.fl.visible=F.fl2.visible=g>0; F.fli.intensity=0; if(g>0){ const t=performance.now()/1000, f=.85+.15*Math.sin(t*11)+.08*Math.sin(t*23); F.fl.scale.set(g,f*g,g); F.fl2.scale.set(g,(1.1-f*.2)*g,g); F.fli.intensity=1.6*f*g; } } } // Lagerfeuer: wächst nach dem Anzünden (an 0 … 1, Schlussszene), flackert

// ---- Sonnenuntergang im Ausfahren (vom Nutzer gewünscht): bis dahin Mittag, dann golden, am Ende Sonne tief und orange am Horizont ----
// Stufe k: 0 wie beim Start (Tag, auch Herbst) · 1 goldener Spätnachmittag · 2 Sonnenuntergang; Himmel als eigener Verlauf, fließend vom Tag- zum Abendhimmel
const TT_LICHT={sun:[0,0xffc078,0xff7a44], sunI:[0,1.3,1.1], sunY:[0,.25,.04], sunZ:[0,.42,.42], hemi:[0,0xd8c8b0,0x9c8cb8], boden:[0,0x4a3a2a,0x3a2a26], hemiI:[0,.7,.6], bg:[0,0xf0c890,0xf09a6a]};
const TT_HIMMEL=[[0,'#3f7dbf','#22305e'],[.22,'#5f97ce','#5b4a7e'],[.3,'#7fb0dc','#a05e74'],[.36,'#a8c8e3','#c46a6a'],[.45,'#cfe0ea','#f0955e'],[.5,'#e9e6dc','#f6b46e'],[1,'#e9e6dc','#f6b46e']]; // [Höhe, Tag, Abend]
// Unwetter oben am Berg (vom Nutzer): schlagartig, sobald die Kamera vom Jungfernsprung ganz zurück bei den Fahrern ist (ohne Kamerafahrt so viele m hinter dem Wegweiser) – dunkel, grau, Wolken, Wind und Regen, bleibt bis ins Ausfahren, dann klart es zum Sonnenuntergang auf
const TT_WETTER={nach:45, klar:.3, sun:0x9aa2aa, sunI:.3, hemi:0x8c949e, hemiI:.72, bg:0x5c646e, himmel:0x707882, nebel:[60,750], wind:.5, boe:1.4}; // boe: Wind auf den Lichtungen (schräger Regen, Laub)
function ttWetterW(rt){ const Z=TT_WETTER, A=anim.tt, T=R.tt, au=(race.woSegs||[]).find(s=>s.label==='Ausfahren'), k=au?1-bSm((rt-au.t0)/(au.dur*Z.klar)):1, C=TT_BOGEN.kam, ik=A&&A.ikT;
  const an=ik!=null&&ik>0?rt>=ik+C[1]+C[2]+.2:me.d>=T.idyll+Z.nach, p=ttPauseW(rt); return an?[k*p,k*Math.max(p,TT_PAUSE.wolken)]:[0,0]; } // [Licht/Regen, Wolken]
// Pause nach Flucht 1 (vom Nutzer): klart auf (nach klar s recht sonnig, aber nicht ganz wie vorher), verdüstert sich langsam wieder, nach der Abzweigung „sicher rechts“ wieder volles Unwetter
const TT_PAUSE={klar:150, hell:.12, dunkel:.4, wolken:.3, kipp:[15,90]}; // s bis aufgeklart · Unwetter-Stärke dann · an der Abzweigung · Wolken bleiben mindestens · ab m nach der Abzweigung, über m wieder voll
function ttPauseW(rt){ const T=R.tt, Z=TT_PAUSE, a=(race.woSegs||[]).find(s=>s.label==='Abgeschüttelt'); if(!a||T.ecke==null||rt<a.t0) return 1; const kipp=bSm((me.d-T.ecke-Z.kipp[0])/Z.kipp[1]); if(kipp>=1) return 1;
  const tE=T.tEcke||a.t0+a.dur, kl=Math.max(a.t0+20,Math.min(a.t0+Z.klar,tE-30)), w=rt<kl?1-(1-Z.hell)*bSm((rt-a.t0)/(kl-a.t0)):Z.hell+(Z.dunkel-Z.hell)*bSm((rt-kl)/Math.max(1,tE-kl)); return Math.max(w,kipp); }
// Wind auf den Lichtungen der Schleife (beide Runden): {w 0 … 1, s Seite, zu der er drückt (+1 = rechts)}
function ttWind(d){ const T=R&&R.tt; if(!T||!T.lichtung||race.state!=='run') return null; const e=d>=T.kreuz+T.L&&d<T.raus?d-T.L:d; for(const Li of T.lichtung){ const w=bSm((e-Li.d0+12)/14)*bSm((Li.d1+12-e)/14); if(w>0) return {w,s:Li.s}; } return null; }
function ttLicht(rt){ const A=anim.tt, Z=TT_WETTER; if(race.rain||race.state!=='run'&&race.state!=='count') return; // nach dem Ziel bleibt der Sonnenuntergang
  const S=race.woSegs||[], au=S.find(s=>s.label==='Ausfahren'), k=race.state==='run'&&au?2*bSm((rt-au.t0)/au.dur):0, [w,wk]=race.state==='run'?ttWetterW(rt):[0,0], bo=ttWind(me.d); A.boe=(A.boe||0)+((bo?bo.w*w:0)-(A.boe||0))*.08; ttWolken(wk,rt); regen.extra=clampN((w-.25)/.6,0,1); regen.wind=Z.wind*w+Z.boe*A.boe*(bo?bo.s:1);
  if(k<=0&&w<=0){ if(A.l0){ applyEnv(); sky.material.color.set(0xffffff); scene.fog.near=A.l0.fn; scene.fog.far=A.l0.ff; A.l0=null; A.hk=-1; } return; } // vor dem Waldweg und vor dem Ausfahren (oder nach einem Sprung zurück): normales Tageslicht
  if(!A.l0) A.l0={sun:sun.color.getHex(), sunI:sun.intensity, sunY:-SUN_DIR.y/SUN_DIR.x, sunZ:-SUN_DIR.z/SUN_DIR.x, hemi:hemi.color.getHex(), boden:hemi.groundColor.getHex(), hemiI:hemi.intensity, bg:scene.background.getHex(), fn:scene.fog.near, ff:scene.fog.far}; // Startwerte merken
  const L=TT_LICHT, i=k<1?0:1, f=k-i, v=(n,j)=>j?L[n][j]:A.l0[n], c=(n,o)=>o.set(v(n,i)).lerp(new THREE.Color(v(n,i+1)),f), z=n=>v(n,i)+(v(n,i+1)-v(n,i))*f;
  c('sun',sun.color); sun.intensity=z('sunI'); c('hemi',hemi.color); c('boden',hemi.groundColor); hemi.intensity=z('hemiI'); c('bg',scene.background);
  const sy=z('sunY'); SUN_DIR.set(-1,sy,z('sunZ')).normalize(); sunDisc(k>.5); if(SUNS) SUNS.forEach((s,j)=>s.material.opacity=(j?1:.75)*clampN((k-.5)/.6,0,1)); // Sonne wandert vom Tagesstand nach Westen hinab
  { const C=new THREE.Color(); sun.color.lerp(C.set(Z.sun),w); sun.intensity*=1-(1-Z.sunI)*w; hemi.color.lerp(C.set(Z.hemi),w); hemi.intensity*=1-(1-Z.hemiI)*w; scene.background.lerp(C.set(Z.bg),w); scene.fog.color.copy(scene.background); // Unwetter: fahles Licht, grauer Dunst
    scene.fog.near=A.l0.fn+(Z.nebel[0]-A.l0.fn)*w; scene.fog.far=A.l0.ff+(Z.nebel[1]-A.l0.ff)*w; sky.material.color.set(0xffffff).lerp(C.set(Z.himmel),w); }
  const hk=Math.round(k*50)/100; if(k>0&&hk!==A.hk){ A.hk=hk; // Himmelsverlauf nur neu malen, wenn er sich merklich ändert
    if(!A.himmel){ const cv=document.createElement('canvas'); cv.width=4; cv.height=256; A.himmel=new THREE.CanvasTexture(cv); A.himmel.cv=cv; }
    const g=A.himmel.cv.getContext('2d'), gr=g.createLinearGradient(0,0,0,256), C=new THREE.Color(), D=new THREE.Color(); for(const [o,a,b] of TT_HIMMEL) gr.addColorStop(o,'#'+C.set(a).lerp(D.set(b),hk).getHexString());
    g.fillStyle=gr; g.fillRect(0,0,4,256); A.himmel.needsUpdate=true; if(sky.material.map!==A.himmel){ sky.material.map=A.himmel; sky.material.needsUpdate=true; } } }
// Regenwolken über dem Berg: dunkle Ballen ziehen mit dem Wind über den Tisch, Blätter und Nadeln wirbeln um dich herum
function ttWolken(wk,rt){ const A=anim.tt, T=R.tt; if(!A.wolken){ if(wk<=0) return; const cv=document.createElement('canvas'); cv.width=cv.height=128; const g=cv.getContext('2d'), q=rng(808);
    for(let i=0;i<14;i++){ const x=30+q()*68, y=45+q()*40, r=16+q()*26, gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,128,128); }
    const tex=new THREE.CanvasTexture(cv), [tx,tz]=T.tischPos, ty=bodenY(tx,tz); A.wolken=[]; for(let i=0;i<22;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:i%3?'#4a525c':'#5e6670',transparent:true,depthWrite:false,opacity:0})), a=q()*6.28, r=q()*700;
      s.userData={x:tx+Math.cos(a)*r, z:tz+Math.sin(a)*r, y:ty+110+q()*90, sc:180+q()*160}; s.userData.ohneBoden=true; s.scale.set(s.userData.sc,s.userData.sc*.45,1); world.add(s); A.wolken.push(s); }
    const n=160, p=new Float32Array(n*3); A.laub={P:new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(p,3)),new THREE.PointsMaterial({color:'#5a4228',size:.12,transparent:true,opacity:0})), p, o:Array.from({length:n},()=>[(q()-.5)*40,q()*9,(q()-.5)*40,.6+q()*.8])}; A.laub.P.frustumCulled=false; A.laub.P.userData.ohneBoden=true; world.add(A.laub.P); }
  const Z=TT_WETTER, [tx,tz]=T.tischPos, wx=Math.cos(.6)*14, wz=Math.sin(.6)*14; A.wolken.forEach((s,i)=>{ const u=s.userData; s.visible=wk>0; let x=u.x+wx*rt%1400, z=u.z+wz*rt%1400; x=tx+((x-tx+700)%1400+1400)%1400-700; z=tz+((z-tz+700)%1400+1400)%1400-700; s.position.set(x,u.y,z); s.material.opacity=.85*wk; }); // ziehen schnell über den Berg
  const L=A.laub, c=camera.position, on=wk>.5; L.P.visible=on; if(!on) return; L.P.material.opacity=bSm((wk-.5)/.3); const dl=rt-(A.lt!=null?A.lt:rt); A.lt=rt; A.lph=(A.lph||0)+Math.max(0,Math.min(1,dl))*(1+2.5*(A.boe||0)); const ph=A.lph; L.o.forEach((o,i)=>{ const x=((o[0]+ph*9*o[3])%40+60)%40-20, z=((o[2]+ph*6*o[3])%40+60)%40-20, y=o[1]+Math.sin(rt*3+i)*1.2; L.p.set([c.x+x,c.y-2+y,c.z+z],i*3); }); L.P.geometry.attributes.position.needsUpdate=true; } // Laub fliegt im Wind
