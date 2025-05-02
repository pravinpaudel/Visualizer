import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function QuickSortVisualizer() {
  const [array, setArray] = useState([]);
  const [pivotIdx, setPivotIdx] = useState(null);
  const [leftIdx, setLeftIdx] = useState(null);
  const [rightIdx, setRightIdx] = useState(null);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arraySize, setArraySize] = useState(10);
  const [animationHistory, setAnimationHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortComplete, setSortComplete] = useState(false);
  
  // Generate a new random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setPivotIdx(null);
    setLeftIdx(null);
    setRightIdx(null);
    setSortedIndices([]);
    setCurrentIndices([]);
    setAnimationHistory([]);
    setCurrentStep(0);
    setSortComplete(false);
  };
  
  // Initialize the array when component mounts
  useEffect(() => {
    generateArray();
  }, [arraySize]);
  
  // Capture the animation steps for quicksort using Hoare partition scheme
  const quickSort = (arr, start = 0, end = arr.length - 1, history = [], depth = 0) => {
    // Add visualization step to show current subarray being processed
    history.push({
      array: [...arr],
      pivotIdx: null,
      leftIdx: null,
      rightIdx: null,
      sortedIndices: [...sortedIndices],
      currentIndices: [],
      subArrayRange: [start, end],
      message: `Starting quicksort on subarray [${start}...${end}]`,
      depth: depth
    });

    if (start >= end) {
      if (start === end) {
        history.push({
          array: [...arr],
          pivotIdx: null,
          leftIdx: null,
          rightIdx: null,
          sortedIndices: [...Array(arr.length).keys()].filter(i => i <= start && i >= start),
          currentIndices: [start],
          subArrayRange: [start, end],
          message: `Element at index ${start} is in its sorted position.`,
          depth: depth
        });
      }
      return arr;
    }
    
    // Choose pivot (first element)
    const pivotValue = arr[start];
    
    history.push({
      array: [...arr],
      pivotIdx: start,
      leftIdx: null,
      rightIdx: null,
      sortedIndices: [...sortedIndices],
      currentIndices: [start],
      subArrayRange: [start, end],
      message: `Selected pivot: ${pivotValue} (index ${start})`,
      depth: depth
    });
    
    // Hoare partition scheme
    const partitionIndex = partition(arr, start, end, history, pivotValue, depth);
    
    // Recursively sort the subarrays
    quickSort(arr, start, partitionIndex - 1, history, depth + 1);
    quickSort(arr, partitionIndex + 1, end, history, depth + 1);
    
    return arr;
  };
  
  // Hoare partition scheme
  const partition = (arr, lo, hi, history, pivotValue, depth) => {
    let i = lo;
    let j = hi + 1;
    
    history.push({
      array: [...arr],
      pivotIdx: lo,
      leftIdx: i,
      rightIdx: j,
      sortedIndices: [...sortedIndices],
      currentIndices: [lo],
      subArrayRange: [lo, hi],
      message: `Starting Hoare partition with pivot ${pivotValue} at index ${lo}`,
      depth: depth
    });
    
    while (true) {
      // Move i right while elements are less than pivot
      do {
        i++;
        if (i <= hi) {
          history.push({
            array: [...arr],
            pivotIdx: lo,
            leftIdx: i,
            rightIdx: j === hi + 1 ? null : j,
            sortedIndices: [...sortedIndices],
            currentIndices: [i, lo],
            subArrayRange: [lo, hi],
            message: `Left pointer (i) at index ${i}, comparing ${arr[i]} with pivot ${pivotValue}`,
            depth: depth
          });
        }
      } while (i <= hi && arr[i] < pivotValue);
      
      // Move j left while elements are greater than pivot
      do {
        j--;
        if (j >= lo) {
          history.push({
            array: [...arr],
            pivotIdx: lo,
            leftIdx: i,
            rightIdx: j,
            sortedIndices: [...sortedIndices],
            currentIndices: [j, lo],
            subArrayRange: [lo, hi],
            message: `Right pointer (j) at index ${j}, comparing ${arr[j]} with pivot ${pivotValue}`,
            depth: depth
          });
        }
      } while (j >= lo && arr[j] > pivotValue);
      
      // If pointers crossed, break
      if (i >= j) {
        history.push({
          array: [...arr],
          pivotIdx: lo,
          leftIdx: i,
          rightIdx: j,
          sortedIndices: [...sortedIndices],
          currentIndices: [i, j],
          subArrayRange: [lo, hi],
          message: `Pointers crossed or met (i=${i}, j=${j}), partition complete`,
          depth: depth
        });
        break;
      }
      
      // Otherwise, swap elements at i and j
      history.push({
        array: [...arr],
        pivotIdx: lo,
        leftIdx: i,
        rightIdx: j,
        sortedIndices: [...sortedIndices],
        currentIndices: [i, j],
        subArrayRange: [lo, hi],
        message: `Swapping elements: ${arr[i]} at index ${i} with ${arr[j]} at index ${j}`,
        depth: depth
      });
      
      [arr[i], arr[j]] = [arr[j], arr[i]];
      
      history.push({
        array: [...arr],
        pivotIdx: lo,
        leftIdx: i,
        rightIdx: j,
        sortedIndices: [...sortedIndices],
        currentIndices: [i, j],
        subArrayRange: [lo, hi],
        message: `After swap: ${arr[i]} at index ${i}, ${arr[j]} at index ${j}`,
        depth: depth
      });
    }
    
    // Swap pivot (at lo) with element at j
    history.push({
      array: [...arr],
      pivotIdx: lo,
      leftIdx: null,
      rightIdx: j,
      sortedIndices: [...sortedIndices],
      currentIndices: [lo, j],
      subArrayRange: [lo, hi],
      message: `Moving pivot ${pivotValue} to its final position at index ${j}`,
      depth: depth
    });
    
    [arr[lo], arr[j]] = [arr[j], arr[lo]];
    
    history.push({
      array: [...arr],
      pivotIdx: j,
      leftIdx: null,
      rightIdx: null,
      sortedIndices: [...sortedIndices, j],
      currentIndices: [j],
      subArrayRange: [lo, hi],
      message: `Pivot ${pivotValue} is now in its sorted position at index ${j}`,
      depth: depth
    });
    
    return j;
  };
  
  // Start the quicksort visualization
  const startSort = () => {
    const arrayCopy = [...array];
    const history = [];
    quickSort(arrayCopy, 0, arrayCopy.length - 1, history);
    
    // Add final state showing entire array as sorted
    history.push({
      array: arrayCopy,
      pivotIdx: null,
      leftIdx: null,
      rightIdx: null,
      sortedIndices: [...Array(arrayCopy.length).keys()],
      currentIndices: [],
      message: "Sorting complete!"
    });
    
    setAnimationHistory(history);
    setCurrentStep(0);
    setSortComplete(false);
    setIsPlaying(true);
  };
  
  // Handle playing and pausing the animation
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < animationHistory.length) {
      timer = setTimeout(() => {
        const step = animationHistory[currentStep];
        setArray(step.array);
        setPivotIdx(step.pivotIdx);
        setLeftIdx(step.leftIdx);
        setRightIdx(step.rightIdx);
        setSortedIndices(step.sortedIndices || []);
        setCurrentIndices(step.currentIndices || []);
        
        if (currentStep === animationHistory.length - 1) {
          setSortComplete(true);
          setIsPlaying(false);
        } else {
          setCurrentStep(currentStep + 1);
        }
      }, animationSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, animationHistory, animationSpeed]);
  
  // Navigation functions
  const stepForward = () => {
    if (currentStep < animationHistory.length - 1) {
      const step = animationHistory[currentStep + 1];
      setArray(step.array);
      setPivotIdx(step.pivotIdx);
      setLeftIdx(step.leftIdx);
      setRightIdx(step.rightIdx);
      setSortedIndices(step.sortedIndices || []);
      setCurrentIndices(step.currentIndices || []);
      setCurrentStep(currentStep + 1);
      
      if (currentStep + 1 === animationHistory.length - 1) {
        setSortComplete(true);
      }
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      const step = animationHistory[currentStep - 1];
      setArray(step.array);
      setPivotIdx(step.pivotIdx);
      setLeftIdx(step.leftIdx);
      setRightIdx(step.rightIdx);
      setSortedIndices(step.sortedIndices || []);
      setCurrentIndices(step.currentIndices || []);
      setCurrentStep(currentStep - 1);
      setSortComplete(false);
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const restart = () => {
    setCurrentStep(0);
    setSortComplete(false);
    if (animationHistory.length > 0) {
      const step = animationHistory[0];
      setArray(step.array);
      setPivotIdx(step.pivotIdx);
      setLeftIdx(step.leftIdx);
      setRightIdx(step.rightIdx);
      setSortedIndices(step.sortedIndices || []);
      setCurrentIndices(step.currentIndices || []);
    }
  };
  
  // Determine bar color based on its state
  const getBarColor = (index) => {
    if (pivotIdx === index) return 'bg-yellow-500'; // Pivot
    if (sortedIndices.includes(index)) return 'bg-green-500'; // Sorted elements
    if (leftIdx === index) return 'bg-blue-500'; // Current comparison (left pointer)
    if (rightIdx === index) return 'bg-purple-500'; // Current comparison (right pointer)
    if (currentIndices.includes(index)) return 'bg-red-500'; // Current element being processed
    return 'bg-gray-400'; // Default 
  };
  
  // Calculate bar height relative to max value
  const getBarHeight = (value) => {
    const maxValue = Math.max(...array);
    return `${(value / maxValue) * 70}%`;
  };
  
  return (
    <div>
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quick Sort Visualizer</h1>
      
      <div className="w-full mb-8">
        <div className="flex justify-between items-end h-64 bg-gray-100 p-4 rounded">
          {array.map((value, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center justify-end mx-1 w-full"
            >
              <div 
                className={`${getBarColor(index)} rounded-t w-full transition-all duration-300`}
                style={{ 
                  height: getBarHeight(value),
                  // Add a background highlight for the current subarray being processed
                  boxShadow: animationHistory.length > 0 && 
                            currentStep < animationHistory.length && 
                            animationHistory[currentStep].subArrayRange && 
                            index >= animationHistory[currentStep].subArrayRange[0] && 
                            index <= animationHistory[currentStep].subArrayRange[1]
                            ? '0 0 10px 4px rgba(255, 165, 0, 0.5)' 
                            : 'none' 
                }}
              ></div>
              <div className={`text-xs mt-1 font-medium px-2 py-1 rounded ${
                pivotIdx === index ? 'bg-yellow-100 border border-yellow-500' : 
                sortedIndices.includes(index) ? 'bg-green-100 border border-green-500' :
                leftIdx === index ? 'bg-blue-100 border border-blue-500' :
                rightIdx === index ? 'bg-purple-100 border border-purple-500' :
                currentIndices.includes(index) ? 'bg-red-100 border border-red-500' : ''
              }`}>{value}</div>
              <div className={`text-xs px-2 py-1 mt-1 rounded ${
                pivotIdx === index ? 'bg-yellow-100 border border-yellow-500' : 
                sortedIndices.includes(index) ? 'bg-green-100 border border-green-500' :
                leftIdx === index ? 'bg-blue-100 border border-blue-500' :
                rightIdx === index ? 'bg-purple-100 border border-purple-500' :
                currentIndices.includes(index) ? 'bg-red-100 border border-red-500' : ''
              }`}>{index}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4 w-full bg-gray-100 p-4 rounded">
        <div className="flex justify-between mb-4">
          <div className="flex items-center flex-wrap">
            <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
            <span className="mr-4 text-sm">Pivot</span>
            
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            <span className="mr-4 text-sm">Left Pointer</span>
            
            <div className="w-4 h-4 bg-purple-500 mr-2"></div>
            <span className="mr-4 text-sm">Right Pointer</span>
            
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="mr-4 text-sm">Sorted</span>
            
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="mr-4 text-sm">Current Element</span>
            
            <div className="w-4 h-4 bg-orange-200 mr-2 border border-orange-500"></div>
            <span className="text-sm">Current Subarray</span>
          </div>
        </div>
        
        <div className="h-16 bg-white p-2 rounded overflow-y-auto text-sm">
          {animationHistory.length > 0 && currentStep < animationHistory.length 
            ? (
              <div>
                {animationHistory[currentStep].depth > 0 && (
                  <div className="text-xs text-gray-500 mb-1">
                    Recursion depth: {animationHistory[currentStep].depth} | 
                    Subarray: [{animationHistory[currentStep].subArrayRange[0]}...{animationHistory[currentStep].subArrayRange[1]}]
                  </div>
                )}
                <div>{animationHistory[currentStep].message}</div>
              </div>
            ) 
            : "Click 'Start Sort' to begin visualization"}
        </div>
      </div>
      
      <div className="flex justify-between w-full mb-6">
        <div className="flex items-center">
          <label className="mr-2 text-sm">Array Size:</label>
          <select 
            value={arraySize} 
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="border p-1 text-sm rounded"
            disabled={isPlaying || animationHistory.length > 0}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="mr-2 text-sm">Speed:</label>
          <select 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="border p-1 text-sm rounded"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Medium</option>
            <option value={500}>Fast</option>
            <option value={200}>Very Fast</option>
          </select>
        </div>
        
        <button 
          onClick={generateArray}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          disabled={isPlaying}
        >
          Generate New Array
        </button>
      </div>
      
      <div className="flex space-x-4 w-full justify-center">
        <button
          onClick={restart}
          disabled={animationHistory.length === 0 || currentStep === 0}
          className={`px-4 py-2 rounded ${
            animationHistory.length === 0 || currentStep === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Restart
        </button>
        
        <button
          onClick={stepBackward}
          disabled={currentStep === 0 || isPlaying}
          className={`px-4 py-2 rounded ${
            currentStep === 0 || isPlaying
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous Step
        </button>
        
        <button
          onClick={togglePlayPause}
          disabled={animationHistory.length === 0 || sortComplete}
          className={`px-4 py-2 rounded ${
            animationHistory.length === 0 || sortComplete
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        
        <button
          onClick={stepForward}
          disabled={
            currentStep === animationHistory.length - 1 || 
            isPlaying || 
            animationHistory.length === 0
          }
          className={`px-4 py-2 rounded ${
            currentStep === animationHistory.length - 1 || 
            isPlaying || 
            animationHistory.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next Step
        </button>
        
        <button
          onClick={startSort}
          disabled={isPlaying || sortComplete}
          className={`px-4 py-2 rounded ${
            isPlaying || sortComplete || animationHistory.length > 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {animationHistory.length > 0 ? "Restart Sort" : "Start Sort"}
        </button>
      </div>
      
      {sortComplete && (
        <div className="mt-4 text-green-600 font-bold">
          Sorting completed successfully!
        </div>
      )}
      
      {animationHistory.length > 0 && (
        <div className="mt-4 text-sm">
          Step {currentStep + 1} of {animationHistory.length}
        </div>
      )}
    </div>
    
      <Footer />
    </div>
  );
}