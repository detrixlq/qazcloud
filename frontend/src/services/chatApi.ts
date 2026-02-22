/**
 * Chat API - stores chats by client IP on the backend.
 */
import type { Chat, Message } from '../contexts/ChatContext';

const API_BASE = (import.meta as unknown as { env: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ?? '/api';

function toMessage(m: { id: string; role: string; content: string; timestamp: number; diagnosisData?: object }): Message {
  return {
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
    timestamp: new Date(m.timestamp),
    ...(m.diagnosisData && { diagnosisData: m.diagnosisData as Message['diagnosisData'] }),
  };
}

function toChat(c: { id: string; title: string; timestamp: number; pinned: boolean; messages: unknown[] }): Chat {
  return {
    id: c.id,
    title: c.title,
    timestamp: new Date(c.timestamp),
    pinned: c.pinned,
    messages: (c.messages || []).map((m) => toMessage(m as Parameters<typeof toMessage>[0])),
  };
}

export async function getChatHistory(): Promise<Chat[]> {
  const res = await fetch(`${API_BASE}/chats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.chats || []).map(toChat);
}

export async function createChat(title = 'New chat'): Promise<Chat> {
  const res = await fetch(`${API_BASE}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return toChat(data);
}

export async function addMessageToChat(
  chatId: string,
  message: Pick<Message, 'role' | 'content' | 'diagnosisData'>
): Promise<void> {
  const body: { role: string; content: string; diagnosis_data?: object } = {
    role: message.role,
    content: message.content,
  };
  if (message.diagnosisData) body.diagnosis_data = message.diagnosisData;
  const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteChat(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/chats/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function pinChat(id: string, pinned: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/chats/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pinned }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function updateChatTitle(id: string, title: string): Promise<void> {
  const res = await fetch(`${API_BASE}/chats/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
