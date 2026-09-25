"use client";

import { Float, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight, Crosshair, Radio, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./biosphere.module.css";

type Chapter = {
  code: string;
  title: string;
  copy: string;
};

const chapters: Chapter[] = [
  { code: "01 / ARRIVAL", title: "Threshold", copy: "The valley begins as a signal beneath the noise." },
  { code: "02 / SYMBIOSIS", title: "The living circuit", copy: "Mineral memory and synthetic flora exchange a quiet current." },
  { code: "03 / ASCENT", title: "Open system", copy: "A horizon assembled from light, motion, and an unfinished possibility." },
];

const hotspots = [
  { id: "core", label: "CORE // 01", title: "Luminous kernel", copy: "A self-regulating pulse anchors the biosphere's energy exchange." },
  { id: "canopy", label: "CANOPY // 04", title: "Signal canopy", copy: "Low-poly strata harvest ambient data and refract it into weather." },
  { id: "mist", label: "MIST // 07", title: "Memory weather", copy: "Fog is not atmosphere alone: it is the valley's short-term archive." },
];
const cameraPositions = [[0, 1.1, 8], [2.4, 1.8, 6.4], [-2.8, 2.8, 7.5]] as const;
const chapterId = (index: number) => `biosphere-chapter-${index}`;

function Terrain({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(18, 13, 24, 18);
    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const ridge = Math.sin(x * 0.95) * 0.55 + Math.cos(y * 0.7) * 0.45;
      const valley = -Math.exp(-((x * x) / 14 + (y * y) / 8)) * 2.2;
      position.setZ(i, ridge + valley + (Math.sin(x * y * 0.7) * 0.22));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (mesh.current && !reduced) mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.025;
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2.7, 0, 0]} position={[0, -1.85, -1.5]}>
      <meshStandardMaterial color="#071525" emissive="#031a25" emissiveIntensity={0.8} roughness={0.8} metalness={0.3} flatShading />
    </mesh>
  );
}

function Monolith({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reduced || !group.current || !core.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.13;
    group.current.position.y = Math.sin(t * 0.7) * 0.08;
    core.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.045);
  });
  return (
    <group ref={group} position={[0, 0.1, -1]}>
      <Float speed={reduced ? 0 : 1.5} rotationIntensity={0.08} floatIntensity={0.22}>
        <mesh ref={core} castShadow>
          <octahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial color="#131644" emissive="#fd3bca" emissiveIntensity={1.8} roughness={0.25} metalness={0.8} flatShading />
        </mesh>
      </Float>
      <mesh scale={1.55}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#69f7e8" wireframe transparent opacity={0.18} />
      </mesh>
      <pointLight color="#fb4fd4" intensity={32} distance={9} decay={2} />
    </group>
  );
}

function CameraRig({ reduced, chapter }: { reduced: boolean; chapter: number }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const position = cameraPositions[chapter];
    const pointerX = reduced ? 0 : state.pointer.x * 0.35;
    const pointerY = reduced ? 0 : state.pointer.y * 0.2;
    target.set(position[0] + pointerX, position[1] + pointerY, position[2]);
    camera.position.lerp(target, 0.035);
    camera.lookAt(0, 0, -1);
  });
  return null;
}

function Environment({ reduced, chapter }: { reduced: boolean; chapter: number }) {
  return (
    <>
      <color attach="background" args={["#02040b"]} />
      <fog attach="fog" args={["#02040b", 5, 15 - chapter * 1.4]} />
      <ambientLight intensity={0.45} color="#4877b9" />
      <directionalLight position={[4, 6, 4]} intensity={2.2} color="#74e8ff" />
      <Terrain reduced={reduced} />
      <Monolith reduced={reduced} />
      <Sparkles count={reduced ? 35 : 170} scale={[13, 8, 10]} size={reduced ? 1 : 2.5} speed={reduced ? 0 : 0.35} color="#a0ffee" opacity={0.85} />
      <Stars radius={35} depth={10} count={reduced ? 180 : 800} factor={2} saturation={0.2} fade speed={reduced ? 0 : 0.25} />
      <CameraRig reduced={reduced} chapter={chapter} />
    </>
  );
}

export function BiosphereExperience() {
  const [entered, setEntered] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useLenis();
  const shell = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  const scrollToChapter = useCallback((index: number) => {
    lenisRef.current?.scrollTo(`#${chapterId(index)}`, { immediate: prefersReducedMotion });
  }, [lenisRef, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let frame: number | null = null;
    let x = -100;
    let y = -100;
    const updateCursor = () => {
      cursor.current?.style.setProperty("--cursor-x", `${x}px`);
      cursor.current?.style.setProperty("--cursor-y", `${y}px`);
      frame = null;
    };
    const trackCursor = (event: PointerEvent) => {
      if (window.innerWidth < 800) return;
      x = event.clientX;
      y = event.clientY;
      if (frame === null) frame = window.requestAnimationFrame(updateCursor);
    };
    window.addEventListener("pointermove", trackCursor);
    return () => {
      window.removeEventListener("pointermove", trackCursor);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  useGSAP(() => {
    registerGsap();
    if (!entered || prefersReducedMotion || !shell.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-bio-reveal]", { y: 24, opacity: 0, filter: "blur(8px)" }, {
        y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.12, ease: "power3.out",
      });
      chapters.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `#${chapterId(index)}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setChapter(index),
          onEnterBack: () => setChapter(index),
        });
      });
    }, shell);
    return () => ctx.revert();
  }, { dependencies: [entered, prefersReducedMotion], scope: shell });

  const enter = () => {
    setEntered(true);
    window.setTimeout(() => lenisRef.current?.scrollTo(0, { immediate: true }), 0);
  };

  return (
    <main ref={shell} className={styles.shell}>
      <div ref={cursor} className={styles.cursor} aria-hidden="true"><Crosshair size={16} /></div>
      <div className={styles.canvasWrap} aria-hidden="true">
        <Canvas dpr={[1, 1.7]} camera={{ position: [0, 1.1, 8], fov: 48 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Environment reduced={prefersReducedMotion} chapter={chapter} />
        </Canvas>
      </div>

      {!entered && (
        <section className={styles.opening} aria-label="Neon Biosphere opening sequence">
          <div className={styles.loadingLine}><span /></div>
          <p className={styles.eyebrow}>PROTOTYPE 07 / SYNTHETIC ECOLOGY</p>
          <h1>NEON<br />BIOSPHERE</h1>
          <p className={styles.openingCopy}>A living signal valley, assembled for exploration.</p>
          <button className={styles.enterButton} onClick={enter}>
            <span>ENTER THE BIOSPHERE</span><ArrowUpRight size={17} />
          </button>
        </section>
      )}

      {entered && (
        <>
          <header className={styles.hud}>
            <Link href="/" className={styles.returnLink}>← RETURN TO PORTFOLIO</Link>
            <div className={styles.status}><Radio size={12} /> SYSTEM / STABLE</div>
            <div className={styles.coordinates}>34° 12&apos; N / 118° 08&apos; W</div>
          </header>
          <aside className={styles.chapterNav} aria-label="Biosphere chapters">
            {chapters.map((item, index) => (
              <button key={item.code} className={index === chapter ? styles.activeChapter : ""} onClick={() => scrollToChapter(index)} aria-label={`Go to ${item.title}`}>
                <span>0{index + 1}</span><i />
              </button>
            ))}
          </aside>
          <div className={styles.markerLayer}>
            {hotspots.map((hotspot, index) => (
              <button key={hotspot.id} className={`${styles.marker} ${styles[`marker${index}`]}`} onClick={() => setSelectedHotspot(hotspot.id)} aria-label={`Inspect ${hotspot.title}`}>
                <span /><em>{hotspot.label}</em>
              </button>
            ))}
          </div>
          {selectedHotspot && (() => {
            const hotspot = hotspots.find(({ id }) => id === selectedHotspot);
            return hotspot ? (
              <section className={styles.panel} aria-live="polite">
                <button onClick={() => setSelectedHotspot(null)} aria-label="Close information panel"><X size={16} /></button>
                <p>{hotspot.label}</p><h2>{hotspot.title}</h2><span>{hotspot.copy}</span>
              </section>
            ) : null;
          })()}
          <div className={styles.scrollPrompt}><ArrowDown size={14} /> SCROLL TO DESCEND</div>
          <div className={styles.scrollTrack}>
            {chapters.map((item, index) => (
              <section id={chapterId(index)} className={styles.chapter} key={item.code}>
                <div data-bio-reveal>
                  <p>{item.code}</p><h2>{item.title}</h2><span>{item.copy}</span>
                </div>
              </section>
            ))}
            <section className={`${styles.chapter} ${styles.exitChapter}`}>
              <div>
                <p>END OF TRANSMISSION</p><h2>Keep exploring.</h2>
                <button onClick={() => scrollToChapter(0)}><RotateCcw size={14} /> RETURN TO SURFACE</button>
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
