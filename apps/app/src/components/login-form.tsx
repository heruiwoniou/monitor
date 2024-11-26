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
} from "@monitor/ui";
import { AlertCircle, Loader2 } from "lucide-react";

export function LoginForm({ pending, error }: { pending: boolean, error?: string }): JSX.Element {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">

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
          <Button className="w-full" type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            Login
          </Button>
          <Button className="w-full" variant="outline" disabled={pending}>
            Login with Google
          </Button>
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
  );
}
