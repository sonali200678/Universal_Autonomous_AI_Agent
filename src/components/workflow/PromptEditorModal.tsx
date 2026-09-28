import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { PromptItem } from '../../types';
import { Save, Tag, Sliders, BookOpen } from 'lucide-react';

interface PromptEditorModalProps {
  prompt: PromptItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePrompt: (prompt: PromptItem) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onSavePrompt,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Support');
  const [tags, setTags] = useState('v1, enterprise');
  const [temperature, setTemperature] = useState(0.2);
  const [template, setTemplate] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setCategory(prompt.category);
      setTags(prompt.tags.join(', '));
      setTemperature(prompt.temperature);
      setTemplate(prompt.template);
      setSystemPrompt(prompt.systemPrompt);
    } else {
      setTitle('');
      setCategory('General');
      setTags('new, custom');
      setTemperature(0.2);
      setTemplate('Enter variable template here e.g. {{user_query}}');
      setSystemPrompt('You are an enterprise AI cognitive orchestrator.');
    }
  }, [prompt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Title required', 'Please provide a title for the prompt template');
      return;
    }

    const savedPrompt: PromptItem = {
      id: prompt ? prompt.id : 'pr-' + Date.now(),
      title,
      category,
      tags: tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
      version: prompt ? prompt.version : 'v1.0',
      updatedAt: 'Just now',
      author: 'Platform Admin',
      temperature,
      template,
      systemPrompt,
    };

    onSavePrompt(savedPrompt);
    onShowToast(`Prompt '${title}' saved`, 'Updated in enterprise prompt repository');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prompt ? `Edit Prompt: ${prompt.title}` : 'Create New Enterprise Prompt'}
      subtitle="Version-controlled prompt template with dynamic variable injection"
      maxWidth="max-w-xl"
      footerActions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {prompt ? 'Save Prompt' : 'Create Prompt'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Prompt Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vendor Spend Analysis"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Customer Experience">Customer Experience</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Engineering">Engineering</option>
              <option value="Compliance">Compliance</option>
              <option value="Support">Support</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. orders, v3, logistics"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Default Temperature</label>
              <span className="text-xs font-mono text-purple-400">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5 mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">System Instructions</label>
          <textarea
            rows={3}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="System level constraints, role persona, and guardrail rules..."
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">User Template (with &#123;&#123;variables&#125;&#125;)</label>
          <textarea
            rows={3}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="e.g. Review invoice {{invoice_id}} for company {{vendor_name}}..."
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
          />
        </div>
      </form>
    </Modal>
  );
};
