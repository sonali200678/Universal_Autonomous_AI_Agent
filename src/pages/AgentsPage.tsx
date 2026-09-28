import React, { useState } from 'react';
import { WorkflowNodeData, WorkflowConnection, ChatMessage, PromptItem, TokenCostData, EnterpriseUser } from '../types';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { NodeLibrary } from '../components/workflow/NodeLibrary';
import { TestRunPanel } from '../components/workflow/TestRunPanel';
import { EvaluationCard } from '../components/dashboard/EvaluationCard';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import { TokenCostMeter } from '../components/dashboard/TokenCostMeter';
import { PromptLibraryCard } from '../components/dashboard/PromptLibraryCard';
import {
  Save,
  Share2,
  Rocket,
  MoreVertical,
  Play,
  RotateCcw,
  Sparkles,
  GitBranch,
  Sliders,
  CheckCircle,
  FileCode,
  Bug,
  Award,
} from 'lucide-react';

interface AgentsPageProps {
  nodes: WorkflowNodeData[];
  connections: WorkflowConnection[];
  selectedNode: WorkflowNodeData | null;
  onSelectNode: (node: WorkflowNodeData) => void;
  onAddNode: (newNode: Partial<WorkflowNodeData>) => void;
  isRunning: boolean;
  onRunWorkflow: (customQuery?: string) => void;
  onResetWorkflow: () => void;
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  onClearChat: () => void;
  tokenCostData: TokenCostData;
  prompts: PromptItem[];
  onSelectPrompt: (prompt: PromptItem) => void;
  onNewPrompt: () => void;
  onSaveWorkflow: () => void;
  onOpenShareModal: () => void;
  onOpenDeployModal: () => void;
  onShowToast: (title: string, desc?: string) => void;
  onNavigatePage: (page: string) => void;
  currentUser?: EnterpriseUser;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  nodes,
  connections,
  selectedNode,
  onSelectNode,
  onAddNode,
  isRunning,
  onRunWorkflow,
  onResetWorkflow,
  messages,
  onSendMessage,
  onClearChat,
  tokenCostData,
  prompts,
  onSelectPrompt,
  onNewPrompt,
  onSaveWorkflow,
  onOpenShareModal,
  onOpenDeployModal,
  onShowToast,
  onNavigatePage,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'debug' | 'evaluate' | 'versions' | 'settings'>('canvas');
  const [isTestRunOpen, setIsTestRunOpen] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#070B14]">
      {/* Top Toolbar */}
      <div className="h-11 bg-[#090E1A] border-b border-[#1D2939] px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left Segmented Toolbar Tabs */}
        <div className="flex items-center gap-1">
          {[
            { id: 'canvas', label: 'Canvas', icon: <GitBranch className="w-3.5 h-3.5" /> },
            { id: 'debug', label: 'Debug', icon: <Bug className="w-3.5 h-3.5" /> },
            { id: 'evaluate', label: 'Evaluate', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'versions', label: 'Versions', icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'settings', label: 'Settings', icon: <Sliders className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'evaluate') onNavigatePage('evaluations');
                  if (tab.id === 'settings') onNavigatePage('settings');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          {!isTestRunOpen && (
            <button
              onClick={() => setIsTestRunOpen(true)}
              className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 text-purple-300 rounded-md hover:bg-slate-800 transition-colors"
            >
              Show Test Run
            </button>
          )}

          <button
            onClick={onSaveWorkflow}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0D1422] hover:bg-slate-800 border border-[#1D2939] hover:border-slate-600 text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-purple-400" />
            <span>Save</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0D1422] hover:bg-slate-800 border border-[#1D2939] hover:border-slate-600 text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Share</span>
          </button>

          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </button>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#0D1320] border border-[#1D2939] rounded-lg shadow-xl p-1 z-40 text-xs text-slate-300 space-y-0.5 animate-in fade-in duration-100">
                <button
                  onClick={() => {
                    onShowToast('Workflow JSON Exported', 'Downloaded as uamc-i-v2.7.json');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800/60"
                >
                  Export Workflow JSON
                </button>
                <button
                  onClick={() => {
                    onShowToast('Telemetry Synchronized', 'Groundedness and guardrails re-validated');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800/60"
                >
                  Force Sync Telemetry
                </button>
                <button
                  onClick={() => {
                    onResetWorkflow();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800/60 text-rose-400 hover:text-rose-300"
                >
                  Reset Node States
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Orchestration Middle Section: Left Add Nodes | Center Canvas | Right Test Run */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-[500px] border-b border-[#1D2939]">
        {/* Left: Add Nodes Panel */}
        <NodeLibrary onAddNode={onAddNode} onShowToast={onShowToast} />

        {/* Center: Workflow Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
          isRunning={isRunning}
          onRunWorkflow={() => onRunWorkflow()}
          onResetWorkflow={onResetWorkflow}
        />

        {/* Right: Test Run Panel */}
        {isTestRunOpen && (
          <TestRunPanel
            messages={messages}
            onSendMessage={onSendMessage}
            isRunning={isRunning}
            onClearChat={onClearChat}
            onClose={() => setIsTestRunOpen(false)}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Bottom Dashboard Section: 4 Major Cards */}
      <div className="p-4 bg-[#070B14] shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Evaluations (Latest) */}
          <EvaluationCard onOpenFullEvals={() => onNavigatePage('evaluations')} />

          {/* Card 2: Scorecard */}
          <ScoreCard />

          {/* Card 3: Token & Cost Meter (Today) */}
          <TokenCostMeter data={tokenCostData} />

          {/* Card 4: Prompt Library */}
          <PromptLibraryCard
            prompts={prompts}
            onSelectPrompt={onSelectPrompt}
            onNewPrompt={onNewPrompt}
          />
        </div>
      </div>
    </div>
  );
};
