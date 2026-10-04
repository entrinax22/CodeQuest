import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, UserCheck, Zap, Trophy, MessageSquare, 
  Flame, Send, Sparkles, Heart, Share2, Edit3, Trash2, X, Check,
  Users, Code, ThumbsUp, MoreHorizontal, User, Shield, Terminal,
  Bookmark, Activity, Layers, ArrowRight, CornerDownRight, Sparkle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';
import { sounds } from '../lib/sound';
import PullToRefresh from './PullToRefresh';

interface Profile {
  id: string;
  username: string;
  xp: number;
  streak: number;
  is_following?: boolean;
  level?: number;
  career_goal?: string;
  bio?: string;
  league_id?: string;
}

interface ProfileModalData extends Profile {
  leagueName?: string;
  leagueRank?: number;
  totalStudents?: number;
}

interface PostComment {
  id: string;
  author: string;
  content: string;
  time: string;
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
  comments?: PostComment[];
}

export default function SocialTab() {
  const { username, streak, xp, level, leagueId } = useGameStore();
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<Profile[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // View User Profile Modal State
  const [selectedUserProfile, setSelectedUserProfile] = useState<ProfileModalData | null>(null);
  const [profileModalLoading, setProfileModalLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<FeedPost[]>([]);
  const [userPostsLoading, setUserPostsLoading] = useState(false);

  // Feed State & Commenting
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    const saved = localStorage.getItem('codequest_social_posts');
    if (!saved) return [];
    try {
      const parsed: FeedPost[] = JSON.parse(saved);
      return parsed.filter(p => p.author !== 'Alex Chen' && p.author !== 'Sarah Kim' && p.author !== 'Marcus Vance' && p.author !== 'Dev_Guru');
    } catch {
      return [];
    }
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('💬 Status Update');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  // Edit & Delete Post State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Share Post Menu state
  const [activeSharePostId, setActiveSharePostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleCopyLink = (post: FeedPost) => {
    sounds.playCorrect();
    const shareUrl = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedPostId(post.id);
      setTimeout(() => {
        setCopiedPostId(null);
        setActiveSharePostId(null);
      }, 1500);
    });
  };

  useEffect(() => {
    supabase?.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user.id);
        fetchFollowing(user.id);
        fetchSuggestedProfiles(user.id);
      } else {
        fetchSuggestedProfiles(null);
      }
    });
  }, []);

  const fetchSuggestedProfiles = async (currentUserId: string | null) => {
    if (!supabase) return;
    try {
      let userXp = xp || 0;
      let userLeague = leagueId || 'bronze';

      if (currentUserId) {
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('xp, league_id, username')
          .eq('id', currentUserId)
          .maybeSingle();

        if (myProfile) {
          userXp = myProfile.xp || userXp;
          userLeague = (myProfile.league_id || userLeague).toLowerCase();
        }
      }

      const { data: dbProfiles } = await supabase
        .from('profiles')
        .select('id, username, xp, streak, level, career_goal, bio, league_id')
        .limit(50);

      if (dbProfiles && dbProfiles.length > 0) {
        const currentUsernameLower = (username || '').toLowerCase();
        const filtered = dbProfiles.filter(p => {
          if (currentUserId && p.id === currentUserId) return false;
          if (p.username && p.username.toLowerCase() === currentUsernameLower) return false;
          return true;
        });

        let followsSet = new Set<string>();
        if (currentUserId) {
          const { data: follows } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', currentUserId);
          if (follows) {
            followsSet = new Set(follows.map(f => f.following_id));
          }
        }

        const getLeagueFromXp = (pXp: number, pLeague?: string) => {
          if (pLeague && pLeague.trim()) return pLeague.toLowerCase();
          if (pXp >= 10000) return 'diamond';
          if (pXp >= 5000) return 'platinum';
          if (pXp >= 2500) return 'gold';
          if (pXp >= 1000) return 'silver';
          return 'bronze';
        };

        const scoredProfiles = filtered.map(p => {
          const pLeague = getLeagueFromXp(p.xp || 0, p.league_id);
          let matchScore = 2;
          if (pLeague === userLeague) {
            matchScore += 10;
          } else {
            const xpDiff = Math.abs((p.xp || 0) - userXp);
            if (xpDiff < 1500) matchScore += 6;
            else if (xpDiff < 3000) matchScore += 4;
          }
          const randomJitter = Math.random() * 8;
          return {
            profile: p,
            finalScore: matchScore + randomJitter
          };
        });

        scoredProfiles.sort((a, b) => b.finalScore - a.finalScore);

        setSuggestedProfiles(scoredProfiles.slice(0, 15).map(({ profile: p }) => ({
          id: p.id,
          username: p.username || `Student_${p.id.slice(0, 4)}`,
          xp: p.xp || 0,
          streak: p.streak || 1,
          level: p.level || Math.max(1, Math.floor((p.xp || 0) / 1000) + 1),
          career_goal: p.career_goal || 'Software Engineer',
          bio: p.bio || 'CodeQuest student mastering software engineering.',
          is_following: followsSet.has(p.id)
        })));
      } else {
        setSuggestedProfiles([]);
      }
    } catch (err) {
      console.error('Error fetching suggested profiles:', err);
      setSuggestedProfiles([]);
    }
  };

  useEffect(() => {
    fetchPostsFromDb();
  }, []);

  const fetchPostsFromDb = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const dbPosts: FeedPost[] = data
          .filter(item => item.author !== 'Alex Chen' && item.author !== 'Sarah Kim' && item.author !== 'Marcus Vance' && item.author !== 'Dev_Guru')
          .map(item => ({
            id: item.id?.toString() || Date.now().toString(),
            author: item.author || 'Student',
            content: item.content || '',
            time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            tag: item.tag || '💬 Status Update',
            tagStyle: item.tag_style || 'bg-sky-500/15 text-sky-300 border-sky-500/30',
            avatarBg: item.avatar_bg || 'from-sky-400 to-indigo-600',
            cheers: item.cheers || 1,
            cheeredByMe: item.cheered_by_me || false,
            comments: Array.isArray(item.comments) ? item.comments : []
          }));
        setPosts(dbPosts);
        localStorage.setItem('codequest_social_posts', JSON.stringify(dbPosts));
      }
    } catch {
      // Graceful fallback
    }
  };

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
        .select('id, username, xp, streak, level, career_goal, bio')
        .in('id', ids);

      if (friendProfiles) {
        setFollowingProfiles(friendProfiles.map(p => ({ ...p, is_following: true })));
      }
    }
  };

  const handleSearch = async (overrideQuery?: string) => {
    const rawQuery = (overrideQuery !== undefined ? overrideQuery : search).trim();
    const cleanQuery = rawQuery.replace(/^@/, '').trim().toLowerCase();
    
    if (!cleanQuery) {
      setProfiles([]);
      return;
    }

    setLoading(true);

    // 1. Instant local matching across suggested, following, post authors & current user
    const candidatesMap = new Map<string, Profile>();

    if (username && username.toLowerCase().includes(cleanQuery)) {
      candidatesMap.set('self_' + username, {
        id: currentUser || 'self',
        username: username,
        xp: xp || 0,
        streak: streak || 1,
        level: level || 1,
        career_goal: 'Your Account',
        bio: 'Current logged in student account.',
        is_following: false
      });
    }

    suggestedProfiles.forEach(s => {
      const uName = s.username.replace(/^@/, '').toLowerCase();
      if (uName.includes(cleanQuery) || (s.career_goal && s.career_goal.toLowerCase().includes(cleanQuery))) {
        candidatesMap.set(s.id, s);
      }
    });

    followingProfiles.forEach(f => {
      const uName = f.username.replace(/^@/, '').toLowerCase();
      if (uName.includes(cleanQuery) || (f.career_goal && f.career_goal.toLowerCase().includes(cleanQuery))) {
        candidatesMap.set(f.id, f);
      }
    });

    posts.forEach(p => {
      const uName = p.author.replace(/^@/, '').toLowerCase();
      if (uName.includes(cleanQuery)) {
        const pId = 'post_auth_' + p.author;
        if (!candidatesMap.has(pId)) {
          candidatesMap.set(pId, {
            id: pId,
            username: p.author,
            xp: 1250,
            streak: 3,
            level: 2,
            career_goal: 'Student Developer',
            bio: 'Active student contributor on CodeQuest.',
            is_following: followingProfiles.some(f => f.username.toLowerCase() === p.author.toLowerCase())
          });
        }
      }
    });

    // Display immediate local search results
    setProfiles(Array.from(candidatesMap.values()));

    // 2. Asynchronously query Supabase DB profiles across ALL leagues without restrictions
    if (supabase) {
      try {
        const safeQuery = cleanQuery.replace(/[^a-zA-Z0-9_\- ]/g, '');
        if (safeQuery) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, username, xp, streak, level, career_goal, bio, league_id')
            .or(`username.ilike.%${safeQuery}%,career_goal.ilike.%${safeQuery}%`)
            .limit(30);

          if (!error && data && data.length > 0) {
            let followingIds = new Set<string>();
            if (currentUser) {
              const { data: follows } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', currentUser);
              followingIds = new Set(follows?.map(f => f.following_id) || []);
            }

            data.forEach(p => {
              const uName = p.username || `Student_${p.id.slice(0, 4)}`;
              candidatesMap.set(p.id, {
                id: p.id,
                username: uName,
                xp: p.xp || 0,
                streak: p.streak || 1,
                level: p.level || Math.max(1, Math.floor((p.xp || 0) / 1000) + 1),
                career_goal: p.career_goal || 'Software Engineer',
                bio: p.bio || 'CodeQuest student mastering software engineering.',
                league_id: p.league_id,
                is_following: followingIds.has(p.id)
              });
            });

            setProfiles(Array.from(candidatesMap.values()));
          }
        }
      } catch (e) {
        console.error('Search query error:', e);
      }
    }

    setLoading(false);
  };

  const toggleFollow = async (targetProfile: Profile) => {
    if (!supabase || !currentUser) {
      sounds.playCorrect();
      const updated = !targetProfile.is_following;
      setSuggestedProfiles(suggestedProfiles.map(p => p.username === targetProfile.username ? { ...p, is_following: updated } : p));
      setProfiles(profiles.map(p => p.username === targetProfile.username ? { ...p, is_following: updated } : p));
      if (selectedUserProfile && selectedUserProfile.username === targetProfile.username) {
        setSelectedUserProfile({ ...selectedUserProfile, is_following: updated });
      }
      return;
    }
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
    setSuggestedProfiles(suggestedProfiles.map(p => 
      p.id === targetProfile.id ? { ...p, is_following: !isFollowing } : p
    ));
    if (selectedUserProfile && (selectedUserProfile.id === targetProfile.id || selectedUserProfile.username === targetProfile.username)) {
      setSelectedUserProfile({ ...selectedUserProfile, is_following: !isFollowing });
    }
  };

  const handleInspectUser = async (prof: Partial<Profile> & { username: string }) => {
    sounds.playClick();
    const isFollowing = followingProfiles.some(f => f.username?.toLowerCase() === prof.username.toLowerCase());
    
    // Set immediate initial data while fetching DB stats & posts
    const initialProfile: ProfileModalData = {
      id: prof.id || 'u_' + prof.username,
      username: prof.username,
      xp: prof.xp || 0,
      streak: prof.streak || 1,
      level: prof.level || Math.max(1, Math.floor((prof.xp || 0) / 1000) + 1),
      career_goal: prof.career_goal || 'Software Engineer',
      bio: prof.bio || 'CodeQuest student mastering software engineering.',
      leagueName: 'Bronze League',
      leagueRank: 1,
      totalStudents: 1,
      is_following: isFollowing
    };
    
    setSelectedUserProfile(initialProfile);
    setUserPosts([]);
    
    // Async fetch full profile stats & posts from database
    fetchFullUserProfile(prof);
  };

  const fetchFullUserProfile = async (prof: Partial<Profile> & { username: string }) => {
    setProfileModalLoading(true);
    setUserPostsLoading(true);
    try {
      let dbProf: any = null;
      if (supabase) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${prof.username}${prof.id ? `,id.eq.${prof.id}` : ''}`)
          .maybeSingle();
        dbProf = data;
      }

      // Calculate global ranking from DB profiles table
      let exactRank = 1;
      let totalStudents = 1;
      if (supabase) {
        const { data: allRanked } = await supabase
          .from('profiles')
          .select('id, username, xp')
          .order('xp', { ascending: false });

        if (allRanked && allRanked.length > 0) {
          totalStudents = allRanked.length;
          const targetIdx = allRanked.findIndex(p => 
            (dbProf && p.id === dbProf.id) || (p.username && p.username.toLowerCase() === prof.username.toLowerCase())
          );
          if (targetIdx !== -1) {
            exactRank = targetIdx + 1;
          } else {
            const targetXp = dbProf?.xp || prof.xp || 0;
            exactRank = allRanked.filter(p => (p.xp || 0) > targetXp).length + 1;
          }
        }
      }

      const finalXp = dbProf?.xp ?? prof.xp ?? 0;
      const finalStreak = dbProf?.streak ?? prof.streak ?? 1;
      const finalLevel = dbProf?.level ?? Math.max(1, Math.floor(finalXp / 1000) + 1);
      const finalGoal = dbProf?.career_goal || prof.career_goal || 'Software Engineer';
      const finalBio = dbProf?.bio || prof.bio || 'CodeQuest student mastering software engineering.';
      const finalLeagueId = dbProf?.league_id || prof.league_id;

      let leagueName = 'Bronze League';
      const lClean = (finalLeagueId || '').toLowerCase();
      if (lClean.includes('diamond') || finalXp >= 10000) leagueName = 'Diamond League';
      else if (lClean.includes('platinum') || finalXp >= 5000) leagueName = 'Platinum League';
      else if (lClean.includes('gold') || finalXp >= 2500) leagueName = 'Gold League';
      else if (lClean.includes('silver') || finalXp >= 1000) leagueName = 'Silver League';

      const isFollowing = followingProfiles.some(f => f.username?.toLowerCase() === prof.username.toLowerCase());

      const fullProfile: ProfileModalData = {
        id: dbProf?.id || prof.id || 'u_' + prof.username,
        username: dbProf?.username || prof.username,
        xp: finalXp,
        streak: finalStreak,
        level: finalLevel,
        career_goal: finalGoal,
        bio: finalBio,
        leagueName: leagueName,
        leagueRank: exactRank,
        totalStudents: totalStudents,
        is_following: isFollowing
      };

      setSelectedUserProfile(fullProfile);

      // Fetch all posts created by this target user
      await fetchUserPostsFromDb(dbProf?.username || prof.username);
    } catch (err) {
      console.error('Error fetching full user profile:', err);
    } finally {
      setProfileModalLoading(false);
    }
  };

  const fetchUserPostsFromDb = async (targetUsername: string) => {
    setUserPostsLoading(true);
    let userPostsList: FeedPost[] = [];
    if (supabase) {
      try {
        const { data: dbUserPosts } = await supabase
          .from('posts')
          .select('*')
          .ilike('author', targetUsername)
          .order('created_at', { ascending: false });

        if (dbUserPosts && dbUserPosts.length > 0) {
          userPostsList = dbUserPosts.map(item => ({
            id: item.id?.toString() || Date.now().toString(),
            author: item.author || targetUsername,
            content: item.content || '',
            time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            tag: item.tag || '💬 Status Update',
            tagStyle: item.tag_style || 'bg-sky-500/15 text-sky-300 border-sky-500/30',
            avatarBg: item.avatar_bg || 'from-sky-400 to-indigo-600',
            cheers: item.cheers || 1,
            cheeredByMe: item.cheered_by_me || false,
            comments: Array.isArray(item.comments) ? item.comments : []
          }));
        }
      } catch (err) {
        console.error('Error fetching user posts:', err);
      }
    }

    // Combine with posts in local state
    const localUserPosts = posts.filter(p => p.author.toLowerCase() === targetUsername.toLowerCase());

    const postMap = new Map<string, FeedPost>();
    userPostsList.forEach(p => postMap.set(p.id, p));
    localUserPosts.forEach(p => {
      if (!postMap.has(p.id)) postMap.set(p.id, p);
    });

    setUserPosts(Array.from(postMap.values()));
    setUserPostsLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    sounds.playCorrect();

    let style = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    if (selectedTag.includes('Backend')) style = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (selectedTag.includes('Streak')) style = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    if (selectedTag.includes('Project')) style = 'bg-purple-500/15 text-purple-300 border-purple-500/30';

    const post: FeedPost = {
      id: Date.now().toString(),
      author: username || 'Developer',
      content: newPostContent.trim(),
      time: 'Just now',
      tag: selectedTag,
      tagStyle: style,
      avatarBg: 'from-sky-400 via-indigo-500 to-blue-600',
      cheers: 1,
      cheeredByMe: true,
      comments: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPostContent('');

    if (supabase) {
      try {
        await supabase
          .from('posts')
          .insert([{
            author: post.author,
            content: post.content,
            tag: post.tag,
            tag_style: post.tagStyle,
            avatar_bg: post.avatarBg,
            cheers: 1,
            comments: []
          }]);
      } catch {
        // Fallback gracefully
      }
    }
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    sounds.playCorrect();
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        return {
          ...p,
          comments: [
            ...comments,
            {
              id: Date.now().toString(),
              author: username || 'You',
              content: commentInput.trim(),
              time: 'Just now'
            }
          ]
        };
      }
      return p;
    }));
    setCommentInput('');
  };

  const handleSaveEdit = (postId: string) => {
    if (!editContent.trim()) return;
    sounds.playCorrect();
    setPosts(posts.map(p => p.id === postId ? { ...p, content: editContent.trim() } : p));
    setEditingPostId(null);
    setEditContent('');
  };

  const handleDeletePost = (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
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

  const handleRefreshSocial = async () => {
    if (supabase) {
      if (currentUser) {
        await fetchFollowing(currentUser);
        await useGameStore.getState().syncWithSupabase(currentUser);
      }
      await fetchSuggestedProfiles(currentUser);
      await fetchPostsFromDb();
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefreshSocial} label="developer social feed">
      <div className="max-w-6xl mx-auto py-6 sm:py-8 px-3 sm:px-6 pb-28 text-left space-y-7 animate-in fade-in duration-300">
        
        {/* Modern Developer Network Hero Panel */}
        <div className="bg-[#0B0D14] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle ambient light glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-sky-400 font-semibold tracking-wider uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Student Network</span>
                <span className="text-white/20">·</span>
                <span className="text-white/60">Live Community Hub</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Student Social Feed
              </h2>
              <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
                Connect with fellow students, share daily learning achievements, showcase student projects, and ask study questions in real-time.
              </p>
            </div>

            {/* User Streak & Level Status Widget */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-xs">
                <Flame size={15} className="fill-amber-400 text-amber-400" />
                <span>{streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/15 border border-sky-500/30 rounded-xl text-sky-300 font-bold text-xs">
                <Zap size={15} className="fill-sky-400 text-sky-400" />
                <span>Level {level} · {xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Universal Top Search Bar Panel */}
        <div className="bg-[#0F111A] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Search size={16} className="text-sky-400" />
              <span>Search Student Directory</span>
            </h3>
            <span className="text-[11px] text-white/40">Instant Mobile Search</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Search by student handle or career goal..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sky-500 transition-all"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setProfiles([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Instant Search Results Stream */}
          {search.trim() && (
            <div className="pt-2 border-t border-white/10 space-y-2 max-h-72 overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                <span>Matching Students ({profiles.length})</span>
                <span>Tap card to view profile</span>
              </div>

              {profiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profiles.map((prof) => (
                    <div
                      key={prof.id}
                      onClick={() => handleInspectUser(prof)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {prof.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="truncate min-w-0">
                          <h4 className="font-bold text-white text-xs truncate group-hover:text-sky-300">
                            @{prof.username}
                          </h4>
                          <p className="text-[10px] text-white/50 truncate mt-0.5">
                            {prof.career_goal || `${prof.xp} XP`}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollow(prof);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0 ml-2 ${
                          prof.is_following
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow'
                        }`}
                      >
                        {prof.is_following ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/40">
                  {loading ? 'Searching students...' : `No student handles found matching "${search}"`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stories / Active Developers Circle Bar */}
        {suggestedProfiles.length > 0 && (
          <div className="bg-[#0F111A] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-white flex items-center gap-2">
                <Activity size={15} className="text-sky-400" />
                <span>Active Students</span>
              </span>
              <span className="text-white/40 text-[11px]">Tap avatar to view profile</span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
              {/* Current User Story Card */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-[#0F111A] flex items-center justify-center font-black text-white text-base">
                    {username?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
                <span className="text-[11px] font-medium text-sky-300 truncate max-w-[64px]">You</span>
              </div>

              {/* Suggested Developers Avatars */}
              {suggestedProfiles.map((sug) => (
                <div
                  key={sug.id}
                  onClick={() => handleInspectUser(sug)}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-400 p-0.5 shadow-md group-hover:scale-105 transition-transform relative">
                    <div className="w-full h-full rounded-[14px] bg-[#0F111A] flex items-center justify-center font-black text-white text-base">
                      {sug.username[0].toUpperCase()}
                    </div>
                    {sug.streak > 1 && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1 rounded-full flex items-center gap-0.5 shadow">
                        <Flame size={8} className="fill-black" />
                        <span>{sug.streak}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-white/70 group-hover:text-white truncate max-w-[68px]">
                    @{sug.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Main Feed Column (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Streamlined Post Composer Card */}
            <form onSubmit={handleCreatePost} className="bg-[#0F111A] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow shrink-0">
                  {username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 space-y-2">
                  <textarea
                    placeholder={`What are you learning today, @${username || 'Student'}?`}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={2}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sky-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Tag selector chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { tag: '💬 Status Update', style: 'bg-sky-500/20 text-sky-300' },
                  { tag: '⚡ Backend Dev', style: 'bg-emerald-500/20 text-emerald-300' },
                  { tag: '🔥 Streak Achievement', style: 'bg-amber-500/20 text-amber-300' },
                  { tag: '🚀 Project Launch', style: 'bg-purple-500/20 text-purple-300' }
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setSelectedTag(item.tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedTag === item.tag ? `${item.style} border border-sky-400/40 shadow-sm` : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    {item.tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                  <Terminal size={14} className="text-sky-400" />
                  <span>Public Student Feed</span>
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                    newPostContent.trim()
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  <Send size={13} />
                  <span>Publish Update</span>
                </button>
              </div>
            </form>

            {/* Community Feed Posts Stream */}
            <div className="space-y-5">
              {posts.map((post) => {
                const isMine = post.author === (username || 'Developer');
                const isEditing = editingPostId === post.id;
                const postComments = post.comments || [];
                const isCommenting = activeCommentPostId === post.id;
                const isCodeSnippet = post.tag.includes('Backend') || post.tag.includes('Project');

                return (
                  <div 
                    key={post.id} 
                    className="bg-[#0F111A] border border-white/[0.08] hover:border-white/15 transition-all rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-3.5 w-full min-w-0 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        onClick={() => handleInspectUser({ username: post.author })}
                        className="flex items-center gap-3 cursor-pointer group min-w-0"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${post.avatarBg} flex items-center justify-center font-bold text-white text-sm shadow shrink-0 group-hover:scale-105 transition-transform`}>
                          {post.author[0]}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm truncate group-hover:text-sky-300 transition-colors">
                              @{post.author}
                            </h4>
                            {isMine && (
                              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-md shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          
                          {/* Clean Unboxed Metadata */}
                          <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                            <span>{post.time}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.tag}</span>
                          </div>
                        </div>
                      </div>

                      {/* Author Edit/Delete Menu */}
                      {isMine && !isEditing && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingPostId(post.id);
                              setEditContent(post.content);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Remove Post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post Body Content */}
                    {isEditing ? (
                      <div className="space-y-2.5 pt-1">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-sky-500/50 rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-500 cursor-pointer shadow"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-white/90 text-sm leading-relaxed font-normal whitespace-pre-line break-words">
                          {post.content}
                        </p>

                        {/* Optional Formatted Code Preview Box */}
                        {isCodeSnippet && (
                          <div className="bg-[#08090E] border border-white/10 rounded-xl p-3.5 space-y-2 font-mono text-xs text-sky-200">
                            <div className="flex items-center justify-between text-[11px] text-white/40 pb-1 border-b border-white/5">
                              <span className="flex items-center gap-1.5">
                                <Code size={13} className="text-emerald-400" />
                                <span>Student Code Snippet</span>
                              </span>
                              <span>TypeScript</span>
                            </div>
                            <pre className="overflow-x-auto text-emerald-300/90 leading-normal">
                              {`// Student Coding Lab\nconst student = {\n  username: "${post.author}",\n  status: "Lesson Completed"\n};`}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interaction Bar */}
                    <div className="flex items-center justify-between gap-1 pt-3 border-t border-slate-200 text-xs w-full min-w-0">
                      <button
                        onClick={() => toggleCheer(post.id)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                          post.cheeredByMe
                            ? 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Heart size={14} className={post.cheeredByMe ? 'fill-rose-500 text-rose-500' : ''} />
                        <span className="text-xs">{post.cheeredByMe ? 'Cheered' : 'Cheer'} ({post.cheers})</span>
                      </button>

                      <button 
                        onClick={() => setActiveCommentPostId(isCommenting ? null : post.id)}
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 shrink-0"
                      >
                        <MessageSquare size={14} className="text-sky-600 fill-sky-100" />
                        <span className="text-xs">Comments ({postComments.length})</span>
                      </button>

                      <div className="relative">
                        <button 
                          onClick={() => {
                            sounds.playClick();
                            setActiveSharePostId(activeSharePostId === post.id ? null : post.id);
                          }}
                          className={`text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-xl border shrink-0 ${
                            activeSharePostId === post.id ? 'border-sky-400 bg-sky-50' : 'border-slate-200'
                          }`}
                        >
                          <Share2 size={13} />
                          <span className="hidden sm:inline text-xs">Share</span>
                        </button>

                        {activeSharePostId === post.id && (
                          <div className="absolute right-0 bottom-full mb-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150 text-slate-800 text-left">
                            <div className="text-[10px] font-black uppercase text-slate-400 px-2.5 py-1.5 border-b border-slate-100 mb-1.5">
                              Share Quest Post
                            </div>
                            
                            {/* Copy Link Option */}
                            <button
                              onClick={() => handleCopyLink(post)}
                              className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <Code size={13} className="text-slate-500" />
                                <span>{copiedPostId === post.id ? 'Link Copied!' : 'Copy Link'}</span>
                              </span>
                              {copiedPostId === post.id && <Check size={12} className="text-emerald-500 shrink-0" />}
                            </button>

                            {/* Share to Twitter / X */}
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out @${post.author}'s coding achievement on CodeQuest: "${post.content}" 🔥 Join CodeQuest Academy to learn to code!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                sounds.playCorrect();
                                setActiveSharePostId(null);
                              }}
                              className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-slate-900 cursor-pointer"
                            >
                              <span className="font-extrabold text-[11px] w-3.5 text-center">X</span>
                              <span>Post to Twitter / X</span>
                            </a>

                            {/* Share to Facebook */}
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ais-pre-lr7b6ihtombbbz7d55dmn3-72429909527.asia-southeast1.run.app`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                sounds.playCorrect();
                                setActiveSharePostId(null);
                              }}
                              className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-[#1877F2] cursor-pointer"
                            >
                              <span className="font-extrabold text-[12px] w-3.5 text-center">f</span>
                              <span>Share to Facebook</span>
                            </a>

                            {/* Share to WhatsApp */}
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out @${post.author}'s coding achievement on CodeQuest: "${post.content}" 🚀 Join CodeQuest Academy: https://ais-pre-lr7b6ihtombbbz7d55dmn3-72429909527.asia-southeast1.run.app`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                sounds.playCorrect();
                                setActiveSharePostId(null);
                              }}
                              className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-[#25D366] cursor-pointer"
                            >
                              <span className="font-extrabold text-[12px] w-3.5 text-center">w</span>
                              <span>Share to WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comments Expandable Drawer */}
                    {isCommenting && (
                      <div className="pt-3 border-t border-white/[0.08] space-y-3 animate-in fade-in duration-200 w-full min-w-0">
                        {postComments.map((c) => (
                          <div key={c.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                              {c.author[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="font-bold text-white">@{c.author}</span>
                                <span className="text-[10px] text-white/40">{c.time}</span>
                              </div>
                              <p className="text-white/80 text-xs mt-0.5 break-words">{c.content}</p>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center gap-2 pt-1 w-full min-w-0">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 placeholder:text-white/30"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInput.trim()}
                            className="shrink-0 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase cursor-pointer disabled:opacity-40 transition-all flex items-center gap-1"
                          >
                            <Send size={11} className="shrink-0" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {posts.length === 0 && (
                <div className="text-center py-12 bg-[#0F111A] border border-white/[0.08] rounded-2xl text-white/40 text-xs">
                  No community posts yet. Be the first to share an update!
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column (5 Cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Search Student Directory Card */}
            <div className="bg-[#0F111A] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search size={16} className="text-sky-400" />
                  <span>Find Students</span>
                </h3>
                <span className="text-[11px] text-white/40">Directory</span>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={15} />
                <input
                  type="text"
                  placeholder="Search student handle or goal..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-20 focus:outline-none focus:border-sky-500 text-xs text-white placeholder:text-white/30 transition-all"
                />
                {search ? (
                  <button
                    onClick={() => {
                      setSearch('');
                      setProfiles([]);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white rounded-md transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSearch()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    {loading ? '...' : 'Search'}
                  </button>
                )}
              </div>

              {/* Search Results List */}
              {profiles.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10 max-h-60 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    <span>Search Results ({profiles.length})</span>
                    <span>Tap to view profile</span>
                  </div>
                  {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center justify-between transition-all">
                      <div 
                        onClick={() => handleInspectUser(profile)}
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {profile.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="truncate min-w-0">
                          <h4 className="font-bold text-white text-xs truncate group-hover:text-sky-300">@{profile.username}</h4>
                          <span className="text-[10px] text-sky-400 font-medium block truncate">{profile.career_goal || `${profile.xp} XP`}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollow(profile);
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer shrink-0 ml-2 ${
                          profile.is_following 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow'
                        }`}
                      >
                        {profile.is_following ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested People to Follow Card */}
            <div className="bg-[#0F111A] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users size={16} className="text-sky-400" />
                  <span>Suggested Students</span>
                </h3>
                <span className="text-[11px] text-white/40">Discover Classmates</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {suggestedProfiles.map((sug) => (
                  <div
                    key={sug.id}
                    onClick={() => handleInspectUser(sug)}
                    className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 group-hover:scale-105 transition-transform">
                        {sug.username[0].toUpperCase()}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-white text-xs truncate group-hover:text-sky-300">
                          @{sug.username}
                        </h4>
                        {/* Unboxed Metadata */}
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-0.5">
                          <span>{sug.career_goal}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-yellow-400 font-semibold">{sug.xp} XP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(sug);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                        sug.is_following 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow'
                      }`}
                    >
                      {sug.is_following ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Following Members Card */}
            <div className="bg-[#0F111A] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy size={16} className="text-amber-400" />
                  <span>Following Students ({followingProfiles.length})</span>
                </h3>
                <span className="text-[11px] text-sky-400 font-medium">Your Network</span>
              </div>

              {followingProfiles.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {followingProfiles.map((friend) => (
                    <div 
                      key={friend.id} 
                      onClick={() => handleInspectUser(friend)}
                      className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 flex items-center justify-between hover:border-sky-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center font-bold text-black text-xs shrink-0">
                          {friend.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-white text-xs truncate group-hover:text-sky-300">@{friend.username}</h4>
                          <span className="text-[10px] text-amber-300 flex items-center gap-1">
                            <Flame size={10} className="fill-amber-400" />
                            <span>{friend.streak} Day Streak</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white/[0.01] border border-white/5 rounded-xl">
                  <p className="text-white/40 text-xs font-medium">No members followed yet</p>
                  <p className="text-white/30 text-[11px] mt-0.5">Follow suggested members above to see them here!</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* View Student Profile Modal */}
        {selectedUserProfile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0B0D14] border border-white/15 rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col p-5 sm:p-6 shadow-2xl relative overflow-hidden text-left">
              <button
                onClick={() => setSelectedUserProfile(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X size={16} />
              </button>

              <div className="overflow-y-auto space-y-5 pr-1.5 scrollbar-thin scrollbar-thumb-white/10">
                {/* Banner / Avatar Header */}
                <div className="flex flex-col items-center text-center space-y-2 pt-2">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-0.5 shadow-xl relative">
                    <div className="w-full h-full rounded-[14px] bg-[#0B0D14] flex items-center justify-center font-black text-white text-2xl">
                      {selectedUserProfile.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
                      <span>@{selectedUserProfile.username}</span>
                    </h3>
                    <p className="text-xs text-sky-400 font-semibold mt-0.5">
                      Level {selectedUserProfile.level || 1} Student
                    </p>
                    <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto leading-relaxed">
                      {selectedUserProfile.bio}
                    </p>
                  </div>
                </div>

                {/* DB Stats 4-Column Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                  <div className="p-1">
                    <span className="text-amber-400 font-bold text-sm flex items-center justify-center gap-1">
                      <Flame size={14} className="fill-amber-400" />
                      <span>{selectedUserProfile.streak}d</span>
                    </span>
                    <span className="text-[10px] font-medium text-white/40 uppercase block mt-0.5">Streak</span>
                  </div>
                  <div className="p-1">
                    <span className="text-yellow-300 font-bold text-sm flex items-center justify-center gap-1">
                      <Zap size={14} className="fill-yellow-300" />
                      <span>{selectedUserProfile.xp}</span>
                    </span>
                    <span className="text-[10px] font-medium text-white/40 uppercase block mt-0.5">Total XP</span>
                  </div>
                  <div className="p-1">
                    <span className="text-sky-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1 truncate">
                      <Trophy size={13} className="shrink-0" />
                      <span className="truncate">{selectedUserProfile.leagueName || 'Bronze'}</span>
                    </span>
                    <span className="text-[10px] font-medium text-white/40 uppercase block mt-0.5">League</span>
                  </div>
                  <div className="p-1">
                    <span className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1">
                      <Sparkle size={13} />
                      <span>#{selectedUserProfile.leagueRank || 1}</span>
                    </span>
                    <span className="text-[10px] font-medium text-white/40 uppercase block mt-0.5">Global Rank</span>
                  </div>
                </div>

                {/* Career Goal Card */}
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-xs space-y-1">
                  <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">Career Path Goal</span>
                  <p className="text-white font-medium">{selectedUserProfile.career_goal}</p>
                </div>

                {/* Follow / Unfollow Action Button */}
                <button
                  onClick={() => toggleFollow(selectedUserProfile)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    selectedUserProfile.is_following
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-110'
                  }`}
                >
                  {selectedUserProfile.is_following ? (
                    <>
                      <UserCheck size={15} />
                      <span>Following Student</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      <span>Follow Student</span>
                    </>
                  )}
                </button>

                {/* User Posts Stream Section */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <MessageSquare size={14} className="text-sky-400" />
                      <span>Posts by @{selectedUserProfile.username}</span>
                    </h4>
                    <span className="text-[11px] text-white/40">
                      {userPostsLoading ? 'Loading...' : `${userPosts.length} published`}
                    </span>
                  </div>

                  {userPostsLoading ? (
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center text-xs text-white/40 animate-pulse">
                      Retrieving student posts from database...
                    </div>
                  ) : userPosts.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {userPosts.map((uPost) => (
                        <div
                          key={uPost.id}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between text-[11px] text-white/50">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${uPost.tagStyle}`}>
                              {uPost.tag}
                            </span>
                            <span>{uPost.time}</span>
                          </div>
                          <p className="text-white/90 text-xs leading-relaxed font-normal whitespace-pre-line break-words">
                            {uPost.content}
                          </p>
                          <div className="flex items-center gap-4 text-[11px] text-white/40 pt-1 border-t border-white/5">
                            <span className="flex items-center gap-1">
                              <Heart size={12} className="text-rose-400 fill-rose-400/30" />
                              <span>{uPost.cheers} cheers</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={12} className="text-sky-400" />
                              <span>{(uPost.comments || []).length} comments</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center text-xs text-white/40">
                      No community posts published yet by @{selectedUserProfile.username}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PullToRefresh>
  );
}
