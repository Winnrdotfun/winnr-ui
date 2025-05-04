import { Program } from "@coral-xyz/anchor";
import type { Protocol as IWinner } from "../idl/winnr";
import { getAllTokenDraftContests } from "./getAllContests";

export const getAllUserTokenDraftContests = async (
  pg: Program<IWinner>,
  params: { userAddress: string }
) => {
  const { userAddress } = params;
  const contestEntries = (await pg.account.tokenDraftContestEntry.all())
    .map((r) => r.account)
    .filter((entry) => entry.user.toBase58() === userAddress);

  const contestAddresses = contestEntries.map((entry) =>
    entry.contestKey.toBase58()
  );
  const contests = (await getAllTokenDraftContests(pg)).filter((contest) =>
    contestAddresses.includes(contest.address)
  );

  return contests;
};
