import React from "react";

export function SectionDivider() {
  return (
    <div className="w-full flex justify-center items-center py-12 opacity-40">
      <div className="h-px bg-primary/30 flex-grow max-w-[200px]" />
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-6 text-primary"
      >
        <path
          d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
          fill="currentColor"
        />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>
      <div className="h-px bg-primary/30 flex-grow max-w-[200px]" />
    </div>
  );
}

export function DecorativeBorder() {
  return (
    <div className="w-full h-4 opacity-30 flex gap-2 overflow-hidden justify-center bg-repeat-x bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMEwyMCAxMEwxMCAyMEwwIDEwTDEwIDBaIiBmaWxsPSIjOUI2QjUyIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]" />
  );
}
