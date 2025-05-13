'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateInteriorDesignVariations, type GenerateInteriorDesignVariationsInput } from '@/ai/flows/generate-interior-design-variations';
import { detectRoomType, type DetectRoomTypeInput } from '@/ai/flows/detect-room-type-flow';
import { detectObjects, type DetectObjectsInput } from '@/ai/flows/detect-objects-flow';

import { Header } from '@/components/visionary-spaces/Header';
import { Footer } from '@/components/visionary-spaces/Footer';
import { ImageUpload } from '@/components/visionary-spaces/ImageUpload';
import { DesignForm, type DesignFormValues } from '@/components/visionary-spaces/DesignForm';
import { DesignDisplay } from '@/components/visionary-spaces/DesignDisplay';
import { ImageModal } from '@/components/visionary-spaces/ImageModal';
import { AiAnalysisDisplay } from '@/components/visionary-spaces/AiAnalysisDisplay';
import { useToast } from '@/hooks/use-toast';
import type { RoomType } from '@/lib/constants';
import { ROOM_TYPES } from '@/lib/constants';


export default function VisionarySpacesPage() {
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedDesigns, setGeneratedDesigns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  
  const [detectedRoomType, setDetectedRoomType] = useState<RoomType | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<Array<{ name: string }> | null>(null);
  const [isDetectingRoom, setIsDetectingRoom] = useState(false);
  const [isDetectingObjects, setIsDetectingObjects] = useState(false);
  const [lastDesignFormValues, setLastDesignFormValues] = useState<DesignFormValues | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    const name = searchParams.get('name');
    if (name) {
      setUserName(name);
    }
  }, [searchParams]);

  const performAiAnalysis = async (dataUri: string) => {
    setIsDetectingRoom(true);
    setIsDetectingObjects(true);
    setDetectedRoomType(null);
    setDetectedObjects(null);

    try {
      const roomTypePromise = detectRoomType({ photoDataUri: dataUri });
      const objectsPromise = detectObjects({ photoDataUri: dataUri });

      const [roomResult, objectsResult] = await Promise.allSettled([roomTypePromise, objectsPromise]);

      if (roomResult.status === 'fulfilled' && roomResult.value.roomType && ROOM_TYPES.includes(roomResult.value.roomType as any)) {
        setDetectedRoomType(roomResult.value.roomType as RoomType);
         toast({
          title: 'Room Type Detected',
          description: `AI identified the room as: ${roomResult.value.roomType}`,
        });
      } else {
        setDetectedRoomType(null);
        const errorMsg = roomResult.status === 'rejected' ? (roomResult.reason as Error).message : 'Could not determine room type.';
        console.warn('Room type detection failed or invalid:', errorMsg);
        toast({
          title: 'Room Type Detection',
          description: 'Could not automatically detect the room type.',
          variant: 'default',
        });
      }
      
      if (objectsResult.status === 'fulfilled' && objectsResult.value.detectedObjects) {
        setDetectedObjects(objectsResult.value.detectedObjects);
        if (objectsResult.value.detectedObjects.length > 0) {
          toast({
            title: 'Objects Detected',
            description: `AI identified ${objectsResult.value.detectedObjects.length} object(s) in the image.`,
          });
        } else {
           toast({
            title: 'Object Detection',
            description: 'No specific objects were identified by the AI.',
            variant: 'default',
          });
        }
      } else {
        setDetectedObjects(null);
        const errorMsg = objectsResult.status === 'rejected' ? (objectsResult.reason as Error).message : 'Object detection failed.';
        console.warn('Object detection failed:', errorMsg);
         toast({
          title: 'Object Detection Failed',
          description: 'Could not identify objects in the image.',
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('Error during AI analysis:', error);
      toast({
        title: 'AI Analysis Error',
        description: 'An error occurred while analyzing the image.',
        variant: 'destructive',
      });
      setDetectedRoomType(null);
      setDetectedObjects(null);
    } finally {
      setIsDetectingRoom(false);
      setIsDetectingObjects(false);
    }
  };


  const handleImageUpload = (dataUri: string) => {
    setUploadedImage(dataUri);
    setGeneratedDesigns([]); 
    setHasAttemptedGeneration(false);
    setLastDesignFormValues(null); // Clear last form values on new image upload
    performAiAnalysis(dataUri);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setGeneratedDesigns([]);
    setHasAttemptedGeneration(false);
    setDetectedRoomType(null);
    setDetectedObjects(null);
    setIsDetectingRoom(false);
    setIsDetectingObjects(false);
    setLastDesignFormValues(null);
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
    setLastDesignFormValues(data); // Store the current form values
    setIsLoading(true);
    setGeneratedDesigns([]);
    setHasAttemptedGeneration(true);

    const input: GenerateInteriorDesignVariationsInput = {
      photoDataUri: uploadedImage,
      roomType: data.roomType,
      interiorDesignStyle: data.interiorDesignStyle,
      colorPalette: data.colorPalette || undefined,
      furnitureStyle: data.furnitureStyle || undefined,
      budgetLevel: data.budgetLevel || undefined,
      lightingPreference: data.lightingPreference || undefined,
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

  const handleGenerateMore = async () => {
    if (lastDesignFormValues) {
      await handleFormSubmit(lastDesignFormValues);
    } else {
      // This case should ideally not be reached if button is shown conditionally
      toast({
        title: 'No Previous Settings',
        description: 'Please submit the form once to generate more variations.',
        variant: 'default',
      });
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
      <Header userName={userName} />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              currentImage={uploadedImage}
              clearImage={clearImage}
            />
             <AiAnalysisDisplay
              detectedRoomType={detectedRoomType}
              detectedObjects={detectedObjects}
              isDetectingRoom={isDetectingRoom}
              isDetectingObjects={isDetectingObjects}
              hasUploadedImage={!!uploadedImage}
            />
            <DesignForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              hasUploadedImage={!!uploadedImage}
              detectedRoomType={detectedRoomType}
            />
          </div>
          
          <div className="lg:col-span-7">
            <DesignDisplay
              designs={generatedDesigns}
              isLoading={isLoading}
              hasAttemptedGeneration={hasAttemptedGeneration}
              onImageClick={handleOpenImageModal}
              uploadedImage={uploadedImage} 
              onGenerateMore={handleGenerateMore}
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
