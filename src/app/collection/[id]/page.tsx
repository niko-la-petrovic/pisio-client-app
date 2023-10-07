"use client";

import { GetCollectionResponse } from "@/types/api/responses";
import PageContainer from "@/components/page/pageContainer";
import { relativeApiFetcher } from "@/services/apiFetcher";
import useSWR from "swr";
import { useSwitch } from "@nextui-org/react";

export default function CollectionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data, isLoading, error } = useSWR<GetCollectionResponse>(
    `api/collection/${id}`,
    relativeApiFetcher,
  );
  // TODO handle error and loading
  return (
    <PageContainer title="Collection Details">
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{data?.name}</span>
      </div>
    </PageContainer>
  );
}
