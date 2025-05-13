
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  altBefore = "Original image",
  altAfter = "Generated image",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // Percentage (0-100)
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (value: number[]) => {
    setSliderPosition(value[0]);
  };

  const afterImageStyle = {
    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
  };

  const sliderThumbStyle = {
    left: `calc(${sliderPosition}% - 8px)`, // Adjust 8px based on thumb width (16px / 2)
  };

  return (
    <div ref={imageContainerRef} className="relative w-full aspect-video overflow-hidden group cursor-ew-resize">
      {/* After Image (Top Layer, clipped to the left of the handle) */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <Image
          src={afterImage}
          alt={altAfter}
          layout="fill"
          objectFit="cover"
          priority // Preload the most important image
          data-ai-hint="redesigned room"
        />
      </div>
      
      {/* Before Image (Visible to the right of the handle, clipped by the after image's style) */}
      <div className="absolute inset-0 select-none pointer-events-none" style={afterImageStyle}>
        <Image
          src={beforeImage}
          alt={altBefore}
          layout="fill"
          objectFit="cover"
          data-ai-hint="original room"
        />
      </div>

      {/* Slider Control - Absolute positioned to overlay images */}
      <div className="absolute inset-0 top-auto bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 z-10 
                      opacity-80 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
        <Slider
          defaultValue={[sliderPosition]}
          min={0}
          max={100}
          step={0.1} // Finer control
          onValueChange={handleSliderChange}
          className="w-full h-2 
                     [&_span[role=slider]]:bg-white 
                     [&_span[role=slider]]:border-2 
                     [&_span[role=slider]]:border-primary 
                     [&_span[role=slider]]:shadow-md 
                     [&_span[role=slider]]:w-4 
                     [&_span[role=slider]]:h-4 
                     [&_span[role=slider]]:focus-visible:ring-primary/50
                     [&>span:first-child]:bg-primary/30"
          aria-label="Before and after image comparison slider"
        />
      </div>
       {/* Vertical Drag Handle Line - Visual indicator for the slider position */}
       <div
        className="absolute top-0 bottom-0 w-1 bg-primary/70 pointer-events-none z-5 group-hover:bg-primary transition-colors duration-200"
        style={sliderThumbStyle} // This will position the line based on slider value
      ></div>
    </div>
  );
}
