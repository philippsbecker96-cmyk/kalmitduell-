/* ================= Trifels: Welt für Kampagnen-Mission 1 ================= */
// Burg Trifels (Vorlage: Rekonstruktion um 1280, Bilder in vorlagen/trifels/) auf einem Sandstein-Felsrücken über der Vorburg, Vorburg mit Hütten um den Platz des Goldkarrens,
// Wirtshaus im Tal, Laternen am Weg. Strecke und Meter: trifelsDef (strecke.js), R.def.orte. Konzept: KAMPAGNE.md
//   prepTrifels aus buildRoute (Plätze freiräumen) · trifelsGelaende aus build3D (ebene Vorburg, Burgberg) · buildTrifels aus build3D · poseTrifels aus draw (rennen.js)

// ---- Vorbereitung (beim Streckenbau): Vorburg und Burgfelsen frei von Bäumen, Häuser am Wirtshaus mittelalterlich, Wirtshaus wählen ----
const TRI_HUETTEN=[-.06,-.15,-.62,-.71,-.8,-.89]; // Hütten der Vorburg: Winkel (× π) um den Karrenplatz, Lücke für den Burgweg
function prepTrifels(r){ const O=r.def.orte, S=r.S, q=rng(77), kf=r.kf, [kx,ky]=O.karren, [bx,by]=O.burg, rh=(O.hof[1]-O.hof[0])*kf/Math.PI;
  r.tri={karren:O.karren, burg:O.burg, rh, hof:O.hof.map(d=>d*kf), aud:O.audienz*kf, sturz:O.sturz*kf, ziel:O.ziel*kf, wirtD:O.wirtshaus*kf, tS:O.tS, tW:O.tW, jagd:O.jagd.map(d=>d*kf), loewenherz:O.loewenherz*kf};
  // Burgwald bis an die Vorburg (vom Nutzer gewünscht), frei nur: Kisten in der Kehre, Burgfelsen, Hütten, Burgweg, Burgherr mit Wachen
  const frei=[[kx,ky,13]]; for(let x=-62;x<=52;x+=10) frei.push([bx+x,by,15]);
  for(const f of TRI_HUETTEN) frei.push([kx+Math.cos(Math.PI*f)*(rh+12), ky+Math.sin(Math.PI*f)*(rh+12), 7]);
  { const x0=kx, z0=ky-rh-3, x2=bx+46, z2=by+17, cx=kx+40, cz=ky-rh-6; for(let i=0;i<=20;i++){ const t=i/20; frei.push([(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x2, (1-t)*(1-t)*z0+2*(1-t)*t*cz+t*t*z2, 5]); } }
  { const bd=r.tri.aud+3, o=roadW(r,bd)/2+1.8; for(const da of [-2,0,2]){ const [px,py]=posAt(r,bd+da), h=headingAt(r,bd+da); frei.push([px+Math.sin(h)*o, py-Math.cos(h)*o, 3.5]); } }
  { const sd=r.tri.sturz; for(let da=-14;da<=14;da+=4){ const [px,py]=posAt(r,sd+da), h=headingAt(r,sd+da); for(const o of [3.5,7]) frei.push([px-Math.sin(h)*(roadW(r,sd+da)/2+o), py+Math.cos(h)*(roadW(r,sd+da)/2+o), 3]); } } // Sturzstelle: rechts frei für Seitenkamera und Sturz
  { const zd=r.tri.ziel+10, [px,py]=posAt(r,zd), h=headingAt(r,zd), o=roadW(r,zd)/2+7; r.tri.gast={d:zd, x:px-Math.sin(h)*o, y:py+Math.cos(h)*o, h, o}; frei.push([r.tri.gast.x,r.tri.gast.y,13]); // Gasthaus „Zum Teufelstisch“ rechts am Ziel
    const tx=px+Math.cos(h)*380-Math.sin(h)*60, ty=py+Math.sin(h)*380+Math.cos(h)*60; r.tri.tisch=[tx,ty]; frei.push([tx,ty,26]); } // Teufelstisch auf einer Kuppe dahinter
  // Dichter Pfälzerwald: zusätzliche Kiefern, Buchen und Unterholz im Wald, nie auf dem Weg oder auf benachbarten Kehren
  { const C=8, gr=new Map(), key=(x,y)=>Math.floor(x/C)+','+Math.floor(y/C); for(let i=0;i<r.xs.length;i+=2){ const k=key(r.xs[i],r.ys[i]); (gr.get(k)||gr.set(k,[]).get(k)).push(i); }
    const amWeg=(x,y,m)=>{ const cx=Math.floor(x/C), cy=Math.floor(y/C), w=Math.ceil(m/C); for(let a=-w;a<=w;a++) for(let b=-w;b<=w;b++){ const l=gr.get((cx+a)+','+(cy+b)); if(l) for(const i of l) if(Math.hypot(r.xs[i]-x,r.ys[i]-y)<m) return true; } return false; };
    for(let d=0;d<r.len;d+=9){ if(zoneAt(r,d)!=='wald') continue; const [px,py]=posAt(r,d), hd=headingAt(r,d), nx=-Math.sin(hd), ny=Math.cos(hd);
      for(const sd of [-1,1]) for(let t=0;t<2;t++){ const o=sd*(4+q()*72), al=(q()-.5)*7, x=px+nx*o+Math.cos(hd)*al, y=py+ny*o+Math.sin(hd)*al, rad=2+q()*3, busch=q()<.35;
        if(amWeg(x,y,(busch?1.5:rad)+3.2)) continue; if(busch) S.bush.push({x,y,s:.6+q()*.9,c:q()}); else S.tree.push({x,y,s:rad,c:q(),pine:q()<.55,ht:9+q()*8}); } } }
  for(const k of ['tree','rock','bush','block','konif','grass']) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m));
  for(const h of S.house){ h.fw=q()<.75; h.gw=false; h.pv=false; if(h.roof==='#6f6f70'||q()<.4) h.roof=q()<.6?'#9e3a28':'#a8925c'; } // Fachwerk, Ziegel oder Stroh, keine Solardächer
  r.tri.wirt=S.house.filter(h=>h.side===1&&!h.gs).sort((a,b)=>Math.abs(a.d-r.tri.wirtD)-Math.abs(b.d-r.tri.wirtD))[0]||null;
  prepTrifelsLeben(r); } // Baulücken am Wirtshaus, Wege für Reh und Wildschwein (welt-trifels-leben.js) // Haus rechts, das dem Wirtshaus-Meter am nächsten steht

// ---- Gelände (aus build3D, vor dem Gelände-Mesh): Vorburg eben (nur absenken, damit nichts durch die Straße sticht), Burgberg unter dem Felsen ----
function trifelsGelaende(h,src,dist){ const T=R.tri, n=TER.nx, res=TER.res, [kx,ky]=T.karren, [bx,by]=T.burg, hy=roadY((T.hof[0]+T.hof[1])/2)-.45, rp=T.rh+14; T.hofY=hy+.45;
  for(let k=0;k<h.length;k++){ const x=(k%n)*res+TER.x0, z=((k/n)|0)*res+TER.z0, dk=Math.hypot(x-kx,z-ky);
    if(dk<rp+30) h[k]+=(hy-h[k])*bSm((rp+30-dk)/30); // eben (auch anheben, sonst schwebt der Kram am Rand)
    const e=Math.hypot((x-bx)/50,(z-by)/20); if(e<2.2){ const top=hy+8*bSm((2.2-e)/1.3); if(top>h[k]) h[k]=top; }
    if(T.tisch){ const dt=Math.hypot(x-T.tisch[0],z-T.tisch[1]); if(dt<170) h[k]+=42*bSm((170-dt)/150); } } // Kuppe unter dem Teufelstisch
  // Burgweg: zweigt am Scheitel der Kehre ab und führt in einem Bogen nach Nordosten hinauf zum Torbau (Burg lokal x 46, z 15,5, Boden 6,5 m über der Vorburg)
  const x0=kx, z0=ky-T.rh-3, x2=bx+46, z2=by+17, cx=kx+40, cz=ky-T.rh-6, W=[]; let L=0;
  for(let i=0;i<=40;i++){ const s=i/40, x=(1-s)*(1-s)*x0+2*(1-s)*s*cx+s*s*x2, z=(1-s)*(1-s)*z0+2*(1-s)*s*cz+s*s*z2; if(W.length) L+=Math.hypot(x-W[W.length-1].x,z-W[W.length-1].z); W.push({x,z,L}); }
  for(const p of W){ p.s=p.L/L; p.y=T.hofY+(6.5-.45)*p.s; } T.weg=W; T.wegL=L;
  for(let k=0;k<h.length;k++){ const x=(k%n)*res+TER.x0, z=((k/n)|0)*res+TER.z0; const rr=res*2.2; if(x<Math.min(x0,x2)-rr||x>Math.max(x0,cx,x2)+rr||z<z2-rr||z>z0+rr) continue;
    let m=1e9, py=0; for(const p of W){ const dd=Math.hypot(x-p.x,z-p.z); if(dd<m){ m=dd; py=p.y; } } if(m<rr) h[k]+=(py-.25-h[k])*bSm((rr-m)/(res*.9)); }
  // in Kehren liegt ein Geländepunkt nahe an zwei Kehrenstücken: dann die tiefere Straßenhöhe im Umkreis von 14 m nehmen
  const CG=14, gr=new Map(); for(let i=0;i<R.xs.length;i+=2){ const key=Math.floor(R.xs[i]/CG)+','+Math.floor(R.ys[i]/CG); (gr.get(key)||gr.set(key,[]).get(key)).push(i); }
  const tiefst=(x,z)=>{ let m=1e9; const cx=Math.floor(x/CG), cz=Math.floor(z/CG); for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++){ const l=gr.get((cx+a)+','+(cz+b)); if(l) for(const i of l) if(Math.hypot(R.xs[i]-x,R.ys[i]-z)<14) m=Math.min(m,roadY(i*STEP)); } return m; };
  // an der Straße wie überall: bis 12 m neben der Mitte knapp unter der Fahrbahn, bis 30 m weich und nur sanft ansteigend – sonst schaut Gras durchs Pflaster
  for(let k=0;k<h.length;k++){ if(dist[k]>=30) continue; // auf der ganzen Strecke (auch in den Kehren der Abfahrt)
    const rl=Math.min(roadY(src[k]*STEP),dist[k]<14?tiefst((k%n)*res+TER.x0,((k/n)|0)*res+TER.z0):1e9)-STR_UNTER; h[k]=dist[k]<12?rl:Math.min(rl+(h[k]-rl)*bSm((dist[k]-12)/12), rl+Math.max(0,dist[k]-16)*.15); }
  triWiesenGelaende(h,dist); } // neben der Straße nur sanft ansteigen (grobes Raster) · danach Weiher auf der Lichtung nach Jagd 2 eben (welt-trifels-wiesen.js), nah am Weg

// ---- Aufbau (aus build3D) ----
function buildTrifels(){ const T=R.tri, hy=T.hofY, [kx,ky]=T.karren, [bx,by]=T.burg, q=rng(1280);
  const box=(P,w,h,d,mat,x,y,z,ry=0)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); o.position.set(x,y,z); o.rotation.y=ry; P.add(o); return o; };
  const fen=(cols,rows,w,h,y0=0)=>{ const L=[]; for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) L.push([(c+.5)*256/cols-w/2,y0+(r+.5)*(256-y0)/rows-h/2,w,h]); return L; };
  const fels=new THREE.MeshLambertMaterial({map:felsTex()}), sand=new THREE.MeshLambertMaterial({map:burgQuader()}), grau=lam('#6b7078'), schiefer=new THREE.MeshLambertMaterial({color:'#646a72',side:THREE.DoubleSide});
  const ziegel=new THREE.MeshLambertMaterial({color:'#8e4a32',side:THREE.DoubleSide}), holz=lam('#6b4a32'), holzD=lam('#4e3626'), dunkel=lam('#1e1a18');
  const fach=new THREE.MeshLambertMaterial({map:canvasTex(128,128,g=>{ g.fillStyle='#ece3cf'; g.fillRect(0,0,128,128); g.fillStyle='#4e3626'; for(const x of [0,42,84,122]) g.fillRect(x,0,6,128); g.fillRect(0,0,128,7); g.fillRect(0,121,128,7); g.fillRect(0,60,128,6);
    g.lineWidth=5; g.strokeStyle='#4e3626'; g.beginPath(); g.moveTo(6,7); g.lineTo(42,60); g.moveTo(84,60); g.lineTo(122,7); g.stroke(); g.fillStyle='#2a2422'; g.fillRect(52,76,22,30); })});
  // Burg: lokal x entlang des Felsrückens nach Osten, z nach Süden (zur Vorburg), y über der Vorburg
  const G=new THREE.Group(); G.position.set(bx,hy,by); world.add(G); const OB=20; // Oberkante des Felsens
  // Felsrücken: Kern, Felssporn im Westen (wie ein Bug), Brocken und Schichtwände rundherum
  box(G,84,OB-6,24,fels,0,6+(OB-6)/2,0); box(G,20,OB-3,16,fels,-50,4+(OB-3)/2-1.5,1);
  for(let i=0;i<34;i++){ const x=-56+q()*108, s=q()<.5?-1:1, o=new THREE.Mesh(new THREE.DodecahedronGeometry(3+q()*4,0),fels); o.position.set(x,6+q()*(OB-8),s*(11+q()*3)); o.scale.set(1.6,.8+q()*.5,1); o.rotation.set(q(),q()*6,q()); G.add(o); }
  for(let i=0;i<8;i++){ const o=new THREE.Mesh(new THREE.DodecahedronGeometry(2.5+q()*2,0),fels); o.position.set(-60+q()*8,4+q()*14,-6+q()*14); o.rotation.set(q(),q()*6,q()); G.add(o); }
  // Ringmauer oben am Felsrand, Zwingermauer tiefer am Hang (Südseite zur Vorburg)
  const mauer=(x0,z0,x1,z1,y,hg)=>{ const L=Math.hypot(x1-x0,z1-z0); box(G,L,hg,1.2,sand,(x0+x1)/2,y+hg/2,(z0+z1)/2,-Math.atan2(z1-z0,x1-x0)); };
  mauer(-40,10.5,40,10.5,OB,4); mauer(-40,-10.5,40,-10.5,OB,4); mauer(-40,-10.5,-40,10.5,OB,4); mauer(40,-10.5,40,10.5,OB,3);
  mauer(-44,16,34,16,7.5,3.2); mauer(34,16,42,14,7.5,3.2);
  // Bergfried: quadratisch, Buckelquader, Zinnenkranz, Erker auf halber Höhe
  const berg=new THREE.MeshLambertMaterial({map:burgQuader([[120,60,16,26],[60,150,14,22],[170,200,14,22]])}), BH=30;
  box(G,10,BH,10,berg,-6,OB+BH/2,-1); for(let i=0;i<4;i++) for(let k=0;k<4;k++){ const a=-3.75+k*2.5, [x,z]=[[a,-5],[a,5],[-5,a],[5,a]][i]; box(G,1.3,1.6,1,sand,-6+x,OB+BH+.8,-1+z); } // Zinnen
  box(G,3,3.6,1.8,sand,-6,OB+BH*.55,4.6); box(G,1,1.6,.1,dunkel,-6,OB+BH*.55+.2,5.55); // Erker zur Vorburg
  // Palas östlich angebaut, fast so hoch: Doppel-Rundbogenfenster, flaches graues Walmdach mit Schornsteinen
  const palas=new THREE.MeshLambertMaterial({map:burgQuader([...fen(4,1,16,30,120),...fen(4,1,16,30,120).map(([x,y,w,h])=>[x+20,y,w,h])])}), PH=22;
  box(G,22,PH,14,palas,10,OB+PH/2,0); { const rf=new THREE.Mesh(walmGeo(23.4,15.4,4.5),schiefer); rf.position.set(10,OB+PH,0); G.add(rf); }
  for(const x of [4,16]) box(G,1.2,4,1.2,sand,x,OB+PH+3,-3);
  // Torbau im Osten: Turm mit Zeltdach, Torturm mit Fachwerk-Obergeschoss und Rundbogen-Durchgang
  const turm=(w,hg,x,y,z,dachH=5)=>{ box(G,w,hg,w,sand,x,y+hg/2,z); const c=new THREE.Mesh(new THREE.ConeGeometry(w*.78,dachH,4),schiefer); c.position.set(x,y+hg+dachH/2,z); c.rotation.y=Math.PI/4; G.add(c); };
  turm(6,10,34,OB,6); turm(5,7,26,OB,8.5,4);
  const TB=6.5; box(G,8,13,7,sand,46,TB+6.5,12); box(G,8.4,4,7.4,fach,46,TB+15,12); { const rf=new THREE.Mesh(gableGeo(9.4,8.4,3.2),ziegel); rf.position.set(46,TB+17,12); rf.rotation.y=Math.PI/2; G.add(rf); }
  box(G,3,5,7.2,dunkel,46,TB+2.5,12); // Durchgang
  // Westsporn: kleine Fachwerkhäuschen ganz vorn auf dem Felsen
  for(const [x,z,w] of [[-52,0,5],[-46,4,4]]){ box(G,w,4.5,4,fach,x,OB-1.5+2.25,z); const rf=new THREE.Mesh(gableGeo(w+.8,4.8,2.4),ziegel); rf.position.set(x,OB-1.5+4.5,z); G.add(rf); }
  // Kleinkram am Fuß: Büsche, Krüppelkiefern auf dem Fels
  for(let i=0;i<22;i++){ const x=-50+q()*96, s=q()<.5?-1:1, b=new THREE.Mesh(new THREE.IcosahedronGeometry(1+q()*1.4,0),lam(q()<.5?'#3f6b32':'#2c4a26')); b.position.set(x,4+q()*4,s*(14+q()*4)); b.scale.y=.7; G.add(b); }
  for(const [x,z] of [[-58,-2],[-36,9],[38,-9]]){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.18,.25,3,5),holzD); st.position.set(x,OB+1.2,z); G.add(st); const k=new THREE.Mesh(new THREE.IcosahedronGeometry(1.6,0),lam('#2f4d2c')); k.position.set(x,OB+3,z); k.scale.set(1.5,.6,1.2); G.add(k); }

  // ---------- Burgweg: Erdweg von der Kehre zum Torbau ----------
  for(const o of T.weg) o.y=terrainAt(o.x,o.z)+.17; // Weg und Karren liegen auf dem gezeichneten Gelände
  { const W=T.weg, n=W.length, p=new Float32Array(n*6), uv=new Float32Array(n*4), id=[];
    W.forEach((o,i)=>{ const a=W[Math.max(0,i-1)], b=W[Math.min(n-1,i+1)], l=Math.hypot(b.x-a.x,b.z-a.z)||1, vx=-(b.z-a.z)/l*1.6, vz=(b.x-a.x)/l*1.6; p.set([o.x-vx,o.y-.17,o.z-vz,o.x+vx,o.y-.17,o.z+vz],i*6); uv.set([0,o.L/4,1,o.L/4],i*4); if(i<n-1) id.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2); });
    const tx=canvasTex(64,128,g=>{ g.fillStyle='#a8765a'; g.fillRect(0,0,64,128); for(let i=0;i<400;i++){ g.fillStyle=Math.random()<.5?'rgba(70,40,25,.2)':'rgba(225,185,140,.2)'; g.fillRect(Math.random()*64,Math.random()*128,2+Math.random()*3,2); } }); tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setAttribute('uv',new THREE.BufferAttribute(uv,2)); geo.setIndex(id); geo.computeVertexNormals();
    world.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:tx,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2}))); }
  // ---------- Vorburg: Holzhütten und Schuppen außen um die Kehre, Platz in der Mitte frei für den Goldkarren ----------
  const V=new THREE.Group(); V.position.set(kx,hy,ky); world.add(V);
  const bretter=new THREE.MeshLambertMaterial({map:canvasTex(64,64,g=>{ for(let x=0;x<64;x+=8){ const v=.8+Math.random()*.3; g.fillStyle=`rgb(${118*v|0},${84*v|0},${54*v|0})`; g.fillRect(x,0,8,64); g.fillStyle='rgba(30,18,10,.55)'; g.fillRect(x+7,0,1,64); } })});
  const huette=(a,o,w,d,hg)=>{ const x=Math.cos(a)*o, z=Math.sin(a)*o, H=new THREE.Group(); H.position.set(x,0,z); H.rotation.y=-a+Math.PI/2; V.add(H);
    box(H,w,hg,d,bretter,0,hg/2,0); const rf=new THREE.Mesh(gableGeo(w+.8,d+.8,1.8),q()<.5?ziegel:lam('#a8925c')); rf.position.y=hg; H.add(rf); box(H,1,1.9,.08,dunkel,0,.95,d/2+.02); };
  for(const f of TRI_HUETTEN){ const a=Math.PI*f+(q()-.5)*.06; huette(a,T.rh+10+q()*4,4+q()*2.5,3.5+q(),2.6+q()*.6); } // Nordseite unterhalb der Burg, Lücke für den Burgweg
  for(let i=0;i<6;i++){ const a=(q()-.5)*1.2, r=4+q()*9, k=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.9),holz); k.position.set(Math.cos(a)*r*1.1+6,.45,Math.sin(a)*r*.6); k.rotation.y=q()*3; V.add(k); } // Kisten
  for(let i=0;i<3;i++){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,1,10),holzD); f.position.set(-6+i*1.1,.5,-5); V.add(f); } // Fässer
  for(let i=0;i<4;i++){ const hb=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,1.3,10),lam('#c9a85a')); hb.rotation.z=Math.PI/2; hb.position.set(-8+i*1.8,.8,4); V.add(hb); } // Heuballen

  V.updateMatrixWorld(true); const wp=new THREE.Vector3(); for(const o of V.children){ o.getWorldPosition(wp); o.position.y+=bodenY(wp.x,wp.z)-hy; } // jedes Stück auf den Boden

  // ---------- Wirtshaus im Tal: Ausleger mit Schild am Haus rechts ----------
  { const H=T.wirt; if(H){ const tx=Math.cos(H.h), tz=Math.sin(H.h), nx=-Math.sin(H.h)*H.side, nz=Math.cos(H.h)*H.side, a=H.dep/2, b=-(H.w/2-.9), eis=lam('#2a2826');
      const W=new THREE.Group(); W.position.set(H.x-nx*a+tx*b, roadY(H.d)+.15+3.3, H.y-nz*a+tz*b); W.rotation.y=Math.atan2(nz,-nx); world.add(W); // lokal: +x von der Wand zur Straße
      box(W,1.3,.05,.05,eis,.65,0,0); const t=frakturTex(256,180,g=>{ g.fillStyle='#5a2a1c'; g.fillRect(0,0,256,180); g.strokeStyle='#d9a62b'; g.lineWidth=7; g.strokeRect(6,6,244,168); g.fillStyle='#e8c24a'; g.textAlign='center'; g.textBaseline='middle';
        g.font='26px '+FRAKTUR; g.fillText('Wirtshaus',128,36,220); g.font='60px '+FRAKTUR; g.fillText('Zack Zack',128,94,236); g.font='24px '+FRAKTUR; g.fillText('Wein · Bier · Speis',128,148,220); }); // Name vom Nutzer
      const pl=new THREE.Mesh(new THREE.BoxGeometry(1,.7,.04),[holzD,holzD,holzD,holzD,new THREE.MeshLambertMaterial({map:t}),new THREE.MeshLambertMaterial({map:t})]); pl.position.set(.85,-.45,0); W.add(pl); } }

  // ---------- Laternen am Weg: Holzpfahl mit Laterne, leuchten in der Dämmerung (am Wirtshaus und im Tal) ----------
  { const glow=lampGlowMat(), L=[]; for(let d=T.wirtD-60; d<R.len-80; d+=d<T.wirtD+200||d>T.ziel-420&&d<T.ziel+20?30:140){ const [x,z]=posAt(R,d), hd=headingAt(R,d), s=(L.length%2?1:-1), o=roadW(R,d)/2+1.3; const lx=x-Math.sin(hd)*s*o, lz=z+Math.cos(hd)*s*o; L.push({x:lx, z:lz, y:bodenY(lx,lz)}); }
    for(const p of L){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,2.2,5),holzD); st.position.set(p.x,p.y+1.1,p.z); world.add(st); const la=new THREE.Mesh(new THREE.BoxGeometry(.28,.38,.28),glow); la.position.set(p.x,p.y+2.35,p.z); world.add(la); } }
  buildTrifelsLeute(T,hy); // Goldkarren, Wachen, Burgherr, Löwenherz mit Gefolge
  if(T.gast) buildGasthaus(T); // Ziel: Gasthaus „Zum Teufelstisch“ mit Wirt, Teufelstisch im Hintergrund
  sicher('Trifels-Leben',()=>buildTrifelsLeben(T)); // Hoftiere am Wirtshaus, Gänse, Gegenverkehr, Reh, Wildschwein (welt-trifels-leben.js)
  sicher('Trifels-Nebel',buildTrifelsNebel); // Nebel ab der Dämmerung, im Ausfahren dicht
}

// ---- Figuren (Schritt 4): Mensch, Pferd mit Schabracke, Wappen ----
// Schreitender Löwe wie im englischen Wappen (Kopf zum Betrachter), gold auf rot; x,y Mitte, s Breite
function leopard(g,x,y,s){ g.save(); g.translate(x,y); g.scale(s/100,s/100); g.fillStyle='#f0b82a'; g.strokeStyle='#f0b82a'; g.lineCap='round';
  g.beginPath(); g.ellipse(8,0,34,10,0,0,7); g.fill(); g.beginPath(); g.arc(-30,-6,11,0,7); g.fill(); // Rumpf, Kopf
  g.beginPath(); for(let i=0;i<=16;i++){ const a=i/16*Math.PI*2, r=i%2?10:16; g.lineTo(-24+Math.cos(a)*r,-4+Math.sin(a)*r); } g.fill(); // Mähne
  g.lineWidth=6; for(const [a,b,c,d] of [[-16,6,-24,22],[-6,6,-2,22],[22,6,16,22],[34,4,42,20]]){ g.beginPath(); g.moveTo(a,b); g.lineTo(c,d); g.stroke(); } // Beine, vorne eins erhoben
  g.lineWidth=4; g.beginPath(); g.moveTo(40,-2); g.bezierCurveTo(56,-6,44,-30,58,-34); g.stroke(); // Schwanz
  g.fillStyle='#1f3a8a'; g.beginPath(); g.moveTo(-38,-2); g.lineTo(-46,2); g.lineTo(-38,1); g.fill(); g.fillStyle='#111'; for(const ex of [-34,-27]){ g.beginPath(); g.arc(ex,-9,1.6,0,7); g.fill(); } g.restore(); }
// Wappen: 0 drei Löwen (Richard), 1 schwarzes Kreuz auf Gelb, 2 rot-weiße Sparren, 3 blau mit weißem Schrägbalken, 4 rotes Kreuz auf Weiß
function wappenMal(g,w,h,k){ const F=[['#c8202a'],['#e9c22e'],['#c8202a'],['#2a4f9a'],['#efeae0']][k][0]; g.fillStyle=F; g.fillRect(0,0,w,h);
  if(k===0) for(let i=0;i<3;i++) leopard(g,w*.5,h*(.2+i*.3),w*.7);
  if(k===1||k===4){ g.fillStyle=k===1?'#151515':'#c8202a'; g.fillRect(w*.42,0,w*.16,h); g.fillRect(0,h*.4,w,h*.16); }
  if(k===2){ g.strokeStyle='#f2eee6'; g.lineWidth=w*.1; for(const y of [.35,.65]){ g.beginPath(); g.moveTo(0,h*(y+.25)); g.lineTo(w/2,h*y); g.lineTo(w,h*(y+.25)); g.stroke(); } }
  if(k===3){ g.strokeStyle='#f2eee6'; g.lineWidth=w*.16; g.beginPath(); g.moveTo(0,0); g.lineTo(w,h); g.stroke(); } }
const wappenTex=(k,w=128,h=192)=>canvasTex(w,h,g=>wappenMal(g,w,h,k));
// Mensch, lokal +z nach vorn, Füße auf y=0 · o: kittel, hose, schuh, aermel, kette (Kettenhemd und -haube), rock (Wappen-Nr. für den Waffenrock), lang (Gewandfarbe), krone, bart, haar, mantel
function trMensch(o={}){ const G=new THREE.Group(), haut=lam('#e3b48e'), kt=lam('#8a8d93'), kittel=lam(o.kittel||'#7a5a3a'), box=(P,w,h,d,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); P.add(b); return b; };
  const beine=[]; for(const x of [-.1,.1]){ const b=new THREE.Group(); b.position.set(x,.8,0); G.add(b); beine.push(b); if(!o.lang) box(b,.13,.78,.13,o.kette?kt:lam(o.hose||'#3a4a3a'),0,-.39,0); box(b,.14,.12,.25,lam(o.schuh||'#3e2a1c'),0,-.74,.05); }
  const rumpf=new THREE.Mesh(new THREE.CylinderGeometry(.19,.24,.72,10),o.kette?kt:kittel); rumpf.position.y=1.18; G.add(rumpf);
  if(o.lang){ const gw=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,1.42,12),lam(o.lang)); gw.position.y=.72; G.add(gw); }
  if(o.rock!=null){ const tx=new THREE.MeshLambertMaterial({map:wappenTex(o.rock,96,160)}), f=lam(['#c8202a','#e9c22e','#c8202a','#2a4f9a','#efeae0'][o.rock]); box(G,.46,1.05,.31,[f,f,f,f,tx,tx],0,1.02,0); }
  if(o.mantel){ const m=new THREE.Mesh(new THREE.CylinderGeometry(.27,.42,1.3,12,1,true,Math.PI*.6,Math.PI*1.8),new THREE.MeshLambertMaterial({color:o.mantel,side:THREE.DoubleSide})); m.position.y=.95; G.add(m); }
  box(G,.42,.07,.33,lam('#4a3222'),0,.86,0);
  const arme=[]; for(const x of [-.27,.27]){ const a=new THREE.Group(); a.position.set(x,1.48,0); G.add(a); const c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.055,.6,6),o.kette?kt:lam(o.aermel||o.kittel||'#7a5a3a')); c.position.y=-.3; a.add(c);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.06,6,5),o.kette?lam('#6e7177'):haut); hd.position.y=-.62; a.add(hd); a.rotation.z=x<0?-.12:.12; arme.push(a); }
  const kopf=new THREE.Group(); kopf.position.y=1.6; G.add(kopf); const hk=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),haut); hk.position.y=.1; kopf.add(hk);
  if(o.kette){ const hb=new THREE.Mesh(new THREE.SphereGeometry(.15,12,9),kt); hb.position.set(0,.12,-.045); kopf.add(hb); const hl=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,.16,10),kt); hl.position.y=-.03; kopf.add(hl); }
  else { const hr=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8,0,Math.PI*2,0,Math.PI*.55),lam(o.haar||'#4a3222')); hr.position.set(0,.12,-.02); kopf.add(hr); }
  if(o.bart){ const b=box(kopf,.2,.13,.1,lam(o.bart),0,.0,.08); b.rotation.x=.25; }
  if(o.krone){ const gold=new THREE.MeshPhongMaterial({color:'#e2b02a',shininess:90,specular:0xfff0b0}), k=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.07,14,1,true),gold); k.position.y=.25; kopf.add(k);
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2, z=new THREE.Mesh(new THREE.ConeGeometry(.025,.08,4),gold); z.position.set(Math.sin(a)*.15,.32,Math.cos(a)*.15); kopf.add(z); } }
  return {G,beine,arme,kopf}; }
// Pferd, lokal +z nach vorn, Hufe auf y=0 · fell, schabracke (Wappen-Nr. oder null), federbusch
function trPferd(o={}){ const G=new THREE.Group(), fell=lam(o.fell||'#3a2a22'), mahne=lam('#1e1612');
  const rumpf=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),fell); rumpf.scale.set(.37,.44,1.08); rumpf.position.y=1.38; G.add(rumpf);
  const beine=[[.18,.74],[-.18,.74],[.18,-.74],[-.18,-.74]].map(([x,z])=>{ const b=new THREE.Group(); b.position.set(x,1.25,z); G.add(b); const l=new THREE.Mesh(new THREE.CylinderGeometry(.08,.065,1.15,6),fell); l.position.y=-.6; b.add(l); const h=new THREE.Mesh(new THREE.BoxGeometry(.14,.1,.16),lam('#1c1814')); h.position.y=-1.2; b.add(h); return b; });
  const hals=new THREE.Group(); hals.position.set(0,1.55,.88); G.add(hals); const hs=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,.85,8),fell); hs.position.set(0,.32,.2); hs.rotation.x=.75; hals.add(hs);
  const kp=new THREE.Mesh(new THREE.BoxGeometry(.22,.24,.62),fell); kp.position.set(0,.62,.55); kp.rotation.x=.9; hals.add(kp); const mh=new THREE.Mesh(new THREE.BoxGeometry(.06,.08,.8),mahne); mh.position.set(0,.5,.05); mh.rotation.x=.75; hals.add(mh);
  for(const x of [-.07,.07]){ const oh=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,5),fell); oh.position.set(x,.85,.42); hals.add(oh); }
  if(o.federbusch){ const fb=new THREE.Mesh(new THREE.ConeGeometry(.07,.4,6),lam(o.federbusch)); fb.position.set(0,1.05,.4); hals.add(fb); }
  const sw=new THREE.Mesh(new THREE.CylinderGeometry(.05,.11,.95,6),mahne); sw.position.set(0,1.05,-1.12); sw.rotation.x=-.35; G.add(sw);
  if(o.schabracke!=null){ const t=wappenTex(o.schabracke,256,128); t.wrapS=THREE.RepeatWrapping; t.repeat.set(3,1); const sm=new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide});
    const s=new THREE.Mesh(new THREE.CylinderGeometry(.47,.58,1.05,16,1,true),sm); s.scale.z=2.3; s.position.y=1.12; G.add(s); // Decke hängt fast bis zum Boden
    const sh=new THREE.Mesh(new THREE.CylinderGeometry(.2,.26,.7,10,1,true),sm); sh.position.set(0,.34,.22); sh.rotation.x=.75; hals.add(sh); }
  const sattel=new THREE.Mesh(new THREE.BoxGeometry(.5,.14,.6),lam('#4a2e1c')); sattel.position.y=1.82; G.add(sattel);
  return {G,beine,hals}; }
// Reiter auf dem Pferd: sitzt im Sattel, Beine seitlich nach unten
function trReiter(p,m){ p.G.add(m.G); m.G.position.set(0,1.1,.05); m.beine[0].rotation.set(-.9,0,-.35); m.beine[1].rotation.set(-.9,0,.35); m.arme[0].rotation.x=-.7; m.arme[1].rotation.x=-.7; return {p,m}; }

// ---- Szenen (aus buildTrifels): Goldkarren mit Wachen und Burgherr in der Vorburg, Löwenherz mit Gefolge auf dem Anstieg ----
function buildTrifelsLeute(T,hy){ const A=anim.tri={reiter:[], traeger:null, kpferd:null}, [kx,ky]=T.karren, holz=lam('#6b4a32'), holzD=lam('#4e3626');
  const box=(P,w,h,d,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); P.add(b); return b; };
  const gold=new THREE.MeshPhongMaterial({color:'#e2b02a',shininess:110,specular:0xfff3c0,emissive:0x3a2600});
  const truhe=(P,x,y,z,ry=0)=>{ const t=new THREE.Group(); t.position.set(x,y,z); t.rotation.y=ry; P.add(t); box(t,.8,.5,.5,lam('#5a3a22'),0,.25,0); const d=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.8,10,1,false,0,Math.PI),lam('#6b4428')); d.rotation.z=Math.PI/2; d.position.y=.5; t.add(d);
    for(const bx of [-.3,.3]) box(t,.06,.56,.54,gold,bx,.27,0); box(t,.12,.14,.05,gold,0,.42,.26); return t; };
  // Goldkarren: Pferd vorn (lokal +z), Wagen mit Goldhaufen und Truhen; wartet an der Abzweigung des Burgwegs und zieht zur Burg hinauf (poseTrifels)
  const K=new THREE.Group(); K.rotation.order='YXZ'; world.add(K); const raeder=[];
  const bretter=new THREE.MeshLambertMaterial({color:'#7a5636'});
  box(K,1.6,.12,3.2,bretter,0,.95,0); for(const x of [-.78,.78]) box(K,.06,.4,3.2,bretter,x,1.2,0); box(K,1.6,.4,.06,bretter,0,1.2,-1.58);
  for(const x of [-.9,.9]) for(const z of [-.9,.9]){ const r=new THREE.Mesh(new THREE.TorusGeometry(.5,.06,5,16),holzD); r.position.set(x,.55,z); r.rotation.y=Math.PI/2; K.add(r); raeder.push(r); const n=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.12,8),holzD); n.rotation.z=Math.PI/2; n.position.set(x,.55,z); K.add(n); }
  const hf=new THREE.Mesh(new THREE.ConeGeometry(.75,.75,12),gold); hf.scale.z=1.5; hf.position.set(0,1.38,.3); K.add(hf); // Goldhaufen
  for(let i=0;i<14;i++){ const m=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.015,8),gold); m.position.set((Math.random()-.5)*1.3,1.03,(Math.random()-.5)*2.8); m.rotation.x=Math.random(); K.add(m); } // verstreute Münzen
  truhe(K,0,1.01,-1.1); truhe(K,-.4,1.51,-1.1,.2);
  for(const x of [-.4,.4]){ const d=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,2,6),holz); d.rotation.x=Math.PI/2; d.position.set(x,1.1,2.4); K.add(d); } // Deichsel
  const kp=trPferd({fell:'#6e4a2c'}); kp.G.position.z=3.5; K.add(kp.G); A.kpferd=kp;
  // Wachen (Fußknechte): Kettenhaube, rote Tunika mit gelben Ärmeln, grüne Beinlinge, Speer
  const speer=m=>{ const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,2.4,5),holz); s.position.set(0,-.2,.08); m.arme[1].add(s); const sp=new THREE.Mesh(new THREE.ConeGeometry(.05,.26,4),lam('#aab0b6')); sp.position.set(0,1.1,.08); m.arme[1].add(sp); m.arme[1].rotation.x=-.25; };
  const wache=(x,z,ry)=>{ const w=trMensch({kittel:'#c8302a',aermel:'#e9b22e',hose:'#2f4a35'}); const hb=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),lam('#8a8d93')); hb.position.set(0,.12,-.045); w.kopf.add(hb); w.G.position.set(x,0,z); w.G.rotation.y=ry; K.add(w.G); return w; };
  const wachen=[wache(-1.5,1.4,0),wache(1.5,-.4,0)]; wachen.forEach(speer); // gehen links und rechts neben dem Wagen mit
  A.karren={K,raeder,wachen,s:0,ph:0};
  { const W=T.weg, W0=W[0]; let dj=T.hof[0], m=1e9; for(let d=T.hof[0];d<T.hof[1];d+=.5){ const [x,z]=posAt(R,d), e=Math.hypot(x-W0.x,z-W0.z); if(e<m){ m=e; dj=d; } } // Abzweigung des Burgwegs
    const P=[]; for(let d=dj-16;d<=dj-1;d+=1.5){ const p=wegPos(d,-1.5); P.push({x:p.x,z:p.z,y:bodenY(p.x,p.z)+.17}); } let L=0; for(let i=P.length-1;i>=0;i--){ const n=P[i+1]||W0; L-=Math.hypot(n.x-P[i].x,n.z-P[i].z); P[i].L=L; }
    A.karren.P=P.concat(W.map(o=>({...o,y:Math.max(o.y,bodenY(o.x,o.z)+.17)}))); A.karren.Lr=-L; } // Kamerafahrt beim Countdown: Karren rollt über die Kehre heran und biegt auf den Burgweg
  // Burgherr: langes Gewand, pelzbesetzter Mantel, steht am Karren und blickt zur Straße
  const W0=T.weg[3], bd=T.aud+3, bp=wegPos(bd,-(roadW(R,bd)/2+1.6)), bv=wegPos(bd-14,0), bh=trMensch({lang:'#3a4f8a',mantel:'#6a1f2a',bart:'#5a4632',haar:'#5a4632'}); bh.G.position.set(bp.x,bodenY(bp.x,bp.z),bp.z); bh.G.rotation.y=Math.atan2(bv.x-bp.x,bv.z-bp.z); world.add(bh.G); // links am Scheitel der Kehre, 3 m hinter dem Halt der Audienz, blickt dir entgegen
  for(const da of [-1.5,1.5]){ const w=trMensch({kittel:'#c8302a',aermel:'#e9b22e',hose:'#2f4a35'}), hb=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),lam('#8a8d93')); hb.position.set(0,.12,-.045); w.kopf.add(hb); speer(w);
    const p=wegPos(bd+da,-(roadW(R,bd)/2+1.9)); w.G.position.set(p.x,bodenY(p.x,p.z),p.z); w.G.rotation.y=bh.G.rotation.y; world.add(w.G); } // zwei Wachen neben ihm
  const bl=triBlase(), bq=wegPos(bd,-(roadW(R,bd)/2+3.4)); bl.position.set(bq.x,bh.G.position.y+4.3,bq.z); // feste Bildschirmgröße, nie verdeckt; hoch und etwas außen, damit sie nicht auf dem Fahrer liegt
  A.burgherr={m:bh,blase:bl,ry:bh.G.rotation.y};
  for(const [dx,dz,ry] of [[-5.5,-1,.4],[-5.8,.2,-.3]]){ const t=truhe(world,W0.x+dx,0,W0.z+dz,ry); t.position.y=bodenY(t.position.x,t.position.z); A.truhe={t,boden:t.position.clone()}; } // zwei abgeladene Truhen dort
  { const w=trMensch({kittel:'#c8302a',aermel:'#e9b22e',hose:'#2f4a35'}), hb=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),lam('#8a8d93')), b=A.truhe.boden; hb.position.set(0,.12,-.045); w.kopf.add(hb);
    w.G.position.set(b.x+1.05,bodenY(b.x+1.05,b.z),b.z); w.G.rotation.y=-Math.PI/2; world.add(w.G); A.truhe.w=w; } // Wache trägt die zweite Truhe und stellt sie bei der Kamerafahrt ab const pz=new THREE.Mesh(new THREE.TorusGeometry(.25,.06,6,14),lam('#e8e0d0')); pz.rotation.x=Math.PI/2; pz.position.y=1.5; bh.G.add(pz);
  // Löwenherz mit Gefolge: ein Ritter reitet voraus, dahinter Bannerträger mit der Löwenfahne und ein Ritter, Richard in der Mitte zwischen zwei Rittern, zwei Ritter am Schluss – füllt fast den ganzen Weg
  // [Rolle, Kleidung, Wappen, ab = Meter hinter dem Vorreiter, u = Spur]
  const L=[['vor',{rock:3,kette:1},3,0,0],['banner',{rock:0,kette:1},0,6.5,-.75],['',{rock:1,kette:1},1,6.5,.75],['koenig',{rock:0,kette:1,krone:1,bart:'#8a7a68'},0,12,-.1],['',{rock:2,kette:1},2,12,-1.3],['',{rock:3,kette:1},3,12,1.05],['',{rock:1,kette:1},1,17.5,-.7],['',{rock:2,kette:1},2,17.5,.7]];
  L.forEach(([rolle,mo,sk,ab,u],i)=>{ const p=trPferd({fell:i%2?'#2a201a':'#3a2a22',schabracke:sk,federbusch:rolle==='koenig'?'#c8202a':'#efeae0'}), m=trMensch(mo); trReiter(p,m); world.add(p.G);
    if(rolle==='banner'){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,3.6,6),holz); st.position.set(.25,1.5,.1); m.G.add(st); const f=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.8),new THREE.MeshLambertMaterial({map:canvasTex(160,116,g=>wappenMal(g,160,116,0)),side:THREE.DoubleSide})); f.position.set(.25,2.9,-.55); f.rotation.y=Math.PI/2; m.G.add(f); A.fahne=f; }
    A.reiter.push({p,m,ab,u,ph:i*1.3}); if(rolle==='koenig') A.koenig=A.reiter[i]; });
  A.kd=bd-4; A.ku=-roadW(R,bd)/2; // Richard wartet zu Fuß neben dem Burgherrn, sein Pferd am Rand der Kehre
  const ru=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex(kText(TRI_BEISEITE)),transparent:true,depthWrite:false})); ru.scale.set(7.4,2.3,1); ru.visible=false; world.add(ru); A.ruf=ru; buildFriedel(T); } // Ruf des Vorreiters

// ---- Bewegung (jeden Frame): Gefolge reitet dir auf dem Anstieg entgegen und vorbei, Träger, Pferde nicken ----
const TRI_V=3.2; // Trab der Reiter, m/s
function poseTrifels(dt){ const A=anim.tri, T=R.tri; if(!A||!T) return; const t=performance.now()/1000, rt=race.state==='run'?race.t:0;
  if(race.state==='count'){ if(A.kst!=='count') A.kt=0; A.kt=Math.min(5,A.kt+dt); } else A.kt=race.state==='run'?5+race.t:0; A.kst=race.state; // Zeit der Kamerafahrt: 5 s Countdown, dann 10 s schon im Rennen
  // Begegnung: Richards Reihe (12 m hinter dem Vorreiter) ist beim Sturz (TRIFELS_T.sturz) genau neben dir; vorher kommen sie von der Vorburg herab, warten oben bis zum Start
  const d0=Math.min(T.hof[0]-8, T.sturz-12+TRI_V*(TRIFELS_T.sturz-rt)), lauf=race.state==='run'&&!race.paused&&d0<T.hof[0]-8;
  for(const r of A.reiter){ let d=d0+r.ab, u=r.u, a=lauf?1:0;
    if(r===A.koenig){ const L=A.kd-d, x=rt-4.2, w=x<=0?0:x<1?1.7*x*x:3.4*(x-.5); if(w<L){ d=A.kd-w; u=A.ku+(r.u-A.ku)*bSm((w-L+15)/15); a=x>0?1:0; } } // Richard: steigt beim Burgherrn auf und trabt zurück an seinen Platz im Gefolge
    const vis=d>-30&&d<T.hof[1]; r.p.G.visible=vis; if(!vis) continue; const P=wegPos(d,u), y=bodenY(P.x,P.z);
    r.p.G.position.set(P.x,y,P.z); r.p.G.rotation.set(0,-P.h-Math.PI/2,0); // lokal +z gegen die Fahrtrichtung: reitet bergab
    if(a) r.ph+=dt*TRI_V*2.6*simSpeed(); const s=Math.sin(r.ph); r.p.beine.forEach((b,i)=>b.rotation.x=.55*a*(i===0||i===3?s:-s)); r.p.hals.rotation.x=.08*a*Math.sin(r.ph*2)+.03*Math.sin(t*.9+r.ab);
    r.m.G.position.y=1.1+.05*a*Math.abs(Math.sin(r.ph)); }
  A.d0=d0; // für triSpur
  triIntroPose(A.kt);
  triWanken(dt,t); poseSturz(dt,t,rt); poseGasthaus(dt,t); poseAudienz(dt,t,rt); poseFriedel(dt,t,rt); sicher('Trifels-Leben',()=>poseTrifelsLeben(dt,t,rt)); sicher('Trifels-Ton',()=>triTon(dt,t,rt)); trifelsLicht(rt); sicher('Trifels-Nebel',()=>poseTrifelsNebel(t));
  if(A.ruf){ const g=d0-me.d, an=race.state==='run'&&g<48&&g>2, b=A.reiter[0].p.G.position; A.ruf.visible=an; if(an){ A.ruf.position.set(b.x,b.y+5.2,b.z); const tx=kText(TRI_BEISEITE); if(A.rufTx!==tx){ A.rufTx=tx; A.ruf.material.map=blaseTex(tx); A.ruf.material.needsUpdate=true; } } }
  if(A.fahne) A.fahne.rotation.x=.12*Math.sin(t*2.3);
  // Burgherr: hebt die Hand und spricht dich an, kurz bevor die Audienz-Tafel kommt (Blase über seinem Kopf, aber nie auf deinem Fahrer)
  const B=A.burgherr; if(B&&!A.aud){ const an=race.state==='run'&&rt>=TRI_RUF[0]&&rt<TRI_RUF[1]; B.blase.visible=an; if(an){ B.txt=kText(TRI_RUF_TXT); triBlaseText(B.blase,B.txt); const k=B.m.G.position.clone(); k.y+=2.6; triBlaseUeber(B.blase,k,riders3d[myKey]&&riders3d[myKey].g); } B.m.arme[1].rotation.x+=((an||A.kt>5.2&&A.kt<9.5?-2.4:0)-B.m.arme[1].rotation.x)*Math.min(1,dt*4); B.m.arme[0].rotation.x+=(0-B.m.arme[0].rotation.x)*Math.min(1,dt*4); B.m.kopf.rotation.y=.15*Math.sin(t*.6); B.m.G.rotation.y+=angDiff(B.ry,B.m.G.rotation.y)*Math.min(1,dt*3); }
  // Goldkarren: wartet an der Abzweigung, ab 5 s vor der Vorburg (Workout-Zeit) im Schritt den Burgweg hinauf, fährt durchs Tor und verschwindet
  const C=A.karren; if(C&&T.weg){ const W=C.P, L=T.wegL, ank=-C.Lr+(C.Lr+6)*bSm(A.kt/7.5), s=Math.min(L+4, ank<6?ank:6+Math.max(0,rt-(TRIFELS_T.rauf-5))*KARREN_TRI), v=C.sAlt==null?0:Math.abs(s-C.sAlt)/Math.max(dt,1e-3), lauf=!race.paused&&v>.05; C.sAlt=s; // bei der Kamerafahrt rollt er über die Kehre heran
    C.K.visible=s<L+3.5; let i=1; while(i<W.length-1&&W[i].L<s) i++; const a=W[i-1], b=W[i], f=Math.min(1,Math.max(0,(s-a.L)/Math.max(.01,b.L-a.L))), y=a.y+(b.y-a.y)*f-.17;
    const kx=a.x+(b.x-a.x)*f, kz=a.z+(b.z-a.z)*f, ry=Math.atan2(b.x-a.x,b.z-a.z), sx=Math.sin(ry)*.9, sz=Math.cos(ry)*.9; let ky=y; for(const [p,q] of [[1,1],[1,-1],[-1,1],[-1,-1]]) ky=Math.max(ky,bodenY(kx+sx*p+sz*q,kz+sz*p-sx*q)); // kein Rad im Boden (halb auf der Straße)
    C.K.position.set(kx, ky, kz); C.K.rotation.set(-Math.atan((b.y-a.y)/Math.max(.01,b.L-a.L)), ry, 0);
    if(lauf) C.ph+=dt*Math.min(v,5)*3; const sn=Math.sin(C.ph), am=lauf?1:0; for(const rr of C.raeder) rr.rotation.x=-(s/.55);
    A.kpferd.beine.forEach((bb,k)=>bb.rotation.x=.4*am*(k===0||k===3?sn:-sn)); A.kpferd.hals.rotation.x=.06*Math.sin(lauf?C.ph*2:t*.7);
    for(const w of C.wachen){ w.beine[0].rotation.x=.45*am*sn; w.beine[1].rotation.x=-.45*am*sn; } } }
const KARREN_TRI=1.2; // Schritt des Goldkarrens, m/s
const TRI_BEISEITE='Beiseite mit Euch, [Bauer|Bäuerin]! Platz für den König von England!';
// Spur (aus rennen.js): vor dem Gefolge in der Mitte, ab 32 m ganz an den rechten Rand gedrängt, bis der Letzte vorbei ist; beim Sturz rutschst du aufs Bankett
function triSpur(d,t){ const A=anim.tri; if(!A||A.d0==null||race.state!=='run') return t; t=triGegenSpur(d,t); if(A.sturzS>=.4) return roadW(R,d)/2-.7; const g=A.d0-d, L=A.reiter.length?A.reiter[A.reiter.length-1].ab:0; if(g>70||g+L<-6) return t;
  const H=roadW(R,d)/2-.3, mitte=bSm((70-g)/15), rechts=bSm((32-g)/6)*bSm((g+L+6)/5); return t+(0-t)*mitte*(1-rechts)+(H-t)*rechts; }
// Wanken: reitet ein Pferd dicht an dir vorbei, kommt dein Holzrad ins Schwanken (Rollen r.wank und Lenken r.lenk, wirken in putRider), bis ±18°
function triWanken(dt,t){ const A=anim.tri, ich=riders3d[myKey]; if(!ich) return; let e=0;
  if(race.state==='run'&&A.d0!=null&&ich.lane!=null) for(const r of A.reiter){ const dd=Math.abs(A.d0+r.ab-me.d), lat=Math.abs(ich.lane-r.u); e+=bSm((4-dd)/2.5)*bSm((2.3-lat)/1); }
  A.wankE=Math.max(Math.min(1,e),(A.wankE||0)-dt*.7); ich.wank=A.wankE*(.22*Math.sin(t*7.3)+.09*Math.sin(t*12.1)); ich.lenk=A.wankE*.18*Math.sin(t*5.1+1); }
// Sturz: als Richards Reihe vorbeizieht, kippst du nach rechts an den Wegrand, ein Ritter spottet, du rappelst dich auf, klopfst den Staub ab, hebst das Rad auf und steigst wieder auf
const TRI_SPOTT='Hoho, [Bauer|Bäuerin], das Radeln will gelernt sein!';
function poseSturz(dt,t,rt){ const A=anim.tri, S=A.sturzF, ich=riders3d[myKey]; if(!S||!ich) return; const s=race.state==='run'?rt-TRIFELS_T.sturz:-1, an=s>=0&&s<TRIFELS_T.liegen, m=S[KST.stand==='baeuerin'?'baeuerin':'bauer'];
  S.bauer.G.visible=S.baeuerin.G.visible=false; S.rad.visible=false; A.spott.visible=false;
  const g=A.d0!=null?A.d0-me.d:99, L=A.reiter.length?A.reiter[A.reiter.length-1].ab:0; A.seitZ=race.state==='run'&&g<14&&(g+L>-3||an||s>=0&&s<TRIFELS_T.liegen+.5)?1:0; A.seitW=(A.seitW||0)+(A.seitZ-(A.seitW||0))*Math.min(1,dt*1.8); A.sturzS=an?s:-1; // Seitenkamera (trifelsKamera)
  if(!an) return; const d=me.d, hd=headingAt(R,d), u=ich.lane||0, p=wegPos(d,u), y=bodenY(p.x,p.z), ry=Math.atan2(Math.cos(hd),Math.sin(hd)), f=s<.55?(s/.55)**2:1;
  if(s<3.2){ ich.wank=(ich.wank||0)+(1.45-(ich.wank||0))*f; ich.lenk=.25*f; } // fällt mit dem Rad um und bleibt liegen
  else { ich.g.visible=false; const auf=bSm((s-3.2)/1.4), kl=s>4.6&&s<5.6?Math.sin((s-4.6)*Math.PI*4):0, hb=bSm((s-5.6)/.8); // aufrappeln, Staub abklopfen, Rad aufheben
    if(s<6.4){ m.G.visible=true; m.G.position.set(p.x+Math.sin(hd)*.5,y,p.z-Math.cos(hd)*.5); m.G.rotation.set(0,ry,1.4*(1-auf)); m.arme[0].rotation.x=-.6*Math.abs(kl)-(s>5.6?.9*hb:0); m.arme[1].rotation.x=-.6*Math.abs(kl)-(s>5.6?.9*hb:0); m.kopf.rotation.x=s>4.6&&s<5.6?.35:0;
      S.rad.visible=true; S.rad.position.set(p.x,roadY(d)+.12,p.z); S.rad.rotation.set(0,-hd,0); S.rad.children[0].rotation.x=1.45*(1-hb); }
    else { ich.g.visible=true; ich.wank=0; ich.lenk=0; } } // wieder aufgestiegen
  if(s>.45&&s<.5) for(let i=0;i<40;i++){ const a=Math.random()*Math.PI*2, v=.6+Math.random()*1.4; partSpawn(parts.dust,p.x+Math.sin(hd)*-.8,y+.15,p.z+Math.cos(hd)*.8,Math.cos(a)*v,.3+Math.random()*.6,Math.sin(a)*v,1.8,Math.random()<.5?'#b98466':'#a8765a'); } // Staubwolke
  if(s>1.2&&s<5){ const r=A.reiter[A.reiter.length-1].p.G.position, k=r.clone(); k.y+=3.4; triBlaseText(A.spott,kText(TRI_SPOTT)); triBlaseUeber(A.spott,k,null); A.spott.visible=true; } }
const TRI_RUF=[TRIFELS_T.rauf+2, TRIFELS_T.rauf+TRIFELS_T.hof/2], TRI_RUF_TXT='Halt! Ihr seid doch [der Bursche, der|die Magd, die] sich für das Gold meldet?'; // Workout-Zeit (s): Burgherr ruft dich an, bis du vor ihm hältst
// Audienz (Workout-Zeit wie der Halt in trifelsDef): du steigst ab und verbeugst dich, der Burgherr spricht (Hochdeutsch), danach Tafel „Der Auftrag des Burgherrn“ (kampagne.js)
const TRI_AUD=[TRIFELS_T.rauf+TRIFELS_T.hof/2, TRIFELS_T.rauf+TRIFELS_T.hof/2+TRIFELS_T.audienz];
const TRI_AUD_TXT=[[2.5,'Ihr wollt also das Gold des Königs nach Speyer geleiten?','offen'],[9,'Für so ein Unterfangen brauche ich Leute, denen ich wirklich vertrauen kann – und die etwas taugen.','brust'],
  [17.5,'Beweist es: Besiegt Hans von Trotha auf Burg Berwartstein!','zeig'],[25,'Der Weg dorthin ist weit und beschwerlich.','offen'],[31,'Gott mit Euch!','segen'],[35,null]]; // [ab s, Text, Geste]
function poseAudienz(dt,t,rt){ const A=anim.tri, B=A.burgherr, V=A.ichV, ich=riders3d[myKey]; if(!B||!V) return; const s=race.state==='run'?rt-TRI_AUD[0]:-1, an=s>=0&&s<TRIFELS_T.audienz, k=Math.min(1,dt*4);
  A.aud=an; const m=V[KST.stand==='baeuerin'?'baeuerin':'bauer']; V.bauer.G.visible=V.baeuerin.G.visible=false; m.G.visible=V.rad.visible=an; if(!an){ if(A.audCam){ camOverride=null; A.audCam=false; camS.init=false; } return; }
  if(ich) ich.g.visible=false; // du stehst neben deinem Rad
  const bp=B.m.G.position; m.G.rotation.y=Math.atan2(bp.x-m.G.position.x,bp.z-m.G.position.z); B.m.G.rotation.y+=angDiff(Math.atan2(m.G.position.x-bp.x,m.G.position.z-bp.z),B.m.G.rotation.y)*k;
  // Verbeugung zu Beginn und beim Abschied: Oberkörper vor, Kopf gesenkt, Hand auf die Brust
  const vb=Math.max(bSm((s-.6)/.8)*bSm((4.6-s)/.8), bSm((s-31.6)/.6)*bSm((34.6-s)/.6)); m.G.rotation.x=.42*vb; m.kopf.rotation.x=.45*vb; m.arme[1].rotation.x=-1.1*vb; m.arme[1].rotation.z=.12-.5*vb;
  const z=TRI_AUD_TXT.filter(x=>s>=x[0]).pop(), ge=z&&z[1]?z[2]:'', tx=z&&z[1]?kText(z[1]):'';
  B.blase.visible=!!tx; if(tx){ triBlaseText(B.blase,tx); const p=bp.clone(); p.y+=2.6; triBlaseUeber(B.blase,p,m.G); }
  const a1=ge==='zeig'?-1.55:ge==='segen'?-2.4:ge==='offen'?-.7:0, a0=ge==='brust'?-1.2:ge==='offen'?-.5:0; // rechter Arm zeigt, segnet oder öffnet sich; linke Hand an die Brust
  B.m.arme[1].rotation.x+=(a1-B.m.arme[1].rotation.x)*k; B.m.arme[0].rotation.x+=(a0-B.m.arme[0].rotation.x)*k; B.m.kopf.rotation.y=ge==='zeig'?-.5:.08*Math.sin(t*.8);
  // Kamera: Totale von der Innenseite der Kehre (du, Burgherr, Wachen), ab dem Auftrag über deine Schulter auf den Burgherrn
  const d=R.tri.aud, w=bSm((s-15.5)/2), at=(dd,u,y)=>{ const p=wegPos(dd,u); return [p.x,roadY(dd)+y,p.z]; }, rw=roadW(R,d)/2, mix=(a,b)=>a.map((v,i)=>v+(b[i]-v)*w);
  camOverride={pos:mix(at(d-7,1.2,2.5),at(d+.3,-(rw-2.4),2)), look:mix(at(d+2.5,-(rw+.4),1.2),[bp.x,bp.y+1.55,bp.z])}; A.audCam=true; }
// Kamerafahrt beim Countdown (kt = 0–15 s, ab 5 s fährst du schon): Weitwinkel auf den Trifels, Schwenk zum Goldkarren, der über die Kehre heranrollt und vor dem Burgherrn
// auf den Burgweg biegt, eine Wache stellt eine Truhe ab, Löwenherz schwingt sich aufs Pferd, dann Flug den Berg hinab zu dir
function triIntroPose(kt){ const A=anim.tri, Q=A.koenig, U=A.truhe;
  if(Q&&kt<9.5){ const m=Q.m, k=bSm((kt-7.4)/1.2), s=Math.sin(Math.PI*k); // steht links neben dem Pferd (zum Burgherrn hin), Schwung im Bogen in den Sattel
    m.G.position.set(-.9*(1-k),1.1*k+.5*s,.05); m.G.rotation.set(0,Math.PI/2*(1-k),0); m.beine[0].rotation.set(-.9*k,0,-.35*k); m.beine[1].rotation.set(-.9*k-.8*s,0,.35*k);
    m.arme[0].rotation.x=m.arme[1].rotation.x=-1.6*(1-k)*bSm((kt-6.6)/.5)-.7*k; }
  if(U){ const k=bSm((kt-6.2)/1), w=U.w, g=w.G.position, hb=new THREE.Vector3(g.x-.45,g.y+.85,g.z); // Wache bückt sich und setzt die Truhe ab
    U.t.position.copy(hb.lerp(U.boden,k)); w.kopf.rotation.x=.5*Math.sin(Math.PI*k); w.arme[0].rotation.x=w.arme[1].rotation.x=-1.2*(1-k*k); } }
function triIntroKamera(){ const A=anim.tri, T=R.tri, kt=A&&A.kt; if(!T||!A.koenig||!(race.state==='count'||race.state==='run')||kt>=15) return false;
  const [kx,ky]=T.karren, [bx,by]=T.burg, hy=T.hofY, V=(x,y,z)=>new THREE.Vector3(x,y,z), K=A.karren.K.position, Kg=A.koenig.p.G.position, sm=(a,b)=>bSm((kt-a)/(b-a));
  const pos=V(kx-25,hy+40,ky+40).lerp(V(kx-20,hy+30,ky+5),sm(0,4)).lerp(V(kx-8,hy+4,ky-T.rh+12),sm(3.5,6)).lerp(V(kx-12,hy+3.5,ky-T.rh+9),sm(6.5,8)); // Burg von weit, dann in die Vorburg, dann zu Burgherr und Richard
  const look=V(bx,hy+20,by).lerp(V(K.x,K.y+1.2,K.z),sm(3.5,5.5)).lerp(V(Kg.x,Kg.y+1.6,Kg.z),sm(6.8,7.8));
  const f=sm(10,15); if(f>0){ pos.lerp(camera.position,f).y+=30*Math.sin(Math.PI*f); look.lerp(V(camS.lx,camS.ly,camS.lz),f); } // Flug zu dir, im Bogen über den Wald
  camera.position.copy(pos); camera.lookAt(look); return true; }
// Kamera (aus draw): schaut kurz zum Burgherrn, während er dich anspricht (wie beim Zöllner)
function trifelsKamera(dt){ const A=anim.tri, B=A&&A.burgherr, ich=riders3d[myKey]; if(A&&triIntroKamera()) return; if(!B||!ich||race.state!=='run') return;
  if(A.seitW>.002){ const w=bSm(A.seitW), u=ich.lane||0, ps=wegPos(me.d+2.2,u+5), pl=wegPos(me.d-1.2,u-1.4), yr=roadY(me.d), ys=Math.max(yr+1.7,terrainAt(ps.x,ps.z)+1.2), sh=A.sturzS>.45&&A.sturzS<.95?.18*(1-(A.sturzS-.45)/.5):0; // Gefolge: von rechts seitlich auf dich und die Pferde
    const lk=new THREE.Vector3(camS.lx,camS.ly,camS.lz).lerp(new THREE.Vector3(pl.x,yr+1,pl.z),w); camera.position.lerp(new THREE.Vector3(ps.x+(Math.random()-.5)*sh,ys+(Math.random()-.5)*sh,ps.z),w); camera.lookAt(lk); }
  const rt=race.t, a=TRI_RUF[0]+6, b=TRI_RUF[1]+1, p=B.m.G.position; if(rt<a||rt>b) return;
  const w=.75*bSm((rt-a)/1.2)*bSm((b-rt)/1.2), look=new THREE.Vector3(p.x,p.y+1.6,p.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz); camera.lookAt(now.lerp(look,w)); }

// ---- Friedel, Wirtshaus-Szene, Elwetritsche-Jagden (Schritt 4/5) – Texte vom Nutzer, Übersicht in KAMPAGNE.md ----
const TRI_TXT={dorfmann:'Zeh Gulde, dass du heit owend kä Elwetritsch fangsch!', friedel1:'Des wer ma mo sehe!', dorfweib:['Den Bu henn se ah ä mo zu oft hochgeworfe…','…un ä mo zu wenich uffgfange.'],
  friedel2:['Du fahrschd doch a noch Siede, gell?','Kinnsch ma do vielleicht helfe? Allä trau ich mich ned in de Wald…'],
  ank:['Psst. Do vorne raschelts, [name]!','Do is se widder!','Wie frech se uns aguckt, die mänt a, sie is de Kees!','Uffbasse, [name], die is gscheit wie sunscht was.','Des is die letzscht Chance! Ich halt schummo de Sack uff, [name]!'],
  hopp:'Hopp, hopp, alleweil hemmer se!',
  zurueck:['Jetz wart doch bitte uff mich!','Mein Bock is oich longsam…','Mei Wade krampfen, [name]!','Jetz wart doch bitte uff mich!'],
  weg:['Weg isse – ins Gebisch!',"Die hot uns d' Zung rausgstreckt, hosch des gsähne?",'Jetzt lacht se uns a noch aus!','Des gibts doch ned – schun widder!'],
  angst:['Die beißen, die Sauviecher, ich schwörs!',['Hosch du des Geheul ghört?','Des war bestimmt bloß de Wind…'],['Im Dunkle seht ma do hinnen Ache leichte…','…do werd ma ganz onnerschd.']],
  lob:['So schnell bin ich noch nie gewesst!','Mit dir zsamme kriech ich noch so eh Vieh, ich spürs!'],
  fang:['Ich hab se!!! Ich hab des Scheißding!','Zeh Gulde, aller!!!'], ende:['Ich muss glei zurick ind Wertschaft, die werren gucken…','Mer treffen uns dann moie do im Gaschthaus in de Näh vum Deifelsdisch, gell?','Hosch enner gud bei mer, [name]!'],
  lampe:'Oich dunkel do im Wald, loss mo di Lambe aschalte!',
  sau:['Gugg mo do! E Wutz!','Do kinnt ma e subba Brotworschd draus mache… Hosch du a so en Hunger?'],
  schafe:['Wenn nur die bleede Elwetritsche ach so schää rumstehe würden…','…anstatt so rumzuflattre die ganz Zeit!']};
// Ablauf aus dem Workout: wer sagt wann was (Workout-Zeit in s) – Wirtshaus am Ende des Einfahrens, je Jagd Ankündigung, Anfeuern, Zurückfallen, Countdown, Entwischt/Fang, dazwischen Lob und Angst
function triSkript(){ const S=race.woSegs||[], tW=S[0]?S[0].t0+S[0].dur:480, tS=tW-TRIFELS_T.szene, J=S.filter(s=>/Jagd/.test(s.label)), L=[], X=TRI_TXT;
  const sag=(t0,dur,wer,txt)=>{ if(Array.isArray(txt)) txt.forEach((x,i)=>L.push({t0:t0+dur*i/txt.length,t1:t0+dur*(i+1)/txt.length,wer,txt:x})); else L.push({t0,t1:t0+dur,wer,txt}); }; // lange Sprüche: mehrere Blasen nacheinander
  sag(tS+1,6,'dorfmann',X.dorfmann); sag(tS+7,4,'friedel',X.friedel1); sag(tS+11,8,'dorfweib',X.dorfweib); sag(tS+19,11,'friedel',X.friedel2); // Zwischenszene am Wirtshaus
  J.forEach((j,k)=>{ const a=j.t0; sag(a-7,7,'friedel',X.ank[k]); sag(a+3,5,'friedel',X.hopp); if(k<4) sag(a+10,6,'friedel',X.zurueck[k]);
    if(k<4) sag(a+j.dur+1,6,'friedel',X.weg[k]); else sag(a+j.dur-3,9,'friedel',X.fang);
    if(k===0) sag(a+TRIFELS_T.schafe,9,'friedel',X.schafe); // nach den Schafen auf dem Weg (welt-trifels-wiesen.js)
    if(k<3){ if(k) sag(a+70,8,'friedel',X.lob[k-1]); // nach Jagd 1 kein Lob (vom Nutzer gewünscht: dort reichen die Schafe)
      sag(a+140,9,'friedel',X.angst[k]); } if(k===3){ sag(a+42,6,'friedel',X.lampe); sag(a+TRIFELS_T.sau-2,13,'friedel',X.sau); } }); // Wildschwein nach Jagd 4 (welt-trifels-leben.js)
  const G=S.find(s=>s.label==='Grundlage'), T=race.woT||0, heim=G?G.t0+Math.round(G.dur*.55):T-52; sag(heim-21,20,'friedel',X.ende); // Abschied in der Grundlage, dann kehrt er um – das Ausfahren fährt man allein
  const lampe=J[3]?J[3].t0+48:heim; // nach Friedels Lampen-Spruch gehen beide Laternen richtig an
  return {L,tS,tW,J,T,heim,lampe}; }
// Sprechblase in fester Bildschirmgröße (gut lesbar, auch von weitem)
function triBlase(){ const s=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false,depthTest:false,sizeAttenuation:false})); s.scale.set(.62,.19,1); s.renderOrder=10; s.visible=false; world.add(s); return s; }
// Blase auf dem Bildschirm über den Punkt p setzen; liegt sie auf dem Fahrer g, rückt sie über dessen Kopf (NDC: halbe Blasenhöhe aus scale und Brennweite)
function triBlaseUeber(s,p,g){ const q=p.clone().project(camera); if(q.z>1) return; const e=camera.projectionMatrix.elements, hh=s.scale.y*e[5]/2, hw=s.scale.x*e[0]/2; let y=q.y+hh;
  if(g&&g.visible){ const r=g.position.clone(); r.y+=2.2; const rq=r.project(camera); if(rq.z<1&&Math.abs(q.x-rq.x)<hw+.12) y=Math.max(y,rq.y+hh+.04); }
  q.y=Math.min(.62-hh,y); q.x=clampN(q.x,-1+hw,1-hw); s.position.copy(q.unproject(camera)); } // oben bleibt Platz für die Anzeigen
function triBlaseText(s,txt){ if(s.userData.txt!==txt){ s.userData.txt=txt; if(s.material.map) s.material.map.dispose(); s.material.map=blaseTex(txt); s.material.needsUpdate=true; s.scale.y=.19*(s.material.map.hf||1); } } // lange Texte: Blase höher

// Elwetritsche nach den Vorlagen (vorlagen/elwetritsche/): dicker gelb-oranger Körper, großer Entenschnabel, Glupschaugen auf Stielen, Federschopf, Stummelflügel, bunter Schwanz, rote Beine; blickt nach +z
function elwetritscheModell(){ const G=new THREE.Group(), K=new THREE.Group(); G.add(K); const L=c=>lam(c);
  const rumpf=new THREE.Mesh(new THREE.SphereGeometry(.32,14,10),L('#f0a830')); rumpf.scale.set(1,1.05,1.15); rumpf.position.y=.55; K.add(rumpf);
  const bauch=new THREE.Mesh(new THREE.SphereGeometry(.24,12,8),L('#f6d27a')); bauch.position.set(0,.5,.16); K.add(bauch);
  const kopf=new THREE.Group(); kopf.position.set(0,.85,.12); K.add(kopf); const hk=new THREE.Mesh(new THREE.SphereGeometry(.17,12,9),L('#e8862a')); kopf.add(hk);
  const schnabel=new THREE.Mesh(new THREE.BoxGeometry(.2,.07,.34),L('#f2c230')); schnabel.position.set(0,-.03,.26); kopf.add(schnabel); const uk=new THREE.Mesh(new THREE.BoxGeometry(.18,.05,.28),L('#e0a820')); uk.position.set(0,-.09,.22); uk.rotation.x=.12; kopf.add(uk);
  const zunge=new THREE.Mesh(new THREE.BoxGeometry(.06,.02,.16),L('#d0261d')); zunge.position.set(0,-.07,.42); zunge.visible=false; kopf.add(zunge);
  const augen=[]; for(const x of [-.07,.07]){ const a=new THREE.Group(); a.position.set(x,.12,.06); kopf.add(a); const st=new THREE.Mesh(new THREE.CylinderGeometry(.018,.022,.16,6),L('#e8862a')); st.position.y=.08; a.add(st);
    const ap=new THREE.Mesh(new THREE.SphereGeometry(.065,10,8),L('#f6f4ee')); ap.position.y=.18; a.add(ap); const pu=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),L('#151515')); pu.position.set(0,.18,.05); a.add(pu); augen.push(a); }
  for(let i=0;i<6;i++){ const f=new THREE.Mesh(new THREE.ConeGeometry(.03,.22,4),L(i%2?'#d0261d':'#f0a830')); f.position.set((i-2.5)*.03,.2,-.04); f.rotation.set(-.4,0,(i-2.5)*.18); kopf.add(f); } // Federschopf
  const fluegel=[-1,1].map(s=>{ const w=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),L('#d9782a')); w.scale.set(.35,.7,1); w.position.set(s*.31,.6,0); K.add(w); return w; });
  const F=['#d0261d','#f0a830','#3aa655','#2f80ed','#9b5fe0','#f2c230','#2bb5c4']; F.forEach((c,i)=>{ const f=new THREE.Mesh(new THREE.BoxGeometry(.05,.5,.02),L(c)); const a=(i-3)*.28; f.position.set(Math.sin(a)*.14,.72+Math.cos(a)*.14,-.36); f.rotation.set(-.6,0,-a); K.add(f); }); // bunter Schwanzfächer
  const beine=[-.11,.11].map(x=>{ const b=new THREE.Group(); b.position.set(x,.32,0); G.add(b); const l=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.32,5),L('#c0392b')); l.position.y=-.16; b.add(l);
    for(const a of [-.5,0,.5]){ const z=new THREE.Mesh(new THREE.BoxGeometry(.03,.02,.14),L('#c0392b')); z.position.set(Math.sin(a)*.04,-.31,.05); z.rotation.y=a; b.add(z); } return b; });
  G.scale.setScalar(1.2); return {G,K,kopf,beine,fluegel,augen,zunge}; }

// ---- Aufbau (aus buildTrifelsLeute): Friedel auf dem Holzrad mit Sack und Laterne, Dorfleute vor dem Wirtshaus, Elwetritsche ----
function buildFriedel(T){ const A=anim.tri, M=c=>lam(c), haar=M('#b8452a'), haar2=M('#9c3a22');
  const r=makeRider('custom',{...LOOK_DEF.custom,name:'Friedel',build:.9,jersey:'#5d7a3a',sleeve:'#a8862e'},true); r.g.scale.setScalar(.95); r.tag.visible=false; world.add(r.g); // schmächtig, Wams grün
  for(let i=0;i<16;i++){ const a=Math.PI*(.45+i/15*1.1), l=.2+((i*37)%7)*.03, st=new THREE.Mesh(new THREE.BoxGeometry(.035,l,.05),i%2?haar:haar2); // lange zottelige rote Haare unter der Haube
    st.position.set(.04+Math.cos(a)*.13,.02-l/2+.04,Math.sin(a)*.13); st.rotation.set(Math.sin(a)*.25,0,Math.cos(a)*-.25); r.headG.add(st); }
  for(let i=0;i<4;i++){ const st=new THREE.Mesh(new THREE.BoxGeometry(.03,.07,.05),haar); st.position.set(.15,.1,(i-1.5)*.05); r.headG.add(st); } // Fransen vorn
  const sack=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),M('#c8b48a')); sack.scale.set(.9,1.1,.8); sack.position.set(-.32,1.15,-.12); r.body.add(sack); // Sack auf dem Rücken
  const raus=new THREE.Group(); raus.position.set(-.32,1.38,-.12); r.body.add(raus); const schn=new THREE.Group(), aug=new THREE.Group(); raus.add(schn,aug); // schaut beim Zappeln oben aus dem Sack
  for(const [y,w,c] of [[.03,.09,'#f2c230'],[0,.08,'#e0a820']]){ const b=new THREE.Mesh(new THREE.BoxGeometry(w,.03,.16),M(c)); b.position.set(0,y,.06); b.rotation.x=-.5; schn.add(b); } // Entenschnabel
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.012,.015,.14,5),M('#e8862a')); st.position.y=.07; aug.add(st); const ap=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:'#fff4d0'})); ap.position.y=.15; aug.add(ap);
  const pu=new THREE.Mesh(new THREE.SphereGeometry(.02,6,4),lam('#151515')); pu.position.set(.03,.15,0); aug.add(pu); schn.visible=aug.visible=false; // Augenstiel
  const la=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.12),lampGlowMat()); la.position.set(.62,.88,0); r.body.add(la); const lh=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.12,4),M('#2e2c2a')); lh.position.set(.62,.99,0); r.body.add(lh); // Laterne am Lenker
  A.friedel={r,sack,raus:{G:raus,schn,aug},d:T.wirtD+1,crank:0,mode:'park',blase:triBlase()};
  // Dorfleute vor dem Wirtshaus „Zack Zack“ (rechts), mit Krügen, blicken zu Friedel
  const H=T.wirt, dw=T.wirtD, rw=roadW(R,dw)/2, uF=(()=>{ if(!H) return rw-.4; const [hx,hz]=posAt(R,H.d), hh=headingAt(R,H.d); return Math.min(rw-.2,(H.x-hx)*-Math.sin(hh)+(H.y-hz)*Math.cos(hh)-H.dep/2-.5); })(), // vor der Fassade auf dem Pflaster (die Fassade steht kaum neben dem Weg)
    fp=wegPos(dw+.9,uF-1.1), krug=m=>{ const k=new THREE.Mesh(new THREE.CylinderGeometry(.05,.045,.13,8),M('#8a6a44')); k.position.y=-.66; m.arme[1].add(k); m.arme[1].rotation.x=-.9; };
  const leut=[['dorfmann',{kittel:'#6b5a3a',hose:'#3a3020',haar:'#4a3222',bart:'#4a3222'},-2.5,-.2],['dorfweib',{lang:'#8a3a2a',haar:'#e8e0d0'},2.8,-.2],[null,{kittel:'#4a5a6a',hose:'#3a3a2a',haar:'#6a5236'},.4,0],[null,{kittel:'#7a3a3a',hose:'#2e2a24',haar:'#2e2420',bart:'#2e2420'},-.8,0]];
  A.dorf={}; A.dorfAlle=[]; for(const [wer,o,da,uo] of leut){ const m=trMensch(o), p=wegPos(dw+da,uF+uo); m.G.position.set(p.x,bodenY(p.x,p.z),p.z); m.G.rotation.y=Math.atan2(fp.x-p.x,fp.z-p.z); world.add(m.G); krug(m); A.dorfAlle.push(m);
    if(wer){ A.dorf[wer]={m,blase:triBlase()}; A.dorf[wer].blase.position.set(p.x,m.G.position.y+2.7,p.z); } }
  // Zwischenszene: Friedel und du steht neben euren abgestellten Holzrädern (Fahrerfiguren dann ausgeblendet)
  const rad=(d,u)=>{ const g=new THREE.Group(), b=new THREE.Group(); g.add(b); holzRad(b,M); const p=wegPos(d,u); g.position.set(p.x,roadY(d)+.12,p.z); g.rotation.y=-headingAt(R,d); world.add(g); return g; };
  const steh=(o,d,u)=>{ const m=trMensch(o), p=wegPos(d,u); m.G.position.set(p.x,bodenY(p.x,p.z),p.z); world.add(m.G); return m; };
  const fs=steh({kittel:'#5d7a3a',aermel:'#ece3cf',hose:'#3b342e',haar:'#b8452a'},dw+.9,uF-1.1); for(let i=0;i<12;i++){ const a=-1.3+i/11*2.6, l=.2+((i*37)%7)*.03, st=new THREE.Mesh(new THREE.BoxGeometry(.035,l,.05),i%2?haar:haar2); st.position.set(Math.sin(a)*.13,.08-l/2,-Math.cos(a)*.13); st.rotation.set(-Math.cos(a)*.25,0,Math.sin(a)*.25); fs.kopf.add(st); } // rote Zotteln
  { const sk=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),M('#c8b48a')); sk.scale.set(.9,1.1,.8); sk.position.set(0,1.25,-.27); fs.G.add(sk); }
  const F=A.friedel; F.steher=fs; F.rad=rad(dw+2.4,uF-2.6);
  const ichJ=lookOf(myKey).jersey, dA=T.aud, uA=-(roadW(R,dA)/2-.9), mv=o=>{ const m=steh(o,dA+1.8,uA); m.G.rotation.order='YXZ'; m.G.visible=false; return m; }; // Audienz: abgestiegen vor dem Burgherrn
  { const dS=T.sturz, uS=roadW(R,dS)/2-.3, ms=o=>{ const m=steh(o,dS,uS); m.G.rotation.order='YXZ'; m.G.visible=false; return m; };
    A.sturzF={bauer:ms({kittel:ichJ,aermel:'#ece3cf',hose:'#3b342e',haar:'#6b4a2e'}), baeuerin:ms({lang:'#7a4a3a',haar:'#6b4a2e'}), rad:rad(dS,uS)}; A.sturzF.rad.visible=false; A.spott=triBlase(); } // Sturz: aufstehende Figur und liegendes Rad
  A.ichV={bauer:mv({kittel:ichJ,aermel:'#ece3cf',hose:'#3b342e',haar:'#6b4a2e'}), baeuerin:mv({lang:'#7a4a3a',haar:'#6b4a2e'}), rad:rad(dA-.6,uA+1.1)}; A.ichV.rad.visible=false;
  A.ich={bauer:steh({kittel:ichJ,aermel:'#ece3cf',hose:'#3b342e',haar:'#6b4a2e'},dw-1.4,uF-2.2), baeuerin:steh({lang:'#7a4a3a',haar:'#6b4a2e'},dw-1.4,uF-2.2), rad:rad(dw-3,uF-2.9)}; A.uF=uF;
  A.elw=elwetritscheModell(); A.elw.G.visible=false; world.add(A.elw.G);
  A.elw.licht=new THREE.PointLight(0xffc860,0,9,2); world.add(A.elw.licht); F.licht=new THREE.PointLight(0xffd27a,0,16,1); world.add(F.licht); F.la=la; { const lm=lam('#d9d4c4'), lg=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.12),lm); lg.position.set(.62,.88,0); const lh=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.12,4),M('#2e2c2a')); lh.position.set(0,.11,0); lg.add(lh); A.meinL={m:lg,mat:lm,licht:new THREE.PointLight(0xffc870,0,18,1)}; world.add(A.meinL.licht); } // deine Öllaterne am Lenker, brennt ab Friedels Abschied (trifelsLicht)
  // leuchten in der Dunkelheit; hängen direkt in der Welt (nie unsichtbar), sonst übersetzt three.js bei jedem Ein-/Ausblenden alle Shader neu
  A.elwMats=[]; A.elw.G.traverse(o=>{ if(o.material&&!A.elwMats.includes(o.material)) A.elwMats.push(o.material); });
  if(!document.getElementById('triSag')){ const el=document.createElement('div'); el.id='triSag'; document.body.appendChild(el); } } // Friedels Worte, wenn er nicht im Bild ist

// ---- Sonnenuntergang über die Mission: Nachmittag am Burgherrn, goldener Spätnachmittag am Wirtshaus, Dämmerung im Wald, am Ende des Ausfahrens Nacht und Abblende ----
// Stufe k: 0 Nachmittag · 1 Spätnachmittag · 2 Dämmerung · 3 Nacht; Werte je Stufe, dazwischen überblendet
const TRI_LICHT={sun:[0xffd6a0,0xff9452,0xff5e3a,0x4a3a6a], sunI:[1.25,1.4,.55,.06], sunY:[.6,.2,.04,-.08], hemi:[0xc8d0e2,0x9c9ccc,0x5c6494,0x232a48], boden:[0x5a5a3a,0x40302a,0x2a2228,0x0c0c12], hemiI:[.74,.76,.52,.3],
  bg:[0xf4d0a2,0xf0a873,0x7a5a72,0x121828], himmel:[0xffffff,0xffffff,0x9a7a92,0x262c46], fern:[1,1,.7,.42]};
function trifelsLicht(rt){ const A=anim.tri; if(!A||race.rain) return; const K=race.state==='run'?A.sk:null, cv=renderer.domElement;
  let k=0; if(K){ const J=K.J, tR=TRI_RUF[1], P=[[0,0],[tR,.15],[K.tW,1],[J[0]?J[0].t0:K.tW+200,1.5],[J.length?J[J.length-1].t0+J[J.length-1].dur:K.heim,2.2],[K.T,3]];
    for(let i=1;i<P.length;i++) if(rt<P[i][0]){ const [a,ka]=P[i-1],[b,kb]=P[i]; k=ka+(kb-ka)*clampN((rt-a)/Math.max(1,b-a),0,1); break; } else k=P[i][1]; }
  const i=Math.min(2,Math.floor(k)), f=k-i, c=(n,o)=>(o||new THREE.Color()).set(TRI_LICHT[n][i]).lerp(new THREE.Color(TRI_LICHT[n][i+1]),f), z=n=>TRI_LICHT[n][i]+(TRI_LICHT[n][i+1]-TRI_LICHT[n][i])*f;
  c('sun',sun.color); sun.intensity=z('sunI'); c('hemi',hemi.color); c('boden',hemi.groundColor); hemi.intensity=z('hemiI'); const sy=z('sunY'); SUN_DIR.set(-1,sy,.42).normalize(); sunDisc(sy>-.03);
  if(SUNS) SUNS.forEach((s,j)=>s.material.opacity=(j?1:.75)*clampN((sy+.03)/.1,0,1));
  c('bg',scene.background); scene.fog.color.copy(scene.background); c('himmel',sky.material.color); if(R.fog0) scene.fog.far=R.fog0[1]*z('fern');
  const sch=sun.castShadow?k<2.05:k<1.95; if(sch!==sun.castShadow) sun.castShadow=sch; // ab der Dämmerung keine Sonnenschatten mehr: three.js (Lambert) rechnet den Schatten auch über das Laternenlicht – sonst bleiben Fahrer und Weg dunkel (einmaliger Shader-Neubau)
  const dk=clampN(k-1,0,2)/2; A.dk=dk; if(A.elw.licht){ const E=A.elw, F=A.friedel; E.licht.intensity=E.G.visible?2.2*dk:0; E.licht.position.copy(E.G.position); E.licht.position.y+=.8; const an=K?clampN((rt-K.lampe)/1.4,0,1):0, fl=an>0&&an<1?(Math.random()<.5?.25:1)*an:an; F.licht.intensity=F.r.g.visible?2.2*(dk*.3+(Math.max(dk,.55)-dk*.3)*fl):0; F.la.getWorldPosition(F.licht.position); { const hf=headingAt(R,F.d); F.licht.position.x-=Math.cos(hf)*.9; F.licht.position.z-=Math.sin(hf)*.9; F.licht.position.y+=1.3; } } // über und hinter dem Kopf: so ist auch die Seite zur Kamera hell // Elwetritsche glimmt, Friedels Laterne glimmt schwach und brennt nach seinem Lampen-Spruch hell (kurzes Flackern)
  { const L=A.meinL, ich=riders3d[myKey]; if(L&&ich){ if(L.m.parent!==ich.body) ich.body.add(L.m); const z=K?rt-K.lampe:-1, fl=z<0?0:z<1.4?(Math.random()<.5?.2:1)*bSm(z/1.4):1; // mit Friedels Laterne anzünden (nach seinem Lampen-Spruch): kurz flackern, dann ruhig
    L.mat.emissive.setRGB(fl,.78*fl,.42*fl); L.licht.intensity=ich.g.visible?2.5*fl*(.92+.08*Math.sin(performance.now()/1000*13)):0; L.m.getWorldPosition(L.licht.position); const hd=headingAt(R,me.d); L.licht.position.x-=Math.cos(hd)*1.1; L.licht.position.z-=Math.sin(hd)*1.1; L.licht.position.y+=1.5; } } // über und hinter dir: leuchtet den ganzen Fahrer aus (die Kamera sieht dich von hinten), reicht 18 m weit
  for(const m of A.elwMats||[]) if(m.emissive) m.emissive.copy(m.color).multiplyScalar(.55*dk);
  triNebel(A,K,rt);
  const ab=K?clampN((rt-(K.T-8))/8,0,1):0, fl=ab>0?`brightness(${(1-ab).toFixed(3)})`:''; if(cv.style.filter!==fl) cv.style.filter=fl; } // letzte 8 s: Bild blendet ab, bleibt schwarz bis zum Ergebnis

// ---- Nebel (vom Nutzer gewünscht, dicht und unheimlich): ab Jagd 1 leichter Dunst im Wald, nach Friedels Abschied dichter Nebel (Ausfahren im Dunst), auf den letzten 700 m vor dem Gasthaus reißt er auf ----
// nb 0–1: Szenen-Nebel rückt heran (Sichtweite bei 1 ≈ weit m) und färbt Himmel und Hintergrund; dazu Schwaden-Sprites, die um dich herum mitwandern (fester Vorrat, kein Objekt je Meter)
const TRI_NEBEL={jagd:.3, rampe:60, gast:700, gastNb:.08, weit:75, nah:3, abend:0xc4b2a6, nacht:0x48526a, n:60, abst:8, sicht:170, op:.42}; // gast: ab so vielen m vor dem Gasthaus reißt er auf bis gastNb (Gasthaus, Kuppe und Teufelstisch klar vor dem Nachthimmel)
function triNebel(A,K,rt){ const N=TRI_NEBEL, T=R.tri, f=scene.fog; let nb=0;
  if(K){ if(K.J[0]) nb=N.jagd*clampN((rt-K.J[0].t0)/N.rampe,0,1); nb=Math.max(nb,clampN((rt-K.heim)/N.rampe,0,1)); if(T.gast) nb=Math.min(nb,N.gastNb+(1-N.gastNb)*clampN((T.gast.d-me.d)/N.gast,0,1)); }
  A.nebelNb=nb; if(!R.fog0) return; f.near=R.fog0[0]*(N.nah/R.fog0[0])**nb; if(nb<=0) return; f.far*=(N.weit/f.far)**nb; // logarithmisch: schon bei wenig nb merklich näher
  const c=(A.nebelC||(A.nebelC=new THREE.Color())).set(N.abend).lerp(new THREE.Color(N.nacht),A.dk||0); scene.background.lerp(c,nb); f.color.copy(scene.background); sky.material.color.lerp(c,nb); } // Himmel und Nebel gleich stark gefärbt: sonst Rand um die Hügel
function buildTrifelsNebel(){ const A=anim.tri; A.schwaden=[];
  const puff=canvasTex(128,128,g=>{ for(let i=0;i<16;i++){ const x=28+Math.random()*72, y=38+Math.random()*52, r=16+Math.random()*28, gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(255,255,255,.5)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } }); // wie der Morgennebel auf Berwartstein
  for(let i=0;i<TRI_NEBEL.n;i++){ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:puff, transparent:true, opacity:0, depthWrite:false, fog:false})); sp.visible=false; world.add(sp); A.schwaden.push(sp); } }
// Schwaden: je Platz (alle abst m) einer flach über dem Weg und einer daneben (6–26 m), Lage fest aus der Platznummer, treiben langsam; blenden aus, wenn die Kamera hindurchfährt
function poseTrifelsNebel(t){ const A=anim.tri, S=A.schwaden, nb=A.nebelNb||0, N=TRI_NEBEL; if(!S) return; if(nb<.02||race.state!=='run'){ for(const s of S) s.visible=false; return; }
  const cp=camera.position, k0=Math.floor((me.d-40)/N.abst), h=(k,j)=>{ const x=Math.sin(k*12.9898+j*78.233)*43758.5453; return x-Math.floor(x); };
  S.forEach((sp,i)=>{ const k=k0+(i>>1), neben=i&1, d=k*N.abst+h(k,neben)*N.abst; if(d<0){ sp.visible=false; return; }
    const u=neben?(h(k,3)<.5?-1:1)*(6+h(k,4)*20)+Math.sin(t*.12+k)*2:(h(k,5)-.5)*6+Math.sin(t*.15+k)*1.5, p=wegPos(d,u), s=neben?18+h(k,7)*18:9+h(k,7)*8;
    sp.position.set(p.x,bodenY(p.x,p.z)+(neben?1+h(k,6)*4:.6+h(k,6)*1.4),p.z); sp.scale.set(s,s*.45,1); const dist=sp.position.distanceTo(cp);
    const op=N.op*nb*bSm((dist-s*.3)/(s*.7))*bSm((N.sicht-dist)/50); sp.material.opacity=op; sp.material.color.copy(scene.fog.color).multiplyScalar(1.3); sp.visible=op>.003; }); }
// ---- Gasthaus „Zum Teufelstisch“ am Ziel: Fachwerk, alle Fenster hell, offene Tür, Laternen am Hof, Lichtschein, Rauch, Wirt mit Laterne; Teufelstisch auf der Kuppe dahinter ----
function gastTex(w,h,front,glow){ return canvasTex(w,h,g=>{ const B='#3e2a1c', bal=(x,y,ww,hh)=>{ g.fillStyle=B; g.fillRect(x,y,ww,hh); }, fen=[]; // glow: nur die Leuchtkarte (Fenster und Tür)
  if(!glow){ g.fillStyle='#ece3cf'; g.fillRect(0,0,w,h); bal(0,0,w,9); bal(0,h/2-5,w,10); bal(0,h-9,w,9); for(let x=0;x<=w;x+=64) bal(Math.min(x,w-9),0,9,h);
    g.strokeStyle=B; g.lineWidth=8; for(let x=0;x<w;x+=128){ g.beginPath(); g.moveTo(x+4,h/2); g.lineTo(x+60,8); g.moveTo(x+124,h/2); g.lineTo(x+68,8); g.stroke(); } } // Streben im Obergeschoss
  else { g.fillStyle='#000'; g.fillRect(0,0,w,h); }
  const xs=front?[64,160,352,448]:[w*.3,w*.7]; for(const x of xs){ fen.push([x,h*.25]); fen.push([x,h*.72]); } if(front) fen.push([256,h*.25]);
  for(const [x,y] of fen){ if(glow){ const gr=g.createRadialGradient(x,y,4,x,y,34); gr.addColorStop(0,'#fff0b8'); gr.addColorStop(1,'#e8902e'); g.fillStyle=gr; g.fillRect(x-22,y-28,44,56); g.fillStyle='#000'; g.fillRect(x-2,y-28,4,56); g.fillRect(x-22,y-3,44,4); }
    else { g.fillStyle='#5a3a22'; g.fillRect(x-26,y-32,52,64); g.fillStyle='#2a2018'; g.fillRect(x-22,y-28,44,56); } }
  if(front){ if(glow){ g.fillStyle='#ffc060'; g.fillRect(232,h-96,48,87); } else { g.fillStyle='#5a3a22'; g.fillRect(226,h-104,60,95); g.fillStyle='#2a2018'; g.fillRect(232,h-96,48,87); } } }); } // offene Tür
function buildGasthaus(T){ const A=anim.tri, G=T.gast, holz=lam('#4e3626'), box=(P,w,h,d,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); P.add(b); return b; };
  const H=haus({w:13,dep:9,hgt:6.4,fw:true,wall:0,shut:0,roof:'#7c3a2c',kam:.78}), y0=roadY(G.d)+.1, mf=new THREE.MeshLambertMaterial({map:gastTex(512,256,1),emissiveMap:gastTex(512,256,1,1),emissive:0xffffff}), ms=new THREE.MeshLambertMaterial({map:gastTex(256,256,0),emissiveMap:gastTex(256,256,0,1),emissive:0xffffff});
  H.children[0].material=[ms,ms,mf.clone(),mf.clone(),mf,mf]; H.children[0].material[2].emissive.set(0); H.children[0].material[3].emissive.set(0); // Front (+z, zur Straße) und Rückseite mit vielen Fenstern, Seiten mit zwei je Stockwerk
  H.position.set(G.x,y0,G.y); H.rotation.y=Math.atan2(Math.sin(G.h),-Math.cos(G.h)); world.add(H); H.updateMatrixWorld(true); // +z schaut zum Weg
  const loc=(lx,ly,lz)=>new THREE.Vector3(lx,ly,lz).applyMatrix4(H.matrixWorld);
  // Wirtshausschild am Ausleger über der Tür
  const W=new THREE.Group(); W.position.set(4.2,3.4,4.5); H.add(W); box(W,.05,.05,1.3,lam('#2a2826'),0,0,.65);
  const t=frakturTex(256,180,g=>{ g.fillStyle='#3a1a14'; g.fillRect(0,0,256,180); g.strokeStyle='#d9a62b'; g.lineWidth=7; g.strokeRect(6,6,244,168); g.fillStyle='#e8c24a'; g.textAlign='center'; g.textBaseline='middle';
    g.font='26px '+FRAKTUR; g.fillText('Gasthaus',128,34,220); g.font='44px '+FRAKTUR; g.fillText('Zum',128,74,236); g.fillText('Teufelstisch',128,114,236); g.font='22px '+FRAKTUR; g.fillText('Speis · Trank · Nachtlager',128,154,226); }); // Name vom Nutzer
  const sm=new THREE.MeshBasicMaterial({map:t}), pl=new THREE.Mesh(new THREE.BoxGeometry(.04,.75,1.05),[sm,sm,holz,holz,holz,holz]); pl.position.set(0,-.5,.9); W.add(pl);
  // Hof: zwei Laternenpfähle am Weg, Bank, Fässer, Licht an der Tür
  const glow=lampGlowMat(), zL=G.o-(roadW(R,G.d)/2+1.1); for(const lx of [-6,6]){ box(H,.14,2.4,.14,holz,lx,1.2,zL); box(H,.3,.4,.3,glow,lx,2.5,zL); } // am Wegrand
  box(H,2.4,.12,.5,holz,-3.5,.5,5.2); for(const lx of [-5.2,-4.4]){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,.9,10),lam('#6b4a32')); f.position.set(lx,.45,5.5); H.add(f); }
  const tl=new THREE.PointLight(0xffb860,2.2,22,2); tl.position.copy(loc(0,2.4,5.6)); world.add(tl);
  // Lichtschein: großer warmer Glanz ums Haus, von Weitem in der Dunkelheit zu sehen
  const sc=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(128,128,g=>{ const gr=g.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0,'rgba(255,200,120,.9)'); gr.addColorStop(.4,'rgba(255,160,70,.35)'); gr.addColorStop(1,'rgba(255,140,60,0)'); g.fillStyle=gr; g.fillRect(0,0,128,128); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0}));
  sc.scale.set(34,22,1); sc.position.copy(loc(0,4,3)); world.add(sc);
  // Rauch aus dem Kamin
  const km=H.children[2].children[0], kp=new THREE.Vector3(); km.getWorldPosition(kp); kp.y+=1; const rt=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(200,200,205,.7)'); gr.addColorStop(1,'rgba(200,200,205,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
  const rauch=[]; for(let i=0;i<8;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:rt,transparent:true,depthWrite:false,opacity:0})); world.add(s); rauch.push(s); }
  // Wirt: Schürze, Laterne in der rechten Hand, steht vor der Tür und winkt dir mit der linken
  const wirt=trMensch({kittel:'#6b4a2e',aermel:'#ece3cf',hose:'#3a3020',haar:'#8a8a86',bart:'#8a8a86'}); box(wirt.G,.36,.7,.04,lam('#e8e0d0'),0,.95,.25); // Schürze
  const lat=new THREE.Mesh(new THREE.BoxGeometry(.16,.22,.16),glow); lat.position.y=-.78; wirt.arme[1].add(lat); wirt.arme[1].rotation.x=-.35; const wl=new THREE.PointLight(0xffc870,1.4,10,2); wl.position.y=-.78; wirt.arme[1].add(wl);
  const wp=loc(.6,0,5.6), wp0=loc(0,0,4.3); wp.y=bodenY(wp.x,wp.z); wp0.y=y0; wirt.G.position.copy(wp0); wirt.G.rotation.y=H.rotation.y; world.add(wirt.G);
  // Teufelstisch: Sandsteinsäule mit breiter Felsplatte obendrauf, hebt sich als dunkle Silhouette vom Himmel ab (ohne Szenen-Nebel, sonst verschwimmt er hell im Dunst)
  const [tx,tz]=T.tisch, F=new THREE.Group(), fm=lam('#4a2820'), fm2=lam('#3a1f19'); fm.fog=fm2.fog=false; F.position.set(tx,terrainAt(tx,tz)-2,tz); F.rotation.y=.4; world.add(F);
  [[5.2,6,4.6,0,3,0,.05],[4.4,5.5,4,.3,8.5,.2,-.08],[4.8,5,4.3,-.2,13.6,-.1,.06],[3.8,3.6,3.4,.1,17.6,.1,0]].forEach(([w,h,d,x,y,z,r],i)=>{ const b=box(F,w,h,d,i%2?fm2:fm,x,y,z); b.rotation.y=r*3; b.rotation.z=r; });
  const pt=box(F,17,2.8,10.5,fm,0,20.6,0); pt.rotation.z=.04; box(F,13,.9,8,fm2,-.4,19,.3); for(const [x,z,s] of [[6,4,2.6],[-5,-4,2],[4,-5,1.6]]){ const b=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),fm2); b.position.set(x,s*.6,z); F.add(b); } // Platte und Brocken am Fuß
  A.gast={H,sc,rauch,kp,wirt,wp,wp0,mats:[mf,ms]}; }
function poseGasthaus(dt,t){ const A=anim.tri, G=A.gast; if(!G) return; const dk=A.dk||0, nah=R.tri.gast.d-me.d;
  G.sc.material.opacity=.75*dk; for(const m of G.mats) m.emissive.setScalar(.35+.65*dk); // in der Nacht leuchtet alles kräftiger
  G.rauch.forEach((s,i)=>{ const f=((t*.16+i/8)%1); s.position.set(G.kp.x+f*2.2,G.kp.y+f*7,G.kp.z+f*1.2); s.scale.setScalar(1.2+f*3.5); s.material.opacity=.35*Math.sin(f*Math.PI)*(.3+.7*(1-dk*.5)); });
  const w=G.wirt, wink=nah<70&&nah>-15, k=bSm((300-nah)/25), geht=k>0&&k<1, hoch=k>=1&&!wink&&nah>0, ws=geht?Math.sin(t*6):0; w.G.position.copy(G.wp0).lerp(G.wp,k); w.beine[0].rotation.x=.5*ws; w.beine[1].rotation.x=-.5*ws; // tritt ab 300 m aus der Tür
  w.arme[1].rotation.x+=((hoch?-2.5:-.35)-w.arme[1].rotation.x)*Math.min(1,dt*3); // hebt die Laterne, bis er winkt
  w.arme[0].rotation.x+=((wink?-2.6:0)-w.arme[0].rotation.x)*Math.min(1,dt*4); w.arme[0].rotation.z=wink?-.35-.35*Math.sin(t*7):-.12; w.kopf.rotation.y=.12*Math.sin(t*.7); } // winkt, wenn du dich näherst (Laterne wieder unten)

// ---- Bewegung (aus poseTrifels) ----
function poseFriedel(dt,t,rt){ const A=anim.tri, F=A.friedel, T=R.tri; if(!F) return; const run=race.state==='run', lauf=run&&!race.paused?dt*simSpeed():0;
  if(run&&A.skS!==race.woSegs){ A.sk=triSkript(); A.skS=race.woSegs; } const K=run?A.sk:null, ich=riders3d[myKey], H=roadW(R,me.d)/2-.5;
  // Friedel: wartet am Wirtshaus, fährt ab Ende des Einfahrens mit, fällt in den Jagden 1–4 zurück (bei der letzten hält er den Sack bereit), am Ende kehrt er um
  const vorher=!K||rt<K.tW, szene=!!K&&rt>=K.tS&&rt<K.tW, ichM=A.ich[KST.stand==='baeuerin'?'baeuerin':'bauer'];
  F.steher.G.visible=F.rad.visible=vorher; A.ich.bauer.G.visible=A.ich.baeuerin.G.visible=false; ichM.G.visible=A.ich.rad.visible=szene; if(szene&&ich) ich.g.visible=false; // in der Szene stehst du neben deinem Rad
  if(vorher){ F.d=T.wirtD+2.4; F.r.lane=roadW(R,F.d)/2-.6; putRider(F.r,F.d,0); F.r.g.visible=false; }
  else { const jj=K.J.findIndex(j=>rt>=j.t0&&rt<j.t0+j.dur), heim=rt>=K.heim;
    let fv=6; if(heim) F.d-=6*lauf;
    else { const want=jj>=0&&jj<4?-36:-1.3, vr=clampN((want-(F.d-me.d))*.6,-2.6,1.6); fv=Math.max(0,me.v+vr); F.d+=fv*lauf; }
    F.crank+=fv>.3?75/60*2*Math.PI*lauf:0; // immer 75 U/min, egal wie schnell – im Stand stehen die Kurbeln
    const ml=ich&&ich.lane!=null?ich.lane:0, u=heim?-H:(ml-1.25<-H?ml+1.25:ml-1.25); F.r.lane=F.r.lane==null?u:F.r.lane+(u-F.r.lane)*Math.min(1,dt*2);
    putRider(F.r,F.d,F.crank); if(heim) F.r.g.rotation.y+=Math.PI; F.r.g.visible=!(heim&&F.d<me.d-150); }
  // Elwetritsche: taucht mit jeder Jagd 34 m vor dir auf, rennt im Zickzack davon, du holst auf; kurz vor Schluss schlägt sie einen Haken ins Gebüsch – bei der letzten springt sie in Friedels Sack
  const E=A.elw; let ev=false; if(K){ const k=K.J.findIndex(j=>rt>=j.t0&&rt<j.t0+j.dur+1), j=K.J[k];
    if(j){ const tau=rt-j.t0, s=k%2?1:-1, letzt=k===K.J.length-1, gap=34-30*clampN(tau/25,0,1), haken=bSm((tau-25)/2.5); let d=me.d+gap, u=.9*Math.sin(tau*1.7), y=0;
      if(letzt&&tau>23){ const w=bSm((tau-23)/2.5), sp=new THREE.Vector3(); F.sack.getWorldPosition(sp); const [x0,z0]=(()=>{ const p=wegPos(d,u); return [p.x,p.z]; })(); E.G.position.set(x0+(sp.x-x0)*w, roadY(d)+(sp.y-roadY(d))*w*.8+Math.sin(w*Math.PI)*1.2, z0+(sp.z-z0)*w); ev=tau<25.6; }
      else { u+=(s*(roadW(R,d)/2+4)-u)*haken; const p=wegPos(d,u); y=bodenY(p.x,p.z)+Math.abs(Math.sin(tau*9))*.22; E.G.position.set(p.x,y,p.z); ev=tau<27.6; }
      const hd=headingAt(R,d); E.G.rotation.y=-hd+Math.PI/2-s*haken*1.2; // läuft in Fahrtrichtung, beim Haken zur Seite
      const blick=(tau%8>5.5)&&tau<24&&k>0; E.kopf.rotation.y=blick?Math.PI*.85:0; E.zunge.visible=blick&&k>=1; // schaut frech zurück, ab Jagd 2 mit Zunge
      E.beine[0].rotation.x=.7*Math.sin(tau*18); E.beine[1].rotation.x=-.7*Math.sin(tau*18); E.fluegel.forEach((w,i)=>w.rotation.z=(i?-1:1)*(.3+.5*Math.abs(Math.sin(tau*14)))); E.augen.forEach((a,i)=>a.rotation.z=.25*Math.sin(t*11+i)); E.K.rotation.z=.12*Math.sin(tau*9); } }
  E.G.visible=ev;
  // Sack: nach dem Fang dick, zappelt alle 13–17 s heftig (2,6 s, abwechselnd schaut Schnabel oder Augenstiel raus), Friedel schlingert und dreht sich nach dem Sack um
  const tF=K&&K.J.length?K.J[K.J.length-1].t0+25.6:1e9, voll=rt>tF, x=rt-tF-4, n=Math.floor(x/13), lok=x-n*13-n*5%4, anf=voll&&x>0&&lok>0&&lok<2.6?Math.sin(Math.PI*lok/2.6):0, z=.04+.16*anf;
  F.sack.scale.set(voll?1.35+z*Math.sin(t*13):.9, voll?1.45+z*.8*Math.sin(t*17):1.1, voll?1.2+z*Math.sin(t*11+1):.8); F.sack.rotation.z=voll?(.05+.3*anf)*Math.sin(t*9):0; F.sack.position.x=-.32+.05*anf*Math.sin(t*15);
  F.raus.schn.visible=anf>.4&&n%2===0; F.raus.aug.visible=anf>.4&&n%2===1; F.raus.G.rotation.z=.35*Math.sin(t*12); F.raus.G.position.y=1.32+.08*anf;
  F.r.wank=.12*anf*Math.sin(t*6.5); F.r.lenk=.08*anf*Math.sin(t*4.7+1); F.r.headG.rotation.y=1.1*anf;
  // Zwischenszene am Wirtshaus: zwei feste Kamera-Einstellungen auf der Fahrbahn, nicht in den Häusern daneben (Gruppe, dann näher auf Friedel und dich), Handschlag zur Wette, das Dorfweib lacht, Krüge hoch, Friedel dreht sich zu dir
  if(szene){ const dw=T.wirtD, rw=roadW(R,dw)/2, k=bSm((rt-K.tS-17)/2), at=(d,u,y)=>{ const p=wegPos(d,u); return [p.x,roadY(d)+y,p.z]; }, mix=(a,b)=>a.map((v,i)=>v+(b[i]-v)*k);
    const uF=A.uF; camOverride={pos:mix(at(dw-10,-rw+.5,2.6),at(dw+5.5,-rw+.5,1.9)), look:mix(at(dw,uF-1,1.3),at(dw-.4,uF-1.4,1.4))}; A.camAn=true; }
  else if(A.camAn){ if(!A.aud) camOverride=null; A.camAn=false; camS.init=false; }
  const akt=K?K.L.filter(s=>rt>=s.t0&&rt<s.t1):[], el=document.getElementById('triSag'); let unten=''; const sp=w=>akt.some(x=>x.wer===w), zs=K?rt-K.tS:-1;
  { const D=A.dorf.dorfmann, W=A.dorf.dorfweib, hand=zs>=1&&zs<11, lacht=sp('dorfweib'), fm=F.steher, k5=Math.min(1,dt*5);
    // Leben in der Gruppe: jeder verlagert das Gewicht in eigenem Takt, dreht sich halb zum Sprecher und schaut ihn an, sonst blickt er umher
    const spr=akt.find(x=>x.wer==='friedel'||A.dorf[x.wer]), sP=spr?(spr.wer==='friedel'?fm.G.position:A.dorf[spr.wer].m.G.position):fm.G.position;
    const leben=(m,i,dreh)=>{ const u=m.G.userData; if(u.ry0==null){ u.ry0=m.G.rotation.y; u.ph=i*1.9+.5; } const ph=u.ph, w=Math.sin(t*(.45+i*.07)+ph), mp=m.G.position;
      m.G.rotation.z=.035*w; m.beine[0].rotation.x=.07*w; m.beine[1].rotation.x=-.07*w;
      const selbst=sP===mp, a=Math.atan2(sP.x-mp.x,sP.z-mp.z); if(dreh) m.G.rotation.y+=angDiff(u.ry0+.45*angDiff(a,u.ry0),m.G.rotation.y)*Math.min(1,dt*1.5);
      const ky=selbst?.3*Math.sin(t*.7+ph):clampN(angDiff(a,m.G.rotation.y),-1,1)+.15*Math.sin(t*.4+ph*2); m.kopf.rotation.y+=(ky-m.kopf.rotation.y)*Math.min(1,dt*(1.5+i*.4)); m.kopf.rotation.x=.05*Math.sin(t*1.1+ph); };
    A.dorfAlle.forEach((m,i)=>leben(m,i,true)); leben(fm,4,false); if(szene) leben(ichM,5,false);
    const trinkt=(i,per)=>((t+i*3.1)%per)<1.7; // Krug an den Mund, Kopf in den Nacken
    if(D){ const tr=!hand&&!sp('dorfmann')&&trinkt(0,9); D.m.arme[0].rotation.x+=((hand?-1.3:sp('dorfmann')?-.7+.45*Math.sin(t*4.2):-.15)-D.m.arme[0].rotation.x)*k5; // redet mit der Hand
      D.m.arme[1].rotation.x+=((tr?-2.7:-.9)-D.m.arme[1].rotation.x)*Math.min(1,dt*4); if(tr) D.m.kopf.rotation.x=-.35; D.m.G.rotation.x=sp('dorfmann')?.08:0; } // beugt sich beim Wetten vor
    if(W){ W.m.G.rotation.z+=lacht?.07*Math.sin(t*16):0; W.m.G.rotation.x=lacht?.14+.08*Math.sin(t*7):0; W.m.arme[0].rotation.x=W.m.arme[1].rotation.x=lacht?-.5-.2*Math.sin(t*12):-.9+.08*Math.sin(t*.8); } // biegt sich vor Lachen
    A.dorfAlle.forEach((m,i)=>{ if(D&&m===D.m||W&&m===W.m) return; const tr=!lacht&&trinkt(i,7+i*2.5); m.arme[1].rotation.x+=((lacht?-2.4:tr?-2.7:-.9)-m.arme[1].rotation.x)*Math.min(1,dt*4); if(tr) m.kopf.rotation.x=-.35; // Krüge hoch beim Lachen, sonst trinken sie ab und zu
      if(lacht&&i===3) m.G.rotation.z+=.05*Math.sin(t*14); // lacht mit
      const kr=i===2&&((t+4)%11)<1.3; m.arme[0].rotation.x+=((kr?-2.9:-.1+.06*Math.sin(t*.9+i))-m.arme[0].rotation.x)*Math.min(1,dt*4); if(kr) m.arme[0].rotation.z=-.5; else m.arme[0].rotation.z=-.12; }); // kratzt sich am Kopf
    // Friedel: Handschlag zur Wette, redet mit der freien Hand, zeigt auf dich, wenn er um Hilfe bittet; du nickst zum Schluss
    const ziel=zs>=19?ichM.G.position:D?D.m.G.position:null; fm.arme[1].rotation.x+=((zs>=7&&zs<11?-1.3:0)-fm.arme[1].rotation.x)*k5; // Handschlag
    fm.arme[0].rotation.x+=((sp('friedel')?(zs>=19&&zs<23?-1.45:-.6+.4*Math.sin(t*3.6)):0)-fm.arme[0].rotation.x)*k5;
    if(ziel){ const a=Math.atan2(ziel.x-fm.G.position.x,ziel.z-fm.G.position.z); fm.G.rotation.y+=angDiff(a,fm.G.rotation.y)*Math.min(1,dt*3); }
    if(szene){ const fp=fm.G.position; ichM.G.rotation.y=Math.atan2(fp.x-ichM.G.position.x,fp.z-ichM.G.position.z); if(zs>=27) ichM.kopf.rotation.x=.18*Math.max(0,Math.sin((zs-27)*5)); } }
  for(const w of ['dorfmann','dorfweib']){ const D=A.dorf[w]; if(!D) continue; const s=akt.find(x=>x.wer===w); D.blase.visible=!!s; if(s){ triBlaseText(D.blase,kText(s.txt)); const k=D.m.G.position.clone(); k.y+=2.4; triBlaseUeber(D.blase,k,null); } }
  { const s=akt.find(x=>x.wer==='friedel'), B=F.blase, wo=vorher?F.steher.G:F.r.g; let im=false; const p=wo.position.clone(); p.y+=2.9; if(s&&wo.visible){ const q=p.clone().project(camera); im=q.z<1&&Math.abs(q.x)<.9&&Math.abs(q.y)<.9&&camera.position.distanceTo(p)<45; }
    B.visible=!!s&&im; if(B.visible){ triBlaseText(B,kText(s.txt)); triBlaseUeber(B,p,vorher?null:ich&&ich.g); } if(s&&!im) unten='Friedel: '+kText(s.txt); }
  if(el){ if(unten){ el.textContent=unten; el.classList.add('zeig'); } else el.classList.remove('zeig'); } }
