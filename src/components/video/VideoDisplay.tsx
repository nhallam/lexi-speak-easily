
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Video, VideoOff } from "lucide-react";

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  streaming: boolean;
  translating: boolean;
  loadingModel: boolean;
  onStartStream: () => Promise<void>;
  onToggleTranslation: () => void;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  videoRef,
  streaming,
  translating,
  loadingModel,
  onStartStream,
  onToggleTranslation
}) => {
  return (
    <div className="video-container aspect-video bg-black rounded-lg overflow-hidden flex-grow relative">
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
            onClick={onStartStream}
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
      
      {streaming && (
        <div className="absolute bottom-4 left-4">
          <Button
            variant={translating ? "destructive" : "default"}
            disabled={loadingModel}
            onClick={onToggleTranslation}
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
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
