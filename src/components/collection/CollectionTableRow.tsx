import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "@nextui-org/button";
import { CollectionColumnKey } from "@/types/tables";
import { GetCollectionResponse } from "@/types/api/responses";
import { RxUpdate } from "react-icons/rx";
import TimeAgo from "react-timeago";
import { VerticalDotsIcon } from "../icons/VerticalDotsIcon";

export default function CollectionTableRow(
  router: AppRouterInstance,
  item: GetCollectionResponse,
  columnKey: string,
) {
  switch (columnKey) {
    case CollectionColumnKey.Name:
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
    case CollectionColumnKey.Embedding:
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
    case CollectionColumnKey.Status:
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
    case CollectionColumnKey.Actions:
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
}
