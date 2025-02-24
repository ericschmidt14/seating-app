"use client";
import { useSeating } from "../context/seatingContext";

export default function Pitch() {
  const { lounge } = useSeating();

  const width: Record<number, number> = {
    1: 1600,
    2: 2900,
    3: 2000,
  };

  const posY: Record<number, number> = {
    1: 0,
    2: 0,
    3: 660,
  };

  return (
    <div
      className="absolute flex justify-center p-4 rounded bg-black/15"
      style={{ width: `${width[lounge]}px`, top: `${posY[lounge]}px` }}
    >
      Spielfeld
    </div>
  );
}
