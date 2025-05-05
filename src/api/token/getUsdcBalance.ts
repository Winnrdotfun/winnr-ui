import { Connection } from "@solana/web3.js";
import { mint } from "../utils";
import { getTokenBalance } from "./getTokenBalance";

export const getUsdcBalance = async (
  connection: Connection,
  walletAddress: string
) => {
  const mintAddress = mint.toBase58();
  return getTokenBalance(connection, walletAddress, {
    mintAddress,
  });
};
