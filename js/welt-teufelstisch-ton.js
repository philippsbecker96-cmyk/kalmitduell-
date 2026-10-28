/* ===== Mission 2 (Teufelstisch): Musik und Geräusche =====
   Helfer aus Mission 1 (triEins, triLoop, triMusik, triMusikNeu, triFern in welt-trifels-leben.js) · Plan, Dateien und was noch fehlt: kampagne/sounds/effekte/EFFEKTE.md
   ttTon aus rennen.js · fehlende Dateien bleiben still (Verfolgungsstück teufelsjagd: bis es da ist, läuft omniouswaldnachts als Platzhalter) */
Object.assign(TRI_TON_VOL,{hundemeute:.7, hund_gross:.6, vogel_wald:.5, kinderlachen:.6}); // vogel_wald, kinderlachen fehlen noch (bleiben still)
Object.assign(TRI_MUSIK,{teufelsweg:['musik/teufelsweg',.5,.6], waldamb:['musik/waldambient',.35], tjagd:['musik/teufelsjagd',.55,2], tjagdP:['musik/omniouswaldnachts',.5,2]}); // tjagdP: Platzhalter fürs Verfolgungsstück
const TT_TON={hund:35, bell:[2,6], jagdLang:31, thema:36, teufelsweg:86, froh:3}; // Hunde hörbar bis m · Bellen alle s · Jagdmusik spielt s · Thema bis s · teufelsweg endet mit „Ertappt“ · fröhliche Musik so viele s, nachdem der Teufel am Steintor aufschlägt
let ttTonVor=null, ttJagdDa=null; // ttJagdDa: liegt musik/teufelsjagd.mp3 schon im Ordner?
function ttTon(dt){ const A=anim.tt; if(!A) return; const run=race.state==='run', an=(run||race.state==='count')&&!race.paused, rt=run?race.t:0, t=performance.now()/1000, T=R.tt, Z=TT_TON;
  if(!A.tonAn){ A.tonAn=1; triTonAus(); } triDuck=1; // Töne von Mission 1 aus
  if(!ttTonVor){ ttTonVor=['hundemeute','hund_gross','hundebellen','rascheln_gebuesch','glocken','sturz','peitsche','fluegel','hufe','kettenhemd','wiehern','wolfsgehaeul','feuerknistern','grillen'].map(n=>Object.assign(new Audio(TRI_TON+n+'.mp3'),{preload:'auto'}));
    const a=new Audio('kampagne/sounds/'+TRI_MUSIK.tjagd[0]+'.mp3'); a.preload='auto'; a.oncanplaythrough=()=>{ ttJagdDa=true; }; a.onerror=()=>{ ttJagdDa=false; }; ttTonVor.push(a); }
  if(race.state==='count'&&!A.tonNeu){ for(const n in TRI_MUSIK) triMusikNeu(n); } A.tonNeu=race.state==='count'; // neues Rennen: Musik von vorn
  if(race.state==='count'||!A.ton) A.ton={}; const O=A.ton, einmal=(k,b)=>b&&!O[k]&&(O[k]=1), zu=(k,t0)=>run&&einmal(k,t0!=null&&rt>=t0&&rt<t0+3); // Einzelton zur Zeit t0 (nach Sprüngen im Testmodus nicht nachgeholt)
  const S=race.woSegs||[], f=l=>S.find(s=>s.label===l), an1=f('Anstieg'), e1=f('Ertappt'), a1=f('Abgeschüttelt'), z=f('Schlusssprint'), au=f('Ausfahren'), zE=z?z.t0+z.dur:1e9;
  const P=A.hp, D=A.teufel, K=D&&D.sk, [sturm]=run?ttWetterW(rt):[0], km=race.kamp, e0=km?(race.woT||0)-(km.ende||[]).length*KT_DAUER:1e9, ank=run&&rt>=e0&&rt<e0+16; // e0: Ende-Tafeln
  // ---- Musik ----
  // Erkennungsmelodie beim Countdown und Losfahren, noch einmal nach dem Schlusssprint (geschafft!)
  if(einmal('thema2',run&&rt>=zE+3&&rt<zE+20)) triMusikNeu('thema'); const th=an&&(race.state==='count'||rt<Z.thema||rt>=zE+3&&rt<zE+45)?1:0; triMusik('thema',th,dt,false);
  // Hunde: Jagdmusik aus Mission 1 in Schüben – wenn sie aufspringen, zweimal mittendrin, und so, dass sie mit der letzten Wurst endet
  let jm=0; if(run&&P){ [P.t0, P.klau[4].t-6, P.klau[8].t-6, P.ende-Z.jagdLang].forEach((j,k)=>{ if(rt>=j&&rt<j+Z.jagdLang){ jm=1; if(einmal('jm'+k,true)) triMusikNeu('jagd'); } }); }
  triMusik('jagd',an?jm:0,dt,false);
  // Idylle am Wegweiser zum Jungfernsprung: kurz fröhlich, bricht mit dem Unwetter ab
  const idy=run&&T.idyll!=null&&me.d>=T.idyll-250&&me.d<T.idyll+250&&sturm<=0; // endet, wenn die Kamera zurück ist (dann kommt das Unwetter) if(einmal('idy',idy)) triMusikNeu('happy');
  // Pause nach Flucht 1: wenn es aufklart, fröhliche Musik und Vögel – verklingt, wenn es wieder zuzieht
  const pw=run&&a1&&rt>=a1.t0&&T.ecke!=null&&me.d<T.ecke+TT_PAUSE.kipp[0]+TT_PAUSE.kipp[1]?ttPauseW(rt):1, froh=D&&D.trip!=null&&rt>=D.trip+TF_STURZ.fall+TT_TON.froh?clampN((.55-pw)/.3,0,1):0; // erst ein paar s, nachdem der Teufel am Steintor auf dem Boden liegt if(einmal('froh',froh>0)) triMusikNeu('happy'); if(triLoops.mhappy) triLoops.mhappy.a.loop=froh>0;
  // Idylle: Vögel zwitschern, Kinder lachen, wenn die Kamera bei der Familie ist und wenn sie zu den Kindern zurückschwenkt
  const ik=A.ikT, C=TT_BOGEN.kam; if(ik>0){ zu('lachen1',ik+C[1]+.6)&&triEins('kinderlachen',.8); zu('lachen2',ik+C[1]+C[2]-3.5)&&triEins('kinderlachen',1,1.08); }
  triLoop('ttVoegel','vogel_wald',an?Math.max(froh,idy?.8:0):0,dt);
  // Anschleichen: teufelsweg (86 s) so, dass es mit „Ertappt“ endet, wird zum Tisch hin lauter – danach kurz Stille
  const tw0=e1?e1.t0-Z.teufelsweg:1e9, tw=run&&rt>=tw0&&rt<e1.t0?.7+.3*(rt-tw0)/Z.teufelsweg:0; if(einmal('tw',tw>0)) triMusikNeu('teufelsweg'); triMusik('teufelsweg',an?tw:0,dt,false);
  // Flucht 1 und 2: Verfolgungsstück (Runde 2 lauter), solange es fehlt, der Platzhalter
  let fl=0; if(run&&K){ const [r1,r2]=K.r; if(rt>=r1.tT+1.5&&rt<r1.tE) fl=.85; else if(rt>=r2.tT+1.5&&rt<zE) fl=1; }
  triMusik('tjagd',an&&ttJagdDa?fl:0,dt); triMusik('tjagdP',an&&!ttJagdDa?fl:0,dt);
  // Unterwegs (folk1, folk2, happy) wie in Mission 1: im Einfahren unter Friedels Erzählung und dem Gedicht, im Ausfahren nach dem Thema
  const PL=O.pl||(O.pl=['folk1','folk2','happy'].sort(()=>Math.random()-.5)), PA=triLoops['m'+PL[O.pi|0]];
  const unt=run&&!ank&&(rt>=Z.thema+2&&an1&&rt<an1.t0-15||rt>=zE+45)?.8:0, hp=Math.max(unt,idy?1:0,froh), hap=idy||froh>0;
  if(unt>0&&PA&&PA.a.ended){ if(!O.plNeu) O.plNeu=t+4+Math.random()*4; else if(t>O.plNeu){ O.plNeu=0; O.pi=((O.pi|0)+1)%PL.length; triMusikNeu(PL[O.pi]); } }
  for(const n of PL) triMusik(n,an&&(hap?n==='happy':n===PL[O.pi|0])?hp:0,dt,false);
  // Wald-Teppich (waldambient): ab den Hunden bis „Ertappt“ und nach Flucht 1, leiser im Unwetter – aus bei Jagd, Idylle, teufelsweg und Flucht
  const wald=run&&an1&&(rt>=an1.t0-15&&e1&&rt<e1.t0||a1&&K&&rt>=K.r[0].tE&&rt<K.r[1].tT)?(sturm>0?.5:.7)*(1-jm)*(idy?0:1)*(tw>0?0:1)*(1-froh):0; triMusik('waldamb',an?wald:0,dt);
  // Ankunft: mit den Ende-Tafeln einmal das kurze Stück
  if(einmal('ankunft',ank)) triMusikNeu('ankunft'); triMusik('ankunft',an&&ank?1:0,dt,false);
  // ---- Geräusche ----
  // Kirchenglocke im Kaltenbacher Tal läutet Mittag, wenn die letzte Strophe ausläuft
  if(A.ged&&A.ged.length) zu('glocken',A.ged[A.ged.length-1][1]-2)&&triEins('glocken',.8);
  // Hunde: Bellen aus dem Gebüsch, bevor man sie sieht · Meute beim Aufspringen · Gebell, solange sie bei euch sind · Schnappen beim Klau, Kläffen beim Biss · Meute zieht ab
  if(P){ if(zu('hvor',P.t0-15)){ triEins('hund_gross',.6); triEins('rascheln_gebuesch',.6); } if(zu('hlos',P.t0)){ triEins('hundemeute'); triEins('rascheln_gebuesch'); }
    P.klau.forEach((k,i)=>{ if(zu('k'+i,k.t)) triEins('hund_gross',1,1.15); }); P.biss.forEach((b,i)=>{ if(zu('b'+i,b.t)) triEins('hundebellen',1,1.3); }); if(zu('hab',P.ende+1)) triEins('hundemeute',.8);
    const nah=run&&rt>=P.t0&&rt<P.ende+5?Math.max(0,...A.hunde.filter(h=>h.G.visible).map(h=>triFern(h.G.position,Z.hund))):0;
    if(nah>.05){ if(O.bell==null) O.bell=t+1; else if(t>O.bell){ triEins(Math.random()<.5?'hund_gross':'hundebellen',nah,.85+Math.random()*.35); O.bell=t+Z.bell[0]+Math.random()*(Z.bell[1]-Z.bell[0]); } } else O.bell=null; }
  // Ritter am Anstieg: Hufe und Kettenhemd, wiehert, wenn er heran ist
  { const Rr=A.ritter, v=Rr&&Rr.G.visible?triFern(Rr.G.position,60):0; triLoop('ttHufe','hufe',an?v:0,dt); triLoop('ttKette','kettenhemd',an?v:0,dt); if(einmal('wieh',run&&v>.45)) triEins('wiehern',.8); }
  // Teufel: Sprung auf den Weg (dumpfer Aufprall) · Gabel und Tisch sausen heran und schlagen ein · reißt die Platte heraus · stolpert über das Steintor · Flügel in Runde 2 · glimmt und raucht, wenn er wütend ist
  if(K){ K.r.forEach((r,i)=>{ if(zu('spr'+i,r.tT+2.2)) triEins('sturz',1,.55); });
    for(const [k,w] of [['bw',K.bw[0]],['tw',K.tw]]) if(w!=null){ if(zu(k+'a',w+1.15)) triEins('peitsche',.9,.6); if(zu(k+'b',w+3.2)) triEins('sturz',k==='tw'?1:.6,k==='tw'?.5:.9); }
    if(zu('rip',K.rip)) triEins('sturz',1,.45); if(K.r[1].tA!=null&&zu('flg',K.r[1].tA)) triEins('fluegel',1,.6); }
  if(D){ if(D.trip!=null&&zu('tor',D.trip+TF_STURZ.fall-.2)) triEins('sturz',1,.5); triLoop('ttGlut','feuerknistern',an&&D.trip!=null&&D.G.visible?.6*triFern(D.G.position,50):0,dt); }
  // nach Flucht 1 heult ein Wolf · Grillen im Abendlicht (zweite Hälfte des Ausfahrens)
  if(a1) zu('wolf',a1.t0+40)&&triEins('wolfsgehaeul',.8);
  triLoop('ttGrillen','grillen',an&&run&&au?.8*bSm((rt-au.t0-au.dur*.4)/30):0,dt); }
