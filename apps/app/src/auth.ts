import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const body = {
          email: credentials.email,
          password: credentials.password,
          type: "email",
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          return null;
        }

        const res = (await response.json()) as {
          email: string;
          username: string;
        };

        const user = {
          id: res.email,
          name: res.username,
          email: res.email,
          image: "https://avatars.githubusercontent.com/u/17067673?v=4",
        };

        const thirdPartyCookie = response.headers.getSetCookie();

        if (thirdPartyCookie.length > 0) {
          const items = thirdPartyCookie[0]
            .split(";")
            .map((str) => str.trim().split("="));

          for (const [name, value] of items) {
            (await cookies()).set(name, value);
          }
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    authorized({ auth, request }) {
      if (!auth && request.nextUrl.pathname !== "/signin") {
        return false;
      } else if (auth && request.nextUrl.pathname === "/signin") {
        const newUrl = new URL("/", request.nextUrl.origin);
        return NextResponse.redirect(newUrl);
      }

      return true;
    },
  },
});
