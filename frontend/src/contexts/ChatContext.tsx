import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  diagnosisData?: {
    diagnoses: Array<{
      rank: number;
      diagnosis: string;
      icd10_code: string;
      explanation: string;
    }>;
    /** From /diagnose/details for the 1st ranked diagnosis (Доктора, Необходимые процедуры, etc.) */
    detailsSections?: Array<{ title: string; items: string[] }>;
  };
}

export interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  pinned: boolean;
  messages: Message[];
}

type ChatState = {
  chats: Chat[];
  currentChatId: string | null;
  messages: Message[];
  isThinking: boolean;
};

type ChatAction =
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_CURRENT_CHAT'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'APPEND_MESSAGE'; payload: Message }
  | { type: 'SET_THINKING'; payload: boolean }
  | { type: 'NEW_CHAT' }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'PIN_CHAT'; payload: { id: string; pinned: boolean } }
  | { type: 'LOAD_CHAT'; payload: { id: string; messages: Message[] } }
  | { type: 'ADD_CHAT'; payload: Chat };

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  messages: [],
  isThinking: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChatId: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'APPEND_MESSAGE': {
      const nextMessages = [...state.messages, action.payload];
      const nextChats = state.currentChatId
        ? state.chats.map((c) =>
            c.id === state.currentChatId ? { ...c, messages: nextMessages } : c
          )
        : state.chats;
      return { ...state, messages: nextMessages, chats: nextChats };
    }
    case 'SET_THINKING':
      return { ...state, isThinking: action.payload };
    case 'NEW_CHAT':
      return { ...state, currentChatId: null, messages: [] };
    case 'DELETE_CHAT':
      return {
        ...state,
        chats: state.chats.filter((c) => c.id !== action.payload),
        currentChatId: state.currentChatId === action.payload ? null : state.currentChatId,
        messages: state.currentChatId === action.payload ? [] : state.messages,
      };
    case 'PIN_CHAT': {
      const { id, pinned } = action.payload;
      const chats = state.chats.map((c) => (c.id === id ? { ...c, pinned } : c));
      chats.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      return { ...state, chats };
    }
    case 'LOAD_CHAT':
      return {
        ...state,
        currentChatId: action.payload.id,
        messages: action.payload.messages,
      };
    case 'ADD_CHAT':
      return { ...state, chats: [action.payload, ...state.chats] };
    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    import('../services/mockApi').then(({ getChatHistory }) => {
      getChatHistory().then((chats) => {
        dispatch({ type: 'SET_CHATS', payload: chats });
      });
    });
  }, []);

  return (
    <ChatContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
