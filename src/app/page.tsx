import PageContainer from "@/components/page/pageContainer";
import WorkInProgress from "@/components/WorkInProgress";

export default function Home() {
  return (
    <PageContainer title="Dashboard">
      <WorkInProgress />
    </PageContainer>
  );
}
