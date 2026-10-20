/* ================= Sound & UI ================= */
let actx=null;
function beep(f=880,d=.12){ try{ actx=actx||new AudioContext(); const o=actx.createOscillator(),g=actx.createGain(); o.frequency.value=f;
  g.gain.setValueAtTime(.15,actx.currentTime); g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+d); o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime+d);}catch(e){} }
// Geräuschschnipsel aus Rauschen: Kette klackt beim Antritt, Freilauf klickt beim Rollen
const noiseBuf=(dur,dec)=>{ const n=Math.floor(actx.sampleRate*dur), b=actx.createBuffer(1,n,actx.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/n*dec); return b; };
function snip(buf,f,q,vol,t0=0){ const s=actx.createBufferSource(); s.buffer=buf; const bp=actx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=q; const g=actx.createGain(); g.gain.value=vol; s.connect(bp).connect(g).connect(actx.destination); s.start(actx.currentTime+t0); }
let SNB=null; const snb=()=>SNB||(SNB={klack:noiseBuf(.05,6),tick:noiseBuf(.006,4)});
function klack(){ try{ actx=actx||new AudioContext(); const B=snb(); snip(B.klack,2600,3,.5); snip(B.klack,1900,3,.35,.07); }catch(e){} }
let fwPh=0; function freewheel(dt,on,v){ if(!on||!actx) return; fwPh+=dt*Math.min(55,v*4); if(fwPh<1) return; fwPh%=1; try{ snip(snb().tick,5200,2,.18); }catch(e){} }
$('btnTrainer').onclick=connectTrainer; $('btnHr').onclick=connectHr;
$('btnHost').onclick=host; $('btnJoin').onclick=join; $('btnStart').onclick=startRace;
try{ if(localStorage.getItem('kd-shake')==='0') $('shakeOn').checked=false; }catch(e){} $('shakeOn').onchange=()=>{ try{ localStorage.setItem('kd-shake',$('shakeOn').checked?'1':'0'); }catch(e){} };
$('slopeK').oninput=()=>$('slopeKv').textContent=$('slopeK').value+' %';
$('simP').oninput=()=>$('simPv').textContent=$('simP').value;
addEventListener('keydown',e=>{ if(live.src!=='sim'||race.state==='setup') return;
  if(e.key==='ArrowUp'||e.key==='ArrowDown'){ e.preventDefault(); const s=$('simP'); s.value=Math.max(0,Math.min(500,+s.value+(e.key==='ArrowUp'?10:-10))); $('simPv').textContent=s.value; } });

/* Standbild einer Szene (zum Testen und für Vorschaubilder) */
function mineLaneReset(){ for(const k in riders3d) if(riders3d[k]) riders3d[k].lane=null; }
window.__scene=o=>{ race.state='run'; race.frozen=true; race.forms=o.forms??race.forms; if(o.laps) race.laps=o.laps; if(o.draft!=null) race.draft=o.draft; me.lap=Math.floor((o.me||0)/R.len); me.draftR=o.draftR||0; enterRaceView(); $('simBox').style.display='none';
  me.d=o.me; me.v=o.v??3; me.time=o.t??0; $('simP').value=o.watt??250; Object.assign(opp,{active:o.opp!=null,bot:true,d:o.opp??0,v:o.v??3,wkg:o.oppWkg??3,watt:(o.oppWkg??3)*botKg(),name:RIDERS[oppKey].name,done:false});
  me.draftR=opp.active?draftOf(opp.d-me.d):0; mineLaneReset();
  camOverride=o.cam||null; camS.init=false;
  for(const id of ['hud','gapBox','powBox','ov']) $(id).style.visibility=o.hud===false?'hidden':'';
  const mr=riders3d[myKey], or=riders3d[oppKey]; mr.wS=(o.watt??250)/weight(); or.wS=opp.wkg; mr.form=nextForm('rider',mr.wS); or.form=nextForm('rider',or.wS); mr.pop=or.pop=1; if(o.pyro && anim.stadium){ anim.stadium.pyro.t0=performance.now()/1000-o.pyro; } };

$('botStyle').onchange=botStyleUi; botStyleUi();
lobbyBackdrop(); renderRiderCards(); selectRider('becker'); formsLabel(); draftLabel();
setRoute(ROUTES[0].def);
requestAnimationFrame(loop);
