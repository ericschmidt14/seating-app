"use client";
import { ActionIcon, Select, Table, TextInput } from "@mantine/core";
import TableGroup from "./components/table";
import tables from "./data.json";
import { IconSearch, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSeating } from "./context/seatingContext";
import { SelectedSeat } from "./interfaces";

export default function Home() {
  const { setTables, selectedSeats, setSelectedSeats } = useSeating();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTables(tables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeatClick = (seat: SelectedSeat) => {
    setSelectedSeats((prevSelected: SelectedSeat[]) => {
      const isAlreadySelected = prevSelected.some(
        (s) => s.table === seat.table && s.seat === seat.seat
      );
      if (isAlreadySelected) {
        return prevSelected.filter(
          (s) => s.table !== seat.table || s.seat !== seat.seat
        );
      } else {
        return [...prevSelected, seat];
      }
    });
  };

  const keywords = search.trim().split(/\s+/);

  return (
    <div
      className={`min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] ${
        selectedSeats.length > 0 ? "bg-right" : "bg-left"
      } transition-all duration-300`}
    >
      <div className="w-full h-screen flex flex-col">
        <header className="flex justify-between items-center p-8 bg-black/50 shadow-md shadow-black/10">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" width={48} height={48} alt="1. FCN Logo" />
            <p className="text-4xl">
              CLUB<b>SEATING</b>
            </p>
          </div>
          <Select
            data={[
              { label: "Spieltag 8 – Preußen Münster", value: "8" },
              { label: "Spieltag 10 – Jahn Regensburg", value: "10" },
              { label: "Spieltag 12 – 1. FC Kaiserslautern", value: "12" },
            ]}
            defaultValue="8"
            withCheckIcon={false}
            allowDeselect={false}
            variant="light"
            w={260}
          />
        </header>
        <main className="grid grid-cols-4 gap-8 p-8">
          {tables.map((t, index) => (
            <TableGroup key={index} id={t.id} capacity={t.capacity} />
          ))}
        </main>
      </div>
      <aside className="w-[660px] flex flex-col gap-8 p-8 bg-black/90 shadow-2xl shadow-black">
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            search.length > 0 ? (
              <ActionIcon
                onClick={() => setSearch("")}
                className="cursor-pointer"
                variant="default"
              >
                <IconX size={16} />
              </ActionIcon>
            ) : null
          }
          placeholder="Person oder Firma suchen ..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <div className="flex flex-col gap-8">
          {tables.map((t, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h3 className="text-xl px-[10px]">Tisch {t.id}</h3>
              <Table highlightOnHover>
                <Table.Tbody>
                  {t.seats
                    .filter((seat) =>
                      keywords.every((keyword) =>
                        [
                          seat.occupant?.firstName,
                          seat.occupant?.lastName,
                          seat.occupant?.company,
                        ].some((s) =>
                          s.toLowerCase().includes(keyword.toLowerCase())
                        )
                      )
                    )
                    .map((s, index) => (
                      <Table.Tr
                        key={index}
                        className="cursor-pointer"
                        bg={
                          selectedSeats.find(
                            (selected) =>
                              selected.seat === s.id && selected.table === t.id
                          )
                            ? "#b3193e"
                            : undefined
                        }
                        onClick={() =>
                          handleSeatClick({ table: t.id, seat: s.id })
                        }
                      >
                        <Table.Td>
                          <b className="text-lg tracking-tighter">
                            {s.occupant.firstName} {s.occupant.lastName}
                          </b>
                        </Table.Td>
                        <Table.Td>{s.occupant.company}</Table.Td>
                        <Table.Td>{s.id}</Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
