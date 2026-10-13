import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Orbit, 
  Eye, 
  Focus, 
  Sparkles, 
  Info,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import {
  MultipleStarSystemData,
  MultipleStarComponent,
  getSystemVisualScale,
  getOrbitVisualScale,
  getSystemVisualExtent,
  isSubBinaryOrbit,
  calculateMultipleSystemStates,
  calculateKeplerianApsisPoints,
  generateBarycentricOrbitPoints,
  createOrbitRibbonGeometry,
  SystemOrbitalTelemetry
} from '../utils/multipleStarSystems';
import { createContinuousGridMesh, ContinuousGridHandle } from '../utils/continuousGrid';
import {
  createStarMeshGroup,
  isCompactRemnant,
  isPulsarOrNeutronStar,
  getBrownDwarfType
} from '../utils/starShaderUtils';
import { StarData } from '../types';

interface StellarSystem3DStageProps {
  system: MultipleStarSystemData;
  onStarClick?: (starId: string) => void;
  selectedStarId?: string | null;
}

export const StellarSystem3DStage: React.FC<StellarSystem3DStageProps> = ({
  system,
  onStarClick,
  selectedStarId = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const isTabVisibleRef = useRef<boolean>(true);

  const [isOrbitPlaying, setIsOrbitPlaying] = useState<boolean>(true);
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState<number>(1.0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showOrbitPaths, setShowOrbitPaths] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [focusedStarId, setFocusedStarId] = useState<string | null>(selectedStarId);
  const [telemetry, setTelemetry] = useState<SystemOrbitalTelemetry | null>(null);

  const orbitalSimTimeYearsRef = useRef<number>(0);
  const starMeshesRef = useRef<Map<string, THREE.Group | THREE.Mesh>>(new Map());
  const starPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const subBinaryOrbitGroupsRef = useRef<Map<string, { group: THREE.Group; parentId: string }>>(new Map());
  const leverArmLineRef = useRef<THREE.Line | null>(null);
  const vftsNeckMeshRef = useRef<THREE.Mesh | null>(null);
  const labelsMapRef = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const barycenterLabelRef = useRef<HTMLDivElement>(null);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const orbitLinesGroupRef = useRef<THREE.Group | null>(null);
  const gridHandleRef = useRef<ContinuousGridHandle | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedStarId !== undefined) {
      setFocusedStarId(selectedStarId);
    }
  }, [selectedStarId]);

  // Reset simulation time on system change
  useEffect(() => {
    orbitalSimTimeYearsRef.current = 0;
    setFocusedStarId(null);
  }, [system.id]);

  // Spherical camera orbit state
  const cameraStateRef = useRef<{
    radius: number;
    targetRadius: number;
    minRadius: number;
    maxRadius: number;
    theta: number;
    phi: number;
    targetTheta: number;
    targetPhi: number;
    targetCenter: THREE.Vector3;
    currentCenter: THREE.Vector3;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
  }>({
    radius: 45,
    targetRadius: 45,
    minRadius: 1.5,
    maxRadius: 250,
    theta: 0.6,
    phi: 1.1,
    targetTheta: 0.6,
    targetPhi: 1.1,
    targetCenter: new THREE.Vector3(0, 0, 0),
    currentCenter: new THREE.Vector3(0, 0, 0),
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
  });

  // Calculate visual scale for this system
  const { auToUnits, starRadiusScale, cameraDefaultRadius } = useMemo(
    () => getSystemVisualScale(system),
    [system]
  );

  const systemMaxExtent = useMemo(
    () => getSystemVisualExtent(system, auToUnits),
    [system, auToUnits]
  );

  // Set default camera distance when system changes
  useEffect(() => {
    const cam = cameraStateRef.current;
    cam.targetRadius = cameraDefaultRadius;
    cam.radius = cameraDefaultRadius;
    cam.minRadius = 1.2;
    cam.maxRadius = Math.max(180, systemMaxExtent * 2.8);
    cam.targetCenter.set(0, 0, 0);
  }, [system.id, cameraDefaultRadius, systemMaxExtent]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(40, 60, 40);
    scene.add(dirLight);

    // Continuous Ground Grid
    const gridHandle = createContinuousGridMesh({
      yLevel: -0.05,
      baseColor: 0x8b5cf6,
      majorColor: 0x3b82f6,
    });
    gridHandleRef.current = gridHandle;
    scene.add(gridHandle.mesh);

    // Dynamic Groups
    const dynamicGroup = new THREE.Group();
    dynamicGroupRef.current = dynamicGroup;
    scene.add(dynamicGroup);

    const orbitLinesGroup = new THREE.Group();
    orbitLinesGroupRef.current = orbitLinesGroup;
    scene.add(orbitLinesGroup);

    // Build Stars and Orbits
    buildSystemObjects(scene, dynamicGroup, orbitLinesGroup);

    // Tab visibility handling
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isTabVisibleRef.current) return;

      const deltaSeconds = (time - lastTime) / 1000;
      lastTime = time;

      // Advance orbital simulation time with harmonized 16-second primary period
      if (isOrbitPlaying) {
        const primaryOrbit = system.orbits[0];
        const primaryPeriodYears = primaryOrbit ? Math.max(0.0001, primaryOrbit.orbitalPeriodYears) : 10;
        // Target exactly 16.0 seconds per complete cycle of the primary binary at 1.0x speed
        const simYearsPerSec = primaryPeriodYears / 16.0;
        orbitalSimTimeYearsRef.current += deltaSeconds * simYearsPerSec * orbitSpeedMultiplier;
      }

      // Compute precise barycentric orbital positions
      const { states, telemetry: curTelemetry } = calculateMultipleSystemStates(
        system,
        orbitalSimTimeYearsRef.current,
        auToUnits
      );
      setTelemetry(curTelemetry);

      // Update positions of star meshes
      states.forEach((state, starId) => {
        const mesh = starMeshesRef.current.get(starId);
        if (mesh) {
          mesh.position.copy(state.position);
          starPositionsRef.current.set(starId, state.position);
        }
      });

      // Update positions of sub-binary orbit groups so local orbits travel with their parent stars!
      subBinaryOrbitGroupsRef.current.forEach(({ group, parentId }) => {
        const parentPos = states.get(parentId)?.position;
        if (parentPos) {
          group.position.copy(parentPos);
        }
      });

      // Update mutual center of mass lever arm line between Star 1 and Star 2
      if (leverArmLineRef.current && system.components.length >= 2) {
        const p1 = states.get(system.components[0].id)?.position;
        const p2 = states.get(system.components[1].id)?.position;
        if (p1 && p2) {
          const posAttr = leverArmLineRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
          if (posAttr) {
            posAttr.setXYZ(0, p1.x, p1.y, p1.z);
            posAttr.setXYZ(1, p2.x, p2.y, p2.z);
            posAttr.needsUpdate = true;
          }
        }
      }

      // Update contact binary neck bridge if applicable (VFTS 352 or W UMa)
      if (system.hasContactBinary && vftsNeckMeshRef.current && system.components.length >= 2) {
        const pos1 = states.get(system.components[0].id)?.position;
        const pos2 = states.get(system.components[1].id)?.position;
        if (pos1 && pos2) {
          const mid = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
          vftsNeckMeshRef.current.position.copy(mid);
          vftsNeckMeshRef.current.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3().subVectors(pos2, pos1).normalize()
          );
        }
      }

      // Smooth camera interpolation
      const cam = cameraStateRef.current;
      cam.theta += (cam.targetTheta - cam.theta) * 0.08;
      cam.phi += (cam.targetPhi - cam.phi) * 0.08;
      cam.radius += (cam.targetRadius - cam.radius) * 0.08;

      // Update camera focus center (either a specific star or the system barycenter)
      if (focusedStarId && starPositionsRef.current.has(focusedStarId)) {
        cam.targetCenter.copy(starPositionsRef.current.get(focusedStarId)!);
      } else {
        cam.targetCenter.set(0, 0, 0);
      }
      cam.currentCenter.lerp(cam.targetCenter, 0.08);

      const x = cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta);
      const y = cam.radius * Math.cos(cam.phi);
      const z = cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta);

      camera.position.set(x + cam.currentCenter.x, y + cam.currentCenter.y, z + cam.currentCenter.z);
      camera.lookAt(cam.currentCenter);

      // Update 2D HTML labels projecting onto screen
      updateProjectedLabels(camera, width, height);

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer) renderer.dispose();
      starMeshesRef.current.clear();
      starPositionsRef.current.clear();
      subBinaryOrbitGroupsRef.current.clear();
      leverArmLineRef.current = null;
    };
  }, [system, auToUnits, starRadiusScale, cameraDefaultRadius, systemMaxExtent]);

  // Function to build Three.js star objects and orbit paths
  const buildSystemObjects = (
    scene: THREE.Scene,
    dynamicGroup: THREE.Group,
    orbitLinesGroup: THREE.Group
  ) => {
    starMeshesRef.current.clear();
    starPositionsRef.current.clear();
    subBinaryOrbitGroupsRef.current.clear();
    leverArmLineRef.current = null;
    orbitLinesGroup.clear();
    dynamicGroup.clear();

    // 1. Barycenter Marker
    const barycenterGeo = new THREE.OctahedronGeometry(0.35, 0);
    const barycenterMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const barycenterMesh = new THREE.Mesh(barycenterGeo, barycenterMat);
    barycenterMesh.position.set(0, 0, 0);
    dynamicGroup.add(barycenterMesh);

    // 2. Build Each Component Star Mesh
    system.components.forEach((comp) => {
      const radiusKm = (comp.radiusSolar || 1) * 696340;
      const pseudoStarData: StarData = {
        id: comp.id,
        name: comp.name,
        alternateNames: [],
        bayerDesignation: comp.bayerDesignation || '',
        constellation: system.constellation,
        diameterKm: radiusKm * 2,
        diameterSolar: (comp.radiusSolar || 1) * 2,
        diameterAU: (radiusKm * 2) / 149597870.7,
        temperature: comp.temperature,
        spectralType: comp.spectralType,
        spectralClass: (comp.spectralType.charAt(0) as any) || 'G',
        luminositySolar: comp.luminositySolar,
        massSolar: comp.massSolar,
        estimatedAge: 'Unknown',
        estimatedAgeMyr: 1000,
        metallicityFeH: 0,
        rotationalVelocityKmS: 10,
        distanceLy: system.distanceLy,
        distanceParsecs: system.distanceLy / 3.26156,
        apparentMagnitude: 0,
        absoluteMagnitude: 0,
        surfaceGravityLogG: 4.0,
        colorHex: comp.colorHex,
        coronaColorHex: comp.coronaColorHex,
        solarEngulfment: '',
        engulfsPlanets: [],
        habitableZoneAU: { inner: 1, outer: 2 },
        exoplanetSystem: { hasExoplanets: false, confirmedCount: 0, candidateCount: 0, systemOverview: '', planets: [] },
        stellarStage: 'Main Sequence Dwarf',
        lifespanEstimate: '10 Billion Years',
        futureFate: 'White Dwarf',
        fusionProcess: 'Hydrogen Fusion',
        notableFacts: [],
        description: comp.description,
      };

      // Base visual radius in units with guaranteed physical clearance
      let baseVisualRadius = Math.max(
        0.38,
        Math.min(3.8, Math.pow(comp.radiusSolar || 1, 0.40) * 1.3 * starRadiusScale)
      );
      if (comp.isCompactRemnant) {
        baseVisualRadius = 0.45; // White dwarf visible pip
      }

      const starGroup = createStarMeshGroup(pseudoStarData, baseVisualRadius, {
        wireframe,
        showCorona: true,
        timeUniform: { value: 0 },
      });

      starGroup.position.set(0, 0, 0);
      starGroup.userData = { starId: comp.id, starName: comp.name };
      dynamicGroup.add(starGroup);
      starMeshesRef.current.set(comp.id, starGroup);
    });

    // 3. Contact Binary Plasma Bridge (VFTS 352 or W UMa)
    if (system.hasContactBinary && system.components.length >= 2) {
      const c1 = system.components[0];
      const neckRadius = Math.max(0.35, Math.pow(c1.radiusSolar, 0.38) * 1.05 * starRadiusScale);
      const neckGeo = new THREE.CylinderGeometry(neckRadius * 0.72, neckRadius * 0.72, 2.2, 24, 1, true);
      const neckMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(c1.colorHex),
        transparent: true,
        opacity: 0.65,
        wireframe: wireframe,
      });
      const neckMesh = new THREE.Mesh(neckGeo, neckMat);
      vftsNeckMeshRef.current = neckMesh;
      dynamicGroup.add(neckMesh);
    }

    // 4. Build Mathematically Accurate Keplerian Orbit Tracks
    const primaryOrbit = system.orbits[0];
    if (primaryOrbit && system.components.length >= 2) {
      const comp1 = system.components.find((c) => c.id === primaryOrbit.primaryId) || system.components[0];
      const comp2 = system.components.find((c) => c.id === primaryOrbit.secondaryId) || system.components[1];
      const m1 = Math.max(0.01, comp1.massSolar);
      const m2 = Math.max(0.01, comp2 ? comp2.massSolar : 0.5);
      const totalMass = m1 + m2;

      const aTotalAU = primaryOrbit.semiMajorAxisAU;
      const a1AU = aTotalAU * (m2 / totalMass);
      const a2AU = aTotalAU * (m1 / totalMass);

      const ribbonWidth1 = Math.max(0.12, Math.min(0.42, 0.18 * auToUnits));
      const ribbonWidth2 = Math.max(0.12, Math.min(0.42, 0.18 * auToUnits));

      // Star 1 Barycentric Orbit Track (around 0,0,0)
      const pts1 = generateBarycentricOrbitPoints(
        a1AU,
        primaryOrbit.eccentricity,
        primaryOrbit.inclinationDeg,
        primaryOrbit.ascendingNodeDeg,
        primaryOrbit.argPeriastronDeg,
        auToUnits,
        false,
        240
      );
      const color1 = new THREE.Color(comp1.colorHex || '#38bdf8');
      const ribbonGeo1 = createOrbitRibbonGeometry(pts1, ribbonWidth1);
      const ribbonMat1 = new THREE.MeshBasicMaterial({
        color: color1,
        transparent: true,
        opacity: 0.40,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      orbitLinesGroup.add(new THREE.Mesh(ribbonGeo1, ribbonMat1));

      const lineGeo1 = new THREE.BufferGeometry().setFromPoints(pts1);
      const lineMat1 = new THREE.LineBasicMaterial({
        color: color1,
        transparent: true,
        opacity: 0.88,
      });
      orbitLinesGroup.add(new THREE.LineLoop(lineGeo1, lineMat1));

      // Star 2 Barycentric Orbit Track (around 0,0,0, opposite phase)
      const pts2 = generateBarycentricOrbitPoints(
        a2AU,
        primaryOrbit.eccentricity,
        primaryOrbit.inclinationDeg,
        primaryOrbit.ascendingNodeDeg,
        primaryOrbit.argPeriastronDeg,
        auToUnits,
        true,
        240
      );
      const color2 = new THREE.Color(comp2?.colorHex || '#fb923c');
      const ribbonGeo2 = createOrbitRibbonGeometry(pts2, ribbonWidth2);
      const ribbonMat2 = new THREE.MeshBasicMaterial({
        color: color2,
        transparent: true,
        opacity: 0.40,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      orbitLinesGroup.add(new THREE.Mesh(ribbonGeo2, ribbonMat2));

      const lineGeo2 = new THREE.BufferGeometry().setFromPoints(pts2);
      const lineMat2 = new THREE.LineBasicMaterial({
        color: color2,
        transparent: true,
        opacity: 0.88,
      });
      orbitLinesGroup.add(new THREE.LineLoop(lineGeo2, lineMat2));

      // Periastron (q) & Apastron (Q) Apsis Nodes if eccentric
      if (primaryOrbit.eccentricity > 0.08) {
        const apsis1 = calculateKeplerianApsisPoints(
          a1AU,
          primaryOrbit.eccentricity,
          primaryOrbit.inclinationDeg,
          primaryOrbit.ascendingNodeDeg,
          primaryOrbit.argPeriastronDeg,
          auToUnits,
          false
        );
        const apsis2 = calculateKeplerianApsisPoints(
          a2AU,
          primaryOrbit.eccentricity,
          primaryOrbit.inclinationDeg,
          primaryOrbit.ascendingNodeDeg,
          primaryOrbit.argPeriastronDeg,
          auToUnits,
          true
        );

        const nodeRadius = Math.max(0.12, Math.min(0.38, 0.22 * auToUnits));
        const periGeo = new THREE.SphereGeometry(nodeRadius, 12, 12);
        const aphGeo = new THREE.SphereGeometry(nodeRadius * 0.82, 12, 12);

        // Star 1 Periastron & Apastron
        const periMesh1 = new THREE.Mesh(periGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 }));
        periMesh1.position.copy(apsis1.periastron);
        orbitLinesGroup.add(periMesh1);

        const aphMesh1 = new THREE.Mesh(aphGeo, new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.75 }));
        aphMesh1.position.copy(apsis1.apastron);
        orbitLinesGroup.add(aphMesh1);

        // Star 2 Periastron & Apastron
        const periMesh2 = new THREE.Mesh(periGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 }));
        periMesh2.position.copy(apsis2.periastron);
        orbitLinesGroup.add(periMesh2);

        const aphMesh2 = new THREE.Mesh(aphGeo, new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.75 }));
        aphMesh2.position.copy(apsis2.apastron);
        orbitLinesGroup.add(aphMesh2);
      }

      // Mutual Center of Mass Balance Lever-Arm Line
      const leverArmPositions = new Float32Array(6);
      const leverArmGeo = new THREE.BufferGeometry();
      leverArmGeo.setAttribute('position', new THREE.BufferAttribute(leverArmPositions, 3));
      const leverArmMat = new THREE.LineBasicMaterial({
        color: 0x818cf8,
        transparent: true,
        opacity: 0.35,
      });
      const leverArmLine = new THREE.Line(leverArmGeo, leverArmMat);
      leverArmLineRef.current = leverArmLine;
      orbitLinesGroup.add(leverArmLine);
    }

    // Subsequent Orbits (Hierarchical Companions & Sub-Binaries)
    if (system.orbits.length > 1) {
      for (let i = 1; i < system.orbits.length; i++) {
        const orb = system.orbits[i];
        const secComp = system.components.find((c) => c.id === orb.secondaryId);
        const orbitScale = getOrbitVisualScale(orb, system, auToUnits);
        const ribbonWidth = Math.max(0.08, Math.min(0.35, 0.15 * (orbitScale / auToUnits)));
        const compColor = new THREE.Color(secComp?.colorHex || '#c084fc');

        const isSubBinary = isSubBinaryOrbit(orb, primaryOrbit);

        const pts = generateBarycentricOrbitPoints(
          orb.semiMajorAxisAU,
          orb.eccentricity,
          orb.inclinationDeg,
          orb.ascendingNodeDeg,
          orb.argPeriastronDeg,
          orbitScale,
          false,
          200
        );

        const ribbonGeo = createOrbitRibbonGeometry(pts, ribbonWidth);
        const ribbonMat = new THREE.MeshBasicMaterial({
          color: compColor,
          transparent: true,
          opacity: 0.40,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);

        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
          color: compColor,
          transparent: true,
          opacity: 0.85,
        });
        const lineLoop = new THREE.LineLoop(lineGeo, lineMat);

        if (isSubBinary && orb.primaryId) {
          // Sub-binary orbits around its parent star: attach to tracking group
          const subGroup = new THREE.Group();
          subGroup.add(ribbonMesh);
          subGroup.add(lineLoop);
          orbitLinesGroup.add(subGroup);
          subBinaryOrbitGroupsRef.current.set(orb.secondaryId, {
            group: subGroup,
            parentId: orb.primaryId,
          });
        } else {
          // Wide hierarchical orbit around system barycenter
          orbitLinesGroup.add(ribbonMesh);
          orbitLinesGroup.add(lineLoop);
        }
      }
    }
  };

  // 2D HTML Label Projection on Screen
  const updateProjectedLabels = (
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number
  ) => {
    // 1. Barycenter Label
    if (barycenterLabelRef.current) {
      const p = new THREE.Vector3(0, 0, 0).project(camera);
      if (p.z < 1) {
        const x = (p.x * 0.5 + 0.5) * width;
        const y = (-(p.y * 0.5) + 0.5) * height;
        barycenterLabelRef.current.style.transform = `translate(-50%, -100%) translate(${x}px, ${y - 12}px)`;
        barycenterLabelRef.current.style.opacity = '1';
      } else {
        barycenterLabelRef.current.style.opacity = '0';
      }
    }

    // 2. Star Labels
    starPositionsRef.current.forEach((pos, starId) => {
      const el = labelsMapRef.current.get(starId);
      if (el) {
        const p = pos.clone().project(camera);
        if (p.z < 1) {
          const x = (p.x * 0.5 + 0.5) * width;
          const y = (-(p.y * 0.5) + 0.5) * height;
          el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y - 18}px)`;
          el.style.opacity = '1';
        } else {
          el.style.opacity = '0';
        }
      }
    });
  };

  // Mouse & Touch Orbit Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraStateRef.current.isDragging = true;
    cameraStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cameraStateRef.current.isDragging) return;
    const deltaX = e.clientX - cameraStateRef.current.previousMousePosition.x;
    const deltaY = e.clientY - cameraStateRef.current.previousMousePosition.y;

    const cam = cameraStateRef.current;
    cam.targetTheta -= deltaX * 0.0075;
    cam.targetPhi = Math.max(0.12, Math.min(Math.PI - 0.12, cam.targetPhi - deltaY * 0.0075));

    cam.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    cameraStateRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const cam = cameraStateRef.current;
    const zoomFactor = e.deltaY > 0 ? 1.12 : 0.88;
    cam.targetRadius = Math.max(cam.minRadius, Math.min(cam.maxRadius, cam.targetRadius * zoomFactor));
  };

  // Touch handlers
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current.dist = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;
      const cam = cameraStateRef.current;
      cam.targetTheta -= deltaX * 0.0075;
      cam.targetPhi = Math.max(0.12, Math.min(Math.PI - 0.12, cam.targetPhi - deltaY * 0.0075));
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = touchStartRef.current.dist / dist;
      const cam = cameraStateRef.current;
      cam.targetRadius = Math.max(cam.minRadius, Math.min(cam.maxRadius, cam.targetRadius * ratio));
      touchStartRef.current.dist = dist;
    }
  };

  const resetCamera = () => {
    const cam = cameraStateRef.current;
    cam.targetTheta = 0.6;
    cam.targetPhi = 1.1;
    cam.targetRadius = cameraDefaultRadius;
    setFocusedStarId(null);
  };

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] rounded-2xl overflow-hidden bg-[#030616] border border-purple-500/30 shadow-2xl flex flex-col select-none">
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      />

      {/* HTML 3D Projected Labels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Barycenter Label */}
        <div
          ref={barycenterLabelRef}
          className="absolute top-0 left-0 transition-opacity duration-150 pointer-events-auto cursor-pointer"
          onClick={() => setFocusedStarId(null)}
        >
          <div className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] whitespace-nowrap flex items-center gap-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Mutual Barycenter</span>
          </div>
        </div>

        {/* Individual Star Labels */}
        {system.components.map((comp) => (
          <div
            key={comp.id}
            ref={(el) => {
              labelsMapRef.current.set(comp.id, el);
            }}
            className="absolute top-0 left-0 transition-opacity duration-150 pointer-events-auto cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              setFocusedStarId(comp.id);
              onStarClick?.(comp.id);
            }}
          >
            <div
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold shadow-md whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md transition-all ${
                focusedStarId === comp.id
                  ? 'bg-purple-900/90 border-purple-300 text-white ring-2 ring-purple-400/50 scale-105'
                  : 'bg-black/75 border-slate-700/80 text-slate-200 group-hover:border-cyan-400 group-hover:text-cyan-300'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: comp.colorHex }}
              />
              <span>{comp.name}</span>
              <span className="text-[9px] text-slate-400 font-normal">({comp.spectralType})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Header Overlay: System Info & Simulation Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-400/40 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
              {system.systemType}
            </span>
            <span className="text-[11px] font-mono text-purple-300/80">
              {system.distanceLy} ly • {system.constellation}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-black text-white drop-shadow-md">
            {system.name}
          </h2>
          <p className="text-[10px] font-mono text-purple-300/70 hidden sm:block">
            Barycentric co-orbits centered at mutual Center of Mass (+)
          </p>
        </div>

        {/* Quick Camera Reset & Grid Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowOrbitPaths((prev) => {
              if (orbitLinesGroupRef.current) orbitLinesGroupRef.current.visible = !prev;
              return !prev;
            })}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showOrbitPaths
                ? 'bg-purple-950/80 border-purple-400/60 text-purple-300'
                : 'bg-black/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Keplerian Orbit Paths"
          >
            <Orbit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowGrid((prev) => {
              if (gridHandleRef.current) gridHandleRef.current.mesh.visible = !prev;
              return !prev;
            })}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showGrid
                ? 'bg-blue-950/80 border-blue-400/60 text-blue-300'
                : 'bg-black/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Continuous Orbital Plane Grid"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-black/60 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 text-xs font-mono transition-all cursor-pointer"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry HUD (Bottom-Left) */}
      {telemetry && (
        <div className="absolute bottom-14 sm:bottom-16 left-3 pointer-events-none">
          <div className="px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-purple-500/30 text-xs font-mono text-slate-300 space-y-1 shadow-lg pointer-events-auto max-w-[280px]">
            <div className="flex items-center justify-between gap-4 text-[11px] text-purple-300 font-bold border-b border-purple-500/20 pb-1">
              <span>ORBITAL TELEMETRY</span>
              <span className="text-cyan-400">{telemetry.orbitalPhasePercent.toFixed(0)}% Phase</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="text-slate-400">Separation:</span>
              <span className="text-white font-bold">{telemetry.currentSeparationAU} AU ({telemetry.currentSeparationKm.toLocaleString()} km)</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="text-slate-400">Rel. Speed:</span>
              <span className="text-emerald-400 font-bold">{telemetry.relativeVelocityKmS} km/s</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="text-slate-400">True Anomaly:</span>
              <span className="text-cyan-300 font-bold">{telemetry.trueAnomalyDeg}°</span>
            </div>
            {telemetry.isNearPeriastron && (
              <div className="text-[9px] text-amber-300 font-bold text-center bg-amber-950/60 rounded px-1 py-0.5 border border-amber-500/30">
                ⚡ AT PERIASTRON (CLOSEST APPROACH)
              </div>
            )}
            {telemetry.isNearApastron && (
              <div className="text-[9px] text-sky-300 font-bold text-center bg-sky-950/60 rounded px-1 py-0.5 border border-sky-500/30">
                ❄️ AT APASTRON (FURTHEST APART)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Control Bar: Focus Selector & Time Controls */}
      <div className="p-2 sm:p-2.5 bg-[#05091e]/95 backdrop-blur-xl border-t border-purple-500/25 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Star Focus Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none py-0.5">
          <span className="text-[10px] font-mono text-purple-400 font-bold px-1 shrink-0">Focus:</span>
          <button
            onClick={() => setFocusedStarId(null)}
            className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              focusedStarId === null
                ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                : 'bg-black/40 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Barycenter
          </button>
          {system.components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => {
                setFocusedStarId(comp.id);
                onStarClick?.(comp.id);
              }}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                focusedStarId === comp.id
                  ? 'bg-purple-600 border border-purple-300 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                  : 'bg-black/40 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: comp.colorHex }} />
              <span>{comp.name.replace(/Pair|\(.*\)/g, '').trim()}</span>
            </button>
          ))}
        </div>

        {/* Time Playback & Speed Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsOrbitPlaying((p) => !p)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              isOrbitPlaying
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                : 'bg-amber-950/80 border-amber-400 text-amber-300'
            }`}
            title={isOrbitPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isOrbitPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center bg-black/60 border border-slate-700 rounded-lg p-0.5 text-[10px] font-mono text-slate-300">
            {[0.5, 1.0, 2.0, 5.0].map((speed) => (
              <button
                key={speed}
                onClick={() => setOrbitSpeedMultiplier(speed)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  orbitSpeedMultiplier === speed
                    ? 'bg-purple-600 text-white font-bold'
                    : 'hover:text-white text-slate-400'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
