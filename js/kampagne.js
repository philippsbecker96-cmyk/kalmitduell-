/* ================= Kampagne: Der Pedalritter im Wasgau ================= */
// Läuft intern als Training (race.mode='train', race.kamp=Mission): ERG, Workout-Anzeige und Ergebnis kommen aus training.js. Konzept: KAMPAGNE.md
// Zwei Stufen je Mission: items (leicht) und hart – gleiche Struktur, harte Abschnitte ×1,35–1,4, lockere ×1,15–1,2 (max. ≈78 %), Ein-/Ausfahren gleich.
// Tafeln laufen fest 25 s, Start-Tafeln im Einfahren, Ende-Tafeln im Ausfahren, Mitte-Tafeln zu einer aus dem Workout berechneten Zeit (at() → s oder null). Texte: [Bauer|Bäuerin] wird je nach Auswahl ersetzt.
const KT_DAUER=25;
const KAMP=[
  {id:'trifels', nr:1, titel:'Trifels – Die Elwetritsche-Wette', ort:'Burg Trifels · Annweiler · Queichtal', strecke:'trifels',
    items:[S_('Einfahren',8,50,60),{k:'r',n:5,items:[S_('Locker',3,65),S_('Elwetritsche-Jagd',0.5,85)]},S_('Grundlage',5,65),S_('Ausfahren',5,50)],
    hart:[S_('Einfahren',8,50,65),{k:'r',n:5,items:[S_('Locker',3,75),S_('Elwetritsche-Jagd',0.5,117)]},S_('Grundlage',5,78),S_('Ausfahren',5,50)],
    start:[{at:10,titel:'Gold für den Trifels',text:'Du bist [ein einfacher Bauer|eine einfache Bäuerin] aus der Gegend und suchst Arbeit. Auf dem Trifels wird gerade das Lösegeld für Richard Löwenherz abgeladen – und es heißt, der Burgherr sucht Leute, die das Gold sicher nach Speyer bringen.'},
      {info:true, img:'kampagne/bilder/loewenherz.jpg', at:TRIFELS_T.sturz+TRIFELS_T.liegen+4, titel:'Richard Löwenherz', text:'Richard I. von England, 1157 in Oxford geboren, Sohn der mächtigen Eleonore von Aquitanien. Seinen Beinamen verdankt er seinem Mut im Kampf. Im Dritten Kreuzzug eroberte er 1191 Akkon und kämpfte gegen Saladin – Jerusalem aber gewann er nie. In den Robin-Hood-Sagen ist er der gute König, der heimkehrt.'},
      {info:true, img:'kampagne/bilder/loewenherz.jpg', titel:'Gefangen auf dem Trifels', text:'Auf der Heimreise vom Kreuzzug wurde Richard 1192 gefangen genommen – von Herzog Leopold von Österreich, mit dem er sich in Akkon zerstritten hatte. Leopold übergab ihn an Kaiser Heinrich VI., und der ließ ihn 1193 hier auf den Trifels bringen. Frei kam er erst 1194 gegen 150.000 Mark Silber – so viel, wie die englische Krone in vier bis fünf Jahren einnahm.'}, // Infotafeln am Anstieg nach dem Sturz (ab 1:28, je KT_DAUER), vor dem Ruf des Burgherrn
      {at:TRIFELS_T.rauf+TRIFELS_T.hof/2+TRIFELS_T.audienz,titel:'Der Auftrag des Burgherrn',text:'Nur wer Hans von Trotha auf Burg Berwartstein bezwingt, darf das Gold nach Speyer geleiten. Den Raubritter aus dem Wasgau hassen die Pfalz und das Elsass gleichermaßen: Er überfällt Händler, presst den Bauern das Letzte ab und liegt in Fehde mit dem Kloster Weißenburg. Selbst der Bann des Papstes schert ihn nicht.'}], // nach der Audienz-Szene (welt-trifels.js)
    mitte:[{info:true, img:'kampagne/bilder/trotha.jpg', at:()=>240, titel:'Hans von Trotha', text:'Der echte Hans von Trotha stammte aus einem Adelsgeschlecht an der Saale und lebte rund 300 Jahre nach Löwenherz. Als Marschall des Pfälzer Kurfürsten bekam er 1480 Burg Berwartstein. Den Weißenburgern staute er die Wieslauter ab – dann ließ er den Damm brechen, und die Flut traf ihre Stadt. Er starb 1503. Im Elsass begleitet er bis heute als finsterer „Hans Trapp“ das Christkind und straft die unartigen Kinder.'}, // Infotafel auf der Abfahrt (4:00), vor dem Fuhrwerk – ergänzt „Der Auftrag des Burgherrn“, ohne sie zu wiederholen
      {info:true, img:'kampagne/bilder/elwetritsche.jpg', at:()=>{ const S=race.woSegs||[]; return S[0]?S[0].t0+S[0].dur+122:null; }, titel:'Die Elwetritsche', text:'Die Elwetritsche ist ein Fabelwesen der Pfalz – halb Vogel, halb Kobold, mit buntem Gefieder und frechem Schnabel. Sie haust in Wäldern und Weinbergen und lässt sich nur nachts fangen: mit Sack und Laterne. Meist ist die Jagd ein Streich für Fremde – die stehen dann allein im dunklen Wald.'}, // Infotafel nach dem Gegenverkehr (≈ 10:02), vor Friedels Ankündigung von Jagd 1
      {titel:'Auf zur Jagd',text:'Du hast dich bereit erklärt, Friedel zu helfen, eine Elwetritsche zu fangen. Gemeinsam macht ihr euch auf den Weg Richtung Wald.',at:()=>{ const S=race.woSegs||[]; return S[0]?S[0].t0+S[0].dur:null; }}, // nach dem Wirtshausgespräch (Ende des Einfahrens)
      {titel:'Die erste gute Tat',text:'Die Elwetritsche sitzt im Sack, Friedel hat seine Wette gewonnen – und du einen treuen Knappen. Doch der Weg bis zum Gasthaus beim Teufelstisch ist noch weit, und die Nacht bricht herein. Dies war erst der Anfang einer langen Reise. Die wahren Gefahren lauern noch im Wasgau auf dich.',at:()=>{ const K=anim.tri&&anim.tri.sk; return K?K.heim+12:null; }}], // wenn Friedel umgekehrt und außer Sicht ist
    ende:[{titel:'Rast am Teufelstisch',text:'Nach einer langen Fahrt durch die dunklen Wälder des Wasgaus hast du endlich das Gasthaus „Zum Teufelstisch“ erreicht. Ruh dich aus, [edler Held|edle Heldin] – die nächsten Tage werden gewiss nicht leichter.'}]},
  {id:'teufelstisch', nr:2, titel:'Teufelstisch – Wette mit dem Teufel', ort:'Hinterweidenthal', bald:true},
  {id:'dahn', nr:3, titel:'Dahn – Der Jungfernsprung', ort:'Dahner Felsenland', bald:true},
  {id:'berwartstein', nr:4, titel:'Berwartstein – Drache und Flut', ort:'Erlenbach · Burg Berwartstein', bald:true}];
// Strecke der Mission: aus dem Workout berechnet (trifelsDef) oder fest; Missionen ohne eigene Welt fahren Berwartstein als Platzhalter
function kampRoute(){ const id=race.kamp&&race.kamp.strecke||'berwartstein'; return id==='trifels'?genEntry(id):ROUTES.find(r=>r.id===id); }
// Spielstand: {stand:'bauer'|'baeuerin', stufe:'leicht'|'hart', done:[ids], sel:id} – geschafft zählt für beide Stufen
function kampLoad(){ try{ const o=JSON.parse(localStorage.getItem('kd-kampagne')); if(o&&typeof o==='object') return {done:[],...o}; }catch(e){} return {stand:null,stufe:'leicht',done:[],sel:'trifels'}; }
let KST=kampLoad();
const kampSave=()=>{ try{ localStorage.setItem('kd-kampagne',JSON.stringify(KST)); }catch(e){} };
const kampFrei=m=>!m.bald && (m.nr===1 || KST.done.includes(KAMP[m.nr-2].id)); // nacheinander freigeschaltet
// ---- Sperre: Kampagne noch in Arbeit, nur mit Code spielbar (Freischaltung je Gerät in kd-kampagne.code) ----
const kampOffen=()=>!!KST.code;
function kampSperre(){ const b=document.querySelector('.mode[data-m="kamp"]'); if(!b) return; b.classList.toggle('zu',!kampOffen());
  let t=b.querySelector('.zuTag'); if(!kampOffen()&&!t){ t=document.createElement('em'); t.className='zuTag'; t.textContent='🔒 In Arbeit'; b.prepend(t); } else if(kampOffen()&&t) t.remove(); }
function kampCode(){ const c=prompt('Die Kampagne ist noch in Arbeit.\nCode zum Freischalten:'); if(c==null) return false;
  if(btoa(c.trim())==='LjExMDQ='){ KST.code=true; kampSave(); kampSperre(); return true; } alert('Falscher Code.'); return false; }
kampSperre();
const kampMission=()=>KAMP.find(m=>m.id===KST.sel&&kampFrei(m))||KAMP[0];
const kText=s=>s.replace(/\[name\]/g,()=>(RIDERS[myKey]&&RIDERS[myKey].name)||'Fremder').replace(/\[([^|\]]*)\|([^\]]*)\]/g,(_,a,b)=>KST.stand==='baeuerin'?b:a); // [name] = Name des eigenen Fahrers
// Workout der Mission; Einfahren/Ausfahren mindestens so lang wie die Tafeln
function kampSegs(m){ const it=clone((KST.stufe==='hart'&&m.hart)||m.items||[]), a=it[0], z=it[it.length-1], nS=kampStartZeiten(m).reduce((a,[t0])=>Math.max(a,t0+KT_DAUER),0), nE=(m.ende||[]).length*KT_DAUER;
  if(a&&a.k==='s') a.dur=Math.max(a.dur,nS+(nS<=KT_DAUER*3?60:0)); if(z&&z.k==='s') z.dur=Math.max(z.dur,nE); return woFlat({items:it}); } // bei sehr wenigen Tafeln 1 min Einrollen dazu

// ---- Menü ----
function kampUi(){ const B=$('kampBlock'); if(!B) return;
  $('kampStand').innerHTML=[['bauer','🧑‍🌾 Bauer'],['baeuerin','👩‍🌾 Bäuerin']].map(([k,t])=>`<button class="kst${KST.stand===k?' sel':''}" data-st="${k}">${t}</button>`).join('');
  $('kampStufe').innerHTML=[['leicht','🌿 Leicht'],['hart','🔥 Hart']].map(([k,t])=>`<button class="kst${(KST.stufe||'leicht')===k?' sel':''}" data-sf="${k}">${t}</button>`).join('');
  $('kampList').innerHTML=KAMP.map(m=>{ const fr=kampFrei(m), ok=KST.done.includes(m.id);
    return `<button class="route kmis${race.kamp&&race.kamp.id===m.id?' sel':''}" data-id="${m.id}" ${fr?'':'disabled'}><div class="ph">${m.bald?'folgt':ok?'✓':fr?m.nr:'🔒'}</div><div><b>Mission ${m.nr}: ${esc(m.titel)}</b><span>${esc(m.ort)}${m.bald?' · kommt später':ok?' · geschafft':''}</span></div></button>`; }).join('');
  $('kampStand').querySelectorAll('button').forEach(b=>b.onclick=()=>{ KST.stand=b.dataset.st; kampSave(); kampUi(); renderRouteList(); });
  $('kampStufe').querySelectorAll('button').forEach(b=>b.onclick=()=>{ KST.stufe=b.dataset.sf; kampSave(); kampUi(); renderWo(); });
  $('kampList').querySelectorAll('button').forEach(b=>b.onclick=()=>{ KST.sel=b.dataset.id; kampSave(); race.kamp=kampMission(); kampUi(); renderWo(); }); }

// ---- Tafeln im Rennen ----
function kampTafel(tf){ let el=$('kampTafel'); if(!tf){ el.classList.remove('zeig'); el.dataset.k=''; return; }
  const k=tf.titel; if(el.dataset.k!==k){ el.dataset.k=k; el.classList.toggle('info',!!tf.info); // info: Infotafel (helles Pergament, roter Rand, Bild)
    el.innerHTML=`${tf.img||tf.bild?`<div class="kbild${tf.img?' mitbild':''}">${tf.img?`<img src="${tf.img}" alt="">`:tf.bild}</div>`:''}<div class="ktxt"><h3>${esc(kText(tf.titel))}</h3><p>${esc(kText(tf.text))}</p></div><div class="kbar"><i></i></div>`; }
  el.classList.add('zeig'); el.querySelector('.kbar i').style.width=Math.min(100,tf.p*100)+'%'; }
function kampTick(){ const m=race.kamp; if(!m||race.state!=='run'||me.done){ kampTafel(null); return; }
  const t=race.t, E=m.ende||[], e0=(race.woT||0)-E.length*KT_DAUER, j=Math.floor((t-e0)/KT_DAUER), s=kampStartZeiten(m).find(([t0])=>t>=t0&&t<t0+KT_DAUER);
  const mi=s?null:(m.mitte||[]).map(tf=>[tf.at(),tf]).find(([t0])=>t0!=null&&t>=t0&&t<t0+KT_DAUER);
  if(s) kampTafel({...s[1],p:(t-s[0])/KT_DAUER});
  else if(mi) kampTafel({...mi[1],p:(t-mi[0])/KT_DAUER});
  else if(t>=e0&&j<E.length) kampTafel({...E[j],p:(t-e0-j*KT_DAUER)/KT_DAUER});
  else kampTafel(null); }
// Start-Tafeln: at = feste Workout-Zeit (s), sonst direkt nach der vorigen
function kampStartZeiten(m){ let t=0; return (m.start||[]).map(tf=>{ const t0=tf.at??t; t=t0+KT_DAUER; return [t0,tf]; }); }
// ---- Wasgau-Karte oben rechts (statt Minimap, nur in Missionen) ----
// Lage grob nach Norden ausgerichtet, Koordinaten 0..1 in der Box. Hintergrund (Wald, Bäche, Weg, Symbole) wird einmal in KARTE.c gemalt, Marker und Punkt jedes Bild.
const KARTE_WEG=[[.84,.31],[.70,.36],[.52,.30],[.33,.31],[.19,.38],[.23,.48],[.28,.58],[.37,.66],[.48,.72],[.58,.80]]; // Reiseweg Trifels → Queichtal → Teufelstisch → Dahn → Berwartstein
const KARTE_ORT=[ // id = Mission, i = Punkt auf KARTE_WEG; sym: burg, tisch, fels, stadt
  {id:'trifels',n:'Trifels',p:[.84,.31],sym:'burg',i:0,dy:-14}, {id:'teufelstisch',n:'Teufelstisch',p:[.19,.38],sym:'tisch',i:4,dy:-12},
  {id:'dahn',n:'Jungfernsprung',p:[.28,.58],sym:'fels',i:6,dy:-16,lx:-.07}, {id:'berwartstein',n:'Berwartstein',p:[.58,.80],sym:'burg',i:9,dy:-14},
  {n:'Lindelbrunn',p:[.57,.43],sym:'burg',s:.75,dy:-11}, {n:'Drachenfels',p:[.48,.59],sym:'drache',s:.85,dy:-12,lx:.07}, {n:'Weißenburg',p:[.86,.91],sym:'stadt',dy:-10,ly:.0}];
const KARTE={key:'',c:null};
function karteBg(box){ const c=document.createElement('canvas'), S=box*DPR; c.width=c.height=S; const g=c.getContext('2d'); g.scale(DPR,DPR);
  let sd=7; const rnd=()=>((sd=(sd*16807)%2147483647)-1)/2147483646, P=([u,v])=>[u*box,v*box];
  g.save(); g.beginPath(); g.roundRect?g.roundRect(1.5,1.5,box-3,box-3,12):g.rect(0,0,box,box); g.clip();
  const gr=g.createLinearGradient(0,0,box*.4,box); gr.addColorStop(0,'#2f6b32'); gr.addColorStop(1,'#1f5228'); g.fillStyle=gr; g.fillRect(0,0,box,box); // Pfälzerwald
  const lin=(pts,col,w,dash)=>{ g.strokeStyle=col; g.lineWidth=w; g.lineCap=g.lineJoin='round'; g.setLineDash(dash||[]); g.beginPath(); pts.forEach((p,i)=>{ const [x,y]=P(p); i?g.lineTo(x,y):g.moveTo(x,y); }); g.stroke(); g.setLineDash([]); };
  const QUEICH=[[-.02,.06],[.12,.11],[.25,.19],[.36,.24],[.52,.27],[.70,.33],[.86,.36],[1.02,.34]], LAUTER=[[-.02,.27],[.08,.28],[.17,.34],[.24,.47],[.31,.60],[.42,.74],[.62,.86],[.84,.95],[1.02,.98]];
  lin(QUEICH,'rgba(150,200,95,.55)',22); lin(LAUTER,'rgba(150,200,95,.55)',22); lin(KARTE_WEG,'rgba(150,200,95,.45)',16); // Wiesentäler
  for(let k=0;k<420;k++){ const x=rnd()*box, y=rnd()*box, r=3.5+rnd()*5, h=rnd(); // Baumkronen, dunkle Kuppen
    g.fillStyle='rgba(10,35,15,.35)'; g.beginPath(); g.arc(x+1.2,y+1.6,r,0,7); g.fill();
    g.fillStyle=h<.3?'#2a5e2c':h<.6?'#3b7a36':h<.85?'#4d8d3c':'#5f9e44'; g.beginPath(); g.arc(x,y,r,0,7); g.fill();
    g.fillStyle='rgba(190,230,130,.22)'; g.beginPath(); g.arc(x-r*.35,y-r*.35,r*.45,0,7); g.fill(); }
  lin(QUEICH,'rgba(150,200,95,.7)',9); lin(LAUTER,'rgba(150,200,95,.7)',9); // Talgrund wieder frei
  lin(QUEICH,'#3d86c6',2.6); lin(LAUTER,'#3d86c6',2.6); lin(QUEICH,'rgba(200,230,255,.5)',.8); lin(LAUTER,'rgba(200,230,255,.5)',.8); // Queich, Wieslauter
  lin(KARTE_WEG,'rgba(60,40,15,.55)',4.2,[6,5]); lin(KARTE_WEG,'#f1dfa4',2.4,[6,5]); // Reiseweg
  const fels=(x,y,w,h)=>{ g.fillStyle='#b8573a'; g.strokeStyle='#5e2615'; g.lineWidth=1; g.beginPath(); g.moveTo(x-w/2,y); g.lineTo(x-w*.38,y-h*.7); g.lineTo(x-w*.2,y-h); g.lineTo(x+w*.25,y-h*.95); g.lineTo(x+w*.42,y-h*.55); g.lineTo(x+w/2,y); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle='rgba(255,200,160,.45)'; g.beginPath(); for(let j=1;j<3;j++){ g.moveTo(x-w*.3,y-h*j/3); g.lineTo(x+w*.3,y-h*j/3-1); } g.stroke(); }; // Buntsandstein mit Schichten
  const turm=(x,y,w,h,dach)=>{ g.fillStyle='#d9d2c2'; g.strokeStyle='#3c3a33'; g.lineWidth=1; g.fillRect(x-w/2,y-h,w,h); g.strokeRect(x-w/2,y-h,w,h);
    if(dach){ g.fillStyle='#b23a2a'; g.beginPath(); g.moveTo(x-w/2-1,y-h); g.lineTo(x,y-h-w*1.1); g.lineTo(x+w/2+1,y-h); g.closePath(); g.fill(); g.stroke(); }
    else{ g.fillStyle='#d9d2c2'; for(let j=0;j<3;j++){ g.fillRect(x-w/2+j*w/2.5,y-h-2.2,w/5,2.2); g.strokeRect(x-w/2+j*w/2.5,y-h-2.2,w/5,2.2); } } g.fillStyle='#3c3a33'; g.fillRect(x-.8,y-h*.6,1.6,2.4); };
  const sym={ burg:(x,y,s)=>{ fels(x,y+2,22*s,9*s); turm(x-5*s,y-6*s,6*s,9*s,false); turm(x+4*s,y-6*s,7*s,13*s,true); g.fillStyle='#d9d2c2'; g.fillRect(x-5*s,y-11*s,9*s,5*s); g.strokeRect(x-5*s,y-11*s,9*s,5*s);
      g.strokeStyle='#3c3a33'; g.beginPath(); g.moveTo(x+4*s,y-(19+7)*s); g.lineTo(x+4*s,y-(19+11)*s); g.stroke(); g.fillStyle='#e8c33a'; g.fillRect(x+4*s,y-30*s,5*s,3*s); }, // Felsenburg mit Fahne
    tisch:(x,y,s)=>{ g.fillStyle='#b8573a'; g.strokeStyle='#5e2615'; g.lineWidth=1; g.beginPath(); g.moveTo(x-3*s,y); g.lineTo(x-2.4*s,y-9*s); g.lineTo(x+2.4*s,y-9*s); g.lineTo(x+3*s,y); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x-11*s,y-9*s); g.lineTo(x+11*s,y-9.5*s); g.lineTo(x+10*s,y-14*s); g.lineTo(x-10*s,y-13.5*s); g.closePath(); g.fill(); g.stroke(); }, // Pilzfelsen
    fels:(x,y,s)=>{ fels(x+5*s,y,10*s,10*s); fels(x-2*s,y,9*s,22*s); }, // Jungfernsprung: hohe Wand
    drache:(x,y,s)=>{ fels(x-3*s,y,10*s,11*s); fels(x+5*s,y,9*s,8*s); g.fillStyle='#8c1f1a'; g.strokeStyle='#3a0d0a'; g.beginPath(); g.moveTo(x-2*s,y-12*s); g.quadraticCurveTo(x+4*s,y-22*s,x+12*s,y-20*s); g.lineTo(x+6*s,y-16*s); g.lineTo(x+10*s,y-13*s); g.closePath(); g.fill(); g.stroke(); }, // Fels mit Drachenflügel
    stadt:(x,y,s)=>{ g.fillStyle='rgba(240,225,190,.9)'; g.strokeStyle='#4b3b26'; g.lineWidth=1; g.beginPath(); g.arc(x,y-4,11*s,Math.PI,0); g.stroke(); // Stadtmauer
      [[-7,4],[-2,6],[4,5],[9,4]].forEach(([dx,h])=>{ g.fillStyle='#efe3c4'; g.fillRect(x+dx*s-2.5,y-h,5,h); g.strokeRect(x+dx*s-2.5,y-h,5,h); g.fillStyle='#b23a2a'; g.beginPath(); g.moveTo(x+dx*s-3.2,y-h); g.lineTo(x+dx*s,y-h-3.5); g.lineTo(x+dx*s+3.2,y-h); g.fill(); });
      turm(x+1*s,y-6,3.5,7,true); } }; // Weißenburg (Kloster und Stadt)
  KARTE_ORT.forEach(o=>{ const [x,y]=P(o.p); sym[o.sym](x,y,(o.s||1)*1.3); });
  const tritsch=(x,y,s,f)=>{ g.save(); g.translate(x,y); g.scale(f*s,s); g.lineWidth=1/s; g.strokeStyle='#2e1c10'; // Elwetritsche: rundlicher Vogel mit Geweih, Schnabel, langen Beinen
    const gr=g.createRadialGradient(0,-6,0,0,-6,9); gr.addColorStop(0,'rgba(255,220,120,.45)'); gr.addColorStop(1,'rgba(255,220,120,0)'); g.fillStyle=gr; g.fillRect(-9,-15,18,18); // leiser Schein
    g.beginPath(); g.moveTo(-1.5,-2); g.lineTo(-2.2,0); g.moveTo(1.5,-2); g.lineTo(2.2,0); g.stroke(); // Beine
    g.fillStyle='#9a6a3c'; g.beginPath(); g.ellipse(-.5,-4.5,4.2,3,0,0,7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-4.4,-5.5); g.lineTo(-7,-7.5); g.lineTo(-4.2,-3.6); g.fill(); g.stroke(); // Bauch, Schwanzfedern
    g.beginPath(); g.arc(3.2,-8.2,2.1,0,7); g.fill(); g.stroke(); g.fillStyle='#e8a23a'; g.beginPath(); g.moveTo(5,-8.8); g.lineTo(7.4,-8); g.lineTo(5,-7.3); g.fill(); // Kopf, Schnabel
    g.beginPath(); g.moveTo(2.6,-10); g.lineTo(2,-12.6); g.lineTo(1,-13.4); g.moveTo(2,-12.6); g.lineTo(2.9,-13.8); g.moveTo(3.8,-10.1); g.lineTo(4.6,-12.5); g.lineTo(5.6,-13.2); g.stroke(); // Geweih
    g.fillStyle='#111'; g.fillRect(3.6,-8.9,.9,.9); g.restore(); };
  [[.71,.25,1,-1],[.47,.375,.85,1],[.30,.24,.95,-1]].forEach(([u,v,s,f])=>tritsch(u*box,v*box,s,f)); // zwischen Trifels und Teufelstisch
  g.restore();
  g.font="400 25px 'UnifrakturMaguntia', Georgia, serif"; g.textAlign='center'; g.lineWidth=4; g.strokeStyle='rgba(15,40,18,.85)'; g.strokeText('Wasgau',box/2,30); g.fillStyle='#f1e7c4'; g.fillText('Wasgau',box/2,30);
  g.strokeStyle='#183a1e'; g.lineWidth=3; g.beginPath(); g.roundRect?g.roundRect(1.5,1.5,box-3,box-3,12):g.rect(1.5,1.5,box-3,box-3); g.stroke();
  g.strokeStyle='rgba(220,240,180,.35)'; g.lineWidth=1; g.beginPath(); g.roundRect?g.roundRect(4.5,4.5,box-9,box-9,9):g.rect(4.5,4.5,box-9,box-9); g.stroke();
  return c; }
function kampHakenAb(){ const z=R&&R.tri&&R.tri.gast?R.tri.gast.d:R&&(R.def&&R.def.orte&&R.def.orte.ziel||R.len); return (z||1e9)-120; } // Haken der laufenden Mission erst kurz vor dem Ziel (Mission 1: Gasthaus)
function kampKarte(x0,y0,box){ const m=race.kamp, g=ctx, P=([u,v])=>[x0+u*box,y0+v*box];
  if(KARTE.key!==box+'|'+DPR){ KARTE.c=karteBg(box); KARTE.key=box+'|'+DPR; } g.drawImage(KARTE.c,x0,y0,box,box);
  g.textAlign='center'; g.lineJoin='round';
  KARTE_ORT.forEach(o=>{ const k=o.id&&KAMP.find(q=>q.id===o.id), jetzt=k&&k===m, fertig=k&&(jetzt?me.done||me.d>=kampHakenAb():KST.done.includes(k.id)), [x,y]=P([o.p[0]+(o.lx||0),o.p[1]]);
    g.font=(k?'700 11px':'600 9.5px')+" Barlow, sans-serif"; g.lineWidth=3; g.strokeStyle='rgba(12,32,14,.9)'; const ty=y+(k?13:11); g.strokeText(o.n,x,ty);
    g.fillStyle=jetzt?'#ffd95a':fertig?'#e9f5d0':k?(kampFrei(k)&&!k.bald?'#f1e7c4':'rgba(241,231,196,.6)'):'rgba(230,240,215,.75)'; g.fillText(o.n,x,ty);
    if(fertig){ g.strokeStyle='#1f4a22'; g.lineWidth=4; g.beginPath(); g.moveTo(x+12,y-8); g.lineTo(x+15,y-4); g.lineTo(x+21,y-12); g.stroke(); g.strokeStyle='#ffd95a'; g.lineWidth=2; g.stroke(); } // Haken
    if(jetzt){ const a=.5+.5*Math.sin(performance.now()/300); g.strokeStyle=`rgba(255,217,90,${.35+.5*a})`; g.lineWidth=2; g.beginPath(); g.arc(x,y-8,14+a*2,0,7); g.stroke(); } }); // aktuelle Mission leuchtet
  const o=KARTE_ORT.find(q=>q.id===(m&&m.id))||KARTE_ORT[0], n=KARTE_ORT.filter(q=>q.id).find(q=>q.i>o.i), W_=KARTE_WEG.slice(o.i,(n?n.i:o.i)+1).map(P); // dein Punkt wandert auf dem Weg zur nächsten Station
  let L=0; const sl=W_.map((p,j)=>j?Math.hypot(p[0]-W_[j-1][0],p[1]-W_[j-1][1]):0); sl.forEach(s=>L+=s);
  const ziel=R&&(R.def&&R.def.orte&&R.def.orte.ziel||R.len); let r=(ziel?Math.min(1,Math.max(0,me.d/ziel)):0)*L, px=W_[0][0], py=W_[0][1];
  for(let j=1;j<W_.length;j++){ if(r<=sl[j]){ const f=sl[j]?r/sl[j]:0; px=W_[j-1][0]+(W_[j][0]-W_[j-1][0])*f; py=W_[j-1][1]+(W_[j][1]-W_[j-1][1])*f; break; } r-=sl[j]; px=W_[j][0]; py=W_[j][1]; }
  g.fillStyle=RIDERS[myKey].dot; g.strokeStyle='#fff'; g.lineWidth=2.2; g.beginPath(); g.arc(px,py,5.5,0,7); g.fill(); g.stroke(); }
function kampFertig(){ const m=race.kamp; if(m&&!race.sprung&&!KST.done.includes(m.id)){ // im Testmodus vorgespult: zählt nicht als geschafft
    KST.done.push(m.id); kampSave(); } kampTafel(null); }
