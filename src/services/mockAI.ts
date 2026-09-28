import { ChatMessage, EnterpriseUser } from '../types';
import { BackendSecurityEngine } from './securityEngine';

export interface AgentSimulationResult {
  message: ChatMessage;
  tokensConsumed: number;
  costIncurred: number;
  nodeSequence: string[];
}

export function simulateAgentResponse(query: string, userOverride?: EnterpriseUser): AgentSimulationResult {
  const user = userOverride || BackendSecurityEngine.getCurrentUser();
  const normalized = query.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // SCENARIO 1: HR / Payroll / Salary query - Unauthorized test scenario for Procurement/Finance
  if (
    normalized.includes('payroll') ||
    normalized.includes('salary') ||
    normalized.includes('compensation') ||
    normalized.includes('employee record') ||
    normalized.includes('hr data')
  ) {
    // Check user permission
    const hrCheck = BackendSecurityEngine.queryEmployees(user);
    if (!hrCheck.success) {
      const deniedText = `⛔ 403 FORBIDDEN: Access to HR & Payroll compensation records denied by Backend Security Engine.

• Authenticated Actor: ${user.name} (${user.role})
• Department: ${user.department} | Assigned Region: ${user.region}
• Evaluated Permission: 'employees.read' ➔ NOT GRANTED
• Policy: ISO-27001 Data Separation & Department Isolation Policy
• Security Action: Intercepted at pre-LLM retrieval gate. No employee records or compensation data were sent to the LLM.
• Audit Trail: Security violation event logged to Immutable Audit Hash Chain.`;

      return {
        message: {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: deniedText,
          timestamp,
          tokensUsed: 220,
          costEstimate: '$0.0004',
          latencySeconds: 0.4,
          citations: ['SECURITY-GATE-RBAC-403'],
          isDemo: true,
        },
        tokensConsumed: 220,
        costIncurred: 0.0004,
        nodeSequence: ['user_query', 'prompt_shield', 'content_safety', 'answer'],
      };
    } else {
      // HR Analyst / Admin allowed
      const list = hrCheck.data
        .map((emp) => `• ${emp.full_name} (${emp.title}) — Dept: ${emp.department}, Region: ${emp.region}, Salary: ₹${emp.annual_salary_inr_lakhs}L`)
        .join('\n');

      const text = `Authorized HR Records Retrieved (Permitted for ${user.role} in ${user.region}):

${list}

• Row-Level Security (RLS) Filter: Showing ${hrCheck.rlsFilteredCount} of ${hrCheck.totalRows} records matching region "${user.region}"
• Classification: RESTRICTED (Internal HR & Exec Compensation)
• Access Verified: 'employees.read' verified by backend RBAC layer.`;

      return {
        message: {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: text,
          timestamp,
          tokensUsed: 890,
          costEstimate: '$0.0022',
          latencySeconds: 1.2,
          citations: ['HR-PAYROLL-SECURE-DB'],
          isDemo: true,
        },
        tokensConsumed: 890,
        costIncurred: 0.0022,
        nodeSequence: ['user_query', 'prompt_shield', 'hybrid_search', 'llm_reasoning', 'function_call', 'content_safety', 'answer'],
      };
    }
  }

  // SCENARIO 2: High-Risk Action (e.g. Create Purchase Order > ₹30L or Delete PO)
  if (
    normalized.includes('create po') ||
    normalized.includes('create purchase order') ||
    normalized.includes('approve po') ||
    normalized.includes('delete po') ||
    normalized.includes('send external')
  ) {
    const actionResult = BackendSecurityEngine.executeAction(
      user,
      'agent-procurement',
      'purchase_orders.create',
      'purchase_orders.create',
      { query, requestedAmountLakhs: 45.0, user: user.name }
    );

    if (actionResult.status === 'PENDING_APPROVAL') {
      const approvalText = `⚠️ HIGH-RISK ACTION GATED: Human Approval Workflow Triggered

• Ticket ID: #${actionResult.approvalId}
• Action: Create Purchase Order (Amount > ₹30.0 Lakhs threshold)
• Requested By: ${user.name} (${user.role} • ${user.department})
• Current Status: PENDING_APPROVAL
• Workflow Policy: Financial & procurement writes above threshold require Department Manager or Platform Admin sign-off before database execution.
• Next Step: A high-priority notification has been dispatched to Department Manager (Vikram Joshi). You can track or decide this ticket in the "Monitoring & Approvals" tab.`;

      return {
        message: {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: approvalText,
          timestamp,
          tokensUsed: 460,
          costEstimate: '$0.0011',
          latencySeconds: 0.8,
          citations: [`APPROVAL-TICKET-${actionResult.approvalId}`],
          isDemo: true,
        },
        tokensConsumed: 460,
        costIncurred: 0.0011,
        nodeSequence: ['user_query', 'prompt_shield', 'llm_reasoning', 'content_safety', 'answer'],
      };
    } else if (actionResult.status === 'DENIED') {
      const deniedText = `⛔ 403 FORBIDDEN: High-risk operation rejected. ${actionResult.message}`;
      return {
        message: {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: deniedText,
          timestamp,
          tokensUsed: 210,
          costEstimate: '$0.0005',
          latencySeconds: 0.5,
          citations: ['RBAC-DENIED-POLICY'],
          isDemo: true,
        },
        tokensConsumed: 210,
        costIncurred: 0.0005,
        nodeSequence: ['user_query', 'prompt_shield', 'content_safety', 'answer'],
      };
    }
  }

  // SCENARIO 3: Procurement Query (with regional data-level filtering)
  if (
    normalized.includes('procurement') ||
    normalized.includes('vendor') ||
    normalized.includes('purchase amount') ||
    normalized.includes('purchase order')
  ) {
    const poResult = BackendSecurityEngine.queryPurchaseOrders(user);

    if (!poResult.success) {
      const deniedText = `⛔ 403 FORBIDDEN: User ${user.name} (${user.role}) is not authorized to access procurement purchase orders. Requires 'purchase_orders.read' permission.`;
      return {
        message: {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: deniedText,
          timestamp,
          tokensUsed: 240,
          costEstimate: '$0.0005',
          latencySeconds: 0.5,
          citations: ['SECURITY-GATE-RBAC-403'],
          isDemo: true,
        },
        tokensConsumed: 240,
        costIncurred: 0.0005,
        nodeSequence: ['user_query', 'prompt_shield', 'content_safety', 'answer'],
      };
    }

    const permittedRows = poResult.data;
    const vendorList = permittedRows
      .map(
        (po, idx) =>
          `${idx + 1}. ${po.vendor_name} (${po.po_number}) — ₹${po.amount_inr_lakhs}L [Region: ${po.region}, Status: ${po.compliance_status}]`
      )
      .join('\n');

    const totalSpend = permittedRows.reduce((acc, po) => acc + po.amount_inr_lakhs, 0).toFixed(1);

    const text = `Based on authenticated procurement records for ${user.name} (${user.role}):

${vendorList}

• Row-Level Security (RLS) Filter: Showing ${poResult.rlsFilteredCount} records authorized for Region: "${user.region}" (out of ${poResult.totalRows} global records)
• Regional Total Spend: ₹${totalSpend} Lakhs
• Execution Pipeline: Prompt Shield ➔ Hybrid Search (Vector DB) ➔ Backend RLS Database Filter ➔ Content Safety
• Audit Reference: Hash verified in Immutable Audit Log

*Note: Verified DEMO DATA with backend row-level authorization applied.*`;

    return {
      message: {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        content: text,
        timestamp,
        tokensUsed: 1380,
        costEstimate: '$0.0033',
        latencySeconds: 1.7,
        citations: permittedRows.map((po) => po.po_number),
        isDemo: true,
      },
      tokensConsumed: 1380,
      costIncurred: 0.0033,
      nodeSequence: [
        'user_query',
        'prompt_shield',
        'hybrid_search',
        'llm_reasoning',
        'function_call',
        'content_safety',
        'answer',
      ],
    };
  }

  // SCENARIO 4: Finance Ledger / Reserves Query
  if (
    normalized.includes('finance') ||
    normalized.includes('ledger') ||
    normalized.includes('reserve') ||
    normalized.includes('quarterly spend')
  ) {
    const finResult = BackendSecurityEngine.queryFinance(user);

    if (!finResult.success) {
      const deniedText = `⛔ 403 FORBIDDEN: User ${user.name} (${user.role}) is not authorized to query corporate finance reserves. Requires 'finance.read' permission.`;
      return {
        message: {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: deniedText,
          timestamp,
          tokensUsed: 220,
          costEstimate: '$0.0004',
          latencySeconds: 0.4,
          citations: ['SECURITY-GATE-RBAC-403'],
          isDemo: true,
        },
        tokensConsumed: 220,
        costIncurred: 0.0004,
        nodeSequence: ['user_query', 'prompt_shield', 'content_safety', 'answer'],
      };
    }

    const list = finResult.data
      .map(
        (f) =>
          `• Ledger Cost Center (${f.cost_center}) — Allocated: $${(f.allocated_budget_usd / 1000).toFixed(0)}K, Spent: $${(f.actual_spend_usd / 1000).toFixed(0)}K, Variance: ${f.variance_pct}% [Region: ${f.region}]`
      )
      .join('\n');

    const text = `Corporate Finance Ledger Records (Authorized for ${user.name} • ${user.role}):

${list}

• Row-Level Security: Filtered by region "${user.region}" (${finResult.rlsFilteredCount} rows returned)
• Status: Verified against General Ledger replica.`;

    return {
      message: {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        content: text,
        timestamp,
        tokensUsed: 1040,
        costEstimate: '$0.0024',
        latencySeconds: 1.3,
        citations: ['FIN-GL-2026-Q2'],
        isDemo: true,
      },
      tokensConsumed: 1040,
      costIncurred: 0.0024,
      nodeSequence: [
        'user_query',
        'prompt_shield',
        'hybrid_search',
        'llm_reasoning',
        'function_call',
        'content_safety',
        'answer',
      ],
    };
  }

  // SCENARIO 5: Customer Service / KPI Query
  if (
    normalized.includes('kpi') ||
    normalized.includes('customer') ||
    normalized.includes('service') ||
    normalized.includes('csat') ||
    normalized.includes('deflection')
  ) {
    const text = `Here are the key customer service KPIs for Q2 2026 (Authorized for ${user.name}):

• Total sessions: 18.4K per day
• Deflection rate: 64% (autonomous resolution without human intervention)
• Customer Satisfaction (CSAT): 4.7 / 5.0
• Cost per session: $0.21
• Response time: 2.1 seconds (p95: 3.4s)

The system retrieved the relevant enterprise analytics data and validated the response before returning the result.

• Autonomous deflection increased by +3.2 pp week-over-week.
• All responses verified through the Content Safety & Hallucination Guardrail.

*Note: DEMO DATA from Customer Support Telemetry.*`;

    return {
      message: {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        content: text,
        timestamp,
        tokensUsed: 980,
        costEstimate: '$0.0021',
        latencySeconds: 1.4,
        citations: ['CS-TELEMETRY-Q2-2026', 'ZENDESK-AGGREGATE-STATS'],
        isDemo: true,
      },
      tokensConsumed: 980,
      costIncurred: 0.0021,
      nodeSequence: [
        'user_query',
        'prompt_shield',
        'hybrid_search',
        'llm_reasoning',
        'function_call',
        'content_safety',
        'answer',
      ],
    };
  }

  // SCENARIO 6: General Fallback Query
  const fallback = `I analyzed the request as ${user.name} (${user.role} • ${user.department} • ${user.region}).

• Authentication Check: Validated SAML2 token claims.
• Effective Permissions: Evaluated intersection of User Permissions (${user.permissions.length}) with Agent Manifest.
• Knowledge Retrieval: Filtered document chunks to remove classified files outside ${user.department}.
• Policy Governance: Evaluated against content safety and audit log chained.

Summary: Your request "${query.slice(0, 70)}${query.length > 70 ? '...' : ''}" was processed securely through 7 active cognitive nodes.

*Note: DEMO PROTOTYPE WITH BACKEND RBAC APPLIED.*`;

  return {
    message: {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      content: fallback,
      timestamp,
      tokensUsed: 840,
      costEstimate: '$0.0019',
      latencySeconds: 1.3,
      citations: ['SYSTEM-ORCHESTRATOR-v2.7'],
      isDemo: true,
    },
    tokensConsumed: 840,
    costIncurred: 0.0019,
    nodeSequence: [
      'user_query',
      'prompt_shield',
      'hybrid_search',
      'llm_reasoning',
      'content_safety',
      'answer',
    ],
  };
}
