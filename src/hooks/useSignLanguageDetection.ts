
import { useRef, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { loadHandposeModel, createGestureEstimator, detectSignGesture } from "@/utils/signLanguageDetection";

interface UseSignLanguageDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onDetectedText: (text: string) => void;
}

export function useSignLanguageDetection({ 
  videoRef, 
  onDetectedText 
}: UseSignLanguageDetectionProps) {
  const [translating, setTranslating] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const requestRef = useRef<number>();
  const modelRef = useRef<any>(null);
  const gestureEstimatorRef = useRef<any>(null);
  const detectedGesturesRef = useRef<string[]>([]);

  // Function to load the handpose model
  const loadModel = async () => {
    try {
      setLoadingModel(true);
      toast({
        title: "Loading Model",
        description: "Loading sign language detection model..."
      });
      
      // Load the handpose model
      const model = await loadHandposeModel();
      modelRef.current = model;
      
      // Create gesture estimator
      const gestureEstimator = createGestureEstimator();
      gestureEstimatorRef.current = gestureEstimator;
      
      setModelLoaded(true);
      setLoadingModel(false);
      
      toast({
        title: "Model Loaded",
        description: "Sign language detection model loaded!"
      });
    } catch (err) {
      console.error("Error loading model:", err);
      toast({
        variant: "destructive",
        title: "Model Error",
        description: "Failed to load sign language detection model."
      });
      setLoadingModel(false);
    }
  };

  // Toggle translation
  const toggleTranslation = () => {
    if (!translating && !modelLoaded && !loadingModel) {
      toast({
        title: "Loading Model",
        description: "Please wait while the model loads..."
      });
      loadModel().then(() => {
        setTranslating(true);
      });
    } else {
      setTranslating(!translating);
    }
    
    // Reset detected gestures when starting new translation
    if (!translating) {
      clearTranslation();
    }
  };

  // Clear translation
  const clearTranslation = () => {
    detectedGesturesRef.current = [];
    onDetectedText("");
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
            onDetectedText(translationText);
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

  // Start/stop detection when translating state changes
  useEffect(() => {
    if (translating) {
      requestRef.current = requestAnimationFrame(detectSigns);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [translating]);

  return {
    translating,
    loadingModel,
    modelLoaded,
    toggleTranslation,
    clearTranslation,
    loadModel
  };
}
