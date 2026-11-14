import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLHero({ scrollVelocity = 0 }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if WebGL is supported
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization skipped:', e);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070a, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 48);

    // 1. Ambient low control room light
    const ambientLight = new THREE.AmbientLight(0x0e1520, 0.8);
    scene.add(ambientLight);

    // 2. Cursor Volumetric Cone Light (Spotlight pointing into depth)
    const spotLight = new THREE.SpotLight(0x3df2ff, 18, 90, Math.PI / 4.5, 0.8, 1.2);
    spotLight.position.set(0, 0, 30);
    scene.add(spotLight);

    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 0);
    scene.add(spotTarget);
    spotLight.target = spotTarget;

    // Secondary subtle warm backlight
    const backWarmLight = new THREE.PointLight(0xffb347, 1.2, 60);
    backWarmLight.position.set(20, -15, 10);
    scene.add(backWarmLight);

    // 3. Volumetric Cone Geometry (Semi-transparent beam of light from desk/monitor)
    const coneGeo = new THREE.ConeGeometry(18, 45, 32, 1, true);
    coneGeo.translate(0, -22.5, 0);
    coneGeo.rotateX(Math.PI / 2);

    const coneMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x3df2ff) },
        opacity: { value: 0.075 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float depthFactor = smoothstep(-45.0, 0.0, vPosition.z);
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          gl_FragColor = vec4(color, opacity * depthFactor * (0.3 + 0.7 * rim));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    scene.add(coneMesh);

    // 4. Radar Sweep Disc in 3D
    const radarGeo = new THREE.RingGeometry(2, 34, 64);
    const radarMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x3df2ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        #define PI 3.14159265359
        void main() {
          vec2 p = vUv - 0.5;
          float angle = atan(p.y, p.x); // -PI to PI
          float sweepAngle = mod(time * 0.8, 2.0 * PI) - PI;
          float diff = mod(sweepAngle - angle + 2.0 * PI, 2.0 * PI);
          float tail = smoothstep(PI * 0.7, 0.0, diff);
          float dist = length(p);
          float ringGrid = sin(dist * 50.0) * 0.5 + 0.5;
          float alpha = tail * 0.16 + (ringGrid > 0.96 ? 0.04 : 0.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.position.set(0, 0, -2);
    scene.add(radarMesh);

    // 5. Floating Dust Particles in the Beam
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = Math.random() * 35;
      particleSpeeds[i] = 0.02 + Math.random() * 0.03;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x3df2ff,
      size: 0.35,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 22;
      mouseRef.current.targetY = y * 14;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Visibility Listener to pause render loop when tab is hidden
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Update spot light position & target
      spotLight.position.x = mouseRef.current.x * 0.8;
      spotLight.position.y = mouseRef.current.y * 0.8;
      spotTarget.position.x = mouseRef.current.x;
      spotTarget.position.y = mouseRef.current.y;

      // Orient volumetric cone along beam
      coneMesh.position.copy(spotLight.position);
      coneMesh.lookAt(spotTarget.position);

      // Radar time update
      radarMat.uniforms.time.value = elapsedTime;

      // Drift particles gently
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += particleSpeeds[i];
        if (posArr[i * 3 + 1] > 20) {
          posArr[i * 3 + 1] = -20;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Camera slight tilt with mouse
      camera.position.x = mouseRef.current.x * 0.08;
      camera.position.y = mouseRef.current.y * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        filter: scrollVelocity > 45 ? 'blur(0.5px) contrast(110%)' : 'none',
        transition: 'filter 0.15s ease-out',
      }}
    />
  );
}
