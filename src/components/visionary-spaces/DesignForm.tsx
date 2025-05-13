'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Wand2 } from 'lucide-react';

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
import { ROOM_TYPES, DESIGN_STYLES, type RoomType, type DesignStyle } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  roomType: z.string().min(1, "Room type is required."),
  interiorDesignStyle: z.string().min(1, "Design style is required."),
  designDescription: z.string().max(500, "Description must be 500 characters or less.").optional(),
});

export type DesignFormValues = z.infer<typeof formSchema>;

interface DesignFormProps {
  onSubmit: (data: DesignFormValues) => void;
  isLoading: boolean;
  hasUploadedImage: boolean;
}

export function DesignForm({ onSubmit, isLoading, hasUploadedImage }: DesignFormProps) {
  const form = useForm<DesignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "",
      interiorDesignStyle: "",
      designDescription: "",
    },
  });

  return (
    <Card>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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

            <FormField
              control={form.control}
              name="designDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Add more plants', 'Brighter colors', 'Wooden furniture'"
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
