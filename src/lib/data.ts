// ─────────────────────────────────────────────
// Portfolio data for Harshil Aggarwal
// ─────────────────────────────────────────────

export const PERSONAL = {
  name: "Harshil Aggarwal",
  wordmark: "HA",
  title: "Cybersecurity Engineer · Full Stack Developer",
  email: "harshilaggarwal0207@gmail.com",
  phone: "+91-9319337698",
  github: "https://github.com/Harshilagg",
  linkedin: "https://www.linkedin.com/in/harshil-aggarwal-950540255/",
  twitter: "https://x.com",
  location: "India",
  status: "Available for opportunities",
  education: {
    degree: "B.Tech (Hons.) in Civil Engineering",
    institute: "IIT Kharagpur",
    year: "2026",
    cgpa: "8.12 / 10",
  },
  roles: [
    "Cybersecurity Engineer",
    "Full Stack Developer",
    "Competitive Programmer",
    "AI/ML Enthusiast",
  ],
  bio: "I build secure, scalable systems — from real-time platforms to AI-powered pipelines. IIT Kharagpur grad with a passion for competitive programming, cybersecurity, and crafting clean, considered interfaces.",
  manifesto: [
    "I BUILD",
    "SYSTEMS",
    "THAT FEEL",
    "ALIVE.",
  ],
} as const;

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "product" | "security" | "ai" | "game" | "fullstack";
  period: string;
  year: string;
  role: string;
  index: string;
  problem: string;
  features: string[];
  techStack: string[];
  challenges: string[];
  learnings: string[];
  github?: string;
  demo?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "ai-document-processor",
    title: "AI Document Processor",
    tagline: "Automated identity document extraction with hybrid AI pipeline",
    description:
      "Developed a full-stack, multi-tenant system to automate data extraction from identity documents using a hybrid AI pipeline.",
    category: "ai",
    period: "Mar'26",
    year: "2026",
    role: "Lead Developer",
    index: "01",
    problem:
      "Manual identity document processing is slow, error-prone, and doesn't scale. This system automates extraction from passports, IDs, and cards.",
    features: [
      "PyMuPDF for digital PDFs + PaddleOCR for scanned images",
      "LLaMA 3.3 integration for intelligent extraction",
      "Secure viewing with AWS S3 pre-signed URLs",
      "Regex-based PII scanning with highlight capabilities",
      "Async background processing with FastAPI",
      "Real-time sync via Firestore onSnapshot",
    ],
    techStack: [
      "FastAPI",
      "PyMuPDF",
      "PaddleOCR",
      "LLaMA 3.3",
      "AWS S3",
      "Firestore",
    ],
    challenges: [
      "Handling diverse document formats and quality levels",
      "Balancing OCR accuracy with processing speed",
      "Implementing secure document viewing with PII detection",
    ],
    learnings: [
      "Hybrid AI pipeline design (rule-based + LLM)",
      "Document processing and OCR optimization",
      "Secure file handling with pre-signed URLs",
    ],
  },
  {
    slug: "dewinter-optical-platform",
    title: "Dewinter Optical",
    tagline: "Real-time remote screen/camera sharing with hardware controls",
    description:
      "Full-stack real-time platform enabling remote screen/camera sharing, interactive controls, and hardware-level tuning.",
    category: "fullstack",
    period: "May'25 – Jul'25",
    year: "2025",
    role: "Software Development Intern",
    index: "02",
    problem:
      "Remote optical instrument sharing required real-time video, camera controls, and hardware integration that existing solutions couldn't provide.",
    features: [
      "Two-way audio/video chat with ReactJS, WebRTC & Socket.IO",
      "Firebase Auth with Signup/Login and lifecycle handling",
      "ngrok API tunnels for remote machine access",
      "Stream merging, microphone sync, Full Screen & PiP",
      "Dynamic camera controls via JavaScript–C++ bridge",
      "Real-time hardware tuning in web UI",
    ],
    techStack: [
      "React",
      "WebRTC",
      "PeerJS",
      "Socket.IO",
      "Firebase",
      "Node.js",
      "C++",
      "Render",
    ],
    challenges: [
      "Bridging JavaScript UI with C++ hardware controls",
      "Managing real-time video streams with low latency",
      "Implementing reliable peer-to-peer connections through NAT traversal",
    ],
    learnings: [
      "WebRTC internals and peer connection management",
      "JavaScript-C++ bridge architecture",
      "Real-time hardware control interfaces",
    ],
  },
  {
    slug: "talent-networking-platform",
    title: "AI-Ready Talent Platform",
    tagline: "Real-time talent networking with scalable casting workflows",
    description:
      "Developed a scalable mobile networking platform enabling models, agencies and brands to discover talent and manage casting workflows.",
    category: "product",
    period: "Oct'25 – Mar'26",
    year: "2025",
    role: "Full Stack Developer",
    index: "03",
    problem:
      "The talent industry lacked a unified platform for real-time casting workflows, leading to fragmented communication between models, agencies, and brands.",
    features: [
      "Real-time messaging with Flutter, Firestore & FirebaseAuth",
      "Scalable chat architecture with conversation indexing",
      "Casting marketplace with optimized NoSQL schema",
      "Portfolio & profile management with Cloudinary",
      "Searchable metadata across user profiles",
    ],
    techStack: [
      "Flutter",
      "Firebase",
      "Firestore",
      "Cloudinary",
      "NoSQL",
      "Dart",
    ],
    challenges: [
      "Designing a NoSQL schema that supports real-time casting workflows at scale",
      "Implementing efficient conversation indexing for instant message retrieval",
      "Building a marketplace with optimized query patterns for talent discovery",
    ],
    learnings: [
      "Deep understanding of Firestore subcollections and composite indexes",
      "Real-time data sync patterns with Firebase listeners",
      "Mobile-first architecture design principles",
    ],
  },
  {
    slug: "free-chat-android",
    title: "Free Chat",
    tagline: "End-to-end encrypted Android chat with RSA cryptography",
    description:
      "Developed a secure real-time chatting application leveraging RSA encryption to ensure robust data confidentiality and integrity.",
    category: "security",
    period: "May'24 – Jun'24",
    year: "2024",
    role: "Security Engineer",
    index: "04",
    problem:
      "Most messaging apps don't give users control over their encryption keys. This project aimed to build a transparent E2E encrypted chat using public-key cryptography.",
    features: [
      "RSA encryption with dynamic public key exchange",
      "End-to-end encrypted communication",
      "Firebase real-time database synchronization",
      "Android Keystore for secure key management",
      "Platform-level cryptographic operations",
    ],
    techStack: [
      "Android Studio",
      "Kotlin",
      "Firebase",
      "RSA Encryption",
      "Android Keystore",
    ],
    challenges: [
      "Managing key lifecycle and secure storage on Android devices",
      "Ensuring low-latency message delivery with encryption overhead",
      "Implementing reliable real-time database synchronization",
    ],
    learnings: [
      "Deep dive into public-key cryptography implementation",
      "Android Keystore system and secure key management",
      "Firebase Realtime Database optimization patterns",
    ],
  },
  {
    slug: "shopping-concierge",
    title: "Shopping Concierge",
    tagline: "AI-powered fashion recommendations with LLM agents",
    description:
      "Developed an AI-powered shopping concierge enabling personalized fashion recommendations using LLM agents and conversational search.",
    category: "ai",
    period: "Jan'26",
    year: "2026",
    role: "AI Engineer",
    index: "05",
    problem:
      "Online shopping lacks personalized, conversational assistance. This project bridges the gap with AI agents that understand style, context, and user preferences.",
    features: [
      "AI agent system with FastAPI, Groq Llama & MCP",
      "Tool-based reasoning and search capabilities",
      "Memory-enabled personalization pipelines",
      "Real-time AI response with session tracking",
      "React + Vite interface with product rendering",
    ],
    techStack: [
      "FastAPI",
      "Groq Llama",
      "MCP",
      "React",
      "Vite",
      "Python",
    ],
    challenges: [
      "Designing an agent system with reliable tool-based reasoning",
      "Implementing memory for personalization across sessions",
      "Real-time streaming of AI responses to the frontend",
    ],
    learnings: [
      "LLM agent architecture with Model Context Protocol",
      "Tool-augmented reasoning for complex queries",
      "Building responsive AI interfaces with streaming",
    ],
  },
  {
    slug: "chess-bot",
    title: "Chess Bot",
    tagline: "Full chess engine with Minimax AI and interactive GUI",
    description:
      "Built a full chess engine with AI opponent and interactive GUI, simulating complete gameplay with strategic depth.",
    category: "game",
    period: "Aug'25 – Oct'25",
    year: "2025",
    role: "Game Developer",
    index: "06",
    problem:
      "Creating a chess AI that provides meaningful challenge while maintaining smooth, interactive gameplay with proper rule enforcement.",
    features: [
      "8×8 board with detailed sprites and click-to-move",
      "Clear move highlights and smooth animations",
      "Depth-5 Minimax with alpha-beta pruning",
      "MVV-LVA heuristics and quiescence search",
      "Full rule support: castling, en passant, promotions, stalemate",
      "Undo/redo functionality and 75-move draw detection",
    ],
    techStack: [
      "Python",
      "Pygame",
      "Minimax",
      "Alpha-Beta Pruning",
      "TT Optimization",
    ],
    challenges: [
      "Implementing efficient move generation for all piece types",
      "Balancing search depth vs. response time",
      "Handling complex chess rules (castling, en passant, three-fold repetition)",
    ],
    learnings: [
      "Game tree search algorithms and optimization techniques",
      "GUI development with real-time state management",
      "Performance optimization for compute-intensive algorithms",
    ],
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  type: "fulltime" | "intern";
  description: string;
  achievements: string[];
  techStack: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Inspira Enterprise",
    role: "Cybersecurity Engineer — MSSP",
    period: "Jun'26 – Present",
    type: "fulltime",
    description:
      "Analyzing network and application security protocols across enterprise infrastructure.",
    achievements: [
      "Analyzed HTTP/HTTPS, TCP/IP, SMB, FTP, SSH, DNS, RDP and Redis protocols for security assessment",
      "Performed Linux & Windows Server security assessment using Nmap, Burp Suite, Wireshark, Hydra, JTR, Hashcat, WinPEAS and LinPEAS",
      "Developed skills in Active Directory, authentication, session management, privilege escalation, OWASP Top 10",
      "Practiced offensive security through HTB and THM labs",
    ],
    techStack: [
      "Nmap",
      "Burp Suite",
      "Wireshark",
      "Hydra",
      "Hashcat",
      "Active Directory",
      "OWASP",
      "Linux",
    ],
  },
  {
    company: "Dewinter Optical Inc.",
    role: "Software Development Intern",
    period: "May'25 – Jul'25",
    type: "intern",
    description:
      "Built full-stack real-time platform for remote screen/camera sharing with hardware-level control.",
    achievements: [
      "Built two-way audio/video chat with ReactJS, WebRTC, PeerJS and Socket.IO",
      "Applied Firebase Auth & Firestore for user auth and live data sync",
      "Used ngrok API tunnels for remote machine access with real-time responsiveness",
      "Added dynamic camera controls via JavaScript–C++ bridge for hardware tuning",
    ],
    techStack: [
      "React",
      "WebRTC",
      "Socket.IO",
      "Firebase",
      "Node.js",
      "C++",
    ],
  },
  {
    company: "Fischer Jordan",
    role: "Full Stack Developer Intern",
    period: "Dec'25",
    type: "intern",
    description:
      "Developed a scalable financial management platform for tracking income, expenses, budgets, and financial insights.",
    achievements: [
      "Implemented transaction management with Node.js, Express.js and PostgreSQL",
      "Built dashboard with React.js and Recharts for real-time budget tracking",
      "Integrated multi-currency transactions, CSV bank import & receipt uploads via AWS S3",
      "Created notification system using SendGrid for automated budget overrun alerts",
    ],
    techStack: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "AWS S3",
      "SendGrid",
      "Recharts",
    ],
  },
];

export type SkillCategory = {
  name: string;
  skills: string[];
};

export const SKILLS: SkillCategory[] = [
  {
    name: "Frontend",
    skills: ["React / Next.js", "TypeScript", "Flutter / Dart", "HTML5 / CSS3", "Tailwind CSS"],
  },
  {
    name: "Backend",
    skills: ["Node.js / Express", "FastAPI / Django", "GraphQL", "REST APIs", "Socket.IO / WebRTC"],
  },
  {
    name: "AI / ML",
    skills: ["Python", "LLM APIs / RAG", "Langchain / MCP", "OCR / NLP", "Pandas / NumPy"],
  },
  {
    name: "Cloud & DevOps",
    skills: ["AWS (EC2, Lambda, S3)", "Firebase / Firestore", "Docker", "Git / GitHub", "Vercel / Render"],
  },
  {
    name: "Cybersecurity",
    skills: ["Network Security", "Nmap / Wireshark", "Burp Suite", "OWASP Top 10", "Active Directory"],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL / MySQL", "MongoDB", "Redis", "Firestore", "DynamoDB"],
  },
];

export type CompetitiveProfile = {
  platform: string;
  handle: string;
  rating: number;
  rank: string;
  achievement: string;
  url?: string;
};

export const COMPETITIVE: CompetitiveProfile[] = [
  {
    platform: "Codeforces",
    handle: "basedlad",
    rating: 1587,
    rank: "Specialist",
    achievement: "Peak competitive rating of 1587",
    url: "https://codeforces.com/profile/basedlad",
  },
  {
    platform: "CodeChef",
    handle: "prestologic",
    rating: 1712,
    rank: "3-Star",
    achievement: "Maximum competitive rating of 1712",
    url: "https://www.codechef.com/users/prestologic",
  },
  {
    platform: "InterviewBit",
    handle: "harshil",
    rating: 0,
    rank: "Top 0.05%",
    achievement: "Top 0.05 percentile ranking",
  },
  {
    platform: "Meta Hacker Cup",
    handle: "harshil",
    rating: 0,
    rank: "Round 1",
    achievement: "Qualified for Round 1 among thousands globally",
  },
];

export const ACHIEVEMENTS = [
  "Earned Specialist rank on Codeforces with peak rating of 1587",
  "3-star coder on CodeChef with rating 1712",
  "Qualified for Meta Facebook Hacker Cup 2024 — Round 1",
  "Top 0.05% on InterviewBit",
  "AIR 6339 in JEE Advanced 2022 — Top 2.25%",
  "AIR 10574 in JEE Mains 2022 — Top 1.05% of 1.2M students",
  "KVPY Fellow — AIR 3531",
];

export const NAV_LINKS = [
  { label: "Work", href: "#work", index: "01" },
  { label: "About", href: "#about", index: "02" },
  { label: "Contact", href: "#contact", index: "03" },
] as const;

export const SECTION_COUNT = 7;
