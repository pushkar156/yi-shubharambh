import React, { useEffect, useRef } from 'react';
import { APP_CONFIG, PillarClue } from '../config';
import { GridCellData } from '../types';
import { sound } from '../utils/sound';
import { Check, AlertCircle } from 'lucide-react';

interface CrosswordGridProps {
  userAnswers: Record<string, string>; // cellKey -> letter
  solvedWordIds: string[];
  activeWordId: string | null;
  selectedCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number, wordId?: string) => void;
  onUpdateAnswer: (row: number, col: number, letter: string) => void;
  onDecoyTrigger?: () => void;
  disabled?: boolean;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  userAnswers,
  solvedWordIds,
  activeWordId,
  selectedCell,
  onSelectCell,
  onUpdateAnswer,
  onDecoyTrigger,
  disabled = false,
}) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Generate 7x7 grid definition
  const gridCells = React.useMemo(() => {
    const matrix: (GridCellData | null)[][] = Array(7)
      .fill(null)
      .map(() => Array(7).fill(null));

    // Place IMPACT (0,1) to (5,1)
    const impact = APP_CONFIG.PILLARS.find((p) => p.id === 'IMPACT')!;
    for (let i = 0; i < impact.word.length; i++) {
      const r = impact.startRow + i;
      const c = impact.startCol;
      if (!matrix[r][c]) {
        matrix[r][c] = {
          row: r,
          col: c,
          correctLetter: impact.word[i],
          userLetter: userAnswers[`${r}-${c}`] || '',
          isBlack: false,
          wordIds: ['IMPACT'],
          numberLabel: i === 0 ? 1 : undefined,
        };
      } else {
        matrix[r][c]!.wordIds.push('IMPACT');
      }
    }

    // Place CREATE (4,1) to (4,6)
    const create = APP_CONFIG.PILLARS.find((p) => p.id === 'CREATE')!;
    for (let i = 0; i < create.word.length; i++) {
      const r = create.startRow;
      const c = create.startCol + i;
      if (!matrix[r][c]) {
        matrix[r][c] = {
          row: r,
          col: c,
          correctLetter: create.word[i],
          userLetter: userAnswers[`${r}-${c}`] || '',
          isBlack: false,
          wordIds: ['CREATE'],
          numberLabel: i === 0 ? 3 : undefined, // CREATE starts at (4,1)
        };
      } else {
        matrix[r][c]!.wordIds.push('CREATE');
      }
    }

    // Place LEAD (2,4) to (5,4)
    const lead = APP_CONFIG.PILLARS.find((p) => p.id === 'LEAD')!;
    for (let i = 0; i < lead.word.length; i++) {
      const r = lead.startRow + i;
      const c = lead.startCol;
      if (!matrix[r][c]) {
        matrix[r][c] = {
          row: r,
          col: c,
          correctLetter: lead.word[i],
          userLetter: userAnswers[`${r}-${c}`] || '',
          isBlack: false,
          wordIds: ['LEAD'],
          numberLabel: i === 0 ? 2 : undefined,
        };
      } else {
        matrix[r][c]!.wordIds.push('LEAD');
      }
    }

    // Place Decoy Cell at (1,3) with a warning tag
    matrix[1][3] = {
      row: 1,
      col: 3,
      correctLetter: '?',
      userLetter: '?',
      isBlack: false,
      wordIds: ['DECOY'],
      numberLabel: 4,
      isDecoy: true,
    };

    return matrix;
  }, [userAnswers]);

  // Focus hidden input on mobile tap
  const handleCellClick = (r: number, c: number, cellData: GridCellData | null) => {
    if (disabled || !cellData) return;

    if (cellData.isDecoy) {
      sound.playTick(true);
      if (onDecoyTrigger) onDecoyTrigger();
      return;
    }

    const preferredWordId = activeWordId && cellData.wordIds.includes(activeWordId)
      ? activeWordId
      : cellData.wordIds[0];

    onSelectCell(r, c, preferredWordId);

    // Focus hidden input for physical/software keyboard
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || !selectedCell) return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        sound.playKeyTap();
        onUpdateAnswer(selectedCell.row, selectedCell.col, key);
      } else if (e.key === 'Backspace') {
        sound.playKeyTap();
        onUpdateAnswer(selectedCell.row, selectedCell.col, '');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, selectedCell, onUpdateAnswer]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Hidden input for physical / software keyboard capture */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -z-50 w-1 h-1 pointer-events-none"
        aria-hidden="true"
        onChange={(e) => {
          const val = e.target.value.slice(-1).toUpperCase();
          if (selectedCell && /^[A-Z]$/.test(val)) {
            sound.playKeyTap();
            onUpdateAnswer(selectedCell.row, selectedCell.col, val);
          }
          e.target.value = '';
        }}
      />

      {/* Grid Container */}
      <div className="bg-white p-3 sm:p-4 border-4 border-[#141414] shadow-[8px_8px_0px_0px_#141414] w-full aspect-square max-w-[360px] sm:max-w-[400px]">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 h-full w-full">
          {gridCells.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              if (!cell) {
                // Black cell
                return (
                  <div
                    key={`cell-${r}-${c}`}
                    className="bg-[#141414] border border-[#141414]"
                  />
                );
              }

              const key = `${r}-${c}`;
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const cellUserVal = userAnswers[key] || '';
              
              // Check if cell belongs to any fully solved word
              const isCellSolved = cell.wordIds.some((wid) => solvedWordIds.includes(wid));
              
              // Check if cell belongs to currently highlighted word
              const isActiveInWord = activeWordId ? cell.wordIds.includes(activeWordId) : false;

              // Render Decoy cell
              if (cell.isDecoy) {
                return (
                  <button
                    key={`cell-${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c, cell)}
                    className="relative bg-amber-400 text-black border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] hover:bg-amber-300 flex items-center justify-center transition-all group"
                  >
                    <span className="absolute top-0.5 left-1 text-[9px] font-black text-black">4</span>
                    <AlertCircle className="w-5 h-5 text-black animate-bounce" />
                  </button>
                );
              }

              return (
                <button
                  key={`cell-${r}-${c}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleCellClick(r, c, cell)}
                  className={`relative flex items-center justify-center font-black text-lg sm:text-xl transition-all duration-150 select-none ${
                    isCellSolved
                      ? 'bg-[#138808] text-white border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]'
                      : isSelected
                      ? 'bg-[#FF6633] text-white border-4 border-[#141414] shadow-[4px_4px_0px_0px_#141414] scale-105 z-10'
                      : isActiveInWord
                      ? 'bg-[#FF6633]/25 text-[#141414] border-2 border-[#141414]'
                      : 'bg-white text-[#141414] hover:bg-[#F3F4F6] border-2 border-[#141414] shadow-[1px_1px_0px_0px_#141414]'
                  }`}
                >
                  {/* Number Label */}
                  {cell.numberLabel && (
                    <span
                      className={`absolute top-0.5 left-1 text-[9px] font-black leading-none ${
                        isCellSolved || isSelected
                          ? 'text-white'
                          : 'text-[#141414]'
                      }`}
                    >
                      {cell.numberLabel}
                    </span>
                  )}

                  {/* Solved checkmark badge */}
                  {isCellSolved && (
                    <Check className="absolute top-0.5 right-0.5 w-3.5 h-3.5 text-white" />
                  )}

                  {/* Letter Content */}
                  <span className="leading-none mt-1 uppercase font-black">
                    {isCellSolved ? cell.correctLetter : cellUserVal}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Touch On-Screen Keyboard for Mobile Fast Tapping */}
      <div className="mt-4 w-full max-w-sm">
        <div className="text-center text-xs text-[#141414] mb-2 font-black uppercase tracking-tight flex items-center justify-center gap-1.5">
          <span>Tap cells above or key buttons below:</span>
        </div>

        {/* On-Screen Keypad Rows */}
        <div className="flex flex-col gap-1.5 px-1">
          {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((rowStr, rIdx) => (
            <div key={`keyrow-${rIdx}`} className="flex justify-center gap-1 sm:gap-1.5">
              {rowStr.split('').map((char) => (
                <button
                  key={`key-${char}`}
                  type="button"
                  disabled={disabled || !selectedCell}
                  onClick={() => {
                    if (selectedCell) {
                      sound.playKeyTap();
                      onUpdateAnswer(selectedCell.row, selectedCell.col, char);
                    }
                  }}
                  className="px-1.5 py-2 sm:py-2.5 bg-white hover:bg-[#FF6633] hover:text-white active:bg-[#141414] active:text-white disabled:opacity-40 text-[#141414] font-black text-xs sm:text-sm border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition-all flex-1 max-w-[36px]"
                >
                  {char}
                </button>
              ))}
              {/* Backspace button on last row */}
              {rIdx === 2 && (
                <button
                  type="button"
                  disabled={disabled || !selectedCell}
                  onClick={() => {
                    if (selectedCell) {
                      sound.playKeyTap();
                      onUpdateAnswer(selectedCell.row, selectedCell.col, '');
                    }
                  }}
                  className="px-2 py-2 bg-[#FF6633] active:bg-[#141414] text-white font-black text-xs border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] flex-1 max-w-[48px] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5"
                >
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
