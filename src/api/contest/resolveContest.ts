import { Program, utils, web3 } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { HermesClient } from "@pythnetwork/hermes-client";
import type { Protocol as IWinner } from "../idl/winnr";
import {
  InstructionWithEphemeralSigners,
  PythSolanaReceiver,
} from "@pythnetwork/pyth-solana-receiver";
import { contestMetadataPda, mint, programTokenAccountPda } from "../utils";
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

  const versionedTxs0 = await getPostTokenDraftContestPricesTransaction(
    pg,
    connection,
    wallet,
    params
  );

  const versionedTxs1 = await getResolveTokenDraftContestTransaction(
    pg,
    connection,
    wallet,
    params
  );

  const versionedTxs = [...versionedTxs0, ...versionedTxs1];

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
  const versionedTxs = await getResolveTokenDraftContestTransaction(
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
  const txSignatures = await pythSolanaReceiver.provider.sendAll(versionedTxs, {
    skipPreflight: false,
  });
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

  const contest = await pg.account.tokenDraftContest.fetch(contestAddress);

  const priceFeedIds = contest.tokenFeedIds.map(
    (v) => "0x" + v.toBuffer().toString("hex").toLowerCase()
  );

  const pythSolanaReceiver = new PythSolanaReceiver({
    connection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: wallet as any,
  });
  const hermesClient = new HermesClient("https://hermes.pyth.network/", {});

  const endTimestamp = contest.endTime.toNumber();
  const priceUpdates = await hermesClient.getPriceUpdatesAtTimestamp(
    endTimestamp,
    priceFeedIds,
    { encoding: "base64" }
  );
  const priceUpdatesData = priceUpdates.binary.data;
  const txBuilder = pythSolanaReceiver.newTransactionBuilder({
    closeUpdateAccounts: true,
  });
  await txBuilder.addPostPriceUpdates(priceUpdatesData);
  await txBuilder.addPriceConsumerInstructions(
    async (getPriceUpdateAccount) => {
      const priceUpdateAccounts = priceFeedIds.map((id) =>
        getPriceUpdateAccount(id)
      );

      const accounts = {
        signer: wallet.publicKey,
        contest: contestAddress,
        contestCredits: contestCreditsPda,
        contestMetadata: contestMetadataPda,
        mint,
        programTokenAccount: programTokenAccountPda,
        feed0: priceUpdateAccounts[0],
        feed1: priceUpdateAccounts[1] || null,
        feed2: priceUpdateAccounts[2] || null,
        feed3: priceUpdateAccounts[3] || null,
        feed4: priceUpdateAccounts[4] || null,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      };

      const txInstruction = await pg.methods
        .resolveTokenDraftContest()
        .accounts(accounts)
        .instruction();

      const instruction: InstructionWithEphemeralSigners = {
        instruction: txInstruction,
        signers: [],
      };

      return [instruction];
    }
  );

  const versionedTxs = await txBuilder.buildVersionedTransactions({
    computeUnitPriceMicroLamports: 50000,
  });

  return versionedTxs;
};
