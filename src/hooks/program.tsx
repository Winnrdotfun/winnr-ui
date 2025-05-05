'use client";';

import { useEffect, useState } from "react";
import { Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import type { Protocol as IWinnr } from "@/src/api/idl/winnr.ts";
import winnrIdl from "@/src/api/idl/winnr.json";

export const useProgram = () => {
  const [program, setProgram] = useState<Program<IWinnr> | null>(null);
  const { connection } = useConnection();

  useEffect(() => {
    if (!!program) return;
    if (!connection) return;

    const pg = new Program(winnrIdl, { connection }) as Program<IWinnr>;
    setProgram(pg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return program;
};
