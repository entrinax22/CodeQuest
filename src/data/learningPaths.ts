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
      gradient: 'from-sky-50 via-blue-50/50 to-sky-100/80',
      border: 'border-sky-200/80',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      accent: 'text-sky-600 font-bold',
      bar: 'from-sky-500 to-blue-600'
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
      gradient: 'from-amber-50 via-yellow-50/50 to-amber-100/80',
      border: 'border-amber-200/80',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      accent: 'text-amber-600 font-bold',
      bar: 'from-amber-500 to-yellow-500'
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
      gradient: 'from-orange-50 via-red-50/50 to-orange-100/80',
      border: 'border-orange-200/80',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      accent: 'text-orange-600 font-bold',
      bar: 'from-orange-500 to-red-500'
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
      gradient: 'from-blue-50 via-indigo-50/50 to-blue-100/80',
      border: 'border-blue-200/80',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      accent: 'text-blue-600 font-bold',
      bar: 'from-blue-500 to-indigo-600'
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
      gradient: 'from-emerald-50 via-teal-50/50 to-emerald-100/80',
      border: 'border-emerald-200/80',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      accent: 'text-emerald-600 font-bold',
      bar: 'from-emerald-500 to-teal-600'
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
      gradient: 'from-purple-50 via-pink-50/50 to-purple-100/80',
      border: 'border-purple-200/80',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      accent: 'text-purple-600 font-bold',
      bar: 'from-purple-500 to-pink-600'
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

  // Core tracks (web-dev and python) have their advanced modules free for everyone
  const meta = getPathMeta(pathId);
  if (meta && !meta.isAdvancedTrack) return true;

  // Otherwise, check if the path is in the user's unlocked list (StudentPlus choices or basic defaults)
  const list = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 
    ? unlockedAdvancedPathIds 
    : [unlockedAdvancedPathId || 'web-dev'];
  
  if (list.includes(pathId)) {
    return true;
  }

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

export function findModuleAndPathForLesson(lessonId: string): { pathId: string; module: Module | null } {
  for (const [pathId, modules] of Object.entries(PATH_MODULES_MAP)) {
    for (const mod of modules) {
      if (mod.lessons.some(l => l.id === lessonId)) {
        return { pathId, module: mod };
      }
    }
  }
  return { pathId: 'web-dev', module: null };
}

export function isLessonQuizUnlockedForUser(
  lessonId: string,
  completedLessons: string[],
  subscriptionTier: string,
  unlockedAdvancedPathId?: string | null,
  unlockedAdvancedPathIds?: string[] | null
): { unlocked: boolean; reason?: 'advance_locked' | 'sequence_locked' } {
  const { pathId, module } = findModuleAndPathForLesson(lessonId);

  // 1. Check if module is advance locked
  if (module && module.isAdvanced) {
    const isAdvanceUnlocked = isModuleUnlockedForUser(pathId, module, subscriptionTier, unlockedAdvancedPathId, unlockedAdvancedPathIds);
    if (!isAdvanceUnlocked) {
      return { unlocked: false, reason: 'advance_locked' };
    }
  }

  // 2. Check sequential progression in that path
  const pathLessons = getAllLessonsForPath(pathId);
  const lessonIdx = pathLessons.findIndex(l => l.id === lessonId);
  if (lessonIdx > 0) {
    if (completedLessons.includes(lessonId)) {
      return { unlocked: true };
    }
    const activeIdx = pathLessons.findIndex(l => !completedLessons.includes(l.id));
    if (activeIdx !== -1 && lessonIdx > activeIdx) {
      return { unlocked: false, reason: 'sequence_locked' };
    }
  }

  return { unlocked: true };
}
