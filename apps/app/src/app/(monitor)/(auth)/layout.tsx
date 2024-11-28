'use client';

import React from "react";
import Gradient from "~/components/styled/gradient";

function EntryLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <main className="flex flex-col items-center justify-between min-h-screen p-24">
    <Gradient className="opacity-[0.15] w-[1000px] h-[1000px]" conic />
    {children}
  </main>
}

export default EntryLayout;
