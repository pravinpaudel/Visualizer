import React from 'react'

const ArrayVisualization = ({ step, originalArray }) => {
    const maxValue = Math.max(...originalArray) * 1.2;
    return (
        <div className="mb-8">
            <div className="flex items-end justify-center h-64 space-x-2">
                {step.array.map((value, index) => {
                    // Determine element styling based on the current step
                    let bgColor = 'bg-blue-500';
                    let textColor = 'text-white';

                    // Highlight elements based on the current step type
                    if (step.type === 'divide') {
                        if (index >= step.start && index <= step.end) {
                            bgColor = 'bg-indigo-500';
                            if (index === step.mid) bgColor = 'bg-red-400';
                        } else {
                            bgColor = 'bg-gray-300';
                        }
                    } else if (['compare', 'remaining', 'before-merge', 'after-merge'].includes(step.type)) {
                        if (index >= step.start && index <= step.end) {
                            bgColor = 'bg-green-500';
                        } else {
                            bgColor = 'bg-gray-300';
                        }
                    } else if (step.type === 'complete') {
                        bgColor = 'bg-green-500';
                    }

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center"
                        >
                            <div
                                className={`${bgColor} w-12 rounded-t-md transition-all duration-300 flex items-end justify-center ${textColor} font-semibold`}
                                style={{ height: `${(value / maxValue) * 200}px` }}
                            >
                                {value}
                            </div>
                            <div className="text-xs mt-1 text-gray-500">{index}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



export default ArrayVisualization
