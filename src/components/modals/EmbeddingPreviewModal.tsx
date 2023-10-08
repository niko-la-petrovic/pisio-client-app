import { AiOutlineCheck, AiOutlineCopy } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Snippet,
  scrollShadow,
} from "@nextui-org/react";
import { useCallback, useState } from "react";

export default function EmbeddingPreviewModal({
  embedding,
  isOpen,
  close,
  onOpenChange,
}: {
  embedding: number[];
  isOpen: boolean;
  close: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(embedding.join(","));
    setShowCopySuccess(true);
    setTimeout(() => {
      setShowCopySuccess(false);
    }, 2000);
  }, [embedding]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={close}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p>Inspect vector</p>
            </ModalHeader>
            <ModalBody>
              <ScrollShadow>
                <div className="h-64 overflow-y-scroll rounded-large bg-zinc-200 p-4">
                  {embedding.map((e, index) => (
                    <p key={index}>{e}</p>
                  ))}
                </div>
              </ScrollShadow>
              <ModalFooter>
                <Button
                  endContent={
                    showCopySuccess ? (
                      <AiOutlineCheck className="text-lg" />
                    ) : (
                      <AiOutlineCopy className="text-lg" />
                    )
                  }
                  color="secondary"
                  onClick={onCopy}
                >
                  Copy
                </Button>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
