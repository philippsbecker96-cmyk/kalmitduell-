/* ================= Bluetooth ================= */
async function connectTrainer(){
  if(!navigator.bluetooth){ alert('Web Bluetooth ist hier nicht verfügbar. Bitte in Google Chrome öffnen.'); return; }
  try{
    const dev=await navigator.bluetooth.requestDevice({filters:[{services:[0x1826]},{services:[0x1818]},{services:[FEC_SVC]}],optionalServices:[0x1826,0x1818,FEC_SVC]});
    dev.addEventListener('gattserverdisconnected',()=>{ live.src='sim'; ftmsCtrl=null; fecWr=null; $('trainerState').textContent='Trainer getrennt – Simulation aktiv'; if(race.state!=='setup') $('simBox').style.display='block'; flash('Trainer getrennt'); });
    $('trainerState').textContent='Verbinde mit '+dev.name+'…';
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
    live.src='ble'; lastSlopeSent=null; lastErgW=null; $('trainerState').textContent=`Verbunden: ${dev.name}`+(ftmsCtrl||fecWr?' · Steigung und ERG steuerbar':' · nur Leistung');
  }catch(e){ if(e.name!=='NotFoundError') $('trainerState').textContent='Verbindung fehlgeschlagen: '+e.message; }
}
function parseIndoorBike(dv){
  const L=dv.byteLength; if(L<2) return; const f=dv.getUint16(0,true); let i=2;
  if(!(f&1)) i+=2; if(f&2) i+=2;
  if(f&4){ if(i+2<=L) live.cadence=dv.getUint16(i,true)/2; i+=2; }
  if(f&8) i+=2; if(f&16) i+=3; if(f&32) i+=2;
  if(f&64){ if(i+2<=L) live.power=Math.max(0,dv.getInt16(i,true)); i+=2; }
  if(f&128) i+=2; if(f&256) i+=5;
  if(f&512){ if(i+1<=L && !live.hrStrap){ const h=dv.getUint8(i); if(h>0) live.hr=h; } }
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
  const g=(gradeAt(me.d)+belagAt(me.d,weight()))*(+$('slopeK').value/100), now=performance.now();
  if((lastSlopeSent===null||Math.abs(g-lastSlopeSent)>0.15)&&now-lastSlopeAt>1000){ lastSlopeSent=g; lastSlopeAt=now; setSlope(g); }
}
async function connectHr(){
  if(!navigator.bluetooth){ alert('Bitte in Google Chrome öffnen.'); return; }
  try{ const dev=await navigator.bluetooth.requestDevice({filters:[{services:[0x180D]}]});
    const c=await (await (await dev.gatt.connect()).getPrimaryService(0x180D)).getCharacteristic(0x2A37);
    c.addEventListener('characteristicvaluechanged',e=>{ const v=e.target.value; live.hr=(v.getUint8(0)&1)?v.getUint16(1,true):v.getUint8(1); });
    await c.startNotifications(); live.hrStrap=true; $('btnHr').textContent='Pulsgurt ✓';
  }catch(e){ if(e.name!=='NotFoundError') alert('Pulsgurt: '+e.message); }
}

