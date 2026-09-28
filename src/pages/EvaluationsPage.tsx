import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { EVALUATION_RADAR_DATA, SCORECARD_DATA } from '../data/mockMetrics';
import { Award, CheckCircle2, TrendingUp, Play, ArrowRight, FileText } from 'lucide-react';

interface EvaluationsPageProps {
  onShowToast: (title: string, desc?: string) => void;
}

export const EvaluationsPage: React.FC<EvaluationsPageProps> = ({ onShowToast }) => {
  const [isRunningEval, setIsRunningEval] = useState(false);

  const handleRunEvalSuite = () => {
    setIsRunningEval(true);
    setTimeout(() => {
      setIsRunningEval(false);
      onShowToast('Evaluations Completed', '1,250 test cases evaluated: Pass Rate 97.3%');
    }, 1200);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Enterprise Evaluation Benchmark Suite</h1>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Overall: 94.6 / 100
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated LLM-as-a-judge & semantic rubric evaluation across golden datasets.
          </p>
        </div>

        <button
          onClick={handleRunEvalSuite}
          disabled={isRunningEval}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md transition-colors"
        >
          {isRunningEval ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running 1,250 Test Runs...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Trigger Full Evaluation Run
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Radar Chart + Detailed Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Card */}
        <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Golden Dataset Multi-Metric Radar</h3>
            <p className="text-[11px] text-slate-400">Comparing current v2.7 model pipeline against enterprise benchmark SLOs</p>
          </div>

          <div className="w-full h-64 relative py-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={EVALUATION_RADAR_DATA}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#1E293B" tick={false} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Radar name="Active v2.7" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#1C2638] flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Active v2.7: 94.6</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Benchmark: 89.4</span>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-4">
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Rubric Scorecard & Delta History</h3>
            <p className="text-[11px] text-slate-400">Evaluated against 1,250 production test queries</p>
          </div>

          <div className="space-y-3.5">
            {SCORECARD_DATA.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{item.value.toFixed(1)}%</span>
                    <span className="text-emerald-400 text-[11px]">{item.delta}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#172234] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1C2638] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Pass Rate: <strong className="text-emerald-400 font-bold">97.3%</strong></span>
            <span>Hallucination Rate: <strong className="text-slate-200 font-bold">0.4%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
