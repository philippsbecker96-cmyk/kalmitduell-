/* ================= Physik (echte Watt, echtes Gewicht + 8 kg Rad) ================= */
const BIKE_KG=8, CRR=0.005, RHO=1.2, G=9.81;
// Straße: CdA 0,36 bei 75 kg, Crr 0,005 · Stadion (Holzbahn, Unterlenker): CdA 0,30, Crr 0,004
const PH_ROAD={cda:0.36,crr:0.005}, PH_TRACK={cda:0.30,crr:0.004};
const phys=()=>R&&R.stadium?PH_TRACK:PH_ROAD;
// Luftwiderstand wächst mit der Stirnfläche (≈ Gewicht hoch 2/3); rund 15 % davon entfallen aufs Rad und bleiben gleich
const cdaOf=(kg,c0=phys().cda)=>c0*(0.15+0.85*Math.pow(kg/75,2/3));
// Windschatten: bis 1 m hinter dem Vordermann 35 % weniger Luftwiderstand, bei 10 m nichts mehr
function draftOf(gapAhead){ if(!race.draft || !(gapAhead>0.3) || gapAhead>10) return 0; return 0.35*(1-(Math.max(gapAhead,1)-1)/9); }
function step(o, P, kg, dt, draft=0){ // P = echte Watt, kg = Fahrergewicht
  const M=kg+BIKE_KG, th=Math.atan((gradeAt(o.d)+belagAt(o.d,kg))/100);
  const Fg=M*G*Math.sin(th), Fr=phys().crr*M*G*Math.cos(th), Fa=0.5*RHO*cdaOf(kg)*(1-draft)*o.v*o.v, Fp=Math.min(P/Math.max(o.v,0.8),450); // 450 N: Grenze beim Anfahren aus dem Stand
  o.v=Math.max(0,o.v+(Fp-Fg-Fr-Fa)/(M+1.5)*dt); o.d+=o.v*dt;
}

/* ================= Bot-Fahrweise: gleichmäßig oder Angreifer =================
   Angreifer: attackiert an festen Stellen (Kalmit: steile Abschnitte, Hauptangriff am Steilstück vor Kehre 2; Stadion: einzelne Runden und Beginn der letzten Runde),
   sprintet im Finale, wenn der Gegner in der Nähe ist. Im Schnitt fährt er trotzdem die eingestellten W/kg – dazwischen fährt er etwas darunter. */
function botPlan(){
  const A=Math.max(1,+$('botWkg').value||2.8), kg=botKg(), L=raceLen(), P={style:$('botStyle').value,A,att:[],R:1,cur:A,ph:null,base:A,nextCalc:0,sprint:false};
  if(P.style!=='attack') return P;
  const q=rng(Math.floor(Math.random()*1e6)+1), many=$('botAgg').value==='many';
  const pick=(arr,n)=>{ const a=arr.slice(), o=[]; while(a.length&&o.length<n) o.push(a.splice(Math.floor(q()*a.length),1)[0]); return o; };
  let main=null, cands=[], dur, f, fMain, rec;
  if(R.loop){ const n=race.laps, Ll=R.len; for(let k=1;k<n-1;k++) cands.push(k*Ll+q()*Ll*.8);
    if(n>=2) main=(n-1)*Ll+50+q()*80; // Beginn der letzten Runde (Glocke)
    dur=20; f=1.35; fMain=1.4; rec=20; P.sprintAt=L-220;
    cands=pick(cands, many?Math.max(2,Math.round((n-2)/3)):Math.max(1,Math.round((n-2)/6))); }
  else { const W=R.kalmit?[[1600,2100],[2800,3200],[6200,6600]]:[[.2,.3],[.45,.55],[.75,.85]].map(([a,b])=>[a*L,b*L]), M=R.kalmit?[4000,4600]:[.6*L,.7*L];
    cands=pick(W.map(([a,b])=>a+q()*Math.max(0,b-a-200)), many?2:1); main=M[0]+q()*Math.max(0,M[1]-M[0]-250);
    dur=45; f=1.4; fMain=1.5; rec=35; P.sprintAt=L-250; }
  if(main!=null) cands=cands.filter(d=>d<main-650||d>main+650); // vor dem Hauptangriff genug Zeit zum Erholen
  cands.forEach(d=>P.att.push({d,dur,f,rec}));
  if(main!=null){ if(R.loop){ const v=vSteady(fMain*A*kg,0,kg,phys()); P.att.push({d:main,dur:clampN((P.sprintAt-main)/v,5,dur),f:fMain,rec:0,main:true}); } // Stadion: Angriff zur Glocke geht direkt in den Schlusssprint über
    else P.att.push({d:main,dur,f:fMain,rec,main:true}); }
  P.att.sort((a,b)=>a.d-b.d);
  // Zeitplan bei gleichmäßigem Schnitt – damit verteilt der Bot seine Kräfte
  const st=20, tab=[]; let t=0; for(let d=0; d<=L+st; d+=st){ tab.push(t); t+=st/vSteady(A*kg, gradeAt(d+st/2)+belagAt(d+st/2,kg), kg, phys()); }
  Object.assign(P,{tab,st,T:t,sprintDur:(L-P.sprintAt)/vSteady(1.6*A*kg, gradeAt(L-50), kg, phys())});
  return P;
}
function botWkgNow(dt){
  const P=opp.plan||{style:'even',A:+$('botWkg').value};
  if(P.style!=='attack') return P.A*(1+0.06*Math.sin(race.t/23)+0.03*Math.sin(race.t/7));
  const L=raceLen(), d=opp.d, gap=opp.d-me.d, A=P.A, now=race.t;
  if(P.ph && P.ph.kind==='rec' && now>=P.ph.end) P.ph=null;
  if(P.ph && P.ph.kind==='att' && (now>=P.ph.end || P.R<=.1)) P.ph={kind:'rec',f:.85,end:now+P.ph.a.rec,a:P.ph.a};
  if(!P.sprint && d>=P.sprintAt && !me.done && Math.abs(gap)<40){ P.sprint=true; P.ph={kind:'sprint',f:1.6,end:1e9}; } // Sprint nur, wenn der Gegner in der Nähe ist
  if(!P.ph || P.ph.kind==='rec') for(const a of P.att){ if(a.used || d<a.d) continue; a.used=true;
    if(P.ph || gap>120 || P.R<.5) break; // in der Erholung, schon weit vorne oder keine Kraft mehr: Attacke fällt aus
    P.ph={kind:'att',f:a.f,end:now+a.dur,a}; break; }
  // Kräftehaushalt: Attacken leeren die Reserve, sie füllt sich nur langsam wieder
  if(P.ph && P.ph.kind==='att') P.R-=dt/(P.ph.a.dur*1.3); else if(P.ph && P.ph.kind==='sprint') P.R=Math.max(0,P.R-dt/40); else P.R=Math.min(1,P.R+dt/120);
  if(now>=P.nextCalc){ P.nextCalc=now+1; // Grundtempo so wählen, dass der Schnitt am Ende den eingestellten W/kg entspricht
    const x=Math.min(P.tab.length-1.001,Math.max(0,d/P.st)), i=Math.floor(x), tAt=P.tab[i]+(P.tab[i+1]-P.tab[i])*(x-i), Trem=Math.max(5,P.T-tAt);
    let Ef=0, Tf=0; const ph=P.ph;
    if(ph && ph.kind!=='sprint'){ const r=Math.max(0,ph.end-now); Ef+=ph.f*r; Tf+=r; if(ph.kind==='att'){ Ef+=.85*ph.a.rec; Tf+=ph.a.rec; } }
    P.att.forEach(a=>{ if(!a.used){ Ef+=a.f*a.dur+.85*a.rec; Tf+=a.dur+a.rec; } }); 
    const sd=P.sprint?Math.max(0,(L-d)/Math.max(1,opp.v)):d>=P.sprintAt?0:P.sprintDur; Ef+=1.6*sd; Tf+=sd; // Sprint verpasst: keine Kraft mehr dafür zurückhalten
    if(Tf>Trem){ Ef*=Trem/Tf; Tf=Trem; } // was nach dem Ziel läge, zählt nicht
    P.base=clampN((A*(now+Trem)-opp.wkgSum-A*Ef)/Math.max(5,Trem-Tf), A*.75, A*1.1); }
  const tgt=P.ph?A*P.ph.f:P.base;
  P.cur+=(tgt-P.cur)*Math.min(1,dt*(P.ph&&P.ph.kind!=='rec'?2:1));
  return P.cur*(1+0.02*Math.sin(now/7));
}
function botStyleUi(){ const at=$('botStyle').value==='attack'; $('botAggBox').style.display=at?'':'none';
  $('botStyleInfo').textContent=at?'greift an steilen Stellen bzw. in einzelnen Runden an und sprintet im Finale – im Schnitt fährt er trotzdem die eingestellten W/kg':''; }

