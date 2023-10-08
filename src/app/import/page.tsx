"use client";

import { Button, Divider } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";

import { AiOutlineCheck } from "react-icons/ai";
import CollectionSelector from "@/components/collection/CollectionSelector";
import FileUploadArea from "@/components/fileUpload/fileUploadArea";
import PageContainer from "@/components/page/pageContainer";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");

  const uploadFinishedCallback = useCallback((file: File) => {
    setFile(file);
    file.arrayBuffer().then((buffer) => {
      const content = new TextDecoder().decode(buffer);
      setContent(content);
    });
  }, []);

  // TODO
  const invalidImport = useMemo(() => {
    return true;
  }, []);

  return (
    <PageContainer title="Import vectors">
      <div className="flex flex-col gap-4">
        <RenderStep step={1} title="Select a collection" />
        <CollectionSelector />
        <Divider />
        <RenderStep step={2} title="Upload a file" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col justify-between">
            <FileUploadArea uploadFinished={uploadFinishedCallback} />
            <div>something</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Upload a CSV file</span>
            <span className="font-light text-default-400">
              The file must contain the following columns
            </span>
            <Divider />
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Class</span>
              <span className="text-default-400">The class of the vector</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-semibold">Description</span>
                <span className="text-yellow-800\ rounded-full bg-yellow-200 p-1 text-sm">
                  Optional
                </span>
              </div>

              <span className="text-default-400">
                The description of the vector
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Embedding</span>
              <span className="text-default-400">
                The embedding in the form of a | separated list of numbers
              </span>
            </div>
          </div>
        </div>
        {file && (
          <div className="flex">
            <span>{file.name}</span>
          </div>
        )}
        <Divider />
        <RenderStep step={3} title="Review" />
        <div className="flex justify-end">
          <Button
            isDisabled={invalidImport}
            className="font-semibold"
            color="primary"
            endContent={<AiOutlineCheck className="text-lg" />}
          >
            Import
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

function RenderStep({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
        {step}
      </div>
      <span className="text-lg font-semibold">{title}</span>
    </div>
  );
}
