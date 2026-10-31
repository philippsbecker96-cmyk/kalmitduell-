# Mission 2 – Aufnahmeliste

Pro Person ein Ordner. Jede Person in **einer zusammenhängenden Aufnahme** einsprechen, alle Sätze der Reihe nach wie unten, zwischen den Sätzen ein, zwei Sekunden Pause. Die Aufnahme kommt in den Unterordner `roh/` der Person (Name egal, **.m4a** oder **.mp3**). Daraus wird dann eine Datei pro Satz geschnitten, Name genau wie in der Spalte „Datei“, abgelegt im Ordner der Person.

Sätze mit `_bauer` / `_baeuerin` gibt es doppelt: einmal für den Bauern, einmal für die Bäuerin.
Friedel spricht dich in der Blase mit deinem Fahrernamen an – in der Aufnahme den Namen einfach weglassen.
Fehlt eine Datei, bleibt es still und die Sprechblase kommt wie bisher – man kann also nach und nach aufnehmen.
Eingebunden über `ttStimmenListe` in `js/welt-teufelstisch-ton.js` (Datei ↔ Text aus den Konstanten – Textänderungen gehen automatisch mit, neue Sätze dort eintragen).

Texte stehen im Code in `js/welt-teufelstisch-leben.js` (`TT_TXT`), `js/welt-teufelstisch-gasthaus.js` (`TT_GAST_TXT`), `js/welt-teufelstisch-fuhrwerk.js` (`TT_FUHR_TXT`) und `js/welt-teufelstisch-lager.js` (`TT_LAGER_TXT`) – ändert sich ein Text dort, bitte hier mit ändern.

## Friedel (`friedel/`)

| Datei | Wann | Text |
|---|---|---|
| `friedel_gast1` | Gasthaus | Ajo, mache ma so. |
| `friedel_gast2` | Gasthaus, leise zu dir | Was der widda meent … |
| `friedel_erz1` | Einfahren | Ach, [Name] – weescht, wu ich mich am meischte druff freu? Uff de Saumache nochher, wemma akumme! |
| `friedel_erz2` | Einfahren | Guck mo uff moin Gepäckdrächer: Des longt bis Woinachte, des Zeich! |
| `friedel_sehen` | Hunde im Gebüsch | Oh oh, die sehnen hungrich aus … |
| `friedel_start` | Hundejagd beginnt | Ohhh nä, die riechen mei Worschd! |
| `friedel_klau1` | 1. Klau | He! Gebb des her! |
| `friedel_biss1` | 1. Biss | Ahhh, de beisst ma in die Wade! |
| `friedel_klau2` | Klau | Nid de Speck!! |
| `friedel_dorf` | Antwort an den Dorfbewohner | Jo, halt die Gosch, kinnsch gscheiter mo helfe! |
| `friedel_klau3` | Klau | Die schää Fläschworschd! |
| `friedel_biss2` | 2. Biss | Loss los, du Sauvieh! |
| `friedel_zieh1` | Tauziehen, Beginn | Oh nee, jetzt hot er sich in de Worschdkett verbisse! |
| `friedel_zieh2` | Tauziehen, Mitte | Jetzt muss ich denn ah noch de Berch hochziehe oder was? |
| `friedel_zieh3` | Kette reißt | Alleweil is se zerisse – verschluck dich dra, dummer Köter! |
| `friedel_katze` | an die Bäuerin | Als dewedder, gudi Fraa! |
| `friedel_klau4` | Klau | Moin Schinke! Drecksköter! |
| `friedel_ritter` | über den Ritter | Der hot gut lache, der hockt jo uff'm Gaul! |
| `friedel_biss3` | 3. Biss | Schun widder in die Wade! |
| `friedel_klau5` | Klau | Hern mo uff jetzt! |
| `friedel_letzt` | letzte Wurst weg | Jetzt is alles fort, heile kinnt ich. |
| `friedel_duck` | vor dem Wegweiser zum Jungfernsprung | Wenn ma do jetzt iwwer de Jungfernsprung fahren, brauche ma ewich … Als ob des mim Deifel echt is – loss efach gradaus fahre. |
| `friedel_verrat` | kurz vor „Ertappt“ (verrät euch) | En Schoppe unn e Brotworschd, des wärs jetzt! |
| `friedel_gabel` | nach dem Besteckwurf | Knapp denewe is ach vorbei – zum Glick kann der net ziele mit seim Schoppe im Kopp! |
| `friedel_piek1` | Dreizack 1 | Auuuua! Spinnschd du??? |
| `friedel_tor` | Teufel stolpert übers Steintor | Guck halt, wod hiedappsch, Großer! |
| `friedel_wetter1` | Pause, es klart auf | Gugg emol, die Sunn kummt wia raus. |
| `friedel_wetter2` | Pause, es zieht zu | Hmmm, des gfallt mer jo awwer gar net, wie sich's do zuzieht … |
| `friedel_rechts` | vor der Abzweigung | Ma müssen rechts! Hunnertprozendich, do schwör ich druff! |
| `friedel_wetter3` | nach der Abzweigung | Was e Sauwetter … |
| `friedel_schwoer` | Teufel steht wieder am Tisch | Scheiße, ich war ma so sicher, dass ma rechts missen … |
| `friedel_piek2` | Dreizack 2 | Net schun widder! Ich kann jo bald nimmi hocke! |
| `friedel_sprint` | vor dem Schlusssprint | Der werd mied, der alde Suffkopp. Hopp auf – jetzt noch ä mol richtich durchziehe! |
| `friedel_fuhr` | Ausfahren, an den Fuhrmann | Mit meine eichene Händ! E Riesevieh, ich sach das! |
| `friedel_lager1` | Lagerfeuer | Gugg mol, ennie hennse ma gelosst, die Drecksköter. |
| `friedel_lager2` | Lagerfeuer | Unn segsch – war doch e gudi Abkerzung vorhin … |

## Wirt (`wirt/`)

| Datei | Wann | Text |
|---|---|---|
| `wirt_01` | Gasthaus | Ihr missen Richtung Dahn, gell? Fahren unne durchs Tal Richtung Jungfernsprung. |
| `wirt_02` | Gasthaus | Am Deifelsdisch wollena net vorbei, des kinna ma glawe. |

## Dorfbewohner (`dorfmann/`)

| Datei | Wann | Text |
|---|---|---|
| `dorfmann_01` | Anstieg, kommt entgegen | Serwus Friedel, fiddersch jetzt die Stroßeköder, weild nimmi wäsch wohi mit deine Gulde? |

## Bäuerin mit Besen (`baeuerin/`)

| Datei | Wann | Text |
|---|---|---|
| `baeuerin_01` | Anstieg, Katze auf dem Holzstapel | Fort mit eich! Lossen mei Klenni in Ruh! |

## Ritter (`ritter/`, Hochdeutsch)

| Datei | Wann | Text |
|---|---|---|
| `ritter_01` | Anstieg, überholt | Hoho! Ein Bauerntölpel auf einem Holzgestell, gejagt von Kötern! Was für ein Anblick! |
| `ritter_02` | ebenso | Macht Platz, Gesindel – ein Ritter hat es eilig! |

## Fuhrmann aus Mission 1 (`fuhrmann/`)

| Datei | Wann | Text |
|---|---|---|
| `fuhrmann_01` | Ausfahren, rauscht heran | Un wie? |
| `fuhrmann_02` | fährt neben dir | Gugg mo do, de Sunndachsfahrer vunn geschern! Hoschs a noch de Berch runnergschafft? |
| `fuhrmann_03` | zu Friedel | Unn du, Friedel – in de Wertschaft henn se vazeehlt, du hosch e Elwetritsch gfange? |
| `fuhrmann_04` | nach Friedels Antwort | Jo alla, unn ich bin Kaiser vunn China. |
| `fuhrmann_05_bauer` | zu dir | Unn du, Großer? Hosch immer nonnet redde gelernt?? |
| `fuhrmann_05_baeuerin` | ebenso | Unn du, Großi? Hosch immer nonnet redde gelernt?? |
| `fuhrmann_06` | dann fährt er davon | Alla hopp, ich packs … ma sehn uns! |
