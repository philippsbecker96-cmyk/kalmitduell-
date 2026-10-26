# Konzept: Kampagne „Der Pedalritter im Wasgau“

Neuer Spielmodus: Kampagne aus 4 Missionen im Mittelalter. Jede Mission ist ein Anfänger-Workout von 30–45 min, alle Leistungen in % der FTP (`kd-ftp`). Die Welt folgt dem Workout: Ereignisse (Drache, Teufel, Verfolger) starten mit dem jeweiligen Intervall, nicht an einer festen Stelle der Strecke. Arbeitsregeln aus `CLAUDE.md` gelten. Workouts sind Entwürfe und werden noch mit dem Nutzer abgestimmt.

**Stand 21.10.2026:** Schritt 1 (Gerüst) gebaut und vom Nutzer getestet, siehe „Umsetzung“. Datei für die Trifels-Welt angelegt (`js/welt-trifels.js`, noch leer).

## So trägst du Ideen ein
1. **Richtige Stelle:** zur Mission, in die die Idee gehört; gilt sie für alle Missionen, unter „Bausteine“; bist du noch unsicher, unter „Offene Fragen“.
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

### Texte Mission 1 (vom Nutzer, Pfälzisch – so übernehmen)
`[Bauer|Bäuerin]` usw. je nach Auswahl am Kampagnenstart, `[name]` = Name des eigenen Fahrers (Friedel spricht dich so an, statt Herr/Herrin – vom Nutzer gewünscht).
- **Burgherr (Sprechblase vor der Audienz):** „Halt! Ihr seid doch [der Bursche, der|die Magd, die] sich für das Gold meldet?“
- **Bannerträger von Löwenherz (drängt dich beiseite, hochdeutsch):** „Beiseite mit Euch, [Bauer|Bäuerin]! Platz für den König von England!“
- **Wirtshaus, Wette:**
  - Dorfmann: „Zeh Gulde, dass du heit owend kä Elwetritsch fangsch!“ (vom Nutzer: „Gulde“)
  - Friedel: „Des wer ma mo sehe!“
  - Dorfweib: „Dem Bu henn se ah ä mo zu oft hochgeworfe un ä mo zu wenich uffgfange.“
  - Friedel zu dir: „Du fahrschd doch a noch Siede, gell? Kinnsch ma do vielleicht helfe? Allä trau ich mich ned in de Wald…“
- **Ankündigung vor Jagd 1–5:**
  1. „Psst. Do vorne raschelts, [name]!“
  2. „Do is se widder!“
  3. „Wie frech se uns aguckt, die mänt a, sie is de Kees!“
  4. „Uffbasse, [name], die is gscheit wie sunscht was.“
  5. „Des is die letzscht Chance! Ich halt schummo de Sack uff, [name]!“
- **Während der Jagd:** „Hopp, hopp, alleweil hemmer se!“ (nur Jagd 1 und 5, vom Nutzer gewünscht) · Countdown: „Noch zeh Herzschläch…“, „Noch finf!“
- **Friedel fällt zurück:** „Jetz wart doch bitte uff mich!“ · „Mein Bock is oich longsam…“ · „Mei Wade krampfen, [name]!“
- **Elwetritsche entwischt (nach Jagd 1–4):**
  1. „Weg isse – ins Gebisch!“
  2. „Die hot uns d' Zung rausgstreckt, hosch des gsähne?“
  3. „Jetzt lacht se uns a noch aus!“
  4. „Des gibts doch ned – schun widder!“
- **Angst (lockere Phasen):** „Die beißen, die Sauviecher, ich schwörs!“ · „Hosch du des Geheul ghört? Des war bestimmt bloß de Wind…“ · „Im Dunkle seht ma do hinnen Ache leichte, do werd ma ganz onnerschd.“
- **Lob** (nach Jagd 2 und 3; nach Jagd 1 gestrichen, dort kommen die Schafe): „So schnell bin ich noch nie gewesst!“ · „Mit dir zsamme kriech ich noch so eh Vieh, ich spürs!“
- **Fang bei Jagd 5:** „Ich hab se!!! Ich hab des Scheißding! Zeh Gulde, aller!!!“
- **Ende (vor den Ende-Tafeln):** „Ich muss glei zurick ind Wertschaft, die werren gucken… Mer treffen uns dann moie do im Gaschthaus in de Näh vum Deifelsdisch, gell? Hosch enner gud bei mer, [name]!“
- **Audienz-Szene** (`poseAudienz` in `welt-trifels.js`, Halt `TRIFELS_T.audienz` = 36 s mitten in der Kehre, `halte` in `trifelsDef`): Burgherr ruft „Halt!“, du steigst ab und verbeugst dich (auch beim Abschied), er spricht Hochdeutsch in fünf Blasen (`TRI_AUD_TXT`) mit Gesten; Kamera: Totale von der Innenseite der Kehre, ab dem Auftrag über deine Schulter auf ihn. Danach Tafel „Der Auftrag des Burgherrn“ (Hans von Trotha, ohne die Flut – die kommt in Mission 4).
- **Löwenherz' Gefolge:** Vorreiter, dann Bannerträger und Ritter, Richard in der Mitte zwischen zwei Rittern, zwei Ritter am Schluss; du wirst ganz an den Rand gedrängt, dein Rad wankt bis ±18°, wenn sie dicht vorbeireiten (`triWanken`, `r.wank`/`r.lenk` in `putRider`). Als Richards Reihe neben dir ist (`TRIFELS_T.sturz` = 77 s, 7 s Halt), stürzt du nach rechts aufs Bankett (Staubwolke), der letzte Ritter spottet „Hoho, [Bauer|Bäuerin], das Radeln will gelernt sein!“, du rappelst dich auf, klopfst den Staub ab, hebst das Rad auf (`poseSturz`). Kamera dabei seitlich von rechts (≈ 5 m, `trifelsKamera`), Bäume dort freigehalten. Ton vorerst keiner (Idee: Scheppern, Wiehern).
- **Ziel: Gasthaus „Zum Teufelstisch“** (`buildGasthaus`/`poseGasthaus` in `welt-trifels.js`, Lage `R.tri.gast`): die letzten 350 m der Strecke geradeaus darauf zu (`trifelsDef`), Wiese auf den letzten 450 m. Fachwerkhaus rechts am Ziel, alle Fenster und die offene Tür leuchten, Schild am Ausleger, Laternen am Hof, Licht an der Tür, warmer Lichtschein (von Weitem sichtbar), Rauch aus dem Kamin, Wirt mit Laterne vor der Tür winkt, wenn man naht; Laternen am Weg auf den letzten 400 m dichter. Teufelstisch (Sandsteinsäule mit Felsplatte) auf einer Kuppe 380 m dahinter als Silhouette. Aus 400 m sind beide frei zu sehen.
- **Sprechblasen** in IM Fell English (alter Buchdruck, `BLASE_SCHRIFT` in `welt-berwartstein.js`, gilt auch für Berwartstein), Pergament mit geschwungener Spitze, wachsen mit dem Text (`blaseTex`, `t.hf`) und bleiben unter den Anzeigen oben (`triBlaseUeber`). Friedels Countdown-Sprüche („Noch zeh Herzschläch…“, „Noch finf!“) sind raus.
- **Tafeln** (Start: Gold für den Trifels, Auftrag des Burgherrn; Mitte: „Auf zur Jagd“ nach dem Wirtshausgespräch, „Die erste gute Tat“ nachdem Friedel umgekehrt ist; Ende: Rast am Teufelstisch) stehen in `KAMP` in `kampagne.js` (Mitte-Tafeln mit `at()` aus dem Workout).
- **Sonnenuntergang** (`trifelsLicht` in `welt-trifels.js`): Nachmittag am Burgherrn, goldener Spätnachmittag am Wirtshaus, Dämmerung bei den Jagden, Nacht am Ende des Ausfahrens; die letzten 8 s blendet das Bild ab. Elwetritsche glimmt und wirft Licht, Friedels Laterne glimmt erst schwach. Nach Jagd 4 (≈ 22:12) sagt Friedel „Oich dunkel do im Wald, loss mo di Lambe aschalte!“, ≈ 22:20 flackern seine und deine Öllaterne am Lenker kurz auf und brennen dann hell (`K.lampe` in `triSkript`, `A.meinL`; vom Nutzer gewünscht – vorher wurde Friedels Laterne schleichend heller und deine ging erst nach seinem Abschied an). Ab der Dämmerung (Stufe k > 2,05) sind die Sonnenschatten aus: three.js (Lambert) rechnet den Sonnenschatten auch über Punktlichter, sonst bleiben Fahrer und Weg trotz Laterne dunkel. Lichter hängen fest in der Welt und folgen den Figuren – sonst übersetzt three.js beim Ein-/Ausblenden alle Shader neu (Ruckler).
- **Sperre (vom Nutzer gewünscht):** Kampagne ist noch in Arbeit – Kachel im Menü angegraut mit „🔒 In Arbeit“, spielbar nur mit Code (`kampCode`/`kampSperre` in `kampagne.js`, Freischaltung je Gerät in `kd-kampagne` als `code:true`). Zum Veröffentlichen `kampOffen` auf `true` setzen.
- **Wasgau-Karte oben rechts** (vom Nutzer gewünscht: viel Grün, Burgen- und Felssymbole, Lage nur grob): in Missionen statt der Minimap (`kampKarte`/`karteBg` in `kampagne.js`, Hintergrund einmal gemalt). Pfälzerwald aus Baumkronen, Queich und Wieslauter mit Wiesentälern, Reiseweg gestrichelt (`KARTE_WEG`), Orte in `KARTE_ORT`: Trifels, Teufelstisch, Jungfernsprung, Berwartstein (Missionen: aktuelle leuchtet gelb, geschaffte mit Haken) und Lindelbrunn, Drachenfels (mit Drachenflügel), Weißenburg. Dein Punkt wandert bis zum Ziel-Meter auf dem Weg zur nächsten Station. **Noch vom Nutzer anzusehen.**
- **Wirtshaus:** „Zack Zack“ (vom Nutzer), Schild am Ausleger.

## Mission 2: Teufelstisch – Die Flucht vor dem Teufel (vom Nutzer)
- **Ort:** Teufelstisch bei Hinterweidenthal (Sandsteinsäule mit Felsplatte, auf der laut Sage der Teufel speiste). Start am Gasthaus „Zum Teufelstisch“ (Ziel von Mission 1), Friedel fährt von Anfang an mit.
- **Ablauf:**
  1. **Anstieg** vom Gasthaus hinauf zum Teufelstisch, dabei wird das Gedicht vom Teufelstisch eingeblendet (siehe unten).
  2. **Anschleichen:** Von Weitem sieht man den Teufel am Tisch beim Mittagessen. Friedel flüstert: „Ei, der isst jo aach mittags!“ (Witz: die Sage im Gedicht spielt um Mitternacht). Es gibt keinen anderen Weg, man muss genau am Tisch vorbei. Leise fahren = Szene, keine Watt-Mechanik: Figur geht automatisch in Aero-Haltung, ganz geduckt, und fährt am äußersten Wegrand, halb in den Büschen; Friedel duckt sich ebenso hinterher. Kurz vor dem Tisch macht Friedel etwas Lautes, Dummes (was genau, offen; z. B. niesen, über einen Eimer stolpern) – der Teufel entdeckt euch.
  3. **Flucht 1:** Der Teufel verfolgt euch sichtbar, wirft erst mit Besteck, dann versucht er, mit dem Dreizack zu pieksen. Die Flucht führt durch eine weite Rechtskurve, bis man sich ≈ 180° gedreht hat.
  4. **Weggabelung:** Friedel: „Ich kenn den Weg, mir misse rechts!“ Rechts abbiegen, kurz glaubt man, den Teufel abgeschüttelt zu haben …
  5. **Wieder am Tisch:** … man fährt aber schon wieder auf den Teufelstisch zu, wo der verärgerte Teufel wieder sitzt – im Kreis gefahren.
  6. **Flucht 2:** Die Runde wiederholt sich mehr oder weniger, der Teufel ist jetzt wütender: Er reißt den Tisch heraus und wirft ihn nach dir, dazu wieder Dreizack-Piekser. An der Gabelung diesmal **links** – weg vom Teufel.
- **Gedicht am Anstieg (nur Text, vom Nutzer):** „Der Teufelstisch“ von Johann Martin Jäger alias „Fritz Claus“ (Pfälzer Mundart- und Heimatdichter, 1853–1923), entstanden 1884, gemeinfrei. 11 Strophen à 4 Zeilen über die 10 min Anstieg (5:00–15:00): ≈ 55 s je Strophe, je 2 Zeilen ≈ 25 s stehen, dann die nächsten zwei, kurze Pause zwischen den Strophen. Zu Beginn kurz Titel und Verfasser („Der Teufelstisch – Fritz Claus, 1884“). Darstellung dezent unten mittig, halbdurchsichtige Buchstaben (Pergament-/Frakturschrift), weich ein- und ausblenden, nicht bildfüllend; wörtliche Rede kursiv. Die letzte Strophe läuft aus, wenn oben der Teufel am Tisch auftaucht → Übergang ins Anschleichen (man ist jetzt selbst „der Keckste“).

  > Im Kaltenbacher Tale / Ein Tisch von Felsen steht. / Dort saß der Teufel beim Mahle. / Hört, wie die Sage geht:
  >
  > Einst schritt in jenem Walde / Durch nächt'ges Dunkel schnell / Hinauf die Bergeshalde / Ein finsterer Gesell.
  >
  > Hell lodert in seinen Blicken / Unheimlich wilde Hast. / Nun will er sich erquicken, / Er schaut nach guter Rast.
  >
  > Umsonst! Kein Stein zum Sitzen, / Kein Tisch zum nächt'gen Mahl. / Vor Zorn seine Augen blitzen / Hin über Berg und Tal.
  >
  > Da – wie mit Blitzesschnelle / Packt jetzt zwei Felsen frisch / Der grimmige Geselle / Und stellt sie auf als Tisch.
  >
  > Nachdem er dran gegessen, / Ging durch die Nacht er fort. / Den Tisch, wo er gesessen, / Den ließ er einfach dort.
  >
  > Das war ein ängstlich Schauen / Des Morgens drunten im Tal! / Ein jeder sprach mit Grauen: / „Dort hielt der Teufel Mahl!“
  >
  > Nur einer voller Zweifel / Die andern hell verlacht: / „Ich geh“, spricht er, „zum Teufel / Zum Mahle dort heut Nacht!“
  >
  > Man warnt ihn in der Runde, / Er lacht und geht. Vom Turm / Tönt laut die zwölfte Stunde – / Da! – Welch ein Wind! Ein Sturm?
  >
  > Und jetzt? – Was ist geschehen? / Welch grässlicher Todesschrei! / Entsetzt die Lauscher stehen: / „Mit dem dort ist's vorbei!“
  >
  > Der Keckste nimmer weilte / Vorm Dorfe länger draus; / Er schlug ein Kreuz und eilte / Leis schaudernd fort nach Haus.

- **Strecke:** Anstieg → Schleife (am Tisch vorbei, Rechtskurve, Gabelung, rechter Abzweig führt zurück auf den Weg vor dem Tisch) → dieselbe Schleife noch einmal → linker Abzweig hinaus. An der Gabelung beide Abzweige sichtbar. Teufel-Bot gibt es schon (`figuren.js`).
- **Rolle:** ein langer Block am Anstieg und zwei mittellange Fluchten; keine zusätzlichen Intervalle, stattdessen kurze Spitzen in den Fluchten, die zur Geschichte passen (Besteckwurf, Dreizack, Tisch-Wurf).
- **Workout (vom Nutzer bestätigt, 40:00):**

| # | Zeit | Dauer | Szene | Hart | Leicht |
|---|---|---|---|---|---|
| 1 | 0:00–5:00 | 5:00 | Einfahren am Gasthaus (Tafeln) | 50 → 65 % | 45 → 60 % |
| 2 | 5:00–15:00 | 10:00 | Anstieg zum Teufelstisch | 95 % | 77 % |
| 3 | 15:00–18:00 | 3:00 | Anschleichen am Rand, halb in den Büschen | 65 % | 50 % |
| 4 | 18:00–18:20 | 0:20 | Friedel macht Lärm, Teufel springt auf | 155 % | 120 % |
| 5 | 18:20–23:20 | 5:00 | **Flucht 1**, weite Rechtskurve | 110 % | 92 % |
|   |  |  | darin: 3 Besteckwürfe, je 10 s | 130 % | 110 % |
|   |  |  | darin: Dreizack-Piekser am Ende, 20 s | 140 % | 115 % |
| 6 | 23:20–27:00 | 3:40 | Gabelung rechts, „abgeschüttelt“ | 60 % | 45 % |
| 7 | 27:00–27:20 | 0:20 | Der Tisch taucht wieder auf | 155 % | 120 % |
| 8 | 27:20–33:20 | 6:00 | **Flucht 2**, dieselbe Schleife | 113 % | 95 % |
|   |  |  | darin: Tisch rausreißen und werfen (nach ≈ 2 min), 30 s | 135 % | 110 % |
|   |  |  | darin: 2 Dreizack-Piekser, je 15 s | 145 % | 115 % |
| 9 | 33:20–33:40 | 0:20 | Gabelung links, Schlusssprint weg vom Teufel | 165 % | 125 % |
| 10 | 33:40–40:00 | 6:20 | Ausfahren, Teufel bleibt zurück | 55 → 45 % | 50 → 40 % |

  Flucht 2 bewusst länger und härter als Flucht 1; die Pause nach der ersten Flucht ist kurz, damit das Wiedersehen mit dem Tisch auch in den Beinen gemein ist. Leicht/Hart: Werte 5 Prozentpunkte unter bzw. über dem ersten Entwurf (Ein-/Ausfahren unverändert).

- **Ideen (vom Nutzer bestätigt):**
  - **Elwetritsche fährt mit:** die gefangene Elwetritsche aus Mission 1 sitzt im Käfig auf Friedels Gepäckträger; bei der Flucht streckt sie dem Teufel die Zunge raus.
  - **Dörfler warnen:** Leute am Gasthaus bzw. am Weg warnen schon beim Einfahren („Do hoch? Zum Deiwel?“, passt zur Strophe „Man warnt ihn in der Runde“).
  - **Mittagessen des Teufels:** Pfälzer Dreierlei (Saumagen, Bratwurst, Leberknödel mit Sauerkraut und Kartoffelbrei) und Schorle im Dubbeglas.
  - **Glocke läutet zwölf:** die Kirchenglocke unten im Kaltenbacher Tal läutet Mittag, wenn die letzte Strophe ausläuft und man den Teufel sieht (Gegenstück zu „Vom Turm tönt laut die zwölfte Stunde“, nur am Tag; Ton erst nach Rückfrage).
  - **Teufel stolpert** bei der Verfolgung (z. B. über eine Wurzel) und schimpft.
  - **Rückblick:** nach der zweiten Flucht Kamera-Rückblick (wie beim Bettler auf Berwartstein, `rueckblick`): der Teufel steht ohne Tisch da und schaut auf seinen leeren Felsen.
  - **Hirte mit Ziegen** am Hang.
  - **Ausfahren:** bergab Richtung Dahn, irgendwann Blick auf die Dahner Felsen mit dem Jungfernsprung (Ausblick auf Mission 3).
  - **Ende: Lager aufschlagen (vom Nutzer, noch offen):** am Schluss halten Friedel und du an (Halt wie die Wirtshaus-Szene in Mission 1, `R.def.halte`), Friedel sagt sinngemäß „Loss mol Lager uffschlage, 's werd dunkel …“, dann wird das Bild dunkel und die Mission ist beendet. Offen: Text auf Pfälzisch (vom Nutzer), ob es dafür im Ausfahren langsam dämmern soll (Mission läuft mittags, `tod:'tag'`) und ob der Halt am Ausblick auf die Dahner Felsen liegt.
- **Bauplan (Vorschlag):**
  1. Gerüst: Mission 2 in `KAMP` (kampagne.js) mit Workout Leicht/Hart; Vorausberechnung von Mission 1 so verallgemeinern, dass jede Mission ihre eigene Definition hat (wie `trifelsDef`).
  2. Strecke: Schleife zweimal befahren, Weg, Gelände und Szenen der Schleife aber nur **einmal** bauen (sonst liegt der Weg doppelt und flimmert); Gabelung mit beiden Abzweigen sichtbar, rechter führt zurück auf den Weg vor dem Tisch. **Entschieden (mit dem Nutzer): volle Schleife zweimal** (Linksabbiegen direkt nach dem Tisch wäre nicht einfacher: Stück am Tisch doppelt, dazu 2–3 km neues Wegstück für Flucht 2, Gabelung halb nutzlos, Pointe weg). Beide Abzweige gehören ohnehin zur Strecke (rechts Runde 1, links Runde 2). Meter zählen in Runde 2 weiter → Ereignisse je Runde sauber zuzuordnen. Zeiten: Tisch → Gabelung ≈ 5 min hart (Flucht 1); in Runde 2 nach ≈ 5 min an der Gabelung links, letzte Minute von Flucht 2 und Schlusssprint auf dem Weg hinaus. Prüfen: Gelände/Bodenhöhe über „nächster Streckenpunkt“ darf die doppelte Schleife nicht stören (Höhen gleich, im Selbsttest prüfen).
  3. Landschaft: Pfälzerwald, Buntsandsteinfelsen, Kaltenbacher Tal mit Kirchturm, Teufelstisch als große Felsgruppe auf der Kuppe.
  4. Teufel am Tisch (isst, kaut), dann Verfolgung **zu Fuß** mit Dreizack (Teufel-Bot ist Radfahrer → Lauf-Pose nötig), Gummiband-Abstand hinter dir.
  5. Würfe: einfache Flugbahnen (Besteck, Tisch), getaktet nach den Spitzen im Workout, knapp daneben mit Staub/Splittern.
  6. Runde 2 mit eigenem Zustand: Teufel sitzt wütend da, reißt den Tisch heraus, danach ist die Säule leer.
  7. Gedicht-Einblendung, Anschleichen (Aero-Haltung, Fahrlinie am Rand), Friedels Missgeschick.
  8. Tafeln, Texte, Ton (nur nach Rückfrage), dann Deko und Gags; nach jedem Schritt Selbsttest mit `--boden`.

## Mission 3: Dahn – Der Jungfernsprung
- **Ort:** Dahn, Felsen „Jungfernsprung“, Dahner Felsenland.
- **Story:** Eine Magd hat Trothas Pläne belauscht, seine Schergen jagen sie. Laut Sage sprang sie vom Felsen, ihr Rock bremste den Fall, wo sie aufkam, entsprang eine Quelle. Du hilfst ihr bei der Flucht und hältst die Verfolger auf Abstand; die Quelle unten ist Kontrollpunkt/Belohnung. Sie verrät dir, wo Trotha die Bauern gefangen hält (die du im Finale im Burghof befreist).
- **Rolle:** längere Bergintervalle.
- **Workout-Entwurf (≈40 min):** 10 min Einfahren 50→65 % · 3 × (5 min 88–92 % Flucht bergauf + 3 min 55 %) · 6 min Ausfahren 50 %.
- **Highlight Jungfernsprung (Nutzer-Idee):**
  1. Rettung: Du holst die von Trothas Rittern verfolgte Magd ein, sie springt hinten auf den Gepäckträger (sitzt seitlich).
  2. Flucht: Mit ihr auf dem Rad fährst du die Bergintervalle, die Ritter im Nacken.
  3. Sprung: Ende des letzten Intervalls ist die Klippe, man drückt die letzten Sekunden voll auf die Kante zu. Über der Kante springt sie im Flug ab.
  4. Ihr Rock öffnet sich wie ein Fallschirm, sie schwebt langsam hinab, du fällst schneller.
  5. Landung: Einfedern, Kamerawackeln, weiterfahren. Wo sie aufkommt, entspringt die Quelle, sie winkt dir nach. Die Ritter bleiben oben an der Kante stehen.
  - Flug als kurze Verschnaufpause, danach Ausfahren. Technik: für ein paar Sekunden feste Bewegung statt Physik, Zeitlupe und Kamerafahrt (an `startKamera` und Kamerawackeln in `effekte.js` anlehnen). Neu: Mitfahrerin in Sitzhaltung auf dem Gepäckträger, Rock, der sich aufbläht und gleitet. Die Dahn-Welt braucht dafür eine Geländekante (Felsen oben, tiefere Stufe, Straße unten weiter).

## Mission 4 (Finale): Berwartstein – Drache und Hans Trapp
- **Ort:** Erlenbach und Burg Berwartstein, bestehende Strecke (`welt-berwartstein.js`, `welt-dorf.js`, `berwartsteinDef`).
- **Story (vom Nutzer bestätigt):** Man fährt im Grunde die Berwartstein-Strecke: Start am Bauernfest in Erlenbach, Wegelagerer, Bogenschütze, auf dem Weg hinauf zur Burg greift der Drache an. Im Burghof wartet Hans von Trotha (Hans Trapp) und wird besiegt wie der Schwarze Ritter in „Ritter der Kokosnuss“. Abschluss-Tafeln: Rückkehr zum Trifels, der Burgherr vertraut dir das Lösegeld an. Drache mit Überflügen und Feuer gibt es schon. Keine Flutwelle mehr (siehe Bausteine).
- **Rolle:** Höhepunkt, härteste Intervalle; sie werden kürzer und härter bis zum Burghof.
- **Workout (vom Nutzer bestätigt, 45:00, Leicht/Hart in % FTP; Watt bei FTP 290 für Hart):**
  | Zeit | Abschnitt | Dauer | Leicht | Hart | Hart bei 290 W | Szene |
  |---|---|---|---|---|---|---|
  | 0:00 | Einfahren | 7:00 | 50 → 75 | 50 → 75 | 145 → 218 | Fest, Dorf Erlenbach |
  | 7:00 | Locker | 3:00 | 60 | 60 | 174 | Ortsausgang, Bauern warnen |
  | 10:00 | **Wegelagerer** | 4:00 | 83 → 95 | 95 → 120 | 276 → 348 | Flucht vor der Staubwolke |
  | 14:00 | Erholung | 4:00 | 50 | 60 | 174 | Wald, Bach |
  | 18:00 | **Bogenschütze** | 4:00 | 85 → 100 | 95 → 120 | 276 → 348 | Pfeile schlagen neben dir ein |
  | 22:00 | Erholung | 3:00 | 50 | 60 | 174 | Waldrand, ein Schatten zieht über dich hinweg |
  | 25:00 | **Drache 1** | 2:00 | 95 → 110 | 110 → 125 | 319 → 363 | Drache stößt vom Burgfelsen herab |
  | 27:00 | Erholung | 2:00 | 50 | 60 | 174 | Deckung unter Felsnasen |
  | 29:00 | **Drache 2** | 2:00 | 100 → 115 | 115 → 130 | 334 → 377 | Jagd den Burgweg hinauf, Feuer im Nacken |
  | 31:00 | Erholung | 4:00 | 50 | 60 | 174 | Vorburg, Zugbrücke, Burgtor |
  | 35:00 | **Burghof** | 6 × (0:20 / 0:20) | 125 / 50 | 160 / 55 | 464 / 160 | Hans Trapp verliert Arm um Arm, Ketten, Ehrenrunde |
  | 39:00 | Ausfahren | 6:00 | 70 → 50 | 70 → 50 | 203 → 145 | Jubel, Abfahrt ins Tal, das Dorf am Weg |
  - **Leicht:** Ø ≈ 69 % FTP, NP ≈ 77 %, TSS ≈ 44 (5 Punkte unter dem ersten Entwurf). **Hart:** Ø ≈ 78 % FTP (≈ 227 W bei FTP 290), NP ≈ 89 %, ≈ 614 kJ, TSS ≈ 60 – Spitzen gezielt angezogen, Steigerung bis zum Burghof bleibt (4-min-Blöcke bis 120 %, Drachen bis 125/130 %, Sprints 160 %).
  - Art: gemischtes Intervalltraining – Schwelle (4 min), VO2max (Drachen, 2 min), anaerob (Burghof 20/20).
- **Übergang zur Burg (vom Nutzer bestätigt):** Drache 2 endet damit, dass du gerade noch über die Zugbrücke kommst, das Tor kracht hinter dir zu, der Drache prallt dagegen – erledigt, ohne Kampf.
- **Burghof wie eine Halfpipe (Nutzer-Idee):** Man fährt im Hof hin und her, je Durchfahrt (20 s) ein Hieb, an Burg bzw. Burgtor wenden (20 s Pause):
  1. Einfahrt in den Hof: linker Arm ab · Wende an der Burg
  2. rechter Arm ab · Wende am Burgtor
  3. rechtes Bein ab · Wende an der Burg
  4. linkes Bein ab, übrig bleibt nur der Rumpf
  5. Ketten der angeketteten Bauern und Burgbewohner abfahren, sie sind frei
  6. Ehrenrunde, alle jubeln
  - **Halfpipe-Enden (Nutzer-Idee):** An der Burg steht eine Hütte/ein Gebäude/ein Laden, davor eine Rampe (Schubkarren, angelehntes Brett o. ä.): man fährt hoch, springt oben kurz ab wie ein „Air“ beim Skateboarden und fährt an der Burg entlang wieder hinunter. Am anderen Ende (Burgtor/Mauer) ebenfalls etwas zum Hochfahren, oben „grindet“ man ein Stück an Burgtor oder Mauerkrone entlang und fährt wieder hinab.
  - **Ausgearbeitet (vom Nutzer bestätigt):**
    - **Air an der Burg:** Schmiede am Fuß der Burg, davor eine Schubkarre mit schräg angelehntem Brett als Rampe. Hochfahren, kurz abheben, in der Luft umdrehen, auf der Rampe landen, Kamera schwenkt mit, Zeitlupe (hilft auch, die Intervalle zu timen).
    - **Grind am Tor:** Heuwagen (Deichsel nach oben, Säcke/Fässer) vor Tor bzw. Mauer als Auffahrt. Oben ein Stück an Mauerkrone oder Torbalken entlangrutschen, Funken unter dem Rad, abspringen, zurück in den Hof.
    - **Timing:** Durchfahrt = 20 s Intervall (Leicht 125 %, Hart 160 %), Hieb gegen Trapp in der Mitte des Hofs. Air bzw. Grind und Rückfahrt bis zur nächsten Durchfahrt = 20 s Pause. Abwechselnd: Arm 1 → Air (Burg) → Arm 2 → Grind (Tor) → …
    - **Hans Trapp** bleibt in der Hofmitte, bewegt sich etwas hin und her (nicht zu viel).
    - **Zuschauer** (Burgbewohner, befreite Bauern) jubeln bei jedem Air und Grind.
    - Technik: Air und Grind für ein paar Sekunden fester Ablauf statt Physik (Rampe, Flugbahn, Landung vorgegeben), wie beim Jungfernsprung.
  - Trapp gibt nicht auf („Is doch nur e Kratzer!“), Sprüche schreibe ich im Stil, Nutzer prüft. Ob der Drache Trapp gehört, ist egal.
- **Ausfahren:** lockere Jubelrunde, dann Abfahrt von der Burg ins Tal, das ganze Dorf am Weg.

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

## Umsetzung
1. ✅ **Gerüst** (`js/kampagne.js`): Modus `kamp` im Menü (`MODES` in `strecke.js`, `openMode` in `lobby.js`) läuft intern als Training (`race.mode='train'`, `race.kamp`=Mission) – ERG, Workout-Anzeige, Ergebnis aus `training.js`. Hooks: `curSegs`/`curUnit`/`woKind`, `renderWo` (blendet Workout-Editor aus, FTP bleibt), `trainFinish` → `kampFertig`, `loop` → `kampTick`. Missionen in `KAMP` (Workout-`items`, `start`-/`ende`-Tafeln, `bald` = noch nicht gebaut), Texte mit `[Bauer|Bäuerin]`. Tafeln `#kampTafel` mit Emoji-Platzhalterbild. Spielstand `kd-kampagne` `{stand, done, sel}`. Platzhalter-Strecke: Berwartstein in Dauerschleife (`KAMP_STRECKE`). **Vom Nutzer getestet:** Kacheln, Auswahl Bauer/Bäuerin, Leicht/Hart, Intervalle und Ende funktionieren; Tafelstil und Lesbarkeit (25 s) passen.
2. ✅ **Vorausberechnung und Trifels-Strecke** (`trifelsDef` am Ende von `strecke.js`, Route `trifels` in `ROUTES`, Mission `strecke:'trifels'`, `kampRoute()` in `kampagne.js`): ein Streckenstück je 2 s Workout, Länge per `vSteady` aus Watt, Gewicht und fester Steigung je Abschnitt (`TRIFELS_T`: 0–150 s Anstieg 7 %, die letzten 30 s Schlussrampe 10 % (vom Nutzer gewünscht: steiler, Start näher an der Burg) · 150–175 s Kehre in der Vorburg 1,5 % = Audienz-Tafel · bis 60 s vor Ende Einfahren Serpentinen-Abfahrt −5,5 % · 60 s Auslauf −1,5 % · ab Ende Einfahren Wirtshaus und flaches Tal ±0,6 %), 600 m Reserve dahinter. Linie per `turtle`: Anstieg nach Norden, Rechtskehre (halber Kreis) um den Goldkarren statt Schleife (kreuzt sich nicht), Serpentinen nach Osten, dann ostwärts durchs Tal. Neu berechnet bei Änderung von Stufe, FTP oder Gewicht (`genEntry`). Mit ERG wird die Position wie bei Space ±10 % nachgeführt (`planNudge`, Flag `planbar`). Tafeln können eine feste Zeit haben (`at`, Audienz bei 150 s). Meter für Welt und Ereignisse in `R.def.orte` (`loewenherz`, `hof`, `karren` [x,y], `burg` [x,y], `wirtshaus`, `jagd`, `ziel`). Flag `ma`: Holzrad/Mittelalter-Kleidung, kein Publikum, keine Leitpfosten. Beispiel FTP 250, 72 kg: Leicht 19,0 km (Vorburg 563–718 m, Wirtshaus 5047 m, Ziel 18,4 km), Hart 19,9 km. Gelände vorerst schlicht (Wald, Wiese, ein paar Häuser am Wirtshaus). **Vom Nutzer getestet:** Kehre mit Audienz-Tafel nach 2:30, Häuser am Ende des Einfahrens (8:00) – Timing stimmt. Offen für Schritt 3: km-Schilder kommen aus `welt-kalmit.js` (nur bei `burg` ausgeblendet), Abenddämmerung für die Mission fest einstellen.
3. ✅ **Welt Trifels** (`js/welt-trifels.js`): `prepTrifels` (aus `buildRoute`: Vorburg-Platz und Burgberg frei von Bäumen, Häuser am Wirtshaus mittelalterlich, Wirtshaus = Haus rechts am Wirtshaus-Meter, Meter in `R.tri`), `trifelsGelaende` (aus `build3D`: Vorburg eben – nur absenken, damit nichts durch die Straße sticht –, Burgberg unter dem Felsen), `buildTrifels`: Sandstein-Felsrücken mit Bug im Westen, Ringmauer und Zwinger, Bergfried mit Zinnen und Erker, Palas mit Doppelfenstern und grauem Walmdach, Torbau im Osten (Turm mit Zeltdach, Torturm mit Fachwerk), Fachwerkhäuschen auf dem Westsporn; Vorburg mit Holzhütten außen um die Kehre (Mitte frei für den Goldkarren, Kisten, Fässer, Heu); Wirtshausschild „Wirtshaus“ (Name offen); Laternen am Weg ab dem Wirtshaus (leuchten in der Dämmerung). In `welt-kalmit.js` Flag `MA` (burg oder ma): Pfälzerwald-Umland, weite Sicht, keine km-/Kehren-Schilder, Gitter, Start/Ziel-Bögen. Kampagne immer Abenddämmerung (Tageszeit-Auswahl ausgeblendet). **Noch vom Nutzer anzusehen.** Nicht dabei (später): Bach und Nebel im Queichtal, Glühwürmchen, Burgweg zum Tor, Nachbarburgen Anebos/Scharfenberg.
   - **Nachbesserungen nach Test des Nutzers:** Gras schaute an der Burgweg-Abzweigung durchs Pflaster, Heuballen schwebten am Rand der Vorburg → Vorburg wirklich eben (auch anheben), Vorburg-Kram einzeln auf den Boden, Gelände neben der Straße auf der ganzen Strecke bis 12 m knapp unter der Fahrbahn und bis 30 m nur sanft ansteigend (`trifelsGelaende`, bekommt `src`/`dist`), in Kehren die tiefste Straßenhöhe im Umkreis 14 m. Geländeraster war ≈ 20 m (Tal lief 14 km geradeaus) → Straße lag in den Serpentinen bis 7 m im Hang: Tal jetzt in Schleifen hin und her (≈ 1,8 km, 400 m Abstand), Raster ≈ 7,4 m, Serpentinen-Abstand 60 m (Kehrenradius 30). Messung (Testskript, Gelände über Fahrbahn ±1,8 m): überall ≤ −0,2 m.
   - **Mehr Wald (vom Nutzer gewünscht):** zusätzliche Kiefern, Buchen und Büsche im Wald bis 76 m neben dem Weg (`prepTrifels`, nie auf dem Weg oder benachbarten Kehren); Tal jetzt Pfälzerwald mit Wiese nur am Wirtshaus und je einer Lichtung nach Jagd 1–4 (vom Nutzer gewünscht, `TRIFELS_T.wiesen`, Szenen in `welt-trifels-wiesen.js`): Schafherde (Schafe auf dem Weg, kein Lob-Spruch nach Jagd 1, Friedel: „Wenn nur die bleede Elwetritsche ach so schää rumstehe würden… …anstatt so rumzuflattre die ganz Zeit!“), Weiher nah am Weg mit Scheune, Kuhherde mit Zaun am Weg und an beiden Enden quer, Köhlerplatz rechts am Waldrand am Ende der Lichtung (Glut hell). **Noch vom Nutzer anzusehen.**
4. Figuren – **teilweise gebaut** (in `welt-trifels.js`, eigene Bausteine `trMensch`, `trPferd` mit Schabracke, `trReiter`, Wappen `wappenMal`/`leopard`; Vorlagen `vorlagen/loewenherz/`): ✅ **Burgweg** (vom Nutzer gewünscht): Erdweg ≈ 63 m vom Scheitel der Vorburg-Kehre im Bogen nach Nordosten hinauf zum Torbau, Gelände darunter geebnet, Weg und Karren liegen auf `terrainAt` (Geländeraster ≈ 13 m), `T.weg`; ✅ **Goldkarren** (Pferd, Goldhaufen, Münzen, Truhen mit Goldbeschlägen) wartet an der Abzweigung am Straßenrand, zieht ab 2:25 im Schritt (1,2 m/s) den Burgweg hinauf – man fährt in der Kehre direkt an ihm vorbei –, fährt durchs Tor und verschwindet; ✅ **Wachen** (Kettenhaube, rote Tunika, gelbe Ärmel, grüne Beinlinge, Speer) gehen links und rechts neben dem Wagen mit; ✅ **Burgherr** (frei gestaltet: blaues Gewand, roter Mantel mit Pelzkragen, Bart) steht links am Scheitel der Kehre kurz vor der Abzweigung des Burgwegs, zwei Wachen mit Speer neben ihm; **Audienz (vom Nutzer gewünscht):** ab 2:32 hebt er die Hand, Sprechblase „Halt! Ihr seid doch [der Bursche, der|die Magd, die] sich für das Gold meldet?“, Kamera schaut kurz zu ihm (`trifelsKamera`, wie beim Zöllner), Sprechblase groß (vom Nutzer gewünscht); Audienz-Tafel erst ab 2:55 nach der Vorburg, zu Beginn der Abfahrt (vom Nutzer gewünscht; `TRI_RUF`, Tafel `at` = rauf+25); zwei abgeladene Truhen an der Abzweigung des Burgwegs (blaues Gewand, roter Mantel mit Pelzkragen, Bart; frei gestaltet), ✅ **Löwenherz mit Gefolge**: Richard (roter Waffenrock mit drei goldenen Löwen, Kettenhemd und -haube, Krone, grauer Bart, Pferd mit roter Löwen-Schabracke und rotem Federbusch), Bannerträger mit Löwenfahne, drei Ritter mit eigenen Wappen (gelb/schwarzes Kreuz, rot-weiße Sparren, blau mit weißem Schrägbalken); warten an der Vorburg, reiten ab ≈ 30 s im Trab (3,2 m/s) als Kolonne mitten auf dem Weg bergab, Begegnung bei 1:15 (`T.loewenherz`), `poseTrifels` aus `draw`. **Beiseite (vom Nutzer gewünscht):** ab ≈ 48 m Abstand ruft der Bannerträger „Beiseite mit Euch, [Bauer|Bäuerin]! Platz für den König von England!“, man fährt vorher in der Mitte und weicht ab 32 m an den rechten Rand aus, bis der Letzte vorbei ist (`triSpur` in `rennen.js` → `lanes`). **Noch vom Nutzer anzusehen.** ✅ **Friedel** (`buildFriedel`: `makeRider('custom',…,true)` schmächtig, grünes Wams, Holzrad, lange rote zottelige Haare unter der Bundhaube, Sack auf dem Rücken, leuchtende Laterne am Lenker, ohne Namensschild), ✅ **Dorfleute** vor dem Wirtshaus „Zack Zack“ (Dorfmann, Dorfweib, zwei weitere, mit Krügen), ✅ **Elwetritsche** (`elwetritscheModell` nach den Vorlagen). Offen: zweiter Karren für die Kamerafahrt (mit Schritt 5).
5. **Ablauf Mission 1 – gebaut** · **Änderungen nach Test des Nutzers:** Burgherr-Blase fehlte (Kommentar mitten in der Zeile, `world.add` lief nie) → jetzt Blase in Bildschirmgröße bis man vorbei ist; **Wirtshaus als Zwischenszene**: 30 s Halt vor dem Ende des Einfahrens (`TRIFELS_T.szene`, `R.def.halte` – in `trainStep` steht man, ERG läuft weiter), zwei feste Kamera-Einstellungen (`camOverride`), du stehst als Figur neben deinem Holzrad (Bauer oder Bäuerin), Friedel steht neben seinem, Handschlag zur Wette, Dorfweib lacht, Krüge hoch, Friedel dreht sich zu dir, danach geht es weiter; lange Sprüche auf zwei Blasen verteilt (Texte als Liste in `TRI_TXT`), Blasen größer; **Friedels Abschied in der Grundlage** (nach ≈ 55 %), danach fährt er zurück, das Ausfahren fährt man allein; **Burgwald bis an die Vorburg** (keine Wiese mehr), Lücken nur für Kisten, Burgfelsen, Hütten (`TRI_HUETTEN`), Burgweg, Burgherr mit Wachen. – Erster Stand: (`triSkript`, `poseFriedel`, Texte in `TRI_TXT` in `welt-trifels.js` = Texte oben): Wirtshaus-Szene ab 15 s vor Ende des Einfahrens (Dorfmann, Dorfweib, Friedel „Des wer ma mo sehe!“, Kamera schaut kurz zu den Dorfleuten), Friedel fährt ab Ende des Einfahrens links neben dir mit und spricht dich an; je Jagd: Ankündigung 7 s vorher, Elwetritsche taucht 34 m vor dir auf, rennt im Zickzack, du holst bis auf 4 m auf, nach 25 s Haken ins Gebüsch (abwechselnd links/rechts), schaut ab Jagd 2 zurück und streckt die Zunge raus; Friedel feuert an, fällt in Jagd 1–4 auf ≈ 35 m zurück („Jetz wart doch …“), Countdown „Noch zeh / finf“, danach „Weg isse …“ usw., holt wieder auf; Lob und Angst in den lockeren Phasen; Jagd 5: Friedel bleibt mit offenem Sack neben dir, die Elwetritsche springt hinein, Sack zappelt, „Ich hab se!!! …“; vor den Ende-Tafeln der Abschied, dann kehrt Friedel um und fährt zurück. Sprechblasen in fester Bildschirmgröße (`triBlase`); ist Friedel nicht im Bild (zurückgefallen), stehen seine Worte unten im Bild (`#triSag`). **Noch vom Nutzer anzusehen.**
   - **Mehr Leben (vom Nutzer gewünscht, `js/welt-trifels-leben.js`):** fünf Baulücken am Wirtshaus (Misthaufen mit Hühnern, Schweinekoben, Hühnerstall auf Stelzen, Wassertrog, Strohhaufen mit Handkarren; Teile aus dem gemeinsamen Hof-Baukasten von Berwartstein), Fässer an der Wirtshausecke; in der Wirtshaus-Szene treibt eine Magd sechs Gänse von der rechten in die linke Lücke (im ersten Kamerabild); zwischen Wirtshaus und Jagd 1 Gegenverkehr (Magd mit Korb, Bauer mit Sense, Heuwagen mit Kutscher – du und Friedel weicht rechts aus –, Mönch), die Leute grüßen; nach Jagd 1 quert ein Reh mit zwei Kitzen den Weg (Friedel sagt nichts; erst nach Jagd 2 geplant, vom Nutzer vorgezogen; Fell glimmt leicht, Spiegel hell, Augen – vom Nutzer gewünscht); nach Jagd 4 kommt ein Wildschwein schräg von rechts aus dem Wald, läuft vor dir auf den Weg, rennt ≈ 9 s vor dir her und biegt nach links in den Wald ab, ≈ 17 s insgesamt (`TRI_SAU`; vom Nutzer gewünscht, vorher nur rechts am Rand; größer, glimmt leicht, Augen leuchten), Friedel: „Gugg mo do! E Wutz!“ / „Do kinnt ma e subba Brotworschd draus mache… Hosch du a so en Hunger?“. Messung: Wirtshaus ≈ 590 → 740 Zeichenaufrufe, unterwegs unverändert ≈ 400. **Noch vom Nutzer anzusehen.**
   - **Fuhrwerk auf der Abfahrt (vom Nutzer gewünscht, `welt-trifels-leben.js`):** in der Mitte der Abfahrt zwischen Burgherr und Wirtshaus (Workout-Zeit `triFuhrT`, Leicht ≈ 5:24) rauscht ein Bauer mit Fuhrwerk im Galopp von hinten heran (Fässer, Körbe, ein Lederball auf der Ladefläche), fährt links neben dir her, du weichst rechts aus (`triGegenSpur`); er schaut zu dir und erzählt vom Fußball in Lautre und dem Stadion auf dem Betzenberg (`TRI_FUHR_TXT`, 4 Blasen), nach kurzer Pause „Oich gsprächich bischd jo nid grad … Kriegsch die Zäh nid ausenanner, [Großer|Großi]?“, dann „Alla hopp, ich muss weida, in deim Schneggetempo brauch ich jo bis iwwermoie, bis ich dehääm bin.“ (vom Nutzer gewünscht), winkt ab, knallt mit der Peitsche und fährt davon (≈ 52 s insgesamt, `TRI_FUHR`). **Noch vom Nutzer anzusehen.**
   - ✅ **Kamerafahrt beim Countdown (vom Nutzer gewünscht):** 15 s (`triIntroPose`, `triIntroKamera` in `welt-trifels.js`, Zeit `anim.tri.kt`): Countdown 5 s ohne Piepsen, Zahlen klein und halb durchsichtig (`#banner.dezent`), danach trittst du schon, während die Kamera noch 10 s oben bleibt. Weitwinkel auf den Trifels → Goldkarren rollt über die Kehre heran und biegt vor dem Burgherrn auf den Burgweg (Burgherr grüßt mit erhobener Hand) → eine Wache setzt eine Truhe ab → Löwenherz schwingt sich aufs Pferd → Flug im Bogen über den Wald zu dir. Erste Story-Tafel erst ab 10 s. Kein Rollen durchs Burgtor (der Karren fährt erst ab 2:25 hinauf). **Noch vom Nutzer anzusehen.**
   - Story-Tafeln ohne Bild (Emoji-Platzhalter entfernt, ohne `bild`/`img` fällt der Bildrahmen weg); Bilder nur auf den Infotafeln.
   - **Nebel (vom Nutzer gewünscht, dicht und unheimlich):** ab Jagd 1 leichter Dunst, nach Friedels Abschied dichter Nebel mit ≈ 75 m Sicht (Ausfahren im Dunst), abends goldgrau, nachts blaugrau, reißt auf den letzten 700 m vor dem Gasthaus auf (Gasthaus, Kuppe und Teufelstisch klar vor dem Nachthimmel), Himmel und Nebel gleich gefärbt; Szenen-Nebel plus 60 mitwandernde Schwaden über und neben dem Weg (`TRI_NEBEL`, `triNebel` aus `trifelsLicht`, `buildTrifelsNebel`/`poseTrifelsNebel` in `welt-trifels.js`).
   - Offen: Kamerawackeln beim Ausweichen vor Löwenherz, Bach/Glühwürmchen.
5. Ablauf, Ereignisse und Texte; Story-Tafeln ohne Bild, Infotafeln mit Bildern vom Nutzer (`kampagne/bilder/`).

## Offene Fragen
- **Berwartstein und Ankunftszeit (gelöst, vom Nutzer bestätigt):** Strecke 5,59 km mit ≈ 400 Hm (≈ 7 %), bei 80 kg mit 200 W ≈ 32 min, mit 150 W ≈ 42 min. Workout bis zum Tor ≈ 72 % FTP → Ankunft je nach FTP 29–57 min statt 35:00. Lösung: Strecke bleibt wie gebaut (Szenen an festen Metern), stattdessen Tempo anpassen – Faktor auf die Steigung in der Physik (gezeichnet bleibt sie, wie bei Space), laufend nachgeregelt, damit man bei ≈ 35:00 am Burgtor ist, auch wenn jemand ein Intervall nicht schafft. Korrektur vor allem in den Erholungen (v. a. die 4 min vor dem Tor), damit man in den Intervallen nichts merkt. Im ERG-Modus spürt man die Steigung nicht. Genau treffen müssen nur Zugbrücke (Ende Drache 2) und Burghof; der Drache fliegt und kann überall auftauchen. Neu zu bauen bleibt: Burghof als Halfpipe und Abfahrt ins Tal fürs Ausfahren.
- Workouts: Mission 1, 2 und 4 bestätigt, Vorschlag des Nutzers zu Mission 3 folgt.
- Namen: Knappe, Burgherr des Trifels.
- Weitere Ideen: Bonusmission aus Sicht von Weißenburg (Stadt vor der Flut warnen).
- Ideen Mission 1 (vom Nutzer, noch nicht ausgearbeitet): **Elwetritsche-Fallen** und **Neumond**.
