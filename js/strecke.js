/* ================= Strecke ================= */
const ST={L:84.39, r:36.80, TW:7.5, Xs:98, Zs:55, BANK0:12, BANK1:43};
const ST_RH=0.8, ST_TIER={at:11,gap:2.6,step:1.4}, TOWER_H=36; // Tribünen steiler, Längsseiten zweirangig, Ecktürme höher
const STEP=2;            // Abstand der Streckenpunkte in m
const SIDEWALK=1.4;      // Gehweg im Ort (eng wie in Maikammer)
const ROAD_W=6;          // Straßenbreite in m
let R=null;              // aktuelle Strecke

// Kalmit-Ostrampe nach echter GPX (komoot, Maikammer → Kalmithaus): [Ost m, Süd m, Höhe m]
const KALMIT_GPX=[[0.0,-0.0,182.1],[-52.5,-27.0,182.1],[-66.5,-35.3,182.1],[-108.8,-60.6,182.9],[-179.2,-92.0,185.2],[-207.2,-104.3,186.1],[-220.6,-110.4,186.6],[-257.3,-126.6,187.8],[-302.7,-147.2,189.7],[-333.2,-161.3,191.1],[-347.6,-167.8,191.7],[-369.4,-178.2,192.7],[-389.6,-187.4,193.6],[-410.7,-196.1,194.5],[-565.5,-268.2,200.7],[-596.1,-282.0,201.8],[-612.8,-291.1,202.4],[-621.8,-298.0,202.8],[-641.9,-312.5,203.6],[-652.8,-316.1,204.0],[-721.9,-319.6,206.2],[-783.5,-315.5,208.2],[-865.0,-310.5,211.0],[-973.2,-310.1,215.0],[-996.3,-304.6,215.9],[-1080.0,-273.0,219.2],[-1144.0,-258.1,221.6],[-1172.6,-258.0,222.6],[-1245.2,-269.9,225.9],[-1308.9,-268.1,229.4],[-1342.6,-271.4,231.3],[-1373.9,-281.1,233.2],[-1453.5,-321.7,238.9],[-1508.4,-335.5,242.9],[-1526.8,-338.5,244.2],[-1572.6,-348.6,247.5],[-1669.0,-386.6,255.3],[-1707.2,-394.5,258.3],[-1771.7,-403.6,263.3],[-1804.2,-411.9,265.9],[-1919.6,-455.5,276.4],[-1940.5,-466.3,278.4],[-1962.9,-482.3,280.8],[-2036.3,-556.2,289.8],[-2062.0,-575.4,292.6],[-2068.3,-578.0,293.2],[-2076.9,-581.2,294.0],[-2096.6,-587.0,295.7],[-2103.2,-589.1,296.4],[-2112.7,-592.6,297.2],[-2120.4,-596.0,298.0],[-2126.0,-599.3,298.5],[-2150.3,-616.4,300.5],[-2155.0,-619.0,300.8],[-2161.6,-622.1,301.2],[-2168.8,-624.7,301.6],[-2176.9,-626.7,302.0],[-2185.0,-628.2,302.5],[-2221.9,-625.8,304.5],[-2228.7,-627.5,304.9],[-2233.4,-633.5,305.3],[-2230.7,-642.2,305.8],[-2222.9,-646.1,306.3],[-2193.9,-650.7,307.9],[-2144.5,-663.4,310.7],[-2101.4,-668.2,313.2],[-2028.6,-677.1,317.4],[-1969.0,-681.5,320.8],[-1940.3,-679.8,322.2],[-1905.6,-671.1,323.6],[-1889.7,-663.8,324.3],[-1864.4,-647.5,325.5],[-1859.3,-644.1,325.8],[-1822.5,-611.4,327.7],[-1798.2,-599.3,328.8],[-1768.5,-597.9,330.4],[-1735.9,-605.8,334.0],[-1723.0,-612.4,335.6],[-1710.6,-628.2,337.8],[-1687.4,-686.3,344.5],[-1683.5,-733.3,349.6],[-1687.8,-764.1,352.9],[-1696.0,-787.3,355.5],[-1705.1,-802.5,357.4],[-1724.9,-825.7,360.6],[-1755.3,-848.4,364.5],[-1806.4,-876.5,370.6],[-1846.7,-891.7,373.1],[-1870.6,-893.2,373.9],[-1889.8,-887.0,374.7],[-1911.7,-871.7,375.6],[-1927.0,-870.2,376.2],[-1954.1,-873.7,377.2],[-1962.4,-874.6,377.5],[-1984.9,-872.9,378.3],[-2029.5,-860.1,380.1],[-2155.2,-850.3,385.2],[-2227.2,-852.6,388.5],[-2312.1,-871.4,393.7],[-2335.7,-874.3,395.1],[-2530.4,-856.7,409.3],[-2579.8,-858.6,413.3],[-2613.3,-864.4,416.2],[-2641.9,-874.8,419.5],[-2708.0,-908.6,427.7],[-2760.8,-940.5,434.4],[-2840.2,-997.3,444.3],[-2972.1,-1075.2,459.6],[-3014.1,-1103.6,465.1],[-3066.0,-1142.9,472.2],[-3109.7,-1184.8,478.8],[-3125.3,-1192.6,480.3],[-3138.8,-1192.5,481.5],[-3147.1,-1188.7,482.3],[-3164.8,-1175.2,484.3],[-3173.6,-1162.8,485.6],[-3186.9,-1128.0,488.9],[-3202.1,-1099.0,491.8],[-3206.2,-1080.5,493.5],[-3203.6,-1007.2,499.4],[-3198.4,-959.8,502.9],[-3195.2,-856.0,510.7],[-3194.8,-842.6,511.6],[-3188.3,-812.7,513.5],[-3167.5,-762.4,516.9],[-3113.9,-649.6,524.4],[-3112.9,-635.7,525.1],[-3118.9,-625.1,525.6],[-3126.6,-619.4,526.1],[-3134.6,-617.8,526.5],[-3150.4,-623.0,527.3],[-3170.9,-638.0,528.5],[-3247.9,-709.3,533.7],[-3257.2,-714.1,534.3],[-3293.2,-724.4,536.7],[-3324.7,-737.7,538.9],[-3358.4,-756.4,541.3],[-3388.8,-777.2,543.7],[-3399.9,-794.8,545.0],[-3403.3,-816.7,546.7],[-3406.5,-889.2,553.4],[-3409.9,-905.4,554.9],[-3422.9,-939.4,558.2],[-3445.3,-978.8,562.3],[-3457.2,-1012.2,565.0],[-3460.3,-1050.0,567.3],[-3457.6,-1151.4,573.3],[-3449.4,-1214.8,577.0],[-3440.5,-1252.9,579.2],[-3429.8,-1286.8,581.1],[-3405.2,-1338.3,584.3],[-3344.4,-1458.1,594.2],[-3348.0,-1470.0,595.3],[-3346.9,-1477.5,595.9],[-3337.8,-1512.2,598.9],[-3325.0,-1540.7,601.5],[-3324.6,-1560.5,603.2],[-3331.6,-1572.0,604.4],[-3342.8,-1579.4,605.7],[-3625.3,-1642.5,630.1],[-3667.3,-1641.7,632.9],[-3725.0,-1626.2,636.0],[-3745.4,-1616.6,636.3],[-3753.2,-1610.3,636.5],[-3761.5,-1599.1,636.6],[-3763.8,-1588.2,636.8],[-3764.2,-1586.6,636.8],[-3762.6,-1572.8,637.0],[-3761.3,-1563.0,637.1],[-3744.1,-1554.1,637.4],[-3715.4,-1533.5,637.9],[-3712.4,-1531.6,637.9],[-3669.9,-1486.7,639.0],[-3624.5,-1429.4,641.0],[-3594.9,-1395.0,642.3],[-3585.7,-1388.4,642.6],[-3570.2,-1384.5,643.0],[-3554.9,-1387.5,643.4],[-3541.4,-1395.5,643.9],[-3525.7,-1411.6,644.0],[-3518.3,-1423.2,644.0],[-3513.2,-1431.5,644.0]];
// Südpfalz-Klassiker nach echter GPX (komoot, Godramstein → Arzheim → Ilbesheim → Leinsweiler → Ranschbach → Siebeldingen, Runde): [Ost m, Süd m, Höhe m]
const SUEDPFALZ_GPX=[[0,0,176.2],[0.4,10.8,176.2],[-18.9,122.8,176.4],[-10.5,125.3,176.4],[-41.1,294.9,177.8],[-41.7,335.4,177.7],[-39.4,361.7,177.6],[-26.1,498.9,177],[-24.2,562.9,176.3],[-28.1,630.7,175.5],[-43.9,699,175.3],[-46.4,709,175.7],[-48.6,717.2,176],[-56.7,754.7,177.4],[-57.2,759.1,177.5],[-57.2,763.6,177.7],[-51.1,815.6,179.6],[-45.7,855.8,181.1],[-47.2,872.7,181.7],[-56.8,897,182.4],[-82.2,933.9,183.2],[-89.2,944.4,183.4],[-93.7,950.5,183.5],[-116.2,984.3,184.3],[-165.2,1086.9,186.3],[-167,1091,186.4],[-171.5,1101.4,186.6],[-172.3,1114.1,186.8],[-176.8,1119.4,187],[-181,1130.7,187.2],[-180.8,1135.3,187.3],[-180.4,1145.2,187.5],[-192,1157.4,187.8],[-221.9,1170.7,188.4],[-240.6,1177,188.8],[-258.5,1178.4,189.2],[-292.9,1174,190.2],[-340.7,1156.8,192.3],[-352.8,1157.2,192.8],[-374.7,1165.9,193.7],[-404.4,1187.2,195.2],[-423.9,1194,196.1],[-440.5,1196.5,196.7],[-452.8,1195,197.2],[-459.9,1187.9,197.7],[-472.5,1162.7,198.7],[-479,1154.6,199.1],[-490.8,1150.1,199.5],[-509.8,1149.1,200.2],[-529.9,1148.3,201],[-536.7,1145.4,201.3],[-565.7,1125.1,202.6],[-586.9,1121,203.4],[-616.9,1124.8,204.5],[-673,1139.1,205.9],[-741,1164.3,207.3],[-808.7,1184.1,208.6],[-858.5,1198.9,209.7],[-903.6,1211.4,210.6],[-1154.7,1287.6,215.4],[-1182.2,1296,215.9],[-1212.5,1304.5,216.5],[-1255.4,1322.3,217.5],[-1287.1,1343.9,218.4],[-1327.8,1396.4,219.9],[-1414,1538.2,225.6],[-1436.2,1576.7,227.3],[-1440.4,1583.6,227.6],[-1490.9,1667.4,227.6],[-1524.5,1713.4,226.9],[-1536.3,1727.3,226.7],[-1570.8,1770.7,225.9],[-1598.1,1799.5,223.8],[-1616.1,1810.7,222.8],[-1649.5,1825.9,220.9],[-1797.3,1887.5,213.8],[-1813.5,1894.3,213.2],[-1913.1,1937.1,209.5],[-1957.1,1963.1,208.8],[-1989,1989.5,208.5],[-2013.9,2019.5,208.2],[-2028,2041.4,208],[-2048.2,2079.5,207.7],[-2054.2,2096.6,207.8],[-2059,2113.3,208.1],[-2063.3,2129.9,208.4],[-2085.9,2222.3,210],[-2121.7,2223.1,210.7],[-2267.1,2226,212.9],[-2470,2233.9,216.3],[-2489.2,2234.7,216.7],[-2592.7,2247,218.8],[-2747.5,2275.8,222.3],[-2879.8,2301.5,223.7],[-2987.2,2312.6,225.1],[-3052.9,2323.1,226.2],[-3286.1,2367.8,230.6],[-3329.9,2372.3,231.5],[-3472.4,2387.8,233.3],[-3497.5,2391.6,233.6],[-3534.2,2397,234.1],[-3632.1,2416.6,235.6],[-3682,2427.4,236.3],[-3688.1,2428.8,236.4],[-3703.9,2432.4,236.6],[-3759.6,2445.1,237.7],[-3836.1,2462.9,239.4],[-3871.7,2471.2,240.2],[-3910.5,2477.9,241],[-3941.9,2478.6,241.8],[-3971.1,2476.9,242.5],[-3989.9,2475.3,242.9],[-3995,2474.9,243.1],[-4054,2466.9,244.5],[-4095.4,2457.6,245.6],[-4160.2,2436.2,246.4],[-4175.8,2431.8,246.4],[-4196.3,2423.2,246.5],[-4217.1,2414.3,246.6],[-4212.9,2407.6,246.6],[-4204,2395,246.6],[-4199.2,2390.5,246.6],[-4197.1,2388.7,246.7],[-4193.2,2385.2,246.7],[-4185.3,2379.9,246.7],[-4163.1,2361.3,246.8],[-4152.7,2355.6,246.8],[-4142.4,2353.1,246.8],[-4134.2,2354.7,246.7],[-4089.6,2368.1,245.8],[-4050.8,2372,245.1],[-4048.5,2372.2,245.1],[-4013.9,2375.7,244.5],[-3994.8,2377.6,244.1],[-3986.1,2378.3,244],[-3963.5,2380.1,243.6],[-3938.7,2381.7,243.3],[-3917,2378.9,243.4],[-3899.5,2373.7,243.4],[-3872.2,2359.8,243.6],[-3857.4,2349.3,243.6],[-3785,2285.7,244],[-3754.3,2262.8,244.6],[-3658.7,2205.9,246.6],[-3632.4,2176.3,247.4],[-3614.6,2141.6,248.1],[-3601,2089.8,249.3],[-3589,2052.3,250.2],[-3582.7,2040.2,250.5],[-3568.1,2015.6,251.1],[-3507.1,1937.8,254.4],[-3498.4,1915.3,255.5],[-3495.5,1907.7,255.8],[-3492.1,1881.3,256.9],[-3497.9,1842.6,258.6],[-3508.9,1816.3,259.8],[-3512.6,1811.1,260.1],[-3555.9,1761.1,262.1],[-3605.6,1711.7,264],[-3663.7,1649,266],[-3682.7,1618.9,265.8],[-3690.6,1588.5,265.6],[-3691.6,1559.8,265.4],[-3688,1537.9,265.3],[-3673.6,1503.7,265.1],[-3614.4,1433.6,264.8],[-3606.1,1425.2,264.8],[-3517.4,1330.1,264.6],[-3496.4,1312.2,264.4],[-3453,1290.2,264],[-3419.2,1284.1,263.8],[-3329.2,1278.1,263],[-3274.9,1274.3,261.9],[-3247.2,1265.4,261.2],[-3226.2,1249.4,260.6],[-3210.8,1224.4,260],[-3205.8,1194,259.3],[-3207.4,1183,259.1],[-3214,1166.3,258.7],[-3219.6,1155.1,258.3],[-3231,1141.6,257.7],[-3256.9,1122.4,256.6],[-3333.7,1064.5,253.5],[-3400.4,1013.5,250.7],[-3457.1,972.3,248.2],[-3466.9,962.3,247.7],[-3470.5,952.1,247.4],[-3471.3,926.1,246.5],[-3469.1,923.9,246.4],[-3459.4,922.3,246],[-3453.5,921.5,245.8],[-3445.3,920.1,245.5],[-3434.2,918.5,245.1],[-3428.9,916.9,245],[-3420.7,909.6,244.7],[-3398.5,878.3,243.6],[-3383.2,863.5,243],[-3361.3,851.9,242.3],[-3328.2,837.7,241.3],[-3317.1,833.3,241],[-3309.4,830.2,240.8],[-3270.4,815.5,239.6],[-3258.4,812.1,239.3],[-3245.2,808.5,239],[-3226.2,804.3,238.6],[-3220.4,802.6,238.5],[-3214.3,800.8,238.3],[-3202.1,796.4,238],[-3166.8,782.3,237.2],[-3156.1,777.8,237],[-3139.9,771.6,236.6],[-3118.1,762,236.1],[-3109.6,758.7,235.9],[-3104.7,757.1,235.7],[-3069,746.8,235.1],[-3040.4,744.2,234.9],[-3023.3,743.7,234.7],[-3009.7,743.4,234.6],[-2997.8,742.8,234.5],[-2993.3,742.6,234.5],[-2990.6,742.4,234.4],[-2970.3,739.3,234.3],[-2952.6,734.7,234.1],[-2943.2,731,234],[-2924.1,720.8,233.9],[-2904.2,702.8,233.6],[-2890.5,681,233.5],[-2866.7,613.1,233.1],[-2855.1,574.7,232.9],[-2837.1,539,232.8],[-2826.5,522.8,232.7],[-2778.3,464.9,230],[-2706.5,378,225.3],[-2703.2,373.9,225],[-2678.5,348.5,224.2],[-2655.4,325.9,224.2],[-2644.4,329.1,224.2],[-2639.8,330.4,224.2],[-2606.6,339.8,224.3],[-2481.5,392.5,225.2],[-2462.8,397.6,225.6],[-2438,397.9,226.2],[-2414.3,395.1,226.7],[-2349.4,380,228.3],[-2185.5,329.1,232.3],[-2147.5,420.2,233.8],[-2109.2,522.2,234],[-2018.2,513.4,233.3],[-1944.1,511.5,231.6],[-1868.3,515.3,229.9],[-1789.9,518.1,228],[-1664,511.7,225],[-1542.4,500.3,221.7],[-1429.1,495.2,218.3],[-1374.5,503.2,216.1],[-1339.7,512.4,214.6],[-1155.7,574.5,206.9],[-1088.9,586.9,204.2],[-970.6,603.3,200.8],[-954.9,606.5,200.3],[-932,607.6,199.7],[-852.8,598.5,197.4],[-852,588.6,197.1],[-852,555.3,195.9],[-865.6,471.4,192.9],[-869.3,463.7,192.6],[-907.5,383.5,189.1],[-952.7,332.7,186.3],[-961.7,319.7,185.6],[-1001.3,165,178.9],[-983.5,160.3,178.1],[-894.9,143.2,174.3],[-878.6,135.5,173.6],[-872.7,129.7,173.3],[-863,87.4,171.7],[-866.6,42.7,170.1],[-874,-46.4,166.8],[-882.4,-149.1,166.1],[-861.8,-148.9,166],[-808.6,-139.2,165.6],[-784.6,-137.1,165.4],[-682.7,-139.2,165.4],[-505.3,-129.2,164.9],[-436.6,-125,164.6],[-192.2,-105.2,166.5],[-177.3,-99.6,166.5],[-155.3,-76.2,166.5],[-126,-51.1,166.5],[-75.9,-37.4,166.5],[-16.8,-34.5,166.5],[-5.7,-27.4,166.5],[-0.6,-16.5,166.5],[-0.2,-7.6,166.5]];
function gpxDef(G,minR=0){
  // Ecken der GPX glätten (Chaikin), damit Kehren rund werden
  let P=G.map(p=>[p[0],p[1],p[2]]);
  for(let it=0;it<3;it++){ const Q=[P[0]]; for(let i=0;i<P.length-1;i++){ const a=P[i], b=P[i+1];
      Q.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25,a[2]*.75+b[2]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75,a[2]*.25+b[2]*.75]); } Q.push(P[P.length-1]); P=Q; }
  if(minR) P=roundCorners(P,minR);
  const poly=P.map(p=>[p[0],p[1]]), cum=[0]; for(let i=1;i<P.length;i++) cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const L=cum[cum.length-1], eAt=d=>{ let i=1; while(i<cum.length-1&&cum[i]<d) i++; const t=(d-cum[i-1])/Math.max(1e-6,cum[i]-cum[i-1]); return P[i-1][2]+(P[i][2]-P[i-1][2])*Math.min(1,Math.max(0,t)); };
  const SEG=100, segs=[]; for(let d=0; d<L-1; d+=SEG){ const len=Math.min(SEG,L-d); segs.push({len, g:(eAt(d+len)-eAt(d))/len*100}); }
  return {startElev:P[0][2], poly, segs};
}
// Zu enge Ecken (Radius < minR) nachglätten, sonst faltet sich die Straße: Punkte alle 2 m, nur um die engen Stellen herum mitteln
function roundCorners(P,minR){ const Q=[P[0]]; let carry=0;
  for(let i=1;i<P.length;i++){ let a=P[i-1].slice(); const b=P[i]; let L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    while(carry+L>=2){ const t=(2-carry)/L; a=a.map((v,k)=>v+(b[k]-v)*t); Q.push(a.slice()); L=Math.hypot(b[0]-a[0],b[1]-a[1]); carry=0; } carry+=L; }
  Q.push(P[P.length-1].slice()); const n=Q.length, rad=i=>{ const a=Q[i-3], b=Q[i], c=Q[i+3], t=Math.abs(angDiff(Math.atan2(c[1]-b[1],c[0]-b[0]),Math.atan2(b[1]-a[1],b[0]-a[0]))); return t<1e-4?1e9:6/t; };
  for(let pass=0;pass<60;pass++){ const tight=[]; for(let i=3;i<n-3;i++) if(rad(i)<minR) tight.push(i); if(!tight.length) break;
    const on=new Uint8Array(n); tight.forEach(i=>{ for(let k=-6;k<=6;k++) if(i+k>2&&i+k<n-3) on[i+k]=1; });
    const old=Q.map(p=>p.slice()); for(let i=3;i<n-3;i++) if(on[i]) for(const k of [0,1]) Q[i][k]=(old[i-2][k]+old[i-1][k]+old[i][k]+old[i+1][k]+old[i+2][k])/5; }
  return Q; }
// Runde: die Höhenmessung driftet (komoot: am Ziel fast 10 m tiefer als am Start, obwohl gleicher Ort) – Abweichung gleichmäßig über die Strecke herausrechnen
function hoeheSchliessen(G){ const c=[0]; for(let i=1;i<G.length;i++) c.push(c[i-1]+Math.hypot(G[i][0]-G[i-1][0],G[i][1]-G[i-1][1])); const L=c[c.length-1], dz=G[0][2]-G[G.length-1][2];
  return G.map((p,i)=>[p[0],p[1],+(p[2]+dz*c[i]/L).toFixed(1)]); }
// GPS schneidet enge Ecken ab: Punkte zwischen i und k durch eine scharfe Ecke im Schnittpunkt der Geraden G[i]→G[j] und G[k]→G[l] ersetzen.
// Liefert die neuen Punkte und die Ecke samt Richtung, in der die Hauptstraße geradeaus weiterläuft (für die Einmündung)
function scharfeEcke(G,i,j,k,l){ const [p,q,a,b]=[G[i],G[j],G[k],G[l]], ux=q[0]-p[0], uy=q[1]-p[1], vx=b[0]-a[0], vy=b[1]-a[1], lu=Math.hypot(ux,uy), lv=Math.hypot(vx,vy);
  const t=((a[0]-p[0])*vy-(a[1]-p[1])*vx)/(ux*vy-uy*vx), cx=p[0]+ux*t, cy=p[1]+uy*t, s1=Math.hypot(cx-p[0],cy-p[1]), s2=Math.hypot(a[0]-cx,a[1]-cy), e=p[2]+(a[2]-p[2])*s1/(s1+s2);
  return {G:[...G.slice(0,i+1), [cx-ux/lu*8,cy-uy/lu*8,e], [cx,cy,e], [cx+vx/lv*8,cy+vy/lv*8,e], ...G.slice(k)], kreuz:[{x:cx, y:cy, ux:-vx/lv, uy:-vy/lv}, {x:cx, y:cy, ux:ux/lu, uy:uy/lu}]}; } // Einmündungen: Gegenrichtung des Ausgangs und geradeaus weiter
// Landschaftsabschnitte: [Art, von m, bis m, Optionen] – Art: 'ort', 'reben', 'feld', 'hain' (dichte Laubbäume und Büsche), 'wald' (außerhalb aller Abschnitte: Wald)
// Art 'wiese': Talwiese mit Obstbäumen (Bachtal Berwartstein)
// Optionen Ort: licht:0 (keine Laternen), fach (Anteil Fachwerk), luecke (Anteil größerer Lücken), geh (Gehwegbreite), seite (-1 links/1 rechts: nur eine Seite bebaut), abzweig (-1 links/1 rechts: Seitenstraße vor dem letzten Haus),
//   gewaende (Anteil rote Sandstein-Gewände), laden (bevorzugte Ladenfarbe 0–2), ranken (Anteil Weinranken an der Fassade),
//   quader / giebel / solar (Anteil Sandstein-Quader-Fassaden, giebelständige Häuser, Solardächer),
//   teile: [[von, bis, {Optionen}]] Ortsteile mit eigenen Optionen, dazu neu (Neubaugebiet mit Vorgärten), obst / reben (unbebaute Seite mit Obstbäumen bzw. Rebzeilen), strbaum (Bäumchen im Gehweg)
// Landstraße: mitte [[von, bis]] Leitlinie · saum / allee / radweg [[von, bis, Seite (0 = beide)]] Gebüsch, Baumreihe, Radweg hinter Grünstreifen · bogen [d oder [d, Schrifttafel]] Weinlaub-Bogen · planke [[von, bis]] Leitplanke auf der Talseite
// Optionen Reben: baum (Anteil Obstbäume am Rand), weg (mittlerer Abstand kreuzender Wirtschaftswege in m)
// kom: [Anstieg ab, Bergwertung bei, Name] · breite: [von, bis, Straßenbreite m] · belag: [Art, von, bis, Zusatzsteigung % bei 75 kg] – Art 'pflaster' oder 'beton'
function kalmitDef(){ return Object.assign(gpxDef(KALMIT_GPX), {name:'Kalmit-Ostrampe', start:'Maikammer', finish:'Kalmit · 673 m', plainElev:110, kalmit:true, gpx:'kalmit', zones:[['ort',0,800],['reben',800,2300]]}); }
// Burg Berwartstein (Fantasy-Anstieg ab Erlenbach): frei erfundene Linie. Wegpunkte [Ost m, Süd m, Radius der Ecke m] – gerade Stücke, Ecken als Kreisbogen
const BURG_VOR=20; // Vorlauf vor dem Ortseingang: der Start liegt 20 m vor Erlenbach, damit man am Bauernfest vorbeifährt – alle Meterangaben der Strecke zählen ab hier
const BURG_WEG=[[0,BURG_VOR],[0,0],[0,-130,9],[170,-150,9],[200,-470,60], [330,-700,90],[520,-820,90],[650,-1000,40], // Erlenbach · Bachtal mit Mühle
  [250,-1050,12],[600,-1140,12],[250,-1230,12],[600,-1320,12], // untere Kehren im Wald
  [330,-1400,50],[150,-1450,50],[30,-1600,60],[150,-1750,50],[300,-1780,30], // Felsenpfad
  [600,-1820,12],[280,-1890,12],[600,-1960,12],[280,-2030,12], // obere Kehren unter der Burg
  [520,-2070,60],[700,-2030,80],[810,-2150,80],[760,-2310,70],[600,-2340,50],[440,-2290,22],[599,-2233]]; // Schlussrampe um den Burgfelsen, letzte Rechtskurve, Zugbrücke über den Halsgraben, Torturm, Turnierwiese
// Steigung je Abschnitt [bis m, %, Schwankung ± %]
const BURG_PROF=[[320,1.5,.4],[636,2.5,.5],[1320,3.5,.5],[2791,8,1],[3498,5.5,.5],[4580,9,1],[5430,12,1],[5488,9,.5],[5526,1,0],[1e9,.5,0]]; // Zugbrücke 5490–5524, Torturm 5528, Ziel ~5588 · Turnierwiese fast eben
function eckenWeg(W,ds=2){ const out=[[W[0][0],W[0][1]]]; let cur=[W[0][0],W[0][1]];
  const seg=(a,b)=>{ const L=Math.hypot(b[0]-a[0],b[1]-a[1]), n=Math.max(1,Math.round(L/ds)); for(let i=1;i<=n;i++) out.push([a[0]+(b[0]-a[0])*i/n, a[1]+(b[1]-a[1])*i/n]); };
  for(let i=1;i<W.length-1;i++){ const P=W[i], A=W[i-1], B=W[i+1], r=P[2]||0, u=[P[0]-A[0],P[1]-A[1]], v=[B[0]-P[0],B[1]-P[1]], lu=Math.hypot(...u), lv=Math.hypot(...v); u[0]/=lu; u[1]/=lu; v[0]/=lv; v[1]/=lv;
    const th=Math.acos(Math.max(-1,Math.min(1,u[0]*v[0]+u[1]*v[1]))), t=r*Math.tan(th/2); if(!r||th<1e-3){ seg(cur,P); cur=[P[0],P[1]]; continue; }
    const p1=[P[0]-u[0]*t,P[1]-u[1]*t], s=Math.sign(u[0]*v[1]-u[1]*v[0]), cx=p1[0]-u[1]*s*r, cz=p1[1]+u[0]*s*r, a0=Math.atan2(p1[1]-cz,p1[0]-cx), n=Math.max(2,Math.round(r*th/ds)); seg(cur,p1);
    for(let k=1;k<=n;k++){ const a=a0+s*th*k/n; out.push([cx+Math.cos(a)*r, cz+Math.sin(a)*r]); } cur=[P[0]+v[0]*t,P[1]+v[1]*t]; }
  seg(cur,W[W.length-1]); return out; }
function berwartsteinDef(){ const P=eckenWeg(BURG_WEG), G=[[P[0][0],P[0][1],215]]; let d=0;
  for(let i=1;i<P.length;i++){ const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]), m=d+l/2, [,g,s]=BURG_PROF.find(p=>m<p[0]); G.push([P[i][0],P[i][1],G[i-1][2]+l*(g+s*Math.sin(m/130))/100]); d+=l; }
  return Object.assign(gpxDef(G), {name:'Burg Berwartstein', start:'Erlenbach', finish:'Burg Berwartstein', plainElev:200, gpx:'berwartstein', burg:true, steil:true, // steil: Überhöhung in deiner Nähe wie an der Kalmit
   
    zones:[['wiese',0,20],['ort',20,350,{fach:.6,gewaende:.4,geh:.5,luecke:.2,licht:0}],['wiese',350,1320]], breite:[[-50,6100,4.4]], // Vorlauf und Bachtal als Wiese, Altort ohne Laternen, sonst Wald
    belag:[['pflaster',0,365,.8],['erde',365,992,0],['holz',992,1010,0],['erde',1010,4580,0],['pflaster',4580,5490,1],['holz',5490,5524,0],['pflaster',5524,1e9,1]]}); } // Kopfstein im Dorf und an der Schlussrampe, Holzbrücke über den Bach
// Runde an der Stelle V (m) neu beginnen lassen: Punkt dort einfügen, das Stück davor hinten anhängen
function rundeAb(G,V){ let c=0; const n=G.length, zu=Math.hypot(G[n-1][0]-G[0][0],G[n-1][1]-G[0][1])<1; // zu: GPX endet schon am Anfang
  for(let i=1;i<n;i++){ const a=G[i-1], b=G[i], l=Math.hypot(b[0]-a[0],b[1]-a[1]); if(c+l>=V){ const t=(V-c)/l, P=a.map((v,k)=>v+(b[k]-v)*t); return [P,...G.slice(i),...G.slice(zu?1:0,i),P]; } c+=l; }
  return G; }
const SP_V=350; // Start/Ziel 350 m hinter dem komoot-Start (K9 an der B10, außerhalb von Godramstein)
function suedpfalzDef(loop){ const V=SP_V, E=scharfeEcke(hoeheSchliessen(SUEDPFALZ_GPX),24,31,33,36), g=gpxDef(rundeAb(E.G,V),10); // Arzheim: scharf rechts auf die Hauptstraße, die links weiterläuft
  let Lp=0; for(let i=1;i<g.poly.length;i++) Lp+=Math.hypot(g.poly[i][0]-g.poly[i-1][0],g.poly[i][1]-g.poly[i-1][1]);
  // Alle Angaben unten in komoot-Metern ab dem alten Start, hier auf die neue Runde umgerechnet. Ein Bereich darf den neuen Start nicht überspannen; Ende null = bis zum alten Start
  const um=d=>d>=V?d-V:d-V+Lp, ur=(a,b)=>[um(a), b==null?Lp-V:b<=V?b-V+Lp:b-V], Z=L=>L.map(([a,b,...x])=>[...ur(a,b),...x]);
  const zones=[['hain',0,150],['feld',150,350],['feld',350,700],['hain',700,1000],['ort',1000,2350,{fach:.2,gewaende:.6,ranken:.25,teile:[[1800,2350,{neu:1}]],geh:1,abzweig:-1,name:'Arzheim',kreis:'Stadt Landau in der Pfalz'}],['reben',2350,3500,{baum:.1,weg:300}],['reben',3500,3760,{baum:.1,weg:300}],
    ['reben',3760,5400,{baum:.1,weg:350}],['ort',5400,6200,{fach:.5,geh:.6,teile:[[5400,5530,{seite:-1,neu:1,obst:1}],[5530,5630,{luecke:.6,fach:.2}],[5630,5960,{fach:.55,gewaende:.85,laden:2,ranken:.35}],[5960,6200,{neu:1}]],name:'Leinsweiler',kreis:'Kreis Südliche Weinstraße'}],['reben',6200,8000,{baum:.1,weg:220}],['ort',8000,9050,{luecke:.3,fach:.1,geh:2,teile:[[8000,8180,{seite:-1,neu:1,obst:1}],[8180,8900,{quader:.35,giebel:.4,solar:.25,gewaende:.5,ranken:.1,strbaum:1}],[8900,9050,{seite:1,neu:1,reben:1}]],name:'Ranschbach',kreis:'Kreis Südliche Weinstraße'}],['reben',9050,12800,{baum:0,weg:260}],['hain',12800,null]]
    .map(([t,a,b,o])=>{ const z=[t,...ur(a,b)]; if(o){ o=Object.assign({},o); if(o.teile) o.teile=Z(o.teile); z.push(o); } return z; }).sort((p,q)=>p[1]-q[1]);
  if(Math.hypot(g.poly[g.poly.length-1][0]-g.poly[0][0],g.poly[g.poly.length-1][1]-g.poly[0][1])>.5) g.poly.push(g.poly[0].slice()); // Runde schließen
  return Object.assign(g, {name:'Südpfalz-Klassiker', start:'Godramstein', finish:'Ziel', gpx:'suedpfalz', loop:!!loop, zones,
  kreuz:E.kreuz, haardt:true, steil:true, // Haardt als Bergkette im Westen · Überhöhung in deiner Nähe wie an der Kalmit
  mitte:Z([[2350,3800],[6200,8000]]), planke:Z([[7700,7930],[12990,null,2],[0,120,2]]), saum:Z([[2350,2460,1],[2460,2800,0],[2800,3000,-1],[3510,3630,1],[3660,3800,1]]), radweg:Z([[2800,3510,1]]), allee:Z([[3420,3620,-1]]),
  weiter:[[9060,-24,220,6]].map(([d,...x])=>[um(d),...x]), // nach Ranschbach: die L508 läuft geradeaus weiter, der Betonplattenweg knickt rechts ab
  hof:[[3590,-1,20],[3710,-1,14]].map(([d,...x])=>[um(d),...x]), // Ilbesheim: die K20 führt am Ortsrand vorbei, nur Aussiedlerhöfe mit Hallen links
  bogen:[5415,[8165,'Seilmacher-Dorf']].map(e=>Array.isArray(e)?[um(e[0]),e[1]]:um(e)),
  // B10 links parallel (Mitte 30 m neben dem Weg), dazwischen und dahinter Gehölz (Bahn, Queich), dahinter Gewerbe von Godramstein
  b10:Z([[12140,12800,-1,30]]), gehoelz:Z([[12140,12800,-1,4,19],[12140,12800,-1,42,130],[12800,null,-1,4,60]]), gewerbe:Z([[12450,12800,-1,160]]),
  kom:Z([[1220,2360,'Hauptstraße Arzheim'],[6150,7150,'Höchster Punkt · 271 m']]), // Bergwertungen: [Anstieg ab, Wertung oben, Name] – Arzheim bis kurz hinters Ortsausgangsschild
  breite:Z([[1000,2350,5],[5400,6200,4.2],[8000,9050,6.6],[9080,12990,3.2]]), belag:[['pflaster',5400,6000,1.2],['beton',9080,12990,0]].map(([t,a,b,x])=>[t,...ur(a,b),x])}); }
const zoneOf=(r,d)=>{ for(const z of r.zones) if(d>=z[1]&&d<z[2]) return z; return null; };
const zoneAt=(r,d)=>{ const z=zoneOf(r,d); return z?z[0]:'wald'; };
const zOpt=(r,d)=>{ const z=zoneOf(r,d); return z&&z[3]||{}; };
// Straßenbreite mit 12 m Übergang · Belag an der Stelle d (Kopfsteinpflaster bremst wie Zusatzsteigung)
const roadW=(r,d)=>{ let w=ROAD_W; for(const [a,b,bw] of r.breite) w+=(bw-ROAD_W)*Math.min(1,Math.max(0,Math.min(d-a+12,b+12-d)/12)); return w; };
const belagOf=(r,d)=>{ if(r.loop) d=((d%r.len)+r.len)%r.len; for(const b of r.belag) if(d>=b[1]&&d<b[2]) return b; return null; };
// Pflaster bremst mit fester Kraft (Vibration, kaum abhängig vom Gewicht): Zusatzsteigung gilt für 75 kg, Leichtere spüren mehr, Schwerere weniger
const belagAt=(d,kg=75)=>{ const b=R&&R.belag?belagOf(R,d):null; return b?b[3]*(75+BIKE_KG)/(kg+BIKE_KG):0; };
const parzAt=(r,d)=>{ for(const p of r.parz) if(d>=p[0]&&d<p[1]) return p; return null; };
// Feld: Parzellen quer zur Straße (Typ 0 = Weinberg, 1–3 = Acker), an den Grenzen Feldwege oder Hecken; in Weinbergen vereinzelt Wirtschaftswege
function prepFeld(r){ const q=rng(99); r.parz=[]; r.wege=[]; r.hecke=[];
  for(const [t,a,b,o] of r.zones){ const e=Math.min(b,r.len);
    if(t==='feld'){ let d=a; while(d<e){ const L=35+q()*70; r.parz.push([d,Math.min(e,d+L),q()<.45?0:1+Math.floor(q()*3)]); d+=L; if(d<e-10){ const u=q(); if(u<.3) r.wege.push(d); else if(u<.65) r.hecke.push(d); } } }
    if(t==='reben' && o&&o.weg){ let d=a+o.weg*(.3+q()*.5); while(d<e-30){ r.wege.push(d); d+=o.weg*(.6+q()*.8); } } } }
// noTrain: im Training nicht anbieten (Südpfalz gibt es dort nur als Runde – fährt ohnehin in Dauerschleife)
const ROUTES=[{id:'kalmit', mode:'climb', title:'Kalmit-Ostrampe', sub:'ab Maikammer · Pfalz · echte GPX', def:kalmitDef()},
  {id:'berwartstein', mode:'climb', title:'Burg Berwartstein', sub:'ab Erlenbach · Dahner Felsenland · Fantasy', def:berwartsteinDef()},
  {id:'stadion', mode:'loop', title:'Betzenberg', sub:'Steilkurven · Westkurve', def:stadionDef()},
  {id:'suedpfalz', mode:'classic', noTrain:true, title:'Südpfalz-Klassiker', sub:'Godramstein · Arzheim · Leinsweiler · Ranschbach · echte GPX', def:suedpfalzDef(false)},
  {id:'suedpfalz-runde', mode:'loop', title:'Südpfalz-Klassiker', sub:'Runde durch die Weinberge · echte GPX', def:suedpfalzDef(true)},
  {id:'space', mode:'space', title:'Space-Strecke', sub:'aus deinem Workout erzeugt', def:null},
  {id:'insel', mode:'space', title:'Insel-Strecke', sub:'tropischer Archipel · Untergrund je nach Intensität', def:null},
  {id:'trifels', mode:'kamp', noTrain:true, title:'Trifels · Queichtal', sub:'Kampagne Mission 1 · aus deinem Workout berechnet', def:null}]; // Space nur im Training, Strecke entsteht aus dem Workout
const raceLen=()=>race.mode==='train'?Infinity:R.loop?R.len*race.laps:R.len;
const MODES={climb:{title:'Anstieg', soon:'Weitere Anstiege folgen'}, loop:{title:'Rundstrecke', soon:'Weitere Rundstrecken folgen'}, classic:{title:'Klassisches Rennen', soon:'Strecke folgt – kommt später'}, train:{title:'Training', soon:'Strecken aus allen Modi – in Dauerschleife'}, kamp:{title:'Kampagne', soon:''}}; // kamp läuft intern als train (kampagne.js)
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
  const r={kf, name:def.name, start:def.start||'Start', finish:def.finish||'Ziel', kalmit:!!def.kalmit, gpx:!!def.gpx, loop:!!def.loop, zones:def.zones||[], breite:def.breite||[], belag:def.belag||[], kom:def.kom||[], parz:[], wege:[], hecke:[], xs, ys, len, segs, startElev:def.startElev, endElev:e, gain, def};
  if(def.stadium){ prepStadium(r); return r; }
  if(def.space||def.island){ // Übergang Umlaufbahn → Anfang der Umlaufbahn genau treffen
    const Lw0=segLenSum*kf-def.ring*kf, ex=xs[xs.length-1], ey=ys[ys.length-1], tmp={xs,ys,len}; let best=Lw0, bd=1e9;
    for(let dd=Lw0-6; dd<=Lw0+6; dd+=0.05){ const [px,py]=posAt(tmp,dd), q=Math.hypot(px-ex,py-ey); if(q<bd){ bd=q; best=dd; } }
    Object.assign(r,{ring:len-best, goal:def.island?def.goal*kf:best, kehren:[], fans:len, S:null});
    if(def.island){ r.island=true; prepIsland(r); return r; }
    // Optische Überhöhung: Bahn wird 2,5 × so steil gezeichnet (max. 30 %), Physik und Trainer bleiben bei der echten Steigung
    let ve=0; segs.forEach(o=>{ o.vg=Math.sign(o.g)*Math.min(Math.abs(o.g)/SPACE_PHYS*SPACE_VX,30); o.ve0=ve; ve+=o.len*o.vg/100; }); r.vEnd=ve;
    r.space=true; return r; }
  // Landschaftszonen: Dorf, Weinberge, Wald, Fans im letzten Kilometer
  r.fans = def.burg||def.ma?r.len:Math.max(r.len*0.6, r.len-1000); // Burg: kein modernes Publikum
  r.kehren=[]; if(r.kalmit||def.burg) for(let dd=40; dd<len-40; dd+=STEP*5){ const dh=Math.abs(angDiff(headingAt(r,dd+25),headingAt(r,dd-25)));
    if(dh>1.25 && !r.kehren.some(k=>Math.abs(k-dd)<120) && !(def.burg&&(dd<1420||dd>5370))) r.kehren.push(dd); } // Burg: Ecken im Dorf und am Tor sind keine Kehren
  prepFeld(r); makeScenery(r); if(def.burg) prepBurg(r); if(def.ma&&def.orte) prepTrifels(r); // Trifels: welt-trifels.js
  return r;
}
function posAt(r,d){ if(r.ring && d>r.len) d-=r.ring; // hinter dem Ziel: Umlaufbahn
  d = r.loop ? ((d%r.len)+r.len)%r.len : Math.max(0,Math.min(r.len,d)); const f=d/STEP, i=Math.min(r.xs.length-2,Math.floor(f)), t=f-i;
  return [r.xs[i]+(r.xs[i+1]-r.xs[i])*t, r.ys[i]+(r.ys[i+1]-r.ys[i])*t]; }
function headingAt(r,d){ const a=posAt(r,d-3), b=posAt(r,d+3); return Math.atan2(b[1]-a[1], b[0]-a[0]); }
function angDiff(a,b){ let x=a-b; while(x>Math.PI) x-=2*Math.PI; while(x<-Math.PI) x+=2*Math.PI; return x; }
function segOf(d){ const s=R.segs; let lo=0, hi=s.length-1; while(lo<hi){ const m=(lo+hi+1)>>1; if(s[m].d0<=d) lo=m; else hi=m-1; } return s[lo]; }
function gradeAt(d){ if(!R) return 0; if(R.loop) d=((d%R.len)+R.len)%R.len; if(d<0||d>R.len) return 0; return segOf(d).g; }
function elevAt(d){ if(R.loop) d=((d%R.len)+R.len)%R.len; if(d<=0) return R.startElev; if(d>=R.len) return R.endElev; const s=segOf(d); return s.e0+(d-s.d0)*s.g/100; }
function gradeColor(g){ return g<4.5?'#9cc46b':g<6?'#e9df6a':g<7.2?'#f0b860':g<8.3?'#ec9a52':'#de6f43'; }

/* Landschaft: Bäume, Felsen, Weinberge, Häuser, Fans – fest per Zufallsgenerator mit Startwert */
function rng(seed){ seed=seed%2147483647; if(seed<=0) seed+=2147483646; return ()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }; }
const CELL=30;
function makeScenery(r){
  const rg=new Map(), key=(x,y)=>Math.floor(x/CELL)+','+Math.floor(y/CELL);
  for(let i=0;i<r.xs.length;i+=2){ const k=key(r.xs[i],r.ys[i]); (rg.get(k)||rg.set(k,[]).get(k)).push(i); }
  const distRoad=(x,y)=>{ let m=1e9; const cx=Math.floor(x/CELL), cy=Math.floor(y/CELL);
    for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++){ const l=rg.get((cx+a)+','+(cy+b)); if(l) for(const i of l){ const dd=Math.hypot(r.xs[i]-x,r.ys[i]-y); if(dd<m) m=dd; } } return m; };
  const S={tree:[],rock:[],vine:[],vpost:[],grass:[],house:[],block:[],post:[],lamp:[],fan:[],bush:[],weg:[],tor:[],zaun:[],konif:[],ranke:[],halle:[]}, R1=rng(42), R2=rng(7), R3=rng(5); // R2 nur für Neues, damit die Kalmit gleich bleibt · R3 für Hausdetails
  const frame=d=>{ const [px,py]=posAt(r,d), h=headingAt(r,d); return {px,py,h,nx:-Math.sin(h),ny:Math.cos(h)}; };
  const inBand=(L,d,side)=>(L||[]).some(([a,b,s])=>d>=a&&d<b&&(!s||s===side)); // Abschnittslisten [von, bis, Seite (0 = beide)]
  // B10: gerade Linie parallel zum Abschnitt, nach beiden Seiten verlängert (ext), so weit sie der Strecke nicht zu nahe kommt
  r.b10l=null; for(const [a,b,sd,off] of r.def.b10||[]){ const fa=frame(a), fb=frame(b), ax=fa.px+fa.nx*sd*off, ay=fa.py+fa.ny*sd*off, bx=fb.px+fb.nx*sd*off, by=fb.py+fb.ny*sd*off, L=Math.hypot(bx-ax,by-ay), B={ax,ay,ux:(bx-ax)/L,uy:(by-ay)/L,L,a,b,sd,off,e0:0,e1:L};
    const frei=t=>distRoad(ax+B.ux*t,ay+B.uy*t)>off-4; for(let t=0;t>-500&&frei(t-10);t-=10) B.e0=t-10; for(let t=L;t<L+500&&frei(t+10);t+=10) B.e1=t+10; r.b10l=B; }
  const b10Dist=(x,y)=>{ const B=r.b10l; if(!B) return 1e9; const t=Math.max(B.e0,Math.min(B.e1,(x-B.ax)*B.ux+(y-B.ay)*B.uy)); return Math.hypot(x-B.ax-B.ux*t, y-B.ay-B.uy*t); }; r.b10Dist=b10Dist;
  // Neubaugebiet: freistehende Häuser hinter Vorgarten, an der Grenze Hecke oder Mauer mit Einfahrt, Büsche und Koniferen; gid verknüpft Garten und Haus
  const neubau=(d,side,geh,zb)=>{ const w=9+R3()*3.5, dep=8.5+R3()*2.5, vg=5+R3()*3.5, gap=4+R3()*7, dm=d+w/2, f=frame(dm), rh=roadW(r,dm)/2, off=rh+geh+vg+dep/2, gid=S.house.length+1;
    const cx=f.px+f.nx*side*off, cy=f.py+f.ny*side*off, ax=Math.cos(f.h), ay=Math.sin(f.h), at=(a,o)=>{ const g=frame(a); return [g.px+g.nx*side*o, g.py+g.ny*side*o, g]; };
    if(d+w>zb-8 || ![[1,1],[1,-1],[-1,1],[-1,-1]].every(([u,v])=>distRoad(cx+ax*u*w/2+f.nx*v*dep/2, cy+ay*u*w/2+f.ny*v*dep/2)>rh+geh+2)) return d+w+gap;
    S.house.push({x:cx, y:cy, w, dep, hgt:3+R3()*1.8, h:f.h, side, stil:'neu', wall:R3()*4|0, v:R3()*6|0, roof:DACH_NEU[R3()*4|0], flach:R3()<.3, kam:R3(), df:R3()<.5?0:R3()<.6?1:2, pv:R3()<.25, d:dm, gid});
    const typ=['hecke','hecke','klinker','beton','sandstein'][R3()*5|0], lo=rh+geh+(typ==='hecke'?.55:.3), e=Math.min(d+w+gap-.5,zb-8);
    for(let a=d-.5; a<e-3.2; a+=3){ const L=Math.min(3,e-3.2-a), [x,y,g]=at(a+L/2,lo); S.zaun.push({x, y, h:g.h, len:L+.06, typ, d:a+L/2, c:R3(), gid}); } // letzte 3 m: Einfahrt
    for(let i=0,n=2+R3()*3|0;i<n;i++){ const [x,y]=at(d+R3()*w, lo+1.2+R3()*(vg-2)); S.bush.push({x, y, s:.5+R3()*.7, c:R3(), gid}); }
    if(R3()<.6){ const [x,y]=at(d+(R3()<.5?.8:w-.8), lo+1.4+R3()*(vg-2.2)); S.konif.push({x, y, s:1.4+R3()*1.6, c:R3(), gid}); }
    if(R3()<.3){ const [x,y]=at(d+w+gap*.5, off+R3()*4); S.tree.push({x, y, s:1.5+R3()*1.2, c:R3(), pine:false, ht:3, gid}); }
    return d+w+gap; };

  // Dorf: geschlossene Häuserzeilen direkt am Gehweg
  for(const [zt,za,zb,zo={}] of r.zones) if(zt==='ort'){ const geh=zo.geh??SIDEWALK, teil=d=>(zo.teile||[]).find(t=>d>=t[0]&&d<t[1]);
  for(const side of (zo.seite?[zo.seite]:[-1,1])){ let d=za+6;
    while(d<zb-8){ const t=teil(d), q=t?Object.assign({},zo,t[2]):zo; // Optionen dieses Ortsteils
      if(q.seite && q.seite!==side){ d=t[1]; continue; } // hier nur die andere Seite bebaut
      if(q.neu){ d=neubau(d,side,geh,zb); continue; }
      const w=7+R1()*4.5, dep=8+R1()*3, f=frame(d+w/2), off=roadW(r,d+w/2)/2+geh+dep/2, upper=r.kalmit&&d-za>550;
      const cx=f.px+f.nx*side*off, cy=f.py+f.ny*side*off, ax=Math.cos(f.h), ay=Math.sin(f.h), rwh=roadW(r,d+w/2)/2+geh-.6;
      const ok=distRoad(cx,cy)>off-1.5 && (r.kalmit || [[1,1],[1,-1],[-1,1],[-1,-1]].every(([u,v])=>distRoad(cx+ax*u*w/2+f.nx*v*dep/2, cy+ay*u*w/2+f.ny*v*dep/2)>rwh));
      if(ok){ const o={x:f.px+f.nx*side*off, y:f.py+f.ny*side*off, w, dep, hgt:5.6+R1()*1.8, h:f.h, side, wall:upper&&R1()<.6?4:Math.floor(R1()*6), shut:Math.floor(R1()*3), roof:R1()<.5?'#b4472f':'#9e3a28', d:d+w/2, fw:!!q.fach&&R2()<q.fach};
        o.kam=R3(); if(!r.kalmit){ if(R3()<.15) o.roof=DACH_ALT[3]; o.gw=R3()<(q.gewaende||0); if(q.laden!=null&&R3()<.7) o.shut=q.laden; o.qu=R3()<(q.quader||0); o.gs=R3()<(q.giebel||0); o.pv=R3()<(q.solar||0); if(o.qu) o.fw=false; } S.house.push(o);
        if(R3()<(q.ranken||0)){ const k=off-dep/2-.2, al=(R3()-.5)*w*.6; S.ranke.push({x:f.px+f.nx*side*k+ax*al, y:f.py+f.ny*side*k+ay*al, h:f.h, w:2+R3()*3, hg:2.5+R3()*3, d:d+w/2+al, side, c:R3()}); } }
      let gap=R1()<(upper?.45:.25)?2+R1()*(upper?9:3):0.2; if(q.luecke&&R2()<q.luecke) gap+=4+R2()*12;
      if(ok && gap>1.5 && gap<9 && d+w+gap<zb-8){ const dm=d+w+gap/2, g=frame(dm), o2=roadW(r,dm)/2+geh+.2; // Hoftor oder Mauer in der Lücke
        S.tor.push({x:g.px+g.nx*side*o2, y:g.py+g.ny*side*o2, h:g.h, side, w:gap+.3, d:dm, v:gap<2.6?2:R3()<.55?0:1}); }
      d+=w+gap; } }
  for(let d=za+20; zo.licht!==0&&d<zb-10; d+=34){ const side=zo.seite||(((d-za)/34|0)%2?1:-1), f=frame(d), o=roadW(r,d)/2+geh-0.4; S.lamp.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, h:f.h, side, d}); }
  for(const t of zo.teile||[]) if(t[2].strbaum) for(let d=t[0]+12, i=0; d<t[1]-6; d+=26+R3()*10, i++){ const f=frame(d), s=i%2?1:-1, o=roadW(r,d)/2+geh-.7; // Bäumchen im Gehweg
    S.tree.push({x:f.px+f.nx*s*o, y:f.py+f.ny*s*o, s:1.1+R3()*.4, c:R3(), pine:false, ht:3}); }
  for(const t of zo.teile||[]) if(t[2].seite&&t[2].obst) for(let d=t[0]; d<t[1]; d+=7+R3()*5){ const f=frame(d), s=-t[2].seite, o=roadW(r,d)/2+geh+3+R3()*12; // unbebaute Seite: Wiese mit Obstbäumen und Birken
    S.tree.push({x:f.px+f.nx*s*o, y:f.py+f.ny*s*o, s:1.5+R3()*.9, c:R3(), pine:false, ht:3, fruit:R3()<.6}); } }
  // Einmündungen an der scharfen Ecke: Hauptstraße läuft weiter, dazu eine Straße geradeaus (al: längs ab der Ecke, la: quer), Häuser im Weg weichen, neue Häuser an der Stichstraße
  r.stich=[]; r.gehCut=[]; for(const K of [].concat(r.def.kreuz||[])){ const w=5, len=55, vx=-K.uy, vy=K.ux; let kd=0, bd=1e9; for(let i=0;i<r.xs.length;i++){ const dd=Math.hypot(r.xs[i]-K.x,r.ys[i]-K.y); if(dd<bd){ bd=dd; kd=i*STEP; } }
    const geh=zOpt(r,kd).geh??SIDEWALK, loc=(x,y)=>[(x-K.x)*K.ux+(y-K.y)*K.uy, (x-K.x)*vx+(y-K.y)*vy];
    const inStich=(x,y,m)=>{ const [al,la]=loc(x,y); return al>-4&&al<len+2&&Math.abs(la)<w/2+m; };
    const inHaus=(o,x,y)=>{ const dx=x-o.x, dy=y-o.y, c=Math.cos(o.h), sn=Math.sin(o.h); return Math.abs(dx*c+dy*sn)<o.w/2+.3 && Math.abs(-dx*sn+dy*c)<o.dep/2+.3; };
    const pts=o=>{ const ax=Math.cos(o.h), ay=Math.sin(o.h), out=[]; for(const u of [-.5,0,.5]) for(const v of [-.5,0,.5]) out.push([o.x+ax*u*o.w-ay*v*o.dep, o.y+ay*u*o.w+ax*v*o.dep]); return out; };
    S.house=S.house.filter(o=>!pts(o).some(([x,y])=>inStich(x,y,geh+.3))); S.lamp=S.lamp.filter(o=>!inStich(o.x,o.y,geh+.5)); for(const k of ['tor','zaun','bush','konif','ranke']) S[k]=S[k].filter(o=>!inStich(o.x,o.y,geh+(o.w||o.len||2)/2+.3));
    const hdg=Math.atan2(K.uy,K.ux), rwk=roadW(r,kd)/2; let cut=null;
    for(const side of [-1,1]) for(let d=kd-30; d<kd+30; d+=1){ const f=frame(d), o=roadW(r,d)/2+geh/2, hit=inStich(f.px+f.nx*side*o, f.py+f.ny*side*o, 0); if(hit&&!cut) cut=[side,d-1.5,d+1.5]; else if(hit) cut[2]=d+1.5; else if(cut){ r.gehCut.push(cut); cut=null; } }
    for(const side of [-1,1]){ let al=rwk+geh+1; while(al<len-4){ const hw=7+R2()*4, dep=8+R2()*3, off=w/2+geh+dep/2, c={x:K.x+K.ux*(al+hw/2)+vx*side*off, y:K.y+K.uy*(al+hw/2)+vy*side*off, w:hw, dep, h:hdg};
        if(pts(c).every(([x,y])=>distRoad(x,y)>rwk+geh+.4 && !S.house.some(o=>inHaus(o,x,y)) && !r.stich.some(St=>{ const a=(x-St.x)*St.ux+(y-St.y)*St.uy, b=(x-St.x)*St.vx+(y-St.y)*St.vy; return a>-4&&a<St.len+2&&Math.abs(b)<St.w/2+St.geh+.3; })))
          S.house.push(Object.assign(c,{hgt:5.6+R2()*1.8, side, wall:Math.floor(R2()*6), shut:Math.floor(R2()*3), roof:R2()<.5?'#b4472f':'#9e3a28', d:kd, fw:R2()<(zOpt(r,kd).fach||0), su:al+hw/2}));
        al+=hw+.2+(R2()<.25?2+R2()*3:0); } }
    const al0=side=>{ for(let al=-4; al<20; al+=.25){ const la=side*(w/2+geh/2); if(distRoad(K.x+K.ux*al+vx*la, K.y+K.uy*al+vy*la)>rwk+geh+.05) return al; } return 20; }; // Gehweg erst, wo Hauptstraße und ihr Gehweg enden
    r.stich.push({x:K.x, y:K.y, ux:K.ux, uy:K.uy, vx, vy, w, len, geh, d:kd, al0:{'-1':al0(-1), '1':al0(1)}}); }
  // Seitenstraße kurz vor dem Ortsende: ersetzt das vorletzte Haus der Seite, danach steht nur noch ein Haus
  r.abzweig=null; for(const [zt,za,zb,zo={}] of r.zones) if(zt==='ort'&&zo.abzweig){ const side=zo.abzweig, L=S.house.filter(o=>o.side===side&&o.su==null&&o.d>za&&o.d<zb).sort((a,b)=>a.d-b.d), h=L[L.length-2], d=h?h.d:zb-25, w=5;
    if(h){ S.house.splice(S.house.indexOf(h),1); for(const k of ['zaun','bush','konif','tree']) if(h.gid) S[k]=S[k].filter(o=>o.gid!==h.gid); S.tor=S.tor.filter(o=>o.side!==side||Math.abs(o.d-h.d)>h.w/2+o.w/2+1); } S.lamp=S.lamp.filter(o=>o.side!==side||Math.abs(o.d-d)>w/2+1.5); r.abzweig={d,side,w,len:70,geh:zo.geh??SIDEWALK}; }

  for(let d=0; d<r.len; d+=5){
    const z=zoneAt(r,d); if(z==='ort'||z==='hain') continue;
    const f=frame(d);
    for(const side of [-1,1]){
      const inVine=z==='reben'||z==='feld', inFans=d>r.fans, tries=inVine?2:3;
      for(let t=0;t<tries;t++){
        const off=side*((inFans?10:6)+R1()*(inVine?55:45)), along=(R1()-.5)*5;
        const x=f.px+f.nx*off+Math.cos(f.h)*along, y=f.py+f.ny*off+Math.sin(f.h)*along, dr=distRoad(x,y);
        if(inVine||z==='wiese') continue;
        const rad=2.2+R1()*3; if(dr<rad+roadW(r,d)/2+(inFans?7:2)) continue;
        if(R1()<.05) S.rock.push({x,y,s:1.2+R1()*2.6,rot:R1()*6});
        else S.tree.push({x,y,s:rad,c:R1(),pine:R1()<.5,ht:9+R1()*7});
      }
    }
    const rw=roadW(r,d)/2;
    if(z==='wiese' && d%20<5) for(const side of [-1,1]) if(R2()<.55){ const o=rw+6+R2()*80; S.tree.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, s:1.5+R2()*1, c:R2(), pine:false, ht:3, fruit:true}); } // Obstwiese
    if(z==='reben' && d%30<5) for(const side of [-1,1]) if(R1()<(zOpt(r,d).baum??.55) && !inBand(r.def.radweg,d,side)) S.tree.push({x:f.px+f.nx*side*(rw+3.2+R1()*1.5), y:f.py+f.ny*side*(rw+3.2+R1()*1.5), s:1.6+R1()*.8, c:R1(), pine:false, ht:3, fruit:true});
    for(const side of [-1,1]) for(let t=0;t<3;t++){ const off=side*(rw+1+R1()*(inBand(r.def.radweg,d,side)?1.3:4.5)), al=(R1()-.5)*5; S.grass.push({x:f.px+f.nx*off+Math.cos(f.h)*al, y:f.py+f.ny*off+Math.sin(f.h)*al, s:.5+R1()*.6, c:R1(), r:R1()*6, wood:z==='wald'&&zoneAt(r,d-.01)==='wald'}); }
    // Sandsteinblöcke und Leitpfosten am Straßenrand (Wald)
    if(z==='wald' || zoneAt(r,d+199)==='wald'){
      for(const side of [-1,1]){
        if(R1()<.16 && d<r.fans) S.block.push({x:f.px+f.nx*side*(rw+1.1), y:f.py+f.ny*side*(rw+1.1), h:f.h+(R1()-.5)*.3, s:.7+R1()*.6});
        if(Math.round(d)%50===0&&!r.def.burg&&!r.def.ma) S.post.push({x:f.px+f.nx*side*(rw+0.7), y:f.py+f.ny*side*(rw+0.7), h:f.h});
      }
    }
  }
  // Rebzeilen quer zur Straße: jede Zeile läuft vom Straßenrand senkrecht weg, Zeilenabstand 2,4 m
  for(const [zt,za,zb,zo={}] of r.zones){ const s0=zt==='reben'||zt==='feld'?[-1,1]:zt==='ort'&&zo.seite?[-zo.seite]:null; if(!s0&&!(zo.teile||[]).some(t=>t[2].reben)) continue;
  for(let d=za-(zt==='reben'?10:0); d<Math.min(zb,r.len); d+=2.4){ const f=frame(d), t=(zo.teile||[]).find(t=>d>=t[0]&&d<t[1]), sides=(t&&t[2].reben?[-t[2].seite]:s0||[]).filter(sd=>!inBand(r.def.gehoelz,d,sd)); if(!sides.length) continue;
    if(zt==='feld'){ const p=parzAt(r,d); if(!p||p[2]!==0||d-p[0]<2||p[1]-d<2) continue; }
    if(r.wege.some(w=>Math.abs(w-d)<2.6)) continue; // Lücke für den Wirtschaftsweg
    for(const side of sides) for(let k=0; k<(r.kalmit?22:14); k++){ const off=side*(roadW(r,d)/2+3.5+(inBand(r.def.radweg,d,side)?4:inBand(r.def.saum,d,side)?4.5:0)+k*3.0), x=f.px+f.nx*off, y=f.py+f.ny*off;
      if(distRoad(x,y)<Math.abs(off)-1.2) break; S.vine.push({x,y,rot:f.h+Math.PI/2,c:R1()}); if(k%3===0) S.vpost.push({x,y,h:f.h}); } } }
  // Wirtschaftswege quer zur Straße, Hecken an Feldgrenzen
  for(const w of r.wege){ const f=frame(w), rw=roadW(r,w)/2; for(const side of [-1,1]) if(!inBand(r.def.gehoelz,w,side)) for(let o=rw+1.6; o<rw+75; o+=3) S.weg.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, h:f.h}); }
  // Landstraße: Gebüschsaum, Alleebäume, Leitpfosten in den Weinbergen (Südpfalz)
  for(const [a,b,sd] of r.def.saum||[]) for(let d=a; d<Math.min(b,r.len); d+=1.6+R3()*1.2){ const f=frame(d), rw=roadW(r,d)/2;
    for(const side of sd?[sd]:[-1,1]){ const o=rw+2.4+R3()*2.6; S.bush.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, s:1.1+R3()*1.1, c:R3(), tree:R3()<.14}); } }
  for(const [a,b,sd] of r.def.allee||[]) for(let d=a; d<Math.min(b,r.len); d+=8+R3()*3){ const f=frame(d), o=roadW(r,d)/2+3.5;
    for(const side of sd?[sd]:[-1,1]) S.tree.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, s:2.6+R3()*.8, c:R3(), pine:false, ht:4}); }
  // Gehölzstreifen [von, bis, Seite, Abstand von, bis]: Laubbäume und Gebüsch · Gewerbe [von, bis, Seite, Abstand]: Hallen mit Flachdach
  for(const [a,b,sd,o0,o1] of r.def.gehoelz||[]) for(let d=a; d<Math.min(b,r.len); d+=3){ const f=frame(d), ax=Math.cos(f.h), ay=Math.sin(f.h), n=Math.max(1,Math.round((o1-o0)/(o1>40?11:7)));
    for(const side of sd?[sd]:[-1,1]) for(let k=0;k<n;k++){ const o=roadW(r,d)/2+o0+R3()*(o1-o0), al=(R3()-.5)*3, x=f.px+f.nx*side*o+ax*al, y=f.py+f.ny*side*o+ay*al;
      if(R3()<.6) S.tree.push({x, y, s:2.2+R3()*1.8, c:R3(), pine:R3()<.1, ht:9+R3()*6}); else S.bush.push({x, y, s:1+R3()*1.2, c:R3(), tree:R3()<.3}); } }
  for(const [a,b,sd,off] of r.def.gewerbe||[]) for(let d=a; d<Math.min(b,r.len); d+=40+R3()*30){ const f=frame(d), o=off+R3()*70, w=25+R3()*35, t=18+R3()*25;
    S.halle.push({x:f.px+f.nx*sd*o, y:f.py+f.ny*sd*o, h:f.h+(R3()-.5)*.1, w, t, hg:6+R3()*5, c:R3()}); }
  // Weiterführende Straße [d, Winkel ° (negativ = links), Länge, Breite]: die Strecke biegt ab, die Straße läuft in ihrer Richtung weiter
  r.weiter=(r.def.weiter||[]).map(([d,wk,len,w])=>{ const f=frame(d), h=f.h+wk*Math.PI/180; return {x:f.px, y:f.py, ux:Math.cos(h), uy:Math.sin(h), len, w, d}; });
  const aufWeiter=(x,y,m)=>r.weiter.some(K=>{ const al=(x-K.x)*K.ux+(y-K.y)*K.uy, la=-(x-K.x)*K.uy+(y-K.y)*K.ux; return al>-2&&al<K.len+2&&Math.abs(la)<K.w/2+m; });
  // Aussiedlerhof [d, Seite, Abstand]: Wohnhaus und Halle mit Flachdach, ein paar Bäume; Platz drumherum frei von Reben
  r.hofPl=[]; for(const [d,sd,off] of r.def.hof||[]){ const f=frame(d), rw=roadW(r,d)/2, at=(al,o)=>[f.px+f.nx*sd*(rw+o)+Math.cos(f.h)*al, f.py+f.ny*sd*(rw+o)+Math.sin(f.h)*al];
    const [hx,hy]=at(-8,off+5); S.house.push({x:hx, y:hy, w:11, dep:9, hgt:5.8, h:f.h, side:sd, wall:R3()*6|0, shut:R3()*3|0, roof:DACH_ALT[R3()*3|0], kam:R3(), pv:R3()<.5, d});
    const [gx,gy]=at(10,off+9); S.halle.push({x:gx, y:gy, h:f.h, w:18, t:16, hg:6, c:R3()}); r.hofPl.push({x:(hx+gx)/2, y:(hy+gy)/2, r:24});
    for(let i=0;i<4;i++){ const [x,y]=at(-22+R3()*44, off+18+R3()*10); S.tree.push({x, y, s:2.4+R3()*1.2, c:R3(), pine:false, ht:4}); } }
  if(!r.kalmit) for(let d=0; d<r.len; d+=50) if(zoneAt(r,d)==='reben'){ const f=frame(d), o=roadW(r,d)/2+.7; for(const side of [-1,1]) S.post.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, h:f.h}); }
  for(const hk of r.hecke){ const f=frame(hk), rw=roadW(r,hk)/2; for(const side of [-1,1]) for(let o=rw+4; o<rw+90; o+=1.6+R2()*1.6) if(R2()<.85) S.bush.push({x:f.px+f.nx*side*o+(R2()-.5), y:f.py+f.ny*side*o+(R2()-.5), s:1+R2()*.9, c:R2(), tree:R2()<.08}); }
  for(let d=0; d<r.len; d+=8){ const f=frame(d);
    for(const side of [-1,1]) for(let t=0;t<3;t++){ const off=side*(50+R1()*170), x=f.px+f.nx*off+(R1()-.5)*8, y=f.py+f.ny*off+(R1()-.5)*8;
      if(zoneAt(r,d)!=='wald' && (Math.abs(off)<160 || (!r.kalmit && R1()<.8))) continue; const rad=2.4+R1()*3; if(distRoad(x,y)<rad+8) continue; S.tree.push({x,y,s:rad,c:R1(),pine:R1()<.5,ht:10+R1()*7}); } }

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
  // Gehölz: dichte Laubbäume, Büsche bis an den Straßenrand
  for(const [zt,za,zb] of r.zones) if(zt==='hain') for(let d=za; d<Math.min(zb,r.len); d+=2.5){ const f=frame(d), rw=roadW(r,d)/2, ax=Math.cos(f.h), ay=Math.sin(f.h);
    const at=(o,al)=>({x:f.px+f.nx*o+ax*al, y:f.py+f.ny*o+ay*al});
    for(const side of [-1,1]){
      for(let t=0;t<2;t++){ const s=.8+R2()*.9, p=at(side*(rw+1+s*.8+R2()*3),(R2()-.5)*2.5); if(distRoad(p.x,p.y)>rw+s*.8+.8) S.bush.push(Object.assign(p,{s, c:R2(), tree:false})); }
      for(let t=0;t<2;t++){ const s=2+R2()*2.2, p=at(side*(rw+4+R2()*45),(R2()-.5)*2.5); if(distRoad(p.x,p.y)>rw+s*.7+1) S.tree.push(Object.assign(p,{s, c:R2(), pine:false, ht:6+R2()*5})); }
      for(let t=0;t<2;t++) S.grass.push(Object.assign(at(side*(rw+.8+R2()*4),(R2()-.5)*2.5),{s:.5+R2()*.6, c:R2(), r:R2()*6, wood:true})); } }
  // Zuschauer an der Seitenstraße, darunter Michel und Marion (u: Abstand vom Straßenrand, al: längs der Hauptstraße)
  if(r.abzweig){ const A=r.abzweig, f=frame(A.d), s=A.side, rw=roadW(r,A.d)/2, ax=Math.cos(f.h), ay=Math.sin(f.h), hw=A.w/2;
    const fan=(u,al,o={})=>S.fan.push(Object.assign({x:f.px+f.nx*s*(rw+u)+ax*al, y:f.py+f.ny*s*(rw+u)+ay*al, face:Math.atan2(-f.nx*s,-f.ny*s)+(R2()-.5)*.7,
      jack:JACK[Math.floor(R2()*JACK.length)], legs:R2()<.6?'#2a2f3a':'#4a5568', tall:.9+R2()*.2, arms:R2()<.7?2:1, phone:R2()<.3, cap:R2()<.3?JACK[Math.floor(R2()*JACK.length)]:null, flag:false, ph:R2()*6.3, d:A.d+al, u}, o));
    fan(.55,-hw-1.1,{name:'Marion', paar:1, face:Math.atan2(-f.nx*s,-f.ny*s), tall:.93, jack:'#b5523b', legs:'#2a2f3a', cap:'#d8cfc0', arms:2, phone:false, ph:.4});
    fan(.55,-hw-2.8,{name:'Michel', paar:1, face:Math.atan2(-f.nx*s,-f.ny*s), tall:1.01, jack:'#4a6b8a', legs:'#6b6255', cap:'#b9b9b4', arms:2, phone:false, ph:.8});
    [[.55,-hw-4.6],[.6,-hw-5.5],[.55,hw+1],[.6,hw+1.9],[A.geh+2.5,-hw+.6,{flag:true}],[A.geh+2.2,hw-.6],[A.geh+4.6,hw-.7]].forEach(([u,al,o])=>fan(u,al,o)); }
  for(const P of r.hofPl) for(const k of ['vine','vpost','tree','bush','weg']) S[k]=S[k].filter(o=>o.ht===4||Math.hypot(o.x-P.x,o.y-P.y)>P.r);
  if(r.weiter.length) for(const k of ['vine','vpost','tree','bush','grass','weg','post','rock']) S[k]=S[k].filter(o=>!aufWeiter(o.x,o.y,k==='tree'?3:1.5));
  if(r.b10l) for(const k of ['tree','bush','konif','vine','vpost','grass','weg','rock','halle']) S[k]=S[k].filter(o=>b10Dist(o.x,o.y)>(k==='halle'?40:14)); // nichts auf der B10
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
  const key=JSON.stringify([S.map(s=>[s.dur,s.a,s.b,!!s.free]),u,f,kg]); if(!e.def || e.key!==key){ e.def=(id==='insel'?islandDef:id==='trifels'?trifelsDef:spaceDef)(S,u,f,kg); e.key=key; } return e; }

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

/* ================= Betzenberg (Stadionrunde): 400 m wie eine Laufbahn, Kurven überhöht wie im Velodrom ================= */
function stadionDef(){
  const {L,r}=ST, poly=[], sp=1;
  const line=(x0,z0,x1,z1)=>{ const n=Math.round(Math.hypot(x1-x0,z1-z0)/sp); for(let i=0;i<n;i++) poly.push([x0+(x1-x0)*i/n, z0+(z1-z0)*i/n]); };
  const arc=(cx,a0,a1)=>{ const n=Math.round(Math.abs(a1-a0)*r/sp); for(let i=0;i<n;i++){ const a=a0+(a1-a0)*i/n; poly.push([cx+r*Math.cos(a), r*Math.sin(a)]); } };
  // Start/Ziel mitten auf der Geraden, auf der man auf die Westkurve (von oben links) zufährt
  line(0,-r,-L/2,-r); arc(-L/2,-Math.PI/2,-3*Math.PI/2); line(-L/2,r,L/2,r); arc(L/2,Math.PI/2,-Math.PI/2); line(L/2,-r,0,-r); poly.push([0,-r]);
  return {name:'Betzenberg', start:'Start', finish:'Ziel', startElev:0, stadium:true, loop:true, poly, segs:[{len:400,g:0}]};
}
function prepStadium(r){
  r.loop=true; r.stadium=true; r.kehren=[]; r.fans=r.len; r.S=null;
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


/* ================= Trifels (Kampagne, Mission 1): wird aus dem Workout berechnet ================= */
// Wie Space: ein Streckenstück je 2 s Workout, Länge aus Watt, Gewicht und fester Steigung je Abschnitt. So liegen die Orte immer an derselben Workout-Zeit:
// Anstieg durch den Burgwald → Kehre in der Vorburg um den Goldkarren (Audienz-Tafel) → Serpentinen-Abfahrt → Auslauf → Wirtshaus (Ende Einfahren) → flaches Queichtal
const TRIFELS_T={rauf:150, rampe:30, hof:25, aus:60}; // s: Anstieg bis zur Vorburg (7 %, die letzten rampe s 10 %) · Kehre in der Vorburg (= eine Tafel) · flacher Auslauf vor dem Wirtshaus
// Weg aus Stücken in [Ost, Süd], h=0 nach Norden: ['g',Anteil] gerade (teilt sich die Restlänge), ['b',Grad,Radius] Bogen (+ rechts, − links)
function turtle(st,teile,L){ const lb=teile.reduce((a,t)=>a+(t[0]==='b'?Math.abs(t[1])*Math.PI/180*t[2]:0),0), fg=teile.reduce((a,t)=>a+(t[0]==='g'?t[1]:0),0), k=lb>L?L/lb:1, rest=Math.max(0,L-lb*k);
  const geh=(l,dh)=>{ st.h+=dh/2; st.x+=Math.sin(st.h)*l; st.y-=Math.cos(st.h)*l; st.h+=dh/2; st.P.push([st.x,st.y]); };
  for(const t of teile){ if(t[0]==='g'){ const l=fg?rest*t[1]/fg:0; if(l<.05) continue; const n=Math.max(1,Math.round(l/2)); for(let i=0;i<n;i++) geh(l/n,0); }
    else { const th=t[1]*Math.PI/180, r=t[2]*k, n=Math.max(2,Math.round(Math.abs(th)*r/2)); for(let i=0;i<n;i++) geh(Math.abs(th/n)*r,th/n); } } }
function trifelsDef(segs, unit, f, kg){
  const DT=2, T=segs.reduce((a,s)=>a+s.dur,0), tW=segs[0]?segs[0].t0+segs[0].dur:300, Tr=TRIFELS_T, NACH=600;
  const gAt=t=>t<Tr.rauf-Tr.rampe?7:t<Tr.rauf?10:t<Tr.rauf+Tr.hof?1.5:t<tW-Tr.aus?-5.5:t<tW?-1.5:.3+.6*Math.sin(t/110);
  const raw=[], cum=[0]; let si=0;
  for(let t=0;t<T;t+=DT){ while(si<segs.length-1 && t>=segs[si].t0+segs[si].dur) si++; const sg=segs[si], v=segVal(sg,Math.min(t+DT/2,sg.t0+sg.dur)), w=unit==='w'?v:v*f/100, g=gAt(t+DT/2);
    raw.push({len:Math.round(vSteady(w,g,kg)*DT*100)/100, g, p:Math.round(unit==='w'?v/f*100:v)}); cum.push(cum[cum.length-1]+raw[raw.length-1].len); }
  const out=raw.map((c,i)=>{ let s=0,n=0; for(let j=-4;j<=4;j++){ const o=raw[i+j]; if(o){ s+=o.g; n++; } } return {...c, g:Math.round(s/n*100)/100}; }); // Übergänge weich
  out.push({len:NACH,g:.3,p:-1}); // Reserve hinter dem Workout-Ende
  const dT=t=>{ const x=Math.max(0,Math.min(cum.length-1,t/DT)), i=Math.min(cum.length-2,Math.floor(x)); return cum[i]+(cum[i+1]-cum[i])*Math.max(0,x-i); };
  const d1=dT(Tr.rauf), d2=dT(Tr.rauf+Tr.hof), d3=dT(tW-Tr.aus), d4=dT(tW), dE=cum[cum.length-1];
  // Linie: Anstieg nach Norden, Rechtskehre um den Karren, Serpentinen nach Osten den Hang hinab, dann ostwärts durchs Tal
  const st={x:0,y:0,h:0,P:[[0,0]]}, rh=Math.max(12,(d2-d1)/Math.PI);
  turtle(st,[['g',1],['b',-25,140],['g',1],['b',25,140],['g',1]],d1);
  const karren=[st.x+Math.cos(st.h)*rh, st.y+Math.sin(st.h)*rh];
  turtle(st,[['b',180,rh],['g',.001]],d2-d1);
  const B=d3-d2, HP=Math.PI*30, LG=220, n=Math.max(1,Math.floor((B-3*Math.PI*10-40+HP)/(LG+HP))), ab=[['b',-90,20],['b',90,20]];
  for(let i=0;i<n;i++){ ab.push(['g',1]); if(i<n-1) ab.push(['b',i%2?180:-180,30]); } ab.push(['b',n%2?-90:90,20],['g',.3]); // Kehren immer nach Osten, 60 m Abstand (Geländeraster)
  turtle(st,ab,B);
  turtle(st,[['b',-10,300],['g',1],['b',10,300]],d4-d3);
  // Tal in großen Schleifen hin und her (je ≈ 1,8 km, 400 m Abstand nach Süden): hält die Karte klein, damit das Geländeraster fein bleibt (≈ 8 m)
  const tal=[], LT=dE+NACH-d4, m=Math.max(1,Math.round(LT/2430)); for(let i=0;i<m;i++){ tal.push(['g',1],['b',12,700],['g',1],['b',-12,700],['g',1]); if(i<m-1) tal.push(['b',i%2?-180:180,200]); }
  turtle(st,tal,dE+NACH-d4);
  let e=0, lo=0; for(const s of out){ e+=s.len*s.g/100; lo=Math.min(lo,e); }
  const jagd=segs.filter(s=>/Jagd/.test(s.label)).map(s=>dT(s.t0)), lichtung=[]; for(let a=d4+1900;a<dE-300;a+=2600) lichtung.push(['wiese',a,a+320]);
  return {name:'Trifels · Queichtal', start:'Burgwald unter dem Trifels', finish:'Queichtal', startElev:330, plainElev:330+lo-25, gpx:'trifels', ma:true, planbar:true,
    poly:st.P, segs:out, zones:[['wiese',d1-15,d2+15],['ort',d4-70,d4+80,{fach:.8,gewaende:.5,geh:.4,luecke:.3,licht:0}],['wiese',d4+80,d4+380],...lichtung], // sonst Pfälzerwald, im Tal ein paar Lichtungen
    breite:[[-50,d1-15,4.4],[d1-15,d2+15,7],[d2+15,1e9,4.4]], // schmaler Weg wie auf Berwartstein, Vorburg breit
    belag:[['erde',-50,d1,0],['pflaster',d1,d2,.5],['erde',d2,d4-70,0],['pflaster',d4-70,d4+80,.5],['erde',d4+80,1e9,0]], // keine Straße: Sandweg, Kopfstein in der Vorburg und am Wirtshaus
    orte:{loewenherz:dT(75), hof:[d1,d2], karren, burg:[karren[0],karren[1]-rh-55], wirtshaus:d4, jagd, ziel:dE}}; } // Meter für Welt und Ereignisse (Schritt 3–5)
