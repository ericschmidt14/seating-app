"use client";
import tables from "../data.json";
import { useEffect } from "react";
import { useSeating } from "../context/seatingContext";
import Header from "../components/header";
import Grid from "../components/grid";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

export default function Home() {
  const { setTables, selectedSeats, setSelectedSeats } = useSeating();

  useEffect(() => {
    setTables(tables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] ${
        selectedSeats.length > 0 ? "bg-right" : "bg-left"
      } transition-all duration-300`}
    >
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <Grid />
      </div>
      <aside className="sticky top-0 w-[800px] h-screen overflow-y-scroll flex flex-col gap-8 p-8 bg-black/90 shadow-2xl shadow-black">
        <div className="flex flex-col gap-2">
          {selectedSeats.map((s, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-2"
            >
              <TextInput
                size="xs"
                placeholder="Vorname"
                defaultValue={s.occupant?.firstName}
              />
              <TextInput
                size="xs"
                placeholder="Nachname"
                defaultValue={s.occupant?.lastName}
              />
              <Autocomplete
                size="xs"
                placeholder="Firma"
                defaultValue={s.occupant?.company}
                data={Array.from(
                  new Set(
                    tables.flatMap((t) =>
                      t.seats.flatMap((s) => s.occupant.company)
                    )
                  )
                )}
              />
              <div className="text-nowrap">
                {s.tableId} – {s.id}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-2">
          <Button
            variant="transparent"
            color="dark"
            onClick={() => setSelectedSeats([])}
          >
            Abbrechen
          </Button>
          <Button
            variant="light"
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={() => setSelectedSeats([])}
          >
            Speichern
          </Button>
        </div>
      </aside>
    </div>
  );
}
