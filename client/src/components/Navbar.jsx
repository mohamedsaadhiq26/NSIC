import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, ShieldAlert, GraduationCap, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onOpenUpload }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'ADMIN':
        return {
          label: 'ADMIN ARCHIVIST',
          bg: 'bg-[#FF48B0] text-black',
          icon: ShieldAlert,
        };
      case 'STUDENT':
      default:
        return {
          label: 'VERIFIED STUDENT',
          bg: 'bg-[#CCFF00] text-black',
          icon: GraduationCap,
        };
    }
  };

  const badge = getRoleBadge(role);
  const BadgeIcon = badge.icon;
  const isAdmin = role === 'ADMIN';

  return (
    <nav className="w-full bg-[#F4F4F0] border-b-2 sm:border-b-[3px] border-black sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Sub-tagline */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link to="/student" className="flex items-center space-x-2.5 group">
              <span className="bg-[#FFE600] group-hover:bg-[#FF5C00] group-hover:text-white px-3 py-1 text-black font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter border-2 border-black shadow-[3px_3px_0px_0px_#000] -rotate-1 group-hover:rotate-0 transition-all duration-150 inline-block">
                FOUNDIT?
              </span>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-black bg-white px-2 py-1 border-2 border-black hidden lg:inline-block shadow-[2px_2px_0px_0px_#000]">
                CAMPUS ARCHIVE // V2.0
              </span>
            </Link>

            {/* Admin Switcher Tabs */}
            {isAdmin && (
              <div className="hidden md:flex items-center space-x-1.5 p-1 bg-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <Link
                  to="/student"
                  className={`px-3 py-1 text-xs font-mono font-black uppercase tracking-wider transition-all ${
                    location.pathname === '/student'
                      ? 'bg-[#FFE600] text-black shadow-[1px_1px_0px_0px_#000]'
                      : 'text-white hover:text-[#FFE600]'
                  }`}
                >
                  STUDENT FEED
                </Link>

                <Link
                  to="/admin"
                  className={`px-3 py-1 text-xs font-mono font-black uppercase tracking-wider transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-[#FF48B0] text-black shadow-[1px_1px_0px_0px_#000]'
                      : 'text-white hover:text-[#FF48B0]'
                  }`}
                >
                  ADMIN CONSOLE
                </Link>
              </div>
            )}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {/* Upload Button: STRICTLY ADMIN EXCLUSIVE */}
            {isAdmin && onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="bg-[#FFE600] hover:bg-[#FF5C00] hover:text-white text-black font-display font-black uppercase text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 tracking-wider"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">POST FOUND ITEM</span>
                <span className="sm:hidden">POST</span>
              </button>
            )}

            {/* Profile Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-3 py-2 border-2 border-black bg-white hover:bg-[#F4F4F0] shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <div className="w-6 h-6 bg-black text-[#FFE600] flex items-center justify-center font-display font-black text-xs border border-black">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-black uppercase tracking-tight text-black line-clamp-1">
                    {user?.name || 'STUDENT'}
                  </div>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border border-black hidden md:inline-block ${badge.bg}`}>
                  {role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-black stroke-[3]" />
              </button>

              {/* Neo-Brutalist Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="pb-3 border-b-2 border-black">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black bg-[#FFE600] px-1.5 py-0.5 border border-black">
                        {user?.studentId || 'VERIFIED USER'}
                      </span>
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-black ${badge.bg}`}>
                        {role}
                      </span>
                    </div>
                    <div className="font-display font-black text-base text-black uppercase mt-1">
                      {user?.name}
                    </div>
                    <div className="font-mono text-xs text-black/70">
                      {user?.email}
                    </div>
                  </div>

                  <div className="py-2.5 border-b-2 border-black space-y-1 font-mono text-xs">
                    <div className="flex justify-between items-center text-black">
                      <span className="uppercase text-black/60">PRIVILEGES:</span>
                      <span className="font-bold bg-[#CCFF00] px-1 border border-black">
                        {isAdmin ? 'ALL POWERS (UPLOAD/PURGE/APPROVE)' : 'FEED BROWSE & CLAIM'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#FF48B0] hover:bg-black hover:text-white text-black font-display font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      <LogOut className="w-4 h-4 stroke-[2.5]" />
                      <span>SIGN OUT // DISCONNECT</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
