
'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <Dialog open={!!imageUrl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] p-0 max-h-[90vh]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Design Preview</DialogTitle>
          <DialogClose asChild>
             <Button variant="ghost" size="icon" className="absolute right-4 top-3">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="p-1 flex justify-center items-center max-h-[calc(90vh-80px)] overflow-auto">
           <Image
            src={imageUrl}
            alt="Enlarged design"
            width={1920} 
            height={1080}
            className="max-w-full max-h-full object-contain rounded-md"
            data-ai-hint="interior design detail" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
