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
      'A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  roomType: z.string().describe('The type of room (e.g., bedroom, kitchen).'),
  interiorDesignStyle: z.string().describe('The desired interior design style (e.g., Minimalist, Scandinavian).'),
  colorPalette: z.string().optional().describe('The preferred color palette (e.g., "Cool Blues", "Warm Earth Tones").'),
  furnitureStyle: z.string().optional().describe('The preferred furniture style (e.g., "Classic & Timeless", "Modern & Sleek").'),
  budgetLevel: z.string().optional().describe('The desired budget level for inspiration (e.g., "Affordable", "Premium").'),
  lightingPreference: z.string().optional().describe('The preferred lighting type (e.g., "Warm & Cozy", "Natural Light Simulation").'),
  designDescription: z.string().optional().describe('Optional additional description of the desired design changes.'),
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

// This definePrompt is not directly used for image generation in this flow, 
// but kept for potential future text-based outputs or as a reference.
// Image generation is handled by the ai.generate call within the flow.
const generateInteriorDesignVariationsPrompt = ai.definePrompt({
  name: 'generateInteriorDesignVariationsPrompt',
  input: {schema: GenerateInteriorDesignVariationsInputSchema},
  output: {schema: GenerateInteriorDesignVariationsOutputSchema},
  prompt: `You are an interior design expert. You will generate 5 different interior design variations based on the provided image of a room and the user's preferences.

Room Type: {{{roomType}}}
Interior Design Style: {{{interiorDesignStyle}}}
{{#if colorPalette}}Color Palette: {{{colorPalette}}}{{/if}}
{{#if furnitureStyle}}Furniture Style: {{{furnitureStyle}}}{{/if}}
{{#if budgetLevel}}Budget Level: {{{budgetLevel}}}{{/if}}
{{#if lightingPreference}}Lighting Preference: {{{lightingPreference}}}{{/if}}
{{#if designDescription}}Additional Design Description: {{{designDescription}}}{{/if}}

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
    try {
      for (let i = 0; i < 5; i++) {
        // Improved text prompt for image generation, incorporating all new fields
        let imagePromptText = `Generate a high-quality, photorealistic image of a ${input.roomType}. `;
        imagePromptText += `This room should be redesigned in the ${input.interiorDesignStyle} style. `;
        
        if (input.colorPalette) {
          imagePromptText += `Prioritize a ${input.colorPalette} color scheme. `;
        }
        if (input.furnitureStyle) {
          imagePromptText += `Feature ${input.furnitureStyle} furniture. `;
        }
        if (input.budgetLevel) {
          imagePromptText += `The overall aesthetic should feel ${input.budgetLevel}. `;
        }
        if (input.lightingPreference) {
          imagePromptText += `The lighting should be ${input.lightingPreference}. `;
        }
        if (input.designDescription) {
          imagePromptText += `Please incorporate these specific details: "${input.designDescription}". `;
        } else {
          imagePromptText += 'Focus on a creative and inspiring interpretation of the style, considering all specified preferences. ';
        }
        imagePromptText += 'Pay attention to realistic lighting, textures, and appropriately scaled furniture. The overall scene should be aesthetically pleasing and accurately represent the requested design.';
        
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-exp',
          prompt: [
            {media: {url: input.photoDataUri}},
            {text: imagePromptText},
          ],
          config: {
            responseModalities: ['TEXT', 'IMAGE'], 
          },
        });
        if (media && media.url) {
          redesignedImages.push(media.url);
        } else {
          console.warn(`Image generation failed for iteration ${i + 1}. Skipping.`);
        }
      }
      return {redesignedImages};
    } catch (error) {
        console.error('Error in generateInteriorDesignVariationsFlow:', error);
        return { redesignedImages: [] };
    }
  }
);
