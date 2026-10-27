/* ===== Mars: nach 60 % der Workout-Zeit ~2 min Fahrt über eine Marskugel (Zone R.def.mars aus spaceDef, Kurven über maz dort), im echten Verhältnis zum Mond (Radius 1,95 ×, nur wenn sich die Kugeln sonst überschneiden kleiner, höchstens bis 1,5 ×); Kratersprung, Schildvulkan im Rechtsbogen, Schlucht, Rover mit Drohne, Staubteufel, Phobos und Deimos am Himmel ===== */
// Bahnhöhe wie beim Mond (prepMond): Kugel unter die Zone, An- und Abflug weich, übrige Bahn mindestens 25 m über beiden Kugeln (Versatz r.MA.off, liest roadY); dazu Schanze, Flugparabel über den Krater und Landehang, dort keine Fahrbahn (marsLuecke)
function prepMars(r){ r.MA=null; const Z=r.def.mars; if(!Z) return; const a=Z.d0*r.kf, b=Z.d1*r.kf, Lw=r.len-r.ring, M=r.M;
  const seg=d=>{ const s=r.segs; let lo=0, hi=s.length-1; while(lo<hi){ const m=(lo+hi+1)>>1; if(s[m].d0<=d) lo=m; else hi=m-1; } return s[lo]; }, ve=d=>{ const s=seg(d); return s.ve0+(d-s.d0)*s.vg/100; };
  const h0=d=>{ if(M&&d>M.a2&&d<M.b2){ const f=(d-M.a2)/STEP, i=Math.min(M.py.length-2,Math.floor(f)); return M.py[i]+(M.py[i+1]-M.py[i])*(f-i); } return ve(d)+(M&&d>=M.b2?M.off:0); }; // Bahnhöhe ohne Mars
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(let d=a; d<=b; d+=20){ const [x,z]=posAt(r,d); x0=Math.min(x0,x); x1=Math.max(x1,x); z0=Math.min(z0,z); z1=Math.max(z1,z); }
  const cx=(x0+x1)/2, cz=(z0+z1)/2; let rm=0; for(let d=a; d<=b; d+=20){ const [x,z]=posAt(r,d); rm=Math.max(rm,Math.hypot(x-cx,z-cz)); }
  const RM=M?M.RP:Math.max(5000,Math.min(9000,rm/.22)); let RP=RM*1.95; // Mars 3390 km, Mond 1737 km Radius
  if(M){ const dh=Math.hypot(cx-M.cx,cz-M.cz); if(dh<RP+M.RP) RP=Math.max(RM*1.5,dh-M.RP); }
  const kug=(x,z)=>{ const q=RP*RP-(x-cx)**2-(z-cz)**2; return q>0?Math.sqrt(q):-1e9; }, S=d=>{ const [x,z]=posAt(r,d); return kug(x,z); };
  const mondY=(x,z)=>{ if(!M) return -1e9; const q=M.RP*M.RP-(x-M.cx)**2-(z-M.cz)**2; return q>0?M.cy+Math.sqrt(q):-1e9; };
  const frei=(d0,d1,f)=>{ let c=1e9; for(let d=d0; d<=d1; d+=10){ const [x,z]=posAt(r,d), h=kug(x,z); if(h>-1e8) c=Math.min(c,f(d,h)); } return c; };
  // Anflug: hinab auf den Mars (wie beim Mond), frühestens hinter dem Mond-Abflug; die Zone selbst bleibt über der Mondkugel
  const dMin=M?M.b2+20:60; let ha=800, a2=a, cy=0;
  for(let it=0; it<4; it++){ a2=Math.max(dMin,a-ha); cy=Math.min(h0(a)-S(a), h0(a2)-S(a)-30, frei(0,a2,(d,h)=>h0(d)-25-h)); ha=Math.min(2500,Math.max(800,(h0(a2)-cy-S(a))/.22)); }
  for(let d=a; d<=b; d+=20){ const [x,z]=posAt(r,d); cy=Math.max(cy,mondY(x,z)+25-S(d)); }
  // Abflug: übrige Bahn mit ihren eigenen Steigungen ab der Abflughöhe, bei Bedarf höher (über beiden Kugeln)
  const Y=d=>cy+S(d), yB=Y(b); let ex=0; for(let d=b+300; d<=r.len; d+=10){ const [x,z]=posAt(r,d); ex=Math.max(ex,Math.max(cy+kug(x,z),mondY(x,z))+25-(ve(d)-ve(b)+yB)); }
  const off=yB+ex-ve(b)-(M?M.off:0), b2=Math.min(Lw-60,b+Math.min(2500,Math.max(500,ex/.2)));
  const hm=(t,p0,m0,p1,m1,h)=>{ const t2=t*t, t3=t2*t; return (2*t3-3*t2+1)*p0+(t3-2*t2+t)*h*m0+(-2*t3+3*t2)*p1+(t3-t2)*h*m1; };
  const ha2=a-a2, hb=b2-b, ya=h0(a2), ma=(h0(a2+2)-h0(a2-2))/4, yA=Y(a), mA=(Y(a+2)-Y(a-2))/4, mB=(Y(b+2)-Y(b-2))/4, yb=ve(b2)-ve(b)+yB+ex, mb=seg(b2).vg/100;
  const n=Math.ceil((b2-a2)/STEP)+1, py=new Float32Array(n);
  for(let i=0;i<n;i++){ const d=a2+i*STEP; let y=d<a?hm((d-a2)/ha2,ya,ma,yA,mA,ha2):d<=b?Y(d):hm(Math.min(1,(d-b)/hb),yB,mB,yb,mb,hb); if(d<a||d>b) y=Math.max(y,Y(d)+.3); py[i]=y; }
  // Kratersprung: Schanze (MARS_RAMPE m, endet mit Steigung MARS_M0), Flugparabel über die Weite S (in spaceDef aus dem geplanten Tempo bei Marsschwerkraft), Landehang spiegelbildlich
  const RA=MARS_RAMPE, hK=MARS_M0*RA/2, SW=Z.S, sJ=Z.sprung*r.kf, l0=sJ-SW/2, l1=sJ+SW/2, sprung=l0-RA>a+100&&l1+RA<b-100;
  if(sprung) for(let i=0;i<n;i++){ const d=a2+i*STEP; if(d<=l0-RA||d>=l1+RA) continue; const y=Y(d); py[i]=d<l0?y+hK*((d-l0+RA)/RA)**2:d<=l1?y+hK+MARS_M0*(d-l0)*(1-(d-l0)/SW):y+hK*(1-(d-l1)/RA)**2; }
  r.MA={a,b,a2,b2:a2+(n-1)*STEP,cx,cz,cy,RP,py,off,vulkan:Z.vulkan*r.kf, ...(sprung?{sJ,SW,l0,l1,hK}:{})};
}
// Fahrbahn über dem Krater weglassen (ribbon/waveRib in welt-space.js)
const marsLuecke=d=>{ const K=R.MA; return !!K&&d>=K.l0&&d<K.l1; };

function buildMars(fr){ const M=R.MA; if(!M) return null; const {a,b,cx,cz,cy,RP}=M, q=rng(1976), W=600, C=12, CG=48, BK=160, TIEF=30, hw=ROAD_W/2, RA=MARS_RAMPE;
  const G=new THREE.Group(), nah=new THREE.Group(); G.userData.ohneBoden=true; G.add(nah); world.add(G); camera.far=Math.max(camera.far,90000); camera.updateProjectionMatrix(); // große Kugel schon von Weitem ganz
  const kugel=(x,z)=>{ const s=RP*RP-(x-cx)**2-(z-cz)**2; return cy+(s>0?Math.sqrt(s):0); }, sm=t=>{ t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
  // Kugel: rostrot mit dunklen Hochländern, hellen Staubflächen, Talgraben und Polkappen, Pol zur Seite; dünne Lufthülle (von innen: lachsfarbener Himmel)
  const kt=canvasTex(1024,512,g=>{ const r=rng(11); g.fillStyle='#b4562e'; g.fillRect(0,0,1024,512);
    for(let i=0;i<40;i++){ g.fillStyle=`rgba(${r()<.55?'92,40,24':'212,128,78'},${.15+r()*.25})`; g.beginPath(); g.ellipse(r()*1024,70+r()*372,30+r()*160,15+r()*60,r()*3,0,7); g.fill(); }
    g.strokeStyle='rgba(70,28,16,.6)'; g.lineWidth=7; g.lineCap='round'; g.beginPath(); g.moveTo(380,240); for(let x=380;x<720;x+=20) g.lineTo(x,240+Math.sin(x*.05)*10+(x-380)*.08); g.stroke();
    for(let i=0;i<260;i++){ const x=r()*1024, y=r()*512, rr=1.5+Math.pow(r(),3)*16; g.fillStyle=`rgba(60,20,10,${.1+r()*.15})`; g.beginPath(); g.arc(x,y,rr,0,7); g.fill(); }
    g.fillStyle='#f3efe9'; g.fillRect(0,0,1024,24); g.fillRect(0,494,1024,18); for(let i=0;i<30;i++){ g.beginPath(); g.ellipse(r()*1024,24,20+r()*50,6+r()*14,0,0,7); g.fill(); } });
  const ku=new THREE.Mesh(new THREE.SphereGeometry(RP-TIEF,192,112),new THREE.MeshLambertMaterial({map:kt, fog:false})); ku.position.set(cx,cy,cz); ku.rotation.x=Math.PI/2; G.add(ku);
  const luft=new THREE.Mesh(new THREE.SphereGeometry(RP*1.025,96,64),new THREE.MeshBasicMaterial({color:'#ff9a6a', transparent:true, opacity:.16, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.BackSide, fog:false})); luft.position.copy(ku.position); G.add(luft);
  // Bahnpunkte alle 8 m (mit Meter), in Fächern zu 160 m für die Abstandssuche
  const P=[]; for(let d=M.a2; d<=M.b2; d+=8){ const f=fr(d); P.push([f.x,f.z,f.y,d]); }
  const fk=(i,j)=>i*100003+j, fach=new Map(); for(let i=0;i<P.length-1;i++){ const k=fk(Math.floor((P[i][0]+P[i+1][0])/2/BK),Math.floor((P[i][1]+P[i+1][1])/2/BK)); let L=fach.get(k); if(!L) fach.set(k,L=[]); L.push(i); }
  const naechst=(x,z,ring)=>{ let best=1e18, y=0, dd=-1; const bx=Math.floor(x/BK), bz=Math.floor(z/BK);
    for(let u=-ring;u<=ring;u++) for(let v=-ring;v<=ring;v++){ const L=fach.get(fk(bx+u,bz+v)); if(!L) continue;
      for(const i of L){ const p=P[i], c=P[i+1], ex=c[0]-p[0], ez=c[1]-p[1], l2=ex*ex+ez*ez||1, t=Math.max(0,Math.min(1,((x-p[0])*ex+(z-p[1])*ez)/l2)), dx=p[0]+ex*t-x, dz=p[1]+ez*t-z, e=dx*dx+dz*dz; if(e<best){ best=e; y=p[2]+(c[2]-p[2])*t; dd=p[3]+(c[3]-p[3])*t; } } }
    return [Math.sqrt(best),y,dd]; };
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; for(const p of P){ x0=Math.min(x0,p[0]); x1=Math.max(x1,p[0]); z0=Math.min(z0,p[1]); z1=Math.max(z1,p[1]); } x0-=W; x1+=W; z0-=W; z1+=W;
  const gx=Math.ceil((x1-x0)/CG)+2, gz=Math.ceil((z1-z0)/CG)+2, GD=new Float32Array(gx*gz), GY=new Float32Array(gx*gz);
  for(let j=0;j<gz;j++) for(let i=0;i<gx;i++){ const [dn,y]=naechst(x0+i*CG,z0+j*CG,5); GD[j*gx+i]=Math.min(dn,9999); GY[j*gx+i]=y; }
  const dist=(x,z)=>{ const fx=(x-x0)/CG, fz=(z-z0)/CG, i=Math.max(0,Math.min(gx-2,Math.floor(fx))), j=Math.max(0,Math.min(gz-2,Math.floor(fz))), u=fx-i, v=fz-j, k=j*gx+i, bl=A=>(A[k]*(1-u)+A[k+1]*u)*(1-v)+(A[k+gx]*(1-u)+A[k+gx+1]*u)*v;
    const dn=bl(GD); if(dn<150){ const e=naechst(x,z,1); if(e[0]<150) return e; } return [dn,bl(GY),-1]; };
  // Schildvulkan innen im großen Bogen (Größe nach dem Bogenradius), oben mit Caldera
  const dV=M.vulkan, kV=angDiff(headingAt(R,dV+40),headingAt(R,dV-40))/80, sV=kV<0?-1:1, rB=1/Math.max(1/2000,Math.abs(kV)), VR=Math.max(80,Math.min(260,rB*.65)), VH=VR*.34, fV=fr(dV);
  const vul={x:fV.x+fV.nx*sV*(VR+hw+25), z:fV.z+fV.nz*sV*(VR+hw+25)}, UC=.16, HC=VH*Math.pow(1-UC,1.4);
  const vulkan=x=>x>=1?0:x>UC?VH*Math.pow(1-x,1.4):HC-VH*.14*(1-(x/UC)**4);
  // Schlucht: 140 m neben der Bahn im ersten Drittel (gegenüber vom Vulkan), flacher Grund, Steilwände mit Gesteinsschichten, an den Enden flach auslaufend
  const sC=-sV, PC=[]; for(let d=a+80; d<=a+(b-a)*.3; d+=16){ const f=fr(d); PC.push([f.x+f.nx*sC*140, f.z+f.nz*sC*140]); }
  const schlucht=(x,z)=>{ let best=1e18, tt=0; for(let i=0;i<PC.length-1;i++){ const p=PC[i], c=PC[i+1]; if(Math.abs(x-p[0])>140||Math.abs(z-p[1])>140) continue; const ex=c[0]-p[0], ez=c[1]-p[1], l2=ex*ex+ez*ez||1, t=Math.max(0,Math.min(1,((x-p[0])*ex+(z-p[1])*ez)/l2)), dx=p[0]+ex*t-x, dz=p[1]+ez*t-z, e=dx*dx+dz*dz; if(e<best){ best=e; tt=(i+t)/(PC.length-1); } } return [Math.sqrt(best),tt]; };
  const CD=60, CW=55;
  // Krater: wenige kleine an der Bahn entlang (Mars hat weniger als der Mond), dazu der Sprungkrater mitten auf der Bahn (Rand knapp unter der Schanzenkante)
  const kfach=new Map(); for(let i=0, nK=Math.round(P.length*.35); i<nK; i++){ const p=P[Math.floor(q()*P.length)], an=q()*6.283, ab=q()*W, r=8+Math.pow(q(),3)*50, o={x:p[0]+Math.cos(an)*ab, z:p[1]+Math.sin(an)*ab, r, t:r*.2};
    const k=fk(Math.floor(o.x/BK),Math.floor(o.z/BK)); let L=kfach.get(k); if(!L) kfach.set(k,L=[]); L.push(o); }
  const k1=(k,x,z,acc)=>{ const dx=x-k.x, dz=z-k.z; if(Math.abs(dx)>k.r*1.7||Math.abs(dz)>k.r*1.7) return; const u=Math.sqrt(dx*dx+dz*dz)/k.r;
    if(u<1){ acc[0]-=k.t*(1-u*u); acc[1]-=.1*(1-u); } acc[0]+=k.t*.38*Math.exp(-(((u-1)/.22)**2)); };
  const fJ=M.l0!=null?fr(M.sJ):null, CR=M.l0!=null?M.SW/2:0, KT=Math.max(18,CR*.3), RH=(M.hK||0)*.8;
  const kj=(x,z)=>{ if(!fJ) return 0; const u=Math.hypot(x-fJ.x,z-fJ.z)/CR; return u<1?-KT*(1-u*u)+RH*u**6:RH*Math.exp(-(((u-1)/.25)**2)); };
  const boden=(x,z)=>{ const acc=[0,0], bx=Math.floor(x/BK), bz=Math.floor(z/BK); for(let u=-1;u<=1;u++) for(let v=-1;v<=1;v++){ const L=kfach.get(fk(bx+u,bz+v)); if(L) for(const k of L) k1(k,x,z,acc); }
    const uv=Math.hypot(x-vul.x,z-vul.z)/VR; if(uv<1){ acc[0]+=vulkan(uv); acc[1]-=.1*(1-uv); }
    const [gd,tt]=schlucht(x,z); if(gd<CW+40){ const tief=CD*sm((CW-gd)/30)*sm(tt/.15)*sm((1-tt)/.15); acc[0]-=tief; if(tief>4) acc[1]+=.07*Math.sin(tief*.4)-.04; }
    return acc; };
  // Höhe: Kugel mit Kratern, Vulkan und Schlucht, an der Bahn bündig (Schanze und Landehang ganz aufgeschüttet, über dem Krater frei), Rand taucht unter die Kugel
  const H=(x,z,dn,yr,dd)=>{ const [kh,ks]=boden(x,z), wk=sm((dn-hw-6)/20), fl=(Math.sin(x*.05)*Math.cos(z*.045)+Math.sin(x*.019+z*.027))*.7, fliegt=dd>M.l0&&dd<M.l1, schanze=!fliegt&&dd>M.l0-RA&&dd<M.l1+RA;
    let h=kugel(x,z)+(kh+fl)*wk+kj(x,z)*(fliegt?1:wk); if(!fliegt){ const df=yr-.22-h, k=sm((dn-hw-1)/28); h+=df<0?df*(1-k):df*(1-k)*(schanze?1:Math.max(0,1-(df-1)/4)); }
    return [h-45*sm((dn-W+140)/140), ks*wk]; };
  const hoehe=(x,z)=>{ const [dn,yr,dd]=dist(x,z); return H(x,z,dn,yr,dd)[0]; };
  const nx=Math.ceil((x1-x0)/C)+1, nz=Math.ceil((z1-z0)/C)+1, idx=new Int32Array(nx*nz).fill(-1), pos=[], col=[], id=[];
  for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){ const x=x0+i*C, z=z0+j*C, [dn,yr,dd]=dist(x,z); if(dn>W) continue; const [h,s]=H(x,z,dn,yr,dd), g=.62+s+.05*Math.sin(x*.013+Math.cos(z*.011)*2)+(q()-.5)*.04;
    idx[j*nx+i]=pos.length/3; pos.push(x,h,z); col.push(g*1.05,g*.52,g*.31); }
  for(let j=0;j<nz-1;j++) for(let i=0;i<nx-1;i++){ const A=idx[j*nx+i], B=idx[j*nx+i+1], Cc=idx[(j+1)*nx+i], D=idx[(j+1)*nx+i+1]; if(A>=0&&B>=0&&Cc>=0&&D>=0) id.push(A,Cc,B, B,Cc,D); }
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); geo.setIndex(id); geo.computeVertexNormals();
  const bo=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true, fog:false})); bo.frustumCulled=false; nah.add(bo);
  // Rover: fährt hinter dem Sprung neben der Bahn langsam hin und her, Kamerakopf schaut dir nach
  const auf=(d,u)=>{ const f=fr(d), x=f.x+f.nx*u, z=f.z+f.nz*u; return [x,hoehe(x,z),z]; };
  const dR=Math.min(b-150,(M.l1!=null?M.l1+RA:a+(b-a)*.6)+260), sR=sC, hR=headingAt(R,dR), fR=fr(dR);
  // Felsbrocken neben der Bahn (Platz um den Rover frei)
  const br=[]; for(let i=0, nB=Math.round((b-a)/5); i<nB; i++){ const d=a+q()*(b-a), sd=q()<.5?-1:1, u=sd*(hw+4+Math.pow(q(),1.6)*240), s=q()<.1?1.5+q()*3:.25+q()*1.1; if(sd===sR&&Math.abs(d-dR)<45&&Math.abs(u)<hw+22) continue; const [x,y,z]=auf(d,u); br.push({x,y:y+s*.3,z,s,a:q()*6,b:q()*6,c:q()}); }
  const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),new THREE.MeshLambertMaterial({color:'#ffffff'}),br.length), m4=new THREE.Matrix4(), qu=new THREE.Quaternion(), e=new THREE.Euler(), cc=new THREE.Color();
  br.forEach((o,i)=>{ m4.compose(new THREE.Vector3(o.x,o.y,o.z), qu.setFromEuler(e.set(o.a,o.b,0)), new THREE.Vector3(o.s,o.s*.6,o.s*.85)); im.setMatrixAt(i,m4); im.setColorAt(i,cc.setRGB(.42+o.c*.2,.2+o.c*.1,.12+o.c*.06)); }); nah.add(im);
  const weiss=new THREE.MeshLambertMaterial({color:'#ddd6c8'}), dunkel=new THREE.MeshLambertMaterial({color:'#2e3036'}), grau=new THREE.MeshLambertMaterial({color:'#8a8f98'}), gold=new THREE.MeshLambertMaterial({color:'#c99a3c', emissive:'#2a1c06'});
  const box=(w,h,d,m,x,y,z,o)=>{ const k=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); k.position.set(x,y,z); o.add(k); return k; };
  const rover={g:new THREE.Group(), r0:[fR.x+fR.nx*sR*(hw+13), fR.z+fR.nz*sR*(hw+13)], dir:[Math.cos(hR),Math.sin(hR)], hd:hR, raeder:[], s:0}; rover.g.rotation.y=-hR; nah.add(rover.g);
  { const g=rover.g; box(2.4,.65,1.7,weiss,0,1.05,0,g); box(2.2,.06,1.5,dunkel,0,1.41,0,g); box(.3,.35,1.4,gold,-1.15,1.0,0,g);
    const rtg=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.8,10),grau); rtg.position.set(-1.45,1.3,0); rtg.rotation.z=-.9; g.add(rtg);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,1.3,8),weiss); mast.position.set(.95,2.0,.55); g.add(mast);
    rover.kopf=new THREE.Group(); rover.kopf.position.set(.95,2.7,.55); g.add(rover.kopf); box(.3,.26,.55,weiss,0,0,0,rover.kopf); for(const z of [-.14,.14]) box(.06,.1,.1,dunkel,.16,0,z,rover.kopf);
    const arm=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.1,6),weiss); arm.position.set(1.4,.9,-.4); arm.rotation.z=1.2; g.add(arm);
    const schuessel=new THREE.Mesh(new THREE.CylinderGeometry(.28,.05,.12,14),grau); schuessel.position.set(.3,1.62,-.5); schuessel.rotation.x=.5; g.add(schuessel);
    for(const x of [-1,0,1]) for(const z of [-1.05,1.05]){ const ra=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.26,14),dunkel); ra.rotation.x=Math.PI/2; ra.position.set(x*.95,.27,z); g.add(ra); rover.raeder.push(ra);
      box(.08,.55,.08,grau,x*.95,.62,z*.9,g); }
    for(const z of [-.95,.95]) box(2,.08,.08,grau,0,.85,z,g); }
  // Drohne (kleiner Hubschrauber, zwei gegenläufige Rotoren): wartet über dem Rover, fliegt ein Stück neben dir her, bleibt dann steigend zurück
  const dr={g:new THREE.Group(), rot:[], v:new THREE.Vector3(), alt:new THREE.Vector3()}; nah.add(dr.g); dr.g.scale.setScalar(1.6);
  { const g=dr.g; box(.3,.26,.3,gold,0,0,0,g); for(const [x,z] of [[1,1],[1,-1],[-1,1],[-1,-1]]){ const b2=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.6,5),weiss); b2.position.set(x*.25,-.3,z*.25); b2.rotation.set(-z*.4,0,x*.4); g.add(b2); }
    const ac=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.7,6),grau); ac.position.y=.45; g.add(ac); box(.42,.02,.36,dunkel,0,.82,0,g);
    for(const [y,s] of [[.4,1],[.6,-1]]){ const rt=new THREE.Group(); rt.position.y=y; rt.userData.s=s; g.add(rt); dr.rot.push(rt); box(1.2,.015,.1,grau,0,0,0,rt); } }
  { const [x,y,z]=auf(dR,sR*(hw+13)); dr.g.position.set(x,y+4,z); dr.alt.copy(dr.g.position); }
  // Staubteufel: drehende Staubsäulen in der Ferne, wandern langsam
  const stt=canvasTex(64,256,g=>{ const r=rng(5); for(let i=0;i<70;i++){ g.fillStyle=`rgba(255,255,255,${.05+r()*.18})`; g.fillRect(r()*64,r()*256,2+r()*7,20+r()*90); } });
  const teufel=[]; for(let i=0;i<4;i++){ const d=a+(b-a)*(.12+i*.24)+q()*120, u=(q()<.5?-1:1)*(130+q()*300), f=fr(d), g=new THREE.Group(), H0=70+q()*60, sch=[];
    for(let k=0;k<5;k++){ const r0=2.5+k*4.5, r1=r0+4.5, m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r0,H0/5,20,1,true),new THREE.MeshBasicMaterial({map:stt, color:'#d9a47c', transparent:true, opacity:.34-k*.05, depthWrite:false, side:THREE.DoubleSide, fog:false})); m.position.y=H0/10+k*H0/5; g.add(m); sch.push(m); }
    nah.add(g); teufel.push({g, sch, x:f.x+f.nx*u, z:f.z+f.nz*u, ph:q()*6, w:.04+q()*.04}); }
  // Phobos und Deimos: kantige Brocken hoch über dem Mars (zu sehen, nicht maßstabsgetreu; Phobos etwa doppelt so groß)
  const monde=[]; { const p=fr(a), o=fr(b), dl=Math.hypot(o.x-p.x,o.z-p.z)||1, vx=(o.x-p.x)/dl, vz=(o.z-p.z)/dl;
    const mt=canvasTex(256,128,g=>{ const r=rng(77); g.fillStyle='#7a6a5c'; g.fillRect(0,0,256,128); for(let i=0;i<90;i++){ const x=r()*256, y=r()*128, rr=1+Math.pow(r(),3)*12; g.fillStyle=`rgba(30,22,16,${.15+r()*.2})`; g.beginPath(); g.arc(x,y,rr,0,7); g.fill(); } });
    for(const [gr,ab,hoch,seit,sk] of [[450,9000,2600,.5,[1.4,1,1.1]],[230,15000,5200,-.7,[1.2,1,.95]]]){ const geoM=new THREE.IcosahedronGeometry(1,3), pa=geoM.attributes.position, r=rng(gr);
      for(let i=0;i<pa.count;i++){ const x=pa.getX(i), y=pa.getY(i), z=pa.getZ(i), k=1+.18*Math.sin(x*3+r()*.3)*Math.cos(y*2.5)+.1*Math.sin(z*5); pa.setXYZ(i,x*k,y*k,z*k); } geoM.computeVertexNormals();
      const mo=new THREE.Mesh(geoM,new THREE.MeshLambertMaterial({map:mt, fog:false})); mo.scale.set(sk[0]*gr,sk[1]*gr,sk[2]*gr); mo.position.set(cx+vx*ab-vz*seit*ab, cy+RP+hoch, cz+vz*ab+vx*seit*ab); G.add(mo); monde.push(mo); } }
  // Schilder vor der Landung und vor dem Sprung
  { const f=fr(a-60), sp=neonSprite('MARS','#ff9a6a',8); sp.position.set(f.x,f.y+7,f.z); nah.add(sp); }
  if(M.l0!=null){ const f=fr(M.l0-RA-150), sp=neonSprite('KRATERSPRUNG','#ffd23a',8); sp.position.set(f.x,f.y+7,f.z); nah.add(sp); }
  return {G, nah, a2:M.a2, b2:M.b2, hoehe, rover, dr, dR, sR, teufel, monde};
}
// Mars: Oberfläche nur in der Nähe; Rover, Drohne, Staubteufel, Monde drehen sich
function poseMars(M,dt,t){ M.monde.forEach((m,i)=>m.rotation.y=t*(.02+i*.015)); M.nah.visible=me.d>M.a2-1500&&me.d<M.b2+1500; if(!M.nah.visible) return;
  const ich=riders3d[myKey], rp=ich&&ich.g.position, Ro=M.rover, s=22*Math.sin(t*.014), ds=s-Ro.s; Ro.s=s;
  const x=Ro.r0[0]+Ro.dir[0]*s, z=Ro.r0[1]+Ro.dir[1]*s; Ro.g.position.set(x,M.hoehe(x,z),z); Ro.raeder.forEach(r=>r.rotation.y-=ds/.27);
  let ky=Math.sin(t*.4)*.8; if(rp&&Math.hypot(rp.x-x,rp.z-z)<120){ const w=Math.atan2(rp.z-z,rp.x-x); ky=-angDiff(w,Ro.hd); } Ro.kopf.rotation.y+=(ky-Ro.kopf.rotation.y)*Math.min(1,dt*3);
  // Drohne: folgt dir ab 150 m vor dem Rover bis 700 m dahinter, sonst schwebt sie (zuerst über dem Rover, danach steigend an ihrer letzten Stelle)
  const D=M.dr, g=D.g, ziel=new THREE.Vector3(); if(rp&&me.d>M.dR-150&&me.d<M.dR+700){ const hd=headingAt(R,me.d); ziel.set(rp.x-Math.sin(hd)*M.sR*4+Math.cos(hd)*3, rp.y+3.5, rp.z+Math.cos(hd)*M.sR*4+Math.sin(hd)*3); D.alt.copy(ziel); }
  else if(me.d<=M.dR-150) ziel.set(x,M.hoehe(x,z)+4+Math.sin(t*1.3)*.3,z); else { D.alt.y+=dt*1.5*Math.max(0,1-(D.alt.y-M.hoehe(D.alt.x,D.alt.z))/30); ziel.copy(D.alt); }
  const vor=g.position.clone(); g.position.lerp(ziel,1-Math.exp(-dt*2.5)); if(dt>0) D.v.copy(g.position).sub(vor).divideScalar(dt);
  const sp=Math.hypot(D.v.x,D.v.z); if(sp>.5) g.rotation.y=-Math.atan2(D.v.z,D.v.x); g.rotation.z=-Math.min(.35,sp*.015); D.rot.forEach(r=>r.rotation.y+=r.userData.s*dt*45);
  M.teufel.forEach(T=>{ const px=T.x+Math.cos(t*T.w+T.ph)*60, pz=T.z+Math.sin(t*T.w*.7+T.ph)*60; T.g.position.set(px,M.hoehe(px,pz),pz); T.sch.forEach((m,k)=>m.rotation.y=t*(1.6-k*.2)); });
}
