/* ---------- Kamera & Zeichnen ---------- */
const camS={x:0,y:0,z:0,lx:0,ly:0,lz:0,init:false};
// Tempo-Effekte ab 40 km/h: Fahrtwind-Linien am Bildrand (hängen an der Kamera) und Randunschärfe (CSS-Overlay #speedfx)
const wind=(()=>{ const N=60, p=new Float32Array(N*6), q=rng(4711), seed=[];
  const spawn=(o,first)=>{ const a=q()*Math.PI*2, z=-8-q()*14, k=0.35+q()*0.4; Object.assign(o,{x:Math.cos(a)*k*-z*1.4, y:Math.sin(a)*k*-z*0.8, z:first?z*q():z, l:1.5+q()*3}); };
  for(let i=0;i<N;i++){ const o={}; spawn(o,true); seed.push(o); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.LineSegments(g, new THREE.LineBasicMaterial({color:0xf2f6fa, transparent:true, opacity:0, depthWrite:false, fog:false}));
  m.frustumCulled=false; m.visible=false; m.renderOrder=10; camera.add(m); return {m,p,seed,spawn,N}; })();
// Regen draußen: Tropfen um die Kamera (wie im Stadion)
const regen=(()=>{ const N=1800, p=new Float32Array(N*6), q=rng(99), info=[]; for(let i=0;i<N;i++) info.push([(q()-.5)*60,q()*30-8,(q()-.5)*60]);
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:'#d6dee8',transparent:true,opacity:.38,depthWrite:false})); m.frustumCulled=false; m.visible=false; scene.add(m); return {m,p,info}; })();
function regenFx(dt){ const on=race.rain&&!R.stadium&&!R.space; regen.m.visible=on; if(!on) return; const c=camera.position;
  regen.info.forEach((o,i)=>{ o[1]-=13*dt; if(o[1]<-8) o[1]+=30; const x=c.x+o[0]+o[1]*.06, y=c.y+o[1], z=c.z+o[2]; regen.p.set([x,y,z,x+.04,y+.6,z],i*6); }); regen.m.geometry.attributes.position.needsUpdate=true; }
// Partikel: Gischt hinter dem Hinterrad bei Regen, Staub auf dem Betonweg, Blätter im Wald
const parts=(()=>{ const dot=canvasTex(32,32,g=>{ const gr=g.createRadialGradient(16,16,0,16,16,16); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.5,'rgba(255,255,255,.6)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,32,32); });
  const mk=(N,size,op,grav,map)=>{ const g=new THREE.BufferGeometry(), p=new Float32Array(N*3).fill(-1e5), c=new Float32Array(N*3); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3));
    const m=new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,opacity:op,depthWrite:false,map})); m.frustumCulled=false; scene.add(m); return {m,p,c,N,grav,v:new Float32Array(N*3),life:new Float32Array(N),i:0,acc:{}}; };
  return {spray:mk(500,.13,.75,9.8,dot), dust:mk(300,.45,.35,-.15,dot), leaf:mk(80,.16,.95,.5,null), col:new THREE.Color()}; })();
function partSpawn(S,x,y,z,vx,vy,vz,life,col){ const i=S.i; S.i=(S.i+1)%S.N; S.p.set([x,y,z],i*3); S.v.set([vx,vy,vz],i*3); S.life[i]=life; parts.col.set(col); S.c.set([parts.col.r,parts.col.g,parts.col.b],i*3); }
function partStep(S,dt,t){ for(let i=0;i<S.N;i++){ if(S.life[i]<=0) continue; S.life[i]-=dt; if(S.life[i]<=0){ S.p[i*3+1]=-1e5; continue; }
    if(S===parts.leaf){ S.v[i*3]+=Math.sin(t*2.3+i)*dt*1.5; S.v[i*3+2]+=Math.cos(t*1.9+i*1.7)*dt*1.5; } // Blätter trudeln
    S.v[i*3+1]-=S.grav*dt; for(let k=0;k<3;k++) S.p[i*3+k]+=S.v[i*3+k]*dt; }
  S.m.geometry.attributes.position.needsUpdate=true; S.m.geometry.attributes.color.needsUpdate=true; }
const rate=(S,key,r,dt)=>{ S.acc[key]=(S.acc[key]||0)+r*dt; const n=Math.floor(S.acc[key]); S.acc[key]-=n; return n; };
function partsFx(dt,list){ const on=!race.paused&&!camOverride, t=performance.now()/1000; if(!(dt>0)) return;
  if(on) for(const [r,o,key] of list){ if(!r.g.visible||o.v<1.5) continue; const hd=headingAt(R,o.d), cx=Math.cos(hd), cz=Math.sin(hd), p=r.g.position, x=p.x-cx*.5, z=p.z-cz*.5, y=p.y+.08;
    if(race.rain&&!R.space) for(let n=rate(parts.spray,key,o.v*6,dt);n>0;n--){ const s=(Math.random()-.5)*.8; partSpawn(parts.spray,x,y,z,cx*o.v*.55-cz*s,1.5+Math.random()*1.2,cz*o.v*.55+cx*s,.45,Math.random()<.5?'#dfe6ec':'#c4ccd3'); }
    const b=!race.rain&&R.belag&&R.belag.length?belagOf(R,o.d):null;
    if(b&&b[0]==='beton') for(let n=rate(parts.dust,key,o.v*3,dt);n>0;n--){ const s=(Math.random()-.5)*1.6; partSpawn(parts.dust,x,y,z,cx*o.v*.3-cz*s,.3+Math.random()*.4,cz*o.v*.3+cx*s,1.4,'#c2b08f'); } }
  if(on&&R.gpx&&!race.rain&&zoneAt(R,R.loop?me.d%R.len:me.d)==='wald') for(let n=rate(parts.leaf,'w',1.2,dt);n>0;n--){ const hd=headingAt(R,me.d), f=6+Math.random()*20, s=(Math.random()-.5)*12, c=camera.position;
    partSpawn(parts.leaf,c.x+Math.cos(hd)*f-Math.sin(hd)*s,c.y+1+Math.random()*4,c.z+Math.sin(hd)*f+Math.cos(hd)*s,(Math.random()-.5)+Math.cos(race.windDir)*windNow()*.3,-.2,(Math.random()-.5)+Math.sin(race.windDir)*windNow()*.3,5,['#c8892e','#a5652a','#d9b04c','#7d8a3a'][Math.random()*4|0]); }
  for(const k of ['spray','dust','leaf']) partStep(parts[k],dt,t); }
// Windschatten sichtbar: feine Luftlinien hinter dem Vordermann, die sich hinter ihm zusammenziehen – je mehr Windschatten, desto deutlicher
const luft=(()=>{ const N=28, q=rng(321), s=[]; for(let i=0;i<N;i++) s.push({y:.35+q()*1.3, z:(q()-.5)*.9, u:q()});
  const p=new Float32Array(N*6), g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xf2f6fa,transparent:true,opacity:0,depthWrite:false})); m.frustumCulled=false; m.visible=false; scene.add(m); return {m,p,s}; })();
function luftFx(dt,lead,dr){ const L=luft, f=clampN(dr/.35,0,1); L.m.visible=f>.03&&!camOverride&&lead.g.visible; if(!L.m.visible) return;
  L.m.position.copy(lead.g.position); L.m.rotation.copy(lead.g.rotation); L.m.material.opacity=.12+.4*f;
  L.s.forEach((o,i)=>{ o.u=(o.u+dt*1.1)%1; const at=u=>[-.5-u*6, o.y+(1-o.y)*u*.7, o.z*(1-u*.75)], a=at(o.u), b=at(Math.min(1,o.u+.09)); L.p.set([...a,...b],i*6); });
  L.m.geometry.attributes.position.needsUpdate=true; }
function speedFx(dt,v){ const f=clampN((v-10.42)/5.56,0,1), W=wind; // 0 bei 37,5 km/h, 1 bei 57,5 km/h
  W.m.visible=f>0.01&&!R.space&&!camOverride; W.m.material.opacity=0.12+f*0.5;
  if(W.m.visible){ const n=Math.round(20+40*f); W.seed.forEach((o,i)=>{ o.z+=v*1.3*dt; if(o.z>-0.5||Math.abs(o.x)>-o.z*1.3) W.spawn(o,false);
      const L=i<n?o.l*(0.8+f*1.0):0; W.p.set([o.x,o.y,o.z, o.x,o.y,o.z-L], i*6); }); W.m.geometry.attributes.position.needsUpdate=true; }
  const el=speedFx.el||(speedFx.el=document.getElementById('speedfx')), op=camOverride?0:Math.round(f*50)/50;
  if(el&&el._op!==op){ el._op=op; el.style.opacity=op; el.style.display=op>0?'block':'none'; } }
// Kamerawackeln je nach Belag und Tempo: Asphalt fein, Betonweg mit Fugen-Schlag alle 5 m, Pflaster grob; beim Belagwechsel ein Stoß
function camShake(dt,v){ const S=camS.sh||(camS.sh={n:0,r:0,a:0,j:0,b:null,f:0}); if(!$('shakeOn').checked||race.paused||!(dt>0)){ S.a=S.j=0; return; }
  const b=R.belag&&R.belag.length?belagOf(R,me.d):null, t=R.stadium?'holz':R.space?'space':b?b[0]:'asph', kv=clampN(v/12,0,1);
  S.a={asph:.003,beton:.006,pflaster:.025,holz:.0008,space:.001}[t]*kv;
  if(S.b!==null&&S.b!==t&&v>2) S.j=.04*clampN(v/10,.3,1); S.b=t;
  const fu=t==='beton'?Math.floor(me.d/5):0; if(fu!==S.f){ S.f=fu; if(v>2) S.j=Math.max(S.j,.018*clampN(v/10,.3,1)); } // Betonfuge: ta-dong
  S.n+=((Math.random()*2-1)-S.n)*Math.min(1,dt*25); S.r+=((Math.random()*2-1)-S.r)*Math.min(1,dt*18); S.j*=Math.exp(-dt*14); // geglättetes Rauschen wie eine Federung, Stoß klingt ab
  camera.position.y+=S.n*S.a-S.j; camera.rotateX(S.n*S.a*.25); if(t==='pflaster') camera.rotateZ(S.r*.007*kv); }
// Antritt-Kick: springen die Watt deutlich über den Schnitt der letzten Sekunden, fällt die Kamera kurz zurück, das Sichtfeld weitet sich, die Kette klackt
function kickStep(dt){ const P=race.state==='run'&&!me.done?curPower():0; camS.pf=(camS.pf??P)+(P-(camS.pf??P))*Math.min(1,dt/.5); camS.ps=(camS.ps??P)+(P-(camS.ps??P))*Math.min(1,dt/4);
  const now=performance.now()/1000; if(camS.pf>camS.ps*1.4&&camS.pf>1.3*ftp()&&now-(camS.kT||0)>3&&!race.paused){ camS.kT=now; camS.kv=14; klack(); }
  const w=6; camS.kv=(camS.kv||0)+(-w*w*(camS.kx||0)-2*w*(camS.kv||0))*dt; camS.kx=(camS.kx||0)+camS.kv*dt; } // gedämpfte Feder, schwingt in etwa 0,8 s zurück
function draw(dt){
  const inRace=race.state!=='setup';
  if(!inRace){ speedFx(dt,0); drawPreviews(dt); return; }
  const mine=riders3d[myKey], theirs=riders3d[oppKey];
  mine.g.visible=true; theirs.g.visible=opp.active; RKEYS.forEach(k=>{ if(k!==myKey&&k!==oppKey&&riders3d[k]) riders3d[k].g.visible=false; }); if(riders3d.devil&&oppKey!=='devil') riders3d.devil.g.visible=false;
  // Spur: wer im Windschatten fährt, schert hinter dem Vordermann ein · sonst Ideallinie über die ganze Straße (bis 0,6 m vor den Rand):
  // 25 m vor der Kurve nach außen, am Scheitel innen, danach wieder raustragen lassen. Voll bis 80 m Radius und ab 20 km/h. Steile Kehre bergauf (ab 8 %): außen herum, innen ist es zu steil
  const lineAt=(k,o)=>{ const base=ownLane(k), d=o.d, hw=roadW(R,R.loop?d%R.len:d)/2-.6, H=R.island?Math.min(1.2,hw):hw; if(R.stadium||camOverride) return {t:base,H};
    const F=x=>{ const c=curv(x), w=clampN((gradeAt(x)-6)/2,0,1)*clampN((Math.abs(c)-.02)/.015,0,1); return clampN(c*80,-1,1)*(1-2*w); };
    const a=F(d+5), b=F(d+25), x=clampN(a-.6*Math.sign(b)*Math.max(0,Math.abs(b)-Math.abs(a)),-1,1), s=Math.min(1,o.v/5.56)*Math.abs(x);
    return {t:clampN(base+(Math.sign(x)*H-base)*s,-H,H),H}; };
  const tm=lineAt(myKey,me), to=opp.active?lineAt(oppKey,opp):tm;
  if(opp.active&&Math.abs(opp.d-me.d)<2.2&&!R.stadium&&!camOverride){ // nebeneinander: beide fahren die Linie gemeinsam mit 1,2 m Abstand, Reihenfolge wie die Grundspuren
    const up=ownLane(myKey)>=ownLane(oppKey)?1:-1; let a=tm.t, b=to.t; if((a-b)*up<1.2){ const m=(a+b)/2; a=m+.6*up; b=m-.6*up; }
    const H=tm.H, sh=Math.max(0,Math.max(a,b)-H)-Math.max(0,-H-Math.min(a,b)); tm.t=a-sh; to.t=b-sh; }
  const lanes=(r,gapAhead,leader,t)=>{ const tgt=(race.draft&&opp.active&&gapAhead>2&&gapAhead<10&&leader.lane!=null)?leader.lane:t;
    if(r.lane==null||camOverride) r.lane=tgt; else r.lane+=(tgt-r.lane)*Math.min(1,dt*1.5); };
  if(mine.lane==null) mine.lane=ownLane(myKey);
  if(theirs.lane==null) theirs.lane=ownLane(oppKey);
  lanes(mine,opp.d-me.d,theirs,tm.t); lanes(theirs,me.d-opp.d,mine,to.t); leanStep(mine,me.d,me.v,dt); if(opp.active) leanStep(theirs,opp.d,opp.v,dt);
  kxFrame();
  updateForm(mine, race.state==='run'?curPower()/weight():0, dt, true, me.done&&!me.free); putRider(mine, me.d, me.crank);
  { const S=camS.sh; mine.body.position.y=S&&!camOverride?S.n*S.a*.5-S.j*.4:0; } // eigener Fahrer rüttelt mit
  if(opp.active){ updateForm(theirs, race.state==='run'?(opp.wkg||0):0, dt, false, opp.done); putRider(theirs, opp.d, opp.crank); }
  if(anim.fans && (me.d>R.fans-300 || R.loop || R.abzweig)) poseFans(performance.now()/1000, false);
  if(anim.stadium) poseStadium(performance.now()/1000);
  if(anim.space) poseSpace(dt, performance.now()/1000);
  if(anim.island) poseIsland(dt, performance.now()/1000);
  if(anim.autos) poseAutos(dt);
  // Kamera: hinten oben, läuft den Anstieg mit
  const focusD=me.d; let tx,ty,tz,lx,ly,lz;
  // Tempo-Gefühl: sp 0 (≤25 km/h) … 1 (≥54 km/h), acc = geglättete Beschleunigung
  const vC=race.state==='run'&&(!me.done||me.free)?me.v:0; if(dt>0&&!race.paused){ camS.acc=(camS.acc||0)+(((vC-(camS.vp??vC))/dt)-(camS.acc||0))*Math.min(1,dt*2); camS.vp=vC; }
  camS.sp=(camS.sp||0)+(clampN((vC-7)/8,0,1)-(camS.sp||0))*Math.min(1,dt*1.5); if(!race.paused) kickStep(dt); const sp=camS.sp, ext=sp*1.5+clampN(camS.acc||0,0,2)*0.8+(camS.kx||0); // ext: Kamera fällt bei Tempo und Antritt zurück
  let rollT=0; if(R.stadium){ const kc=clampN((bankAt(focusD)*180/Math.PI-ST.BANK0)/(ST.BANK1-ST.BANK0),0,1), u=mine.lane*0.8, pb=trackPt(focusD-(9-3*kc)-ext,u), pl=trackPt(focusD+12,u); [tx,ty,tz]=[pb[0],pb[1]+3.4-1.3*kc-sp*0.8,pb[2]]; [lx,ly,lz]=[pl[0],pl[1]+1.0,pl[2]]; rollT=R.outSign*bankAt(focusD)*.5*kc; } // Steilkurve: Kamera tiefer, näher und mitgeneigt
  else if(R.gpx){ const back=Math.max(0,focusD-6-ext), [bx,bz]=posAt(R,back), [ax,az]=posAt(R,R.loop?focusD+10:Math.min(R.len,focusD+10)); // auf der Straße 6 m hinter dir, knapp 2 m über der Straße, Blick waagerecht
    tx=bx; tz=bz; ty=visRoadY(back)+1.9-sp*0.5; lx=ax; lz=az; ly=ty-0.33+sp*0.15; }
  else { const bk=9+ext, back=Math.max(0,focusD-bk), hd=smoothHeading(focusD), [fx,fz]=posAt(R,focusD); tx=fx-Math.cos(hd)*bk; tz=fz-Math.sin(hd)*bk; ty=(R.space?roadY(back):R.island?Math.max(roadY(back),roadY(focusD),0.3):Math.max(roadY(back), terrainAt(tx,tz)))+4.2-sp*1.3;
    const la=R.ring?focusD+10:Math.min(R.len,focusD+10); [lx,lz]=posAt(R,la); ly=roadY(la)+1.0;
    if(R.space){ const yr=roadY(focusD); ty=Math.max(roadY(back)+1.5, yr+3.6-sp*0.8); ly=yr+1.6+0.25*(roadY(focusD+14)-yr); } } // Space: Kamera bleibt eher waagerecht, Anstiege bauen sich vor dir auf
  if(!R.stadium&&vC>1){ const a=smoothHeading(focusD+6), b=smoothHeading(focusD-6), dh=Math.atan2(Math.sin(a-b),Math.cos(a-b)); rollT=clampN(-dh/12*vC*vC*0.012,-0.07,0.07); } // Kurvenlage: Querbeschleunigung v²·κ, max ≈ 4°
  { const fovT=camOverride?60:60+15*sp+clampN(camS.acc||0,0,2)*1.5; camS.fovB=camS.fovB==null?camera.fov:camS.fovB+(fovT-camS.fovB)*Math.min(1,dt*2);
    const f=camS.fovB+(camOverride?0:clampN((camS.kx||0)/.85,0,1)*5); if(Math.abs(f-camera.fov)>0.02){ camera.fov=f; camera.updateProjectionMatrix(); } } // Sichtfeld weitet sich mit dem Tempo und beim Antritt
  if(!camS.init){ Object.assign(camS,{x:tx,y:ty,z:tz,lx,ly,lz,init:true}); }
  const sk=race.paused?1:simSpeed(), k=Math.min(1,dt*3.5*sk), kl=Math.min(1,dt*5*sk); // Testmodus: Kamera folgt im gleichen Tempo
  camS.x+=(tx-camS.x)*k; camS.y+=(ty-camS.y)*k; camS.z+=(tz-camS.z)*k; camS.lx+=(lx-camS.lx)*kl; camS.ly+=(ly-camS.ly)*kl; camS.lz+=(lz-camS.lz)*kl;
  if(camOverride){ camera.position.set(...camOverride.pos); camera.lookAt(...camOverride.look); }
  else { camera.position.set(camS.x,camS.y,camS.z); camera.lookAt(camS.lx,camS.ly,camS.lz); camS.roll=(camS.roll||0)+(rollT-(camS.roll||0))*Math.min(1,dt*3); if(Math.abs(camS.roll)>1e-4) camera.rotateZ(camS.roll); camShake(dt,vC); }
  sun.target.position.set(camS.lx,camS.ly,camS.lz); sun.position.copy(sun.target.position).addScaledVector(SUN_DIR,200);
  sky.position.copy(camera.position); spaceSky.position.copy(camera.position); speedFx(dt, race.paused?0:vC); regenFx(race.paused?0:dt); luftFx(race.paused?0:dt,theirs,opp.active&&race.draft&&!me.done?me.draftR||0:0); partsFx(dt,[[mine,me,'m'],...(opp.active?[[theirs,opp,'o']]:[])]);
  for(const r of [mine,theirs]){ const dist=camera.position.distanceTo(r.g.position), ds=Math.max(1,dist/14); r.tag.scale.set(1.9*ds,.475*ds,1); r.tag.visible=dist>6; } // Namensschild bleibt auch aus der Ferne lesbar
  renderer.render(scene,camera);
  ctx.setTransform(DPR,0,0,DPR,0,0); ctx.clearRect(0,0,W,H); miniMap(); miniProfile();
}
function rightCol(){ // Abstand · Minimap · Leistung untereinander am rechten Rand
  let y=14; const g=$('gapBox'); if(opp.active && race.mode!=='train'){ g.style.display='block'; g.style.top=y+'px'; y+=g.offsetHeight+10; } else g.style.display='none';
  const mmY=y; y+=240+10; const p=$('powBox'); p.style.display='block'; p.style.top=y+'px'; return mmY;
}
function glassBox(x,y,w,h){ ctx.fillStyle='rgba(14,22,19,.6)'; ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect?ctx.roundRect(x+.5,y+.5,w-1,h-1,14):ctx.rect(x,y,w,h); ctx.fill(); ctx.stroke(); }
function miniMap(){
  const box=240, x0=W-box-14, y0=rightCol();
  if(!R.mm){ let a=1e9,b=1e9,c=-1e9,d=-1e9; for(let i=0;i<R.xs.length;i++){ a=Math.min(a,R.xs[i]); b=Math.min(b,R.ys[i]); c=Math.max(c,R.xs[i]); d=Math.max(d,R.ys[i]); } R.mm={a,b,s:(box-28)/Math.max(c-a,d-b),w:c-a,h:d-b}; }
  const m=R.mm, ox=x0+(box-m.w*m.s)/2, oy=y0+(box-m.h*m.s)/2, P=(xx,yy)=>[ox+(xx-m.a)*m.s, oy+(yy-m.b)*m.s];
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
}
function miniProfile(){
  const pad=16, h=56, w=W-pad*2, y0=H-pad;
  if(race.mode==='train'){ glassBox(pad-6,y0-h-12,w+12,h+18); drawWo(ctx,pad,y0-h-4,w,h+2,race.woSegs||[],race.woT||1,{cur:race.t,trace:me.trace,k:woK()}); return; }
  if(race.mode==='chase'){ const C=race.chase||{}, X=d=>pad+(((d%R.len)+R.len)%R.len)/R.len*w, yb=y0-30;
    glassBox(pad-6,y0-h-12,w+12,h+18);
    ctx.fillStyle='rgba(255,255,255,.14)'; ctx.fillRect(pad,yb-6,w,12);
    ctx.font='600 13px Barlow, sans-serif'; ctx.fillStyle='#c9d6cc'; ctx.textAlign='left'; ctx.fillText(`Runde ${Math.floor(me.d/R.len)+1} · ${Math.round(R.len)} m`,pad,yb+26);
    if(C.dur){ const f=Math.min(1,race.t/C.dur); ctx.fillStyle='rgba(255,255,255,.12)'; ctx.fillRect(pad,yb-22,w,6); ctx.fillStyle='#f2d7ae'; ctx.fillRect(pad,yb-22,w*f,6); ctx.textAlign='right'; ctx.fillText(`noch ${fmtT(Math.max(0,C.dur-race.t))}`,pad+w,yb+26); }
    const dot=(d,col)=>{ ctx.fillStyle=col; ctx.strokeStyle=lineCol(col); ctx.lineWidth=2; ctx.beginPath(); ctx.arc(X(d),yb,7,0,7); ctx.fill(); ctx.stroke(); };
    if(C.started) dot(opp.d,RIDERS.devil.dot); dot(me.d,RIDERS[myKey].dot); return; }
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
    me.draftR = opp.active&&!me.done ? draftOf(opp.d-me.d) : 0;
    me.airS=(me.airS||0)+(airSlope(me,weight(),me.draftR)-(me.airS||0))*Math.min(1,dt/2); // Wind und Windschatten am Trainer, Böen über 2 s geglättet
    if(race.mode==='train') trainStep(dt,P,wkg);
    else if(race.mode==='chase') chaseStep(dt,P,wkg);
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
    for(let i=0;i<n;i++){ simStep(tot/n,P,wkg); if(race.mode==='chase'&&me.done) break; }
    trainerCtl();
  }
  if(race.state==='run' && !race.paused) wertStep();
  if(opp.active && !opp.bot && !race.frozen && !race.paused){ const age=(now-opp.lastAt)/1000, tgt=opp.done?opp.target:opp.target+opp.v*Math.min(age,1); if(Math.abs(tgt-opp.d)>R.len/2) opp.d=tgt; else opp.d+=(tgt-opp.d)*Math.min(1,dt*6); }
  if(!race.paused&&race.state!=='setup'){ const run=race.state==='run'||race.frozen; // Kurbeln, Wiegetritt und Aero-Haltung beider Figuren
    rideState(riders3d[myKey],me,run&&!(me.done&&!me.free)?P:0,ftp(),dt,live.src!=='sim'?live.cadence:null);
    if(opp.active){ const kg=opp.bot?botKg():weight(), oP=opp.done||!run?0:opp.watt??(opp.wkg||0)*kg; if(!opp.bot) opp.aero=!!opp.ra;
      rideState(riders3d[oppKey],opp,oP,opp.bot?((opp.plan&&opp.plan.A)||(race.chase&&race.chase.lvl)||3)*kg:1e9,dt,opp.bot?null:opp.rc??null,opp.bot?null:opp.rst); } }
  if(live.hr) race.hrMax=Math.max(race.hrMax,live.hr);
  rainSound(race.state!=='setup'&&race.rain&&!R.space);
  { const S=(riders3d[myKey]||{}).rs; freewheel(dt, race.state==='run'&&!race.paused&&!race.frozen&&S&&S.cad<8&&me.v>2, me.v); } // Freilauf klickt beim Rollen
  hud(P,wkg); draw(dt); requestAnimationFrame(loop);
}
function hud(P,wkg){
  if(race.state==='setup') return;
  $('hW').textContent=Math.round(P); $('hWkg').textContent=de(wkg);
  $('hDist').textContent=de((race.mode==='train'?(me.dist||0):me.d)/1000,2)+' km'; $('sRest').style.display=race.mode==='train'||(race.mode==='chase'&&!(race.chase&&race.chase.dur))?'none':'';
  const inPlay=race.state==='run'&&!race.paused&&$('pause').style.display!=='flex', canPause=inPlay&&(!me.done||me.free);
  $('btnPause').style.display=canPause?'block':'none'; $('btnMenu').style.display=inPlay?'block':'none'; $('btnMenu').style.right=canPause?'140px':'14px'; // Menü auch nach dem Ende
  $('hV').textContent=de(me.v*3.6,1);
  if(race.mode==='train'){ const sg=woSeg(race.t); $('hGk').textContent='Ziel'; $('hG').textContent=sg&&sg.free?'frei':Math.round(me.tgt||0)+' W'; woPanel(P,sg); }
  else if(race.mode==='chase'){ $('hGk').textContent='Runde'; $('hG').textContent=Math.floor(me.d/R.len)+1; $('hRestk').textContent='noch'; }
  else if(R.loop){ $('hGk').textContent='Runde'; $('hG').textContent=`${Math.min(race.laps,Math.floor(me.d/R.len)+1)} / ${race.laps}`; $('hRestk').textContent='bis Ziel'; }
  else { $('hGk').textContent='Steigung'; $('hG').textContent=de(gradeAt(me.d))+' %'; $('hRestk').textContent=R.kalmit?'bis Gipfel':'bis Ziel'; }
  if(race.mode==='chase') $('hRest').textContent=fmtT(Math.max(0,((race.chase||{}).dur||0)-race.t));
  else if(race.mode!=='train') $('hRest').textContent=de(Math.max(0,raceLen()-me.d)/1000,2)+' km';
  const dr=me.draftR||0, chip=$('draftChip'); chip.style.display=race.draft&&dr>0.02&&!me.done?'flex':'none'; $('draftBar').style.width=Math.round(dr/0.35*100)+'%'; $('draftPct').textContent='−'+Math.round(dr*100)+' %'; $('hT').textContent=fmtT(me.time);
  $('hHr').textContent=live.hr??'–'; $('hCad').textContent=live.src!=='sim'&&live.cadence!=null?Math.round(live.cadence):'–';
  if(opp.active && race.mode==='chase'){ const C=race.chase||{}, gap=me.d-opp.d; $('gapName').textContent='Vorsprung auf den Teufel';
    $('gapV').textContent=Math.round(Math.max(0,gap))+' m'; $('gapV').style.color=!C.started||gap>60?'#9cc46b':gap>20?'#f0b860':'#ff6b6b';
    $('gapSub').textContent=me.done&&C.caught?'erwischt!':!C.started?`Teufel startet in ${Math.max(0,Math.ceil(C.delay-race.t))} s`:`≈ ${Math.round(Math.max(0,gap)/Math.max(1,opp.v))} s Vorsprung`; }
  else if(opp.active){ const gap=me.d-opp.d; $('gapName').textContent=`Abstand zu ${opp.name}`;
    $('gapV').textContent=Math.abs(gap)<0.5?'±0 m':(gap>=0?'+':'−')+Math.round(Math.abs(gap))+' m'; $('gapV').style.color=gap>=0?'#9cc46b':'#f0b860';
    const v=Math.max(1,gap>=0?opp.v:me.v); $('gapSub').textContent= R.loop&&Math.abs(gap)>=R.len&&!opp.done?`${Math.floor(Math.abs(gap)/R.len)} Runde${Math.abs(gap)>=2*R.len?'n':''} ${gap>=0?'Vorsprung':'Rückstand'}`: opp.done?`${opp.name} im Ziel: ${fmtT(opp.time)}`:`≈ ${Math.round(Math.abs(gap)/v)} s ${gap>=0?'Vorsprung':'Rückstand'}`; }
  const mk=RIDERS[myKey], ok=RIDERS[oppKey];
  let rows=`<div class="p"><i style="background:${mk.dot}"></i><b>${mk.name}</b><span class="w num">${Math.round(P)} W</span><span class="k num">(${de(wkg)} W/kg)</span></div>`;
  if(opp.active) rows+=`<div class="p"><i style="background:${ok.dot};border-color:${lineCol(ok.dot)}"></i><b>${ok.name}</b>${opp.done&&race.mode!=='chase'?'<span class="w num">Ziel</span><span class="k num"></span>':opp.watt!=null?`<span class="w num">${Math.round(opp.watt)} W</span><span class="k num">(${de(opp.wkg||0)} W/kg)</span>`:`<span class="w num">${de(opp.wkg||0)}</span><span class="k num">W/kg</span>`}</div>`;
  $('powRows').innerHTML=rows;
}
let msgT=null; function flash(t){ const m=$('msg'); m.textContent=t; m.style.display='block'; clearTimeout(msgT); msgT=setTimeout(()=>m.style.display='none',4500); }
function enterRaceView(){ race.speed=1; document.querySelectorAll('#speedBox button').forEach(x=>x.classList.toggle('sel',x.dataset.s==='1')); $('speedBox').style.display=race.test&&!(conn&&conn.open)?'flex':'none'; $('setup').style.display='none'; $('hud').style.display='flex'; $('woNow').style.display=race.mode==='train'?'block':'none'; if(live.src==='sim') $('simBox').style.display='block'; camS.init=false; }
/* ---------- Wake Lock: Bildschirm bleibt an, solange eine Einheit läuft ---------- */
let wakeLock=null;
async function wakeOn(){ try{ if('wakeLock' in navigator && !wakeLock && document.visibilityState==='visible'){ wakeLock=await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',()=>{ wakeLock=null; }); } }catch(e){} }
function wakeOff(){ try{ wakeLock&&wakeLock.release(); }catch(e){} wakeLock=null; }
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible' && race.state!=='setup') wakeOn(); }); // nach Tab-Wechsel neu anfordern
/* ---------- Bergwertungen und Ortsschilder: wer zuerst drüber ist, holt die Wertung ---------- */
// Nur im Duell (Bot oder online). Online entscheidet der Ersteller und schickt das Ergebnis an den Gast
function prepWert(){ race.wert=[]; if(race.mode==='train'||race.mode==='chase'||!opp.active||!R.kom) return; const L=[];
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
function countdown(){
  prepWert(); race.state='count'; enterRaceView(); wakeOn(); recReset();
  let n=5; const b=$('banner'); b.textContent=n; beep(660);
  const iv=setInterval(()=>{ n--; if(n>0){ b.textContent=n; beep(660); } else { clearInterval(iv); b.textContent='LOS!'; beep(1046,.35);
    race.state='run'; race.t=0; setTimeout(()=>b.textContent='',1200); } },1000);
}
/* ---------- Pause & Beenden ---------- */
function setPause(on,tell=true){
  if(on){ if(race.state!=='run'||race.paused||(me.done&&!me.free)) return; race.paused=true; if(tell) send({t:'pause'}); setSlope(0);
    $('pauseSub').textContent=tell?'Alles steht still – der Trainer ist auf flach gestellt.':`${opp.name} hat pausiert – alles steht still.`;
    $('pauseMain').style.display=''; $('pauseAsk').style.display='none'; $('pause').style.display='flex'; pauseView(false); }
}
/* ---------- Menü: pausiert, ERG und (im eigenen Workout) Intensität einstellen, zurück in die Lobby ---------- */
function pauseView(menu){ const tr=race.mode==='train'&&!race.menuOnly, wo=tr&&race.woKind==='wo';
  $('btnResume').textContent=race.menuOnly?'Schließen':'▶ Weiter'; tcxBtns();
  if(race.menuOnly){ $('pauseTitle').textContent='Menü'; $('menuOpts').style.display='none'; $('btnQuit').textContent='↩ Zurück in die Lobby'; return; }
  $('pauseTitle').textContent=menu?'Menü':'Pause'; $('menuOpts').style.display=menu?'':'none'; $('btnQuit').textContent=menu?'↩ Zurück in die Lobby':'Beenden';
  $('mErgRow').style.display=tr?'':'none'; $('mIntRow').style.display=wo?'':'none'; $('mNoOpts').style.display=tr?'none':'';
  $('mErg').checked=$('ergOn').checked; ergLbl(); intUi(); }
function openMenu(){
  if(me.done&&!me.free){ race.menuOnly=true; // Einheit schon zu Ende: Menü öffnen, ohne etwas anzuhalten
    $('pauseSub').textContent='Deine Einheit ist beendet. Hier kannst du die Fahrt speichern und zurück in die Lobby gehen.';
    $('pauseMain').style.display=''; $('pauseAsk').style.display='none'; $('pause').style.display='flex'; pauseView(true); return; }
  race.menuOnly=false; if(!race.paused) setPause(true); if(race.paused) pauseView(true); }
const ergLbl=()=>$('mErgLbl').textContent=$('mErg').checked?'An – der Trainer hält die Ziel-Watt':'Aus – du schaltest selbst, der Trainer folgt der Steigung';
$('mErg').onchange=()=>{ $('ergOn').checked=$('mErg').checked; ergLbl(); lastErgW=null; lastSlopeSent=null; };
race.intens=1;
function intUi(){ const v=Math.round(race.intens*100); $('mInt').value=v; $('mIntV').textContent=v+' %'; document.querySelectorAll('#mIntRow button').forEach(b=>b.classList.toggle('sel',+b.dataset.i===v)); }
$('mInt').oninput=()=>{ race.intens=+$('mInt').value/100; lastErgW=null; intUi(); };
document.querySelectorAll('#mIntRow button').forEach(b=>b.onclick=()=>{ race.intens=+b.dataset.i/100; lastErgW=null; intUi(); });
$('btnMenu').onclick=openMenu;
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
  for(const id of ['pause','result','photo','hud','gapBox','powBox','woNow','simBox','draftChip','btnPause','btnMenu','speedBox']) $(id).style.display='none';
  $('banner').textContent=''; $('msg').style.display='none'; ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,ov.width,ov.height);
  if(anim.stadium&&anim.stadium.confetti){ anim.stadium.confetti.t0=null; anim.stadium.confetti.pts.visible=false; anim.stadium.replay=null; anim.stadium.bell.t0=-1e9; anim.stadium.choreo.t0=-1e9; }
  if(anim.stadium&&anim.stadium.pyro){ const Y=anim.stadium.pyro; Y.t0=null; Y.list.forEach(P=>{ P.glow.visible=P.core.visible=false; P.smoke.forEach(sm=>sm.visible=false); }); Y.sparks.visible=false; Y.lights.forEach(l=>l.intensity=0); }
  // Gast-Sperren der Lobby wieder aufheben
  document.querySelectorAll('.hostonly').forEach(t=>t.style.display='none'); $('modeTag').style.display='none'; $('btnBack').textContent='← Modus wechseln'; $('btnBack2').textContent='← Zurück';
  for(const id of ['formsOn','draftOn','lapMinus','lapPlus','botOn','botRider','botWkg','botKg','botStyle','botAgg','btnHost','btnStart']) $(id).disabled=false; $('botOn').checked=true;
  document.querySelectorAll('.rcard').forEach(c=>c.classList.remove('taken')); setConn('');
  if(Object.keys(remoteLooks).length){ for(const k in remoteLooks) delete remoteLooks[k]; rebuildRiders(); } oppKey=botKey; opp.name=RIDERS[oppKey].name; $('joinState').textContent='';
  $('setup').style.display=''; $('cfgScreen').style.display='none'; $('modeScreen').style.display=''; resetRiders(); me.d=0; me.v=0;
  if(wasGuest){ // Reste vom Ersteller entfernen: übernommene Strecke und Workout
    const hi=ROUTES.findIndex(r=>r.id==='host'); if(hi>=0) ROUTES.splice(hi,1);
    WO=loadWo(); routeId=ROUTES[0].id; setRoute(ROUTES[0].def); }
}
$('btnPause').onclick=()=>setPause(true); $('btnResume').onclick=()=>{ if(race.menuOnly){ race.menuOnly=false; $('pause').style.display='none'; } else resumeRace(); };
$('btnQuit').onclick=()=>{ $('pauseMain').style.display='none'; $('pauseAsk').style.display=''; };
$('btnQuitNo').onclick=()=>{ $('pauseMain').style.display=''; $('pauseAsk').style.display='none'; };
$('btnQuitYes').onclick=quitToLobby;
addEventListener('keydown',e=>{ if(e.code!=='Space'||race.state==='setup'||/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return; e.preventDefault();
  if(race.menuOnly){ if($('pauseAsk').style.display==='none'){ race.menuOnly=false; $('pause').style.display='none'; } return; }
  if(race.paused){ if($('pauseAsk').style.display==='none') resumeRace(); } else setPause(true); });
function resetRiders(){ Object.assign(me,{free:false,corr:1,d:0,v:0,done:false,time:0,wkgSum:0,maxWkg:0,lap:0,draftR:0,dist:0,wSum:0,inZone:0,zoneT:0,trace:[],tgt:0}); race.hrMax=0; race.resultShown=false; race.woIdx=-1; race.woCd=null; lastErgW=null; if(race.mode==='train') prepTrain(); race.photoShown=false; race.photoPending=false; if(anim.space){ anim.space.fw.t0=null; anim.space.fw.bursts=null; } }
function startRace(){
  if(race.role==='guest') return;
  if($('btnStart').disabled) return;
  if(race.mode==='train' && GEN_IDS.includes(routeId)){ const e=genEntry(routeId); if(R.def!==e.def) setRoute(e.def); } // Space/Insel: Strecke passt zum aktuellen Workout
  resetRiders(); race.forms=$('formsOn').checked; race.draft=$('draftOn').checked; race.wind=+$('windLvl').value; race.windDir=Math.random()*Math.PI*2; // Windrichtung zufällig pro Rennen
  if(race.mode==='chase'){ oppKey='devil'; Object.assign(opp,{active:true,bot:true,watt:null,wkg:0,name:'Teufel',d:0,v:0,done:false,wkgSum:0,avg:0});
    const C=chaseCfg(); race.chase={...C,lvl:C.wkg,started:false,caught:false}; race.draft=false; riders3d.devil.lane=null; }
  else if(conn && conn.open){ Object.assign(opp,{active:true,bot:false,watt:null,name:RIDERS[oppKey].name,d:0,target:0,v:0,done:false}); sendRoute(); send({t:'start',forms:race.forms,draft:race.draft,tod:race.tod,rain:race.rain,wind:race.wind,wd:race.windDir,mode:race.mode,laps:race.laps,wo:race.mode==='train'?WO:null}); }
  else if($('botOn').checked && race.mode!=='train'){ oppKey=botKey; Object.assign(opp,{active:true,bot:true,watt:null,name:RIDERS[oppKey].name,d:0,v:0,done:false,wkgSum:0,avg:0}); opp.plan=botPlan(); }
  else opp.active=false;
  countdown();
}
function pyroStart(){ const A=anim.stadium; if(A && A.sb && !A.replay) takeReplay(); if(A && A.pyro && A.pyro.t0==null) A.pyro.t0=performance.now()/1000; if(A && A.confetti && A.confetti.t0==null) A.confetti.t0=performance.now()/1000;
  if(anim.space && anim.space.fw.t0==null) anim.space.fw.t0=performance.now()/1000; } // Space: Feuerwerk
function onFinish(){
  pyroStart();
  send({t:'s',d:raceLen(),v:0,w:0,done:true,ft:me.time,vf:me.vf,avg:me.wkgSum/Math.max(1,me.time)}); finishCheck();
  beep(523,.15); setTimeout(()=>beep(659,.15),160); setTimeout(()=>beep(784,.4),320);
  $('banner').textContent=R.kalmit?'GIPFEL!':'ZIEL!'; setTimeout(()=>$('banner').textContent='',2500); setSlope(0); setTimeout(showResult,R.stadium?6000:1500);
}
