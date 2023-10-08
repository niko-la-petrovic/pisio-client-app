"use client";

import { FunctionComponent, useCallback, useState } from "react";

import { AiOutlineCloudUpload } from "react-icons/ai";
import { Progress } from "@nextui-org/react";
import styles from "./fileUploadArea.module.css";
import { toast } from "react-toastify";
import useClientTheme from "@/services/useClientTheme";

interface FileUploadAreaProps {
  uploadFinished: (file: File) => void;
}

const FileUploadArea: FunctionComponent<FileUploadAreaProps> = ({
  uploadFinished,
}) => {
  const theme = useClientTheme();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    !isDraggingOver && setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingOver && setIsDraggingOver(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDraggingOver && setIsDraggingOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 1) {
        toast.error("You can only upload one file at a time", {
          theme,
        });
        return;
      }

      setFiles(files);

      files.forEach((f) => {
        const reader = new FileReader();

        reader.onloadstart = () => {
          setShowProgress(true);
        };

        reader.onprogress = (e) => {
          setProgress((e.loaded / e.total) * 100);
        };

        reader.onloadend = () => {
          setProgress(100);
          setTimeout(() => {
            setShowProgress(false);
            setProgress(0);
            uploadFinished(f);
          }, 1000);
        };

        reader.readAsDataURL(f);
      });
    },
    [isDraggingOver, theme, uploadFinished],
  );

  // TODO file upload on click
  const handleClick = () => {};

  return (
    <div className="flex w-56 flex-col gap-4" aria-label="File upload area">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`rounded-lg ${
          isDraggingOver ? "shadow shadow-primary dark:shadow-white" : ""
        }`}
      >
        <div
          className={`flex h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-zinc-100 p-8 text-sm transition-all duration-75 ease-in dark:bg-neutral-700 dark:text-white ${
            styles.inset
          } ${isDraggingOver ? "bg-neutral-600" : ""}`}
        >
          <AiOutlineCloudUpload className="text-4xl" />
          <span className="text-center">
            Drag and drop or{" "}
            <span className="text-sky-600 dark:text-sky-300">browse</span> to
            upload a file
          </span>
        </div>
      </div>
      <Progress
        className={`${showProgress ? "visible" : "invisible"}`}
        value={progress}
        color={progress === 100 ? "success" : "primary"}
        aria-label="File upload progress"
      />
    </div>
  );
};

export default FileUploadArea;
