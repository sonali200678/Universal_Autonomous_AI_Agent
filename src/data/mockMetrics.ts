export interface EvaluationMetric {
  subject: string;
  score: number;
  fullMark: number;
  benchmark: number;
}

export const EVALUATION_RADAR_DATA: EvaluationMetric[] = [
  { subject: 'Groundedness', score: 96, fullMark: 100, benchmark: 90 },
  { subject: 'Safety', score: 99.2, fullMark: 100, benchmark: 95 },
  { subject: 'Relevance', score: 92, fullMark: 100, benchmark: 88 },
  { subject: 'Coherence', score: 93, fullMark: 100, benchmark: 89 },
  { subject: 'Completeness', score: 91, fullMark: 100, benchmark: 85 },
];

export const SCORECARD_DATA = [
  { name: 'Groundedness', value: 96.0, delta: '+3.0 pp', positive: true },
  { name: 'Safety', value: 99.2, delta: '+1.1 pp', positive: true },
  { name: 'Relevance', value: 92.0, delta: '+2.0 pp', positive: true },
  { name: 'Coherence', value: 93.0, delta: '+1.0 pp', positive: true },
  { name: 'Completeness', value: 91.0, delta: '+4.0 pp', positive: true },
];

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

export const INITIAL_TOKEN_COST: TokenCostData = {
  tokensUsedMillion: 12.6,
  tokensTotalMillion: 50.0,
  inputTokensMillion: 7.4,
  outputTokensMillion: 5.2,
  costTotal: 3864,
  costBudget: 15000,
  modelCost: 2987,
  toolCost: 877,
};

export const TIME_SERIES_REQUESTS = [
  { time: '00:00', requests: 420, latency: 1.8, cost: 84 },
  { time: '03:00', requests: 180, latency: 1.5, cost: 36 },
  { time: '06:00', requests: 650, latency: 1.9, cost: 130 },
  { time: '09:00', requests: 2840, latency: 2.2, cost: 580 },
  { time: '12:00', requests: 3910, latency: 2.4, cost: 810 },
  { time: '15:00', requests: 4220, latency: 2.1, cost: 890 },
  { time: '18:00', requests: 3450, latency: 2.0, cost: 720 },
  { time: '21:00', requests: 2120, latency: 1.7, cost: 440 },
];

export const COST_BY_MODEL = [
  { model: 'Gemini 2.5 Flash', cost: 1840, tokens: '8.4M', share: '47.6%' },
  { model: 'Gemini 2.5 Pro', cost: 1147, tokens: '3.1M', share: '29.7%' },
  { model: 'Claude 3.5 Sonnet', cost: 560, tokens: '0.8M', share: '14.5%' },
  { model: 'Embeddings 004', cost: 317, tokens: '0.3M', share: '8.2%' },
];

export const TODAY_KPIS = {
  sessions: '18.4K',
  deflectionRate: '64%',
  csat: '4.7/5',
  costPerSession: '$0.21',
  latency: '2.1s',
  passRate: '97.3%',
  overallScore: '94.6',
};
