import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { WorkflowNodeData } from '../../types';
import { Bot, Sliders, Cpu, Activity, Terminal, Copy, Power, Save, Layers } from 'lucide-react';

interface NodeDetailModalProps {
  node: WorkflowNodeData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNode: (updatedNode: WorkflowNodeData) => void;
  onDuplicateNode: (node: WorkflowNodeData) => void;
  onToggleDisableNode: (nodeId: string) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  isOpen,
  onClose,
  onUpdateNode,
  onDuplicateNode,
  onToggleDisableNode,
  onShowToast,
}) => {
  if (!node) return null;

  const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'metrics'>('config');
  const [model, setModel] = useState(node.config?.model || 'Gemini 2.5 Flash');
  const [temperature, setTemperature] = useState(node.config?.temperature ?? 0.2);
  const [promptTemplate, setPromptTemplate] = useState(
    node.config?.promptTemplate || 'You are an enterprise AI cognitive orchestrator. Formulate a plan, invoke tools, synthesize grounded facts.'
  );
  const [maxTokens, setMaxTokens] = useState(node.config?.maxTokens || 4096);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (node) {
      setModel(node.config?.model || 'Gemini 2.5 Flash');
      setTemperature(node.config?.temperature ?? 0.2);
      setPromptTemplate(node.config?.promptTemplate || 'You are an enterprise AI cognitive orchestrator. Formulate a plan, invoke tools, synthesize grounded facts.');
      setMaxTokens(node.config?.maxTokens || 4096);
      setIsEditing(false);
    }
  }, [node]);

  const handleSave = () => {
    const updated: WorkflowNodeData = {
      ...node,
      config: {
        ...node.config,
        model,
        temperature,
        promptTemplate,
        maxTokens,
      },
    };
    onUpdateNode(updated);
    setIsEditing(false);
    onShowToast(`Node '${node.name}' updated`, 'Parameters applied to live workflow state');
  };

  const isDisabled = node.status === 'warning' || (node.metrics?.statusText?.includes('Disabled') ?? false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${node.name} (${node.category})`}
      subtitle={`Node ID: ${node.id} · Type: ${node.type}`}
      maxWidth="max-w-2xl"
      footerActions={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleDisableNode(node.id);
                onShowToast(isDisabled ? `Enabled ${node.name}` : `Disabled ${node.name}`);
                onClose();
              }}
              className={`px-3 py-1.5 text-xs rounded-md border flex items-center gap-1.5 transition-colors ${
                isDisabled
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {isDisabled ? 'Enable Node' : 'Disable'}
            </button>
            <button
              onClick={() => {
                onDuplicateNode(node);
                onShowToast(`Duplicated ${node.name}`, 'New clone inserted into canvas');
                onClose();
              }}
              className="px-3 py-1.5 text-xs rounded-md border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-900/70 border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Model / Engine</span>
          <span className="text-xs font-semibold text-slate-200 font-mono">{node.config?.model || 'Gemini 2.5'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Latency</span>
          <span className="text-xs font-semibold text-slate-200 font-mono">{node.metrics?.latency || '1.4s'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tokens</span>
          <span className="text-xs font-semibold text-slate-200 font-mono tabular-nums">{node.metrics?.tokens ? node.metrics.tokens.toLocaleString() : '1,206'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Execution Status</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {node.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'config' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Node Configuration
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'logs' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Execution Logs
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'metrics' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Telemetry & Traces
        </button>
      </div>

      {/* Tab: Config */}
      {activeTab === 'config' && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Model Backing</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Ultra-fast, 1.4s)</option>
                <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                <option value="Guardrail-Engine-v3">Guardrail Engine v3</option>
                <option value="text-embedding-004 + BM25">text-embedding-004 + BM25</option>
                <option value="PostgreSQL Enterprise Connector">PostgreSQL Enterprise Connector</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Temperature</label>
                <span className="text-xs font-mono text-purple-400">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Prompt / Instructions Template</label>
            <textarea
              rows={4}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
              placeholder="Enter system prompt instructions or query template..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Max Output Tokens</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-48 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}

      {/* Tab: Logs */}
      {activeTab === 'logs' && (
        <div className="p-3 bg-black/60 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 space-y-1.5 max-h-56 overflow-y-auto">
          {node.logs && node.logs.length > 0 ? (
            node.logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-400 shrink-0">&gt;</span>
                <span className="text-slate-300 leading-relaxed">{log}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No runtime error logs. Node nominal.</p>
          )}
        </div>
      )}

      {/* Tab: Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400">P50 Latency</span>
            <span className="font-mono text-slate-200">1.22s</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400">P99 Latency</span>
            <span className="font-mono text-slate-200">1.89s</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400">Cache Hit Rate</span>
            <span className="font-mono text-emerald-400">88.4%</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400">Error Fallback Rate</span>
            <span className="font-mono text-slate-200">0.02%</span>
          </div>
        </div>
      )}
    </Modal>
  );
};
