"use client";
import tables from "./data.json";
import { useEffect } from "react";
import { useSeating } from "./context/seatingContext";
import Header from "./components/header";
import Grid from "./components/grid";
import List from "./components/list";

export default function Home() {
  const { setTables, selectedSeats } = useSeating();

  useEffect(() => {
    setTables(tables);
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
      <aside className="sticky top-0 w-[660px] h-screen overflow-y-scroll flex flex-col gap-8 p-8 bg-black/90 shadow-2xl shadow-black">
        <List />
      </aside>
    </div>
  );
}
