import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IconX, IconPuzzle } from './IconComponents';

// --- Interfaces and Constants ---
interface Piece {
  id: number;
  imgUrl: string;
}

interface Puzzle {
  id: string;
  name: string;
  src: string;
}

const GRID_SIZE = 4; // 4x4 = 16 pieces
const STORAGE_KEY = 'healer_puzzle_progress';

const PUZZLE_IMAGES: Puzzle[] = [
    { id: 'lake', name: 'Mountain Lake', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop' },
    { id: 'forest_path', name: 'Forest Path', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2174&auto=format&fit=crop' },
    { id: 'misty_forest', name: 'Misty Forest', src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop' },
    { id: 'beach_sunset', name: 'Beach Sunset', src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1970&auto=format&fit=crop' },
    // 'Mountain Valley' removed as requested
];

type GameState = 'selecting' | 'loading' | 'playing' | 'solved';

// --- Persistence Layer ---
const saveProgress = (puzzleId: string, placed: (Piece | null)[], shuffled: Piece[]) => {
    const data = {
        puzzleId,
        placedIds: placed.map(p => p?.id ?? null),
        shuffledIds: shuffled.map(p => p.id)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getProgress = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

const JigsawPuzzle: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(PUZZLE_IMAGES[0]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [shuffledPieces, setShuffledPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<(Piece | null)[]>(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // --- Image Slicing Logic ---
  const sliceImage = useCallback(async (puzzle: Puzzle, resumeData: any = null) => {
    setGameState('loading');
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = puzzle.src;
    
    img.onload = () => {
      const pieceWidth = img.width / GRID_SIZE;
      const pieceHeight = img.height / GRID_SIZE;
      const generatedPieces: Piece[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = pieceWidth;
      canvas.height = pieceHeight;

      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          ctx.clearRect(0, 0, pieceWidth, pieceHeight);
          ctx.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
          generatedPieces.push({
            id: y * GRID_SIZE + x,
            imgUrl: canvas.toDataURL('image/jpeg', 0.9),
          });
        }
      }

      setPieces(generatedPieces);

      if (resumeData) {
          const restoredPlaced = Array(GRID_SIZE * GRID_SIZE).fill(null);
          resumeData.placedIds.forEach((id: number | null, index: number) => {
              if (id !== null) restoredPlaced[index] = generatedPieces.find(p => p.id === id) || null;
          });
          const restoredShuffled = resumeData.shuffledIds.map((id: number) => generatedPieces.find(p => p.id === id)).filter(Boolean);
          setPlacedPieces(restoredPlaced);
          setShuffledPieces(restoredShuffled);
      } else {
          setPlacedPieces(Array(GRID_SIZE * GRID_SIZE).fill(null));
          setShuffledPieces([...generatedPieces].sort(() => Math.random() - 0.5));
      }
      
      setGameState('playing');
    };

    img.onerror = () => {
        console.error("Failed to load puzzle image.");
        setGameState('selecting');
    };
  }, []);

  useEffect(() => {
      const saved = getProgress();
      if (saved) {
          const puzzle = PUZZLE_IMAGES.find(p => p.id === saved.puzzleId);
          if (puzzle) {
              setCurrentPuzzle(puzzle);
              sliceImage(puzzle, saved);
          }
      }
  }, [sliceImage]);

  useEffect(() => {
      if (gameState === 'playing') {
          saveProgress(currentPuzzle.id, placedPieces, shuffledPieces);
      }
  }, [placedPieces, shuffledPieces, currentPuzzle, gameState]);
  
  // --- Click Logic ---
  const handlePieceClick = (piece: Piece) => {
      setSelectedPiece(piece === selectedPiece ? null : piece);
  };

  const handleSlotClick = (targetId: number) => {
      if (!selectedPiece) return;

      if (selectedPiece.id === targetId) {
          setPlacedPieces(prev => {
              const newPlaced = [...prev];
              newPlaced[targetId] = selectedPiece;
              return newPlaced;
          });
          setShuffledPieces(prev => prev.filter(p => p.id !== selectedPiece.id));
          setSelectedPiece(null);
          setFeedback(null);
      } else {
          setFeedback("This fragment belongs elsewhere.");
          setTimeout(() => setFeedback(null), 2000);
      }
  };
  
  useEffect(() => {
    if (gameState === 'playing' && pieces.length > 0 && shuffledPieces.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        setGameState('solved');
    }
  }, [shuffledPieces, pieces, gameState]);
  
  const handleSelectPuzzle = (puzzle: Puzzle) => {
      setCurrentPuzzle(puzzle);
      sliceImage(puzzle);
  };

  const handleReset = () => {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedPiece(null);
      setGameState('selecting');
  };

  // --- Render Sections ---
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-[500px] bg-dark-neutral/50 rounded-3xl border border-light-neutral animate-pulse">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-primary/70 font-mono text-xs uppercase tracking-widest">Constructing View...</p>
    </div>
  );

  const renderSelection = () => (
      <div className="bg-dark-neutral p-8 rounded-[2.5rem] shadow-2xl border border-light-neutral/50 text-center animate-fade-in-up">
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Select a Neural Anchor</h3>
          <p className="text-light-text/40 mb-8 max-w-sm mx-auto text-sm">Choose an environment to begin your focus session.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PUZZLE_IMAGES.map(puzzle => (
                  <button 
                    key={puzzle.id} 
                    onClick={() => handleSelectPuzzle(puzzle)} 
                    className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-primary transition-all duration-500 hover:scale-[1.02] h-40"
                  >
                      <img src={puzzle.src} alt={puzzle.name} className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-bold text-xs uppercase tracking-widest">{puzzle.name}</span>
                      </div>
                  </button>
              ))}
          </div>
      </div>
  );

  const renderSolved = () => (
    <div className="text-center flex flex-col items-center justify-center h-auto bg-dark-neutral p-12 rounded-[3rem] border border-primary/30 shadow-3xl animate-fade-in-up">
      <div className="relative mb-6">
          <img src={currentPuzzle.src} alt={currentPuzzle.name} className="w-full max-w-xs rounded-2xl shadow-2xl border-2 border-primary/20"/>
          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-2xl"></div>
      </div>
      <h3 className="text-3xl font-black text-primary mb-2">Focus Balanced</h3>
      <p className="text-light-text/60 mb-8 max-w-xs italic text-sm">You've successfully restored the neural anchor. Your focus is grounded.</p>
      <button onClick={handleReset} className="bg-primary text-dark-bg font-bold py-4 px-10 rounded-2xl text-xs uppercase tracking-widest hover:bg-primary-dark transition-all">
        Start New Session
      </button>
    </div>
  );
  
  const renderPlaying = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto animate-fade-in-up">
      
      {/* Top Header - Permanent Reference */}
      <div className="w-full flex flex-col items-center bg-dark-neutral/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/5">
        <p className="text-[10px] uppercase font-black text-primary mb-3 tracking-[0.4em]">Visual Guide</p>
        <img src={currentPuzzle.src} className="h-32 md:h-44 w-auto object-cover rounded-xl border border-primary/20 shadow-2xl" alt="Reference Guide" />
        <div className="mt-4 flex gap-4">
             <button onClick={handleReset} className="text-[10px] font-bold text-light-text/30 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1">
                <IconX className="w-3 h-3" /> Change Environment
             </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
          {/* Neural Grid */}
          <div className="mx-auto xl:mx-0 relative">
              {feedback && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-[10px] px-4 py-1 rounded-full animate-bounce font-bold tracking-widest uppercase z-50">
                      {feedback}
                  </div>
              )}
              <div
                className="grid bg-dark-bg border-4 border-light-neutral rounded-2xl shadow-inner overflow-hidden"
                style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    width: 'min(85vw, 420px)',
                    aspectRatio: '1/1'
                }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`relative border border-white/5 cursor-pointer transition-all duration-300 ${selectedPiece ? 'hover:bg-primary/10' : ''}`}
                  >
                    {placedPieces[index] ? (
                        <img src={placedPieces[index]?.imgUrl} className="w-full h-full block animate-fade-in" alt={`Slot ${index}`} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-5">
                            <IconPuzzle className="w-5 h-5" />
                        </div>
                    )}
                  </div>
                ))}
              </div>
          </div>

          {/* Fragment Tray */}
          <div className="w-full xl:w-80">
            <div className="bg-dark-neutral/80 p-6 rounded-[2rem] border border-light-neutral shadow-xl flex flex-col min-h-[420px]">
                <div className="mb-4 flex justify-between items-center">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Neural Tray</span>
                    <span className="text-[9px] text-light-text/30">{shuffledPieces.length} left</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] p-1 custom-scrollbar">
                  {shuffledPieces.map(piece => (
                    <button
                      key={piece.id}
                      onClick={() => handlePieceClick(piece)}
                      className={`p-1 rounded-xl transition-all duration-300 ${selectedPiece?.id === piece.id ? 'bg-primary scale-110 shadow-lg shadow-primary/30' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <img src={piece.imgUrl} className="w-full h-full block rounded-lg pointer-events-none" alt={`Fragment ${piece.id}`} />
                    </button>
                  ))}
                  {shuffledPieces.length === 0 && (
                        <div className="col-span-full py-10 text-center opacity-20 italic text-sm">Calibration complete.</div>
                  )}
                </div>
                <p className="mt-auto pt-6 text-[9px] text-center text-light-text/30 uppercase tracking-[0.2em] leading-relaxed">
                    1. Select a fragment<br/>2. Match to grid
                </p>
            </div>
          </div>
      </div>
    </div>
  );

  switch (gameState) {
    case 'selecting': return renderSelection();
    case 'loading': return renderLoading();
    case 'solved': return renderSolved();
    case 'playing':
    default: return renderPlaying();
  }
};

export default JigsawPuzzle;