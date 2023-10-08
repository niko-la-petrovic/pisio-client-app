"use client";

import {
  GetCollectionResponse,
  GetVectorResponse,
} from "@/types/api/responses";

import { APIErrorResponse } from "@/types/api/errorResponse";
import PageContainer from "@/components/page/pageContainer";
import { RxUpdate } from "react-icons/rx";
import TimeAgo from "react-timeago";
import { relativeApiFetcher } from "@/services/apiFetcher";
import useSWR from "swr";

export default function CollectionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const {
    data: collectionData,
    isLoading: collectionIsLoading,
    error: collectionError,
  } = useSWR<GetCollectionResponse, APIErrorResponse>(
    `api/collection/${id}`,
    relativeApiFetcher,
  );

  const { data, isLoading, error } = useSWR<
    GetVectorResponse,
    APIErrorResponse
  >(`api/vector/collection/${id}`, relativeApiFetcher);

  // TODO handle error and loading
  return (
    <PageContainer title="Collection Details">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          {collectionIsLoading && <span>Loading...</span>}
          {collectionError && (
            <div className="flex flex-col text-danger">
              <span className="font-bold">Error</span>
              <span>
                {collectionError.status} - {collectionError.title}
              </span>
            </div>
          )}
          <div>
            <span className="text-2xl font-bold">{collectionData?.name}</span>
            {collectionData?.createdAt && (
              <div className="flex items-center gap-1 text-sm">
                <span>created</span>
                <TimeAgo
                  date={collectionData?.createdAt}
                  className="font-semibold"
                />
              </div>
            )}
            {collectionData?.lastUpdated && (
              <div className="flex items-center gap-1 text-sm text-blue-300">
                <span>updated</span>
                <TimeAgo
                  date={collectionData?.lastUpdated}
                  className="font-semibold"
                />
                <RxUpdate />
              </div>
            )}
          </div>
          <span className="text-default-700">
            {collectionData?.description}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {collectionData?.embeddingSize && (
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Embedding</span>
              <span className="text-default-700">
                n=
                <span className="font-semibold">
                  {collectionData?.vectorCount}
                </span>
                {" * "}
                <span className="font-semibold text-secondary">
                  {collectionData?.embeddingSize}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end"></div>
      {/* TODO vector table */}
    </PageContainer>
  );
}
