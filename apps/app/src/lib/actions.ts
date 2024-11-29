"use server";

import { AuthError } from "next-auth";
import { signIn } from "~/auth";

export interface IAuthenticateConfig {
  provider: "github" | "credentials";
  options?:
    | FormData
    | {
        redirectTo?: string;
        redirect?: true | undefined;
      };
}

export async function authenticate(config: IAuthenticateConfig) {
  try {
    await signIn(config.provider, config.options);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: 401,
            message: "Invalid email or password",
          };
        default:
          return {
            status: 400,
            message:
              process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong.",
          };
      }
    }
    throw error;
  }
}
