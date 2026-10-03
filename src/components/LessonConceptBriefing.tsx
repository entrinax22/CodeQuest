import React, { useState } from 'react';
import { 
  BookOpen, Code, Play, CheckCircle2, Lightbulb, AlertTriangle, 
  Eye, ArrowRight, Layers, FileCode, Terminal, HelpCircle, X, Sparkles, Copy, Check
} from 'lucide-react';
import { TeachingConcept } from '../data/lessonConcepts';
import { motion, AnimatePresence } from 'motion/react';

interface LessonConceptBriefingProps {
  lessonTitle: string;
  moduleTitle?: string;
  concept: TeachingConcept;
  onStartExercises: () => void;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export default function LessonConceptBriefing({
  lessonTitle,
  moduleTitle,
  concept,
  onStartExercises,
  isDrawer = false,
  onCloseDrawer
}: LessonConceptBriefingProps) {
  const hasPreview = Boolean(concept.previewHtml || concept.terminalOutput);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(hasPreview ? 'preview' : 'code');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(concept.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-500/20 via-blue-600/15 to-indigo-600/20 border border-sky-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <BookOpen size={12} className="text-sky-300" />
            <span>Interactive Teaching Stage</span>
          </span>
          {moduleTitle && (
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest hidden sm:inline">
              • {moduleTitle}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          {lessonTitle}
        </h1>

        <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed font-normal">
          {concept.summary}
        </p>
      </div>

      {/* Key Golden Rule Callout */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-start gap-3 shadow-md">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <Sparkles size={16} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-0.5">
            The Core Rule
          </span>
          <p className="text-xs sm:text-sm font-bold text-white leading-snug">
            {concept.keyRule}
          </p>
        </div>
      </div>

      {/* Code Showcase & Live Browser / Server Preview Sandbox */}
      <div className="bg-[#141622] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Sandbox Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#10121C]">
          <div className="flex items-center gap-2">
            {concept.previewHtml && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-sky-500 text-black shadow-md'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye size={14} />
                <span>Live Browser Output</span>
              </button>
            )}
            {concept.terminalOutput && !concept.previewHtml && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Terminal size={14} />
                <span>Server Execution Output</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-sky-500 text-black shadow-md'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code size={14} />
              <span>Example Code ({concept.codeLanguage.toUpperCase()})</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="text-[11px] font-bold text-white/50 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Copy code snippet"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5">
          {activeTab === 'preview' && concept.previewHtml && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-t-lg border border-white/10 border-b-0 w-fit text-[10px] font-mono text-white/40">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                <span className="ml-1">browser-preview.html</span>
              </div>
              <div 
                className="rounded-2xl overflow-hidden border border-white/10 shadow-inner"
                dangerouslySetInnerHTML={{ __html: concept.previewHtml }}
              />
              <p className="text-[11px] text-white/40 italic">
                This is how the web browser actually interprets and renders this markup to visitors.
              </p>
            </div>
          )}

          {activeTab === 'preview' && concept.terminalOutput && !concept.previewHtml && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-t-lg border border-emerald-500/30 border-b-0 w-fit text-[10px] font-mono text-emerald-400">
                <Terminal size={12} />
                <span className="ml-1">php-server-cli</span>
              </div>
              <div className="bg-black/90 border border-emerald-500/30 rounded-2xl p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap shadow-inner leading-relaxed">
                {concept.terminalOutput}
              </div>
              <p className="text-[11px] text-white/40 italic">
                PHP processes on the server first and outputs raw text or HTML to the browser.
              </p>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <pre className="bg-[#0B0C11] border border-white/5 rounded-2xl p-4 overflow-x-auto text-xs sm:text-sm font-mono text-sky-300 leading-relaxed shadow-inner">
                <code>{concept.codeSnippet}</code>
              </pre>
              {concept.terminalOutput && (
                <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-3 font-mono text-xs text-emerald-400 whitespace-pre-wrap shadow-inner">
                  {concept.terminalOutput}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visual Anatomy Breakdown Cards */}
      {concept.breakdown.length > 0 && (
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
            <Layers size={16} className="text-sky-400" />
            <span>Syntax Breakdown & Anatomy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concept.breakdown.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#141622] border border-white/10 rounded-2xl p-3.5 hover:border-sky-500/30 transition-all shadow-md group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <code className="text-xs sm:text-sm font-mono font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20 group-hover:border-sky-400/40">
                    {item.term}
                  </code>
                  {item.badge && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tip & Watch Out */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pro Tip */}
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Lightbulb size={15} />
            <span>Developer Pro Tip</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-medium">
            {concept.proTip}
          </p>
        </div>

        {/* Watch Out / Common Mistake */}
        <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <AlertTriangle size={15} />
            <span>Watch Out (Common Trap)</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-medium">
            {concept.commonMistake}
          </p>
        </div>
      </div>

      {/* Bottom CTA Action Bar */}
      <div className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/50 text-xs text-center sm:text-left">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>You can switch back to this theory guide anytime from the top tab bar during questions.</span>
        </div>

        <button
          onClick={onStartExercises}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_6px_0_rgb(30,58,138)] active:translate-y-1 transition-all flex items-center justify-center gap-2 shrink-0 group"
        >
          <span>{isDrawer ? 'Resume Challenges' : 'Start Challenges 🚀'}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  // If used as a drawer / reference modal during exercises:
  if (isDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative max-w-2xl w-full max-h-[90vh] bg-[#0E0F15] border border-white/15 rounded-3xl p-6 overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 sticky top-0 bg-[#0E0F15]/95 backdrop-blur z-20">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-sky-400" />
              <h2 className="text-base font-black text-white">Lesson Guide: {lessonTitle}</h2>
            </div>
            <button
              onClick={onCloseDrawer}
              className="text-white/40 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close guide"
            >
              <X size={20} />
            </button>
          </div>

          {content}
        </div>
      </div>
    );
  }

  // Standard fullscreen / teaching mode before quizzes
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white px-4 sm:px-6 py-4 overflow-y-auto">
      {content}
    </div>
  );
}
