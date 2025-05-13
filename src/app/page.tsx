'use client';

import { useState } from 'react';
import { generateInteriorDesignVariations, type GenerateInteriorDesignVariationsInput } from '@/ai/flows/generate-interior-design-variations';
import { Header } from '@/components/visionary-spaces/Header';
import { Footer } from '@/components/visionary-spaces/Footer';
import { ImageUpload } from '@/components/visionary-spaces/ImageUpload';
import { DesignForm, type DesignFormValues } from '@/components/visionary-spaces/DesignForm';
import { DesignDisplay } from '@/components/visionary-spaces/DesignDisplay';
import { ImageModal } from '@/components/visionary-spaces/ImageModal';
import { useToast } from '@/hooks/use-toast';

export default function VisionarySpacesPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedDesigns, setGeneratedDesigns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
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
          variant: 'default',
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

  const handleOpenImageModal = (imageUrl: string) => {
    setSelectedImageForModal(imageUrl);
  };

  const handleCloseImageModal = () => {
    setSelectedImageForModal(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col gap-12"> {/* Main vertical stacking container */}
          
          {/* Section 1: Inputs - Image Upload and Design Form */}
          <div className="w-full max-w-2xl mx-auto space-y-8"> {/* Centered input section with max-width */}
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
          
          {/* Section 2: Outputs - Design Display */}
          <div className="w-full"> {/* Design display takes full width of container */}
            <DesignDisplay
              designs={generatedDesigns}
              isLoading={isLoading}
              hasAttemptedGeneration={hasAttemptedGeneration}
              onImageClick={handleOpenImageModal}
            />
          </div>

        </div>
      </main>
      <Footer />
      {selectedImageForModal && (
        <ImageModal
          imageUrl={selectedImageForModal}
          onClose={handleCloseImageModal}
        />
      )}
    </div>
  );
}
