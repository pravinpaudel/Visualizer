import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, RefreshCw, Database, Shuffle } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Colors for visualization with updated modern palette
const COLORS = {
  normal: "rgba(37, 136, 178, 0.9)", // Light blue
  highlight: "rgba(249, 115, 22, 0.9)", // Orange
  compared: "rgba(168, 85, 247, 0.9)", // Purple
  completed: "rgba(34, 197, 94, 0.9)", // Green
  background: "#f8fafc", // Light background
  cardBg: "rgba(255, 255, 255, 0.8)", // Glass effect background
  text: "#334155", // Slate text
  border: "rgba(226, 232, 240, 0.6)", // Soft border
  shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)" // Shadow
};

export default function HeapSortVisualization() {
  const [array, setArray] = useState([]);
  const [heapArray, setHeapArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('initial'); // initial, heapify, sort, completed
  const [highlightNodes, setHighlightNodes] = useState([]);
  const [comparedNodes, setComparedNodes] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [animationInProgress, setAnimationInProgress] = useState(false);
  
  const animationRef = useRef(null);
  const operations = useRef([]);
  
  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, []);
  
  // Handle animation playback
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps) {
      animationRef.current = setTimeout(() => {
        handleNextStep();
      }, speed);
    } else if (currentStep >= totalSteps) {
      setIsPlaying(false);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, totalSteps, speed]);
  
  const generateRandomArray = () => {
    const size = 7;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setInputValue(newArray.join(', '));
    handleArrayInput(newArray);
  };
  
  const handleArrayInput = (arr = null) => {
    let newArray;
    if (arr) {
      newArray = arr;
    } else {
      newArray = inputValue
        .split(',')
        .map(item => parseInt(item.trim()))
        .filter(item => !isNaN(item));
    }
    
    if (newArray.length === 0) {
      setLogs(['Please enter valid numbers']);
      return;
    }
    
    if (newArray.length > 15) {
      setLogs(['Array too large. Maximum 15 elements allowed for visualization.']);
      newArray = newArray.slice(0, 15);
    }
    
    resetState(newArray);
  };
  
  const resetState = (newArray) => {
    setArray(newArray);
    setHeapArray([...newArray]);
    setSortedArray([]);
    setLogs([]);
    setCurrentStep(0);
    setPhase('initial');
    setHighlightNodes([]);
    setComparedNodes([]);
    setExplanation('Welcome to Heap Sort Visualization. Click Play to begin.');
    setIsPlaying(false);
    
    // Prepare all operations for the entire sorting process
    prepareOperations(newArray);
  };
  
  const prepareOperations = (arr) => {
    const steps = [];
    const heapArr = [...arr];
    const n = heapArr.length;
    
    // Add initial state
    steps.push({
      type: 'initial',
      heap: [...heapArr],
      sorted: [],
      explanation: 'Initial array before heap construction.',
      highlights: [],
      compared: []
    });
    
    // Heapify phase
    steps.push({
      type: 'phase-change',
      heap: [...heapArr],
      sorted: [],
      explanation: 'Beginning heapify phase. We will build a max heap from the bottom up.',
      highlights: [],
      compared: []
    });
    
    for (let k = Math.floor(n/2) - 1; k >= 0; k--) {
      sink(heapArr, k, n, steps);
    }
    
    // Sorting phase
    const sortedResult = [];
    steps.push({
      type: 'phase-change',
      heap: [...heapArr],
      sorted: [...sortedResult],
      explanation: 'Heapify complete. Beginning sort-down phase.',
      highlights: [],
      compared: []
    });
    
    let k = n - 1;
    while (k > 0) {
      // Exchange root with last element
      steps.push({
        type: 'swap',
        heap: [...heapArr],
        sorted: [...sortedResult],
        explanation: `Swapping root (${heapArr[0]}) with the last element (${heapArr[k]}).`,
        highlights: [0, k],
        compared: []
      });
      
      // Perform swap
      [heapArr[0], heapArr[k]] = [heapArr[k], heapArr[0]];
      
      steps.push({
        type: 'extract',
        heap: [...heapArr],
        sorted: [heapArr[k], ...sortedResult],
        explanation: `Extracted ${heapArr[k]} from the heap and added to the sorted array.`,
        highlights: [k],
        compared: []
      });
      
      sortedResult.unshift(heapArr[k]);
      
      // Sink the new root
      sink(heapArr, 0, k, steps);
      k--;
    }
    
    // Final state
    steps.push({
      type: 'complete',
      heap: [...heapArr],
      sorted: [heapArr[0], ...sortedResult],
      explanation: 'Heap sort complete! The array is now sorted in ascending order.',
      highlights: [],
      compared: []
    });
    
    operations.current = steps;
    setTotalSteps(steps.length);
  };
  
  // Sink operation
  const sink = (arr, k, n, steps) => {
    while (2*k + 1 < n) {
      let j = 2*k + 1; // Left child
      
      // Compare left and right children
      if (j + 1 < n) {
        steps.push({
          type: 'compare',
          heap: [...arr],
          sorted: [],
          explanation: `Comparing left child (${arr[j]}) with right child (${arr[j+1]}).`,
          highlights: [k],
          compared: [j, j+1]
        });
        
        if (arr[j] < arr[j+1]) {
          j++;
          steps.push({
            type: 'select',
            heap: [...arr],
            sorted: [],
            explanation: `Right child (${arr[j]}) is larger, so we'll compare it with the parent.`,
            highlights: [k],
            compared: [j]
          });
        } else {
          steps.push({
            type: 'select',
            heap: [...arr],
            sorted: [],
            explanation: `Left child (${arr[j]}) is larger or equal, so we'll compare it with the parent.`,
            highlights: [k],
            compared: [j]
          });
        }
      }
      
      // Compare with parent
      steps.push({
        type: 'compare',
        heap: [...arr],
        sorted: [],
        explanation: `Comparing parent (${arr[k]}) with largest child (${arr[j]}).`,
        highlights: [k],
        compared: [j]
      });
      
      if (arr[k] >= arr[j]) {
        steps.push({
          type: 'no-swap',
          heap: [...arr],
          sorted: [],
          explanation: `Parent (${arr[k]}) is already larger or equal to child (${arr[j]}). No need to swap.`,
          highlights: [k],
          compared: [j]
        });
        break;
      }
      
      steps.push({
        type: 'swap',
        heap: [...arr],
        sorted: [],
        explanation: `Parent (${arr[k]}) is smaller than child (${arr[j]}). Swapping them.`,
        highlights: [k, j],
        compared: []
      });
      
      [arr[k], arr[j]] = [arr[j], arr[k]];
      
      steps.push({
        type: 'moved',
        heap: [...arr],
        sorted: [],
        explanation: `After swap, moving down to index ${j}.`,
        highlights: [j],
        compared: []
      });
      
      k = j;
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      applyStep(nextStep);
      setCurrentStep(nextStep);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      applyStep(prevStep);
      setCurrentStep(prevStep);
    }
  };
  
  const applyStep = (stepIndex) => {
    const step = operations.current[stepIndex];
    setHeapArray(step.heap);
    setSortedArray(step.sorted);
    setHighlightNodes(step.highlights || []);
    setComparedNodes(step.compared || []);
    setExplanation(step.explanation);
    
    if (step.type === 'phase-change') {
      if (step.explanation.includes('heapify')) {
        setPhase('heapify');
      } else if (step.explanation.includes('sort-down')) {
        setPhase('sort');
      }
    } else if (step.type === 'complete') {
      setPhase('completed');
    }
    
    // Add to log only for significant steps
    if (['swap', 'extract', 'phase-change', 'complete'].includes(step.type)) {
      setLogs(prev => [...prev, step.explanation]);
    }
  };
  
  const startVisualization = () => {
    if (currentStep === totalSteps - 1) {
      // If at the end, restart
      applyStep(0);
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };
  
  const pauseVisualization = () => {
    setIsPlaying(false);
  };
  
  const restartVisualization = () => {
    applyStep(0);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  // Binary Heap Tree Visualization
  const TreeNode = ({ value, index, level, maxLevel }) => {
    const isHighlighted = highlightNodes.includes(index);
    const isCompared = comparedNodes.includes(index);
    const isCompleted = phase === 'completed';
    
    const getNodeColor = () => {
      if (isHighlighted) return COLORS.highlight;
      if (isCompared) return COLORS.compared;
      if (isCompleted) return COLORS.completed;
      return COLORS.normal;
    };
    
    const left = index * 2 + 1;
    const right = index * 2 + 2;
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold mb-2 relative transform transition-all duration-300 shadow-lg"
          style={{ 
            backgroundColor: getNodeColor(),
            transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
            boxShadow: isHighlighted ? '0 0 15px rgba(249, 115, 22, 0.6)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {value}
          <div className="absolute -bottom-4 text-xs text-gray-600 font-normal">{index}</div>
        </div>
        
        {level < maxLevel && (
          <div className="flex gap-2 md:gap-4 lg:gap-12 mt-6">
            {left < heapArray.length ? (
              <TreeNode 
                value={heapArray[left]} 
                index={left} 
                level={level + 1}
                maxLevel={maxLevel}
              />
            ) : (
              <div className="w-12"></div>
            )}
            
            {right < heapArray.length ? (
              <TreeNode 
                value={heapArray[right]} 
                index={right} 
                level={level + 1}
                maxLevel={maxLevel}
              />
            ) : (
              <div className="w-12"></div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const getMaxLevel = () => {
    return Math.min(3, Math.floor(Math.log2(heapArray.length + 1)));
  };
  
  // Phase Indicator
  const PhaseIndicator = () => {
    const phases = [
      { id: 'initial', label: 'Initial', color: 'bg-blue-500' },
      { id: 'heapify', label: 'Heapify', color: 'bg-orange-500' },
      { id: 'sort', label: 'Sort', color: 'bg-purple-500' },
      { id: 'completed', label: 'Completed', color: 'bg-green-500' }
    ];
    
    return (
      <div className="flex justify-center space-x-1">
        {phases.map((p, index) => (
          <div 
            key={p.id} 
            className={`flex flex-col items-center ${index > 0 ? 'ml-1' : ''}`}
          >
            <div className={`h-2 w-16 rounded-full ${phase === p.id ? p.color : 'bg-gray-200'}`}></div>
            <span className={`text-xs mt-1 ${phase === p.id ? 'font-medium' : 'text-gray-500'}`}>
              {p.label}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gradient-to-br from-blue-50 to-purple-50" style={{ 
      background: 'bg-gradient-to-br from-blue-50 to-purple-50',
      fontFamily: '"Inter", "Poppins", sans-serif'
    }}>
      <Navbar />
      {/* Header */}
      <header className="py-4 bg-white bg-opacity-90 shadow-md backdrop-filter backdrop-blur-sm mt-15">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Heap Sort Visualization
          </h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Control Panel - Sticky at top under header */}
        <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-xl p-4 mb-6 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
            {/* Controls */}
            <div className="flex items-center space-x-3 justify-center md:justify-start md:w-1/3">
              <button 
                onClick={restartVisualization}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                disabled={isPlaying}
                title="Restart"
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={handlePreviousStep}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200"
                disabled={currentStep <= 0 || isPlaying}
                title="Previous Step"
              >
                <ChevronLeft size={20} />
              </button>
              {!isPlaying ? (
                <button 
                  onClick={startVisualization}
                  className="p-3 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors duration-200"
                  disabled={currentStep >= totalSteps - 1}
                  title="Play Animation"
                >
                  <Play size={24} />
                </button>
              ) : (
                <button 
                  onClick={pauseVisualization}
                  className="p-3 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors duration-200"
                  title="Pause Animation"
                >
                  <Pause size={24} />
                </button>
              )}
              <button 
                onClick={handleNextStep}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200"
                disabled={currentStep >= totalSteps - 1 || isPlaying}
                title="Next Step"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            {/* Step Indicator & Speed */}
            <div className="flex flex-col items-center justify-center md:w-1/3 space-y-2">
              <PhaseIndicator />
              <div className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps - 1}
              </div>
            </div>
            
            {/* Speed Control */}
            <div className="flex items-center justify-center md:justify-end md:w-1/3 space-x-2">
              <span className="text-sm text-gray-600">Slow</span>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={2200 - speed}
                onChange={(e) => setSpeed(2200 - parseInt(e.target.value))}
                className="w-32 accent-blue-500"
              />
              <span className="text-sm text-gray-600">Fast</span>
            </div>
          </div>
        </div>
        
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-4 md:col-span-2 flex items-center">
            <div className="flex-1 flex items-center space-x-2 w-full">
              <Database size={20} className="text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter numbers separated by commas"
                className="flex-1 p-2 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleArrayInput()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Set Array
            </button>
            <button 
              onClick={generateRandomArray}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <Shuffle size={18} className="mr-2" />
              Random
            </button>
          </div>
        </div>
        
        {/* Tree and Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tree Visualization */}
          <div className="lg:col-span-2 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Heap Visualization
            </h2>
            <div className="flex justify-center pt-4 pb-8 overflow-x-auto min-h-52">
              {heapArray.length > 0 && (
                <TreeNode 
                  value={heapArray[0]} 
                  index={0} 
                  level={0}
                  maxLevel={getMaxLevel()}
                />
              )}
            </div>
          </div>
          
          {/* Explanation */}
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Explanation
            </h2>
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50 bg-opacity-60 min-h-40 flex items-center justify-center">
              <p className="text-center text-gray-800">{explanation}</p>
            </div>
          </div>
        </div>
        
        {/* Array Representations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Heap Array */}
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h3 className="font-medium mb-4 text-center text-gray-700">Heap Array</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {heapArray.map((value, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-lg shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: highlightNodes.includes(index) ? COLORS.highlight : 
                                      comparedNodes.includes(index) ? COLORS.compared : 
                                      phase === 'completed' ? COLORS.completed : COLORS.normal,
                      color: 'white',
                      transform: highlightNodes.includes(index) || comparedNodes.includes(index) ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: highlightNodes.includes(index) ? '0 0 15px rgba(249, 115, 22, 0.6)' : 
                                 comparedNodes.includes(index) ? '0 0 15px rgba(168, 85, 247, 0.6)' : 
                                 '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{index}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sorted Array */}
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h3 className="font-medium mb-4 text-center text-gray-700">Sorted Array</h3>
            <div className="flex flex-wrap justify-center gap-3 min-h-12">
              {sortedArray.length === 0 ? (
                <div className="text-gray-400 py-6">Elements will appear here after sorting</div>
              ) : (
                sortedArray.map((value, index) => (
                  <div 
                    key={index}
                    className="w-14 h-14 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 animate-fadeIn"
                    style={{
                      backgroundColor: COLORS.completed,
                      color: 'white'
                    }}
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Logs */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Operation Log
            </h2>
            <div className="border border-gray-100 rounded-lg p-4 max-h-40 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Operations will be logged here...</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="p-2 rounded-lg border-l-4 border-blue-400 bg-blue-50 bg-opacity-40 transition-all duration-300">
                      <span className="text-gray-500 text-sm font-medium mr-2">{index + 1}.</span> {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.normal }}></div>
              <span className="text-sm">Normal Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.highlight }}></div>
              <span className="text-sm">Selected Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.compared }}></div>
              <span className="text-sm">Being Compared</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS.completed }}></div>
              <span className="text-sm">Completed</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
    
  );
}