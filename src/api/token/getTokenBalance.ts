import { web3 } from "@coral-xyz/anchor";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";

export const getTokenBalance = async (
  connection: web3.Connection,
  mintAddress: string,
  address: string
) => {
  const mint = new web3.PublicKey(mintAddress);
  const walletAddress = new web3.PublicKey(address);
  const tokenAccountAddress = getAssociatedTokenAddressSync(
    mint,
    walletAddress
  );
  const tokenAccount = await getAccount(connection, tokenAccountAddress);
  const amount = tokenAccount.amount;
  return amount;
};
