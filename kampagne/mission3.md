# Mission 3: Dahn – Der Jungfernsprung

Teil der Kampagne – Übersicht, Rahmengeschichte, Regeln für alle Missionen und „So trägst du Ideen ein“: `KAMPAGNE.md`. Bauanleitung und Bausteine: `kampagne/MISSION-BAUEN.md`.

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

## Drehbuch (noch auszufüllen, Vorlage `kampagne/DREHBUCH-VORLAGE.md`)
- **Workout:** Vorschlag des Nutzers folgt (Entwurf oben), Labels festlegen, Leicht/Hart.
- **Anschluss an Mission 2:** Mission 2 endet am Lagerfeuer mit Blick auf den Jungfernsprung, Weg hinab nach Dahn; Friedel fährt mit (in Mission 3 eifersüchtig auf die Magd, siehe „Der Knappe“ in `KAMPAGNE.md`).
- **Running Gags:** Bauer mit Fuhrwerk, Dämonenjunge? (offen)
- **Neu zu bauen:** Dahner Felsenland, Geländekante für den Sprung, Magd auf dem Gepäckträger, Rock als Fallschirm, Verfolger-Schergen (Ritter zu Pferd: `trPferd`/`trReiter` aus Mission 1).
