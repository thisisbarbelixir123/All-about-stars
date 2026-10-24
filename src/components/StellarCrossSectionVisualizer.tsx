import React, { useState } from 'react';
import { StellarAnatomyLayer, STELLAR_ANATOMY_LAYERS } from '../data/whatIsAStarData';
import { RunningText } from './RunningText';
import {
  Layers,
  Thermometer,
  Activity,
  Atom,
  Flame,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  Radio,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface StellarCrossSectionVisualizerProps {
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
}

export const StellarCrossSectionVisualizer: React.FC<StellarCrossSectionVisualizerProps> = ({
  selectedLayerId,
  onSelectLayer,
}) => {
  const [viewMode, setViewMode] = useState<'concentric' | 'cutaway'>('concentric');
  const [showProcesses, setShowProcesses] = useState<boolean>(true);
  const [showDepthRuler, setShowDepthRuler] = useState<boolean>(true);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);

  const activeLayer: StellarAnatomyLayer =
    STELLAR_ANATOMY_LAYERS.find((l) => l.id === selectedLayerId) || STELLAR_ANATOMY_LAYERS[0];

  const displayedLayerId = hoveredLayerId || selectedLayerId;
  const displayedLayer =
    STELLAR_ANATOMY_LAYERS.find((l) => l.id === displayedLayerId) || activeLayer;

  // Geometry radii definitions (viewBox 0 0 500 500, center at 250, 250)
  const CX = 250;
  const CY = 250;
  const R_CORE = 48;
  const R_RADIATIVE = 126;
  const R_TACHOCLINE = 136;
  const R_CONVECTIVE = 188;
  const R_PHOTOSPHERE = 194;
  const R_CHROMOSPHERE = 206;
  const R_CORONA = 244;

  const isLayerActive = (id: string) => displayedLayerId === id;

  return (
    <div className="p-2.5 sm:p-5 mobile-landscape:p-2 rounded-2xl bg-[#040816] border border-cyan-500/25 flex flex-col mobile-landscape:flex-row lg:flex-row gap-3 sm:gap-6 items-stretch min-w-0 mobile-landscape:h-[calc(100vh-80px)] mobile-landscape:min-h-[225px] mobile-landscape:max-h-[265px] lg:h-[calc(100vh-140px)] lg:min-h-[600px] lg:max-h-[780px] overflow-hidden">
      {/* Left / Top Panel: Graphics ONLY (Animations alone on mobile landscape, with zero scrolling) */}
      <div className="w-full mobile-landscape:w-5/12 lg:w-auto mobile-landscape:flex-none lg:flex-1 min-w-0 mobile-landscape:h-full lg:h-full mobile-landscape:overflow-hidden lg:overflow-hidden flex flex-col items-center justify-center p-2 sm:p-5 mobile-landscape:p-1.5 rounded-2xl bg-[#020512] border border-cyan-500/25 relative overflow-hidden select-none">
        {/* Subtle starfield/nebular background ambience */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-cyan-900/10 to-transparent" />

        {/* Interactive SVG Cross-Section */}
        <div className="relative w-full mobile-landscape:w-auto h-full max-h-full max-w-[440px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
              aria-label="Interactive cross-section diagram of a star showing internal layers from core to corona"
            >
              <defs>
                {/* Radial gradients for cross-section layers */}
                <radialGradient id="grad-core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fef08a" />
                  <stop offset="85%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#eab308" />
                </radialGradient>

                <radialGradient id="grad-radiative" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </radialGradient>

                <radialGradient id="grad-convective" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="60%" stopColor="#dc2626" />
                  <stop offset="95%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#991b1b" />
                </radialGradient>

                <radialGradient id="grad-photosphere" cx="50%" cy="50%" r="50%">
                  <stop offset="90%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>

                <radialGradient id="grad-chromosphere" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
                </radialGradient>

                <radialGradient id="grad-corona" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="88%" stopColor="#0284c7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
                </radialGradient>

                {/* Surface texture pattern for cutaway exterior */}
                <radialGradient id="grad-exterior-surface" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="25%" stopColor="#fde047" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="90%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#9a3412" />
                </radialGradient>

                {/* Glow filter for active layer */}
                <filter id="layer-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. CORONA & STELLAR WIND LAYER (Outer Halo) */}
              <g
                id="svg-layer-corona"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('corona')}
                onMouseEnter={() => setHoveredLayerId('corona')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {/* Coronal Glow Halo */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_CORONA}
                  fill="url(#grad-corona)"
                  className={isLayerActive('corona') ? 'filter-none' : 'opacity-70'}
                />

                {/* Coronal Streamers & Magnetic Arcs */}
                {showProcesses && (
                  <g className="opacity-80">
                    {/* Outward Streamers */}
                    <path
                      d="M 250,44 Q 240,15 250,5 Q 260,15 250,44 Z"
                      fill="#38bdf8"
                      opacity="0.6"
                    />
                    <path
                      d="M 456,250 Q 485,240 495,250 Q 485,260 456,250 Z"
                      fill="#38bdf8"
                      opacity="0.6"
                    />
                    <path
                      d="M 250,456 Q 240,485 250,495 Q 260,485 250,456 Z"
                      fill="#38bdf8"
                      opacity="0.6"
                    />
                    <path
                      d="M 44,250 Q 15,240 5,250 Q 15,260 44,250 Z"
                      fill="#38bdf8"
                      opacity="0.6"
                    />

                    {/* Diagonal Whisps */}
                    <path
                      d="M 390,110 Q 430,70 445,55"
                      stroke="#7dd3fc"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      fill="none"
                      opacity="0.7"
                    />
                    <path
                      d="M 110,390 Q 70,430 55,445"
                      stroke="#7dd3fc"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      fill="none"
                      opacity="0.7"
                    />
                    <path
                      d="M 110,110 Q 70,70 55,55"
                      stroke="#7dd3fc"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      fill="none"
                      opacity="0.7"
                    />

                    {/* Solar Wind Particle Vectors */}
                    <g stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
                      <line x1="410" y1="210" x2="435" y2="200" />
                      <line x1="415" y1="290" x2="440" y2="300" />
                      <line x1="210" y1="410" x2="200" y2="435" />
                      <line x1="290" y1="415" x2="300" y2="440" />
                      <line x1="90" y1="210" x2="65" y2="200" />
                    </g>
                  </g>
                )}

                <circle
                  cx={CX}
                  cy={CY}
                  r={R_CORONA}
                  fill="none"
                  stroke={isLayerActive('corona') ? '#38bdf8' : 'rgba(56,189,248,0.2)'}
                  strokeWidth={isLayerActive('corona') ? 2.5 : 1}
                  strokeDasharray={isLayerActive('corona') ? 'none' : '4,4'}
                />
              </g>

              {/* 2. CHROMOSPHERE LAYER (Rose/Pink Thin Atmosphere) */}
              <g
                id="svg-layer-chromosphere"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('chromosphere')}
                onMouseEnter={() => setHoveredLayerId('chromosphere')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_CHROMOSPHERE}
                  fill="url(#grad-chromosphere)"
                  stroke={isLayerActive('chromosphere') ? '#fb7185' : 'rgba(244,63,94,0.4)'}
                  strokeWidth={isLayerActive('chromosphere') ? 3 : 1.5}
                />

                {/* Spicules & Solar Prominence Arch */}
                {showProcesses && (
                  <g>
                    {/* Magnetic Prominence Loop Arching into Space */}
                    <path
                      d="M 380,180 C 425,160 435,210 392,205"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="url(#layer-glow)"
                    />
                    <path
                      d="M 383,184 C 420,166 430,206 393,203"
                      fill="none"
                      stroke="#fecdd3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    {/* Tiny Plasma Spicules around rim */}
                    <g stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round">
                      <line x1="250" y1="44" x2="250" y2="40" />
                      <line x1="270" y1="46" x2="272" y2="41" />
                      <line x1="230" y1="46" x2="228" y2="41" />
                      <line x1="395" y1="240" x2="400" y2="239" />
                      <line x1="395" y1="260" x2="400" y2="261" />
                      <line x1="105" y1="240" x2="100" y2="239" />
                      <line x1="105" y1="260" x2="100" y2="261" />
                      <line x1="250" y1="456" x2="250" y2="460" />
                    </g>
                  </g>
                )}
              </g>

              {/* CUTAWAY MODE: When in cutaway mode, render the 3D spherical exterior on the remaining 3 quadrants */}
              {viewMode === 'cutaway' && (
                <g id="svg-cutaway-exterior" opacity="0.95">
                  {/* Spherical exterior covering 270 degrees (Top-Left, Bottom-Left, Bottom-Right) */}
                  <path
                    d={`M ${CX},${CY} L ${CX},${CY - R_PHOTOSPHERE} A ${R_PHOTOSPHERE} ${R_PHOTOSPHERE} 0 1 0 ${CX + R_PHOTOSPHERE},${CY} Z`}
                    fill="url(#grad-exterior-surface)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />

                  {/* Sunspots on exterior surface */}
                  <circle cx="160" cy="220" r="4.5" fill="#78350f" opacity="0.8" />
                  <circle cx="160" cy="220" r="2.5" fill="#451a03" />

                  <circle cx="210" cy="330" r="6" fill="#78350f" opacity="0.8" />
                  <circle cx="210" cy="330" r="3.2" fill="#451a03" />

                  <circle cx="140" cy="300" r="3.5" fill="#78350f" opacity="0.8" />
                  <circle cx="140" cy="300" r="1.8" fill="#451a03" />

                  {/* Surface granulation micro-speckles */}
                  <g fill="#fef08a" opacity="0.25">
                    <circle cx="180" cy="180" r="1.5" />
                    <circle cx="140" cy="160" r="1.2" />
                    <circle cx="190" cy="260" r="1.5" />
                    <circle cx="240" cy="370" r="1.8" />
                    <circle cx="170" cy="360" r="1.4" />
                  </g>

                  {/* 3D shading specular gradient on curved sphere */}
                  <ellipse
                    cx="175"
                    cy="175"
                    rx="80"
                    ry="60"
                    fill="white"
                    opacity="0.12"
                    transform="rotate(-25 175 175)"
                  />
                </g>
              )}

              {/* 3. CONVECTIVE ZONE (Radius R_TACHOCLINE to R_CONVECTIVE) */}
              <g
                id="svg-layer-convective"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('convective')}
                onMouseEnter={() => setHoveredLayerId('convective')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {viewMode === 'concentric' ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_CONVECTIVE}
                    fill="url(#grad-convective)"
                    stroke={isLayerActive('convective') ? '#ea580c' : 'rgba(234,88,12,0.3)'}
                    strokeWidth={isLayerActive('convective') ? 3 : 1}
                  />
                ) : (
                  /* Cutaway quadrant wedge (0 to 90 degrees) */
                  <path
                    d={`M ${CX},${CY} L ${CX + R_CONVECTIVE},${CY} A ${R_CONVECTIVE} ${R_CONVECTIVE} 0 0 0 ${CX},${CY - R_CONVECTIVE} Z`}
                    fill="url(#grad-convective)"
                    stroke={isLayerActive('convective') ? '#ea580c' : 'rgba(234,88,12,0.4)'}
                    strokeWidth={isLayerActive('convective') ? 2.5 : 1}
                  />
                )}

                {/* Boiling Convective Circulation Cells & Loops */}
                {showProcesses && (
                  <g opacity={isLayerActive('convective') ? 1 : 0.75}>
                    {/* Convection loop 1 (top-right quadrant) */}
                    <g transform="translate(320, 160) rotate(-45)">
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="16"
                        ry="10"
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="1.5"
                        strokeDasharray="4,2"
                      />
                      <polygon points="16,-3 20,0 16,3" fill="#facc15" />
                      <polygon points="-16,3 -20,0 -16,-3" fill="#ef4444" />
                    </g>

                    {/* Convection loop 2 */}
                    {viewMode === 'concentric' && (
                      <>
                        <g transform="translate(180, 160) rotate(45)">
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="16"
                            ry="10"
                            fill="none"
                            stroke="#fef08a"
                            strokeWidth="1.5"
                            strokeDasharray="4,2"
                          />
                          <polygon points="16,-3 20,0 16,3" fill="#facc15" />
                          <polygon points="-16,3 -20,0 -16,-3" fill="#ef4444" />
                        </g>
                        <g transform="translate(250, 365)">
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="16"
                            ry="10"
                            fill="none"
                            stroke="#fef08a"
                            strokeWidth="1.5"
                            strokeDasharray="4,2"
                          />
                          <polygon points="16,-3 20,0 16,3" fill="#facc15" />
                          <polygon points="-16,3 -20,0 -16,-3" fill="#ef4444" />
                        </g>
                      </>
                    )}
                  </g>
                )}
              </g>

              {/* 4. PHOTOSPHERE (Visible Surface Rim) */}
              <g
                id="svg-layer-photosphere"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('photosphere')}
                onMouseEnter={() => setHoveredLayerId('photosphere')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {viewMode === 'concentric' ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_PHOTOSPHERE}
                    fill="none"
                    stroke={isLayerActive('photosphere') ? '#facc15' : '#eab308'}
                    strokeWidth={isLayerActive('photosphere') ? 5 : 2.5}
                    filter={isLayerActive('photosphere') ? 'url(#layer-glow)' : undefined}
                  />
                ) : (
                  <path
                    d={`M ${CX + R_PHOTOSPHERE},${CY} A ${R_PHOTOSPHERE} ${R_PHOTOSPHERE} 0 0 0 ${CX},${CY - R_PHOTOSPHERE}`}
                    fill="none"
                    stroke={isLayerActive('photosphere') ? '#facc15' : '#eab308'}
                    strokeWidth={isLayerActive('photosphere') ? 5 : 3}
                    filter={isLayerActive('photosphere') ? 'url(#layer-glow)' : undefined}
                  />
                )}
              </g>

              {/* 5. TACHOCLINE (Magnetic Shear Boundary) */}
              <g
                id="svg-layer-tachocline"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('tachocline')}
                onMouseEnter={() => setHoveredLayerId('tachocline')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {viewMode === 'concentric' ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_TACHOCLINE}
                    fill="none"
                    stroke={isLayerActive('tachocline') ? '#fb923c' : '#f97316'}
                    strokeWidth={isLayerActive('tachocline') ? 5 : 2}
                    strokeDasharray="6,4"
                  />
                ) : (
                  <path
                    d={`M ${CX + R_TACHOCLINE},${CY} A ${R_TACHOCLINE} ${R_TACHOCLINE} 0 0 0 ${CX},${CY - R_TACHOCLINE}`}
                    fill="none"
                    stroke={isLayerActive('tachocline') ? '#fb923c' : '#f97316'}
                    strokeWidth={isLayerActive('tachocline') ? 5 : 2}
                    strokeDasharray="6,4"
                  />
                )}

                {/* Shear Velocity Arrow Glyphs */}
                {showProcesses && (
                  <g
                    stroke="#fed7aa"
                    strokeWidth="1.2"
                    opacity={isLayerActive('tachocline') ? 1 : 0.6}
                  >
                    <path d="M 340,170 Q 345,160 355,162" fill="none" />
                    <polygon points="357,160 357,165 352,163" fill="#fed7aa" />
                  </g>
                )}
              </g>

              {/* 6. RADIATIVE ZONE (Radius R_CORE to R_TACHOCLINE) */}
              <g
                id="svg-layer-radiative"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('radiative')}
                onMouseEnter={() => setHoveredLayerId('radiative')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {viewMode === 'concentric' ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_RADIATIVE}
                    fill="url(#grad-radiative)"
                    stroke={isLayerActive('radiative') ? '#f59e0b' : 'rgba(245,158,11,0.4)'}
                    strokeWidth={isLayerActive('radiative') ? 3 : 1}
                  />
                ) : (
                  <path
                    d={`M ${CX},${CY} L ${CX + R_RADIATIVE},${CY} A ${R_RADIATIVE} ${R_RADIATIVE} 0 0 0 ${CX},${CY - R_RADIATIVE} Z`}
                    fill="url(#grad-radiative)"
                    stroke={isLayerActive('radiative') ? '#f59e0b' : 'rgba(245,158,11,0.4)'}
                    strokeWidth={isLayerActive('radiative') ? 2.5 : 1}
                  />
                )}

                {/* Random-Walk Photon Trajectory */}
                {showProcesses && (
                  <g opacity={isLayerActive('radiative') ? 1 : 0.8}>
                    <path
                      d="M 270,225 L 285,215 L 280,195 L 305,200 L 315,180 L 330,190 L 340,165 L 355,170"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#layer-glow)"
                    />
                    {/* Photon energy particles */}
                    <circle cx="280" cy="195" r="2" fill="#ffffff" />
                    <circle cx="315" cy="180" r="2" fill="#ffffff" />
                    <circle cx="340" cy="165" r="2" fill="#ffffff" />
                    <circle cx="355" cy="170" r="2.5" fill="#fef08a" />
                  </g>
                )}
              </g>

              {/* 7. THERMONUCLEAR CORE (Innermost Furnace) */}
              <g
                id="svg-layer-core"
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectLayer('core')}
                onMouseEnter={() => setHoveredLayerId('core')}
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {viewMode === 'concentric' ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_CORE}
                    fill="url(#grad-core)"
                    stroke={isLayerActive('core') ? '#ffffff' : '#fef08a'}
                    strokeWidth={isLayerActive('core') ? 3.5 : 2}
                    filter="url(#layer-glow)"
                  />
                ) : (
                  <path
                    d={`M ${CX},${CY} L ${CX + R_CORE},${CY} A ${R_CORE} ${R_CORE} 0 0 0 ${CX},${CY - R_CORE} Z`}
                    fill="url(#grad-core)"
                    stroke={isLayerActive('core') ? '#ffffff' : '#fef08a'}
                    strokeWidth={isLayerActive('core') ? 3.5 : 2}
                    filter="url(#layer-glow)"
                  />
                )}

                {/* Core Fusion Sparkle / Energy Symbol */}
                <g transform={`translate(${CX}, ${CY})`}>
                  <circle cx="0" cy="0" r="6" fill="#ffffff" />
                  <line x1="-15" y1="0" x2="15" y2="0" stroke="#ffffff" strokeWidth="2" />
                  <line x1="0" y1="-15" x2="0" y2="15" stroke="#ffffff" strokeWidth="2" />
                  <line x1="-10" y1="-10" x2="10" y2="10" stroke="#fef08a" strokeWidth="1.5" />
                  <line x1="-10" y1="10" x2="10" y2="-10" stroke="#fef08a" strokeWidth="1.5" />
                </g>
              </g>

              {/* RADIAL CALIPER & DEPTH RULER */}
              {showDepthRuler && (
                <g id="svg-depth-ruler" stroke="#94a3b8" strokeWidth="1" opacity="0.85">
                  {/* Caliper axis along horizontal right radius */}
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX + R_CORONA + 10}
                    y2={CY}
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />

                  {/* Tick Marks & Radius Labels */}
                  {/* 0.0 R☉ */}
                  <line x1={CX} y1={CY - 4} x2={CX} y2={CY + 4} stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x={CX - 12}
                    y={CY + 18}
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    0.0
                  </text>

                  {/* 0.25 R☉ (Core boundary) */}
                  <line
                    x1={CX + R_CORE}
                    y1={CY - 4}
                    x2={CX + R_CORE}
                    y2={CY + 4}
                    stroke="#fef08a"
                    strokeWidth="1.5"
                  />
                  <text
                    x={CX + R_CORE - 10}
                    y={CY + 16}
                    fill="#fef08a"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    0.25
                  </text>

                  {/* 0.70 R☉ (Tachocline / base of convection) */}
                  <line
                    x1={CX + R_TACHOCLINE}
                    y1={CY - 4}
                    x2={CX + R_TACHOCLINE}
                    y2={CY + 4}
                    stroke="#f97316"
                    strokeWidth="1.5"
                  />
                  <text
                    x={CX + R_TACHOCLINE - 10}
                    y={CY + 16}
                    fill="#f97316"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    0.70
                  </text>

                  {/* 1.00 R☉ (Photosphere surface) */}
                  <line
                    x1={CX + R_PHOTOSPHERE}
                    y1={CY - 6}
                    x2={CX + R_PHOTOSPHERE}
                    y2={CY + 6}
                    stroke="#eab308"
                    strokeWidth="2"
                  />
                  <text
                    x={CX + R_PHOTOSPHERE - 16}
                    y={CY + 18}
                    fill="#eab308"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    1.00 R☉
                  </text>

                  {/* Corona indicator */}
                  <text
                    x={CX + R_CORONA - 10}
                    y={CY - 6}
                    fill="#38bdf8"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    Corona
                  </text>
                </g>
              )}

              {/* Active Layer Pin & Dynamic Pointer Line */}
              {displayedLayer && (
                <g id="svg-active-pointer">
                  {/* Dynamic radial marker on cross-section */}
                  {displayedLayer.id === 'core' && (
                    <circle cx={CX} cy={CY} r="32" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />
                  )}
                  {displayedLayer.id === 'tachocline' && (
                    <circle cx={CX} cy={CY} r={R_TACHOCLINE} fill="none" stroke="#fb923c" strokeWidth="2.5" />
                  )}
                </g>
              )}
            </svg>

            {/* Quick Hover/Click Tooltip Pill overlaid on bottom center */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#040816]/90 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-200 shadow-lg pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: displayedLayer.accentHex }}
              />
              <span className="font-bold text-white">{displayedLayer.name.split('(')[0]}</span>
              <span className="text-slate-400">({displayedLayer.depthFraction.split(' ')[0]})</span>
            </div>
          </div>

          {/* Interactive Hint (Hidden on left in mobile landscape) */}
          <div className="mt-2.5 mobile-landscape:hidden flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono text-slate-400 px-1 gap-2 min-w-0">
            <span className="truncate">Click or hover any layer in cross-section</span>
            <span className="text-cyan-400 font-semibold shrink-0">{displayedLayer.temperature.split(' ')[0]} K</span>
          </div>
        </div>

      {/* Right / Bottom Panel: Everything Else (Scrollable with bounded container) */}
      <div className="w-full mobile-landscape:w-7/12 lg:w-auto mobile-landscape:flex-none lg:flex-1 min-w-0 mobile-landscape:h-full lg:h-full overflow-y-auto scrollbar-thin flex flex-col gap-3.5 sm:gap-4 pr-1">
        {/* Interactive Hint at top of right panel in mobile landscape */}
        <div className="hidden mobile-landscape:flex items-center justify-between w-full text-[10px] font-mono text-slate-400 px-2.5 py-1 rounded-xl bg-[#020512] border border-cyan-500/20">
          <span className="truncate">Click or hover any layer in cross-section</span>
          <span className="text-cyan-400 font-semibold shrink-0">{displayedLayer.temperature.split(' ')[0]} K</span>
        </div>

        {/* View & Overlay Mode Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#020512] border border-cyan-500/20">
          <div className="flex items-center gap-1 p-1 bg-[#040816] rounded-xl border border-cyan-500/20 text-xs font-mono">
            <button
              onClick={() => setViewMode('concentric')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                viewMode === 'concentric'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full concentric circular cross-section"
            >
              Full Cross-Section
            </button>
            <button
              onClick={() => setViewMode('cutaway')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                viewMode === 'cutaway'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="3D spherical cutaway showing exterior surface and internal cross-section"
            >
              Cutaway Sphere
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setShowProcesses(!showProcesses)}
              className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                showProcesses
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-[#040816] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle convection currents, photon random walk, and magnetic loops"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Physics Processes</span>
            </button>

            <button
              onClick={() => setShowDepthRuler(!showDepthRuler)}
              className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                showDepthRuler
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-[#040816] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle radial depth scale calipers"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Depth Scale</span>
            </button>
          </div>
        </div>

        {/* Layer Navigation Tabs / Chips with RunningText */}
        <div className="grid grid-cols-2 mobile-landscape:grid-cols-4 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {STELLAR_ANATOMY_LAYERS.map((layer) => {
            const isSelected = selectedLayerId === layer.id;
            const isHovered = hoveredLayerId === layer.id;
            const shortDepth =
              layer.id === 'core'
                ? '0.00'
                : layer.id === 'radiative'
                ? '0.25'
                : layer.id === 'tachocline'
                ? '~0.70'
                : layer.id === 'convective'
                ? '0.70'
                : layer.id === 'photosphere'
                ? '1.00'
                : layer.id === 'chromosphere'
                ? '1.00+'
                : layer.id === 'corona'
                ? 'Outer'
                : layer.depthFraction.split(' ')[0];

            return (
              <button
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                onMouseEnter={() => setHoveredLayerId(layer.id)}
                onMouseLeave={() => setHoveredLayerId(null)}
                className={`px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative min-w-0 min-h-[58px] sm:min-h-[64px] h-auto ${
                  isSelected
                    ? 'bg-[#081530] border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : isHovered
                    ? 'bg-[#061025] border-cyan-500/50 text-slate-200'
                    : 'bg-[#020512] border-cyan-500/20 text-slate-400 hover:text-slate-200 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full min-w-0">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                    {shortDepth}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 ml-1 shadow-sm"
                    style={{ backgroundColor: layer.accentHex }}
                  />
                </div>
                <div className="w-full min-w-0 mt-1">
                  <RunningText
                    text={layer.name.split('(')[0].replace('The ', '')}
                    className="text-xs font-bold text-slate-100 group-hover:text-cyan-200 leading-tight"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Header Card with Layer Identity */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#020512] border border-cyan-500/25 flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: activeLayer.accentHex }}
              />
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                Layer Profile
              </span>
            </div>
            <h4 className="text-xl font-black text-white mt-1">{activeLayer.name}</h4>
            <p className="text-xs font-mono text-slate-300 mt-0.5">{activeLayer.depthFraction}</p>
          </div>

          {/* Core Physical Metric Grid: Horizontal format on mobile landscape */}
          <div className="grid grid-cols-1 mobile-landscape:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-2.5 mt-1">
            <div className="p-2.5 rounded-xl bg-[#040816] border border-slate-800 flex flex-col mobile-landscape:flex-row md:flex-col lg:flex-col justify-between mobile-landscape:items-center md:items-start lg:items-start gap-1 mobile-landscape:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold shrink-0">
                <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Temperature</span>
              </div>
              <div className="min-w-0 mobile-landscape:text-right md:text-left lg:text-left">
                <RunningText
                  text={activeLayer.temperature}
                  className="text-amber-300 font-mono font-bold text-xs"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#040816] border border-slate-800 flex flex-col mobile-landscape:flex-row md:flex-col lg:flex-col justify-between mobile-landscape:items-center md:items-start lg:items-start gap-1 mobile-landscape:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold shrink-0">
                <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Density Range</span>
              </div>
              <div className="min-w-0 mobile-landscape:text-right md:text-left lg:text-left">
                <RunningText
                  text={activeLayer.density}
                  className="text-cyan-300 font-mono font-bold text-xs"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#040816] border border-slate-800 flex flex-col mobile-landscape:flex-row md:flex-col lg:flex-col justify-between mobile-landscape:items-center md:items-start lg:items-start gap-1 mobile-landscape:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold shrink-0">
                <Atom className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Physical State</span>
              </div>
              <div className="min-w-0 mobile-landscape:text-right md:text-left lg:text-left">
                <RunningText
                  text={activeLayer.physicalState}
                  className="text-slate-200 font-sans text-[11px] leading-tight"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Astrophysical Role & Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#020512] border border-cyan-500/25 space-y-2">
          <h5 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Astrophysical Role</span>
          </h5>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {activeLayer.summary}
          </p>
        </div>

        {/* Key Characteristics & Physics Bullet Points */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#020512] border border-cyan-500/25 space-y-3">
          <h5 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Characteristics & Physics</span>
          </h5>
          <ul className="space-y-2">
            {activeLayer.details.map((detail, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Energy Transport & Physical Gradient Footnote */}
        <div className="p-3.5 rounded-xl bg-[#040816] border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Energy Transport Mode:</span>
          <span className="text-white font-bold">
            {activeLayer.id === 'core' && 'Thermonuclear Fusion (p-p & CNO)'}
            {activeLayer.id === 'radiative' && 'Radiative Diffusion (Photon Random Walk)'}
            {activeLayer.id === 'tachocline' && 'Magnetic Dynamo Shear Interface'}
            {activeLayer.id === 'convective' && 'Buoyant Thermal Plasma Convection'}
            {activeLayer.id === 'photosphere' && 'Optical Blackbody Radiation (Visible Light)'}
            {activeLayer.id === 'chromosphere' && 'Acoustic & Alfvén Wave Dissipation'}
            {activeLayer.id === 'corona' && 'Magnetic Reconnection & Solar Wind'}
          </span>
        </div>
      </div>
    </div>
  );
};
