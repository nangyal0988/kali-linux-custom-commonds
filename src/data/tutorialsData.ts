import { Tutorial } from "../types";

export const TUTORIALS: Tutorial[] = [
  {
    id: "tutorial-terminal-basics",
    title: "Introduction to Kali Terminal & File Navigation",
    category: "System Basics",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    objectives: [
      "Understand the primary CLI directory layout of Kali Linux.",
      "Interact with standard bash utilities: pwd, ls, cat, and clear.",
      "Read local flag archives inside directories."
    ],
    steps: [
      {
        title: "The Heart of Kali: Bash CLI",
        content: "Cybersecurity professionals use the terminal far more than any desktop UI. The CLI allows tasks to be automated, chained, and executed over secure remote backends. In standard Kali, you begin inside your user directory (often `/home/kali`).",
        command: "pwd"
      },
      {
        title: "Listing Active Directory Files",
        content: "The command `ls` tells the system to output folders and text archives placed within your active trajectory. Let's see what targets and wordlists are cataloged here.",
        command: "ls -la"
      },
      {
        title: "Reading Documentation and Artifact Keys",
        content: "When analyzing machine configurations or capturing hidden flag strings during security audits, reading text archives with `cat` is vital. Let's try parsing instructions hidden in target documentation.",
        command: "cat instructions.txt"
      }
    ],
    commandPractice: "pwd"
  },
  {
    id: "tutorial-nmap-recon",
    title: "Network Host Reconnaissance with Nmap",
    category: "Information Gathering",
    difficulty: "Beginner",
    estimatedMinutes: 10,
    objectives: [
      "Explain the importance of active footprinting.",
      "Understand the distinction between fast scans and robust version scans.",
      "Detect vulnerable operating system versions dynamically."
    ],
    steps: [
      {
        title: "Scanning target blocks",
        content: "Network security analysis starts with reconnaissance. Before you can secure a host, you must find it. An active network ping sweep reveals host availability.",
        command: "nmap -sn 10.0.2.0/24"
      },
      {
        title: "Exposing Open Ports & Listening Daemon Versions",
        content: "Once high-value IP targets are identified, security teams probe specific listening services to check for outdated programs. Using the `-sV` command queries active applications to disclose exact version catalogs.",
        command: "nmap -sV 10.0.2.15"
      },
      {
        title: "Executing Safe Defenses with Default Scripting",
        content: "Nmap's Scripting Engine (NSE) allows customized network auditing. Combining the `-sC` flag runs benign checks to retrieve server variables, certificates, and potential system bugs.",
        command: "nmap -sC -sV 10.0.2.15"
      }
    ],
    commandPractice: "nmap -sV 10.0.2.15"
  },
  {
    id: "tutorial-gobuster-dir",
    title: "Web Path Discovery with Gobuster",
    category: "Web Applications",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    objectives: [
      "Expose administrative endpoints that aren't advertised in normal site indexes.",
      "Understand how dictionary words map to web content directories.",
      "Analyze HTTP return statuses (e.g., 200, 301, 403) to check accessibility."
    ],
    steps: [
      {
        title: "Dictionary Selection & Web Auditing",
        content: "Gobuster works by guessing paths using a loaded text file containing common directories (e.g. `admin`, `api`, `backups`). It fires multiple concurrent HTTP connections to measure responses.",
        command: "gobuster dir -u http://target-company.com -w common.txt"
      },
      {
        title: "Extracting Hidden Backups and Scripts",
        content: "A common mistake developers make is leaving zipped source code in directory roots. Appending the `-x` flag looks for files ending in secure extensions (like `.php`, `.zip`, `.bak`).",
        command: "gobuster dir -u http://target-company.com -w common.txt -x zip,bak,config"
      }
    ],
    commandPractice: "gobuster dir -u http://target-company.com -w common.txt"
  },
  {
    id: "tutorial-hydra-login",
    title: "SSH Credential Brute-Forcing with Hydra",
    category: "Password Attacks",
    difficulty: "Intermediate",
    estimatedMinutes: 12,
    objectives: [
      "Recognize the vulnerability posed by weak administrative accounts.",
      "Construct multi-threaded dictionary attacks using Hydra.",
      "Deploy custom thread counts to control system speed."
    ],
    steps: [
      {
        title: "Weak Passwords as an Entry Vector",
        content: "Many network routers and services are configured with default or trivial credentials. Hydra enables rapid validation metrics on whether accounts are locked against multi-guess loops.",
        command: "hydra -l admin -P wordlist.txt TargetSSH"
      }
    ],
    commandPractice: "hydra -l admin -P wordlist.txt TargetSSH"
  },
  {
    id: "tutorial-sqlmap-injection",
    title: "SQL Injection Audits with SQLmap",
    category: "Database Assessment",
    difficulty: "Advanced",
    estimatedMinutes: 15,
    objectives: [
      "Identify the warning symptoms of Dynamic SQL Injection.",
      "Utilize SQLmap to extract table structures on database layers.",
      "Mitigate databases against arbitrary schema dumps."
    ],
    steps: [
      {
        title: "Detecting SQL Intersections",
        content: "When forms or URL parameters are rendered insecurely into internal SQL query code, a malicious operator can craft inputs that trick the interpreter into revealing deep records. Let's identify the DBMS system catalog.",
        command: "sqlmap -u \"http://10.10.10.15/product.php?id=1\" --dbs"
      },
      {
        title: "Listing Schemas and Schema Columns",
        content: "Once targeted databases are identified, auditors verify what information assets are at risk (such as password databases or contact registries). Checking schemas confirms where sensitive parameters are located.",
        command: "sqlmap -u \"http://10.10.10.15/product.php?id=1\" -D target_db --tables"
      },
      {
        title: "Dumping Critical Encoded Passwords",
        content: "The final audit step is extracting and inspecting hashed records to evaluate their algorithm complexity. Running `--dump` gets tables into a structured security report.",
        command: "sqlmap -u \"http://10.10.10.15/product.php?id=1\" -D target_db -T users --dump"
      }
    ],
    commandPractice: "sqlmap -u \"http://10.10.10.15/product.php?id=1\" --dbs"
  }
];
