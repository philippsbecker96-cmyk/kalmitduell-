/* ================= Teufelstisch (Kampagne, Mission 2) – Tiere am Weg =================
   Hundejagd am Anstieg (vom Nutzer): ein Hund verbeißt sich in Friedels Wurstkette und wird mitgeschleift, bis sie reißt (TT_ZIEH, ttZiehHund, ttZiehKette) ·
   Katze auf dem Holzstapel, die halbe Meute biegt ab und kläfft sie an, daneben schimpft die Bäuerin mit dem Besen, die Hunde machen einen Bogen um sie (TT_KATZE, ttKatzeZiel, ttUmFrau) ·
   Pause nach Flucht 1: Vögel in kleinen Laubbäumen und am Wegrand, solange es aufgeklart ist (TT_VOGEL) ·
   Zeiten aus ttHundePlan (ttTierePlan), Aufbau buildTiere aus buildTeufelstischLeben, Bewegung poseTiere aus poseHunde (über sicher) */

const TT_ZIEH={nach:[5,6], dauer:32, min:12, abst:2.1, hub:6.5, glieder:6}; // nach Klau Nr. so viele s · s mitgeschleift (höchstens) · mindestens · m hinter Friedel · alle s kurz angehoben · Glieder der gespannten Kette
const TT_KATZE={nach:[6,10], bell:9, frau:3, gr:1.4}; // nach Klau Nr. so viele s ist Friedel an der Katze · s kläffen die Hunde · Bäuerin so viele m hinter dem Holzstapel · Größe der Katze
const TT_VOGEL={n:5, von:150, bis:60, weg:9, auf:14}; // Plätze zwischen so viele m hinter dem Steintor und so viele m vor der Abzweigung „sicher rechts“ · Vogel im Baum fliegt ab m, am Boden ab m Abstand auf

// ---- Zeiten (aus ttHundePlan, vor den übrigen Zwischenszenen) ----
function ttTierePlan(klau,frei,sz,dt){ const o={}, nh=TT_HUND_FORM.length, ZZ=TT_ZIEH, ZK=TT_KATZE;
  { const t=klau[ZZ.nach[0]].t+ZZ.nach[1], dur=Math.min(ZZ.dauer,dt-ZZ.nach[1]-14), glied=Math.min(6,...TT_KLAU.map(([w,i],n)=>w==='k'&&klau[n].t+.9<=t?i:99))-1; // letztes Glied, das dann noch an der Kette hängt
    if(dur>=ZZ.min&&glied>=0) for(let j=0;j<nh;j++) if(frei(j,t-4,t+dur+TT_HUND.frei)){ o.zieh={t,dur,h:j,glied}; sz.push({art:'zieh',t:t-4,dur:dur+4+TT_HUND.frei,h:j}); break; } }
  { const k=ZK.nach[0], t=klau[k].t+ZK.nach[1]; if(klau[k+1]&&klau[k+1].t-t>ZK.bell+6){ const hs=[]; for(let j=0;j<nh&&hs.length<2;j++) if(frei(j,t-4,t+ZK.bell+12)) hs.push(j);
    if(hs.length){ o.katze={t,hs}; hs.forEach(j=>sz.push({art:'katze',t:t-4,dur:ZK.bell+16,h:j})); } } } // halbe Meute: zwei Hunde
  return o; }

// ---- Aufbau ----
function buildTiere(A,T){ const M=c=>lam(c), add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, wm=M('#94502e');
  // Tauziehen: gespannte Kette zwischen Gepäckträger und Hundemaul, abgerissenes Stück im Maul
  A.zieh={glieder:Array.from({length:TT_ZIEH.glieder},(x,i)=>{ const o=new THREE.Mesh(new THREE.SphereGeometry(.022,8,6),i%2?M('#a0583a'):wm); o.visible=false; o.userData.ohneBoden=true; world.add(o); return o; }), beute:new THREE.Mesh(new THREE.SphereGeometry(.022,8,6),wm)};
  A.zieh.beute.scale.set(2.4,1,1); A.zieh.beute.visible=false;
  // Katze auf dem Holzstapel, Bäuerin mit Besen
  { const st=new THREE.Group(), holz=M('#7a5a3a'), schnitt=M('#c8a878'); st.userData.ohneBoden=true; world.add(st); // Stapel längs zum Weg
    for(const [n,y] of [[4,.13],[3,.37],[2,.6]]) for(let i=0;i<n;i++){ const x=(i-(n-1)/2)*.27, l=add(st,new THREE.CylinderGeometry(.13,.13,1.5,8),holz,x,y,0); l.rotation.x=Math.PI/2; for(const z of [-.75,.75]){ const c=add(st,new THREE.CircleGeometry(.12,8),schnitt,x,y,z*1.002); c.rotation.y=z<0?Math.PI:0; } }
    const K=ttKatze(); K.G.scale.setScalar(TT_KATZE.gr); world.add(K.G);
    const m=trMensch({lang:'#6a4a5a',haar:'#8a6a4a',tuch:'#d8cfc0'}); m.G.userData.ohneBoden=true; world.add(m.G); // Bäuerin mit Kopftuch und Schürze
    add(m.G,new THREE.BoxGeometry(.36,.7,.04),M('#d8d0bc'),0,.85,.27);
    add(m.arme[1],new THREE.CylinderGeometry(.018,.018,1.4,5),M('#6b4a32'),0,-.55,.2).rotation.x=.3; const bs=add(m.arme[1],new THREE.ConeGeometry(.13,.42,8),M('#c8a85a'),0,-1.25,.4); bs.rotation.x=.3+Math.PI; // Reisigbesen
    st.visible=K.G.visible=m.G.visible=false; A.katze={...K, stapel:st, frau:{m}, blase:triBlase(), d:null}; }
  // Vögel: kleine Laubbäume am Weg mit Vögeln auf den Ästen, ein paar picken am Wegrand
  { const To=T.tor, d0=To?To.d+TT_VOGEL.von:null, d1=T.ecke!=null?T.ecke-TT_VOGEL.bis:null; A.voegel=[]; if(d0==null||d1==null||d1<d0+60) return; const q=rng(1717), stamm=M('#5e4836'), laub=[M('#5f8a3a'),M('#73a046')];
    for(let k=0;k<TT_VOGEL.n;k++){ const d=d0+(d1-d0)*(k+.5)/TT_VOGEL.n, sd=k%2?-1:1, Hr=roadW(R,d)/2, p=wegPos(d,sd*(Hr+2.8+q())), G=new THREE.Group(); G.position.set(p.x,bodenY(p.x,p.z)-.1,p.z); G.rotation.y=q()*6; G.userData.ohneBoden=true; world.add(G);
      add(G,new THREE.CylinderGeometry(.09,.14,3.4,7),stamm,0,1.7,0); const sitz=[];
      for(let i=0;i<3;i++){ const a=i/3*Math.PI*2+q(), h=1.9+i*.5, l=1.1+q()*.4, b=new THREE.Group(); b.position.y=h; b.rotation.y=a; G.add(b); const ast=add(b,new THREE.CylinderGeometry(.03,.05,l,5),stamm,0,0,0); ast.rotation.z=-1.15; ast.position.set(Math.sin(1.15)*l/2,Math.cos(1.15)*l/2,0); // Ast schräg nach außen
        G.updateMatrixWorld(true); sitz.push(b.localToWorld(new THREE.Vector3(Math.sin(1.15)*l*.8,Math.cos(1.15)*l*.8+.04,0))); }
      for(let i=0;i<5;i++){ const c=add(G,new THREE.IcosahedronGeometry(.9+q()*.5,0),laub[i%2],(q()-.5)*1.6,3.5+q()*1.1,(q()-.5)*1.6); c.scale.set(1.2,.75,1.2); } // lockere Krone, die Äste darunter bleiben frei
      const arten=['rot','meise','amsel','fink'], vg=[];
      sitz.forEach((s,i)=>{ const v=ttVogel(arten[(k+i)%4]); v.G.position.copy(s); v.G.rotation.y=q()*6; v.p0=s.clone(); v.ry0=v.G.rotation.y; v.baum=true; v.phi=q()*6; vg.push(v); });
      for(let i=0;i<2;i++){ const pp=wegPos(d+(i?2.5:-1.5),sd*(Hr+.4+q()*.5)), v=ttVogel(arten[(k+i+2)%4]); v.G.position.set(pp.x,bodenY(pp.x,pp.z),pp.z); v.G.rotation.y=q()*6; v.p0=v.G.position.clone(); v.ry0=v.G.rotation.y; v.phi=q()*6; vg.push(v); }
      vg.forEach(v=>{ v.G.visible=false; world.add(v.G); }); A.voegel.push({d,sd,vg}); } } }

// Katze (lokal +z nach vorn, Pfoten auf y=0): rot getigert, sitzt mit eingerolltem Schwanz, macht einen Buckel und faucht
function ttKatze(){ const fell=lam('#c8803a'), hell=lam('#efe2cc'), dunkel=lam('#8a5424'), G=new THREE.Group(), K=new THREE.Group(); G.add(K); G.userData.ohneBoden=true;
  const add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, kug=(P,r,m,x,y,z,sx,sy,sz)=>{ const o=add(P,new THREE.SphereGeometry(r,10,8),m,x,y,z); o.scale.set(sx,sy,sz); return o; }, piv=(P,x,y,z)=>{ const g=new THREE.Group(); g.position.set(x,y,z); P.add(g); return g; };
  K.position.y=.2; const rumpf=kug(K,.1,fell,0,0,0,.85,.85,1.6); for(let i=0;i<3;i++) kug(K,.035,dunkel,0,.075,-.08+i*.08,1.6,.4,.6); kug(K,.07,hell,0,-.02,.1,.8,.9,.6); // Rumpf, Streifen, helle Brust
  const ko=piv(K,0,.12,.15); kug(ko,.07,fell,0,0,0,1,.9,.95); kug(ko,.035,hell,0,-.025,.05,1.1,.7,.7); add(ko,new THREE.SphereGeometry(.009,5,4),lam('#d87a8a'),0,-.005,.072);
  const ohren=[-1,1].map(s=>{ const o=piv(ko,s*.04,.05,0); add(o,new THREE.ConeGeometry(.026,.06,4),fell,0,.025,0); o.rotation.z=-s*.25; return o; });
  for(const s of [-1,1]) add(ko,new THREE.SphereGeometry(.012,6,5),lam('#d8c020'),s*.026,.015,.058); for(const s of [-1,1]) add(ko,new THREE.BoxGeometry(.004,.016,.004),lam('#151210'),s*.026,.015,.069); // gelbe Augen mit Schlitzpupillen
  const maul=add(ko,new THREE.BoxGeometry(.03,.012,.01),lam('#9a2a3a'),0,-.04,.06); maul.visible=false; // faucht
  const beine=[[.045,.1],[-.045,.1],[.045,-.11],[-.045,-.11]].map(([x,z])=>{ const o=piv(K,x,-.02,z); add(o,new THREE.CylinderGeometry(.018,.014,.2,6),fell,0,-.1,0); kug(o,.02,hell,0,-.2,.01,1,.6,1.3); return o; });
  let s=piv(K,0,.03,-.15), sw=[]; for(let i=0;i<5;i++){ add(s,new THREE.CylinderGeometry(.014,.018,.07,6),i%2?dunkel:fell,0,.035,0); sw.push(s); const n=piv(s,0,.07,0); s=n; } // Schwanz in Gliedern
  return {G,K,rumpf,ko,ohren,maul,beine,sw}; }
function ttKatzePose(Ka,w,t){ const K=Ka.K; K.rotation.x=-.55*(1-w); K.position.y=.2+.06*w; Ka.rumpf.scale.set(.85+.15*w,.85+.25*w,1.6); // sitzt aufrecht – Buckel mit gesträubtem Fell
  Ka.beine.forEach((b,k)=>{ b.rotation.x=k<2?.55*(1-w):(-1.3+.1*Math.sin(t))*(1-w); b.scale.y=1+.15*w; }); Ka.ko.rotation.x=.55*(1-w)-.1*w+(w>.5?.04*Math.sin(t*20):0);
  Ka.ohren.forEach((o,k)=>o.rotation.x=-.8*w); Ka.maul.visible=w>.5&&Math.sin(t*3)>-.3;
  Ka.sw.forEach((s,k)=>{ s.rotation.x=k?(.35*(1-w)+.05*w):-2.6*(1-w)+(-.2)*w; s.rotation.z=k?.25*(1-w)*Math.sin(t*1.3+k)+.04*w*Math.sin(t*25):0; }); } // Schwanz geringelt – steil hoch und zitternd

// Vogel (lokal +z nach vorn, Füße auf y=0, etwas größer als echt, damit man ihn sieht)
const TT_VOGEL_ART={rot:{k:'#7a6040',b:'#e0703a',sn:'#3a2a1a'}, meise:{k:'#5a8a5a',b:'#e8d040',ko:'#1e2a5a',sn:'#2a2a2a'}, amsel:{k:'#1e1c1a',b:'#262320',sn:'#e8a020'}, fink:{k:'#8a6a4a',b:'#c87a5a',ko:'#5a6a8a',sn:'#9a9a8a'}};
function ttVogel(art){ const A=TT_VOGEL_ART[art], k=lam(A.k), G=new THREE.Group(), B=new THREE.Group(); G.add(B); G.userData.ohneBoden=true; G.scale.setScalar(1.8);
  const add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; };
  add(B,new THREE.SphereGeometry(.045,8,6),k,0,.065,0).scale.set(1,1,1.45); add(B,new THREE.SphereGeometry(.036,8,6),lam(A.b),0,.06,.03).scale.set(1,1,.9); // Rumpf, Brust
  const ko=new THREE.Group(); ko.position.set(0,.11,.05); B.add(ko); add(ko,new THREE.SphereGeometry(.031,8,6),lam(A.ko||A.k),0,0,0); add(ko,new THREE.ConeGeometry(.008,.03,5),lam(A.sn),0,-.004,.04).rotation.x=Math.PI/2;
  for(const s of [-1,1]) add(ko,new THREE.SphereGeometry(.006,4,3),lam('#0a0806'),s*.022,.008,.018);
  add(B,new THREE.BoxGeometry(.035,.008,.07),k,0,.07,-.085).rotation.x=-.35; // Schwanz
  const fl=[-1,1].map(s=>{ const p=new THREE.Group(); p.position.set(s*.035,.085,0); B.add(p); add(p,new THREE.BoxGeometry(.06,.006,.075),k,s*.03,0,0); return p; });
  for(const s of [-1,1]) add(B,new THREE.CylinderGeometry(.003,.003,.03,3),lam('#6a4a2a'),s*.012,.015,0);
  return {G,B,ko,fl}; }

// ---- Tauziehen ----
function ttZiehHund(h,j,P,rt,lauf,t,dt){ const Z=P&&P.zieh; if(!Z||Z.h!==j) return false; const y=rt-Z.t, F=anim.tt.friedel, ZZ=TT_ZIEH; if(y<0||y>Z.dur+TT_HUND.frei) return false;
  const Hl=roadW(R,F.d)/2; let spr=0;
  if(y<=Z.dur){ const hb=y%ZZ.hub, lift=hb>1&&hb<1.7?Math.sin(Math.PI*(hb-1)/.7):0; spr=(y<.5?.5*Math.sin(Math.PI*y/.5):0)+.35*lift+.012*Math.sin(t*37); // springt an die Kette, wird ab und zu kurz angehoben, rumpelt auf dem Hintern
    h.d=F.d-ZZ.abst; h.u=clampN((F.r.lane||0)+.25*Math.sin(t*1.3+j),-Hl,Hl); h.v=h.vs=me.v; const p=wegPos(h.d,h.u); h.G.position.set(p.x,bodenY(p.x,p.z)+spr,p.z); h.px=p.x; h.pz=p.z;
    h.G.rotation.y=h.ry=Math.PI/2-p.h; h.G.rotation.z=.08*Math.sin(t*5.3);
    tfHundHaltung(h,'sitz',t,j); h.K.rotation.x=-.8+.6*lift; h.K.position.y=-.04; for(const k of [0,1]){ h.beine[k].o.rotation.x=.1+.5*lift; h.beine[k].u.rotation.x=0; } // stemmt die Vorderpfoten dagegen
    h.ko.rotation.set(.35+.12*Math.sin(t*17),.3*Math.sin(t*9),0); h.maul.rotation.x=.06; h.zu.visible=false; tfHundSchwanz(h,t,j,.9); return true; }
  const z=y-Z.dur; if(h.d==null) h.d=F.d-ZZ.abst; h.v=z<3?0:Math.max(0,me.v-1.5); h.vs=h.v; h.d+=h.v*lauf; const p=wegPos(h.d,h.u||0); // Kette gerissen: überschlägt sich nach hinten, sitzt mit der Beute da, trabt dann hinterher
  if(z<1){ h.G.rotation.order='YXZ'; spr=.45*Math.sin(Math.PI*z); h.G.rotation.y=h.ry=Math.PI/2-p.h; h.G.rotation.z=0; tfHundHaltung(h,'steh',t,j); h.K.rotation.x=-2*Math.PI*bSm(z); }
  else if(z<3){ tfHundHaltung(h,'sitz',t,j); h.ko.rotation.y=.5*Math.sin(t*14); h.zu.visible=false; }
  else { h.K.rotation.x=0; h.phi+=h.vs/1.3*2*Math.PI*lauf; tfHundLauf(h,Math.min(1,h.vs/3),t,j); h.zu.visible=false; }
  h.G.position.set(p.x,bodenY(p.x,p.z)+spr,p.z); h.px=p.x; h.pz=p.z; return true; }
// Kette straff nach hinten, gespannte Glieder bis ins Hundemaul (nach den Hunden, jeden Frame)
function ttZiehKette(P,rt){ const A=anim.tt, Zs=A.zieh, W=A.friedel.wurst, Z=P&&P.zieh, y=Z?rt-Z.t:-1, an=!!Z&&y>=0&&y<=Z.dur, V=THREE.Vector3; if(!Zs) return;
  if(Zs.g!=null&&(!Z||Zs.g!==Z.glied||y<Z.dur)) W.kette[Zs.g].visible=true; if(Z){ Zs.g=Z.glied; if(y>Z.dur) W.kette[Z.glied].visible=false; } // reißt ab
  const h=Z&&A.hunde[Z.h]; Zs.beute.visible=!!h&&y>Z.dur&&y<Z.dur+TT_HUND.frei; if(Zs.beute.visible&&Zs.beute.parent!==h.maul){ h.maul.add(Zs.beute); Zs.beute.position.set(0,-.005,.12); }
  Zs.glieder.forEach(o=>o.visible=an); if(!an) return;
  W.kette.forEach((g,i)=>{ g.rotation.set(0,0,i?.03:1.35+.05*Math.sin(rt*7)); }); A.friedel.r.g.updateMatrixWorld(true); h.G.updateMatrixWorld(true);
  const E=W.kette[Z.glied].localToWorld(new V(0,-.1,0)), Mp=h.maul.localToWorld(new V(0,0,.1)), dir=Mp.clone().sub(E), L=dir.length(), n=Zs.glieder.length; dir.normalize(); const q=new THREE.Quaternion().setFromUnitVectors(new V(1,0,0),dir);
  Zs.glieder.forEach((o,i)=>{ const f=(i+.5)/n; o.position.copy(E).addScaledVector(dir,L*f); o.position.y-=.06*Math.sin(Math.PI*f); o.quaternion.copy(q); o.scale.set(Math.max(1,L/n/.044*.95),1,1); }); }

// ---- Katze und Bäuerin ----
function ttKatzeZiel(j,P,rt){ const K=P&&P.katze, Ka=anim.tt.katze; if(!K||!Ka||Ka.d==null) return null; const i=K.hs.indexOf(j), y=rt-K.t; if(i<0||y<-3||y>TT_KATZE.bell) return null;
  return {td:Ka.d-1.4+i*1.8, tu:roadW(R,Ka.d)/2+.9+.5*i}; } // rennen vor zur Katze, stehen unten am Holzstapel
function ttUmFrau(d,tu,Hl){ const Ka=anim.tt.katze; if(!Ka||Ka.d==null) return tu; const f=Ka.d+TT_KATZE.frau; return Math.abs(d-f)<6?Math.min(tu,-.4*Hl):tu; } // weichen auf die andere Wegseite aus

// ---- Bewegung (aus poseHunde) ----
function poseTiere(P,rt,run,t,dt){ const A=anim.tt, Ka=A.katze;
  if(Ka){ const K=P&&P.katze; if(!K||!run||rt<K.t-32) Ka.d=null; else if(Ka.d==null&&rt>=K.t-30&&rt<K.t-2) Ka.d=me.d+Math.max(4,me.v)*(K.t-rt)+2; // Holzstapel so weit vorn, dass Friedel zur geplanten Zeit dort ist
    const vis=Ka.d!=null&&me.d<Ka.d+90; Ka.stapel.visible=Ka.G.visible=Ka.frau.m.G.visible=vis;
    if(vis){ const d=Ka.d, Hr=roadW(R,d)/2, hd=headingAt(R,d), y=rt-K.t, ps=wegPos(d,Hr+2.4), ry=Math.PI/2-hd, zumWeg=Math.atan2(Math.sin(hd),-Math.cos(hd)), w=bSm((y+3)/.6)*(1-bSm((y-TT_KATZE.bell-1)/1.5)), H=A.hunde;
      Ka.stapel.position.set(ps.x,bodenY(ps.x,ps.z)-.05,ps.z); Ka.stapel.rotation.y=ry; Ka.G.position.set(ps.x,Ka.stapel.position.y+.73,ps.z);
      const ziel=K.hs.map(j=>H[j].G.position).filter(p=>p.distanceTo(Ka.G.position)<8)[0]; Ka.G.rotation.y=ziel&&w>.3?tfWinkel(Ka.G.rotation.y,Math.atan2(ziel.x-ps.x,ziel.z-ps.z),Math.min(1,dt*5)):zumWeg+.4; ttKatzePose(Ka,w,t); // schaut auf den Weg, faucht den nächsten Hund an
      const pf=wegPos(d+TT_KATZE.frau,Hr+1.2), m=Ka.frau.m, wut=y>-3&&y<TT_KATZE.bell+1; m.G.position.set(pf.x,bodenY(pf.x,pf.z),pf.z);
      const hz=H[K.hs[0]].G.position, zu=wut?Math.atan2(hz.x-pf.x,hz.z-pf.z):zumWeg; m.G.rotation.y=tfWinkel(m.G.rotation.y,zu,Math.min(1,dt*4)); // dreht sich zu den Hunden, sonst schaut sie auf den Weg
      m.arme[1].rotation.x=wut?-1.9+1*Math.sin(t*7):-.2; m.arme[1].rotation.z=wut?.3*Math.sin(t*3.5):0; m.arme[0].rotation.x=wut?-.6+.4*Math.sin(t*7+1):0; m.kopf.rotation.x=wut?.1*Math.sin(t*9):0; // schwingt den Besen
      const sw=wut?.06*Math.sin(t*7):0; m.beine[0].rotation.x=sw; m.beine[1].rotation.x=-sw; } }
  // Vögel: nur in der aufgeklarten Pause nach Flucht 1
  const V=A.voegel; if(!V||!V.length) return; const hell=run&&ttPauseW(rt)<.55, ich=riders3d[myKey];
  V.forEach(S=>{ const nah=hell&&Math.abs(me.d-S.d)<160; S.vg.forEach((v,i)=>{ v.G.visible=nah&&!(v.weg&&rt-v.weg>2.2); if(!nah){ v.weg=null; v.G.position.copy(v.p0); return; } if(!v.G.visible) return;
    const ab=ich?ich.g.position.distanceTo(v.p0):99; if(v.weg==null&&(v.baum?i===0&&ab<TT_VOGEL.weg:ab<TT_VOGEL.auf)) v.weg=rt; if(v.weg!=null&&rt<v.weg) v.weg=null; // einer im Baum und die am Boden fliegen auf
    if(v.weg!=null){ const f=Math.min(1,(rt-v.weg)/2.2), o=S.sd*(6+i), dx=Math.sin(v.ry0+o)*8*f, dz=Math.cos(v.ry0+o)*8*f; v.G.position.set(v.p0.x+dx,v.p0.y+6*f-2*f*f+.3*Math.sin(f*Math.PI),v.p0.z+dz); v.G.rotation.y=v.ry0+o;
      v.fl.forEach((w,k)=>w.rotation.z=(k?-1:1)*(.2+1.1*Math.abs(Math.sin(t*38+i)))); v.B.rotation.x=-.3; return; } // flattert davon
    v.fl.forEach(w=>w.rotation.z=0); v.G.position.copy(v.p0); const ph=t+v.phi;
    if(v.baum){ v.ko.rotation.y=.7*Math.sin(Math.floor(ph*1.3)*2.1); v.G.position.y+=(ph%3.1)<.18?.06*Math.sin((ph%3.1)/.18*Math.PI):0; v.B.rotation.x=0; } // dreht ruckartig den Kopf, hüpft ab und zu
    else { const pk=(ph%1.6)<.35; v.B.rotation.x=pk?.6*Math.sin((ph%1.6)/.35*Math.PI):0; v.ko.rotation.y=pk?0:.5*Math.sin(Math.floor(ph*2)*1.7); v.G.rotation.y=v.ry0+.4*Math.sin(Math.floor(ph/1.6)*2.3); } }); }); } // pickt am Wegrand
