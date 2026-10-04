import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Code, X, Search, ChevronRight, Sparkles, CheckCircle2, 
  Layers, Lightbulb, AlertTriangle, ArrowRight, Eye, Lock 
} from 'lucide-react';
import { Lesson, Module } from '../data/curriculum';
import { LESSON_CONCEPTS, TeachingConcept } from '../data/lessonConcepts';
import { PATHS_METADATA, getPathModules, getAllLessonsGlobally, isLessonQuizUnlockedForUser } from '../data/learningPaths';
import LessonConceptBriefing from './LessonConceptBriefing';

interface CurriculumHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: Lesson, mode: 'briefing' | 'exercises') => void;
  completedLessons: string[];
  activePathId?: string;
  subscriptionTier?: string;
  unlockedAdvancedPathId?: string | null;
  unlockedAdvancedPathIds?: string[] | null;
  onOpenSubscription?: () => void;
  onUnlockAdvanceTrack?: (pathId: string) => void;
}

export default function CurriculumHandbookModal({
  isOpen,
  onClose,
  onSelectLesson,
  completedLessons,
  activePathId = 'web-dev',
  subscriptionTier = 'basic',
  unlockedAdvancedPathId,
  unlockedAdvancedPathIds,
  onOpenSubscription,
  onUnlockAdvanceTrack
}: CurriculumHandbookModalProps) {
  const [selectedPathId, setSelectedPathId] = useState<string>(activePathId);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync selectedPathId when activePathId prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPathId(activePathId);
      const modules = getPathModules(activePathId);
      if (modules.length > 0) {
        setSelectedModuleId(modules[0].id);
        if (modules[0].lessons.length > 0) {
          setSelectedLessonId(modules[0].lessons[0].id);
        }
      }
    }
  }, [isOpen, activePathId]);

  // When selectedPathId changes, reset module and lesson
  const handlePathChange = (newPathId: string) => {
    setSelectedPathId(newPathId);
    setSearchQuery('');
    const modules = getPathModules(newPathId);
    if (modules.length > 0) {
      setSelectedModuleId(modules[0].id);
      if (modules[0].lessons.length > 0) {
        setSelectedLessonId(modules[0].lessons[0].id);
      }
    }
  };

  if (!isOpen) return null;

  const currentModules = getPathModules(selectedPathId);
  const pathLessons = currentModules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title, moduleId: m.id })));
  
  const allGlobalLessons = getAllLessonsGlobally().map(l => ({ ...l, moduleTitle: '', moduleId: '' }));

  const filteredLessons = searchQuery.trim()
    ? allGlobalLessons.filter(l => 
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const currentModule = currentModules.find(m => m.id === selectedModuleId) || currentModules[0];
  const activeLesson = (filteredLessons ? filteredLessons.find(l => l.id === selectedLessonId) : null)
    || pathLessons.find(l => l.id === selectedLessonId)
    || (currentModule ? currentModule.lessons[0] : pathLessons[0]);

  const activeConcept: TeachingConcept | undefined = activeLesson ? LESSON_CONCEPTS[activeLesson.id] : undefined;

  const quizUnlockStatus = activeLesson ? isLessonQuizUnlockedForUser(
    activeLesson.id,
    completedLessons,
    subscriptionTier,
    unlockedAdvancedPathId,
    unlockedAdvancedPathIds
  ) : { unlocked: true };

  const handleStartQuizClick = (lesson: Lesson) => {
    const status = isLessonQuizUnlockedForUser(
      lesson.id,
      completedLessons,
      subscriptionTier,
      unlockedAdvancedPathId,
      unlockedAdvancedPathIds
    );

    if (!status.unlocked) {
      if (status.reason === 'advance_locked') {
        if (subscriptionTier === 'student_plus' && onUnlockAdvanceTrack) {
          onClose();
          onUnlockAdvanceTrack(selectedPathId);
        } else if (onOpenSubscription) {
          onClose();
          onOpenSubscription();
        } else {
          alert('🔒 Advance Track Locked: Upgrade your plan or select this track as your StudentPlus path to attempt quizzes!');
        }
      } else {
        alert('🔒 Quiz Sequentially Locked: Complete preceding topics in this track first to unlock this quiz!');
      }
      return;
    }

    onClose();
    onSelectLesson(lesson, 'exercises');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#0C0D14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left text-white">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#0E101A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">Curriculum Theory & Code Handbook</h2>
                <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/30 hidden sm:inline">
                  {allGlobalLessons.length} Topics Across 6 Tracks
                </span>
              </div>
              <p className="text-white/50 text-xs">Browse complete lesson guides, code cheat sheets, and live previews</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search all 78 topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close handbook"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Learning Track Selector Strip */}
        <div className="px-4 py-2.5 bg-[#0A0B10] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider whitespace-nowrap pl-1 pr-2">
            Select Track:
          </span>
          {PATHS_METADATA.map((p) => {
            const isSelected = selectedPathId === p.id && !searchQuery;
            return (
              <button
                key={p.id}
                onClick={() => handlePathChange(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-black shadow-md font-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
                }`}
              >
                <span>{p.iconEmoji}</span>
                <span>{p.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body: Sidebar + Main Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <aside className="w-full sm:w-72 md:w-80 border-r border-white/10 bg-[#0A0B10] flex flex-col shrink-0">
            {/* Module Picker Tabs (when not searching) */}
            {!searchQuery && currentModules.length > 0 && (
              <div className="flex border-b border-white/10 bg-[#0C0D14] p-1.5 gap-1 overflow-x-auto">
                {currentModules.map((m, idx) => {
                  const isSelected = selectedModuleId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModuleId(m.id);
                        if (m.lessons.length > 0) {
                          setSelectedLessonId(m.lessons[0].id);
                        }
                      }}
                      className={`flex-1 py-1.5 px-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-white/15 text-white shadow-sm border border-white/20'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Mod {idx + 1}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {(filteredLessons || (currentModule ? currentModule.lessons : [])).map(lesson => {
                const isCurrent = activeLesson && lesson.id === activeLesson.id;
                const isDone = completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                      isCurrent
                        ? 'bg-sky-500/15 border border-sky-400/30 text-white shadow-sm'
                        : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isCurrent ? 'text-sky-400' : 'text-white/40'}`}>
                          {lesson.id}
                        </span>
                        {isDone && (
                          <span className="text-[10px] text-emerald-400 flex items-center">
                            <CheckCircle2 size={11} />
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold truncate leading-snug">{lesson.title}</h4>
                    </div>

                    <ChevronRight size={14} className={`shrink-0 transition-transform ${isCurrent ? 'text-sky-400 translate-x-0.5' : 'text-white/30 group-hover:text-white/60'}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Viewer: Concept Briefing & Actions */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0A0A0B]">
            {activeLesson ? (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Action Banner to Start this Lesson directly */}
                <div className="bg-gradient-to-r from-sky-500/20 via-blue-600/15 to-indigo-600/20 border border-sky-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider block">
                      Ready to practice this topic?
                    </span>
                    <h3 className="text-base font-black text-white">{activeLesson.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectLesson(activeLesson, 'briefing');
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Lesson Guide
                    </button>
                    <button
                      onClick={() => handleStartQuizClick(activeLesson)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 ${
                        !quizUnlockStatus.unlocked
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      {!quizUnlockStatus.unlocked && <Lock size={13} />}
                      <span>{!quizUnlockStatus.unlocked ? 'Quiz Locked' : 'Start Quiz'}</span>
                      {quizUnlockStatus.unlocked && <ArrowRight size={14} />}
                    </button>
                  </div>
                </div>

                {/* Lesson Concept Briefing Display */}
                {activeConcept ? (
                  <LessonConceptBriefing
                    lessonTitle={activeLesson.title}
                    concept={activeConcept}
                    onStartExercises={() => handleStartQuizClick(activeLesson)}
                  />
                ) : (
                  <div className="p-8 text-center text-white/50 text-xs">
                    Concept information loading...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-white/40">
                Select a topic from the left sidebar to view its theory guide.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
