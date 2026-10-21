# Kalmit-Duell

Browser-Radrennspiel (Duell zweier Fahrer, online per PeerJS, Smart-Trainer per Bluetooth). Reines HTML/CSS/JS, kein Build, kein npm. Läuft per Doppelklick auf `index.html` (auch über `file://`).

## Aufbau
- `index.html` – nur HTML-Gerüst, bindet CDN-Libs (three.js r128, peerjs 1.5.4), `css/style.css` und die JS-Dateien ein
- `js/strecke.js` – Streckendaten, Kalmit-GPX, `ROUTES`, Space-/Insel-/Stadion-Geometrie (`stadionDef`, `trackPt`)
- `js/welt-stadion.js` – 3D-Stadion: Tribünen, Fußballspiel, Choreo, Anzeigetafel, Flutlicht
- `js/physik.js` – Physik (Watt, Gewicht, CdA, Wind, Aero-Haltung, Windschatten) und Bot-Fahrweise
- `js/zustand.js` – Fahrer-Aussehen (`LOOKS`), Spielzustand (`me`, `opp`, `race`), 3D-Grundgerüst (`scene`, `camera`, `renderer`), `setRoute`, `canvasTex`
- `js/welt-bausteine.js` – Haus-Baukasten: `haus(o)` (Altort, Neubau, Fachwerk), Fassaden mit Leuchtkarte, Ziegeldach, `hoftor`, `hausLicht()` für Abendfenster
- `js/welt-space.js`, `js/welt-insel.js`, `js/welt-kalmit.js` – die übrigen 3D-Welten
- `js/welt-berwartstein.js` – Fantasy-Strecke Burg Berwartstein (Linie und Zonen: `berwartsteinDef` in `strecke.js`): Zehntscheune hinter dem Fest (`SCHEUNE`), Friedhof mit Kapelle links neben dem Vorlauf (`FRIEDHOF`), Bauernfest links am Start (`FEST`: Tanzbaum mit Reigen, Musikanten, Gaukler, Tanzbär, Festtafel; `poseFest`), Spruch auf dem Fachwerkgiebel rechts, Bach mit Mühle und Holzbrücke, Kirche in Erlenbach, Felsen im Wald, Zollstation, Leute am Weg, Wegelagerer (Staubwolke ab 4 W/kg), Bogenschütze, Vorburg (Zugbrücke, Torturm, Ringmauer, Turnierwiese, Tribüne mit Königspaar, Volk), Burg, Burgwald am Hang (Kiefern, Fichten, Unterholz, Felsnasen, Pfad mit Geländer, Mauerrest, Efeu, Reh), Pfälzerwald-Kuppen, Morgennebel; wird aus `build3D` aufgerufen. Holzrad/Mittelalter-Kleidung: `holzRad` und `ma` in `figuren.js`
- `js/welt-dorf.js` – Dorfleben in Erlenbach (Berwartstein): Ortseingang im Vorlauf (`BURG_VOR` = 20 m vor dem Ort, alle Meterangaben der Strecke zählen ab dem neuen Start), Szenen in den Häuserlücken (`DORF_PLATZ`), Obstbäumchen und Büsche in den Wiesenlücken (`dorfGruen` aus prepBurg), Tiere, Kleinkram, Wirtshausschild „Zum Goldenen Kranz“ (`R.wirt`); Häuser mit Inschrift/Giebelspruch: `r.inschrift`/`r.giebel` in prepBurg; `prepDorf`/`buildDorf`/`poseDorf` aus prepBurg/buildBurg/poseBurg. Kamerafahrt am Fest beim Countdown: `startKamera` in `welt-berwartstein.js`
- `js/welt-unterwegs.js` – Unterwegs auf der Berwartstein-Strecke: Pferdekarren mit Mehlsäcken (`KARREN`, fährt los, wenn ein Fahrer naht; Fahrer überholen links über `burgSpur` in rennen.js), Fußgänger am Wegrand (`GEHER`), Betrunkener vor dem Wald (`BETR`, `SPRUECHE`: nur der erste echte Fahrer rempelt ihn um, Kamera-Rückblick `unterwegsKamera`); außerdem Gänseherde mit Verfolger-Gans (`GAENSE`), Wäscherinnen am Bach mit Tropfen auf dem Bild (`WASCH`, `tropfen()`), Badehaus mit zwei Dirnen und Bader (`BAD`), Minnesänger auf einer Holzbühne (`SAENGER`, zwei Lieder `LIEDER`, Notenschlüssel `notenDeko` über `blaseTex(txt,deko)`), Bettler vor der Zugbrücke (`BETTLER`, Kamera-Rückblick über `rueckblick`), warnende Bauern vor den Wegelagerern (`WARN`, ersetzen den alten Warnkasten); `prepUnterwegs`/`buildUnterwegs`/`poseUnterwegs` aus prepBurg/buildBurg/poseBurg. Auf Berwartstein keine Namensschilder über den Fahrern, keine Kehren- und Kilometerschilder (Zielfanfare wie auf allen Strecken)
- `js/figuren.js` – 3D-Fahrer (Becker, Dengel, eigener Fahrer, Teufel-Bot), Haltung (Wiegetritt, Aero, Kurvenlage, Trittfrequenz), Avatar-Vorschau
- `js/effekte.js` – Fahrtwind-Linien, Regen, Partikel (Gischt, Staub, Blätter), Windschatten-Linien, Kamerawackeln, Antritt-Kick
- `js/rennen.js` – Kamera, Zeichnen, Rennlogik, Pause/Menü, Wake Lock
- `js/training.js` – Workouts, FTP-Tests
- `js/welt-trifels.js` – Welt für Kampagnen-Mission 1 (Burg Trifels, Vorburg, Queichtal), noch leer – Plan in `KAMPAGNE.md`
- `js/kampagne.js` – Kampagne „Der Pedalritter im Wasgau“ (Konzept `KAMPAGNE.md`): Missionen `KAMP`, läuft intern als Training (`race.kamp`), Story-Tafeln `kampTick`, Spielstand
- `js/auswertung.js` – Testmodus, Fotofinish, Aufzeichnung, Ergebnis, TCX-Export
- `js/lobby.js` – Lobby, Fahrer-Editor, Lobby-Hintergrund
- `js/online.js` – PeerJS-Raumcode, Sync mit dem Gegner
- `js/fernbedienung.js` – Handy als Fernbedienung: QR-Code (qrcodejs), eigener PeerJS-Peer `kalmit-duell-v3-r-CODE`, Befehle start/pause/resume; Handy-Seite ist `remote.html` (läuft über GitHub Pages, da `file://` vom Handy nicht erreichbar)
- `js/bluetooth.js` – FTMS/FE-C-Trainer, Pulsgurt
- `js/main.js` – Sound (Freilauf-Klicken `freewheel` vorerst stumm, Aufruf in rennen.js mit `if(0)` aus), Tasten, Event-Bindings, Start (`setRoute`, `requestAnimationFrame(loop)`), Test-Helfer `window.__scene`

## Regeln
- Klassische `<script>`-Tags, keine ES-Module: alle Dateien teilen sich globale Variablen. Reihenfolge in `index.html` ist wichtig – Code, der beim Laden läuft, darf nur Funktionen aus derselben oder früheren Dateien aufrufen.
- Code und Kommentare auf Deutsch, kompakter Stil (viele Anweisungen pro Zeile) beibehalten.
- localStorage-Schlüssel: `kd-riders`, `kd-wo`, `kd-ftp`, `kd-shake`, `kd-kampagne`.

## Arbeitsweise
- Sparsam mit Tokens: nur die betroffene Datei/den Abschnitt lesen (Abschnitte sind mit `/* ===== … */`- bzw. `// ---- … ----`-Kommentaren markiert, per grep finden), keine ganzen Dateien ohne Grund.
- Nicht selbst im Browser auf Aussehen oder Spielgefühl testen – das macht der Nutzer. Erlaubt und erwünscht: nach Änderungen an Strecken/Welten der Selbsttest `node werkzeuge/selbsttest.mjs [strecke] [meter,…]` (Chrome headless, baut die Strecke, startet das Rennen, springt an die Meter, meldet nur Fehler aus der Konsole).
- Berwartstein: Zusatz-Szenen laufen über `sicher(name,fn)` (welt-berwartstein.js) – ein Fehler darin lässt nur die Szene ausfallen und steht in der Konsole, die Strecke läuft weiter. Neue Szenen ebenso einbinden.
- Commit-Nachrichten auf Deutsch. Remote: GitHub `philippsbecker96-cmyk/kalmitduell-`, Branch `main`.
- Offene Verschönerungspläne (Landschaft, Gebäude, Licht): `PLAENE.md`.
- Plan für Rennen mit bis zu 4 Fahrern (Bots und online): `MEHRSPIELER.md`.
- Konzept Kampagne (4 Mittelalter-Missionen im Wasgau, Workouts nach FTP): `KAMPAGNE.md`.
- Lücken zwischen Straße und Gelände in steilen Kehren (gelöst mit `STR_UNTER` und Schulter, Messhelfer `__luecken()`, Verlauf): `STRASSENLUECKEN.md`.
