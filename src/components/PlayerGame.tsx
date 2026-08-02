import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG } from '../config';
import { WordSearchGrid } from './WordSearchGrid';
import { sound } from '../utils/sound';
import { Timer, CheckCircle, Lightbulb } from 'lucide-react';

interface PlayerGameProps {
  onFinishGame: (solvedWordIds: string[], timeElapsed: number) => void;
}

export const PlayerGame: React.FC<PlayerGameProps> = ({ onFinishGame }) => {
  const [timeLeft, setTimeLeft] = useState<number>(APP_CONFIG.GAME_TIMER_SECONDS);
  const [solvedWordIds, setSolvedWordIds] = useState<string[]>([]);

  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Pillar definitions from config
  const pillars = APP_CONFIG.PILLARS;

  // Handle word solved
  const handleWordSolved = useCallback((wordId: string) => {
    sound.playWordSolved();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setSolvedWordIds((prev) => {
      if (prev.includes(wordId)) return prev;
      return [...prev, wordId];
    });
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    startTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current as NodeJS.Timeout);
          sound.playTimeUp();
          const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
          onFinishGame(solvedWordIds, elapsed);
          return 0;
        }

        const isLow = prev <= 10;
        sound.playTick(isLow);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [onFinishGame, solvedWordIds]);

  // Check victory condition
  useEffect(() => {
    if (solvedWordIds.length === pillars.length) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      sound.playVictoryFanfare();
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setTimeout(() => {
        onFinishGame(solvedWordIds, elapsed);
      }, 600);
    }
  }, [solvedWordIds, pillars.length, onFinishGame]);

  // Timer Color Classes
  const getTimerClasses = () => {
    if (timeLeft > 15) {
      return 'bg-[#138808] border-2 border-[#141414] text-white shadow-[3px_3px_0px_0px_#141414]';
    } else if (timeLeft > 5) {
      return 'bg-[#FF6633] border-2 border-[#141414] text-white animate-pulse shadow-[3px_3px_0px_0px_#141414]';
    } else {
      return 'bg-red-600 border-4 border-[#141414] text-white scale-105 shadow-[4px_4px_0px_0px_#141414]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#141414] flex flex-col justify-between p-3 sm:p-5 font-sans selection:bg-[#FF6633]">
      {/* Top Sticky Header with Tense Timer & Progress Tracker */}
      <header className="sticky top-0 z-30 bg-[#F3F4F6] pb-3 pt-1 border-b-4 border-[#141414]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Tense Countdown Badge */}
          <div className={`px-3.5 py-1.5 font-black text-lg sm:text-xl flex items-center gap-2 transition-all ${getTimerClasses()}`}>
            <Timer className="w-5 h-5" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>

          {/* Pillars Solved Progress */}
          <div className="px-3 py-1.5 bg-white border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${solvedWordIds.length > 0 ? 'text-[#138808]' : 'text-slate-400'}`} />
            <span className="text-xs font-black text-[#141414] uppercase">
              <span className="text-[#FF6633] font-black text-sm">{solvedWordIds.length}</span>/3 Pillars
            </span>
          </div>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="my-auto py-3 max-w-md mx-auto w-full space-y-4">
        {/* Word Search Grid Component */}
        <WordSearchGrid
          solvedWordIds={solvedWordIds}
          onWordSolved={handleWordSolved}
          disabled={timeLeft <= 0}
        />

        {/* Cryptic Clues Selector Drawer */}
        <div className="bg-white border-4 border-[#141414] p-4 space-y-3 shadow-[8px_8px_0px_0px_#141414]">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#141414]">
            <span className="text-xs font-black uppercase text-[#141414] tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#FF6633]" />
              Pillars to Find:
            </span>
          </div>

          <div className="space-y-2">
            {pillars.map((pillar) => {
              const isSolved = solvedWordIds.includes(pillar.id);

              return (
                <div
                  key={`clue-${pillar.id}`}
                  className={`w-full text-left p-3 border-2 border-[#141414] text-xs flex flex-col space-y-1 ${
                    isSolved
                      ? 'bg-[#138808] text-white shadow-[2px_2px_0px_0px_#141414]'
                      : 'bg-white text-[#141414] shadow-[2px_2px_0px_0px_#141414]'
                  }`}
                >
                  <div className="flex items-center justify-between font-black uppercase">
                    <span className="flex items-center gap-1.5 font-black">
                      <span>{pillar.id}</span>
                    </span>
                    {isSolved ? (
                      <span className="text-[10px] bg-white text-[#138808] px-1.5 py-0.5 border border-[#141414] font-black">
                        FOUND ✓
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[#141414] text-white px-1.5 py-0.5 font-black">
                        {pillar.length} LETTERS
                      </span>
                    )}
                  </div>

                  {/* Riddle Text */}
                  <p className="leading-snug font-bold text-[11px] italic">
                    "{pillar.riddle}"
                  </p>

                  {/* Meaning Punch on Solve */}
                  {isSolved && (
                    <p className="text-white font-black text-[11px] pt-1 border-t border-white/40 uppercase">
                      💡 {pillar.meaningPunch}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Wall Hint Footer Reminder */}
      <footer className="text-center text-xs font-black uppercase text-[#141414] pb-1">
        <span>💡 Hint: Wall behind laptop shows the 3 words!</span>
      </footer>
    </div>
  );
};
