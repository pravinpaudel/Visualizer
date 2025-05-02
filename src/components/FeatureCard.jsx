import React from 'react'

const FeatureCard = ({ icon, title, description, color }) => {
    const bgColors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600"
    };

    return (
        <div className="flex flex-col items-center text-center bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all duration-300">
            <div className={`${bgColors[color]} p-4 rounded-full mb-4`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

export default FeatureCard
