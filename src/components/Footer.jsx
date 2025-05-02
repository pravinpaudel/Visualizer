import React from 'react'

const Footer = () => {
  return (
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Visualgo</h2>
              <p className="text-gray-400 text-sm mt-1">Learn algorithms through interactive visualization</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Visualgo. All rights reserved.</p>
          </div>
        </div>
      </div>
  )
}

export default Footer
