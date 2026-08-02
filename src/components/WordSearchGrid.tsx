import React, { useState, useMemo, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { sound } from '../utils/sound';
import { Check, AlertCircle } from 'lucide-react';

interface WordSearchGridProps {
  solvedWordIds: string[];
  onWordSolved: (wordId: string) => void;
  disabled?: boolean;
}

// 10x10 layout designed with overlaps:
// - CREATE (Horizontal) at Row 3, Cols 2-7
// - IMPACT (Vertical) at Row 0-5, Col 5 (overlaps with CREATE at Row 3, Col 5 'A')
// - LEAD (Vertical) at Row 2-5, Col 4 (overlaps with CREATE at Row 3, Col 4 'E')
const GRID_LETTERS = [
  ['Q', 'Z', 'X', 'W', 'K', 'I', 'O', 'P', 'N', 'B'], // Row 0
  ['Y', 'A', 'H', 'F', 'R', 'M', 'U', 'V', 'S', 'G'], // Row 1
  ['T', 'V', 'K', 'J', 'L', 'P', 'D', 'R', 'E', 'W'], // Row 2
  ['O', 'N', 'C', 'R', 'E', 'A', 'T', 'E', 'X', 'Z'], // Row 3
  ['B', 'W', 'Q', 'Y', 'A', 'C', 'S', 'O', 'K', 'M'], // Row 4
  ['P', 'D', 'F', 'G', 'D', 'T', 'H', 'I', 'Z', 'L'], // Row 5
  ['X', 'K', 'V', 'Z', 'N', 'R', 'B', 'Y', 'Q', 'W'], // Row 6
  ['J', 'O', 'U', 'M', 'E', 'C', 'W', 'X', 'K', 'A'], // Row 7
  ['R', 'B', 'T', 'H', 'Y', 'G', 'P', 'O', 'I', 'U'], // Row 8
  ['H', 'E', 'A', 'D', 'T', 'M', 'Q', 'Z', 'W', 'R']  // Row 9
];

export const WORD_LOCATIONS: Record<string, { cells: { row: number; col: number }[] }> = {
  CREATE: {
    cells: [
      { row: 3, col: 2 },
      { row: 3, col: 3 },
      { row: 3, col: 4 },
      { row: 3, col: 5 },
      { row: 3, col: 6 },
      { row: 3, col: 7 }
    ]
  },
  IMPACT: {
    cells: [
      { row: 0, col: 5 },
      { row: 1, col: 5 },
      { row: 2, col: 5 },
      { row: 3, col: 5 },
      { row: 4, col: 5 },
      { row: 5, col: 5 }
    ]
  },
  LEAD: {
    cells: [
      { row: 2, col: 4 },
      { row: 3, col: 4 },
      { row: 4, col: 4 },
      { row: 5, col: 4 }
    ]
  }
};

const getCellsInLine = (
  start: { row: number; col: number },
  end: { row: number; col: number }
): { row: number; col: number }[] => {
  const rowDiff = end.row - start.row;
  const colDiff = end.col - start.col;

  const isHorizontal = rowDiff === 0;
  const isVertical = colDiff === 0;
  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [];
  }

  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
  const rowStep = rowDiff === 0 ? 0 : rowDiff / steps;
  const colStep = colDiff === 0 ? 0 : colDiff / steps;

  const cells = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({
      row: start.row + i * rowStep,
      col: start.col + i * colStep
    });
  }
  return cells;
};

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  solvedWordIds,
  onWordSolved,
  disabled = false
}) => {
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [invalidSelection, setInvalidSelection] = useState<boolean>(false);

  // Compile solved cells for green highlights
  const solvedCells = useMemo(() => {
    const solved = new Set<string>();
    solvedWordIds.forEach(id => {
      const loc = WORD_LOCATIONS[id];
      if (loc) {
        loc.cells.forEach(c => {
          solved.add(`${c.row}-${c.col}`);
        });
      }
    });
    return solved;
  }, [solvedWordIds]);

  // Compute active selection path
  const currentSelectionPath = useMemo(() => {
    if (!startCell || !hoveredCell) return [];
    return getCellsInLine(startCell, hoveredCell);
  }, [startCell, hoveredCell]);

  const selectionKeys = useMemo(() => {
    const keys = new Set<string>();
    currentSelectionPath.forEach(c => keys.add(`${c.row}-${c.col}`));
    return keys;
  }, [currentSelectionPath]);

  // Get string from active path
  const selectedText = useMemo(() => {
    if (currentSelectionPath.length === 0) return '';
    return currentSelectionPath.map(c => GRID_LETTERS[c.row][c.col]).join('');
  }, [currentSelectionPath]);

  const handleCellClick = (r: number, c: number) => {
    if (disabled || invalidSelection) return;

    if (!startCell) {
      sound.playKeyTap();
      setStartCell({ row: r, col: c });
      setHoveredCell({ row: r, col: c });
    } else {
      // If clicked the same cell, cancel selection
      if (startCell.row === r && startCell.col === c) {
        sound.playKeyTap();
        setStartCell(null);
        setHoveredCell(null);
        return;
      }

      const path = getCellsInLine(startCell, { row: r, col: c });
      if (path.length > 0) {
        // Evaluate the word selected
        const selectedWord = path.map(cell => GRID_LETTERS[cell.row][cell.col]).join('');
        const reversedWord = selectedWord.split('').reverse().join('');

        const matchedPillar = APP_CONFIG.PILLARS.find(
          p => p.word === selectedWord || p.word === reversedWord
        );

        if (matchedPillar && !solvedWordIds.includes(matchedPillar.id)) {
          // Success!
          onWordSolved(matchedPillar.id);
          setStartCell(null);
          setHoveredCell(null);
        } else {
          // Fail
          sound.playTick(true);
          setInvalidSelection(true);
          // Briefly show red failure state before resetting selection
          setTimeout(() => {
            setInvalidSelection(false);
            setStartCell(null);
            setHoveredCell(null);
          }, 800);
        }
      } else {
        // Not a straight line, make this cell the new start
        sound.playKeyTap();
        setStartCell({ row: r, col: c });
        setHoveredCell({ row: r, col: c });
      }
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (disabled || !startCell || invalidSelection) return;
    setHoveredCell({ row: r, col: c });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Game Instruction Info Box */}
      <div className="mb-3 bg-white border-2 border-[#141414] p-3 text-center shadow-[3px_3px_0px_0px_#141414] w-full max-w-[360px] sm:max-w-[400px]">
        <p className="text-xs font-black uppercase leading-tight text-[#141414]">
          {startCell 
            ? `Selection: ${selectedText || 'Tapping...'}`
            : 'Tap the start letter, then the end letter of a word!'}
        </p>
      </div>

      {/* 10x10 Word Search Grid */}
      <div className="bg-white p-2.5 sm:p-3 border-4 border-[#141414] shadow-[8px_8px_0px_0px_#141414] w-full aspect-square max-w-[360px] sm:max-w-[400px]">
        <div className="grid grid-cols-10 gap-0.5 sm:gap-1 h-full w-full">
          {GRID_LETTERS.map((rowArr, r) =>
            rowArr.map((letter, c) => {
              const cellKey = `${r}-${c}`;
              const isSolved = solvedCells.has(cellKey);
              const isSelected = selectionKeys.has(cellKey);
              const isStart = startCell?.row === r && startCell?.col === c;

              // Compute background styling
              let cellClass = 'bg-white text-[#141414] hover:bg-[#F3F4F6] border border-[#E5E7EB]';
              
              if (isSolved) {
                cellClass = 'bg-[#138808] text-white border border-[#141414] font-black';
              } else if (isSelected) {
                cellClass = invalidSelection
                  ? 'bg-red-600 text-white border border-[#141414] font-black animate-shake'
                  : 'bg-[#FF6633] text-white border border-[#141414] font-black';
              } else if (isStart) {
                cellClass = 'bg-[#FF6633] text-white border border-[#141414] font-black scale-105';
              }

              return (
                <button
                  key={cellKey}
                  type="button"
                  disabled={disabled || (invalidSelection && !isSelected)}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  className={`relative flex items-center justify-center font-black text-sm sm:text-base transition-all duration-100 select-none aspect-square ${cellClass}`}
                >
                  {isSolved && (
                    <Check className="absolute top-0.5 right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 text-white opacity-80" />
                  )}
                  <span className="leading-none uppercase">{letter}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
