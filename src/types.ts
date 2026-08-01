import { PillarClue } from './config';

export type AppMode = 'host' | 'player';

export type PlayerStage = 'landing' | 'playing' | 'result' | 'instagram';

export interface GridCellData {
  row: number;
  col: number;
  correctLetter: string;
  userLetter: string;
  isBlack: boolean;
  wordIds: string[]; // ['CREATE', 'IMPACT'] etc.
  numberLabel?: number;
  isDecoy?: boolean;
}

export interface GameResult {
  solvedCount: number;
  totalPillars: number;
  solvedWordIds: string[];
  timeElapsed: number;
  isVictorious: boolean;
  completedAt: string;
}

export interface StallStats {
  gamesPlayed: number;
  gamesWon: number;
  lastPlayedAt?: string;
}
