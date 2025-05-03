import { useState, useEffect, useRef } from 'react';
import ChessBoard from '../components/ChessBoard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Main component
export default function NQueensVisualization() {
    const [boardSize, setBoardSize] = useState(8);
    const [speed, setSpeed] = useState(500);
    const [isPlaying, setIsPlaying] = useState(false);
    const [solution, setSolution] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [history, setHistory] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [solutionCount, setSolutionCount] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const animationRef = useRef(null);
    const solutionRef = useRef([]);
    const historyRef = useRef([]);

    // Initialize the board
    useEffect(() => {
        resetBoard();
    }, [boardSize]);

    // Control the animation
    useEffect(() => {
        if (isPlaying && currentStep < history.length - 1) {
            animationRef.current = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, speed);
        } else if (currentStep >= history.length - 1 && history.length > 0) {
            setIsPlaying(false);
            setIsComplete(true);
        }

        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, [isPlaying, currentStep, history, speed]);

    // Update explanation based on current step
    useEffect(() => {
        if (history.length > 0 && currentStep < history.length) {
            setExplanation(history[currentStep].explanation);
            setSolution(history[currentStep].board);
        }
    }, [currentStep, history]);

    const resetBoard = () => {
        setSolution(Array(boardSize).fill(-1));
        setHistory([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsComplete(false);
        setSolutionCount(0);
        setExplanation('Click "Start" to begin solving the N-Queens problem.');

        // Clear any ongoing animations
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }
    };

    const startVisualization = () => {
        resetBoard();
        setIsPlaying(true);

        // Initialize the history with an empty board
        const initialBoard = Array(boardSize).fill(-1);
        const initialHistory = [{
            board: [...initialBoard],
            explanation: 'Starting to solve the N-Queens problem with backtracking...'
        }];

        historyRef.current = initialHistory;
        setHistory(initialHistory);

        // Start the solving process
        solveNQueens(boardSize);
    };

    const solveNQueens = (n) => {
        solutionRef.current = Array(n).fill(-1);
        const newHistory = [...historyRef.current];

        const solve = (row) => {
            // Found a solution
            if (row === n) {
                setSolutionCount(count => count + 1);
                newHistory.push({
                    board: [...solutionRef.current],
                    explanation: `Solution found! We've successfully placed ${n} queens on the board.`
                });
                historyRef.current = newHistory;
                setHistory(newHistory);
                return true;
            }

            // Try each column in the current row
            for (let col = 0; col < n; col++) {
                if (isSafe(row, col, solutionRef.current)) {
                    // Place queen and update visualization
                    solutionRef.current[row] = col;

                    newHistory.push({
                        board: [...solutionRef.current],
                        explanation: `Placed queen at row ${row + 1}, column ${col + 1}. This position is safe as it doesn't conflict with any previously placed queens.`
                    });

                    // Recursive call
                    if (solve(row + 1)) {
                        return true;
                    }

                    // Backtrack if needed
                    solutionRef.current[row] = -1;
                    newHistory.push({
                        board: [...solutionRef.current],
                        explanation: `Backtracking from row ${row + 1}, column ${col + 1}. This placement leads to conflicts in subsequent rows.`
                    });
                } else {
                    // Add explanation for invalid position
                    newHistory.push({
                        board: [...solutionRef.current],
                        explanation: `Cannot place queen at row ${row + 1}, column ${col + 1}. It would conflict with a previously placed queen (same column, diagonal, or row).`
                    });
                }
            }

            return false;
        };

        solve(0);
        historyRef.current = newHistory;
        setHistory(newHistory);
    };

    const isSafe = (row, col, board) => {
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i] === col) return false;
        }

        // Check diagonal
        for (let i = 0; i < row; i++) {
            // Left diagonal: row-col remains constant
            // Right diagonal: row+col remains constant
            if (board[i] - i === col - row || board[i] + i === col + row) {
                return false;
            }
        }

        return true;
    };

    const handlePlayPause = () => {
        if (history.length === 0) {
            startVisualization();
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleReset = () => {
        resetBoard();
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentStep(prev => Math.min(history.length - 1, prev + 1));
    };

    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setBoardSize(newSize);
    };

    const handleSpeedChange = (e) => {
        setSpeed(1000 - parseInt(e.target.value));
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 mt-15 ">
                <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-6 mb-8 border border-white/40">
                    <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">N-Queens Visualization</h1>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Chessboard */}
                        <div className="flex-1">
                            <ChessBoard boardSize={boardSize} solution={solution} />
                        </div>

                        {/* Controls and Explanation */}
                        <div className="flex-1 flex flex-col">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-md border border-white/40">
                                <h2 className="text-xl font-semibold text-indigo-700 mb-2">Controls</h2>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Board Size (N): {boardSize}</label>
                                    <input
                                        type="range"
                                        min="4"
                                        max="12"
                                        value={boardSize}
                                        onChange={handleSizeChange}
                                        className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                                        disabled={isPlaying}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Animation Speed</label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="900"
                                        value={1000 - speed}
                                        onChange={handleSpeedChange}
                                        className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                <div className="flex justify-between mb-2">
                                    <button
                                        onClick={handlePlayPause}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
                                    >
                                        {isPlaying ? "Pause" : (history.length === 0 ? "Start" : "Resume")}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors shadow-md"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={handlePrevious}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md disabled:bg-indigo-300"
                                        disabled={currentStep === 0 || isPlaying}
                                    >
                                        Previous
                                    </button>
                                    <div className="text-center">
                                        {history.length > 0 && (
                                            <span className="text-sm text-gray-600">
                                                Step {currentStep + 1} of {history.length}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md disabled:bg-indigo-300"
                                        disabled={currentStep >= history.length - 1 || isPlaying}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/40 flex-grow">
                                <h2 className="text-xl font-semibold text-indigo-700 mb-2">Explanation</h2>
                                <div className="p-2 bg-white/90 rounded-md h-40 overflow-y-auto">
                                    <p className="text-sm text-gray-700">{explanation}</p>
                                </div>

                                {isComplete && (
                                    <div className="mt-4 p-2 bg-green-100 rounded-md">
                                        <p className="text-sm text-green-800">
                                            Visualization complete! Found a solution for {boardSize}-Queens problem.
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <h3 className="text-md font-medium text-indigo-700">About N-Queens</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        The N-Queens problem involves placing N queens on an N×N chessboard so that no two queens attack each other. This visualization demonstrates the backtracking algorithm used to solve this classic problem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
