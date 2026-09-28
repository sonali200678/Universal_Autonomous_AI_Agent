import {
  EnterpriseUser,
  AuditEvent,
  ApprovalRequest,
  RAGChunk,
  SecurePurchaseOrder,
  SecureEmployeeRecord,
  SecureFinanceLedger,
} from '../types';
import { BackendSecurityEngine, ENTERPRISE_USERS } from './securityEngine';

class ApiService {
  private getHeaders(): Record<string, string> {
    const user = BackendSecurityEngine.getCurrentUser();
    return {
      'Content-Type': 'application/json',
      'x-user-id': user.id,
    };
  }

  public async getCurrentUser(): Promise<EnterpriseUser> {
    try {
      const res = await fetch('/api/auth/me', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {
      // Fallback to local security engine
    }
    return BackendSecurityEngine.getCurrentUser();
  }

  public async switchUser(userId: string): Promise<EnterpriseUser> {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        BackendSecurityEngine.setCurrentUser(data.user);
        return data.user;
      }
    } catch {
      // Fallback
    }
    return BackendSecurityEngine.setCurrentUser(userId);
  }

  public async queryPurchaseOrders(): Promise<{
    success: boolean;
    data: SecurePurchaseOrder[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  }> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const res = await fetch('/api/data/purchase-orders', { headers: this.getHeaders() });
      const data = await res.json();
      return data;
    } catch {
      return BackendSecurityEngine.queryPurchaseOrders(user);
    }
  }

  public async queryEmployees(): Promise<{
    success: boolean;
    data: SecureEmployeeRecord[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  }> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const res = await fetch('/api/data/employees', { headers: this.getHeaders() });
      const data = await res.json();
      return data;
    } catch {
      return BackendSecurityEngine.queryEmployees(user);
    }
  }

  public async queryFinance(): Promise<{
    success: boolean;
    data: SecureFinanceLedger[];
    error?: string;
    totalRows: number;
    rlsFilteredCount: number;
  }> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const res = await fetch('/api/data/finance', { headers: this.getHeaders() });
      const data = await res.json();
      return data;
    } catch {
      return BackendSecurityEngine.queryFinance(user);
    }
  }

  public async searchRAG(query: string): Promise<{
    allowedChunks: RAGChunk[];
    deniedChunksCount: number;
    totalScanned: number;
  }> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return BackendSecurityEngine.searchRAGChunks(user, query);
  }

  public async executeAgentAction(
    agentId: string,
    actionType: string,
    resource: string,
    payload: Record<string, any>
  ): Promise<{
    status: 'EXECUTED' | 'DENIED' | 'PENDING_APPROVAL';
    approvalId?: string;
    message: string;
    data?: any;
  }> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const res = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ agentId, actionType, resource, payload }),
      });
      return await res.json();
    } catch {
      return BackendSecurityEngine.executeAction(user, agentId, actionType, resource, payload);
    }
  }

  public async getAuditLogs(filter?: { verdict?: string; eventType?: string }): Promise<AuditEvent[]> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const params = new URLSearchParams();
      if (filter?.verdict) params.set('verdict', filter.verdict);
      if (filter?.eventType) params.set('eventType', filter.eventType);
      const res = await fetch(`/api/audit/logs?${params.toString()}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.logs;
      }
    } catch {
      // Fallback
    }
    return BackendSecurityEngine.getAuditLogs(user, filter);
  }

  public async getPendingApprovals(): Promise<ApprovalRequest[]> {
    try {
      const res = await fetch('/api/approvals', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.approvals;
      }
    } catch {
      // Fallback
    }
    return BackendSecurityEngine.getPendingApprovals();
  }

  public async decideApproval(
    approvalId: string,
    decision: 'APPROVED' | 'REJECTED',
    comments?: string
  ): Promise<{ success: boolean; message: string }> {
    const user = BackendSecurityEngine.getCurrentUser();
    try {
      const res = await fetch(`/api/approvals/${approvalId}/decide`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ decision, comments }),
      });
      return await res.json();
    } catch {
      return BackendSecurityEngine.decideApproval(user, approvalId, decision, comments);
    }
  }
}

export const apiService = new ApiService();
