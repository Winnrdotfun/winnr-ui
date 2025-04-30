import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as Ticket } from "@/src/assets/icons/ticket.svg";
import { ReactComponent as Candle } from "@/src/assets/icons/candle.svg";
import { ReactComponent as Error } from "@/src/assets/icons/error.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import Bonk from "@/src/assets/tokens/bonk.png";
import ProgressBar from "../common/ProgressBar";
import Status from "../ui/Status/Status";
import Image from "next/image";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";

const ContestCardDetails = () => {
  return (
    <div className="bg-neutral-950 p-6 border border-white/5 max-w-[362px] rounded-xl relative w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="heading-h3 text-neutral-50">Draft &Win</h3>
          <Status title="Not Started" variant="warning" />
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
              <div className="heading-h4 text-neutral-50">10,000 USDC</div>
              <USDC className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <Ticket />
              <div className="heading-h6 text-neutral-500">Entry Fee</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="heading-h4 text-neutral-50">10 USDC</div>
              <USDC className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="body-xs text-white/60">
            <div className="mb-1">Contest Progress</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-[2px]">
                <ProgressBar progress={16} />
              </div>
              <div>345 Spots left</div>
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
          <div className="flex items-center gap-2 justify-between">
            <div className="flex-1 flex items-center gap-2">
              <Image src={Bonk} alt="bonk" width={24} height={24} />
              <div>
                <div className="heading-h6 text-neutral-50">BONK</div>
                <div className="flex items-center gap-1">
                  {" "}
                  <div className="body-xs text-neutral-500">
                    $0.000045 ( <span className="text-red-light">-4.5%</span> )
                  </div>
                  <Candle />
                </div>
              </div>
            </div>
            <div className="max-w-[72px]">
              <Input placeholder="00" className="text-center" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-red-light/10 p-2 flex items-center gap-2 body-xs text-red-light">
          <Error />
          <span>Allocation can not be empty</span>
        </div>

        <div className="mt-5">
          <div className="body-xs text-white/60 mb-3 text-center">
            Starts in
            <span className="heading-h6 ml-1.5 text-neutral-50">
              24h : 34m : 13s
            </span>
          </div>
          <Button size="sm" iconRight={<ArrowRight />} className="w-full">
            Join Contest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestCardDetails;
