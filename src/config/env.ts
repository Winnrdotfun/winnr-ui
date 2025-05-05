export const env = "devnet"; // localnet, devnet, mainnet

export const rpcLocalnet = "http://localhost:8899";
export const rpcDevnet = process.env.NEXT_PUBLIC_DEVNET_RPC as string;
export const rpcMainnet = process.env.NEXT_PUBLIC_MAINNET_RPC as string;
