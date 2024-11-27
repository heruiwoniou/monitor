import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      profile: Record<string, unknown>;
      image?: string;
      name?: string;
      email?: string;
    } & Omit<DefaultSession["user"], "name" | "image" | "email">;
  }
}
