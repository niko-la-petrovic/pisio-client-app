import {
  CreateVectorRequest,
  CreateVectorResponse,
} from "@/types/api/responses";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { useCallback, useMemo, useState } from "react";

import { APIErrorResponse } from "@/types/api/errorResponse";
import { Button } from "@nextui-org/button";
import { relativeApiJsonSender } from "@/services/apiFetcher";
import { toast } from "react-toastify";
import useClientTheme from "@/services/useClientTheme";

export default function CreateVectorModal({
  collectionId,
  embeddingSize,
  isOpen,
  onOpenChange,
  close,
  onCreate,
}: {
  embeddingSize?: number;
  collectionId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  close: () => void;
  onCreate: () => void;
}) {
  const theme = useClientTheme();

  const [vectorClass, setVectorClass] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [embedding, setEmbedding] = useState<number[]>([]);
  const [embeddingError, setEmbeddingError] = useState<string | null>(null);
  const [vectorClassTouched, setVectorClassTouched] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    const body: CreateVectorRequest = {
      class: vectorClass ? vectorClass : undefined,
      collectionId,
      description: description ? description : undefined,
      embedding,
    };

    relativeApiJsonSender<CreateVectorResponse>({
      body: body,
      method: "POST",
      route: "api/vector",
    })
      .then((res) => {
        console.log(theme);
        toast.success("Vector created", {
          theme,
        });
        onCreate();
        close();
      })
      .catch((err: APIErrorResponse) => {
        console.error(err);
        toast.error(
          <div className="">
            <p className="font-bold">Error creating vector</p>
            {err.title && <p>{err.title}</p>}
            {err.status && <p>Status {err.status}</p>}
          </div>,
          {
            theme,
          },
        );
      });
  }, [
    close,
    collectionId,
    description,
    embedding,
    onCreate,
    theme,
    vectorClass,
  ]);

  const onVectorClassChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVectorClass(e.target.value);
      setVectorClassTouched(true);
    },
    [],
  );

  const onDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    },
    [],
  );

  const onEmbeddingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const embedding = e.target.value.split(",").map((v) => {
          const num = Number(v);
          if (isNaN(num)) throw new Error("Invalid embedding");
          return Number(v);
        });

        if (embeddingSize && embedding.length !== embeddingSize)
          throw new Error("Invalid embedding");

        setEmbedding(embedding);
        setEmbeddingError(null);
      } catch (err) {
        console.error(err);
        setEmbeddingError("Invalid embedding");
      }
    },
    [embeddingSize],
  );

  const formInvalid = useMemo(() => {
    return (
      vectorClass === null ||
      vectorClass.length === 0 ||
      embedding.length === 0 ||
      embeddingError !== null ||
      (embeddingSize != undefined && embedding.length !== embeddingSize)
    );
  }, [embedding.length, embeddingError, embeddingSize, vectorClass]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Add a new vector</p>
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Class"
                  placeholder="Enter a class"
                  variant="bordered"
                  onChange={onVectorClassChange}
                />
                <Textarea
                  errorMessage={embeddingError}
                  label={`Embedding (${
                    embeddingSize != undefined
                      ? embeddingSize + " numbers - "
                      : ""
                  }comma separated)`}
                  placeholder="Enter an embedding"
                  variant="bordered"
                  onChange={onEmbeddingChange}
                />
                <span>Optional</span>
                <Textarea
                  label="Description"
                  placeholder="Enter a description"
                  variant="bordered"
                  value={description ? description : ""}
                  onChange={onDescriptionChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isDisabled={formInvalid}
                  color="primary"
                  onPress={onSubmit}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
