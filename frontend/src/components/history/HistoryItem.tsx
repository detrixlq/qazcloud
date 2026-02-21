import React from 'react';
import { Pin, PinOff, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChat } from '../../contexts/ChatContext';
import { formatChatTime } from '../../utils/formatters';
import { IconButton } from '../ui/IconButton';
import * as mockApi from '../../services/mockApi';
import type { Chat } from '../../contexts/ChatContext';

interface HistoryItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ chat, isActive, onSelect }) => {
  const { t } = useLanguage();
  const { dispatch } = useChat();

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !chat.pinned;
    mockApi.pinChat(chat.id, next);
    dispatch({ type: 'PIN_CHAT', payload: { id: chat.id, pinned: next } });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    mockApi.deleteChat(chat.id);
    dispatch({ type: 'DELETE_CHAT', payload: chat.id });
  };

  const timeStr = formatChatTime(new Date(chat.timestamp), t.today);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isActive
          ? 'bg-primary/15 text-primary dark:bg-primary/20'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${chat.pinned ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{chat.title}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{timeStr}</p>
      </div>
      <div className="flex shrink-0 items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          onClick={handlePin}
          aria-label={t.pin}
          title={chat.pinned ? 'Unpin' : t.pin}
        >
          {chat.pinned ? <Pin size={16} className="fill-current" /> : <PinOff size={16} />}
        </IconButton>
        <IconButton onClick={handleDelete} aria-label={t.delete} title={t.delete}>
          <Trash2 size={16} />
        </IconButton>
      </div>
    </div>
  );
};
