"use client";
import Login from "@/app/components/login";
import Sidebar from "@/app/components/sidebar";
import { useSession } from "next-auth/react";
import Grid from "../../components/grid";
import Header from "../../components/header";
import { useSeating } from "../../context/seatingContext";

export default function Home() {
  const { data: session, status } = useSession();
  const { selectedSeats } = useSeating();

  if (status === "loading") {
    return <></>;
  }

  if (!session) {
    return <Login azure />;
  }

  return (
    <div
      className={`min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] ${
        selectedSeats.length > 0 ? "bg-right" : "bg-left"
      } transition-all duration-300`}
    >
      <div className="w-screen min-h-screen flex flex-col">
        <Header showNav={true} />
        <Grid />
      </div>
      <Sidebar />
    </div>
  );
}
