"use client";
import data from "../data.json";
import { useEffect, useState } from "react";
import { useSeating } from "../context/seatingContext";
import Header from "../components/header";
import Grid from "../components/grid";
import { Button, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

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
    const updatedTables = tables.map((table) => {
      if (selectedSeats.some((seat) => seat.tableId === table.id)) {
        const updatedSeats = Array.from({ length: table.capacity }).map(
          (_, index) => {
            const seatNumber = (index + 1).toString();
            const existingSeat = table.seats?.find((s) => s.id === seatNumber);
            const occupantInfo = occupantData.find(
              (s) => s.seat === seatNumber && s.table === table.id
            );

            if (
              occupantInfo?.firstName === "" &&
              occupantInfo?.lastName === "" &&
              occupantInfo?.company === ""
            ) {
              return { id: seatNumber, occupant: null };
            }

            if (occupantInfo) {
              return {
                id: seatNumber,
                occupant: {
                  firstName: occupantInfo.firstName,
                  lastName: occupantInfo.lastName,
                  company: occupantInfo.company,
                },
              };
            }

            return existingSeat || { id: seatNumber, occupant: null };
          }
        );

        return { ...table, seats: updatedSeats };
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedSeats([]); // Reset selected seats after submitting
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
              <TextInput
                size="xs"
                placeholder="Firma"
                defaultValue={s.occupant?.company}
                onChange={(e) =>
                  handleInputChange(s.tableId!, s.id, "company", e.target.value)
                }
                // data={Array.from(
                //   new Set(
                //     tables.flatMap((t) =>
                //       t.seats.flatMap((s) => s.occupant!.company)
                //     )
                //   )
                // )}
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
            onClick={() => handleSubmit()}
          >
            Speichern
          </Button>
        </div>
      </aside>
    </div>
  );
}
