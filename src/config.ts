/**
 // ============================================================================
 // CRACK THE CODE — YI MIT-WPU CONFIGURATION & PLACEHOLDERS
 // ============================================================================
 //
 // Fill in or update these placeholders for your event deployment!
 */

export interface PillarClue {
  id: string;
  word: string;
  length: number;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  riddle: string; // Cryptic / riddle style clue
  meaningPunch: string; // One-line punch of meaning revealed on solve
  hintNote?: string;
}

export const APP_CONFIG = {
  // [INSTAGRAM_HANDLE] — Your Instagram username without @
  INSTAGRAM_HANDLE: "youngindians_mitwpu",

  // [INSTAGRAM_PROFILE_URL] — Direct link to your Instagram page
  INSTAGRAM_PROFILE_URL: "https://www.instagram.com/youngindians_mitwpu",

  // [CLUB_LOGO] — Path to image file or custom logo asset URL
  CLUB_LOGO_URL: "/assets/yi-mitwpu-logo.png",

  // [HOST_APP_BASE_URL] — Deployed base URL for QR codes
  // Automatically defaults to current window origin if deployed
  HOST_APP_BASE_URL: typeof window !== "undefined" ? window.location.origin : "https://crack-the-code-yi.vercel.app",

  // Fest & Organization Metadata
  EVENT_NAME: "Shubharambh 2026",
  SUBTITLE: "Welcome Event for First-Year Students",
  COLLEGE_NAME: "MIT-WPU Pune",
  ORGANIZATION_NAME: "Young Indians (Yi) Student Chapter",
  POWERED_BY: "Powered by CII (Confederation of Indian Industry)",

  // Game Settings
  GAME_TIMER_SECONDS: 30,

  // Editable Clues & Answers for the 3 Pillars
  PILLARS: [
    {
      id: "LEAD",
      word: "LEAD",
      length: 4,
      direction: "down",
      startRow: 2,
      startCol: 4,
      riddle: "I direct the path without pushing from behind; heavy as pencil core, bright in a visionary mind.",
      meaningPunch: "Leaders don't follow the crowd — they pave the way for others.",
      hintNote: "4 letters • Down",
    },
    {
      id: "CREATE",
      word: "CREATE",
      length: 6,
      direction: "across",
      startRow: 4,
      startCol: 1,
      riddle: "Spawn order from a blank canvas; forge tomorrow before others even imagine today.",
      meaningPunch: "Innovation is in our DNA — turning ideas into reality.",
      hintNote: "6 letters • Across",
    },
    {
      id: "IMPACT",
      word: "IMPACT",
      length: 6,
      direction: "down",
      startRow: 0,
      startCol: 1,
      riddle: "A sudden clash or lasting dent; the ripple left when purpose is spent.",
      meaningPunch: "That's our third pillar — leaving a mark that truly matters.",
      hintNote: "6 letters • Down",
    },
  ] as PillarClue[],

  // Decoy / False Clue setup to burn time tastefully
  DECOY_CLUE: {
    id: "DECOY",
    label: "Decoy Clue #4 (Distractor)",
    riddle: "What every freshman craves on Day 1? (4 letters)",
    hint: "Warning: This is a decoy! Stick strictly to the 3 Pillars shown on our stall wall!",
  },
};
