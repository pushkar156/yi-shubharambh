import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { APP_CONFIG } from '../config';
import { Trophy, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface PlayerResultProps {
  solvedWordIds: string[];
  timeElapsed: number;
  onGoToInstagram: () => void;
}

export const PlayerResult: React.FC<PlayerResultProps> = ({
  solvedWordIds,
  timeElapsed,
  onGoToInstagram,
}) => {
  const pillars = APP_CONFIG.PILLARS;
  const isVictorious = solvedWordIds.length === pillars.length;

  // Trigger Confetti on Victory
  useEffect(() => {
    if (isVictorious) {
      const colors = ['#FF6633', '#FFFFFF', '#138808', '#FFD700'];
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isVictorious]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#141414] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#FF6633] selection:text-white">
      <main className="my-auto py-6 flex flex-col items-center text-center space-y-6 max-w-md mx-auto w-full bg-white border-4 border-[#141414] p-6 shadow-[10px_10px_0px_0px_#141414]">
        {/* Banner Badge */}
        {isVictorious ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#138808] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] animate-bounce">
            <Trophy className="w-4 h-4 text-white" />
            <span>1 IN 100 LEGEND! CRACKED IT!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF6633] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414]">
            <Clock className="w-4 h-4 text-white" />
            <span>TIME'S UP — NICE TRY!</span>
          </div>
        )}

        {/* Hero Result Title */}
        {isVictorious ? (
          <div className="space-y-3 w-full">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-tight">
              UNBELIEVABLE SPEED!
            </h1>
            <p className="text-[#141414] font-bold text-sm sm:text-base">
              You solved all 3 pillars in <span className="bg-[#138808] text-white px-2 py-0.5 font-black border border-[#141414]">{timeElapsed} seconds</span>!
            </p>
            <div className="bg-[#FF6633] text-white border-2 border-[#141414] p-2.5 font-black text-xs uppercase tracking-tight shadow-[3px_3px_0px_0px_#141414] text-center">
              🎉 Show this screen to the host to claim your Yi Sticker! 🎁
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-tight">
              FOUND <span className="bg-[#FF6633] text-white px-2 py-0.5 border border-[#141414]">{solvedWordIds.length}/3</span> PILLARS!
            </h1>
            <p className="text-slate-700 font-black text-xs uppercase italic">
              "Even LEAD-ers need practice 😉"
            </p>
          </div>
        )}

        {/* Pillar Meaning Cards (Educational Reveal) */}
        <div className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[#141414] uppercase tracking-wider">
              The 3 Pillars of Yi MIT-WPU:
            </span>
            <span className="text-xs font-black bg-[#FF6633] text-white px-1.5 py-0.5 border border-[#141414]">
              {solvedWordIds.length}/3 Unlocked
            </span>
          </div>

          {pillars.map((pillar) => {
            const isFound = solvedWordIds.includes(pillar.id);

            return (
              <div
                key={`result-pillar-${pillar.id}`}
                className={`p-4 border-2 border-[#141414] transition-all ${
                  isFound
                    ? 'bg-[#138808] text-white shadow-[4px_4px_0px_0px_#141414]'
                    : 'bg-white text-[#141414] shadow-[2px_2px_0px_0px_#141414]'
                }`}
              >
                <div className="flex items-center justify-between font-black text-sm mb-1 uppercase">
                  <span className="flex items-center gap-2">
                    <span>{pillar.word}</span>
                  </span>
                  {isFound ? (
                    <span className="text-[10px] bg-white text-[#138808] px-2 py-0.5 border border-[#141414] font-black">
                      SOLVED ✓
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#141414] text-white px-2 py-0.5 font-black">
                      REVEALED
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold leading-relaxed">
                  {pillar.meaningPunch}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button to proceed to Instagram */}
        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onGoToInstagram}
            className="w-full py-4 px-6 bg-[#FF6633] hover:bg-[#141414] active:translate-x-1 active:translate-y-1 text-white font-black text-lg border-4 border-[#141414] shadow-[6px_6px_0px_0px_#141414] uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
          >
            <span>CLAIM GIFT → INSTAGRAM</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-3 border-t-4 border-[#141414] text-center text-xs font-black uppercase text-[#141414]">
        <span>{APP_CONFIG.ORGANIZATION_NAME} • Shubharambh 2026</span>
      </footer>
    </div>
  );
};
