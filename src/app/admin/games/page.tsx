"use client";
import GameDrawer from "@/app/components/drawer";
import GameRow from "@/app/components/game";
import Login from "@/app/components/login";
import { useSeating } from "@/app/context/seatingContext";
import { Game } from "@/app/lib/interfaces";
import { getSeasons } from "@/app/lib/utils";
import { Button, Paper, Table, Tabs } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import "dayjs/locale/de";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Header from "../../components/header";

export default function Home() {
  const { data: session, status } = useSession();
  const { season, games } = useSeating();
  const [activeTab, setActiveTab] = useState<string | null>(season.toString());
  const [opened, { open, close }] = useDisclosure(false);

  const seasons = getSeasons().reverse();

  if (status === "loading") {
    return <></>;
  }

  if (!session) {
    return <Login azure />;
  }

  return (
    <DatesProvider settings={{ locale: "de" }}>
      <div className="min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] bg-right transition-all duration-300">
        <div className="w-screen min-h-screen flex flex-col">
          <Header showNav={true} hideTabs={true} />
          <main className="p-8">
            <Paper p="lg" radius="md" shadow="xl">
              <Tabs value={activeTab} onChange={setActiveTab}>
                <div className="flex flex-col gap-8">
                  <Tabs.List>
                    {seasons.map((s) => {
                      return (
                        <Tabs.Tab key={s.value} value={s.value}>
                          {s.label}
                        </Tabs.Tab>
                      );
                    })}
                  </Tabs.List>

                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Spieltag</Table.Th>
                        <Table.Th>Saison</Table.Th>
                        <Table.Th>Gegner</Table.Th>
                        <Table.Th>Datum</Table.Th>
                        <Table.Th>Club Lounge</Table.Th>
                        <Table.Th>Galerie</Table.Th>
                        <Table.Th>Kulmbacher Lounge</Table.Th>
                        <Table.Th></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {games
                        .filter((g) => g.year.toString() === activeTab)
                        .map((g, index) => (
                          <GameRow
                            key={`${index}-${g.year}`}
                            game={g as Game}
                          />
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
                </div>
              </Tabs>
            </Paper>
          </main>
        </div>
      </div>
      <GameDrawer opened={opened} close={close} />
    </DatesProvider>
  );
}
