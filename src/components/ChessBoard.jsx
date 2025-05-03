import React from 'react'
import QueenIcon from './QueenIcon'

const ChessBoard = ({ boardSize, solution }) => {
    return (
        <div className="aspect-square w-full max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md border border-white/40">
            <div
                className="grid gap-0.5 h-full w-full"
                style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
            >
                {Array.from({ length: boardSize }).map((_, row) => (
                    Array.from({ length: boardSize }).map((_, col) => {
                        const isQueen = solution[row] === col;
                        const isPlaced = solution[row] !== -1 && solution[row] !== undefined;
                        const isDarkSquare = (row + col) % 2 !== 0;

                        return (
                            <div
                                key={`${row}-${col}`}
                                className={`relative ${isDarkSquare
                                        ? 'bg-indigo-800/80'
                                        : 'bg-indigo-200/80'
                                    } ${isQueen
                                        ? 'border-2 border-yellow-400'
                                        : ''
                                    } flex items-center justify-center transition-all duration-300`}
                            >
                                {isQueen && (
                                    <div className="absolute inset-2 flex items-center justify-center">
                                        <QueenIcon />
                                    </div>
                                )}

                                {/* Row and column indicators */}
                                {col === 0 && (
                                    <span className="absolute left-1 top-0 text-xs font-bold text-white/80 drop-shadow">
                                        {row + 1}
                                    </span>
                                )}
                                {row === boardSize - 1 && (
                                    <span className="absolute bottom-0 right-1 text-xs font-bold text-white/80 drop-shadow">
                                        {String.fromCharCode(65 + col)}
                                    </span>
                                )}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
}

export default ChessBoard
