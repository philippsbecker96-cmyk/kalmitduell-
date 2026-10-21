# Übergabe: Rennen mit bis zu 4 Fahrern

Ziel: statt Duell (ich gegen genau einen Gegner) ein Feld aus bis zu 4 Fahrern – echte Spieler online und/oder Bots gemischt. Arbeitsregeln aus `CLAUDE.md` gelten (kein Build, `file://`, deutsch, kompakt, Nutzer testet selbst). Noch nichts davon gebaut (Stand 21.10.2026, Commit `2fce705`).

## Ausgangslage
- Ein Gegner: Objekt `opp` (`js/zustand.js:25`), Fahrer-Schlüssel `oppKey`, eine Verbindung `conn`/`peer` (`js/zustand.js:27`). `opp` wird an rund 95 Stellen benutzt, Schwerpunkt `rennen.js` (≈40), dann `online.js`, `welt-stadion.js`, `auswertung.js`, `training.js`, `physik.js`, `lobby.js`, `main.js`, je 1× `welt-kalmit.js` und `welt-berwartstein.js`.
- **3D-Figuren hängen am Fahrer-Schlüssel**: `riders3d={becker,dengel,custom}` + `devil` (`js/figuren.js:2`). Jeder Schlüssel hat genau eine Figur, zwei Fahrer mit gleichem Schlüssel gehen nicht. Spuren über `ownLane(key)`/`laneKey`, Seitenversatz über `RIDERS[k].side`.
- Netzwerk: Ersteller (`race.role='host'`) und Gast, Nachrichten `hello`, `route`, `cfg`, `start`, `s` (Position/Watt/Haltung), `w` (Wertung), `pause`, `resume`, `quit`. Der Ersteller entscheidet Wertungen und startet.
- Fernbedienung (`fernbedienung.js`) ist pro Rechner und braucht keine Änderung. Kleinigkeit: beim Gast tut „Start“ nichts (`startRace` bricht bei `role==='guest'` ab), Knopf dort ausblenden oder Hinweis „Der Ersteller startet“.

## Stufe 1: Fahrerliste intern (ohne sichtbare Änderung)
- `opp` → Liste `opps=[]`, jeder Eintrag mit eigenem `key`, `name`, `bot`, `plan`, `d`, `v`, `done`, `time`, `wkgSum`, `fig` (3D-Figur). Übergangsweise `opp` als Getter auf `opps[0]` lassen, damit nicht alles auf einmal kaputtgeht, dann Datei für Datei umstellen.
- Hilfsfunktionen: `aktiveOpps()`, `vorMir()` (nächster Fahrer vor einem Fahrer x, für Windschatten), `rangliste()` (alle inkl. `me`, sortiert nach `done/time` bzw. `d`).
- **Figuren pro Fahrer statt pro Schlüssel**: `makeRider(k)` pro Eintrag in `opps` aufrufen, Figur an `o.fig` hängen. `riders3d[k]` nur noch für die eigene Figur/Vorschau. `rebuildRiders`, Sichtbarkeit (`rennen.js:13`), Schatten fürs Stadion (`addFloodShadows`) mitziehen.
- Spuren: `ownLane` auf Startplatz-Index statt Schlüssel umstellen (4 Grundspuren verteilt über die Fahrbahnbreite). Die Nebeneinander-Logik (`rennen.js:24-31`, zwei Fahrer auf 1,2 m) auf Gruppen verallgemeinern: Fahrer innerhalb 2,2 m nach Grundspur sortiert nebeneinander, Windschatten-Spurwechsel hinter den direkten Vordermann.
- Bot-Fahrweise (`physik.js:58-78`, `botWkgNow`) bekommt den Bot als Parameter statt global `opp`; Abstand `gap` zum nächsten Gegner statt zu `me`.
- Danach müssen Duell, Bot-Duell, Training und Teufel-Verfolgung genau wie vorher laufen → Nutzer testet.

## Stufe 2: mehrere Bots im Einzelspiel
- Lobby (`lobby.js`, `botOn`/`botRider`/`botWkg`/`botStyle`/`botAgg`): Anzahl Bots 0–3, je Bot Fahrer/Look, W/kg, Stil. Einfachste Variante: gleiche Einstellungen für alle, Stärke leicht gestreut (±5 %).
- Looks: es gibt nur 3 Fahrer-Looks + Teufel. Für mehr Bots Farbvarianten (Trikotfarbe per Index) oder neue `LOOKS`-Einträge, Namen z. B. „Bot 2“. Punkt-Farben `RIDERS[k].dot` für Karte/Höhenprofil müssen unterscheidbar sein.
- `startRace` (`rennen.js:272-276`): `opps` aus Bots füllen.

## Stufe 3: Anzeige und Auswertung für mehrere Fahrer
- **Abstandsbox** (`rennen.js:166-176`, `gapBox`): kleine Rangliste (Platz, Name, Abstand in s zum Vordermann/zu mir) statt „Abstand zu X“. Teufel-Modus bleibt wie er ist.
- **Karte/Höhenprofil** (`rennen.js:85, 99, 107, 113`): Punkt pro Fahrer.
- **Wertungen** (`rennen.js:186-200`, `wertWin`, `wertStand`, `trikotOf`): `win` speichert Fahrer-ID statt `'me'/'opp'`; Stand als Punkte pro Fahrer; Nachricht `w` mit ID. Wertungsliste in `auswertung.js:61-62` als Tabelle mit allen Fahrern.
- **Ziel/Ergebnis** (`auswertung.js:68-70, 132`, `rennen.js:129`): Platzierungen 1–4, „noch unterwegs“ pro Fahrer, Ergebnis erst wenn alle im Ziel oder nach Wartezeit.
- **Fotofinish** (`auswertung.js:9-18`): nur die zwei knappsten Fahrer am Zielstrich (<1 s) zeigen – reicht.
- **Stadion** (`welt-stadion.js`): Anzeigetafel-Zeilen (`:579`) für alle; Banner (`banTexs`, `:320, 422, 602`) mit Führendem oder allen Namen; Führungswechsel-Jubel (`:555-557`) auf Platz 1; Glocke letzte Runde (`:554`) auf Führenden.
- **Strecken-Ereignisse**: Zollschranke (`welt-berwartstein.js:541`) und Zielszene (`:598`) auf „irgendein Fahrer“ prüfen; Banner Sebbi (`welt-kalmit.js:405`) wenn Dengel irgendwo im Feld.
- **Training** (`training.js:149`): Ergebniszeilen für alle; Verfolgung (`:171-180`) bleibt 1 Teufel.
- Testmodus-Helfer `main.js:26-30` auf `opps` umstellen.

## Stufe 4: 2 echte Fahrer + Bots online
- Bots rechnet nur der Ersteller. Er hängt ihre Daten an seine regelmäßige `s`-Nachricht an (`bots:[{d,v,w,c,st,a,done,ft}]`). Der Gast zeigt sie nur an (gleiche Glättung wie beim echten Gegner, `rennen.js:141`).
- Gast berechnet Windschatten hinter Bots selbst (kennt die Positionen).
- `start`-Nachricht enthält die Bot-Liste (Schlüssel/Look/Name), damit der Gast die Figuren baut.
- Wertungen entscheidet weiter der Ersteller.

## Stufe 5: 3–4 echte Spieler online
- Ersteller wird Zentrale: `conn` → `conns=[]`, `peer.on('connection')` nimmt bis zu 3 Gäste an, danach ablehnen („Raum voll“).
- Jeder Gast bekommt beim `hello` eine Fahrer-ID (Startplatz). Ersteller leitet die `s`-Nachrichten jedes Gastes an die anderen weiter (mit ID); Gäste reden nur mit dem Ersteller.
- `send()` beim Ersteller an alle; `pause`/`resume`/`quit` an alle weiterleiten. `quit` eines Gastes: nur dieser Fahrer fällt raus, Rennen läuft weiter. Ersteller verlässt: Rennen für alle beenden.
- Lobby: Liste der verbundenen Spieler mit gewähltem Fahrer; belegte Fahrer sperren (`.rcard.taken`, `lobby.js`); bei gleichem Fahrer Farbvariante.
- `remoteLooks` für mehrere Gäste.
- Testen braucht 3–4 Geräte/Fenster (auch mehrere Browser-Tabs auf einem Rechner gehen, PeerJS verbindet sie über den Server).

## Aufwand (Schätzung)
- Stufen 1–4 in einer Sitzung machbar, danach 2–3 Testrunden mit dem Nutzer.
- Stufe 5 ist zusätzlich ein überschaubarer Netzwerkteil, das meiste Testen.
- Offen/nach Geschmack: eigene Figuren für weitere Fahrer, aufwendigere Rangliste (Positionswechsel-Animation, Zeitabstände pro Fahrer).
