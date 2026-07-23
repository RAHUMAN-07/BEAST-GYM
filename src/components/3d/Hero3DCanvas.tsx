import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // 2. Renderer with High Pixel Ratio for Glossy Reflections
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // 3. Studio Lighting Setup (Blaze Orange & Cobalt Blue Performance Highlights)
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x3b82f6, 4.0); // Electric Cobalt Key Light
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const orangeRimLight = new THREE.PointLight(0xff5722, 10, 25); // Blaze Orange High-Energy Rim Light
    orangeRimLight.position.set(-4, -3, 4);
    scene.add(orangeRimLight);

    const blueFillLight = new THREE.PointLight(0x2563eb, 6, 20); // Deep Blue Under-Glow Light
    blueFillLight.position.set(0, -5, -2);
    scene.add(blueFillLight);

    // 4. Beast Metal & Accent Materials
    const beastMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: false,
    });

    const orangeAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5722,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xff3d00,
      emissiveIntensity: 0.4
    });

    const blueRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    const orangeRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5722,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    // 5. Build Beast Heavy Lifting Dumbbell Mesh Group
    const chromeGroup = new THREE.Group();

    // Chest & Pectoral Muscle Block Geometry
    const chestGeo = new THREE.BoxGeometry(1.6, 1.0, 0.7, 16, 16, 16);
    const chestMesh = new THREE.Mesh(chestGeo, beastMetalMaterial);
    chestMesh.position.y = 0.5;
    chromeGroup.add(chestMesh);

    // Abdominal Core Block Geometry
    const absGeo = new THREE.CylinderGeometry(0.65, 0.55, 1.2, 16);
    const absMesh = new THREE.Mesh(absGeo, beastMetalMaterial);
    absMesh.position.y = -0.4;
    chromeGroup.add(absMesh);

    // Central Heavy Metallic Bar
    const handleGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.2, 32);
    const handleMesh = new THREE.Mesh(handleGeo, beastMetalMaterial);
    handleMesh.rotation.z = Math.PI / 2;
    chromeGroup.add(handleMesh);

    // Outer Beast Weight Plates with Blaze Orange accents
    const plateGeo1 = new THREE.CylinderGeometry(1.0, 1.0, 0.25, 32);
    const plateGeo2 = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);

    const leftPlate1 = new THREE.Mesh(plateGeo1, orangeAccentMaterial);
    leftPlate1.position.x = -1.15;
    leftPlate1.rotation.z = Math.PI / 2;
    chromeGroup.add(leftPlate1);

    const leftPlate2 = new THREE.Mesh(plateGeo2, beastMetalMaterial);
    leftPlate2.position.x = -1.42;
    leftPlate2.rotation.z = Math.PI / 2;
    chromeGroup.add(leftPlate2);

    const rightPlate1 = new THREE.Mesh(plateGeo1, orangeAccentMaterial);
    rightPlate1.position.x = 1.15;
    rightPlate1.rotation.z = Math.PI / 2;
    chromeGroup.add(rightPlate1);

    const rightPlate2 = new THREE.Mesh(plateGeo2, beastMetalMaterial);
    rightPlate2.position.x = 1.42;
    rightPlate2.rotation.z = Math.PI / 2;
    chromeGroup.add(rightPlate2);

    // Outer Orbital Power Rings
    const ringGeo = new THREE.TorusGeometry(1.75, 0.035, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo, orangeRingMaterial);
    ring1.rotation.x = Math.PI / 3;
    chromeGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, blueRingMaterial);
    ring2.rotation.y = Math.PI / 3;
    chromeGroup.add(ring2);

    scene.add(chromeGroup);

    // 6. Dual Blaze Orange & Cobalt Particle Embers Field
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const orangeColor = new THREE.Color(0xff5722);
    const blueColor = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;

      const mixColor = Math.random() > 0.4 ? orangeColor : blueColor;
      colors[i] = mixColor.r;
      colors[i + 1] = mixColor.g;
      colors[i + 2] = mixColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse & Scroll Interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous rotation
      chromeGroup.rotation.y += 0.008;
      chromeGroup.rotation.x += 0.004;

      ring1.rotation.z += 0.01;
      ring2.rotation.z -= 0.01;
      particles.rotation.y += 0.002;

      // Inertial mouse movement
      chromeGroup.rotation.y += mouseX * 0.03;
      chromeGroup.rotation.x += mouseY * 0.03;

      // Scroll depth effect
      const scrollFactor = targetScrollY * 0.0015;
      chromeGroup.position.y = -scrollFactor * 0.5;
      chromeGroup.rotation.z = scrollFactor * 0.8;
      camera.position.z = 7 + Math.sin(scrollFactor) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-80 sm:h-[420px] relative cursor-grab active:cursor-grabbing"
    />
  );
};
