import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG, PillarClue } from '../config';
import { CrosswordGrid } from './CrosswordGrid';
import { sound } from '../utils/sound';
import { Timer, CheckCircle, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

interface PlayerGameProps {
  onFinishGame: (solvedWordIds: string[], timeElapsed: number) => void;
}

export const PlayerGame: React.FC<PlayerGameProps> = ({ onFinishGame }) => {
  const [timeLeft, setTimeLeft] = useState<number>(APP_CONFIG.GAME_TIMER_SECONDS);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [solvedWordIds, setSolvedWordIds] = useState<string[]>([]);
  const [activeWordId, setActiveWordId] = useState<string | null>('CREATE'); // default focus CREATE across
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 4, col: 1 });
  const [decoyWarning, setDecoyWarning] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Pillar definitions from config
  const pillars = APP_CONFIG.PILLARS;

  // Check if a word is completely correctly entered by user
  const checkWordSolved = useCallback(
    (wordObj: PillarClue, currentAnswers: Record<string, string>) => {
      for (let i = 0; i < wordObj.length; i++) {
        const r = wordObj.direction === 'across' ? wordObj.startRow : wordObj.startRow + i;
        const c = wordObj.direction === 'across' ? wordObj.startCol + i : wordObj.startCol;
        const entered = (currentAnswers[`${r}-${c}`] || '').toUpperCase();
        if (entered !== wordObj.word[i]) {
          return false;
        }
      }
      return true;
    },
    []
  );

  // Evaluate answers on every update
  const handleUpdateAnswer = useCallback(
    (r: number, c: number, letter: string) => {
      setUserAnswers((prev) => {
        const updated = { ...prev, [`${r}-${c}`]: letter.toUpperCase() };

        // Check each pillar
        const newlySolved: string[] = [];
        pillars.forEach((p) => {
          if (!solvedWordIds.includes(p.id)) {
            if (checkWordSolved(p, updated)) {
              newlySolved.push(p.id);
            }
          }
        });

        if (newlySolved.length > 0) {
          sound.playWordSolved();
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          setSolvedWordIds((s) => [...s, ...newlySolved]);
        }

        return updated;
      });

      // Auto-advance cursor to next cell in active word if typing a letter
      if (letter && activeWordId) {
        const currentPillar = pillars.find((p) => p.id === activeWordId);
        if (currentPillar) {
          const isAcross = currentPillar.direction === 'across';
          const nextR = isAcross ? r : r + 1;
          const nextC = isAcross ? c + 1 : c;

          // Verify next cell is within pillar boundaries
          const maxR = isAcross ? currentPillar.startRow : currentPillar.startRow + currentPillar.length - 1;
          const maxC = isAcross ? currentPillar.startCol + currentPillar.length - 1 : currentPillar.startCol;

          if (nextR <= maxR && nextC <= maxC) {
            setSelectedCell({ row: nextR, col: nextC });
          }
        }
      }
    },
    [activeWordId, checkWordSolved, pillars, solvedWordIds]
  );

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

  // Select a cell/word
  const handleSelectCell = (r: number, c: number, wordId?: string) => {
    setSelectedCell({ row: r, col: c });
    if (wordId) setActiveWordId(wordId);
  };

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

        {/* Decoy Warning Alert */}
        {decoyWarning && (
          <div className="max-w-md mx-auto mt-2 bg-amber-400 border-2 border-[#141414] p-2.5 shadow-[3px_3px_0px_0px_#141414] flex items-center gap-2 text-xs font-black text-black">
            <AlertTriangle className="w-4 h-4 text-black shrink-0 animate-bounce" />
            <span>{APP_CONFIG.DECOY_CLUE.hint}</span>
            <button
              onClick={() => setDecoyWarning(false)}
              className="ml-auto text-black font-black px-1"
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* Main Game Stage */}
      <main className="my-auto py-3 max-w-md mx-auto w-full space-y-4">
        {/* Crossword Grid Component */}
        <CrosswordGrid
          userAnswers={userAnswers}
          solvedWordIds={solvedWordIds}
          activeWordId={activeWordId}
          selectedCell={selectedCell}
          onSelectCell={handleSelectCell}
          onUpdateAnswer={handleUpdateAnswer}
          onDecoyTrigger={() => setDecoyWarning(true)}
        />

        {/* Cryptic Clues Selector Drawer */}
        <div className="bg-white border-4 border-[#141414] p-4 space-y-3 shadow-[8px_8px_0px_0px_#141414]">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#141414]">
            <span className="text-xs font-black uppercase text-[#141414] tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#FF6633]" />
              Cryptic Pillar Riddles
            </span>
            <span className="text-[10px] font-black bg-[#FF6633] text-white px-1.5 py-0.5 border border-[#141414]">
              TAP CLUE
            </span>
          </div>

          <div className="space-y-2">
            {pillars.map((pillar) => {
              const isSolved = solvedWordIds.includes(pillar.id);
              const isActive = activeWordId === pillar.id;

              return (
                <button
                  key={`clue-${pillar.id}`}
                  type="button"
                  onClick={() => {
                    setActiveWordId(pillar.id);
                    setSelectedCell({ row: pillar.startRow, col: pillar.startCol });
                  }}
                  className={`w-full text-left p-3 border-2 border-[#141414] transition-all text-xs flex flex-col space-y-1 ${
                    isSolved
                      ? 'bg-[#138808] text-white shadow-[2px_2px_0px_0px_#141414]'
                      : isActive
                      ? 'bg-[#FF6633] text-white shadow-[3px_3px_0px_0px_#141414]'
                      : 'bg-white text-[#141414] shadow-[2px_2px_0px_0px_#141414] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <div className="flex items-center justify-between font-black uppercase">
                    <span className="flex items-center gap-1.5">
                      <span>{pillar.id} ({pillar.hintNote})</span>
                    </span>
                    {isSolved ? (
                      <span className="text-[10px] bg-white text-[#138808] px-1.5 py-0.5 border border-[#141414] font-black">
                        SOLVED ✓
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
                </button>
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
