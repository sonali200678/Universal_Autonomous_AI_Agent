import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Database,
  Layers,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders,
  Shield,
  ShieldAlert,
  Lock,
  Tag,
  KeyRound,
} from 'lucide-react';
import { EnterpriseUser, RAGChunk, DataClassification } from '../types';
import { BackendSecurityEngine, SECURE_RAG_CHUNKS } from '../services/securityEngine';

interface RAGPageProps {
  currentUser?: EnterpriseUser;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const RAGPage: React.FC<RAGPageProps> = ({
  currentUser = BackendSecurityEngine.getCurrentUser(),
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('procurement vendor spend thresholds and policies');
  const [retrievalResult, setRetrievalResult] = useState<{
    allowedChunks: RAGChunk[];
    deniedChunksCount: number;
    totalScanned: number;
  }>({
    allowedChunks: [],
    deniedChunksCount: 0,
    totalScanned: 0,
  });

  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'procurement' | 'finance' | 'hr'>('all');

  const executeRetrieval = (query: string) => {
    const result = BackendSecurityEngine.searchRAGChunks(currentUser, query);
    setRetrievalResult(result);
  };

  useEffect(() => {
    executeRetrieval(searchQuery);
  }, [currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    executeRetrieval(searchQuery.trim());
    if (onShowToast) {
      onShowToast('RAG Search Executed', `Retrieved ${retrievalResult.allowedChunks.length} permitted chunks for ${currentUser.name}`);
    }
  };

  const getClassificationBadge = (cls: DataClassification) => {
    switch (cls) {
      case 'RESTRICTED':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/50';
      case 'CONFIDENTIAL':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/50';
      case 'INTERNAL':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/50';
      case 'PUBLIC':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
    }
  };

  const filteredCatalog = SECURE_RAG_CHUNKS.filter((c) => {
    if (activeCatalogTab === 'all') return true;
    if (activeCatalogTab === 'procurement') return c.department === 'Procurement';
    if (activeCatalogTab === 'finance') return c.department === 'Finance';
    if (activeCatalogTab === 'hr') return c.department === 'HR';
    return true;
  });

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#070B14] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1D2939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Enterprise Knowledge Base & Secure RAG</h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded flex items-center gap-1">
              <Shield className="w-3 h-3" /> Pre-LLM Permission Filter
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Document chunks tagged with department, classification, and allowed roles. Unauthorized chunks are dropped before prompt synthesis.
          </p>
        </div>

        <button
          onClick={() => executeRetrieval(searchQuery)}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-index & Query
        </button>
      </div>

      {/* Active Security Context Banner */}
      <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <KeyRound className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Active Retrieval Principal: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role} • Dept: {currentUser.department} • Region: {currentUser.region})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2 py-0.5 rounded">
            Permitted Chunks: {retrievalResult.allowedChunks.length}
          </span>
          <span className="text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded">
            Filtered Out: {retrievalResult.deniedChunksCount}
          </span>
        </div>
      </div>

      {/* RAG Telemetry Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Indexed Documents</span>
          <div className="text-xl font-bold font-mono text-white">4,820</div>
          <p className="text-[10px] text-slate-500">Google Drive, Notion, Confluence, ERP</p>
        </div>
        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Vector Chunks</span>
          <div className="text-xl font-bold font-mono text-purple-400">2,410,900</div>
          <p className="text-[10px] text-slate-500">Chunk size: 512 tokens (50 overlap)</p>
        </div>
        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pre-LLM Security Drop Rate</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {retrievalResult.totalScanned > 0
              ? Math.round((retrievalResult.deniedChunksCount / retrievalResult.totalScanned) * 100)
              : 25}%
          </div>
          <p className="text-[10px] text-slate-500">Unauthorized chunks withheld</p>
        </div>
        <div className="p-3.5 bg-[#0D1320] border border-[#1D2939] rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mean Cosine Score</span>
          <div className="text-xl font-bold font-mono text-cyan-400">0.824</div>
          <p className="text-[10px] text-slate-500">Cross-Encoder normalized</p>
        </div>
      </div>

      {/* Retrieval Playground */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white">Permission-Aware RAG Retrieval Test Bench</h3>
            <p className="text-[11px] text-slate-400">
              Only document chunks permitted for <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role}) will be retrieved.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">HNSW Index · RBAC Gated</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge documents or policies..."
              className="w-full pl-9 pr-4 py-2 bg-[#070B14] border border-[#1D2939] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Search RAG
          </button>
        </form>

        {/* Security Gate Interception Indicator */}
        {retrievalResult.deniedChunksCount > 0 && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Access Control Interception:</strong> {retrievalResult.deniedChunksCount} document chunk(s) matched cosine similarity but were <strong>blocked by the backend RAG security gate</strong> because they contain RESTRICTED/CONFIDENTIAL data outside role {currentUser.role}.
              </span>
            </div>
            <span className="text-[10px] font-mono bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded border border-amber-700/50">
              0 Leaked Chunks
            </span>
          </div>
        )}

        {/* Retrieved Chunks Display */}
        <div className="space-y-3">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Authorized Document Chunks ({retrievalResult.allowedChunks.length})</span>
            <span className="text-[10px] font-mono text-purple-400">Context injected into LLM</span>
          </div>

          {retrievalResult.allowedChunks.length > 0 ? (
            retrievalResult.allowedChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-3.5 bg-[#070B14] border border-[#1D2939] rounded-lg space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">{chunk.docTitle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Classification */}
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getClassificationBadge(
                        chunk.classification
                      )}`}
                    >
                      {chunk.classification}
                    </span>

                    {/* Department */}
                    <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Dept: {chunk.department}
                    </span>

                    {/* Region */}
                    <span className="text-[9px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40">
                      {chunk.region}
                    </span>

                    {/* Cosine Score */}
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                      cos: {chunk.similarity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{chunk.content}</p>

                <div className="pt-2 border-t border-[#162032] flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
                  <span>Source: {chunk.source}</span>
                  <div className="flex items-center gap-1">
                    <span>Allowed Roles:</span>
                    <span className="text-purple-300">{chunk.allowedRoles.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No authorized chunks available for this query under current persona permissions.
            </div>
          )}
        </div>
      </div>

      {/* Full Document Catalog with Metadata & Permitted Roles */}
      <div className="bg-[#0D1320] border border-[#1D2939] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Document Catalog & Access Control Manifest
            </h3>
            <p className="text-[11px] text-slate-400">
              Complete index showing document security classification, owning department, and allowed user roles.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {(['all', 'procurement', 'finance', 'hr'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCatalogTab(tab)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-colors ${
                  activeCatalogTab === tab
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-[#070B14] text-slate-400 hover:text-white border border-[#1D2939]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCatalog.map((item) => {
            const hasAccess =
              currentUser.role === 'PLATFORM_ADMIN' ||
              (item.allowedRoles.includes(currentUser.role) &&
                (item.classification === 'PUBLIC' ||
                  item.department === currentUser.department ||
                  currentUser.role === 'AUDITOR'));

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                  hasAccess
                    ? 'bg-[#070B14] border-[#1D2939]'
                    : 'bg-[#070B14]/60 border-rose-950/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getClassificationBadge(
                        item.classification
                      )}`}
                    >
                      {item.classification}
                    </span>
                    <span
                      className={`text-[10px] font-mono flex items-center gap-1 ${
                        hasAccess ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {hasAccess ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Permitted for {currentUser.role}
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" /> Denied for {currentUser.role}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white">{item.docTitle}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.content}</p>
                </div>

                <div className="pt-2 border-t border-[#162032] space-y-1 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Department: <strong className="text-slate-200">{item.department}</strong></span>
                    <span>Region: <strong className="text-cyan-400">{item.region}</strong></span>
                  </div>
                  <div className="truncate">
                    Allowed Roles: <span className="text-purple-300">{item.allowedRoles.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
