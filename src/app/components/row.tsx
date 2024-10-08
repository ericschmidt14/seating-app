import Seat from "./seat";

export default function SeatRow({
  capacity,
  firstId,
  tabledId,
}: {
  capacity: number;
  firstId: number;
  tabledId: string;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: capacity }).map((_, index) => (
        <Seat
          key={index}
          id={(index + firstId).toString()}
          tableId={tabledId}
        />
      ))}
    </div>
  );
}
