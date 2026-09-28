export type PageId =
  | 'home'
  | 'chat'
  | 'agents'
  | 'tools'
  | 'rag'
  | 'guardrails'
  | 'evaluations'
  | 'datasets'
  | 'analytics'
  | 'finops'
  | 'monitoring'
  | 'settings';

export type NodeCategory =
  | 'INPUT'
  | 'RETRIEVAL'
  | 'REASONING'
  | 'TOOLS'
  | 'GUARDRAILS'
  | 'RESPONSE';

export type NodeExecutionStatus = 'idle' | 'running' | 'success' | 'warning' | 'error' | 'disabled';

export interface WorkflowNodeData {
  id: string;
  name: string;
  category: NodeCategory;
  type: string;
  description: string;
  status: NodeExecutionStatus;
  x: number;
  y: number;
  metrics?: {
    latency?: string;
    tokens?: number;
    score?: number;
    topK?: number;
    statusText?: string;
  };
  config?: {
    model?: string;
    temperature?: number;
    promptTemplate?: string;
    systemInstructions?: string;
    maxTokens?: number;
    toolsEnabled?: string[];
  };
  logs?: string[];
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  traceSteps?: {
    nodeId: string;
    nodeName: string;
    status: 'running' | 'success' | 'error';
    durationMs?: number;
    detail?: string;
  }[];
  tokensUsed?: number;
  costEstimate?: string;
  latencySeconds?: number;
  citations?: string[];
  isDemo?: boolean;
}

export interface PromptItem {
  id: string;
  title: string;
  tags: string[];
  version: string;
  updatedAt: string;
  category: string;
  template: string;
  systemPrompt: string;
  temperature: number;
  author: string;
}

export interface AgentItem {
  id: string;
  name: string;
  role: string;
  purpose: string;
  model: string;
  status: 'Active' | 'Paused' | 'Degraded' | 'Offline';
  tools: string[];
  tasksCompleted: number;
  successRate?: number;
  avgLatency?: string;
  lastActive?: string;
  description?: string;
  accuracyScore?: number;
  latencyMs?: number;
  avatarBg?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'Database' | 'Search' | 'Computation' | 'Integration' | 'Communication' | 'API' | 'Validation';
  status: 'Operational' | 'Healthy' | 'Degraded' | 'Offline';
  invocationsToday?: number;
  avgLatencyMs?: number;
  latencyMs?: number;
  callsToday?: number;
  errorRate?: number;
  authType?: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; desc: string }[];
}

export interface DatasetItem {
  id: string;
  name: string;
  domain?: string;
  category?: string;
  recordsCount: number;
  size: string;
  lastSync?: string;
  lastUpdated?: string;
  status?: string;
  format?: string;
  schema: { column: string; type: string; description: string }[];
  sampleRows: Record<string, any>[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface EvaluationMetric {
  subject: string;
  value: number;
  benchmark: number;
  fullMark: number;
}

export interface TokenCostData {
  tokensUsedMillion: number;
  tokensTotalMillion: number;
  inputTokensMillion: number;
  outputTokensMillion: number;
  costTotal: number;
  costBudget: number;
  modelCost: number;
  toolCost: number;
}

// ==========================================
// ENTERPRISE AUTH & RBAC TYPES
// ==========================================

export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'MANAGER'
  | 'PROCUREMENT_ANALYST'
  | 'FINANCE_ANALYST'
  | 'HR_ANALYST'
  | 'EMPLOYEE'
  | 'AUDITOR';

export type Department =
  | 'Procurement'
  | 'Finance'
  | 'HR'
  | 'Engineering'
  | 'Compliance'
  | 'Executive';

export type Region = 'US-East' | 'EU-Central' | 'AP-South' | 'Global';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  region: Region;
  permissions: string[];
  avatar: string;
}

export interface AgentManifest {
  agentId: string;
  name: string;
  permittedResources: string[];
  permittedTools: string[];
  deniedResources: string[];
  description: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'AUTH_LOGIN'
    | 'AUTHZ_EVALUATION'
    | 'DB_QUERY'
    | 'RAG_RETRIEVAL'
    | 'TOOL_EXECUTION'
    | 'APPROVAL_REQUEST'
    | 'APPROVAL_DECISION'
    | 'APPROVAL_DISPATCHED'
    | 'ACCESS_DENIED';
  actor: {
    id: string;
    name: string;
    role: UserRole;
    department: Department;
    region: Region;
  };
  targetAgent?: string;
  resource: string;
  action: string;
  verdict: 'ALLOWED' | 'DENIED' | 'PENDING_APPROVAL';
  reason: string;
  payloadSummary?: string;
  hash: string;
  previousHash: string;
}

export interface ApprovalRequest {
  id: string;
  createdAt: string;
  timestamp?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  targetAgent?: string;
  requestedBy: {
    id: string;
    name: string;
    role: UserRole;
    department: Department;
    region: Region;
  };
  actionType: string;
  resource: string;
  title: string;
  details: Record<string, string | number>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: {
    id: string;
    name: string;
    role: UserRole;
  };
  reviewedAt?: string;
  comments?: string;
}

export interface RAGChunk {
  id: string;
  docTitle: string;
  source: string;
  department: Department;
  region: Region;
  classification: DataClassification;
  allowedRoles: UserRole[];
  content: string;
  similarity?: number;
}

export interface SecurePurchaseOrder {
  id: string;
  vendor_name: string;
  po_number: string;
  category: string;
  amount_inr_lakhs: number;
  currency: string;
  order_date: string;
  buyer_name: string;
  department: Department;
  region: Region;
  compliance_status: string;
  classification: DataClassification;
}

export interface SecureEmployeeRecord {
  id: string;
  employee_id: string;
  full_name: string;
  department: Department;
  title: string;
  region: Region;
  annual_salary_inr_lakhs: number;
  bonus_pct: number;
  performance_rating: string;
  classification: DataClassification;
}

export interface SecureFinanceLedger {
  id: string;
  quarter: string;
  cost_center: string;
  allocated_budget_usd: number;
  actual_spend_usd: number;
  variance_pct: number;
  department: Department;
  region: Region;
  classification: DataClassification;
}
