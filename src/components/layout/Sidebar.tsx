import React from 'react';
import {
  Home,
  MessageSquare,
  Bot,
  Wrench,
  BookOpen,
  ShieldAlert,
  Award,
  Database,
  BarChart3,
  Coins,
  Activity,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageId } from '../../types';
import { TODAY_KPIS } from '../../data/mockMetrics';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" />, badge: 'Live' },
  { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
  { id: 'rag', label: 'RAG', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'guardrails', label: 'Guardrails', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'evaluations', label: 'Evaluations', icon: <Award className="w-4 h-4" /> },
  { id: 'datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'finops', label: 'FinOps', icon: <Coins className="w-4 h-4" /> },
  { id: 'monitoring', label: 'Monitoring', icon: <Activity className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-48 xl:w-52 bg-[#090E1A] border-r border-[#1D2939] flex flex-col justify-between select-none transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-[#1D2939] bg-[#070B14]">
          <div className="flex items-center gap-2.5">
            {/* Geometric custom icon */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#090E1A] rounded-[6px] flex items-center justify-center">
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  U
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wider text-white">UAMC-I</span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-purple-950/60 text-purple-300 border border-purple-800/40 rounded">
                  v2.7
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight font-medium">Enterprise AI, orchestrated.</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: System Status & KPIs */}
        <div className="p-3 border-t border-[#1D2939] bg-[#070B14] space-y-2.5 text-[11px]">
          {/* Operational Banner */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-950/30 border border-emerald-800/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-medium text-emerald-300">All systems operational</span>
          </div>

          {/* Today's KPIs */}
          <div className="space-y-1 font-mono text-[10px] text-slate-400 bg-[#090E1A] p-2 rounded border border-[#172234]">
            <div className="flex justify-between items-center text-slate-300 font-semibold mb-1 pb-1 border-b border-[#172234]">
              <span>Today&apos;s KPIs</span>
              <span className="text-emerald-400 text-[9px]">LIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sessions</span>
              <span className="text-slate-200">{TODAY_KPIS.sessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deflection</span>
              <span className="text-slate-200">{TODAY_KPIS.deflectionRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CSAT</span>
              <span className="text-slate-200">{TODAY_KPIS.csat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cost/Sess</span>
              <span className="text-slate-200">{TODAY_KPIS.costPerSession}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Latency</span>
              <span className="text-slate-200">{TODAY_KPIS.latency}</span>
            </div>
          </div>

          {/* Data Residency / Security Card */}
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-[#090E1A] border border-[#172234] text-[9px] text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">SOC2 · ISO27001 · US-East</span>
          </div>
        </div>
      </aside>
    </>
  );
};
