import { auth } from "~/auth";

export default async function Page() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <div className="flex flex-col items-center justify-between p-24">
      hello world
    </div>
  );
}
