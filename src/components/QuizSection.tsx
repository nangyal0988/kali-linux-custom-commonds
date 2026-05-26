import React, { useState } from "react";
import { Trophy, Check, X, RefreshCw, HelpCircle, Star, Award, ArrowRight } from "lucide-react";
import { QuizQuestion, UserProgress } from "../types";
import { QUIZZES } from "../data/quizzesData";

interface QuizSectionProps {
  progress: UserProgress;
  onSaveHighScore: (categoryName: string, score: number) => void;
}

export default function QuizSection({ progress, onSaveHighScore }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion = QUIZZES[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIdx(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || isAnswered) return;

    const correct = selectedOptionIdx === activeQuestion.correctIndex;
    if (correct) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < QUIZZES.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      // Finished
      const finalScorePercentage = Math.round((score / QUIZZES.length) * 100);
      onSaveHighScore("general", finalScorePercentage);
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="kali-quizzes-auditor">
      {quizFinished ? (
        /* Results Screen */
        <div className="bg-[#0d0d0d] border border-zinc-850 rounded-none p-8 max-w-lg mx-auto text-center space-y-6" id="quiz-finished-results-display">
          <div className="inline-block p-4 bg-black text-cyber-green rounded-none border border-cyber-green/40 mx-auto animate-pulse">
            <Trophy size={48} />
          </div>

          <div className="space-y-2 font-mono">
            <h2 className="text-xl font-black text-white tracking-widest uppercase">Certification Exam Completed</h2>
            <p className="text-zinc-500 text-xs">
              You finished the Kali Linux command general knowledge self-assessment audit.
            </p>
          </div>

          <div className="p-5 bg-black border border-zinc-900 rounded-none max-w-sm mx-auto font-mono">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">SCORED RATIO RATINGS</div>
            <div className="text-4xl font-extrabold text-[#00FF41] mt-1 tracking-wider">
              {score}/{QUIZZES.length}
            </div>
            <div className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wide">
              {Math.round((score / QUIZZES.length) * 100)}% PASSING MARKS
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto font-mono">
            {score === QUIZZES.length 
              ? "Flawless deployment profile! You have mastered initial commands and tool environments."
              : "Keep studying! Try checking the 'Tools Glossary' or completing 'Syllabus Tutorials' to increase your score."}
          </p>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="w-full sm:w-auto px-6 py-2.5 bg-cyber-green hover:bg-cyber-green/90 text-black text-xs font-black rounded-none transition flex items-center justify-center gap-2 mx-auto cursor-pointer font-mono uppercase"
          >
            <RefreshCw size={14} />
            <span>RESTART CERTIFICATION EXAM</span>
          </button>
        </div>
      ) : (
        /* Question screen active */
        <div className="max-w-3xl mx-auto space-y-6 font-mono" id="active-quiz-player">
          {/* Main Info Card */}
          <div className="bg-[#0d0d0d] border border-zinc-850 p-5 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Self-Assessment Certification Prep</h2>
              <div className="text-xs text-zinc-550">Answer practical scenarios on port mappings, penetration tools, and terminal flags.</div>
            </div>
            <div className="shrink-0 p-2.5 bg-black rounded-none border border-zinc-805 text-xs font-mono text-cyber-green font-bold">
              QUESTION: {currentIdx + 1}/{QUIZZES.length}
            </div>
          </div>

          {/* Question panel */}
          <div className="bg-[#0d0d0d] border border-zinc-850 rounded-none overflow-hidden p-6 space-y-6 shadow-md">
            <h3 className="text-sm font-bold text-white leading-relaxed uppercase tracking-wider bg-black p-4 border border-zinc-900">
              {activeQuestion.question}
            </h3>

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-3">
              {activeQuestion.options.map((opt, i) => {
                const isSelected = selectedOptionIdx === i;
                let optionStyle = "border-zinc-900 hover:bg-black hover:border-cyber-green/40 bg-black/60 text-zinc-400";

                if (isAnswered) {
                  if (i === activeQuestion.correctIndex) {
                    optionStyle = "border-emerald-500/40 bg-black text-emerald-400";
                  } else if (isSelected) {
                    optionStyle = "border-rose-500/40 bg-black text-rose-500";
                  } else {
                    optionStyle = "border-zinc-950 bg-black/20 text-zinc-600 opacity-50";
                  }
                } else if (isSelected) {
                  optionStyle = "border-cyber-green bg-cyber-green/5 text-cyber-green font-bold";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(i)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-none border text-xs transition-all flex items-start space-x-3 cursor-pointer font-mono ${optionStyle}`}
                  >
                    <span className="h-5 w-5 rounded-none border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanations drawer if answered */}
            {isAnswered && (
              <div className={`p-4 rounded-none border text-xs leading-relaxed space-y-2 ${
                selectedOptionIdx === activeQuestion.correctIndex
                  ? "bg-black border-emerald-500/20 text-emerald-450"
                  : "bg-black border-rose-500/20 text-rose-450"
              }`}>
                <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider">
                  {selectedOptionIdx === activeQuestion.correctIndex ? (
                    <>
                      <Check size={14} className="text-[#00FF41]" />
                      <span>CORRECT VERIFICATION</span>
                    </>
                  ) : (
                    <>
                      <X size={14} className="text-rose-500" />
                      <span>INCORRECT VERIFICATION</span>
                    </>
                  )}
                </div>
                <p className="text-zinc-300 font-mono text-[11px] leading-normal">{activeQuestion.explanation}</p>
                {activeQuestion.toolReference && (
                  <div className="text-[10px] uppercase font-mono text-zinc-550 pt-1.5 border-t border-zinc-900 leading-none">
                    Syllabus context: tool '{activeQuestion.toolReference}'
                  </div>
                )}
              </div>
            )}

            {/* Call to action panel */}
            <div className="flex justify-end pt-2 border-t border-zinc-900">
              {!isAnswered ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOptionIdx === null}
                  className={`text-xs px-5 py-2 rounded-none font-mono transition font-bold cursor-pointer uppercase border ${
                    selectedOptionIdx === null
                      ? "bg-black text-zinc-700 border-zinc-900 cursor-not-allowed"
                      : "bg-[#0d0d0d] text-cyber-green border-cyber-green hover:bg-cyber-green/15"
                  }`}
                >
                  Verify Selection Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="text-xs px-5 py-2 bg-black border border-cyber-green/40 hover:border-cyber-green text-cyber-green rounded-none transition font-mono font-black flex items-center gap-2 cursor-pointer uppercase"
                >
                  <span>{currentIdx + 1 === QUIZZES.length ? "Finish Exam Analytics" : "Proceed Next Question"}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
