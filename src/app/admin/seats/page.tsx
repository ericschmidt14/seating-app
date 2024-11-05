"use client";
import {
  ActionIcon,
  Autocomplete,
  Button,
  Paper,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconBuildingFactory2,
  IconDeselect,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect } from "react";
import Grid from "../../components/grid";
import Header from "../../components/header";
import SeatInfo from "../../components/seatInfo";
import { useSeating } from "../../context/seatingContext";
import data from "../../data.json";

export default function Home() {
  const {
    tables,
    setTables,
    selectedSeats,
    setSelectedSeats,
    handleSeatClick,
  } = useSeating();

  useEffect(() => {
    setTables(data.lounges.flatMap((l) => l.tables));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    tabledId: number,
    seatId: number,
    field: "firstName" | "lastName" | "company",
    value: string
  ) => {
    setSelectedSeats((prev) =>
      prev.map((seat) => {
        if (seat.tableId === tabledId && seat.id === seatId) {
          const occupant = seat.occupant
            ? seat.occupant
            : { firstName: "", lastName: "", company: "" };
          occupant[field] = value;
          return { ...seat, occupant };
        } else {
          return seat;
        }
      })
    );
  };

  const handleSubmit = () => {
    const updatedTables = [...tables];

    selectedSeats.forEach(({ tableId, id, occupant }) => {
      const isOccupantEmpty =
        !occupant!.firstName.trim() &&
        !occupant!.lastName.trim() &&
        !occupant!.company.trim();

      let newTable = updatedTables.find((t) => t.id === tableId);
      if (!newTable) {
        if (isOccupantEmpty) {
          return;
        }

        newTable = {
          id: tableId!,
          seats: [],
        };
        updatedTables.push(newTable);
      }

      let newSeat = newTable.seats.find((s) => s.id === id);
      if (isOccupantEmpty) {
        if (newSeat) {
          newTable.seats = newTable.seats.filter((s) => s.id !== id);
        }
      } else {
        if (!newSeat) {
          newSeat = {
            id: id,
            occupant: null,
          };
          newTable.seats.push(newSeat);
        }
        newSeat.occupant = occupant;
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
        className={`fixed top-0 right-0 z-50 h-screen overflow-y-scroll flex flex-col gap-4 backdrop-blur-md bg-black/60 shadow-2xl shadow-black transition-all duration-300 ${
          selectedSeats.length > 0 && "px-8"
        } py-8`}
        style={{
          transform: `translateX(${
            selectedSeats.length === 0 ? "400px" : "0px"
          })`,
          width: selectedSeats.length === 0 ? "0px" : "400px",
        }}
      >
        {selectedSeats.length > 0 && (
          <>
            <h2 className="text-2xl">Plätze zuordnen</h2>
            <div className="flex flex-col gap-2">
              {selectedSeats
                .sort((a, b) => {
                  if (a.tableId! !== b.tableId!) {
                    return a.tableId! - b.tableId!;
                  }

                  return a.id - b.id;
                })
                .map((s, index) => (
                  <Paper
                    key={index}
                    p="xs"
                    bg="#181818"
                    radius="md"
                    className="relative grid grid-cols-2 justify-between items-center gap-2"
                  >
                    <div className="col-span-2 flex justify-between">
                      <SeatInfo tableId={s.tableId!} id={s.id} />
                      <ActionIcon.Group>
                        {(s.occupant?.company !== "" ||
                          s.occupant?.firstName !== "" ||
                          s.occupant?.lastName !== "") && (
                          <Tooltip
                            label="Zuordnung löschen"
                            color="dark"
                            position="left"
                            withArrow
                          >
                            <ActionIcon
                              aria-label="Löschen"
                              variant="light"
                              onClick={() =>
                                ["company", "firstName", "lastName"].forEach(
                                  (value) =>
                                    handleInputChange(
                                      s.tableId!,
                                      s.id,
                                      value as
                                        | "firstName"
                                        | "lastName"
                                        | "company",
                                      ""
                                    )
                                )
                              }
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        <Tooltip
                          label="Sitz abwählen"
                          color="dark"
                          position="left"
                          withArrow
                        >
                          <ActionIcon
                            aria-label="Abwählen"
                            variant="default"
                            onClick={() =>
                              handleSeatClick({
                                id: s.id,
                                tableId: s.tableId,
                              })
                            }
                          >
                            <IconDeselect size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </ActionIcon.Group>
                    </div>
                    <Autocomplete
                      className="col-span-2"
                      size="xs"
                      placeholder="Firma"
                      value={s.occupant?.company || ""}
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
                      rightSection={<IconBuildingFactory2 size={16} />}
                    />
                    <TextInput
                      size="xs"
                      placeholder="Vorname"
                      value={s.occupant?.firstName || ""}
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
                      value={s.occupant?.lastName || ""}
                      onChange={(e) =>
                        handleInputChange(
                          s.tableId!,
                          s.id,
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
