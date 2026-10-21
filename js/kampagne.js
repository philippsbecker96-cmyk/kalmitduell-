/* ================= Kampagne: Der Pedalritter im Wasgau ================= */
// Läuft intern als Training (race.mode='train', race.kamp=Mission): ERG, Workout-Anzeige und Ergebnis kommen aus training.js. Konzept: KAMPAGNE.md
// Zwei Stufen je Mission: items (leicht) und hart – gleiche Struktur, harte Abschnitte ×1,35–1,4, lockere ×1,15–1,2 (max. ≈78 %), Ein-/Ausfahren gleich.
// Tafeln laufen fest 25 s, Start-Tafeln im Einfahren, Ende-Tafeln im Ausfahren. Texte: [Bauer|Bäuerin] wird je nach Auswahl ersetzt.
const KT_DAUER=25;
const KAMP=[
  {id:'trifels', nr:1, titel:'Trifels – Die Elwetritsche-Wette', ort:'Burg Trifels · Annweiler · Queichtal', strecke:'trifels',
    items:[S_('Einfahren',8,50,60),{k:'r',n:5,items:[S_('Locker',3,65),S_('Elwetritsche-Jagd',0.5,85)]},S_('Grundlage',5,65),S_('Ausfahren',5,50)],
    hart:[S_('Einfahren',8,50,65),{k:'r',n:5,items:[S_('Locker',3,75),S_('Elwetritsche-Jagd',0.5,117)]},S_('Grundlage',5,78),S_('Ausfahren',5,50)],
    start:[{bild:'💰🏰',titel:'Gold für den Trifels',text:'Du bist [ein einfacher Bauer|eine einfache Bäuerin] aus der Gegend und suchst Arbeit. Auf dem Trifels wird gerade das Lösegeld für Richard Löwenherz abgeladen – und es heißt, der Burgherr sucht Leute, die das Gold sicher nach Speyer bringen.'},
      {bild:'🤴',at:TRIFELS_T.rauf+6,titel:'Audienz beim Burgherrn',text:'„Für so ein Unterfangen brauche ich Leute, denen ich wirklich vertrauen kann – und die etwas taugen. Beweise es: Besiege Hans von Trotha auf Burg Berwartstein. Der Weg dorthin ist weit und beschwerlich.“'}],
    ende:[{bild:'🐦🍺',titel:'Wette gewonnen',text:'Dein neuer Knappe radelt mit der gefangenen Elwetritsche im Sack zurück zum Wirtshaus, um seine 10 Gulden einzustreichen.'},
      {bild:'🤝',titel:'Bis morgen!',text:'Ihr verabredet euch im Gasthaus an der Straße Richtung Teufelstisch. Dort geht die Reise weiter.'}]},
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
const kampMission=()=>KAMP.find(m=>m.id===KST.sel&&kampFrei(m))||KAMP[0];
const kText=s=>s.replace(/\[([^|\]]*)\|([^\]]*)\]/g,(_,a,b)=>KST.stand==='baeuerin'?b:a);
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
  const k=tf.titel; if(el.dataset.k!==k){ el.dataset.k=k; el.innerHTML=`<div class="kbild">${tf.bild||''}</div><div class="ktxt"><h3>${esc(kText(tf.titel))}</h3><p>${esc(kText(tf.text))}</p></div><div class="kbar"><i></i></div>`; }
  el.classList.add('zeig'); el.querySelector('.kbar i').style.width=Math.min(100,tf.p*100)+'%'; }
function kampTick(){ const m=race.kamp; if(!m||race.state!=='run'||me.done){ kampTafel(null); return; }
  const t=race.t, E=m.ende||[], e0=(race.woT||0)-E.length*KT_DAUER, j=Math.floor((t-e0)/KT_DAUER), s=kampStartZeiten(m).find(([t0])=>t>=t0&&t<t0+KT_DAUER);
  if(s) kampTafel({...s[1],p:(t-s[0])/KT_DAUER});
  else if(t>=e0&&j<E.length) kampTafel({...E[j],p:(t-e0-j*KT_DAUER)/KT_DAUER});
  else kampTafel(null); }
// Start-Tafeln: at = feste Workout-Zeit (s), sonst direkt nach der vorigen
function kampStartZeiten(m){ let t=0; return (m.start||[]).map(tf=>{ const t0=tf.at??t; t=t0+KT_DAUER; return [t0,tf]; }); }
function kampFertig(){ const m=race.kamp; if(m&&!KST.done.includes(m.id)){ KST.done.push(m.id); kampSave(); } kampTafel(null); }
