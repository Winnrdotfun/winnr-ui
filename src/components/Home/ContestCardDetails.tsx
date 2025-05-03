"use client";

import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as Ticket } from "@/src/assets/icons/ticket.svg";
import { ReactComponent as Candle } from "@/src/assets/icons/candle.svg";
import { ReactComponent as Error } from "@/src/assets/icons/error.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import Bonk from "@/src/assets/tokens/bonk.png";
import Popcat from "@/src/assets/tokens/popcat.png";
import Wif from "@/src/assets/tokens/wif.png";
import Trump from "@/src/assets/tokens/trump.webp";
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
import { useTokenPrices } from "@/src/hooks/useTokenPrices";
import ContestCardDetailsLoading from "../ui/Loading/ContestCardDetailsLoading";
import { enterTokenDraftContest } from "@/src/api/contest/enterContest";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

interface PriceData {
  price: {
    price: string;
    expo: number;
  };
  id: string;
}

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

const TOKEN_INFO = [
  {
    id: "72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419",
    name: "BONK",
    image: Bonk,
  },
  {
    id: "b9312a7ee50e189ef045aa3c7842e099b061bd9bdc99ac645956c3b660dc8cce",
    name: "POPCAT",
    image: Popcat,
  },
  {
    id: "4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc",
    name: "WIF",
    image: Wif,
  },
  {
    id: "879551021853eec7a7dc827578e8e69da7e4fa8148339aa0d3d5296405be4b1a",
    name: "TRUMP",
    image: Trump,
  },
];

const ContestCardDetails = () => {
  const pg = useProgram();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const params = useParams();
  const [contest, setContest] = useState<Contest | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    time: string;
    isEnding: boolean;
  } | null>(null);

  const { data: livePrices } = useTokenPrices(contest?.tokenFeedIds || []);

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
        const distance = startTime > now ? startTime - now : endTime - now;
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({
          time: `${hours}h : ${minutes}m : ${seconds}s`,
          isEnding: startTime <= now,
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contest]);

  if (!contest) {
    return <ContestCardDetailsLoading />;
  }

  const progress = (contest.numEntries / contest.maxEntries) * 100;
  const spotsLeft = contest.maxEntries - contest.numEntries;

  const calculateRoi = (startPrice: number, currentPrice: number) => {
    if (!startPrice || !currentPrice) return 0;
    return ((currentPrice - startPrice) / startPrice) * 100;
  };

  const handleJoinContest = async () => {
    if (!pg || !wallet || !connection) return;
    // setLoading(true);
    try {
      await enterTokenDraftContest(pg, connection, wallet, {
        contestAddress: params.slug as string,
        creditAllocation: [25, 25, 25, 25], // Example allocation - must sum to 100
      });
      // Success message or redirect
    } catch (error) {
      console.error("Error joining contest:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 p-6 border border-white/5 max-w-[362px] rounded-xl relative w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="heading-h3 text-neutral-50">Draft &Win</h3>
          <Status
            title={timeLeft?.isEnding ? "Ending" : "Not Started"}
            variant="warning"
          />
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
            Credit Balance: 100
          </div>
        </div>
        <p className="body-xs text-neutral-500 mb-3">
          Specify how much credit you want to allocation to each token below
        </p>
        <div className="flex flex-col gap-2 mb-3">
          {contest.tokenFeedIds.map((tokenId, index) => {
            const tokenInfo = TOKEN_INFO.find((token) => token.id === tokenId);
            const startPrice = contest.tokenStartPrices[index];
            const livePrice = livePrices?.find(
              (price: PriceData) => price.id === tokenId
            )?.price;
            const currentPrice = livePrice
              ? Number(livePrice.price) * Math.pow(10, livePrice.expo)
              : startPrice;
            const roi = calculateRoi(startPrice, currentPrice);

            return (
              <div
                key={tokenId}
                className="flex items-center gap-2 justify-between"
              >
                <div className="flex-1 flex items-center gap-2">
                  <Image
                    src={tokenInfo?.image || Bonk}
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
                        ${startPrice.toFixed(8)} ({" "}
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
                  <Input placeholder="00" className="text-center" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg bg-red-light/10 p-2 flex items-center gap-2 body-xs text-red-light">
          <Error />
          <span>Allocation can not be empty</span>
        </div>

        <div className="mt-5">
          <div className="body-xs text-white/60 mb-3 text-center">
            {timeLeft?.isEnding ? "Ends in" : "Starts in"}
            <span className="heading-h6 ml-1.5 text-neutral-50">
              {timeLeft?.time}
            </span>
          </div>
          <Button
            size="sm"
            iconRight={<ArrowRight />}
            className="w-full"
            onClick={handleJoinContest}
          >
            Join Contest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestCardDetails;
