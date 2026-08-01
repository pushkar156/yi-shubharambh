import React, { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from './config';
import { AppMode, PlayerStage, StallStats } from './types';
import { HostScreen } from './components/HostScreen';
import { PlayerLanding } from './components/PlayerLanding';
import { PlayerGame } from './components/PlayerGame';
import { PlayerResult } from './components/PlayerResult';
import { InstagramScreen } from './components/InstagramScreen';
import { AdminLogin } from './components/AdminLogin';

const STATS_KEY = 'yi_mitwpu_stall_stats_2026';

export default function App() {
  // Determine mode from URL params or default to player
  const [mode, setMode] = useState<AppMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'host') return 'host';
    }
    return 'player';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('yi_admin_authenticated') === 'true';
    }
    return false;
  });

  const [sessionCode, setSessionCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const session = params.get('session');
      if (session) return session;
    }
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  });

  const [playerStage, setPlayerStage] = useState<PlayerStage>('landing');
  const [lastSolvedWordIds, setLastSolvedWordIds] = useState<string[]>([]);
  const [lastTimeElapsed, setLastTimeElapsed] = useState<number>(0);

  // Persistent Stall Stats
  const [stallStats, setStallStats] = useState<StallStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STATS_KEY);
        if (raw) return JSON.parse(raw);
      } catch {
        // Fallback
      }
    }
    return { gamesPlayed: 0, gamesWon: 0 };
  });

  // Save stall stats on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stallStats));
      } catch {
        // Ignore
      }
    }
  }, [stallStats]);

  // Handle URL change or popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('mode');
      if (m === 'host') setMode('host');
      const s = params.get('session');
      if (s) setSessionCode(s);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Mode Switch Handlers
  const handleSwitchToHost = () => {
    setMode('host');
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?mode=host`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleSwitchToPlayer = () => {
    setMode('player');
    const freshSession = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(freshSession);
    setPlayerStage('landing');
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?session=${freshSession}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('yi_admin_authenticated', 'true');
    }
  };

  const handleCancelLogin = () => {
    handleSwitchToPlayer();
  };

  // Reset local stall counter
  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset the stall game counter to 0?')) {
      const resetData = { gamesPlayed: 0, gamesWon: 0 };
      setStallStats(resetData);
    }
  };

  // Player Flow Actions
  const handleStartGame = () => {
    // Increment games played
    setStallStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      lastPlayedAt: new Date().toISOString(),
    }));
    setPlayerStage('playing');
  };

  const handleFinishGame = useCallback((solvedWordIds: string[], timeElapsed: number) => {
    setLastSolvedWordIds(solvedWordIds);
    setLastTimeElapsed(timeElapsed);

    const totalPillars = APP_CONFIG.PILLARS.length;
    if (solvedWordIds.length === totalPillars) {
      setStallStats((prev) => ({
        ...prev,
        gamesWon: prev.gamesWon + 1,
      }));
    }

    setPlayerStage('result');
  }, []);

  const handleRestartGame = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(newCode);
    setPlayerStage('landing');
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?session=${newCode}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  // Render Host Screen vs Player Screen Stages
  if (mode === 'host') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleCancelLogin}
        />
      );
    }
    return (
      <HostScreen
        stats={stallStats}
        onResetStats={handleResetStats}
        onSwitchToPlayer={handleSwitchToPlayer}
      />
    );
  }

  // Player Mode Views
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans">
      {playerStage === 'landing' && (
        <PlayerLanding
          sessionCode={sessionCode}
          onStartGame={handleStartGame}
        />
      )}

      {playerStage === 'playing' && (
        <PlayerGame onFinishGame={handleFinishGame} />
      )}

      {playerStage === 'result' && (
        <PlayerResult
          solvedWordIds={lastSolvedWordIds}
          timeElapsed={lastTimeElapsed}
          onGoToInstagram={() => setPlayerStage('instagram')}
        />
      )}

      {playerStage === 'instagram' && (
        <InstagramScreen
          onRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
}
