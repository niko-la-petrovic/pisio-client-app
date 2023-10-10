"use client";

import {
  Button,
  Divider,
  Select,
  SelectItem,
  Selection,
  Textarea,
} from "@nextui-org/react";
import {
  GetCollectionResponse,
  VectorSimilarityRequest,
  VectorSimilarityResponse,
} from "@/types/api/responses";
import { useCallback, useMemo, useState } from "react";

import { APIErrorResponse } from "@/types/api/errorResponse";
import CollectionSelector from "@/components/collection/CollectionSelector";
import PageContainer from "@/components/page/pageContainer";
import RenderStep from "@/components/RenderStep";
import { relativeApiJsonSender } from "@/services/apiFetcher";
import { toast } from "react-toastify";
import useClientTheme from "@/services/useClientTheme";
import { useRouter } from "next/navigation";

const kValues = [1, 3, 5, 7];

export default function SimilarityPage() {
  const router = useRouter();
  const theme = useClientTheme();
  const [collection, setCollection] = useState<GetCollectionResponse | null>(
    null,
  );
  const [selection, setSelection] = useState<Selection>(new Set([]));
  const [embedding, setEmbedding] = useState<number[]>([]);
  const [results, setResults] = useState<VectorSimilarityResponse | null>(null);
  const [k, setK] = useState<number>(1);

  const onCollectionSelected = useCallback(
    (collection: GetCollectionResponse) => {
      setCollection(collection);
    },
    [],
  );

  const onSelectionChange = useCallback((sel: Selection) => {
    setSelection(sel);
    const selected = Array.from(sel)[0];
    if (!selected) return;
    setK(selected as number);
  }, []);

  const onEmbeddingChange = useCallback((value: string) => {
    const embeddingText = value;
    const parsedEmbedding = embeddingText.split(",").map((s) => Number(s));
    setEmbedding(parsedEmbedding);
  }, []);

  const onSubmit = useCallback(() => {
    const collectionId = collection?.id;
    if (!collectionId) return;

    const body: VectorSimilarityRequest = {
      collectionId: collectionId,
      embedding,
      algorithm: "flat",
      distance: "l2",
      k: k,
    };

    relativeApiJsonSender<VectorSimilarityResponse>({
      route: "api/VectorSimilarity",
      body,
      method: "POST",
    })
      .then((res) => {
        if (!res) return;
        setResults(res);
        toast.success("Embedding compared successfully.", { theme });
      })
      .catch((err: APIErrorResponse) => {
        console.error(err);
        toast.error("An error occurred while comparing the embedding.", {
          theme,
        });
      });
  }, [collection?.id, embedding, k, theme]);

  const disableSubmit = useMemo(() => {
    return (!collection || embedding.length == 0) ?? true;
  }, [collection, embedding.length]);

  return (
    <>
      <PageContainer title="Similarity">
        <div className="flex flex-col gap-4">
          <RenderStep step={1} title="Select a collection" />
          <span className="text-neutral-400">
            Select a collection to compare the embedding with.
          </span>
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
          <RenderStep step={2} title="Input an embedding" />
          <span className="text-neutral-400">
            Input the embedding to compare with the collection.
          </span>
          <div className="max-w-md">
            <Textarea
              label="Embedding (comma separated numbers)"
              placeholder="Enter the embedding"
              onValueChange={onEmbeddingChange}
            />
          </div>
          <Divider />
          <RenderStep step={3} title="Compare" />
          <span className="text-neutral-400">
            Select the parameters to use for the kNN search.
          </span>
          <div className="flex items-center justify-between">
            <Select
              label="k parameter (kNN)"
              placeholder="Select a value"
              className="max-w-xs"
              items={kValues}
              selectionMode="single"
              selectedKeys={selection}
              defaultSelectedKeys={[1]}
              onSelectionChange={onSelectionChange}
              renderValue={(values) =>
                values.map((value, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-zinc-100 px-2 text-lg font-semibold"
                  >
                    {value.textValue}
                  </span>
                ))
              }
            >
              {kValues.map((item) => (
                <SelectItem key={item} value={item} textValue={String(item)}>
                  {item}
                </SelectItem>
              ))}
            </Select>
            <Button
              isDisabled={disableSubmit}
              onClick={onSubmit}
              color="primary"
            >
              Compare
            </Button>
          </div>
          <Divider />
          <RenderStep step={4} title="Results" />
          <span className="text-neutral-400">
            The results will be displayed here.
          </span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <span>Class</span>
              <span>Distance</span>
            </div>
            <Divider />
            {results?.classes?.map((cls, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-lg font-semibold">{cls}</span>
                {results?.distances && (
                  <span className="rounded-lg bg-zinc-100 px-2 text-lg font-semibold">
                    {results?.distances[index]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
