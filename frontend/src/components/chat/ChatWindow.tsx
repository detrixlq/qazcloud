import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Message } from './Message';
import { DiagnosisMessage } from './DiagnosisMessage';
import { TypingIndicator } from './TypingIndicator';
import { InputBar, type InputBarRef } from './InputBar';
import * as chatApi from '../../services/chatApi';
import * as api from '../../services/api';
import { previewFromMessages } from '../../utils/formatters';
import type { Message as MessageType } from '../../contexts/ChatContext';

function nextMessageId(): string {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

export const ChatWindow: React.FC = () => {
  const { messages, isThinking, currentChatId, chats, dispatch } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<InputBarRef>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (text: string) => {
    let chatId = currentChatId;
    if (!chatId) {
      const chat = await chatApi.createChat();
      chatId = chat.id;
      dispatch({ type: 'ADD_CHAT', payload: chat });
      dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId });
    }

    const userMsg: MessageType = {
      id: nextMessageId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    dispatch({ type: 'APPEND_MESSAGE', payload: userMsg });
    await chatApi.addMessageToChat(chatId, userMsg);

    const chat = chats.find((c) => c.id === chatId);
    if (chat && (chat.title === 'New chat' || chat.title === 'New Chat')) {
      const preview = previewFromMessages([...messages, userMsg]);
      dispatch({ type: 'UPDATE_CHAT_TITLE', payload: { id: chatId, title: preview } });
    }

    dispatch({ type: 'SET_THINKING', payload: true });
    try {
      const diagnosesRes = await api.diagnose(text);
      const diagnoses = diagnosesRes.diagnoses ?? [];
      const primary = diagnoses.find((d) => d.rank === 1);
      let detailsSections: Array<{ title: string; items: string[] }> | undefined;
      if (primary) {
        try {
          const detailsRes = await api.diagnoseDetails(text, primary.icd10_code);
          detailsSections = detailsRes.sections ?? [];
        } catch {
          detailsSections = [];
        }
      }
      const content = diagnoses.length > 0
        ? 'По описанию возможны следующие варианты диагнозов:'
        : 'Не удалось подобрать диагнозы. Опишите симптомы подробнее.';
      const assistantMsg: MessageType = {
        id: nextMessageId(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        ...(diagnoses.length > 0 && {
          diagnosisData: {
            diagnoses,
            ...(detailsSections?.length ? { detailsSections } : {}),
          },
        }),
      };
      dispatch({ type: 'APPEND_MESSAGE', payload: assistantMsg });
      await chatApi.addMessageToChat(chatId!, assistantMsg);

      if (primary) {
        const title = primary.diagnosis;
        dispatch({ type: 'UPDATE_CHAT_TITLE', payload: { id: chatId!, title } });
        chatApi.updateChatTitle(chatId!, title).catch(() => {});
      }
    } catch (err) {
      const errorContent = err instanceof Error ? err.message : 'Ошибка при обращении к серверу. Проверьте, что бэкенд запущен.';
      const assistantMsg: MessageType = {
        id: nextMessageId(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      dispatch({ type: 'APPEND_MESSAGE', payload: assistantMsg });
      await chatApi.addMessageToChat(chatId!, assistantMsg);
    } finally {
      dispatch({ type: 'SET_THINKING', payload: false });
      setTimeout(() => inputBarRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && !isThinking && null}
          {messages.map((msg) =>
            msg.diagnosisData ? (
              <div key={msg.id} className="animate-message-in">
                <DiagnosisMessage message={msg} />
              </div>
            ) : (
              <div key={msg.id} className="animate-message-in">
                <Message message={msg} />
              </div>
            )
          )}
          {isThinking && (
            <div className="animate-message-in flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                <span className="text-primary">AI</span>
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="shrink-0 border-t border-gray-200 bg-gradient-to-t from-white to-gray-50/80 px-4 py-3 backdrop-blur-sm dark:from-gray-800 dark:to-gray-900/80 dark:border-gray-700">
        <div className="mx-auto max-w-3xl">
          <InputBar ref={inputBarRef} onSend={handleSend} disabled={isThinking} />
        </div>
      </div>
    </div>
  );
};
