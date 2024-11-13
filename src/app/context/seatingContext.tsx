"use client";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { App, Game, Seat, Table } from "../interfaces";
import { getCurrentSeason, getSelectedGameDate } from "../utils";

interface SeatingContextType {
  loadData: (date?: string) => void;
  season: number;
  setSeason: Dispatch<SetStateAction<number>>;
  games: Game[];
  setGames: Dispatch<SetStateAction<Game[]>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  selectedGame: string | null;
  setSelectedGame: Dispatch<SetStateAction<string | null>>;
  lounge: number;
  setLounge: Dispatch<SetStateAction<number>>;
  tables: Table[];
  setTables: Dispatch<SetStateAction<Table[]>>;
  selectedSeats: Seat[];
  setSelectedSeats: Dispatch<SetStateAction<Seat[]>>;
  handleSeatClick: (seat: Seat, scroll?: boolean) => void;
  handleTableClick: (tableId: number, capacity: number) => void;
}

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [season, setSeason] = useState<number>(getCurrentSeason());
  const [game, setGame] = useState<Game>({
    year: getCurrentSeason(),
    day: 1,
    opponent: "Loading",
    date: "",
  });
  const [selectedGame, setSelectedGame] = useState<string | null>("");
  const [games, setGames] = useState<Game[]>([]);
  const [lounge, setLounge] = useState(1);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadData(getSelectedGameDate(games, selectedGame));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  const loadData = (date?: string) => {
    fetch(`/api/data${date ? `/${date}` : ""}`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res: App) => {
        setGame(res.game[0]);
        setSelectedGame(res.game[0].day.toString());
        setTables(res.tables);
        setGames(res.games.sort((a, b) => a.day - b.day));
      })
      .catch((error) => console.error(error));
  };

  const handleSeatClick = (seat: Seat, scroll?: boolean) => {
    setSelectedSeats((prevSelected: Seat[]) => {
      const isAlreadySelected = prevSelected.some(
        (s) => s.tableId === seat.tableId && s.seatNumber === seat.seatNumber
      );
      if (isAlreadySelected) {
        return prevSelected.filter(
          (s) =>
            !(s.tableId === seat.tableId && s.seatNumber === seat.seatNumber)
        );
      } else {
        const occupant = seat.occupant
          ? seat.occupant
          : { firstName: "", lastName: "", company: "" };
        seat.occupant = occupant;
        return [...prevSelected, seat];
      }
    });

    if (scroll) {
      const seatElement = document.getElementById(`table-${seat.tableId}`);
      if (seatElement) {
        seatElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  };

  const handleTableClick = (tableId: number, capacity: number) => {
    const tableSeatIds = Array.from({ length: capacity }, (_, i) => i + 1);
    const table = tables.find((t) => t.id === tableId);
    const occupiedSeats = table && table.seats !== null ? table.seats : [];
    const allSeatIds = new Set([
      ...tableSeatIds,
      ...occupiedSeats.map((seat) => seat.seatNumber),
    ]);
    const areAllSeatsSelected = Array.from(allSeatIds).every((seatId) =>
      selectedSeats.some(
        (s) => s.seatNumber === seatId && s.tableId === tableId
      )
    );
    if (areAllSeatsSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.tableId !== tableId));
    } else {
      setSelectedSeats((prev) => {
        const seatsToSelect = Array.from(allSeatIds).map((seatNumber) => {
          const occupiedSeat = occupiedSeats.find(
            (seat) => seat.seatNumber === seatNumber
          );
          return {
            seatNumber,
            tableId,
            occupant: occupiedSeat
              ? occupiedSeat.occupant
              : { firstName: "", lastName: "", company: "" },
          };
        });
        return [
          ...prev,
          ...seatsToSelect.filter(
            (seat) =>
              !prev.some(
                (s) => s.seatNumber === seat.seatNumber && s.tableId === tableId
              )
          ),
        ];
      });
    }
  };

  return (
    <SeatingContext.Provider
      value={{
        loadData,
        season,
        setSeason,
        games,
        setGames,
        game,
        setGame,
        selectedGame,
        setSelectedGame,
        lounge,
        setLounge,
        tables,
        setTables,
        selectedSeats,
        setSelectedSeats,
        handleSeatClick,
        handleTableClick,
      }}
    >
      {children}
    </SeatingContext.Provider>
  );
};

export const useSeating = (): SeatingContextType => {
  const context = useContext(SeatingContext);
  if (!context) {
    throw new Error("useSeating must be used within an SeatingContext");
  }
  return context;
};
