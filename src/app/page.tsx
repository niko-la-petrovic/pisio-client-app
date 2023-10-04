import VectorUploadContainer from "@/components/vectorUpload/vectorUploadContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center xl:p-24">
      <div className="flex w-full items-center justify-center">
        <VectorUploadContainer />
      </div>
    </main>
  );
}
