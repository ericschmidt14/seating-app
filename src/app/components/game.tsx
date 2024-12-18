"use client";
import { ActionIcon, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { format } from "date-fns";
import { utilization } from "../data/values";
import { Game } from "../lib/interfaces";
import { getSeason, getUtilization } from "../lib/utils";
import GameDrawer from "./drawer";

export default function GameRow({ game }: { game: Game }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table.Tr>
        <Table.Td>{game.day}</Table.Td>
        <Table.Td>{getSeason(game.year).label}</Table.Td>
        <Table.Td>{game.opponent}</Table.Td>
        <Table.Td>
          {game.date && format(new Date(game.date), "dd.MM.yyyy")}
        </Table.Td>
        <Table.Td>{utilization[getUtilization(game, 1)]}</Table.Td>
        <Table.Td>{utilization[getUtilization(game, 3)]}</Table.Td>
        <Table.Td>{utilization[getUtilization(game, 2)]}</Table.Td>
        <Table.Td className="text-right">
          <ActionIcon variant="light" onClick={open} disabled={game.day === 0}>
            <IconPencil size={16} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>

      <GameDrawer game={game} opened={opened} close={close} />
    </>
  );
}
