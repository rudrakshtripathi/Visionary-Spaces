
'use client';

import type { ChangeEvent } from 'react';
import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, XCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageUploadProps {
  onImageUpload: (dataUri: string) => void;
  currentImage: string | null;
  clearImage: () => void;
}

export function ImageUpload({ onImageUpload, currentImage, clearImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setIsReadingFile(false);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (e.g., JPG, PNG, WEBP).",
        variant: "destructive",
      });
      setIsReadingFile(false);
      return;
    }
    // Max file size 4MB (Gemini API limit for inline data)
    if (file.size > 4 * 1024 * 1024) {
       toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 4MB.",
        variant: "destructive",
      });
      setIsReadingFile(false);
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      toast({
        title: "Error Reading File",
        description: "Could not read the selected file. Please try again.",
        variant: "destructive",
      });
      setIsReadingFile(false);
    }
    reader.readAsDataURL(file);
  }, [onImageUpload, toast]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isReadingFile) return;
    const file = event.target.files?.[0] || null;
    handleFileChange(file);
    // Reset the input value to allow re-selection of the same file
    if (event.currentTarget) {
      event.currentTarget.value = '';
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (isReadingFile) return;
    
    const file = event.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  }, [handleFileChange, isReadingFile]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isReadingFile) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isReadingFile) return;
    setIsDragging(false);
  };

  const handleClearImage = () => {
    clearImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Upload Your Space</CardTitle>
        <CardDescription>Let's start by uploading a photo of the room you want to transform.</CardDescription>
      </CardHeader>
      <CardContent>
        {currentImage ? (
          <div className="relative group aspect-video rounded-md overflow-hidden border border-dashed border-muted-foreground/50">
            <Image src={currentImage} alt="Uploaded room" layout="fill" objectFit="contain" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleClearImage}
              aria-label="Remove image"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        ) : isReadingFile ? (
           <div className="relative aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center p-6 bg-muted/10">
            <LoadingSpinner size={48} />
            <p className="text-sm text-muted-foreground mt-3 font-medium">Processing image...</p>
          </div>
        ) : (
          <div
            className={`relative aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center text-center p-6 group transition-colors
              ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary'}
              ${isReadingFile ? 'cursor-default' : 'cursor-pointer'}`}
            onDrop={isReadingFile ? undefined : handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isReadingFile && fileInputRef.current?.click()}
          >
            <UploadCloud className={`h-12 w-12 mb-3 text-muted-foreground group-hover:text-primary transition-colors ${isDragging ? 'text-primary' : ''}`} />
            <p className="font-semibold text-foreground">Click to upload or drag & drop</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 4MB</p>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleInputChange}
              disabled={isReadingFile}
            />
             {!isDragging && !currentImage && !isReadingFile && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <ImageIcon className="w-24 h-24 text-muted-foreground/10" data-ai-hint="abstract pattern" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
