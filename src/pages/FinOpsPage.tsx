import React from 'react';
import { COST_BY_MODEL, INITIAL_TOKEN_COST } from '../data/mockMetrics';
import { Coins, DollarSign, TrendingDown, AlertCircle, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';

export const FinOpsPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Enterprise FinOps & Cost Governance</h1>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Under Budget ($11,136 Remaining)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time inference spend by model, tenant, tool invoker, and cognitive agent.
          </p>
        </div>
      </div>

      {/* Top 4 Budget Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Today&apos;s Spend</span>
          <div className="text-2xl font-bold font-mono text-white">$3,864</div>
          <p className="text-[10px] text-emerald-400 font-mono">25.7% of $15,000 daily budget</p>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">MTD Spend (Sept 2026)</span>
          <div className="text-2xl font-bold font-mono text-purple-400">$94,220</div>
          <p className="text-[10px] text-slate-400 font-mono">Projected MTD: $108,000</p>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cost / Token (Effective)</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">$0.306</div>
          <p className="text-[10px] text-slate-400 font-mono">Per 1M input+output tokens</p>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Estimated Monthly Savings</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">$28,400</div>
          <p className="text-[10px] text-emerald-400 font-mono">Via Gemini Flash routing</p>
        </div>
      </div>

      {/* Breakdown Table: Cost by Model */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white">Foundation Model Cost Breakdown</h3>
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1D2939] text-slate-400 text-[10px] uppercase">
              <th className="pb-2.5">Foundation Model</th>
              <th className="pb-2.5">Tokens Consumed</th>
              <th className="pb-2.5">Share of Volume</th>
              <th className="pb-2.5 text-right">Incurred Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1D2939]/60 text-slate-200">
            {COST_BY_MODEL.map((m) => (
              <tr key={m.model} className="hover:bg-slate-800/30">
                <td className="py-3 font-semibold text-purple-300 font-sans">{m.model}</td>
                <td className="py-3 text-slate-300">{m.tokens}</td>
                <td className="py-3 text-cyan-400">{m.share}</td>
                <td className="py-3 text-right font-bold text-white">${m.cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FinOps AI Optimization Recommendations */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-purple-200">Autonomous FinOps Optimization Opportunities</h4>
        </div>
        <div className="space-y-1 text-xs text-slate-300">
          <p>• <strong>Prompt Caching Lift:</strong> Enable persistent prefix caching on 4,800 repeat customer service queries to save ~1.8M tokens daily.</p>
          <p>• <strong>Flash Model Default:</strong> Routing tier-1 queries to Gemini 2.5 Flash saved $412 today while preserving 99.2% safety and 96% groundedness.</p>
        </div>
      </div>
    </div>
  );
};
