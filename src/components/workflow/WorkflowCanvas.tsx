import React, { useRef, useState } from 'react';
import { WorkflowNodeData, WorkflowConnection } from '../../types';
import { WorkflowNodeCard } from './WorkflowNodeCard';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Settings2,
  CheckCircle2,
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: WorkflowNodeData[];
  connections: WorkflowConnection[];
  selectedNode: WorkflowNodeData | null;
  onSelectNode: (node: WorkflowNodeData) => void;
  isRunning: boolean;
  onRunWorkflow: () => void;
  onResetWorkflow: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  connections,
  selectedNode,
  onSelectNode,
  isRunning,
  onRunWorkflow,
  onResetWorkflow,
}) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.4, Math.max(0.7, +(prev + delta).toFixed(1))));
  };

  const resetZoom = () => setZoom(1);

  // Helper to find node coordinates
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0, left: 0, right: 0, top: 0, bottom: 0 };
    // Node card is approx 185px wide and 125px tall
    return {
      x: node.x + 92,
      y: node.y + 60,
      left: node.x,
      right: node.x + 185,
      top: node.y,
      bottom: node.y + 120,
    };
  };

  return (
    <div className="relative flex-1 bg-[#070B14] overflow-hidden flex flex-col select-none">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1D2939] bg-[#0A0F1A]/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xs font-semibold text-slate-100 tracking-wide">
              Enterprise Assistant Orchestration
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            ● Live
          </span>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            7 Active Nodes · Multi-Agent Topology
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-[#0D1422] border border-[#1D2939] rounded-md p-0.5 text-slate-400">
            <button
              onClick={() => handleZoom(-0.1)}
              title="Zoom Out"
              className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              title="Zoom In"
              className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              title="Reset View"
              className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={onResetWorkflow}
            title="Reset node statuses"
            className="p-1.5 bg-[#0D1422] hover:bg-slate-800 text-slate-300 rounded-md border border-[#1D2939] text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run button */}
          <button
            onClick={onRunWorkflow}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isRunning
                ? 'bg-purple-900/60 text-purple-300 border border-purple-700 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white active:bg-purple-700'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Workflow Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:20px_20px] p-6 min-h-[460px]"
        style={{ minWidth: '100%' }}
      >
        <div
          className="relative min-w-[1040px] min-h-[500px] transition-transform duration-150 origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* SVG Connector Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
              </linearGradient>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#a855f7" />
              </marker>
            </defs>

            {/* Standard hardwired semantic connections */}
            {connections.map((conn) => {
              const fromCenter = getNodeCenter(conn.from);
              const toCenter = getNodeCenter(conn.to);
              if (!fromCenter.x || !toCenter.x) return null;

              let startX = fromCenter.right;
              let startY = fromCenter.y;
              let endX = toCenter.left;
              let endY = toCenter.y;

              // Vertical connections for Hybrid Search & Function call
              if (conn.from === 'hybrid_search' && conn.to === 'llm_reasoning') {
                startX = fromCenter.x;
                startY = fromCenter.bottom;
                endX = toCenter.x;
                endY = toCenter.top;
              } else if (conn.from === 'llm_reasoning' && conn.to === 'function_call') {
                startX = fromCenter.x - 20;
                startY = fromCenter.bottom;
                endX = toCenter.x - 20;
                endY = toCenter.top;
              } else if (conn.from === 'function_call' && conn.to === 'llm_reasoning') {
                startX = fromCenter.x + 20;
                startY = fromCenter.top;
                endX = toCenter.x + 20;
                endY = toCenter.bottom;
              }

              // Bezier curve calculations
              const dx = endX - startX;
              const dy = endY - startY;
              const cx1 = startX + dx / 2;
              const cy1 = startY;
              const cx2 = startX + dx / 2;
              const cy2 = endY;
              const pathData = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;

              const isConnActive = isRunning;

              return (
                <g key={conn.id}>
                  {/* Subtle glow backdrop */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isConnActive ? '#8b5cf6' : '#1e293b'}
                    strokeWidth={isConnActive ? 4 : 2}
                    strokeOpacity={isConnActive ? 0.4 : 0.8}
                  />
                  {/* Foreground stroke */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isConnActive ? 'url(#activeLineGrad)' : '#334155'}
                    strokeWidth={2}
                    strokeDasharray={isConnActive ? '6 4' : 'none'}
                    className={isConnActive ? 'animate-pulse' : ''}
                    markerEnd={isConnActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Render All Canvas Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute z-10"
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
            >
              <WorkflowNodeCard
                node={node}
                isSelected={selectedNode?.id === node.id}
                onClick={onSelectNode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
