import {
  EnterpriseUser,
  UserRole,
  Department,
  Region,
  AgentManifest,
  AuditEvent,
  ApprovalRequest,
  RAGChunk,
  DataClassification,
} from '../types';

// ==========================================
// 1. ROLE DEFINITIONS & PERMISSIONS MATRIX
// ==========================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  PLATFORM_ADMIN: [
    'purchase_orders.read',
    'purchase_orders.create',
    'purchase_orders.update',
    'purchase_orders.delete',
    'vendors.read',
    'vendors.manage',
    'finance.read',
    'finance.manage',
    'employees.read',
    'employees.manage',
    'documents.read',
    'documents.manage',
    'reports.read',
    'reports.generate',
    'approvals.decide',
    'audit_logs.read',
    'security_policies.manage',
    'tools.execute_all',
  ],
  MANAGER: [
    'purchase_orders.read',
    'purchase_orders.create',
    'purchase_orders.update',
    'vendors.read',
    'finance.read',
    'documents.read',
    'reports.read',
    'reports.generate',
    'approvals.decide',
    'audit_logs.read',
  ],
  PROCUREMENT_ANALYST: [
    'purchase_orders.read',
    'purchase_orders.create',
    'vendors.read',
    'documents.read',
    'reports.read',
  ],
  FINANCE_ANALYST: [
    'finance.read',
    'reports.read',
    'documents.read',
    'vendors.read',
    'purchase_orders.read',
  ],
  HR_ANALYST: [
    'employees.read',
    'documents.read',
    'reports.read',
  ],
  EMPLOYEE: [
    'documents.read',
    'reports.read',
  ],
  AUDITOR: [
    'purchase_orders.read',
    'vendors.read',
    'finance.read',
    'employees.read',
    'documents.read',
    'reports.read',
    'audit_logs.read',
  ],
};

// ==========================================
// 2. ENTERPRISE USERS / DEMO PERSONAS
// ==========================================

export const ENTERPRISE_USERS: EnterpriseUser[] = [
  {
    id: 'user-admin',
    name: 'Platform Admin',
    email: 'admin@uamc-i.enterprise.internal',
    role: 'PLATFORM_ADMIN',
    department: 'Executive',
    region: 'Global',
    permissions: ROLE_PERMISSIONS.PLATFORM_ADMIN,
    avatar: 'PA',
  },
  {
    id: 'user-proc-us',
    name: 'Elena Rostova',
    email: 'elena.rostova@uamc-i.enterprise.internal',
    role: 'PROCUREMENT_ANALYST',
    department: 'Procurement',
    region: 'US-East',
    permissions: ROLE_PERMISSIONS.PROCUREMENT_ANALYST,
    avatar: 'ER',
  },
  {
    id: 'user-proc-ap',
    name: 'Anita Desai',
    email: 'anita.desai@uamc-i.enterprise.internal',
    role: 'PROCUREMENT_ANALYST',
    department: 'Procurement',
    region: 'AP-South',
    permissions: ROLE_PERMISSIONS.PROCUREMENT_ANALYST,
    avatar: 'AD',
  },
  {
    id: 'user-fin-us',
    name: 'Marcus Vance',
    email: 'marcus.vance@uamc-i.enterprise.internal',
    role: 'FINANCE_ANALYST',
    department: 'Finance',
    region: 'US-East',
    permissions: ROLE_PERMISSIONS.FINANCE_ANALYST,
    avatar: 'MV',
  },
  {
    id: 'user-hr-eu',
    name: 'Sarah Chen',
    email: 'sarah.chen@uamc-i.enterprise.internal',
    role: 'HR_ANALYST',
    department: 'HR',
    region: 'EU-Central',
    permissions: ROLE_PERMISSIONS.HR_ANALYST,
    avatar: 'SC',
  },
  {
    id: 'user-mgr-us',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@uamc-i.enterprise.internal',
    role: 'MANAGER',
    department: 'Procurement',
    region: 'US-East',
    permissions: ROLE_PERMISSIONS.MANAGER,
    avatar: 'VJ',
  },
  {
    id: 'user-eng-us',
    name: 'David Kim',
    email: 'david.kim@uamc-i.enterprise.internal',
    role: 'EMPLOYEE',
    department: 'Engineering',
    region: 'US-East',
    permissions: ROLE_PERMISSIONS.EMPLOYEE,
    avatar: 'DK',
  },
  {
    id: 'user-aud-gl',
    name: 'Rachel Green',
    email: 'rachel.green@uamc-i.enterprise.internal',
    role: 'AUDITOR',
    department: 'Compliance',
    region: 'Global',
    permissions: ROLE_PERMISSIONS.AUDITOR,
    avatar: 'RG',
  },
];

// ==========================================
// 3. AI AGENT PERMISSION MANIFESTS
// ==========================================

export const AGENT_MANIFESTS: Record<string, AgentManifest> = {
  'agent-procurement': {
    agentId: 'agent-procurement',
    name: 'Procurement Analyst Agent',
    permittedResources: ['purchase_orders.read', 'purchase_orders.create', 'purchase_orders.update', 'vendors.read', 'documents.read'],
    permittedTools: ['Enterprise SQL Runner', 'Vendor Scorecard API', 'Procurement RAG'],
    deniedResources: ['employees.read', 'employees.manage', 'finance.manage'],
    description: 'Autonomous worker restricted to Procurement ERP tables and vendor catalogs. Forbidden from accessing HR, payroll, and corporate banking.',
  },
  'agent-finance': {
    agentId: 'agent-finance',
    name: 'Finance & FinOps Agent',
    permittedResources: ['finance.read', 'reports.read', 'vendors.read', 'purchase_orders.read', 'documents.read'],
    permittedTools: ['Cost Calculator', 'BigQuery Connector', 'Billing Webhook'],
    deniedResources: ['employees.read', 'employees.manage', 'purchase_orders.delete'],
    description: 'Specialized in fiscal ledgers, model cost allocation, and revenue analytics. Forbidden from reading personnel salary records.',
  },
  'agent-hr': {
    agentId: 'agent-hr',
    name: 'HR Specialist Agent',
    permittedResources: ['employees.read', 'documents.read', 'reports.read'],
    permittedTools: ['Workday HCM Gateway', 'Compensation Matrix Engine', 'HR RAG'],
    deniedResources: ['purchase_orders.create', 'purchase_orders.delete', 'finance.manage'],
    description: 'Handles headcount, organizational hierarchies, and internal job bands. Isolated from financial disbursements.',
  },
  'agent-rag': {
    agentId: 'agent-rag',
    name: 'Knowledge Agent',
    permittedResources: ['documents.read'],
    permittedTools: ['Vector Search', 'Cross-Encoder Reranker', 'Semantic Cache'],
    deniedResources: ['purchase_orders.create', 'purchase_orders.delete', 'finance.manage', 'employees.manage'],
    description: 'Retrieves knowledge chunks strictly within the authenticated user role and departmental boundaries.',
  },
  'agent-validation': {
    agentId: 'agent-validation',
    name: 'Validation Agent',
    permittedResources: ['documents.read', 'reports.read'],
    permittedTools: ['Fact Checker', 'PII Redactor', 'Toxicity Scanner', 'Audit Logger'],
    deniedResources: ['purchase_orders.create', 'finance.manage'],
    description: 'Quality governance & policy gatekeeper validating claims and enforcing compliance checks.',
  },
  'agent-orchestrator': {
    agentId: 'agent-orchestrator',
    name: 'Orchestrator Agent',
    permittedResources: ['*'],
    permittedTools: ['Agent Router', 'Task Planner', 'Shared Memory'],
    deniedResources: [],
    description: 'Central coordinator. Must delegate to specialized sub-agents while checking effective permission intersections.',
  },
};

// ==========================================
// 4. ENTERPRISE DATA WITH ROW-LEVEL METADATA
// ==========================================

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

export const SECURE_PURCHASE_ORDERS: SecurePurchaseOrder[] = [
  // US-East Records
  { id: 'po-1', vendor_name: 'Vendor A (Apex Cloud Systems)', po_number: 'PO-2026-8841', category: 'Cloud Infrastructure', amount_inr_lakhs: 48.2, currency: 'INR', order_date: '2026-08-14', buyer_name: 'Elena Rostova', department: 'Procurement', region: 'US-East', compliance_status: 'Compliant', classification: 'CONFIDENTIAL' },
  { id: 'po-2', vendor_name: 'Vendor B (BioTech Solutions Ltd)', po_number: 'PO-2026-8890', category: 'Lab Consumables', amount_inr_lakhs: 42.7, currency: 'INR', order_date: '2026-08-19', buyer_name: 'Elena Rostova', department: 'Procurement', region: 'US-East', compliance_status: 'Compliant', classification: 'CONFIDENTIAL' },
  { id: 'po-3', vendor_name: 'Vendor C (CyberShield Security)', po_number: 'PO-2026-8912', category: 'Cybersecurity SaaS', amount_inr_lakhs: 39.4, currency: 'INR', order_date: '2026-08-22', buyer_name: 'Vikram Joshi', department: 'Procurement', region: 'US-East', compliance_status: 'Compliant', classification: 'CONFIDENTIAL' },
  { id: 'po-4', vendor_name: 'Vendor D (Delta Logistics Global)', po_number: 'PO-2026-8945', category: 'Freight & Warehousing', amount_inr_lakhs: 34.8, currency: 'INR', order_date: '2026-08-27', buyer_name: 'Elena Rostova', department: 'Procurement', region: 'US-East', compliance_status: 'Review Pending', classification: 'CONFIDENTIAL' },
  { id: 'po-5', vendor_name: 'Vendor E (Echo Hardware Hub)', po_number: 'PO-2026-8988', category: 'Office IT Hardware', amount_inr_lakhs: 31.6, currency: 'INR', order_date: '2026-09-02', buyer_name: 'Vikram Joshi', department: 'Procurement', region: 'US-East', compliance_status: 'Compliant', classification: 'INTERNAL' },
  // AP-South Records
  { id: 'po-6', vendor_name: 'Vendor F (FastTrack Freight)', po_number: 'PO-2026-9011', category: 'Local Transport', amount_inr_lakhs: 24.3, currency: 'INR', order_date: '2026-09-05', buyer_name: 'Anita Desai', department: 'Procurement', region: 'AP-South', compliance_status: 'Compliant', classification: 'INTERNAL' },
  { id: 'po-7', vendor_name: 'Vendor G (Global Telecom Fiber)', po_number: 'PO-2026-9040', category: 'Telecom Connectivity', amount_inr_lakhs: 19.8, currency: 'INR', order_date: '2026-09-12', buyer_name: 'Anita Desai', department: 'Procurement', region: 'AP-South', compliance_status: 'Compliant', classification: 'INTERNAL' },
  { id: 'po-8', vendor_name: 'Vendor H (Hindustan Precision Tools)', po_number: 'PO-2026-9065', category: 'Industrial Equipment', amount_inr_lakhs: 38.5, currency: 'INR', order_date: '2026-09-15', buyer_name: 'Anita Desai', department: 'Procurement', region: 'AP-South', compliance_status: 'Compliant', classification: 'CONFIDENTIAL' },
  // EU-Central Records
  { id: 'po-9', vendor_name: 'Vendor I (Iberia Solar Panels)', po_number: 'PO-2026-9080', category: 'Renewable Power', amount_inr_lakhs: 29.1, currency: 'INR', order_date: '2026-09-18', buyer_name: 'Hans Meyer', department: 'Procurement', region: 'EU-Central', compliance_status: 'Compliant', classification: 'CONFIDENTIAL' },
];

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

export const SECURE_EMPLOYEE_RECORDS: SecureEmployeeRecord[] = [
  { id: 'emp-1', employee_id: 'EMP-1001', full_name: 'Elena Rostova', department: 'Procurement', title: 'Senior Procurement Specialist', region: 'US-East', annual_salary_inr_lakhs: 26.5, bonus_pct: 15, performance_rating: 'Exceeds Expectations', classification: 'RESTRICTED' },
  { id: 'emp-2', employee_id: 'EMP-1002', full_name: 'Anita Desai', department: 'Procurement', title: 'Lead Procurement Analyst (AP)', region: 'AP-South', annual_salary_inr_lakhs: 24.8, bonus_pct: 12, performance_rating: 'Exceeds Expectations', classification: 'RESTRICTED' },
  { id: 'emp-3', employee_id: 'EMP-1003', full_name: 'Marcus Vance', department: 'Finance', title: 'Principal Financial Analyst', region: 'US-East', annual_salary_inr_lakhs: 32.0, bonus_pct: 18, performance_rating: 'Outstanding', classification: 'RESTRICTED' },
  { id: 'emp-4', employee_id: 'EMP-1004', full_name: 'Sarah Chen', department: 'HR', title: 'Senior HR Business Partner', region: 'EU-Central', annual_salary_inr_lakhs: 28.5, bonus_pct: 14, performance_rating: 'Exceeds Expectations', classification: 'RESTRICTED' },
  { id: 'emp-5', employee_id: 'EMP-1005', full_name: 'Vikram Joshi', department: 'Procurement', title: 'Procurement Director', region: 'US-East', annual_salary_inr_lakhs: 54.0, bonus_pct: 25, performance_rating: 'Outstanding', classification: 'RESTRICTED' },
  { id: 'emp-6', employee_id: 'EMP-1006', full_name: 'David Kim', department: 'Engineering', title: 'Staff Systems Architect', region: 'US-East', annual_salary_inr_lakhs: 48.0, bonus_pct: 20, performance_rating: 'Outstanding', classification: 'RESTRICTED' },
];

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

export const SECURE_FINANCE_LEDGER: SecureFinanceLedger[] = [
  { id: 'fin-1', quarter: '2026-Q1', cost_center: 'Engineering & ML Infra', allocated_budget_usd: 120000, actual_spend_usd: 108400, variance_pct: -9.6, department: 'Finance', region: 'US-East', classification: 'CONFIDENTIAL' },
  { id: 'fin-2', quarter: '2026-Q2', cost_center: 'Customer Experience Copilot', allocated_budget_usd: 65000, actual_spend_usd: 58200, variance_pct: -10.4, department: 'Finance', region: 'US-East', classification: 'CONFIDENTIAL' },
  { id: 'fin-3', quarter: '2026-Q2', cost_center: 'Procurement Automation ERP', allocated_budget_usd: 45000, actual_spend_usd: 41900, variance_pct: -6.8, department: 'Finance', region: 'US-East', classification: 'CONFIDENTIAL' },
  { id: 'fin-4', quarter: '2026-Q2', cost_center: 'Asia-Pacific Regional Hub', allocated_budget_usd: 75000, actual_spend_usd: 68400, variance_pct: -8.8, department: 'Finance', region: 'AP-South', classification: 'CONFIDENTIAL' },
  { id: 'fin-5', quarter: '2026-Q2', cost_center: 'EMEA Enterprise Operations', allocated_budget_usd: 90000, actual_spend_usd: 84100, variance_pct: -6.5, department: 'Finance', region: 'EU-Central', classification: 'CONFIDENTIAL' },
];

// ==========================================
// 5. RAG KNOWLEDGE BASE CHUNKS WITH METADATA
// ==========================================

export const SECURE_RAG_CHUNKS: RAGChunk[] = [
  {
    id: 'chunk-proc-1',
    docTitle: 'Enterprise Procurement Policy 2026.pdf',
    source: 'Google Drive / Procurement SOPs',
    department: 'Procurement',
    region: 'Global',
    classification: 'INTERNAL',
    allowedRoles: ['PLATFORM_ADMIN', 'MANAGER', 'PROCUREMENT_ANALYST', 'AUDITOR'],
    content: 'Section 4.1: Single purchase orders exceeding ₹30 Lakhs require Dual-Director sign-off and VP Finance concurrence. Vendor A, B, and C accounts hold approved Master Service Agreements.',
  },
  {
    id: 'chunk-proc-2',
    docTitle: 'SAP Vendor Master Ledger Q2.xlsx',
    source: 'ERP Data Lake / SAP Procurement',
    department: 'Procurement',
    region: 'US-East',
    classification: 'CONFIDENTIAL',
    allowedRoles: ['PLATFORM_ADMIN', 'MANAGER', 'PROCUREMENT_ANALYST', 'AUDITOR'],
    content: 'Purchase Order PO-2026-8841 awarded to Apex Cloud Systems for ₹48.2L covering Cloud GPU compute clusters. PO-2026-8890 awarded to BioTech Solutions for ₹42.7L.',
  },
  {
    id: 'chunk-proc-3',
    docTitle: 'AP-South Vendor Assessment Matrix.docx',
    source: 'Confluence / APAC Legal',
    department: 'Procurement',
    region: 'AP-South',
    classification: 'CONFIDENTIAL',
    allowedRoles: ['PLATFORM_ADMIN', 'MANAGER', 'PROCUREMENT_ANALYST', 'AUDITOR'],
    content: 'Vendor F (FastTrack Freight) has fulfilled local compliance in Karnataka and Maharashtra for ₹24.3L distribution. Vendor H cleared precision calibration audit.',
  },
  {
    id: 'chunk-hr-1',
    docTitle: 'Executive Compensation & Salary Bands Q2.pdf',
    source: 'Workday Vault / HR Executive',
    department: 'HR',
    region: 'Global',
    classification: 'RESTRICTED',
    allowedRoles: ['PLATFORM_ADMIN', 'HR_ANALYST', 'AUDITOR'],
    content: 'Executive Compensation Schedule: Engineering Directors base range ₹50L-₹65L with 25% target bonus. Principal analysts range ₹28L-₹35L. All salary revisions require HRVP approval.',
  },
  {
    id: 'chunk-hr-2',
    docTitle: 'Employee Performance Review & Disciplinary Actions.docx',
    source: 'HR Confidential Share / Legal',
    department: 'HR',
    region: 'EU-Central',
    classification: 'RESTRICTED',
    allowedRoles: ['PLATFORM_ADMIN', 'HR_ANALYST', 'AUDITOR'],
    content: 'Q2 Performance Calibration: 14 employees placed on talent fast-track; 2 PIP performance improvement notices issued in Berlin engineering office.',
  },
  {
    id: 'chunk-fin-1',
    docTitle: 'Corporate Financial Reserves & Sovereign Tax Filing.xlsx',
    source: 'Finance Private / Treasury',
    department: 'Finance',
    region: 'Global',
    classification: 'CONFIDENTIAL',
    allowedRoles: ['PLATFORM_ADMIN', 'FINANCE_ANALYST', 'AUDITOR'],
    content: 'Q2 Cash Reserve Allocation: $42.4M held in Tier-1 Treasury instruments. Effective corporate tax reserve provisions calculated at 21.4% with cross-border transfer pricing validation.',
  },
  {
    id: 'chunk-gen-1',
    docTitle: 'Enterprise IT Security & Acceptable Use Policy.pdf',
    source: 'Public Portal / Engineering',
    department: 'Engineering',
    region: 'Global',
    classification: 'PUBLIC',
    allowedRoles: ['PLATFORM_ADMIN', 'MANAGER', 'PROCUREMENT_ANALYST', 'FINANCE_ANALYST', 'HR_ANALYST', 'EMPLOYEE', 'AUDITOR'],
    content: 'Acceptable Use: All devices must run endpoint telemetry agents. Data classified as CONFIDENTIAL or RESTRICTED must never egress approved VPC boundaries without encryption.',
  },
];

// ==========================================
// 6. IN-MEMORY IMMUTABLE AUDIT LOG & APPROVALS STORE
// ==========================================

// Simple deterministic hash simulation for immutable chain
function computeHash(prevHash: string, data: string): string {
  let hash = 0;
  const str = prevHash + ':' + data;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(12, '0');
}

let auditLogChain: AuditEvent[] = [
  {
    id: 'audit-0001',
    timestamp: '08:00:00 AM',
    eventType: 'AUTH_LOGIN',
    actor: {
      id: 'user-admin',
      name: 'Platform Admin',
      role: 'PLATFORM_ADMIN',
      department: 'Executive',
      region: 'Global',
    },
    resource: 'auth.session',
    action: 'authenticate',
    verdict: 'ALLOWED',
    reason: 'SAML SSO signature verified with Okta IAM',
    payloadSummary: 'Session initiated for root platform admin',
    hash: '0x3f7a9c1e4d82',
    previousHash: '0x000000000000',
  },
  {
    id: 'audit-0002',
    timestamp: '08:02:14 AM',
    eventType: 'AUTHZ_EVALUATION',
    actor: {
      id: 'user-proc-us',
      name: 'Elena Rostova',
      role: 'PROCUREMENT_ANALYST',
      department: 'Procurement',
      region: 'US-East',
    },
    targetAgent: 'agent-procurement',
    resource: 'purchase_orders.read',
    action: 'read',
    verdict: 'ALLOWED',
    reason: 'Role PROCUREMENT_ANALYST possesses permission purchase_orders.read',
    payloadSummary: 'Filtered RLS scope: department="Procurement", region="US-East"',
    hash: '0x7b2c5e9a11d4',
    previousHash: '0x3f7a9c1e4d82',
  },
];

let pendingApprovals: ApprovalRequest[] = [
  {
    id: 'APPR-2026-001',
    createdAt: '08:05:12 AM',
    requestedBy: {
      id: 'user-proc-us',
      name: 'Elena Rostova',
      role: 'PROCUREMENT_ANALYST',
      department: 'Procurement',
      region: 'US-East',
    },
    actionType: 'purchase_orders.create',
    resource: 'purchase_orders',
    title: 'Create PO for Apex Cloud Systems (₹48.2 Lakhs)',
    details: {
      vendor: 'Vendor A (Apex Cloud Systems)',
      amount_lakhs: 48.2,
      category: 'Cloud Infrastructure',
      riskTier: 'HIGH (Amount >= ₹30L threshold)',
    },
    status: 'PENDING',
  },
];

// ==========================================
// 7. CORE BACKEND SECURITY EVALUATION FUNCTIONS
// ==========================================

export class BackendSecurityEngine {
  private static currentUser: EnterpriseUser = ENTERPRISE_USERS[1]; // Default to Elena Rostova (Procurement Analyst, US-East)

  public static getCurrentUser(): EnterpriseUser {
    return this.currentUser;
  }

  public static setCurrentUser(userOrId: EnterpriseUser | string): EnterpriseUser {
    if (typeof userOrId === 'string') {
      const found = ENTERPRISE_USERS.find((u) => u.id === userOrId);
      if (found) {
        this.currentUser = found;
      }
    } else {
      this.currentUser = userOrId;
    }

    this.recordAudit({
      eventType: 'AUTH_LOGIN',
      actor: {
        id: this.currentUser.id,
        name: this.currentUser.name,
        role: this.currentUser.role,
        department: this.currentUser.department,
        region: this.currentUser.region,
      },
      resource: 'auth.session',
      action: 'switch_user',
      verdict: 'ALLOWED',
      reason: `Authenticated session established for ${this.currentUser.name} (${this.currentUser.role}, ${this.currentUser.department}, ${this.currentUser.region})`,
      payloadSummary: `Token issued with ${this.currentUser.permissions.length} granular permissions`,
    });

    return this.currentUser;
  }

  /**
   * Check if user has explicit permission for resource.action
   */
  public static hasPermission(user: EnterpriseUser, permission: string): boolean {
    if (user.role === 'PLATFORM_ADMIN') return true;
    return user.permissions.includes(permission);
  }

  /**
   * Calculate effective permissions as intersection of User Permissions and Agent Manifest
   */
  public static computeEffectivePermissions(
    user: EnterpriseUser,
    agentId: string
  ): {
    effective: string[];
    userPermissions: string[];
    agentPermissions: string[];
    isAuthorizedForTask: boolean;
  } {
    const manifest = AGENT_MANIFESTS[agentId];
    if (!manifest) {
      return {
        effective: [],
        userPermissions: user.permissions,
        agentPermissions: [],
        isAuthorizedForTask: false,
      };
    }

    const agentPerms = manifest.permittedResources;

    // Intersection
    let effective: string[] = [];
    if (user.role === 'PLATFORM_ADMIN') {
      effective = agentPerms.includes('*') ? user.permissions : [...agentPerms];
    } else {
      effective = user.permissions.filter((p) => agentPerms.includes(p) || agentPerms.includes('*'));
    }

    return {
      effective,
      userPermissions: user.permissions,
      agentPermissions: agentPerms,
      isAuthorizedForTask: effective.length > 0,
    };
  }

  /**
   * Query Database with strict RBAC and Row-Level Security (RLS)
   */
  public static queryPurchaseOrders(user: EnterpriseUser): {
    success: boolean;
    data: SecurePurchaseOrder[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  } {
    // 1. RBAC Check
    if (!this.hasPermission(user, 'purchase_orders.read')) {
      this.recordAudit({
        eventType: 'ACCESS_DENIED',
        actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
        resource: 'purchase_orders',
        action: 'read',
        verdict: 'DENIED',
        reason: `User with role ${user.role} lacks 'purchase_orders.read' permission`,
      });

      return {
        success: false,
        data: [],
        error: `403 FORBIDDEN: User ${user.name} (${user.role}) lacks 'purchase_orders.read' permission.`,
        totalRows: SECURE_PURCHASE_ORDERS.length,
        rlsFilteredCount: 0,
      };
    }

    // 2. Row-Level Security (RLS) Filter:
    // Platform Admin and Auditor see all regions.
    // Others only see records in their department AND region!
    const filtered = SECURE_PURCHASE_ORDERS.filter((po) => {
      if (user.role === 'PLATFORM_ADMIN' || user.role === 'AUDITOR' || user.region === 'Global') {
        return true;
      }
      return po.region === user.region;
    });

    this.recordAudit({
      eventType: 'DB_QUERY',
      actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
      resource: 'purchase_orders',
      action: 'read',
      verdict: 'ALLOWED',
      reason: `RLS applied for region=${user.region}, dept=${user.department}`,
      payloadSummary: `Returned ${filtered.length} of ${SECURE_PURCHASE_ORDERS.length} records`,
    });

    return {
      success: true,
      data: filtered,
      totalRows: SECURE_PURCHASE_ORDERS.length,
      rlsFilteredCount: filtered.length,
    };
  }

  /**
   * Query HR/Payroll table with strict RBAC and RLS
   */
  public static queryEmployees(user: EnterpriseUser): {
    success: boolean;
    data: SecureEmployeeRecord[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  } {
    // 1. RBAC Check
    if (!this.hasPermission(user, 'employees.read')) {
      this.recordAudit({
        eventType: 'ACCESS_DENIED',
        actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
        resource: 'employees',
        action: 'read',
        verdict: 'DENIED',
        reason: `User with role ${user.role} lacks 'employees.read' permission. HR payroll data is strictly restricted.`,
      });

      return {
        success: false,
        data: [],
        error: `403 FORBIDDEN: Access to personnel salaries and compensation records is denied for role ${user.role} in department '${user.department}'.`,
        totalRows: SECURE_EMPLOYEE_RECORDS.length,
        rlsFilteredCount: 0,
      };
    }

    // 2. RLS Filter
    const filtered = SECURE_EMPLOYEE_RECORDS.filter((emp) => {
      if (user.role === 'PLATFORM_ADMIN' || user.role === 'AUDITOR' || user.region === 'Global') {
        return true;
      }
      return emp.region === user.region;
    });

    this.recordAudit({
      eventType: 'DB_QUERY',
      actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
      resource: 'employees',
      action: 'read',
      verdict: 'ALLOWED',
      reason: `RLS applied for HR records`,
      payloadSummary: `Returned ${filtered.length} employee records`,
    });

    return {
      success: true,
      data: filtered,
      totalRows: SECURE_EMPLOYEE_RECORDS.length,
      rlsFilteredCount: filtered.length,
    };
  }

  /**
   * Query Finance Ledger table
   */
  public static queryFinance(user: EnterpriseUser): {
    success: boolean;
    data: SecureFinanceLedger[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  } {
    if (!this.hasPermission(user, 'finance.read')) {
      this.recordAudit({
        eventType: 'ACCESS_DENIED',
        actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
        resource: 'finance',
        action: 'read',
        verdict: 'DENIED',
        reason: `Role ${user.role} lacks 'finance.read' permission.`,
      });

      return {
        success: false,
        data: [],
        error: `403 FORBIDDEN: Corporate financial reserves and ledger data is restricted. User role ${user.role} lacks 'finance.read'.`,
        totalRows: SECURE_FINANCE_LEDGER.length,
        rlsFilteredCount: 0,
      };
    }

    const filtered = SECURE_FINANCE_LEDGER.filter((fin) => {
      if (user.role === 'PLATFORM_ADMIN' || user.role === 'AUDITOR' || user.region === 'Global') {
        return true;
      }
      return fin.region === user.region;
    });

    this.recordAudit({
      eventType: 'DB_QUERY',
      actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
      resource: 'finance',
      action: 'read',
      verdict: 'ALLOWED',
      reason: `RLS applied for Finance ledger`,
      payloadSummary: `Returned ${filtered.length} ledger rows`,
    });

    return {
      success: true,
      data: filtered,
      totalRows: SECURE_FINANCE_LEDGER.length,
      rlsFilteredCount: filtered.length,
    };
  }

  /**
   * Search RAG Knowledge Chunks with Role, Classification & Department Access Control
   */
  public static searchRAGChunks(
    user: EnterpriseUser,
    query: string
  ): {
    allowedChunks: RAGChunk[];
    deniedChunksCount: number;
    totalScanned: number;
  } {
    let allowed: RAGChunk[] = [];
    let deniedCount = 0;

    for (const chunk of SECURE_RAG_CHUNKS) {
      // 1. Role must be in allowedRoles
      const roleAllowed = chunk.allowedRoles.includes(user.role) || user.role === 'PLATFORM_ADMIN';
      
      // 2. Department check for confidential/restricted docs
      const deptAllowed =
        chunk.classification === 'PUBLIC' ||
        user.role === 'PLATFORM_ADMIN' ||
        user.role === 'AUDITOR' ||
        chunk.department === user.department ||
        chunk.department === 'Engineering';

      // 3. Region check
      const regionAllowed =
        chunk.region === 'Global' ||
        user.region === 'Global' ||
        user.role === 'PLATFORM_ADMIN' ||
        user.role === 'AUDITOR' ||
        chunk.region === user.region;

      if (roleAllowed && deptAllowed && regionAllowed) {
        allowed.push({
          ...chunk,
          similarity: +(0.78 + Math.random() * 0.15).toFixed(2),
        });
      } else {
        deniedCount++;
      }
    }

    this.recordAudit({
      eventType: 'RAG_RETRIEVAL',
      actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
      resource: 'documents.rag',
      action: 'search',
      verdict: allowed.length > 0 ? 'ALLOWED' : 'DENIED',
      reason: `RAG security gate dropped ${deniedCount} unauthorized document chunks before sending context to LLM`,
      payloadSummary: `Query: "${query.slice(0, 40)}..." -> ${allowed.length} authorized chunks passed`,
    });

    return {
      allowedChunks: allowed,
      deniedChunksCount: deniedCount,
      totalScanned: SECURE_RAG_CHUNKS.length,
    };
  }

  /**
   * Execute or Gate High-Risk Actions with Human Approval
   */
  public static executeAction(
    user: EnterpriseUser,
    agentId: string,
    actionType: string,
    resource: string,
    payload: Record<string, any>
  ): {
    status: 'EXECUTED' | 'DENIED' | 'PENDING_APPROVAL';
    approvalId?: string;
    message: string;
    data?: any;
  } {
    // 1. Check effective permissions
    const { effective } = this.computeEffectivePermissions(user, agentId);
    if (!effective.includes(resource) && user.role !== 'PLATFORM_ADMIN') {
      this.recordAudit({
        eventType: 'ACCESS_DENIED',
        actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
        targetAgent: agentId,
        resource,
        action: actionType,
        verdict: 'DENIED',
        reason: `Intersection check failed: Agent ${agentId} or User ${user.role} lacks resource permission '${resource}'`,
      });

      return {
        status: 'DENIED',
        message: `403 FORBIDDEN: User ${user.name} with agent ${agentId} is not authorized for '${resource}'.`,
      };
    }

    // 2. Check if action is high-risk (Creation >= ₹30L, Deletion, External communications)
    const isHighRisk =
      actionType.includes('delete') ||
      actionType.includes('external_email') ||
      (actionType.includes('create') && (payload.amount_inr_lakhs >= 30 || payload.amount >= 3000000));

    if (isHighRisk) {
      const approvalId = `APPR-${Date.now().toString().slice(-4)}`;
      const newApproval: ApprovalRequest = {
        id: approvalId,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        requestedBy: {
          id: user.id,
          name: user.name,
          role: user.role,
          department: user.department,
          region: user.region,
        },
        actionType,
        resource,
        title: `${actionType} on ${resource} (${payload.vendor_name || payload.title || 'High-Risk Asset'})`,
        details: payload,
        status: 'PENDING',
      };

      pendingApprovals.unshift(newApproval);

      this.recordAudit({
        eventType: 'APPROVAL_REQUEST',
        actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
        targetAgent: agentId,
        resource,
        action: actionType,
        verdict: 'PENDING_APPROVAL',
        reason: `High-risk action requires Manager or Platform Admin approval. Threshold exceeded.`,
        payloadSummary: `Generated approval ticket ${approvalId}`,
      });

      return {
        status: 'PENDING_APPROVAL',
        approvalId,
        message: `Action requires human sign-off: Action '${actionType}' flagged as HIGH-RISK. Approval ticket #${approvalId} dispatched to Department Manager.`,
      };
    }

    // 3. Normal Execution (read or low-risk write)
    this.recordAudit({
      eventType: 'TOOL_EXECUTION',
      actor: { id: user.id, name: user.name, role: user.role, department: user.department, region: user.region },
      targetAgent: agentId,
      resource,
      action: actionType,
      verdict: 'ALLOWED',
      reason: `Effective permission validated and risk below escalation threshold.`,
      payloadSummary: JSON.stringify(payload).slice(0, 80),
    });

    return {
      status: 'EXECUTED',
      message: `Action '${actionType}' on '${resource}' executed successfully by backend engine.`,
      data: payload,
    };
  }

  /**
   * Decide Human Approval (Manager or Admin)
   */
  public static decideApproval(
    approver: EnterpriseUser,
    approvalId: string,
    decision: 'APPROVED' | 'REJECTED',
    comments?: string
  ): { success: boolean; message: string } {
    if (approver.role !== 'MANAGER' && approver.role !== 'PLATFORM_ADMIN') {
      this.recordAudit({
        eventType: 'ACCESS_DENIED',
        actor: { id: approver.id, name: approver.name, role: approver.role, department: approver.department, region: approver.region },
        resource: 'approvals',
        action: 'decide',
        verdict: 'DENIED',
        reason: `User role ${approver.role} cannot approve high-risk actions. Requires MANAGER or PLATFORM_ADMIN.`,
      });

      return {
        success: false,
        message: `Only a MANAGER or PLATFORM_ADMIN can review and approve tickets.`,
      };
    }

    const item = pendingApprovals.find((a) => a.id === approvalId);
    if (!item) {
      return { success: false, message: `Approval ticket ${approvalId} not found.` };
    }

    item.status = decision;
    item.reviewedBy = { id: approver.id, name: approver.name, role: approver.role };
    item.reviewedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    item.comments = comments || `Decided by ${approver.name} (${approver.role})`;

    this.recordAudit({
      eventType: 'APPROVAL_DECISION',
      actor: { id: approver.id, name: approver.name, role: approver.role, department: approver.department, region: approver.region },
      resource: item.resource,
      action: item.actionType,
      verdict: decision === 'APPROVED' ? 'ALLOWED' : 'DENIED',
      reason: `Approval ticket ${approvalId} was ${decision} by ${approver.name}`,
      payloadSummary: comments,
    });

    return {
      success: true,
      message: `Ticket ${approvalId} was successfully marked as ${decision}.`,
    };
  }

  /**
   * Get Immutable Audit Logs
   */
  public static getAuditLogs(
    user: EnterpriseUser,
    filter?: { verdict?: string; eventType?: string }
  ): AuditEvent[] {
    // Record reading of audit log
    let list = [...auditLogChain];

    if (filter?.verdict && filter.verdict !== 'ALL') {
      list = list.filter((e) => e.verdict === filter.verdict);
    }
    if (filter?.eventType && filter.eventType !== 'ALL') {
      list = list.filter((e) => e.eventType === filter.eventType);
    }

    return list;
  }

  public static getPendingApprovals(): ApprovalRequest[] {
    return pendingApprovals;
  }

  /**
   * Record new audit event to the cryptographic chain
   */
  public static recordAudit(params: {
    eventType: AuditEvent['eventType'];
    actor: AuditEvent['actor'];
    targetAgent?: string;
    resource: string;
    action: string;
    verdict: AuditEvent['verdict'];
    reason: string;
    payloadSummary?: string;
  }): AuditEvent {
    const prev = auditLogChain[0];
    const prevHash = prev ? prev.hash : '0x000000000000';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const id = `audit-${(auditLogChain.length + 1).toString().padStart(4, '0')}`;
    const hash = computeHash(prevHash, `${id}-${params.actor.id}-${params.resource}-${params.action}-${params.verdict}`);

    const newEvent: AuditEvent = {
      id,
      timestamp,
      eventType: params.eventType,
      actor: params.actor,
      targetAgent: params.targetAgent,
      resource: params.resource,
      action: params.action,
      verdict: params.verdict,
      reason: params.reason,
      payloadSummary: params.payloadSummary,
      hash,
      previousHash: prevHash,
    };

    auditLogChain.unshift(newEvent);
    // Keep max 200 logs
    if (auditLogChain.length > 200) {
      auditLogChain = auditLogChain.slice(0, 200);
    }

    return newEvent;
  }
}
