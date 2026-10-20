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
const SUEDPFALZ_GPX=[[0.0,-0.0,176.2],[0.4,10.8,176.2],[-18.9,122.8,176.5],[-10.5,125.3,176.5],[-41.1,294.9,178.1],[-41.7,335.4,178.0],[-39.4,361.7,177.9],[-26.1,498.9,177.4],[-24.2,562.9,176.7],[-28.1,630.7,176.0],[-43.9,699.0,175.9],[-46.4,709.0,176.2],[-48.6,717.2,176.6],[-56.7,754.7,178.0],[-57.2,759.1,178.2],[-57.2,763.6,178.3],[-51.1,815.6,180.3],[-45.7,855.8,181.8],[-47.2,872.7,182.4],[-56.8,897.0,183.1],[-82.2,933.9,183.8],[-89.2,944.4,184.1],[-93.7,950.5,184.2],[-116.2,984.3,184.8],[-165.2,1086.9,186.7],[-167.0,1091.0,186.7],[-171.5,1101.4,186.9],[-172.3,1114.1,187.1],[-176.8,1119.4,187.2],[-181.0,1130.7,187.4],[-180.4,1145.2,187.6],[-192.0,1157.4,188.4],[-221.9,1170.7,188.9],[-240.6,1177.0,189.4],[-258.5,1178.4,190.1],[-292.9,1174.0,191.5],[-340.7,1156.8,193.5],[-352.8,1157.2,194.0],[-374.7,1165.9,194.9],[-404.4,1187.2,196.3],[-423.9,1194.0,197.2],[-440.5,1196.5,197.8],[-452.8,1195.0,198.3],[-459.9,1187.9,198.8],[-472.5,1162.7,199.9],[-479.0,1154.6,200.3],[-490.8,1150.1,200.8],[-509.8,1149.1,201.6],[-529.9,1148.3,202.4],[-536.7,1145.4,202.7],[-565.7,1125.1,204.2],[-586.9,1121.0,205.0],[-616.9,1124.8,205.8],[-673.0,1139.1,207.1],[-741.0,1164.3,208.7],[-808.7,1184.1,210.2],[-858.5,1198.9,211.3],[-903.6,1211.4,212.2],[-1154.7,1287.6,217.4],[-1182.2,1296.0,217.9],[-1212.5,1304.5,218.5],[-1255.4,1322.3,219.4],[-1287.1,1343.9,220.1],[-1327.8,1396.4,221.3],[-1414.0,1538.2,228.0],[-1436.2,1576.7,229.3],[-1440.4,1583.6,229.4],[-1490.9,1667.4,229.8],[-1524.5,1713.4,230.1],[-1536.3,1727.3,230.2],[-1570.8,1770.7,227.9],[-1598.1,1799.5,225.9],[-1616.1,1810.7,224.9],[-1649.5,1825.9,223.1],[-1797.3,1887.5,216.4],[-1813.5,1894.3,215.7],[-1913.1,1937.1,212.4],[-1957.1,1963.1,211.7],[-1989.0,1989.5,211.1],[-2013.9,2019.5,210.6],[-2028.0,2041.4,210.3],[-2048.2,2079.5,210.6],[-2054.2,2096.6,210.9],[-2059.0,2113.3,211.2],[-2063.3,2129.9,211.5],[-2085.9,2222.3,213.0],[-2121.7,2223.1,213.6],[-2267.1,2226.0,215.9],[-2470.0,2233.9,219.4],[-2489.2,2234.7,219.8],[-2592.7,2247.0,222.2],[-2747.5,2275.8,225.5],[-2879.8,2301.5,227.3],[-2987.2,2312.6,228.9],[-3052.9,2323.1,229.9],[-3286.1,2367.8,235.0],[-3329.9,2372.3,235.7],[-3329.9,2381.5,235.8],[-3336.8,2382.5,235.9],[-3477.4,2397.6,237.8],[-3485.7,2398.9,238.0],[-3517.5,2404.0,238.4],[-3701.3,2439.5,241.0],[-3703.9,2432.4,241.1],[-3759.6,2445.1,242.2],[-3836.1,2462.9,243.7],[-3871.7,2471.2,244.4],[-3910.5,2477.9,245.4],[-3941.9,2478.6,246.3],[-3971.1,2476.9,247.0],[-3989.9,2475.3,247.5],[-3995.0,2474.9,247.7],[-4054.0,2466.9,249.3],[-4095.4,2457.6,250.0],[-4160.2,2436.2,250.8],[-4175.8,2431.8,251.0],[-4196.3,2423.2,251.2],[-4217.1,2414.3,251.5],[-4212.9,2407.6,251.6],[-4204.0,2395.0,251.8],[-4199.2,2390.5,251.8],[-4197.1,2388.7,251.9],[-4193.2,2385.2,251.9],[-4185.3,2379.9,251.9],[-4163.1,2361.3,251.5],[-4152.7,2355.6,251.3],[-4142.4,2353.1,251.1],[-4134.2,2354.7,251.0],[-4089.6,2368.1,250.3],[-4050.8,2372.0,249.8],[-4048.5,2372.2,249.7],[-4013.9,2375.7,249.2],[-3994.8,2377.6,249.0],[-3986.1,2378.3,249.0],[-3963.5,2380.1,248.9],[-3938.7,2381.7,248.8],[-3917.0,2378.9,248.7],[-3899.5,2373.7,248.6],[-3872.2,2359.8,248.5],[-3857.4,2349.3,248.4],[-3785.0,2285.7,249.1],[-3754.3,2262.8,249.8],[-3658.7,2205.9,251.9],[-3632.4,2176.3,252.6],[-3614.6,2141.6,253.4],[-3601.0,2089.8,254.4],[-3589.0,2052.3,255.2],[-3582.7,2040.2,255.5],[-3568.1,2015.6,256.2],[-3507.1,1937.8,260.1],[-3498.4,1915.3,261.0],[-3495.5,1907.7,261.3],[-3492.1,1881.3,262.4],[-3497.9,1842.6,263.9],[-3508.9,1816.3,264.9],[-3512.6,1811.1,265.2],[-3555.9,1761.1,267.6],[-3605.6,1711.7,270.2],[-3663.7,1649.0,271.1],[-3682.7,1618.9,271.1],[-3690.6,1588.5,271.1],[-3691.6,1559.8,271.2],[-3688.0,1537.9,271.2],[-3673.6,1503.7,271.2],[-3614.4,1433.6,270.8],[-3606.1,1425.2,270.8],[-3517.4,1330.1,270.3],[-3496.4,1312.2,270.2],[-3453.0,1290.2,270.1],[-3419.2,1284.1,270.0],[-3329.2,1278.1,268.9],[-3274.9,1274.3,268.0],[-3247.2,1265.4,267.5],[-3226.2,1249.4,267.1],[-3210.8,1224.4,266.6],[-3205.8,1194.0,265.7],[-3207.4,1183.0,265.4],[-3214.0,1166.3,264.8],[-3219.6,1155.1,264.4],[-3231.0,1141.6,263.9],[-3256.9,1122.4,262.9],[-3333.7,1064.5,260.0],[-3400.4,1013.5,257.1],[-3457.1,972.3,254.8],[-3466.9,962.3,254.3],[-3470.5,952.1,253.9],[-3471.3,926.1,253.1],[-3469.1,923.9,253.0],[-3459.4,922.3,252.7],[-3453.5,921.5,252.6],[-3445.3,920.1,252.3],[-3434.2,918.5,252.0],[-3428.9,916.9,251.8],[-3420.7,909.6,251.5],[-3398.5,878.3,250.3],[-3383.2,863.5,249.7],[-3361.3,851.9,249.0],[-3328.2,837.7,247.9],[-3317.1,833.3,247.6],[-3309.4,830.2,247.4],[-3270.4,815.5,246.5],[-3258.4,812.1,246.2],[-3245.2,808.5,245.9],[-3226.2,804.3,245.5],[-3220.4,802.6,245.4],[-3214.3,800.8,245.2],[-3202.1,796.4,244.9],[-3166.8,782.3,244.1],[-3156.1,777.8,243.9],[-3139.9,771.6,243.5],[-3118.1,762.0,243.1],[-3109.6,758.7,243.0],[-3104.7,757.1,242.9],[-3069.0,746.8,242.3],[-3040.4,744.2,241.9],[-3023.3,743.7,241.7],[-3009.7,743.4,241.5],[-2997.8,742.8,241.3],[-2993.3,742.6,241.2],[-2990.6,742.4,241.2],[-2970.3,739.3,240.9],[-2952.6,734.7,240.6],[-2943.2,731.0,240.5],[-2924.1,720.8,240.5],[-2904.2,702.8,240.6],[-2890.5,681.0,240.6],[-2866.7,613.1,240.8],[-2855.1,574.7,241.0],[-2837.1,539.0,240.2],[-2826.5,522.8,239.5],[-2778.3,464.9,236.7],[-2706.5,378.0,233.3],[-2703.2,373.9,233.2],[-2678.5,348.5,232.7],[-2655.4,325.9,232.3],[-2644.4,329.1,232.1],[-2639.8,330.4,232.0],[-2606.6,339.8,231.6],[-2481.5,392.5,232.9],[-2462.8,397.6,233.3],[-2438.0,397.9,233.9],[-2414.3,395.1,234.4],[-2349.4,380.0,236.0],[-2185.5,329.1,240.3],[-2147.5,420.2,241.5],[-2109.2,522.2,242.7],[-2018.2,513.4,241.1],[-1944.1,511.5,239.8],[-1868.3,515.3,238.1],[-1789.9,518.1,236.3],[-1664.0,511.7,233.3],[-1542.4,500.3,230.4],[-1429.1,495.2,226.7],[-1374.5,503.2,224.7],[-1339.7,512.4,223.4],[-1155.7,574.5,215.5],[-1088.9,586.9,213.1],[-970.6,603.3,209.8],[-954.9,606.5,209.3],[-932.0,607.6,208.7],[-852.8,598.5,206.3],[-852.0,588.6,206.0],[-852.0,555.3,205.0],[-865.6,471.4,202.3],[-869.3,463.7,202.0],[-907.5,383.5,198.3],[-952.7,332.7,195.5],[-961.7,319.7,194.8],[-1001.3,165.0,188.3],[-983.5,160.3,187.5],[-894.9,143.2,183.9],[-878.6,135.5,183.2],[-872.7,129.7,182.9],[-863.0,87.4,181.1],[-866.6,42.7,179.3],[-874.0,-46.4,177.2],[-882.4,-149.1,175.6],[-861.8,-148.9,175.3],[-808.6,-139.2,175.1],[-784.6,-137.1,175.2],[-682.7,-139.2,175.6],[-505.3,-129.2,174.8],[-436.6,-125.0,174.4],[-192.2,-105.2,176.0],[-177.3,-99.6,176.0],[-155.3,-76.2,176.0],[-126.0,-51.1,176.0],[-75.9,-37.4,176.1],[-16.8,-34.5,176.1],[-5.7,-27.4,176.1],[-0.6,-16.5,176.2],[-0.2,-7.6,176.2]];
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
// Landschaftsabschnitte: [Art, von m, bis m, Optionen] – Art: 'ort', 'reben', 'feld', 'wald' (außerhalb aller Abschnitte: Wald)
// Optionen Ort: fach (Anteil Fachwerk), luecke (Anteil größerer Lücken), geh (Gehwegbreite), seite (-1 links/1 rechts: nur eine Seite bebaut), abzweig (-1 links/1 rechts: Seitenstraße vor dem letzten Haus)
// Optionen Reben: baum (Anteil Obstbäume am Rand), weg (mittlerer Abstand kreuzender Wirtschaftswege in m)
// breite: [von, bis, Straßenbreite m] · belag: [Art, von, bis, Zusatzsteigung %] – Art 'pflaster' oder 'beton'
function kalmitDef(){ return Object.assign(gpxDef(KALMIT_GPX), {name:'Kalmit-Ostrampe', start:'Maikammer', finish:'Kalmit · 673 m', plainElev:110, kalmit:true, gpx:'kalmit', zones:[['ort',0,800],['reben',800,2300]]}); }
function suedpfalzDef(loop){ const g=gpxDef(SUEDPFALZ_GPX,10); g.poly.push(g.poly[0].slice()); // Runde schließen, sonst fehlen am Ziel 8 m Straße
  return Object.assign(g, {name:'Südpfalz-Klassiker', start:'Godramstein', finish:'Ziel', gpx:'suedpfalz', loop:!!loop,
  zones:[['ort',0,110,{luecke:.6,fach:.3,name:'Godramstein',kreis:'Stadt Landau in der Pfalz'}],['feld',110,1000],['ort',1000,2350,{fach:.7,geh:1,abzweig:-1,name:'Arzheim',kreis:'Stadt Landau in der Pfalz'}],['reben',2350,3500,{baum:.1,weg:300}],['ort',3500,3760,{seite:-1,luecke:.5,fach:.3,name:'Ilbesheim',kreis:'Kreis Südliche Weinstraße'}],
    ['reben',3760,5400,{baum:.1,weg:350}],['ort',5400,6200,{fach:.5,geh:.6,name:'Leinsweiler',kreis:'Kreis Südliche Weinstraße'}],['reben',6200,8000,{baum:.1,weg:220}],['ort',8000,9050,{luecke:.55,fach:.35,name:'Ranschbach',kreis:'Kreis Südliche Weinstraße'}],['reben',9050,1e9,{baum:0,weg:260}]],
  haardt:true, // Haardt als Bergkette im Westen
  breite:[[1000,2350,5],[3500,3760,5.5],[5400,6200,4.2],[8000,9050,6.6],[9080,12990,3.2]], belag:[['pflaster',5400,6000,3.5],['beton',9080,12990,0]]}); }
const zoneOf=(r,d)=>{ for(const z of r.zones) if(d>=z[1]&&d<z[2]) return z; return null; };
const zoneAt=(r,d)=>{ const z=zoneOf(r,d); return z?z[0]:'wald'; };
const zOpt=(r,d)=>{ const z=zoneOf(r,d); return z&&z[3]||{}; };
// Straßenbreite mit 12 m Übergang · Belag an der Stelle d (Kopfsteinpflaster bremst wie Zusatzsteigung)
const roadW=(r,d)=>{ let w=ROAD_W; for(const [a,b,bw] of r.breite) w+=(bw-ROAD_W)*Math.min(1,Math.max(0,Math.min(d-a+12,b+12-d)/12)); return w; };
const belagOf=(r,d)=>{ if(r.loop) d=((d%r.len)+r.len)%r.len; for(const b of r.belag) if(d>=b[1]&&d<b[2]) return b; return null; };
const belagAt=d=>{ const b=R&&R.belag?belagOf(R,d):null; return b?b[3]:0; };
const parzAt=(r,d)=>{ for(const p of r.parz) if(d>=p[0]&&d<p[1]) return p; return null; };
// Feld: Parzellen quer zur Straße (Typ 0 = Weinberg, 1–3 = Acker), an den Grenzen Feldwege oder Hecken; in Weinbergen vereinzelt Wirtschaftswege
function prepFeld(r){ const q=rng(99); r.parz=[]; r.wege=[]; r.hecke=[];
  for(const [t,a,b,o] of r.zones){ const e=Math.min(b,r.len);
    if(t==='feld'){ let d=a; while(d<e){ const L=35+q()*70; r.parz.push([d,Math.min(e,d+L),q()<.45?0:1+Math.floor(q()*3)]); d+=L; if(d<e-10){ const u=q(); if(u<.3) r.wege.push(d); else if(u<.65) r.hecke.push(d); } } }
    if(t==='reben' && o&&o.weg){ let d=a+o.weg*(.3+q()*.5); while(d<e-30){ r.wege.push(d); d+=o.weg*(.6+q()*.8); } } } }
const ROUTES=[{id:'kalmit', mode:'climb', title:'Kalmit-Ostrampe', sub:'ab Maikammer · Pfalz · echte GPX', def:kalmitDef()},
  {id:'stadion', mode:'loop', title:'Stadionrunde', sub:'Steilkurven · Westkurve', def:stadionDef()},
  {id:'suedpfalz', mode:'classic', title:'Südpfalz-Klassiker', sub:'Godramstein · Arzheim · Leinsweiler · Ranschbach · echte GPX', def:suedpfalzDef(false)},
  {id:'suedpfalz-runde', mode:'loop', title:'Südpfalz-Klassiker', sub:'Runde durch die Weinberge · echte GPX', def:suedpfalzDef(true)},
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
  const r={kf, name:def.name, start:def.start||'Start', finish:def.finish||'Ziel', kalmit:!!def.kalmit, gpx:!!def.gpx, loop:!!def.loop, zones:def.zones||[], breite:def.breite||[], belag:def.belag||[], parz:[], wege:[], hecke:[], xs, ys, len, segs, startElev:def.startElev, endElev:e, gain, def};
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
  r.fans = Math.max(r.len*0.6, r.len-1000);
  r.kehren=[]; if(r.kalmit) for(let dd=40; dd<len-40; dd+=STEP*5){ const dh=Math.abs(angDiff(headingAt(r,dd+25),headingAt(r,dd-25)));
    if(dh>1.25 && !r.kehren.some(k=>Math.abs(k-dd)<120)) r.kehren.push(dd); }
  prepFeld(r); makeScenery(r);
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
  const S={tree:[],rock:[],vine:[],vpost:[],grass:[],house:[],block:[],post:[],lamp:[],fan:[],bush:[],weg:[]}, R1=rng(42), R2=rng(7); // R2 nur für Neues, damit die Kalmit gleich bleibt
  const frame=d=>{ const [px,py]=posAt(r,d), h=headingAt(r,d); return {px,py,h,nx:-Math.sin(h),ny:Math.cos(h)}; };

  // Dorf: geschlossene Häuserzeilen direkt am Gehweg
  for(const [zt,za,zb,zo={}] of r.zones) if(zt==='ort'){ const geh=zo.geh??SIDEWALK;
  for(const side of (zo.seite?[zo.seite]:[-1,1])){ let d=za+6;
    while(d<zb-8){ const w=7+R1()*4.5, dep=8+R1()*3, f=frame(d+w/2), off=roadW(r,d+w/2)/2+geh+dep/2, upper=r.kalmit&&d-za>550;
      const cx=f.px+f.nx*side*off, cy=f.py+f.ny*side*off, ax=Math.cos(f.h), ay=Math.sin(f.h), rwh=roadW(r,d+w/2)/2+geh-.6;
      if(distRoad(cx,cy)>off-1.5 && (r.kalmit || [[1,1],[1,-1],[-1,1],[-1,-1]].every(([u,v])=>distRoad(cx+ax*u*w/2+f.nx*v*dep/2, cy+ay*u*w/2+f.ny*v*dep/2)>rwh)))
        S.house.push({x:f.px+f.nx*side*off, y:f.py+f.ny*side*off, w, dep, hgt:5.6+R1()*1.8, h:f.h, side, wall:upper&&R1()<.6?4:Math.floor(R1()*6), shut:Math.floor(R1()*3), roof:R1()<.5?'#b4472f':'#9e3a28', d:d+w/2, fw:!!zo.fach&&R2()<zo.fach});
      d+=w+(R1()<(upper?.45:.25)?2+R1()*(upper?9:3):0.2); if(zo.luecke&&R2()<zo.luecke) d+=4+R2()*12; } }
  for(let d=za+20; d<zb-10; d+=34){ const side=zo.seite||(((d-za)/34|0)%2?1:-1), f=frame(d), o=roadW(r,d)/2+geh-0.4; S.lamp.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, h:f.h, side, d}); } }
  // Seitenstraße kurz vor dem Ortsende: ersetzt das vorletzte Haus der Seite, danach steht nur noch ein Haus
  r.abzweig=null; for(const [zt,za,zb,zo={}] of r.zones) if(zt==='ort'&&zo.abzweig){ const side=zo.abzweig, L=S.house.filter(o=>o.side===side&&o.d>za&&o.d<zb).sort((a,b)=>a.d-b.d), h=L[L.length-2], d=h?h.d:zb-25, w=5;
    if(h) S.house.splice(S.house.indexOf(h),1); S.lamp=S.lamp.filter(o=>o.side!==side||Math.abs(o.d-d)>w/2+1.5); r.abzweig={d,side,w,len:70,geh:zo.geh??SIDEWALK}; }

  for(let d=0; d<r.len; d+=5){
    const z=zoneAt(r,d); if(z==='ort') continue;
    const f=frame(d);
    for(const side of [-1,1]){
      const inVine=z==='reben'||z==='feld', inFans=d>r.fans, tries=inVine?2:3;
      for(let t=0;t<tries;t++){
        const off=side*((inFans?10:6)+R1()*(inVine?55:45)), along=(R1()-.5)*5;
        const x=f.px+f.nx*off+Math.cos(f.h)*along, y=f.py+f.ny*off+Math.sin(f.h)*along, dr=distRoad(x,y);
        if(inVine) continue;
        const rad=2.2+R1()*3; if(dr<rad+roadW(r,d)/2+(inFans?7:2)) continue;
        if(R1()<.05) S.rock.push({x,y,s:1.2+R1()*2.6,rot:R1()*6});
        else S.tree.push({x,y,s:rad,c:R1(),pine:R1()<.5,ht:9+R1()*7});
      }
    }
    const rw=roadW(r,d)/2;
    if(z==='reben' && d%30<5) for(const side of [-1,1]) if(R1()<(zOpt(r,d).baum??.55)) S.tree.push({x:f.px+f.nx*side*(rw+3.2+R1()*1.5), y:f.py+f.ny*side*(rw+3.2+R1()*1.5), s:1.6+R1()*.8, c:R1(), pine:false, ht:3, fruit:true});
    for(const side of [-1,1]) for(let t=0;t<3;t++){ const off=side*(rw+1+R1()*4.5), al=(R1()-.5)*5; S.grass.push({x:f.px+f.nx*off+Math.cos(f.h)*al, y:f.py+f.ny*off+Math.sin(f.h)*al, s:.5+R1()*.6, c:R1(), r:R1()*6, wood:z==='wald'&&zoneAt(r,d-.01)==='wald'}); }
    // Sandsteinblöcke und Leitpfosten am Straßenrand (Wald)
    if(z==='wald' || zoneAt(r,d+199)==='wald'){
      for(const side of [-1,1]){
        if(R1()<.16 && d<r.fans) S.block.push({x:f.px+f.nx*side*(rw+1.1), y:f.py+f.ny*side*(rw+1.1), h:f.h+(R1()-.5)*.3, s:.7+R1()*.6});
        if(Math.round(d)%50===0) S.post.push({x:f.px+f.nx*side*(rw+0.7), y:f.py+f.ny*side*(rw+0.7), h:f.h});
      }
    }
  }
  // Rebzeilen quer zur Straße: jede Zeile läuft vom Straßenrand senkrecht weg, Zeilenabstand 2,4 m
  for(const [zt,za,zb,zo={}] of r.zones){ const sides=zt==='reben'||zt==='feld'?[-1,1]:zt==='ort'&&zo.seite?[-zo.seite]:null; if(!sides) continue;
  for(let d=za-(zt==='reben'?10:0); d<Math.min(zb,r.len); d+=2.4){ const f=frame(d);
    if(zt==='feld'){ const p=parzAt(r,d); if(!p||p[2]!==0||d-p[0]<2||p[1]-d<2) continue; }
    if(r.wege.some(w=>Math.abs(w-d)<2.6)) continue; // Lücke für den Wirtschaftsweg
    for(const side of sides) for(let k=0; k<(r.kalmit?22:14); k++){ const off=side*(roadW(r,d)/2+3.5+k*3.0), x=f.px+f.nx*off, y=f.py+f.ny*off;
      if(distRoad(x,y)<Math.abs(off)-1.2) break; S.vine.push({x,y,rot:f.h+Math.PI/2,c:R1()}); if(k%3===0) S.vpost.push({x,y,h:f.h}); } } }
  // Wirtschaftswege quer zur Straße, Hecken an Feldgrenzen
  for(const w of r.wege){ const f=frame(w), rw=roadW(r,w)/2; for(const side of [-1,1]) for(let o=rw+1.6; o<rw+75; o+=3) S.weg.push({x:f.px+f.nx*side*o, y:f.py+f.ny*side*o, h:f.h}); }
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
  // Zuschauer an der Seitenstraße, darunter Michel und Marion (u: Abstand vom Straßenrand, al: längs der Hauptstraße)
  if(r.abzweig){ const A=r.abzweig, f=frame(A.d), s=A.side, rw=roadW(r,A.d)/2, ax=Math.cos(f.h), ay=Math.sin(f.h), hw=A.w/2;
    const fan=(u,al,o={})=>S.fan.push(Object.assign({x:f.px+f.nx*s*(rw+u)+ax*al, y:f.py+f.ny*s*(rw+u)+ay*al, face:Math.atan2(-f.nx*s,-f.ny*s)+(R2()-.5)*.7,
      jack:JACK[Math.floor(R2()*JACK.length)], legs:R2()<.6?'#2a2f3a':'#4a5568', tall:.9+R2()*.2, arms:R2()<.7?2:1, phone:R2()<.3, cap:R2()<.3?JACK[Math.floor(R2()*JACK.length)]:null, flag:false, ph:R2()*6.3, d:A.d+al, u}, o));
    fan(.55,-hw-1.1,{name:'Marion', paar:1, face:Math.atan2(-f.nx*s,-f.ny*s), tall:.93, jack:'#b5523b', legs:'#2a2f3a', cap:'#d8cfc0', arms:2, phone:false, ph:.4});
    fan(.55,-hw-2.8,{name:'Michel', paar:1, face:Math.atan2(-f.nx*s,-f.ny*s), tall:1.01, jack:'#4a6b8a', legs:'#6b6255', cap:'#b9b9b4', arms:2, phone:false, ph:.8});
    [[.55,-hw-4.6],[.6,-hw-5.5],[.55,hw+1],[.6,hw+1.9],[A.geh+2.5,-hw+.6,{flag:true}],[A.geh+2.2,hw-.6],[A.geh+4.6,hw-.7]].forEach(([u,al,o])=>fan(u,al,o)); }
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

