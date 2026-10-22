/* ================= Bausteine: Pfälzer Häuser (Altort, Neubau, Fachwerk), Dächer, Hoftore =================
   Nach Fotos aus Maikammer und Arzheim. Häuser stehen mit der Front (+z) zur Straße, First längs der Straße (traufständig).
   Fenster leuchten am Abend: jede Fassade hat eine Leuchtkarte (emissiveMap), hausLicht() schaltet sie je nach Tageszeit. */
const WALLS=['#f4f1ea','#efe2c0','#ecd28a','#cfdcbc','#d8b47e','#efd0c6'], SHUT=['#7a4a2c','#a8432f','#4d6b4a'];
const NEU_WALLS=['#f4f2ec','#efe6d2','#f3ecdc','#e6e2da'], DACH_ALT=['#b4472f','#9e3a28','#a8503a','#6f6f70'], DACH_NEU=['#3d3f43','#4b4d51','#9e3a28','#7c3a2c'];
const facadeCache={}, hausMats={}, HAUS_GLOW=[];
function hausReset(){ for(const k in facadeCache) delete facadeCache[k]; for(const k in hausMats) delete hausMats[k]; HAUS_GLOW.length=0; }
function hausLicht(){ const on=race.tod!=='tag'; HAUS_GLOW.forEach(o=>o.m.emissive.set(on?o.c:0)); }
const hMat=(k,mk)=>hausMats[k]||(hausMats[k]=mk());
// Fassade + Leuchtkarte: draw(g,F) malt die Fassade und meldet jedes Fenster mit F(x,y,w,h); etwa 40 % davon leuchten abends
function hausTex(key,w,h,draw){ if(facadeCache[key]) return facadeCache[key]; const W=[];
  const map=canvasTex(w,h,g=>draw(g,(x,y,ww,hh)=>W.push([x,y,ww,hh]))); let glow=null;
  if(W.length) glow=canvasTex(w,h,g=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); let s=key.length*31;
    W.forEach(([x,y,ww,hh],i)=>{ s=(s*16807+i*977)%2147483647; if(s%10>=4) return; const gr=g.createRadialGradient(x+ww/2,y+hh/2,2,x+ww/2,y+hh/2,Math.max(ww,hh)*.7);
      gr.addColorStop(0,'#ffd88a'); gr.addColorStop(1,'#c9772e'); g.fillStyle=gr; g.fillRect(x,y,ww,hh); g.fillStyle='#000'; g.fillRect(x+ww/2-1.5,y,3,hh); g.fillRect(x,y+hh*.42,ww,2); }); });
  return facadeCache[key]={map,glow}; }
const glowMat=T=>hMat('g'+T.map.uuid,()=>{ const m=new THREE.MeshLambertMaterial({map:T.map}); if(T.glow){ m.emissiveMap=T.glow; m.emissive.set(0); HAUS_GLOW.push({m,c:0xd8d8d8}); } return m; });

// Fachwerk: weißer Putz, dunkle Balken; mit Fenstern (Straßenseite) oder nur Balken (Seiten)
function fachTex(win){ return hausTex('fw'+win,256,256,(g,F)=>{ g.fillStyle='#f2ede2'; g.fillRect(0,0,256,256);
    g.fillStyle='#b9936c'; g.fillRect(0,214,256,42); g.fillStyle='rgba(0,0,0,.12)'; for(let x=0;x<256;x+=32) g.fillRect(x,214,2,42);
    g.strokeStyle='#5a3b28'; g.lineCap='square'; const L=(a,b,c,d,w=7)=>{ g.lineWidth=w; g.beginPath(); g.moveTo(a,b); g.lineTo(c,d); g.stroke(); };
    L(0,4,256,4,8); L(0,112,256,112,9); L(0,122,256,122,6); L(0,210,256,210,8);
    const P=win?[5,90,166,251]:[5,69,128,187,251]; P.forEach(x=>{ L(x,4,x,112); L(x,122,x,210); });
    if(win){ L(5,100,40,16); L(251,100,216,16); L(90,200,60,130); L(166,200,196,130);
      [[128,30],[47,30],[209,30],[47,140],[209,140]].forEach(([x,y])=>{ g.fillStyle='#fff'; g.fillRect(x-19,y-3,38,58); g.fillStyle='#3a4250'; g.fillRect(x-15,y+1,30,50); F(x-15,y+1,30,50); g.fillStyle='#fff'; g.fillRect(x-1,y,2,52); g.fillRect(x-15,y+22,30,2);
        g.fillStyle='#3d6b2e'; if(y<100) g.fillRect(x-19,y+54,38,7); });
      g.fillStyle='#5a3a26'; g.fillRect(108,140,40,70); g.fillStyle='#d9c7a8'; g.fillRect(104,136,48,6); }
    else for(let i=0;i<P.length-1;i++){ const a=P[i],b=P[i+1]; if(i%2) L(a,112,b,4); else L(a,4,b,112); if(i%2===0) L(a,210,b,122); }
  }); }
// Altort: Putz, Klappläden; gw = rote Sandstein-Gewände, Sandsteinsockel und Rundbogentür (Arzheim)
function facadeTex(wi,si,gw){ return hausTex('a'+wi+'-'+si+(gw?'g':''),256,256,(g,F)=>{
    g.fillStyle=WALLS[wi]; g.fillRect(0,0,256,256); g.fillStyle='rgba(0,0,0,.035)'; for(let i=0;i<500;i++) g.fillRect(Math.random()*256,Math.random()*214,3,3);
    const so=gw?'#a8654f':'#b9936c', ge=gw?'#b0614b':'#fff';
    g.fillStyle=so; g.fillRect(0,214,256,42); g.fillStyle='rgba(0,0,0,.12)'; for(let x=0;x<256;x+=32) g.fillRect(x,214,2,42); g.fillRect(0,214,256,2);
    const win=(x,y,fl)=>{ g.fillStyle=SHUT[si]; g.fillRect(x-17,y,12,50); g.fillRect(x+37,y,12,50);
      g.fillStyle=ge; g.fillRect(x-4,y-3,40,56); if(gw) g.fillRect(x-7,y+50,46,6); g.fillStyle='#3a4250'; g.fillRect(x,y+1,32,48); F(x,y+1,32,48); g.fillStyle='#fff'; g.fillRect(x+15,y,2,50); g.fillRect(x,y+20,32,2);
      if(fl){ g.fillStyle='#3d6b2e'; g.fillRect(x-4,y+50,40,9); g.fillStyle=['#e03a3a','#e86aa0','#f2f2f2'][(x+y)%3]; for(let i=0;i<6;i++){ g.beginPath(); g.arc(x+i*6.5,y+50,4,0,7); g.fill(); } } };
    [36,112,188].forEach((x,i)=>win(x,40,i!==1||si===1));
    win(36,140,false); win(188,140,false);
    if(gw){ g.fillStyle=ge; g.fillRect(100,150,56,64); g.beginPath(); g.arc(128,150,28,Math.PI,0); g.fill(); g.fillStyle='#5a3a26'; g.fillRect(106,152,44,62); g.beginPath(); g.arc(128,152,22,Math.PI,0); g.fill(); }
    else { g.fillStyle='#5a3a26'; g.fillRect(106,138,44,76); g.fillStyle='#d9c7a8'; g.fillRect(102,134,52,6); }
  }); }
// Neubau (60er–80er): heller Putz, weiße Fenster mit Rollladen (teils halb unten), dunkler Sockel, Haustür mit Glasstreifen
function neuTex(wi,v){ return hausTex('n'+wi+'-'+v,512,256,(g,F)=>{
    g.fillStyle=NEU_WALLS[wi]; g.fillRect(0,0,512,256); g.fillStyle='rgba(0,0,0,.03)'; for(let i=0;i<900;i++) g.fillRect(Math.random()*512,Math.random()*226,3,3);
    g.fillStyle=v%2?'#6d5a4c':'#77746f'; g.fillRect(0,226,512,30);
    const win=(x,y,w,h,k)=>{ const r=k?h*.5:0; g.fillStyle='#ecebe7'; g.fillRect(x-6,y-16,w+12,h+22); g.fillStyle='#9a9ea2'; g.fillRect(x-4,y-14,w+8,11);
      g.fillStyle='#39414c'; g.fillRect(x,y,w,h); F(x,y+r,w,h-r); g.fillStyle='#ecebe7'; g.fillRect(x+w/2-2,y,4,h);
      if(r){ g.fillStyle='#bfc2c3'; g.fillRect(x,y,w,r); g.fillStyle='rgba(0,0,0,.14)'; for(let yy=y;yy<y+r;yy+=5) g.fillRect(x,yy,w,1); }
      g.fillStyle='#d6d4ce'; g.fillRect(x-8,y+h,w+16,6); };
    const L=[[[40,70,90,110],[175,70,90,110],[420,90,56,60]],[[40,80,150,100],[400,70,80,110]],[[60,70,80,110],[300,70,80,110],[410,70,80,110]]][v%3];
    L.forEach(([x,y,w,h],i)=>win(x,y,w,h,(v+i)%3===1));
    const dx=v%3===0?310:v%3===1?250:180; g.fillStyle='#ecebe7'; g.fillRect(dx-6,62,72,166); g.fillStyle=v%2?'#5a4030':'#3f4a52'; g.fillRect(dx,68,60,160); g.fillStyle='#a9b8c0'; g.fillRect(dx+22,84,16,110);
    g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(dx-12,56,84,8); // Vordach
  }); }
// Sandstein-Quader (Ranschbach): helle, gelbliche Quader, rote Gewände, weiße Rollläden, Blumenkästen
function quaderTex(v){ return hausTex('q'+v,256,256,(g,F)=>{ g.fillStyle='#d8b588'; g.fillRect(0,0,256,256);
    for(let y=0;y<214;y+=12) for(let x=(y/12%2)*14-14;x<256;x+=28){ const k=Math.random(); g.fillStyle=k<.3?'#d2a979':k<.6?'#dcbb8f':k<.85?'#e2c49a':'#c99d70'; g.fillRect(x+1,y+1,26,10); }
    g.fillStyle='#9c5a46'; g.fillRect(0,214,256,42); g.fillStyle='rgba(0,0,0,.15)'; for(let x=0;x<256;x+=36) g.fillRect(x,214,2,42); g.fillRect(0,214,256,2);
    const win=(x,y,bl)=>{ g.fillStyle='#a85d4a'; g.fillRect(x-6,y-6,44,62); if(v%2){ g.beginPath(); g.arc(x+16,y-2,24,Math.PI,0); g.fill(); }
      g.fillStyle='#3a4250'; g.fillRect(x,y,32,50); F(x,y+18,32,32); g.fillStyle='#f1f0ec'; g.fillRect(x,y,32,18); g.fillStyle='#fff'; g.fillRect(x+15,y+18,2,32);
      if(bl){ g.fillStyle='#3d6b2e'; g.fillRect(x-6,y+50,44,8); for(let i=0;i<8;i++){ g.fillStyle=i%3?'#d63d9a':'#f2f2f2'; g.beginPath(); g.arc(x-3+i*5.5,y+50+Math.random()*3,4.5,0,7); g.fill(); } } };
    [36,112,188].forEach(x=>win(x,36,true)); win(36,136,true); win(188,136,true);
    g.fillStyle='#a85d4a'; g.fillRect(100,128,56,86); g.fillStyle='#7a5638'; g.fillRect(106,134,44,80); g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(127,134,2,80);
  }); }
// Dachziegel: Biberschwanz in Reihen, leicht fleckig (1 Kachel = 2 m)
function dachTex(c){ return hausTex('d'+c,128,128,g=>{ const b=new THREE.Color(c); g.fillStyle=c; g.fillRect(0,0,128,128);
    for(let y=0;y<128;y+=8) for(let x=(y/8%2)*6-6;x<128;x+=12){ const k=.82+Math.random()*.3; g.fillStyle=`rgb(${b.r*255*k|0},${b.g*255*k|0},${b.b*255*k|0})`;
      g.beginPath(); g.moveTo(x+1,y); g.lineTo(x+11,y); g.lineTo(x+11,y+5); g.quadraticCurveTo(x+6,y+9,x+1,y+5); g.fill(); }
    g.fillStyle='rgba(0,0,0,.22)'; for(let y=0;y<128;y+=8) g.fillRect(0,y,128,1);
    g.fillStyle='rgba(70,80,50,.12)'; for(let i=0;i<30;i++){ g.beginPath(); g.arc(Math.random()*128,Math.random()*128,3+Math.random()*7,0,7); g.fill(); } }).map; }
// Satteldach: Traufe hängt über (W×D), Giebeldreiecke in Wandfarbe (w×d); Gruppe 0 = Ziegel, 1 = Giebel
function dachGeo(w,d,W,D,h){ const ye=h*(1-D/d), FL=[-W/2,ye,D/2],FR=[W/2,ye,D/2],BL=[-W/2,ye,-D/2],BR=[W/2,ye,-D/2],RL=[-W/2,h,0],RR=[W/2,h,0];
  const tri=[FL,FR,RR, FL,RR,RL, BR,BL,RL, BR,RL,RR, [-w/2,0,-d/2],[-w/2,0,d/2],[-w/2,h,0], [w/2,0,d/2],[w/2,0,-d/2],[w/2,h,0]], p=new Float32Array(tri.length*3), uv=new Float32Array(tri.length*2), sl=Math.hypot(D/2,h-ye);
  tri.forEach((v,i)=>{ p.set(v,i*3); if(i<12) uv.set([v[0]/2, (v[1]-ye)/(h-ye)*sl/2],i*2); });
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.computeVertexNormals(); g.addGroup(0,12,0); g.addGroup(12,6,1); return g; }

// Haus: o = {w, dep, hgt, stil:'alt'|'neu', wall, shut, roof, fw (Fachwerk), gw (Sandstein-Gewände), qu (Sandstein-Quader), v (Neubau-Variante), flach (Bungalowdach),
//   gs (giebelständig: First quer zur Straße), kam (Kaminlage 0–1), df (Dachfenster), pv (Solarmodule)}
function haus(o){ const G=new THREE.Group(), neu=o.stil==='neu', wc=neu?NEU_WALLS[o.wall]:o.fw?'#f2ede2':o.qu?'#d6b286':WALLS[o.wall];
  const fm=glowMat(o.fw?fachTex(1):neu?neuTex(o.wall,o.v||0):o.qu?quaderTex(o.shut):facadeTex(o.wall,o.shut,o.gw)), wm=o.fw?glowMat(fachTex(0)):hMat('w'+wc,()=>lam(wc)), gm=hMat('w'+wc,()=>lam(wc));
  const body=new THREE.Mesh(new THREE.BoxGeometry(o.w,o.hgt,o.dep),[wm,wm,wm,wm,fm,wm]); body.position.y=o.hgt/2; G.add(body);
  const sc=neu?(o.v%2?'#6d5a4c':'#77746f'):o.gw||o.qu?'#a8654f':'#b9936c', sock=new THREE.Mesh(new THREE.BoxGeometry(o.w+.02,8,o.dep+.02), hMat('s'+sc,()=>lam(sc))); sock.position.y=-4+.05; G.add(sock);
  const L=o.gs?o.dep:o.w, T=o.gs?o.w:o.dep, D=T+(neu?1.4:.9), rh=neu&&o.flach?1.2+T*.1:2.6+T*.18; // L = Firstlänge, T = Haustiefe quer zum First
  const roof=new THREE.Mesh(dachGeo(L,T,L+(neu?1:.5),D,rh),[hMat('d'+o.roof,()=>new THREE.MeshLambertMaterial({map:dachTex(o.roof),side:THREE.DoubleSide})),gm]); roof.position.y=o.hgt; if(o.gs) roof.rotation.y=Math.PI/2; G.add(roof);
  const k=o.kam??.5, km=new THREE.Mesh(new THREE.BoxGeometry(.5,1.6,.5), hMat('kam'+neu,()=>lam(neu?'#5b5d60':'#8b4b3b'))); km.position.set((k-.5)*L*.6, rh*.76+.3, -T*.12); roof.add(km);
  const a=Math.atan(2*rh/T), aufs=(w,dd,x,col)=>{ const f=new THREE.Mesh(new THREE.BoxGeometry(w,.08,dd), hMat('auf'+col,()=>lam(col))); f.rotation.x=a; f.position.set(x, rh/2+.06, T/4); roof.add(f); }; // auf der vorderen Dachfläche
  if(o.pv) aufs(L*.62, T*.42, (o.kam>.5?-1:1)*L*.12, '#1f2a44');
  else if(neu&&o.df) for(let i=0;i<o.df;i++) aufs(.8, 1, (i-(o.df-1)/2)*L*.35, '#2c3036');
  return G; }
// Hoftor bzw. Mauer zwischen zwei Häusern im Altort: v 0 = Holztor, 1 = Rundbogen mit Eisengitter, 2 = Bruchsteinmauer. Fläche 3,2 m hoch, unten 0,8 m Sockel unter Straßenhöhe
function torTex(v){ return hausTex('t'+v,128,128,g=>{ const st=(x,y,w,h,c)=>{ g.fillStyle=c; g.fillRect(x,y,w,h); };
    if(v===2){ st(0,0,128,128,'#8f5a48'); for(let y=6;y<128;y+=9) for(let x=-(y%18);x<128;x+=13+Math.random()*8){ const k=Math.random(); st(x+1,y+1,11+Math.random()*6,7, k<.5?'#a8705a':k<.8?'#9b8a7a':'#b88466'); } st(0,0,128,7,'#c9a184'); return; }
    st(0,0,128,128,v?'#e8dcc4':'#c9a184'); if(!v) for(let y=0;y<96;y+=12) for(let x=(y/12%2)*10-10;x<128;x+=20) st(x,y,19,11,Math.random()<.5?'#c39a7c':'#cfa98c');
    st(0,96,128,32,'#a0604a'); st(0,0,128,6,'#b07a62');
    if(v===0){ st(10,22,108,74,'#b07a62'); st(14,26,100,70,'#6b4a30'); g.fillStyle='rgba(0,0,0,.25)'; for(let x=14;x<114;x+=8) g.fillRect(x,26,1.5,70); g.fillRect(63,26,2,70); }
    else { g.fillStyle='#b0614b'; g.fillRect(24,46,80,50); g.beginPath(); g.arc(64,46,40,Math.PI,0); g.fill(); g.fillStyle='#55554e'; g.fillRect(30,46,68,50); g.beginPath(); g.arc(64,46,34,Math.PI,0); g.fill();
      g.fillStyle='#2a2a28'; for(let x=33;x<98;x+=6) g.fillRect(x,14,2,82); g.fillRect(30,60,68,2); g.strokeStyle='#2a2a28'; g.lineWidth=2; g.beginPath(); g.arc(64,46,22,Math.PI,0); g.stroke(); }
  }).map; }
function hoftor(o){ const m=hMat('tor'+o.v,()=>new THREE.MeshLambertMaterial({map:torTex(o.v)})), s=hMat('tors'+o.v,()=>lam(o.v===2?'#8f5a48':o.v?'#e8dcc4':'#c9a184'));
  const b=new THREE.Mesh(new THREE.BoxGeometry(o.w,3.2,.4),[s,s,s,s,m,m]); b.position.y=.8; b.userData.ohneBoden=true; return b; } // steckt absichtlich 0,8 m im Boden
// Straßenlaterne: Leuchtfläche unter dem Kopf, abends warm
function lampGlowMat(){ return hMat('lampe',()=>{ const m=lam('#d9d4c4'); HAUS_GLOW.push({m,c:0xffd27a}); return m; }); }
