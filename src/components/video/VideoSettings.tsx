
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoSettingsProps {
  onClearTranslation: () => void;
}

const VideoSettings: React.FC<VideoSettingsProps> = ({ onClearTranslation }) => {
  return (
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
        <DropdownMenuItem onClick={onClearTranslation}>
          Clear Translation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoSettings;
