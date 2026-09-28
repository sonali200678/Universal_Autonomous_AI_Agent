import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { EVALUATION_RADAR_DATA } from '../../data/mockMetrics';
import { CheckCircle2, Award, ExternalLink } from 'lucide-react';

interface EvaluationCardProps {
  onOpenFullEvals?: () => void;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ onOpenFullEvals }) => {
  return (
    <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1D2939] pb-2.5">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Evaluations (Latest)
          </span>
          <h3 className="text-xs font-semibold text-slate-100 mt-0.5">Autonomous Benchmark</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            Pass Rate 97.3%
          </span>
          {onOpenFullEvals && (
            <button
              onClick={onOpenFullEvals}
              title="Open full evaluations"
              className="text-slate-500 hover:text-slate-300 p-1 rounded"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Score & Spider Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 py-2">
        {/* Left: Overall Score display */}
        <div className="flex flex-col justify-center space-y-1.5 pl-1">
          <span className="text-[11px] text-slate-400">Overall Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              94.6
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>

          <div className="pt-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Groundedness</span>
              <span className="text-emerald-400 font-semibold">96.0%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Safety Index</span>
              <span className="text-emerald-400 font-semibold">99.2%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Relevance</span>
              <span className="text-slate-200">92.0%</span>
            </div>
          </div>
        </div>

        {/* Right: Radar Chart */}
        <div className="w-full h-36 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={EVALUATION_RADAR_DATA} margin={{ top: 5, right: 15, bottom: 5, left: 15 }}>
              <PolarGrid stroke="#1E293B" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#94A3B8', fontSize: 9 }}
              />
              <PolarRadiusAxis domain={[0, 100]} stroke="#1E293B" tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Evaluated on 1,250 golden queries</span>
        <span className="text-purple-400">CI/CD Golden Run</span>
      </div>
    </div>
  );
};
