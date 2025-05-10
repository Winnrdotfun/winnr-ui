"use client";

import Image from "next/image";
import cup from "@/src/assets/images/cup.png";
import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import Button from "../ui/Button/Button";
import Link from "next/link";
import { getAllUserTokenDraftContests } from "@/src/api/contest/getAllUserContests";
import { useProgram } from "@/src/hooks/program";
import { bnToUiAmount } from "@/src/utils/token";
import { useEffect, useState } from "react";
import ContentCardLoading from "@ui/Loading/ContentCardLoading";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import NoContest from "./NoContest";
import Status from "../ui/Status/Status";
import WalletConnectButton from "../common/WalletConnectButton";

interface Contest {
  address: string;
  id: number;
  creator: string;
  startTime: number;
  endTime: number;
  entryFee: BN;
  maxEntries: number;
  numEntries: number;
  prizePool: BN;
  tokenFeedIds: string[];
  tokenStartPrices: number[];
  tokenRois: number[];
  winnerIds: number[];
  winnerRewardAllocation: number[];
  isResolved: boolean;
}

interface ContestState extends Omit<Contest, "winnerIds"> {
  winnerIds: string[];
}

const ContestCard = () => {
  const pg = useProgram();
  const wallet = useAnchorWallet();
  const [contests, setContests] = useState<ContestState[] | null>(null);
  const [timeLeftArr, setTimeLeftArr] = useState<
    | {
        time: string;
        isEnding: boolean;
        isStarted: boolean;
        isEnded: boolean;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (pg && wallet) {
      getAllUserTokenDraftContests(pg, {
        userAddress: wallet.publicKey.toBase58(),
      }).then((res: Contest[]) => {
        if (res && res.length > 0) {
          setContests(
            res.map((contestData) => ({
              ...contestData,
              winnerIds: contestData.winnerIds.map(String),
            }))
          );
        } else {
          setContests([]);
        }
      });
    }
  }, [pg, wallet]);

  useEffect(() => {
    if (contests && contests.length > 0) {
      const interval = setInterval(() => {
        const timeLeftArr = contests.map((contest) => {
          const now = new Date().getTime();
          const startTime = contest.startTime;
          const endTime = contest.endTime;
          const isStarted = startTime <= now;
          const isEnded = endTime <= now;
          const isEnding = isStarted && !isEnded && endTime - now < 3600000; // Less than 1 hour left
          const distance = startTime > now ? startTime - now : endTime - now;
          const hours = Math.max(
            0,
            Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          );
          const minutes = Math.max(
            0,
            Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          );
          const seconds = Math.max(
            0,
            Math.floor((distance % (1000 * 60)) / 1000)
          );
          return {
            time: `${hours}h : ${minutes}m : ${seconds}s`,
            isEnding,
            isStarted,
            isEnded,
          };
        });
        setTimeLeftArr(timeLeftArr);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contests]);

  if (!pg || !wallet) {
    return (
      <div className="bg-neutral-950 mb-5 border border-white/5 rounded-3xl min-h-[200px] p-10 relative w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="text-neutral-500">
            Please connect your wallet to view your contests
          </div>
          <WalletConnectButton />
        </div>
      </div>
    );
  }

  if (!contests) {
    return <ContentCardLoading />;
  }

  if (contests.length === 0) {
    return <NoContest />;
  }

  return (
    <>
      {contests.map((contest, i) => {
        const timeLeft = timeLeftArr?.[i];
        return (
          <Link
            key={contest.id}
            href={`/my-contest/${contest.address}`}
            className="bg-neutral-950 block mb-5 border border-white/5 rounded-3xl p-2 relative w-full"
          >
            <div className="absolute top-0 right-10 sm:right-0">
              <Image
                src={cup}
                alt="cup"
                width={228}
                height={228}
                className="mix-blend-lighten sm:max-w-[180px] sm:blur-[1px]"
              />
            </div>
            <div className="mb-8 px-4 pt-6">
              <div className="max-w-[400px] w-full">
                <h3 className="heading-h3 bg-gradient-primary bg-clip-text text-transparent mb-5">
                  Draft &Win
                </h3>
                <div className="flex items-center gap-1 mb-1">
                  <Dollar />
                  <div className="heading-h6 text-neutral-500">Prize pool</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="heading-h1 text-neutral-50">
                    {bnToUiAmount(contest.prizePool, 6, 2)} USDC
                  </div>
                  <USDC className="w-[26px] h-[26px]" />
                </div>
              </div>
            </div>
            <div className="bg-black/40 rounded-2xl p-2 pl-4 flex items-center justify-between backdrop-blur-lg sm:flex-col sm:gap-2">
              <div className="flex items-center gap-2 sm:w-full sm:justify-between">
                <Status
                  title={
                    contest.isResolved
                      ? "Resolved"
                      : timeLeft?.isEnded
                      ? "Ended"
                      : timeLeft?.isEnding
                      ? "Ending Soon"
                      : timeLeft?.isStarted
                      ? "In Progress"
                      : "Not Started"
                  }
                  variant={
                    contest.isResolved
                      ? "success"
                      : timeLeft?.isEnded
                      ? "error"
                      : timeLeft?.isEnding
                      ? "warning"
                      : timeLeft?.isStarted
                      ? "success"
                      : "warning"
                  }
                />
                <div className="body-xs text-white/60">
                  Joined with{" "}
                  <span className="text-neutral-50 heading-h6">
                    ${bnToUiAmount(contest.entryFee, 6, 2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:w-full">
                <Button
                  size="sm"
                  className="sm:w-full"
                  iconRight={<ArrowRight />}
                >
                  View more
                </Button>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default ContestCard;
