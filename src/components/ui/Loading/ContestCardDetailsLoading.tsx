import { ReactComponent as Dollar } from "@/src/assets/icons/dollar.svg";
import { ReactComponent as Ticket } from "@/src/assets/icons/ticket.svg";
import { ReactComponent as Candle } from "@/src/assets/icons/candle.svg";
import { ReactComponent as Error } from "@/src/assets/icons/error.svg";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";

const ContestCardDetailsLoading = () => {
  return (
    <div className="bg-neutral-950 p-6 border border-white/5 max-w-[362px] rounded-xl relative w-full animate-pulse">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="h-8 w-32 bg-neutral-800 rounded" />
          <div className="h-6 w-20 bg-neutral-800 rounded" />
        </div>
      </div>

      {/* Prize Pool and Entry Fee Section */}
      <div className="pb-5 border-b border-white/10">
        <div className="flex items-center gap-6 justify-between mb-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Dollar className="opacity-50" />
              <div className="h-4 w-16 bg-neutral-800 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 bg-neutral-800 rounded" />
              <USDC className="w-4 h-4 opacity-50" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <Ticket className="opacity-50" />
              <div className="h-4 w-16 bg-neutral-800 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 bg-neutral-800 rounded" />
              <USDC className="w-4 h-4 opacity-50" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="body-xs text-white/60">
            <div className="h-4 w-24 bg-neutral-800 rounded mb-1" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-neutral-800 rounded" />
              <div className="h-4 w-16 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Token Allocation Section */}
      <div className="mt-5">
        <div className="flex items-center gap-2 justify-between mb-1">
          <div className="h-6 w-32 bg-neutral-800 rounded" />
          <div className="h-5 w-24 bg-neutral-800 rounded" />
        </div>
        <div className="h-4 w-64 bg-neutral-800 rounded mb-3" />

        <div className="flex flex-col gap-2 mb-3">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex items-center gap-2 justify-between"
            >
              <div className="flex-1 flex items-center gap-2">
                <div className="w-6 h-6 bg-neutral-800 rounded-full" />
                <div>
                  <div className="h-5 w-16 bg-neutral-800 rounded mb-1" />
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-32 bg-neutral-800 rounded" />
                    <Candle className="opacity-50" />
                  </div>
                </div>
              </div>
              <div className="h-8 w-16 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>

        {/* Error Message Section */}
        <div className="rounded-lg bg-red-light/10 p-2 flex items-center gap-2">
          <Error className="opacity-50" />
          <div className="h-4 w-48 bg-neutral-800 rounded" />
        </div>

        {/* Timer and Button Section */}
        <div className="mt-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-4 w-16 bg-neutral-800 rounded" />
            <div className="h-5 w-24 bg-neutral-800 rounded" />
          </div>
          <div className="h-10 w-full bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ContestCardDetailsLoading;
