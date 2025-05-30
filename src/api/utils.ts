import { web3 } from "@coral-xyz/anchor";
import winnrIdl from "./idl/winnr.json";
import { chainConfig } from "../config/chain";

export const programId = new web3.PublicKey(winnrIdl.address);

export const mint = new web3.PublicKey(chainConfig.usdcAddress);

export const [configPda] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("config")],
  programId
);

export const [contestMetadataPda] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("contest_metadata")],
  programId
);

export const [programTokenAccountPda] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("token_account"), mint.toBuffer()],
  programId
);
