/* ================= Teufelstisch (Kampagne, Mission 2) – der Bauer mit dem Fuhrwerk aus Mission 1 (Running Gag) =================
   Mitte des Ausfahrens, bergab Richtung Dahn: rauscht wie in Mission 1 von hinten heran, fährt links neben euch her, stichelt bei dir, fragt Friedel nach der gefangenen Elwetritsche,
   du sagst wieder nichts, er knallt mit der Peitsche und fährt davon. Du rückst an den rechten Rand (ttSpur in welt-teufel.js), Friedel in die Mitte. Wagen und Bauer: triFuhre (welt-trifels-leben.js).
   Sprüche in TT_FUHR_TXT (Platzhalter). buildTtFuhre aus buildTeufelstisch · poseTtFuhre aus poseTeufelstisch (nach poseTeufelstischLeben, damit Friedels Blase hier gilt) */

const TT_FUHR={anteil:.45, vor:7, ab:40, weg:10}; // Sprechbeginn bei diesem Anteil des Ausfahrens · s heranrauschen · Sprechzeit, danach davon · s bis außer Sicht
// [s ab Sprechbeginn, bis s, Sprecher (b: Bauer, f: Friedel), Text] – PLATZHALTER, Texte schreibt der Nutzer
const TT_FUHR_TXT=[[0,3,'b','Un wie?'],[3.5,9.5,'b','[PLATZHALTER] Ah, de Schneggefahrer vun gischder! Hoschs doch noch de Buckel nunner gschafft?'],
  [10,16,'b','[PLATZHALTER] Unn du, Friedel – im Wirtshaus verzähle se, du hättscht e Elwetritsch gfange?'],[16.5,22,'f','[PLATZHALTER] Gfange? Mit bloße Händ! Grad so groß war se!'],
  [22.5,27.5,'b','[PLATZHALTER] Jo jo … unn ich bin de Kaiser vun China.'],[28,33.5,'b','[PLATZHALTER] Unn du, [Großer|Großi]? Immer noch ke Wort? Wie gischder.'],
  [34,39.5,'b','[PLATZHALTER] Alla hopp – ich muss weida. Bis zum nächschde Mol, ihr zwee Schnecke!']];
const ttFuhrT=()=>{ const a=(race.woSegs||[]).find(s=>s.label==='Ausfahren'); return a?a.t0+a.dur*TT_FUHR.anteil:null; }; // Workout-Zeit des Sprechbeginns
const ttFuhreW=()=>{ const F=anim.tt&&anim.tt.fuhre; return F&&F.G.visible?bSm((F.off+30)/8)*bSm((30-F.off)/8):0; }; // 0 … 1: du an den rechten Rand (ttSpur)

// ---- Aufbau (aus buildTeufelstisch) ----
function buildTtFuhre(A){ A.fuhre=triFuhre(); }

// ---- Bewegung (aus poseTeufelstisch) ----
function poseTtFuhre(dt){ const A=anim.tt, F=A&&A.fuhre; if(!F) return; const run=race.state==='run', t0=ttFuhrT(), Z=TT_FUHR, s=run&&t0!=null?race.t-t0:-1e9, t=performance.now()/1000, vis=s>-Z.vor&&s<Z.ab+Z.weg;
  F.G.visible=vis; F.blase.visible=false; if(!vis){ F.dAlt=null; F.off=-99; return; }
  const off=-32*(1-bSm((s+Z.vor)/Z.vor))+1.4*Math.max(0,s-Z.ab)**2, d=me.d+off+.9, rw=roadW(R,d)/2, p=wegPos(d,-(rw-.9)), v=F.dAlt!=null&&dt>0?Math.max(0,(d-F.dAlt)/dt):0; F.off=off; F.dAlt=d; // links am Rand, du rechts, Friedel in der Mitte
  F.ph+=dt*v*.9; const sp=v>.5?Math.min(.7,.2+v*.04):0; F.G.position.set(p.x,bodenY(p.x,p.z)+(v>6?.04*Math.abs(Math.sin(F.ph*2)):0),p.z); F.G.rotation.set(-Math.atan(gradeAt(d)/100),Math.PI/2-p.h,0,'YXZ'); // galoppiert, Wagen holpert
  F.pferd.beine.forEach((b,i)=>b.rotation.x=sp*Math.sin(F.ph+(i<2?0:1.6)+(i%2)*.4)); F.pferd.hals.rotation.x=.1*sp*Math.sin(F.ph*2); for(const r of F.raeder) r.rotation.x+=dt*v/.48;
  const m=F.m, z=TT_FUHR_TXT.find(([a,b])=>s>=a&&s<b), k=Math.min(1,dt*6), zuF=z&&/Friedel/.test(z[3])||z&&z[2]==='f'; m.kopf.rotation.y+=((s>-1&&s<Z.ab+1.5?(zuF?-.7:-1):0)-m.kopf.rotation.y)*Math.min(1,dt*4); // schaut zu dir (rechts) oder zu Friedel (näher)
  m.arme[0].rotation.x+=((z&&z[2]==='b'?-1.3+.35*Math.sin(t*5):s>=Z.ab-.5&&s<Z.ab+1.2?-1.6+.8*Math.sin(t*9):-.9)-m.arme[0].rotation.x)*k; // erzählt mit der Hand, winkt ab
  m.arme[1].rotation.x+=((s>=Z.ab+.8?-2.7+.6*Math.sin(t*14):-.9)-m.arme[1].rotation.x)*k; // Peitsche
  if(!z) return; const txt=kText(z[3]), ich=riders3d[myKey]&&riders3d[myKey].g;
  if(z[2]==='b'){ F.blase.visible=true; triBlaseText(F.blase,txt); const kp=m.kopf.getWorldPosition(new THREE.Vector3()); kp.y+=.9; triBlaseUeber(F.blase,kp,ich); }
  else if(A.friedel){ const Fr=A.friedel, kp=Fr.r.g.position.clone(); kp.y+=2.9; Fr.blase.visible=true; triBlaseText(Fr.blase,txt); triBlaseUeber(Fr.blase,kp,ich); } }
