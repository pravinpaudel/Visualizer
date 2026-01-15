import { useState, useEffect, useRef } from 'react';
import { useAnimationControls } from '../components/useAnimationControls';
import { ChevronRight, ChevronLeft, RefreshCw, Play, Pause, SkipForward, SkipBack, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Constants for visualization
const ANIMATION_SPEEDS = [2000, 1000, 500, 250, 100];
const DEFAULT_ARRAY_SIZE = 10;

export default function QuickSortVisualizer() {
  // State variables
  const [array, setArray] = useState([]);
  const [sortingSteps, setSortingSteps] = useState([]);
  // Animation controls abstraction
  const {
    currentStep,
    setCurrentStep,
    isPlaying: isSorting,
    togglePlay,
    speedSlider,
    setSpeedSlider,
    animationSpeed,
    handleStep
  } = useAnimationControls(sortingSteps.length, undefined, ANIMATION_SPEEDS[2]);
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [message, setMessage] = useState("Press 'Start Sorting' to begin");

  // Refs
  const intervalRef = useRef(null);
  const treeRef = useRef(null);

  // Generate random array of given size
  const generateRandomArray = (size) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setSortingSteps([]);
    setCurrentStep(0);
    setMessage("Press 'Start Sorting' to begin");
    return newArray;
  };

  // Initialize array on component mount
  useEffect(() => {
    generateRandomArray(arraySize);
  }, [arraySize]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Track sorting steps when array changes
  useEffect(() => {
    if (array.length > 0) {
      const steps = [];
      const initialTree = {
        id: 'root',
        array: [...array],
        lo: 0,
        hi: array.length - 1,
        pivot: null,
        depth: 0,
        children: []
      };
      
      const arrayCopy = [...array];
      quickSortWithSteps(arrayCopy, 0, arrayCopy.length - 1, steps, initialTree);
      
      // Make sure the tree structure is properly cloned for each step
      steps.forEach(step => {
        if (!step.treeNodeId) {
          step.treeNodeId = 'root';
        }
      });
      
      setSortingSteps(steps);
    }
  }, [array]);

  // Update the message based on current step
  useEffect(() => {
    if (sortingSteps.length > 0 && currentStep < sortingSteps.length) {
      setMessage(sortingSteps[currentStep].message);
    }
  }, [currentStep, sortingSteps]);

  // QuickSort algorithm with step tracking
  const quickSortWithSteps = (arr, lo, hi, steps, treeNode) => {
    // Create a deepcopy function for our tree structure
    const deepCopyTree = (tree) => {
      if (!tree) return null;
      
      const copy = {...tree};
      copy.array = [...tree.array];
      
      if (tree.children && tree.children.length > 0) {
        copy.children = tree.children.map(child => deepCopyTree(child));
      } else {
        copy.children = [];
      }
      
      return copy;
    };
    
    // Base case: single element or empty array
    if (hi <= lo) {
      treeNode.message = `Subarray [${lo}...${hi}] has ${hi - lo + 1} element(s). No sorting needed.`;
      
      steps.push({
        array: [...arr],
        lo,
        hi,
        message: treeNode.message,
        i: -1,
        j: -1,
        pivot: lo,
        partitionComplete: false,
        tree: deepCopyTree(treeNode),
        treeNodeId: treeNode.id
      });
      return;
    }
    
    const pivot = lo;
    treeNode.message = `Starting partition for subarray [${lo}...${hi}]. Pivot chosen: ${arr[pivot]} at index ${pivot}`;
    
    steps.push({
      array: [...arr],
      lo,
      hi,
      message: treeNode.message,
      i: lo,
      j: hi + 1,
      pivot,
      partitionComplete: false,
      tree: deepCopyTree(treeNode),
      treeNodeId: treeNode.id
    });
    
    // Partition
    let i = lo;
    let j = hi + 1;
    
    while (true) {
      // Find item on left to swap
      while (arr[++i] < arr[pivot]) {
        if (i === hi) break;
        
        const message = `Left pointer i moved to ${i} (value ${arr[i]}), looking for element >= pivot (${arr[pivot]})`;
        treeNode.message = message;
        
        steps.push({
          array: [...arr],
          lo,
          hi,
          message,
          i,
          j,
          pivot,
          partitionComplete: false,
          tree: deepCopyTree(treeNode),
          treeNodeId: treeNode.id
        });
      }
      
      const leftStopMessage = `Left pointer i stopped at ${i} (value ${arr[i]} ≥ pivot value ${arr[pivot]})`;
      treeNode.message = leftStopMessage;
      
      steps.push({
        array: [...arr],
        lo,
        hi,
        message: leftStopMessage,
        i,
        j,
        pivot,
        partitionComplete: false,
        tree: deepCopyTree(treeNode),
        treeNodeId: treeNode.id
      });
      
      // Find item on right to swap
      while (arr[pivot] < arr[--j]) {
        if (j === lo) break;
        
        const message = `Right pointer j moved to ${j} (value ${arr[j]}), looking for element <= pivot (${arr[pivot]})`;
        treeNode.message = message;
        
        steps.push({
          array: [...arr],
          lo,
          hi,
          message,
          i,
          j,
          pivot,
          partitionComplete: false,
          tree: deepCopyTree(treeNode),
          treeNodeId: treeNode.id
        });
      }
      
      const rightStopMessage = `Right pointer j stopped at ${j} (value ${arr[j]} ≤ pivot value ${arr[pivot]})`;
      treeNode.message = rightStopMessage;
      
      steps.push({
        array: [...arr],
        lo,
        hi,
        message: rightStopMessage,
        i,
        j,
        pivot,
        partitionComplete: false,
        tree: deepCopyTree(treeNode),
        treeNodeId: treeNode.id
      });
      
      // Check if pointers cross
      if (i >= j) {
        const crossMessage = `Pointers crossed (i=${i} ≥ j=${j}). Partition complete. Swapping pivot (${arr[pivot]}) with j (${arr[j]})`;
        treeNode.message = crossMessage;
        
        steps.push({
          array: [...arr],
          lo,
          hi,
          message: crossMessage,
          i,
          j,
          pivot,
          partitionComplete: false,
          tree: deepCopyTree(treeNode),
          treeNodeId: treeNode.id
        });
        break;
      }
      
      // Swap elements
      const swapMessage = `Swapping elements: arr[i]=${arr[i]} and arr[j]=${arr[j]}`;
      treeNode.message = swapMessage;
      
      steps.push({
        array: [...arr],
        lo,
        hi,
        message: swapMessage,
        i,
        j,
        pivot,
        swap: [i, j],
        partitionComplete: false,
        tree: deepCopyTree(treeNode),
        treeNodeId: treeNode.id
      });
      
      [arr[i], arr[j]] = [arr[j], arr[i]];
      
      const swappedMessage = `Swapped elements: arr[i]=${arr[i]} and arr[j]=${arr[j]}`;
      treeNode.message = swappedMessage;
      
      steps.push({
        array: [...arr],
        lo,
        hi,
        message: swappedMessage,
        i,
        j,
        pivot,
        partitionComplete: false,
        tree: deepCopyTree(treeNode),
        treeNodeId: treeNode.id
      });
    }
    
    // Swap pivot with j
    const pivotSwapMessage = `Swapping pivot element (${arr[pivot]}) with element at j=${j} (${arr[j]})`;
    treeNode.message = pivotSwapMessage;
    
    steps.push({
      array: [...arr],
      lo,
      hi,
      message: pivotSwapMessage,
      i,
      j,
      pivot,
      swap: [pivot, j],
      partitionComplete: false,
      tree: deepCopyTree(treeNode),
      treeNodeId: treeNode.id
    });
    
    [arr[pivot], arr[j]] = [arr[j], arr[pivot]];
    
    const partitionCompleteMessage = `Partition complete. Pivot (${arr[j]}) is now at position ${j}. Everything to the left is ≤ pivot, everything to the right is ≥ pivot.`;
    treeNode.message = partitionCompleteMessage;
    treeNode.pivot = j;
    treeNode.partitioned = true;
    
    steps.push({
      array: [...arr],
      lo,
      hi,
      message: partitionCompleteMessage,
      i,
      j,
      pivot: j,
      partitionComplete: true,
      tree: deepCopyTree(treeNode),
      treeNodeId: treeNode.id
    });
    
    // Create left child node if needed
    if (j > lo) {
      const leftChild = {
        id: `${treeNode.id}-left`,
        array: arr.slice(lo, j),
        lo: lo,
        hi: j - 1,
        pivot: null,
        depth: treeNode.depth + 1,
        children: [],
        message: `Recursively sorting left subarray [${lo}...${j-1}]`
      };
      treeNode.children.push(leftChild);
      
      steps.push({
        array: [...arr],
        lo: lo,
        hi: j - 1,
        message: `Recursively sorting left subarray [${lo}...${j-1}]`,
        i: -1,
        j: -1,
        pivot: -1,
        partitionComplete: true,
        tree: deepCopyTree(treeNode),
        treeNodeId: leftChild.id
      });
      
      // Recursively sort left part
      quickSortWithSteps(arr, lo, j - 1, steps, leftChild);
    }
    
    // Create right child node if needed
    if (j < hi) {
      const rightChild = {
        id: `${treeNode.id}-right`,
        array: arr.slice(j + 1, hi + 1),
        lo: j + 1,
        hi: hi,
        pivot: null,
        depth: treeNode.depth + 1,
        children: [],
        message: `Recursively sorting right subarray [${j+1}...${hi}]`
      };
      treeNode.children.push(rightChild);
      
      steps.push({
        array: [...arr],
        lo: j + 1,
        hi: hi,
        message: `Recursively sorting right subarray [${j+1}...${hi}]`,
        i: -1,
        j: -1,
        pivot: -1,
        partitionComplete: true,
        tree: deepCopyTree(treeNode),
        treeNodeId: rightChild.id
      });
      
      // Recursively sort right part
      quickSortWithSteps(arr, j + 1, hi, steps, rightChild);
    }
  };

  // Step navigation
  const nextStep = () => handleStep('next');
  const prevStep = () => handleStep('prev');
  const restart = () => {
    if (isSorting) togglePlay();
    setCurrentStep(0);
  };
  const handleSpeedChange = (e) => {
    setSpeedSlider(Number(e.target.value) * 25);
  };
  
  const changeArraySize = (delta) => {
    pauseSorting();
    const newSize = Math.max(3, Math.min(20, arraySize + delta));
    setArraySize(newSize);
  };
  
  const refreshArray = () => {
    pauseSorting();
    generateRandomArray(arraySize);
  };

  // Render Tree node
  const renderTreeNode = (node, currentNodeId) => {
    if (!node) return null;
    
    // Determine if this node is active (part of the current step's path)
    const isActive = currentNodeId && (node.id === currentNodeId || node.id.startsWith(currentNodeId + '-'));
    
    // Get current step's node ID or its parent to determine the active path
    const currentStepNodeId = currentStepData?.tree?.id || '';
    
    // Check if this node is in the current step path
    const isInCurrentPath = node.id === currentStepNodeId || 
                           currentStepNodeId.startsWith(node.id) || 
                           node.id.startsWith(currentStepNodeId);
    
    // Render the node
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className={`mb-1 p-2 rounded-lg border ${isInCurrentPath ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300'}`}>
          <div className="text-xs text-gray-500 mb-1">Node: {node.id}</div>
          {node.array && (
            <div className="flex justify-center space-x-1 mb-1">
              {node.array.map((val, idx) => {
                const isPivot = node.pivot !== null && (node.lo + idx) === node.pivot;
                return (
                  <div 
                    key={idx} 
                    className={`w-6 h-6 flex items-center justify-center text-xs rounded 
                              ${isPivot ? 'bg-purple-300 font-bold' : 'bg-gray-200'}`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-xs">[{node.lo}...{node.hi}]</div>
          {node.pivot !== null && (
            <div className="text-xs text-purple-700">Pivot: {node.array[node.pivot - node.lo]} @ {node.pivot}</div>
          )}
        </div>
        
        {node.children && node.children.length > 0 && (
          <>
            <div className="w-px h-6 bg-gray-400"></div>
            {node.children.length === 2 && <div className="w-8 h-px bg-gray-400"></div>}
            <div className="flex flex-row space-x-6">
              {node.children.map(child => (
                <div key={child.id} className="flex flex-col items-center">
                  {renderTreeNode(child, currentStepNodeId)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Get current step data
  const currentStepData = sortingSteps[currentStep] || {
    array: array,
    lo: 0,
    hi: array.length - 1,
    message: "Press 'Start Sorting' to begin",
    i: -1,
    j: -1,
    pivot: 0,
    partitionComplete: false,
    tree: null
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quick Sort Visualization</h1>
            
            <div className="flex space-x-2">
              <button 
                onClick={refreshArray}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                title="Generate New Array"
              >
                <RefreshCw size={20} />
              </button>
              
              <button 
                onClick={() => changeArraySize(-1)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                title="Decrease Array Size"
                disabled={arraySize <= 3}
              >
                <Minus size={20} />
              </button>
              
              <button 
                onClick={() => changeArraySize(1)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                title="Increase Array Size"
                disabled={arraySize >= 20}
              >
                <Plus size={20} />
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                <span className="text-xs mr-2">Speed:</span>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={Math.round(speedSlider / 25)}
                  onChange={handleSpeedChange}
                  className="w-24"
                  title={`Animation Speed: ${['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'][Math.round(speedSlider / 25)]}`}
                />
              </div>
              
              <button 
                onClick={restart}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                title="Restart"
              >
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={prevStep}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                title="Previous Step"
                disabled={currentStep === 0}
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={togglePlay}
                className={`bg-${isSorting ? 'red' : 'green'}-500 hover:bg-${isSorting ? 'red' : 'green'}-600 text-white rounded-lg p-2`}
                title={isSorting ? 'Pause' : 'Start Sorting'}
              >
                {isSorting ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button 
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                title="Next Step"
                disabled={currentStep >= sortingSteps.length - 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Message Panel */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-gray-800">{message}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-600">
                Step: {currentStep + 1} / {sortingSteps.length}
              </p>
              <div className="text-sm text-gray-600">
                Speed: {['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'][animationSpeed]}
              </div>
            </div>
          </div>
          
          {/* Array Visualization */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Array Visualization</h2>
            <div className="flex justify-center mb-4">
              <div className="flex items-end">
                {currentStepData.array.map((value, idx) => {
                  // Determine cell styling based on current step data
                  let cellClass = "flex flex-col items-center mx-1";
                  let barClass = "bg-blue-500";
                  
                  // Highlight pivot element
                  if (idx === currentStepData.pivot) {
                    barClass = "bg-purple-500";
                  }
                  
                  // Highlight subarray
                  if (idx >= currentStepData.lo && idx <= currentStepData.hi) {
                    cellClass += " border-b-2 border-black";
                  }
                  
                  // Highlight i and j pointers
                  if (idx === currentStepData.i) {
                    cellClass += " bg-green-100";
                  }
                  if (idx === currentStepData.j) {
                    cellClass += " bg-red-100";
                  }
                  
                  // Highlight elements being swapped
                  if (currentStepData.swap && (idx === currentStepData.swap[0] || idx === currentStepData.swap[1])) {
                    barClass = "bg-yellow-500 animate-pulse";
                  }
                  
                  // Calculate bar height based on value
                  const height = Math.max(20, (value / 100) * 200);
                  
                  return (
                    <div key={idx} className={cellClass}>
                      <div 
                        className={`w-8 ${barClass} rounded-t-sm transition-all duration-300`} 
                        style={{ height: `${height}px` }}
                      ></div>
                      <div className="text-xs mt-1">{value}</div>
                      <div className="text-xs text-gray-500">{idx}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center text-sm gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 mr-1"></div>
                <span>Pivot</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 mr-1"></div>
                <span>Left Pointer (i)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 mr-1"></div>
                <span>Right Pointer (j)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 mr-1"></div>
                <span>Swapping</span>
              </div>
            </div>
          </div>
          
          {/* Recursive Tree Visualization */}
          <div className="mb-8 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-2">Recursive Call Tree</h2>
            <div className="flex justify-center p-4 min-h-64 overflow-x-auto" ref={treeRef}>
              {currentStepData.tree && (
                <div className="flex flex-col items-center min-w-full">
                  {renderTreeNode(currentStepData.tree, currentStepData.treeNodeId)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        <Footer />
    </div>
  );
}