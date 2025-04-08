
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TranslationOutputProps {
  text: string;
  isTranslating: boolean;
}

const TranslationOutput: React.FC<TranslationOutputProps> = ({ text, isTranslating }) => {
  return (
    <Card className="w-full h-full flex flex-col justify-center">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span>Translation</span>
            {isTranslating && !text && (
              <span className="ml-2 w-2 h-5 bg-lexi-blue inline-block animate-blink"></span>
            )}
          </CardTitle>
          
          {text && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                // We'll handle this through the parent component
                window.dispatchEvent(new CustomEvent('clearTranslation'));
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {text ? (
          <p className="text-lg leading-relaxed text-center">{text}</p>
        ) : (
          <p className="text-muted-foreground text-center">
            {isTranslating 
              ? "Watching for sign language gestures..."
              : "Press start to begin translation"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationOutput;
