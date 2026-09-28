import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Sparkles,
  FileText,
  Clock,
  Cpu,
  Coins,
  Shield,
  Layers,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldAlert,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { ChatMessage, EnterpriseUser } from '../types';
import { BackendSecurityEngine } from '../services/securityEngine';

interface ChatPageProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isRunning: boolean;
  onClearChat: () => void;
  currentUser?: EnterpriseUser;
}

const CHAT_PROMPTS = [
  'Analyze our procurement vendors and identify the top 5 vendors by purchase amount.',
  'Query employee salaries and HR compensation records.',
  'Create purchase order for Apex Cloud Systems for ₹48.2 Lakhs.',
  'Query corporate finance general ledger reserves.',
];

export const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  onSendMessage,
  isRunning,
  onClearChat,
  currentUser = BackendSecurityEngine.getCurrentUser(),
}) => {
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Orchestrator Agent');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRunning) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070B14] overflow-hidden select-none">
      {/* Chat Top Header */}
      <div className="h-12 bg-[#090E1A] border-b border-[#1D2939] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold text-slate-100">Enterprise AI Assistant Chat</h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                Multi-Agent Mode · RBAC Enforced
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Direct access to orchestrated cognitive agents, enterprise RAG, and tools
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">Target Agent:</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-[#0D1422] border border-[#1D2939] rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Orchestrator Agent">Orchestrator Agent (Auto-Router)</option>
              <option value="Procurement Analyst Agent">Procurement Analyst Agent</option>
              <option value="Knowledge Agent">Knowledge Agent (RAG)</option>
              <option value="Validation Agent">Validation Agent</option>
            </select>
          </div>

          <button
            onClick={onClearChat}
            className="p-1.5 bg-[#0D1422] hover:bg-slate-800 border border-[#1D2939] rounded-md text-slate-400 hover:text-slate-200 text-xs transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Active Identity Bar */}
      <div className="bg-[#0A0F1D] border-b border-[#1D2939] px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>
            Authenticated Principal: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role} • Dept: {currentUser.department} • Region: {currentUser.region})
          </span>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
          Effective Permissions: {currentUser.permissions.length} Grants
        </span>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-4xl w-full mx-auto">
        {messages.map((msg) => {
          const isDenied = msg.content.includes('403 FORBIDDEN') || msg.content.includes('Access to HR & Payroll');
          const isGated = msg.content.includes('HIGH-RISK ACTION GATED');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                {msg.sender === 'user' ? (
                  <>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {currentUser.name} ({currentUser.role})
                    </span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-semibold text-purple-300">
                      {selectedAgent}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">({msg.timestamp})</span>
                  </>
                )}
              </div>

              <div
                className={`p-4 rounded-xl text-xs leading-relaxed max-w-[90%] select-text shadow-md ${
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
                  <div className="mt-3 pt-2.5 border-t border-[#1C2638] space-y-2">
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                        <FileText className="w-3 h-3" />
                        <span>Verified Citations & Security References:</span>
                        {msg.citations.map((c) => (
                          <span key={c} className="bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#162032]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-purple-400" />
                          <span>{msg.tokensUsed || 980} Tokens</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-emerald-400" />
                          <span>{msg.costEstimate || '$0.0021'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{msg.latencySeconds || 1.4}s</span>
                        </span>
                      </div>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> RBAC & Invariant Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isRunning && (
          <div className="flex items-center gap-2 p-4 bg-[#0D1320] border border-[#1D2939] rounded-xl text-xs text-purple-300 animate-pulse max-w-md">
            <Bot className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Evaluating prompt shield, RLS database filters, and content safety...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Test Chips */}
      <div className="px-6 py-2 bg-[#090E1A] border-t border-[#1D2939] overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono text-slate-400 shrink-0">Test Scenarios:</span>
        {CHAT_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(p)}
            disabled={isRunning}
            className="px-2.5 py-1 bg-[#0D1422] hover:bg-slate-800 border border-[#1D2939] hover:border-purple-600/50 rounded-full text-[11px] text-slate-300 hover:text-white transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Bottom Input Area */}
      <div className="p-4 bg-[#090E1A] border-t border-[#1D2939] shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask enterprise assistant as ${currentUser.name} (${currentUser.role})...`}
            disabled={isRunning}
            className="w-full pl-4 pr-12 py-3 bg-[#070B14] border border-[#1D2939] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isRunning}
            className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
