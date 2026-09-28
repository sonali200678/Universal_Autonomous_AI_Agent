import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Sliders,
  CheckCircle2,
  FileText,
  Clock,
  Coins,
  Cpu,
  Zap,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { ChatMessage, EnterpriseUser } from '../../types';
import { BackendSecurityEngine } from '../../services/securityEngine';

interface TestRunPanelProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isRunning: boolean;
  onClearChat: () => void;
  onClose?: () => void;
  currentUser?: EnterpriseUser;
}

const DEFAULT_CHIPS = [
  'Analyze our procurement vendors and identify the top 5 vendors by purchase amount.',
  'Query employee salaries and HR compensation records.',
  'Create purchase order for Apex Cloud Systems for ₹48.2 Lakhs.',
  'Query corporate finance general ledger reserves.',
];

export const TestRunPanel: React.FC<TestRunPanelProps> = ({
  messages,
  onSendMessage,
  isRunning,
  onClearChat,
  onClose,
  currentUser = BackendSecurityEngine.getCurrentUser(),
}) => {
  const [input, setInput] = useState('');
  const [model, setModel] = useState('Gemini 2.5 Flash');
  const [temperature, setTemperature] = useState(0.2);
  const [toolsActive, setToolsActive] = useState({
    hybridSearch: true,
    sqlRunner: true,
    safetyGuard: true,
  });
  const [showControls, setShowControls] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRunning) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleChipClick = (chip: string) => {
    if (isRunning) return;
    onSendMessage(chip);
  };

  return (
    <div className="w-80 lg:w-96 bg-[#0B101D] border-l border-[#1D2939] flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-3 border-b border-[#1D2939] bg-[#090E1A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-100">Test Run</span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/50 border border-purple-800/40 px-1.5 py-0.5 rounded">
              run_7f3a2c11
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setShowControls(!showControls)}
              title="Toggle runtime parameters"
              className={`p-1 rounded hover:text-slate-200 transition-colors ${
                showControls ? 'bg-purple-950/60 text-purple-300' : 'hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearChat}
              title="Reset conversation"
              className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                title="Close panel"
                className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Security Identity & Effective Permission Manifest */}
        <div className="mt-2 pt-2 border-t border-[#1C2638] flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <Shield className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="font-semibold text-white truncate">{currentUser.name}</span>
            <span className="text-slate-400">({currentUser.role.replace('_ANALYST', '')})</span>
          </div>
          <span className="text-cyan-400 font-mono shrink-0">{currentUser.region}</span>
        </div>

        {/* Runtime Parameters Drawer */}
        {showControls && (
          <div className="mt-2.5 pt-2.5 border-t border-[#1C2638] space-y-2.5 text-xs text-slate-300 animate-in fade-in duration-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Foundation Model</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-[#070B14] border border-[#1D2939] rounded px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none"
              >
                <option>Gemini 2.5 Flash</option>
                <option>Gemini 2.5 Pro</option>
                <option>Claude 3.7 Sonnet</option>
                <option>GPT-4o Mini</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Sampling Temperature</span>
                <span className="font-mono text-purple-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] text-slate-400 block mb-1">Active Tool Connectors</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setToolsActive((p) => ({ ...p, hybridSearch: !p.hybridSearch }))}
                  className={`px-1.5 py-1 text-[10px] rounded border transition-colors ${
                    toolsActive.hybridSearch
                      ? 'bg-purple-950/50 border-purple-800/60 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Hybrid RAG
                </button>
                <button
                  onClick={() => setToolsActive((p) => ({ ...p, sqlRunner: !p.sqlRunner }))}
                  className={`px-1.5 py-1 text-[10px] rounded border transition-colors ${
                    toolsActive.sqlRunner
                      ? 'bg-purple-950/50 border-purple-800/60 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  RLS SQL
                </button>
                <button
                  onClick={() => setToolsActive((p) => ({ ...p, safetyGuard: !p.safetyGuard }))}
                  className={`px-1.5 py-1 text-[10px] rounded border transition-colors ${
                    toolsActive.safetyGuard
                      ? 'bg-purple-950/50 border-purple-800/60 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Safety Guard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isDenied = msg.content.includes('403 FORBIDDEN') || msg.content.includes('Access to HR & Payroll');
          const isGated = msg.content.includes('HIGH-RISK ACTION GATED');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.sender === 'user' ? (
                  <>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    <span className="text-[11px] font-semibold text-slate-300">You</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span className="text-[11px] font-semibold text-purple-300">Enterprise AI</span>
                    <span className="text-[10px] text-slate-500 font-mono">({msg.timestamp})</span>
                  </>
                )}
              </div>

              <div
                className={`p-3 rounded-xl text-xs leading-relaxed max-w-[92%] select-text ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : isDenied
                    ? 'bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-tl-none whitespace-pre-line'
                    : isGated
                    ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200 rounded-tl-none whitespace-pre-line'
                    : 'bg-[#0D1320] border border-[#1D2939] text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.content}

                {msg.sender === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-[#1C2638] space-y-1.5">
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-cyan-400">
                        <FileText className="w-3 h-3" />
                        <span>Citations:</span>
                        {msg.citations.map((c) => (
                          <span key={c} className="bg-cyan-950/50 px-1 py-0.2 rounded border border-cyan-800/40">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>Tokens: {msg.tokensUsed || 980}</span>
                      <span>Cost: {msg.costEstimate || '$0.0021'}</span>
                      <span>Latency: {msg.latencySeconds || 1.4}s</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isRunning && (
          <div className="flex items-center gap-2 p-3 bg-[#0D1320] border border-[#1D2939] rounded-xl text-xs text-purple-300 animate-pulse">
            <Bot className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Evaluating prompt shield, RLS database filters, and content safety...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Pre-canned Permission Testing Chips */}
      <div className="p-2 border-t border-[#1D2939] bg-[#090E1A] space-y-1.5">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block px-1">
          Permission Test Scenarios:
        </span>
        <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
          {DEFAULT_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(chip)}
              disabled={isRunning}
              className="text-left p-1.5 rounded bg-[#0D1320] hover:bg-[#131B2D] border border-[#1D2939] hover:border-purple-600/50 text-[10px] text-slate-300 hover:text-white transition-all truncate disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#1D2939] bg-[#0B101D] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask enterprise assistant as ${currentUser.name}...`}
          disabled={isRunning}
          className="flex-1 bg-[#070B14] border border-[#1D2939] rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isRunning}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
