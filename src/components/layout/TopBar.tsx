import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  ChevronDown,
  User,
  Shield,
  Menu,
  Sparkles,
  Command,
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe,
  Building,
  KeyRound,
} from 'lucide-react';
import { PageId, EnterpriseUser, UserRole } from '../../types';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { ENTERPRISE_USERS, BackendSecurityEngine } from '../../services/securityEngine';

interface TopBarProps {
  currentPage: PageId;
  currentUser?: EnterpriseUser;
  onSwitchUser?: (user: EnterpriseUser) => void;
  onNavigate: (page: PageId) => void;
  onOpenCommandPalette: () => void;
  onOpenSettingsModal: () => void;
  onToggleMobileSidebar: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  currentUser = BackendSecurityEngine.getCurrentUser(),
  onSwitchUser,
  onNavigate,
  onOpenCommandPalette,
  onOpenSettingsModal,
  onToggleMobileSidebar,
  onShowToast,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const personaMenuRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setIsPersonaMenuOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'agents':
        return 'Enterprise Assistant';
      case 'home':
        return 'Executive Overview';
      case 'chat':
        return 'Enterprise AI Chat';
      case 'tools':
        return 'Tool Registry';
      case 'rag':
        return 'Knowledge Base & RAG';
      case 'guardrails':
        return 'Security Guardrails';
      case 'evaluations':
        return 'Model Evaluations';
      case 'datasets':
        return 'Enterprise Datasets';
      case 'analytics':
        return 'System Analytics';
      case 'finops':
        return 'FinOps & Spend';
      case 'monitoring':
        return 'Observability & Logs';
      case 'settings':
        return 'Workspace Settings';
      default:
        return 'Enterprise AI';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/50';
      case 'MANAGER':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/50';
      case 'PROCUREMENT_ANALYST':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50';
      case 'FINANCE_ANALYST':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
      case 'HR_ANALYST':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/50';
      case 'AUDITOR':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleSelectPersona = (u: EnterpriseUser) => {
    BackendSecurityEngine.setCurrentUser(u);
    if (onSwitchUser) {
      onSwitchUser(u);
    }
    setIsPersonaMenuOpen(false);
    setIsUserMenuOpen(false);
    onShowToast(
      'Security Context Switched',
      `Active Identity: ${u.name} (${u.role}) • Dept: ${u.department} • Region: ${u.region}`,
      'info'
    );
  };

  return (
    <header className="h-12 bg-[#090E1A] border-b border-[#1D2939] px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 text-slate-400 hover:text-slate-200 lg:hidden rounded-md hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">AI Workspace</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-200 font-semibold">{getPageTitle(currentPage)}</span>
          <span className="text-slate-600">/</span>
          <span className="text-purple-400 font-mono text-[11px]">v2.7-RBAC</span>

          {/* Environment Status Badge */}
          <div className="ml-1 hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Production</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Security Persona Switcher & Search & Icons */}
      <div className="flex items-center gap-2.5">
        {/* Interactive Persona / Security Switcher */}
        <div className="relative" ref={personaMenuRef}>
          <button
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0D1422] hover:bg-[#121A2D] border border-purple-900/40 hover:border-purple-600/50 transition-all text-xs group shadow-sm"
            title="Switch authenticated enterprise user persona"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 leading-tight flex items-center gap-1">
                  Auth Identity
                </span>
                <span className="font-semibold text-white leading-tight truncate max-w-[130px] sm:max-w-[170px]">
                  {currentUser.name}
                </span>
              </div>
            </div>

            <div
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getRoleBadgeColor(
                currentUser.role
              )}`}
            >
              {currentUser.role.replace('_ANALYST', '').replace('PLATFORM_', '')}
            </div>

            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-200" />
          </button>

          {/* Persona Switcher Dropdown */}
          {isPersonaMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0D1320] border border-[#1D2939] rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in duration-100">
              <div className="px-2.5 py-2 border-b border-[#1D2939] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                    <span>Switch Test Persona</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Verify RBAC, department boundaries, and RLS
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/40 px-1.5 py-0.5 rounded">
                  8 Personas
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                {ENTERPRISE_USERS.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectPersona(u)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-purple-950/40 border border-purple-500/40'
                          : 'hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center font-bold text-[11px] text-white shrink-0">
                          {u.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-100 flex items-center gap-1.5 truncate">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>{u.department}</span>
                            <span>•</span>
                            <span className="font-mono text-cyan-400">{u.region}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${getRoleBadgeColor(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#1D2939] px-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Enforced by: BackendSecurityEngine</span>
                <span className="text-purple-400 font-mono">Zero Trust</span>
              </div>
            </div>
          )}
        </div>

        {/* Search Input Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#070B14] hover:bg-[#0D1422] border border-[#1D2939] hover:border-slate-700 rounded-lg text-xs text-slate-400 transition-all w-32 md:w-48 justify-between group"
        >
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
            <span className="truncate">Search (⌘K)</span>
          </div>
          <kbd className="hidden md:inline-block px-1 py-0.2 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            onNavigatePage={(page) => onNavigate(page as PageId)}
          />
        </div>

        {/* Help Menu */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
            title="Help & Reference Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0D1320] border border-[#1D2939] rounded-xl shadow-2xl p-3 z-50 text-xs text-slate-300 space-y-2 animate-in fade-in duration-100">
              <div className="font-semibold text-slate-100 pb-1 border-b border-[#1D2939]">
                UAMC-I Enterprise Architecture & RBAC
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Autonomous Multi-Agent Cognitive Intelligence with prompt shielding, RAG retrieval, sandboxed tools, and cryptographic audit hash chains.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-purple-400 pt-1">
                <div>• Switch Persona in top bar to test RBAC</div>
                <div>• Procurement Analyst cannot access HR records</div>
                <div>• High-risk actions dispatch Manager approvals</div>
                <div>• Audit logs tracked in Monitoring tab</div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          onClick={onOpenSettingsModal}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-800"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {currentUser.avatar}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0D1320] border border-[#1D2939] rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in duration-100">
              <div className="px-2.5 py-2 border-b border-[#1D2939]">
                <p className="font-semibold text-slate-100">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-purple-400 font-mono">
                  <Shield className="w-3 h-3" /> {currentUser.role}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span>Dept: {currentUser.department}</span>
                  <span>•</span>
                  <span className="text-cyan-400">{currentUser.region}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('guardrails');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Security & Guardrails</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('monitoring');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Immutable Audit Logs</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Workspace Settings</span>
              </button>

              <div className="pt-1 border-t border-[#1D2939]">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsPersonaMenuOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800/60 text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Switch Test Persona</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
