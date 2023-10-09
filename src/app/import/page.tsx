"use client";

import { Button, Divider } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";

import { AiOutlineCheck } from "react-icons/ai";
import CollectionSelector from "@/components/collection/CollectionSelector";
import FileUploadArea from "@/components/fileUpload/fileUploadArea";
import { GetCollectionResponse } from "@/types/api/responses";
import PageContainer from "@/components/page/pageContainer";
import { head } from "lodash";

type PreviewRow = {
  class: string;
  description: string;
  embeddingPreview: number[];
  embeddingSize: number;
};

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [collection, setCollection] = useState<GetCollectionResponse | null>(
    null,
  );
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [parsingError, setParsingError] = useState<string | null>(null);

  const uploadFinishedCallback = useCallback((file: File) => {
    setFile(file);
    file.arrayBuffer().then((buffer) => {
      const content = new TextDecoder().decode(buffer);
      setContent(content);
    });
  }, []);

  const { header, previewRows } = useMemo(() => {
    const lines = content.split("\n").filter((line) => line);
    const lineCount = lines.length;
    const previewLinesCount = Math.min(lineCount, 5);
    const previewLines = lines.slice(0, previewLinesCount);
    const previewRows = previewLines.map((line): PreviewRow => {
      const split = line.split(",").filter((item) => item);
      const embedding = split[2].split("|");
      const embeddingSize = embedding.length;
      const previewSize = Math.min(embeddingSize, 3);
      const embeddingPreview = embedding.slice(0, previewSize).map(Number);
      return {
        class: split[0],
        description: split[1],
        embeddingSize,
        embeddingPreview,
      };
    });

    const header = hasHeader ? lines.shift() : undefined;
    if (header) {
      const headerSplit = header.split(",");
      if (headerSplit.length !== 3)
        setParsingError("The header must contain 3 columns");
    }

    return {
      header,
      previewRows,
    };
  }, [content, hasHeader]);

  // TODO
  const invalidImport = useMemo(() => {
    return true;
  }, []);

  const onCollectionSelected = useCallback(
    (collection: GetCollectionResponse) => {
      setCollection(collection);
    },
    [],
  );

  return (
    <PageContainer title="Import vectors">
      <div className="flex flex-col gap-4">
        <RenderStep step={1} title="Select a collection" />
        <CollectionSelector onCollectionSelected={onCollectionSelected} />
        {collection && (
          <div className="">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Collection</span>
              <span>{collection.name}</span>
            </div>
          </div>
        )}
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
                <span className="text-yellow-800\ rounded-full bg-yellow-200 p-1 text-sm text-yellow-700">
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
        {hasHeader && <div className="">{header}</div>}
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
