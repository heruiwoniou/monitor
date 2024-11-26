import React from "react";
import { Toaster } from "@repo/ui/components/atoms/toaster"

function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <>
    {children}
    <Toaster />
  </>;
}

export default AppLayout;
