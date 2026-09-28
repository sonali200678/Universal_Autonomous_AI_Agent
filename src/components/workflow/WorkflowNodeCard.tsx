import React from 'react';
import {
  MessageSquare,
  Shield,
  Search,
  Brain,
  Wrench,
  CheckCircle,
  FileCheck,
  Cpu,
  Layers,
  Sparkles,
  Database,
  Terminal,
  Lock,
} from 'lucide-react';
import { WorkflowNodeData } from '../../types';

interface WorkflowNodeCardProps {
  node: WorkflowNodeData;
  isSelected?: boolean;
  onClick: (node: WorkflowNodeData) => void;
}

export const WorkflowNodeCard: React.FC<WorkflowNodeCardProps> = ({
  node,
  isSelected,
  onClick,
}) => {
  // Category badge & accent color
  let categoryColor = 'text-purple-400 bg-purple-950/40 border-purple-800/40';
  let icon = <Brain className="w-3.5 h-3.5 text-purple-400" />;

  switch (node.category) {
    case 'INPUT':
      categoryColor = 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      icon = <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />;
      break;
    case 'RETRIEVAL':
      categoryColor = 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      icon = <Search className="w-3.5 h-3.5 text-blue-400" />;
      break;
    case 'REASONING':
      categoryColor = 'text-purple-400 bg-purple-950/40 border-purple-800/40';
      icon = <Brain className="w-3.5 h-3.5 text-purple-400" />;
      break;
    case 'TOOLS':
      categoryColor = 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      icon = <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      break;
    case 'GUARDRAILS':
      categoryColor = 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      icon = <Shield className="w-3.5 h-3.5 text-rose-400" />;
      break;
    case 'RESPONSE':
      categoryColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      break;
  }

  // Execution status styling
  let statusBadge = (
    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      Success
    </span>
  );

  let borderStyle = isSelected
    ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/50'
    : 'border-[#1D2939] hover:border-slate-600';

  if (node.status === 'running') {
    borderStyle = 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-1 ring-purple-400 animate-pulse';
    statusBadge = (
      <span className="flex items-center gap-1 text-[10px] font-mono text-purple-300">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
        Running...
      </span>
    );
  } else if (node.status === 'idle') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        Idle
      </span>
    );
  } else if (node.status === 'warning') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Disabled
      </span>
    );
  }

  return (
    <div
      onClick={() => onClick(node)}
      className={`group relative w-[172px] sm:w-[185px] bg-[#0E1524] rounded-lg border ${borderStyle} p-3 cursor-pointer transition-all duration-200 select-none shadow-lg hover:translate-y-[-1px]`}
    >
      {/* Category header & Status */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className={`text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border ${categoryColor}`}>
          {node.category}
        </span>
        {statusBadge}
      </div>

      {/* Node Title & Icon */}
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1 rounded bg-[#131C31] border border-slate-800 shrink-0">
          {icon}
        </div>
        <h4 className="text-xs font-semibold text-slate-100 truncate group-hover:text-purple-300 transition-colors">
          {node.name}
        </h4>
      </div>

      {/* Short Description */}
      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
        {node.description}
      </p>

      {/* Metric footer */}
      {node.metrics && (
        <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[10px] font-mono text-slate-400">
          {node.metrics.topK !== undefined && (
            <span>Top K: <strong className="text-slate-200">{node.metrics.topK}</strong></span>
          )}
          {node.metrics.score !== undefined && (
            <span>Score: <strong className="text-slate-200">{node.metrics.score}</strong></span>
          )}
          {node.metrics.latency && !node.metrics.topK && (
            <span>Lat: <strong className="text-slate-200">{node.metrics.latency}</strong></span>
          )}
          {node.metrics.tokens !== undefined && (
            <span>Tok: <strong className="text-slate-200">{node.metrics.tokens}</strong></span>
          )}
          {node.metrics.statusText && !node.metrics.topK && !node.metrics.tokens && (
            <span className="truncate text-slate-300">{node.metrics.statusText}</span>
          )}
        </div>
      )}
    </div>
  );
};
