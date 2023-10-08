import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

import { Button } from "@nextui-org/button";
import { Snippet } from "@nextui-org/react";

export default function DeleteVectorModal({
  vectorId,
  vectorClass,
  isOpen,
  onOpenChange,
  onDelete,
}: {
  vectorId: string;
  vectorClass: string;
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
                  Do you wish to delete a vector of class &nbsp;
                  <span className="text-primary">{vectorClass}</span>?
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p>
                    This action will <span className="text-danger">delete</span>{" "}
                    the vector with id&nbsp;
                    <Snippet>{vectorId}</Snippet>
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
