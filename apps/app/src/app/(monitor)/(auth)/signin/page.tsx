'use client';

import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "~/components/login-form";
import { authenticate } from '~/lib/actions';

export default function Page() {
  const { data, mutate, isPending } = useMutation({
    mutationFn: authenticate,
  });
  return (
    <form
      action={mutate}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <LoginForm pending={isPending} error={data?.status && data.status > 400 ? data.message : ''} />
    </form>
  );
}
