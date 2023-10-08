"use client";

import FileUploadArea from "@/components/fileUpload/fileUploadArea";
import PageContainer from "@/components/page/pageContainer";
import { useCallback } from "react";

export default function ImportPage() {
  const uploadFinishedCallback = useCallback((file: File) => {
    console.log(file);
  }, []);
  return (
    <PageContainer title="Import vectors">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <FileUploadArea uploadFinished={uploadFinishedCallback} />
        </div>
      </div>
    </PageContainer>
  );
}
