# Übergabe: Strecken verschönern

Ziel: Landschaft, Vegetation und Gebäude realistischer machen – Strecke für Strecke, ohne das Spiel langsamer zu machen. Arbeitsregeln aus `CLAUDE.md` gelten (kein Build, `file://`, deutsch, kompakt, Nutzer testet selbst).

## Erledigt (Stand 20.10.2026, Commit `b9f23da`)
- **Tag/Abend für alle Strecken** außer Space: `applyEnv()` in `js/zustand.js` (Abschnitt „Tageszeit“). Hier liegen jetzt auch `dayLights`, `skyTexs`, `setSky`, die vorher in `welt-stadion.js` waren.
  - Abend draußen: Sonne im Westsüdwesten etwa 10° hoch (`SUN_DIR.set(-1,.2,.42)`), Himmelslicht 0,76, Sonne 1,45, Dunst `DUSK_BG`.
  - Sonnenscheibe und Schein: `sunDisc(on)`, Sprites an der Himmelskuppel. Der Nutzer findet die Stimmung gut, die Sonne verdeckt die Berge richtig.
  - „Nacht“ und „Regen“ gibt es nur im Stadion. Das Stadion nutzt weiter `applyStadiumEnv()`, das über `applyEnv()` aufgerufen wird.
- **Einmündungen**: `scharfeEcke` liefert ein Array `kreuz`, `r.stich` ist ein Array. In Arzheim gibt es an der Ecke bei 1,2 km eine Straße geradeaus und eine Stichstraße.
- **Training**: Südpfalz nur als Runde, Markierung `noTrain` in `ROUTES`.

## Wichtige Grenzen
- **three.js r128**: keine automatische Farbumrechnung, `outputEncoding`/`ColorManagement` sind alt.
- **`file://`**: Bilddateien lassen sich nicht als WebGL-Textur laden. Texturen entstehen prozedural über `canvasTex` oder werden als Base64-Data-URI eingebettet. Externe Daten (Höhen, OSM) einmal vorab holen und als JS-Daten in `strecke.js` ablegen, nie zur Laufzeit laden.
- **Koordinaten**: x = Osten, z (bzw. `y` in den GPX-Arrays) = Süden, in Metern ab Start.
- Materialien sind fast überall `MeshLambertMaterial`. Bäume, Reben und Gras sind schon `InstancedMesh` (`inst(...)` in `welt-kalmit.js`).

## Offene Schritte (Vorschlag zur Reihenfolge)

### 1. Licht, Variante B (optional, größer)
Tonemapping (ACES) wurde bewusst weggelassen. Ohne sRGB-Ausgabe wird das Bild flacher. Variante B heißt: `renderer.outputEncoding=sRGBEncoding`, `toneMapping=ACESFilmic`, `texture.encoding=sRGBEncoding` in `canvasTex` und bei der Himmelstextur, Himmel und Sprites mit `toneMapped:false`. Danach müssen **alle Farben in allen Welten nachjustiert** werden, weil sie sonst heller und blasser wirken. Nur angehen, wenn der Nutzer das will.

### 2. Gelände
- Echte Höhendaten (SRTM/DGM) um die Strecke herum als Array einbauen. Haardtrand, Rheinebene und Kalmit-Silhouette sollen stimmen.
- Vertex-Farben nach Höhe, Steigung und Rauschen: steil = Wald, flach = Wiese oder Weinberg. Das vermeidet Einheitsflächen.
- Detailtextur (Gras, Erde) per `canvasTex` mit Rauschen und hoher Wiederholung.

### 3. Bewuchs
- Mehr Variation pro Instanz: Größe, Drehung, Farbton.
- Weinberge (Südpfalz, Kalmit-Fuß): Rebzeilen quer zum Hang, das ist sehr typisch. Abschnitte `reben` gibt es schon.
- In der Ferne flache Waldflächen oder Billboards statt Einzelbäume, damit es flüssig bleibt.

### 4. Gebäude
- Haus-Baukasten in einer neuen Datei `js/welt-bausteine.js` (in `index.html` vor den Welten laden): `haus({b,t,h,dach,stil})` mit Pfälzer Varianten (Fachwerk, Sandstein, Biberschwanz-Dach, Hoftor). Ausgangspunkt sind `fachTex`, `facadeTex` und der Häuserbau in `welt-kalmit.js` (um Zeile 236).
- Echte Grundrisse und Lage aus OpenStreetMap (Overpass, einmal holen) für die Ortsdurchfahrten.
- Wahrzeichen von Hand nach Fotos: Kirchtürme, Kalmithaus, Ortseingänge.

### 5. Abend-Extras
Beleuchtete Fenster (helle Variante der Fassadentextur, wenn `race.tod!=='tag'`) und Straßenlaternen mit Schein in Orten. Sinnvoll zusammen mit Schritt 4.

## Vorgehen
- Pro Sitzung **ein Thema**. Der Nutzer liefert Fotos oder eine Beschreibung, Claude baut es, der Nutzer testet, dann kommt ein Commit auf Deutsch nach `main`.
- **Hero-Spots zuerst**: Anstiege, Ortsdurchfahrten, Start/Ziel. Dazwischen reicht ein stimmiger Gesamteindruck.
- Auf die Leistung achten: instanzieren, Geometrien zusammenführen, Detail nur in der Nähe. Die Insel senkt die Pixel-Ratio schon auf 1,5.
