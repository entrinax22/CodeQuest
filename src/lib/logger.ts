export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'log' | 'info' | 'warn' | 'error';
  category: 'all' | 'supabase' | 'subscription' | 'auth' | 'game' | 'general';
  message: string;
}

type LogListener = (logs: LogEntry[]) => void;

class LoggerService {
  private logs: LogEntry[] = [];
  private listeners: Set<LogListener> = new Set();
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const formatMessage = (args: any[]): string => {
      return args
        .map(a => {
          if (typeof a === 'object' && a !== null) {
            try {
              return JSON.stringify(a, null, 2);
            } catch {
              return String(a);
            }
          }
          return String(a);
        })
        .join(' ');
    };

    const detectCategory = (msg: string): LogEntry['category'] => {
      const lower = msg.toLowerCase();
      if (lower.includes('supabase') || lower.includes('postgres') || lower.includes('profiles') || lower.includes('payment_approvals')) return 'supabase';
      if (lower.includes('subscription') || lower.includes('is_pro') || lower.includes('tier') || lower.includes('gcash') || lower.includes('maya')) return 'subscription';
      if (lower.includes('auth') || lower.includes('user') || lower.includes('session') || lower.includes('login')) return 'auth';
      if (lower.includes('xp') || lower.includes('lesson') || lower.includes('heart') || lower.includes('streak')) return 'game';
      return 'general';
    };

    const addLog = (type: LogEntry['type'], args: any[]) => {
      const msg = formatMessage(args);
      const entry: LogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        category: detectCategory(msg),
        message: msg
      };
      this.logs = [entry, ...this.logs].slice(0, 250);
      this.notify();
    };

    console.log = (...args: any[]) => {
      originalLog.apply(console, args);
      addLog('log', args);
    };

    console.info = (...args: any[]) => {
      originalInfo.apply(console, args);
      addLog('info', args);
    };

    console.warn = (...args: any[]) => {
      originalWarn.apply(console, args);
      addLog('warn', args);
    };

    console.error = (...args: any[]) => {
      originalError.apply(console, args);
      addLog('error', args);
    };

    addLog('info', ['[CodeQuest Console Debugger] Live logging initialized 🚀']);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  subscribe(listener: LogListener) {
    this.listeners.add(listener);
    listener(this.logs);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.logs));
  }
}

export const logger = new LoggerService();
