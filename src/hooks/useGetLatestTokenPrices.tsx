import { useQuery } from "@tanstack/react-query";
import { HermesClient } from "@pythnetwork/hermes-client";

const priceServiceConnection = new HermesClient(
  "https://hermes.pyth.network/",
  {}
);

export const useGetLatestTokenPrices = (tokenIds: string[]) => {
  return useQuery({
    queryKey: ["tokenPricesLatest", tokenIds],
    queryFn: async () => {
      const priceService = await priceServiceConnection.getLatestPriceUpdates(
        tokenIds,
        {
          encoding: "base64",
        }
      );

      const priceDataArr = priceService.parsed || [];
      const prices: Record<string, number> = {};
      for (const data of priceDataArr) {
        const tokenId = `0x${data.id.toLowerCase()}`;
        const price = Number(data.price.price) * Math.pow(10, data.price.expo);
        prices[tokenId] = price;
      }

      return prices;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
    enabled: tokenIds.length > 0,
  });
};
