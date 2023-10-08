import { useCallback, useState } from "react";

import { Input } from "@nextui-org/react";
import { SearchIcon } from "../icons/SearchIcon";

export default function CollectionSelector() {
  const [filterValue, setFilterValue] = useState<string>("");

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value ?? "");
  }, []);

  return (
    <div className="">
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
    </div>
  );
}
