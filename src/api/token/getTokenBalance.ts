import {
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { bnToUiAmount } from "@/src/utils/token";
import { BN } from "@coral-xyz/anchor";

export const getTokenBalance = async (
  connection: Connection,
  walletAddress: string,
  params: { mintAddress: string }
) => {
  const { mintAddress } = params;

  const mint = new PublicKey(mintAddress);
  const walletAddr = new PublicKey(walletAddress);
  const mintAcc = await getMint(connection, mint);
  const tokenAccAddress = getAssociatedTokenAddressSync(mint, walletAddr);
  const tokenAcc = await getAccount(connection, tokenAccAddress);

  const decimals = mintAcc.decimals;
  const amount = new BN(tokenAcc.amount.toString());
  const uiAmount = bnToUiAmount(amount, decimals, 2);

  const data = {
    amount,
    uiAmount,
  };

  return data;
};
