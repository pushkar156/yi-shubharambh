import React from 'react';
import { APP_CONFIG } from '../config';
import { BrandLogo } from './BrandLogo';
import { Play, Flame, ShieldAlert, Timer, Sparkles, Lightbulb } from 'lucide-react';

interface PlayerLandingProps {
  sessionCode?: string;
  onStartGame: () => void;
}

export const PlayerLanding: React.FC<PlayerLandingProps> = ({
  sessionCode,
  onStartGame,
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
              Psst — our wall behind the laptop has a clue. Our 3 pillars are hiding in this grid. Find them in 30 seconds!
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
            <ShieldAlert className="w-5 h-5 text-[#138808] mb-1" />
            <span className="text-xs font-black text-[#141414]">1 SHOT</span>
            <span className="text-[9px] font-bold text-slate-600 uppercase">Are you 1/100?</span>
          </div>
        </div>

        {/* Start Game Action Button */}
        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onStartGame}
            className="w-full py-4 px-6 bg-[#FF6633] hover:bg-[#141414] active:translate-x-1 active:translate-y-1 text-white font-black text-lg sm:text-xl border-4 border-[#141414] shadow-[6px_6px_0px_0px_#141414] uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>START 30S TIMER NOW</span>
          </button>
          
          <p className="text-[11px] text-[#141414] mt-2 font-black uppercase tracking-tight">
            Timer starts immediately when you tap Start!
          </p>
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
