import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getRoleRedirectPath } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      const redirectPath = getRoleRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'INVALID CAMPUS CREDENTIALS');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 selection:bg-[#FFE600] selection:text-black font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('/auth-bg.jpg')` }}
    >
      {/* Dark tint overlay for contrast and atmosphere */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-8">
        {/* Streetwear Retro Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#FFE600] border-2 sm:border-[3px] border-black p-3 shadow-[4px_4px_0px_0px_#000] rotate-[-2deg] mb-3">
            <span className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tighter text-black">
              FOUNDIT?
            </span>
          </div>
          <div>
            <span className="bg-white text-black font-mono font-black text-xs uppercase tracking-widest px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block">
              CAMPUS REPOSITORY // ACCESS GATE
            </span>
          </div>
        </div>

        {/* Neo-Brutalist Main Card */}
        <div className="bg-white border-2 sm:border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-black">
            <div>
              <h2 className="font-display font-black text-xl uppercase tracking-tight text-black">
                CAMPUS PORTAL LOGIN
              </h2>
              <p className="font-mono text-[11px] text-black/60 uppercase">
                ENTER VERIFIED .EDU CREDENTIALS
              </p>
            </div>
            <span className="p-1.5 bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <ShieldAlert className="w-5 h-5 text-black stroke-[2.5]" />
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#FF5C00] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] font-mono font-bold text-xs uppercase flex items-center gap-2">
              <span className="text-black font-black">ERROR:</span>
              <span className="text-black">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1.5">
                CAMPUS EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                <input
                  type="email"
                  required
                  placeholder="NAME@CAMPUS.EDU"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F0] border-2 border-black font-display font-bold text-sm text-black placeholder:text-black/40 placeholder:font-mono placeholder:text-xs uppercase shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F0] border-2 border-black font-bold text-sm text-black placeholder:text-black/40 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-[#FFE600] hover:bg-[#FF5C00] hover:text-white text-black font-display font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black stroke-[3]" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t-2 border-black">
            <div className="font-mono text-[11px] font-black uppercase text-black mb-2.5 flex items-center justify-between">
              <span>ONE-CLICK DEMO ACCESS:</span>
              <span className="bg-[#00F0FF] px-1 border border-black font-bold">FAST TEST</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo('student@campus.edu', 'student123')}
                className="p-3 bg-[#F4F4F0] hover:bg-[#CCFF00] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 text-left transition-all"
              >
                <div className="font-display font-black text-sm uppercase text-black">
                  STUDENT PASS
                </div>
                <div className="font-mono text-[10px] text-black/70 font-bold">student@campus.edu</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin@campus.edu', 'admin123')}
                className="p-3 bg-[#F4F4F0] hover:bg-[#FF48B0] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 text-left transition-all"
              >
                <div className="font-display font-black text-sm uppercase text-black">
                  ADMIN CONSOLE
                </div>
                <div className="font-mono text-[10px] text-black/70 font-bold">admin@campus.edu</div>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center font-mono text-xs text-black uppercase">
            NEED A CAMPUS PASS?{' '}
            <Link
              to="/signup"
              className="font-black bg-[#FFE600] px-1 border border-black hover:bg-black hover:text-white transition-colors"
            >
              REGISTER ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
