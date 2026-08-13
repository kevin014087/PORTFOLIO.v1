import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RobotMascot3DProps {
  state?: 'idle' | 'thinking' | 'talking';
  width?: number;
  height?: number;
  interactive?: boolean;
}

export function RobotMascot3D({
  state = 'idle',
  width = 90,
  height = 90,
  interactive = true,
}: RobotMascot3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // Renderer with GPU optimizations
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x6366f1, 2.8);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 3.5, 10);
    pointLight.position.set(0, 0.5, 2);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x8b5cf6, 2.5, 10);
    backLight.position.set(-3, -2, -2);
    scene.add(backLight);

    // Robot Main Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Head Mesh (Metallic Cyber Sphere)
    const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
    headGeo.scale(1, 0.9, 0.95);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x121324,
      metalness: 0.85,
      roughness: 0.15,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    robotGroup.add(head);

    // Visor Face Plate
    const visorGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI, 0, Math.PI * 0.6);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x050510,
      metalness: 0.95,
      roughness: 0.05,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.y = -Math.PI / 2;
    visor.rotation.x = -Math.PI * 0.1;
    visor.position.set(0, 0.05, 0.08);
    head.add(visor);

    // Glowing Eyes Group
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.08, 0.78);
    head.add(eyesGroup);

    const eyeGeo = new THREE.CapsuleGeometry(0.1, 0.18, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.x = -0.32;
    leftEye.rotation.z = Math.PI / 2;
    eyesGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.x = 0.32;
    rightEye.rotation.z = Math.PI / 2;
    eyesGroup.add(rightEye);

    // Ears / Antennas
    const earGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.3, 16);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x312e81, metalness: 0.8, roughness: 0.3 });

    const tipGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 1.8 });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.92, 0.1, 0);
    leftEar.rotation.z = Math.PI / 3;
    head.add(leftEar);

    const leftTip = new THREE.Mesh(tipGeo, tipMat);
    leftTip.position.set(0, 0.2, 0);
    leftEar.add(leftTip);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.92, 0.1, 0);
    rightEar.rotation.z = -Math.PI / 3;
    head.add(rightEar);

    const rightTip = new THREE.Mesh(tipGeo, tipMat);
    rightTip.position.set(0, 0.2, 0);
    rightEar.add(rightTip);

    // Floating Holographic Halo Ring
    const ringGeo = new THREE.TorusGeometry(1.25, 0.035, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 1.8,
      metalness: 0.5,
      roughness: 0.2,
      wireframe: true,
    });
    const haloRing = new THREE.Mesh(ringGeo, ringMat);
    haloRing.rotation.x = Math.PI / 3;
    robotGroup.add(haloRing);

    // Floating Particles around Mascot
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 30;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 3.8;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse Tracking Event Listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth float up & down
      const floatY = Math.sin(time * 2.2) * 0.12;
      robotGroup.position.y = floatY;

      // Halo ring rotation
      haloRing.rotation.z = time * 0.6;
      haloRing.rotation.y = time * 0.35;

      // Rotate particles slightly
      particles.rotation.y = time * 0.12;

      // Smooth head look-at target lerp
      const targetRotX = mouseRef.current.y * 0.45;
      const targetRotY = mouseRef.current.x * 0.65;

      robotGroup.rotation.x += (targetRotX - robotGroup.rotation.x) * 0.08;
      robotGroup.rotation.y += (targetRotY - robotGroup.rotation.y) * 0.08;

      // React to AI states
      if (state === 'thinking') {
        // Fast pulse & spin
        const pulse = Math.sin(time * 14) * 0.6 + 1.8;
        eyeMat.emissiveIntensity = 2.5 + pulse;
        ringMat.emissiveIntensity = 2.5 + pulse;
        haloRing.rotation.z += 0.08;
        robotGroup.rotation.z = Math.sin(time * 9) * 0.1;
      } else if (state === 'talking') {
        // Expressive head bob
        robotGroup.position.y += Math.sin(time * 12) * 0.06;
        const talkPulse = Math.sin(time * 16) * 0.5 + 2.0;
        eyeMat.emissiveIntensity = talkPulse;
        ringMat.emissiveIntensity = talkPulse;
      } else {
        // Idle
        eyeMat.emissiveIntensity = 2.0 + Math.sin(time * 3) * 0.4;
        ringMat.emissiveIntensity = 1.4;
        robotGroup.rotation.z = Math.sin(time * 1.5) * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height, interactive, state]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    />
  );
}
