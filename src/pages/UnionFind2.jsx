import { useState, useEffect, useRef, useMemo } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Main App Component
export default function UnionFindVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [parent, setParent] = useState([]);
  const [size, setSize] = useState([]);
  const [operations, setOperations] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [showLabels, setShowLabels] = useState(true);
  const [speed, setSpeed] = useState(1500); // milliseconds between steps
  const animationRef = useRef(null);
  
  // Node positioning with automatic layout
  const calculateNodePositions = (parentArray, nodeCount = 10) => {
    // Create a copy of parent array to modify
    const positions = [];
    const roots = [];
    const rootCounts = {};
    
    // First identify all roots
    for (let i = 0; i < parentArray.length; i++) {
      if (parentArray[i] === i) {
        roots.push(i);
        rootCounts[i] = 0;
      }
    }
    
    // Count number of nodes in each tree
    for (let i = 0; i < parentArray.length; i++) {
      let root = i;
      while (root !== parentArray[root]) {
        root = parentArray[root];
      }
      if (root in rootCounts) {
        rootCounts[root]++;
      }
    }
    
    // Calculate horizontal spacing for roots
    const rootSpacing = 700 / (roots.length + 1);
    const rootPositions = {};
    
    roots.forEach((root, index) => {
      rootPositions[root] = {
        x: (index + 1) * rootSpacing,
        y: 80
      };
      positions[root] = rootPositions[root];
    });
    
    // Position children recursively
    const positionChildren = (node, level, parentX, siblingCount = 1, siblingIndex = 0) => {
      const children = [];
      
      // Find all direct children
      for (let i = 0; i < parentArray.length; i++) {
        if (parentArray[i] === node && i !== node) {
          children.push(i);
        }
      }
      
      const childSpacing = Math.min(120, 600 / Math.max(siblingCount, 1));
      const startX = parentX - ((siblingCount - 1) * childSpacing) / 2;
      
      // Position this node
      if (positions[node] === undefined) {
        positions[node] = {
          x: startX + siblingIndex * childSpacing,
          y: 100 + level * 100
        };
      }
      
      // Position children
      children.forEach((child, childIndex) => {
        positionChildren(child, level + 1, positions[node].x, children.length, childIndex);
      });
    };
    
    // Position all root trees
    roots.forEach(root => {
      positionChildren(root, 0, rootPositions[root].x);
    });
    
    // Handle any nodes that might not have been positioned
    for (let i = 0; i < nodeCount; i++) {
      if (!positions[i]) {
        positions[i] = {
          x: 350 + (Math.random() * 100 - 50),
          y: 200 + (Math.random() * 100 - 50)
        };
      }
    }
    
    return positions;
  };
  
  // Initialize the visualization
  useEffect(() => {
    initializeVisualization();
  }, []);
  
  // Play animation effect
  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= totalSteps - 1) {
        setIsPlaying(false);
        return;
      }
      
      animationRef.current = setTimeout(() => {
        handleNextStep();
      }, speed);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, totalSteps, speed]);
  
  // Update visualization based on current step
  useEffect(() => {
    if (operations.length === 0 || currentStep < 0) return;
    
    const currentOperation = operations[currentStep];
    updateVisualization(currentOperation);
  }, [currentStep, operations]);
  
  const initializeVisualization = () => {
    // Create 10 nodes (0-9)
    const initialParent = Array.from({ length: 10 }, (_, i) => i);
    const initialSize = Array.from({ length: 10 }, () => 1);
    
    // Calculate initial node positions
    const initialPositions = calculateNodePositions(initialParent);
    const initialNodes = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      ...initialPositions[i]
    }));
    
    setNodes(initialNodes);
    setParent(initialParent);
    setSize(initialSize);
    
    // Generate a sequence of union operations for visualization
    const unionOperations = generateUnionOperations();
    setOperations(unionOperations);
    setTotalSteps(unionOperations.length);
    
    // Set initial explanation
    setExplanation("Welcome to Union-Find Visualization! Click 'Play' or 'Next Step' to begin.");
  };
  
  const generateUnionOperations = () => {
    // Generate a series of union operations that demonstrate path compression
    const operations = [
      { type: 'initial', description: 'Initial state: Each node is in its own set.' },
      { type: 'union', a: 0, b: 1, description: 'Union(0, 1): Merge sets containing 0 and 1.' },
      { type: 'union', a: 2, b: 3, description: 'Union(2, 3): Merge sets containing 2 and 3.' },
      { type: 'union', a: 4, b: 5, description: 'Union(4, 5): Merge sets containing 4 and 5.' },
      { type: 'union', a: 6, b: 7, description: 'Union(6, 7): Merge sets containing 6 and 7.' },
      { type: 'union', a: 0, b: 2, description: 'Union(0, 2): Merge sets containing 0 and 2.' },
      { type: 'union', a: 4, b: 6, description: 'Union(4, 6): Merge sets containing 4 and 6.' },
      { type: 'union', a: 0, b: 4, description: 'Union(0, 4): Merge sets containing 0 and 4. This will create a larger tree!' },
      { type: 'find', a: 7, description: 'Find(7): Find the root of the set containing 7. This will perform path compression!' },
      { type: 'find', a: 5, description: 'Find(5): Find the root of the set containing 5. Look for path compression!' },
      { type: 'union', a: 8, b: 9, description: 'Union(8, 9): Merge sets containing 8 and 9.' },
      { type: 'union', a: 0, b: 8, description: 'Union(0, 8): Merge sets containing 0 and 8.' },
      { type: 'find', a: 9, description: 'Find(9): Find the root of the set containing 9 with path compression.' }
    ];
    
    return operations;
  };
  
  const updateVisualization = (operation) => {
    // Based on operation type, update the visualization
    setExplanation(operation.description || '');
    setHighlightedNodes([]);
    setHighlightedEdges([]);
    
    switch (operation.type) {
      case 'initial':
        // Update edges to reflect parent array
        updateEdgesFromParent();
        break;
        
      case 'union':
        handleUnionOperation(operation.a, operation.b);
        break;
        
      case 'find':
        handleFindOperation(operation.a);
        break;
        
      default:
        break;
    }
  };
  
  const handleUnionOperation = (a, b) => {
    // Find roots of both sets
    const rootA = findRoot(a);
    const rootB = findRoot(b);
    
    if (rootA === rootB) {
      setExplanation(`Union(${a}, ${b}): Nodes ${a} and ${b} are already in the same set with root ${rootA}.`);
      setHighlightedNodes([a, b, rootA]);
      return;
    }
    
    // Weighted union - attach smaller tree to larger one
    const newParent = [...parent];
    const newSize = [...size];
    
    if (size[rootA] < size[rootB]) {
      // Attach A to B
      newParent[rootA] = rootB;
      newSize[rootB] += newSize[rootA];
      setHighlightedNodes([a, b, rootA, rootB]);
      setExplanation(`Union(${a}, ${b}): Size(${rootA})=${size[rootA]} < Size(${rootB})=${size[rootB]}, so attach tree ${rootA} to ${rootB}.`);
    } else {
      // Attach B to A
      newParent[rootB] = rootA;
      newSize[rootA] += newSize[rootB];
      setHighlightedNodes([a, b, rootA, rootB]);
      setExplanation(`Union(${a}, ${b}): Size(${rootA})=${size[rootA]} >= Size(${rootB})=${size[rootB]}, so attach tree ${rootB} to ${rootA}.`);
    }
    
    setParent(newParent);
    setSize(newSize);
    
    // Recalculate node positions and update
    const newPositions = calculateNodePositions(newParent);
    setNodes(prevNodes => prevNodes.map((node, idx) => ({
      ...node,
      x: newPositions[idx].x,
      y: newPositions[idx].y
    })));
    
    // Update edges to reflect the new parent array
    updateEdgesFromParent();
  };
  
  const handleFindOperation = (a) => {
    const pathToRoot = [];
    let current = a;
    
    // First, trace path to root
    while (current !== parent[current]) {
      pathToRoot.push(current);
      current = parent[current];
    }
    pathToRoot.push(current); // Add the root
    
    // If there's no path compression needed
    if (pathToRoot.length <= 2) {
      setExplanation(`Find(${a}): Node ${a} is already directly connected to its root ${current}.`);
      setHighlightedNodes([a, current]);
      return;
    }
    
    // Perform path compression
    const newParent = [...parent];
    const compressedNodes = [];
    
    for (let i = 0; i < pathToRoot.length - 1; i++) {
      const node = pathToRoot[i];
      if (newParent[node] !== pathToRoot[pathToRoot.length - 1]) {
        compressedNodes.push(node);
        newParent[node] = pathToRoot[pathToRoot.length - 1]; // Point directly to root
      }
    }
    
    setParent(newParent);
    setHighlightedNodes([...pathToRoot]);
    
    if (compressedNodes.length > 0) {
      setExplanation(`Find(${a}): Path compression applied to nodes [${compressedNodes.join(', ')}]. All now directly point to root ${pathToRoot[pathToRoot.length - 1]}.`);
    } else {
      setExplanation(`Find(${a}): Found root ${pathToRoot[pathToRoot.length - 1]}. No path compression needed.`);
    }
    
    // Recalculate node positions and update
    const newPositions = calculateNodePositions(newParent);
    setNodes(prevNodes => prevNodes.map((node, idx) => ({
      ...node,
      x: newPositions[idx].x,
      y: newPositions[idx].y
    })));
    
    // Update edges to reflect the new parent array
    updateEdgesFromParent();
  };
  
  const findRoot = (a) => {
    while (a !== parent[a]) {
      a = parent[a];
    }
    return a;
  };
  
  const updateEdgesFromParent = () => {
    const newEdges = [];
    
    for (let i = 0; i < parent.length; i++) {
      if (i !== parent[i]) { // If not a root
        newEdges.push({
          from: i,
          to: parent[i],
          isHighlighted: highlightedNodes.includes(i) && highlightedNodes.includes(parent[i])
        });
      }
    }
    
    setEdges(newEdges);
  };
  
  // Controls functions
  const startVisualization = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };
  
  const pauseVisualization = () => {
    setIsPlaying(false);
  };
  
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  const restartVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const adjustSpeed = (newSpeed) => {
    setSpeed(newSpeed);
  };
  
  // Custom manual operations
  const [manualUnionA, setManualUnionA] = useState('');
  const [manualUnionB, setManualUnionB] = useState('');
  const [manualFindNode, setManualFindNode] = useState('');
  
  const handleManualUnion = () => {
    if (manualUnionA === '' || manualUnionB === '') return;
    
    const a = parseInt(manualUnionA);
    const b = parseInt(manualUnionB);
    
    if (isNaN(a) || isNaN(b) || a < 0 || a >= parent.length || b < 0 || b >= parent.length) {
      setExplanation("Invalid node numbers. Please enter values between 0 and 9.");
      return;
    }
    
    handleUnionOperation(a, b);
    setManualUnionA('');
    setManualUnionB('');
  };
  
  const handleManualFind = () => {
    if (manualFindNode === '') return;
    
    const a = parseInt(manualFindNode);
    
    if (isNaN(a) || a < 0 || a >= parent.length) {
      setExplanation("Invalid node number. Please enter a value between 0 and 9.");
      return;
    }
    
    handleFindOperation(a);
    setManualFindNode('');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Union-Find with Path Compression</h1>
            
            {/* Visualization controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white border rounded-lg shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-2">Automatic Demo</h2>
                
                {/* Progress indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress: {currentStep} / {totalSteps - 1}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Speed:</span>
                      <select 
                        value={speed}
                        onChange={(e) => adjustSpeed(parseInt(e.target.value))}
                        className="text-sm border rounded p-1"
                        disabled={isPlaying}
                      >
                        <option value={2500}>Slow</option>
                        <option value={1500}>Normal</option>
                        <option value={800}>Fast</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={restartVisualization}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 flex items-center"
                    disabled={isPlaying}
                    title="Restart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-1">Restart</span>
                  </button>
                  <button 
                    onClick={handlePreviousStep}
                    className="p-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200 flex items-center"
                    disabled={currentStep <= 0 || isPlaying}
                    title="Previous Step"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="ml-1">Prev</span>
                  </button>
                  {!isPlaying ? (
                    <button 
                      onClick={startVisualization}
                      className="p-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors duration-200 flex items-center"
                      disabled={currentStep >= totalSteps - 1}
                      title="Play Animation"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="ml-1">Play</span>
                    </button>
                  ) : (
                    <button 
                      onClick={pauseVisualization}
                      className="p-1 rounded bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors duration-200 flex items-center"
                      title="Pause Animation"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="ml-1">Pause</span>
                    </button>
                  )}
                  <button 
                    onClick={handleNextStep}
                    className="p-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200 flex items-center"
                    disabled={currentStep >= totalSteps - 1 || isPlaying}
                    title="Next Step"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="ml-1">Next</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-white border rounded-lg shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-2">Manual Union</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualUnionA}
                    onChange={(e) => setManualUnionA(e.target.value)}
                    placeholder="Node A"
                    className="border rounded w-20 px-2 py-1"
                  />
                  <input
                    type="text"
                    value={manualUnionB}
                    onChange={(e) => setManualUnionB(e.target.value)}
                    placeholder="Node B"
                    className="border rounded w-20 px-2 py-1"
                  />
                  <button
                    onClick={handleManualUnion}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-1 px-3 rounded"
                  >
                    Union
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-white border rounded-lg shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-2">Manual Find</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualFindNode}
                    onChange={(e) => setManualFindNode(e.target.value)}
                    placeholder="Node"
                    className="border rounded w-20 px-2 py-1"
                  />
                  <button
                    onClick={handleManualFind}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-1 px-3 rounded"
                  >
                    Find & Compress
                  </button>
                </div>
              </div>
            </div>
            
            {/* Visualization area */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Tree visualization */}
              <div className="md:col-span-3 bg-gray-50 rounded-lg p-4 h-96 relative overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-70 border border-gray-200 shadow-sm">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700">Disjoint-Set Forest</h2>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showLabels"
                      checked={showLabels}
                      onChange={() => setShowLabels(!showLabels)}
                      className="mr-2"
                    />
                    <label htmlFor="showLabels" className="text-sm text-gray-600">Show Labels</label>
                  </div>
                </div>
                <div className="absolute inset-0 pt-10">
                  <svg width="100%" height="100%" viewBox="0 0 700 400">
                    {/* Draw edges */}
                    {edges.map((edge, index) => (
                      <g key={`edge-${index}`} className="transition-all duration-500">
                        <line
                          x1={nodes[edge.from]?.x}
                          y1={nodes[edge.from]?.y}
                          x2={nodes[edge.to]?.x}
                          y2={nodes[edge.to]?.y}
                          stroke={edge.isHighlighted || highlightedEdges.includes(`${edge.from}-${edge.to}`) ? "#3B82F6" : "#CBD5E1"}
                          strokeWidth={edge.isHighlighted || highlightedEdges.includes(`${edge.from}-${edge.to}`) ? 3 : 2}
                          className="transition-all duration-500"
                        />
                        {/* Arrow for directed edge */}
                        <ArrowMarker 
                          x1={nodes[edge.from]?.x}
                          y1={nodes[edge.from]?.y}
                          x2={nodes[edge.to]?.x}
                          y2={nodes[edge.to]?.y}
                          color={edge.isHighlighted || highlightedEdges.includes(`${edge.from}-${edge.to}`) ? "#3B82F6" : "#CBD5E1"}
                        />
                      </g>
                    ))}
                    
                    {/* Draw nodes */}
                    {nodes.map((node, index) => (
                      <g key={`node-${index}`} className="transition-all duration-500">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={25}
                          fill={highlightedNodes.includes(index) ? "#93C5FD" : "#FFFFFF"}
                          stroke={parent[index] === index ? "#047857" : highlightedNodes.includes(index) ? "#3B82F6" : "#CBD5E1"}
                          strokeWidth={parent[index] === index ? 3 : highlightedNodes.includes(index) ? 3 : 2}
                          className="transition-all duration-500"
                        />
                        <text
                          x={node.x}
                          y={node.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={highlightedNodes.includes(index) ? "#1E40AF" : parent[index] === index ? "#047857" : "#1F2937"}
                          fontSize={16}
                          fontWeight={highlightedNodes.includes(index) || parent[index] === index ? "bold" : "normal"}
                        >
                          {index}
                        </text>
                        {showLabels && (
                          <g>
                            <rect
                              x={node.x + 30}
                              y={node.y - 10}
                              width={48}
                              height={20}
                              rx={4}
                              fill="white"
                              stroke="#E5E7EB"
                            />
                            <text
                              x={node.x + 54}
                              y={node.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="#4B5563"
                              fontSize={12}
                            >
                              p:{parent[index]}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              
              {/* Arrays visualization */}
              <div className="bg-gray-50 rounded-lg p-4 backdrop-filter backdrop-blur-lg bg-opacity-70 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 text-gray-700">Parent Array</h2>
                  <div className="flex flex-wrap">
                    {parent.map((p, idx) => (
                      <div key={`parent-${idx}`} className="flex flex-col items-center m-1">
                        <div className="text-xs text-gray-500 mb-1">idx {idx}</div>
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded border ${
                            highlightedNodes.includes(idx) ? 'bg-blue-100 border-blue-400 text-blue-800' : 
                            idx === p ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                        >
                          {p}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-700">Size Array</h2>
                  <div className="flex flex-wrap">
                    {size.map((s, idx) => (
                      <div key={`size-${idx}`} className="flex flex-col items-center m-1">
                        <div className="text-xs text-gray-500 mb-1">idx {idx}</div>
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded border ${
                            highlightedNodes.includes(idx) ? 'bg-green-100 border-green-400 text-green-800' : 
                            idx === parent[idx] && s > 1 ? 'bg-purple-100 border-purple-400 text-purple-800' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                        >
                          {s}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Explanation box */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <h2 className="text-lg font-semibold mb-2 text-blue-800">Step Explanation</h2>
              <p className="text-blue-900">{explanation}</p>
            </div>
            
            {/* Algorithm explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Union-Find Operations</h2>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-600">Find(x)</h3>
                    <p className="text-sm text-gray-600">Follows parent pointers until it reaches the root. With path compression, it updates each node to point directly to the root.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Union(x, y)</h3>
                    <p className="text-sm text-gray-600">Finds the roots of x and y, then makes one root point to the other. Uses weighted union to keep the tree balanced.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Optimization Techniques</h2>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-600">Path Compression</h3>
                    <p className="text-sm text-gray-600">When using Find(), update each node to point directly to the root, reducing future traversal time.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Weighted Union</h3>
                    <p className="text-sm text-gray-600">Always attach the smaller tree to the larger one to minimize the height of the resulting tree.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// // Helper Components
// function Navbar() {
//   return (
//     <nav className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <span className="text-xl font-bold text-blue-600">Union-Find Visualizer</span>
//           </div>
//           <div className="flex items-center">
//             <span className="text-sm text-gray-600">Algorithm Visualization Tool</span>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// function Footer() {
//   return (
//     <footer className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border-t border-gray-200 py-4">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center text-sm text-gray-500">
//           <p>Union-Find with Path Compression Visualization Tool</p>
//           <p className="mt-1">Created for educational purposes</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

function ArrowMarker({ x1, y1, x2, y2, color }) {
  // Calculate the angle of the line
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  // Calculate point slightly before the end to place arrow
  const nodeRadius = 25; // Same as circle radius
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const ratio = (distance - nodeRadius) / distance;
  
  const arrowX = x1 + (x2 - x1) * ratio;
  const arrowY = y1 + (y2 - y1) * ratio;
  
  // Calculate arrow points
  const arrowSize = 8;
  const arrowPoint1X = arrowX - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowPoint1Y = arrowY - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowPoint2X = arrowX - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowPoint2Y = arrowY - arrowSize * Math.sin(angle + Math.PI / 6);
  
  return (
    <polygon 
      points={`${arrowX},${arrowY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
      fill={color}
    />
  );
}