import * as THREE from "three";
import { USDZLoader } from "three/addons/loaders/USDZLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const loader = new USDZLoader();

export async function mountViewer(container, modelUrl, opts = {}) {
  const { autoRotate = true, controls = true, background = null } = opts;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !background });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  if (background) renderer.setClearColor(background, 1);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b6b6b, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2, 3, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe6c2, 0.55);
  fill.position.set(-3, 1, -2);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  camera.position.set(0, 0, 3);

  let orbit;
  if (controls) {
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.enablePan = false;
    orbit.minDistance = 0.6;
    orbit.maxDistance = 6;
    orbit.autoRotate = autoRotate;
    orbit.autoRotateSpeed = 1.2;
  }

  const model = await new Promise((resolve, reject) => {
    loader.load(modelUrl, resolve, undefined, reject);
  });

  // Center + scale to fit
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const fit = 1.6 / size;
  model.scale.multiplyScalar(fit);
  scene.add(model);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  function loop() {
    if (orbit) orbit.update();
    else if (autoRotate) model.rotation.y += 0.006;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  let raf = requestAnimationFrame(loop);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
    },
  };
}

// Render a static thumbnail (data URL) of a model — used for game dock.
const thumbCache = new Map();
export async function renderThumbnail(modelUrl, size = 256) {
  if (thumbCache.has(modelUrl)) return thumbCache.get(modelUrl);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setSize(size, size);
  renderer.setPixelRatio(2);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b6b6b, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2, 3, 4);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  camera.position.set(0.6, 0.4, 2.6);
  camera.lookAt(0, 0, 0);

  const model = await new Promise((resolve, reject) => {
    loader.load(modelUrl, resolve, undefined, reject);
  });

  const box = new THREE.Box3().setFromObject(model);
  const s = box.getSize(new THREE.Vector3()).length();
  const c = box.getCenter(new THREE.Vector3());
  model.position.sub(c);
  model.scale.multiplyScalar(1.6 / s);
  scene.add(model);

  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  renderer.dispose();
  thumbCache.set(modelUrl, url);
  return url;
}
