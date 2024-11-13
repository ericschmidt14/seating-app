"use client";
import { ActionIcon, Select } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { SessionProvider, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSeating } from "../context/seatingContext";
import { useUser } from "../context/userContext";
import lounges from "../data/lounges.json";
import { isAdminPage } from "../utils";
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
        <div className="flex justify-between items-center px-8 py-8">
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
          <Actions hideTabs={hideTabs} />
        </div>
        {!hideTabs && <Tabs />}
      </header>
    </SessionProvider>
  );
}

function Actions({ hideTabs }: { hideTabs?: boolean }) {
  const { games, selectedGame, setSelectedGame } = useSeating();
  const { handleLogout } = useUser();
  const path = usePathname();

  return (
    <div className="flex gap-2">
      <ActionIcon
        aria-label="Ausloggen"
        variant="transparent"
        color="dark"
        size="input-sm"
        onClick={() => (isAdminPage(path) ? signOut() : handleLogout())}
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
          />
          <Search />
        </>
      )}
    </div>
  );
}

function Tabs() {
  const { lounge, setLounge } = useSeating();

  return (
    <div className="flex gap-8 px-8 -mt-2">
      {lounges.map((l) => (
        <Tab
          key={l.id}
          label={l.name}
          active={lounge === l.id}
          onClick={() => setLounge(l.id)}
        />
      ))}
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
