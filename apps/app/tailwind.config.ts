import type { Config } from "tailwindcss";
import sharedConfig from "@monitor/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx", "../../packages/ui/**/*.{ts,tsx}"],
  presets: [sharedConfig],
};

export default config;
