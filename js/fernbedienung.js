/* ================= Handy als Fernbedienung (QR-Code, PeerJS) ================= */
// Eigener Peer neben dem Duell-Peer, bleibt über Rennen hinweg bestehen. Das Handy öffnet remote.html#CODE und schickt {t:'rc',a:'start'|'pause'|'resume'}.
const REMOTE_URL='https://philippsbecker96-cmyk.github.io/kalmitduell-/remote.html'; // file:// ist vom Handy nicht erreichbar, daher GitHub Pages
let rPeer=null, rCode=null, rConns=0;
function rState(t){ $('rcState').textContent=t; }
function remoteCmd(a){
  if(a==='start'){ if(race.state==='setup' && $('cfgScreen').style.display!=='none' && $('setup').style.display!=='none'){ $('remote').style.display='none'; startRace(); } return; }
  if(race.menuOnly||$('pauseAsk').style.display!=='none') return; // Menü nach Einheitsende oder Beenden-Frage: nicht vom Handy aus
  if(a==='pause' && race.state==='run' && !race.paused){ $('remote').style.display='none'; setPause(true); }
  if(a==='resume' && race.paused){ $('remote').style.display='none'; resumeRace(); }
}
function remoteOpen(){
  $('remote').style.display='flex';
  if(rPeer) return;
  if(!window.Peer){ rState('Online-Modul nicht geladen – Internetverbindung prüfen.'); return; }
  rCode=Array.from({length:5},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random()*24)]).join('');
  const base=location.protocol.startsWith('http')?new URL('remote.html',location.href).href:REMOTE_URL, url=base+'#'+rCode;
  $('rcQr').innerHTML=''; if(window.QRCode) new QRCode($('rcQr'),{text:url,width:220,height:220,correctLevel:QRCode.CorrectLevel.M}); else $('rcQr').textContent='QR-Modul nicht geladen';
  $('rcCode').textContent=rCode; $('rcUrl').textContent=url; rState('Verbinde mit dem Server…');
  rPeer=new Peer(PREFIX+'r-'+rCode);
  rPeer.on('open',()=>rState('Bereit – QR-Code mit dem Handy scannen.'));
  rPeer.on('connection',c=>{ c.on('open',()=>{ rConns++; rState('Handy verbunden ✓'); $('btnRemote').classList.add('on'); $('btnRemote2').classList.add('on'); });
    c.on('data',m=>{ if(m&&m.t==='rc') remoteCmd(m.a); });
    c.on('close',()=>{ rConns=Math.max(0,rConns-1); if(!rConns){ rState('Handy getrennt – zum Verbinden Seite auf dem Handy neu laden.'); $('btnRemote').classList.remove('on'); $('btnRemote2').classList.remove('on'); } }); });
  rPeer.on('error',e=>{ rState('Fehler: '+e.type+' – nochmal öffnen.'); try{ rPeer.destroy(); }catch(x){} rPeer=null; });
}
$('btnRemote').onclick=remoteOpen; $('btnRemote2').onclick=remoteOpen; $('rcClose').onclick=()=>$('remote').style.display='none';
