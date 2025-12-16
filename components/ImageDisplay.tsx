import React from 'react';
import { GeneratedImage } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  onDownload: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, onDownload }) => {
  if (!image) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 animate-fade-in-up">
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
        
        {/* Main Image Container */}
        <div className="relative group bg-black/50 min-h-[300px] flex items-center justify-center">
            <img 
              src={image.imageUrl} 
              alt={image.enhancedPrompt} 
              className="w-full h-auto object-contain max-h-[70vh]"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <button 
                  onClick={onDownload}
                  className="self-end bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3.25-3.25m-3.25 3.25l3.25 3.25m3.25-3.25h-6.5" />
                  </svg>
                  <span>Download</span>
                </button>
            </div>
        </div>

        {/* Details Section */}
        <div className="p-6">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-luminary-accent mb-1">Original Idea</h3>
                    <p className="text-gray-300 italic">"{image.originalPrompt}"</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-medium text-gray-300 whitespace-nowrap">
                    {image.style}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-luminary-secondary mb-1 flex items-center">
                    <span>Enhanced Prompt</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-luminary-secondary/20 text-luminary-secondary text-[10px] rounded">AI Optimized</span>
                   </h3>
                   <p className="text-sm text-gray-300 leading-relaxed font-light">{image.enhancedPrompt}</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};