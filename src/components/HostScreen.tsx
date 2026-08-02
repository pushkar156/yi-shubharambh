import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_CONFIG } from '../config';
import { BrandLogo } from './BrandLogo';
import { StallStats } from '../types';
import { Sparkles, Trophy, Users, Instagram, Maximize2, RefreshCw, Flame, Lightbulb } from 'lucide-react';

interface HostScreenProps {
  stats: StallStats;
  onResetStats: () => void;
  onSwitchToPlayer: () => void;
}

export const HostScreen: React.FC<HostScreenProps> = ({
  stats,
  onResetStats,
  onSwitchToPlayer,
}) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Generate unique session on mount or refresh
  const generateNewSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCurrentSessionId(code);
  };

  useEffect(() => {
    generateNewSession();
  }, []);

  // Compute full player game URL
  const playerGameUrl = `${APP_CONFIG.HOST_APP_BASE_URL}/?session=${currentSessionId}`;

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#141414] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#FF6633] selection:text-white">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between border-b-4 border-[#141414] pb-4">
        <BrandLogo size="lg" lightMode={true} />

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToPlayer}
            className="px-4 py-2 text-xs font-black bg-[#141414] hover:bg-black text-white uppercase tracking-wider border-2 border-[#141414] shadow-[3px_3px_0px_0px_#FF6633] active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            📱 Test Player View
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white hover:bg-[#F3F4F6] text-[#141414] border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition"
            title="Toggle Fullscreen for Stall Display"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Stall Wall Clue Banner - Brutalist High Visual Impact */}
      <div className="my-4 bg-[#FF6633] text-white border-4 border-[#141414] p-4 shadow-[6px_6px_0px_0px_#141414] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#141414] text-[#FF6633] border-2 border-white font-black shadow-[2px_2px_0px_0px_#ffffff]">
            <Lightbulb className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="bg-[#141414] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest inline-block mb-1 border border-white">
              STALL HINT FOR PLAYERS
            </span>
            <p className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Look at our wall behind this laptop! Our 3 pillars are: <span className="bg-white text-[#141414] px-1.5 py-0.5 mx-0.5 font-black border border-[#141414]">LEAD</span> • <span className="bg-white text-[#141414] px-1.5 py-0.5 mx-0.5 font-black border border-[#141414]">CREATE</span> • <span className="bg-white text-[#141414] px-1.5 py-0.5 mx-0.5 font-black border border-[#141414]">IMPACT</span>
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className="px-3 py-1.5 bg-[#138808] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
            30 SECONDS
          </span>
        </div>
      </div>

      {/* Main Stall Display Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-4 items-stretch">
        {/* Left Column: Attract Title & Main Player QR Code */}
        <div className="lg:col-span-7 bg-white border-4 border-[#141414] p-6 sm:p-8 shadow-[12px_12px_0px_0px_#141414] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6633] text-white text-xs font-black uppercase tracking-widest border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
              <Flame className="w-4 h-4" />
              <span>SHUBHARAMBH 2026 STALL GAME</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase leading-none">
              CRACK THE CODE <br />
              <span className="text-[#FF6633] bg-[#141414] px-2 py-0.5 inline-block mt-1">
                IN 30 SECONDS
              </span>
            </h1>

            <p className="text-[#141414] text-lg font-bold">
              Find all 3 pillars in under 30 seconds and win a cool <span className="bg-[#FF6633] text-white px-2 py-0.5 font-black border border-[#141414]">Yi Sticker</span>! 🎁
            </p>
          </div>

          {/* Main Player QR Box */}
          <div className="border-4 border-[#141414] bg-[#F3F4F6] p-5 shadow-[6px_6px_0px_0px_#141414] flex flex-col sm:flex-row items-center gap-6">
            <div className="p-3 bg-white border-4 border-[#141414] shadow-[4px_4px_0px_0px_#141414] flex-shrink-0">
              <QRCodeSVG
                value={playerGameUrl}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="flex flex-col text-center sm:text-left space-y-2">
              <span className="text-xs font-black text-[#FF6633] uppercase tracking-widest bg-white px-2 py-0.5 border border-[#141414] self-center sm:self-start">
                SCAN WITH YOUR PHONE
              </span>
              <h3 className="text-2xl font-black text-[#141414] uppercase">
                START YOUR CHALLENGE
              </h3>
              <p className="text-xs font-mono text-slate-700 font-bold">
                Session Code: <span className="bg-[#141414] text-white px-2 py-0.5 font-mono">{currentSessionId}</span>
              </p>

              <button
                onClick={generateNewSession}
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Session QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instagram QR & Stall Counter Stats */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Permanent Instagram QR Card */}
          <div className="bg-white border-4 border-[#141414] p-5 shadow-[8px_8px_0px_0px_#141414] flex items-center justify-between gap-4">
            <div className="flex flex-col space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#FF6633] text-white text-[10px] font-black uppercase px-2 py-0.5 border border-[#141414]">
                <Instagram className="w-3.5 h-3.5" />
                <span>FOLLOW FOR CLUE</span>
              </div>
              <h4 className="text-xl font-black text-[#141414] uppercase leading-tight">
                @{APP_CONFIG.INSTAGRAM_HANDLE}
              </h4>
              <p className="text-xs font-bold text-slate-600">
                Scan & follow for Yi MIT-WPU goodies!
              </p>
            </div>

            <div className="p-2 bg-white border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] flex-shrink-0">
              <QRCodeSVG
                value={APP_CONFIG.INSTAGRAM_PROFILE_URL}
                size={95}
                level="M"
              />
            </div>
          </div>

          {/* Stall Live Counter Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#138808] text-white border-4 border-[#141414] p-5 shadow-[6px_6px_0px_0px_#141414] flex flex-col items-center text-center">
              <Users className="w-7 h-7 mb-1 text-white" />
              <span className="text-4xl font-black tracking-tight">
                {stats.gamesPlayed}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-90">
                GAMES PLAYED
              </span>
            </div>

            <div className="bg-[#FF6633] text-white border-4 border-[#141414] p-5 shadow-[6px_6px_0px_0px_#141414] flex flex-col items-center text-center">
              <Trophy className="w-7 h-7 mb-1 text-white" />
              <span className="text-4xl font-black tracking-tight">
                {stats.gamesWon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-90">
                1 IN 100 WINNERS
              </span>
            </div>
          </div>

          {/* 3 Pillars Badge Row */}
          <div className="bg-white border-4 border-[#141414] p-5 shadow-[6px_6px_0px_0px_#141414] flex flex-col space-y-3">
            <span className="text-xs font-black text-[#141414] uppercase tracking-wider border-b-2 border-[#141414] pb-1">
              THE 3 CROSSWORD PILLARS:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center font-black text-xs">
              <div className="p-2.5 bg-[#FF6633] text-white border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] uppercase">
                1. LEAD
              </div>
              <div className="p-2.5 bg-amber-400 text-black border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] uppercase">
                2. CREATE
              </div>
              <div className="p-2.5 bg-[#138808] text-white border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] uppercase">
                3. IMPACT
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#141414] pt-4 flex flex-wrap items-center justify-between text-xs font-black uppercase text-[#141414] gap-2">
        <div>
          <span>{APP_CONFIG.ORGANIZATION_NAME} • {APP_CONFIG.POWERED_BY}</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={onResetStats}
            className="hover:bg-red-600 hover:text-white px-2 py-0.5 border border-[#141414] transition"
          >
            Reset Counter
          </button>
          <span>MIT-WPU Shubharambh Fest</span>
        </div>
      </footer>
    </div>
  );
};
