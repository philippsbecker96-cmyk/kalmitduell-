# Soundeffekte (Kampagne)

Geräusche für die Missionen, alle direkt in diesem Ordner. Format **.m4a** oder **.mp3**.
Dateinamen klein, ohne Leerzeichen und Umlaute.
Eingebaut in `js/welt-trifels-leben.js` (Abschnitt „Geräusche“, `triTon`): Lautstärke je Datei in `TRI_TON_VOL`, Schleifen werden leiser, je weiter die Kamera weg ist.
Vor jedem neuen Ton wird erst gefragt.

## Mission 1 (eingebaut)

| Datei | Länge | Wann |
|---|---|---|
| `wagen.mp3` | 30 s | Schleife: Goldkarren rollt in der Kamerafahrt beim Countdown heran und später den Burgweg hinauf · Fuhrwerk auf der Abfahrt · Heuwagen im Gegenverkehr |
| `hufe.mp3` | 8 s | Schleife: Löwenherz' Gefolge reitet an dir vorbei · Fuhrwerk · Heuwagen |
| `kettenhemd.mp3` | 23 s | Schleife: mit den Hufen des Gefolges |
| `wiehern.mp3` | 2 s | Richard schwingt sich in der Kamerafahrt aufs Pferd · Gefolge kommt auf 35 m heran · kurz nach deinem Sturz |
| `sturz.mp3` | 2 s | du kippst mit dem Rad an den Wegrand (Staubwolke) |
| `glocken.mp3` | 11 s | Burgherr: „Gott mit Euch!“ |
| `peitsche.mp3` | 1 s | Fuhrmann knallt mit der Peitsche und fährt davon |
| `wirtshaus.mp3` | 38 s | Schleife: am Wirtshaus „Zack Zack“ (bis 80 m) |
| `gackern.mp3` | 1 s | Hühner im Stall am Wirtshaus alle 3–8 s · drei Elwetritsche im Ausfahren (Schreck, wildes Durcheinander) |
| `grillen.mp3` | 2 min | Schleife: ab dem Ende der Wirtshaus-Szene, über 40 s lauter, bis zum Ende |
| `fluegel.mp3` | 5 s | Elwetritsche taucht auf und schlägt den Haken · eine der drei im Ausfahren flattert hoch |
| `elwetritsch_schrei.mp3` | 3 s | Elwetritsche streckt erstmals die Zunge raus (ab Jagd 2) · Zappeln im Sack (leise) · Zunge im Ausfahren |
| `elwetritschegefangen.mp3` | 1,4 s | Jagd 5: Elwetritsche landet in Friedels Sack |
| `rascheln_gebuesch.mp3` | 1 s | Elwetritsche verschwindet im Gebüsch (Jagd 1–4) · Reh springt über den Weg · Wildschwein bricht aus dem Wald und taucht links ab · Elwetritsche im Ausfahren hauen ab |
| `schwein.mp3` | 0,5 s | Wildschwein grunzt alle 2–3 s, solange es vor dir herrennt |
| `fanfare.mp3` | 8 s | Vorreiter des Gefolges ist 75 m vor dir, kurz bevor er „Platz für den König“ ruft |

## Musik Mission 1 (`../musik/`, Lautstärke in `TRI_MUSIK`, blendet ein und aus)

Spricht jemand (Dialog-Aufnahme), geht alle Musik auf ≈ ⅓ herunter (`triDuck`).

| Datei | Länge | Wann |
|---|---|---|
| `musik/thema.mp3` | 43 s | Erkennungsmelodie: Countdown, Kamerafahrt, erste Tafeln – aus, sobald das Gefolge zu hören ist (spätestens 38 s) |
| `musik/taverne.mp3` | 30 s | Schleife: am Wirtshaus (bis 90 m) · am Gasthaus im Ziel (bis 130 m) |
| `musik/jagd.mp3` | 32 s | jede Jagd von vorn, ab dem Antritt bis zum Haken bzw. Sprung in den Sack |
| `effekte/unheimlich.mp3`, `musik/omniouswaldnachts.mp3` | 32 s, 59 s | Gruselstücke im Wechsel über dem Wald-Teppich: nach Jagd 1 unheimlich, nach Jagd 2 (mit Wolfsgeheul) omin, Jagd 3 unheimlich, Jagd 4 omin (leiser, zwischen Laternen-Spruch und Wildschwein) · im Nebel nach Friedels Abschied alle 150 s abwechselnd · omniouswaldnachts mit 2,7 s Ausblendung am Ende, Original in `musik/roh/` |
| `musik/hintergrundhappy.mp3`, `musik/mittelalterhintergrundfolkig.mp3`, `musik/mittelalterhintergrundfolkig2.mp3` | 60 s, 3:10, 3:56 | Unterwegs: Wiedergabeliste (je Fahrt gemischt, 4–8 s Pause zwischen den Stücken) nach dem Thema bis zum Wirtshaus und auf den letzten 700 m vor dem Gasthaus · halb so laut, solange das Gefolge reitet · aus bei der Taverne |
| `musik/waldnichtsogruselig.mp3`, `musik/nightambient.mp3` | 3:38, 3 min | Wald-Teppich ab dem Wirtshaus bis 700 m vor dem Gasthaus: bis zu Friedels Laternen-Spruch nach Jagd 4 im Wechsel (erst waldnichtsogruselig), danach nur nightambient · leiser auf den Lichtungen, lauter im Nebel, aus bei den Jagden · nightambient um 25 dB angehoben, Original in `musik/roh/` |
| `musik/ankunft.mp3` | 15 s | einmal mit den Ende-Tafeln (Taverne pausiert so lange) |

## Mission 1 – Lichtungen (`welt-trifels-wiesen.js`, eingebaut)

| Datei | Länge | Wann |
|---|---|---|
| `schaafe.mp3` | vorhanden | Schleife: Blöken der Schafherde auf der Lichtung nach Jagd 1 (bis 70 m) |
| `hundebellen.mp3` | vorhanden | Hütehund bellt alle 2–8 s, solange du näher als 45 m bist |
| `entengeraeusche.mp3` | vorhanden | Schleife: Enten quaken am Weiher nach Jagd 2 (bis 50 m) |
| `kuhglocken.mp3` | vorhanden | Schleife: Kuhherde nach Jagd 3 (bis 75 m) |
| `muhen.mp3` | vorhanden | eine Kuh muht alle 6–14 s, solange du an der Herde bist |
| `feuerknistern.mp3` | vorhanden | Schleife: Knistern und Prasseln am Köhlerplatz nach Jagd 4 (bis 45 m) |
| `wolfsgehaeul.mp3` | vorhanden | Einmal: Wolf heult nach Jagd 2, kurz bevor Friedel fragt „Hosch du des Geheul ghört?“ |

Außerdem `fluegel.mp3`, wenn die Elwetritsche vom Scheunendach flattert. Fehlende Dateien bleiben einfach still. Sobald sie im Ordner liegen, sind sie zu hören.

## Mission 2 (eingebaut in `js/welt-teufelstisch-ton.js`, `ttTon`)

Gleiche Helfer wie Mission 1, Lautstärken der neuen Dateien in `TRI_TON_VOL`/`TRI_MUSIK` (oben in welt-teufelstisch-ton.js).

### Musik

| Datei | Wann |
|---|---|
| `musik/thema.mp3` | Countdown und Losfahren · noch einmal 3 s nach dem Schlusssprint (geschafft!) |
| `hintergrundhappy`, `folkig`, `folkig2` | Wiedergabeliste wie in Mission 1: im Einfahren unter Erzählung und Gedicht (bis 15 s vor den Hunden) · im Ausfahren nach dem Thema |
| `musik/hundejagd.mp3` | Straßenhunde (Comedy-Verfolgung, ersetzt `jagd.mp3`), in vier Schüben: beim Aufspringen, vor Klau 5 und 9, und so, dass sie mit der letzten Wurst endet – nur der erste Schub von vorn |
| `musik/waldambient.mp3` | Wald-Teppich ab den Hunden bis „Ertappt“ (leiser im Unwetter) und zwischen Flucht 1 und dem Wiedersehen mit dem Tisch · aus bei Jagd, Idylle, teufelsweg, Flucht |
| `musik/hintergrundhappy.mp3` | Idylle am Wegweiser zum Jungfernsprung (ab 250 m davor, unter der langen Kamerafahrt zur Familie und zum Regenbogen), bricht mit dem Unwetter ab |
| `musik/hintergrundhappy.mp3` (Schleife) | Pause nach Flucht 1: blendet ein, wenn es aufklart, verklingt, wenn es wieder zuzieht (aus nach der Abzweigung „sicher rechts“) |
| `musik/teufelsweg.mp3` | Anschleichen: startet 86 s vor „Ertappt“, endet genau dort, wird zum Tisch hin lauter – danach kurz Stille |
| `musik/teufelsjagd.mp3` | Flucht 1, Schleife – Kriegstrommeln, 73 s |
| `musik/teufelsjagd2.mp3` | Runde 2 (Creepy-Cartoon-Jagd): ab der Abzweigung „sicher rechts“ leiser, ab dem Sprung des Teufels voll, bis zum Schlusssprint · Wald-Teppich ist dann aus |
| `musik/teufelssprint.mp3` | Schlusssprint (20 s): Halloween-Cartoon-Jagd, 21,6 s, einmal von vorn (vom Nutzer) |
| `musik/ankunft.mp3` | mit den Ende-Tafeln (jetzt vor der Schlussszene) |
| `musik/lager.mp3` | Schlussszene am Lager: von vorn mit Beginn, blendet mit dem Bild aus · Wiedergabeliste dann aus |

### Geräusche

| Datei | Wann |
|---|---|
| `glocken.mp3` | Kirchenglocke läutet Mittag, wenn die letzte Gedicht-Strophe ausläuft |
| `hund_gross.mp3` | Bellen aus dem Gebüsch 15 s vor den Hunden · Schnappen bei jedem Wurst-Klau (etwas höher) · im Wechsel mit hundebellen alle 2–6 s, solange Hunde näher als 35 m sind |
| `hundemeute.mp3` | Hunde springen auf · ziehen nach der letzten Wurst ab |
| `hundebellen.mp3` | Kläffen bei jedem Biss in Friedels Wade · im Wechsel mit hund_gross |
| `rascheln_gebuesch.mp3` | Hunde im Gebüsch / springen heraus |
| `hufe.mp3`, `kettenhemd.mp3`, `wiehern.mp3` | Ritter am Anstieg (bis 60 m), wiehert, wenn er heran ist |
| `sturz.mp3` (tiefer abgespielt) | Teufel springt auf den Weg · Gabel und Tisch schlagen ein · reißt die Platte heraus · stolpert über das Steintor |
| `peitsche.mp3` (tiefer) | Gabel und Tisch sausen durch die Luft |
| `fluegel.mp3` (tiefer) | Teufel ist in Runde 2 wieder am Felsstuhl (Flügel offen) |
| `feuerknistern.mp3` | Teufel glimmt und raucht, wenn er wütend ist (bis 50 m) |
| `wolfsgehaeul.mp3` | 40 s nach Beginn von „Abgeschüttelt“ |
| `grillen.mp3` | zweite Hälfte des Ausfahrens (Abendlicht), blendet am Ende mit dem Bild aus |
| `teufel_bruell.mp3` (tiefer) | Ertappen (mit dem Sprung auf den Weg) · nach dem Platte-Rausreißen · tobt nach dem Sturz am Steintor |
| `glas_bricht.mp3` | Teufel wirft den Schoppen nach dem Exen hinter sich in den Wald – beim Aufschlag |
| `friedel_schrei.mp3` | Dreizack-Piekser 1 und 2 (beim zweiten etwas höher) |
| `teufel_schnaufen.mp3` (tiefer) | Schlusssprint: alle 2,4 s, solange er erschöpft schnauft (bis 70 m) |
| `donner.mp3` | Unwetter: gleich zu Beginn, dann alle 18–40 s, lauter je stärker |
| `regen.mp3`, `wind.mp3` | Unwetter: Regen mit der Regenstärke, Wind mit dem Sturm, auf den Lichtungen in Böen lauter |
| `teufel_schritt.mp3` | Schleife, solange der Teufel läuft (Verfolgung, zurück zum Tisch, bis 90 m) |
| `kaeuzchen.mp3` | Dämmerung (60 % ins Ausfahren) · gegen Ende der Schlussszene am Lager (s 36) |
| `schotter.mp3` | Knirschen von der Abzweigung zum Jungfernsprung bis zur Gabelung, lauter mit dem Tempo |
| `feuerstein.mp3`, `feuerknistern.mp3`, `brutzeln.mp3` | Schlussszene am Lager: Funken schlagen (s 8,6 und 11) · Feuer knistert, sobald es brennt · Wurst brutzelt ab s 22,5 · alles blendet mit dem Bild aus |

### Fehlt noch (Übersicht 28.10.2026, Priorität ★★★ hoch … ★ nett)

Reihenfolge-Vorschlag: `aufprall`/`steine` → `zischen`.

**Am 28.10. dazugekommen und eingebaut:** teufelsjagd, teufelsjagd2, teufelssprint, hundejagd, lager, vogel_wald, kinderlachen, donner, teufel_bruell, teufel_schnaufen, friedel_schrei, glas_bricht, schotter, feuerstein, brutzeln, regen, wind, teufel_schritt, kaeuzchen (Tabellen oben).

**Musik**

| Prio | Datei (Vorschlag) | Wofür |
|---|---|---|
| ★ | `musik/gasthaus.mp3` | Anfangsszene im Gasthaus; `taverne.mp3` reicht notfalls, ruhige Morgenstimmung passt besser zu Friedels Kater |

**Geräusche (schon eingeplant)**

| Prio | Datei | Wofür |
|---|---|---|
| ★★ | `aufprall.mp3`, `steine.mp3` | Sprung, Gabel/Tisch schlagen ein, Platte, Sturz am Steintor (ersetzen `sturz` tiefer) |
| ★★ | `zischen.mp3` | Gabel/Tisch fliegen (ersetzt `peitsche` tiefer) |
| ★ | `schmatzen.mp3` | Teufel isst, nur aus der Nähe beim Anschleichen |
| ★ | `pusten.mp3` | Schlussszene am Lager: Friedel pustet in die Glut (s 13–15,5) |
| ★ | `lachen.mp3` | Schlussszene am Lager: du lachst bei „gemütlicher Tag“ (s 31,5–33,5) |

**Neue Vorschläge zu schon gebauten Szenen**

| Datei (Vorschlag) | Wofür |
|---|---|
| `comic_schreck.mp3` | Cartoon-Schreck beim Ertappen („!“, Schreckstriche): kurzes „Boing“ oder Orchester-Stich |
| `schlucken.mp3`, `ruelpser.mp3` | Teufel ext den Schoppen · Rülpser auch für Friedels Kater |
| `holz_kracht.mp3` | Teufel reißt am Steintor die fünf Kiefern um |
| `teufel_lachen.mp3` | Runde 2 wieder am Felsstuhl |
| `knurren.mp3` | Tauziehen: Hund verbeißt sich in die Wurstkette |
| `katze_fauchen.mp3` | Katze auf dem Holzstapel |
| `besen.mp3` / Bäuerin schimpft | Bäuerin verjagt die Meute |
| `gewitter_fern.mp3` | Grollen, wenn es nach der Pause wieder zuzieht |
| `glocken.mp3` (leise) | Fernblick ins Tal am Jungfernsprung (Dorf mit Kirche) – vorhanden |

**Für Szenen, die noch kommen**

| Szene | Ton |
|---|---|
| Gasthaus (Anfang, **gebaut, vorerst stumm**: `welt-teufelstisch-gasthaus.js`, Szenenzeit `kt` = 0–5 s Countdown, danach 5 + Workout-Zeit) | `taverne.mp3` (vorhanden) oder `gasthaus.mp3` leise unter der ganzen Szene (kt 0–31) · `kamin.mp3` Feuerknistern (oder `feuerknistern.mp3`, vorhanden) · `schnarchen.mp3` schlafender Gast am Tisch links · `schritte_holz.mp3` Wirt kommt an den Tisch kt 7–11,5 und geht zurück kt 25,5–30 · draußen `tuer.mp3` (knarrende Tür) beim Schnitt kt 31, Hufe/Holzräder auf dem Hof |
| Lager (Schluss, **gebaut, Ton eingebaut** außer `pusten`, `lachen`: `welt-teufelstisch-lager.js`, Szenenzeit = s ab Halt, die letzten 50 s des Workouts) | `musik/lager.mp3` (★★, ruhig, warm, Laute/Flöte) leise ab s 0, blendet mit dem Bild aus (s 42–50) · `grillen.mp3` (vorhanden) läuft weiter · `feuerstein.mp3` (★★, Klacken von Stein auf Stahl) s 3,5–8 im Takt der Schläge · `pusten.mp3` (★, Friedel pustet in die Glut) s 8–10,5 · `feuerknistern.mp3` (vorhanden) ab s 8, wächst mit dem Feuer · `brutzeln.mp3` (★★, Wurst zischt überm Feuer) ab s 17,5 · `lachen.mp3` (★, du lachst bei „so schwer war’s doch net“) s 20,5–22,5 · `kaeuzchen.mp3` (★, schon oben) einmal gegen Ende |
| Friedels Kater | Stöhnen, Gähnen – am besten eigene Aufnahme mit den Dialogen |

Vorhanden, aber ungenutzt: `dogbark.mp3` – könnte als dritte Hundestimme in die Meute.

## Mission 1 – noch offen

Fehlt noch: `truhe.mp3` (Wache stellt in der Kamerafahrt eine Truhe ab).
Noch offen (Ideen): Gänse schnattern, Käuzchen.
