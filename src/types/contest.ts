export interface Contest {
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
  winnerIds: number[];
  winnerRewardAllocation: number[];
  isResolved: boolean;
}
