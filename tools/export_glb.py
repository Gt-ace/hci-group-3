"""Convert each 3D source asset (USDZ or .blend) to .glb for inline web viewing.

Run from Blender (headless or GUI):

    blender --background --python tools/export_glb.py

The script writes assets/models/{helm_gelb,feuerwehrhelm,gasmaske}.glb
next to the existing .usdz files. Once the .glb files are committed and
deployed, the AR Showroom (models.html) will render real 3D inline via
<model-viewer> while iOS continues to use the .usdz for AR Quick Look.
"""

import bpy
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "models")

JOBS = [
    {
        "name": "helm_gelb",
        "usdz": os.path.join(ROOT, "assets", "models", "helm_gelb.usdz"),
    },
    {
        "name": "feuerwehrhelm",
        "usdz": os.path.join(ROOT, "assets", "models", "feuerwehrhelm.usdz"),
    },
    {
        "name": "gasmaske",
        "usdz": os.path.join(ROOT, "assets", "models", "gasmaske.usdz"),
    },
]


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_usdz(path):
    bpy.ops.wm.usd_import(filepath=path)


def export_glb(out_path):
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        export_apply=True,
        export_yup=True,
        export_image_format="AUTO",
        export_materials="EXPORT",
    )


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for job in JOBS:
        if not os.path.exists(job["usdz"]):
            print(f"SKIP {job['name']}: {job['usdz']} not found")
            continue
        reset_scene()
        print(f"== {job['name']}: importing {job['usdz']}")
        import_usdz(job["usdz"])
        out = os.path.join(OUT_DIR, f"{job['name']}.glb")
        print(f"   exporting {out}")
        export_glb(out)
        print(f"   wrote {os.path.getsize(out) / 1024:.0f} KB")
    print("Done.")


if __name__ == "__main__":
    main()
