import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';

const options: { value: Language; label: string; shortLabel: string }[] = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'ru', label: 'Русский', shortLabel: 'RU' },
];

export const Dropdown: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = options.find((o) => o.value === language)!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-[52px]"
        aria-label={t.language}
      >
        {current.shortLabel}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 z-10 w-[52px] min-w-0">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`flex w-full items-center justify-center px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${opt.value === language ? 'bg-primary/10 text-primary font-medium' : ''}`}
              onClick={() => { setLanguage(opt.value); setOpen(false); }}
            >
              {opt.shortLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
