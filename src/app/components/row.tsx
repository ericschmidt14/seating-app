import Seat from "./seat";

export default function SeatRow({
  capacity,
  firstId,
  tabledId,
}: {
  capacity: number;
  firstId: number;
  tabledId: number;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: capacity }).map((_, index) => (
        <Seat key={index} seatNumber={index * 2 + firstId} tableId={tabledId} />
      ))}
    </div>
  );
}
