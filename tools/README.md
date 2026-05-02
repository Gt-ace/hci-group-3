# tools/

## `export_glb.py` — make `.glb` siblings to the `.usdz` files

iOS Safari renders our `.usdz` natively via AR Quick Look (this works today).
For **inline 3D rendering on the website itself** (drag-to-rotate viewer in the
AR Showroom), we additionally need `.glb` versions, because every battle-tested
web 3D viewer (`<model-viewer>`, Three.js GLTFLoader, Babylon.js) speaks glTF —
none of them parse Blender's binary USDC reliably.

### Run it

From the repo root, with Blender installed (3.x or 4.x — both work):

```bash
blender --background --python tools/export_glb.py
```

You should see something like:

```
== helm_gelb: importing .../assets/models/helm_gelb.usdz
   exporting .../assets/models/helm_gelb.glb
   wrote 4128 KB
…
Done.
```

### After it runs

Three new files appear next to the USDZ archives:

```
assets/models/helm_gelb.glb
assets/models/feuerwehrhelm.glb
assets/models/gasmaske.glb
```

Commit them and push. As soon as they're live on GitHub Pages, ping me and I'll
swap the AR Showroom over to `<model-viewer>` so the cards show real
drag-to-rotate 3D in any browser, with AR Quick Look still launching on iOS.

### If Blender isn't installed

- macOS / Windows: download from <https://www.blender.org/download/>.
- Ubuntu / Debian: `sudo apt install blender` (or `sudo snap install blender --classic`).
- Windows + WSL: install on Windows side and run the script from a Windows shell —
  paths in the script are derived from its own location, so it works from either side.

### Manual fallback (Blender GUI)

If you prefer the menu route, do this for each `.usdz`:

1. **File → New → General** (empty scene)
2. **File → Import → Universal Scene Description (.usdz)** → pick the file
3. **File → Export → glTF 2.0 (.glb)** → save next to the `.usdz` with the same name
4. Repeat for the other two models
