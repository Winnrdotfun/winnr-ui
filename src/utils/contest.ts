import { BN } from "@coral-xyz/anchor";
import { Contest } from "../types/contest";

export const calculateWinnerReward = (
  contest: Contest,
  entryId: number
): BN => {
  const totalPoolAmount = contest.prizePool as BN;
  const feePercent = 10;
  const feeFrac = feePercent / 100;
  const feeAmount = totalPoolAmount.mul(new BN(feeFrac));
  const totalRewardAmount = totalPoolAmount.sub(feeAmount);
  const winnerIdx = contest.winnerIds.findIndex((id: number) => id === entryId);
  const alloc = contest.winnerRewardAllocation[winnerIdx];

  let userRewardAmount = new BN(0);
  if (!alloc) {
    userRewardAmount = new BN(0);
  } else {
    userRewardAmount = totalRewardAmount.mul(new BN(alloc)).div(new BN(100));
  }

  return userRewardAmount;
};
