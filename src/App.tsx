import React, { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from './config';
import { AppMode, PlayerStage, StallStats } from './types';
import { HostScreen } from './components/HostScreen';
import { PlayerLanding } from './components/PlayerLanding';
import { PlayerGame } from './components/PlayerGame';
import { PlayerResult } from './components/PlayerResult';
import { InstagramScreen } from './components/InstagramScreen';
import { AdminLogin } from './components/AdminLogin';
import { supabase } from './utils/supabaseClient';

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

  // Track attempts used per device (Max 2)
  const [attemptsUsed, setAttemptsUsed] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const val = localStorage.getItem('yi_mitwpu_player_attempts_2026');
        return val ? parseInt(val, 10) : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

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

  // Save stall stats locally on change (as a backup)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stallStats));
      } catch {
        // Ignore
      }
    }
  }, [stallStats]);

  // Query Supabase for total counts on mount and subscribe to real-time additions
  useEffect(() => {
    if (!supabase) return;

    const fetchCounts = async () => {
      try {
        // Fetch total played count
        const { count: playedCount, error: playedError } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true });

        if (playedError) throw playedError;

        // Fetch won count
        const { count: wonCount, error: wonError } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'won');

        if (wonError) throw wonError;

        setStallStats({
          gamesPlayed: playedCount || 0,
          gamesWon: wonCount || 0
        });
      } catch (err) {
        console.error('Error fetching game counts from Supabase:', err);
      }
    };

    fetchCounts();

    // Subscribe to INSERT changes in public.games
    const subscription = supabase
      .channel('realtime-games-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'games'
        },
        (payload) => {
          const newGame = payload.new as { status: string };
          setStallStats((prev) => {
            const nextPlayed = prev.gamesPlayed + 1;
            const nextWon = newGame.status === 'won' ? prev.gamesWon + 1 : prev.gamesWon;
            return {
              gamesPlayed: nextPlayed,
              gamesWon: nextWon
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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

  // Reset local stall counter and remote Supabase database
  const handleResetStats = async () => {
    if (confirm('Are you sure you want to reset the stall game counter to 0 in both LocalStorage AND Supabase?')) {
      const resetData = { gamesPlayed: 0, gamesWon: 0 };
      setStallStats(resetData);
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(resetData));
        if (supabase) {
          // Delete all rows in games table to reset count
          const { error } = await supabase.from('games').delete().neq('status', '');
          if (error) console.error('Error resetting database in Supabase:', error);
        }
      } catch (err) {
        console.error('Network error resetting database in Supabase:', err);
      }
    }
  };

  // Player Flow Actions
  const handleStartGame = async () => {
    // If they bypass somehow, enforce attempt check
    if (attemptsUsed >= 2) {
      setPlayerStage('instagram');
      return;
    }

    // Increment player device attempts
    const newAttempts = attemptsUsed + 1;
    setAttemptsUsed(newAttempts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('yi_mitwpu_player_attempts_2026', String(newAttempts));
      } catch (err) {
        // Ignore
      }
    }

    // Increment games played locally
    setStallStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      lastPlayedAt: new Date().toISOString(),
    }));
    setPlayerStage('playing');

    // Async log play to Supabase
    if (supabase) {
      try {
        const { error } = await (supabase.from('games') as any).insert([{ status: 'played' }]);
        if (error) console.error('Error logging play to Supabase:', error);
      } catch (err) {
        console.error('Network error logging play to Supabase:', err);
      }
    }
  };

  const handleFinishGame = useCallback(async (solvedWordIds: string[], timeElapsed: number) => {
    setLastSolvedWordIds(solvedWordIds);
    setLastTimeElapsed(timeElapsed);

    const totalPillars = APP_CONFIG.PILLARS.length;
    const isWon = solvedWordIds.length === totalPillars;

    if (isWon) {
      setStallStats((prev) => ({
        ...prev,
        gamesWon: prev.gamesWon + 1,
      }));

      // Async log win to Supabase
      if (supabase) {
        try {
          const { error } = await (supabase.from('games') as any).insert([{ status: 'won' }]);
          if (error) console.error('Error logging win to Supabase:', error);
        } catch (err) {
          console.error('Network error logging win to Supabase:', err);
        }
      }
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
          attemptsUsed={attemptsUsed}
          onStartGame={handleStartGame}
          onGoToInstagram={() => setPlayerStage('instagram')}
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
          isWon={lastSolvedWordIds.length === APP_CONFIG.PILLARS.length}
          onRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
}
