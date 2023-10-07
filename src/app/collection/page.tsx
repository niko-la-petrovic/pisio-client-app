"use client";

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

import { Button } from "@nextui-org/button";
import { DropdownMenu } from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import PageContainer from "@/components/page/pageContainer";
import { Spinner } from "@nextui-org/spinner";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";
import { relativeApiFetcher } from "@/services/apiFetcher";
import { useCallback } from "react";
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
  const { data, error, isLoading, isValidating } =
    useSWR<GetCollectionResponsePaginated>(
      "api/Collection",
      relativeApiFetcher,
    );

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
                <span>
                  n=<span className="font-semibold">{item.vectorCount}</span>
                  {" * "}
                  <span className="font-semibold">{item.embeddingSize}</span>
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
              <span>{item.createdAt?.toString()}</span>
              {item.lastUpdated && <span>{item.lastUpdated?.toString()}</span>}
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
                  onAction={(key) =>
                    setTimeout(() => {
                      router.push(key as string);
                    }, 500)
                  }
                >
                  <DropdownItem
                    key={`/collection/${item.id}`}
                    value={`/collection/${item.id}`}
                    textValue="Inspect"
                  >
                    Inspect
                  </DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
      }
    },
    [],
  );

  return (
    <PageContainer title="Collections">
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
              {/* TODO fix type error */}
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </PageContainer>
  );
}
