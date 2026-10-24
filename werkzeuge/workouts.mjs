// Sammelt alle .zwo-Dateien aus workouts/ in workouts/workouts.js (WO_DATEIEN), damit das Spiel sie auch über file:// lädt (dort darf der Browser keine Ordner lesen).
// Aufruf (Node 20+): node werkzeuge/workouts.mjs – nach jedem Hinzufügen, Ändern oder Löschen einer .zwo-Datei
import {readdirSync, readFileSync, writeFileSync} from 'node:fs'; import {join, dirname, sep} from 'node:path'; import {fileURLToPath} from 'node:url';
const dir=join(dirname(fileURLToPath(import.meta.url)),'..','workouts');
// Unterordner = Kategorie im Spiel (auch verschachtelt: „Ordner / Unterordner“), Dateien direkt in workouts/ ohne Kategorie
const L=readdirSync(dir,{recursive:true}).map(String).filter(f=>/\.zwo$/i.test(f)).sort((a,b)=>a.localeCompare(b,'de'))
  .map(f=>({datei:f, kat:f.split(sep).slice(0,-1).map(x=>x.trim()).join(' / '), xml:readFileSync(join(dir,f),'utf8')}));
writeFileSync(join(dir,'workouts.js'),'// automatisch erzeugt von werkzeuge/workouts.mjs aus den .zwo-Dateien in diesem Ordner – nicht von Hand ändern\nconst WO_DATEIEN='+JSON.stringify(L,null,1)+';\n');
console.log(L.length+' Workouts: '+(L.map(x=>x.datei).join(', ')||'–'));
