'use client';

import Image from 'next/image';
import { Download, ImageOff, Image as ImageIconLucide } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';

interface DesignDisplayProps {
  designs: string[];
  isLoading: boolean;
  hasAttemptedGeneration: boolean;
}

export function DesignDisplay({ designs, isLoading, hasAttemptedGeneration }: DesignDisplayProps) {
  const handleDownload = (dataUri: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUri;
    // Attempt to infer file type from data URI, default to png
    const mimeTypeMatch = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const extension = mimeTypeMatch && mimeTypeMatch[1] ? mimeTypeMatch[1].split('/')[1] : 'png';
    link.download = `visionary_space_${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="flex-1 flex flex-col items-center justify-center min-h-[400px] shadow-lg animate-pulse">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Conjuring Your Visions...</CardTitle>
          <CardDescription>Our AI is hard at work crafting your new spaces. This might take a moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner size={64} />
        </CardContent>
      </Card>
    );
  }

  if (!hasAttemptedGeneration && designs.length === 0) {
    return (
       <Card className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-secondary/30 border-dashed">
        <CardHeader className="text-center">
            <ImageIconLucide className="w-16 h-16 text-muted-foreground mx-auto mb-4" data-ai-hint="interior design blueprint" />
            <CardTitle className="text-2xl">Your Designs Will Appear Here</CardTitle>
            <CardDescription>Upload an image and set your preferences to get started.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (hasAttemptedGeneration && designs.length === 0 && !isLoading) {
    return (
      <Card className="flex-1 flex flex-col items-center justify-center min-h-[400px] shadow-lg">
        <CardHeader className="text-center">
          <ImageOff className="w-16 h-16 text-destructive mx-auto mb-4" />
          <CardTitle className="text-2xl">No Designs Generated</CardTitle>
          <CardDescription>We couldn't generate designs this time. Please try adjusting your inputs or try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }


  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Generated Designs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((designUri, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <CardContent className="p-0">
              <div className="aspect-video relative bg-muted">
                <Image
                  src={designUri}
                  alt={`Generated Design ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="modern living room"
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-card">
              <Button
                onClick={() => handleDownload(designUri, index)}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Design {index + 1}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
