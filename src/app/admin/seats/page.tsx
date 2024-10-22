"use client";
import { Autocomplete, Button, Paper, TextInput } from "@mantine/core";
import {
  IconArmchair,
  IconBuildingFactory2,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Grid from "../../components/grid";
import Header from "../../components/header";
import { useSeating } from "../../context/seatingContext";
import data from "../../data.json";

export default function Home() {
  const { tables, setTables, selectedSeats, setSelectedSeats } = useSeating();
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
      selectedSeats.map((s) => ({
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

    setTables(cleanedTables);
    setSelectedSeats([]);
  };

  return (
    <div
      className={`min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] ${
        selectedSeats.length > 0 ? "bg-right" : "bg-left"
      } transition-all duration-300`}
    >
      <div className="w-screen min-h-screen flex flex-col">
        <Header showNav={true} />
        <Grid />
      </div>
      <aside
        className={`sticky top-0 h-screen overflow-x-hidden overflow-y-scroll flex flex-col gap-4 bg-black/90 shadow-2xl shadow-black transition-all duration-300 ${
          selectedSeats.length > 0 && "px-8"
        } py-8`}
        style={{
          transform: `translateX(${
            selectedSeats.length === 0 ? "800px" : "0px"
          })`,
          width: selectedSeats.length === 0 ? "0px" : "800px",
        }}
      >
        {selectedSeats.length > 0 && (
          <>
            <h2 className="text-2xl">Plätze zuordnen</h2>
            <div className="flex flex-col gap-4">
              {occupantData
                .sort((a, b) => {
                  const tableA = parseInt(a.table, 10);
                  const tableB = parseInt(b.table, 10);

                  // First, compare the table numbers
                  if (tableA !== tableB) {
                    return tableA - tableB;
                  }

                  // If table numbers are the same, compare seat numbers
                  const seatA = parseInt(a.seat, 10);
                  const seatB = parseInt(b.seat, 10);

                  return seatA - seatB;
                })
                .map((s, index) => (
                  <Paper
                    key={index}
                    p="xs"
                    bg="#181818"
                    radius="md"
                    className="relative grid grid-cols-2 justify-between items-center gap-2"
                  >
                    <TextInput
                      size="xs"
                      value={`Tisch ${s.table} – Platz ${s.seat}`}
                      disabled
                      rightSection={<IconArmchair size={16} />}
                    />
                    <Autocomplete
                      size="xs"
                      placeholder="Firma"
                      value={s.company}
                      onChange={(e) =>
                        handleInputChange(s.table, s.seat, "company", e)
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
                      rightSection={<IconBuildingFactory2 size={16} />}
                    />
                    <TextInput
                      size="xs"
                      placeholder="Vorname"
                      value={s.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          s.table,
                          s.seat,
                          "firstName",
                          e.target.value
                        )
                      }
                    />
                    <TextInput
                      size="xs"
                      placeholder="Nachname"
                      value={s.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          s.table,
                          s.seat,
                          "lastName",
                          e.target.value
                        )
                      }
                    />
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
