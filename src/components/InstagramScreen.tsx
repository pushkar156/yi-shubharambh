import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_CONFIG } from '../config';
import { BrandLogo } from './BrandLogo';
import { Instagram, Gift, ExternalLink, RefreshCw, CheckCircle2, Timer } from 'lucide-react';

interface InstagramScreenProps {
  isWon: boolean;
  onRestartGame: () => void;
}

export const InstagramScreen: React.FC<InstagramScreenProps> = ({
  isWon,
  onRestartGame,
}) => {
  const handleFollowClick = () => {
    window.open(APP_CONFIG.INSTAGRAM_PROFILE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#141414] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#FF6633] selection:text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3 border-b-4 border-[#141414]">
        <BrandLogo size="sm" lightMode={true} />
      </header>

      {/* Main Content */}
      <main className="my-auto py-6 flex flex-col items-center text-center space-y-6 max-w-md mx-auto w-full bg-white border-4 border-[#141414] p-6 shadow-[10px_10px_0px_0px_#141414]">
        {/* Gift / Badge Header */}
        {isWon ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF6633] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
            <Gift className="w-4 h-4 text-white" />
            <span>FINAL STEP — CLAIM STALL GIFT</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF6633] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
            <Timer className="w-4 h-4 text-white" />
            <span>BETTER LUCK NEXT TIME!</span>
          </div>
        )}

        {/* Call to Action Title */}
        <div className="space-y-2">
          {isWon ? (
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-tight">
              YOU CRACKED IT! <br />
              <span className="bg-[#141414] text-[#FF6633] px-2 py-0.5 inline-block mt-1">
                FOLLOW US ON INSTAGRAM!
              </span>
            </h1>
          ) : (
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-tight">
              NICE TRY! <br />
              <span className="bg-[#141414] text-[#FF6633] px-2 py-0.5 inline-block mt-1">
                FOLLOW US ON INSTAGRAM
              </span>
            </h1>
          )}
          <p className="text-[#141414] text-xs sm:text-sm font-bold">
            {isWon
              ? 'Join the Young Indians (Yi) Student Chapter at MIT-WPU. Lead, Create, Impact with us!'
              : 'Better luck next time! Stay updated with the Young Indians (Yi) Student Chapter at MIT-WPU.'}
          </p>
        </div>

        {/* Primary Instagram Follow CTA Button */}
        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={handleFollowClick}
            className="w-full py-4 px-6 bg-[#FF6633] hover:bg-[#141414] active:translate-x-1 active:translate-y-1 text-white font-black text-lg sm:text-xl border-4 border-[#141414] shadow-[6px_6px_0px_0px_#141414] tracking-wider flex items-center justify-center gap-3 transition-all"
          >
            <Instagram className="w-6 h-6" />
            <span>FOLLOW @<span className="lowercase">{APP_CONFIG.INSTAGRAM_HANDLE}</span></span>
            <ExternalLink className="w-5 h-5 opacity-80" />
          </button>

          {/* Stall Gift Claim Badge (Only shown to winners!) */}
          {isWon && (
            <div className="bg-[#138808] text-white border-2 border-[#141414] p-4 shadow-[3px_3px_0px_0px_#141414] flex items-center gap-3 text-left">
              <div className="p-2 bg-[#141414] text-white border border-white shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide">
                  STALL TEAM GIFT PERK
                </p>
                <p className="text-xs font-bold leading-snug">
                  Show this screen to our stall team right now to claim your exclusive welcome sticker!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fallback QR Code for external device scan */}
        <div className="bg-[#F3F4F6] border-2 border-[#141414] p-4 shadow-[3px_3px_0px_0px_#141414] flex flex-col items-center space-y-2 w-full max-w-xs">
          <span className="text-xs font-black text-[#141414] uppercase tracking-wider">
            OR SCAN INSTAGRAM QR CODE
          </span>
          <div className="p-2.5 bg-white border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
            <QRCodeSVG
              value={APP_CONFIG.INSTAGRAM_PROFILE_URL}
              size={130}
              level="M"
            />
          </div>
          <span className="text-xs text-[#141414] font-mono font-black lowercase">
            @{APP_CONFIG.INSTAGRAM_HANDLE}
          </span>
        </div>

        {/* Restart Fresh Session Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onRestartGame}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>PLAY AGAIN (NEW 30S GAME)</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-3 border-t-4 border-[#141414] text-center text-xs font-black uppercase text-[#141414]">
        <span>Yi MIT-WPU Student Chapter • Powered by CII</span>
      </footer>
    </div>
  );
};
