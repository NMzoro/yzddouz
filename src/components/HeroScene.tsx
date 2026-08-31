import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Lightweight Three.js hero scene.
 * - Icosahedron wireframe with subtle inner glow sphere.
 * - Reacts to pointer position (slow lerp toward target).
 * - Pauses rendering when the canvas leaves the viewport.
 */
export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Inner glow sphere
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xd4d4d8,
        transparent: true,
        opacity: 0.06,
      }),
    );
    scene.add(glow);

    // Outer wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.55, 1);
    const wire = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: 0xf4f4f5,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
    );
    scene.add(wire);

    // Particle dust
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xd4d4d8,
        size: 0.015,
        transparent: true,
        opacity: 0.6,
      }),
    );
    scene.add(particles);

    // Pointer tracking
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove);

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Visibility-aware loop
    let running = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) loop();
      },
      { threshold: 0.01 },
    );
    io.observe(mount);

    let frameId = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      if (!running) return;
      frameId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;

      wire.rotation.y = t * 0.15 + pointer.x * 0.3;
      wire.rotation.x = t * 0.1 + pointer.y * 0.2;
      glow.rotation.y = -t * 0.1;
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(frameId);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      pGeo.dispose();
      wire.material.dispose();
      glow.geometry.dispose();
      glow.material.dispose();
      particles.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
