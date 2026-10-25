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

Fehlt noch: `truhe.mp3` (Wache stellt in der Kamerafahrt eine Truhe ab).
Noch offen (Ideen): Gänse schnattern, Käuzchen.
