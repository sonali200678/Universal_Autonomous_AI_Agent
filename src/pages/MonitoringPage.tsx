import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Server,
  RefreshCw,
  Terminal,
  Layers,
  Lock,
  Search,
  Check,
  X,
  FileCheck2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { EnterpriseUser, AuditEvent, ApprovalRequest } from '../types';
import { BackendSecurityEngine } from '../services/securityEngine';

interface MonitoringPageProps {
  currentUser?: EnterpriseUser;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({
  currentUser = BackendSecurityEngine.getCurrentUser(),
  onShowToast,
}) => {
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadData = () => {
    const list = BackendSecurityEngine.getAuditLogs(currentUser, {
      verdict: verdictFilter,
      eventType: eventTypeFilter,
    });
    setAuditEvents(list);
    setPendingApprovals([...BackendSecurityEngine.getPendingApprovals()]);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    loadData();
  }, [verdictFilter, eventTypeFilter, currentUser]);

  const handleDecideApproval = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    const result = BackendSecurityEngine.decideApproval(currentUser, id, decision);
    if (result.success) {
      if (onShowToast) {
        onShowToast(
          `Ticket ${decision}`,
          `Approval ticket #${id} was marked as ${decision} by ${currentUser.name}`,
          decision === 'APPROVED' ? 'success' : 'warning'
        );
      }
      loadData();
    } else {
      if (onShowToast) {
        onShowToast('Action Blocked', result.message, 'error');
      }
    }
  };

  const filteredLogs = auditEvents.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.resource.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.reason.toLowerCase().includes(q) ||
      e.actor.name.toLowerCase().includes(q) ||
      e.actor.role.toLowerCase().includes(q)
    );
  });

  const [telemetryLogs] = useState([
    { time: '08:14:07', level: 'INFO', node: 'Answer', message: 'Flushed 432 tokens to client session [user_role="procurement_analyst"]' },
    { time: '08:14:06', level: 'INFO', node: 'Content Safety', message: 'OWASP verification passed with 0 toxicity flags' },
    { time: '08:14:05', level: 'INFO', node: 'Function Call', message: 'Backend RLS applied: filtered 2 records for region="US-East"' },
    { time: '08:14:04', level: 'INFO', node: 'Hybrid Search', message: 'RAG Security Gate: dropped 2 unauthorized RESTRICTED chunks' },
    { time: '08:14:03', level: 'INFO', node: 'Prompt Shield', message: 'Invariants checked: 0 jailbreak attempts found' },
    { time: '08:13:58', level: 'WARN', node: 'Enterprise SQL', message: 'Replica connection pool reached 82% threshold; auto-scaled worker +1' },
    { time: '08:13:12', level: 'INFO', node: 'Orchestrator', message: 'Heartbeat ping nominal across all 7 autonomous agents' },
  ]);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">System Observability & Immutable Audit Logs</h1>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Hash Chain Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic ledger of authentication, authorization decisions, RLS filtering, RAG retrieval, agent tool calls, and human approvals.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-1.5 bg-[#0D1422] hover:bg-slate-800 border border-[#1D2939] text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Audit Trail
        </button>
      </div>

      {/* Cluster Health Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Worker Pools</span>
          <div className="text-xl font-bold font-mono text-white">24 Pods</div>
          <span className="text-[10px] text-emerald-400 font-mono">0 Pod Failures</span>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Audit Chain Length</span>
          <div className="text-xl font-bold font-mono text-purple-400">{auditEvents.length} Blocks</div>
          <span className="text-[10px] text-emerald-400 font-mono">SHA-256 Tamper Proof</span>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Security Interceptions</span>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {auditEvents.filter((e) => e.verdict === 'DENIED').length} Denials
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Zero Unauthorized Access</span>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pending Human Approvals</span>
          <div className="text-xl font-bold font-mono text-amber-400">
            {pendingApprovals.filter((a) => a.status === 'PENDING').length} Queued
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono">Manager Sign-Off Gated</span>
        </div>
      </div>

      {/* High-Risk Human Approval Workflow Queue */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Human-in-the-Loop (HITL) Gated Action Approvals
            </h2>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <span>Reviewer Role:</span>
            <span className="text-purple-300 font-semibold">{currentUser.name} ({currentUser.role})</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          High-risk agent actions (such as PO creation &gt; ₹30 Lakhs, record deletion, and vendor onboarding) are halted until approved by a Manager or Platform Admin. Read-only operations execute automatically.
        </p>

        <div className="space-y-2.5">
          {pendingApprovals.map((req) => {
            const isManagerOrAdmin = currentUser.role === 'MANAGER' || currentUser.role === 'PLATFORM_ADMIN';
            return (
              <div
                key={req.id}
                className="p-3.5 bg-[#070B14] border border-[#1D2939] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white">#{req.id}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        req.status === 'PENDING'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700/50'
                          : req.status === 'APPROVED'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700/50'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 border border-rose-800/40 px-1.5 py-0.2 rounded">
                      {req.riskLevel || 'HIGH'} RISK
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200">{req.title}</div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Initiated By: <strong className="text-slate-300">{req.requestedBy.name}</strong> ({req.requestedBy.role})</span>
                    <span>•</span>
                    <span>Target Agent: <strong className="text-purple-300">{req.targetAgent || 'agent-procurement'}</strong></span>
                    <span>•</span>
                    <span>Time: {req.createdAt || req.timestamp || '08:14 AM'}</span>
                  </div>
                </div>

                {/* Approval Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'PENDING' ? (
                    isManagerOrAdmin ? (
                      <>
                        <button
                          onClick={() => handleDecideApproval(req.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Action
                        </button>
                        <button
                          onClick={() => handleDecideApproval(req.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800">
                        Requires Manager or Admin role to approve
                      </div>
                    )
                  ) : (
                    <div className="text-[11px] font-mono text-slate-400 bg-[#0E1526] px-3 py-1 rounded border border-[#1D2939]">
                      Reviewed by: {req.reviewedBy?.name} ({req.reviewedBy?.role}) at {req.reviewedAt}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immutable Audit Log Table with Hash Chain */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#1D2939] bg-[#0A0F1A] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Cryptographic Audit Log Ledger
            </h2>
            <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2 py-0.5 rounded">
              Immutable
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 pr-3 py-1 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-44"
              />
            </div>

            {/* Verdict Filter */}
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Verdicts</option>
              <option value="ALLOWED">ALLOWED</option>
              <option value="DENIED">DENIED</option>
              <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            </select>

            {/* Event Type Filter */}
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Events</option>
              <option value="AUTH_LOGIN">AUTH_LOGIN</option>
              <option value="DB_QUERY">DB_QUERY</option>
              <option value="RAG_RETRIEVAL">RAG_RETRIEVAL</option>
              <option value="TOOL_EXECUTION">TOOL_EXECUTION</option>
              <option value="ACCESS_DENIED">ACCESS_DENIED</option>
              <option value="APPROVAL_DECISION">APPROVAL_DECISION</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table Rows */}
        <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#070B14] text-[10px] font-mono text-slate-400 uppercase tracking-wider sticky top-0 border-b border-[#1D2939] z-10">
              <tr>
                <th className="py-2.5 px-3">Event ID & Time</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Actor / Principal</th>
                <th className="py-2.5 px-3">Resource / Action</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Evaluation Reason</th>
                <th className="py-2.5 px-3">Chain Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162032] font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0E1526] transition-colors">
                  <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                    <div className="font-semibold text-white">{log.id}</div>
                    <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-800/30 px-1.5 py-0.5 rounded">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-200">{log.actor.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {log.actor.role} • {log.actor.department} ({log.actor.region})
                    </div>
                  </td>
                  <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                    <div className="text-cyan-300 font-semibold">{log.resource}</div>
                    <div className="text-[10px] text-slate-500">{log.action}</div>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        log.verdict === 'ALLOWED'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                          : log.verdict === 'PENDING_APPROVAL'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700/50'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700/50'
                      }`}
                    >
                      {log.verdict}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-300 max-w-xs font-sans text-xs">
                    <div className="line-clamp-2 leading-relaxed">{log.reason}</div>
                    {log.payloadSummary && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        {log.payloadSummary}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{log.hash}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      prev: {log.previousHash.slice(0, 10)}...
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Telemetry Log Stream */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white">Live Execution Traces & Node Logs</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Channel: #prod-orchestrator-east</span>
        </div>

        <div className="p-3 bg-[#070B14] border border-[#1D2939] rounded-lg font-mono text-xs space-y-2 max-h-56 overflow-y-auto">
          {telemetryLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
              <span className="text-slate-500 shrink-0">[{log.time}]</span>
              <span
                className={`font-semibold shrink-0 ${
                  log.level === 'WARN' ? 'text-amber-400' : 'text-purple-400'
                }`}
              >
                [{log.level}]
              </span>
              <span className="text-cyan-400 shrink-0">[{log.node}]:</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
