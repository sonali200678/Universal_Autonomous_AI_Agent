import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Rocket, ShieldCheck, CheckCircle2, GitBranch, AlertCircle } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeploy: (environment: string, version: string, canaryPct: number) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeploy,
}) => {
  const [environment, setEnvironment] = useState<'production' | 'staging'>('production');
  const [canaryPct, setCanaryPct] = useState(100);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      onConfirmDeploy(environment, 'v2.7-prod', canaryPct);
      onClose();
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deploy Enterprise Assistant Pipeline"
      subtitle="Promote workflow v2.7 to active serving infrastructure"
      maxWidth="max-w-lg"
      footerActions={
        <>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 rounded-md hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-md flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Rolling out...
              </>
            ) : (
              <>
                <Rocket className="w-3.5 h-3.5" />
                Deploy to {environment === 'production' ? 'Production' : 'Staging'}
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Environment Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Cluster Environment</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setEnvironment('production')}
              className={`p-3 rounded-lg border text-left transition-all ${
                environment === 'production'
                  ? 'bg-purple-950/30 border-purple-500/50 text-slate-100 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">Production Live</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">Primary US-East cluster serving 18.4K daily sessions</p>
            </button>

            <button
              type="button"
              onClick={() => setEnvironment('staging')}
              className={`p-3 rounded-lg border text-left transition-all ${
                environment === 'staging'
                  ? 'bg-purple-950/30 border-purple-500/50 text-slate-100 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">Staging Sandbox</span>
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <p className="text-[11px] text-slate-400">Isolated pre-production validation sandbox</p>
            </button>
          </div>
        </div>

        {/* Traffic Allocation */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">Canary Traffic Allocation</label>
            <span className="text-xs font-mono text-purple-400">{canaryPct}% Traffic</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={canaryPct}
            onChange={(e) => setCanaryPct(Number(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>10% Canary</span>
            <span>50% Split</span>
            <span>100% Full Rollout</span>
          </div>
        </div>

        {/* Pre-deployment Verification Checklist */}
        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
          <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Automated Pre-Flight Verification</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-300">Groundedness Benchmark: 96.0% (Threshold: &ge;90%)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-300">Content Safety Compliance: 99.2% (OWASP Top 10 pass)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <GitBranch className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-300">Zero Breaking Schema Changes in 7 active nodes</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
