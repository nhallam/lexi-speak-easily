
import React, { useState } from "react";
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-lexi-black">Lexi Sign Language Translator</h1>
            <p className="text-lexi-darkgray mt-2">
              Start signing to translate sign language into text in real-time
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <VideoStream onTranslationText={handleTranslationText} />
            </div>
            <div>
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
