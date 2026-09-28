import { WorkflowNodeData, WorkflowConnection } from '../types';

export const INITIAL_WORKFLOW_NODES: WorkflowNodeData[] = [
  {
    id: 'user_query',
    name: 'User Query',
    category: 'INPUT',
    type: 'User Query',
    description: 'Ingests user prompt with multi-modal payload & metadata',
    status: 'success',
    x: 40,
    y: 190,
    metrics: {
      statusText: 'Active Listener',
      tokens: 42,
    },
    config: {
      maxTokens: 4096,
      systemInstructions: 'Standard enterprise ingestion gate with intent detection',
    },
    logs: [
      '[08:14:02] Ingestion socket initialized on tenant channel #prod-east',
      '[08:14:03] Session metadata verified: user_role="finance_analyst"',
    ],
  },
  {
    id: 'prompt_shield',
    name: 'Prompt Shield',
    category: 'GUARDRAILS',
    type: 'Prompt Shield',
    description: 'Jailbreak defense, prompt injection detection & PII scanner',
    status: 'success',
    x: 230,
    y: 190,
    metrics: {
      statusText: 'Pass (0.01 Risk)',
      latency: '24ms',
      score: 0.99,
    },
    config: {
      model: 'Guardrail-Engine-v3',
      temperature: 0.0,
      systemInstructions: 'Evaluate prompt against OWASP Top 10 for LLM applications',
    },
    logs: [
      '[08:14:03] Evaluated token heuristics: no adversarial jailbreak detected',
      '[08:14:03] PII scanner: 0 high-entropy leaks found in input payload',
    ],
  },
  {
    id: 'hybrid_search',
    name: 'Hybrid Search',
    category: 'RETRIEVAL',
    type: 'Hybrid Search',
    description: 'Dense vector (Vertex Embeddings) + Sparse BM25 reranked',
    status: 'success',
    x: 230,
    y: 40,
    metrics: {
      topK: 6,
      score: 0.82,
      latency: '148ms',
    },
    config: {
      model: 'text-embedding-004 + BM25',
      temperature: 0.1,
      promptTemplate: 'Rerank top 20 candidate chunks with Cross-Encoder v2',
    },
    logs: [
      '[08:14:04] Queried Vector DB [collection="enterprise_procurement_erp"]',
      '[08:14:04] BM25 keyword match executed on 14,200 indexed records',
      '[08:14:04] Reranker selected top 6 chunks with cosine similarity > 0.79',
    ],
  },
  {
    id: 'llm_reasoning',
    name: 'LLM Reasoning',
    category: 'REASONING',
    type: 'LLM Reasoning',
    description: 'Autonomous multi-step chain-of-thought planner & synthesis',
    status: 'success',
    x: 420,
    y: 190,
    metrics: {
      tokens: 1206,
      latency: '1.4s',
      statusText: 'Gemini 2.5',
    },
    config: {
      model: 'Gemini 2.5 Flash',
      temperature: 0.2,
      promptTemplate: 'You are an enterprise AI cognitive orchestrator. Formulate a plan, invoke tools, synthesize grounded facts.',
      maxTokens: 8192,
      toolsEnabled: ['Hybrid Search', 'Enterprise SQL', 'Analytics Calculator'],
    },
    logs: [
      '[08:14:05] Intent classified: Multi-source structured query synthesis',
      '[08:14:05] Plan formulated: (1) Pull procurement records, (2) Aggregate vendor totals, (3) Sort descending',
      '[08:14:06] Synthesizing context chunks with tool payload response',
    ],
  },
  {
    id: 'function_call',
    name: 'Function Call',
    category: 'TOOLS',
    type: 'Function Call',
    description: 'Enterprise API gateway & authenticated SQL query runner',
    status: 'success',
    x: 420,
    y: 340,
    metrics: {
      statusText: '200 OK',
      latency: '112ms',
    },
    config: {
      model: 'PostgreSQL Enterprise Connector',
      promptTemplate: 'SELECT vendor_name, SUM(amount) AS total FROM po_records GROUP BY vendor_name ORDER BY total DESC LIMIT 5;',
    },
    logs: [
      '[08:14:05] Authenticated IAM Service Account token with scope "analytics:read"',
      '[08:14:05] Dispatched SQL query to database replica [cluster="ap-southeast-primary"]',
      '[08:14:05] Returned 5 rows in 38ms',
    ],
  },
  {
    id: 'content_safety',
    name: 'Content Safety',
    category: 'GUARDRAILS',
    type: 'Content Safety',
    description: 'Post-generation compliance check, hallucination filter & redaction',
    status: 'success',
    x: 610,
    y: 190,
    metrics: {
      score: 0.99,
      latency: '36ms',
      statusText: 'Verified Safe',
    },
    config: {
      model: 'Safety-Guard-Enterprise',
      temperature: 0.0,
      systemInstructions: 'Verify response against truthfulness index and corporate compliance policy.',
    },
    logs: [
      '[08:14:06] Output safety check: Hate=0.0, Harassment=0.0, SelfHarm=0.0, PII=0.0',
      '[08:14:06] Factuality verification against retrieved ground truth: 96.4%',
    ],
  },
  {
    id: 'answer',
    name: 'Answer',
    category: 'RESPONSE',
    type: 'Answer',
    description: 'Final streamed executive response with grounded citations & telemetry',
    status: 'success',
    x: 800,
    y: 190,
    metrics: {
      tokens: 432,
      latency: '2.1s',
      statusText: 'Streamed 100%',
    },
    config: {
      systemInstructions: 'Render markdown response, format key statistics, attach telemetry metadata.',
    },
    logs: [
      '[08:14:07] Answer token buffer flushed to client session',
      '[08:14:07] Attached citation provenance IDs [doc_ref="PO-2026-Q2-REV"]',
    ],
  },
];

export const INITIAL_WORKFLOW_CONNECTIONS: WorkflowConnection[] = [
  { id: 'c1', from: 'user_query', to: 'prompt_shield' },
  { id: 'c2', from: 'prompt_shield', to: 'llm_reasoning' },
  { id: 'c3', from: 'hybrid_search', to: 'llm_reasoning' },
  { id: 'c4', from: 'llm_reasoning', to: 'function_call' },
  { id: 'c5', from: 'function_call', to: 'llm_reasoning' },
  { id: 'c6', from: 'llm_reasoning', to: 'content_safety' },
  { id: 'c7', from: 'content_safety', to: 'answer' },
];

export const AVAILABLE_LIBRARY_NODES: {
  category: string;
  items: {
    type: string;
    name: string;
    description: string;
    category: 'INPUT' | 'RETRIEVAL' | 'REASONING' | 'TOOLS' | 'GUARDRAILS' | 'RESPONSE';
    defaultMetrics: { latency?: string; tokens?: number; topK?: number; score?: number; statusText?: string };
  }[];
}[] = [
  {
    category: 'Retrieval',
    items: [
      {
        type: 'Vector Search',
        name: 'Vector Search',
        description: 'Dense embedding nearest neighbor retrieval via HNSW vector index',
        category: 'RETRIEVAL',
        defaultMetrics: { topK: 10, score: 0.88, latency: '85ms' },
      },
      {
        type: 'BM25 Search',
        name: 'BM25 Search',
        description: 'Exact term frequency and lexical inverted index matching',
        category: 'RETRIEVAL',
        defaultMetrics: { topK: 5, score: 0.74, latency: '42ms' },
      },
      {
        type: 'Hybrid Search',
        name: 'Hybrid Search',
        description: 'Ensemble sparse + dense reciprocal rank fusion with Cross-Encoder',
        category: 'RETRIEVAL',
        defaultMetrics: { topK: 6, score: 0.82, latency: '148ms' },
      },
    ],
  },
  {
    category: 'Reasoning',
    items: [
      {
        type: 'LLM Reasoning',
        name: 'LLM Reasoning',
        description: 'Multi-step autonomous chain-of-thought planner & synthesis',
        category: 'REASONING',
        defaultMetrics: { tokens: 1206, latency: '1.4s', statusText: 'Gemini 2.5' },
      },
      {
        type: 'Plan & Solve',
        name: 'Plan & Solve',
        description: 'Decomposes complex multi-agent objectives into DAG subtasks',
        category: 'REASONING',
        defaultMetrics: { tokens: 840, latency: '1.1s', statusText: 'Planner v2' },
      },
      {
        type: 'Self-Refine',
        name: 'Self-Refine',
        description: 'Iterative critique & reflection loop against rubric validation',
        category: 'REASONING',
        defaultMetrics: { tokens: 950, latency: '1.8s', statusText: '2 Iterations' },
      },
    ],
  },
  {
    category: 'Tools',
    items: [
      {
        type: 'Function Call',
        name: 'Function Call',
        description: 'Enterprise API gateway connector with OAuth 2.0 / IAM auth',
        category: 'TOOLS',
        defaultMetrics: { statusText: '200 OK', latency: '112ms' },
      },
      {
        type: 'Code Interpreter',
        name: 'Code Interpreter',
        description: 'Sandboxed Python / WASM execution engine with data analysis',
        category: 'TOOLS',
        defaultMetrics: { statusText: 'Exit 0', latency: '320ms' },
      },
      {
        type: 'Database Query',
        name: 'Database Query',
        description: 'Direct parameter-bound SQL engine for PostgreSQL / BigQuery',
        category: 'TOOLS',
        defaultMetrics: { statusText: 'Read Replica', latency: '65ms' },
      },
    ],
  },
  {
    category: 'Guardrails',
    items: [
      {
        type: 'PII Redaction',
        name: 'PII Redaction',
        description: 'Masks SSNs, credit cards, emails, and proprietary entity names',
        category: 'GUARDRAILS',
        defaultMetrics: { latency: '18ms', statusText: '0 Leaks' },
      },
      {
        type: 'Content Safety',
        name: 'Content Safety',
        description: 'Automated policy enforcement, toxicity check & hallucination detection',
        category: 'GUARDRAILS',
        defaultMetrics: { score: 0.99, latency: '36ms', statusText: 'Verified Safe' },
      },
      {
        type: 'Prompt Shield',
        name: 'Prompt Shield',
        description: 'Prevents indirect prompt injections, jailbreaks & instruction hijacking',
        category: 'GUARDRAILS',
        defaultMetrics: { latency: '24ms', score: 0.99, statusText: 'Pass (0.01 Risk)' },
      },
    ],
  },
  {
    category: 'Response',
    items: [
      {
        type: 'Answer',
        name: 'Answer',
        description: 'Structured output formatter with confidence score and citations',
        category: 'RESPONSE',
        defaultMetrics: { tokens: 432, latency: '2.1s', statusText: 'Ready' },
      },
    ],
  },
];
