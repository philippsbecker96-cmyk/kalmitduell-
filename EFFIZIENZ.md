# Effizienz – wie voll dürfen die Strecken werden?

Erkenntnisse zur Leistung (Stand 22.10.2026). Nachmessen mit `node werkzeuge/messen.mjs [strecke] [meter,…]`.

## Grundsätzliches
- **Anzahl der Dateien ist egal.** Der Browser lädt beim Start alle JS-Dateien aus `index.html` (zusammen ~690 KB, weniger als ein Handyfoto). Über GitHub Pages danach im Cache, lokal sofort da.
- **Nur die gewählte Strecke wird gebaut.** Code anderer Welten ist geladen, erzeugt aber keine Objekte – kostet fast nichts.
- **Gebremst wird pro Bild (60×/s)**, nicht beim Laden:
  - Anzahl der 3D-Objekte → je Objekt ein Zeichenaufruf an die Grafikkarte, kostet vor allem Prozessorzeit. **Das ist der Engpass.**
  - Texturen → Grafikspeicher.
  - Was jedes Bild neu gerechnet wird (`poseFest`, `poseDorf`, `poseUnterwegs`, Partikel, Schatten).
  - Dreiecke sind dagegen unkritisch (Kalmit hat doppelt so viele wie Berwartstein und läuft gut).

## Faustregel Zeichenaufrufe pro Bild
| Zeichenaufrufe | Bedeutung |
|---|---|
| unter ~1.000 | überall entspannt, auch Tablet/Onboard-Grafik |
| 1.000–2.000 | guter Rechner problemlos, schwache Geräte merken es |
| 2.000–3.000 | Grenzbereich für Laptops mit Onboard-Grafik/Tablets |

## Messung 22.10.2026
Chrome ohne Grafikkarte (Bildrate dort nicht aussagekräftig, Zählungen schon; Zeichenaufrufe schwanken etwas).

| | Berwartstein | Kalmit |
|---|---|---|
| 3D-Objekte | **4.326** | 1.159 |
| davon Instanced | 28 | 31 |
| eigene Geometrien | **4.325** | 1.159 |
| Texturen | 111 | 65 |
| Zeichenaufrufe/Bild | **~900–2.900** | ~260–2.000 |
| Dreiecke | ~2,5 Mio. | ~5,7 Mio. |

Berwartstein nach Meter: 0 m ≈ 930 Aufrufe · 500 m (Dorf) ≈ 2.900 · 1.500 m/3.000 m ≈ 2.150 · 4.500 m ≈ 1.670.

Trifels (Kampagne Mission 1, 22.10.2026, mit dem Leben am Wirtshaus und unterwegs): ≈ 2.300 Objekte (+430 durch `welt-trifels-leben.js`), Zeichenaufrufe Start ≈ 390 · Wirtshaus ≈ 740 (ohne die neuen Szenen 590) · Tal ≈ 400. Entspannt.

## Einschätzung Berwartstein
- Gut gefüllt, aber noch nicht zu voll. Auf gutem Rechner Luft, auf schwachen Geräten nahe der Grenze (vor allem im Dorf um 500 m).
- **Auffällig:** fast jedes Objekt hat eine eigene Geometrie (4.325 bei 4.326 Objekten) → gleiche Teile (Zaunlatten, Kiefern, Ziegel, Steine) werden einzeln gebaut statt einmal gebaut und mehrfach verwendet. Hier liegt das größte Einsparpotenzial.
- Vor weiteren großen Szenen erst optimieren.

## Mögliche Optimierungen (noch offen, spielerisch ohne Unterschied)
1. **Gleichartige Teile zusammenfassen** – `InstancedMesh` für Bäume, Zäune, Steine, Büsche oder statische Teile einer Szene per Geometrie-Verschmelzung zu einem Objekt. Kann die Objektzahl etwa halbieren.
2. **Geometrien teilen** – gleiche Box/Zylinder einmal anlegen und mehrfach verwenden statt je Objekt neu (spart Speicher und Aufbauzeit).
3. **Ferne Szenen ausblenden** – z. B. Fest am Start unsichtbar, wenn man an der Burg ist (`visible=false` je Szenengruppe nach Abstand zum Fahrer).
4. **Animationen nur in der Nähe rechnen** – `pose…`-Funktionen für Tanz, Gaukler, Gänse usw. nur, wenn ein Fahrer in Reichweite ist.
5. Zuerst dort ansetzen, wo es ruckelt bzw. die meisten Aufrufe gemessen werden (Dorf ~500 m).
