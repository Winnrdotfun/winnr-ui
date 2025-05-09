"use client";

import Image from "next/image";
import cup from "@/src/assets/images/cup.png";
import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import ProgressBar from "../common/ProgressBar";
import Button from "../ui/Button/Button";
import Link from "next/link";
import { getAllTokenDraftContests } from "@/src/api/contest/getAllContests";
import { useProgram } from "@/src/hooks/program";
import { bnToUiAmount } from "@/src/utils/token";
import { useEffect, useState } from "react";
import ContentCardLoading from "@ui/Loading/ContentCardLoading";
import { now } from "@/src/utils/time";

interface Contest {
  address: string;
  id: number;
  creator: string;
  startTime: number;
  endTime: number;
  entryFee: string;
  maxEntries: number;
  numEntries: number;
  prizePool: string;
  tokenFeedIds: string[];
  tokenStartPrices: number[];
  tokenRois: number[];
  winnerIds: string[];
  winnerRewardAllocation: number[];
  isResolved: boolean;
}

const ContestCard = () => {
  const pg = useProgram();
  const [contests, setContests] = useState<Contest[] | null>(null);
  const [timeLefts, setTimeLefts] = useState<
    { time: string; isEnding: boolean }[]
  >([]);

  useEffect(() => {
    if (!pg) return;

    const currentTime = now();
    getAllTokenDraftContests(pg!).then((res) => {
      if (res && res.length > 0) {
        setContests(
          res
            .filter((contest) => currentTime < contest.endTime)
            .map((contestData) => ({
              ...contestData,
              winnerIds: contestData.winnerIds.map(String),
            }))
        );
      } else {
        setContests([]);
      }
    });
  }, [pg]);

  useEffect(() => {
    if (contests && contests.length > 0) {
      const interval = setInterval(() => {
        setTimeLefts(
          contests.map((contest) => {
            const now = new Date().getTime();
            const startTime = contest.startTime;
            const endTime = contest.endTime;
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
              isEnding: startTime <= now,
            };
          })
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contests]);

  if (!contests) {
    return <ContentCardLoading />;
  }

  return (
    <>
      {contests.map((contest, idx) => {
        const progress = (contest.numEntries / contest.maxEntries) * 100;
        const spotsLeft = contest.maxEntries - contest.numEntries;
        return (
          <Link
            key={contest.id}
            href={`/contest/${contest.address}`}
            className="bg-neutral-950 block mb-5 border border-white/5 rounded-3xl sm:rounded-2xl p-2 relative w-full"
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
              <div className="body-xs text-white/60 sm:w-full">
                <div className="mb-1">Contest Progress</div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-[2px]">
                    <ProgressBar progress={progress} />
                  </div>
                  <div>{spotsLeft} Spots left</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:w-full sm:flex-col">
                <div className="body-xs text-white/60 sm:w-full">
                  {(() => {
                    const now = new Date().getTime();
                    if (now > contest.endTime) {
                      return "Contest Ended";
                    }
                    return (
                      <div className="sm:flex sm:justify-between sm:w-full">
                        <span>
                          {timeLefts[idx]?.isEnding ? "Ends in" : "Starts in"}
                        </span>
                        <span className="heading-h6 ml-1.5 text-neutral-50">
                          {timeLefts[idx]?.time}
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <Button
                  size="sm"
                  className="sm:w-full"
                  iconRight={<ArrowRight />}
                >
                  {(() => {
                    const now = new Date().getTime();
                    if (now < contest.startTime) {
                      return `Enter with $${bnToUiAmount(
                        contest.entryFee,
                        6,
                        2
                      )}`;
                    } else {
                      return "View More";
                    }
                  })()}
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
