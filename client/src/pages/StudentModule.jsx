import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import DiscoveryFeed from '../components/DiscoveryFeed';
import ClaimModal from '../components/ClaimModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CheckCircle2, Search, FileText } from 'lucide-react';

export default function StudentModule() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Claim Modal State
  const [claimItem, setClaimItem] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getItems({ category, search: searchQuery });
      setItems(data.items || []);
    } catch (err) {
      console.error('Fetch items error:', err);
      setError('COULD NOT LOAD ITEMS FROM CAMPUS ARCHIVE.');
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleClaimSubmitted = (newClaim) => {
    showToast('CLAIM REQUEST FILED! STATUS UPDATED TO PENDING FOR ADMIN REVIEW.');
    // Optimistically update the item to pending status immediately
    if (claimItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === claimItem.id
            ? { ...i, status: 'pending', claims: [newClaim, ...(i.claims || [])] }
            : i
        )
      );
    }
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col font-sans text-black selection:bg-[#FFE600] selection:text-black">
      {/* Neo-Brutalist Navbar (No upload trigger for students) */}
      <Navbar />

      {/* Marquee Ticker Strip for Editorial Vibe */}
      <div className="w-full bg-[#FFE600] border-b-2 sm:border-b-[3px] border-black py-1.5 overflow-hidden whitespace-nowrap select-none font-mono font-black text-xs uppercase tracking-widest text-black flex items-center justify-around">
        <span>✦ ZERO-SPAM CAMPUS NETWORK</span>
        <span className="hidden sm:inline">✦ OFFICIAL VERIFICATION FORMS REQUIRED</span>
        <span>✦ VERIFIED .EDU ONLY</span>
        <span className="hidden md:inline">✦ ADMIN MODERATED ARCHIVE</span>
        <span>✦ 100% STUDENT PROTECTED ✦</span>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center space-x-2.5 px-5 py-3.5 bg-[#FFE600] text-black border-2 border-black shadow-[6px_6px_0px_0px_#000] font-mono font-black text-xs uppercase">
              <CheckCircle2 className="w-4 h-4 stroke-[3] text-black shrink-0" />
              <span>{toast}</span>
            </div>
          </div>
        )}

        {/* HERO SECTION: Safety Orange Block with Hard Black Border & Hard Shadow */}
        <div className="mb-10 sm:mb-12 bg-[#FF5C00] border-2 sm:border-[3px] border-black shadow-[6px_6px_0px_0px_#000] sm:shadow-[10px_10px_0px_0px_#000] p-6 sm:p-10 relative overflow-hidden">
          {/* Streetwear Decorative Tape / Sticker */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:block">
            <span className="bg-[#FFE600] text-black font-mono font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-3 inline-block">
              STUDENT FEED // BROWSE & CLAIM
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-black text-[#FFE600] px-3 py-1 font-mono font-black text-xs uppercase border border-black shadow-[2px_2px_0px_0px_#000]">
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              <span>STUDENT DASHBOARD • DISCOVERY PORTAL</span>
            </div>

            {/* Massive, Impactful Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tighter text-black leading-[0.95]">
              WELCOME BACK, {user?.name || 'STUDENT'}.
            </h1>

            <p className="font-mono text-xs sm:text-sm text-black font-bold uppercase max-w-2xl leading-relaxed bg-[#FFE600] p-2.5 sm:p-3 border-2 border-black shadow-[3px_3px_0px_0px_#000] inline-block">
              FOUND AN ITEM YOU OWN? FILE AN OFFICIAL THREE-POINT CLAIM REQUEST (NAME, REGISTRATION NUMBER, AND DEPARTMENT). ADMINS REVIEW AND APPROVE HANDOVERS.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs font-bold uppercase">
              <div className="bg-white text-black px-3.5 py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                STUDENT PASS: <span className="underline decoration-2">{user?.email || 'student@campus.edu'}</span>
              </div>
              <div className="bg-[#00F0FF] text-black px-3.5 py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                STATUS: AUTHORIZED CLAIMANT
              </div>
            </div>
          </div>
        </div>

        {/* Discovery Feed Section Header */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b-2 sm:border-b-[3px] border-black">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-[#FF5C00] border border-black inline-block" />
                <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-black">
                  CAMPUS LOST & FOUND REPOSITORY
                </h2>
              </div>
              <p className="font-mono text-xs text-black/70 uppercase mt-0.5">
                Browse available items or inspect claims pending administration review
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs uppercase px-3 py-1.5 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'} RECORDED
              </span>
            </div>
          </div>

          {/* Discovery Feed with Rectangular Category Tags and Heavy Search */}
          <DiscoveryFeed
            items={items}
            loading={loading}
            error={error}
            category={category}
            onCategoryChange={setCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={fetchItems}
            onClaim={(item) => setClaimItem(item)}
            onOpenUpload={null} // Students cannot upload
          />
        </section>
      </main>

      {/* Neo-Brutalist Footer */}
      <footer className="border-t-2 sm:border-t-[3px] border-black bg-white py-8 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs uppercase">
          <div className="flex items-center space-x-3">
            <span className="bg-black text-[#FFE600] px-2 py-1 font-display font-black text-sm border border-black">
              FOUNDIT?
            </span>
            <span className="font-bold">MODERN NEO-BRUTALIST CAMPUS LOST & FOUND ARCHIVE</span>
          </div>
          <div className="font-bold text-black/60">
            TWO-TIER ACCESS: STUDENT & ADMIN
          </div>
        </div>
      </footer>

      {/* Official Student Claim Modal */}
      <ClaimModal
        item={claimItem}
        isOpen={!!claimItem}
        onClose={() => setClaimItem(null)}
        onClaimSubmitted={handleClaimSubmitted}
      />
    </div>
  );
}
