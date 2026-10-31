# Konzept: Kampagne „Der Pedalritter im Wasgau“

Neuer Spielmodus: Kampagne aus 4 Missionen im Mittelalter. Jede Mission ist ein Anfänger-Workout von 30–45 min, alle Leistungen in % der FTP (`kd-ftp`). Die Welt folgt dem Workout: Ereignisse (Drache, Teufel, Verfolger) starten mit dem jeweiligen Intervall, nicht an einer festen Stelle der Strecke. Arbeitsregeln aus `CLAUDE.md` gelten. Workouts sind Entwürfe und werden noch mit dem Nutzer abgestimmt.

**Stand 31.10.2026:** Mission 1 (Trifels) und 2 (Teufelstisch) gebaut, Mission 3 wartet auf Workout und Drehbuch, Mission 4 ist ausgearbeitet und bestätigt (kann gebaut werden).

## Wo steht was
| Datei | Inhalt |
|---|---|
| `KAMPAGNE.md` (diese Datei) | Übersicht, Rahmengeschichte, Ablauf aller Missionen, Knappe, Bausteine, offene Fragen |
| `kampagne/mission1.md` | Mission 1 Trifels: Plan, Texte, Bau-Verlauf, Dateien |
| `kampagne/mission2.md` | Mission 2 Teufelstisch: Plan, Workout, Ideen, Stand, Dateien |
| `kampagne/mission3.md` | Mission 3 Dahn/Jungfernsprung: Plan, Drehbuch zum Ausfüllen |
| `kampagne/mission4.md` | Mission 4 Berwartstein (Finale): Plan, Workout, Burghof |
| `kampagne/MISSION-BAUEN.md` | Bauanleitung für eine neue Mission und Liste wiederverwendbarer Bausteine (für Claude) |
| `kampagne/DREHBUCH-VORLAGE.md` | Leere Vorlage zum Ausdenken einer Mission (für den Nutzer, auch zum Einsprechen) |
| `kampagne/sounds/…/DIALOGE.md`, `EFFEKTE.md` | Aufnahmelisten (Vorlage für neue Missionen in `DREHBUCH-VORLAGE.md`) |

## So trägst du Ideen ein
1. **Richtige Stelle:** in die Datei der Mission (`kampagne/missionN.md`); gilt die Idee für alle Missionen, hier unter „Bausteine“; bist du noch unsicher, hier unter „Offene Fragen“.
2. **Markieren:** davor „**Idee (Nutzer, neu):**“, damit man sieht, was noch nicht besprochen ist.
3. **Wo und wann:** Mission, Abschnitt des Workouts oder Ort (z. B. „Jagd 3“, „am Wirtshaus“, „nach Friedels Abschied“).
4. **Wer und was:** wer kommt vor, was passiert, was soll der Fahrer sehen oder hören.
5. **Wie wichtig:** „muss“, „wäre schön“ oder „nur mal notiert“.
6. **Texte, Gedichte und Lieder:** ganz reinkopieren und „so übernehmen“ dazuschreiben (dann bleiben Dialekt und Schreibung unverändert); einzelne Strophen oder Zeilen markieren, wenn nur ein Teil rein soll. Nur den Namen hinschreiben, wenn ich selbst etwas im Stil schreiben soll. Bei neueren Liedern oder Gedichten (Urheber seit weniger als 70 Jahren tot) nur ein paar Zeilen, weil das Spiel über GitHub Pages öffentlich ist.
7. **Selbst einsprechen?** Dazuschreiben, dann kommt es in die Aufnahmeliste.
8. **Was es nicht sein soll:** wenn du etwas ausdrücklich nicht willst, auch das kurz notieren (z. B. „kein Sound“, „nicht zu lang“).
9. **Kurz reicht:** Stichworte genügen, offene Punkte kläre ich mit dir vor dem Bauen. Umgesetzt wird erst, wenn du es sagst.

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

## Bausteine (grob)
- Kampagnen-Menü in der Lobby, Missionsauswahl, Fortschritt speichern (`kd-kampagne`).
- Missions-Definition: Workout-Blöcke (Dauer, % FTP) + Ereignisse pro Block (Text/Sprechblase, Verfolger starten/stoppen). An bestehende Workouts in `training.js` anlehnen.
- Ablauf: Tafeln vor und nach der Mission, keine Bewertung.
- Neue Welten: Trifels/Annweiler, Teufelstisch, Dahn – je eine Welt ist ungefähr so viel Arbeit wie Berwartstein bisher. Alternative zum Einstieg: erst Gerüst + Mission 4 auf der bestehenden Strecke bauen und testen.
- Neue Effekte: Verfolger-Schergen (Mission 3).
- **Flutwelle (allgemeine Idee, nicht mehr in Mission 4):** Trotha lässt den Damm der Wieslauter brechen (geschichtlich belegt), eine Welle als Verfolger, vor der man davonfährt. Noch keiner Mission zugeordnet; passt z. B. zur Bonusmission aus Sicht von Weißenburg.
- **Infotafeln – in Mission 1 umgesetzt:** Einträge mit `info:true` in `start`/`mitte` von `KAMP` (`kampagne.js`), Bild über `img` (Dateien in `kampagne/bilder/`, Bilder vom Nutzer im Buchmalerei-Stil, Seitenverhältnis bleibt), eigener Stil (helles Pergament, roter Rand mit Goldlinie, Titel dunkelrot; `#kampTafel.info` in `style.css`), je 25 s wie die Story-Tafeln. Mission 1: Richard Löwenherz und Gefangen auf dem Trifels (Anstieg nach dem Sturz, ab 1:28), Hans von Trotha (Abfahrt, 4:00; ergänzt die Tafel „Der Auftrag des Burgherrn“, ohne sie zu wiederholen), Die Elwetritsche (2 min nach dem Einfahren, vor Jagd 1). Weitere Infotafeln in Mission 1 nicht gewünscht.
- **Ursprüngliche Idee Infokästen (vom Nutzer):** während der Fahrt kurze Infotafeln zu historischen Figuren (Richard Löwenherz, Hans von Trotha …), Burgen (Trifels, Berwartstein, Dahn), Sagen (Elwetritsche, Teufelstisch, Jungfernsprung) und der Region (Wasgau, Pfälzerwald, Queichtal). Klein am Bildrand, nicht bildfüllend wie die Story-Tafeln, ein paar Sätze, ≈ 15–20 s sichtbar; ausgelöst an Meter/Zeit, passend zum Ort oder zur gerade getroffenen Figur, am besten in den lockeren Workout-Phasen. Hochdeutsch, sachlich (Sage klar als Sage kennzeichnen). Optional im Menü abschaltbar.
- Knappe: Figur + Holzrad, Abstandslogik (zurückfallen/aufholen je nach Workout-Block), Sprüche pro Block. Aufwand klein bis mittel, Esel wäre der größte Einzelposten.

## Offene Fragen
- Workouts: Mission 1, 2 und 4 bestätigt, Vorschlag des Nutzers zu Mission 3 folgt.
- Namen: Knappe, Burgherr des Trifels.
- Weitere Ideen: Bonusmission aus Sicht von Weißenburg (Stadt vor der Flut warnen).
- Ideen Mission 1 (vom Nutzer, noch nicht ausgearbeitet): **Elwetritsche-Fallen** und **Neumond**.
