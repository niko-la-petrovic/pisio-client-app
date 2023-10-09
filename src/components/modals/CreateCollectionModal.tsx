import {
  CreateCollectionRequest,
  CreateCollectionResponse,
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

export default function CreateCollectionModal({
  isOpen,
  onOpenChange,
  close,
  onCreate,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  close: () => void;
  onCreate: () => void;
}) {
  const theme = useClientTheme();

  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>("");
  const [embeddingSize, setEmbeddingSize] = useState<number>(0);
  const [nameTouched, setNameTouched] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    const body: CreateCollectionRequest = {
      name: name ? name : undefined,
      description: description ? description : undefined,
      embeddingSize: embeddingSize === 0 ? undefined : embeddingSize,
    };

    relativeApiJsonSender<CreateCollectionResponse>({
      body: body,
      method: "POST",
      route: "api/collection",
    })
      .then((res) => {
        console.log(theme);
        toast.success("Collection created", {
          theme,
        });
        onCreate();
        close();
      })
      .catch((err: APIErrorResponse) => {
        console.error(err);
        toast.error(
          <div className="">
            <p className="font-bold">Error creating collection</p>
            {err.title && <p>{err.title}</p>}
            {err.status && <p>Status {err.status}</p>}
          </div>,
          {
            theme,
          },
        );
      });
  }, [close, description, embeddingSize, name, onCreate, theme]);

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameTouched(true);
  }, []);

  const onDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    },
    [],
  );

  const onEmbeddingSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setEmbeddingSize(Number(e.target.value));
    },
    [],
  );

  const formInvalid = useMemo(() => {
    return name === null || name.length === 0;
  }, [name]);
  const nameError = useMemo(() => {
    if (nameTouched && (name === null || name.length === 0)) {
      return "Name is required";
    }
    return null;
  }, [name, nameTouched]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Create a new collection</p>
              </ModalHeader>
              <ModalBody>
                <Input
                  errorMessage={nameError}
                  onChange={onNameChange}
                  autoFocus
                  label="Name"
                  placeholder="Enter a name"
                  variant="bordered"
                />
                <span>Optional</span>
                <Textarea
                  label="Description"
                  placeholder="Enter a description"
                  variant="bordered"
                  value={description ? description : ""}
                  onChange={onDescriptionChange}
                />
                <Input
                  label="Embedding Size"
                  placeholder="Enter an embedding size"
                  type="number"
                  variant="bordered"
                  min={0}
                  value={embeddingSize === 0 ? "" : embeddingSize.toString()}
                  onChange={onEmbeddingSizeChange}
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
