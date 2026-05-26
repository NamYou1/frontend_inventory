import { SellerService } from "@/services/SellerService";
import type { SellerFilter } from "@/types/Seller.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const sellerKeys = {
  all: ["sellers"] as const,
  lists: () => [...sellerKeys.all, "list"] as const,
  list: (filter: SellerFilter) => [...sellerKeys.lists(), filter] as const,
};

export function useSellers(filter: SellerFilter = {}) {
  return useQuery({
    queryKey: sellerKeys.list(filter),
    queryFn: () => SellerService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}
