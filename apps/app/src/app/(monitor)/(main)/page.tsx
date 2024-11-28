import { auth } from "~/auth";
import PageContainer from "~/components/styled/page-container";

export default async function Page() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <PageContainer>
      hello, {session.user.name}
    </PageContainer>
  );
}
