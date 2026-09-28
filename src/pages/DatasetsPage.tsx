import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Download,
  Filter,
  Table,
  Code,
  CheckCircle2,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Globe,
  Users,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { EnterpriseUser } from '../types';
import {
  BackendSecurityEngine,
  SECURE_PURCHASE_ORDERS,
  SECURE_EMPLOYEE_RECORDS,
  SECURE_FINANCE_LEDGER,
} from '../services/securityEngine';

interface DatasetsPageProps {
  currentUser?: EnterpriseUser;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DatasetsPage: React.FC<DatasetsPageProps> = ({
  currentUser = BackendSecurityEngine.getCurrentUser(),
  onShowToast,
}) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<'procurement' | 'hr' | 'finance' | 'customer'>('procurement');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'rows' | 'schema' | 'security_policy'>('rows');

  // Query database through BackendSecurityEngine
  const [queryState, setQueryState] = useState<{
    success: boolean;
    data: any[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  }>({
    success: true,
    data: [],
    totalRows: 0,
    rlsFilteredCount: 0,
  });

  useEffect(() => {
    if (selectedDatasetId === 'procurement') {
      const res = BackendSecurityEngine.queryPurchaseOrders(currentUser);
      setQueryState(res);
    } else if (selectedDatasetId === 'hr') {
      const res = BackendSecurityEngine.queryEmployees(currentUser);
      setQueryState(res);
    } else if (selectedDatasetId === 'finance') {
      const res = BackendSecurityEngine.queryFinance(currentUser);
      setQueryState(res);
    } else {
      // Customer Telemetry - read-only public
      setQueryState({
        success: true,
        data: [
          { date: '2026-06-21', region: 'Global', sessions: 18400, deflectionPct: 64.2, csat: 4.7, costPerSession: 0.21 },
          { date: '2026-06-20', region: 'Global', sessions: 17900, deflectionPct: 63.8, csat: 4.6, costPerSession: 0.22 },
          { date: '2026-06-19', region: 'Global', sessions: 18100, deflectionPct: 64.0, csat: 4.7, costPerSession: 0.20 },
        ],
        totalRows: 3,
        rlsFilteredCount: 3,
      });
    }
  }, [selectedDatasetId, currentUser]);

  const handleExportCSV = () => {
    if (!queryState.success) {
      onShowToast('Export Blocked', 'Cannot export dataset: 403 Forbidden Access', 'error');
      return;
    }
    onShowToast('CSV Export Generated', `Exported ${queryState.data.length} records [DEMO DATA]`);
  };

  const filteredRows = queryState.data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Enterprise Datasets & ERP Feeds</h1>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
              RLS Secured · DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict row-level security (RLS) and department isolation. Active user credentials dictate visible rows.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 bg-[#0D1422] hover:bg-slate-800 border border-[#1D2939] text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export Table CSV
        </button>
      </div>

      {/* Dataset Selection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Procurement */}
        <button
          onClick={() => {
            setSelectedDatasetId('procurement');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDatasetId === 'procurement'
              ? 'bg-[#0E1526] border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
              : 'bg-[#0D1320] border-[#1D2939] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200 truncate">Procurement & POs</span>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">
              RLS
            </span>
          </div>
          <p className="text-[10px] text-slate-400">SAP / Oracle ERP Purchase Orders</p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Req: purchase_orders.read</span>
          </div>
        </button>

        {/* HR / Payroll */}
        <button
          onClick={() => {
            setSelectedDatasetId('hr');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDatasetId === 'hr'
              ? 'bg-[#0E1526] border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
              : 'bg-[#0D1320] border-[#1D2939] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200 truncate">HR & Payroll Ledger</span>
            <span className="text-[9px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/40 px-1.5 py-0.2 rounded">
              RESTRICTED
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Workday Personnel & Salaries</p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Req: employees.read</span>
          </div>
        </button>

        {/* Finance */}
        <button
          onClick={() => {
            setSelectedDatasetId('finance');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDatasetId === 'finance'
              ? 'bg-[#0E1526] border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
              : 'bg-[#0D1320] border-[#1D2939] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200 truncate">Finance General Ledger</span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded">
              CONFIDENTIAL
            </span>
          </div>
          <p className="text-[10px] text-slate-400">NetSuite Corporate Reserves</p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Req: finance.read</span>
          </div>
        </button>

        {/* Customer Support */}
        <button
          onClick={() => {
            setSelectedDatasetId('customer');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDatasetId === 'customer'
              ? 'bg-[#0E1526] border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
              : 'bg-[#0D1320] border-[#1D2939] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200 truncate">Support & CSAT Telemetry</span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
              INTERNAL
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Zendesk / Agent Telemetry</p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Req: reports.read</span>
          </div>
        </button>
      </div>

      {/* RLS Security Status Banner */}
      {queryState.success ? (
        <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Row-Level Security Active:</strong> Authorized for <strong>{currentUser.name}</strong> ({currentUser.role} • Dept: {currentUser.department} • Region: {currentUser.region}).
              Showing {queryState.rlsFilteredCount} of {queryState.totalRows} global records.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700/50">
            Filter: region='{currentUser.region}'
          </span>
        </div>
      ) : (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-rose-300">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">403 FORBIDDEN — Data Access Intercepted</div>
              <div className="mt-0.5 text-rose-200 leading-relaxed">{queryState.error}</div>
              <div className="text-[10px] font-mono text-rose-400 mt-1">
                Security Policy: ISO-27001 Department Boundary Enforcement · Security Event Logged
              </div>
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800 shrink-0">
            Principal: {currentUser.name} ({currentUser.role})
          </div>
        </div>
      )}

      {/* Dataset Table Container */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#1D2939] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0F1A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('rows')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'rows'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Table Rows ({queryState.success ? filteredRows.length : 0})
            </button>
            <button
              onClick={() => setActiveTab('security_policy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'security_policy'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> RLS Policy Rules
            </button>
          </div>

          {/* Search Field */}
          {activeTab === 'rows' && queryState.success && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search row values..."
                className="pl-8 pr-3 py-1.5 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full sm:w-60"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Rows View */}
        {activeTab === 'rows' && (
          <div className="overflow-x-auto">
            {queryState.success && queryState.data.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#070B14] text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#1D2939]">
                  <tr>
                    {Object.keys(queryState.data[0]).map((key) => (
                      <th key={key} className="py-2.5 px-4 font-semibold">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                    <th className="py-2.5 px-4 font-semibold text-right">Data Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162032] font-mono text-[11px]">
                  {filteredRows.map((row, i) => (
                    <tr key={i} className="hover:bg-[#0E1526] transition-colors">
                      {Object.entries(row).map(([k, v], cellIdx) => (
                        <td key={cellIdx} className="py-2.5 px-4 text-slate-300 whitespace-nowrap">
                          {k === 'status' ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                v === 'Approved' || v === 'Active'
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                  : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              }`}
                            >
                              {String(v)}
                            </span>
                          ) : k === 'region' ? (
                            <span className="text-cyan-400 font-semibold">{String(v)}</span>
                          ) : (
                            String(v)
                          )}
                        </td>
                      ))}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <span className="text-[9px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 px-1.5 py-0.5 rounded">
                          DEMO DATA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !queryState.success ? (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <Lock className="w-8 h-8 text-rose-500/50 mx-auto" />
                <div className="text-slate-300 font-semibold">Data Restricted Under Zero-Trust Policy</div>
                <p className="max-w-md mx-auto text-[11px] text-slate-500">
                  Switch persona in the Top Bar to an authorized role (e.g., HR Analyst for HR records, Finance Analyst for Finance ledger, or Platform Admin) to inspect this table.
                </p>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No matching records found for "{searchTerm}" in authorized region "{currentUser.region}".
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Security Policy Rules */}
        {activeTab === 'security_policy' && (
          <div className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Row-Level Security (RLS) Policy Specification
            </h3>
            <div className="p-4 bg-[#070B14] border border-[#1D2939] rounded-lg font-mono text-xs text-purple-300 space-y-2 leading-relaxed">
              <p className="text-slate-400">// PostgreSQL / SQLite RLS Policy Definition</p>
              <p>CREATE POLICY tenant_isolation_policy ON enterprise_records</p>
              <p className="pl-4">FOR SELECT</p>
              <p className="pl-4">TO authenticated_users</p>
              <p className="pl-4">
                USING (
              </p>
              <p className="pl-8 text-emerald-400">auth.role() = 'PLATFORM_ADMIN' OR</p>
              <p className="pl-8 text-emerald-400">auth.role() = 'AUDITOR' OR</p>
              <p className="pl-8 text-cyan-400">(department = auth.department() AND region = auth.region())</p>
              <p className="pl-4">);</p>
            </div>
            <p className="text-xs text-slate-400">
              This policy is executed directly by the BackendSecurityEngine before records reach memory or any AI model context. Frontend requests cannot bypass this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
