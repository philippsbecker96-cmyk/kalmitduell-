/* ================= Fahrer: Aussehen von Becker, Dengel und eigenem Fahrer – im Lobby-Editor änderbar ================= */
const RKEYS=['becker','dengel','custom'];
const LOOK_DEF={
  becker:{name:'Becker', desc:'pink-schwarz', ui:'#e64980', build:0, helmet:'#f29aa6', jersey:'#1b1b1d', sleeve:'#e6559a', zigzag:true, longSleeve:false, hem:true, pants:'#1b1b1d', socks:'#151517', shoes:'#18181a', frame:'#8e959d', accent:'#d9381e', accentOn:'fork', tape:'#d9381e', glasses:'helm', cap:false, bag:'gross', tanwall:true, bottle:'#ef6c1a'},
  dengel:{name:'Dengel', desc:'schwarz-weiß', ui:'#2b3036', build:1, helmet:'#26282c', jersey:'#1d1e21', sleeve:'#1d1e21', zigzag:false, longSleeve:true, hem:false, pants:'#1b1b1d', socks:'#f4f4ef', shoes:'#f1f1ec', frame:'#2a2b2f', accent:'#b3261e', accentOn:'seat', tape:'#1b1b1d', glasses:'nase', cap:true, bag:'klein', tanwall:false, bottle:'#7d1b1b'},
  custom:{name:'Neuer Fahrer', desc:'eigener Fahrer', ui:'#2f80ed', build:.5, helmet:'#2f80ed', jersey:'#f2c94c', sleeve:'#2f80ed', zigzag:false, longSleeve:false, hem:true, pants:'#1b1b1d', socks:'#f4f4ef', shoes:'#1b1b1d', frame:'#e8e8e8', accent:'#2f80ed', accentOn:'fork', tape:'#1b1b1d', glasses:'nase', cap:false, bag:'klein', tanwall:false, bottle:'#2f80ed'}};
let LOOKS=(()=>{ let sv={}; try{ sv=JSON.parse(localStorage.getItem('kd-riders'))||{}; }catch(e){} const o={}; RKEYS.forEach(k=>o[k]={...LOOK_DEF[k],...(sv[k]||{})}); return o; })();
const remoteLooks={}; // Aussehen des Gegners, online übertragen
const lookOf=k=>remoteLooks[k]||LOOKS[k];
const saveLooks=()=>{ try{ localStorage.setItem('kd-riders',JSON.stringify(LOOKS)); }catch(e){} };
const lum=c=>{ const x=new THREE.Color(c); return .2126*x.r+.7152*x.g+.0722*x.b; };
const lineCol=c=>lum(c)>.7?'#1a1a1a':'#fff';
function specOf(k,L){ const b=Math.min(1,Math.max(0,+L.build||0));
  return {name:String(L.name||LOOK_DEF[k].name).trim().slice(0,16)||LOOK_DEF[k].name, desc:L.desc||LOOK_DEF[k].desc, ui:L.ui, dot:lum(L.ui)<.25?'#f1f3f5':L.ui, scale:.95+.13*b, torsoR:.15-.05*b, torsoZ:1.2-.2*b, legR:.072-.022*b, armR:.05-.014*b, zS:.19-.03*b, side:{becker:1.5,dengel:.1,custom:-1.3}[k]}; }
const RIDERS={devil:{name:'Teufel',desc:'Teufel-Bot',ui:'#c81e1e',dot:'#c81e1e',side:-1.3}};
function refreshRiders(){ RKEYS.forEach(k=>RIDERS[k]=specOf(k,lookOf(k))); }
refreshRiders();
let myKey='becker', oppKey='dengel', botKey='dengel';
const laneKey=k=>k!=='custom'?k:(myKey==='becker'||oppKey==='becker'?'dengel':'becker'); // eigener Fahrer nimmt die Spur des fehlenden Standardfahrers

/* ================= Zustand ================= */
const $=id=>document.getElementById(id);
const live={power:0,cadence:null,hr:null,src:'sim'};
const me={d:0,v:0,crank:0,done:false,time:0,wkgSum:0,maxWkg:0};
const opp={active:false,bot:false,name:RIDERS.dengel.name,d:0,v:0,target:0,crank:0,wkg:0,done:false,time:0,lastAt:0,wkgSum:0};
const race={state:'setup',t:0,last:0,role:null,hrMax:0,draft:true,mode:'climb',laps:5,tod:'tag',season:'sommer',rain:false,wind:0,windDir:0,frozen:false,resultShown:false};
let peer=null, conn=null, ftmsCtrl=null, fecWr=null, writeQ=Promise.resolve(), lastSlopeSent=null, lastSlopeAt=0, camOverride=null;
const weight=()=>Math.max(35,+$('weight').value||72), botKg=()=>Math.min(130,Math.max(40,+$('botKg').value||75));
const fmtT=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s/60)%60,x=String(s%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${x}`:`${m}:${x}`;};
const de=(x,n=1)=>x.toFixed(n).replace('.',',');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function setRoute(def){
  R=buildRoute(def); camS.init=false; build3D(); applyEnv();
  renderRouteList();
}

/* ================= 3D-Grundgerüst ================= */
const cv=$('game'), ov=$('ov'), ctx=ov.getContext('2d'); let W=0,H=0,DPR=1;
const renderer=new THREE.WebGLRenderer({canvas:cv, antialias:true}); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene(), HORIZON=0xe2e4dc;
scene.background=new THREE.Color(HORIZON); scene.fog=new THREE.Fog(HORIZON, 140, 1500);
const camera=new THREE.PerspectiveCamera(60, 1, 0.3, 6000);
const hemi=new THREE.HemisphereLight(0xcfe3f5, 0x5a5a3a, 0.62); scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe2b8, 1.15); sun.position.set(-1,1.35,0.9); scene.add(sun); scene.add(sun.target);
sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:400}); sun.shadow.bias=-0.0006; sun.shadow.normalBias=0.04;
const SUN_DIR=new THREE.Vector3(-1,1.35,0.9).normalize(), SUN_DAY=SUN_DIR.clone();
function resize(){ DPR=Math.min(2,window.devicePixelRatio||1); W=innerWidth; H=innerHeight;
  renderer.setPixelRatio(DPR); renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix();
  ov.width=W*DPR; ov.height=H*DPR; }
addEventListener('resize',resize); resize();

// Himmel: Kuppel mit Verlauf und ein paar Wolken
const sky=(()=>{ const c=document.createElement('canvas'); c.width=4; c.height=256; const g=c.getContext('2d'), gr=g.createLinearGradient(0,0,0,256);
  gr.addColorStop(0,'#3f7dbf'); gr.addColorStop(.3,'#7fb0dc'); gr.addColorStop(.46,'#cfe0ea'); gr.addColorStop(.5,'#e9e6dc'); gr.addColorStop(1,'#e9e6dc'); g.fillStyle=gr; g.fillRect(0,0,4,256);
  const m=new THREE.Mesh(new THREE.SphereGeometry(5000,32,16), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c), side:THREE.BackSide, fog:false, depthWrite:false}));
  m.renderOrder=-10; scene.add(m);
  const cc=document.createElement('canvas'); cc.width=256; cc.height=128; const cg=cc.getContext('2d');
  for(let i=0;i<26;i++){ const x=40+Math.random()*176, y=50+Math.random()*40, r=18+Math.random()*30, gg=cg.createRadialGradient(x,y,0,x,y,r);
    gg.addColorStop(0,'rgba(255,255,255,.9)'); gg.addColorStop(1,'rgba(255,255,255,0)'); cg.fillStyle=gg; cg.beginPath(); cg.arc(x,y,r,0,7); cg.fill(); }
  const ct=new THREE.CanvasTexture(cc), clouds=new THREE.Group(); m.add(clouds);
  for(let i=0;i<14;i++){ const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:ct, fog:false, depthWrite:false, transparent:true, opacity:.85}));
    const a=i/14*Math.PI*2+Math.random()*.3, el=.12+Math.random()*.18; sp.position.set(Math.cos(a)*4200*Math.cos(el), 4200*Math.sin(el), Math.sin(a)*4200*Math.cos(el));
    sp.scale.set(1400+Math.random()*900, 500+Math.random()*250,1); clouds.add(sp); }
  return m; })();

function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.anisotropy=4; return t; }

/* ================= Tageszeit: Licht, Himmel, Dunst und Sonne für alle Welten (außer Space) ================= */
function dayLights(){ hemi.color.set(0xcfe3f5); hemi.groundColor.set(0x5a5a3a); hemi.intensity=0.62; sun.color.set(0xffe2b8); sun.intensity=1.15; SUN_DIR.copy(SUN_DAY); setSky('day'); sunDisc(false); }
let SKYT=null;
function skyTexs(){ if(SKYT) return SKYT; const mk=st=>{ const c=document.createElement('canvas'); c.width=4; c.height=256; const g=c.getContext('2d'), gr=g.createLinearGradient(0,0,0,256); st.forEach(([o,col])=>gr.addColorStop(o,col)); g.fillStyle=gr; g.fillRect(0,0,4,256); return new THREE.CanvasTexture(c); };
  SKYT={day:sky.material.map, dusk:mk([[0,'#22305e'],[.22,'#5b4a7e'],[.36,'#c46a6a'],[.45,'#f0955e'],[.5,'#f6b46e'],[1,'#f6b46e']]),
    grey:mk([[0,'#7d858d'],[.3,'#9aa1a8'],[.5,'#bcc1c4'],[1,'#bcc1c4']]), duskGrey:mk([[0,'#3b3f55'],[.3,'#6f6170'],[.46,'#a87a72'],[.5,'#b48a78'],[1,'#b48a78']])}; return SKYT; }
function setSky(kind){ const T=skyTexs(); if(sky.material.map!==T[kind]){ sky.material.map=T[kind]; sky.material.needsUpdate=true; }
  const cc={day:'#ffffff',dusk:'#ffb48a',grey:'#8d939a',duskGrey:'#9a8a8a'}[kind]; sky.children[0].children.forEach(c=>c.material.color.set(cc)); }
// Sonne am Horizont: großer warmer Schein und helle Scheibe, hängen an der Himmelskuppel (wandern mit der Kamera)
let SUNS=null;
function sunDisc(on){ if(!SUNS){ const rad=(a,b)=>canvasTex(128,128,(g)=>{ const gr=g.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0,a); gr.addColorStop(b,a); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,128,128); });
    const mk=(t,col,op,sz)=>{ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t, color:col, transparent:true, opacity:op, depthWrite:false, fog:false, blending:THREE.AdditiveBlending})); s.scale.set(sz,sz,1); s.renderOrder=-9; sky.add(s); return s; };
    SUNS=[mk(rad('rgba(255,255,255,.55)',.05),'#ff9a52',.75,3200), mk(rad('#ffffff',.55),'#fff0c4',1,230)]; }
  SUNS.forEach(s=>{ s.visible=on; s.position.copy(SUN_DIR).multiplyScalar(4500); }); }
// Land-Welten: Tag = Mittagssonne, Abend = Sonnenuntergang im Westsüdwesten (x = Osten, z = Süden). Nacht gibt es nur im Stadion (Flutlicht) – draußen wird daraus Abend.
const DUSK_BG=0xf0a873;
// Regen (nur Optik): grauer Himmel, kürzere Sicht, wenig Sonne, nasse Straßen glänzen
function applyEnv(){ if(!R||R.space) return; if(R.stadium){ applyStadiumEnv(); return; }
  if(R.fog0==null) R.fog0=[scene.fog.near,scene.fog.far];
  dayLights(); const dusk=race.tod!=='tag', rain=!!race.rain, bg=dusk?(rain?0x9a8478:DUSK_BG):rain?0xb6bbbf:HORIZON; scene.background.set(bg); scene.fog.color.set(bg);
  hausLicht(); if(dusk){ setSky(rain?'duskGrey':'dusk'); hemi.color.set(0x9c9ccc); hemi.groundColor.set(0x40302a); hemi.intensity=rain?.6:.76; sun.color.set(0xff9452); sun.intensity=rain?.4:1.45; SUN_DIR.set(-1,.2,.42).normalize(); sunDisc(!rain); }
  else if(rain){ setSky('grey'); hemi.color.set(0xc4ccd4); hemi.intensity=.7; sun.color.set(0xeef2f6); sun.intensity=.5; }
  const BG=!!(R.def&&R.def.burg); // Burg Berwartstein: früher Morgen, tiefe Sonne im Osten, Dunst im Tal (Nebelschwaden: welt-berwartstein.js)
  if(BG&&!dusk&&!rain){ SUN_DIR.set(1,.4,.3).normalize(); sun.color.set(0xffd6a6); sun.intensity=1.05; hemi.color.set(0xd2dce6); hemi.groundColor.set(0x4f5a3c); hemi.intensity=.7; scene.background.set(0xdfe3e1); scene.fog.color.set(0xdfe3e1); sunDisc(true); }
  const hz=race.season==='herbst'&&!R.island&&!rain&&!BG; // Herbst am Tag: tiefere, wärmere Sonne und leichter Dunst
  if(hz&&!dusk){ SUN_DIR.set(-1,.72,.62).normalize(); sun.color.set(0xffcf96); sun.intensity=1.1; hemi.color.set(0xd8dccc); hemi.groundColor.set(0x6a5a3a); scene.background.set(0xe4dccb); scene.fog.color.set(0xe4dccb); }
  scene.fog.near=rain?60:hz?90:R.fog0[0]; scene.fog.far=rain?Math.min(R.fog0[1],900):hz?R.fog0[1]*.75:R.fog0[1]; wetRoads(rain); }
// Nasse Straße: Phong statt Lambert, dunkler, mit kräftigem Glanzlicht und leichter Spiegelung des Himmels (Materialien mit userData.wet)
let WET_ENV=null; const wetEnv=()=>WET_ENV||(WET_ENV=Object.assign(canvasTex(8,128,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#eef1f3'); gr.addColorStop(.5,'#c4c9cd'); gr.addColorStop(1,'#6d7176'); g.fillStyle=gr; g.fillRect(0,0,w,h); }),{mapping:THREE.EquirectangularReflectionMapping}));
function wetRoads(on){ if(!world) return; world.traverse(o=>{ if(!o.isMesh) return; const d=o.userData.dry||o.material; if(!d.userData||!d.userData.wet) return; o.userData.dry=d;
  if(on&&!d.userData.wm){ const w=d.userData.wm=new THREE.MeshPhongMaterial({map:d.map,color:d.color.clone().multiplyScalar(.5),specular:0x9aa0a6,shininess:110,envMap:wetEnv(),combine:THREE.MixOperation,reflectivity:.22,side:d.side,polygonOffset:d.polygonOffset,polygonOffsetFactor:d.polygonOffsetFactor,polygonOffsetUnits:d.polygonOffsetUnits}); if(KX.on) kxPatch(w); }
  o.material=on?d.userData.wm:d; }); }
