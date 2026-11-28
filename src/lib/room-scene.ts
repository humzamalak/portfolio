// Home page room: a small office you can move through. The desk holds the portfolio, the rack
// holds the repositories, the door goes to the on-call game. The room model is made in Blender
// (scripts/blender/room.py -> public/room/room.glb). No React in this file.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type SpotId = "desk" | "server" | "door";
export type RoomCallbacks = { onNear: (spot: SpotId | null) => void; onArrive: (spot: SpotId) => void };
export type RoomController = {
  setMove: (x: number, z: number) => void; // touch stick, each value -1 to 1
  goTo: (spot: SpotId) => void; // the robot drives there by itself
  place: (spot: SpotId) => void; // put the robot at a spot, with no drive
  focus: (spot: SpotId | null) => void; // move the camera close to a spot, or back to the room view
  setRackDown: (down: boolean) => void;
  setLights: (on: boolean) => void; // room lights: on = day, off = night (the start state)
  dispose: () => void;
};

// Where the robot stops for each object, and where the camera goes when the object is in use.
const SPOTS: Record<SpotId, { stand: [number, number]; face: number; marker: [number, number, number]; camera: [number, number, number]; look: [number, number, number] }> = {
  desk: { stand: [-2.2, -1.1], face: Math.PI, marker: [-2.2, 2.25, -2.5], camera: [-1.5, 1.75, 0.3], look: [-1.1, 1.15, -2.6] },
  server: { stand: [2.7, -1.05], face: Math.PI, marker: [2.7, 2.75, -2.4], camera: [2.2, 1.7, 1.5], look: [3.5, 1.05, -2.5] },
  door: { stand: [-3.0, 1.0], face: -Math.PI / 2, marker: [-3.75, 3.0, 1.0], camera: [-0.6, 1.8, 0.7], look: [-4.0, 1.2, 0.1] },
};
const BOXES: [number, number, number, number][] = [ // xMin, xMax, zMin, zMax, already made larger by the robot radius
  [-3.75, -0.65, -3.2, -1.55], // desk
  [-4.2, -3.15, -2.8, -0.35], // bookshelf
  [1.85, 3.55, -3.2, -1.55], // rack
  [-0.9, 0.2, -2.9, -1.75], // chair
  [3.05, 4.0, -2.0, -1.0], // plant
  [3.15, 4.0, -0.15, 0.6], // floor lamp
];
const BOUNDS = { xMin: -3.5, xMax: 3.5, zMin: -2.55, zMax: 2.55 };
const REACH = 0.9;
const RED = new THREE.Color(0xff2a1a), GREEN = new THREE.Color(0x19ff7a), AMBER = new THREE.Color(0xffa31a), CYAN = new THREE.Color(0x33ccff);

export async function createRoom(canvas: HTMLCanvasElement, callbacks: RoomCallbacks, reducedMotion: boolean): Promise<RoomController> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a12);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment; scene.environmentIntensity = 0.18;
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.5, 0.93));
  composer.addPass(new OutputPass());

  // Lights: cool light from the open side, warm light from the two lamps, blue from the window
  const ambient = new THREE.HemisphereLight(0x9fb6ff, 0x1a120c, 0.4);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xcdd9ff, 1.05);
  key.position.set(5, 9, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 }); key.shadow.bias = -0.0015;
  scene.add(key);
  const deskLamp = new THREE.PointLight(0xffa050, 4, 6, 1.6); deskLamp.position.set(-1.7, 1.45, -2.3); scene.add(deskLamp);
  const floorLamp = new THREE.PointLight(0xffb070, 5, 7, 1.6); floorLamp.position.set(3.4, 1.6, 0.3); scene.add(floorLamp);
  const screenGlow = new THREE.PointLight(0x35ff8a, 1.5, 4, 1.8); screenGlow.position.set(-2.2, 1.4, -2.0); scene.add(screenGlow);
  const rackGlow = new THREE.PointLight(0x19ff7a, 3, 5, 1.8); rackGlow.position.set(2.7, 1.3, -1.6); scene.add(rackGlow);

  const loader = new GLTFLoader();
  const [roomFile, robotFile] = await Promise.all([loader.loadAsync("/room/room.glb"), loader.loadAsync("/lab/robot.glb")]);
  const materials: Record<string, THREE.MeshStandardMaterial> = {};
  roomFile.scene.traverse(node => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.receiveShadow = true; mesh.castShadow = true;
    const material = mesh.material as THREE.MeshStandardMaterial;
    materials[material.name] = material;
    if (material.emissiveIntensity > 0 && material.emissive.getHex() !== 0) mesh.castShadow = false;
  });
  // Blender emission values are too strong for the bloom pass here: set each one.
  const glow: Record<string, number> = { screen: 0.55, glyph: 1.5, window: 0.6, city: 1.5, lamp: 2.4, poster_text: 0.9, door_sign: 1.6 };
  for (const [name, value] of Object.entries(glow)) if (materials[name]) materials[name].emissiveIntensity = value;
  scene.add(roomFile.scene);

  const robot = new THREE.Group();
  robotFile.scene.traverse(node => { const mesh = node as THREE.Mesh; if (mesh.isMesh) mesh.castShadow = true; });
  robot.add(robotFile.scene); robot.scale.setScalar(0.72);
  robot.position.set(0.6, 0, 1.3); robot.rotation.y = Math.PI * 0.85;
  scene.add(robot);

  // A marker above each object you can use
  const markerGeometry = new THREE.OctahedronGeometry(0.11);
  const markers = (Object.keys(SPOTS) as SpotId[]).map(id => {
    const mesh = new THREE.Mesh(markerGeometry, new THREE.MeshBasicMaterial({ color: 0xffb21f }));
    mesh.position.set(...SPOTS[id].marker); scene.add(mesh);
    return { id, mesh, base: SPOTS[id].marker[1] };
  });

  // Input
  const keys = new Set<string>();
  const stick = { x: 0, z: 0 };
  let target: SpotId | null = null;
  let driveTime = 0; // seconds since the automatic drive started
  let focused: SpotId | null = null;
  let rackDown = false;
  const typing = (event: KeyboardEvent) => ["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement)?.tagName);
  const onKeyDown = (event: KeyboardEvent) => {
    if (typing(event) || event.metaKey || event.ctrlKey || event.altKey) return;
    const k = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) { keys.add(k); target = null; if (k.startsWith("arrow") && !focused) event.preventDefault(); }
  };
  const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  const onBlur = () => keys.clear();
  window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp); window.addEventListener("blur", onBlur);

  const resize = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false); composer.setSize(width, height);
    camera.aspect = width / height; camera.fov = width < height ? 62 : 36; camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize();

  const free = (x: number, z: number) => {
    if (x < BOUNDS.xMin || x > BOUNDS.xMax || z < BOUNDS.zMin || z > BOUNDS.zMax) return false;
    for (const [x0, x1, z0, z1] of BOXES) if (x > x0 && x < x1 && z > z0 && z < z1) return false;
    return true;
  };

  let disposed = false, frame = 0, near: SpotId | null = null;
  const clock = new THREE.Clock();
  const cameraGoal = new THREE.Vector3(), lookGoal = new THREE.Vector3(), look = new THREE.Vector3(-0.3, 0.9, -0.8);
  camera.position.set(8.5, 9, 11);

  const step = () => {
    if (disposed) return;
    frame = requestAnimationFrame(step);
    const dt = Math.min(0.05, Math.max(0, clock.getDelta()));
    const time = clock.elapsedTime;

    // Movement: keys and the touch stick, or the automatic drive to a spot
    let mx = stick.x, mz = stick.z;
    if (!focused) {
      if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
      if (keys.has("d") || keys.has("arrowright")) mx += 1;
      if (keys.has("w") || keys.has("arrowup")) mz -= 1;
      if (keys.has("s") || keys.has("arrowdown")) mz += 1;
    }
    if (Math.hypot(stick.x, stick.z) > 0.1) target = null;
    let arrived: SpotId | null = null;
    if (target && Math.hypot(mx, mz) < 0.08) {
      const [tx, tz] = SPOTS[target].stand;
      const dx = tx - robot.position.x, dz = tz - robot.position.z, distance = Math.hypot(dx, dz);
      driveTime += dt;
      // The drive always arrives: if the way is blocked or too long, the robot is put at the spot.
      if (distance < 0.12 || driveTime > 4) { robot.position.x = tx; robot.position.z = tz; arrived = target; target = null; } else { mx = dx / distance; mz = dz / distance; }
    }
    const length = Math.hypot(mx, mz);
    if (length > 0.08) {
      const scale = (Math.min(1, length) / length) * 3.4 * dt;
      const nx = robot.position.x + mx * scale, nz = robot.position.z + mz * scale;
      const movedX = free(nx, robot.position.z); if (movedX) robot.position.x = nx;
      const movedZ = free(robot.position.x, nz); if (movedZ) robot.position.z = nz;
      // The automatic drive goes round an object: slide along the free axis.
      if (target && !movedX && !movedZ) driveTime = 99;
      let delta = Math.atan2(mx, mz) - robot.rotation.y;
      while (delta > Math.PI) delta -= Math.PI * 2; while (delta < -Math.PI) delta += Math.PI * 2;
      robot.rotation.y += delta * Math.min(1, dt * 10);
      robot.position.y = Math.abs(Math.sin(time * 18)) * 0.012;
    }
    if (arrived) {
      let delta = SPOTS[arrived].face - robot.rotation.y;
      while (delta > Math.PI) delta -= Math.PI * 2; while (delta < -Math.PI) delta += Math.PI * 2;
      robot.rotation.y += delta;
      callbacks.onArrive(arrived);
    }

    // Which spot is in reach
    let best: SpotId | null = null, bestDistance = REACH;
    for (const id of Object.keys(SPOTS) as SpotId[]) { const d = Math.hypot(robot.position.x - SPOTS[id].stand[0], robot.position.z - SPOTS[id].stand[1]); if (d < bestDistance) { best = id; bestDistance = d; } }
    if (best !== near) { near = best; callbacks.onNear(best); }
    markers.forEach(marker => {
      marker.mesh.position.y = marker.base + (reducedMotion ? 0 : Math.sin(time * 2 + marker.base) * 0.06);
      marker.mesh.rotation.y = reducedMotion ? 0 : time * 1.5;
      marker.mesh.scale.setScalar(marker.id === near ? 1.5 : 1);
      marker.mesh.visible = !focused;
    });

    // Rack state
    const blink = 1.7 + Math.sin(time * 9) * 1.1;
    if (materials.led_ok) { materials.led_ok.emissive.copy(rackDown ? RED : GREEN); materials.led_ok.emissiveIntensity = rackDown ? blink : 1.2; }
    if (materials.led_warn) { materials.led_warn.emissive.copy(rackDown ? RED : AMBER); materials.led_warn.emissiveIntensity = rackDown ? blink : 1.2; }
    if (materials.strip) { materials.strip.emissive.copy(rackDown ? RED : CYAN); materials.strip.emissiveIntensity = rackDown ? blink : 1.4; }
    rackGlow.color.copy(rackDown ? RED : GREEN); rackGlow.intensity = rackDown ? 6 + Math.sin(time * 9) * 4 : 1.5;
    if (materials.door_sign) materials.door_sign.emissiveIntensity = reducedMotion ? 1.6 : 1.6 + Math.sin(time * 3) * 0.5;

    // Camera: the whole room, with a small follow of the robot, or close to the object in use
    const portrait = camera.aspect < 1;
    if (focused) { cameraGoal.set(...SPOTS[focused].camera); lookGoal.set(...SPOTS[focused].look); if (portrait) cameraGoal.z += 1.2; }
    else if (portrait) { cameraGoal.set(robot.position.x * 0.8 + 1.0, 5.2, robot.position.z * 0.5 + 6.4); lookGoal.set(robot.position.x * 0.8, 0.5, robot.position.z * 0.5 - 0.6); }
    else { cameraGoal.set(5.6 + robot.position.x * 0.12, 5.6, 8.2 + robot.position.z * 0.12); lookGoal.set(-0.2 + robot.position.x * 0.12, 0.75, -0.5 + robot.position.z * 0.1); }
    const blend = reducedMotion ? 1 : Math.min(1, dt * 2.6);
    camera.position.lerp(cameraGoal, blend); look.lerp(lookGoal, blend);
    camera.lookAt(look);
    composer.render();
  };
  frame = requestAnimationFrame(step);

  return {
    setMove: (x, z) => { stick.x = x; stick.z = z; },
    goTo: spot => { target = spot; driveTime = 0; },
    place: spot => { target = null; robot.position.x = SPOTS[spot].stand[0]; robot.position.z = SPOTS[spot].stand[1]; robot.rotation.y = SPOTS[spot].face; },
    focus: spot => { focused = spot; if (spot) target = null; },
    setRackDown: down => { rackDown = down; },
    setLights: on => { ambient.intensity = on ? 1.3 : 0.4; key.intensity = on ? 1.8 : 1.05; (scene.background as THREE.Color).set(on ? 0x2a3140 : 0x070a12); },
    dispose: () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", onBlur);
      scene.traverse(node => {
        const mesh = node as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(material) ? material : material ? [material] : []).forEach(item => item.dispose());
      });
      environment.dispose(); composer.dispose(); renderer.dispose();
    },
  };
}
