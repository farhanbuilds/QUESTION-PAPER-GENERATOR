import React from "react";

export default function SkeletonCard() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
      {/* Icon Placeholder */}
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
        </div>

        {/* Text Placeholder */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
          <div className="flex items-center space-x-4 mt-1">
            <div className="h-3 w-20 bg-gray-200 rounded-md"></div>
            <div className="h-3 w-20 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Button Placeholder */}
      <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
    </div>
  );
}
