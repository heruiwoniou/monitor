'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@monitor/ui";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useImmer } from 'use-immer';
import { authenticate, type IAuthenticateConfig } from '~/lib/actions';

const defaultLoading = { github: false, credentials: false };
export default function Page() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useImmer(defaultLoading)
  const { data, mutate } = useMutation<{ status: number, message: string } | undefined, unknown, IAuthenticateConfig>({
    mutationFn: (variables) => {
      setLoading(s => void (s[variables.provider] = true));
      return authenticate(variables)
    },
    onSettled() { setLoading(defaultLoading) }
  });
  const isPending = useMemo(() => loading.credentials || loading.github, [loading]);
  const error = useMemo(() => data?.status && data.status > 400 ? data.message : '', [data?.message, data?.status])
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form
              action={(formData) => {
                mutate({ provider: 'credentials', options: formData })
              }}
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <span className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </span>
                </div>
                <Input id="password" name="password" required type="password" />
              </div>
              <Button className="w-full" type="submit" disabled={isPending}>
                {loading.credentials && <Loader2 className="animate-spin" />}
                Login
              </Button>
            </form>
            <Separator />
            <form action={() => {
              mutate({
                provider: 'github',
                options: { redirectTo: searchParams.get("callbackUrl") ?? "", }
              })
            }}>
              <Button type="submit" className="w-full" variant="outline" disabled={isPending} >
                {loading.github && <Loader2 className="animate-spin" />}Login with Github
              </Button>
            </form>
            {
              error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )
            }
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <span className="underline">
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
