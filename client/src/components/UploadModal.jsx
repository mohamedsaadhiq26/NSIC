import React, { useState, useRef } from 'react';
import { X, Upload, Check, Loader2, Sparkles, MapPin, AlertTriangle } from 'lucide-react';
import EnhancementToolbar from './EnhancementToolbar';
import { api } from '../services/api';

const CATEGORIES = [
  'Electronics',
  'ID & Wallets',
  'Keys',
  'Books & Stationery',
  'Clothing',
  'Bags & Backpacks',
  'Accessories',
  'Other',
];

export default function UploadModal({ isOpen, onClose, onItemCreated }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Image enhancement states
  const [enhancements, setEnhancements] = useState({
    removeBackground: false,
    upscale: false,
    sharpenText: false,
  });

  if (!isOpen) return null;

  const handleToggleEnhancement = (toolId) => {
    setEnhancements((prev) => ({
      ...prev,
      [toolId]: !prev[toolId],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('PLEASE CHOOSE A VALID IMAGE FILE (PNG, JPG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('ITEM PHOTOGRAPH IS REQUIRED.');
      return;
    }
    if (!formData.title.trim()) {
      setError('ITEM TITLE IS REQUIRED.');
      return;
    }
    if (!formData.location.trim()) {
      setError('CAMPUS LOCATION IS REQUIRED.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadPayload = new FormData();
      uploadPayload.append('image', selectedFile);
      uploadPayload.append('title', formData.title.trim());
      uploadPayload.append('category', formData.category);
      uploadPayload.append('location', formData.location.trim());

      const response = await api.createItem(uploadPayload);
      onItemCreated(response.item);
      onClose();
    } catch (err) {
      setError(err.message || 'FAILED TO SUBMIT FOUND ITEM');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewFilterClass = () => {
    let classes = 'transition-all duration-300 object-contain max-h-56 w-full border-2 border-black';
    if (enhancements.removeBackground) {
      classes += ' drop-shadow-2xl brightness-105';
    }
    if (enhancements.upscale) {
      classes += ' contrast-110 saturate-105';
    }
    if (enhancements.sharpenText) {
      classes += ' contrast-125 brightness-100';
    }
    return classes;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#F4F4F0] border-2 sm:border-[3px] border-black shadow-[8px_8px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar in Safety Orange */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#FF5C00] border-b-2 sm:border-b-[3px] border-black text-black">
          <div className="flex items-center space-x-2.5">
            <span className="bg-black text-[#FFE600] p-1.5 border border-black font-black text-xs">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                LOG FOUND ITEM // ADMIN REPOSITORY
              </h3>
              <p className="font-mono text-[10px] text-black font-bold uppercase tracking-wider">
                ADMINISTRATIVE ITEM INTAKE CONSOLE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000] text-black font-mono font-bold text-xs flex items-center gap-2 uppercase">
              <AlertTriangle className="w-4 h-4 stroke-[3] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photograph Upload Box */}
          <div>
            <label className="block font-mono font-black text-xs uppercase text-black mb-2 flex items-center justify-between">
              <span>ITEM PHOTOGRAPH (EVIDENCE) *</span>
              <span className="text-[10px] font-bold text-black/60">JPG, PNG, WEBP</span>
            </label>

            {!previewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-black bg-white hover:bg-[#FFE600]/30 p-8 text-center cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="p-3 bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="font-display font-black text-sm uppercase text-black">
                  CLICK TO UPLOAD OR DRAG & DROP PHOTO
                </div>
                <p className="font-mono text-[11px] text-black/60 uppercase">Max file size 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <div className="relative bg-[#E5E5DF] border-2 border-black p-3 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center min-h-[180px]">
                  <img src={previewUrl} alt="Preview" className={getPreviewFilterClass()} />

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-5 right-5 px-3 py-1 bg-black text-[#FFE600] font-mono font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-white hover:text-black transition-colors"
                  >
                    CHANGE PHOTO
                  </button>
                </div>

                {/* Pre-Processing Studio Toolbar */}
                <EnhancementToolbar
                  enhancements={enhancements}
                  onToggle={handleToggleEnhancement}
                />
              </div>
            )}
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1.5">
                ITEM TITLE / DESCRIPTION *
              </label>
              <input
                type="text"
                required
                placeholder="E.G. SPACE GRAY AIRPODS PRO"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] font-display font-black uppercase text-black outline-none placeholder:text-black/40 placeholder:font-mono"
              />
            </div>

            <div>
              <label className="block font-mono font-black text-xs uppercase text-black mb-1.5">
                CATEGORY *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] font-mono font-bold uppercase text-black outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-mono font-black text-xs uppercase text-black mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
              FOUND LOCATION ON CAMPUS *
            </label>
            <input
              type="text"
              required
              placeholder="E.G. SCIENCE HALL 204, ROW 4"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] font-display font-black uppercase text-black outline-none placeholder:text-black/40 placeholder:font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-white hover:bg-black hover:text-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#00F0FF] hover:bg-[#FFE600] active:bg-[#FF5C00] active:text-white text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black stroke-[3]" />
                  <span>PUBLISHING ITEM...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>PUBLISH TO CAMPUS FEED</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
