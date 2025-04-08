
import React, { useRef, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import VideoDisplay from "./video/VideoDisplay";
import VideoSettings from "./video/VideoSettings";
import { useSignLanguageDetection } from "@/hooks/useSignLanguageDetection";

interface VideoStreamProps {
  onTranslationText: (text: string) => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ onTranslationText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  
  const { 
    translating, 
    loadingModel, 
    modelLoaded,
    toggleTranslation, 
    clearTranslation 
  } = useSignLanguageDetection({
    videoRef,
    onDetectedText: onTranslationText
  });
  
  // Function to handle starting the video stream
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions."
      });
    }
  };

  // Function to stop the video stream
  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  // Handle clear translation from settings
  const handleClearTranslation = () => {
    clearTranslation();
    toast({
      title: "Translation Cleared",
      description: "Translation has been cleared."
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      <VideoDisplay
        videoRef={videoRef}
        streaming={streaming}
        translating={translating}
        loadingModel={loadingModel}
        onStartStream={startStream}
        onToggleTranslation={toggleTranslation}
      />

      <div className="absolute bottom-4 right-4">
        <VideoSettings onClearTranslation={handleClearTranslation} />
      </div>
    </div>
  );
};

export default VideoStream;
