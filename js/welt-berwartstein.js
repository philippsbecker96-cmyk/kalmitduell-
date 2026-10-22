/* ================= Burg Berwartstein: Bach mit Mühle, Kirche in Erlenbach, Felsen im Wald, Burg als Kulisse, Pfälzerwald, Morgennebel =================
   Strecke und Landschaftszonen: berwartsteinDef() in strecke.js · Gelände, Straße, Bäume, Häuser: build3D() in welt-kalmit.js (ruft die Funktionen hier auf) */
const BACH={a:600, b:1320, x:1000}; // Bach neben der Straße: von, bis (m), Querung unter der Holzbrücke
const VB={tor:5528, br:[5490,5524], ml:20, mb:22, ae:62}; // Torturm (m) und Zugbrücke über den Halsgraben; danach Zielgerade über die Turnierwiese · Ringmauer: links, rechts hinten (m neben der Achse), Rückwand (m hinter dem Ziel)
const FEST={s:-1, d0:23, d1:42}; // Bauernfest links am Start: von, bis (m), in der Lücke vor dem ersten Haus
const SCHEUNE={d:33, u:19, L:26, T:12, H:7, F:9};
const FRIEDHOF={d0:-9, d1:12, u0:21, u1:40}; // Friedhof links neben dem Vorlauf, schräg hinter Fest und Scheune: von, bis (m, auch vor dem Start), Abstand vom Gehweg // Zehntscheune hinter dem Fest: Mitte (m), Vorderwand (m neben dem Gehweg), Länge, Tiefe, Wandhöhe, Dachhöhe
// Zusatz-Szenen abschotten: ein Fehler darin lässt nur diese Szene ausfallen (Meldung in der Konsole), die Strecke läuft weiter
const AUS=new Set(); function sicher(name,fn){ if(AUS.has(name)) return; try{ fn(); }catch(e){ AUS.add(name); console.error(`Berwartstein: ${name} ausgefallen`,e); } }
const ZOLL={d:4575, s:-1}; // Zollstation am Übergang Waldweg → Kopfstein, bergseitig (links)
// Leute am Weg [m, Seite, Art, Abstand vom Straßenrand]: Bauern und Bäuerinnen im Dorf und im Tal, Mönche im Wald
const VOLK_WEG=[[80,1,'bauer',.35],[160,-1,'baeuerin',.35],[270,1,'bauer',.35],[330,-1,'baeuerin',.35],[490,1,'bauer',2],[565,-1,'baeuerin',2],[780,-1,'bauer',2],[1170,1,'baeuerin',2.2],[1765,1,'moench',2],[1769,1,'moench',3],[2670,-1,'bauer',2.2],[3620,-1,'moench',2],[4320,1,'baeuerin',2.2]];
const bSm=v=>{ v=Math.min(1,Math.max(0,v)); return v*v*(3-2*v); };
// Abstand des Bachs von der Straßenmitte (positiv = rechts): erst rechts, an der Brücke unter der Straße durch, dann links; an den Enden weg von der Straße
const bachOff=d=>16-32*bSm((d-970)/60)+(d<660?(660-d)*.45:0)-(d>1270?(d-1270)*.6:0)+2.5*Math.sin(d/40)*Math.min(1,Math.abs(d-BACH.x)/60);

// ---- Vorbereitung (beim Streckenbau): Bach, Mühle, Kirche, Felsen, Burgplatz – Bäume und Büsche dort weg ----
function prepBurg(r){ const S=r.S, q=rng(321), rw=d=>roadW(r,d)/2, frei=[]; // frei: [x, y, Radius] ohne Bäume
  const fr=d=>{ const [px,py]=posAt(r,d), h=headingAt(r,d); return {px,py,h,nx:-Math.sin(h),ny:Math.cos(h)}; };
  const B=[]; for(let d=BACH.a; d<=BACH.b; d+=2){ const f=fr(d), o=bachOff(d); B.push({x:f.px+f.nx*o, y:f.py+f.ny*o, d, o}); } r.bach=B;
  const nahBach=(x,y,m)=>{ for(const p of B) if(Math.abs(p.x-x)<m&&Math.abs(p.y-y)<m&&Math.hypot(p.x-x,p.y-y)<m) return true; return false; };
  for(const k of ['tree','rock','bush','block','grass']) S[k]=S[k].filter(o=>!nahBach(o.x,o.y,k==='grass'?3:4.5));
  // Steine im Wasser und Kies am Ufer, Erlen und Weiden am Bach
  r.steine=[]; B.forEach((p,i)=>{ if(i<1||i>=B.length-1) return; const a=B[i-1], b=B[i+1], L=Math.hypot(b.x-a.x,b.y-a.y), vx=-(b.y-a.y)/L, vy=(b.x-a.x)/L;
    for(let k=0;k<2;k++){ const u=(q()-.5)*7; r.steine.push({x:p.x+vx*u, y:p.y+vy*u, s:.2+q()*(Math.abs(u)<2?.35:.5), rot:q()*6, i, inW:Math.abs(u)<2.2}); }
    if(i%5===0 && Math.abs(p.d-BACH.x)>25){ const u=(q()<.5?-1:1)*(4+q()*3.5), x=p.x+vx*u, y=p.y+vy*u; if(Math.abs(Math.hypot(x-fr(p.d).px,y-fr(p.d).py))<rw(p.d)+3) return;
      if(q()<.6) S.tree.push({x, y, s:1.8+q()*1.4, c:q(), pine:false, ht:4+q()*2}); else S.bush.push({x, y, s:.9+q()*.8, c:q(), tree:q()<.3}); } });
  // Mühle bei 850 m auf der Seite weg von der Straße
  { const i=B.findIndex(p=>p.d>=850), p=B[i], a=B[i-1], b=B[i+1], f=fr(p.d), s=Math.sign(p.o)||1; r.muehle={x:p.x, y:p.y, h:Math.atan2(b.y-a.y,b.x-a.x), lx:f.nx*s, ly:f.ny*s, i}; frei.push([p.x+f.nx*s*6,p.y+f.ny*s*6,10]); }
  // Erlenbach: Kirche mit Dorfplatz und Brunnen (rechte Seite, bei 200 m)
  { const d=200, f=fr(d), s=1, geh=zOpt(r,d).geh??SIDEWALK, o=rw(d)+geh+15, at=(da,u)=>{ const g=fr(d+da); return {x:g.px+g.nx*s*(rw(d)+geh+u), y:g.py+g.ny*s*(rw(d)+geh+u), h:g.h, d:d+da}; }, b=at(-9,4.5);
    r.kirche={x:f.px+f.nx*s*o, y:f.py+f.ny*s*o, h:f.h, s, d, bx:b.x, by:b.y}; r.markt=[at(8,5.5),at(13.5,5.8),at(-14.5,6)]; // Brunnen links vor der Kirche, Marktstände auf dem Platz
    S.house=S.house.filter(h=>h.side!==s||Math.abs(h.d-d)>17+h.w/2); for(const k of ['tor','ranke']) S[k]=S[k].filter(h=>h.side!==s||Math.abs(h.d-d)>19); frei.push([r.kirche.x,r.kirche.y,16]); }
  // Erlenbach mittelalterlich: Gassen quer zur Straße, ein Drittel weniger Häuser, die übrigen kleiner und lockerer, viel Fachwerk, Stroh- und Schindeldächer
  { const Z=r.zones.find(z=>z[0]==='ort'), geh=Z[3].geh??SIDEWALK, weg=[]; r.gassen=[];
    for(const [d,s] of [[75,1],[115,-1],[150,0],[250,-1],[275,1],[320,0]]) for(const sd of s?[s]:[-1,1]){ r.gassen.push({d,s:sd,w:3.6,geh,len:20}); weg.push(...S.house.filter(h=>h.side===sd&&Math.abs(h.d-d)<2.4+h.w*.4)); }
    S.house.forEach(h=>{ if(h.d<Z[2]+20&&q()<.5) weg.push(h); }); S.house=S.house.filter(h=>!weg.includes(h));
    for(const k of ['tor','ranke']) S[k]=S[k].filter(t=>!weg.some(h=>h.side===t.side&&Math.abs(h.d-t.d)<h.w/2+3));
    for(const h of S.house){ if(h.d>Z[2]+20) continue; const dep0=h.dep, sh=(dep0-(h.dep*=.82))/2, nx=-Math.sin(h.h)*h.side, ny=Math.cos(h.h)*h.side;
      h.w*=.75+q()*.15; h.hgt*=.88; h.x-=nx*sh; h.y-=ny*sh; h.fw=q()<.75; h.gw=false; if(q()<.5) h.roof=q()<.6?'#a8925c':'#8f7d50'; else if(h.roof==='#6f6f70') h.roof='#9e3a28'; }
    const amHaus=(s,d)=>S.house.filter(h=>h.side===s&&h.su==null&&!h.gs).sort((a,b)=>Math.abs(a.d-d)-Math.abs(b.d-d))[0]||null; // Haus an der Straße, das d am nächsten steht
    r.inschrift=amHaus(-1,290); r.giebel=amHaus(1,164); r.wirt=amHaus(-1,47); // Inschrift links hinter dem Gemüsegarten, Spruch rechts gleich nach der ersten Kurve, Wirtshaus hinter dem Bauernfest – vor allen viel Platz, man sieht die Giebel von weitem
    // zweite Reihe: einzelne Häuser 14–20 m hinter der Straße, am Ende der Gassen und dazwischen (nicht hinter dem Kirchplatz)
    r.hinter=[]; for(const side of [-1,1]) for(let d=Z[1]+22; d<Z[2]-10; d+=24+q()*16){ if(side===1&&Math.abs(d-r.kirche.d)<26) continue; const g=r.gassen.find(G=>G.s===side&&Math.abs(G.d-d)<16), dd=g&&q()<.8?g.d:d;
      const w=6+q()*2.5, dep=6.5+q()*2, f=fr(dd), o=rw(dd)+geh+14+dep/2+q()*6, x=f.px+f.nx*side*o, y=f.py+f.ny*side*o, k=q();
      if(r.hinter.some(H=>Math.hypot(H.x-x,H.y-y)<12)) continue;
      const hh={x, y, w, dep, hgt:4.6+q()*1.2, h:f.h+(q()-.5)*.3, side, wall:q()*6|0, shut:q()*3|0, roof:k<.55?(q()<.6?'#a8925c':'#8f7d50'):'#9e3a28', d:dd, fw:q()<.8, kam:q(), su:40}; S.house.push(hh); r.hinter.push(hh); frei.push([x,y,Math.max(w,dep)/2+2]); if(g&&dd===g.d) g.len=o-dep/2-rw(dd)-.3; } } // Gasse endet vor dem Haus
  // Felsenpfad: freistehende Felstürme, überhängende Wände, Felsentor über dem Weg
  const F={tuerme:[], waende:[], tor:3130}; r.felsen=F;
  [[2865,1],[2985,-1],[3075,1],[3255,-1],[3415,1]].forEach(([d,s])=>{ const f=fr(d), o=rw(d)+7.5+q()*6, rad=2.6+q()*1.8; F.tuerme.push({d, x:f.px+f.nx*s*o, y:f.py+f.ny*s*o, r:rad, hg:12+q()*10, sd:1+q()*1e4|0, hut:q()<.5}); frei.push([f.px+f.nx*s*o, f.py+f.ny*s*o, rad+3]); });
  [[2925,-1,36],[3190,1,44],[3335,-1,30]].forEach(([d,s,len])=>{ F.waende.push({d,s,len,hg:9+q()*4}); for(let a=d-len/2; a<=d+len/2; a+=4){ const f=fr(a), o=rw(a)+6.5; frei.push([f.px+f.nx*s*o, f.py+f.ny*s*o, 5.5]); } });
  // Wegelagerer in der zweiten Kehre (1,9 km), außen am Scheitel – dort fährt man bergauf
  { let best=0, bd=1910; for(let d=1860; d<=1960; d+=2){ const k=Math.abs(angDiff(headingAt(r,d+8),headingAt(r,d-8))); if(k>best){ best=k; bd=d; } }
    const s=-Math.sign(angDiff(headingAt(r,bd+8),headingAt(r,bd-8)))||1; r.raeuber={d:bd, s}; for(const da of [-2.2,0,2.2]){ const f=fr(bd+da), o=rw(bd+da)+2; frei.push([f.px+f.nx*s*o, f.py+f.ny*s*o, 3]); } }
  { const f=fr(F.tor); for(const s of [-1,1]) frei.push([f.px+f.nx*s*(rw(F.tor)+3.5), f.py+f.ny*s*(rw(F.tor)+3.5), 5]); }
  for(const [d,s,,o] of VOLK_WEG) if(o>1){ const f=fr(d), u=rw(d)+o; frei.push([f.px+f.nx*s*u, f.py+f.ny*s*u, 2.5]); }
  // Vorburg: Achsen ab dem Torturm (a Richtung Burg, u nach rechts), Platz von Halsgraben bis hinter den Burgfelsen frei
  { const f=fr(VB.tor), g=fr(r.len-20); r.vb={x:f.px, y:f.py, h:g.h, ex:Math.cos(g.h), ey:Math.sin(g.h), nx:g.nx, ny:g.ny, L:r.len-VB.tor};
    const V=r.vb; for(const k of ['tree','rock','bush','block','konif','grass']) S[k]=S[k].filter(o=>{ const a=(o.x-V.x)*V.ex+(o.y-V.y)*V.ey, u=(o.x-V.x)*V.nx+(o.y-V.y)*V.ny; return !(a>-48&&a<205&&Math.abs(u)<(a<-4?30:44)); }); }
  { const f=fr(ZOLL.d-3), o=rw(ZOLL.d)+5; frei.push([f.px+f.nx*ZOLL.s*o, f.py+f.ny*ZOLL.s*o, 13]); } // Platz für Zollhaus, Karren und Pferd
  // Burg 50 m hinter dem Ziel (Palas-Front 40 m), drumherum die ebene Vorburg
  { const f=fr(r.len); r.burgPos={x:f.px+Math.cos(f.h)*50, y:f.py+Math.sin(f.h)*50, h:f.h}; frei.push([r.burgPos.x,r.burgPos.y,85]); }
  dorfGruen(r,fr,rw); // Lücken im Dorf mit Obstbäumchen und Büschen füllen (welt-dorf.js)
  prepUnterwegs(r,fr,rw,frei); // Plätze für Badehaus, Gänse, Wäscherinnen, Minnesänger, Bettler (welt-unterwegs.js)
  for(const k of ['tree','rock','bush','block','konif']) S[k]=S[k].filter(o=>!frei.some(([x,y,m])=>Math.abs(o.x-x)<m&&Math.abs(o.y-y)<m&&Math.hypot(o.x-x,o.y-y)<m));
  // Bauernfest links am Start: Platz bis 18 m neben der Straße freiräumen (auch Gartenzäune, Grasbüschel)
  { const fp=[], C=SCHEUNE; for(let d=FEST.d0; d<=FEST.d1; d+=3) for(let u=1; u<=18; u+=3){ const f=fr(d), o=rw(d)+(zOpt(r,d).geh??SIDEWALK)+u; fp.push([f.px+f.nx*FEST.s*o, f.py+f.ny*FEST.s*o]); }
    for(let d=C.d-C.L/2-6; d<=C.d+C.L/2+4; d+=3) for(let u=C.u-1; u<=C.u+C.T+5; u+=3){ const f=fr(C.d), g=fr(d), o=rw(C.d)+(zOpt(r,C.d).geh??SIDEWALK)+u; fp.push([g.px+f.nx*FEST.s*o, g.py+f.ny*FEST.s*o]); } // Scheune mit Leiterwagen und Holzstapel
    { const F=FRIEDHOF, f=fr(3), o0=rw(3)+(zOpt(r,3).geh??SIDEWALK); for(let d=F.d0-3; d<=F.d1+3; d+=3) for(let u=F.u0-2; u<=F.u1+3; u+=3){ const a=d-3, o=o0+u; fp.push([f.px+Math.cos(f.h)*a+f.nx*FEST.s*o, f.py+Math.sin(f.h)*a+f.ny*FEST.s*o]); } } // Friedhof (Achse bei 3 m, gerade weitergeführt)
    const zuNah=h=>h.side===FEST.s&&h.su===40&&Math.abs(h.d-C.d)<C.L/2+10; S.house=S.house.filter(h=>!zuNah(h)); r.hinter=r.hinter.filter(h=>!zuNah(h)); // Häuser der zweiten Reihe dort weg
    prepDorf(r,fr,rw); const imFest=o=>fp.some(([x,y])=>Math.hypot(o.x-x,o.y-y)<2.8); for(const k of ['tree','rock','bush','block','konif','zaun','lamp','post','grass']) S[k]=S[k].filter(o=>!imFest(o)); S.tor=S.tor.filter(o=>o.side!==FEST.s||o.d>FEST.d1+2); }
  // Burgwald: der Hang um die Ringmauer dicht bewachsen – Kiefern, Fichten, Buchen und Eichen, dunkles Unterholz, Farne, Felsbrocken; Pfad mit Geländer, Felsnasen, Mauerrest, Reh
  { const V=r.vb, q2=rng(77), W=(a,u)=>({x:V.x+V.ex*a+V.nx*u, y:V.y+V.ey*a+V.ny*u}), AE=V.L+VB.ae, C=r.burgPos;
    const inM=(a,u)=>a>-1&&a<AE+5&&u>-VB.ml-5&&u<VB.mb+5, str=[]; for(let d=VB.br[0]-1300; d<=VB.tor+2; d+=3) str.push(posAt(r,d));
    const anStr=(x,y,m)=>str.some(([px,py])=>Math.abs(px-x)<m&&Math.abs(py-y)<m&&Math.hypot(px-x,py-y)<m);
    // Pfad: an der linken Mauer entlang, dann in Kehren den Hang hinunter; Punkte alle 1,5 m (a, u, Welt)
    const PF=[[2,-27],[40,-28],[62,-36],[44,-47],[72,-57],[58,-68]], pfad=r.burgPfad=[]; for(let i=1;i<PF.length;i++){ const [a0,u0]=PF[i-1], [a1,u1]=PF[i], L=Math.hypot(a1-a0,u1-u0);
      for(let t=0;t<L;t+=1.5){ const a=a0+(a1-a0)*t/L, u=u0+(u1-u0)*t/L, na=(u1-u0)/L, nu=-(a1-a0)/L, sg=nu>0?-1:1; pfad.push({a,u,...W(a,u),ra:a+na*sg*1.3,ru:u+nu*sg*1.3}); } } // ra/ru: Geländer an der Talseite
    r.burgDeko={felsen:[[30,49,4],[86,-50,5],[140,-52,4.5],[176,47,5.5],[205,-20,5],[214,26,4]].map(([a,u,rr])=>({...W(a,u),r:rr})), mauerrest:[[92,52],[104,55]].map(([a,u])=>W(a,u)), stamm:[W(150,36),W(157,31)],
      unterstand:W(62,-71), holz:W(54,-71), reh:(()=>{ const d=VB.br[0]-90, f=fr(d), o=rw(d)+11; return {x:f.px+f.nx*o, y:f.py+f.ny*o, h:f.h}; })()};
    const D=r.burgDeko, ex=(x,y,m)=>pfad.some(p=>Math.hypot(p.x-x,p.y-y)<m)||D.felsen.some(f=>Math.hypot(f.x-x,f.y-y)<f.r+1.5)||Math.hypot(D.reh.x-x,D.reh.y-y)<5||[...D.mauerrest,...D.stamm,D.unterstand,D.holz].some(p=>Math.hypot(p.x-x,p.y-y)<m+5);
    for(let a=-48; a<=240; a+=4.6) for(let u=-92; u<=92; u+=4.6){ const aa=a+(q2()-.5)*3.4, uu=u+(q2()-.5)*3.4, {x,y}=W(aa,uu); if(inM(aa,uu)) continue;
      if(!((aa>-48&&aa<205&&Math.abs(uu)<(aa<-4?30:44))||Math.hypot(x-C.x,y-C.y)<88||(aa<238&&Math.abs(uu)<58))||anStr(x,y,7.5)||ex(x,y,2.6)) continue;
      const k=q2(), c=q2();
      if(k<.3) S.tree.push({x, y, s:2+q2()*1.3, c, pine:true, ht:9+q2()*7}); // Kiefer
      else if(k<.47) S.konif.push({x, y, s:1.8+q2()*1.6, c}); // Fichte, Tanne
      else if(k<.8) S.tree.push({x, y, s:2.2+q2()*1.4, c, pine:false, ht:4, gelb:q2()<.12}); // Buche, Eiche, ein paar schon gelblich
      else S.bush.push({x, y, s:1.2+q2()*1, c, tree:q2()<.4, dk:q2()<.5});
      const ba=aa+(q2()-.5)*4, bu=uu+(q2()-.5)*4, b=W(ba,bu); if(q2()<.75&&!inM(ba,bu)&&!anStr(b.x,b.y,6)&&!ex(b.x,b.y,1.6)) S.bush.push({x:b.x, y:b.y, s:.8+q2()*.9, c:q2()*.4, tree:false, dk:q2()<.55}); // dunkles Unterholz
      if(q2()<.35) S.grass.push({x:x+(q2()-.5)*3, y:y+(q2()-.5)*3, s:1+q2()*.8, c:q2(), r:q2()*6, wood:true}); // Farn
      if(q2()<.06) S.rock.push({x:x+1.8, y:y+1, s:.8+q2()*1.6, rot:q2()*6}); } } }

// ---- Gelände (aus build3D): Bachbett, ebene Vorburg, Halsgraben; liefert je Geländepunkt den Abstand zum Bach (Kiesfarbe), TER.vbw = Anteil Turnierwiese (Wiesenfarbe) ----
function burgGelaende(h,src,dist){ const n=TER.nx, N=h.length, res=TER.res, V=R.vb, vw=TER.vbw=new Float32Array(N), bc=new Float32Array(N).fill(1e9), B=R.bach, CS=10, grid=new Map();
  // Wasserspiegel: unter der Straße, nie über dem Gelände daneben, bachabwärts (zum Dorf) nie ansteigend
  const at=(x,z)=>h[Math.max(0,Math.min(TER.nz-1,Math.round((z-TER.z0)/res)))*n+Math.max(0,Math.min(n-1,Math.round((x-TER.x0)/res)))];
  const WL=B.map(p=>Math.min(roadY(p.d)-1.4, at(p.x,p.y)-.5)); for(let i=WL.length-2;i>=0;i--) WL[i]=Math.min(WL[i],WL[i+1]+.01);
  for(let pass=0;pass<4;pass++) for(let i=1;i<WL.length-1;i++) WL[i]=Math.min(WL[i],(WL[i-1]+WL[i]+WL[i+1])/3); R.bachWl=WL;
  // zweite Häuserreihe in Erlenbach: Gelände unter jedem Haus eben
  for(const H of R.hinter||[]){ const hc=at(H.x,H.y), rr=Math.max(H.w,H.dep)/2+4, i0=Math.floor((H.x-rr-TER.x0)/res), i1=Math.ceil((H.x+rr-TER.x0)/res), j0=Math.floor((H.y-rr-TER.z0)/res), j1=Math.ceil((H.y+rr-TER.z0)/res);
    for(let j=Math.max(0,j0);j<=Math.min(TER.nz-1,j1);j++) for(let i=Math.max(0,i0);i<=Math.min(n-1,i1);i++){ const k=j*n+i, e=Math.hypot(i*res+TER.x0-H.x,j*res+TER.z0-H.y); if(dist[k]>12) h[k]+=(hc-h[k])*bSm((rr-e)/3); } }
  let bx0=1e9,bx1=-1e9,bz0=1e9,bz1=-1e9; B.forEach((p,i)=>{ bx0=Math.min(bx0,p.x); bx1=Math.max(bx1,p.x); bz0=Math.min(bz0,p.y); bz1=Math.max(bz1,p.y); const k=Math.floor(p.x/CS)+','+Math.floor(p.y/CS); (grid.get(k)||grid.set(k,[]).get(k)).push(i); });
  for(let k=0;k<N;k++){ const x=(k%n)*res+TER.x0, z=((k/n)|0)*res+TER.z0;
    // Vorburg: Turnierwiese auf Höhe der Zielgeraden, hinten bis um den Burgfelsen; Schlussrampe außen bleibt unverändert
    const a=(x-V.x)*V.ex+(z-V.y)*V.ey, u=(x-V.x)*V.nx+(z-V.y)*V.ny, sd=src[k]*STEP, w=bSm((a+4)/4)*bSm((220-a)/22)*bSm((66-Math.abs(u))/22);
    if(w>0){ const t=w*(sd>=VB.br[0]-2?1:bSm((dist[k]-12)/25)); h[k]+=(roadY(VB.tor+Math.max(0,Math.min(V.L,a)))-.5-h[k])*t; vw[k]=w*(a>-2&&a<V.L+VB.ae+4&&u>-VB.ml-4&&u<VB.mb+4?1:.15); } // außerhalb der Ringmauer Waldboden
    // Halsgraben vor dem Torturm: 9 m tief, steile Wände; die Straße liegt als Brücke darüber
    if(sd>VB.br[0]-6&&sd<VB.br[1]+4) h[k]-=9*bSm((19-Math.abs(sd-(VB.br[0]+VB.br[1])/2))/5)*bSm((42-dist[k])/10);
    // Bachbett: Sohle 0,8 m unter dem Wasser, Ufer steigt sanft an
    if(x<bx0-45||x>bx1+45||z<bz0-45||z>bz1+45) continue; let best=1e9, bi=-1; const gx=Math.floor(x/CS), gz=Math.floor(z/CS);
    for(let a=-5;a<=5;a++) for(let b=-5;b<=5;b++){ const L=grid.get((gx+a)+','+(gz+b)); if(L) for(const i of L){ const e=Math.hypot(B[i].x-x,B[i].y-z); if(e<best){ best=e; bi=i; } } }
    if(bi<0) continue; bc[k]=best; h[k]=Math.min(h[k], WL[bi]-.8+Math.max(0,best-3)*.3); }
  return bc; }

// ---- Umland: Wiesengrund und runde, bewaldete Pfälzerwald-Kuppen rundherum ----
function buildBurgUmland(plainY,x0,z0,x1,z1){ const cx=(x0+x1)/2, cz=(z0+z1)/2, hx=(x1-x0)/2+520, hz=(z1-z0)/2+520, D=5200, st=80, m=Math.round(2*D/st)+1, pos=new Float32Array(m*m*3), col=new Float32Array(m*m*3), idx=[];
  const cF=new THREE.Color('#2f4a2a'), cF2=new THREE.Color('#45613a'), cW=new THREE.Color('#6f8f45'), cH=new THREE.Color('#aebdc2'), c=new THREE.Color();
  for(let j=0;j<m;j++) for(let i=0;i<m;i++){ const x=cx-D+i*st, z=cz-D+j*st, k=j*m+i, out=Math.hypot(Math.max(0,Math.abs(x-cx)-hx),Math.max(0,Math.abs(z-cz)-hz)), mk=bSm((out-60)/600);
    const nz=.55*vnoise(x/1300+3,z/1300)+.3*vnoise(x/520,z/520+7)+.15*vnoise(x/190,z/190), y=plainY-4+mk*(60+400*Math.pow(nz,1.6));
    pos.set([x,y,z],k*3); c.copy(cF).lerp(cF2,vnoise(x/260,z/260)).lerp(cW,1-bSm((y-plainY)/25)).lerp(cH,.15*bSm(Math.hypot(x-cx,z-cz)/D)); col.set([c.r,c.g,c.b],k*3);
    if(i<m-1&&j<m-1) idx.push(k,k+m,k+1, k+1,k+m,k+m+1); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('color',new THREE.BufferAttribute(col,3)); g.setIndex(idx); g.computeVertexNormals();
  world.add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({vertexColors:true})));
  const pt=canvasTex(512,512,g2=>{ g2.fillStyle='#6f8f45'; g2.fillRect(0,0,512,512); const pal=['#5f8240','#7f9d4f','#8aa656','#3d5a32'];
    for(let i=0;i<220;i++){ g2.fillStyle=pal[i%4]; g2.globalAlpha=.5; g2.beginPath(); g2.arc(Math.random()*512,Math.random()*512,6+Math.random()*30,0,7); g2.fill(); } });
  pt.wrapS=pt.wrapT=THREE.RepeatWrapping; pt.repeat.set(14,14);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(14000,14000), new THREE.MeshLambertMaterial({map:pt})); pl.rotation.x=-Math.PI/2; pl.position.set(cx, plainY-.5, cz); world.add(pl); }

// ---- Bausteine ----
// Walmdach: First längs x (bei w > d), alle vier Seiten geneigt; bei w = d Zeltdach (Turm)
function walmGeo(w,d,h){ const r=Math.max(0,(w-d)/2), A=[-w/2,0,d/2], B=[w/2,0,d/2], C=[w/2,0,-d/2], D=[-w/2,0,-d/2], E=[-r,h,0], F=[r,h,0];
  const tri=[A,B,F, A,F,E, C,D,E, C,E,F, D,A,E, B,C,F], p=new Float32Array(tri.length*3), uv=new Float32Array(tri.length*2);
  tri.forEach((v,i)=>{ p.set(v,i*3); uv.set([(i<12?v[0]:v[2])/2, (Math.abs(i<12?v[2]:v[0])/2+v[1]*.6)],i*2); });
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.computeVertexNormals(); return g; }
// Roter Buntsandstein mit waagrechten Schichten und Rillen (Felsen)
function felsTex(){ const t=canvasTex(64,128,g=>{ g.fillStyle='#b06c52'; g.fillRect(0,0,64,128); let y=0;
    while(y<128){ const hh=3+Math.random()*9; g.fillStyle=['#a65f47','#bb7658','#9c573f','#c4846a','#b36d50'][Math.random()*5|0]; g.fillRect(0,y,64,hh); g.fillStyle='rgba(60,25,15,.4)'; g.fillRect(0,y+hh-1.2,64,1.2); y+=hh; }
    for(let i=0;i<60;i++){ g.fillStyle=Math.random()<.5?'rgba(240,200,170,.14)':'rgba(70,40,30,.14)'; g.fillRect(Math.random()*64,Math.random()*128,2+Math.random()*6,1); } });
  t.wrapS=t.wrapT=THREE.RepeatWrapping; return t; }
// Sandstein-Quader mit Fenstern [x, y, b, h] im 256er-Raster (Burg, Mühle, Brücke)
function burgQuader(fen=[],hell=false){ return canvasTex(256,256,g=>{ g.fillStyle=hell?'#c99a78':'#b8755a'; g.fillRect(0,0,256,256);
  for(let y=0;y<256;y+=16) for(let x=(y/16%2)*20-20;x<256;x+=40){ g.fillStyle=`hsl(${12+Math.random()*12},${(hell?26:32)+Math.random()*12}%,${(hell?56:46)+Math.random()*12}%)`; g.fillRect(x+1,y+1,38,14); }
  for(const [x,y,w,h] of fen){ g.fillStyle='#dcb894'; g.fillRect(x-4,y-4,w+8,h+8); g.fillStyle='#2b2a2e'; g.fillRect(x,y,w,h); g.fillStyle='#dcb894'; g.fillRect(x+w/2-1.5,y,3,h); g.fillRect(x,y+h*.42,w,3); } }); }

// Pfälzer Löwe: goldener, steigender Löwe mit roter Krone, Zunge und Krallen, Blick nach links (in einem 100er-Feld)
function loewe(g,x,y,s){ const gold='#e8b423', rot='#d0261d'; g.save(); g.translate(x,y); g.scale(s/100,s/100); g.translate(-50,-50); g.lineCap='round'; g.lineJoin='round'; g.strokeStyle=gold; g.fillStyle=gold;
  const L=(P,lw)=>{ g.lineWidth=lw; g.beginPath(); g.moveTo(...P[0]); for(const p of P.slice(1)) g.lineTo(...p); g.stroke(); };
  L([[52,42],[38,40],[26,46]],7); L([[54,52],[40,60],[30,66]],7); L([[58,74],[50,84],[40,94]],8); L([[64,72],[70,84],[80,94]],8); // Pranken erhoben, Hinterbeine
  g.lineWidth=5; g.beginPath(); g.moveTo(66,76); g.bezierCurveTo(92,72,72,42,88,30); g.stroke(); g.beginPath(); g.arc(89,27,6,0,7); g.fill(); // Schwanz mit Quaste
  g.beginPath(); g.ellipse(58,58,13,24,-.4,0,7); g.fill();
  g.beginPath(); for(let i=0;i<=20;i++){ const a=i/20*Math.PI*2, r=i%2?11:17; g.lineTo(44+Math.cos(a)*r,30+Math.sin(a)*r); } g.fill(); // Mähne
  g.beginPath(); g.arc(40,28,10,0,7); g.fill(); g.beginPath(); g.ellipse(31,32,7,5,.2,0,7); g.fill();
  g.fillStyle=rot; g.beginPath(); g.moveTo(26,35); g.lineTo(17,41); g.lineTo(26,38); g.fill(); // Zunge
  g.beginPath(); g.moveTo(32,18); g.lineTo(34,9); g.lineTo(38,15); g.lineTo(41,7); g.lineTo(44,15); g.lineTo(48,9); g.lineTo(49,19); g.closePath(); g.fill(); // Krone
  g.strokeStyle=rot; g.lineWidth=1.8; for(const [px,py] of [[26,46],[30,66],[40,94],[80,94]]) for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(px,py); g.lineTo(px-4,py+k*3); g.stroke(); }
  g.fillStyle='#111'; g.beginPath(); g.arc(37,26,1.7,0,7); g.fill(); g.restore(); }
// Löwenfahne: schwarz mit goldenem Rand; lang = hängendes Banner mit Schwalbenschwanz
function loewenTex(w,h,lang){ return canvasTex(w,h,g=>{ g.beginPath(); if(lang){ g.moveTo(0,0); g.lineTo(w,0); g.lineTo(w,h); g.lineTo(w/2,h*.86); g.lineTo(0,h); } else g.rect(0,0,w,h); g.closePath();
  g.fillStyle='#e2b33a'; g.fill(); g.save(); g.clip(); g.fillStyle='#141414'; g.fillRect(w*.07,h*.05,w*.86,h*(lang?.8:.9)); g.restore(); loewe(g,w/2,h*(lang?.42:.5),Math.min(w,h)*.82); }); }
// Wappenschilde: 0 Pfälzer Löwe, 1 weiß-blaue Rauten, 2 rotes Kreuz, 3 rot-weiß geteilt
function schildTex(v){ return canvasTex(128,160,g=>{ const pf=()=>{ g.beginPath(); g.moveTo(8,8); g.lineTo(120,8); g.lineTo(120,70); g.quadraticCurveTo(118,135,64,154); g.quadraticCurveTo(10,135,8,70); g.closePath(); };
  pf(); g.fillStyle=['#141414','#f4f4f0','#f4f4f0','#c62f24'][v]; g.fill(); g.save(); pf(); g.clip();
  if(v===0) loewe(g,64,76,118); if(v===1){ g.fillStyle='#2a6fc0'; for(let y=-20;y<170;y+=24) for(let x=-20;x<150;x+=24){ g.beginPath(); g.moveTo(x+(y/24%2?12:0),y); g.lineTo(x+12+(y/24%2?12:0),y+12); g.lineTo(x+(y/24%2?12:0),y+24); g.lineTo(x-12+(y/24%2?12:0),y+12); g.fill(); } }
  if(v===2){ g.fillStyle='#c62f24'; g.fillRect(52,0,24,160); g.fillRect(0,52,128,24); } if(v===3){ g.fillStyle='#f4f4f0'; g.fillRect(64,0,64,160); } g.restore();
  pf(); g.strokeStyle='#e2b33a'; g.lineWidth=6; g.stroke(); }); }
// Streifenstoff (Zelte, Baldachin, Schranke): senkrecht oder waagrecht
function streifenTex(F,n,senk){ const t=canvasTex(64,64,g=>{ const k=64/n; for(let i=0;i<n;i++){ g.fillStyle=F[i%F.length]; senk?g.fillRect(i*k,0,k,64):g.fillRect(0,i*k,64,k); } }); t.wrapS=t.wrapT=THREE.RepeatWrapping; if(senk) t.repeat.set(3,1); return t; }
// Brüstung mit Wimpelfries
function friesTex(){ const t=canvasTex(256,32,g=>{ g.fillStyle='#4e3626'; g.fillRect(0,0,256,32); const F=['#c62f24','#1f4e8c','#e2b33a'];
  for(let i=0;i<16;i++){ g.fillStyle=F[i%3]; g.beginPath(); g.moveTo(i*16,2); g.lineTo(i*16+16,2); g.lineTo(i*16+8,22); g.fill(); } }); t.wrapS=THREE.RepeatWrapping; t.repeat.set(4,1); return t; }
// Sprechblase: weiß mit dunklem Rand und Spitze nach unten, Text kursiv und umbrochen
// Frakturschrift (UnifrakturMaguntia): Textur sofort zeichnen und neu zeichnen, sobald die Schrift geladen ist
function frakturTex(w,h,draw){ const t=canvasTex(w,h,draw); if(document.fonts&&document.fonts.load) document.fonts.load('40px UnifrakturMaguntia').then(()=>{ const g=t.image.getContext('2d'); g.clearRect(0,0,w,h); draw(g,w,h); t.needsUpdate=true; }).catch(()=>{}); return t; }
const FRAKTUR='"UnifrakturMaguntia", Georgia, serif';
// Sprechblase als Pergament: gelbliches Papier mit dunklem Rand, Spitze nach unten, Text in Fraktur; deko(g) zeichnet zusätzlich etwas aufs Papier
// Mehr als drei Zeilen: die Blase wird je Zeile 44 px höher (t.hf = Höhe/190, damit Sprites ihr Seitenverhältnis anpassen können)
function blaseTex(txt,deko){ const zeilen=g=>{ g.font='38px '+FRAKTUR; const Z=[]; let z=''; for(const w of txt.split(' ')){ const t=z?z+' '+w:w; if(g.measureText(t).width>(deko?340:450)&&z){ Z.push(z); z=w; } else z=t; } Z.push(z); return Z; };
  const E=Math.max(0,zeilen(document.createElement('canvas').getContext('2d')).length-3)*44, H=190+E;
  const t=frakturTex(512,H,g=>{ const gr=g.createRadialGradient(256,72+E/2,20,256,72+E/2,280+E/2); gr.addColorStop(0,'#f4e6c4'); gr.addColorStop(.65,'#e8d3a2'); gr.addColorStop(1,'#c9a86a'); const u=142+E;
  g.fillStyle=gr; g.strokeStyle='#7a5530'; g.lineWidth=5; g.beginPath(); g.moveTo(22,10); for(let x=22;x<=490;x+=24) g.lineTo(x,8+Math.sin(x*.7)*2.5); g.quadraticCurveTo(506,10,504,40); g.lineTo(504,u-24); g.quadraticCurveTo(506,u,480,u);
  g.lineTo(286,u); g.lineTo(256,u+40); g.lineTo(242,u); g.lineTo(32,u); g.quadraticCurveTo(6,u,8,u-26); g.lineTo(8,38); g.quadraticCurveTo(6,10,22,10); g.closePath(); g.fill(); g.stroke();
  g.fillStyle='rgba(120,80,30,.12)'; for(let i=0;i<40;i++){ g.beginPath(); g.arc(20+Math.random()*472,16+Math.random()*(120+E),2+Math.random()*7,0,7); g.fill(); } // Flecken
  if(deko) deko(g); // z. B. Notenschlüssel (Minnesänger), Text dann schmaler
  g.fillStyle='#3b2412'; g.textAlign='center'; g.textBaseline='middle'; const Z=zeilen(g); Z.forEach((l,i)=>g.fillText(l,256,76+E/2+(i-(Z.length-1)/2)*44)); }); t.hf=H/190; return t; }
// Warnkasten oben im Bild (Pergament, siehe css/style.css), blendet nach ein paar Sekunden aus
function warnKasten(txt){ let el=document.getElementById('pergament'); if(!el){ el=document.createElement('div'); el.id='pergament'; document.body.appendChild(el); }
  el.textContent=txt; el.classList.add('zeig'); clearTimeout(warnKasten.t); warnKasten.t=setTimeout(()=>el.classList.remove('zeig'),4000); }
// Zielbanner: Stoff mit „ZIEL“ und zwei kleinen Löwen
function zielTex(){ return canvasTex(512,96,g=>{ g.fillStyle='#efe4c8'; g.fillRect(0,0,512,96); g.strokeStyle='#9b1b1b'; g.lineWidth=10; g.strokeRect(5,5,502,86);
  g.fillStyle='#141414'; g.fillRect(14,14,68,68); g.fillRect(430,14,68,68); loewe(g,48,48,62); loewe(g,464,48,62);
  g.fillStyle='#7a1414'; g.font='700 64px Georgia, "Times New Roman", serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('ZIEL',256,52); }); }

// ---- Drache: rot mit goldenem Bauch, Hörner, Rückenzacken, Pfeilschwanz, Flughäute; blickt nach +z, etwa 15 m lang und 14 m Spannweite ----
function drachenModell(){ const D=new THREE.Group(), K=new THREE.Group(); D.add(K); const rot=lam('#b3201a'), dunkel=lam('#7a1410'), gold=lam('#e0a040'), horn=lam('#e8dcc0');
  const kugel=(r,m,x,y,z,sx=1,sy=1,sz=1,P=K)=>{ const o=new THREE.Mesh(new THREE.SphereGeometry(r,12,9),m); o.position.set(x,y,z); o.scale.set(sx,sy,sz); P.add(o); return o; };
  const kegel=(r,h,m,x,y,z,rx,P=K)=>{ const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,6),m); o.position.set(x,y,z); o.rotation.x=rx; P.add(o); return o; };
  kugel(1,rot,0,0,0,1.1,1,2.6); kugel(1,gold,0,-.28,.1,.95,.78,2.35); // Rumpf, Bauch
  for(let i=0;i<5;i++){ const t=i/4; kugel(.56-.12*t,rot,0,.5+t*2.1,2.2+t*1.9); kugel(.45-.1*t,gold,0,.3+t*2.1,2.35+t*1.95,1,.8,1); } // Hals
  const kopf=new THREE.Group(); kopf.position.set(0,2.85,4.4); kopf.rotation.order='YXZ'; K.add(kopf); // erst nicken, dann drehen (Zielen)
  const sch=new THREE.Mesh(new THREE.BoxGeometry(.75,.6,1.05),rot); kopf.add(sch); const sn=new THREE.Mesh(new THREE.BoxGeometry(.52,.36,.95),rot); sn.position.set(0,-.06,.9); kopf.add(sn);
  const kiefer=new THREE.Group(); kiefer.position.set(0,-.28,.25); kopf.add(kiefer); const kf=new THREE.Mesh(new THREE.BoxGeometry(.46,.12,1.15),dunkel); kf.position.z=.6; kiefer.add(kf);
  for(const s of [-1,1]){ kegel(.09,1,horn,s*.24,.42,-.45,-2.2,kopf); kegel(.06,.5,horn,s*.38,.25,-.2,-2.0,kopf); kugel(.08,new THREE.MeshBasicMaterial({color:'#ffd23a'}),s*.33,.16,.3,1,.7,1,kopf); } // Hörner, gelbe Augen
  for(let i=0;i<4;i++) kegel(.08,.28,horn,0,-.23,.55+i*.2,Math.PI,kopf).scale.z=.6; // Zähne
  const maul=new THREE.Object3D(); maul.position.set(0,-.12,1.45); kopf.add(maul);
  for(let i=0;i<9;i++) kegel(.18,.6,dunkel,0,1.0-Math.abs(i-4)*.05,1.6-i*.55,-.4); for(let i=0;i<4;i++) kegel(.13,.42,dunkel,0,.5+i*.5,2.5+i*.5,-.5); // Rückenzacken
  const schw=[]; let P=K; for(let i=0;i<9;i++){ const g=new THREE.Group(); g.position.z=i?-.7:-2.3; P.add(g); kugel(.48-i*.045,rot,0,0,-.35,1,1,1.25,g); if(i%2===0) kegel(.08,.3,dunkel,0,.42-i*.04,-.35,-.4,g); schw.push(g); P=g; }
  const sp=new THREE.Mesh(new THREE.ConeGeometry(.42,.9,4),dunkel); sp.rotation.x=-Math.PI/2; sp.scale.y=.25; sp.position.z=-1.1; P.add(sp); // Pfeilspitze
  const haut=new THREE.MeshLambertMaterial({color:'#c22a20',side:THREE.DoubleSide,transparent:true,opacity:.94}), fluegel=[];
  for(const s of [-1,1]){ const W=new THREE.Group(); W.position.set(s*.8,.75,.7); K.add(W); const A=[s*3,.45,-.4], F=[[s*7.2,.25,-1.6],[s*6.1,-.1,-3.3],[s*4.1,-.3,-4.3]], B=[s*.2,0,-2.6], O=[0,0,0];
    const kn=(a,b,r)=>{ const c=cyl(r,dunkel); place(c,a,b); W.add(c); }; kn(O,A,.11); for(const f of F) kn(A,f,.06); kegel(.1,.5,horn,A[0],A[1]+.25,A[2],0,W); // Knochen, Daumenkralle
    const pts=[A,F[0],F[1], A,F[1],F[2], A,F[2],B, A,B,O].flat(), g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(pts),3)); g.computeVertexNormals(); W.add(new THREE.Mesh(g,haut)); fluegel.push({W,s}); }
  const beine=[]; for(const [x,z] of [[.7,1.3],[-.7,1.3],[.8,-1.4],[-.8,-1.4]]){ const B=new THREE.Group(); B.position.set(x,-.55,z); K.add(B); const c=cyl(.17,rot,.12); place(c,[0,0,0],[0,-1.25,.15]); B.add(c);
    for(const dx of [-.12,0,.12]) kegel(.05,.25,horn,dx,-1.3,.35,Math.PI/2,B); beine.push(B); }
  return {D,K,kopf,kiefer,maul,schw,fluegel,beine}; }
// ---- Rabe: schwarz, schlagende Flügel, blickt nach +z ----
function rabeModell(){ const G=new THREE.Group(), sw=lam('#141418'), sn=lam('#2a2a2e'), b=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),sw); b.scale.set(.7,.6,1.4); G.add(b);
  const k=new THREE.Mesh(new THREE.SphereGeometry(.15,8,6),sw); k.position.set(0,.1,.36); G.add(k); const s=new THREE.Mesh(new THREE.ConeGeometry(.05,.22,5),sn); s.rotation.x=Math.PI/2; s.position.set(0,.08,.56); G.add(s);
  const sz=new THREE.Mesh(new THREE.BoxGeometry(.24,.03,.32),sw); sz.position.set(0,0,-.45); G.add(sz); const F=[];
  for(const x of [-1,1]){ const W=new THREE.Group(); W.position.set(x*.12,.08,0); G.add(W); const f=new THREE.Mesh(new THREE.BoxGeometry(.9,.02,.36),sw); f.position.x=x*.45; W.add(f); F.push({W,s:x}); }
  G.scale.setScalar(1.6); return {G,F}; }
// ---- Aufbau (aus build3D) ----
function buildBurg(){ AUS.clear(); const B=R.bach, WL=R.bachWl, m4=new THREE.Matrix4(), qq=new THREE.Quaternion(), sc=new THREE.Vector3(), ps=new THREE.Vector3(), cc=new THREE.Color(), up=new THREE.Vector3(0,1,0), eu=new THREE.Euler();
  const inst=(geo,mat,list,fn)=>{ if(!list.length) return null; const im=new THREE.InstancedMesh(geo,mat,list.length);
    list.forEach((o,i)=>{ cc.set('#ffffff'); fn(o,i); m4.compose(ps,qq,sc); im.setMatrixAt(i,m4); im.setColorAt(i,cc); }); im.instanceMatrix.needsUpdate=true; if(im.instanceColor) im.instanceColor.needsUpdate=true; world.add(im); return im; };
  const box=(P,w,h,d,mat,x,y,z,ry=0)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); o.position.set(x,y,z); o.rotation.y=ry; P.add(o); return o; };
  const rw=d=>roadW(R,d)/2, fr=d=>{ const [px,py]=posAt(R,d), h=headingAt(R,d); return {px,py,h,nx:-Math.sin(h),ny:Math.cos(h)}; };
  const A=anim.burg={drache:null, raben:[], flucht:0, nebel:[], rad:null, wasser:null, burg:null, leute:[], fahnen:[], flammen:[], winker:[], volk:null, raeuber:null, schuetze:null, rauch:[], ferkel:null, schmied:null, huehner:[], pferde:[]};
  const holz=lam('#6b4a32'), holzD=lam('#4e3626'), dach=hMat('burgDach',()=>{ const t=dachTex('#a8442c'); t.wrapS=t.wrapT=THREE.RepeatWrapping; return new THREE.MeshLambertMaterial({map:t, side:THREE.DoubleSide}); });
  const sand=new THREE.MeshLambertMaterial({map:burgQuader()}), FT=felsTex(), fels=new THREE.MeshLambertMaterial({map:FT});

  // ---------- Bach: fließendes Wasser, Steine, Holzbrücke an der Querung ----------
  { const wt=canvasTex(64,128,g=>{ g.fillStyle='#6d8f93'; g.fillRect(0,0,64,128); for(let i=0;i<80;i++){ g.fillStyle=Math.random()<.5?'rgba(230,240,240,.25)':'rgba(40,60,65,.2)'; g.fillRect(Math.random()*64,Math.random()*128,4+Math.random()*14,1.5); } });
    wt.wrapS=wt.wrapT=THREE.RepeatWrapping; const n=B.length, p=new Float32Array(n*6), uv=new Float32Array(n*4), id=[];
    B.forEach((o,i)=>{ const a=B[Math.max(0,i-1)], b=B[Math.min(n-1,i+1)], L=Math.hypot(b.x-a.x,b.y-a.y)||1, vx=-(b.y-a.y)/L, vy=(b.x-a.x)/L, w=2+.4*Math.sin(o.d/23);
      p.set([o.x-vx*w, WL[i], o.y-vy*w, o.x+vx*w, WL[i], o.y+vy*w], i*6); uv.set([0,o.d/6,1,o.d/6],i*4); if(i<n-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setAttribute('uv',new THREE.BufferAttribute(uv,2)); geo.setIndex(id); geo.computeVertexNormals();
    world.add(new THREE.Mesh(geo, new THREE.MeshPhongMaterial({map:wt, specular:0x9fb4b8, shininess:60, transparent:true, opacity:.88, side:THREE.DoubleSide}))); A.wasser=wt;
    inst(new THREE.DodecahedronGeometry(1,0), lam('#fff'), R.steine, o=>{ ps.set(o.x, o.inW?WL[o.i]-.12:terrainAt(o.x,o.y)+o.s*.2, o.y); qq.setFromAxisAngle(up,o.rot); sc.set(o.s*1.3,o.s*.6,o.s); cc.set(['#9c948a','#8a8278','#b0a597','#a08a78'][o.i%4]); });
    // Holzbrücke: Sandstein-Widerlager an beiden Ufern, Längsbalken, Geländer mit Andreaskreuzen
    let ic=0; B.forEach((o,i)=>{ if(Math.abs(o.o)<Math.abs(B[ic].o)) ic=i; }); const d=B[ic].d, f=fr(d), tx=Math.cos(f.h), tz=Math.sin(f.h), w=rw(d);
    const at=(a,u,y)=>[f.px+tx*a+f.nx*u, y, f.py+tz*a+f.ny*u], G=new THREE.Group(); world.add(G);
    for(const a of [-5,5]){ const [x,y,z]=at(a,0,roadY(d+a)-1.7); box(G,1.6,3.2,w*2+1.4,sand,x,y,z,-f.h); }
    for(const s of [-1,1]){ const [x,y,z]=at(0,s*(w+.15),roadY(d)-.2); const bm=box(G,11.5,.5,.35,holzD,x,y,z); bm.rotation.set(0,-f.h,Math.atan(gradeAt(d)/100),'YXZ');
      for(let a=-5.4;a<=5.5;a+=1.8){ const [px,py,pz]=at(a,s*(w+.3),roadY(d+a)+.65); box(G,.14,1.1,.14,holz,px,py,pz,-f.h); }
      for(const yy of [1.15,.55]){ const [rx,ry,rz]=at(0,s*(w+.3),roadY(d)+yy+.05); const rl=box(G,11.2,.12,.1,holz,rx,ry,rz); rl.rotation.set(0,-f.h,Math.atan(gradeAt(d)/100),'YXZ'); }
      for(let a=-4.5;a<=4.6;a+=1.8) for(const k of [-1,1]){ const [cx,cy,cz]=at(a,s*(w+.3),roadY(d+a)+.85); const kr=box(G,1.9,.08,.07,holz,cx,cy,cz); kr.rotation.set(0,-f.h,k*.32,'YXZ'); } } }

  // ---------- Mühle mit Wasserrad und Zulaufrinne ----------
  { const M=R.muehle, wl=WL[M.i], G=new THREE.Group(); G.position.set(M.x,wl,M.y); G.rotation.y=-M.h; world.add(G);
    const s=Math.sign(-Math.sin(M.h)*M.lx+Math.cos(M.h)*M.ly)||1, hx=M.x+M.lx*6.6, hz=M.y+M.ly*6.6, gy=terrainAt(hx,hz)-wl; // s: lokale z-Seite weg von der Straße
    box(G,10,5.4,8,sand,0,gy+.7,s*6.6); // Bruchsteinsockel bis unters Gelände
    box(G,10,3.2,8,glowMat(fachTex(true)),0,gy+3.4+1.6,s*6.6);
    const rf=new THREE.Mesh(walmGeo(11.2,9.2,4.6),dach); rf.position.set(0,gy+6.6,s*6.6); G.add(rf);
    const W=new THREE.Group(); W.position.set(-1,1.8,s*1.6); G.add(W); const spin=new THREE.Group(); W.add(spin); A.rad=spin;
    for(const z of [-.45,.45]){ const ring=new THREE.Mesh(new THREE.TorusGeometry(2.8,.12,6,28),holzD); ring.position.z=z; spin.add(ring); }
    for(let i=0;i<12;i++){ const a=i/12*Math.PI*2, pd=new THREE.Mesh(new THREE.BoxGeometry(.12,.95,1.05),holz); pd.position.set(Math.cos(a)*2.45,Math.sin(a)*2.45,0); pd.rotation.z=a+Math.PI/2; spin.add(pd);
      const sp=new THREE.Mesh(new THREE.BoxGeometry(2.8,.1,.1),holzD); sp.position.set(Math.cos(a)*1.4,Math.sin(a)*1.4,0); sp.rotation.z=a; spin.add(sp); }
    const ax=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,3.4,8),holzD); ax.rotation.x=Math.PI/2; ax.position.z=s*1.2; W.add(ax);
    box(G,9,.5,.8,holz,3.6,1.8+2.95+.3,s*1.6); for(const x of [2.4,5,7.6]) box(G,.2,5.4,.2,holzD,x,1.8+2.95-2.6,s*1.6); } // Rinne von bachaufwärts aufs Rad

  // ---------- Erlenbach: Kirche mit Turm, Dorfplatz mit Brunnen ----------
  { const K=R.kirche, gy=Math.min(terrainAt(K.x,K.y),roadY(K.d)+.15), G=new THREE.Group(); G.position.set(K.x,gy,K.y); G.rotation.y=Math.atan2(-Math.sin(K.h)*-K.s, Math.cos(K.h)*-K.s); world.add(G); // Turm zur Straße
    const putz=lam('#ebe3d1'), dunkel=lam('#3a3a40');
    box(G,9,10,17,putz,0,3,-2); const rf=new THREE.Mesh(dachGeo(17,9,17.8,10,5),[dach,putz]); rf.rotation.y=Math.PI/2; rf.position.set(0,8,-2); G.add(rf);
    for(const x of [-4.55,4.55]) for(const z of [-7,-2.5,2]) box(G,.1,2.4,1,dunkel,x,4.8,z);
    box(G,4.6,20,4.6,putz,0,8,7.8); const sp=new THREE.Mesh(new THREE.ConeGeometry(3.5,10,4),dach); sp.rotation.y=Math.PI/4; sp.position.set(0,23,7.8); G.add(sp);
    box(G,1.6,2.6,.1,lam('#5a3a26'),0,1.3,10.12); for(const y of [9,14]) box(G,.9,1.4,.1,dunkel,0,y,10.12);
    const by=roadY(K.d)+.2, b=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.6,.8,8),sand); b.position.set(K.bx,by+.4,K.by); world.add(b);
    const wa=new THREE.Mesh(new THREE.CylinderGeometry(1.32,1.32,.05,16),new THREE.MeshPhongMaterial({color:'#6d8f93',shininess:60})); wa.position.set(K.bx,by+.72,K.by); world.add(wa);
    const sl=new THREE.Mesh(new THREE.CylinderGeometry(.22,.26,2.2,8),sand); sl.position.set(K.bx,by+1.5,K.by); world.add(sl);
    const kg=new THREE.Mesh(new THREE.SphereGeometry(.32,8,6),sand); kg.position.set(K.bx,by+2.7,K.by); world.add(kg);
    // Inschrift auf der Giebelwand des hohen Fachwerkhauses links hinter dem Gemüsegarten (zum Start hin): rote und schwarze Fraktur mit Rankenrahmen
    { const H=R.inschrift; if(H){ const tx=Math.cos(H.h), tz=Math.sin(H.h), b=Math.min(H.dep*.85,7), hh=Math.min(H.hgt*.62,3.6);
      const t=frakturTex(512,256,g=>{ g.fillStyle='#efe6d0'; g.fillRect(0,0,512,256); g.strokeStyle='#8a2a1a'; g.lineWidth=6; g.strokeRect(12,12,488,232); g.strokeStyle='#4f7a3a'; g.lineWidth=3;
        for(let x=24;x<490;x+=26) for(const y of [12,244]){ g.beginPath(); g.arc(x,y+(y<100?7:-7),6,0,Math.PI*(y<100?1:-1),y>100); g.stroke(); } // Ranken oben und unten
        g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#9b1b1b'; g.font='58px '+FRAKTUR; g.fillText('Gott zum Gruße!',256,70,470);
        g.fillStyle='#2a1a10'; g.font='40px '+FRAKTUR; g.fillText('Wer die Burg will sehn,',256,140,470); g.fillText('muss die Pedale drehn.',256,190,470); });
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(b,hh),new THREE.MeshLambertMaterial({map:t})); pl.position.set(H.x-tx*(H.w/2+.06), roadY(H.d)+.15+H.hgt*.52, H.y-tz*(H.w/2+.06)); pl.rotation.y=Math.atan2(-tx,-tz); world.add(pl); } }
    // Spruch auf dem Giebeldreieck des Fachwerkhauses rechts nach der ersten Kurve (zum Start hin), direkt auf den Putz gemalt
    { const H=R.giebel; if(H){ const tx=Math.cos(H.h), tz=Math.sin(H.h), T=H.dep*.94, rh=(2.6+H.dep*.18)*.94, geo=new THREE.BufferGeometry(); // Dachhöhe wie in haus()
      geo.setAttribute('position',new THREE.Float32BufferAttribute([-T/2,0,0, T/2,0,0, 0,rh,0],3)); geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0, 1,0, .5,1],2)); geo.computeVertexNormals();
      const t=frakturTex(512,256,g=>{ g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#a21d18'; g.font='52px '+FRAKTUR; g.fillText('Olé rot-weiß,',256,142,250); g.fillStyle='#2a1a10'; g.font='46px '+FRAKTUR; g.fillText('so laaft die Gschicht.',256,206,390); });
      const pl=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:t,transparent:true,depthWrite:false})); pl.position.set(H.x-tx*(H.w/2+.05), roadY(H.d)+.15+H.hgt+.05, H.y-tz*(H.w/2+.05)); pl.rotation.y=Math.atan2(-tx,-tz); world.add(pl); } }
    // Gassen: Erdwege quer zur Straße, am Anfang auf Gehweghöhe, dann aufs Gelände
    const gm=Object.assign(lam('#a07a58'),{side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-3});
    for(const Gs of R.gassen){ const f=fr(Gs.d), o0=rw(Gs.d), us=[]; for(let u=0;u<Gs.len;u+=u<6?1:2) us.push(u); us.push(Gs.len); const p=new Float32Array(us.length*6), id=[], tx=Math.cos(f.h), tz=Math.sin(f.h);
      us.forEach((u,i)=>{ [-1,1].forEach((k,j)=>{ const x=f.px+f.nx*Gs.s*(o0+u)+tx*k*Gs.w/2, z=f.py+f.ny*Gs.s*(o0+u)+tz*k*Gs.w/2, t=bSm((u-Gs.geh-.5)/4); p.set([x,(roadY(Gs.d)+.24)*(1-t)+(terrainAt(x,z)+.06)*t,z],i*6+j*3); }); if(i<us.length-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); });
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(p,3)); geo.setIndex(id); geo.computeVertexNormals(); world.add(new THREE.Mesh(geo,gm)); }
    // Marktstände: Pfosten, Tisch mit Waren, gestreifte Plane, Fässer und Körbe
    R.markt.forEach((m,i)=>{ const G=new THREE.Group(), gy=roadY(m.d)+.15; G.position.set(m.x,gy,m.y); G.rotation.y=Math.atan2(-Math.sin(m.h)*-K.s, Math.cos(m.h)*-K.s); world.add(G);
      const pl=new THREE.MeshLambertMaterial({map:streifenTex([['#c62f24','#f2ece0'],['#2f6b3a','#efe4c8'],['#1f4e8c','#efe4c8']][i%3],8,true),side:THREE.DoubleSide});
      for(const [x,z,hh] of [[-1.4,.8,2.2],[1.4,.8,2.2],[-1.4,-.8,2.6],[1.4,-.8,2.6]]) box(G,.1,hh,.1,holzD,x,hh/2,z);
      box(G,3,.08,1.4,holz,0,.9,.1); box(G,2.9,.8,.05,holzD,0,.5,.78); const pn=box(G,3.3,.06,2,pl,0,2.45,0); pn.rotation.x=-.2;
      const WA=['#c94a2a','#e0b33c','#7a9a3a','#9a5a2a','#d9d0b0']; for(let k=0;k<7;k++){ const w=new THREE.Mesh(new THREE.SphereGeometry(.13+Math.random()*.06,6,5),lam(WA[(k+i)%5])); w.position.set(-1.2+k*.4,1.04,.15+(k%2)*.3); G.add(w); }
      for(const x of [-1.9,1.9]){ const fs=new THREE.Mesh(new THREE.CylinderGeometry(.3,.27,.75,10),holz); fs.position.set(x,.37,.9); G.add(fs); } }); }

  // ---------- Felsenpfad: Felstürme, überhängende Wände, Felsentor (Buntsandstein, geschichtet) ----------
  const FB=[]; // Felsbrocken als Quader: {x, y, z, w, h, d, ry, c}
  for(const T of R.felsen.tuerme){ const qa=rng(T.sd), G=new THREE.Group(), gy=terrainAt(T.x,T.y)-2; G.position.set(T.x,gy,T.y); world.add(G); let y=0, rr=T.r;
    while(y<T.hg){ const lh=1.3+qa()*2.2, k=y/T.hg; rr=T.r*(1.15-.35*k)*(.72+.5*qa()); const cy=new THREE.Mesh(new THREE.CylinderGeometry(rr*(.88+qa()*.22),rr,lh,7),fels);
      cy.position.set((qa()-.5)*.6,y+lh/2,(qa()-.5)*.6); cy.rotation.y=qa()*6; cy.scale.z=.7+qa()*.4; G.add(cy); y+=lh; }
    if(T.hut){ const cap=new THREE.Mesh(new THREE.CylinderGeometry(rr*1.5,rr*1.2,1.4,7),fels); cap.position.y=y+.7; cap.scale.z=.8; G.add(cap); y+=1.4; } // Pilzfelsen
    T.top=gy+y; if(T.schuetze){ const bu=new THREE.Mesh(new THREE.IcosahedronGeometry(.6,0),lam('#3f6b32')); bu.position.set(rr*.7,y+.3,rr*.5); bu.scale.y=.6; G.add(bu); } else { // beim Schützen nur ein kleiner Busch am Rand
    const st=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,2.2,5),lam('#8f5136')); st.position.set(.4,y+1,0); st.rotation.z=.3; G.add(st);
    const kr=new THREE.Mesh(new THREE.IcosahedronGeometry(1.3,0),lam('#36552d')); kr.position.set(.9,y+2.2,0); kr.scale.set(1.3,.6,1.1); G.add(kr); } } // Krüppelkiefer obendrauf
  for(const Wd of R.felsen.waende){ const qa=rng(Wd.d); for(let a=Wd.d-Wd.len/2; a<=Wd.d+Wd.len/2; a+=6){ const f=fr(a), base=Math.min(roadY(a),terrainAt(f.px+f.nx*Wd.s*8,f.py+f.ny*Wd.s*8))-1.5;
      let y=0, j=0; while(y<Wd.hg){ const lh=1.5+qa()*1.2, dep=5+(j%2?-.9:.4)+qa()*.6, o=rw(a)+3.4+dep/2-Math.min(2.2,j*.3); // nach oben überhängend, Schichten abwechselnd ausgewaschen
        FB.push({x:f.px+f.nx*Wd.s*o, y:base+y+lh/2, z:f.py+f.ny*Wd.s*o, w:6.6+qa(), h:lh, d:dep, ry:-f.h+(qa()-.5)*.1, c:qa()}); y+=lh; j++; } } }
  { const d=R.felsen.tor, f=fr(d), w=rw(d), y0=roadY(d)-1.5, qa=rng(77);
    for(const s of [-1,1]){ let y=0; while(y<9){ const lh=1.6+qa()*1.2; FB.push({x:f.px+f.nx*s*(w+2.8), y:y0+y+lh/2, z:f.py+f.ny*s*(w+2.8), w:5+qa(), h:lh, d:3.6+qa()*.8, ry:-f.h+(qa()-.5)*.15, c:qa()}); y+=lh; } }
    for(const [y,h,dd] of [[9.4,1.8,5.6],[11.2,1.6,4.6],[12.6,1.2,3.4]]) FB.push({x:f.px, y:y0+y, z:f.py, w:dd, h, d:2*(w+2.8)+4.5-y*.25, ry:-f.h, c:qa()}); // Sturz quer über den Weg
    const kr=new THREE.Mesh(new THREE.IcosahedronGeometry(1.6,0),lam('#3f6b32')); kr.position.set(f.px+f.nx*4.5,y0+13.6,f.py+f.ny*4.5); kr.scale.set(1.4,.6,1.2); world.add(kr); }
  inst(new THREE.BoxGeometry(1,1,1), fels, FB, o=>{ ps.set(o.x,o.y,o.z); qq.setFromAxisAngle(up,o.ry); sc.set(o.w,o.h,o.d); cc.setHSL(.03,.25,.72+o.c*.25); });

  // ---------- Burg Berwartstein: steht ohne Felsen auf einem niedrigen Mauersockel; Palas mit Holzaltan, hoher Bergfried, Vorburg-Haus – bündig, ein Sandstein ----------
  { const C=R.burgPos, G=new THREE.Group(); G.position.set(C.x,roadY(R.len)-.5,C.y); G.rotation.y=Math.atan2(-Math.cos(C.h),-Math.sin(C.h)); world.add(G); A.burg=G; // lokal: x nach rechts, z zur Zielgeraden
    const qa=rng(9), fen=(cols,rows,w,h)=>{ const L=[]; for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) L.push([(c+.5)*256/cols-w/2,(r+.5)*256/rows-h/2,w,h]); return L; };
    const palas=new THREE.MeshLambertMaterial({map:burgQuader(fen(5,3,24,40))}), berg=new THREE.MeshLambertMaterial({map:burgQuader([[100,40,18,30],[140,150,18,30],[110,215,16,26]])}), vor=new THREE.MeshLambertMaterial({map:burgQuader(fen(5,2,20,34))});
    const roof=(w,d,h,x,y,z)=>{ const o=new THREE.Mesh(walmGeo(w,d,h),dach); o.position.set(x,y,z); G.add(o); return o; };
    const gaube=(x,y,z)=>{ box(G,1.5,2.6,1.8,lam('#e8dcc8'),x,y,z); box(G,1,.8,.05,lam('#2b2a2e'),x,y+.3,z+.92); roof(1.9,2.2,1.1,x,y+1.3,z); }; // reicht unten ins Dach
    box(G,34,5,18,sand,2,-1.5,2); // Sockel unter Palas und Bergfried
    // Palas mit Walmdach und Gauben, Holzaltan auf Schrägstützen an der Vorderseite
    box(G,22,15,13,palas,-3,8.5,3.5); roof(23.4,14.4,8,-3,16,3.5); for(const x of [-10,-3,4]) gaube(x,18.4,8.7);
    box(G,9,.35,2.8,holz,-10,9,11.4); box(G,9,.9,.08,holz,-10,9.6,12.8); for(let x=-14.3;x<=-5.6;x+=1.45) box(G,.1,.9,.1,holzD,x,9.6,12.8);
    for(const x of [-13.8,-11.3,-8.7,-6.2]){ const st=box(G,.28,4.9,.28,holzD,x,6.7,11.2); st.rotation.x=.5; } const ad=box(G,9.6,.2,3.3,dach,-10,12.4,11.6); ad.rotation.x=.2;
    // Bergfried bündig rechts am Palas, Zeltdach, spitzes Ecktürmchen; kleines Türmchen an der linken Palasecke
    box(G,10,40,10,berg,13,21,-1); roof(11.6,11.6,12,13,41,-1);
    const turm=(r,h,x,y,z)=>{ const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),berg); t.position.set(x,y,z); G.add(t); const c=new THREE.Mesh(new THREE.ConeGeometry(r*1.3,r*3.2,12),dach); c.position.set(x,y+h/2+r*1.6,z); G.add(c); };
    turm(1.7,7,18.4,37.5,4.4); turm(1.8,10,-14.4,17,10.4);
    // Vorburg-Haus vor dem Bergfried: Walmdach mit Gauben
    box(G,16,8,8,vor,10,4,15); roof(17.6,9.6,6,10,8,15); for(const x of [5,10,15]) gaube(x,10.7,17.8);
    // Kleinkram am Fuß: Büsche und Steinbrocken
    for(let i=0;i<16;i++){ const a=qa()*6.3, b=new THREE.Mesh(new THREE.IcosahedronGeometry(.9+qa()*1.1,0),lam(qa()<.5?'#3f6b32':'#4d7a3a')); b.position.set(2+Math.cos(a)*19,.5,2+Math.sin(a)*11.5); b.scale.y=.65; G.add(b); }
    for(let i=0;i<10;i++){ const a=qa()*6.3, b=new THREE.Mesh(new THREE.DodecahedronGeometry(.6+qa()*.9,0),fels); b.position.set(2+Math.cos(a)*20.5,.2,2+Math.sin(a)*12.5); b.rotation.set(qa(),qa()*6,qa()); G.add(b); } // Kleinkram am Fuß: dunkle Büsche, kleine Fichten hinter der Burg, Efeu am Sockel
    for(let i=0;i<14;i++){ const a=Math.PI*(1+qa()), b=new THREE.Mesh(new THREE.IcosahedronGeometry(.9+qa()*.8,0),lam(qa()<.5?'#2c4a26':'#34522b')); b.position.set(2+Math.cos(a)*18,.6,2+Math.sin(a)*11); b.scale.y=.75; G.add(b); }
    for(let i=0;i<9;i++){ const a=Math.PI*(1.05+qa()*.9), k=new THREE.Mesh(new THREE.ConeGeometry(1,1,7),lam(qa()<.5?'#2f4d2c':'#3a5a34')); k.scale.set(1.1,4.5+qa()*2.5,1.1); k.position.set(2+Math.cos(a)*18.5,k.scale.y/2,2+Math.sin(a)*11.5); G.add(k); }
    for(let i=0;i<16;i++){ const f=i%4, t=qa()-.5, e=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),lam('#2f5229')); e.position.set(f<2?(f?19.1:-15.1):2+t*30, .4+qa()*1.4, f<2?2+t*15:(f===2?-7.1:11.1)); e.scale.set(f<2?.3:1.2+qa(),1.4+qa()*1.6,f<2?1.2+qa():.3); G.add(e); } }

  // Mensch: Beine, Kittel, Arme an Schultergelenken, Kopf mit Hut; blickt nach lokal +z · o.lang: Gewand bis zum Boden (Mönch, Bäuerin, Königspaar) · o.rock: Waffenrock über dem Kettenhemd (Wachen)
  const M=c=>lam(c), bretter=hMat('bretter',()=>new THREE.MeshLambertMaterial({map:canvasTex(64,64,g=>{ for(let x=0;x<64;x+=8){ const v=.8+Math.random()*.3; g.fillStyle=`rgb(${118*v|0},${84*v|0},${54*v|0})`; g.fillRect(x,0,8,64); g.fillStyle='rgba(30,18,10,.55)'; g.fillRect(x+7,0,1,64); } })}));
  const mensch=(p,blick,kittel,hose,hut,o={})=>{ const G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=Math.atan2(blick.x-p.x,blick.z-p.z); world.add(G); const haut=M('#e8c09a');
    const beine=[]; for(const z of [-.09,.09]){ const b=new THREE.Group(); b.position.set(z,.76,0); G.add(b); beine.push(b); if(!o.lang) box(b,.12,.75,.12,M(hose),0,-.38,0); box(b,.13,.1,.22,M('#3e2a1c'),0,-.71,.04); } // Beine drehen in der Hüfte (Gehen, Sitzen)
    const k=new THREE.Mesh(o.lang?new THREE.CylinderGeometry(.18,.3,1.38,10):new THREE.CylinderGeometry(.18,.27,.95,10),M(kittel)); k.position.y=o.lang?.74:.95; G.add(k); box(G,.4,.06,.32,M(o.guertel||'#4a3222'),0,.78,0);
    if(o.rock){ const r=new THREE.Mesh(new THREE.CylinderGeometry(.2,.29,.8,10),M(o.rock)); r.position.y=.98; G.add(r); const b=new THREE.Mesh(new THREE.CylinderGeometry(.295,.295,.07,10),M(o.band||'#d9a62b')); b.position.y=.6; G.add(b); }
    const arme=[]; for(const x of [-.23,.23]){ const a=new THREE.Group(); a.position.set(x,1.38,0); G.add(a); const c=new THREE.Mesh(new THREE.CylinderGeometry(.055,.05,.58,6),M(o.aermel||kittel)); c.position.y=-.29; a.add(c);
      const hd=new THREE.Mesh(new THREE.SphereGeometry(.055,6,5),haut); hd.position.y=-.6; a.add(hd); a.rotation.z=x<0?-.12:.12; arme.push(a); }
    const kopf=new THREE.Group(); kopf.position.y=1.5; G.add(kopf); const hk=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),haut); hk.position.y=.1; kopf.add(hk); hut(kopf); return {G,arme,kopf,beine}; };
  // Hüte und Kopfbedeckungen
  const HUT={stroh:k=>{ const r=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.02,14),M('#d6bf72')); r.position.y=.18; k.add(r); const c=new THREE.Mesh(new THREE.CylinderGeometry(.12,.13,.13,12),M('#cdb265')); c.position.y=.25; k.add(c); },
    tuch:k=>{ const t=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8,0,Math.PI*2,0,Math.PI*.6),M('#efe8d6')); t.position.set(0,.11,-.01); t.rotation.x=-.25; k.add(t); },
    kapuze:k=>{ const t=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8,0,Math.PI*2,0,Math.PI*.65),M('#5a4128')); t.position.set(0,.1,-.03); t.rotation.x=-.45; k.add(t); },
    helm:k=>{ const h=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8,0,Math.PI*2,0,Math.PI/2),M('#9aa0a6')); h.position.y=.12; k.add(h); const b=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.025,14),M('#8a9096')); b.position.y=.13; k.add(b); // Eisenhut mit Krempe
      const ns=new THREE.Mesh(new THREE.BoxGeometry(.02,.12,.03),M('#8a9096')); ns.position.set(0,.06,.13); k.add(ns); },
    krone:k=>{ const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.12,.09,10,1,true),new THREE.MeshLambertMaterial({color:'#e2b33a',side:THREE.DoubleSide,emissive:'#3a2a00'})); c.position.y=.23; k.add(c);
      for(let i=0;i<5;i++){ const a=i/5*Math.PI*2, z=new THREE.Mesh(new THREE.ConeGeometry(.025,.07,4),M('#e2b33a')); z.position.set(Math.cos(a)*.125,.3,Math.sin(a)*.125); k.add(z); } }};
  // ---------- Zollstation: Holzhäuschen mit Zöllner, Schlagbaum, Bauer mit Heukarren und Pferd – die beiden unterhalten sich ----------
  { const s=ZOLL.s, at=(a,u)=>{ const f=fr(ZOLL.d+a), o=rw(ZOLL.d+a)+u; return {x:f.px+f.nx*s*o, z:f.py+f.ny*s*o, h:f.h, y:terrainAt(f.px+f.nx*s*o,f.py+f.ny*s*o)}; };
    const zuStr=p=>Math.atan2(-Math.sin(p.h)*-s, Math.cos(p.h)*-s); // lokale +z zur Straße
    // Zollhaus: Bretterwände, Satteldach, Fensterladen als Theke, Schild
    { const p=at(1.5,6), G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=zuStr(p); world.add(G);
      box(G,3.4,3,2.8,bretter,0,1.3,0); const rf=new THREE.Mesh(dachGeo(3.4,2.8,4.2,3.6,1.5),[dach,bretter]); rf.position.y=2.8; G.add(rf);
      box(G,1.4,.9,.05,M('#2b2420'),-.6,1.6,1.42); box(G,1.6,.1,.45,holz,-.6,1.1,1.6); box(G,.8,1.9,.05,holzD,.95,.95,1.42); // Fenster mit Theke, Tür
      const t=canvasTex(128,48,g=>{ g.fillStyle='#e9dcbc'; g.fillRect(0,0,128,48); g.strokeStyle='#5a3a26'; g.lineWidth=5; g.strokeRect(2,2,124,44); g.fillStyle='#5a2a1a'; g.font='700 30px Georgia, serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('ZOLL',64,26); });
      const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.45),new THREE.MeshLambertMaterial({map:t})); sg.position.set(-.6,2.35,1.44); G.add(sg);
      const fa=box(G,.08,1.1,.08,holz,1.7,2.9,1.2); fa.rotation.z=-.2; } // kleine Fahnenstange
    // Schlagbaum rot-weiß quer über den Weg, geht erst 20 m vor dem Fahrer hoch (siehe poseBurg)
    { const p=at(5.5,1.4), G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=zuStr(p); world.add(G); box(G,.22,1.2,.22,holzD,0,.6,0);
      const Lb=2*rw(ZOLL.d+5.5)+2.2, st=canvasTex(8,64,g=>{ for(let y=0;y<64;y+=16){ g.fillStyle='#c62f24'; g.fillRect(0,y,8,8); g.fillStyle='#f2ece0'; g.fillRect(0,y+8,8,8); } }), pole=cyl(.06,new THREE.MeshLambertMaterial({map:st}));
      st.wrapS=st.wrapT=THREE.RepeatWrapping; st.repeat.set(1,Lb/3.8); const dreh=new THREE.Group(); dreh.position.y=1.15; G.add(dreh); place(pole,[0,0,0],[0,0,Lb]); dreh.add(pole);
      box(G,.18,1,.18,holzD,0,.5,Lb-.15); A.zoll={dreh,k:0,d:ZOLL.d+5.5}; } // Gabelstütze am anderen Wegrand
    const zp=at(-.5,3.4), bp=at(-2.6,2.9);
    const z=mensch(zp,bp,'#2f4a66','#2a2a30',k=>{ const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.15,.07,12),M('#7a1f1f')); b.position.set(0,.2,-.02); b.rotation.x=-.2; k.add(b); }); // Zöllner mit rotem Barett
    const zb=box(z.arme[1],.18,.24,.05,M('#6b3a20'),0,-.62,.12); zb.rotation.x=-.5; z.arme[1].rotation.x=-.7; // hält das Zollbuch
    const b=mensch(bp,zp,'#8a6a44','#5b4a36',HUT.stroh); // Bauer mit Strohhut
    A.leute.push({z,b});
    const zs=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex('Gute Fahrt, edler Pedalritter!'),transparent:true,depthWrite:false})); const zr=at(-.5,1.2); zs.scale.set(6.2,1.92,1); zs.position.set(zr.x,zp.y+2.9,zr.z); zs.visible=false; world.add(zs); // etwas kleiner, Richtung Fahrbahn versetzt
    Object.assign(A.zoll,{z,sp:zs,ry:z.G.rotation.y,w:0,rufT:0,rief:false}); // Zöllner ruft dem Fahrer zu
    // Pferd vor dem Heukarren, am Wegrand in Fahrtrichtung
    { const p=at(-7,2.5), G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=-p.h; world.add(G); const fell=M('#7a5232'), mahne=M('#2e2018'), dk=M('#4e3423');
      const pf=new THREE.Group(); pf.position.x=2.3; G.add(pf);
      const rumpf=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),fell); rumpf.scale.set(1.05,.42,.36); rumpf.position.y=1.32; pf.add(rumpf);
      for(const [x,zz] of [[.72,.17],[.72,-.17],[-.72,.17],[-.72,-.17]]){ const l=cyl(.075,fell,.06); place(l,[x,1.2,zz],[x,.08,zz]); pf.add(l); box(pf,.13,.09,.13,M('#222'),x,.05,zz); }
      const hals=cyl(.17,fell,.13); place(hals,[.85,1.45,0],[1.3,2.05,0]); pf.add(hals); const mh=box(pf,.08,.75,.05,mahne,1.02,1.8,0); mh.rotation.z=.65;
      const kopf=box(pf,.62,.24,.22,fell,1.52,1.9,0); kopf.rotation.z=-.95; box(pf,.18,.16,.2,M('#5a3a24'),1.72,1.58,0);
      for(const zz of [-.07,.07]){ const o=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,5),fell); o.position.set(1.3,2.2,zz); pf.add(o); }
      const sw=cyl(.06,mahne,.03); place(sw,[-1.05,1.45,0],[-1.25,.75,0]); pf.add(sw);
      const kum=new THREE.Mesh(new THREE.TorusGeometry(.2,.06,6,12),dk); kum.position.set(.95,1.55,0); kum.rotation.y=Math.PI/2; kum.rotation.x=.6; pf.add(kum); // Kummet
      A.leute[0].pferd=pf;
      // Karren: Ladefläche, Bordwände, zwei Speichenräder, Deichselarme zum Pferd, hoch geladenes Heu
      box(G,2.9,.12,1.5,bretter,-.2,.95,0); for(const zz of [-.72,.72]) box(G,2.9,.35,.06,bretter,-.2,1.17,zz); box(G,.06,.35,1.5,bretter,-1.62,1.17,0);
      for(const zz of [-.84,.84]){ const rad=new THREE.Group(); rad.position.set(-.3,.55,zz); G.add(rad); const rr=new THREE.Mesh(new THREE.TorusGeometry(.52,.05,5,18),dk); rad.add(rr);
        for(let i=0;i<8;i++){ const a=i/8*Math.PI*2, sp=box(rad,.04,.5,.04,holz,Math.cos(a)*.25,Math.sin(a)*.25,0); sp.rotation.z=a-Math.PI/2; } }
      for(const zz of [-.55,.55]){ const d2=cyl(.04,holz); place(d2,[1.1,1,zz],[2.95,1.3,zz*.65]); G.add(d2); }
      const heu=M('#d8c070'); for(const [x,y,sx,sy,sz] of [[-.2,1.45,1.55,.55,.85],[-.5,1.9,1.1,.45,.7],[.25,1.85,.9,.4,.65],[-.25,2.25,.8,.3,.5]]){ const h=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),heu); h.position.set(x,y,0); h.scale.set(sx,sy,sz); G.add(h); }
      for(let i=0;i<14;i++){ const hm=box(G,.5,.02,.02,M('#c9ad5a'),-1.4+Math.random()*2.6,1.25+Math.random()*1.1,(Math.random()-.5)*1.5); hm.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3); } } } // abstehende Halme

  // ---------- Vorburg: Zugbrücke über den Halsgraben, Torturm mit Fallgitter, Ringmauer, Turnierwiese mit Tribüne, Königspaar, Löwenbanner, Volk ----------
  { const V=R.vb, VG=new THREE.Group(); VG.position.set(V.x,0,V.y); VG.rotation.y=-V.h; world.add(VG); // lokale Achsen: x = a (zur Burg), z = u (rechts), y = Höhe in der Welt
    const yR=a=>roadY(VB.tor+Math.max(VB.br[0]-VB.tor-2,Math.min(V.L,a))), w=rw(VB.tor), ga=Math.atan(gradeAt(VB.tor+50)/100), W=(a,u)=>({x:V.x+V.ex*a+V.nx*u, y:yR(a), z:V.y+V.ey*a+V.ny*u});
    const vbox=(w2,h,d,mat,a,y,u)=>box(VG,w2,h,d,mat,a,y,u), stange=(m,a,b)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),m); o.scale.set(.25,1,.25); place(o,a,b); VG.add(o); return o; };
    const eisen=M('#2e2c2a'), FAHNE=new THREE.MeshLambertMaterial({map:loewenTex(128,96,false),side:THREE.DoubleSide});
    const fahne=(a,y,u,b=1.6,hh=1)=>{ const g=new THREE.PlaneGeometry(b,hh); g.translate(b/2,0,0); const f=new THREE.Mesh(g,FAHNE); f.position.set(a,y,u); f.rotation.y=Math.PI/2; VG.add(f); A.fahnen.push({f,ph:a*.37+u}); // weht im Wind
      const st=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,hh/2+2.7,6),holzD); st.position.set(a,y+(hh/2-2.5)/2,u); VG.add(st); }; // Stange reicht 2,6 m unter die Fahne
    // Zugbrücke: Widerlager, Pfeiler im Graben, Längsbalken, Geländer mit Andreaskreuzen; vorn die Klappe an Ketten, oben die Schlagruten
    const b0=VB.br[0]-VB.tor, b1=VB.br[1]-VB.tor, bm=(b0+b1)/2; vbox(3,7,2*w+2.4,sand,b0+.5,yR(b0)-3.6,0); vbox(2.2,10,2*w+1.4,sand,bm,yR(bm)-5.3,0);
    for(const s2 of [-1,1]){ const sb=vbox(b1-b0,.5,.3,holzD,bm,yR(bm)-.2,s2*(w+.15)); sb.rotation.z=ga;
      for(let a=b0+1.5;a<=b1-9;a+=1.9) vbox(.14,1.1,.14,holz,a,yR(a)+.6,s2*(w+.3));
      for(const yy of [1.15,.55]){ const r=vbox(b1-9-b0-1.4,.12,.1,holz,(b0+1.5+b1-9)/2,yR(bm)+yy,s2*(w+.3)); r.rotation.z=ga; }
      for(let a=b0+2.4;a<b1-9.5;a+=1.9) for(const k of [-1,1]){ const c=vbox(1.9,.08,.07,holz,a,yR(a)+.85,s2*(w+.3)); c.rotation.z=k*.32; }
      const kl=vbox(8.5,.4,.28,holzD,b1-4.5,yR(b1-4.5)-.1,s2*(w+.05)); kl.rotation.z=ga; // Klappe
      const tip=[b1-9,yR(0)+10.2,s2*(w-.5)]; stange(holzD,[-3.6,yR(0)+9.2,s2*(w-.5)],tip); // Schlagrute
      const ke=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1,5),eisen); place(ke,tip,[b1-9,yR(b1-9)+.15,s2*(w+.05)]); VG.add(ke); }
    vbox(.4,.4,2*w+.6,holzD,b1-9,yR(b1-9)-.05,0);
    // Torturm über der Straße: Durchfahrt mit Rundbogen und halb hochgezogenem Fallgitter, Zinnen, spitze Ecktürmchen, Löwenwappen, Fackeln
    const y0=yR(0), tw=w+.6, TH=16;
    for(const s2 of [-1,1]) vbox(8,TH+4,7-tw,sand,0,y0-4+(TH+4)/2,s2*(tw+(7-tw)/2)); vbox(8,TH-5.6,2*tw,sand,0,y0+5.6+(TH-5.6)/2,0);
    const bogen=new THREE.Mesh(new THREE.TorusGeometry(tw-.15,.32,6,18,Math.PI),M('#9c5a44')); bogen.position.set(-4.05,y0+5.6-tw+.15,0); bogen.rotation.y=Math.PI/2; VG.add(bogen);
    for(let u=-tw+.4;u<=tw-.3;u+=.6){ vbox(.1,2.4,.1,eisen,-3.2,y0+4.6,u); const sp=new THREE.Mesh(new THREE.ConeGeometry(.07,.32,4),eisen); sp.rotation.x=Math.PI; sp.position.set(-3.2,y0+3.25,u); VG.add(sp); }
    for(const yy of [3.9,4.9]) vbox(.1,.1,2*tw,eisen,-3.2,y0+yy,0);
    const zinnen=(a0,a1,u0,u1,y,n)=>{ for(let i=0;i<=n;i++){ const t=i/n; if(i%2===0) vbox(.9,1.1,.9,sand,a0+(a1-a0)*t,y+.55,u0+(u1-u0)*t); } };
    zinnen(-4,-4,-7,7,y0+TH,10); zinnen(4,4,-7,7,y0+TH,10); zinnen(-4,4,-7,-7,y0+TH,6); zinnen(-4,4,7,7,y0+TH,6);
    for(const s2 of [-1,1]){ const t=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,4.6,10),sand); t.position.set(-4,y0+TH+.3,s2*7); VG.add(t);
      const c=new THREE.Mesh(new THREE.ConeGeometry(1.55,3.2,10),dach); c.position.set(-4,y0+TH+4.2,s2*7); VG.add(c); fahne(-4,y0+TH+6.6,s2*7,1.2,.75);
      vbox(.5,.15,.15,eisen,-4.2,y0+3.6,s2*(tw+.7)); const fl=new THREE.Mesh(new THREE.ConeGeometry(.16,.5,6),new THREE.MeshBasicMaterial({color:'#ffb347'})); fl.position.set(-4.45,y0+4.05,s2*(tw+.7)); VG.add(fl); A.flammen.push(fl); } // Fackeln
    { const sh=new THREE.Mesh(new THREE.PlaneGeometry(2,2.4),new THREE.MeshLambertMaterial({map:schildTex(0),transparent:true,alphaTest:.5})); sh.position.set(-4.06,y0+9,0); sh.rotation.y=-Math.PI/2; VG.add(sh); }
    // Ringmauer mit Zinnen und runden Türmen um Turnierwiese und Burgfelsen
    // eng gefasst: rechts direkt hinter der Tribüne, links hinter den Zelten, um die Burg herum weiter; Oberkante überall gleich hoch
    const ML=VB.ml, MR=15.5, MB=VB.mb, AK=V.L+26, AE=V.L+VB.ae, TOP=Math.max(yR(0),yR(V.L))+7.5, mauer=[], merl=[], seg=(a0,u0,a1,u1)=>{ const L=Math.hypot(a1-a0,u1-u0), n=Math.ceil(L/8); for(let i=0;i<n;i++){ const ta=(i+.5)/n, a=a0+(a1-a0)*ta, u=u0+(u1-u0)*ta, top=TOP;
        mauer.push({a,u,y:top-6.5,L:L/n+.1,h:13,r:Math.atan2(u1-u0,a1-a0)}); for(let k=0;k<4;k++){ const tb=(i+(k+.25)/4)/n; merl.push({a:a0+(a1-a0)*tb,u:u0+(u1-u0)*tb,y:top+.55,r:Math.atan2(u1-u0,a1-a0)}); } } };
    seg(4,-tw-4.8,4,-ML); seg(4,tw+4.8,4,MR); seg(4,-ML,AE,-ML); seg(4,MR,AK,MR); seg(AK,MR,AK+5,MB); seg(AK+5,MB,AE,MB); seg(AE,-ML,AE,MB); // rechts erst um Bergfried und Vorburg-Haus weiter
    const vinst=(geo,mat,list,fn)=>{ const im=new THREE.InstancedMesh(geo,mat,list.length); list.forEach((o,i)=>{ fn(o); m4.compose(ps,qq,sc); im.setMatrixAt(i,m4); }); im.instanceMatrix.needsUpdate=true; VG.add(im); return im; };
    // Efeu außen an der Ringmauer: dunkelgrüne Polster, die vom Boden hochwachsen
    { const am=(4+AE)/2, um=(MB-ML)/2, ef=mauer.filter((o,i)=>i%3!==1).map((o,i)=>{ const na=-Math.sin(o.r), nu=Math.cos(o.r), sg=(o.a-am)*na+(o.u-um)*nu>0?1:-1, w2=W(o.a+na*sg,o.u+nu*sg), hh=2.5+(i*7%5)*1.2;
        return {a:o.a+na*sg*.95, u:o.u+nu*sg*.95, y:terrainAt(w2.x,w2.z)+hh/2-.4, h:hh, L:o.L*(.6+(i%3)*.15), r:o.r}; });
      vinst(new THREE.IcosahedronGeometry(1,1),M('#2f5229'),ef,o=>{ ps.set(o.a,o.y,o.u); qq.setFromAxisAngle(up,-o.r); sc.set(o.L/2,o.h/2,.35); }); }
    vinst(new THREE.BoxGeometry(1,1,1),sand,mauer,o=>{ ps.set(o.a,o.y,o.u); qq.setFromAxisAngle(up,-o.r); sc.set(o.L,o.h,1.8); });
    vinst(new THREE.BoxGeometry(1,1,1),sand,merl,o=>{ ps.set(o.a,o.y,o.u); qq.setFromAxisAngle(up,-o.r); sc.set(1,1.1,1.9); });
    for(const [a,u] of [[4,-ML],[4,MR],[AK,-ML],[AK,MR],[AE,-ML],[AE,MB]]){ const top=TOP+3, t=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.7,16,14),sand); t.position.set(a,top-8,u); VG.add(t);
      for(let i=0;i<8;i++){ const al=i/8*Math.PI*2; vbox(1,1.1,1,sand,a+Math.cos(al)*3.1,top+.55,u+Math.sin(al)*3.1); } fahne(a,top+3.4,u); }
    // Turnierwiese: Sandbahn links neben der Zielgeraden, Schranke (rot-weiß), Zaun mit Andreaskreuzen, Wimpelketten, Ritterzelte
    const AS=12, AZ=V.L-4, ul=-(w+1.3), uz=-(w+9.5), sk=Math.atan((yR(AZ)-yR(AS))/(AZ-AS));
    { const sb=vbox(AZ-AS+6,.08,uz-ul-.6,M('#d6c39a'),(AS+AZ)/2,yR((AS+AZ)/2)-.36,(ul+uz)/2); sb.rotation.z=sk; }
    const str=new THREE.MeshLambertMaterial({map:streifenTex(['#c62f24','#f2ece0'],8,false)}); str.map.wrapS=THREE.RepeatWrapping; str.map.repeat.set(30,1);
    for(let a=AS;a<=AZ;a+=3) vbox(.16,1.3,.16,holzD,a,yR(a)+.15,ul); { const r=vbox(AZ-AS,.2,.14,str,(AS+AZ)/2,yR((AS+AZ)/2)+.85,ul); r.rotation.z=sk; }
    for(let a=AS;a<=AZ;a+=3){ vbox(.15,1.3,.15,holzD,a,yR(a)+.15,uz); if(a<AZ) for(const k of [-1,1]){ const c=vbox(3.2,.09,.08,holz,a+1.5,yR(a+1.5)+.2,uz); c.rotation.z=k*.36; } } { const r=vbox(AZ-AS,.12,.1,holz,(AS+AZ)/2,yR((AS+AZ)/2)+.8,uz); r.rotation.z=sk; }
    const wim=[], WC=['#c62f24','#1f4e8c','#e2b33a','#f2ece0'], tri=new THREE.BufferGeometry(); tri.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-.18,0,0, .18,0,0, 0,-.42,0]),3)); tri.computeVertexNormals();
    for(let a=AS;a<AZ;a+=6){ stange(holzD,[a,yR(a)-.3,uz-.4],[a,yR(a)+3.2,uz-.4]); for(let i=1;i<10;i++){ const t=i/10, aa=a+6*t; wim.push({a:aa,y:yR(aa)+3.1-Math.sin(t*Math.PI)*.55,u:uz-.4,c:WC[(i+a/6|0)%4]}); } }
    { const im=new THREE.InstancedMesh(tri,new THREE.MeshLambertMaterial({side:THREE.DoubleSide}),wim.length); wim.forEach((o,i)=>{ ps.set(o.a,o.y,o.u); qq.identity(); sc.set(1,1,1); m4.compose(ps,qq,sc); im.setMatrixAt(i,m4); im.setColorAt(i,cc.set(o.c)); }); VG.add(im); }
    for(const [a,u,c] of [[20,-16.4,0],[40,-16.4,1]]){ const tx=streifenTex(c?['#1f4e8c','#f2ece0']:['#c62f24','#f2ece0'],8,true), tm=new THREE.MeshLambertMaterial({map:tx,side:THREE.DoubleSide});
      const zw=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,2.4,16,1,true),tm); zw.position.set(a,yR(a)+.7,u); VG.add(zw); const zd=new THREE.Mesh(new THREE.ConeGeometry(2.6,2.6,16,1,true),tm); zd.position.set(a,yR(a)+3.2,u); VG.add(zd);
      fahne(a,yR(a)+5.3,u,1,.6); }
    // Tribüne rechts am Ziel: Holzstufen, Brüstung mit Wimpelfries und Wappenschilden, Königsloge mit Baldachin, großes Löwenbanner, Fahnen
    const AT=V.L, TL=30, TA0=AT-TL/2, ut=w+2.6, yt=yR(AT)-.5, LG=4.6, stufen=new THREE.MeshLambertMaterial({map:bretter.map});
    for(let i=0;i<4;i++) for(const [a0,a1] of [[TA0,AT-LG],[AT+LG,TA0+TL]]) vbox(a1-a0,(i+1)*.75,2,stufen,(a0+a1)/2,yt+(i+1)*.375,ut+1+i*2);
    vbox(TL,1.1,.12,new THREE.MeshLambertMaterial({map:friesTex()}),AT,yt+.55,ut-.05);
    for(let a=TA0+1.5,i=0;a<TA0+TL;a+=3,i++){ if(Math.abs(a-AT)<LG) continue; const sh=new THREE.Mesh(new THREE.PlaneGeometry(.8,1),new THREE.MeshLambertMaterial({map:schildTex(i%4),transparent:true,alphaTest:.5})); sh.position.set(a,yt+.65,ut-.13); sh.rotation.y=Math.PI; VG.add(sh); }
    const yl=yt+2.6; vbox(2*LG,2.6,7.6,stufen,AT,yt+1.3,ut+3.8); vbox(2*LG,1,.12,new THREE.MeshLambertMaterial({map:friesTex()}),AT,yl+.5,ut-.05);
    for(const da of [-1.3,1.3]){ vbox(1.1,.5,1,M('#7a1f1f'),AT+da,yl+.25,ut+5.5); vbox(1.1,2,.18,M('#e2b33a'),AT+da,yl+1,ut+6.05); vbox(.9,1.6,.1,M('#7a1f1f'),AT+da,yl+1,ut+5.95); } // Throne
    for(const [da,du] of [[-LG+.3,.3],[LG-.3,.3],[-LG+.3,7.3],[LG-.3,7.3]]) vbox(.16,4,.16,holzD,AT+da,yl+2,ut+du);
    { const dt=streifenTex(['#c62f24','#e2b33a'],8,true), dm=new THREE.MeshLambertMaterial({map:dt,side:THREE.DoubleSide}); const rf=new THREE.Mesh(walmGeo(2*LG+.8,8,1.8),dm); rf.position.set(AT,yl+4,ut+3.8); VG.add(rf);
      vbox(2*LG+.8,.55,.05,dm,AT,yl+3.75,ut-.2); }
    { const bn=new THREE.Mesh(new THREE.PlaneGeometry(3.2,4.6),new THREE.MeshLambertMaterial({map:loewenTex(256,368,true),transparent:true,alphaTest:.5,side:THREE.DoubleSide})); bn.position.set(AT,yl+6.6,ut+7.6); bn.rotation.y=Math.PI; VG.add(bn);
      vbox(3.8,.14,.14,holzD,AT,yl+8.95,ut+7.6); stange(holzD,[AT,yl+2,ut+7.75],[AT,yl+9.6,ut+7.75]); } // großes Löwenbanner hinter dem Thron
    for(let a=TA0+1;a<=TA0+TL;a+=5) if(Math.abs(a-AT)>LG+.5) fahne(a,yt+5.4,ut+7.6);
    // Königspaar vor den Thronen, Leibwachen daneben
    const blickStr=(a,u)=>{ const p=W(a,u-5); return {x:p.x,z:p.z}; };
    { const p=W(AT-1.3,ut+4.6); p.y=yl; mensch(p,blickStr(AT-1.3,ut+4.6),'#9b1b1b','#3a1010',HUT.krone,{lang:1,guertel:'#e2b33a'}); }
    { const p=W(AT+1.3,ut+4.6); p.y=yl; mensch(p,blickStr(AT+1.3,ut+4.6),'#2a4c9a','#1a2a50',k=>{ HUT.tuch(k); HUT.krone(k); },{lang:1,guertel:'#e2b33a'}); }
    const wache=(p,blick)=>{ const m=mensch(p,blick,'#8d9196','#3a3a3e',HUT.helm,{rock:'#1d1d1f',aermel:'#8d9196'}), H=new THREE.Group(); H.position.set(.32,.9,.12); m.G.add(H); // Hellebarde
      const st=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,2.6,6),holzD); st.position.y=.4; H.add(st); const bl=new THREE.Mesh(new THREE.BoxGeometry(.04,.32,.26),M('#b8bcc0')); bl.position.set(0,1.55,.1); H.add(bl);
      const sp=new THREE.Mesh(new THREE.ConeGeometry(.04,.3,4),M('#b8bcc0')); sp.position.y=1.85; H.add(sp); m.arme[1].rotation.x=-.35;
      const sd=new THREE.Mesh(new THREE.PlaneGeometry(.55,.7),new THREE.MeshLambertMaterial({map:schildTex(0),transparent:true,alphaTest:.5,side:THREE.DoubleSide})); sd.position.set(-.3,1.05,.2); sd.rotation.y=-.3; m.G.add(sd); return m; };
    for(const da of [-LG+.6,LG-.6]){ const p=W(AT+da,ut+4.6); p.y=yl; wache(p,blickStr(AT+da,ut+4.6)); }
    for(const s2 of [-1,1]){ const p=W(6.5,s2*(w+1.1)); wache(p,W(-10,s2*(w+1.1))); } // zwei Wachen gleich hinter dem Tor, Blick zu den Ankommenden
    // Zielbanner zwischen zwei Holzmasten
    for(const s2 of [-1,1]) vbox(.22,5.4,.22,holzD,AT,yR(AT)+2.7,s2*(w+.9)); { const zb=new THREE.Mesh(new THREE.PlaneGeometry(2*w+2,1.1),new THREE.MeshLambertMaterial({map:zielTex(),side:THREE.DoubleSide})); zb.position.set(AT,yR(AT)+4.7,0); zb.rotation.y=-Math.PI/2; VG.add(zb); } // Schrift zu den Ankommenden
    // Volk: auf den Tribünenstufen, hinter dem Zaun der Turnierbahn und am rechten Wegrand (gemeinsam gezeichnet, jubelt, wenn man naht)
    const q=rng(808), V2=[], FAR=['#8b1e2d','#1f4e8c','#2f6b3a','#c9a227','#6b3a7a','#a0522d','#e8dcc0','#3b3b6b','#b5651d','#7a8b3a','#c75b7a','#4a7a8c'], HAUT=['#f1c9a5','#e0ac80','#c68c62'];
    const leut=(a,u,y,dreh,k=1)=>V2.push({a,u,y,k,r:dreh+(q()-.5)*.6,c:FAR[q()*FAR.length|0],h:HAUT[q()*3|0],hut:q()<.3?1:q()<.45?2:q()<.55?3:0,hc:FAR[q()*FAR.length|0],t:.9+q()*.2,ph:q()*6.3,arme:q()<.6});
    for(let i=0;i<4;i++) for(let a=TA0+.5;a<TA0+TL;a+=.8) if(Math.abs(a-AT)>LG&&q()<.85) leut(a+(q()-.5)*.2,ut+1.2+i*2,yt+(i+1)*.75,Math.PI);
    for(let a=AS+1;a<AZ;a+=1.1) if(q()<.75) leut(a,uz-1-q()*1.5,yR(a)-.45,0);
    for(let a=8;a<TA0-1;a+=1.6) if(q()<.75) leut(a,w+1.2+q()*1.2,yR(a)-.45,Math.PI);
    // Rechts hinter dem Tor: Stände mit Essen und Trinken (Schilder in Fraktur), Bierbänke, Spanferkel überm Feuer, Volk in Grüppchen
    const yB=a=>yR(a)-.45, rtx=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,.75)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
    const rauch=(a,y,u,n)=>{ for(let i=0;i<n;i++){ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:rtx,color:'#b8b2aa',transparent:true,opacity:.45,depthWrite:false})); VG.add(sp); A.rauch.push({sp,a,y,u,ph:i/n}); } };
    const flamme=(a,y,u,s=1)=>{ for(const [c,r,h,dy] of [['#ff8a2a',.35,1,.5],['#ffd25a',.2,.7,.4]]){ const f=new THREE.Mesh(new THREE.ConeGeometry(r*s,h*s,7),new THREE.MeshBasicMaterial({color:c})); f.position.set(a,y+dy*s,u); VG.add(f); A.flammen.push(f); } };
    const schild=txt=>new THREE.MeshLambertMaterial({map:frakturTex(192,64,g=>{ g.fillStyle='#e8d3a2'; g.fillRect(0,0,192,64); g.strokeStyle='#5a3a26'; g.lineWidth=5; g.strokeRect(3,3,186,58); g.fillStyle='#3b2412'; g.font='38px '+FRAKTUR; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,96,36,180); })});
    const stand=(a,u,F,txt,ware)=>{ const G=new THREE.Group(); G.position.set(a,yB(a),u); G.rotation.y=Math.PI; VG.add(G); // Vorderseite zum Weg
      const pl=new THREE.MeshLambertMaterial({map:streifenTex(F,8,true),side:THREE.DoubleSide}); for(const [x,z,hh] of [[-1.4,.8,2.2],[1.4,.8,2.2],[-1.4,-.8,2.6],[1.4,-.8,2.6]]) box(G,.1,hh,.1,holzD,x,hh/2,z);
      box(G,3,.08,1.4,holz,0,.9,.1); box(G,2.9,.8,.05,holzD,0,.5,.78); const pn=box(G,3.3,.06,2,pl,0,2.45,0); pn.rotation.x=-.2; ware(G);
      const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.5),schild(txt)); sg.position.set(0,2.0,.83); G.add(sg); leut(a-.8,u-2.2,yB(a),0); if(q()<.7) leut(a+.9,u-2.4,yB(a),0); };
    stand(12,11.5,['#c62f24','#f2ece0'],'Met & Bier',G=>{ const f=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.9,12),holz); f.rotation.z=Math.PI/2; f.position.set(-.6,1.36,0); G.add(f);
      for(let i=0;i<5;i++) box(G,.13,.18,.13,M('#8a6a44'),.3+i*.22,1.03,.35); });
    stand(24,11.5,['#2f6b3a','#efe4c8'],'Brot',G=>{ for(let i=0;i<6;i++){ const b=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),M(i%2?'#a8743a':'#c48a4a')); b.scale.set(1.5,.7,1); b.position.set(-1.1+i*.42,1.03,.1+(i%2)*.3); G.add(b); }
      for(let i=0;i<3;i++){ const br=new THREE.Mesh(new THREE.TorusGeometry(.12,.04,5,10),M('#9a5a2a')); br.rotation.x=-Math.PI/2; br.position.set(-.8+i*.6,.99,.5); G.add(br); } });
    stand(36,11.5,['#1f4e8c','#efe4c8'],'Käs & Obst',G=>{ for(let i=0;i<3;i++){ const k=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.16,12),M('#e0b84a')); k.position.set(-1+i*.6,1.02,.15); G.add(k); }
      for(let i=0;i<8;i++){ const ap=new THREE.Mesh(new THREE.SphereGeometry(.08,6,5),M(i%3?'#c0392b':'#7a9a3a')); ap.position.set(.6+(i%4)*.18,1.02,.1+(i>>2)*.25); G.add(ap); } });
    // Spanferkel am Spieß über dem Feuer, Rauch steigt auf
    { const a=AT+1, u=-15, y=yB(a); for(let i=0;i<9;i++){ const al=i/9*Math.PI*2, st=new THREE.Mesh(new THREE.DodecahedronGeometry(.22,0),M('#8a8278')); st.position.set(a+Math.cos(al)*.9,y+.1,u+Math.sin(al)*.9); VG.add(st); }
      for(const r of [.4,-.6,1.4]){ const lg=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1.4,6),holzD); lg.rotation.set(Math.PI/2,0,r); lg.position.set(a,y+.15,u); VG.add(lg); } flamme(a,y,u);
      for(const da of [-1.3,1.3]){ stange(holzD,[a+da,y,u],[a+da,y+1.5,u]); } stange(M('#5a5a5a'),[a-1.5,y+1.45,u],[a+1.5,y+1.45,u]);
      const ferkel=new THREE.Mesh(new THREE.SphereGeometry(.5,12,8),M('#b0704a')); ferkel.scale.set(1.5,.6,.65); ferkel.position.set(a,y+1.45,u); VG.add(ferkel); A.ferkel=ferkel; rauch(a,y+1.9,u,6);
      for(const [da,du] of [[-2.4,-1.5],[2.2,-1.8],[0,-2.4]]) leut(a+da,u+du,y,Math.atan2(-da,-du)); }
    // Bierbänke mit Krügen, Leute sitzen beidseitig
    for(const a0 of [14,28]){ const y=yB(a0+2.5); box(VG,5,.08,1,holz,a0+2.5,y+.8,6.9); for(const uu of [6.1,7.7]) box(VG,5,.07,.32,holz,a0+2.5,y+.45,uu); for(const x of [a0+.4,a0+4.6]) box(VG,.1,.8,.8,holzD,x,y+.4,6.9);
      for(let i=0;i<4;i++) box(VG,.12,.17,.12,M('#8a6a44'),a0+.8+i*1.2,y+.92,6.9+(i%2?.25:-.25));
      for(let x=a0+.6;x<a0+4.6;x+=1){ if(q()<.8) leut(x,6.0,y,0,.72); if(q()<.8) leut(x,7.8,y,Math.PI,.72); } }
    // Burgweg: nach dem Ziel geht das Kopfsteinpflaster bis vor den Palas weiter
    { const pf=canvasTex(128,64,g=>{ g.fillStyle='#6e6a64'; g.fillRect(0,0,128,64); for(let y=0;y<64;y+=8) for(let x=(y/8%2)*5-5;x<128;x+=10){ const v=95+Math.random()*45|0; g.fillStyle=`rgb(${v},${v-4},${v-10})`; g.fillRect(x+1,y+1,8,6); } });
      pf.wrapS=pf.wrapT=THREE.RepeatWrapping; pf.repeat.set(38/3.2,2*w/1.6); vbox(38,.1,2*w,new THREE.MeshLambertMaterial({map:pf}),AT+19,yR(AT)+.07,0); }
    // Links nach dem Ziel: Pferdestall mit Strohdach, Schmiede mit glühender Esse, Holzstapel, Karren, Hühner; rechts vor der Burg ein Ziehbrunnen
    const stroh=hMat('strohDach',()=>{ const t=dachTex('#a8925c'); t.wrapS=t.wrapT=THREE.RepeatWrapping; return new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}); }), fw=glowMat(fachTex(false));
    { const a=AT+14, u=-16, y=yB(a); vbox(12,3.2,.3,fw,a,y+1.6,u-3); for(const da of [-6,6]) vbox(.3,3.2,6,fw,a+da,y+1.6,u); for(const da of [-2,2]) vbox(.15,1.6,4.6,holzD,a+da,y+.8,u-.6);
      for(const da of [-6,-2,2,6]) vbox(.22,3.2,.22,holzD,a+da,y+1.6,u+3); for(const da of [-4,0,4]) vbox(3.4,1.25,.1,holz,a+da,y+.62,u+2.9); // Pfosten, halbe Stalltüren
      const rf=new THREE.Mesh(dachGeo(12,6,13.4,7.4,2.6),[stroh,fw]); rf.position.set(a,y+3.2,u); VG.add(rf);
      [['#6b4a2e','#2e2018'],['#2a2420','#1a1410'],['#c9c0b0','#8a8078']].forEach(([fell,mh],i)=>{ const P=new THREE.Group(); P.position.set(a-4+i*4,y+1.2,u+2.7); P.rotation.y=-Math.PI/2; VG.add(P);
        const hals=box(P,.75,.32,.28,M(fell),.25,.2,0); hals.rotation.z=.7; box(P,.55,.24,.22,M(fell),.62,.38,0).rotation.z=-.5; box(P,.5,.06,.06,M(mh),.2,.4,0).rotation.z=.7;
        for(const zz of [-.06,.06]){ const o=new THREE.Mesh(new THREE.ConeGeometry(.04,.13,5),M(fell)); o.position.set(.45,.6,zz); P.add(o); } A.pferde.push({P,ph:i*1.7}); }); // Pferdeköpfe schauen heraus
      for(const da of [-5.4,-3.9]){ vbox(1.2,.55,.6,M('#d8c070'),a+da,y+.28,u+4.6); } vbox(2,.5,.6,holz,a+4,y+.25,u+4.4); vbox(1.9,.04,.5,M('#6d8f93'),a+4,y+.49,u+4.4); } // Heuballen, Tränke
    { const a=AT+28, u=-15, y=yB(a); for(const [da,du] of [[-3,-3],[3,-3],[-3,3],[3,3]]) vbox(.22,3,.22,holzD,a+da,y+1.5,u+du); const rf=vbox(7,.18,7,dach,a,y+3.1,u); rf.rotation.x=.12;
      vbox(1.8,1,1.5,sand,a-1.6,y+.5,u-2); const glut=vbox(1.2,.1,1,new THREE.MeshBasicMaterial({color:'#ff6a1a'}),a-1.6,y+1.04,u-2); A.flammen.push(glut); vbox(.8,3.2,.8,sand,a-1.6,y+2.6,u-2.6); rauch(a-1.6,y+4.3,u-2.6,4); flamme(a-1.6,y+1,u-2,.5);
      vbox(.45,.55,.45,holzD,a+.6,y+.28,u); const amb=vbox(.75,.28,.3,M('#3a3a3e'),a+.6,y+.69,u); const sm=W(a+.6,u+1.1); sm.y=y; const m=mensch(sm,W(a+.6,u),'#4a3a2a','#2a2a2a',()=>{},{rock:'#5a3a22',band:'#3a2a1c'}); // Schmied mit Lederschürze
      const H=new THREE.Group(); H.position.y=-.62; m.arme[1].add(H); box(H,.04,.4,.04,holzD,0,-.15,0); box(H,.16,.08,.08,M('#5f6266'),0,-.36,0); A.schmied={m,amb:W(a+.6,u),ay:y+.85};
      for(const [da,du] of [[2.6,2.4],[3.2,1.6]]){ const f=new THREE.Mesh(new THREE.CylinderGeometry(.35,.32,.85,10),holz); f.position.set(a+da,y+.42,u+du); VG.add(f); } }
    { const a=AT+23.5, u=-18.5, y=yB(a); [[0,0],[.42,0],[.84,0],[.21,.38],[.63,.38],[.42,.76]].forEach(([dz,dy])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,3,7),holzD); l.rotation.z=Math.PI/2; l.position.set(a,y+.2+dy,u+dz); VG.add(l); }); } // Holzstapel
    { const a=AT+36, u=-12, y=yB(a); vbox(2.4,.12,1.3,holz,a,y+.85,u); for(const dz of [-.6,.6]) vbox(2.4,.3,.06,holz,a,y+1.05,u+dz); for(const dz of [-.75,.75]){ const r=new THREE.Mesh(new THREE.TorusGeometry(.48,.05,5,16),holzD); r.position.set(a-.2,y+.48,u+dz); VG.add(r); }
      stange(holz,[a+1.1,y+.85,u-.4],[a+2.6,y+.05,u-.3]); stange(holz,[a+1.1,y+.85,u+.4],[a+2.6,y+.05,u+.3]); }
    for(let i=0;i<7;i++){ const P=new THREE.Group(), a=AT+5+q()*14, u=-10-q()*2.5; P.position.set(a,yB(a),u); P.rotation.y=q()*6.3; VG.add(P); const k=new THREE.Mesh(new THREE.SphereGeometry(.15,8,6),M(q()<.5?'#f2ece0':'#a0602a')); k.scale.set(1.2,.9,.8); k.position.y=.2; P.add(k);
      const kopf=new THREE.Group(); kopf.position.set(.17,.32,0); P.add(kopf); const kh=new THREE.Mesh(new THREE.SphereGeometry(.07,6,5),k.material); kopf.add(kh); const ka=box(kopf,.03,.06,.02,M('#d22a1a'),0,.07,0); box(kopf,.06,.02,.02,M('#e0a020'),.07,-.01,0); A.huehner.push({kopf,P,ph:q()*6}); } // Hühner picken
    { const a=AT+21, u=8.5, y=yB(a); const b=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.4,.8,10),sand); b.position.set(a,y+.4,u); VG.add(b); const wa=new THREE.Mesh(new THREE.CylinderGeometry(1.12,1.12,.04,14),new THREE.MeshPhongMaterial({color:'#4d6d72',shininess:50})); wa.position.set(a,y+.7,u); VG.add(wa);
      for(const du of [-1.2,1.2]) vbox(.14,2.4,.14,holzD,a,y+1.2,u+du); vbox(.12,.12,2.6,holz,a,y+2.3,u); const dw=new THREE.Mesh(dachGeo(1.6,2.8,1.9,3.1,.8),[stroh,holz]); dw.rotation.y=Math.PI/2; dw.position.set(a,y+2.4,u); VG.add(dw);
      const ei=new THREE.Mesh(new THREE.CylinderGeometry(.16,.13,.25,8),holz); ei.position.set(a,y+1.4,u); VG.add(ei); for(let i=0;i<5;i++){ const al=i/5*6.28+.4; leut(a+Math.cos(al)*2.4,u+Math.sin(al)*2.4,y,Math.atan2(-Math.cos(al),-Math.sin(al))); } } // Ziehbrunnen, Leute plaudern drumherum
    const vi=(geo,list)=>{ const im=new THREE.InstancedMesh(geo,lam('#fff'),list.length); VG.add(im); return im; };
    A.volk={L:V2, body:vi(new THREE.CylinderGeometry(.17,.27,1.3,8),V2), head:vi(new THREE.SphereGeometry(.12,8,6),V2), hut:[null,vi(new THREE.ConeGeometry(.1,.5,8),V2.filter(o=>o.hut===1)),vi(new THREE.CylinderGeometry(.16,.15,.07,10),V2.filter(o=>o.hut===2)),vi(new THREE.SphereGeometry(.14,8,6,0,Math.PI*2,0,Math.PI*.6),V2.filter(o=>o.hut===3))],
      arm:vi(new THREE.CylinderGeometry(.045,.045,.55,5),V2.flatMap(o=>[o,o])), mitte:W(AT/2,0)}; poseVolk(0,true);
  }
  // Leute am Weg: Bauern und Bäuerinnen im Dorf und im Tal, Mönche im Wald – winken, wenn man vorbeifährt
  for(const [d,s2,art,o] of VOLK_WEG){ const f=fr(d), u=rw(d)+o, x=f.px+f.nx*s2*u, z=f.py+f.ny*s2*u, p={x,y:o<1?roadY(d)+.15:terrainAt(x,z),z}, bl={x:f.px,z:f.py};
    const m=art==='moench'?mensch(p,bl,'#5a4128','#3a2a1c',HUT.kapuze,{lang:1,guertel:'#e8e0cc'}):art==='baeuerin'?mensch(p,bl,['#8a3b2e','#3f6b4a','#6b5a8a'][d%3],'#3a2a1c',HUT.tuch,{lang:1}):mensch(p,bl,['#8a6a44','#6b7a4a','#7a5a3a'][d%3],'#5b4a36',HUT.stroh);
    A.winker.push({m,x,z,ph:d}); }
  // ---------- Zehntscheune hinter dem Bauernfest: riesig und hoch, dunkle Bretter mit Balkenwerk, Strohdach, offenes Tor mit Heu, Ladeluken mit Lastbalken; daneben Leiterwagen, Strohballen, Holzstapel ----------
  sicher('Scheune',()=>{ const C=SCHEUNE, s=FEST.s, f=fr(C.d), o=rw(C.d)+(zOpt(R,C.d).geh??SIDEWALK)+C.u+C.T/2, x=f.px+f.nx*s*o, z=f.py+f.ny*s*o, L=C.L, T=C.T, H=C.H, y0=.2;
    const G=new THREE.Group(); G.position.set(x,terrainAt(x,z),z); G.rotation.y=Math.atan2(-Math.sin(f.h)*-s, Math.cos(f.h)*-s); world.add(G); // lokal: +z zur Straße, x längs der Straße
    const BT=canvasTex(64,64,g=>{ for(let x=0;x<64;x+=8){ const v=.75+Math.random()*.3; g.fillStyle=`rgb(${74*v|0},${54*v|0},${38*v|0})`; g.fillRect(x,0,8,64); g.fillStyle='rgba(15,8,4,.6)'; g.fillRect(x+7,0,1,64); }
      for(let i=0;i<50;i++){ g.fillStyle='rgba(20,12,6,.3)'; g.fillRect(Math.random()*64,Math.random()*64,1,3+Math.random()*9); } }); // dunkle, verwitterte Bretter
    const brett=(rx,ry)=>{ const t=BT.clone(); t.needsUpdate=true; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry); return new THREE.MeshLambertMaterial({map:t}); }, balk=M('#2b1d12'), heu=M('#d8c070');
    const ST=canvasTex(128,128,g=>{ g.fillStyle='#a08a55'; g.fillRect(0,0,128,128); for(let y=0;y<128;y+=8){ g.fillStyle='rgba(60,45,20,.35)'; g.fillRect(0,y+6,128,2); }
      for(let i=0;i<500;i++){ const v=Math.random(); g.fillStyle=v<.5?'rgba(200,180,120,.5)':'rgba(90,70,35,.4)'; g.fillRect(Math.random()*128,Math.random()*128,1,4+Math.random()*7); } }); ST.wrapS=ST.wrapT=THREE.RepeatWrapping; ST.repeat.set(.5,.6); // Stroh in Lagen
    box(G,L+.4,3.2,T+.4,sand,0,y0-1.6,0); // Sandsteinsockel bis unters Gelände
    const tw=6.4, th=5.8; // Tor
    box(G,L,H,.3,brett(L/3,H/3),0,y0+H/2,-T/2); for(const sx of [-1,1]) box(G,.3,H,T,brett(T/3,H/3),sx*L/2,y0+H/2,0);
    for(const sx of [-1,1]) box(G,(L-tw)/2,H,.3,brett((L-tw)/6,H/3),sx*(L+tw)/4,y0+H/2,T/2); box(G,tw,H-th,.3,brett(tw/3,(H-th)/3),0,y0+th+(H-th)/2,T/2);
    for(let i=0;i<=8;i++){ const px=-L/2+i*L/8; if(Math.abs(px)<tw/2+.1) continue; for(const sz of [-1,1]) box(G,.4,H,.45,balk,px,y0+H/2,sz*(T/2+.05)); } // Ständer
    for(const sz of [-1,1]) for(const sx of [-1,1]) box(G,.45,H,.4,balk,sx*(L/2+.05),y0+H/2,sz*(T/2-.2));
    for(const yy of [2.8,H-.2]){ box(G,L+.1,.32,.45,balk,0,y0+yy,-T/2-.05); for(const sx of [-1,1]){ box(G,.45,.32,T,balk,sx*(L/2+.05),y0+yy,0); if(yy<th) box(G,(L-tw)/2,.32,.45,balk,sx*(L+tw)/4,y0+yy,T/2+.05); } } box(G,L+.1,.32,.45,balk,0,y0+H-.2,T/2+.05); // Riegel
    for(const sx of [-1,1]) for(let i=0;i<4;i++){ const px=sx*(tw/2+1.3+i*2.6); const k=box(G,.25,3.4,.3,balk,px,y0+4.6,T/2+.1); k.rotation.z=sx*.6*(i%2?1:-1); } // Kopfbänder
    box(G,tw+.8,.5,.5,balk,0,y0+th+.25,T/2+.1); // Torsturz
    // Tor offen: zwei Flügel mit Z-Strebe; drinnen dunkel, Heu bis unters Dach
    for(const sx of [-1,1]){ const fl=new THREE.Group(); fl.position.set(sx*tw/2,y0,T/2+.2); G.add(fl); fl.rotation.y=sx<0?-1.8:1.8; // weit nach außen aufgeschlagen
      box(fl,tw/2,th,.15,brett(1,2),-sx*tw/4,th/2,0); for(const yy of [.6,th-.6]) box(fl,tw/2,.25,.22,balk,-sx*tw/4,yy,0); const zs=box(fl,.22,th*1.05,.22,balk,-sx*tw/4,th/2,0); zs.rotation.z=sx*.5; }
    box(G,L-.6,.1,T-.6,M('#4a3a26'),0,y0+.05,0); box(G,L-.8,H-.4,.05,M('#1c130b'),0,y0+H/2,-T/2+.25); // Lehmboden, dunkle Rückwand innen
    for(const [hx,hy,hz,sx,sy,sz] of [[-3,1.6,-3,3.5,2,2.6],[2.5,1.4,-3.4,3,1.7,2.2],[-.5,3.4,-3.8,3.2,1.4,1.8],[6,1.2,-2.5,2,1.3,2],[-7,1.3,-2,2.4,1.4,2.4]]){ const h=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),heu); h.position.set(hx,y0+hy,hz); h.scale.set(sx,sy,sz); G.add(h); }
    // Strohdach (First längs), Firstwulst, Giebel in Brettern
    const rf=new THREE.Mesh(dachGeo(L,T,L+1.8,T+2,C.F),[new THREE.MeshLambertMaterial({map:ST,side:THREE.DoubleSide}),brett(T/3,C.F/3)]); rf.position.y=y0+H; G.add(rf);
    const fw=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,L+1.8,10),M('#8a7548')); fw.rotation.z=Math.PI/2; fw.position.y=y0+H+C.F+.05; G.add(fw);
    // Ladeluken in beiden Giebeln mit Lastbalken, Seilrolle und Seil, Heu schaut heraus
    for(const sx of [-1,1]){ const gx=sx*(L/2+.03), ly=y0+H+2.2; box(G,.06,2.4,2,M('#1c130b'),gx,ly,0); box(G,.3,.3,2.6,balk,gx+sx*.05,ly+1.3,0); box(G,.3,.3,2.6,balk,gx+sx*.05,ly-1.3,0);
      const lb=box(G,2.6,.35,.35,balk,gx+sx*1.1,ly+2.6,0); const ro=new THREE.Mesh(new THREE.TorusGeometry(.22,.06,6,12),M('#5a4128')); ro.position.set(gx+sx*2.2,ly+2.3,0); G.add(ro);
      const se=cyl(.025,M('#c9b28a')); place(se,[gx+sx*2.42,ly+2.3,0],[gx+sx*2.42,ly-1.4,0]); G.add(se); const hu=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,1),heu); hu.scale.set(.9,.6,1.1); hu.position.set(gx,ly-1,0); G.add(hu); }
    // Daneben: Leiterwagen mit Heu (Startseite), Strohballen am Tor, Holzstapel an der Zielseite
    { const W=new THREE.Group(); W.position.set(-L/2-3.2,y0,3); W.rotation.y=.25; G.add(W); box(W,3.2,.14,1.5,holz,0,1,0); for(const zz of [-.78,.78]){ for(const yy of [1.35,1.85]) box(W,3.4,.08,.08,holz,0,yy,zz); for(let i=-3;i<=3;i++) box(W,.06,.9,.06,holz,i*.5,1.45,zz); }
      for(const [wx,wz] of [[-1.1,.85],[-1.1,-.85],[1.1,.85],[1.1,-.85]]){ const r=new THREE.Mesh(new THREE.TorusGeometry(.5,.06,5,16),holzD); r.position.set(wx,.52,wz); W.add(r); for(let i=0;i<4;i++){ const sp=box(W,.04,.98,.04,holz,wx,.52,wz); sp.rotation.z=i/4*Math.PI; } }
      const dh=cyl(.05,holz); place(dh,[1.6,.9,0],[3.4,.5,0]); W.add(dh); const hm=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),heu); hm.scale.set(1.8,.8,.9); hm.position.y=1.8; W.add(hm); }
    for(const [bx,by,bz,r] of [[-tw/2-2,.3,T/2+1.2,.1],[-tw/2-3.3,.3,T/2+1.1,-.1],[-tw/2-2.6,.9,T/2+1.15,.05],[tw/2+2.2,.3,T/2+1.1,.2]]){ const b=box(G,1.2,.6,.65,heu,bx,y0+by,bz); b.rotation.y=r; }
    for(let i=0;i<4;i++) for(let j=0;j<7-i;j++){ const l=cyl(.17,M(['#6b4a32','#7a5a3a','#5a3e28'][(i+j)%3])); l.scale.y=2.4; l.rotation.z=Math.PI/2; l.position.set(L/2+1.4,y0+.2+i*.32,-T/2+1.5+j*.36+i*.18); G.add(l); } // Holzstapel an der Seitenwand, Scheite quer
  });
  // ---------- Friedhof links neben dem Vorlauf: Sandsteinmauer mit Torbogen, Kapelle mit Glockentürmchen, alte Linde, Eiben, schiefe Kreuze, Grabsteine, frisches Grab mit Schaufel ----------
  sicher('Friedhof',()=>{ const F=FRIEDHOF, s=FEST.s, f=fr(3), dm=(F.d0+F.d1)/2-3, um=(F.u0+F.u1)/2, o=rw(3)+(zOpt(R,3).geh??SIDEWALK)+um, BX=F.d1-F.d0, BZ=F.u1-F.u0;
    const x=f.px+Math.cos(f.h)*dm+f.nx*s*o, z=f.py+Math.sin(f.h)*dm+f.ny*s*o, G=new THREE.Group(); G.position.set(x,terrainAt(x,z),z); G.rotation.y=Math.atan2(-Math.sin(f.h)*-s, Math.cos(f.h)*-s); world.add(G); G.updateMatrixWorld(); // lokal: +z zur Straße
    const v=new THREE.Vector3(), yAt=(lx,lz)=>{ v.set(lx,0,lz); G.localToWorld(v); return terrainAt(v.x,v.z)-G.position.y; }, q=rng(66);
    const stein=M('#b89a82'), grau=M('#9a948c'), erde=M('#5a4128'), gruen=M('#3f6b32'), dunkel=M('#24402a');
    // Mauer in Stücken, folgt dem Gelände; Lücke vorn für das Tor
    const mauer=(x0,z0,x1,z1)=>{ const L=Math.hypot(x1-x0,z1-z0), n=Math.ceil(L/2); for(let i=0;i<n;i++){ const a=(i+.5)/n, mx=x0+(x1-x0)*a, mz=z0+(z1-z0)*a, y=yAt(mx,mz); box(G,L/n+.05,1.6,.5,sand,mx,y+.3,mz,-Math.atan2(z1-z0,x1-x0)); box(G,L/n+.1,.12,.62,stein,mx,y+1.16,mz,-Math.atan2(z1-z0,x1-x0)); } };
    const hx=BX/2, hz=BZ/2; mauer(-hx,-hz,hx,-hz); mauer(-hx,-hz,-hx,hz); mauer(hx,-hz,hx,hz); mauer(-hx,hz,-1.3,hz); mauer(1.3,hz,hx,hz);
    { const y=yAt(0,hz); for(const sx of [-1,1]) box(G,.6,2.3,.7,sand,sx*1.3,y+.95,hz); const bo=new THREE.Mesh(new THREE.TorusGeometry(1.3,.22,6,12,Math.PI),sand); bo.position.set(0,y+2.1,hz); G.add(bo); // Torbogen mit Dächlein und Kreuz
      for(const k of [-1,1]){ const dd=box(G,1.7,.06,.9,dach,k*.6,y+3.5,hz); dd.rotation.z=k*-.6; } box(G,.08,.5,.08,holzD,0,y+4.1,hz); box(G,.3,.08,.08,holzD,0,y+4.2,hz); }
    // Kapelle hinten links mit Glockentürmchen
    { const cx=-hx+4.5, cz=-hz+4.5, y=yAt(cx,cz); box(G,5,7,6.5,sand,cx,y+1.5,cz); const rf=new THREE.Mesh(dachGeo(6.5,5,7.3,5.8,3.4),[dach,sand]); rf.rotation.y=Math.PI/2; rf.position.set(cx,y+5,cz); G.add(rf);
      box(G,1.3,2.2,.06,M('#2b2420'),cx,y+1.1,cz+3.26); const tb=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,.06,12,1,false,0,Math.PI),M('#2b2420')); tb.rotation.set(Math.PI/2,0,Math.PI/2); tb.position.set(cx,y+2.2,cz+3.27); G.add(tb); // Tür mit Rundbogen
      box(G,1.2,1.6,1.2,bretter,cx,y+9,cz+2.2); const tz=new THREE.Mesh(new THREE.ConeGeometry(1.05,1.8,4),dach); tz.rotation.y=Math.PI/4; tz.position.set(cx,y+10.7,cz+2.2); G.add(tz);
      const gl=new THREE.Mesh(new THREE.CylinderGeometry(.2,.32,.45,10),M('#b8862a')); gl.position.set(cx,y+8.9,cz+2.2); G.add(gl); box(G,.08,.8,.08,holzD,cx,y+12,cz+2.2); box(G,.45,.08,.08,holzD,cx,y+12.15,cz+2.2); } // Glocke, Kreuz auf der Spitze
    // Alte Linde in der Mitte, zwei dunkle Eiben
    { const y=yAt(2,-1.5), st=cyl(.55,M('#4e3a2a'),.4); place(st,[2,y,-1.5],[2,y+5,-1.5]); G.add(st);
      for(const [kx,ky,kz,r] of [[2,y+8,-1.5,4.6],[-.5,y+7,-.5,3.2],[4.6,y+7.2,-2.6,3.4],[1.5,y+9.6,-3,3],[3.5,y+6.4,.8,2.6]]){ const k=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),M(q()<.5?'#4f7a36':'#5a8640')); k.position.set(kx,ky,kz); k.scale.y=.85; G.add(k); } }
    for(const [ex,ez] of [[hx-3,-hz+3],[hx-2.5,hz-3.5]]){ const y=yAt(ex,ez), e=new THREE.Mesh(new THREE.SphereGeometry(1.3,10,8),dunkel); e.scale.set(1,2.4,1); e.position.set(ex,y+2.6,ez); G.add(e); }
    // Gräber in Reihen: Hügel, Holzkreuz oder Grabstein, schief gestellt
    for(let r2=0;r2<3;r2++) for(let i=0;i<6;i++){ const gx=-hx+8.5+i*1.9+(q()-.5)*.4, gz=-hz+6+r2*4.2; if(Math.hypot(gx-2,gz+1.5)<2.2||q()<.15) continue; const y=yAt(gx,gz);
      const h=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),q()<.6?gruen:M('#4e5a30')); h.scale.set(.5,.22,1); h.position.set(gx,y,gz); G.add(h);
      const K=new THREE.Group(); K.position.set(gx,y,gz-1.05); K.rotation.set((q()-.5)*.35,(q()-.5)*.4,(q()-.5)*.3); G.add(K);
      if(q()<.55){ box(K,.1,1.1,.1,holzD,0,.55,0); box(K,.55,.09,.09,holzD,0,.8,0); } else { box(K,.6,.75,.15,grau,0,.37,0); const ob=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.15,12,1,false,0,Math.PI),grau); ob.rotation.set(Math.PI/2,0,Math.PI/2); ob.position.y=.75; K.add(ob); } }
    { const gx=hx-4.5, gz=hz-4, y=yAt(gx,gz), h=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),erde); h.scale.set(.65,.35,1.15); h.position.set(gx,y,gz); G.add(h); // frisches Grab, Schaufel steckt drin
      const sf=cyl(.03,holz); place(sf,[gx+.9,y+.1,gz],[gx+1.1,y+1.4,gz+.2]); G.add(sf); const bl=box(G,.28,.35,.04,M('#6a6e72'),gx+.88,y+.05,gz-.01); bl.rotation.z=.15; box(G,.08,1.2,.08,holzD,gx,y+.6,gz-1.2); box(G,.5,.08,.08,holzD,gx,y+.85,gz-1.2); }
  });
  // ---------- Bauernfest links am Start: Tanzbaum mit Reigen, Musikanten, Gaukler, Tanzbär mit Bärenführer, Festtafel mit Zechern, Bierfass, Wimpelketten, Kinder ----------
  { const s=FEST.s, at=(d,u)=>{ const f=fr(d), o=rw(d)+(zOpt(R,d).geh??SIDEWALK)+u, x=f.px+f.nx*s*o, z=f.py+f.ny*s*o; return {x,y:terrainAt(x,z),z,h:f.h}; }; // u: Meter neben dem Gehweg
    const grp=p=>{ const G=new THREE.Group(); G.position.set(p.x,p.y,p.z); G.rotation.y=Math.atan2(-Math.sin(p.h)*-s, Math.cos(p.h)*-s); world.add(G); return G; }; // lokal: +z zur Straße, +x Richtung Ziel
    const TB=at(12.5,10), F=A.fest={x:TB.x, y:TB.y, z:TB.z, tanz:[], musik:[], kinder:[], zecher:[], v1:new THREE.Vector3(), v2:new THREE.Vector3()}, strasse=d=>{ const f=fr(d); return {x:f.px,z:f.py}; };
    const narr=k=>{ const c=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8,0,Math.PI*2,0,Math.PI*.55),M('#c62f24')); c.position.y=.11; k.add(c); // Narrenkappe mit zwei Zipfeln und Schellen
      for(const sx of [-1,1]){ const z=new THREE.Mesh(new THREE.ConeGeometry(.06,.32,8),M(sx<0?'#e2b33a':'#c62f24')); z.position.set(sx*.16,.28,0); z.rotation.z=-sx*.9; k.add(z); const gl=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),M('#f2d24a')); gl.position.set(sx*.3,.39,0); k.add(gl); } };
    const filz=k=>{ const r=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.02,12),M('#4a3a2a')); r.position.y=.17; k.add(r); const c=new THREE.Mesh(new THREE.ConeGeometry(.14,.22,10),M('#4a3a2a')); c.position.y=.28; k.add(c); const fd=box(k,.02,.26,.05,M('#e8e2d6'),.12,.33,-.04); fd.rotation.z=-.5; };
    const krug=(arm,c)=>{ const k=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,.17,8),M(c)); k.position.set(0,-.66,.05); arm.add(k); };
    // Tanzbaum: Stamm mit Querholz, Kranz mit Bändern, Schinken und Wurst, Wetterhahn
    { const tb=grp(TB), st=new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,9,8),holz); st.position.y=4.5; tb.add(st); box(tb,2.6,.12,.12,holzD,0,7.6,0);
      const kr=new THREE.Mesh(new THREE.TorusGeometry(.55,.1,6,16),M('#3f6b32')); kr.position.y=6.2; kr.rotation.x=Math.PI/2; tb.add(kr);
      ['#c62f24','#e2b33a','#1f4e8c','#f2ece0','#2f6b3a','#d06a9a'].forEach((c,i)=>{ const a=i/6*Math.PI*2, b=box(tb,.07,2.4,.02,M(c),Math.cos(a)*.75,5,Math.sin(a)*.75); b.rotation.set(-Math.sin(a)*.2,0,Math.cos(a)*.2); });
      box(tb,.02,.5,.02,holzD,-1.1,7.3,0); const sk=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),M('#9a4a32')); sk.scale.set(.8,1.4,.6); sk.position.set(-1.1,6.85,0); tb.add(sk); // Schinken
      box(tb,.02,.4,.02,holzD,1.1,7.35,0); const wu=cyl(.06,M('#7a3a28')); place(wu,[1.1,7.15,0],[1.1,6.55,0]); tb.add(wu); // Wurst
      const hn=new THREE.Group(); hn.position.y=9.15; tb.add(hn); const gd=M('#d9a62b'), hb=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),gd); hb.scale.set(1.3,1,.7); hn.add(hb);
      const hk=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),gd); hk.position.set(.22,.22,0); hn.add(hk); box(hn,.14,.1,.03,M('#c62f24'),.22,.37,0);
      const sn=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,5),M('#e8b423')); sn.rotation.z=-Math.PI/2; sn.position.set(.38,.21,0); hn.add(sn);
      const sw=new THREE.Mesh(new THREE.ConeGeometry(.16,.45,6),M('#2e2a24')); sw.position.set(-.3,.22,0); sw.rotation.z=.6; hn.add(sw); for(const z of [-.08,.08]) box(hn,.03,.25,.03,gd,0,-.3,z); }
    // Reigen: Bauern und Bäuerinnen Hand in Hand um den Tanzbaum (dreht sich, alle hüpfen)
    { const rg=new THREE.Group(); rg.position.set(TB.x,TB.y,TB.z); world.add(rg); F.reigen=rg;
      [['#e2b33a','#3a5a8a'],['#c62f24','#e8dcc0'],['#d48aa0','#3a2a1c'],['#3f7a3a','#c9b28a'],['#e8dcc0','#7a1f1f'],['#c9733a','#3a3a3e'],['#6b5a8a','#d8c070']].forEach(([k,h],i,L)=>{ const a=i/L.length*Math.PI*2, frau=i%2;
        const m=mensch({x:Math.cos(a)*2,y:0,z:Math.sin(a)*2},{x:0,z:0},k,h,frau?HUT.tuch:[HUT.stroh,HUT.kapuze,narr][(i/2|0)%3],frau?{lang:1}:{aermel:h}); rg.add(m.G); m.arme[0].rotation.z=-1.25; m.arme[1].rotation.z=1.25; F.tanz.push({m,i}); }); }
    // Musikanten: Dudelsackpfeifer und Schalmeibläser spielen zum Reigen
    { const d=mensch(at(6.6,8.4),TB,'#3f7a3a','#7a1f1f',HUT.stroh,{aermel:'#e2b33a'}); d.arme[0].rotation.x=-.9; d.arme[1].rotation.x=-1.1; d.arme[0].rotation.z=.35; d.arme[1].rotation.z=-.3;
      const sack=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),M('#8a3b2e')); sack.scale.set(1,.8,1.2); sack.position.set(-.2,1.2,.22); d.G.add(sack);
      for(const [x,z,L] of [[-.3,.1,.75],[-.18,.05,.6],[-.06,0,.5]]){ const p=cyl(.025,holzD); place(p,[-.2,1.25,.2],[x,1.25+L,z-.15]); d.G.add(p); } // Bordunpfeifen über der Schulter
      const ch=cyl(.025,holzD,.04); place(ch,[0,1.52,.15],[.02,1.02,.45]); d.G.add(ch); F.musik.push({m:d,ph:0}); // Spielpfeife
      const b=mensch(at(7.4,11.4),TB,'#c9733a','#3a5a8a',filz,{aermel:'#7a1f1f'}); b.arme[0].rotation.x=b.arme[1].rotation.x=-1.15; b.arme[0].rotation.z=.3; b.arme[1].rotation.z=-.3;
      const sc2=cyl(.07,holz,.02); place(sc2,[0,1.56,.13],[0,1.16,.75]); b.G.add(sc2); F.musik.push({m:b,ph:2}); } // Schalmei mit Schallbecher
    // Gaukler auf seiner Decke: jongliert drei Bälle, vor ihm ein Hut mit Münzen
    { const p=at(6,3.6), m=mensch(p,strasse(6),'#c62f24','#e2b33a',narr,{aermel:'#e2b33a',guertel:'#1f4e8c'});
      const hf=new THREE.Mesh(new THREE.CylinderGeometry(.185,.275,.95,10,1,false,0,Math.PI),M('#e2b33a')); hf.position.y=.95; m.G.add(hf); // Kittel halb rot, halb gelb
      const kg=new THREE.Mesh(new THREE.ConeGeometry(.33,.2,8,1,true),new THREE.MeshLambertMaterial({color:'#1f4e8c',side:THREE.DoubleSide})); kg.position.y=1.36; m.G.add(kg); m.kopf.rotation.x=-.25;
      const dg=grp(p); box(dg,2.2,.03,1.6,new THREE.MeshLambertMaterial({map:streifenTex(['#7a1f1f','#e2b33a','#1f4e8c'],6,true)}),0,.02,0);
      const hp=at(6.9,2.2), hg=grp(hp), hr=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.02,14),M('#3a2a1c')); hr.position.y=.02; hg.add(hr); const hc=new THREE.Mesh(new THREE.CylinderGeometry(.15,.14,.12,12,1,true),new THREE.MeshLambertMaterial({color:'#3a2a1c',side:THREE.DoubleSide})); hc.position.y=.08; hg.add(hc);
      for(let i=0;i<4;i++){ const mz=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.01,8),M('#e8b423')); mz.position.set((i%2-.5)*.1,.05+i*.01,(i>>1)*.08-.04); hg.add(mz); }
      F.gaukler={m, baelle:['#d22a1a','#1f6bd0','#2f9a3a'].map(c=>{ const b=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:.25})); m.G.add(b); return b; })}; }
    // Tanzbär mit rotem Hütchen und Halsband, Bärenführer mit Schellentrommel hält ihn an der Kette
    { const BP=at(18.5,4.4), bg=grp(BP), fell=M('#5b3a22'), fd=M('#3e2716'), sw=M('#151515'), bk=new THREE.Group(); bg.add(bk);
      for(const x of [-.17,.17]){ const l=cyl(.13,fell,.15); place(l,[x,.85,0],[x*1.15,.12,.04]); bk.add(l); const f=new THREE.Mesh(new THREE.SphereGeometry(.15,8,6),fd); f.scale.set(1,.55,1.5); f.position.set(x*1.15,.07,.1); bk.add(f); }
      const ru=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),fell); ru.scale.set(.42,.62,.36); ru.position.y=1.2; bk.add(ru); const ba=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),M('#7a5232')); ba.scale.set(.3,.42,.2); ba.position.set(0,1.12,.18); bk.add(ba);
      const kr=new THREE.Mesh(new THREE.TorusGeometry(.2,.04,6,14),M('#b3201a')); kr.position.y=1.72; kr.rotation.x=Math.PI/2; bk.add(kr);
      const kopf=new THREE.Group(); kopf.position.y=1.92; bk.add(kopf); kopf.add(new THREE.Mesh(new THREE.SphereGeometry(.23,10,8),fell)); const sn=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),M('#a07850')); sn.scale.set(1,.85,1.4); sn.position.set(0,-.05,.2); kopf.add(sn);
      const na=new THREE.Mesh(new THREE.SphereGeometry(.045,6,5),sw); na.position.set(0,-.02,.35); kopf.add(na);
      for(const x of [-.09,.09]){ const au=new THREE.Mesh(new THREE.SphereGeometry(.03,6,5),sw); au.position.set(x,.06,.19); kopf.add(au); const oh=new THREE.Mesh(new THREE.SphereGeometry(.075,6,5),fell); oh.scale.z=.5; oh.position.set(x*1.8,.19,-.02); kopf.add(oh); }
      const ht=new THREE.Mesh(new THREE.ConeGeometry(.1,.22,8),M('#c62f24')); ht.position.set(.06,.29,0); ht.rotation.z=-.25; kopf.add(ht);
      const arme=[-.33,.33].map(x=>{ const a=new THREE.Group(); a.position.set(x,1.55,.05); bk.add(a); const c=cyl(.1,fell,.09); place(c,[0,0,0],[0,-.55,0]); a.add(c); const pt=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),fd); pt.position.y=-.6; a.add(pt); return a; });
      const fu=mensch(at(20.4,4.7),BP,'#5a6b3a','#4a3a2a',filz,{aermel:'#7a5a3a'}); fu.arme[0].rotation.x=-.5;
      const tr=new THREE.Group(); tr.position.y=-.66; tr.rotation.x=Math.PI/2; fu.arme[1].add(tr); const rd=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.06,14,1,true),new THREE.MeshLambertMaterial({color:'#8a5a32',side:THREE.DoubleSide})); tr.add(rd);
      const fl=new THREE.Mesh(new THREE.CylinderGeometry(.165,.165,.01,14),M('#e8dcc0')); fl.position.y=.03; tr.add(fl); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2, sc3=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.01,8),M('#e8b423')); sc3.position.set(Math.cos(a)*.17,0,Math.sin(a)*.17); sc3.rotation.z=Math.PI/2; tr.add(sc3); } // Schellentrommel
      F.baer={G:bg, bk, arme, kopf, kr, ry:bg.rotation.y}; F.fuehrer=fu; F.kette=[0,1].map(()=>{ const c=cyl(.018,M('#8a8e93')); world.add(c); return c; }); }
    // Kinder schauen zu und klatschen
    for(const [d,u,blick,k,frau] of [[16,2.5,18.5,'#3f6b8a',0],[15.5,3.6,18.5,'#c94a2a',1],[7.9,2.1,6,'#7a9a3a',0]]){ const p=at(d,u), m=mensch(p,at(blick,4),k,'#5b4a36',frau?HUT.tuch:()=>{},frau?{lang:1}:{}); m.G.scale.setScalar(.62); m.arme[0].rotation.x=m.arme[1].rotation.x=-1.1; F.kinder.push({m,y:p.y,ph:d}); }
    // Festtafel mit weißem Tuch: Krüge, Teller, Brote; Zecher auf Bänken prosten
    { const TP=at(9.5,15), tg=grp(TP), tuch=M('#f2ede2'); box(tg,8,.08,1.3,tuch,0,.8,0); for(const z of [-.66,.66]) box(tg,8,.3,.02,tuch,0,.66,z); for(const x of [-3.7,3.7]) box(tg,.02,.3,1.3,tuch,x,.66,0);
      for(const x of [-3.5,0,3.5]) box(tg,.12,.76,1,holzD,x,.38,0); for(const z of [-.95,.95]){ box(tg,7.6,.07,.32,holz,0,.45,z); for(const x of [-3.4,0,3.4]) box(tg,.1,.42,.1,holzD,x,.21,z); }
      for(let i=0;i<9;i++){ const x=-3.4+i*.85, z=(i%2?.3:-.3); const kr=new THREE.Mesh(new THREE.CylinderGeometry(.065,.075,.18,8),M(i%3?'#9aa0a6':'#8a6a4a')); kr.position.set(x,.93,z); tg.add(kr); const tl=new THREE.Mesh(new THREE.CylinderGeometry(.14,.12,.02,12),M('#d9d4c4')); tl.position.set(x+.35,.85,-z); tg.add(tl); }
      for(const x of [-2.4,.6,2.9]){ const br=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),M('#b07a3a')); br.scale.set(1.4,.6,.9); br.position.set(x,.9,0); tg.add(br); }
      [[-3,-1,'#8a6a44'],[-1.2,-1,'#c62f24'],[.8,-1,'#e2b33a'],[2.8,-1,'#3f7a3a'],[-2,1,'#6b5a8a'],[1.8,1,'#c9733a']].forEach(([x,sz,k],i)=>{ const m=mensch({x,y:-.32,z:sz*.95},{x,z:sz*-5},k,'#3a2a1c',[HUT.stroh,filz,HUT.tuch][i%3],i===2?{lang:1}:{}); tg.add(m.G);
        krug(m.arme[1],i%2?'#9aa0a6':'#8a6a4a'); m.arme[0].rotation.x=-.5; F.zecher.push({m,ph:i*1.3}); });
    }
    // Bierfass auf dem Bock, daneben der Wirt mit Schürze
    { const FP=at(16.8,13.4), fg=grp(FP); for(const x of [-.45,.45]){ for(const z of [-.3,.3]){ const b=box(fg,.08,.8,.08,holzD,x,.38,z*.7); b.rotation.x=z*.6; } box(fg,.1,.08,.7,holzD,x,.7,0); }
      const fs=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,1.1,14),holz); fs.rotation.z=Math.PI/2; fs.position.y=1.15; fg.add(fs); for(const x of [-.4,0,.4]){ const r2=new THREE.Mesh(new THREE.TorusGeometry(x?.41:.44,.025,5,16),M('#2e2c2a')); r2.position.set(x,1.15,0); r2.rotation.y=Math.PI/2; fg.add(r2); }
      box(fg,.05,.12,.05,M('#c9a040'),.56,1.05,0); const w=mensch(at(17.9,14.6),strasse(14),'#e8e0cc','#4a3a2a',filz,{rock:'#efe8d6',band:'#efe8d6',aermel:'#8a6a44'}); krug(w.arme[1],'#8a6a4a'); F.zecher.push({m:w,ph:4}); }
    // Wimpelketten vom Tanzbaum zu drei Pfosten
    { const oben={x:TB.x,y:TB.y+7,z:TB.z}, wim=[], wg=new THREE.BufferGeometry(); wg.setAttribute('position',new THREE.Float32BufferAttribute([-.17,0,0, .17,0,0, 0,-.38,0],3)); wg.computeVertexNormals();
      for(const [d,u] of [[3.5,5],[21,8],[4,16.8]]){ const p=at(d,u), ps2=cyl(.07,holzD); place(ps2,[p.x,p.y,p.z],[p.x,p.y+4.4,p.z]); world.add(ps2); const e={x:p.x,y:p.y+4.3,z:p.z}, L=Math.hypot(e.x-oben.x,e.z-oben.z), ry=-Math.atan2(e.z-oben.z,e.x-oben.x);
        const pt=k=>[oben.x+(e.x-oben.x)*k, oben.y+(e.y-oben.y)*k-1.1*4*k*(1-k), oben.z+(e.z-oben.z)*k];
        for(let i=0;i<8;i++){ const c=cyl(.012,M('#3a2a1c')); place(c,pt(i/8),pt((i+1)/8)); world.add(c); } for(let k=.06;k<.97;k+=.6/L) wim.push({p:pt(k),ry,c:wim.length%4}); }
      inst(wg,new THREE.MeshLambertMaterial({color:'#fff',side:THREE.DoubleSide}),wim,o=>{ ps.set(...o.p); qq.setFromAxisAngle(up,o.ry); sc.set(1,1,1); cc.set(['#c62f24','#e2b33a','#1f4e8c','#f2ece0'][o.c]); }); } }

  sicher('Dorfleben',()=>buildDorf({mensch,HUT,box,M,holz,holzD,dach,sand,bretter,inst,fr,rw,A,ps,qq,sc,cc,up})); // Dorfleben in Erlenbach (welt-dorf.js)
  sicher('Unterwegs',()=>buildUnterwegs({mensch,HUT,box,M,holz,holzD,bretter,dach,sand,A})); // Pferdekarren, Fußgänger, Betrunkener (welt-unterwegs.js)

  // ---------- Burgwald am Hang: Pfad mit Geländer, Felsnasen mit Moos, Mauerrest, umgestürzter Stamm, Holzunterstand, Brennholz, Reh ----------
  { const P=R.burgPfad, D=R.burgDeko, V=R.vb, W=(a,u)=>({x:V.x+V.ex*a+V.nx*u, z:V.y+V.ey*a+V.ny*u}), pm=Object.assign(lam('#9a7556'),{side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-3});
    const pp=new Float32Array(P.length*6), id=[]; P.forEach((o,i)=>{ const n=P[Math.min(i+1,P.length-1)], v=P[Math.max(i-1,0)], da=n.a-v.a, du=n.u-v.u, L=Math.hypot(da,du)||1;
      [-1,1].forEach((k,j)=>{ const w=W(o.a-du/L*k*.75,o.u+da/L*k*.75); pp.set([w.x,terrainAt(w.x,w.z)+.06,w.z],i*6+j*3); }); if(i<P.length-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pp,3)); geo.setIndex(id); geo.computeVertexNormals(); world.add(new THREE.Mesh(geo,pm));
    let vor=null; P.forEach((o,i)=>{ if(i%2) return; const w=W(o.ra,o.ru), y=terrainAt(w.x,w.z), t=[w.x,y+1,w.z]; box(world,.12,1.1,.12,holzD,w.x,y+.5,w.z); if(vor&&Math.hypot(vor[0]-t[0],vor[2]-t[2])<4){ const ri=cyl(.04,holz); place(ri,vor,t); world.add(ri); } vor=t; }); // Geländer zur Talseite
    const moos=M('#4f6b34'); for(const f of D.felsen){ const y=terrainAt(f.x,f.y), q3=rng(Math.round(Math.abs(f.x*7+f.y))); for(let k=0;k<3;k++){ const rr=f.r*(1-k*.25), b=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),fels);
      b.position.set(f.x+(q3()-.5)*f.r*.8, y+rr*.5+k*rr*.55, f.y+(q3()-.5)*f.r*.8); b.scale.set(rr,rr*(1.1+q3()*.6),rr*.8); b.rotation.y=q3()*6; world.add(b);
      if(k===2){ const mo=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),moos); mo.position.set(b.position.x,b.position.y+b.scale.y*.82,b.position.z); mo.scale.set(rr*.75,rr*.22,rr*.6); world.add(mo); } } } // Moos obendrauf
    { const [a,b]=D.mauerrest, L=Math.hypot(b.x-a.x,b.y-a.y), ry=-Math.atan2(b.y-a.y,b.x-a.x); [3.5,2.6,4.2,1.8,3,1.2].forEach((hh,i)=>{ const t=(i+.5)/6, x=a.x+(b.x-a.x)*t, z=a.y+(b.y-a.y)*t, y=terrainAt(x,z); box(world,L/6+.05,hh+1,1.2,sand,x,y+hh/2-.5,z,ry);
        if(i%2===0){ const e=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),M('#2f5229')); e.position.set(x,y+hh*.35,z); e.scale.set(L/14,hh*.45,.8); e.rotation.y=ry; world.add(e); } // Efeu
        const st=new THREE.Mesh(new THREE.DodecahedronGeometry(.35+(i%3)*.15,0),sand); st.position.set(x+1.4,terrainAt(x+1.4,z+1)+.2,z+1); st.rotation.set(i,i*2,0); world.add(st); }); } // heruntergefallene Steine
    { const [a,b]=D.stamm, ya=terrainAt(a.x,a.y)+.4, yb=terrainAt(b.x,b.y)+.4, sm=cyl(.4,M('#5b4636'),.45); place(sm,[a.x,ya,a.y],[b.x,yb,b.y]); world.add(sm);
      const wt=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.4,10),M('#6b5040')); place(wt,[a.x,ya,a.y],[a.x+(a.x-b.x)*.05,ya+(ya-yb)*.05,a.y+(a.y-b.y)*.05]); wt.scale.y=.4; world.add(wt); } // umgestürzter Baum mit Wurzelteller
    { const p=D.unterstand, G=new THREE.Group(); G.position.set(p.x,terrainAt(p.x,p.y),p.y); G.rotation.y=-V.h; world.add(G); for(const [x,z,hh] of [[-1.5,-1,2.6],[1.5,-1,2.6],[-1.5,1,2.1],[1.5,1,2.1]]) box(G,.15,hh,.15,holzD,x,hh/2,z);
      const d2=box(G,3.6,.1,2.7,dach,0,2.4,0); d2.rotation.x=.22; box(G,2.6,.08,.4,holz,0,.45,-.7); for(const x of [-1.1,1.1]) box(G,.1,.45,.35,holzD,x,.22,-.7); } // Schutzhütte mit Pultdach und Bank
    { const p=D.holz, y=terrainAt(p.x,p.y), G=new THREE.Group(); G.position.set(p.x,y,p.y); G.rotation.y=-V.h; world.add(G); [[0,0],[.42,0],[.84,0],[1.26,0],[.21,.38],[.63,.38],[1.05,.38],[.42,.76],[.84,.76]].forEach(([dz,dy])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,2.2,7),holzD); l.rotation.z=Math.PI/2; l.position.set(0,.2+dy,dz); G.add(l); }); } // Brennholz
    // Reh am Waldrand vor dem Halsgraben: äst, hebt den Kopf, wenn man naht
    { const p=D.reh, G=new THREE.Group(), fe=M('#9a6438'); G.position.set(p.x,terrainAt(p.x,p.y),p.y); G.rotation.y=-p.h+1.9; world.add(G);
      const r2=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),fe); r2.scale.set(.55,.25,.2); r2.position.y=.8; G.add(r2); for(const [x,z] of [[.38,.09],[.38,-.09],[-.38,.09],[-.38,-.09]]){ const l=cyl(.03,fe,.02); place(l,[x,.78,z],[x,0,z]); G.add(l); }
      const spg=new THREE.Mesh(new THREE.SphereGeometry(.08,6,5),M('#f2ece0')); spg.position.set(-.55,.86,0); G.add(spg); // weißer Spiegel
      const hals=new THREE.Group(); hals.position.set(.4,.82,0); G.add(hals); const hs=cyl(.06,fe,.08); place(hs,[0,0,0],[.12,.5,0]); hals.add(hs); const kp=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),fe); kp.scale.set(1.6,.9,.9); kp.position.set(.22,.58,0); hals.add(kp);
      const na=new THREE.Mesh(new THREE.SphereGeometry(.03,5,4),M('#1a1a1a')); na.position.set(.36,.56,0); hals.add(na); const ohr=[-1,1].map(s2=>{ const o=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,5),fe); o.position.set(.14,.7,s2*.07); o.rotation.x=s2*.5; hals.add(o); return o; }); A.reh={G,hals,ohr}; } }

  // ---------- Wegelagerer an der Kehre: drei Bewaffnete drohen; wer mit über 4 W/kg vorbeifährt, staubt sie ein ----------
  { const K=R.raeuber, at=da=>{ const f=fr(K.d+da), u=rw(K.d+da)+2, x=f.px+f.nx*K.s*u, z=f.py+f.ny*K.s*u; return {x,y:terrainAt(x,z),z}; }, mitte=fr(K.d), bl={x:mitte.px,z:mitte.py};
    const nasal=k=>{ const hb=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),M('#5f6266')); hb.scale.set(1.05,.85,1.05); hb.position.y=.03; k.add(hb); // Kettenhaube
      const h=new THREE.Mesh(new THREE.SphereGeometry(.145,10,8,0,Math.PI*2,0,Math.PI/2),M('#a9adb2')); h.scale.y=1.35; h.position.y=.12; k.add(h); const r=new THREE.Mesh(new THREE.CylinderGeometry(.148,.148,.035,12),M('#8a8e93')); r.position.y=.13; k.add(r);
      const ns=new THREE.Mesh(new THREE.BoxGeometry(.035,.17,.025),M('#a9adb2')); ns.position.set(0,.06,.14); k.add(ns); }; // Spangenhelm mit Nasenschutz
    const kragen=(m,c)=>{ const k=new THREE.Mesh(new THREE.ConeGeometry(.4,.38,12,1,true),new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide})); k.position.y=1.36; m.G.add(k); }; // Gugel-Schulterkragen
    const waffe=(arm,lang)=>{ const W=new THREE.Group(); W.position.y=-.62; arm.add(W); box(W,.045,lang,.012,M('#c9ccd0'),0,-lang/2-.08,0); box(W,lang>.5?.24:.12,.035,.04,M('#6b5a3a'),0,-.07,0); box(W,.035,.12,.035,M('#3a2a1c'),0,.02,0); }; // Klinge zeigt den Arm entlang
    const L=[mensch(at(-2.2),bl,'#6b2a24','#2a2a2a',nasal,{aermel:'#e6dccb'}), mensch(at(0),bl,'#3f6b3a','#3a3020',k=>{ nasal(k); },{aermel:'#3f6b3a'}), mensch(at(2.2),bl,'#2a2a2c','#4a3a2a',k=>{ HUT.kapuze(k); k.children[k.children.length-1].material=M('#1e1e20'); },{aermel:'#7a1f1f'})];
    kragen(L[0],'#5a4128'); kragen(L[1],'#6b4a2e'); kragen(L[2],'#1e1e20'); waffe(L[0].arme[1],.9); waffe(L[1].arme[1],.3); waffe(L[2].arme[1],.3);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:blaseTex('Her mit euren Gulden, wenn euch euer Leben lieb ist!'),transparent:true,depthWrite:false})), p=at(0); sp.scale.set(8.3,2.56,1); sp.position.set(p.x,p.y+3.1,p.z); sp.visible=false; world.add(sp);
    const ab=(da,du)=>{ const f=fr(K.d+da), u=rw(K.d+da)+2+du, x=f.px+f.nx*K.s*u, z=f.py+f.ny*K.s*u; return {x,y:terrainAt(x,z),z}; }; // Gebüsch hinter und neben den Räubern
    for(const [da,du,r] of [[-4.6,.2,1.1],[-3.4,1.7,1],[-1.1,2,1.2],[1.2,1.9,1.1],[3.3,1.6,1],[4.7,.3,1.15],[0,3,1.3],[-2.4,3.2,.9]]){ const p=ab(da,du), b=new THREE.Mesh(new THREE.IcosahedronGeometry(r,0),M(da*du%2<1?'#3f6b32':'#4d7a3a')); b.position.set(p.x,p.y+r*.35,p.z); b.scale.y=.7; b.rotation.y=da; world.add(b); }
    A.raeuber={L,d:K.d,sp,droh:sp.material.map,staun:blaseTex('Bei allen Heiligen … der hat den Teufel in den Waden!'),staunT:0,lastD:-1e9}; }
  // ---------- Bogenschütze oben auf dem Felsentor: zielt, schießt einmal pro Vorbeifahrt, der Pfeil steckt vor oder neben dem Vorderrad im Weg ----------
  { const td=R.felsen.tor, tf=fr(td), T={d:td}, p={x:tf.px,y:roadY(td)+11.7,z:tf.py}, m=mensch(p,{x:p.x,z:p.z+1},'#7a3f1c','#2a2a2a',k=>{ const h=new THREE.Mesh(new THREE.ConeGeometry(.15,.34,10),M('#2f9a3a')); h.position.set(0,.27,-.03); h.rotation.x=-.3; k.add(h);
        const kr=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.03,12),M('#355a30')); kr.position.y=.15; k.add(kr); for(let i=0;i<3;i++){ const fd=new THREE.Mesh(new THREE.BoxGeometry(.025,.34,.06),M('#d22a1a')); fd.position.set(.1+i*.02,.32,-.05-i*.02); fd.rotation.z=-.5-i*.15; k.add(fd); } },{aermel:'#2f9a3a'}); m.G.scale.setScalar(1.4); // Spitzhut mit rotem Federbusch, deutlich größer (steht mittig auf dem Felsentor)
    const kc=new THREE.Mesh(new THREE.CylinderGeometry(.08,.07,.6,8),M('#5a3a22')); kc.position.set(.12,1.2,-.22); kc.rotation.x=.3; m.G.add(kc); for(let i=0;i<4;i++){ const pf=box(m.G,.015,.7,.015,M('#c9b28a'),.08+i*.03,1.55,-.3+i*.01); pf.rotation.x=.3; } // Köcher mit Pfeilen
    const bow=new THREE.Mesh(new THREE.TorusGeometry(.75,.022,4,18,2.3),holzD); bow.rotation.set(0,Math.PI/2,-Math.PI/2-1.15); bow.position.set(0,.13,0); m.arme[0].add(bow); // senkrecht, Bauch nach vorn, Griff in der Hand
    m.arme[0].rotation.x=m.arme[1].rotation.x=-1.5; m.arme[1].rotation.z=.5; // Bogenarm gestreckt, Zugarm an der Wange
    const pfeil=new THREE.Group(), sm=M('#c9b28a'); const sch=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,.85,5),sm); sch.rotation.x=Math.PI/2; pfeil.add(sch);
    const sp2=new THREE.Mesh(new THREE.ConeGeometry(.03,.1,5),M('#8a8e93')); sp2.rotation.x=Math.PI/2; sp2.position.z=.47; pfeil.add(sp2);
    for(const r of [0,Math.PI/2]){ const fe=new THREE.Mesh(new THREE.PlaneGeometry(.13,.06),new THREE.MeshLambertMaterial({color:'#e8e2d6',side:THREE.DoubleSide})); fe.rotation.set(0,Math.PI/2,r); fe.position.z=-.37; pfeil.add(fe); }
    pfeil.visible=false; world.add(pfeil); // Vorlage (wird für jeden Schuss kopiert)
    A.schuetze={m,T,pfeil,pfeile:[],flug:null,schuss:false,zug:0}; }

  // ---------- Drache (anfangs unsichtbar) und Raben am Bergfried: Schwarm kreist, drei sitzen auf dem Palasdach ----------
  { const Dr=drachenModell(); Dr.D.visible=false; world.add(Dr.D); const fl=canvasTex(64,64,g=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.4,'rgba(255,255,255,.7)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); });
    const feuer=[]; for(let i=0;i<110;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:fl,color:'#ffb347',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0})); s.visible=false; world.add(s); feuer.push({s,v:new THREE.Vector3(),life:0,max:1}); }
    A.drache={...Dr, zust:'weg', t:0, feuer, feuerT:0, naechst:0}; const rab=[];
    A.brand={T:0, emit:0, p:[]}; for(let i=0;i<60;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:fl,transparent:true,depthWrite:false,opacity:0})); s.visible=false; world.add(s); A.brand.p.push({s,p:new THREE.Vector3(),v:new THREE.Vector3(),life:0,max:1,rauch:false}); } // Flammen und Rauch am brennenden Fahrer
    for(let i=0;i<9;i++){ const r=rabeModell(); A.burg.add(r.G); rab.push({...r, ang:i/9*6.3, rad:9+i%3*4, hoe:56+i%4*2.5, v:.5+(i%3)*.12, ph:i, sitz:null}); }
    for(const x of [-6,-2.5,1]){ const r=rabeModell(); A.burg.add(r.G); rab.push({...r, ang:0, rad:12, hoe:58, v:.55, ph:x, sitz:new THREE.Vector3(x,24.15,3.5)}); }
    A.raben=rab; A.flucht=0; }
  // ---------- Morgennebel: Schwaden im Tal, im Wald und unter der Burg (blenden aus, wenn man hindurchfährt) ----------
  { const puff=canvasTex(128,128,g=>{ for(let i=0;i<16;i++){ const x=28+Math.random()*72, y=38+Math.random()*52, r=16+Math.random()*28, gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(255,255,255,.5)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } });
    const q=rng(55), plainY=(R.def.plainElev??R.startElev-60)-R.startElev, C=R.burgPos;
    const add=(x,y,z,s,base)=>{ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:puff, color:'#eef1f0', transparent:true, opacity:base, depthWrite:false})); sp.position.set(x,y,z); sp.scale.set(s,s*.45,1); world.add(sp); A.nebel.push({sp,s,base}); };
    const amWeg=(d0,d1,o0,o1,h0,h1,s0,s1,base,n)=>{ for(let i=0;i<n;i++){ const f=fr(d0+q()*(d1-d0)), o=(q()<.5?-1:1)*(o0+q()*(o1-o0)), x=f.px+f.nx*o, z=f.py+f.ny*o; add(x,terrainAt(x,z)+h0+q()*(h1-h0),z,s0+q()*(s1-s0),base); } };
    amWeg(0,1420,25,340,5,20,60,150,.5,120); // Talnebel um Erlenbach und das Bachtal
    amWeg(1320,4520,20,180,3,12,35,80,.3,70); // Schwaden zwischen den Bäumen
    let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(let i=0;i<R.xs.length;i+=10){ x0=Math.min(x0,R.xs[i]); x1=Math.max(x1,R.xs[i]); z0=Math.min(z0,R.ys[i]); z1=Math.max(z1,R.ys[i]); }
    for(let i=0;i<40;i++){ const a=q()*6.3, rr=Math.max(x1-x0,z1-z0)/2+300+q()*1500; add((x0+x1)/2+Math.cos(a)*rr, plainY+15+q()*40, (z0+z1)/2+Math.sin(a)*rr, 250+q()*300, .55); } // Nebelmeer im weiten Tal
    for(let i=0;i<30;i++){ const a=q()*6.3, rr=170+q()*250, x=C.x+Math.cos(a)*rr, z=C.y+Math.sin(a)*rr; add(x,terrainAt(x,z)+4+q()*12,z,60+q()*80,.4); }
    for(let i=0;i<16;i++){ const a=q()*6.3, rr=65+q()*80, x=C.x+Math.cos(a)*rr, z=C.y+Math.sin(a)*rr; add(x,terrainAt(x,z)+2+q()*5,z,28+q()*30,.32); } } // Burg ragt aus dem Nebel, Schwaden zwischen den Bäumen am Burghang
}
// ---- Bewegung (jeden Frame im Rennen): Wasser fließt, Mühlrad dreht sich, Nebel blendet in der Nähe aus ----
function poseBurg(dt){ const A=anim.burg, t=performance.now()/1000, cp=camera.position; sicher('Drache',()=>burgDrache(dt,t));
  for(const L of A.leute){ L.b.arme[1].rotation.x=-.5-.45*Math.max(0,Math.sin(t*2.3)); L.b.arme[0].rotation.x=-.25*Math.max(0,Math.sin(t*1.7+1)); L.b.kopf.rotation.y=.15*Math.sin(t*1.3); // Bauer erzählt mit Händen
    L.z.kopf.rotation.x=.12*Math.max(0,Math.sin(t*2.9)); L.z.arme[0].rotation.z=-.12-.1*Math.sin(t*.8); if(L.pferd) L.pferd.children[0].rotation.x=.02*Math.sin(t*1.1); } // Zöllner nickt, Pferd atmet
  // Zollstation: Schlagbaum hoch, sobald ein Fahrer 20 m davor ist, danach wieder runter; der Zöllner dreht sich um, winkt und ruft
  if(A.zoll){ const Z=A.zoll, nah=d=>d>Z.d-20&&d<Z.d+6, auf=nah(me.d)||(opp.active&&nah(opp.d)); Z.k=Math.min(1,Math.max(0,Z.k+(auf?dt:-dt*.7))); Z.dreh.rotation.x=-1.35*bSm(Z.k);
    if(me.d<Z.d-60) Z.rief=false; if(!Z.rief&&me.d>Z.d-36&&me.d<Z.d){ Z.rief=true; Z.rufT=5.5; } Z.rufT=Math.max(0,Z.rufT-dt); // ruft 5,5 s lang
    const ruf=Z.rufT>0, P=Z.z.G.position; Z.sp.visible=ruf; Z.w=Math.min(1,Math.max(0,Z.w+(ruf?dt*2:-dt))); const w=bSm(Z.w);
    const dw=((Math.atan2(cp.x-P.x,cp.z-P.z)-Z.ry+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; Z.z.G.rotation.y=Z.ry+dw*w;
    if(w>0){ Z.z.arme[0].rotation.x=-w*(1.9+.5*Math.sin(t*7)); Z.z.arme[0].rotation.z=-.12-w*.3; Z.z.kopf.rotation.x*=1-w; } }
  for(const F of A.fahnen) F.f.rotation.y=Math.PI/2+.35*Math.sin(t*2.1+F.ph)+.15*Math.sin(t*3.7+F.ph*2); // Fahnen wehen
  for(const f of A.flammen) f.scale.set(1,.8+.35*Math.abs(Math.sin(t*9+f.position.z+f.position.x)),1);
  for(const R2 of A.rauch){ const k=(t*.25+R2.ph)%1; R2.sp.position.set(R2.a+k*1.5,R2.y+k*6,R2.u+Math.sin(t+R2.ph*6)*.4); R2.sp.scale.setScalar(.8+k*2.6); R2.sp.material.opacity=.45*(1-k); } // Rauch steigt und verweht
  if(A.ferkel) A.ferkel.rotation.x=t*.6; for(const P of A.pferde) P.P.rotation.z=.08*Math.sin(t*.9+P.ph); for(const H of A.huehner){ H.kopf.rotation.z=-.9*Math.max(0,Math.sin(t*3+H.ph))**4; H.P.rotation.y+=Math.sin(t*.7+H.ph)*.004; }
  if(A.schmied){ const S3=A.schmied, sw=Math.sin(t*5); S3.m.arme[1].rotation.x=-1.2-.9*sw; if(S3.hit&&sw<-.95&&Math.hypot(cp.x-S3.amb.x,cp.z-S3.amb.z)<120){ S3.hit=false; for(let i=0;i<10;i++) partSpawn(parts.spray,S3.amb.x,S3.ay,S3.amb.z,(Math.random()-.5)*2.4,1.2+Math.random()*1.6,(Math.random()-.5)*2.4,.5,Math.random()<.5?'#ffb347':'#ffe08a'); } if(sw>0) S3.hit=true; } // Hammerschlag mit Funken
  for(const W of A.winker){ const e=Math.hypot(cp.x-W.x,cp.z-W.z), k=bSm((40-e)/15); W.m.arme[1].rotation.x=-k*(1.9+.5*Math.sin(t*7+W.ph)); W.m.arme[1].rotation.z=.12+k*.3; } // winken, wenn man naht
  if(A.volk&&Math.hypot(cp.x-A.volk.mitte.x,cp.z-A.volk.mitte.z)<260) poseVolk(t,false);
  const ich=riders3d[myKey];
  // Wegelagerer: drohen und schwingen die Waffen; fährst du mit über 4 W/kg vorbei, hüllt sie eine Staubwolke ein und sie staunen
  if(A.raeuber){ const Q=A.raeuber, md=me.d; if(md<Q.lastD-30||md<Q.d-200) Q.staunT=0; // gewarnt wird jetzt von Bauern am Weg (welt-unterwegs.js)
    if(Q.lastD<Q.d&&md>=Q.d&&ich&&ich.wS>4){ Q.staunT=7; Q.kamT=0; Q.sp.material.map=Q.staun; for(const m of Q.L){ const P=m.G.position; for(let i=0;i<70;i++){ const a=Math.random()*6.3, v=1+Math.random()*2.5;
        partSpawn(parts.dust,P.x+(Math.random()-.5)*2,P.y+.2+Math.random()*1.6,P.z+(Math.random()-.5)*2,Math.cos(a)*v,.4+Math.random()*.8,Math.sin(a)*v,2.2+Math.random(),Math.random()<.5?'#b98466':'#a8765a'); } } }
    Q.lastD=md; if(Q.staunT>0) Q.staunT-=dt; else Q.sp.material.map=Q.droh; Q.sp.visible=Q.staunT>0||(md>Q.d-30&&md<Q.d+12); const gr=Q.kamT!=null?2:1.6; Q.sp.scale.set(5.2*gr,1.6*gr,1); // erst ab 30 m, beim Schulterblick doppelt so groß
    Q.L.forEach((m,i)=>{ const P=m.G.position; m.G.rotation.y=Math.atan2(cp.x-P.x,cp.z-P.z);
      if(Q.staunT>0){ const hu=Math.sin(t*14+i*2); m.arme[0].rotation.x=-2.1+.15*hu; m.arme[1].rotation.x=-1.9-.1*hu; m.arme[1].rotation.z=.12; m.kopf.rotation.x=.25+.1*hu; } // husten, Arme vors Gesicht
      else { m.arme[1].rotation.x=-1.1-1.1*Math.max(0,Math.sin(t*(3.2+i*.4)+i)); m.arme[1].rotation.z=.4*Math.sin(t*2.6+i); m.arme[0].rotation.x=-.4-.3*Math.sin(t*2+i); m.kopf.rotation.x=0; } }); }
  // Bogenschütze auf dem Felsentor: dreht sich mit, spannt, schießt bei 45 m einmal; der Pfeil fliegt im Bogen und steckt vor oder neben dem Vorderrad
  if(A.schuetze&&ich){ const S2=A.schuetze, P=S2.m.G.position, rp=ich.g.position, e=Math.hypot(rp.x-P.x,rp.z-P.z); if(me.d<S2.T.d-120) S2.schuss=false;
    if(e<90) S2.m.G.rotation.y=Math.atan2(rp.x-P.x,rp.z-P.z);
    S2.zug=e<70&&!S2.schuss?Math.min(1,S2.zug+dt):Math.max(0,S2.zug-dt*2); S2.m.arme[1].rotation.x=-1.5+.3*S2.zug; S2.m.arme[1].rotation.z=.5-.25*S2.zug;
    if(!S2.schuss&&e<45&&me.v>1){ S2.schuss=true; const dT=me.d+3+me.v*1.1, hT=headingAt(R,dT), u=(ich.lane||0)+(Math.random()<.5?-1:1)*(.4+Math.random()*.9), [x,z]=posAt(R,dT);
      const pf=S2.pfeil.clone(); pf.visible=true; world.add(pf); S2.pfeile.push(pf); if(S2.pfeile.length>6) world.remove(S2.pfeile.shift());
      S2.flug={pf, a:new THREE.Vector3(P.x,P.y+1.45*1.4,P.z), b:new THREE.Vector3(x-Math.sin(hT)*u, roadY(dT)+.12, z+Math.cos(hT)*u), t:0, T:1.1}; }
    const F=S2.flug; if(F){ F.t=Math.min(F.T,F.t+dt); const bahn=k=>{ const v=F.a.clone().lerp(F.b,k); v.y+=Math.sin(k*Math.PI)*3; return v; }, k=F.t/F.T, pos=bahn(k), dir=bahn(Math.min(1,k+.02)).sub(bahn(Math.max(0,k-.02))).normalize();
      F.pf.position.copy(pos).addScaledVector(dir,k<1?0:-.3); F.pf.lookAt(F.pf.position.clone().add(dir));
      if(k>=1){ for(let i=0;i<18;i++) partSpawn(parts.dust,F.b.x,F.b.y+.05,F.b.z,(Math.random()-.5)*1.6,.5+Math.random()*.7,(Math.random()-.5)*1.6,1.2,'#b98466'); S2.flug=null; } } } // Einschlag: kleine Staubwolke
  if(A.burg){ const B=A.burg.position, e=Math.hypot(camera.position.x-B.x,camera.position.z-B.z); A.burg.scale.setScalar(1+.8*bSm((e-300)/900)); } // von weitem bis 1,8-mal so groß, ab 300 m echte Größe
  sicher('Fest',()=>poseFest(t,cp)); sicher('Dorfleben',()=>poseDorf(t,dt,cp)); poseUnterwegs(t,dt,cp);
  if(A.reh){ const Rh=A.reh, P=Rh.G.position, w=bSm((45-Math.hypot(cp.x-P.x,cp.z-P.z))/15); Rh.hals.rotation.z=(1-w)*(-2+.15*Math.sin(t*1.3))+w*.1; Rh.ohr.forEach((o,i)=>o.rotation.z=.4*Math.max(0,Math.sin(t*2.3+i*2))**8); } // Reh äst, schaut auf, wenn man naht
  if(A.wasser) A.wasser.offset.y+=dt*.5; if(A.rad) A.rad.rotation.z-=dt*.9;
  const k=race.tod==='tag'?1:.55; for(const o of A.nebel) o.sp.material.opacity=o.base*k*bSm((o.sp.position.distanceTo(cp)-o.s*.3)/(o.s*.7)); }
// Bauernfest am Start: Reigen dreht sich, Musikanten wippen, Gaukler jongliert, Bär tanzt an der Kette, Kinder klatschen, Zecher prosten
function poseFest(t,cp){ const F=anim.burg.fest; if(!F) return; const e=Math.hypot(cp.x-F.x,cp.z-F.z); if(e>160) return; const nah=bSm((40-e)/15);
  F.reigen.rotation.y=t*.55; for(const T of F.tanz){ T.m.G.position.y=.12*Math.abs(Math.sin(t*5.5+T.i*1.7)); T.m.G.rotation.z=.08*Math.sin(t*2.75+T.i); T.m.kopf.rotation.z=.12*Math.sin(t*2.75+T.i); }
  for(const U of F.musik){ U.m.G.rotation.z=.06*Math.sin(t*3+U.ph); U.m.kopf.rotation.x=.08*Math.sin(t*6+U.ph); }
  { const G=F.gaukler, w=Math.sin(t*7.85); G.m.arme[0].rotation.x=-1.2+.15*w; G.m.arme[1].rotation.x=-1.2-.15*w;
    G.baelle.forEach((b,i)=>{ const ph=(t/1.6+i/3)%1, k=(ph%.5)*2, xa=ph<.5?-.22:.22; b.position.set(xa-2*xa*k,1.18+.75*4*k*(1-k),.55); }); } // Wurf von Hand zu Hand
  { const B=F.baer, Fu=F.fuehrer, s=Math.sin(t*1.6), h=Math.sin(t*3.2); B.bk.rotation.z=.12*s; B.G.rotation.y=B.ry+.45*Math.sin(t*.7); B.bk.position.y=.06*Math.abs(h); B.kopf.rotation.z=-.18*s;
    B.arme[0].rotation.x=-2.2+.35*h; B.arme[1].rotation.x=-2.2-.35*h; B.arme[0].rotation.z=-.3-.15*s; B.arme[1].rotation.z=.3-.15*s;
    Fu.arme[1].rotation.x=-2+.25*Math.sin(t*11); Fu.arme[1].rotation.z=.2*Math.sin(t*5.5); // Schellentrommel
    B.kr.getWorldPosition(F.v1); Fu.arme[0].children[1].getWorldPosition(F.v2); const a=F.v1.toArray(), b=F.v2.toArray(), m=[(a[0]+b[0])/2,(a[1]+b[1])/2-.35,(a[2]+b[2])/2]; place(F.kette[0],a,m); place(F.kette[1],m,b); } // Kette hängt durch
  for(const K of F.kinder){ const c=.28+.22*Math.sin(t*9+K.ph); K.m.arme[0].rotation.z=c; K.m.arme[1].rotation.z=-c; K.m.G.position.y=K.y+.06*Math.max(0,Math.sin(t*4.5+K.ph)); }
  for(const Z of F.zecher) Z.m.arme[1].rotation.x=-.5-1.7*Math.max(Math.max(0,Math.sin(t*.8+Z.ph))**4, nah*(.8+.2*Math.sin(t*7+Z.ph))); } // prosten, heben die Krüge, wenn man naht
// Volk in der Vorburg: hüpft und reckt die Arme, je näher du dem Ziel kommst
function poseVolk(t,alle){ const P=anim.burg.volk, m=new THREE.Matrix4(), q=new THREE.Quaternion(), s=new THREE.Vector3(), p=new THREE.Vector3(), up=new THREE.Vector3(0,1,0), c=new THREE.Color(), e=new THREE.Euler();
  const nah=alle?0:bSm((140-Math.hypot(camera.position.x-P.mitte.x,camera.position.z-P.mitte.z))/80), hi=[0,0,0,0];
  P.L.forEach((o,i)=>{ const hop=nah*Math.max(0,Math.sin(t*(5+o.ph%2)+o.ph))*.12, y=o.y+hop; q.setFromAxisAngle(up,o.r);
    const kt=o.t*(o.k||1); // Sitzende: kürzer
    p.set(o.a,y+.65*kt,o.u); s.set(1,kt,1); m.compose(p,q,s); P.body.setMatrixAt(i,m); if(alle) P.body.setColorAt(i,c.set(o.c));
    p.set(o.a,y+1.42*kt,o.u); s.set(1,1,1); m.compose(p,q,s); P.head.setMatrixAt(i,m); if(alle) P.head.setColorAt(i,c.set(o.h));
    if(o.hut){ const H=P.hut[o.hut], j=hi[o.hut]++; p.set(o.a,y+1.42*kt+(o.hut===1?.26:o.hut===2?.1:.03),o.u); e.set(o.hut===1?-.35:0,o.r,0,'YXZ'); q.setFromEuler(e); m.compose(p,q,s); H.setMatrixAt(j,m); if(alle) H.setColorAt(j,c.set(o.hut===3?'#efe8d6':o.hc)); q.setFromAxisAngle(up,o.r); }
    for(const sx of [-1,1]){ const k=o.arme?nah:0, tl=.15+k*(2.4+.4*Math.sin(t*6+o.ph+sx)), ox=Math.cos(o.r)*sx*.24, oz=-Math.sin(o.r)*sx*.24; // Arme hoch
      const fx=Math.sin(o.r)*Math.sin(tl)*.275, fz=Math.cos(o.r)*Math.sin(tl)*.275; p.set(o.a+ox+fx,y+1.3*kt-.275*Math.cos(tl),o.u+oz+fz); // Schulter + gedrehter Arm
      q.setFromAxisAngle(up,o.r); q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(Math.cos(o.r),0,-Math.sin(o.r)),-tl));
      m.compose(p,q,s.set(1,1,1)); P.arm.setMatrixAt(i*2+(sx>0?1:0),m); if(alle) P.arm.setColorAt(i*2+(sx>0?1:0),c.set(o.c)); } });
  for(const im of [P.body,P.head,P.arm,...P.hut.filter(Boolean)]){ im.instanceMatrix.needsUpdate=true; if(alle&&im.instanceColor) im.instanceColor.needsUpdate=true; } }
// Kamera (aus rennen.js, nach der normalen Kamera): beim Einstauben 6 s Schulterblick zurück auf die Wegelagerer, dann wieder hinter den Fahrer
function burgKamera(dt){ const Q=anim.burg.raeuber, ich=riders3d[myKey]; endKamera(); sicher('Start-Kamera',()=>startKamera(dt)); sicher('Rempler-Kamera',()=>unterwegsKamera(dt));
  if(!Q||Q.kamT==null||!ich) return; Q.kamT+=dt; const T=6; if(Q.kamT>T){ Q.kamT=null; return; }
  const w=bSm(Q.kamT/.6)*bSm((T-Q.kamT)/.7), rp=ich.g.position, bc=Q.L[1].G.position, hd=headingAt(R,me.d), fx=Math.cos(hd), fz=Math.sin(hd), sx=bc.x-rp.x, sz=bc.z-rp.z, sl=Math.hypot(sx,sz)||1;
  const pos=new THREE.Vector3(rp.x+fx*5-sx/sl*2.5, rp.y+2.4, rp.z+fz*5-sz/sl*2.5), look=new THREE.Vector3(bc.x, rp.y+1.1, bc.z), now=new THREE.Vector3(camS.lx,camS.ly,camS.lz);
  camera.position.lerp(pos,w); camera.lookAt(now.lerp(look,w)); }
// Kamera am Start: beim Countdown gleitet sie von der Straße vor dem Bauernfest rückwärts daran vorbei zum Fahrer; nach dem Start folgt der Blick beim Vorbeifahren
// dem Fest (Gaukler, Reigen, Tanzbär) und dreht bis 52 m wieder nach vorn
function startKamera(dt){ const A=anim.burg, F=A.fest, ich=riders3d[myKey]; if(!F||!ich||me.d>52||(race.state!=='count'&&race.state!=='run')){ A.introT=A.kamP=null; return; }
  const vor=new THREE.Vector3(camS.lx,camS.ly,camS.lz), zd=Math.min(FEST.d1-3,Math.max(FEST.d0+3,me.d+9)), [fx,fz]=posAt(R,zd), fh=headingAt(R,zd), o=roadW(R,zd)/2+(zOpt(R,zd).geh??SIDEWALK)+4.5;
  const wR=.6*bSm((52-me.d)/18), blick=vor.clone().lerp(new THREE.Vector3(fx+Math.sin(fh)*o, F.y+1.3, fz-Math.cos(fh)*o),wR), hd=headingAt(R,me.d); // Blickziel wandert mit dir am Fest entlang
  const hier=camera.position.clone().add(new THREE.Vector3(-Math.sin(hd)*.9*wR, .5*wR, Math.cos(hd)*.9*wR)); // etwas nach rechts und höher, damit der eigene Fahrer nicht im Weg ist
  const ruhig=(p,l)=>{ const k=Math.min(1,dt*1.6), dp=p.clone().sub(camera.position), dl=l.clone().sub(vor); if(!A.kamP){ A.kamP=dp; A.kamL=dl; } A.kamP.lerp(dp,k); A.kamL.lerp(dl,k); camera.position.add(A.kamP); camera.lookAt(vor.clone().add(A.kamL)); }; // nur den Versatz zur normalen Kamera träge nachziehen – keine Zuckler, kein Hinterherhinken
  if(race.state==='run'){ A.introT=null; ruhig(hier,blick); return; }
  const t=A.introT=(A.introT??0)+dt, w=1-bSm((t-3.6)/1.3), k=bSm(t/4.4), d=Math.max(0,46-46*k), [x,z]=posAt(R,d), h=headingAt(R,d);
  const pos=new THREE.Vector3(x-Math.sin(h)*1.8, visRoadY(d)+3.4-1.3*k, z+Math.cos(h)*1.8), look=new THREE.Vector3(F.x,F.y+1.6,F.z).lerp(blick,bSm((t-2.6)/1.8)); // rechte Straßenseite rückwärts am Fest vorbei
  ruhig(hier.lerp(pos,w),blick.lerp(look,w)); }
// Drache und Raben (aus poseBurg): ab 3,74 km frontaler Tiefflug mit Feuer auf dich, dann begleitet er dich (1–2 langsame Überflüge von hinten/der Seite), 350 m vor dem Ziel fliegt er zum Bergfried, beim ersten Zieleinlauf Landung auf der Turmspitze mit Feuerstößen
const BF={x:13,y:53,z:-1}, KR=46; // Spitze des Bergfried-Dachs in Burg-Koordinaten, Kreisradius des Drachen
function burgDrache(dt,t){ const A=anim.burg, Q=A.drache, G=A.burg, ich=riders3d[myKey]; if(!Q||!G||!ich) return;
  const fertig=me.done||(opp.active&&opp.done), D=Q.D, mitte=new THREE.Vector3(BF.x,BF.y+3,BF.z), ziel=new THREE.Vector3(), rp=ich.g.position;
  const bez=(a,b,c,k)=>a.clone().multiplyScalar((1-k)*(1-k)).addScaledVector(b,2*(1-k)*k).addScaledVector(c,k*k);
  const st=(dd,h)=>{ const d=Math.min(R.len,dd), [x,z]=posAt(R,d); return new THREE.Vector3(x,Math.max(roadY(d),terrainAt(x,z))+h,z); }; // Punkt über der Straße
  const fliege=(soll,k)=>{ const alt=D.position.clone(); D.position.lerp(soll,Math.min(1,dt*k)); const v=D.position.clone().sub(alt); if(v.lengthSq()>1e-6) D.lookAt(D.position.clone().add(v)); return v.length()/Math.max(dt,1e-3); };
  if(!Q.ohneKx){ Q.ohneKx=true; D.traverse(o=>{ if(o.isMesh){ o.castShadow=false; o.customDepthMaterial=undefined; } }); } // Schatten des Drachen nicht mit der Überhöhung verziehen
  if(Q.zust!=='weg'&&me.d<3320){ Q.zust='weg'; D.visible=false; world.attach(D); D.scale.setScalar(1); Q.gespien=false; A.ergWarten=null; } // neue Runde/neues Rennen
  // 1) frontaler Tiefflug auf dem geraden Stück nach der ersten oberen Kehre: kommt entgegen, speit Feuer auf dich, zieht hinter dir hoch
  if(Q.zust==='weg'&&me.d>=3760&&me.d<4420&&!fertig){ const m=me.d;
    Q.kurve=new THREE.CatmullRomCurve3([st(m+175,28), st(m+120,8), st(m+80,5), st(m+45,4.5), st(m+15,5), st(m-15,8), st(m-50,18), st(m-80,30)]);
    Q.T=Q.kurve.getLength()/13; Q.t=0; Q.zust='anflug'; Q.gespien=false; D.visible=true; D.scale.setScalar(1); }
  let flap=0, gleit=false, feuerFlug=false;
  if(Q.zust==='anflug'){ Q.t+=dt; const k=Math.min(1,Q.t/Q.T), p=Q.kurve.getPointAt(k); D.position.copy(p); if(k<1) D.lookAt(Q.kurve.getPointAt(Math.min(1,k+.004))); flap=Math.sin(t*4.5)*.55;
    const zu=rp.clone().sub(p), vor=new THREE.Vector3(0,0,1).applyQuaternion(D.quaternion); if(!Q.gespien&&zu.length()<22&&zu.dot(vor)>0){ Q.gespien=true; Q.feuerT=1.8; }
    if(Q.gespien&&Q.feuerT>0&&zu.dot(vor)<zu.length()*.3) Q.feuerT=0; /* Fahrer schon unter/hinter ihm */ feuerFlug=Q.feuerT>0; if(k>=1){ Q.zust='begleit'; Q.ang=0; Q.dF=me.d; Q.n=0; } }
  // 2) begleitet dich: kreist vor dir über der Strecke, bis zum Zieleinlauf hin
  else if(Q.zust==='begleit'){ Q.ang+=dt*.45; const c=st(me.d+70,20), soll=c.clone().add(new THREE.Vector3(Math.cos(Q.ang)*35,4*Math.sin(t*.5),Math.sin(Q.ang)*35));
    soll.y=Math.max(soll.y,terrainAt(soll.x,soll.z)+14); fliege(soll,1.2); D.rotateZ(-.3); gleit=true; flap=Math.sin(t*2.6)*.4*Math.max(.3,Math.sin(t*.6));
    const span=R.len-350-(Q.dF||me.d); if(Q.n<2&&span>(Q.n?600:250)&&me.d>Q.dF+span*(Q.n+1)/3&&me.d<R.len-500){ Q.zust='pass'; Q.t=0; Q.T=18; Q.seite=Q.n?0:(Math.random()<.5?-1:1); Q.n++; }
    else if(me.d>R.len-350||fertig){ Q.zust='zurBurg'; } }
  // 2b) langsamer Überflug: kommt von hinten (bzw. schräg von der Seite) hoch heran, gleitet in 9 m über dich hinweg und steigt vor dir wieder auf
  else if(Q.zust==='pass'){ Q.t+=dt; const k=Math.min(1,Q.t/Q.T), x=.41, d=me.d-55+135*k, hd=headingAt(R,Math.min(R.len,d)), lat=Q.seite*30*(1-k/x), h=k<x?9+18*((x-k)/x)**2:9+22*((k-x)/(1-x))**2;
    fliege(st(d,h).add(new THREE.Vector3(-Math.sin(hd)*lat,0,Math.cos(hd)*lat)),Q.t<2?1.5:4); D.rotateZ(-Q.seite*.2); gleit=true; flap=Math.sin(t*2.4)*.45*Math.max(.3,Math.sin(t*.7));
    if(fertig) Q.zust='zurBurg'; else if(k>=1) Q.zust='begleit'; }
  // 3) fliegt zum Bergfried und kreist dort
  else if(Q.zust==='zurBurg'){ const lp=G.worldToLocal(D.position.clone()); Q.ang=Math.atan2(lp.z-BF.z,lp.x-BF.x); const soll=G.localToWorld(new THREE.Vector3(BF.x+Math.cos(Q.ang)*KR,mitte.y,BF.z+Math.sin(Q.ang)*KR));
    fliege(soll,.8); flap=Math.sin(t*5)*.55; if(D.position.distanceTo(soll)<6){ G.attach(D); Q.zust='kreis'; } }
  else if(Q.zust==='kreis'){ Q.ang+=dt*.3; D.scale.lerp(new THREE.Vector3(1.3,1.3,1.3),Math.min(1,dt)); /* über der Burg etwas größer */ const pos=new THREE.Vector3(BF.x+Math.cos(Q.ang)*KR,mitte.y+4*Math.sin(t*.4),BF.z+Math.sin(Q.ang)*KR);
    D.position.copy(pos); ziel.set(BF.x+Math.cos(Q.ang+.1)*KR,pos.y,BF.z+Math.sin(Q.ang+.1)*KR); D.lookAt(G.localToWorld(ziel)); D.rotateZ(-.35); gleit=true; flap=Math.sin(t*2.2)*.35*Math.max(0,Math.sin(t*.5));
    if(fertig){ Q.zust='landen'; Q.t=0; Q.a=D.position.clone(); Q.b=new THREE.Vector3(BF.x,BF.y+14,BF.z+12); Q.c=new THREE.Vector3(BF.x,BF.y+1.55,BF.z); A.flucht=t; } }
  else if(Q.zust==='landen'){ Q.t+=dt; const k=Math.min(1,Q.t/4), p=bez(Q.a,Q.b,Q.c,bSm(k)); D.position.copy(p); D.scale.lerp(new THREE.Vector3(1,1,1),Math.min(1,dt*2)); flap=Math.sin(t*7)*.7;
    if(k<.97){ ziel.copy(bez(Q.a,Q.b,Q.c,Math.min(1,bSm(k)+.02))); ziel.y=Math.max(ziel.y,p.y-.5); D.lookAt(G.localToWorld(ziel)); } else D.rotation.set(0,0,0);
    if(k>=1){ Q.zust='sitzt'; Q.feuerT=1.8; Q.naechst=t+9; if(A.ergWarten) Q.ergFeuer=true; } }
  else if(Q.zust==='sitzt'){ if(A.ergWarten&&!Q.ergFeuer){ Q.ergFeuer=true; if(Q.feuerT<=0){ Q.feuerT=1.6; Q.naechst=t+9; } } else if(t>Q.naechst){ Q.feuerT=1.5; Q.naechst=t+8+Math.random()*4; } }
  // Ergebnis erst nach dem Feuerstoß auf dem Turm (onFinish setzt ergWarten); kam der Drache gar nicht, gleich
  if(A.ergWarten&&(Q.zust==='weg'||Q.zust==='sitzt'&&Q.ergFeuer&&Q.feuerT<=0)){ A.ergWarten=null; setTimeout(()=>{ if(race.state!=='setup'&&me.done&&!race.resultShown) showResult(); },Q.zust==='weg'?1500:700); }
  // Haltung: Flügel schlagen bzw. halb angelegt, Beine im Flug angezogen, Schwanz pendelt, beim Feuern Maul auf (im Flug Kopf runter, auf dem Turm Kopf hoch)
  const sitzt=Q.zust==='sitzt', fe=Q.feuerT>0; for(const F of Q.fluegel){ F.W.rotation.z=F.s*(sitzt?(fe?.15:.75):flap+(gleit?.05:0)); F.W.rotation.y=sitzt&&!fe?-F.s*.9:0; }
  for(const B of Q.beine) B.rotation.x=sitzt||Q.zust==='landen'&&Q.t>3?0:-1.1; Q.schw.forEach((s,i)=>{ s.rotation.y=.14*Math.sin(t*2-i*.5); s.rotation.x=sitzt?.12:.02*Math.sin(t*3-i); });
  // Kopf: im Tiefflug-Feuer zielt er auf deine Brust (Körper kippt dazu leicht nach vorn), sonst feste Haltung
  const brust=rp.clone().add(new THREE.Vector3(0,1.1,0)), hd0=headingAt(R,Math.min(me.d,R.len)), fw=new THREE.Vector3(Math.cos(hd0),0,Math.sin(hd0)).multiplyScalar(me.done&&!me.free?0:me.v);
  let kx=fe?-.55:sitzt?-.15+.08*Math.sin(t*.8):.1, ky=0; Q.kn=(Q.kn||0)+((feuerFlug?.25:0)-(Q.kn||0))*Math.min(1,dt*4); Q.K.rotation.x=Q.kn;
  if(feuerFlug){ D.updateMatrixWorld(true); const lz=Q.K.worldToLocal(brust.clone().sub(new THREE.Vector3(0,visOff(D.position.x,D.position.z),0))).sub(Q.kopf.position);
    kx=Math.min(1.2,Math.max(-.3,Math.atan2(-lz.y,Math.hypot(lz.x,lz.z)))); ky=Math.min(.7,Math.max(-.7,Math.atan2(lz.x,lz.z))); }
  Q.kx=(Q.kx??kx)+(kx-(Q.kx??kx))*Math.min(1,dt*8); Q.ky=(Q.ky||0)+(ky-(Q.ky||0))*Math.min(1,dt*8); Q.kopf.rotation.x=Q.kx; Q.kopf.rotation.y=Q.ky; Q.kiefer.rotation.x=fe?.55:.05;
  // Feuerstoß: Funken aus dem Maul (auf gezeichnete Höhe gesetzt), werden größer und verglühen von Gelb nach Rot; im Tiefflug gezielt auf die Stelle, an der du gleich bist – wer dich erreicht, zündet dich an und hüllt dich ein
  const wp=new THREE.Vector3(), wd=new THREE.Vector3(); if(fe){ Q.feuerT-=dt; Q.maul.getWorldPosition(wp); wp.y+=visOff(wp.x,wp.z); Q.maul.getWorldDirection(wd); Q.emit=(Q.emit||0)+dt*(feuerFlug?60:55);
    while(Q.emit>=1){ Q.emit--; const F=Q.feuer.find(f=>f.life<=0); if(!F) break; F.p=(F.p||new THREE.Vector3()).copy(wp); F.s.position.copy(wp); F.ziel=feuerFlug; F.hit=false;
      const sp=new THREE.Vector3((Math.random()-.5)*2.5,(Math.random()-.5)*2.5,(Math.random()-.5)*2.5);
      if(feuerFlug){ const tf=brust.distanceTo(wp)/24; F.v.copy(brust).addScaledVector(fw,tf).sub(wp).normalize().multiplyScalar(24).addScaledVector(sp,.6); F.life=F.max=tf*1.2+.25; }
      else { F.v.copy(wd).multiplyScalar(13+Math.random()*5).add(sp); F.life=F.max=.8+Math.random()*.4; } F.s.visible=true; } }
  for(const F of Q.feuer){ if(F.life<=0) continue; F.life-=dt; if(F.life<=0){ F.s.visible=false; continue; } const k=1-F.life/F.max; F.p.addScaledVector(F.v,dt); F.s.position.copy(F.p); // eigene Position, weil kxFrame Sprite-Höhen zurücksetzt
    if(F.ziel&&!F.hit&&F.p.distanceTo(brust)<1.6){ F.hit=true; F.v.copy(fw).add(new THREE.Vector3((Math.random()-.5)*4,.5+Math.random()*1.5,(Math.random()-.5)*4)); F.life=F.max=.45+Math.random()*.3; if(A.brand.T<=0) A.brand.T=7; continue; }
    if(F.hit){ F.v.addScaledVector(fw,dt*2).multiplyScalar(1-dt*2); F.s.scale.setScalar(1.4+k*1.8); }
    else { if(!F.ziel){ F.v.multiplyScalar(1-dt*1.2); F.v.y+=dt*3; } F.s.scale.setScalar(.8+k*(F.ziel?3:4.5)); } F.s.material.opacity=.95*(1-k); F.s.material.color.setRGB(1,.85-.6*k,.35-.3*k); }
  // Fahrer brennt: Flammen an Körper und Rad, zum Ende kleiner, dann nur noch Rauch (rein optisch)
  const Bd=A.brand; if(Bd.T>0){ Bd.T-=dt; const st2=Math.min(1,Bd.T/5); Bd.emit+=dt*(45*st2+6);
    while(Bd.emit>=1){ Bd.emit--; const F=Bd.p.find(f=>f.life<=0); if(!F) break; const flam=Math.random()<st2*.88; F.rauch=!flam; F.p.set(rp.x+(Math.random()-.5)*.9, rp.y+.3+Math.random()*1.5, rp.z+(Math.random()-.5)*.9);
      F.v.set((Math.random()-.5)*.4,flam?1.2+Math.random():.8,(Math.random()-.5)*.4); F.life=F.max=flam?.45+Math.random()*.3:1.6; F.s.visible=true; } }
  for(const F of Bd.p){ if(F.life<=0) continue; F.life-=dt; if(F.life<=0){ F.s.visible=false; continue; } const k=1-F.life/F.max; F.p.addScaledVector(F.v,dt); F.s.position.copy(F.p);
    if(F.rauch){ F.s.material.blending=THREE.NormalBlending; F.s.material.color.set('#5a5550'); F.s.scale.setScalar(.4+k*1.6); F.s.material.opacity=.5*(1-k); }
    else { F.s.material.blending=THREE.AdditiveBlending; F.s.scale.setScalar(.35+k*.6); F.s.material.opacity=.9*(1-k); F.s.material.color.setRGB(1,.8-.55*k,.3-.25*k); } }
  // Raben: kreisen um den Bergfried; landet der Drache, stieben sie auseinander und kommen nach 25 s zurück, die Sitzenden fliegen mit los
  const weg=A.flucht&&t-A.flucht<25?bSm((t-A.flucht)/3)*(1-bSm((t-A.flucht-18)/7)):0;
  for(const r of A.raben){ if(r.sitz&&!r.los&&!(weg>0||Q.zust==='landen')){ r.G.position.copy(r.sitz); r.G.rotation.set(0,r.ph,0); for(const F of r.F) F.W.rotation.z=F.s*.1; continue; }
    if(r.sitz&&!r.los){ r.los=true; r.ang=Math.atan2(r.sitz.z-BF.z,r.sitz.x-BF.x); }
    r.ang+=dt*r.v*(1+weg); const rr=r.rad*(1+weg*2.5), y=r.hoe+weg*14+1.5*Math.sin(t*.7+r.ph), p=new THREE.Vector3(BF.x+Math.cos(r.ang)*rr,y,BF.z+Math.sin(r.ang)*rr), n=new THREE.Vector3(BF.x+Math.cos(r.ang+.1)*rr,y,BF.z+Math.sin(r.ang+.1)*rr);
    r.G.position.copy(p); r.G.lookAt(G.localToWorld(n)); r.G.rotateZ(-.3); for(const F of r.F) F.W.rotation.z=F.s*.6*Math.sin(t*(9+r.ph%3)+r.ph); } }
// Kamera nach dem Zieleinlauf: in 2,5 s etwas zurück und hoch, Blick zwischen Fahrer und Turmspitze – der Fahrer bleibt unten im Bild, oben Bergfried und Drache
function endKamera(){ const A=anim.burg, ich=riders3d[myKey]; if(!A||!A.burg||!ich) return; if(!me.done){ A.zielT=null; return; }
  const tn=performance.now()/1000; if(A.zielT==null) A.zielT=tn; const w=bSm((tn-A.zielT)/2.5); if(w<=0) return;
  const hd=headingAt(R,Math.min(me.d,R.len)), rp=ich.g.position, top=A.burg.localToWorld(new THREE.Vector3(BF.x,BF.y+2,BF.z)), fahrer=rp.clone().add(new THREE.Vector3(0,1.2,0));
  camera.position.add(new THREE.Vector3(-Math.cos(hd)*4*w,4*w,-Math.sin(hd)*4*w)); const now=new THREE.Vector3(camS.lx,camS.ly,camS.lz); camera.lookAt(now.lerp(fahrer.lerp(top,.5),w)); }
