import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';
import { 
  Mail, Lock, Loader2, Sparkles, User, Check, AlertCircle, 
  Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, KeyRound
} from 'lucide-react';
import { sounds } from '../lib/sound';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState(''); // can be email OR username
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Username validation & uniqueness check
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Feedback notifications
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Debounced check for username uniqueness
  useEffect(() => {
    if (mode !== 'signup') return;
    const trimmed = registerUsername.trim();

    if (!trimmed) {
      setUsernameStatus('idle');
      setUsernameError(null);
      return;
    }

    // Format validation (3-20 chars, alphanumeric + underscore)
    if (trimmed.length < 3) {
      setUsernameStatus('invalid');
      setUsernameError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameStatus('invalid');
      setUsernameError('Only letters, numbers, and underscores allowed');
      return;
    }

    setUsernameStatus('checking');
    setIsCheckingUsername(true);

    const timer = setTimeout(async () => {
      if (!supabase) {
        setUsernameStatus('available');
        setIsCheckingUsername(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .ilike('username', trimmed)
          .maybeSingle();

        if (error && !error.message?.includes('not found')) {
          // Ignore network glitch in validation
          setUsernameStatus('available');
        } else if (data) {
          setUsernameStatus('taken');
          setUsernameError('This username is already claimed');
        } else {
          setUsernameStatus('available');
          setUsernameError(null);
        }
      } catch {
        setUsernameStatus('available');
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [registerUsername, mode]);

  // Handle Login (Supports Email OR Username)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');
      
      const identifier = loginIdentifier.trim();
      if (!identifier) throw new Error('Please enter your email or username.');
      if (!loginPassword) throw new Error('Please enter your password.');

      let emailToAuthenticate = identifier;

      // If user typed a username (doesn't contain '@'), look up their email from profiles
      if (!identifier.includes('@')) {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('id, username')
          .ilike('username', identifier)
          .maybeSingle();

        if (profileErr || !profile) {
          throw new Error(`No account found for username "${identifier}". Please check your spelling or log in with your email.`);
        }

        // If email was stored in profiles, use it
        const { data: profileWithEmail } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', profile.id)
          .maybeSingle();

        if (profileWithEmail?.email) {
          emailToAuthenticate = profileWithEmail.email;
        }
      }

      useGameStore.getState().resetStore();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToAuthenticate,
        password: loginPassword,
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Invalid email/username or password. Please try again.');
        }
        throw authError;
      }

      sounds.playCorrect();
    } catch (err: any) {
      sounds.playWrong();
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register (Validates desired unique username, email, password & confirm password)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');

      const usernameTrimmed = registerUsername.trim();
      const emailTrimmed = registerEmail.trim();

      if (!usernameTrimmed || usernameTrimmed.length < 3) {
        throw new Error('Desired username must be at least 3 characters.');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(usernameTrimmed)) {
        throw new Error('Username can only contain letters, numbers, and underscores.');
      }
      if (usernameStatus === 'taken') {
        throw new Error('Username is already taken. Please choose another username.');
      }
      if (!emailTrimmed) {
        throw new Error('Please enter a valid email address.');
      }
      if (registerPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (registerPassword !== registerConfirmPassword) {
        throw new Error('Passwords do not match. Please verify your confirmation password.');
      }

      // Final uniqueness check before registration
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', usernameTrimmed)
        .maybeSingle();

      if (existingUser) {
        throw new Error(`The username "${usernameTrimmed}" is already registered. Please choose another.`);
      }

      // Clear any previous session state from browser storage before creating new account
      useGameStore.getState().resetStore();

      const { data, error: signupError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password: registerPassword,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            username: usernameTrimmed,
            avatar_icon: '👾',
          }
        }
      });

      if (signupError) throw signupError;

      // Update / Upsert profile with username, email & default basic tier
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: usernameTrimmed,
            email: emailTrimmed,
            avatar_icon: '👾',
            xp: 0,
            weekly_xp: 0,
            league_id: 'bronze',
            hearts: 5,
            streak: 1,
            level: 1,
            completed_lessons: [],
            subscription_tier: 'basic',
            is_pro: false,
            role: emailTrimmed === 'mark.entrina12@gmail.com' ? 'admin' : 'user',
            unlocked_advanced_path_id: 'web-dev',
            unlocked_advanced_path_ids: ['web-dev'],
            student_plus_path_locked: false,
            student_plus_renewal_count: 0
          });
        } catch {}
      }

      sounds.playFanfare();

      if (data?.session) {
        setSuccess(`Welcome to CodeQuest, ${usernameTrimmed}! Redirecting to Academy...`);
      } else {
        setSuccess('Account created! Check your email inbox to confirm your registration.');
      }
    } catch (err: any) {
      sounds.playWrong();
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');

      const emailTrimmed = forgotEmail.trim();
      if (!emailTrimmed || !emailTrimmed.includes('@')) {
        throw new Error('Please enter a valid registered email address.');
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
        redirectTo: window.location.origin,
      });

      if (resetError) throw resetError;

      sounds.playCorrect();
      setSuccess(`Password recovery link has been sent to ${emailTrimmed}. Please check your inbox and follow the instructions.`);
    } catch (err: any) {
      sounds.playWrong();
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = registerPassword && registerConfirmPassword && registerPassword === registerConfirmPassword;
  const passwordsMismatch = registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword;

  return (
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-sky-500/30">
      {/* Dynamic Background Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-sky-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 shadow-[0_10px_35px_rgba(14,165,233,0.35)] border border-white/20 mb-2">
            <Sparkles size={32} className="text-white fill-white/20" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            CodeQuest Academy
          </h1>
          <p className="text-white/60 text-xs sm:text-sm font-medium">
            Gamified Web & Full-Stack Coding Interactive Mastery
          </p>
        </div>

        {/* Mode Toggle Tabs (Hidden in Forgot Password mode) */}
        {mode !== 'forgot' ? (
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
              Account Recovery
            </span>
          </div>
        )}

        {/* Authentication Card */}
        <div className="bg-[#12131C]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-white/50 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type="text"
                    placeholder="Enter email or username"
                    value={loginIdentifier || ''}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-sky-400 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-white/50">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccess(null);
                      setForgotEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                    }}
                    className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword || ''}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-sky-400 rounded-2xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Status alerts */}
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-3 text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-950/50 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Academy</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          ) : mode === 'signup' ? (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Desired Username with Uniqueness Check */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-white/50">
                    Desired Username
                  </label>
                  {isCheckingUsername && (
                    <span className="text-[10px] text-sky-400 flex items-center gap-1 font-bold">
                      <Loader2 size={10} className="animate-spin" /> Checking availability...
                    </span>
                  )}
                  {usernameStatus === 'available' && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                      <Check size={12} /> Available
                    </span>
                  )}
                  {usernameStatus === 'taken' && (
                    <span className="text-[10px] text-rose-400 flex items-center gap-1 font-bold">
                      <AlertCircle size={12} /> Already taken
                    </span>
                  )}
                </div>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. alex_coder, dev_ninja"
                    value={registerUsername || ''}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    maxLength={20}
                    className={`w-full bg-white/5 border rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                      usernameStatus === 'taken' || usernameStatus === 'invalid'
                        ? 'border-rose-500/60 focus:border-rose-400'
                        : usernameStatus === 'available'
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : 'border-white/10 focus:border-sky-400'
                    }`}
                    required
                    autoFocus
                  />
                </div>
                {usernameError && (
                  <p className="text-[11px] text-rose-400 font-bold mt-1">{usernameError}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-white/50 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={registerEmail || ''}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-sky-400 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-white/50 mb-1.5">
                  Create Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={registerPassword || ''}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 focus:border-sky-400 rounded-2xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-white/50">
                    Confirm Password
                  </label>
                  {passwordsMatch && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                      <Check size={12} /> Passwords match
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] text-rose-400 flex items-center gap-1 font-bold">
                      <AlertCircle size={12} /> Passwords do not match
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={registerConfirmPassword || ''}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className={`w-full bg-white/5 border rounded-2xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                      passwordsMismatch 
                        ? 'border-rose-500/60 focus:border-rose-400' 
                        : passwordsMatch 
                        ? 'border-emerald-500/60 focus:border-emerald-400' 
                        : 'border-white/10 focus:border-sky-400'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Status alerts */}
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-3 text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (usernameStatus === 'taken')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-950/50 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= FORGOT PASSWORD FORM ================= */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-left space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                  <KeyRound size={20} />
                </div>
                <h3 className="text-base font-black text-white">Reset Account Password</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Enter your registered student email address. We'll send you a secure verification link to reset your password.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-white/50 mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={forgotEmail || ''}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-sky-400 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Status alerts */}
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-3 text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-emerald-300 font-bold flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Password Reset Link</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Return to Sign In</span>
              </button>
            </form>
          )}
        </div>

        {/* Bottom Switch Note (when not in forgot password mode) */}
        {mode !== 'forgot' && (
          <p className="text-center text-white/45 text-xs">
            {mode === 'login' ? "Don't have a student account yet?" : 'Already enrolled in CodeQuest Academy?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setSuccess(null);
              }}
              className="text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
            >
              {mode === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
