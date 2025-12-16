import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ImageDisplay } from './components/ImageDisplay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { checkApiKeySelection, enhanceUserPrompt, generateImageFromPrompt } from './services/geminiService';
import { AspectRatio, GeneratedImage, GenerationStatus, ImageStyle } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial check for API Key capability
  useEffect(() => {
    const verifyKey = async () => {
      try {
        const hasKey = await checkApiKeySelection();
        setHasApiKey(hasKey);
      } catch (e) {
        console.error("Error checking API key status", e);
        setHasApiKey(false);
      } finally {
        setCheckingKey(false);
      }
    };
    verifyKey();
  }, []);

  const handleGenerate = async (originalPrompt: string, aspectRatio: AspectRatio, style: ImageStyle) => {
    setStatus(GenerationStatus.ENHANCING_PROMPT);
    setErrorMsg(null);
    setCurrentImage(null);

    try {
      // Step 1: Enhance the prompt with style context
      const enhancedPrompt = await enhanceUserPrompt(originalPrompt, style);
      
      setStatus(GenerationStatus.GENERATING_IMAGE);

      // Step 2: Generate the image
      const imageUrl = await generateImageFromPrompt(enhancedPrompt, aspectRatio);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        originalPrompt,
        enhancedPrompt,
        imageUrl,
        aspectRatio,
        style,
        timestamp: Date.now()
      };

      setCurrentImage(newImage);
      setStatus(GenerationStatus.SUCCESS);

    } catch (error: any) {
      console.error("Generation failed:", error);
      setStatus(GenerationStatus.ERROR);
      
      // Handle specific "Requested entity was not found" error which implies key issues
      if (error.message && error.message.includes("Requested entity was not found")) {
        setHasApiKey(false); // Force re-selection
        setErrorMsg("API Key validation failed. Please select your key again.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.imageUrl;
      link.download = `luminary-ai-${currentImage.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleKeySelected = async () => {
    // Guidelines: Assume success to avoid race condition. 
    setHasApiKey(true);
  };

  if (checkingKey) {
    return (
      <div className="min-h-screen bg-luminary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luminary-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white selection:bg-luminary-secondary selection:text-white pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-luminary-800 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-7xl mx-auto pt-8">
        <Header />

        {!hasApiKey ? (
          <ApiKeyModal onKeySelected={handleKeySelected} />
        ) : (
          <>
            <main className="w-full flex flex-col items-center mt-8">
              <InputArea onGenerate={handleGenerate} status={status} />
              
              {errorMsg && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl max-w-md text-center">
                  {errorMsg}
                </div>
              )}

              <ImageDisplay image={currentImage} onDownload={handleDownload} />
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;