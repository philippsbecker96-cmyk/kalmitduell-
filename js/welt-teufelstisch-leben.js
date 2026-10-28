/* ================= Teufelstisch (Kampagne, Mission 2) – Friedel und Leben am Weg =================
   Friedel fährt von Anfang an links neben dir mit (Modell friedelModell aus welt-trifels.js, ohne Sack), hinten auf dem Holzrad ein Haufen Wurst und Fleisch
   von den zehn Gulden aus der Wette, eine Wurstkette baumelt heraus (ttWurstladung: einzeln, die Hunde am Anstieg schnappen Stück für Stück davon – TT_HUND, TT_KLAU, ttHundePlan, poseHunde).
   Sprüche (Platzhalter) mit Zeiten und Sprecher: ttSagPlan (Erzählung, Hunde, Begegnungen, vor dem Ducken, Dreizack-Piekser; Steintor sobald der Teufel stürzt).
   Am Anstieg Begegnungen (TT_BEG): Dorfbewohner kommt entgegen, Ritter überholt (buildBegegnungen/poseBegegnungen). Vor dem Ducken die Idylle (TT_IDYLL): Seitenweg zum Jungfernsprung mit Wegweiser, Blumen, Familie (buildIdylle/poseIdylle).
   Erzählt im Einfahren (TT_TXT), danach das Gedicht vom Teufelstisch (TT_GEDICHT, ttGedichtPlan, Element #ttGedicht), duckt sich beim Anschleichen und fährt dann hinter dir am rechten Wegrand. Teufelstisch als Fernbild vom Tal aus: A.fern (TT_FERN) */

// Friedels Sprüche: [s nach dem Start, Dauer, Text] – PLATZHALTER, Texte schreibt der Nutzer
const TT_TXT={hunde:{sehen:'[PLATZHALTER] Oh weia … guck mol do im Gebüsch. Die gucke awwer hungrich …', start:'[PLATZHALTER] Oh nee – die Kläffer vum Dorf! Die rieche mei Worscht!', klau:['[PLATZHALTER] He! Gebb des her!','[PLATZHALTER] Net de Speck!!','[PLATZHALTER] Mei scheen Fleeschworscht!','[PLATZHALTER] Mei Schinke! Ihr Bagaasch!','[PLATZHALTER] Hört uff! Ich hab doch nix mehr!'],
    biss:['[PLATZHALTER] Aua! Der beißt mich in die Wad!','[PLATZHALTER] Loss los, du Mistvieh!','[PLATZHALTER] Schon widder in die Wad!'], letzt:'[PLATZHALTER] Mei letscht Worscht!!! … Jetzt is alles fort.',
    zieh:['[PLATZHALTER] He! Der hängt an mei Worschtkett! Loss los, du Mistvieh!','[PLATZHALTER] Der loss sich ziehe wie de Graf in de Kutsch!','[PLATZHALTER] Do – jetzt is se gerisse. Verschluck dich dra!'], // Tauziehen: Beginn, Mitte, Kette reißt
    katze:['[PLATZHALTER] Kschtt! Ihr Dreckskäärle! Losst mei Katz in Ruh!','[PLATZHALTER] Merci, Fraa! Haue Se nur feschd druff!']}, // [Bäuerin, Friedel]
  verrat:'[PLATZHALTER] Mmmh … so en Schoppe unn e Dreierlei, des hätt ich jetzt aach gern …', // kurz vor „Ertappt“ – dadurch merkt der Teufel euch
  wetter:['[PLATZHALTER] Guck emol, die Sunn kummt raus! Der Deiwel hot des Sauwetter mitgenomme.','[PLATZHALTER] Hm … des gfallt mer gar net, wie des do hinne widder zuzieht.','[PLATZHALTER] Do kummt’s widder runner! Wie aus Kiwwele!'], // Pause nach Flucht 1: klart auf, zieht zu, nach der Abzweigung
  duck:'[PLATZHALTER] Do vorne geht’s zum Jungfernsprung – awwer des is en Umweg. Der Deiwel entdeckt uns doch eh net. Ich wääß, wie mer des mache: Mir mache uns halt klä!',
  gabel:'[PLATZHALTER] Hoho – vorbei! Zum Glück kann der net ziele mit seim Schoppe im Kopp!',
  bauer:['[PLATZHALTER] Ei Friedel! Fütterscht du jetzt die Dorfköter? Do bleibt jo nix mehr fer dich!','[PLATZHALTER] Halt die Gosch, Schorsch, unn hilf mer liewer!','[PLATZHALTER] Hä hä … Worschtfriedel!'], // [Bauer, Friedel, Bauer]
  ritter:['[PLATZHALTER] Hoho! Ein Bauerntölpel auf einem Holzgestell, gejagt von Kötern! Was für ein Anblick!','[PLATZHALTER] Macht Platz, Gesindel – ein Ritter hat es eilig!','[PLATZHALTER] Der hot gut lache, der hockt jo uff\'m Gaul!'], // [Ritter, Ritter, Friedel]
  rechts:'[PLATZHALTER] Do misse mer awwer werklich rechts! Do schwör ich druff – bei allem, was mer heilich is!', schwoer:'[PLATZHALTER] …ich hätt’s schwöre könne.', // vor der Abzweigung „sicher rechts“ · wenn der Teufel wieder am Tisch steht
  tor:'[PLATZHALTER] Hoppla, Deiwel! Guck halt, wo de hiedappsch!', piek:['[PLATZHALTER] Auaaa! Mei Hinnerdeel! Du elendicher Sauhund!','[PLATZHALTER] Net schon widder!!! Ich kann jo bald nimmie hocke!'],
  erzaehl:[[79,9,'[PLATZHALTER] Ach, [name] – weescht, uff was ich mich am meischte freu? Uff de Saumage heit owend, mit Sauerkraut!'],[89,9,'[PLATZHALTER] Unn guck mol hinne uff mei Rad: Des reicht bis Weihnachte – wenn ich mer’s gut eiteil!']]}; // nach der Gasthaus-Szene und der Tafel
// Gedicht im Einfahren (vom Nutzer): „Der Teufelstisch“ von Johann Martin Jäger alias Fritz Claus (1853–1923), 1884, gemeinfrei – 11 Strophen, jede Strophe steht ganz (alle Reime auf einmal), wörtliche Rede kursiv
const TT_GEDICHT=[['Im Kaltenbacher Tale','Ein Tisch von Felsen steht.','Dort saß der Teufel beim Mahle.','Hört, wie die Sage geht:'],
  ['Einst schritt in jenem Walde','Durch nächt’ges Dunkel schnell','Hinauf die Bergeshalde','Ein finsterer Gesell.'],
  ['Hell lodert in seinen Blicken','Unheimlich wilde Hast.','Nun will er sich erquicken,','Er schaut nach guter Rast.'],
  ['Umsonst! Kein Stein zum Sitzen,','Kein Tisch zum nächt’gen Mahl.','Vor Zorn seine Augen blitzen','Hin über Berg und Tal.'],
  ['Da – wie mit Blitzesschnelle','Packt jetzt zwei Felsen frisch','Der grimmige Geselle','Und stellt sie auf als Tisch.'],
  ['Nachdem er dran gegessen,','Ging durch die Nacht er fort.','Den Tisch, wo er gesessen,','Den ließ er einfach dort.'],
  ['Das war ein ängstlich Schauen','Des Morgens drunten im Tal!','Ein jeder sprach mit Grauen:','<i>„Dort hielt der Teufel Mahl!“</i>'],
  ['Nur einer voller Zweifel','Die andern hell verlacht:','<i>„Ich geh“</i>, spricht er, <i>„zum Teufel</i>','<i>Zum Mahle dort heut Nacht!“</i>'],
  ['Man warnt ihn in der Runde,','Er lacht und geht. Vom Turm','Tönt laut die zwölfte Stunde –','Da! – Welch ein Wind! Ein Sturm?'],
  ['Und jetzt? – Was ist geschehen?','Welch grässlicher Todesschrei!','Entsetzt die Lauscher stehen:','<i>„Mit dem dort ist’s vorbei!“</i>'],
  ['Der Keckste nimmer weilte','Vorm Dorfe länger draus;','Er schlug ein Kreuz und eilte','Leis schaudernd fort nach Haus.']];
const TT_GED={nach:3, titel:6, pause:1.5, aus:.9, bis:22}; // beginnt so viele s nach Friedels Erzählung, Titel s, Pause zwischen den Strophen, Ausblenden vor jedem Wechsel (s) – endet so viele s vor dem Ende des Einfahrens (dann sieht man die Hunde im Gebüsch)
// Zeitplan des Gedichts [Beginn, Ende, HTML] aus dem Workout: zwischen Friedels Erzählung und dem Ende des Einfahrens
function ttGedichtPlan(){ const S=race.woSegs||[], e=S.find(s=>s.label==='Einfahren'); if(!e) return []; const Z=TT_GED, E=TT_TXT.erzaehl[TT_TXT.erzaehl.length-1], a=E[0]+E[1]+Z.nach, b=e.t0+e.dur-Z.bis, n=TT_GEDICHT.length;
  const p=(b-a-Z.titel-n*Z.pause)/n, L=[[a,a+Z.titel,'Der Teufelstisch<small>Fritz Claus, 1884</small>']]; let t=a+Z.titel;
  for(const st of TT_GEDICHT){ L.push([t,t+p,st.join('<br>')]); t+=p+Z.pause; } return p>8?L:[]; } // zu wenig Zeit: kein Gedicht
const TT_FERN={sicht:520, aus:300};
const TT_BEG={bauer:[2,15], ritter:[7,18], vR:2.6, vB:1.2}; // Begegnungen am Anstieg: [nach Klau Nr., s danach] – Dorfbewohner kommt entgegen, Ritter überholt · Tempo Ritter (m/s schneller als du), Bauer (m/s)
const TT_BOGEN={r:110, b:3.2, weit:1300, dreh:.15, tief:-70, sicht:[-260,200], kam:[-28,4,11]}; // Regenbogen (klein, weit hinten rechts am Horizont): Radius, Bandbreite, m vom Seitenweg aus, Drehung nach rechts gegen den Seitenweg (rad), Höhe des Mittelpunkts unter der Abzweigung · sichtbar von … bis m um den Wegweiser · Kamera: ab m vor dem Wegweiser, s aufs Schild, s auf Familie und Regenbogen (vom Nutzer: länger, Platz für fröhliche Musik, Kinderlachen, Vögel)
const TT_IDYLL={zeit:26, winkel:.9, n:32, kurve:.012, blumen:900, vor:70, nach:90, hang:{tief:32, steil:.3, mitte:40, lang:70, rand:50}, wald:1300, tief:170, schneise:520, breit:14, weit:90}; // Idylle vor dem Ducken (vom Nutzer): so viele s vor dem Ducken am Wegweiser (ab dort Schotter, schmaler Weg) · Seitenweg nach rechts (Winkel, Stücke à 4 m, Drehung je Stück; vom Nutzer: man sieht, wie er ins Tal hinunterführt) Richtung Jungfernsprung mit Wegweiser, Blumen am Wegrand (Anzahl, m davor/danach), Familie spaziert · Hang rechts hinunter (m tief, Gefälle, Mitte/halbe Länge/Übergang in m entlang des Wegs) · sehr dichter Wald im Zwickel (Versuche, m tief; vom Nutzer: trennt den Weg nach Dahn optisch vom Weg zum Teufelstisch) · Schneise vom Wegweiser zum Regenbogen (Länge, halbe Breite vorn, so viel breiter hinten)
const TT_TAL={tief:195, lang:440, links:.38, rechts:.6, wRand:.3, bis:760, rand:120, see:{at:[450,.08], rx:150, rz:75}, dorf:{at:[650,.3], r:60, n:12}, bogen:.2, umland:.85}; // Fernblick vom Wegweiser ins Tal (vom Nutzer: kein Bergrücken, See, Dorf dahinter, Regenbogen am Horizont): Gelände fällt so viele m ab (über so viele m), Sektor links/rechts der Blickrichtung (rad) und Übergang, bis so weit (m) und Übergang · See [m, Winkel], Halbachsen quer/längs zum Blick · Dorf [m, Winkel], Radius, Häuser · Regenbogen so viel rechts der Blickrichtung · Umland-Kuppen in Blickrichtung so viel flacher (buildBurgUmland)
// Straßenhunde am Anstieg (vom Nutzer): verfolgen euch die Serpentinen hinauf, schnappen nach und nach Friedels Wurst und Fleisch, beißen ihn in die Wade – in der letzten Sekunde die letzte Wurst, dann ziehen sie ab
const TT_HUND={vor:40, nach:1.2, frei:12, ab:60}; // erster Klau so viele s nach Beginn des Anstiegs · letzter so viele s vor seinem Ende · s, die ein Hund mit der Beute zurückbleibt · m hinter dir, ab denen sie am Ende verschwinden
const TT_KLAU=[['k',4],['t',2],['t',1],['k',2],['t',3],['t',7],['t',4],['t',0],['k',0],['t',8],['t',5],['t',6]]; // Reihenfolge: k = Wurstkette ab Glied i, t = teile[i] (ttWurstladung) – zuletzt eine Wurst, dann ist der Gepäckträger leer
const TT_HUND_PL=[[-6,1.5],[-3.5,2.6],[-1,1.6],[1.5,2.4]]; // Plätze im Gebüsch rechts am Wegrand: [m zum Beginn des Anstiegs, m neben dem Wegrand] – sitzt, steht und schnuppert, liegt, sitzt und leckt sich das Maul
const TT_HUND_FORM=[[-1.7,-.5],[-2.7,.55],[-3.6,-1],[-1.2,.95]], TT_HUND_FELL=[['#7a5a3a','#5a4028'],['#6a6660','#4a4642'],['#2a2622','#e8e0d0'],['#b08a5a','#8a6a40']]; // Platz [m hinter Friedel, m neben ihm] · Fell
const TT_HUND_SZ=[['quer',25],['sturz',75],['busch',120],['quer',185],['sturz',250],['busch',330],['quer',400],['busch',470],['sturz',530]], TT_HUND_DAUER={quer:7,sturz:6,busch:22}, TT_HUND_KEHRE=[0,2]; // Zwischenszenen s nach Beginn des Anstiegs (quer = flitzt von Rand zu Rand, sturz = überschlägt sich über den Wegrand, busch = verschwindet im Gebüsch und wartet weiter vorn) · Kehren (Nr. am Anstieg), in denen ein Hund den Hang hinauf abkürzt
function ttHundePlan(){ const S=race.woSegs||[], a=S.find(s=>s.label==='Anstieg'); if(!a) return null; const Z=TT_HUND, t0=a.t0, t1=a.t0+a.dur, n=TT_KLAU.length, dt=(t1-Z.nach-(t0+Z.vor))/(n-1), h=TT_HUND_FORM.length;
  const klau=TT_KLAU.map((x,k)=>({t:t0+Z.vor+k*dt, k, h:k%h})), biss=[1.5,4.5,8.5].map((x,j)=>({t:t0+Z.vor+x*dt, h:(j+2)%h})), ende=klau[n-1].t+.9, sz=[];
  const frei=(j,von,bis)=>!klau.some(e=>e.h===j&&bis>e.t-4&&von<e.t+Z.frei)&&!biss.some(e=>e.h===j&&bis>e.t-3&&von<e.t+3)&&!sz.some(e=>e.h===j&&bis>e.t-2&&von<e.t+e.dur+2);
  const Z2=ttTierePlan(klau,frei,sz,dt); // Tauziehen, Katze mit Bäuerin (welt-teufelstisch-tiere.js) – zuerst, damit die übrigen Szenen ausweichen
  TT_HUND_SZ.forEach(([art,s],k)=>{ const t=t0+s, dur=TT_HUND_DAUER[art]; if(t+dur>ende-5) return; for(let i=0;i<h;i++){ const j=(k+i)%h; if(frei(j,t,t+dur)){ sz.push({art,t,dur,h:j,s:k%2?1:-1}); return; } } }); // s: Seite (+1 = rechts)
  return {t0, t1, klau, biss, ende, sz, frei, kehren:ttKehren(), ...Z2}; }
// Kehren am Anstieg (Richtung dreht sich um mehr als 115°), ohne Felsen auf der Abkürzung
function ttKehren(){ const T=R.tt, K=[]; let p=headingAt(R,T.an[0]), a=null, sum=0;
  for(let d=T.an[0]; d<T.an[1]; d+=5){ const hd=headingAt(R,d), dh=Math.atan2(Math.sin(hd-p),Math.cos(hd-p)); p=hd; if(Math.abs(dh)>.01){ if(a==null){ a=d; sum=0; } sum+=dh; } else if(a!=null){ if(Math.abs(sum)>2) K.push({d1:a-5, d2:d}); a=null; } }
  return K.filter((k,i)=>{ if(!TT_HUND_KEHRE.includes(i)) return false; const A=wegPos(k.d1,0), B=wegPos(k.d2,0); for(let f=0;f<=1;f+=.05){ const x=A.x+(B.x-A.x)*f, z=A.z+(B.z-A.z)*f; if(T.felsen.some(o=>Math.hypot(o.x-x,o.y-z)<o.r+1.5)) return false; } return true; }); }
// Hund (lokal +z nach vorn, Pfoten auf y=0): magerer Streuner mit tiefer Brust und schmaler Taille, langer Schnauze, hängender Zunge, Ohren je nach Hund (Schlapp-, Knick-, Stehohren), Beine mit Gelenk und Pfoten, Schwanz geringelt/buschig/eingezogen
const TT_HUND_ART=[{fell:'#7a5a3a',ab:'#efe6d6',ohr:'schlapp',sw:'ringel',latz:1},{fell:'#6a6660',ab:'#24201c',ohr:'steh',sw:'busch',sattel:1},{fell:'#efe8dc',ab:'#2a2622',ohr:'schlapp',sw:'ein',flecken:1},{fell:'#b8904e',ab:'#3a2a1a',ohr:'knick',sw:'ringel',maske:1}];
function ttHund(c,q){ const H=TT_HUND_ART[c%TT_HUND_ART.length], f=lam(H.fell), f2=lam(H.ab), schw=lam('#151210'), G=new THREE.Group(), K=new THREE.Group(); G.add(K); G.userData.ohneBoden=true;
  const add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, kug=(P,r,m,x,y,z,sx,sy,sz)=>{ const o=add(P,new THREE.SphereGeometry(r,10,8),m,x,y,z); o.scale.set(sx,sy,sz); return o; }, piv=(P,x,y,z)=>{ const g=new THREE.Group(); g.position.set(x,y,z); P.add(g); return g; };
  kug(K,.17,f,0,.6,.16,.72,.95,1.05); kug(K,.12,f,0,.6,-.2,.66,.72,1.25); kug(K,.1,f,0,.62,-.02,.62,.7,1.2); // tiefe Brust, schmale Taille, Hüfte
  for(const s of [-1,1]) for(let i=0;i<3;i++) add(K,new THREE.BoxGeometry(.01,.11,.018),f2,s*.118,.6-.01*i,.12-i*.06).rotation.z=s*.12; // Rippen (mager)
  if(H.latz) kug(K,.09,f2,0,.6,.3,.75,1,.5); if(H.sattel) kug(K,.13,f2,0,.7,-.08,.8,.4,1.5); if(H.flecken) for(const [x,y,z] of [[.1,.66,.1],[-.09,.62,-.18],[.04,.72,-.05]]) kug(K,.06,f2,x,y,z,.6,.8,1); // Abzeichen
  const hals=add(K,new THREE.CylinderGeometry(.06,.085,.22,8),f,0,.75,.3); hals.rotation.x=.75;
  const ko=piv(K,0,.84,.39); kug(ko,.085,f,0,.02,0,.9,.85,1); const sn=add(ko,new THREE.CylinderGeometry(.032,.048,.16,8),H.maske?f2:f,0,-.015,.11); sn.rotation.x=Math.PI/2; kug(ko,.028,schw,0,0,.195,1.1,.85,.8); // Kopf, lange Schnauze, dicke Nase
  for(const s of [-1,1]){ kug(ko,.012,schw,s*.045,.035,.065,1,1,.6);
    const o=piv(ko,s*.06,.07,-.02); if(H.ohr==='schlapp'){ add(o,new THREE.BoxGeometry(.035,.11,.065),f2,s*.01,-.05,0); o.rotation.z=s*.2; } else if(H.ohr==='steh'){ add(o,new THREE.ConeGeometry(.035,.11,4),f,0,.05,0); o.rotation.z=-s*.15; } else { add(o,new THREE.ConeGeometry(.035,.06,4),f,0,.03,0); const k=piv(o,0,.055,0); k.rotation.x=1.4; add(k,new THREE.ConeGeometry(.026,.05,4),f2,0,.025,0); o.rotation.z=-s*.1; } // Schlapp-, Steh-, Knickohren
    (ko.ohren||(ko.ohren=[])).push(o); }
  const maul=piv(ko,0,-.055,.05); add(maul,new THREE.BoxGeometry(.06,.022,.14),H.maske?f2:f,0,0,.06); const zu=add(maul,new THREE.BoxGeometry(.034,.006,.09),lam('#d86a7a'),0,-.012,.13); zu.rotation.x=.7; // Unterkiefer, hängende Zunge
  for(const s of [-1,1]) add(maul,new THREE.ConeGeometry(.007,.025,4),lam('#f2ecdc'),s*.02,.02,.11); // Fangzähne
  const bein=(x,y,z,hinten)=>{ const o=piv(K,x,y,z); if(hinten) kug(o,.06,f,0,-.04,0,.8,1.3,1.1); add(o,new THREE.CylinderGeometry(.03,.024,.26,6),f,0,-.13,0); const u=piv(o,0,-.26,0); add(u,new THREE.CylinderGeometry(.022,.018,.24,6),f,0,-.12,0);
    kug(u,.034,H.latz||H.flecken?lam(H.ab):f,0,-.245,.025,1,.5,1.45); return {o,u,hinten}; }; // Ober- und Unterschenkel, breite Pfote
  const beine=[bein(.075,.55,.24),bein(-.075,.55,.24),bein(.07,.56,-.26,1),bein(-.07,.56,-.26,1)];
  let sw=piv(K,0,.66,-.36), sws=[]; for(let i=0;i<4;i++){ add(sw,new THREE.CylinderGeometry(.016-i*.002,(H.sw==='busch'?.034:.022)-i*.003,.09,6),f,0,.045,0); sws.push(sw); const n=piv(sw,0,.09,0); sw=n; } // Schwanz in Gliedern
  G.scale.setScalar(.95+q()*.18); world.add(G); return {G,K,ko,maul,zu,beine,sws,art:H,d:null,u:0,v:0,phi:q()*6}; }
// Sprüche Friedels mit Zeiten [s, Dauer, Text]: Erzählung, Hunde, Dreizack-Piekser (das Steintor kommt dazu, sobald der Teufel stürzt)
function ttSagPlan(){ const L=[...TT_TXT.erzaehl], P=ttHundePlan(), D=anim.tt.teufel, K=D&&D.sk, X=TT_TXT;
  if(P){ L.push([P.t0-12,7,X.hunde.sehen],[P.t0+6,7,X.hunde.start]); [0,2,4,7,9].forEach((k,i)=>L.push([P.klau[k].t+1,5,X.hunde.klau[i]])); P.biss.forEach((b,i)=>L.push([b.t+.2,5,X.hunde.biss[i]])); L.push([P.ende+.2,7,X.hunde.letzt]); }
  if(K) K.dz.slice(0,2).forEach(([a],i)=>L.push([a+TT_PIEK.stich+.1,5,X.piek[i]]));
  const B=ttBegZeit(P); if(B){ L.push([B.tB-7,5,X.bauer[0],'bauer'],[B.tB-.5,4,X.bauer[1]],[B.tB+4,4,X.bauer[2],'bauer'],[B.tR-3,5,X.ritter[0],'ritter'],[B.tR+3,4,X.ritter[1],'ritter'],[B.tR+8,5,X.ritter[2]]); }
  if(P&&P.zieh){ const Z=P.zieh; L.push([Z.t+1,5,X.hunde.zieh[0]],[Z.t+Z.dur*.5,5,X.hunde.zieh[1]],[Z.t+Z.dur+.3,5,X.hunde.zieh[2]]); } if(P&&P.katze){ const tk=P.katze.t; L.push([tk-1,5,X.hunde.katze[0],'baeuerin'],[tk+5,5,X.hunde.katze[1]]); }
  const S=race.woSegs||[], e=S.find(s=>s.label==='Ertappt'), ab=S.find(s=>s.label==='Abgeschüttelt'); if(e) L.push([e.t0-TT_DUCK-TT_IDYLL.zeit-15,8,X.duck],[e.t0-TF_MERK.vor,TF_MERK.vor,X.verrat]);
  if(ab&&R.tt.tEcke){ const Z=TT_PAUSE, tE=R.tt.tEcke, kl=Math.max(ab.t0+20,Math.min(ab.t0+Z.klar,tE-30)); L.push([ab.t0+(kl-ab.t0)*.6,6,X.wetter[0]],[kl+(tE-kl)*.55,6,X.wetter[1]]); if(!K||tE+19<K.r[1].tA) L.push([tE+14,5,X.wetter[2]]); } // Wetter in der Pause (geplante Zeiten)
  if(K&&K.bw[0]!=null) L.push([K.bw[0]+3.6,5,X.gabel]); const T=R.tt; if(T.tEcke) L.push([T.tEcke-8,7,X.rechts]); if(K&&K.r[1].tA) L.push([K.r[1].tA+.8,4,X.schwoer]); return L; } // Friedel vor der Abzweigung zum Jungfernsprung (am Wegweiser bist du e.t0−TT_DUCK−TT_IDYLL.zeit) · nach dem Gabelwurf · vor der Abzweigung „sicher rechts“ (am Beginn der letzten Kurve, geplante Zeit) · wenn der Teufel am Tisch ankommt
// Zeiten der Begegnungen am Anstieg (zwischen den Klau-Szenen der Hunde): tB Dorfbewohner bei dir, tR Ritter neben dir
function ttBegZeit(P){ if(!P) return null; const Z=TT_BEG, k=(n,s)=>P.klau[Math.min(n,P.klau.length-1)].t+s; return {tB:k(...Z.bauer), tR:k(...Z.ritter)}; } // Fernbild des Teufelstischs: so groß, als stünde er 520 m entfernt (etwas kleiner als am Ende von Mission 1, vom Nutzer gewünscht) · blendet auf den letzten 300 m vor dem Anstieg aus

// ---- Aufbau (aus buildTeufelstisch) ----
function buildTeufelstischLeben(){ const A=anim.tt, T=R.tt;
  { const F=friedelModell(); F.sack.visible=F.raus.G.visible=false; F.r.lane=null; A.friedel={...F, d:0, crank:0, blase:triBlase(), wurst:ttWurstladung(F.r)};
    const q=rng(321); A.hunde=[0,1,2,3].map(c=>ttHund(c,q)); const W=A.friedel.wurst; A.beute=TT_KLAU.map(([w,i],k)=>{ const o=(w==='k'?W.kette[i]:W.teile[i]).clone(true); o.position.set(0,0,0); o.rotation.set(0,0,0); o.visible=false; A.hunde[k%4].maul.add(o); return o; }); // Beute im Maul (Kopie)
    if(!document.getElementById('triSag')){ const el=document.createElement('div'); el.id='triSag'; document.body.appendChild(el); } } // Friedels Worte, wenn er nicht im Bild ist
  if(!document.getElementById('ttGedicht')){ const el=document.createElement('div'); el.id='ttGedicht'; document.body.appendChild(el); } // Gedicht oben mittig (über den Fahrern)
  buildBegegnungen(A); buildIdylle(A,T); sicher('Tiere',()=>buildTiere(A,T)); if(T.abzweig){ ttPfad(T.abzweig,TT_ABZW.w,.15); ttKiesel(T.abzweig,TT_ABZW.w,260); const P=T.abzweig, d=T.ecke+70; ttWegweiser(...T.abzSchild,[[P[P.length-1],'Dahn'],[posAt(R,d),'Teufelstisch']]); } // Abzweigung „sicher rechts“ vor Runde 2: Waldweg geradeaus, Kiesel, Wegweiser im Zwickel
  { const [tx,tz]=T.tischPos, c=new THREE.Color(), f=scene.fog?scene.fog.color:new THREE.Color('#c8d4dc'), F=tischSilhouette('#'+c.set('#6a3a2c').lerp(f,.45).getHexString(),'#'+c.set('#58302a').lerp(f,.45).getHexString(),true); // dunstig wie in der Ferne
    F.position.set(tx,bodenY(tx,tz)-2,tz); F.rotation.y=.4; world.add(F); A.fern=F; } }

// Wurst und Fleisch hinten auf dem Holzrad (lokal in r.body: +x nach vorn, y nach oben), Wurstkette hängt nach hinten heraus und baumelt
function ttWurstladung(r){ const M=c=>lam(c), G=new THREE.Group(); G.position.set(-.56,.8,0); r.body.add(G); const teile=[], kette=[];
  const add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; }, worscht=(P,l,d,c,x,y,z)=>{ const o=add(P,new THREE.SphereGeometry(d,8,6),M(c),x,y,z); o.scale.set(l/d/2,1,1); return o; };
  add(G,new THREE.BoxGeometry(.42,.03,.3),M('#6b4a32'),0,0,0); for(const z of [-.14,.14]) add(G,new THREE.BoxGeometry(.03,.25,.03),M('#5a3e2a'),.18,-.12,z); // Gepäckträger aus Holz
  const sw=add(G,new THREE.SphereGeometry(.11,10,8),M('#b0625a'),-.04,.1,.04); sw.scale.set(1.5,.8,1); teile.push(sw); add(sw,new THREE.CylinderGeometry(.012,.012,.12,5),M('#efe6d6'),.13,0,0).rotation.z=Math.PI/2; // Schinken mit Knochen
  { const sp=add(G,new THREE.BoxGeometry(.24,.06,.14),M('#e8c8b8'),.04,.05,-.09); sp.rotation.y=.2; for(const y of [-.015,.015]) add(sp,new THREE.BoxGeometry(.245,.008,.145),M('#c86a5a'),0,y,0); teile.push(sp); } // Speckseite
  for(const [x,y,z,c,ry] of [[.07,.1,.08,'#8a4a2a',.3],[-.08,.17,-.04,'#a0603a',-.5],[.02,.19,.03,'#c8a080',1.2],[.1,.16,-.06,'#7a3a22',-.2],[-.12,.08,-.11,'#b08a6a',.8]]){ const w=worscht(G,.24,.035,c,x,y,z); w.rotation.y=ry; teile.push(w); } // Brat-, Leber-, Blutwurst
  { const lr=add(G,new THREE.TorusGeometry(.07,.025,6,12),M('#9a6a4a'),-.02,.25,-.02); lr.rotation.x=Math.PI/2; teile.push(lr); } // Fleischwurstring obendrauf
  { const sm=add(G,new THREE.SphereGeometry(.07,10,8),M('#c89070'),.12,.23,.07); sm.scale.set(1.2,.9,.95); teile.push(sm); } // Saumagen
  let P=new THREE.Group(); P.position.set(-.2,.08,.1); G.add(P); for(let i=0;i<7;i++){ const g=new THREE.Group(); P.add(g); worscht(g,.1,.022,i%2?'#a0583a':'#94502e',0,-.05,0).rotation.z=Math.PI/2; add(g,new THREE.SphereGeometry(.008,4,3),M('#e8dcc0'),0,-.1,0); kette.push(g); const n=new THREE.Group(); n.position.y=-.1; g.add(n); P=n; } // Wurstkette: Glieder mit Abbindern
  return {G,teile,kette}; }

// ---- Bewegung (jeden Frame, aus poseTeufelstisch) ----
function poseTeufelstischLeben(dt){ const A=anim.tt, F=A.friedel; if(!F) return; const run=race.state==='run', rt=run?race.t:0, t=performance.now()/1000, lauf=run&&!race.paused?dt*simSpeed():0, ich=riders3d[myKey];
  // Friedel: links neben dir, beim Anschleichen geduckt hinter dir am rechten Rand (wie du), an der Gabel im Weg und beim Ritter weicht er nach links aus
  const gd=ttGeduckt(), aw=ttAusweich(me.d), ml=ich&&ich.lane!=null?ich.lane:0, H=roadW(R,me.d)/2-.5, uN=ml-1.25<-H?ml+1.25:ml-1.25, u=(uN+(ml-uN)*gd)*(1-aw)-H*aw, pk=ttPiekF(rt,12); let want=-1.3-2.2*gd, vmax=1.6; if(pk){ if(pk.y<TT_PIEK.stich) want=-1.3-(TT_PIEK.zurueck-1.3)*bSm(pk.y/3); else vmax=4; } // Dreizack 1 und 2: fällt zurück, wird gepiekst, strampelt nach vorn
  if(!run||Math.abs(F.d-me.d)>60){ F.d=me.d+want; F.r.lane=u; } // vor dem Start und nach Sprüngen im Testmodus gleich neben dir
  if(run){ const vr=clampN((want-(F.d-me.d))*.6,-2.6,vmax), fv=Math.max(0,me.v+vr); F.d+=fv*lauf; F.crank+=fv>.3?75/60*2*Math.PI*lauf:0; }
  F.r.lane=F.r.lane==null?u:F.r.lane+(u-F.r.lane)*Math.min(1,dt*2); F.r.ae=gd; putRider(F.r,F.d,F.crank); if(pk&&pk.y>=TT_PIEK.stich&&pk.y<TT_PIEK.stich+.6) F.r.g.position.y+=.45*Math.sin(Math.PI*(pk.y-TT_PIEK.stich)/.6); // hüpft vom Sattel
  { const v=Math.min(1,me.v/6); F.wurst.kette.forEach((g,i)=>{ g.rotation.z=(.5+.15*v)*(i?.2:1)+.12*v*Math.sin(t*5.5+i*.8); g.rotation.x=.18*v*Math.sin(t*4.1+i*1.1); }); } // Wurstkette baumelt nach hinten
  // Sprechblase über Friedel, sonst unten im Bild
  if(run&&(A.sagS!==race.woSegs||A.sagK!==(A.teufel&&A.teufel.sk))){ A.sag=ttSagPlan(); A.sagS=race.woSegs; A.sagK=A.teufel&&A.teufel.sk; }
  const Tf=A.teufel, tor=Tf&&Tf.trip!=null?[Tf.trip+TF_STURZ.fall+.8,6,TT_TXT.tor]:null, akt=run?[...(tor?[tor]:[]),...(A.sag||[])].filter(([a,d])=>rt>=a&&rt<a+d):[], el=document.getElementById('triSag'); let unten='';
  for(const [wer,name,G,B,hy] of [['friedel','Friedel',F.r.g,F.blase,2.9],['bauer','Schorsch',A.bauer.m.G,A.bauer.blase,2.4],['ritter','Ritter',A.ritter.G,A.ritter.blase,3.4],...(A.katze?[['baeuerin','Bäuerin',A.katze.frau.m.G,A.katze.blase,2.4]]:[])]){ // Sprechblase über dem Sprecher, sonst unten im Bild
    const s=akt.find(x=>(x[3]||'friedel')===wer), txt=s?kText(s[2]):null, p=G.position.clone(); p.y+=hy; let im=false;
    if(txt&&G.visible){ const q=p.clone().project(camera); im=q.z<1&&Math.abs(q.x)<.9&&Math.abs(q.y)<.9&&camera.position.distanceTo(p)<45; triSag(wer,txt); }
    B.visible=!!txt&&im; if(B.visible){ triBlaseText(B,txt); triBlaseUeber(B,p,ich&&ich.g); } if(txt&&!im&&!unten) unten=name+': '+txt; }
  if(el){ if(unten){ el.textContent=unten; el.classList.add('zeig'); } else el.classList.remove('zeig'); }
  poseBegegnungen(dt,rt,run,lauf,t); poseIdylle(rt,run,t);
  poseHunde(dt,rt,run,lauf,t);
  // Gedicht: dezent unten mittig, weich ein- und ausblenden (Text wechselt, während es ausgeblendet ist)
  { const G=document.getElementById('ttGedicht'); if(G){ if(run&&A.gedS!==race.woSegs){ A.ged=ttGedichtPlan(); A.gedS=race.woSegs; } const z=run&&!race.paused&&A.ged?A.ged.find(([a,b])=>rt>=a&&rt<b):null;
    if(z&&A.gedZ!==z){ A.gedZ=z; G.innerHTML=z[2]; } G.classList.toggle('zeig',!!z&&rt<z[1]-TT_GED.aus); } }
  // Fernbild des Teufelstischs: bleibt so groß wie aus 520 m, blendet vor dem Anstieg aus (dann ist der echte Tisch oben auf dem Plateau zu sehen)
  const Fe=A.fern; if(Fe){ const w=1-bSm((me.d-(R.tt.an[0]-TT_FERN.aus))/TT_FERN.aus); Fe.visible=w>.01; if(Fe.visible){ const [tx,tz]=R.tt.tischPos, k=Math.max(1,Math.hypot(camera.position.x-tx,camera.position.z-tz)/TT_FERN.sicht); Fe.scale.setScalar(k); Fe.userData.mats.forEach(m=>m.opacity=w); } } }
// Hunde: sitzen rechts im Gebüsch und schauen euch entgegen, mit Beginn des Anstiegs springen sie nacheinander auf und rennen quer über den Weg Friedel hinterher,
// laufen im Galopp um sein Hinterrad, springen zum Gepäckträger und schnappen ein Stück (bleiben damit zurück), beißen ihn in die Wade, ziehen am Ende ab
// Dazwischen (TT_HUND_SZ): flitzen von Rand zu Rand über den Weg ins Gras, überschlagen sich über den Wegrand und rappeln sich auf, verschwinden im Gebüsch und warten weiter vorn, kürzen in Kehren den Hang hinauf ab und warten um die Ecke
function poseHunde(dt,rt,run,lauf,t){ const A=anim.tt, F=A.friedel, H=A.hunde, T=R.tt; if(!H||!T.hundePl) return; if(run&&A.hS!==race.woSegs){ A.hp=ttHundePlan(); A.hS=race.woSegs; } const P=run?A.hp:null, W=F.wurst, ich=riders3d[myKey];
  sicher('Tiere',()=>poseTiere(P,rt,run,t,dt));
  TT_KLAU.forEach(([w,i],k)=>{ const e=P&&P.klau[k]; (w==='k'?W.kette[i]:W.teile[i]).visible=!(e&&rt>=e.t+.9); A.beute[k].visible=!!e&&rt>=e.t+.9&&(rt<e.t+TT_HUND.frei||k===TT_KLAU.length-1); }); // Stück weg vom Gepäckträger, im Maul
  if(P&&rt<P.ende) for(const k of P.kehren){ if(k.los||F.d<k.d1-6||F.d>k.d1+10) continue; k.los=true; // ein freier Hund kürzt die Kehre ab
    const j=H.findIndex((h,j)=>h.d!=null&&!h.kz&&rt>P.t0+j*.9+3&&P.frei(j,rt,rt+40)); if(j<0) continue; const h=H[j]; h.kz={d2:k.d2, x0:h.G.position.x, z0:h.G.position.z, q:0}; }
  H.forEach((h,j)=>{ const pl=T.hundePl[j], los=P?P.t0+j*.9:1e9; h.G.rotation.order='YXZ'; h.G.rotation.z=0;
    if(P&&rt>P.ende+40){ h.G.visible=false; return; } h.G.visible=true;
    const blick=(x,z,w)=>{ if(ich) h.G.rotation.y=h.ry=tfWinkel(h.ry??h.G.rotation.y,Math.atan2(ich.g.position.x-x,ich.g.position.z-z),w); }; // schaut dir entgegen
    if(rt<los){ // wartet im Gebüsch: sitzt, steht und schnuppert, liegt, sitzt und leckt sich das Maul – schaut dir entgegen, wenn du nahst
      const p=wegPos(pl.d,pl.u), hd=headingAt(R,pl.d); h.G.position.set(p.x,bodenY(p.x,p.z),p.z); let ry=Math.PI/2-hd+Math.PI*.75; if(ich){ const dx=ich.g.position.x-p.x, dz=ich.g.position.z-p.z; if(Math.hypot(dx,dz)<45) ry=tfWinkel(ry,Math.atan2(dx,dz),.8); } h.G.rotation.y=h.ry=ry;
      const art=j===1?'steh':j===2?'lieg':'sitz'; tfHundHaltung(h,art,t,j); h.d=null; h.px=null; return; }
    const ab=rt>P.ende;
    if(h.kz&&(ab||F.d>h.kz.d2+20)) h.kz=null;
    if(h.kz){ const k=h.kz, B=wegPos(k.d2,0), L=Math.hypot(B.x-k.x0,B.z-k.z0); // Kehre: quer den Hang hinauf, wartet oben am Weg, bis ihr um die Ecke kommt
      if(k.q<L){ h.v=me.v+2.5; k.q=Math.min(L,k.q+h.v*lauf); const f=k.q/L, x=k.x0+(B.x-k.x0)*f, z=k.z0+(B.z-k.z0)*f; h.G.position.set(x,bodenY(x,z),z); h.G.rotation.y=h.ry=tfWinkel(h.ry??0,Math.atan2(B.x-k.x0,B.z-k.z0),Math.min(1,dt*6));
        h.vs=(h.vs??h.v)+(h.v-(h.vs??0))*Math.min(1,dt*2); h.phi+=h.vs/(h.vs<4?1.3:2.4)*2*Math.PI*lauf; tfHundLauf(h,Math.min(1,h.vs/3),t,j); }
      else { h.G.position.set(B.x,bodenY(B.x,B.z),B.z); blick(B.x,B.z,Math.min(1,dt*3)); h.v=h.vs=0; tfHundHaltung(h,'sitz',t,j); h.sws.forEach((s,i)=>{ if(!i) s.rotation.z=.6*Math.sin(t*12); }); } // wedelt
      if(k.q>=L&&F.d>=k.d2-4){ h.d=k.d2; h.u=0; h.kz=null; } h.px=h.G.position.x; h.pz=h.G.position.z; return; }
    if(ttZiehHund(h,j,P,rt,lauf,t,dt)) return; // Tauziehen an der Wurstkette
    const Fo=TT_HUND_FORM[j]; let td=F.d+Fo[0], tu=(F.r.lane||0)+Fo[1], spr=0, zerr=0, Hl=roadW(R,F.d)/2+.6, roll=0, hal=null, fest=false;
    const kl=P.klau.find(e=>e.h===j&&rt>=e.t-2.5&&rt<e.t+1.2), bi=P.biss.find(e=>e.h===j&&rt>=e.t-2&&rt<e.t+2.6), weg=P.klau.find(e=>e.h===j&&rt>=e.t+1.2&&rt<e.t+TT_HUND.frei);
    const kz=!kl&&!bi&&!weg&&!ab&&h.d!=null?ttKatzeZiel(j,P,rt):null, ep=!kl&&!bi&&!weg&&!kz&&!ab&&h.d!=null?P.sz.find(e=>e.h===j&&rt>=e.t&&rt<e.t+e.dur&&h.fertig!==e):null, es=ep?rt-ep.t:0;
    if(kl){ td=F.d-.75; tu=F.r.lane||0; const s=rt-(kl.t-.3); if(s>0&&s<1.2) spr=Math.sin(Math.PI*s/1.2)*.55; } // springt zum Gepäckträger
    else if(bi){ td=F.d-.15; tu=(F.r.lane||0)-.55; zerr=rt>=bi.t?1:0; } // beißt in die Wade und zerrt
    else if(weg) td=F.d-16-4*j; // bleibt mit der Beute zurück
    else if(kz){ td=kz.td; tu=kz.tu; Hl+=3; fest=true; h.v=clampN((td-h.d)*1.6,0,me.v+6); h.d+=h.v*lauf; h.u+=(tu-h.u)*Math.min(1,dt*2.5); if(h.v<.8) hal='bell'; } // rennt zur Katze und kläfft sie an
    else if(ep&&ep.art==='quer'){ Hl+=1.6; td=F.d+3+1.5*Math.sin(es*1.3); tu=-ep.s*Hl*Math.cos(Math.PI*es/3.5); } // flitzt vor euch von einem Wegrand zum anderen, über den Rand hinaus ins Gras und zurück
    else if(ep&&ep.art==='sturz'){ Hl+=2.2; if(es>.4&&es<3){ const f=Math.min(1,(es-.4)/1.1); roll=ep.s*2*Math.PI*f; spr=.45*(1-Math.cos(roll)); tu=ep.s*Hl; h.v=Math.max(0,h.v-9*dt); fest='d'; if(es>1.5) hal=es<2.4?'lieg':'steh'; } } // überschlägt sich, kugelt über den Wegrand die Böschung hinunter, bleibt kurz liegen, schüttelt sich und holt wieder auf
    else if(ep&&ep.art==='busch'){ Hl+=4; if(es<1.8){ td=F.d+4; tu=ep.s*Hl; } else { if(h.wE!==ep){ h.wE=ep; h.wd=F.d+me.v*5+32; } fest=true; h.d=h.wd; h.u=ep.s*(Hl-2.4); h.v=0; if(F.d<h.wd-28) h.G.visible=false; else hal='sitz'; if(F.d>=h.wd-2) h.fertig=ep; } } // verschwindet im Gebüsch, sitzt ein Stück weiter vorn am Wegrand und wartet auf euch
    if(h.d==null){ if(rt-los<3){ h.d=pl.d; h.u=pl.u; } else { h.d=td; h.u=tu; } h.v=0; } else if(!ab&&!fest&&Math.abs(h.d-td)>80){ h.d=td; h.u=tu; } // springt aus dem Gebüsch (nach Sprüngen im Testmodus gleich dabei)
    if(fest==='d') h.d+=h.v*lauf; else if(fest); else if(ab){ h.v=-7; h.d+=h.v*lauf; } else { h.v=clampN(me.v+(td-h.d)*1.4,0,me.v+6); h.d+=h.v*lauf; } // am Ende kehrt um und ab ins Dorf
    if(!kz) tu=ttUmFrau(h.d,tu,Hl); // Bogen um die Bäuerin mit dem Besen
    if(fest!==true) h.u+=(clampN(tu,-Hl,Hl)-h.u)*Math.min(1,dt*(roll?4:2.5)); if(ab&&h.d<me.d-TT_HUND.ab) h.G.visible=false; // quer über den Weg zu Friedel
    const p=wegPos(h.d,h.u), dx=p.x-(h.px??p.x), dz=p.z-(h.pz??p.z), sp=Math.hypot(dx,dz); h.G.position.set(p.x,bodenY(p.x,p.z)+spr,p.z); h.px=p.x; h.pz=p.z; // schaut in Laufrichtung (nach Sprüngen geradeaus)
    if(hal==='bell'){ const c=A.katze.G.position; h.G.rotation.y=h.ry=tfWinkel(h.ry??0,Math.atan2(c.x-p.x,c.z-p.z),Math.min(1,dt*6)); } else if(hal==='sitz') blick(p.x,p.z,Math.min(1,dt*4)); else if(sp>2) h.G.rotation.y=h.ry=Math.PI/2-p.h+(ab?Math.PI:0); else if(sp>.004&&!roll) h.G.rotation.y=h.ry=tfWinkel(h.ry??h.G.rotation.y,Math.atan2(dx,dz),Math.min(1,dt*8)); h.G.rotation.z=roll;
    h.vs=(h.vs??Math.abs(h.v))+(Math.abs(h.v)-(h.vs??0))*Math.min(1,dt*2); h.phi+=h.vs/(h.vs<4?1.3:2.4)*2*Math.PI*lauf;
    if(hal){ tfHundHaltung(h,hal,t,j); if(hal==='steh') h.K.rotation.z=.25*Math.sin(t*28); else h.K.rotation.z=0; } else { h.K.rotation.z=0; tfHundLauf(h,Math.min(1,h.vs/3),t,j); } // schüttelt sich nach dem Sturz
    h.ko.rotation.x=zerr?.3*Math.sin(t*20):h.ko.rotation.x; h.ko.rotation.y=zerr?.5*Math.sin(t*14):hal?h.ko.rotation.y:0; }); sicher('Tiere',()=>ttZiehKette(P,rt)); } // beim Zerren schüttelt er den Kopf · Tempo geglättet, Galopp mit langen Sprüngen (2,4 m), langsam im Trab
// Galopp: Vorder- und Hinterbeine greifen paarweise, der Rücken federt, Schlappohren wippen
function tfHundLauf(h,m,t,j){ const f=h.phi, s=Math.sin(f), K=h.K, trab=h.vs<4; K.rotation.x=(trab?.02:.05)*m*Math.sin(2*f); K.position.y=(trab?.015:.03)*m*Math.abs(Math.sin(f));
  h.beine.forEach((b,k)=>{ const v=trab?f+(k===0||k===3?0:Math.PI):b.hinten?f+Math.PI+(k%2)*.25:f+(k%2)*.25, sv=Math.sin(v), A=trab?.45:.6; b.o.rotation.x=(b.hinten?-.15:.05)-A*m*sv; b.u.rotation.x=b.hinten?.35+.35*m*Math.max(0,Math.sin(v+1.2)):.15+.55*m*Math.max(0,-Math.sin(v+1.2)); }); // Trab: diagonale Paare · Galopp: vorn und hinten paarweise
  h.ko.rotation.x=-.1+.06*m*s; h.ko.ohren.forEach(o=>o.rotation.x=h.art.ohr==='schlapp'?-.5*m*Math.sin(2*f):0); h.maul.rotation.x=.12+.1*m; h.zu.visible=true; tfHundSchwanz(h,t,j,m); }
function tfHundSchwanz(h,t,j,m){ const a=h.art.sw, w=Math.sin(t*(a==='ein'?4:11)+j); h.sws.forEach((s,k)=>{ s.rotation.x=a==='ringel'?(k?.55:-2.3):a==='busch'?(k?.12:-1.1+.2*m):(k?.15:2.5); s.rotation.z=k?0:(a==='ein'?.1:.45)*w; }); }
// Haltung im Gebüsch
function tfHundHaltung(h,art,t,j){ const K=h.K, B=h.beine, set=(k,o,u)=>{ B[k].o.rotation.x=o; B[k].u.rotation.x=u; };
  if(art==='sitz'){ K.rotation.x=-.55; K.position.y=0; for(const k of [0,1]) set(k,.55,0); for(const k of [2,3]) set(k,-1.25,2.1); }
  else if(art==='lieg'){ K.rotation.x=0; K.position.y=-.33; for(const k of [0,1]) set(k,-1.35,.1); for(const k of [2,3]) set(k,-1.3,2.3); }
  else { K.rotation.x=0; K.position.y=0; B.forEach(b=>{ b.o.rotation.x=b.hinten?-.15:.05; b.u.rotation.x=b.hinten?.35:.15; }); }
  if(art==='bell'){ K.position.y=.025*Math.abs(Math.sin(t*13+j)); h.ko.rotation.set(-.2,0,0); h.maul.rotation.x=.12+.3*Math.abs(Math.sin(t*13+j)); h.zu.visible=true; tfHundSchwanz(h,t,j,.8); return; } // kläfft die Katze an
  h.ko.rotation.x=art==='steh'?.35+.15*Math.sin(t*3):art==='lieg'?.15:-.1; h.ko.rotation.y=art==='steh'?.3*Math.sin(t*.9):0; h.ko.ohren.forEach(o=>o.rotation.x=0); // schnuppert am Boden
  const leck=j===3&&(t%4)<.6; h.maul.rotation.x=leck?.25:.05; h.zu.visible=leck||art==='steh'; h.zu.rotation.x=leck?-.4:.7; tfHundSchwanz(h,t,j,.3); } // leckt sich das Maul

// ---- Begegnungen am Anstieg (vom Nutzer): Dorfbewohner kommt euch entgegen und verspottet Friedel wegen seiner Wurst, ein leicht gerüsteter Ritter überholt und lacht euch aus ----
function buildBegegnungen(A){ const M=c=>lam(c), add=(P,g,m,x,y,z)=>{ const o=new THREE.Mesh(g,m); o.position.set(x,y,z); P.add(o); return o; };
  { const m=trMensch({kittel:'#6a5a3a',hose:'#3a3020',haar:'#c8c6be',bart:'#c8c6be'}); m.G.userData.ohneBoden=true; world.add(m.G); // alter Bauer mit Reisigbündel und Stock
    const r=new THREE.Group(); r.position.set(0,1.3,-.22); r.rotation.z=1.45; m.G.add(r); for(let i=0;i<9;i++) add(r,new THREE.CylinderGeometry(.018,.022,1.1,4),M(i%2?'#6b4a32':'#7a5a3a'),(i%3-1)*.05,0,(Math.floor(i/3)-1)*.05); add(r,new THREE.TorusGeometry(.1,.015,4,10),M('#4a3222'),0,0,0).rotation.y=Math.PI/2;
    add(m.arme[1],new THREE.CylinderGeometry(.018,.018,1.3,5),M('#5a3e2a'),0,-.62,.1); m.G.visible=false; A.bauer={m,blase:triBlase(),d:null}; }
  { const p=trPferd({fell:'#6e4a2c'}), m=trMensch({kittel:'#8a7046',aermel:'#6a5a3a',hose:'#3a3020',haar:'#4a3222',bart:'#4a3222',schuh:'#2e2218'}); trReiter(p,m); // leicht gerüstet: gesteppter Waffenrock, Kettenhaube, Rundschild, Schwert, Pferd ohne Schabracke
    const kt=M('#8a8d93'), hb=add(m.kopf,new THREE.SphereGeometry(.145,12,9,0,Math.PI*2,0,Math.PI*.62),kt,0,.12,-.03); add(m.kopf,new THREE.CylinderGeometry(.13,.17,.14,10,1,true),kt,0,-.02,0);
    add(m.G,new THREE.BoxGeometry(.44,.5,.3),M('#8a6a2e'),0,1.2,0); add(m.G,new THREE.BoxGeometry(.12,.5,.31),M('#5a3a1e'),0,1.2,0); // Wappenrock braun-gelb, lumpig
    const sch=add(m.G,new THREE.CylinderGeometry(.32,.32,.05,16),M('#7a4a26'),0,1.25,-.22); sch.rotation.x=Math.PI/2; add(m.G,new THREE.CylinderGeometry(.07,.07,.06,10),kt,0,1.25,-.25).rotation.x=Math.PI/2; // Rundschild auf dem Rücken
    add(m.G,new THREE.BoxGeometry(.04,.75,.06),kt,.27,.65,.05).rotation.x=.3; p.G.userData.ohneBoden=true; p.G.visible=false; world.add(p.G);
    A.ritter={G:p.G,p,m,blase:triBlase(),d:null,phi:0}; } }
function poseBegegnungen(dt,rt,run,lauf,t){ const A=anim.tt, Bz=run?ttBegZeit(A.hp):null, Z=TT_BEG, ich=riders3d[myKey];
  // Bauer: läuft dir entgegen (so, dass ihr euch zur Zeit tB trefft), am rechten Rand, dreht sich nach Friedel um, lacht ihm nach
  { const B=A.bauer, m=B.m, vis=!!Bz&&rt>Bz.tB-25&&rt<Bz.tB+14; m.G.visible=vis; if(vis){ if(rt<Bz.tB) B.d=me.d+(Bz.tB-rt)*(me.v+Z.vB); else B.d-=Z.vB*lauf; const u=roadW(R,B.d)/2+.35, p=wegPos(B.d,u), hd=headingAt(R,B.d);
      m.G.position.set(p.x,bodenY(p.x,p.z),p.z); const F=A.friedel.r.g.position, zu=Math.atan2(F.x-p.x,F.z-p.z), wb=bSm((rt-Bz.tB+8)/2); m.G.rotation.y=tfWinkel(Math.PI*1.5-hd,zu,wb); // geht bergab, schaut zu Friedel
      const ph=t*5; m.beine[0].rotation.x=.4*Math.sin(ph); m.beine[1].rotation.x=-.4*Math.sin(ph); m.arme[0].rotation.x=rt>Bz.tB+3?-2.4+.3*Math.sin(t*9):-.3*Math.sin(ph); m.kopf.rotation.x=rt>Bz.tB+3?-.25*Math.abs(Math.sin(t*8)):0; } } // zeigt auf Friedel und lacht
  // Ritter: holt dich im Trab ein (neben dir zur Zeit tR), reitet mittendurch und davon
  { const Ri=A.ritter, vis=!!Bz&&rt>Bz.tR-20&&rt<Bz.tR+25; Ri.G.visible=vis; if(vis){ const v=me.v+Z.vR; if(rt<Bz.tR) Ri.d=me.d-(Bz.tR-rt)*Z.vR; else Ri.d+=v*lauf; const p=wegPos(Ri.d,0), hd=headingAt(R,Ri.d);
      Ri.G.position.set(p.x,bodenY(p.x,p.z)+.04*Math.abs(Math.sin(Ri.phi*2)),p.z); Ri.G.rotation.y=Math.PI/2-hd; Ri.phi+=v/2.6*2*Math.PI*lauf; // Trab: diagonale Beinpaare
      Ri.p.beine.forEach((b,k)=>b.rotation.x=.45*Math.sin(Ri.phi+(k===0||k===3?0:Math.PI))); Ri.p.hals.rotation.x=.06*Math.sin(Ri.phi*2);
      const lacht=rt>Bz.tR-3&&rt<Bz.tR+7, m=Ri.m; m.kopf.rotation.x=lacht?-.3*Math.abs(Math.sin(t*8)):0; m.kopf.rotation.y=lacht&&ich?clampN(Math.atan2(Math.sin(Math.atan2(ich.g.position.x-p.x,ich.g.position.z-p.z)-Ri.G.rotation.y),Math.cos(Math.atan2(ich.g.position.x-p.x,ich.g.position.z-p.z)-Ri.G.rotation.y)),-1.4,1.4):0;
      m.arme[1].rotation.x=lacht?-1.6:-.7; } } }

// Seitenweg aus Erde über dem Gelände (Punkte [x,z], halbe Breite vorn, wird nach hinten schmaler): Jungfernsprung, Abzweigung „sicher rechts“
function ttPfad(P,w0,schmal=.5){ const n=P.length, pos=new Float32Array(n*6), id=[]; for(let i=0;i<n;i++){ const a=P[Math.max(0,i-1)], b=P[Math.min(n-1,i+1)], dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz)||1, w=w0*(1-schmal*i/n), nx=-dz/l*w, nz=dx/l*w, [x,z]=P[i];
    pos.set([x+nx,bodenY(x+nx,z+nz)+.06,z+nz, x-nx,bodenY(x-nx,z-nz)+.06,z-nz],i*6); if(i<n-1) id.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setIndex(id); g.computeVertexNormals(); const w=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:'#a2775c',side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2})); w.userData.ohneBoden=true; world.add(w); return w; }
// Kiesel auf einem Seitenweg (wie ttWaldweg, dichter am Rand)
function ttKiesel(P,w0,N){ const q=rng(91), g=new THREE.DodecahedronGeometry(.5,0), m=new THREE.InstancedMesh(g,lam('#ffffff'),N), o=new THREE.Object3D(), C=new THREE.Color(), n=P.length;
  for(let i=0;i<N;i++){ const k=q()*(n-1.01), j=Math.floor(k), f=k-j, a=P[j], b=P[j+1], dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz)||1, w=w0*(1-.15*k/n), rand=q()<.6, u=rand?(q()<.5?-1:1)*(w-.2+q()*.6):(q()-.5)*w*1.6, x=a[0]+dx*f-dz/l*u, z=a[1]+dz*f+dx/l*u, s=rand?.08+q()*.16:.05+q()*.08;
    o.position.set(x,bodenY(x,z)+.06+s*.08,z); o.rotation.set((q()-.5)*.3,q()*6,(q()-.5)*.3); o.scale.set(s*(1+q()*.6),s*(.35+q()*.25),s*(.8+q()*.4)); o.updateMatrix(); m.setMatrixAt(i,o.matrix); m.setColorAt(i,C.set(['#a39e94','#8c8780','#b5ab98','#7a756e','#c2b8a4'][Math.floor(q()*5)])); }
  m.userData.ohneBoden=true; world.add(m); }
// Wegweiser aus Holz: Pfosten mit Kappe, Bretter in Fraktur zeigen auf [x,z] (Jungfernsprung, Abzweigung „sicher rechts“) · k: Größe gegenüber dem Schild an der Gabelung
function ttWegweiser(sx,sz,bretter,k=1.25){ const sy=bodenY(sx,sz), holz=lam('#6b4a32'), M=(g,y)=>{ const m=new THREE.Mesh(g,holz); m.position.set(sx,sy+y,sz); m.userData.ohneBoden=true; world.add(m); return m; };
  M(new THREE.BoxGeometry(.2*k,3*k,.2*k),1.3*k); M(new THREE.ConeGeometry(.2*k,.22*k,4),2.91*k).rotation.y=Math.PI/4;
  bretter.forEach(([[px,pz],txt],i)=>{ const g=new THREE.BoxGeometry(1.7*k,.36*k,.06*k); g.translate(.85*k,0,0);
    const tx=frakturTex(320,64,c=>{ c.fillStyle='#6b4a32'; c.fillRect(0,0,320,64); c.fillStyle='#efe2c0'; c.textAlign='center'; c.textBaseline='middle'; c.font='40px '+FRAKTUR; c.fillText(txt,160,34,296); }), tm=new THREE.MeshLambertMaterial({map:tx});
    const b=new THREE.Mesh(g,[holz,holz,holz,holz,tm,tm]); b.position.set(sx,sy+(2.4-i*.46)*k,sz); b.rotation.y=-Math.atan2(pz-sz,px-sx); b.userData.ohneBoden=true; world.add(b); }); }
// ---- Idylle vor dem Ducken (vom Nutzer): Wegweiser zum Jungfernsprung an einem Seitenweg nach rechts, viele Blumen am Wegrand, Familie mit Kindern spaziert dort – zeigt, wie dumm Friedels Entscheidung ist ----
function buildIdylle(A,T){ if(!T.seitenweg) return; const q=rng(4242), P=T.seitenweg, n=P.length, M=c=>lam(c);
  ttPfad(P,1.1); ttWegweiser(...T.idyllSchild,[[P[4],'Jungfernsprung'],[posAt(R,T.idyll+40),'Teufelstisch']]); // Seitenweg, Wegweiser an der Gabelung (rechts hinunter zum Jungfernsprung, geradeaus zum Teufelstisch)
  { const D=T.dorf, ry=(x,z)=>Math.atan2(T.idyllSchild[0]-x,T.idyllSchild[1]-z); // Dorf unten im Tal hinter dem See, Front zum Wegweiser
    for(const Hs of D.haeuser){ const H=haus({w:6+Hs.c*2.5,dep:6+Hs.c,hgt:3.8+Hs.c*1.2,fw:Hs.c<.6,wall:0,shut:0,roof:Hs.c<.5?'#9e3a28':'#a8925c',kam:Hs.c}); H.position.set(Hs.x,Math.max(...[[-4,-4],[4,-4],[-4,4],[4,4]].map(([a,b])=>bodenY(Hs.x+a,Hs.y+b))),Hs.y); H.rotation.y=ry(Hs.x,Hs.y); H.userData.ohneBoden=true; world.add(H); }
    const G=new THREE.Group(); G.position.set(D.x,bodenY(D.x,D.y),D.y); G.rotation.y=ry(D.x,D.y); G.userData.ohneBoden=true; world.add(G); const sand=lam('#c9a88a'); // Kirche in der Mitte
    const S=haus({w:7,dep:13,hgt:6.5,shut:0,roof:'#8e4a32'}); S.position.z=-4; G.add(S); const tu=new THREE.Mesh(new THREE.BoxGeometry(4.4,15,4.4),sand); tu.position.set(0,6.5,4.3); G.add(tu); const sp=new THREE.Mesh(new THREE.ConeGeometry(3.4,7.5,4),lam('#5a5f68')); sp.position.set(0,17.7,4.3); sp.rotation.y=Math.PI/4; G.add(sp); }
  { const Se=T.see, G=new THREE.Group(), w=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshPhongMaterial({color:'#5a86a6',shininess:90,specular:0x8899aa,transparent:true,opacity:.92})); // See: Ellipse, Wasser knapp unter dem Ufer
    w.rotation.x=-Math.PI/2; w.scale.set(Se.rx,Se.rz,1); G.add(w); G.position.set(Se.x,T.talY-1,Se.y); G.rotation.y=-Se.ry; G.userData.ohneBoden=true; world.add(G); }
  { const N=TT_IDYLL.blumen, geo=new THREE.IcosahedronGeometry(.07,0), I=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({color:'#ffffff'}),N), mt=new THREE.Matrix4(), c=new THREE.Color(), farb=['#e8d23a','#f2ece0','#c94aa0','#d22a1a','#6a7ad8','#f0a030']; // viele Blumen am Wegrand und am Seitenweg
    for(let i=0;i<N;i++){ let x,z; if(i<N*.7){ const d=T.idyll-TT_IDYLL.vor+q()*(TT_IDYLL.vor+TT_IDYLL.nach), s=q()<.5?-1:1, p=wegPos(d,s*(roadW(R,d)/2+.5+q()*4)); x=p.x; z=p.z; } else { const k=q()*(n-1), a=P[Math.floor(k)], b=P[Math.ceil(k)], f=k%1, s=q()<.5?-1:1; x=a[0]+(b[0]-a[0])*f+s*(1.3+q()*3); z=a[1]+(b[1]-a[1])*f+(q()-.5)*2; }
      const sc=.7+q()*.8; mt.makeScale(sc,sc*.6,sc).setPosition(x,bodenY(x,z)+.12*sc,z); I.setMatrixAt(i,mt); I.setColorAt(i,c.set(farb[Math.floor(q()*farb.length)])); }
    I.userData.ohneBoden=true; world.add(I); }
  const fam=[[{kittel:'#5a6a3a',hose:'#3a3020',haar:'#5a3a22',bart:'#5a3a22'},1],[{lang:'#7a4a6a',haar:'#8a5a32',tuch:'#ece4d4'},1],[{kittel:'#a84a3a',hose:'#4a3a2a',haar:'#c89a52'},.6],[{lang:'#d8b04a',haar:'#c89a52'},.55]]; // Vater, Mutter, zwei Kinder
  A.familie=fam.map(([o,s],i)=>{ const m=trMensch(o); m.G.scale.setScalar(s); m.G.userData.ohneBoden=true; world.add(m.G); return {m,ab:[0,-1.6,-.8,-2.6][i],u:[-.45,.45,.55,-.5][i]}; });
  { const Z=TT_BOGEN, [x0,z0]=P[0], [bx,bz]=T.bogenPos, G=new THREE.Group(); G.position.set(bx,bodenY(x0,z0)+Z.tief,bz); G.rotation.y=Math.atan2(bx-x0,bz-z0); G.userData.ohneBoden=true; G.mats=[]; // Regenbogen weit hinten rechts am Horizont (vom Nutzer: alles ganz heiter, nicht zu groß)
    ['#d23a3a','#f08a2a','#f2d23a','#5ab84a','#3a8ad8','#4a4ab0','#8a4ac0'].forEach((c,k)=>{ const m=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0,depthWrite:false,fog:false}); G.mats.push(m); G.add(new THREE.Mesh(new THREE.TorusGeometry(Z.r-k*Z.b,Z.b*.55,6,72,Math.PI),m)); });
    G.visible=false; world.add(G); A.bogen=G; } }
function poseIdylle(rt,run,t){ const A=anim.tt, T=R.tt, F=A.familie; if(!F||!T.seitenweg) return; if(A.bogen){ const g=me.d-T.idyll, [a,b]=TT_BOGEN.sicht, o=bSm((g-a)/80)*bSm((b-g)/40)*(run&&ttWetterW(rt)[0]>0?0:1); A.bogen.visible=o>0; A.bogen.mats.forEach(m=>m.opacity=.4*o); } const P=T.seitenweg, n=P.length, ich=riders3d[myKey], s0=clampN((me.d-(T.idyll-100))/6,0,(n-1)*4-6); // spaziert den Seitenweg entlang, während du näherkommst · Regenbogen blendet ein und aus, mit dem Unwetter ist er weg
  F.forEach((f,i)=>{ const s=clampN(s0+f.ab,0,(n-1)*4), k=s/4, a=P[Math.floor(k)], b=P[Math.min(n-1,Math.floor(k)+1)], w=k%1, dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz)||1, x=a[0]+dx*w-dz/l*f.u, z=a[1]+dz*w+dx/l*f.u, m=f.m, geht=s>0&&s<(n-1)*4-.5;
    m.G.position.set(x,bodenY(x,z)+(i>1&&geht?.05*Math.abs(Math.sin(t*9+i)):0),z); m.G.rotation.y=Math.atan2(dx,dz); const ph=t*(i>1?7:4.5)+i; m.beine[0].rotation.x=geht?.4*Math.sin(ph):0; m.beine[1].rotation.x=geht?-.4*Math.sin(ph):0;
    const winkt=i===2&&ich&&ich.g.position.distanceTo(m.G.position)<35; m.arme[1].rotation.x=winkt?-2.7+.35*Math.sin(t*9):geht?-.3*Math.sin(ph):0; m.kopf.rotation.y=winkt?1.2:0; }); } // das Kind winkt dir zu

// ---- Kamera (aus rennen.js): vor der Abzweigung Schwenk aufs Schild „Jungfernsprung“, dann auf die Familie am Blumenweg, rüber zum Regenbogen und zurück zu den Kindern ----
function ttIdyllKamera(dt){ const A=anim.tt, T=R.tt, ich=riders3d[myKey]; if(!A||!A.familie||!T.seitenweg||race.state!=='run'||!ich) return; const Z=TT_BOGEN.kam, rt=race.t, g=me.d-T.idyll;
  if(g<Z[0]-30) A.ikT=null; else if(A.ikT==null&&g>=Z[0]) A.ikT=g<Z[0]+15?rt:-1e9; const y=rt-A.ikT, T1=Z[1], T2=Z[1]+Z[2]; if(A.ikT==null||y<0||y>T2) return; // nach Sprüngen im Testmodus nicht
  const w=bSm(y/.8)*bSm((T2-y)/.8), [sx,sz]=T.idyllSchild, sy=bodenY(sx,sz), hd=headingAt(R,T.idyll), fx=Math.cos(hd), fz=Math.sin(hd), rx=-fz, rz=fx, P=T.seitenweg, f=A.familie[0].m.G.position, V=THREE.Vector3;
  const p1=new V(sx-fx*4.2-rx*1.4,sy+2,sz-fz*4.2-rz*1.4), l1=new V(sx,sy+2.7,sz), p2=new V(sx-fx*1.5+rx*.6,sy+2.9,sz-fz*1.5+rz*.6), [bx,bz]=T.bogenPos, l2=new V(f.x,f.y+1,f.z).lerp(new V(bx,bodenY(P[0][0],P[0][1])+TT_BOGEN.tief+TT_BOGEN.r*.6,bz),bSm((y-T1-1)/2.5)*(1-bSm((y-T2+4)/2.5))); // Schild ganz nah · Familie, rüber zum Regenbogen am Horizont, zum Schluss wieder zu den Kindern
  { const [ax,az]=P[0], [cx,cz]=P[4], l=Math.hypot(cx-ax,cz-az)||1, k=2.5*clampN((y-T1)/Z[2],0,1); p2.x+=(cx-ax)/l*k; p2.z+=(cz-az)/l*k; } // Kamera gleitet langsam den Blumenweg hinab
  const u=bSm((y-T1+.4)/1.2), pos=p1.lerp(p2,u), look=l1.lerp(l2,u), now=new V(camS.lx,camS.ly,camS.lz); camera.position.lerp(pos,w); camera.lookAt(now.lerp(look,w)); }
