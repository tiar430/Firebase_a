'use server';

/**
 * @fileOverview Automatically calculates potential rewards based on achievement and reward percentages.
 *
 * - calculateReward - A function that calculates the potential rewards.
 * - CalculateRewardInput - The input type for the calculateReward function.
 * - CalculateRewardOutput - The return type for the calculateReward function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRewardInputSchema = z.object({
  achievement: z.number().describe('The achievement of the program.'),
  rewardPercentage: z.number().describe('The reward percentage for the program.'),
});
export type CalculateRewardInput = z.infer<typeof CalculateRewardInputSchema>;

const CalculateRewardOutputSchema = z.object({
  estimatedReward: z.number().describe('The estimated reward based on the achievement and reward percentage.'),
});
export type CalculateRewardOutput = z.infer<typeof CalculateRewardOutputSchema>;

export async function calculateReward(input: CalculateRewardInput): Promise<CalculateRewardOutput> {
  return calculateRewardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateRewardPrompt',
  input: {schema: CalculateRewardInputSchema},
  output: {schema: CalculateRewardOutputSchema},
  prompt: `Calculate the estimated reward based on the achievement and reward percentage.
Achievement: {{achievement}}
Reward Percentage: {{rewardPercentage}}

Estimated Reward:`,
});

const calculateRewardFlow = ai.defineFlow(
  {
    name: 'calculateRewardFlow',
    inputSchema: CalculateRewardInputSchema,
    outputSchema: CalculateRewardOutputSchema,
  },
  async input => {
    const estimatedReward = input.achievement * input.rewardPercentage;
    return {estimatedReward};
  }
);
