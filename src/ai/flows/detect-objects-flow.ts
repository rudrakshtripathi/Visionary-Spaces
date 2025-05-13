'use server';
/**
 * @fileOverview Detects objects and their labels in an image.
 *
 * - detectObjects - A function that detects objects in an image.
 * - DetectObjectsInput - The input type for the detectObjects function.
 * - DetectObjectsOutput - The return type for the detectObjects function.
 */

import {ai}from '@/ai/genkit';
import {z} from 'genkit';

const DetectObjectsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectObjectsInput = z.infer<typeof DetectObjectsInputSchema>;

const DetectedObjectSchema = z.object({
  name: z.string().describe("The name of the detected furniture or decor item. Example: 'Sofa', 'Lamp', 'Painting'."),
});

const DetectObjectsOutputSchema = z.object({
  detectedObjects: z.array(DetectedObjectSchema).describe('A list of detected objects with their names.'),
});
export type DetectObjectsOutput = z.infer<typeof DetectObjectsOutputSchema>;

export async function detectObjects(input: DetectObjectsInput): Promise<DetectObjectsOutput> {
  return detectObjectsFlow(input);
}

const detectObjectsPrompt = ai.definePrompt({
  name: 'detectObjectsPrompt',
  input: {schema: DetectObjectsInputSchema},
  output: {schema: DetectObjectsOutputSchema},
  prompt: `Analyze the provided image of a room.
Identify and list the main furniture and decor items visible in the image.
For each item, provide its name.
The output should be a JSON array of objects, where each object has a "name" key.
Example format: {"detectedObjects": [{"name": "Sofa"}, {"name": "Coffee Table"}, {"name": "Floor Lamp"}]}

Image: {{media url=photoDataUri}}`,
});

const detectObjectsFlow = ai.defineFlow(
  {
    name: 'detectObjectsFlow',
    inputSchema: DetectObjectsInputSchema,
    outputSchema: DetectObjectsOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await detectObjectsPrompt(input);
      if (output && Array.isArray(output.detectedObjects)) {
        return output;
      }
      console.warn('DetectObjectsPrompt did not return a valid output. Returning empty list for detected objects.');
      return { detectedObjects: [] };
    } catch (error) {
      console.error('Error in detectObjectsFlow:', error);
      // Return a default valid output in case of any error
      return { detectedObjects: [] };
    }
  }
);