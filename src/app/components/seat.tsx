"use client";
import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSeating } from "../context/seatingContext";
import SeatInfo from "./seatInfo";

export default function Seat({ id, tableId }: { id: string; tableId: string }) {
  const { tables, selectedSeats, handleSeatClick } = useSeating();
  const [opened, { close, open }] = useDisclosure(false);

  const taken = tables.find(
    (t) =>
      t.id === tableId &&
      t.seats.find((s) => s.id === id) &&
      t.seats.find((s) => s.id === id)?.occupant !== null
  );

  const occupant = taken?.seats.find((s) => s.id === id)?.occupant;

  const seasonTicket = taken?.seats.find(
    (s) => s.id === id && s.occupant?.seasonTicket
  );

  const selected = selectedSeats.find(
    (s) => s.tableId === tableId && s.id === id
  );

  const getBackground = () => {
    if (selected) {
      return "#b3193e";
    }
    if (seasonTicket) {
      return "var(--mantine-color-yellow-filled)";
    }
    if (taken) {
      return "rgba(255, 255, 255, 0.3)";
    }
    return "";
  };

  const seat = (
    <div
      className="relative w-6 h-6 border border-white/60 rounded hover:bg-white/30 text-xs font-bold"
      style={{
        background: getBackground(),
      }}
      onClick={() =>
        handleSeatClick({
          tableId,
          id,
          occupant,
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

  return taken ? (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="xl"
      radius="md"
      opened={opened}
    >
      <Popover.Target>
        <span onMouseEnter={open} onMouseLeave={close}>
          {seat}
        </span>
      </Popover.Target>
      <Popover.Dropdown
        style={{ pointerEvents: "none" }}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-col">
          <p className="font-bold">
            {occupant && `${occupant.firstName} ${occupant.lastName}`}
          </p>
          <p className="text-sm muted">{occupant && `${occupant.company}`}</p>
        </div>
        <SeatInfo
          tableId={tableId}
          id={id}
          seasonTicket={seasonTicket?.occupant?.seasonTicket}
        />
      </Popover.Dropdown>
    </Popover>
  ) : (
    seat
  );
}
