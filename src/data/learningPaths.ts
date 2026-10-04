import { CURRICULUM, Module, Lesson } from './curriculum';
import { PYTHON_MODULES } from './paths/pythonCurriculum';
import { JAVA_MODULES } from './paths/javaCurriculum';
import { CPP_MODULES } from './paths/cppCurriculum';
import { BACKEND_MODULES } from './paths/backendCurriculum';
import { DEVOPS_MODULES } from './paths/devopsCurriculum';

export interface PathMeta {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  iconEmoji: string;
  badge: string;
  tag: string;
  isAdvancedTrack?: boolean;
  colorTheme: {
    gradient: string;
    border: string;
    badge: string;
    accent: string;
    bar: string;
  };
}

export const PATHS_METADATA: PathMeta[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    shortTitle: 'Web Dev',
    subtitle: 'Full-Stack React & Server Track',
    description: 'Master HTML5 markup, CSS3 layouts, PHP backend, React state, and Next.js App Router.',
    iconEmoji: '🌐',
    badge: '5 Modules • 35 Lessons',
    tag: 'Web Full-Stack',
    isAdvancedTrack: false,
    colorTheme: {
      gradient: 'from-sky-500/20 via-blue-600/10 to-indigo-950/40',
      border: 'border-sky-500/30',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
      accent: 'text-sky-400',
      bar: 'from-sky-400 to-blue-500'
    }
  },
  {
    id: 'python',
    title: 'Python Mastery',
    shortTitle: 'Python',
    subtitle: 'OOP, AsyncIO & AI Data Science',
    description: 'Learn dynamic typing, lists, OOP, decorators, AsyncIO pipelines, NumPy vectorization, and Pandas.',
    iconEmoji: '🐍',
    badge: '5 Modules • 16 Lessons',
    tag: 'Python & AI',
    isAdvancedTrack: false,
    colorTheme: {
      gradient: 'from-amber-500/20 via-yellow-600/10 to-amber-950/40',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      accent: 'text-amber-400',
      bar: 'from-amber-400 to-yellow-500'
    }
  },
  {
    id: 'java',
    title: 'Java Programming',
    shortTitle: 'Java',
    subtitle: 'Core OOP, Threads & Spring Boot',
    description: 'Master static typing, OOP inheritance, multithreading, concurrency, and Spring Boot microservices.',
    iconEmoji: '☕',
    badge: '5 Modules • 16 Lessons',
    tag: 'Java Enterprise',
    isAdvancedTrack: true,
    colorTheme: {
      gradient: 'from-orange-500/20 via-red-600/10 to-orange-950/40',
      border: 'border-orange-500/30',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      accent: 'text-orange-400',
      bar: 'from-orange-400 to-red-500'
    }
  },
  {
    id: 'cpp',
    title: 'C++ Systems & Memory',
    subtitle: 'Modern C++20, RAII & High Perf',
    shortTitle: 'C++',
    description: 'Understand pointers, memory management, smart pointers, move semantics, and cache-friendly systems.',
    iconEmoji: '⚡',
    badge: '5 Modules • 16 Lessons',
    tag: 'C++ Systems',
    isAdvancedTrack: true,
    colorTheme: {
      gradient: 'from-blue-500/20 via-indigo-600/10 to-blue-950/40',
      border: 'border-blue-500/30',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      accent: 'text-blue-400',
      bar: 'from-blue-400 to-indigo-500'
    }
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    shortTitle: 'Backend',
    subtitle: 'REST, PostgreSQL & Distributed Redis',
    description: 'Build REST APIs, master relational SQL queries, JWT auth, Redis caching, and Kafka message brokers.',
    iconEmoji: '🗄️',
    badge: '5 Modules • 15 Lessons',
    tag: 'Backend Architect',
    isAdvancedTrack: true,
    colorTheme: {
      gradient: 'from-emerald-500/20 via-teal-600/10 to-green-950/40',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      accent: 'text-emerald-400',
      bar: 'from-emerald-400 to-teal-500'
    }
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    shortTitle: 'DevOps',
    subtitle: 'Docker, Kubernetes & Terraform',
    description: 'Learn Linux CLI, Docker containers, CI/CD pipelines, Kubernetes Helm fleets, and Terraform Cloud IaC.',
    iconEmoji: '☁️',
    badge: '5 Modules • 15 Lessons',
    tag: 'Cloud & Kubernetes',
    isAdvancedTrack: true,
    colorTheme: {
      gradient: 'from-purple-500/20 via-pink-600/10 to-purple-950/40',
      border: 'border-purple-500/30',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      accent: 'text-purple-400',
      bar: 'from-purple-400 to-pink-500'
    }
  }
];

export const PATH_MODULES_MAP: Record<string, Module[]> = {
  'web-dev': CURRICULUM,
  'python': PYTHON_MODULES,
  'java': JAVA_MODULES,
  'cpp': CPP_MODULES,
  'backend': BACKEND_MODULES,
  'devops': DEVOPS_MODULES
};

export function isPathUnlockedForUser(
  _pathId: string, 
  _subscriptionTier?: string, 
  _unlockedAdvancedPathId?: string | null,
  _unlockedAdvancedPathIds?: string[] | null
): boolean {
  // All learning paths are 100% open for all users to explore and learn core modules
  return true;
}

export function isPathAdvanceUnlockedForUser(
  pathId: string, 
  subscriptionTier: string, 
  unlockedAdvancedPathId?: string | null,
  unlockedAdvancedPathIds?: string[] | null
): boolean {
  const meta = getPathMeta(pathId);
  if (!meta.isAdvancedTrack) return true;
  if (subscriptionTier === 'pro') return true;
  if (subscriptionTier === 'student_plus') {
    const list = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 
      ? unlockedAdvancedPathIds 
      : [unlockedAdvancedPathId || 'web-dev'];
    return list.includes(pathId);
  }
  return false;
}

export function isModuleUnlockedForUser(
  pathId: string,
  module: Module,
  subscriptionTier: string,
  unlockedAdvancedPathId?: string | null,
  unlockedAdvancedPathIds?: string[] | null
): boolean {
  // If it's a core module, everyone has access
  if (!module.isAdvanced) return true;

  // PRO tier unlocks ALL advance modules across ALL paths
  if (subscriptionTier === 'pro') return true;

  // StudentPlus unlocks advance modules for their unlocked learning paths
  if (subscriptionTier === 'student_plus') {
    const unlockedList = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 
      ? unlockedAdvancedPathIds 
      : [unlockedAdvancedPathId || 'web-dev'];
    return unlockedList.includes(pathId);
  }

  // Basic / Free tier: advance modules are locked
  return false;
}

export function getPathModules(pathId: string): Module[] {
  return PATH_MODULES_MAP[pathId] || CURRICULUM;
}

export function getPathMeta(pathId: string): PathMeta {
  return PATHS_METADATA.find(p => p.id === pathId) || PATHS_METADATA[0];
}

export function getAllLessonsForPath(pathId: string): Lesson[] {
  const modules = getPathModules(pathId);
  return modules.flatMap(m => m.lessons);
}

export function getAllLessonsGlobally(): Lesson[] {
  const allModules = Object.values(PATH_MODULES_MAP).flat();
  const seen = new Set<string>();
  const results: Lesson[] = [];
  for (const m of allModules) {
    for (const l of m.lessons) {
      if (!seen.has(l.id)) {
        seen.add(l.id);
        results.push(l);
      }
    }
  }
  return results;
}
