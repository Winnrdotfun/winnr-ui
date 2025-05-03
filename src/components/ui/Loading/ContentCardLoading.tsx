import React from "react";

const ContentCardLoading = () => {
  return (
    <div className="bg-neutral-950 mb-5 border border-white/5 rounded-3xl p-2 relative w-full max-w-[600px] animate-pulse">
      <div className="mb-8 px-4 pt-6">
        <div className="max-w-[400px] w-full">
          <div className="h-6 w-40 bg-neutral-800 rounded mb-5" />
          <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 bg-neutral-800 rounded-full" />
            <div className="h-4 w-20 bg-neutral-800 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[38px] w-32 bg-neutral-800 rounded" />
            <div className="w-[26px] h-[26px] bg-neutral-800 rounded-full" />
          </div>
        </div>
      </div>
      <div className="bg-black/40 rounded-2xl p-2 pl-4 flex items-center justify-between backdrop-blur-lg">
        <div className="body-xs text-white/60">
          <div className="mb-1 h-4 w-24 bg-neutral-800 rounded" />
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-[2px]">
              <div className="h-3 w-32 bg-neutral-800 rounded" />
            </div>
            <div className="h-4 w-20 bg-neutral-800 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-neutral-800 rounded" />
          <div className="h-10 w-32 bg-neutral-800 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default ContentCardLoading;
