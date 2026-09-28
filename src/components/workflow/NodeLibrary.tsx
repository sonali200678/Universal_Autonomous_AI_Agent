import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Search as SearchIcon, Brain, Wrench, Shield, CheckCircle, ArrowDown } from 'lucide-react';
import { AVAILABLE_LIBRARY_NODES } from '../../data/mockWorkflow';
import { WorkflowNodeData } from '../../types';

interface NodeLibraryProps {
  onAddNode: (newNode: Partial<WorkflowNodeData>) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ onAddNode, onShowToast }) => {
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'retrieval':
        return <SearchIcon className="w-3.5 h-3.5 text-blue-400" />;
      case 'reasoning':
        return <Brain className="w-3.5 h-3.5 text-purple-400" />;
      case 'tools':
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'guardrails':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      case 'response':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Brain className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const filteredCategories = AVAILABLE_LIBRARY_NODES.map((group) => {
    const items = group.items.filter((item) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    });
    return { ...group, items };
  }).filter((group) => group.items.length > 0);

  const handleAdd = (item: any) => {
    const newId = `node_${Date.now()}`;
    const newNode: Partial<WorkflowNodeData> = {
      id: newId,
      name: item.name,
      type: item.type,
      category: item.category,
      description: item.description,
      status: 'idle',
      x: 350 + Math.floor(Math.random() * 80),
      y: 100 + Math.floor(Math.random() * 120),
      metrics: item.defaultMetrics,
      config: {
        model: 'Gemini 2.5 Flash',
        temperature: 0.2,
        promptTemplate: `Standard cognitive step for ${item.name}`,
      },
      logs: [`[${new Date().toLocaleTimeString()}] Node initialized on canvas`],
    };

    onAddNode(newNode);
    onShowToast(`Added '${item.name}' node`, 'Placed onto orchestration canvas');
  };

  return (
    <div className="w-56 lg:w-60 bg-[#0A0F1A] border-r border-[#1D2939] flex flex-col h-full shrink-0 select-none">
      {/* Header & Search */}
      <div className="p-3 border-b border-[#1D2939]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Add Nodes</span>
          <span className="text-[10px] text-slate-500 font-mono">13 available</span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-[#070B14] border border-[#1D2939] rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Categories Accordion */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredCategories.map((group) => {
          const isCollapsed = collapsedCategories[group.category];
          return (
            <div key={group.category} className="rounded-md border border-[#172234] bg-[#0D1422]/60 overflow-hidden">
              <button
                onClick={() => toggleCategory(group.category)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {getCategoryIcon(group.category)}
                  <span>{group.category}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="text-[10px] font-mono">{group.items.length}</span>
                  {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {!isCollapsed && (
                <div className="p-1.5 space-y-1 bg-[#090E18] border-t border-[#172234]">
                  {group.items.map((item) => (
                    <div
                      key={item.type}
                      className="group flex items-start justify-between p-2 rounded hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                      onClick={() => handleAdd(item)}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-slate-200 group-hover:text-purple-300 truncate">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <button
                        title="Add to canvas"
                        className="p-1 rounded bg-[#131C30] group-hover:bg-purple-600 text-slate-400 group-hover:text-white transition-colors shrink-0 mt-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tip footer */}
      <div className="p-2.5 border-t border-[#1D2939] bg-[#070B14] text-[10px] text-slate-500">
        Click <span className="text-purple-400 font-semibold">+</span> to attach node into active pipeline.
      </div>
    </div>
  );
};
