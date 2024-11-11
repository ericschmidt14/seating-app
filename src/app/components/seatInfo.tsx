import {
  IconArmchair,
  IconCalendarRepeat,
  IconDesk,
} from "@tabler/icons-react";

export default function SeatInfo({
  tableName,
  seatNumber,
  seasonTicket,
}: {
  tableName: string;
  seatNumber: number;
  seasonTicket?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <IconDesk size={16} className="muted" />
        <p className="text-white">{tableName}</p>
      </div>
      <div className="flex items-center gap-1">
        <IconArmchair size={16} className="muted" />
        <p className="text-white">{seatNumber}</p>
      </div>
      {seasonTicket && <IconCalendarRepeat size={16} className="muted" />}
    </div>
  );
}
