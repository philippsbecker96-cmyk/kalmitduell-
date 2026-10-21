/* ================= Erlenbach: Dorfleben in den Lücken zwischen den Häusern (Burg Berwartstein) =================
   Ortseingang im Vorlauf, Misthaufen, Schweinekoben, Heuwagen, Brunnen, Hahnenkäfige, Holzlege, Gemüsegarten mit Bienen, Waschplatz, Pranger, Wahrsagerin,
   Müllhaufen, Gänse, Bildstock, Ochsenkarren, Ziegen, Dorfweiher, Galgen in der Ferne – dazu Kleinkram: Fässer, Körbe, Eimer, Handkarren, Katzen, Wäsche, Pfützen, Stroh.
   prepDorf aus prepBurg (Plätze freiräumen) · buildDorf(K) aus buildBurg (K = dessen Baukasten) · poseDorf aus poseBurg */
// Plätze [Seite, von m, bis m, Tiefe m neben dem Gehweg]: dort keine Bäume, Büsche, Zäune
const DORF_PLATZ=[[1,0,20,22],[-1,0,20,22],[-1,72,98,10],[-1,108,113,8],[-1,139,147,6],[-1,166,180,6],[-1,204,222,7],[-1,253,286,13],[-1,302,318,9],[-1,352,362,6],
  [1,35,64,9],[1,77,83,6],[1,120,146,10],[1,252,258,4],[1,280,296,8],[1,305,318,10],[1,379,405,15],[1,374,386,58]];
function prepDorf(r,fr,rw){ const S=r.S, pp=[]; for(const [s,a,b,t] of DORF_PLATZ) for(let d=a; d<=b; d+=3) for(let u=1; u<=t; u+=3){ const f=fr(d), o=rw(d)+(zOpt(r,d).geh??SIDEWALK)+u; pp.push([f.px+f.nx*s*o, f.py+f.ny*s*o]); }
  const weg=o=>pp.some(([x,y])=>Math.abs(o.x-x)<2.8&&Math.abs(o.y-y)<2.8&&Math.hypot(o.x-x,o.y-y)<2.8); for(const k of ['tree','rock','bush','block','konif','zaun','grass']) S[k]=S[k].filter(o=>!weg(o)); }

function buildDorf(K){ const {mensch,HUT,box,M,holz,holzD,dach,sand,bretter,inst,fr,rw,A,ps,qq,sc,cc,up}=K, q=rng(4711), D=A.dorf={tiere:[], leute:[], tuecher:[], katzen:[], bienen:[], gaense:[], enten:[], dampf:[]};
  const at=(s,d,u)=>{ const f=fr(d), o=rw(d)+(zOpt(R,d).geh??SIDEWALK)+u, x=f.px+f.nx*s*o, z=f.py+f.ny*s*o; return {x, y:u<.6?roadY(d)+.15:terrainAt(x,z), z, h:f.h, s, d}; }; // u: Meter neben dem Gehweg
  const grp=p=>{ const G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=Math.atan2(-Math.sin(p.h)*-p.s, Math.cos(p.h)*-p.s); world.add(G); return G; }; // lokal: +z zur Straße
  const zuG=(G,m)=>{ G.add(m.G); return m; }, mesh=(P,geo,mat,x,y,z)=>{ const o=new THREE.Mesh(geo,mat); o.position.set(x,y,z); P.add(o); return o; }, kugel=(P,r,c,x,y,z,sx=1,sy=1,sz=1)=>{ const o=mesh(P,new THREE.SphereGeometry(r,8,6),typeof c==='string'?M(c):c,x,y,z); o.scale.set(sx,sy,sz); return o; };
  const geflecht=(c,quer)=>{ const t=canvasTex(64,64,g=>{ g.fillStyle=c; for(let i=0;i<64;i+=8){ g.fillRect(i,0,4,64); if(quer) g.fillRect(0,i+2,64,3); } }); t.wrapS=t.wrapT=THREE.RepeatWrapping; return new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.4,side:THREE.DoubleSide}); };
  const stroh=M('#d8c070'), erde=M('#5a4128'), hufe=M('#2a2420'), wasser=new THREE.MeshPhongMaterial({color:'#6d8f93',shininess:80}), korbM=geflecht('#a8844a',true);
  // Tiere: Rumpf, vier Beine, Kopf vorn (lokal +x)
  const vier=(P,c,L,H,o={})=>{ const T=new THREE.Group(); P.add(T); const m=M(c); kugel(T,1,m,0,H*.62,0,L/2,H*.3,H*.27);
    for(const [x,z] of [[.3,1],[.3,-1],[-.3,1],[-.3,-1]]){ const l=cyl(H*.065,m); place(l,[x*L,H*.6,z*H*.15],[x*L,0,z*H*.15]); T.add(l); if(o.huf) box(T,H*.14,H*.08,H*.14,hufe,x*L,H*.04,z*H*.15); }
    const k=new THREE.Group(); k.position.set(L*.48,H*(o.kh??.75),0); T.add(k); kugel(k,H*.2,o.kopf||m,H*.14,0,0,1.35,1,.95); return {T,k,m}; };
  const schwein=(P,x,z,ry)=>{ const S=vier(P,'#e8a8a0',1.1,.62); S.T.position.set(x,0,z); S.T.rotation.y=ry; S.k.position.y=.42; const sn=cyl(.07,M('#d98a84')); place(sn,[.3,0,0],[.4,-.03,0]); S.k.add(sn);
    for(const zz of [-.08,.08]){ const o=new THREE.Mesh(new THREE.ConeGeometry(.06,.12,4),S.m); o.position.set(.1,.12,zz); o.rotation.z=-.6; S.k.add(o); }
    const sw=new THREE.Mesh(new THREE.TorusGeometry(.06,.015,4,10,4.5),S.m); sw.position.set(-.56,.45,0); S.T.add(sw); D.tiere.push({T:S.T,k:S.k,art:'schwein',ph:x*3+z}); return S; };
  const huhn=(P,x,y,z,ry,c)=>{ const T=new THREE.Group(); T.position.set(x,y,z); T.rotation.y=ry; P.add(T); kugel(T,.13,c,0,.17,0,1.3,1,.9); const st=new THREE.Mesh(new THREE.ConeGeometry(.08,.16,5),M(c)); st.position.set(-.15,.25,0); st.rotation.z=.7; T.add(st);
    const k=new THREE.Group(); k.position.set(.14,.28,0); T.add(k); kugel(k,.06,c,0,0,0); box(k,.02,.05,.015,M('#d22a1a'),0,.06,0); box(k,.05,.015,.015,M('#e0a020'),.07,-.01,0);
    for(const zz of [-.04,.04]) box(T,.015,.1,.015,M('#e0a020'),0,.05,zz); D.tiere.push({T,k,art:'huhn',ph:q()*6}); return T; };
  const gans=(P,x,z,c,s=1)=>{ const T=new THREE.Group(); T.position.set(x,0,z); T.scale.setScalar(s); P.add(T); kugel(T,.2,c,0,.26,0,1.4,.85,.9); const h=cyl(.045,M(c)); place(h,[.2,.3,0],[.28,.6,0]); T.add(h);
    const k=new THREE.Group(); k.position.set(.29,.62,0); T.add(k); kugel(k,.07,c,0,0,0); box(k,.12,.035,.04,M('#e88a2a'),.09,-.01,0); for(const zz of [-.06,.06]) box(T,.02,.14,.02,M('#e88a2a'),0,.07,zz); return {T,k}; };
  const katze=(P,c)=>{ const T=new THREE.Group(); P.add(T); const m=M(c); kugel(T,.13,m,0,.13,0,1,1.15,.85); const k=new THREE.Group(); k.position.y=.33; T.add(k); kugel(k,.09,m,0,0,0);
    for(const x of [-.05,.05]){ const o=new THREE.Mesh(new THREE.ConeGeometry(.03,.07,4),m); o.position.set(x,.08,0); k.add(o); kugel(k,.015,'#d8e04a',x*.8,.01,.08); }
    const sw=new THREE.Group(); sw.position.set(0,.05,-.1); T.add(sw); const sl=cyl(.018,m); place(sl,[0,0,0],[0,.02,-.28]); sw.add(sl); D.katzen.push({k,sw,ph:q()*6}); return T; };
  const fass=(P,x,y,z,s=1)=>{ const f=mesh(P,new THREE.CylinderGeometry(.3*s,.27*s,.75*s,10),holz,x,y+.375*s,z); for(const yy of [.15,.6]) mesh(P,new THREE.TorusGeometry(.29*s,.02,4,12),M('#2e2c2a'),x,y+yy*s,z).rotation.x=Math.PI/2; return f; };
  const korb=(P,x,y,z,inhalt)=>{ mesh(P,new THREE.CylinderGeometry(.25,.2,.32,10,1,true),korbM,x,y+.16,z); mesh(P,new THREE.CylinderGeometry(.2,.2,.02,10),M('#7a5a32'),x,y+.01,z); if(inhalt) kugel(P,.2,inhalt,x,y+.28,z,1,.4,1); };
  const eimer=(P,x,y,z)=>{ mesh(P,new THREE.CylinderGeometry(.14,.11,.28,8,1,true),new THREE.MeshLambertMaterial({color:'#7a5a3a',side:THREE.DoubleSide}),x,y+.14,z); mesh(P,new THREE.CylinderGeometry(.13,.13,.02,8),wasser,x,y+.22,z); };
  const handkarren=(P,x,z,ry)=>{ const G=new THREE.Group(); G.position.set(x,0,z); G.rotation.y=ry; P.add(G); box(G,1.3,.08,.8,bretter,0,.45,0); for(const zz of [-.4,.4]) box(G,1.3,.25,.04,bretter,0,.6,zz);
    const r2=mesh(G,new THREE.TorusGeometry(.32,.04,4,14),holzD,.25,.32,.46); for(let i=0;i<6;i++){ const sp=box(G,.03,.3,.03,holz,.25,.32,.46); sp.rotation.z=i/6*Math.PI; } for(const zz of [-.3,.3]){ const h=cyl(.03,holz); place(h,[-.6,.48,zz],[-1.4,.75,zz]); G.add(h); }
    box(G,.08,.42,.08,holzD,.5,.21,-.3); return G; };
  const strohhaufen=(P,x,y,z,s=1)=>{ kugel(P,1,stroh,x,y+.25*s,z,1.1*s,.5*s,.9*s); for(let i=0;i<6;i++){ const h=box(P,.4*s,.02,.02,M('#c9ad5a'),x+(q()-.5)*s,y+.3*s+q()*.2*s,z+(q()-.5)*s); h.rotation.set(q()*3,q()*3,q()*3); } };
  const pfahl=(P,x,y,z,h,r=.06)=>{ const p=cyl(r,holzD); place(p,[x,y,z],[x,y+h,z]); P.add(p); return p; };
  const blase=(txt,p,hy,w=6.2)=>{ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex(txt),transparent:true,depthWrite:false})); sp.scale.set(w,w*.31,1); sp.position.set(p.x,p.y+hy,p.z); sp.visible=false; world.add(sp); return sp; };
  const puff=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,30); gr.addColorStop(0,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });

  // ---------- Ortseingang im Vorlauf: Ortstafel, Wegkreuz, Heuhaufen am Feldrand ----------
  { const p=at(1,14,1), tx=Math.cos(p.h), tz=Math.sin(p.h), G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=Math.atan2(-tx,-tz); world.add(G); // lokal: +z zu den Ankommenden, x quer zur Straße
    const t=frakturTex(256,96,g=>{ g.fillStyle='#e9dcbc'; g.fillRect(0,0,256,96); g.strokeStyle='#5a3a26'; g.lineWidth=8; g.strokeRect(4,4,248,88); g.fillStyle='#2a1a10'; g.textAlign='center'; g.textBaseline='middle'; g.font='54px '+FRAKTUR; g.fillText('Erlenbach',128,52,230); });
    for(const x of [-.85,.85]) box(G,.13,2.35,.13,holzD,x,1.17,0); box(G,1.9,.08,.08,holz,0,1.12,0); box(G,1.84,.72,.06,holzD,0,1.56,-.02); // Pfosten unter den Enden, Querlatte, Rahmen
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.72,.62),new THREE.MeshLambertMaterial({map:t})); sg.position.set(0,1.56,.02); G.add(sg); const hi=sg.clone(); hi.rotation.y=Math.PI; hi.position.z=-.06; G.add(hi);
    for(const z of [-1,1]){ const d2=box(G,2.15,.05,.36,dach,0,2.06,z*.13); d2.rotation.x=z*.6; } } // Schindeldächlein
  { const p=at(-1,7,2), G=grp(p); box(G,.7,.5,.7,sand,0,.25,0); box(G,.14,2.6,.14,holzD,0,1.8,0); box(G,1.1,.14,.14,holzD,0,2.5,0); const d2=box(G,.5,.05,.4,dach,0,3.15,0); d2.rotation.z=.5; const d3=box(G,.5,.05,.4,dach,0,3.15,0); d3.rotation.z=-.5; d2.position.x=-.18; d3.position.x=.18;
    for(let i=0;i<5;i++) kugel(G,.08,['#d22a1a','#e8d23a','#f2ece0','#c94aa0','#2f6b9a'][i],(i-2)*.13,.55,.3); } // Wegkreuz mit Dächlein und Blumen
  for(const [s,d,u] of [[1,4,9],[1,12,15],[-1,5,13],[-1,15,8],[1,18,6],[-1,10,19]]){ const p=at(s,d,u); kugel(world,1.1,stroh,p.x,p.y+.9,p.z,1,1.15,1); pfahl(world,p.x,p.y,p.z,2.6,.04); mesh(world,new THREE.ConeGeometry(.9,.8,9),stroh,p.x,p.y+1.95,p.z); } // Heuhaufen um Stangen

  // ---------- links 72–98 m: dampfender Misthaufen mit Hühnern und Mistgabel, Schweinekoben mit zwei Säuen im Schlamm ----------
  { const p=at(-1,78,3), G=grp(p); kugel(G,1,M('#4e3a24'),0,.35,0,2.2,.8,1.6); kugel(G,1,M('#6b5230'),.4,.75,-.2,1.2,.45,.9); for(let i=0;i<9;i++) box(G,.5,.02,.03,M('#b8a050'),(q()-.5)*3,.6+q()*.5,(q()-.5)*2).rotation.set(q()*3,q()*3,q()*3);
    const gb=new THREE.Group(); gb.position.set(-.9,.9,.3); gb.rotation.z=.35; G.add(gb); const st=cyl(.03,holz); place(st,[0,-.3,0],[0,1.4,0]); gb.add(st); for(const z of [-.08,0,.08]) box(gb,.015,.35,.015,M('#5f6266'),0,-.45,z); // Mistgabel
    huhn(G,.3,1.05,0,1,'#f2ece0'); huhn(G,-.6,.75,-.5,2.5,'#9a5a2a'); huhn(G,1.3,.35,.8,-1,'#c9733a');
    const wp=new THREE.Vector3(); G.updateMatrixWorld(); for(let i=0;i<4;i++){ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:puff,transparent:true,depthWrite:false,opacity:.4})); world.add(sp); wp.set((q()-.5)*1.4,.9,(q()-.5)*.8).applyMatrix4(G.matrixWorld); D.dampf.push({sp,x:wp.x,y:wp.y,z:wp.z,ph:i/4}); } } // Dampf
  { const p=at(-1,91,3.5), G=grp(p); box(G,4,.04,3,M('#4a3524'),0,.03,0); for(const [x,z,w,dd] of [[0,1.5,4,.06],[0,-1.5,4,.06],[2,0,.06,3],[-2,0,.06,3]]) for(const y of [.25,.6,.95]) box(G,w,.22,dd||.06,bretter,x,y,z); // Bretterwand
    for(const [x,z] of [[2,1.5],[-2,1.5],[2,-1.5],[-2,-1.5],[0,1.5]]) box(G,.12,1.15,.12,holzD,x,.57,z); box(G,1.2,.25,.35,holzD,-1.2,.13,-1.1); // Pfosten, Trog
    kugel(G,.6,M('#3a2a1c'),.4,.04,.2,2,.08,1.4); schwein(G,.6,.3,.4); schwein(G,-.5,-.4,2.6); strohhaufen(G,-1.3,0,.9,.6); strohhaufen(G,3,0,-1,.8); }

  // ---------- links 108–113 m: alter Heuwagen mit gebrochenem Rad, Kinder klettern drauf ----------
  { const p=at(-1,110.5,3.5), G=grp(p), W=new THREE.Group(); W.rotation.z=-.13; W.position.y=.1; G.add(W); box(W,3.2,.12,1.6,bretter,0,.95,0); for(const z of [-.78,.78]) box(W,3.2,.4,.06,bretter,0,1.2,z);
    const rad=(P,x,y,z,rx,rz)=>{ const R2=new THREE.Group(); R2.position.set(x,y,z); R2.rotation.set(rx,0,rz); P.add(R2); mesh(R2,new THREE.TorusGeometry(.55,.05,5,18),holzD,0,0,0); for(let i=0;i<8;i++){ const sp=box(R2,.04,.52,.04,holz,Math.cos(i/8*6.28)*.26,Math.sin(i/8*6.28)*.26,0); sp.rotation.z=i/8*6.28-Math.PI/2; } };
    rad(W,1,.55,.9,0,0); rad(W,1,.55,-.9,0,0); rad(W,-1,.55,-.9,0,0); rad(G,-1.6,.06,1.6,Math.PI/2,0); // linkes Hinterrad liegt im Gras
    for(const [x,y,sx,sy,sz] of [[0,1.5,1.6,.5,.85],[-.4,1.95,1,.4,.65],[.5,1.85,.8,.35,.6]]) kugel(W,1,stroh,x,y,0,sx,sy,sz); const de=cyl(.05,holz); place(de,[1.6,1,0],[3.2,.15,0]); W.add(de); // Heu, Deichsel am Boden
    for(const [x,y,z,k,ph] of [[-.3,2.2,0,'#c94a2a',0],[.9,1.25,.95,'#3f6b8a',2]]){ const m=zuG(G,mensch({x,y,z},{x,z:5},k,'#5b4a36',()=>{},{})); m.G.scale.setScalar(.6); D.leute.push({m,art:'winkkind',ph}); } strohhaufen(G,-2.4,0,-.6,.7); }

  // ---------- links 139–147 m: Brunnentrog aus Sandstein mit Pumpe, Magd pumpt Wasser ----------
  { const p=at(-1,143,2.2), G=grp(p); box(G,2.2,.65,.9,sand,0,.33,0); mesh(G,new THREE.BoxGeometry(2,.04,.7),wasser,0,.6,0); box(G,.35,1.5,.35,sand,-.8,.75,-.65); const sp=cyl(.04,M('#5f6266')); place(sp,[-.8,1.2,-.48],[-.8,1.15,-.15]); G.add(sp);
    const hb=new THREE.Group(); hb.position.set(-.8,1.5,-.65); G.add(hb); const hg=cyl(.035,M('#3a3a3e')); place(hg,[0,0,0],[.9,0,0]); hb.add(hg); // Schwengel
    const str=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,.5,6),new THREE.MeshPhongMaterial({color:'#9fc3d0',transparent:true,opacity:.7})); str.position.set(-.8,.9,-.15); G.add(str);
    const m=zuG(G,mensch({x:.3,y:0,z:-1.1},{x:-.8,z:-.65},'#3f6b4a','#3a2a1c',HUT.tuch,{lang:1})); eimer(G,-.3,0,-.2); eimer(G,1.4,0,.6); D.leute.push({m,art:'pumpe',hb,str}); }

  // ---------- links 166–180 m: Hahnenkäfige aus Weiden auf einem Brett, ein Hahn kräht, der Händler preist an ----------
  { const p=at(-1,172,2), G=grp(p); for(const x of [-1.4,1.4]) for(const z of [-.25,.25]){ const b=box(G,.06,.75,.06,holzD,x,.36,z); b.rotation.x=z*.6; } box(G,3.4,.06,.8,bretter,0,.75,0);
    const kaefig=geflecht('#8a6a3a',false); [-1,0,1].forEach((x,i)=>{ const k=mesh(G,new THREE.SphereGeometry(.42,12,8,0,Math.PI*2,0,Math.PI/2),kaefig,x*1.05,.78,0); k.scale.y=1.2; mesh(G,new THREE.CircleGeometry(.42,12),M('#7a5a32'),x*1.05,.79,0).rotation.x=-Math.PI/2;
      const h=huhn(G,x*1.05,.78,0,1.5+i*.6,['#c9733a','#2e2a24','#f2ece0'][i]); h.scale.setScalar(1.3); D.tiere[D.tiere.length-1].kraeht=i===0; });
    for(let i=0;i<5;i++) box(G,.12,.01,.03,M(['#c9733a','#f2ece0'][i%2]),(q()-.5)*3,.01,.7+q()*.6).rotation.y=q()*3; // Federn
    const m=zuG(G,mensch({x:.3,y:0,z:-1.2},{x:0,z:3},'#7a5a3a','#3a3020',HUT.stroh,{})); D.leute.push({m,art:'haendler',ph:1}); korb(G,2.1,0,.3,'#e8dcc0'); }

  // ---------- links 204–222 m: Holzlege mit Pultdach, Hackklotz, Holzhacker – die Späne fliegen ----------
  { const p=at(-1,212,2.6), G=grp(p), ende=canvasTex(128,64,g=>{ g.fillStyle='#4e3626'; g.fillRect(0,0,128,64); for(let y=6;y<64;y+=12) for(let x=6+(y/12%2)*6;x<128;x+=12){ g.fillStyle=['#c9a06a','#b88a56','#d8b47a'][(x+y)%3]; g.beginPath(); g.arc(x,y,5.5,0,7); g.fill(); g.strokeStyle='#8a6440'; g.lineWidth=1; g.beginPath(); g.arc(x,y,2.5,0,7); g.stroke(); } });
    const holzE=new THREE.MeshLambertMaterial({map:ende}); box(G,6,.1,2.4,bretter,0,.05,-.6); for(const x of [-3,3]) for(const z of [-1.7,.5]) box(G,.15,z<0?2.9:2.4,.15,holzD,x,z<0?1.45:1.2,z); box(G,6.2,2.9,.08,bretter,0,1.45,-1.75);
    const d2=box(G,6.6,.08,2.8,dach,0,2.75,-.6); d2.rotation.x=.2; const st=box(G,5.6,1.9,1.1,[holzD,holzD,holzD,holzD,holzE,holzD],0,1.05,-1.1);
    const kl=cyl(.32,holz,.35); place(kl,[1.2,0,1.2],[1.2,.5,1.2]); G.add(kl); for(let i=0;i<8;i++){ const s2=box(G,.12,.05,.4,M('#c9a06a'),.4+q()*2,.03,.6+q()*1.4); s2.rotation.y=q()*3; } // Hackklotz, Scheite
    const m=zuG(G,mensch({x:1.2,y:0,z:.35},{x:1.2,z:1.2},'#8a3b2e','#3a3020',HUT.kapuze,{aermel:'#e6dccb'})); const ax=new THREE.Group(); ax.position.y=-.62; m.arme[1].add(ax); box(ax,.04,.8,.04,holz,0,-.3,0); box(ax,.04,.14,.22,M('#8a8e93'),0,-.68,.1);
    m.arme[0].rotation.x=-.4; const wp=new THREE.Vector3(); G.updateMatrixWorld(); wp.set(1.2,.55,1.2).applyMatrix4(G.matrixWorld); D.hacker={m,klotz:wp,hit:true}; }

  // ---------- links 253–286 m: Gemüsegarten mit Flechtzaun, Kohl, Vogelscheuche; Bienenkörbe mit Schwarm ----------
  { const p=at(-1,270,6.5), G=grp(p), zaun=geflecht('#7a5a32',true); zaun.map.repeat.set(8,1); for(const [x,z,w,ry] of [[0,5.5,28,0],[0,-5.5,28,0],[14,0,11,Math.PI/2],[-14,0,11,Math.PI/2]]){ const z2=new THREE.Mesh(new THREE.PlaneGeometry(w,.9),zaun); z2.position.set(x,.45,z); z2.rotation.y=ry; G.add(z2); }
    for(let x=-14;x<=14;x+=2) for(const z of [-5.5,5.5]) pfahl(G,x,0,z,1,.04); box(G,26,.03,9,M('#5a4128'),0,.02,0); // Pfähle, umgegrabene Erde
    const kohl=[]; for(let x=-12;x<=8;x+=1.1) for(let z=-4;z<=4;z+=1.6) kohl.push({x,z,s:.25+q()*.12,c:q()}); G.updateMatrixWorld(); const gm=G.matrixWorld;
    inst(new THREE.IcosahedronGeometry(1,1),M('#fff'),kohl,o=>{ ps.set(o.x,o.s*.7,o.z).applyMatrix4(gm); qq.setFromAxisAngle(up,o.c*6); sc.set(o.s,o.s*.8,o.s); cc.set(o.c<.5?'#6f9a4a':'#8aaa5a'); });
    { const V=new THREE.Group(); V.position.set(-2,0,0); G.add(V); pfahl(V,0,0,0,2.2,.05); box(V,1.6,.06,.06,holzD,0,1.55,0); const k=new THREE.Mesh(new THREE.CylinderGeometry(.2,.32,.8,8),M('#7a3f1c')); k.position.y=1.3; V.add(k);
      for(const x of [-.55,.55]) box(V,.5,.12,.14,M('#7a3f1c'),x,1.55,0); kugel(V,.17,'#d8c8a0',0,1.9,0); const hut=new THREE.Group(); hut.position.y=1.79; V.add(hut); HUT.stroh(hut);
      for(let i=0;i<6;i++) box(V,.02,.2,.02,stroh,(i<3?-.8:.8)+(q()-.5)*.1,1.5,(q()-.5)*.1).rotation.z=q()-.5; } // Vogelscheuche
    box(G,4,.08,.6,holz,10.5,.5,-3.5); for(const x of [9,12]) box(G,.1,.5,.5,holzD,x,.25,-3.5);
    for(const x of [9.3,10.5,11.7]){ for(let k=0;k<4;k++) mesh(G,new THREE.TorusGeometry(.3-k*.06,.08,6,12),M(k%2?'#b8954a':'#c9a65a'),x,.62+k*.12,-3.5).rotation.x=Math.PI/2; kugel(G,.08,'#b8954a',x,1.08,-3.5); box(G,.1,.06,.02,M('#2a2018'),x,.66,-3.18);
      G.updateMatrixWorld(); const wp=new THREE.Vector3(x,.9,-3.5).applyMatrix4(G.matrixWorld); for(let i=0;i<5;i++){ const b=kugel(world,.03,'#2a2010',0,0,0); D.bienen.push({b,c:wp,ph:q()*6,r:.3+q()*.5}); } } } // Bienenkörbe aus Stroh

  // ---------- links 302–318 m: Waschplatz – Tücher in Krapprot, Waidblau und Gelb wehen auf der Leine, Wäscherin am Zuber ----------
  { const p=at(-1,310,3.5), G=grp(p); for(const x of [-6,0,6]) pfahl(G,x,0,0,2.3,.05); const L=cyl(.01,M('#d8d0c0')); place(L,[-6,2.2,0],[6,2.2,0]); G.add(L);
    [['#a8322a',-5.2],['#2f4f8a',-3.8],['#d9b23a',-2.3],['#f2ece0',-.8],['#a8322a',.9],['#2f4f8a',2.4],['#d9b23a',4],['#7a3f6a',5.2]].forEach(([c,x])=>{ const g=new THREE.PlaneGeometry(1.1,1.3); g.translate(0,-.65,0); const t=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide})); t.position.set(x,2.2,0); G.add(t); D.tuecher.push({t,ph:x}); });
    const zb=mesh(G,new THREE.CylinderGeometry(.55,.48,.5,12,1,true),new THREE.MeshLambertMaterial({color:'#7a5a3a',side:THREE.DoubleSide}),-2,.25,1.5); mesh(G,new THREE.CylinderGeometry(.52,.52,.02,12),wasser,-2,.38,1.5);
    const m=zuG(G,mensch({x:-2,y:0,z:.7},{x:-2,z:1.5},'#6b5a8a','#3a2a1c',HUT.tuch,{lang:1})); m.arme[0].rotation.x=m.arme[1].rotation.x=-.9; D.leute.push({m,art:'waschen',ph:0}); korb(G,-.8,0,1.4,'#efe8d6'); }
  // links 352–362 m: Strohhaufen und Handkarren am Ortsende
  { const p=at(-1,357,2.5), G=grp(p); strohhaufen(G,-1.5,0,-.5,1.2); handkarren(G,1.5,.5,.4); }

  // ---------- rechts 35–64 m: Pranger (Kinder werfen Kohlblätter) und Zelt der Wahrsagerin ----------
  { const p=at(1,40,3), G=grp(p); box(G,.25,1.6,.25,holzD,0,.8,-.45); box(G,1.5,.32,.14,holz,0,1.3,-.3); box(G,1.6,.08,.18,holzD,0,1.48,-.3);
    const m=zuG(G,mensch({x:0,y:-.15,z:-.75},{x:0,z:3},'#8a7a5a','#4a3a2a',()=>{},{})); m.G.rotation.x=.45; m.arme[0].rotation.x=m.arme[1].rotation.x=-1.3; m.arme[0].rotation.z=-.35; m.arme[1].rotation.z=.35; // Kopf und Hände im Brett
    const kinder=[[-1.4,1.6,'#7a9a3a'],[1.2,1.9,'#c94a2a']].map(([x,z,k],i)=>{ const c=zuG(G,mensch({x,y:0,z},{x:0,z:-.6},k,'#5b4a36',i?HUT.tuch:()=>{},i?{lang:1}:{})); c.G.scale.setScalar(.62); return c; });
    const kohl=kugel(G,.11,'#7aa957',0,0,0); kohl.visible=false; D.pranger={m,kinder,kohl}; korb(G,-1.8,0,2.1,'#7aa957'); }
  { const p=at(1,55,4.5), G=grp(p), st=streifenTex(['#5a2a6a','#d9b23a'],8,true); st.repeat.set(4,1); const z=new THREE.Mesh(new THREE.ConeGeometry(2.1,3.4,16,1,true),new THREE.MeshLambertMaterial({map:st,side:THREE.DoubleSide})); z.position.set(0,1.7,-1); G.add(z);
    const tr=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.5),M('#1e1424')); tr.position.set(0,.75,.55); tr.rotation.x=-.5; G.add(tr); kugel(G,.08,'#d9b23a',0,3.45,-1); // Eingang, Knauf
    box(G,.9,.06,.9,M('#3a1e3a'),0,.75,1.4); box(G,.1,.75,.1,holzD,0,.37,1.4); const kg=kugel(G,.17,new THREE.MeshPhongMaterial({color:'#a8d8f0',emissive:'#3a7aa0',shininess:100,transparent:true,opacity:.85}),0,.95,1.4); // Glaskugel
    const m=zuG(G,mensch({x:0,y:0,z:.75},{x:0,z:3},'#5a2a6a','#2a1a2a',k=>{ HUT.tuch(k); k.children[k.children.length-1].material=M('#c62f24'); },{lang:1})); m.arme[0].rotation.x=m.arme[1].rotation.x=-1; m.arme[0].rotation.z=.3; m.arme[1].rotation.z=-.3; // Hände über der Kugel
    const t=frakturTex(256,72,g=>{ g.fillStyle='#e9dcbc'; g.fillRect(0,0,256,72); g.strokeStyle='#5a2a6a'; g.lineWidth=6; g.strokeRect(3,3,250,66); g.fillStyle='#5a2a6a'; g.textAlign='center'; g.textBaseline='middle'; g.font='38px '+FRAKTUR; g.fillText('Wahrsagerin',128,38,230); });
    pfahl(G,1.6,0,1.2,1.8,.04); const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.34),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide})); sg.position.set(1.6,1.6,1.25); G.add(sg); D.kugel=kg; D.leute.push({m,art:'wahrsagen',ph:0}); }

  // ---------- rechts 77–81 m: Müllhaufen mit Scherben, Knochen, kaputtem Fass – ein Hund schnüffelt ----------
  { const p=at(1,79,2.8), G=grp(p); kugel(G,1,M('#5e5444'),0,.2,0,1.25,.55,1.1); for(let i=0;i<10;i++) box(G,.14+q()*.15,.03,.1,M(['#a0603a','#c9b89a','#6a7a5a'][i%3]),(q()-.5)*2,.45+q()*.2,(q()-.5)*1.5).rotation.set(q(),q()*3,q()); // Scherben
    for(let i=0;i<4;i++){ const k=box(G,.4,.06,.06,M('#e8e2d0'),(q()-.5)*2,.55,(q()-.5)*1.4); k.rotation.set(q(),q()*3,q()*.5); } const f=mesh(G,new THREE.CylinderGeometry(.3,.27,.75,10,1,true,0,4),new THREE.MeshLambertMaterial({map:bretter.map,side:THREE.DoubleSide}),.9,.3,.6); f.rotation.z=Math.PI/2;
    const H=vier(G,'#8a6a44',.8,.55,{kh:.6}); H.T.position.set(-.6,0,1.1); H.T.rotation.y=2.2; for(const zz of [-.06,.06]){ const o=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,4),M('#5a4128')); o.position.set(.12,.08,zz); o.rotation.x=zz*6; H.k.add(o); }
    const sw=cyl(.03,H.m); place(sw,[-.38,.4,0],[-.6,.62,0]); H.T.add(sw); D.hund={k:H.k,sw}; }

  // ---------- rechts 120–146 m: Gänsehirtin mit Stecken und Gänseherde ----------
  { const p=at(1,133,5), G=grp(p), m=zuG(G,mensch({x:2.5,y:0,z:-1},{x:0,z:0},'#8a3b2e','#3a2a1c',HUT.tuch,{lang:1})), st=cyl(.025,holz); place(st,[0,-.62,0],[0,-.62,1.6]); st.rotation.x=.3; m.arme[1].add(st); m.arme[1].rotation.x=-.6;
    for(let i=0;i<7;i++) D.gaense.push({...gans(G,0,0,i===3?'#9a9a8a':'#f2ece0'),ph:i/7*6.28+q()*.4,r:2.2+q()*1.6}); }

  // ---------- rechts 252–258 m: Bildstock aus Sandstein mit Blumen, eine alte Frau betet davor ----------
  { const p=at(1,255,1.8), G=grp(p); box(G,.4,1.7,.4,sand,0,.85,-.4); box(G,.7,.6,.5,sand,0,1.95,-.4); box(G,.4,.4,.05,M('#2f4f8a'),0,1.95,-.14); kugel(G,.08,'#e8d8b0',0,1.98,-.11); const dk=new THREE.Mesh(new THREE.ConeGeometry(.55,.45,4),sand); dk.rotation.y=Math.PI/4; dk.position.set(0,2.47,-.4); G.add(dk);
    for(let i=0;i<6;i++) kugel(G,.07,['#d22a1a','#e8d23a','#f2ece0'][i%3],(i-2.5)*.1,.06,-.1);
    const m=zuG(G,mensch({x:0,y:-.4,z:.55},{x:0,z:-1},'#3a3a40','#2a2a2a',HUT.tuch,{lang:1})); m.G.rotation.x=-.12; m.arme[0].rotation.x=m.arme[1].rotation.x=-1.2; m.arme[0].rotation.z=.4; m.arme[1].rotation.z=-.4; m.kopf.rotation.x=.35; } // kniet, Hände gefaltet

  // ---------- rechts 280–296 m: Ochsenkarren beim Abladen, Müller trägt einen Mehlsack ----------
  { const p=at(1,288,3.5), G=grp(p); box(G,3,.12,1.6,bretter,0,.9,0); for(const z of [-.78,.78]) box(G,3,.35,.06,bretter,0,1.12,z);
    for(const z of [-.9,.9]){ const R2=new THREE.Group(); R2.position.set(-.2,.6,z); G.add(R2); mesh(R2,new THREE.TorusGeometry(.6,.06,5,18),holzD,0,0,0); for(let i=0;i<8;i++){ const sp=box(R2,.05,.58,.05,holz,Math.cos(i/8*6.28)*.29,Math.sin(i/8*6.28)*.29,0); sp.rotation.z=i/8*6.28-Math.PI/2; } }
    for(const z of [-.4,.4]){ const d2=cyl(.05,holz); place(d2,[1.4,.95,z],[3.6,1.15,z*.4]); G.add(d2); } const sack=M('#e2d6b6');
    for(const [x,z] of [[-.8,-.3],[-.2,.3],[.5,-.3],[-.5,.35]]) kugel(G,.35,sack,x,1.25,z,1,.7,.75); for(const [x,z] of [[-2.2,1],[-2.6,.3],[-1.9,.2]]) kugel(G,.35,sack,x,.25,z,1,.7,.75);
    const O=vier(G,'#6b4a2e',2.2,1.5,{huf:1}); O.T.position.set(3.9,0,0); for(const zz of [-1,1]){ const h=cyl(.04,M('#e8dcc0'),.02); place(h,[.15,.15,zz*.18],[.15,.35,zz*.42]); O.k.add(h); } box(O.T,.12,.12,1.4,holzD,.95,1.25,0); // Hörner, Joch
    const m=zuG(G,mensch({x:-1.4,y:0,z:1.2},{x:-2.4,z:.6},'#efe8d6','#d8d0c0',HUT.kapuze,{aermel:'#efe8d6'})); kugel(m.G,.35,sack,.05,1.62,-.05,.9,.55,.7); m.arme[0].rotation.x=m.arme[1].rotation.x=-2.6; // Sack auf der Schulter
    D.tiere.push({T:O.T,k:O.k,art:'ochse',ph:1}); strohhaufen(G,1.5,0,-1.6,.6); }

  // ---------- rechts 305–318 m: Ziegengehege mit Unterstand – eine Ziege steht auf dem Dach ----------
  { const p=at(1,311,5), G=grp(p); for(let x=-3;x<=3;x+=1.5) for(const z of [-2.5,2.5]) pfahl(G,x,0,z,1.1,.05); for(let z=-2.5;z<=2.5;z+=1.25) for(const x of [-3,3]) pfahl(G,x,0,z,1.1,.05);
    for(const y of [.5,.95]){ for(const z of [-2.5,2.5]) box(G,6,.06,.06,holz,0,y,z); for(const x of [-3,3]) box(G,.06,.06,5,holz,x,y,0); }
    for(const [x,z,h] of [[-2.6,-2.2,1.6],[-.4,-2.2,1.6],[-2.6,-.6,1.1],[-.4,-.6,1.1]]) box(G,.1,h,.1,holzD,x,h/2,z); const dd=box(G,2.6,.08,2,dach,-1.5,1.4,-1.4); dd.rotation.x=-.25; box(G,2.3,1.5,.06,bretter,-1.5,.75,-2.25);
    const ziege=(x,y,z,ry,c)=>{ const Z=vier(G,c,.9,.75,{huf:1,kh:.95}); Z.T.position.set(x,y,z); Z.T.rotation.y=ry; for(const zz of [-.05,.05]){ const h=new THREE.Mesh(new THREE.ConeGeometry(.03,.22,5),M('#8a7a5a')); h.position.set(.05,.15,zz); h.rotation.z=.7; Z.k.add(h); }
      const bt=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,5),M('#c9c0b0')); bt.position.set(.25,-.15,0); bt.rotation.z=Math.PI; Z.k.add(bt); D.tiere.push({T:Z.T,k:Z.k,art:'ziege',ph:x}); };
    ziege(-1.5,1.48,-1.4,.5,'#e8e4dc'); ziege(1.2,0,.8,2.4,'#8a6a4a'); ziege(1.6,0,-1.2,-1,'#f2ece0'); strohhaufen(G,1.8,0,1.8,.5); }

  // ---------- rechts 379–405 m, hinter dem Ortsende frei auf der Wiese: Dorfweiher mit Schilf und Enten ----------
  { const p=at(1,392,7.5), G=grp(p), gy=terrainAt(p.x,p.z); G.position.y=gy; const ws=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshPhongMaterial({color:'#5d7f86',shininess:90})); ws.rotation.x=-Math.PI/2; ws.scale.set(9,6,1); ws.position.y=.12; G.add(ws);
    const uf=new THREE.Mesh(new THREE.RingGeometry(.94,1.12,24),M('#6b5a3a')); uf.rotation.x=-Math.PI/2; uf.scale.set(9,6,1); uf.position.y=.1; G.add(uf);
    const schilf=[]; for(let i=0;i<70;i++){ const a=q()*6.28, r2=.85+q()*.2; if(Math.sin(a)>.4) continue; schilf.push({x:Math.cos(a)*9*r2, z:Math.sin(a)*6*r2, h:.8+q()*.9, c:q()}); } G.updateMatrixWorld(); const gm=G.matrixWorld;
    inst(new THREE.CylinderGeometry(.02,.03,1,4),M('#fff'),schilf,o=>{ ps.set(o.x,o.h/2,o.z).applyMatrix4(gm); qq.setFromAxisAngle(up,o.c*6); sc.set(1,o.h,1); cc.set(o.c<.5?'#6b7a3a':'#8a8a4a'); });
    inst(new THREE.CylinderGeometry(.045,.045,.22,6),M('#fff'),schilf.filter(o=>o.c>.6),o=>{ ps.set(o.x,o.h-.05,o.z).applyMatrix4(gm); qq.identity(); sc.set(1,1,1); cc.set('#5a3a22'); }); // Rohrkolben
    for(let i=0;i<4;i++){ const E=gans(G,0,0,i%2?'#8a6a44':'#7a6a54',.62); kugel(E.k,.075,i%2?'#2f6b3a':'#7a6a54',0,0,0); D.enten.push({...E,ph:i/4*6.28,r:2.5+i*.9}); } } // Erpel mit grünem Kopf

  // ---------- Galgen auf dem Hügel in der Ferne, ein Rabe sitzt auf dem Balken ----------
  { const p=at(1,380,55), G=grp(p); for(const x of [-1.2,1.2]) box(G,.25,4,.25,holzD,x,2,0); box(G,3,.25,.25,holzD,0,4,0); const st=cyl(.03,holzD); place(st,[.4,2,0],[1.2,2.8,0]); G.add(st); const sl=cyl(.015,M('#8a7a5a')); place(sl,[0,4,0],[0,3,0]); G.add(sl);
    kugel(G,.18,'#141418',-.7,4.25,0,1.3,1,.8); kugel(G,.1,'#141418',-.5,4.38,0); }

  // ---------- Kleinkram: Fässer, Körbe, Eimer an den Hausecken · Katzen auf Fensterbänken · Wäsche über den Gassen · Pfützen · Handkarren ----------
  // Wirtshaus „Zum Goldenen Kranz“ hinter dem Bauernfest: Schild an einem schmiedeeisernen Ausleger über dem Gehweg, schwingt im Wind
  { const H=R.wirt; if(H){ const tx=Math.cos(H.h), tz=Math.sin(H.h), nx=-Math.sin(H.h)*H.side, nz=Math.cos(H.h)*H.side, a=H.dep/2, b=-(H.w/2-.9), y=roadY(H.d)+.15+3.3, eis=M('#2a2826');
      const G=new THREE.Group(); G.position.set(H.x-nx*a+tx*b, y, H.y-nz*a+tz*b); G.rotation.y=Math.atan2(nz,-nx); world.add(G); // lokal: +x von der Wand zur Straße
      box(G,1.3,.05,.05,eis,.65,0,0); const st=cyl(.025,eis); place(st,[0,-.7,0],[1.1,0,0]); G.add(st); for(let i=0;i<3;i++) mesh(G,new THREE.TorusGeometry(.1,.015,4,10),eis,.3+i*.3,-.15,0).rotation.x=Math.PI/2; // Ausleger mit Strebe und Kringeln
      const S=new THREE.Group(); S.position.x=.75; G.add(S); for(const x of [-.4,.4]) box(S,.015,.25,.015,eis,x,-.12,0);
      const t=frakturTex(256,180,g=>{ g.fillStyle='#2f4a2a'; g.fillRect(0,0,256,180); g.strokeStyle='#d9a62b'; g.lineWidth=7; g.strokeRect(6,6,244,168); g.fillStyle='#e8c24a'; g.textAlign='center'; g.textBaseline='middle';
        g.font='36px '+FRAKTUR; g.fillText('Zum',128,40,220); g.font='42px '+FRAKTUR; g.fillText('Goldenen Kranz',128,96,232); g.font='26px '+FRAKTUR; g.fillText('Wein · Bier · Speis',128,145,220); });
      const pl=new THREE.Mesh(new THREE.BoxGeometry(1,.7,.04),[M('#4e3626'),M('#4e3626'),M('#4e3626'),M('#4e3626'),new THREE.MeshLambertMaterial({map:t}),new THREE.MeshLambertMaterial({map:t})]); pl.position.y=-.6; S.add(pl);
      const kr=mesh(S,new THREE.TorusGeometry(.22,.05,6,16),new THREE.MeshLambertMaterial({color:'#d9a62b',emissive:'#3a2a00'}),0,.28,0); for(let i=0;i<8;i++){ const bl=kugel(kr,.05,'#c9a03a',Math.cos(i/8*6.28)*.22,Math.sin(i/8*6.28)*.22,0,1.4,.7,.7); bl.rotation.z=i/8*6.28; } // goldener Kranz
      D.wirt=S; } }
  const inHaus=(p,m)=>R.S.house.some(h=>{ const dx=p.x-h.x, dz=p.z-h.y, c=Math.cos(h.h), sn=Math.sin(h.h); return Math.abs(dx*c+dz*sn)<h.w/2+m&&Math.abs(-dx*sn+dz*c)<h.dep/2+m; });
  const frei=(s,d)=>!DORF_PLATZ.some(([s2,a,b])=>s2===s&&d>a-2&&d<b+2)&&!(s===FEST.s&&d>FEST.d0-2&&d<FEST.d1+2)&&!R.gassen.some(g=>g.s===s&&Math.abs(g.d-d)<3);
  const haeuser=R.S.house.filter(h=>h.su==null&&h.d>20&&h.d<350&&!(R.kirche&&h.side===R.kirche.s&&Math.abs(h.d-R.kirche.d)<20)); let nk=0;
  for(const h of haeuser){ const sg=q()<.5?-1:1, d=h.d+sg*(h.w/2+.7); const p=at(h.side,d,.8); if(q()<.55&&frei(h.side,d)&&!inHaus(p,.35)){ const G=grp(p), k=q();
      if(k<.35){ fass(G,0,0,0); if(q()<.5) fass(G,.55,0,-.3,.85); } else if(k<.65){ korb(G,0,0,0,['#c94a2a','#e0b33c','#7a9a3a','#9a5a2a'][q()*4|0]); if(q()<.5) korb(G,.5,0,-.2); } else if(k<.85){ eimer(G,0,0,0); eimer(G,.35,0,.1); } else handkarren(G,0,-.3,0); }
    if(nk<6&&h.fw&&q()<.35){ nk++; const tx=Math.cos(h.h), tz=Math.sin(h.h), nx=-Math.sin(h.h)*h.side, nz=Math.cos(h.h)*h.side, o=h.dep/2+.14, xx=h.x-nx*o+tx*(q()-.5)*h.w*.5, zz=h.y-nz*o+tz*(q()-.5)*h.w*.5, y=roadY(h.d)+.15+1.05;
      const B=new THREE.Group(); B.position.set(xx,y,zz); B.rotation.y=Math.atan2(-nx,-nz); world.add(B); box(B,.6,.06,.26,M('#d6b286'),0,0,0); const c=katze(B,['#2a2420','#c9733a','#e8e2d6','#6b6560'][nk%4]); c.position.y=.03; } } // Katze schaut auf die Straße
  for(const g of R.gassen.filter(g=>[115,75,275,250].includes(g.d))){ const s=g.s, G=grp(at(s,g.d,2.5)); for(const x of [-2.1,2.1]) pfahl(G,x,0,0,3.7,.04); const L=cyl(.01,M('#d8d0c0')); place(L,[-2.1,3.6,0],[2.1,3.6,0]); G.add(L);
    for(const [x,c] of [[-1.4,'#f2ece0'],[-.3,'#a8322a'],[.8,'#efe6d0'],[1.6,'#2f4f8a']]){ const pg=new THREE.PlaneGeometry(.75,.9); pg.translate(0,-.45,0); const t=new THREE.Mesh(pg,new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide})); t.position.set(x,3.6,0); G.add(t); D.tuecher.push({t,ph:x+g.d}); } } // Wäsche über der Gasse
  const pf=new THREE.MeshPhongMaterial({color:'#5d6a72',shininess:100,transparent:true,opacity:.85,polygonOffset:true,polygonOffsetFactor:-6});
  for(const [d,u] of [[58,-1.2],[96,1],[132,-.6],[188,1.3],[236,-1.4],[296,.4],[341,-1]]){ const f=fr(d), m=new THREE.Mesh(new THREE.CircleGeometry(1,14),pf); m.rotation.x=-Math.PI/2; m.position.set(f.px+f.nx*u,roadY(d)+.16,f.py+f.ny*u); m.scale.set(.9+q()*.5,.55+q()*.3,1); m.rotation.z=q()*3; world.add(m); } // Pfützen
  { const p=at(1,62,1.5), G=grp(p); handkarren(G,0,0,.3); korb(G,1.1,0,.4,'#e0b33c'); } { const p=at(1,158,1.5), G=grp(p); handkarren(G,0,0,-.4); fass(G,1.2,0,.2); }
}

// ---- Bewegung (aus poseBurg, nur in der Nähe des Dorfs): Tiere picken und schnüffeln, Hahn kräht, Holzhacker, Magd pumpt, Wäsche weht, Gänse und Enten ziehen ihre Runden ----
function poseDorf(t,dt,cp){ const D=anim.burg.dorf; if(!D||me.d>420&&Math.hypot(cp.x-R.xs[0],cp.z-R.ys[0])>500) return;
  for(const T of D.tiere){ const ph=t+T.ph; if(T.art==='huhn'){ T.k.rotation.z=T.kraeht?(Math.sin(t*.7)>.93?.9:0):-.9*Math.max(0,Math.sin(ph*3))**4; T.T.rotation.y+=Math.sin(ph*.7)*.004; }
    else if(T.art==='schwein'){ T.k.rotation.z=-.25-.15*Math.max(0,Math.sin(ph*2.2)); T.T.rotation.z=.04*Math.sin(ph*1.3); } else if(T.art==='ziege') T.k.rotation.y=.25*Math.sin(ph*.9); else T.k.rotation.z=.08*Math.sin(ph*.8); }
  for(const L of D.leute){ const m=L.m, ph=t+L.ph;
    if(L.art==='pumpe'){ const w=Math.sin(t*2.6); L.hb.rotation.z=.35*w; m.arme[0].rotation.x=m.arme[1].rotation.x=-1.3-.35*w; L.str.scale.y=w<0?1:.2; L.str.position.y=w<0?.9:1.1; }
    else if(L.art==='haendler'){ m.arme[1].rotation.x=-.8-.5*Math.max(0,Math.sin(ph*2.4)); m.kopf.rotation.y=.3*Math.sin(ph*.8); }
    else if(L.art==='waschen'){ m.G.rotation.x=.15+.08*Math.sin(t*3); m.arme[0].rotation.z=.2*Math.sin(t*6); m.arme[1].rotation.z=-.2*Math.sin(t*6+1); }
    else if(L.art==='winkkind'){ const e=Math.hypot(cp.x-m.G.getWorldPosition(D.v||(D.v=new THREE.Vector3())).x,cp.z-D.v.z), k=bSm((35-e)/12); m.arme[1].rotation.x=-k*(2.2+.5*Math.sin(t*8+ph)); } }
  if(D.hacker){ const H=D.hacker, w=Math.sin(t*2.2); H.m.arme[1].rotation.x=-1.2-1.4*w; if(H.hit&&w<-.97&&Math.hypot(cp.x-H.klotz.x,cp.z-H.klotz.z)<90){ H.hit=false; for(let i=0;i<8;i++) partSpawn(parts.dust,H.klotz.x,H.klotz.y,H.klotz.z,(Math.random()-.5)*2.2,.8+Math.random()*1.4,(Math.random()-.5)*2.2,.8,Math.random()<.5?'#c9a06a':'#e0c08a'); } if(w>0) H.hit=true; } // Späne
  if(D.pranger){ const P=D.pranger, k=(t/2.6)%1, i=Math.floor(t/2.6)%2, c=P.kinder[i]; c.arme[1].rotation.x=k<.25?-2.6+k*8:-.2; P.kohl.visible=k>.2&&k<.62;
    if(P.kohl.visible){ const u=(k-.2)/.42, a=c.G.position; P.kohl.position.set(a.x*(1-u), .9+u*.4+1.6*u*(1-u), a.z*(1-u)-.6*u); } P.m.kopf.rotation.y=.25*Math.sin(t*1.4); }
  if(D.hund){ D.hund.k.rotation.z=-.5-.3*Math.max(0,Math.sin(t*4)); D.hund.k.rotation.y=.3*Math.sin(t*.9); D.hund.sw.rotation.x=.4*Math.sin(t*9); }
  if(D.wirt) D.wirt.rotation.x=.12*Math.sin(t*1.3)+.05*Math.sin(t*2.9); // Wirtshausschild schwingt
  if(D.kugel) D.kugel.material.emissiveIntensity=.7+.3*Math.sin(t*2);
  for(const T of D.tuecher) T.t.rotation.x=.18*Math.sin(t*2.2+T.ph)+.08*Math.sin(t*3.9+T.ph*1.7);
  for(const K of D.katzen){ K.sw.rotation.y=.5*Math.sin(t*1.5+K.ph); K.k.rotation.y=.4*Math.sin(t*.4+K.ph); }
  for(const B of D.bienen){ const a=t*3+B.ph; B.b.position.set(B.c.x+Math.cos(a)*B.r, B.c.y+.25*Math.sin(a*1.7), B.c.z+Math.sin(a*1.3)*B.r); }
  for(const [L,v] of [[D.gaense,.18],[D.enten,.12]]) for(const G of L){ const a=G.ph+t*v; G.T.position.set(Math.cos(a)*G.r*(L===D.enten?1.3:1), L===D.enten?.08:0, Math.sin(a)*G.r*.8); G.T.rotation.y=-a-Math.PI/2; G.T.rotation.z=L===D.enten?0:.08*Math.sin(t*8+G.ph); if(L===D.gaense) G.k.rotation.z=-.4*Math.max(0,Math.sin(t*2+G.ph*3))**3; }
  for(const P of D.dampf){ const k=(t*.18+P.ph)%1; P.sp.position.set(P.x+k*.6,P.y+k*2.2,P.z); P.sp.scale.setScalar(.6+k*1.6); P.sp.material.opacity=.35*Math.sin(k*Math.PI); } }
