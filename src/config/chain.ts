import { env, rpcDevnet, rpcLocalnet, rpcMainnet } from "./env";

export const allChainConfigs = {
  localnet: {
    rpc: rpcLocalnet,
    // Using mainnet clone
    usdcAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  devnet: {
    rpc: rpcDevnet,
    usdcAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  },
  mainnet: {
    rpc: rpcMainnet,
    usdcAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
};

export const chainConfig = allChainConfigs[env];
