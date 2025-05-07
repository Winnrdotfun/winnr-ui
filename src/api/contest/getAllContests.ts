import { BN, Program } from "@coral-xyz/anchor";
import type { Protocol as IWinner } from "../idl/winnr";

export const getAllTokenDraftContests = async (pg: Program<IWinner>) => {
  const allContests = await pg.account.tokenDraftContest.all();

  const contestList = allContests.map((res) => {
    const m = res.account;
    const prizePool = m.entryFee.mul(new BN(m.numEntries));

    return {
      address: res.publicKey.toBase58(),
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
  });

  return contestList;
};
