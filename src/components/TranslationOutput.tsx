
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
    <Card className="w-full h-full flex flex-col justify-center border border-stripe-lightgray shadow-sm rounded-lg overflow-hidden bg-white">
      <CardHeader className="pb-2 border-b border-stripe-lightgray">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-stripe-black flex items-center">
            <span>Translation</span>
            {isTranslating && !text && (
              <span className="ml-2 w-2 h-5 bg-stripe-blue inline-block animate-blink"></span>
            )}
          </CardTitle>
          
          {text && (
            <Button 
              variant="ghost"
              size="sm"
              className="text-stripe-darkgray hover:text-stripe-blue hover:bg-transparent"
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
          <p className="text-xl leading-relaxed text-center text-stripe-darkblue">{text}</p>
        ) : (
          <p className="text-stripe-darkgray text-center text-lg">
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
