"use client";

import {
  GetCollectionResponse,
  GetCollectionResponsePaginated,
} from "@/types/api/responses";

import PageContainer from "@/components/page/pageContainer";
import { relativeApiFetcher } from "@/services/apiFetcher";
import useSWR from "swr";

export default function CollectionsPage() {
  const { data, error, isLoading, isValidating } =
    useSWR<GetCollectionResponsePaginated>(
      "api/Collection",
      relativeApiFetcher,
    );
  return (
    <PageContainer title="Collections">
      <></>
    </PageContainer>
  );
}
