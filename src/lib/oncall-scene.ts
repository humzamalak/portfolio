// "On call" test game: a repair robot in a small data centre. One rack for each public repository.
// The rack and robot models are made in Blender (public/lab/*.glb). No React in this file.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type RackInfo = { id: string; title: string; language: string; pushed: string };
export type Near = { index: number; down: boolean } | null;
export type OnCallCallbacks = {
  onNear: (near: Near) => void;
  onProgress: (value: number) => void; // 0 to 1 while a repair is in progress
  onStats: (stats: { fixed: number; open: number }) => void;
  onIncident: (index: number) => void;
  onFixed: (index: number) => void;
};
export type OnCallController = {
  start: () => void;
  setMove: (x: number, z: number) => void; // touch stick, each value -1 to 1
  setRepair: (held: boolean) => void;
  dispose: () => void;
};

const LANGUAGE_COLOURS: Record<string, number> = {
  TypeScript: 0x4aa8ff, JavaScript: 0xf5c542, Python: 0x5ad1a0, HCL: 0xa78bfa, Shell: 0x7ee081, Go: 0x4dd6e8, Dockerfile: 0x58a6ff, Docs: 0x9aa3b5,
};
const RED = new THREE.Color(0xff2a1a);
const GREEN = new THREE.Color(0x19ff7a);
const AMBER = new THREE.Color(0xffa31a);
const SPACING = 2.3;
const REPAIR_SECONDS = 1.6;
const REACH = 1.5;

type Rack = {
  group: THREE.Group; front: THREE.Vector3; down: boolean; stale: boolean; colour: THREE.Color;
  ok: THREE.MeshStandardMaterial; warn: THREE.MeshStandardMaterial; strip: THREE.MeshStandardMaterial; label: THREE.Mesh;
};

function labelTexture(text: string, colour: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(6,9,14,0.92)"; ctx.fillRect(0, 0, 512, 96);
  ctx.fillStyle = colour; ctx.fillRect(0, 0, 10, 96);
  ctx.fillStyle = "#e9ecf3"; ctx.font = "600 40px 'DM Mono', ui-monospace, monospace"; ctx.textBaseline = "middle";
  let shown = text;
  while (ctx.measureText(shown).width > 470 && shown.length > 4) shown = shown.slice(0, -2);
  ctx.fillText(shown === text ? text : `${shown}…`, 28, 50);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export async function createOnCall(canvas: HTMLCanvasElement, racksInfo: RackInfo[], callbacks: OnCallCallbacks, reducedMotion: boolean): Promise<OnCallController> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04060b);
  scene.fog = new THREE.Fog(0x04060b, 14, 34);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment; scene.environmentIntensity = 0.45;
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.5, 0.86);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Room
  const perRow = Math.ceil(racksInfo.length / 2);
  const halfWidth = ((perRow - 1) * SPACING) / 2;
  const bounds = { x: halfWidth + 3.2, zMin: -4.0, zMax: 5.2 };
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x0b0f17, roughness: 0.35, metalness: 0.5 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const grid = new THREE.GridHelper(80, 66, 0x1d5b8a, 0x10263a);
  (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.55; grid.position.y = 0.005; scene.add(grid);
  const lane = new THREE.Mesh(new THREE.PlaneGeometry(halfWidth * 2 + 5.4, 0.06), new THREE.MeshBasicMaterial({ color: 0x2aa5ff }));
  for (const z of [-3.2, 1.8]) { const strip = lane.clone(); strip.rotation.x = -Math.PI / 2; strip.position.set(0, 0.01, z); scene.add(strip); }
  scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x05070c, 0.55));
  const key = new THREE.DirectionalLight(0xbfd4ff, 1.1); key.position.set(4, 10, 6); scene.add(key);
  const fill = new THREE.PointLight(0x3aa0ff, 22, 22); fill.position.set(0, 5, -2.5); scene.add(fill);
  const alarmLights = [new THREE.PointLight(0xff2a1a, 0, 9), new THREE.PointLight(0xff2a1a, 0, 9)];
  alarmLights.forEach(light => scene.add(light));

  // Dust in the air
  const dustGeometry = new THREE.BufferGeometry();
  const dust = new Float32Array(260 * 3);
  for (let i = 0; i < 260; i++) { dust[i * 3] = (Math.random() - 0.5) * 26; dust[i * 3 + 1] = Math.random() * 5; dust[i * 3 + 2] = (Math.random() - 0.5) * 18; }
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPoints = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x6fb8ff, size: 0.035, transparent: true, opacity: 0.55 }));
  scene.add(dustPoints);

  // Models
  const loader = new GLTFLoader();
  const [rackFile, robotFile] = await Promise.all([loader.loadAsync("/lab/rack.glb"), loader.loadAsync("/lab/robot.glb")]);
  const now = Date.now();
  const racks: Rack[] = racksInfo.map((info, index) => {
    const row = index < perRow ? 0 : 1;
    const column = row === 0 ? index : index - perRow;
    const count = row === 0 ? perRow : racksInfo.length - perRow;
    const group = new THREE.Group();
    const model = rackFile.scene.clone(true);
    const colour = new THREE.Color(LANGUAGE_COLOURS[info.language] ?? 0x9aa3b5);
    const stale = now - new Date(info.pushed).getTime() > 240 * 86400000;
    const made: Partial<Rack> = {};
    model.traverse(node => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const source = mesh.material as THREE.MeshStandardMaterial;
      if (source.name === "led_ok" || source.name === "led_warn" || source.name === "strip") {
        const copy = source.clone();
        mesh.material = copy;
        if (source.name === "led_ok") made.ok = copy; else if (source.name === "led_warn") made.warn = copy; else made.strip = copy;
      }
    });
    group.add(model);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.3), new THREE.MeshBasicMaterial({ map: labelTexture(info.title, `#${colour.getHexString()}`), transparent: true }));
    label.position.set(0, 2.55, 0.35); label.rotation.x = -0.35; group.add(label);
    group.position.set((column - (count - 1) / 2) * SPACING, 0, row === 0 ? -5 : 0);
    scene.add(group);
    return { group, front: new THREE.Vector3(group.position.x, 0, group.position.z + 1.35), down: false, stale, colour, ok: made.ok!, warn: made.warn!, strip: made.strip!, label };
  });
  const paint = (rack: Rack, time: number) => {
    if (rack.down) {
      const blink = 1.8 + Math.sin(time * 9) * 1.2;
      for (const material of [rack.ok, rack.warn, rack.strip]) { material.emissive.copy(RED); material.emissiveIntensity = blink; }
    } else {
      const level = rack.stale ? 0.35 : 1.5;
      rack.ok.emissive.copy(GREEN); rack.ok.emissiveIntensity = level;
      rack.warn.emissive.copy(AMBER); rack.warn.emissiveIntensity = level;
      rack.strip.emissive.copy(rack.colour); rack.strip.emissiveIntensity = rack.stale ? 0.5 : 2;
    }
  };

  const robot = new THREE.Group();
  robot.add(robotFile.scene);
  let beacon: THREE.MeshStandardMaterial | undefined;
  robotFile.scene.traverse(node => { const mesh = node as THREE.Mesh; if (mesh.isMesh && (mesh.material as THREE.Material).name === "beacon") beacon = mesh.material as THREE.MeshStandardMaterial; });
  robot.position.set(0, 0, 3.4); robot.rotation.y = Math.PI;
  scene.add(robot);
  const headlight = new THREE.SpotLight(0xcfe6ff, 40, 9, 0.5, 0.6); headlight.position.set(0, 0.9, 0.3); headlight.target.position.set(0, 0.2, 4); robot.add(headlight, headlight.target);

  // Input
  const keys = new Set<string>();
  const stick = { x: 0, z: 0 };
  let repairHeld = false;
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.target as HTMLElement)?.tagName === "INPUT") return;
    const k = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "e"].includes(k)) { keys.add(k); if (k.startsWith("arrow") || k === " ") event.preventDefault(); }
  };
  const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  const onBlur = () => keys.clear();
  window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp); window.addEventListener("blur", onBlur);

  const resize = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false); composer.setSize(width, height);
    camera.aspect = width / height; camera.fov = width < height ? 58 : 42; camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize();

  // Game state
  let running = false, disposed = false, frame = 0;
  let fixed = 0, progress = 0, nextIncident = 3.5, intro = reducedMotion ? 1 : 0;
  let nearIndex = -2, nearDown = false;
  const clock = new THREE.Clock();
  const cameraGoal = new THREE.Vector3(), lookGoal = new THREE.Vector3(), look = new THREE.Vector3(0, 1, -2);
  camera.position.set(0, 13, 17);
  const stats = () => callbacks.onStats({ fixed, open: racks.filter(rack => rack.down).length });

  const step = () => {
    if (disposed) return;
    frame = requestAnimationFrame(step);
    const dt = Math.min(0.05, Math.max(0, clock.getDelta()));
    const time = clock.elapsedTime;

    if (running) {
      let mx = stick.x, mz = stick.z;
      if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
      if (keys.has("d") || keys.has("arrowright")) mx += 1;
      if (keys.has("w") || keys.has("arrowup")) mz -= 1;
      if (keys.has("s") || keys.has("arrowdown")) mz += 1;
      const length = Math.hypot(mx, mz);
      if (length > 0.08) {
        const scale = Math.min(1, length) / length * 4.6 * dt;
        const tryMove = (x: number, z: number) => {
          if (Math.abs(x) > bounds.x || z < bounds.zMin || z > bounds.zMax) return false;
          for (const rack of racks) if (Math.abs(x - rack.group.position.x) < 0.85 && Math.abs(z - rack.group.position.z) < 1.0) return false;
          return true;
        };
        const nx = robot.position.x + mx * scale, nz = robot.position.z + mz * scale;
        if (tryMove(nx, robot.position.z)) robot.position.x = nx;
        if (tryMove(robot.position.x, nz)) robot.position.z = nz;
        const target = Math.atan2(mx, mz);
        let delta = target - robot.rotation.y;
        while (delta > Math.PI) delta -= Math.PI * 2; while (delta < -Math.PI) delta += Math.PI * 2;
        robot.rotation.y += delta * Math.min(1, dt * 10);
        robot.position.y = Math.abs(Math.sin(time * 18)) * 0.015;
      }

      // Incidents
      nextIncident -= dt;
      const open = racks.filter(rack => rack.down).length;
      if (nextIncident <= 0 && open < 2) {
        const candidates = racks.map((rack, index) => ({ rack, index })).filter(item => !item.rack.down && item.index !== nearIndex);
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        if (pick) { pick.rack.down = true; callbacks.onIncident(pick.index); stats(); nearIndex = -2; }
        nextIncident = 8 + Math.random() * 6;
      }

      // Nearest rack front
      let best = -1, bestDistance = REACH;
      racks.forEach((rack, index) => { const d = Math.hypot(robot.position.x - rack.front.x, robot.position.z - rack.front.z); if (d < bestDistance) { best = index; bestDistance = d; } });
      const bestDown = best >= 0 && racks[best].down;
      if (best !== nearIndex || bestDown !== nearDown) { nearIndex = best; nearDown = bestDown; progress = 0; callbacks.onProgress(0); callbacks.onNear(best >= 0 ? { index: best, down: bestDown } : null); }
      const holding = repairHeld || keys.has("e") || keys.has(" ");
      if (best >= 0 && bestDown && holding) {
        progress += dt / REPAIR_SECONDS; callbacks.onProgress(Math.min(1, progress));
        if (progress >= 1) { racks[best].down = false; fixed += 1; progress = 0; callbacks.onProgress(0); callbacks.onFixed(best); stats(); nearDown = false; callbacks.onNear({ index: best, down: false }); }
      } else if (progress > 0) { progress = Math.max(0, progress - dt * 1.5); callbacks.onProgress(progress); }
      if (beacon) beacon.emissiveIntensity = best >= 0 && bestDown && holding ? 4 + Math.sin(time * 30) * 4 : 2;
    }

    racks.forEach(rack => paint(rack, time));
    const downRacks = racks.filter(rack => rack.down);
    alarmLights.forEach((light, i) => {
      const rack = downRacks[i];
      if (rack) { light.position.set(rack.front.x, 1.6, rack.front.z - 0.4); light.intensity = 14 + Math.sin(time * 9) * 10; } else light.intensity = 0;
    });
    dustPoints.rotation.y = time * 0.01;

    // Camera: fly in at the start, then follow the robot
    if (running && intro < 1) intro = Math.min(1, intro + dt / 2.2);
    const ease = intro * intro * (3 - 2 * intro);
    const portrait = camera.aspect < 1;
    cameraGoal.set(robot.position.x * 0.85, portrait ? 6.4 : 4.8, robot.position.z + (portrait ? 7.0 : 6.6));
    lookGoal.set(robot.position.x * 0.95, 1.0, robot.position.z - 1.6);
    if (running) {
      const blend = reducedMotion ? 1 : Math.min(1, dt * (1.2 + ease * 3));
      camera.position.lerp(cameraGoal, blend); look.lerp(lookGoal, blend);
    } else if (!reducedMotion) { camera.position.x = Math.sin(time * 0.15) * 3; }
    camera.lookAt(look);
    composer.render();
  };
  racks.forEach(rack => paint(rack, 0));
  frame = requestAnimationFrame(step);

  return {
    start: () => { running = true; },
    setMove: (x, z) => { stick.x = x; stick.z = z; },
    setRepair: held => { repairHeld = held; },
    dispose: () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", onBlur);
      scene.traverse(node => {
        const mesh = node as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(material) ? material : material ? [material] : []).forEach(item => { (item as THREE.MeshBasicMaterial).map?.dispose(); item.dispose(); });
      });
      environment.dispose(); composer.dispose(); renderer.dispose();
    },
  };
}
