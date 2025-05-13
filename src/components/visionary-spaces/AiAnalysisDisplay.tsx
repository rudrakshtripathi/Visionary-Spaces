
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Eye, Tag, Home } from 'lucide-react';

interface AiAnalysisDisplayProps {
  detectedRoomType: string | null;
  detectedObjects: Array<{ name: string }> | null;
  isDetectingRoom: boolean;
  isDetectingObjects: boolean;
  hasUploadedImage: boolean;
}

export function AiAnalysisDisplay({
  detectedRoomType,
  detectedObjects,
  isDetectingRoom,
  isDetectingObjects,
  hasUploadedImage,
}: AiAnalysisDisplayProps) {
  if (!hasUploadedImage && !isDetectingRoom && !isDetectingObjects) {
    return null; 
  }

  const showAnalysisCard = isDetectingRoom || isDetectingObjects || detectedRoomType || (detectedObjects && detectedObjects.length > 0);

  if (!showAnalysisCard && !hasUploadedImage) {
      return null;
  }
   if (!showAnalysisCard && hasUploadedImage && !isDetectingRoom && !isDetectingObjects) {
     return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-primary" />
                Our AI Analysis !!
                </CardTitle>
                <CardDescription>
                Upload an image to see AI insights.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Analysis results will appear here once an image is processed.</p>
            </CardContent>
        </Card>
     )
   }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5 text-primary" />
          Our AI Analysis !!
        </CardTitle>
        <CardDescription>
          {isDetectingRoom || isDetectingObjects ? "Analyzing your image..." : "Here's what the AI found in your image."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDetectingRoom && (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size={20} />
            <span className="text-sm text-muted-foreground">Detecting room type...</span>
          </div>
        )}
        {!isDetectingRoom && detectedRoomType && (
          <div>
            <h4 className="text-sm font-medium flex items-center">
              <Home className="mr-2 h-4 w-4 text-primary/80" />
              Detected Room Type
            </h4>
            <p className="text-md">{detectedRoomType}</p>
          </div>
        )}
         {!isDetectingRoom && !detectedRoomType && hasUploadedImage && !isDetectingObjects && ( // Check hasUploadedImage
             <p className="text-sm text-muted-foreground">Could not detect room type for this image.</p>
        )}


        {isDetectingObjects && (
          <div className="flex items-center space-x-2 mt-4">
            <LoadingSpinner size={20} />
            <span className="text-sm text-muted-foreground">Detecting objects...</span>
          </div>
        )}
        {!isDetectingObjects && detectedObjects && detectedObjects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium flex items-center mt-4">
              <Tag className="mr-2 h-4 w-4 text-primary/80" />
              Detected Objects
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {detectedObjects.map((obj, index) => (
                <Badge key={index} variant="secondary">
                  {obj.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {!isDetectingObjects && detectedObjects && detectedObjects.length === 0 && hasUploadedImage && !isDetectingRoom &&( // Check hasUploadedImage
            <p className="text-sm text-muted-foreground mt-4">No distinct objects were recognized in this image.</p>
        )}
         {/* Fallback message if nothing is detected and not loading */}
         {!isDetectingRoom && !isDetectingObjects && !detectedRoomType && (!detectedObjects || detectedObjects.length === 0) && hasUploadedImage && (
           <p className="text-sm text-muted-foreground">AI analysis could not identify room type or objects. Please ensure the image is clear or try a different one.</p>
         )}
      </CardContent>
    </Card>
  );
}
