/* ================= Kalmit: Überhöhung nur in deiner Nähe =================
   Bis KX.r1 m um dich herum wird alles KX.k-fach so steil gezeichnet, bis KX.r2 m geht es fließend in die echte Höhe über.
   Berge und Ebene in der Ferne bleiben echt. Physik, Trainer, Anzeigen und Höhenprofil nutzen immer die echte Steigung.
   Umgesetzt beim Zeichnen (Vertex-Shader): jeder Punkt wird abhängig vom Gelände unter ihm verschoben, Bäume und Häuser behalten ihre Form. */
const KX={k:2.5, r1:120, r2:450, on:false, uK:{value:0}, uC:{value:new THREE.Vector2()}, uRef:{value:0}, uHt:{value:null}, uG:{value:new THREE.Vector4()}, uN:{value:new THREE.Vector2(1,1)}};
function kxWt(dist){ const t=Math.min(1,Math.max(0,(dist-KX.r1)/(KX.r2-KX.r1))); return 1-t*t*(3-2*t); }
function visOff(x,z){ if(!KX.on) return 0; const w=kxWt(Math.hypot(x-KX.uC.value.x,z-KX.uC.value.y)); return w>0?(KX.k-1)*w*(terrainAt(x,z,TER.hr)-KX.uRef.value):0; }
const visRoadY=d=>{ const [x,z]=posAt(R,d); return roadY(d)+visOff(x,z); };
const KX_GLSL=`uniform float uKx; uniform vec2 uKc; uniform float uKref; uniform sampler2D uKht; uniform vec4 uKg; uniform vec2 uKn;
float kxH(vec2 p){ vec2 g=clamp((p-uKg.xy)/uKg.z,vec2(0.0),uKn-1.001); vec2 i=floor(g), f=g-i;
  float a=texture2D(uKht,(i+vec2(0.5,0.5))/uKn).r, b=texture2D(uKht,(i+vec2(1.5,0.5))/uKn).r, c=texture2D(uKht,(i+vec2(0.5,1.5))/uKn).r, d=texture2D(uKht,(i+vec2(1.5,1.5))/uKn).r;
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float kxOff(vec2 p){ if(uKx<=0.0) return 0.0; float t=clamp((distance(p,uKc)-${KX.r1.toFixed(1)})/${(KX.r2-KX.r1).toFixed(1)},0.0,1.0); float w=1.0-t*t*(3.0-2.0*t); if(w<=0.0) return 0.0; return uKx*w*(kxH(p)-uKref); }
`;
function kxPatch(mat){ if(mat.userData.kx) return; mat.userData.kx=1;
  mat.onBeforeCompile=sh=>{ Object.assign(sh.uniforms,{uKx:KX.uK,uKc:KX.uC,uKref:KX.uRef,uKht:KX.uHt,uKg:KX.uG,uKn:KX.uN});
    sh.vertexShader=KX_GLSL+sh.vertexShader.replace('#include <project_vertex>',`vec4 mvPosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
  mvPosition=instanceMatrix*mvPosition;
#endif
  vec4 kxWp=modelMatrix*mvPosition; kxWp.y+=kxOff(kxWp.xz); mvPosition=viewMatrix*kxWp; gl_Position=projectionMatrix*mvPosition;`)
      .replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
  worldPosition.y+=kxOff(worldPosition.xz);
#endif`); };
  mat.customProgramCacheKey=()=>'kx'; mat.needsUpdate=true; }
let kxDepth=null;
function kxSetup(){ KX.on=!!(R&&(R.kalmit||R.def.steil)); KX.uK.value=0; anim.kxSpr=[]; if(!KX.on) return;
  if(KX.uHt.value) KX.uHt.value.dispose(); const t=new THREE.DataTexture(TER.hr,TER.nx,TER.nz,THREE.RedFormat,THREE.FloatType); t.needsUpdate=true; KX.uHt.value=t;
  KX.uG.value.set(TER.x0,TER.z0,TER.res,0); KX.uN.value.set(TER.nx,TER.nz);
  if(!kxDepth){ kxDepth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking}); kxPatch(kxDepth); }
  const skip=new Set(Object.values(riders3d).filter(Boolean).map(r=>r.g)); // Fahrer werden direkt auf die gezeichnete Straße gesetzt
  const walk=o=>{ if(skip.has(o)) return;
    if(o.isSprite) anim.kxSpr.push({o,y:o.position.y});
    else if(o.isMesh||o.isPoints||o.isLine){ for(const m of [].concat(o.material)) kxPatch(m); if(o.castShadow) o.customDepthMaterial=kxDepth; }
    o.children.forEach(walk); };
  walk(world); }
function kxFrame(){ if(!KX.on) return; const [cx,cz]=posAt(R,me.d); KX.uC.value.set(cx,cz); KX.uRef.value=terrainAt(cx,cz,TER.hr); KX.uK.value=KX.k-1;
  anim.kxSpr.forEach(s=>s.o.position.y=s.y+visOff(s.o.position.x,s.o.position.z)); }
const lam=c=>new THREE.MeshLambertMaterial({color:c});

function textSprite(lines, {bg='#ffffff', fg='#1a1a1a', accent='#b5523b', w=3, border=true}={}){
  const tex=canvasTex(256, lines.length>1?160:96, (g,cw,ch)=>{ g.fillStyle=bg; g.fillRect(0,0,cw,ch); if(border){ g.strokeStyle='#1a1a1a'; g.lineWidth=8; g.strokeRect(4,4,cw-8,ch-8); }
    g.textAlign='center'; g.textBaseline='middle';
    lines.forEach((t,i)=>{ g.fillStyle=i?accent:fg; g.font=`800 ${lines.length>1?54:52}px "Barlow Condensed", Arial Narrow, sans-serif`; g.fillText(t,128,lines.length>1?(i?112:52):50); }); });
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, fog:true})); sp.scale.set(w, w*(lines.length>1?160:96)/256, 1); return sp;
}
function nameSprite(text,col){
  const tex=canvasTex(256,64,g=>{ g.font='700 40px Barlow, Arial, sans-serif'; const tw=Math.min(240,g.measureText(text).width+28);
    g.fillStyle=col; g.beginPath(); g.roundRect ? g.roundRect(128-tw/2,6,tw,52,14) : g.rect(128-tw/2,6,tw,52); g.fill();
    g.strokeStyle='rgba(255,255,255,.85)'; g.lineWidth=3; g.stroke();
    g.fillStyle='#fff'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,128,33); });
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, depthTest:false})); sp.scale.set(2.4,0.6,1); sp.renderOrder=10; return sp;
}
function gableGeo(w,d,h){ const FL=[-w/2,0,d/2],FR=[w/2,0,d/2],BL=[-w/2,0,-d/2],BR=[w/2,0,-d/2],RL=[-w/2,h,0],RR=[w/2,h,0];
  const tri=[FL,FR,RR, FL,RR,RL, BR,BL,RL, BR,RL,RR, BL,FL,RL, FR,BR,RR], p=new Float32Array(tri.length*3); tri.forEach((v,i)=>p.set(v,i*3));
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.computeVertexNormals(); return g; }

// Autos auf der B10: fahren auf ihrer Spur, am Ende tauchen sie am Anfang wieder auf · Lkw: Kabine wird zum hohen Aufbau
function poseAutos(dt){ const A=anim.autos; if(!A) return; const B=A.B, m=new THREE.Matrix4(), q=new THREE.Quaternion(), sc=new THREE.Vector3(), ps=new THREE.Vector3(), up=new THREE.Vector3(0,1,0), span=B.e1-B.e0;
  A.cars.forEach((o,i)=>{ o.t+=o.dir*o.v*dt; if(o.t>B.e1) o.t-=span; if(o.t<B.e0) o.t+=span;
    const x=B.ax+B.ux*o.t+A.px*o.ln, z=B.ay+B.uy*o.t+A.pz*o.ln, y=terrainAt(x,z)+.12; q.setFromAxisAngle(up,-Math.atan2(B.uy,B.ux)+(o.dir<0?Math.PI:0));
    const k=o.lkw?[2.4,1.6,1.4]:[1,1,1]; sc.set(k[0],k[1]*(o.lkw?1.2:1),k[2]); ps.set(x,y+.6*k[1],z); m.compose(ps,q,sc); A.body.setMatrixAt(i,m);
    const ox=o.lkw?-1.4:-.2; ps.set(x+Math.cos(-Math.atan2(B.uy,B.ux)+(o.dir<0?Math.PI:0))*ox, y+(o.lkw?2.6:1.3), z-Math.sin(-Math.atan2(B.uy,B.ux)+(o.dir<0?Math.PI:0))*ox); sc.set(o.lkw?2.6:1,o.lkw?4:1,o.lkw?1.6:1); m.compose(ps,q,sc); A.cab.setMatrixAt(i,m); });
  A.body.instanceMatrix.needsUpdate=true; A.cab.instanceMatrix.needsUpdate=true; }

function build3D(){
  if(world){ scene.remove(world); world.traverse(o=>{ o.geometry&&o.geometry.dispose&&o.geometry.dispose(); for(const mt of [].concat(o.material||[])){ mt.map&&mt.map.dispose&&mt.map.dispose(); mt.dispose&&mt.dispose(); } }); }
  hausReset();
  world=new THREE.Group(); scene.add(world);
  anim.stadium=null; anim.fans=null; anim.space=null; anim.island=null; anim.autos=null; KX.on=false; KX.uK.value=0; anim.kxSpr=[]; renderer.setPixelRatio(DPR); dayLights();
  const sp=!!R.space; sky.visible=!sp; spaceSky.visible=sp; streaks.m.visible=false; scene.background.set(sp?SPACE_BG:HORIZON); scene.fog.color.set(sp?SPACE_BG:HORIZON);
  if(sp){ buildSpace(); return; }
  if(R.island){ buildIsland(); return; }
  if(R.stadium){ scene.fog.near=250; scene.fog.far=2200; buildStadium(); return; }
  scene.fog.near=140; scene.fog.far=1500; camera.far=R.def.haardt?13000:6000; camera.updateProjectionMatrix();
  const S=R.S, plainY=(R.def.plainElev ?? (R.startElev-60))-R.startElev;

  // ---------- Gelände ----------
  let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9; for(let i=0;i<R.xs.length;i++){ x0=Math.min(x0,R.xs[i]); z0=Math.min(z0,R.ys[i]); x1=Math.max(x1,R.xs[i]); z1=Math.max(z1,R.ys[i]); }
  const pad=520, res=Math.max(5, Math.sqrt((x1-x0+2*pad)*(z1-z0+2*pad)/280000));
  Object.assign(TER,{x0:x0-pad, z0:z0-pad, res, nx:Math.ceil((x1-x0+2*pad)/res)+1, nz:Math.ceil((z1-z0+2*pad)/res)+1});
  const n=TER.nx, N=TER.nx*TER.nz, h=new Float32Array(N), dist=new Float32Array(N).fill(1e9), src=new Int32Array(N).fill(-1), q=new Int32Array(N); let qh=0,qt=0;
  for(let i=0;i<R.xs.length;i++){ const gi=Math.round((R.xs[i]-TER.x0)/res), gj=Math.round((R.ys[i]-TER.z0)/res), k=gj*n+gi; if(dist[k]>0){ dist[k]=0; src[k]=i; q[qt++]=k; } }
  while(qh<qt){ const k=q[qh++], i=k%n, j=(k/n)|0; for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){ const a=i+di, b=j+dj; if(a<0||b<0||a>=n||b>=TER.nz) continue; const kk=b*n+a;
      if(src[kk]<0){ src[kk]=src[k]; dist[kk]=Math.hypot(a*res+TER.x0-R.xs[src[k]], b*res+TER.z0-R.ys[src[k]]); q[qt++]=kk; } } }
  for(let k=0;k<N;k++){ const s=src[k], i=k%n, j=(k/n)|0, x=i*res+TER.x0, z=j*res+TER.z0, d=s*STEP, hd=headingAt(R,d);
    const side=Math.sign(Math.cos(hd)*(z-R.ys[s])-Math.sin(hd)*(x-R.xs[s]))||1, dd=dist[k], far=Math.min(1,Math.max(0,(dd-16)/110));
    let v=roadY(d) + far*(side*Math.min(45,(dd-16)*0.22) + (vnoise(x/90,z/90)-.5)*40 + (vnoise(x/25,z/25)-.5)*8) - 0.45;
    const edge=Math.min(i,j,n-1-i,TER.nz-1-j)*res, ef=Math.min(1,Math.max(0,(edge-20)/260)), e2=ef*ef*(3-2*ef);
    h[k]=plainY+(v-plainY)*e2;
    if(R.b10l){ const bd=R.b10Dist(x,z); if(bd<75) h[k]+=(roadY(d)-.45-h[k])*Math.min(1,(75-bd)/45); } } // B10 liegt eben
  const tmp=new Float32Array(N);
  for(let pass=0;pass<12;pass++){ tmp.set(h); for(let j=1;j<TER.nz-1;j++) for(let i=1;i<n-1;i++){ const k=j*n+i; if(dist[k]<12) continue;
      h[k]=(tmp[k]*2+tmp[k-1]+tmp[k+1]+tmp[k-n]+tmp[k+n])/6; } }
  for(let k=0;k<N;k++) if(dist[k]<12) h[k]=roadY(src[k]*STEP)-0.6;
  // Höhe der nächstgelegenen Straßenstelle je Geländepunkt (geglättet) – danach richtet sich die Überhöhung, damit die Straße quer nicht kippt
  { const hr=new Float32Array(N), tq=new Float32Array(N); for(let k=0;k<N;k++) hr[k]=roadY(src[k]*STEP);
    for(let pass=0;pass<14;pass++){ tq.set(hr); for(let j=1;j<TER.nz-1;j++) for(let i=1;i<n-1;i++){ const k=j*n+i; hr[k]=(tq[k]*4+tq[k-1]+tq[k+1]+tq[k-n]+tq[k+n])/8; } }
    TER.hr=hr; }

  TER.h=h;
  const pos=new Float32Array(N*3), col=new Float32Array(N*3), idx=[];
  const C=s=>new THREE.Color(s), cForest=C('#355a2c'), cForest2=C('#4a6a33'), cNeedles=C('#6b5a38'), cVerge=C('#8a9a4e'), cSand=C('#9a8160'), cVine=C('#8f9a52'), cTown=C('#9aa77a'), cRock=C('#9b7f6c'), cPlain=C('#b9b36a'), cAcker=[C('#c2ad6a'),C('#7f9a45'),C('#8e6f50')], tc=new THREE.Color();
  for(let k=0;k<N;k++){ const i=k%n, j=(k/n)|0, x=i*res+TER.x0, z=j*res+TER.z0; pos[k*3]=x; pos[k*3+1]=h[k]; pos[k*3+2]=z;
    const d=src[k]*STEP; tc.copy(cForest).lerp(cForest2, vnoise(x/40,z/40)); tc.lerp(cNeedles, Math.max(0,vnoise(x/18,z/18)-.45)*1.2);
    const zt=zoneAt(R,d);
    if(zt!=='wald' && zt!=='hain' && dist[k]<160) tc.copy(cVine).lerp(cForest, Math.max(0,(dist[k]-90)/70));
    if(zt==='feld' && dist[k]<200){ const p=parzAt(R,d); if(p&&p[2]) tc.copy(cAcker[p[2]-1]).lerp(cPlain, vnoise(x/9,z/9)*.25); }
    if(zt==='ort' && dist[k]<120) tc.copy(cTown);
    if(dist[k]<16) tc.lerp(zt!=='ort'&&zoneAt(R,d+200)==='wald' ? cSand : cVerge, 1-dist[k]/16);
    if(vnoise(x/14,z/14)>.86 && dist[k]>20) tc.lerp(cRock,.6);
    if(h[k]<plainY+6) tc.lerp(cPlain, Math.min(1,(plainY+6-h[k])/6));
    col[k*3]=tc.r; col[k*3+1]=tc.g; col[k*3+2]=tc.b; }
  for(let j=0;j<TER.nz-1;j++) for(let i=0;i<n-1;i++){ const a=j*n+i; idx.push(a,a+n,a+1, a+1,a+n,a+n+1); }
  const tg=new THREE.BufferGeometry(); tg.setAttribute('position',new THREE.BufferAttribute(pos,3)); tg.setAttribute('color',new THREE.BufferAttribute(col,3));
  tg.setIndex(idx); tg.computeVertexNormals();
  world.add(new THREE.Mesh(tg, new THREE.MeshLambertMaterial({vertexColors:true})));

  // Weite Ebene (Rheinebene) rundherum, Felder als Flickenteppich
  { const pt=canvasTex(512,512,g=>{ const pal=['#c7b660','#a9b45a','#d6c071','#8fa24c','#b89a52','#9bae63','#cfc584'];
      for(let y=0;y<512;y+=32) for(let x=0;x<512;){ const w=24+Math.random()*60; g.fillStyle=pal[Math.floor(Math.random()*pal.length)]; g.fillRect(x,y,w,32); x+=w; }
      g.fillStyle='rgba(60,80,40,.5)'; for(let i=0;i<120;i++){ g.beginPath(); g.arc(Math.random()*512,Math.random()*512,2+Math.random()*4,0,7); g.fill(); } });
    pt.wrapS=pt.wrapT=THREE.RepeatWrapping; pt.repeat.set(14,14);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(14000,14000), new THREE.MeshLambertMaterial({map:pt}));
    pl.rotation.x=-Math.PI/2; pl.position.set((x0+x1)/2, plainY-0.5, (z0+z1)/2); world.add(pl); }
  if(R.def.haardt) buildHaardt(plainY);

  // ---------- Straße ----------
  const rtex=canvasTex(64,256,g=>{ g.fillStyle='#55575a'; g.fillRect(0,0,64,256); for(let t=0;t<600;t++){ const v=Math.random()<.5?0:255; g.fillStyle=`rgba(${v},${v},${v},.06)`; g.fillRect(Math.random()*64,Math.random()*256,2,2); }
    g.fillStyle='#ecebe4'; g.fillRect(3,0,3,256); g.fillRect(58,0,3,256); });
  rtex.wrapT=THREE.RepeatWrapping; rtex.anisotropy=8;
  const strip=(d0,d1,inner,outer,lift,mat,uvLen,sides=[-1,1])=>{ for(const s of sides){ const i0=Math.max(0,Math.floor(d0/STEP)), i1=Math.min(R.xs.length-1,Math.ceil(d1/STEP)), m=i1-i0+1;
      if(m<2) continue; const p=new Float32Array(m*6), uv=new Float32Array(m*4), id=[];
      for(let q2=0;q2<m;q2++){ const i=i0+q2, d=i*STEP, hd=headingAt(R,d), nx=-Math.sin(hd), nz=Math.cos(hd), y=roadY(d)+lift, a=s*(inner.call?inner(d):inner), b=s*(outer.call?outer(d):outer);
        p.set([R.xs[i]+nx*a,y,R.ys[i]+nz*a, R.xs[i]+nx*b,y,R.ys[i]+nz*b], q2*6); uv.set([0,d/uvLen,1,d/uvLen], q2*4);
        if(q2<m-1) id.push(q2*2,q2*2+1,q2*2+2, q2*2+1,q2*2+3,q2*2+2); }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setAttribute('uv',new THREE.BufferAttribute(uv,2)); geo.setIndex(id); geo.computeVertexNormals();
      world.add(new THREE.Mesh(geo,mat)); } };
  const side2=(mat)=>(mat.side=THREE.DoubleSide, mat.polygonOffset=true, mat);
  const rw=d=>roadW(R,d)/2;
  strip(0,R.len,d=>-(rw(d)+0.9),d=>rw(d)+0.9,0.05,side2(Object.assign(lam('#8f8573'),{polygonOffsetFactor:-1})),10,[1]);
  const asph=side2(Object.assign(new THREE.MeshLambertMaterial({map:rtex}),{polygonOffsetFactor:-2}));
  let d0=0; for(const [t,a,b] of [...R.belag].sort((x,y)=>x[1]-y[1])){ strip(d0,a,d=>-rw(d),rw,0.12,asph,9,[1]); d0=Math.min(b,R.len);
    const tx=t==='pflaster'?canvasTex(128,64,g=>{ g.fillStyle='#6e6a64'; g.fillRect(0,0,128,64); for(let y=0;y<64;y+=8) for(let x=(y/8%2)*5-5;x<128;x+=10){ const v=95+Math.random()*45|0; g.fillStyle=`rgb(${v},${v-4},${v-10})`; g.fillRect(x+1,y+1,8,6); } })
      : canvasTex(64,128,g=>{ g.fillStyle='#b8b6ac'; g.fillRect(0,0,64,128); for(let t2=0;t2<400;t2++){ const v=Math.random()<.5?60:255; g.fillStyle=`rgba(${v},${v},${v},.07)`; g.fillRect(Math.random()*64,Math.random()*128,2,2); }
          g.fillStyle='#6f6d66'; g.fillRect(0,0,64,3); g.fillStyle='rgba(0,0,0,.1)'; g.fillRect(31,0,2,128); });
    tx.wrapT=THREE.RepeatWrapping; tx.anisotropy=8;
    strip(a,d0,d=>-rw(d),rw,0.12,side2(Object.assign(new THREE.MeshLambertMaterial({map:tx}),{polygonOffsetFactor:-2})),t==='pflaster'?1.6:3.5,[1]); }
  strip(d0,R.len,d=>-rw(d),rw,0.12,asph,9,[1]);
  // Landstraße: Leitlinie in der Mitte (6 m Strich, 12 m Lücke) · Radweg neben der Straße, hinter einem Grünstreifen
  if(R.def.mitte){ const dt=canvasTex(8,48,g=>{ g.fillStyle='#ecebe4'; g.fillRect(0,0,8,16); }); dt.wrapT=THREE.RepeatWrapping;
    const dm=side2(Object.assign(new THREE.MeshLambertMaterial({map:dt, transparent:true, alphaTest:.5}),{polygonOffsetFactor:-3}));
    for(const [a,b] of R.def.mitte) strip(a,b,-.07,.07,.125,dm,18,[1]); }
  for(const [a,b,sd] of R.def.radweg||[]){ const i0=Math.max(0,Math.floor(a/STEP)), i1=Math.min(R.xs.length-1,Math.ceil(b/STEP)), m=i1-i0+1, p=new Float32Array(m*6), id=[];
    for(let k=0;k<m;k++){ const i=i0+k, d=i*STEP, hd=headingAt(R,d), nx=-Math.sin(hd)*sd, nz=Math.cos(hd)*sd;
      [rw(d)+2.6, rw(d)+5].forEach((o,j)=>{ const x=R.xs[i]+nx*o, z=R.ys[i]+nz*o; p.set([x,terrainAt(x,z)+.08,z],k*6+j*3); }); if(k<m-1) id.push(k*2,k*2+1,k*2+2, k*2+1,k*2+3,k*2+2); }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setIndex(id); geo.computeVertexNormals(); world.add(new THREE.Mesh(geo,side2(Object.assign(lam('#6a6b6c'),{polygonOffsetFactor:-2})))); }
  const stY=(al,x,z)=>{ const t=Math.min(1,Math.max(0,(al-15)/20)), k=t*t*(3-2*t); return (terrainAt(x,z,TER.hr)+.13)*(1-k)+(terrainAt(x,z)+.06)*k; }; // Höhe der Stichstraße
  const orte=R.zones.filter(z=>z[0]==='ort');
  if(orte.length){ const pav=canvasTex(64,64,g=>{ g.fillStyle='#9d6b5a'; g.fillRect(0,0,64,64); g.strokeStyle='rgba(50,25,18,.35)'; g.lineWidth=1.5;
      for(let y=0;y<64;y+=8){ g.beginPath(); g.moveTo(0,y); g.lineTo(64,y); g.stroke(); for(let x=(y/8%2)*8;x<64;x+=16){ g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+8); g.stroke(); } } });
    pav.wrapT=THREE.RepeatWrapping;
    const pavM=side2(Object.assign(new THREE.MeshLambertMaterial({map:pav}),{polygonOffsetFactor:-3})), curbM=side2(lam('#d8d4ca')), cut=(s,d)=>R.gehCut&&R.gehCut.some(c=>c[0]===s&&d>=c[1]&&d<=c[2]); // an Einmündungen kein Gehweg
    for(const [,za,zb,zo={}] of orte){ const geh=zo.geh??SIDEWALK, sd=zo.seite?[zo.seite]:[-1,1];
      for(const s of sd){ strip(za,Math.min(zb,R.len),rw,d=>rw(d)+(cut(s,d)?0:geh),0.22,pavM,3,[s]);
        strip(za,Math.min(zb,R.len),d=>rw(d)-0.05,d=>cut(s,d)?rw(d)-0.05:rw(d)+0.2,0.26,curbM,3,[s]); } }
    // Stichstraßen an den Einmündungen: Asphalt, Gehwege, Bordsteine; nahe der Hauptstraße auf deren Höhe, weiter weg aufs Gelände
    for(const K of R.stich){ const at=(al,la)=>[K.x+K.ux*al+K.vx*la, K.y+K.uy*al+K.vy*la];
      const band=(la0,la1,a0,lift,mat)=>{ const as=[]; for(let al=a0;al<K.len;al+=al<30?1:2.5) as.push(al); as.push(K.len); const p=new Float32Array(as.length*6), id=[];
        as.forEach((al,i)=>{ [la0,la1].forEach((la,j)=>{ const [x,z]=at(al,la); p.set([x,stY(al,x,z)+lift,z],i*6+j*3); }); if(i<as.length-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); });
        const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setIndex(id); geo.computeVertexNormals(); world.add(new THREE.Mesh(geo,mat)); };
      band(-K.w/2,K.w/2,-3,0,side2(Object.assign(lam('#55575a'),{polygonOffsetFactor:-4})));
      for(const s of [-1,1]){ const a0=K.al0[s]; band(s*K.w/2,s*(K.w/2+K.geh),a0,.09,pavM); band(s*(K.w/2-.05),s*(K.w/2+.2),a0,.13,curbM); } } }
  // Weiterführende Landstraße an einer Abzweigung: Rand- und Leitlinie, nahe der Strecke auf deren Höhe (unter ihrem Belag), weiter weg aufs Gelände
  for(const K of R.weiter||[]){ const vx=-K.uy, vy=K.ux, as=[]; for(let al=-4; al<K.len; al+=al<30?1:3) as.push(al); as.push(K.len);
    const lt=canvasTex(64,64,g=>{ g.fillStyle='#55575a'; g.fillRect(0,0,64,64); for(let t=0;t<300;t++){ const v=Math.random()<.5?0:255; g.fillStyle=`rgba(${v},${v},${v},.06)`; g.fillRect(Math.random()*64,Math.random()*64,2,2); }
      g.fillStyle='#ecebe4'; g.fillRect(3,0,3,64); g.fillRect(58,0,3,64); g.fillRect(31,0,2,21); }); lt.wrapT=THREE.RepeatWrapping; lt.anisotropy=8;
    const p=new Float32Array(as.length*6), uv=new Float32Array(as.length*4), id=[];
    as.forEach((al,i)=>{ [-1,1].forEach((q,j)=>{ const x=K.x+K.ux*al+vx*q*K.w/2, z=K.y+K.uy*al+vy*q*K.w/2; p.set([x,stY(Math.max(0,al),x,z)-(al<10?.04:0),z],i*6+j*3); uv.set([j,al/18],i*4+j*2); });
      if(i<as.length-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setAttribute('uv',new THREE.BufferAttribute(uv,2)); geo.setIndex(id); geo.computeVertexNormals();
    world.add(new THREE.Mesh(geo,side2(Object.assign(new THREE.MeshLambertMaterial({map:lt}),{polygonOffsetFactor:-1})))); }
  // Seitenstraße: quer weg vom Straßenrand, am Anfang auf Gehweghöhe, dann aufs Gelände
  const abY=(u,x,z,d)=>{ const A=R.abzweig, t=Math.min(1,Math.max(0,(u-A.geh-1)/12)), k=t*t*(3-2*t); return (roadY(d??A.d)+.29)*(1-k)+(terrainAt(x,z)+.06)*k; };
  if(R.abzweig){ const A=R.abzweig, [x0,z0]=posAt(R,A.d), hd=headingAt(R,A.d), nx=-Math.sin(hd)*A.side, nz=Math.cos(hd)*A.side, ax=Math.cos(hd), az=Math.sin(hd), r0=rw(A.d);
    const band=(a0,a1,lift,mat)=>{ const us=[]; for(let u=-.05;u<A.len;u+=u<A.geh+14?1:3) us.push(u); const p=new Float32Array(us.length*6), id=[];
      us.forEach((u,i)=>{ [a0,a1].forEach((a,j)=>{ const x=x0+nx*(r0+u)+ax*a, z=z0+nz*(r0+u)+az*a; p.set([x,abY(u,x,z)+lift,z],i*6+j*3); }); if(i<us.length-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); });
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setIndex(id); geo.computeVertexNormals(); world.add(new THREE.Mesh(geo,mat)); };
    band(-A.w/2,A.w/2,0,side2(Object.assign(lam('#55575a'),{polygonOffsetFactor:-4})));
    for(const s of [-1,1]) band(s*A.w/2,s*(A.w/2+.25),.03,side2(Object.assign(lam('#d8d4ca'),{polygonOffsetFactor:-4}))); }

  // ---------- Instanzen-Helfer ----------
  const m4=new THREE.Matrix4(), qq=new THREE.Quaternion(), sc=new THREE.Vector3(), ps=new THREE.Vector3(), cc=new THREE.Color(), up=new THREE.Vector3(0,1,0), eu=new THREE.Euler();
  const inst=(geo,mat,list,fn)=>{ if(!list.length) return null; const im=new THREE.InstancedMesh(geo,mat,list.length);
    list.forEach((o,i)=>{ cc.set('#ffffff'); fn(o,i); m4.compose(ps,qq,sc); im.setMatrixAt(i,m4); im.setColorAt(i,cc); });
    im.instanceMatrix.needsUpdate=true; if(im.instanceColor) im.instanceColor.needsUpdate=true; world.add(im); return im; };

  // Bäume: Kiefern mit hohen, rötlichen Stämmen, dazwischen Laubbäume
  const pines=S.tree.filter(o=>o.pine), leafy=S.tree.filter(o=>!o.pine);
  inst(new THREE.CylinderGeometry(.16,.3,1,6), lam('#fff'), pines, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.ht/2,o.y); qq.identity(); sc.set(1+o.s*.05,o.ht,1+o.s*.05); cc.set(o.c<.5?'#a0583a':'#8f5136'); });
  inst(new THREE.IcosahedronGeometry(1,1), lam('#fff'), pines, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.ht+o.s*.2,o.y); qq.setFromAxisAngle(up,o.c*6); sc.set(o.s*1.05,o.s*.55,o.s*.95); cc.set(o.c<.33?'#2c4a28':o.c<.66?'#36552d':'#2f4d32'); });
  inst(new THREE.IcosahedronGeometry(1,1), lam('#fff'), pines.filter(o=>o.c>.35), o=>{ ps.set(o.x+o.s*.5,terrainAt(o.x,o.y)+o.ht-o.s*.55,o.y-o.s*.3); qq.setFromAxisAngle(up,o.c*9); sc.set(o.s*.7,o.s*.4,o.s*.65); cc.set('#3a5a30'); });
  inst(new THREE.CylinderGeometry(.18,.25,1,5), lam('#5b4636'), leafy, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+1,o.y); qq.identity(); sc.set(1,2,1); cc.set('#5b4636'); });
  inst(new THREE.IcosahedronGeometry(1,1), lam('#fff'), leafy, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.s*1.1+1.4,o.y); qq.setFromAxisAngle(up,o.c*6); sc.set(o.s,o.s*1.15,o.s); cc.set(o.c<.33?'#4a7a3a':o.c<.66?'#5a8a45':'#6b9a4c'); });
  inst(new THREE.IcosahedronGeometry(1,1), lam('#fff'), leafy.filter(o=>!o.fruit), o=>{ ps.set(o.x+o.s*.45,terrainAt(o.x,o.y)+o.s*1.6+1.4,o.y-o.s*.3); qq.setFromAxisAngle(up,o.c*4); sc.set(o.s*.7,o.s*.75,o.s*.7); cc.set(o.c<.5?'#6e9e4f':'#7aa957'); });
  inst(new THREE.IcosahedronGeometry(1,1), lam('#fff'), leafy.filter(o=>!o.fruit), o=>{ ps.set(o.x-o.s*.4,terrainAt(o.x,o.y)+o.s*.8+1.4,o.y+o.s*.35); qq.setFromAxisAngle(up,o.c*7); sc.set(o.s*.65,o.s*.6,o.s*.65); cc.set(o.c<.5?'#3f6e33':'#4a7a3a'); });
  inst(new THREE.DodecahedronGeometry(1,0), lam('#fff'), S.rock, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.s*.3,o.y); qq.setFromAxisAngle(up,o.rot); sc.set(o.s,o.s*.7,o.s*.9); cc.set(o.rot<3?'#ad8c78':'#9c7b69'); });
  inst(new THREE.IcosahedronGeometry(1,S.vine.length>40000?0:1), lam('#fff'), S.vine, // lange Weinstrecken: gröber, sonst zu viele Dreiecke
    o=>{ ps.set(o.x,terrainAt(o.x,o.y)+.85,o.y); qq.setFromAxisAngle(up,-o.rot); sc.set(1.55,.6,.42); cc.set(o.c<.55?'#5f8a34':o.c<.85?'#749838':'#a89838'); });
  inst(new THREE.BoxGeometry(1,.12,1), lam('#fff'), S.weg, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+.03,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(3,1,3.3); cc.set('#c9bc98'); });
  inst(new THREE.IcosahedronGeometry(1,0), lam('#fff'), S.bush, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.s*(o.tree?2.4:.7),o.y); qq.setFromAxisAngle(up,o.c*6); const k=o.tree?2.2:1; sc.set(o.s*k,o.s*.9*k,o.s*k); cc.set(o.c<.4?'#3f6b32':o.c<.75?'#4d7a3a':'#5d8a45'); });
  inst(new THREE.CylinderGeometry(.045,.05,1.5,5), lam('#6b5a48'), S.vpost, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+.7,o.y); qq.identity(); sc.set(1,1,1); cc.set('#6b5a48'); });
  inst(new THREE.IcosahedronGeometry(.5,0), lam('#fff'), S.grass, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.s*.12,o.y); qq.setFromAxisAngle(up,o.r); sc.set(o.s*1.3,o.s*.55,o.s*1.1); cc.set(o.wood?(o.c<.5?'#4f6a34':o.c<.8?'#5d7a3c':'#7a7046'):(o.c<.4?'#7f9a45':o.c<.8?'#94a852':'#b8b067')); });
  inst(new THREE.BoxGeometry(1,1,1), lam('#fff'), S.block, o=>{ ps.set(o.x,roadY(0)+0,o.y); ps.y=terrainAt(o.x,o.y)+.32*o.s; qq.setFromAxisAngle(up,-o.h); sc.set(1.3*o.s,.62*o.s,.62*o.s); cc.set(o.s<1?'#b5866b':'#a5785f'); });
  inst(new THREE.BoxGeometry(.11,1,.11), lam('#fff'), S.post, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+.5,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(1,1,1); cc.set('#f2f2ee'); });
  inst(new THREE.BoxGeometry(.115,.2,.115), lam('#fff'), S.post, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+.82,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(1,1,1); cc.set('#111'); });

  // Leitplanken an den Kehren, auf der Talseite
  const rails=[], rposts=[];
  const railAt=new Uint8Array(Math.ceil(R.len/2)+1);
  for(const [a,b,bs] of R.def.planke||[]) for(let d=a; d<Math.min(b,R.len); d+=2) railAt[d/2|0]=bs===2?2:1;
  R.kehren.forEach(kd=>{ for(let d=Math.max(0,kd-70); d<Math.min(R.fans,kd+70); d+=2) if(zoneAt(R,d)!=='ort') railAt[d/2|0]=1; });
  if(R.kalmit){ const rr=rng(17); let on=0; for(let d=Math.max(...R.zones.filter(z=>z[0]==='reben').map(z=>z[2]))-120; d<R.len-330; d+=2){ const [x,z]=posAt(R,d), hd=headingAt(R,d), nx=-Math.sin(hd), nz=Math.cos(hd);
      const drop=Math.abs(terrainAt(x+nx*16,z+nz*16)-terrainAt(x-nx*16,z-nz*16)); if(on<=0 && drop>2.5 && rr()<.12) on=80+rr()*260; if(on>0){ railAt[d/2|0]=1; on-=2; } } }
  for(let i=0;i<railAt.length;i++){ if(!railAt[i]) continue; const d=i*2, [x,z]=posAt(R,d), hd=headingAt(R,d), nx=-Math.sin(hd), nz=Math.cos(hd);
    const off=rw(d)+1.0; for(const s of railAt[i]===2?[-1,1]:[terrainAt(x+nx*14,z+nz*14)<terrainAt(x-nx*14,z-nz*14)?1:-1]){ // 2 = beide Seiten, sonst Talseite
      rails.push({x:x+nx*s*off, z:z+nz*s*off, y:roadY(d), h:hd, g:gradeAt(d)}); if(d%4===0) rposts.push({x:x+nx*s*(off+.12), z:z+nz*s*(off+.12), y:roadY(d), h:hd}); } }
  const slopeQ=(h,g,flip)=>qq.setFromEuler(eu.set(0,-h+(flip?Math.PI:0),Math.atan(g/100)*(flip?-1:1),'YXZ'));
  inst(new THREE.BoxGeometry(2.1,.32,.06), lam('#c9ced3'), rails, o=>{ ps.set(o.x,o.y+.62,o.z); slopeQ(o.h,o.g); sc.set(1,1,1); cc.set('#c9ced3'); });
  inst(new THREE.BoxGeometry(.09,.8,.09), lam('#8d949b'), rposts, o=>{ ps.set(o.x,o.y+.4,o.z); qq.setFromAxisAngle(up,-o.h); sc.set(1,1,1); cc.set('#8d949b'); });

  // ---------- Dorf ----------
  const zurStr=o=>Math.atan2(-Math.sin(o.h)*-o.side, Math.cos(o.h)*-o.side); // Front (+z) zur Straße
  S.house.forEach(o=>{ const grp=haus(o); grp.rotation.y=zurStr(o); grp.position.set(o.x,o.su!=null?stY(o.su,o.x,o.y)+.02:roadY(o.d)+0.15,o.y); world.add(grp); });
  S.tor.forEach(o=>{ const t=hoftor(o); t.rotation.y=zurStr(o); t.position.set(o.x,roadY(o.d)+.15+.8,o.y); world.add(t); });
  // Neubau: Hecken, Klinker- und Betonmauern an der Grundstücksgrenze, Koniferen in den Gärten
  inst(new THREE.IcosahedronGeometry(1,1), lam('#fff'), S.ranke, o=>{ ps.set(o.x,roadY(o.d)+.15+o.hg*.55,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(o.w/2,o.hg/2,.3); cc.set(o.c<.4?'#4f7d35':o.c<.8?'#5e8a3c':'#7a9a3e'); }); // Weinranken an den Fassaden
  for(const [typ,b,t,hh,col] of [['hecke',.8,.9,1.9,'#4a7438'],['klinker',.3,.5,1.5,'#7b3f33'],['beton',.28,.4,1.1,'#bdb8ac'],['sandstein',.4,.5,1.6,'#a8654f']])
    inst(new THREE.BoxGeometry(1,1,1), lam('#fff'), S.zaun.filter(o=>o.typ===typ), o=>{ ps.set(o.x,roadY(o.d)+.29-t+hh/2,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(o.len,hh,b); cc.set(col); if(typ==='hecke') cc.offsetHSL(0,0,(o.c-.5)*.08); });
  inst(new THREE.ConeGeometry(1,1,7), lam('#fff'), S.konif, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.s*1.4,o.y); qq.setFromAxisAngle(up,o.c*6); sc.set(o.s*.55,o.s*3,o.s*.55); cc.set(o.c<.5?'#2f4d2c':'#3a5a34'); });
  const lampM=lampGlowMat();
  S.lamp.forEach(o=>{ const y=roadY(0)+0, gY=terrainAt(o.x,o.y)+0.85, p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,4.6,6), lam('#3b3f45')); p.position.set(o.x,gY+2.3,o.y); world.add(p);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.35,.3,.35), lam('#2f3338')); const nx=-Math.sin(o.h)*-o.side*.6, nz=Math.cos(o.h)*-o.side*.6; head.position.set(o.x+nx,gY+4.5,o.y+nz); world.add(head);
    const pl=new THREE.Mesh(new THREE.BoxGeometry(.3,.04,.3), lampM); pl.position.set(o.x+nx,gY+4.34,o.y+nz); world.add(pl); });
  hausLicht();

  // ---------- B10 (vierspurig, Grünstreifen in der Mitte) mit fahrenden Autos · Gewerbehallen ----------
  anim.autos=null;
  if(R.b10l){ const B=R.b10l, px=-B.uy, pz=B.ux, hw=11, ts=[]; for(let t=B.e0; t<B.e1; t+=10) ts.push(t); ts.push(B.e1);
    const bt=canvasTex(128,64,g=>{ g.fillStyle='#5a5c5f'; g.fillRect(0,0,128,64); for(let i=0;i<500;i++){ const v=Math.random()<.5?0:255; g.fillStyle=`rgba(${v},${v},${v},.06)`; g.fillRect(Math.random()*128,Math.random()*64,1.5,1.5); }
      g.fillStyle='#5d7a3e'; g.fillRect(56,0,16,64); g.fillStyle='#9aa0a6'; g.fillRect(63,0,2,64); g.fillStyle='#ecebe4'; [2,53,73,124].forEach(x=>g.fillRect(x,0,2,64)); [27,99].forEach(x=>g.fillRect(x,0,2,22)); });
    bt.wrapT=THREE.RepeatWrapping; bt.anisotropy=8; const p=new Float32Array(ts.length*6), uv=new Float32Array(ts.length*4), id=[];
    ts.forEach((t,i)=>{ [-1,1].forEach((q,j)=>{ const x=B.ax+B.ux*t+px*q*hw, z=B.ay+B.uy*t+pz*q*hw; p.set([x,terrainAt(x,z)+.12,z],i*6+j*3); uv.set([j,t/12],i*4+j*2); }); if(i<ts.length-1) id.push(i*2,i*2+2,i*2+1, i*2+1,i*2+2,i*2+3); });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setAttribute('uv',new THREE.BufferAttribute(uv,2)); geo.setIndex(id); geo.computeVertexNormals();
    world.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:bt, side:THREE.DoubleSide})));
    const rr=rng(10), FARB=['#e8e8e8','#1c1d20','#7d8288','#2b3f6b','#9a1f1f','#c9ccd0','#3a3d42','#f2f2f2'], cars=[];
    for(let i=0;i<20;i++){ const ln=[3.25,6.75,-3.25,-6.75][i%4]; cars.push({ln, dir:ln>0?1:-1, t:B.e0+rr()*(B.e1-B.e0), v:(Math.abs(ln)<5?27:22)+rr()*7, lkw:Math.abs(ln)>5&&rr()<.35, c:FARB[rr()*FARB.length|0]}); }
    const mk=(gw,gh,gd,auf)=>{ const im=new THREE.InstancedMesh(new THREE.BoxGeometry(gw,gh,gd), lam('#fff'), cars.length); im.frustumCulled=false; cars.forEach((o,i)=>im.setColorAt(i,cc.set(auf&&o.lkw?'#e9e6df':o.c))); world.add(im); return im; };
    anim.autos={B, cars, px, pz, body:mk(4.3,.8,1.8), cab:mk(2.3,.65,1.6,1)}; poseAutos(0); }
  inst(new THREE.BoxGeometry(1,1,1), lam('#fff'), S.halle, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.hg/2-1.5,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(o.w,o.hg+3,o.t); cc.set(['#d9d6cf','#b9bdc2','#e6e3dc','#8e959c','#c8b9a0'][o.c*5|0]); });
  inst(new THREE.BoxGeometry(1,1,1), lam('#fff'), S.halle, o=>{ ps.set(o.x,terrainAt(o.x,o.y)+o.hg-1.3,o.y); qq.setFromAxisAngle(up,-o.h); sc.set(o.w+.6,.5,o.t+.6); cc.set(o.c<.5?'#5b5e62':'#7a7d80'); });
  for(const e of R.def.bogen||(R.kalmit?[210]:[])){ // Weinlaub-Bogen über der Dorfstraße (Maikammer, Leinsweiler), mit Schrifttafel (Ranschbach)
    const [d,txt]=[].concat(e), [x,z]=posAt(R,d), hd=headingAt(R,d), nx=-Math.sin(hd), nz=Math.cos(hd), y=roadY(d), hw=rw(d)+1.4;
    if(txt){ const tt=canvasTex(512,128,g=>{ g.fillStyle='#f4f6f8'; g.fillRect(0,0,512,128); g.strokeStyle='#8a9aa8'; g.lineWidth=6; g.strokeRect(3,3,506,122); g.fillStyle='#2f5f9a'; g.textAlign='center';
        g.font='italic 600 34px Georgia, serif'; g.fillText('Willkommen im',256,48); g.font='italic 700 46px Georgia, serif'; g.fillText(txt,256,100); });
      const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.05), new THREE.MeshLambertMaterial({map:tt, side:THREE.DoubleSide})); sg.position.set(x,y+3.7,z); sg.rotation.y=Math.atan2(-Math.cos(hd),-Math.sin(hd)); world.add(sg); }
    for(const s of [-1,1]){ const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,4.4,5), lam('#4b3a2c')); p.position.set(x+nx*s*hw,y+2.2,z+nz*s*hw); world.add(p); }
    const leaf=lam('#4f8a35'), n=Math.round(hw*5); for(let i=0;i<n;i++){ const t=i/(n-1)*2-1, b=new THREE.Mesh(new THREE.IcosahedronGeometry(.75+Math.random()*.4,0), leaf);
      b.position.set(x+nx*t*(hw+.2)+Math.cos(hd)*(Math.random()-.5)*1.6, y+4.4+Math.random()*.5-(Math.abs(t)>.8?.6+Math.random()*.8:0), z+nz*t*(hw+.2)+Math.sin(hd)*(Math.random()-.5)*1.6); world.add(b); } }

  // ---------- Fans ----------
  if(S.fan.length){
    const F=S.fan, legs=inst(new THREE.CylinderGeometry(.13,.11,.85,6), lam('#fff'), F, ()=>{}), body=inst(new THREE.CylinderGeometry(.2,.17,.68,7), lam('#fff'), F, ()=>{}),
      head=inst(new THREE.SphereGeometry(.13,8,6), lam('#fff'), F, ()=>{}), capL=F.filter(o=>o.cap), cap=inst(new THREE.SphereGeometry(.145,8,4,0,Math.PI*2,0,Math.PI/2), lam('#fff'), capL, ()=>{});
    const armL=[]; F.forEach(o=>{ for(let a=0;a<o.arms;a++) armL.push({o,a}); }); const arm=inst(new THREE.CylinderGeometry(.05,.05,.6,5), lam('#fff'), armL, ()=>{});
    const phL=armL.filter(x=>x.o.phone && x.a===0), phone=inst(new THREE.BoxGeometry(.08,.15,.02), lam('#15171a'), phL, ()=>{});
    const flL=F.filter(o=>o.flag), pole=inst(new THREE.CylinderGeometry(.02,.02,1.6,4), lam('#ddd'), flL, ()=>{});
    const flagTex=canvasTex(64,40,g=>{ g.fillStyle='#fff'; g.fillRect(0,0,64,40); g.fillStyle='#d62828'; for(let y=5;y<40;y+=10) for(let x=(y/10%2)*5+4;x<64;x+=10){ g.beginPath(); g.arc(x,y,3,0,7); g.fill(); } });
    const flag=flL.length? new THREE.InstancedMesh(new THREE.PlaneGeometry(.9,.55), new THREE.MeshLambertMaterial({map:flagTex, side:THREE.DoubleSide}), flL.length):null; if(flag) world.add(flag);
    F.forEach(o=>{ o.gy=o.u!=null?abY(o.u,o.x,o.y,o.d)-.06:terrainAt(o.x,o.y)+0.1; });
    // Michel und Marion: Namen über dem Kopf, Banner für Sebbi (nur wenn Dengel mitfährt)
    const PA=F.filter(o=>o.paar); let paar=null;
    if(PA.length===2){ const names=PA.map(o=>{ const sp=nameSprite(o.name,o.name==='Michel'?'#1d4a8c':'#a61e4d'); sp.material.depthTest=true; sp.scale.set(2,.5,1); const y=o.gy+2.45*o.tall; sp.position.set(o.x,y,o.y); world.add(sp); return {sp,y}; });
      const tex=canvasTex(512,128,g=>{ g.fillStyle='#fffdf5'; g.fillRect(0,0,512,128); g.strokeStyle='#c92a2a'; g.lineWidth=10; g.strokeRect(5,5,502,118);
        g.fillStyle='#1a1a1a'; g.textAlign='center'; g.textBaseline='middle'; g.font='800 78px "Barlow Condensed", Arial Narrow, sans-serif'; g.fillText("Auf geht's Sebbi",256,68,480); });
      const banner=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.55), new THREE.MeshLambertMaterial({map:tex, side:THREE.DoubleSide})), [a,b]=PA, fc=a.face*.5+b.face*.5;
      const L=Math.hypot(a.x-b.x,a.y-b.y), tx=(a.x-b.x)/L, tz=(a.y-b.y)/L, TW=.7, vx=Math.sin(fc)*Math.cos(TW)-tx*Math.sin(TW), vz=Math.cos(fc)*Math.cos(TW)-tz*Math.sin(TW), fv=Math.atan2(vx,vz); // 30° den Fahrern entgegen gedreht
      PA.forEach(o=>o.face=fv);
      banner.position.set((a.x+b.x)/2+Math.sin(fc)*.22, Math.min(a.gy+1.9*a.tall,b.gy+1.9*b.tall)+.27, (a.y+b.y)/2+Math.cos(fc)*.22); banner.rotation.y=fv; world.add(banner);
      paar={banner,names}; }
    anim.fans={F,legs,body,head,cap,capL,arm,armL,phone,phL,pole,flag,flL,paar,sebbi:null};
    poseFans(0, true);
  } else anim.fans=null;

  // ---------- Ortsschilder (gelb, Rückseite Ortsende) ----------
  if(!R.kalmit) for(const [zt,za,zb,zo={}] of R.zones) if(zt==='ort'&&zo.name){
    const tex=ende=>{ const k='os'+zo.name+ende; return facadeCache[k]||(facadeCache[k]=canvasTex(512,320,g=>{ g.fillStyle='#f5c518'; g.fillRect(0,0,512,320);
        g.strokeStyle='#111'; g.lineWidth=10; g.strokeRect(18,18,476,284); g.fillStyle='#111'; g.textAlign='center'; g.textBaseline='middle';
        g.font='800 118px "Barlow Condensed", Arial Narrow, sans-serif'; g.fillText(zo.name,256,135,440); g.font='600 36px "Barlow Condensed", Arial Narrow, sans-serif'; g.fillText(zo.kreis||'',256,240,440);
        if(ende){ g.strokeStyle='#c92a2a'; g.lineWidth=28; g.beginPath(); g.moveTo(40,290); g.lineTo(472,30); g.stroke(); } })); };
    const sign=(d,ende)=>{ d=((d%R.len)+R.len)%R.len; const [x,z]=posAt(R,d), hd=headingAt(R,d), ex=-Math.sin(hd), ez=Math.cos(hd), o=roadW(R,d)/2+2, px=x+ex*o, pz=z+ez*o, gy=roadY(d), rot=Math.atan2(-Math.cos(hd),-Math.sin(hd));
      for(const s of [-1,1]){ const pst=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,3.2,6), lam('#8d949b')); pst.position.set(px+ex*s*1.05, gy+1.6, pz+ez*s*1.05); world.add(pst); }
      [[ende,0],[!ende,Math.PI]].forEach(([e,r2])=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.69), new THREE.MeshBasicMaterial({map:tex(e)})); // gut lesbar: 1,8-mal so groß wie ein echtes Schild
        m.position.set(px+Math.cos(hd)*(r2?.015:-.015), gy+2.35, pz+Math.sin(hd)*(r2?.015:-.015)); m.rotation.y=rot+r2; world.add(m); }); };
    if(za>0) sign(za-4,false); else if(R.loop) sign(-90,false); // Godramstein: Ortseingang vor dem Ziel
    if(zb<R.len) sign(zb+4,true); }
  // Absperrgitter mit Bannern auf den letzten 300 m
  { const bl=[], texts=R.kalmit?['BERGWERTUNG','KALMIT','HOPP HOPP!','PFALZ','ALLEZ!','673 m']:['SÜDPFALZ','HOPP HOPP!','WEINSTRASSE','ALLEZ!','PFALZ','ZIEL'], cols=['#1c7ed6','#2f9e44','#e8590c','#ae3ec9','#c92a2a','#0b7285'];
    for(let d=R.len-320; d<R.len-6; d+=2.5) for(const s of [-1,1]){ const [x,z]=posAt(R,d+1.25), hd=headingAt(R,d+1.25), nx=-Math.sin(hd), nz=Math.cos(hd), off=ROAD_W/2+0.45;
      bl.push({x:x+nx*s*off, z:z+nz*s*off, bx:x+nx*s*(off-.05), bz:z+nz*s*(off-.05), y:roadY(d+1.25), g:gradeAt(d+1.25), h:hd, s, t:Math.floor((d/2.5+(s>0?3:0)))%texts.length}); }
    inst(new THREE.BoxGeometry(2.45,1.05,.04), lam('#c3c8cc'), bl, o=>{ ps.set(o.x,o.y+.62,o.z); slopeQ(o.h,o.g); sc.set(1,1,1); cc.set('#aab0b6'); });
    texts.forEach((t,ti)=>{ const tex=canvasTex(256,96,g=>{ g.fillStyle=cols[ti]; g.fillRect(0,0,256,96); g.fillStyle='#fff'; g.font='800 54px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,128,50,240); });
      const list=bl.filter(o=>o.t===ti); inst(new THREE.PlaneGeometry(2.35,.8), new THREE.MeshBasicMaterial({map:tex, side:THREE.DoubleSide}), list, o=>{ ps.set(o.bx,o.y+.62,o.bz); slopeQ(o.h,o.g,o.s>0); sc.set(1,1,1); }); }); }

  // ---------- Schilder, Start, Ziel ----------
  for(let k=1;k*1000<R.len;k++){ const d=k*1000, hd=headingAt(R,d), sp=textSprite([`km ${k}`,`${de(gradeAt(d+1),0)} %`],{w:1.6});
    sp.position.set(R.xs[d/STEP|0]-Math.sin(hd)*(ROAD_W/2+1.6), roadY(d)+1.9, R.ys[d/STEP|0]+Math.cos(hd)*(ROAD_W/2+1.6)); world.add(sp);
    const post=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.2,5), lam('#666')); post.position.set(sp.position.x, roadY(d)+0.7, sp.position.z); world.add(post); }
  R.kehren.forEach((d,i)=>{ const [x,z]=posAt(R,d), sp=textSprite([`Kehre ${i+1}`],{w:3.2,bg:'#f6f3ea'}); sp.position.set(x, roadY(d)+5.5, z); world.add(sp); });
  const arch=(d,draw,ch=80,bh=1.1)=>{ const [x,z]=posAt(R,d), hd=headingAt(R,d), nx=-Math.sin(hd), nz=Math.cos(hd), y=roadY(d), half=ROAD_W/2+0.6;
    const ph=4.4+bh; for(const s of [-1,1]){ const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,ph,8), lam('#222')); p.position.set(x+nx*half*s, y+ph/2, z+nz*half*s); world.add(p); }
    const b=new THREE.Mesh(new THREE.PlaneGeometry(half*2+.4,bh), new THREE.MeshBasicMaterial({map:canvasTex(512,ch,draw), side:THREE.DoubleSide}));
    b.position.set(x, y+4.4+bh/2, z); b.rotation.y=Math.atan2(-Math.cos(hd), -Math.sin(hd)); world.add(b); };
  // KOM-Banner im Bergtrikot-Look (weiß mit roten Punkten): Kalmit-Gipfel und Bergwertungen unterwegs
  const komBanner=(top,sub,fs=92)=>g=>{ g.fillStyle='#fff'; g.fillRect(0,0,512,150); g.fillStyle='#d62828';
    for(let y=12;y<150;y+=26) for(let x=(y/26%2)*13+8;x<512;x+=26){ g.beginPath(); g.arc(x,y,6.5,0,7); g.fill(); }
    g.fillStyle='rgba(255,255,255,.92)'; g.fillRect(100,18,312,114);
    g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#d62828'; g.font=`800 ${fs}px "Barlow Condensed", Arial Narrow, sans-serif`; g.fillText(top,256,66,296);
    g.fillStyle='#1a1a1a'; g.font='700 22px "Barlow Condensed", Arial Narrow, sans-serif'; g.fillText(sub,256,116,296);
    g.strokeStyle='#1a1a1a'; g.lineWidth=6; g.strokeRect(3,3,506,144); };
  for(const [,b,n] of R.kom) arch(b,komBanner('BERGWERTUNG',n,70),150,1.6);
  if(!R.kalmit) arch(R.loop?0.5:R.len-0.5,(g)=>{ g.fillStyle='#fff'; g.fillRect(0,0,512,150); g.fillStyle='#111'; // Start/Ziel-Bogen mit Zielflaggen-Karos
    for(let i=0;i<64;i++) for(let j=0;j<2;j++) if((i+j)%2){ g.fillRect(i*8,j*8,8,8); g.fillRect(i*8,134+j*8,8,8); }
    g.fillStyle='#1c7ed6'; g.fillRect(0,16,512,118); g.fillStyle='#fff'; g.textAlign='center'; g.textBaseline='middle';
    g.font='800 76px "Barlow Condensed", Arial Narrow, sans-serif'; g.fillText('START · ZIEL',256,66,490);
    g.font='700 24px "Barlow Condensed", Arial Narrow, sans-serif'; g.fillText(R.name.toUpperCase(),256,114,490); }, 150, 2.0);
  else { arch(0.5,(g)=>{ g.fillStyle='#1c7ed6'; g.fillRect(0,0,512,80); g.fillStyle='#fff'; g.font='800 40px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(`START · ${R.start}`,256,42,490); });
  arch(R.len-0.5,komBanner('KOM',`King of the Mountain · ${R.finish}`), 150, 2.0); }
  { const cc2=canvasTex(16,128,g=>{ for(let i=0;i<16;i++) for(let j=0;j<2;j++){ g.fillStyle=(i+j)%2?'#111':'#fff'; g.fillRect(j*8,i*8,8,8); } });
    const [x,z]=posAt(R,R.len-1), hd=headingAt(R,R.len-1), fl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,ROAD_W), new THREE.MeshBasicMaterial({map:cc2}));
    fl.rotation.x=-Math.PI/2; fl.rotation.z=-hd; fl.position.set(x,roadY(R.len-1)+0.16,z); world.add(fl); }
  if(R.kalmit){ // Gipfel: Sandsteinturm mit grüner Blechverkleidung, dunkle Holzhütte auf Sandsteinsockel, Aussichtsterrasse
    const [x,z]=posAt(R,R.len), hd=headingAt(R,R.len), fx=Math.cos(hd), fz=Math.sin(hd), nx=-Math.sin(hd), nz=Math.cos(hd);
    const at=(a,b)=>[x+fx*a+nx*b, z+fz*a+nz*b], G=new THREE.Group(), [gx,gz]=at(18,17), gy=terrainAt(gx,gz);
    G.position.set(gx,gy,gz); G.rotation.y=-hd; world.add(G);
    const sst=canvasTex(128,128,g=>{ g.fillStyle='#a5705c'; g.fillRect(0,0,128,128); for(let y=0;y<128;y+=16) for(let x=(y/16%2)*16;x<128;x+=32){ g.fillStyle=`hsl(${12+Math.random()*10},${28+Math.random()*12}%,${44+Math.random()*12}%)`; g.fillRect(x+1,y+1,30,14); } });
    sst.wrapS=sst.wrapT=THREE.RepeatWrapping; const stoneM=(rx,ry)=>{ const t=sst.clone(); t.needsUpdate=true; t.repeat.set(rx,ry); return new THREE.MeshLambertMaterial({map:t}); };
    const wood=canvasTex(64,64,g=>{ g.fillStyle='#4a3a2e'; g.fillRect(0,0,64,64); g.fillStyle='rgba(0,0,0,.35)'; for(let y=0;y<64;y+=8) g.fillRect(0,y,64,1.5); });
    wood.wrapS=wood.wrapT=THREE.RepeatWrapping; wood.repeat.set(3,2); const woodM=new THREE.MeshLambertMaterial({map:wood});
    const box=(w,h,d,m,px,py,pz)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); o.position.set(px,py,pz); G.add(o); return o; };
    // Sockel aus roten Sandsteinquadern, darauf die Holzhütte mit flachem Ziegeldach und Veranda
    box(18,2.2,11,stoneM(5,1),0,0.6,0);
    box(14,4.2,8,woodM,1,3.8,1);
    const rf=new THREE.Mesh(gableGeo(17,12,2.2), new THREE.MeshLambertMaterial({color:'#9a4a34',side:THREE.DoubleSide})); rf.position.set(1,5.9,1); G.add(rf);
    for(let i=0;i<4;i++){ box(1.7,1.4,.1,lam('#2a2a2c'),-4.2+i*3.1,4.2,-3.06); box(1.9,.12,.12,lam('#6b5440'),-4.2+i*3.1,3.45,-3.1); }
    box(1.3,2.4,.12,lam('#3b2f26'),6.2,3.0,-3.06);
    for(let i=0;i<30;i++) box(.1,1.0,.1,lam('#3e3127'),-6.6+i*.42,2.2,-4.6); box(13,.14,.18,lam('#3e3127'),-0.5,2.75,-4.6);
    // Schild über der Tür, nur mit Höhenangabe
    { const t=canvasTex(256,96,g=>{ g.fillStyle='#4b3a2c'; g.fillRect(0,0,256,96); g.strokeStyle='#2a1f17'; g.lineWidth=6; g.strokeRect(3,3,250,90); g.fillStyle='#efe6d2'; g.font='800 58px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('673 m',128,50); });
      const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.9), new THREE.MeshBasicMaterial({map:t})); sg.position.set(6.2,4.8,-3.1); sg.rotation.y=Math.PI; G.add(sg); }
    // Turm: unten Sandstein mit Fensterband, oben grünes Blech, Balkone, Plattform mit Antennen
    box(6,12,6,stoneM(2,4),8.5,7.5,3); box(6.05,7,6.05,lam('#5f8f86'),8.5,16.5,3); box(6.1,.2,6.1,lam('#3f5f59'),8.5,20.1,3);
    for(let i=0;i<9;i++) box(.5,.7,.08,lam('#8a3f2c'),6.4,3.5+i*1.25,-.04);
    for(const [h,w] of [[12.5,3],[15.5,3]]){ box(w,.15,1.6,lam('#6d4a3a'),8.5,h,-0.8); for(let i=0;i<7;i++) box(.05,1,.05,lam('#2b2b2b'),7+i*.5,h+.5,-1.55); box(w,.06,.06,lam('#2b2b2b'),8.5,h+1,-1.55); }
    for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; box(.05,1,.05,lam('#2b2b2b'),8.5+Math.cos(a)*2.9,20.7,3+Math.sin(a)*2.9); }
    for(const [ax,az,h] of [[7.2,1.8,9],[9.6,4.1,6],[8.8,2.2,4]]) box(.12,h,.12,lam('#c8c8c8'),ax,20.2+h/2,az);
    for(const [ax,az] of [[10.2,1.6],[7,4.4]]){ const dish=new THREE.Mesh(new THREE.SphereGeometry(.45,10,6,0,Math.PI*2,0,Math.PI/2), lam('#eeeeee')); dish.position.set(ax,21.6,az); dish.rotation.x=Math.PI/2; G.add(dish); }
    box(3.2,9,4,woodM,4.6,6,5.6);
    // Aussichtsterrasse mit weißem Lattenzaun und Bierbänken, Gedenkstein
    box(16,.3,9,lam('#b8a88a'),-1,0.1,-10);
    for(let i=0;i<40;i++) box(.08,1.1,.08,lam('#f2f2ee'),-9+i*.4,0.8,-14.5); box(16,.1,.12,lam('#f2f2ee'),-1,1.3,-14.5);
    for(let i=0;i<4;i++){ box(2.4,.08,.8,lam('#7a5a3e'),-6+i*3.6,1.0,-11); box(2.4,.06,.3,lam('#7a5a3e'),-6+i*3.6,.6,-11.7); box(2.4,.06,.3,lam('#7a5a3e'),-6+i*3.6,.6,-10.3); }
    box(1.1,2.6,1.1,stoneM(.5,1),-9.5,1.8,-3.5); }

  buildRiders();
  world.traverse(o=>{ if(o.isMesh){ o.receiveShadow=true; o.castShadow=!(o.geometry&&o.geometry.type==='PlaneGeometry') && !o.material.transparent; } });
  kxSetup();
}
function poseFans(t, all){
  const A=anim.fans; if(!A) return; const m4=new THREE.Matrix4(), q=new THREE.Quaternion(), s=new THREE.Vector3(1,1,1), p=new THREE.Vector3(), up=new THREE.Vector3(0,1,0), e=new THREE.Euler(), c=new THREE.Color();
  const md=R.loop?((me.d%R.len)+R.len)%R.len:me.d, lo=all?0:md-200, hi=all?1e9:md+400;
  const sb=myKey==='dengel'||(opp.active&&oppKey==='dengel'); // Sebbi fährt mit: Michel und Marion halten das Banner hoch
  if(A.paar && A.sebbi!==sb){ A.sebbi=sb; A.paar.banner.visible=sb; A.paar.names.forEach(n=>n.sp.position.y=n.y+(sb?.45:0)); }
  const hopOf=o=>o.paar&&sb?0:Math.max(0,Math.sin(t*(5+o.ph%2)+o.ph))*(o.arms?0.12:0.04)*(o.paar?.5:1);
  A.F.forEach((o,i)=>{ if(o.d<lo||o.d>hi) return; const hop=hopOf(o), y=o.gy+hop, ty=o.tall;
    q.setFromAxisAngle(up,o.face);
    p.set(o.x,y+.42*ty,o.y); s.set(1,ty,1); m4.compose(p,q,s); A.legs.setMatrixAt(i,m4); if(all){ c.set(o.legs); A.legs.setColorAt(i,c); }
    p.set(o.x,y+(.85+.32)*ty,o.y); s.set(1,ty,1); m4.compose(p,q,s); A.body.setMatrixAt(i,m4); if(all){ c.set(o.jack); A.body.setColorAt(i,c); }
    p.set(o.x,y+1.66*ty,o.y); s.set(1,1,1); m4.compose(p,q,s); A.head.setMatrixAt(i,m4); if(all){ c.set(['#f1c9a5','#e0ac80','#c68c62','#8d5a3b'][Math.floor(o.ph)%4]); A.head.setColorAt(i,c); } });
  A.capL.forEach((o,i)=>{ if(o.d<lo||o.d>hi) return; const hop=hopOf(o); p.set(o.x,o.gy+hop+1.68*o.tall,o.y); q.identity(); s.set(1,1,1); m4.compose(p,q,s); A.cap.setMatrixAt(i,m4); if(all){ c.set(o.cap); A.cap.setColorAt(i,c);} });
  const armTip=(o,a,t)=>{ if(o.paar&&sb) return {hop:0,sx:a?-1:1,tl:.15,sy:o.gy+1.42*o.tall};
    const hop=Math.max(0,Math.sin(t*(5+o.ph%2)+o.ph))*0.12*(o.paar?.5:1), sx=a?-1:1, tl=.25+Math.sin(t*4+o.ph+a)*.22*(o.phone&&!a?.2:1);
    return {hop,sx,tl,sy:o.gy+hop+1.42*o.tall}; };
  A.armL.forEach(({o,a},i)=>{ if(o.d<lo||o.d>hi) return; const {sx,tl,sy}=armTip(o,a,t);
    e.set(0,o.face,0); q.setFromEuler(e); const off=new THREE.Vector3(sx*(.22+.3*Math.sin(tl)),0,0).applyQuaternion(q);
    p.set(o.x+off.x, sy+.3*Math.cos(tl), o.y+off.z); e.set(0,o.face,-sx*tl,'YXZ'); q.setFromEuler(e); m4.compose(p,q,s.set(1,1,1)); A.arm.setMatrixAt(i,m4); if(all){ c.set(o.jack); A.arm.setColorAt(i,c); } });
  if(A.phone) A.phL.forEach(({o},i)=>{ if(o.d<lo||o.d>hi) return; const {sx,tl,sy}=armTip(o,0,t); e.set(0,o.face,0); q.setFromEuler(e); const off=new THREE.Vector3(sx*(.22+.62*Math.sin(tl)),0,.06).applyQuaternion(q);
    p.set(o.x+off.x, sy+.62*Math.cos(tl)+.05, o.y+off.z); m4.compose(p,q,s.set(1,1,1)); A.phone.setMatrixAt(i,m4); });
  A.flL.forEach((o,i)=>{ if(o.d<lo||o.d>hi) return; e.set(0,o.face,0); q.setFromEuler(e); const off=new THREE.Vector3(-.3,0,0).applyQuaternion(q), sw=Math.sin(t*2.2+o.ph)*.5;
    p.set(o.x+off.x, o.gy+1.9, o.y+off.z); m4.compose(p,q,s.set(1,1,1)); A.pole.setMatrixAt(i,m4);
    e.set(0,o.face+Math.PI/2+sw,0); q.setFromEuler(e); const off2=new THREE.Vector3(.46,0,0).applyQuaternion(q); p.set(o.x+off.x+off2.x, o.gy+2.4, o.y+off.z+off2.z); m4.compose(p,q,s); A.flag.setMatrixAt(i,m4); });
  for(const k of ['legs','body','head','cap','arm','phone','pole','flag']) if(A[k]){ A[k].instanceMatrix.needsUpdate=true; if(all&&A[k].instanceColor) A[k].instanceColor.needsUpdate=true; }
}


/* ================= Südpfalz: Haardt im Westen ================= */
// Bergkette entlang einer Fußlinie (läuft leicht nach Nordnordost), Gipfel rund 300–400 m über der Ebene; ohne Nebel, dafür mit Dunst je Entfernung
function buildHaardt(plainY){ const foot=z=>-4400+(2400-z)*.35, sm=v=>{ v=Math.min(1,Math.max(0,v)); return v*v*(3-2*v); };
  const Z0=-7000, Z1=9000, dz=100, W0=-300, W1=6000, dw=100, nz=(Z1-Z0)/dz+1, nw=(W1-W0)/dw+1, pos=new Float32Array(nz*nw*3), col=new Float32Array(nz*nw*3), idx=[];
  const cF=new THREE.Color('#34502e'), cF2=new THREE.Color('#47623a'), cH=new THREE.Color('#aab8c2'), c=new THREE.Color();
  for(let j=0;j<nz;j++) for(let i=0;i<nw;i++){ const z=Z0+j*dz, w=W0+i*dw, k=j*nw+i;
    let rise=w<0?-25:(420*sm(w/2200)*(.7+.5*vnoise(z/1500,3.1)) + 120*(vnoise(w/700+5,z/700)-.5)*sm(w/800) + 40*(vnoise(w/220,z/220)-.5)*sm(w/500));
    rise*=(1-sm((w-4500)/1500))*sm((z-Z0)/2000)*sm((Z1-z)/2000);
    pos.set([foot(z)-w, plainY+rise, z], k*3);
    c.copy(cF).lerp(cF2, vnoise(w/300,z/300)).lerp(cH, .18+.45*sm(w/5000)); col.set([c.r,c.g,c.b], k*3);
    if(i<nw-1&&j<nz-1) idx.push(k,k+1,k+nw, k+1,k+nw+1,k+nw); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('color',new THREE.BufferAttribute(col,3)); g.setIndex(idx); g.computeVertexNormals();
  world.add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({vertexColors:true, fog:false, side:THREE.DoubleSide}))); }
