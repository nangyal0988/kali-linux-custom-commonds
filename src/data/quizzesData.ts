import { QuizQuestion } from "../types";

export const QUIZZES: QuizQuestion[] = [
  {
    id: "quiz-1",
    question: "Which of the following ports does a default Nmap scan cover if you do not specify individual range parameters?",
    options: [
      "All 65,535 possible ports.",
      "The top 1,000 most common ports.",
      "Only ports 80 (HTTP) and 443 (HTTPS).",
      "Only ports 1 through 1024 (well-known ports)."
    ],
    correctIndex: 1,
    explanation: "By default, Nmap scans the top 1,000 most common ports. To scan all available ports, you must explicitly use the `-p-` flag.",
    toolReference: "nmap"
  },
  {
    id: "quiz-2",
    question: "You want to find hidden web paths or file listings like 'backups.zip' or 'db_config.php'. Which Gobuster command is the most correct?",
    options: [
      "gobuster dns -d target.com -w common.txt",
      "gobuster dir -u http://target.com -w common.txt -x zip,php",
      "gobuster crack -p hash.txt -w wordlist.txt",
      "gobuster proxy -u http://target.com -p 127.0.0.1:8080"
    ],
    correctIndex: 1,
    explanation: "Using the `dir` module, specifying the target URL with `-u`, the wordlist with `-w`, and appending file extension variants via `-x zip,php` effectively brute-forces hidden directories and file endings.",
    toolReference: "gobuster"
  },
  {
    id: "quiz-3",
    question: "In Kali Linux, you spawn a Netcat listener using the command 'nc -lvnp 4444'. What does the '-n' flag signify?",
    options: [
      "New process: Tells Netcat to fork a background connection.",
      "No resolving: Prevents DNS name resolution to speed up connections and avoid leaks.",
      "Null payload: Standard handshake test without sending data.",
      "Numbered packets: Counts packet transmission sizes."
    ],
    correctIndex: 1,
    explanation: "The `-n` flag directs Netcat to skip DNS resolution. This ensures the output lists raw IPs, which accelerates the listener startup and prevents DNS queries that might alert intrusion system monitoring.",
    toolReference: "netcat"
  },
  {
    id: "quiz-4",
    question: "If SQLmap discovers that a parameter is injection-vulnerable, what flag do you append to display a list of database schemas?",
    options: [
      "--schema-all",
      "--dbs",
      "-x extract-db",
      "--get-databases --list"
    ],
    correctIndex: 1,
    explanation: "Adding the `--dbs` flag tells SQLmap to query the database management system (DBMS) for all available schema catalogs once injection points are successfully established.",
    toolReference: "sqlmap"
  },
  {
    id: "quiz-5",
    question: "Which of the following Kali Linux tools is standard for cracking captured WiFi WPA2 handshakes offline?",
    options: [
      "msfconsole",
      "aircrack-ng",
      "wireshark",
      "nikto"
    ],
    correctIndex: 1,
    explanation: "Aircrack-ng is the primary utility suite in Kali used to crack captured WPA/WPA2 security handshakes off-line by matching mathematical validation hashes against password list lines.",
    toolReference: "aircrack-ng"
  },
  {
    id: "quiz-6",
    question: "What is the primary difference between Hydra and John the Ripper?",
    options: [
      "Hydra scans network ports, whereas John the Ripper exploits them.",
      "Hydra conducts online brute-force against listening network services, while John the Ripper cracks cryptographic hashes offline.",
      "Hydra works exclusively on Windows targets, while John the Ripper works on Linux systems.",
      "Hydra cracks wireless handshakes, whereas John the Ripper brute-forces web cookies."
    ],
    correctIndex: 1,
    explanation: "Hydra is an online attack tool that guesses credentials against active live protocols (like SSH, FTP, HTTP forms). John the Ripper is an offline tool that decrypts raw cryptographic password string hashes locally on CPU/GPU hardware.",
    toolReference: "hydra"
  }
];
