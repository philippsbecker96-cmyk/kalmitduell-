/* ================= Teufelstisch (Kampagne, Mission 2) – Leben im Kaltenbacher Tal (vom Nutzer: Talweg nicht so langweilig) =================
   Rehe auf der Wiese rechts am Weg (TT_TALREH): springen herum, laufen ein Stück neben euch her, springen dann nach links über den Weg und über den Bach.
   Kurz danach, zwischen den Häusern vor der Kirche, ein Holzsteg über den Bach, über den eine Magd mit Korb geht, während du heranfährst (TT_STEG, Platz T.steg).
   Ein paar Minuten später baden drei Leute in einer Gumpe im Bach (TT_BAD, Platz T.bad aus ttTalPrep in prepTeufelstisch): Kind spritzt, Mann taucht, alle winken dir.
   buildTtTal aus buildTeufelstisch · poseTtTal aus poseTeufelstisch */

const TT_TALREH={t:95, vor:4, spiel:6, mit:20, tiere:[[0,12,6],[0,9,8.5],[1,15,7.5]], quer:5.5}; // Workout-Zeit in s (≈ 1 min nach dem Losfahren) · s vorher tauchen sie auf · s herumspringen · s nebenher · [Kitz, m vor dir, m neben dem rechten Wegrand] · m/s quer über den Weg
const TT_BAD={bei:.62, r:3.4, sicht:260, wink:45}; // Badestelle bei so viel des Talwegs bis zum Anstieg (der Bach reicht bis .7) · Radius der Gumpe · sichtbar so viele m davor · winken, wenn du so nah bist
const TT_STEG={vor:20, lang:4.6, geh:1.1, los:60}; // so viele m vor der Kirche · Länge des Stegs · m/s der Magd · sie geht los, wenn du so viele m davor bist
let ttBachWeit=[]; // [d0, d1]: dort bleibt der Bach weit weg vom Weg (Dorf, Badestelle), sonst fließt er nah am Weg (vom Nutzer) – gesetzt in prepTeufelstisch
const ttBachU=(d,rw)=>{ const w=ttBachWeit.reduce((m,[a,b])=>Math.max(m,bSm((d-a+30)/30)*bSm((b-d+30)/30)),0); return -(rw+4.2+6.8*w+(1.2+2.3*w)*Math.sin(d/55)); }; // Bach: m neben der Wegmitte (rw: halbe Wegbreite)

// ---- Vorbereitung (aus prepTeufelstisch): Platz der Gumpe, keine Erlen dort und dazwischen (freie Sicht vom Weg) ----
function ttTalPrep(T,at,rw,frei){ const d=T.an[0]*TT_BAD.bei, u=ttBachU(d,rw(d)), [x,y]=at(d,u); T.bad={d,u,x,y}; frei.push([x,y,TT_BAD.r+4]);
  for(let dd=-12;dd<=12;dd+=6) for(const o of [3,7]) frei.push([...at(d+dd,-(rw(d+dd)+o)),4]);
  if(T.kirche){ const d=T.kirche.d-TT_STEG.vor, u=ttBachU(d,rw(d)); T.steg={d,u}; for(let o=rw(d)+1;o<-u+5;o+=2.5) frei.push([...at(d,-o),3]); } } // Steg mit Pfad: keine Erlen im Weg

// ---- Aufbau (aus buildTeufelstisch) ----
function buildTtTal(A){ const T=R.tt, q=rng(907);
  A.talReh={an:false, tiere:TT_TALREH.tiere.map(([k])=>{ const r=triReh(k); r.G.visible=false; r.G.userData.ohneBoden=true; world.add(r.G); return {r,d:0,u:0,ph:q()*6,w:q()*6,ry:0}; })}; // Reh und Kitz aus Mission 1 (welt-trifels-leben.js)
  if(T.steg) ttStegBau(A,T.steg,q);
  if(!T.bad) return; const B=T.bad, G=new THREE.Group(), wy=bodenY(B.x,B.y)+.07; G.userData.ohneBoden=true; world.add(G);
  ttFleck(B.x,B.y,TT_BAD.r,'#5d8aa6').material.emissive.set('#1d3a4a'); // Gumpe: der Bach ist hier breiter
  const stein=[lam('#9a948a'),lam('#b5ab98')]; for(let i=0;i<11;i++){ const a=i/11*Math.PI*2+q()*.3, o=TT_BAD.r+.2+q()*.5, x=B.x+Math.cos(a)*o, z=B.y+Math.sin(a)*o, s=.25+q()*.3, b=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),stein[i%2]);
    b.position.set(x,bodenY(x,z)+s*.2,z); b.rotation.set(q(),q()*6,q()); b.scale.y=.6; G.add(b); } // Steine am Ufer
  { const p=wegPos(B.d,B.u+TT_BAD.r+1.4), y=bodenY(p.x,p.z); for(const [w,h,dd,c,dy,ry] of [[.7,.1,.45,'#ece6d8',.05,.2],[.55,.1,.38,'#7a5a3a',.15,-.3],[.5,.08,.3,'#5a6a3a',.24,.5]]){ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),lam(c)); b.position.set(p.x,y+dy,p.z); b.rotation.y=ry; G.add(b); } // Kleiderhaufen am Ufer
    for(const s of [-1,1]){ const b=new THREE.Mesh(new THREE.BoxGeometry(.14,.12,.26),lam('#3e2a1c')); b.position.set(p.x+.55,y+.06,p.z+s*.12); G.add(b); } } // Schuhe
  const haut='#e3b48e', leute=[[{kittel:haut,aermel:haut,haar:'#4a3222',bart:'#4a3222'},1,.85,-1.3,.5],[{kittel:'#ece6d8',haar:'#8a5a32',tuch:'#ece4d4'},1,.85,1.2,-.3],[{kittel:haut,aermel:haut,haar:'#d8b46a'},.62,.5,.1,1.3]]; // Mann mit freiem Oberkörper, Frau im Hemd mit Kopftuch, Kind – bis zum Bauch im Wasser
  const L=leute.map(([o,s,tief,ox,oz])=>{ const m=trMensch(o); m.G.scale.setScalar(s); G.add(m.G); const x=B.x+ox, z=B.y+oz; m.G.position.set(x,wy-tief,z); return {m,x,z,y:wy-tief}; });
  const tm=new THREE.MeshBasicMaterial({color:'#e8f4ff',transparent:true,opacity:.8}), tg=new THREE.SphereGeometry(.05,5,4), tropfen=[]; for(let i=0;i<10;i++){ const t=new THREE.Mesh(tg,tm); G.add(t); tropfen.push(t); } // Spritzer vom Kind zum Mann
  A.bad={G,L,tropfen}; G.visible=false; }

// Holzsteg (lokal +x vom Weg weg über den Bach, leicht gewölbt, Geländer), Trampelpfad vom Weg über den Steg zur Kirche, Magd mit Korb
function ttStegBau(A,S,q){ const T=R.tt, rw=roadW(R,S.d)/2, p=wegPos(S.d,S.u), p2=wegPos(S.d,S.u-1), dx=p2.x-p.x, dz=p2.z-p.z, hl=TT_STEG.lang/2, G=new THREE.Group(), holz=lam('#7a5a3a'), dunkel=lam('#5a4028');
  const y0=Math.max(...[-hl,hl].map(x=>bodenY(p.x+dx*x,p.z+dz*x)))+.12, deck=x=>y0+.35*Math.max(0,1-(x/hl)**2); // Höhe des Belags (Enden auf dem höheren Ufer)
  G.position.set(p.x,0,p.z); G.rotation.y=Math.atan2(-dz,dx); G.userData.ohneBoden=true; world.add(G);
  const n=10; for(let i=0;i<n;i++){ const x=-hl+(i+.5)*TT_STEG.lang/n, b=new THREE.Mesh(new THREE.BoxGeometry(TT_STEG.lang/n-.03,.07,1.25),i%3?holz:dunkel); b.position.set(x,deck(x),0); b.rotation.z=Math.atan(-.7*x/hl/hl); G.add(b); } // Bohlen
  for(const z of [-.6,.6]){ for(const x of [-hl+.1,0,hl-.1]){ const st=new THREE.Mesh(new THREE.BoxGeometry(.09,.95,.09),dunkel); st.position.set(x,deck(x)+.45,z); G.add(st); } // Pfosten
    for(const [a,b] of [[-hl+.1,0],[0,hl-.1]]){ const l=Math.hypot(b-a,deck(b)-deck(a)), r=new THREE.Mesh(new THREE.BoxGeometry(l,.07,.07),holz); r.position.set((a+b)/2,(deck(a)+deck(b))/2+.9,z); r.rotation.z=Math.atan2(deck(b)-deck(a),b-a); G.add(r); } } // Handlauf
  for(const s of [-1,1]){ const b=new THREE.Mesh(new THREE.BoxGeometry(.3,.4,1.4),lam('#9a948a')); b.position.set(s*(hl+.05),y0-.15,0); G.add(b); } // Widerlager aus Stein
  const pfad=(ax,az,bx,bz)=>{ const l=Math.hypot(bx-ax,bz-az); for(let k=0;k<=l;k+=1.3) ttFleck(ax+(bx-ax)*k/l,az+(bz-az)*k/l,.75,'#8a7458'); }, a=wegPos(S.d,-(rw+.5)), e=wegPos(S.d,S.u+hl+.3), f=wegPos(S.d,S.u-hl-.3); // Trampelpfad
  pfad(a.x,a.z,e.x,e.z); pfad(f.x,f.z,T.kirche.x+(f.x-T.kirche.x)*.45,T.kirche.y+(f.z-T.kirche.y)*.45);
  const m=trMensch({lang:'#6a5a7a',kittel:'#ece6d8',haar:'#8a5a32',tuch:'#c9b48a'}), korb=new THREE.Mesh(new THREE.CylinderGeometry(.24,.18,.24,10),lam('#a8864a')); korb.position.set(.3,.95,.08); m.G.add(korb); m.arme[1].rotation.set(-.3,0,.5); // Magd mit Korb auf der Hüfte
  m.G.userData.ohneBoden=true; world.add(m.G); A.steg={m,p,dx,dz,deck,hl,t0:null}; }

// ---- Bewegung (aus poseTeufelstisch) ----
function poseTtTal(dt){ const A=anim.tt; if(!A) return; ttTalReh(A,dt); ttSteg(A); ttBad(A,dt); }

// Magd geht über den Steg, sobald du TT_STEG.los m davor bist (vom Wegrand bis hinter den Bach Richtung Kirche), schaut kurz zu dir
function ttSteg(A){ const S=A.steg, T=R.tt; if(!S) return; const g=me.d-T.steg.d, vis=race.state==='run'&&g>-250&&g<60, m=S.m; m.G.visible=vis; if(!vis){ S.t0=null; return; }
  const t=performance.now()/1000, rw=roadW(R,T.steg.d)/2, x0=-(-T.steg.u-rw-1.5), x1=S.hl+5; if(S.t0==null&&g>-TT_STEG.los) S.t0=t; // x vom Bach aus: Start am Wegrand
  const x=S.t0==null?x0:Math.min(x1,x0+(t-S.t0)*TT_STEG.geh), geht=S.t0!=null&&x<x1, px=S.p.x+S.dx*x, pz=S.p.z+S.dz*x, ph=t*6;
  m.G.position.set(px,Math.abs(x)<S.hl?S.deck(x):bodenY(px,pz),pz); m.G.rotation.y=Math.atan2(S.dx,S.dz)+(Math.abs(x)<1.5?.25:0); // dreht sich auf dem Steg leicht nach dir um
  m.beine[0].rotation.x=geht?.4*Math.sin(ph):0; m.beine[1].rotation.x=geht?-.4*Math.sin(ph):0; m.arme[0].rotation.x=geht?-.3*Math.sin(ph):0; m.kopf.rotation.y=Math.abs(x)<2.5?.9:0; }
const ttDreh=(a,ziel,k)=>a+Math.atan2(Math.sin(ziel-a),Math.cos(ziel-a))*Math.min(1,k);

// Rehe: springen im Kreis auf der Wiese, laufen dann neben euch her (im Bild vor dir), springen nach links über Weg und Bach, bleiben dahinter zurück
function ttTalReh(A,dt){ const Rh=A.talReh, Z=TT_TALREH; if(!Rh) return; const run=race.state==='run', s=run?race.t-Z.t:-1e9, lauf=run&&!race.paused?dt*simSpeed():0, v=Math.max(0,me.v||0), ende=Z.spiel+Z.mit;
  if(s<-Z.vor||s>ende+16||me.d>R.tt.an[0]*.7){ if(Rh.an){ Rh.an=false; Rh.tiere.forEach(e=>e.r.G.visible=false); } return; }
  if(!Rh.an){ Rh.an=true; const d0=me.d+Math.max(30,v*(Z.vor+Z.spiel)+14); Rh.tiere.forEach((e,i)=>{ const [,off,uu]=Z.tiere[i]; e.d=s<Z.spiel?d0+(i-1)*3:me.d+off; e.u=roadW(R,e.d)/2+uu+(s<Z.spiel?2:0); e.c=[e.d,e.u]; e.px=null; }); } // nach Sprüngen im Testmodus gleich an der richtigen Stelle
  Rh.tiere.forEach((e,i)=>{ const [,off,uu]=Z.tiere[i], r=e.r, rw=roadW(R,e.d)/2, tau=s-ende-i*.6; let hop=.35, gang=lauf*(3+v*.6);
    if(s<Z.spiel){ e.w+=lauf*1.8*(i%2?1:-1); e.d=e.c[0]+1.6*Math.cos(e.w); e.u=e.c[1]+1.6*Math.sin(e.w); hop=.55; gang=lauf*7; } // Bocksprünge im Kreis
    else if(tau<=0){ e.d+=lauf*(v+clampN((me.d+off-e.d)*.8,-3,6)); e.u+=(rw+uu+.8*Math.sin(s*.6+i*2)-e.u)*Math.min(1,lauf*1.5); } // nebenher
    else { e.u-=lauf*(e.u>ttBachU(e.d,rw)-8?Z.quer:3); e.d+=lauf*v*(1-.8*bSm((tau-1.5)/3)); hop=.5; } // nach links über Weg und Bach, dann langsamer: ihr fahrt vorbei
    const p=wegPos(e.d,e.u), bu=e.u-ttBachU(e.d,rw), bach=tau>0?1.2*Math.max(0,1-(bu/2.8)**2):0; e.ph+=gang; // großer Satz über den Bach
    if(e.px!=null){ const dx=p.x-e.px, dz=p.z-e.pz; if(dx*dx+dz*dz>1e-6) e.ry=ttDreh(e.ry,Math.atan2(-dz,dx),dt*8); } else e.ry=-p.h; e.px=p.x; e.pz=p.z;
    r.G.visible=e.d>me.d-25; r.G.position.set(p.x,bodenY(p.x,p.z)+hop*Math.abs(Math.sin(e.ph))+bach,p.z); r.G.rotation.y=e.ry;
    r.beine.forEach((b,j)=>b.rotation.z=(j<2?1:-1)*(bach>.3?1:.7)*Math.sin(e.ph*2)); r.K.rotation.z=.15*Math.sin(e.ph*2); r.kopf.rotation.z=0; }); }

// Badende: Kind spritzt den Mann nass, der taucht ab und zu unter, die Frau plätschert – kommst du nah, drehen sich alle zu dir und winken
function ttBad(A,dt){ const B=A.bad, T=R.tt; if(!B) return; const vis=race.state==='run'&&me.d>T.bad.d-TT_BAD.sicht&&me.d<T.bad.d+40; B.G.visible=vis; if(!vis) return;
  const t=performance.now()/1000, ich=riders3d[myKey], ip=ich&&ich.g.position, nah=!!ip&&Math.hypot(ip.x-T.bad.x,ip.z-T.bad.y)<TT_BAD.wink, [Ma,Fr,Ki]=B.L;
  B.L.forEach((P,i)=>{ const m=P.m, o=i===2?Ma:Ki, ziel=nah?Math.atan2(ip.x-P.x,ip.z-P.z):Math.atan2(o.x-P.x,o.z-P.z); m.G.rotation.y=ttDreh(m.G.rotation.y,ziel,dt*3); // schauen sich an oder zu dir
    const k=(t*.22+i*.3)%1, tauch=i===0&&!nah&&k<.18?Math.sin(k/.18*Math.PI):0, w=Math.sin(t*9+i*1.3); // Mann taucht unter
    m.G.position.y=P.y-tauch*1.1+(i===2?.08*Math.abs(Math.sin(t*(nah?7:5))):0);
    if(nah){ m.arme[1].rotation.x=-2.7+.35*w; m.arme[0].rotation.x=i===0?-.5:i===2?-2.7-.35*w:-.4; } // winken, das Kind mit beiden Armen
    else if(i===2){ m.arme[0].rotation.x=-1.1+.9*Math.sin(t*12); m.arme[1].rotation.x=-1.1+.9*Math.sin(t*12+Math.PI); } // spritzt
    else { m.arme[0].rotation.x=-.5+.3*Math.sin(t*2+i); m.arme[1].rotation.x=-.5+.3*Math.sin(t*2+i+2); } }); // plätschert
  B.tropfen.forEach((d,j)=>{ d.visible=!nah; if(nah) return; const f=(t*.9+j/B.tropfen.length)%1, x=Ki.x+(Ma.x-Ki.x)*f*.8+Math.sin(j*7)*.25, z=Ki.z+(Ma.z-Ki.z)*f*.8+Math.cos(j*5)*.25; d.position.set(x,Ki.y+.95+1.1*Math.sin(Math.PI*f),z); }); }
