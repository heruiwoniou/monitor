'use client';

import { useMutation } from "@tanstack/react-query";
import Gradient from "~/components/styled/gradient";
import { LoginForm } from "~/components/login-form";
import { authenticate } from '~/lib/actions';

export default function Page() {
  const { data, mutate, isPending } = useMutation({
    mutationFn: authenticate,
  });
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Gradient className="opacity-[0.15] w-[1000px] h-[1000px]" conic />
      <form
        action={mutate}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <LoginForm pending={isPending} error={data?.status && data.status > 400 ? data.message : ''} />
      </form>
    </main>
  );
}
