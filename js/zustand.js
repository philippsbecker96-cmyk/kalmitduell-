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
const race={state:'setup',t:0,last:0,role:null,hrMax:0,forms:true,draft:true,mode:'climb',laps:5,tod:'tag',rain:false,frozen:false,resultShown:false};
let peer=null, conn=null, ftmsCtrl=null, fecWr=null, writeQ=Promise.resolve(), lastSlopeSent=null, lastSlopeAt=0, camOverride=null;
const weight=()=>Math.max(35,+$('weight').value||72), botKg=()=>Math.min(130,Math.max(40,+$('botKg').value||75));
const fmtT=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s/60)%60,x=String(s%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${x}`:`${m}:${x}`;};
const de=(x,n=1)=>x.toFixed(n).replace('.',',');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function setRoute(def){
  R=buildRoute(def); camS.init=false; build3D();
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
