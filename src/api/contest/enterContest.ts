import { Program, utils, web3 } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import type { Protocol as IWinner } from "../idl/winnr";
import { configPda, mint, programTokenAccountPda } from "../utils";

const { PublicKey } = web3;

export const enterTokenDraftContest = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string; creditAllocation: number[] }
) => {
  const { contestAddress, creditAllocation } = params;
  const contestPda = new PublicKey(contestAddress);
  const [contestEntryPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("contest_entry"),
      contestPda.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    pg.programId
  );
  const [contestCreditsPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("contest_credits"),
      contestPda.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    pg.programId
  );

  const signerTokenAccountAddress = getAssociatedTokenAddressSync(
    mint,
    wallet.publicKey
  );

  const accounts = {
    signer: wallet.publicKey,
    config: configPda,
    contest: contestPda,
    contestEntry: contestEntryPda,
    contestCredits: contestCreditsPda,
    mint,
    programTokenAccount: programTokenAccountPda,
    signerTokenAccount: signerTokenAccountAddress,
    tokenProgram: utils.token.TOKEN_PROGRAM_ID,
  };

  const tx = await pg.methods
    .enterTokenDraftContest(Buffer.from(creditAllocation))
    .accounts(accounts)
    .transaction();

  tx.recentBlockhash = await connection
    .getLatestBlockhash()
    .then((r) => r.blockhash);
  tx.feePayer = wallet.publicKey;

  const signedTx = await wallet.signTransaction(tx);
  const res = await connection.sendRawTransaction(signedTx.serialize());
  return res;
};
