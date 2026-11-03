import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertTriangle, Loader2, MapPin, User, Hash, Building } from 'lucide-react';
import { api, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ClaimModal({ item, isOpen, onClose, onClaimSubmitted }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    registrationNumber: user?.studentId || '',
    department: user?.department || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.registrationNumber.trim() || !formData.department.trim()) {
      setError('ALL THREE FIELDS (FULL NAME, REGISTRATION NUMBER, AND DEPARTMENT) ARE REQUIRED.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.submitClaim({
        itemId: item.id,
        studentName: formData.studentName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        department: formData.department.trim(),
      });

      setSubmitted(true);
      if (onClaimSubmitted) {
        onClaimSubmitted(response.claim);
      }
    } catch (err) {
      setError(err.message || 'FAILED TO SUBMIT CLAIM REQUEST');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#F4F4F0] border-2 sm:border-[3px] border-black shadow-[8px_8px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header in Electric Cyan with "OFFICIAL STUDENT CLAIM FORM" */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#00F0FF] border-b-2 sm:border-b-[3px] border-black text-black">
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black">
              CLAIM THIS ITEM
            </h3>
            <p className="font-mono text-[11px] text-black font-black uppercase tracking-wider">
              OFFICIAL STUDENT CLAIM FORM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto bg-[#00FF66] border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center rotate-2">
              <CheckCircle2 className="w-9 h-9 text-black stroke-[2.5]" />
            </div>

            <div>
              <h4 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                CLAIM REQUEST FILED!
              </h4>
              <p className="font-mono text-xs text-black/70 uppercase mt-2 max-w-sm mx-auto leading-relaxed">
                Your credentials have been submitted for verification. The item status has been updated to PENDING and locked from duplicate claims.
              </p>
            </div>

            <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] text-left font-mono text-xs space-y-1.5">
              <div className="font-black uppercase text-black pb-1 border-b-2 border-black">
                STUDENT RECORD DETAILS:
              </div>
              <div className="text-black">
                <span className="text-black/60 uppercase">NAME:</span> {formData.studentName}
              </div>
              <div className="text-black">
                <span className="text-black/60 uppercase">REG. NO:</span> {formData.registrationNumber}
              </div>
              <div className="text-black">
                <span className="text-black/60 uppercase">DEPARTMENT:</span> {formData.department}
              </div>
              <div className="text-black flex items-center gap-2 pt-1 border-t border-black/20">
                <span className="text-black/60 uppercase">STATUS:</span>
                <span className="bg-[#FF5C00] text-black px-1.5 py-0.5 border border-black font-black uppercase text-[10px]">
                  PENDING ADMIN APPROVAL
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#FFE600] hover:bg-black hover:text-white text-black font-display font-black uppercase text-xs tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              RETURN TO CAMPUS FEED
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Item Card Thumbnail */}
            <div className="flex items-center space-x-3 p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.title}
                className="w-14 h-14 object-cover border-2 border-black shrink-0"
              />
              <div className="min-w-0 flex-1 text-left">
                <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-[#FFE600] border border-black inline-block mb-1">
                  {item.category}
                </span>
                <h4 className="font-display font-black text-sm uppercase text-black truncate">
                  {item.title}
                </h4>
                <p className="font-mono text-[11px] text-black/70 flex items-center gap-1 uppercase truncate font-bold">
                  <MapPin className="w-3 h-3 stroke-[2.5]" />
                  {item.location}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#FF5C00] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] font-mono font-bold text-xs flex items-center gap-2 uppercase">
                <AlertTriangle className="w-4 h-4 stroke-[3] shrink-0 text-black" />
                <span className="text-black">{error}</span>
              </div>
            )}

            {/* Three Distinct Stacked Input Fields */}
            <div className="space-y-3.5 pt-1">
              {/* 1. Full Name */}
              <div>
                <label className="block font-mono font-black text-xs uppercase text-black mb-1">
                  FULL NAME *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                  <input
                    type="text"
                    required
                    placeholder="E.G. ALEX RIVERA"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black font-display font-bold text-sm text-black placeholder:text-black/40 placeholder:font-mono placeholder:text-xs shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none uppercase transition-all"
                  />
                </div>
              </div>

              {/* 2. Registration Number */}
              <div>
                <label className="block font-mono font-black text-xs uppercase text-black mb-1">
                  REGISTRATION NUMBER *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                  <input
                    type="text"
                    required
                    placeholder="E.G. REG-2024-8849"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black font-display font-bold text-sm text-black placeholder:text-black/40 placeholder:font-mono placeholder:text-xs shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none uppercase transition-all"
                  />
                </div>
              </div>

              {/* 3. Department */}
              <div>
                <label className="block font-mono font-black text-xs uppercase text-black mb-1">
                  DEPARTMENT *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
                  <input
                    type="text"
                    required
                    placeholder="E.G. COMPUTER SCIENCE & ENGINEERING"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black font-display font-bold text-sm text-black placeholder:text-black/40 placeholder:font-mono placeholder:text-xs shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] outline-none uppercase transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions with "SUBMIT CLAIM REQUEST" button */}
            <div className="pt-3 flex items-center justify-end space-x-3 border-t-2 border-black">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 bg-white hover:bg-black hover:text-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#FF5C00] hover:bg-[#FFE600] active:bg-black active:text-white text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black stroke-[3]" />
                    <span>FILING CLAIM...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[3]" />
                    <span>SUBMIT CLAIM REQUEST</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
