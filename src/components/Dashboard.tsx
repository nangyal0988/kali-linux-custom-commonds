import React from "react";
import { ShieldCheck, BookOpen, Terminal, Trophy, Star, ArrowRight, Award, Zap } from "lucide-react";
import { UserProgress, KaliTool } from "../types";
import { TOOL_CATEGORIES, KALI_TOOLS } from "../data/toolsData";
import { TUTORIALS } from "../data/tutorialsData";
import { LAB_SCENARIOS } from "../data/labsData";

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (tab: "dashboard" | "tools" | "tutorials" | "labs" | "quiz", filterOption?: string) => void;
}

export default function Dashboard({ progress, onNavigate }: DashboardProps) {
  // Stats calculations
  const totalTutorials = TUTORIALS.length;
  const completedTutorialsCount = progress.completedTutorials.length;
  const tutorialsPercent = totalTutorials > 0 ? Math.round((completedTutorialsCount / totalTutorials) * 100) : 0;

  const totalLabs = LAB_SCENARIOS.length;
  const completedLabsCount = progress.completedLabs.length;
  const labsPercent = totalLabs > 0 ? Math.round((completedLabsCount / totalLabs) * 100) : 0;

  const totalTools = KALI_TOOLS.length;
  const favoritedCount = progress.savedFavorites.length;

  const highestQuizScore = Object.values(progress.quizHighScores).reduce((max, score) => Math.max(max, score), 0);

  // Daily Recommended Tutorial/Lab selection helper
  const nextTutorial = TUTORIALS.find(t => !progress.completedTutorials.includes(t.id)) || TUTORIALS[0];
  const nextLab = LAB_SCENARIOS.find(l => !progress.completedLabs.includes(l.id)) || LAB_SCENARIOS[0];

  return (
    <div className="space-y-8" id="dashboard-tab-view">
      {/* Title greeting banner */}
      <div className="bg-[#0b0b0b] border border-cyber-green/40 p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(0,255,65,0.06)]">
        <div>
          <h1 className="text-2xl font-mono font-black tracking-widest text-[#00FF41] mb-2 flex items-center gap-2 uppercase">
            <ShieldCheck className="text-cyber-green animate-pulse" />
            OPERATIVE STATION: ACTIVE
          </h1>
          <p className="text-xs text-zinc-400 font-mono max-w-2xl leading-relaxed">
            Welcome to the secure Kali Linux Command and Auditing syllabus. Track your educational goals, complete virtual command-line simulations, and test your credentials parsing knowledge.
          </p>
        </div>
        <div className="p-4 bg-black rounded-none border border-cyber-green/30 text-center shrink-0">
          <div className="text-[10px] text-zinc-500 font-mono tracking-widest">KNOWLEDGE INDEX</div>
          <div className="text-3xl font-black text-cyber-green font-mono accent-text">
            {Math.round((completedTutorialsCount + completedLabsCount) / (totalTutorials + totalLabs) * 100) || 0}%
          </div>
          <div className="text-[9px] text-zinc-400 font-mono uppercase">COMPLIANCE RATIO</div>
        </div>
      </div>

      {/* Stats Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-grid">
        {/* Tutorials completed */}
        <div className="bg-[#080808]/80 border border-zinc-800 p-5 rounded-none hover:border-cyber-green/40 transition flex items-start justify-between">
          <div className="space-y-2 w-full pr-2">
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider block uppercase">Syllabus Tutorials</span>
            <div className="text-3xl font-extrabold font-mono text-white">{completedTutorialsCount}/{totalTutorials}</div>
            <div className="w-full bg-[#111] h-1.5 rounded-none mt-2">
              <div 
                className="bg-cyber-green h-1.5 rounded-none shadow-[0_0_6px_#00FF41]" 
                style={{ width: `${tutorialsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-cyber-green font-mono block uppercase">{tutorialsPercent}% COURSE COMPLETED</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-cyber-green">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Labs cleared */}
        <div className="bg-[#080808]/80 border border-zinc-800 p-5 rounded-none hover:border-cyber-green/40 transition flex items-start justify-between">
          <div className="space-y-2 w-full pr-2">
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider block uppercase">Sandbox Labs Cleared</span>
            <div className="text-3xl font-extrabold font-mono text-white">{completedLabsCount}/{totalLabs}</div>
            <div className="w-full bg-[#111] h-1.5 rounded-none mt-2">
              <div 
                className="bg-cyber-green h-1.5 rounded-none shadow-[0_0_6px_#00FF41]" 
                style={{ width: `${labsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-cyber-green font-mono block uppercase">{labsPercent}% LAB TRACK COMPLETED</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-cyber-green">
            <Terminal size={20} />
          </div>
        </div>

        {/* Saved Favorites */}
        <div className="bg-[#080808]/80 border border-zinc-800 p-5 rounded-none hover:border-cyber-green/40 transition flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider block uppercase">Saved Key Tools</span>
            <div className="text-3xl font-extrabold font-mono text-white">{favoritedCount}/{totalTools}</div>
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Favorites bookmarked for rapid command reference</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-cyber-green">
            <Star size={20} />
          </div>
        </div>

        {/* High quiz scores */}
        <div className="bg-[#080808]/80 border border-zinc-800 p-5 rounded-none hover:border-cyber-green/40 transition flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider block uppercase">Top Quiz Score Score</span>
            <div className="text-3xl font-extrabold font-mono text-white">
              {highestQuizScore > 0 ? `${highestQuizScore}%` : "0% RECORDED"}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Simulated general certification exams passed</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-cyber-green">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      {/* Suggested next step track & Daily tip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Recommendation */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
            <Zap size={18} className="text-cyber-green" />
            RECOMMENDED FOR THREAT ANALYSIS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tutorial Card */}
            {nextTutorial && (
              <div className="bg-[#0d0d0d] border border-zinc-800 p-5 rounded-none flex flex-col justify-between hover:border-cyber-green/40 transition">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-none bg-black text-cyber-green border border-cyber-green/40">
                      LESSON // {nextTutorial.difficulty}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">{nextTutorial.estimatedMinutes} Mins</span>
                  </div>
                  <h3 className="font-mono font-bold text-white text-sm mb-1 uppercase">{nextTutorial.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-mono">{nextTutorial.objectives[0]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("tutorials")}
                  className="mt-4 flex items-center justify-center text-xs text-black font-semibold font-mono tracking-widest hover:bg-cyber-green/90 transition w-full p-2 bg-cyber-green rounded-none cursor-pointer"
                >
                  START LESSON <ArrowRight size={12} className="ml-1" />
                </button>
              </div>
            )}

            {/* Lab Card */}
            {nextLab && (
              <div className="bg-[#0d0d0d] border border-zinc-800 p-5 rounded-none flex flex-col justify-between hover:border-cyber-green/40 transition">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-none bg-black text-cyber-green border border-cyber-green/40">
                      SANDBOX // {nextLab.difficulty}
                    </span>
                    <span className="text-[9px] font-mono text-cyber-green font-semibold mb-1">IP: {nextLab.targetHost}</span>
                  </div>
                  <h3 className="font-mono font-bold text-white text-sm mb-1 uppercase">{nextLab.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-mono">{nextLab.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("labs")}
                  className="mt-4 flex items-center justify-center text-xs text-cyber-green font-semibold font-mono tracking-widest hover:bg-cyber-green hover:text-black transition w-full p-2 bg-black border border-cyber-green rounded-none cursor-pointer"
                >
                  LAUNCH SIMULATOR <ArrowRight size={12} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Rules Notice */}
        <div className="lg:col-span-4 bg-[#0d0d0d] border border-zinc-800 p-5 rounded-none flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-cyber-green mb-3 font-bold text-xs font-mono tracking-widest">
              <Award size={16} />
              <span>ETHICAL PENETRATION PROTOCOL</span>
            </div>
            <h3 className="text-xs font-bold text-slate-200 font-mono uppercase">Ethical Framework & Liability</h3>
            <p className="text-xs font-mono leading-relaxed text-zinc-400 mt-2">
              All scanning commands demonstrated within this learning hub should ONLY be performed against systems you explicitly own, lease, or hold pre-signed clearances for. Running active probes against unconsented external entities constitutes system interference under cybersecurity criminal codes.
            </p>
          </div>
          <div className="p-3 bg-black rounded-none border border-cyber-green/20 border-l-2 border-l-cyber-green font-mono text-[10px] text-zinc-300">
            Never probe public networks without mutual, legally binding corporate agreements.
          </div>
        </div>
      </div>

      {/* Tool categories filter shortcuts */}
      <div className="space-y-4">
        <h2 className="text-base font-mono font-bold text-white tracking-widest uppercase">BROWSE DIRECTORY CATEGORIES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOL_CATEGORIES.map((cat, i) => {
            const toolsInCat = KALI_TOOLS.filter(t => t.category === cat.name);
            return (
              <div 
                key={i} 
                onClick={() => onNavigate("tools", cat.name)}
                className="bg-[#080808]/60 hover:bg-[#0d0d0d] border border-zinc-800 hover:border-cyber-green/40 p-4 rounded-none cursor-pointer transition flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  <div className="text-cyber-green font-mono text-xs mb-1 uppercase font-black tracking-widest">{cat.name}</div>
                  <p className="text-xs font-mono text-zinc-400 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                  <span>{toolsInCat.length} PRE-MAPPED TOOLS</span>
                  <span className="text-cyber-green font-bold flex items-center">EXPLORE →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
