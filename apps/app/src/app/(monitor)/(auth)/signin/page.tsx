import Gradient from "~/components/styled/gradient";
import { LoginForm } from "~/components/login-form";
import { signIn } from "~/auth";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Gradient className="opacity-[0.15] w-[1000px] h-[1000px]" conic />
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData, {
            callbackUrl: "/",
          });
        }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <LoginForm />
      </form>
    </main>
  );
}
