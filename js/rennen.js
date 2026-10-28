/* ---------- Kamera & Zeichnen ---------- */
const camS={x:0,y:0,z:0,lx:0,ly:0,lz:0,init:false};
// Kehren der Strecke: Scheitel (größte Krümmung), Kurvenrichtung und wie weit nach außen (nach mittlerer Steigung ±50 m) – einmal pro Strecke berechnet
function kehrenLinie(){ if(R.kehrL) return R.kehrL; R.kehrL=[];
  for(const k of R.kehren||[]){ let best=0, ad=k; for(let d=k-40; d<=k+40; d+=2){ const c=Math.abs(curv(d)); if(c>best){ best=c; ad=d; } }
    let g=0; for(let d=ad-50; d<=ad+50; d+=2) g+=gradeAt(d); g/=51; const m=g>=8?1:g>=5?.5:g>=4?0:null;
    if(m!=null) R.kehrL.push({d:ad, sg:Math.sign(curv(ad))||1, m}); }
  return R.kehrL; }
function draw(dt){
  const inRace=race.state!=='setup';
  if(!inRace){ speedFx(dt,0); drawPreviews(dt); return; }
  const mine=riders3d[myKey], theirs=riders3d[oppKey];
  mine.g.visible=true; theirs.g.visible=opp.active; RKEYS.forEach(k=>{ if(k!==myKey&&k!==oppKey&&riders3d[k]) riders3d[k].g.visible=false; }); if(riders3d.devil&&oppKey!=='devil') riders3d.devil.g.visible=false;
  // Spur: wer im Windschatten fährt, schert hinter dem Vordermann ein · sonst Ideallinie über die ganze Straße (bis 0,6 m vor den Rand):
  // 25 m vor der Kurve nach außen, am Scheitel innen, danach wieder raustragen lassen. Voll bis 80 m Radius und ab 20 km/h.
  // Kehren bergauf: einmal pro Kehre nach der mittleren Steigung ±50 m eingestuft – ab 4 % Mitte, ab 5 % halb außen, ab 8 % ganz außen (innen ist es zu steil).
  // Dann ohne Umweg nach innen: ab 60 m vorher zur Mitte bzw. nach außen gleiten, bis kurz nach dem Scheitel dort bleiben, danach zurück auf die normale Linie
  const lineAt=(k,o)=>{ const base=ownLane(k), d=o.d, hw=roadW(R,R.loop?d%R.len:d)/2-.6, H=R.island?Math.min(1.2,hw):hw; if(R.stadium||camOverride) return {t:base,H};
    const F=x=>clampN(curv(x)*80,-1,1), a=F(d+5), b=F(d+25), x=clampN(a-.6*Math.sign(b)*Math.max(0,Math.abs(b)-Math.abs(a)),-1,1), s=Math.min(1,o.v/5.56)*Math.abs(x);
    let t=clampN(base+(Math.sign(x)*H-base)*s,-H,H);
    for(const K of kehrenLinie()){ const w=clampN((d-K.d+60)/30,0,1)*clampN((K.d+40-d)/25,0,1); if(w>0) t+=(-K.sg*K.m*H-t)*w; }
    return {t,H}; };
  const tm=lineAt(myKey,me), to=opp.active?lineAt(oppKey,opp):tm;
  if(opp.active&&Math.abs(opp.d-me.d)<2.2&&!R.stadium&&!camOverride){ // nebeneinander: beide fahren die Linie gemeinsam mit 1,2 m Abstand, Reihenfolge wie die Grundspuren
    const up=ownLane(myKey)>=ownLane(oppKey)?1:-1; let a=tm.t, b=to.t; if((a-b)*up<1.2){ const m=(a+b)/2; a=m+.6*up; b=m-.6*up; }
    const H=tm.H, sh=Math.max(0,Math.max(a,b)-H)-Math.max(0,-H-Math.min(a,b)); tm.t=a-sh; to.t=b-sh; }
  const lanes=(r,gapAhead,leader,t,d)=>{ const tgt=ttSpur(d,weinSpur(d,radlerSpur(d,triSpur(d,burgSpur(d,(race.draft&&opp.active&&gapAhead>2&&gapAhead<10&&leader.lane!=null)?leader.lane:t))))); // Südpfalz: an anderen Radlern vorbei, dem Traktor Platz machen · Berwartstein: links am Pferdekarren vorbei · Trifels: dem Gefolge von Löwenherz ausweichen
    if(r.lane==null||camOverride) r.lane=tgt; else r.lane+=(tgt-r.lane)*Math.min(1,dt*1.5); };
  if(mine.lane==null) mine.lane=ownLane(myKey);
  if(theirs.lane==null) theirs.lane=ownLane(oppKey);
  lanes(mine,opp.d-me.d,theirs,tm.t,me.d); lanes(theirs,me.d-opp.d,mine,to.t,opp.d); leanStep(mine,me.d,me.v,dt); if(opp.active) leanStep(theirs,opp.d,opp.v,dt);
  kxFrame();
  wkgGlatt(mine, race.state==='run'?curPower()/weight():0, dt); putRider(mine, me.d, me.crank);
  { const S=camS.sh; mine.body.position.y=S&&!camOverride?S.n*S.a*.5-S.j*.4:0; } // eigener Fahrer rüttelt mit
  if(opp.active){ wkgGlatt(theirs, race.state==='run'?(opp.wkg||0):0, dt); putRider(theirs, opp.d, opp.crank); }
  if(anim.fans && (me.d>R.fans-300 || R.loop || R.abzweig)) poseFans(performance.now()/1000, false);
  if(anim.stadium) poseStadium(performance.now()/1000);
  if(anim.space) poseSpace(dt, performance.now()/1000);
  if(anim.island) poseIsland(dt, performance.now()/1000);
  if(anim.burg) poseBurg(dt); if(anim.tri) poseTrifels(dt); else if(!anim.tt) triTonAus(); if(anim.tt){ poseTeufelstisch(dt); sicher('Teufelstisch-Ton',()=>ttTon(dt)); } // Trifels: welt-trifels.js, Geräusche in welt-trifels-leben.js · Teufelstisch: welt-teufelstisch.js, Geräusche in welt-teufelstisch-ton.js
  if(anim.autos) poseAutos(dt);
  if(anim.radler) poseRadler(dt); // Südpfalz: andere Radfahrer (welt-radler.js)
  if(anim.wb) poseWeinberg(dt); // Südpfalz: Weinstände, Traktor, Weinlese (welt-weinberg.js)
  // Kamera: hinten oben, läuft den Anstieg mit
  const focusD=me.d; let tx,ty,tz,lx,ly,lz;
  // Tempo-Gefühl: sp 0 (≤18 km/h) … 1 (≥45 km/h) nach dem gefühlten Tempo vG (bergauf höher, gefTempo in effekte.js), acc = geglättete Beschleunigung
  // Space: Abstand und Sichtfeld nach dem Grundtempo; Zünden/Hochschalten des Schubs gibt einen Stoß st, der in 3–4 s abklingt
  const vC=race.state==='run'&&(!me.done||me.free)?me.v:0, vG=gefTempo(vC); if(R.space&&dt>0&&!race.paused){ const k=me.sk||1; camS.st=clampN((camS.st||0)*Math.exp(-dt/1.3)+Math.max(0,k-(camS.sk0??k))*.35,0,1); camS.sk0=k; }
  if(dt>0&&!race.paused){ camS.acc=(camS.acc||0)+(((vC-(camS.vp??vC))/dt)-(camS.acc||0))*Math.min(1,dt*2); camS.vp=vC; }
  camS.sp=(camS.sp||0)+(clampN(((R.space?Math.min(vC,me.vb||0):vG)-5)/7.5,0,1)-(camS.sp||0))*Math.min(1,dt*1.5); if(!race.paused) kickStep(dt); const sp=camS.sp, aK=R.space?2*(camS.st||0):clampN(camS.acc||0,0,2), ext=sp*1.5+aK*0.8+(camS.kx||0); // ext: Kamera fällt bei Tempo und Antritt zurück
  let rollT=0; if(R.stadium){ const kc=clampN((bankAt(focusD)*180/Math.PI-ST.BANK0)/(ST.BANK1-ST.BANK0),0,1), u=mine.lane*0.8, pb=trackPt(focusD-(9-3*kc)-ext,u), pl=trackPt(focusD+12,u); [tx,ty,tz]=[pb[0],pb[1]+3.4-1.3*kc-sp*0.8,pb[2]]; [lx,ly,lz]=[pl[0],pl[1]+1.0,pl[2]]; rollT=R.outSign*bankAt(focusD)*.5*kc; } // Steilkurve: Kamera tiefer, näher und mitgeneigt
  else if(R.gpx){ const back=Math.max(0,focusD-6-ext), [bx,bz]=posAt(R,back), [ax,az]=posAt(R,R.loop?focusD+10:Math.min(R.len,focusD+10)); // auf der Straße 6 m hinter dir, knapp 2 m über der Straße, Blick waagerecht
    tx=bx; tz=bz; ty=visRoadY(back)+1.9-sp*0.5; lx=ax; lz=az; ly=ty-0.33+sp*0.15; }
  else { const bk=9+ext, back=Math.max(0,focusD-bk), hd=smoothHeading(focusD), [fx,fz]=posAt(R,focusD); tx=fx-Math.cos(hd)*bk; tz=fz-Math.sin(hd)*bk; ty=(R.space?roadY(back):R.island?Math.max(roadY(back),roadY(focusD),0.3):Math.max(roadY(back), terrainAt(tx,tz)))+4.2-sp*1.3;
    const la=R.ring?focusD+10:Math.min(R.len,focusD+10); [lx,lz]=posAt(R,la); ly=roadY(la)+1.0;
    if(R.space){ const yr=roadY(focusD); ty=Math.max(roadY(back)+1.5, yr+3.6-sp*0.8); ly=yr+1.6+0.25*(roadY(focusD+14)-yr); } } // Space: Kamera bleibt eher waagerecht, Anstiege bauen sich vor dir auf
  if(!R.stadium&&vC>1){ const a=smoothHeading(focusD+6), b=smoothHeading(focusD-6), dh=Math.atan2(Math.sin(a-b),Math.cos(a-b)); rollT=clampN(-dh/12*vC*vC*0.012,-0.07,0.07); } // Kurvenlage: Querbeschleunigung v²·κ, max ≈ 4°
  { const fovT=camOverride?60:60+15*sp+aK*1.5+(R.space?4*(camS.st||0):0); camS.fovB=camS.fovB==null?camera.fov:camS.fovB+(fovT-camS.fovB)*Math.min(1,dt*2);
    const f=camS.fovB+(camOverride?0:clampN((camS.kx||0)/.85,0,1)*5); if(Math.abs(f-camera.fov)>0.02){ camera.fov=f; camera.updateProjectionMatrix(); } } // Sichtfeld weitet sich mit dem Tempo und beim Antritt
  if(!camS.init){ Object.assign(camS,{x:tx,y:ty,z:tz,lx,ly,lz,init:true}); camS.fp=null; }
  if(R.space){ const [px,pz]=posAt(R,focusD), py=roadY(focusD), q=camS.fp; // Space: Kamera fährt die Bewegung des Fahrers direkt mit, geglättet wird nur der Abstand – sonst hängt sie bei 500 km/h 40 m zurück
    if(q&&Math.hypot(px-q[0],pz-q[2])<300){ const dx=px-q[0], dy=py-q[1], dz=pz-q[2]; camS.x+=dx; camS.y+=dy; camS.z+=dz; camS.lx+=dx; camS.ly+=dy; camS.lz+=dz; } camS.fp=[px,py,pz]; }
  const sk=race.paused?1:simSpeed(), k=Math.min(1,dt*3.5*sk), kl=Math.min(1,dt*5*sk); // Testmodus: Kamera folgt im gleichen Tempo
  camS.x+=(tx-camS.x)*k; camS.y+=(ty-camS.y)*k; camS.z+=(tz-camS.z)*k; camS.lx+=(lx-camS.lx)*kl; camS.ly+=(ly-camS.ly)*kl; camS.lz+=(lz-camS.lz)*kl;
  if(camOverride){ camera.position.set(...camOverride.pos); camera.lookAt(...camOverride.look); }
  else { camera.position.set(camS.x,camS.y,camS.z); camera.lookAt(camS.lx,camS.ly,camS.lz); if(anim.burg) burgKamera(dt); if(anim.tri) trifelsKamera(dt); if(anim.tt){ teufelKamera(dt); ttIdyllKamera(dt); ttGastKamera(); } if(anim.space) mondKamera(dt); countKamera(dt,mine,theirs); // Berwartstein: kurzer Schwenk auf die eingestaubten Wegelagerer
    camS.roll=(camS.roll||0)+(rollT-(camS.roll||0))*Math.min(1,dt*3); if(Math.abs(camS.roll)>1e-4) camera.rotateZ(camS.roll); camShake(dt,vC); }
  sun.target.position.set(camS.lx,camS.ly,camS.lz); sun.position.copy(sun.target.position).addScaledVector(SUN_DIR,200);
  sky.position.copy(camera.position); spaceSky.position.copy(camera.position); speedFx(dt, race.paused?0:vG); regenFx(race.paused?0:dt); luftFx(race.paused?0:dt,theirs,opp.active&&race.draft&&!me.done?me.draftR||0:0); partsFx(dt,[[mine,me,'m'],...(opp.active?[[theirs,opp,'o']]:[])]);
  for(const r of [mine,theirs]){ const dist=camera.position.distanceTo(r.g.position), ds=Math.max(1,dist/14); r.tag.scale.set(1.9*ds,.475*ds,1); r.tag.visible=dist>6&&!R.def.burg&&!R.def.ma; } // Namensschild (nicht auf Berwartstein) bleibt auch aus der Ferne lesbar
  renderer.render(ttInnenAn()?TT_INNEN:scene,camera); fotoTick(); // Fotos der Fahrt (auswertung.js): direkt nach dem Zeichnen, sonst ist das Bild leer
  ctx.setTransform(DPR,0,0,DPR,0,0); ctx.clearRect(0,0,W,H); miniMap(); miniProfile();
}
function rightCol(){ // Abstand · Minimap · Leistung untereinander am rechten Rand
  let y=14; const g=$('gapBox'); if(opp.active && race.mode!=='train'){ g.style.display='block'; g.style.top=y+'px'; y+=g.offsetHeight+10; } else g.style.display='none';
  const mmY=y; y+=240+10; const p=$('powBox'); p.style.display=opp.active?'block':'none'; p.style.top=y+'px'; return mmY; // allein: Watt und W/kg stehen schon oben im HUD
}
function glassBox(x,y,w,h){ ctx.fillStyle='rgba(14,22,19,.6)'; ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect?ctx.roundRect(x+.5,y+.5,w-1,h-1,14):ctx.rect(x,y,w,h); ctx.fill(); ctx.stroke(); }
function miniMap(){
  const box=240, x0=W-box-14, y0=rightCol();
  if(!R.mm){ let a=1e9,b=1e9,c=-1e9,d=-1e9; for(let i=0;i<R.xs.length;i++){ a=Math.min(a,R.xs[i]); b=Math.min(b,R.ys[i]); c=Math.max(c,R.xs[i]); d=Math.max(d,R.ys[i]); } R.mm={a,b,s:(box-28)/Math.max(c-a,d-b),w:c-a,h:d-b}; }
  const m=R.mm, ox=x0+(box-m.w*m.s)/2, oy=y0+(box-m.h*m.s)/2, P=(xx,yy)=>[ox+(xx-m.a)*m.s, oy+(yy-m.b)*m.s];
  if(race.kamp){ kampKarte(x0,y0,box); return; } // Missionen: Wasgau-Karte statt Minimap (kampagne.js)
  glassBox(x0,y0,box,box);
  ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.strokeStyle='#c9d6cc'; ctx.lineWidth=3; ctx.beginPath(); for(let i=0;i<R.xs.length;i+=3){ const [a,b]=P(R.xs[i],R.ys[i]); i?ctx.lineTo(a,b):ctx.moveTo(a,b); } ctx.stroke();
  ctx.strokeStyle='#e9a23b'; ctx.lineWidth=3; ctx.beginPath(); for(let i=Math.floor(R.fans/STEP);i<R.xs.length;i+=3){ const [a,b]=P(R.xs[i],R.ys[i]); i===Math.floor(R.fans/STEP)?ctx.moveTo(a,b):ctx.lineTo(a,b); } ctx.stroke();
  const [sx,sy]=P(R.xs[0],R.ys[0]), [ex,ey]=P(R.xs[R.xs.length-1],R.ys[R.ys.length-1]);
  if(R.loop){ for(let j=0;j<4;j++){ ctx.fillStyle=j%2?'#111':'#fff'; ctx.fillRect(sx-2+(j%2)*0,sy-8+j*4,5,4); } }
  else { ctx.fillStyle='#1c7ed6'; ctx.fillRect(sx-4,sy-4,8,8); ctx.fillStyle='#d62828'; ctx.beginPath(); ctx.moveTo(ex,ey-9); ctx.lineTo(ex+7,ey+5); ctx.lineTo(ex-7,ey+5); ctx.fill(); }
  const dot=(d,col)=>{ const [px,py]=posAt(R,d), [a,b]=P(px,py); ctx.fillStyle=col; ctx.strokeStyle=lineCol(col); ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(a,b,6.5,0,7); ctx.fill(); ctx.stroke(); };
  if(opp.active) dot(opp.d,RIDERS[oppKey].dot); dot(me.d,RIDERS[myKey].dot);
  if(race.wind&&!R.space){ const L=13; ctx.save(); ctx.translate(x0+26,y0+26); ctx.rotate(race.windDir); ctx.strokeStyle=ctx.fillStyle='#e9f1f7'; ctx.lineWidth=2.5; // Windpfeil: wohin der Wind weht (Karte genordet wie die Welt)
    ctx.beginPath(); ctx.moveTo(-L,0); ctx.lineTo(L-5,0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(L,0); ctx.lineTo(L-8,-6); ctx.lineTo(L-8,6); ctx.fill(); ctx.restore();
    const hw=windHead(me.d); ctx.font='600 12px Barlow, sans-serif'; ctx.textAlign='left'; ctx.fillStyle='#c9d6cc'; ctx.fillText(`Wind ${Math.round(windNow()*3.6)} km/h`,x0+46,y0+22); ctx.fillText(hw>.5?'Gegenwind':hw<-.5?'Rückenwind':'Seitenwind / geschützt',x0+46,y0+37); }
  if(!R.space){ const g=gradeAt(me.d); ctx.textAlign='right'; ctx.font='600 11px Barlow, sans-serif'; ctx.fillStyle='#c9d6cc'; ctx.fillText('STEIGUNG',x0+box-12,y0+box-38); // Steigung unten rechts, Farbe wie im Höhenprofil, bergab hellblau
    ctx.font='700 24px Barlow, sans-serif'; ctx.fillStyle=g<-1?'#8cc8ec':gradeColor(g); ctx.fillText(de(g)+' %',x0+box-12,y0+box-13); }
}
function miniProfile(){
  const pad=16, h=56, w=W-pad*2, y0=H-pad;
  if(race.mode==='train'){ glassBox(pad-6,y0-h-12,w+12,h+18); drawWo(ctx,pad,y0-h-4,w,h+2,race.woSegs||[],race.woT||1,{cur:race.t,trace:me.trace,k:woK()}); return; }
  if(R.loop){ // Rennfortschritt mit Runden statt Höhenprofil
    const tot=raceLen(), X=d=>pad+Math.min(1,Math.max(0,d/tot))*w, yb=y0-30;
    glassBox(pad-6,y0-h-12,w+12,h+18);
    ctx.fillStyle='rgba(255,255,255,.14)'; ctx.fillRect(pad,yb-6,w,12); ctx.fillStyle='#9cc46b'; ctx.fillRect(pad,yb-6,X(me.d)-pad,12);
    ctx.font='600 13px Barlow, sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#c9d6cc';
    for(let k=0;k<race.laps;k++){ ctx.fillStyle='rgba(10,16,14,.9)'; if(k) ctx.fillRect(X(k*R.len)-1,yb-8,2,16); if(race.laps<=20){ ctx.fillStyle='#c9d6cc'; ctx.fillText('R'+(k+1),(X(k*R.len)+X((k+1)*R.len))/2,yb+26); } }
    const dot=(d,col)=>{ ctx.fillStyle=col; ctx.strokeStyle=lineCol(col); ctx.lineWidth=2; ctx.beginPath(); ctx.arc(X(d),yb,7,0,7); ctx.fill(); ctx.stroke(); };
    if(opp.active) dot(opp.d,RIDERS[oppKey].dot); dot(me.d,RIDERS[myKey].dot); return; }
  let span=1; R.segs.forEach(s=>{ span=Math.max(span, s.e0-R.startElev, s.e0+s.len*s.g/100-R.startElev); });
  glassBox(pad-6,y0-h-12,w+12,h+18);
  const xs=d=>pad+d/R.len*w, ys=e=>y0-(e-R.startElev)/span*(h-6);
  R.segs.forEach(s=>{ ctx.fillStyle=gradeColor(s.g); ctx.beginPath(); ctx.moveTo(xs(s.d0),y0); ctx.lineTo(xs(s.d0),ys(s.e0)); ctx.lineTo(xs(s.d0+s.len),ys(s.e0+s.len*s.g/100)); ctx.lineTo(xs(s.d0+s.len)+.5,y0); ctx.fill(); });
  const dot=(d,col)=>{ ctx.fillStyle=col; ctx.strokeStyle=lineCol(col); ctx.lineWidth=2; ctx.beginPath(); ctx.arc(xs(Math.min(d,R.len)),ys(elevAt(d))-4,6,0,7); ctx.fill(); ctx.stroke(); };
  if(opp.active) dot(opp.d,RIDERS[oppKey].dot); dot(me.d,RIDERS[myKey].dot);
}

/* ================= Rennlogik ================= */
const simErg=()=>live.src==='sim' && race.mode==='train' && $('ergOn').checked && race.state==='run' && !me.done && !(woSeg(race.t)||{}).free;
function curPower(){ return live.src==='sim' ? (simErg()? Math.round(me.tgt||0) : +$('simP').value) : live.power; }
function simStep(dt,P,wkg){
    race.t+=dt; recStep(dt,P);
    me.draftR = !me.done ? Math.max(opp.active?draftOf(opp.d-me.d):0, radlerWind(me.d)) : 0; // auch hinter dem Berg-Rivalen (welt-radler.js)
    me.airS=(me.airS||0)+(airSlope(me,weight(),me.draftR)-(me.airS||0))*Math.min(1,dt/2); // Wind und Windschatten am Trainer, Böen über 2 s geglättet
    if(race.mode==='train') trainStep(dt,P,wkg);
    else { if(!me.done){ step(me,P,weight(),dt,me.draftR); me.time=race.t; me.wkgSum+=wkg*dt; me.maxWkg=Math.max(me.maxWkg,wkg);
      if(R.loop){ const lap=Math.floor(me.d/R.len); if(lap>me.lap){ me.lap=lap; if(lap<race.laps){ if(lap===race.laps-1){ flash('🔔 Letzte Runde!'); [0,250,500].forEach(t=>setTimeout(()=>beep(1320,.12),t)); } else { flash(`Runde ${lap+1} / ${race.laps}`); beep(880); } } } }
      if(me.d>=raceLen()){ me.time=Math.max(0,race.t-(me.d-raceLen())/Math.max(me.v,.1)); me.vf=me.v; me.d=raceLen(); me.done=true; onFinish(); } }
    if(opp.bot && !opp.done){ const bw=botWkgNow(dt); opp.wkg=bw; opp.watt=bw*botKg(); opp.wkgSum+=bw*dt; step(opp,opp.watt,botKg(),dt,draftOf(me.d-opp.d));
      if(opp.d>=raceLen()){ opp.time=Math.max(0,race.t-(opp.d-raceLen())/Math.max(opp.v,.1)); opp.vf=opp.v; opp.d=raceLen(); opp.done=true; opp.avg=opp.wkgSum/race.t; pyroStart(); flash(`${opp.name} ist ${R.loop?'im Ziel':'oben'} – ${fmtT(opp.time)}`); if(!finishCheck() && race.resultShown) showResult(); } } }
}
const simSpeed=()=>race.test&&!(conn&&conn.open)?(race.speed||1):1;
function loop(now){
  const dt=race.last? Math.min(0.1,(now-race.last)/1000) : 0; race.last=now;
  const P=curPower(), wkg=P/weight();
  if(race.state==='run' && !race.frozen && !race.paused){
    const tot=dt*simSpeed(), n=Math.max(1,Math.ceil(tot/0.05)); // Testmodus: schneller simulieren, in kleinen Schritten
    for(let i=0;i<n;i++){ simStep(tot/n,P,wkg); }
    trainerCtl();
  }
  if(race.kamp) kampTick(); // Kampagne: Tafeln
  if(race.state==='run' && !race.paused) wertStep();
  if(opp.active && !opp.bot && !race.frozen && !race.paused){ const age=(now-opp.lastAt)/1000, tgt=opp.done?opp.target:opp.target+opp.v*Math.min(age,1); if(Math.abs(tgt-opp.d)>R.len/2) opp.d=tgt; else opp.d+=(tgt-opp.d)*Math.min(1,dt*6); }
  if(!race.paused&&race.state!=='setup'){ const run=race.state==='run'||race.frozen; // Kurbeln, Wiegetritt und Aero-Haltung beider Figuren
    rideState(riders3d[myKey],me,run&&!(me.done&&!me.free)?P:0,ftp(),dt,live.src!=='sim'?live.cadence:null);
    if(opp.active){ const kg=opp.bot?botKg():weight(), oP=opp.done||!run?0:opp.watt??(opp.wkg||0)*kg; if(!opp.bot) opp.aero=!!opp.ra;
      rideState(riders3d[oppKey],opp,oP,opp.bot?((opp.plan&&opp.plan.A)||3)*kg:1e9,dt,opp.bot?null:opp.rc??null,opp.bot?null:opp.rst); } }
  if(hrNow()) race.hrMax=Math.max(race.hrMax,hrNow());
  rainSound(race.state!=='setup'&&race.rain&&!R.space);
  // Freilauf-Klicken vorerst stumm (Funktion freewheel in main.js bleibt)
  if(0){ const S=(riders3d[myKey]||{}).rs; freewheel(dt, race.state==='run'&&!race.paused&&!race.frozen&&S&&S.cad<8&&me.v>2, me.v); } // Freilauf klickt beim Rollen
  hud(P,wkg); draw(dt); requestAnimationFrame(loop);
}
function hud(P,wkg){
  if(race.state==='setup') return;
  $('hW').textContent=Math.round(P); $('hWkg').textContent=de(wkg);
  $('hDist').textContent=de((race.mode==='train'?(me.dist||0):me.d)/1000,2)+' km'; $('sRest').style.display=race.mode==='train'?'none':'';
  const inPlay=race.state==='run'&&!race.paused&&$('pause').style.display!=='flex';
  $('btnMenu').style.display=inPlay?'block':'none'; // auch nach dem Ende (dann ohne Pause, mit Endwerten)
  $('hV').textContent=de(me.v*3.6,1);
  $('sG').style.display=race.kamp?'':'none'; if(race.kamp) $('hG').textContent=de(gradeAt(me.d))+' %'; $('sZ').style.display=race.mode==='train'||R.loop?'':'none'; // Steigung als Schild nur in der Kampagne (sonst auf der Minimap), Ziel-Watt bzw. Runde daneben
  if(race.mode==='train'){ const sg=woSeg(race.t); $('hZk').textContent='Ziel'; $('hZ').textContent=sg&&sg.free?'frei':Math.round(me.tgt||0)+' W'; woPanel(P,sg); }
  else if(R.loop){ $('hZk').textContent='Runde'; $('hZ').textContent=`${Math.min(race.laps,Math.floor(me.d/R.len)+1)} / ${race.laps}`; $('hRestk').textContent='bis Ziel'; }
  else $('hRestk').textContent=R.kalmit?'bis Gipfel':'bis Ziel';
  if(race.mode!=='train') $('hRest').textContent=de(Math.max(0,raceLen()-me.d)/1000,2)+' km';
  const dr=me.draftR||0, chip=$('draftChip'); chip.style.display=race.draft&&dr>0.02&&!me.done?'flex':'none'; $('draftBar').style.width=Math.round(dr/0.35*100)+'%'; $('draftPct').textContent='−'+Math.round(dr*100)+' %'; $('hT').textContent=fmtT(me.time);
  const hr=hrNow(); $('sHr').style.display=hr?'':'none'; if(hr) $('hHr').textContent=hr; $('hCad').textContent=live.src!=='sim'&&live.cadence!=null?Math.round(live.cadence):'–';
  if(opp.active){ const gap=me.d-opp.d; $('gapName').textContent=`Abstand zu ${opp.name}`;
    $('gapV').textContent=Math.abs(gap)<0.5?'±0 m':(gap>=0?'+':'−')+Math.round(Math.abs(gap))+' m'; $('gapV').style.color=gap>=0?'#9cc46b':'#f0b860';
    const v=Math.max(1,gap>=0?opp.v:me.v); $('gapSub').textContent= R.loop&&Math.abs(gap)>=R.len&&!opp.done?`${Math.floor(Math.abs(gap)/R.len)} Runde${Math.abs(gap)>=2*R.len?'n':''} ${gap>=0?'Vorsprung':'Rückstand'}`: opp.done?`${opp.name} im Ziel: ${fmtT(opp.time)}`:`≈ ${Math.round(Math.abs(gap)/v)} s ${gap>=0?'Vorsprung':'Rückstand'}`; }
  const mk=RIDERS[myKey], ok=RIDERS[oppKey];
  let rows=`<div class="p"><i style="background:${mk.dot}"></i><b>${mk.name}</b><span class="w num">${Math.round(P)} W</span><span class="k num">(${de(wkg)} W/kg)</span></div>`;
  if(opp.active) rows+=`<div class="p"><i style="background:${ok.dot};border-color:${lineCol(ok.dot)}"></i><b>${ok.name}</b>${opp.done?'<span class="w num">Ziel</span><span class="k num"></span>':opp.watt!=null?`<span class="w num">${Math.round(opp.watt)} W</span><span class="k num">(${de(opp.wkg||0)} W/kg)</span>`:`<span class="w num">${de(opp.wkg||0)}</span><span class="k num">W/kg</span>`}</div>`;
  $('powRows').innerHTML=rows;
}
let msgT=null; function flash(t){ const m=$('msg'); m.textContent=t; m.style.display='block'; clearTimeout(msgT); msgT=setTimeout(()=>m.style.display='none',4500); }
function enterRaceView(){ race.speed=1; race.sprung=false; $('sprungBox').style.display=race.mode==='train'?'':'none'; $('sprungKmBox').style.display=R.def.planbar||R.ring?'none':''; document.querySelectorAll('#speedBox button').forEach(x=>x.classList.toggle('sel',x.dataset.s==='1')); $('speedBox').style.display=race.test&&!(conn&&conn.open)?'flex':'none'; $('setup').style.display='none'; $('hud').style.display='flex'; $('woNow').style.display=race.mode==='train'?'block':'none'; if(live.src==='sim') $('simBox').style.display='block'; camS.init=false; }
/* ---------- Wake Lock: Bildschirm bleibt an, solange eine Einheit läuft ---------- */
let wakeLock=null;
async function wakeOn(){ try{ if('wakeLock' in navigator && !wakeLock && document.visibilityState==='visible'){ wakeLock=await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',()=>{ wakeLock=null; }); } }catch(e){} }
function wakeOff(){ try{ wakeLock&&wakeLock.release(); }catch(e){} wakeLock=null; }
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible' && race.state!=='setup') wakeOn(); }); // nach Tab-Wechsel neu anfordern
/* ---------- Bergwertungen und Ortsschilder: wer zuerst drüber ist, holt die Wertung ---------- */
// Nur im Duell (Bot oder online). Online entscheidet der Ersteller und schickt das Ergebnis an den Gast
function prepWert(){ race.wert=[]; if(race.mode==='train'||!opp.active||!R.kom) return; const L=[];
  for(const [a,b,name] of R.kom) L.push({typ:'berg',a,d:b,name});
  for(const [t,za,,zo] of R.zones) if(t==='ort'&&zo&&zo.name&&za>4) L.push({typ:'ort',d:za-4,name:zo.name}); // Ortseingangsschild
  L.sort((p,q)=>p.d-q.d); for(let k=0;k<(R.loop?race.laps:1);k++) for(const w of L) race.wert.push({...w, a:w.a!=null?w.a+k*R.len:null, d:w.d+k*R.len, win:null, ann:false}); }
const wertStand=typ=>{ const L=(race.wert||[]).filter(w=>w.typ===typ); return {me:L.filter(w=>w.win==='me').length, opp:L.filter(w=>w.win==='opp').length, n:L.length}; };
// Trikot: mehr Wertungen gewinnt, bei Gleichstand die zuletzt entschiedene Wertung
const trikotOf=typ=>{ const S=wertStand(typ); if(S.me!==S.opp) return S.me>S.opp?'me':'opp'; const L=race.wert.filter(w=>w.typ===typ&&w.win); return L.length?L[L.length-1].win:null; };
function wertWin(i,who){ const w=race.wert[i], n=who==='me'?RIDERS[myKey].name:opp.name; w.win=who; const S=wertStand(w.typ), st=` (${RIDERS[myKey].name} ${S.me} : ${S.opp} ${opp.name})`;
  if(race.role==='host') send({t:'w',i,h:who==='me'});
  flash(w.typ==='berg'?`⛰️ ${n} holt die Bergwertung ${w.name}!${st}`:`🪧 ${w.name} gehört ${n}!${st}`); who==='me'?[0,140].forEach(t=>setTimeout(()=>beep(1175,.1),t)):beep(440,.15); }
function wertStep(){ const W=race.wert; if(!W||!W.length) return; const auth=!(conn&&conn.open&&race.role==='guest');
  W.forEach((w,i)=>{ if(w.a!=null&&!w.ann&&me.d>=w.a&&me.d<w.d){ w.ann=true; flash(`⛰️ Bergwertung ${w.name} – noch ${de((w.d-w.a)/1000,1)} km bis oben`); beep(988,.1); }
    if(w.win||!auth) return; const a=me.d>=w.d, b=opp.active&&opp.d>=w.d; if(!a&&!b) return;
    const ueber=x=>(x.d-w.d)/Math.max(x.v,.1); // wie lange schon drüber – im selben Schritt gewinnt, wer früher drüber war
    wertWin(i, a&&(!b||ueber(me)>=ueber(opp))?'me':'opp'); }); }
// Kamerafahrt beim Countdown (alle Modi außer Kampagne, Berwartstein hat seine eigene; nicht auf Space und Insel): von hoch oben vor den Fahrern herab auf beide zu, bis „LOS!“ fließend in die normale Kamera
function countKamera(dt,mine,theirs){ if(race.state!=='count'||race.kamp||anim.burg||anim.tri||R.space||R.island||!mine){ camS.cdT=null; return; }
  const t=camS.cdT=(camS.cdT??0)+dt, sm=(a,b)=>bSm((t-a)/(b-a)), V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const pt=(d,u)=>{ d=Math.min(R.len,Math.max(0,d)); if(R.stadium){ const p=trackPt(d,u); return V(p[0],p[1],p[2]); } const [x,z]=posAt(R,d), h=headingAt(R,d); return V(x-Math.sin(h)*u,roadY(d),z+Math.cos(h)*u); }; // u: seitlich zur Fahrtrichtung
  const boden=p=>R.stadium?p.y:Math.max(p.y,terrainAt(p.x,p.z)); // nicht im Hang stecken
  const look=mine.g.position.clone(); if(opp.active&&theirs) look.lerp(theirs.g.position,.5); look.y+=1.1;
  const a=pt(me.d+26,6), b=pt(me.d+10,3); a.y=boden(a)+18; b.y=Math.max(boden(b),look.y)+4.5;
  const pos=a.lerp(b,sm(0,3.6)), f=sm(3.4,5); pos.lerp(camera.position,f); look.lerp(V(camS.lx,camS.ly,camS.lz),f); // ab 3,4 s weich hinter den eigenen Fahrer
  camera.position.copy(pos); camera.lookAt(look); }
function countdown(){
  prepWert(); race.state='count'; enterRaceView(); wakeOn(); recReset();
  const still=!!anim.tri||!!(anim.tt&&anim.tt.innen), pip=(f,d)=>{ if(!still) beep(f,d); }; // Trifels: Kamerafahrt, Teufelstisch: Gasthaus-Szene – Countdown leise und dezent
  let n=5; const b=$('banner'); b.classList.toggle('dezent',still); b.textContent=n; pip(660);
  const iv=setInterval(()=>{ n--; if(n>0){ b.textContent=n; pip(660); } else { clearInterval(iv); b.textContent='LOS!'; pip(1046,.35);
    race.state='run'; race.t=0; setTimeout(()=>{ b.textContent=''; b.classList.remove('dezent'); },1200); } },1000);
}
/* ---------- Pause & Menü: ein Fenster mit Statuszeile, Einstellungen (nur Training), Weiter groß, Beenden abgesetzt ---------- */
function setPause(on,tell=true){
  if(on){ if(race.state!=='run'||race.paused||(me.done&&!me.free)) return; race.paused=true; race.menuOnly=false; if(tell) send({t:'pause'}); setSlope(0);
    $('pauseSub').textContent=tell?'Trainer entlastet · Leertaste = weiter':`${opp.name} hat pausiert – alles steht still.`;
    $('quitAsk').style.display='none'; $('pause').style.display='flex'; pauseView(); }
}
function pauseView(){ const end=race.menuOnly, tr=race.mode==='train'&&!end, wo=tr&&race.woKind==='wo';
  $('pauseTitle').textContent=end?'🏁 Fertig':'⏸ Pause'; $('btnResume').textContent=end?'↩ Zurück in die Lobby':'▶ Weiter';
  $('btnClose').style.display=end?'':'none'; $('btnQuit').style.display=end?'none':''; tcxBtns();
  $('menuOpts').style.display=tr?'':'none'; $('mIntRow').style.display=wo?'':'none'; // in Rennen keine Einstellungen
  $('mErg').checked=$('ergOn').checked; ergLbl(); intUi(); pauseStat(); }
// Statuszeile: Zeit, Strecke, Höhenmeter (nur mit Höhendaten), Ø Watt; darunter Fortschritt (Workout bzw. Strecke) und Abstand zum Gegner
function pauseStat(){ const st=recStats(), d=race.mode==='train'?me.dist||0:me.d, t=(l,v)=>`<div><b>${v}</b><span>${l}</span></div>`;
  $('pStat').innerHTML=t('Zeit',fmtT(me.time))+t('Strecke',de(d/1000,1)+' km')+(st&&st.gain>1?t('Höhenmeter',Math.round(st.gain)+' m'):'')+t('Ø Leistung',st?Math.round(st.avg)+' W':'–');
  let p=null, txt='';
  if(race.mode==='train'){ if(race.woT>0){ p=race.t/race.woT; txt=`Workout ${Math.round(Math.min(1,p)*100)} %`+(p<1?` · noch ${fmtT(race.woT-race.t)}`:''); } }
  else { const L=raceLen(); p=me.d/L; txt=`Strecke ${Math.round(Math.min(1,p)*100)} %`+(p<1?` · noch ${de((L-me.d)/1000,1)} km`:''); }
  $('pProg').style.display=p==null?'none':''; if(p!=null){ $('pBarFill').style.width=Math.min(100,p*100)+'%'; $('pProgTxt').textContent=txt; }
  const g=opp.active?Math.round(me.d-opp.d):null; $('pGap').style.display=g==null?'none':''; if(g!=null) $('pGap').textContent=g>=0?`${g} m vor ${opp.name}`:`${-g} m hinter ${opp.name}`; }
function openMenu(){
  if(me.done&&!me.free){ race.menuOnly=true; // Einheit schon zu Ende: Endwerte zeigen, ohne etwas anzuhalten
    $('pauseSub').textContent='Deine Einheit ist beendet – speichere die Fahrt oder geh zurück in die Lobby.';
    $('quitAsk').style.display='none'; $('pause').style.display='flex'; pauseView(); return; }
  setPause(true); }
const ergLbl=()=>$('mErgLbl').textContent=$('mErg').checked?'An – der Trainer hält die Ziel-Watt':'Aus – du schaltest selbst, der Trainer folgt der Steigung';
$('mErg').onchange=()=>{ $('ergOn').checked=$('mErg').checked; ergLbl(); lastErgW=null; lastSlopeSent=null; };
race.intens=1;
function intUi(){ $('mIntV').textContent=Math.round(race.intens*100)+' %'; }
const intStep=s=>{ race.intens=Math.max(70,Math.min(130,Math.round(race.intens*20)*5+s))/100; lastErgW=null; intUi(); }; // in 5-%-Schritten, 70–130 %
$('mIntM').onclick=()=>intStep(-5); $('mIntP').onclick=()=>intStep(5);
$('btnMenu').onclick=openMenu;
// Beenden-Fenster: mit ungespeicherter Fahrt zuerst „speichern und beenden“ anbieten
const fahrtOffen=()=>rec.s.length>=5&&rec.s.length>rec.savedN;
function quitAsk(){ const o=fahrtOffen(); $('btnQuitSave').style.display=o?'':'none'; $('btnQuitYes').textContent=o?'Ohne Speichern beenden':'Beenden'; $('btnQuitYes').classList.toggle('go',!o);
  $('quitSub').textContent=race.menuOnly?'Zurück in die Lobby.':'Zurück in die Lobby – die Fahrt ist danach vorbei.'; $('quitAsk').style.display='flex'; }
let resumeIv=null;
function resumeRace(tell=true){
  if(!race.paused||resumeIv) return; if(tell) send({t:'resume'}); $('pause').style.display='none';
  let n=3; const b=$('banner'); b.textContent=n; beep(660);
  resumeIv=setInterval(()=>{ n--; if(n>0){ b.textContent=n; beep(660); } else { clearInterval(resumeIv); resumeIv=null; b.textContent='WEITER!'; beep(1046,.3);
    race.paused=false; race.last=0; lastSlopeSent=null; lastErgW=null; opp.lastAt=performance.now(); setTimeout(()=>b.textContent='',900); } },1000);
}
function quitToLobby(){
  const wasGuest=race.role==='guest';
  send({t:'quit'}); try{ conn&&conn.close(); }catch(e){} try{ peer&&peer.destroy(); }catch(e){} conn=null; peer=null;
  if(resumeIv){ clearInterval(resumeIv); resumeIv=null; }
  Object.assign(race,{state:'setup',paused:false,frozen:false,role:null,menuOnly:false}); camOverride=null; setSlope(0); wakeOff(); tcxBtns();
  Object.assign(opp,{active:false,bot:false,done:false,d:0,v:0,watt:null});
  for(const id of ['pause','quitAsk','result','photo','hud','gapBox','powBox','woNow','simBox','draftChip','btnMenu','speedBox']) $(id).style.display='none';
  $('banner').textContent=''; $('msg').style.display='none'; ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,ov.width,ov.height);
  if(anim.stadium&&anim.stadium.confetti){ anim.stadium.confetti.t0=null; anim.stadium.confetti.pts.visible=false; anim.stadium.replay=null; anim.stadium.bell.t0=-1e9; anim.stadium.choreo.t0=-1e9; }
  if(anim.stadium&&anim.stadium.pyro){ const Y=anim.stadium.pyro; Y.t0=null; Y.list.forEach(P=>{ P.glow.visible=P.core.visible=false; P.smoke.forEach(sm=>sm.visible=false); }); Y.sparks.visible=false; Y.lights.forEach(l=>l.intensity=0); }
  // Gast-Sperren der Lobby wieder aufheben
  document.querySelectorAll('.hostonly').forEach(t=>t.style.display='none'); $('modeTag').style.display='none'; $('btnBack').textContent='← Modus wechseln'; $('btnBack2').textContent='← Zurück';
  for(const id of ['draftOn','lapMinus','lapPlus','botOn','botWkg','botKg','botStyle','botAgg','btnHost','btnStart']) $(id).disabled=false; $('botOn').checked=true;
  setConn('');
  if(Object.keys(remoteLooks).length){ for(const k in remoteLooks) delete remoteLooks[k]; rebuildRiders(); } opp.name=RIDERS[oppKey].name; $('joinState').textContent='';
  $('setup').style.display=''; $('cfgScreen').style.display='none'; $('modeScreen').style.display=''; resetRiders(); me.d=0; me.v=0;
  if(wasGuest){ // Reste vom Ersteller entfernen: übernommene Strecke und Workout
    const hi=ROUTES.findIndex(r=>r.id==='host'); if(hi>=0) ROUTES.splice(hi,1);
    WO=loadWo(); routeId=ROUTES[0].id; setRoute(ROUTES[0].def); }
}
$('btnResume').onclick=()=>{ if(!race.menuOnly) return resumeRace(); if(fahrtOffen()) quitAsk(); else quitToLobby(); };
$('btnClose').onclick=()=>{ race.menuOnly=false; $('pause').style.display='none'; };
$('btnQuit').onclick=quitAsk; $('btnQuitNo').onclick=()=>$('quitAsk').style.display='none';
$('btnQuitYes').onclick=quitToLobby; $('btnQuitSave').onclick=()=>{ downloadTcx(); quitToLobby(); };
// Leertaste/Esc: öffnet Pause, schließt sie wieder (weiter); Esc bricht die Beenden-Frage ab
addEventListener('keydown',e=>{ if((e.code!=='Space'&&e.code!=='Escape')||race.state==='setup'||/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return; e.preventDefault();
  if($('quitAsk').style.display==='flex'){ if(e.code==='Escape') $('quitAsk').style.display='none'; return; }
  if($('pause').style.display==='flex'){ if(race.menuOnly) $('btnClose').onclick(); else if(race.paused) resumeRace(); return; }
  if(!race.paused) setPause(true); });
function resetRiders(){ Object.assign(me,{free:false,corr:1,d:0,v:0,vb:0,sk:1,done:false,time:0,wkgSum:0,maxWkg:0,lap:0,draftR:0,dist:0,wSum:0,inZone:0,zoneT:0,trace:[],tgt:0}); race.hrMax=0; race.resultShown=false; race.woIdx=-1; race.woCd=null; lastErgW=null; if(race.mode==='train') prepTrain(); race.photoShown=false; race.photoPending=false; if(anim.space){ anim.space.fw.t0=null; anim.space.fw.bursts=null; } }
function startRace(){
  if(race.role==='guest') return;
  if($('btnStart').disabled) return;
  if(race.mode==='train' && GEN_IDS.includes(routeId)){ const e=genEntry(routeId); if(R.def!==e.def) setRoute(e.def); }
  if(race.kamp){ const e=kampRoute(); if(R.def!==e.def) setRoute(e.def); } // Kampagne: Strecke zum aktuellen Workout // Space/Insel: Strecke passt zum aktuellen Workout
  resetRiders(); race.draft=!race.kamp&&$('draftOn').checked; race.wind=race.kamp?0:+$('windLvl').value; race.windDir=Math.random()*Math.PI*2; // Windrichtung zufällig pro Rennen
  if(conn && conn.open){ Object.assign(opp,{active:true,bot:false,watt:null,name:RIDERS[oppKey].name,d:0,target:0,v:0,done:false}); sendRoute(); send({t:'start',draft:race.draft,tod:race.tod,season:race.season,rain:race.rain,wind:race.wind,wd:race.windDir,mode:race.mode,laps:race.laps,wo:race.mode==='train'?WO:null}); }
  else if($('botOn').checked && race.mode!=='train'){ botLook=zufallLook(); rebuildRiders(); Object.assign(opp,{active:true,bot:true,watt:null,name:RIDERS[oppKey].name,d:0,v:0,done:false,wkgSum:0,avg:0}); opp.plan=botPlan(); }
  else opp.active=false;
  countdown();
}
function pyroStart(){ const A=anim.stadium; if(A && A.sb && !A.replay) takeReplay(); if(A && A.pyro && A.pyro.t0==null) A.pyro.t0=performance.now()/1000; if(A && A.confetti && A.confetti.t0==null) A.confetti.t0=performance.now()/1000;
  if(anim.space && anim.space.fw.t0==null) anim.space.fw.t0=performance.now()/1000; } // Space: Feuerwerk
function onFinish(){
  pyroStart();
  send({t:'s',d:raceLen(),v:0,w:0,done:true,ft:me.time,vf:me.vf,avg:me.wkgSum/Math.max(1,me.time)}); finishCheck();
  beep(523,.15); setTimeout(()=>beep(659,.15),160); setTimeout(()=>beep(784,.4),320); // Zielfanfare (auf allen Strecken)
  $('banner').textContent=R.kalmit?'GIPFEL!':'ZIEL!'; setTimeout(()=>$('banner').textContent='',2500); setSlope(0);
  const B=anim.burg; if(B&&B.drache){ const tok={}; B.ergWarten=tok; B.drache.ergFeuer=false; setTimeout(()=>{ if(B.ergWarten===tok){ B.ergWarten=null; showResult(); } },25000); } // Berwartstein: Ergebnis erst nach dem Feuerstoß des Drachen (burgDrache), 25 s als Sicherheit
  else setTimeout(showResult,R.stadium?6000:1500);
}
