import { useEffect, useState } from "react";
import { Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import type { SonicSage } from "../idl/sonic_sage";
import idl from "../idl/sonic_sage.json";

export const useProgram = () => {
  const [program, setProgram] = useState<Program<SonicSage> | null>(null);
  const { connection } = useConnection();

  useEffect(() => {
    if (!!program) return;
    if (!connection) return;

    const pg = new Program(idl, { connection }) as Program<SonicSage>;
    setProgram(pg);
  }, [connection]);

  return program;
};
