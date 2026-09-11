"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { seeded, lerp, range } from "@/lib/utils";

type Props = { progress: MotionValue<number>; active: boolean };

const INK = "#1b1f2a";
const PASTELS = ["#eadfcb", "#e9b8a4", "#bfe3d6", "#f3e2a2", "#d9caae", "#f0c8c0", "#fff9ee"];

/* ---------- toon helpers ---------- */

function useGradientMap() {
  return useMemo(() => {
    const data = new Uint8Array([90, 160, 255, 255]);
    const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/** Facade texture: white base, dark window squares, a few lit ones. Multiplied by instance colour. */
function makeFacadeTexture(rows: number, cols: number, litChance: number, seed: number) {
  const c = document.createElement("canvas");
  c.width = cols * 32;
  c.height = rows * 32;
  const ctx = c.getContext("2d")!;
  const rand = seeded(seed);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      ctx.fillStyle = rand() < litChance ? "#ffd23f" : "#8fd0ea";
      ctx.fillRect(k * 32 + 8, r * 32 + 8, 16, 14);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.strokeRect(k * 32 + 8, r * 32 + 8, 16, 14);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Grime for the glass pane. */
function makeDirtTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const ctx = c.getContext("2d")!;
  const rand = seeded(9);
  ctx.fillStyle = "rgba(140,122,102,0.55)";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(107,91,72,${0.15 + rand() * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(rand() * 1024, rand() * 640, 40 + rand() * 120, 20 + rand() * 60, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = `rgba(107,91,72,${0.2 + rand() * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rand() * 1024, rand() * 640, 6 + rand() * 24, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(107,91,72,${0.15 + rand() * 0.2})`;
    ctx.fillRect(rand() * 1024, rand() * 300, 3 + rand() * 5, 60 + rand() * 200);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------- city ---------- */

type BuildingClass = { height: number; count: number; seed: number };
const CLASSES: BuildingClass[] = [
  { height: 3, count: 70, seed: 1 },
  { height: 6, count: 60, seed: 2 },
  { height: 11, count: 36, seed: 3 },
];

function Buildings({ gradientMap }: { gradientMap: THREE.Texture }) {
  const groups = useMemo(() => {
    const rand = seeded(42);
    return CLASSES.map((cls) => {
      const matrices: THREE.Matrix4[] = [];
      const colors: THREE.Color[] = [];
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const s = new THREE.Vector3();
      const pos = new THREE.Vector3();
      for (let i = 0; i < cls.count; i++) {
        const x = (rand() - 0.5) * 90;
        const z = -8 - rand() * 70;
        if (Math.abs(x) < 2.5 && z > -14) continue; // keep the view axis open
        const w = 2 + rand() * 3;
        const d = 2 + rand() * 3;
        const h = cls.height * (0.8 + rand() * 0.5);
        s.set(w, h, d);
        pos.set(x, -6 + h / 2, z);
        m.compose(pos, q, s);
        matrices.push(m.clone());
        colors.push(new THREE.Color(PASTELS[Math.floor(rand() * PASTELS.length)]));
      }
      return { cls, matrices, colors };
    });
  }, []);

  return (
    <group>
      {groups.map(({ cls, matrices, colors }) => (
        <BuildingBatch key={cls.seed} cls={cls} matrices={matrices} colors={colors} gradientMap={gradientMap} />
      ))}
    </group>
  );
}

function BuildingBatch({
  cls,
  matrices,
  colors,
  gradientMap,
}: {
  cls: BuildingClass;
  matrices: THREE.Matrix4[];
  colors: THREE.Color[];
  gradientMap: THREE.Texture;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const outline = useRef<THREE.InstancedMesh>(null);
  const texture = useMemo(() => makeFacadeTexture(Math.round(cls.height), 3, 0.12, cls.seed), [cls]);

  useEffect(() => {
    const mesh = ref.current;
    const out = outline.current;
    if (!mesh || !out) return;
    const m = new THREE.Matrix4();
    const scale = new THREE.Vector3();
    const pos = new THREE.Vector3();
    const q = new THREE.Quaternion();
    matrices.forEach((mat, i) => {
      mesh.setMatrixAt(i, mat);
      mesh.setColorAt(i, colors[i]);
      mat.decompose(pos, q, scale);
      scale.multiplyScalar(1.035);
      m.compose(pos, q, scale);
      out.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    out.instanceMatrix.needsUpdate = true;
    return () => texture.dispose();
  }, [matrices, colors, texture]);

  return (
    <>
      <instancedMesh ref={outline} args={[undefined, undefined, matrices.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </instancedMesh>
      <instancedMesh ref={ref} args={[undefined, undefined, matrices.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial map={texture} gradientMap={gradientMap} />
      </instancedMesh>
    </>
  );
}

/* ---------- props ---------- */

function Cloud({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.x += dt * speed;
    if (ref.current.position.x > 60) ref.current.position.x = -60;
  });
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 2.2],
    [2.2, 0.4, 0.3, 1.7],
    [-2.1, 0.2, -0.2, 1.6],
    [0.6, 1.2, 0, 1.5],
  ];
  return (
    <group ref={ref} position={position}>
      {puffs.map(([x, y, z, r], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh scale={1.06}>
            <sphereGeometry args={[r, 18, 14]} />
            <meshBasicMaterial color={INK} side={THREE.BackSide} fog={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[r, 18, 14]} />
            <meshBasicMaterial color="#ffffff" fog={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Bird({ radius, speed, y, phase }: { radius: number; speed: number; y: number; phase: number }) {
  const ref = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Mesh>(null);
  const wingR = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, y + Math.sin(t * 2) * 0.4, -18 + Math.sin(t) * radius);
      ref.current.rotation.y = -t + Math.PI / 2;
    }
    const flap = Math.sin(clock.elapsedTime * 14) * 0.7;
    if (wingL.current) wingL.current.rotation.z = flap;
    if (wingR.current) wingR.current.rotation.z = -flap;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshBasicMaterial color="#b8bfcb" />
      </mesh>
      <mesh ref={wingL} position={[-0.15, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshBasicMaterial color="#d5dde6" />
      </mesh>
      <mesh ref={wingR} position={[0.15, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshBasicMaterial color="#d5dde6" />
      </mesh>
    </group>
  );
}

/* ---------- the room ---------- */

function Room({ gradientMap, dirt }: { gradientMap: THREE.Texture; dirt: THREE.Texture }) {
  const wall = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-30, -20);
    shape.lineTo(30, -20);
    shape.lineTo(30, 20);
    shape.lineTo(-30, 20);
    shape.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-2.2, 0.2);
    hole.lineTo(2.2, 0.2);
    hole.lineTo(2.2, 3.2);
    hole.lineTo(-2.2, 3.2);
    hole.closePath();
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape);
  }, []);

  const frameParts: [number, number, number, number, number][] = [
    // x, y, w, h, depth
    [0, 3.35, 4.9, 0.3, 0.3],
    [0, 0.05, 4.9, 0.3, 0.3],
    [-2.3, 1.7, 0.3, 3.3, 0.3],
    [2.3, 1.7, 0.3, 3.3, 0.3],
    [0, 1.7, 0.16, 3.0, 0.26],
  ];

  return (
    <group>
      <mesh geometry={wall} position={[0, 0, 0]}>
        <meshBasicMaterial color="#2b3140" />
      </mesh>
      {frameParts.map(([x, y, w, h, d], i) => (
        <group key={i} position={[x, y, 0.05]}>
          <mesh scale={[1 + 0.05 / w, 1 + 0.05 / h, 1.05]}>
            <boxGeometry args={[w, h, d]} />
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
          <mesh>
            <boxGeometry args={[w, h, d]} />
            <meshToonMaterial color="#fff9ee" gradientMap={gradientMap} />
          </mesh>
        </group>
      ))}
      {/* sill */}
      <group position={[0, -0.2, 0.35]}>
        <mesh scale={[1.01, 1.1, 1.05]}>
          <boxGeometry args={[5.4, 0.18, 0.7]} />
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
        <mesh>
          <boxGeometry args={[5.4, 0.18, 0.7]} />
          <meshToonMaterial color="#fff9ee" gradientMap={gradientMap} />
        </mesh>
      </group>
      {/* glass with grime */}
      <Glass dirt={dirt} />
    </group>
  );
}

function Glass({ dirt }: { dirt: THREE.Texture }) {
  const grime = useRef<THREE.MeshBasicMaterial>(null);
  const pane = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ scene }) => {
    const p = (scene.userData.progress as number) ?? 0;
    if (grime.current) grime.current.opacity = 1 - range(p, 0.18, 0.5);
    if (pane.current) pane.current.opacity = 0.28 * (1 - range(p, 0.5, 0.62));
  });
  return (
    <group position={[0, 1.7, 0.02]}>
      <mesh>
        <planeGeometry args={[4.4, 3]} />
        <meshBasicMaterial ref={pane} color="#d8f3fc" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[4.4, 3]} />
        <meshBasicMaterial ref={grime} map={dirt} transparent opacity={1} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- camera rig ---------- */

function Rig({ progress }: { progress: MotionValue<number> }) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, scene }) => {
    const p = progress.get();
    scene.userData.progress = p;
    const t = p;
    // dolly from inside the room, through the glass, out over the city
    const z = lerp(5.6, -5, t);
    const y = lerp(1.7, 2.4, range(t, 0.55, 1));
    const x = Math.sin(t * Math.PI) * 0.35;
    camera.position.set(x, y, z);
    target.set(0, lerp(1.7, 1.2, range(t, 0.5, 1)), lerp(0, -40, range(t, 0.5, 1)));
    camera.lookAt(target);
    const cam = camera as THREE.PerspectiveCamera;
    const fov = lerp(48, 60, range(t, 0.6, 1));
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const gradientMap = useGradientMap();
  const dirt = useMemo(() => makeDirtTexture(), []);
  useEffect(() => () => dirt.dispose(), [dirt]);

  return (
    <>
      <color attach="background" args={["#5bc3e8"]} />
      <fog attach="fog" args={["#a9e4f7", 55, 140]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[12, 20, 6]} intensity={1.6} color="#fff3b0" />
      <hemisphereLight args={["#d8f3fc", "#eadfcb", 0.6]} />

      <Rig progress={progress} />
      <Room gradientMap={gradientMap} dirt={dirt} />

      {/* ground far below (we are on a high floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, -40]}>
        <planeGeometry args={[220, 220]} />
        <meshBasicMaterial color="#b8a88f" />
      </mesh>

      <Buildings gradientMap={gradientMap} />

      {/* sun */}
      <group position={[18, 16, -60]}>
        <mesh scale={1.06}>
          <sphereGeometry args={[4, 24, 18]} />
          <meshBasicMaterial color={INK} side={THREE.BackSide} fog={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[4, 24, 18]} />
          <meshBasicMaterial color="#ffd23f" fog={false} />
        </mesh>
      </group>

      <Cloud position={[-20, 12, -45]} speed={0.6} />
      <Cloud position={[8, 15, -55]} speed={0.4} />
      <Cloud position={[30, 10, -35]} speed={0.5} />

      <Bird radius={9} speed={0.35} y={4} phase={0} />
      <Bird radius={7} speed={0.42} y={5} phase={2} />

      {/* the neighbour's balcony, close on the right */}
      <group position={[8.6, -0.5, -11]}>
        <mesh scale={[1.02, 1.01, 1.02]}>
          <boxGeometry args={[5, 12, 4]} />
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
        <mesh>
          <boxGeometry args={[5, 12, 4]} />
          <meshToonMaterial color="#e9b8a4" gradientMap={gradientMap} />
        </mesh>
        <group position={[-3.1, 1.2, 0.6]}>
          <mesh scale={[1.04, 1.3, 1.04]}>
            <boxGeometry args={[1.4, 0.15, 1.6]} />
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.4, 0.15, 1.6]} />
            <meshToonMaterial color="#fff9ee" gradientMap={gradientMap} />
          </mesh>
          {/* railing */}
          <mesh position={[0, 0.5, 0.75]}>
            <boxGeometry args={[1.4, 0.04, 0.04]} />
            <meshBasicMaterial color={INK} />
          </mesh>
          {/* neighbour: outlined capsule + head + cap */}
          <group position={[0, 0.55, 0]}>
            <mesh scale={1.08}>
              <capsuleGeometry args={[0.22, 0.5, 4, 10]} />
              <meshBasicMaterial color={INK} side={THREE.BackSide} />
            </mesh>
            <mesh>
              <capsuleGeometry args={[0.22, 0.5, 4, 10]} />
              <meshToonMaterial color="#1fb6a6" gradientMap={gradientMap} />
            </mesh>
          </group>
          <group position={[0, 1.12, 0]}>
            <mesh scale={1.08}>
              <sphereGeometry args={[0.24, 14, 12]} />
              <meshBasicMaterial color={INK} side={THREE.BackSide} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.24, 14, 12]} />
              <meshToonMaterial color="#ffd2ad" gradientMap={gradientMap} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.12, 14]} />
              <meshBasicMaterial color="#ff6b2c" />
            </mesh>
          </group>
          {/* mug */}
          <mesh position={[0.32, 0.7, 0.1]}>
            <cylinderGeometry args={[0.08, 0.08, 0.14, 10]} />
            <meshBasicMaterial color="#ff6b2c" />
          </mesh>
        </group>
      </group>
    </>
  );
}

export function JourneyCanvas({ progress, active }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 48, near: 0.1, far: 220, position: [0, 1.7, 5.6] }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Scene progress={progress} />
    </Canvas>
  );
}
