/* ================= Insel-Welt: Gelände, Wasser, Palmen, Felsinseln, Boote, Strandbar, Atoll ================= */
function islTerr(I,i,u,x,z){ let h=islH(I,i,u); if(h>1.2) h+=Math.max(0,vnoise(x/45,z/45)-.35)*1.4*Math.min(1,(h-1.2)/0.6); return h; }
function leafGeo(){ const N=6, p=[], idx=[]; for(let i=0;i<=N;i++){ const t=i/N, w=0.17*Math.sin(Math.PI*Math.min(1,t*1.1))+0.015, y=0.3*t-0.8*t*t; p.push(t,y,-w, t,y+0.04,0, t,y,w); }
  for(let i=0;i<N;i++){ const a=i*3; idx.push(a,a+3,a+1, a+1,a+3,a+4, a+1,a+4,a+2, a+2,a+4,a+5); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(p,3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
function buildIsland(){
  scene.fog.near=300; scene.fog.far=2600; renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1)); // Insel: etwas geringere Auflösung, dafür flüssiger
  const I=R.I, n=R.xs.length, rnd=rng((R.def.seed||1)+77);
  const fr=[]; for(let i=0;i<n;i++){ const hd=headingAt(R,i*STEP); fr.push({x:R.xs[i], z:R.ys[i], nx:-Math.sin(hd), nz:Math.cos(hd), hd, d:i*STEP}); }
  const W2=(i,u)=>{ const f=fr[i]; return [f.x+f.nx*u, f.z+f.nz*u]; }; // u = links/rechts in Weltkoordinaten (nicht Meerseite)
  // ---------- Gelände in Streifen entlang der Strecke ----------
  const U=[-220,-160,-118,-88,-66,-50,-38,-29,-22,-16,-11.5,-7.5,-4.2,0,4.2,7.5,11.5,16,22,29,38,50,66,88,118,160,220];
  const RS=4, rows=[]; for(let i=0;i<n;i+=RS) rows.push(i); if(rows[rows.length-1]!==n-1) rows.push(n-1);
  const nc=U.length, nv=rows.length*nc, pos=new Float32Array(nv*3), col=new Float32Array(nv*3), tc=new THREE.Color();
  const C=s=>new THREE.Color(s), cJ1=C('#1c4318'), cJ2=C('#32652a'), cVerge=C('#cfc296'), cDry=C('#f3ead3'), cWet=C('#e0cfa6'), cSh=C('#e4d6ae'), cMid=C('#7fd3c7'), cDeep=C('#1f78a6'), cAbyss=C('#0b3f78'), cWeed=C('#2c6466');
  rows.forEach((i,ri)=>{ const S=I.S[i], steg=I.cross[i]&&I.mode[i]===0;
    for(let c=0;c<nc;c++){ const u=U[c], [x,z]=W2(i,u), up=S*u; let h=islTerr(I,i,up,x,z);
      if(Math.abs(u)<=4.2 && !steg) h=I.py[i]-0.03; if(c===0||c===nc-1) h=-8.5;
      const k=(ri*nc+c)*3; pos[k]=x; pos[k+1]=h; pos[k+2]=z;
      if(h>0.05){ const e=Math.min(up-I.lo[i], I.hi[i]-up); if(e>16 && h>1.3) tc.copy(cJ1).lerp(cJ2, vnoise(x/30,z/30)); else tc.copy(h<0.4?cWet:cDry); if(Math.abs(u)<7 && h>1.3) tc.copy(cVerge); }
      else { const t=-h; if(t<0.9) tc.copy(cSh); else if(t<3) tc.copy(cSh).lerp(cMid,(t-0.9)/2.1); else if(t<7) tc.copy(cMid).lerp(cDeep,(t-3)/4); else tc.copy(cDeep).lerp(cAbyss,Math.min(1,(t-7)/1.5));
        if(t>0.9 && t<5 && vnoise(x/22,z/22)>.62) tc.lerp(cWeed,.55); }
      col[k]=tc.r; col[k+1]=tc.g; col[k+2]=tc.b; } });
  const terrMat=new THREE.MeshLambertMaterial({vertexColors:true, side:THREE.DoubleSide}), terrChunks=[];
  for(let r0=0;r0<rows.length-1;r0+=120){ const r1=Math.min(rows.length-1,r0+120), nr=r1-r0+1; // Gelände in Blöcken, damit nur Sichtbares gezeichnet wird
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos.slice(r0*nc*3,(r1+1)*nc*3),3)); g.setAttribute('color',new THREE.BufferAttribute(col.slice(r0*nc*3,(r1+1)*nc*3),3));
    const idx=new Uint32Array((nr-1)*(nc-1)*6); let q=0; for(let r=0;r<nr-1;r++) for(let c=0;c<nc-1;c++){ const a=r*nc+c, b=a+nc; idx[q++]=a; idx[q++]=b; idx[q++]=a+1; idx[q++]=a+1; idx[q++]=b; idx[q++]=b+1; }
    g.setIndex(new THREE.BufferAttribute(idx,1)); g.computeVertexNormals(); g.computeBoundingSphere(); const m=new THREE.Mesh(g,terrMat); world.add(m); terrChunks.push({m,x:g.boundingSphere.center.x,z:g.boundingSphere.center.z,r:g.boundingSphere.radius}); }
  let bx0=1e9,bz0=1e9,bx1=-1e9,bz1=-1e9; for(let i=0;i<n;i+=10){ bx0=Math.min(bx0,R.xs[i]); bx1=Math.max(bx1,R.xs[i]); bz0=Math.min(bz0,R.ys[i]); bz1=Math.max(bz1,R.ys[i]); }
  const cx=(bx0+bx1)/2, cz=(bz0+bz1)/2, span=Math.max(bx1-bx0,bz1-bz0)+8000;
  { const deep=new THREE.Mesh(new THREE.PlaneGeometry(span,span), lam('#0a3a74')); deep.rotation.x=-Math.PI/2; deep.position.set(cx,-9,cz); world.add(deep); }
  // Atoll: Lagune innen, Brandung außen
  const ringI=[]; for(let i=0;i<n;i++) if(I.ring[i]) ringI.push(i);
  let acx=0, acz=0; ringI.forEach(i=>{ acx+=R.xs[i]; acz+=R.ys[i]; }); acx/=ringI.length; acz/=ringI.length; const AR=ISL_RING/(2*Math.PI);
  { const lag=new THREE.Mesh(new THREE.CircleGeometry(AR-200,96), lam('#efe6c6')); lag.rotation.x=-Math.PI/2; lag.position.set(acx,-2.3,acz); world.add(lag);
    const spots=canvasTex(256,256,g=>{ const qq=rng(5); g.clearRect(0,0,256,256); for(let i=0;i<60;i++){ const x=qq()*256, y=qq()*256, r=6+qq()*22; g.fillStyle='rgba(60,120,110,.45)'; g.beginPath(); g.ellipse(x,y,r,r*.6,qq()*3,0,7); g.fill(); } });
    const sp=new THREE.Mesh(new THREE.CircleGeometry(AR-210,96), new THREE.MeshBasicMaterial({map:spots, transparent:true, depthWrite:false})); sp.rotation.x=-Math.PI/2; sp.position.set(acx,-2.25,acz); world.add(sp);
    const reef=new THREE.Mesh(new THREE.RingGeometry(AR+92,AR+104,160), new THREE.MeshBasicMaterial({color:'#ffffff', transparent:true, opacity:.75, depthWrite:false})); reef.rotation.x=-Math.PI/2; reef.position.set(acx,0.06,acz); world.add(reef); }
  // Wasser: durchsichtig, leicht glitzernd
  const wtex=canvasTex(256,256,g=>{ g.fillStyle='#ffffff'; g.fillRect(0,0,256,256); const qq=rng(9); for(let i=0;i<260;i++){ g.strokeStyle=`rgba(200,245,255,${.25+qq()*.4})`; g.lineWidth=1+qq()*1.5; g.beginPath(); const x=qq()*256, y=qq()*256; g.moveTo(x,y); g.quadraticCurveTo(x+8,y-4,x+18+qq()*10,y+qq()*4); g.stroke(); } });
  wtex.wrapS=wtex.wrapT=THREE.RepeatWrapping; wtex.repeat.set(span/40,span/40);
  const water=new THREE.Mesh(new THREE.PlaneGeometry(span,span), new THREE.MeshLambertMaterial({color:'#1798b4', map:wtex, transparent:true, opacity:.58, depthWrite:false}));
  water.rotation.x=-Math.PI/2; water.position.set(cx,0,cz); water.renderOrder=2; world.add(water);

  // ---------- Fahrbahn je Untergrund ----------
  const ribbon=(ranges,fn,mat,uvLen=8)=>{ ranges.forEach(([i0,i1])=>{ const m=i1-i0+1; if(m<2) return; const p=new Float32Array(m*6), uv=new Float32Array(m*4), id=[];
      for(let j=0;j<m;j++){ const i=i0+j, [a,b]=fn(i); p.set([...a,...b],j*6); uv.set([0,fr[i].d/uvLen,1,fr[i].d/uvLen],j*4); if(j<m-1) id.push(j*2,j*2+1,j*2+2, j*2+1,j*2+3,j*2+2); }
      const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(id); g.computeVertexNormals(); world.add(new THREE.Mesh(g,mat)); }); };
  const rangesOf=test=>{ const out=[]; let s=-1; for(let i=0;i<n;i++){ if(test(i)){ if(s<0) s=i; } else if(s>=0){ out.push([Math.max(0,s-1),i]); s=-1; } } if(s>=0) out.push([Math.max(0,s-1),n-1]); return out; };
  const P=(i,u,dy)=>{ const f=fr[i]; return [f.x+f.nx*u, I.py[i]+dy, f.z+f.nz*u]; }, hw=ROAD_W/2;
  const isSteg=i=>I.cross[i]&&I.mode[i]===0, isRoad=i=>!I.cross[i]&&I.mode[i]===0;
  const atex=canvasTex(64,256,g=>{ g.fillStyle='#6d6f72'; g.fillRect(0,0,64,256); for(let t=0;t<500;t++){ const v=Math.random()<.5?0:255; g.fillStyle=`rgba(${v},${v},${v},.06)`; g.fillRect(Math.random()*64,Math.random()*256,2,2); }
    g.fillStyle='#f1efe6'; g.fillRect(3,0,3,256); g.fillRect(58,0,3,256); g.fillStyle='#f2c94c'; g.fillRect(31,0,2,140); }); atex.wrapT=THREE.RepeatWrapping; atex.anisotropy=8;
  ribbon(rangesOf(isRoad), i=>[P(i,-hw,.06),P(i,hw,.06)], Object.assign(new THREE.MeshLambertMaterial({map:atex, side:THREE.DoubleSide}),{userData:{wet:1},polygonOffset:true,polygonOffsetFactor:-2}), 10);
  const sandTr=canvasTex(64,128,g=>{ g.clearRect(0,0,64,128); g.fillStyle='rgba(150,120,70,.35)'; for(const x of [14,46]){ for(let y=0;y<128;y+=4) g.fillRect(x-3+Math.sin(y*.2)*1,y,6,3); } });
  sandTr.wrapT=THREE.RepeatWrapping;
  ribbon(rangesOf(i=>!isSteg(i)&&(I.mode[i]===1||I.mode[i]===2)), i=>[P(i,-2.2,.03),P(i,2.2,.03)], Object.assign(new THREE.MeshBasicMaterial({map:sandTr, transparent:true, depthWrite:false, side:THREE.DoubleSide}),{polygonOffset:true,polygonOffsetFactor:-2}), 6);
  // Holzsteg mit Pfählen und Geländer
  const plank=canvasTex(64,64,g=>{ for(let y=0;y<64;y+=8){ g.fillStyle=`hsl(28,${35+Math.random()*10}%,${36+Math.random()*10}%)`; g.fillRect(0,y,64,7); g.fillStyle='#3d2a1a'; g.fillRect(0,y+7,64,1); } }); plank.wrapT=THREE.RepeatWrapping;
  const sr=rangesOf(isSteg), sw=2.4;
  ribbon(sr, i=>[P(i,-sw,0),P(i,sw,0)], new THREE.MeshLambertMaterial({map:plank, side:THREE.DoubleSide}), 3);
  ribbon(sr, i=>[P(i,-sw,0),P(i,-sw,-.35)], lam('#5a3d24')); ribbon(sr, i=>[P(i,sw,0),P(i,sw,-.35)], lam('#5a3d24'));
  ribbon(sr, i=>[P(i,-sw,.9),P(i,-sw,1.0)], lam('#6b4a2c')); ribbon(sr, i=>[P(i,sw,.9),P(i,sw,1.0)], lam('#6b4a2c'));
  { const posts=[]; sr.forEach(([a,b])=>{ for(let i=a;i<=b;i+=2) for(const s of [-1,1]){ const [x,y,z]=P(i,s*sw,0), bed=islH(I,i,I.S[i]*s*sw); posts.push({x,z,top:y+1.0,bot:Math.min(bed,-.5)}); } });
    if(posts.length){ const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(.11,.13,1,6), lam('#4f3520'), posts.length), m4=new THREE.Matrix4(), qq=new THREE.Quaternion(), sc=new THREE.Vector3(), ps=new THREE.Vector3();
      posts.forEach((o,k)=>{ ps.set(o.x,(o.top+o.bot)/2,o.z); sc.set(1,o.top-o.bot,1); m4.compose(ps,qq,sc); im.setMatrixAt(k,m4); }); world.add(im); } }
  // Schaum an der Wasserlinie
  const foam=canvasTex(64,128,g=>{ g.clearRect(0,0,64,128); for(let i=0;i<70;i++){ g.fillStyle=`rgba(255,255,255,${.35+Math.random()*.5})`; g.beginPath(); g.ellipse(Math.random()*64,Math.random()*128,3+Math.random()*10,1.5+Math.random()*3,0,0,7); g.fill(); } }); foam.wrapT=THREE.RepeatWrapping;
  const foamM=new THREE.MeshBasicMaterial({map:foam, transparent:true, depthWrite:false, side:THREE.DoubleSide});
  const shoreR=rangesOf(i=>!I.cross[i] && I.hi[i]>-60 && I.hi[i]<200);
  const fU=(i,up)=>{ const f=fr[i], u=I.S[i]*up; return [f.x+f.nx*u, 0.05, f.z+f.nz*u]; };
  ribbon(shoreR, i=>[fU(i,I.hi[i]+0.2),fU(i,I.hi[i]+2.6)], foamM, 12);
  ribbon(rangesOf(i=>!I.cross[i] && I.lo[i]>-205), i=>[fU(i,I.lo[i]-0.2),fU(i,I.lo[i]-2.6)], foamM, 12);

  // ---------- Palmen, Büsche, Granitfelsen ----------
  const palms=[], bush=[], boulders=[];
  for(let i=0;i<n;i+=3){ const S=I.S[i]; if(I.ring[i] && rnd()<.35) continue;
    for(let t=0;t<2;t++){ if(rnd()>.78) continue; const lo=Math.max(I.lo[i]+5,-110), hi=Math.min(I.hi[i]-9,110); if(hi<=lo) continue; const up=lo+rnd()*(hi-lo); if(Math.abs(up)<5.5) continue;
      const [x,z]=W2(i,S*up), h=islTerr(I,i,up,x,z); if(h<0.8) continue; if(palms.length<4500) palms.push({x,z,y:h-0.1,h:6+rnd()*6,lean:(.08+rnd()*.28)*(I.hi[i]-up<25?1.6:1),la:Math.atan2(fr[i].nz*S,fr[i].nx*S)+(rnd()-.5)*1.4,r:rnd()}); }
    for(let t=0;t<2;t++){ const lo=Math.max(I.lo[i]+10,-215), hi=Math.min(I.hi[i]-14,215); if(hi>lo){ const up=lo+rnd()*(hi-lo); if(Math.abs(up)>9){ const [x,z]=W2(i,S*up), h=islTerr(I,i,up,x,z); if(h>1.4 && bush.length<6000) bush.push({x,z,y:h,s:2+rnd()*3.5,c:rnd()}); } } }
    if(rnd()<.55){ const lo=Math.max(I.lo[i]+14,-215), hi=Math.min(I.hi[i]-18,215); if(hi>lo){ const up=lo+rnd()*(hi-lo); if(Math.abs(up)>16){ const [x,z]=W2(i,S*up), h=islTerr(I,i,up,x,z); if(h>1.3 && bush.length<4000) bush.push({x,z,y:h,s:(Math.abs(up)<35?2.2:3)+rnd()*(Math.abs(up)<35?2:4),c:rnd()}); } } }
    if(rnd()<.025 && I.hi[i]>8){ const up=I.hi[i]-2+rnd()*4, [x,z]=W2(i,S*up); boulders.push({x,z,s:1.5+rnd()*3.5,r:rnd()*6}); } }
  const m4=new THREE.Matrix4(), qq=new THREE.Quaternion(), sc=new THREE.Vector3(), ps=new THREE.Vector3(), cc=new THREE.Color(), up3=new THREE.Vector3(0,1,0), ax=new THREE.Vector3(), eu=new THREE.Euler();
  const chunks=[]; // in Kacheln aufgeteilt: nur sichtbare/nahe Kacheln werden gezeichnet
  const inst=(geo,mat,list,fn,pos=o=>o)=>{ if(!list.length) return null; const groups=new Map();
    list.forEach(o=>{ const p=pos(o), k=Math.floor(p.x/500)+','+Math.floor(p.z/500); (groups.get(k)||groups.set(k,[]).get(k)).push(o); });
    groups.forEach(gl=>{ const g=geo.clone(), im=new THREE.InstancedMesh(g,mat,gl.length); let mx=0,mz=0; gl.forEach(o=>{ const p=pos(o); mx+=p.x; mz+=p.z; }); mx/=gl.length; mz/=gl.length; let rad=0;
      gl.forEach((o,i)=>{ cc.set('#ffffff'); fn(o,i); m4.compose(ps,qq,sc); im.setMatrixAt(i,m4); im.setColorAt(i,cc); rad=Math.max(rad,Math.hypot(ps.x-mx,ps.z-mz)); });
      g.boundingSphere=new THREE.Sphere(new THREE.Vector3(mx,5,mz),rad+25); im.instanceMatrix.needsUpdate=true; if(im.instanceColor) im.instanceColor.needsUpdate=true; world.add(im); chunks.push({m:im,x:mx,z:mz,r:rad+25,far:list.length>2000?1000:2200}); }); return true; };
  const trunkG=new THREE.CylinderGeometry(.15,.24,1,7); trunkG.translate(0,.5,0);
  palms.forEach(o=>{ ax.set(Math.cos(o.la),0,Math.sin(o.la)).cross(up3).normalize(); o.q=new THREE.Quaternion().setFromAxisAngle(ax,-o.lean); o.top=new THREE.Vector3(0,o.h,0).applyQuaternion(o.q).add(new THREE.Vector3(o.x,o.y,o.z)); });
  inst(trunkG, lam('#fff'), palms, o=>{ ps.set(o.x,o.y,o.z); qq.copy(o.q); sc.set(1,o.h,1); cc.set(o.r<.5?'#8a7356':'#7b664c'); });
  const leaves=[]; palms.forEach(o=>{ for(let k=0;k<5;k++) leaves.push({o,a:k/5*Math.PI*2+o.r*3, p:-.15+((k*37)%10)/10*.45, L:3.2+((k*13+o.r*10)%10)/10*1.4}); });
  inst(leafGeo(), new THREE.MeshLambertMaterial({color:'#fff', side:THREE.DoubleSide}), leaves, l=>{ ps.copy(l.o.top); qq.setFromEuler(eu.set(0,l.a,l.p,'YXZ')); sc.set(l.L,l.L*.9,l.L); cc.set(l.o.r<.33?'#3c8a34':l.o.r<.66?'#4e9a3a':'#5aa443'); }, l=>l.o);
  inst(new THREE.IcosahedronGeometry(1,0), lam('#fff'), bush, o=>{ ps.set(o.x,o.y+o.s*.35,o.z); qq.setFromAxisAngle(up3,o.c*6); sc.set(o.s,o.s*.75,o.s); cc.set(o.c<.33?'#2e6a2a':o.c<.66?'#3a7a30':'#467f2c'); });
  inst(new THREE.DodecahedronGeometry(1,0), lam('#fff'), boulders, o=>{ ps.set(o.x,o.s*.2,o.z); qq.setFromEuler(eu.set(o.r,o.r*2,0)); sc.set(o.s*1.3,o.s*.8,o.s); cc.set(o.r<3?'#a98b80':'#8f7a73'); });

  // ---------- Grid zum Abstandstest ----------
  const GC=60, grid=new Map(), gk=(x,z)=>Math.floor(x/GC)+','+Math.floor(z/GC); for(let i=0;i<n;i+=5){ const k=gk(R.xs[i],R.ys[i]); (grid.get(k)||grid.set(k,[]).get(k)).push(i); }
  const near=(x,z,rad)=>{ const a=Math.floor(x/GC), b=Math.floor(z/GC), sp=Math.ceil(rad/GC)+1; for(let i=-sp;i<=sp;i++) for(let j=-sp;j<=sp;j++){ const l=grid.get((a+i)+','+(b+j)); if(l) for(const k of l) if(Math.hypot(R.xs[k]-x,R.ys[k]-z)<rad) return true; } return false; };
  // ---------- Steile Felsinseln und kleine Palmeninseln ----------
  for(let i=Math.floor(400/STEP); i<n; i+=Math.floor((500+rnd()*700)/STEP)){ const S=I.S[i], base=Math.max(I.hi[i],0);
    if(rnd()<.62){ const rad=25+rnd()*70, hgt=35+rnd()*85, up=base+rad+90+rnd()*450, [x,z]=W2(i,S*up); if(near(x,z,rad+70)) continue;
      const g=new THREE.SphereGeometry(1,28,18), pa=g.attributes.position; const sd=rnd()*100;
      for(let v=0;v<pa.count;v++){ let X=pa.getX(v), Y=pa.getY(v), Z=pa.getZ(v); const nn=1+(vnoise(X*2.2+sd,Z*2.2+Y*1.7)-.5)*.5; Y=Y<0?Y*.2:Y; pa.setXYZ(v,X*rad*nn*(1-Math.max(0,Y)*.25),Y*hgt,Z*rad*.85*nn*(1-Math.max(0,Y)*.25)); }
      g.computeVertexNormals(); const nm=g.attributes.normal, cl=new Float32Array(pa.count*3); for(let v=0;v<pa.count;v++){ const steep=nm.getY(v)<.45, y=pa.getY(v); cc.set(y<2?'#9a958a':steep?(vnoise(v*.37,sd)>.5?'#8e8f86':'#a8a69a'):(vnoise(v*.21,sd+3)>.5?'#3d7a2e':'#4c8a34')); cl.set([cc.r,cc.g,cc.b],v*3); }
      g.setAttribute('color',new THREE.BufferAttribute(cl,3)); const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true})); m.position.set(x,-3,z); m.rotation.y=rnd()*6; world.add(m); }
    else { const rad=12+rnd()*22, up=base+rad+50+rnd()*260, [x,z]=W2(i,S*up); if(near(x,z,rad+40)) continue;
      const isl=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad*1.8,4,24), lam('#f1e6c8')); isl.position.set(x,-1.6,z); world.add(isl);
      const top=new THREE.Mesh(new THREE.SphereGeometry(rad*.75,16,8,0,Math.PI*2,0,Math.PI/2), lam('#3f7f30')); top.scale.y=.35; top.position.set(x,0.35,z); world.add(top); } }

  // ---------- Boote ----------
  const boats=[], white=lam('#f6f6f2'), sailM=new THREE.MeshLambertMaterial({color:'#fbfbf7', side:THREE.DoubleSide});
  const tri=(a,b,c,mat)=>{ const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...b,...c],3)); g.computeVertexNormals(); return new THREE.Mesh(g,mat); };
  const sailboat=()=>{ const G=new THREE.Group(); const hull=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.1,7.5), white); hull.position.y=.3; G.add(hull);
    const bow=new THREE.Mesh(new THREE.ConeGeometry(1.7,2.6,4), white); bow.rotation.set(Math.PI/2,Math.PI/4,0); bow.scale.set(1,1,.65); bow.position.set(0,.3,5.0); G.add(bow);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,11,6), lam('#cfd3d6')); mast.position.set(0,6.3,.6); G.add(mast);
    G.add(tri([0,1.4,.75],[0,11.5,.75],[0,1.6,-3.2],sailM)); G.add(tri([0,1.3,1.0],[0,10.8,.9],[0,1.2,6.0],sailM)); return G; };
  const motorboat=()=>{ const G=new THREE.Group(); const hull=new THREE.Mesh(new THREE.BoxGeometry(1.7,.7,4.6), white); hull.position.y=.15; G.add(hull);
    const st=new THREE.Mesh(new THREE.BoxGeometry(1.68,.12,4.62), lam('#1f6fb2')); st.position.y=.05; G.add(st); const con=new THREE.Mesh(new THREE.BoxGeometry(.8,.6,.7), lam('#dfe3e6')); con.position.set(0,.75,-.4); G.add(con); return G; };
  const junk=()=>{ const G=new THREE.Group(), wood=lam('#6b4426'); const hull=new THREE.Mesh(new THREE.BoxGeometry(4.2,2.2,17), wood); hull.position.y=.6; G.add(hull);
    const st=new THREE.Mesh(new THREE.BoxGeometry(4.2,1.8,4), wood); st.position.set(0,2.4,-6.2); G.add(st);
    const red=new THREE.MeshLambertMaterial({color:'#c8452e', side:THREE.DoubleSide});
    for(const [z,h] of [[3,15],[-2.5,13]]){ const m=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,h,6), wood); m.position.set(0,1.6+h/2,z); G.add(m);
      const sl=new THREE.Mesh(new THREE.PlaneGeometry(5.5,h*.62), red); sl.rotation.y=Math.PI/2; sl.position.set(0,2.2+h*.42,z-2.4); G.add(sl); }
    const jib=tri([0,3,7.5],[0,14,3.2],[0,3,11.5],red); G.add(jib); return G; };
  let junks=0;
  for(let i=Math.floor(300/STEP); i<n; i+=Math.floor((260+rnd()*380)/STEP)){ const S=I.S[i], base=Math.max(I.hi[i],0), kind=rnd();
    let up, B; if(kind<.5){ up=base+50+rnd()*320; B=sailboat(); } else if(kind<.9){ up=base+10+rnd()*40; B=motorboat(); } else if(junks<3){ up=base+150+rnd()*250; B=junk(); junks++; } else continue;
    const [x,z]=W2(i,S*up); if(near(x,z,up<60?12:35)) continue; B.position.set(x,0,z); B.rotation.y=rnd()*6.28; world.add(B); boats.push({g:B,ph:rnd()*6}); }
  for(let k=0;k<6;k++){ const a=rnd()*6.28, rr=(AR-260)*Math.sqrt(rnd()), B=k<4?sailboat():motorboat(); B.position.set(acx+Math.cos(a)*rr,0,acz+Math.sin(a)*rr); B.rotation.y=rnd()*6; world.add(B); boats.push({g:B,ph:rnd()*6}); }

  // ---------- Start und Ziel: Strandbar ----------
  const banner=(d,txt,bg)=>{ const i=Math.min(n-1,Math.round(d/STEP)), f=fr[i], y=Math.max(I.py[i],0), half=hw+0.8;
    for(const s of [-1,1]){ const p=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,6.2,7), lam('#b08a4e')); p.position.set(f.x+f.nx*half*s, y+3.0, f.z+f.nz*half*s); world.add(p); }
    const b=new THREE.Mesh(new THREE.PlaneGeometry(half*2+.4,1.3), new THREE.MeshBasicMaterial({map:canvasTex(512,96,g=>{ g.fillStyle=bg; g.fillRect(0,0,512,96); g.fillStyle='#fff'; g.font='800 52px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,256,50,490); }), side:THREE.DoubleSide}));
    b.position.set(f.x, y+5.4, f.z); b.rotation.y=Math.atan2(-Math.cos(f.hd), -Math.sin(f.hd)); world.add(b); return {f,i,y}; };
  banner(1,'START · INSELTOUR','#1c9fb0');
  const gi=Math.min(n-1,Math.round(R.goal/STEP)), gf=banner(R.goal,'ZIEL · STRANDBAR','#e0663a');
  { const cc2=canvasTex(16,128,g=>{ for(let i=0;i<16;i++) for(let j=0;j<2;j++){ g.fillStyle=(i+j)%2?'#111':'#fff'; g.fillRect(j*8,i*8,8,8); } });
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,ROAD_W), new THREE.MeshBasicMaterial({map:cc2})); fl.rotation.x=-Math.PI/2; fl.rotation.z=-gf.f.hd; fl.position.set(gf.f.x,I.py[gi]+.09,gf.f.z); world.add(fl); }
  { const S=I.S[gi], f=fr[gi], barU=Math.min(-16, I.hi[gi]-18), G=new THREE.Group(); const [bxp,bzp]=W2(gi,S*barU), by=Math.max(islTerr(I,gi,barU,bxp,bzp),0.3);
    G.position.set(bxp,by,bzp); G.rotation.y=-f.hd; world.add(G); const wood=lam('#8b5e34'), dark=lam('#4a3220'), straw=lam('#d1aa5f');
    const deck=new THREE.Mesh(new THREE.BoxGeometry(16,.4,11), wood); deck.position.y=.2; G.add(deck);
    for(const [x,z] of [[-6,-4],[6,-4],[-6,4],[6,4]]){ const p=new THREE.Mesh(new THREE.CylinderGeometry(.18,.2,4,7), dark); p.position.set(x,2.3,z); G.add(p); }
    const roof=new THREE.Mesh(new THREE.ConeGeometry(11,4.2,4), straw); roof.rotation.y=Math.PI/4; roof.scale.set(1,1,.75); roof.position.y=6.3; G.add(roof);
    const tp=S; // lokale z-Richtung zur Strecke hin
    const bar=new THREE.Mesh(new THREE.BoxGeometry(9,1.2,1.1), dark); bar.position.set(0,1,tp*2.5); G.add(bar);
    const ctr=new THREE.Mesh(new THREE.BoxGeometry(9.4,.12,1.5), lam('#d9b77c')); ctr.position.set(0,1.66,tp*2.5); G.add(ctr);
    for(let k=0;k<6;k++){ const st=new THREE.Mesh(new THREE.CylinderGeometry(.3,.25,.9,10), lam(['#e94f37','#2fb5c3','#f2c14e'][k%3])); st.position.set(-3.8+k*1.5,.85,tp*3.9); G.add(st); }
    for(let k=0;k<14;k++){ const bt=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.45,6), lam(['#2f8f4e','#c8452e','#f2c14e','#4e79c8'][k%4])); bt.position.set(-4+k*.6,1.95,tp*2.5); G.add(bt); }
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(6,1.4), new THREE.MeshBasicMaterial({map:canvasTex(512,120,g=>{ g.fillStyle='#2b6f6a'; g.fillRect(0,0,512,120); g.strokeStyle='#f3e3b0'; g.lineWidth=6; g.strokeRect(6,6,500,108); g.fillStyle='#f3e3b0'; g.font='800 72px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('STRANDBAR',256,64); }), side:THREE.DoubleSide}));
    sign.position.set(0,4.6,tp*5.6); sign.rotation.y=tp>0?0:Math.PI; G.add(sign);
    // Resort mit grünen Dächern dahinter
    for(let k=0;k<5;k++){ const up=barU-30-rnd()*45, al=(k-2)*24+(rnd()-.5)*8, R2=new THREE.Group(); const [x,z]=W2(Math.min(n-1,Math.max(0,gi+Math.round(al/STEP))),S*up);
      const hgt=4+rnd()*3, w=8+rnd()*6, dp=7+rnd()*4; const body=new THREE.Mesh(new THREE.BoxGeometry(w,hgt,dp), lam('#f4f2ec')); body.position.y=hgt/2; R2.add(body);
      const rf=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,dp)*.78,3,4), lam('#2f8a74')); rf.rotation.y=Math.PI/4; rf.scale.set(w/Math.max(w,dp),1,dp/Math.max(w,dp)); rf.position.y=hgt+1.5; R2.add(rf);
      R2.position.set(x,Math.max(1.2,islTerr(I,gi,up,x,z)),z); R2.rotation.y=-f.hd+(rnd()-.5)*.4; world.add(R2); }
    // Liegen und Schirme am Strand
    if(I.hi[gi]>12){ for(let k=0;k<10;k++){ const up=6+rnd()*(I.hi[gi]-10), al=(k-5)*7+(rnd()-.5)*3, ii=Math.min(n-1,Math.max(0,gi+Math.round(al/STEP))), [x,z]=W2(ii,S*up), y=islTerr(I,ii,up,x,z);
      const L=new THREE.Mesh(new THREE.BoxGeometry(.75,.25,2), lam('#f7f7f2')); L.position.set(x,y+.35,z); L.rotation.y=-fr[ii].hd+Math.PI/2; world.add(L);
      if(k%2===0){ const pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,2.6,5), lam('#ddd')); pole.position.set(x+.8,y+1.3,z); world.add(pole);
        const um=new THREE.Mesh(new THREE.ConeGeometry(1.5,.6,10), lam(['#2fb5c3','#f2c14e','#e94f37'][k%3])); um.position.set(x+.8,y+2.7,z); world.add(um); } } } }

  // Spritzwasser
  const NS=320, sp=new Float32Array(NS*3).fill(-50), spG=new THREE.BufferGeometry(); spG.setAttribute('position',new THREE.BufferAttribute(sp,3));
  const spray=new THREE.Points(spG, new THREE.PointsMaterial({color:'#ffffff', size:.6, map:canvasTex(32,32,g=>{ const gr=g.createRadialGradient(16,16,0,16,16,16); gr.addColorStop(0,'#fff'); gr.addColorStop(.5,'rgba(255,255,255,.9)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,32,32); }), transparent:true, opacity:.95, depthWrite:false})); spray.frustumCulled=false; world.add(spray);
  buildRiders();
  const wake=new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({map:canvasTex(64,128,g=>{ const gr=g.createRadialGradient(32,40,4,32,64,62); gr.addColorStop(0,'rgba(255,255,255,.95)'); gr.addColorStop(.45,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,128); }), transparent:true, depthWrite:false}));
  wake.rotation.x=-Math.PI/2; wake.visible=false; wake.renderOrder=3; world.add(wake);
  terrChunks.forEach(c=>{ c.far=3400; chunks.push(c); });
  anim.island={boats, wtex, wake, chunks, spray:{pts:spray, pos:sp, vel:new Float32Array(NS*3), life:new Float32Array(NS), next:0, acc:0}};
}
function poseIsland(dt,t){
  const A=anim.island; if(!A) return; A.wtex.offset.set(t*0.004, t*0.006);
  const cp=camera.position; A.chunks.forEach(c=>{ c.m.visible=Math.hypot(c.x-cp.x,c.z-cp.z)<c.far+c.r; }); // ferne Kacheln liegen ohnehin im Dunst
  A.boats.forEach(b=>{ b.g.position.y=Math.sin(t*1.1+b.ph)*.12; b.g.rotation.z=Math.sin(t*.9+b.ph)*.04; b.g.rotation.x=Math.sin(t*.7+b.ph*2)*.025; });
  const S=A.spray, I=R.I, i=Math.min(R.xs.length-1,Math.max(0,Math.round(((me.d>R.len?me.d-R.ring:me.d))/STEP)));
  const wet=I.py[i]<-0.05 && !race.paused && (!me.done||me.free) && me.v>0.8, mine=riders3d[myKey];
  A.wake.visible=!!(wet&&mine); if(A.wake.visible){ const hd=headingAt(R,me.d), p=mine.g.position; A.wake.position.set(p.x-Math.cos(hd)*.9,0.04,p.z-Math.sin(hd)*.9); A.wake.rotation.z=-hd-Math.PI/2; const L=2.4+me.v*.35; A.wake.scale.set(1.4+me.v*.08+Math.sin(t*9)*.08,L,1); }
  if(wet && mine){ S.acc+=dt*(40+me.v*18); const hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), p=mine.g.position;
    while(S.acc>=1){ S.acc-=1; const k=S.next; S.next=(S.next+1)%S.life.length; const back=Math.random()<.6?-0.55:0.55, side=(Math.random()-.5)*.5;
      S.pos.set([p.x+fx*back-fz*side, 0.02, p.z+fz*back+fx*side],k*3); S.vel.set([-fx*me.v*.3+(Math.random()-.5)*2.4, 1.5+Math.random()*2.2+me.v*.15, -fz*me.v*.3+(Math.random()-.5)*2.4],k*3); S.life[k]=.9; } }
  for(let k=0;k<S.life.length;k++){ if(S.life[k]<=0) continue; S.life[k]-=dt; S.vel[k*3+1]-=9.8*dt; S.pos[k*3]+=S.vel[k*3]*dt; S.pos[k*3+1]+=S.vel[k*3+1]*dt; S.pos[k*3+2]+=S.vel[k*3+2]*dt;
    if(S.life[k]<=0||S.pos[k*3+1]<0){ S.life[k]=0; S.pos[k*3+1]=-50; } }
  S.pts.geometry.attributes.position.needsUpdate=true;
}
function islandCanvas(cv2, def){ // Untergrund-Profil: Höhe = gleichwertige Steigung, Farbe = Untergrund
  const g=cv2.getContext('2d'), w=cv2.width, h=cv2.height; g.clearRect(0,0,w,h); g.fillStyle='#bfe9ef'; g.fillRect(0,0,w,h);
  const S=def.segs.filter(s=>s.p>=0), L=S.reduce((a,s)=>a+s.len,0)||1, sgOf=s=>s.sg??s.g, mx=Math.max(10,...S.map(sgOf)); let d=0;
  S.forEach(s=>{ const xa=d/L*w, xb=(d+s.len)/L*w+.6, hh=8+sgOf(s)/mx*(h-14); g.fillStyle=ISL_COL[islMode(sgOf(s))]; g.fillRect(xa,h-hh,xb-xa,hh); d+=s.len; }); }

let world=null; const TER={}; const anim={fans:null};

function hash2(x,z){ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); }
function vnoise(x,z){ const ix=Math.floor(x), iz=Math.floor(z), fx=x-ix, fz=z-iz, u=fx*fx*(3-2*fx), v=fz*fz*(3-2*fz);
  const a=hash2(ix,iz), b=hash2(ix+1,iz), c=hash2(ix,iz+1), d=hash2(ix+1,iz+1); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function terrainAt(x,z,arr){ const gx=(x-TER.x0)/TER.res, gz=(z-TER.z0)/TER.res;
  const i=Math.max(0,Math.min(TER.nx-2,Math.floor(gx))), j=Math.max(0,Math.min(TER.nz-2,Math.floor(gz))), fx=Math.min(1,Math.max(0,gx-i)), fz=Math.min(1,Math.max(0,gz-j)), h=arr||TER.h, n=TER.nx;
  const a=h[j*n+i], b=h[j*n+i+1], c=h[(j+1)*n+i], d=h[(j+1)*n+i+1]; return (a*(1-fx)+b*fx)*(1-fz)+(c*(1-fx)+d*fx)*fz; }
const roadY=d=>{ if(R.island){ if(d>R.len) d-=R.ring; const f=Math.max(0,Math.min(R.xs.length-1.001,d/STEP)), i=Math.floor(f); return R.I.py[i]+(R.I.py[i+1]-R.I.py[i])*(f-i); } // Insel: Höhe aus Strand/Wasser
  if(!R.space) return elevAt(d)-R.startElev; if(d<=0) return 0; if(d>=R.len) return R.vEnd; const s=segOf(d); return s.ve0+(d-s.d0)*s.vg/100; }; // Space: überhöhte Höhe nur fürs Bild
