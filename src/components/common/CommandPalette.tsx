import React, { useState, useEffect, useRef } from 'react';
import { Search, Bot, Wrench, GitFork, BookOpen, Database, FileText, ArrowRight, X } from 'lucide-react';
import { PageId } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onSelectSearchItem: (type: string, id: string, name: string) => void;
}

interface PaletteItem {
  id: string;
  name: string;
  category: 'Agent' | 'Tool' | 'Workflow' | 'Prompt' | 'Dataset' | 'Document';
  description: string;
  targetPage: PageId;
  shortcut?: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { id: 'wf-assist', name: 'Enterprise Assistant Orchestration', category: 'Workflow', description: 'v2.7 live cognitive multi-agent pipeline', targetPage: 'agents', shortcut: 'W1' },
  { id: 'ag-orch', name: 'Orchestrator Agent', category: 'Agent', description: 'Central multi-agent intent planner & router', targetPage: 'agents', shortcut: 'A1' },
  { id: 'ag-proc', name: 'Procurement Analyst Agent', category: 'Agent', description: 'ERP purchase orders & vendor spend analyzer', targetPage: 'agents', shortcut: 'A2' },
  { id: 'ag-rag', name: 'Knowledge Agent', category: 'Agent', description: 'Dense & hybrid semantic vector retrieval', targetPage: 'rag', shortcut: 'A3' },
  { id: 'tl-sql', name: 'Enterprise SQL Runner', category: 'Tool', description: 'Read-replica PostgreSQL & BigQuery engine', targetPage: 'tools', shortcut: 'T1' },
  { id: 'tl-search', name: 'Hybrid Enterprise Search', category: 'Tool', description: 'Dense + BM25 reciprocal rank fusion index', targetPage: 'tools', shortcut: 'T2' },
  { id: 'tl-python', name: 'Python Code Sandbox', category: 'Tool', description: 'WASM & MicroVM sandboxed execution', targetPage: 'tools', shortcut: 'T3' },
  { id: 'ds-proc', name: 'Enterprise Procurement Dataset', category: 'Dataset', description: '14,200 purchase orders and vendor records', targetPage: 'datasets', shortcut: 'D1' },
  { id: 'ds-cs', name: 'Customer Support Telemetry', category: 'Dataset', description: '38,400 deflection and CSAT sessions', targetPage: 'datasets', shortcut: 'D2' },
  { id: 'pr-greet', name: 'Customer Greeting Prompt', category: 'Prompt', description: 'Prompt template #v1.4 for support triage', targetPage: 'agents', shortcut: 'P1' },
  { id: 'pr-track', name: 'Order Tracking Prompt', category: 'Prompt', description: 'Prompt template #v3.1 for ERP PO status', targetPage: 'agents', shortcut: 'P2' },
  { id: 'doc-sop', name: 'Enterprise Procurement SOP 2026', category: 'Document', description: 'Corporate purchasing policy & compliance gates', targetPage: 'rag', shortcut: 'DOC' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectSearchItem,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredItems = PALETTE_ITEMS.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item: PaletteItem) => {
    onSelectSearchItem(item.category, item.id, item.name);
    onNavigate(item.targetPage);
    onClose();
  };

  const getCategoryIcon = (category: PaletteItem['category']) => {
    switch (category) {
      case 'Agent':
        return <Bot className="w-3.5 h-3.5 text-purple-400" />;
      case 'Tool':
        return <Wrench className="w-3.5 h-3.5 text-blue-400" />;
      case 'Workflow':
        return <GitFork className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Prompt':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Dataset':
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'Document':
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-100">
      <div
        className="w-full max-w-xl bg-[#0D1320] border border-[#1D2939] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1D2939] bg-[#0A0F1A]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search agents, tools, workflows, prompts, datasets, documents... (ESC to close)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto max-h-[380px] space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching agents, tools, or enterprise assets found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-purple-950/40 text-slate-100 border border-purple-500/30'
                      : 'text-slate-300 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-100 truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{item.category}]</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <span className="text-[10px] font-mono text-slate-500 px-1 py-0.5 rounded bg-slate-900/60 border border-slate-800">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#090E17] border-t border-[#1D2939] text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">↵</kbd> to select</span>
          </div>
          <span className="text-purple-400">UAMC-I Enterprise Search</span>
        </div>
      </div>
    </div>
  );
};
