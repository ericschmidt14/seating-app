"use client";
import { Select } from "@mantine/core";
import Image from "next/image";
import Tab from "./tabs";
import { useSeating } from "../context/seatingContext";
import lounges from "../lounges.json";
import games from "../games.json";

export default function Header() {
  const { game, setGame, lounge, setLounge } = useSeating();

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
          data={games.map((g) => {
            return { label: `Spieltag ${g.id} – ${g.opponent}`, value: g.id };
          })}
          value={game}
          onChange={setGame}
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
