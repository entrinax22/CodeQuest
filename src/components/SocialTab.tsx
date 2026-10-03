import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, UserCheck, Zap, Trophy, MessageSquare, 
  Flame, Send, Sparkles, Heart, Share2, CheckCircle2, Edit3, Trash2, X, Check,
  Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';
import { sounds } from '../lib/sound';

interface Profile {
  id: string;
  username: string;
  xp: number;
  streak: number;
  is_following?: boolean;
}

interface FeedPost {
  id: string;
  author: string;
  content: string;
  time: string;
  tag: string;
  tagStyle: string;
  avatarBg: string;
  cheers: number;
  cheeredByMe?: boolean;
}

const INITIAL_FEED: FeedPost[] = [
  {
    id: '1',
    author: 'Alex Chen',
    content: 'Just deployed my first full-stack Node.js & PostgreSQL API! CodeQuest backend lessons really paid off. 🚀',
    time: '2h ago',
    tag: '⚡ Backend Dev',
    tagStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    avatarBg: 'from-amber-400 to-orange-500',
    cheers: 14,
    cheeredByMe: false
  },
  {
    id: '2',
    author: 'Sarah Kim',
    content: 'Hit a 7-day coding streak today! Consistency is key. 🔥 Who else is grinding today?',
    time: '4h ago',
    tag: '🔥 7d Streak',
    tagStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    avatarBg: 'from-sky-400 to-blue-600',
    cheers: 22,
    cheeredByMe: true
  },
  {
    id: '3',
    author: 'Jordan Taylor',
    content: 'Mastered C++ pointers and memory management. RAII is such an elegant idiom!',
    time: '1d ago',
    tag: '⚡ C++ Systems',
    tagStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    avatarBg: 'from-yellow-400 to-amber-600',
    cheers: 9,
    cheeredByMe: false
  }
];

export default function SocialTab() {
  const { username, streak, xp } = useGameStore();
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Feed State & Filtering
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    const saved = localStorage.getItem('codequest_social_posts');
    return saved ? JSON.parse(saved) : INITIAL_FEED;
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [feedTab, setFeedTab] = useState<'global' | 'friends' | 'achievements'>('global');

  // Edit Post State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    supabase?.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user.id);
        fetchFollowing(user.id);
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('codequest_social_posts', JSON.stringify(posts));
  }, [posts]);

  const fetchFollowing = async (userId: string) => {
    if (!supabase) return;
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (follows && follows.length > 0) {
      const ids = follows.map(f => f.following_id);
      const { data: friendProfiles } = await supabase
        .from('profiles')
        .select('id, username, xp, streak')
        .in('id', ids);

      if (friendProfiles) {
        setFollowingProfiles(friendProfiles.map(p => ({ ...p, is_following: true })));
      }
    }
  };

  const handleSearch = async () => {
    if (!search.trim() || !supabase) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, xp, streak')
      .ilike('username', `%${search}%`)
      .neq('id', currentUser)
      .limit(10);

    if (!error && data) {
      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUser);
      
      const followingIds = new Set(follows?.map(f => f.following_id));
      
      setProfiles(data.map(p => ({
        ...p,
        is_following: followingIds.has(p.id)
      })));
    }
    setLoading(false);
  };

  const toggleFollow = async (targetProfile: Profile) => {
    if (!supabase || !currentUser) return;
    sounds.playCorrect();

    const isFollowing = targetProfile.is_following;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser)
        .eq('following_id', targetProfile.id);

      setFollowingProfiles(followingProfiles.filter(f => f.id !== targetProfile.id));
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: currentUser, following_id: targetProfile.id });

      setFollowingProfiles([...followingProfiles, { ...targetProfile, is_following: true }]);
    }

    setProfiles(profiles.map(p => 
      p.id === targetProfile.id ? { ...p, is_following: !isFollowing } : p
    ));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    sounds.playCorrect();

    const post: FeedPost = {
      id: Date.now().toString(),
      author: username || 'Developer',
      content: newPostContent.trim(),
      time: 'Just now',
      tag: '💬 Status Update',
      tagStyle: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      avatarBg: 'from-sky-400 to-indigo-600',
      cheers: 1,
      cheeredByMe: true
    };

    setPosts([post, ...posts]);
    setNewPostContent('');
  };

  const handleSaveEdit = (postId: string) => {
    if (!editContent.trim()) return;
    sounds.playCorrect();
    setPosts(posts.map(p => p.id === postId ? { ...p, content: editContent.trim() } : p));
    setEditingPostId(null);
    setEditContent('');
  };

  const handleDeletePost = (postId: string) => {
    sounds.playCorrect();
    setPosts(posts.filter(p => p.id !== postId));
  };

  const toggleCheer = (postId: string) => {
    sounds.playCorrect();
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const cheered = !p.cheeredByMe;
        return {
          ...p,
          cheeredByMe: cheered,
          cheers: cheered ? p.cheers + 1 : p.cheers - 1
        };
      }
      return p;
    }));
  };

  // Filtered posts for Global Student Feed
  const friendUsernames = new Set(followingProfiles.map(f => f.username));
  friendUsernames.add(username || 'Developer');

  const filteredPosts = posts.filter(post => {
    if (feedTab === 'friends') {
      return friendUsernames.has(post.author);
    }
    if (feedTab === 'achievements') {
      return post.tag.includes('Streak') || post.tag.includes('Dev') || post.tag.includes('Systems');
    }
    return true; // global
  });

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto py-6 sm:py-8 px-2 sm:px-4 pb-28 text-left space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Social Dashboard Header */}
      <div className="bg-gradient-to-r from-sky-500/20 via-indigo-600/15 to-purple-600/20 border border-sky-500/30 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
              Global Student Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white tracking-tight">Community & Study Buddies</h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl">
              Connect with peers, track daily streaks, and share progress updates in real time!
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
              <Flame size={14} className="fill-amber-400" />
              <span>{streak} Day Streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* Responsive 2-Column Grid on Large Screens, Stacking on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols on desktop): Find & Add Friends + Friends List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Friend & Search Section */}
          <div className="bg-[#14151C] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <UserPlus size={18} className="text-sky-400" />
                <span>Find Study Buddies</span>
              </h3>
              <span className="text-xs text-white/40">Username</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                placeholder="Type username..."
                value={search || ''}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-24 focus:outline-none focus:border-sky-500 transition-all text-xs sm:text-sm text-white placeholder:text-white/30"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {profiles.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-white/10 max-h-60 overflow-y-auto">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Search Results</span>
                {profiles.map((profile) => (
                  <div key={profile.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow shrink-0">
                        {profile.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-white text-xs truncate">{profile.username || 'Student'}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold mt-0.5 text-amber-400">
                          <span className="flex items-center gap-0.5">
                            <Flame size={10} className="fill-amber-400" /> {profile.streak}d
                          </span>
                          <span className="text-yellow-300 flex items-center gap-0.5">
                            <Zap size={10} className="fill-yellow-300" /> {profile.xp}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollow(profile)}
                      className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                        profile.is_following 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                      }`}
                    >
                      {profile.is_following ? (
                        <>
                          <UserCheck size={12} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={12} />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friends List & Streaks Section */}
          <div className="bg-[#14151C] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                <span>Friends & Daily Streaks</span>
              </h3>
              <span className="text-xs text-sky-400 font-bold">{followingProfiles.length} Buddies</span>
            </div>

            {followingProfiles.length > 0 ? (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {followingProfiles.map((friend) => (
                  <div key={friend.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center font-black text-black text-sm shadow shrink-0">
                        {friend.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-white text-xs sm:text-sm truncate">{friend.username}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.2 rounded-full flex items-center gap-1">
                            <Flame size={10} className="fill-amber-400" />
                            <span>{friend.streak} Day Streak</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-white/40 text-xs font-medium mb-1">No study buddies added yet</p>
                <p className="text-white/30 text-[11px]">Search above to follow other students.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols on desktop): Global Student Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-sky-400" />
              <span>Feed & Activity</span>
            </h3>

            {/* Feed Filter Tabs */}
            <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl shrink-0">
              <button
                onClick={() => setFeedTab('global')}
                className={`px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  feedTab === 'global' ? 'bg-sky-500 text-black shadow-sm' : 'text-white/50 hover:text-white'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setFeedTab('friends')}
                className={`px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  feedTab === 'friends' ? 'bg-sky-500 text-black shadow-sm' : 'text-white/50 hover:text-white'
                }`}
              >
                Friends
              </button>
              <button
                onClick={() => setFeedTab('achievements')}
                className={`px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  feedTab === 'achievements' ? 'bg-sky-500 text-black shadow-sm' : 'text-white/50 hover:text-white'
                }`}
              >
                Milestones
              </button>
            </div>
          </div>

          {/* Post Creator Box */}
          <form onSubmit={handleCreatePost} className="bg-[#14151C] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow shrink-0 mt-0.5">
                {username?.[0]?.toUpperCase() || 'U'}
              </div>
              <textarea
                placeholder="What are you coding today? Share a milestone or question..."
                value={newPostContent || ''}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 focus:outline-none focus:border-sky-500 transition-all text-xs sm:text-sm text-white placeholder:text-white/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] text-white/40 font-medium hidden sm:inline">Broadcasts to all CodeQuest students</span>
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className={`ml-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                  newPostContent.trim()
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <Send size={13} />
                <span>Post Update</span>
              </button>
            </div>
          </form>

          {/* Feed Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isMine = post.author === (username || 'Developer');
              const isEditing = editingPostId === post.id;

              return (
                <div key={post.id} className="bg-[#14151C] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr ${post.avatarBg} flex items-center justify-center font-black text-black text-base shadow shrink-0`}>
                        {post.author[0]}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-white text-sm truncate">{post.author}</h4>
                          {isMine && (
                            <span className="text-[9px] font-black uppercase text-sky-400 bg-sky-500/20 px-2 py-0.2 rounded-full border border-sky-500/30 shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-white/40">{post.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${post.tagStyle}`}>
                        {post.tag}
                      </span>

                      {/* Edit & Remove controls for user's own posts */}
                      {isMine && !isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingPostId(post.id);
                              setEditContent(post.content);
                            }}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
                            title="Edit post"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer"
                            title="Remove post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content or Inline Editor */}
                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editContent || ''}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                        className="w-full bg-white/5 border border-sky-500/50 rounded-2xl p-3 text-sm text-white focus:outline-none resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <X size={13} />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={() => handleSaveEdit(post.id)}
                          className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shadow"
                        >
                          <Check size={13} />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/90 text-sm leading-relaxed font-normal">
                      {post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <button
                      onClick={() => toggleCheer(post.id)}
                      className={`px-3.5 py-1.5 sm:py-2 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        post.cheeredByMe
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-white/60 border border-white/10'
                      }`}
                    >
                      <Heart size={14} className={post.cheeredByMe ? 'fill-rose-400 text-rose-400' : ''} />
                      <span>{post.cheeredByMe ? 'Cheered' : 'Cheer'} ({post.cheers})</span>
                    </button>

                    <button 
                      onClick={() => sounds.playCorrect()}
                      className="text-white/40 hover:text-white/70 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Share2 size={13} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredPosts.length === 0 && (
              <div className="text-center py-10 bg-[#14151C] border border-white/10 rounded-3xl text-white/40 text-xs">
                No posts found in this view. Be the first to share an update!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
