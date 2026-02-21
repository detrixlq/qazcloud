import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru';

export interface LanguageStrings {
  newChat: string;
  send: string;
  typeMessage: string;
  expandDetails: string;
  downloadReport: string;
  today: string;
  detailedAnalysis: string;
  detailedAnalysisOfDiagnosis: string;
  recommendedSpecialists: string;
  necessaryProcedures: string;
  medications: string;
  pin: string;
  delete: string;
  language: string;
  theme: string;
  pinnedSection: string;
  myChatsSection: string;
  closingMessage: string;
  /** Use {diagnosis} as placeholder for the diagnosis name */
  viewDiagnosisProtocol: string;
}

const en: LanguageStrings = {
  newChat: 'New Chat',
  send: 'Send',
  typeMessage: 'Type your message...',
  expandDetails: 'Detailed Analysis',
  downloadReport: 'Download report',
  today: 'Today',
  detailedAnalysis: 'Detailed Analysis',
  detailedAnalysisOfDiagnosis: 'Detailed analysis of the most likely diagnosis',
  recommendedSpecialists: 'Recommended specialists',
  necessaryProcedures: 'Necessary procedures / tests',
  medications: 'Medications',
  pin: 'Pin',
  delete: 'Delete',
  language: 'Language',
  theme: 'Theme',
  pinnedSection: 'Pinned',
  myChatsSection: 'My chats',
  closingMessage: 'We have prepared a preliminary hypothesis based on the RC protocols as a basis for discussion with your doctor. A specialist can clarify details and order necessary examinations. Have a good day!',
  viewDiagnosisProtocol: 'View {diagnosis} Protocol',
};

const ru: LanguageStrings = {
  newChat: 'Новый чат',
  send: 'Отправить',
  typeMessage: 'Введите сообщение...',
  expandDetails: 'Подробный анализ',
  downloadReport: 'Скачать отчёт',
  today: 'Сегодня',
  detailedAnalysis: 'Подробный анализ',
  detailedAnalysisOfDiagnosis: 'Подробный анализ наиболее вероятного диагноза',
  recommendedSpecialists: 'Рекомендуемые специалисты',
  necessaryProcedures: 'Необходимые процедуры / анализы',
  medications: 'Лекарства',
  pin: 'Закрепить',
  delete: 'Удалить',
  language: 'Язык',
  theme: 'Тема',
  pinnedSection: 'Закреплённые',
  myChatsSection: 'Мои чаты',
  closingMessage: 'Мы подготовили предварительную гипотезу по протоколам РК — как основу для разговора с врачом. Специалист сможет уточнить детали и назначить необходимое обследование. Хорошего вам дня!',
  viewDiagnosisProtocol: 'Посмотреть протокол {diagnosis}',
};

const strings: Record<Language, LanguageStrings> = { en, ru };

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: LanguageStrings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = strings[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
