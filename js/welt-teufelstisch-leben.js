/* ================= Teufelstisch (Kampagne, Mission 2) – Friedel und Leben am Weg =================
   Friedel fährt von Anfang an links neben dir mit (Modell friedelModell aus welt-trifels.js, ohne Sack), hinten auf dem Holzrad ein Haufen Wurst und Fleisch
   von den zehn Gulden aus der Wette, eine Wurstkette baumelt heraus (TT_WURST: einzeln, damit die Hunde am Anstieg später Stück für Stück davon schnappen können).
   Erzählt im Einfahren (TT_TXT), duckt sich beim Anschleichen und fährt dann hinter dir am rechten Wegrand. Teufelstisch als Fernbild vom Tal aus: A.fern (TT_FERN) */

// Friedels Sprüche: [s nach dem Start, Dauer, Text] – PLATZHALTER, Texte schreibt der Nutzer
const TT_TXT={erzaehl:[[40,9,'[PLATZHALTER] Ei, [name]! Weescht, was ich mit de zehn Gulde vun de Wett gemacht hab?'],[50,10,'[PLATZHALTER] Erscht emol hab ich mer ordentlich enner hinner die Binde gekippt … oder zwee … oder zwanzich.'],
  [61,10,'[PLATZHALTER] Unn dann hab ich beim Metzger alles gekaaft, was er hatt: Bratworscht, Lewwerworscht, Saumage, Schinke!'],[72,9,'[PLATZHALTER] Guck mol hinne uff mei Rad – des reicht bis Weihnachte!']]};
const TT_FERN={sicht:400, aus:300}; // Fernbild des Teufelstischs: so groß, als stünde er 400 m entfernt (wie am Ende von Mission 1) · blendet auf den letzten 300 m vor dem Anstieg aus

// ---- Aufbau (aus buildTeufelstisch) ----
function buildTeufelstischLeben(){ const A=anim.tt, T=R.tt;
  { const F=friedelModell(); F.sack.visible=F.raus.G.visible=false; F.r.lane=null; A.friedel={...F, d:0, crank:0, blase:triBlase(), wurst:ttWurstladung(F.r)};
    if(!document.getElementById('triSag')){ const el=document.createElement('div'); el.id='triSag'; document.body.appendChild(el); } } // Friedels Worte, wenn er nicht im Bild ist
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
  // Friedel: links neben dir, beim Anschleichen geduckt hinter dir am rechten Rand (wie du)
  const gd=ttGeduckt(), ml=ich&&ich.lane!=null?ich.lane:0, H=roadW(R,me.d)/2-.5, uN=ml-1.25<-H?ml+1.25:ml-1.25, u=uN+(ml-uN)*gd, want=-1.3-2.2*gd;
  if(!run||Math.abs(F.d-me.d)>60){ F.d=me.d+want; F.r.lane=u; } // vor dem Start und nach Sprüngen im Testmodus gleich neben dir
  if(run){ const vr=clampN((want-(F.d-me.d))*.6,-2.6,1.6), fv=Math.max(0,me.v+vr); F.d+=fv*lauf; F.crank+=fv>.3?75/60*2*Math.PI*lauf:0; }
  F.r.lane=F.r.lane==null?u:F.r.lane+(u-F.r.lane)*Math.min(1,dt*2); F.r.ae=gd; putRider(F.r,F.d,F.crank);
  { const v=Math.min(1,me.v/6); F.wurst.kette.forEach((g,i)=>{ g.rotation.z=(.5+.15*v)*(i?.2:1)+.12*v*Math.sin(t*5.5+i*.8); g.rotation.x=.18*v*Math.sin(t*4.1+i*1.1); }); } // Wurstkette baumelt nach hinten
  // Sprechblase über Friedel, sonst unten im Bild
  const s=run?TT_TXT.erzaehl.find(([a,d])=>rt>=a&&rt<a+d):null, txt=s?kText(s[2]):null, B=F.blase, el=document.getElementById('triSag'), p=F.r.g.position.clone(); p.y+=2.9; let im=false;
  if(txt){ const q=p.clone().project(camera); im=q.z<1&&Math.abs(q.x)<.9&&Math.abs(q.y)<.9&&camera.position.distanceTo(p)<45; triSag('friedel',txt); }
  B.visible=!!txt&&im; if(B.visible){ triBlaseText(B,txt); triBlaseUeber(B,p,ich&&ich.g); }
  if(el){ if(txt&&!im){ el.textContent='Friedel: '+txt; el.classList.add('zeig'); } else el.classList.remove('zeig'); }
  // Fernbild des Teufelstischs: bleibt so groß wie aus 400 m, blendet vor dem Anstieg aus (dann ist der echte Tisch oben auf dem Plateau zu sehen)
  const Fe=A.fern; if(Fe){ const w=1-bSm((me.d-(R.tt.an[0]-TT_FERN.aus))/TT_FERN.aus); Fe.visible=w>.01; if(Fe.visible){ const [tx,tz]=R.tt.tischPos, k=Math.max(1,Math.hypot(camera.position.x-tx,camera.position.z-tz)/TT_FERN.sicht); Fe.scale.setScalar(k); Fe.userData.mats.forEach(m=>m.opacity=w); } } }
