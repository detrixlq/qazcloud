import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-2">
    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0ms]" />
    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:150ms]" />
    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:300ms]" />
  </div>
);
