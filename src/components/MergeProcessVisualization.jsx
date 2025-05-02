import React from 'react'

const MergeProcessVisualization = ({ step }) => {
    if (!['compare', 'remaining', 'before-merge', 'after-merge'].includes(step.type)) {
        return null;
      }
  return (
    <div className="mt-8 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Merge Process</h3>
      
      {/* Left and Right subarrays */}
      {(step.type === 'compare' || step.type === 'remaining' || step.type === 'before-merge') && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Left Subarray</p>
            <div className="flex space-x-2">
              {step.left.map((value, idx) => (
                <div
                  key={`left-${idx}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    step.type === 'compare' && step.leftIndex === idx && step.result === 'left'
                      ? 'bg-green-500 text-white'
                      : step.type === 'compare' && step.leftIndex === idx
                      ? 'bg-yellow-300'
                      : step.type === 'remaining' && step.leftIndex === idx
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-100'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Right Subarray</p>
            <div className="flex space-x-2">
              {step.right.map((value, idx) => (
                <div
                  key={`right-${idx}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    step.type === 'compare' && step.rightIndex === idx && step.result === 'right'
                      ? 'bg-green-500 text-white'
                      : step.type === 'compare' && step.rightIndex === idx
                      ? 'bg-yellow-300'
                      : step.type === 'remaining' && step.rightIndex === idx
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-100'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Merged array */}
      {(step.type === 'compare' || step.type === 'remaining' || step.type === 'after-merge') && step.merged && (
        <div className="p-3 bg-indigo-50 rounded-md">
          <p className="text-sm text-gray-500 mb-2">Merged Result</p>
          <div className="flex flex-wrap space-x-2">
            {step.merged.map((value, idx) => (
              <div
                key={`merged-${idx}`}
                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                  (step.type === 'compare' || step.type === 'remaining') && 
                  idx === step.merged.length - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-100'
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MergeProcessVisualization
