function buildStadium(){
  const {TW,Xs,Zs}=ST, rnd=rng(99);
  // Flächen-Helfer entlang der Bahn
  const ribbon=(d0,d1,ds,f,mat,uvLen)=>{ const D=[]; for(let d=d0; d<d1+1e-6; d+=ds) D.push(d);
    const p=new Float32Array(D.length*6), uv=new Float32Array(D.length*4), id=[];
    D.forEach((d,q)=>{ const [a,b]=f(d); p.set([...a,...b],q*6); uv.set([0,d/uvLen,1,d/uvLen],q*4); if(q<D.length-1) id.push(q*2,q*2+1,q*2+2, q*2+1,q*2+3,q*2+2); });
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(id); g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat); world.add(m); return m; };
  const lift=(p,h)=>[p[0],p[1]+h,p[2]];

  // Boden außen (Umlauf) und Innenraum-Rasen
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600), lam('#8b8d86')); ground.rotation.x=-Math.PI/2; ground.position.y=-0.06; world.add(ground);
  const sh=new THREE.Shape(); for(let i=0;i<R.xs.length-1;i++){ const [x,,z]=trackPt(i*STEP,-1.4); i?sh.lineTo(x,-z):sh.moveTo(x,-z); }
  const inf=new THREE.Mesh(new THREE.ShapeGeometry(sh), lam('#4c8a37')); inf.rotation.x=-Math.PI/2; inf.position.y=-0.02; world.add(inf);
  // Fußballplatz 105 × 68 m mit Mähstreifen
  const pitchTex=canvasTex(1050,680,(g)=>{ for(let i=0;i<14;i++) for(let j=0;j<8;j++){ g.fillStyle=(i+j)%2?'#5aa043':'#4f933a'; g.fillRect(i*75,j*85,75,85); } // Mähmuster als Schachbrett
    const wear=(x,y,rx,ry,a)=>{ g.save(); g.translate(x,y); g.scale(1,ry/rx); const gr=g.createRadialGradient(0,0,0,0,0,rx); gr.addColorStop(0,`rgba(138,116,70,${a})`); gr.addColorStop(1,'rgba(138,116,70,0)'); g.fillStyle=gr; g.beginPath(); g.arc(0,0,rx,0,7); g.fill(); g.restore(); };
    for(const s of [0,1]){ wear(s?1016:34,340,62,46,.55); wear(s?936:114,340,30,24,.42); wear(s?1032:18,340,22,42,.5); } // Abnutzung im Torraum und am Elfmeterpunkt
    wear(525,340,46,36,.28); for(let i=0;i<60;i++) wear(60+Math.random()*930,40+Math.random()*600,4+Math.random()*9,3+Math.random()*6,.18);
    g.strokeStyle='#fff'; g.lineWidth=5; g.strokeRect(4,4,1042,672); g.beginPath(); g.moveTo(525,4); g.lineTo(525,676); g.stroke();
    g.beginPath(); g.arc(525,340,91.5,0,7); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(525,340,5,0,7); g.fill();
    for(const s of [0,1]){ const x=s?1046-165:4; g.strokeRect(x,138,165,404); g.strokeRect(s?1046-55:4,248,55,184); g.beginPath(); g.arc(s?1046-110:114,340,4,0,7); g.fill();
      g.beginPath(); g.arc(s?1046-110:114,340,91.5,s?Math.PI*0.7:-Math.PI*0.3,s?Math.PI*1.3:Math.PI*0.3); g.stroke(); }
    for(const [cx,cy,a] of [[4,4,0],[1046,4,Math.PI/2],[1046,676,Math.PI],[4,676,Math.PI*1.5]]){ g.beginPath(); g.arc(cx,cy,10,a,a+Math.PI/2); g.stroke(); } }); // Eckbögen
  const pitch=new THREE.Mesh(new THREE.PlaneGeometry(105,68), new THREE.MeshLambertMaterial({map:pitchTex})); pitch.rotation.x=-Math.PI/2; pitch.position.y=0.01; world.add(pitch);
  const netTex=canvasTex(64,64,g=>{ g.clearRect(0,0,64,64); g.strokeStyle='rgba(255,255,255,.95)'; g.lineWidth=3; for(let i=0;i<=64;i+=16){ g.beginPath(); g.moveTo(i,0); g.lineTo(i,64); g.stroke(); g.beginPath(); g.moveTo(0,i); g.lineTo(64,i); g.stroke(); } });
  netTex.wrapS=netTex.wrapT=THREE.RepeatWrapping;
  for(const s of [-1,1]){ // Tore
    const gm=lam('#ffffff'); for(const z of [-3.66,3.66]){ const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,2.44,8),gm); post.position.set(s*52.5,1.22,z); world.add(post); }
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,7.32,8),gm); bar.rotation.x=Math.PI/2; bar.position.set(s*52.5,2.44,0); world.add(bar);
    const nm=(w,h)=>{ const t=netTex.clone(); t.needsUpdate=true; t.repeat.set(w/.6,h/.6); return new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.35,side:THREE.DoubleSide}); }; // gespanntes Netz mit Maschen
    const back=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.44),nm(7.32,2.44)); back.rotation.y=Math.PI/2; back.position.set(s*54.5,1.22,0); world.add(back);
    for(const z of [-3.66,3.66]){ const sd=new THREE.Mesh(new THREE.PlaneGeometry(2,2.44),nm(2,2.44)); sd.position.set(s*53.5,1.22,z); world.add(sd);
      const bp=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,2.44,6),lam('#d8d8d8')); bp.position.set(s*54.5,1.22,z); world.add(bp); }
    const top=new THREE.Mesh(new THREE.PlaneGeometry(2,7.32),nm(2,7.32)); top.rotation.x=-Math.PI/2; top.position.set(s*53.5,2.44,0); world.add(top); }

  // Holzbahn mit Linien (schwarz = Messlinie, rot = Sprinterlinie, blau = Steherlinie)
  const wood=canvasTex(256,256,(g)=>{ for(let x=0;x<256;x+=4){ const v=200+Math.floor(Math.random()*26); g.fillStyle=`rgb(${v},${Math.floor(v*.8)},${Math.floor(v*.55)})`; g.fillRect(x,0,4,256); g.fillStyle='rgba(90,60,30,.25)'; g.fillRect(x,0,1,256); }
    for(let i=0;i<40;i++){ g.fillStyle='rgba(90,60,30,.18)'; g.fillRect(Math.floor(Math.random()*64)*4,Math.random()*256,4,1); }
    const lineAt=(u,c,w)=>{ g.fillStyle=c; g.fillRect(u/TW*256-w/2,0,w,256); }; lineAt(0.25,'#111',4); lineAt(0.95,'#d62828',4); lineAt(3.4,'#1d5fd6',4); });
  wood.wrapT=THREE.RepeatWrapping; wood.anisotropy=8;
  const woodMesh=ribbon(0,R.len,1,d=>[trackPt(d,0),trackPt(d,TW)], new THREE.MeshLambertMaterial({map:wood,side:THREE.DoubleSide}), 6);
  ribbon(0,R.len,1,d=>[lift(trackPt(d,-1.3),.01),lift(trackPt(d,0),.01)], new THREE.MeshLambertMaterial({color:'#2d7fd0',side:THREE.DoubleSide}), 6); // Côte d'Azur
  // Ziellinie: weiß mit schwarzem Strich
  const fin=canvasTex(64,64,g=>{ g.fillStyle='#fff'; g.fillRect(0,0,64,64); g.fillStyle='#111'; g.fillRect(0,26,64,12); });
  ribbon(-0.45,0.45,0.9,d=>[lift(trackPt(d,0),.03),lift(trackPt(d,TW),.03)], new THREE.MeshBasicMaterial({map:fin,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2}), 0.9);
  // 200-m-Marke (halbe Runde): Querlinie und Schrift auf dem Holz
  ribbon(199.9,200.1,0.2,d=>[lift(trackPt(d,0),.03),lift(trackPt(d,TW),.03)], new THREE.MeshBasicMaterial({color:'#ffffff',side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2}), 0.2);
  { const tx=canvasTex(256,128,g=>{ g.clearRect(0,0,256,128); g.fillStyle='#fff'; g.font='800 120px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('200',128,70); });
    const D=[]; for(let d=202; d<=207.01; d+=.5) D.push(d); const p=new Float32Array(D.length*6), uv=new Float32Array(D.length*4), id=[];
    D.forEach((d,q)=>{ const a=lift(trackPt(d,4.0),.035), b=lift(trackPt(d,6.6),.035), v=(d-202)/5; p.set([...a,...b],q*6); uv.set([0,v,1,v],q*4); if(q<D.length-1) id.push(q*2,q*2+1,q*2+2, q*2+1,q*2+3,q*2+2); });
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(id); g.computeVertexNormals();
    world.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-3}))); }
  // Außenwand unter der Bahn und Bande oben mit Werbung
  ribbon(0,R.len,1,d=>{ const t=trackPt(d,TW); return [t,[t[0],-0.05,t[2]]]; }, new THREE.MeshLambertMaterial({color:'#9a9c97',side:THREE.DoubleSide}), 6);
  const ads=['RUNDE UM RUNDE','KALMIT-DUELL','PFÄLZER SCHORLE','WESTKURVE','ALLEZ!','STEILKURVE','400 METER','HOPP HOPP!'], adCols=['#c92a2a','#1d1d1f','#e8590c','#c92a2a','#2f9e44','#1c7ed6','#f2f2f2','#ae3ec9'];
  const adTex=canvasTex(2048,64,g=>{ ads.forEach((t,i)=>{ g.fillStyle=adCols[i]; g.fillRect(i*256,0,256,64); g.fillStyle=adCols[i]==='#f2f2f2'?'#c92a2a':'#fff'; g.font='800 40px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,i*256+128,34,240); }); });
  adTex.wrapS=THREE.RepeatWrapping;
  { const D=[]; for(let d=0; d<=R.len+1e-6; d+=1) D.push(d); const p=new Float32Array(D.length*6), uv=new Float32Array(D.length*4), id=[];
    D.forEach((d,q)=>{ const t=trackPt(d,TW+0.05); p.set([t[0],t[1]-0.05,t[2], t[0],t[1]+1.05,t[2]],q*6); uv.set([-d/40,0,-d/40,1],q*4); if(q<D.length-1) id.push(q*2,q*2+2,q*2+1, q*2+1,q*2+2,q*2+3); });
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(id); g.computeVertexNormals();
    world.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:adTex,side:THREE.DoubleSide}))); }

  // ---------- Tribünen ----------
  const ROWS=22, RD=1.0, RH=ST_RH, SEP=1.0;
  const stands=[
    {key:'W', c:[-Xs,0], f:[1,0],  a:[0,-1], Ls:2*Zs, base:6.5},  // links (von oben): Westkurve
    {key:'E', c:[Xs,0],  f:[-1,0], a:[0,1],  Ls:2*Zs, base:6.5},  // rechts: Osttribüne mit Gästeblock
    {key:'N', c:[0,-Zs], f:[0,1],  a:[1,0],  Ls:2*Xs, base:2.5, two:true},  // Längsseiten: zwei Ränge mit Umlauf dazwischen
    {key:'S', c:[0,Zs],  f:[0,-1], a:[-1,0], Ls:2*Xs, base:2.5, two:true}];
  // Lage einer Reihe: Abstand von der Vorderkante und Höhe (oberer Rang beginnt nach dem Umlauf)
  const rowAt=(S,row)=>{ const up=S.two&&row>=ST_TIER.at; return [row*RD+(up?ST_TIER.gap:0), S.base+row*RH+(up?ST_TIER.step:0)]; };
  const seatTex=canvasTex(64,64,g=>{ g.fillStyle='#b3212b'; g.fillRect(0,0,64,64); g.fillStyle='#8c1820'; for(let y=0;y<64;y+=16) g.fillRect(0,y,64,5); g.fillStyle='rgba(0,0,0,.15)'; for(let x=0;x<64;x+=8) g.fillRect(x,0,1,64); });
  seatTex.wrapS=seatTex.wrapT=THREE.RepeatWrapping;
  // Westkurve-Schriftzug als Maske über die ganze Tribüne
  const W_COLS=Math.round(2*Zs/SEP), mk=document.createElement('canvas'); mk.width=W_COLS; mk.height=ROWS; const mg=mk.getContext('2d');
  mg.fillStyle='#fff'; mg.font=`800 ${ROWS+3}px "Barlow Condensed", "Arial Narrow", sans-serif`; mg.textAlign='center'; mg.textBaseline='middle'; mg.fillText('WESTKURVE',W_COLS/2,ROWS/2+1.5,W_COLS-4);
  const md=mg.getImageData(0,0,W_COLS,ROWS).data, inLetter=(c,row)=>md[((ROWS-1-row)*W_COLS+c)*4+3]>110;
  const fans=[], away={z0:-52,z1:-32,r1:13}; // Gästeblock in der linken Ecke der Osttribüne (beim Zufahren gesehen)
  const throwers=[], targets=[];
  // Glasdach mit Rahmen, Stahlfachwerk darunter (alle Träger als eine Instanz-Liste)
  const glassTex=canvasTex(128,128,g=>{ g.fillStyle='rgba(205,228,238,.30)'; g.fillRect(0,0,128,128); g.fillStyle='rgba(225,230,234,.95)'; g.fillRect(0,0,128,5); g.fillRect(0,0,5,128); g.fillRect(62,0,3,128); });
  glassTex.wrapS=glassTex.wrapT=THREE.RepeatWrapping;
  const beams=[], frameB=[]; const beam=(L,a,b,t)=>L.push([a,b,t]);
  stands.forEach(S=>{
    const [cx,cz]=S.c, [fx,fz]=S.f, [ax,az]=S.a, [depth,top]=rowAt(S,ROWS), P=(d,y,s)=>[cx-fx*d+ax*s,y,cz-fz*d+az*s];
    // Tribünenschräge(n), Frontwand, Rückwand aus Glas, Dach
    let smap; if(S.key==='W'){ // Sitze bilden den WESTKURVE-Schriftzug
      smap=canvasTex(W_COLS*8,ROWS*8,(g)=>{ for(let row=0;row<ROWS;row++) for(let c=0;c<W_COLS;c++){ g.fillStyle=inLetter(c,row)?'#f2f0ea':'#b3212b'; g.fillRect(c*8,(ROWS-1-row)*8,8,8); g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(c*8,(ROWS-1-row)*8,8,2); } }); }
    const slopePlane=(d0,y0,d1,y1,map)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(S.Ls,Math.hypot(d1-d0,y1-y0)),new THREE.MeshLambertMaterial({map}));
      m.position.set(cx-fx*(d0+d1)/2,(y0+y1)/2,cz-fz*(d0+d1)/2); m.rotation.y=Math.atan2(fx,fz); m.rotateX(-(Math.PI/2-Math.atan2(y1-y0,d1-d0))); world.add(m); return m; };
    const seats=n=>{ const t=seatTex.clone(); t.repeat.set(S.Ls/4,n/4); t.needsUpdate=true; return t; };
    if(!S.two) slopePlane(0,S.base,depth,top,smap||seats(ROWS));
    else { const n=ST_TIER.at, [d1,y1]=[n*RD,S.base+n*RH]; slopePlane(0,S.base,d1,y1,seats(n)); slopePlane(d1+ST_TIER.gap,y1+ST_TIER.step,depth,top,seats(ROWS-n));
      const um=new THREE.Mesh(new THREE.BoxGeometry(S.Ls,.3,ST_TIER.gap),lam('#a9a69e')); um.position.set(cx-fx*(d1+ST_TIER.gap/2),y1-.15,cz-fz*(d1+ST_TIER.gap/2)); um.rotation.y=Math.atan2(fx,fz); world.add(um); // Umlauf
      const wl=new THREE.Mesh(new THREE.BoxGeometry(S.Ls,ST_TIER.step,.4),lam('#d4d1c8')); wl.position.set(cx-fx*(d1+ST_TIER.gap),y1+ST_TIER.step/2,cz-fz*(d1+ST_TIER.gap)); wl.rotation.y=Math.atan2(fx,fz); world.add(wl);
      const rail=new THREE.Mesh(new THREE.BoxGeometry(S.Ls,1.0,.06),new THREE.MeshLambertMaterial({color:'#cfe6f2',transparent:true,opacity:.4,depthWrite:false})); rail.position.set(cx-fx*(d1+.1),y1+.5,cz-fz*(d1+.1)); rail.rotation.y=Math.atan2(fx,fz); world.add(rail); }
    const front=new THREE.Mesh(new THREE.BoxGeometry(S.Ls,S.base,0.6), lam('#c9c6bd')); front.position.set(cx+fx*0.3,S.base/2,cz+fz*0.3); front.rotation.y=Math.atan2(fx,fz); world.add(front);
    const back=new THREE.Mesh(new THREE.BoxGeometry(S.Ls,top+9,0.5), new THREE.MeshLambertMaterial({color:'#9fc4d8',transparent:true,opacity:.85})); back.position.set(cx-fx*(depth+0.5),(top+9)/2,cz-fz*(depth+0.5)); back.rotation.y=Math.atan2(fx,fz); world.add(back);
    for(let s=-S.Ls/2; s<=S.Ls/2+1e-6; s+=12){ const fr=new THREE.Mesh(new THREE.BoxGeometry(0.25,top+9,0.25), lam('#6d7378')); fr.position.set(cx-fx*(depth+0.2)+ax*s,(top+9)/2,cz-fz*(depth+0.2)+az*s); world.add(fr); }
    const roofY=top+9, rd=depth+16, dF=-15.5, dB=depth+.5; // Dach reicht von 15,5 m vor der Tribüne bis zur Rückwand
    const gt=glassTex.clone(); gt.repeat.set((S.Ls+2)/6,rd/4); gt.needsUpdate=true;
    const roof=new THREE.Mesh(new THREE.BoxGeometry(S.Ls+2,.12,rd), new THREE.MeshLambertMaterial({map:gt,transparent:true,depthWrite:false,side:THREE.DoubleSide})); roof.position.set(cx-fx*(depth-rd/2+0.5),roofY,cz-fz*(depth-rd/2+0.5)); roof.rotation.y=Math.atan2(fx,fz); world.add(roof);
    const edge=new THREE.Mesh(new THREE.BoxGeometry(S.Ls+2.2,1.6,0.4), new THREE.MeshLambertMaterial({color:'#d0202e',emissive:'#300000'})); edge.position.set(cx+fx*15.6,roofY-0.1,cz+fz*15.6); edge.rotation.y=roof.rotation.y; world.add(edge);
    const lights=new THREE.Mesh(new THREE.BoxGeometry(S.Ls-4,0.25,0.5), new THREE.MeshBasicMaterial({color:'#fff6d8'})); lights.position.set(cx+fx*14.8,roofY-0.95,cz+fz*14.8); lights.rotation.y=roof.rotation.y; world.add(lights);
    const yb=new THREE.Mesh(new THREE.BoxGeometry(S.Ls+1,.8,.6), lam('#e0a020')); yb.position.set(cx+fx*13.6,roofY-1.7,cz+fz*13.6); yb.rotation.y=roof.rotation.y; world.add(yb); // gelb-oranger Längsträger
    // Fachwerk: Querbinder alle 12 m (Ober- und Untergurt, Diagonalen), Pfetten längs
    for(let s=-S.Ls/2; s<=S.Ls/2+1e-6; s+=12){ beam(beams,P(dF+1,roofY-.2,s),P(dB,roofY-.2,s),.3); beam(beams,P(dF+2,roofY-2.6,s),P(dB,roofY-2.6,s),.3);
      for(let d=dF+2,k=0; d<dB-3; d+=3,k++) beam(beams,P(d,k%2?roofY-.2:roofY-2.6,s),P(d+3,k%2?roofY-2.6:roofY-.2,s),.16); }
    for(let d=dF+1; d<=dB; d+=6) beam(beams,P(d,roofY-.25,-S.Ls/2),P(d,roofY-.25,S.Ls/2),.2);
    for(let s=-S.Ls/2; s<S.Ls/2-1; s+=12){ beam(beams,P(dF+2,roofY-.3,s),P(dF+8,roofY-.3,s+12),.12); beam(beams,P(dF+8,roofY-.3,s),P(dF+2,roofY-.3,s+12),.12); } // Windverband
    if(S.key==='S'){ // Stahlgerüst mittig unter dem Dach der Gegentribüne
      const fw=8, fh=9, fdep=6, d0=-11, y0=roofY-1, y1=y0-fh, C=[[-fw,d0],[fw,d0],[fw,d0+fdep],[-fw,d0+fdep]];
      C.forEach(([s,d],i)=>{ const [s2,dd2]=C[(i+1)%4]; beam(frameB,P(d,y0,s),P(d,y1,s),.35); for(const y of [y0,y1,(y0+y1)/2]) beam(frameB,P(d,y,s),P(dd2,y,s2),.3);
        beam(frameB,P(d,y0,s),P(dd2,(y0+y1)/2,s2),.15); beam(frameB,P(d,(y0+y1)/2,s),P(dd2,y1,s2),.15); });
      for(let s=-fw+4; s<fw; s+=4){ beam(frameB,P(d0,y0,s),P(d0,y1,s),.15); }
      const cab=new THREE.Mesh(new THREE.BoxGeometry(6,2.2,4),new THREE.MeshLambertMaterial({color:'#2c3a44'})); cab.position.set(...P(d0+fdep/2,y1+1.4,0)); cab.rotation.y=roof.rotation.y; world.add(cab); }

    // Fans
    const cols=Math.round(S.Ls/SEP);
    for(let row=0; row<ROWS; row++) for(let c=0;c<cols;c++){
      const [rd0,ry]=rowAt(S,row), s=-S.Ls/2+(c+.5)*SEP, x=cx-fx*(rd0+0.6)+ax*s+(rnd()-.5)*.2, z=cz-fz*(rd0+0.6)+az*s+(rnd()-.5)*.2, y=ry;
      let col=rnd()<.82?'#c81e2a':(rnd()<.6?'#f2f2f2':'#7a1018'), team='red';
      if(S.key==='W') col=inLetter(c,row)?(rnd()<.94?'#f7f5ef':'#c81e2a'):(rnd()<.95?'#c81e2a':'#a3151f');
      if(S.key==='E'){ const zz=az*s;
        if(zz>away.z0-3 && zz<away.z1+3 && row<=away.r1+2){ if(zz<away.z0||zz>away.z1||row>away.r1){ continue; } // leere Pufferplätze
          col=rnd()<.8?(rnd()<.5?'#1f57c3':'#173f8f'):'#f2f2f2'; team='blue'; } }
      if(S.key!=='W' && rnd()<.05) continue; // ein paar freie Plätze
      const f={x,y,z,col,team,face:Math.atan2(fx,fz),ph:rnd()*6.3,scarf:rnd()<(S.key==='W'?.55:.35)?(team==='blue'?'#f2f2f2':(S.key==='W'?col:(rnd()<.6?'#ffffff':'#c81e2a'))):null,skin:['#f1c9a5','#e0ac80','#c68c62','#8d5a3b'][Math.floor(rnd()*4)], ax, az};
      fans.push(f);
      if(team==='blue') targets.push(f);
      if(S.key==='E' && team==='red'){ const zz=az*s; if((zz>away.z0-11&&zz<away.z0-3)||(zz>away.z1+3&&zz<away.z1+11)||(zz>=away.z0&&zz<=away.z1&&row>away.r1+2&&row<away.r1+7)) throwers.push(f); }
    }
  });
  { const mkI=(L,col)=>{ const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),lam(col),L.length), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), Z=new THREE.Vector3(0,0,1);
      L.forEach(([a,b,t],i)=>{ const A3=new THREE.Vector3(...a), B3=new THREE.Vector3(...b), dir=B3.clone().sub(A3), len=dir.length(); q.setFromUnitVectors(Z,dir.normalize()); m4.compose(A3.add(B3).multiplyScalar(.5),q,new THREE.Vector3(t,t,len)); im.setMatrixAt(i,m4); });
      world.add(im); }; mkI(beams,'#3c4249'); mkI(frameB,'#dfe3e6'); }
  // Zaun um den Gästeblock: vorne, an beiden Seiten die Tribüne hinauf und hinten quer
  { const mesh=canvasTex(64,64,g=>{ g.clearRect(0,0,64,64); g.strokeStyle='rgba(205,210,215,.95)'; g.lineWidth=2.5;
      for(let i=-64;i<128;i+=16){ g.beginPath(); g.moveTo(i,0); g.lineTo(i+64,64); g.stroke(); g.beginPath(); g.moveTo(i,64); g.lineTo(i+64,0); g.stroke(); } });
    mesh.wrapS=mesh.wrapT=THREE.RepeatWrapping;
    const FH=2.6, fMat=new THREE.MeshLambertMaterial({map:mesh,transparent:true,alphaTest:.3,side:THREE.DoubleSide}), railM=lam('#8d949b');
    const fence=(a,b)=>{ const L=Math.hypot(b[0]-a[0],b[2]-a[2]), g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([...a, ...b, a[0],a[1]+FH,a[2], b[0],b[1]+FH,b[2]]),3));
      g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([0,0, L/0.8,0, 0,FH/0.8, L/0.8,FH/0.8]),2)); g.setIndex([0,1,2, 1,3,2]); g.computeVertexNormals();
      world.add(new THREE.Mesh(g,fMat));
      const top=cyl(.05,railM); place(top,[a[0],a[1]+FH,a[2]],[b[0],b[1]+FH,b[2]]); world.add(top);
      const n=Math.max(1,Math.round(L/2.5)); for(let i=0;i<=n;i++){ const t=i/n, q=[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
        const post=cyl(.06,railM); place(post,q,[q[0],q[1]+FH+.05,q[2]]); world.add(post); } };
    const za=away.z0-1.5, zb=away.z1+1.5, back=(away.r1+1)*RD+1.1, xF=Xs+0.15, xB=Xs+back, yF=6.5, yB=6.5+back/RD*RH;
    fence([xF,yF,za],[xF,yF,zb]);            // vorne an der Brüstung
    fence([xF,yF,za],[xB,yB,za]);            // linke Seite die Stufen hinauf
    fence([xF,yF,zb],[xB,yB,zb]);            // rechte Seite
    fence([xB,yB,za],[xB,yB,zb]); }          // hinten quer
  // Ecken: mehrstöckige Ecktürme mit grünlich-blauer Glasfassade und Betonscheibe außen
  const towerTex=canvasTex(256,256,g=>{ g.fillStyle='#4f8a86'; g.fillRect(0,0,256,256); for(let fl=0;fl<8;fl++){ const y=fl*32; g.fillStyle='#d8dcd8'; g.fillRect(0,y,256,5);
      for(let x=0;x<256;x+=32){ g.fillStyle=`hsl(${168+Math.random()*22},${26+Math.random()*14}%,${32+Math.random()*18}%)`; g.fillRect(x+2,y+6,28,25); } g.fillStyle='#2f3b3d'; for(let x=0;x<256;x+=32) g.fillRect(x,y+5,2,27); } });
  const towerMat=new THREE.MeshLambertMaterial({map:towerTex,emissiveMap:towerTex,emissive:'#000000'}), conc=lam('#b9b7b0');
  for(const sx of [-1,1]) for(const sz of [-1,1]){ const b=new THREE.Mesh(new THREE.BoxGeometry(24,TOWER_H,24),[towerMat,towerMat,conc,conc,towerMat,towerMat]);
    b.position.set(sx*(Xs+11),TOWER_H/2,sz*(Zs+11)); world.add(b); const rf=new THREE.Mesh(new THREE.BoxGeometry(25,1,25),lam('#c9c7c0')); rf.position.set(sx*(Xs+11),TOWER_H+.5,sz*(Zs+11)); world.add(rf);
    const cw=new THREE.Mesh(new THREE.BoxGeometry(1.2,TOWER_H+1,24.4),conc); cw.position.set(sx*(Xs+23),(TOWER_H+1)/2,sz*(Zs+11)); world.add(cw); }

  const IM=(geo,list)=>{ const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({color:'#fff'}),Math.max(1,list.length)); im.count=list.length; world.add(im); return im; };
  const body=IM(new THREE.CylinderGeometry(.22,.19,.75,6),fans), head=IM(new THREE.SphereGeometry(.14,6,5),fans), scL=fans.filter(f=>f.scarf), scarf=IM(new THREE.BoxGeometry(.06,.13,1.05),scL);
  const c=new THREE.Color(); fans.forEach((f,i)=>{ body.setColorAt(i,c.set(f.col)); head.setColorAt(i,c.set(f.skin)); }); scL.forEach((f,i)=>scarf.setColorAt(i,c.set(f.scarf)));
  body.instanceColor.needsUpdate=head.instanceColor.needsUpdate=true; if(scarf.instanceColor) scarf.instanceColor.needsUpdate=true;

  // Große Schwenkfahnen in der Westkurve (rot-weiß, ohne Wappen)
  const flagTex=canvasTex(128,80,g=>{ g.fillStyle='#c81e2a'; g.fillRect(0,0,128,80); g.fillStyle='#fff'; g.beginPath(); g.moveTo(0,80); g.lineTo(128,0); g.lineTo(128,30); g.lineTo(40,80); g.fill(); });
  const flags=[]; for(let i=0;i<7;i++){ const z=-Zs+12+i*(2*Zs-24)/6, row=4+(i%3)*5, x=-Xs-row*RD, y=6.5+row*RH;
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,5,5), lam('#ddd')); pole.position.set(x+0.3,y+2.5,z); world.add(pole);
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6,8,1), new THREE.MeshLambertMaterial({map:flagTex,side:THREE.DoubleSide})); fl.position.set(x+0.3,y+3.8,z+2.1); world.add(fl); flags.push({m:fl,pole,x:x+0.3,z,ph:i*1.3,y:y+3.8}); }

  // Würfe aus den roten Blöcken auf den Gästeblock: Bierbecher und Müll
  const NP=70, proj=[]; for(let i=0;i<NP;i++) proj.push({ph:rnd()*10, dur:1.3+rnd()*0.7, pause:0.4+rnd()*2.5, cup:rnd()<.55, s:null, e:null});
  const cupG=new THREE.CylinderGeometry(.3,.22,.6,8), trashG=new THREE.IcosahedronGeometry(.35,0);
  const cups=IM(cupG,proj.filter(p=>p.cup)), trash=IM(trashG,proj.filter(p=>!p.cup));
  cups.material.color.set('#f2c230'); proj.filter(p=>!p.cup).forEach((p,i)=>trash.setColorAt(i,c.set(['#e9e9e2','#9a9a90','#8b6a46','#d8d0b8'][i%4]))); if(trash.instanceColor) trash.instanceColor.needsUpdate=true;
  const splash=IM(new THREE.SphereGeometry(.2,5,4),[...Array(NP*4)]); splash.material.color.set('#f6e27a'); splash.material.transparent=true; splash.material.opacity=.8;
  // Pyrotechnik in der Westkurve – zündet, sobald jemand im Ziel ist
  const glowTex=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.25,'rgba(255,255,255,.8)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
  const smokeTex=canvasTex(64,64,g=>{ for(let i=0;i<10;i++){ const x=20+Math.random()*24, y=20+Math.random()*24, r2=10+Math.random()*12, gr=g.createRadialGradient(x,y,0,x,y,r2); gr.addColorStop(0,'rgba(255,255,255,.5)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); } });
  const add=THREE.AdditiveBlending, wFans=fans.filter(f=>f.x<-Xs), pyro=[], wRoof=6.5+ROWS*RH+9-2.5;
  for(let i=0;i<60 && wFans.length;i++){ const f=wFans[Math.floor(rnd()*wFans.length)], P={x:f.x, y:f.y+2.0, z:f.z, d0:rnd()*2.5, ph:rnd()*6.3, smoke:[]};
    P.glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#ff6a1a',blending:add,transparent:true,depthWrite:false,fog:false}));
    P.core=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#fff0b0',blending:add,transparent:true,depthWrite:false,fog:false}));
    for(const s2 of [P.glow,P.core]){ s2.position.set(P.x,P.y,P.z); s2.visible=false; world.add(s2); }
    for(let j=0;j<5;j++){ const sm=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#e0a8a0',transparent:true,opacity:0,depthWrite:false})); sm.visible=false; world.add(sm); P.smoke.push(sm); }
    pyro.push(P); }
  const NS=pyro.length*36, sInfo=[]; for(let i=0;i<NS;i++) sInfo.push({p:i%pyro.length, life:.5+rnd()*.7, off:rnd()*2, vx:(rnd()-.5)*3, vy:2+rnd()*4, vz:(rnd()-.5)*3});
  const spGeo=new THREE.BufferGeometry(); spGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NS*3).fill(-100),3));
  const sparks=new THREE.Points(spGeo,new THREE.PointsMaterial({map:glowTex,color:'#ffd27a',size:.6,transparent:true,blending:add,depthWrite:false,fog:false})); sparks.visible=false; sparks.frustumCulled=false; world.add(sparks);
  const pLights=[-32,0,32].map(z=>{ const l=new THREE.PointLight('#ff5a1a',0,90); l.position.set(-Xs-8,16,z); world.add(l); return l; });
  anim.stadium={fans,body,head,scarf,scL,flags,proj,cups,trash,splash,throwers,targets,rnd,pyro:{list:pyro,sparks,sInfo,lights:pLights,roof:wRoof,t0:null}};
  Object.assign(anim.stadium,{towerMat,woodMesh,dryMat:woodMesh.material,wetMat:new THREE.MeshPhongMaterial({map:wood,color:'#9c8e80',specular:'#777777',shininess:80,side:THREE.DoubleSide})});
  Object.assign(anim.stadium,buildStadiumExtras()); applyStadiumEnv();
  poseStadium(0);

  buildRiders(); [...RKEYS,'devil'].forEach(k=>addFloodShadows(riders3d[k]));
  world.traverse(o=>{ if(o.isMesh){ o.receiveShadow=true; o.castShadow=!(o.geometry&&o.geometry.type==='PlaneGeometry') && !o.material.transparent; } });
}
function poseStadium(t){
  const A=anim.stadium; if(!A) return; const m=new THREE.Matrix4(), q=new THREE.Quaternion(), s=new THREE.Vector3(1,1,1), p=new THREE.Vector3(), e=new THREE.Euler(), up=new THREE.Vector3(0,1,0);
  poseStadiumExtras(A,t);
  const gf=A.goalFx&&t>=A.goalFx.t0&&t-A.goalFx.t0<9?A.goalFx:null, ex=A.excite!=null&&t>=A.excite&&t-A.excite<3.5, clap=!!A.clap, clapH=Math.max(0,Math.sin(t*10.05))*.2;
  A.fans.forEach((f,i)=>{ let hop=f.team==='blue'? Math.max(0,Math.sin(t*2+f.ph))*.04 : Math.max(0,Math.sin(t*(4.5+f.ph%1.5)+f.ph))*.22;
    if(clap&&f.team==='red') hop=clapH; // letzte Runde: alle im Takt
    if(ex) hop*=f.team==='blue'?4:1.8;   // Führungswechsel
    if(gf) hop=f.team===(gf.team?'blue':'red')?Math.max(0,Math.sin(t*7.5+f.ph))*.5:hop*.1; // Torjubel
    q.setFromAxisAngle(up,f.face); p.set(f.x,f.y+hop+.42,f.z); m.compose(p,q,s); A.body.setMatrixAt(i,m);
    p.set(f.x,f.y+hop+.92,f.z); m.compose(p,q,s); A.head.setMatrixAt(i,m); f.hop=hop; });
  A.scL.forEach((f,i)=>{ const sw=Math.sin(t*3+f.ph)*.18, up2=clap&&f.team==='red'&&!(A.choreoOn&&f.x<-ST.Xs); if(up2) e.set(0,f.face+Math.PI/2,0,'YXZ'); else e.set(sw,f.face,0,'YXZ'); q.setFromEuler(e); p.set(f.x,f.y+f.hop+(up2?1.95:1.38),f.z); m.compose(p,q,s); A.scarf.setMatrixAt(i,m); });
  A.body.instanceMatrix.needsUpdate=A.head.instanceMatrix.needsUpdate=A.scarf.instanceMatrix.needsUpdate=true;
  A.flags.forEach(F=>{ const a=Math.sin(t*1.6+F.ph)*0.9; F.m.position.set(F.x+Math.sin(a)*2.1,F.y+Math.cos(a)*.3,F.z+Math.cos(a)*2.1); F.m.rotation.y=a+Math.PI/2; });
  let ci=0, ti=0, si=0;
  A.proj.forEach(P=>{ const cyc=P.dur+P.pause, k=((t+P.ph)%cyc), n=Math.floor((t+P.ph)/cyc);
    if(P.n!==n || !P.s){ P.n=n; P.s=A.throwers[Math.floor(A.rnd()*A.throwers.length)]; P.e=A.targets[Math.floor(A.rnd()*A.targets.length)]; }
    const im=P.cup?A.cups:A.trash, idx=P.cup?ci++:ti++;
    if(!P.s||!P.e||k>P.dur){ m.makeScale(0,0,0); im.setMatrixAt(idx,m);
      for(let j=0;j<(P.cup?4:0);j++){ const st=k-P.dur; const o=si++; if(P.e && st>=0 && st<0.35){ const a=j*1.57+P.ph; p.set(P.e.x+Math.cos(a)*st*2.2, P.e.y+1.2+st*1.5-st*st*9, P.e.z+Math.sin(a)*st*2.2); m.compose(p,q.identity(),s.set(1,1,1)); } else m.makeScale(0,0,0); A.splash.setMatrixAt(o,m); }
      return; }
    const u=k/P.dur; p.set(P.s.x+(P.e.x-P.s.x)*u, P.s.y+1.6+(P.e.y+1.0-P.s.y-1.6)*u+Math.sin(Math.PI*u)*6, P.s.z+(P.e.z-P.s.z)*u);
    e.set(t*7+P.ph,t*5,0); q.setFromEuler(e); m.compose(p,q,s.set(1,1,1)); im.setMatrixAt(idx,m);
    if(P.cup) for(let j=0;j<4;j++){ m.makeScale(0,0,0); A.splash.setMatrixAt(si++,m); } });
  for(let j=si;j<A.proj.length*4;j++){ m.makeScale(0,0,0); A.splash.setMatrixAt(j,m); }
  A.cups.instanceMatrix.needsUpdate=A.trash.instanceMatrix.needsUpdate=A.splash.instanceMatrix.needsUpdate=true;
  const Y=A.pyro; if(Y && Y.t0!=null){ const T=t-Y.t0;
    Y.list.forEach(P=>{ const k=T-P.d0, on=k>0; P.glow.visible=P.core.visible=on; if(!on) return;
      const fl=.75+.25*Math.sin(t*23+P.ph)*Math.sin(t*17+P.ph*2)+(Math.random()-.5)*.25, ig=Math.min(1,k*3);
      P.glow.scale.setScalar((5.5+fl*2)*ig); P.glow.material.opacity=ig; P.core.scale.setScalar((2+fl*.8)*ig);
      const life=7, n=P.smoke.length;
      P.smoke.forEach((sm,j)=>{ const born=k>j*life/n; sm.visible=born; if(!born) return; const u=((k-j*life/n)%life)/life;
        sm.position.set(P.x+u*u*8+Math.sin(u*4+P.ph)*.6, Math.min(Y.roof, P.y+.5+u*9), P.z+Math.cos(u*3+P.ph)*.8); sm.scale.setScalar(2.5+u*10); sm.material.opacity=.75*Math.sin(Math.PI*Math.min(1,u*1.15)); }); });
    const pa=Y.sparks.geometry.attributes.position, arr=pa.array;
    Y.sInfo.forEach((S,i)=>{ const P=Y.list[S.p], k=T-P.d0; if(k<0){ arr[i*3+1]=-100; return; } const a=(k+S.off)%S.life;
      arr[i*3]=P.x+S.vx*a; arr[i*3+1]=P.y+S.vy*a-4.9*a*a; arr[i*3+2]=P.z+S.vz*a; });
    pa.needsUpdate=true; Y.sparks.visible=true;
    Y.lights.forEach((l,i)=>l.intensity=Math.min(1,T)*(4+Math.sin(t*19+i*2)*.8+Math.random()*.8)); }
}

/* ================= Stadion-Extras: Fußballspiel, Eckfahnen, Flutlicht, Anzeigetafel, Bänke, Ordner, TV-Kamera, Konfetti ================= */
const NIGHT_BG=0x0a1220;
// Stadion: Tageszeit (tag/abend/nacht) und Regen anwenden – Regen ist nur Optik, die Physik bleibt gleich
function applyStadiumEnv(){ const A=anim.stadium; if(!A||!A.fl) return; const tod=race.tod||'tag', rain=!!race.rain, night=tod==='nacht', dusk=tod==='abend';
  dayLights(); sky.visible=!night; setSky(dusk?(rain?'duskGrey':'dusk'):(rain?'grey':'day'));
  const bg=night?NIGHT_BG:dusk?(rain?0x9a8478:0xf0a873):rain?0xb6bbbf:HORIZON; scene.background.set(bg); scene.fog.color.set(bg);
  if(night){ hemi.color.set(0x9aa8c4); hemi.groundColor.set(0x2c2c26); hemi.intensity=.32; sun.color.set(0xf4f6ff); sun.intensity=.42; SUN_DIR.set(.3,1,.4).normalize(); }
  else if(dusk){ hemi.color.set(0xffbe96); hemi.groundColor.set(0x3a2c34); hemi.intensity=rain?.42:.5; sun.color.set(0xff9a5a); sun.intensity=rain?.3:.8; SUN_DIR.set(-1,.3,.5).normalize(); sunDisc(!rain); }
  else if(rain){ hemi.color.set(0xc4ccd4); hemi.intensity=.62; sun.color.set(0xeef2f6); sun.intensity=.45; }
  const on=night||dusk; A.fl.spots.forEach(l=>l.intensity=night?.3:dusk?.16:0); A.fl.glows.forEach(g=>g.visible=on); A.fl.cones.forEach(c=>c.visible=night);
  A.fl.lamp.color.set(on?'#fffbe8':'#7d8287'); A.fl.stars.visible=night&&!rain; A.fl.shOp=night?.26:dusk?.12:0;
  A.rain.m.visible=rain; A.rain.m.material.opacity=night?.55:.38; if(A.towerMat) A.towerMat.emissive.set(night?'#4a6a5a':dusk?'#26302a':'#000000');
  if(A.woodMesh) A.woodMesh.material=rain?A.wetMat:A.dryMat; // nasse, glänzende Bahn
  const c=new THREE.Color(); A.ponchos.forEach(i=>A.body.setColorAt(i,c.set(rain?(A.fans[i].team==='blue'?'#d9e4f7':['#e9eef2','#d8323f','#f0f0ea'][i%3]):A.fans[i].col))); A.body.instanceColor.needsUpdate=true; }
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
function crowdSound(dur,vol,f=600){ try{ actx=actx||new AudioContext(); const n=Math.floor(actx.sampleRate*dur), b=actx.createBuffer(1,n,actx.sampleRate), d=b.getChannelData(0); let last=0;
  for(let i=0;i<n;i++){ last=(last+0.06*(Math.random()*2-1))/1.06; d[i]=last*3.5; }
  const s=actx.createBufferSource(); s.buffer=b; const lp=actx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=f; const g=actx.createGain(), t0=actx.currentTime;
  g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(vol,t0+dur*.25); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur); s.connect(lp).connect(g).connect(actx.destination); s.start(); }catch(e){} }

/* Einfache Personen: Körper, Kopf, Arme und Beine schwingen beim Laufen */
function makePerson(G,o){
  const g=new THREE.Group(), body=new THREE.Group(); g.add(body); const C=G.mat;
  const sk=C(o.skin||'#e0ac80'), sh=C(o.shirt), up=o.pants?C(o.pants):sk, low=o.pants?C(o.pants):C(o.socks||o.shirt);
  const add=(geo,mat,y,par=body)=>{ const m=new THREE.Mesh(geo,mat); m.position.y=y; par.add(m); return m; };
  add(G.torso,sh,1.2); add(G.hips,C(o.pants||o.shorts||o.shirt),.92); add(G.head,sk,1.66); add(G.hair,C(o.hair||'#3b2a1e'),1.68);
  if(o.helmet) add(G.helmet,C(o.helmet),1.7); if(o.vest) add(G.vest,C(o.vest),1.22);
  const legs=[], arms=[];
  for(const z of [-.1,.1]){ const L=new THREE.Group(); L.position.set(0,.9,z); body.add(L); add(G.thigh,up,0,L); add(G.shin,low,0,L); const s=add(G.shoe,C(o.shoes||'#1a1a1a'),-.86,L); s.position.x=.06; legs.push(L); }
  for(const z of [-.25,.25]){ const A=new THREE.Group(); A.position.set(0,1.46,z); body.add(A); add(G.upperArm,o.sleeves?C(o.sleeves):sh,0,A); add(G.foreArm,o.sleeves?C(o.sleeves):sk,0,A); arms.push(A); }
  g.scale.setScalar(o.scale||1);
  return {g,body,legs,arms,ph:Math.random()*6,speed:0,rl:0,rr:0,sit:0,armZ:0};
}
function animPerson(P,dt){ const sp=P.speed; P.ph+=dt*(1.5+sp*2.4); const amp=Math.min(.9,sp*.17), s=Math.sin(P.ph)*amp;
  P.legs[0].rotation.z=s+P.sit; P.legs[1].rotation.z=-s+P.sit;
  P.arms.forEach((A,i)=>{ const r=i?P.rr:P.rl; A.rotation.x=(i?-1:1)*2.75*r; A.rotation.z=(1-r)*((i?s:-s)*.8+P.armZ); });
  P.body.position.y=Math.abs(Math.sin(P.ph))*.05*Math.min(1,sp/3); }

function buildStadiumExtras(){
  const {Xs,Zs}=ST, rnd=rng(314), G={mc:{}}; G.mat=c=>G.mc[c]||(G.mc[c]=lam(c));
  const tr=(geo,y)=>{ geo.translate(0,y,0); return geo; };
  Object.assign(G,{torso:new THREE.CylinderGeometry(.2,.17,.6,8), hips:new THREE.CylinderGeometry(.18,.2,.2,8), head:new THREE.SphereGeometry(.12,10,8),
    hair:new THREE.SphereGeometry(.125,10,6,0,Math.PI*2,0,Math.PI/2), helmet:new THREE.SphereGeometry(.145,10,6,0,Math.PI*2,0,Math.PI/2), vest:new THREE.CylinderGeometry(.215,.188,.5,8),
    thigh:tr(new THREE.CylinderGeometry(.075,.065,.44,6),-.22), shin:tr(new THREE.CylinderGeometry(.06,.05,.42,6),-.65), shoe:new THREE.BoxGeometry(.22,.07,.09),
    upperArm:tr(new THREE.CylinderGeometry(.055,.05,.3,6),-.15), foreArm:tr(new THREE.CylinderGeometry(.048,.042,.3,6),-.43)});
  const SK=['#f1c9a5','#e0ac80','#c68c62','#8d5a3b'], HAIR=['#2a1e14','#1a1a1a','#6b4a2a','#c9a35a'], pick=a=>a[Math.floor(rnd()*a.length)];
  const out={statics:[],dollies:[],cflags:[]};
  const person=(o,x,z,face)=>{ const P=makePerson(G,{skin:pick(SK),hair:pick(HAIR),...o}); Object.assign(P,{x,z,face}); P.g.position.set(x,0,z); P.g.rotation.y=-face; world.add(P.g); return P; };
  const steel=G.mat('#9aa1a8'), dark=G.mat('#33383e');

  // ---------- Eckfahnen ----------
  const cft=canvasTex(32,24,g=>{ for(let i=0;i<4;i++) for(let j=0;j<3;j++){ g.fillStyle=(i+j)%2?'#ffffff':'#d62828'; g.fillRect(i*8,j*8,8,8); } });
  const cfm=new THREE.MeshLambertMaterial({map:cft,side:THREE.DoubleSide});
  for(const sx of [-1,1]) for(const sz of [-1,1]){ const pole=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.5,6),G.mat('#f2c94c')); pole.position.set(sx*52.5,.75,sz*34); world.add(pole);
    const piv=new THREE.Group(); piv.position.set(sx*52.5,1.33,sz*34); world.add(piv); const fl=new THREE.Mesh(new THREE.PlaneGeometry(.46,.32),cfm); fl.position.x=.23; piv.add(fl); out.cflags.push({g:piv,ph:rnd()*6}); }

  // ---------- Flutlicht auf den Ecktürmen ----------
  const lampTex=canvasTex(128,64,g=>{ g.fillStyle='#2a2e33'; g.fillRect(0,0,128,64); g.fillStyle='#ffffff'; for(let i=0;i<6;i++) for(let j=0;j<3;j++) g.fillRect(5+i*20.5,5+j*19.5,17,15); });
  const lamp=new THREE.MeshBasicMaterial({map:lampTex,color:'#7d8287'});
  const glowTex=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.2,'rgba(255,255,255,.7)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
  const fl={spots:[],glows:[],cones:[],lamp};
  for(const sx of [-1,1]) for(const sz of [-1,1]){ const bx=sx*(Xs+11), bz=sz*(Zs+11);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(.35,.6,24,10),steel); mast.position.set(bx,TOWER_H+13,bz); world.add(mast);
    const tgt=new THREE.Vector3(sx*12,0,sz*8), hp=new THREE.Vector3(bx,TOWER_H+26,bz);
    const head=new THREE.Group(); head.position.copy(hp); world.add(head); head.lookAt(tgt);
    head.add(new THREE.Mesh(new THREE.BoxGeometry(10,5,.6),dark)); const lp=new THREE.Mesh(new THREE.PlaneGeometry(9.4,4.4),lamp); lp.position.z=.31; head.add(lp);
    const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#fff4d8',blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,fog:false}));
    gl.scale.set(26,26,1); gl.position.copy(hp).addScaledVector(tgt.clone().sub(hp).normalize(),2); world.add(gl); fl.glows.push(gl);
    const sp=new THREE.SpotLight(0xfff4e0,0,0,0.78,0.55,1); sp.position.copy(hp); sp.target.position.copy(tgt); world.add(sp,sp.target); fl.spots.push(sp);
    const L=hp.distanceTo(tgt), cone=new THREE.Mesh(new THREE.ConeGeometry(L*Math.tan(.55),L,32,1,true), new THREE.MeshBasicMaterial({color:'#fff2d0',transparent:true,opacity:.016,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
    cone.position.copy(hp).add(tgt).multiplyScalar(.5); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),hp.clone().sub(tgt).normalize()); world.add(cone); fl.cones.push(cone); }
  { const n=700, sp=new Float32Array(n*3); for(let i=0;i<n;i++){ const a=rnd()*6.28, el=.12+rnd()*1.3, R0=2500; sp.set([Math.cos(a)*Math.cos(el)*R0,Math.sin(el)*R0,Math.sin(a)*Math.cos(el)*R0],i*3); }
    const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3)); fl.stars=new THREE.Points(sg,new THREE.PointsMaterial({color:'#dfe6ff',size:1.6,sizeAttenuation:false,fog:false})); fl.stars.frustumCulled=false; world.add(fl.stars); }
  fl.heads=[]; for(const sx of [-1,1]) for(const sz of [-1,1]) fl.heads.push(new THREE.Vector3(sx*(Xs+11),TOWER_H+26,sz*(Zs+11)));
  fl.shTex=canvasTex(128,32,g=>{ const gr=g.createLinearGradient(0,0,128,0); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.25,'rgba(0,0,0,.8)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,128,32);
    g.globalCompositeOperation='destination-in'; const v=g.createLinearGradient(0,0,0,32); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(.5,'rgba(0,0,0,1)'); v.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=v; g.fillRect(0,0,128,32); });
  fl.shOp=0; out.fl=fl;

  // ---------- Spruchbänder unter dem Dach der Westkurve (wechseln alle 20 s) ----------
  out.banTex=banTexs(); out.banNames=RIDERS[myKey].name+'|'+RIDERS[oppKey].name;
  out.banners=[-32,0,32].map((z,i)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(26,2.4),new THREE.MeshLambertMaterial({map:out.banTex[i],emissiveMap:out.banTex[i],emissive:'#8a8a8a',side:THREE.DoubleSide})); m.rotation.y=Math.PI/2; m.position.set(-Xs+15.9,6.5+22*ST_RH+9-2.3,z); world.add(m); return m; });
  out.banK=0;

  // ---------- Regen: Tropfen um die Kamera, Ponchos im Publikum ----------
  { const NR=1800, rp=new Float32Array(NR*6), info=[]; for(let i=0;i<NR;i++) info.push([(rnd()-.5)*60,rnd()*30-8,(rnd()-.5)*60]);
    const rg=new THREE.BufferGeometry(); rg.setAttribute('position',new THREE.BufferAttribute(rp,3));
    const m=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:'#d6dee8',transparent:true,opacity:.4,depthWrite:false})); m.frustumCulled=false; m.visible=false; world.add(m); out.rain={m,info}; }
  out.ponchos=anim.stadium.fans.map((f,i)=>i).filter(()=>rnd()<.38);

  // ---------- Kampfrichter mit Rundenglocke an der Ziellinie ----------
  { const pod=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.8,1.3),G.mat('#e9e9e4')); pod.position.set(0,.9,-45.6); world.add(pod);
    const P=makePerson(G,{shirt:'#1d2b44',pants:'#1d2230',sleeves:'#1d2b44',skin:pick(SK),hair:pick(HAIR)}); P.g.position.set(0,1.8,-45.6); P.g.rotation.y=-Math.PI/2; world.add(P.g);
    const bell=new THREE.Group(); bell.position.y=-.62; P.arms[1].add(bell);
    const hd=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.16,6),G.mat('#5a3a22')); hd.position.y=-.06; bell.add(hd);
    const cup=new THREE.Mesh(new THREE.CylinderGeometry(.05,.13,.2,14,1,true),new THREE.MeshLambertMaterial({color:'#c9a13b',side:THREE.DoubleSide})); cup.position.y=-.24; bell.add(cup);
    out.bell={P,bell,t0:-1e9}; }

  // ---------- Anzeigetafeln auf den Dächern der Längstribünen ----------
  const sbc=document.createElement('canvas'); sbc.width=1024; sbc.height=360; const sbt=new THREE.CanvasTexture(sbc); sbt.anisotropy=4; const sbm=new THREE.MeshBasicMaterial({map:sbt});
  const roofTop=2.5+22*ST_RH+ST_TIER.step+9+0.5;
  for(const sz of [-1,1]){ const B=new THREE.Group(); B.position.set(0,roofTop,sz*(Zs-5)); B.rotation.y=sz<0?0:Math.PI; world.add(B);
    const fr=new THREE.Mesh(new THREE.BoxGeometry(25.4,9.6,1),dark); fr.position.y=13.6; B.add(fr);
    const sc=new THREE.Mesh(new THREE.PlaneGeometry(24.4,8.6),sbm); sc.position.set(0,13.6,.51); B.add(sc);
    for(const x of [-9,9]){ const l=new THREE.Mesh(new THREE.BoxGeometry(.5,9,.5),steel); l.position.set(x,4.5,-.3); B.add(l); } } // Tafel auf Stützen, damit sie über die Dachkante schaut
  out.sb={g:sbc.getContext('2d'),tex:sbt,lap:0,t0:0,last:null,prevT:0,acc:9};
  // Videowände in den vier Ecken (zeigen dasselbe wie die Anzeigetafeln)
  for(const sx of [-1,1]) for(const sz of [-1,1]){ const x=sx*(Xs-1), z=sz*(Zs-1), dl=Math.hypot(x,z), dx=-x/dl, dz=-z/dl, V=new THREE.Group();
    V.position.set(x+dx*7,12,z+dz*7); V.rotation.y=Math.atan2(dx,dz); world.add(V);
    V.add(new THREE.Mesh(new THREE.BoxGeometry(14.6,7.8,.8),dark)); const sc=new THREE.Mesh(new THREE.PlaneGeometry(14,7.2),sbm); sc.position.z=.41; V.add(sc);
    for(const lx of [-5,5]){ const l=new THREE.Mesh(new THREE.BoxGeometry(.4,8.1,.4),steel); l.position.set(lx,-7.95,-.2); V.add(l); } }
  // ---------- Choreo der Westkurve: Pappen-Mosaik, Figur des Führenden, Spruchband ----------
  { const wd=22, wh=22*ST_RH, L=Math.hypot(wd,wh), ang=Math.atan2(wh,wd), at=(sl,lift)=>[-Xs-sl*Math.cos(ang), 6.5+sl*Math.sin(ang)+lift], rot=m=>{ m.rotation.y=Math.PI/2; m.rotateX(-(Math.PI/2-ang)); };
    const cv=document.createElement('canvas'); cv.width=2048; cv.height=512; const tex=new THREE.CanvasTexture(cv); tex.anisotropy=4;
    const mos=new THREE.Mesh(new THREE.PlaneGeometry(2*Zs-1,L,1,22),new THREE.MeshLambertMaterial({map:tex,emissiveMap:tex,emissive:'#5a5a5a',side:THREE.DoubleSide}));
    const [mx,my]=at(L/2,1.9); mos.position.set(mx,my,0); rot(mos); mos.visible=false; world.add(mos);
    const fcv=document.createElement('canvas'); fcv.width=640; fcv.height=640; const ftex=new THREE.CanvasTexture(fcv), FL=L*.86, fgm=new THREE.PlaneGeometry(FL,FL); fgm.translate(0,FL/2,0);
    const fig=new THREE.Mesh(fgm,new THREE.MeshLambertMaterial({map:ftex,emissiveMap:ftex,emissive:'#6a6a6a',transparent:true,alphaTest:.15,side:THREE.DoubleSide}));
    const [fx0,fy0]=at(L*.13,2.3); fig.position.set(fx0,fy0,0); rot(fig); fig.visible=false; world.add(fig);
    out.choreo={mos,fig,cv,tex,fcv,ftex,t0:-1e9,L,FL,s0:L*.13,MW:2*Zs-1}; }

  // ---------- Ersatzbänke, Trainer, Vierter Offizieller ----------
  const acryl=new THREE.MeshLambertMaterial({color:'#cfe6f2',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false});
  [[-12,'#b3212b',1],[12,'#1f57c3',-1]].forEach(([cx,col,cs])=>{
    const box=(w,h,d,m,x,y,z)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); o.position.set(x,y,z); world.add(o); };
    box(7,.08,1,G.mat('#55595e'),cx,.04,-35.05); box(6.6,.45,.45,G.mat('#2a2d31'),cx,.26,-35.25);
    box(7,1.9,.05,acryl,cx,1.0,-35.52); box(7,.05,1.1,acryl,cx,1.95,-35.0); box(.05,1.9,1.1,acryl,cx-3.5,1.0,-35.0); box(.05,1.9,1.1,acryl,cx+3.5,1.0,-35.0);
    for(let k=0;k<5;k++){ const P=person({shirt:col,pants:'#1d1f24',sleeves:col},cx-2.6+k*1.3,-35.2,Math.PI/2); P.sit=Math.PI/2; P.g.position.y=-.43; out.statics.push(P); }
    const co=person({shirt:'#26282d',pants:'#26282d',sleeves:'#26282d'},cx+cs*2.2,-34.35,Math.PI/2); co.gest=true; out.statics.push(co); });
  { const P=person({shirt:'#15161a',pants:'#15161a',sleeves:'#15161a'},0,-34.4,Math.PI/2); P.armZ=.9; out.statics.push(P);
    const brd=new THREE.Mesh(new THREE.BoxGeometry(.05,.38,.55),new THREE.MeshBasicMaterial({color:'#19d64a'})); brd.position.set(.46,1.1,0); P.body.add(brd); }

  // ---------- Balljungen und Kameraleute ----------
  const ballTex=canvasTex(64,32,g=>{ g.fillStyle='#fff'; g.fillRect(0,0,64,32); g.fillStyle='#1a1a1a'; for(const [x,y] of [[8,8],[24,20],[40,8],[56,20],[16,28],[48,28],[32,2]]){ g.beginPath(); g.arc(x,y,4,0,7); g.fill(); } });
  const ballMat=new THREE.MeshLambertMaterial({map:ballTex}), ballGeo=new THREE.SphereGeometry(.11,14,10);
  for(const [x,z] of [[-57,-9],[-57,9],[57,-9],[57,9],[-25,34.7],[25,34.7]]){ const P=person({shirt:'#f2d230',pants:'#1d2b44',scale:.78},x,z,Math.atan2(-z,-x)); P.armZ=.9; out.statics.push(P);
    const b=new THREE.Mesh(ballGeo,ballMat); b.position.set(.42,1.02,0); P.body.add(b); }
  for(const [x,z,f] of [[-56.5,-6.5,0],[-56.5,6.5,0],[56.5,-6.5,Math.PI],[56.5,6.5,Math.PI],[-16,34.75,-Math.PI/2],[16,34.75,-Math.PI/2]]){
    const P=person({shirt:'#30343a',pants:'#30343a',sleeves:'#30343a'},x,z,f); P.rr=.55; out.statics.push(P);
    const cam=new THREE.Mesh(new THREE.BoxGeometry(.5,.28,.22),G.mat('#141518')); cam.position.set(.12,1.62,.3); P.body.add(cam);
    const lens=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.25,8),G.mat('#0b0b0c')); lens.rotation.z=Math.PI/2; lens.position.set(.48,1.62,.3); P.body.add(lens); }

  // ---------- TV-Kameras auf Schienen hinter beiden Geraden ----------
  { const sl=[]; for(const sz of [-1,1]) for(let x=-42;x<=42;x+=2) sl.push([x,sz*47.6]);
    const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.2,.06,1.3),G.mat('#5a4a3a'),sl.length), m4=new THREE.Matrix4(); sl.forEach(([x,z],i)=>{ m4.makeTranslation(x,.03,z); im.setMatrixAt(i,m4); }); world.add(im); }
  for(const sz of [-1,1]){ const rz=sz*47.6;
    for(const o of [-.45,.45]){ const r=new THREE.Mesh(new THREE.BoxGeometry(86,.12,.1),steel); r.position.set(0,.09,rz+o); world.add(r); }
    const D=new THREE.Group(); D.position.set(0,0,rz); world.add(D);
    const pl=new THREE.Mesh(new THREE.BoxGeometry(1.6,.35,1.3),dark); pl.position.y=.3; D.add(pl);
    const ms=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,4.6,8),steel); ms.position.y=2.75; D.add(ms);
    const head=new THREE.Group(); head.position.y=5.1; D.add(head);
    head.add(new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.7),G.mat('#1c1e22'))); const ln=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.4,10),G.mat('#0b0b0c')); ln.rotation.x=Math.PI/2; ln.position.z=.5; head.add(ln);
    const red=new THREE.Mesh(new THREE.SphereGeometry(.05,6,4),new THREE.MeshBasicMaterial({color:'#ff2020'})); red.position.set(0,.24,.2); head.add(red);
    const op=makePerson(G,{shirt:'#2a2d33',pants:'#2a2d33',sleeves:'#2a2d33',skin:pick(SK)}); op.g.position.set(-.5,.48,0); op.g.rotation.y=sz*Math.PI/2; D.add(op.g);
    out.dollies.push({g:D,head,x:0}); }

  // ---------- Ordner und Polizei vor dem Gästeblock ----------
  for(let k=0,z=-53;z<=-31;z+=2.2,k++){ const pol=k%3===1;
    out.statics.push(person(pol?{shirt:'#1e2c46',pants:'#1e2c46',sleeves:'#1e2c46',helmet:'#2a3446'}:{shirt:'#2a2d33',pants:'#2a2d33',sleeves:'#2a2d33',vest:'#e6e22e'},Xs-1.6,z+(rnd()-.5)*.4,0)); }

  // ---------- Konfetti aus der Westkurve bei der Zieleinfahrt ----------
  { const NC=1600, cp=new Float32Array(NC*3).fill(-100), cc=new Float32Array(NC*3), info=[], cr=new THREE.Color();
    for(let i=0;i<NC;i++){ const row=rnd()*21; info.push({x0:-Xs-.6-row, y0:6.5+row*ST_RH+1.6, z0:(rnd()-.5)*2*Zs*.95, off:rnd()*5, ph:rnd()*6, vy:4+rnd()*4, vx:1.2+rnd()*1.5});
      cr.set(rnd()<.5?'#d81e2c':rnd()<.85?'#ffffff':'#ffd23a'); cc.set([cr.r,cr.g,cr.b],i*3); }
    const cg=new THREE.BufferGeometry(); cg.setAttribute('position',new THREE.BufferAttribute(cp,3)); cg.setAttribute('color',new THREE.BufferAttribute(cc,3));
    const pts=new THREE.Points(cg,new THREE.PointsMaterial({size:.28,vertexColors:true})); pts.frustumCulled=false; pts.visible=false; world.add(pts); out.confetti={pts,info,t0:null}; }

  // ---------- Fußballspiel: Rot (Heim) gegen Blau (Gast) ----------
  const F=[[-50,0],[-36,-22],[-38,-8],[-38,8],[-36,22],[-17,-24],[-19,-8],[-19,8],[-17,24],[-4,-8],[-4,8]];
  const ball=new THREE.Mesh(ballGeo,ballMat); world.add(ball);
  const M={pl:[],score:[0,0],state:'kick',timer:3,hold:0,t:0,ball:{x:0,z:0,y:.11,owner:null,fly:null,mesh:ball}};
  for(const team of [0,1]){ const d=team?-1:1; F.forEach(([bx,bz],i)=>{ const gk=i===0, kc=gk?(team?'#f2c230':'#2fa84f'):(team?'#1f57c3':'#c81e2a');
    const P=makePerson(G,{shirt:kc, shorts:gk?'#1d1f24':(team?'#1f57c3':'#f2f2f2'), socks:gk?'#1d1f24':(team?'#f2f2f2':'#c81e2a'), sleeves:gk?kc:null, skin:pick(SK), hair:pick(HAIR), shoes:pick(['#1a1a1a','#f2f2f2','#e8590c'])});
    Object.assign(P,{team,d,gk,idx:i,bx:bx*d,bz,x:bx*d,z:bz,face:team?Math.PI:0,spot:null,cele:[0,0]}); world.add(P.g); M.pl.push(P); }); }
  M.ref=makePerson(G,{shirt:'#15161a',shorts:'#15161a',socks:'#15161a',skin:pick(SK),hair:'#1a1a1a'}); Object.assign(M.ref,{x:-6,z:12,face:0}); world.add(M.ref.g);
  M.onGoal=team=>{ const A=anim.stadium; if(A) A.goalFx={team,t0:A.lastT||0}; crowdSound(4,.22,900); };
  matchKickoff(M,0); M.pl.forEach(p=>{ if(p.spot){ p.x=p.spot[0]; p.z=p.spot[1]; } });
  out.match=M;
  return out;
}

/* ---------- Spruchbänder der Westkurve mit den Namen der beiden Fahrer ---------- */
function banTexs(){ const A=RIDERS[myKey].name.toUpperCase(), B=RIDERS[oppKey].name.toUpperCase();
  return [[`HOPP ${A}!`,'#c81e2a'],[`${B} VOR!`,'#1a1a1a'],['WESTKURVE STEHT HINTER EUCH','#c81e2a'],[`${A} & ${B} – TRITT REIN!`,'#1a1a1a'],['WATT ZÄHLT, NICHT REDEN!','#c81e2a'],[`${B} – KÖNIG DER STEILKURVE`,'#1a1a1a']]
    .map(([t,c])=>canvasTex(1024,96,g=>{ g.fillStyle='#f4f1e8'; g.fillRect(0,0,1024,96);
      for(let x=0;x<1024;x+=64){ const gr=g.createLinearGradient(x,0,x+64,0); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(.5,'rgba(0,0,0,.08)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(x,0,64,96); }
      g.font='800 70px "Barlow Condensed", Arial Narrow, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle=c; g.fillText(t,512,52,980); })); }
/* ---------- Mehrere weiche Fahrerschatten vom Flutlicht (abends und nachts) ---------- */
function addFloodShadows(r){ const A=anim.stadium; if(!A||!A.fl) return; r.flsh=[];
  for(let i=0;i<4;i++){ const piv=new THREE.Group(); piv.position.y=.012; r.tilt.add(piv);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:A.fl.shTex,color:'#000000',transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4})); m.rotation.x=-Math.PI/2; m.visible=false; piv.add(m); r.flsh.push({piv,m}); } }
/* ---------- Wiederholung: Standbild der TV-Kamera bei der Zieleinfahrt für die Anzeigetafel ---------- */
function takeReplay(){ const A=anim.stadium; if(!A||!A.sb||A.replay||race.mode==='train'||race.state!=='run') return;
  const w=512, h=272, rt=new THREE.WebGLRenderTarget(w,h), cam=new THREE.PerspectiveCamera(30,w/h,.3,4000), buf=new Uint8Array(w*h*4);
  cam.position.set(9,5.2,-47.6); cam.lookAt(-1,1.1,-39.3); cam.updateMatrixWorld();
  renderer.setRenderTarget(rt); renderer.render(scene,cam); renderer.readRenderTargetPixels(rt,0,0,w,h,buf); renderer.setRenderTarget(null); rt.dispose();
  const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'), id=g.createImageData(w,h);
  for(let y=0;y<h;y++) id.data.set(buf.subarray((h-1-y)*w*4,(h-y)*w*4),y*w*4); g.putImageData(id,0,0);
  A.replay={c,t0:A.lastT||0}; A.sb.acc=9; }
/* ---------- Choreo: startet mit der Glocke zur letzten Runde und zeigt den Führenden im Fahrer-Look ---------- */
function startChoreo(A,key,t){ const C=A.choreo, g=C.cv.getContext('2d'), W=2048, H=512, SH=-180; // SH: alles etwas nach links, damit die Videowand rechts nichts verdeckt
  // Figur: der Fahrer aus der Lobby-Vorschau, groß gerendert
  const f=C.fcv.getContext('2d'); f.clearRect(0,0,640,640);
  for(const kk in prev.rs) prev.rs[kk].g.visible=kk===key; const r=prev.rs[key]; poseRider(r,1.1); r.g.position.set(0,0,0); r.g.rotation.y=-.5;
  const gm=prev.sc.children.filter(o=>o.isMesh); gm.forEach(o=>o.visible=false); if(ED.r) ED.r.g.visible=false;
  prev.cam.position.set(1.5,1.1,2.9); prev.cam.lookAt(0,.95,0); prev.rr.render(prev.sc,prev.cam);
  f.shadowColor='#ffffff'; f.shadowBlur=22; f.drawImage(prev.c,0,0,400,380,-30,-10,700,665); f.shadowBlur=0; gm.forEach(o=>o.visible=true);
  // Blockfahne: ein durchgehendes rotes Tuch mit cremefarbenem Rahmen
  const gr=g.createLinearGradient(0,0,0,H); gr.addColorStop(0,'#b5121f'); gr.addColorStop(1,'#8c0d18'); g.fillStyle=gr; g.fillRect(0,0,W,H);
  g.globalAlpha=.07; for(let x=0;x<W;x+=128){ g.fillStyle=(x/128)%2?'#000':'#fff'; g.fillRect(x,0,128,H); } g.globalAlpha=1;
  g.strokeStyle='#e9d9b0'; g.lineWidth=14; g.strokeRect(10,10,W-20,H-20);
  // Figur des Führenden in der Mitte, auf das Tuch gemalt
  const fw=C.FL/C.MW*W, fh=C.FL/C.L*H, fx=W/2-fw/2+SH, fy=H-(C.s0/C.L)*H-fh; g.drawImage(C.fcv,fx,fy,fw,fh);
  // links der Name, rechts „DIE NUMMER 1 / IN DER PFALZ“ – beides mittig in der Höhe
  const fit=(txt,size,maxW)=>{ let z=size; g.font=`800 ${z}px "Barlow Condensed", "Arial Narrow", sans-serif`; while(g.measureText(txt).width>maxW && z>20){ z-=4; g.font=`800 ${z}px "Barlow Condensed", "Arial Narrow", sans-serif`; } return z; };
  const cy=H*.53, lx0=60, lx1=fx+fw*.12, rx0=fx+fw*.88, rx1=W-60+SH*1.3;
  g.fillStyle='#f6efe0'; g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,.35)'; g.shadowBlur=10;
  const nm=RIDERS[key].name.toUpperCase(); fit(nm,200,lx1-lx0); g.fillText(nm,(lx0+lx1)/2,cy);
  const lh=fit('IN DER PFALZ',125,rx1-rx0)*.98; g.fillText('DIE NUMMER 1',(rx0+rx1)/2,cy-lh/2); g.fillText('IN DER PFALZ',(rx0+rx1)/2,cy+lh/2); g.shadowBlur=0;
  C.tex.needsUpdate=true;
  if(!C.flag){ const ang=Math.atan2(22*ST_RH,22), geo=new THREE.PlaneGeometry(C.MW,C.L); geo.translate(0,C.L/2,0); // Tuch wächst von der untersten Reihe nach oben
    C.flag=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:C.tex,emissiveMap:C.tex,emissive:'#5a5a5a',side:THREE.DoubleSide}));
    C.flag.position.set(-ST.Xs,6.5+1.9,0); C.flag.rotation.y=Math.PI/2; C.flag.rotateX(-(Math.PI/2-ang)); C.flag.visible=false; world.add(C.flag); }
  C.t0=t; crowdSound(3,.18,700); }
function poseChoreo(A,t){ const C=A.choreo, k=t-C.t0, on=k>=0&&k<25; A.choreoOn=on; C.mos.visible=false; C.fig.visible=false;
  if(C.flag){ const f=k<4?clampN(k/4,0,1):k>21?clampN((24.5-k)/3.5,0,1):1; C.flag.visible=on&&f>.01; C.flag.scale.y=Math.max(.001,f); C.tex.repeat.y=f; C.tex.offset.y=1-f; } // Tuch wird über die Köpfe hochgezogen und nach ca. 22 s wieder eingerollt
  A.flags.forEach(F=>{ F.m.visible=!on; if(F.pole) F.pole.visible=!on; }); }
/* ---------- Spielablauf ---------- */
const clearSpots=M=>M.pl.forEach(p=>p.spot=null);
function kickBall(M,x1,z1,o){ const B=M.ball; B.owner=null; B.fly={x0:B.x,z0:B.z,x1,z1,k:0,dur:o.dur,h:o.h||0,y1:o.y1||0,then:o.then,to:o.to||null,save:o.save||null}; }
function matchKickoff(M,team){ const B=M.ball; Object.assign(B,{x:0,z:0,y:.11,owner:null,fly:null}); M.state='kick'; M.timer=5;
  M.pl.forEach(p=>{ p.spot=[p.bx,p.bz]; p.rl=p.rr=0; }); const d=team?-1:1, ks=M.pl.filter(p=>p.team===team&&p.idx>=9);
  ks[0].spot=[-.6*d,0]; ks[1].spot=[-1.2*d,3]; M.kicker=ks[0]; }
function matchGoal(M,team){ M.score[team]++; M.state='goal'; M.timer=7; M.goalTeam=team; M.ball.y=.11; const d=team?-1:1;
  M.cele=[52.5*d-8*d,(Math.random()<.5?-1:1)*26]; M.pl.forEach(p=>{ p.cele=[(Math.random()-.5)*4,(Math.random()-.5)*4]; p.spot=null; }); M.onGoal(team); }
function nearestP(M,team,x,z,f=()=>true){ let b=null,bd=1e9; for(const p of M.pl) if(p.team===team&&!p.gk&&f(p)){ const q=Math.hypot(p.x-x,p.z-z); if(q<bd){bd=q;b=p;} } return b; }
function matchPass(M,p){ const B=M.ball, R2=Math.random, mates=M.pl.filter(q=>q.team===p.team&&q!==p&&!q.gk); let best=null,bs=-1e9;
  for(const q of mates){ const dist=Math.hypot(q.x-p.x,q.z-p.z); if(dist<6||dist>38) continue; const s=(q.x-p.x)*p.d*.6-Math.abs(dist-16)*.3+R2()*12; if(s>bs){bs=s;best=q;} }
  if(!best) best=mates[Math.floor(R2()*mates.length)];
  let to=best; if(R2()<.18) to=nearestP(M,1-p.team,(p.x+best.x)/2,(p.z+best.z)/2)||best;
  const dist=Math.hypot(to.x-B.x,to.z-B.z); kickBall(M,to.x,to.z,{dur:dist/17+.15,h:dist>22?dist*.09:.1,to,then:()=>{ B.owner=to; M.hold=.8+R2()*1.8; }}); }
function matchShoot(M,p,o={}){ const B=M.ball, R2=Math.random, d=p.d, gx=52.5*d, kp=M.pl.find(q=>q.gk&&q.team!==p.team), r=R2(), dur=Math.hypot(gx-B.x,B.z)/(o.slow?18:26)+.2;
  M.state='dead';
  if(r<(o.pGoal??.17)) kickBall(M,gx+1.5*d,o.zGoal??(R2()-.5)*6,{dur,h:o.h??(.6+R2()),y1:.3+R2()*1.4,then:()=>matchGoal(M,p.team)});
  else if(r<.74) kickBall(M,gx-1.1*d,(R2()-.5)*5,{dur,h:o.h??.8,y1:.6,save:kp,then:()=>{ B.owner=kp; M.state='gk'; M.timer=2.5; clearSpots(M); }});
  else { const zs=R2()<.5?-1:1; kickBall(M,gx+3*d,zs*(4.5+R2()*5),{dur,h:1.5+R2()*2,then:()=>{ clearSpots(M); if(R2()<.55) matchCorner(M,p.team,zs); else matchGoalKick(M,1-p.team); }}); } }
function matchCorner(M,team,zs){ const B=M.ball, d=team?-1:1, gx=52.5*d, R2=Math.random; Object.assign(B,{x:gx-.4*d,z:zs*33.6,y:.11,owner:null,fly:null}); M.state='corner'; M.timer=4.5;
  const kick=nearestP(M,team,B.x,B.z); kick.spot=[B.x+.6*d,B.z+.6*zs]; M.cornerKicker=kick;
  const att=M.pl.filter(p=>p.team===team&&!p.gk&&p!==kick).sort((a,b)=>b.x*d-a.x*d).slice(0,6);
  att.forEach(p=>p.spot=[gx-d*(4+R2()*10),(R2()-.5)*18]); M.cornerTargets=att;
  M.pl.filter(p=>p.team!==team&&!p.gk).sort((a,b)=>a.x*d-b.x*d).reverse().slice(0,8).forEach((p,i)=>p.spot=i?[gx-d*(3+R2()*11),(R2()-.5)*18]:[gx-.5*d,zs*3.2]);
  M.pl.find(p=>p.gk&&p.team!==team).spot=[gx-.6*d,0]; }
function matchFreeKick(M,p){ const B=M.ball, d=p.d, gx=52.5*d, R2=Math.random; B.owner=null; M.state='fk'; M.timer=4.5;
  const ux=gx-B.x, uz=-B.z, ul=Math.hypot(ux,uz), u=[ux/ul,uz/ul], c=[B.x+u[0]*9.15,B.z+u[1]*9.15], v=[-u[1],u[0]];
  M.pl.filter(q=>q.team!==p.team&&!q.gk).sort((a,b)=>Math.hypot(a.x-c[0],a.z-c[1])-Math.hypot(b.x-c[0],b.z-c[1])).slice(0,4).forEach((q,k)=>q.spot=[c[0]+v[0]*(k-1.5)*.7,c[1]+v[1]*(k-1.5)*.7]);
  p.spot=[B.x-u[0]*1.6,B.z-u[1]*1.6]; M.fkTaker=p;
  M.pl.filter(q=>q.team===p.team&&!q.gk&&q!==p).sort((a,b)=>b.x*d-a.x*d).slice(0,3).forEach(q=>q.spot=[gx-d*(5+R2()*8),(R2()-.5)*14]);
  M.pl.find(q=>q.gk&&q.team!==p.team).spot=[gx-.6*d,clampN(B.z*.2,-2,2)]; }
function matchGoalKick(M,team){ const B=M.ball, d=team?-1:1, kp=M.pl.find(p=>p.gk&&p.team===team); Object.assign(B,{x:-47*d,z:(Math.random()-.5)*8,y:.11,fly:null,owner:null});
  kp.spot=[B.x-.6*d,B.z]; M.state='gk'; M.timer=3.5; M.gkKeeper=kp; }
function matchStep(M,dt){
  const B=M.ball, P=M.pl, R2=Math.random; M.t+=dt;
  if(B.fly){ const f=B.fly; f.k=Math.min(1,f.k+dt/f.dur); const k=f.k; B.x=f.x0+(f.x1-f.x0)*k; B.z=f.z0+(f.z1-f.z0)*k; B.y=.11+f.y1*k+f.h*4*k*(1-k); if(k>=1){ B.fly=null; f.then&&f.then(); } }
  else if(B.owner){ const o=B.owner; B.x=o.x+Math.cos(o.face)*.55; B.z=o.z+Math.sin(o.face)*.55; B.y=o.gk&&M.state==='gk'?1.1:.11; }
  if(dt>0){ M.timer-=dt;
    if(M.timer<=0){ const st=M.state; M.timer=1e9;
      if(st==='kick'){ clearSpots(M); B.owner=M.kicker; M.hold=.8; M.state='play'; }
      else if(st==='goal') matchKickoff(M,1-M.goalTeam);
      else if(st==='corner'){ M.state='dead'; const t=M.cornerTargets[Math.floor(R2()*M.cornerTargets.length)], att=M.cornerKicker.team, d=att?-1:1;
        kickBall(M,t.spot[0],t.spot[1],{dur:1.4,h:4,y1:1.6,then:()=>{ if(R2()<.18) kickBall(M,52.5*d+1.4*d,(R2()-.5)*5.6,{dur:.45,h:.3,y1:1.3,then:()=>matchGoal(M,att)});
          else { const df=P.filter(p=>p.team!==att&&!p.gk&&!p.spot), to=df.length?df[Math.floor(R2()*df.length)]:nearestP(M,1-att,0,0); kickBall(M,to.x,to.z,{dur:1.8,h:7,to,then:()=>{ clearSpots(M); B.owner=to; M.hold=1; M.state='play'; }}); } }}); }
      else if(st==='fk'){ const p=M.fkTaker; matchShoot(M,p,{pGoal:.22,h:3,slow:true,zGoal:(R2()<.5?-1:1)*(2.4+R2()*.9)}); const th=B.fly.then; B.fly.then=()=>{ clearSpots(M); th(); }; }
      else if(st==='gk'){ const kp=B.owner||M.gkKeeper; if(!B.owner){ B.owner=kp; } kp.spot=null; const mates=P.filter(p=>p.team===kp.team&&!p.gk), to=mates[Math.floor(R2()*mates.length)];
        B.x=kp.x+kp.d*.6; kickBall(M,to.x+to.d*4,to.z,{dur:2.2,h:10,to,then:()=>{ B.owner=to; M.hold=1; M.state='play'; clearSpots(M); }}); }
    }
  }
  // wer jagt den Ball
  const bt=B.fly?{x:B.fly.x1,z:B.fly.z1}:{x:B.x,z:B.z}, chaser=[null,null];
  if(M.state==='play') for(const team of [0,1]){ if(B.owner&&B.owner.team===team) continue; chaser[team]=nearestP(M,team,bt.x,bt.z,p=>!p.spot&&!(B.fly&&B.fly.to===p)); }
  const atk=B.owner?B.owner.team:(B.fly&&B.fly.to?B.fly.to.team:-1);
  for(const p of P){ let tx,tz,sp=3.4;
    if(M.state==='goal'&&p.team===M.goalTeam){ tx=M.cele[0]+p.cele[0]; tz=M.cele[1]+p.cele[1]; sp=7; }
    else if(p.spot){ [tx,tz]=p.spot; sp=4.5; }
    else if(p.gk){ const gx=-52.5*p.d; if(B.fly&&B.fly.save===p){ tx=B.fly.x1; tz=B.fly.z1; sp=8; } else if(B.owner===p){ tx=p.x; tz=p.z; } else { tx=gx+1.4*p.d; tz=clampN(B.z*.15,-3,3); sp=3; } }
    else if(p===B.owner){ tx=clampN(p.x+p.d*8,-50,50); tz=clampN(p.z*.9+Math.sin(M.t*.7+p.bz)*3,-31,31); sp=4.6; }
    else if(B.fly&&B.fly.to===p){ tx=B.fly.x1; tz=B.fly.z1; sp=6; }
    else if(p===chaser[p.team]){ tx=bt.x; tz=bt.z; sp=6.3; }
    else { tx=p.bx+B.x*.65+(atk===p.team?p.d*13:-p.d*2); tz=p.bz*.85+B.z*.25; if(M.state==='goal') sp=1.6; }
    tx=clampN(tx,-55,55); tz=clampN(tz,-34.4,34.4);
    const dx=tx-p.x, dz=tz-p.z, dist=Math.hypot(dx,dz);
    if(dist>.08&&dt>0){ const st=Math.min(dist,sp*dt); p.x+=dx/dist*st; p.z+=dz/dist*st; p.speed=st/dt; p.face+=angDiff(Math.atan2(dz,dx),p.face)*Math.min(1,dt*7); }
    else { p.speed=0; p.face+=angDiff(Math.atan2(B.z-p.z,B.x-p.x),p.face)*Math.min(1,dt*3); }
    p.rl=p.rr=(M.state==='goal'&&p.team===M.goalTeam)||(B.fly&&B.fly.save===p)?1:0;
    p.g.position.set(p.x,0,p.z); p.g.rotation.y=-p.face; animPerson(p,dt); }
  // Zweikampf, Ballverlust, Entscheidung des Ballführenden
  if(M.state==='play'&&!B.fly){
    if(!B.owner){ for(const p of P){ if(!p.gk&&Math.hypot(p.x-B.x,p.z-B.z)<.8){ B.owner=p; M.hold=.6+R2()*1.5; break; } } }
    else if(!B.owner.gk){ const p=B.owner, c=chaser[1-p.team]; M.hold-=dt;
      if(c&&Math.hypot(c.x-p.x,c.z-p.z)<1.1&&R2()<dt*.7){ B.owner=c; M.hold=.8+R2(); }
      else if(M.hold<=0){ const dg=Math.hypot(52.5*p.d-p.x,p.z);
        if(dg<29&&Math.abs(p.z)<20&&R2()<.75) matchShoot(M,p);
        else if(dg<33&&dg>17&&R2()<.14) matchFreeKick(M,p);
        else matchPass(M,p); } } }
  // Schiedsrichter
  { const r=M.ref, tx=clampN(B.x*.85-6,-48,48), tz=clampN(B.z*.5+12,-30,30), dx=tx-r.x, dz=tz-r.z, dist=Math.hypot(dx,dz);
    if(dist>.3&&dt>0){ const st=Math.min(dist,4.5*dt); r.x+=dx/dist*st; r.z+=dz/dist*st; r.speed=st/dt; r.face+=angDiff(Math.atan2(dz,dx),r.face)*Math.min(1,dt*5); } else { r.speed=0; r.face+=angDiff(Math.atan2(B.z-r.z,B.x-r.x),r.face)*Math.min(1,dt*3); }
    r.g.position.set(r.x,0,r.z); r.g.rotation.y=-r.face; animPerson(r,dt); }
  B.mesh.position.set(B.x,B.y,B.z); if(dt>0) B.mesh.rotation.z-=dt*(B.owner?B.owner.speed:B.fly?8:0)/.11;
}

/* ---------- Ereignisse fürs Publikum: Führungswechsel, letzte Runde ---------- */
function stadiumEvents(A,t){ const run=race.state==='run'&&!race.frozen;
  A.clap=run&&race.mode==='loop'&&!me.done&&Math.floor(me.d/R.len)===race.laps-1;
  if(!run) A.bellRung=false;
  else if(race.mode==='loop'&&!A.bellRung&&race.t>.5){ const ld=Math.max(me.d,opp.active?opp.d:0); if(Math.floor(ld/R.len)===race.laps-1){ A.bellRung=true; A.bell.t0=t; startChoreo(A,opp.active&&opp.d>me.d?oppKey:myKey,t); if(opp.active&&opp.d>me.d) [0,250,500].forEach(x=>setTimeout(()=>beep(1320,.12),x)); } }
  if(!run||!opp.active){ A.lead=0; return; }
  const g=me.d-opp.d, L=g>.6?1:g<-.6?-1:(A.lead||0);
  if(A.lead&&L!==A.lead&&race.t>4&&!me.done&&!opp.done&&!race.paused){ A.excite=t; crowdSound(1.8,.12,450); }
  A.lead=L; }
const fmtLap=s=>`${Math.floor(s/60)}:${(s%60).toFixed(1).padStart(4,'0').replace('.',',')}`;
function sbLap(A){ const S=A.sb; if(race.state!=='run'){ S.lap=0; S.t0=0; S.last=null; S.prevT=0; return; }
  if(race.t<S.prevT-.5){ S.lap=0; S.t0=0; S.last=null; } S.prevT=race.t;
  const lap=Math.floor(me.d/R.len+1e-6); if(lap>S.lap){ S.last=(me.done&&race.mode!=='train'?me.time:race.t)-S.t0; S.t0=race.t; S.lap=lap; } }
function drawBoard(A){ const S=A.sb, g=S.g, W=1024, H=360, F=s=>`800 ${s}px "Barlow Condensed", Arial Narrow, sans-serif`;
  g.fillStyle='#050608'; g.fillRect(0,0,W,H); g.fillStyle='#b3121f'; g.fillRect(0,0,W,64);
  g.font=F(44); g.textBaseline='middle'; g.fillStyle='#fff'; g.textAlign='left'; g.fillText('KALMIT-DUELL · BETZENBERG',22,34);
  g.textAlign='right'; g.fillText(race.state==='run'?fmtT(race.t):'--:--',W-22,34);
  const line=(y,l,r,c='#ffd66b',s=52)=>{ g.font=F(s); g.fillStyle=c; g.textAlign='left'; g.fillText(l,30,y); if(r){ g.textAlign='right'; g.fillText(r,W-30,y); } };
  const mk=RIDERS[myKey].name.toUpperCase(), on=String(opp.name).toUpperCase();
  if(A.replay&&race.state!=='setup'&&Math.floor(((A.lastT||0)-A.replay.t0)/6)%2===0){ const ih=232, iw=ih*A.replay.c.width/A.replay.c.height, ix=W-30-iw;
    g.drawImage(A.replay.c,ix,70,iw,ih); g.strokeStyle='#ffd66b'; g.lineWidth=3; g.strokeRect(ix,70,iw,ih);
    line(130,'WIEDERHOLUNG','','#fff',54); line(190,'ZIELEINFAHRT','','#ffd66b',46); g.fillStyle='#e3262b'; g.beginPath(); g.arc(44,250,10,0,7); g.fill(); g.font=F(34); g.fillStyle='#fff'; g.textAlign='left'; g.fillText('TV-KAMERA',62,252); }
  else if(race.state==='setup') line(170,'WILLKOMMEN IM STADION','','#fff',66);
  else if(race.state==='count') line(170,'GLEICH GEHT ES LOS','','#fff',66);
  else if(race.mode==='train'){ line(112,'TRAINING','RUNDE '+(S.lap+1),'#fff',50); line(184,'ZEIT '+fmtT(race.t),S.last?'LETZTE RUNDE '+fmtLap(S.last):''); line(250,mk,Math.round(curPower())+' W'); }
  else if(race.mode==='chase'){ const C=race.chase||{}, gap=me.d-opp.d;
    line(112,'VERFOLGUNG',C.dur?'NOCH '+fmtT(Math.max(0,C.dur-race.t)):'RUNDE '+(Math.floor(me.d/R.len)+1),'#fff',50);
    line(184,mk,me.done&&C.caught?'ERWISCHT':C.started?'+'+Math.round(Math.max(0,gap))+' M':'ZEIT '+fmtT(race.t));
    line(250,'TEUFEL',C.started?de(C.lvl||C.wkg,1)+' W/KG':'STARTET IN '+Math.max(0,Math.ceil(C.delay-race.t))+' S','#ff6b6b'); }
  else { const rows=[{n:mk,d:me.d,done:me.done,t:me.time,v:me.v}]; if(opp.active) rows.push({n:on,d:opp.d,done:opp.done,t:opp.time,v:opp.v});
    rows.sort((a,b)=>(a.done&&b.done)?a.t-b.t:a.done?-1:b.done?1:b.d-a.d);
    line(112,rows.every(r=>r.done)?'ERGEBNIS':me.done?'IM ZIEL':`RUNDE ${Math.min(race.laps,Math.floor(me.d/R.len)+1)} / ${race.laps}`,S.last?'LETZTE RUNDE '+fmtLap(S.last):'','#fff',50);
    const L0=rows[0]; rows.forEach((r,i)=>{ const right=r.done?(i&&L0.done?'+'+de(r.t-L0.t,1)+' s':fmtT(r.t)):i===0?'FÜHRT':L0.done?'UNTERWEGS':'+'+de((L0.d-r.d)/Math.max(1,r.v),1)+' s';
      line(186+i*62,`${i+1}   ${r.n}`,right); }); }
  g.fillStyle='#14171c'; g.fillRect(0,H-56,W,56); g.font=F(36); g.fillStyle='#e8ecef'; g.textAlign='center'; g.fillText(`FUSSBALL · HEIM ${A.match.score[0]} : ${A.match.score[1]} GAST`,W/2,H-27);
  g.fillStyle='rgba(0,0,0,.35)'; for(let y=0;y<H;y+=4) g.fillRect(0,y,W,1); for(let x=0;x<W;x+=4) g.fillRect(x,0,1,H);
  S.tex.needsUpdate=true; }
function poseStadiumExtras(A,t){ if(!A.match) return;
  const dt=A.lastT==null?0:clampN(t-A.lastT,0,.1); A.lastT=t; const mdt=race.paused?0:dt;
  matchStep(A.match,mdt);
  A.cflags.forEach(F=>F.g.rotation.y=.7+Math.sin(t*1.8+F.ph)*.35);
  A.statics.forEach(P=>{ if(P.gest) P.rr=Math.pow(Math.max(0,Math.sin(t*.6+P.ph)),6); P.speed=0; animPerson(P,mdt); });
  const mr=riders3d[myKey];
  if(race.state!=='setup'&&mr) A.dollies.forEach(D=>{ const rp=mr.g.position, tx=clampN(rp.x,-40,40), dx=tx-D.x; D.x+=Math.sign(dx)*Math.min(Math.abs(dx),12*mdt); D.g.position.x=D.x; D.g.updateMatrixWorld(); D.head.lookAt(rp.x,rp.y+1,rp.z); });
  stadiumEvents(A,t);
  const C=A.confetti; if(C.t0!=null){ const T=t-C.t0, pa=C.pts.geometry.attributes.position.array; let any=false;
    C.info.forEach((o,i)=>{ const k=T-o.off; let x=0,y=-100,z=0; if(k>0&&k<16){ y=o.y0-k+(o.vy+1)/3*(1-Math.exp(-3*k)); x=o.x0+o.vx*.5*k+Math.sin(k*2.6+o.ph)*.35; z=o.z0+Math.cos(k*2.1+o.ph)*.35;
        const row=-ST.Xs-.6-x, floor=row>0?6.5+Math.min(21,row)*ST_RH:0; if(y<floor) y=-100; else any=true; }
      pa[i*3]=x; pa[i*3+1]=y; pa[i*3+2]=z; });
    C.pts.geometry.attributes.position.needsUpdate=true; C.pts.visible=any||T<6; }
  poseChoreo(A,t);
  { const B=A.bell, k=t-B.t0, ring=k>=0&&k<5; B.P.rr=ring?.55+.25*Math.sin(k*18):.05; B.bell.rotation.z=ring?Math.sin(k*18)*.6:0; B.P.speed=0; animPerson(B.P,mdt); }
  { const nk=RIDERS[myKey].name+'|'+RIDERS[oppKey].name; if(nk!==A.banNames){ A.banNames=nk; A.banTex.forEach(x=>x.dispose()); A.banTex=banTexs(); A.banK=-1; } }
  { const k=Math.floor(t/20); if(k!==A.banK){ A.banK=k; A.banners.forEach((m,i)=>{ m.material.map=m.material.emissiveMap=A.banTex[(k*3+i)%A.banTex.length]; m.material.needsUpdate=true; }); } }
  { const op=A.fl.shOp||0; for(const r of [...RKEYS,'devil'].map(k=>riders3d[k])){ if(!r||!r.flsh) continue; const p=r.g.position, hd=-r.g.rotation.y;
      r.flsh.forEach((sh,i)=>{ sh.m.visible=op>0; if(!op) return; const L=A.fl.heads[i], dx=p.x-L.x, dz=p.z-L.z, len=clampN(1.75*Math.hypot(dx,dz)/Math.max(1,L.y-p.y),1.2,6);
        sh.piv.rotation.y=-(Math.atan2(dz,dx)-hd); sh.m.position.x=len/2; sh.m.scale.set(len,.75,1); sh.m.material.opacity=op; }); } }
  if(A.rain.m.visible){ const pa=A.rain.m.geometry.attributes.position.array, c=camera.position;
    A.rain.info.forEach((o,i)=>{ o[1]-=13*mdt; if(o[1]<-8) o[1]+=30; const x=c.x+o[0]+o[1]*.06, y=c.y+o[1], z=c.z+o[2]; pa[i*6]=x; pa[i*6+1]=y; pa[i*6+2]=z; pa[i*6+3]=x+.04; pa[i*6+4]=y+.6; pa[i*6+5]=z; });
    A.rain.m.geometry.attributes.position.needsUpdate=true; }
  sbLap(A); A.sb.acc+=dt; if(A.sb.acc>.25){ A.sb.acc=0; drawBoard(A); }
}

