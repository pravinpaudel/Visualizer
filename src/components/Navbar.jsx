import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Home, BarChart2, BookOpen, Code, Settings, GitBranch, Search } from "lucide-react";

// Main Navigation Bar Component
export default function VisualgoNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (menu) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/70 backdrop-blur-lg shadow-md" : "bg-white/50 backdrop-blur-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <GitBranch className="h-8 w-8 text-indigo-600" />
                <span className="font-bold text-xl text-indigo-700">Visualgo</span>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink icon={<Home size={18} />} href="/">Home</NavLink>
              
              {/* Algorithms dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('algorithms')}
                  className="group flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <BarChart2 size={18} className="mr-2" />
                  Algorithms
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transform transition-transform duration-200 ${activeDropdown === 'algorithms' ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {activeDropdown === 'algorithms' && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="py-1">
                      <DropdownItem href="#">Sorting Algorithms</DropdownItem>
                      <DropdownItem href="#">Graph Algorithms</DropdownItem>
                      <DropdownItem href="#">Tree Structures</DropdownItem>
                      <DropdownItem href="#">Dynamic Programming</DropdownItem>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tutorials dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('tutorials')}
                  className="group flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <BookOpen size={18} className="mr-2" />
                  Tutorials
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transform transition-transform duration-200 ${activeDropdown === 'tutorials' ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {activeDropdown === 'tutorials' && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="py-1">
                      <DropdownItem href="#">Beginner's Guide</DropdownItem>
                      <DropdownItem href="#">Advanced Concepts</DropdownItem>
                      <DropdownItem href="#">Practice Problems</DropdownItem>
                    </div>
                  </div>
                )}
              </div>
              
              <NavLink icon={<Code size={18} />} href="#">Playground</NavLink>
              <NavLink icon={<Settings size={18} />} href="#">Settings</NavLink>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-transparent rounded-md bg-gray-100 focus:outline-none focus:bg-white focus:border-indigo-300 transition duration-150 text-sm"
                placeholder="Search algorithms..."
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm shadow-lg">
          <MobileNavLink onClick={handleLinkClick} icon={<Home size={18} />} href="#">Home</MobileNavLink>
          
          {/* Mobile Algorithms dropdown */}
          <button 
            onClick={() => toggleDropdown('mobile-algorithms')}
            className="w-full flex items-center justify-between text-gray-700 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
          >
            <div className="flex items-center">
              <BarChart2 size={18} className="mr-2" />
              Algorithms
            </div>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform duration-200 ${activeDropdown === 'mobile-algorithms' ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {activeDropdown === 'mobile-algorithms' && (
            <div className="pl-6 space-y-1">
              <MobileDropdownItem onClick={handleLinkClick} href="#">Sorting Algorithms</MobileDropdownItem>
              <MobileDropdownItem onClick={handleLinkClick} href="#">Graph Algorithms</MobileDropdownItem>
              <MobileDropdownItem onClick={handleLinkClick} href="#">Tree Structures</MobileDropdownItem>
              <MobileDropdownItem onClick={handleLinkClick} href="#">Dynamic Programming</MobileDropdownItem>
            </div>
          )}
          
          {/* Mobile Tutorials dropdown */}
          <button 
            onClick={() => toggleDropdown('mobile-tutorials')}
            className="w-full flex items-center justify-between text-gray-700 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
          >
            <div className="flex items-center">
              <BookOpen size={18} className="mr-2" />
              Tutorials
            </div>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform duration-200 ${activeDropdown === 'mobile-tutorials' ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {activeDropdown === 'mobile-tutorials' && (
            <div className="pl-6 space-y-1">
              <MobileDropdownItem onClick={handleLinkClick} href="#">Beginner's Guide</MobileDropdownItem>
              <MobileDropdownItem onClick={handleLinkClick} href="#">Advanced Concepts</MobileDropdownItem>
              <MobileDropdownItem onClick={handleLinkClick} href="#">Practice Problems</MobileDropdownItem>
            </div>
          )}
          
          <MobileNavLink onClick={handleLinkClick} icon={<Code size={18} />} href="#">Playground</MobileNavLink>
          <MobileNavLink onClick={handleLinkClick} icon={<Settings size={18} />} href="#">Settings</MobileNavLink>
          
          {/* Mobile search */}
          <div className="px-3 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:bg-white focus:border-indigo-300 transition duration-150 text-sm"
                placeholder="Search algorithms..."
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navigation link component for desktop
const NavLink = ({ href, children, icon }) => (
  <a
    href={href}
    className="group flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
  </a>
);

// Dropdown item component
const DropdownItem = ({ href, children }) => (
  <a
    href={href}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150"
  >
    {children}
  </a>
);

// Mobile navigation link component
const MobileNavLink = ({ href, children, icon, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="flex items-center text-gray-700 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </a>
);

// Mobile dropdown item component
const MobileDropdownItem = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="block py-2 pl-4 pr-4 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded transition duration-150"
  >
    {children}
  </a>
);
