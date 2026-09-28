import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TIME_SERIES_REQUESTS, COST_BY_MODEL } from '../data/mockMetrics';
import { BarChart3, TrendingUp, Clock, Zap, Cpu } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Enterprise Cognitive Analytics</h1>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
              24-Hour Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Throughput curves, latency distribution, agent traffic volume, and token velocity.
          </p>
        </div>
      </div>

      {/* Top 3 High Level Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Requests (24h)</span>
          <div className="text-2xl font-bold font-mono text-white">18,440</div>
          <span className="text-[11px] text-emerald-400 font-mono">↑ 14.2% vs previous period</span>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Average P95 Latency</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">2.14s</div>
          <span className="text-[11px] text-emerald-400 font-mono">↓ 0.28s improvement</span>
        </div>
        <div className="p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Autonomous Cache Hit Rate</span>
          <div className="text-2xl font-bold font-mono text-purple-400">42.8%</div>
          <span className="text-[11px] text-slate-400 font-mono">Saved $920 in inference spend</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Requests over time */}
        <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Session Ingestion Volume (24h)</h3>
            <p className="text-[11px] text-slate-400">Hourly requests routed across 7 autonomous agents</p>
          </div>

          <div className="w-full h-64 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SERIES_REQUESTS}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0F1A', borderColor: '#1D2939', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2} fill="url(#reqGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Peak Hour: 15:00 (4,220 req/hr)</span>
            <span className="text-purple-400">Cluster Load: Nominal</span>
          </div>
        </div>

        {/* Bar Chart: Cost by Model */}
        <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Cost Allocation by Foundation Model</h3>
            <p className="text-[11px] text-slate-400">Daily inference spend ($USD) by backing model family</p>
          </div>

          <div className="w-full h-64 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_BY_MODEL}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="model" stroke="#64748b" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0F1A', borderColor: '#1D2939', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="cost" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Gemini 2.5 Flash: 47.6% of volume</span>
            <span className="text-cyan-400">FinOps Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
