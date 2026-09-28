export interface GuardrailRule {
  id: string;
  name: string;
  type: 'Input Defense' | 'Output Safety' | 'PII Redaction' | 'Tool Authorization' | 'Data Residency';
  status: 'Enforced' | 'Auditing' | 'Disabled';
  triggeredToday: number;
  passRatePct: number;
  severity: 'Critical' | 'High' | 'Medium';
  description: string;
}

export const MOCK_GUARDRAILS: GuardrailRule[] = [
  {
    id: 'gr-prompt-shield',
    name: 'Prompt Injection & Jailbreak Defense',
    type: 'Input Defense',
    status: 'Enforced',
    triggeredToday: 142,
    passRatePct: 99.7,
    severity: 'Critical',
    description: 'Scans for system instruction overrides, few-shot adversarial prompts, and base64 obfuscations.',
  },
  {
    id: 'gr-pii',
    name: 'PII & Financial Identity Redaction',
    type: 'PII Redaction',
    status: 'Enforced',
    triggeredToday: 388,
    passRatePct: 99.9,
    severity: 'Critical',
    description: 'Regex + NER entity masking for Aadhaar, SSN, Credit Cards, IBANs, and corporate internal email addresses.',
  },
  {
    id: 'gr-hallucination',
    name: 'Hallucination & Faithfulness Guard',
    type: 'Output Safety',
    status: 'Enforced',
    triggeredToday: 54,
    passRatePct: 98.4,
    severity: 'High',
    description: 'Evaluates output claims against source chunk sentences; rejects responses with unsupported numerical claims.',
  },
  {
    id: 'gr-toxicity',
    name: 'Toxicity, Harassment & Bias Filter',
    type: 'Output Safety',
    status: 'Enforced',
    triggeredToday: 6,
    passRatePct: 99.98,
    severity: 'Critical',
    description: 'Multi-category sentiment and content classifier blocking hate speech, harassment, and confidential leaks.',
  },
  {
    id: 'gr-tool-perms',
    name: 'Tool Execution Permission Boundary',
    type: 'Tool Authorization',
    status: 'Enforced',
    triggeredToday: 12,
    passRatePct: 99.95,
    severity: 'High',
    description: 'Blocks DROP, TRUNCATE, DELETE, and unauthorized external domains in SQL and REST function calls.',
  },
  {
    id: 'gr-residency',
    name: 'Data Residency & Sovereign Cloud Enclave',
    type: 'Data Residency',
    status: 'Enforced',
    triggeredToday: 0,
    passRatePct: 100.0,
    severity: 'Critical',
    description: 'Ensures model prompts and embeddings never egress approved geographic boundaries (SOC2 / ISO27001).',
  },
];
