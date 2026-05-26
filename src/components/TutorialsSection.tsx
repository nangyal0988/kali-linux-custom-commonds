import React, { useState } from "react";
import { BookOpen, CheckCircle, Clock, ChevronRight, Lock, Award, Play, ChevronLeft } from "lucide-react";
import { Tutorial, UserProgress } from "../types";
import { TUTORIALS } from "../data/tutorialsData";

interface TutorialsSectionProps {
  progress: UserProgress;
  onMarkComplete: (tutorialId: string) => void;
  onExecuteCommand: (command: string) => void;
  onNavigateToLab: () => void;
}

export default function TutorialsSection({
  progress,
  onMarkComplete,
  onExecuteCommand,
  onNavigateToLab
}: TutorialsSectionProps) {
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const activeTutorial = TUTORIALS.find((t) => t.id === activeTutorialId);

  // Difficulty badge styling helper
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <span className="bg-black text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-mono px-2 py-0.5 rounded-none">Beginner</span>;
      case "Intermediate":
        return <span className="bg-black text-amber-500 border border-amber-500/30 text-[9px] uppercase font-mono px-2 py-0.5 rounded-none">Intermediate</span>;
      case "Advanced":
        return <span className="bg-black text-rose-500 border border-rose-500/30 text-[9px] uppercase font-mono px-2 py-0.5 rounded-none">Advanced</span>;
      default:
        return null;
    }
  };

  const handleSelectTutorial = (tutorial: Tutorial) => {
    setActiveTutorialId(tutorial.id);
    setActiveStep(0);
  };

  const handleNextStep = () => {
    if (activeTutorial && activeStep + 1 < activeTutorial.steps.length) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleCompleteLessonAndTrack = () => {
    if (activeTutorial) {
      onMarkComplete(activeTutorial.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="kali-syllabus-tutorials">
      {/* If a tutorial is active, show the reading step-by-step layout */}
      {activeTutorial ? (
        <div className="bg-[#0d0d0d] border border-zinc-850 rounded-none overflow-hidden shadow-2xl" id="active-tutorial-step-viewer">
          {/* Header */}
          <div className="p-5 bg-black border-b border-zinc-900 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTutorialId(null)}
              className="flex items-center text-xs text-zinc-400 hover:text-cyber-green transition cursor-pointer font-mono"
            >
              <ChevronLeft size={16} />
              <span>Syllabus Overview Directory</span>
            </button>
            <div className="flex items-center space-x-2">
              {getDifficultyBadge(activeTutorial.difficulty)}
              <span className="text-xs font-mono text-zinc-500 font-bold uppercase">{activeTutorial.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Steps & Content Panel */}
            <div className="lg:col-span-8 p-6 space-y-6 border-r border-zinc-900">
              <div className="space-y-1">
                <div className="text-xs text-cyber-green font-mono font-bold uppercase tracking-widest">STEP {activeStep + 1} OF {activeTutorial.steps.length}</div>
                <h2 className="text-xl font-mono font-black text-white tracking-wide uppercase">{activeTutorial.steps[activeStep].title}</h2>
              </div>

              {/* Central text content */}
              <div className="prose prose-invert max-w-none text-zinc-300 text-xs font-mono leading-relaxed whitespace-pre-line bg-black/60 p-4 border border-zinc-900">
                {activeTutorial.steps[activeStep].content}
              </div>

              {/* If step has executable command practice block */}
              {activeTutorial.steps[activeStep].command && (
                <div className="bg-black p-4 rounded-none border border-zinc-850 space-y-3 font-mono">
                  <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">SUGGESTED STUDY COMMAND</div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d0d0d] p-2.5 rounded-none border border-zinc-900">
                    <code className="text-xs text-cyber-green break-all select-all font-mono font-bold">
                      {activeTutorial.steps[activeStep].command}
                    </code>
                    <button
                      type="button"
                      onClick={() => onExecuteCommand(activeTutorial.steps[activeStep].command || "")}
                      className="px-2.5 py-1 bg-cyber-green/10 hover:bg-cyber-green/20 text-[10px] text-cyber-green rounded-none border border-cyber-green/45 hover:text-white transition flex items-center shrink-0 cursor-pointer font-mono font-black"
                    >
                      <Play size={10} className="mr-1.5" />
                      TRY IN TERMINAL
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation button rows */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStep === 0}
                  className={`text-xs px-4 py-1.5 rounded-none transition font-mono font-bold cursor-pointer uppercase border ${
                    activeStep === 0
                      ? "text-zinc-700 bg-black border-zinc-900 cursor-not-allowed"
                      : "text-zinc-300 bg-zinc-900 border-zinc-805 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  ◀ PREVIOUS
                </button>

                {activeStep + 1 < activeTutorial.steps.length ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="text-xs px-4 py-1.5 bg-black text-cyber-green border border-cyber-green/40 rounded-none hover:border-cyber-green transition font-mono font-bold cursor-pointer uppercase"
                  >
                    NEXT STEP ▶
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteLessonAndTrack}
                    className={`text-xs px-5 py-2 rounded-none font-mono transition flex items-center gap-2 cursor-pointer font-bold uppercase border ${
                      progress.completedTutorials.includes(activeTutorial.id)
                        ? "bg-black text-emerald-400 border-emerald-500/20"
                        : "bg-cyber-green text-black border-cyber-green hover:bg-cyber-green/90 font-black"
                    }`}
                  >
                    <CheckCircle size={15} />
                    <span>
                      {progress.completedTutorials.includes(activeTutorial.id)
                        ? "LESSON COMPLETED"
                        : "MARK COMPLETED"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Side Roadmap Objectives Panel */}
            <div className="lg:col-span-4 p-5 bg-black/60 font-mono space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Syllabus Overview</h3>
                <h4 className="text-xs font-bold text-zinc-300 uppercase">{activeTutorial.title}</h4>
              </div>

              {/* Task list checkbox items */}
              <div className="space-y-4">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">OBJECTIVE METRICS:</div>
                <div className="space-y-3">
                  {activeTutorial.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start text-xs text-zinc-400 space-x-2.5">
                      <div className="h-4 w-4 bg-black border border-zinc-800 rounded-none flex items-center justify-center text-cyber-green font-mono mt-0.5 shrink-0 text-[10px]">
                        {i + 1}
                      </div>
                      <span className="leading-tight">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick direct index map links */}
              <div className="pt-4 border-t border-zinc-900 space-y-2">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">STEP MAP:</div>
                {activeTutorial.steps.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left font-mono text-[11px] p-2 rounded-none transition flex items-center justify-between cursor-pointer border ${
                      activeStep === idx
                        ? "bg-cyber-green/10 text-cyber-green border-cyber-green"
                        : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-[#070707]"
                    }`}
                  >
                    <span>{idx + 1}. {st.title.toUpperCase()}</span>
                    {idx < activeStep && <CheckCircle size={11} className="text-cyber-green shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Sandbox promotion card link */}
              <div className="p-4 bg-black/80 border border-zinc-850 rounded-none text-zinc-400 space-y-2.5">
                <div className="text-[10px] text-cyber-green font-mono font-black uppercase flex items-center gap-1.5">
                  <Award size={12} />
                  <span>Interactive lab ready</span>
                </div>
                <p className="text-[11px] leading-snug">
                  Would you like to try executing these instructions against alive simulated targets rather than free typing?
                </p>
                <button
                  type="button"
                  onClick={onNavigateToLab}
                  className="text-[11px] text-cyber-green font-black tracking-wide hover:underline cursor-pointer"
                >
                  JUMP TO LAB SIMULATION →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Syllabus Overview List */
        <div className="space-y-6">
          <div className="bg-[#0d0d0d] border border-zinc-850 p-5 rounded-none space-y-3 shadow-md">
            <h2 className="text-base font-mono font-black text-white tracking-widest flex items-center gap-2 uppercase">
              <BookOpen className="text-cyber-green animate-pulse" />
              Syllabus Curriculum Course Map
            </h2>
            <p className="text-xs font-mono leading-relaxed text-zinc-450">
              Our step-by-step Kali tutorials teach security logic. Clicking a course yields detailed command insights, conceptual structures, and instant local execution hooks in our cyber workstation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tutorials-curriculum-grid">
            {TUTORIALS.map((tutorial) => {
              const isCompleted = progress.completedTutorials.includes(tutorial.id);
              return (
                <div
                  key={tutorial.id}
                  onClick={() => handleSelectTutorial(tutorial)}
                  className={`bg-[#0d0d0d] border p-5 rounded-none transition flex flex-col justify-between space-y-4 cursor-pointer group ${
                    isCompleted 
                      ? "border-emerald-500/20 bg-black/40 hover:border-emerald-500/50"
                      : "border-zinc-850 hover:border-cyber-green/40 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {getDifficultyBadge(tutorial.difficulty)}
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-mono text-zinc-500 flex items-center">
                          <Clock size={12} className="mr-1 text-zinc-600" />
                          {tutorial.estimatedMinutes} Mins
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-mono text-cyber-green flex items-center font-bold uppercase tracking-wider">
                            <CheckCircle size={12} className="mr-1" />
                            DONE
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-mono font-bold text-[15px] text-white group-hover:text-cyber-green transition leading-snug uppercase">
                        {tutorial.title}
                      </h3>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">{tutorial.category}</div>
                    </div>

                    <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">
                      {tutorial.objectives[0]}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-zinc-900 group-hover:border-zinc-800">
                    <span className="text-zinc-500 group-hover:text-cyber-green transition font-mono uppercase tracking-wider">READ LESSON →</span>
                    <span className="text-zinc-500 text-[10px] font-mono uppercase">
                      {tutorial.steps.length} STUDY STEPS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
