"use client";

import FileUploadArea from "../fileUpload/fileUploadArea";
import { FunctionComponent } from "react";

interface VectorUploadContainerProps {}

const VectorUploadContainer: FunctionComponent<
  VectorUploadContainerProps
> = () => {
  return (
    <div className="flex h-[500px] w-[500px] flex-col items-center justify-center gap-4 rounded bg-neutral-800 p-2 ">
      <span className="text-2xl font-bold text-white">Get started</span>
      <FileUploadArea uploadFinished={() => {}} />
    </div>
  );
};

export default VectorUploadContainer;
