// The directive tells the next.js compiler that this code should only be run on the server.
'use server';

/**
 * @fileOverview Generates interior design variations based on user input.
 *
 * - generateInteriorDesignVariations - A function that generates interior design variations.
 * - GenerateInteriorDesignVariationsInput - The input type for the generateInteriorDesignVariations function.
 * - GenerateInteriorDesignVariationsOutput - The return type for the generateInteriorDesignVariations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInteriorDesignVariationsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Per documentation, specify data URI format
    ),
  roomType: z.string().describe('The type of room (e.g., bedroom, kitchen).'),
  interiorDesignStyle: z.string().describe('The desired interior design style (e.g., Minimalist, Scandinavian).'),
  designDescription: z.string().optional().describe('Optional description of the desired design changes.'),
});
export type GenerateInteriorDesignVariationsInput = z.infer<typeof GenerateInteriorDesignVariationsInputSchema>;

const GenerateInteriorDesignVariationsOutputSchema = z.object({
  redesignedImages: z.array(
    z.string().describe('Data URI of the redesigned image.')
  ).describe('An array of redesigned images in data URI format.')
});
export type GenerateInteriorDesignVariationsOutput = z.infer<typeof GenerateInteriorDesignVariationsOutputSchema>;

export async function generateInteriorDesignVariations(input: GenerateInteriorDesignVariationsInput): Promise<GenerateInteriorDesignVariationsOutput> {
  return generateInteriorDesignVariationsFlow(input);
}

const generateInteriorDesignVariationsPrompt = ai.definePrompt({
  name: 'generateInteriorDesignVariationsPrompt',
  input: {schema: GenerateInteriorDesignVariationsInputSchema},
  output: {schema: GenerateInteriorDesignVariationsOutputSchema},
  prompt: `You are an interior design expert. You will generate 5 different interior design variations based on the provided image of a room, the specified room type, the selected interior design style, and the optional design description.

Room Type: {{{roomType}}}
Interior Design Style: {{{interiorDesignStyle}}}
Design Description: {{{designDescription}}}

Original Room Image: {{media url=photoDataUri}}

Ensure the redesigned images incorporate the specified style and description while maintaining realistic and aesthetically pleasing designs. Return the redesigned images as a list of data URIs.

`,
});

const generateInteriorDesignVariationsFlow = ai.defineFlow(
  {
    name: 'generateInteriorDesignVariationsFlow',
    inputSchema: GenerateInteriorDesignVariationsInputSchema,
    outputSchema: GenerateInteriorDesignVariationsOutputSchema,
  },
  async input => {
    const redesignedImages: string[] = [];
    for (let i = 0; i < 5; i++) {
      const {media} = await ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: `Reimagine this interior in the style of ${input.interiorDesignStyle}. The room type is ${input.roomType}. ${input.designDescription ? input.designDescription : ''}`},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      });
      redesignedImages.push(media.url!);
    }

    return {redesignedImages};
  }
);
