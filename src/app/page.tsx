'use client';

import { useState } from 'react';
import { generateInteriorDesignVariations, type GenerateInteriorDesignVariationsInput } from '@/ai/flows/generate-interior-design-variations';
import { Header } from '@/components/visionary-spaces/Header';
import { Footer } from '@/components/visionary-spaces/Footer';
import { ImageUpload } from '@/components/visionary-spaces/ImageUpload';
import { DesignForm, type DesignFormValues } from '@/components/visionary-spaces/DesignForm';
import { DesignDisplay } from '@/components/visionary-spaces/DesignDisplay';
import { useToast } from '@/hooks/use-toast';

export default function VisionarySpacesPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedDesigns, setGeneratedDesigns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (dataUri: string) => {
    setUploadedImage(dataUri);
    setGeneratedDesigns([]); // Clear previous designs when a new image is uploaded
    setHasAttemptedGeneration(false);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setGeneratedDesigns([]);
    setHasAttemptedGeneration(false);
  }

  const handleFormSubmit = async (data: DesignFormValues) => {
    if (!uploadedImage) {
      toast({
        title: 'No Image Uploaded',
        description: 'Please upload an image of your space first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedDesigns([]);
    setHasAttemptedGeneration(true);

    const input: GenerateInteriorDesignVariationsInput = {
      photoDataUri: uploadedImage,
      roomType: data.roomType,
      interiorDesignStyle: data.interiorDesignStyle,
      designDescription: data.designDescription || undefined,
    };

    try {
      const result = await generateInteriorDesignVariations(input);
      if (result.redesignedImages && result.redesignedImages.length > 0) {
        setGeneratedDesigns(result.redesignedImages);
        toast({
          title: 'Designs Generated!',
          description: 'Your visionary spaces are ready.',
        });
      } else {
        setGeneratedDesigns([]);
         toast({
          title: 'No Designs Returned',
          description: 'The AI didn\'t return any designs. Try adjusting your prompt.',
          variant: 'default', // Changed from destructive to default as it's not a critical error
        });
      }
    } catch (error) {
      console.error('Error generating designs:', error);
      setGeneratedDesigns([]);
      toast({
        title: 'Error Generating Designs',
        description: (error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 lg:col-span-4 space-y-8 sticky top-8">
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              currentImage={uploadedImage}
              clearImage={clearImage}
            />
            <DesignForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              hasUploadedImage={!!uploadedImage}
            />
          </div>
          <div className="md:col-span-7 lg:col-span-8">
            <DesignDisplay
              designs={generatedDesigns}
              isLoading={isLoading}
              hasAttemptedGeneration={hasAttemptedGeneration}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
