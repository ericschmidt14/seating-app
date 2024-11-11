import Seat from "./seat";

export default function SeatRow({
  capacity,
  firstId,
  tabledId,
  tableName,
}: {
  capacity: number;
  firstId: number;
  tabledId: number;
  tableName: string;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: capacity }).map((_, index) => (
        <Seat
          key={index}
          seatNumber={index * 2 + firstId}
          tableId={tabledId}
          tableName={tableName}
        />
      ))}
    </div>
  );
}
