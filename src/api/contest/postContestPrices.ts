import { Program, utils, web3 } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { HermesClient } from "@pythnetwork/hermes-client";
import type { Protocol as IWinner } from "../idl/winnr";
import {
  InstructionWithEphemeralSigners,
  PythSolanaReceiver,
} from "@pythnetwork/pyth-solana-receiver";

const { PublicKey } = web3;

export const postTokenDraftContestPrices = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string }
) => {
  const versionedTxs = await getPostTokenDraftContestPricesTransaction(
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

export const getPostTokenDraftContestPricesTransaction = async (
  pg: Program<IWinner>,
  connection: web3.Connection,
  wallet: AnchorWallet,
  params: { contestAddress: string }
) => {
  const { contestAddress } = params;
  const contestPda = new PublicKey(contestAddress);
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

  const startTimestamp = contest.startTime.toNumber();
  const startPriceUpdates = await hermesClient.getPriceUpdatesAtTimestamp(
    startTimestamp,
    priceFeedIds,
    { encoding: "base64" }
  );
  const startPriceUpdatesData = startPriceUpdates.binary.data;

  const endTimestamp = contest.endTime.toNumber();
  const endPriceUpdates = await hermesClient.getPriceUpdatesAtTimestamp(
    endTimestamp,
    priceFeedIds,
    { encoding: "base64" }
  );
  const endPriceUpdatesData = endPriceUpdates.binary.data;
  const {
    postInstructions: endPricePostInstructions,
    closeInstructions: endPriceCloseInstructions,
    priceFeedIdToPriceUpdateAccount: endPriceFeedIdToPriceUpdateAccount,
  } = await pythSolanaReceiver.buildPostPriceUpdateInstructions(
    endPriceUpdatesData
  );

  // Create transaction builder and add price updates
  const txBuilder = pythSolanaReceiver.newTransactionBuilder({
    closeUpdateAccounts: true,
  });
  await txBuilder.addPostPriceUpdates(startPriceUpdatesData);
  txBuilder.addInstructions(endPricePostInstructions);
  txBuilder.closeInstructions.push(...endPriceCloseInstructions);

  // Add consumer instructions
  await txBuilder.addPriceConsumerInstructions(
    async (getPriceUpdateAccount) => {
      const startPriceUpdateAccounts = priceFeedIds.map((id) =>
        getPriceUpdateAccount(id)
      );
      const endPriceUpdateAccounts = priceFeedIds.map(
        (id) => endPriceFeedIdToPriceUpdateAccount[id]
      );

      const accounts = {
        signer: wallet.publicKey,
        contest: contestPda,
        startPriceFeed0: startPriceUpdateAccounts[0],
        startPriceFeed1: startPriceUpdateAccounts[1] || null,
        startPriceFeed2: startPriceUpdateAccounts[2] || null,
        startPriceFeed3: startPriceUpdateAccounts[3] || null,
        startPriceFeed4: startPriceUpdateAccounts[4] || null,
        endPriceFeed0: endPriceUpdateAccounts[0],
        endPriceFeed1: endPriceUpdateAccounts[1] || null,
        endPriceFeed2: endPriceUpdateAccounts[2] || null,
        endPriceFeed3: endPriceUpdateAccounts[3] || null,
        endPriceFeed4: endPriceUpdateAccounts[4] || null,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      };

      const txInstruction = await pg.methods
        .postTokenDraftContestPrices()
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
