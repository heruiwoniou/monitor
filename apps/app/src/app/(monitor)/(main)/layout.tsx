import React from "react";
import { auth, signOut } from "~/auth";

export default async function MainLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();
  return (
    <main className="min-h-screen">
      <header className="flex justify-between items-center h-20 px-10">
        <div>Logo</div>
        <div className="flex gap-2">
          {session?.user?.email}
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <button className="text-red-600" type="submit">
              SignOut
            </button>
          </form>
        </div>
      </header>
      {children}
    </main>
  );
}
