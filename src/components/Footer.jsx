import React from "react";
import { 
  GitBranch, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  ArrowRight,
  Heart
} from "lucide-react";

export default function VisualgoFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-indigo-100 backdrop-blur-sm border-t border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and about section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-7 w-7 text-indigo-600" />
              <span className="font-bold text-xl text-indigo-700">Visualgo</span>
            </div>
            <p className="text-gray-600 text-sm">
              Interactive visualizations for learning algorithms and data structures.
              Designed to make computer science concepts clearer through animation.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialLink href="#" icon={<Github size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Linkedin size={18} />} />
              <SocialLink href="#" icon={<Youtube size={18} />} />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-indigo-800 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Home</FooterLink>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Algorithms</FooterLink>
              <FooterLink href="#">Tutorials</FooterLink>
              <FooterLink href="#">Playground</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-indigo-800 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Community Forum</FooterLink>
              <FooterLink href="#">Contribute</FooterLink>
              <FooterLink href="#">Feedback</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-indigo-800 font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest algorithm visualizations and tutorials.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 w-full rounded-l-md border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/80 text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md px-4 py-2 transition-colors duration-200 flex items-center"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-indigo-100 my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Visualgo. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-indigo-600 transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors duration-200">Cookies</a>
          </div>
        </div>
        
        {/* Made with love */}
        <div className="text-center mt-8 text-xs text-gray-400 flex items-center justify-center">
          <span>Made with</span>
          <Heart size={12} className="mx-1 text-red-500 inline" />
          <span>for algorithm enthusiasts</span>
        </div>
      </div>
    </footer>
  );
}

// Social media link component
const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    className="bg-white/80 hover:bg-indigo-600 p-2 rounded-full text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
  >
    {icon}
  </a>
);

// Footer link component
const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center group"
    >
      <span className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:-translate-x-2 transition-all duration-200">
        <ArrowRight size={12} className="inline mr-1" />
      </span>
      {children}
    </a>
  </li>
);