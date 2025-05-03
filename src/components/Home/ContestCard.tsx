'use client";';

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
import { getTokenDraftContestsByAddress } from "@/src/api/contest/getContestByAddress";

const ContestCard = () => {
  const pg = useProgram();

  getAllTokenDraftContests(pg!).then((res) => console.log("all contests", res));
  getTokenDraftContestsByAddress(
    pg!,
    "6VqhQdJSQSQFd3cc4yRFUj9xoZBog8x5rS32dowEnx37"
  ).then((res) => console.log("contest by address", res));

  return (
    <Link
      href={`/contest/win-draft`}
      className="bg-neutral-950 block mb-5 border border-white/5 rounded-3xl p-2 relative w-full"
    >
      <div className="absolute top-0 right-10">
        <Image
          src={cup}
          alt="cup"
          width={228}
          height={228}
          className="mix-blend-lighten"
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
            <div className="heading-h1 text-neutral-50">10,000 USDC</div>
            <USDC className="w-[26px] h-[26px]" />
          </div>
        </div>
      </div>
      <div className="bg-black/40 rounded-2xl p-2 pl-4 flex items-center justify-between backdrop-blur-lg">
        <div className="body-xs text-white/60">
          <div className="mb-1">Contest Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex gap-[2px]">
              <ProgressBar progress={16} />
            </div>
            <div>345 Spots left</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="body-xs text-white/60">
            Starts in
            <span className="heading-h6 ml-1.5 text-neutral-50">
              24h : 34m : 13s
            </span>
          </div>
          <Button size="sm" iconRight={<ArrowRight />}>
            Enter with $10
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ContestCard;
