
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TranslationOutputProps {
  text: string;
  isTranslating: boolean;
}

const TranslationOutput: React.FC<TranslationOutputProps> = ({ text, isTranslating }) => {
  return (
    <Card className="w-full h-full flex flex-col justify-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-center">
          <span>Translation</span>
          {isTranslating && !text && (
            <span className="ml-2 w-2 h-5 bg-lexi-blue inline-block animate-blink"></span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {text ? (
          <p className="text-lg leading-relaxed text-center">{text}</p>
        ) : (
          <p className="text-muted-foreground text-center">
            {isTranslating 
              ? "Waiting for signs to translate..."
              : "Press start to begin translation"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationOutput;
