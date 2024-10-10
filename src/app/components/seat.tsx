import { useSeating } from "../context/seatingContext";

export default function Seat({ id, tableId }: { id: string; tableId: string }) {
  const { tables, selectedSeats, handleSeatClick } = useSeating();

  const taken = tables.find(
    (t) => t.id === tableId && t.seats.find((s) => s.id === id)
  );

  const selected = selectedSeats.find(
    (s) => s.tableId === tableId && s.id === id
  );

  return (
    <div
      className="relative w-6 h-6 border border-white/60 rounded hover:bg-white/30 text-xs font-bold"
      style={{
        background: selected
          ? "#b3193e"
          : taken
          ? "rgba(255, 255, 255, 0.3)"
          : "",
      }}
      onClick={() =>
        handleSeatClick({
          tableId,
          id,
          occupant: taken?.seats.find((s) => s.id === id)?.occupant,
        })
      }
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
