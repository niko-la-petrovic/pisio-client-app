import { ChangeEvent, useCallback } from "react";

export default function SimpleRowsPerPage({
  onChange,
  value,
  options,
}: {
  onChange: (value: number) => void;
  value: number;
  options?: number[];
}) {
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onChange(Number(event.target.value));
    },
    [onChange],
  );
  return (
    <label className="flex items-center gap-1 text-small text-default-400">
      <span>Rows per page:</span>
      <select
        className="bg-transparent text-small text-default-400 outline-none"
        onChange={onChangeCallback}
        value={value}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
