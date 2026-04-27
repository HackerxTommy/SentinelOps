import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      // WebGL not supported — fail silently
      return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);
    const point1 = new THREE.PointLight(0x8b5cf6, 0.8, 20);
    point1.position.set(5, 5, 5);
    scene.add(point1);
    const point2 = new THREE.PointLight(0x7c3aed, 0.4, 20);
    point2.position.set(-5, -3, 3);
    scene.add(point2);

    // Shield shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.8);
    shape.bezierCurveTo(0.8, 1.6, 1.2, 1.2, 1.2, 0.6);
    shape.bezierCurveTo(1.2, -0.2, 0.6, -1.0, 0, -1.4);
    shape.bezierCurveTo(-0.6, -1.0, -1.2, -0.2, -1.2, 0.6);
    shape.bezierCurveTo(-1.2, 1.2, -0.8, 1.6, 0, 1.8);

    const shieldGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.15, bevelEnabled: true, bevelThickness: 0.03,
      bevelSize: 0.03, bevelSegments: 3
    });

    // Wireframe shield
    const wireframeMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.15, wireframe: true
    });
    const wireframeShield = new THREE.Mesh(shieldGeo, wireframeMat);

    // Solid inner shield
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x6d28d9, emissive: 0x7c3aed, emissiveIntensity: 0.2,
      transparent: true, opacity: 0.08
    });
    const solidShield = new THREE.Mesh(shieldGeo, solidMat);
    solidShield.scale.setScalar(0.9);

    const shieldGroup = new THREE.Group();
    shieldGroup.add(wireframeShield);
    shieldGroup.add(solidShield);
    scene.add(shieldGroup);

    // Orbital rings
    const ringGeo1 = new THREE.TorusGeometry(2, 0.008, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.5,
      transparent: true, opacity: 0.3
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = 0.5;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.006, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.4,
      transparent: true, opacity: 0.2
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.set(1.2, 0.5, 0);
    scene.add(ring2);

    // Floating particles
    const particleCount = 100;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8b5cf6, size: 0.04, transparent: true, opacity: 0.6, sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Shield float + rotation
      shieldGroup.rotation.y = Math.sin(t * 0.3) * 0.15;
      shieldGroup.rotation.x = Math.sin(t * 0.2) * 0.05;
      shieldGroup.position.y = Math.sin(t * 0.5) * 0.1;

      // Rings spin
      ring1.rotation.z = t * 0.15;
      ring2.rotation.z = -t * 0.1;

      // Particles drift
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        posAttr.array[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.001;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}
