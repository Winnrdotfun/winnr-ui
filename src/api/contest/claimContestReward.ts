import { Program, utils, web3 } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import type { Protocol as IWinner } from "../idl/winnr";
import {
  configPda,
  contestMetadataPda,
  mint,
  programId,
  programTokenAccountPda,
} from "../utils";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const { PublicKey } = web3;

export const claimTokenDraftContestRewards = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string }
) => {
  const { contestAddress } = params;

  const signerTokenAccountAddress = getAssociatedTokenAddressSync(
    mint,
    wallet.publicKey
  );

  const contestPda = new PublicKey(contestAddress);
  const [contestEntryPda] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("token_draft_contest_entry"),
      contestPda.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    programId
  );

  const accounts = {
    signer: wallet.publicKey,
    config: configPda,
    contest: contestPda,
    contestMetadata: contestMetadataPda,
    contestEntry: contestEntryPda,
    mint,
    programTokenAccount: programTokenAccountPda,
    signerTokenAccount: signerTokenAccountAddress,
    tokenProgram: utils.token.TOKEN_PROGRAM_ID,
  };

  const tx = await pg.methods
    .claimTokenDraftContest()
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
