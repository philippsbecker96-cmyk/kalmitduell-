/* ================= Strecke ================= */
const ST={L:84.39, r:36.80, TW:7.5, Xs:98, Zs:55, BANK0:12, BANK1:43};
const ST_RH=0.8, ST_TIER={at:11,gap:2.6,step:1.4}, TOWER_H=36; // Tribünen steiler, Längsseiten zweirangig, Ecktürme höher
const STEP=2;            // Abstand der Streckenpunkte in m
const SIDEWALK=1.4;      // Gehweg im Ort (eng wie in Maikammer)
const ROAD_W=6;          // Straßenbreite in m
let R=null;              // aktuelle Strecke

// Kalmit-Ostrampe nach echter GPX (komoot, Maikammer → Kalmithaus): [Ost m, Süd m, Höhe m]
const KALMIT_GPX=[[0.0,-0.0,182.1],[-52.5,-27.0,182.1],[-66.5,-35.3,182.1],[-108.8,-60.6,182.9],[-179.2,-92.0,185.2],[-207.2,-104.3,186.1],[-220.6,-110.4,186.6],[-257.3,-126.6,187.8],[-302.7,-147.2,189.7],[-333.2,-161.3,191.1],[-347.6,-167.8,191.7],[-369.4,-178.2,192.7],[-389.6,-187.4,193.6],[-410.7,-196.1,194.5],[-565.5,-268.2,200.7],[-596.1,-282.0,201.8],[-612.8,-291.1,202.4],[-621.8,-298.0,202.8],[-641.9,-312.5,203.6],[-652.8,-316.1,204.0],[-721.9,-319.6,206.2],[-783.5,-315.5,208.2],[-865.0,-310.5,211.0],[-973.2,-310.1,215.0],[-996.3,-304.6,215.9],[-1080.0,-273.0,219.2],[-1144.0,-258.1,221.6],[-1172.6,-258.0,222.6],[-1245.2,-269.9,225.9],[-1308.9,-268.1,229.4],[-1342.6,-271.4,231.3],[-1373.9,-281.1,233.2],[-1453.5,-321.7,238.9],[-1508.4,-335.5,242.9],[-1526.8,-338.5,244.2],[-1572.6,-348.6,247.5],[-1669.0,-386.6,255.3],[-1707.2,-394.5,258.3],[-1771.7,-403.6,263.3],[-1804.2,-411.9,265.9],[-1919.6,-455.5,276.4],[-1940.5,-466.3,278.4],[-1962.9,-482.3,280.8],[-2036.3,-556.2,289.8],[-2062.0,-575.4,292.6],[-2068.3,-578.0,293.2],[-2076.9,-581.2,294.0],[-2096.6,-587.0,295.7],[-2103.2,-589.1,296.4],[-2112.7,-592.6,297.2],[-2120.4,-596.0,298.0],[-2126.0,-599.3,298.5],[-2150.3,-616.4,300.5],[-2155.0,-619.0,300.8],[-2161.6,-622.1,301.2],[-2168.8,-624.7,301.6],[-2176.9,-626.7,302.0],[-2185.0,-628.2,302.5],[-2221.9,-625.8,304.5],[-2228.7,-627.5,304.9],[-2233.4,-633.5,305.3],[-2230.7,-642.2,305.8],[-2222.9,-646.1,306.3],[-2193.9,-650.7,307.9],[-2144.5,-663.4,310.7],[-2101.4,-668.2,313.2],[-2028.6,-677.1,317.4],[-1969.0,-681.5,320.8],[-1940.3,-679.8,322.2],[-1905.6,-671.1,323.6],[-1889.7,-663.8,324.3],[-1864.4,-647.5,325.5],[-1859.3,-644.1,325.8],[-1822.5,-611.4,327.7],[-1798.2,-599.3,328.8],[-1768.5,-597.9,330.4],[-1735.9,-605.8,334.0],[-1723.0,-612.4,335.6],[-1710.6,-628.2,337.8],[-1687.4,-686.3,344.5],[-1683.5,-733.3,349.6],[-1687.8,-764.1,352.9],[-1696.0,-787.3,355.5],[-1705.1,-802.5,357.4],[-1724.9,-825.7,360.6],[-1755.3,-848.4,364.5],[-1806.4,-876.5,370.6],[-1846.7,-891.7,373.1],[-1870.6,-893.2,373.9],[-1889.8,-887.0,374.7],[-1911.7,-871.7,375.6],[-1927.0,-870.2,376.2],[-1954.1,-873.7,377.2],[-1962.4,-874.6,377.5],[-1984.9,-872.9,378.3],[-2029.5,-860.1,380.1],[-2155.2,-850.3,385.2],[-2227.2,-852.6,388.5],[-2312.1,-871.4,393.7],[-2335.7,-874.3,395.1],[-2530.4,-856.7,409.3],[-2579.8,-858.6,413.3],[-2613.3,-864.4,416.2],[-2641.9,-874.8,419.5],[-2708.0,-908.6,427.7],[-2760.8,-940.5,434.4],[-2840.2,-997.3,444.3],[-2972.1,-1075.2,459.6],[-3014.1,-1103.6,465.1],[-3066.0,-1142.9,472.2],[-3109.7,-1184.8,478.8],[-3125.3,-1192.6,480.3],[-3138.8,-1192.5,481.5],[-3147.1,-1188.7,482.3],[-3164.8,-1175.2,484.3],[-3173.6,-1162.8,485.6],[-3186.9,-1128.0,488.9],[-3202.1,-1099.0,491.8],[-3206.2,-1080.5,493.5],[-3203.6,-1007.2,499.4],[-3198.4,-959.8,502.9],[-3195.2,-856.0,510.7],[-3194.8,-842.6,511.6],[-3188.3,-812.7,513.5],[-3167.5,-762.4,516.9],[-3113.9,-649.6,524.4],[-3112.9,-635.7,525.1],[-3118.9,-625.1,525.6],[-3126.6,-619.4,526.1],[-3134.6,-617.8,526.5],[-3150.4,-623.0,527.3],[-3170.9,-638.0,528.5],[-3247.9,-709.3,533.7],[-3257.2,-714.1,534.3],[-3293.2,-724.4,536.7],[-3324.7,-737.7,538.9],[-3358.4,-756.4,541.3],[-3388.8,-777.2,543.7],[-3399.9,-794.8,545.0],[-3403.3,-816.7,546.7],[-3406.5,-889.2,553.4],[-3409.9,-905.4,554.9],[-3422.9,-939.4,558.2],[-3445.3,-978.8,562.3],[-3457.2,-1012.2,565.0],[-3460.3,-1050.0,567.3],[-3457.6,-1151.4,573.3],[-3449.4,-1214.8,577.0],[-3440.5,-1252.9,579.2],[-3429.8,-1286.8,581.1],[-3405.2,-1338.3,584.3],[-3344.4,-1458.1,594.2],[-3348.0,-1470.0,595.3],[-3346.9,-1477.5,595.9],[-3337.8,-1512.2,598.9],[-3325.0,-1540.7,601.5],[-3324.6,-1560.5,603.2],[-3331.6,-1572.0,604.4],[-3342.8,-1579.4,605.7],[-3625.3,-1642.5,630.1],[-3667.3,-1641.7,632.9],[-3725.0,-1626.2,636.0],[-3745.4,-1616.6,636.3],[-3753.2,-1610.3,636.5],[-3761.5,-1599.1,636.6],[-3763.8,-1588.2,636.8],[-3764.2,-1586.6,636.8],[-3762.6,-1572.8,637.0],[-3761.3,-1563.0,637.1],[-3744.1,-1554.1,637.4],[-3715.4,-1533.5,637.9],[-3712.4,-1531.6,637.9],[-3669.9,-1486.7,639.0],[-3624.5,-1429.4,641.0],[-3594.9,-1395.0,642.3],[-3585.7,-1388.4,642.6],[-3570.2,-1384.5,643.0],[-3554.9,-1387.5,643.4],[-3541.4,-1395.5,643.9],[-3525.7,-1411.6,644.0],[-3518.3,-1423.2,644.0],[-3513.2,-1431.5,644.0]];
function kalmitDef(){
  // Ecken der GPX glätten (Chaikin), damit Kehren rund werden
  let P=KALMIT_GPX.map(p=>[p[0],p[1],p[2]]);
  for(let it=0;it<3;it++){ const Q=[P[0]]; for(let i=0;i<P.length-1;i++){ const a=P[i], b=P[i+1];
      Q.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25,a[2]*.75+b[2]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75,a[2]*.25+b[2]*.75]); } Q.push(P[P.length-1]); P=Q; }
  const poly=P.map(p=>[p[0],p[1]]), cum=[0]; for(let i=1;i<P.length;i++) cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const L=cum[cum.length-1], eAt=d=>{ let i=1; while(i<cum.length-1&&cum[i]<d) i++; const t=(d-cum[i-1])/Math.max(1e-6,cum[i]-cum[i-1]); return P[i-1][2]+(P[i][2]-P[i-1][2])*Math.min(1,Math.max(0,t)); };
  const SEG=100, segs=[]; for(let d=0; d<L-1; d+=SEG){ const len=Math.min(SEG,L-d); segs.push({len, g:(eAt(d+len)-eAt(d))/len*100}); }
  return {name:'Kalmit-Ostrampe', start:'Maikammer', finish:'Kalmit · 673 m', startElev:P[0][2], plainElev:110, kalmit:true, poly, segs};
}
const ROUTES=[{id:'kalmit', mode:'climb', title:'Kalmit-Ostrampe', sub:'ab Maikammer · Pfalz · echte GPX', def:kalmitDef()},
  {id:'stadion', mode:'loop', title:'Stadionrunde', sub:'Steilkurven · Westkurve', def:stadionDef()},
  {id:'space', mode:'space', title:'Space-Strecke', sub:'aus deinem Workout erzeugt', def:null},
  {id:'insel', mode:'space', title:'Insel-Strecke', sub:'tropischer Archipel · Untergrund je nach Intensität', def:null}]; // Space nur im Training, Strecke entsteht aus dem Workout
const raceLen=()=>race.mode==='train'||race.mode==='chase'?Infinity:R.loop?R.len*race.laps:R.len;
const MODES={climb:{title:'Anstieg', soon:'Weitere Anstiege folgen'}, loop:{title:'Rundstrecke', soon:'Weitere Rundstrecken folgen'}, classic:{title:'Klassisches Rennen', soon:'Strecke folgt – kommt später'}, train:{title:'Training', soon:'Strecken aus allen Modi – in Dauerschleife'}, chase:{title:'Verfolgung', soon:''}};
let routeId='kalmit';

function buildRoute(def){
  const P=def.poly; const xs=[P[0][0]], ys=[P[0][1]]; let carry=0;
  for(let i=1;i<P.length;i++){ let ax=P[i-1][0], ay=P[i-1][1]; const bx=P[i][0], by=P[i][1]; let segL=Math.hypot(bx-ax,by-ay);
    while(carry+segL>=STEP){ const t=(STEP-carry)/segL; ax+=(bx-ax)*t; ay+=(by-ay)*t; xs.push(ax); ys.push(ay); segL=Math.hypot(bx-ax,by-ay); carry=0; }
    carry+=segL; }
  if(def.loop && Math.hypot(xs[xs.length-1]-P[0][0], ys[ys.length-1]-P[0][1])>0.5){ xs.push(P[0][0]); ys.push(P[0][1]); }
  const len=(xs.length-1)*STEP;
  const segLenSum=def.segs.reduce((a,s)=>a+s.len,0), kf=len/segLenSum;
  let d=0, e=def.startElev, gain=0; const segs=def.segs.map(s=>{ const o={d0:d,len:s.len*kf,g:s.g,e0:e,p:s.p,sg:s.sg}; d+=o.len; e+=o.len*s.g/100; gain+=Math.max(0,o.len*s.g/100); return o; });
  const r={kf, name:def.name, start:def.start||'Start', finish:def.finish||'Ziel', kalmit:!!def.kalmit, xs, ys, len, segs, startElev:def.startElev, endElev:e, gain, def};
  if(def.stadium){ prepStadium(r); return r; }
  if(def.space||def.island){ // Übergang Umlaufbahn → Anfang der Umlaufbahn genau treffen
    const Lw0=segLenSum*kf-def.ring*kf, ex=xs[xs.length-1], ey=ys[ys.length-1], tmp={xs,ys,len}; let best=Lw0, bd=1e9;
    for(let dd=Lw0-6; dd<=Lw0+6; dd+=0.05){ const [px,py]=posAt(tmp,dd), q=Math.hypot(px-ex,py-ey); if(q<bd){ bd=q; best=dd; } }
    Object.assign(r,{ring:len-best, goal:def.island?def.goal*kf:best, kehren:[], fans:len, town:0, vine:0, S:null});
    if(def.island){ r.island=true; prepIsland(r); return r; }
    // Optische Überhöhung: Bahn wird 2,5 × so steil gezeichnet (max. 30 %), Physik und Trainer bleiben bei der echten Steigung
    let ve=0; segs.forEach(o=>{ o.vg=Math.sign(o.g)*Math.min(Math.abs(o.g)/SPACE_PHYS*SPACE_VX,30); o.ve0=ve; ve+=o.len*o.vg/100; }); r.vEnd=ve;
    r.space=true; return r; }
  // Landschaftszonen: Dorf, Weinberge, Wald, Fans im letzten Kilometer
  r.town = r.kalmit ? 800 : 0;
  r.vine = r.kalmit ? 2300 : 0;
  r.fans = Math.max(r.len*0.6, r.len-1000);
  r.kehren=[]; for(let dd=40; dd<len-40; dd+=STEP*5){ const dh=Math.abs(angDiff(headingAt(r,dd+25),headingAt(r,dd-25)));
    if(dh>(r.kalmit?1.25:2.2) && !r.kehren.some(k=>Math.abs(k-dd)<120)) r.kehren.push(dd); }
  makeScenery(r);
  return r;
}
function posAt(r,d){ if(r.ring && d>r.len) d-=r.ring; // hinter dem Ziel: Umlaufbahn
  d = r.loop ? ((d%r.len)+r.len)%r.len : Math.max(0,Math.min(r.len,d)); const f=d/STEP, i=Math.min(r.xs.length-2,Math.floor(f)), t=f-i;
  return [r.xs[i]+(r.xs[i+1]-r.xs[i])*t, r.ys[i]+(r.ys[i+1]-r.ys[i])*t]; }
function headingAt(r,d){ const a=posAt(r,d-3), b=posAt(r,d+3); return Math.atan2(b[1]-a[1], b[0]-a[0]); }
function angDiff(a,b){ let x=a-b; while(x>Math.PI) x-=2*Math.PI; while(x<-Math.PI) x+=2*Math.PI; return x; }
function segOf(d){ const s=R.segs; let lo=0, hi=s.length-1; while(lo<hi){ const m=(lo+hi+1)>>1; if(s[m].d0<=d) lo=m; else hi=m-1; } return s[lo]; }
function gradeAt(d){ if(d<0||d>R.len) return 0; return segOf(d).g; }
function elevAt(d){ if(d<=0) return R.startElev; if(d>=R.len) return R.endElev; const s=segOf(d); return s.e0+(d-s.d0)*s.g/100; }
function gradeColor(g){ return g<4.5?'#9cc46b':g<6?'#e9df6a':g<7.2?'#f0b860':g<8.3?'#ec9a52':'#de6f43'; }

/* Landschaft: Bäume, Felsen, Weinberge, Häuser, Fans – fest per Zufallsgenerator mit Startwert */
function rng(seed){ seed=seed%2147483647; if(seed<=0) seed+=2147483646; return ()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }; }
const CELL=30;
function makeScenery(r){
  const rg=new Map(), key=(x,y)=>Math.floor(x/CELL)+','+Math.floor(y/CELL);
  for(let i=0;i<r.xs.length;i+=2){ const k=key(r.xs[i],r.ys[i]); (rg.get(k)||rg.set(k,[]).get(k)).push(i); }
  const distRoad=(x,y)=>{ let m=1e9; const cx=Math.floor(x/CELL), cy=Math.floor(y/CELL);
    for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++){ const l=rg.get((cx+a)+','+(cy+b)); if(l) for(const i of l){ const dd=Math.hypot(r.xs[i]-x,r.ys[i]-y); if(dd<m) m=dd; } } return m; };
  const S={tree:[],rock:[],vine:[],vpost:[],grass:[],house:[],block:[],post:[],lamp:[],fan:[]}, R1=rng(42);
  const frame=d=>{ const [px,py]=posAt(r,d), h=headingAt(r,d); return {px,py,h,nx:-Math.sin(h),ny:Math.cos(h)}; };

  // Dorf: geschlossene Häuserzeilen direkt am Gehweg
  for(const side of [-1,1]){ let d=6;
    while(d<r.town-8){ const w=7+R1()*4.5, dep=8+R1()*3, f=frame(d+w/2), off=ROAD_W/2+SIDEWALK+dep/2, upper=d>550;
      if(distRoad(f.px+f.nx*side*off, f.py+f.ny*side*off)>off-1.5)
        S.house.push({x:f.px+f.nx*side*off, y:f.py+f.ny*side*off, w, dep, hgt:5.6+R1()*1.8, h:f.h, side, wall:upper&&R1()<.6?4:Math.floor(R1()*6), shut:Math.floor(R1()*3), roof:R1()<.5?'#b4472f':'#9e3a28', d:d+w/2});
      d+=w+(R1()<(upper?.45:.25)?2+R1()*(upper?9:3):0.2); } }
  for(let d=20; d<r.town-10; d+=34){ const side=(d/34|0)%2?1:-1, f=frame(d); S.lamp.push({x:f.px+f.nx*side*(ROAD_W/2+SIDEWALK-0.4), y:f.py+f.ny*side*(ROAD_W/2+SIDEWALK-0.4), h:f.h, side}); }

  for(let d=r.town; d<r.len; d+=5){
    const f=frame(d);
    for(const side of [-1,1]){
      const inVine=d<r.vine, inFans=d>r.fans, tries=inVine?2:3;
      for(let t=0;t<tries;t++){
        const off=side*((inFans?10:6)+R1()*(inVine?55:45)), along=(R1()-.5)*5;
        const x=f.px+f.nx*off+Math.cos(f.h)*along, y=f.py+f.ny*off+Math.sin(f.h)*along, dr=distRoad(x,y);
        if(inVine) continue;
        const rad=2.2+R1()*3; if(dr<rad+ROAD_W/2+(inFans?7:2)) continue;
        if(R1()<.05) S.rock.push({x,y,s:1.2+R1()*2.6,rot:R1()*6});
        else S.tree.push({x,y,s:rad,c:R1(),pine:R1()<.5,ht:9+R1()*7});
      }
    }
    if(r.kalmit && d<r.vine && d%30<5) for(const side of [-1,1]) if(R1()<.55) S.tree.push({x:f.px+f.nx*side*(ROAD_W/2+3.2+R1()*1.5), y:f.py+f.ny*side*(ROAD_W/2+3.2+R1()*1.5), s:1.6+R1()*.8, c:R1(), pine:false, ht:3, fruit:true});
    if(d>=r.town) for(const side of [-1,1]) for(let t=0;t<3;t++){ const off=side*(ROAD_W/2+1+R1()*4.5), al=(R1()-.5)*5; S.grass.push({x:f.px+f.nx*off+Math.cos(f.h)*al, y:f.py+f.ny*off+Math.sin(f.h)*al, s:.5+R1()*.6, c:R1(), r:R1()*6, wood:d>r.vine}); }
    // Sandsteinblöcke und Leitpfosten am Straßenrand (Wald)
    if(d>r.vine-200 || !r.kalmit){
      for(const side of [-1,1]){
        if(R1()<.16 && d<r.fans) S.block.push({x:f.px+f.nx*side*(ROAD_W/2+1.1), y:f.py+f.ny*side*(ROAD_W/2+1.1), h:f.h+(R1()-.5)*.3, s:.7+R1()*.6});
        if(Math.round(d)%50===0) S.post.push({x:f.px+f.nx*side*(ROAD_W/2+0.7), y:f.py+f.ny*side*(ROAD_W/2+0.7), h:f.h});
      }
    }
  }
  // Rebzeilen quer zur Straße: jede Zeile läuft vom Straßenrand senkrecht weg, Zeilenabstand 2,4 m
  if(r.kalmit) for(let d=r.town-10; d<r.vine; d+=2.4){ const f=frame(d);
    for(const side of [-1,1]) for(let k=0; k<22; k++){ const off=side*(6.5+k*3.0), x=f.px+f.nx*off, y=f.py+f.ny*off;
      if(distRoad(x,y)<Math.abs(off)-1.2) break; S.vine.push({x,y,rot:f.h+Math.PI/2,c:R1()}); if(k%3===0) S.vpost.push({x,y,h:f.h}); } }
  for(let d=0; d<r.len; d+=8){ const f=frame(d);
    for(const side of [-1,1]) for(let t=0;t<3;t++){ const off=side*(50+R1()*170), x=f.px+f.nx*off+(R1()-.5)*8, y=f.py+f.ny*off+(R1()-.5)*8;
      if(d<r.vine && Math.abs(off)<160) continue; const rad=2.4+R1()*3; if(distRoad(x,y)<rad+8) continue; S.tree.push({x,y,s:rad,c:R1(),pine:R1()<.5,ht:10+R1()*7}); } }

  // Fans im letzten Kilometer – zum Ziel hin immer dichter
  const JACK=['#f2c94c','#2f80ed','#eb5757','#27ae60','#d4f03a','#9b51e0','#f2994a','#56ccf2','#e0e0e0','#333a44','#e64980','#1d4a8c','#7a8a99','#c0392b','#fff3a8'];
  for(let d=r.fans; d<r.len-14; ){
    const near=(d-r.fans)/(r.len-r.fans), f=frame(d), barrier=d>r.len-320;
    for(const side of [-1,1]){
      const rows = 1 + (near>.25?1:0) + (near>.6?1:0) + (R1()<near?1:0);
      for(let row=0; row<rows; row++){
        if(R1()<.12) continue;
        const off=side*(ROAD_W/2+(barrier?1.25:0.55)+row*0.75+R1()*0.35), al=(R1()-.5)*.8;
        S.fan.push({x:f.px+f.nx*off+Math.cos(f.h)*al, y:f.py+f.ny*off+Math.sin(f.h)*al, face:Math.atan2(-f.nx*side,-f.ny*side)+(R1()-.5)*.9,
          jack:JACK[Math.floor(R1()*JACK.length)], legs:R1()<.6?'#2a2f3a':R1()<.5?'#4a5568':'#1c2a4a', tall:.9+R1()*.22,
          arms:R1()<.38?(R1()<.55?2:1):0, phone:R1()<.5, cap:R1()<.3?JACK[Math.floor(R1()*JACK.length)]:null, flag:R1()<.035, ph:R1()*6.3, d});
      }
    }
    d += 2.3 - near*1.55 + R1()*.4;
  }
  r.S=S;
}

/* ================= Space-Strecke: wird aus dem Workout erzeugt ================= */
// Bahnfarbe je Intensität (% FTP): Blau in der Erholung bis Rot/Violett bei Vollgas
const SPACE_COL=p=>p<0?'#8fe3ff':p<60?'#3d7bff':p<76?'#29c6f6':p<90?'#2fe07a':p<105?'#ffd23a':p<119?'#ff8a2a':p<135?'#ff3b4e':'#c04bff';
// Steigung je Intensität: locker = bergab/flach, hart = steil
const SPACE_GR=[[0,-4],[50,-3],[60,-1],[70,1],[80,3],[90,5],[100,7],[110,9],[120,11],[140,15],[170,19],[200,22]];
function spaceGrade(p){ const T=SPACE_GR; if(p<=T[0][0]) return T[0][1]; for(let i=1;i<T.length;i++) if(p<=T[i][0]){ const [a,ga]=T[i-1],[b,gb]=T[i]; return ga+(gb-ga)*(p-a)/(b-a); } return T[T.length-1][1]; }
function vSteady(P,g,kg,ph=PH_ROAD){ const M=kg+BIKE_KG, th=Math.atan(g/100), a=M*G*(Math.sin(th)+ph.crr*Math.cos(th)), b=0.5*RHO*cdaOf(kg,ph.cda);
  let lo=0, hi=40; for(let i=0;i<40;i++){ const v=(lo+hi)/2; if(v*a+b*v*v*v<P) lo=v; else hi=v; } return Math.max(1,(lo+hi)/2); }
const SPACE_RING=160, SPACE_VX=2.5; // Radius der Umlaufbahn hinter der Raumstation
const SPACE_PHYS=0.5; // Physik rechnet mit der halben Steigung (schneller), gezeichnet wird weiter die volle Steigung × SPACE_VX
function spaceDef(segs, unit, f, kg){
  const DT=2, T=segs.reduce((a,s)=>a+s.dur,0), raw=[];
  let si=0; for(let t=0;t<T;t+=DT){ while(si<segs.length-1 && t>=segs[si].t0+segs[si].dur) si++; const sg=segs[si];
    let p, w; if(sg.free){ p=105; w=f*1.05; } else { const v=segVal(sg,Math.min(t+DT/2,sg.t0+sg.dur)); p=unit==='w'?v/f*100:v; w=unit==='w'?v:v*f/100; }
    raw.push({p,w,g:spaceGrade(p)}); }
  if(!raw.length) raw.push({p:50,w:f*.5,g:0});
  // Übergänge weich: gleitender Mittelwert über ±12 s
  const out=raw.map((c,i)=>{ let s=0,n=0; for(let j=-6;j<=6;j++){ const o=raw[i+j]; if(o){ s+=o.g; n++; } } const g=Math.round(s/n*SPACE_PHYS*100)/100;
    return {len:Math.round(vSteady(c.w,g,kg)*DT*100)/100, g, p:Math.round(c.p)}; });
  const ring=2*Math.PI*SPACE_RING; out.push({len:ring,g:0,p:-1});
  // Verlauf in der Ebene: sanfte Bögen, aus dem Workout abgeleitet (gleiches Workout = gleiche Strecke)
  let hs=7; for(const s of segs) hs=(hs*31+Math.round(s.dur)+Math.round(s.a*7)+(s.b==null?3:Math.round(s.b*11))+(s.free?5:0))%2147483647;
  const r=rng(hs+1), l1=600+r()*300, l2=180+r()*90, f1=r()*6.28, f2=r()*6.28;
  const L=out.reduce((a,s)=>a+s.len,0), Lw=L-ring, poly=[[0,0]], DS=8; let x=0, y=0, d=0;
  const hdAt=s=>0.7*Math.sin(s/l1+f1)+0.32*Math.sin(s/l2+f2);
  const push=()=>poly.push([Math.round(x*100)/100,Math.round(y*100)/100]);
  while(d<Lw-1e-6){ const ds=Math.min(DS,Lw-d), h=hdAt(d+ds/2); x+=Math.cos(h)*ds; y+=Math.sin(h)*ds; d+=ds; push(); }
  // Umlaufbahn: geschlossener Kreis, endet genau am Anfang
  const n=Math.ceil(ring/DS), dr=ring/n; let h=hdAt(Lw);
  for(let i=0;i<n;i++){ h+=Math.PI/n; x+=Math.cos(h)*dr; y+=Math.sin(h)*dr; h+=Math.PI/n; push(); }
  return {name:'Space-Strecke', start:'Start', finish:'Raumstation', startElev:1000, space:true, ring, poly, segs:out};
}
let spaceKey=null;
const GEN_IDS=['space','insel'];
function genEntry(id){ const e=ROUTES.find(r=>r.id===id), S=curSegs(), u=curUnit(), f=ftp(), kg=weight(); // Strecken, die aus dem Workout entstehen
  const key=JSON.stringify([S.map(s=>[s.dur,s.a,s.b,!!s.free]),u,f,kg]); if(!e.def || e.key!==key){ e.def=(id==='insel'?islandDef:spaceDef)(S,u,f,kg); e.key=key; } return e; }

/* ================= Insel-Strecke: flach, harte Abschnitte = schwerer Untergrund ================= */
// Untergrund als gleichwertige Steigung: Rollwiderstand bremst wie Steigung (Crr 0,05 ≈ 5 %)
const ISL_RING=5000, ISL_CONN=1100;
const islandGrade=p=>p<=70?0:p<=80?(p-70)*0.3:spaceGrade(p);
const islMode=g=>g<1.5?0:g<4?1:g<8?2:3; // 0 Straße/Steg · 1 fester Sand · 2 weicher Sand · 3 Wasser (nach der Untergrund-Steigung sg)
// Physik: Untergrund bremst weniger stark – fester Sand 0,5–1,5 %, weicher Sand 1,5–3 %, Wasser 3–6 %
const ISL_PH=[[0,0],[1.5,0.5],[4,1.5],[8,3],[15,6]];
function islPhys(sg){ const T=ISL_PH; if(sg<=0) return 0; for(let i=1;i<T.length;i++) if(sg<=T[i][0]){ const [a,ga]=T[i-1],[b,gb]=T[i]; return ga+(gb-ga)*(sg-a)/(b-a); } return T[T.length-1][1]; }
const ISL_NAMES=['Küstenstraße','fester Sand','weicher Sand','flaches Wasser'], ISL_COL=['#8b9096','#e6d29e','#e9bf55','#2fc4d0'];
function islandDef(segs, unit, f, kg){
  const DT=2, T=segs.reduce((a,s)=>a+s.dur,0), raw=[];
  let si=0; for(let t=0;t<T;t+=DT){ while(si<segs.length-1 && t>=segs[si].t0+segs[si].dur) si++; const sg=segs[si];
    let p, w; if(sg.free){ p=105; w=f*1.05; } else { const v=segVal(sg,Math.min(t+DT/2,sg.t0+sg.dur)); p=unit==='w'?v/f*100:v; w=unit==='w'?v:v*f/100; }
    raw.push({p,w,g:islandGrade(p)}); }
  if(!raw.length) raw.push({p:50,w:f*.5,g:0});
  const out=raw.map((c,i)=>{ let s=0,n=0; for(let j=-6;j<=6;j++){ const o=raw[i+j]; if(o){ s+=o.g; n++; } } const sg=Math.round(s/n*100)/100, g=Math.round(islPhys(sg)*100)/100;
    return {len:Math.round(vSteady(c.w,g,kg)*DT*100)/100, g, sg, p:Math.round(c.p)}; });
  const Lw=out.reduce((a,s)=>a+s.len,0);
  out.push({len:ISL_CONN,g:0,p:-2},{len:ISL_RING,g:0,p:-1});
  let hs=11; for(const s of segs) hs=(hs*31+Math.round(s.dur)+Math.round(s.a*7)+(s.b==null?3:Math.round(s.b*11))+(s.free?5:0))%2147483647;
  const r=rng(hs+3);
  // Inseln: längere Küstenabschnitte, dazwischen Übergänge (Steg, Sandbank oder flaches Wasser – je nach Intensität)
  const isl=[]; let d=0, S=r()<.5?-1:1;
  for(;;){ const L=1800+r()*1700, e=d+L; if(e>Lw-600){ isl.push({d0:d,d1:Lw+ISL_CONN+ISL_RING+50,S,W:90+r()*110}); break; }
    isl.push({d0:d,d1:e,S,W:70+r()*130}); d=e+180+r()*200; if(r()<.5) S=-S; }
  const Sx=isl[isl.length-1].S, side=-Sx; // Atoll: außen = Meerseite der letzten Insel
  const l1=600+r()*300, l2=180+r()*90, f1=r()*6.28, f2=r()*6.28, hdAt=s=>0.7*Math.sin(s/l1+f1)+0.32*Math.sin(s/l2+f2);
  const poly=[[0,0]], DS=8; let x=0, y=0; d=0; const push=()=>poly.push([Math.round(x*100)/100,Math.round(y*100)/100]);
  while(d<Lw-1e-6){ const ds=Math.min(DS,Lw-d), h=hdAt(d+ds/2); x+=Math.cos(h)*ds; y+=Math.sin(h)*ds; d+=ds; push(); }
  // Zufahrt: dreht sanft auf geraden Kurs, damit die Atoll-Runde nicht über die alte Strecke läuft
  const h0=hdAt(Lw); for(let c=0;c<ISL_CONN-1e-6;){ const ds=Math.min(DS,ISL_CONN-c), m=c+ds/2, h=h0*(m<400?1-(m/400)*(m/400)*(3-2*m/400):0); x+=Math.cos(h)*ds; y+=Math.sin(h)*ds; c+=ds; push(); }
  const n=Math.ceil(ISL_RING/DS), dr=ISL_RING/n; let h=0;
  for(let i=0;i<n;i++){ h+=side*Math.PI/n; x+=Math.cos(h)*dr; y+=Math.sin(h)*dr; h+=side*Math.PI/n; push(); }
  return {name:'Insel-Strecke', start:'Start', finish:'Strandbar', startElev:0, island:true, ring:ISL_RING, conn:ISL_CONN, goal:Lw, isl, seed:hs, poly, segs:out};
}
// Pro Streckenpunkt: Meerseite, Landstreifen, Untergrund, Höhe der Fahrbahn
function prepIsland(r){
  const def=r.def, n=r.xs.length, kf=r.kf, I={S:new Int8Array(n), lo:new Float32Array(n), hi:new Float32Array(n), mode:new Uint8Array(n), cross:new Uint8Array(n), ring:new Uint8Array(n), py:new Float32Array(n), k:new Float32Array(n)};
  const lo0=new Float32Array(n), hi0=new Float32Array(n); let ii=0, sj=0; const segs=r.segs, isl=def.isl.map(o=>({...o,d0:o.d0*kf,d1:o.d1*kf}));
  for(let i=0;i<n;i++){ const d=i*STEP; while(sj<segs.length-1 && segs[sj].d0+segs[sj].len<=d) sj++; const g=segs[sj].sg??segs[sj].g;
    while(ii<isl.length-1 && isl[ii].d1<=d) ii++; const o=isl[ii], inIsl=d>=o.d0&&d<o.d1, isRing=d>=r.len-r.ring, isConn=d>=r.goal&&!isRing;
    const m=isRing||isConn?0:islMode(g), k=Math.min(1,Math.max(0,(g-8)/14)); I.mode[i]=m; I.k[i]=k; I.ring[i]=isRing?1:0;
    if(inIsl||isConn||isRing){ I.S[i]=o.S; lo0[i]=isRing?-22:-o.W; hi0[i]=isRing?40:[38,6,15,-(6+14*k)][m]; }
    else { I.cross[i]=1; const prev=isl[ii-1]||o; I.S[i]=d<(prev.d1+o.d0)/2?prev.S:o.S;
      const xw=[-30,7,13,-(6+14*k)][m]; lo0[i]=-xw; hi0[i]=xw; } }
  const W=15; for(let i=0;i<n;i++){ let a=0,b=0,c=0; for(let j=-W;j<=W;j++){ const q=Math.min(n-1,Math.max(0,i+j)); a+=lo0[q]; b+=hi0[q]; c++; } I.lo[i]=a/c; I.hi[i]=b/c; }
  const py0=new Float32Array(n); for(let i=0;i<n;i++) py0[i]=I.cross[i]&&I.mode[i]===0?1.1:islH(I,i,0);
  for(let i=0;i<n;i++){ let a=0,c=0; for(let j=-6;j<=6;j++){ const q=Math.min(n-1,Math.max(0,i+j)); a+=py0[q]; c++; } I.py[i]=a/c; }
  r.I=I;
}
function islH(I,i,u){ // Geländehöhe quer zur Strecke (u: positiv = Meerseite)
  const e=Math.min(u-I.lo[i], I.hi[i]-u); if(e>=0) return Math.min(1.8,e*0.09);
  const t=-e; let h=-(t<20?t*0.03:0.6+(t-20)*0.035); if(I.ring[i]&&u<0) h=Math.max(h,-2.4); return Math.max(h,-8.5); }

/* ================= Stadionrunde: 400 m wie eine Laufbahn, Kurven überhöht wie im Velodrom ================= */
function stadionDef(){
  const {L,r}=ST, poly=[], sp=1;
  const line=(x0,z0,x1,z1)=>{ const n=Math.round(Math.hypot(x1-x0,z1-z0)/sp); for(let i=0;i<n;i++) poly.push([x0+(x1-x0)*i/n, z0+(z1-z0)*i/n]); };
  const arc=(cx,a0,a1)=>{ const n=Math.round(Math.abs(a1-a0)*r/sp); for(let i=0;i<n;i++){ const a=a0+(a1-a0)*i/n; poly.push([cx+r*Math.cos(a), r*Math.sin(a)]); } };
  // Start/Ziel mitten auf der Geraden, auf der man auf die Westkurve (von oben links) zufährt
  line(0,-r,-L/2,-r); arc(-L/2,-Math.PI/2,-3*Math.PI/2); line(-L/2,r,L/2,r); arc(L/2,Math.PI/2,-Math.PI/2); line(L/2,-r,0,-r); poly.push([0,-r]);
  return {name:'Stadionrunde', start:'Start', finish:'Ziel', startElev:0, stadium:true, loop:true, poly, segs:[{len:400,g:0}]};
}
function prepStadium(r){
  r.loop=true; r.stadium=true; r.kehren=[]; r.fans=r.len; r.town=0; r.vine=0; r.S=null;
  const n=r.xs.length-1, raw=new Float32Array(n), k=new Float32Array(n);
  for(let i=0;i<n;i++){ const d=i*STEP; raw[i]=Math.min(1,Math.abs(angDiff(headingAt(r,d+8),headingAt(r,d-8)))/(16/ST.r)); }
  for(let i=0;i<n;i++){ let s=0; for(let j=-6;j<=6;j++) s+=raw[(i+j+n)%n]; k[i]=s/13; }
  r.bank=new Float32Array(n); for(let i=0;i<n;i++){ const t=Math.min(1,k[i]*1.15); r.bank[i]=(ST.BANK0+(ST.BANK1-ST.BANK0)*t*t*(3-2*t))*Math.PI/180; }
  const [x,z]=posAt(r,0), h=headingAt(r,0); r.outSign=Math.sign(-Math.sin(h)*x+Math.cos(h)*z)||1;
}
function bankAt(d){ const n=R.bank.length, f=((d%R.len)+R.len)%R.len/STEP, i=Math.floor(f)%n, t=f-Math.floor(f); return R.bank[i]+(R.bank[(i+1)%n]-R.bank[i])*t; }
function trackPt(d,u){ // Punkt auf der Bahn: d entlang, u quer von der Innenkante nach außen
  const [x,z]=posAt(R,d), hd=headingAt(R,d), o=R.outSign, b=bankAt(d);
  return [x-Math.sin(hd)*o*u, u>0?u*Math.tan(b):0, z+Math.cos(hd)*o*u];
}

