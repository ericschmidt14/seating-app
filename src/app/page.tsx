"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import App from "./components/app";
import { SeatingProvider } from "./context/seatingContext";

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return (
    <SessionProvider>
      <SeatingProvider>
        <App />
      </SeatingProvider>
    </SessionProvider>
  );
}
