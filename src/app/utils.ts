import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Game, Table } from "./interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAdminPage = (path: string) => {
  return path.includes("/admin");
};

export const getUniqueArray = <T>(array: T[]): T[] =>
  Array.from(new Set(array)).sort();

export const getSeasons = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const startYear = 2024;
  const seasons: { value: number; label: string }[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    const seasonStart = new Date(year, 6, 1);
    const seasonEnd = new Date(year + 1, 4, 31);

    if ((today >= seasonStart && today <= seasonEnd) || today > seasonEnd) {
      seasons.push({
        value: year,
        label: `Saison ${year}/${year + 1 - 2000}`,
      });
    }
  }

  return seasons;
};

export const getCurrentSeason = () => {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let seasonStartYear: number;
  if (currentMonth >= 6) {
    seasonStartYear = currentYear;
  } else {
    seasonStartYear = currentYear - 1;
  }

  return seasonStartYear;
};

export const getSeason = (year: number) => {
  return {
    value: year,
    label: `Saison ${year}/${year + 1 - 2000}`,
  };
};

export const getUtilization = (game: Game, id: number) => {
  const u = game.lounges!.find((l) => l.loungeId === id)?.utilization;
  return u ? u.toString() : "";
};

export const getSelectedGameDate = (
  games: Game[],
  selectedGame: string | null
) => {
  const game = games.find((g) => g.day === +selectedGame!)?.date;
  return game?.split("T")[0];
};

export const getLoungeStats = (
  tables: Table[],
  loungeId: number
): { percentage: number; maxCapacity: number; occupiedSeats: number } => {
  const loungeTables = tables.filter((t) => t.loungeId === loungeId);

  const maxCapacity = loungeTables.reduce(
    (sum, t) => sum + (t.capacity || 0),
    0
  );

  const occupiedSeats = loungeTables.reduce((sum, t) => {
    const occupied = t.seats?.filter((s) => s.occupant != null).length || 0;
    return sum + occupied;
  }, 0);

  const p = maxCapacity > 0 ? (occupiedSeats / maxCapacity) * 100 : 0;
  const percentage = parseFloat(p.toFixed(1));

  return { percentage, maxCapacity, occupiedSeats };
};

export const getOverallStats = (
  tables: Table[]
): { percentage: number; maxCapacity: number; occupiedSeats: number } => {
  const maxCapacity = tables.reduce(
    (sum, table) => sum + (table.capacity || 0),
    0
  );

  const occupiedSeats = tables.reduce((sum, table) => {
    const occupied =
      table.seats?.filter((seat) => seat.occupant != null).length || 0;
    return sum + occupied;
  }, 0);

  const p = maxCapacity > 0 ? (occupiedSeats / maxCapacity) * 100 : 0;
  const percentage = parseFloat(p.toFixed(1));

  return { percentage, maxCapacity, occupiedSeats };
};
