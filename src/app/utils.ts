import { Game } from "./interfaces";

export const isAdminPage = (path: string) => {
  return path.includes("/admin");
};

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

export const getNextGame = (games: Game[]) => {
  const now = new Date();

  const upcomingGames = games
    .filter((game) => new Date(game.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return upcomingGames.length > 0 ? upcomingGames[0].day.toString() : "0";
};

export const getUtilization = (game: Game, id: number) => {
  const u = game.lounges!.find((l) => l.id === id)?.utilization;
  return u ? u : "1";
};
