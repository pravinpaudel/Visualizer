import { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';

// Constants
const RED = true;
const BLACK = false;

// Node class for the LLRBT - simplified by removing size and value
class Node {
  constructor(key, color = RED) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.color = color;
  }
}

const LLRBT = () => {
  // Main component state
  const [root, setRoot] = useState(null);
  const [operations, setOperations] = useState([]);
  const [inputKey, setInputKey] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const [explanation, setExplanation] = useState('');
  const [treeHistory, setTreeHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);

  // Helper functions
  const isRed = (node) => {
    if (node === null) return false;
    return node.color === RED;
  };

  // Tree operations
  const rotateLeft = (h) => {
    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = RED;
    return x;
  };

  const rotateRight = (h) => {
    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = RED;
    return x;
  };

  const flipColors = (h) => {
    h.color = !h.color;
    if (h.left) h.left.color = !h.left.color;
    if (h.right) h.right.color = !h.right.color;
  };

  // Min operation
  const min = (node) => {
    if (node.left === null) return node;
    return min(node.left);
  };

  const moveRedLeft = (h) => {
    addOperation(`Moving red link left at node ${h.key}`);
    flipColors(h);
    if (h.right && isRed(h.right.left)) {
      addOperation(`Right child has red left child, rotating right then left`);
      h.right = rotateRight(h.right);
      h = rotateLeft(h);
      flipColors(h);
    }
    return h;
  };

  const moveRedRight = (h) => {
    addOperation(`Moving red link right at node ${h.key}`);
    flipColors(h);
    if (h.left && isRed(h.left.left)) {
      addOperation(`Left child has red left child, rotating right`);
      h = rotateRight(h);
      flipColors(h);
    }
    return h;
  };

  const balance = (h) => {
    if (h === null) return null;

    if (isRed(h.right) && !isRed(h.left)) {
      addOperation(`Balancing: right-leaning red link at ${h.key}, rotating left`);
      h = rotateLeft(h);
      addToHistory(deepCopy(h), [`Left rotation at node ${h.key}`]);
    }
    
    if (isRed(h.left) && isRed(h.left.left)) {
      addOperation(`Balancing: consecutive red links on left at ${h.key}, rotating right`);
      h = rotateRight(h);
      addToHistory(deepCopy(h), [`Right rotation at node ${h.key}`]);
    }
    
    if (isRed(h.left) && isRed(h.right)) {
      addOperation(`Balancing: both children red at ${h.key}, flipping colors`);
      flipColors(h);
      addToHistory(deepCopy(h), [`Color flip at node ${h.key}`]);
    }

    return h;
  };

  // Delete min operation with history tracking
  const deleteMin = (h) => {
    if (h.left === null) {
      addOperation(`Reached leftmost node ${h.key}, removing it`);
      addToHistory(null, [`Removed node ${h.key}`]);
      return null;
    }

    if (!isRed(h.left) && !isRed(h.left.left)) {
      addOperation(`Left child and its left child are both black, moving red left`);
      const oldh = h;
      h = moveRedLeft(h);
      addToHistory(deepCopy(h), [`Moving red left at node ${oldh.key}`]);
    }

    h.left = deleteMin(h.left);
    addOperation(`Balancing after deleteMin operation`);
    h = balance(h);
    return h;
  };

  // Put operation with history tracking
  const put = (node, key) => {
    // If tree is empty, create new node
    if (node === null) {
      addOperation(`Creating new RED node with key ${key}`);
      const newNode = new Node(key);
      addToHistory(deepCopy(newNode), [`Created new RED node with key ${key}`]);
      return newNode;
    }

    let cmp = key - node.key;
    
    if (cmp < 0) {
      addOperation(`Key ${key} is less than ${node.key}, going left`);
      addToHistory(deepCopy(node), [`Going left from node ${node.key} to insert ${key}`]);
      node.left = put(node.left, key);
    } else if (cmp > 0) {
      addOperation(`Key ${key} is greater than ${node.key}, going right`);
      addToHistory(deepCopy(node), [`Going right from node ${node.key} to insert ${key}`]);
      node.right = put(node.right, key);
    } else {
      addOperation(`Key ${key} already exists, no change needed`);
      addToHistory(deepCopy(node), [`Key ${key} already exists, no change needed`]);
      return node;
    }

    // Fix-up any right-leaning links
    if (isRed(node.right) && !isRed(node.left)) {
      addOperation(`Found right-leaning red link at node ${node.key}, rotating left`);
      const oldNode = node;
      node = rotateLeft(node);
      addToHistory(deepCopy(node), [`Left rotation at node ${oldNode.key}`]);
    }
    
    if (isRed(node.left) && isRed(node.left.left)) {
      addOperation(`Found consecutive red links on left at node ${node.key}, rotating right`);
      const oldNode = node;
      node = rotateRight(node);
      addToHistory(deepCopy(node), [`Right rotation at node ${oldNode.key}`]);
    }
    
    if (isRed(node.left) && isRed(node.right)) {
      addOperation(`Found red children on both sides at node ${node.key}, flipping colors`);
      flipColors(node);
      addToHistory(deepCopy(node), [`Color flip at node ${node.key}`]);
    }
    
    return node;
  };

  // Delete operation with history tracking
  const deleteNode = (h, key) => {
    addToHistory(deepCopy(h), [`Searching for key ${key} to delete`]);
    
    if (key < h.key) {
      addOperation(`Key ${key} is less than ${h.key}, going left to delete`);
      addToHistory(deepCopy(h), [`Going left from node ${h.key} to delete ${key}`]);
      
      if (!isRed(h.left) && h.left && !isRed(h.left.left)) {
        addOperation(`Left child and its left child are both black, moving red left`);
        const oldh = h;
        h = moveRedLeft(h);
        addToHistory(deepCopy(h), [`Moving red left at node ${oldh.key}`]);
      }
      
      h.left = deleteNode(h.left, key);
    } else {
      if (isRed(h.left)) {
        addOperation(`Left child is red, rotating right to prepare for deletion`);
        const oldh = h;
        h = rotateRight(h);
        addToHistory(deepCopy(h), [`Right rotation at node ${oldh.key}`]);
      }
      
      if (key === h.key && h.right === null) {
        addOperation(`Found key ${key} with no right child, removing it`);
        addToHistory(null, [`Removed node ${key}`]);
        return null;
      }
      
      if (!isRed(h.right) && h.right && !isRed(h.right.left)) {
        addOperation(`Right child and its left child are both black, moving red right`);
        const oldh = h;
        h = moveRedRight(h);
        addToHistory(deepCopy(h), [`Moving red right at node ${oldh.key}`]);
      }
      
      if (key === h.key) {
        addOperation(`Found key ${key}, replacing with minimum from right subtree`);
        const x = min(h.right);
        addToHistory(deepCopy(h), [`Found minimum key ${x.key} in right subtree to replace ${key}`]);
        
        h.key = x.key;
        addToHistory(deepCopy(h), [`Replaced key ${key} with ${x.key}`]);
        
        addOperation(`Now will delete the minimum key from right subtree`);
        h.right = deleteMin(h.right);
      } else {
        addOperation(`Key ${key} is greater than ${h.key}, going right to delete`);
        addToHistory(deepCopy(h), [`Going right from node ${h.key} to delete ${key}`]);
        
        h.right = deleteNode(h.right, key);
      }
    }
    
    addOperation(`Balancing after delete operation at node ${h.key}`);
    h = balance(h);
    
    return h;
  };

  // UI handlers
  const handleInsert = () => {
    if (inputKey.trim() === '' || isNaN(parseInt(inputKey))) {
      setExplanation('Please enter a valid numeric key');
      return;
    }
    
    const key = parseInt(inputKey);
    
    // Reset operations
    setOperations([]);
    
    // Clear previous history
    setTreeHistory([]);
    setHistoryIndex(-1);

    // Start with a clean copy of the tree
    let newRoot = deepCopy(root);

    // Perform insertion with history tracking
    newRoot = put(newRoot, key);
    
    // Add initial state to history
    addToHistory(deepCopy(newRoot), [`Ended insertion of key ${key}`]);
    
    // // Perform insertion with history tracking
    // newRoot = put(newRoot, key);
    
    if (root === null) {
      addOperation(`Setting root to BLACK as per LLRBT rules`);
      newRoot.color = BLACK;
      addToHistory(deepCopy(newRoot), [`Setting root to BLACK as per LLRBT rules`]);
    }
    
    setRoot(newRoot);
    setInputKey('');
    setExplanation(`Inserted key ${key}. Use Previous/Next State to see each step.`);
    
    // Set to first state to begin step-by-step viewing
    if (treeHistory.length > 0) {
      setHistoryIndex(0);
    }
  };

  const handleDelete = () => {
    if (deleteKey.trim() === '' || isNaN(parseInt(deleteKey)) || root === null) {
      setExplanation('Please enter a valid numeric key to delete');
      return;
    }
    
    const key = parseInt(deleteKey);
    
    // Reset operations
    setOperations([]);
    
    // Clear previous history
    setTreeHistory([]);
    setHistoryIndex(-1);
    
    try {
      let newRoot = deepCopy(root);
      
      // Add initial state to history
      addToHistory(deepCopy(newRoot), [`Starting deletion of key ${key}`]);
      
      // LLRBT delete operation
      if (!isRed(newRoot.left) && !isRed(newRoot.right)) {
        addOperation(`Setting root to RED for delete operation`);
        newRoot.color = RED;
        addToHistory(deepCopy(newRoot), [`Setting root to RED for delete operation`]);
      }
      
      newRoot = deleteNode(newRoot, key);
      
      if (newRoot !== null) {
        addOperation(`Setting root back to BLACK after delete operation`);
        newRoot.color = BLACK;
        addToHistory(deepCopy(newRoot), [`Setting root back to BLACK after delete operation`]);
      }
      
      setRoot(newRoot);
      setDeleteKey('');
      setExplanation(`Deleted key ${key}. Use Previous/Next State to see each step.`);
      
      // Set to first state to begin step-by-step viewing
      if (treeHistory.length > 0) {
        setHistoryIndex(0);
      }
    } catch (error) {
      setExplanation(`Error deleting key ${key}: ${error.message}`);
    }
  };

  // Utility functions
  const addOperation = (description) => {
    setOperations(prev => [...prev, description]);
  };

  const deepCopy = (node) => {
    if (node === null) return null;
    const copy = new Node(node.key, node.color);
    copy.left = deepCopy(node.left);
    copy.right = deepCopy(node.right);
    return copy;
  };

  const addToHistory = (newRoot, specificOperations = null) => {
    // Add to history
    setTreeHistory(prev => [
      ...prev,
      { 
        root: newRoot, 
        operations: specificOperations || [...operations] 
      }
    ]);
  };

  const handlePrevStep = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      const currentState = treeHistory[newIndex];
      setRoot(deepCopy(currentState.root));
      
      // Get a meaningful description of the current operation
      let description = "Unknown operation";
      if (currentState.operations && currentState.operations.length > 0) {
        description = currentState.operations[0];
      }
      
      setExplanation(`Step ${newIndex + 1} of ${treeHistory.length}: ${description}`);
    }
  };

  const handleNextStep = () => {
    if (historyIndex < treeHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      const currentState = treeHistory[newIndex];
      setRoot(deepCopy(currentState.root));
      
      // Get a meaningful description of the current operation
      let description = "Unknown operation";
      if (currentState.operations && currentState.operations.length > 0) {
        description = currentState.operations[0];
      }
      
      setExplanation(`Step ${newIndex + 1} of ${treeHistory.length}: ${description}`);
    }
  };

  const handleExample = () => {
    setRoot(null);
    setOperations([]);
    setTreeHistory([]);
    setHistoryIndex(-1);
    
    // Clear the canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Example values
    const exampleValues = [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13];
    
    // Add initial empty state to history
    addToHistory(null, ["Starting with empty tree"]);
    
    // Insert values one by one
    let tempRoot = null;
    
    exampleValues.forEach((value, index) => {
      addOperation(`Inserting key ${value} (${index + 1}/${exampleValues.length})`);
      tempRoot = put(tempRoot, value);
      
      if (tempRoot) {
        tempRoot.color = BLACK;
        addToHistory(deepCopy(tempRoot), [`Setting root to BLACK after inserting key ${value}`]);
      }
    });
    
    // Set to the final state
    setRoot(tempRoot);
    
    // Set to the first state to allow stepping through
    if (treeHistory.length > 0) {
      setHistoryIndex(0);
      
      // Set the current root to the first state
      const firstState = treeHistory[0];
      setRoot(deepCopy(firstState.root));
      
      setExplanation(`Created example tree with values: ${exampleValues.join(", ")}. Use Next State to step through each operation.`);
    }
  };

  const handleClear = () => {
    setRoot(null);
    setOperations([]);
    setTreeHistory([]);
    setHistoryIndex(-1);
    setExplanation("Tree cleared");
    
    // Clear the canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Canvas rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const treeDepth = getTreeDepth(root);
    
    // Calculate canvas dimensions based on tree depth and width
    const nodeRadius = 20;
    const levelHeight = 80;
    const canvasHeight = (treeDepth + 1) * levelHeight;
    const canvasWidth = Math.max(800, Math.pow(2, treeDepth) * 70);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (root) {
      drawTree(ctx, root, canvasWidth / 2, nodeRadius + 10, canvasWidth / 4, levelHeight);
    }
  }, [root]);

  // Tree visualization functions
  const getTreeDepth = (node) => {
    if (node === null) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };

  const drawTree = (ctx, node, x, y, horizontalSpacing, levelHeight) => {
    if (node === null) return;
    
    const nodeRadius = 20;
    
    // Draw connections to children first (behind nodes)
    if (node.left) {
      const childX = x - horizontalSpacing;
      const childY = y + levelHeight;
      
      // Draw edge to left child
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(childX, childY);
      ctx.strokeStyle = node.left.color === RED ? '#FF4136' : '#333';
      ctx.lineWidth = node.left.color === RED ? 3 : 2;
      ctx.stroke();
      
      // Recursively draw left subtree
      drawTree(ctx, node.left, childX, childY, horizontalSpacing / 2, levelHeight);
    }
    
    if (node.right) {
      const childX = x + horizontalSpacing;
      const childY = y + levelHeight;
      
      // Draw edge to right child
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(childX, childY);
      ctx.strokeStyle = node.right.color === RED ? '#FF4136' : '#333';
      ctx.lineWidth = node.right.color === RED ? 3 : 2;
      ctx.stroke();
      
      // Recursively draw right subtree
      drawTree(ctx, node.right, childX, childY, horizontalSpacing / 2, levelHeight);
    }
    
    // Draw node
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = node.color === RED ? '#FFCCCB' : '#FFF';
    ctx.strokeStyle = node.color === RED ? '#FF4136' : '#333';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    
    // Draw key text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.key, x, y);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Interactive Left-Leaning Red-Black Tree Visualization
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="mb-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Insert Controls */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Key (number)"
                className="border rounded p-2 w-32"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleInsert}
              >
                Insert
              </button>
            </div>
            
            {/* Delete Controls */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Key to delete"
                className="border rounded p-2 w-32"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
                disabled={!root}
              >
                Delete
              </button>
            </div>
            
            {/* Example and Clear */}
            <div className="flex items-center gap-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleExample}
              >
                Load Example
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleClear}
                disabled={!root}
              >
                Clear Tree
              </button>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={handlePrevStep}
              disabled={historyIndex <= 0}
            >
              ◀ Previous State
            </button>
            <span className="text-gray-600">
              {treeHistory.length > 0 ? `${historyIndex + 1} / ${treeHistory.length}` : '0 / 0'}
            </span>
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={handleNextStep}
              disabled={historyIndex >= treeHistory.length - 1}
            >
              Next State ▶
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-800"></div>
            <span>Black Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-pink-100 border-2 border-red-500"></div>
            <span>Red Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-red-500"></div>
            <span>Red Link</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gray-800"></div>
            <span>Black Link</span>
          </div>
        </div>
        
        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <h3 className="font-semibold text-blue-800 mb-1">Current Operation:</h3>
          <p className="text-blue-700">{explanation}</p>
        </div>
      </div>
      
      {/* Tree Visualization */}
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-auto">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Tree Visualization</h2>
          <div className="border border-gray-200 rounded-lg overflow-auto p-2 min-h-64 flex justify-center">
            <canvas ref={canvasRef} className="mx-auto"></canvas>
            {!root && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Tree is empty. Insert some nodes or load an example.
              </div>
            )}
          </div>
        </div>
        
        {/* Operation Log - Now flex-grow to adjust size */}
        <div className="w-full md:w-80 lg:w-96 bg-white rounded-lg shadow-md p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Operation Steps</h2>
          <div className="border border-gray-200 rounded-lg overflow-auto p-2 h-80">
            {treeHistory.length === 0 ? (
              <div className="text-gray-500 p-2">No operations performed yet.</div>
            ) : (
              <ol className="list-decimal list-inside">
                {treeHistory.map((state, index) => (
                  <li 
                    key={index} 
                    className={`py-1 border-b border-gray-100 last:border-0 ${index === historyIndex ? 'bg-yellow-50 font-semibold' : ''}`}
                  >
                    {state.operations && state.operations.length > 0 ? state.operations[0] : "Unknown operation"}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
      
      {/* LLRBT Properties */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Left-Leaning Red-Black Tree Properties</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>No node has two red links connected to it</li>
          <li>Every path from root to null link has the same number of black links</li>
          <li>Red links lean left (a red node is always a left child)</li>
          <li>The root is always black</li>
          <li>The height of the tree is at most 2 × log₂(n)</li>
          <li>Operations (insert, delete, search) are guaranteed to be logarithmic in time</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default LLRBT;