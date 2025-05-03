import React from 'react'

const SocialLink = ({ href, icon }) => {
  return (
        <a
          href={href}
          className="bg-white/80 hover:bg-indigo-600 p-2 rounded-full text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {icon}
        </a>
      );
}

export default SocialLink
