import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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

        console.log("response.ok", response.ok);
        if (!response.ok) return null;

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

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/error",
  },
});
