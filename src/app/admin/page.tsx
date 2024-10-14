"use client";
import data from "../data.json";
import { useEffect, useState } from "react";
import { useSeating } from "../context/seatingContext";
import Header from "../components/header";
import Grid from "../components/grid";
import {
  ActionIcon,
  Autocomplete,
  Button,
  Paper,
  TextInput,
} from "@mantine/core";
import { IconChevronDown, IconDeviceFloppy, IconX } from "@tabler/icons-react";

export default function Home() {
  const {
    tables,
    setTables,
    selectedSeats,
    setSelectedSeats,
    handleSeatClick,
  } = useSeating();
  const [occupantData, setOccupantData] = useState<
    {
      table: string;
      seat: string;
      firstName: string;
      lastName: string;
      company: string;
    }[]
  >([]);

  useEffect(() => {
    setTables(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOccupantData(
      selectedSeats
        .filter((s) => s.occupant !== null)
        .map((s) => ({
          table: s.tableId!,
          seat: s.id,
          firstName: s.occupant?.firstName || "",
          lastName: s.occupant?.lastName || "",
          company: s.occupant?.company || "",
        }))
    );
  }, [selectedSeats]);

  const handleInputChange = (
    tabledId: string,
    seatId: string,
    field: string,
    value: string
  ) => {
    setOccupantData((prev) =>
      prev.map((seat) =>
        seat.table === tabledId && seat.seat === seatId
          ? { ...seat, [field]: value }
          : seat
      )
    );
  };

  const handleSubmit = () => {
    const updatedTables = [...tables];

    occupantData.forEach(({ table, seat, firstName, lastName, company }) => {
      const isOccupantEmpty =
        !firstName.trim() && !lastName.trim() && !company.trim();

      let newTable = updatedTables.find((t) => t.id === table);
      if (!newTable) {
        if (isOccupantEmpty) {
          return;
        }

        newTable = {
          id: table,
          seats: [],
        };
        updatedTables.push(newTable);
      }

      let newSeat = newTable.seats.find((s) => s.id === seat);
      if (isOccupantEmpty) {
        if (newSeat) {
          newTable.seats = newTable.seats.filter((s) => s.id !== seat);
        }
      } else {
        if (!newSeat) {
          newSeat = {
            id: seat,
            occupant: null,
          };
          newTable.seats.push(newSeat);
        }
        newSeat.occupant = {
          firstName,
          lastName,
          company,
        };
      }
    });
    const cleanedTables = updatedTables.filter(
      (table) => table.seats.length > 0
    );

    console.log(cleanedTables);

    setTables(cleanedTables);
    setSelectedSeats([]);
  };

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
      <aside
        className="sticky top-0 w-[660px] h-screen overflow-x-hidden overflow-y-scroll flex flex-col gap-4 p-8 bg-black/90 shadow-2xl shadow-black transition-all duration-300"
        style={{ maxWidth: selectedSeats.length === 0 ? "0px" : "800px" }}
      >
        {selectedSeats.length > 0 && (
          <>
            <h2 className="text-2xl">Plätze zuordnen</h2>
            <div className="flex flex-col gap-2">
              {selectedSeats.map((s, index) => (
                <Paper
                  key={index}
                  p="md"
                  bg="#161616"
                  withBorder
                  className="relative grid grid-cols-2 justify-between items-center gap-2"
                >
                  <TextInput
                    label="Vorname"
                    size="xs"
                    placeholder="Vorname"
                    defaultValue={s.occupant?.firstName}
                    onChange={(e) =>
                      handleInputChange(
                        s.tableId!,
                        s.id,
                        "firstName",
                        e.target.value
                      )
                    }
                  />
                  <TextInput
                    label="Nachname"
                    size="xs"
                    placeholder="Nachname"
                    defaultValue={s.occupant?.lastName}
                    onChange={(e) =>
                      handleInputChange(
                        s.tableId!,
                        s.id,
                        "lastName",
                        e.target.value
                      )
                    }
                  />
                  <Autocomplete
                    label="Firma"
                    size="xs"
                    placeholder="Firma"
                    defaultValue={s.occupant?.company}
                    onChange={(e) =>
                      handleInputChange(s.tableId!, s.id, "company", e)
                    }
                    data={Array.from(
                      new Set(
                        tables.flatMap((t) =>
                          t.seats.flatMap((s) => s.occupant!.company)
                        )
                      )
                    ).sort((a, b) =>
                      a.localeCompare(b, undefined, { sensitivity: "base" })
                    )}
                    rightSection={<IconChevronDown size={16} />}
                  />
                  <TextInput
                    label="Tisch – Platz"
                    size="xs"
                    defaultValue={`${s.tableId} – ${s.id}`}
                    disabled
                  />
                  <ActionIcon
                    className="absolute top-2 right-4"
                    size="xs"
                    variant="light"
                    color="white"
                    onClick={() =>
                      handleSeatClick({ tableId: s.tableId, id: s.id }, true)
                    }
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Paper>
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
                onClick={() => handleSubmit()}
              >
                Speichern
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
