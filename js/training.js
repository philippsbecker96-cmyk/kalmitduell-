/* ================= Training: Workout ================= */
// Ein Workout: Abschnitte {k:'s', label, dur (s), a, b (Rampe bis, optional)} und Wiederholungsblöcke {k:'r', n, items:[Abschnitte]}
const S_=(label,min,a,b=null)=>({k:'s',label,dur:Math.round(min*60),a,b});
const WO_PRESETS={
  std:{name:'Einfahren + 4 × 2 min',items:[S_('Einfahren',5,50,70),{k:'r',n:4,items:[S_('Intervall',2,110),S_('Pause',2,55)]},S_('Ausfahren',5,50)]},
  ss:{name:'Sweet Spot 3 × 10 min',items:[S_('Einfahren',10,50,75),{k:'r',n:3,items:[S_('Sweet Spot',10,90),S_('Pause',5,55)]},S_('Ausfahren',10,50)]},
  vo2:{name:'VO2max 5 × 3 min',items:[S_('Einfahren',12,50,75),{k:'r',n:5,items:[S_('VO2max',3,115),S_('Pause',3,50)]},S_('Ausfahren',10,50)]},
  ga:{name:'Grundlage 60 min',items:[S_('Einfahren',5,50,65),S_('Grundlage',50,65),S_('Ausfahren',5,50)]},
  leer:{name:'Leer',items:[]}};
const clone=o=>JSON.parse(JSON.stringify(o));
function loadWo(){ let w={unit:'pct',...clone(WO_PRESETS.std)}; try{ const sv=JSON.parse(localStorage.getItem('kd-wo')); if(sv&&Array.isArray(sv.items)) w=sv; }catch(e){} return w; }
let WO=loadWo();
const ftp=()=>Math.max(60,+$('ftp').value||250);
const saveWo=()=>{ try{ if(race.role!=='guest') localStorage.setItem('kd-wo',JSON.stringify(WO)); localStorage.setItem('kd-ftp',$('ftp').value); }catch(e){} }; // als Gast bleibt das eigene Workout gespeichert
function woFlat(wo){ const out=[]; let t=0;
  const add=(s,suf='')=>{ const dur=Math.max(5,Math.round(+s.dur||0)); out.push({label:(s.label||'Abschnitt')+suf, dur, a:+s.a||0, b:(s.b===''||s.b==null||isNaN(+s.b))?null:+s.b, t0:t}); t+=dur; };
  (wo.items||[]).forEach(it=>{ if(it.k==='r'){ const n=Math.max(1,Math.min(50,it.n|0)); for(let k=0;k<n;k++) (it.items||[]).forEach(s=>add(s,` ${k+1}/${n}`)); } else add(it); });
  return out; }
// FTP-Tests (in Watt, aus der eigenen FTP berechnet)
const r10=v=>Math.round(v/10)*10;
function rampSegs(f){ const st=180, out=[{label:'Einfahren',dur:300,a:150,b:170,t0:0}]; let t=300; // feste Rampe: Einfahren 150 → 170 W, Stufen ab 180 W
  for(let k=0, w=st; w<=Math.max(700,f*2.2); k++, w+=20){ out.push({label:`Stufe ${k+1}`,dur:60,a:w,b:null,t0:t,step:true}); t+=60; } return out; }
function t20Segs(f){ const L=[['Einfahren',600,f*.5,f*.7],['Locker',300,f*.55,null],['20-min-Test',1200,0,null,true],['Ausfahren',600,f*.5,null]]; let t=0;
  return L.map(([label,dur,a,b,free])=>{ const o={label,dur,a:Math.round(a),b:b==null?null:Math.round(b),t0:t,free:!!free}; t+=dur; return o; }); }
const woKind=()=>race.kamp?'wo':WO.kind||'wo'; // Kampagne: immer Workout (kampagne.js)
function curSegs(){ if(race.kamp) return kampSegs(race.kamp); const k=woKind(); return k==='ramp'?rampSegs(ftp()):k==='t20'?t20Segs(ftp()):woFlat(WO); }
const curUnit=()=>race.kamp?'pct':woKind()==='wo'?WO.unit:'w';
const woTotal=()=>curSegs().reduce((a,s)=>a+s.dur,0);
const TEST_INFO={ramp:'<b>Rampentest</b> · 5 min Einfahren, danach erhöht der Trainer (ERG) jede Minute um 20 W – so lange, bis du die Watt nicht mehr halten kannst. Der Test endet von selbst, wenn du 8 Sekunden lang unter 80 % der Stufe fällst, oder mit „Test beenden“. <b>FTP = 75 % deiner besten Minute.</b>',
  t20:'<b>20-Minuten-Test</b> · 10 min Einfahren und 5 min locker mit ERG, dann <b>20 min Vollgas ohne ERG</b> – du schaltest selbst, den Widerstand bestimmt die Strecke. Danach 10 min Ausfahren. <b>FTP = 95 % deines 20-min-Schnitts.</b>'};
const toW=(v,unit=WO.unit)=>unit==='w'?v:v*ftp()/100, toPct=(v,unit=WO.unit)=>unit==='w'?v/ftp()*100:v;
const segVal=(sg,t)=>sg.b==null?sg.a:sg.a+(sg.b-sg.a)*Math.max(0,Math.min(1,(t-sg.t0)/sg.dur));
const woK=()=>race.mode==='train'&&race.woKind==='wo'?(race.intens||1):1; // Intensität aus dem Menü
function woSeg(t){ const S=race.woSegs||[]; for(let i=S.length-1;i>=0;i--) if(t>=S[i].t0) return S[i]; return S[0]; }
function zoneCol(p){ return p<60?'#9aa5ad':p<76?'#4a90d9':p<90?'#4caf6e':p<105?'#e9c43a':p<119?'#ec8a3a':'#de4b3a'; }
function drawWo(g,x,y,w,h,S,T,o={}){
  if(!S.length){ g.fillStyle='#c9d6cc'; g.font='600 14px Barlow, sans-serif'; g.textAlign='left'; g.fillText('Noch kein Abschnitt – unten „+ Abschnitt“ wählen',x+10,y+h/2+5); return; }
  const unit=o.unit||race.woUnit||WO.unit, kk=o.k||1, pc=v=>toPct(v,unit)*kk, top=Math.max(130,...S.map(s=>Math.max(pc(s.a),s.b==null?0:pc(s.b))))*1.06, Y=p=>y+h-Math.min(1,p/top)*h, X=t=>x+t/T*w;
  S.forEach(sg=>{ const pa=pc(sg.a), pb=pc(sg.b==null?sg.a:sg.b), x0=X(sg.t0), x1=X(sg.t0+sg.dur);
    if(sg.free){ g.save(); g.beginPath(); g.rect(x0,Y(105),x1-x0-.6,y+h-Y(105)); g.clip(); g.fillStyle='#b9475f'; g.fillRect(x0,y,x1-x0,h); g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=3;
      for(let q=x0-h;q<x1;q+=10){ g.beginPath(); g.moveTo(q,y+h); g.lineTo(q+h,y); g.stroke(); } g.restore();
      if(x1-x0>60){ const fs=Math.max(13,Math.round(h*.2)); g.fillStyle='#fff'; g.font=`700 ${fs}px Barlow, sans-serif`; g.textAlign='center'; g.fillText('Vollgas · frei',(x0+x1)/2,Y(105)+fs+4); } return; }
    if(pa===pb){ g.fillStyle=zoneCol(pa); g.fillRect(x0,Y(pa),Math.max(1,x1-x0-.6),y+h-Y(pa)); }
    else { const n=Math.max(1,Math.round((x1-x0)/3)); for(let i=0;i<n;i++){ const p0=pa+(pb-pa)*i/n, p1=pa+(pb-pa)*(i+1)/n, xa=x0+(x1-x0)*i/n, xb=x0+(x1-x0)*(i+1)/n; g.fillStyle=zoneCol((p0+p1)/2); g.beginPath(); g.moveTo(xa,y+h); g.lineTo(xa,Y(p0)); g.lineTo(xb,Y(p1)); g.lineTo(xb+.4,y+h); g.fill(); } } });
  g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=1; g.setLineDash([4,4]); g.beginPath(); g.moveTo(x,Y(100)); g.lineTo(x+w,Y(100)); g.stroke(); g.setLineDash([]);
  if(o.cur!=null){ const xc=X(Math.min(T,o.cur)); g.fillStyle='rgba(10,20,15,.45)'; g.fillRect(x,y,xc-x,h);
    if(o.trace&&o.trace.length>1){ g.strokeStyle='#ffffff'; g.lineWidth=2; g.beginPath(); o.trace.forEach(([t,p],i)=>{ const px=X(t), py=Y(p/ftp()*100); i?g.lineTo(px,py):g.moveTo(px,py); }); g.stroke(); }
    g.fillStyle='#fff'; g.fillRect(xc-1.5,y-4,3,h+8); }
}
function fmtDur(s){ s=Math.round(s); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
function parseDur(v){ v=String(v).trim().replace(',','.'); if(!v) return 0; if(v.includes(':')){ const [m,x]=v.split(':'); return (+m||0)*60+(+x||0); } return Math.round((+v||0)*60); }
function woRowHtml(s,path,ro){ const dis=ro?'disabled':''; const wa=Math.round(toW(+s.a||0)), wb=s.b==null||s.b===''?null:Math.round(toW(+s.b));
  return `<div class="worow" data-p="${path}"><input type="text" data-f="label" value="${esc(s.label||'')}" ${dis}><input type="text" data-f="dur" value="${fmtDur(s.dur||0)}" ${dis} title="Minuten:Sekunden"><input type="number" data-f="a" value="${s.a??''}" ${dis}><input type="number" data-f="b" value="${s.b??''}" placeholder="–" ${dis}>
    <span class="eq num">${wb==null?wa:wa+'→'+wb}</span><span class="bt">${ro?'':`<button data-act="up" title="nach oben">↑</button><button data-act="down" title="nach unten">↓</button><button data-act="del" title="löschen">✕</button>`}</span></div>`; }
function renderWo(){
  const ro=race.role==='guest', L=$('woList'), k=woKind();
  $('woKind').value=k; $('woKind').disabled=ro; document.querySelectorAll('#woBlock .woEd').forEach(e=>e.style.display=k==='wo'&&!race.kamp?'':'none'); $('woKind').parentNode.style.display=race.kamp?'none':''; // Kampagne: Workout fest, nur FTP
  $('woTestInfo').style.display=k==='wo'?'none':''; $('woTestInfo').innerHTML=TEST_INFO[k]||'';
  $('woHa').textContent=WO.unit==='w'?'Watt':'% FTP'; $('woUnit').value=WO.unit; $('woUnit').disabled=ro; $('woPreset').disabled=ro; $('woAddStep').style.display=$('woAddRep').style.display=$('woZwo').style.display=ro||race.kamp?'none':''; $('woEigenDel').style.display=!ro&&!race.kamp&&k==='wo'&&WO_EIGEN.some(w=>w.name===WO.name)?'':'none';
  L.innerHTML=WO.items.map((it,i)=> it.k==='r'
    ? `<div class="rep" data-p="${i}"><div class="rephead">🔁 Wiederholen <input type="number" min="1" max="50" data-f="n" value="${it.n}" ${ro?'disabled':''}> × <span class="sp"></span>${ro?'':`<button data-act="add" title="Abschnitt in den Block">+</button><button data-act="up">↑</button><button data-act="down">↓</button><button data-act="del">✕</button>`}</div>${(it.items||[]).map((s,j)=>woRowHtml(s,i+'.'+j,ro)).join('')}</div>`
    : woRowHtml(it,String(i),ro)).join('');
  woRefresh();
}
function woRefresh(){ const S=curSegs(), T=S.reduce((a,s)=>a+s.dur,0), cv=$('woChart'), g=cv.getContext('2d'), k=woKind(); g.clearRect(0,0,cv.width,cv.height);
  drawWo(g,8,10,cv.width-16,cv.height-14,S,Math.max(T,1),{unit:curUnit()});
  const avg=T?S.reduce((a,s)=>a+s.dur*toW(s.b==null?s.a:(s.a+s.b)/2,curUnit()),0)/T:0;
  $('woSum').textContent= k==='ramp' ? `Stufen ab ${S[1]?S[1].a:0} W, +20 W pro Minute · Dauer je nach Stärke ca. ${fmtT(300+Math.max(0,(ftp()*1.3-(S[1]?S[1].a:0))/20+1)*60)} · bisherige FTP ${ftp()} W`
    : k==='t20' ? `Dauer ${fmtT(T)} · Testabschnitt 20:00 · bisherige FTP ${ftp()} W`
    : T?`Dauer ${fmtT(T)} · ${S.length} Abschnitte · Ø ca. ${Math.round(avg)} W · FTP ${ftp()} W`:'Noch leer';
  saveWo(); if(race.mode==='train') renderRouteList(); }
function woGet(path){ const [i,j]=path.split('.').map(Number); return j==null?{arr:WO.items,i,o:WO.items[i]}:{arr:WO.items[i].items,i:j,o:WO.items[i].items[j]}; }
$('woList').addEventListener('change',e=>{ const f=e.target.dataset.f, el=e.target.closest('[data-p]'); if(!f||!el) return; const {o}=woGet(el.dataset.p);
  if(f==='label') o.label=e.target.value; else if(f==='dur') o.dur=parseDur(e.target.value); else if(f==='n') o.n=Math.max(1,Math.min(50,+e.target.value||1));
  else if(f==='a') o.a=+e.target.value||0; else if(f==='b') o.b=e.target.value===''?null:+e.target.value;
  renderWo(); sendCfg(); });
$('woList').addEventListener('click',e=>{ const b=e.target.closest('button[data-act]'); if(!b) return; const el=b.closest('[data-p]'), {arr,i,o}=woGet(el.dataset.p), a=b.dataset.act;
  if(a==='del') arr.splice(i,1); else if(a==='up'&&i>0) [arr[i-1],arr[i]]=[arr[i],arr[i-1]]; else if(a==='down'&&i<arr.length-1) [arr[i+1],arr[i]]=[arr[i],arr[i+1]];
  else if(a==='add') o.items.push(S_('Intervall',1,100));
  renderWo(); sendCfg(); });
$('woAddStep').onclick=()=>{ WO.items.push(S_('Abschnitt',5,WO.unit==='w'?Math.round(ftp()*.6):60)); renderWo(); sendCfg(); };
$('woAddRep').onclick=()=>{ const u=WO.unit==='w'; WO.items.push({k:'r',n:3,items:[S_('Intervall',2,u?Math.round(ftp()*1.05):105),S_('Pause',2,u?Math.round(ftp()*.55):55)]}); renderWo(); sendCfg(); };
$('woUnit').onchange=()=>{ const to=$('woUnit').value; if(to===WO.unit) return; const f=ftp(), cv=v=>v==null?null:to==='w'?Math.round(v*f/100):Math.round(v/f*100);
  const conv=s=>{ s.a=cv(+s.a); s.b=cv(s.b); }; WO.items.forEach(it=>it.k==='r'?it.items.forEach(conv):conv(it)); WO.unit=to; renderWo(); sendCfg(); };
// hochgeladene Workouts bleiben als eigene Vorlagen (kd-wo-eigen)
let WO_EIGEN=[]; try{ const v=JSON.parse(localStorage.getItem('kd-wo-eigen')); if(Array.isArray(v)) WO_EIGEN=v; }catch(e){}
const saveEigen=()=>{ try{ localStorage.setItem('kd-wo-eigen',JSON.stringify(WO_EIGEN)); }catch(e){} };
// Workouts aus dem Ordner workouts/ (für alle, über workouts/workouts.js), Unterordner = Kategorie
const WO_ORDNER=(typeof WO_DATEIEN!=='undefined'?WO_DATEIEN:[]).map(d=>{ try{ return {...parseZwo(d.xml),kat:d.kat||''}; }catch(e){ console.warn('workouts/'+d.datei+': '+e.message); return null; } }).filter(Boolean);
function fillPresets(){ const sel=$('woPreset'); sel.innerHTML='<option value="">– laden –</option>';
  const grp=(t,L)=>{ const g=document.createElement('optgroup'); g.label=t; L.forEach(([k,n])=>{ const o=document.createElement('option'); o.value=k; o.textContent=n; g.appendChild(o); }); sel.appendChild(g); };
  grp('Vorlagen',Object.entries(WO_PRESETS).map(([k,p])=>[k,p.name])); [...new Set(WO_ORDNER.map(w=>w.kat))].sort((a,b)=>!a-!b||a.localeCompare(b,'de')).forEach(kt=>grp(kt||'Workouts-Ordner',WO_ORDNER.map((w,i)=>[w,i]).filter(([w])=>w.kat===kt).map(([w,i])=>['d'+i,w.name]))); if(WO_EIGEN.length) grp('Hochgeladen',WO_EIGEN.map((w,i)=>['e'+i,w.name])); }
fillPresets();
$('woPreset').onchange=()=>{ const k=$('woPreset').value; if(!k) return; WO=k[0]==='e'?clone(WO_EIGEN[+k.slice(1)]):k[0]==='d'?(({kat,...w})=>clone(w))(WO_ORDNER[+k.slice(1)]):{unit:'pct',...clone(WO_PRESETS[k])}; $('woPreset').value=''; renderWo(); sendCfg(); };
$('woEigenDel').onclick=()=>{ const i=WO_EIGEN.findIndex(w=>w.name===WO.name); if(i<0||!confirm('„'+WO.name+'“ aus den hochgeladenen Vorlagen löschen?')) return; WO_EIGEN.splice(i,1); saveEigen(); fillPresets(); renderWo(); };
// .zwo-Datei (Zwift-Workout, XML): Leistung als Anteil der FTP → % FTP
function parseZwo(txt){ const x=new DOMParser().parseFromString(txt,'application/xml'), wk=x.querySelector('workout'); if(!wk||x.querySelector('parsererror')) throw new Error('keine gültige .zwo-Datei');
  const nm=(x.querySelector('name')||{}).textContent, num=(e,...k)=>{ for(const n of k){ const v=e.getAttribute(n); if(v!=null&&v!==''&&!isNaN(+v)) return +v; } return null; }, P=v=>v==null?null:Math.round(v*100);
  const st=(label,dur,a,b=null)=>({k:'s',label,dur:Math.max(5,Math.round(dur||0)),a:P(a)??60,b:P(b)}), items=[];
  for(const e of wk.children){ const t=e.tagName.toLowerCase(), d=num(e,'Duration');
    if(t==='steadystate'||t==='solidstate') items.push(st('Konstant',d,num(e,'Power','PowerLow')));
    else if(t==='warmup'||t==='cooldown'||t==='ramp'){ const a=num(e,'PowerLow','Power'), b=num(e,'PowerHigh'); items.push(st(t==='warmup'?'Einfahren':t==='cooldown'?'Ausfahren':'Rampe',d,a,b!=null&&P(b)!==P(a)?b:null)); }
    else if(t==='intervalst'){ const on=num(e,'OnPower','PowerOnLow'), onB=num(e,'PowerOnHigh'), off=num(e,'OffPower','PowerOffLow'), offB=num(e,'PowerOffHigh');
      items.push({k:'r',n:Math.max(1,Math.min(50,num(e,'Repeat')||1)),items:[st('Intervall',num(e,'OnDuration'),on,onB!=null&&P(onB)!==P(on)?onB:null),st('Pause',num(e,'OffDuration'),off,offB!=null&&P(offB)!==P(off)?offB:null)]}); }
    else if(t==='freeride') items.push(st('Freie Fahrt',d,.6));
    else if(t==='maxeffort') items.push(st('Vollgas',d,1.5)); }
  if(!items.length) throw new Error('keine Abschnitte gefunden');
  return {unit:'pct',kind:'wo',name:nm||'Workout',items}; }
$('woZwo').onclick=()=>$('woZwoFile').click();
$('woZwoFile').onchange=()=>{ const f=$('woZwoFile').files[0]; if(!f) return; const rd=new FileReader();
  rd.onload=()=>{ try{ WO=parseZwo(rd.result); const i=WO_EIGEN.findIndex(w=>w.name===WO.name); if(i>=0) WO_EIGEN[i]=clone(WO); else WO_EIGEN.push(clone(WO)); saveEigen(); fillPresets(); renderWo(); sendCfg(); } catch(e){ alert('Konnte '+f.name+' nicht laden: '+e.message); } $('woZwoFile').value=''; }; rd.readAsText(f); };
try{ const f=localStorage.getItem('kd-ftp'); if(f) $('ftp').value=f; }catch(e){}
$('ftp').addEventListener('change',()=>renderWo());
$('weight').addEventListener('change',()=>{ setTimeout(()=>{ if(race.mode==='train' && race.state==='setup' && $('cfgScreen').style.display!=='none') renderRouteList(); },300); }); // verzögert, damit ein Klick direkt danach nicht verloren geht
$('woKind').onchange=()=>{ WO.kind=$('woKind').value; renderWo(); sendCfg(); };
$('wnStop').onclick=()=>{ if(race.mode==='train' && !me.done && race.state==='run') trainFinish(); };

function prepTrain(){ race.woNextKey=null; race.woSegs=curSegs(); race.woT=race.woSegs.reduce((a,s)=>a+s.dur,0); race.woUnit=curUnit(); race.woKind=woKind(); race.ftp0=ftp();
  Object.assign(me,{bins:{},lowT:0,testE:0,testT:0,ftpRes:null}); $('wnStop').style.display='none'; }
// beste 60 s aus 1-Sekunden-Fächern
function best60(bins){ const ks=Object.keys(bins).map(Number).sort((a,b)=>a-b); let best=0;
  for(const k0 of ks){ let e=0,t=0; for(let k=k0;k<k0+60;k++){ const b=bins[k]; if(b){ e+=b[0]; t+=b[1]; } } if(t>=55) best=Math.max(best,e/t); } return best; }
/* Space/Insel: Die Strecke ist für die Ziel-Watt berechnet (ein Streckenstück je 2 s Workout). Weicht die echte Leistung ab, summiert sich das auf.
   Deshalb wird die Position um höchstens ±10 % nachgeführt, sodass man zum Ende jedes Abschnitts am Farbwechsel ankommt. km/h und „gefahren“ bleiben echt. */
function planD(t){ const S=R.segs, n=R.planN||(R.planN=S.filter(x=>x.p>=0).length), x=Math.max(0,t/2), i=Math.min(n-1,Math.floor(x)), sg=S[i]; return sg.d0+sg.len*Math.min(1,x-i); }
function planNudge(dt,sg){ const end=sg.t0+sg.dur, ahead=planD(end)-planD(race.t), err=planD(race.t)-me.d; // err > 0: hinter dem Plan
  const f=clampN(1+err/Math.max(30,ahead),0.9,1.1); me.corr=(me.corr??1)+(f-(me.corr??1))*Math.min(1,dt*2); me.d+=(me.corr-1)*me.v*dt; }
function trainStep(dt,P,wkg){
  if(me.done){ if(me.free){ const d0=me.d; step(me,P,weight(),dt,me.draftR); me.dist+=R.space?me.vb*dt:me.d-d0; if(me.d>=R.len) me.d-=R.ring; } return; } // Space/Insel: nach dem Workout frei weiterfahren
  const sg=woSeg(race.t); me.tgt=sg.free?0:toW(segVal(sg,race.t),race.woUnit)*woK();
  const d0=me.d, halt=R.def.halte&&R.def.halte.find(h=>race.t>=h[0]&&race.t<h[1]); // Kampagne: Halt (z. B. Wirtshaus-Szene) – man tritt weiter, steht aber
  if(halt){ me.v=0; me.d=halt[2]*R.kf; } else { step(me,P,weight(),dt,me.draftR); me.dist+=R.space?me.vb*dt:me.d-d0; } // Space: „gefahren“ ohne Schub
  if((R.ring||R.def.planbar) && $('ergOn').checked && !sg.free && !halt) planNudge(dt,sg); // Space/Insel/Trifels mit ERG: Position leicht nachführen, damit Intervallende und Farbwechsel zusammenfallen
  if(R.ring){ const Lw=R.goal; if(d0<Lw && me.d>=Lw && !me.done) flash(R.island?'Strandbar erreicht – weiter rund ums Atoll':'Raumstation erreicht – weiter in der Umlaufbahn'); if(me.d>=R.len) me.d-=R.ring; }
  else if(!R.loop && me.d>=R.len){ me.d-=R.len; camS.init=false; me.lap=(me.lap||0)+1; flash(`Zurück zum Start – Runde ${me.lap+1}`); }
  me.time=race.t; me.wkgSum+=wkg*dt; me.wSum+=P*dt; me.maxWkg=Math.max(me.maxWkg,wkg);
  if(sg.step){ const k=Math.floor(race.t), b=me.bins[k]||(me.bins[k]=[0,0]); b[0]+=P*dt; b[1]+=dt;
    if(race.t-sg.t0>3 && P<me.tgt*0.8) me.lowT+=dt; else me.lowT=0; $('wnStop').style.display='';
    if(me.lowT>=8){ flash('Stufe nicht mehr gehalten – Test beendet'); trainFinish(); return; } }
  if(sg.free){ me.testE+=P*dt; me.testT+=dt; }
  if(race.t-sg.t0>5 && !sg.free){ me.zoneT+=dt; if(Math.abs(P-me.tgt)<=me.tgt*0.05) me.inZone+=dt; } // ±5 % um das Ziel, erste 5 s eines Abschnitts zählen nicht
  if(!me.trace.length || race.t-me.trace[me.trace.length-1][0]>=1) me.trace.push([race.t,P]);
  const idx=race.woSegs.indexOf(sg); if(idx!==race.woIdx){ if(race.woIdx>=0){ beep(1046,.25); flash(sg.free?'Vollgas – 20 Minuten, ERG aus':sg.label); if(anim.space) Object.assign(anim.space.wave,{t0:performance.now()/1000,d0:me.d-4}); } race.woIdx=idx; lastErgW=null; lastSlopeSent=null; }
  const rem=Math.ceil(sg.t0+sg.dur-race.t); if(idx<race.woSegs.length-1 && rem<=3 && rem>=1 && rem!==race.woCd){ race.woCd=rem; beep(660); }
  if(race.t>=race.woT) trainFinish();
}
// Liste der nächsten 8 Abschnitte unter der Workout-Anzeige (wird nur bei Abschnittswechsel neu gebaut)
function woNext(i){ const key=i+'|'+woK()+'|'+me.done; if(race.woNextKey===key) return; race.woNextKey=key;
  const S=race.woSegs, L=me.done||race.woKind==='ramp'?[]:S.slice(i+1,i+9), u=race.woUnit, k=woK(), rest=S.length-i-9;
  $('wnList').innerHTML=L.length?`<div class="h">Als Nächstes</div>`+L.map(sg=>{ const pa=toPct(sg.a,u)*k, pb=sg.b==null?pa:toPct(sg.b,u)*k, wa=Math.round(toW(sg.a,u)*k), wb=sg.b==null?null:Math.round(toW(sg.b,u)*k);
    return `<div class="nr"><i style="background:${sg.free?'#b9475f':zoneCol((pa+pb)/2)}"></i><span class="l">${esc(sg.label)}</span><span class="d num">${fmtDur(sg.dur)}</span><span class="w num">${sg.free?'frei':wb==null?wa+' W':wa+'→'+wb+' W'}</span></div>`; }).join('')
    +(rest>0?`<div class="more">+ ${rest} weitere</div>`:''):''; }
function woPanel(P,sg){ if(!sg) return; const S=race.woSegs, i=S.indexOf(sg), nx=S[i+1], rem=sg.t0+sg.dur-race.t, tgt=me.tgt||0, pct=toPct(segVal(sg,race.t),race.woUnit)*woK();
  if(sg.free && !me.done){ const av=me.testT?me.testE/me.testT:0; $('wnLab').textContent='20-min-Test · Vollgas · Ø bisher'; $('wnW').textContent=Math.round(av); $('woNow').style.borderColor='#b9475f';
    $('wnMe').textContent=`Du: ${Math.round(P)} W`; $('wnMe').style.color=''; $('wnCd').textContent=fmtDur(Math.max(0,rem)); $('wnNx').textContent=`Hochgerechnete FTP: ${Math.round(av*.95)} W`; $('simPv').textContent=$('simP').value; woNext(i); return; }
  $('wnLab').textContent=sg.label; $('wnW').textContent=Math.round(tgt); $('woNow').style.borderColor=zoneCol(pct);
  const ok=Math.abs(P-tgt)<=tgt*0.05; $('wnMe').textContent=`Du: ${Math.round(P)} W`; $('wnMe').style.color=me.done?'':ok?'#9cc46b':'#f0b860';
  $('wnCd').textContent=fmtDur(Math.max(0,rem));
  if(sg.step && !me.done){ $('wnNx').textContent=`Gleich: ${nx?nx.a:''} W · beste Minute bisher ${Math.round(best60(me.bins))} W`; }
  else $('wnNx').textContent=me.done?(race.woKind==='wo'?'Workout geschafft':'Test beendet'):nx?`noch ${fmtT(race.woT-race.t)} gesamt`:`Letzter Abschnitt · danach geschafft`;
  woNext(i);
  if(simErg()){ $('simP').value=Math.round(tgt); $('simPv').textContent=Math.round(tgt)+' (ERG)'; } }
function trainFinish(){
  const T=race.woKind==='ramp'?Math.max(1,race.t):race.woT; race.woT=T; me.done=true; if(race.kamp) kampFertig(); me.free=!!R.ring; me.time=T; pyroStart(); $('wnStop').style.display='none';
  if(race.woKind==='ramp'){ const b=best60(me.bins); me.ftpRes=b?Math.round(b*.75):null; }
  if(race.woKind==='t20'){ me.ftpRes=me.testT>=60?Math.round(me.testE/me.testT*.95):null; }
  send({t:'s',d:me.d,v:0,w:0,done:true,ft:T,ftpRes:me.ftpRes,avg:me.wkgSum/Math.max(1,T),avgW:me.wSum/Math.max(1,T),zone:me.zoneT?me.inZone/me.zoneT:0,dist:me.dist});
  beep(523,.15); setTimeout(()=>beep(659,.15),160); setTimeout(()=>beep(784,.4),320);
  $('banner').textContent=race.woKind==='wo'?'GESCHAFFT!':'TEST ENDE'; setTimeout(()=>$('banner').textContent='',2500); setSlope(0); setTimeout(showTrainResult,R.stadium?6000:R.space?4500:1500);
}
function showTrainResult(){
  if(race.state==='setup') return;
  race.resultShown=true; const T=race.woT, myName=RIDERS[myKey].name, test=race.woKind!=='wo', fr=x=>x.ftpRes?x.ftpRes+' W':'–';
  const rows=[[myName, Math.round(me.wSum/Math.max(1,T))+' W', de(me.wkgSum/Math.max(1,T),2)+' W/kg', test?fr(me):Math.round((me.zoneT?me.inZone/me.zoneT:0)*100)+' %', de(me.dist/1000,1)+' km']];
  if(opp.active) rows.push(opp.done?[opp.name, Math.round(opp.avgW||0)+' W', de(opp.avg||0,2)+' W/kg', test?fr(opp):Math.round((opp.zone||0)*100)+' %', de((opp.dist||0)/1000,1)+' km']:[opp.name,'noch unterwegs','','','']);
  const nf=me.ftpRes, head=test?(nf?`🎯 Neue FTP: ${nf} W`:'Test beendet'):'💪 Workout geschafft!';
  const ftpBox=test?(nf?`<div style="font-size:18px;margin:4px 0 6px">${race.woKind==='ramp'?`Beste Minute ${Math.round(nf/.75)} W × 75 %`:`20-min-Schnitt ${Math.round(nf/.95)} W × 95 %`} · bisher ${race.ftp0} W (${nf>=race.ftp0?'+':'−'}${Math.abs(nf-race.ftp0)} W) · ${de(nf/weight(),2)} W/kg
      <div class="rowb" style="margin-top:10px"><button id="ftpTake" onclick="$('ftp').value=${nf}; saveWo(); renderWo(); this.textContent='✓ Als FTP übernommen'; this.disabled=true">Als meine FTP übernehmen</button></div></div>`
      :`<div class="small">Zu kurz gefahren für ein Ergebnis.</div>`):'';
  $('resultCard').innerHTML=`<h1 style="font-size:46px">${head}</h1><div class="sub">${esc(R.name)} · ${fmtT(T)} · ${test?(race.woKind==='ramp'?'Rampentest':'20-Minuten-Test'):race.woSegs.length+' Abschnitte'+(race.intens!==1?` · Intensität ${Math.round(race.intens*100)} %`:'')}</div>${ftpBox}
    <table><tr class="small"><td></td><td class="r">Ø Watt</td><td class="r">Ø W/kg</td><td class="r">${test?'FTP':'im Ziel ±5 %'}</td><td class="r">Strecke</td></tr>${rows.map(r=>`<tr><td>${esc(r[0])}</td>${r.slice(1).map(c=>`<td class="r num" style="font-size:20px">${c}</td>`).join('')}</tr>`).join('')}</table>
    ${statsHtml()}${fotoHtml()}
    <div class="rowb" style="margin-top:18px"><button class="go" onclick="quitToLobby()">Neues Training</button>${tcxBtnHtml()}${fotoBtnHtml()}<button onclick="$('result').style.display='none'">Schließen</button></div>`;
  $('result').style.display='flex';
}
