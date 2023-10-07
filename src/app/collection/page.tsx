"use client";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  GetCollectionResponse,
  GetCollectionResponsePaginated,
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

import { APIErrorResponse } from "@/types/api/errorResponse";
import { Button } from "@nextui-org/button";
import { CollectionColumnKey } from "@/types/tables";
import CollectionTableRow from "@/components/collection/CollectionTableRow";
import CreateCollectionModal from "@/components/modals/CreateCollectionModal";
import { Input } from "@nextui-org/input";
import PageContainer from "@/components/page/pageContainer";
import { Pagination } from "@nextui-org/pagination";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import SimpleRowsPerPage from "@/components/paging/SimpleRowsPerPage";
import { Spinner } from "@nextui-org/spinner";
import { debounce } from "lodash";
import { relativeApiQueryFetcher } from "@/services/apiFetcher";
import { useDisclosure } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import useSWR from "swr";

type Column = {
  key: CollectionColumnKey;
  label: string;
};

const columns: Column[] = [
  {
    key: CollectionColumnKey.Name,
    label: "Name",
  },
  {
    key: CollectionColumnKey.Embedding,
    label: "Embedding",
  },
  {
    key: CollectionColumnKey.Status,
    label: "Status",
  },
  {
    key: CollectionColumnKey.Actions,
    label: "Actions",
  },
];

// TODO add debounce to search

export default function CollectionsPage() {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>("");
  const hasSearchFilter = Boolean(filterValue);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
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

  const onSearchChange = useCallback((value?: string) => {
    if (value) setFilterValue(value);
    else setFilterValue("");
  }, []);

  const onRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(event.target.value));
    },
    [],
  );

  const {
    onOpen: openDelete,
    onClose: closeDelete,
    isOpen: isDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const {
    onOpen: openCreate,
    onClose: closeCreate,
    isOpen: isCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();
  const router = useRouter();

  const renderCell = useCallback(
    (item: GetCollectionResponse, key: string) =>
      CollectionTableRow(router, item, key),
    [router],
  );

  const bottomContent = useMemo(() => {
    return (
      <>
        {data?.totalPages && (
          <div className="flex items-center justify-between px-2 py-2">
            <Pagination
              showControls
              classNames={{
                cursor: "bg-foreground text-background",
              }}
              color="default"
              isDisabled={hasSearchFilter}
              page={page}
              total={data.totalPages}
              variant="light"
              onChange={setPage}
            />
            <span className="text-small text-default-400">
              {selectedKeys === "all"
                ? "All items selected"
                : `${selectedKeys.size} of ${data?.items?.length} selected`}
            </span>
          </div>
        )}
      </>
    );
  }, [
    hasSearchFilter,
    page,
    data?.totalPages,
    data?.items?.length,
    selectedKeys,
  ]);

  const deleteCollection = useCallback(
    async (id: string) => {
      await fetch(`/api/Collection/${id}`, {
        method: "DELETE",
      });
      mutate();
    },
    [mutate],
  );

  const onCreate = useCallback(() => {
    setPage(1);
    mutate();
  }, [mutate]);

  return (
    <PageContainer title="Collections">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name"
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <Button
            className="bg-foreground text-background"
            endContent={<PlusIcon />}
            size="sm"
            onClick={openCreate}
          >
            Add
          </Button>
          <CreateCollectionModal
            onCreate={onCreate}
            isOpen={isCreateOpen}
            onOpenChange={onCreateOpenChange}
            close={closeCreate}
          />
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-sm text-default-400">
            {data?.totalCount && (
              <span>Total of {data?.totalCount} collections</span>
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
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner />}
            emptyContent={isLoading ? <div></div> : "No collections found"}
            items={data?.items ?? []}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        {error && (
          <div className="flex flex-col gap-0 text-danger">
            <span className="font-bold">Error</span>
            <span className="font-semibold">
              Status <span className="">{error.status}</span> - {error.title}
            </span>
            <span className="">Please wait or or try again.</span>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
