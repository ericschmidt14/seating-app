"use client";
import GameDrawer from "@/app/components/drawer";
import GameRow from "@/app/components/game";
import { useSeating } from "@/app/context/seatingContext";
import { Game } from "@/app/interfaces";
import { Button, Paper, Table } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import "dayjs/locale/de";
import Header from "../../components/header";

export default function Home() {
  const { games } = useSeating();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <DatesProvider settings={{ locale: "de" }}>
      <div className="min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] bg-right transition-all duration-300">
        <div className="w-screen min-h-screen flex flex-col">
          <Header showNav={true} hideTabs={true} />
          <main className="p-8">
            <Paper
              p="lg"
              radius="md"
              shadow="xl"
              className="flex flex-col gap-4"
            >
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Spieltag</Table.Th>
                    <Table.Th>Saison</Table.Th>
                    <Table.Th>Gegner</Table.Th>
                    <Table.Th>Datum</Table.Th>
                    <Table.Th>Club Lounge</Table.Th>
                    <Table.Th>Kulmbacher Lounge</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {games.map((g, index) => (
                    <GameRow key={index} game={g as Game} />
                  ))}
                </Table.Tbody>
              </Table>
              <Button
                variant="light"
                color="white"
                leftSection={<IconCirclePlus size={16} />}
                fullWidth
                onClick={open}
              >
                Weiteres Spiel hinzufügen
              </Button>
            </Paper>
          </main>
        </div>
      </div>
      <GameDrawer opened={opened} close={close} />
    </DatesProvider>
  );
}
