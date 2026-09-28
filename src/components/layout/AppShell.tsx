import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { PageId, EnterpriseUser } from '../../types';

interface AppShellProps {
  currentPage: PageId;
  currentUser?: EnterpriseUser;
  onSwitchUser?: (user: EnterpriseUser) => void;
  onNavigate: (page: PageId) => void;
  onOpenCommandPalette: () => void;
  onOpenSettingsModal: () => void;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  onCloseMobileSidebar: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  currentUser,
  onSwitchUser,
  onNavigate,
  onOpenCommandPalette,
  onOpenSettingsModal,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  onCloseMobileSidebar,
  onShowToast,
  children,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B14] text-slate-100">
      {/* Left Persistent Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={onCloseMobileSidebar}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          currentPage={currentPage}
          currentUser={currentUser}
          onSwitchUser={onSwitchUser}
          onNavigate={onNavigate}
          onOpenCommandPalette={onOpenCommandPalette}
          onOpenSettingsModal={onOpenSettingsModal}
          onToggleMobileSidebar={onToggleMobileSidebar}
          onShowToast={onShowToast}
        />

        {/* Viewport Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};
