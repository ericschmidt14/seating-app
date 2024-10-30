"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import games from "../games.json";
import { Game, Seat, Table } from "../interfaces";
import { getNextGame } from "../utils";

interface SeatingContextType {
  game: string | null;
  setGame: Dispatch<SetStateAction<string | null>>;
  lounge: string;
  setLounge: Dispatch<SetStateAction<string>>;
  tables: Table[];
  setTables: Dispatch<SetStateAction<Table[]>>;
  selectedSeats: Seat[];
  setSelectedSeats: Dispatch<SetStateAction<Seat[]>>;
  handleSeatClick: (seat: Seat, scroll?: boolean) => void;
  handleTableClick: (tableId: string, capacity: number) => void;
}

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<string | null>(getNextGame(games as Game[]));
  const [lounge, setLounge] = useState("1");
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat, scroll?: boolean) => {
    setSelectedSeats((prevSelected: Seat[]) => {
      const isAlreadySelected = prevSelected.some(
        (s) => s.tableId === seat.tableId && s.id === seat.id
      );
      if (isAlreadySelected) {
        return prevSelected.filter(
          (s) => !(s.tableId === seat.tableId && s.id === seat.id)
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

  const handleTableClick = (tableId: string, capacity: number) => {
    const tableSeatIds = Array.from({ length: capacity }, (_, i) =>
      (i + 1).toString()
    );

    const table = tables.find((t) => t.id === tableId);
    const occupiedSeats = table ? table.seats : [];

    const allSeatIds = new Set([
      ...tableSeatIds,
      ...occupiedSeats.map((seat) => seat.id),
    ]);

    const areAllSeatsSelected = Array.from(allSeatIds).every((seatId) =>
      selectedSeats.some((s) => s.id === seatId && s.tableId === tableId)
    );

    if (areAllSeatsSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.tableId !== tableId));
    } else {
      setSelectedSeats((prev) => {
        const seatsToSelect = Array.from(allSeatIds).map((seatId) => {
          const occupiedSeat = occupiedSeats.find((seat) => seat.id === seatId);

          return {
            id: seatId,
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
              !prev.some((s) => s.id === seat.id && s.tableId === tableId)
          ),
        ];
      });
    }
  };

  return (
    <SeatingContext.Provider
      value={{
        game,
        setGame,
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
