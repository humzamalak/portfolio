import * as THREE from "three";

// The 3D server rack on the home page. This file has no React code: the component in
// src/components/rack-stage.tsx loads it only in the browser and talks to it through RackController.
//
// Layout, top to bottom: patch panel, one server for each case study, console drawer,
// tape library (one tape for each public repository), power unit.

export type RackServer = { id: string; title: string; category: string };
export type RackTape = { id: string; name: string; language: string };
export type RackData = { servers: RackServer[]; tapes: RackTape[] };
export type RackCallbacks = {
  onSelect: (id: string | null) => void; // "server:<id>", "tape:<id>", "console" or null
  onHover: (label: string | null) => void;
};
export type RackController = {
  select: (id: string | null) => void;
  setDown: (serverId: string, down: boolean) => void;
  setLights: (on: boolean) => void;
  dispose: () => void;
};

const U = 0.22; // height of one rack unit in scene units
const WIDTH = 1.9;
const DEPTH = 1.5;
const FRONT = DEPTH / 2;
const GREEN = 0x3ddc84, RED = 0xff5a4d, AMBER = 0xffb224;
const LANGUAGE_COLORS: Record<string, string> = { Shell: "#3ddc84", Python: "#5aa9ff", TypeScript: "#ffb224", JavaScript: "#ffe066", HCL: "#c792ea", Docs: "#9aa7b6" };
const CABLE_COLORS = [0xffb224, 0x5aa9ff, 0x3ddc84, 0xff7eb6, 0xc792ea, 0xffe066];

type Part = {
  id: string; label: string; group: THREE.Group; pullOut: number; // how far it slides out when selected
  hit: THREE.Mesh; led?: THREE.MeshBasicMaterial; down?: boolean;
};

// Draw a label with the 2D canvas API and use it as a texture. This avoids loading 3D fonts.
function labelTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d")!;
  draw(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function fitText(context: CanvasRenderingContext2D, text: string, maxWidth: number, size: number, weight = 700) {
  do { context.font = `${weight} ${size}px "Space Grotesk", "Helvetica Neue", Arial, sans-serif`; size -= 2; } while (context.measureText(text).width > maxWidth && size > 30);
}

function facePlate(width: number, height: number, texture: THREE.Texture) {
  // The label also glows a little (emissiveMap), so it stays readable when the room lights are off.
  const material = new THREE.MeshStandardMaterial({ map: texture, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.55, roughness: 0.6, metalness: 0.2 });
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

export function createRack(canvas: HTMLCanvasElement, data: RackData, callbacks: RackCallbacks, reducedMotion: boolean): RackController {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const dark = new THREE.Color(0x0b0e12), light = new THREE.Color(0xc9ced4);
  scene.background = dark.clone();
  scene.fog = new THREE.Fog(scene.background.getHex(), 9, 20);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 6);
  const rim = new THREE.PointLight(AMBER, 14, 9);
  rim.position.set(-3, 1.5, 2.5);
  scene.add(ambient, key, rim);

  const rack = new THREE.Group();
  scene.add(rack);
  const metal = new THREE.MeshStandardMaterial({ color: 0x151a21, roughness: 0.55, metalness: 0.6 });
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1f262f, roughness: 0.7, metalness: 0.4 });
  const parts: Part[] = [];
  const packets: { mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; t: number; speed: number; serverId: string }[] = [];

  const serverU = 2, tapeU = 4;
  const totalU = 1 + data.servers.length * serverU + 1 + tapeU + 2;
  const height = totalU * U;
  let cursorY = height / 2; // top of the next unit
  const place = (units: number) => { const y = cursorY - (units * U) / 2; cursorY -= units * U; return y; };

  // Frame: four posts, a top and a base.
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, height + 0.24, 0.09), metal);
    post.position.set(x * (WIDTH / 2 + 0.07), 0, z * (FRONT + 0.02));
    rack.add(post);
  }
  for (const y of [height / 2 + 0.09, -height / 2 - 0.09]) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(WIDTH + 0.23, 0.06, DEPTH + 0.13), metal);
    plate.position.y = y;
    rack.add(plate);
  }
  const back = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, height), new THREE.MeshStandardMaterial({ color: 0x0d1014, roughness: 1 }));
  back.position.z = -FRONT + 0.01;
  rack.add(back);

  function unit(id: string, label: string, units: number, texture: THREE.Texture, pullOut: number, depth = DEPTH - 0.06) {
    const group = new THREE.Group();
    const unitHeight = units * U - 0.02;
    group.position.y = place(units);
    const body = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, unitHeight, depth), bodyMaterial);
    body.position.z = FRONT - depth / 2 - 0.03;
    const face = facePlate(WIDTH, unitHeight, texture);
    face.position.z = FRONT - 0.028;
    group.add(body, face);
    rack.add(group);
    const part: Part = { id, label, group, pullOut, hit: face };
    face.userData.part = part;
    body.userData.part = part;
    parts.push(part);
    return { part, group, unitHeight };
  }

  function led(group: THREE.Group, x: number, y: number, color: number) {
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.02), material);
    mesh.position.set(x, y, FRONT - 0.015);
    group.add(mesh);
    return material;
  }

  // Patch panel (decoration, and the start of the cables).
  const portCount = Math.max(6, data.servers.length);
  const patch = unit("patch", "Patch panel", 1, labelTexture(1024, 108, c => {
    c.fillStyle = "#1b222b"; c.fillRect(0, 0, 1024, 108);
    c.fillStyle = "#8fa0b3"; c.font = '500 26px "DM Mono", monospace'; c.fillText("HM-01 · PATCH", 28, 64);
    for (let i = 0; i < 12; i++) { c.fillStyle = "#0b0e12"; c.fillRect(330 + i * 56, 34, 38, 40); }
  }), 0);
  parts.pop(); // the patch panel is not interactive
  patch.part.hit.userData.part = undefined;
  patch.group.children[0].userData.part = undefined;
  const patchY = patch.group.position.y;

  // One server for each case study.
  data.servers.forEach((server, index) => {
    const { part, group, unitHeight } = unit(`server:${server.id}`, server.title, serverU, labelTexture(1024, 226, c => {
      c.fillStyle = "#1b222b"; c.fillRect(0, 0, 1024, 226);
      c.strokeStyle = "#36414f"; c.lineWidth = 3; c.strokeRect(1.5, 1.5, 1021, 223);
      // Power button
      c.strokeStyle = "#ffb224"; c.lineWidth = 6; c.beginPath(); c.arc(84, 113, 36, -Math.PI * 0.3, Math.PI * 1.3); c.stroke();
      c.beginPath(); c.moveTo(84, 70); c.lineTo(84, 112); c.stroke();
      // Drive bays
      for (let i = 0; i < 4; i++) { c.fillStyle = "#242d38"; c.fillRect(160 + i * 30, 56, 20, 114); }
      c.fillStyle = "#8fa0b3"; c.font = '500 28px "DM Mono", monospace'; c.fillText(server.category.toUpperCase(), 310, 80);
      c.fillStyle = "#f2f5f8"; fitText(c, server.title, 690, 62); c.fillText(server.title, 310, 152);
    }), 0.95);
    part.led = led(group, WIDTH / 2 - 0.12, unitHeight / 2 - 0.09, GREEN);
    led(group, WIDTH / 2 - 0.2, unitHeight / 2 - 0.09, AMBER);

    // A cable from the patch panel to this server, with a packet of light that travels along it.
    const startX = -WIDTH / 2 + 0.72 + (index % portCount) * 0.105;
    const endY = group.position.y;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, patchY, FRONT),
      new THREE.Vector3(startX - 0.1, patchY - 0.12, FRONT + 0.22),
      new THREE.Vector3(-WIDTH / 2 - 0.16, (patchY + endY) / 2, FRONT + 0.2 + index * 0.03),
      new THREE.Vector3(-WIDTH / 2 - 0.1, endY, FRONT + 0.05),
    ]);
    const color = CABLE_COLORS[index % CABLE_COLORS.length];
    rack.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.013, 6), new THREE.MeshStandardMaterial({ color, roughness: 0.5 })));
    const packet = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    rack.add(packet);
    packets.push({ mesh: packet, curve, t: index * 0.23, speed: 0.22 + index * 0.04, serverId: server.id });
  });

  // Console drawer: a click puts the cursor in the terminal.
  unit("console", "Console drawer: use the terminal", 1, labelTexture(1024, 108, c => {
    c.fillStyle = "#11161c"; c.fillRect(0, 0, 1024, 108);
    c.strokeStyle = "#36414f"; c.lineWidth = 3; c.strokeRect(1.5, 1.5, 1021, 105);
    c.fillStyle = "#ffb224"; c.font = '500 34px "DM Mono", monospace'; c.fillText("$ console", 34, 68);
    c.fillStyle = "#8fa0b3"; c.font = '500 24px "DM Mono", monospace'; c.fillText("CLICK TO TYPE", 780, 64);
  }), 0.35);

  // Tape library: an open bay with one tape for each repository.
  const bayY = place(tapeU);
  const bayHeight = tapeU * U - 0.02;
  const bay = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, bayHeight, DEPTH - 0.06), new THREE.MeshStandardMaterial({ color: 0x0d1014, roughness: 1, side: THREE.BackSide }));
  bay.position.set(0, bayY, -0.03);
  rack.add(bay);
  const tapeWidth = Math.min(0.17, (WIDTH - 0.14) / data.tapes.length - 0.02);
  const tapeHeight = bayHeight - 0.16;
  data.tapes.forEach((tape, index) => {
    const group = new THREE.Group();
    const span = (tapeWidth + 0.02) * data.tapes.length - 0.02;
    group.position.set(-span / 2 + tapeWidth / 2 + index * (tapeWidth + 0.02), bayY - 0.03, 0);
    const stripe = LANGUAGE_COLORS[tape.language] ?? LANGUAGE_COLORS.Docs;
    const texture = labelTexture(128, 512, c => {
      c.fillStyle = "#e9e4d6"; c.fillRect(0, 0, 128, 512);
      c.fillStyle = stripe; c.fillRect(0, 0, 128, 54);
      c.save(); c.translate(82, 486); c.rotate(-Math.PI / 2);
      c.fillStyle = "#14181d"; fitText(c, tape.name, 410, 40, 600); c.fillText(tape.name, 0, 0);
      c.restore();
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(tapeWidth, tapeHeight, 0.62), new THREE.MeshStandardMaterial({ color: 0x2a323d, roughness: 0.6 }));
    body.position.z = FRONT - 0.31 - 0.08;
    const face = facePlate(tapeWidth, tapeHeight, texture);
    face.position.z = FRONT - 0.079;
    group.add(body, face);
    rack.add(group);
    const part: Part = { id: `tape:${tape.id}`, label: `Tape: ${tape.name}`, group, pullOut: 0.42, hit: face };
    face.userData.part = part; body.userData.part = part;
    parts.push(part);
  });

  // Power unit (decoration).
  const power = unit("power", "Power", 2, labelTexture(1024, 226, c => {
    c.fillStyle = "#1b222b"; c.fillRect(0, 0, 1024, 226);
    c.fillStyle = "#8fa0b3"; c.font = '500 26px "DM Mono", monospace'; c.fillText("UPS · LOAD", 34, 70);
    for (let i = 0; i < 18; i++) { c.fillStyle = i < 11 ? "#3ddc84" : "#242d38"; c.fillRect(34 + i * 30, 104, 20, 70); }
    for (let x = 640; x < 990; x += 16) for (let y = 40; y < 190; y += 16) { c.fillStyle = "#0b0e12"; c.beginPath(); c.arc(x, y, 4.5, 0, Math.PI * 2); c.fill(); }
  }), 0);
  parts.pop();
  power.part.hit.userData.part = undefined;
  power.group.children[0].userData.part = undefined;

  const floor = new THREE.GridHelper(30, 60, 0x2a3441, 0x1a2028);
  floor.position.y = -height / 2 - 0.13;
  scene.add(floor);

  // State
  let selected: Part | null = null, hovered: Part | null = null;
  let yaw = -0.5, pitch = 0.06, targetYaw = yaw, targetPitch = pitch;
  let focusY = 0, distance = 9.6, lightsOn = false, lightMix = 0;
  let dragging = false, moved = 0, lastX = 0, lastY = 0, userTurned = false;
  let frame = 0, visible = true, disposed = false, last = performance.now();
  const pointer = new THREE.Vector2(), raycaster = new THREE.Raycaster();
  const hitTargets = () => parts.flatMap(part => part.group.children.filter(child => child.userData.part));

  function pick(event: PointerEvent): Part | null {
    const box = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return (raycaster.intersectObjects(hitTargets(), false)[0]?.object.userData.part as Part | undefined) ?? null;
  }

  function select(id: string | null, notify = false) {
    selected = id ? parts.find(part => part.id === id) ?? null : null;
    if (selected && !userTurned) targetYaw = -0.62; // turn so the pulled-out unit shows its side
    if (notify) callbacks.onSelect(selected?.id ?? null);
  }

  function onPointerDown(event: PointerEvent) {
    dragging = true; moved = 0; lastX = event.clientX; lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent) {
    if (dragging) {
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      lastX = event.clientX; lastY = event.clientY;
      if (moved > 6) {
        userTurned = true;
        targetYaw = THREE.MathUtils.clamp(targetYaw + dx * 0.008, -1.25, 1.25);
        targetPitch = THREE.MathUtils.clamp(targetPitch + dy * 0.004, -0.12, 0.4);
      }
      return;
    }
    const next = pick(event);
    if (next !== hovered) {
      hovered = next;
      canvas.style.cursor = next ? "pointer" : "grab";
      callbacks.onHover(next?.label ?? null);
    }
  }
  function onPointerUp(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (moved > 6) return; // it was a drag, not a click
    const part = pick(event);
    select(part && part !== selected ? part.id : null, true);
  }
  function onPointerLeave() {
    if (hovered) { hovered = null; callbacks.onHover(null); }
  }
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.style.cursor = "grab";

  function resize() {
    const width = canvas.clientWidth, heightPx = canvas.clientHeight;
    if (width === 0 || heightPx === 0) return;
    renderer.setSize(width, heightPx, false);
    camera.aspect = width / heightPx;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  // Render only while the canvas is on screen and the tab is visible.
  const viewObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); });
  viewObserver.observe(canvas);
  const onVisibility = () => { if (!document.hidden) start(); };
  document.addEventListener("visibilitychange", onVisibility);

  function tick(now: number) {
    frame = 0;
    if (disposed) return;
    // The frame time can be a little before "last" on the first frame, so keep dt at 0 or more.
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    const ease = reducedMotion ? 1 : 1 - Math.pow(0.002, dt); // frame-rate independent smoothing
    const time = now / 1000;

    // A narrow canvas (phone) needs the camera further back to keep the whole rack in view.
    const fitDistance = camera.aspect < 0.8 ? 9.6 / Math.max(camera.aspect, 0.45) * 0.78 : 9.6;
    const wantDistance = selected ? fitDistance * 0.74 : fitDistance;
    const wantY = selected ? selected.group.position.y * 0.75 : 0;
    distance += (wantDistance - distance) * ease;
    focusY += (wantY - focusY) * ease;
    if (!userTurned && !selected && !reducedMotion) targetYaw = -0.5 + Math.sin(time * 0.35) * 0.12; // slow idle sway
    yaw += (targetYaw - yaw) * ease;
    pitch += (targetPitch - pitch) * ease;
    rack.rotation.set(pitch, yaw, 0);
    camera.position.set(0, focusY + 0.5, distance);
    camera.lookAt(0, focusY, 0);

    for (const part of parts) {
      const want = part === selected ? part.pullOut : part === hovered ? Math.min(0.1, part.pullOut) : 0;
      part.group.position.z += (want - part.group.position.z) * ease;
      if (part.led) {
        const blink = reducedMotion ? 1 : part.down ? (Math.sin(time * 22) > 0 ? 1 : 0.15) : (Math.sin(time * 3 + part.group.position.y * 7) > -0.6 ? 1 : 0.3);
        part.led.color.setHex(part.down ? RED : GREEN).multiplyScalar(blink);
      }
    }
    for (const packet of packets) {
      const down = parts.find(part => part.id === `server:${packet.serverId}`)?.down;
      packet.mesh.visible = !down && !reducedMotion;
      if (!down) { packet.t = (packet.t + packet.speed * dt) % 1; packet.mesh.position.copy(packet.curve.getPointAt(packet.t)); }
    }

    lightMix += ((lightsOn ? 1 : 0) - lightMix) * ease;
    (scene.background as THREE.Color).copy(dark).lerp(light, lightMix);
    scene.fog!.color.copy(scene.background as THREE.Color);
    ambient.intensity = 0.5 + lightMix * 1.5;
    rim.intensity = 14 * (1 - lightMix);

    renderer.render(scene, camera);
    start();
  }
  function start() {
    if (!frame && visible && !document.hidden && !disposed) { last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  start();

  return {
    select: id => select(id),
    setDown: (serverId, down) => { const part = parts.find(item => item.id === `server:${serverId}`); if (part) part.down = down; },
    setLights: on => { lightsOn = on; },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse(object => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        for (const material of ([] as THREE.Material[]).concat(mesh.material ?? [])) {
          (material as THREE.MeshStandardMaterial).map?.dispose();
          material.dispose();
        }
      });
      renderer.dispose();
    },
  };
}
