"use client";
import { ActionIcon, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { format } from "date-fns";
import { Game } from "../interfaces";
import { getSeason, getUtilization } from "../utils";
import { utilization } from "../values";
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
        <Table.Td>{utilization[getUtilization(game, 2)]}</Table.Td>
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
