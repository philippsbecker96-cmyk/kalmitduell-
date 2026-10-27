# Notizen & TODOs

Schnelle Sammelstelle für Einfälle, Fehler und Aufgaben. Offen: `- [ ]`, erledigt: `- [x]`.
Größere Punkte später in die passende Datei umziehen (`PLAENE.md`, `KAMPAGNE.md`, `MEHRSPIELER.md`, `EFFIZIENZ.md`, `STRASSENLUECKEN.md`).

## Strecken & Welten
- [x] Südpfalz-Klassiker, Betonplattenweg nach Ranschbach (km 9,1–13): Weinbergtraktor (Schmalspur-Fendt, grün oder rot mit weißem Dach) mit Anhänger voller Trauben/grüner Bütten **überholt dich von hinten** wie das Fuhrwerk in Mission 1 (`TRI_FUHR`); Staub hinterm Anhänger, Trauben wackeln über die Fugen; Motorgeräusch ja. Aufwand: mittel (eine Sitzung)
- [ ] Südpfalz-Klassiker, Verkehr zwischen den Dörfern (Godramstein–Arzheim, Arzheim–Ilbesheim–Leinsweiler, Leinsweiler–Ranschbach): ab und zu Autos (Kombi, Kleinwagen, Transporter) entgegen und von hinten überholend, selten Traktor oder Motorrad; nicht in den Orten, Radweg-Stück (km 2,8–3,5) autofrei; nur in der Nähe sichtbar; Motorgeräusche ja. Aufwand: mittel bis etwas mehr (3–4 Fahrzeugmodelle + Verkehrssteuerung, Traktor vom Weinberg wiederverwenden)
- SK: vielleicht Trekker durch die Weinberge (?)
- SK: Fußballplatz Ortsbeginn Leinsweiler rechte Seite...
- [x] Südpfalz-Klassiker, Weinlese (nur Herbst): Leser mit Eimern in den Rebzeilen, Butten-Träger mit Kiepe, Wagen mit Bütten am Zeilenende; Weinlaub im Herbst gelb/rot. Aufwand: mittel
- [x] Südpfalz-Klassiker, andere Radfahrer: Rennradgruppe kommt entgegen, Rentnerpaar auf E-Bikes zum Überholen, einer schnappt dich am Berg. Aufwand: klein bis mittel
- [ ] Südpfalz-Klassiker, Töne: Motorgeräusch für den Weinbergtraktor (überholend und an der Weinlese), Stimmengewirr und Gläserklirren am Weinstand (vorher Dateien klären)
- [x] Südpfalz-Klassiker, Silhouetten am Haardtrand: Madenburg (über Eschbach), Trifels mit Nachbarburgen, Kleine Kalmit mit Kapelle bei Ilbesheim. Aufwand: klein
- [x] Südpfalz-Klassiker, Typisches am Weg: Wingertshäuschen, Bildstöcke/Wegkreuze, Bänke mit Blick, braune Schilder „Deutsche Weinstraße“ mit Traube, im Ort „Weinverkauf“/„Straußwirtschaft geöffnet“ an Hoftoren. Aufwand: klein
- [x] Südpfalz-Klassiker, Esskastanien und Laubwald am Haardtrand statt nur Gehölz. Aufwand: klein
- [x] (später) Südpfalz-Klassiker, Leinsweiler Ortsmitte: Renaissance-Rathaus mit offener Halle, Brunnen davor, Slevogthof oben am Hang. Aufwand: mittel – Rathaus und Brunnen gebaut, Slevogthof weggelassen
- [x] (später) Südpfalz-Klassiker, Weinstand/Straußwirtschaft am Ortsrand: Leute an Bierzeltgarnituren, stoßen an, prosten dir zu. Aufwand: klein bis mittel

## Kampagne
- [ ] Mission 1, Ziel: Teufelstisch (und die Kuppe darunter) spiegelt/blendet komisch am Ende – nach dem Aufreißen des Nebels (700 m vor dem Gasthaus) im Spiel prüfen; Teufelstisch in `buildGasthaus` (welt-trifels.js), Nebel `TRI_NEBEL`
- [ ] Mission 2, Musik vor und in der zweiten Teufelsjagd (ab der Abzweigung „sicher rechts“, wenn es wieder zuzieht): unheimlicher, gruseliger – Nutzer sucht einen Titel heraus, dann in `TRI_MUSIK`/`ttTon` (welt-teufelstisch-ton.js) einbauen
- [x] Mission 2, Pause nach Flucht 1 (27.10.): klart auf, zieht wieder zu, nach der Abzweigung Unwetter; fröhliche Musik erst 3 s nachdem der Teufel am Steintor auf dem Boden liegt (`TT_TON.froh`) – vom Nutzer für gut befunden
- [ ] Mission 2 abrunden (Plan in `KAMPAGNE.md`, Mission 2 „Noch offen – zum Abrunden“): Anfangsszene im Gasthaus (Holzraum, Wirt, Friedel mit Kater), Schlussszene am Lagerfeuer (letzte Bratwurst aus der Hosentasche), Friedels Kater als roter Faden, Infotafel zum Teufelstisch – Texte vom Nutzer
- [ ] Mission 2 selbst im Spiel testen (Stand 27.10.): Abzweigung „sicher rechts“ (≈ Meter 8874), Teufel kommt zurück an den Tisch, steigt auf den Stuhl, ext den Schoppen, reißt die Platte heraus (≈ 28:30–28:41), Schlusssprint: Teufel fällt zurück und schnauft (≈ 34:32), Schotter auf der Schleife, Wind auf den Lichtungen, Unwetter nach der Jungfernsprung-Kamera, Fernblick am Jungfernsprung mit Tal, See, Dorf und Regenbogen (≈ Meter 4514)

## Technik & Fehler
- [ ] Testen: Wiederverbinden von Trainer und Pulsgurt (während der Fahrt kurz aus- und wieder einschalten: Meldung „verbinde neu …“, dazwischen Simulation, danach „wieder verbunden“, Steigung/ERG wieder aktiv) · Steigung auf der Minimap (unten rechts, Farbe nach Steilheit, bergab hellblau; Kampagne weiter mit Schild oben)
- [ ] 

## Ideen
- [ ] Space-Strecke, Mars (`welt-mars.js`): Pfälzer Gag als Gegenstück zur Löwenflagge auf dem Mond, z. B. Gewächshaus-Wingert mit Dubbeglas auf dem Tisch. Aufwand: klein
- [ ] (langfristig, wenn Mission 1–4 fertig sind) **Wasgau-Tour**: Missionen 1–4 als eine feste, zusammenhängende Strecke Trifels → Teufelstisch → Dahn → Berwartstein (≈ 40–60 km) für Rennen/freie Fahrt, ohne Story, Halte und Jagden. Weg: Missionsstrecken einmal mit festem Referenzfahrer vorausberechnen (`kampPlan`, z. B. FTP 250 / 75 kg / Leicht) → feste Meter; Stücke mit kurzen Übergängen (Talweg, Wald) hintereinander, Teufelstisch-Schleife nur einmal, Berwartstein schon fest. Offen: Gelände-Funktionen je Welt nur in ihrem Abschnitt (Übergänge glätten), Welten mit Meter-Versatz bauen (`R.tri`/`R.tt` relativ), nur Szenen in der Nähe sichtbar (EFFIZIENZ.md), eine Tageszeit (oder Sonne läuft über den Tag mit), Figuren nur als Kulisse. Aufwand: groß (mehrere Tage)
- [ ] **Tempo-Gefühl: Dinge nah an der Kamera**, die vorbeiziehen (Tempo nimmt man vor allem im Nahbereich wahr): Leitpfosten und gestrichelte Mittellinie in festen Abständen (stärkster Taktgeber, wo es zur Straße passt) · Fahrbahn mit Struktur (Flicken, Risse, Gullydeckel, Schattenstreifen) und `texture.anisotropy = renderer.capabilities.getMaxAnisotropy()` für den Belag, sonst verschwimmt er nach wenigen Metern · Grasbüschel/Gestrüpp direkt am Fahrbahnrand · Lichtflackern im Wald (Sonnenlicht schwankt mit den gefahrenen Metern, als streichen Baumschatten über dich; fast kostenlos). Aufwand: klein bis mittel

## Sonstiges 
- [ ]

## Anzeigen etc.
- wenn Trainer verbunden ist, soll statt "Trainer verbinden" dann "Trainer" mit einem Haken nebendran stehen
- Windschatten, Wind, Tageszeit, Jahreszeit, Wetter, soll an einer Stelle zusammen sein, nicht verstruet über die Anzeige 
- Menü übersichtlicher gestalten 
- bei Kampagne und Berwartstein Lautstärkeregler hinzufügen (note: hat Berwartstein Sounds?)

## Handy-Anzeige
- bisschen schöner machen
- gleicher/ähnlicher Stil wie anzeigen am Laptop 
- mehr Funktionen (?) 
- bei Training: Einstellen können, dass man plusminus% der vorgesehenen Intervalle fährt

## Trainingsmodus
- Pulsmessen checken 
- Pulsskala testen: rote Pulslinie im Workout-Diagramm (60–210 bpm) im Spiel und auf den Fotos prüfen
- Steigung anzeigen 
- hochladen von fertigen workouts (xy)
