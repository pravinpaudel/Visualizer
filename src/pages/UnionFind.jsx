import { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, StepForward, StepBack, RotateCcw, FastForward } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Union-Find implementation with weighted union and path compression
class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.size = Array(size).fill(1);
        this.operations = [];
        this.operationStates = [{
            parent: [...this.parent],
            size: [...this.size],
            description: `Initialized Union-Find with ${size} elements`,
            selectedNodes: []
        }];
    }

    find(x, recordSteps = true) {
        // For visualization purposes, we'll record all intermediate steps in path compression
        const visitedNodes = [x];
        let currentNode = x;

        // First pass - just to find the root
        while (this.parent[currentNode] !== currentNode) {
            currentNode = this.parent[currentNode];
            visitedNodes.push(currentNode);
        }

        // The root of the tree
        const root = currentNode;

        // Second pass - actually perform path compression
        for (let i = 0; i < visitedNodes.length - 1; i++) {
            const node = visitedNodes[i];
            if (this.parent[node] !== root) {
                const oldParent = this.parent[node];
                this.parent[node] = root;

                if (recordSteps) {
                    this.operations.push({
                        type: 'compression',
                        node: node,
                        oldParent: oldParent,
                        newParent: root
                    });

                    this.operationStates.push({
                        parent: [...this.parent],
                        size: [...this.size],
                        description: `Path compression: Element ${node}'s parent changed from ${oldParent} to ${root}`,
                        selectedNodes: [node, root]
                    });
                }
            }
        }

        return root;
    }

    union(x, y) {
        const rootX = this.find(x, false);
        const rootY = this.find(y, false);

        // Record the find operations for visualization
        this.operations.push({
            type: 'find',
            element: x,
            root: rootX
        });

        this.operationStates.push({
            parent: [...this.parent],
            size: [...this.size],
            description: `Find(${x}) = ${rootX}`,
            selectedNodes: [x, rootX]
        });

        this.operations.push({
            type: 'find',
            element: y,
            root: rootY
        });

        this.operationStates.push({
            parent: [...this.parent],
            size: [...this.size],
            description: `Find(${y}) = ${rootY}`,
            selectedNodes: [y, rootY]
        });

        if (rootX === rootY) {
            this.operations.push({
                type: 'no-union',
                root: rootX
            });

            this.operationStates.push({
                parent: [...this.parent],
                size: [...this.size],
                description: `No union performed: ${x} and ${y} are already in the same set (root: ${rootX})`,
                selectedNodes: [x, y, rootX]
            });
            return false;
        }

        // Weighted union - attach smaller tree under root of larger tree
        if (this.size[rootX] < this.size[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];

            this.operations.push({
                type: 'union',
                smallerRoot: rootX,
                largerRoot: rootY,
                newSize: this.size[rootY]
            });

            this.operationStates.push({
                parent: [...this.parent],
                size: [...this.size],
                description: `Union: Connected ${rootX} under ${rootY} (${rootX} tree size: ${this.size[rootX]}, ${rootY} tree size now: ${this.size[rootY]})`,
                selectedNodes: [rootX, rootY]
            });
        } else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];

            this.operations.push({
                type: 'union',
                smallerRoot: rootY,
                largerRoot: rootX,
                newSize: this.size[rootX]
            });

            this.operationStates.push({
                parent: [...this.parent],
                size: [...this.size],
                description: `Union: Connected ${rootY} under ${rootX} (${rootY} tree size: ${this.size[rootY]}, ${rootX} tree size now: ${this.size[rootX]})`,
                selectedNodes: [rootX, rootY]
            });
        }
        return true;
    }

    getParent() {
        return [...this.parent];
    }

    getSize() {
        return [...this.size];
    }

    getOperations() {
        return [...this.operations];
    }

    getOperationStates() {
        return [...this.operationStates];
    }

    reset(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.size = Array(size).fill(1);
        this.operations = [];
        this.operationStates = [{
            parent: [...this.parent],
            size: [...this.size],
            description: `Initialized Union-Find with ${size} elements`,
            selectedNodes: []
        }];
    }
}

// Arrow component to connect parent and child nodes
const Arrow = ({ fromX, fromY, toX, toY, highlighted }) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const length = Math.sqrt(dx * dx + dy * dy);

    return (
        <div
            className={`absolute ${highlighted ? 'bg-orange-500' : 'bg-gray-500'} transition-colors duration-300`}
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
                className={`absolute ${highlighted ? 'border-l-orange-500' : 'border-l-gray-500'} transition-colors duration-300`}
                style={{
                    width: '0',
                    height: '0',
                    right: '0',
                    top: '-3px',
                    borderLeft: '8px solid',
                    borderTop: '4px solid transparent',
                    borderBottom: '4px solid transparent',
                    transform: 'translateX(6px)',
                }}
            />
        </div>
    );
};

// Tree node visualization component
const TreeNode = ({ node, parent, size, selected, nodeRefs }) => {
    let nodeColor = "bg-blue-100";
    let borderColor = "border-blue-500";
    let textColor = "text-blue-800";

    if (selected) {
        nodeColor = "bg-yellow-200";
        borderColor = "border-yellow-600";
        textColor = "text-yellow-800";
    } else if (node === parent[node]) {
        nodeColor = "bg-green-100";
        borderColor = "border-green-500";
        textColor = "text-green-800";
    }

    return (
        <div className="flex flex-col items-center relative">
            <div
                ref={el => nodeRefs.current[node] = el}
                className={`flex flex-col items-center justify-center ${nodeColor} ${borderColor} border-2 rounded-full w-12 h-12 mb-2 shadow-md transition-all duration-300`}
            >
                <div className={`font-bold ${textColor}`}>{node}</div>
                <div className={`text-xs ${textColor}`}>{size}</div>
            </div>
        </div>
    );
};

// Array visualization component
const ArrayVisualization = ({ title, array, highlightedIndices = [] }) => {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-semibold mb-1">{title}</h3>
            <div className="flex">
                {array.map((value, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className={`border ${highlightedIndices.includes(index) ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-gray-300'} w-10 h-10 flex items-center justify-center font-mono transition-colors duration-300`}>
                            {value}
                        </div>
                        <div className="text-xs mt-1 w-10 text-gray-500">{index}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main visualization component
export default function UnionFindVisualizer() {
    const [numElements, setNumElements] = useState(10);
    const [unionFind, setUnionFind] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(1);
    const [parents, setParents] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [element1, setElement1] = useState(0);
    const [element2, setElement2] = useState(1);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [description, setDescription] = useState("");
    const [animationSpeed, setAnimationSpeed] = useState(500); // ms
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [highlightedArrows, setHighlightedArrows] = useState([]);

    // Refs to get positions of nodes for drawing arrows
    const nodeRefs = useRef({});
    const autoPlayIntervalRef = useRef(null);

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

    // Auto-play effect
    useEffect(() => {
        if (isAutoPlaying) {
            autoPlayIntervalRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < totalSteps - 1) {
                        return prev + 1;
                    } else {
                        setIsAutoPlaying(false);
                        return prev;
                    }
                });
            }, animationSpeed);
        }

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [isAutoPlaying, totalSteps, animationSpeed]);

    // Update state when step changes
    useEffect(() => {
        if (!unionFind) return;

        const states = unionFind.getOperationStates();
        if (states.length > currentStep) {
            const state = states[currentStep];
            setParents(state.parent);
            setSizes(state.size);
            setSelectedNodes(state.selectedNodes);
            setDescription(state.description);

            // Highlight arrows involved in this operation
            const newHighlightedArrows = [];
            state.selectedNodes.forEach(node => {
                if (node !== state.parent[node]) {
                    newHighlightedArrows.push(`arrow-${node}-${state.parent[node]}`);
                }
            });
            setHighlightedArrows(newHighlightedArrows);
        }
    }, [currentStep, unionFind]);

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

        const initialState = uf.getOperationStates()[0];
        setParents(initialState.parent);
        setSizes(initialState.size);
        setSelectedNodes(initialState.selectedNodes);
        setDescription(initialState.description);
        setCurrentStep(0);
        setTotalSteps(1);
        setArrows([]);
        setHighlightedArrows([]);
        setIsAutoPlaying(false);

        if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
        }
    };

    const handleUnion = () => {
        if (!unionFind) return;

        unionFind.union(parseInt(element1), parseInt(element2));
        setTotalSteps(unionFind.getOperationStates().length);
        setCurrentStep(unionFind.getOperationStates().length - 1);
    };

    const handleFind = () => {
        if (!unionFind) return;

        unionFind.find(parseInt(element1));
        setTotalSteps(unionFind.getOperationStates().length);
        setCurrentStep(unionFind.getOperationStates().length - 1);
    };

    const handleStep = (direction) => {
        if (direction === 'prev' && currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else if (direction === 'next' && currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else if (direction === 'first') {
            setCurrentStep(0);
        } else if (direction === 'last') {
            setCurrentStep(totalSteps - 1);
        }
    };

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };

    // Build forest visualization for the current state
    const buildForest = () => {
        if (!parents.length) return null;

        // Find the roots
        const roots = parents.map((p, i) => p === i ? i : -1).filter(i => i !== -1);

        // Check if roots are all standalone (all elements are roots)
        const allStandalone = roots.length === numElements;

        if (allStandalone) {
            // If all elements are standalone, display them in a grid
            return (
                <div className="flex flex-wrap justify-center gap-8">
                    {roots.map(root => (
                        <TreeNode
                            key={root}
                            node={root}
                            parent={parents}
                            size={sizes[root]}
                            selected={selectedNodes.includes(root)}
                            nodeRefs={nodeRefs}
                        />
                    ))}
                </div>
            );
        } else {
            // Build trees for each root
            return (
                <div className="flex justify-center flex-wrap gap-16 mt-8">
                    {roots.map(root => (
                        <div key={root} className="flex flex-col items-center">
                            <TreeNode
                                node={root}
                                parent={parents}
                                size={sizes[root]}
                                selected={selectedNodes.includes(root)}
                                nodeRefs={nodeRefs}
                            />
                            <div className="mt-12 flex flex-wrap justify-center gap-8">
                                {buildChildren(root)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    // Build children for a given node
    const buildChildren = (node) => {
        // Find all direct children of this node
        const children = parents.map((p, i) => p === node && i !== node ? i : -1).filter(i => i !== -1);

        if (children.length === 0) return null;

        return children.map(child => (
            <div key={child} className="flex flex-col items-center">
                <TreeNode
                    node={child}
                    parent={parents}
                    size={sizes[child]}
                    selected={selectedNodes.includes(child)}
                    nodeRefs={nodeRefs}
                />
                <div className="mt-12 flex flex-wrap justify-center gap-8">
                    {buildChildren(child)}
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 py-8 relative overflow-hidden mt-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Union-Find with Path Compression Visualizer</h1>

                    {/* Controls */}
                    <div className="bg-gray-50 rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Interactive Controls</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Setup Controls */}
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-medium mb-3 text-gray-700">Setup</h3>
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Number of Elements</label>
                                        <select
                                            className="w-full border rounded p-2 bg-white"
                                            value={numElements}
                                            onChange={(e) => setNumElements(parseInt(e.target.value))}
                                            disabled={totalSteps > 1}
                                        >
                                            {[5, 10, 15, 20].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                                        onClick={resetUnionFind}
                                    >
                                        Restart Visualization
                                    </button>
                                </div>
                            </div>

                            {/* Operation Controls */}
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-medium mb-3 text-gray-700">Operations</h3>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Element 1</label>
                                        <select
                                            className="w-full border rounded p-2 bg-white"
                                            value={element1}
                                            onChange={(e) => setElement1(parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: numElements }, (_, i) => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Element 2</label>
                                        <select
                                            className="w-full border rounded p-2 bg-white"
                                            value={element2}
                                            onChange={(e) => setElement2(parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: numElements }, (_, i) => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors"
                                        onClick={handleUnion}
                                    >
                                        Union
                                    </button>

                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                                        onClick={handleFind}
                                    >
                                        Find (Element 1)
                                    </button>
                                </div>
                            </div>

                            {/* Step Controls */}
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-medium mb-3 text-gray-700">Step Navigation</h3>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Animation Speed</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">Slow</span>
                                        <input
                                            type="range"
                                            min="100"
                                            max="2000"
                                            value={animationSpeed}
                                            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                                            className="flex-grow"
                                        />
                                        <span className="text-xs">Fast</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    <button
                                        className={`p-2 rounded-full ${currentStep <= 0 ? 'text-gray-400' : 'text-indigo-600 hover:bg-gray-100'} transition-colors`}
                                        onClick={() => handleStep('first')}
                                        disabled={currentStep === 0}
                                    >
                                        <RotateCcw size={24} className="text-indigo-600" />
                                    </button>

                                    <button
                                        className={`p-2 rounded-full ${currentStep <= 0 ? 'text-gray-400' : 'text-indigo-600 hover:bg-gray-100'} transition-colors`}
                                        onClick={() => handleStep('prev')}
                                        disabled={currentStep === 0}
                                    >
                                        <StepBack size={24} />
                                    </button>

                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        onClick={toggleAutoPlay}
                                    >
                                        {isAutoPlaying ?
                                            <PauseCircle size={24} className="text-indigo-600" /> :
                                            <PlayCircle size={24} className="text-indigo-600" />
                                        }
                                    </button>

                                    <button
                                        className={`p-2 rounded-full ${currentStep >= totalSteps - 1 ? 'text-gray-400' : 'text-indigo-600 hover:bg-gray-100'} transition-colors`}
                                        onClick={() => handleStep('next')}
                                        disabled={currentStep === totalSteps - 1}
                                    >
                                        <StepForward size={24} />
                                    </button>

                                    <button
                                        className="hover:bg-gray-100 text-indigo-600 px-2 py-2 rounded transition-colors"
                                        onClick={() => handleStep('last')}
                                        disabled={currentStep === totalSteps - 1}
                                    >
                                        <FastForward size={24} />
                                    </button>
                                </div>

                                <div className="mt-3 text-sm text-center">
                                    Step {currentStep + 1} of {totalSteps}
                                </div>
                            </div>
                        </div>

                        {/* Array visualization */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-indigo-700">Disjoint-Set Visualization</h2>
                                <div className="text-sm p-2 bg-blue-100 rounded border border-blue-500 text-indigo-800">
                                    {description}
                                </div>
                            </div>

                            <div className="visualization-container relative bg-gray-50 border rounded-lg overflow-auto h-96">
                                <div className="min-h-full min-w-full p-4">
                                    {buildForest()}

                                    {/* Render arrows */}
                                    {arrows.map(arrow => (
                                        <Arrow
                                            key={arrow.id}
                                            fromX={arrow.fromX}
                                            fromY={arrow.fromY}
                                            toX={arrow.toX}
                                            toY={arrow.toY}
                                            highlighted={highlightedArrows.includes(arrow.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow mt-6">
                            <h3 className="font-medium mb-3 text-gray-700">Data Structure View</h3>
                            <div className="overflow-x-auto">
                                <ArrayVisualization
                                    title="Parent Array"
                                    array={parents}
                                    highlightedIndices={selectedNodes}
                                />
                                <ArrayVisualization
                                    title="Size Array"
                                    array={sizes}
                                    highlightedIndices={selectedNodes}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="bg-white rounded-lg shadow p-6">


                        {/* Legend */}
                        <div className="mt-4 flex flex-wrap gap-4  text-sm justify-center">
                            <div className="flex items-center">
                                <div className="bg-green-100 border-green-500 border-2 w-5 h-5 mr-2 rounded-full"></div>
                                <span>Root nodes</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-blue-100 border-blue-500 border-2 w-5 h-5 mr-2 rounded-full"></div>
                                <span>Child nodes</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-yellow-200 border-yellow-600 border-2 w-5 h-5 mr-2 rounded-full"></div>
                                <span>Selected nodes</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-5 h-1 bg-orange-500 mr-2"></div>
                                <span>Highlighted connections</span>
                            </div>
                        </div>
                        <div className="text-sm mt-2 text-center text-gray-600">
                            Each node shows: element number (top) and subtree size (bottom)
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}