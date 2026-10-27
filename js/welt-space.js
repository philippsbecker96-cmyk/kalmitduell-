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
  G.children.forEach(o=>{ if(o===ringM) return; o.renderOrder=o.isMesh?-2:-3; o.material.depthTest=false; if(o.isSprite) o.material.transparent=false; }); // Hintergrund zuerst und ohne Tiefentest: die ferne Mondkugel verdeckt Sterne und Nebel
  return G; })();
scene.add(camera);
// Lichtstreifen bei hohem Tempo (hängen an der Kamera)
const streaks=(()=>{ const N=90, p=new Float32Array(N*6), seed=[]; const q=rng(91);
  for(let i=0;i<N;i++){ const a=q()*Math.PI*2, r=2.5+q()*7; seed.push({x:Math.cos(a)*r, y:Math.sin(a)*r*.7, z:-5-q()*70, l:2+q()*5}); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.LineSegments(g, new THREE.LineBasicMaterial({color:0xbfe6ff, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, fog:false}));
  m.frustumCulled=false; m.visible=false; camera.add(m); return {m,seed,p}; })();
// w = Warp (0…1, Schub): ruhiger – halb so viele Streifen, höchstens doppelt so schnell, etwas länger
function updStreaks(dt,v,w=0){ const S=streaks; v=Math.min(v,20); const op=Math.min(1,Math.max(0,Math.min(1,(v-8)/8))*0.7+w*0.1), n=Math.round(S.seed.length*(1-w*.5)); S.m.material.opacity=op; S.m.visible=op>0.01; if(!S.m.visible) return;
  S.seed.forEach((o,i)=>{ o.z+=v*1.6*(1+w)*dt; if(o.z>1){ o.z=-75; } S.p.set([o.x,o.y,o.z, o.x,o.y,o.z-(i<n?o.l*(0.5+v/12)*(1+w*1.2):0)], i*6); }); S.m.geometry.attributes.position.needsUpdate=true; }
const spaceWarp=()=>clampN(((me.sk||1)-2.75)/6,0,1);
function neonSprite(text,col,w){ const tex=canvasTex(512,128,g=>{ g.font='800 80px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    g.shadowColor=col; g.shadowBlur=26; g.fillStyle=col; g.fillText(text,256,66,480); g.fillText(text,256,66,480); g.shadowBlur=6; g.fillStyle='#ffffff'; g.fillText(text,256,66,480); });
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthWrite:false, fog:false})); sp.scale.set(w,w/4,1); return sp; }

/* ===== Raketenantrieb ab 80 % FTP: zwei Düsen hinter dem Sattel, Flamme wächst mit der Leistung (Blau → Orange → Violett), Zündstoß, Funken, Schein auf der Bahn ===== */
const RAK_COL=['#5fb4ff','#ff8a2a','#c04bff'].map(c=>new THREE.Color(c)), RAK_NF=128;
const rakGlowTex=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.35,'rgba(255,255,255,.45)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
function rakete(r){ const G=new THREE.Group(), add=m=>(G.add(m),m), metall=new THREE.MeshLambertMaterial({color:'#a3a9b4'}), dunkel=new THREE.MeshLambertMaterial({color:'#2a2c33'});
  const glut=(col,op)=>new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false});
  const kegel=(rad,mat,z)=>{ const g=new THREE.ConeGeometry(rad,1,10,1,true); g.translate(0,-.5,0); const m=add(new THREE.Mesh(g,mat)); m.rotation.z=-Math.PI/2; m.position.set(-.41,.8,z); m.visible=false; return m; }; // Spitze nach hinten (−x), Länge = scale.y
  const fl=[]; for(const z of [-.1,.1]){ const rohr=add(cyl(.045,metall)); place(rohr,[-.06,.8,z],[-.34,.8,z]);
    const du=add(new THREE.Mesh(new THREE.CylinderGeometry(.045,.066,.08,10,1,true),dunkel)); du.rotation.z=Math.PI/2; du.position.set(-.37,.8,z);
    const halt=add(cyl(.012,dunkel)); place(halt,[-.2,.8,z],[-.2,.86,0]);
    fl.push({aus:kegel(.065,glut('#ffffff',.75),z), kern:kegel(.035,glut('#fff4dc',1),z), fan:kegel(.065,glut('#ffffff',.4),z)}); } // fan: Fächer am Flammenende ab 120 %
  const glow=add(new THREE.Sprite(new THREE.SpriteMaterial({map:rakGlowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}))); glow.position.set(-.5,.8,0); glow.visible=false;
  const boden=add(new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:rakGlowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}))); boden.rotation.x=-Math.PI/2; boden.position.set(-1.6,.02,0); boden.visible=false;
  const pos=new Float32Array(RAK_NF*3), col=new Float32Array(RAK_NF*3), pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3)); pg.setAttribute('color',new THREE.BufferAttribute(col,3));
  const pts=add(new THREE.Points(pg,new THREE.PointsMaterial({size:.07,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}))); pts.frustumCulled=false;
  r.tilt.add(G); r.rak={fl,glow,boden,pts,pos,col,f:Array.from({length:RAK_NF},()=>({l:0,L:1,vx:0,vy:0,vz:0})),q:0,qc:0,stoss:0,an:false,acc:0,c:new THREE.Color()}; }
function rakTick(r,p,dt,t){ const K=r&&r.rak; if(!K) return; const an=p>=80, qz=an?Math.min(1,(p-80)/70):0; // 80 % klein und blau, 115 % orange, 150 % groß und violett
  if(an&&!K.an) K.stoss=1; K.an=an; K.q+=((an?.3+.7*qz:0)-K.q)*Math.min(1,dt*6); K.qc+=(qz-K.qc)*Math.min(1,dt*3); K.stoss=Math.max(0,K.stoss-dt*2.5);
  const s=K.q+K.stoss*.7, vis=s>.02, c=K.c, h=K.qc*2, fz=Math.max(0,(K.qc-.57)/.43); c.copy(RAK_COL[h<1?0:1]).lerp(RAK_COL[h<1?1:2],h<1?h:h-1);
  K.fl.forEach((f,i)=>{ const fk=1+.16*Math.sin(t*43+i*2.1)+.09*Math.sin(t*71+i), L=(.3+1.5*s)*fk, w=1+s*3, wk=1+s*1.6; f.aus.visible=f.kern.visible=vis; f.aus.scale.set(w,L,w); f.kern.scale.set(wk,L*.55,wk); f.aus.material.color.copy(c);
    const fw=w*(1.2+1.8*fz)*(1+.15*Math.sin(t*37+i*1.7)); f.fan.visible=vis&&fz>.01; f.fan.scale.set(fw,L*.45,fw); f.fan.position.x=-.41-L*.6; f.fan.material.color.copy(c); f.fan.material.opacity=.4*fz; }); // Fächer öffnet sich hinten, 120 % → 150 % breiter (Fächer im Verhältnis zur Flamme etwas kleiner, sonst zu riesig)
  K.glow.visible=K.boden.visible=vis; K.glow.material.color.copy(c); K.glow.material.opacity=Math.min(1,s*1.2); K.glow.scale.setScalar(.5+s*1.3);
  K.boden.material.color.copy(c); K.boden.material.opacity=Math.min(.7,s*.6); K.boden.scale.set(2.4+s*3,1.4+s*1.2,1);
  K.acc+=vis?dt*(70+130*K.qc)*s:0; const fs=1+K.qc*.8, fq=1+K.qc*1.5; K.pts.material.size=.07+.05*K.qc; // Funken: 70 (80 %) bis 200 (150 %) je Sekunde, fliegen 0,3–0,6 s nach hinten weg, bei mehr Leistung schneller und breiter
  for(const [i,o] of K.f.entries()){ if(o.l<=0&&K.acc>=1){ K.acc--; const z=i%2?.1:-.1; Object.assign(o,{l:.3+Math.random()*.3,vx:(-5-Math.random()*7)*fs,vy:(Math.random()-.4)*1.2*fq,vz:(Math.random()-.5)*1.2*fq}); o.L=o.l; K.pos.set([-.45,.8,z],i*3); }
    if(o.l>0){ o.l-=dt; K.pos[i*3]+=o.vx*dt; K.pos[i*3+1]+=o.vy*dt; K.pos[i*3+2]+=o.vz*dt; const a=Math.max(0,o.l/o.L), m=a*.6; K.col.set([(c.r+(1-c.r)*m)*a,(c.g+(1-c.g)*m)*a,(c.b+(1-c.b)*m)*a],i*3); } else K.col.set([0,0,0],i*3); } // Funken erst hell, dann in der Flammenfarbe verglühen
  K.acc=Math.min(K.acc,3); K.pts.geometry.attributes.position.needsUpdate=true; K.pts.geometry.attributes.color.needsUpdate=true; }

/* ===== Regenbogen-Modus: Bahn fortlaufend bunt, Farben fließen dir sanft entgegen (Schalter rbOn in der Lobby, ersetzt die Intensitätsfarben) ===== */
const RB={an:false, uT:{value:0}, uOn:{value:0}};
const rbMat=m=>{ m.onBeforeCompile=sh=>{ sh.uniforms.uRbT=RB.uT; sh.uniforms.uRbOn=RB.uOn;
  sh.vertexShader='attribute float aD; uniform float uRbT; uniform float uRbOn;\n'+sh.vertexShader.replace('#include <color_vertex>','#include <color_vertex>\n#ifdef USE_COLOR\n float rbH=fract(aD/140.0+uRbT); vec3 rbC=clamp(abs(mod(rbH*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0); rbC=mix(rbC,vec3(1.0),0.12)*(0.9+0.1*sin(aD/18.0+uRbT*37.699));\n vColor.rgb=mix(vColor.rgb,rbC*max(max(color.r,color.g),color.b),uRbOn);\n#endif'); }; return m; };
function buildSpace(){
  scene.fog.near=350; scene.fog.far=3800;
  const n=R.xs.length, rnd=rng(2024), up=new THREE.Vector3(0,1,0);
  // Farbe je Punkt aus der Intensität des Abschnitts
  const cols=new Float32Array(n*3), tc=new THREE.Color(), cache={};
  for(let i=0;i<n;i++){ const p=segOf(Math.min(R.len-0.01,i*STEP)).p??-1, k=SPACE_COL(p); const c=cache[k]||(cache[k]=new THREE.Color(k)); cols.set([c.r,c.g,c.b],i*3); }
  const F=i=>{ const d=i*STEP, hd=headingAt(R,d); return {x:R.xs[i], z:R.ys[i], y:roadY(d), nx:-Math.sin(hd), nz:Math.cos(hd), d}; };
  const frames=[]; for(let i=0;i<n;i++) frames.push(F(i));
  const ribbon=(fn,mat,uvLen=8,colScale=1)=>{ const p=new Float32Array(n*6), c=new Float32Array(n*6), uv=new Float32Array(n*4), dd=new Float32Array(n*2), id=[];
    for(let i=0;i<n;i++){ const f=frames[i], [a,b]=fn(f); p.set([...a,...b],i*6); const r=cols[i*3]*colScale, g=cols[i*3+1]*colScale, bl=cols[i*3+2]*colScale; c.set([r,g,bl,r,g,bl],i*6);
      uv.set([0,f.d/uvLen,1,f.d/uvLen],i*4); dd[i*2]=dd[i*2+1]=f.d; if(i<n-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setAttribute('aD',new THREE.BufferAttribute(dd,1)); g.setIndex(id);
    const m=new THREE.Mesh(g,mat); m.frustumCulled=false; world.add(m); return m; };
  const P=(f,u,h)=>[f.x+f.nx*u, f.y+h, f.z+f.nz*u], hw=ROAD_W/2;
  // Fahrbahn: dunkel getönt, Querstreifen alle 8 m
  const rtex=canvasTex(64,128,g=>{ g.fillStyle='#3a3a44'; g.fillRect(0,0,64,128); g.fillStyle='rgba(255,255,255,.08)'; for(let x=8;x<64;x+=8) g.fillRect(x,0,1,128);
    g.fillStyle='#d8d8e0'; g.fillRect(0,0,64,5); }); // ohne Mittellinie
  rtex.wrapT=THREE.RepeatWrapping; rtex.anisotropy=8;
  ribbon(f=>[P(f,-hw,.12),P(f,hw,.12)], rbMat(new THREE.MeshBasicMaterial({map:rtex, vertexColors:true, side:THREE.DoubleSide})), 8);
  // Seitenwände der Bahn und Leuchtkanten
  const skin=new THREE.MeshBasicMaterial({color:'#15161f', side:THREE.DoubleSide});
  for(const s of [-1,1]) ribbon(f=>[P(f,s*hw,.12),P(f,s*hw,-.35)], skin);
  const edge=rbMat(new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.DoubleSide, polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1}));
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
  const halo=rbMat(new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.DoubleSide, transparent:true, opacity:.22, blending:THREE.AdditiveBlending, depthWrite:false}));
  ribbon(f=>[P(f,-hw-5,-.7),P(f,hw+5,-.7)], halo);

  const inst=(geo,mat,list,fn)=>{ if(!list.length) return null; const im=new THREE.InstancedMesh(geo,mat,list.length), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), s=new THREE.Vector3(), p=new THREE.Vector3(), c=new THREE.Color(), e=new THREE.Euler();
    list.forEach((o,i)=>{ fn(o,p,q,s,c,e); m4.compose(p,q,s); im.setMatrixAt(i,m4); im.setColorAt(i,c); }); im.instanceMatrix.needsUpdate=true; im.instanceColor.needsUpdate=true; world.add(im); return im; };
  const Lw=R.len-R.ring, fr=d=>{ d=Math.max(0,Math.min(R.len,d)); const i=Math.min(n-1,Math.round(d/STEP)); return frames[i]; };

  // Asteroiden: verstreut, dazu ein dichter Gürtel
  const ast=[], beltA=Lw*0.42, beltB=beltA+Math.min(900,Lw*0.25);
  const MK=R.M, imMond=(x,y,z,r=0)=>!!MK&&Math.hypot(x-MK.cx,y-MK.cy,z-MK.cz)<MK.RP+r+40; // nichts in die Mondkugel stecken
  for(let d=40; d<Lw-60; d+=6){ const f=fr(d), belt=d>beltA&&d<beltB;
    const tries=belt?4:(rnd()<.3?1:0);
    for(let t=0;t<tries;t++){ const side=rnd()<.5?-1:1, off=side*(belt?9+rnd()*70:14+rnd()*140), s=belt?(rnd()<.08?3+rnd()*5:0.4+rnd()*2.2):(rnd()<.1?5+rnd()*9:0.6+rnd()*3);
      const off2=s>3?Math.sign(off)*Math.max(Math.abs(off),35+s*4):off; // große Brocken nicht direkt an der Bahn
      const o={x:f.x+f.nx*off2+(rnd()-.5)*6, z:f.z+f.nz*off2+(rnd()-.5)*6, y:f.y+(belt?(rnd()-.5)*22:(rnd()-.55)*80), s, r1:rnd()*6, r2:rnd()*6, c:rnd()}; if(!imMond(o.x,o.y,o.z,s)) ast.push(o); }
    if(ast.length>7000) break; }
  inst(new THREE.DodecahedronGeometry(1,0), new THREE.MeshLambertMaterial({color:'#ffffff'}), ast, (o,p,q,s,c,e)=>{ p.set(o.x,o.y,o.z); q.setFromEuler(e.set(o.r1,o.r2,o.r1*.5)); s.set(o.s,o.s*(.7+o.c*.4),o.s*(.8+o.c*.3)); c.set(o.c<.33?'#8a7f76':o.c<.66?'#6f6a66':'#9a8670'); });
  if(beltB<Lw-100){ const f=fr(beltA-30), sp=neonSprite('ASTEROIDENGÜRTEL','#ffb03a',9); sp.position.set(f.x,f.y+7,f.z); world.add(sp); }

  // Planeten entlang der Strecke
  const ptex=(kind,seed)=>canvasTex(256,128,g=>{ const q=rng(seed), hue=q()*360;
    if(kind==='gas'){ for(let y=0;y<128;y+=2){ const t=y/128; g.fillStyle=`hsl(${hue+Math.sin(t*17+q())*18},${50+q()*20}%,${45+Math.sin(t*29)*12+q()*6}%)`; g.fillRect(0,y,256,2); } }
    else { g.fillStyle=`hsl(${hue},${25+q()*20}%,${42+q()*12}%)`; g.fillRect(0,0,256,128); for(let i=0;i<70;i++){ const x=q()*256, y=q()*128, r=2+q()*12; g.fillStyle=`rgba(0,0,0,${.12+q()*.15})`; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.strokeStyle='rgba(255,255,255,.12)'; g.lineWidth=1.5; g.beginPath(); g.arc(x-1,y-1,r,0,7); g.stroke(); } } });
  let side=1, k=0;
  for(let d=900; d<Lw-400; d+=2200+rnd()*900, side=-side, k++){ const f=fr(d), off=side*(320+rnd()*380), rad=70+rnd()*130, kind=rnd()<.55?'gas':'rock', py=f.y-60+rnd()*240; if(imMond(f.x+f.nx*off,py,f.z+f.nz*off,rad*2.2)) continue;
    const pl=new THREE.Mesh(new THREE.SphereGeometry(rad,40,28), new THREE.MeshLambertMaterial({map:ptex(kind,500+k)})); pl.position.set(f.x+f.nx*off, py, f.z+f.nz*off); pl.rotation.set(rnd(),rnd()*6,rnd()*.5); world.add(pl);
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

  const mond=buildMond(fr);
  buildRiders(); RKEYS.forEach(k=>rakete(riders3d[k]));
  anim.space={mond, edge, halo, wave:{mat:waveMat,t0:null,d0:0}, wheel, blink, fw:{pts:fw, pos:fp, col:fc, dirs, NB, NP, t0:null, bursts:null}};
}
function poseSpace(dt,t){
  const A=anim.space; if(!A) return;
  const br=0.5+0.5*Math.sin(t*2*Math.PI/6); A.edge.color.setScalar(0.82+0.18*br); A.halo.opacity=0.16+0.06*br; // sanftes Atmen, alle 6 s
  RB.uT.value=(t*0.06)%1; RB.uOn.value+=((RB.an?1:0)-RB.uOn.value)*Math.min(1,dt*2); // Regenbogen: ein Durchlauf in ~17 s, Ein-/Ausblenden über ~1 s
  const Wv=A.wave; if(Wv.t0!=null){ const T=t-Wv.t0; Wv.mat.uniforms.uFront.value=Wv.d0+T*90; Wv.mat.uniforms.uAmp.value=T<.15?T/.15:Math.max(0,1-(T-.15)/2.85); if(T>3.2){ Wv.t0=null; Wv.mat.uniforms.uAmp.value=0; } }
  if(A.mond){ A.mond.nah.visible=me.d>A.mond.a2-1500&&me.d<A.mond.b2+1500; poseMond(A.mond,dt,t); } // Kugel immer, Oberfläche nur in der Nähe
  A.wheel.rotation.x=t*0.12; A.blink.forEach((b,i)=>b.visible=Math.sin(t*3+i*1.7)>0);
  updStreaks(dt, race.paused||(me.done&&!me.free)?0:me.v, race.paused?0:spaceWarp());
  const lauf=race.state==='run'&&!race.paused, rdt=race.paused?0:dt; // Raketenantrieb: % FTP aus den echten Watt, Gegner online mit seiner FTP
  rakTick(riders3d[myKey], lauf&&!(me.done&&!me.free)?curPower()/ftp()*100:0, rdt, t);
  if(opp.active&&oppKey!==myKey) rakTick(riders3d[oppKey], lauf&&!opp.done&&opp.watt?opp.watt/(opp.ftp||ftp())*100:0, rdt, t);
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


/* ===== Mond: nach 20 % der Workout-Zeit ~2 min Fahrt über eine Mondkugel (Zone R.def.mond aus spaceDef, Kurven über mz dort), Bahnhöhe aus prepMond (Anflug hinab, Abflug hinauf), Kugel schon von Weitem zu sehen, Oberfläche mit Kratern nur im Streifen an der Bahn; Riesenkrater im großen Bogen, Mondfähre mit Astronauten, die die Pfalz-Flagge hissen, Erde am Himmel ===== */
// Kugel unter die Zone legen, Bahnhöhe dort und im An-/Abflug in r.M.py, dahinter Versatz r.M.off (liest roadY); die übrige Bahn bleibt mindestens 25 m über der Kugel
function prepMond(r){ r.M=null; const M0=r.def.mond; if(!M0) return; const a=M0.d0*r.kf, b=M0.d1*r.kf, Lw=r.len-r.ring;
  const seg=d=>{ const s=r.segs; let lo=0, hi=s.length-1; while(lo<hi){ const m=(lo+hi+1)>>1; if(s[m].d0<=d) lo=m; else hi=m-1; } return s[lo]; }, ve=d=>{ const s=seg(d); return s.ve0+(d-s.d0)*s.vg/100; };
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(let d=a; d<=b; d+=20){ const [x,z]=posAt(r,d); x0=Math.min(x0,x); x1=Math.max(x1,x); z0=Math.min(z0,z); z1=Math.max(z1,z); }
  const cx=(x0+x1)/2, cz=(z0+z1)/2; let rm=0; for(let d=a; d<=b; d+=20){ const [x,z]=posAt(r,d); rm=Math.max(rm,Math.hypot(x-cx,z-cz)); }
  const RP=Math.max(5000,Math.min(9000,rm/.22)), kug=(x,z)=>{ const q=RP*RP-(x-cx)**2-(z-cz)**2; return q>0?Math.sqrt(q):-1e9; }, S=d=>{ const [x,z]=posAt(r,d); return kug(x,z); }; // Radius: Bahn auf dem Mond höchstens ~22 % steil
  const frei=(d0,d1,f)=>{ let c=1e9; for(let d=d0; d<=d1; d+=10){ const [x,z]=posAt(r,d), h=kug(x,z); if(h>-1e8) c=Math.min(c,f(d,h)); } return c; }; // übrige Bahn mindestens 25 m über der Kugel
  // Anflug: immer hinab auf den Mond, höchstens ~22 % im Schnitt (bis 2,5 km lang)
  let ha=800, a2=a, cy=0; for(let it=0; it<4; it++){ a2=Math.max(60,a-ha); cy=Math.min(ve(a)-S(a), ve(a2)-S(a)-30, frei(0,a2,(d,h)=>ve(d)-25-h)); ha=Math.min(2500,Math.max(800,(ve(a2)-cy-S(a))/.22)); }
  // Abflug: danach fährt die Bahn mit ihren eigenen Steigungen von der Abflughöhe aus weiter (Versatz off), bei Bedarf höher, damit sie nicht in die Kugel taucht
  const Y=d=>cy+S(d), yB=Y(b), ex=Math.max(0,-frei(b+300,r.len,(d,h)=>ve(d)-ve(b)+yB-cy-h-25)), off=yB-ve(b)+ex, b2=Math.min(Lw-60,b+Math.min(2500,Math.max(500,ex/.2)));
  const hm=(t,p0,m0,p1,m1,h)=>{ const t2=t*t, t3=t2*t; return (2*t3-3*t2+1)*p0+(t3-2*t2+t)*h*m0+(-2*t3+3*t2)*p1+(t3-t2)*h*m1; };
  const ha2=a-a2, hb=b2-b, ya=ve(a2), ma=seg(a2).vg/100, yA=Y(a), mA=(Y(a+2)-Y(a-2))/4, mB=(Y(b+2)-Y(b-2))/4, yb=ve(b2)+off, mb=seg(b2).vg/100;
  const n=Math.ceil((b2-a2)/STEP)+1, py=new Float32Array(n);
  for(let i=0;i<n;i++){ const d=a2+i*STEP; let y=d<a?hm((d-a2)/ha2,ya,ma,yA,mA,ha2):d<=b?Y(d):hm(Math.min(1,(d-b)/hb),yB,mB,yb,mb,hb); if(d<a||d>b) y=Math.max(y,Y(d)+.3); py[i]=y; } // weicher Übergang, nie in die Kugel
  r.M={a,b,a2,b2:a2+(n-1)*STEP,cx,cz,cy,RP,py,off,krater:M0.krater*r.kf};
}
function buildMond(fr){ const M=R.M; if(!M) return null; const {a,b,cx,cz,cy,RP}=M, q=rng(1969), W=600, C=12, CG=48, BK=160, TIEF=30, hw=ROAD_W/2;
  const G=new THREE.Group(), nah=new THREE.Group(); G.userData.ohneBoden=true; G.add(nah); world.add(G); camera.far=30000; camera.updateProjectionMatrix(); // Kugel schon von Weitem
  const kugel=(x,z)=>{ const s=RP*RP-(x-cx)**2-(z-cz)**2; return cy+(s>0?Math.sqrt(s):0); }, sm=t=>{ t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
  // Kugel mit Kratertextur, 30 m unter der Oberfläche an der Bahn (der Streifen taucht am Rand darunter), Pol zur Seite gedreht
  const kt=canvasTex(1024,512,g=>{ const r=rng(7); g.fillStyle='#9a9a97'; g.fillRect(0,0,1024,512);
    for(let i=0;i<14;i++){ g.fillStyle=`rgba(60,60,64,${.15+r()*.2})`; g.beginPath(); g.ellipse(r()*1024,60+r()*392,40+r()*140,20+r()*70,r()*3,0,7); g.fill(); }
    for(let i=0;i<700;i++){ const x=r()*1024, y=r()*512, rr=1.5+Math.pow(r(),3)*28; g.fillStyle=`rgba(0,0,0,${.12+r()*.18})`; g.beginPath(); g.arc(x,y,rr,0,7); g.fill(); g.strokeStyle='rgba(255,255,255,.16)'; g.lineWidth=Math.max(1,rr*.18); g.beginPath(); g.arc(x-rr*.12,y-rr*.12,rr,0,7); g.stroke(); } });
  const ku=new THREE.Mesh(new THREE.SphereGeometry(RP-TIEF,160,96),new THREE.MeshLambertMaterial({map:kt, fog:false})); ku.position.set(cx,cy,cz); ku.rotation.x=Math.PI/2; G.add(ku);
  // Bahnpunkte (Zone mit An- und Abflug) alle 8 m, in Fächern zu 160 m für die Abstandssuche
  const P=[]; for(let d=M.a2; d<=M.b2; d+=8){ const f=fr(d); P.push([f.x,f.z,f.y]); }
  const fk=(i,j)=>i*100003+j, fach=new Map(); for(let i=0;i<P.length-1;i++){ const k=fk(Math.floor((P[i][0]+P[i+1][0])/2/BK),Math.floor((P[i][1]+P[i+1][1])/2/BK)); let L=fach.get(k); if(!L) fach.set(k,L=[]); L.push(i); }
  const naechst=(x,z,ring)=>{ let best=1e18, y=0; const bx=Math.floor(x/BK), bz=Math.floor(z/BK);
    for(let u=-ring;u<=ring;u++) for(let v=-ring;v<=ring;v++){ const L=fach.get(fk(bx+u,bz+v)); if(!L) continue;
      for(const i of L){ const p=P[i], c=P[i+1], ex=c[0]-p[0], ez=c[1]-p[1], l2=ex*ex+ez*ez||1, t=Math.max(0,Math.min(1,((x-p[0])*ex+(z-p[1])*ez)/l2)), dx=p[0]+ex*t-x, dz=p[1]+ez*t-z, dd=dx*dx+dz*dz; if(dd<best){ best=dd; y=p[2]+(c[2]-p[2])*t; } } }
    return [Math.sqrt(best),y]; };
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(const p of P){ x0=Math.min(x0,p[0]); x1=Math.max(x1,p[0]); z0=Math.min(z0,p[1]); z1=Math.max(z1,p[1]); } x0-=W; x1+=W; z0-=W; z1+=W;
  // grobes Abstandsgitter (48 m), fein nur nahe der Bahn
  const gx=Math.ceil((x1-x0)/CG)+2, gz=Math.ceil((z1-z0)/CG)+2, GD=new Float32Array(gx*gz), GY=new Float32Array(gx*gz);
  for(let j=0;j<gz;j++) for(let i=0;i<gx;i++){ const [dn,y]=naechst(x0+i*CG,z0+j*CG,5); GD[j*gx+i]=Math.min(dn,9999); GY[j*gx+i]=y; }
  const dist=(x,z)=>{ const fx=(x-x0)/CG, fz=(z-z0)/CG, i=Math.max(0,Math.min(gx-2,Math.floor(fx))), j=Math.max(0,Math.min(gz-2,Math.floor(fz))), u=fx-i, v=fz-j, k=j*gx+i, bl=A=>(A[k]*(1-u)+A[k+1]*u)*(1-v)+(A[k+gx]*(1-u)+A[k+gx+1]*u)*v;
    const dn=bl(GD); if(dn<150){ const e=naechst(x,z,1); if(e[0]<150) return e; } return [dn,bl(GY)]; };
  // Krater: viele kleine an der Bahn entlang, dazu der Riesenkrater links im großen Bogen
  const gk=fr(M.krater), GR=150, gross={x:gk.x+gk.nx*(GR+hw+24), z:gk.z+gk.nz*(GR+hw+24), r:GR, t:24}, kfach=new Map();
  for(let i=0, nK=Math.round(P.length*.9); i<nK; i++){ const p=P[Math.floor(q()*P.length)], an=q()*6.283, ab=q()*W, r=8+Math.pow(q(),3)*62, o={x:p[0]+Math.cos(an)*ab, z:p[1]+Math.sin(an)*ab, r, t:r*.2};
    const k=fk(Math.floor(o.x/BK),Math.floor(o.z/BK)); let L=kfach.get(k); if(!L) kfach.set(k,L=[]); L.push(o); }
  const k1=(k,x,z,acc)=>{ const dx=x-k.x, dz=z-k.z; if(Math.abs(dx)>k.r*1.7||Math.abs(dz)>k.r*1.7) return; const u=Math.sqrt(dx*dx+dz*dz)/k.r;
    if(u<1){ acc[0]-=k.t*(1-u*u); acc[1]-=.12*(1-u); } acc[0]+=k.t*.38*Math.exp(-(((u-1)/.22)**2)); if(Math.abs(u-1)<.2) acc[1]+=.06; };
  const krater=(x,z)=>{ const acc=[0,0], bx=Math.floor(x/BK), bz=Math.floor(z/BK); k1(gross,x,z,acc); for(let u=-1;u<=1;u++) for(let v=-1;v<=1;v++){ const L=kfach.get(fk(bx+u,bz+v)); if(L) for(const k of L) k1(k,x,z,acc); } return acc; };
  // Höhe: Kugel mit Kratern, an der Bahn bündig (abgetragen oder aufgefüllt, aber kein Damm unter dem hohen Anflug), Rand taucht unter die Kugel
  const H=(x,z,dn,yr)=>{ const [kh,ks]=krater(x,z), wk=sm((dn-hw-6)/20), fl=(Math.sin(x*.07)*Math.cos(z*.06)+Math.sin(x*.023+z*.031))*.5;
    let h=kugel(x,z)+(kh+fl)*wk; const dd=yr-.22-h, k=sm((dn-hw-1)/28); h+=dd<0?dd*(1-k):dd*(1-k)*Math.max(0,1-(dd-1)/4);
    return [h-45*sm((dn-W+140)/140), ks*wk]; };
  const hoehe=(x,z)=>{ const [dn,yr]=dist(x,z); return H(x,z,dn,yr)[0]; };
  const nx=Math.ceil((x1-x0)/C)+1, nz=Math.ceil((z1-z0)/C)+1, idx=new Int32Array(nx*nz).fill(-1), pos=[], col=[], id=[];
  for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){ const x=x0+i*C, z=z0+j*C, [dn,yr]=dist(x,z); if(dn>W) continue; const [h,s]=H(x,z,dn,yr), g=.6+s+.05*Math.sin(x*.013+Math.cos(z*.011)*2)+(q()-.5)*.04;
    idx[j*nx+i]=pos.length/3; pos.push(x,h,z); col.push(g,g*.98,g*.95); }
  for(let j=0;j<nz-1;j++) for(let i=0;i<nx-1;i++){ const A=idx[j*nx+i], B=idx[j*nx+i+1], Cc=idx[(j+1)*nx+i], D=idx[(j+1)*nx+i+1]; if(A>=0&&B>=0&&Cc>=0&&D>=0) id.push(A,Cc,B, B,Cc,D); }
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); geo.setIndex(id); geo.computeVertexNormals();
  const boden=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true, fog:false})); boden.frustumCulled=false; nah.add(boden);
  // Platz für Fähre und Astronauten: dort, wo man am längsten direkt darauf zufährt (Blick höchstens ~14° neben der Fahrtrichtung, außen in einer Kurve), nicht am Riesenkrater
  let dL=a+(b-a)*.3, sL=1, best=-1; for(let sd=a+300; sd<b-200; sd+=20) for(const si of [-1,1]){ const f=fr(sd), qx=f.x+f.nx*si*(hw+8), qz=f.z+f.nz*si*(hw+8); if(Math.hypot(qx-gross.x,qz-gross.z)<GR+60) continue;
    let lauf=0; for(let d=sd-50; d>Math.max(a-400,sd-1500); d-=10){ const [x,z]=posAt(R,d), w=Math.abs(angDiff(Math.atan2(qz-z,qx-x),headingAt(R,d))); if(w>.25) break; lauf=sd-d; }
    if(lauf>best){ best=lauf; dL=sd; sL=si; } }
  // Felsbrocken neben der Bahn
  const auf=(d,u)=>{ const f=fr(d), x=f.x+f.nx*u, z=f.z+f.nz*u; return [x,hoehe(x,z),z]; };
  const br=[]; for(let i=0, nB=Math.round((b-a)/5); i<nB; i++){ const d=a+q()*(b-a), sd=q()<.5?-1:1, u=sd*(hw+4+Math.pow(q(),1.6)*240), s=q()<.1?1.5+q()*3:.25+q()*1.1; if(sd===sL&&Math.abs(d-dL)<18&&Math.abs(u)<hw+24) continue; const [x,y,z]=auf(d,u); br.push({x,y:y+s*.3,z,s,a:q()*6,b:q()*6,c:q()}); } // Platz um Fähre und Astronauten frei
  const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),new THREE.MeshLambertMaterial({color:'#ffffff'}),br.length), m4=new THREE.Matrix4(), qu=new THREE.Quaternion(), e=new THREE.Euler(), cc=new THREE.Color();
  br.forEach((o,i)=>{ m4.compose(new THREE.Vector3(o.x,o.y,o.z), qu.setFromEuler(e.set(o.a,o.b,0)), new THREE.Vector3(o.s,o.s*.6,o.s*.85)); im.setMatrixAt(i,m4); im.setColorAt(i,cc.setScalar(.5+o.c*.25)); }); nah.add(im);
  // Mondfähre neben der Bahn, davor die Astronauten mit der Pfalz-Flagge (unten)
  { const [x,y,z]=auf(dL+4,sL*(hw+15)), L=new THREE.Group(); L.position.set(x,y,z); L.rotation.y=-headingAt(R,dL)+.6; nah.add(L);
    const gold=new THREE.MeshLambertMaterial({color:'#c99a3c', emissive:'#3a2808'}), grau=new THREE.MeshLambertMaterial({color:'#c9ccd2'}), dunkel=new THREE.MeshLambertMaterial({color:'#2b2e35'});
    const unten=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,1.7,8),gold); unten.position.y=2.1; L.add(unten);
    const oben=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.8,1.9,6),grau); oben.position.y=3.9; L.add(oben);
    for(const wx of [1.2,-1.2]){ const fe=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.1),dunkel); fe.position.set(wx*.5,4.1,1.62); L.add(fe); }
    const sch=new THREE.Mesh(new THREE.ConeGeometry(.6,.3,12,1,true),grau); sch.position.set(.9,5.3,-.4); sch.rotation.x=.6; L.add(sch);
    for(let i=0;i<4;i++){ const w=i*Math.PI/2+Math.PI/4, bx=Math.cos(w), bz=Math.sin(w), bein=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,2.6,6),grau); bein.position.set(bx*2.4,1.1,bz*2.4); bein.rotation.set(-bz*.45,0,bx*.45); L.add(bein);
      const fuss=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.08,12),grau); fuss.position.set(bx*2.95,.04,bz*2.95); L.add(fuss); } }
  // Schild vor der Landung, Erde hoch über dem Horizont voraus
  { const f=fr(a-60), sp=neonSprite('MOND','#e6e9ef',8); sp.position.set(f.x,f.y+7,f.z); nah.add(sp); }
  { const p=fr(a), o=fr(b), dl=Math.hypot(o.x-p.x,o.z-p.z)||1, vx=(o.x-p.x)/dl, vz=(o.z-p.z)/dl;
    const et=canvasTex(512,256,g=>{ const r=rng(42); g.fillStyle='#1d5fb4'; g.fillRect(0,0,512,256);
      for(let i=0;i<26;i++){ const x=r()*512, y=40+r()*176, s=10+r()*40; g.fillStyle=r()<.6?'#3f7f3a':'#9a8550'; g.beginPath(); g.ellipse(x,y,s*1.6,s,r()*3,0,7); g.fill(); }
      g.fillStyle='#f4f7fb'; g.fillRect(0,0,512,18); g.fillRect(0,238,512,18); g.strokeStyle='rgba(255,255,255,.75)'; g.lineCap='round';
      for(let i=0;i<40;i++){ const x=r()*512, y=r()*256; g.lineWidth=3+r()*6; g.beginPath(); g.arc(x,y,12+r()*30,r()*6,r()*6+1.5); g.stroke(); } });
    const er=new THREE.Mesh(new THREE.SphereGeometry(1800,64,40),new THREE.MeshLambertMaterial({map:et, fog:false})); er.position.set(cx+vx*14000, cy+RP+3200, cz+vz*14000); er.rotation.set(.3,0,.4); G.add(er);
    const at=new THREE.Mesh(new THREE.SphereGeometry(1900,64,40),new THREE.MeshBasicMaterial({color:'#6fb6ff', transparent:true, opacity:.22, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.BackSide, fog:false})); at.position.copy(er.position); G.add(at); }
  // Astronauten hissen vor der Mondfähre dicht an der Bahn die Pfalz-Flagge: einer zieht, einer hält den Mast, einer salutiert, einer hüpft und winkt den Fahrern (1,3-fach, damit man sie im Vorbeifahren sieht)
  const dF=dL, fF=fr(dF), hF=headingAt(R,dF), tx=Math.cos(hF), tz=Math.sin(hF), U=sL*(hw+6), sg=sL, an=(o,u)=>{ const x=fF.x+tx*o+fF.nx*u, z=fF.z+tz*o+fF.nz*u; return [x,hoehe(x,z),z]; };
  const weiss=new THREE.MeshLambertMaterial({color:'#eef0f3'}), grau2=new THREE.MeshLambertMaterial({color:'#8d939d'}), visier=new THREE.MeshPhongMaterial({color:'#c8961e', emissive:'#3a2a06', shininess:90, specular:'#fff2c0'});
  const astro=(col,o,u,blick)=>{ const g=new THREE.Group(), [x,y,z]=an(o,u), streif=new THREE.MeshLambertMaterial({color:col}); g.position.set(x,y,z); g.rotation.y=Math.atan2(blick[0],blick[1]); g.scale.setScalar(1.3); nah.add(g);
    const leib=new THREE.Group(); g.add(leib); const box=(w,h,d,m,px,py,pz,o2=leib)=>{ const bx=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); bx.position.set(px,py,pz); o2.add(bx); return bx; };
    for(const sx of [-.14,.14]){ const bn=new THREE.Mesh(new THREE.CylinderGeometry(.14,.13,.8,10),weiss); bn.position.set(sx,.48,0); leib.add(bn); box(.22,.14,.34,grau2,sx,.07,.04); box(.29,.06,.29,streif,sx,.62,0); }
    box(.58,.66,.38,weiss,0,1.18,0); box(.5,.62,.26,weiss,0,1.22,-.31); box(.22,.14,.06,grau2,0,1.2,.21); box(.58,.07,.39,streif,0,.9,0);
    const kopf=new THREE.Mesh(new THREE.SphereGeometry(.25,18,14),weiss); kopf.position.y=1.7; leib.add(kopf);
    const vis=new THREE.Mesh(new THREE.SphereGeometry(.255,18,14,-Math.PI/2*1.15,Math.PI*1.15,Math.PI*.22,Math.PI*.42),visier); vis.position.y=1.7; vis.rotation.y=Math.PI/2; leib.add(vis);
    const arm=sx=>{ const s=new THREE.Group(); s.position.set(sx,1.44,0); leib.add(s); const ob=new THREE.Mesh(new THREE.CylinderGeometry(.1,.09,.62,10),weiss); ob.position.y=-.31; s.add(ob); box(.21,.06,.21,streif,0,-.18,0,s);
      const h=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),grau2); h.position.y=-.66; s.add(h); return s; };
    return {g, leib, aL:arm(.38), aR:arm(-.38)}; };
  const zuMast=(o,u)=>[-o*tx-(u-U)*fF.nx, -o*tz-(u-U)*fF.nz], zurBahn=[sg*-fF.nx, sg*-fF.nz];
  const crew=[astro('#d8332a',0,U+sg*.8,zuMast(0,U+sg*.8)), astro('#2a6fd8',-.8,U+sg*.1,zuMast(-.8,U+sg*.1)), astro('#f0c419',1.7,U+sg*1.3,zuMast(1.7,U+sg*1.3)), astro('#2fae4f',-2.2,U-sg*2.6,zurBahn)];
  const [mx,my,mz]=an(0,U), mast=new THREE.Group(); mast.position.set(mx,my,mz); mast.rotation.y=Math.atan2(sg*fF.nx,sg*fF.nz); nah.add(mast); // z: weg von der Bahn, Tuch zur Bahn hin lesbar
  { mast.scale.setScalar(1.3); const st=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,5.6,8),grau2); st.position.y=2.8; mast.add(st); const kn=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),grau2); kn.position.y=5.63; mast.add(kn); } // Mast 7,3 m, Flagge 4,2 × 2,7 m
  const lt=canvasTex(256,170,g=>{ g.fillStyle='#111'; g.fillRect(0,0,256,170); g.save(); g.translate(128,92); g.fillStyle='#f2c230'; g.strokeStyle='#f2c230'; g.lineCap='round'; g.lineJoin='round'; // Pfälzer Löwe: golden, rot gekrönt und bewehrt, auf Schwarz
    g.beginPath(); g.ellipse(4,8,24,40,-.35,0,7); g.fill(); g.beginPath(); g.ellipse(-14,-38,20,22,0,0,7); g.fill(); // Leib, Kopf
    for(let i=0;i<9;i++){ const w=-1.2+i*.38; g.beginPath(); g.moveTo(-14+Math.cos(w)*14,-38+Math.sin(w)*14); g.lineTo(-14+Math.cos(w+.18)*31,-38+Math.sin(w+.18)*31); g.lineTo(-14+Math.cos(w+.36)*16,-38+Math.sin(w+.36)*16); g.fill(); } // Mähne
    g.lineWidth=11; for(const [p0,p1,p2,p3] of [[-16,-10,-44,-34],[-6,2,-40,-6],[10,38,-14,64],[22,34,34,66]]){ g.beginPath(); g.moveTo(p0,p1); g.lineTo(p2,p3); g.stroke(); } // Pranken, Hinterbeine
    g.lineWidth=7; g.beginPath(); g.moveTo(26,36); g.bezierCurveTo(70,40,30,-10,60,-36); g.stroke(); g.beginPath(); g.arc(62,-40,9,0,7); g.fill(); // Schwanz mit Quaste
    g.fillStyle='#d4232b'; for(const [x,y] of [[-44,-34],[-40,-6],[-14,64],[34,66]]) for(let k=-1;k<=1;k++){ g.beginPath(); g.arc(x+k*5,y+(y>0?5:-5)*.6,3,0,7); g.fill(); } // Krallen
    g.beginPath(); g.moveTo(-32,-34); g.lineTo(-44,-30); g.lineTo(-32,-28); g.fill(); g.beginPath(); g.moveTo(-30,-58); g.lineTo(-27,-72); g.lineTo(-20,-62); g.lineTo(-13,-74); g.lineTo(-7,-62); g.lineTo(0,-72); g.lineTo(2,-56); g.closePath(); g.fill(); // Zunge, Krone
    g.fillStyle='#111'; g.beginPath(); g.arc(-22,-42,3,0,7); g.fill(); g.restore(); });
  const fahne=new THREE.Group(); mast.add(fahne);
  { const q2=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,3.2,6),grau2); q2.rotation.z=Math.PI/2; q2.position.set(1.6,2.15,0); fahne.add(q2);
    const tuch=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.1),new THREE.MeshLambertMaterial({map:lt, side:THREE.DoubleSide})); tuch.position.set(1.62,1.07,0); tuch.rotation.y=Math.PI; fahne.add(tuch); }
  return {G, nah, a2:M.a2, b2:M.b2, crew, fahne, dF, lauf:best, hiss:null, blick:new THREE.Vector3(mx,my+2.5,mz), RP, kamT:null, kamGes:false};
}
// Mond: Flagge geht hoch, sobald ein Fahrer naht (~8 s vorher), Zieher zieht im Wechsel, danach Salut; der Grüne hüpft und winkt beim Vorbeifahren (geringe Schwerkraft)
function poseMond(M,dt,t){ if(!M.G.visible) return; const v=Math.max(me.v||0,me.vb||0), vor=M.dF-me.d;
  if(vor>Math.max(300,v*9)+50) M.hiss=null; else if(M.hiss==null && vor<Math.max(300,v*9)) M.hiss=t;
  const k=M.hiss==null?0:Math.min(1,(t-M.hiss)/7), zieht=k>0&&k<1, oben=k>=1; M.fahne.position.y=.3+k*3.15;
  const [A,B,C,D]=M.crew, w=Math.sin(t*9);
  A.aL.rotation.x=zieht?-2.1-.5*Math.sin(t*6):-.15; A.aR.rotation.x=zieht?-2.1+.5*Math.sin(t*6):-.15; A.leib.rotation.x=zieht?.05*Math.sin(t*6):0;
  B.aL.rotation.x=B.aR.rotation.x=-1.25; B.aL.rotation.z=-.25; B.aR.rotation.z=.25;
  C.aR.rotation.x=oben?-2.5:-.1; C.aR.rotation.z=oben?.9:0; C.aL.rotation.x=-.1;
  const nah=Math.abs(vor)<Math.max(60,v*2.5), hop=nah?Math.abs(Math.sin(t*3.2))*.55:0; D.leib.position.y=hop; D.aR.rotation.z=nah?-2.7+.35*w:-.15; D.aL.rotation.z=nah?2.7+.35*Math.sin(t*9+1.5):.15;
}
// Kamera (aus rennen.js, nach der normalen Kamera): kurz nach dem Vorbeifahren 4,5 s Schulterblick zurück auf die Astronauten wie bei den Wegelagerern auf Berwartstein; bei Tempo herangezoomt und angehoben, damit sie nicht hinter dem Mondhorizont verschwinden
function mondKamera(dt){ const M=anim.space&&anim.space.mond, ich=riders3d[myKey]; if(!M||!ich||race.state!=='run'){ if(M) M.kamT=null; return; }
  if(me.d<M.dF-100) M.kamGes=false; if(!M.kamGes&&me.d>M.dF+4&&me.d<M.dF+200){ M.kamGes=true; M.kamT=0; } if(M.kamT==null) return;
  M.kamT+=race.paused?0:dt; const T=4.5; if(M.kamT>T){ M.kamT=null; return; }
  const sm=x=>{ x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); }, w=sm(M.kamT/.6)*sm((T-M.kamT)/.7), rp=ich.g.position, hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), bc=M.blick, sx=bc.x-rp.x, sz=bc.z-rp.z, sl=Math.hypot(sx,sz)||1;
  const pos=new THREE.Vector3(rp.x+fx*5-sx/sl*2.5, rp.y+2.4+sl*sl/(2*M.RP)*1.4, rp.z+fz*5-sz/sl*2.5), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz);
  camera.position.lerp(pos,w); camera.lookAt(now.lerp(bc,w));
  const fz2=2*Math.atan(9/Math.max(1,camera.position.distanceTo(bc)))*180/Math.PI; camera.fov+=(Math.min(camera.fov,Math.max(5,fz2))-camera.fov)*w; camera.updateProjectionMatrix(); }
