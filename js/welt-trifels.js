/* ================= Trifels: Welt für Kampagnen-Mission 1 ================= */
// Burg Trifels (Vorlage: Rekonstruktion um 1280, Bilder in vorlagen/trifels/) auf einem Sandstein-Felsrücken über der Vorburg, Vorburg mit Hütten um den Platz des Goldkarrens,
// Wirtshaus im Tal, Laternen am Weg. Strecke und Meter: trifelsDef (strecke.js), R.def.orte. Konzept: KAMPAGNE.md
//   prepTrifels aus buildRoute (Plätze freiräumen) · trifelsGelaende aus build3D (ebene Vorburg, Burgberg) · buildTrifels aus build3D · poseTrifels aus draw (rennen.js)

// ---- Vorbereitung (beim Streckenbau): Vorburg und Burgfelsen frei von Bäumen, Häuser am Wirtshaus mittelalterlich, Wirtshaus wählen ----
function prepTrifels(r){ const O=r.def.orte, S=r.S, q=rng(77), kf=r.kf, [kx,ky]=O.karren, [bx,by]=O.burg, rh=(O.hof[1]-O.hof[0])*kf/Math.PI;
  r.tri={karren:O.karren, burg:O.burg, rh, hof:O.hof.map(d=>d*kf), wirtD:O.wirtshaus*kf, jagd:O.jagd.map(d=>d*kf), loewenherz:O.loewenherz*kf};
  const frei=[[kx,ky,rh+26]]; for(let k=-4;k<=4;k++) frei.push([bx+k*14,by,30]); // Vorburg-Platz, Burgberg
  // Dichter Pfälzerwald: zusätzliche Kiefern, Buchen und Unterholz im Wald, nie auf dem Weg oder auf benachbarten Kehren
  { const C=8, gr=new Map(), key=(x,y)=>Math.floor(x/C)+','+Math.floor(y/C); for(let i=0;i<r.xs.length;i+=2){ const k=key(r.xs[i],r.ys[i]); (gr.get(k)||gr.set(k,[]).get(k)).push(i); }
    const amWeg=(x,y,m)=>{ const cx=Math.floor(x/C), cy=Math.floor(y/C), w=Math.ceil(m/C); for(let a=-w;a<=w;a++) for(let b=-w;b<=w;b++){ const l=gr.get((cx+a)+','+(cy+b)); if(l) for(const i of l) if(Math.hypot(r.xs[i]-x,r.ys[i]-y)<m) return true; } return false; };
    for(let d=0;d<r.len;d+=9){ if(zoneAt(r,d)!=='wald') continue; const [px,py]=posAt(r,d), hd=headingAt(r,d), nx=-Math.sin(hd), ny=Math.cos(hd);
      for(const sd of [-1,1]) for(let t=0;t<2;t++){ const o=sd*(4+q()*72), al=(q()-.5)*7, x=px+nx*o+Math.cos(hd)*al, y=py+ny*o+Math.sin(hd)*al, rad=2+q()*3, busch=q()<.35;
        if(amWeg(x,y,(busch?1.5:rad)+3.2)) continue; if(busch) S.bush.push({x,y,s:.6+q()*.9,c:q()}); else S.tree.push({x,y,s:rad,c:q(),pine:q()<.55,ht:9+q()*8}); } } }
  for(const k of ['tree','rock','bush','block','konif','grass']) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m));
  for(const h of S.house){ h.fw=q()<.75; h.gw=false; h.pv=false; if(h.roof==='#6f6f70'||q()<.4) h.roof=q()<.6?'#9e3a28':'#a8925c'; } // Fachwerk, Ziegel oder Stroh, keine Solardächer
  r.tri.wirt=S.house.filter(h=>h.side===1&&!h.gs).sort((a,b)=>Math.abs(a.d-r.tri.wirtD)-Math.abs(b.d-r.tri.wirtD))[0]||null; } // Haus rechts, das dem Wirtshaus-Meter am nächsten steht

// ---- Gelände (aus build3D, vor dem Gelände-Mesh): Vorburg eben (nur absenken, damit nichts durch die Straße sticht), Burgberg unter dem Felsen ----
function trifelsGelaende(h,src,dist){ const T=R.tri, n=TER.nx, res=TER.res, [kx,ky]=T.karren, [bx,by]=T.burg, hy=roadY((T.hof[0]+T.hof[1])/2)-.45, rp=T.rh+14; T.hofY=hy+.45;
  for(let k=0;k<h.length;k++){ const x=(k%n)*res+TER.x0, z=((k/n)|0)*res+TER.z0, dk=Math.hypot(x-kx,z-ky);
    if(dk<rp+30) h[k]+=(hy-h[k])*bSm((rp+30-dk)/30); // eben (auch anheben, sonst schwebt der Kram am Rand)
    const e=Math.hypot((x-bx)/50,(z-by)/20); if(e<2.2){ const top=hy+8*bSm((2.2-e)/1.3); if(top>h[k]) h[k]=top; } }
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
    const rl=Math.min(roadY(src[k]*STEP),dist[k]<14?tiefst((k%n)*res+TER.x0,((k/n)|0)*res+TER.z0):1e9)-STR_UNTER; h[k]=dist[k]<12?rl:Math.min(rl+(h[k]-rl)*bSm((dist[k]-12)/12), rl+Math.max(0,dist[k]-16)*.15); } } // neben der Straße nur sanft ansteigen (grobes Raster)

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
  for(const f of [-.06,-.15,-.62,-.71,-.8,-.89]){ const a=Math.PI*f+(q()-.5)*.06; huette(a,T.rh+10+q()*4,4+q()*2.5,3.5+q(),2.6+q()*.6); } // Nordseite unterhalb der Burg, Lücke für den Burgweg
  for(let i=0;i<6;i++){ const a=(q()-.5)*1.2, r=4+q()*9, k=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.9),holz); k.position.set(Math.cos(a)*r*1.1+6,.45,Math.sin(a)*r*.6); k.rotation.y=q()*3; V.add(k); } // Kisten
  for(let i=0;i<3;i++){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,1,10),holzD); f.position.set(-6+i*1.1,.5,-5); V.add(f); } // Fässer
  for(let i=0;i<4;i++){ const hb=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,1.3,10),lam('#c9a85a')); hb.rotation.z=Math.PI/2; hb.position.set(-8+i*1.8,.8,4); V.add(hb); } // Heuballen

  V.updateMatrixWorld(true); const wp=new THREE.Vector3(); for(const o of V.children){ o.getWorldPosition(wp); o.position.y+=terrainAt(wp.x,wp.z)-hy; } // jedes Stück auf den Boden

  // ---------- Wirtshaus im Tal: Ausleger mit Schild am Haus rechts ----------
  { const H=T.wirt; if(H){ const tx=Math.cos(H.h), tz=Math.sin(H.h), nx=-Math.sin(H.h)*H.side, nz=Math.cos(H.h)*H.side, a=H.dep/2, b=-(H.w/2-.9), eis=lam('#2a2826');
      const W=new THREE.Group(); W.position.set(H.x-nx*a+tx*b, roadY(H.d)+.15+3.3, H.y-nz*a+tz*b); W.rotation.y=Math.atan2(nz,-nx); world.add(W); // lokal: +x von der Wand zur Straße
      box(W,1.3,.05,.05,eis,.65,0,0); const t=frakturTex(256,180,g=>{ g.fillStyle='#5a2a1c'; g.fillRect(0,0,256,180); g.strokeStyle='#d9a62b'; g.lineWidth=7; g.strokeRect(6,6,244,168); g.fillStyle='#e8c24a'; g.textAlign='center'; g.textBaseline='middle';
        g.font='26px '+FRAKTUR; g.fillText('Wirtshaus',128,36,220); g.font='60px '+FRAKTUR; g.fillText('Zack Zack',128,94,236); g.font='24px '+FRAKTUR; g.fillText('Wein · Bier · Speis',128,148,220); }); // Name vom Nutzer
      const pl=new THREE.Mesh(new THREE.BoxGeometry(1,.7,.04),[holzD,holzD,holzD,holzD,new THREE.MeshLambertMaterial({map:t}),new THREE.MeshLambertMaterial({map:t})]); pl.position.set(.85,-.45,0); W.add(pl); } }

  // ---------- Laternen am Weg: Holzpfahl mit Laterne, leuchten in der Dämmerung (am Wirtshaus und im Tal) ----------
  { const glow=lampGlowMat(), L=[]; for(let d=T.wirtD-60; d<R.len-80; d+=d<T.wirtD+200?30:140){ const [x,z]=posAt(R,d), hd=headingAt(R,d), s=(L.length%2?1:-1), o=roadW(R,d)/2+1.3; L.push({x:x-Math.sin(hd)*s*o, z:z+Math.cos(hd)*s*o, y:roadY(d)}); }
    for(const p of L){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,2.2,5),holzD); st.position.set(p.x,p.y+1.1,p.z); world.add(st); const la=new THREE.Mesh(new THREE.BoxGeometry(.28,.38,.28),glow); la.position.set(p.x,p.y+2.35,p.z); world.add(la); } }
  buildTrifelsLeute(T,hy); // Goldkarren, Wachen, Burgherr, Löwenherz mit Gefolge
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
  // Burgherr: langes Gewand, pelzbesetzter Mantel, steht am Karren und blickt zur Straße
  const W0=T.weg[3], bd=(T.hof[0]+T.hof[1])/2-7, bp=wegPos(bd,-(roadW(R,bd)/2+1.6)), bv=wegPos(bd-14,0), bh=trMensch({lang:'#3a4f8a',mantel:'#6a1f2a',bart:'#5a4632',haar:'#5a4632'}); bh.G.position.set(bp.x,terrainAt(bp.x,bp.z),bp.z); bh.G.rotation.y=Math.atan2(bv.x-bp.x,bv.z-bp.z); world.add(bh.G); // links am Scheitel der Kehre, kurz vor der Abzweigung des Burgwegs, blickt dir entgegen
  for(const da of [-1.5,1.5]){ const w=trMensch({kittel:'#c8302a',aermel:'#e9b22e',hose:'#2f4a35'}), hb=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),lam('#8a8d93')); hb.position.set(0,.12,-.045); w.kopf.add(hb); speer(w);
    const p=wegPos(bd+da,-(roadW(R,bd)/2+1.9)); w.G.position.set(p.x,terrainAt(p.x,p.z),p.z); w.G.rotation.y=bh.G.rotation.y; world.add(w.G); } // zwei Wachen neben ihm
  const bl=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex(kText(TRI_RUF_TXT)),transparent:true,depthWrite:false})); bl.scale.set(11,3.4,1); bl.position.set(bp.x,bh.G.position.y+3.7,bp.z); // groß, gut lesbar beim Vorbeifahren bl.visible=false; world.add(bl);
  A.burgherr={m:bh,blase:bl};
  for(const [dx,dz,ry] of [[-5.5,-1,.4],[-5.8,.2,-.3]]){ const t=truhe(world,W0.x+dx,0,W0.z+dz,ry); t.position.y=terrainAt(t.position.x,t.position.z); } // zwei abgeladene Truhen dort const pz=new THREE.Mesh(new THREE.TorusGeometry(.25,.06,6,14),lam('#e8e0d0')); pz.rotation.x=Math.PI/2; pz.position.y=1.5; bh.G.add(pz);
  // Löwenherz mit Gefolge: Richard vorn, Bannerträger mit der Löwenfahne, drei Ritter mit eigenen Wappen
  const L=[[0,{rock:0,kette:1,krone:1,bart:'#8a7a68'},0,'#c8202a'],[1,{rock:0,kette:1},0,null],[2,{rock:1,kette:1},1,null],[3,{rock:2,kette:1},2,null],[4,{rock:3,kette:1},3,null]];
  for(const [i,mo,sk,fb] of L){ const p=trPferd({fell:i%2?'#2a201a':'#3a2a22',schabracke:sk,federbusch:fb||(i===0?null:'#efeae0')}), m=trMensch(mo); trReiter(p,m); world.add(p.G);
    if(i===1){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,3.6,6),holz); st.position.set(.25,1.5,.1); m.G.add(st); const f=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.8),new THREE.MeshLambertMaterial({map:canvasTex(160,116,g=>wappenMal(g,160,116,0)),side:THREE.DoubleSide})); f.position.set(.25,2.9,-.55); f.rotation.y=Math.PI/2; m.G.add(f); A.fahne=f; }
    A.reiter.push({p,m,ab:i*5.5,u:(i%2?.15:-.15),ph:i*1.3}); }
  const ru=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex(kText(TRI_BEISEITE)),transparent:true,depthWrite:false})); ru.scale.set(7.4,2.3,1); ru.visible=false; world.add(ru); A.ruf=ru; buildFriedel(T); } // Kolonne: alle 5,5 m einer, mitten auf dem Weg · Ruf des Bannerträgers

// ---- Bewegung (jeden Frame): Gefolge reitet dir auf dem Anstieg entgegen und vorbei, Träger, Pferde nicken ----
const TRI_V=3.2; // Trab der Reiter, m/s
function poseTrifels(dt){ const A=anim.tri, T=R.tri; if(!A||!T) return; const t=performance.now()/1000, rt=race.state==='run'?race.t:0;
  // Begegnung bei T.loewenherz (Workout-Zeit 75 s): vorher kommen sie von der Vorburg herab, warten oben bis zum Start
  const d0=Math.min(T.hof[0]-8, T.loewenherz+TRI_V*(75-rt)), lauf=race.state==='run'&&!race.paused&&d0<T.hof[0]-8;
  for(const r of A.reiter){ const d=d0+r.ab, vis=d>-30&&d<T.hof[1]; r.p.G.visible=vis; if(!vis) continue; const P=wegPos(d,r.u), y=roadY(d);
    r.p.G.position.set(P.x,y,P.z); r.p.G.rotation.set(0,-P.h-Math.PI/2,0); // lokal +z gegen die Fahrtrichtung: reitet bergab
    if(lauf) r.ph+=dt*TRI_V*2.6*simSpeed(); const s=Math.sin(r.ph), a=lauf?1:0; r.p.beine.forEach((b,i)=>b.rotation.x=.55*a*(i===0||i===3?s:-s)); r.p.hals.rotation.x=.08*a*Math.sin(r.ph*2)+.03*Math.sin(t*.9+r.ab);
    r.m.G.position.y=1.1+.05*a*Math.abs(Math.sin(r.ph)); }
  A.d0=d0; // für triSpur
  poseFriedel(dt,t,rt);
  if(A.ruf){ const g=d0-me.d, an=race.state==='run'&&g<48&&g>2, b=A.reiter[1].p.G.position; A.ruf.visible=an; if(an){ A.ruf.position.set(b.x,b.y+5.2,b.z); const tx=kText(TRI_BEISEITE); if(A.rufTx!==tx){ A.rufTx=tx; A.ruf.material.map=blaseTex(tx); A.ruf.material.needsUpdate=true; } } }
  if(A.fahne) A.fahne.rotation.x=.12*Math.sin(t*2.3);
  // Burgherr: hebt die Hand und spricht dich an, kurz bevor die Audienz-Tafel kommt
  const B=A.burgherr; if(B){ const an=race.state==='run'&&rt>=TRI_RUF[0]&&rt<TRI_RUF[1]; B.blase.visible=an; if(an){ const tx=kText(TRI_RUF_TXT); if(B.txt!==tx){ B.txt=tx; B.blase.material.map=blaseTex(tx); B.blase.material.needsUpdate=true; } } B.m.arme[1].rotation.x+=((an?-2.4:0)-B.m.arme[1].rotation.x)*Math.min(1,dt*4); B.m.kopf.rotation.y=.15*Math.sin(t*.6); }
  // Goldkarren: wartet an der Abzweigung, ab 5 s vor der Vorburg (Workout-Zeit) im Schritt den Burgweg hinauf, fährt durchs Tor und verschwindet
  const C=A.karren; if(C&&T.weg){ const W=T.weg, L=T.wegL, s=Math.min(L+4, 6+Math.max(0,rt-(TRIFELS_T.rauf-5))*KARREN_TRI), lauf=race.state==='run'&&!race.paused&&s>6&&s<L+4;
    C.K.visible=s<L+3.5; let i=1; while(i<W.length-1&&W[i].L<s) i++; const a=W[i-1], b=W[i], f=Math.min(1,Math.max(0,(s-a.L)/Math.max(.01,b.L-a.L))), y=a.y+(b.y-a.y)*f-.17;
    C.K.position.set(a.x+(b.x-a.x)*f, y, a.z+(b.z-a.z)*f); C.K.rotation.set(-Math.atan((b.y-a.y)/Math.max(.01,b.L-a.L)), Math.atan2(b.x-a.x,b.z-a.z), 0);
    if(lauf) C.ph+=dt*KARREN_TRI*3*simSpeed(); const sn=Math.sin(C.ph), am=lauf?1:0; for(const rr of C.raeder) rr.rotation.x=-(s/.55);
    A.kpferd.beine.forEach((bb,k)=>bb.rotation.x=.4*am*(k===0||k===3?sn:-sn)); A.kpferd.hals.rotation.x=.06*Math.sin(lauf?C.ph*2:t*.7);
    for(const w of C.wachen){ w.beine[0].rotation.x=.45*am*sn; w.beine[1].rotation.x=-.45*am*sn; } } }
const KARREN_TRI=1.2; // Schritt des Goldkarrens, m/s
const TRI_BEISEITE='Beiseite mit Euch, [Bauer|Bäuerin]! Platz für den König von England!';
// Spur (aus rennen.js): vor dem Gefolge in der Mitte, ab 28 m an den rechten Rand ausweichen, bis der Letzte vorbei ist
function triSpur(d,t){ const A=anim.tri; if(!A||A.d0==null||race.state!=='run') return t; const g=A.d0-d, L=A.reiter.length?A.reiter[A.reiter.length-1].ab:0; if(g>70||g+L<-6) return t;
  const H=roadW(R,d)/2-.55, mitte=bSm((70-g)/15), rechts=bSm((32-g)/6)*bSm((g+L+6)/5); return t+(0-t)*mitte*(1-rechts)+(H-t)*rechts; }
const TRI_RUF=[TRIFELS_T.rauf+2, TRIFELS_T.rauf+12], TRI_RUF_TXT='Halt! Ihr seid doch [der Bursche, der|die Magd, die] sich für das Gold meldet?'; // Workout-Zeit (s): Burgherr ruft dich an; danach Audienz-Tafel (at in kampagne.js)
// Kamera (aus draw): schaut kurz zum Burgherrn, während er dich anspricht (wie beim Zöllner)
function trifelsKamera(dt){ const A=anim.tri, B=A&&A.burgherr, ich=riders3d[myKey]; if(!B||!ich||race.state!=='run') return; const rt=race.t, D=A.dorf&&A.dorf.dorfmann, tW=A.sk?A.sk.tW:1e9;
  let a=TRI_RUF[0]+6, b=TRI_RUF[1]+1, p=B.m.G.position; if(D&&rt>=tW-9&&rt<=tW) [a,b,p]=[tW-9,tW,D.m.G.position]; if(rt<a||rt>b) return; // Burgherr, dann die Dorfleute am Wirtshaus
  const w=.75*bSm((rt-a)/1.2)*bSm((b-rt)/1.2), look=new THREE.Vector3(p.x,p.y+1.6,p.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz); camera.lookAt(now.lerp(look,w)); }

// ---- Friedel, Wirtshaus-Szene, Elwetritsche-Jagden (Schritt 4/5) – Texte vom Nutzer, Übersicht in KAMPAGNE.md ----
const TRI_TXT={dorfmann:'Zeh Guld, dass du heit owend kä Elwetritsch fangsch!', friedel1:'Des wer ma mo sehe!', dorfweib:'Dem Bu henn se ah ä mo zu oft hochgeworfe un ä mo zu wenich uffgfange.',
  friedel2:'Ihr fahren doch a noch Siede, gell? Kinna ma do vielleicht helfe? Allä trau ich mich ned in de Wald…',
  ank:['Psst. Do vorne raschelts, [Herr|Herrin]!','Do is se widder!','Wie frech se uns aguckt, die mänt a, sie is de Kees!','Uffbasse, [Herr|Herrin], die is gscheit wie sunscht was.','Des is die letzscht Chance! Ich halt schummo de Sack uff, [Herr|Herrin]!'],
  hopp:'Hopp, hopp, alleweil hemmer se!', zeh:'Noch zeh Herzschläch…', finf:'Noch finf!',
  zurueck:['Jetz warten doch bitte uff mich!','Mein Bock is oich longsam…','Mei Wade krampfen, [Herr|Herrin]!','Jetz warten doch bitte uff mich!'],
  weg:['Weg isse – ins Gebisch!',"Die hot uns d' Zung rausgstreckt, hosch des gsähne?",'Jetzt lacht se uns a noch aus!','Des gibts doch ned – schun widder!'],
  angst:['Die beißen, die Sauviecher, ich schwörs!','Henn ihr des Geheul ghört? Des war bestimmt bloß de Wind…','Im Dunkle seht ma do hinnen Ache leichte, do werd ma ganz onnerschd.'],
  lob:['Ihr treden wie de Deifel persönlich, ich gläb ich nenn eich Betzi ab jetzad!','So schnell bin ich noch nie gewesst!','Mit eich krieche ma noch so eh Vieh, ich spürs!'],
  fang:'Ich hab se!!! Ich hab des Scheißding! Zeh Gulde, aller!!!', ende:'Isch muss glei zurick ind Wertschaft, die werren gucken… Mer treffen uns dann moie do im Gaschthaus in de Näh vum Deifelsdisch, gell?'};
// Ablauf aus dem Workout: wer sagt wann was (Workout-Zeit in s) – Wirtshaus am Ende des Einfahrens, je Jagd Ankündigung, Anfeuern, Zurückfallen, Countdown, Entwischt/Fang, dazwischen Lob und Angst
function triSkript(){ const S=race.woSegs||[], tW=S[0]?S[0].t0+S[0].dur:480, J=S.filter(s=>/Jagd/.test(s.label)), L=[], X=TRI_TXT, sag=(t0,dur,wer,txt)=>L.push({t0,t1:t0+dur,wer,txt});
  sag(tW-15,7,'dorfmann',X.dorfmann); sag(tW-8,8,'dorfweib',X.dorfweib); sag(tW-1,5,'friedel',X.friedel1); sag(tW+6,11,'friedel',X.friedel2);
  J.forEach((j,k)=>{ const a=j.t0; sag(a-7,7,'friedel',X.ank[k]); sag(a+3,5,'friedel',X.hopp); if(k<4) sag(a+10,6,'friedel',X.zurueck[k]); sag(a+18,4,'friedel',X.zeh); sag(a+24,3,'friedel',X.finf);
    if(k<4) sag(a+j.dur+1,6,'friedel',X.weg[k]); else sag(a+j.dur-3,9,'friedel',X.fang);
    if(k<3){ sag(a+70,7,'friedel',X.lob[k]); sag(a+140,8,'friedel',X.angst[k]); } });
  const T=race.woT||0; sag(T-66,14,'friedel',X.ende); // vor den zwei Ende-Tafeln
  return {L,tW,J,T}; }
// Sprechblase in fester Bildschirmgröße (gut lesbar, auch von weitem)
function triBlase(){ const s=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false,depthTest:false,sizeAttenuation:false})); s.scale.set(.5,.155,1); s.renderOrder=10; s.visible=false; world.add(s); return s; }
function triBlaseText(s,txt){ if(s.userData.txt!==txt){ s.userData.txt=txt; if(s.material.map) s.material.map.dispose(); s.material.map=blaseTex(txt); s.material.needsUpdate=true; } }

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
function buildFriedel(T){ const A=anim.tri, M=c=>lam(c);
  const r=makeRider('custom',{...LOOK_DEF.custom,name:'Friedel',build:.9,jersey:'#5d7a3a',sleeve:'#a8862e'},true); r.g.scale.setScalar(.95); r.tag.visible=false; world.add(r.g); // schmächtig, Wams grün
  const haar=M('#b8452a'), haar2=M('#9c3a22'); for(let i=0;i<16;i++){ const a=Math.PI*(.45+i/15*1.1), l=.2+((i*37)%7)*.03, st=new THREE.Mesh(new THREE.BoxGeometry(.035,l,.05),i%2?haar:haar2); // lange zottelige rote Haare unter der Haube
    st.position.set(.04+Math.cos(a)*.13,.02-l/2+.04,Math.sin(a)*.13); st.rotation.set(Math.sin(a)*.25,0,Math.cos(a)*-.25); r.headG.add(st); }
  for(let i=0;i<4;i++){ const st=new THREE.Mesh(new THREE.BoxGeometry(.03,.07,.05),haar); st.position.set(.15,.1,(i-1.5)*.05); r.headG.add(st); } // Fransen vorn
  const sack=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),M('#c8b48a')); sack.scale.set(.9,1.1,.8); sack.position.set(-.32,1.15,-.12); r.body.add(sack); // Sack auf dem Rücken
  const la=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.12),lampGlowMat()); la.position.set(.62,.88,0); r.body.add(la); const lh=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.12,4),M('#2e2c2a')); lh.position.set(.62,.99,0); r.body.add(lh); // Laterne am Lenker
  A.friedel={r,sack,d:T.wirtD+1,crank:0,mode:'park',blase:triBlase()};
  // Dorfleute vor dem Wirtshaus „Zack Zack“ (rechts), mit Krügen, blicken zu Friedel
  const H=T.wirt, dw=T.wirtD, rw=roadW(R,dw)/2, fp=wegPos(dw+1,rw-.6), krug=m=>{ const k=new THREE.Mesh(new THREE.CylinderGeometry(.05,.045,.13,8),M('#8a6a44')); k.position.y=-.66; m.arme[1].add(k); m.arme[1].rotation.x=-.9; };
  const leut=[['dorfmann',{kittel:'#6b5a3a',hose:'#3a3020',haar:'#4a3222',bart:'#4a3222'},-2.5,1.4],['dorfweib',{lang:'#8a3a2a',haar:'#e8e0d0'},2.8,1.5],[null,{kittel:'#4a5a6a',hose:'#3a3a2a',haar:'#6a5236'},.4,2.6],[null,{kittel:'#7a3a3a',hose:'#2e2a24',haar:'#2e2420',bart:'#2e2420'},-.8,3.4]];
  A.dorf={}; for(const [wer,o,da,uo] of leut){ const m=trMensch(o), p=wegPos(dw+da,rw+uo); m.G.position.set(p.x,terrainAt(p.x,p.z),p.z); m.G.rotation.y=Math.atan2(fp.x-p.x,fp.z-p.z); world.add(m.G); krug(m);
    if(wer){ A.dorf[wer]={m,blase:triBlase()}; A.dorf[wer].blase.position.set(p.x,m.G.position.y+2.4,p.z); } }
  A.elw=elwetritscheModell(); A.elw.G.visible=false; world.add(A.elw.G);
  if(!document.getElementById('triSag')){ const el=document.createElement('div'); el.id='triSag'; document.body.appendChild(el); } } // Friedels Worte, wenn er nicht im Bild ist

// ---- Bewegung (aus poseTrifels) ----
function poseFriedel(dt,t,rt){ const A=anim.tri, F=A.friedel, T=R.tri; if(!F) return; const run=race.state==='run', lauf=run&&!race.paused?dt*simSpeed():0;
  if(run&&A.skS!==race.woSegs){ A.sk=triSkript(); A.skS=race.woSegs; } const K=run?A.sk:null, ich=riders3d[myKey], H=roadW(R,me.d)/2-.5;
  // Friedel: wartet am Wirtshaus, fährt ab Ende des Einfahrens mit, fällt in den Jagden 1–4 zurück (bei der letzten hält er den Sack bereit), am Ende kehrt er um
  if(!K||rt<K.tW-1){ F.d=T.wirtD+1; F.mode='park'; F.r.lane=roadW(R,F.d)/2-.6; putRider(F.r,F.d,F.crank); F.r.g.visible=true; }
  else { const jj=K.J.findIndex(j=>rt>=j.t0&&rt<j.t0+j.dur), heim=rt>=K.T-52;
    if(heim){ F.d-=6*lauf; F.crank+=6*lauf*2.4; }
    else { const want=jj>=0&&jj<4?-36:-1.3, vr=clampN((want-(F.d-me.d))*.6,-2.6,1.6); F.d+=Math.max(0,me.v+vr)*lauf; F.crank+=Math.max(0,me.v+vr)*lauf*2.4; }
    const ml=ich&&ich.lane!=null?ich.lane:0, u=heim?-H:(ml-1.25<-H?ml+1.25:ml-1.25); F.r.lane=F.r.lane==null?u:F.r.lane+(u-F.r.lane)*Math.min(1,dt*2);
    putRider(F.r,F.d,F.crank); if(heim) F.r.g.rotation.y+=Math.PI; F.r.g.visible=!(heim&&F.d<me.d-150); }
  // Elwetritsche: taucht mit jeder Jagd 34 m vor dir auf, rennt im Zickzack davon, du holst auf; kurz vor Schluss schlägt sie einen Haken ins Gebüsch – bei der letzten springt sie in Friedels Sack
  const E=A.elw; let ev=false; if(K){ const k=K.J.findIndex(j=>rt>=j.t0&&rt<j.t0+j.dur+1), j=K.J[k];
    if(j){ const tau=rt-j.t0, s=k%2?1:-1, letzt=k===K.J.length-1, gap=34-30*clampN(tau/25,0,1), haken=bSm((tau-25)/2.5); let d=me.d+gap, u=.9*Math.sin(tau*1.7), y=0;
      if(letzt&&tau>23){ const w=bSm((tau-23)/2.5), sp=new THREE.Vector3(); F.sack.getWorldPosition(sp); const [x0,z0]=(()=>{ const p=wegPos(d,u); return [p.x,p.z]; })(); E.G.position.set(x0+(sp.x-x0)*w, roadY(d)+(sp.y-roadY(d))*w*.8+Math.sin(w*Math.PI)*1.2, z0+(sp.z-z0)*w); ev=tau<25.6; }
      else { u+=(s*(roadW(R,d)/2+4)-u)*haken; const p=wegPos(d,u); y=roadY(d)+Math.abs(Math.sin(tau*9))*.22; E.G.position.set(p.x,y,p.z); ev=tau<27.6; }
      const hd=headingAt(R,d); E.G.rotation.y=-hd+Math.PI/2-s*haken*1.2; // läuft in Fahrtrichtung, beim Haken zur Seite
      const blick=(tau%8>5.5)&&tau<24&&k>0; E.kopf.rotation.y=blick?Math.PI*.85:0; E.zunge.visible=blick&&k>=1; // schaut frech zurück, ab Jagd 2 mit Zunge
      E.beine[0].rotation.x=.7*Math.sin(tau*18); E.beine[1].rotation.x=-.7*Math.sin(tau*18); E.fluegel.forEach((w,i)=>w.rotation.z=(i?-1:1)*(.3+.5*Math.abs(Math.sin(tau*14)))); E.augen.forEach((a,i)=>a.rotation.z=.25*Math.sin(t*11+i)); E.K.rotation.z=.12*Math.sin(tau*9); } }
  E.G.visible=ev;
  // Sack: nach dem Fang dick und zappelig
  const voll=K&&K.J.length&&rt>K.J[K.J.length-1].t0+25.6; F.sack.scale.set(voll?1.35+.08*Math.sin(t*13):.9, voll?1.45:1.1, voll?1.2:.8); if(voll) F.sack.rotation.z=.15*Math.sin(t*9);
  // Sprechen: Dorfleute über dem Kopf, Friedel über dem Kopf wenn im Bild, sonst unten im Bild
  const akt=K?K.L.filter(s=>rt>=s.t0&&rt<s.t1):[], el=document.getElementById('triSag'); let unten='';
  for(const w of ['dorfmann','dorfweib']){ const D=A.dorf[w]; if(!D) continue; const s=akt.find(x=>x.wer===w); D.blase.visible=!!s; if(s) triBlaseText(D.blase,kText(s.txt)); D.m.arme[0].rotation.x=s?-.6-.3*Math.sin(t*5):0; }
  { const s=akt.find(x=>x.wer==='friedel'), B=F.blase; let im=false; if(s&&F.r.g.visible){ const p=F.r.g.position.clone(); p.y+=2.3; B.position.copy(p); const q=p.clone().project(camera); im=q.z<1&&Math.abs(q.x)<.9&&Math.abs(q.y)<.9&&camera.position.distanceTo(p)<45; }
    B.visible=!!s&&im; if(B.visible) triBlaseText(B,kText(s.txt)); if(s&&!im) unten='Friedel: '+kText(s.txt); }
  if(el){ if(unten){ el.textContent=unten; el.classList.add('zeig'); } else el.classList.remove('zeig'); } }
