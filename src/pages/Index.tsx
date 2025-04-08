
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import VideoStream from "@/components/VideoStream";
import TranslationOutput from "@/components/TranslationOutput";

const Index = () => {
  const [translationText, setTranslationText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslationText = (text: string) => {
    setTranslationText(text);
    setIsTranslating(!!text || text === "");
  };
  
  // Listen for clear translation event
  useEffect(() => {
    const handleClearTranslation = () => {
      setTranslationText("");
    };
    
    window.addEventListener('clearTranslation', handleClearTranslation);
    
    return () => {
      window.removeEventListener('clearTranslation', handleClearTranslation);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-airbnb-white">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-airbnb-black">Sign Language Translator</h1>
            <p className="text-airbnb-light mt-3 text-lg">
              Start signing to translate sign language into text in real-time
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
            <div className="relative h-full">
              <VideoStream onTranslationText={handleTranslationText} />
            </div>
            <div className="flex items-center">
              <TranslationOutput 
                text={translationText} 
                isTranslating={isTranslating} 
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
