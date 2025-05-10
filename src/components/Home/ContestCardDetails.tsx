"use client";

import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as Ticket } from "@/src/assets/icons/ticket.svg";
import { ReactComponent as Candle } from "@/src/assets/icons/candle.svg";
import { ReactComponent as ErrorIcon } from "@/src/assets/icons/error.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import ProgressBar from "../common/ProgressBar";
import Status from "../ui/Status/Status";
import Image from "next/image";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import { useProgram } from "@/src/hooks/program";
import { getTokenDraftContestsByAddress } from "@/src/api/contest/getContestByAddress";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { bnToUiAmount } from "@/src/utils/token";
import { useGetTokenPricesAtTimestamp } from "@/src/hooks/useGetTokenPricesAtTimestamp";
import ContestCardDetailsLoading from "../ui/Loading/ContestCardDetailsLoading";
import { enterTokenDraftContest } from "@/src/api/contest/enterContest";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getTokenDraftContestsEntry } from "@/src/api/contest/getContestEntry";
import { tokenInfos } from "@/src/config/tokens";
import { useGetLatestTokenPrices } from "@/src/hooks/useGetLatestTokenPrices";
import { showToast } from "../ui/Toast/ToastProvider";
import WalletConnectButton from "../common/WalletConnectButton";
import { useModalInviteCode } from "../common/ModalInviteCode";

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

// Utility functions for centralized logic
const getContestStatus = (
  contest: Contest,
  timeLeft: { isEnded: boolean; isEnding: boolean; isStarted: boolean } | null
): { title: string; variant: "error" | "success" | "warning" } => {
  if (contest.isResolved) return { title: "Resolved", variant: "success" };
  if (timeLeft?.isEnded) return { title: "Ended", variant: "error" };
  if (timeLeft?.isEnding) return { title: "Ending Soon", variant: "warning" };
  if (timeLeft?.isStarted) return { title: "In Progress", variant: "success" };
  return { title: "Not Started", variant: "warning" };
};

const getButtonText = (
  isLoading: boolean,
  hasJoined: boolean,
  timeLeft: { isEnded: boolean; isStarted: boolean } | null
) => {
  if (isLoading) return "Joining...";
  if (hasJoined) return "Already Joined";
  if (timeLeft?.isEnded) return "Contest Ended";
  if (timeLeft?.isStarted) return "Contest Already Started";
  return "Join Contest";
};

const getTimeDisplay = (
  timeLeft: { isEnded: boolean; isEnding: boolean; time: string } | null
) => {
  if (timeLeft?.isEnded) return "Contest Ended";
  return `${timeLeft?.isEnding ? "Ends in" : "Starts in"} ${
    !timeLeft?.isEnded ? timeLeft?.time : ""
  }`;
};

const ContestCardDetails = () => {
  const pg = useProgram();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const params = useParams();
  const [contest, setContest] = useState<Contest | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    time: string;
    isEnding: boolean;
    isStarted: boolean;
    isEnded: boolean;
  } | null>(null);
  const [creditAllocations, setCreditAllocations] = useState<number[]>([
    0, 0, 0, 0,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [hasInviteCode, setHasInviteCode] = useState<boolean | null>(null);
  const { openModalInviteCode } = useModalInviteCode();

  const { data: startPrices } = useGetTokenPricesAtTimestamp(
    contest?.tokenFeedIds || [],
    contest?.startTime || new Date().getTime()
  );

  const { data: currentPrices } = useGetLatestTokenPrices(
    contest?.tokenFeedIds || []
  );

  useEffect(() => {
    if (pg && params.slug && wallet && contest) {
      getTokenDraftContestsEntry(pg, {
        contestAddress: params.slug as string,
        userAddress: wallet.publicKey.toBase58(),
      })
        .then((entry) => {
          const hasEntered = !!entry;
          setHasJoined(hasEntered);
          setCreditAllocations(entry?.creditAllocation || []);
        })
        .catch((err) => {
          console.log("Error getting entry:", err);
        });
    }
  }, [pg, params.slug, wallet, contest]);

  useEffect(() => {
    if (pg && params.slug) {
      getTokenDraftContestsByAddress(pg, params.slug as string).then((res) => {
        if (res) {
          setContest({
            ...res,
            winnerIds: res.winnerIds.map(String),
          });
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

  useEffect(() => {
    const checkInviteCode = async () => {
      if (!wallet?.publicKey) {
        setHasInviteCode(false);
        return;
      }

      const walletAddress = wallet.publicKey.toBase58();
      if (!walletAddress) {
        setHasInviteCode(false);
        return;
      }

      const url = `/api/codes/${walletAddress}`;
      console.log("Fetching invite code with URL:", url);

      try {
        const response = await fetch(url);
        if (response.status === 404) {
          setHasInviteCode(false);
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to check invite code");
        }
        const data = await response.json();
        setHasInviteCode(!!data.inviteCode);
      } catch (error) {
        console.error("Error checking invite code:", error);
        setHasInviteCode(false);
      }
    };

    checkInviteCode();
  }, [wallet?.publicKey]);

  if (!contest) {
    return <ContestCardDetailsLoading />;
  }

  const progress = (contest.numEntries / contest.maxEntries) * 100;
  const spotsLeft = contest.maxEntries - contest.numEntries;

  const calculateRoi = (startPrice: number, currentPrice: number) => {
    if (!startPrice || !currentPrice) return 0;
    return ((currentPrice - startPrice) / startPrice) * 100;
  };

  const handleCreditChange = (index: number, value: string) => {
    const newValue = value === "" ? 0 : parseInt(value);
    if (isNaN(newValue) || newValue < 0) return;

    const newAllocations = [...creditAllocations];
    newAllocations[index] = newValue;
    setCreditAllocations(newAllocations);

    const total = newAllocations.reduce((sum, val) => sum + val, 0);
    if (total > 100) {
      setError("Total allocation cannot exceed 100");
    } else {
      setError(null);
    }
  };

  const handleJoinContest = async () => {
    if (!pg || !wallet || !connection) return;

    const total = creditAllocations.reduce((sum, val) => sum + val, 0);

    if (total !== 100) {
      setError("Total allocation must be exactly 100");
      return;
    }

    setIsLoading(true);
    try {
      const numTokens = contest.tokenFeedIds.length;
      await enterTokenDraftContest(pg, connection, wallet, {
        contestAddress: params.slug as string,
        creditAllocation: creditAllocations.slice(0, numTokens),
      });
      showToast.success("Contest joined successfully");

      // Refresh contest data
      const updatedContest = await getTokenDraftContestsByAddress(
        pg,
        params.slug as string
      );
      if (updatedContest) {
        setContest({
          ...updatedContest,
          winnerIds: updatedContest.winnerIds.map(String),
        });
      }

      // Refresh entry data
      const entry = await getTokenDraftContestsEntry(pg, {
        contestAddress: params.slug as string,
        userAddress: wallet.publicKey.toBase58(),
      });
      setHasJoined(!!entry);
      if (entry) {
        setCreditAllocations(entry.creditAllocation || []);
      }
    } catch (error) {
      console.error("Error joining contest:", error);
      setError("Failed to join contest. Please try again.");
      showToast.error("Failed to join contest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 p-6 border border-white/5 max-w-[362px] sm:max-w-full rounded-xl relative w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="heading-h3 text-neutral-50">Draft &Win</h3>
          <Status {...getContestStatus(contest, timeLeft)} />
        </div>
      </div>

      <div className="pb-5 border-b border-white/10">
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
        <div className="flex items-center justify-between">
          <div className="body-xs text-white/60">
            <div className="mb-1">Contest Progress</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-[2px]">
                <ProgressBar progress={progress} />
              </div>
              <div>{spotsLeft} Spots left</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2 justify-between mb-1">
          <div className="text-neutral-50 heading-h5">Allocate credit</div>
          <div className="text-orange-light heading-h6">
            Credit Balance:{" "}
            {100 - creditAllocations.reduce((sum, val) => sum + val, 0)}
          </div>
        </div>
        <p className="body-xs text-neutral-500 mb-3">
          {timeLeft?.isStarted
            ? "Contest has already started. Credit allocation is no longer available."
            : "Specify how much credit you want to allocation to each token below"}
        </p>
        <div className="flex flex-col gap-2 mb-3">
          {contest.tokenFeedIds.map((tokenId, index) => {
            const tokenInfo = tokenInfos.find((token) => token.id === tokenId);
            const startPrice = startPrices?.[tokenId] || 0;
            const currentPrice = currentPrices?.[tokenId] || 0;
            const roi = calculateRoi(startPrice, currentPrice);

            return (
              <div
                key={tokenId}
                className="flex items-center gap-2 justify-between"
              >
                <div className="flex-1 flex items-center gap-2">
                  <Image
                    src={tokenInfo?.image || ""}
                    alt={tokenInfo?.name || "token"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div>
                    <div className="heading-h6 text-neutral-50">
                      {tokenInfo?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="body-xs text-neutral-500">
                        ${startPrice?.toFixed(8)} ({" "}
                        <span
                          className={
                            roi >= 0 ? "text-green-light" : "text-red-light"
                          }
                        >
                          {roi.toFixed(2)}%
                        </span>{" "}
                        )
                      </div>
                      <Candle />
                    </div>
                  </div>
                </div>
                <div className="max-w-[72px]">
                  <Input
                    placeholder="00"
                    className="text-center appearance-none !w-[72px]"
                    value={creditAllocations[index].toString()}
                    onChange={(e) => handleCreditChange(index, e.target.value)}
                    type="number"
                    min="0"
                    max="100"
                    disabled={timeLeft?.isStarted || hasJoined}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="rounded-lg bg-red-light/10 p-2 flex items-center gap-2 body-xs text-red-light">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5">
          <div className="body-xs text-white/60 mb-3 text-center">
            {getTimeDisplay(timeLeft)}
          </div>
          {!wallet ? (
            <WalletConnectButton className="w-full" />
          ) : hasInviteCode !== true ? (
            <Button
              size="sm"
              onClick={() => openModalInviteCode()}
              className="w-full"
            >
              Enter Invite Code
            </Button>
          ) : (
            <Button
              size="sm"
              iconRight={<ArrowRight />}
              className="w-full"
              onClick={handleJoinContest}
              disabled={
                isLoading || error !== null || hasJoined || timeLeft?.isStarted
              }
            >
              {getButtonText(isLoading, hasJoined, timeLeft)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCardDetails;
