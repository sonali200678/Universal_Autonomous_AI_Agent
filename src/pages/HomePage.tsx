import React from 'react';
import {
  Bot,
  CheckCircle2,
  Cpu,
  Coins,
  Clock,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Database,
} from 'lucide-react';
import { PageId } from '../types';
import { MOCK_AGENTS } from '../data/mockAgents';
import { TODAY_KPIS, INITIAL_TOKEN_COST } from '../data/mockMetrics';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14]">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#0D1424] to-[#0A0F1A] border border-purple-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              Enterprise Operating Ecosystem
            </span>
            <span className="text-xs text-slate-400 font-mono">Cluster: US-East-Primary</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Universal Autonomous Multi-Agent Cognitive Intelligence
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Coordinating specialized cognitive agents, autonomous retrieval pipelines, sandboxed execution runtimes, and real-time enterprise guardrails.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('agents')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <Bot className="w-4 h-4" />
            Launch Orchestrator
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Agents</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-white">7</span>
            <span className="text-[10px] text-emerald-400">100% Online</span>
          </div>
          <p className="text-[10px] text-slate-500">Autonomous workers</p>
        </div>

        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Today&apos;s Sessions</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-white">{TODAY_KPIS.sessions}</span>
            <span className="text-[10px] text-emerald-400">↑ 12%</span>
          </div>
          <p className="text-[10px] text-slate-500">Enterprise queries</p>
        </div>

        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Deflection Rate</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-purple-400">{TODAY_KPIS.deflectionRate}</span>
            <span className="text-[10px] text-emerald-400">↑ 3.2pp</span>
          </div>
          <p className="text-[10px] text-slate-500">Autonomous resolution</p>
        </div>

        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">CSAT Score</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-emerald-400">{TODAY_KPIS.csat}</span>
            <span className="text-[10px] text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[10px] text-slate-500">User satisfaction</p>
        </div>

        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cost / Session</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-white">{TODAY_KPIS.costPerSession}</span>
            <span className="text-[10px] text-emerald-400">↓ $0.03</span>
          </div>
          <p className="text-[10px] text-slate-500">Optimized FinOps</p>
        </div>

        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">P50 Latency</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-cyan-400">{TODAY_KPIS.latency}</span>
            <span className="text-[10px] text-slate-400">E2E</span>
          </div>
          <p className="text-[10px] text-slate-500">Streamed response</p>
        </div>
      </div>

      {/* Main Grid: Active Agents Table & Live Multi-Agent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Autonomous Agents */}
        <div className="lg:col-span-2 bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1D2939] mb-3">
              <div>
                <h3 className="text-xs font-semibold text-slate-100">Autonomous Agent Fleet</h3>
                <p className="text-[11px] text-slate-400">Configured cognitive workers and tool authorizations</p>
              </div>
              <button
                onClick={() => onNavigate('agents')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition-colors"
              >
                Inspect Orchestration Graph <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1D2939] text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="pb-2">Agent Name</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Backing Model</th>
                    <th className="pb-2 text-right">Tasks</th>
                    <th className="pb-2 text-right">Success</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2939]/60">
                  {MOCK_AGENTS.map((agent) => (
                    <tr
                      key={agent.id}
                      onClick={() => onNavigate('agents')}
                      className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5 font-medium text-slate-200 group-hover:text-purple-300">
                        {agent.name}
                      </td>
                      <td className="py-2.5 text-slate-400">{agent.role}</td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-300">{agent.model}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-300">
                        {agent.tasksCompleted.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-emerald-400 font-semibold">
                        {agent.successRate}%
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {agent.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Multi-Agent Execution Stream */}
        <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1D2939] mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-semibold text-slate-100">Live Agent Stream</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/40">
                Active
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {[
                { time: 'Just now', agent: 'Procurement Analyst', task: 'Executed ERP spend aggregation query across 14.2K PO records', tag: 'SQL' },
                { time: '1m ago', agent: 'Orchestrator Agent', task: 'Route dispatch: decomposed multi-source supplier query into 3 sub-plans', tag: 'Plan' },
                { time: '2m ago', agent: 'Validation Agent', task: 'Audited response claims against ground truth chunk ref [ERP-PO-2026]', tag: 'Audit' },
                { time: '4m ago', agent: 'Knowledge Agent', task: 'Cross-Encoder reranked top 6 chunks with cosine score > 0.82', tag: 'RAG' },
                { time: '6m ago', agent: 'Finance Agent', task: 'Budget check: projected Q2 inference cost within 26% threshold', tag: 'FinOps' },
              ].map((ev, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#090E18] border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-300">{ev.agent}</span>
                    <span className="text-[10px] font-mono text-slate-500">{ev.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{ev.task}</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/50 px-1 py-0.2 rounded border border-cyan-800/40">
                      #{ev.tag}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Exit Code: 0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C2638] mt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Log retention: 90 days</span>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Open Telemetry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
