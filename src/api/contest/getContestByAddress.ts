import { BN, Program } from "@coral-xyz/anchor";
import type { Protocol as IWinner } from "../idl/winnr";

export const getTokenDraftContestsByAddress = async (
  pg: Program<IWinner>,
  address: string
) => {
  const m = await pg.account.tokenDraftContest.fetch(address);
  const prizePool = m.entryFee.mul(new BN(m.numEntries));

  return {
    address,
    id: Number(m.id.toString()),
    creator: m.creator.toBase58(),
    startTime: Number(m.startTime.toString()) * 1000,
    endTime: Number(m.endTime.toString()) * 1000,
    entryFee: new BN(m.entryFee.toString()),
    maxEntries: m.maxEntries,
    numEntries: m.numEntries,
    prizePool,
    tokenFeedIds: m.tokenFeedIds.map((id) =>
      id.toBuffer().toString("hex").toLowerCase()
    ),
    tokenStartPrices: m.tokenStartPrices,
    tokenRois: m.tokenRois,
    winnerIds: m.winnerIds,
    winnerRewardAllocation: Array.from(m.winnerRewardAllocation),
    isResolved: m.isResolved,
  };
};
