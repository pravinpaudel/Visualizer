import { useState, useEffect } from 'react';
import { ChevronRight, Search, Filter, Code, Layers, GitBranch, Database, SortAsc, BarChart2, Network, Lock, Zap } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Main Home Page Component
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [algorithms, setAlgorithms] = useState([]);
  const [filteredAlgorithms, setFilteredAlgorithms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated algorithm data - in a real app, this might come from an API
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const data = [
        {
          id: 'unionfind',
          name: 'Union-Find',
          category: 'data-structures',
          description: 'A disjoint-set data structure that tracks a set of elements partitioned into disjoint subsets.',
          difficulty: 'medium',
          timeComplexity: 'O(α(n))',
          icon: <Network size={24} />,
          color: 'bg-indigo-500'
        },
        {
          id: 'quicksort',
          name: 'Quick Sort',
          category: 'sorting',
          description: 'An efficient sorting algorithm that uses divide-and-conquer strategy.',
          difficulty: 'medium',
          timeComplexity: 'O(n log n)',
          icon: <SortAsc size={24} />,
          color: 'bg-blue-500'
        },
        {
          id: 'mergesort',
          name: 'Merge Sort',
          category: 'sorting',
          description: 'A divide and conquer algorithm that divides the input array into two halves and merges the sorted halves.',
          difficulty: 'medium',
          timeComplexity: 'O(n log n)',
          icon: <SortAsc size={24} />,
          color: 'bg-blue-600'
        },
        {
          id: 'llrbt',
          name: 'Left Leaning Red-Black Tree',
          category: 'data-structures',
          description: 'A self-balancing binary search tree with additional properties to maintain balance.',
          difficulty: 'hard',
          timeComplexity: 'O(log n)',
          icon: <GitBranch size={24} />,
          color: 'bg-red-500'
        },
        {
          id: 'heap-sort',
          name: 'Heap Sort',
          category: 'sorting',
          description: 'A comparison-based sorting technique based on a binary heap data structure.',
          difficulty: 'medium',
          timeComplexity: 'O(n log n)',
          icon: <SortAsc size={24} />,
          color: 'bg-green-500'
        },
        {
          id: 'bfs',
          name: 'Breadth-First Search',
          category: 'graph',
          description: 'An algorithm for traversing or searching tree or graph data structures.',
          difficulty: 'easy',
          timeComplexity: 'O(V + E)',
          icon: <Network size={24} />,
          color: 'bg-purple-500'
        },
        {
          id: 'dfs',
          name: 'Depth-First Search',
          category: 'graph',
          description: 'An algorithm for traversing or searching tree or graph data structures.',
          difficulty: 'easy',
          timeComplexity: 'O(V + E)',
          icon: <Network size={24} />,
          color: 'bg-purple-600'
        },
        {
          id: 'dijkstra',
          name: 'Dijkstra\'s Algorithm',
          category: 'graph',
          description: 'An algorithm for finding the shortest paths between nodes in a graph.',
          difficulty: 'medium',
          timeComplexity: 'O((V + E) log V)',
          icon: <Network size={24} />,
          color: 'bg-yellow-500'
        },
        {
          id: 'binary-search',
          name: 'Binary Search',
          category: 'searching',
          description: 'A search algorithm that finds the position of a target value within a sorted array.',
          difficulty: 'easy',
          timeComplexity: 'O(log n)',
          icon: <Search size={24} />,
          color: 'bg-blue-400'
        },
        {
          id: 'avl-tree',
          name: 'AVL Tree',
          category: 'data-structures',
          description: 'A self-balancing binary search tree where the heights of the two child subtrees differ by at most one.',
          difficulty: 'hard',
          timeComplexity: 'O(log n)',
          icon: <GitBranch size={24} />,
          color: 'bg-green-600'
        },
        {
          id: 'dynamic-programming',
          name: 'Dynamic Programming',
          category: 'technique',
          description: 'A method for solving complex problems by breaking them down into simpler subproblems.',
          difficulty: 'hard',
          timeComplexity: 'Varies',
          icon: <Code size={24} />,
          color: 'bg-pink-500'
        },
        {
          id: 'hash-table',
          name: 'Hash Table',
          category: 'data-structures',
          description: 'A data structure that implements an associative array abstract data type.',
          difficulty: 'medium',
          timeComplexity: 'O(1) average',
          icon: <Database size={24} />,
          color: 'bg-blue-300'
        }
      ];
      
      setAlgorithms(data);
      setFilteredAlgorithms(data);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter algorithms based on search term and active category
  useEffect(() => {
    let results = algorithms;
    
    if (searchTerm) {
      results = results.filter(algo => 
        algo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        algo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory !== 'all') {
      results = results.filter(algo => algo.category === activeCategory);
    }
    
    setFilteredAlgorithms(results);
  }, [searchTerm, activeCategory, algorithms]);

  // Get unique categories from algorithms
  const categories = [
    { id: 'all', name: 'All Algorithms', icon: <Layers size={16} /> },
    { id: 'sorting', name: 'Sorting', icon: <SortAsc size={16} /> },
    { id: 'searching', name: 'Searching', icon: <Search size={16} /> },
    { id: 'graph', name: 'Graph Algorithms', icon: <Network size={16} /> },
    { id: 'data-structures', name: 'Data Structures', icon: <Database size={16} /> },
    { id: 'technique', name: 'Techniques', icon: <Code size={16} /> }
  ];

  // Handle algorithm card click
  const handleAlgorithmClick = (algorithmId) => {
    // In a real app, this would navigate to the algorithm visualizer page
    console.log(`Navigating to ${algorithmId} visualizer`);
     window.location.href = `/${algorithmId}`;
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Header with glossy effect */}
      {/* <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Algorithm Visualizer</h1>
              <p className="text-blue-100 mt-1">Interactive learning through visualization</p>
            </div>
            
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 text-white 
                           placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 
                           focus:ring-white focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-blue-200">
                <Search size={18} />
              </div>
            </div>
          </div>
        </div>
      </header> */}

      
      <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 text-white 
                           placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 
                           focus:ring-white focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-blue-200">
                <Search size={18} />
              </div>
            </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Category filter tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-flex space-x-2 min-w-full pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all
                           ${activeCategory === category.id
                             ? 'bg-blue-600 text-white shadow-md'
                             : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Algorithms Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-10"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAlgorithms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlgorithms.map(algorithm => (
              <div
                key={algorithm.id}
                onClick={() => handleAlgorithmClick(algorithm.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
                           cursor-pointer overflow-hidden group"
              >
                <div className={`h-2 ${algorithm.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {algorithm.name}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm">{algorithm.description}</p>
                    </div>
                    <div className={`${algorithm.color} text-white p-2 rounded-lg`}>
                      {algorithm.icon}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(algorithm.difficulty)}`}>
                        {algorithm.difficulty.charAt(0).toUpperCase() + algorithm.difficulty.slice(1)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {algorithm.timeComplexity}
                      </span>
                    </div>
                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">No algorithms found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Feature highlights */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Use Our Algorithm Visualizer?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">See algorithms in action with step-by-step visualization and controls.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                <BarChart2 size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Analysis</h3>
              <p className="text-gray-600">Compare algorithm efficiency with real-time performance metrics.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 text-purple-600 p-4 rounded-full mb-4">
                <Code size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Code Implementation</h3>
              <p className="text-gray-600">View the actual code implementation alongside the visualization.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
        <Footer />
    </div>
  );
}