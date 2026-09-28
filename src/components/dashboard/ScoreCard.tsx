import React from 'react';
import { SCORECARD_DATA } from '../../data/mockMetrics';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const ScoreCard: React.FC = () => {
  return (
    <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1D2939] pb-2.5">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Metric Telemetry
          </span>
          <h3 className="text-xs font-semibold text-slate-100 mt-0.5">Scorecard</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Pass Rate: 97.3%</span>
        </div>
      </div>

      {/* Metric Rows with compact progress bars */}
      <div className="py-2.5 space-y-2.5">
        {SCORECARD_DATA.map((item) => (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">{item.name}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-100 font-semibold tabular-nums">{item.value.toFixed(1)}%</span>
                <span className="text-emerald-400 text-[10px] flex items-center">
                  <ArrowUpRight className="w-2.5 h-2.5 inline" /> {item.delta}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#172234] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Baseline: v2.6 model release</span>
        <span className="text-emerald-400">All SLOs healthy</span>
      </div>
    </div>
  );
};
