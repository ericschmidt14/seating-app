"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Seat, Table } from "../interfaces";

interface SeatingContextType {
  lounge: string;
  setLounge: Dispatch<SetStateAction<string>>;
  tables: Table[];
  setTables: Dispatch<SetStateAction<Table[]>>;
  selectedSeats: Seat[];
  setSelectedSeats: Dispatch<SetStateAction<Seat[]>>;
  handleSeatClick: (seat: Seat, scroll?: boolean) => void;
}

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider = ({ children }: { children: ReactNode }) => {
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
          (s) => s.tableId !== seat.tableId || s.id !== seat.id
        );
      } else {
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

  return (
    <SeatingContext.Provider
      value={{
        lounge,
        setLounge,
        tables,
        setTables,
        selectedSeats,
        setSelectedSeats,
        handleSeatClick,
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
