"use client";

import {
  GetCollectionResponse,
  GetVectorResponse,
  GetVectorResponsePaginated,
} from "@/types/api/responses";
import {
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  relativeApiFetcher,
  relativeApiQueryFetcher,
} from "@/services/apiFetcher";
import { useCallback, useState } from "react";

import { APIErrorResponse } from "@/types/api/errorResponse";
import AddButton from "@/components/buttons/AddButton";
import CreateVectorModal from "@/components/modals/CreateVectorModal";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import PageContainer from "@/components/page/pageContainer";
import { RxUpdate } from "react-icons/rx";
import { SearchIcon } from "@/components/icons/SearchIcon";
import SimpleRowsPerPage from "@/components/paging/SimpleRowsPerPage";
import { Spinner } from "@nextui-org/react";
import TimeAgo from "react-timeago";
import { VectorColumnKey } from "@/types/tables";
import VectorTableRow from "@/components/vector/VectorTableRow";
import useClientTheme from "@/services/useClientTheme";
import { useDisclosure } from "@nextui-org/modal";
import usePagination from "@/hooks/usePagination";
import { useRouter } from "next/navigation";
import useSWR from "swr";

type Column = {
  key: VectorColumnKey;
  label: string;
};

const columns: Column[] = [
  {
    key: VectorColumnKey.Class,
    label: "Class",
  },
  {
    key: VectorColumnKey.Status,
    label: "Status",
  },
  {
    key: VectorColumnKey.Embedding,
    label: "Embedding",
  },
  {
    key: VectorColumnKey.Actions,
    label: "Actions",
  },
];

// TODO add debounce to search
// TODO add loading skeletons

export default function CollectionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const theme = useClientTheme();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const hasFilter = Boolean(filterValue);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const {
    data: collectionData,
    isLoading: collectionIsLoading,
    error: collectionError,
    mutate: collectionMutate,
  } = useSWR<GetCollectionResponse, APIErrorResponse>(
    `api/collection/${id}`,
    relativeApiFetcher,
  );

  const {
    isOpen: isCreateOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
    onOpenChange: createOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();

  const {
    data: vectors,
    isLoading: isLoadingVectors,
    error: vectorError,
    mutate: vectorMutate,
  } = useSWR<GetVectorResponsePaginated, APIErrorResponse>(
    [`api/vector/collection/${id}`, `page=${page}&pageSize=${rowsPerPage}`],
    ([route, query]) => relativeApiQueryFetcher(route, query as string),
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) setFilterValue(value);
    else setFilterValue("");
  }, []);

  const onCreate = useCallback(() => {
    collectionMutate();
    vectorMutate();
  }, [collectionMutate, vectorMutate]);

  const router = useRouter();
  const [selectedItem, setSelectedItem] =
    useState<GetCollectionResponse | null>(null);

  const pagination = usePagination({
    onChange: setPage,
    page,
    selectable: vectors?.items?.length,
    selectedKeys,
    isDisabled: isLoadingVectors,
    totalPages: vectors?.totalPages,
  });

  const renderCell = useCallback(
    (item: GetVectorResponse, key: string) =>
      VectorTableRow(router, item, key, () => {
        setSelectedItem(item);
        item?.id && deleteOnOpen();
      }),
    [deleteOnOpen, router],
  );

  // TODO delete collection button
  // TODO delete vector modal
  // TODO handle error and loading
  return (
    <PageContainer title="Collection Details">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            {collectionIsLoading && (
              <div className="flex items-center gap-4">
                <Spinner /> Loading...
              </div>
            )}
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
            {collectionData?.embeddingSize ? (
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
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">Embedding</span>
                <span className="text-default-700">i&apos;m lonely :&#40;</span>
              </div>
            )}
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-4">
          <span className="font-light">Vectors in collection</span>
          <div className="flex justify-between gap-4">
            <Input
              isClearable
              classNames={{
                base: "w-full sm:max-w-[44%]",
                inputWrapper: "border-1",
              }}
              placeholder="Search by class or description"
              size="sm"
              startContent={<SearchIcon className="text-default-300" />}
              value={filterValue}
              variant="bordered"
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            />
            <AddButton
              isDisabled={collectionIsLoading}
              onClick={createOnOpen}
            />
            <CreateVectorModal
              embeddingSize={collectionData?.embeddingSize}
              collectionId={id}
              onCreate={onCreate}
              isOpen={isCreateOpen}
              onOpenChange={createOnOpenChange}
              close={createOnClose}
            />
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-default-400">
              {vectors?.totalCount != undefined && (
                <span>Total of {vectors.totalCount} vectors</span>
              )}
            </span>
            <SimpleRowsPerPage
              onChange={setRowsPerPage}
              value={rowsPerPage}
              options={[5, 10, 25, 50]}
            />
          </div>
          <Table
            aria-label="Collections"
            selectedKeys={selectedKeys}
            selectionMode="single"
            bottomContent={pagination}
            bottomContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
          >
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody
              isLoading={isLoadingVectors}
              loadingContent={<Spinner />}
              emptyContent={
                isLoadingVectors ? (
                  <div></div>
                ) : (
                  <div className="flex flex-col items-center gap-0">
                    <span>No vectors found :&#40; </span>
                  </div>
                )
              }
              items={vectors?.items ?? []}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      <></>
                      {renderCell(item, columnKey as string)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  );
}
