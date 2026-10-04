import React, { useState, useEffect } from 'react';
import { Terminal, X, Copy, Trash2, Search, Filter, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { logger, LogEntry } from '../lib/logger';

export default function DebugConsoleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    logger.init();
    const unsubscribe = logger.subscribe((newLogs) => {
      setLogs([...newLogs]);
    });
    return () => unsubscribe();
  }, []);

  const handleCopy = () => {
    const text = filteredLogs
      .map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] [${l.category.toUpperCase()}]\n${l.message}`)
      .join('\n----------------------------------------\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || log.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'error') return log.type === 'error';
    if (filterType === 'warn') return log.type === 'warn';
    if (filterType === 'supabase') return log.category === 'supabase';
    if (filterType === 'subscription') return log.category === 'subscription';
    if (filterType === 'auth') return log.category === 'auth';
    return true;
  });

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount = logs.filter(l => l.type === 'warn').length;

  return (
    <>
      {/* Floating Console Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 bg-slate-900/90 text-emerald-400 border border-emerald-500/30 rounded-xl shadow-2xl backdrop-blur-md hover:bg-slate-800 transition-all text-xs font-mono group"
          title="Open In-App Debug Console"
        >
          <Terminal className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>Console Logs</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
            {logs.length}
          </span>
          {errorCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[10px] animate-pulse">
              {errorCount} err
            </span>
          )}
        </button>
      )}

      {/* Console Drawer/Modal */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-2 md:inset-x-auto md:right-4 md:bottom-4 md:w-[680px] z-50 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col max-h-[85vh] text-slate-200 overflow-hidden font-mono text-xs animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 select-none">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-xs">
                  CodeQuest Debug Console
                  <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded font-semibold">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Inspecting application events, Supabase queries & errors</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
                title="Close Console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Toolbar */}
              <div className="p-3 bg-slate-900/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: `All (${logs.length})` },
                    { id: 'supabase', label: 'Supabase 🗄️' },
                    { id: 'subscription', label: 'Subscription 💳' },
                    { id: 'warn', label: `Warns (${warnCount})` },
                    { id: 'error', label: `Errors (${errorCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterType(tab.id)}
                      className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap font-medium text-[10px] ${
                        filterType === tab.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-7 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 w-28 md:w-36"
                    />
                  </div>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700/50 transition flex items-center gap-1 text-[10px]"
                    title="Copy logs to clipboard"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => logger.clear()}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition text-[10px]"
                    title="Clear logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Logs Content Area */}
              <div className="p-3 overflow-y-auto max-h-[50vh] space-y-2 select-text font-mono text-[11px] leading-relaxed">
                {filteredLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No console logs matching current filters.
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    let borderStyle = 'border-slate-800 bg-slate-900/30 text-slate-300';
                    let badgeBg = 'bg-slate-800 text-slate-400';

                    if (log.type === 'error') {
                      borderStyle = 'border-rose-500/30 bg-rose-950/20 text-rose-300';
                      badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                    } else if (log.type === 'warn') {
                      borderStyle = 'border-amber-500/30 bg-amber-950/20 text-amber-300';
                      badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                    } else if (log.category === 'supabase') {
                      borderStyle = 'border-sky-500/20 bg-sky-950/10 text-sky-200';
                      badgeBg = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
                    } else if (log.category === 'subscription') {
                      borderStyle = 'border-purple-500/20 bg-purple-950/10 text-purple-200';
                      badgeBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                    }

                    return (
                      <div
                        key={log.id}
                        className={`p-2.5 rounded-xl border ${borderStyle} transition space-y-1.5`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] opacity-80">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">{log.timestamp}</span>
                            <span className={`px-1.5 py-0.2 uppercase text-[9px] font-extrabold rounded border ${badgeBg}`}>
                              {log.category}
                            </span>
                            <span className="uppercase text-[9px] opacity-70">
                              {log.type}
                            </span>
                          </div>
                        </div>

                        <pre className="whitespace-pre-wrap break-words text-[11px] font-mono leading-relaxed">
                          {log.message}
                        </pre>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
