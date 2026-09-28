import React from 'react';
import { TokenCostData } from '../../data/mockMetrics';
import { Coins, Cpu, ArrowUpRight, DollarSign } from 'lucide-react';

interface TokenCostMeterProps {
  data: TokenCostData;
}

export const TokenCostMeter: React.FC<TokenCostMeterProps> = ({ data }) => {
  const tokenPct = Math.round((data.tokensUsedMillion / data.tokensTotalMillion) * 100);
  const costPct = Math.round((data.costTotal / data.costBudget) * 100);

  const inputPct = Math.round((data.inputTokensMillion / data.tokensUsedMillion) * 100);
  const outputPct = 100 - inputPct;

  const modelCostPct = Math.round((data.modelCost / data.costTotal) * 100);
  const toolCostPct = 100 - modelCostPct;

  return (
    <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1D2939] pb-2.5">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            FinOps Observability
          </span>
          <h3 className="text-xs font-semibold text-slate-100 mt-0.5">Token & Cost Meter (Today)</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
          Real-time Metering
        </div>
      </div>

      <div className="py-2.5 space-y-4">
        {/* Section 1: Tokens */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> Tokens
            </span>
            <div className="font-mono text-slate-200">
              <span className="font-semibold text-white">{data.tokensUsedMillion.toFixed(2)}M</span> / {data.tokensTotalMillion}M{' '}
              <span className="text-purple-400 font-bold ml-1">({tokenPct}%)</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#172234] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-purple-500 rounded-l-full transition-all duration-300"
              style={{ width: `${tokenPct * (inputPct / 100)}%` }}
              title={`Input Tokens: ${data.inputTokensMillion.toFixed(2)}M`}
            />
            <div
              className="h-full bg-cyan-400 rounded-r-full transition-all duration-300"
              style={{ width: `${tokenPct * (outputPct / 100)}%` }}
              title={`Output Tokens: ${data.outputTokensMillion.toFixed(2)}M`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span>Input: <strong className="text-slate-300">{data.inputTokensMillion.toFixed(1)}M ({inputPct}%)</strong></span>
            <span>Output: <strong className="text-slate-300">{data.outputTokensMillion.toFixed(1)}M ({outputPct}%)</strong></span>
          </div>
        </div>

        {/* Section 2: Cost */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Cost
            </span>
            <div className="font-mono text-slate-200">
              <span className="font-semibold text-white">${data.costTotal.toLocaleString()}</span> / ${data.costBudget.toLocaleString()}{' '}
              <span className="text-emerald-400 font-bold ml-1">({costPct}%)</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#172234] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
              style={{ width: `${costPct * (modelCostPct / 100)}%` }}
              title={`Model Cost: $${data.modelCost}`}
            />
            <div
              className="h-full bg-blue-400 rounded-r-full transition-all duration-300"
              style={{ width: `${costPct * (toolCostPct / 100)}%` }}
              title={`Tool Cost: $${data.toolCost}`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span>Model: <strong className="text-slate-300">${data.modelCost.toLocaleString()} ({modelCostPct}%)</strong></span>
            <span>Tools: <strong className="text-slate-300">${data.toolCost.toLocaleString()} ({toolCostPct}%)</strong></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Daily Budget Cap: $15,000</span>
        <span className="text-emerald-400 font-medium">Under Budget ($11,136 left)</span>
      </div>
    </div>
  );
};
