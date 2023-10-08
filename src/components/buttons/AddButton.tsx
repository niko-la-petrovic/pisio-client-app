import { Button } from "@nextui-org/button";
import { PlusIcon } from "../icons/PlusIcon";

export default function AddButton({
  onClick,
  isDisabled,
}: {
  onClick: () => void;
  isDisabled?: boolean;
}) {
  return (
    <Button
      disabled={isDisabled}
      className="bg-foreground text-background"
      endContent={<PlusIcon />}
      size="sm"
      onClick={onClick}
    >
      Add
    </Button>
  );
}
