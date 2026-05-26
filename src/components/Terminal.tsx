import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Play, RefreshCw, HelpCircle, FileText, ChevronRight } from "lucide-react";
import { LabScenario } from "../types";

interface TerminalProps {
  activeLab?: LabScenario;
  onLabComplete?: (labId: string) => void;
  overrideCommand?: string;
  onClearOverrideCommand?: () => void;
}

export default function Terminal({
  activeLab,
  onLabComplete,
  overrideCommand,
  onClearOverrideCommand
}: TerminalProps) {
  const [history, setHistory] = useState<{ type: "input" | "system" | "success" | "error"; text: string }[]>([
    { type: "system", text: "Kali GNU/Linux Rolling 2026.1 (kali-learning-hub)" },
    { type: "system", text: "Type 'help' to see basic available hub console commands." },
    { type: "system", text: "" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filesystem simulator
  const mockFiles: Record<string, string> = {
    "instructions.txt": "=== Kali Learning Terminal ===\n- Complete tutorials by following step indicators.\n- Load Labs from the menu to test interactive hacking environments.\n- Use Nmap, Gobuster, Hydra, or John to capture flags.",
    "common.txt": "admin\nadministrator\nassets\napi\nbackups\ncss\ndatabase\nimages\nindex.html\nlogin\nportal\nuploads",
    "wordlist.txt": "password123\nadmin12\nqwerty\nkali123\nsunshine\nhunter2\nshadowcrack\nfortress\ndarkmatter\npass1",
    "hash.txt": "admin_hash: $2y$12$R9h/cIPzQs1AOkqR1QvWv.mEepb2xepDLae15/qO7g6Zdfortress"
  };

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  // Reset lab progress when active lab shifts
  useEffect(() => {
    setActiveStepIndex(0);
    setHistory([
      { type: "system", text: `--- Loaded Lab: ${activeLab ? activeLab.title : "Default Workspace"} ---` },
      { type: "system", text: activeLab ? activeLab.description : "Free practice terminal shell loaded." },
      { type: "system", text: activeLab ? `OBJECTIVE: ${activeLab.objective}` : "Type 'tools' to see cybersecurity commands." },
      { type: "system", text: "" }
    ]);
  }, [activeLab]);

  // Handle external command execution requests (e.g. from tutorial "Try" clicks)
  useEffect(() => {
    if (overrideCommand) {
      setInputVal(overrideCommand);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (onClearOverrideCommand) {
        onClearOverrideCommand();
      }
    }
  }, [overrideCommand, onClearOverrideCommand]);

  const handleCommandSubmit = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add to input logs history
    setHistory(prev => [...prev, { type: "input", text: `kali@learning-hub:~$ ${trimmedCmd}` }]);
    setCommandHistory(prev => [trimmedCmd, ...prev]);
    setHistoryPointer(-1);
    setInputVal("");

    setIsRunning(true);

    // Simulate short network latency/computing delay to feel high-quality
    setTimeout(() => {
      processCommand(trimmedCmd);
      setIsRunning(false);
    }, 600);
  };

  const processCommand = (cmd: string) => {
    const spaceSplit = cmd.split(/\s+/);
    const primary = spaceSplit[0].toLowerCase();

    // Check if there is an active lab, and if this command matches the active step
    if (activeLab) {
      const currentStep = activeLab.steps[activeStepIndex];
      // Compare after removing excessive spacing, quotes etc
      const normalizedQuery = cmd.replace(/\s+/g, " ").trim();
      const expectedString = typeof currentStep.expectedCommand === "string" 
        ? currentStep.expectedCommand.replace(/\s+/g, " ").trim()
        : "";

      if (normalizedQuery === expectedString || normalizedQuery === expectedString.replace(/"/g, "")) {
        // Success match for active lab step!
        setHistory(prev => [
          ...prev,
          { type: "success", text: currentStep.successOutput }
        ]);

        if (activeStepIndex + 1 < activeLab.steps.length) {
          setActiveStepIndex(prev => prev + 1);
          setHistory(prev => [
            ...prev,
            { type: "system", text: `[SYSTEM] Step completed! Proceeding to next objective.` }
          ]);
        } else {
          // Lab completed!
          if (onLabComplete) {
            onLabComplete(activeLab.id);
          }
        }
        return;
      }
    }

    // Standard shell utilities if not matching expected lab command
    switch (primary) {
      case "help":
        setHistory(prev => [
          ...prev,
          { type: "system", text: "Available System commands:\n  help         Display instructions\n  clear        Reset terminal output\n  ls           List sandbox files\n  cat [file]   Print core files\n  whoami       Identify session username\n  tools        List specialized Kali tools" }
        ]);
        break;

      case "clear":
        setHistory([]);
        break;

      case "whoami":
        setHistory(prev => [...prev, { type: "system", text: "kali@learning-hub -- Authorized Certification Auditor" }]);
        break;

      case "tools":
        setHistory(prev => [
          ...prev,
          { type: "system", text: "Specialized Kali binaries preloaded:\n  nmap\n  gobuster\n  hydra\n  sqlmap\n  john\n  nc (netcat)" }
        ]);
        break;

      case "ls":
        const fileNames = Object.keys(mockFiles).join("    ");
        setHistory(prev => [...prev, { type: "system", text: fileNames }]);
        break;

      case "cat":
        const targetFile = spaceSplit[1];
        if (!targetFile) {
          setHistory(prev => [...prev, { type: "error", text: "cat: missing operand. Usage: cat [filename]" }]);
        } else if (mockFiles[targetFile]) {
          setHistory(prev => [...prev, { type: "system", text: mockFiles[targetFile] }]);
        } else {
          setHistory(prev => [...prev, { type: "error", text: `cat: ${targetFile}: No such file or directory` }]);
        }
        break;

      case "nmap":
      case "gobuster":
      case "hydra":
      case "sqlmap":
      case "john":
      case "nc":
        // Simulated standard tools warnings if missing parameters or not in correct lab
        if (activeLab) {
          setHistory(prev => [
            ...prev,
            { type: "error", text: `Command completed but didn't match the active Lab target.` },
            { type: "system", text: `Expected: ${activeLab.steps[activeStepIndex].hint}` }
          ]);
        } else {
          setHistory(prev => [
            ...prev,
            { type: "system", text: `[MOCK SYSTEM] Binary '${primary}' called.` },
            { type: "system", text: `Tip: Load a designated Lab Scenario from the sidebar or tab options to run interactive simulations on hosts!` }
          ]);
        }
        break;

      default:
        setHistory(prev => [
          ...prev,
          { type: "error", text: `bash: ${primary}: command not found. Need help? Try 'help'` }
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommandSubmit(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyPointer < commandHistory.length - 1) {
        const nextPointer = historyPointer + 1;
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div className="w-full flex flex-col bg-black border border-zinc-850 rounded-none overflow-hidden shadow-2xl h-[500px]" id="kali-sandbox-terminal">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black border-b border-zinc-900 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 bg-zinc-800 border border-zinc-700 inline-block"></span>
            <span className="w-2.5 h-2.5 bg-zinc-800 border border-zinc-700 inline-block"></span>
            <span className="w-2.5 h-2.5 bg-zinc-800 border border-zinc-700 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-zinc-400 pl-2 flex items-center tracking-wider">
            <TerminalIcon size={13} className="mr-1 text-cyber-green" />
            root@kali-workstation:~
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500">
          <span className="text-cyber-green font-bold animate-pulse uppercase tracking-widest">● KALI WORKSPACE INTERNAL</span>
        </div>
      </div>

      {/* Terminal Displays */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 select-text text-zinc-300 bg-black" 
           onClick={() => inputRef.current?.focus()}>
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed break-all font-mono">
            {line.type === "input" ? (
              <span className="text-zinc-300 font-bold">{line.text}</span>
            ) : line.type === "success" ? (
              <span className="text-cyber-green font-black">{line.text}</span>
            ) : line.type === "error" ? (
              <span className="text-rose-500 font-bold">{line.text}</span>
            ) : (
              <span className="text-zinc-450">{line.text}</span>
            )}
          </div>
        ))}

        {isRunning && (
          <div className="flex items-center space-x-2 text-cyber-green animate-pulse font-mono">
            <RefreshCw size={12} className="animate-spin text-cyber-green" />
            <span className="text-[11px] tracking-wider uppercase font-bold">ANALYZING EXECUTION PARAMETERS...</span>
          </div>
        )}

        <div ref={consoleEndRef} />
      </div>

      {/* Lab objective panel inside the terminal input strip if available */}
      {activeLab && (
        <div className="px-4 py-2 bg-black border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-cyber-green shrink-0">
          <span className="truncate max-w-[80%] flex items-center font-bold">
            <ChevronRight size={13} className="mr-1 inline text-cyber-green" />
            <strong className="text-white uppercase tracking-wider">TASK:</strong> {activeLab.steps[activeStepIndex].instruction}
          </span>
          <button 
            type="button"
            onClick={() => {
              setHistory(prev => [
                ...prev,
                { type: "system", text: `[HINT COMMAND]: Try running -> ${activeLab.steps[activeStepIndex].hint}` }
              ]);
            }}
            className="text-[10px] text-cyber-green hover:bg-cyber-green/10 bg-black border border-cyber-green/40 px-2 py-0.5 rounded-none transition cursor-pointer font-black uppercase"
          >
            Show Hint
          </button>
        </div>
      )}

      {/* Input Form area */}
      <div className="p-3 bg-[#050505] border-t border-zinc-900 flex items-center shrink-0">
        <span className="font-mono text-xs text-cyber-green pr-2 shrink-0 font-bold">kali@workstation:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          placeholder="Type sandbox command... (e.g. ls, help, or active lab criteria)"
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-zinc-100 placeholder-zinc-700 focus:ring-0 p-0"
          autoFocus
          id="terminal-input-field"
        />
      </div>
    </div>
  );
}
