/* ================= Online (PeerJS, Raumcode) ================= */
const PREFIX='kalmit-duell-v3-';
function setConn(t){ $('connState').textContent=t; }
function send(o){ if(conn&&conn.open) conn.send(o); }
function sendRoute(){ if(race.role!=='host'||!conn||!conn.open) return; const d=R.def;
  const poly=[]; for(let i=0;i<R.xs.length;i+=5) poly.push([Math.round(R.xs[i]*10)/10,Math.round(R.ys[i]*10)/10]); poly.push([R.xs[R.xs.length-1],R.ys[R.ys.length-1]]);
  if(d.stadium){ send({t:'route',def:{stadium:true}}); return; }
  if(d.space||d.island){ send({t:'route',def:d}); return; } // Space: Strecke des Erstellers (seine FTP und sein Workout)
  send({t:'route',def:{name:d.name,start:d.start,finish:d.finish,startElev:d.startElev,plainElev:d.plainElev,kalmit:d.kalmit,poly,segs:d.segs}}); }
function guestUi(){ // Gast: Strecke, Verwandlungen und Fahrer legt der Ersteller fest
  document.querySelectorAll('.hostonly').forEach(t=>t.style.display=''); $('modeTag').style.display=''; $('btnBack').style.display='none';
  for(const id of ['formsOn','draftOn','lapMinus','lapPlus','botOn','botRider','botWkg','botKg','botStyle','botAgg','btnHost']) $(id).disabled=true; $('botOn').checked=false;
  $('modeScreen').style.display='none'; $('cfgScreen').style.display=''; renderRouteList();
}
function wire(c){
  conn=c;
  c.on('open',()=>{ $('botOn').checked=false; send({t:'hello',rider:myKey,look:LOOKS[myKey]}); opp.active=true; opp.bot=false; sendRoute(); sendCfg();
    setConn(race.role==='host'?'Verbunden ✓ – du startest das Rennen':'Verbunden ✓ – warte auf den Start'); });
  c.on('data',m=>{
    if(m.t==='hello' && race.role==='host'){ oppKey=m.rider; if(m.look&&JSON.stringify(remoteLooks[m.rider])!==JSON.stringify(m.look)){ remoteLooks[m.rider]=m.look; rebuildRiders(); } document.querySelectorAll('.rcard').forEach(cd=>cd.classList.toggle('taken',cd.dataset.k===oppKey)); opp.name=RIDERS[oppKey].name; setConn(`Verbunden mit ${opp.name} ✓ – du startest das Rennen`); sendCfg(); }
    if(m.t==='cfg' && race.role==='guest'){ if(m.tod) setTod(m.tod,false); if(m.rain!=null) setRain(m.rain,false); $('formsOn').checked=!!m.forms; race.forms=!!m.forms; formsLabel();
      $('draftOn').checked=!!m.draft; race.draft=!!m.draft; draftLabel(); race.laps=m.laps||5; if(m.wo){ WO=m.wo; } if(m.mode) openMode(m.mode); if(m.wo) renderWo();
      oppKey=m.rider; if(m.look&&JSON.stringify(remoteLooks[m.rider])!==JSON.stringify(m.look)){ remoteLooks[m.rider]=m.look; rebuildRiders(); }
      if(m.rider===myKey || !document.querySelector('.rcard.sel')) selectRider(RKEYS.find(k=>k!==m.rider));
      document.querySelectorAll('.rcard').forEach(cd=>cd.classList.toggle('taken',cd.dataset.k===m.rider));
      opp.name=RIDERS[m.rider].name; setConn(`Verbunden mit ${opp.name} ✓ – du fährst als ${RIDERS[myKey].name}, warte auf den Start`); }
    if(m.t==='route' && race.role==='guest'){ try{ if(m.def.stadium) m.def=stadionDef(); routeId='host'; const i=ROUTES.findIndex(r=>r.id==='host'); const e={id:'host',mode:race.mode,title:m.def.name,sub:'vom Ersteller gewählt',def:m.def};
      if(i>=0) ROUTES[i]=e; else ROUTES.push(e); setRoute(m.def); }catch(e){} }
    if(m.t==='start' && race.role==='guest'){ if(m.wo) WO=m.wo; if(m.tod) setTod(m.tod,false); if(m.rain!=null) setRain(m.rain,false); resetRiders(); race.forms=!!m.forms; race.draft=!!m.draft; Object.assign(opp,{active:true,bot:false,watt:null,d:0,target:0,v:0,done:false}); countdown(); }
    if(m.t==='pause') setPause(true,false);
    if(m.t==='resume') resumeRace(false);
    if(m.t==='quit'){ opp.active=false; flash(`${opp.name} hat beendet – du fährst allein weiter`); if(race.paused) $('pauseSub').textContent=`${opp.name} hat beendet. Mit „Weiter“ fährst du allein weiter.`; }
    if(m.t==='s'){ opp.target=m.d; opp.v=m.v; opp.wkg=m.w; opp.watt=m.p; opp.lastAt=performance.now();
      if(m.done && !opp.done && race.mode==='train'){ Object.assign(opp,{done:true,time:m.ft,avg:m.avg,avgW:m.avgW,zone:m.zone,dist:m.dist,ftpRes:m.ftpRes}); if(race.resultShown) showTrainResult(); return; }
      if(m.done && !opp.done){ opp.done=true; opp.time=m.ft; opp.vf=m.vf; opp.avg=m.avg; opp.d=m.d; pyroStart(); if(!me.done) flash(`${opp.name} ist ${R.loop?'im Ziel':'oben'} – ${fmtT(m.ft)}`); else if(!finishCheck()) showResult(); } }
  });
  c.on('close',()=>{ setConn('Verbindung getrennt.'); if(race.state!=='setup') flash('Verbindung zum Gegner getrennt'); });
}
function host(){
  if(!window.Peer){ setConn('Online-Modul nicht geladen – Internetverbindung prüfen.'); return; }
  const code=Array.from({length:4},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random()*24)]).join('');
  race.role='host'; peer=new Peer(PREFIX+code);
  peer.on('open',()=>{ $('connState').innerHTML=`Code für deinen Gegner: <span class="code">${code}</span><br>Warte auf Verbindung…`; });
  peer.on('connection',wire); peer.on('error',e=>setConn('Fehler: '+e.type+' – nochmal versuchen.'));
}
function join(){
  if(!window.Peer){ setConn('Online-Modul nicht geladen – Internetverbindung prüfen.'); return; }
  const code=$('joinCode').value.trim().toUpperCase(); if(code.length!==4){ $('joinState').textContent='Bitte den 4-stelligen Code eingeben.'; return; }
  race.role='guest'; guestUi(); $('btnStart').disabled=true; $('startHint').textContent='Dein Gegner startet das Rennen und legt Modus, Strecke und Regeln fest.';
  peer=new Peer(); peer.on('open',()=>{ setConn('Verbinde…'); wire(peer.connect(PREFIX+code,{reliable:true})); });
  peer.on('error',e=>setConn(e.type==='peer-unavailable'?'Code nicht gefunden – stimmt er?':'Fehler: '+e.type));
}
setInterval(()=>{ if(race.state==='run'&&(!me.done||me.free)) send({t:'s',d:me.d,v:me.v,w:curPower()/weight(),p:curPower(),done:false}); },200);

