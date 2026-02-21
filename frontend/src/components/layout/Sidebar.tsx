import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronLeft, Stethoscope } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChat } from '../../contexts/ChatContext';
import { HistoryList } from '../history/HistoryList';

const SIDEBAR_WIDTH = 280;
const STRIP_WIDTH = 56;

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const { t } = useLanguage();
  const { dispatch } = useChat();

  const handleNewChat = () => {
    dispatch({ type: 'NEW_CHAT' });
  };

  return (
    <aside
      className="flex shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-gradient-to-b from-white to-gray-50/80 transition-[width] duration-300 ease-in-out dark:border-gray-700 dark:from-gray-800 dark:to-gray-900/80"
      style={{ width: expanded ? SIDEBAR_WIDTH : STRIP_WIDTH }}
    >
      <div className="flex h-full min-h-0 flex-1 flex-row" style={{ minWidth: SIDEBAR_WIDTH }}>
        {/* Left strip: expand button, bar, and + (visible when collapsed) */}
        <div className="flex shrink-0 flex-col items-center border-r border-gray-200 pt-2 dark:border-gray-700" style={{ width: STRIP_WIDTH }}>
            {expanded ? (
              <div className="flex h-14 w-full items-center justify-center" aria-hidden />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  aria-label="Open sidebar"
                  title="Open sidebar"
                >
                  <ChevronRight size={22} />
                </button>
                <div className="my-1 h-px w-8 bg-gray-200 dark:bg-gray-600" aria-hidden />
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-opacity duration-200"
                  aria-label={t.newChat}
                  title={t.newChat}
                >
                  <Plus size={22} />
                </button>
              </>
            )}
          </div>
        {/* Main sidebar content: slides out when collapsed */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ width: SIDEBAR_WIDTH - STRIP_WIDTH }}>
            <div className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 px-3 dark:border-gray-700">
              <Stethoscope className="h-6 w-6 shrink-0 text-primary" aria-hidden />
              <span className="truncate font-semibold text-gray-900 dark:text-gray-100">ProtoCol</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-auto rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleNewChat}
              className="mx-2 mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-emerald-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95 transition-opacity"
            >
              <Plus size={18} />
              {t.newChat}
            </button>
            <HistoryList />
            </div>
        </div>
    </aside>
  );
};
