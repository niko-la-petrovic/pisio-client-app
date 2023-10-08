import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

import { Button } from "@nextui-org/button";

export default function DeleteCollectionModal({
  name,
  vectorCount,
  isOpen,
  onOpenChange,
  onDelete,
}: {
  name: string;
  vectorCount?: string | number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>
                  Do you wish to delete&nbsp;
                  <span className="text-primary">{name}</span>?
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p className="flex items-baseline gap-1">
                    <span>All</span>
                    {vectorCount && (
                      <span className="text-danger">{vectorCount}</span>
                    )}
                    <span>vectors in this collection will be</span>{" "}
                    <span className="text-danger">deleted</span>.
                  </p>
                  <p className="font-semibold">
                    This action{" "}
                    <span className="text-danger">cannot be undone</span>.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onDelete}>
                  I&apos;m sure 😢
                </Button>
                <Button color="primary" onPress={onClose}>
                  My finger slipped 😅
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
