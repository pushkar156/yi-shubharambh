import React from 'react';
import { APP_CONFIG } from '../config';
import { BrandLogo } from './BrandLogo';
import { Play, Flame, ShieldAlert, Timer, Sparkles, Lightbulb, Gift, Instagram } from 'lucide-react';

interface PlayerLandingProps {
  sessionCode?: string;
  attemptsUsed: number;
  onStartGame: () => void;
  onGoToInstagram: () => void;
}

export const PlayerLanding: React.FC<PlayerLandingProps> = ({
  sessionCode,
  attemptsUsed,
  onStartGame,
  onGoToInstagram,
}) => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#141414] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#FF6633] selection:text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3 border-b-4 border-[#141414]">
        <BrandLogo size="sm" lightMode={true} />
      </header>

      {/* Main Content Card */}
      <main className="my-auto py-6 flex flex-col items-center text-center space-y-6 max-w-md mx-auto w-full bg-white border-4 border-[#141414] p-6 shadow-[10px_10px_0px_0px_#141414]">
        {/* Stall Event Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6633] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
          <Flame className="w-4 h-4" />
          <span>Shubharambh 2026 Challenge</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
          CRACK THE CODE <br />
          <span className="bg-[#141414] text-[#FF6633] px-2 py-0.5 inline-block mt-1">
            30-SECOND CROSSWORD
          </span>
        </h1>

        {/* Stall Wall Clue Mandatory Banner */}
        <div className="bg-[#FF6633] text-white border-4 border-[#141414] p-4 text-left flex items-start gap-3 shadow-[4px_4px_0px_0px_#141414]">
          <div className="p-2 bg-[#141414] text-[#FF6633] border border-white font-black shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black bg-[#141414] text-white px-1.5 py-0.5 uppercase tracking-wider inline-block">
              SECRET STALL HINT
            </span>
            <p className="text-xs sm:text-sm font-black leading-snug">
              Our wall behind the laptop has a clue. Our 3 pillars are hiding in this grid. Find them in 30 seconds!
            </p>
          </div>
        </div>

        {/* Rule Pills */}
        <div className="grid grid-cols-3 gap-2.5 w-full text-center">
          <div className="p-3 bg-[#F3F4F6] border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] flex flex-col items-center">
            <Timer className="w-5 h-5 text-[#FF6633] mb-1" />
            <span className="text-xs font-black text-[#141414]">30 SECS</span>
            <span className="text-[9px] font-bold text-slate-600 uppercase">Tense Timer</span>
          </div>

          <div className="p-3 bg-[#F3F4F6] border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-xs font-black text-[#141414]">3 PILLARS</span>
            <span className="text-[9px] font-bold text-slate-600 uppercase">Crossword</span>
          </div>

          <div className="p-3 bg-[#F3F4F6] border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] flex flex-col items-center">
            <Gift className="w-5 h-5 text-[#138808] mb-1" />
            <span className="text-xs font-black text-[#141414]">STICKER!</span>
            <span className="text-[9px] font-bold text-slate-600 uppercase">WIN PRIZE!</span>
          </div>
        </div>

        {/* Start Game Action Button / Out of Attempts Warning */}
        <div className="w-full pt-2">
          {attemptsUsed >= 2 ? (
            <div className="space-y-4">
              <div className="bg-red-100 text-red-700 border-2 border-red-600 p-4 shadow-[3px_3px_0px_0px_#dc2626] font-black text-sm uppercase leading-tight text-center">
                🚫 Out of Attempts!
                <p className="text-xs font-bold mt-1 text-slate-700 normal-case">
                  You have already played 2 times on this device. Show your previous victory screen to the stall team to claim your sticker, or follow our Instagram!
                </p>
              </div>
              <button
                type="button"
                onClick={onGoToInstagram}
                className="w-full py-4 px-6 bg-[#FF6633] hover:bg-[#141414] active:translate-x-1 active:translate-y-1 text-white font-black text-lg border-4 border-[#141414] shadow-[6px_6px_0px_0px_#141414] uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
              >
                <Instagram className="w-6 h-6" />
                <span>GO TO INSTAGRAM</span>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onStartGame}
                className="w-full py-4 px-6 bg-[#FF6633] hover:bg-[#141414] active:translate-x-1 active:translate-y-1 text-white font-black text-lg sm:text-xl border-4 border-[#141414] shadow-[6px_6px_0px_0px_#141414] uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>START 30S TIMER NOW</span>
              </button>
              
              <div className="flex items-center justify-between mt-2.5 px-1 text-[10px] text-slate-600 font-bold uppercase">
                <span>Timer starts on tap!</span>
                <span className="text-[#FF6633] font-black">Attempt {attemptsUsed + 1}/2</span>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-3 border-t-4 border-[#141414] text-center text-xs font-black uppercase text-[#141414]">
        <span>{APP_CONFIG.ORGANIZATION_NAME} • MIT-WPU</span>
        {sessionCode && (
          <span className="block mt-0.5 font-mono text-slate-600">Session ID: #{sessionCode}</span>
        )}
      </footer>
    </div>
  );
};
