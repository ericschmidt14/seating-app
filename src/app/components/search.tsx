import { Button, rem } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconArmchair, IconDesk, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useSeating } from "../context/seatingContext";
import { Seat } from "../interfaces";

export default function Search() {
  const { tables, lounge, handleSeatClick, setSelectedSeats } = useSeating();
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
    .filter((t) => (lounge === "1" ? +t.id < 200 : +t.id >= 200))
    .flatMap((t) =>
      t.seats
        .filter((seat) => searchKeyword(seat))
        .map((s, index) => {
          return {
            id: `${index}-${t.id}-${s.id}`,
            label: `${s.occupant?.firstName} ${s.occupant?.lastName}`,
            description: s.occupant?.company,
            onClick: () =>
              handleSeatClick(
                { tableId: t.id, id: s.id, occupant: s.occupant },
                true
              ),
            rightSection: (
              <div className="flex items-center gap-2">
                <div className="w-8 flex flex-col items-center">
                  <IconDesk size={16} />
                  <p className="text-white">{t.id}</p>
                </div>
                <div className="w-8 flex flex-col items-center">
                  <IconArmchair size={16} />
                  <p className="text-white">{s.id}</p>
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
