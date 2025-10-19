"use server";

import { calculateReward } from "@/ai/flows/calculate-reward";

interface CalculateRewardParams {
  achievement: number;
  rewardPercentage: number;
}

export async function getEstimatedReward(
  params: CalculateRewardParams
): Promise<{ estimatedReward?: number; error?: string }> {
  try {
    if (isNaN(params.achievement) || isNaN(params.rewardPercentage) || params.achievement < 0 || params.rewardPercentage < 0) {
      return { estimatedReward: 0 };
    }
    const result = await calculateReward({
      achievement: params.achievement,
      rewardPercentage: params.rewardPercentage / 100, // Assuming percentage is 0-100
    });
    return { estimatedReward: result.estimatedReward };
  } catch (e) {
    console.error(e);
    return { error: "Failed to calculate reward." };
  }
}
