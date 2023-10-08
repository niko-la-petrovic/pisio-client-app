import { Pagination } from "@nextui-org/pagination";
import { Selection } from "@nextui-org/table";
import { useMemo } from "react";

export default function usePagination({
  page,
  totalPages,
  isDisabled,
  onChange,
  selectedKeys,
  selectable,
}: {
  totalPages?: number;
  page: number;
  isDisabled?: boolean;
  onChange: (page: number) => void;
  selectedKeys: Selection;
  selectable?: number;
}) {
  const bottomContent = useMemo(() => {
    return (
      <>
        <div>
          {totalPages ? (
            <div className="flex items-center justify-between px-2 py-2">
              <Pagination
                showControls
                classNames={{
                  cursor: "bg-foreground text-background",
                }}
                color="default"
                isDisabled={isDisabled}
                page={page}
                total={totalPages}
                variant="light"
                onChange={onChange}
              />
              <span className="text-small text-default-400">
                {selectedKeys === "all"
                  ? "All items selected"
                  : `${selectedKeys.size} of ${selectable} selected`}
              </span>
            </div>
          ) : <></>}
        </div>
      </>
    );
  }, [totalPages, isDisabled, page, onChange, selectedKeys, selectable]);

  return bottomContent;
}
