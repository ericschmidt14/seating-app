"use client";
import { useEffect } from "react";
import Grid from "./components/grid";
import Header from "./components/header";
import { useSeating } from "./context/seatingContext";
import data from "./data.json";

export default function Home() {
  const { setTables, selectedSeats } = useSeating();

  useEffect(() => {
    setTables(data.lounges.flatMap((l) => l.tables));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] ${
        selectedSeats.length > 0 ? "bg-right" : "bg-left"
      } transition-all duration-300`}
    >
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <Grid />
      </div>
    </div>
  );
}
