import React from 'react';
import { MapPin, Calendar, ArrowRight, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { getImageUrl } from '../services/api';

export default function ItemCard({ item, onClaim }) {
  const formattedDate = new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isPending = item.status === 'pending';
  const isResolved = item.status === 'resolved';
  const isAvailable = item.status === 'available';

  return (
    <div
      className={`bg-white border-2 sm:border-[3px] border-black transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
        isPending
          ? 'shadow-[5px_5px_0px_0px_#FF5C00]'
          : 'shadow-[4px_4px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Top Half: Photograph with Stark Black Dividing Border */}
        <div className="relative aspect-[4/3] w-full bg-[#E5E5DF] border-b-2 sm:border-b-[3px] border-black overflow-hidden">
          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="bg-white text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {item.category}
            </span>
          </div>

          {/* Prominent Status Badge on Image Corner */}
          <div className="absolute top-3 right-3">
            {isPending && (
              <span className="bg-[#FF5C00] text-black font-mono font-black text-[11px] uppercase tracking-wider px-2.5 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-[2deg] flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5 stroke-[3]" />
                <span>CLAIM PENDING</span>
              </span>
            )}
            {isAvailable && (
              <span className="bg-[#00FF66] text-black font-mono font-black uppercase text-[10px] px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-black" />
                <span>AVAILABLE</span>
              </span>
            )}
            {isResolved && (
              <span className="bg-black text-white font-mono font-black uppercase text-[10px] px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66] stroke-[2.5]" />
                <span>RESOLVED</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Half: Details */}
        <div className="p-4 sm:p-5">
          <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black line-clamp-1 group-hover:text-[#FF5C00] transition-colors">
            {item.title}
          </h3>

          <div className="mt-2 space-y-1 font-mono text-xs text-black">
            <div className="flex items-center space-x-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
              <span className="truncate">{item.location}</span>
            </div>

            <div className="flex items-center space-x-1 text-black/60 text-[11px]">
              <Calendar className="w-3 h-3 shrink-0 stroke-[2]" />
              <span>LOGGED {formattedDate.toUpperCase()}</span>
              <span>•</span>
              <span className="truncate font-bold text-black/80">
                BY {item.finder?.name ? item.finder.name.toUpperCase() : 'CAMPUS ARCHIVIST'}
              </span>
            </div>
          </div>

          {/* Official Claim Procedure Note Box */}
          <div className="mt-3.5 p-3 bg-[#F4F4F0] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <div className="font-mono font-black text-[10px] uppercase text-black tracking-wider flex items-center gap-1 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="bg-[#FFE600] px-1 border border-black font-bold">OFFICIAL VERIFICATION:</span>
            </div>
            <p className="font-mono text-[11px] text-black font-bold uppercase leading-snug">
              {isPending
                ? 'A claim is currently under review by Campus Administration.'
                : isResolved
                ? 'Item returned to verified student owner.'
                : 'Submit Student Name, Reg. Number & Dept to request handover.'}
            </p>
          </div>
        </div>
      </div>

      {/* Claim Action Button (Disabled if Pending or Resolved) */}
      <div className="p-4 sm:p-5 pt-0">
        {isPending ? (
          <button
            disabled
            className="w-full bg-[#E5E5DF] text-black/60 font-display font-black uppercase text-xs sm:text-sm py-3 px-4 border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-not-allowed flex items-center justify-center gap-2 tracking-wider"
          >
            <Clock className="w-4 h-4 stroke-[2.5]" />
            <span>CLAIM PENDING // UNDER REVIEW</span>
          </button>
        ) : isResolved ? (
          <button
            disabled
            className="w-full bg-black text-white font-display font-black uppercase text-xs sm:text-sm py-3 px-4 border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-not-allowed flex items-center justify-center gap-2 tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5] text-[#00FF66]" />
            <span>RETURNED TO OWNER</span>
          </button>
        ) : (
          <button
            onClick={() => onClaim(item)}
            className="w-full bg-[#00F0FF] hover:bg-[#FFE600] active:bg-[#FF5C00] active:text-white text-black font-display font-black uppercase text-xs sm:text-sm py-3 px-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 tracking-wider"
          >
            <span>CLAIM ITEM // FILE FORM</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
}
