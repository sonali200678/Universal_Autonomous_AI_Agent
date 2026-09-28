import React, { useState } from 'react';
import { MOCK_TOOLS } from '../data/mockTools';
import { ToolItem } from '../types';
import {
  Wrench,
  Database,
  Search,
  Terminal,
  Layers,
  Mail,
  Globe,
  CheckCircle2,
  Play,
  Key,
  Shield,
  Clock,
  Activity,
  Plus,
} from 'lucide-react';

interface ToolsPageProps {
  onShowToast: (title: string, desc?: string) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onShowToast }) => {
  const [tools, setTools] = useState<ToolItem[]>(MOCK_TOOLS);
  const [selectedTool, setSelectedTool] = useState<ToolItem>(MOCK_TOOLS[0]);
  const [testPayload, setTestPayload] = useState('{"query": "SELECT vendor_name, SUM(amount) FROM po_records GROUP BY 1 LIMIT 5"}');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleTestTool = () => {
    setIsExecuting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsExecuting(false);
      setTestResult(
        JSON.stringify(
          {
            status: 200,
            statusText: 'OK',
            latencyMs: (selectedTool.avgLatencyMs || 65) + Math.floor(Math.random() * 20),
            data: [
              { vendor_name: 'Vendor A (Apex Cloud Systems)', total_amount: 4820000 },
              { vendor_name: 'Vendor B (BioTech Solutions Ltd)', total_amount: 4270000 },
              { vendor_name: 'Vendor C (CyberShield Security)', total_amount: 3940000 },
              { vendor_name: 'Vendor D (Delta Logistics Global)', total_amount: 3480000 },
              { vendor_name: 'Vendor E (Echo Hardware Hub)', total_amount: 3160000 },
            ],
            authVerified: true,
            clusterNode: 'vpc-ap-southeast-primary',
          },
          null,
          2
        )
      );
      onShowToast(`Executed ${selectedTool.name}`, 'Returned 5 records in 68ms');
    }, 600);
  };

  const getToolIcon = (cat: ToolItem['category']) => {
    switch (cat) {
      case 'Database':
        return <Database className="w-4 h-4 text-purple-400" />;
      case 'Search':
        return <Search className="w-4 h-4 text-blue-400" />;
      case 'Computation':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'Communication':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'Integration':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Enterprise Tool Registry</h1>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
              6 Operational
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Governed tool APIs, database executors, code interpreters, and ERP integrations.
          </p>
        </div>

        <button
          onClick={() => onShowToast('Register Tool', 'API connector wizard opened')}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Register Enterprise Tool
        </button>
      </div>

      {/* Main Grid: Tools List + Test Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tools List */}
        <div className="lg:col-span-2 space-y-3">
          {tools.map((tool) => {
            const isSelected = selectedTool.id === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool);
                  setTestResult(null);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0E1526] border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
                    : 'bg-[#0D1320] border-[#1D2939] hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#141C30] border border-slate-800 shrink-0">
                      {getToolIcon(tool.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white">{tool.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {tool.status}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-1">
                      Auth: {tool.authType}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1C2638] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Invocations: <strong className="text-slate-200">{(tool.invocationsToday || 0).toLocaleString()}</strong></span>
                  <span>Mean Latency: <strong className="text-slate-200">{tool.avgLatencyMs || 65}ms</strong></span>
                  <span>Error Rate: <strong className="text-emerald-400">{tool.errorRate || 0.05}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Tool Test Sandbox */}
        <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1D2939] mb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Interactive Sandbox</span>
                <h3 className="text-xs font-bold text-white mt-0.5">{selectedTool.name}</h3>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                {selectedTool.authType}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Payload / Query Parameter</label>
                <textarea
                  rows={4}
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="w-full p-2.5 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleTestTool}
                disabled={isExecuting}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {isExecuting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Executing Tool...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Send Test Invocation
                  </>
                )}
              </button>

              {testResult && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Response Output</span>
                    <span className="text-emerald-400">HTTP 200 OK</span>
                  </div>
                  <pre className="p-2.5 bg-[#070B14] border border-[#1D2939] rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-44 leading-relaxed">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2638] text-[10px] font-mono text-slate-500">
            Governed by IAM RBAC. All invocations cryptographically signed.
          </div>
        </div>
      </div>
    </div>
  );
};
