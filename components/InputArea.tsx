import React, { useState } from 'react';
import { AspectRatio, GenerationStatus, ImageStyle } from '../types';

interface InputAreaProps {
  onGenerate: (prompt: string, ratio: AspectRatio, style: ImageStyle) => void;
  status: GenerationStatus;
}

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, status }) => {
  const [input, setInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(ImageStyle.CINEMATIC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && (status === GenerationStatus.IDLE || status === GenerationStatus.SUCCESS || status === GenerationStatus.ERROR)) {
      onGenerate(input, aspectRatio, selectedStyle);
    }
  };

  const isProcessing = status === GenerationStatus.ENHANCING_PROMPT || status === GenerationStatus.GENERATING_IMAGE;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 z-10">
      <div className="glass-panel rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        {/* Animated border gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luminary-accent to-transparent opacity-50"></div>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your idea... e.g., 'Ek udta hua futuristic car barish mein'"
              className="w-full bg-black/30 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-luminary-accent resize-none h-32 transition-all"
              disabled={isProcessing}
            />
            {input.length > 0 && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute top-3 right-3 text-gray-500 hover:text-white"
                disabled={isProcessing}
              >
                ✕
              </button>
            )}
          </div>

          {/* Style Selector */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Art Style</label>
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
              {Object.values(ImageStyle).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    selectedStyle === style
                      ? 'bg-luminary-accent/20 border-luminary-accent text-luminary-accent shadow-[0_0_10px_rgba(0,212,255,0.3)]'
                      : 'bg-black/20 border-gray-700 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                  disabled={isProcessing}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Generate Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-1">
              {[
                { label: 'Portrait', value: AspectRatio.PORTRAIT, icon: '📱' },
                { label: 'Square', value: AspectRatio.SQUARE, icon: '⏹️' },
                { label: 'Wide', value: AspectRatio.LANDSCAPE, icon: '🖥️' },
              ].map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                    aspectRatio === ratio.value
                      ? 'bg-gray-700 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  disabled={isProcessing}
                >
                  <span>{ratio.icon}</span>
                  <span className="hidden sm:inline">{ratio.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2 ${
                !input.trim() || isProcessing
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-luminary-secondary to-purple-600 hover:shadow-purple-500/30'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{status === GenerationStatus.ENHANCING_PROMPT ? 'Enhancing...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <span>✨</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};