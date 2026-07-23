import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Scroll3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Floating wireframe geometry ─────────────────────────
    const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff66, wireframe: true, transparent: true, opacity: 0.15 });
    const emeraldMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.12 });
    const whiteMat  = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 });

    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(3.5, 1), greenMat);
    ico.position.set(-7, 2, -4);

    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.2, 0.45, 100, 16), emeraldMat);
    knot.position.set(7, -3, -5);

    const oct = new THREE.Mesh(new THREE.OctahedronGeometry(2.8, 0), whiteMat);
    oct.position.set(0, 5, -6);

    const geoGroup = new THREE.Group();
    geoGroup.add(ico, knot, oct);
    scene.add(geoGroup);

    // ── Green & Emerald particle starfield ──────────────────────
    const COUNT = 1200;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const green   = new THREE.Color(0x00ff66);
    const emerald = new THREE.Color(0x10b981);
    const white   = new THREE.Color(0xffffff);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const c = Math.random() < 0.45 ? green : Math.random() < 0.7 ? emerald : white;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.55 });
    const stars = new THREE.Points(pGeo, pMat);
    scene.add(stars);

    // ── Scroll & mouse interaction ─────────────────────────
    let scrollY = 0;
    let mouseX = 0, mouseY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouse);

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.006;

      ico.rotation.x  += 0.003; ico.rotation.y  += 0.004;
      knot.rotation.x -= 0.004; knot.rotation.z += 0.003;
      oct.rotation.y  += 0.005; oct.rotation.x  -= 0.002;
      stars.rotation.y += 0.0004;

      const sf = scrollY * 0.0015;
      geoGroup.rotation.y = sf * 0.4 + Math.sin(t * 0.5) * 0.05;
      geoGroup.position.y = sf * 1.2;
      camera.position.y   = -sf * 0.25;

      // Gentle mouse parallax on the whole group
      geoGroup.rotation.x += (mouseY * 0.04 - geoGroup.rotation.x) * 0.02;
      geoGroup.position.x  += (mouseX * 1.5 - geoGroup.position.x) * 0.015;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
};
