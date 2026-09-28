import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Copy, Check, Link2, Users, Shield } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState<'editor' | 'viewer' | 'tester'>('editor');
  const shareUrl = 'https://uamc-i.enterprise.internal/orchestrator/workflows/v2.7-prod?access=iam-sso';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onShowToast('Share link copied to clipboard', 'Team members can now access workflow v2.7');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Workflow Pipeline"
      subtitle="Grant team members or service accounts access to Enterprise Assistant v2.7"
      maxWidth="max-w-md"
      footerActions={
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
        >
          Done
        </button>
      }
    >
      <div className="space-y-4">
        {/* Link Bar */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Direct Workflow URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono overflow-hidden">
              <Link2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{shareUrl}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Access Permissions */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Workspace Role Permissions</label>
          <div className="space-y-2">
            {[
              { id: 'editor', name: 'AI Engineer / Editor', desc: 'Can edit prompt templates, connect nodes, and trigger test runs' },
              { id: 'tester', name: 'QA & Compliance Tester', desc: 'Can run evaluations and test conversations without modifying graph' },
              { id: 'viewer', name: 'Executive Viewer', desc: 'Read-only access to workflow topology, scorecards, and FinOps telemetry' },
            ].map((item) => (
              <label
                key={item.id}
                onClick={() => setRole(item.id as any)}
                className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  role === item.id
                    ? 'bg-purple-950/30 border-purple-500/40 text-slate-100'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="share-role"
                  checked={role === item.id}
                  onChange={() => {}}
                  className="mt-0.5 accent-purple-500"
                />
                <div>
                  <p className="text-xs font-medium text-slate-200">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SSO Governance */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
          <Shield className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Secured via Okta / Google Workspace SAML SSO. All edits are permanently logged to the immutable audit trail.</span>
        </div>
      </div>
    </Modal>
  );
};
