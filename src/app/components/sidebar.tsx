"use client";
import { ActionIcon, Button, Paper, TextInput, Tooltip } from "@mantine/core";
import {
  IconBuildingFactory2,
  IconDeselect,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import { useSeating } from "./../context/seatingContext";
import SeatInfo from "./seatInfo";

export default function Sidebar() {
  const { game, tables, selectedSeats, setSelectedSeats, handleSeatClick } =
    useSeating();

  const handleInputChange = (
    tabledId: number,
    seatId: number,
    field: "firstName" | "lastName" | "company",
    value: string
  ) => {
    setSelectedSeats((prev) =>
      prev.map((seat) => {
        if (seat.tableId === tabledId && seat.seatNumber === seatId) {
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
    const seatsToSubmit = selectedSeats.map((s) =>
      s.occupant!.firstName.trim() ||
      s.occupant!.lastName.trim() ||
      s.occupant!.company.trim()
        ? s
        : { ...s, occupant: null }
    );

    console.log(
      JSON.stringify(
        { year: game.year, day: game.day, seats: seatsToSubmit },
        null,
        2
      )
    );

    // fetch(`/api/game`, {
    //   method: "POST",
    //   headers: {
    //     Accept: "*/*",
    //     "Content-Type": "application/json; charset=UTF-8",
    //   },
    //   body: JSON.stringify(
    //     { year: game.year, day: game.day, seats: seatsToSubmit },
    //     null,
    //     2
    //   ),
    // })
    //   .then((res) => res.text())
    //   .then(() => {
    //     setSelectedSeats([]);
    //   })
    //   .catch((error) => console.error(error));
  };

  return (
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

                return a.seatNumber - b.seatNumber;
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
                    <SeatInfo
                      tableName={
                        tables.find((t) => t.id === s.tableId)?.name || ""
                      }
                      seatNumber={s.seatNumber}
                    />
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
                                    s.seatNumber,
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
                              seatNumber: s.seatNumber,
                              tableId: s.tableId,
                            })
                          }
                        >
                          <IconDeselect size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </ActionIcon.Group>
                  </div>
                  <TextInput
                    className="col-span-2"
                    size="xs"
                    placeholder="Firma"
                    value={s.occupant?.company || ""}
                    onChange={(e) =>
                      handleInputChange(
                        s.tableId!,
                        s.seatNumber,
                        "company",
                        e.target.value
                      )
                    }
                    rightSection={<IconBuildingFactory2 size={16} />}
                  />
                  <TextInput
                    size="xs"
                    placeholder="Vorname"
                    value={s.occupant?.firstName || ""}
                    onChange={(e) =>
                      handleInputChange(
                        s.tableId!,
                        s.seatNumber,
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
                        s.seatNumber,
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
  );
}