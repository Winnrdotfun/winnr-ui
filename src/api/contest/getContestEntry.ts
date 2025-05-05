import { Program, web3 } from "@coral-xyz/anchor";
import type { Protocol as IWinner } from "../idl/winnr";
import { programId } from "../utils";

export const getTokenDraftContestsEntry = async (
  pg: Program<IWinner>,
  params: { contestAddress: string; userAddress: string }
) => {
  const { contestAddress } = params;
  const [contestEntryPda] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("token_draft_contest_entry"),
      new web3.PublicKey(contestAddress).toBuffer(),
      new web3.PublicKey(params.userAddress).toBuffer(),
    ],
    programId
  );

  const entry = await pg.account.tokenDraftContestEntry.fetch(contestEntryPda);

  if (!entry) {
    return null;
  }

  return {
    user: entry.user.toBase58(),
    id: entry.id,
    contestAddress: entry.contestKey.toBase58(),
    hasClaimed: entry.hasClaimed,
  };
};
