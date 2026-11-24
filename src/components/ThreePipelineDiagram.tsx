import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
  Play,
  Pause,
  RotateCcw,
  X,
  ArrowDown
} from 'lucide-react';
import { BenchmarkResponse } from '../types';

interface StageMeta {
  id: string;
  shortLabel: string;
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
    shortLabel: 'START: Source Code',
    name: 'START: Source Code Input',
    phaseNumber: 'START',
    category: 'Beginning of Pipeline',
    summary: 'Your original C or C++ algorithm enters at the top of the compiler.',
    role: 'Provides the raw text for analysis.',
    traditionalDetail: 'Standard C/C++ source code file.',
    aiDetail: 'Identical input ensures a 100% fair benchmark race.',
  },
  'lexical': {
    id: 'lexical',
    shortLabel: '1. Lexical (Scanner)',
    name: '1. Lexical Analysis (Scanner)',
    phaseNumber: 1,
    category: 'Phase 1 • Word Scanning',
    summary: 'Reads characters and groups them into meaningful words like variable names, numbers, and math symbols.',
    role: 'Ignores comments and blank spaces to isolate individual code words.',
    traditionalDetail: 'Scans text into a stream of words.',
    aiDetail: 'Identical first step for both compilers.',
  },
  'syntax': {
    id: 'syntax',
    shortLabel: '2. Syntax (Parser)',
    name: '2. Syntax Analysis (Parser)',
    phaseNumber: 2,
    category: 'Phase 2 • Structure Tree',
    summary: 'Checks that the code follows grammar rules and organizes it into a tree of loops, conditions, and math.',
    role: 'Builds the logical outline of the program.',
    traditionalDetail: 'Builds the standard program outline.',
    aiDetail: 'Uses the exact same verified program outline.',
  },
  'semantic': {
    id: 'semantic',
    shortLabel: '3. Semantic Analysis',
    name: '3. Semantic Analysis',
    phaseNumber: 3,
    category: 'Phase 3 • Type Safety',
    summary: 'Makes sure operations make sense (for example, ensuring you do not try to multiply text by a number).',
    role: 'Verifies data types and links every variable to the Variable Table.',
    traditionalDetail: 'Confirms every variable and type is valid.',
    aiDetail: 'Guarantees the program is safe before optimizing.',
  },
  'intermediate': {
    id: 'intermediate',
    shortLabel: '4. Intermediate Code',
    name: '4. Intermediate Code Generation',
    phaseNumber: 4,
    category: 'Phase 4 • Universal Blueprint',
    summary: 'Turns the code into a clean, step-by-step internal blueprint that works on any type of computer.',
    role: 'Exposes loops and repeated math before splitting into the two optimization paths.',
    traditionalDetail: 'Creates the starting blueprint.',
    aiDetail: 'Creates a clean blueprint for the AI to inspect.',
  },
  'opt-traditional': {
    id: 'opt-traditional',
    shortLabel: '5A. Normal Opt (-O2)',
    name: '5A. Code Optimization (-O2)',
    phaseNumber: '5A',
    category: 'Left Branch • Blind 120+ Checks',
    summary: 'Runs a rigid, fixed checklist of ~120 cleanup rules blindly whether the code needs them or not.',
    role: 'Applies every general-purpose rule in sequence.',
    traditionalDetail: 'Runs ~120 checks every time, wasting time on rules that find nothing.',
    aiDetail: 'Baseline reference for speed comparison.',
  },
  'opt-ai': {
    id: 'opt-ai',
    shortLabel: '5B. AI Optimization',
    name: '5B. Code Optimization (AI-Guided)',
    phaseNumber: '5B',
    category: 'Right Branch • Smart Selection',
    summary: 'AI spots the slow parts (like nested loops) and picks only the 5 to 7 exact speedup tools this program needs.',
    role: 'Skips ~113 useless checks and focuses directly on the real bottlenecks.',
    traditionalDetail: 'Replaces blind checklists with targeted diagnosis.',
    aiDetail: 'Cuts optimization time while keeping the app running at top speed.',
  },
  'codegen': {
    id: 'codegen',
    shortLabel: '6. Target Code Gen',
    name: '6. Target Code Generation',
    phaseNumber: 6,
    category: 'Phase 6 • Machine Translation',
    summary: 'Translates the finished blueprint into direct instructions that your computer processor can run.',
    role: 'Maps data to fast processor registers and emits executable code.',
    traditionalDetail: 'Standard translation to processor instructions.',
    aiDetail: 'Cleaner blueprint makes final translation smoother.',
  },
  'machine': {
    id: 'machine',
    shortLabel: 'END: Final Program',
    name: 'END: Final Runnable Program',
    phaseNumber: 'END',
    category: 'End of Pipeline',
    summary: 'The finished runnable program exits at the bottom of the pipeline ready to be timed side by side.',
    role: 'Runs multiple times to measure speed and confirm identical output.',
    traditionalDetail: 'Standard compiled program.',
    aiDetail: 'AI-optimized program.',
  },
  'symbol-table': {
    id: 'symbol-table',
    shortLabel: 'Variable Table',
    name: 'Variable Table (Symbol Table)',
    phaseNumber: 'LEFT',
    category: 'Connected Across Phases 1–6',
    summary: 'A central lookup table on the left tracking every variable name, memory location, and type across all 6 steps.',
    role: 'Connected to all 6 phases via horizontal lookup lines.',
    traditionalDetail: 'Tracks every variable name and scope.',
    aiDetail: 'Helps confirm variable usage stays accurate.',
  },
  'error-handling': {
    id: 'error-handling',
    shortLabel: 'Error Checker',
    name: 'Error Checker & Safety',
    phaseNumber: 'RIGHT',
    category: 'Connected Across Phases 1–6',
    summary: 'Monitors every phase from the right side to catch typos, grammar mistakes, and unsafe operations.',
    role: 'Connected to all 6 phases so errors are caught immediately.',
    traditionalDetail: 'Stops compilation if syntax errors are found.',
    aiDetail: 'Verifies that every AI-selected tool is safe to apply.',
  },
};

const PIPELINE_ORDER = [
  'source',
  'lexical',
  'syntax',
  'semantic',
  'intermediate',
  'opt-traditional',
  'opt-ai',
  'codegen',
  'machine',
];

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
  isRunning = false,
  benchmarkStep = '',
  onRunBenchmark,
  programName = 'Matrix Multiplication O(N³)',
  heightClass = 'h-[560px] sm:h-[760px]',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [selectedStageId, setSelectedStageId] = useState<string | null>('lexical');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);

  // Refs used inside the 120Hz WebGL loop so scene NEVER tears down or rebuilds on hover/select
  const selectedStageIdRef = useRef<string | null>('lexical');
  const hoveredStageIdRef = useRef<string | null>(null);
  const labelButtonsRef = useRef<Record<string, { btn: HTMLButtonElement; variant: 'default' | 'coral' | 'endpoint' }>>({});
  const animStateRef = useRef({
    isPlaying: true,
    speed: 1,
  });

  useEffect(() => {
    selectedStageIdRef.current = selectedStageId;
    // Update native DOM label highlight immediately without touching Three.js
    Object.entries(labelButtonsRef.current).forEach(([id, entry]) => {
      const { btn, variant } = entry;
      const isSelected = id === selectedStageId;
      btn.style.outline = isSelected ? '3px solid #D97757' : 'none';
      btn.style.outlineOffset = isSelected ? '2px' : '0px';
      if (isSelected && variant === 'default') {
        btn.style.borderColor = '#141413';
      } else if (variant === 'default') {
        btn.style.borderColor = '#D9D6CA';
      }
    });
  }, [selectedStageId]);

  useEffect(() => {
    animStateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    animStateRef.current.speed = isRunning ? 2.5 : speed;
  }, [speed, isRunning]);

  // Mount Three.js + CSS2DRenderer ONCE ([]) for sustained 120fps / 120Hz smoothness
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 720;

    const scene = new THREE.Scene();
    const bgHex = 0x141413;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.011);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0, 26, 22);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Razor-sharp native HTML/Retina floating labels layered cleanly over WebGL
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.overflow = 'hidden';
    container.appendChild(labelRenderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.95;
    controls.panSpeed = 0.85;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.target.set(0, 0, -0.5);

    let isDragging = false;
    const onControlStart = () => {
      isDragging = true;
    };
    const onControlEnd = () => {
      isDragging = false;
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    const ambientLight = new THREE.AmbientLight(0xfaf9f5, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfaf9f5, 1.75);
    keyLight.position.set(14, 28, 16);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd97757, 0.75);
    fillLight.position.set(-15, 16, -15);
    scene.add(fillLight);

    const gridHelper = new THREE.GridHelper(56, 48, 0x5e5d57, 0x262523);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x141413,
      roughness: 0.92,
      metalness: 0.08,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.01;
    scene.add(floor);

    const matMuted = new THREE.MeshStandardMaterial({ color: 0x5e5d57, metalness: 0.4, roughness: 0.35 });
    const matCream = new THREE.MeshStandardMaterial({ color: 0xf0eee6, metalness: 0.3, roughness: 0.3 });
    const matDarkBase = new THREE.MeshStandardMaterial({ color: 0x242321, metalness: 0.4, roughness: 0.4 });
    const matCoral = new THREE.MeshStandardMaterial({ color: 0xd97757, metalness: 0.25, roughness: 0.3 });
    const matWireframe = new THREE.MeshBasicMaterial({ color: 0xc9c6ba, wireframe: true, transparent: true, opacity: 0.35 });

    const stageMeshes: Record<string, THREE.Group> = {};
    const raycastTargets: THREE.Object3D[] = [];
    const disposables: { dispose: () => void }[] = [
      floorGeo, floorMat, matMuted, matCream, matDarkBase, matCoral, matWireframe, envTex,
    ];

    const createHtmlLabel = (id: string, text: string, variant: 'default' | 'coral' | 'endpoint') => {
      const wrapper = document.createElement('div');
      wrapper.style.pointerEvents = 'none';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = text;
      btn.style.pointerEvents = 'auto';
      btn.style.cursor = 'pointer';
      btn.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      btn.style.fontSize = '12px';
      btn.style.fontWeight = '600';
      btn.style.lineHeight = '1.15';
      btn.style.whiteSpace = 'nowrap';
      btn.style.padding = '5px 12px';
      btn.style.borderRadius = '9999px';
      btn.style.letterSpacing = '-0.01em';
      btn.style.borderWidth = '2px';
      btn.style.borderStyle = 'solid';
      btn.style.transition = 'transform 150ms ease, outline 150ms ease';
      btn.style.setProperty('-webkit-font-smoothing', 'antialiased');

      if (variant === 'coral') {
        btn.style.backgroundColor = '#D97757';
        btn.style.borderColor = '#FAF9F5';
        btn.style.color = '#141413';
      } else if (variant === 'endpoint') {
        btn.style.backgroundColor = '#141413';
        btn.style.borderColor = '#D97757';
        btn.style.color = '#FAF9F5';
      } else {
        btn.style.backgroundColor = '#FAF9F5';
        btn.style.borderColor = '#D9D6CA';
        btn.style.color = '#141413';
      }

      if (selectedStageIdRef.current === id) {
        btn.style.outline = '3px solid #D97757';
        btn.style.outlineOffset = '2px';
      }

      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        setSelectedStageId((prev) => (prev === id ? null : id));
      });

      wrapper.appendChild(btn);
      labelButtonsRef.current[id] = { btn, variant };
      return new CSS2DObject(wrapper);
    };

    const createStagePlatform = (
      id: string,
      x: number,
      z: number,
      coreMesh: THREE.Object3D,
      labelVariant: 'default' | 'coral' | 'endpoint' = 'default',
      pedestalW = 2.6,
      pedestalD = 2.1
    ) => {
      const g = new THREE.Group();
      g.userData = { stageId: id };

      const baseGeo = new THREE.BoxGeometry(pedestalW, 0.4, pedestalD);
      const baseMesh = new THREE.Mesh(baseGeo, matDarkBase);
      baseMesh.position.y = -1.8;
      g.add(baseMesh);

      const rimGeo = new THREE.BoxGeometry(pedestalW + 0.1, 0.08, pedestalD + 0.1);
      const rimMesh = new THREE.Mesh(rimGeo, matMuted);
      rimMesh.position.y = -1.56;
      g.add(rimMesh);

      coreMesh.position.y = -0.2;
      g.add(coreMesh);

      const meta = COMPILER_STAGES[id];
      if (meta) {
        const labelObj = createHtmlLabel(id, meta.shortLabel, labelVariant);
        labelObj.position.set(0, 1.75, 0);
        g.add(labelObj);
      }

      const ringGeo = new THREE.RingGeometry(pedestalW * 0.58, pedestalW * 0.68, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd97757,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.94;
      ring.name = 'selectionRing';
      g.add(ring);

      const hitGeo = new THREE.BoxGeometry(pedestalW + 1.0, 3.8, pedestalD + 0.8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitGeo, hitMat);
      hitBox.userData = { stageId: id };
      g.add(hitBox);
      raycastTargets.push(hitBox);

      disposables.push(baseGeo, rimGeo, ringGeo, ringMat, hitGeo, hitMat);

      g.position.set(x, 0, z);
      scene.add(g);
      stageMeshes[id] = g;
      return g;
    };

    const arrowGeo = new THREE.ConeGeometry(0.28, 0.65, 12);
    const arrowMatDefault = new THREE.MeshBasicMaterial({ color: 0xc9c6ba });
    const arrowMatCoral = new THREE.MeshBasicMaterial({ color: 0xd97757 });
    disposables.push(arrowGeo, arrowMatDefault, arrowMatCoral);

    const addFlowArrow = (from: THREE.Vector3, to: THREE.Vector3, isCoral = false) => {
      const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(to, from).normalize();
      const cone = new THREE.Mesh(arrowGeo, isCoral ? arrowMatCoral : arrowMatDefault);
      cone.position.copy(mid);
      cone.position.y = -1.65;
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      scene.add(cone);
    };

    // ================= TOP-TO-BOTTOM LAYOUT (Z: -15.5 START -> +14.2 END) =================
    const sourceCore = new THREE.Group();
    sourceCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.45), matCoral));
    sourceCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.65, 0.5), matWireframe));
    createStagePlatform('source', 0, -15.5, sourceCore, 'endpoint');

    const lexCore = new THREE.Group();
    lexCore.add(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 1.3, 6), matCream));
    lexCore.add(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.95, 1.35, 6), matWireframe));
    createStagePlatform('lexical', 0, -11.5, lexCore, 'default');

    const synCore = new THREE.Group();
    synCore.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), matCream));
    synCore.add(new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 1), matWireframe));
    createStagePlatform('syntax', 0, -7.5, synCore, 'default');

    const semCore = new THREE.Group();
    semCore.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), matMuted));
    semCore.add(new THREE.Mesh(new THREE.DodecahedronGeometry(1.08, 0), matWireframe));
    createStagePlatform('semantic', 0, -3.5, semCore, 'default');

    const irCore = new THREE.Group();
    irCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 1.35), matMuted));
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), matCream);
      node.position.set(i % 2 === 0 ? 0.35 : -0.35, i < 2 ? 0.35 : -0.35, 0);
      irCore.add(node);
    }
    createStagePlatform('intermediate', 0, 0.5, irCore, 'default');

    const optTradCore = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.8 - i * 0.2, 0.07, 12, 24), matMuted);
      r.rotation.x = Math.PI / 2;
      r.position.y = (i - 1) * 0.38;
      optTradCore.add(r);
    }
    optTradCore.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.35, 12), matCream));
    createStagePlatform('opt-traditional', -4.0, 5.2, optTradCore, 'default', 2.8, 2.2);

    const optAICore = new THREE.Group();
    optAICore.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), matCoral));
    optAICore.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), matWireframe));
    const ringOrbit = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.045, 12, 36), matCream);
    ringOrbit.rotation.x = Math.PI / 3;
    ringOrbit.name = 'aiOrbit';
    optAICore.add(ringOrbit);
    createStagePlatform('opt-ai', 4.0, 5.2, optAICore, 'coral', 2.8, 2.2);

    const codeGenCore = new THREE.Group();
    codeGenCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.32, 1.4), matMuted));
    const die = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.75), matCream);
    die.position.y = 0.2;
    codeGenCore.add(die);
    createStagePlatform('codegen', 0, 10.0, codeGenCore, 'default');

    const machineCore = new THREE.Group();
    machineCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), matCoral));
    machineCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.45, 1.45), matWireframe));
    createStagePlatform('machine', 0, 14.2, machineCore, 'endpoint');

    const symTableCore = new THREE.Group();
    symTableCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.0, 1.4), matDarkBase));
    symTableCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 3.05, 1.45), matWireframe));
    createStagePlatform('symbol-table', -9.2, -1.5, symTableCore, 'default', 2.8, 2.8);

    const errCore = new THREE.Group();
    errCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.0, 1.4), matDarkBase));
    errCore.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 3.05, 1.45), matWireframe));
    createStagePlatform('error-handling', 9.2, -1.5, errCore, 'default', 2.8, 2.8);

    const conduitMat = new THREE.LineBasicMaterial({ color: 0xc9c6ba, transparent: true, opacity: 0.75 });
    const coralConduitMat = new THREE.LineBasicMaterial({ color: 0xd97757, transparent: true, opacity: 0.95 });
    const busMat = new THREE.LineDashedMaterial({ color: 0x5e5d57, dashSize: 0.4, gapSize: 0.25, transparent: true, opacity: 0.6 });
    disposables.push(conduitMat, coralConduitMat, busMat);

    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -1.8, -15.5),
          new THREE.Vector3(0, -1.8, 0.5),
        ]),
        conduitMat
      )
    );

    [-15.5, -11.5, -7.5, -3.5].forEach((zStart) => {
      addFlowArrow(
        new THREE.Vector3(0, -1.8, zStart),
        new THREE.Vector3(0, -1.8, zStart + 4.0),
        false
      );
    });

    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -1.8, 0.5),
          new THREE.Vector3(-4.0, -1.8, 5.2),
          new THREE.Vector3(0, -1.8, 10.0),
        ]),
        conduitMat
      )
    );
    addFlowArrow(new THREE.Vector3(0, -1.8, 0.5), new THREE.Vector3(-4.0, -1.8, 5.2), false);
    addFlowArrow(new THREE.Vector3(-4.0, -1.8, 5.2), new THREE.Vector3(0, -1.8, 10.0), false);

    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -1.8, 0.5),
          new THREE.Vector3(4.0, -1.8, 5.2),
          new THREE.Vector3(0, -1.8, 10.0),
        ]),
        coralConduitMat
      )
    );
    addFlowArrow(new THREE.Vector3(0, -1.8, 0.5), new THREE.Vector3(4.0, -1.8, 5.2), true);
    addFlowArrow(new THREE.Vector3(4.0, -1.8, 5.2), new THREE.Vector3(0, -1.8, 10.0), true);

    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -1.8, 10.0),
          new THREE.Vector3(0, -1.8, 14.2),
        ]),
        conduitMat
      )
    );
    addFlowArrow(new THREE.Vector3(0, -1.8, 10.0), new THREE.Vector3(0, -1.8, 14.2), true);

    const busZPositions = [-11.5, -7.5, -3.5, 0.5, 5.2, 10.0];
    busZPositions.forEach((zPos) => {
      const symLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-9.2, -1.8, -1.5),
          new THREE.Vector3(-9.2, -1.8, zPos),
          new THREE.Vector3(zPos === 5.2 ? -4.0 : 0, -1.8, zPos),
        ]),
        busMat
      );
      symLine.computeLineDistances();
      scene.add(symLine);

      const errLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(9.2, -1.8, -1.5),
          new THREE.Vector3(9.2, -1.8, zPos),
          new THREE.Vector3(zPos === 5.2 ? 4.0 : 0, -1.8, zPos),
        ]),
        busMat
      );
      errLine.computeLineDistances();
      scene.add(errLine);
    });

    const packetCount = 16;
    const packetGeo = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    const packetCreamMat = new THREE.MeshStandardMaterial({ color: 0xfaf9f5, roughness: 0.2, metalness: 0.3 });
    const packetCoralMat = new THREE.MeshStandardMaterial({ color: 0xd97757, roughness: 0.2, metalness: 0.3 });
    disposables.push(packetGeo, packetCreamMat, packetCoralMat);

    const packets: { mesh: THREE.Mesh; progress: number; path: 'trad' | 'ai' }[] = [];

    for (let i = 0; i < packetCount; i++) {
      const isAI = i % 2 !== 0;
      const p = new THREE.Mesh(packetGeo, isAI ? packetCoralMat : packetCreamMat);
      scene.add(p);
      packets.push({
        mesh: p,
        progress: i / packetCount,
        path: isAI ? 'ai' : 'trad',
      });
    }

    const getPipelinePosition = (t: number, path: 'trad' | 'ai') => {
      const startZ = -15.5;
      const endZ = 14.2;
      const curZ = startZ + t * (endZ - startZ);

      let curX = 0;
      if (curZ > 0.5 && curZ < 10.0) {
        const segT = (curZ - 0.5) / (10.0 - 0.5);
        const maxX = path === 'trad' ? -4.0 : 4.0;
        curX = Math.sin(segT * Math.PI) * maxX;
      }

      return new THREE.Vector3(curX, -0.7, curZ);
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      const id = intersects.length > 0 ? intersects[0].object.userData.stageId : null;
      if (hoveredStageIdRef.current !== id) {
        hoveredStageIdRef.current = id;
        container.style.cursor = id ? 'pointer' : 'default';
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

    renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('click', onClick);

    let animId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = now * 0.001;

      const { isPlaying: playing, speed: simSpeed } = animStateRef.current;
      const curSelected = selectedStageIdRef.current;
      const curHovered = hoveredStageIdRef.current;

      for (const id in stageMeshes) {
        const grp = stageMeshes[id];
        const ring = grp.getObjectByName('selectionRing') as THREE.Mesh | undefined;
        if (ring) {
          const targetOpacity = id === curSelected ? 0.95 : id === curHovered ? 0.5 : 0;
          const mat = ring.material as THREE.MeshBasicMaterial;
          mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 10, delta);
        }

        if (playing) {
          const core = grp.children[2];
          if (core) {
            core.rotation.y += delta * 0.28 * simSpeed;
            if (id === 'opt-ai') {
              const orbit = core.getObjectByName('aiOrbit');
              if (orbit) orbit.rotation.z += delta * 1.4 * simSpeed;
            }
          }
        }
      }

      if (playing) {
        const flowStep = delta * 0.11 * simSpeed;
        for (let i = 0; i < packets.length; i++) {
          const p = packets[i];
          p.progress = (p.progress + flowStep) % 1.0;
          const pos = getPipelinePosition(p.progress, p.path);
          p.mesh.position.set(pos.x, pos.y + Math.sin(elapsed * 4 + i) * 0.07, pos.z);
          p.mesh.rotation.y += delta * 2;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (container.contains(labelRenderer.domElement)) {
        container.removeChild(labelRenderer.domElement);
      }
      labelButtonsRef.current = {};
    };
  }, []);

  const activeStage = selectedStageId ? COMPILER_STAGES[selectedStageId] : null;

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 26, 22);
      controlsRef.current.target.set(0, 0, -0.5);
      controlsRef.current.update();
    }
  };

  const handleViewPreset = (preset: 'overview' | 'opt-fork' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (preset === 'overview') {
      cameraRef.current.position.set(0, 26, 22);
      controlsRef.current.target.set(0, 0, -0.5);
    } else if (preset === 'opt-fork') {
      cameraRef.current.position.set(0, 13, 15);
      controlsRef.current.target.set(0, 0, 5.2);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 38, 1.5);
      controlsRef.current.target.set(0, 0, -0.5);
    }
    controlsRef.current.update();
  };

  return (
    <div className="space-y-4">
      {/* Interactive Phase Order Strip */}
      <div className="p-3 sm:p-4 rounded-[20px] bg-[#FAF9F5] border-2 border-[#D9D6CA] flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10.5px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] mr-2">
          Top-to-Bottom Flow:
        </span>
        {PIPELINE_ORDER.map((id, idx) => {
          const meta = COMPILER_STAGES[id];
          const isSelected = selectedStageId === id;
          return (
            <React.Fragment key={id}>
              <button
                onClick={() => setSelectedStageId(id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#D97757] text-[#141413]'
                    : 'bg-[#F0EEE6] border border-[#D9D6CA] text-[#141413] hover:border-[#141413]'
                }`}
              >
                {meta.shortLabel}
              </button>
              {idx < PIPELINE_ORDER.length - 1 && (
                <ArrowDown className="w-3 h-3 text-[#5E5D57] -rotate-90 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main 3D Stage */}
      <div className={`relative w-full ${heightClass} rounded-[24px] border-2 border-[#D9D6CA] bg-[#141413] overflow-hidden flex flex-col font-sans select-none`}>
        <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />

        {/* Top Floating HUD */}
        <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="px-4 py-2.5 rounded-[18px] bg-[#FAF9F5] border-2 border-[#D9D6CA] pointer-events-auto text-xs space-y-0.5 max-w-md">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="w-2 h-2 rounded-full bg-[#D97757] shrink-0" />
              <span className="font-serif font-medium text-[#141413] text-sm">
                Top-to-Bottom 3D Flow
              </span>
              <span className="text-[#5E5D57]">•</span>
              <span className="font-mono text-[11px] text-[#B5532F] font-semibold truncate max-w-[160px] sm:max-w-none">
                {programName}
              </span>
            </div>
            <p className="text-[11px] text-[#5E5D57] leading-snug hidden sm:block">
              Starts at Source Code (top) and finishes at Final Program (bottom). Click any labeled block.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            {onRunBenchmark && (
              <button
                onClick={onRunBenchmark}
                disabled={isRunning}
                className={`px-4 py-2 rounded-full font-semibold text-xs transition-opacity cursor-pointer flex items-center space-x-1.5 ${
                  isRunning
                    ? 'opacity-60 cursor-not-allowed bg-[#D9D6CA] text-[#5E5D57]'
                    : 'bg-[#D97757] text-[#141413] hover:opacity-90'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run Comparison</span>
              </button>
            )}

            <div className="flex items-center p-1 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs">
              <button
                onClick={() => handleViewPreset('overview')}
                className="px-2.5 py-1 rounded-full text-[#5E5D57] hover:text-[#141413] text-[11px] font-semibold cursor-pointer"
              >
                Top-to-Bottom
              </button>
              <button
                onClick={() => handleViewPreset('opt-fork')}
                className="px-2.5 py-1 rounded-full text-[#5E5D57] hover:text-[#141413] text-[11px] font-semibold cursor-pointer"
              >
                Opt Fork
              </button>
              <button
                onClick={() => handleViewPreset('top')}
                className="px-2.5 py-1 rounded-full text-[#5E5D57] hover:text-[#141413] text-[11px] font-semibold cursor-pointer"
              >
                Flat Map
              </button>
            </div>
          </div>
        </div>

        {/* Live Benchmark Execution Notification */}
        {isRunning && (
          <div className="absolute top-28 sm:top-16 left-1/2 -translate-x-1/2 z-30 w-[90%] sm:w-auto flex items-center justify-center space-x-2.5 px-4 py-2 rounded-full bg-[#FAF9F5] border-2 border-[#D97757] text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-[#D97757] shrink-0" />
            <span className="font-semibold text-[#141413] truncate">
              {benchmarkStep || 'Simultaneously compiling both optimization branches...'}
            </span>
          </div>
        )}

        {/* Bottom Floating Playback Bar */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#D97757] text-[#141413] font-semibold hover:opacity-90 transition-opacity cursor-pointer text-[11px]"
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <span className="text-[#D9D6CA] hidden sm:inline">|</span>

          <div className="flex items-center space-x-1 text-[#5E5D57]">
            <span>Speed:</span>
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded-full text-[10px] cursor-pointer ${
                  speed === s
                    ? 'bg-[#141413] text-[#FAF9F5] font-semibold'
                    : 'hover:text-[#141413]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="text-[#D9D6CA] hidden sm:inline">|</span>

          <button
            onClick={handleResetCamera}
            className="flex items-center space-x-1 text-[#5E5D57] hover:text-[#141413] cursor-pointer text-[11px] font-semibold"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Stage Detail Card */}
        {activeStage && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl rounded-[24px] bg-[#FAF9F5] border-2 border-[#D9D6CA] p-5 text-xs space-y-3">
            <div className="flex items-start justify-between border-b-2 border-[#D9D6CA] pb-2.5">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-[#D97757] text-[#141413]">
                  {activeStage.phaseNumber}
                </span>
                <div>
                  <h4 className="font-serif text-base font-medium text-[#141413]">
                    {activeStage.name}
                  </h4>
                  <span className="text-[11px] text-[#5E5D57]">
                    {activeStage.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStageId(null)}
                className="w-7 h-7 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] flex items-center justify-center text-[#141413] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[#5E5D57] text-xs leading-relaxed">
              {activeStage.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="p-3 rounded-[16px] bg-[#F0EEE6] border border-[#D9D6CA]">
                <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block mb-0.5">
                  Standard Compiler
                </span>
                <span className="text-[#141413]">{activeStage.traditionalDetail}</span>
              </div>
              <div className="p-3 rounded-[16px] bg-[#F0EEE6] border border-[#D9D6CA]">
                <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block mb-0.5">
                  AI-Assisted Approach
                </span>
                <span className="text-[#141413]">{activeStage.aiDetail}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
