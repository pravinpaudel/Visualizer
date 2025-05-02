import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Play, Pause, RefreshCw, Info } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function KruskalVisualization() {
  // Graph data
  const [graph, setGraph] = useState({
    nodes: [
      { id: 'A', x: 100, y: 100 },
      { id: 'B', x: 250, y: 50 },
      { id: 'C', x: 400, y: 100 },
      { id: 'D', x: 100, y: 250 },
      { id: 'E', x: 250, y: 300 },
      { id: 'F', x: 400, y: 250 }
    ],
    edges: [
      { id: 1, source: 'A', target: 'B', weight: 4 },
      { id: 2, source: 'A', target: 'D', weight: 3 },
      { id: 3, source: 'B', target: 'C', weight: 5 },
      { id: 4, source: 'B', target: 'E', weight: 9 },
      { id: 5, source: 'C', target: 'F', weight: 8 },
      { id: 6, source: 'D', target: 'E', weight: 7 },
      { id: 7, source: 'E', target: 'F', weight: 2 },
      { id: 8, source: 'B', target: 'D', weight: 6 },
      { id: 9, source: 'C', target: 'E', weight: 1 }
    ]
  });

  // Algorithm state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // milliseconds
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [mst, setMst] = useState([]);
  
  // Timer reference for animation
  const timerRef = useRef(null);

  // Generate the algorithm steps
  useEffect(() => {
    // Sort edges by weight
    const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    
    const steps = [];
    const mstEdges = [];
    const disjointSet = {};
    
    // Initialize disjoint sets with each node in its own set
    graph.nodes.forEach(node => {
      disjointSet[node.id] = node.id;
    });
    
    // Find function for disjoint-set
    const find = (node) => {
      if (disjointSet[node] !== node) {
        disjointSet[node] = find(disjointSet[node]);
      }
      return disjointSet[node];
    };
    
    // Union function for disjoint-set
    const union = (node1, node2) => {
      disjointSet[find(node1)] = find(node2);
    };
    
    // Initial step
    steps.push({
      currentEdge: null,
      priorityQueue: [...sortedEdges],
      mst: [],
      message: "Start Kruskal's algorithm with all edges sorted by weight.",
      disjointSet: {...disjointSet}
    });
    
    // Process each edge
    sortedEdges.forEach(edge => {
      const sourceParent = find(edge.source);
      const targetParent = find(edge.target);
      
      const stepQueue = steps[steps.length - 1].priorityQueue.filter(e => e.id !== edge.id);
      const stepMst = [...steps[steps.length - 1].mst];
      
      if (sourceParent !== targetParent) {
        // No cycle, add to MST
        union(edge.source, edge.target);
        stepMst.push(edge);
        steps.push({
          currentEdge: edge,
          priorityQueue: stepQueue,
          mst: stepMst,
          message: `Add edge ${edge.source}-${edge.target} (weight: ${edge.weight}) to MST as it doesn't create a cycle.`,
          disjointSet: {...disjointSet},
          addToMST: true
        });
      } else {
        // Would create a cycle, skip
        steps.push({
          currentEdge: edge,
          priorityQueue: stepQueue,
          mst: stepMst,
          message: `Skip edge ${edge.source}-${edge.target} (weight: ${edge.weight}) as it would create a cycle.`,
          disjointSet: {...disjointSet},
          addToMST: false
        });
      }
    });
    
    // Final step
    steps.push({
      currentEdge: null,
      priorityQueue: [],
      mst: steps[steps.length - 1].mst,
      message: "Algorithm complete! The Minimum Spanning Tree has been found.",
      disjointSet: {...disjointSet},
      complete: true
    });
    
    setAlgorithmSteps(steps);
    setMst(steps[0].mst);
  }, [graph]);

  // Handle animation
  useEffect(() => {
    if (isPlaying && currentStep < algorithmSteps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prevStep => prevStep + 1);
        setMst(algorithmSteps[currentStep + 1].mst);
      }, animationSpeed);
    } else if (currentStep >= algorithmSteps.length - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, algorithmSteps, animationSpeed]);

  // Controls
  const handleNext = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
      setMst(algorithmSteps[currentStep + 1].mst);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
      setMst(algorithmSteps[currentStep - 1].mst);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMst(algorithmSteps[0].mst);
  };

  const handleSpeedChange = (e) => {
    setAnimationSpeed(2000 - e.target.value); // invert for intuitive speed
  };

  // Node and edge rendering functions
  const renderNode = (node, index) => {
    return (
      <g key={node.id}>
        <circle 
          cx={node.x} 
          cy={node.y} 
          r={20} 
          fill="#4f46e5" 
          className="stroke-2 stroke-white"
        />
        <text 
          x={node.x} 
          y={node.y} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="white" 
          fontSize={14} 
          fontWeight="bold"
        >
          {node.id}
        </text>
      </g>
    );
  };

  const renderEdge = (edge, index) => {
    const source = graph.nodes.find(node => node.id === edge.source);
    const target = graph.nodes.find(node => node.id === edge.target);
    
    if (!source || !target) return null;
    
    const step = algorithmSteps[currentStep];
    const isCurrentEdge = step && step.currentEdge && step.currentEdge.id === edge.id;
    const isInMST = mst.some(e => e.id === edge.id);
    const isRejected = step && step.currentEdge && step.currentEdge.id === edge.id && step.addToMST === false;
    
    let strokeColor = "#9ca3af"; // default gray
    let strokeWidth = 2;
    
    if (isInMST) {
      strokeColor = "#059669"; // green for MST
      strokeWidth = 3;
    } else if (isCurrentEdge) {
      strokeColor = isRejected ? "#dc2626" : "#3b82f6"; // red if rejected, blue if being considered
      strokeWidth = 3;
    }
    
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    return (
      <g key={edge.id}>
        <line 
          x1={source.x} 
          y1={source.y} 
          x2={target.x} 
          y2={target.y} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth}
        />
        <circle 
          cx={midX} 
          cy={midY} 
          r={12} 
          fill="white" 
          stroke={strokeColor} 
          strokeWidth={1}
        />
        <text 
          x={midX} 
          y={midY} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize={10}
          fontWeight="medium"
        >
          {edge.weight}
        </text>
      </g>
    );
  };

  // Priority Queue display
  const renderPriorityQueue = () => {
    if (!algorithmSteps.length || currentStep >= algorithmSteps.length) return null;
    
    const queue = algorithmSteps[currentStep].priorityQueue;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
          Priority Queue <span className="text-xs ml-2 bg-gray-100 px-2 py-1 rounded">{queue.length} edges</span>
        </h3>
        <div className="overflow-y-auto max-h-48">
          {queue.length === 0 ? (
            <div className="text-gray-500 italic">Queue is empty</div>
          ) : (
            <div className="space-y-2">
              {queue.map((edge, index) => (
                <div 
                  key={edge.id} 
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="font-medium">
                    {edge.source}-{edge.target}
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                    Weight: {edge.weight}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Message display
  const renderMessage = () => {
    if (!algorithmSteps.length || currentStep >= algorithmSteps.length) return null;
    
    const step = algorithmSteps[currentStep];
    let messageClass = "bg-blue-50 border-blue-200";
    
    if (step.addToMST === true) {
      messageClass = "bg-green-50 border-green-200";
    } else if (step.addToMST === false) {
      messageClass = "bg-red-50 border-red-200";
    } else if (step.complete) {
      messageClass = "bg-purple-50 border-purple-200";
    }
    
    return (
      <div className={`p-4 rounded-lg border ${messageClass}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Info size={20} className="text-gray-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Step {currentStep} of {algorithmSteps.length - 1}
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              {step.message}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar />

      <div className="max-w-6xl mx-auto mt-20">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold text-indigo-500">Kruskal's Algorithm Visualization</h1>
          <p className="mt-2 text-gray-600">
            An interactive tool to visualize the step-by-step execution of Kruskal's algorithm for finding a Minimum Spanning Tree.
          </p>
        </div>
    
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Visualization */}
          <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Graph Visualization</h2>
            <div className="relative" style={{ height: "400px" }}>
              <svg width="100%" height="100%" viewBox="0 0 500 350">
                {/* Render edges first so they're under the nodes */}
                {graph.edges.map(renderEdge)}
                {graph.nodes.map(renderNode)}
              </svg>
            </div>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Regular Edge</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">MST Edge</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Current Edge</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Rejected Edge</span>
              </div>
            </div>
          </div>
          
          {/* Sidebar with Priority Queue and Status */}
          <div className="space-y-6">

            {/* Controls Panel */}
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <button 
              onClick={handleReset}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              title="Reset"
            >
              <RefreshCw size={20} />
            </button>
            
            <button 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`p-2 rounded-full ${currentStep === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              title="Previous Step"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={handlePlayPause}
              className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentStep === algorithmSteps.length - 1}
              className={`p-2 rounded-full ${currentStep === algorithmSteps.length - 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              title="Next Step"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Speed:</span>
              <input 
                type="range" 
                min="0" 
                max="1900" 
                value={2000 - animationSpeed} 
                onChange={handleSpeedChange}
                className="w-20"
              />
            </div>
          </div>
        

            {/* Priority Queue */}
            {renderPriorityQueue()}
            
            {/* Message/Status */}
            {renderMessage()}
            
            {/* MST Info */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Minimum Spanning Tree</h3>
              <div className="space-y-2">
                {mst.length === 0 ? (
                  <div className="text-gray-500 italic">No edges selected yet</div>
                ) : (
                  <>
                    <div className="font-medium">Selected Edges:</div>
                    <div className="space-y-2">
                      {mst.map(edge => (
                        <div key={edge.id} className="flex justify-between bg-green-50 p-2 rounded">
                          <span>{edge.source}-{edge.target}</span>
                          <span className="font-medium">Weight: {edge.weight}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span>Total MST Weight:</span>
                        <span className="font-bold">
                          {mst.reduce((sum, edge) => sum + edge.weight, 0)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Algorithm Explanation */}
        <div className="mt-8 mb-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">About Kruskal's Algorithm</h2>
          <div className="prose max-w-none">
            <p>
              Kruskal's algorithm is a greedy algorithm that finds a minimum spanning tree for a connected weighted graph. It finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.
            </p>
            <h3 className="text-lg font-medium mt-4">Algorithm Steps:</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Sort all edges in non-decreasing order of their weight.</li>
              <li>Initialize a result set to be empty.</li>
              <li>For each edge in the sorted list:
                <ul className="list-disc pl-6 mt-1">
                  <li>If adding this edge doesn't form a cycle in the result set, add it to the result.</li>
                  <li>Otherwise, discard this edge.</li>
                </ul>
              </li>
              <li>The result set forms a Minimum Spanning Tree.</li>
            </ol>
            <p className="mt-4">
              The algorithm uses a disjoint-set data structure to detect cycles. In this visualization, nodes that share the same parent in the disjoint-set are already connected in the MST, so adding an edge between them would create a cycle.
            </p>
          </div>
        </div>
      </div>
        <Footer />
    </div>
  );
}