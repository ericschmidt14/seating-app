import {
  IconArmchair,
  IconCalendarRepeat,
  IconDesk,
} from "@tabler/icons-react";

export default function SeatInfo({
  tableId,
  id,
  seasonTicket,
}: {
  tableId: string;
  id: string;
  seasonTicket?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <IconDesk size={16} className="muted" />
        <p className="text-white">{tableId}</p>
      </div>
      <div className="flex items-center gap-1">
        <IconArmchair size={16} className="muted" />
        <p className="text-white">{id}</p>
      </div>
      {seasonTicket && <IconCalendarRepeat size={16} className="muted" />}
    </div>
  );
}
