import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "@nextui-org/button";
import { GetVectorResponse } from "@/types/api/responses";
import TimeStatus from "../table/TimeStatus";
import { VectorColumnKey } from "@/types/tables";
import { VerticalDotsIcon } from "../icons/VerticalDotsIcon";

const previewEmbeddingSize = 6;

export default function VectorTableRow(
  router: AppRouterInstance,
  item: GetVectorResponse,
  columnKey: string,
  onDelete: () => void,
) {
  switch (columnKey) {
    case VectorColumnKey.Class:
      return (
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-none">
            {item.class}
          </span>
          {item.description && (
            <span className="overflow-ellipsis text-xs text-neutral-500">
              {item.description}
            </span>
          )}
        </div>
      );
    case VectorColumnKey.Embedding:
      return (
        <div className="flex flex-col justify-start">
          {item.embedding?.length ? (
            <span className="flex items-baseline gap-2">
              {item.embedding.slice(0, previewEmbeddingSize).map((e, index) => {
                return <span key={index}>{e}</span>;
              })}
              {item.embedding.length > previewEmbeddingSize && (
                <span className="text-neutral-200">...</span>
              )}
            </span>
          ) : (
            <span className="text-xs text-neutral-200">
              i&apos;m lonely :&#40;
            </span>
          )}
        </div>
      );
    case VectorColumnKey.Status:
      return (
        <TimeStatus createdAt={item.createdAt} lastUpdated={item.lastUpdated} />
      );
    case VectorColumnKey.Actions:
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
            <DropdownMenu aria-label="actions">
              <DropdownItem>Inspect</DropdownItem>
              <DropdownItem color="danger" onClick={onDelete}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
  }
}
