import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const MIN_ROWS = 1;
const MAX_ROWS = 6;

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export interface InputBarRef {
  focus: () => void;
}

export const InputBar = forwardRef<InputBarRef, InputBarProps>(function InputBar({ onSend, disabled }, ref) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }), []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const rows = Math.min(Math.max(MIN_ROWS, ta.value.split('\n').length), MAX_ROWS);
    ta.rows = rows;
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/50 p-2 shadow-sm dark:border-gray-600 dark:from-gray-800 dark:to-gray-800/80">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.typeMessage}
        rows={MIN_ROWS}
        className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border-0 bg-transparent px-3 py-2 text-sm outline-none focus:ring-0 dark:bg-transparent"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-emerald-600 text-white shadow-sm hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        aria-label={t.send}
      >
        <Send size={18} />
      </button>
    </div>
  );
});
