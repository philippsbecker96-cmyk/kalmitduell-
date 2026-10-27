/* ================= Effekte: Fahrtwind, Regen, Partikel, Windschatten-Linien, Kamerawackeln, Antritt-Kick =================
   Werden in rennen.js (draw) aufgerufen; camS (Kamerazustand) liegt dort. */
// Tempo-Effekte ab 28 km/h gefühltem Tempo (gefTempo): Fahrtwind-Linien am Bildrand (hängen an der Kamera), Randschlieren (Canvas #schlieren) und Randunschärfe (CSS-Overlay #speedfx)
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
// Partikel: Gischt hinter dem Hinterrad bei Regen, Staub auf dem Betonweg und dem Waldweg (Berwartstein), Blätter im Wald
const parts=(()=>{ const dot=canvasTex(32,32,g=>{ const gr=g.createRadialGradient(16,16,0,16,16,16); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.5,'rgba(255,255,255,.6)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,32,32); });
  const mk=(N,size,op,grav,map)=>{ const g=new THREE.BufferGeometry(), p=new Float32Array(N*3).fill(-1e5), c=new Float32Array(N*3); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3));
    const m=new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,opacity:op,depthWrite:false,map})); m.frustumCulled=false; scene.add(m); return {m,p,c,N,grav,v:new Float32Array(N*3),life:new Float32Array(N),i:0,acc:{}}; };
  return {spray:mk(500,.13,.75,9.8,dot), dust:mk(700,.45,.35,-.15,dot), leaf:mk(80,.16,.95,.5,null), col:new THREE.Color()}; })();
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
    if(b&&b[0]==='beton') for(let n=rate(parts.dust,key,o.v*3,dt);n>0;n--){ const s=(Math.random()-.5)*1.6; partSpawn(parts.dust,x,y,z,cx*o.v*.3-cz*s,.3+Math.random()*.4,cz*o.v*.3+cx*s,1.4,'#c2b08f'); }
    if(b&&b[0]==='erde') for(let n=rate(parts.dust,key,o.v*4,dt);n>0;n--){ const s=(Math.random()-.5)*1.4; partSpawn(parts.dust,x,y,z,cx*o.v*.25-cz*s,.25+Math.random()*.5,cz*o.v*.25+cx*s,1.6,Math.random()<.5?'#b98466':'#a8765a'); } } // roter Sandsteinsand
  const zl=R.gpx&&!race.rain?zoneAt(R,R.loop?me.d%R.len:me.d):null, hb=race.season==='herbst'&&!R.def.burg, lr=zl==='wald'?(hb?3.6:.5):zl==='reben'&&hb?2:0; // Herbst: viel mehr Blätter, auch in den Weinbergen (gelb)
  if(on&&lr) for(let n=rate(parts.leaf,'w',lr,dt);n>0;n--){ const hd=headingAt(R,me.d), f=6+Math.random()*20, s=(Math.random()-.5)*12, c=camera.position;
    partSpawn(parts.leaf,c.x+Math.cos(hd)*f-Math.sin(hd)*s,c.y+1+Math.random()*4,c.z+Math.sin(hd)*f+Math.cos(hd)*s,(Math.random()-.5)+Math.cos(race.windDir)*windNow()*.3,-.2,(Math.random()-.5)+Math.sin(race.windDir)*windNow()*.3,5,(zl==='reben'?['#d9b03c','#e0c24a','#c99a34']:hb?['#c9572a','#d9822e','#e0b33c','#a8452a','#9a6a32']:['#7d8a3a','#8f8a3a','#9a7a3a'])[Math.random()*(zl==='reben'||!hb?3:5)|0]); }
  for(const k of ['spray','dust','leaf']) partStep(parts[k],dt,t); }
// Windschatten sichtbar: feine Luftlinien hinter dem Vordermann, die sich hinter ihm zusammenziehen – je mehr Windschatten, desto deutlicher
const luft=(()=>{ const N=28, q=rng(321), s=[]; for(let i=0;i<N;i++) s.push({y:.35+q()*1.3, z:(q()-.5)*.9, u:q()});
  const p=new Float32Array(N*6), g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xf2f6fa,transparent:true,opacity:0,depthWrite:false})); m.frustumCulled=false; m.visible=false; scene.add(m); return {m,p,s}; })();
function luftFx(dt,lead,dr){ const L=luft, f=clampN(dr/.35,0,1); L.m.visible=f>.03&&!camOverride&&lead.g.visible; if(!L.m.visible) return;
  L.m.position.copy(lead.g.position); L.m.rotation.copy(lead.g.rotation); L.m.material.opacity=.12+.4*f;
  L.s.forEach((o,i)=>{ o.u=(o.u+dt*1.1)%1; const at=u=>[-.5-u*6, o.y+(1-o.y)*u*.7, o.z*(1-u*.75)], a=at(o.u), b=at(Math.min(1,o.u+.09)); L.p.set([...a,...b],i*6); });
  L.m.geometry.attributes.position.needsUpdate=true; }
// Gefühltes Tempo: bergauf zählt jede km/h mehr (× 1 + 0,15 je % Steigung, höchstens × 3; 18 km/h bei 8 % wirken wie 40), bergab und im Stadion/Space das echte Tempo; Steigung über 50 m gemittelt
function gefTempo(v){ if(!R||R.space||R.stadium||!(v>0)) return v; let g=0; for(let k=-30;k<=20;k+=10) g+=gradeAt(me.d+k); return v*Math.min(3,1+.15*Math.max(0,g/6)); }
// Randschlieren: weiche helle Striche laufen am Bildrand von innen nach außen (Canvas in halber Auflösung, liegt unter #speedfx und wird dort mit verwischt)
const schl=(()=>{ const q=rng(77), s=[]; for(let i=0;i<28;i++){ const o={}; o.neu=erst=>{ o.a=q()*Math.PI*2; o.r=erst?.5+q()*.7:.5+q()*.15; o.k=.7+q()*.6; o.w=1+q()*1.6; }; o.neu(true); s.push(o); } return {s,el:null,cx:null,an:false}; })();
function schlierenFx(dt,v,f){ const S=schl, el=S.el||(S.el=document.getElementById('schlieren')); if(!el) return;
  if(!(f>.01&&!R.space&&!camOverride)){ if(S.an){ el.style.display='none'; S.an=false; } return; } if(!S.an){ el.style.display='block'; S.an=true; }
  const W=Math.round(innerWidth/2), H=Math.round(innerHeight/2); if(el.width!==W||el.height!==H){ el.width=W; el.height=H; S.cx=null; } const c=S.cx||(S.cx=el.getContext('2d'));
  c.clearRect(0,0,W,H); c.lineCap='round'; const mx=W/2, my=H*.55, n=Math.round(10+18*f);
  S.s.forEach((o,i)=>{ o.r+=dt*v*.09*o.k; if(o.r>1.25) o.neu(false); if(i>=n) return; // r: 0,5 innen (noch unsichtbar) … ab ≈ 0,85 aus dem Bild
    const L=.08+.22*f*o.k, ca=Math.cos(o.a)*W*.6, sa=Math.sin(o.a)*H*.6, x0=mx+ca*o.r, y0=my+sa*o.r, x1=mx+ca*(o.r+L), y1=my+sa*(o.r+L), gr=c.createLinearGradient(x0,y0,x1,y1);
    gr.addColorStop(0,'rgba(240,246,252,0)'); gr.addColorStop(1,`rgba(240,246,252,${((.12+.28*f)*Math.min(1,(o.r-.5)*4)).toFixed(3)})`);
    c.strokeStyle=gr; c.lineWidth=o.w*(.6+.8*f); c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y1); c.stroke(); }); }
function speedFx(dt,v){ const f=clampN((v-7.78)/6.11,0,1), W=wind; // 0 bei 28 km/h, 1 bei 50 km/h (gefühltes Tempo)
  schlierenFx(dt,v,f);
  W.m.visible=f>0.01&&!R.space&&!camOverride; W.m.material.opacity=0.12+f*0.5;
  if(W.m.visible){ const n=Math.round(20+40*f); W.seed.forEach((o,i)=>{ o.z+=v*1.3*dt; if(o.z>-0.5||Math.abs(o.x)>-o.z*1.3) W.spawn(o,false);
      const L=i<n?o.l*(0.8+f*1.0):0; W.p.set([o.x,o.y,o.z, o.x,o.y,o.z-L], i*6); }); W.m.geometry.attributes.position.needsUpdate=true; }
  const el=speedFx.el||(speedFx.el=document.getElementById('speedfx')), op=camOverride?0:Math.round(f*50)/50;
  if(el&&el._op!==op){ el._op=op; el.style.opacity=op; el.style.display=op>0?'block':'none'; } }
// Kamerawackeln je nach Belag und Tempo: Asphalt fein, Betonweg mit Fugen-Schlag alle 5 m, Pflaster grob; beim Belagwechsel ein Stoß
function camShake(dt,v){ const S=camS.sh||(camS.sh={n:0,r:0,a:0,j:0,b:null,f:0}); if(!$('shakeOn').checked||race.paused||!(dt>0)){ S.a=S.j=0; return; }
  const b=R.belag&&R.belag.length?belagOf(R,me.d):null, t=R.stadium?'holz':R.space?'space':b?b[0]:'asph', kv=clampN(v/12,0,1);
  S.a={asph:.003,beton:.006,pflaster:.025,erde:.009,holz:.0008,space:.001}[t]*kv;
  if(S.b!==null&&S.b!==t&&v>2) S.j=.04*clampN(v/10,.3,1); S.b=t;
  const fu=t==='beton'?Math.floor(me.d/5):0; if(fu!==S.f){ S.f=fu; if(v>2) S.j=Math.max(S.j,.018*clampN(v/10,.3,1)); } // Betonfuge: ta-dong
  S.n+=((Math.random()*2-1)-S.n)*Math.min(1,dt*25); S.r+=((Math.random()*2-1)-S.r)*Math.min(1,dt*18); S.j*=Math.exp(-dt*14); // geglättetes Rauschen wie eine Federung, Stoß klingt ab
  camera.position.y+=S.n*S.a-S.j; camera.rotateX(S.n*S.a*.25); if(t==='pflaster') camera.rotateZ(S.r*.007*kv); }
// Antritt-Kick: springen die Watt deutlich über den Schnitt der letzten Sekunden, fällt die Kamera kurz zurück, das Sichtfeld weitet sich, die Kette klackt
function kickStep(dt){ const P=race.state==='run'&&!me.done?curPower():0; camS.pf=(camS.pf??P)+(P-(camS.pf??P))*Math.min(1,dt/.5); camS.ps=(camS.ps??P)+(P-(camS.ps??P))*Math.min(1,dt/4);
  const now=performance.now()/1000; if(camS.pf>camS.ps*1.4&&camS.pf>1.3*ftp()&&now-(camS.kT||0)>3&&!race.paused){ camS.kT=now; camS.kv=14; klack(); }
  const w=6; camS.kv=(camS.kv||0)+(-w*w*(camS.kx||0)-2*w*(camS.kv||0))*dt; camS.kx=(camS.kx||0)+camS.kv*dt; } // gedämpfte Feder, schwingt in etwa 0,8 s zurück
