
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Video, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoStreamProps {
  onTranslationText: (text: string) => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ onTranslationText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  const simulatedPhrases = [
    "Hello",
    "My name is",
    "Nice to meet you",
    "How are you doing today?",
    "I'm learning sign language",
    "This is a demonstration of Lexi"
  ];
  
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
    }
  };

  // Function to stop the video stream
  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
      setTranslating(false);
    }
  };

  // Toggle streaming
  const toggleStreaming = () => {
    if (streaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  // Toggle translation
  const toggleTranslation = () => {
    setTranslating(!translating);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // Simulate text generation when translating
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentPhraseIndex = 0;
    let currentText = "";

    const generateText = () => {
      if (translating && streaming) {
        if (currentPhraseIndex < simulatedPhrases.length) {
          currentText += (currentText ? " " : "") + simulatedPhrases[currentPhraseIndex];
          onTranslationText(currentText);
          currentPhraseIndex++;
          
          timeoutId = setTimeout(generateText, 2000);
        }
      } else {
        currentPhraseIndex = 0;
        currentText = "";
      }
    };

    if (translating && streaming) {
      onTranslationText(""); // Reset text when starting
      timeoutId = setTimeout(generateText, 1000);
    } else if (!translating) {
      clearTimeout(timeoutId);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [translating, streaming, onTranslationText]);

  return (
    <div className="flex flex-col gap-4">
      <div className="video-container aspect-video bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {!streaming && (
          <div className="video-overlay">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-lexi-blue/80 hover:bg-lexi-blue text-white border-none"
              onClick={startStream}
            >
              <Video className="mr-2 h-5 w-5" />
              Start Camera
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant={translating ? "destructive" : "default"}
          disabled={!streaming}
          onClick={toggleTranslation}
          className={!translating ? "bg-lexi-blue hover:bg-lexi-darkblue" : ""}
        >
          {translating ? (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Camera</DropdownMenuItem>
            <DropdownMenuItem>Translation Language</DropdownMenuItem>
            <DropdownMenuItem>Appearance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VideoStream;
