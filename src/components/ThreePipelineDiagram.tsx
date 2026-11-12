import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Cpu,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  X,
  Eye,
  Info
} from 'lucide-react';
import { BenchmarkResponse } from '../types';

interface StageMeta {
  id: string;
  name: string;
  phaseNumber: number | string;
  category: string;
  summary: string;
  role: string;
  traditionalDetail: string;
  aiDetail: string;
}

const COMPILER_STAGES: Record<string, StageMeta> = {
  'source': {
    id: 'source',
    name: 'Source Code Input',
    phaseNumber: 'Input',
    category: 'Source Code',
    summary: 'Your original C or C++ algorithm before any compiler translation begins.',
    role: 'Provides the raw text for analysis.',
    traditionalDetail: 'Standard C/C++ source code file.',
    aiDetail: 'Identical input ensures a 100% fair benchmark race.',
  },
  'lexical': {
    id: 'lexical',
    name: '1. Lexical Analysis (Scanner)',
    phaseNumber: 1,
    category: 'Word Scanning',
    summary: 'Reads characters and groups them into meaningful code words (tokens) like variables, numbers, and operators.',
    role: 'Strips comments, spaces, and identifies individual words.',
    traditionalDetail: 'Clang lexer generates token stream.',
    aiDetail: 'Deterministic word scanning.',
  },
  'syntax': {
    id: 'syntax',
    name: '2. Syntax Analysis (Parser)',
    phaseNumber: 2,
    category: 'Grammar Tree',
    summary: 'Validates programming grammar rules and arranges tokens into an Abstract Syntax Tree (AST).',
    role: 'Constructs the logical tree hierarchy of loops and expressions.',
    traditionalDetail: 'Clang parser builds AST.',
    aiDetail: 'Shared syntax tree verification.',
  },
  'semantic': {
    id: 'semantic',
    name: '3. Semantic Analysis (Type Checker)',
    phaseNumber: 3,
    category: 'Type Safety',
    summary: 'Checks types and meaning (for instance, ensuring you do not multiply text by numbers).',
    role: 'Decorates tree with types and binds variables in the Symbol Table.',
    traditionalDetail: 'Clang Sema checks type legality.',
    aiDetail: 'Guarantees program type safety.',
  },
  'intermediate': {
    id: 'intermediate',
    name: '4. Intermediate Code Generation',
    phaseNumber: 4,
    category: 'Universal Blueprint',
    summary: 'Translates the code tree into a clean, hardware-independent universal blueprint (LLVM IR).',
    role: 'Exposes loop structures and registers for optimization.',
    traditionalDetail: 'Standard unoptimized LLVM IR.',
    aiDetail: 'Clean SSA blueprint for Gemini AI to inspect.',
  },
  'opt-traditional': {
    id: 'opt-traditional',
    name: '5A. Traditional Optimization (-O2)',
    phaseNumber: '5A',
    category: 'Blind 120+ Passes',
    summary: 'Runs a rigid, fixed list of ~120 optimization rules blindly whether the code needs them or not.',
    role: 'Applies standard generic heuristics.',
    traditionalDetail: 'Executes ~120 passes unconditionally, wasting compilation cycles.',
    aiDetail: 'Baseline reference for speed comparison.',
  },
  'opt-ai': {
    id: 'opt-ai',
    name: '5B. AI-Assisted Optimization',
    phaseNumber: '5B',
    category: 'Smart AI Selection',
    summary: 'Gemini AI spots the nested math loops and picks only the 7 exact rules that speed up this program.',
    role: 'Bypasses 113 useless passes; applies targeted vectorization.',
    traditionalDetail: 'Replaces rigid heuristics with AI reasoning.',
    aiDetail: 'Cuts compile time and accelerates execution latency.',
  },
  'codegen': {
    id: 'codegen',
    name: '6. Target Code Generation',
    phaseNumber: 6,
    category: 'CPU Assembly',
    summary: 'Translates the optimized blueprint into real machine instructions for your CPU (x86_64).',
    role: 'Assigns CPU registers and generates native assembly.',
    traditionalDetail: 'Standard instruction lowering.',
    aiDetail: 'Lower register pressure leads to fewer memory spills.',
  },
  'machine': {
    id: 'machine',
    name: 'Machine Language Code Output',
    phaseNumber: 'Output',
    category: 'Runnable App',
    summary: 'The final runnable executable app file ready for nanosecond benchmarking.',
    role: 'Executes iterations and records speed and output verification.',
    traditionalDetail: 'Baseline binary.',
    aiDetail: 'AI-accelerated executable.',
  },
  'symbol-table': {
    id: 'symbol-table',
    name: 'Symbol Table Manager',
    phaseNumber: 'Lookup',
    category: 'Central Phonebook',
    summary: 'The central catalog tracking every variable name, memory spot, and data type across all compiler phases.',
    role: 'Connected to all 6 phases for variable lookups.',
    traditionalDetail: 'Clang IdentifierTable & Scope.',
    aiDetail: 'Provides variable binding information.',
  },
  'error-handling': {
    id: 'error-handling',
    name: 'Error Handling & Safety',
    phaseNumber: 'Guard',
    category: 'Diagnostic Sentinel',
    summary: 'Monitors all compiler phases to catch syntax mistakes, type conflicts, and bad code safely.',
    role: 'Reports errors and stops bad code from running.',
    traditionalDetail: 'Clang DiagnosticsEngine.',
    aiDetail: 'Validates AI pass safety.',
  },
};

export interface ThreePipelineDiagramProps {
  isDark?: boolean;
  isRunning?: boolean;
  benchmarkStep?: string;
  currentResult?: BenchmarkResponse | null;
  onRunBenchmark?: () => void;
  programName?: string;
  onOpenStudio?: () => void;
  heightClass?: string;
}

export const ThreePipelineDiagram: React.FC<ThreePipelineDiagramProps> = ({
  isDark = true,
  isRunning = false,
  benchmarkStep = '',
  currentResult = null,
  onRunBenchmark,
  programName = 'Matrix Multiplication O(N³)',
  onOpenStudio,
  heightClass = 'h-[720px]',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const floorMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  const animStateRef = useRef({
    isPlaying: true,
    speed: 1,
  });

  useEffect(() => {
    animStateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    animStateRef.current.speed = isRunning ? 2.5 : speed;
  }, [speed, isRunning]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 640;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgHex = isDark ? 0x000000 : 0xF5F5F7;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.018);

    // 2. Camera: isometric perspective view overlooking the whole pipeline
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0, 16, 26);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 8;
    controls.maxDistance = 55;
    controls.target.set(0, 0, 0);

    // 6. Monochrome Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.8 : 2.0);
    keyLight.position.set(15, 25, 18);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa1a1aa, 0.7);
    fillLight.position.set(-15, 15, -15);
    scene.add(fillLight);

    // 7. Ground Grid
    const gridHelper = new THREE.GridHelper(70, 70, isDark ? 0x3f3f46 : 0xd4d4d8, isDark ? 0x18181b : 0xe4e4e7);
    gridHelper.position.y = -2;
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    const floorGeo = new THREE.PlaneGeometry(90, 90);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x09090b : 0xeeeeF2,
      roughness: 0.9,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    floorMatRef.current = floorMat;
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.01;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // ================= BUILD EXACT COMPILER PIPELINE =================
    // Materials (Monochrome: Titanium, Obsidian, Chrome, Wireframe)
    const matTitanium = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.8, roughness: 0.25 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, metalness: 0.95, roughness: 0.1 });
    const matObsidian = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.6, roughness: 0.3 });
    const matGlowingWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const matWireframe = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.35 });

    const stageMeshes: Record<string, THREE.Group> = {};
    const raycastTargets: THREE.Object3D[] = [];

    // Helper: Build a stage platform with label
    const createStagePlatform = (
      id: string,
      x: number,
      z: number,
      coreMesh: THREE.Object3D,
      pedestalW = 2.4,
      pedestalD = 2.4
    ) => {
      const g = new THREE.Group();
      g.userData = { stageId: id };

      // Base Pedestal
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(pedestalW, 0.4, pedestalD), matObsidian);
      baseMesh.position.y = -1.8;
      baseMesh.receiveShadow = !isSoftwareGl;
      baseMesh.castShadow = !isSoftwareGl;
      g.add(baseMesh);

      // Top Rim
      const rimMesh = new THREE.Mesh(new THREE.BoxGeometry(pedestalW + 0.1, 0.08, pedestalD + 0.1), matTitanium);
      rimMesh.position.y = -1.56;
      g.add(rimMesh);

      // Core model
      coreMesh.position.y = 0;
      g.add(coreMesh);

      // Selection Ring
      const ringGeo = new THREE.RingGeometry(pedestalW * 0.6, pedestalW * 0.68, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.94;
      ring.name = 'selectionRing';
      g.add(ring);

      // Raycast hitbox
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(pedestalW + 0.6, 3.8, pedestalD + 0.6),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.userData = { stageId: id };
      g.add(hitBox);
      raycastTargets.push(hitBox);

      g.position.set(x, 0, z);
      scene.add(g);
      stageMeshes[id] = g;
      return g;
    };

    // Central pipeline runs along X axis: from -14 to +14
    // 1. Source Code Input (X = -13, Z = 0)
    const sourceCore = new THREE.Group();
    sourceCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.4), matTitanium));
    sourceCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.05, 0.45), matWireframe));
    createStagePlatform('source', -13, 0, sourceCore);

    // 2. Lexical Analysis (X = -9.2, Z = 0)
    const lexCore = new THREE.Group();
    lexCore.add(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 1.6, 6), matChrome));
    lexCore.add(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 1.65, 6), matWireframe));
    createStagePlatform('lexical', -9.2, 0, lexCore);

    // 3. Syntax Analysis (X = -5.4, Z = 0)
    const synCore = new THREE.Group();
    synCore.add(new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), matChrome));
    synCore.add(new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 1), matWireframe));
    createStagePlatform('syntax', -5.4, 0, synCore);

    // 4. Semantic Analysis (X = -1.6, Z = 0)
    const semCore = new THREE.Group();
    semCore.add(new THREE.Mesh(new THREE.DodecahedronGeometry(1.0, 0), matTitanium));
    semCore.add(new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 0), matWireframe));
    createStagePlatform('semantic', -1.6, 0, semCore);

    // 5. Intermediate Code Gen (LLVM SSA IR) (X = 2.2, Z = 0)
    const irCore = new THREE.Group();
    irCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), matTitanium));
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), matChrome);
      node.position.set(i % 2 === 0 ? 0.4 : -0.4, i < 2 ? 0.4 : -0.4, 0);
      irCore.add(node);
    }
    createStagePlatform('intermediate', 2.2, 0, irCore);

    // ================= 6. CODE OPTIMIZATION FORK =================
    // At Code Optimization (X = 6.2), the pipeline forks into two distinct platforms:
    // 6A. Traditional Optimization (Z = -2.8): Fixed -O2 Passes
    const optTradCore = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.9 - i * 0.22, 0.08, 16, 32), matTitanium);
      r.rotation.x = Math.PI / 2;
      r.position.y = (i - 1) * 0.45;
      optTradCore.add(r);
    }
    optTradCore.add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 16), matObsidian));
    createStagePlatform('opt-traditional', 6.2, -2.8, optTradCore, 2.6, 2.2);

    // 6B. AI-Assisted Optimization (Z = +2.8): Gemini Cognitive IR Core + Passes
    const optAICore = new THREE.Group();
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), matChrome);
    optAICore.add(ico);
    const synIco = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), matWireframe);
    optAICore.add(synIco);
    const ringOrbit = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 16, 48), matGlowingWhite);
    ringOrbit.rotation.x = Math.PI / 3;
    ringOrbit.name = 'aiOrbit';
    optAICore.add(ringOrbit);
    createStagePlatform('opt-ai', 6.2, 2.8, optAICore, 2.6, 2.2);

    // 7. Code Generation (X = 10.2, Z = 0)
    const codeGenCore = new THREE.Group();
    codeGenCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.6), matObsidian));
    const die = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), matChrome);
    die.position.y = 0.2;
    codeGenCore.add(die);
    createStagePlatform('codegen', 10.2, 0, codeGenCore);

    // 8. Machine Language Code (Executable Binary) (X = 13.8, Z = 0)
    const machineCore = new THREE.Group();
    machineCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), matChrome));
    machineCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.55, 1.55), matWireframe));
    createStagePlatform('machine', 13.8, 0, machineCore);

    // ================= FLANKING ARCHITECTURAL TOWERS =================
    // Left: Symbol Table Tower (X = 0, Z = -6.5)
    const symTableCore = new THREE.Group();
    symTableCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.6), matObsidian));
    symTableCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.65, 3.25, 1.65), matWireframe));
    createStagePlatform('symbol-table', 0, -6.8, symTableCore, 2.8, 2.8);

    // Right: Error Handling Sentinel Tower (X = 0, Z = +6.8)
    const errCore = new THREE.Group();
    errCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.6), matObsidian));
    errCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.65, 3.25, 1.65), matWireframe));
    createStagePlatform('error-handling', 0, 6.8, errCore, 2.8, 2.8);

    // ================= CONNECTING CONDUIT GUIDE LINES =================
    const conduitMat = new THREE.LineBasicMaterial({ color: 0x52525b, transparent: true, opacity: 0.5 });
    const busMat = new THREE.LineDashedMaterial({ color: 0x71717a, dashSize: 0.4, gapSize: 0.25, transparent: true, opacity: 0.45 });

    // Main line from Source to Intermediate
    const mainPoints1 = [
      new THREE.Vector3(-13, -1.8, 0),
      new THREE.Vector3(2.2, -1.8, 0),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mainPoints1), conduitMat));

    // Fork lines from Intermediate (X=2.2) to Trad Opt (X=6.2, Z=-2.8) and AI Opt (X=6.2, Z=2.8)
    const forkTrad = [
      new THREE.Vector3(2.2, -1.8, 0),
      new THREE.Vector3(6.2, -1.8, -2.8),
      new THREE.Vector3(10.2, -1.8, 0),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(forkTrad), conduitMat));

    const forkAI = [
      new THREE.Vector3(2.2, -1.8, 0),
      new THREE.Vector3(6.2, -1.8, 2.8),
      new THREE.Vector3(10.2, -1.8, 0),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(forkAI), conduitMat));

    // End line from CodeGen to Machine Code
    const mainPoints2 = [
      new THREE.Vector3(10.2, -1.8, 0),
      new THREE.Vector3(13.8, -1.8, 0),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mainPoints2), conduitMat));

    // Symbol Table Bus lines connecting to stages (matching user diagram!)
    const stageXPositions = [-9.2, -5.4, -1.6, 2.2, 6.2, 10.2];
    stageXPositions.forEach((xPos) => {
      const symPoints = [
        new THREE.Vector3(0, -1.8, -6.8),
        new THREE.Vector3(xPos, -1.8, -6.8),
        new THREE.Vector3(xPos, -1.8, xPos === 6.2 ? -2.8 : 0),
      ];
      const symLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(symPoints), busMat);
      symLine.computeLineDistances();
      scene.add(symLine);

      // Error Handling Bus lines connecting to stages
      const errPoints = [
        new THREE.Vector3(0, -1.8, 6.8),
        new THREE.Vector3(xPos, -1.8, 6.8),
        new THREE.Vector3(xPos, -1.8, xPos === 6.2 ? 2.8 : 0),
      ];
      const errLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(errPoints), busMat);
      errLine.computeLineDistances();
      scene.add(errLine);
    });

    // ================= FLOWING DATA INSTRUCTION PARTICLES =================
    const packetCount = 18;
    const packetGeo = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    const packetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
    });
    const packets: { mesh: THREE.Mesh; progress: number; path: 'trad' | 'ai' }[] = [];

    for (let i = 0; i < packetCount; i++) {
      const p = new THREE.Mesh(packetGeo, packetMat);
      scene.add(p);
      packets.push({
        mesh: p,
        progress: i / packetCount,
        path: i % 2 === 0 ? 'trad' : 'ai',
      });
    }

    // Helper: calculate position along pipeline
    const getPipelinePosition = (t: number, path: 'trad' | 'ai') => {
      const startX = -13;
      const endX = 13.8;
      const totalLen = endX - startX;
      const curX = startX + t * totalLen;

      let curZ = 0;
      if (curX > 2.2 && curX < 10.2) {
        // In the optimization chamber fork
        const segT = (curX - 2.2) / (10.2 - 2.2);
        const maxZ = path === 'trad' ? -2.8 : 2.8;
        curZ = Math.sin(segT * Math.PI) * maxZ;
      }

      return new THREE.Vector3(curX, -0.6, curZ);
    };

    // Raycast handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        const id = intersects[0].object.userData.stageId;
        setHoveredStageId(id);
        container.style.cursor = 'pointer';
      } else {
        setHoveredStageId(null);
        container.style.cursor = 'default';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        const id = intersects[0].object.userData.stageId;
        setSelectedStageId((prev) => (prev === id ? null : id));
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // ================= TICK ANIMATION LOOP =================
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const { isPlaying: playing, speed: simSpeed } = animStateRef.current;

      // Update pedestals & selection rings
      Object.entries(stageMeshes).forEach(([id, grp]) => {
        const ring = grp.getObjectByName('selectionRing') as THREE.Mesh;
        if (ring) {
          const isSelected = id === selectedStageId;
          const isHovered = id === hoveredStageId;
          const targetOpacity = isSelected ? 0.9 : isHovered ? 0.45 : 0;
          (ring.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.damp(
            (ring.material as THREE.MeshBasicMaterial).opacity,
            targetOpacity,
            8,
            delta
          );
        }

        // Idle rotation of stage core models
        if (playing) {
          const core = grp.children[2];
          if (core) {
            core.rotation.y += delta * 0.3 * simSpeed;
            if (id === 'opt-ai') {
              const orbit = core.getObjectByName('aiOrbit');
              if (orbit) orbit.rotation.z += delta * 1.6 * simSpeed;
            }
          }
        }
      });

      // Animate flowing instruction packets along the conveyor
      if (playing) {
        const flowStep = delta * 0.12 * simSpeed;
        packets.forEach((p, idx) => {
          p.progress = (p.progress + flowStep) % 1.0;
          const pos = getPipelinePosition(p.progress, p.path);
          p.mesh.position.copy(pos);
          p.mesh.position.y += Math.sin(elapsed * 4 + idx) * 0.08;
          p.mesh.rotation.y += delta * 2;
        });
      }

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedStageId, hoveredStageId]);

  // Handle dynamic theme changes
  useEffect(() => {
    if (sceneRef.current) {
      const bgHex = isDark ? 0x000000 : 0xF5F5F7;
      sceneRef.current.background = new THREE.Color(bgHex);
      if (sceneRef.current.fog) {
        (sceneRef.current.fog as THREE.FogExp2).color.setHex(bgHex);
      }
    }
    if (floorMatRef.current) {
      floorMatRef.current.color.setHex(isDark ? 0x09090b : 0xeeeeF2);
    }
  }, [isDark]);

  const activeStage = selectedStageId ? COMPILER_STAGES[selectedStageId] : null;

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 16, 26);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleViewPreset = (preset: 'overview' | 'opt-fork' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (preset === 'overview') {
      cameraRef.current.position.set(0, 16, 26);
      controlsRef.current.target.set(0, 0, 0);
    } else if (preset === 'opt-fork') {
      cameraRef.current.position.set(6.2, 7, 12);
      controlsRef.current.target.set(6.2, 0, 0);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 32, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl apple-glass overflow-hidden flex flex-col font-sans select-none transition-colors duration-300`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />

      {/* Top Left Floating Pill: Title & Context */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center space-x-3">
        <div className="px-4 py-2.5 rounded-2xl apple-glass-pill pointer-events-auto shadow-sm text-xs space-y-0.5 max-w-md">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span className="font-semibold tracking-tight text-black dark:text-white text-xs">
              Live 3D Compiler Architecture
            </span>
            <span className="text-zinc-400">•</span>
            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
              {programName}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            Interactive spatial model of the 6 canonical compiler construction phases with Symbol Table & Error Handling.
          </p>
        </div>
      </div>

      {/* Live Benchmark Execution Notification */}
      {isRunning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2.5 px-4 py-2 rounded-full apple-glass shadow-lg animate-pulse text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-black dark:bg-white animate-ping" />
          <span className="font-semibold text-black dark:text-white">
            {benchmarkStep || 'Simultaneously compiling through both optimization branches...'}
          </span>
        </div>
      )}

      {/* Top Right Action Pill: Camera presets & Compare button */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        {onRunBenchmark && (
          <button
            onClick={onRunBenchmark}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 ${
              isRunning
                ? 'opacity-60 cursor-not-allowed bg-zinc-400 text-white'
                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run Comparison</span>
          </button>
        )}

        {/* View presets */}
        <div className="flex items-center p-1 rounded-xl apple-glass-pill text-xs">
          <button
            onClick={() => handleViewPreset('overview')}
            className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white text-[11px] font-medium cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => handleViewPreset('opt-fork')}
            className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white text-[11px] font-medium cursor-pointer"
          >
            Optimization Fork
          </button>
          <button
            onClick={() => handleViewPreset('top')}
            className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white text-[11px] font-medium cursor-pointer"
          >
            Top-Down
          </button>
        </div>
      </div>

      {/* Bottom Floating Clean Playback Bar (Non-obstructive) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 px-4 py-2 rounded-2xl apple-glass shadow-lg text-xs font-mono">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm text-[11px]"
        >
          {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Resume'}</span>
        </button>

        <span className="text-zinc-300 dark:text-zinc-700">|</span>

        <div className="flex items-center space-x-1 text-zinc-500">
          <span>Speed:</span>
          {[1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-lg text-[10px] cursor-pointer ${
                speed === s
                  ? 'bg-black/[0.08] dark:bg-white/[0.1] text-black dark:text-white font-bold'
                  : 'hover:text-black dark:hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <span className="text-zinc-300 dark:text-zinc-700">|</span>

        <button
          onClick={handleResetCamera}
          className="flex items-center space-x-1 text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer text-[11px]"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Camera</span>
        </button>

        <span className="text-zinc-300 dark:text-zinc-700">|</span>

        <span className="text-[11px] text-zinc-400 font-sans hidden sm:inline">
          Click any 3D node to inspect details
        </span>
      </div>

      {/* Non-Intrusive Bottom Stage Detail Card (Only shown when a node is clicked!) */}
      {activeStage && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl rounded-2xl apple-glass shadow-2xl p-4 text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-black dark:bg-white text-white dark:text-black">
                Phase {activeStage.phaseNumber}
              </span>
              <div>
                <h4 className="text-sm font-bold text-black dark:text-white">
                  {activeStage.name}
                </h4>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {activeStage.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStageId(null)}
              className="w-6 h-6 rounded-full apple-glass-pill flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed">
            {activeStage.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block mb-0.5">Traditional Pipeline</span>
              <span className="text-zinc-800 dark:text-zinc-200">{activeStage.traditionalDetail}</span>
            </div>
            <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block mb-0.5">AI-Assisted Approach</span>
              <span className="text-zinc-800 dark:text-zinc-200">{activeStage.aiDetail}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
