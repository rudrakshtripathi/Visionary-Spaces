'use client';

import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { UploadCloud, XCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (dataUri: string) => void;
  currentImage: string | null;
  clearImage: () => void;
}

export function ImageUpload({ onImageUpload, currentImage, clearImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (e.g., JPG, PNG, WEBP).",
          variant: "destructive",
        });
        return;
      }
      // Max file size 4MB (Gemini API limit for inline data)
      if (file.size > 4 * 1024 * 1024) {
         toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error Reading File",
          description: "Could not read the selected file. Please try again.",
          variant: "destructive",
        });
      }
      reader.readAsDataURL(file);
    }
  }, [onImageUpload, toast]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileChange(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

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
              onClick={clearImage}
              aria-label="Remove image"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div
            className={`relative aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center text-center p-6 cursor-pointer group hover:border-primary transition-colors
              ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <UploadCloud className={`h-12 w-12 mb-3 text-muted-foreground group-hover:text-primary transition-colors ${isDragging ? 'text-primary' : ''}`} />
            <p className="font-semibold text-foreground">Click to upload or drag & drop</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 4MB</p>
            <Input
              id="file-upload"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleInputChange}
            />
             {!isDragging && !currentImage && (
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
