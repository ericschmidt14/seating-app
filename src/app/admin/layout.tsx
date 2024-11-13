"use client";
import { SessionProvider } from "next-auth/react";
import { SeatingProvider } from "../context/seatingContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SeatingProvider>{children}</SeatingProvider>
    </SessionProvider>
  );
}
