import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatWindow } from '../chat/ChatWindow';

export const MainLayout: React.FC = () => (
  <div className="animate-page-in flex h-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/90 to-emerald-50/30 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-50">
    <Sidebar />
    <div className="flex flex-1 flex-col min-w-0">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  </div>
);
