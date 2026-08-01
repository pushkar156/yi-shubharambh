import React from 'react';
import { APP_CONFIG } from '../config';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  lightMode = false,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  const sizeClasses = {
    sm: { container: 'h-8', text: 'text-sm', badge: 'text-[10px]' },
    md: { container: 'h-11', text: 'text-lg', badge: 'text-xs' },
    lg: { container: 'h-14', text: 'text-2xl', badge: 'text-xs' },
    xl: { container: 'h-18', text: 'text-3xl', badge: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Custom logo or Brutalist SVG logo */}
      {!imgFailed && APP_CONFIG.CLUB_LOGO_URL ? (
        <img
          src={APP_CONFIG.CLUB_LOGO_URL}
          alt={APP_CONFIG.ORGANIZATION_NAME}
          className={`${sizeClasses.container} object-contain border-2 border-[#141414] bg-white p-1 shadow-[3px_3px_0px_0px_#141414]`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        /* Brutalist Badge Logo */
        <div className={`relative flex items-center justify-center ${sizeClasses.container} aspect-square border-2 border-[#141414] bg-[#FF6633] text-white shadow-[3px_3px_0px_0px_#141414]`}>
          <div className="flex flex-col items-center justify-center text-center p-1">
            <span className="font-black tracking-tighter text-white text-xs sm:text-sm leading-none">
              Yi
            </span>
            <span className="text-[8px] font-black text-black tracking-widest uppercase bg-white px-1 mt-0.5 border border-[#141414]">
              MIT
            </span>
          </div>
        </div>
      )}

      {/* Brand Text Details */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-black tracking-tight ${sizeClasses.text} text-[#141414]`}>
            Yi <span className="text-[#FF6633]">MIT-WPU</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#138808] text-white border border-[#141414] shadow-[1px_1px_0px_0px_#141414]">
            CII
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[11px] font-bold text-[#141414]/70 uppercase tracking-tight">
            {APP_CONFIG.EVENT_NAME} • {APP_CONFIG.ORGANIZATION_NAME}
          </span>
        )}
      </div>
    </div>
  );
};
