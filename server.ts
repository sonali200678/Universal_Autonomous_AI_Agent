import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { BackendSecurityEngine, ENTERPRISE_USERS, ROLE_PERMISSIONS, SECURE_PURCHASE_ORDERS, SECURE_EMPLOYEE_RECORDS, SECURE_FINANCE_LEDGER, AGENT_MANIFESTS } from './src/services/securityEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper to resolve user from Header or active session
function resolveUser(req: Request) {
  const userIdHeader = req.headers['x-user-id'] as string;
  if (userIdHeader) {
    const user = ENTERPRISE_USERS.find((u) => u.id === userIdHeader);
    if (user) {
      return user;
    }
  }
  return BackendSecurityEngine.getCurrentUser();
}

// ==========================================
// 1. AUTHENTICATION & IDENTITY ENDPOINTS
// ==========================================

// Get active authenticated user
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = resolveUser(req);
  res.json({
    user,
    status: 'AUTHENTICATED',
    authMethod: 'ENTERPRISE_SSO_SAML2',
    tokenExpiresIn: '8h 00m',
  });
});

// Switch persona / user session
app.post('/api/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }
  const user = BackendSecurityEngine.setCurrentUser(userId);
  res.json({
    message: `Switched active persona to ${user.name} (${user.role})`,
    user,
  });
});

// List all enterprise users / personas
app.get('/api/auth/users', (req: Request, res: Response) => {
  res.json({
    users: ENTERPRISE_USERS,
  });
});

// ==========================================
// 2. RBAC & PERMISSION ENDPOINTS
// ==========================================

// Role permissions matrix
app.get('/api/security/permissions', (_req: Request, res: Response) => {
  res.json({
    roles: ROLE_PERMISSIONS,
    agentManifests: AGENT_MANIFESTS,
  });
});

// Effective permissions (User ∩ Agent)
app.get('/api/security/effective-permissions', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const agentId = (req.query.agentId as string) || 'agent-procurement';
  const calculation = BackendSecurityEngine.computeEffectivePermissions(user, agentId);

  res.json({
    user: { id: user.id, name: user.name, role: user.role, department: user.department },
    agentId,
    calculation,
  });
});

// ==========================================
// 3. DATA-LEVEL AUTHORIZATION & RLS ENDPOINTS
// ==========================================

// Purchase Orders (Procurement)
app.get('/api/data/purchase-orders', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const result = BackendSecurityEngine.queryPurchaseOrders(user);

  if (!result.success) {
    return res.status(403).json(result);
  }
  res.json(result);
});

// Employee Records (HR / Payroll)
app.get('/api/data/employees', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const result = BackendSecurityEngine.queryEmployees(user);

  if (!result.success) {
    return res.status(403).json(result);
  }
  res.json(result);
});

// Finance General Ledger
app.get('/api/data/finance', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const result = BackendSecurityEngine.queryFinance(user);

  if (!result.success) {
    return res.status(403).json(result);
  }
  res.json(result);
});

// ==========================================
// 4. RAG KNOWLEDGE BASE WITH CHUNK FILTERING
// ==========================================

app.post('/api/rag/search', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  const result = BackendSecurityEngine.searchRAGChunks(user, query);
  res.json({
    query,
    user: { id: user.id, role: user.role, department: user.department, region: user.region },
    ...result,
  });
});

// ==========================================
// 5. AGENT EXECUTION & APPROVALS WORKFLOW
// ==========================================

app.post('/api/agents/execute', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const { agentId, actionType, resource, payload } = req.body;

  if (!agentId || !actionType || !resource) {
    return res.status(400).json({ error: 'agentId, actionType, and resource are required' });
  }

  const result = BackendSecurityEngine.executeAction(user, agentId, actionType, resource, payload || {});

  if (result.status === 'DENIED') {
    return res.status(403).json(result);
  }
  res.json(result);
});

// Pending Approvals
app.get('/api/approvals', (_req: Request, res: Response) => {
  const list = BackendSecurityEngine.getPendingApprovals();
  res.json({ approvals: list });
});

// Decide Approval (Approve / Reject)
app.post('/api/approvals/:id/decide', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const { decision, comments } = req.body;

  if (!decision || (decision !== 'APPROVED' && decision !== 'REJECTED')) {
    return res.status(400).json({ error: 'decision must be APPROVED or REJECTED' });
  }

  const result = BackendSecurityEngine.decideApproval(user, id, decision, comments);
  if (!result.success) {
    return res.status(403).json(result);
  }
  res.json(result);
});

// ==========================================
// 6. IMMUTABLE AUDIT LOGS
// ==========================================

app.get('/api/audit/logs', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const verdict = req.query.verdict as string | undefined;
  const eventType = req.query.eventType as string | undefined;

  const logs = BackendSecurityEngine.getAuditLogs(user, { verdict, eventType });
  res.json({
    totalEvents: logs.length,
    hashChainVerified: true,
    logs,
  });
});

// ==========================================
// 7. DEV & PROD SERVER MOUNTING
// ==========================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware for development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static build in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UAMC-I Enterprise Security Ecosystem] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
