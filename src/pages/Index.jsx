import { useState, useEffect } from 'react';
import { ChevronRight, Search, Layers, GitBranch, Database, SortAsc, Network, Code, Zap, BarChart2 } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { NavLink } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

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
          timeComplexity: 'O(log n)',
          icon: <Network size={24} />,
          color: 'bg-indigo-500'
        },
        {
          id: 'quicksort',
          name: 'Quick Sort',
          category: 'sorting',
          description: 'An efficient sorting algorithm that uses divide-and-conquer strategy.',
          timeComplexity: 'O(n^2) worst, O(n log n) average',
          icon: <SortAsc size={24} />,
          color: 'bg-blue-500'
        },
        {
          id: 'mergesort',
          name: 'Merge Sort',
          category: 'sorting',
          description: 'A divide and conquer algorithm that divides the input array into two halves and merges the sorted halves.',
          timeComplexity: 'O(n log n)',
          icon: <SortAsc size={24} />,
          color: 'bg-blue-600'
        },
        {
          id: 'llrbt',
          name: 'Left Leaning Red-Black Tree',
          category: 'data-structures',
          description: 'A self-balancing binary search tree with additional properties to maintain balance.',
          timeComplexity: 'O(log n)',
          icon: <GitBranch size={24} />,
          color: 'bg-red-500'
        },
        {
          id: 'heapsort',
          name: 'Heap Sort',
          category: 'sorting',
          description: 'A comparison-based sorting technique based on a binary heap data structure.',
          timeComplexity: 'O(n log n)',
          icon: <SortAsc size={24} />,
          color: 'bg-green-500'
        },
        {
          id: '#',
          name: 'Breadth-First Search',
          category: 'graph',
          description: 'An algorithm for traversing or searching tree or graph data structures.',
          timeComplexity: 'O(V + E)',
          icon: <Network size={24} />,
          color: 'bg-purple-500'
        },
        {
          id: '#',
          name: 'Depth-First Search',
          category: 'graph',
          description: 'An algorithm for traversing or searching tree or graph data structures.',
          timeComplexity: 'O(V + E)',
          icon: <Network size={24} />,
          color: 'bg-purple-600'
        },
        {
          id: 'dijkstra',
          name: 'Dijkstra\'s Algorithm',
          category: 'graph',
          description: 'An algorithm for finding the shortest paths between nodes in a graph.',
          timeComplexity: 'O((V + E) log V)',
          icon: <Network size={24} />,
          color: 'bg-yellow-500'
        },
        {
          id: 'kruskal',
          name: 'Kruskal\'s Algorithm',
          category: 'graph',
          description: 'An algorithm for finding the minimum spanning tree of a connected, weighted graph.',
          timeComplexity: 'O(E log E)',
          icon: <Network size={24} />,
          color: 'bg-yellow-500'
        },
        // {
        //   id: '#',
        //   name: 'Binary Search',
        //   category: 'searching',
        //   description: 'A search algorithm that finds the position of a target value within a sorted array.',
        //   timeComplexity: 'O(log n)',
        //   icon: <Search size={24} />,
        //   color: 'bg-blue-400'
        // },
        // {
        //   id: '#',
        //   name: 'AVL Tree',
        //   category: 'data-structures',
        //   description: 'A self-balancing binary search tree where the heights of the two child subtrees differ by at most one.',
        //   timeComplexity: 'O(log n)',
        //   icon: <GitBranch size={24} />,
        //   color: 'bg-green-600'
        // },

        // {
        //   id: '#',
        //   name: 'Hash Table',
        //   category: 'data-structures',
        //   description: 'A data structure that implements an associative array abstract data type.',
        //   timeComplexity: 'O(1) average',
        //   icon: <Database size={24} />,
        //   color: 'bg-blue-300'
        // },

        {
          id: '#',
          name: 'Dynamic Programming',
          category: 'technique',
          description: 'A method for solving complex problems by breaking them down into simpler subproblems.',
          timeComplexity: 'Varies',
          icon: <Code size={24} />,
          color: 'bg-purple-600'
        },
        {
          id: 'nqueens',
          name: 'N-Queens Problem',
          category: 'Backtracking',
          description: 'The problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.',
          timeComplexity: 'O(N!)',
          icon: <Code size={24} />,
          color: 'bg-purple-600'
        }
      ];
      
      setAlgorithms(data);
      setFilteredAlgorithms(data);
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter algorithms based on search term and active category
  useEffect(() => {
    let results = algorithms;
    setIsLoading(true);

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
    setIsLoading(false);
  }, [searchTerm, activeCategory, algorithms]);

  // Get unique categories from algorithms
  const categories = [
    { id: 'all', name: 'All Algorithms', icon: <Layers size={18} /> },
    { id: 'sorting', name: 'Sorting', icon: <SortAsc size={18} /> },
    { id: 'searching', name: 'Searching', icon: <Search size={18} /> },
    { id: 'graph', name: 'Graph Algorithms', icon: <Network size={18} /> },
    { id: 'data-structures', name: 'Data Structures', icon: <Database size={18} /> },
    { id: 'technique', name: 'Techniques', icon: <Code size={18} /> }
  ];

  // Handle algorithm card click
  const handleAlgorithmClick = (algorithmId) => {
    // In a real app, this would navigate to the algorithm visualizer page
    console.log(`Navigating to ${algorithmId} visualizer`);
    window.location.href = `/${algorithmId}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar className="relative z-10 shadow-lg mb-50" />
      
      {/* Hero Section with Glassmorphism */}
      <div className="bg-gradient-to-b from-blue-300 to-indigo-600 relative overflow-hidden mt-17">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-indigo-600 opacity-20"></div>
          {/* Abstract pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 800 800">
            <path d="M0,0 L800,0 L800,800 L0,800 Z" fill="none" stroke="white" strokeWidth="1"></path>
            <path d="M0,400 C175,300 275,100 400,100 C525,100 625,300 800,400 C625,500 525,700 400,700 C275,700 175,500 0,400 Z" fill="none" stroke="white" strokeWidth="2"></path>
            <circle cx="400" cy="400" r="200" fill="none" stroke="white" strokeWidth="2"></circle>
            <circle cx="400" cy="400" r="300" fill="none" stroke="white" strokeWidth="1"></circle>
            <circle cx="400" cy="400" r="100" fill="none" stroke="white" strokeWidth="1"></circle>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Visualize and Learn Algorithms</h1>
            <p className="text-indigo-100 text-xl mb-8">
              Interactive visualizations make complex algorithms easy to understand. 
              See how they work step by step.
            </p>
            
            {/* Search bar with glassmorphism */}
            <div className="relative max-w-lg bg-white/20 backdrop-blur-md rounded-lg p-1 shadow-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-white" />
              </div>
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg text-white placeholder-indigo-200 
                           border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category filter tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="inline-flex space-x-2 min-w-full pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all shadow-sm
                             ${activeCategory === category.id
                               ? 'bg-indigo-600 text-white shadow-md'
                               : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white'}`}
                >
                  <span>{category.icon}</span>
                  <span className="ml-2">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Algorithms Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 animate-pulse">
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
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
                             cursor-pointer overflow-hidden group"
                >
                  <div className={`h-1 ${algorithm.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {algorithm.name}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm">{algorithm.description}</p>
                      </div>
                      <div className={`${algorithm.color} text-white p-2 rounded-lg`}>
                        {algorithm.icon}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                        {algorithm.timeComplexity}
                      </span>
                      <div className="text-indigo-600 group-hover:translate-x-1 transition-transform duration-300">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-xl shadow-md">
              <div className="text-indigo-300 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700">No algorithms found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Feature highlights */}
          <div className="mt-16 bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-8 text-center">Why Use Visualgo?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<Zap size={32} />} 
                  title="Interactive Learning"
                  description="See algorithms in action with step-by-step visualization and intuitive controls."
                  color="blue"
                />
                
                <FeatureCard 
                  icon={<BarChart2 size={32} />} 
                  title="Performance Analysis"
                  description="Compare algorithm efficiency with real-time performance metrics and insights."
                  color="green"
                />
                
                <FeatureCard 
                  icon={<Code size={32} />} 
                  title="Code Implementation"
                  description="View the actual code implementation alongside the visual representation."
                  color="purple"
                />
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-indigo-600 bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-4">
              Start exploring today
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to visualize your first algorithm?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Dive into our collection of interactive visualizations and transform the way you understand algorithms and data structures.
            </p>
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium">
             <NavLink to="/mergesort">Get Started</NavLink> 
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}