import React, { useState, useEffect, useCallback } from 'react';
import {
  PageId,
  WorkflowNodeData,
  WorkflowConnection,
  ChatMessage,
  PromptItem,
  ToastMessage,
  TokenCostData,
  EnterpriseUser,
  NodeExecutionStatus,
  NodeCategory,
} from './types';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
import { NodeDetailModal } from './components/workflow/NodeDetailModal';
import { DeployModal } from './components/workflow/DeployModal';
import { ShareModal } from './components/workflow/ShareModal';
import { PromptEditorModal } from './components/workflow/PromptEditorModal';

// Pages
import { AgentsPage } from './pages/AgentsPage';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { ToolsPage } from './pages/ToolsPage';
import { RAGPage } from './pages/RAGPage';
import { GuardrailsPage } from './pages/GuardrailsPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FinOpsPage } from './pages/FinOpsPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { SettingsPage } from './pages/SettingsPage';

// Mock Data, Security Engine & Simulation
import {
  INITIAL_WORKFLOW_NODES,
  INITIAL_WORKFLOW_CONNECTIONS,
} from './data/mockWorkflow';
import { MOCK_PROMPTS } from './data/mockPrompts';
import { INITIAL_TOKEN_COST } from './data/mockMetrics';
import { simulateAgentResponse } from './services/mockAI';
import { BackendSecurityEngine } from './services/securityEngine';

export default function App() {
  // Navigation State - Agents is default page as required
  const [currentPage, setCurrentPage] = useState<PageId>('agents');

  // Authenticated Security Persona State
  const [currentUser, setCurrentUser] = useState<EnterpriseUser>(
    BackendSecurityEngine.getCurrentUser()
  );

  // Workflow Graph State
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(INITIAL_WORKFLOW_NODES);
  const [connections, setConnections] = useState<WorkflowConnection[]>(INITIAL_WORKFLOW_CONNECTIONS);
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeData | null>(null);

  // Workflow Execution State
  const [isRunning, setIsRunning] = useState(false);

  // Chat State with required initial conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-initial-1',
      sender: 'user',
      content: 'What are the main customer service KPIs for Q2 2026?',
      timestamp: '08:14 AM',
    },
    {
      id: 'msg-initial-2',
      sender: 'assistant',
      content: `Here are the key customer service KPIs for Q2 2026:

• Total sessions: 18.4K per day
• Deflection rate: 64%
• Customer Satisfaction: 4.7 / 5
• Cost per session: $0.21
• Response time: 2.1 seconds

The system retrieved the relevant enterprise analytics data and validated the response before returning the result.`,
      timestamp: '08:14 AM',
      tokensUsed: 980,
      costEstimate: '$0.0021',
      latencySeconds: 1.4,
      citations: ['CS-TELEMETRY-Q2-2026', 'ZENDESK-AGGREGATE-STATS'],
      isDemo: true,
    },
  ]);

  // Token & Cost Meter State
  const [tokenCostData, setTokenCostData] = useState<TokenCostData>(INITIAL_TOKEN_COST);

  // Prompt Library State
  const [prompts, setPrompts] = useState<PromptItem[]>(MOCK_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  // Modals & Drawers State
  const [isNodeDetailOpen, setIsNodeDetailOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: 'success' | 'info' | 'warning' | 'error' = 'success'
    ) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSwitchUser = useCallback((newUser: EnterpriseUser) => {
    BackendSecurityEngine.setCurrentUser(newUser);
    setCurrentUser(newUser);
  }, []);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Workflow Execution Engine: step-by-step node execution animation with security engine
  const runWorkflowSimulation = useCallback(
    (
      queryToRun: string = 'Analyze our procurement vendors and identify the top 5 vendors by purchase amount.'
    ) => {
      if (isRunning) return;
      setIsRunning(true);

      // 1. Add User Message
      const userMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        content: queryToRun,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);

      // 2. Set all nodes to idle
      setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

      // Simulation sequence with active user security context
      const simulation = simulateAgentResponse(queryToRun, currentUser);
      const sequence = simulation.nodeSequence;
      let step = 0;

      const interval = setInterval(() => {
        if (step < sequence.length) {
          const currentNodeId = sequence[step];
          setNodes((prev) =>
            prev.map((n) => {
              if (n.id === currentNodeId) {
                return { ...n, status: 'running' };
              }
              if (sequence.indexOf(n.id) < step && sequence.indexOf(n.id) !== -1) {
                return { ...n, status: 'success' };
              }
              return n;
            })
          );
          step++;
        } else {
          clearInterval(interval);
          // Set all nodes in sequence to success
          setNodes((prev) =>
            prev.map((n) => (sequence.includes(n.id) ? { ...n, status: 'success' } : n))
          );

          // Append simulated assistant response
          setMessages((prev) => [...prev, simulation.message]);

          // Update Token and Cost Meter
          setTokenCostData((prev) => {
            const addedTokensMillion = +(simulation.tokensConsumed / 1_000_000).toFixed(4);
            const addedCost = +(simulation.costIncurred).toFixed(4);
            return {
              ...prev,
              tokensUsedMillion: +(prev.tokensUsedMillion + addedTokensMillion).toFixed(3),
              outputTokensMillion: +(prev.outputTokensMillion + addedTokensMillion).toFixed(3),
              costTotal: +(prev.costTotal + addedCost).toFixed(2),
              modelCost: +(prev.modelCost + addedCost).toFixed(2),
            };
          });

          setIsRunning(false);

          if (simulation.message.content.includes('403 FORBIDDEN')) {
            showToast('Access Intercepted', '403 Forbidden: Blocked by Backend RBAC Gate', 'error');
          } else if (simulation.message.content.includes('HIGH-RISK ACTION GATED')) {
            showToast('Approval Ticket Created', 'Action requires Manager Sign-Off', 'warning');
          } else {
            showToast('Workflow Execution Complete', 'All cognitive nodes executed with verified safety', 'success');
          }
        }
      }, 350);
    },
    [isRunning, showToast, currentUser]
  );

  const handleResetWorkflow = useCallback(() => {
    setIsRunning(false);
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));
    showToast('Workflow Reset', 'All nodes reverted to idle state');
  }, [showToast]);

  const handleUpdateNode = useCallback(
    (updated: WorkflowNodeData) => {
      setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setSelectedNode(updated);
      showToast('Node Updated', `Saved parameters for ${updated.name}`);
    },
    [showToast]
  );

  const handleDuplicateNode = useCallback(
    (node: WorkflowNodeData) => {
      const newNode: WorkflowNodeData = {
        ...node,
        id: `${node.id}_copy_${Date.now().toString(36)}`,
        name: `${node.name} (Copy)`,
        x: node.x + 30,
        y: node.y + 30,
        status: 'idle',
      };
      setNodes((prev) => [...prev, newNode]);
      setSelectedNode(newNode);
      showToast('Node Duplicated', `Created copy of ${node.name}`);
    },
    [showToast]
  );

  const handleToggleDisableNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === nodeId) {
            const nextStatus: NodeExecutionStatus = n.status === 'disabled' ? 'idle' : 'disabled';
            return { ...n, status: nextStatus };
          }
          return n;
        })
      );
    },
    []
  );

  const handleAddNode = useCallback(
    (newNodeData: Partial<WorkflowNodeData>) => {
      const id = `custom_${Date.now().toString(36)}`;
      const newNode: WorkflowNodeData = {
        id,
        name: newNodeData.name || 'Custom Node',
        type: newNodeData.type || 'Custom',
        category: (newNodeData.category as NodeCategory) || 'REASONING',
        status: 'idle',
        x: 450 + (nodes.length % 3) * 50,
        y: 200 + (nodes.length % 4) * 40,
        metrics: {
          latency: '120ms',
          tokens: 200,
        },
        description: newNodeData.description || 'Configured node for multi-agent reasoning',
        ...newNodeData,
      };

      setNodes((prev) => [...prev, newNode]);
      setSelectedNode(newNode);
      showToast('Node Added', `Added ${newNode.name} to workspace`);
    },
    [nodes.length, showToast]
  );

  return (
    <AppShell
      currentPage={currentPage}
      currentUser={currentUser}
      onSwitchUser={handleSwitchUser}
      onNavigate={(page) => setCurrentPage(page)}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      onOpenSettingsModal={() => setCurrentPage('settings')}
      isMobileSidebarOpen={isMobileSidebarOpen}
      onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
      onShowToast={showToast}
    >
      {/* View routing */}
      {currentPage === 'agents' && (
        <AgentsPage
          nodes={nodes}
          connections={connections}
          selectedNode={selectedNode}
          onSelectNode={(node) => {
            setSelectedNode(node);
            setIsNodeDetailOpen(true);
          }}
          onAddNode={handleAddNode}
          isRunning={isRunning}
          onRunWorkflow={runWorkflowSimulation}
          onResetWorkflow={handleResetWorkflow}
          messages={messages}
          onSendMessage={(query) => runWorkflowSimulation(query)}
          onClearChat={() => {
            setMessages([]);
            showToast('Chat Cleared');
          }}
          tokenCostData={tokenCostData}
          prompts={prompts}
          onSelectPrompt={(prompt) => {
            setSelectedPrompt(prompt);
            setIsPromptEditorOpen(true);
          }}
          onNewPrompt={() => {
            setSelectedPrompt(null);
            setIsPromptEditorOpen(true);
          }}
          onSaveWorkflow={() => {
            showToast('Workflow Saved', 'Workflow v2.7 persisted to cloud registry');
          }}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
          onShowToast={showToast}
          onNavigatePage={(p) => setCurrentPage(p as PageId)}
          currentUser={currentUser}
        />
      )}

      {currentPage === 'home' && <HomePage onNavigate={(p) => setCurrentPage(p)} />}

      {currentPage === 'chat' && (
        <ChatPage
          messages={messages}
          onSendMessage={(q) => runWorkflowSimulation(q)}
          isRunning={isRunning}
          onClearChat={() => {
            setMessages([]);
            showToast('Chat Cleared');
          }}
          currentUser={currentUser}
        />
      )}

      {currentPage === 'tools' && <ToolsPage onShowToast={showToast} />}

      {currentPage === 'rag' && <RAGPage currentUser={currentUser} onShowToast={showToast} />}

      {currentPage === 'guardrails' && (
        <GuardrailsPage currentUser={currentUser} onShowToast={showToast} />
      )}

      {currentPage === 'evaluations' && <EvaluationsPage onShowToast={showToast} />}

      {currentPage === 'datasets' && (
        <DatasetsPage currentUser={currentUser} onShowToast={showToast} />
      )}

      {currentPage === 'analytics' && <AnalyticsPage />}

      {currentPage === 'finops' && <FinOpsPage />}

      {currentPage === 'monitoring' && (
        <MonitoringPage currentUser={currentUser} onShowToast={showToast} />
      )}

      {currentPage === 'settings' && <SettingsPage onShowToast={showToast} />}

      {/* Reusable Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page) => setCurrentPage(page)}
        onSelectSearchItem={(type, id, name) => {
          showToast(`Selected ${type}`, name);
        }}
      />

      {/* Node Detail / Inspector Modal */}
      <NodeDetailModal
        node={selectedNode}
        isOpen={isNodeDetailOpen}
        onClose={() => setIsNodeDetailOpen(false)}
        onUpdateNode={handleUpdateNode}
        onDuplicateNode={handleDuplicateNode}
        onToggleDisableNode={handleToggleDisableNode}
        onShowToast={showToast}
      />

      {/* Deploy Confirmation Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onConfirmDeploy={(env, ver, canary) => {
          showToast(
            'Deployment Succeeded',
            `Deployed ${ver} to ${env} with ${canary}% traffic allocation`
          );
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Prompt Editor Modal */}
      <PromptEditorModal
        prompt={selectedPrompt}
        isOpen={isPromptEditorOpen}
        onClose={() => setIsPromptEditorOpen(false)}
        onShowToast={showToast}
        onSavePrompt={(saved) => {
          setPrompts((prev) => {
            const exists = prev.some((p) => p.id === saved.id);
            if (exists) {
              return prev.map((p) => (p.id === saved.id ? saved : p));
            }
            return [saved, ...prev];
          });
          showToast('Prompt Saved', `Updated prompt template: ${saved.title}`);
        }}
      />
    </AppShell>
  );
}
