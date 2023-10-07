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
}: {
  name: string;
  vectorCount?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
                    All
                    {vectorCount && (
                      <span className="text-lg text-danger">{vectorCount}</span>
                    )}
                    vectors in this collection will be{" "}
                    <span className="text-danger">deleted</span>.
                  </p>
                  <p className="font-semibold">
                    This action{" "}
                    <span className="text-danger">cannot be undone</span>.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
