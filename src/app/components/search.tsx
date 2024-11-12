import { Button, rem } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import {
  IconArmchair,
  IconCalendarRepeat,
  IconDesk,
  IconSearch,
} from "@tabler/icons-react";
import { useState } from "react";
import { useSeating } from "../context/seatingContext";
import { Seat } from "../interfaces";

export default function Search() {
  const { tables, setLounge, handleSeatClick, setSelectedSeats } = useSeating();
  const [query, setQuery] = useState("");

  const keywords = query.trim().split(/\s+/);
  const searchKeyword = (seat: Seat) =>
    keywords.every((keyword) =>
      [
        seat.occupant?.firstName,
        seat.occupant?.lastName,
        seat.occupant?.company,
      ].some((s) => s!.toLowerCase().includes(keyword.toLowerCase()))
    );

  const data: SpotlightActionData[] = tables
    .filter((t) => t.seats !== null)
    .flatMap((t) =>
      t
        .seats!.filter((seat) => searchKeyword(seat))
        .map((s, index) => {
          return {
            id: `${index}-${t.id}-${s.seatNumber}`,
            label: `${s.occupant?.firstName} ${s.occupant?.lastName}`,
            description: s.occupant?.company,
            onClick: () => {
              setLounge(t.loungeId);
              setTimeout(() => {
                handleSeatClick(
                  {
                    tableId: t.id,
                    seatNumber: s.seatNumber,
                    occupant: s.occupant,
                  },
                  true
                );
              }, 300);
            },
            rightSection: (
              <div className="flex items-start gap-2">
                <div className="w-8 flex flex-col items-center">
                  <IconDesk size={16} className="muted" />
                  <p className="text-white">
                    {tables.find((table) => t.id === table.id)?.name || ""}
                  </p>
                </div>
                <div className="w-8 flex flex-col items-center">
                  <IconArmchair size={16} className="muted" />
                  <p className="text-white">{s.seatNumber}</p>
                </div>
                <div className="w-8 flex flex-col items-center">
                  {s.occupant?.seasonTicket && (
                    <IconCalendarRepeat size={16} className="muted" />
                  )}
                </div>
              </div>
            ),
          };
        })
    );

  return (
    <>
      <Button
        onClick={() => {
          setSelectedSeats([]);
          spotlight.open();
        }}
        leftSection={<IconSearch size={16} />}
      >
        Suchen
      </Button>
      <Spotlight
        actions={data}
        query={query}
        onQueryChange={setQuery}
        nothingFound="Keine Treffer."
        filter={(_, actions) => actions}
        scrollable
        radius="md"
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Person oder Firma suchen ...",
        }}
      />
    </>
  );
}
