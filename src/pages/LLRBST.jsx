import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define constants
const RED = true;
const BLACK = false;

// Node class for the LLRB tree
class Node {
    constructor(key, value, color = RED) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.color = color;
    }
}

// LLRB tree implementation
class RedBlackBST {
    constructor() {
        this.root = null;
        this.steps = [];
        this.lastOperation = null;
    }

    isRed(node) {
        if (node === null) return false;
        return node.color === RED;
    }

    rotateLeft(h) {
        const x = h.right;
        h.right = x.left;
        x.left = h;
        x.color = h.color;
        h.color = RED;
        return x;
    }

    rotateRight(h) {
        const x = h.left;
        h.left = x.right;
        x.right = h;
        x.color = h.color;
        h.color = RED;
        return x;
    }

    flipColors(h) {
        h.color = !h.color;
        h.left.color = !h.left.color;
        h.right.color = !h.right.color;
    }

    put(key, value) {
        this.steps = [];
        this.lastOperation = { type: 'insert', key };
        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Starting insertion of key ${key}`,
            highlighted: null
        });

        this.root = this._put(this.root, key, value);
        this.root.color = BLACK; // Root is always black

        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Insertion of key ${key} completed. Root is set to BLACK.`,
            highlighted: null
        });

        return this.steps;
    }

    _put(h, key, value) {
        if (h === null) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Creating new RED node with key ${key}`,
                highlighted: { key, operation: 'insert' }
            });
            return new Node(key, value, RED);
        }

        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Comparing key ${key} with node ${h.key}`,
            highlighted: { key: h.key }
        });

        if (key < h.key) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Key ${key} is less than ${h.key}, traversing left`,
                highlighted: { key: h.key, direction: 'left' }
            });
            h.left = this._put(h.left, key, value);
        } else if (key > h.key) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Key ${key} is greater than ${h.key}, traversing right`,
                highlighted: { key: h.key, direction: 'right' }
            });
            h.right = this._put(h.right, key, value);
        } else {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Key ${key} already exists, updating value`,
                highlighted: { key: h.key, operation: 'update' }
            });
            h.value = value;
        }

        // Fix-up any right-leaning links
        if (this.isRed(h.right) && !this.isRed(h.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Right child is RED but left child is BLACK at node ${h.key}. Performing left rotation.`,
                highlighted: { key: h.key, operation: 'rotateLeft' }
            });
            h = this.rotateLeft(h);
        }

        if (this.isRed(h.left) && this.isRed(h.left.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Left child and left-left grandchild are both RED at node ${h.key}. Performing right rotation.`,
                highlighted: { key: h.key, operation: 'rotateRight' }
            });
            h = this.rotateRight(h);
        }

        if (this.isRed(h.left) && this.isRed(h.right)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Both children are RED at node ${h.key}. Flipping colors.`,
                highlighted: { key: h.key, operation: 'flipColors' }
            });
            this.flipColors(h);
        }

        return h;
    }

    delete(key) {
        if (this.root === null) return [];

        this.steps = [];
        this.lastOperation = { type: 'delete', key };
        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Starting deletion of key ${key}`,
            highlighted: null
        });

        if (!this.isRed(this.root.left) && !this.isRed(this.root.right)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Both children of root are BLACK, temporarily setting root to RED`,
                highlighted: { key: this.root.key, operation: 'setRootRed' }
            });
            this.root.color = RED;
        }

        this.root = this._delete(this.root, key);

        if (this.root !== null) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Deletion completed, setting root back to BLACK`,
                highlighted: { key: this.root.key, operation: 'setRootBlack' }
            });
            this.root.color = BLACK;
        } else {
            this.steps.push({
                tree: null,
                message: `Tree is now empty after deleting ${key}`,
                highlighted: null
            });
        }

        return this.steps;
    }

    _delete(h, key) {
        if (h === null) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Key ${key} not found in the tree`,
                highlighted: null
            });
            return null;
        }

        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Comparing key ${key} with node ${h.key}`,
            highlighted: { key: h.key }
        });

        if (key < h.key) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Key ${key} is less than ${h.key}, traversing left`,
                highlighted: { key: h.key, direction: 'left' }
            });

            if (!this.isRed(h.left) && h.left !== null && !this.isRed(h.left.left)) {
                this.steps.push({
                    tree: this.cloneTree(this.root),
                    message: `Moving RED to the left to ensure we can traverse down`,
                    highlighted: { key: h.key, operation: 'moveRedLeft' }
                });
                h = this.moveRedLeft(h);
            }

            h.left = this._delete(h.left, key);
        } else {
            if (this.isRed(h.left)) {
                this.steps.push({
                    tree: this.cloneTree(this.root),
                    message: `Left child is RED at node ${h.key}. Performing right rotation.`,
                    highlighted: { key: h.key, operation: 'rotateRight' }
                });
                h = this.rotateRight(h);
            }

            if (key === h.key && h.right === null) {
                this.steps.push({
                    tree: this.cloneTree(this.root),
                    message: `Found key ${key} with no right child, removing node`,
                    highlighted: { key: h.key, operation: 'remove' }
                });
                return null;
            }

            if (!this.isRed(h.right) && h.right !== null && !this.isRed(h.right.left)) {
                this.steps.push({
                    tree: this.cloneTree(this.root),
                    message: `Moving RED to the right to ensure we can traverse down`,
                    highlighted: { key: h.key, operation: 'moveRedRight' }
                });
                h = this.moveRedRight(h);
            }

            if (key === h.key) {
                this.steps.push({
                    tree: this.cloneTree(this.root),
                    message: `Found key ${key} with right child, replacing with minimum key in right subtree`,
                    highlighted: { key: h.key, operation: 'replaceWithSuccessor' }
                });
                const minNode = this.min(h.right);
                h.key = minNode.key;
                h.value = minNode.value;
                h.right = this.deleteMin(h.right);
            } else {
                this.steps.push({
                    tree: this.cloneTree(this.root),
                    message: `Key ${key} is greater than ${h.key}, traversing right`,
                    highlighted: { key: h.key, direction: 'right' }
                });
                h.right = this._delete(h.right, key);
            }
        }

        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Balancing tree at node ${h.key}`,
            highlighted: { key: h.key, operation: 'balance' }
        });

        return this.balance(h);
    }

    moveRedLeft(h) {
        this.flipColors(h);

        if (h.right !== null && this.isRed(h.right.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Right-left grandchild is RED at node ${h.key}. Right rotation on right child followed by left rotation.`,
                highlighted: { key: h.key, operation: 'complexRotation' }
            });
            h.right = this.rotateRight(h.right);
            h = this.rotateLeft(h);
            this.flipColors(h);
        }

        return h;
    }

    moveRedRight(h) {
        this.flipColors(h);

        if (h.left !== null && this.isRed(h.left.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Left-left grandchild is RED at node ${h.key}. Performing right rotation.`,
                highlighted: { key: h.key, operation: 'rotateRight' }
            });
            h = this.rotateRight(h);
            this.flipColors(h);
        }

        return h;
    }

    min(node) {
        if (node.left === null) return node;
        return this.min(node.left);
    }

    deleteMin(h) {
        if (h.left === null) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Found minimum node ${h.key}, removing it`,
                highlighted: { key: h.key, operation: 'remove' }
            });
            return null;
        }

        if (!this.isRed(h.left) && h.left !== null && !this.isRed(h.left.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Moving RED to the left to continue traversal at node ${h.key}`,
                highlighted: { key: h.key, operation: 'moveRedLeft' }
            });
            h = this.moveRedLeft(h);
        }

        h.left = this.deleteMin(h.left);

        this.steps.push({
            tree: this.cloneTree(this.root),
            message: `Balancing tree at node ${h.key} after minimum deletion`,
            highlighted: { key: h.key, operation: 'balance' }
        });

        return this.balance(h);
    }

    balance(h) {
        if (h === null) return null;

        if (this.isRed(h.right) && !this.isRed(h.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Right child is RED but left child is not at node ${h.key}. Performing left rotation.`,
                highlighted: { key: h.key, operation: 'rotateLeft' }
            });
            h = this.rotateLeft(h);
        }

        if (this.isRed(h.left) && this.isRed(h.left.left)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Left child and left-left grandchild are both RED at node ${h.key}. Performing right rotation.`,
                highlighted: { key: h.key, operation: 'rotateRight' }
            });
            h = this.rotateRight(h);
        }

        if (this.isRed(h.left) && this.isRed(h.right)) {
            this.steps.push({
                tree: this.cloneTree(this.root),
                message: `Both children are RED at node ${h.key}. Flipping colors.`,
                highlighted: { key: h.key, operation: 'flipColors' }
            });
            this.flipColors(h);
        }

        return h;
    }

    get(key) {
        let node = this.root;
        while (node !== null) {
            if (key < node.key) node = node.left;
            else if (key > node.key) node = node.right;
            else return node.value;
        }
        return null;
    }

    contains(key) {
        return this.get(key) !== null;
    }

    // Helper method to clone the tree for visualization steps
    cloneTree(node) {
        if (node === null) return null;
        const newNode = new Node(node.key, node.value, node.color);
        newNode.left = this.cloneTree(node.left);
        newNode.right = this.cloneTree(node.right);
        return newNode;
    }
}

// Main component
export default function LLRBVisualization() {
    const [tree] = useState(new RedBlackBST());
    const [treeRoot, setTreeRoot] = useState(null);
    const [inputKey, setInputKey] = useState('');
    const [operations, setOperations] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [animationSpeed, setAnimationSpeed] = useState(1000);
    const [isAnimating, setIsAnimating] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const timerRef = useRef(null);

    // Function to insert a key
    const handleInsert = () => {
        if (!inputKey.trim()) return;
        const key = parseInt(inputKey, 10);
        if (isNaN(key)) return;

        const steps = tree.put(key, key);
        setTreeRoot(tree.root);
        setOperations(steps);
        setCurrentStepIndex(0);
        setInputKey('');
    };

    // Function to delete a key
    const handleDelete = () => {
        if (!inputKey.trim()) return;
        const key = parseInt(inputKey, 10);
        if (isNaN(key)) return;

        const steps = tree.delete(key);
        setTreeRoot(tree.root);
        setOperations(steps);
        setCurrentStepIndex(0);
        setInputKey('');
    };

    // Navigate through steps
    const nextStep = () => {
        if (currentStepIndex < operations.length - 1) {
            setCurrentStepIndex(prevIndex => prevIndex + 1);
        } else if (autoPlay) {
            setAutoPlay(false);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prevIndex => prevIndex - 1);
        }
    };

    // Toggle autoplay
    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
    };

    // Effect for auto-playing animation
    useEffect(() => {
        if (autoPlay && operations.length > 0) {
            setIsAnimating(true);
            timerRef.current = setTimeout(() => {
                if (currentStepIndex < operations.length - 1) {
                    nextStep();
                } else {
                    setAutoPlay(false);
                    setIsAnimating(false);
                }
            }, animationSpeed);
        } else {
            setIsAnimating(false);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [autoPlay, currentStepIndex, operations.length, animationSpeed]);

    // Tree visualization component
    const TreeVisualization = ({ root, highlighted }) => {
        if (!root) return <div className="flex justify-center items-center h-64 text-gray-500">Tree is empty</div>;

        const calculateTreeLayout = (node, x = 0, y = 0, level = 0) => {
            if (!node) return null;

            const horizontalSpacing = 120 / (level + 1);
            const verticalSpacing = 70;

            const currentNode = {
                key: node.key,
                x,
                y,
                color: node.color
            };

            let nodes = [currentNode];
            let edges = [];

            if (node.left) {
                const leftX = x - horizontalSpacing;
                const leftY = y + verticalSpacing;

                edges.push({
                    x1: x,
                    y1: y,
                    x2: leftX,
                    y2: leftY,
                    color: node.left.color
                });

                const leftSubtree = calculateTreeLayout(node.left, leftX, leftY, level + 1);
                nodes = [...nodes, ...leftSubtree.nodes];
                edges = [...edges, ...leftSubtree.edges];
            }

            if (node.right) {
                const rightX = x + horizontalSpacing;
                const rightY = y + verticalSpacing;

                edges.push({
                    x1: x,
                    y1: y,
                    x2: rightX,
                    y2: rightY,
                    color: node.right.color
                });

                const rightSubtree = calculateTreeLayout(node.right, rightX, rightY, level + 1);
                nodes = [...nodes, ...rightSubtree.nodes];
                edges = [...edges, ...rightSubtree.edges];
            }

            return { nodes, edges };
        };

        const layout = calculateTreeLayout(root);
        if (!layout) return null;

        const { nodes, edges } = layout;

        // Find min and max X to center the tree
        const minX = Math.min(...nodes.map(node => node.x));
        const maxX = Math.max(...nodes.map(node => node.x));
        const centerOffset = (minX + maxX) / 2;

        // Calculate the needed height based on tree depth
        const maxY = Math.max(...nodes.map(node => node.y)) + 20;
        // Calculate the needed width based on tree spread
        const treeWidth = Math.max(400, maxX - minX + 100);

        return (
            <div className="relative w-full" style={{ height: `${Math.max(300, maxY)}px` }}>
                <svg className="absolute top-0 left-0 w-full h-full" viewBox={`${-treeWidth / 2} -20 ${treeWidth} ${maxY + 40}`}>
                    {/* Draw edges */}
                    {edges.map((edge, index) => (
                        <line
                            key={`edge-${index}`}
                            x1={edge.x1 - centerOffset}
                            y1={edge.y1}
                            x2={edge.x2 - centerOffset}
                            y2={edge.y2}
                            stroke={edge.color ? '#f87171' : '#64748b'}
                            strokeWidth="2"
                        />
                    ))}

                    {/* Draw nodes */}
                    {nodes.map((node, index) => {
                        const isHighlighted = highlighted && highlighted.key === node.key;
                        let highlightColor = '#3b82f6'; // Default highlight color

                        if (isHighlighted && highlighted.operation) {
                            switch (highlighted.operation) {
                                case 'rotateLeft': highlightColor = '#ef4444'; break; // Red
                                case 'rotateRight': highlightColor = '#eab308'; break; // Yellow
                                case 'flipColors': highlightColor = '#8b5cf6'; break; // Purple
                                case 'insert': highlightColor = '#22c55e'; break; // Green
                                case 'remove': highlightColor = '#ef4444'; break; // Red
                                case 'update': highlightColor = '#3b82f6'; break; // Blue
                                default: highlightColor = '#3b82f6'; // Default blue
                            }
                        }

                        return (
                            <g key={`node-${index}`} transform={`translate(${node.x - centerOffset},${node.y})`}>
                                <circle
                                    r="15"
                                    fill={isHighlighted ? highlightColor : (node.color ? '#fff' : '#94a3b8')}
                                    stroke={node.color ? '#f87171' : '#334155'}
                                    strokeWidth={isHighlighted ? "3" : "2"}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x="0"
                                    y="5"
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill={isHighlighted ? '#fff' : '#334155'}
                                    className="transition-all duration-300"
                                >
                                    {node.key}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    const currentStep = operations[currentStepIndex] || { tree: null, message: "No operations performed yet", highlighted: null };

    return (
        <div>
            <Navbar />

            <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 max-w-6xl w-full mx-auto text-gray-800 mt-17 mb-10">

                <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Left-Leaning Red-Black Tree Visualization</h1>

                {/* Input Controls */}
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                    <div className="flex items-center backdrop-blur-md bg-white/30 rounded-lg shadow-sm overflow-hidden">
                        <input
                            type="text"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="Enter key (number)"
                            className="px-4 py-2 bg-transparent outline-none flex-grow"
                        />
                    </div>

                    <button
                        onClick={handleInsert}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                    >
                        Insert
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                    >
                        Delete
                    </button>
                </div>

                {/* Tree Visualization */}
                <div className="mb-6 border border-white/20 rounded-lg backdrop-blur-sm bg-white/10 shadow-inner overflow-auto">
                    <TreeVisualization root={currentStep.tree} highlighted={currentStep.highlighted} />
                </div>

                {/* Explanation Panel */}
                <div className="bg-indigo-100 backdrop-blur-lg p-4 rounded-lg shadow-sm mb-6 min-h-24 border border-indigo-400">
                    <h3 className="font-semibold mb-2">Step Explanation:</h3>
                    <p>{currentStep.message}</p>
                </div>

                {/* Animation Controls */}
                <div className="flex flex-wrap justify-center items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <label className="font-medium">Speed:</label>
                        <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                            className="w-24"
                        />
                        {/* <span>{animationSpeed}ms</span> */}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={prevStep}
                            disabled={currentStepIndex <= 0 || isAnimating}
                            className={`px-3 py-1 rounded-lg ${currentStepIndex <= 0 || isAnimating ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'
                                }`}
                        >
                            &lt; Prev
                        </button>

                        <button
                            onClick={toggleAutoPlay}
                            className={`px-3 py-1 rounded-lg ${autoPlay ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-green-100 hover:bg-green-200'
                                }`}
                        >
                            {autoPlay ? 'Pause' : 'Play'}
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={currentStepIndex >= operations.length - 1 || isAnimating}
                            className={`px-3 py-1 rounded-lg ${currentStepIndex >= operations.length - 1 || isAnimating ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'
                                }`}
                        >
                            Next &gt;
                        </button>
                    </div>

                    <div className="text-sm text-gray-600">
                        Step {operations.length > 0 ? currentStepIndex + 1 : 0} of {operations.length}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                        <span>Black Node</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-white border-2 border-red-400 mr-2"></div>
                        <span>Red Node</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-8 h-1 bg-red-400 mr-2"></div>
                        <span>Red Edge</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-8 h-1 bg-gray-500 mr-2"></div>
                        <span>Black Edge</span>
                    </div>
                </div>

                {/* Properties */}
                <div className="mt-6 p-4 bg-white/20 backdrop-blur-lg rounded-lg border border-gray-400">
                    <h3 className="font-semibold mb-2">LLRB Tree Properties:</h3>
                    <ul className="list-disc list-inside text-sm">
                        <li>No red right links - all red links lean left</li>
                        <li>No node has two red links connected to it</li>
                        <li>Perfect black balance - every path from root to null link has the same number of black links</li>
                        <li>The root is always black</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}