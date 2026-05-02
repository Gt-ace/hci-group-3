# Workflow: Blender → USDZ → Web-Embed

End-to-End-Dokumentation der Asset-Pipeline für AR Quick Look.

## 1. Modellierung in Blender

Quelle: `source-assets/clean_objects/*.blend` (lokal) und `source-assets/helmet-3dmodel/`.

- Niedrige Polygonzahl, damit das Modell auf dem iPhone schnell lädt.
- PBR-Materialien (Base Color + Normal Map) — gebackene Texturen liegen im jeweiligen `textures/`-Unterordner neben dem `.usdc`.
- Maßstab in Metern (Apple's USD-Pipeline erwartet metrische Einheiten — sonst erscheinen Modelle in der AR-Szene zu groß oder zu klein).

## 2. Export aus Blender als USDZ

`File → Export → Universal Scene Description (.usdz)`

Empfohlene Optionen:

- **Selection only**: nur das Mesh mit zugewiesenen Materialien exportieren.
- **Y-up**: AR Quick Look erwartet Y-up.
- **Materials**: aktiviert (sonst keine Texturen im Export).
- **Generated**: aktiviert, damit Texturen mit eingebettet werden.

Ergebnis: eine einzelne `.usdz`-Datei (intern ein **unkomprimiertes ZIP-Archiv**, das die `.usdc` und alle Texturen enthält).

### Wichtig: USDZ ist eine Datei, kein Ordner

In dieser Pipeline trat folgendes Problem auf: Beim ersten Export erschienen die `.usdz`-Dateien als **Verzeichnisse** mit `.usdc` + `textures/` darin. AR Quick Look kann das nicht verarbeiten — es erwartet eine **einzelne ZIP-Datei**.

Lösung: Die Dateien lagen tatsächlich auch als korrekte ZIP-Archive vor (`*.usdz.zip`), wir mussten lediglich die Endung in `.usdz` ändern und in `assets/models/` ablegen:

```bash
mv Feuerwehrhelm.usdz.zip assets/models/feuerwehrhelm.usdz
mv Gasmaske.usdz.zip      assets/models/gasmaske.usdz
mv Helm_gelb.usdz.zip     assets/models/helm_gelb.usdz
```

Verifikation, dass es ein gültiges USDZ ist:

```bash
file assets/models/helm_gelb.usdz
# → Zip archive data, compression method=store

unzip -l assets/models/helm_gelb.usdz
# → .usdc als erste Zeile, alle Einträge "Method: Stored"
```

Apple verlangt:
- **Stored** (unkomprimiert) für jeden Eintrag.
- Die `.usdc`-Datei muss als **erster Eintrag** im Archiv stehen.
- 64-Byte-Alignment der Dateidaten (in den meisten Fällen kein Problem; falls AR Quick Look zickt, hilft erneuter Export aus Blender oder Apples `usdzconvert`).

### Fallback: USDZ aus Verzeichnis selbst zippen

Falls erneut nur ein Verzeichnis statt einer Archivdatei vorliegt:

```bash
cd Feuerwehrhelm.usdz                               # in das exportierte Verzeichnis wechseln
zip -0 -X ../feuerwehrhelm.usdz \
    Feuerwehrhelm.usdc textures/*                  # .usdc zuerst — wichtig!
```

`-0` = keine Komprimierung; `-X` = keine Extra-Felder (z. B. Dateibesitzer).

## 3. Einbindung auf der Website

Datei nach `assets/models/<name>.usdz` legen, dann mit dem AR-Quick-Look-Anchor verlinken:

```html
<a rel="ar" href="assets/models/helm_gelb.usdz">
  <img src="assets/images/helm_gelb.svg" alt="">
  In AR ansehen
</a>
```

- iOS-Safari erkennt `rel="ar"` und öffnet AR Quick Look nativ — keine JavaScript-AR-Bibliothek nötig.
- Auf anderen Plattformen (Android, Desktop) wird der Link als normale Datei behandelt; das Bild bleibt sichtbar.
- Optional: `<img>`-Kindelement dient als Vorschau, die der Nutzer sieht, bevor AR Quick Look startet.

In `game.html` (Infobox) und `models.html` (Showroom) wird genau dieses Muster verwendet.

## 4. Deployment auf GitHub Pages

1. `git add` aller Webdateien (HTML/CSS/JS + `assets/`) + `git commit` + `git push`.
2. Repository Settings → **Pages** → Source: `main` Branch, Folder `/` (root).
3. Nach 1–2 Minuten ist die Seite live: `https://gt-ace.github.io/hci-group-3/`.

GitHub Pages liefert `.usdz` mit dem korrekten MIME-Type `model/vnd.usdz+zip` aus — keine zusätzliche Konfiguration nötig.

## 5. Test auf iPhone 13

1. Live-URL in Safari auf dem iPhone öffnen.
2. Durch das Spiel klicken — am Ende einer Runde auf **(i)** tippen.
3. In der Infobox auf **In AR ansehen** tippen → AR Quick Look startet, Modell wird im Raum platziert.
4. Alternativ direkt `models.html` aufrufen, um alle drei Modelle nacheinander zu testen.
5. Screenshots aufnehmen (Power + Volume Up) und in `docs/screenshots/` ablegen.

## Bekannte Stolpersteine

- **Drag-and-Drop auf iOS:** Die HTML5 Drag-API ist auf Mobile Safari unzuverlässig. Wir verwenden Pointer Events (`pointerdown` / `pointermove` / `pointerup`) und setzen `touch-action: none` auf das ziehbare Element, damit nicht versehentlich gescrollt wird.
- **AR Quick Look bricht ab:** Meist ein Hinweis auf ein nicht-konformes USDZ-Archiv (komprimiert, falsche Reihenfolge, Alignment). Mit `unzip -l` prüfen und ggf. neu erzeugen.
- **Leaderboard:** wird in `localStorage` gespeichert — pro Gerät separat. Für ein gemeinsames Leaderboard wäre ein Backend nötig.
