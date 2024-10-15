"use client";
import { ActionIcon, Select, Table, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons-react";
import { Game } from "../interfaces";
import { useState } from "react";
import { format } from "date-fns";
import { utilization } from "../values";

export default function GameRow({ game }: { game: Game }) {
  const [edit, setEdit] = useState(false);

  return (
    <Table.Tr>
      <Table.Td>{game.id}</Table.Td>
      {edit ? (
        <>
          <Table.Td>
            <TextInput defaultValue={game.opponent} />
          </Table.Td>
          <Table.Td>
            <DatePickerInput defaultValue={new Date(game.date)} />
          </Table.Td>
          <Table.Td>
            <Select
              data={[
                { label: "Teilauslastung", value: "1" },
                { label: "Vollauslastung", value: "2" },
                { label: "Maximalauslastung", value: "3" },
              ]}
              defaultValue={utilization[game.lounges[0].utilization]}
              allowDeselect={false}
              checkIconPosition="right"
            />
          </Table.Td>
          <Table.Td>
            <Select
              data={[
                { label: "Teilauslastung", value: "1" },
                { label: "Vollauslastung", value: "2" },
                { label: "Maximalauslastung", value: "3" },
              ]}
              defaultValue={utilization[game.lounges[1].utilization]}
              allowDeselect={false}
              checkIconPosition="right"
            />
          </Table.Td>
          <Table.Td className="text-right">
            <ActionIcon.Group>
              <ActionIcon
                variant="light"
                color="white"
                onClick={() => setEdit(false)}
              >
                <IconX size={16} />
              </ActionIcon>
              <ActionIcon variant="light" onClick={() => setEdit(false)}>
                <IconDeviceFloppy size={16} />
              </ActionIcon>
            </ActionIcon.Group>
          </Table.Td>
        </>
      ) : (
        <>
          <Table.Td>{game.opponent}</Table.Td>
          <Table.Td>{format(new Date(game.date), "dd.MM.yyyy")}</Table.Td>
          <Table.Td>{utilization[game.lounges[0].utilization]}</Table.Td>
          <Table.Td>{utilization[game.lounges[1].utilization]}</Table.Td>
          <Table.Td className="text-right">
            <ActionIcon variant="light" onClick={() => setEdit(true)}>
              <IconPencil size={16} />
            </ActionIcon>
          </Table.Td>
        </>
      )}
    </Table.Tr>
  );
}
