import React, { useState, useMemo } from "react";
import { Search, Star, ExternalLink, HelpCircle, Shield, ChevronDown, ChevronUp, Terminal, SlidersHorizontal } from "lucide-react";
import { KaliTool, UserProgress } from "../types";
import { TOOL_CATEGORIES, KALI_TOOLS } from "../data/toolsData";

interface ToolsListProps {
  progress: UserProgress;
  onToggleFavorite: (toolId: string) => void;
  onExecuteCommand: (command: string) => void;
  onNavigateToLab: () => void;
  initialCategoryFilter?: string; // Loaded dynamically from dashboard
}

export default function ToolsList({
  progress,
  onToggleFavorite,
  onExecuteCommand,
  onNavigateToLab,
  initialCategoryFilter
}: ToolsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryFilter || "All");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filter tools based on searches, active tab categories, and active difficulties
  const filteredTools = useMemo(() => {
    return KALI_TOOLS.filter(tool => {
      // 1. Search filter
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.commands.some(c => c.command.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Category filter
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;

      // 3. Difficulty filter
      const matchesDifficulty = activeDifficulty === "All" || tool.difficulty === activeDifficulty;

      // 4. Favorites filter
      const matchesFavorites = !showOnlyFavorites || progress.savedFavorites.includes(tool.id);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
    });
  }, [searchQuery, activeCategory, activeDifficulty, showOnlyFavorites, progress.savedFavorites]);

  const handleToggleExpand = (toolId: string) => {
    setExpandedToolId(prev => (prev === toolId ? null : toolId));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="kali-tools-dictionary">
      {/* Search Filter Header panel */}
      <div className="bg-[#0b0b0b] border border-zinc-850 p-5 rounded-none space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, commands, parameters... (e.g. nmap, gobuster)"
              className="w-full bg-black border border-zinc-800 rounded-none pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green/50 transition font-mono"
              id="kali-tools-search-input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter by Difficulty */}
            <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
              <SlidersHorizontal size={14} className="text-zinc-500" />
              <span>TIER:</span>
              <select
                value={activeDifficulty}
                onChange={(e) => setActiveDifficulty(e.target.value)}
                className="bg-black border border-zinc-800 rounded-none px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-cyber-green font-mono"
              >
                <option value="All">ALL LEVELS</option>
                <option value="Beginner">BEGINNER</option>
                <option value="Intermediate">INTERMEDIATE</option>
                <option value="Advanced">ADVANCED</option>
              </select>
            </div>

            {/* Toggle favorites search */}
            <button
              type="button"
              onClick={() => setShowOnlyFavorites(prev => !prev)}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs rounded-none transition cursor-pointer font-mono font-bold border uppercase ${
                showOnlyFavorites
                  ? "bg-cyber-green text-black border-cyber-green"
                  : "bg-black text-zinc-300 border-zinc-800 hover:bg-zinc-900"
              }`}
            >
              <Star size={13} fill={showOnlyFavorites ? "currentColor" : "none"} />
              <span>{showOnlyFavorites ? "SHOWING FAVORITES" : "SHOW FAVORITES"}</span>
            </button>
          </div>
        </div>

        {/* Quick Horizontal categories tab */}
        <div className="border-t border-zinc-900 pt-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`px-3 py-1 text-xs rounded-none cursor-pointer transition font-mono border uppercase ${
                activeCategory === "All"
                  ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_6px_rgba(0,255,65,0.2)]"
                  : "bg-black text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              All Categories
            </button>
            {TOOL_CATEGORIES.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1 text-xs rounded-none cursor-pointer transition font-mono border uppercase ${
                  activeCategory === cat.name
                    ? "bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_6px_rgba(0,255,65,0.2)]"
                    : "bg-black text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Search Counter */}
      <div className="text-xs text-zinc-400 font-mono flex items-center justify-between uppercase tracking-wider">
        <span>Displaying {filteredTools.length} security tool{filteredTools.length === 1 ? "" : "s"}</span>
        {showOnlyFavorites && (
          <span className="text-cyber-green font-bold">FAVORITES MODE ACTIVE</span>
        )}
      </div>

      {/* Grid List of matching tools */}
      <div className="space-y-4" id="filtered-tools-catalog">
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 bg-[#0b0b0b] border border-zinc-900 rounded-none space-y-3 font-mono">
            <p className="text-zinc-500 text-sm italic">No tool search results matched your parameters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setActiveDifficulty("All");
                setShowOnlyFavorites(false);
              }}
              className="text-xs text-cyber-green underline hover:text-white transition cursor-pointer"
            >
              RESET SCAN CRITERIA
            </button>
          </div>
        ) : (
          filteredTools.map((tool) => {
            const isExpanded = expandedToolId === tool.id;
            const isFavorite = progress.savedFavorites.includes(tool.id);

            return (
              <div
                key={tool.id}
                className={`bg-[#0d0d0d] border transition rounded-none overflow-hidden ${
                  isExpanded ? "border-cyber-green/50 shadow-[0_0_15px_rgba(0,255,65,0.05)]" : "border-zinc-850 hover:border-zinc-800"
                }`}
              >
                {/* Accordion header brief info wrapper */}
                <div 
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => handleToggleExpand(tool.id)}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 bg-black rounded-none border border-zinc-800 text-cyber-green mt-1 shrink-0">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[17px] font-bold text-white font-mono tracking-wide">{tool.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-black text-cyber-green border border-cyber-green/20">
                          {tool.category.toUpperCase()}
                        </span>
                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none border font-bold ${
                          tool.difficulty === "Beginner" 
                            ? "bg-black text-emerald-400 border-emerald-500/30"
                            : tool.difficulty === "Intermediate"
                            ? "bg-black text-amber-500 border-amber-500/30"
                            : "bg-black text-rose-500 border-rose-500/30"
                        }`}>
                          {tool.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 max-w-2xl leading-relaxed font-mono">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 sm:self-center self-end pl-14 sm:pl-0 shrink-0">
                    {/* Favorite item switch button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className={`p-2 rounded-none border transition cursor-pointer ${
                        isFavorite 
                          ? "bg-cyber-green/15 text-cyber-green border-cyber-green" 
                          : "bg-black text-zinc-650 border-zinc-800 hover:text-cyber-green hover:border-cyber-green/50"
                      }`}
                    >
                      <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <div className="text-zinc-500">
                      {isExpanded ? <ChevronUp size={18} className="text-cyber-green" /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details command breakdown nested drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 bg-black/80 border-t border-zinc-900 font-mono space-y-5">
                    {/* Practical audit deployment context */}
                    <div className="space-y-1 bg-[#090909] p-4 rounded-none border border-zinc-800">
                      <div className="text-xs font-mono font-black text-cyber-green tracking-widest uppercase">PRACTICAL DEPLOYMENT APPLICATION:</div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                        {tool.practicalApplication}
                      </p>
                    </div>

                    {/* Pre-mapped systems commands with individual summaries */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-black">Standard System Commands & Flags Syntax</h4>
                      {tool.commands.map((cmd) => (
                        <div key={cmd.id} className="bg-[#0b0b0b] border border-zinc-850 rounded-none p-4 space-y-3 hover:border-zinc-800 transition">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-black px-3 py-2 rounded-none border border-zinc-800">
                            <code className="text-xs text-cyber-green break-all select-all font-mono font-bold">
                              {cmd.command}
                            </code>
                            <div className="flex shrink-0 space-x-2">
                              {/* Try in terminal executor button */}
                              <button
                                type="button"
                                onClick={() => onExecuteCommand(cmd.command)}
                                className="px-2.5 py-1 bg-cyber-green/10 hover:bg-cyber-green/20 text-[10px] text-cyber-green rounded-none border border-cyber-green/40 hover:border-cyber-green transition flex items-center cursor-pointer font-mono font-bold"
                              >
                                <Terminal size={11} className="mr-1.5" />
                                EXECUTE IN LAB SANDBOX
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-zinc-200 font-black font-mono uppercase">{cmd.description}</div>
                            <p className="text-xs text-zinc-400 font-mono leading-relaxed">{cmd.purpose}</p>
                          </div>

                          {/* Parameter indicators */}
                          {cmd.flags.length > 0 && (
                            <div className="pt-2 border-t border-zinc-900 font-mono text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2">
                              {cmd.flags.map((flg, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <span className="text-cyber-green font-bold shrink-0">{flg.flag}</span>
                                  <span className="text-zinc-600 pr-1">:</span>
                                  <span className="text-zinc-400">{flg.explanation}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer call to actions */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={onNavigateToLab}
                        className="text-xs text-black hover:bg-cyber-green/90 bg-cyber-green px-4 py-2 rounded-none font-mono font-black tracking-wider transition cursor-pointer"
                      >
                        PRACTICE METHODOLOGIES IN TERMINAL →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
