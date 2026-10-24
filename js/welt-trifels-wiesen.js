/* ================= Kampagne Mission 1: vier Lichtungen zwischen den Jagden (Trifels) =================
   Nach Jagd 1 Schafherde mit Lämmern, Schäfer, Hütehund, Pferch und Schäferkarren – vier Schafe stehen auf dem Weg und trotten zur Seite (Friedel: TRI_TXT.schafe),
   nach Jagd 2 Weiher mit Schilf, Seerosen, Enten, Steg und Angler, Fachwerkscheune mit Leiterwagen – eine Elwetritsche sitzt auf dem First und haut ab,
   nach Jagd 3 Kuhherde (Glanrind) hinter dem Stangenzaun (am Weg und an beiden Enden quer ins Gelände), Hirtenjunge auf dem Zaun, Tränke – eine Kuh am Zaun schaut dir nach,
   nach Jagd 4 rechts am Waldrand Köhlerplatz: hell glühender, qualmender Meiler, Köhlerhütte, Feuer mit Kessel, rußschwarzer Köhler stochert, Holzstapel.
   Lage: TRIFELS_T.wiesen (s nach Beginn der Jagd, strecke.js) → orte.wiesen → R.tri.wiesen · prepTrifelsWiesen aus prepTrifelsLeben (Plätze freiräumen) · triWiesenGelaende aus trifelsGelaende (Weiher eben)
   buildTrifelsWiesen aus buildTrifelsLeben · poseTrifelsWiesen aus poseTrifelsLeben · Töne in triTon (welt-trifels-leben.js) */
const TRI_WIESE_ART=['schafe','teich','kuehe','koehler']; // nach Jagd 1–4

// ---- Vorbereitung: Lage aller Teile (fest per Zufall), Bäume und Büsche dort weg ----
function prepTrifelsWiesen(r){ const T=r.tri, S=r.S, q=rng(3131), frei=[]; T.wiesen=[];
  const pos=(d,u)=>{ const [px,py]=posAt(r,d), h=headingAt(r,d); return {d,u,x:px-Math.sin(h)*u, z:py+Math.cos(h)*u, h}; }; // u: Meter neben der Wegmitte (positiv = rechts)
  (r.def.orte.wiesen||[]).forEach((w,i)=>{ if(!w) return; const a=w[0]*r.kf, b=w[1]*r.kf, c=(a+b)/2, l=b-a, art=TRI_WIESE_ART[i], P={}; T.wiesen.push({art,a,b,c,P});
    const stell=(k,d,u,rad,x={})=>{ const p={...pos(d,u),...x}; (P[k]||(P[k]=[])).push(p); if(rad) frei.push([p.x,p.z,rad]); return p; };
    if(art==='schafe'){ for(let k=0;k<24;k++){ const rechts=k<17; let d=c+(q()-.5)*(l-90); if(!rechts&&Math.abs(d-c+22)<26) d+=52; stell('schaf',d,rechts?10+q()*30:-(12+q()*16),1.5,{lamm:k%5===4,dreh:q()*6.28,ph:q()*6}); }
      for(let k=0;k<4;k++) stell('wegschaf',a+70+k*2.2,-1.5+k,0,{dreh:q()*6.28,ph:q()*6,ziel:7+k*1.3+q()}); // stehen auf dem Weg, trotten nach rechts
      stell('pferch',c-30,-24,7); stell('karren',c-12,-15,3.5); stell('schaefer',c+4,8.5,1.2); stell('hund',c,20,0); }
    else if(art==='teich'){ stell('teich',c-25,19,14,{rx:9,rz:5.5}); stell('scheune',c+30,-26,9.5); stell('wagen',c+27,-18,3.5); }
    else if(art==='kuehe'){ for(let k=0;k<11;k++) stell('kuh',c+(q()-.5)*Math.min(l-100,190),11+q()*27,2.4,{liegt:k%4===3,dreh:q()*6.28,ph:q()*6,fell:k%3});
      stell('kuh',c-10,8.4,2,{folgt:true,dreh:-Math.PI/2,ph:1,fell:0}); stell('junge',c-26,6,0); stell('traenke',c+16,9.6,2);
      const z0=Math.max(a+12,c-110), z1=Math.min(b-12,c+110); P.zaun=[z0,z1]; for(let d=z0;d<=z1;d+=6) frei.push([pos(d,6).x,pos(d,6).z,2]); for(const d of [z0,z1]) for(let u=6;u<=46;u+=4){ const p=pos(d,u); frei.push([p.x,p.z,2]); } } // Stangenzaun am Weg und an beiden Enden quer ins Gelände
    else if(art==='koehler'){ const d=b-30; stell('meiler',d,21,7.5); stell('huette',d+11,28,3.5); stell('feuer',d+8,13.5,2.5); stell('koehler',d+5.5,18,0); stell('holz',d-9,15,3,{dreh:.2}); stell('holz',d-12,27,3,{dreh:1.3}); stell('klotz',d+9,20,1); } }); // Köhler: rechts am hinteren Ende der Lichtung, am Waldrand
  for(const k of ['tree','bush','rock','konif','block']) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m)); }

// ---- Gelände (aus trifelsGelaende): unter dem Weiher eben und etwas tiefer, damit das Wasser nicht am Hang hängt ----
function triWiesenGelaende(h,dist){ const n=TER.nx, res=TER.res; for(const W of R.tri.wiesen||[]) for(const p of W.P.teich||[]){ const i=Math.round((p.x-TER.x0)/res), j=Math.round((p.z-TER.z0)/res), y0=h[j*n+i]; if(y0==null) continue;
  const cx=Math.cos(p.h), cz=Math.sin(p.h); // elliptisch: entlang des Wegs weiter, quer kurz (der Weiher liegt nah am Weg)
  for(let k=0;k<h.length;k++){ const x=(k%n)*res+TER.x0; if(Math.abs(x-p.x)>30) continue; const z=((k/n)|0)*res+TER.z0, dx=x-p.x, dz=z-p.z, e=Math.hypot((dx*cx+dz*cz)/p.rx,(dz*cx-dx*cz)/p.rz);
    if(e<2.4) h[k]+=(y0-.35-h[k])*bSm((2.4-e)/.9)*bSm((dist[k]-5)/4); } } } // nie am Weg selbst

// ---- Aufbau (aus buildTrifelsLeben, K = Hof-Baukasten) ----
function buildTrifelsWiesen(T,K,box,bretter){ const L=anim.tri.leben; L.wiesen=[]; if(!T.wiesen||!T.wiesen.length) return; const q=rng(4242), M=c=>lam(c);
  const glimm=(c,f=.22)=>new THREE.MeshLambertMaterial({color:c,emissive:new THREE.Color(c).multiplyScalar(f)}); // glimmt leicht (Dämmerung)
  const kG=new THREE.SphereGeometry(1,10,7), zG=new THREE.CylinderGeometry(1,1,1,6), bG=new THREE.BoxGeometry(1,1,1), o3=new THREE.Object3D(), UP=new THREE.Vector3(0,1,0); // geteilte Geometrien
  const kug=(P,m,x,y,z,sx,sy=sx,sz=sx)=>{ const o=new THREE.Mesh(kG,m); o.position.set(x,y,z); o.scale.set(sx,sy,sz); P.add(o); return o; };
  const klotz=(P,m,x,y,z,sx,sy,sz)=>{ const o=new THREE.Mesh(bG,m); o.position.set(x,y,z); o.scale.set(sx,sy,sz); P.add(o); return o; };
  const stab=(P,m,a,b,r)=>{ const o=new THREE.Mesh(zG,m); o.scale.set(r,1,r); place(o,a,b); P.add(o); return o; };
  const balken=(o,a,b,r)=>{ const dir=b.clone().sub(a), l=dir.length(); o.position.copy(a).add(b).multiplyScalar(.5); o.quaternion.setFromUnitVectors(UP,dir.normalize()); o.scale.set(r,l,r); };
  const viele=(geo,m,L2,f)=>{ const I=new THREE.InstancedMesh(geo,m,L2.length); L2.forEach((e,i)=>{ o3.position.set(0,0,0); o3.quaternion.identity(); o3.scale.set(1,1,1); f(o3,e); o3.updateMatrix(); I.setMatrixAt(i,o3.matrix); }); I.instanceMatrix.needsUpdate=true; I.frustumCulled=false; I.userData.ohneBoden=true; return I; }; // __versunken misst Instanzen falsch (Grundgeometrie am Ursprung)
  const boden=p=>bodenY(p.x,p.z), V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const holz=M('#6b4a32'), holzD=M('#4e3626'), stroh=K.stroh, strohHut=M('#d8c070');
  // Vierbeiner, lokal +x nach vorn, Beine drehbar (Knie gibt es nicht), Kopf als Gruppe am Hals
  const tier=o=>{ const G=new THREE.Group(), K2=new THREE.Group(); G.add(K2); kug(K2,o.m,0,o.H,0,o.L/2,o.dick,o.breit);
    const beine=[[1,1],[1,-1],[-1,1],[-1,-1]].map(([x,z])=>{ const b=new THREE.Group(); b.position.set(x*o.L*.3,o.H,z*o.breit*.55); K2.add(b); const l=new THREE.Mesh(zG,o.mb||o.m); l.scale.set(o.br,o.H,o.br); l.position.y=-o.H/2; b.add(l); return b; });
    const kopf=new THREE.Group(); kopf.position.set(o.kx*o.L,o.H+o.ky,0); K2.add(kopf); return {G,K:K2,beine,kopf}; };
  const hut=(m,mat)=>{ kug(m.kopf,mat,0,.2,0,.25,.025,.25); kug(m.kopf,mat,0,.25,0,.13,.08,.13); };
  const sitzen=m=>{ m.beine[0].rotation.x=m.beine[1].rotation.x=-1.4; }; // wie der Kutscher: Sitzfläche .5 über m.G
  const russ=m=>m.G.traverse(o=>{ if(o.material&&o.material.color&&o.material.color.getHexString()==='e3b48e') o.material=M('#7a5c48'); }); // rußiges Gesicht und Hände
  const fern=(G,p,phi,mensch)=>{ G.position.set(p.x,boden(p),p.z); G.rotation.y=mensch?Math.PI/2-phi:-phi; return G; }; // phi: Blickrichtung in der Welt (wie headingAt)

  for(const Wd of T.wiesen){ const P=Wd.P, W={...Wd, teile:[], an:true}, zu=o=>{ world.add(o); W.teile.push(o); return o; }; L.wiesen.push(W);
    // ---------- Schafherde ----------
    if(W.art==='schafe'){ const wolle=glimm('#e6dfcf',.28), schwarz=glimm('#2a2420',.12); W.schafe=[]; W.weg=[];
      const schaf=lamm=>{ const S=tier({m:wolle,mb:schwarz,L:1,H:.48,dick:.3,breit:.27,br:.04,kx:.42,ky:.08}); kug(S.kopf,schwarz,.2,-.02,0,.15,.11,.1); kug(S.kopf,wolle,.08,.07,0,.13,.1,.12);
        for(const z of [-1,1]){ const e=klotz(S.kopf,schwarz,.1,.04,z*.13,.06,.03,.13); e.rotation.x=z*.4; } kug(S.K,wolle,-.5,.52,0,.09); if(lamm) S.G.scale.setScalar(.6); return S; };
      for(const p of P.schaf||[]){ const S=schaf(p.lamm); zu(fern(S.G,p,p.h+p.dreh)); W.schafe.push({...S,p,y:S.G.position.y,lamm:p.lamm,ph:p.ph,dreh:p.h+p.dreh}); }
      for(const p of P.wegschaf||[]){ const S=schaf(false); zu(fern(S.G,p,p.h+p.dreh)); W.weg.push({...S,p,s:-1,ph:p.ph}); }
      W.ton=V(0,0,0); { const ps=W.schafe.slice(0,17); for(const s of ps) W.ton.add(s.G.position); W.ton.multiplyScalar(1/Math.max(1,ps.length)); W.ton.y+=1; }
      // Pferch aus Flechtwerk mit drei Schafen, zum Weg hin offen
      for(const p of P.pferch||[]){ const G=new THREE.Group(), y0=boden(p); G.position.set(p.x,y0,p.z); zu(G); const fl=K.geflecht('#8a6a3a',true), pl=new THREE.PlaneGeometry(1,1), R2=5, n=14, pt=[];
        for(let k=0;k<=n;k++){ const a=p.h+Math.PI/2+.55+k/n*(Math.PI*2-1.1), x=Math.cos(a)*R2, z=Math.sin(a)*R2; pt.push([x,z,bodenY(p.x+x,p.z+z)-y0]); } // Öffnung zum Weg (rechts vom Pferch)
        pt.forEach(([x,z,y],k)=>{ stab(G,holzD,[x,y-.05,z],[x,y+1.05,z],.05); const nx=pt[k+1]; if(!nx) return; const mx=(x+nx[0])/2, mz=(z+nx[1])/2, my=(y+nx[2])/2, w=new THREE.Mesh(pl,fl); w.scale.set(Math.hypot(nx[0]-x,nx[1]-z),.85,1); w.position.set(mx,my+.48,mz); w.rotation.y=-Math.atan2(nx[1]-z,nx[0]-x); G.add(w); });
        for(const [dx,dz,ry] of [[-1.2,.8,.5],[1,-1.4,2.2],[.6,1.6,-1.2]]){ const S=schaf(false), x=p.x+dx, z=p.z+dz; S.G.position.set(x,bodenY(x,z),z); S.G.rotation.y=ry; zu(S.G); W.schafe.push({...S,p:{x,z},y:S.G.position.y,ph:q()*6,dreh:-ry}); }
        { const R3=new THREE.Group(); R3.position.set(.5,bodenY(p.x+.5,p.z)-y0,0); G.add(R3); klotz(R3,holzD,0,.25,0,1.4,.12,.5); for(const x of [-.6,.6]) klotz(R3,holzD,x,.12,0,.08,.3,.5); kug(R3,stroh,0,.4,0,.6,.15,.22); } } // Raufe mit Heu
      // Schäferkarren: zwei Räder, Plane als Halbrund, Deichsel liegt auf dem Boden
      for(const p of P.karren||[]){ const G=zu(fern(new THREE.Group(),p,p.h+.4)); G.updateMatrixWorld(true); G.position.y=Math.max(...[-.78,.78].map(z=>{ const w=G.localToWorld(V(0,0,z)); return bodenY(w.x,w.z); })); const plane=new THREE.CylinderGeometry(.74,.74,2.7,10,1,true,0,Math.PI); plane.rotateZ(Math.PI/2);
        klotz(G,bretter,0,1.15,0,2.6,1,1.4); const pm=new THREE.Mesh(plane,new THREE.MeshLambertMaterial({color:'#d8ccb0',side:THREE.DoubleSide})); pm.position.y=1.62; G.add(pm); klotz(G,M('#1e1610'),-1.31,1.15,0,.04,.8,.5);
        for(const z of [-.78,.78]){ const r2=new THREE.Mesh(new THREE.TorusGeometry(.55,.05,5,16),holzD); r2.position.set(0,.6,z); G.add(r2); for(let k=0;k<3;k++){ const sp=klotz(G,holz,0,.6,z,.04,1.05,.04); sp.rotation.z=k*Math.PI/3; } }
        stab(G,holz,[1.3,.75,.3],[2.9,.06,.15],.04); stab(G,holz,[1.3,.75,-.3],[2.9,.06,-.15],.04); stab(G,M('#3a3634'),[-.6,2.1,.3],[-.6,2.6,.3],.05); } // Ofenrohr
      // Schäfer mit Hirtenstab und Filzhut, schaut dir nach
      for(const p of P.schaefer||[]){ const m=trMensch({kittel:'#5a4a3a',hose:'#3a3020',mantel:'#4a4034',haar:'#9a948a',bart:'#9a948a'}); hut(m,M('#3a3028')); m.arme[0].rotation.x=-.35;
        const st=new THREE.Group(); st.position.y=-.62; m.arme[0].add(st); stab(st,holz,[0,-.85,.12],[0,1.05,.12],.025); const kr=new THREE.Mesh(new THREE.TorusGeometry(.11,.022,4,10,Math.PI),holz); kr.position.set(0,1.05,.23); kr.rotation.y=Math.PI/2; st.add(kr);
        zu(fern(m.G,p,p.h-Math.PI/2,true)); W.schaefer={m,phi:p.h-Math.PI/2}; }
      // Hütehund: schwarz mit weißer Brust, läuft im Bogen um die Herde
      for(const p of P.hund||[]){ const fh=glimm('#24201c',.15), H=tier({m:fh,L:.72,H:.36,dick:.16,breit:.12,br:.03,kx:.45,ky:.16}); kug(H.kopf,fh,.06,0,0,.1,.09,.085); kug(H.kopf,fh,.17,-.03,0,.08,.05,.05);
        kug(H.K,glimm('#efe8dc',.3),.28,.32,0,.1,.12,.09); for(const z of [-1,1]) klotz(H.kopf,fh,.02,.09,z*.06,.04,.08,.03); const sw=new THREE.Group(); sw.position.set(-.36,.42,0); H.K.add(sw); stab(sw,fh,[0,0,0],[-.26,.14,0],.025);
        zu(H.G); W.hund={...H,sw,p}; } }

    // ---------- Weiher mit Enten, Steg und Angler · Fachwerkscheune mit Leiterwagen ----------
    else if(W.art==='teich'){ W.enten=[];
      for(const p of P.teich||[]){ const G=zu(fern(new THREE.Group(),p,p.h)); G.position.y=boden(p); W.ton=V(p.x,G.position.y+1,p.z);
        const ws=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshPhongMaterial({color:'#4f6f78',shininess:90})); ws.rotation.x=-Math.PI/2; ws.scale.set(p.rx,p.rz,1); ws.position.y=.2; G.add(ws);
        const uf=new THREE.Mesh(new THREE.RingGeometry(.94,1.14,28),M('#5e4e34')); uf.rotation.x=-Math.PI/2; uf.scale.set(p.rx,p.rz,1); uf.position.y=.14; G.add(uf);
        const schilf=[]; for(let k=0;k<80;k++){ const a=q()*6.28, r2=.86+q()*.22; if(Math.sin(a)<-.35&&Math.cos(a)>-.2) continue; schilf.push({x:Math.cos(a)*p.rx*r2, z:Math.sin(a)*p.rz*r2, h:.8+q()*1, c:q()}); } // nicht am Steg (vorn, zum Weg hin)
        const ip=new THREE.Color(); { const I=viele(new THREE.CylinderGeometry(.02,.03,1,4),M('#fff'),schilf,(o,e)=>{ o.position.set(e.x,.1+e.h/2,e.z); o.rotation.y=e.c*6; o.scale.set(1,e.h,1); }); schilf.forEach((e,k)=>I.setColorAt(k,ip.set(e.c<.5?'#6b7a3a':'#8a8a4a'))); G.add(I); }
        { const rk=schilf.filter(e=>e.c>.6); G.add(viele(new THREE.CylinderGeometry(.045,.045,.22,6),M('#5a3a22'),rk,(o,e)=>o.position.set(e.x,.05+e.h,e.z))); } // Rohrkolben
        const ros=[]; for(let k=0;k<12;k++){ const a=q()*6.28, r2=.3+q()*.5; ros.push({x:Math.cos(a)*p.rx*r2, z:Math.sin(a)*p.rz*r2, s:.25+q()*.2, b:k%3===0}); }
        G.add(viele(new THREE.CircleGeometry(1,8),M('#4a7a3a'),ros,(o,e)=>{ o.position.set(e.x,.21,e.z); o.rotation.x=-Math.PI/2; o.scale.setScalar(e.s); })); // Seerosenblätter
        for(const e of ros) if(e.b) kug(G,glimm(e.x>0?'#f2e8ee':'#e8a0b8',.4),e.x+.08,.26,e.z,.09,.06,.09); // Blüten
        for(let k=0;k<4;k++){ const E=K.gans(G,0,0,k%2?'#8a6a44':'#7a6a54',.62); kug(E.k,k%2?glimm('#2f6b3a'):glimm('#7a6a54'),0,0,0,.075); W.enten.push({...E,ph:k/4*6.28,r:.35+k*.12,rx:p.rx,rz:p.rz}); } // Erpel mit grünem Kopf
        // Steg vom Ufer (zum Weg hin) ins Wasser, Angler sitzt am Ende und schaut übers Wasser
        const sx=2.5, z0=-p.rz-2.2, z1=-3.4; klotz(G,bretter,sx,.55,(z0+z1)/2,1.1,.07,z1-z0);
        for(const [x,z] of [[-.45,z0+.3],[.45,z0+.3],[-.45,z1+.2],[.45,z1+.2]]){ const s=stab(G,holzD,[sx+x,-.4,z],[sx+x,.55,z],.06); s.userData.ohneBoden=true; } // Pfähle stecken im Grund
        const m=trMensch({kittel:'#6a5a3a',hose:'#3a3020',haar:'#6a4a2a'}); hut(m,strohHut); sitzen(m); m.arme[0].rotation.x=m.arme[1].rotation.x=-1; m.G.position.set(sx,.59-.5,z1+.25); G.add(m.G);
        const ru=new THREE.Group(); ru.position.set(sx,1.05,z1+.6); G.add(ru); stab(ru,holz,[0,0,0],[0,1.5,2.6],.014); stab(ru,M('#d8d4c8'),[0,1.5,2.6],[0,-.83,3],.004); W.angler={m,ru}; } // Rute mit Schnur
      for(const p of P.scheune||[]){ const G=zu(fern(new THREE.Group(),p,p.h)), lx=5.5, lz=3.5, ys=[]; G.updateMatrixWorld(true); // lokal +z zum Weg (Scheune links)
        for(const [x,z] of [[-lx,-lz],[lx,-lz],[-lx,lz],[lx,lz],[0,0]]){ const w=G.localToWorld(V(x,0,z)); ys.push(bodenY(w.x,w.z)); } const y0=Math.max(...ys), lo=Math.min(...ys); G.position.y=y0;
        const stein=M('#8a7e6e'), fw=new THREE.MeshLambertMaterial({map:canvasTex(256,96,g=>{ g.fillStyle='#e6dcc4'; g.fillRect(0,0,256,96); g.fillStyle='#4e3626'; for(let x=0;x<=256;x+=42) g.fillRect(x-3,0,6,96); g.fillRect(0,0,256,6); g.fillRect(0,90,256,6); g.fillRect(0,46,256,5);
          g.lineWidth=4; g.strokeStyle='#4e3626'; g.beginPath(); for(let x=0;x<256;x+=84){ g.moveTo(x,6); g.lineTo(x+42,46); g.moveTo(x+84,6); g.lineTo(x+42,46); } g.stroke(); })});
        const so=klotz(G,stein,0,(lo-y0-.4+.35)/2,0,2*lx+.3,.35-(lo-y0-.4),2*lz+.3); so.userData.ohneBoden=true; // Sockel reicht in den Hang
        const eave=4.35, hd=3; klotz(G,fw,0,.35+2,0,2*lx,4,2*lz);
        const gi=new THREE.CylinderGeometry(1,1,2*lx,3); gi.rotateZ(Math.PI/2); gi.rotateX(-Math.PI/2); const gm=new THREE.Mesh(gi,M('#e6dcc4')); gm.scale.set(1,hd/1.5,2*lz/1.732); gm.position.y=eave+hd/3; G.add(gm); // Giebel
        const al=Math.atan(hd/lz), sl=Math.hypot(lz,hd)+.6, dm=M('#8e4a32'); for(const s of [-1,1]){ const d2=klotz(G,dm,0,eave+hd/2+.05,s*(lz/2+.12),2*lx+.8,.14,sl); d2.rotation.x=s*al; } // Ziegeldach
        klotz(G,M('#1a1410'),0,.35+1.65,lz+.02,3.4,3.3,.05); kug(G,stroh,0,.75,lz+.05,1.3,.5,.25); // offenes Tor, Heu im Dunkel
        for(const s of [-1,1]){ const f=klotz(G,bretter,s*2.35,.35+1.65,lz+.75,1.7,3.3,.08); f.rotation.y=s*(Math.PI/2-.35); }
        for(const x of [-3.8,3.8]) klotz(G,M('#1a1410'),x,.35+2.6,lz+.02,.7,.6,.05); // Luken
        // Elwetritsche sitzt auf dem First, schaut zum Weg und haut ab, wenn du kommst
        const E=elwetritscheModell(); E.G.traverse(o=>{ if(!o.material||!o.material.color) return; const c=o.material.color; o.material=c.getHexString()==='f6f4ee'?new THREE.MeshBasicMaterial({color:'#fff4d0'}):new THREE.MeshLambertMaterial({color:c,emissive:c.clone().multiplyScalar(.25)}); });
        E.G.position.set(2.5,eave+hd+.02,0); G.add(E.G); W.elw={...E,s:-1,y:eave+hd+.02,d:p.d}; }
      for(const p of P.wagen||[]){ const G=zu(fern(new THREE.Group(),p,p.h+.15)); G.updateMatrixWorld(true); G.position.y=Math.max(...[[-1.1,-.75],[1.1,-.75],[-1.1,.75],[1.1,.75]].map(([x,z])=>{ const w=G.localToWorld(V(x,0,z)); return bodenY(w.x,w.z); })); // aufs höchste Rad (Hang) klotz(G,bretter,0,.85,0,3.2,.1,1.3); // Leiterwagen mit Heu
        for(const z of [-.7,.7]){ for(const y of [1,1.65]) stab(G,holz,[-1.6,y,z],[1.6,y,z*1.12],.03); for(let k=0;k<7;k++){ const x=-1.5+k*.5; stab(G,holz,[x,.9,z],[x,1.65,z*1.12],.02); } }
        for(const [x,z] of [[-1.1,-.75],[1.1,-.75],[-1.1,.75],[1.1,.75]]){ const r2=new THREE.Mesh(new THREE.TorusGeometry(.42,.045,5,14),holzD); r2.position.set(x,.44,z); G.add(r2); const sp=klotz(G,holz,x,.44,z,.04,.8,.04); sp.rotation.z=.8; klotz(G,holz,x,.44,z,.04,.8,.04).rotation.z=-.8; }
        stab(G,holz,[1.6,.8,0],[3.2,.05,.1],.045); for(const [x,y,z,s] of [[-.6,1.35,0,1],[.6,1.3,.05,.9],[0,1.75,-.05,.8]]) kug(G,stroh,x,y,z,1.1*s,.5*s,.65*s); } }

    // ---------- Kuhherde (Glanrind) hinter dem Stangenzaun, Hirtenjunge, Tränke ----------
    else if(W.art==='kuehe'){ W.kuehe=[]; const FELL=['#b8743a','#a8652e','#c48a4a'].map(c=>glimm(c,.2)), maul=glimm('#d8b0a0',.2), horn=M('#e8dcc0'), glocke=M('#9a8a4a');
      const kuh=(fell,liegt)=>{ const C=tier({m:fell,L:1.9,H:.8,dick:.42,breit:.36,br:.075,kx:.42,ky:.25}); kug(C.kopf,fell,.22,-.02,0,.3,.2,.17); kug(C.kopf,fell,.52,-.08,0,.22,.17,.15); kug(C.kopf,maul,.7,-.14,0,.1,.09,.12);
        for(const z of [-1,1]){ stab(C.kopf,horn,[.46,.05,z*.1],[.42,.2,z*.27],.025); const e=klotz(C.kopf,fell,.38,0,z*.17,.08,.04,.15); e.rotation.x=z*.3; } kug(C.kopf,glocke,.22,-.24,0,.06,.08,.06);
        kug(C.K,maul,-.35,.42,0,.17,.11,.14); const sw=new THREE.Group(); sw.position.set(-.94,1.1,0); C.K.add(sw); stab(sw,fell,[0,0,0],[0,-.72,0],.025); kug(sw,M('#4a3222'),0,-.78,0,.05,.1,.05);
        if(liegt){ C.beine.forEach((b,k)=>b.rotation.z=k<2?-1.4:1.4); C.K.position.y=-.36; } return {...C,sw}; };
      for(const p of P.kuh||[]){ const C=kuh(FELL[p.fell],p.liegt); zu(fern(C.G,p,p.h+p.dreh)); W.kuehe.push({...C,p,ph:p.ph,liegt:p.liegt,folgt:p.folgt,phi:p.h+p.dreh}); }
      W.ton=V(0,0,0); for(const c of W.kuehe) W.ton.add(c.G.position); W.ton.multiplyScalar(1/Math.max(1,W.kuehe.length)); W.ton.y+=1;
      // Stangenzaun: rechts am Weg entlang und an beiden Enden quer zum Weg 40 m ins Gelände (Pfosten und zwei Stangen, alles als InstancedMesh)
      { const [z0,z1]=P.zaun, pp=(d,u)=>{ const p=wegPos(d,u); return V(p.x,bodenY(p.x,p.z),p.z); }, linien=[[],[],[]], pf=[], st=[];
        for(let u=46;u>6;u-=3.6) linien[0].push(pp(z0,u)); const n=Math.max(1,Math.round((z1-z0)/3.6)); for(let k=0;k<=n;k++) linien[1].push(pp(z0+(z1-z0)*k/n,6)); for(let u=6+3.6;u<=46;u+=3.6) linien[2].push(pp(z1,u));
        linien[0].push(linien[1][0]); linien[2].unshift(linien[1][n]); // Ecken teilen sich den Pfosten
        for(const l of linien){ for(let k=0;k<l.length;k++){ if(!pf.includes(l[k])) pf.push(l[k]); if(k+1<l.length) for(const y of [.5,1]) st.push([l[k].clone().setY(l[k].y+y),l[k+1].clone().setY(l[k+1].y+y)]); } }
        zu(viele(zG,holzD,pf,(o,e)=>{ o.position.set(e.x,e.y+.5,e.z); o.scale.set(.07,1.2,.07); })); zu(viele(zG,holz,st,(o,[a,b])=>balken(o,a,b,.04))); }
      // Hirtenjunge sitzt auf der oberen Stange, lässt die Beine baumeln
      for(const p of P.junge||[]){ const m=trMensch({kittel:'#7a6a4a',hose:'#4a3a28',haar:'#c9a04a'}); m.G.scale.setScalar(.8); hut(m,strohHut); m.arme[0].rotation.x=m.arme[1].rotation.x=-.6;
        const st=new THREE.Group(); st.position.y=-.62; m.arme[1].add(st); stab(st,holz,[0,-.3,0],[0,1.1,.3],.018); zu(fern(m.G,p,p.h-Math.PI/2,true)); m.G.position.y+=1.04-.4; W.junge=m; } // Haselstock
      for(const p of P.traenke||[]){ const G=zu(fern(new THREE.Group(),p,p.h)); klotz(G,holzD,0,.25,0,2.2,.45,.6); const wa=klotz(G,K.wasser,0,.43,0,2.05,.02,.46); wa.userData.ohneBoden=true; } }

    // ---------- Köhlerplatz: Meiler, Hütte, Feuer mit Kessel, Köhler, Holzstapel ----------
    else if(W.art==='koehler'){ W.glut=[]; W.rauch=[]; W.flamme=[];
      const rad=(c0,c1)=>canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,31); gr.addColorStop(0,c0); gr.addColorStop(1,c1); g.fillStyle=gr; g.fillRect(0,0,64,64); });
      const glanz=rad('rgba(255,170,80,1)','rgba(255,100,20,0)'), feuerT=rad('rgba(255,236,150,1)','rgba(255,110,20,0)');
      for(const p of P.meiler||[]){ const G=zu(fern(new THREE.Group(),p,p.h)); G.position.y=boden(p)-.25; W.ton=V(p.x,G.position.y+1.5,p.z); W.meiler=G;
        const dom=new THREE.Mesh(new THREE.SphereGeometry(1,18,10,0,Math.PI*2,0,Math.PI/2),glimm('#2c2824',.1)); dom.scale.set(4,2.7,4); dom.userData.ohneBoden=true; G.add(dom);
        for(let k=0;k<9;k++){ const a=q()*6.28, e=.15+q()*.9; kug(G,M(k%2?'#4a3a2a':'#3a3028'),Math.cos(a)*Math.cos(e)*3.95,Math.sin(e)*2.65,Math.sin(a)*Math.cos(e)*3.95,.6+q()*.4,.12,.5+q()*.4); } // Erde und Rasenplacken
        const gl=new THREE.MeshBasicMaterial({color:'#ffa040'}); for(let k=0;k<16;k++){ const a=q()*6.28, e=.1+q()*.75, o=kug(G,gl,Math.cos(a)*Math.cos(e)*3.98,Math.sin(e)*2.69,Math.sin(a)*Math.cos(e)*3.98,.24+q()*.16); W.glut.push({o,s:o.scale.x,ph:q()*6}); } G.children.forEach(o=>o.userData.ohneBoden=true); // Glutlöcher · alles am Meiler liegt am Fuß im Hang
        const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glanz,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.4})); sp.scale.set(16,9,1); sp.position.y=1.6; G.add(sp); W.glanz=sp;
        G.updateMatrixWorld(true); const wp=new THREE.Vector3(); for(let k=0;k<8;k++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:K.puff,color:'#8a847e',transparent:true,depthWrite:false,opacity:.5})); zu(s); const a=k*.8, r2=k<3?0:1.8+q();
          wp.set(Math.cos(a)*r2,k<3?2.6:1.9,Math.sin(a)*r2).applyMatrix4(G.matrixWorld); W.rauch.push({sp,x:wp.x,y:wp.y,z:wp.z,ph:k/8}); } } // Rauch aus der Spitze und seitlich
      for(const p of P.huette||[]){ const G=zu(fern(new THREE.Group(),p,p.h)); G.rotation.y+=Math.PI; const ke=new THREE.Mesh(new THREE.ConeGeometry(2.3,3.8,9,1,true),new THREE.MeshLambertMaterial({color:'#5a4a3a',side:THREE.DoubleSide})); ke.position.y=1.75; ke.userData.ohneBoden=true; G.add(ke);
        for(let k=0;k<5;k++){ const a=k*1.25; stab(G,holzD,[Math.cos(a)*.3,3.2,Math.sin(a)*.3],[Math.cos(a)*.7,4.3,Math.sin(a)*.7],.04); } klotz(G,M('#141210'),0,.85,1.72,.9,1.5,.1).rotation.x=-.5; } // Stangen oben, Eingang zum Weg
      for(const p of P.feuer||[]){ const G=zu(fern(new THREE.Group(),p,p.h)); G.userData.ohneBoden=true; // Steine und Dreibein stehen etwas im Hang for(let k=0;k<9;k++){ const a=k/9*6.28; kug(G,M('#7a7470'),Math.cos(a)*.55,.08,Math.sin(a)*.55,.14,.1,.12); }
        for(let k=0;k<3;k++){ const a=k*1.05; stab(G,M('#3a2a1e'),[Math.cos(a)*.45,.06,Math.sin(a)*.45],[-Math.cos(a)*.45,.2,-Math.sin(a)*.45],.06); }
        for(let k=0;k<3;k++){ const a=k*2.09+.3; stab(G,holzD,[Math.cos(a)*.95,0,Math.sin(a)*.95],[0,1.6,0],.03); } stab(G,M('#2a2a2a'),[0,1.6,0],[0,1.05,0],.008); kug(G,M('#2a2826'),0,.85,0,.26,.22,.26); // Dreibein mit Kessel
        for(let k=0;k<3;k++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:feuerT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})); s.position.set((k-1)*.15,.35+k*.1,(k%2)*.1); G.add(s); W.flamme.push({s,ph:k*2.1}); } }
      for(const p of P.koehler||[]){ const m=trMensch({kittel:'#2a2622',hose:'#1e1c1a',haar:'#1a1816',bart:'#1a1816',aermel:'#2a2622'}); russ(m); m.arme[0].rotation.x=m.arme[1].rotation.x=-1.1;
        stab(m.arme[0],holz,[0,-.6,0],[.08,-2.25,0],.03); const Mp=P.meiler&&P.meiler[0]; zu(fern(m.G,p,Mp?Math.atan2(Mp.z-p.z,Mp.x-p.x):p.h,true)); W.koehler=m; } // Stange zum Meiler
      { const sc=[]; for(const p of P.holz||[]){ const y=boden(p), hh=p.h+p.dreh, cx=Math.cos(hh), cz=Math.sin(hh); for(let l=0;l<3;l++) for(let k=0;k<6-l;k++){ const a=(k-(5-l)/2)*.27; sc.push({x:p.x+cx*a, y:y+.13+l*.23, z:p.z+cz*a, hh}); } } // Scheite quer gestapelt
        if(sc.length) zu(viele(zG,glimm('#7a5a3a',.15),sc,(o,e)=>{ o.position.set(e.x,e.y,e.z); o.rotation.set(Math.PI/2,-e.hh,0,'YXZ'); o.scale.set(.12,1.3,.12); })); }
      for(const p of P.klotz||[]){ const G=zu(fern(new THREE.Group(),p,p.h)); stab(G,M('#6a4e36'),[0,0,0],[0,.55,0],.28); const be=new THREE.Group(); be.position.set(.05,.55,0); be.rotation.z=-.5; G.add(be); stab(be,holz,[0,0,0],[0,.6,0],.025); klotz(be,M('#6e7177'),.06,.02,0,.16,.12,.03); } } } } // Hackklotz mit Beil

// ---- Bewegung (aus poseTrifelsLeben): nur in der Nähe sichtbar und bewegt ----
function poseTrifelsWiesen(dt,t,lauf){ const L=anim.tri&&anim.tri.leben; if(!L||!L.wiesen) return; const ich=wegPos(me.d,0), k=Math.min(1,dt*3);
  const blick=(G,phi,max)=>{ const w=Math.atan2(ich.z-G.position.z,ich.x-G.position.x); let d=phi-w; d=Math.atan2(Math.sin(d),Math.cos(d)); return clampN(d,-max,max); }; // Drehung des Kopfs zu dir
  for(const W of L.wiesen){ const nah=me.d>W.a-350&&me.d<W.b+200; if(W.an!==nah){ W.an=nah; for(const o of W.teile) o.visible=nah; } if(!nah) continue;
    if(W.art==='schafe'){ // grasen, heben ab und zu den Kopf; Lämmer hüpfen
      for(const S of W.schafe){ const g=Math.sin(t*.35+S.ph)>-.4; S.kopf.rotation.z+=((g?-1.2+.08*Math.sin(t*3+S.ph):-.1)-S.kopf.rotation.z)*k;
        if(S.lamm){ const h=Math.sin(t*.8+S.ph)>.55; S.G.position.y=S.y+(h?.22*Math.abs(Math.sin(t*8+S.ph)):0); S.beine.forEach((b,j)=>b.rotation.z=h?(j<2?.4:-.4)*Math.sin(t*16):0); } }
      for(const S of W.weg){ const p=S.p; if(S.s<0&&me.d>p.d-35) S.s=me.d<p.d+5?0:99; if(S.s>=0) S.s+=lauf; const kk=S.s<0?0:bSm(S.s/3.2), geht=kk>0&&kk<1, q2=wegPos(p.d+kk*2,p.u+(p.ziel-p.u)*kk);
        S.G.position.set(q2.x,bodenY(q2.x,q2.z)+(geht?.05*Math.abs(Math.sin(t*12+S.ph)):0),q2.z); S.G.rotation.y=-(q2.h+(S.s<0?p.dreh:1.1-.6*kk));
        S.beine.forEach((b,j)=>b.rotation.z=geht?(j%2?1:-1)*(j<2?1:-1)*.5*Math.sin(t*14+S.ph):0); S.kopf.rotation.z+=((geht?.1:S.s<0?-.2:-1.1)-S.kopf.rotation.z)*k; } // trotten zur Seite und grasen dann
      if(W.schaefer){ const m=W.schaefer.m; m.kopf.rotation.y+=((Math.abs(me.d-W.c-4)<30?blick(m.G,W.schaefer.phi,1.1):0)-m.kopf.rotation.y)*k; m.arme[1].rotation.x=-.1+.05*Math.sin(t*.7); }
      if(W.hund){ const H=W.hund, a=t*.24, RX=45, RZ=11, d=W.c+RX*Math.cos(a), u=H.p.u+RZ*Math.sin(a), p=wegPos(d,u); H.G.position.set(p.x,bodenY(p.x,p.z)+.04*Math.abs(Math.sin(t*16)),p.z); H.G.rotation.y=-(p.h+Math.atan2(RZ*Math.cos(a),-RX*Math.sin(a)));
        H.beine.forEach((b,j)=>b.rotation.z=(j<2?1:-1)*.7*Math.sin(t*16+(j%2)*.5)); H.sw.rotation.x=.4*Math.sin(t*10); } }
    else if(W.art==='teich'){ for(const E of W.enten){ const a=E.ph+t*.1; E.T.position.set(Math.cos(a)*E.rx*E.r*1.3,.16,Math.sin(a)*E.rz*E.r); E.T.rotation.y=-a-Math.PI/2; E.k.rotation.z=-.5*Math.max(0,Math.sin(t*1.6+E.ph*3))**6; } // ziehen Kreise, gründeln ab und zu
      if(W.angler){ const A2=W.angler, z=Math.sin(t*.5)>.96; A2.ru.rotation.x=z?.08*Math.sin(t*30):.02*Math.sin(t*.8); A2.m.kopf.rotation.x=.15; }
      const E=W.elw; if(E){ if(E.s<0&&me.d>E.d-32) E.s=me.d<E.d+5?0:99; if(E.s>=0) E.s+=lauf; const s=E.s, weg=s>1.15; E.G.visible=!weg; // duckt sich, springt hoch und verschwindet hinter dem First
        if(!weg){ const sp=s>.25?(s-.25)/.9:0; E.G.position.y=E.y+(s>.25?1.1*Math.sin(Math.PI*Math.min(1,sp))-1.8*Math.max(0,sp-.6):0); E.G.position.z=-2.6*sp; E.G.scale.setScalar(1.2*(s>=0&&s<.25?.85:1));
          E.G.rotation.y=s<0?.4*Math.sin(t*.5):Math.PI; E.kopf.rotation.x=s<0?.5*Math.max(0,Math.sin(t*1.3))**3:-.2; E.fluegel.forEach((w,j)=>w.rotation.z=(j?-1:1)*(s>.2?.5+.5*Math.sin(t*28):.05*Math.sin(t*2))); E.augen.forEach(a=>a.scale.y=s>=0?1.5:1); } } }
    else if(W.art==='kuehe'){ for(const C of W.kuehe){ C.sw.rotation.x=.35*Math.sin(t*1.4+C.ph)+.2*Math.sin(t*3.1+C.ph); // Schwanz schlägt
        if(C.liegt){ C.kopf.rotation.y=.08*Math.sin(t*2.4+C.ph); C.kopf.rotation.z=-.15; }
        else if(C.folgt){ C.kopf.rotation.y+=((me.d>W.c-60&&me.d<W.c+30?blick(C.G,C.phi,1.3):0)-C.kopf.rotation.y)*k; C.kopf.rotation.z=-.1; } // schaut dir nach
        else { const g=Math.sin(t*.28+C.ph)>-.5; C.kopf.rotation.z+=((g?-1.25:-.05)-C.kopf.rotation.z)*k*.6; C.kopf.rotation.y=g?.12*Math.sin(t*1.9+C.ph):0; } }
      if(W.junge){ const m=W.junge; m.beine[0].rotation.x=-.5+.3*Math.sin(t*2.2); m.beine[1].rotation.x=-.5-.3*Math.sin(t*2.2); m.kopf.rotation.y=Math.abs(me.d-W.c+26)<20?-.6:0; } }
    else if(W.art==='koehler'){ const dk=anim.tri.dk||0; for(const G of W.glut){ const f=.8+.25*Math.sin(t*5+G.ph)*Math.sin(t*2.3+G.ph*2); G.o.scale.setScalar(G.s*f); }
      if(W.glanz) W.glanz.material.opacity=Math.min(1,(.55+.45*dk)*(.85+.15*Math.sin(t*3.7)));
      for(const P of W.rauch){ const x=(t*.09+P.ph)%1; P.sp.position.set(P.x+x*2.5,P.y+x*9,P.z+x*.8); P.sp.scale.setScalar(1.2+x*5); P.sp.material.opacity=.45*Math.sin(x*Math.PI); } // steigt auf, treibt ab
      for(const F of W.flamme){ const f=.7+.3*Math.sin(t*11+F.ph)*Math.sin(t*7.3+F.ph); F.s.scale.set(.9*f,1.3*f,1); F.s.material.opacity=.75+.25*Math.sin(t*13+F.ph); }
      if(W.koehler){ const m=W.koehler, s=Math.max(0,Math.sin(t*1.1)); m.arme[0].rotation.x=m.arme[1].rotation.x=-1.1+.25*s; m.G.rotation.x=0; m.kopf.rotation.x=.25; } } } }
