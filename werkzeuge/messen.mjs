// Messung: baut eine Strecke wie der Selbsttest, springt an die Meter und zählt 3D-Objekte, Geometrien, Texturen, Zeichenaufrufe und Dreiecke (Ergebnisse in EFFIZIENZ.md).
// Bildrate nicht messbar (Chrome ohne Grafikkarte), die Zählungen stimmen. Zeichenaufrufe schwanken etwas.
// Aufruf: node werkzeuge/messen.mjs [strecke=berwartstein] [meter,meter,…]
import {spawn} from 'node:child_process'; import {mkdtempSync, rmSync} from 'node:fs'; import {tmpdir} from 'node:os'; import {join, dirname} from 'node:path'; import {fileURLToPath, pathToFileURL} from 'node:url';
const strecke=process.argv[2]||'berwartstein', meter=(process.argv[3]||'').split(',').filter(Boolean).map(Number), warte=ms=>new Promise(r=>setTimeout(r,ms));
const url=pathToFileURL(join(dirname(fileURLToPath(import.meta.url)),'..','index.html')).href, prof=mkdtempSync(join(tmpdir(),'kd-test-')), port=9300+Math.floor(Math.random()*500);
const ch=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new',`--remote-debugging-port=${port}`,`--user-data-dir=${prof}`,'--use-angle=swiftshader','--enable-unsafe-swiftshader','--window-size=1200,800','about:blank'],{stdio:'ignore'});
let fehler=0; const ende=c=>{ ch.kill(); try{ rmSync(prof,{recursive:true,force:true}); }catch(e){} process.exit(c); };
try{
  let pg=null; for(let i=0;i<40&&!pg;i++){ await warte(250); try{ pg=(await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t=>t.type==='page'); }catch(e){} }
  const ws=new WebSocket(pg.webSocketDebuggerUrl); let id=0; const pend={};
  const send=(method,params={})=>new Promise(r=>{ const i=++id; pend[i]=r; ws.send(JSON.stringify({id:i,method,params})); });
  ws.onmessage=e=>{ const m=JSON.parse(e.data); if(m.id&&pend[m.id]) pend[m.id](m.result);
    if(m.method==='Runtime.exceptionThrown'){ fehler++; console.log('FEHLER', (m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text).slice(0,800)); }
    if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'){ fehler++; console.log('KONSOLE', m.params.args.map(a=>a.value??a.description).join(' ').slice(0,800)); } };
  await new Promise(r=>ws.onopen=r); await send('Runtime.enable'); await send('Page.enable');
  const geladen=new Promise(r=>{ const alt=ws.onmessage; ws.onmessage=e=>{ alt(e); if(JSON.parse(e.data).method==='Page.loadEventFired') r(); }; });
  await send('Page.navigate',{url}); await geladen; await warte(1500);
  const ev=async(ex,txt)=>{ const r=await send('Runtime.evaluate',{expression:`(()=>{ try{ ${ex} }catch(e){ return 'FEHLER '+e.stack; } })()`}); const v=r.result?.value; if(String(v).startsWith('FEHLER')){ fehler++; console.log(txt, v.slice(0,800)); } else if(v!==undefined) console.log(txt, v); };
  if(['space','insel'].includes(strecke)) await ev(`openMode('train'); const e=genEntry('${strecke}'); routeId=e.id; setRoute(e.def); return 'aufgebaut';`,'Strecke:'); else await ev(`const r=ROUTES.find(r=>r.id==='${strecke}'); if(!r) return 'FEHLER Strecke ${strecke} nicht gefunden'; routeId=r.id; setRoute(r.def); return 'aufgebaut';`,'Strecke:');
  await ev(`startRace(); return race.state;`,'Start:');
  for(let i=0;i<40;i++){ const r=await send('Runtime.evaluate',{expression:'race.state'}); if(r.result?.value==='run') break; await warte(500); } await ev(`return race.state;`,'Zustand:'); // Countdown abwarten
  for(const d of meter){ await ev(`me.d=${d}; me.v=6; return;`,''); await warte(1500); await ev(`let m=0,v=0,inst=0,g=new Set(),tx=new Set(),li=0; scene.traverse(o=>{ if(o.isLight)li++; if(o.isMesh||o.isLine||o.isPoints){m++; if(o.visible)v++; if(o.isInstancedMesh)inst++; g.add(o.geometry); [].concat(o.material).forEach(x=>{ for(const k in x) if(x[k]&&x[k].isTexture) tx.add(x[k]); }); } }); const i=renderer.info; return 'm=${d} Objekte='+m+' sichtbar='+v+' Instanced='+inst+' Geometrien='+g.size+' Texturen='+tx.size+' Lichter='+li+' Zeichenaufrufe='+i.render.calls+' Dreiecke='+Math.round(i.render.triangles/1000)+'k';`,'Messung'); }
  console.log(fehler?`${fehler} Fehler gefunden`:'Keine Fehler'); ende(fehler?1:0);
}catch(e){ console.log('Test selbst fehlgeschlagen:', e.message); ende(2); }
