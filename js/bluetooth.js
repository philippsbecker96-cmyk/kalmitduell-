/* ================= Bluetooth ================= */
let trDev=null; // Trainer global halten (Wiederverbinden)
async function connectTrainer(){
  if(!navigator.bluetooth){ alert('Web Bluetooth ist hier nicht verfügbar. Bitte in Google Chrome öffnen.'); return; }
  try{
    const dev=await navigator.bluetooth.requestDevice({filters:[{services:[0x1826]},{services:[0x1818]},{services:[FEC_SVC]}],optionalServices:[0x1826,0x1818,FEC_SVC]}); trDev=dev;
    dev.addEventListener('gattserverdisconnected',()=>trainerGetrennt(dev));
    $('trainerState').textContent='Verbinde mit '+dev.name+'…';
    await trainerSetup(dev);
  }catch(e){ if(e.name!=='NotFoundError') $('trainerState').textContent='Verbindung fehlgeschlagen: '+e.message; }
}
async function trainerSetup(dev){
    const server=await dev.gatt.connect();
    try{
      const f=await server.getPrimaryService(0x1826), data=await f.getCharacteristic(0x2AD2);
      data.addEventListener('characteristicvaluechanged',e=>parseIndoorBike(e.target.value)); await data.startNotifications();
      try{ ftmsCtrl=await f.getCharacteristic(0x2AD9); await ftmsCtrl.startNotifications(); await ftmsCtrl.writeValueWithResponse(new Uint8Array([0x00])); await ftmsCtrl.writeValueWithResponse(new Uint8Array([0x07])); }catch(e){ ftmsCtrl=null; }
    }catch(e){
      const c=await (await server.getPrimaryService(0x1818)).getCharacteristic(0x2A63);
      c.addEventListener('characteristicvaluechanged',e=>parseCyclingPower(e.target.value)); await c.startNotifications();
    }
    // Tacx: ohne FTMS-Steuerung über FE-C (Tacx-eigene Schnittstelle über Bluetooth) steuern
    fecWr=null; if(!ftmsCtrl){ try{ fecWr=await (await server.getPrimaryService(FEC_SVC)).getCharacteristic(FEC_WR); }catch(e){ fecWr=null; } }
    live.src='ble'; lastSlopeSent=null; lastErgW=null; $('trainerState').textContent=`Verbunden: ${dev.name}`+(ftmsCtrl||fecWr?' · Steigung und ERG steuerbar':' · nur Leistung'); $('btnTrainer').textContent='Trainer verbunden ✓'; $('btnTrainer').classList.add('verb');
}
function trainerGetrennt(dev){
  live.src='sim'; ftmsCtrl=null; fecWr=null; if(race.state!=='setup') $('simBox').style.display='block'; $('btnTrainer').textContent='Trainer verbinden'; $('btnTrainer').classList.remove('verb');
  if(dev!==trDev||dev._wv) return; // anderes Gerät gewählt oder Wiederverbinden läuft schon
  $('trainerState').textContent='Trainer getrennt – verbinde neu …'; flash('Trainer getrennt – verbinde neu …');
  wiederVerbinden(dev,()=>trainerSetup(dev),()=>dev===trDev,()=>{ $('simBox').style.display='none'; flash('Trainer wieder verbunden'); },
    ()=>{ $('trainerState').textContent='Trainer getrennt – Simulation aktiv'; flash('Trainer nicht erreichbar – Simulation aktiv'); });
}
// Bekanntes Gerät ohne Klick neu verbinden: Versuche nach 1, 2, 4, 8 s, dann alle 15 s, insgesamt etwa eine Minute
async function wiederVerbinden(dev,setup,noch,ok,aufgeben){
  dev._wv=true;
  for(const s of [1,2,4,8,15,15,15]){ await new Promise(r=>setTimeout(r,s*1000)); if(!noch()){ dev._wv=false; return; }
    try{ await setup(); dev._wv=false; ok(); return; }catch(e){ try{ dev.gatt.disconnect(); }catch(e2){} } }
  dev._wv=false; aufgeben();
}
function parseIndoorBike(dv){
  const L=dv.byteLength; if(L<2) return; const f=dv.getUint16(0,true); let i=2;
  if(!(f&1)) i+=2; if(f&2) i+=2;
  if(f&4){ if(i+2<=L) live.cadence=dv.getUint16(i,true)/2; i+=2; }
  if(f&8) i+=2; if(f&16) i+=3; if(f&32) i+=2;
  if(f&64){ if(i+2<=L) live.power=Math.max(0,dv.getInt16(i,true)); i+=2; }
  if(f&128) i+=2; if(f&256) i+=5;
  // Puls vom Trainer nicht übernehmen: manche Trainer schicken einen festen Wert (z. B. 110) – Puls nur vom Pulsgurt
}
// Leistungsmesser (Cycling Power): Watt und – falls mitgeschickt – Kurbelumdrehungen, daraus die Trittfrequenz
const cpsCrank={n:null,t:0,at:0};
function parseCyclingPower(dv){ const L=dv.byteLength; if(L<4) return; const f=dv.getUint16(0,true); live.power=Math.max(0,dv.getInt16(2,true)); let i=4;
  if(f&1) i+=1; if(f&4) i+=2; if(f&16) i+=6;
  if((f&32)&&i+4<=L){ const n=dv.getUint16(i,true), t=dv.getUint16(i+2,true), c=cpsCrank, now=performance.now();
    if(c.n!=null&&n!==c.n){ const dt=((t-c.t+65536)%65536)/1024; if(dt>0) live.cadence=Math.min(200,Math.round(((n-c.n+65536)%65536)/dt*60)); c.at=now; }
    else if(now-c.at>2500) live.cadence=0; // keine neue Umdrehung: Kurbel steht
    if(c.n==null) c.at=now; c.n=n; c.t=t; } }
const FEC_SVC='6e40fec1-b5a3-f393-e0a9-e50e24dcca9e', FEC_WR='6e40fec3-b5a3-f393-e0a9-e50e24dcca9e';
// FE-C: ANT-Nachricht 0x4E auf Kanal 5 mit 8-Byte-Datenseite und XOR-Prüfsumme
function fecSend(page){ if(!fecWr) return; const m=[0xA4,9,0x4E,5,...page]; let c=0; m.forEach(b=>c^=b); m.push(c); const u=new Uint8Array(m);
  writeQ=writeQ.then(()=>fecWr.writeValueWithoutResponse?fecWr.writeValueWithoutResponse(u):fecWr.writeValue(u)).catch(()=>{}); }
function setSlope(gPct){
  if(fecWr){ const v=Math.round((gPct+200)*100); return fecSend([0x33,255,255,255,255,v&255,(v>>8)&255,0xFF]); }
  if(!ftmsCtrl) return;
  const b=new Uint8Array(7), v=new DataView(b.buffer); b[0]=0x11; v.setInt16(1,0,true); v.setInt16(3,Math.round(gPct*100),true); b[5]=Math.round(phys().crr*10000); b[6]=51;
  writeQ=writeQ.then(()=>ftmsCtrl.writeValueWithResponse(b)).catch(()=>{});
}
function setErg(w){ // Trainer hält die Watt
  w=Math.max(0,Math.round(w));
  if(fecWr){ const v=w*4; return fecSend([0x31,255,255,255,255,255,v&255,(v>>8)&255]); }
  if(!ftmsCtrl) return;
  writeQ=writeQ.then(()=>ftmsCtrl.writeValueWithResponse(new Uint8Array([0x05,w&255,(w>>8)&255]))).catch(()=>{});
}
let lastErgW=null, lastErgAt=0;
function trainerCtl(){
  if(race.mode==='train' && $('ergOn').checked && !(woSeg(race.t)||{}).free){ if(!(ftmsCtrl||fecWr)||me.done) return;
    const w=Math.round((me.tgt||0)/5)*5, now=performance.now();
    if(w>0 && w!==lastErgW && now-lastErgAt>900){ lastErgW=w; lastErgAt=now; setErg(w); } return; }
  trainerSlope();
}
function trainerSlope(){
  if(!(ftmsCtrl||fecWr)||!$('slopeOn').checked||(me.done&&!me.free)) return;
  const g=R.space?0:(gradeAt(me.d)+belagAt(me.d,weight())+(me.airS||0))*(+$('slopeK').value/100), now=performance.now(); // Space: Trainer flach
  if((lastSlopeSent===null||Math.abs(g-lastSlopeSent)>0.15)&&now-lastSlopeAt>1000){ lastSlopeSent=g; lastSlopeAt=now; setSlope(g); }
}
let hrDev=null; // Pulsgurt global halten, sonst kann Chrome das Gerät aufräumen und die Meldungen bleiben aus
async function connectHr(){
  if(!navigator.bluetooth){ alert('Bitte in Google Chrome öffnen.'); return; }
  try{ const dev=await navigator.bluetooth.requestDevice({filters:[{services:[0x180D]}]}); hrDev=dev;
    dev.addEventListener('gattserverdisconnected',()=>{ live.hr=null; live.hrStrap=false; $('btnHr').textContent='Pulsgurt verbinden'; $('btnHr').classList.remove('verb');
      if(dev!==hrDev||dev._wv) return; flash('Pulsgurt getrennt – verbinde neu …');
      wiederVerbinden(dev,()=>hrSetup(dev),()=>dev===hrDev,()=>flash('Pulsgurt wieder verbunden'),()=>flash('Pulsgurt nicht erreichbar')); });
    await hrSetup(dev);
  }catch(e){ if(e.name!=='NotFoundError') alert('Pulsgurt: '+e.message); }
}
async function hrSetup(dev){
  const c=await (await (await dev.gatt.connect()).getPrimaryService(0x180D)).getCharacteristic(0x2A37);
  c.addEventListener('characteristicvaluechanged',e=>{ const v=e.target.value, h=(v.getUint8(0)&1)?v.getUint16(1,true):v.getUint8(1); if(h>0){ live.hr=h; live.hrAt=performance.now(); } });
  await c.startNotifications(); live.hrStrap=true; $('btnHr').textContent='Pulsgurt verbunden ✓'; $('btnHr').classList.add('verb');
}
// Puls nur, wenn ein Gurt verbunden ist und in den letzten 5 s etwas geschickt hat
function hrNow(){ return live.hrStrap&&live.hr&&performance.now()-(live.hrAt||0)<5000?live.hr:null; }
// Pulszonen nach Coggan in % der Schwellenherzfrequenz (LTHR), Farben wie zoneCol bei den Watt; LTHR fehlt → 90 % vom Max-Puls
const PULS={an:false,max:0,lthr:0};
function pulsSave(){ PULS.an=$('hrZon').checked; PULS.max=+$('hrMax').value||0; PULS.lthr=+$('hrLthr').value||0; try{ localStorage.setItem('kd-puls',JSON.stringify(PULS)); }catch(e){} }
function pulsCol(hr){ const L=PULS.lthr||PULS.max*.9; if(!PULS.an||!L||!hr) return ''; const p=hr/L*100;
  return p<68?'#9aa5ad':p<84?'#4a90d9':p<95?'#4caf6e':p<106?'#e9c43a':p<111?'#ec8a3a':'#de4b3a'; }
