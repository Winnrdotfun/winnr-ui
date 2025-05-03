import { BN, Program } from "@coral-xyz/anchor";
import type { Protocol as IWinner } from "../idl/winnr";
// import { AnchorWallet } from "@solana/wallet-adapter-react";
// import { getAssociatedTokenAddressSync } from "@solana/spl-token";
// import { metadataPda, mint, programId, programTokenAccountPda } from "./utils";
// import { RPC_TESTNET } from '../config/env';

export const getAllMarkets = async (pg: Program<IWinner>) => {
  return (await pg.account.tokenDraftContest.all()).map((res) => {
    const m = res.account;
    return {
      publicKey: res.publicKey.toBase58(),
      id: Number(m.id.toString()),
      creator: m.creator.toBase58(),
      startTime: Number(m.startTime.toString()) * 1000,
      endTime: Number(m.endTime.toString()) * 1000,
      entryFee: new BN(m.entryFee.toString()),
      maxEntries: Number(m.maxEntries.toString()),
      numEntries: Number(m.numEntries.toString()),
      tokenFeedIds: m.tokenFeedIds.map((id) =>
        id.toBuffer().toString("hex").toLowerCase()
      ),
      tokenStartPrices: m.tokenStartPrices,
      tokenRois: m.tokenRois.map((roi) => Number(roi.toString())),
      winnerIds: m.winnerIds.map((id) => id.toString()),
      winnerRewardAllocation: Array.from(m.winnerRewardAllocation),
      isResolved: m.isResolved,
    };
  });
};
