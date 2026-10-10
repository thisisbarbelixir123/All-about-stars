import React, { useState, useMemo } from 'react';
import { soundEffects } from '../utils/soundEffects';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight,
  Flame,
  Sparkles,
  BookOpen
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_BANK: QuizQuestion[] = [
  // Category 1: Spectral Classification & H-R Diagram
  {
    id: 'spec-1',
    category: 'Spectral Classification',
    question: 'Which spectral class contains the hottest main-sequence stars with surface temperatures exceeding 30,000 Kelvin?',
    options: ['Class O', 'Class B', 'Class A', 'Class M'],
    correctIndex: 0,
    explanation: 'Class O stars are the hottest and most luminous, radiating intense ionizing ultraviolet light and displaying ionized helium (He II) absorption lines.',
  },
  {
    id: 'spec-2',
    category: 'Spectral Classification',
    question: 'What mnemonic is traditionally used to remember the Harvard spectral sequence from hottest to coolest?',
    options: [
      'Oh Be A Fine Girl/Guy, Kiss Me',
      'Only Bright Asteroids Form Giant Keplers',
      'Our Big Atmosphere Filters Green Light',
      'Orbiting Bodies Accelerate Toward Galactic Mass',
    ],
    correctIndex: 0,
    explanation: 'The classic mnemonic "Oh Be A Fine Girl/Guy, Kiss Me" encodes O, B, A, F, G, K, M, developed largely by Annie Jump Cannon and the Harvard Computers.',
  },
  {
    id: 'spec-3',
    category: 'Spectral Classification',
    question: 'On a Hertzsprung–Russell (H-R) diagram, where do degenerate White Dwarfs reside?',
    options: [
      'Lower-left (High temperature, low luminosity)',
      'Upper-right (Low temperature, high luminosity)',
      'Upper-left (High temperature, high luminosity)',
      'Directly in the center of the Main Sequence',
    ],
    correctIndex: 0,
    explanation: 'White dwarfs are extremely hot because they are exposed degenerate cores, but because they are Earth-sized in radius, their total radiating surface area and luminosity are tiny.',
  },
  {
    id: 'spec-4',
    category: 'Spectral Classification',
    question: 'What prominent absorption feature dominates the optical spectra of cool M-dwarf stars?',
    options: [
      'Titanium Oxide (TiO) molecular bands',
      'Ionized Helium (He II) lines',
      'Neutral Hydrogen Balmer series (H-alpha)',
      'Silicon IV emission features',
    ],
    correctIndex: 0,
    explanation: 'At temperatures below ~3,700 K, outer stellar atmospheres become cool enough for complex molecules like Titanium Oxide (TiO) to form and create broad absorption bands.',
  },

  // Category 2: Nuclear Fusion & Stellar Life Cycles
  {
    id: 'nuc-1',
    category: 'Nuclear Astrophysics',
    question: 'What is the dominant hydrogen fusion mechanism in stars with masses greater than ~1.3 Solar Masses (M☉)?',
    options: [
      'The CNO (Carbon-Nitrogen-Oxygen) Cycle',
      'The Proton-Proton (p-p) Chain',
      'The Triple-Alpha Process',
      'Silicon Photodisintegration',
    ],
    correctIndex: 0,
    explanation: 'At higher core temperatures (> 15 million K), the catalytic CNO cycle has a much steeper temperature dependence (T^17) than the p-p chain (T^4), completely dominating energy production in massive stars.',
  },
  {
    id: 'nuc-2',
    category: 'Nuclear Astrophysics',
    question: 'Why does nuclear fusion in the cores of massive stars cease to produce net energy once Iron-56 (Fe-56) is formed?',
    options: [
      'Iron has the highest nuclear binding energy per nucleon; fusing it is endothermic (absorbs energy)',
      'Iron decays into antimatter instantly',
      'Magnetic fields at the iron core reflect incoming helium nuclei',
      'Electrons cannot penetrate iron atoms due to Pauli exclusion',
    ],
    correctIndex: 0,
    explanation: 'Iron-56 and Nickel-62 sit at the peak of the nuclear binding energy curve. Fusing elements heavier than iron absorbs kinetic energy rather than releasing it, triggering catastrophic gravitational collapse.',
  },
  {
    id: 'nuc-3',
    category: 'Nuclear Astrophysics',
    question: 'What process enables low- and intermediate-mass stars like our Sun to fuse Helium into Carbon during the Red Giant stage?',
    options: [
      'The Triple-Alpha Process',
      'Beta Decay Capture',
      'The s-process (slow neutron capture)',
      'Lithium Burning',
    ],
    correctIndex: 0,
    explanation: 'The triple-alpha process involves two helium-4 nuclei momentarily forming unstable beryllium-8, which then captures a third alpha particle to form stable carbon-12.',
  },
  {
    id: 'nuc-4',
    category: 'Nuclear Astrophysics',
    question: 'What force halts gravitational collapse in a White Dwarf remnant star?',
    options: [
      'Electron Degeneracy Pressure',
      'Thermal Radiation Pressure',
      'Neutron Degeneracy Pressure',
      'Magnetic Lorentz Rebound',
    ],
    correctIndex: 0,
    explanation: 'Electron degeneracy pressure, governed by the Pauli Exclusion Principle forbidding identical fermions from occupying the same quantum state, prevents white dwarfs from collapsing further.',
  },

  // Category 3: Relativistic Remnants & Extremes
  {
    id: 'rem-1',
    category: 'Relativistic Remnants',
    question: 'What is the theoretical upper mass limit for a non-rotating White Dwarf before collapsing, known as the Chandrasekhar Limit?',
    options: [
      'Approximately 1.44 Solar Masses (M☉)',
      '3.0 Solar Masses (M☉)',
      '0.08 Solar Masses (M☉)',
      '10.0 Solar Masses (M☉)',
    ],
    correctIndex: 0,
    explanation: 'Formulated by Subrahmanyan Chandrasekhar in 1930, 1.44 M☉ is the maximum mass supportable by relativistic electron degeneracy pressure. Exceeding it triggers a Type Ia supernova or collapse to a neutron star.',
  },
  {
    id: 'rem-2',
    category: 'Relativistic Remnants',
    question: 'What distinguishes a Magnetar from a standard Radio Pulsar?',
    options: [
      'An ultra-strong magnetic field exceeding 10^14 to 10^15 Gauss that powers intense X-ray and gamma-ray outbursts',
      'It orbits faster than the speed of light',
      'It contains a liquid water surface ocean',
      'It has no gravitational pull',
    ],
    correctIndex: 0,
    explanation: 'Magnetars possess the strongest magnetic fields measured in the universe (~100 billion Tesla), causing starquakes on the neutron crust that unleash colossal gamma-ray giant flares.',
  },
  {
    id: 'rem-3',
    category: 'Relativistic Remnants',
    question: 'What is the innermost radius around a non-rotating Schwarzschild black hole where gas can orbit stably in an accretion disk (the ISCO)?',
    options: [
      '3 Schwarzschild radii (3 r_s or 6 GM/c²)',
      'Exactly 1 Schwarzschild radius (1 r_s)',
      '10 Schwarzschild radii (10 r_s)',
      '0.5 Schwarzschild radii (inside the horizon)',
    ],
    correctIndex: 0,
    explanation: 'The Innermost Stable Circular Orbit (ISCO) for a Schwarzschild black hole is at 3 r_s. Gas crossing inside this radius plunges directly into the event horizon without a stable orbit.',
  },
  {
    id: 'rem-4',
    category: 'Relativistic Remnants',
    question: 'What optical effect causes the approaching side of an active black hole accretion disk to appear significantly brighter and bluer than the receding side?',
    options: [
      'Relativistic Doppler Beaming and Headlight Effect',
      'Atmospheric Rayleigh Scattering',
      'Hawking Radiative Cooling',
      'Zeeman Magnetic Splitting',
    ],
    correctIndex: 0,
    explanation: 'Relativistic Doppler beaming boosts the perceived photon energy and flux of plasma moving at near-light speeds toward the observer, making that side blindingly bright and blue-shifted.',
  },
];

interface StellarQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StellarQuizModal: React.FC<StellarQuizModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  const categories = useMemo(() => {
    const set = new Set<string>();
    QUIZ_BANK.forEach((q) => set.add(q.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'All') return QUIZ_BANK;
    return QUIZ_BANK.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const currentQ = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Already answered
    setSelectedOption(idx);

    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      soundEffects.play('toggleOn');
    } else {
      setStreak(0);
      soundEffects.play('toggleOff');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      soundEffects.play('nav');
    } else {
      setIsCompleted(true);
      soundEffects.play('select');
    }
  };

  const handleRestart = (newCategory?: string) => {
    if (newCategory) {
      setSelectedCategory(newCategory);
    }
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    soundEffects.play('click');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#060a1a]/95 border border-cyan-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden font-sans text-slate-100 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-[#081026]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Stellar Astrophysics Quiz</span>
                {streak > 1 && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{streak} STREAK</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Test your knowledge of spectral types, fusion physics, and relativistic remnants
              </p>
            </div>
          </div>

          <button
            id="btn-close-quiz-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#030612]/80 hover:bg-[#0c1630] text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-500/25 cursor-pointer shadow-sm"
            title="Exit quiz"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        {!isCompleted && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#040816] border-b border-cyan-500/15 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 uppercase">Topic:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleRestart(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 scrollbar-thin">
          {!isCompleted ? (
            <>
              {/* Question Progress and Category Indicator */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                  {currentQ.category}
                </span>
                <span>
                  Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of {filteredQuestions.length} • Score: <strong className="text-cyan-300">{score}</strong>
                </span>
              </div>

              {/* Question Statement */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#04091c]/90 border border-cyan-500/25">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed text-balance">
                  {currentQ.question}
                </h3>
              </div>

              {/* Multiple Choice Options Grid */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const hasAnswered = selectedOption !== null;

                  let btnStyle = 'bg-[#030614]/80 hover:bg-[#07112c] border-cyan-500/20 hover:border-cyan-500/50 text-slate-200';
                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 ${btnStyle} ${
                        !hasAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 font-mono text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory Scientific Insight Card (shown upon answering) */}
              {selectedOption !== null && (
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                      Astrophysical Context
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="p-6 sm:p-8 rounded-2xl bg-[#04091c]/90 border border-cyan-500/30 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Expedition Debrief Complete
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-1">
                  CATEGORY: {selectedCategory.toUpperCase()}
                </p>
              </div>

              <div className="py-3 px-6 rounded-xl bg-[#020510] border border-cyan-500/20 max-w-xs mx-auto">
                <div className="text-3xl font-black text-white font-mono">
                  {score} <span className="text-slate-500 text-lg">/ {filteredQuestions.length}</span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Accuracy: {Math.round((score / filteredQuestions.length) * 100)}%
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-200">
                Rank Awarded:{' '}
                <span className="text-amber-300 font-bold">
                  {score === filteredQuestions.length
                    ? 'Extreme Cosmologist'
                    : score >= filteredQuestions.length * 0.75
                    ? 'Senior Stellar Astrophysicist'
                    : score >= filteredQuestions.length * 0.5
                    ? 'Journeyman Astronomer'
                    : 'Apprentice Stargazer'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => handleRestart()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Category</span>
                </button>

                <button
                  onClick={() => handleRestart('All')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all cursor-pointer border border-slate-600"
                >
                  <span>All Categories</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isCompleted && selectedOption !== null && (
          <div className="px-4 sm:px-6 py-3 bg-[#081026] border-t border-cyan-500/20 flex items-center justify-end shrink-0">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono transition-all cursor-pointer shadow-md shadow-cyan-500/25 active:scale-95"
            >
              <span>{currentQuestionIndex === filteredQuestions.length - 1 ? 'See Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
