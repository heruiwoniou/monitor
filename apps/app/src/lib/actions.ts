"use server";

import { AuthError } from "next-auth";
import { signIn } from "~/auth";

export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", formData);
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
