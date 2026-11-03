import React from 'react';
import { Search, RefreshCw, AlertTriangle, PackageOpen, Plus } from 'lucide-react';
import ItemCard from './ItemCard';

const CATEGORIES = [
  'All',
  'Electronics',
  'ID & Wallets',
  'Keys',
  'Books & Stationery',
  'Clothing',
  'Bags & Backpacks',
  'Accessories',
  'Other',
];

export default function DiscoveryFeed({
  items,
  loading,
  error,
  category,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  onClaim,
  onOpenUpload,
}) {
  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Category Chips */}
      <div className="bg-white border-2 sm:border-[3px] border-black p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Thick Search Bar with Hard Shadow Shift on Focus */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <Search className="w-5 h-5 text-black stroke-[3]" />
            </div>
            <input
              type="text"
              placeholder="SEARCH ITEMS, BUILDINGS, OR LANDMARKS..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F4F4F0] border-2 border-black font-display font-black text-sm sm:text-base text-black placeholder:text-black/40 placeholder:font-mono placeholder:font-bold placeholder:text-xs sm:placeholder:text-sm uppercase shadow-[3px_3px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all outline-none"
            />
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-5 py-3 bg-white hover:bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 stroke-[3] ${loading ? 'animate-spin text-black' : ''}`} />
            <span>REFRESH</span>
          </button>
        </div>

        {/* Harsh Rectangular Category Tags (Inverted when active) */}
        <div>
          <div className="font-mono font-bold text-xs uppercase tracking-wider text-black mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 bg-black inline-block" />
            FILTER BY CATEGORY:
          </div>
          <div className="flex items-center flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`font-mono font-black text-xs uppercase tracking-wider px-3.5 py-1.5 border-2 border-black transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-[3px_3px_0px_0px_#FFE600] -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white hover:bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Banner with Hazard Stripes Accent */}
      {error && (
        <div className="p-4 bg-[#FF5C00] border-2 border-black shadow-[4px_4px_0px_0px_#000] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 stroke-[3] text-black" />
            <span className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-black">
              {error}
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="font-mono font-black text-xs uppercase bg-black text-white px-3 py-1.5 border border-white hover:bg-white hover:text-black hover:border-black transition-colors"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Grid or Empty/Loading States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] bg-[#E5E5DF] border-2 border-black" />
              <div className="h-6 bg-[#E5E5DF] border border-black w-3/4" />
              <div className="h-4 bg-[#E5E5DF] border border-black w-1/2" />
              <div className="h-10 bg-[#E5E5DF] border-2 border-black" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border-2 sm:border-[3px] border-black shadow-[6px_6px_0px_0px_#000] max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center mb-4 rotate-3">
            <PackageOpen className="w-8 h-8 text-black stroke-[2.5]" />
          </div>
          <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
            NO ITEMS FOUND IN THIS SECTOR
          </h3>
          <p className="font-mono text-xs text-black/70 mt-2 max-w-sm mx-auto uppercase">
            {searchQuery || category !== 'All'
              ? 'Nothing matches your active filters. Try searching for something else or reset tags.'
              : 'The lost & found archive is currently clean. Report an item below to log it.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(searchQuery || category !== 'All') && (
              <button
                onClick={() => {
                  onCategoryChange('All');
                  onSearchChange('');
                }}
                className="px-4 py-2 bg-white hover:bg-black hover:text-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                RESET FILTERS
              </button>
            )}
            {onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#FF5C00] hover:bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>REPORT FIRST ITEM</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onClaim={onClaim} />
          ))}
        </div>
      )}
    </div>
  );
}
