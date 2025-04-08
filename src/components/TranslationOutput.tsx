
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
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-airbnb-black flex items-center">
            <span>Translation</span>
            {isTranslating && !text && (
              <span className="ml-2 w-2 h-5 bg-airbnb-red inline-block animate-blink"></span>
            )}
          </CardTitle>
          
          {text && (
            <Button 
              variant="ghost"
              size="sm"
              className="text-airbnb-light hover:text-airbnb-red hover:bg-transparent"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('clearTranslation'));
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-8">
        {text ? (
          <p className="text-xl leading-relaxed text-center text-airbnb-dark">{text}</p>
        ) : (
          <p className="text-airbnb-light text-center text-lg">
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
