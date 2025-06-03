import { Program, web3 } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import type { Protocol as IWinner } from "../idl/winnr";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { contestMetadataPda } from "../utils";
import { getPostTokenDraftContestPricesTransaction } from "./postContestPrices";

const { PublicKey } = web3;

export const postPricesAndResolveTokenDraftContest = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string }
) => {
  const pythSolanaReceiver = new PythSolanaReceiver({
    connection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: wallet as any,
  });

  const postPricesTxs = await getPostTokenDraftContestPricesTransaction(
    pg,
    connection,
    wallet,
    params
  );

  const resolveTx = await getResolveTokenDraftContestTransaction(
    pg,
    connection,
    wallet,
    params
  );

  const versionedTxs = [...postPricesTxs, { tx: resolveTx, signers: [wallet] }];

  const txSignatures = await pythSolanaReceiver.provider.sendAll(versionedTxs, {
    skipPreflight: false,
  });

  return txSignatures;
};

export const resolveTokenDraftContest = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string }
) => {
  const versionedTx = await getResolveTokenDraftContestTransaction(
    pg,
    connection,
    wallet,
    params
  );

  const pythSolanaReceiver = new PythSolanaReceiver({
    connection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: wallet as any,
  });
  const txSignatures = await pythSolanaReceiver.provider.sendAndConfirm(
    versionedTx
  );
  return txSignatures;
};

export const getResolveTokenDraftContestTransaction = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string }
) => {
  const { contestAddress } = params;
  const contestPda = new PublicKey(contestAddress);
  const [contestCreditsPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_draft_contest_credits"), contestPda.toBuffer()],
    pg.programId
  );

  const accounts = {
    signer: wallet.publicKey,
    contestMetadata: contestMetadataPda,
    contest: contestPda,
    contestCredits: contestCreditsPda,
  };

  const ix = await pg.methods
    .resolveTokenDraftContest()
    .accounts(accounts)
    .instruction();
  const msg = new web3.TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: [ix],
  }).compileToV0Message();
  const tx = new web3.VersionedTransaction(msg);

  return tx;
};
