import React, { useState } from 'react';
import { PromptItem } from '../../types';
import { Search, Plus, BookOpen, Clock, Tag } from 'lucide-react';

interface PromptLibraryCardProps {
  prompts: PromptItem[];
  onSelectPrompt: (prompt: PromptItem) => void;
  onNewPrompt: () => void;
}

export const PromptLibraryCard: React.FC<PromptLibraryCardProps> = ({
  prompts,
  onSelectPrompt,
  onNewPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const allTags = ['All', 'greeting', 'orders', 'refunds', 'tech', 'escalation'];

  const filtered = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1D2939] pb-2.5">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Versioned Templates
          </span>
          <h3 className="text-xs font-semibold text-slate-100 mt-0.5">Prompt Library</h3>
        </div>
        <button
          onClick={onNewPrompt}
          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" />
          New Prompt
        </button>
      </div>

      {/* Search and Tag filter */}
      <div className="pt-2 pb-1 space-y-1.5">
        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-7 pr-2.5 py-1 bg-[#070B14] border border-[#1D2939] rounded-md text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none text-[10px]">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-0.5 rounded font-mono transition-colors shrink-0 ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tag === 'All' ? 'All Tags' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt items list */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectPrompt(item)}
            className="group flex items-center justify-between p-2 rounded-lg bg-[#090E18] hover:bg-purple-950/20 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-200 group-hover:text-purple-300 truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.version}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.tags.map((t) => (
                  <span key={t} className="text-[10px] text-purple-400 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right shrink-0 ml-2">
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Updated {item.updatedAt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1C2638] flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Active in 7 Agent Workflows</span>
        <span className="text-purple-400">Git Sync: Enabled</span>
      </div>
    </div>
  );
};
