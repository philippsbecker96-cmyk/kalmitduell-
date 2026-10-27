# Notizen & TODOs

Schnelle Sammelstelle für Einfälle, Fehler und Aufgaben. Offen: `- [ ]`, erledigt: `- [x]`.
Größere Punkte später in die passende Datei umziehen (`PLAENE.md`, `KAMPAGNE.md`, `MEHRSPIELER.md`, `EFFIZIENZ.md`, `STRASSENLUECKEN.md`).

## Strecken & Welten
- [x] Südpfalz-Klassiker, Betonplattenweg nach Ranschbach (km 9,1–13): Weinbergtraktor (Schmalspur-Fendt, grün oder rot mit weißem Dach) mit Anhänger voller Trauben/grüner Bütten **überholt dich von hinten** wie das Fuhrwerk in Mission 1 (`TRI_FUHR`); Staub hinterm Anhänger, Trauben wackeln über die Fugen; Motorgeräusch ja. Aufwand: mittel (eine Sitzung)
- [ ] Südpfalz-Klassiker, Verkehr zwischen den Dörfern (Godramstein–Arzheim, Arzheim–Ilbesheim–Leinsweiler, Leinsweiler–Ranschbach): ab und zu Autos (Kombi, Kleinwagen, Transporter) entgegen und von hinten überholend, selten Traktor oder Motorrad; nicht in den Orten, Radweg-Stück (km 2,8–3,5) autofrei; nur in der Nähe sichtbar; Motorgeräusche ja. Aufwand: mittel bis etwas mehr (3–4 Fahrzeugmodelle + Verkehrssteuerung, Traktor vom Weinberg wiederverwenden)
- [x] Südpfalz-Klassiker, Weinlese (nur Herbst): Leser mit Eimern in den Rebzeilen, Butten-Träger mit Kiepe, Wagen mit Bütten am Zeilenende; Weinlaub im Herbst gelb/rot. Aufwand: mittel
- [x] Südpfalz-Klassiker, andere Radfahrer: Rennradgruppe kommt entgegen, Rentnerpaar auf E-Bikes zum Überholen, einer schnappt dich am Berg. Aufwand: klein bis mittel
- [ ] Südpfalz-Klassiker, Töne: Motorgeräusch für den Weinbergtraktor (überholend und an der Weinlese), Stimmengewirr und Gläserklirren am Weinstand (vorher Dateien klären)
- [x] Südpfalz-Klassiker, Silhouetten am Haardtrand: Madenburg (über Eschbach), Trifels mit Nachbarburgen, Kleine Kalmit mit Kapelle bei Ilbesheim. Aufwand: klein
- [x] Südpfalz-Klassiker, Typisches am Weg: Wingertshäuschen, Bildstöcke/Wegkreuze, Bänke mit Blick, braune Schilder „Deutsche Weinstraße“ mit Traube, im Ort „Weinverkauf“/„Straußwirtschaft geöffnet“ an Hoftoren. Aufwand: klein
- [x] Südpfalz-Klassiker, Esskastanien und Laubwald am Haardtrand statt nur Gehölz. Aufwand: klein
- [x] (später) Südpfalz-Klassiker, Leinsweiler Ortsmitte: Renaissance-Rathaus mit offener Halle, Brunnen davor, Slevogthof oben am Hang. Aufwand: mittel – Rathaus und Brunnen gebaut, Slevogthof weggelassen
- [x] (später) Südpfalz-Klassiker, Weinstand/Straußwirtschaft am Ortsrand: Leute an Bierzeltgarnituren, stoßen an, prosten dir zu. Aufwand: klein bis mittel

## Kampagne
- [ ] 

## Technik & Fehler
- [ ] Testen: Wiederverbinden von Trainer und Pulsgurt (während der Fahrt kurz aus- und wieder einschalten: Meldung „verbinde neu …“, dazwischen Simulation, danach „wieder verbunden“, Steigung/ERG wieder aktiv) · Steigung auf der Minimap (unten rechts, Farbe nach Steilheit, bergab hellblau; Kampagne weiter mit Schild oben)
- [ ] 

## Ideen
- [ ] Space-Strecke, Mars (`welt-mars.js`): Pfälzer Gag als Gegenstück zur Löwenflagge auf dem Mond, z. B. Gewächshaus-Wingert mit Dubbeglas auf dem Tisch. Aufwand: klein
- [ ] (langfristig, wenn Mission 1–4 fertig sind) **Wasgau-Tour**: Missionen 1–4 als eine feste, zusammenhängende Strecke Trifels → Teufelstisch → Dahn → Berwartstein (≈ 40–60 km) für Rennen/freie Fahrt, ohne Story, Halte und Jagden. Weg: Missionsstrecken einmal mit festem Referenzfahrer vorausberechnen (`kampPlan`, z. B. FTP 250 / 75 kg / Leicht) → feste Meter; Stücke mit kurzen Übergängen (Talweg, Wald) hintereinander, Teufelstisch-Schleife nur einmal, Berwartstein schon fest. Offen: Gelände-Funktionen je Welt nur in ihrem Abschnitt (Übergänge glätten), Welten mit Meter-Versatz bauen (`R.tri`/`R.tt` relativ), nur Szenen in der Nähe sichtbar (EFFIZIENZ.md), eine Tageszeit (oder Sonne läuft über den Tag mit), Figuren nur als Kulisse. Aufwand: groß (mehrere Tage)
- [ ] **Tempo-Gefühl: Dinge nah an der Kamera**, die vorbeiziehen (Tempo nimmt man vor allem im Nahbereich wahr): Leitpfosten und gestrichelte Mittellinie in festen Abständen (stärkster Taktgeber, wo es zur Straße passt) · Fahrbahn mit Struktur (Flicken, Risse, Gullydeckel, Schattenstreifen) und `texture.anisotropy = renderer.capabilities.getMaxAnisotropy()` für den Belag, sonst verschwimmt er nach wenigen Metern · Grasbüschel/Gestrüpp direkt am Fahrbahnrand · Lichtflackern im Wald (Sonnenlicht schwankt mit den gefahrenen Metern, als streichen Baumschatten über dich; fast kostenlos). Aufwand: klein bis mittel

## Trainingsmodus
- Pulsskala testen: rote Pulslinie im Workout-Diagramm (60–210 bpm) im Spiel und auf den Fotos prüfen
