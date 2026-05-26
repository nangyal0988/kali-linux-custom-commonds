import { LabScenario } from "../types";

export const LAB_SCENARIOS: LabScenario[] = [
  {
    id: "lab-nmap-recon",
    title: "Lab 1: Host Enumeration & Version Scanning",
    difficulty: "Beginner",
    description: "You have been assigned to audit target server `10.0.2.15` on the company intranet. Before conducting active testing, you must perform a standard reconnaissance sweep using `nmap` to discover active listener endpoints and their specific version indicators.",
    objective: "Execute a service version detection scan (`-sV`) against the target host `10.0.2.15` to identify listen properties.",
    hints: [
      "The tool to use is 'nmap'.",
      "To detect service versions, append the flag '-sV'.",
      "The exact command should match: 'nmap -sV 10.0.2.15'."
    ],
    targetHost: "10.0.2.15",
    steps: [
      {
        instruction: "Launch Nmap with the service version detection parameter targeting the machine IP 10.0.2.15.",
        expectedCommand: "nmap -sV 10.0.2.15",
        hint: "Try typing: nmap -sV 10.0.2.15",
        successOutput: `
Starting Nmap 7.93 ( https://nmap.org ) at 2026-05-26 11:51 UTC
Nmap scan report for 10.0.2.15
Host is up (0.0012s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))

Service detection performed. Please report findings back.
[LAB COMPLETED!] Excellent! You identified a web server on Port 80 and SSH on Port 22.
`
      }
    ]
  },
  {
    id: "lab-gobuster-dir",
    title: "Lab 2: Hidden Directory Auditing",
    difficulty: "Intermediate",
    description: "An internal corporate portal is running on `http://target-web.local`. System admins forgot to lock down indexing. You need to use `gobuster` to find hidden endpoints, specifically looking for any administrative paths using a common dictionary file named `common.txt`.",
    objective: "Direct gobuster to audit directory paths of 'http://target-web.local' loading 'common.txt' as the reference dictionary.",
    hints: [
      "The command syntax starts with 'gobuster dir'.",
      "Use '-u' to supply the URL: 'http://target-web.local'.",
      "Use '-w' to supply the dictionary file name: 'common.txt'.",
      "All together: 'gobuster dir -u http://target-web.local -w common.txt'."
    ],
    targetHost: "http://target-web.local",
    steps: [
      {
        instruction: "Trigger a Gobuster path scan on the server URL http://target-web.local using wordlist common.txt.",
        expectedCommand: "gobuster dir -u http://target-web.local -w common.txt",
        hint: "Try typing: gobuster dir -u http://target-web.local -w common.txt",
        successOutput: `
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial)
===============================================================
[+] Url:                     http://target-web.local
[+] Method:                  GET
[+] Wordlist:                common.txt
[+] Threads:                 10
===============================================================
2026/05/26 11:52:11 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 310] --> http://target-web.local/images/
/css                  (Status: 301) [Size: 307] --> http://target-web.local/css/
/js                   (Status: 301) [Size: 306] --> http://target-web.local/js/
/admin_panel          (Status: 200) [Size: 4124]  <-- [SUCCESS! Hidden Console Found!]
/backups              (Status: 403) [Size: 276]

===============================================================
2026/05/26 11:52:15 Finished
===============================================================
[LAB COMPLETED!] Fantastic search! The admin panel console resides at '/admin_panel'.
`
      }
    ]
  },
  {
    id: "lab-hydra-crack",
    title: "Lab 3: SSH Port Password Guessing",
    difficulty: "Intermediate",
    description: "In Lab 1, you identified an active SSH service running on target host `10.0.2.15`. To test the strength of the system account 'root', use the Hydra brute-force suite to guess the correct credentials by pairing the account with a mock password list file `wordlist.txt`.",
    objective: "Execute a hydra password dictionary attack under user login 'root' against 'ssh://10.0.2.15' using wordlist file 'wordlist.txt'.",
    hints: [
      "Target is 'ssh://10.0.2.15'.",
      "Use administrative username 'root' via flag '-l root'.",
      "Provide the password dictionary file via flag '-P wordlist.txt'.",
      "Structure: 'hydra -l root -P wordlist.txt ssh://10.0.2.15'."
    ],
    targetHost: "10.0.2.15",
    steps: [
      {
        instruction: "Initiate Hydra testing on SSH with login user root and password file wordlist.txt.",
        expectedCommand: "hydra -l root -P wordlist.txt ssh://10.0.2.15",
        hint: "Try typing: hydra -l root -P wordlist.txt ssh://10.0.2.15",
        successOutput: `
Hydra v9.4 (c) 2026 by van Hauser/THC - Please use only for legal purposes.
Hydra starting on ssh://10.0.2.15:22/
[DATA] attacking ssh service on port 22/tcp
[DATA] 1 target, 1 login, 12 password combinations, 4 threads
[SSH] Attempting connection...
[ATTACK] Trying: login "root" - pass "password123" - failed
[ATTACK] Trying: login "root" - pass "admin12" - failed
[ATTACK] Trying: login "root" - pass "qwerty" - failed
[ATTACK] Trying: login "root" - pass "kali123" - failed
[ATTACK] Trying: login "root" - pass "shadowcrack" - failed
[MATCH] host: 10.0.2.15  login: root  password: shadowcrack  [SSH]
[DATA] 1 of 1 target completed, 1 valid password found.

[LAB COMPLETED!] Brilliant! Target account has been audited. Active password is 'shadowcrack'.
`
      }
    ]
  },
  {
    id: "lab-john-hash",
    title: "Lab 4: Decrypting Leaked Shadow Hashes",
    difficulty: "Advanced",
    description: "A database export contains a cryptographic hash matching an administrator account inside a file named `hash.txt`. Decrypt this SHA-based password utilizing John the Ripper (`john`) against password library `wordlist.txt`.",
    objective: "Launch john with the wordlist parameter 'wordlist.txt' targeting raw hash file 'hash.txt'.",
    hints: [
      "Use the tool designation 'john'.",
      "Supply the custom candidate file via '--wordlist=wordlist.txt'.",
      "Complete code construction: 'john --wordlist=wordlist.txt hash.txt'."
    ],
    targetHost: "hash.txt",
    steps: [
      {
        instruction: "Run John the Ripper offline algorithm match using target wordlist.txt and file path hash.txt.",
        expectedCommand: "john --wordlist=wordlist.txt hash.txt",
        hint: "Try typing: john --wordlist=wordlist.txt hash.txt",
        successOutput: `
Created directory: /home/kali/.john
Using default input encoding: UTF-8
Loaded 1 password hash (bcrypt [SHA256 128/128 ASIMD])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
[HASH CRACK ACTIVE]
Attempting candidate: 'password' - miss
Attempting candidate: 'admin' - miss
Attempting candidate: 'oracle' - miss
Attempting candidate: 'fortress' - SUCCESS!
fortress         (admin_hash)
1 password hash cracked, 0 left.

[LAB COMPLETED!] Success! You solved the cipher query. The key is 'fortress'.
`
      }
    ]
  }
];
