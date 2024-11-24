import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "presets" | "content"> = {
  content: ["./src/**/*.{ts,tsx}", "./test/**/*.{ts,tsx}", "./scr/components/atoms/**/*.{ts,tsx}"],
  presets: [sharedConfig]
};

export default config;
