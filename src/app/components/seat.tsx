import { useSeating } from "../context/seatingContext";

export default function Seat({ id, tableId }: { id: string; tableId: string }) {
  const { tables, selectedSeats } = useSeating();

  const taken = tables.find(
    (t) => t.id === tableId && t.seats.find((s) => s.id === id)
  );

  const selected = selectedSeats.find(
    (s) => s.table === tableId && s.seat === id
  );

  return (
    <div
      className={`relative w-6 h-6 border border-white/60 rounded hover:bg-white/30 text-xs font-bold ${
        taken && "bg-white/30"
      } ${selected && "bg-[#b3193e]"}`}
    >
      <span
        className={`absolute inset-0 flex justify-center items-center cursor-pointer ${
          !selected && "opacity-0 hover:opacity-100"
        } transition-opacity`}
      >
        {id}
      </span>
    </div>
  );
}
