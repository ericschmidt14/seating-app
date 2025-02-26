import { usePathname } from "next/navigation";
import { useSeating } from "../context/seatingContext";
import { isAdminPage } from "../lib/utils";
import SeatRow from "./row";
import Seat from "./seat";

export default function TableGroup({
  id,
  name,
  capacity,
  x,
  y,
  round,
  right,
}: {
  id: number;
  name: string;
  capacity: number;
  x: number;
  y: number;
  round?: boolean;
  right?: boolean;
}) {
  const path = usePathname();
  const { lounge, selectedSeats, handleTableClick } = useSeating();
  const OffsetY = 120;
  const tableWidth = 200;
  const tableHeight = 140;

  const selected = selectedSeats.find((s) => s.tableId === id);
  const rotate = lounge === 3;

  const posX = rotate ? 1800 - tableWidth * x : tableWidth * x;
  const posY = rotate ? 360 - tableHeight * y : tableHeight * y;

  const calculateSeatPosition = (index: number, totalSeats: number) => {
    const angle = (360 / totalSeats) * index;
    const radius = 48;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const rectangularTable = (
    <div
      id={`table-${id}`}
      className={`absolute flex items-center gap-2 ${right && "justify-end"}`}
      style={{
        top: posY + OffsetY,
        left: posX,
        width: tableWidth,
      }}
    >
      {right && capacity % 2 === 1 && (
        <Seat seatNumber={capacity} tableId={id} tableName={name} />
      )}
      <div className="flex flex-col gap-2">
        <SeatRow
          capacity={capacity / 2}
          firstId={1}
          tabledId={id}
          tableName={name}
        />
        <div
          className={`w-full h-12 rounded flex justify-center items-center bg-white/30 ${
            isAdminPage(path) ? "cursor-pointer" : "cursor-default"
          }`}
          style={{
            background: selected ? "#b3193e" : "",
          }}
          onClick={() => isAdminPage(path) && handleTableClick(id, capacity)}
        >
          {name}
        </div>
        <SeatRow
          capacity={capacity / 2}
          firstId={2}
          tabledId={id}
          tableName={name}
        />
      </div>
      {!right && capacity % 2 === 1 && (
        <Seat seatNumber={capacity} tableId={id} tableName={name} />
      )}
    </div>
  );

  const circularTable = (
    <div
      id={`table-${id}`}
      className="absolute h-[120px]"
      style={{ top: tableHeight * y + OffsetY, left: tableWidth * x }}
    >
      <div
        className={`w-12 h-12 top-9 left-9 bg-white/30 rounded-full absolute transform flex items-center justify-center ${
          isAdminPage(path) ? "cursor-pointer" : "cursor-default"
        }`}
        style={{
          background: selected ? "#b3193e" : "",
        }}
        onClick={() => isAdminPage(path) && handleTableClick(id, capacity)}
      >
        {name}
      </div>

      {Array.from({ length: capacity }).map((_, index) => {
        const { x, y } = calculateSeatPosition(index, capacity);
        return (
          <div
            key={index}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className="absolute top-12 left-12 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <Seat seatNumber={index + 1} tableId={id} tableName={name} />
          </div>
        );
      })}
    </div>
  );

  return round ? circularTable : rectangularTable;
}
