"use client";

import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as Ticket } from "@/src/assets/icons/ticket.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import { ReactComponent as Bars } from "@/src/assets/icons/bars.svg";
import { ReactComponent as Info } from "@/src/assets/icons/info.svg";
import { ReactComponent as Clock } from "@/src/assets/icons/clock.svg";
import { ReactComponent as Percentage } from "@/src/assets/icons/percentage.svg";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import Status from "../ui/Status/Status";
import Image from "next/image";
import { useProgram } from "@/src/hooks/program";
import { getTokenDraftContestsByAddress } from "@/src/api/contest/getContestByAddress";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { bnToUiAmount } from "@/src/utils/token";
import { useTokenPrices } from "@/src/hooks/useTokenPrices";
import ContestCardDetailsLoading from "../ui/Loading/ContestCardDetailsLoading";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getTokenDraftContestsEntry } from "@/src/api/contest/getContestEntry";
import * as web3 from "@solana/web3.js";
import Button from "../ui/Button/Button";
import { Contest } from "@/src/types/contest";
import { postPricesAndResolveTokenDraftContest } from "@/src/api/contest/resolveContest";
import { calculateWinnerReward } from "@/src/utils/contest";
import { BN } from "@coral-xyz/anchor";
import { claimTokenDraftContestRewards } from "@/src/api/contest/claimContestReward";
import { tokenInfos } from "@/src/config/tokens";

interface PriceData {
  price: {
    price: string;
    expo: number;
  };
  id: string;
}

const ContestCardDetails = () => {
  const pg = useProgram();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const params = useParams();
  const [contest, setContest] = useState<Contest | null>(null);
  const [contestEntry, setContestEntry] = useState<{
    user: string;
    id: number;
    contestAddress: string;
    hasClaimed: boolean;
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState<{
    time: string;
    isEnding: boolean;
    isStarted: boolean;
    isEnded: boolean;
  } | null>(null);
  const [creditAllocations, setCreditAllocations] = useState<number[]>([
    0, 0, 0, 0,
  ]);

  const { data: livePrices } = useTokenPrices(contest?.tokenFeedIds || []);

  useEffect(() => {
    if (pg && params.slug && wallet) {
      getTokenDraftContestsEntry(pg, {
        contestAddress: params.slug as string,
        userAddress: wallet.publicKey.toBase58(),
      }).then((entry) => {
        if (entry) {
          setContestEntry(entry);
          // If user has joined the contest, we can fetch their credit allocations
          // from the contest entry account
          const entryAccount = pg.account.tokenDraftContestEntry.fetch(
            web3.PublicKey.findProgramAddressSync(
              [
                Buffer.from("token_draft_contest_entry"),
                new web3.PublicKey(params.slug as string).toBuffer(),
                wallet.publicKey.toBuffer(),
              ],
              pg.programId
            )[0]
          );

          entryAccount.then((account) => {
            if (account) {
              setCreditAllocations(Array.from(account.creditAllocation));
            }
          });
        }
      });
    }
  }, [pg, params.slug, wallet]);

  useEffect(() => {
    if (pg && params.slug) {
      getTokenDraftContestsByAddress(pg, params.slug as string).then((res) => {
        if (res) {
          setContest(res);
        }
      });
    }
  }, [pg, params.slug]);

  useEffect(() => {
    if (contest) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const startTime = contest.startTime;
        const endTime = contest.endTime;
        const isStarted = startTime <= now;
        const isEnded = endTime <= now;
        const isEnding = isStarted && !isEnded && endTime - now < 3600000; // Less than 1 hour left
        const distance = isStarted ? endTime - now : startTime - now;
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({
          time: `${hours}h : ${minutes}m : ${seconds}s`,
          isEnding,
          isStarted,
          isEnded,
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contest]);

  if (!contest) {
    return <ContestCardDetailsLoading />;
  }

  const calculateRoi = (startPrice: number, currentPrice: number) => {
    if (!startPrice || !currentPrice) return 0;
    return ((currentPrice - startPrice) / startPrice) * 100;
  };

  const calculateTotalRoi = () => {
    if (!contest || !livePrices) return 0;

    let totalWeightedRoi = 0;
    const totalCredits = creditAllocations.reduce((sum, val) => sum + val, 0);

    if (totalCredits === 0) return 0;

    contest.tokenFeedIds.forEach((tokenId, index) => {
      const startPrice = contest.tokenStartPrices[index];
      const livePrice = livePrices.find(
        (price: PriceData) => price.id === tokenId
      )?.price;
      const currentPrice = livePrice
        ? Number(livePrice.price) * Math.pow(10, livePrice.expo)
        : startPrice;

      const tokenRoi = calculateRoi(startPrice, currentPrice);
      const creditWeight = creditAllocations[index] / totalCredits;

      totalWeightedRoi += tokenRoi * creditWeight;
    });

    return totalWeightedRoi;
  };

  const handleResolveContest = async () => {
    if (!pg || !contest || !wallet) return;

    try {
      const res = await postPricesAndResolveTokenDraftContest(
        pg,
        connection,
        wallet,
        {
          contestAddress: contest.address,
        }
      );
      console.log("Contest resolved successfully", res);
    } catch (error) {
      console.error("Error resolving contest", error);
    }
  };

  const handleClaimPrize = async () => {
    if (!pg || !contest || !wallet) return;

    try {
      const res = await claimTokenDraftContestRewards(pg, connection, wallet, {
        contestAddress: contest.address,
      });
      console.log("Prize claimed successfully", res);
    } catch (error) {
      console.error("Error claiming prize", error);
    }
  };

  const isContestResolved = contest?.isResolved;
  const hasAlreadyClaimed = contestEntry?.hasClaimed;
  const isWinner =
    isFinite(contestEntry?.id as number) &&
    contest.winnerIds.includes(contestEntry!.id);
  const winnerReward: BN = isWinner
    ? calculateWinnerReward(contest, contestEntry!.id)
    : new BN(0);

  return (
    <div className="bg-neutral-950 p-6 border border-white/5 max-w-[362px] rounded-xl relative w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="heading-h3 text-neutral-50">Draft &Win</h3>
          <div className="flex items-center gap-2">
            {/* {contestEntry && (
              <Status
                title={contestEntry.hasClaimed ? "Claimed" : "Joined"}
                variant={contestEntry.hasClaimed ? "success" : "warning"}
              />
            )} */}
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
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-6 justify-between mb-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Dollar />
              <div className="heading-h6 text-neutral-500">Prize pool</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="heading-h4 text-neutral-50">
                {bnToUiAmount(contest.prizePool, 6, 2)} USDC
              </div>
              <USDC className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <Ticket />
              <div className="heading-h6 text-neutral-500">Entry Fee</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="heading-h4 text-neutral-50">
                {bnToUiAmount(contest.entryFee, 6, 2)} USDC
              </div>
              <USDC className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF08] flex items-center gap-2 mb-2 rounded-xl p-3 justify-between">
          <div className="flex items-center gap-2 heading-h6 text-white/60">
            <Clock />
            <span>Contest Ends in</span>
          </div>
          <span className="heading-h6 text-green-light">{timeLeft?.time}</span>
        </div>
        <div className="bg-[#FFFFFF08] flex flex-col gap-2 mb-2 rounded-xl p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="heading-h6 text-white/60 flex items-center gap-1">
              <Percentage />
              <span>Your ROI</span>
              <Info />
            </div>
            <div
              className={`heading-h6 ${
                calculateTotalRoi() >= 0 ? "text-green-light" : "text-red-light"
              }`}
            >
              {calculateTotalRoi().toFixed(2)}%
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="heading-h6 text-white/60 flex items-center gap-1">
              <Bars />
              <span>Your Rank</span>
            </div>
            <div className="heading-h6 text-neutral-500">
              <span className="text-neutral-50">124</span>/11000
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF08] flex items-center gap-2 mb-5 rounded-xl p-3 justify-between">
          <div className="heading-h6 text-white/60 flex items-center gap-1">
            <Dollar />
            <span>You Won</span>
          </div>
          <div className="heading-h6 text-neutral-500 flex items-center gap-1">
            {bnToUiAmount(winnerReward, 6, 2)} USDC
            <USDC className="w-4 h-4" />
          </div>
        </div>
        {!isContestResolved && (
          <Button
            size="sm"
            iconRight={<ArrowRight />}
            disabled={contestEntry?.hasClaimed}
            className="w-full mb-2"
            onClick={handleResolveContest}
          >
            Resolve Contest
          </Button>
        )}
        <Button
          size="sm"
          iconRight={<ArrowRight />}
          disabled={hasAlreadyClaimed || !isWinner}
          className="w-full"
          onClick={handleClaimPrize}
        >
          {!isWinner && "No luck this time!"}
          {!hasAlreadyClaimed && isWinner && "You won. Claim Prize"}
          {hasAlreadyClaimed && "Already Claimed!"}
        </Button>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2 justify-between mb-3">
          <div className="text-neutral-50 heading-h5">Token Performance</div>
        </div>

        <div className="grid grid-cols-1 gap-2 mb-3">
          {contest.tokenFeedIds.map((tokenId, index) => {
            const tokenInfo = tokenInfos.find((token) => token.id === tokenId);
            const startPrice = contest.tokenStartPrices[index];
            const livePrice = livePrices?.find(
              (price: PriceData) => price.id === tokenId
            )?.price;
            const currentPrice = livePrice
              ? Number(livePrice.price) * Math.pow(10, livePrice.expo)
              : startPrice;
            const roi = calculateRoi(startPrice, currentPrice);

            return (
              <div key={tokenId} className="bg-[#FFFFFF08] rounded-xl p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Image
                      src={tokenInfo?.image || ""}
                      alt={tokenInfo?.name || "token"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="heading-h6 text-neutral-50">
                      {tokenInfo?.name}
                    </div>
                  </div>
                  <div
                    className={`heading-h6 ${
                      roi >= 0 ? "text-green-light" : "text-red-light"
                    }`}
                  >
                    {roi?.toFixed(2)}%
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="body-xs text-neutral-500">
                    <div>Start price</div>
                    <div> ${startPrice?.toFixed(8)}</div>
                  </div>
                  <div className="body-xs text-neutral-300 text-right">
                    <div>Current price</div>
                    <div> ${currentPrice?.toFixed(8)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContestCardDetails;
