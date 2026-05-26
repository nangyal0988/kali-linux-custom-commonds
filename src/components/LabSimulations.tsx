import React, { useState } from "react";
import { Terminal as TerminalIcon, ShieldCheck, Play, HelpCircle, Trophy, RefreshCw, Star, Info, ListChecks, CheckCircle } from "lucide-react";
import { LabScenario, UserProgress } from "../types";
import { LAB_SCENARIOS } from "../data/labsData";
import Terminal from "./Terminal";

interface LabSimulationsProps {
  progress: UserProgress;
  onCompleteLab: (labId: string) => void;
  overrideCommand: string;
  onClearOverrideCommand: () => void;
}

export default function LabSimulations({
  progress,
  onCompleteLab,
  overrideCommand,
  onClearOverrideCommand
}: LabSimulationsProps) {
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [showHintIndex, setShowHintIndex] = useState<number | null>(null);

  const activeLab = LAB_SCENARIOS.find((l) => l.id === activeLabId);
  const isLabCompleted = activeLab ? progress.completedLabs.includes(activeLab.id) : false;

  const handleSelectLab = (labId: string) => {
    setActiveLabId(labId);
    setShowHintIndex(null);
  };

  const handleRestartLab = () => {
    // Triggers terminal reload by re-selecting the lab scenario
    if (activeLabId) {
      const tempId = activeLabId;
      setActiveLabId(null);
      setTimeout(() => {
        setActiveLabId(tempId);
        setShowHintIndex(null);
      }, 50);
    }
  };

  // Difficulty badge class helper
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-black text-emerald-400 border-white/10";
      case "Intermediate":
        return "bg-black text-amber-500 border-white/10";
      case "Advanced":
        return "bg-black text-rose-500 border-white/10";
      default:
        return "bg-black text-zinc-300 border-zinc-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="kali-lab-scenarios">
      {activeLab ? (
        /* Split Active Workspace Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="active-lab-workspace">
          {/* Left panel: Lab guide, parameters, and instructions */}
          <div className="lg:col-span-5 space-y-5 flex flex-col">
            {/* Return to menu header */}
            <div className="bg-[#0b0b0b] border border-zinc-850 p-4 rounded-none flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={() => setActiveLabId(null)}
                className="text-xs text-zinc-400 hover:text-cyber-green transition font-bold cursor-pointer"
              >
                ← BACK TO LIST
              </button>
              <button
                type="button"
                onClick={handleRestartLab}
                className="text-xs text-rose-500 hover:text-rose-450 flex items-center gap-1 cursor-pointer font-bold"
              >
                <RefreshCw size={12} />
                <span>RESTART SESSION</span>
              </button>
            </div>

            {/* Core Lab specs block */}
            <div className="bg-[#0d0d0d] border border-zinc-850 rounded-none p-5 space-y-4 font-mono shadow-md">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-none border ${getDifficultyColor(activeLab.difficulty)}`}>
                  {activeLab.difficulty}
                </span>
                <span className="text-xs font-mono text-zinc-500 font-bold">TARGET WORKSPACE: {activeLab.targetHost}</span>
              </div>

              <div>
                <h2 className="text-base font-black text-white leading-tight uppercase tracking-wider">{activeLab.title}</h2>
              </div>

              <div className="text-xs text-zinc-300 leading-relaxed bg-black p-4 rounded-none border border-zinc-900">
                <p>{activeLab.description}</p>
              </div>

              {/* Steps and checkboxes checklist */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-mono font-black text-zinc-500 flex items-center gap-1.5 uppercase tracking-widest">
                  <ListChecks size={14} className="text-cyber-green" />
                  <span>Interactive objectives checklist</span>
                </div>
                <div className="space-y-2">
                  {activeLab.steps.map((st, i) => (
                    <div 
                      key={i} 
                      className={`text-xs p-3 rounded-none border leading-tight transition flex items-start gap-2.5 ${
                        isLabCompleted
                          ? "bg-black border-emerald-950 text-emerald-300" 
                          : "bg-black border-zinc-900 text-zinc-450 bg-[#070707]"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isLabCompleted ? (
                          <CheckCircle size={15} className="text-[#00FF41]" />
                        ) : (
                          <div className="h-4 w-4 bg-black border border-zinc-805 rounded-none" />
                        )}
                      </div>
                      <div>
                        <strong>Task {i + 1}:</strong> {st.instruction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Celebratory Completion state banner */}
              {isLabCompleted && (
                <div className="bg-[#00FF41]/10 border border-[#00FF41]/45 text-cyber-green p-4 rounded-none flex items-center gap-3">
                  <Trophy size={32} className="shrink-0 text-[#00FF41] accent-text" />
                  <div className="text-xs">
                    <div className="font-black uppercase font-mono tracking-widest text-[#00FF41]">TARGET SECURED // OUTCOME OK</div>
                    <p className="text-zinc-300 mt-1 leading-snug">
                      Terminal sandbox metrics satisfied. Shell history validates required string sequences.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hint Drawer block */}
            <div className="bg-[#0d0d0d] border border-zinc-850 p-5 rounded-none space-y-3 shrink-0 font-mono shadow-sm">
              <div className="flex items-center gap-2 font-mono text-xs font-black text-zinc-400 uppercase tracking-widest">
                <HelpCircle size={14} className="text-cyber-green" />
                <span>Auditing manual hints</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono leading-relaxed">
                Stuck on the correct shell format? Expand security brief suggestions to locate instructions.
              </p>
              <div className="space-y-2">
                {activeLab.hints.map((htm, hIdx) => {
                  const isVisible = showHintIndex === hIdx;
                  return (
                    <div key={hIdx} className="border border-zinc-900 rounded-none bg-black">
                      <button
                        type="button"
                        onClick={() => setShowHintIndex(isVisible ? null : hIdx)}
                        className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-cyber-green transition bg-black flex items-center justify-between cursor-pointer"
                      >
                        <span>Hint Brief #{hIdx + 1}</span>
                        <span>{isVisible ? "Hide -" : "Reveal +"}</span>
                      </button>
                      {isVisible && (
                        <div className="p-3 bg-black text-[11px] text-[#00FF41] font-mono border-t border-zinc-900 break-all leading-normal">
                          {htm}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Terminal execution window */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-mono px-1 uppercase tracking-wider">
                <span>VIRTUAL KALI SHELL</span>
                <span className="text-cyber-green tracking-widest">● ACTIVE SIMULATOR</span>
              </div>
              
              <Terminal
                activeLab={activeLab}
                onLabComplete={onCompleteLab}
                overrideCommand={overrideCommand}
                onClearOverrideCommand={onClearOverrideCommand}
              />

              <div className="bg-[#0d0d0d] p-4 border border-zinc-850 rounded-none flex items-start gap-3">
                <Info size={16} className="text-zinc-500 mt-0.5 shrink-0" />
                <div className="text-[11px] leading-relaxed text-zinc-450 font-mono">
                  <strong className="text-zinc-300 uppercase">Terminal Sandbox Tips:</strong> Type standard navigation sequences like <code className="bg-black border border-white/5 px-1 py-0.5 text-[#00FF41] font-mono">ls</code> to check directory wordlists, or <code className="bg-black border border-white/5 px-1 py-0.5 text-[#00FF41] font-mono">cat instructions.txt</code> to read sandbox context. Use Up/Down Arrow keys to crawl command lines.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Lab Catalog Interface */
        <div className="space-y-6">
          <div className="bg-[#0d0d0d] border border-zinc-850 p-5 rounded-none space-y-3 shadow-md">
            <h2 className="text-base font-mono font-black text-white tracking-widest flex items-center gap-2 uppercase">
              <TerminalIcon className="text-cyber-green animate-pulse" />
              Interactive Lab Simulations catalog
            </h2>
            <p className="text-xs font-mono leading-relaxed text-zinc-450">
              Apply command theoretical skills. Test hosts on virtual networks inside our realistic terminal. Successfully matching target commands decrypts simulated results and awards completion badges.
            </p>
          </div>

          {/* Grid catalog display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="labs-scenario-syllabus-grid">
            {LAB_SCENARIOS.map((lab) => {
              const isFinished = progress.completedLabs.includes(lab.id);
              return (
                <div
                  key={lab.id}
                  onClick={() => handleSelectLab(lab.id)}
                  className={`bg-[#0d0d0d] border p-5 rounded-none transition flex flex-col justify-between space-y-4 cursor-pointer group ${
                    isFinished 
                      ? "border-emerald-500/20 bg-black/40 hover:border-emerald-500/50"
                      : "border-zinc-850 hover:border-cyber-green/45 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none border ${getDifficultyColor(lab.difficulty)}`}>
                        {lab.difficulty}
                      </span>
                      {isFinished && (
                        <span className="text-[10px] font-mono text-cyber-green flex items-center font-bold uppercase tracking-wider">
                          <Trophy size={12} className="mr-1" />
                          PASSED
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-mono font-bold text-[15px] text-white group-hover:text-cyber-green transition leading-snug uppercase">
                        {lab.title}
                      </h3>
                      <div className="text-[11px] font-mono text-zinc-500 mt-0.5 uppercase tracking-wide">Target IP: {lab.targetHost}</div>
                    </div>

                    <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">
                      {lab.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-zinc-900 group-hover:border-zinc-800">
                    <span className="text-zinc-500 group-hover:text-cyber-green transition font-mono uppercase tracking-wider">Launch Session →</span>
                    <span className="text-[#888] text-[10px] font-mono uppercase">
                      {lab.steps.length} INTERACTIVE TARGETS
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
