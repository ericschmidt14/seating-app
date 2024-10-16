"use client";
import { ActionIcon, Table } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { Game } from "../interfaces";
import { format } from "date-fns";
import { utilization } from "../values";
import { useDisclosure } from "@mantine/hooks";
import GameDrawer from "./drawer";

export default function GameRow({ game }: { game: Game }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table.Tr>
        <Table.Td>{game.id}</Table.Td>
        <Table.Td>{game.opponent}</Table.Td>
        <Table.Td>{format(new Date(game.date), "dd.MM.yyyy")}</Table.Td>
        <Table.Td>{utilization[game.lounges[0].utilization]}</Table.Td>
        <Table.Td>{utilization[game.lounges[1].utilization]}</Table.Td>
        <Table.Td className="text-right">
          <ActionIcon variant="light" onClick={open}>
            <IconPencil size={16} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>

      <GameDrawer game={game} opened={opened} close={close} />
    </>
  );
}
