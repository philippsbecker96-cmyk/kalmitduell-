/* ================= Südpfalz-Klassiker: Wahrzeichen und Typisches am Weg ================= */
// Lage aus echten Koordinaten umgerechnet (Ursprung = komoot-Start 49,2046° N 8,0771° E; x nach Osten, z nach Süden, m)
const SP_KALMITCHEN={x:-1422, z:2043, top:271, r:260}; // Kleine Kalmit (271 m ü. NN) mit Kapelle, links neben dem Radweg vor Ilbesheim
const SP_QUEICH=[[-8031,113],[-3568,-1750]];            // Queichtal Annweiler → Albersweiler: Senke in der Haardt
const SP_KUPPEN=[['madenburg',-5019,4047,345,650],['trifels',-7143,949,435,420],['anebos',-7180,1380,395,360],['muenz',-7240,1820,405,380]]; // [Burg, x, z, Höhe über der Ebene, Radius] – etwas überhöht, damit die Burgen über die vorderen Hänge schauen
const SP_DUNST=new THREE.Color('#aab8c2'), SP_TROCKEN=new THREE.Color('#aaa461');
const SP_WEINGUT=['Becker','Dengel','Hauck','Seiler','Kuntz','Frey','Wolf','Mayer'];

// ---- Haardt: Queichtal und Burgberge (aus haardtRise, welt-kalmit.js) ----
function spHaardt(x,z,rise){ const [[ax,az],[bx,bz]]=SP_QUEICH, ux=bx-ax, uz=bz-az, t=Math.max(0,Math.min(1,((x-ax)*ux+(z-az)*uz)/(ux*ux+uz*uz))), f=Math.exp(-((x-ax-ux*t)**2+(z-az-uz*t)**2)/(420*420));
  rise=rise*(1-.8*f)+f*(1-t)*60; // Talboden steigt Richtung Annweiler leicht an
  for(const [,kx,kz,H,r] of SP_KUPPEN) rise=Math.max(rise, H*Math.exp(-((x-kx)**2+(z-kz)**2)/(r*r)));
  return rise; }

// ---- Kleine Kalmit: Kuppe im Gelände (aus build3D), Reben am Hang, oben Trockenrasen ----
function spKalmitchenG(x,z){ const K=SP_KALMITCHEN; return Math.exp(-((x-K.x)**2+(z-K.z)**2)/(K.r*K.r)); }
function spKalmitchenY(x,z,plainY){ return plainY+(SP_KALMITCHEN.top-R.startElev-plainY)*spKalmitchenG(x,z); }
function spKalmitchenFarbe(x,z,tc,cVine){ const g=spKalmitchenG(x,z); if(g>.3) tc.lerp(cVine, Math.min(1,(g-.3)*5)); if(g>.86) tc.lerp(SP_TROCKEN, Math.min(1,(g-.86)*10)); }

// ---- Vorbereitung (aus buildRoute): Plätze für Häuschen, Kreuze, Bänke, Schilder; Reben und Bäume dort weg ----
function prepSuedpfalz(r){ const T=r.def.typisch, S=r.S, q=rng(321), P=r.sp={haeusel:[],kreuz:[],bank:[],weinstr:[],wein:[]};
  const fr=(d,sd,o,al=0)=>{ const [px,py]=posAt(r,d), h=headingAt(r,d), nx=-Math.sin(h), ny=Math.cos(h), rw=roadW(r,d)/2; return {x:px+nx*sd*(rw+o)+Math.cos(h)*al, y:py+ny*sd*(rw+o)+Math.sin(h)*al, h, d, side:sd, nx, ny}; };
  const frei=(x,y,rad)=>{ for(const k of ['vine','vpost','tree','bush','weg','grass','post']) S[k]=S[k].filter(o=>Math.hypot(o.x-x,o.y-y)>rad); };
  T.haeusel.forEach(([d,sd,o])=>{ const p=fr(d,sd,o); p.dach=q()<.5; p.c=q(); frei(p.x,p.y,5.5); P.haeusel.push(p); });
  T.kreuz.forEach(([d,sd],i)=>{ const w=r.wege.reduce((b,w)=>Math.abs(w-d)<Math.abs(b-d)?w:b, -1e9), p=fr(Math.abs(w-d)<120?w+4.5:d,sd,1.7); p.art=i%2; frei(p.x,p.y,1.6); P.kreuz.push(p); }); // neben dem Wirtschaftsweg
  T.bank.forEach(([d,sd])=>{ const p=fr(d,sd,2.3), b=fr(d+3.2,sd,4.8); frei(p.x,p.y,3); frei(b.x,b.y,4.5); S.tree.push({x:b.x, y:b.y, s:3.2, c:q(), pine:false, ht:4}); P.bank.push(p); }); // Nussbaum daneben
  T.weinstr.forEach(([d,sd])=>{ const p=fr(d,sd,1.5); frei(p.x,p.y,1.8); P.weinstr.push(p); });
  // Kleine Kalmit: ein paar Bäume um die Kapelle
  const K=SP_KALMITCHEN; for(let i=0;i<7;i++){ const a=i/7*6.28+q()*.5, o=16+q()*14; S.tree.push({x:K.x+Math.cos(a)*o, y:K.z+Math.sin(a)*o, s:2.6+q()*1.4, c:q(), pine:i%3===0, ht:9+q()*4}); }
  // Weinverkauf, Weingut, Straußwirtschaft über einem Teil der Hoftore
  for(const o of S.tor){ const z=zoneOf(r,o.d); if(!z||z[0]!=='ort'||o.w<2.6||q()>.3) continue; const u=q(); P.wein.push({o, art:u<.2?2:u<.6?1:0, n:SP_WEINGUT[q()*SP_WEINGUT.length|0]}); } }

// ---- Aufbau (aus build3D) ----
function buildSuedpfalz(plainY){ const P=R.sp; if(!P) return;
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d), add=(G,geo,m,x,y,z,ry=0)=>{ const o=new THREE.Mesh(geo,m); o.position.set(x,y,z); o.rotation.y=ry; G.add(o); return o; };
  const grp=(x,y,z,ry=0)=>{ const G=new THREE.Group(); G.position.set(x,y,z); G.rotation.y=ry; world.add(G); return G; };
  for(const [art,x,z] of SP_KUPPEN) spBurg(art,x,z,plainY,B,add);
  spHaardtWald(plainY);

  // Kapelle auf der Kleinen Kalmit: weiß, Ziegeldach, Dachreiter mit Kreuz
  { const K=SP_KALMITCHEN, G=grp(K.x,bodenY(K.x,K.z)-.3,K.z,.4), wand=lam('#eee8dc'), dach=lam('#9c4a36'), dunkel=lam('#3a3330'); G.userData.ohneBoden=true;
    add(G,B(9,5.4,5.8),wand,0,2.7,0); add(G,gableGeo(9.6,6.4,3),dach,0,5.4,0); add(G,B(2.6,3.6,3.4),wand,-5.8,1.8,0); add(G,gableGeo(3,3.8,1.4),dach,-5.8,3.6,0); // Schiff und Apsis
    add(G,B(1.6,2.4,1.6),wand,3.4,7.4,0); add(G,new THREE.ConeGeometry(1.25,2.6,4),lam('#5d5f66'),3.4,9.9,0,Math.PI/4); add(G,B(.12,1.1,.12),dunkel,3.4,11.6,0); add(G,B(.6,.12,.12),dunkel,3.4,11.75,0);
    add(G,B(.05,2.4,1.5),dunkel,4.52,1.2,0); for(const s of [-1,1]) add(G,B(1.2,1.6,.05),dunkel,.5,3.2,s*2.92); } // Tür vorne, Fenster seitlich

  // Wingertshäuschen: Sandstein, Ziegeldach (Satteldach oder Zeltdach), Tür zum Weg; am Hang bergseitig eingegraben
  const sand=lam('#b4806a'), sand2=lam('#a8735e'), ziegel=lam('#a3452f'), dunkel=lam('#3b2c27'), holz=lam('#8a5a35');
  for(const p of P.haeusel){ const y=Math.min(...[[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]].map(([a,b])=>bodenY(p.x+Math.cos(p.h)*a+p.nx*b,p.y+Math.sin(p.h)*a+p.ny*b)));
    const G=grp(p.x,y,p.y,-p.h); G.userData.ohneBoden=true; add(G,B(3.2,2.9,3.2),p.c<.5?sand:sand2,0,1.05,0);
    if(p.dach) add(G,gableGeo(3.7,3.8,1.5),ziegel,0,2.5,0); else add(G,new THREE.ConeGeometry(2.6,1.7,4),ziegel,0,3.35,0,Math.PI/4);
    add(G,B(.9,1.8,.06),dunkel,0,1.4,-p.side*1.62); }

  // Wegkreuz (Sandstein) und Bildstock (Säule mit Nische) am Wirtschaftsweg, zur Straße gedreht
  for(const p of P.kreuz){ const G=grp(p.x,bodenY(p.x,p.y),p.y,Math.atan2(-p.side*p.nx,-p.side*p.ny)), st=lam('#a8654f'); G.userData.ohneBoden=true; // Sockel steckt 10 cm im Boden
    if(p.art===0){ add(G,B(.75,.8,.75),st,0,.3,0); add(G,B(.26,2.2,.22),st,0,1.8,0); add(G,B(1.05,.24,.22),st,0,2.35,0); add(G,B(.9,.12,.06),lam('#d8d2c4'),0,1.15,.12); }
    else { add(G,B(.6,.4,.6),st,0,.1,0); add(G,B(.34,1.5,.34),st,0,1.05,0); add(G,B(.64,.72,.5),st,0,2.16,0); add(G,gableGeo(.8,.62,.3),st,0,2.52,0); add(G,B(.36,.46,.04),dunkel,0,2.16,.24); } }

  // Bänke mit Blick ins Land: Rücken zur Straße
  for(const p of P.bank){ const G=grp(p.x,bodenY(p.x,p.y),p.y,Math.atan2(p.side*p.nx,p.side*p.ny));
    add(G,B(1.9,.06,.42),holz,0,.46,0); add(G,B(1.9,.36,.05),holz,0,.78,-.24); for(const s of [-.8,.8]){ add(G,B(.07,.46,.4),lam('#555'),s,.2,0); add(G,B(.07,.62,.05),lam('#555'),s,.62,-.22); } }

  // Schild „Deutsche Weinstraße“ (braun) vor Leinsweiler und Ranschbach, den Kommenden zugewandt
  { const tx=canvasTex(512,232,g=>{ g.fillStyle='#6b3a1e'; g.fillRect(0,0,512,232); g.strokeStyle='#f4efe6'; g.lineWidth=8; g.strokeRect(10,10,492,212);
      g.fillStyle='#f4efe6'; for(const [a,b] of [[0,0],[-1,1],[1,1],[-2,2],[0,2],[2,2],[-1,3],[1,3],[0,4]]) { g.beginPath(); g.arc(88+a*15,62+b*24,13,0,7); g.fill(); }
      g.fillRect(85,30,6,14); g.beginPath(); g.ellipse(112,44,18,9,-.4,0,7); g.fill(); // Traube mit Blatt
      g.font='bold 52px Barlow, Arial, sans-serif'; g.textBaseline='middle'; g.fillText('Deutsche',160,82); g.fillText('Weinstraße',160,150); });
    const mv=new THREE.MeshLambertMaterial({map:tx}), mb=lam('#5a311a'), pf=lam('#9aa0a6');
    for(const p of P.weinstr){ const G=grp(p.x,bodenY(p.x,p.y),p.y,Math.atan2(-Math.cos(p.h),-Math.sin(p.h)));
      G.userData.ohneBoden=true; for(const s of [-.85,.85]) add(G,B(.08,3,.08),pf,s,1.2,-.04); add(G,B(2.4,1.09,.05),[mb,mb,mb,mb,mv,mb],0,2.05,0); } } // Pfosten stecken 30 cm im Boden

  // Weinverkauf, Weingut, Straußwirtschaft: Holzschild über dem Hoftor
  const tafel={}, tafelMat=(art,n)=>{ const k=art+n; return tafel[k]||(tafel[k]=new THREE.MeshLambertMaterial({map:canvasTex(256,100,g=>{
    const [bg,fg]=art===1?['#2f4a32','#e2c46a']:art===2?['#f3ecdc','#8a2f22']:['#efe4c8','#3d5a2c']; g.fillStyle='#6a4628'; g.fillRect(0,0,256,100); g.fillStyle=bg; g.fillRect(6,6,244,88); g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle';
    if(art===1){ g.font='italic 22px Georgia, serif'; g.fillText('Weingut',128,32); g.font='bold 34px Georgia, serif'; g.fillText(n,128,66); }
    else if(art===2){ g.font='bold 25px Georgia, serif'; g.fillText('Straußwirtschaft',138,34); g.font='italic 24px Georgia, serif'; g.fillText('geöffnet',138,68);
      g.strokeStyle='#7a5a2a'; g.lineWidth=2; for(let i=-4;i<=4;i++){ g.beginPath(); g.moveTo(22,24); g.lineTo(22+i*3,78); g.stroke(); } } // Strauß (Besen)
    else { g.font='bold 32px Georgia, serif'; g.fillText('Weinverkauf',128,40); g.font='18px Georgia, serif'; g.fillText('Probe · Verkauf',128,72); } })})); };
  for(const {o,art,n} of P.wein){ const a=Math.atan2(-Math.sin(o.h)*-o.side, Math.cos(o.h)*-o.side), m=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.45),tafelMat(art,n));
    m.position.set(o.x+Math.sin(a)*.23, roadY(o.d)+2.1, o.y+Math.cos(a)*.23); m.rotation.y=a; m.userData.ohneBoden=true; world.add(m); } }

// ---- Burgen auf der Haardt: Madenburg, Trifels mit Anebos und Münz – ohne Nebel, mit Dunst je Entfernung wie die Berge ----
function spBurg(art,x,z,plainY,B,add){ const w=HAARDT.fuss(z)-x, k=.18+.45*hSm(w/5000), m=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c).lerp(SP_DUNST,k), fog:false});
  const fels=m('#9c5e48'), stein=m('#b98d70'), dunkel=m('#3b2c27'), G=new THREE.Group(), D=(r)=>new THREE.DodecahedronGeometry(r,0);
  if(art==='trifels'){ // Burgfels, Bergfried mit Zeltdach, Palas mit Satteldach (lange Seite nach Osten)
    add(G,B(36,24,18),fels,0,2,0); add(G,D(10),fels,-13,0,6); add(G,D(9),fels,14,-2,-5); add(G,B(34,4,16),stein,0,16,0);
    add(G,B(10,24,10),stein,-10,26,0); add(G,new THREE.ConeGeometry(7.6,6,4),m('#5d5f66'),-10,41,0,Math.PI/4);
    add(G,B(17,11,9),stein,5,23.5,0); add(G,gableGeo(17.6,9.6,5),m('#9a4634'),5,29,0); G.rotation.y=Math.PI/2; }
  if(art==='madenburg'){ // große Ruine: Schildmauer nach Osten mit Fensterhöhlen, Türme, Seitenmauern
    add(G,B(34,8,48),fels,0,-2,0); add(G,B(3,15,44),stein,12,9.5,0); add(G,B(3,10,30),stein,-10,7,0); for(const s of [-1,1]) add(G,B(22,9,3),stein,1,6.5,s*21);
    add(G,B(9,20,9),stein,12,12,-22); add(G,B(8,13,8),stein,12,8.5,22); for(let i=-3;i<=3;i++) add(G,B(.6,3,1.8),dunkel,13.6,12,i*5); }
  if(art==='muenz'){ add(G,B(16,18,14),fels,0,0,0); add(G,D(8),fels,6,-3,5); add(G,B(8,20,8),stein,0,19,0); for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]]) add(G,B(1.6,1.4,1.6),stein,a,29.7,b); }
  if(art==='anebos'){ add(G,B(18,14,12),fels,0,0,0); add(G,D(8),fels,-6,2,3); add(G,B(6,4,6),stein,2,8.5,0); }
  G.scale.setScalar(1.7); G.userData.ohneBoden=true; G.position.set(x,plainY+haardtY(x,z)-4,z); world.add(G); }

// ---- Esskastanien und Laubwald am Haardtrand zwischen Godramstein und Eschbach (nicht direkt an der Strecke) ----
function spHaardtWald(plainY){ const q=rng(4711), L=[], HB=race.season==='herbst', rp=[]; for(let i=0;i<R.xs.length;i+=10) rp.push([R.xs[i],R.ys[i]]);
  const inTer=(x,z)=>x>TER.x0&&z>TER.z0&&x<TER.x0+(TER.nx-2)*TER.res&&z<TER.z0+(TER.nz-2)*TER.res;
  for(let zz=-600; zz<4600; zz+=26) for(let ww=40; ww<1250; ww+=26){ const z=zz+(q()-.5)*22, w=ww+(q()-.5)*22, x=HAARDT.fuss(z)-w;
    if(w<70+vnoise(z/320,4.2)*260) continue; // Waldrand mit Buchten, darunter Reben
    if(rp.some(([a,b])=>Math.abs(a-x)<240&&Math.abs(b-z)<240&&Math.hypot(a-x,b-z)<240)) continue;
    if(SP_KUPPEN.some(([,kx,kz])=>Math.hypot(kx-x,kz-z)<70)) continue;
    let y=plainY+haardtY(x,z); if(inTer(x,z)) y=Math.max(y,terrainAt(x,z));
    L.push({x,z,y,s:5+q()*4,c:q(),k:.18+.45*hSm(w/5000)}); }
  if(!L.length) return; const im=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0), new THREE.MeshLambertMaterial({fog:false}), L.length), m4=new THREE.Matrix4(), qq=new THREE.Quaternion(), up=new THREE.Vector3(0,1,0), c=new THREE.Color();
  const GR=['#7d9a3e','#6a8a3a','#4f6e35','#5d7d3a'], HE=['#c9a040','#b8862e','#a8682a','#8a7a3a']; // Kastanie hellgrün, Buche, Eiche · Herbst: golden, rostbraun
  L.forEach((o,i)=>{ qq.setFromAxisAngle(up,o.c*6); m4.compose(new THREE.Vector3(o.x,o.y+o.s*.6,o.z),qq,new THREE.Vector3(o.s,o.s*.85,o.s)); im.setMatrixAt(i,m4); im.setColorAt(i,c.set((HB?HE:GR)[o.c*4|0]).lerp(SP_DUNST,o.k)); });
  im.instanceMatrix.needsUpdate=true; im.instanceColor.needsUpdate=true; world.add(im); }
