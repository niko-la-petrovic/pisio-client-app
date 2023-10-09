import { APIErrorResponse } from "@/types/api/errorResponse";
import { GetCollectionResponsePaginated } from "@/types/api/responses";
import { relativeApiQueryFetcher } from "@/services/apiFetcher";
import useSWR from "swr";

export default function useCollectiions({
  hasSearchFilter,
  filterValue,
  page,
  rowsPerPage,
}: {
  hasSearchFilter: boolean;
  filterValue: string;
  page: number;
  rowsPerPage: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<
    GetCollectionResponsePaginated,
    APIErrorResponse
  >(
    [
      "api/Collection",
      (hasSearchFilter ? `nameQuery=${filterValue}&` : "") +
        `page=${page}&pageSize=${rowsPerPage}`,
    ],
    ([route, query]) => relativeApiQueryFetcher(route, query as string),
  );

  return { data, error, isLoading, mutate };
}
