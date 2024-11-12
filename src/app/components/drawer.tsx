"use client";
import { Button, Drawer, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconDeviceFloppy } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import { useSeating } from "../context/seatingContext";
import { Game } from "../interfaces";
import { getCurrentSeason, getSeasons, getUtilization } from "../utils";

export default function GameDrawer({
  game,
  opened,
  close,
}: {
  game?: Game;
  opened: boolean;
  close: () => void;
}) {
  const { loadData } = useSeating();
  const [day, setDay] = useState<string>(
    game && game.day ? game.day.toString() : "1"
  );
  const [year, setYear] = useState<string | null>(
    game?.year ? game.year.toString() : getCurrentSeason().toString()
  );
  const [opponent, setOpponent] = useState<string>(game ? game.opponent : "");
  const [date, setDate] = useState<Date | null>(
    game ? new Date(game.date) : new Date()
  );
  const [utilizationLounge0, setUtilizationLounge0] = useState<string | null>(
    game ? getUtilization(game, 1) : "1"
  );
  const [utilizationLounge1, setUtilizationLounge1] = useState<string | null>(
    game ? getUtilization(game, 2) : "1"
  );
  const [utilizationLounge2, setUtilizationLounge2] = useState<string | null>(
    game ? getUtilization(game, 3) : "1"
  );

  const utilizations = [
    { label: "Teilauslastung", value: "1" },
    { label: "Vollauslastung", value: "2" },
  ];

  const handleSubmit = () => {
    fetch(`/api/game`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        day,
        year,
        opponent,
        date: dayjs(date).format("YYYY-MM-DDT[00:00:00]"),
        lounges: [
          { id: 1, utilization: utilizationLounge0 },
          { id: 2, utilization: utilizationLounge1 },
          { id: 3, utilization: utilizationLounge2 },
        ],
      }),
    })
      .then((res) => res.text())
      .then(() => {
        loadData();
        close();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0 }}
      styles={{
        content: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Spiel {game ? "bearbeiten" : "hinzufügen"}</h2>
        {!game && (
          <>
            <TextInput
              label="Spieltag"
              value={day}
              onChange={(event) => setDay(event.currentTarget.value)}
              error={
                day === "0" && "Spieltag 0 ist reserviert für Saisontickets"
              }
              data-autofocus
            />
            <Select
              label="Saison"
              data={getSeasons().map((s) => {
                return { label: s.label, value: s.value.toString() };
              })}
              value={year}
              onChange={setYear}
              allowDeselect={false}
              checkIconPosition="right"
            />
          </>
        )}
        <TextInput
          label="Gegner"
          value={opponent}
          onChange={(event) => setOpponent(event.currentTarget.value)}
          data-autofocus
        />
        <DatePickerInput
          label="Datum"
          value={date}
          onChange={setDate}
          rightSection={<IconCalendar size={16} />}
        />
        <Select
          label="Club Lounge"
          data={utilizations}
          value={utilizationLounge0}
          onChange={setUtilizationLounge0}
          allowDeselect={false}
          checkIconPosition="right"
        />
        <Select
          label="Galerie"
          data={utilizations}
          value={utilizationLounge2}
          onChange={setUtilizationLounge2}
          allowDeselect={false}
          checkIconPosition="right"
        />
        <Select
          label="Kulmbacher Lounge"
          data={utilizations}
          value={utilizationLounge1}
          onChange={setUtilizationLounge1}
          allowDeselect={false}
          checkIconPosition="right"
        />
        <div className="flex justify-between gap-2">
          <Button variant="transparent" color="dark" onClick={close}>
            Abbrechen
          </Button>
          <Button
            variant="light"
            disabled={
              day.trim() === "" || day.trim() === "0" || opponent.trim() === ""
            }
            onClick={handleSubmit}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            Speichern
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
