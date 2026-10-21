/* ================= Trifels: Welt für Kampagnen-Mission 1 ================= */
// Burg Trifels (Vorlage: Rekonstruktion um 1280, Bilder in vorlagen/trifels/) auf einem Sandstein-Felsrücken über der Vorburg, Vorburg mit Hütten um den Platz des Goldkarrens,
// Wirtshaus im Tal, Laternen am Weg. Strecke und Meter: trifelsDef (strecke.js), R.def.orte. Konzept: KAMPAGNE.md
//   prepTrifels aus buildRoute (Plätze freiräumen) · trifelsGelaende aus build3D (ebene Vorburg, Burgberg) · buildTrifels aus build3D

// ---- Vorbereitung (beim Streckenbau): Vorburg und Burgfelsen frei von Bäumen, Häuser am Wirtshaus mittelalterlich, Wirtshaus wählen ----
function prepTrifels(r){ const O=r.def.orte, S=r.S, q=rng(77), kf=r.kf, [kx,ky]=O.karren, [bx,by]=O.burg, rh=(O.hof[1]-O.hof[0])*kf/Math.PI;
  r.tri={karren:O.karren, burg:O.burg, rh, hof:O.hof.map(d=>d*kf), wirtD:O.wirtshaus*kf, jagd:O.jagd.map(d=>d*kf), loewenherz:O.loewenherz*kf};
  const frei=[[kx,ky,rh+26]]; for(let k=-4;k<=4;k++) frei.push([bx+k*14,by,30]); // Vorburg-Platz, Burgberg
  for(const k of ['tree','rock','bush','block','konif','grass']) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m));
  for(const h of S.house){ h.fw=q()<.75; h.gw=false; h.pv=false; if(h.roof==='#6f6f70'||q()<.4) h.roof=q()<.6?'#9e3a28':'#a8925c'; } // Fachwerk, Ziegel oder Stroh, keine Solardächer
  r.tri.wirt=S.house.filter(h=>h.side===1&&!h.gs).sort((a,b)=>Math.abs(a.d-r.tri.wirtD)-Math.abs(b.d-r.tri.wirtD))[0]||null; } // Haus rechts, das dem Wirtshaus-Meter am nächsten steht

// ---- Gelände (aus build3D, vor dem Gelände-Mesh): Vorburg eben (nur absenken, damit nichts durch die Straße sticht), Burgberg unter dem Felsen ----
function trifelsGelaende(h){ const T=R.tri, n=TER.nx, res=TER.res, [kx,ky]=T.karren, [bx,by]=T.burg, hy=roadY((T.hof[0]+T.hof[1])/2)-.45, rp=T.rh+14; T.hofY=hy+.45;
  for(let k=0;k<h.length;k++){ const x=(k%n)*res+TER.x0, z=((k/n)|0)*res+TER.z0, dk=Math.hypot(x-kx,z-ky);
    if(dk<rp+30&&h[k]>hy) h[k]+=(hy-h[k])*bSm((rp+30-dk)/30);
    const e=Math.hypot((x-bx)/50,(z-by)/20); if(e<2.2){ const top=hy+8*bSm((2.2-e)/1.3); if(top>h[k]) h[k]=top; } } }

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

  // ---------- Vorburg: Holzhütten und Schuppen außen um die Kehre, Platz in der Mitte frei für den Goldkarren ----------
  const V=new THREE.Group(); V.position.set(kx,hy,ky); world.add(V);
  const bretter=new THREE.MeshLambertMaterial({map:canvasTex(64,64,g=>{ for(let x=0;x<64;x+=8){ const v=.8+Math.random()*.3; g.fillStyle=`rgb(${118*v|0},${84*v|0},${54*v|0})`; g.fillRect(x,0,8,64); g.fillStyle='rgba(30,18,10,.55)'; g.fillRect(x+7,0,1,64); } })});
  const huette=(a,o,w,d,hg)=>{ const x=Math.cos(a)*o, z=Math.sin(a)*o, H=new THREE.Group(); H.position.set(x,0,z); H.rotation.y=-a+Math.PI/2; V.add(H);
    box(H,w,hg,d,bretter,0,hg/2,0); const rf=new THREE.Mesh(gableGeo(w+.8,d+.8,1.8),q()<.5?ziegel:lam('#a8925c')); rf.position.y=hg; H.add(rf); box(H,1,1.9,.08,dunkel,0,.95,d/2+.02); };
  for(let i=0;i<7;i++){ const a=-Math.PI*.15-i*Math.PI*.12+(q()-.5)*.08; huette(a,T.rh+10+q()*4,4+q()*2.5,3.5+q(),2.6+q()*.6); } // Nordseite, unterhalb der Burg
  for(let i=0;i<6;i++){ const a=(q()-.5)*1.2, r=4+q()*9, k=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.9),holz); k.position.set(Math.cos(a)*r*1.1+6,.45,Math.sin(a)*r*.6); k.rotation.y=q()*3; V.add(k); } // Kisten
  for(let i=0;i<3;i++){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,1,10),holzD); f.position.set(-6+i*1.1,.5,-5); V.add(f); } // Fässer
  for(let i=0;i<4;i++){ const hb=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,1.3,10),lam('#c9a85a')); hb.rotation.z=Math.PI/2; hb.position.set(-8+i*1.8,.8,4); V.add(hb); } // Heuballen

  // ---------- Wirtshaus im Tal: Ausleger mit Schild am Haus rechts ----------
  { const H=T.wirt; if(H){ const tx=Math.cos(H.h), tz=Math.sin(H.h), nx=-Math.sin(H.h)*H.side, nz=Math.cos(H.h)*H.side, a=H.dep/2, b=-(H.w/2-.9), eis=lam('#2a2826');
      const W=new THREE.Group(); W.position.set(H.x-nx*a+tx*b, roadY(H.d)+.15+3.3, H.y-nz*a+tz*b); W.rotation.y=Math.atan2(nz,-nx); world.add(W); // lokal: +x von der Wand zur Straße
      box(W,1.3,.05,.05,eis,.65,0,0); const t=frakturTex(256,180,g=>{ g.fillStyle='#5a2a1c'; g.fillRect(0,0,256,180); g.strokeStyle='#d9a62b'; g.lineWidth=7; g.strokeRect(6,6,244,168); g.fillStyle='#e8c24a'; g.textAlign='center'; g.textBaseline='middle';
        g.font='54px '+FRAKTUR; g.fillText('Wirtshaus',128,74,232); g.font='26px '+FRAKTUR; g.fillText('Wein · Bier · Speis',128,138,220); }); // Name noch offen (KAMPAGNE.md)
      const pl=new THREE.Mesh(new THREE.BoxGeometry(1,.7,.04),[holzD,holzD,holzD,holzD,new THREE.MeshLambertMaterial({map:t}),new THREE.MeshLambertMaterial({map:t})]); pl.position.set(.85,-.45,0); W.add(pl); } }

  // ---------- Laternen am Weg: Holzpfahl mit Laterne, leuchten in der Dämmerung (am Wirtshaus und im Tal) ----------
  { const glow=lampGlowMat(), L=[]; for(let d=T.wirtD-60; d<R.len-80; d+=d<T.wirtD+200?30:140){ const [x,z]=posAt(R,d), hd=headingAt(R,d), s=(L.length%2?1:-1), o=roadW(R,d)/2+1.3; L.push({x:x-Math.sin(hd)*s*o, z:z+Math.cos(hd)*s*o, y:roadY(d)}); }
    for(const p of L){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,2.2,5),holzD); st.position.set(p.x,p.y+1.1,p.z); world.add(st); const la=new THREE.Mesh(new THREE.BoxGeometry(.28,.38,.28),glow); la.position.set(p.x,p.y+2.35,p.z); world.add(la); } }
}
