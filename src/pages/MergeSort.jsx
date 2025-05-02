import { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, StepForward, StepBack, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Main Merge Sort Visualizer Component
export default function MergeSortVisualizer() {
  // Initial array state
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [mergeSteps, setMergeSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(true);
  const animationRef = useRef(null);

  // Generate a new random array
  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 4) + 5; // 5-8 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
  };

  // Reset the visualization
  const resetVisualization = () => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // Main function to calculate all merge sort steps
  useEffect(() => {
    const steps = [];
    
    const mergeSortWithTracking = (arr, start, end, depth) => {
      if (start >= end) {
        return arr.slice(start, start + 1);
      }

      const mid = Math.floor((start + end) / 2);
      
      // Add a step for the division
      steps.push({
        type: 'divide',
        array: [...arr],
        start,
        mid,
        end,
        depth,
        message: `Dividing array [${arr.slice(start, end + 1).join(', ')}] at index ${mid}`
      });

      // Recursively sort left half
      const left = mergeSortWithTracking(arr, start, mid, depth + 1);
      
      // Recursively sort right half
      const right = mergeSortWithTracking(arr, mid + 1, end, depth + 1);

      // Merge the sorted halves
      const merged = [];
      let leftIndex = 0, rightIndex = 0;
      
      // Add a step before merging
      steps.push({
        type: 'before-merge',
        array: [...arr],
        left: [...left],
        right: [...right],
        leftOriginal: start,
        rightOriginal: mid + 1,
        start,
        mid,
        end,
        depth,
        message: `Merging left [${left.join(', ')}] and right [${right.join(', ')}]`
      });
      
      // Track merge comparisons
      while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
          merged.push(left[leftIndex]);
          steps.push({
            type: 'compare',
            array: [...arr],
            left: [...left],
            right: [...right],
            leftIndex,
            rightIndex,
            result: 'left',
            merged: [...merged],
            start,
            mid,
            end,
            depth,
            message: `Comparing ${left[leftIndex]} ≤ ${right[rightIndex]}: Choose ${left[leftIndex]} from left array`
          });
          leftIndex++;
        } else {
          merged.push(right[rightIndex]);
          steps.push({
            type: 'compare',
            array: [...arr],
            left: [...left],
            right: [...right],
            leftIndex,
            rightIndex,
            result: 'right',
            merged: [...merged],
            start,
            mid,
            end,
            depth,
            message: `Comparing ${left[leftIndex]} > ${right[rightIndex]}: Choose ${right[rightIndex]} from right array`
          });
          rightIndex++;
        }
      }

      // Add remaining elements from left array
      while (leftIndex < left.length) {
        merged.push(left[leftIndex]);
        steps.push({
          type: 'remaining',
          array: [...arr],
          left: [...left],
          right: [...right],
          leftIndex,
          rightIndex,
          result: 'left',
          merged: [...merged],
          start,
          mid,
          end,
          depth,
          message: `Adding remaining element ${left[leftIndex]} from left array`
        });
        leftIndex++;
      }

      // Add remaining elements from right array
      while (rightIndex < right.length) {
        merged.push(right[rightIndex]);
        steps.push({
          type: 'remaining',
          array: [...arr],
          left: [...left],
          right: [...right],
          leftIndex,
          rightIndex,
          result: 'right',
          merged: [...merged],
          start,
          mid,
          end,
          depth,
          message: `Adding remaining element ${right[rightIndex]} from right array`
        });
        rightIndex++;
      }

      // Update the original array with merged values
      const newArr = [...arr];
      for (let i = 0; i < merged.length; i++) {
        newArr[start + i] = merged[i];
      }
      
      // Final state after this merge operation
      steps.push({
        type: 'after-merge',
        array: [...newArr],
        start,
        mid,
        end,
        merged: [...merged],
        depth,
        message: `Merged subarray: [${merged.join(', ')}]`
      });
      
      return merged;
    };

    // Start the merge sort process and tracking
    const arrayCopy = [...array];
    const sortedArray = mergeSortWithTracking(arrayCopy, 0, arrayCopy.length - 1, 0);
    
    // // Add final sorted state
    steps.push({
      type: 'complete',
      array: [...sortedArray],
      message: 'Array sorted completely!'
    });

    setMergeSteps(steps);
    resetVisualization();
  }, [array]);

  // Move to next step
  const nextStep = () => {
    if (currentStepIndex < mergeSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Play/pause animation
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle animation with useEffect
  useEffect(() => {
    if (isPlaying && currentStepIndex < mergeSteps.length - 1) {
      animationRef.current = setTimeout(() => {
        nextStep();
      }, animationSpeed);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, mergeSteps.length, animationSpeed]);

  // Current step for rendering
  const currentStep = mergeSteps[currentStepIndex] || { array: array, message: 'Initial array' };

  // Determine tree height based on array length
  const treeHeight = Math.ceil(Math.log2(array.length)) + 1;

  return (
    <div>
    <Navbar />
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 space-y-6 bg-gray-50 rounded-lg">
      <h1 className="text-3xl font-bold text-indigo-700">Merge Sort Visualization</h1>
      
      {/* Controls */}
      <div className="w-full p-4 bg-white rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={generateRandomArray} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Generate New Array
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Speed:</span>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={2100 - animationSpeed}
                onChange={(e) => setAnimationSpeed(2100 - parseInt(e.target.value))}
                className="w-32"
              />
            </div>
            
            <button 
              onClick={resetVisualization}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Reset"
            >
              <RotateCcw size={24} className="text-indigo-600" />
            </button>
            
            <button 
              onClick={prevStep}
              disabled={currentStepIndex <= 0}
              className={`p-2 rounded-full ${currentStepIndex <= 0 ? 'text-gray-400' : 'text-indigo-600 hover:bg-gray-100'} transition-colors`}
              title="Previous Step"
            >
              <StepBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? 
                <PauseCircle size={30} className="text-indigo-600" /> : 
                <PlayCircle size={30} className="text-indigo-600" />
              }
            </button>
            
            <button 
              onClick={nextStep}
              disabled={currentStepIndex >= mergeSteps.length - 1}
              className={`p-2 rounded-full ${currentStepIndex >= mergeSteps.length - 1 ? 'text-gray-400' : 'text-indigo-600 hover:bg-gray-100'} transition-colors`}
              title="Next Step"
            >
              <StepForward size={24} />
            </button>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${mergeSteps.length ? (currentStepIndex + 1) / mergeSteps.length * 100 : 0}%` 
            }}
          />
        </div>
      </div>
      
      {/* Main visualization area */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Array visualization */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Array Visualization</h2>
          <ArrayVisualization step={currentStep} originalArray={array} />
          
          {/* Merge process visualization */}
          {currentStep.type && ['compare', 'remaining', 'before-merge', 'after-merge'].includes(currentStep.type) && (
            <MergeProcessVisualization step={currentStep} />
          )}
        </div>
        
        {/* Explanation and recursive tree */}
        <div className="md:col-span-1 space-y-4">
          {/* Explanation panel */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">Explanation</h2>
              <button 
                onClick={() => setExplanationExpanded(!explanationExpanded)}
                className="p-1 rounded hover:bg-gray-100"
              >
                {explanationExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            {explanationExpanded && (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-700">{currentStep.message}</p>
                
                {currentStep.type === 'divide' && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Divide step: splitting the problem into smaller subproblems</p>
                  </div>
                )}
                
                {currentStep.type === 'before-merge' && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>About to merge two sorted subarrays</p>
                  </div>
                )}
                
                {currentStep.type === 'compare' && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Comparing elements to determine correct order</p>
                  </div>
                )}
                
                {currentStep.type === 'after-merge' && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Merge complete: subarray is now sorted</p>
                  </div>
                )}
                
                {currentStep.type === 'complete' && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Merge sort complete - the entire array is now sorted</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Recursive tree visualization */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recursion Tree</h2>
            <RecursionTreeVisualization 
              step={currentStep} 
              array={array} 
              treeHeight={treeHeight}
            />
          </div>
          
          {/* Progress stats */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Progress</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded-md">
                <p className="text-gray-500 text-sm">Step</p>
                <p className="font-medium">{currentStepIndex + 1} / {mergeSteps.length}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <p className="text-gray-500 text-sm">Type</p>
                <p className="font-medium capitalize">{currentStep.type || 'Initial'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <Footer />
    </div>
  );
}

// Array Visualization Component
function ArrayVisualization({ step, originalArray }) {
  const maxValue = Math.max(...originalArray) * 1.2;
  
  return (
    <div className="mb-8">
      <div className="flex items-end justify-center h-64 space-x-2">
        {step.array.map((value, index) => {
          // Determine element styling based on the current step
          let bgColor = 'bg-blue-500';
          let textColor = 'text-white';
          
          // Highlight elements based on the current step type
          if (step.type === 'divide') {
            if (index >= step.start && index <= step.end) {
              bgColor = 'bg-indigo-500';
              if (index === step.mid) bgColor = 'bg-red-600';
            } else {
              bgColor = 'bg-gray-300';
            }
          } else if (['compare', 'remaining', 'before-merge', 'after-merge'].includes(step.type)) {
            if (index >= step.start && index <= step.end) {
              bgColor = 'bg-green-500';
            } else {
              bgColor = 'bg-gray-300';
            }
          } else if (step.type === 'complete') {
            bgColor = 'bg-green-500';
          }
          
          return (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <div
                className={`${bgColor} w-12 rounded-t-md transition-all duration-300 flex items-end justify-center ${textColor} font-semibold`}
                style={{ height: `${(value / maxValue) * 200}px` }}
              >
                {value}
              </div>
              <div className="text-xs mt-1 text-gray-500">{index}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Merge Process Visualization Component
function MergeProcessVisualization({ step }) {
  if (!['compare', 'remaining', 'before-merge', 'after-merge'].includes(step.type)) {
    return null;
  }
  
  return (
    <div className="mt-8 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Merge Process</h3>
      
      {/* Left and Right subarrays */}
      {(step.type === 'compare' || step.type === 'remaining' || step.type === 'before-merge') && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Left Subarray</p>
            <div className="flex space-x-2">
              {step.left.map((value, idx) => (
                <div
                  key={`left-${idx}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    step.type === 'compare' && step.leftIndex === idx && step.result === 'left'
                      ? 'bg-green-500 text-white'
                      : step.type === 'compare' && step.leftIndex === idx
                      ? 'bg-yellow-300'
                      : step.type === 'remaining' && step.leftIndex === idx
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-100'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Right Subarray</p>
            <div className="flex space-x-2">
              {step.right.map((value, idx) => (
                <div
                  key={`right-${idx}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    step.type === 'compare' && step.rightIndex === idx && step.result === 'right'
                      ? 'bg-green-500 text-white'
                      : step.type === 'compare' && step.rightIndex === idx
                      ? 'bg-yellow-300'
                      : step.type === 'remaining' && step.rightIndex === idx
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-100'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Merged array */}
      {(step.type === 'compare' || step.type === 'remaining' || step.type === 'after-merge') && step.merged && (
        <div className="p-3 bg-indigo-50 rounded-md">
          <p className="text-sm text-gray-500 mb-2">Merged Result</p>
          <div className="flex flex-wrap space-x-2">
            {step.merged.map((value, idx) => (
              <div
                key={`merged-${idx}`}
                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                  (step.type === 'compare' || step.type === 'remaining') && 
                  idx === step.merged.length - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-100'
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Recursion Tree Visualization Component
function RecursionTreeVisualization({ step, array, treeHeight }) {
  const renderTreeNode = (start, end, depth, currentLevel = 0) => {
    if (currentLevel > depth || start > end) {
      return null;
    }
    
    const isHighlighted = 
      step.type && 
      step.start === start && 
      step.end === end && 
      step.depth === currentLevel;
    
    const mid = Math.floor((start + end) / 2);
    const subArray = array.slice(start, end + 1);
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className={`px-2 py-1 mb-2 rounded-md text-xs border ${
            isHighlighted 
              ? 'bg-indigo-100 border-indigo-500' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          [{subArray.join(', ')}]
        </div>
        
        {start < end && currentLevel < depth && (
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gray-300"></div>
              {renderTreeNode(start, mid, depth, currentLevel + 1)}
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gray-300"></div>
              {renderTreeNode(mid + 1, end, depth, currentLevel + 1)}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {renderTreeNode(0, array.length - 1, treeHeight, 0)}
      </div>
    </div>
  );
}