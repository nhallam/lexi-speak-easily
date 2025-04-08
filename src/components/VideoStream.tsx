
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
import { loadHandposeModel, createGestureEstimator, detectSignGesture } from "@/utils/signLanguageDetection";
import { toast } from "@/hooks/use-toast";

interface VideoStreamProps {
  onTranslationText: (text: string) => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ onTranslationText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const requestRef = useRef<number>();
  const modelRef = useRef<any>(null);
  const gestureEstimatorRef = useRef<any>(null);
  const detectedGesturesRef = useRef<string[]>([]);
  
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
        
        // Load model if not already loaded
        if (!modelLoaded && !loadingModel) {
          await loadModel();
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  // Function to load the handpose model
  const loadModel = async () => {
    try {
      setLoadingModel(true);
      toast.info("Loading sign language detection model...");
      
      // Load the handpose model
      const model = await loadHandposeModel();
      modelRef.current = model;
      
      // Create gesture estimator
      const gestureEstimator = createGestureEstimator();
      gestureEstimatorRef.current = gestureEstimator;
      
      setModelLoaded(true);
      setLoadingModel(false);
      
      toast.success("Sign language detection model loaded!");
    } catch (err) {
      console.error("Error loading model:", err);
      toast.error("Failed to load sign language detection model.");
      setLoadingModel(false);
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
    if (!translating && !modelLoaded && !loadingModel) {
      toast.info("Please wait while the model loads...");
      loadModel().then(() => {
        setTranslating(true);
      });
    } else {
      setTranslating(!translating);
    }
    
    // Reset detected gestures when starting new translation
    if (!translating) {
      detectedGesturesRef.current = [];
      onTranslationText("");
    }
  };

  // Perform sign language detection
  const detectSigns = async () => {
    if (translating && modelRef.current && videoRef.current && gestureEstimatorRef.current) {
      try {
        const gesture = await detectSignGesture(
          modelRef.current,
          videoRef.current,
          gestureEstimatorRef.current
        );
        
        if (gesture) {
          // Avoid duplicate consecutive gestures
          const lastGesture = detectedGesturesRef.current[detectedGesturesRef.current.length - 1];
          
          if (gesture !== lastGesture) {
            detectedGesturesRef.current.push(gesture);
            
            // Update translation text
            const translationText = detectedGesturesRef.current.join(" ");
            onTranslationText(translationText);
          }
        }
      } catch (error) {
        console.error("Error in sign detection:", error);
      }
    }
    
    // Continue the animation loop
    if (translating) {
      requestRef.current = requestAnimationFrame(detectSigns);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Start/stop detection when translating state changes
  useEffect(() => {
    if (translating) {
      requestRef.current = requestAnimationFrame(detectSigns);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, [translating]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="video-container aspect-video bg-black rounded-lg overflow-hidden flex-grow">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {!streaming && (
          <div className="video-overlay absolute inset-0 flex items-center justify-center">
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
        
        {loadingModel && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading model...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4 absolute bottom-4 left-0 right-0 px-4">
        <Button
          variant={translating ? "destructive" : "default"}
          disabled={!streaming || loadingModel}
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
              Start{loadingModel ? " (Loading...)" : ""}
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
            <DropdownMenuItem onClick={() => {
              detectedGesturesRef.current = [];
              onTranslationText("");
              toast.success("Translation cleared");
            }}>
              Clear Translation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VideoStream;
