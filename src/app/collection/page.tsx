"use client";

import { ChangeEvent, useCallback, useState } from "react";
import { Dropdown, DropdownItem, DropdownTrigger } from "@nextui-org/dropdown";
import {
  GetCollectionResponse,
  GetCollectionResponsePaginated,
} from "@/types/api/responses";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

import { APIErrorResponse } from "@/types/api/errorResponse";
import { Button } from "@nextui-org/button";
import CreateCollectionModal from "@/components/modals/CreateCollectionModal";
import DeleteCollectionModal from "@/components/modals/DeleteCollectionModal";
import { DropdownMenu } from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import PageContainer from "@/components/page/pageContainer";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { RxUpdate } from "react-icons/rx";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { Spinner } from "@nextui-org/spinner";
import TimeAgo from "react-timeago";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";
import { relativeApiQueryFetcher } from "@/services/apiFetcher";
import { useDisclosure } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import useSWR from "swr";

enum ColumnKey {
  Name = "name",
  Status = "status",
  Actions = "actions",
  Embedding = "embeddingSize",
}

type Column = {
  key: ColumnKey;
  label: string;
};

const columns: Column[] = [
  {
    key: ColumnKey.Name,
    label: "Name",
  },
  {
    key: ColumnKey.Embedding,
    label: "Embedding",
  },
  {
    key: ColumnKey.Status,
    label: "Status",
  },
  {
    key: ColumnKey.Actions,
    label: "Actions",
  },
];

export default function CollectionsPage() {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>("");
  const hasSearchFilter = Boolean(filterValue);
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
    (item: GetCollectionResponse, columnKey: string) => {
      switch (columnKey) {
        case ColumnKey.Name:
          return (
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">
                {item.name}
              </span>
              {item.description && (
                <span className="overflow-ellipsis text-xs text-neutral-500">
                  {item.description}
                </span>
              )}
            </div>
          );
        case ColumnKey.Embedding:
          return (
            <div className="flex flex-col justify-start">
              {item.embeddingSize ? (
                <span className="flex gap-2">
                  <span>
                    n=<span className="font-semibold">{item.vectorCount}</span>
                  </span>
                  <span>
                    {" * "}
                    <span className="font-semibold text-secondary">
                      {item.embeddingSize}
                    </span>
                  </span>
                </span>
              ) : (
                <span className="text-xs text-neutral-200">
                  i&apos;m lonely :&#40;
                </span>
              )}
            </div>
          );
        case ColumnKey.Status:
          return (
            <div className="flex flex-col">
              <div>{item.createdAt && <TimeAgo date={item.createdAt} />}</div>
              <div className="flex items-center gap-1 text-blue-300">
                {item.lastUpdated && (
                  <>
                    <TimeAgo date={item.lastUpdated} />
                    <RxUpdate />
                  </>
                )}
              </div>
            </div>
          );
        case ColumnKey.Actions:
          return (
            <div className="relative flex items-center justify-end gap-2">
              <Dropdown
                closeOnSelect
                className="border-1 border-default-200 bg-background"
              >
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="actions"
                  onAction={(key) => {
                    setTimeout(() => {
                      router.push(key as string);
                    }, 500);
                  }}
                >
                  <DropdownItem
                    key={`/collection/${item.id}`}
                    value={`/collection/${item.id}`}
                    textValue="Inspect"
                  >
                    Inspect
                  </DropdownItem>
                  {/* TODO delete modal */}
                  <DropdownItem color="danger">Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
      }
    },
    [router],
  );

  const deleteCollection = useCallback(
    async (id: string) => {
      await fetch(`/api/Collection/${id}`, {
        method: "DELETE",
      });
      mutate();
    },
    [mutate],
  );

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
          <label className="flex items-center gap-1 text-small text-default-400">
            <span>Rows per page:</span>
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
        <Table aria-label="Collections">
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
