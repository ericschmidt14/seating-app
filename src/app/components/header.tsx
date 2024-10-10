"use client";
import { Select } from "@mantine/core";
import Image from "next/image";
import Tab from "./tabs";
import { useSeating } from "../context/seatingContext";
import lounges from "../lounges.json";

export default function Header() {
  const { lounge, setLounge } = useSeating();

  return (
    <header className="flex flex-col gap-4 bg-black/50 shadow-md shadow-black/10">
      <div className="flex justify-between items-center px-8 pt-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" width={48} height={48} alt="1. FCN Logo" />
          <p className="text-4xl">
            CLUB<b>SEATING</b>
          </p>
        </div>
        <Select
          data={[
            { label: "Spieltag 8 – Preußen Münster", value: "8" },
            { label: "Spieltag 10 – Jahn Regensburg", value: "10" },
            { label: "Spieltag 12 – 1. FC Kaiserslautern", value: "12" },
          ]}
          defaultValue="8"
          withCheckIcon={false}
          allowDeselect={false}
          variant="light"
          w={260}
        />
      </div>
      <div className="flex gap-8 px-8">
        {lounges.map((l) => (
          <Tab
            key={l.id}
            label={l.name}
            active={lounge === l.id}
            onClick={() => setLounge(l.id)}
          />
        ))}
      </div>
    </header>
  );
}
