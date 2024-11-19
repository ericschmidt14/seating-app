"use client";
import { useSeating } from "../context/seatingContext";

export default function Pitch() {
  const { lounge } = useSeating();

  const width = lounge === 1 ? 1600 : lounge === 2 ? 2900 : 2000;

  return (
    <div
      className="relative flex justify-center p-2 rounded bg-white/15"
      style={{ width: `${width}px` }}
    >
      Spielfeld
    </div>
  );
}
