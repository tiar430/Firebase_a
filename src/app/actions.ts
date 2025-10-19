"use server";

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
    const estimatedReward = params.achievement * (params.rewardPercentage / 100);
    return { estimatedReward: estimatedReward };
  } catch (e) {
    console.error(e);
    return { error: "Failed to calculate reward." };
  }
}
