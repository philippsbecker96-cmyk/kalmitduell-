# Mission 1 – Aufnahmeliste

Eine Datei pro Zeile, Name genau wie in der Spalte „Datei“. Format **.m4a** (iPhone-Sprachmemos) oder **.mp3**, beides geht.
Sätze mit `_bauer` / `_baeuerin` gibt es doppelt: einmal für den Bauern, einmal für die Bäuerin.
Fehlt eine Datei, bleibt es still und die Sprechblase kommt wie bisher – man kann also nach und nach aufnehmen.

Tipps: ruhiger Raum, Handy ca. 20 cm vom Mund, vor und nach dem Satz kurz Stille lassen (wird nicht mitgezählt, aber nicht zu viel).
Texte stehen im Code in `js/welt-trifels.js` (`TRI_RUF_TXT`, `TRI_AUD_TXT`, `TRI_BEISEITE`, `TRI_SPOTT`, `TRI_TXT`) – ändert sich ein Text dort, bitte hier mit ändern.

## Anstieg zum Trifels

| Datei | Wer | Wann | Text |
|---|---|---|---|
| `vorreiter_01_bauer` | Vorreiter (Löwenherz' Gefolge) | reitet dir entgegen | Beiseite mit Euch, Bauer! Platz für den König von England! |
| `vorreiter_01_baeuerin` | Vorreiter | ebenso | Beiseite mit Euch, Bäuerin! Platz für den König von England! |
| `ritter_01_bauer` | Ritter am Schluss | nach deinem Sturz | Hoho, Bauer, das Radeln will gelernt sein! |
| `ritter_01_baeuerin` | Ritter am Schluss | ebenso | Hoho, Bäuerin, das Radeln will gelernt sein! |

## Audienz in der Vorburg (Burgherr, Hochdeutsch)

| Datei | Wer | Wann | Text |
|---|---|---|---|
| `burgherr_01_bauer` | Burgherr | ruft dich in der Kehre an | Halt! Ihr seid doch der Bursche, der sich für das Gold meldet? |
| `burgherr_01_baeuerin` | Burgherr | ebenso | Halt! Ihr seid doch die Magd, die sich für das Gold meldet? |
| `burgherr_02` | Burgherr | Audienz | Ihr wollt also das Gold des Königs nach Speyer geleiten? |
| `burgherr_03` | Burgherr | Audienz | Für so ein Unterfangen brauche ich Leute, denen ich wirklich vertrauen kann – und die etwas taugen. |
| `burgherr_04` | Burgherr | Audienz (zeigt in die Ferne) | Beweist es: Besiegt Hans von Trotha auf Burg Berwartstein! |
| `burgherr_05` | Burgherr | Audienz | Der Weg dorthin ist weit und beschwerlich. |
| `burgherr_06` | Burgherr | Abschied (segnet) | Gott mit Euch! |

## Wirtshaus „Zack Zack“

| Datei | Wer | Wann | Text |
|---|---|---|---|
| `dorfmann_01` | Dorfmann | Wette | Zeh Gulde, dass du heit owend kä Elwetritsch fangsch! |
| `friedel_01` | Friedel | Wette | Des wer ma mo sehe! |
| `dorfweib_01` | Dorfweib | lacht | Dem Bu henn se ah ä mo zu oft hochgeworfe… |
| `dorfweib_02` | Dorfweib | lacht | …un ä mo zu wenich uffgfange. |
| `friedel_02` | Friedel | dreht sich zu dir | Ihr fahren doch a noch Siede, gell? |
| `friedel_03` | Friedel | ebenso | Kinna ma do vielleicht helfe? Allä trau ich mich ned in de Wald… |

## Elwetritsche-Jagden (Friedel)

Je Jagd: Ankündigung, Anfeuern, (Jagd 1–4) Zurückfallen, am Ende Entwischt bzw. Fang.

| Datei | Wann | Text |
|---|---|---|
| `friedel_ank1_bauer` | vor Jagd 1 | Psst. Do vorne raschelts, Herr! |
| `friedel_ank1_baeuerin` | vor Jagd 1 | Psst. Do vorne raschelts, Herrin! |
| `friedel_ank2` | vor Jagd 2 | Do is se widder! |
| `friedel_ank3` | vor Jagd 3 | Wie frech se uns aguckt, die mänt a, sie is de Kees! |
| `friedel_ank4_bauer` | vor Jagd 4 | Uffbasse, Herr, die is gscheit wie sunscht was. |
| `friedel_ank4_baeuerin` | vor Jagd 4 | Uffbasse, Herrin, die is gscheit wie sunscht was. |
| `friedel_ank5_bauer` | vor Jagd 5 | Des is die letzscht Chance! Ich halt schummo de Sack uff, Herr! |
| `friedel_ank5_baeuerin` | vor Jagd 5 | Des is die letzscht Chance! Ich halt schummo de Sack uff, Herrin! |
| `friedel_hopp` | in jeder Jagd | Hopp, hopp, alleweil hemmer se! |
| `friedel_zurueck1` | Jagd 1, fällt zurück | Jetz warten doch bitte uff mich! |
| `friedel_zurueck2` | Jagd 2 | Mein Bock is oich longsam… |
| `friedel_zurueck3_bauer` | Jagd 3 | Mei Wade krampfen, Herr! |
| `friedel_zurueck3_baeuerin` | Jagd 3 | Mei Wade krampfen, Herrin! |
| `friedel_zurueck4` | Jagd 4 (gleicher Satz wie Jagd 1, eigene Aufnahme geht auch) | Jetz warten doch bitte uff mich! |
| `friedel_weg1` | Jagd 1 entwischt | Weg isse – ins Gebisch! |
| `friedel_weg2` | Jagd 2 entwischt | Die hot uns d' Zung rausgstreckt, hosch des gsähne? |
| `friedel_weg3` | Jagd 3 entwischt | Jetzt lacht se uns a noch aus! |
| `friedel_weg4` | Jagd 4 entwischt | Des gibts doch ned – schun widder! |
| `friedel_fang1` | Jagd 5, Fang | Ich hab se!!! Ich hab des Scheißding! |
| `friedel_fang2` | Jagd 5, Fang | Zeh Gulde, aller!!! |

## Zwischen den Jagden (Friedel)

| Datei | Wann | Text |
|---|---|---|
| `friedel_lob1a` | nach Jagd 1 | Ihr treden wie de Deifel persönlich! |
| `friedel_lob1b` | nach Jagd 1 | Ich gläb ich nenn eich Betzi ab jetzad! |
| `friedel_lob2` | nach Jagd 2 | So schnell bin ich noch nie gewesst! |
| `friedel_lob3` | nach Jagd 3 | Mit eich krieche ma noch so eh Vieh, ich spürs! |
| `friedel_angst1` | nach Jagd 1 | Die beißen, die Sauviecher, ich schwörs! |
| `friedel_angst2a` | nach Jagd 2 | Henn ihr des Geheul ghört? |
| `friedel_angst2b` | nach Jagd 2 | Des war bestimmt bloß de Wind… |
| `friedel_angst3a` | nach Jagd 3 | Im Dunkle seht ma do hinnen Ache leichte… |
| `friedel_angst3b` | nach Jagd 3 | …do werd ma ganz onnerschd. |

## Abschied (Friedel)

| Datei | Wann | Text |
|---|---|---|
| `friedel_ende1` | Grundlage, kehrt um | Isch muss glei zurick ind Wertschaft, die werren gucken… |
| `friedel_ende2` | ebenso | Mer treffen uns dann moie do im Gaschthaus in de Näh vum Deifelsdisch, gell? |

**Zusammen:** 48 Dateien (41 Sätze, davon 7 doppelt für Bauer/Bäuerin).
