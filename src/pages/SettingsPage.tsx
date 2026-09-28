import React, { useState } from 'react';
import { Settings, Shield, Sliders, Key, Bell, Users, CheckCircle2, Save } from 'lucide-react';

interface SettingsPageProps {
  onShowToast: (title: string, desc?: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const [defaultModel, setDefaultModel] = useState('Gemini 2.5 Flash');
  const [retrievalTopK, setRetrievalTopK] = useState(6);
  const [contentSafetyThreshold, setContentSafetyThreshold] = useState(0.95);
  const [budgetLimit, setBudgetLimit] = useState(15000);

  const handleSave = () => {
    onShowToast('Settings Saved', 'Workspace configuration updated');
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Workspace Configuration & Security Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure foundation model defaults, guardrail sensitivity, RBAC access policies, and billing limits.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>

      {/* Model & Runtime Settings */}
      <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" /> Default Foundation Model & Inference Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Primary Orchestration Model</label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full px-3 py-2 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Recommended for &lt;2s latency)</option>
              <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Deep Multi-Agent Reasoning)</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">RAG Candidate Chunk Top-K: {retrievalTopK}</label>
            <input
              type="range"
              min="3"
              max="20"
              value={retrievalTopK}
              onChange={(e) => setRetrievalTopK(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Guardrail & Compliance Policy */}
      <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-rose-400" /> Guardrails & Zero-Trust Governance
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-[#070B14] border border-[#1D2939] cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Enforce Prompt Injection Shield (OWASP Top 10)</span>
              <span className="text-[11px] text-slate-400">Blocks adversarial overrides before invoking foundation model reasoning</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-[#070B14] border border-[#1D2939] cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Automatic PII Masking & Sovereign Redaction</span>
              <span className="text-[11px] text-slate-400">Redacts Aadhaar, SSN, Credit Cards, and corporate internal emails</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4" />
          </label>
        </div>
      </div>

      {/* FinOps Budget Limits */}
      <div className="p-5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" /> Daily FinOps Budget Limit & Alerting
        </h3>

        <div className="flex items-center gap-4">
          <div className="w-64">
            <label className="block text-xs font-medium text-slate-300 mb-1">Daily Cap ($USD)</label>
            <input
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
          <p className="text-xs text-slate-400 mt-5">
            Auto-throttle tier-2 requests if spend approaches 90% of cap.
          </p>
        </div>
      </div>
    </div>
  );
};
