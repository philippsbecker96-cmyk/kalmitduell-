# Konzept: Kampagne „Der Pedalritter im Wasgau“

Neuer Spielmodus: Kampagne aus 4 Missionen im Mittelalter. Jede Mission ist ein Anfänger-Workout von 30–45 min, alle Leistungen in % der FTP (`kd-ftp`). Die Welt folgt dem Workout: Ereignisse (Drache, Teufel, Verfolger) starten mit dem jeweiligen Intervall, nicht an einer festen Stelle der Strecke. Arbeitsregeln aus `CLAUDE.md` gelten. Noch nichts davon gebaut (Stand 21.10.2026), Workouts sind Entwürfe und werden noch mit dem Nutzer abgestimmt.

## Rahmengeschichte
Auf den Trifels wurden riesige Mengen Gold geschafft, das Lösegeld für Richard Löwenherz, der nun abzieht. Das Gold soll zur Kaiserpfalz nach Speyer, um dort sicher verwahrt zu werden. Du bietest dich dem Burgherrn des Trifels (fiktiv, Name offen) für den Transport an. Er braucht dafür Leute, denen er wirklich vertrauen kann und die fähig sind, und stellt dich auf die Probe: Besiege Hans von Trotha, der auf Burg Berwartstein residiert und durch seinen Drachen vom Drachenfels (bei Busenberg) als übermächtig gilt. Der Weg dorthin ist weit und beschwerlich. Die Reise führt durchs Tal: Annweiler → Hinterweidenthal → Dahn → Erlenbach/Berwartstein. Trothas Handlanger (Teufel, Ritter) stellen sich dir unterwegs in den Weg, im Finale lässt er als letzten Trumpf den Damm der Wieslauter brechen.
- Story-Szenen (Eröffnung, Zwischenszenen, Abschluss) als cartoonhafte Bild-/Texttafeln.
- Zeitlich gemischt (Löwenherz 1193, Trotha um 1500), bewusst Fantasy.
- Mögliche Fortsetzung nach der Kampagne: der eigentliche Lösegeld-Transport nach Speyer.

Geschichtlicher Kern (vor Story-Texten gegenprüfen): Hans von Trotha besaß Berwartstein im 15. Jh., staute im Streit mit Weißenburg die Wieslauter und ließ den Damm brechen, wurde vom Papst gebannt; im Elsass lebt er als Schreckgestalt „Hans Trapp“ weiter.

## Der Knappe (fester Baustein aller Missionen)
- **Fährt mit**, auf einem klapprigen Holzrad (`holzRad`, Kleidung `ma` in `figuren.js`; Esel als Alternative offen). Keine eigene Physik: hält festen Abstand hinter/neben dir.
- **In harten Intervallen fällt er zurück** („Wartet auf mich, Herr!“), in den lockeren Phasen holt er wieder auf und fährt neben dir. Running Gag.
- **Vor der Mission:** steht am Start und erklärt die Aufgabe in Sprechblase (wie Zöllner/Wegelagerer), verpackt das Workout in die Story („Drei steile Anstiege, haltet durch!“).
- **Unterwegs als Trainer im Mittelalter-Ton:** Ankündigung vor dem Intervall („Gleich wird's ernst, der Drache naht!“), Countdown („Noch dreißig Herzschläge!“), Lob/Ansporn danach („Wacker gefahren!“ / „Mehr Kraft in die Pedale, Herr!“), Tipps zur Trittfrequenz („Schneller treten, nicht schwerer!“). Sprüche hängen an den Workout-Blöcken der Missions-Definition.
- **Nach der Mission:** keine Ansage der nächsten Mission, sondern eine Verabredung zum nächsten Treffpunkt (nach Mission 1: Gasthaus Richtung Teufelstisch), das verbindet die Kampagne.
- **Ab wann dabei:** in Mission 1 erst ab dem Wirtshaus im Tal (dort lernt man ihn kennen), ab Mission 2 von Anfang an.
- **Charakter:** ein bisschen ängstlich (duckt sich beim Drachen, zittert beim Teufel), Pfälzer Einschlag in der Sprache (dezent). In Mission 3 eifersüchtig, weil die Magd auf deinem Gepäckträger sitzt und nicht bei ihm.
- **Name:** noch offen.

## Mission 1: Trifels – Die Elwetritsche-Wette
- **Ort:** Burg Trifels über Annweiler, Abfahrt hinab ins Queichtal, Wirtshaus im Tal, Weg weiter durchs Tal.
- **Eröffnung (Tafeln):** Gold wird auf den Trifels geschafft, Löwenherz zieht ab. Du bietest dich beim Burgherrn für den Transport nach Speyer an, er will dich prüfen: Trotha auf Berwartstein besiegen, weiter beschwerlicher Weg. Dann beginnt die Fahrt.
- **Story:** Unten im Tal am Wirtshaus triffst du den künftigen Knappen im Gespräch mit Dorfleuten: Er hat 10 Gulden gewettet, dass er eine Elwetritsche fängt. Du hilfst ihm dabei, ab hier fährt er mit.
- **Elwetritsche-Jagd:** Abenddämmerung, Laternen am Weg, Glühwürmchen, Nebel im Queichtal (Abendlicht über `hausLicht()`). Die Elwetritsche (kleines rundliches Vogelwesen mit Geweihchen und Stummelflügeln) ist auf dem Weg, kein Abzweig in den Wald: flattert-hüpft über den Weg und rennt vor dir her, du holst auf, kurz vorher schlägt sie einen Haken und verschwindet im Gebüsch am Wegrand; Augen leuchten im Wald. Mit jeder Jagd frecher (schaut zurück, streckt die Zunge raus). Der Knappe trägt Sack und Laterne, glaubt fest daran und hat etwas Angst („Die beißen, Herr, ich schwör's!“). Bei der letzten Jagd landet sie im Sack.
- **Ende:** Der Knappe fährt allein mit der gefangenen Elwetritsche zurück zum Wirtshaus, um seine Wette einzulösen. Ihr verabredet euch im Gasthaus Richtung Teufelstisch (Start Mission 2).
- **Rolle:** Einführung (Steuerung, Ereignisse, Bewertung), sehr locker.
- **Workout-Entwurf (≈35 min, vom Nutzer so bestätigt):** 8 min Einfahren 50→60 % (Abfahrt, Wirtshaus) · 5 × (3 min 65 % + 30 s 85 % Elwetritsche-Jagd) · 5 min Grundlage 65 % · 5 min Ausfahren 50 %.

## Mission 2: Teufelstisch – Wette mit dem Teufel
- **Ort:** Teufelstisch bei Hinterweidenthal (Felsen, auf dem laut Sage der Teufel speiste).
- **Story:** Der Teufel, Trothas Handlanger, versperrt den Weg und will dich an seinen Tisch. Er wettet: Gewinnst du seine Duelle, darfst du passieren. Teufel-Bot gibt es schon (`figuren.js`).
- **Rolle:** kurze harte Intervalle, jedes ein Duell.
- **Workout-Entwurf (≈36 min):** 10 min Einfahren 50→65 % · 8 × (30 s 120 % Duell + 1:30 min 55 %) · 4 min locker 55 % · 1 min 115 % Schlussduell · 5 min Ausfahren 50 %.

## Mission 3: Dahn – Der Jungfernsprung
- **Ort:** Dahn, Felsen „Jungfernsprung“, Dahner Felsenland.
- **Story:** Eine Magd hat Trothas Pläne belauscht, seine Schergen jagen sie. Laut Sage sprang sie vom Felsen, ihr Rock bremste den Fall, wo sie aufkam, entsprang eine Quelle. Du hilfst ihr bei der Flucht und hältst die Verfolger auf Abstand; die Quelle unten ist Kontrollpunkt/Belohnung. Sie verrät dir, wann der Damm brechen soll.
- **Rolle:** längere Bergintervalle.
- **Workout-Entwurf (≈40 min):** 10 min Einfahren 50→65 % · 3 × (5 min 88–92 % Flucht bergauf + 3 min 55 %) · 6 min Ausfahren 50 %.
- **Highlight Jungfernsprung (Nutzer-Idee):**
  1. Rettung: Du holst die von Trothas Rittern verfolgte Magd ein, sie springt hinten auf den Gepäckträger (sitzt seitlich).
  2. Flucht: Mit ihr auf dem Rad fährst du die Bergintervalle, die Ritter im Nacken.
  3. Sprung: Ende des letzten Intervalls ist die Klippe, man drückt die letzten Sekunden voll auf die Kante zu. Über der Kante springt sie im Flug ab.
  4. Ihr Rock öffnet sich wie ein Fallschirm, sie schwebt langsam hinab, du fällst schneller.
  5. Landung: Einfedern, Kamerawackeln, weiterfahren. Wo sie aufkommt, entspringt die Quelle, sie winkt dir nach. Die Ritter bleiben oben an der Kante stehen.
  - Flug als kurze Verschnaufpause, danach Ausfahren. Technik: für ein paar Sekunden feste Bewegung statt Physik, Zeitlupe und Kamerafahrt (an `startKamera` und Kamerawackeln in `effekte.js` anlehnen). Neu: Mitfahrerin in Sitzhaltung auf dem Gepäckträger, Rock, der sich aufbläht und gleitet. Die Dahn-Welt braucht dafür eine Geländekante (Felsen oben, tiefere Stufe, Straße unten weiter).

## Mission 4 (Finale): Berwartstein – Drache und Flut
- **Ort:** Erlenbach und Burg Berwartstein, bestehende Strecke (`welt-berwartstein.js`, `welt-dorf.js`, `berwartsteinDef`).
- **Story:** Start am Bauernfest in Erlenbach, alle ahnungslos. Der Drache vom Drachenfels greift an, Trotha lässt den Damm brechen. Du musst vor Drache **und** Flutwelle zur Burg fahren und Trotha besiegen. Abschluss-Tafeln: Rückkehr zum Trifels, der Burgherr vertraut dir das Lösegeld an. Drache mit Überflügen und Feuer gibt es schon.
- **Rolle:** Höhepunkt, härteste Intervalle.
- **Workout-Entwurf (≈41 min):** 10 min Einfahren 50→65 % (Fest, Dorf) · 3 × (3 min 105 % Drachenflucht + 3 min 55 %) · 5 min 65 % · 3 min 105–110 % Flucht vor der Flutwelle ins Ziel · 5 min Ausfahren 50 %.

## Bausteine (grob)
- Kampagnen-Menü in der Lobby, Missionsauswahl, Fortschritt speichern (neuer Schlüssel `kd-kampagne`, in `CLAUDE.md` nachtragen).
- Missions-Definition: Workout-Blöcke (Dauer, % FTP) + Ereignisse pro Block (Text/Sprechblase, Verfolger starten/stoppen). An bestehende Workouts in `training.js` anlehnen.
- Ablauf: Einleitungstext vor der Mission, Bewertung danach (z. B. 1–3 Sterne nach Anteil der Intervalle, in denen ≥90 % der Vorgabe gehalten wurden; gnädig, Neuversuch jederzeit).
- Neue Welten: Trifels/Annweiler, Teufelstisch, Dahn – je eine Welt ist ungefähr so viel Arbeit wie Berwartstein bisher. Alternative zum Einstieg: erst Gerüst + Mission 4 auf der bestehenden Strecke bauen und testen.
- Neue Effekte: Flutwelle als Verfolger (Finale), Verfolger-Schergen (Mission 3).
- Knappe: Figur + Holzrad, Abstandslogik (zurückfallen/aufholen je nach Workout-Block), Sprüche pro Block. Aufwand klein bis mittel, Esel wäre der größte Einzelposten.

## Offene Fragen
- **Streckenlänge vs. Workoutdauer:** Berwartstein ist 5,57 km, bei Anfängertempo ≈ 12–15 min. Für 40 min braucht es mehr Strecke: Strecke verlängern (z. B. Anfahrt durchs Tal davor), Abschnitte mehrfach fahren, oder Mission auf mehrere Streckenteile aufteilen. Gilt genauso für die neuen Welten.
- ERG-Modus (Trainer gibt Watt vor) oder freie Fahrt mit Zielbereich? Evtl. beides wählbar.
- Workouts: Vorschläge des Nutzers folgen.
- Weitere Ideen: Bonusmission aus Sicht von Weißenburg (Stadt vor der Flut warnen); Reichskleinodien vom Trifels als Gegenstand, der die ganze Kampagne mitgetragen wird.
