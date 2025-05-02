import React from 'react'

const RecursionTreeVisualization = ({ step, array, treeHeight }) => {

    const renderTreeNode = (start, end, depth, currentLevel = 0) => {
        if (currentLevel > depth || start > end) {
            return null;
        }

        const isHighlighted =
            step.type &&
            step.start === start &&
            step.end === end &&
            step.depth === currentLevel;

        const mid = Math.floor((start + end) / 2);
        const subArray = array.slice(start, end + 1);

        return (
            <div className="flex flex-col items-center">
                <div
                    className={`px-2 py-1 mb-2 rounded-md text-xs border ${isHighlighted
                            ? 'bg-indigo-100 border-indigo-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                >
                    [{subArray.join(', ')}]
                </div>

                {start < end && currentLevel < depth && (
                    <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-gray-300"></div>
                            {renderTreeNode(start, mid, depth, currentLevel + 1)}
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-gray-300"></div>
                            {renderTreeNode(mid + 1, end, depth, currentLevel + 1)}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-max">
                {renderTreeNode(0, array.length - 1, treeHeight, 0)}
            </div>
        </div>
    );
}


export default RecursionTreeVisualization
