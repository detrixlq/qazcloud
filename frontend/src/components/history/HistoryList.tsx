import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { HistoryItem } from './HistoryItem';

export const HistoryList: React.FC = () => {
  const { chats, currentChatId, dispatch } = useChat();
  const { t } = useLanguage();

  const pinned = chats.filter((c) => c.pinned);
  const unpinned = chats.filter((c) => !c.pinned);

  const handleSelect = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      dispatch({ type: 'LOAD_CHAT', payload: { id: chat.id, messages: chat.messages } });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-3 p-2">
      {chats.length === 0 ? (
        <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">No chats yet.</p>
      ) : (
        <>
          {pinned.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t.pinnedSection}
              </p>
              {pinned.map((chat) => (
                <HistoryItem
                  key={chat.id}
                  chat={chat}
                  isActive={currentChatId === chat.id}
                  onSelect={() => handleSelect(chat.id)}
                />
              ))}
            </div>
          )}
          {unpinned.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t.myChatsSection}
              </p>
              {unpinned.map((chat) => (
                <HistoryItem
                  key={chat.id}
                  chat={chat}
                  isActive={currentChatId === chat.id}
                  onSelect={() => handleSelect(chat.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
