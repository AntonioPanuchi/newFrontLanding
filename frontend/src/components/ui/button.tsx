import React from 'react';

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="px-3 py-1 rounded bg-sky-600 text-white text-sm hover:bg-sky-700 transition-all"
    >
      {children}
    </button>
  );
}
