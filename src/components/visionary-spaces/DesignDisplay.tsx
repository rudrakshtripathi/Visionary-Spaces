
'use client';

import Image from 'next/image';
import { Download, ImageOff, Image as ImageIconLucide, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { useEffect, useState } from 'react';

interface DesignDisplayProps {
  designs: string[];
  isLoading: boolean;
  hasAttemptedGeneration: boolean;
  onImageClick: (imageUrl: string) => void;
  uploadedImage: string | null; 
}

const inspiringQuotes = [
  "Redesign the space. Redefine the vibe.",
  "Where AI meets aesthetic — your dream space awaits.",
  "Transform your room with a single click.",
  "Smart interiors, stunning results.",
  "Design beyond imagination — powered by AI.",
  "Upload. Imagine. Live beautifully.",
  "Your room deserves more than just walls.",
  "Style your space with the magic of AI.",
  "AI-crafted spaces. Human-inspired comfort.",
  "Because every corner tells a story."
];

export function DesignDisplay({ designs, isLoading, hasAttemptedGeneration, onImageClick, uploadedImage }: DesignDisplayProps) {
  const [currentQuote, setCurrentQuote] = useState(inspiringQuotes[0]);

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setCurrentQuote(inspiringQuotes[Math.floor(Math.random() * inspiringQuotes.length)]);
      }, 3000); 
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const handleDownload = (dataUri: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUri;
    const mimeTypeMatch = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const extension = mimeTypeMatch && mimeTypeMatch[1] ? mimeTypeMatch[1].split('/')[1] : 'png';
    link.download = `visionary_space_generated_${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="flex-1 w-full flex flex-col items-center justify-center min-h-[400px] shadow-lg">
        <CardHeader> 
          <CardTitle className="text-2xl mb-2">Conjuring Your Visions...</CardTitle>
          <CardDescription className="italic text-muted-foreground min-h-[40px]">{currentQuote}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center"> 
          <LoadingSpinner size={64} />
        </CardContent>
      </Card>
    );
  }

  if (!hasAttemptedGeneration && designs.length === 0) {
    return (
       <Card className="flex-1 w-full flex flex-col items-start justify-center min-h-[400px] bg-secondary/30 border-dashed"> 
        <CardHeader> 
            <ImageIconLucide className="w-16 h-16 text-muted-foreground mb-4" data-ai-hint="interior design blueprint" /> 
            <CardTitle className="text-2xl">Your Designs Will Appear Here</CardTitle>
            <CardDescription>Upload an image and set your preferences to get started.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (hasAttemptedGeneration && designs.length === 0 && !isLoading) {
    return (
      <Card className="flex-1 w-full flex flex-col items-start justify-center min-h-[400px] shadow-lg"> 
        <CardHeader> 
          <ImageOff className="w-16 h-16 text-destructive mb-4" /> 
          <CardTitle className="text-2xl">No Designs Generated</CardTitle>
          <CardDescription>We couldn't generate designs this time. Please try adjusting your inputs or try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }


  if (designs.length > 0 && !isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Generated Designs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6"> {/* Adjusted to 2 columns for xl and 2xl for better fit */}
          {designs.map((designUri, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardContent className="p-0 relative flex-grow">
                {uploadedImage ? (
                  <BeforeAfterSlider 
                    beforeImage={uploadedImage} 
                    afterImage={designUri}
                    altBefore={`Original space for design ${index + 1}`}
                    altAfter={`Generated Design ${index + 1}`}
                  />
                ) : (
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={designUri}
                      alt={`Generated Design ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="modern living room"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-3 sm:p-4 bg-card border-t flex justify-between items-center gap-2">
                <Button
                  onClick={() => handleDownload(designUri, index)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="mr-1.5 sm:mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={() => onImageClick(designUri)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Expand className="mr-1.5 sm:mr-2 h-4 w-4" />
                  Expand
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null; 
}
