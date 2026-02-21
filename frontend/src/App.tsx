import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChatProvider } from './contexts/ChatContext';
import { MainLayout } from './components/layout/MainLayout';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ChatProvider>
          <MainLayout />
        </ChatProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
