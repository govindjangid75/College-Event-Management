import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Compass, Eye, Moon, Sun, Layers, Maximize2, RotateCw, 
  MapPin, Calendar, Users, Award, ArrowRight, X, Sparkles, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchVenues, fetchEvents } from '../services/api';
import { Venue, Event } from '../types';

interface VenueLocation {
  id: string;
  name: string;
  code: string;
  building: string;
  capacity: number;
  description: string;
  color: number;
  position: [number, number, number];
  size: [number, number, number];
  beaconHeight: number;
}

const VENUE_LOCATIONS: VenueLocation[] = [
  {
    id: 'venue_turing_lab',
    name: 'Arya Turing Computing & Innovation Lab',
    code: 'LAB-TURING-01',
    building: 'Block A (Ground Floor)',
    capacity: 200,
    description: 'Premier AI, high-performance computing, and Hackathon arena with gigabit fiber network.',
    color: 0x06b6d4, // Cyan
    position: [-18, 3, -10],
    size: [14, 6, 12],
    beaconHeight: 9,
  },
  {
    id: 'venue_auditorium_central',
    name: 'Arya Central Auditorium',
    code: 'AUD-MAIN-01',
    building: 'Central Cultural Complex',
    capacity: 1200,
    description: '1,200-seater air-conditioned grand auditorium with Dolby stage acoustics and live streaming.',
    color: 0x8b5cf6, // Violet
    position: [0, 4.5, -20],
    size: [22, 9, 18],
    beaconHeight: 14,
  },
  {
    id: 'venue_block_a_seminar',
    name: 'Academic Block A Seminar Hall',
    code: 'SEM-BLK-A',
    building: 'Academic Block A (2nd Floor)',
    capacity: 350,
    description: 'Tiered executive presentation theater with dual 4K laser projectors for guest lectures.',
    color: 0x10b981, // Emerald
    position: [18, 5, -8],
    size: [16, 10, 14],
    beaconHeight: 15,
  },
  {
    id: 'venue_robotics_arena',
    name: 'Arya Robotics & Drone Arena',
    code: 'ARENA-ROBO-02',
    building: 'Block B Innovation Hub',
    capacity: 250,
    description: 'Specialized netted drone testing corridor and line-follower robotics combat arena.',
    color: 0xf59e0b, // Amber
    position: [-16, 2.5, 14],
    size: [14, 5, 12],
    beaconHeight: 8,
  },
  {
    id: 'venue_open_amphi',
    name: 'Arya Open-Air Amphitheatre',
    code: 'AMPHI-OAT-01',
    building: 'Campus Central Plaza',
    capacity: 800,
    description: 'Sunk amphitheatre surrounded by lush gardens for cultural street plays, music and poetry.',
    color: 0xec4899, // Pink
    position: [14, 1.5, 12],
    size: [16, 3, 16],
    beaconHeight: 6,
  },
];

export const Campus3DExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [venueEvents, setVenueEvents] = useState<Event[]>([]);
  const [isNightMode, setIsNightMode] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeTab, setActiveTab] = useState<'3D' | 'LIST'>('3D');
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const beaconsRef = useRef<{ mesh: THREE.Mesh; ring: THREE.Mesh; location: VenueLocation }[]>([]);
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const spherical = useRef({ radius: 65, theta: Math.PI / 4, phi: Math.PI / 3 });

  // Load live events from MongoDB Atlas backend
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setAllEvents(data);
    } catch (err) {
      console.error('Failed to load events for 3D Twin:', err);
    }
  };

  // Update filtered events when a venue is selected
  useEffect(() => {
    if (selectedVenue) {
      const matched = allEvents.filter(
        (e) =>
          e.venueId === selectedVenue.id ||
          (e.venueName && e.venueName.toLowerCase().includes(selectedVenue.name.toLowerCase().slice(0, 10)))
      );
      setVenueEvents(matched);
    } else {
      setVenueEvents([]);
    }
  }, [selectedVenue, allEvents]);

  // Setup Three.js Canvas
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNightMode ? 0x090d16 : 0xdbeafe);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x090d16 : 0xdbeafe, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x1e293b : 0xffffff,
      isNightMode ? 1.2 : 1.5
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      isNightMode ? 0x818cf8 : 0xfffbeb,
      isNightMode ? 1.5 : 2.0
    );
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Campus Ground Base & Grid
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x0b1120 : 0xf1f5f9,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Stylized Campus Grid Overlay
    const grid = new THREE.GridHelper(120, 40, isNightMode ? 0x312e81 : 0x93c5fd, isNightMode ? 0x1e293b : 0xe2e8f0);
    grid.position.y = 0.05;
    scene.add(grid);

    // Central Green Plaza Lawn
    const lawnGeo = new THREE.CircleGeometry(16, 32);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x064e3b : 0x86efac,
      roughness: 0.9,
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0.08, 0);
    lawn.receiveShadow = true;
    scene.add(lawn);

    // Central Fountain/Tower Monolith
    const towerGeo = new THREE.CylinderGeometry(1.5, 2.5, 12, 8);
    const towerMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x38bdf8 : 0x0284c7,
      metalness: 0.8,
      roughness: 0.2,
      emissive: isNightMode ? 0x0369a1 : 0x000000,
      emissiveIntensity: 0.4,
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 6, 0);
    tower.castShadow = true;
    scene.add(tower);

    // Campus Main Gate Arch (South edge)
    const archMat = new THREE.MeshStandardMaterial({ color: isNightMode ? 0x334155 : 0x64748b });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), archMat);
    p1.position.set(-6, 4, 38);
    scene.add(p1);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), archMat);
    p2.position.set(6, 4, 38);
    scene.add(p2);
    const crossbeam = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 2.5), archMat);
    crossbeam.position.set(0, 8, 38);
    scene.add(crossbeam);

    // Decorative Trees (Cylinder trunks + Conical foliage)
    const treePositions = [
      [-10, 0, 5], [-6, 0, 8], [8, 0, 6], [12, 0, 4],
      [-4, 0, -8], [6, 0, -9], [-28, 0, -2], [28, 0, 0],
    ];
    treePositions.forEach(([tx, ty, tz]) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2, 6),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      trunk.position.set(tx, 1, tz);
      trunk.castShadow = true;
      scene.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 4, 7),
        new THREE.MeshStandardMaterial({ color: isNightMode ? 0x047857 : 0x15803d, roughness: 0.7 })
      );
      foliage.position.set(tx, 3.8, tz);
      foliage.castShadow = true;
      scene.add(foliage);
    });

    // Build Venue Structures and Holographic Live Beacons
    beaconsRef.current = [];

    VENUE_LOCATIONS.forEach((loc) => {
      // 1. Building Block
      const bGeo = new THREE.BoxGeometry(...loc.size);
      const bMat = new THREE.MeshStandardMaterial({
        color: isNightMode ? 0x1e293b : 0xffffff,
        roughness: 0.4,
        metalness: 0.5,
      });
      const buildingMesh = new THREE.Mesh(bGeo, bMat);
      buildingMesh.position.set(...loc.position);
      buildingMesh.castShadow = true;
      buildingMesh.receiveShadow = true;
      buildingMesh.userData = { venue: loc };
      scene.add(buildingMesh);

      // Glass windows strip
      const winGeo = new THREE.BoxGeometry(loc.size[0] + 0.1, loc.size[1] * 0.4, loc.size[2] + 0.1);
      const winMat = new THREE.MeshStandardMaterial({
        color: loc.color,
        emissive: loc.color,
        emissiveIntensity: isNightMode ? 0.6 : 0.2,
        roughness: 0.1,
        metalness: 0.9,
      });
      const winMesh = new THREE.Mesh(winGeo, winMat);
      winMesh.position.set(loc.position[0], loc.position[1], loc.position[2]);
      scene.add(winMesh);

      // 2. Holographic Event Beacon Tower (Vertical Light Pillar)
      const beaconGeo = new THREE.CylinderGeometry(0.15, 0.15, loc.beaconHeight, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: loc.color,
        transparent: true,
        opacity: isNightMode ? 0.8 : 0.6,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(
        loc.position[0],
        loc.position[1] + loc.size[1] / 2 + loc.beaconHeight / 2,
        loc.position[2]
      );
      beacon.userData = { venue: loc };
      scene.add(beacon);

      // 3. Floating Holographic Beacon Ring
      const ringGeo = new THREE.TorusGeometry(1.8, 0.15, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: loc.color,
        wireframe: true,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(
        loc.position[0],
        loc.position[1] + loc.size[1] / 2 + loc.beaconHeight,
        loc.position[2]
      );
      ring.userData = { venue: loc };
      scene.add(ring);

      beaconsRef.current.push({ mesh: beacon, ring, location: loc });
    });

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Beacon Rings (floating bob & rotate)
      beaconsRef.current.forEach(({ mesh, ring }) => {
        ring.rotation.z += 0.02;
        ring.position.y += Math.sin(elapsedTime * 3) * 0.008;
      });

      // Smooth camera interpolation if focused on a building
      if (targetCamPos.current) {
        camera.position.lerp(targetCamPos.current, 0.05);
        currentLookAt.current.lerp(targetLookAt.current, 0.05);
        camera.lookAt(currentLookAt.current);

        if (camera.position.distanceTo(targetCamPos.current) < 0.2) {
          targetCamPos.current = null;
        }
      } else if (autoRotate && !isDragging.current) {
        spherical.current.theta += 0.002;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse Interaction: Drag to Rotate Orbit
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      spherical.current.theta -= dx * 0.006;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI / 2.2, spherical.current.phi - dy * 0.006));
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.current.radius = Math.max(25, Math.min(100, spherical.current.radius + e.deltaY * 0.05));
      updateCameraPosition();
    };

    // Click Detection (Raycasting)
    const onCanvasClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const interactables: THREE.Object3D[] = [];
      scene.children.forEach((child) => {
        if (child.userData && child.userData.venue) {
          interactables.push(child);
        }
      });

      const intersects = raycaster.intersectObjects(interactables, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.venue) {
          focusOnVenue(hit.userData.venue);
        }
      }
    };

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onCanvasClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [isNightMode]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = spherical.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(currentLookAt.current);
  };

  const focusOnVenue = (venue: VenueLocation) => {
    setSelectedVenue(venue);
    targetLookAt.current = new THREE.Vector3(...venue.position);
    targetCamPos.current = new THREE.Vector3(
      venue.position[0] + 16,
      venue.position[1] + 14,
      venue.position[2] + 20
    );
  };

  const resetCamera = () => {
    setSelectedVenue(null);
    targetLookAt.current = new THREE.Vector3(0, 2, 0);
    targetCamPos.current = new THREE.Vector3(45, 45, 45);
    spherical.current = { radius: 65, theta: Math.PI / 4, phi: Math.PI / 3 };
  };

  return (
    <div className="campus-3d-container" style={{ position: 'relative', width: '100%', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(6, 182, 212, 0.35)', background: '#060a14', boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7)' }}>
      {/* Top HUD Controls Bar */}
      <div className="campus-3d-hud-top" style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', pointerEvents: 'none' }}>
        {/* Title Badge */}
        <div className="campus-3d-badge" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', borderRadius: '14px', background: 'rgba(11, 19, 43, 0.9)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', display: 'flex' }}>
            <Compass style={{ width: '18px', height: '18px', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>Arya Campus 3D Digital Twin</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.35)', textTransform: 'uppercase' }}>
                WebGL Live
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Interactive Spatial Venue & Holographic Beacon Explorer</div>
          </div>
        </div>

        {/* View Mode & Toggles */}
        <div className="campus-3d-controls" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Night / Day Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="campus-3d-btn-icon"
            style={{ background: 'rgba(11, 19, 43, 0.88)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            title={isNightMode ? 'Switch to Day Light' : 'Switch to Cyberpunk Night'}
          >
            {isNightMode ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#38bdf8" />}
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isNightMode ? 'Night' : 'Day'}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="campus-3d-btn-icon"
            style={{
              background: autoRotate ? 'rgba(6, 182, 212, 0.25)' : 'rgba(11, 19, 43, 0.88)',
              border: autoRotate ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.15)',
              color: autoRotate ? '#38bdf8' : '#cbd5e1',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Toggle Cinematic Auto-Orbit"
          >
            <RotateCw size={15} className={autoRotate ? 'animate-spin' : ''} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Orbit</span>
          </button>

          {/* Reset Orbit */}
          <button
            onClick={resetCamera}
            className="campus-3d-btn-icon"
            style={{ background: 'rgba(11, 19, 43, 0.88)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Reset Camera
          </button>
        </div>
      </div>

      {/* Preset Landmark Jump Buttons (Bottom-Left Pills) */}
      <div className="campus-3d-presets" style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', maxWidth: '75%' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '6px 12px', background: 'rgba(11, 19, 43, 0.85)', backdropFilter: 'blur(8px)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          Focus Landmark:
        </span>
        {VENUE_LOCATIONS.map((loc) => {
          const isSelected = selectedVenue?.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => focusOnVenue(loc)}
              className="campus-3d-pill"
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                background: isSelected ? 'rgba(6, 182, 212, 0.3)' : 'rgba(11, 19, 43, 0.85)',
                border: isSelected ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isSelected ? '#38bdf8' : '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: `#${loc.color.toString(16).padStart(6, '0')}`,
                  display: 'inline-block',
                }}
              />
              <span>{loc.name.replace('Arya ', '')}</span>
            </button>
          );
        })}
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '560px', cursor: 'grab', outline: 'none', display: 'block' }}
      />

      {/* Interactive Venue Inspection Drawer (When Clicked) */}
      {selectedVenue && (
        <div
          className="campus-3d-drawer"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            bottom: '16px',
            width: '380px',
            maxWidth: 'calc(100% - 32px)',
            zIndex: 20,
            background: 'rgba(11, 19, 43, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(6, 182, 212, 0.45)',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
                  {selectedVenue.code}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginTop: '8px', lineHeight: 1.25 }}>
                  {selectedVenue.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Building2 size={14} color="#06b6d4" />
                  <span>{selectedVenue.building}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVenue(null)}
                style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <Users size={14} color="#818cf8" />
                  <span>Max Capacity</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {selectedVenue.capacity} Seats
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <Award size={14} color="#34d399" />
                  <span>AICTE Activity</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  +20 to 25 Pts
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {selectedVenue.description}
            </div>

            {/* Live Scheduled Events in this Venue */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#06b6d4" />
                  Scheduled Live Events ({venueEvents.length})
                </span>
                <Link to="/events" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
                  View All Events
                </Link>
              </div>

              {venueEvents.length === 0 ? (
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                  No overlapping events currently scheduled. Venue is open for club proposals with 30-min buffer.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {venueEvents.map((evt) => (
                    <div
                      key={evt.id}
                      style={{ padding: '12px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                          {evt.title}
                        </div>
                        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', whiteSpace: 'nowrap' }}>
                          +{evt.activityPointsAwarded} Pts
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.35 }}>
                        {evt.shortSummary}
                      </p>
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                        <span style={{ color: '#64748b' }}>By {evt.clubName || 'Arya College'}</span>
                        <Link
                          to="/events"
                          style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>Get Pass</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '16px', display: 'flex', gap: '8px' }}>
            <Link
              to="/events"
              className="btn-primary"
              style={{ flex: 1, padding: '10px 16px', fontSize: '0.82rem', textDecoration: 'none' }}
            >
              Explore Event Passes
            </Link>
            <button
              onClick={() => setSelectedVenue(null)}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.82rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
