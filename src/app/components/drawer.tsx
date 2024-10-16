"use client";
import { Button, Drawer, Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { Game } from "../interfaces";
import { DatePickerInput } from "@mantine/dates";
import { IconDeviceFloppy } from "@tabler/icons-react";

export default function GameDrawer({
  game,
  opened,
  close,
}: {
  game?: Game;
  opened: boolean;
  close: () => void;
}) {
  const [id, setId] = useState<string>(game ? game.id : "1");
  const [opponent, setOpponent] = useState<string>(game ? game.opponent : "");
  const [date, setDate] = useState<Date | null>(
    game ? new Date(game.date) : new Date()
  );
  const [utilizationLounge0, setUtilizationLounge0] = useState<string | null>(
    game ? game.lounges[0].utilization : "1"
  );
  const [utilizationLounge1, setUtilizationLounge1] = useState<string | null>(
    game ? game.lounges[1].utilization : "1"
  );

  const utilizations = [
    { label: "Teilauslastung", value: "1" },
    { label: "Vollauslastung", value: "2" },
    { label: "Maximalauslastung", value: "3" },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0 }}
      styles={{
        content: {
          backgroundColor: "#000000",
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Spiel bearbeiten</h2>
        {!game && (
          <TextInput
            label="Spieltag"
            value={id}
            onChange={(event) => setId(event.currentTarget.value)}
            data-autofocus
          />
        )}
        <TextInput
          label="Gegner"
          value={opponent}
          onChange={(event) => setOpponent(event.currentTarget.value)}
          data-autofocus
        />
        <DatePickerInput label="Datum" value={date} onChange={setDate} />
        <Select
          label="Club Lounge"
          data={utilizations}
          value={utilizationLounge0}
          onChange={setUtilizationLounge0}
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
            disabled={id.trim() === "" || opponent.trim() === ""}
            onClick={() => {
              console.log(
                JSON.stringify({
                  id: id,
                  opponent,
                  date: date?.toISOString(),
                  lounges: [
                    { id: 0, utilization: utilizationLounge0 },
                    { id: 1, utilization: utilizationLounge1 },
                  ],
                })
              );
              close();
            }}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            Speichern
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
