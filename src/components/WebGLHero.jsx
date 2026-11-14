import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../utils/soundEngine';

export default function WebGLHero({ scrollVelocity = 0 }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rippleRef = useRef({ active: false, radius: 0, maxRadius: 55, x: 0, y: 0, alpha: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070a, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 52);

    // 1. Ambient low control-room lighting
    const ambientLight = new THREE.AmbientLight(0x0b111a, 0.9);
    scene.add(ambientLight);

    // 2. Cursor Volumetric Cone Light (Spotlight)
    const spotLight = new THREE.SpotLight(0x3df2ff, 24, 110, Math.PI / 4.2, 0.75, 1.1);
    spotLight.position.set(0, 0, 32);
    scene.add(spotLight);

    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 0);
    scene.add(spotTarget);
    spotLight.target = spotTarget;

    // Subtle amber cross-fill light from lower-right
    const warmFill = new THREE.PointLight(0xffb347, 1.4, 75);
    warmFill.position.set(24, -18, 12);
    scene.add(warmFill);

    // 3. Volumetric Cone Geometry (Double Layer: Core Beam + Soft Glow Shroud)
    // Layer A: Outer Soft Shroud
    const outerConeGeo = new THREE.ConeGeometry(22, 52, 36, 1, true);
    outerConeGeo.translate(0, -26, 0);
    outerConeGeo.rotateX(Math.PI / 2);

    const outerConeMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x3df2ff) },
        opacity: { value: 0.065 },
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
          float depthFactor = smoothstep(-52.0, 0.0, vPosition.z);
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          gl_FragColor = vec4(color, opacity * depthFactor * (0.35 + 0.65 * rim));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const outerConeMesh = new THREE.Mesh(outerConeGeo, outerConeMat);
    scene.add(outerConeMesh);

    // Layer B: Inner Concentrated Core Beam
    const innerConeGeo = new THREE.ConeGeometry(8, 48, 32, 1, true);
    innerConeGeo.translate(0, -24, 0);
    innerConeGeo.rotateX(Math.PI / 2);
    const innerConeMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x3df2ff) },
        opacity: { value: 0.09 },
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
          float depthFactor = smoothstep(-48.0, 0.0, vPosition.z);
          gl_FragColor = vec4(color, opacity * depthFactor * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const innerConeMesh = new THREE.Mesh(innerConeGeo, innerConeMat);
    scene.add(innerConeMesh);

    // 4. Horizon Anamorphic Horizontal Flare (Fincher / Blade Runner Signature)
    const flareGeo = new THREE.PlaneGeometry(38, 0.6);
    const flareMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x3df2ff) },
        opacity: { value: 0.35 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          float dist = abs(vUv.x - 0.5) * 2.0;
          float yDist = abs(vUv.y - 0.5) * 2.0;
          float intensity = (1.0 - smoothstep(0.0, 1.0, dist)) * (1.0 - smoothstep(0.0, 1.0, yDist));
          gl_FragColor = vec4(color, opacity * intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    scene.add(flareMesh);

    // 5. Tactical Topographic Radar Grid (Curved Undulating Mesh in the Background)
    const gridWidth = 90;
    const gridDepth = 60;
    const gridSegX = 64;
    const gridSegY = 48;
    const gridGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegX, gridSegY);
    gridGeo.rotateX(-Math.PI / 2.3);
    gridGeo.translate(0, -12, -8);

    const posAttr = gridGeo.attributes.position;
    const origY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      // Gentle rolling waves
      const elev = Math.sin(vx * 0.12) * Math.cos(vz * 0.15) * 1.8;
      posAttr.setY(i, posAttr.getY(i) + elev);
      origY[i] = posAttr.getY(i);
    }
    gridGeo.computeVertexNormals();

    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        sweepAngle: { value: 0 },
        ripplePos: { value: new THREE.Vector2(0, 0) },
        rippleRadius: { value: 0 },
        rippleAlpha: { value: 0 },
      },
      vertexShader: `
        varying vec3 vPos;
        varying vec2 vUv;
        void main() {
          vPos = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float sweepAngle;
        uniform vec2 ripplePos;
        uniform float rippleRadius;
        uniform float rippleAlpha;
        varying vec3 vPos;
        varying vec2 vUv;
        #define PI 3.14159265359

        void main() {
          // Fine grid wireframe lines
          vec2 grid = abs(fract(vUv * vec2(32.0, 24.0) - 0.5) - 0.5) / fwidth(vUv * vec2(32.0, 24.0));
          float line = 1.0 - min(min(grid.x, grid.y), 1.0);

          // Radar sweep angle calculation
          float angle = atan(vPos.z, vPos.x);
          float diff = mod(sweepAngle - angle + 2.0 * PI, 2.0 * PI);
          float sweep = smoothstep(PI * 0.65, 0.0, diff);

          // Sonar ripple shockwave
          float dRipple = length(vPos.xz - ripplePos);
          float rippleWave = smoothstep(2.5, 0.0, abs(dRipple - rippleRadius)) * rippleAlpha;

          // Wireframe color
          vec3 baseColor = vec3(0.04, 0.08, 0.12);
          vec3 sweepColor = vec3(0.24, 0.95, 1.0);
          vec3 rippleColor = vec3(0.35, 0.96, 1.0);

          float alpha = line * (0.07 + sweep * 0.35) + rippleWave * 0.6;
          vec3 finalColor = mix(baseColor, sweepColor, sweep * 0.8);
          finalColor = mix(finalColor, rippleColor, rippleWave);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    scene.add(gridMesh);

    // 6. Tactical Telemetry Radar Rings (Planar Concentric Ranges)
    const radarGeo = new THREE.RingGeometry(2, 38, 72);
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
          float angle = atan(p.y, p.x);
          float sweepAngle = mod(time * 0.75, 2.0 * PI) - PI;
          float diff = mod(sweepAngle - angle + 2.0 * PI, 2.0 * PI);
          float tail = smoothstep(PI * 0.75, 0.0, diff);
          float dist = length(p);
          float ringGrid = sin(dist * 60.0) * 0.5 + 0.5;
          float alpha = tail * 0.18 + (ringGrid > 0.96 ? 0.05 : 0.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.position.set(0, 0, -4);
    scene.add(radarMesh);

    // 7. Floating 3D Telemetry Nodes & Sensor Constellation
    const nodeCount = 18;
    const nodeGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x3df2ff,
      transparent: true,
      opacity: 0.85,
    });

    const nodesGroup = new THREE.Group();
    const nodePositions = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.2;
      const radius = 10 + Math.random() * 24;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.5) + (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 16;
      mesh.position.set(x, y, z);
      nodesGroup.add(mesh);
      nodePositions.push({ x, y, z });
    }
    scene.add(nodesGroup);

    // Hairline connector lines between nearby nodes
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const d = Math.hypot(
          nodePositions[i].x - nodePositions[j].x,
          nodePositions[i].y - nodePositions[j].y,
          nodePositions[i].z - nodePositions[j].z
        );
        if (d < 16) {
          linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x3df2ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // 8. Optical Dust Motes Floating in Volumetric Spotlight
    const particleCount = 320;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleDrifts = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 58;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = Math.random() * 38;
      particleSpeeds[i] = 0.02 + Math.random() * 0.035;
      particleDrifts[i] = (Math.random() - 0.5) * 0.015;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x3df2ff,
      size: 0.42,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking with Easing
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 24;
      mouseRef.current.targetY = y * 16;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Canvas Click Sonar Ripple Interaction
    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 20;
      const y = -((((e.clientY - rect.top) / rect.height) * 2 - 1) * 12);

      rippleRef.current.active = true;
      rippleRef.current.radius = 0;
      rippleRef.current.x = x;
      rippleRef.current.y = y;
      rippleRef.current.alpha = 1.0;
    };
    container.addEventListener('click', handleClick);

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

    // Tab visibility toggle
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
      spotLight.position.x = mouseRef.current.x * 0.85;
      spotLight.position.y = mouseRef.current.y * 0.85;
      spotTarget.position.x = mouseRef.current.x;
      spotTarget.position.y = mouseRef.current.y;

      // Align both volumetric cones along beam
      outerConeMesh.position.copy(spotLight.position);
      outerConeMesh.lookAt(spotTarget.position);

      innerConeMesh.position.copy(spotLight.position);
      innerConeMesh.lookAt(spotTarget.position);

      // Anamorphic flare tracking spotlight center
      flareMesh.position.set(spotLight.position.x * 0.7, spotLight.position.y * 0.7, 18);

      // Radar rotation
      const sweep = (elapsedTime * 0.75) % (Math.PI * 2);
      radarMat.uniforms.time.value = elapsedTime;
      gridMat.uniforms.time.value = elapsedTime;
      gridMat.uniforms.sweepAngle.value = sweep;

      // Sonar ripple propagation
      if (rippleRef.current.active) {
        rippleRef.current.radius += 0.8;
        rippleRef.current.alpha = Math.max(0, 1.0 - rippleRef.current.radius / rippleRef.current.maxRadius);
        gridMat.uniforms.ripplePos.value.set(rippleRef.current.x, rippleRef.current.y);
        gridMat.uniforms.rippleRadius.value = rippleRef.current.radius;
        gridMat.uniforms.rippleAlpha.value = rippleRef.current.alpha;

        if (rippleRef.current.radius > rippleRef.current.maxRadius) {
          rippleRef.current.active = false;
        }
      }

      // Drift particle motes
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += particleSpeeds[i];
        posArr[i * 3] += particleDrifts[i];
        if (posArr[i * 3 + 1] > 22) {
          posArr[i * 3 + 1] = -22;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Gentle camera gyroscopic parallax
      camera.position.x = mouseRef.current.x * 0.09;
      camera.position.y = mouseRef.current.y * 0.09;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
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
      className="absolute inset-0 pointer-events-auto z-0 overflow-hidden cursor-crosshair"
      style={{
        filter: scrollVelocity > 45 ? 'blur(0.5px) contrast(110%)' : 'none',
        transition: 'filter 0.15s ease-out',
      }}
    />
  );
}
