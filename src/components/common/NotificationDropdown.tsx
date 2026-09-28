import React, { useRef, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, Bell, Check, ExternalLink } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePage: (page: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Agent deployment completed',
    detail: 'Enterprise Assistant v2.7 rolled out to production with 100% traffic allocation.',
    time: '8m ago',
    type: 'success',
    read: false,
  },
  {
    id: 'n2',
    title: 'Evaluation score improved',
    detail: 'Groundedness benchmark increased to 96.0% (+3.0 pp lift) following Cross-Encoder reranker tune.',
    time: '24m ago',
    type: 'success',
    read: false,
  },
  {
    id: 'n3',
    title: 'New dataset indexed',
    detail: 'Enterprise Procurement & Purchase Orders (14,200 rows) synchronized from SAP ERP.',
    time: '1h ago',
    type: 'info',
    read: true,
  },
  {
    id: 'n4',
    title: 'Tool rate limit warning mitigated',
    detail: 'Enterprise SQL Runner approached 85% connection pool capacity; auto-scaled 2 read replicas.',
    time: '2h ago',
    type: 'warning',
    read: true,
  },
];

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNavigatePage,
}) => {
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0D1320] border border-[#1D2939] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-100"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1D2939] bg-[#0A0F1A]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-100">System Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-[#1D2939]/60">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 hover:bg-slate-800/30 transition-colors flex items-start gap-3 ${
              !item.read ? 'bg-purple-950/15' : ''
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {item.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">{item.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-[#1D2939] bg-[#0A0F1A] text-center">
        <button
          onClick={() => {
            onNavigatePage('monitoring');
            onClose();
          }}
          className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors py-1"
        >
          View Full Monitoring & Audit Logs <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
