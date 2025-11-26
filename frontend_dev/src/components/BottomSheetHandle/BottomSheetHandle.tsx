// components/BottomSheetHandle/BottomSheetHandle.tsx
import React from "react";

interface BottomSheetHandleProps {
  onClick?: () => void;
  state?: "medium" | "full";
}

const BottomSheetHandle: React.FC<BottomSheetHandleProps> = ({
  onClick,
  state = "medium",
}) => {
  return (
    <div
      className="flex flex-col items-center py-2 cursor-pointer border-b border-gray-200"
      onClick={onClick}
    >
      {/* Chevron icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-gray-400"
      >
        {state === "medium" ? (
          // Chevron up - for expanding to full
          <path
            d="M18 15L12 9L6 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          // Chevron down - for collapsing to medium
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
};

export default BottomSheetHandle;
