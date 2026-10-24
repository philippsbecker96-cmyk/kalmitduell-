# Lücken zwischen Straße und Gelände (Kalmit, Berwartstein) – und versunkene Figuren (unten)

## Problem
In steilen Kurven und Kehren schwebt die Straße zum Teil über dem Gelände. Man sieht unter die Fahrbahnkante oder auf die Unterseite eines höheren Kehren-Asts, an manchen Stellen sind Lücken im Bild. Betroffen: Kalmit und Burg Berwartstein (z. B. Berwartstein bei Kehre 7, ca. 4,2 km, 9–10 % Steigung). Im Flachen und auf geraden Stücken tritt es kaum auf.

## Beteiligter Code
Alles in `build3D()` in `js/welt-kalmit.js` (gilt auch für Berwartstein):
- Abschnitt `// ---------- Gelände ----------`: Höhenraster `TER.h`, Abstand zur Straße `dist`, nächster Streckenpunkt `src`, geglättete Straßenhöhe `TER.hr`
- Abschnitt `// ---------- Straße ----------`: `strip(...)` für Bankett (`lift 0.05`) und Fahrbahn (`lift 0.12`)
- Kopf der Datei: Überhöhung `KX` (Vertex-Shader `KX_GLSL`, `kxPatch`, `kxSetup`, `kxFrame`)

## Mögliche Ursachen
1. **Grobes Gelände, feine Straße.** Rasterweite `res` ist mindestens 5 m, auf großen Strecken eher 8–10 m. Die Straße hat alle `STEP` = 2 m einen Punkt und liegt genau auf `roadY(d)`. Zwischen den Rasterpunkten ist das Gelände eine gerade Fläche, die in Kurven schräg unter dem Straßenband durchläuft.
2. **Keine Seitenwand.** Fahrbahn und Bankett sind flache Bänder ohne Dicke. Neben der Straße liegt das Gelände 0,6 m tiefer (`dist<12` → `roadY-0.6`). Wo der Hang abfällt, sieht man von der Seite unter die Kante.
3. **Falscher Kehren-Ast.** `src` (nächster Streckenpunkt) wird über eine Ausbreitung im Raster bestimmt, nicht über den echten Abstand. In Kehren kann ein Geländepunkt deshalb die Höhe des unteren Asts bekommen, obwohl er unter dem oberen liegt.
4. **Überhöhung (wahrscheinlich die Hauptursache).** Bei `R.kalmit` oder `R.def.steil` hebt der Vertex-Shader im Umkreis von `KX.r1`/`KX.r2` (120/450 m) alles 2,5-fach an (`KX.k`). Die Anhebung kommt aus `TER.hr` (14-mal geglättet, mischt in Kehren beide Äste) und wird nur an den Eckpunkten berechnet. Straße (Eckpunkte alle 2 m) und Gelände (alle 5–10 m) werden dazwischen unterschiedlich gerade durchgezogen. Ändert sich die Anhebung schnell wie in einer steilen Kehre, passen beide Flächen nicht mehr aufeinander. Die Lücken wandern mit dem Fahrer mit.

## Bisher versucht (wieder verworfen)
Alles in `welt-kalmit.js`, danach komplett zurückgesetzt:
- Echter nächster Streckenpunkt im Umkreis von 16 m (zu Ursache 3)
- Gelände unter Fahrbahn und Bankett nie höher als 0,6 m bzw. 0,15 m unter der Straße, auch zwischen Kehren-Ästen
- Böschungsband an beiden Rändern bis unter das Gelände: erst überall, dann nur ab 0,8 m Höhenunterschied, in Geländefarbe

Ergebnis: Die Lücken waren teilweise noch da, und die Straße wirkte dick und aufgesetzt, auch im Flachen. Die Ursache für den dicken Eindruck ist nicht geklärt; die abgeschwächte Böschung hätte im Flachen eigentlich nicht entstehen sollen. Vermutlich wirken alle diese Änderungen nur auf die Form ohne Überhöhung und treffen Ursache 4 nicht.

## Messung (Okt. 2026) und Stand
Konsolen-Helfer `__luecken(grenze=0.8)` in `welt-kalmit.js`: prüft alle 2 m quer über Fahrbahn und Bankett das gezeichnete Gelände (`triAt` = Dreiecke wie das Mesh). Meldet „sticht durch“ (Gelände über dem Belag) und „Kante schwebt“ (Gelände an der Bankettkante mehr als `grenze` m tiefer) sowie Punkte, an denen sich die Innenkante faltet.

Ergebnisse:
- **Ursache 4 (Überhöhung) ist es nicht.** Bilineare und Dreiecks-Rechnung der Anhebung unterscheiden sich höchstens um 0,04 m, weil `TER.hr` stark geglättet ist. Eine Umstellung des Shaders auf Dreiecke wurde getestet und wieder entfernt.
- Innenkante faltet sich nirgends.
- **Hauptursache ist Ursache 2:** Das Gelände lag bis 12 m neben der Mitte überall 0,6 m unter der Straße. Die Straße ist ein dünnes Band ohne Seitenwand und schwebte also überall ~0,65 m, an Hängen bis 1,5 m. In Kehren sieht man von der Seite darunter.
- Absenkung jetzt `STR_UNTER` (oben in `welt-kalmit.js`), von 0,6 auf **0,2** m gesenkt. Messung (Kante über 0,8 m, Strecke in m):

| `STR_UNTER` | Kalmit sticht / Kante | Berwartstein sticht / Kante |
|---|---|---|
| 0,6 | 0 / 7626 m, max 1,55 | 0 / 4818 m |
| 0,4 | 0 / 2182 m | 0 / 1014 m |
| 0,2 | 0 / 556 m, max 1,20 | 0 / 312 m |
| 0,1 | 1× (−0,06) / 236 m | 1× (−0,02) / 208 m |

  Die größten Werte auf Berwartstein (bis 9 m) sind die beiden Holzbrücken (992–1010 m, Zugbrücke 5490–5524 m), also gewollt.
- Nicht geprüft: Stichstraßen/Abzweigungen (`stY` mit `TER.hr+.13`, `abY`) – die lagen bisher sicher über dem 0,6 m tieferen Gelände.

## Schulter (eingebaut)
Schräger Streifen an beiden Straßenrändern auf der ganzen Länge (Abschnitt Straße in `build3D`): innen an der Bankettkante (Bankettfarbe), `SCH_B` = 1,5 m weiter außen `SCH_T` = 0,14 m unter dem gezeichneten Gelände (`triAt`, Geländefarbe). An Holzbrücken keine Schulter (`schulterAn`). `__luecken()` meldet jetzt „Schulter offen“, wenn die Außenkante zwischen zwei Punkten über dem Gelände liegt.
Messung mit 0,08 m Tiefe: Kalmit 5×, Berwartstein 6× offen, je höchstens 4 cm, sonst keine offene Kante mehr außer an den Holzbrücken. Deshalb auf 0,14 m vertieft, damit sind auch diese zu.

## Stand
**Gelöst** (Okt. 2026): Mit 0,2 m Absenkung und Schulter sind im Spiel keine Lücken mehr zu sehen. Bei neuen Strecken oder Änderungen am Gelände mit `__luecken()` nachmessen.

# Versunkene Figuren und Gegenstände (Okt. 2026)

## Problem
Truhen, Bauern, Pferde und Wagenräder steckten auf Berwartstein und in Mission 1 sichtbar im Straßenbelag oder im Hang.

## Ursache
Aufgestellt mit `terrainAt` oder `roadY`, beides ist nicht der sichtbare Boden: Die Fahrbahn liegt 0,12 m über `roadY`, unter der Straße ist das Gelände `STR_UNTER` abgesenkt, und `terrainAt` mischt bilinear, während das Gelände-Mesh Dreiecke zeichnet (`triAt`). Am Hang macht das bis 0,3 m aus.

## Lösung (eingebaut)
- `bodenY(x,z)` in `welt-kalmit.js`: Fahrbahn +0,12 · Bankett +0,05 · Gehweg im Ort +0,22 · Schulter schräg vom Bankett bis unter das Gelände · eigene Flächen der Szenen (`BODEN_FL`) · sonst gezeichnetes Gelände. Nächster Straßenpunkt über ein Gitter (`strasseBei`), ≈ 4 µs pro Aufruf.
- Regel (auch in `CLAUDE.md`): alles mit `bodenY` aufstellen, große Gruppen am Hang Teil für Teil, absichtlich Eingegrabenes mit `userData.ohneBoden=true` markieren.
- Prüfer `__versunken(tol=0.06)` (Konsole) bzw. `node werkzeuge/selbsttest.mjs [strecke|trifels] [meter,…] --boden`: kleine Dinge bis ≈ 30 m neben der Straße, die im Boden stecken, bis 0,6 m schweben oder unplatziert am Start (0,0,0) stehen; Gruppen über 2 m Teil für Teil.
- Ergebnis: Mission 1 von 146 auf eine Handvoll Funde; nebenbei gefunden: Gänse-Magd und Gänse standen am Start.

## Offen
- Berwartstein: Reigen-Tänzer am Fest 12–15 cm (drehen sich in der Gruppe `F.reigen` über schrägem Platz → pro Bild einzeln auf den Boden) · Pferd bei den Leuten am Weg (≈ Meter 4571) 18 cm · zwei nicht zugeordnete Figuren bei Meter 111 und 255 · Wäscherin am Bach (−53 cm) und Bader (−56 cm): prüfen, ob Absicht, dann markieren.
- Mission 1, noch nicht geprüft: zwei dünne Teile bei Meter 285 (−6 cm) · vier Teile 1,6 × 1,6 m bei Meter 370/372 (−16 bis −23 cm, vermutlich schräg gemessene Räder) · ein Teil bei Meter 17142 schwebt 34 cm.
- Erledigt (25.10.2026): Der Fund „Schweinekoben am Wirtshaus, 45 cm“ war der Misthaufen; Misthaufen und Strohhaufen stecken absichtlich im Boden und sind jetzt markiert (`ohneBoden`, Strohhaufen im Hof-Baukasten, gilt auch für Berwartstein). Der Koben steht als starrer Kasten auf der höchsten Ecke mit Sockel aus Trockenmauer (`welt-trifels-leben.js`).
- Grenzen des Prüfers: schräg stehende Teile misst er etwas zu tief (Box um gedrehte Teile), Posen mit Gliedern unter dem Boden und große starre Teile am Hang einzeln beurteilen.
