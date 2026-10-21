# Lücken zwischen Straße und Gelände (Kalmit, Berwartstein)

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

## Nächster Schritt: Ursache eingrenzen
An einer Stelle mit Lücke in der Browser-Konsole `KX.k=1` eingeben. Das schaltet die Überhöhung aus und wirkt ab dem nächsten Bild, zurück mit `KX.k=2.5`. Von derselben Stelle je einen Screenshot mit und ohne Überhöhung machen.
- **Lücke verschwindet:** Ursache 4. Lösungsideen:
  - in Kehren schwächer überhöhen (z. B. `KX.k` abhängig von der Krümmung)
  - die Anhebung für Straße und Gelände aus derselben ungeglätteten Höhe berechnen
  - das Gelände im Umkreis der Überhöhung feiner unterteilen
- **Lücke bleibt:** Ursachen 1–3. Dann gezielt nur an den betroffenen Stellen ansetzen, nicht entlang der ganzen Strecke.
