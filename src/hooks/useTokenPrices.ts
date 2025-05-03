import { useQuery } from "@tanstack/react-query";
import { HermesClient } from "@pythnetwork/hermes-client";

const priceServiceConnection = new HermesClient(
  "https://hermes.pyth.network/",
  {}
);

export const useTokenPrices = (tokenIds: string[]) => {
  return useQuery({
    queryKey: ["tokenPrices", tokenIds],
    queryFn: async () => {
      const priceService = await priceServiceConnection.getLatestPriceUpdates(
        tokenIds,
        {
          encoding: "base64",
        }
      );
      return priceService.parsed;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};
