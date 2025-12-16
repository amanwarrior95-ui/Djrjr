import React from 'react';
import { promptApiKeySelection } from '../services/geminiService';

interface ApiKeyModalProps {
  onKeySelected: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySelected }) => {
  const handleConnect = async () => {
    try {
      await promptApiKeySelection();
      // We assume success after the promise resolves (or check again in parent)
      onKeySelected();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-luminary-accent to-luminary-secondary rounded-full flex items-center justify-center animate-pulse-slow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-display font-bold text-white mb-2">Unlock Premium Creation</h2>
        <p className="text-gray-400 mb-6">
          To generate stunning, high-quality images with Gemini 3 Pro, please connect your Google Cloud Project with a valid billing account.
        </p>

        <button 
          onClick={handleConnect}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/20"
        >
          Connect API Key
        </button>

        <p className="mt-4 text-xs text-gray-500">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
            Learn more about billing and API keys
          </a>
        </p>
      </div>
    </div>
  );
};