# Eine neue Mission bauen (Anleitung für Claude)

Gesammelt aus Mission 1 (Trifels) und 2 (Teufelstisch), damit Mission 3 und 4 nicht alles neu zusammensuchen müssen. Regeln aus `CLAUDE.md` gelten. Zeilenangaben ändern sich – Stellen per grep finden (Suchwort in Klammern).

## Reihenfolge (hat sich bewährt)
1. **Drehbuch vollständig** (`kampagne/missionN.md`, Vorlage `DREHBUCH-VORLAGE.md`): Workout Leicht/Hart mit Labels, je Abschnitt Ort, Szenen, Texte. Offene Punkte vor dem Bauen klären.
2. **Gerüst:** Mission in `KAMP` mit Workout und Platzhalter-Tafeln, Strecke als Platzhalter-Welt, Timing testen.
3. **Strecke und Landschaft**, dann **Hauptfiguren und Hauptablauf** (Verfolger, Kamera-Szenen).
4. **Leben, Deko, Gags** in eigenen Dateien je Thema (`welt-<mission>-<thema>.js`), je mit `prep…`/`build…`/`pose…`.
5. **Texte** (Sprechblasen), **Ton** (nur nach Rückfrage), **Tafeln und Infotafeln** mit Bildern vom Nutzer.
6. Selbsttest einmal am Ende an den neuen Metern, `--boden` nur bei neu aufgestellten Sachen.

## Einhängen – Checkliste (Muster Mission 2, Kürzel `tt`)
| Was | Wo | Suchwort |
|---|---|---|
| Mission, Workout Leicht (`items`) / Hart (`hart`) mit `S_(label,min,%,%bis)`, Wiederholung `{k:'r',n,items}`, Tafeln `start`/`mitte`/`ende` (`at` in s oder `at()` aus `race.woSegs`), `info:true`+`img`, `endeVor`, `tod`, `bild` (Lobby) | `js/kampagne.js` | `const KAMP` |
| Platzhalter `bald:true` der Mission ersetzen | `js/kampagne.js` | `bald:true` |
| Route `{id, mode:'kamp', noTrain:true, def:null}` | `js/strecke.js` | `ROUTES` |
| Streckenberechnung `xyzDef(segs,unit,f,kg)` → `{name,start,finish,gpx,ma,planbar,halte,doppelt,…}`; in die Tabelle von `genEntry` eintragen | `js/strecke.js` | `teufelstischDef`, `genEntry` |
| Weg aus Stücken (`'g'` gerade, `'b'` Bogen) | `js/strecke.js` | `function turtle` |
| Tempo je Abschnitt aus Watt/Gewicht/Steigung | `js/strecke.js` | `vSteady` |
| `prepXyz(r)` (Meter der Szenen in `R.xyz`, Plätze freihalten) | `js/strecke.js` | `prepTeufelstisch(r)` |
| Gelände formen `xyzGelaende(h,src,dist)` | `js/welt-kalmit.js` | `teufelstischGelaende` |
| `buildXyz()` (setzt `anim.xyz={}`) | `js/welt-kalmit.js` | `buildTeufelstisch()` |
| `poseXyz(dt)` und Ton | `js/rennen.js` | `poseTeufelstisch` |
| Kamera-Szenen (Rückblick, Zwischenszene) | `js/rennen.js` | `teufelKamera` |
| Countdown leise bei Kamerafahrt | `js/rennen.js` | `const still=` |
| Haltung des Fahrers (geduckt, aus dem Sattel) | `js/figuren.js` | `ttGeduckt`, `dmStehen` |
| Fotos der Fahrt | `js/auswertung.js` | `fotoStellen` |
| Ort auf der Wasgau-Karte | `js/kampagne.js` | `KARTE_ORT` |
| Script-Tags (Reihenfolge!) | `index.html` | `welt-teufelstisch` |
| Selbsttest kennt die Strecke | `werkzeuge/selbsttest.mjs` | `['trifels','teufelstisch']` |
| Neue Dateien in `CLAUDE.md` (eine Zeile) und Einzelheiten in `kampagne/missionN.md` | | |

**Mission 4 ist anders:** fährt die feste Berwartstein-Strecke (kein `…Def` aus dem Workout), Szenen an festen Metern; Ankunftszeit über Tempo-Faktor (siehe `mission4.md`, „Gelöste Fragen“). Einhängen in `prepBurg`/`buildBurg`/`poseBurg` über `sicher()`.

## Wiederverwendbare Bausteine
| Baustein | Datei | Wofür |
|---|---|---|
| `trMensch(o)` (`lang`/`tuch` für Frauen), `trPferd`, `trReiter`, `wappenMal` | welt-trifels.js | Mittelalter-Leute, Pferde, Reiter, Wappen |
| `friedelModell()` | welt-trifels.js | Friedel mit Holzrad |
| `holzRad`, `ma`, `kampBaeuerin` | figuren.js | Holzrad, Mittelalter-Kleidung, Bäuerin |
| `buildGasthaus(T,A)` | welt-trifels.js | Fachwerk-Gasthaus mit Licht, Wirt |
| `kampWald(r,S,q,kiefer)` | welt-trifels.js | dichter Pfälzerwald neben dem Weg |
| `tischSilhouette` | welt-trifels.js | Fernbild Teufelstisch |
| `triFuhre`, `triWagen` | welt-trifels-leben.js | Bauer mit Fuhrwerk (Running Gag) |
| `triReh(kitz)`, `triTier` | welt-trifels-leben.js | Rehe, einfache Vierbeiner |
| `ttHund(art,q)` | welt-teufelstisch-leben.js | Hunde, auch Wölfe |
| `hofKasten`, `hofKastenPose` | welt-dorf.js | Schwein, Huhn, Gans, Katze, Mist, Karren, Fass … |
| `haus(o)`, `hoftor`, `hausLicht()` | welt-bausteine.js | Häuser, Abendfenster |
| `blaseTex(txt,deko)`, `BLASE_SCHRIFT` | welt-berwartstein.js | Sprechblasen |
| `rueckblick(dt,Z,T,…)` | welt-unterwegs.js | Kamera-Rückblick nach hinten |
| `tropfen()` | welt-unterwegs.js | Tropfen auf dem Bild |
| `sicher(name,fn)` | welt-berwartstein.js | Szene fällt bei Fehler allein aus |
| `regen.extra`/`regen.wind` | effekte.js | Regen/Unwetter |
| `triSag(wer,txt)` | welt-trifels-leben.js | Sprechblase spricht Aufnahme ab (Datei über den Blasentext; Liste je Mission: `triStimmenListe`/`ttStimmenListe`) |
| `triEins`/`triLoop`/`triMusik`, `TRI_TON_VOL`, `TRI_MUSIK` | welt-trifels-leben.js | Geräusche und Musik über `<audio>` |
| `bodenY(x,z)` | welt-kalmit.js | alles aufstellen (nie `terrainAt`/`roadY`) |
| Tafeln `kampTick`, Ende-Tafeln vor einer Schlussszene `endeVor` | kampagne.js | Story-/Infotafeln |
| `woStrampeln` | training.js | Vorwarnung vor harten Abschnitten |
| Halt-Szenen `halte:[[t0,t1,d]]` in der Def | strecke.js | man tritt, steht aber (Gasthaus, Lager, Audienz) |
| Schleife zweimal fahren, einmal bauen: `doppelt`/`imDoppel` | strecke.js | Wiederholte Runde ohne doppelten Weg |

## Lehren (hat Zeit gekostet)
- **Ablauf an Workout-Labels hängen**, nicht an Metern: Strecke und Szenen lesen die Labels (`segs.find(s=>s.label===…)`). Labels erst festlegen, dann nicht mehr umbenennen. Abschnittsnamen werden in der Kampagne nicht angezeigt (verraten sonst die Story).
- **Figuren mit `bodenY`** aufstellen, große Gruppen am Hang Teil für Teil; sonst schweben oder versinken sie.
- **Lichter fest in der Welt** anlegen und den Figuren folgen lassen, nicht ein-/ausschalten: sonst übersetzt three.js alle Shader neu (Ruckler). Bei Dämmerung Sonnenschatten aus (Lambert rechnet sie auch über Punktlichter).
- **Kamera-Szenen:** Bäume an der Kameraposition freihalten; Szenen-Nebel bei Fernsilhouetten aus.
- **Eigene Szenen-Bäume/Felsen nur während eines Auftritts** sichtbar (Leistung, siehe `EFFIZIENZ.md`).
- **Kommentar mitten in einer Zeile** kann den Rest auskommentieren (Mission 1: Blase fehlte).
- **Wiederholte Strecke** nur einmal bauen, sonst flimmert der doppelte Weg.
- **Workouts zuerst bestätigen lassen** (Leicht und Hart, Richtwerte in `KAMPAGNE.md` „Ablauf aller Missionen“), dann bauen.
- Texte des Nutzers auf Pfälzisch wörtlich übernehmen; Platzhalter als solche markieren.
