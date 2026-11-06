import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getRoleRedirectPath } from '../context/AuthContext';
import { Lock, Mail, User, Building, ArrowRight, Loader2, GraduationCap, Briefcase, ShieldAlert, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: 'Main Campus Desk',
    studentId: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await register(formData);
      const redirectPath = getRoleRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'REGISTRATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  const isEduEmail =
    formData.email.toLowerCase().endsWith('.edu') || formData.email.toLowerCase().endsWith('.ac.in');

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 selection:bg-[#FFE600] selection:text-black font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('/auth-bg.jpg')` }}
    >
      <ThemeToggle className="fixed right-4 top-4 z-20" />
      {/* Dark tint overlay for contrast and atmosphere */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg my-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-[#00F0FF] border-2 sm:border-[3px] border-black p-3 shadow-[4px_4px_0px_0px_#000] rotate-1 mb-2">
            <span className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter text-black">
              CREATE CAMPUS PASS
            </span>
          </div>
          <div>
            <span className="bg-white text-black font-mono font-bold text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block">
              FOUNDIT? NETWORK // RESTRICTED TO VERIFIED DOMAINS
            </span>
          </div>
        </div>

        <div className="bg-white border-2 sm:border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-[#FF5C00] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] font-mono font-bold text-xs uppercase">
              <span className="text-black font-black">NOTICE: </span>
              <span className="text-black">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-2">
                SELECT YOUR CAMPUS ROLE
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'STUDENT', label: 'STUDENT PASS', icon: GraduationCap, color: 'bg-[#CCFF00]', desc: 'Browse feed & claim items' },
                  { id: 'ADMIN', label: 'ADMINISTRATOR', icon: ShieldAlert, color: 'bg-[#FF48B0]', desc: 'Upload, purge & approve' },
                ].map((roleOption) => {
                  const Icon = roleOption.icon;
                  const isSelected = formData.role === roleOption.id;
                  return (
                    <button
                      key={roleOption.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: roleOption.id })}
                      className={`p-3 border-2 border-black text-left transition-all ${
                        isSelected
                          ? `${roleOption.color} text-black shadow-[4px_4px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5`
                          : 'bg-[#F4F4F0] hover:bg-white text-black shadow-[2px_2px_0px_0px_#000]'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5 text-black stroke-[2.5]" />
                      <div className="font-display font-black text-xs uppercase">{roleOption.label}</div>
                      <div className="font-mono text-[10px] text-black/70 font-bold">{roleOption.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1">
                FULL NAME
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                <input
                  type="text"
                  required
                  placeholder="E.G. ALEX RIVERA"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F0] border-2 border-black font-display font-bold text-sm text-black placeholder:text-black/40 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none uppercase"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono font-black text-xs uppercase text-black">
                  CAMPUS EMAIL
                </label>
                {formData.email && (
                  <span
                    className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black ${
                      isEduEmail ? 'bg-[#00FF66] text-black' : 'bg-[#FF5C00] text-white'
                    }`}
                  >
                    {isEduEmail ? 'VALID CAMPUS DOMAIN' : 'MUST BE .EDU OR .AC.IN'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                <input
                  type="email"
                  required
                  placeholder="NAME@UNIVERSITY.EDU"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F0] border-2 border-black font-display font-bold text-sm text-black placeholder:text-black/40 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none uppercase"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1">
                DEPARTMENT / FACULTY
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                <input
                  type="text"
                  required
                  placeholder="E.G. COMPUTER SCIENCE & ENGINEERING"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F0] border-2 border-black font-display font-bold text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none uppercase"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                <input
                  type="password"
                  required
                  placeholder="AT LEAST 6 CHARACTERS"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F0] border-2 border-black font-bold text-sm text-black placeholder:text-black/40 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-[#FFE600] hover:bg-[#FF5C00] hover:text-white text-black font-display font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black stroke-[3]" />
                  <span>ISSUING CAMPUS PASS...</span>
                </>
              ) : (
                <>
                  <span>REGISTER TO SYSTEM</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center font-mono text-xs text-black uppercase">
            ALREADY ISSUED?{' '}
            <Link
              to="/login"
              className="font-black bg-[#FFE600] px-1 border border-black hover:bg-black hover:text-white transition-colors"
            >
              LOG IN TO PORTAL
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
