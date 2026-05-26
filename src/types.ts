export interface CommandExample {
  id: string;
  command: string;
  description: string;
  purpose: string;
  flags: { flag: string; explanation: string }[];
}

export interface KaliTool {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string; // Used for selecting Lucide icons dynamically
  practicalApplication: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  commands: CommandExample[];
}

export interface ToolCategory {
  name: string;
  description: string;
  iconName: string;
}

export interface Tutorial {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  objectives: string[];
  steps: { title: string; content: string; command?: string }[];
  commandPractice?: string; // Terminal command to practice
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  toolReference?: string;
}

export interface LabScenario {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  objective: string;
  hints: string[];
  targetHost: string;
  steps: {
    instruction: string;
    expectedCommand: string | RegExp; // command or general regex
    hint: string;
    successOutput: string;
  }[];
}

export interface UserProgress {
  savedFavorites: string[]; // List of tool IDs
  completedTutorials: string[]; // List of tutorial IDs
  completedLabs: string[]; // List of lab IDs
  quizHighScores: Record<string, number>; // quiz category to high score
}
