import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Smartphone } from 'lucide-react';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  caption: string;
  onRegenerateCaption: () => void;
  isRegenerating: boolean;
}

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, caption, onRegenerateCaption, isRegenerating 
}) => {
  const [editedCaption, setEditedCaption] = useState(caption);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedCaption(caption);
  }, [caption]);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(editedCaption).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const handleCopyImage = async () => {
    if (!image) return;
    
    try {
      const response = await fetch(`data:image/png;base64,${image}`);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
      alert("Could not copy image to clipboard. Please save it manually.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col md:flex-row max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-3 right-3 p-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
          <X size={20} />
        </button>

        {/* Left Side: Image Preview */}
        <div className="md:w-1/2 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6 relative">
             {image ? (
                 <div className="relative shadow-xl rounded-lg overflow-hidden group">
                     <img 
                        src={`data:image/png;base64,${image}`} 
                        alt="Social Media Post" 
                        className="max-w-full max-h-[60vh] object-contain"
                     />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            onClick={handleCopyImage}
                            className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                         >
                            {copiedImage ? <Check size={18} /> : <ImageIcon size={18} />}
                            {copiedImage ? 'Copied!' : 'Copy Image'}
                         </button>
                     </div>
                 </div>
             ) : (
                 <div className="flex flex-col items-center text-slate-400">
                     <ImageIcon size={48} className="mb-2" />
                     <p>No image generated</p>
                 </div>
             )}
        </div>

        {/* Right Side: Caption Editor */}
        <div className="md:w-1/2 flex flex-col h-full bg-white dark:bg-slate-900">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-pink-500" />
                    <h3 className="font-bold text-slate-800 dark:text-white">Social Studio</h3>
                </div>
                <button 
                    onClick={onRegenerateCaption}
                    disabled={isRegenerating}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-primary-500 disabled:opacity-50"
                >
                    <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
                    Regenerate Text
                </button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto">
                <textarea 
                    className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 font-sans text-sm leading-relaxed"
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    placeholder="Generating caption..."
                ></textarea>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <button 
                    onClick={handleCopyText}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary-500/30"
                >
                    {copiedText ? <Check size={18} /> : <Copy size={18} />}
                    {copiedText ? 'Caption Copied!' : 'Copy Caption'}
                </button>
                <p className="text-center text-xs text-slate-400 mt-2">
                    Paste image & text into Instagram, Facebook, or Meta Suite.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SocialMediaModal;
