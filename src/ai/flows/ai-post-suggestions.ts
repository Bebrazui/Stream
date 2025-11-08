'use server';

/**
 * @fileOverview An AI agent that suggests topics and formats for new posts based on the user's recent activity.
 *
 * - suggestPost - A function that handles the post suggestion process.
 * - SuggestPostInput - The input type for the suggestPost function.
 * - SuggestPostOutput - The return type for the suggestPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostInputSchema = z.object({
  userRecentActivity: z
    .string()
    .describe("The user's recent activity, including posts they've viewed, liked, and commented on."),
});
export type SuggestPostInput = z.infer<typeof SuggestPostInputSchema>;

const SuggestPostOutputSchema = z.object({
  topicSuggestions: z
    .array(z.string())
    .describe('A list of suggested topics for the user to create a new post about.'),
  formatSuggestions: z
    .array(z.string())
    .describe(
      'A list of suggested formats for the user to create a new post in (e.g., text, image, link, video).'
    ),
  reasoning: z
    .string()
    .describe('The reasoning behind the topic and format suggestions, based on the user activity.'),
});
export type SuggestPostOutput = z.infer<typeof SuggestPostOutputSchema>;

export async function suggestPost(input: SuggestPostInput): Promise<SuggestPostOutput> {
  return suggestPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostPrompt',
  input: {schema: SuggestPostInputSchema},
  output: {schema: SuggestPostOutputSchema},
  prompt: `You are a creative assistant helping users overcome writer's block on a social media platform.

  Based on the user's recent activity, suggest topics and formats for them to create a new post.

  Recent Activity: {{{userRecentActivity}}}

  Consider a variety of engaging topics and formats that would resonate with the user, and explain your reasoning.

  Output topicSuggestions and formatSuggestions as arrays of strings.
  `,
});

const suggestPostFlow = ai.defineFlow(
  {
    name: 'suggestPostFlow',
    inputSchema: SuggestPostInputSchema,
    outputSchema: SuggestPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
