import { Input, Listbox, ListboxItem } from "@nextui-org/react";
import { useCallback, useState } from "react";

import { GetCollectionResponse } from "@/types/api/responses";
import { SearchIcon } from "../icons/SearchIcon";
import { filter } from "lodash";
import useCollectiions from "@/hooks/api/useCollections";
import useSWR from "swr";

function renderSuggestion(
  collection: GetCollectionResponse,
  selected?: boolean,
) {
  return (
    <div className="flex items-center justify-between">
      <span>{collection.name}</span>
    </div>
  );
}

export default function CollectionSelector({
  onCollectionSelected,
}: {
  onCollectionSelected?: (collection: GetCollectionResponse) => void;
}) {
  const [filterValue, setFilterValue] = useState<string>("");
  const hasFilterValue = Boolean(filterValue);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCollection, setSelectedCollection] =
    useState<GetCollectionResponse | null>(null);

  const { data, isLoading, error } = useCollectiions({
    filterValue,
    hasSearchFilter: hasFilterValue,
    page: 1,
    rowsPerPage: 5,
  });

  const suggestionSelected = useCallback(
    (collection: GetCollectionResponse) => {
      setSelectedCollection(collection);
    },
    [],
  );

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value ?? "");
  }, []);

  const onBlur = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const dataItems = data?.items ?? [];

  return (
    <div className="relative">
      <Input
        onFocus={onFocus}
        onBlur={onBlur}
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
      {/* TODO isLoading */}
      {isOpen && (
        <Listbox
          selectionMode="single"
          aria-label="Collection selector"
          className="max-w-16 absolute z-50 mt-1 max-h-48 overflow-auto rounded-xl border-2 bg-white shadow-xl dark:bg-black"
          items={dataItems}
          onSelectionChange={(key) => {
            if (key === "all") return;
            const id = key.values().next().value;
            const suggestion = dataItems.find(
              (collection) => collection.id === id,
            );
            if (!suggestion) return;
            suggestionSelected(suggestion);
            setIsOpen(false);
            onCollectionSelected && onCollectionSelected(suggestion);
          }}
        >
          
          {(collection) => {
            if (collection.id === undefined) return <></>;
            const isSelected = selectedCollection?.id === collection.id;
            return (
              <ListboxItem
                aria-label={collection.name}
                key={collection.id}
                textValue={collection.name}
              >
                {renderSuggestion(collection, isSelected)}
              </ListboxItem>
            );
          }}
        </Listbox>
      )}
    </div>
  );
}
