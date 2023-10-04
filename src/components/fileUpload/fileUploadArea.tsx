"use client";

import { FunctionComponent, useState } from "react";

import { AiOutlineCloudUpload } from "react-icons/ai";
import { Progress } from "@nextui-org/react";
import { motion } from "framer-motion";
import styles from "./fileUploadArea.module.css";

interface FileUploadAreaProps {
  uploadFinished: (file: File) => void;
}

const FileUploadArea: FunctionComponent<FileUploadAreaProps> = ({
  uploadFinished,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    !isDraggingOver && setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingOver && setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingOver && setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      // TODO show error
      alert("You can only upload one file at a time");
      return;
    }

    setFiles(files);

    files.forEach((f) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        setProgress((e.loaded / e.total) * 100);
      };

      reader.readAsDataURL(f);
    });
  };

  const handleClick = () => {};

  const handleAnimationEnd = () => {
    uploadFinished(files[0]);
  };

  return (
    <div className="flex w-56 flex-col gap-4" aria-label="File upload area">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`rounded-lg ${isDraggingOver ? "shadow shadow-white" : ""}`}
      >
        <div
          className={`flex h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-neutral-700 p-8 text-sm text-white  transition-all duration-75 ease-in ${
            styles.inset
          } ${isDraggingOver ? "bg-neutral-600" : ""}`}
        >
          <AiOutlineCloudUpload className="text-4xl" />
          <span className="text-center">
            Drag and drop or <span className="text-sky-300">browse</span> to
            upload a file
          </span>
        </div>
      </div>
      {
        <Progress
          onAnimationEnd={handleAnimationEnd}
          className={`${progress === 0 ? "invisible" : "visible"}`}
          value={progress}
          aria-label="File upload progress"
        />
      }
    </div>
  );
};

export default FileUploadArea;
