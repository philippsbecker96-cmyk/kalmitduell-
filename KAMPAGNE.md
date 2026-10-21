# Konzept: Kampagne „Der Pedalritter im Wasgau“

Neuer Spielmodus: Kampagne aus 4 Missionen im Mittelalter. Jede Mission ist ein Anfänger-Workout von 30–45 min, alle Leistungen in % der FTP (`kd-ftp`). Die Welt folgt dem Workout: Ereignisse (Drache, Teufel, Verfolger) starten mit dem jeweiligen Intervall, nicht an einer festen Stelle der Strecke. Arbeitsregeln aus `CLAUDE.md` gelten. Workouts sind Entwürfe und werden noch mit dem Nutzer abgestimmt.

**Stand 21.10.2026:** Schritt 1 (Gerüst) gebaut und vom Nutzer getestet, siehe „Umsetzung“. Datei für die Trifels-Welt angelegt (`js/welt-trifels.js`, noch leer).

## Rahmengeschichte
Auf den Trifels wurden riesige Mengen Gold geschafft, das Lösegeld für Richard Löwenherz, der nun abzieht. Das Gold soll zur Kaiserpfalz nach Speyer, um dort sicher verwahrt zu werden. Du bietest dich dem Burgherrn des Trifels (fiktiv, Name offen) für den Transport an. Er braucht dafür Leute, denen er wirklich vertrauen kann und die fähig sind, und stellt dich auf die Probe: Besiege Hans von Trotha, der auf Burg Berwartstein residiert und durch seinen Drachen vom Drachenfels (bei Busenberg) als übermächtig gilt. Der Weg dorthin ist weit und beschwerlich. Die Reise führt durchs Tal: Annweiler → Hinterweidenthal → Dahn → Erlenbach/Berwartstein. Trothas Handlanger (Teufel, Ritter) stellen sich dir unterwegs in den Weg, im Finale lässt er als letzten Trumpf den Damm der Wieslauter brechen.
- Story-Szenen (Eröffnung, Zwischenszenen, Abschluss) als cartoonhafte Bild-/Texttafeln.
- Zeitlich gemischt (Löwenherz 1193, Trotha um 1500), bewusst Fantasy.
- Mögliche Fortsetzung nach der Kampagne: der eigentliche Lösegeld-Transport nach Speyer.

Geschichtlicher Kern (vor Story-Texten gegenprüfen): Hans von Trotha besaß Berwartstein im 15. Jh., staute im Streit mit Weißenburg die Wieslauter und ließ den Damm brechen, wurde vom Papst gebannt; im Elsass lebt er als Schreckgestalt „Hans Trapp“ weiter.

**Hans von Trotha als Bösewicht (vom Nutzer bestätigt):** echte Person der Region (um 1500, Marschall des Kurfürsten von der Pfalz), Raufbold im jahrelangen Streit mit dem Kloster Weißenburg, staute die Wieslauter und flutete Weißenburg per Dammbruch, ignorierte die Vorladung nach Rom (angeblich mit frechem Brief) und wurde gebannt. Fürs Spiel: größenwahnsinnig, beugt sich niemandem („Wer sich mit dem Papst anlegt, hält sich auch einen Drachen“). Der Drache ist seine Waffe, er selbst der Gegner.

## Ablauf aller Missionen (vom Nutzer bestätigt)
- **Kampagnenstart:** einmal auswählen, ob man Bauer oder Bäuerin ist (Texte in zwei Varianten).
- **ERG-Modus:** der Trainer gibt die Watt vor.
- **Erklärung beim Treten:** die Tafeln zu Beginn laufen schon während des Einfahrens, sehr locker (≈50 %), die Zeit zählt zum Workout.
- **Tafeln mit fester Lesezeit:** pauschal 25 s pro Tafel (später prüfen), laufen von selbst weiter, keine Bedienung nötig, kleiner Fortschrittsbalken am Rand. Einfahren dauert mindestens so lange wie alle Tafeln zusammen; bei sehr wenigen Tafeln eine Minute Einrollen dazu.
- **Keine Bewertung** (keine Sterne).
- **Zwei Stufen Leicht/Hart** (Knöpfe im Kampagnen-Block, gespeichert): gleiche Struktur und Dauer, eigene Werte je Mission. Richtwerte für Hart: kurze Intervalle ×1,35–1,4, lockere Phasen/Grundlage ×1,15–1,2 (gedeckelt bei ≈75–78 %), Ein-/Ausfahren (fast) gleich; bei längeren Intervallen (3–5 min) etwas niedriger. Geschafft zählt für beide Stufen.
- **Menü:** eigener Modus „Kampagne“ neben Anstieg, Rundstrecke usw. Missionen werden nacheinander freigeschaltet. Nur allein, nicht online.
- **Tafel-Stil gemischt:** Szenen mit Ort als Standbild aus der 3D-Welt mit Pergament-Textfeld; Gesprächsszenen (z. B. Burgherr) als gezeichnete Canvas-Tafel: Bild der Figur + Erzähltext / Sprechblase, einfacher flacher Comic-Stil. Später durch eigene Bilder ersetzbar. Tafeln liegen über dem ganzen Bild, darunter fährt die Figur weiter.
- **Tafelbilder:** die Emojis sind nur Platzhalter. Die richtigen Bilder kommen erst in Schritt 5, wenn Welt und Figuren stehen (Standbilder brauchen Burg, Karren, Knappe). Gezeichnete Figuren sollen genauso aussehen wie ihre 3D-Version (Burgherr auf der Tafel = Burgherr im Spiel).
- **Keine Straßen (vom Nutzer gewünscht):** auf allen Kampagnen-Strecken nur Sand-/Erdweg (`belag` 'erde') und Kopfsteinpflaster in Burgen und Orten, schmal wie auf Berwartstein (4,4 m).
- **Vorausberechnung der Strecke:** wie bei Space/Insel (`spaceDef`, `islandDef`, `genEntry` in `strecke.js`): Workout in 2-s-Schritten, aus FTP und Gewicht per `vSteady` die Strecke je Schritt. Anders als dort kommt die Steigung von der Strecke (vorgegeben), nicht aus der Intensität. Orte (Begegnungen, Wirtshaus, Jagdstellen, Ziel) hängen an Zeitpunkten und werden an die berechneten Meter gesetzt; die Welt baut ihre Szenen dort und bei geänderter FTP/Gewicht neu (Schlüssel wie bei Space). Mission endet mit dem Workout, das Ziel liegt dort. Weicht man ab, warten Ereignisse auf den Fahrer. Mehraufwand ≈ 1–2 Tage.

## Der Knappe (fester Baustein aller Missionen)
- **Fährt mit**, auf einem klapprigen Holzrad (`holzRad`, Kleidung `ma` in `figuren.js`; Esel als Alternative offen). Keine eigene Physik: hält festen Abstand hinter/neben dir.
- **In harten Intervallen fällt er zurück** („Wartet auf mich, Herr!“), in den lockeren Phasen holt er wieder auf und fährt neben dir. Running Gag.
- **Vor der Mission:** steht am Start und erklärt die Aufgabe in Sprechblase (wie Zöllner/Wegelagerer), verpackt das Workout in die Story („Drei steile Anstiege, haltet durch!“).
- **Unterwegs als Trainer im Mittelalter-Ton:** Ankündigung vor dem Intervall („Gleich wird's ernst, der Drache naht!“), Countdown („Noch dreißig Herzschläge!“), Lob/Ansporn danach („Wacker gefahren!“ / „Mehr Kraft in die Pedale, Herr!“), Tipps zur Trittfrequenz („Schneller treten, nicht schwerer!“). Sprüche hängen an den Workout-Blöcken der Missions-Definition.
- **Nach der Mission:** keine Ansage der nächsten Mission, sondern eine Verabredung zum nächsten Treffpunkt (nach Mission 1: Gasthaus Richtung Teufelstisch), das verbindet die Kampagne.
- **Ab wann dabei:** in Mission 1 erst ab dem Wirtshaus im Tal (dort lernt man ihn kennen), ab Mission 2 von Anfang an.
- **Charakter:** ein bisschen ängstlich (duckt sich beim Drachen, zittert beim Teufel), Pfälzer Einschlag in der Sprache (dezent). In Mission 3 eifersüchtig, weil die Magd auf deinem Gepäckträger sitzt und nicht bei ihm.
- **Name:** Friedel (vom Nutzer).

## Mission 1: Trifels – Die Elwetritsche-Wette
- **Ort:** Burg Trifels über Annweiler (Nachbarburgen Anebos und Scharfenberg auf ihren Felsen), sanfte Anfahrt hinauf zur Vorburg, Abfahrt hinab ins Queichtal, Wirtshaus im Tal, Weg weiter durchs Tal. Streckenprofil: Berg mit Gipfel in der Vorburg, Anstieg flach halten (man fährt im Einfahren ruhig langsam), danach flaches Tal.
- **Eröffnung:**
  1. Kamerafahrt beim Countdown (≈10–15 s, wie `startKamera` am Fest): Karren mit großem Goldhaufen rollen durchs Burgtor auf den Trifels.
  2. Tafel: Du bist ein einfacher Bauer / eine einfache Bäuerin aus der Gegend, suchst Arbeit und hast gehört, dass der Burgherr Leute sucht, die das Gold nach Speyer bringen. Man tritt dabei schon locker.
  3. Fahrt hinauf zum Trifels: Löwenherz und ein paar Gefolgsleute reiten von der Burg weg und kommen dir entgegen (Begegnung per Vorausberechnung getimt).
  4. Vorburg unterhalb der Mauern (bei den Hütten, der Bergfried ragt mächtig darüber): Karren mit dem Gold steht dort, Wachen laden ab. Die Strecke führt als Schleife um den Goldkarren (oben im echten Burghof wäre dafür kein Platz).
  5. Comic-Tafel Audienz: „Du hattest eine kurze Audienz beim Burgherrn …“: er braucht Leute, denen er vertrauen kann und die fähig sind, deshalb die Prüfung: Trotha auf Berwartstein besiegen, weiter beschwerlicher Weg. Die Figur rollt währenddessen langsam die Schleife um den Karren weiter (Schleifenlänge passend zur Tafelzeit).
  6. Abfahrt aus der Vorburg ins Tal Richtung Wirtshaus.
- **Story:** Unten im Tal am Wirtshaus triffst du den künftigen Knappen im Gespräch mit Dorfleuten: Er hat 10 Gulden gewettet, dass er eine Elwetritsche fängt. Du hilfst ihm dabei, ab hier fährt er mit.
- **Elwetritsche-Jagd:** Abenddämmerung, Laternen am Weg, Glühwürmchen, Nebel im Queichtal (Abendlicht über `hausLicht()`). Die Elwetritsche (kleines rundliches Vogelwesen mit Geweihchen und Stummelflügeln) ist auf dem Weg, kein Abzweig in den Wald: flattert-hüpft über den Weg und rennt vor dir her, du holst auf, kurz vorher schlägt sie einen Haken und verschwindet im Gebüsch am Wegrand; Augen leuchten im Wald. Mit jeder Jagd frecher (schaut zurück, streckt die Zunge raus). Der Knappe trägt Sack und Laterne, glaubt fest daran und hat etwas Angst („Die beißen, Herr, ich schwör's!“). Bei der letzten Jagd landet sie im Sack.
- **Ende:** Der Knappe fährt allein mit der gefangenen Elwetritsche zurück zum Wirtshaus, um seine Wette einzulösen. Ihr verabredet euch im Gasthaus Richtung Teufelstisch (Start Mission 2).
- **Rolle:** Einführung (Steuerung, Ereignisse, Bewertung), sehr locker.
- **Workout Hart (vom Nutzer bestätigt, Beispiel FTP 300 W):** Einfahren 50→65 % (150→195 W) · 5 × (3 min 75 % = 225 W + 30 s 117 % = 350 W) · 5 min 78 % (234 W) · 5 min 50 % (150 W); Ø ≈ 213 W (71 %), ≈ 453 kJ. Leicht zum Vergleich: Ø ≈ 186 W (62 %), ≈ 396 kJ.
- **Workout Leicht (≈35 min, vom Nutzer so bestätigt):** 8 min Einfahren 50→60 % (Tafeln, Anfahrt, Burghof, Abfahrt, Wirtshaus; mindestens so lang wie alle Tafeln zusammen) · 5 × (3 min 65 % + 30 s 85 % Elwetritsche-Jagd) · 5 min Grundlage 65 % · 5 min Ausfahren 50 %.

### Neu zu bauen für Mission 1
- **Burg Trifels (nach Nutzer-Bildern, Vorlage: Rekonstruktion „Reichsburg Trifels um 1280“ von pfälzer-burgen.de, dazu Fotos der heutigen Burg; nur als Vorlage, nichts übernommen):**
  - Lage: langer schmaler Felsrücken aus rotem Sandstein mit steilen Felswänden, am Westende vorspringender Felssporn wie ein Bug; ringsum bewaldete Kuppen, Nebel im Tal, unten Annweiler.
  - Bergfried: hoch, quadratisch, roter Buckelquader-Sandstein, Zinnenkranz, kleine Rundbogenfenster, Erker auf halber Höhe.
  - Palas: direkt an den Bergfried gebaut, fast gleich hoch, Reihen aus Doppel-Rundbogenfenstern, flaches graues Walmdach mit Schornsteinen.
  - Ringmauer den ganzen Felsrücken entlang, darunter am Hang niedrigere Zwingermauer.
  - Torbau im Osten: Türme mit spitzen Zeltdächern, Torturm mit Fachwerk-Obergeschoss, Weg am Hang entlang darauf zu; Brücke mit Rundbogen als Zugang.
  - Westlicher Felssporn: kleine Fachwerkhäuschen ganz vorn.
  - Vorburg unterhalb der Mauern: Holzhütten und Schuppen, hier die Goldkarren-Szene.
  - Farben: rötlicher Sandstein, Moos auf den Mauern, graue Dächer, Herbstwald grün/gelb/orange.
- **Knappe (Aussehen vom Nutzer):** 16 Jahre, schmächtig, lange zottelige **rote** Haare, Kleidung wie die Radfahrer auf Berwartstein (Mittelalter-Wams, `ma` in `figuren.js`).
- **Vorlagen-Bilder (nur lokal, nicht auf GitHub – `vorlagen/` steht in `.gitignore`, Bilder gehören nicht dem Nutzer):** `vorlagen/trifels/` (Fotos der heutigen Burg 1–3, Rekonstruktion um 1280 von pfälzer-burgen.de 4–8: gesamt, Seite, Bergfried, Palas, Torbau) und `vorlagen/elwetritsche/` (7 Bilder: Skulptur, Flaschenetikett, 3D-Figur, Zeichnungen, Badeente, Logo). Vor dem Bau von Burg und Elwetritsche ansehen.
- **Elwetritsche (Entwurf nach Nutzer-Bildern):** dicker runder Körper (Gelb/Orange, Bauch heller), großer gelb-oranger Entenschnabel (etwas zu groß, leicht offen), große Glupschaugen auf kurzen Stielen, struppiger Federschopf, kleine Stummelflügel, buschiger regenbogenbunter Schwanz, dünne rote Hühnerbeine mit großen Krallenfüßen. Wirkung freundlich-albern, nicht gruselig. Bewegung: watschelnd-hüpfendes Rennen mit Flügelflattern, Augen wackeln nach, Schulterblick und Zunge raus.
- **Neu, frei gestaltbar:** Burgherr, Löwenherz mit Gefolge zu Pferd, Goldtransport (Ochsenkarren mit Goldhaufen/Truhen, Wachen), Glühwürmchen.
- **Aus Vorhandenem:** Wirtshaus (`haus()`, Schild wie `R.wirt`), Dorfleute (`welt-dorf.js`), Abfahrt durch den Burgwald (Kiefern, Felsen, Unterholz aus Berwartstein), Queichtal mit Bach, Nebel und Abendlicht.
- **Sprüche und Texte:** schreiben wir gemeinsam.

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
- **Story:** Start am Bauernfest in Erlenbach, alle ahnungslos. Der Drache vom Drachenfels greift an, Trotha lässt den Damm brechen. Du musst vor Drache **und** Flutwelle zur Burg fahren und Trotha besiegen. Trotha steht oben auf der Burgmauer, ruft höhnische Sprüche und hetzt den Drachen auf dich; erreichst du trotz Drache und Flut das Burgtor, ist er besiegt. Abschluss-Tafeln: Rückkehr zum Trifels, der Burgherr vertraut dir das Lösegeld an. Drache mit Überflügen und Feuer gibt es schon.
- **Rolle:** Höhepunkt, härteste Intervalle.
- **Workout-Entwurf (≈41 min):** 10 min Einfahren 50→65 % (Fest, Dorf) · 3 × (3 min 105 % Drachenflucht + 3 min 55 %) · 5 min 65 % · 3 min 105–110 % Flucht vor der Flutwelle ins Ziel · 5 min Ausfahren 50 %.

## Bausteine (grob)
- Kampagnen-Menü in der Lobby, Missionsauswahl, Fortschritt speichern (`kd-kampagne`).
- Missions-Definition: Workout-Blöcke (Dauer, % FTP) + Ereignisse pro Block (Text/Sprechblase, Verfolger starten/stoppen). An bestehende Workouts in `training.js` anlehnen.
- Ablauf: Tafeln vor und nach der Mission, keine Bewertung.
- Neue Welten: Trifels/Annweiler, Teufelstisch, Dahn – je eine Welt ist ungefähr so viel Arbeit wie Berwartstein bisher. Alternative zum Einstieg: erst Gerüst + Mission 4 auf der bestehenden Strecke bauen und testen.
- Neue Effekte: Flutwelle als Verfolger (Finale), Verfolger-Schergen (Mission 3).
- Knappe: Figur + Holzrad, Abstandslogik (zurückfallen/aufholen je nach Workout-Block), Sprüche pro Block. Aufwand klein bis mittel, Esel wäre der größte Einzelposten.

## Umsetzung
1. ✅ **Gerüst** (`js/kampagne.js`): Modus `kamp` im Menü (`MODES` in `strecke.js`, `openMode` in `lobby.js`) läuft intern als Training (`race.mode='train'`, `race.kamp`=Mission) – ERG, Workout-Anzeige, Ergebnis aus `training.js`. Hooks: `curSegs`/`curUnit`/`woKind`, `renderWo` (blendet Workout-Editor aus, FTP bleibt), `trainFinish` → `kampFertig`, `loop` → `kampTick`. Missionen in `KAMP` (Workout-`items`, `start`-/`ende`-Tafeln, `bald` = noch nicht gebaut), Texte mit `[Bauer|Bäuerin]`. Tafeln `#kampTafel` mit Emoji-Platzhalterbild. Spielstand `kd-kampagne` `{stand, done, sel}`. Platzhalter-Strecke: Berwartstein in Dauerschleife (`KAMP_STRECKE`). **Vom Nutzer getestet:** Kacheln, Auswahl Bauer/Bäuerin, Leicht/Hart, Intervalle und Ende funktionieren; Tafelstil und Lesbarkeit (25 s) passen.
2. ✅ **Vorausberechnung und Trifels-Strecke** (`trifelsDef` am Ende von `strecke.js`, Route `trifels` in `ROUTES`, Mission `strecke:'trifels'`, `kampRoute()` in `kampagne.js`): ein Streckenstück je 2 s Workout, Länge per `vSteady` aus Watt, Gewicht und fester Steigung je Abschnitt (`TRIFELS_T`: 0–150 s Anstieg 7 %, die letzten 30 s Schlussrampe 10 % (vom Nutzer gewünscht: steiler, Start näher an der Burg) · 150–175 s Kehre in der Vorburg 1,5 % = Audienz-Tafel · bis 60 s vor Ende Einfahren Serpentinen-Abfahrt −5,5 % · 60 s Auslauf −1,5 % · ab Ende Einfahren Wirtshaus und flaches Tal ±0,6 %), 600 m Reserve dahinter. Linie per `turtle`: Anstieg nach Norden, Rechtskehre (halber Kreis) um den Goldkarren statt Schleife (kreuzt sich nicht), Serpentinen nach Osten, dann ostwärts durchs Tal. Neu berechnet bei Änderung von Stufe, FTP oder Gewicht (`genEntry`). Mit ERG wird die Position wie bei Space ±10 % nachgeführt (`planNudge`, Flag `planbar`). Tafeln können eine feste Zeit haben (`at`, Audienz bei 150 s). Meter für Welt und Ereignisse in `R.def.orte` (`loewenherz`, `hof`, `karren` [x,y], `burg` [x,y], `wirtshaus`, `jagd`, `ziel`). Flag `ma`: Holzrad/Mittelalter-Kleidung, kein Publikum, keine Leitpfosten. Beispiel FTP 250, 72 kg: Leicht 19,0 km (Vorburg 563–718 m, Wirtshaus 5047 m, Ziel 18,4 km), Hart 19,9 km. Gelände vorerst schlicht (Wald, Wiese, ein paar Häuser am Wirtshaus). **Vom Nutzer getestet:** Kehre mit Audienz-Tafel nach 2:30, Häuser am Ende des Einfahrens (8:00) – Timing stimmt. Offen für Schritt 3: km-Schilder kommen aus `welt-kalmit.js` (nur bei `burg` ausgeblendet), Abenddämmerung für die Mission fest einstellen.
3. ✅ **Welt Trifels** (`js/welt-trifels.js`): `prepTrifels` (aus `buildRoute`: Vorburg-Platz und Burgberg frei von Bäumen, Häuser am Wirtshaus mittelalterlich, Wirtshaus = Haus rechts am Wirtshaus-Meter, Meter in `R.tri`), `trifelsGelaende` (aus `build3D`: Vorburg eben – nur absenken, damit nichts durch die Straße sticht –, Burgberg unter dem Felsen), `buildTrifels`: Sandstein-Felsrücken mit Bug im Westen, Ringmauer und Zwinger, Bergfried mit Zinnen und Erker, Palas mit Doppelfenstern und grauem Walmdach, Torbau im Osten (Turm mit Zeltdach, Torturm mit Fachwerk), Fachwerkhäuschen auf dem Westsporn; Vorburg mit Holzhütten außen um die Kehre (Mitte frei für den Goldkarren, Kisten, Fässer, Heu); Wirtshausschild „Wirtshaus“ (Name offen); Laternen am Weg ab dem Wirtshaus (leuchten in der Dämmerung). In `welt-kalmit.js` Flag `MA` (burg oder ma): Pfälzerwald-Umland, weite Sicht, keine km-/Kehren-Schilder, Gitter, Start/Ziel-Bögen. Kampagne immer Abenddämmerung (Tageszeit-Auswahl ausgeblendet). **Noch vom Nutzer anzusehen.** Nicht dabei (später): Bach und Nebel im Queichtal, Glühwürmchen, Burgweg zum Tor, Nachbarburgen Anebos/Scharfenberg.
   - **Nachbesserungen nach Test des Nutzers:** Gras schaute an der Burgweg-Abzweigung durchs Pflaster, Heuballen schwebten am Rand der Vorburg → Vorburg wirklich eben (auch anheben), Vorburg-Kram einzeln auf den Boden, Gelände neben der Straße auf der ganzen Strecke bis 12 m knapp unter der Fahrbahn und bis 30 m nur sanft ansteigend (`trifelsGelaende`, bekommt `src`/`dist`), in Kehren die tiefste Straßenhöhe im Umkreis 14 m. Geländeraster war ≈ 20 m (Tal lief 14 km geradeaus) → Straße lag in den Serpentinen bis 7 m im Hang: Tal jetzt in Schleifen hin und her (≈ 1,8 km, 400 m Abstand), Raster ≈ 7,4 m, Serpentinen-Abstand 60 m (Kehrenradius 30). Messung (Testskript, Gelände über Fahrbahn ±1,8 m): überall ≤ −0,2 m.
   - **Mehr Wald (vom Nutzer gewünscht):** zusätzliche Kiefern, Buchen und Büsche im Wald bis 76 m neben dem Weg (`prepTrifels`, nie auf dem Weg oder benachbarten Kehren); Tal jetzt Pfälzerwald mit Wiese nur am Wirtshaus und Lichtungen alle 2,6 km (`lichtung` in `trifelsDef`).
4. Figuren – **teilweise gebaut** (in `welt-trifels.js`, eigene Bausteine `trMensch`, `trPferd` mit Schabracke, `trReiter`, Wappen `wappenMal`/`leopard`; Vorlagen `vorlagen/loewenherz/`): ✅ **Burgweg** (vom Nutzer gewünscht): Erdweg ≈ 63 m vom Scheitel der Vorburg-Kehre im Bogen nach Nordosten hinauf zum Torbau, Gelände darunter geebnet, Weg und Karren liegen auf `terrainAt` (Geländeraster ≈ 13 m), `T.weg`; ✅ **Goldkarren** (Pferd, Goldhaufen, Münzen, Truhen mit Goldbeschlägen) wartet an der Abzweigung am Straßenrand, zieht ab 2:25 im Schritt (1,2 m/s) den Burgweg hinauf – man fährt in der Kehre direkt an ihm vorbei –, fährt durchs Tor und verschwindet; ✅ **Wachen** (Kettenhaube, rote Tunika, gelbe Ärmel, grüne Beinlinge, Speer) gehen links und rechts neben dem Wagen mit; ✅ **Burgherr** (frei gestaltet: blaues Gewand, roter Mantel mit Pelzkragen, Bart) steht links an der Einfahrt in die Vorburg; **Audienz (vom Nutzer gewünscht):** ab 2:16 hebt er die Hand, Sprechblase „Halt! Ihr seid doch [der Bursche, der|die Magd, die] sich für das Gold meldet?“, Kamera schaut kurz zu ihm (`trifelsKamera`, wie beim Zöllner), ab 2:36 die Audienz-Tafel (`TRI_RUF`, Tafel `at` = rauf+6); zwei abgeladene Truhen an der Abzweigung des Burgwegs (blaues Gewand, roter Mantel mit Pelzkragen, Bart; frei gestaltet), ✅ **Löwenherz mit Gefolge**: Richard (roter Waffenrock mit drei goldenen Löwen, Kettenhemd und -haube, Krone, grauer Bart, Pferd mit roter Löwen-Schabracke und rotem Federbusch), Bannerträger mit Löwenfahne, drei Ritter mit eigenen Wappen (gelb/schwarzes Kreuz, rot-weiße Sparren, blau mit weißem Schrägbalken); warten an der Vorburg, reiten ab ≈ 30 s im Trab (3,2 m/s) bergab, Begegnung bei 1:15 (`T.loewenherz`), `poseTrifels` aus `draw`. **Noch vom Nutzer anzusehen.** Offen: Knappe (Aussehen vom Nutzer nötig), Elwetritsche, Dorfleute am Wirtshaus, zweiter Karren für die Kamerafahrt (mit Schritt 5).
5. Ablauf, Ereignisse und Texte; Tafelbilder als Canvas-Zeichnung (Personen) bzw. 3D-Standbild (Orte) statt der Emoji-Platzhalter.

## Offene Fragen
- **Berwartstein und Vorausberechnung:** Berwartstein ist 5,57 km fest gebaut, bei Anfängertempo ≈ 12–15 min. Für Mission 4 braucht es mehr Strecke (z. B. Anfahrt durchs Tal davor) und Szenen, die sich an die berechneten Meter anpassen.
- Workouts: Mission 1 bestätigt, Vorschläge des Nutzers zu Mission 2–4 folgen.
- Wie wird Trotha genau besiegt? (flieht von der Burg, ergibt sich, oder sein Drache wendet sich gegen ihn)
- Namen: Knappe, Burgherr des Trifels.
- Weitere Ideen: Bonusmission aus Sicht von Weißenburg (Stadt vor der Flut warnen).
