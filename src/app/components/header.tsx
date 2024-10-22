"use client";
import { Select } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSeating } from "../context/seatingContext";
import games from "../games.json";
import lounges from "../lounges.json";
import Tab from "./tabs";

export default function Header({
  showNav,
  hideTabs,
}: {
  showNav?: boolean;
  hideTabs?: boolean;
}) {
  const { game, setGame, lounge, setLounge } = useSeating();

  const nav = [
    { label: "Begegnungen", href: "/admin/games/" },
    { label: "Bestuhlung", href: "/admin/seats/" },
  ];

  return (
    <header className="flex flex-col gap-4 bg-black/50 shadow-md shadow-black/10">
      <div
        className={`flex justify-between items-center px-8 ${
          hideTabs ? "py-8" : "pt-8"
        }`}
      >
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" width={48} height={48} alt="1. FCN Logo" />
          <div className="flex items-center gap-8">
            <p className="text-4xl">
              CLUB<b>SEATING</b>
            </p>
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
        </div>
        <Select
          data={games.map((g) => {
            return {
              label:
                +g.id > 0 ? `Spieltag ${g.id} – ${g.opponent}` : g.opponent,
              value: g.id,
            };
          })}
          value={game}
          onChange={setGame}
          withCheckIcon={false}
          allowDeselect={false}
          variant="light"
          w={260}
        />
      </div>
      {!hideTabs && (
        <div className="flex gap-8 px-8">
          {lounges.map((l) => (
            <Tab
              key={l.id}
              label={l.name}
              active={lounge === l.id}
              onClick={() => setLounge(l.id)}
            />
          ))}
        </div>
      )}
    </header>
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
