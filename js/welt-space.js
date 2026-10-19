/* ================= Space: Himmel, Lichtstreifen, Feuerwerk ================= */
const SPACE_BG=0x04050d;
const spaceSky=(()=>{ const G=new THREE.Group(); G.visible=false; scene.add(G); const rr=rng(4242), R0=4500;
  const star=(n,size,bright)=>{ const p=new Float32Array(n*3), c=new Float32Array(n*3), col=new THREE.Color();
    for(let i=0;i<n;i++){ const u=rr()*2-1, a=rr()*Math.PI*2, s=Math.sqrt(1-u*u); p.set([Math.cos(a)*s*R0, u*R0, Math.sin(a)*s*R0], i*3);
      col.set(['#ffffff','#cfe0ff','#ffe9c4','#bcd0ff','#ffd6e8'][Math.floor(rr()*5)]).multiplyScalar(bright*(0.45+rr()*0.55)); c.set([col.r,col.g,col.b], i*3); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3));
    G.add(new THREE.Points(g, new THREE.PointsMaterial({size, sizeAttenuation:false, vertexColors:true, fog:false, depthWrite:false}))); };
  star(4200,1.6,1); star(420,2.8,1.2); star(60,4,1.3);
  // bunte Nebel
  const neb=(c1,c2,seed)=>canvasTex(256,256,g=>{ const q=rng(seed); g.globalCompositeOperation='lighter';
    for(let i=0;i<34;i++){ const x=50+q()*156, y=60+q()*136, r=30+q()*70, gr=g.createRadialGradient(x,y,0,x,y,r), c=q()<.5?c1:c2;
      gr.addColorStop(0,c+'2e'); gr.addColorStop(1,c+'00'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } });
  [['#a24bff','#ff4fa8',11,0.4,0.25,3200],['#2fa8ff','#5b4bff',12,2.3,0.05,3600],['#ff5a7a','#ffb03a',13,4.1,0.4,2400],['#3dffd0','#2f7bff',14,5.4,-0.15,2800],['#c84bff','#3d7bff',15,1.3,-0.35,2600]]
    .forEach(([a,b,sd,az,el,sz])=>{ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:neb(a,b,sd), fog:false, depthWrite:false, transparent:true, blending:THREE.AdditiveBlending}));
      sp.position.set(Math.cos(az)*Math.cos(el)*4200, Math.sin(el)*4200, Math.sin(az)*Math.cos(el)*4200); sp.scale.set(sz,sz,1); G.add(sp); });
  // zwei große, ferne Planeten
  const gas=canvasTex(512,256,g=>{ const q=rng(77); for(let y=0;y<256;y+=2){ const t=y/256; g.fillStyle=`hsl(${20+Math.sin(t*19)*14+q()*6},${55+q()*15}%,${48+Math.sin(t*31)*12+q()*6}%)`; g.fillRect(0,y,512,2); }
    g.fillStyle='rgba(190,70,40,.55)'; g.beginPath(); g.ellipse(330,170,46,20,0,0,7); g.fill(); });
  const big=new THREE.Mesh(new THREE.SphereGeometry(520,48,32), new THREE.MeshLambertMaterial({map:gas, fog:false})); big.position.set(-2600,700,-2900); big.rotation.z=0.3; G.add(big);
  const ice=canvasTex(512,256,g=>{ const q=rng(78); for(let y=0;y<256;y+=2){ const t=y/256; g.fillStyle=`hsl(${190+Math.sin(t*12)*12},${45+q()*10}%,${62+Math.sin(t*27)*8+q()*4}%)`; g.fillRect(0,y,512,2); } });
  const p2=new THREE.Mesh(new THREE.SphereGeometry(300,40,28), new THREE.MeshLambertMaterial({map:ice, fog:false})); p2.position.set(3000,-300,2400); G.add(p2);
  const ringTex=canvasTex(256,8,g=>{ for(let x=0;x<256;x++){ const a=(Math.sin(x*.21)*.5+.5)*(x>30&&x<240?1:0)*(Math.sin(x*.07)>-.6?1:.25); g.fillStyle=`rgba(225,210,185,${a*.85})`; g.fillRect(x,0,1,8); } });
  const rg=new THREE.RingGeometry(380,700,96,1), uv=rg.attributes.uv, ps=rg.attributes.position; for(let i=0;i<uv.count;i++){ const l=Math.hypot(ps.getX(i),ps.getY(i)); uv.setXY(i,(l-380)/320,.5); }
  const ringM=new THREE.Mesh(rg, new THREE.MeshBasicMaterial({map:ringTex, transparent:true, side:THREE.DoubleSide, fog:false, depthWrite:false})); ringM.position.copy(p2.position); ringM.rotation.set(1.2,0.3,0.2); G.add(ringM);
  return G; })();
scene.add(camera);
// Lichtstreifen bei hohem Tempo (hängen an der Kamera)
const streaks=(()=>{ const N=90, p=new Float32Array(N*6), seed=[]; const q=rng(91);
  for(let i=0;i<N;i++){ const a=q()*Math.PI*2, r=2.5+q()*7; seed.push({x:Math.cos(a)*r, y:Math.sin(a)*r*.7, z:-5-q()*70, l:2+q()*5}); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.LineSegments(g, new THREE.LineBasicMaterial({color:0xbfe6ff, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, fog:false}));
  m.frustumCulled=false; m.visible=false; camera.add(m); return {m,seed,p}; })();
function updStreaks(dt,v){ const S=streaks, op=Math.max(0,Math.min(1,(v-8)/8))*0.7; S.m.material.opacity=op; S.m.visible=op>0.01; if(!S.m.visible) return;
  S.seed.forEach((o,i)=>{ o.z+=v*1.6*dt; if(o.z>1){ o.z=-75; } S.p.set([o.x,o.y,o.z, o.x,o.y,o.z-o.l*(0.5+v/12)], i*6); }); S.m.geometry.attributes.position.needsUpdate=true; }
function neonSprite(text,col,w){ const tex=canvasTex(512,128,g=>{ g.font='800 80px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    g.shadowColor=col; g.shadowBlur=26; g.fillStyle=col; g.fillText(text,256,66,480); g.fillText(text,256,66,480); g.shadowBlur=6; g.fillStyle='#ffffff'; g.fillText(text,256,66,480); });
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthWrite:false, fog:false})); sp.scale.set(w,w/4,1); return sp; }

function buildSpace(){
  scene.fog.near=350; scene.fog.far=3800;
  const n=R.xs.length, rnd=rng(2024), up=new THREE.Vector3(0,1,0);
  // Farbe je Punkt aus der Intensität des Abschnitts
  const cols=new Float32Array(n*3), tc=new THREE.Color(), cache={};
  for(let i=0;i<n;i++){ const p=segOf(Math.min(R.len-0.01,i*STEP)).p??-1, k=SPACE_COL(p); const c=cache[k]||(cache[k]=new THREE.Color(k)); cols.set([c.r,c.g,c.b],i*3); }
  const F=i=>{ const d=i*STEP, hd=headingAt(R,d); return {x:R.xs[i], z:R.ys[i], y:roadY(d), nx:-Math.sin(hd), nz:Math.cos(hd), d}; };
  const frames=[]; for(let i=0;i<n;i++) frames.push(F(i));
  const ribbon=(fn,mat,uvLen=8,colScale=1)=>{ const p=new Float32Array(n*6), c=new Float32Array(n*6), uv=new Float32Array(n*4), id=[];
    for(let i=0;i<n;i++){ const f=frames[i], [a,b]=fn(f); p.set([...a,...b],i*6); const r=cols[i*3]*colScale, g=cols[i*3+1]*colScale, bl=cols[i*3+2]*colScale; c.set([r,g,bl,r,g,bl],i*6);
      uv.set([0,f.d/uvLen,1,f.d/uvLen],i*4); if(i<n-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(id);
    const m=new THREE.Mesh(g,mat); m.frustumCulled=false; world.add(m); return m; };
  const P=(f,u,h)=>[f.x+f.nx*u, f.y+h, f.z+f.nz*u], hw=ROAD_W/2;
  // Fahrbahn: dunkel getönt, Querstreifen alle 8 m
  const rtex=canvasTex(64,128,g=>{ g.fillStyle='#3a3a44'; g.fillRect(0,0,64,128); g.fillStyle='rgba(255,255,255,.08)'; for(let x=8;x<64;x+=8) g.fillRect(x,0,1,128);
    g.fillStyle='#d8d8e0'; g.fillRect(0,0,64,5); g.fillStyle='#8a8a96'; g.fillRect(31,20,2,40); g.fillRect(31,84,2,30); });
  rtex.wrapT=THREE.RepeatWrapping; rtex.anisotropy=8;
  ribbon(f=>[P(f,-hw,.12),P(f,hw,.12)], new THREE.MeshBasicMaterial({map:rtex, vertexColors:true, side:THREE.DoubleSide}), 8);
  // Seitenwände der Bahn und Leuchtkanten
  const skin=new THREE.MeshBasicMaterial({color:'#15161f', side:THREE.DoubleSide});
  for(const s of [-1,1]) ribbon(f=>[P(f,s*hw,.12),P(f,s*hw,-.35)], skin);
  const edge=new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.DoubleSide, polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1});
  for(const s of [-1,1]){ ribbon(f=>[P(f,s*hw,.14),P(f,s*(hw+.32),.14)], edge); ribbon(f=>[P(f,s*(hw+.28),.13),P(f,s*(hw+.28),.5)], edge); }

  // Lichtimpuls beim Abschnittswechsel: eine helle Welle läuft die Bahn entlang
  const waveMat=new THREE.ShaderMaterial({uniforms:{uFront:{value:-1e9},uAmp:{value:0}}, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
    vertexShader:'attribute float aD; attribute float aW; attribute vec3 aCol; varying float vD; varying float vW; varying vec3 vCol; void main(){ vD=aD; vW=aW; vCol=aCol; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:'uniform float uFront; uniform float uAmp; varying float vD; varying float vW; varying vec3 vCol; void main(){ float x=(vD-uFront)/14.0; float k=min(1.0,exp(-x*x)*uAmp*vW); gl_FragColor=vec4(mix(vCol,vec3(1.0),0.7),k); }'});
  const waveRib=(fn,w)=>{ const p=new Float32Array(n*6), dd=new Float32Array(n*2), ww=new Float32Array(n*2).fill(w), c=new Float32Array(n*6), id=[];
    for(let i=0;i<n;i++){ const f=frames[i], [a,b]=fn(f); p.set([...a,...b],i*6); dd[i*2]=dd[i*2+1]=f.d; const r=cols[i*3], g=cols[i*3+1], bl=cols[i*3+2]; c.set([r,g,bl,r,g,bl],i*6); if(i<n-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('aD',new THREE.BufferAttribute(dd,1)); g.setAttribute('aW',new THREE.BufferAttribute(ww,1)); g.setAttribute('aCol',new THREE.BufferAttribute(c,3)); g.setIndex(id);
    const m=new THREE.Mesh(g,waveMat); m.frustumCulled=false; m.renderOrder=3; world.add(m); };
  for(const s of [-1,1]){ waveRib(f=>[P(f,s*(hw-.6),.17),P(f,s*(hw+.6),.17)],1); waveRib(f=>[P(f,s*(hw+.32),.12),P(f,s*(hw+.32),1.1)],1); }
  waveRib(f=>[P(f,-hw,.15),P(f,hw,.15)],.6);
  // Leuchten unter der Bahn
  const halo=new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.DoubleSide, transparent:true, opacity:.22, blending:THREE.AdditiveBlending, depthWrite:false});
  ribbon(f=>[P(f,-hw-5,-.7),P(f,hw+5,-.7)], halo);

  const inst=(geo,mat,list,fn)=>{ if(!list.length) return null; const im=new THREE.InstancedMesh(geo,mat,list.length), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), s=new THREE.Vector3(), p=new THREE.Vector3(), c=new THREE.Color(), e=new THREE.Euler();
    list.forEach((o,i)=>{ fn(o,p,q,s,c,e); m4.compose(p,q,s); im.setMatrixAt(i,m4); im.setColorAt(i,c); }); im.instanceMatrix.needsUpdate=true; im.instanceColor.needsUpdate=true; world.add(im); return im; };
  const Lw=R.len-R.ring, fr=d=>{ d=Math.max(0,Math.min(R.len,d)); const i=Math.min(n-1,Math.round(d/STEP)); return frames[i]; };

  // Asteroiden: verstreut, dazu ein dichter Gürtel
  const ast=[], beltA=Lw*0.42, beltB=beltA+Math.min(900,Lw*0.25);
  for(let d=40; d<Lw-60; d+=6){ const f=fr(d), belt=d>beltA&&d<beltB;
    const tries=belt?4:(rnd()<.3?1:0);
    for(let t=0;t<tries;t++){ const side=rnd()<.5?-1:1, off=side*(belt?9+rnd()*70:14+rnd()*140), s=belt?(rnd()<.08?3+rnd()*5:0.4+rnd()*2.2):(rnd()<.1?5+rnd()*9:0.6+rnd()*3);
      const off2=s>3?Math.sign(off)*Math.max(Math.abs(off),35+s*4):off; // große Brocken nicht direkt an der Bahn
      ast.push({x:f.x+f.nx*off2+(rnd()-.5)*6, z:f.z+f.nz*off2+(rnd()-.5)*6, y:f.y+(belt?(rnd()-.5)*22:(rnd()-.55)*80), s, r1:rnd()*6, r2:rnd()*6, c:rnd()}); }
    if(ast.length>7000) break; }
  inst(new THREE.DodecahedronGeometry(1,0), new THREE.MeshLambertMaterial({color:'#ffffff'}), ast, (o,p,q,s,c,e)=>{ p.set(o.x,o.y,o.z); q.setFromEuler(e.set(o.r1,o.r2,o.r1*.5)); s.set(o.s,o.s*(.7+o.c*.4),o.s*(.8+o.c*.3)); c.set(o.c<.33?'#8a7f76':o.c<.66?'#6f6a66':'#9a8670'); });
  if(beltB<Lw-100){ const f=fr(beltA-30), sp=neonSprite('ASTEROIDENGÜRTEL','#ffb03a',9); sp.position.set(f.x,f.y+7,f.z); world.add(sp); }

  // Planeten entlang der Strecke
  const ptex=(kind,seed)=>canvasTex(256,128,g=>{ const q=rng(seed), hue=q()*360;
    if(kind==='gas'){ for(let y=0;y<128;y+=2){ const t=y/128; g.fillStyle=`hsl(${hue+Math.sin(t*17+q())*18},${50+q()*20}%,${45+Math.sin(t*29)*12+q()*6}%)`; g.fillRect(0,y,256,2); } }
    else { g.fillStyle=`hsl(${hue},${25+q()*20}%,${42+q()*12}%)`; g.fillRect(0,0,256,128); for(let i=0;i<70;i++){ const x=q()*256, y=q()*128, r=2+q()*12; g.fillStyle=`rgba(0,0,0,${.12+q()*.15})`; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.strokeStyle='rgba(255,255,255,.12)'; g.lineWidth=1.5; g.beginPath(); g.arc(x-1,y-1,r,0,7); g.stroke(); } } });
  let side=1, k=0;
  for(let d=900; d<Lw-400; d+=2200+rnd()*900, side=-side, k++){ const f=fr(d), off=side*(320+rnd()*380), rad=70+rnd()*130, kind=rnd()<.55?'gas':'rock';
    const pl=new THREE.Mesh(new THREE.SphereGeometry(rad,40,28), new THREE.MeshLambertMaterial({map:ptex(kind,500+k)})); pl.position.set(f.x+f.nx*off, f.y-60+rnd()*240, f.z+f.nz*off); pl.rotation.set(rnd(),rnd()*6,rnd()*.5); world.add(pl);
    if(kind==='gas' && rnd()<.6){ const rg=new THREE.Mesh(new THREE.RingGeometry(rad*1.35,rad*2.1,72), new THREE.MeshBasicMaterial({color:new THREE.Color().setHSL(rnd(),.4,.7), transparent:true, opacity:.45, side:THREE.DoubleSide, depthWrite:false})); rg.position.copy(pl.position); rg.rotation.set(1.1+rnd()*.6,rnd(),0); world.add(rg); }
    if(rnd()<.5){ const mo=new THREE.Mesh(new THREE.SphereGeometry(rad*.18,20,14), new THREE.MeshLambertMaterial({map:ptex('rock',900+k)})); mo.position.copy(pl.position).add(new THREE.Vector3(rad*1.9,rad*.5,-rad*.8)); world.add(mo); } }

  // Planet in der Mitte der Umlaufbahn
  { const f=fr(Lw), cx=f.x+f.nx*SPACE_RING, cz=f.z+f.nz*SPACE_RING;
    const pl=new THREE.Mesh(new THREE.SphereGeometry(105,64,40), new THREE.MeshLambertMaterial({map:ptex('gas',4711)})); pl.position.set(cx,f.y-25,cz); pl.rotation.z=.2; world.add(pl);
    const at=new THREE.Mesh(new THREE.SphereGeometry(112,48,32), new THREE.MeshBasicMaterial({color:'#7fc8ff', transparent:true, opacity:.12, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.BackSide})); at.position.copy(pl.position); world.add(at); }

  // Start: Leuchtring über der Bahn
  const gate=(d,col,txt)=>{ const f=fr(d), hd=headingAt(R,d), G=new THREE.Group(); G.position.set(f.x,f.y,f.z); G.rotation.y=-hd; world.add(G);
    const t=new THREE.Mesh(new THREE.TorusGeometry(hw+2.2,.28,10,64), new THREE.MeshBasicMaterial({color:col})); t.rotation.y=Math.PI/2; t.position.y=2.2; G.add(t);
    if(txt){ const sp=neonSprite(txt,col,8); sp.position.set(0,hw+5.6,0); G.add(sp); } return G; };
  gate(1,'#5fd4ff','START');

  // Ziel: Raumstation mit Andocktunnel, Rad, Sonnensegeln
  const st=new THREE.Group(), fS=fr(Lw), hS=headingAt(R,Lw); st.position.set(fS.x,fS.y,fS.z); st.rotation.y=-hS; world.add(st);
  const metal=new THREE.MeshLambertMaterial({color:'#d6dbe3'}), dark=new THREE.MeshLambertMaterial({color:'#5a6170'}), neonC=new THREE.MeshBasicMaterial({color:'#7fe0ff'});
  for(let i=0;i<3;i++){ const t=new THREE.Mesh(new THREE.TorusGeometry(hw+2.6,.55,12,56), metal); t.rotation.y=Math.PI/2; t.position.set(-8+i*8,2.4,0); st.add(t);
    const t2=new THREE.Mesh(new THREE.TorusGeometry(hw+2.0,.14,8,56), neonC); t2.rotation.y=Math.PI/2; t2.position.set(-8+i*8,2.4,0); st.add(t2); }
  for(const s of [-1,1]){ const b=new THREE.Mesh(new THREE.BoxGeometry(18,.3,.3), dark); b.position.set(0,2.4+s*0,s*(hw+2.6)); st.add(b); const b2=new THREE.Mesh(new THREE.BoxGeometry(18,.3,.3), dark); b2.position.set(0,2.4+hw+2.6,0); if(s>0) st.add(b2); }
  const hub=new THREE.Group(); hub.position.set(10,30,-62); st.add(hub);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.2,52,24), metal); body.rotation.z=Math.PI/2; hub.add(body);
  for(const x of [-26,26]){ const cap=new THREE.Mesh(new THREE.SphereGeometry(4.2,20,14), metal); cap.position.x=x; hub.add(cap); }
  for(const [x,r,l] of [[-12,3.2,10],[8,2.8,9],[18,3.4,8]]){ const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,16), dark); m.position.set(x,0,0); m.rotation.x=Math.PI/2; hub.add(m); }
  const wheel=new THREE.Group(); wheel.position.x=-2; hub.add(wheel);
  const tor=new THREE.Mesh(new THREE.TorusGeometry(24,2.6,16,72), metal); tor.rotation.y=Math.PI/2; wheel.add(tor);
  const win=new THREE.Mesh(new THREE.TorusGeometry(24,2.65,6,72,Math.PI*2), new THREE.MeshBasicMaterial({color:'#ffe9a8', wireframe:true, transparent:true, opacity:.35})); win.rotation.y=Math.PI/2; wheel.add(win);
  for(let i=0;i<4;i++){ const sp=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,48,8), dark); sp.rotation.x=i*Math.PI/4; wheel.add(sp); }
  const panTex=canvasTex(128,128,g=>{ g.fillStyle='#14306e'; g.fillRect(0,0,128,128); g.strokeStyle='#5d86d8'; g.lineWidth=2; for(let x=0;x<=128;x+=16){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,128); g.stroke(); } for(let y=0;y<=128;y+=32){ g.beginPath(); g.moveTo(0,y); g.lineTo(128,y); g.stroke(); } });
  const panM=new THREE.MeshLambertMaterial({map:panTex, side:THREE.DoubleSide});
  for(const x of [-20,20]){ const truss=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.2,90), dark); truss.position.set(x,0,0); hub.add(truss);
    for(const z of [-30,-15,15,30]){ const p=new THREE.Mesh(new THREE.BoxGeometry(10,.2,13), panM); p.position.set(x,0,z); p.rotation.x=.25; hub.add(p); } }
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1,12), dark); place(tube,[0,hw+4.6,-hw-2.2],[10,26,-60]); st.add(tube);
  const blink=[]; for(const [x,y,z,c] of [[26,6,0,'#ff3b3b'],[-26,6,0,'#3bff6a'],[-20,0,45,'#ff3b3b'],[20,0,-45,'#3bff6a'],[-20,0,-45,'#ffffff'],[20,0,45,'#ffffff']]){ const b=new THREE.Mesh(new THREE.SphereGeometry(.9,10,8), new THREE.MeshBasicMaterial({color:c})); b.position.set(x,y,z); hub.add(b); blink.push(b); }
  { const sp=neonSprite('ZIEL · RAUMSTATION','#7fe0ff',12); sp.position.set(0,hw+7.5,0); st.add(sp); }
  { const cc2=canvasTex(16,128,g=>{ for(let i=0;i<16;i++) for(let j=0;j<2;j++){ g.fillStyle=(i+j)%2?'#111':'#fff'; g.fillRect(j*8,i*8,8,8); } });
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,ROAD_W), new THREE.MeshBasicMaterial({map:cc2})); fl.rotation.x=-Math.PI/2; fl.position.y=.15; st.add(fl); }

  // Feuerwerk (startet bei Workout-Ende)
  const NB=9, NP=170, fp=new Float32Array(NB*NP*3), fc=new Float32Array(NB*NP*3), fg=new THREE.BufferGeometry();
  fg.setAttribute('position',new THREE.BufferAttribute(fp,3)); fg.setAttribute('color',new THREE.BufferAttribute(fc,3));
  const fw=new THREE.Points(fg, new THREE.PointsMaterial({size:1.6, map:canvasTex(32,32,g=>{ const gr=g.createRadialGradient(16,16,0,16,16,16); gr.addColorStop(0,'#fff'); gr.addColorStop(.35,'rgba(255,255,255,.8)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,32,32); }), vertexColors:true, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, fog:false})); fw.visible=false; fw.frustumCulled=false; world.add(fw);
  const dirs=[]; for(let i=0;i<NB*NP;i++){ const u=rnd()*2-1, a=rnd()*Math.PI*2, s=Math.sqrt(1-u*u), sp=.75+rnd()*.25; dirs.push([Math.cos(a)*s*sp,u*sp,Math.sin(a)*s*sp]); }

  buildRiders();
  anim.space={edge, halo, wave:{mat:waveMat,t0:null,d0:0}, wheel, blink, fw:{pts:fw, pos:fp, col:fc, dirs, NB, NP, t0:null, bursts:null}};
}
function poseSpace(dt,t){
  const A=anim.space; if(!A) return;
  const br=0.5+0.5*Math.sin(t*2*Math.PI/6); A.edge.color.setScalar(0.82+0.18*br); A.halo.opacity=0.16+0.06*br; // sanftes Atmen, alle 6 s
  const Wv=A.wave; if(Wv.t0!=null){ const T=t-Wv.t0; Wv.mat.uniforms.uFront.value=Wv.d0+T*90; Wv.mat.uniforms.uAmp.value=T<.15?T/.15:Math.max(0,1-(T-.15)/2.85); if(T>3.2){ Wv.t0=null; Wv.mat.uniforms.uAmp.value=0; } }
  A.wheel.rotation.x=t*0.12; A.blink.forEach((b,i)=>b.visible=Math.sin(t*3+i*1.7)>0);
  updStreaks(dt, race.paused||(me.done&&!me.free)?0:me.v);
  const F=A.fw; if(F.t0==null){ F.pts.visible=false; return; }
  if(!F.bursts){ const hd=headingAt(R,me.d), [x,z]=posAt(R,me.d), y=roadY(me.d), q=rng(Math.floor(t*1000)), pal=['#ff4f6a','#ffd23a','#5fd4ff','#c04bff','#2fe07a','#ff8a2a','#ffffff'];
    F.bursts=[]; for(let b=0;b<F.NB;b++){ const ah=25+q()*55, la=(q()-.5)*60; F.bursts.push({x:x+Math.cos(hd)*ah-Math.sin(hd)*la, y:y+14+q()*22, z:z+Math.sin(hd)*ah+Math.cos(hd)*la, t:b*0.45+q()*0.3, c:new THREE.Color(pal[Math.floor(q()*pal.length)]), v:12+q()*8}); } }
  const T=t-F.t0; let any=false;
  F.bursts.forEach((b,bi)=>{ const tt=T-b.t, life=2.4;
    for(let i=0;i<F.NP;i++){ const k=(bi*F.NP+i)*3; if(tt<0||tt>life){ F.col[k]=F.col[k+1]=F.col[k+2]=0; continue; } any=true;
      const dr=F.dirs[bi*F.NP+i], s=b.v*(1-Math.exp(-2.2*tt))/2.2, fade=Math.pow(1-tt/life,1.5)*(0.7+0.3*Math.sin(tt*30+i));
      F.pos[k]=b.x+dr[0]*s; F.pos[k+1]=b.y+dr[1]*s-1.5*tt*tt; F.pos[k+2]=b.z+dr[2]*s; F.col[k]=b.c.r*fade; F.col[k+1]=b.c.g*fade; F.col[k+2]=b.c.b*fade; } });
  F.pts.visible=any||T<1; F.pts.geometry.attributes.position.needsUpdate=true; F.pts.geometry.attributes.color.needsUpdate=true;
}

