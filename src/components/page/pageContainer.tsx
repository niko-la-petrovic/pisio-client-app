import PageTitle from "./pageTitle";

export default function PageContainer({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      {/* TODO add back button - check if history exists */}
      <PageTitle title={title} />
      <div className="h-full w-full p-4">{children}</div>
    </>
  );
}
