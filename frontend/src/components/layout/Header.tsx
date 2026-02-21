import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Header: React.FC = () => (
  <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-gray-200 bg-gradient-to-r from-white/95 to-gray-50/90 px-4 backdrop-blur-sm dark:from-gray-800/95 dark:to-gray-900/90 dark:border-gray-700">
    <Dropdown />
    <ThemeToggle />
  </header>
);
