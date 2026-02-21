import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  'aria-label': string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  children,
  title,
  'aria-label': ariaLabel,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={ariaLabel}
    className={`rounded-lg p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-colors ${className}`}
  >
    {children}
  </button>
);
