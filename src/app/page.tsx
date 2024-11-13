"use client";
import { SessionProvider } from "next-auth/react";
import App from "./components/app";
import { SeatingProvider } from "./context/seatingContext";

export default function Home() {
  return (
    <SessionProvider>
      <SeatingProvider>
        <App />
      </SeatingProvider>
    </SessionProvider>
  );
}
