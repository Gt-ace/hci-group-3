# FIREHELM — Web AR Prototype

Interaktiver Web-AR-Prototyp für das HCI-Gruppenprojekt. **FIREHELM** ist ein Mini-Spiel, in dem die Spielenden die richtige Schutzausrüstung den passenden Feuerwehrleuten zuordnen — auf Zeit, mit Bestenliste und AR-Quick-Look-Ansicht der 3D-Modelle.

## Live URL

`https://gt-ace.github.io/hci-group-3/` *(nach Aktivierung von GitHub Pages)*

## Zielgeräte

iPhone 13 / iPhone 13 Pro, Safari (iOS 15+). AR Quick Look ist ausschließlich auf iOS verfügbar.

## Seiten (5)

| Seite | Datei | Funktion |
|---|---|---|
| Home | `index.html` | Logo, Leaderboard (Top 10), Gamertag-Modal, Start-Button, Link zum AR Showroom |
| Intro | `intro.html` | Einsatz-Briefing |
| Spiel | `game.html` | Drei Runden Drag-and-Drop, Timer, Infobox-Modal, Leave-Confirmation |
| Finish | `finish.html` | Endzeit + Platzierung |
| AR Showroom | `models.html` | Alle drei USDZ-Modelle mit AR-Quick-Look-Karten |

## 3D-Modelle (3)

| Modell | Datei | Verwendet in |
|---|---|---|
| Helm Gelb (Bullard R330) | `assets/models/helm_gelb.usdz` | Runde 1 + Showroom |
| Historischer Feuerwehrhelm | `assets/models/feuerwehrhelm.usdz` | Runde 2 + Showroom |
| Atemschutzmaske | `assets/models/gasmaske.usdz` | Runde 3 + Showroom |

## Lokale Vorschau

```bash
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000/` öffnen. Drag-and-Drop funktioniert auch mit der Maus; AR Quick Look funktioniert nur auf einem echten iOS-Gerät in Safari.

## Deployment

1. Repository nach GitHub pushen.
2. Settings → Pages → Source: Branch `main`, Folder `/` (root).
3. Nach kurzer Bauzeit ist die Seite unter der oben genannten URL erreichbar.

Die USDZ-Dateien müssen im Repository liegen (kein Git-LFS nötig — alle Dateien <10 MB).

## Workflow-Dokumentation

Die komplette Pipeline von Blender bis zum Web-Embed ist in [`workflow.md`](./workflow.md) dokumentiert.

## Screenshots

Alle Screenshots vom iPhone 13 liegen in [`screenshots/`](./screenshots/). *(Werden nach dem Gerätetest ergänzt.)*

## Repository-Struktur

```
/
├── index.html, intro.html, game.html, finish.html, models.html
├── css/   theme.css, layout.css, game.css
├── js/    store.js, timer.js, drag.js, modals.js, home.js, game.js, finish.js
├── assets/
│   ├── models/   *.usdz (AR Quick Look)
│   ├── images/   Hintergründe, Helm-Thumbnails, Feuerwehr-Sprites
│   └── icons/    logo, alarm, exit, info
├── docs/  README.md, workflow.md, screenshots/
└── source-assets/  (.blend + Roh-Texturen, lokal — gitignored)
```
