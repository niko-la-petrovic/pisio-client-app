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
      <PageTitle title={title} />
      {children}
    </>
  );
}
