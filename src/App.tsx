import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Terminal as TerminalIcon, 
  BookOpen, 
  Trophy, 
  Star, 
  Menu, 
  X, 
  LayoutDashboard, 
  Settings, 
  GraduationCap, 
  ShieldAlert, 
  Code
} from "lucide-react";
import { UserProgress } from "./types";
import Dashboard from "./components/Dashboard";
import ToolsList from "./components/ToolsList";
import TutorialsSection from "./components/TutorialsSection";
import LabSimulations from "./components/LabSimulations";
import QuizSection from "./components/QuizSection";

const LOCAL_STORAGE_KEY = "kali_learning_hub_user_progress";

const DEFAULT_PROGRESS: UserProgress = {
  savedFavorites: [],
  completedTutorials: [],
  completedLabs: [],
  quizHighScores: {}
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [activeTab, setActiveTab] = useState<"dashboard" | "tools" | "tutorials" | "labs" | "quiz">("dashboard");
  const [selectedToolsCategory, setSelectedToolsCategory] = useState<string>("All");
  const [overrideTerminalCommand, setOverrideTerminalCommand] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load progress on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading progress localStorage", e);
    }
  }, []);

  // Save progress automatically
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.error("Error writing progress localStorage", e);
    }
  };

  // Notification helper
  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Toggle tool bookmark favoriting
  const handleToggleFavorite = (toolId: string) => {
    const isFav = progress.savedFavorites.includes(toolId);
    let updated: string[];
    if (isFav) {
      updated = progress.savedFavorites.filter(id => id !== toolId);
      triggerNotification("Tool removed from favorites.");
    } else {
      updated = [...progress.savedFavorites, toolId];
      triggerNotification("Tool added to favorites catalog.");
    }
    saveProgress({ ...progress, savedFavorites: updated });
  };

  // Complete a tutorial task course
  const handleMarkTutorialComplete = (tutorialId: string) => {
    if (progress.completedTutorials.includes(tutorialId)) return;
    const updated = [...progress.completedTutorials, tutorialId];
    triggerNotification("Tutorial milestone completed! Progress log updated.");
    saveProgress({ ...progress, completedTutorials: updated });
  };

  // Complete a simulator lab exercise targets
  const handleCompleteLab = (labId: string) => {
    if (progress.completedLabs.includes(labId)) return;
    const updated = [...progress.completedLabs, labId];
    triggerNotification("Simulation target matched! Lab successfully cleared!");
    saveProgress({ ...progress, completedLabs: updated });
  };

  // Quiz high scoring tracker logs
  const handleSaveQuizHighScore = (quizCategory: string, score: number) => {
    const previousScore = progress.quizHighScores[quizCategory] || 0;
    if (score > previousScore) {
      const updatedScores = { ...progress.quizHighScores, [quizCategory]: score };
      triggerNotification(`New High Score established: ${score}%!`);
      saveProgress({ ...progress, quizHighScores: updatedScores });
    } else {
      triggerNotification(`Quiz completed with score: ${score}%. Try again to beat your high score!`);
    }
  };

  // Command loader: Clicking 'Try' loads the lab workspace and injects the text
  const handleExecuteCommandInSandbox = (command: string) => {
    setOverrideTerminalCommand(command);
    setActiveTab("labs");
    triggerNotification("Suggested command loaded into Sandbox Workspace.");
  };

  // Custom Navigation hub selection
  const handleNavigate = (tab: "dashboard" | "tools" | "tutorials" | "labs" | "quiz", filterOption?: string) => {
    setActiveTab(tab);
    if (tab === "tools" && filterOption) {
      setSelectedToolsCategory(filterOption);
    } else if (tab === "tools") {
      setSelectedToolsCategory("All");
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col font-sans selection:bg-cyber-green selection:text-black" id="kali-root-layout">
      {/* Dynamic Toast Alerts Popup */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0d0d0d] border border-cyber-green shadow-[0_0_15px_rgba(0,255,65,0.3)] px-5 py-3 rounded-none flex items-center space-x-3 text-xs font-mono font-bold animate-bounce text-cyber-green">
          <ShieldAlert size={16} className="text-cyber-green animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Top Header Navigation panel */}
      <header className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-cyber-green/30 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#050505] p-2 rounded-none border border-cyber-green/30 text-cyber-green shrink-0 shadow-[0_0_8px_rgba(0,255,65,0.1)]">
              <ShieldAlert size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black tracking-widest text-cyber-green text-[16px] uppercase">KALI LEARNING HUB</span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-none bg-black text-cyber-green border border-cyber-green font-bold">OPERATIVE</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">SECURE KALI PENETRATION FRAMEWORK</p>
            </div>
          </div>

          {/* Desktop Tab indicators row */}
          <nav className="hidden md:flex items-center space-x-2" id="desktop-primary-nav">
            <button
              onClick={() => handleNavigate("dashboard")}
              className={`px-3 py-1.5 rounded-none text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                activeTab === "dashboard"
                  ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.15)]"
                  : "text-zinc-400 border-transparent hover:text-white hover:border-zinc-800"
              }`}
            >
              <LayoutDashboard size={14} />
              <span>DASHBOARD</span>
            </button>
            <button
              onClick={() => handleNavigate("tools")}
              className={`px-3 py-1.5 rounded-none text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                activeTab === "tools"
                  ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.15)]"
                  : "text-zinc-400 border-transparent hover:text-white hover:border-zinc-800"
              }`}
            >
              <Code size={14} />
              <span>TOOLS GLOSSARY</span>
            </button>
            <button
              onClick={() => handleNavigate("tutorials")}
              className={`px-3 py-1.5 rounded-none text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                activeTab === "tutorials"
                  ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.15)]"
                  : "text-zinc-400 border-transparent hover:text-white hover:border-zinc-800"
              }`}
            >
              <GraduationCap size={14} />
              <span>SYLLABUS TUTORIALS</span>
            </button>
            <button
              onClick={() => handleNavigate("labs")}
              className={`px-3 py-1.5 rounded-none text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                activeTab === "labs"
                  ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.15)]"
                  : "text-zinc-400 border-transparent hover:text-white hover:border-zinc-800"
              }`}
            >
              <TerminalIcon size={14} />
              <span>VIRTUAL LABS</span>
            </button>
            <button
              onClick={() => handleNavigate("quiz")}
              className={`px-3 py-1.5 rounded-none text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                activeTab === "quiz"
                  ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.15)]"
                  : "text-zinc-400 border-transparent hover:text-white hover:border-zinc-800"
              }`}
            >
              <Trophy size={14} />
              <span>AUDIT QUIZZES</span>
            </button>
          </nav>

          {/* Quick global visual checklist stats */}
          <div className="hidden lg:flex items-center space-x-4 border-l border-zinc-800 pl-4 font-mono text-[11px] text-zinc-500">
            <div>
              Tutorials: <span className="text-cyber-green font-bold">{progress.completedTutorials.length}</span>
            </div>
            <div>
              Labs Cleared: <span className="text-cyber-green font-bold">{progress.completedLabs.length}</span>
            </div>
          </div>

          {/* Mobile responsive drawer toggling button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-none border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyber-green/20 bg-[#0d0d0d]/95 py-3 px-4 font-mono space-y-2 shrink-0 animate-fade-in" id="mobile-navigation-drawer">
          <button
            onClick={() => handleNavigate("dashboard")}
            className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-cyber-green hover:bg-[#111111] rounded transition flex items-center space-x-2"
          >
            <LayoutDashboard size={14} />
            <span>DASHBOARD OVERVIEW</span>
          </button>
          <button
            onClick={() => handleNavigate("tools")}
            className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-cyber-green hover:bg-[#111111] rounded transition flex items-center space-x-2"
          >
            <Code size={14} />
            <span>TOOLS GLOSSARY</span>
          </button>
          <button
            onClick={() => handleNavigate("tutorials")}
            className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-cyber-green hover:bg-[#111111] rounded transition flex items-center space-x-2"
          >
            <GraduationCap size={14} />
            <span>SYLLABUS TUTORIALS</span>
          </button>
          <button
            onClick={() => handleNavigate("labs")}
            className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-cyber-green hover:bg-[#111111] rounded transition flex items-center space-x-2"
          >
            <TerminalIcon size={14} />
            <span>VIRTUAL LABS</span>
          </button>
          <button
            onClick={() => handleNavigate("quiz")}
            className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-cyber-green hover:bg-[#111111] rounded transition flex items-center space-x-2"
          >
            <Trophy size={14} />
            <span>AUDIT QUIZZES</span>
          </button>
        </div>
      )}

      {/* Main Container screen rendering */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8" id="layout-main-content-window">
        {activeTab === "dashboard" && (
          <Dashboard 
            progress={progress} 
            onNavigate={handleNavigate} 
          />
        )}
        {activeTab === "tools" && (
          <ToolsList
            progress={progress}
            onToggleFavorite={handleToggleFavorite}
            onExecuteCommand={handleExecuteCommandInSandbox}
            onNavigateToLab={() => handleNavigate("labs")}
            initialCategoryFilter={selectedToolsCategory}
          />
        )}
        {activeTab === "tutorials" && (
          <TutorialsSection
            progress={progress}
            onMarkComplete={handleMarkTutorialComplete}
            onExecuteCommand={handleExecuteCommandInSandbox}
            onNavigateToLab={() => handleNavigate("labs")}
          />
        )}
        {activeTab === "labs" && (
          <LabSimulations
            progress={progress}
            onCompleteLab={handleCompleteLab}
            overrideCommand={overrideTerminalCommand}
            onClearOverrideCommand={() => setOverrideTerminalCommand("")}
          />
        )}
        {activeTab === "quiz" && (
          <QuizSection
            progress={progress}
            onSaveHighScore={handleSaveQuizHighScore}
          />
        )}
      </main>

      {/* Humble Footer */}
      <footer className="border-t border-zinc-900 bg-[#0d0d0d] py-6 px-4 text-center shrink-0">
        <p className="text-xs text-zinc-600 font-mono tracking-wider">
          KALI LINUX AUDIT COMMAND STATION // DESIGNED FOR OFFENSIVE SECURITY ARCHITECT LEARNING & ANALYTICAL COMPLIANCE.
        </p>
      </footer>
    </div>
  );
}
