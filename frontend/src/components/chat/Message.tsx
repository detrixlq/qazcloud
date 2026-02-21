import React from 'react';
import { Bot, User } from 'lucide-react';
import type { Message as MessageType } from '../../contexts/ChatContext';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
        {isUser ? <User size={16} /> : <Bot size={16} className="text-primary" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-primary to-emerald-600 text-white'
            : 'bg-gradient-to-b from-gray-200 to-gray-100 text-gray-900 dark:from-gray-700 dark:to-gray-600 dark:text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
    </div>
  );
};
