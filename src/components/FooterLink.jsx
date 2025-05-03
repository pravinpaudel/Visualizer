import React from 'react'
import { ArrowRight } from "lucide-react";

const FooterLink = ({ href, children }) => {
    return (
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
}

export default FooterLink
