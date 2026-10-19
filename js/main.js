/* ================= Sound & UI ================= */
let actx=null;
function beep(f=880,d=.12){ try{ actx=actx||new AudioContext(); const o=actx.createOscillator(),g=actx.createGain(); o.frequency.value=f;
  g.gain.setValueAtTime(.15,actx.currentTime); g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+d); o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime+d);}catch(e){} }
$('btnTrainer').onclick=connectTrainer; $('btnHr').onclick=connectHr;
$('btnHost').onclick=host; $('btnJoin').onclick=join; $('btnStart').onclick=startRace;
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
