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
      <div>
        {/* TODO add back button - check if history exists */}
        <PageTitle title={title} />
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
