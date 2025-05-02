import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Settings } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Enhanced graph data with more nodes and connections
const initialGraph = {
  nodes: [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 250, y: 50 },
    { id: 'C', x: 300, y: 200 },
    { id: 'D', x: 200, y: 250 },
    { id: 'E', x: 400, y: 120 },
    { id: 'F', x: 350, y: 300 },
    { id: 'G', x: 150, y: 180 },
    { id: 'H', x: 450, y: 220 }
  ],
  edges: [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'D', weight: 7 },
    { source: 'A', target: 'G', weight: 3 },
    { source: 'B', target: 'C', weight: 3 },
    { source: 'B', target: 'E', weight: 9 },
    { source: 'C', target: 'E', weight: 2 },
    { source: 'C', target: 'H', weight: 8 },
    { source: 'D', target: 'C', weight: 5 },
    { source: 'D', target: 'F', weight: 6 },
    { source: 'D', target: 'G', weight: 2 },
    { source: 'E', target: 'H', weight: 1 },
    { source: 'F', target: 'H', weight: 4 },
    { source: 'G', target: 'F', weight: 5 }
  ]
};

// Colors for visualization
const colors = {
  unvisited: 'bg-gray-200 border-gray-400 fill-opacity-80',
  current: 'bg-green-200 border-green-600 fill-opacity-80',
  visited: 'bg-blue-200 border-blue-500 fill-opacity-80',
  path: 'bg-purple-200 border-purple-600 fill-opacity-80',
  infinity: '∞',
};

export default function DijkstraVisualization() {
  const [graph, setGraph] = useState(initialGraph);
  const [distances, setDistances] = useState({});
  const [previous, setPrevious] = useState({});
  const [nodeStatus, setNodeStatus] = useState({});
  const [currentNode, setCurrentNode] = useState(null);
  const [visualizationSteps, setVisualizationSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [startNode, setStartNode] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [processedEdges, setProcessedEdges] = useState(new Set());
  const animationRef = useRef(null);

  // Initialize the visualization
  useEffect(() => {
    generateVisualizationSteps();
  }, [startNode]);

  // Handle animation playback
  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= totalSteps - 1) {
        setIsPlaying(false);
        return;
      }

      animationRef.current = setTimeout(() => {
        setCurrentStep(prevStep => prevStep + 1);
      }, animationSpeed);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, totalSteps, animationSpeed]);

  // Update visualization based on current step
  useEffect(() => {
    if (currentStep >= 0 && currentStep < visualizationSteps.length) {
      const step = visualizationSteps[currentStep];
      setDistances(step.distances);
      setPrevious(step.previous);
      setNodeStatus(step.nodeStatus);
      setCurrentNode(step.currentNode);
      setExplanation(step.explanation);
      setPriorityQueue(step.priorityQueue || []);
      setProcessedEdges(new Set(step.processedEdges || []));
    } else if (currentStep === -1) {
      // Initial state
      const initialDistances = {};
      const initialNodeStatus = {};
      graph.nodes.forEach(node => {
        initialDistances[node.id] = node.id === startNode ? 0 : Infinity;
        initialNodeStatus[node.id] = node.id === startNode ? 'current' : 'unvisited';
      });
      setDistances(initialDistances);
      setPrevious({});
      setNodeStatus(initialNodeStatus);
      setCurrentNode(startNode);
      setPriorityQueue([{ node: startNode, distance: 0 }]);
      setProcessedEdges(new Set());
      setExplanation('Initialize: Set distance to start node as 0, all others as infinity.');
    }
  }, [currentStep, visualizationSteps]);

  // Generate all steps for Dijkstra's algorithm
  const generateVisualizationSteps = () => {
    const steps = [];
    const nodes = graph.nodes.map(node => node.id);
    const distTo = {};
    const edgeTo = {};
    const visited = new Set();
    const processedEdgesList = new Set();
    
    // Initialize distances and priority queue
    nodes.forEach(node => {
      distTo[node] = node === startNode ? 0 : Infinity;
    });
    
    const queue = [{ node: startNode, distance: 0 }];
    
    const initialStep = {
      distances: { ...distTo },
      previous: { ...edgeTo },
      nodeStatus: nodes.reduce((status, node) => {
        status[node] = node === startNode ? 'current' : 'unvisited';
        return status;
      }, {}),
      currentNode: startNode,
      priorityQueue: [...queue],
      processedEdges: [...processedEdgesList],
      explanation: 'Initialize: Set distance to start node as 0, all others as infinity. Add start node to priority queue.'
    };
    
    steps.push(initialStep);
    
    while (queue.length > 0) {
      // Sort the queue by distance (priority)
      queue.sort((a, b) => a.distance - b.distance);
      
      // Get the node with minimum distance
      const { node: minNode } = queue.shift();
      
      // If already visited, skip
      if (visited.has(minNode)) continue;
      
      // Mark node as visited
      visited.add(minNode);
      
      const nodeStatusAfterVisit = { ...steps[steps.length - 1].nodeStatus };
      Object.keys(nodeStatusAfterVisit).forEach(node => {
        if (node === minNode) {
          nodeStatusAfterVisit[node] = 'visited';
        }
      });
      
      steps.push({
        distances: { ...distTo },
        previous: { ...edgeTo },
        nodeStatus: nodeStatusAfterVisit,
        currentNode: minNode,
        priorityQueue: [...queue],
        processedEdges: [...processedEdgesList],
        explanation: `Visiting node ${minNode} with distance ${distTo[minNode]}. Removed from priority queue.`
      });
      
      // Find all edges from the current node
      const outgoingEdges = graph.edges.filter(edge => edge.source === minNode);
      
      // Relax each edge
      outgoingEdges.forEach(edge => {
        const { target, weight } = edge;
        const newDist = distTo[minNode] + weight;
        
        // Mark this edge as processed
        processedEdgesList.add(`${minNode}-${target}`);
        
        if (newDist < distTo[target]) {
          // Found a better path
          const oldDist = distTo[target];
          distTo[target] = newDist;
          edgeTo[target] = minNode;
          
          // Update priority queue
          const targetIndex = queue.findIndex(item => item.node === target);
          if (targetIndex !== -1) {
            queue[targetIndex].distance = newDist;
          } else {
            queue.push({ node: target, distance: newDist });
          }
          
          const nodeStatusAfterRelax = { ...steps[steps.length - 1].nodeStatus };
          nodeStatusAfterRelax[target] = 'current';
          
          steps.push({
            distances: { ...distTo },
            previous: { ...edgeTo },
            nodeStatus: nodeStatusAfterRelax,
            currentNode: minNode,
            priorityQueue: [...queue],
            processedEdges: [...processedEdgesList],
            explanation: `Relaxing edge ${minNode} → ${target}: Found better path with distance ${newDist} (was ${oldDist === Infinity ? '∞' : oldDist}). Updated priority queue.`
          });
        } else {
          // No improvement
          steps.push({
            distances: { ...distTo },
            previous: { ...edgeTo },
            nodeStatus: { ...steps[steps.length - 1].nodeStatus },
            currentNode: minNode,
            priorityQueue: [...queue],
            processedEdges: [...processedEdgesList],
            explanation: `Relaxing edge ${minNode} → ${target}: Current distance ${distTo[target]} is already optimal (new path would be ${newDist}).`
          });
        }
      });
    }
    
    // Final step - highlight the paths
    const finalNodeStatus = { ...steps[steps.length - 1].nodeStatus };
    for (const node in edgeTo) {
      let current = node;
      while (current !== startNode && current) {
        finalNodeStatus[current] = 'path';
        current = edgeTo[current];
      }
    }
    finalNodeStatus[startNode] = 'path';
    
    steps.push({
      distances: { ...distTo },
      previous: { ...edgeTo },
      nodeStatus: finalNodeStatus,
      currentNode: null,
      priorityQueue: [],
      processedEdges: [...processedEdgesList],
      explanation: 'Algorithm complete! Final shortest paths from start node are highlighted.'
    });
    
    setVisualizationSteps(steps);
    setTotalSteps(steps.length);
    setCurrentStep(-1); // Start at initialization step
  };

  // Control functions
  const restartVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const startVisualization = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(-1);
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
    if (currentStep > -1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const changeSpeed = (newSpeed) => {
    setAnimationSpeed(newSpeed);
  };

  // Helper functions for rendering
  const getNodeColor = (nodeId) => {
    return nodeStatus[nodeId] ? colors[nodeStatus[nodeId]] : colors.unvisited;
  };

  const getEdgeColor = (edge) => {
    const { source, target } = edge;
    const edgeKey = `${source}-${target}`;
    
    // Check if this edge is part of the shortest path
    if (previous[target] === source && nodeStatus[target] === 'path') {
      return 'stroke-purple-600 stroke-2';
    }
    
    // Check if this edge was just relaxed
    if (currentNode === source && nodeStatus[target] === 'current') {
      return 'stroke-green-600 stroke-2';
    }
    
    // Check if edge has been processed
    if (processedEdges.has(edgeKey)) {
      return 'stroke-blue-400';
    }
    
    return 'stroke-gray-400';
  };

  const getEdgeStyle = (edge) => {
    const { source, target } = edge;
    const edgeKey = `${source}-${target}`;
    
    // Confirmed shortest path
    if (previous[target] === source && nodeStatus[target] === 'path') {
      return '';
    }
    
    // Processed edge but not part of shortest path
    if (processedEdges.has(edgeKey)) {
      return 'stroke-dasharray: 5,3';
    }
    
    return '';
  };

  const formatDistance = (dist) => {
    return dist === Infinity ? colors.infinity : dist;
  };

  // Calculate arrow position for directed edges
  const calculateArrowPoints = (edge) => {
    const sourceNode = graph.nodes.find(node => node.id === edge.source);
    const targetNode = graph.nodes.find(node => node.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize and scale to get the direction vector
    const normX = dx / distance;
    const normY = dy / distance;
    
    // Position the arrow slightly before the target node
    const nodeRadius = 25;
    const arrowX = targetNode.x - normX * nodeRadius;
    const arrowY = targetNode.y - normY * nodeRadius;
    
    // Calculate the arrow points
    const arrowLength = 10;
    const arrowWidth = 6;
    
    // Perpendicular vector
    const perpX = -normY;
    const perpY = normX;
    
    // Calculate the three points of the arrow
    const point1 = {
      x: arrowX,
      y: arrowY
    };
    
    const point2 = {
      x: arrowX - arrowLength * normX + arrowWidth * perpX,
      y: arrowY - arrowLength * normY + arrowWidth * perpY
    };
    
    const point3 = {
      x: arrowX - arrowLength * normX - arrowWidth * perpX,
      y: arrowY - arrowLength * normY - arrowWidth * perpY
    };
    
    return `${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      {/* Navigation Panel */}
      <div className="sticky top-16 z-10 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200 shadow-sm p-4 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-indigo-500">Dijkstra's Algorithm Visualization</h1>
            <p className="text-sm text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
          
          {/* Control Buttons */}
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
          
          {/* Speed Control and Settings */}
          <div className="flex items-center space-x-4 md:w-1/3 justify-center md:justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <input 
                type="range" 
                min="200" 
                max="2000" 
                step="100" 
                value={2200 - animationSpeed} 
                onChange={(e) => changeSpeed(2200 - parseInt(e.target.value))}
                className="w-24"
                disabled={isPlaying}
              />
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4 max-w-7xl mx-auto w-full">
       
        {/* Main Graph Visualization */}
        <div className="flex-1 bg-white bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>
          <div className="relative h-96 border border-gray-200 rounded-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 500 400">
              {/* Draw the edges */}
              {graph.edges.map((edge, idx) => {
                const sourceNode = graph.nodes.find(node => node.id === edge.source);
                const targetNode = graph.nodes.find(node => node.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                
                return (
                  <g key={`edge-${idx}`}>
                    <line 
                      x1={sourceNode.x} 
                      y1={sourceNode.y} 
                      x2={targetNode.x} 
                      y2={targetNode.y} 
                      className={`${getEdgeColor(edge)} transition-all duration-300`}
                      style={{ strokeDasharray: getEdgeStyle(edge) }} 
                    />
                    <polygon 
                      points={calculateArrowPoints(edge)} 
                      className={`${getEdgeColor(edge).replace('stroke', 'fill')} transition-all duration-300`} 
                    />
                    <text 
                      x={(sourceNode.x + targetNode.x) / 2 + 5} 
                      y={(sourceNode.y + targetNode.y) / 2 - 5}
                      className="text-xs fill-gray-700 font-medium"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              
              {/* Draw the nodes */}
              {graph.nodes.map((node) => (
                <g key={`node-${node.id}`}>
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="25" 
                    className={`${getNodeColor(node.id)} transition-all duration-300 border-2`} 
                  />
                  {/* White circle behind text for better contrast */}
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="15" 
                    className="fill-white fill-opacity-70" 
                  />
                  <text 
                    x={node.x} 
                    y={node.y} 
                    className="text-gray-800 font-bold text-lg" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                  >
                    {node.id}
                  </text>
                  {/* White background for distance value */}
                  <rect
                    x={node.x - 15}
                    y={node.y + 30}
                    width="30"
                    height="20"
                    rx="10"
                    className="fill-white fill-opacity-70"
                  />
                  <text 
                    x={node.x} 
                    y={node.y + 40} 
                    className="text-gray-800 font-medium text-sm" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                  >
                    {formatDistance(distances[node.id])}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Step Explanation */}
          <div className="bg-white bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-4">Current Step Explanation</h2>
            <div className="text-gray-800">
              {explanation}
            </div>
          </div>


          {/* Legend */}
          <div className="bg-white bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-4">Legend</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <div className="h-0.5 w-8 bg-gray-400 mr-2" style={{ strokeDasharray: '5,3' }}></div>
                <span className="text-sm">Unvisited Edge</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-200 border-2 border-green-600 mr-2"></div>
                <span className="text-sm">Current Node</span>
              </div>
              <div className="flex items-center">
                <div className="h-0.5 w-8 bg-blue-400 mr-2"></div>
                <span className="text-sm">Visited Edge</span>
              </div>
              <div className="flex items-center">
                <div className="h-0.5 w-8 bg-purple-600 mr-2 h-1"></div>
                <span className="text-sm">Final Path</span>
              </div>
              <div className="flex items-center">
                <div className="h-0.5 w-8 bg-green-600 mr-2 h-1"></div>
                <span className="text-sm">Current Edge</span>
              </div>
            </div>
          </div>
        </div>


        <div className="md:w-96 flex flex-col gap-4">
          {/* Priority Queue Visualization */}
          <div className="bg-white bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Priority Queue</h2>
            <div className="overflow-x-auto">
              {priorityQueue.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Node</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Distance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...priorityQueue].sort((a, b) => a.distance - b.distance).map((item, idx) => (
                      <tr key={`queue-${idx}`} className={idx === 0 ? 'bg-green-50' : ''}>
                        <td className="px-4 py-2 text-sm text-gray-800 font-medium">{item.node}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {item.distance === Infinity ? '∞' : item.distance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-2">Queue is empty</p>
              )}
            </div>
          </div>
          
          {/* Distance Array */}
          <div className="bg-white bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Distance Array</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Node</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Distance</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Previous</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {graph.nodes.map((node) => (
                    <tr key={`dist-${node.id}`} className={currentNode === node.id ? 'bg-green-50' : ''}>
                      <td className="px-4 py-2 text-sm text-gray-800 font-medium">{node.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {distances[node.id] === Infinity ? '∞' : distances[node.id]}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {previous[node.id] || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}