import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Union-Find implementation with weighted union and path compression
class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.size = Array(size).fill(1);
    this.log = [];
    this.log.push(`Initialized Union-Find with ${size} elements`);
  }

  find(x) {
    if (this.parent[x] !== x) {
      const oldParent = this.parent[x];
      this.parent[x] = this.find(this.parent[x]);
      if (oldParent !== this.parent[x]) {
        this.log.push(`Path compression: Element ${x}'s parent changed from ${oldParent} to ${this.parent[x]}`);
      }
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      this.log.push(`No union performed: ${x} and ${y} are already in the same set (root: ${rootX})`);
      return false;
    }

    // Weighted union - attach smaller tree under root of larger tree
    if (this.size[rootX] < this.size[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
      this.log.push(`Union: Connected ${rootX} under ${rootY} (${rootX} tree size: ${this.size[rootX]}, ${rootY} tree size: ${this.size[rootY]})`);
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.log.push(`Union: Connected ${rootY} under ${rootX} (${rootX} tree size: ${this.size[rootX]}, ${rootY} tree size: ${this.size[rootY]})`);
    }
    return true;
  }

  getParent() {
    return [...this.parent];
  }

  getSize() {
    return [...this.size];
  }

  getLogs() {
    return [...this.log];
  }

  clearLogs() {
    this.log = [];
  }
}

// Arrow component to connect parent and child nodes
const Arrow = ({ fromX, fromY, toX, toY }) => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return (
    <div 
      className="absolute bg-gray-500"
      style={{
        width: `${length}px`,
        height: '2px',
        left: `${fromX}px`,
        top: `${fromY}px`,
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div 
        className="absolute bg-gray-500"
        style={{
          width: '0',
          height: '0',
          right: '0',
          top: '-3px',
          borderLeft: '8px solid gray',
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          transform: 'translateX(6px)',
        }}
      />
    </div>
  );
};

// Tree node visualization component
const TreeNode = ({ node, parent, size, level, children, selected, nodeRefs, parentRefs }) => {
  let nodeColor = "bg-blue-100";
  let borderColor = "border-blue-500";
  
  if (selected) {
    nodeColor = "bg-yellow-200";
    borderColor = "border-yellow-600";
  } else if (node === parent[node]) {
    nodeColor = "bg-green-100";
    borderColor = "border-green-500";
  }

  // Determine node size based on total elements
  const nodeSize = "w-10 h-10";

  return (
    <div className="flex flex-col items-center relative">
      <div 
        ref={el => nodeRefs.current[node] = el}
        className={`flex flex-col items-center justify-center ${nodeColor} ${borderColor} border-2 rounded-full ${nodeSize} mb-2`}
      >
        <div>{node}</div>
        <div className="text-xs">{size}</div>
      </div>
      {children && (
        <div className="pt-10 flex items-start space-x-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Main visualization component
export default function UnionFindVisualizer() {
  const [numElements, setNumElements] = useState(10);
  const [unionFind, setUnionFind] = useState(null);
  const [parents, setParents] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [element1, setElement1] = useState(0);
  const [element2, setElement2] = useState(1);
  const [logs, setLogs] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [arrows, setArrows] = useState([]);
  
  // Refs to get positions of nodes for drawing arrows
  const nodeRefs = { current: {} };

  useEffect(() => {
    // Initialize UnionFind
    resetUnionFind();
  }, [numElements]);
  
  // Effect to update arrows when parents change
  useEffect(() => {
    // Need to wait for the DOM to update with new node positions
    const timer = setTimeout(() => {
      updateArrows();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [parents]);

  const updateArrows = () => {
    const newArrows = [];
    
    // For each node that's not a root, draw an arrow to its parent
    for (let i = 0; i < parents.length; i++) {
      if (i !== parents[i]) { // If not a root
        const childNode = nodeRefs.current[i];
        const parentNode = nodeRefs.current[parents[i]];
        
        if (childNode && parentNode) {
          const childRect = childNode.getBoundingClientRect();
          const parentRect = parentNode.getBoundingClientRect();
          
          // Calculate the center points
          const fromX = childRect.left + childRect.width / 2;
          const fromY = childRect.top;
          const toX = parentRect.left + parentRect.width / 2;
          const toY = parentRect.bottom;
          
          // Get positions relative to the visualization container
          const containerRect = document.querySelector('.visualization-container').getBoundingClientRect();
          const relFromX = fromX - containerRect.left;
          const relFromY = fromY - containerRect.top;
          const relToX = toX - containerRect.left;
          const relToY = toY - containerRect.top;
          
          newArrows.push({
            id: `arrow-${i}-${parents[i]}`,
            fromX: relFromX,
            fromY: relFromY,
            toX: relToX,
            toY: relToY
          });
        }
      }
    }
    
    setArrows(newArrows);
  };

  const resetUnionFind = () => {
    const uf = new UnionFind(numElements);
    setUnionFind(uf);
    setParents(uf.getParent());
    setSizes(uf.getSize());
    setLogs(uf.getLogs());
    setSelectedNodes([]);
    setArrows([]);
  };

  const handleUnion = () => {
    if (!unionFind) return;
    
    setSelectedNodes([element1, element2]);
    const success = unionFind.union(element1, element2);
    setParents(unionFind.getParent());
    setSizes(unionFind.getSize());
    setLogs(unionFind.getLogs());
    
    setTimeout(() => setSelectedNodes([]), 1000);
  };

  const handleFind = (element) => {
    if (!unionFind) return;
    
    setSelectedNodes([element]);
    const root = unionFind.find(element);
    setParents(unionFind.getParent());
    setLogs([...logs, `Find(${element}) = ${root}`]);
    
    setTimeout(() => setSelectedNodes([]), 1000);
  };

  // Build tree structure for visualization
  const buildTree = () => {
    if (!parents.length) return null;
    
    // Display all standalone elements
    let elements = [];
    
    // Find the roots
    const roots = parents.map((p, i) => p === i ? i : -1).filter(i => i !== -1);
    
    // Check if roots are all standalone (all elements are roots)
    const allStandalone = roots.length === numElements;
    
    if (allStandalone) {
      // If all elements are standalone, display them in a grid
      elements = (
        <div className="flex flex-wrap justify-center gap-8">
          {roots.map(root => (
            <TreeNode 
              key={root} 
              node={root} 
              parent={parents} 
              size={sizes[root]}
              level={0}
              selected={selectedNodes.includes(root)}
              nodeRefs={nodeRefs}
            />
          ))}
        </div>
      );
    } else {
      // If there are connected components, build tree structure
      // For each root, build a subtree
      const rootElements = roots.map(root => {
        return buildSubTree(root);
      });
      
      elements = (
        <div className="flex justify-center space-x-16 mt-4">
          {rootElements}
        </div>
      );
    }
    
    return elements;
  };

  const buildSubTree = (node) => {
    // Find all direct children of this node
    const children = parents.map((p, i) => p === node && i !== node ? i : -1).filter(i => i !== -1);
    
    const childElements = children.map(child => {
      return buildSubTree(child);
    });
    
    return (
      <TreeNode 
        key={node} 
        node={node} 
        parent={parents} 
        size={sizes[node]}
        level={0}
        selected={selectedNodes.includes(node)}
        nodeRefs={nodeRefs}
      >
        {childElements.length > 0 && childElements}
      </TreeNode>
    );
  };

  return (
    <div>
      <Navbar />
    <div className="p-4 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Union-Find Visualizer</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Controls</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Elements</label>
            <select 
              className="border rounded p-1"
              value={numElements}
              onChange={(e) => setNumElements(parseInt(e.target.value))}
            >
              {[5, 10, 15, 20].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Element 1</label>
            <select 
              className="border rounded p-1"
              value={element1}
              onChange={(e) => setElement1(parseInt(e.target.value))}
            >
              {Array.from({ length: numElements }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Element 2</label>
            <select 
              className="border rounded p-1"
              value={element2}
              onChange={(e) => setElement2(parseInt(e.target.value))}
            >
              {Array.from({ length: numElements }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUnion}
          >
            Union
          </button>
          
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => handleFind(element1)}
          >
            Find Element 1
          </button>
          
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            onClick={resetUnionFind}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Visualization</h2>
        <div className="visualization-container relative flex justify-center overflow-auto h-96 border rounded">
          <div className="flex flex-col min-w-full">
            <div className="p-4 text-center text-sm">
              <span>Use scroll wheel to pan around if needed</span>
            </div>
            <div className="p-4 flex justify-center min-w-full" style={{ minWidth: `${numElements * 80}px` }}>
              {buildTree()}
              {arrows.map(arrow => (
                <Arrow 
                  key={arrow.id}
                  fromX={arrow.fromX}
                  fromY={arrow.fromY}
                  toX={arrow.toX}
                  toY={arrow.toY}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Legend:</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <div className="bg-green-100 border-green-500 border-2 w-4 h-4 mr-2 rounded-full"></div>
              <span>Root nodes</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 border-blue-500 border-2 w-4 h-4 mr-2 rounded-full"></div>
              <span>Child nodes</span>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-200 border-yellow-600 border-2 w-4 h-4 mr-2 rounded-full"></div>
              <span>Selected nodes</span>
            </div>
          </div>
          <div className="text-sm mt-2">
            <span>Each node shows: element number (top) and subtree size (bottom)</span>
          </div>
          <div className="text-sm mt-1">
            <span>Arrows point from child nodes to their parent nodes</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Operation Log</h2>
        <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50">
          {logs.map((log, index) => (
            <div key={index} className="text-sm py-1 border-b border-gray-200">
              {log}
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}