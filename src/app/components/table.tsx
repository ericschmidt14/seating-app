import { useSeating } from "../context/seatingContext";
import SeatRow from "./row";
import Seat from "./seat";

export default function TableGroup({
  id,
  capacity,
}: {
  id: string;
  capacity: number;
}) {
  const { selectedSeats } = useSeating();

  const selected = selectedSeats.find((s) => s.table === id);

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-2">
        <SeatRow capacity={capacity / 2} firstId={1} tabledId={id} />
        <div
          className={`w-full h-12 rounded flex justify-center items-center bg-white/30 ${
            selected && "bg-[#b3193e]"
          }`}
        >
          {id}
        </div>
        <SeatRow
          capacity={capacity / 2}
          firstId={Math.floor(capacity / 2 + 1)}
          tabledId={id}
        />
      </div>
      {capacity % 2 === 1 && <Seat id={capacity.toString()} tableId={id} />}
    </div>
  );
}
