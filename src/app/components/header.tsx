"use client";
import { ActionIcon, Button, Select, Tooltip } from "@mantine/core";
import { IconArmchair, IconFileExport, IconLogout } from "@tabler/icons-react";
import { SessionProvider, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSeating } from "../context/seatingContext";
import lounges from "../data/lounges.json";
import { exportTables, getLoungeStats, getOverallStats } from "../lib/utils";
import Logo from "./logo";
import Search from "./search";
import Tab from "./tabs";

export default function Header({
  showNav,
  hideTabs,
}: {
  showNav?: boolean;
  hideTabs?: boolean;
}) {
  const nav = [
    { label: "Begegnungen", href: "/admin/games/" },
    { label: "Bestuhlung", href: "/admin/seats/" },
  ];

  return (
    <SessionProvider>
      <header className="sticky top-0 z-50 flex flex-col backdrop-blur-md bg-black/60 shadow-md shadow-black/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 py-8">
          <div className="flex items-center gap-8">
            <Logo transparent />
            {showNav && (
              <div className="flex gap-8">
                {nav.map((n, index) => (
                  <NavItem key={index} href={n.href}>
                    {n.label}
                  </NavItem>
                ))}
              </div>
            )}
          </div>
          <Actions showNav={showNav} hideTabs={hideTabs} />
        </div>
        {!hideTabs && <Tabs />}
      </header>
    </SessionProvider>
  );
}

function Actions({
  showNav,
  hideTabs,
}: {
  showNav?: boolean;
  hideTabs?: boolean;
}) {
  const { selectedSeats, tables, games, selectedGame, setSelectedGame } =
    useSeating();

  return (
    <div className="flex gap-2 scale-75 md:scale-100">
      <ActionIcon
        aria-label="Ausloggen"
        variant="transparent"
        color="dark"
        size="input-sm"
        onClick={() => signOut()}
      >
        <IconLogout size={16} />
      </ActionIcon>
      {!hideTabs && (
        <>
          <Select
            data={games.map((g) => {
              return {
                label:
                  g.day === 0
                    ? g.opponent
                    : `Spieltag ${g.day} – ${g.opponent}`,
                value: g.day.toString(),
              };
            })}
            value={selectedGame}
            onChange={setSelectedGame}
            withCheckIcon={false}
            allowDeselect={false}
            w={260}
            disabled={selectedSeats.length > 0}
          />
          <Search />
          {showNav && (
            <Button
              variant="light"
              color="red"
              leftSection={<IconFileExport size={16} />}
              onClick={() => exportTables(tables, selectedGame)}
            >
              Export
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function Tabs() {
  const { tables, lounge, setLounge } = useSeating();
  const statsLounge = getLoungeStats(tables, lounge);
  const statsOverall = getOverallStats(tables);

  return (
    <div className="flex justify-between -mt-2 px-8 bg-black/10">
      <div className="flex gap-8">
        {lounges.map((l) => (
          <Tab
            key={l.id}
            label={l.name}
            active={lounge === l.id}
            onClick={() => setLounge(l.id)}
          />
        ))}
      </div>
      <div className="hidden md:flex">
        <Tooltip
          label={`Auslastung: ${statsOverall.percentage}%`}
          color="dark"
          position="left"
          withArrow
        >
          <div className="flex items-center gap-2 py-2 cursor-default">
            <IconArmchair size={16} />
            <p
              style={{
                fontSize:
                  "var(--input-fz, var(--input-fz, var(--mantine-font-size-sm)))",
              }}
            >
              {statsLounge.occupiedSeats} / {statsLounge.maxCapacity}
            </p>
            <p
              className="muted"
              style={{
                fontSize:
                  "var(--input-fz, var(--input-fz, var(--mantine-font-size-xs)))",
              }}
            >
              {statsOverall.occupiedSeats} / {statsOverall.maxCapacity}
            </p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

function NavItem({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const path = usePathname();
  const active =
    (path.includes(href) && href !== "/") || (path === "/" && href === "/");

  return (
    <Link href={href}>
      <p className={`${active ? "text-white" : "link"} ${className}`}>
        {children}
      </p>
    </Link>
  );
}
