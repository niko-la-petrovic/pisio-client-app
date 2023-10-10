"use client";

import { Button, Checkbox, Divider } from "@nextui-org/react";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { APIErrorResponse } from "@/types/api/errorResponse";
import { AiOutlineCheck } from "react-icons/ai";
import CollectionSelector from "@/components/collection/CollectionSelector";
import FileUploadArea from "@/components/fileUpload/fileUploadArea";
import { GetCollectionResponse } from "@/types/api/responses";
import PageContainer from "@/components/page/pageContainer";
import RenderStep from "@/components/RenderStep";
import { relativeApiMultipartSender } from "@/services/apiFetcher";
import { toast } from "react-toastify";
import useClientTheme from "@/services/useClientTheme";
import { useRouter } from "next/navigation";

const embeddingPreviewMaxSize = 10;
const linePreviewMaxSize = 5;

type PreviewRow = {
  class: string;
  description: string;
  embeddingPreview: number[];
  embeddingSize: number;
};

export default function ImportPage() {
  const router = useRouter();
  const theme = useClientTheme();
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [collection, setCollection] = useState<GetCollectionResponse | null>(
    null,
  );
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [parsingError, setParsingError] = useState<string | null>(null);

  const uploadFinishedCallback = useCallback((file: File) => {
    setFile(file);
    setParsingError(null);
    file.arrayBuffer().then((buffer) => {
      const content = new TextDecoder().decode(buffer);
      setContent(content);
    });
  }, []);

  const { header, previewRows, lineCount } = useMemo(() => {
    const defaultReturn = {
      header: null,
      previewRows: null,
      lineCount: 0,
    };
    if (file == null && !content) return defaultReturn;

    const lines = content
      .replace(/\r/g, "")
      .split("\n")
      .filter((line) => line);
    const header = hasHeader ? lines.shift() : null;
    if (header) {
      const headerSplit = header.split(",");
      if (headerSplit.length !== 3)
        setParsingError("The header must contain 3 columns");
    }
    const previewLines = lines.slice(0, linePreviewMaxSize);
    const lineCount = lines.length;
    if (lineCount === 0) {
      setParsingError("The file is empty");
      return defaultReturn;
    }

    let classIndex: number | undefined,
      descriptionIndex: number | undefined,
      embeddingIndex: number | undefined = undefined;

    if (hasHeader) {
      header?.split(",").forEach((column, index) => {
        if (column === "class") classIndex = index;
        else if (column === "description") descriptionIndex = index;
        else if (column === "embedding") embeddingIndex = index;
      });

      if (classIndex === undefined) {
        setParsingError("The file must contain a column named 'class'");
        return defaultReturn;
      }
      if (descriptionIndex === undefined) {
        setParsingError("The file must contain a column named 'description'");
        return defaultReturn;
      }
      if (embeddingIndex === undefined) {
        setParsingError("The file must contain a column named 'embedding'");
        return defaultReturn;
      }
    } else {
      classIndex = 0;
      descriptionIndex = 1;
      embeddingIndex = 2;
    }

    const previewRows = content
      ? previewLines.map((line): PreviewRow | undefined => {
          const split = line.split(",");
          if (split.length != 3)
            setParsingError("The file must contain exactly 3 columns");

          if (
            classIndex === undefined ||
            descriptionIndex === undefined ||
            embeddingIndex === undefined
          )
            return undefined;

          const classColumn = split[classIndex];
          const descriptionColumn = split[descriptionIndex];
          const embeddingColumn = split[embeddingIndex];
          const embedding = embeddingColumn.split("|");
          const embeddingPreview = embedding
            .map((value) => Number(value))
            .slice(0, embeddingPreviewMaxSize);

          return {
            class: classColumn,
            description: descriptionColumn,
            embeddingSize: embedding.length,
            embeddingPreview: embeddingPreview,
          };
        })
      : null;

    setParsingError(null);
    return {
      header,
      previewRows,
      lineCount,
    };
  }, [content, file, hasHeader]);

  const invalidImport = useMemo(() => {
    return (
      Boolean(parsingError) || !collection || !file || previewRows?.length === 0
    );
  }, [collection, file, parsingError, previewRows?.length]);

  const onCollectionSelected = useCallback(
    (collection: GetCollectionResponse) => {
      setCollection(collection);
    },
    [],
  );

  const setHasHeaderCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHasHeader(e.target.checked);
    },
    [setHasHeader],
  );

  const onSubmit = useCallback(() => {
    if (!file || !collection?.id) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("collectionId", collection.id);
    formData.append("hasHeader", String(hasHeader));

    relativeApiMultipartSender({
      route: `api/import/vector`,
      body: formData,
      method: "POST",
    })
      .then(() => {
        router.push(`/collection/${collection.id}`);
        toast.success("Import successful", { theme });
      })
      .catch((error: APIErrorResponse) => {
        // TODO error handling
        toast.error("An error occurred during the import", {
          theme,
        });
        console.error(error);
      });
  }, [collection?.id, file, hasHeader, router, theme]);

  return (
    <PageContainer title="Import vectors">
      <div className="flex flex-col gap-4">
        <RenderStep step={1} title="Select a collection" />
        <CollectionSelector onCollectionSelected={onCollectionSelected} />
        {collection ? (
          <div className="flex items-end gap-2">
            <span className="h-full">Collection</span>
            <span className="rounded-lg bg-zinc-100 px-2 text-lg font-semibold">
              {collection.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-default-400">
              No collection selected yet.
            </span>
          </div>
        )}
        <Divider />
        <RenderStep step={2} title="Upload a file" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col justify-between">
            <FileUploadArea uploadFinished={uploadFinishedCallback} />
            <Checkbox isSelected={hasHeader} onChange={setHasHeaderCallback}>
              The file has a header
            </Checkbox>
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
                <span className="rounded-full  bg-yellow-200 p-1 px-2 text-sm text-yellow-700">
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
        {file ? (
          <div className="flex items-end gap-2">
            <span className="h-full">File</span>
            <span className="rounded-lg bg-zinc-100 px-2 text-lg font-semibold">
              {file.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-default-400">No file selected yet.</span>
          </div>
        )}
        <Divider />
        <RenderStep step={3} title="Review" />
        <span className="text-neutral-400">
          This is how we interpret the file you uploaded.
        </span>
        {parsingError && (
          <span className="font-semibold text-danger">{parsingError}</span>
        )}
        {hasHeader && header && (
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Header</span>
            <div>
              <span className="rounded-lg bg-zinc-100 p-2 px-4">{header}</span>
            </div>
          </div>
        )}
        {previewRows && (
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Vector preview</span>
            <div className="flex flex-col gap-2 rounded-lg bg-zinc-100 p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-primary">Class</span>
                <span className="">Description</span>
                <span className="text-secondary">Embedding</span>
              </div>
              <Divider />
              {previewRows.map((row, index) => (
                <div
                  key={index}
                  className="flex items-baseline gap-2 hover:bg-zinc-50"
                >
                  <span className="text-primary">{row?.class}</span>
                  <span>
                    {(row?.description?.length ?? 0) > 0 ? (
                      row?.description
                    ) : (
                      <span className="text-xs text-default-400">
                        No description
                      </span>
                    )}
                  </span>
                  <span className="text-secondary">
                    {row?.embeddingPreview.join(" ")}
                  </span>
                </div>
              ))}
            </div>
            <span className="">
              Parsed <span className="font-semibold">{lineCount}</span> vectors
            </span>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            isDisabled={invalidImport}
            className="font-semibold"
            color="primary"
            endContent={<AiOutlineCheck className="text-lg" />}
            onClick={onSubmit}
          >
            Import
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
