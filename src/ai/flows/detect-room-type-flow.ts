'use server';
/**
 * @fileOverview Detects the type of room from an image.
 *
 * - detectRoomType - A function that detects the room type.
 * - DetectRoomTypeInput - The input type for the detectRoomType function.
 * - DetectRoomTypeOutput - The return type for the detectRoomType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ROOM_TYPES } from '@/lib/constants';

const DetectRoomTypeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectRoomTypeInput = z.infer<typeof DetectRoomTypeInputSchema>;

const DetectRoomTypeOutputSchema = z.object({
  roomType: z.string().describe('The detected type of the room.'),
});
export type DetectRoomTypeOutput = z.infer<typeof DetectRoomTypeOutputSchema>;

export async function detectRoomType(input: DetectRoomTypeInput): Promise<DetectRoomTypeOutput> {
  return detectRoomTypeFlow(input);
}

const roomTypesList = ROOM_TYPES.join(', ');

const detectRoomTypePrompt = ai.definePrompt({
  name: 'detectRoomTypePrompt',
  input: {schema: DetectRoomTypeInputSchema},
  output: {schema: DetectRoomTypeOutputSchema},
  prompt: `Analyze the provided image and determine the type of room it depicts.
Your response must be one of the following common room types: ${roomTypesList}.
If none of these fit perfectly, choose the closest one.
Only output the room type name as a string. Do not add any other text or explanation.

Image: {{media url=photoDataUri}}`,
});

const detectRoomTypeFlow = ai.defineFlow(
  {
    name: 'detectRoomTypeFlow',
    inputSchema: DetectRoomTypeInputSchema,
    outputSchema: DetectRoomTypeOutputSchema,
  },
  async (input) => {
    const {output} = await detectRoomTypePrompt(input);
    if (output && ROOM_TYPES.includes(output.roomType as any)) {
        return output;
    }
    // Fallback or error if the model returns something unexpected
    // For now, returning a generic or empty response if not valid.
    // A more robust approach might be to retry or log an issue.
    return { roomType: "" }; // Or throw an error
  }
);
