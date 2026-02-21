import type { Chat, Message } from '../contexts/ChatContext';
import type { DiagnosisResponse } from '../types';
import { previewFromMessages } from '../utils/formatters';

let idCounter = 100;
function nextId(): string {
  return String(++idCounter);
}

const now = new Date();
const exampleMessages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Patient has dry cough and fever for 3 days',
    timestamp: new Date(now.getTime() - 86400000),
  },
  {
    id: 'm2',
    role: 'assistant',
    content: 'Based on the description, possible diagnoses include:',
    timestamp: new Date(now.getTime() - 86400000 + 5000),
    diagnosisData: {
      diagnoses: [
        { rank: 1, diagnosis: 'Острый бронхит', icd10_code: 'J20.9', explanation: 'Acute bronchitis fits cough and fever.' },
        { rank: 2, diagnosis: 'ОРВИ', icd10_code: 'J06.9', explanation: 'Upper respiratory infection.' },
        { rank: 3, diagnosis: 'Пневмония неуточнённая', icd10_code: 'J18.9', explanation: 'To be ruled out if symptoms persist.' },
      ],
    },
  },
];

const chats: Chat[] = [
  {
    id: '1',
    title: 'Patient has dry cough and fever…',
    timestamp: new Date(now.getTime() - 86400000),
    pinned: true,
    messages: exampleMessages,
  },
  {
    id: '2',
    title: 'Headache and dizziness',
    timestamp: new Date(now.getTime() - 43200000),
    pinned: false,
    messages: [
      { id: 'm3', role: 'user', content: 'Headache and dizziness for 2 days', timestamp: new Date(now.getTime() - 43200000) },
      { id: 'm4', role: 'assistant', content: 'Can you describe the headache? Is it unilateral or bilateral? Any nausea?', timestamp: new Date(now.getTime() - 43200000 + 3000) },
    ],
  },
  {
    id: '3',
    title: 'Chest pain when breathing',
    timestamp: new Date(now.getTime() - 3600000),
    pinned: false,
    messages: [
      { id: 'm5', role: 'user', content: 'Chest pain when breathing deeply', timestamp: new Date(now.getTime() - 3600000) },
      { id: 'm6', role: 'assistant', content: 'Based on the description, possible diagnoses include:',
        timestamp: new Date(now.getTime() - 3600000 + 4000),
        diagnosisData: {
          diagnoses: [
            { rank: 1, diagnosis: 'Плеврит', icd10_code: 'R09.1', explanation: 'Pleuritic pain on deep breath.' },
            { rank: 2, diagnosis: 'Мышечно-скелетная боль', icd10_code: 'M79.1', explanation: 'Chest wall pain.' },
          ],
        },
      },
    ],
  },
];

function sortChats(list: Chat[]): Chat[] {
  return [...list].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export function getChatHistory(): Promise<Chat[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sortChats(chats)), 200);
  });
}

export function deleteChat(id: string): Promise<void> {
  const i = chats.findIndex((c) => c.id === id);
  if (i !== -1) chats.splice(i, 1);
  return Promise.resolve();
}

export function pinChat(id: string, pinned: boolean): Promise<void> {
  const c = chats.find((ch) => ch.id === id);
  if (c) c.pinned = pinned;
  return Promise.resolve();
}

export function createChat(): Chat {
  const chat: Chat = {
    id: nextId(),
    title: 'New chat',
    timestamp: new Date(),
    pinned: false,
    messages: [],
  };
  chats.unshift(chat);
  return chat;
}

export function addMessageToChat(chatId: string, message: Message): void {
  const c = chats.find((ch) => ch.id === chatId);
  if (!c) return;
  c.messages.push(message);
  if (message.role === 'user' && c.title === 'New chat') {
    c.title = previewFromMessages(c.messages);
  }
}

export function sendMessage(userMessage: string): Promise<string | DiagnosisResponse> {
  const lower = userMessage.toLowerCase();
  const hasCough = /\bcough\b|\bкашель\b|\bкашл|bronchitis|бронхит|fever|лихорадк|температур|chest\s*pain|боль\s*в\s*груд/i.test(lower);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (hasCough || lower.includes('cough') || lower.includes('кашель')) {
        resolve({
          diagnoses: [
            { rank: 1, diagnosis: 'Острый бронхит', icd10_code: 'J20.9', explanation: 'Клиническая картина соответствует острому бронхиту.' },
            { rank: 2, diagnosis: 'ОРВИ', icd10_code: 'J06.9', explanation: 'Острая респираторная инфекция.' },
            { rank: 3, diagnosis: 'Пневмония неуточнённая', icd10_code: 'J18.9', explanation: 'Исключить при сохранении симптомов.' },
          ],
        });
      } else {
        resolve('Can you describe the symptoms in more detail? For example: duration, severity, and any other signs (e.g. fever, cough).');
      }
    }, 800 + Math.random() * 700);
  });
}

const analyticsByCode: Record<string, { specialists: string[]; procedures: string[]; medications: string[] }> = {
  'J20.9': {
    specialists: ['Терапевт', 'Пульмонолог'],
    procedures: ['ОАК', 'Рентген грудной клетки при подозрении на пневмонию'],
    medications: ['Симптоматическая терапия', 'При необходимости — муколитики'],
  },
  'J06.9': {
    specialists: ['Терапевт'],
    procedures: ['ОАК при длительной лихорадке'],
    medications: ['Жаропонижающие', 'Обильное питьё'],
  },
  'J18.9': {
    specialists: ['Терапевт', 'Пульмонолог'],
    procedures: ['ОАК', 'Рентген ОГК', 'СРБ'],
    medications: ['По результатам обследования — антибактериальная терапия по показаниям'],
  },
  'R09.1': {
    specialists: ['Терапевт', 'Пульмонолог'],
    procedures: ['Рентген ОГК', 'УЗИ плевральной полости'],
    medications: ['НПВП при боли', 'Лечение основного заболевания'],
  },
};

export function getDiagnosisAnalytics(diagnosisCode: string): Promise<{ specialists: string[]; procedures: string[]; medications: string[] }> {
  const data = analyticsByCode[diagnosisCode] ?? {
    specialists: ['Терапевт'],
    procedures: ['Общий осмотр', 'ОАК'],
    medications: ['По показаниям'],
  };
  return new Promise((resolve) => setTimeout(() => resolve(data), 300));
}
