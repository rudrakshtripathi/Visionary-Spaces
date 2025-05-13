
'use client';

import { useEffect } from 'react'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Wand2, Palette, Sofa, Wallet, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROOM_TYPES, DESIGN_STYLES, COLOR_PALETTES, FURNITURE_STYLES, BUDGET_LEVELS, LIGHTING_PREFERENCES, type RoomType, type DesignStyle, type ColorPaletteOption, type FurnitureStyleOption, type BudgetLevelOption, type LightingPreferenceOption } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  roomType: z.string().min(1, "Room type is required."),
  interiorDesignStyle: z.string().min(1, "Design style is required."),
  colorPalette: z.string().optional(),
  furnitureStyle: z.string().optional(),
  budgetLevel: z.string().optional(),
  lightingPreference: z.string().optional(),
  designDescription: z.string().max(500, "Description must be 500 characters or less.").optional(),
});

export type DesignFormValues = z.infer<typeof formSchema>;

interface DesignFormProps {
  onSubmit: (data: DesignFormValues) => void;
  isLoading: boolean;
  hasUploadedImage: boolean;
  detectedRoomType?: RoomType | null; 
}

export function DesignForm({ onSubmit, isLoading, hasUploadedImage, detectedRoomType }: DesignFormProps) {
  const form = useForm<DesignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "",
      interiorDesignStyle: "",
      colorPalette: "",
      furnitureStyle: "",
      budgetLevel: "",
      lightingPreference: "",
      designDescription: "",
    },
  });

  useEffect(() => {
    if (detectedRoomType && ROOM_TYPES.includes(detectedRoomType as any)) {
      if (form.getValues('roomType') !== detectedRoomType) {
        form.setValue('roomType', detectedRoomType, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [detectedRoomType, form]);


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Define Your Vision</CardTitle>
        <CardDescription>Tell us about the space and your desired aesthetic.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-60">
                        {ROOM_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interiorDesignStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interior Design Style</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a design style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <ScrollArea className="h-60">
                        {DESIGN_STYLES.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="customizations">
                <AccordionTrigger className="text-sm font-medium text-primary hover:no-underline">
                  Advanced Customizations (Optional)
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="colorPalette"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" /> Color Palette</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a color palette" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-48">
                              {COLOR_PALETTES.map((palette) => (
                                <SelectItem key={palette.name} value={palette.name}>
                                  {palette.name} ({palette.primary} & {palette.secondary})
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="furnitureStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Sofa className="mr-2 h-4 w-4 text-muted-foreground" /> Furniture Style</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a furniture style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-48">
                              {FURNITURE_STYLES.map((style) => (
                                <SelectItem key={style} value={style}>
                                  {style}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Wallet className="mr-2 h-4 w-4 text-muted-foreground" /> Budget Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a budget level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {BUDGET_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lightingPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" /> Lighting Preference</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a lighting preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-48">
                              {LIGHTING_PREFERENCES.map((preference) => (
                                <SelectItem key={preference} value={preference}>
                                  {preference}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>


            <FormField
              control={form.control}
              name="designDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Add more plants', 'Brighter accent colors', 'Wooden furniture with metal legs'"
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe any specific elements or changes you'd like to see.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading || !hasUploadedImage}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Designs
                </>
              )}
            </Button>
            {!hasUploadedImage && (
              <p className="text-sm text-destructive text-center mt-2">Please upload an image first.</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
